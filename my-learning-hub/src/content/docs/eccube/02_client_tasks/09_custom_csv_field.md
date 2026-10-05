---
title: "09. Custom Csv Field"
description: "> 「商品CSVのダウンロードおよびアップロード項目に、独自に追加した『メーカー名（manufacturername）』や『JANコード』の列を追加して、CSV経由で一括出力・編集できるようにしてください。」"
---

## Task 09: 商品CSVに独自項目を追加してください (Custom CSV Field for Products)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品CSVのダウンロードおよびアップロード項目に、独自に追加した『メーカー名（manufacturer_name）』や『JANコード』の列を追加して、CSV経由で一括出力・編集できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
EC-CUBE ၏ ကုန်ပစ္စည်း CSV Output / Input တွင် မိမိတို့ Custom ထည့်သွင်းထားသော Column အသစ်များ (ဥပမာ - ထုတ်လုပ်သူအမည် "Manufacturer" သို့မဟုတ် Barcode "JAN Code") ကို CSV ထဲတွင် ထည့်သွင်း ထုတ်ယူ/တင်သွင်း နိုင်ရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE ၏ CSV Architecture (`dtb_csv` Table)
- EC-CUBE တွင် CSV Column များသည် Code ထဲတွင် Hardcode ရေးထားခြင်း မဟုတ်ပါ။
- Database ရှိ `dtb_csv` table ထဲတွင် CSV Type (1: Product CSV, 2: Order CSV, 3: Customer CSV စသည်) အလိုက် မည်သည့် Entity Field နှင့် ချိတ်ဆက်ရမည်ကို သိမ်းဆည်းထားပါသည်။
- Admin Panel (`設定 > 基本設定 > CSV出力項目設定`) မှတစ်ဆင့်လည်း စီမံခန့်ခွဲနိုင်ပါသည်။

### 2. Entity Trait Extension နှင့် Getter/Setter ချိတ်ဆက်မှု
- `dtb_csv` ၏ `entity_name` တွင် `Eccube\Entity\Product` ဟု သတ်မှတ်ပြီး `field_name` တွင် Trait ထဲက Property (ဥပမာ: `manufacturer_name`) ကို ပေးထားပါက EC-CUBE ၏ `CsvExportService` က `$Product->getManufacturerName()` ကို အလိုအလျောက် ခေါ်ယူသွားပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Product Entity တွင် Field အသစ် ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductCustomFieldTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductCustomFieldTrait
{
    /**
     * @ORM\Column(name="manufacturer_name", type="string", length=255, nullable=true)
     */
    private ?string $manufacturer_name = null;

    public function getManufacturerName(): ?string
    {
        return $this->manufacturer_name;
    }

    public function setManufacturerName(?string $manufacturer_name): self
    {
        $this->manufacturer_name = $manufacturer_name;
        return $this;
    }
}
```

Database Migration Run ခြင်း:
```bash
bin/console doctrine:schema:update --dump-sql --force
bin/console eccube:generate:proxies
```

---

### အဆင့် ၂: Database `dtb_csv` ထဲသို့ Column အသစ် Register ပြုလုပ်ခြင်း
Migration ဖိုင် ရေးသားခြင်း: `app/Customize/DoctrineMigrations/VersionYYYYMMDD_AddManufacturerCsv.php`

```php
<?php

namespace Customize\DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class VersionYYYYMMDD_AddManufacturerCsv extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // dtb_csv: csv_type_id = 1 (CSV_TYPE_PRODUCT)
        $this->addSql("
            INSERT INTO dtb_csv (
                csv_type_id, 
                entity_name, 
                field_name, 
                disp_name, 
                sort_no, 
                enabled, 
                create_date, 
                update_date, 
                discriminator_type
            ) VALUES (
                1, 
                'Eccube\\\\Entity\\\\Product', 
                'manufacturer_name', 
                'メーカー名', 
                99, 
                1, 
                NOW(), 
                NOW(), 
                'csv'
            )
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM dtb_csv WHERE csv_type_id = 1 AND field_name = 'manufacturer_name'");
    }
}
```

Migration Run ခြင်း:
```bash
bin/console doctrine:migrations:migrate
bin/console cache:clear --no-warmup
```

---

### အဆင့် ၃: Admin CSV Export / Import စစ်ဆေးခြင်း
1. Admin Panel သို့ ဝင်ရောက်ပါ (`設定 > 基本設定 > CSV出力項目設定`)။
2. 「商品CSV」ကို ရွေးချယ်ပါ။
3. ထည့်သွင်းထားသော `メーカー名` (Manufacturer Name) ရောက်ရှိနေသည်ကို တွေ့ရမည်ဖြစ်ပြီး Drag & Drop ဖြင့် အစီအစဉ် ရွှေ့ပြောင်းနိုင်ပါသည်။

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Entity Name Backslash Escaping:**  
   SQL ရေးသားရာတွင် `Eccube\\Entity\\Product` ဟု Double Backslash သေချာစွာ ထည့်သွင်းရပါမည်။ သို့မဟုတ်ပါက Class ကို မရှာဖွေနိုင်ဘဲ Reflection Exception ဖြစ်တတ်ပါသည်။
2. **Product vs ProductClass Field ခွဲခြားခြင်း:**  
   အကယ်၍ ထည့်သွင်းလိုသော အချက်အလက်သည် SKU တစ်ခုချင်းစီအလိုက် ကွဲပြားသော အချက် (ဥပမာ - JAN Code) ဖြစ်ပါက Entity Name ကို `Eccube\Entity\ProductClass` ဟု ပေးရပါမည်။ ပစ္စည်းတစ်ခုလုံးအတွက် ဘုံဖြစ်ပါက `Eccube\Entity\Product` ဟု သတ်မှတ်ရပါမည်။
