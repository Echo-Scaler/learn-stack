---
title: "33. External Inventory Sync Webhook"
description: "> 「実店舗・基幹ERP/WMSとEC-CUBEの在庫をリアルタイムかつ安定して双方向連携してください。外部側で在庫変動があった際はWebhookを受信して即座にEC側の在庫を更新し、逆にEC側で注文が入った際も外部APIへ通知してください。ネットワーク障害やタイムアウトに備えて、自動リトライ（Retry）、エラーログ"
---

## Task 33: 外部在庫システムとEC-CUBEの双方向在庫連携 (External Inventory Sync, Webhook & Retry)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「実店舗・基幹ERP/WMSとEC-CUBEの在庫をリアルタイムかつ安定して双方向連携してください。外部側で在庫変動があった際はWebhookを受信して即座にEC側の在庫を更新し、逆にEC側で注文が入った際も外部APIへ通知してください。ネットワーク障害やタイムアウトに備えて、自動リトライ（Retry）、エラーログ記録、失敗時のアラート通知を備えた堅牢な仕組みを構築してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပြင်ပ ERP/WMS စနစ်များနှင့် EC-CUBE အကြား ကုန်ပစ္စည်း စတော့များကို **နှစ်ဖက်အပြန်အလှန် (Two-way Real-time Webhook & API)** ဖြင့် ချိတ်ဆက်ပြီး၊ Network ချို့ယွင်းပါက **အလိုအလျောက် ပြန်လည်ကြိုးစားခြင်း (Auto Retry with Exponential Backoff)**၊ အမှားမှတ်တမ်း (Error Logging) နှင့် သတိပေးချက်များ ပါဝင်သော စနစ် တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Webhook vs Polling Architecture
- မိနစ် ၂၀ လျှင် တစ်ကြိမ် Cron ဖြင့် မေးမြန်းခြင်း (Polling) သည် ပြင်ပတွင် ပစ္စည်းရောင်းထွက်သွားချိန်နှင့် EC-CUBE သိရှိချိန်အကြား ၂၀ မိနစ် ကွာဟသွားသဖြင့် Overselling ဖြစ်နိုင်သည်။
- **အဖြေ:** ပြင်ပမှ စတော့ပြောင်းသည်နှင့် EC-CUBE သို့ Webhook POST တိုက်ရိုက် လှမ်းပို့စေခြင်းဖြင့် Real-time စက္ကန့်ပိုင်းအတွင်း စတော့ ချိန်ညှိနိုင်သည်။

### 2. Dead-Letter Queue & Exponential Backoff Retry Pattern
- ပြင်ပ Server များ ယာယီ Down နေချိန်တွင် ချက်ချင်း စွန့်ပစ်လိုက်ပါက Data ကွဲလွဲသွားပါမည်။
- မအောင်မြင်သော API Call များကို Queue Database (`dtb_inventory_sync_queue`) တွင် သိမ်းဆည်းပြီး ၁ မိနစ်၊ ၅ မိနစ်၊ ၁၅ မိနစ် စသည့် အချိန်ခြားများဖြင့် အလိုအလျောက် ၃ ကြိမ်အထိ Retry ပြုလုပ်ပေးရမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Inbound Webhook Receiver Controller ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/Api/InventoryWebhookController.php`

```php
<?php

namespace Customize\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Repository\ProductClassRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/v1/inventory")
 */
class InventoryWebhookController extends AbstractController
{
    private ProductClassRepository $productClassRepository;
    private EntityManagerInterface $entityManager;
    private LoggerInterface $logger;
    private string $webhookSecret = 'SECRET_WEBHOOK_SIGNATURE_KEY';

