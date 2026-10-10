---
title: "13. Csv Import Export"
description: "> Client Requirements:"
---

## 13 - Product CSV Import & Export (CSV ဖြင့် ကုန်ပစ္စည်း သွင်းခြင်းနှင့် ထုတ်ယူခြင်း)

> **Client Requirements**:
> 1. **Product CSV import (CSV ဖြင့် ကုန်ပစ္စည်းများ အစုလိုက် သွင်းခြင်း)**: ကုန်ပစ္စည်း ရာပေါင်း/ထောင်ပေါင်းများစွာကို တစ်ခုချင်းစီ Admin UI မှ ထည့်မနေဘဲ Excel/CSV ဖိုင်ဖြင့် တစ်ပြိုင်နက်တည်း (Bulk Import / Update) ပြုလုပ်နိုင်ရမည်။
> 2. **Product CSV export (CSV ဒေတာ ထုတ်ယူခြင်း)**: စနစ်ထဲရှိ ကုန်ပစ္စည်း အချက်အလက်များ၊ စျေးနှုန်း၊ စတော့စာရင်းများကို စာရင်းစစ်ရန် သို့မဟုတ် ပြင်ဆင်ရန် CSV ဖိုင်အဖြစ် Download ရယူနိုင်ရမည်။
> 3. **Japanese Excel Compatibility (စာလုံးမပျက်စေရန်)**: ဂျပန်စာလုံးများ Excel တွင် ဖွင့်သည့်အခါ စာလုံးပေါင်း မပျက်စီးစေရန် UTF-8 with BOM သို့မဟုတ် Shift-JIS (CP932) Encoding ကို စနစ်တကျ ထိန်းကျောင်းပေးရမည်။

---

## 🏛️ EC-CUBE Implementation Architecture: CSV System

EC-CUBE တွင် CSV လုပ်ငန်းစဉ်များကို စီမံခန့်ခွဲရန် သီးခြား Database ဇယားဖြစ်သော **`dtb_csv`** နှင့် အောက်ပါ Architecture ကို အသုံးပြုထားပါသည်:

```
                  ┌──────────────────────────────────────────────┐
                  │                 dtb_csv                      │
                  │  (Defines Column Headers, Field Mappings,    │
                  │   Entity Names & Sort Orders)                │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼ (Import Flow)                                 ▼ (Export Flow)
   [Admin uploads CSV File]                       [Admin clicks "CSV Download"]
                 │                                               │
   [ProductCsvImportController]                    [CsvExportService / Controller]
                 │                                               │
   ├── Encoding Detection (Convert to UTF-8)       ├── StreamedResponse (Chunked memory)
   ├── Header Row Validation                       ├── UTF-8 BOM Injection (\xEF\xBB\xBF)
   ├── Line-by-line Processing Loop                ├── Querying dtb_product & classes
   │   ├── Check Product ID (Insert or Update?)    └── Writing to php://output
   │   ├── Category Mapping                        
   │   ├── Stock / Price Mapping                                 │
   │   └── Doctrine Flush every 100 rows                         ▼
                 │                                 [Browser Downloads .csv File]
                 ▼
   [Database Successfully Updated]
```

### သက်ဆိုင်ရာ အဓိက ဖိုင်များ:
- **Import Controller**: `src/Eccube/Controller/Admin/Product/ProductCsvImportController.php`
- **CSV Configuration Table**: `dtb_csv` (Column Headers သတ်မှတ်ချက်များ)
- **CSV Service**: `src/Eccube/Service/CsvExportService.php`

---

## 18. 📥 Product CSV Import (အလုပ်လုပ်ပုံ အသေးစိတ်)

### Insert vs Update မည်သို့ ဆုံးဖြတ်သနည်း?
EC-CUBE ၏ CSV Import သည် CSV ဖိုင်ထဲရှိ **商品ID (Product ID)** ကော်လံအပေါ် အခြေခံ၍ အလိုအလျောက် ဆုံးဖြတ်ပါသည်:

| ကော်လံ အခြေအနေ | စနစ်၏ လုပ်ဆောင်ချက် |
|:---|:---|
| **商品ID ကွက်လပ်ဖြစ်နေပါက (Empty)** | **INSERT**: ကုန်ပစ္စည်း အသစ်အဖြစ် မှတ်ယူပြီး ID အသစ် ထုတ်ပေးကာ Database ထဲ ထည့်သွင်းသည်။ |
| **商品ID နံပါတ် ပါဝင်နေပါက (e.g. 105)** | **UPDATE**: ID 105 ရှိသော မူလကုန်ပစ္စည်းကို ရှာဖွေပြီး စျေးနှုန်း၊ စတော့၊ အမည်များကို ပြင်ဆင် (Overwrite) သည်။ |

