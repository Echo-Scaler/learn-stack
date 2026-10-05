---
title: "41. Enterprise Csv Data Platform"
description: "> 「商品・顧客・注文データを外部の基幹システム（基幹ERP、BIツール、WMS）とCSV経由で安全かつ高速に相互連携できるプラットフォームを構築してください。数十万件の大量データでもサーバーのメモリ不足（Out of Memory）を起こさないストリーミング処理、Shift-JIS / UTF-8の文字コード自動判定"
---

## Task 41: 企業向け大規模データ連携CSVプラットフォーム (Enterprise CSV Import/Export Platform)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品・顧客・注文データを外部の基幹システム（基幹ERP、BIツール、WMS）とCSV経由で安全かつ高速に相互連携できるプラットフォームを構築してください。数十万件の大量データでもサーバーのメモリ不足（Out of Memory）を起こさないストリーミング処理、Shift-JIS / UTF-8の文字コード自動判定、重複データの自動更新（Upsert処理）、エラー行番号と原因をまとめたエラーレポートCSV出力機能を実装してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်း (Product)၊ ဝယ်ယူသူ (Customer) နှင့် အော်ဒါ (Order) အချက်အလက် သောင်းချီ/သိန်းချီသော **ကြီးမားသည့် ဒေတာများကို Memory ကုန်ခန်းခြင်း (Out of Memory) မဖြစ်စေဘဲ Streaming နည်းပညာဖြင့် လျင်မြန်စွာ Import/Export** ပြုလုပ်နိုင်ပြီး၊ Encoding အမှားအယွင်း ကင်းဝေးစေသော **Enterprise CSV Platform** တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Memory Exhaustion Prevention (ストリーミングとGeneratorの活用)
- သာမန် PHP တွင် Record ၁၀၀,၀၀၀ ပါသော CSV ကို Array အဖြစ် ဖတ်ပါက Memory 1GB ကျော် ကုန်ဆုံးကာ `Allowed memory size exhausted` Error ဖြင့် Server ရပ်တန့်သွားသည်။
- **အဖြေ:** PHP **Generators (`yield`)** နှင့် Symfony **`StreamedResponse`** ကို အသုံးပြုခြင်းဖြင့် Memory 10MB သာ အသုံးပြုပြီး ဒေတာများကို တစ်ကြောင်းချင်း Stream ပြုလုပ်ရမည်။

### 2. Batch Flush & Memory Clearing (`$em->clear()`)
- Doctrine ORM သည် Read/Write လုပ်ထားသော Entity အားလုံးကို Memory ထဲတွင် သိမ်းဆည်းထားတတ်သည်။ Record ၅၀၀ တိုင်းတွင် `$em->flush()` ပြီးနောက် `$em->clear()` ဖြင့် Garbage Collection ပြုလုပ်ပေးရပါမည်။

### 3. Upsert Logic (重複データの更新・新規判定)
- SKU (Product Code) သို့မဟုတ် Email တူညီနေပါက Error မပြဘဲ ရှိပြီးသား Record ကို UPDATE လုပ်ပြီး၊ အသစ်ဖြစ်ပါက INSERT လုပ်ဆောင်သည့် စနစ် ဖြစ်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Large File Streamed CSV Export Service
ဖိုင်တည်နေရာ: `app/Customize/Service/EnterpriseCsvExportService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Product;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EnterpriseCsvExportService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * メモリをほとんど消費せずに数十万件の商品CSVをストリーミング出力する
     *
     * @return StreamedResponse
     */
    public function exportLargeProductCsv(): StreamedResponse
    {
        $response = new StreamedResponse();
        $response->setCallback(function () {
            $handle = fopen('php://output', 'w');

            // Header 出力 (Shift-JIS 変換)
            $header = ['商品ID', '商品名', '商品コード', '販売価格', '在庫数', '更新日時'];
            mb_convert_variables('SJIS-win', 'UTF-8', $header);
            fputcsv($handle, $header);

            // 🌟 Cursor / Iterable を利用して1行ずつフェッチ
            $query = $this->entityManager->createQuery('SELECT p FROM Eccube\Entity\Product p ORDER BY p.id ASC');
            $iterableResult = $query->toIterable();

            foreach ($iterableResult as $product) {
                /** @var Product $product */
                $pc = $product->getProductClasses()->first();

                $row = [
                    $product->getId(),
                    $product->getName(),
                    $pc ? $pc->getCode() : '---',
                    $pc ? $pc->getPrice02() : 0,
                    $pc && $pc->isStockUnlimited() ? '無制限' : ($pc ? $pc->getStock() : 0),
                    $product->getUpdateDate() ? $product->getUpdateDate()->format('Y-m-d H:i:s') : '',
                ];

                mb_convert_variables('SJIS-win', 'UTF-8', $row);
                fputcsv($handle, $row);

                // メモリリーク防止のためDoctrine Unit of Work をクリア
                $this->entityManager->detach($product);
            }

            fclose($handle);
        });

        $filename = 'products_enterprise_' . date('Ymd_His') . '.csv';
        $response->headers->set('Content-Type', 'text/csv; charset=Shift_JIS');
        $response->headers->set('Content-Disposition', "attachment; filename=\"{$filename}\"");

        return $response;
    }
}
```