    public function __construct(
        ProductClassRepository $productClassRepository,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ) {
        $this->productClassRepository = $productClassRepository;
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    /**
     * @Route("/webhook", name="api_inventory_webhook", methods={"POST"})
     */
    public function receiveWebhook(Request $request): JsonResponse
    {
        // ၁။ HMAC Signature စစ်ဆေးခြင်း (Security Verification)
        $signature = $request->headers->get('X-Webhook-Signature');
        $payload = $request->getContent();

        $computedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);
        if (!hash_equals($computedSignature, (string)$signature)) {
            $this->logger->warning('Invalid webhook signature attempt');
            return new JsonResponse(['error' => 'Unauthorized signature'], 401);
        }

        $data = json_decode($payload, true);
        if (!isset($data['events']) || !is_array($data['events'])) {
            return new JsonResponse(['error' => 'Invalid JSON structure'], 400);
        }

        $this->entityManager->beginTransaction();
        try {
            foreach ($data['events'] as $event) {
                $sku = $event['sku'] ?? null;
                $newStock = $event['stock'] ?? null;

                if ($sku === null || $newStock === null) {
                    continue;
                }

                $productClass = $this->productClassRepository->findOneBy(['code' => $sku]);
                if ($productClass) {
                    $productClass->setStockUnlimited(false);
                    $productClass->setStock((int) $newStock);
                    $this->entityManager->persist($productClass);
                }
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            $this->logger->info('Inventory Webhook applied successfully.');
            return new JsonResponse(['status' => 'success']);

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->logger->error('Webhook DB Error: ' . $e->getMessage());
            return new JsonResponse(['error' => 'Database error'], 500);
        }
    }
}
```

---

### အဆင့် ၂: Outbound Sync with Retry Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/ResilientInventorySyncService.php`

```php
<?php

namespace Customize\Service;

use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpClient\Retry\GenericRetryStrategy;
use Symfony\Component\HttpClient\RetryableHttpClient;

class ResilientInventorySyncService
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;

    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger)
    {
        // 🌟 Exponential Backoff Retry Strategy (Status 500, 502, 503, 504 တွင် ၃ ကြိမ်အထိ အလိုအလျောက် ပြန်လည်ကြိုးစားခြင်း)
        $retryStrategy = new GenericRetryStrategy([500, 502, 503, 504], 1000, 2.0);
        $this->httpClient = new RetryableHttpClient($httpClient, $retryStrategy, 3);
        $this->logger = $logger;
    }

    /**
     * EC-CUBEでの注文確定時に、外部ERPへリアルタイム在庫減算を通知する
     *
     * @param string $sku
     * @param int $reducedQuantity
     * @return bool
     */
    public function notifyExternalStockDeduction(string $sku, int $reducedQuantity): bool
    {
        try {
            $response = $this->httpClient->request('POST', 'https://erp.partner.jp/api/inventory/deduct', [
                'json' => [
                    'sku' => $sku,
                    'qty' => $reducedQuantity,
                    'timestamp' => time(),
                ],
                'timeout' => 5.0,
            ]);

            if ($response->getStatusCode() === 200) {
                $this->logger->info("Stock deduction notified to ERP: SKU {$sku}, Qty {$reducedQuantity}");
                return true;
            }

            $this->logger->error("ERP Sync Failed with status " . $response->getStatusCode());
            return false;

        } catch (\Exception $e) {
            $this->logger->critical("Critical ERP Sync Failure: " . $e->getMessage());
            // အကြိမ်ကြိမ် မအောင်မြင်ပါက Queue Table ထဲ ထည့်သွင်းထားရန်
            return false;
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Looping Webhooks (無限ループ防止):**  
   EC-CUBE က စတော့နုတ်ပြီး ERP သို့ အကြောင်းကြား၊ ERP က ၎င်းကို လက်ခံရရှိပြီး EC-CUBE သို့ Webhook ပြန်ပို့ပါက မဆုံးနိုင်သော Ping-Pong Loop ဖြစ်သွားနိုင်သည်။ Webhook Payload တွင် `source: "ec-cube"` flag စစ်ဆေး၍ မိမိထံမှ ထွက်သွားသော Event မဟုတ်မှသာ လက်ခံရပါမည်။
2. **Webhook Idempotency (重複受信防止):**  
   Network ကြောင့် ပြင်ပစနစ်မှ တူညီသော Webhook ကို ၂ ခါ ပို့မိပါက ပစ္စည်းစတော့ ၂ ခါ နုတ်မသွားစေရန် `event_id` ကို Cache / DB တွင် စစ်ဆေး၍ Duplicate Event များကို ပယ်ဖျက်ရပါမည်။
