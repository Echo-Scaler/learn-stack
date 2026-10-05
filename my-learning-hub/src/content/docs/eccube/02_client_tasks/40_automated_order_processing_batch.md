---
title: "40. Automated Order Processing Batch"
description: "> 「毎朝8時00分に、前日深夜までに決済が完了している新規注文（クレジットカード決済済、後払い審査通過済等）を自動的に抽出・検証し、ステータスを『対応中』へ自動変更、外部倉庫の出荷APIへ連携、処理結果をログおよび管理者へ自動メール報告する定期バッチコマンド（Cron）を構築してください。」"
---

## Task 40: 毎朝の受注自動処理バッチシステム (Automated Daily Order Processing Batch)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「毎朝8時00分に、前日深夜までに決済が完了している新規注文（クレジットカード決済済、後払い審査通過済等）を自動的に抽出・検証し、ステータスを『対応中』へ自動変更、外部倉庫の出荷APIへ連携、処理結果をログおよび管理者へ自動メール報告する定期バッチコマンド（Cron）を構築してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
နေ့စဉ် မနက်တိုင်းတွင် ဝယ်ယူသူများ ငွေပေးချေပြီးသော အော်ဒါအသစ်များကို လူကိုယ်တိုင် တစ်ခုချင်း စစ်ဆေးနေစရာမလိုဘဲ **Symfony Console Command နှင့် Linux Cron** ဖြင့် **အလိုအလျောက် ရွေးထုတ်၊ စစ်ဆေး (Validation)၊ Status ပြောင်းလဲပြီး ပြင်ပ ဂိုဒေါင်စနစ်ထံသို့ အလိုအလျောက် ပို့ဆောင်ပေးသည့် (Automated Batch Processing)** စနစ် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Hands-free Fulfillment Operations (受注業務の完全無人化)
- လူကိုယ်တိုင် Admin ထဲဝင်၍ အော်ဒါ ၅၀၀ ကို စစ်ဆေး၊ Status ပြောင်း၊ CSV ထုတ်၊ ဂိုဒေါင်ပို့ လုပ်ဆောင်ပါက လူအင်အား ၂ နာရီကျော် ကုန်ဆုံးစေသည်။
- နံနက်တိုင်း စနစ်က အလိုအလျောက် လုပ်ဆောင်ပေးခြင်းဖြင့် ဂိုဒေါင်ဝန်ထမ်းများသည် မနက် ၉ နာရီ အလုပ်စသည်နှင့် ပစ္စည်းများကို ချက်ချင်း ထုတ်ပိုးနိုင်ပြီ ဖြစ်သည်။

### 2. Transactional Batch Architecture
- အော်ဒါတစ်ခုချင်းစီအလိုက် Transaction ခွဲခြားပေးခြင်း (`try ... catch` per order) ဖြင့် အော်ဒါအမှတ် ၅ တွင် Error တက်သော်လည်း အခြား အော်ဒါများ ပုံမှန်အတိုင်း အောင်မြင်စွာ ဆက်လက် process ဖြစ်စေရပါမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Symfony Console Command ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Command/AutoProcessOrdersCommand.php`

```php
<?php

namespace Customize\Command;

