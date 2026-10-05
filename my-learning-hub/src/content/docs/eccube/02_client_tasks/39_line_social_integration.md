---
title: "39. Line Social Integration"
description: "> 「日本市場で最も利用されている『LINE（LINE公式アカウント）』とEC-CUBEを高度連携してください。会員登録・ログイン時に『LINEログイン（1タップ登録）』を可能にし、顧客データにLINE User IDを紐付け（ID連携）してください。また、注文完了時や発送完了時に、LINEのトーク画面へ自動で注文明細"
---

## Task 39: LINE連携・ソーシャルログインと通知 (LINE Login, ID Linkage & Messaging API)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「日本市場で最も利用されている『LINE（LINE公式アカウント）』とEC-CUBEを高度連携してください。会員登録・ログイン時に『LINEログイン（1タップ登録）』を可能にし、顧客データにLINE User IDを紐付け（ID連携）してください。また、注文完了時や発送完了時に、LINEのトーク画面へ自動で注文明細や追跡URL付きの通知メッセージ（LINE通知メッセージ/Messaging API）を送信できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဂျပန်နိုင်ငံတွင် လူသုံးအများဆုံး ဖြစ်သော **LINE App** နှင့် EC-CUBE ကို ချိတ်ဆက်ကာ **"LINE ဖြင့် 1-Click အကောင့်ဖွင့်/Login ဝင်ခြင်း (LINE Login OAuth2)"**၊ အကောင့်ချိတ်ဆက်ခြင်း (ID Linkage) နှင့် အော်ဒါတင်ပြီးချိန်/ပစ္စည်းပို့ပြီးချိန်တွင် Customer ၏ **LINE Chat ထဲသို့ အလိုအလျောက် သတိပေး မက်ဆေ့ခ်ျ ပို့ဆောင်ခြင်း (LINE Messaging API)** ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Zero Friction Onboarding (フォーム離脱の防止)
- စမတ်ဖုန်းပေါ်တွင် နာမည်၊ လိပ်စာ၊ Password များကို လက်ဖြင့် ရိုက်ထည့်ခိုင်းပါက Member ဝင်ရောက်မှု ၆၀% ကျော် လက်လျှော့သွားလေ့ရှိသည်။ LINE Login ခလုတ်ကို နှိပ်ရုံဖြင့် 1 Tap ဖြင့် အကောင့်ဖွင့်နိုင်သဖြင့် စာရင်းသွင်းမှုနှုန်း အလွန်တက်စေသည်။

### 2. High Open-rate Notifications (メール未達問題の解消)
- မိုဘိုင်း အီးမေးလ်များ (Docomo, Softbank) သည် Spam Filter ကြောင့် ပျောက်ဆုံးတတ်သော်လည်း LINE Message သည် Open Rate ၈၀% ကျော်ရှိသဖြင့် ပို့ဆောင်ရေး သတိပေးချက်များ လွဲချော်မှု မရှိနိုင်တော့ပါ။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Customer Entity တွင် `line_user_id` Trait ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/CustomerLineTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Customer")
 */
trait CustomerLineTrait
{
    /**
     * LINEプロバイダー固有のユーザー識別子
     * @ORM\Column(name="line_user_id", type="string", length=100, nullable=true, unique=true)
     */
    private ?string $line_user_id = null;

