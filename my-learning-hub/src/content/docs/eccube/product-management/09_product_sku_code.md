---
title: "09. Product Sku Code"
description: "> Client Requirement: ကုန်ပစ္စည်းတိုင်းအတွက် သီးသန့် ကုန်ပစ္စည်းကုဒ် (Product Code / SKU) သတ်မှတ်နိုင်ရမည်။ အဆိုပါ ကုဒ်ကို ဂိုဒေါင် စာရင်းကိုင်စနစ် (Warehouse/"
---

## 09 - Product SKU & Product Code (ကုန်ပစ္စည်း ကုဒ် / SKU စနစ်)

> **Client Requirement**: "ကုန်ပစ္စည်းတိုင်းအတွက် သီးသန့် ကုန်ပစ္စည်းကုဒ် (Product Code / SKU) သတ်မှတ်နိုင်ရမည်။ အဆိုပါ ကုဒ်ကို ဂိုဒေါင် စာရင်းကိုင်စနစ် (Warehouse/ERP System) နှင့် Barcode (JAN Code) ဖတ်ရာတွင် ချိတ်ဆက် အသုံးပြုနိုင်ရမည်။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. **Variation တိုင်းအတွက် SKU သီးခြားရှိခြင်း**: အင်္ကျီအနီ ဆိုဒ် M နှင့် ဆိုဒ် L တို့သည် ဂိုဒေါင်တွင် မတူညီသော Barcode/SKU ကုဒ်များ ဖြစ်ရမည် (ဥပမာ- `TSHIRT-RED-M`, `TSHIRT-RED-L`)။
2. **Duplicate Check (ထပ်နေသော ကုဒ် မဖြစ်စေရန်)**: ကုန်ပစ္စည်းကုဒ် မှားယွင်းထပ်တူကျပါက Form Validation တွင် Error ပြသပေးရန်။
3. **Auto Code Generation**: ကုန်ပစ္စည်း တင်သည့်အခါ Code ကို လက်ဖြင့် မရိုက်ဘဲ စနစ်မှ Auto Format (ဥပမာ- `PROD-{ID}-{RANDOM}`) ဖြင့် ထုတ်ပေးလိုခြင်း။
4. **ရှာဖွေရလွယ်ကူခြင်း**: Admin နှင့် Front Store နှစ်ဖက်စလုံးတွင် Product Code ဖြင့် အလွယ်တကူ ရိုက်ရှာနိုင်ရမည်။

---

## 🏛️ EC-CUBE Implementation Architecture: Code Placement

EC-CUBE တွင် Beginner များ သတိပြုရမည့် အရေးကြီးဆုံး ဗိသုကာအချက်:
> 📌 **`code` (商品コード) Column သည် `dtb_product` တွင် မရှိဘဲ `dtb_product_class` တွင်သာ တည်ရှိပါသည်!**

```
[dtb_product]
├── id: 12
└── name: "Graphic T-Shirt"
         │
         ├── Variation 1: Red / M  ─── [dtb_product_class] code: "TSHIRT-RED-M"
         ├── Variation 2: Red / L  ─── [dtb_product_class] code: "TSHIRT-RED-L"
         └── Variation 3: Blue / M ─── [dtb_product_class] code: "TSHIRT-BLU-M"
```

### အဘယ်ကြောင့် `dtb_product_class` တွင် ထားရှိရသနည်း?
အမှန်တကယ် လက်တွေ့ E-Commerce နှင့် Logistics လုပ်ငန်းများတွင် Color/Size ကွဲပြားသည်နှင့် Barcode ကွဲပြားသွားပါသည်။ ထို့ကြောင့် ကုန်ပစ္စည်း ၁ မျိုးတည်း ဖြစ်စေကာမူ Variation တစ်ခုချင်းစီတွင် သီးခြား Product Code (SKU) ရှိရန် လိုအပ်သောကြောင့် ဖြစ်သည်။

---

## 🗄️ Database Schema & Entity Methods

### `dtb_product_class` Schema:
```sql
ALTER TABLE dtb_product_class ADD code VARCHAR(255) DEFAULT NULL;
```

### `Product` Entity ၏ အကူအညီပေးသော Methods များ:
ကုန်ပစ္စည်းတစ်ခုတွင် Variation များစွာရှိပြီး Code များ ကွဲပြားနေပါက:
```php
// Product.php
$product->getCodeMin(); // ပထမဆုံး / အငယ်ဆုံး Product Code
$product->getCodeMax(); // နောက်ဆုံး / အကြီးဆုံး Product Code
```

### Twig Template တွင် ဖော်ပြခြင်း:
```twig
{# ကုန်ပစ္စည်း Code ကို Front Detail စာမျက်နှာတွင် ပြသခြင်း #}
<div class="product-code text-muted">
    商品コード (Product Code): 
    <span id="product-code-display">
        {% if Product.hasProductClass %}
            {% if Product.codeMin == Product.codeMax %}
                {{ Product.codeMin }}
            {% else %}
                {{ Product.codeMin }} ～ {{ Product.codeMax }}
            {% endif %}
        {% else %}
            {{ Product.ProductClasses[0].code }}
        {% endif %}
    </span>
</div>
```

---

## 💻 Client Customization: Auto-generating SKU Code

အကယ်၍ Client က Product Code ကို လက်ဖြင့် မရိုက်လိုဘဲ Category ID နှင့် Product ID ပေါင်းပြီး Auto ထုတ်ပေးရန် တောင်းဆိုပါက:

### Doctrine PrePersist Listener သို့မဟုတ် Service ဖြင့် ရေးသားပုံ:
```php
namespace Plugin\AutoSku\EventListener;

use Eccube\Entity\ProductClass;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class AutoSkuListener
{
    public function prePersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if ($entity instanceof ProductClass) {
            // Code မထည့်ထားပါက Auto generate ပြုလုပ်ခြင်း
            if (empty($entity->getCode())) {
                $productId = $entity->getProduct() ? $entity->getProduct()->getId() : 'NEW';
                $autoSku = sprintf('SKU-%05d-%s', $productId, strtoupper(substr(uniqid(), -4)));
                $entity->setCode($autoSku);
            }
        }
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **商品コード (Shouhin Koudo)**: Product Code / SKU
- **JANコード (JAN Koudo)**: Japan Article Number (ဂျပန် စံနှုန်း Barcode - 13 digits)
- **品番 (Hinban)**: Model Number / Part Number
- **型番 (Kataban)**: Catalog Number / Model Type
- **コード重複 (Koudo Juufuku)**: Code Duplication / Conflict
