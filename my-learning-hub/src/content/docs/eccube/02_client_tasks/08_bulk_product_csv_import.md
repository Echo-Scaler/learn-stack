---
title: "08. Bulk Product Csv Import"
description: "> 「多数の商品データを管理画面から1件ずつ登録するのは困難なため、Excelで編集したCSVファイルを使って一括で商品（基本情報、価格、在庫数、カテゴリ）を登録・更新できるようにしてください。エラーがある場合は行番号と原因を表示してください。」"
---

## Task 08: 商品をCSVで一括登録できるようにしてください (Bulk Product CSV Import)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「多数の商品データを管理画面から1件ずつ登録するのは困難なため、Excelで編集したCSVファイルを使って一括で商品（基本情報、価格、在庫数、カテゴリ）を登録・更新できるようにしてください。エラーがある場合は行番号と原因を表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပစ္စည်းအသစ် အများအပြားကို Admin Panel မှ တစ်ခုချင်း ရိုက်ထည့်မည့်အစား **CSV ဖိုင်ဖြင့် တစ်ပြိုင်နက် Upload တင်၍ အမြောက်အမြား တင်သွင်း (Bulk Import)** နိုင်ရန်နှင့် အမှားပါက မည်သည့် အကြောင်းကြောင့် မည်သည့် စာကြောင်းတွင် မှားနေသည်ကို တိကျစွာ ပြသပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Database Transaction ကို မဖြစ်မနေ အသုံးပြုရသည့် အကြောင်းပြချက်
- CSV ဖိုင်တွင် Record ပေါင်း ၅၀၀ ပါဝင်ပြီး စာကြောင်းအမှတ် ၃၀၀ တွင် Data မှားယွင်းပါက ရှေ့ပိုင်း ၂၉၉ ခုသာ DB ထဲ ဝင်သွားပြီး ကျန်တာ မဝင်ပါက Data မညီမညွတ် (Inconsistency) ဖြစ်သွားမည်။
- **အဖြေ:** `EntityManager` ၏ `$em->beginTransaction()`, `$em->commit()`, `$em->rollback()` ကို အသုံးပြုကာ အားလုံးမှန်မှသာ DB ထဲ သိမ်းဆည်းရန် လိုအပ်ပါသည်။

### 2. Symfony Validator နှင့် CsvImportService သဘောတရား
- CSV ဖတ်ရာတွင် တိုက်ရိုက် SQL INSERT မလုပ်ဘဲ Symfony Validator ဖြင့် Numeric check, Length check ပြုလုပ်ပြီး Entity မှတစ်ဆင့် Persist လုပ်ခြင်းသည် EC-CUBE ၏ Data Integrity စံချိန်စံညွှန်း ဖြစ်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: CSV Import Service Logic ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/ProductCsvImportService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Product;
use Eccube\Entity\ProductClass;
use Eccube\Entity\Master\ProductStatus;
use Eccube\Repository\Master\ProductStatusRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ProductCsvImportService
{
    private EntityManagerInterface $entityManager;
    private ProductStatusRepository $productStatusRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ProductStatusRepository $productStatusRepository
    ) {
        $this->entityManager = $entityManager;
        $this->productStatusRepository = $productStatusRepository;
    }

    /**
     * CSVファイルを読み込み商品を一括登録・更新する
     *
     * @param UploadedFile $file
     * @return array [ 'success' => bool, 'imported_count' => int, 'errors' => array ]
     */
    public function import(UploadedFile $file): array
    {
        $errors = [];
        $importedCount = 0;

        // CSV ဖိုင် ဖွင့်ဖတ်ခြင်း (UTF-8 / Shift-JIS Conversion)
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return ['success' => false, 'errors' => ['CSVファイルを開くことができませんでした。']];
        }

        // Header လိုင်းကို ကျော်ဖတ်ခြင်း
        $header = fgetcsv($handle);

        $this->entityManager->beginTransaction();

        try {
            $rowNumber = 1; // Header 제외
            $publicStatus = $this->productStatusRepository->find(ProductStatus::DISPLAY_SHOW);

            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;

                // ဂျပန် Shift-JIS သို့မဟုတ် UTF-8 Encoding ချိန်ညှိခြင်း
                mb_convert_variables('UTF-8', 'SJIS-win, UTF-8', $row);

                // CSV Column: 0: 商品名, 1: 商品コード, 2: 価格, 3: 在庫数
                $name = trim($row[0] ?? '');
                $code = trim($row[1] ?? '');
                $price = trim($row[2] ?? '');
                $stock = trim($row[3] ?? '');

                // Validation စစ်ဆေးခြင်း
                if (empty($name)) {
                    $errors[] = "{$rowNumber} 行目: 商品名が未入力です。";
                    continue;
                }
                if (!is_numeric($price) || (int)$price < 0) {
                    $errors[] = "{$rowNumber} 行目: 価格は0以上の半角数字で入力してください。";
                    continue;
                }

                // Product Entity ဖန်တီးခြင်း
                $product = new Product();
                $product->setName($name);
                $product->setStatus($publicStatus);

                // ProductClass (SKU / Price / Stock) ဖန်တီးခြင်း
                $productClass = new ProductClass();
                $productClass->setProduct($product);
                $productClass->setCode($code);
                $productClass->setPrice02((int) $price);
                
                if ($stock === '' || $stock === null) {
                    $productClass->setStockUnlimited(true);
                } else {
                    $productClass->setStockUnlimited(false);
                    $productClass->setStock((int) $stock);
                }

                $product->addProductClass($productClass);

                $this->entityManager->persist($product);
                $this->entityManager->persist($productClass);

                $importedCount++;

                // Memory မပြည့်စေရန် Batch Flush ပြုလုပ်ခြင်း
                if ($importedCount % 50 === 0) {
                    $this->entityManager->flush();
                }
            }

            // Error တစ်ခုမှ မရှိမှသာ Commit ပြုလုပ်မည်
            if (empty($errors)) {
                $this->entityManager->flush();
                $this->entityManager->commit();
                fclose($handle);
                return ['success' => true, 'imported_count' => $importedCount, 'errors' => []];
            } else {
                $this->entityManager->rollback();
                fclose($handle);
                return ['success' => false, 'imported_count' => 0, 'errors' => $errors];
            }

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            fclose($handle);
            return ['success' => false, 'errors' => ['システムエラーが発生しました: ' . $e->getMessage()]];
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Character Encoding (Shift-JIS vs UTF-8 BOM):**  
   ဂျပန် Client အများစုသည် Windows Excel မှ CSV ထုတ်ယူလေ့ရှိရာ **Shift-JIS (CP932)** Encoding ဖြစ်နေတတ်သည်။ `mb_convert_variables` ဖြင့် UTF-8 သို့ မပြောင်းလဲပါက စာလုံးပေါင်းများ ပျက်ယွင်း (文字化け - Mojibake) သွားပါမည်။
2. **Memory Limit & Execution Time:**  
   စာရင်း ၅,၀၀၀ ကျော်ရှိပါက `set_time_limit(0)` သတ်မှတ်ပေးရန် သို့မဟုတ် Symfony Console Command (Task 28) ဖြင့် Background Job အနေဖြင့် စီမံခန့်ခွဲသင့်ပါသည်။
