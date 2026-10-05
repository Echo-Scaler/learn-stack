---
title: "02. Line Messaging And Notifications"
description: "အော်ဒါတင်ပြီးချိန် သို့မဟုတ် ပစ္စည်းပို့ဆောင်လိုက်သည့်အခါ ဖောက်သည်၏ LINE Chat ထဲသို့ တိုက်ရိုက် ရောက်ရှိသွားမည့် LINE Messaging API & Flex Message အသုံးပြုပုံ ဖ"
---

## 02. LINE Messaging & Transactional Notifications (LINE通知連携)

အော်ဒါတင်ပြီးချိန် သို့မဟုတ် ပစ္စည်းပို့ဆောင်လိုက်သည့်အခါ ဖောက်သည်၏ LINE Chat ထဲသို့ တိုက်ရိုက် ရောက်ရှိသွားမည့် **LINE Messaging API & Flex Message** အသုံးပြုပုံ ဖြစ်ပါသည်။

---

## 📨 LINE Message ပို့ဆောင်မှု အမျိုးအစား ၃ မျိုး

LINE Messaging API တွင် ရည်ရွယ်ချက်အလိုက် Message ပို့နိုင်သော Endpoint ၃ ခု ရှိပါသည်:

| အမျိုးအစား | Endpoint | အသုံးပြုပုံ | ကုန်ကျစရိတ် သတိပြုရန် |
|:---|:---|:---|:---|
| **Push Message** | `/v2/bot/message/push` | သီးသန့် လူတစ်ဦးတည်း (`line_user_id`) ထံသို့ ပို့ခြင်း (ဥပမာ: မိမိ၏ အော်ဒါအတည်ပြုစာ) | ၁ စောင်စီ အခမဲ့ Quota မှ နှုတ်ယူသည် |
| **Multicast** | `/v2/bot/message/multicast` | အများဆုံး လူ ၅၀၀ ထံသို့ API Call ၁ ကြိမ်တည်းဖြင့် တပြိုင်နက် ပို့ခြင်း (ဥပမာ: VIP အဖွဲ့ဝင်များထံ ကူပွန်ပို့ခြင်း) | မြန်ဆန်ပြီး ဆာဗာဝန် သက်သာသည် |
| **Broadcast** | `/v2/bot/message/broadcast` | Official Account ၏ 友だち (Friends) အားလုံးထံသို့ ပို့ခြင်း (ဥပမာ: နှစ်သစ်ကူး Promotion စာစောင်) | Quota အလွန်ကုန်ကျနိုင်သည် |

---

## 🎨 Flex Message ဆိုတာ အဘယ်နည်း?

သာမန် စာသားချည်းသက်သက် (Plain Text) Message သည် ရိုးစင်းလွန်းပြီး ဖတ်ရှုသူကို ဆွဲဆောင်နိုင်မှု နည်းပါးသည်။ **Flex Message** သည် HTML/CSS ကဲ့သို့ ရုပ်ပုံ၊ အရောင်၊ ခလုတ် (Buttons) နှင့် ဈေးနှုန်းဇယားများကို လှပစွာ ဖွဲ့စည်းပြသပေးနိုင်သော JSON Card Layout ပုံစံ ဖြစ်ပါသည်။

```
┌─────────────────────────────────────────┐
│ 🟢 【ご注文ありがとうございます】       │
│                                         │
│ 注文番号: #10042                        │
│ ご注文日: 2026/09/21                    │
│ ─────────────────────────────────────── │
│ • オーガニックシャンプー x 1   ¥2,500   │
│ • ヘアトリートメント     x 1   ¥1,800   │
│ ─────────────────────────────────────── │
│ 合計金額 (税込):               ¥4,300   │
│                                         │
│ [ 🛍️ 注文履歴・配送状況を確認する ]    │
└─────────────────────────────────────────┘
```

---

## 🛠️ PHP ဖြင့် Flex Message တည်ဆောက်ပြီး Push ပို့ဆောင်ပုံ

