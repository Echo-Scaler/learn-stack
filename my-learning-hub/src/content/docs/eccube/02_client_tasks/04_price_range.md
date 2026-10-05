---
title: "04. Price Range"
description: "> 「規格（サイズや容量など）によって価格が異なる商品について、一覧画面で最低価格のみではなく『¥1,000 ～ ¥3,500 (税込)』のように価格帯の範囲を表示するようにしてください。」"
---

## Task 04: 商品一覧に価格帯を表示してください (Price Range Display)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「規格（サイズや容量など）によって価格が異なる商品について、一覧画面で最低価格のみではなく『¥1,000 ～ ¥3,500 (税込)』のように価格帯の範囲を表示するようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပစ္စည်းတစ်ခုတည်းတွင် 規格 (Variations - အရွယ်အစား၊ အရေအတွက်) ပေါ်မူတည်၍ ဈေးနှုန်းများ ကွာခြားပါက Product List Page တွင် အနိမ့်ဆုံးဈေး တစ်ခုတည်း မဟုတ်ဘဲ **အနိမ့်ဆုံးဈေးမှ အမြင့်ဆုံးဈေး အထိ (Price Range)** ကို တိကျစွာ ဖော်ပြပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE ၏ Tax & Price Calculation Architecture
- EC-CUBE 4 တွင် ဈေးနှုန်းများစွာ ကွာခြားနိုင်သော Product များအတွက် `Product` Entity ပေါ်တွင် Helper Methods များကို ကြိုတင်စီစဉ်ပေးထားပါသည်:
  - `getPrice02IncTaxMin()`: အခွန်ပါဝင်ပြီး အနိမ့်ဆုံး ရောင်းဈေး
  - `getPrice02IncTaxMax()`: အခွန်ပါဝင်ပြီး အမြင့်ဆုံး ရောင်းဈေး
  - `getPrice02Min()` / `getPrice02Max()`: အခွန်မပါဝင်သေးသော မူရင်းဈေး

### 2. Query Performance အားသာချက်
- EC-CUBE Core သည် `ProductRepository` တွင် Search Query ပြုလုပ်ကတည်းက `ProductClass` ၏ `price02` အပေါ် `MIN` နှင့် `MAX` ကို တွက်ချက်ကာ `Product` Object ထံသို့ တွဲဆက်ပေးပြီး ဖြစ်သည်။
- ထို့ကြောင့် Database သို့ သီးခြား Query ထပ်မံ မေးမြန်းစရာမလိုဘဲ Entity Method များကို Twig မှ တိုက်ရိုက် ခေါ်ယူပြသနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Twig Template တွင် ဈေးနှုန်းအတိုင်းအတာ စစ်ဆေးပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

မူရင်း Price Area နေရာတွင် အောက်ပါ ကုဒ်ဖြင့် အစားထိုးပါ:

```twig
{# 価格帯（Price Range）表示エリア #}
<div class="ec-productRole__price my-2">
    {% if Product.hasProductClass %}
        {% set minPrice = Product.getPrice02IncTaxMin %}
        {% set maxPrice = Product.getPrice02IncTaxMax %}

        {% if minPrice == maxPrice %}
            {# 規格が複数あっても価格が全て同一の場合 #}
            <span class="ec-price font-weight-bold text-dark h5">
                {{ minPrice|price }}
            </span>
            <span class="text-muted small"> (税込)</span>
        {% else %}
            {# 規格によって価格が異なる場合（価格帯表示） #}
            <span class="ec-price font-weight-bold text-danger h5">
                {{ minPrice|price }}
            </span>
            <span class="mx-1 text-muted">～</span>
            <span class="ec-price font-weight-bold text-danger h5">
                {{ maxPrice|price }}
            </span>
            <span class="text-muted small"> (税込)</span>
        {% endif %}
    {% else %}
        {# 規格なし（通常商品）の場合 #}
        <span class="ec-price font-weight-bold text-dark h5">
            {{ Product.getPrice02IncTaxMin|price }}
        </span>
        <span class="text-muted small"> (税込)</span>
    {% endif %}
</div>
```

---

### အဆင့် ၂: Custom Tax Logic သို့မဟုတ် Custom Rounding လိုအပ်ပါက Service အသုံးပြုခြင်း
ဂျပန်နိုင်ငံတွင်軽減税率 (Reduced Tax Rate 8% vs Standard 10%) ရှိသောအခါ TaxRuleService ဖြင့် တိကျစွာ တွက်ချက်လိုပါက:

ဖိုင်တည်နေရာ: `app/Customize/Twig/Extension/PriceRangeExtension.php`

```php
<?php

namespace Customize\Twig\Extension;

use Eccube\Entity\Product;
use Eccube\Service\TaxRuleService;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class PriceRangeExtension extends AbstractExtension
{
    private TaxRuleService $taxRuleService;

    public function __construct(TaxRuleService $taxRuleService)
    {
        $this->taxRuleService = $taxRuleService;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('display_price_range', [$this, 'getDisplayPriceRange'], ['is_safe' => ['html']]),
        ];
    }

    public function getDisplayPriceRange(Product $product): string
    {
        $min = $product->getPrice02IncTaxMin();
        $max = $product->getPrice02IncTaxMax();

        if ($min === null) {
            return '<span class="text-muted">---</span>';
        }

        if ($min === $max) {
            return number_format($min) . ' 円 <small>(税込)</small>';
        }

        return number_format($min) . ' 円 ～ ' . number_format($max) . ' 円 <small>(税込)</small>';
    }
}
```

Twig တွင် ခေါ်ယူအသုံးပြုနည်း:
```twig
<div class="ec-productRole__price">
    {{ display_price_range(Product) }}
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **`|price` Filter ကို အသုံးပြုရန်:**  
   EC-CUBE တွင် ငွေကြေး သင်္ကေတ (Currency Symbol ¥) နှင့် ကော်မာများကို Formatter အနေဖြင့် `{{ price|price }}` ဟု ရေးသားခြင်းသည် Client ၏ Currency Configuration နှင့် ကိုက်ညီပါသည်။
2. **Tax Inclusive (税込) ဖော်ပြရန် မဖြစ်မနေ လိုအပ်ခြင်း:**  
   ဂျပန်နိုင်ငံ၏ စားသုံးသူ ကာကွယ်ရေး ဥပဒေ (総額表示義務 - Total Price Display Obligation) အရ ပစ္စည်းဈေးနှုန်း ပြသရာတွင် အခွန်ပါဝင်ပြီး စုစုပေါင်းဈေး (税込) ကို ထင်ရှားစွာ ပြသရမည်ဟု ဥပဒေအရ သတ်မှတ်ထားသောကြောင့် `getPrice02IncTaxMin` ကို အဓိက သုံးရပါသည်။
