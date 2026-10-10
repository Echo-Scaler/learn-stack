---
title: "04. Top Client Tasks And Troubleshooting"
description: "ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော External API Integration လုပ်ငန်းစဉ်များနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်းပုံမ"
---

## 04. Top Client Tasks & Troubleshooting (လက်တွေ့ ပြင်ဆင်နည်းများ)

ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော External API Integration လုပ်ငန်းစဉ်များနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်းပုံများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: Next Engine (ネクストエンジン) Multi-Channel Inventory Real-time Sync

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「EC-CUBE で注文が確定した際、ネクストエンジン（Next Engine）の在庫連携APIを呼び出し、複数モール（Amazon/楽天）との在庫数を即時連動させたい。外部APIが落ちていても注文自体は成功させ、再送キューに保存してください。」
> (EC-CUBE တွင် အော်ဒါအတည်ပြုပြီးပါက Next Engine စတော့ API ကိုလှမ်းခေါ်ပြီး Amazon/Rakuten တို့နှင့် စတော့အရေအတွက် ညှိပေးပါ။ အကယ်၍ ပြင်ပ API ဒေါင်းနေပါကလည်း အော်ဒါကို ပျက်ကျမသွားစေဘဲ နောက်မှ ပြန်လည်ပို့ဆောင်နိုင်ရန် Queue Table ထဲတွင် သိမ်းထားပေးပါ။)

### 🛠️ အဆင့်ဆင့် ဖြေရှင်းနည်း:

#### ၁။ Event Subscriber ဖြင့် အော်ဒါပြီးဆုံးမှုကို ဖမ်းယူခြင်း (`PurchaseFlow` Event):
```php
namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Customize\Service\NextEngineSyncService;

class OrderCompleteInventorySyncSubscriber implements EventSubscriberInterface
{
    private NextEngineSyncService $syncService;

    public function __construct(NextEngineSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EccubeEvents::MAIL_ORDER => 'onOrderComplete',
        ];
    }

    public function onOrderComplete(EventArgs $event): void
    {
        $order = $event->getArgument('Order');
        // Background Queue ထဲသို့ ထည့်သွင်းခြင်း သို့မဟုတ် API သို့ တိုက်ရိုက် လှမ်းပို့ခြင်း
        $this->syncService->syncOrderStock($order);
    }
}
```

#### ၂။ Resilient Sync Service ရေးသားခြင်း (Fail ဖြစ်ပါက Queue ထဲ သိမ်းဆည်းခြင်း):
```php
namespace Customize\Service;

use Eccube\Entity\Order;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Customize\Entity\InventorySyncQueue;

class NextEngineSyncService
{
    private HttpClientInterface $httpClient;
    private EntityManagerInterface $entityManager;
    private LoggerInterface $logger;
    private string $accessToken;

    public function __construct(
        HttpClientInterface $httpClient,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
        string $accessToken
    ) {
        $this->httpClient = $httpClient;
        $this->entityManager = $entityManager;
        $this->logger = $logger;
        $this->accessToken = $accessToken;
    }

    public function syncOrderStock(Order $order): void
    {
        foreach ($order->getOrderItems() as $item) {
            $productClass = $item->getProductClass();
            if (!$productClass || !$productClass->getCode()) {
                continue;
            }

            $productCode = $productClass->getCode();
            $quantity = $item->getQuantity();

            try {
                // Next Engine Stock API Endpoint
                $response = $this->httpClient->request('POST', 'https://api.next-engine.org/api_v1_master_goods/update', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->accessToken,
                    ],
                    'json' => [
                        'goods_id'    => $productCode,
                        'stock_delta' => -$quantity, // ရောင်းထွက်သွားသည့် ပမာဏ နှုတ်ပယ်ခြင်း
                    ],
                    'timeout' => 3.0, // ၃ စက္ကန့်သာ စောင့်မည်
                ]);

                if ($response->getStatusCode() === 200) {
                    $this->logger->info("NextEngine Stock Synced: {$productCode} (-{$quantity})");
                } else {
                    throw new \RuntimeException("NextEngine API returned status " . $response->getStatusCode());
                }
            } catch (\Exception $e) {
                // အကယ်၍ ပြင်ပ API ဒေါင်းနေပါက အော်ဒါကို မပျက်ကျစေဘဲ Queue ထဲ သိမ်းဆည်းခြင်း
                $this->logger->error("NextEngine API Failed. Queuing for retry. Error: " . $e->getMessage());
                $this->saveToRetryQueue($productCode, -$quantity);
            }
        }
    }

    private function saveToRetryQueue(string $code, int $delta): void
    {
        $queue = new InventorySyncQueue();
        $queue->setProductCode($code);
        $queue->setQuantityDelta($delta);
        $queue->setStatus('PENDING');
        $queue->setCreatedAt(new \DateTime());

        $this->entityManager->persist($queue);
        $this->entityManager->flush();
    }
}
```

---