    /**
     * LINE連携日時
     * @ORM\Column(name="line_linked_at", type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $line_linked_at = null;

    public function getLineUserId(): ?string { return $this->line_user_id; }
    public function setLineUserId(?string $id): self { $this->line_user_id = $id; return $this; }
    public function getLineLinkedAt(): ?\DateTimeInterface { return $this->line_linked_at; }
    public function setLineLinkedAt(?\DateTimeInterface $dt): self { $this->line_linked_at = $dt; return $this; }
}
```

---

### အဆင့် ၂: LINE Login OAuth Callback Controller တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/LineOAuthController.php`

```php
<?php

namespace Customize\Controller;

use Customize\Entity\Customer;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Controller\AbstractController;
use Eccube\Repository\CustomerRepository;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LineOAuthController extends AbstractController
{
    private string $channelId = 'YOUR_LINE_CHANNEL_ID';
    private string $channelSecret = 'YOUR_LINE_CHANNEL_SECRET';
    private HttpClientInterface $httpClient;
    private CustomerRepository $customerRepository;
    private EntityManagerInterface $entityManager;
    private TokenStorageInterface $tokenStorage;

    public function __construct(
        HttpClientInterface $httpClient,
        CustomerRepository $customerRepository,
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->httpClient = $httpClient;
        $this->customerRepository = $customerRepository;
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @Route("/line/callback", name="line_oauth_callback", methods={"GET"})
     */
    public function callback(Request $request): RedirectResponse
    {
        $code = $request->query->get('code');
        if (!$code) {
            $this->addError('LINE認証に失敗しました。');
            return $this->redirectToRoute('mypage_login');
        }

        // ၁။ Code ကို Access Token သို့ လဲလှယ်ခြင်း
        $tokenResponse = $this->httpClient->request('POST', 'https://api.line.me/oauth2/v2.1/token', [
            'body' => [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $this->generateUrl('line_oauth_callback', [], \Symfony\Component\Routing\Generator\UrlGeneratorInterface::ABSOLUTE_URL),
                'client_id' => $this->channelId,
                'client_secret' => $this->channelSecret,
            ],
        ]);

        $tokenData = $tokenResponse->toArray();
        $accessToken = $tokenData['access_token'] ?? null;

        // ၂။ Access Token ဖြင့် User Profile (Line User ID, Display Name) ရယူခြင်း
        $profileResponse = $this->httpClient->request('GET', 'https://api.line.me/v2/profile', [
            'headers' => ['Authorization' => 'Bearer ' . $accessToken],
        ]);
        $profile = $profileResponse->toArray();
        $lineUserId = $profile['userId'] ?? null;

        if (!$lineUserId) {
            $this->addError('LINEユーザー情報の取得に失敗しました。');
            return $this->redirectToRoute('mypage_login');
        }

        // ၃။ DB တွင် ဤ line_user_id ရှိမရှိ စစ်ဆေးခြင်း
        $customer = $this->customerRepository->findOneBy(['line_user_id' => $lineUserId]);

        if ($customer) {
            // ရှိပြီးသားဖြစ်ပါက အလိုအလျောက် Login ဝင်ပေးခြင်း
            $token = new UsernamePasswordToken($customer, null, 'customer', $customer->getRoles());
            $this->tokenStorage->setToken($token);
            $this->addSuccess('LINEアカウントでログインしました。');
            return $this->redirectToRoute('mypage');
        }

        // မရှိသေးပါက လက်ရှိ Login User နှင့် ချိတ်ဆက်ခြင်း သို့မဟုတ် အသစ်မှတ်ပုံတင်ခြင်း စာမျက်နှာသို့ သွားခြင်း
        return $this->redirectToRoute('entry', ['line_id' => $lineUserId]);
    }
}
```

---

### အဆင့် ၃: LINE Messaging Push Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/LineMessagingService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LineMessagingService
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $channelAccessToken = 'YOUR_MESSAGING_API_CHANNEL_ACCESS_TOKEN';

    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger)
    {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
    }

    /**
     * 発送完了通知をLINEトークにプッシュ送信する
     *
     * @param Order $order
     * @param string $trackingNumber
     * @return bool
     */
    public function sendShippingNotification(Order $order, string $trackingNumber): bool
    {
        $customer = $order->getCustomer();
        if (!$customer || !method_exists($customer, 'getLineUserId') || !$customer->getLineUserId()) {
            return false; // LINE未連携の場合はスキップ
        }

        $lineUserId = $customer->getLineUserId();

        $messageText = sprintf(
            "【出荷完了のお知らせ】\n%s 様\n\nご注文いただいた商品を本日発送いたしました。\n\n■ 注文番号: #%s\n■ 配送伝票番号: %s\n\nお荷物の配送状況は運送会社の追跡サービスよりご確認ください。\nご利用ありがとうございました！",
            $order->getName01(),
            $order->getOrderNo(),
            $trackingNumber
        );

        try {
            $response = $this->httpClient->request('POST', 'https://api.line.me/v2/bot/message/push', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->channelAccessToken,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'to' => $lineUserId,
                    'messages' => [
                        [
                            'type' => 'text',
                            'text' => $messageText,
                        ]
                    ],
                ],
            ]);

            return $response->getStatusCode() === 200;

        } catch (\Exception $e) {
            $this->logger->error('LINE Push Error: ' . $e->getMessage());
            return false;
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Messaging API Rate Limits & Pay-as-you-go:**  
   LINE Official Account တွင် အခမဲ့ ပို့နိုင်သော Message အရေအတွက် (無料枠: 月200通〜) ကန့်သတ်ချက် ရှိပါသည်။ အော်ဒါများပြားသော ဆိုင်ကြီးများတွင် Light Plan / Standard Plan သို့ အဆင့်မြှင့်ထားရန် လိုအပ်ပါသည်။
2. **Account Linking Confirmation (友だち追加オプション):**  
   LINE Login ပြုလုပ်ချိန်တွင် ဆိုင်၏ LINE Official Account ကို တစ်ပြိုင်နက် Add Friend (友だち追加) အလိုအလျောက် ပြုလုပ်စေရန် `bot_prompt=aggressive` parameter ကို OAuth Authorization URL တွင် ထည့်သွင်းပေးသင့်ပါသည်။
