---
title: "25. Purchase Stock Auto Update"
description: "> 「お客様が注文を確定した瞬間、対象商品の在庫数（ProductClass stock）を自動的に減算（在庫引き当て）してください。また、同一商品にアクセスが集中した際でも、在庫数以上の注文が入ってしまう『売り越し（Overselling）』を絶対に防止できるよう排他制御を行ってください。」"
---

## Task 25: 商品購入時に在庫を自動更新してください (Stock Auto-Update & Inventory Locking)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「お客様が注文を確定した瞬間、対象商品の在庫数（ProductClass stock）を自動的に減算（在庫引き当て）してください。また、同一商品にアクセスが集中した際でも、在庫数以上の注文が入ってしまう『売り越し（Overselling）』を絶対に防止できるよう排他制御を行ってください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဝယ်ယူသူက အော်ဒါတင်လိုက်သည်နှင့် ဝယ်ယူလိုက်သော ပစ္စည်း၏ လက်ကျန်စတော့ကို အလိုအလျောက် နုတ်ယူ (Stock Reduction) ပေးရန်နှင့် လူအများအပြား တစ်ပြိုင်နက် ဝယ်ယူချိန်တွင် လက်ကျန်ထက် ကျော်လွန်ရောင်းချမိခြင်း (Overselling / 売り越し) မဖြစ်စေရန် **Database Lock (Pessimistic Locking)** ဖြင့် စနစ်တကျ ကာကွယ်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Race Condition & Overselling (売り越し) ပြဿနာ
- ကုန်ပစ္စည်း စတော့ ၁ ခုသာ ကျန်ရှိချိန်တွင် User A နှင့် User B က တစ်စက္ကန့်တည်း၌ တစ်ပြိုင်နက် "注文確定" ခလုတ်ကို နှိပ်လိုက်ပါက Database တွင် Concurrency Control မရှိပါက လူ ၂ ယောက်လုံး အော်ဒါအောင်မြင်သွားပြီး ပစ္စည်း ၁ ခုတည်းကို ၂ ယောက် ရောင်းချမိသွားပါမည် (Overselling)။
- **အဖြေ:** Database ၏ **Pessimistic Write Lock (`SELECT ... FOR UPDATE`)** ကို အသုံးပြုကာ User A စတော့နုတ်ပြီးမှသာ User B ကို စစ်ဆေးခွင့်ပြုရမည်။

### 2. PurchaseFlow Stock Preprocessor
- EC-CUBE 4 တွင် Checkout ဖြစ်စဉ်အားလုံးကို `PurchaseFlow` ဖြင့် စီမံခန့်ခွဲရာတွင် `StockReducer` Processor က Transaction အတွင်း စတော့များကို လုံခြုံစွာ နုတ်ယူပေးပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Pessimistic Lock ဖြင့် စတော့ လုံခြုံစွာ နုတ်ယူသည့် Service
ဖိုင်တည်နေရာ: `app/Customize/Service/SafeStockManagementService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\DBAL\LockMode;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Order;
use Eccube\Entity\ProductClass;
use Psr\Log\LoggerInterface;

class SafeStockManagementService
{
    private EntityManagerInterface $entityManager;
    private LoggerInterface $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    /**
     * 注文内容に基づき、排他ロック（FOR UPDATE）をかけて在庫を減算する
     *
     * @param Order $order
     * @throws \Exception 在庫不足またはエラー時
     */
    public function reduceStockWithLock(Order $order): void
    {
        $this->entityManager->beginTransaction();

        try {
            foreach ($order->getOrderItems() as $item) {
                if (!$item->isProduct()) {
                    continue;
                }

                $productClassId = $item->getProductClass()->getId();
                $quantity = $item->getQuantity();

                // 🌟 PESSIMISTIC_WRITE (SELECT ... FOR UPDATE) Lock ရယူခြင်း
                // ဤ Record ကို အခြား Query များက ပြိုင်တူ ဖတ်/ပြင် မရအောင် ခေတ္တ Lock ချထားသည်
                /** @var ProductClass $productClass */
                $productClass = $this->entityManager->find(
                    ProductClass::class,
                    $productClassId,
                    LockMode::PESSIMISTIC_WRITE
                );

                // 在庫無制限の場合はスキップ
                if ($productClass->isStockUnlimited()) {
                    continue;
                }

                $currentStock = (int) $productClass->getStock();

                // လက်ကျန်စတော့ မလုံလောက်ပါက ချက်ချင်း Exception ပေးပြီး Rollback လုပ်ခြင်း
                if ($currentStock < $quantity) {
                    throw new \Exception(sprintf(
                        '商品「%s」の在庫が不足しています。（現在の在庫: %d 点、注文数: %d 点）',
                        $item->getProductName(),
                        $currentStock,
                        $quantity
                    ));
                }

                // စတော့ အသစ် တွက်ချက်ပြီး သတ်မှတ်ခြင်း
                $newStock = $currentStock - $quantity;
                $productClass->setStock($newStock);

                $this->entityManager->persist($productClass);
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            $this->logger->info("Stock reduced successfully for Order #{$order->getOrderNo()}");

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->logger->error('Stock Reduction Failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
```

---

### အဆင့် ၂: PurchaseFlow Stock Deduce Processor နှင့် ချိတ်ဆက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/PurchaseFlow/Processor/SafeStockPurchaseProcessor.php`

```php
<?php

namespace Customize\Service\PurchaseFlow\Processor;

use Customize\Service\SafeStockManagementService;
use Eccube\Annotation\OrderFlow;
use Eccube\Entity\ItemHolderInterface;
use Eccube\Entity\Order;
use Eccube\Service\PurchaseFlow\ItemHolderPreprocessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;

/**
 * @OrderFlow
 */
class SafeStockPurchaseProcessor implements ItemHolderPreprocessor
{
    private SafeStockManagementService $stockService;

    public function __construct(SafeStockManagementService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function process(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        // 注文確定（Checkout Commit）タイミングのみ実行
        if ($itemHolder instanceof Order && $context->isCommit()) {
            $this->stockService->reduceStockWithLock($itemHolder);
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Deadlock ကာကွယ်ရန် Product Class ID များကို အစဉ်လိုက် Sort လုပ်ခြင်း:**  
   User A သည် Product 1 နှင့် Product 2 ကို ဝယ်ပြီး၊ User B က Product 2 နှင့် Product 1 ကို ပြိုင်တူ ဝယ်ပါက Database Deadlock ဖြစ်တတ်ပါသည်။ ကုန်ပစ္စည်းများကို Lock ရယူရာတွင် `ProductClass ID ASC` အစဉ်အတိုင်း စီတန်း၍ Lock ခေါ်ယူပါက Deadlock ကို 100% ကာကွယ်နိုင်ပါသည်။
2. **Order Cancellation (キャンセル時の在庫戻し):**  
   ဝယ်ယူပြီးနောက် အော်ဒါကို Cancel လုပ်လိုက်ပါက နုတ်ယူထားသော စတော့များကို ပြန်လည် ပေါင်းထည့်ပေးသော Restore Logic (`dtb_product_class.stock += quantity`) ကိုပါ မဖြစ်မနေ ထည့်သွင်းပေးရပါမည်။