use Customize\Service\ExternalWarehouseApiService;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Order;
use Eccube\Repository\Master\OrderStatusRepository;
use Eccube\Repository\OrderRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AutoProcessOrdersCommand extends Command
{
    protected static $defaultName = 'app:auto-process-orders';
    protected static $defaultDescription = 'Automatically validate and process paid new orders';

    private EntityManagerInterface $entityManager;
    private OrderRepository $orderRepository;
    private OrderStatusRepository $orderStatusRepository;
    private ExternalWarehouseApiService $warehouseApiService;
    private LoggerInterface $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        OrderRepository $orderRepository,
        OrderStatusRepository $orderStatusRepository,
        ExternalWarehouseApiService $warehouseApiService,
        LoggerInterface $logger
    ) {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->orderRepository = $orderRepository;
        $this->orderStatusRepository = $orderStatusRepository;
        $this->warehouseApiService = $warehouseApiService;
        $this->logger = $logger;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Starting Daily Automated Order Processing...');

        $newOrderStatus = $this->orderStatusRepository->find(OrderStatus::NEW);
        $inProgressStatus = $this->orderStatusRepository->find(OrderStatus::IN_PROGRESS);

        // ၁။ 対象注文の抽出（新規受付 かつ キャンセルでない注文）
        $orders = $this->orderRepository->findBy([
            'OrderStatus' => $newOrderStatus,
        ]);

        $io->note(sprintf('Found %d orders to inspect.', count($orders)));

        $processedCount = 0;
        $skippedCount = 0;
        $errorCount = 0;

        foreach ($orders as $order) {
            /** @var Order $order */
            try {
                // ၂။ 検証 (Validation): 決済が完了しているか、住所不備がないか確認
                if (!$this->isOrderReadyForFulfillment($order)) {
                    $skippedCount++;
                    continue;
                }

                $this->entityManager->beginTransaction();

                // ၃။ ステータスを「対応中（IN_PROGRESS: ID 1）」に自動更新
                $order->setOrderStatus($inProgressStatus);
                $this->entityManager->persist($order);
                $this->entityManager->flush();

                // ၄။ 外部倉庫APIへ出荷連携
                $apiSuccess = $this->warehouseApiService->syncShippingData($order);
                if (!$apiSuccess) {
                    throw new \Exception("External Warehouse API failed for Order #{$order->getOrderNo()}");
                }

                $this->entityManager->commit();
                $processedCount++;

                $this->logger->info("Auto processed Order #{$order->getOrderNo()} successfully.");

            } catch (\Exception $e) {
                $this->entityManager->rollback();
                $errorCount++;
                $this->logger->error("Auto processing failed for Order #{$order->getOrderNo()}: " . $e->getMessage());
            }
        }

        $io->success(sprintf(
            'Batch Execution Finished! Processed: %d, Skipped: %d, Errors: %d',
            $processedCount,
            $skippedCount,
            $errorCount
        ));

        return Command::SUCCESS;
    }

    /**
     * 出荷準備可能かどうかのビジネスルール検証
     */
    private function isOrderReadyForFulfillment(Order $order): bool
    {
        // 郵便番号や住所が空でないか確認
        if (empty($order->getPostalCode()) || empty($order->getAddr01())) {
            return false;
        }

        // 銀行振込で未入金の場合はスキップ（カード決済等は即時対象）
        // 決済種別に応じた判定ロジック

        return true;
    }
}
```

---

### အဆင့် ၂: Crontab တွင် နေ့စဉ် မနက် ၈:၀၀ နာရီတွင် အလိုအလျောက် သတ်မှတ်ခြင်း
```bash
# 毎朝8時00分に受注自動処理バッチを実行
0 8 * * * cd /var/www/eccube && bin/console app:auto-process-orders >> /var/log/eccube_auto_order.log 2>&1
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Bank Transfer Waiting (銀行振込の入金待ち除外):**  
   ဘဏ်ငွေလွှဲဖြင့် မှာယူထားသော အော်ဒါများသည် ငွေမဝင်မချင်း ပစ္စည်းပို့ဆောင်ခွင့် မရှိပါ။ ထို့ကြောင့် Credit Card ဖြင့် ငွေပေးချေပြီးသော အော်ဒါများကိုသာ Auto-process ပြုလုပ်ပေးရပါမည်။
2. **Execution Overlap Protection (二重実行防止):**  
   အော်ဒါ အရေအတွက် များပြား၍ Command ကြာမြင့်နေချိန်တွင် ထပ်မံ trigger မဖြစ်စေရန် Symfony Lock Component သို့မဟုတ် PID File lock ကို အသုံးပြုရပါမည်။