Symfony HttpClient ကို အသုံးပြု၍ အော်ဒါအတည်ပြု Flex Message ပို့ဆောင်ပေးသော Service နမူနာ:

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

    public function __construct(
        HttpClientInterface $httpClient,
        LoggerInterface $logger,
        string $channelAccessToken
    ) {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->channelAccessToken = $channelAccessToken;
    }

    /**
     * အော်ဒါအတည်ပြု Flex Message ပို့ဆောင်ခြင်း
     */
    public function sendOrderCompleteFlexMessage(Order $order): bool
    {
        $customer = $order->getCustomer();
        if (!$customer || empty($customer->getLineUserId())) {
            return false;
        }

        $flexPayload = $this->buildOrderFlexPayload($order);

        try {
            $response = $this->httpClient->request('POST', 'https://api.line.me/v2/bot/message/push', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->channelAccessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'to'       => $customer->getLineUserId(),
                    'messages' => [
                        [
                            'type'     => 'flex',
                            'altText'  => 'ご注文完了のお知らせ #' . $order->getOrderNo(),
                            'contents' => $flexPayload,
                        ]
                    ]
                ],
                'timeout' => 5.0,
            ]);

            return $response->getStatusCode() === 200;
        } catch (\Exception $e) {
            $this->logger->error("LINE Order Notification Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * LINE Flex Message Container JSON တည်ဆောက်ခြင်း
     */
    private function buildOrderFlexPayload(Order $order): array
    {
        $itemBoxes = [];
        foreach ($order->getOrderItems() as $item) {
            $itemBoxes[] = [
                'type'   => 'box',
                'layout' => 'horizontal',
                'contents' => [
                    [
                        'type'  => 'text',
                        'text'  => $item->getProductName() . ' x ' . $item->getQuantity(),
                        'size'  => 'sm',
                        'color' => '#555555',
                        'flex'  => 4,
                    ],
                    [
                        'type'  => 'text',
                        'text'  => '¥' . number_format($item->getPriceIncTax()),
                        'size'  => 'sm',
                        'color' => '#111111',
                        'align' => 'end',
                        'flex'  => 2,
                    ],
                ]
            ];
        }

        return [
            'type' => 'bubble',
            'header' => [
                'type'            => 'box',
                'layout'          => 'vertical',
                'backgroundColor' => '#06C755',
                'contents'        => [
                    [
                        'type'   => 'text',
                        'text'   => 'ご注文ありがとうございます',
                        'weight' => 'bold',
                        'color'  => '#FFFFFF',
                        'size'   => 'md',
                    ]
                ]
            ],
            'body' => [
                'type'     => 'box',
                'layout'   => 'vertical',
                'contents' => [
                    [
                        'type'   => 'text',
                        'text'   => '注文番号: #' . $order->getOrderNo(),
                        'weight' => 'bold',
                        'size'   => 'sm',
                    ],
                    ['type' => 'separator', 'margin' => 'md'],
                    [
                        'type'     => 'box',
                        'layout'   => 'vertical',
                        'margin'   => 'md',
                        'spacing'  => 'sm',
                        'contents' => $itemBoxes,
                    ],
                    ['type' => 'separator', 'margin' => 'md'],
                    [
                        'type'     => 'box',
                        'layout'   => 'horizontal',
                        'margin'   => 'md',
                        'contents' => [
                            [
                                'type'   => 'text',
                                'text'   => '合計金額 (税込)',
                                'weight' => 'bold',
                                'size'   => 'md',
                            ],
                            [
                                'type'   => 'text',
                                'text'   => '¥' . number_format($order->getPaymentTotal()),
                                'weight' => 'bold',
                                'size'   => 'lg',
                                'color'  => '#E53935',
                                'align'  => 'end',
                            ],
                        ]
                    ]
                ]
            ],
            'footer' => [
                'type'     => 'box',
                'layout'   => 'vertical',
                'contents' => [
                    [
                        'type'   => 'button',
                        'style'  => 'primary',
                        'color'  => '#06C755',
                        'action' => [
                            'type'  => 'uri',
                            'label' => '注文詳細を確認する',
                            'uri'   => 'https://your-store.com/mypage/history/' . $order->getId(),
                        ]
                    ]
                ]
            ]
        ];
    }
}
```

---

## 🚚 ပို့ဆောင်ပြီးကြောင်း အသိပေးချက် (Shipping Tracking Notice)

ပစ္စည်းပို့ဆောင်ပြီးချိန်တွင် Tracking Number (ချောထုပ်ခြေရာခံကုတ်) နှင့် Carrier URL ကို LINE ဖြင့် ပို့ဆောင်ပေးခြင်း:

```php
public function sendShippingNotice(Order $order, string $trackingNumber, string $carrierUrl): bool
{
    $customer = $order->getCustomer();
    if (!$customer || empty($customer->getLineUserId())) {
        return false;
    }

    $message = [
        'type' => 'text',
        'text' => sprintf(
            "【商品を発送いたしました】\n注文番号: #%s\n配送伝票番号: %s\n\nお荷物の配送状況は以下のURLよりご確認いただけます:\n%s",
            $order->getOrderNo(),
            $trackingNumber,
            $carrierUrl
        )
    ];

    $response = $this->httpClient->request('POST', 'https://api.line.me/v2/bot/message/push', [
        'headers' => [
            'Authorization' => 'Bearer ' . $this->channelAccessToken,
            'Content-Type'  => 'application/json',
        ],
        'json' => [
            'to'       => $customer->getLineUserId(),
            'messages' => [$message],
        ],
    ]);

    return $response->getStatusCode() === 200;
}
```

ဤစနစ်ကြောင့် ဖောက်သည်များသည် မိမိတို့၏ ကုန်ပစ္စည်း မည်သည့်နေရာသို့ ရောက်ရှိနေပြီကို စိတ်ချလက်ချ အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်မည် ဖြစ်ပါသည်။