### Controller Logic နမူနာ (`ProductCsvImportController.php`):
```php
public function csvProduct(Request $request)
{
    $form = $this->formFactory->createBuilder(ProductCsvImportType::class)->getForm();
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $file = $form->get('import_file')->getData();
        $data = $this->getCsvData($file);

        $this->entityManager->beginTransaction();
        try {
            foreach ($data as $rowNumber => $row) {
                $productId = $row['商品ID'];

                if (!empty($productId)) {
                    // Update ဖြစ်ပါက မူလ Entity ကို ဆွဲထုတ်ခြင်း
                    $Product = $this->productRepository->find($productId);
                } else {
                    // အသစ်ဖြစ်ပါက Entity သစ် ဆောက်ခြင်း
                    $Product = new Product();
                }

                $Product->setName($row['商品名']);
                $Product->setDescriptionDetail($row['商品説明']);

                // Category ချိတ်ဆက်ခြင်း
                // ProductClass (Price, Stock, Code) များ ချိန်ညှိခြင်း...

                $this->entityManager->persist($Product);

                // Memory လျှော့ချရန် အကြောင်း ၁၀၀ ပြည့်တိုင်း DB တွင် Flush လုပ်ခြင်း
                if ($rowNumber % 100 === 0) {
                    $this->entityManager->flush();
                    $this->entityManager->clear();
                }
            }
            $this->entityManager->commit();
            $this->addSuccess('CSV သွင်းယူမှု အောင်မြင်ပါသည်', 'admin');
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->addError('လိုင်းနံပါတ် '.$rowNumber.' တွင် အမှားဖြစ်ပွားပါသည်: '.$e->getMessage(), 'admin');
        }
    }
}
```

---

## 19. 📤 Product CSV Export (အလုပ်လုပ်ပုံ အသေးစိတ်)

### Memory Leak မဖြစ်စေရန် `StreamedResponse` ဖြင့် ရေးသားပုံ:
ကုန်ပစ္စည်း သောင်းနှင့်ချီ ရှိသော ဆိုင်များတွင် CSV ထုတ်ယူပါက Server Memory (RAM) မပြည့်စေရန် `StreamedResponse` ဖြင့် တစ်ကြောင်းချင်း Output ပေးပို့ပါသည်:

```php
public function exportProductCsv(): StreamedResponse
{
    $response = new StreamedResponse();
    $response->setCallback(function () {
        $handle = fopen('php://output', 'w');

        // Excel တွင် ဂျပန်စာ ဖတ်ရစေရန် UTF-8 BOM ထည့်သွင်းခြင်း
        fwrite($handle, "\xEF\xBB\xBF");

        // Header အတန်း ရေးသားခြင်း
        fputcsv($handle, ['商品ID', '商品コード', '商品名', '販売価格', '在庫数', '公開ステータス']);

        // Database မှ ကုန်ပစ္စည်းများကို Batch အလိုက် ဆွဲထုတ်ပြီး ရေးသားခြင်း
        $products = $this->productRepository->findAll();
        foreach ($products as $Product) {
            foreach ($Product->getProductClasses() as $Class) {
                fputcsv($handle, [
                    $Product->getId(),
                    $Class->getCode(),
                    $Product->getName(),
                    $Class->getPrice02(),
                    $Class->isStockUnlimited() ? '無制限' : $Class->getStock(),
                    $Product->getStatus()->getName(),
                ]);
            }
        }
        fclose($handle);
    });

    $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
    $response->headers->set('Content-Disposition', 'attachment; filename="products_'.date('YmdHis').'.csv"');

    return $response;
}
```

---

## ⚡ Client များ မကြာခဏ တွေ့ကြုံရသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ

1. **Excel တွင် ဂျပန်စာလုံးများ မမှန်ခြင်း (文字化け - Mojibake)**:
   - CSV ဖိုင်၏ ထိပ်ဆုံးတွင် UTF-8 BOM (`\xEF\xBB\xBF`) မပါရှိပါက Microsoft Excel သည် ဖိုင်ကို Shift-JIS အဖြစ် အဓိပ္ပာယ်ကောက်ယူသဖြင့် စာလုံးများ ပျက်သွားလေ့ရှိသည်။ Export တွင် BOM ထည့်ပေးခြင်းဖြင့် ဖြေရှင်းနိုင်သည်။
2. **Execution Timeout (Max Execution Time Exceeded)**:
   - CSV အကြောင်းရေ ထောင်နှင့်ချီ သွင်းသည့်အခါ PHP Timeout ဖြစ်သွားနိုင်သည်။ CLI Command (Terminal) ဖြင့် Background Worker မှ Import ပြုလုပ်စေခြင်းဖြင့် ဖြေရှင်းနိုင်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **CSV登録 (CSV Touroku)**: CSV Import / CSV Registration
- **CSV出力 (CSV Shutsuryoku)**: CSV Export / CSV Output
- **一括更新 (Ikkatsu Koushin)**: Bulk / Batch Update
- **文字化け (Mojibake)**: Character Encoding Corruption (စာလုံးပေါင်း ပျက်စီးခြင်း)
- **文字コード (Moji Koudo)**: Character Encoding (UTF-8, Shift-JIS, CP932)
- **項目設定 (Koumoku Settei)**: Column Mapping Configuration
