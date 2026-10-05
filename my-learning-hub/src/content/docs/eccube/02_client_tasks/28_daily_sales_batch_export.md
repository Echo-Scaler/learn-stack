---
title: "28. Daily Sales Batch Export"
description: "> 「経理部門および経営管理のため、毎日深夜0時（または翌朝）に、前日1日分（00:00:00〜23:59:59）の売上データ（注文番号、購入日時、顧客名、商品小計、消費税、送料、合計金額、決済方法）を集計したCSVファイルを自動生成し、サーバー上の指定フォルダに保存（または経理宛てにメール添付送信）してください。」"
---

## Task 28: 毎日売上データを自動出力してください (Daily Sales Batch CSV Export)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「経理部門および経営管理のため、毎日深夜0時（または翌朝）に、前日1日分（00:00:00〜23:59:59）の売上データ（注文番号、購入日時、顧客名、商品小計、消費税、送料、合計金額、決済方法）を集計したCSVファイルを自動生成し、サーバー上の指定フォルダに保存（または経理宛てにメール添付送信）してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
နေ့စဉ် ညသန်းခေါင်အချိန်တိုင်းတွင် ယမန်နေ့ တစ်ရက်တာအတွင်း ရောင်းချခဲ့ရသော **စာရင်းကိုင် အရောင်းစာရင်း (Daily Sales CSV Report)** ကို **Symfony Console Batch Command** ဖြင့် အလိုအလျောက် ထုတ်ယူ (Daily Batch Export) ပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Automated Accounting & Audit (日次決算・集計の自動化)
- လူကိုယ်တိုင် နေ့တိုင်း Admin Panel ထဲဝင်ပြီး CSV Download ဆွဲနေစရာမလိုဘဲ Cron Batch ဖြင့် အလိုအလျောက် ထုတ်ယူထားခြင်းဖြင့် စာရင်းကိုင် လုပ်ငန်းစဉ်များကို အမှားအယွင်းကင်းစွာ လည်ပတ်စေနိုင်သည်။

### 2. High Performance Batch Export Architecture
- Memory စားသုံးမှု နည်းပါးစေရန် Order အားလုံးကို Array တစ်ပြိုင်နက် မဆွဲဘဲ Doctrine ၏ `toIterable()` သို့မဟုတ် Cursor Pagination ကို အသုံးပြုကာ CSV သို့ တိုက်ရိုက် Stream ရေးသားခြင်းသည် Server Crash မဖြစ်စေသော နည်းလမ်းကောင်း ဖြစ်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Daily Sales Export Command ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Command/DailySalesExportCommand.php`

```php
<?php

namespace Customize\Command;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Order;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DailySalesExportCommand extends Command
{
    protected static $defaultName = 'app:export-daily-sales';
    protected static $defaultDescription = 'Export previous day sales data to CSV';

    private EntityManagerInterface $entityManager;
    private string $exportDir;

    public function __construct(EntityManagerInterface $entityManager, string $projectDir)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->exportDir = $projectDir . '/var/export/sales';
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Exporting Daily Sales CSV...');

        if (!is_dir($this->exportDir)) {
            mkdir($this->exportDir, 0775, true);
        }

        // ယမန်နေ့၏ ရက်စွဲအပိုင်းအခြားကို သတ်မှတ်ခြင်း (00:00:00 - 23:59:59)
        $yesterday = new \DateTime('-1 day');
        $startDate = new \DateTime($yesterday->format('Y-m-d 00:00:00'));
        $endDate = new \DateTime($yesterday->format('Y-m-d 23:59:59'));

        $filename = sprintf('%s/sales_%s.csv', $this->exportDir, $yesterday->format('Ymd'));
        $handle = fopen($filename, 'w');

        // CSV Header ရေးသားခြင်း (Shift-JIS conversion for Japanese Excel)
        $header = ['注文番号', '注文日時', 'お名前', '商品小計', '消費税', '送料', 'お支払い合計', '決済方法', 'ステータス'];
        mb_convert_variables('SJIS-win', 'UTF-8', $header);
        fputcsv($handle, $header);

        // Cancel မဟုတ်သော အော်ဒါများကို Query ဆွဲထုတ်ခြင်း
        $qb = $this->entityManager->createQueryBuilder()
            ->select('o')
            ->from(Order::class, 'o')
            ->where('o.order_date BETWEEN :start AND :end')
            ->andWhere('o.OrderStatus != :cancelStatus')
            ->setParameter('start', $startDate)
            ->setParameter('end', $endDate)
            ->setParameter('cancelStatus', OrderStatus::CANCEL)
            ->orderBy('o.order_date', 'ASC');

        $orders = $qb->getQuery()->toIterable();

        $rowCount = 0;
        $totalSales = 0;

        foreach ($orders as $order) {
            /** @var Order $order */
            $row = [
                $order->getOrderNo(),
                $order->getOrderDate()->format('Y/m/d H:i:s'),
                $order->getName01() . ' ' . $order->getName02(),
                $order->getSubtotal(),
                $order->getTax(),
                $order->getDeliveryFeeTotal(),
                $order->getPaymentTotal(),
                $order->getPayment() ? $order->getPayment()->getMethod() : '---',
                $order->getOrderStatus() ? $order->getOrderStatus()->getName() : '---',
            ];

            $totalSales += $order->getPaymentTotal();
            $rowCount++;

            mb_convert_variables('SJIS-win', 'UTF-8', $row);
            fputcsv($handle, $row);
        }

        fclose($handle);

        $io->success(sprintf(
            'CSV Export Complete! Target Date: %s | Total Orders: %d | Total Sales: ¥%s | File: %s',
            $yesterday->format('Y-m-d'),
            $rowCount,
            number_format($totalSales),
            $filename
        ));

        return Command::SUCCESS;
    }
}
```

---

### အဆင့် ၂: Crontab တွင် ညသန်းခေါင် (00:05 AM) တွင် run စေရန် သတ်မှတ်ခြင်း
```bash
# 毎日深夜0時5分に前日売上バッチを実行
5 0 * * * cd /var/www/eccube && bin/console app:export-daily-sales >> /var/log/daily_sales.log 2>&1
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Date Range Timezone (JST vs UTC):**  
   Server ၏ Timezone သည် UTC ဖြစ်နေပါက ဂျပန်စံတော်ချိန် (JST: UTC+9) နှင့် ၉ နာရီ ကွာခြားသွားသဖြင့် ရက်စွဲလွဲချော်တတ်သည်။ PHP အဆင့်တွင် Timezone ကို `Asia/Tokyo` သေချာစွာ သတ်မှတ်ထားရပါမည်။
2. **Shift-JIS Encoding (Windows Excel Compatibility):**  
   ဂျပန်ကုမ္ပဏီများတွင် Excel ဖြင့် ချက်ချင်း ဖွင့်ကြည့်နိုင်ရန် `SJIS-win` (CP932) သို့ ကူးပြောင်းပေးရပါမည်။ မဟုတ်ပါက 文字化け (Mojibake) ဖြစ်ပြီး စာလုံးများ ဖတ်မရ ဖြစ်သွားပါမည်။
