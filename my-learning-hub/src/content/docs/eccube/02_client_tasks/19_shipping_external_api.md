---
title: "19. Shipping External Api"
description: "> 「管理画面で注文ステータスを『発送済み』に変更した瞬間、外部の倉庫管理システム（WMS / Next Engine / Logless 等）や運送会社APIに対し、注文番号、配送先住所、商品コード、数量、伝票番号をJSON形式で自動連携（Webhook送信）してください。」"
---

## Task 19: 発送時に外部APIへ注文情報を送信してください (Shipping External API Integration)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面で注文ステータスを『発送済み』に変更した瞬間、外部の倉庫管理システム（WMS / Next Engine / Logless 等）や運送会社APIに対し、注文番号、配送先住所、商品コード、数量、伝票番号をJSON形式で自動連携（Webhook送信）してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်း ပို့ဆောင်ပြီးစီးကြောင်း Status ကို "発送済み" သို့ ပြောင်းလိုက်ချိန်တွင် ပြင်ပ ဂိုဒေါင်စီမံခန့်ခွဲမှုစနစ် (WMS API / Logistics System) ထံသို့ **အော်ဒါနှင့် ပို့ဆောင်ရေး အချက်အလက်များကို REST API (JSON) ဖြင့် အလိုအလျောက် ပေးပို့ (API Integration)** ပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Supply Chain Automation (出荷連携の自動化)
- လူကိုယ်တိုင် CSV ဖိုင်ဖြင့် WMS ထဲသို့ Data ရွှေ့ပြောင်းစရာမလိုဘဲ Real-time API ချိတ်ဆက်ခြင်းဖြင့် ဂိုဒေါင်တွင် ပစ္စည်းထုတ်ပိုးမှုနှင့် ခြေရာခံခြင်းကို အချိန်ကြန့်ကြာမှု မရှိစေဘဲ အလိုအလျောက် ဆောင်ရွက်နိုင်သည်။

### 2. Service Layer + Symfony HttpClient Architecture
- API Call ခေါ်ယူမှု (HTTP POST, Bearer Token Auth, Timeout, Retry) ကို Controller ထဲတွင် မရေးဘဲ သီးသန့် `WarehouseApiService` အဖြစ် ခွဲထုတ်ခြင်းဖြင့် Unit Test ရေးသားနိုင်ပြီး ချို့ယွင်းမှုဖြစ်ပါက Error Log စနစ်တကျ မှတ်တမ်းတင်နိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: External API Client Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/ExternalWarehouseApiService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExternalWarehouseApiService
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $apiEndpoint = 'https://api.wms-partner.jp/v1/shipments';
    private string $apiKey = 'YOUR_SECRET_API_KEY';

    public function __construct(
        HttpClientInterface $httpClient,
        LoggerInterface $logger
    ) {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
    }

    /**
     * 発送済みの注文情報を外部APIへPOST送信する
     *
     * @param Order $order
     * @return bool
     */
    public function syncShippingData(Order $order): bool
    {
        // ပို့ဆောင်မည့် ကုန်ပစ္စည်းစာရင်း တည်ဆောက်ခြင်း
        $items = [];
        foreach ($order->getOrderItems() as $item) {
            if ($item->isProduct()) {
                $items[] = [
                    'product_code' => $item->getProductCode(),
                    'product_name' => $item->getProductName(),
                    'quantity' => $item->getQuantity(),
                    'price' => $item->getPriceIncTax(),
                ];
            }
        }

        // ပို့ဆောင်မည့် လိပ်စာ (Shipping Address)
        $shipping = $order->getShippings()->first();

        $payload = [
            'order_id' => $order->getId(),
            'order_no' => $order->getOrderNo(),
            'shipping_date' => (new \DateTime())->format('Y-m-d H:i:s'),
            'tracking_number' => $shipping ? $shipping->getTrackingNumber() : null,
            'customer' => [
                'name' => $order->getName01() . ' ' . $order->getName02(),
                'postal_code' => $order->getPostalCode(),
                'address' => $order->getPref()->getName() . $order->getAddr01() . $order->getAddr02(),
                'phone' => $order->getPhoneNumber(),
            ],
            'items' => $items,
        ];

        try {
            $response = $this->httpClient->request('POST', $this->apiEndpoint, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload,
                'timeout' => 10.0,
            ]);

            $statusCode = $response->getStatusCode();
            if ($statusCode === 200 || $statusCode === 201) {
                $this->logger->info("WMS API Sync Success for Order #{$order->getOrderNo()}");
                return true;
            }

            $this->logger->error("WMS API Error [Status {$statusCode}] for Order #{$order->getOrderNo()}: " . $response->getContent(false));
            return false;

        } catch (\Exception $e) {
            $this->logger->error("WMS API Request Exception: " . $e->getMessage());
            return false;
        }
    }
}
```

---

### အဆင့် ၂: Order Status ပြောင်းလဲမှုကို စောင့်ကြည့်သော Event Subscriber
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/ShippingApiSyncSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Customize\Service\ExternalWarehouseApiService;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Order;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ShippingApiSyncSubscriber implements EventSubscriberInterface
{
    private ExternalWarehouseApiService $apiService;

    public function __construct(ExternalWarehouseApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Admin 受注詳細更新完了イベント
            'eccube.event.admin.order.edit.complete' => 'onAdminOrderUpdate',
        ];
    }

    public function onAdminOrderUpdate(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('TargetOrder');

        // ステータスが「発送済み（DELIVERED: ID 5）」になった場合のみ実行
        if ($order && $order->getOrderStatus()->getId() === OrderStatus::DELIVERED) {
            $this->apiService->syncShippingData($order);
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Timeout Blocking (同期処理による遅延):**  
   ပြင်ပ API သည် Down နေပါက သို့မဟုတ် အချိန် ၅ စက္ကန့်ကျော် နှေးကွေးပါက Admin ၏ Screen ပေါ်တွင် ခလုတ်နှိပ်ပြီး ရပ်တန့်နေတတ်သည်။ ထို့ကြောင့် Production စနစ်ကြီးများတွင် **Symfony Messenger (RabbitMQ / Redis Queue)** ဖြင့် Asynchronous (နောက်ကွယ်မှ) ပို့ဆောင်စေရန် အကြံပြုပါသည်။
2. **Idempotency (重複連携防止):**  
   Admin က Save ခလုတ်ကို ၂ ခါ နှိပ်မိပါက ပြင်ပ API သို့ အချက်အလက် ၂ ခါ မရောက်သွားစေရန် `Order` Entity တွင် `is_wms_synced` boolean flag ထည့်သွင်းထားသင့်ပါသည်။