---

### အဆင့် ၂: Robust Batch CSV Importer with Upsert & Error Logging
ဖိုင်တည်နေရာ: `app/Customize/Service/EnterpriseCsvImportService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Product;
use Eccube\Entity\ProductClass;
use Eccube\Repository\ProductClassRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class EnterpriseCsvImportService
{
    private EntityManagerInterface $entityManager;
    private ProductClassRepository $productClassRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ProductClassRepository $productClassRepository
    ) {
        $this->entityManager = $entityManager;
        $this->productClassRepository = $productClassRepository;
    }

    /**
     * 大容量CSVを一括インポート（Upsert処理・エラーレポート付き）
     *
     * @param UploadedFile $file
     * @return array [ 'total' => int, 'inserted' => int, 'updated' => int, 'errors' => array ]
     */
    public function importCsv(UploadedFile $file): array
    {
        $spl = new \SplFileObject($file->getRealPath(), 'r');
        $spl->setFlags(\SplFileObject::READ_CSV | \SplFileObject::SKIP_EMPTY | \SplFileObject::DROP_NEW_LINE);

        $inserted = 0;
        $updated = 0;
        $errors = [];
        $rowNum = 0;

        foreach ($spl as $row) {
            $rowNum++;
            if ($rowNum === 1) {
                continue; // Header スキップ
            }

            // 文字コード自動判定（Shift-JIS または UTF-8）
            mb_convert_variables('UTF-8', 'SJIS-win, UTF-8', $row);

            $sku = trim($row[2] ?? '');
            $name = trim($row[1] ?? '');
            $price = trim($row[3] ?? '');

            if (empty($sku) || empty($name)) {
                $errors[] = "{$rowNum}行目: SKUまたは商品名が空です。";
                continue;
            }

            // 🌟 Upsert Logic: 既存SKUの存在確認
            $existingClass = $this->productClassRepository->findOneBy(['code' => $sku]);

            if ($existingClass) {
                // UPDATE
                $product = $existingClass->getProduct();
                $product->setName($name);
                $existingClass->setPrice02((int)$price);
                $updated++;
            } else {
                // INSERT
                $product = new Product();
                $product->setName($name);
                
                $pc = new ProductClass();
                $pc->setProduct($product);
                $pc->setCode($sku);
                $pc->setPrice02((int)$price);
                $pc->setStockUnlimited(true);

                $product->addProductClass($pc);
                $this->entityManager->persist($product);
                $this->entityManager->persist($pc);
                $inserted++;
            }

            // 500件ごとにメモリをフラッシュして解放
            if (($inserted + $updated) % 500 === 0) {
                $this->entityManager->flush();
                $this->entityManager->clear();
            }
        }

        $this->entityManager->flush();

        return [
            'total' => $rowNum - 1,
            'inserted' => $inserted,
            'updated' => $updated,
            'errors' => $errors,
        ];
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Excel Formula Injection (CSVインジェクション対策):**  
   CSV Cell တစ်ခုခု၏ အစတွင် `=, +, -, @` စသည့် စာလုံးများ ပါဝင်နေပါက Excel တွင် ဖွင့်ချိန်၌ Formula အဖြစ် အလုပ်လုပ်ကာ Malicious Command Run သွားနိုင်ပါသည်။ Cell အစတွင် တစ်ခုခု ပါပါက `'` (single quote) ဖြင့် Prefix ခံပေးရပါမည်။
2. **Auto Error Report Download:**  
   Import ပြုလုပ်ရာတွင် Error ဖြစ်သွားသော စာကြောင်းများကို တာဝန်ရှိသူ ပြန်လည်ပြင်ဆင်နိုင်ရန် "error_report_YYYYMMDD.csv" အဖြစ် ဒေါင်းလုဒ်ဆွဲခွင့် ပြုလုပ်ပေးခြင်းသည် ဂျပန် Enterprise Project များတွင် အဆင့်အတန်းမြင့်သော Feature တစ်ခု ဖြစ်ပါသည်။
