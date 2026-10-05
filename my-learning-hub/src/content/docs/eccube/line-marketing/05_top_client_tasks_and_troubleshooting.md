---
title: "05. Top Client Tasks And Troubleshooting"
description: "ဂျပန် EC-CUBE Project များတွင် LINE Marketing နှင့် ပတ်သက်၍ Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော လုပ်ငန်းစဉ်များနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်း"
---

## 05. Top Client Tasks & Troubleshooting (လက်တွေ့ ပြင်ဆင်နည်းများ)

ဂျပန် EC-CUBE Project များတွင် LINE Marketing နှင့် ပတ်သက်၍ Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော လုပ်ငန်းစဉ်များနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်းပုံများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: LINE 友だち追加時 (Follow Webhook) တွင် 500 ယန်း ကူပွန် ချက်ချင်းပေးပို့ခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「LINE公式アカウントを友だち追加（フォロー）してくれたユーザーに対して、Webhookを受信して即座に『初回限定500円OFFクーポン』を自動返信してください。返信には無料枠の replyToken を利用してください。」
> (LINE Official Account ကို Add Friend ပြုလုပ်လိုက်သော အသုံးပြုသူများထံသို့ Webhook လက်ခံပြီး ၅၀၀ ယန်း လျှော့ဈေးကူပွန်ကို ချက်ချင်း အလိုအလျောက် ပြန်ကြားပေးပါ။ ကုန်ကျစရိတ် သက်သာစေရန် အခမဲ့ replyToken ကို အသုံးပြုပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

#### Webhook Controller (`/line/webhook`):
```php
namespace Customize\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

class LineWebhookController
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $channelSecret;
    private string $channelAccessToken;

    public function __construct(
        HttpClientInterface $httpClient,
        LoggerInterface $logger,
        string $channelSecret,
        string $channelAccessToken
    ) {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->channelSecret = $channelSecret;
        $this->channelAccessToken = $channelAccessToken;
    }

    /**
     * @Route("/line/webhook", name="line_webhook_endpoint", methods={"POST"})
     */
    public function handleWebhook(Request $request): Response
    {
        $payload = $request->getContent();
        $signature = $request->headers->get('X-Line-Signature', '');

        // ၁။ HMAC-SHA256 ဖြင့် Signature စစ်ဆေးခြင်း (လုံခြုံရေး)
        $expectedSignature = base64_encode(hash_hmac('sha256', $payload, $this->channelSecret, true));
        if (!hash_equals($expectedSignature, $signature)) {
            $this->logger->error('Invalid LINE Signature');
            return new Response('Invalid Signature', 400);
        }

        $events = json_decode($payload, true)['events'] ?? [];

        foreach ($events as $event) {
            // ၂။ 友だち追加 (Follow Event) ဖြစ်မဖြစ် စစ်ဆေးခြင်း
            if ($event['type'] === 'follow') {
                $replyToken = $event['replyToken'];
                $lineUserId = $event['source']['userId'];

                // ၃။ Reply API ဖြင့် ချက်ချင်း အခမဲ့ ပြန်ကြားစာ ပို့ဆောင်ခြင်း
                $this->sendWelcomeCouponReply($replyToken, $lineUserId);
            }
        }

        return new Response('OK', 200);
    }

    private function sendWelcomeCouponReply(string $replyToken, string $lineUserId): void
    {
        $message = "🎉 友だち追加ありがとうございます！\n\n当店のお買い物で今すぐ使える【500円OFFクーポン】をプレゼントいたします。\n\n🎟️ クーポンコード: WELCOME500\n（ご注文手続き画面にてご入力ください）\n\n🛍️ お買い物はこちらから:\nhttps://your-store.com/?utm_source=line&utm_medium=welcome_coupon";

        $this->httpClient->request('POST', 'https://api.line.me/v2/bot/message/reply', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->channelAccessToken,
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'replyToken' => $replyToken,
                'messages'   => [
                    [
                        'type' => 'text',
                        'text' => $message,
                    ]
                ]
            ],
            'timeout' => 3.0,
        ]);
    }
}
```

> [!TIP]
> `push` Message သည် Quota ကုန်ကျသော်လည်း၊ Webhook မှ ရရှိလာသော `replyToken` ကို သုံး၍ `reply` Message ပို့ပါက **လုံးဝ အခမဲ့ (Free of Charge)** ဖြစ်ပါသည်။

---

## 📌 Client Task 2: LINE Login ချိန်တွင် Email တူညီပါက အကောင့်အလိုအလျောက် ပေါင်းစည်းပေးခြင်း (名寄せ・Account Merging)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「すでにメールアドレスで会員登録済みのユーザーが、後から『LINEでログイン』を試みた場合、二重登録にならずに自動的にその既存会員レコードに line_user_id を紐付けてログイン完了させてほしい。」
> (ယခင်ကတည်းက Email ဖြင့် အကောင့်ဖွင့်ထားပြီးသော သူသည် နောက်မှ LINE Login ဝင်လာပါက အကောင့် ၂ ခု မဖြစ်သွားစေဘဲ မူလအကောင့်ထဲသို့ `line_user_id` ကို အလိုအလျောက် ချိတ်ဆက်ပေးကာ Login ပေးဝင်ပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

LINE Login v2.1 တွင် `openid email` scope တောင်းခံထားပါက ရရှိလာသော `id_token` ထဲတွင် User ၏ Email ပါဝင်ပါသည်။

```php
public function handleLineAccountLinking(string $idToken, string $lineUserId): Customer
{
    // ၁။ ID Token ကို decode လုပ်ပြီး User ၏ Email ကို ထုတ်ယူခြင်း
    $jwtPayload = explode('.', $idToken)[1];
    $tokenClaims = json_decode(base64_decode(strtr($jwtPayload, '-_', '+/')), true);
    $lineEmail = $tokenClaims['email'] ?? null;

    // ၂။ ပထမဦးစွာ line_user_id ဖြင့် ရှာဖွေခြင်း
    $customer = $this->customerRepository->findOneBy(['line_user_id' => $lineUserId]);
    if ($customer) {
        return $customer; // ချိတ်ပြီးသားဖြစ်ပါက တိုက်ရိုက် ပြန်ပေးမည်
    }

    // ၃။ line_user_id မရှိသေးပါက Email ဖြင့် မူလအကောင့် ရှိမရှိ စစ်ဆေးခြင်း (名寄せ)
    if ($lineEmail) {
        $existingCustomer = $this->customerRepository->findOneBy(['email' => $lineEmail]);
        if ($existingCustomer) {
            // မူလအကောင့်တွင် LINE ID ကို ဖြည့်စွက်ချိတ်ဆက်ပေးခြင်း
            $existingCustomer->setLineUserId($lineUserId);
            $this->entityManager->flush();

            $this->logger->info("Auto-linked LINE ID to existing customer: " . $existingCustomer->getId());
            return $existingCustomer;
        }
    }

    // ၄။ အကယ်၍ မရှိသေးပါက အကောင့်အသစ် ဖန်တီးပေးခြင်း
    return $this->createNewCustomerFromLine($lineUserId, $lineEmail, $tokenClaims['name'] ?? 'LINE 会員');
}
```

---

## 📌 Client Task 3: ကုန်ပစ္စည်း အမျိုးအစားအလိုက် ဝယ်ယူပြီး ရက် ၃၀ အကြာ ပြန်လည်မှာယူရန် သတိပေးခြင်း (ステップ配信)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「サプリメントや化粧品など『消耗品』カテゴリの商品を購入した顧客に対して、使い切るタイミング（発送後30日目）にLINEでリピート促進メッセージを自動配信したい。」
> (ဖြည့်စွက်စာ သို့မဟုတ် အလှကုန်ကဲ့သို့ ကုန်လွယ်သော ပစ္စည်းဝယ်ယူသူများထံသို့ ပစ္စည်းကုန်ခါနီးအချိန် (ပို့ဆောင်ပြီး ရက် ၃၀ မြောက်) တွင် ထပ်မံမှာယူရန် တိုက်တွန်းသော LINE စာတိုကို အလိုအလျောက် ပို့ပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

Symfony Console Command ဖြင့် နေ့စဉ် သန်းခေါင်ယံတွင် ပို့ဆောင်ပေးခြင်း:

```php
protected function execute(InputInterface $input, OutputInterface $output): int
{
    $targetDate = (new \DateTime())->modify('-30 days')->format('Y-m-d');

    // လွန်ခဲ့သော ရက် ၃၀ က 'Consumable' Category (ID: 5) ပါဝင်သော ပစ္စည်းများ ပို့ဆောင်ပြီးစီးခဲ့သည့် Order များကို ရှာဖွေခြင်း
    $qb = $this->entityManager->createQueryBuilder();
    $orders = $qb->select('o')
        ->from('Eccube\Entity\Order', 'o')
        ->innerJoin('o.Customer', 'c')
        ->innerJoin('o.OrderItems', 'oi')
        ->innerJoin('oi.ProductClass', 'pc')
        ->innerJoin('pc.Product', 'p')
        ->innerJoin('p.ProductCategories', 'pct')
        ->where('pct.category_id = :categoryId')
        ->andWhere('o.OrderStatus = 5') // ပို့ဆောင်ပြီးစီး (Delivered)
        ->andWhere('c.line_user_id IS NOT NULL')
        ->andWhere('o.commit_date LIKE :targetDate')
        ->setParameter('categoryId', 5)
        ->setParameter('targetDate', $targetDate . '%')
        ->getQuery()
        ->getResult();

    foreach ($orders as $order) {
        $customer = $order->getCustomer();
        $message = sprintf(
            "【そろそろ使い切る頃ではありませんか？】\n%s 様、前回ご注文いただいたサプリメントの使い心地はいかがでしょうか？\n\n毎日の習慣を途切れさせないために、10%%OFFクーポンをご用意いたしました。\n🎟️ クーポンコード: REPEAT10\n\n🛍️ ワンクリックで再注文:\nhttps://your-store.com/mypage/history/%s",
            $customer->getName01(),
            $order->getId()
        );

        $this->lineService->sendCustomPushText($customer->getLineUserId(), $message);
    }

    return Command::SUCCESS;
}
```

---

## ⚠️ Troubleshooting & Cost Optimization: LINE စရိတ် ကြီးမြင့်မှု ပြဿနာ ဖြေရှင်းနည်း

### ပြဿနာ:
- LINE Official Account ၏ Free Tier သည် တစ်လလျှင် Message စောင်ရေ ၂၀၀ သာ အခမဲ့ ပေးသည်။
- ဖောက်သည် ၅,၀၀၀ ဦးထံသို့ တစ်ပတ်လျှင် ၁ ကြိမ် Broadcast ပို့ပါက တစ်လလျှင် Message ပေါင်း ၂၀,၀၀၀ ဖြစ်သွားပြီး ကြီးမားသော လစဉ်ကြေး ကျသင့်သွားမည်။

### 💡 ကျွမ်းကျင်သော အင်ဂျင်နီယာတစ်ဦး၏ အကောင်းဆုံး ဖြေရှင်းနည်း:
1. **Broadcast အစား Multicast စနစ်သုံးခြင်း**: လူတိုင်းထံ မပို့ဘဲ လွန်ခဲ့သော ၆ လအတွင်း ဝယ်ယူဖူးသူ သို့မဟုတ် ကလစ်နှိပ်ဖူးသူများကိုသာ ရွေးထုတ်၍ `/v2/bot/message/multicast` (အများဆုံး လူ ၅၀၀ စီ ခွဲထုတ်) ဖြင့် ပို့ဆောင်ခြင်း။
2. **Reply Token အကျိုးရှိရှိ သုံးခြင်း**: ဖောက်သည်ဘက်မှ စာပြန်လာချိန် သို့မဟုတ် Follow လုပ်ချိန်တွင် ပို့သော စာများသည် `replyToken` သုံးပါက **အခမဲ့** ဖြစ်သဖြင့် ကူပွန်များကို ထိုအချိန်တွင် တပြိုင်နက် ပေးအပ်ခြင်း။
3. **Open Rate နည်းသော ဖောက်သည်များကို ခေတ္တချန်လှပ်ခြင်း**: လွန်ခဲ့သော ၃ ကြိမ်ဆက်တိုက် လုံးဝ မဖတ်သော သူများကို ခေတ္တ စာမပို့ဘဲ ချန်ထားခြင်းဖြင့် Block Rate ကို လျှော့ချပြီး စရိတ်ကို ၅၀% အထိ သက်သာစေနိုင်ပါသည်။