## 📌 Client Task 2: LINE Login & LINE Order Notification (LINE အလိုအလျောက် အသိပေးခြင်း)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「購入完了時にメールだけでなく、購入者のLINE公式アカウント宛てに注文完了メッセージをPush通知で自動送信したい。」
> (ဝယ်ယူမှု ပြီးဆုံးသည့်အခါ အီးမေးလ် သာမက ဝယ်ယူသူ၏ LINE ထံသို့ အော်ဒါအတည်ပြု Message ကို LINE Push Notification ဖြင့် အလိုအလျောက် ပေးပို့ပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

#### ၁။ Customer Entity တွင် `line_user_id` သိမ်းဆည်းထားရန် ပြင်ဆင်ခြင်း
- Customer သည် LINE Login ဝင်ရောက်ထားချိန်တွင် ရရှိလာသော `U1234567890abcdef...` ကို Customer Entity တွင် သိမ်းထားသည်။

#### ၂။ LINE Messaging API ဖြင့် Push Message ပို့ဆောင်ခြင်း:
```php
namespace Customize\Service;

use Eccube\Entity\Order;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

class LineNotificationService
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $channelAccessToken;

    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger, string $channelAccessToken)
    {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->channelAccessToken = $channelAccessToken;
    }

    public function sendOrderNotice(Order $order): bool
    {
        $customer = $order->getCustomer();
        if (!$customer || empty($customer->getLineUserId())) {
            return false; // LINE ချိတ်ဆက်မထားသော Customer ဖြစ်ပါက ကျော်သွားမည်
        }

        $lineUserId = $customer->getLineUserId();
        $messageText = sprintf(
            "【ご注文ありがとうございます】\n注文番号: %s\n合計金額: ¥%s\n\n発送準備が整い次第、追跡番号をご連絡いたします。",
            $order->getOrderNo(),
            number_format($order->getPaymentTotal())
        );

        try {
            $response = $this->httpClient->request('POST', 'https://api.line.me/v2/bot/message/push', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->channelAccessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'to'       => $lineUserId,
                    'messages' => [
                        [
                            'type' => 'text',
                            'text' => $messageText,
                        ]
                    ]
                ],
                'timeout' => 4.0,
            ]);

            return $response->getStatusCode() === 200;
        } catch (\Exception $e) {
            $this->logger->error("LINE Push Notification Failed: " . $e->getMessage());
            return false;
        }
    }
}
```

---

## 📌 Client Task 3: Automatic Accounting Sync to freee API (freee 自動仕訳)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「入金済み（ORDER_PRE_END）になった注文の売上を、クラウド会計ソフト freee に自動で仕訳登録（Deals API）してください。軽減税率8%と標準税率10%、送料を正確に分けて登録する必要があります。」
> (ငွေပေးချေမှု အတည်ပြုပြီးသော အော်ဒါများ၏ အရောင်းစာရင်းကို Cloud စာရင်းကိုင်ဆော့ဖ်ဝဲ freee သို့ အလိုအလျောက် စာရင်းသွင်းပေးပါ။ ကုန်စည်အခွန် 8%၊ 10% နှင့် ပို့ဆောင်ခများကို ခွဲခြားစာရင်းသွင်းရမည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

#### freee Deals API (`/api/1/deals`) Payload တည်ဆောက်ခြင်း:
```php
namespace Customize\Service;

use Eccube\Entity\Order;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class FreeeAccountingService
{
    private HttpClientInterface $httpClient;
    private string $companyId;

    public function syncPaidOrder(Order $order, string $accessToken): array
    {
        $details = [];

        // ၁။ ပစ္စည်းများအလိုက် သက်ဆိုင်ရာ အခွန်နှုန်းထားဖြင့် စာရင်းခွဲခြင်း
        foreach ($order->getOrderItems() as $item) {
            $taxRate = $item->getTaxRate(); // 10% or 8%
            $taxCode = ($taxRate == 8) ? 31 : 21; // freee tax_code mapping

            $details[] = [
                'tax_code'     => $taxCode,
                'account_item_id' => 101, // 売上高 (Sales Revenue Account ID)
                'amount'       => (int) $item->getPriceIncTax(),
                'description'  => $item->getProductName(),
            ];
        }

        // ၂။ ပို့ဆောင်ခ ထည့်သွင်းခြင်း
        if ($order->getDeliveryFeeTotal() > 0) {
            $details[] = [
                'tax_code'     => 21, // 10% Tax
                'account_item_id' => 105, // 運賃売上 (Shipping Revenue)
                'amount'       => (int) $order->getDeliveryFeeTotal(),
                'description'  => '送料',
            ];
        }

        // freee API သို့ ပို့ဆောင်ခြင်း
        $response = $this->httpClient->request('POST', 'https://api.freee.co.jp/api/1/deals', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'issue_date'   => $order->getOrderDate()->format('Y-m-d'),
                'type'         => 'income',
                'company_id'   => (int) $this->companyId,
                'details'      => $details,
                'payments'     => [
                    [
                        'amount' => (int) $order->getPaymentTotal(),
                        'date'   => (new \DateTime())->format('Y-m-d'),
                        'from_walletable_type' => 'walletable_account',
                        'from_walletable_id'   => 1, // Bank Account ID
                    ]
                ]
            ],
            'timeout' => 5.0,
        ]);

        return $response->toArray();
    }
}
```

---

## 📌 Client Task 4: AI Automated Product Description using OpenAI API (ChatGPT)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「EC-CUBEの管理画面（商品登録画面）に『AI自動生成』ボタンを設置し、商品名とカテゴリを入力してボタンを押すと、魅力的な商品説明文とSEOメタタグを自動で入力欄に挿入したい。」
> (Admin ပစ္စည်းစာရင်းသွင်းမျက်နှာပြင်တွင် "AI အလိုအလျောက်ရေးသားရန်" ခလုတ်တစ်ခု ထည့်ပေးပါ။ ပစ္စည်းအမည်နှင့် ကဏ္ဍရိုက်ထည့်ပြီး ခလုတ်နှိပ်လိုက်ပါက ဆွဲဆောင်မှုရှိသော ဖော်ပြချက်နှင့် SEO Meta tags များကို အလိုအလျောက် ရေးသားဖြည့်သွင်းပေးစေလိုပါသည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

#### Admin Controller (Ajax Endpoint):
```php
namespace Customize\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class AiProductHelperController
{
    private HttpClientInterface $httpClient;
    private string $openAiApiKey;

    public function __construct(HttpClientInterface $httpClient, string $openAiApiKey)
    {
        $this->httpClient = $httpClient;
        $this->openAiApiKey = $openAiApiKey;
    }

    /**
     * @Route("/%eccube_admin_route%/product/ai_generate", name="admin_product_ai_generate", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function generate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $productName = $data['name'] ?? '';
        $categoryName = $data['category'] ?? '';

        if (empty($productName)) {
            return new JsonResponse(['error' => 'Product name is required'], 400);
        }

        $systemPrompt = "あなたは日本のEコマースの優秀なマーケターです。提供された商品情報をもとに、魅力的で購買意欲をそそる商品説明文（HTML形式）とSEOメタディスクリプションを作成してください。";
        $userPrompt = "商品名: {$productName}\nカテゴリー: {$categoryName}\n\n以下のJSON形式で出力してください: {\"description\": \"...\", \"meta_description\": \"...\"}";

        try {
            $response = $this->httpClient->request('POST', 'https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->openAiApiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'model'           => 'gpt-4o-mini',
                    'response_format' => ['type' => 'json_object'],
                    'messages'        => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userPrompt],
                    ],
                    'temperature'     => 0.7,
                ],
                'timeout' => 15.0, // AI Generation အတွက် အချိန် အနည်းငယ် ပိုပေးရမည်
            ]);

            $result = $response->toArray();
            $generatedContent = json_decode($result['choices'][0]['message']['content'], true);

            return new JsonResponse([
                'success'          => true,
                'description'      => $generatedContent['description'] ?? '',
                'meta_description' => $generatedContent['meta_description'] ?? '',
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
```

---

## 📌 Client Task 5: Webhook Signature Verification (Stripe / LINE လုံခြုံရေး စစ်ဆေးခြင်း)

### 💬 ပြဿနာ (Troubleshooting Gotcha):
Hacker တစ်ဦးသည် Webhook Endpoint (`/webhook/payment`) သို့ အတုအယောင် ငွေပေးချေမှု အောင်မြင်ကြောင်း POST Request ပို့ပါက စနစ်က အလကား ပစ္စည်း ပို့ပေးမိနိုင်ပါသည်။

### 🛠️ HMAC-SHA256 ဖြင့် Signature စစ်ဆေးပြီး ကာကွယ်နည်း:
```php
namespace Customize\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WebhookController
{
    private string $webhookSecret;

    public function __construct(string $webhookSecret)
    {
        $this->webhookSecret = $webhookSecret;
    }

    /**
     * @Route("/webhook/payment", name="payment_webhook", methods={"POST"})
     */
    public function handle(Request $request): Response
    {
        $payload = $request->getContent(); // Raw body
        $signatureHeader = $request->headers->get('Stripe-Signature', '');

        // Signature ကို Secret ဖြင့် ပြန်လည်တွက်ချက် တိုက်ဆိုင်စစ်ဆေးခြင်း
        $expectedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);

        if (!hash_equals($expectedSignature, $signatureHeader)) {
            // လိမ်လည်တိုက်ခိုက်မှု ဖြစ်ပါက ချက်ချင်း ပယ်ချခြင်း
            return new Response('Invalid Signature', 400);
        }

        // စစ်မှန်သော Request ဖြစ်မှသာ အော်ဒါကို အတည်ပြုခြင်း
        $data = json_decode($payload, true);
        // ... Business Logic ...

        return new Response('OK', 200);
    }
}
```

ဤနည်းစနစ်များကို ကျွမ်းကျင်စွာ အသုံးချနိုင်ပါက ဂျပန် E-Commerce စီမံကိန်းများရှိ မည်သည့် ရှုပ်ထွေးသော ပြင်ပ API Integration တောင်းဆိုချက်များကိုမဆို လုံခြုံစိတ်ချစွာ ပြီးမြောက်အောင်မြင်နိုင်မည် ဖြစ်ပါသည်။
