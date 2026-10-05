---
title: "27. External Inventory Api Sync"
description: "> 「実店舗のPOSレジ（スマレジ / スマレジAPI等）や外部の基幹ERPシステムと在庫数を自動連携してください。実店舗で商品が売れた際はEC-CUBEの在庫を減らし、逆にEC側で注文が入った際も外部へ在庫変動を通知できるようにAPIおよび定期バッチコマンド（Cron）を構築してください。」"
---

## Task 27: 外部在庫システムと連携してください (External Inventory API Synchronization)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「実店舗のPOSレジ（スマレジ / スマレジAPI等）や外部の基幹ERPシステムと在庫数を自動連携してください。実店舗で商品が売れた際はEC-CUBEの在庫を減らし、逆にEC側で注文が入った際も外部へ在庫変動を通知できるようにAPIおよび定期バッチコマンド（Cron）を構築してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပြင်ပ ဆိုင်ခွဲများရှိ POS ငွေကိုင်စက်များ (သို့မဟုတ် ERP စနစ်များ) နှင့် EC-CUBE အကြား **ကုန်ပစ္စည်း စတော့လက်ကျန် အချက်အလက်များကို REST API နှင့် Console Command (Cron Batch)** ဖြင့် အပြန်အလှန် အလိုအလျောက် ချိန်ညှိ ချိတ်ဆက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Omni-channel Inventory Management (オムニチャネル在庫一元管理)
- အွန်လိုင်းဆိုင်နှင့် အပြင်ဆိုင်ခွဲများအကြား စတော့ မကိုက်ညီပါက အပြင်ဆိုင်တွင် ရောင်းကုန်သွားသော ပစ္စည်းကို အွန်လိုင်းတွင် ဝယ်ယူသူက ထပ်မံဝယ်မိသည့် ပြဿနာ (Overselling) ဖြစ်တတ်ပါသည်။

### 2. Symfony Console Command Architecture
- စတော့ ထောင်ပေါင်းများစွာကို တစ်ပြိုင်နက် Sync လုပ်ရာတွင် Web Request (HTTP) ဖြင့် ပြုလုပ်ပါက Timeout (504 Gateway Timeout) ဖြစ်တတ်ပါသည်။
- **အဖြေ:** CLI Command (`bin/console app:sync-inventory`) ဖြင့် ရေးသားပြီး Linux Cron Job ဖြင့် ၁၀ မိနစ်တစ်ကြိမ် နောက်ကွယ်မှ run စေခြင်းသည် အတည်ငြိမ်ဆုံး စံချိန်စံညွှန်း ဖြစ်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Inventory Sync Service ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/InventorySyncService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\ProductClass;
use Eccube\Repository\ProductClassRepository;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class InventorySyncService
{
    private ProductClassRepository $productClassRepository;
    private EntityManagerInterface $entityManager;
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;

    public function __construct(
        ProductClassRepository $productClassRepository,
        EntityManagerInterface $entityManager,
        HttpClientInterface $httpClient,
        LoggerInterface $logger
    ) {
        $this->productClassRepository = $productClassRepository;
        $this->entityManager = $entityManager;
        $this->httpClient = $httpClient;
        $this->logger = $logger;
    }

    /**
     * 外部APIから最新在庫を取得し、EC-CUBEの在庫を更新する
     *
     * @return array [ 'updated' => int, 'failed' => int ]
     */
    public function syncFromExternalApi(): array
    {
        $updatedCount = 0;
        $failedCount = 0;

        try {
            // ၁။ ဥပမာ: ပြင်ပ POS / ERP API သို့ GET Request ခေါ်ယူခြင်း
            $response = $this->httpClient->request('GET', 'https://api.external-pos.jp/v1/stock/changes', [
                'headers' => ['Authorization' => 'Bearer YOUR_API_TOKEN'],
                'timeout' => 30.0,
            ]);

            $stockItems = $response->toArray(); // [ ['sku' => 'SHIRT-RED-S', 'stock' => 12], ... ]

            $this->entityManager->beginTransaction();

            foreach ($stockItems as $item) {
                $sku = $item['sku'] ?? null;
                $newStock = isset($item['stock']) ? (int) $item['stock'] : null;

                if (!$sku || $newStock === null) {
                    $failedCount++;
                    continue;
                }

                // SKU (Product Code) ဖြင့် ProductClass ကို ရှာဖွေခြင်း
                $productClass = $this->productClassRepository->findOneBy(['code' => $sku]);
                if (!$productClass) {
                    $this->logger->warning("SKU not found in EC-CUBE: {$sku}");
                    $failedCount++;
                    continue;
                }

                // စတော့ လက်ကျန် အသစ် သတ်မှတ်ခြင်း
                $productClass->setStockUnlimited(false);
                $productClass->setStock($newStock);
                $this->entityManager->persist($productClass);

                $updatedCount++;

                if ($updatedCount % 100 === 0) {
                    $this->entityManager->flush();
                }
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            $this->logger->info("Inventory Sync Completed. Updated: {$updatedCount}, Failed: {$failedCount}");

            return ['updated' => $updatedCount, 'failed' => $failedCount];

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->logger->error('Inventory Sync Error: ' . $e->getMessage());
            return ['updated' => 0, 'failed' => $failedCount];
        }
    }
}
```

---

### အဆင့် ၂: Symfony Console Command ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Command/SyncInventoryCommand.php`

```php
<?php

namespace Customize\Command;

use Customize\Service\InventorySyncService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class SyncInventoryCommand extends Command
{
    protected static $defaultName = 'app:sync-inventory';
    protected static $defaultDescription = 'Sync stock inventory from external POS/ERP API';

    private InventorySyncService $syncService;

    public function __construct(InventorySyncService $syncService)
    {
        parent::__construct();
        $this->syncService = $syncService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Starting External Inventory Synchronization...');

        $result = $this->syncService->syncFromExternalApi();

        $io->success(sprintf(
            'Sync Finished! Updated: %d items, Failed: %d items.',
            $result['updated'],
            $result['failed']
        ));

        return Command::SUCCESS;
    }
}
```

---

### အဆင့် ၃: Linux Server တွင် Crontab ချိတ်ဆက်ခြင်း
Terminal တွင် `crontab -e` ဖွင့်၍ အောက်ပါအတိုင်း ထည့်သွင်းပါ (ဥပမာ - ၁၅ မိနစ်တစ်ကြိမ်):

```bash
# EC-CUBE 外部在庫同期バッチ（15分ごと実行）
*/15 * * * * cd /var/www/eccube && bin/console app:sync-inventory >> /var/log/eccube_stock_cron.log 2>&1
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Locking During Batch Execution:**  
   Batch Command အကြာကြီး run နေချိန်တွင် အခြား Command တစ်ခု ထပ်မံ ထပ်မတက်စေရန် Symfony Lock Component (`LockFactory`) ဖြင့် Process Lock ထားသင့်ပါသည်။
2. **Product Stock vs ProductClass Stock:**  
   EC-CUBE တွင် စတော့ဇယား ၂ ခု ရှိသည် (`dtb_product_class` နှင့် `dtb_product_stock`)။ `ProductClass::setStock()` ပြုလုပ်ပါက Entity Listener က Stock Entity ကိုပါ အလိုအလျောက် ချိန်ညှိပေးသော်လည်း Database Direct SQL Update မလုပ်ဘဲ Entity Method မှတစ်ဆင့်သာ အမြဲ လုပ်ဆောင်ရပါမည်။
