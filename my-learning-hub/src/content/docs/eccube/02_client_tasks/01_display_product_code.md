---
title: "01. Display Product Code"
description: "> 「商品一覧画面（Product/list）において、各商品のサムネイルや商品名の下に『商品コード』を表示するようにしてください。規格が複数ある場合は代表コードまたは範囲を表示してください。」"
---

## Task 01: 商品一覧に商品コードを表示してください (Display Product Code)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品一覧画面（Product/list）において、各商品のサムネイルや商品名の下に『商品コード』を表示するようにしてください。規格が複数ある場合は代表コードまたは範囲を表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပစ္စည်းစာရင်း (Product List Page) တွင် ပစ္စည်းအမည်နှင့် ပုံအောက်တွင် **Product Code (商品コード)** ကို ဖော်ပြပေးရန် Client မှ တောင်းဆိုခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE ရဲ့ Data Model သဘောတရား (Product vs ProductClass)
- EC-CUBE 4 တွင် `dtb_product` (Product Entity) ထဲတွင် Product Code တိုက်ရိုက် မရှိပါ။
- Product Code သည် SKU အဆင့်ဖြစ်သော `dtb_product_class` (ProductClass Entity) တွင် တည်ရှိပါသည်။
- **အကြောင်းပြချက်:** ပစ္စည်းတစ်ခုတည်းတွင် Color (အနီ၊ အပြာ)၊ Size (S, M, L) စသည့် 規格 (Class Categories) များစွာ ကွဲပြားနိုင်ပြီး 規格 တစ်ခုစီတွင် သီးခြား Product Code ရှိနိုင်သောကြောင့် ဖြစ်သည်။

### 2. Twig Template Customization ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- Controller (`ProductController::index`) မှ `Product` Object list ကို Twig ထံသို့ ရောက်ရှိပြီးသား ဖြစ်သည်။
- ထို့ကြောင့် Controller ကို အသစ် Override ပြုလုပ်စရာမလိုဘဲ Twig template အဆင့်တွင် Entity Method များကို ခေါ်ယူပြသခြင်းသည် အလွယ်ကူဆုံးနှင့် Maintenance အသက်သာဆုံး နည်းလမ်း (Clean Architecture) ဖြစ်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Twig Template တွင် Product Code ဆွဲထုတ်ပြသခြင်း
ပြင်ဆင်ရမည့်ဖိုင်: `app/template/default/Product/list.twig` (သို့မဟုတ် Plugin Template Hook)

Product တစ်ခုချင်းစီကို Loop ပတ်နေသော နေရာ (`{% for Product in pagination %}`) တွင် အောက်ပါ ကုဒ်ကို ထည့်သွင်းပါ:

```twig
{# 商品コード表示エリア #}
<div class="ec-productRole__code">
    <span class="text-muted small">商品コード: </span>
    {% if Product.hasProductClass %}
        {# 規格（SKU）が複数ある場合の処理 #}
        {% set minCode = Product.ProductClasses|first.code %}
        {% set maxCode = Product.ProductClasses|last.code %}
        <span class="font-weight-bold">
            {% if minCode == maxCode %}
                {{ minCode }}
            {% else %}
                {{ minCode }} ～ {{ maxCode }}
            {% endif %}
        </span>
    {% else %}
        {# 規格なし（デフォルト規格のみ）の場合 #}
        <span class="font-weight-bold">
            {{ Product.ProductClasses|first.code|default('---') }}
        </span>
    {% endif %}
</div>
```

---

### အဆင့် ၂: Backend Entity Trait ဖြင့် Clean Code ဖြစ်အောင် ရေးသားနည်း (Recommended)

Twig ထဲတွင် Logic များပြားခြင်းကို ရှောင်ရှားရန် `ProductTrait` တွင် Helper Method ရေးသားထားနိုင်ပါသည်။

ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductTrait.php`

```php
<?php

namespace Customize\Entity;

use Eccube\Annotation\EntityExtension;
use Doctrine\ORM\Mapping as ORM;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductTrait
{
    /**
     * 代表商品コードまたはコード範囲を取得する
     *
     * @return string
     */
    public function getDisplayProductCode(): string
    {
        $productClasses = $this->getProductClasses();
        if ($productClasses->isEmpty()) {
            return '---';
        }

        $codes = [];
        foreach ($productClasses as $pc) {
            if ($pc->getCode() !== null && $pc->getCode() !== '') {
                $codes[] = $pc->getCode();
            }
        }

        if (empty($codes)) {
            return '---';
        }

        $uniqueCodes = array_values(array_unique($codes));
        if (count($uniqueCodes) === 1) {
            return $uniqueCodes[0];
        }

        return $uniqueCodes[0] . ' ～ ' . end($uniqueCodes);
    }
}
```

Trait ရေးသားပြီးပါက Twig တွင် ရိုးရှင်းစွာ ခေါ်ယူနိုင်ပါသည်:

```twig
<div class="ec-productRole__code">
    <span class="text-muted small">商品コード: </span>
    <span class="font-weight-bold">{{ Product.displayProductCode }}</span>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Proxy Generate ပြုလုပ်ရန်:**  
   Trait အသစ်ထည့်သွင်းပါက Terminal မှ Cache & Proxy ပြန်ထုတ်ပေးရပါမည်:
   ```bash
   bin/console eccube:generate:proxies
   bin/console cache:clear --no-warmup
   ```
2. **N+1 Query Problem မဖြစ်အောင် သတိပြုရန်:**  
   Product List တွင် `ProductClasses` ကို Loop ပတ်ပြီး ဆွဲယူရာတွင် Lazy Loading ကြောင့် Query အခါခါ run နိုင်ပါသည်။ EC-CUBE Core ၏ `ProductRepository::getQueryBuilderBySearchData` တွင် `pc` (ProductClass) ကို Join ဆွဲထားပြီးသား ဖြစ်သဖြင့် Safe ဖြစ်သော်လည်း Debug Toolbar ဖြင့် Database Queries အရေအတွက်ကို အမြဲစစ်ဆေးသင့်ပါသည်။
