---
title: "07. Stock Display"
description: "> 「商品一覧ページで、各商品の在庫状況がひと目で分かるようにしてください。『在庫あり（残り◯点）』、在庫が残り少ない場合は『残りわずか（警告色）』、在庫がない場合は『SOLD OUT（完売）』と表示してください。規格がある場合は全規格の合計在庫数を表示してください。」"
---

## Task 07: 商品一覧に在庫数を表示してください (Stock Status & Quantity Display)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品一覧ページで、各商品の在庫状況がひと目で分かるようにしてください。『在庫あり（残り◯点）』、在庫が残り少ない場合は『残りわずか（警告色）』、在庫がない場合は『SOLD OUT（完売）』と表示してください。規格がある場合は全規格の合計在庫数を表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Product List Page တွင် ဝယ်ယူသူများ အလွယ်တကူ သိရှိစေရန် လက်ကျန်စတော့ အရေအတွက် (Stock Quantity)၊ လက်ကျန်နည်းပါက သတိပေးအရောင် (Low Stock Badge)၊ ကုန်သွားပါက "SOLD OUT" အမှတ်အသားကို ဖော်ပြပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE Stock Architecture (Stock vs Stock Unlimited)
- EC-CUBE တွင် ပစ္စည်းတိုင်း၌ တိကျသော ကိန်းဂဏန်း စတော့ ရှိချင်မှ ရှိပါမည်။
- `stock_unlimited` (在庫無制限) = 1 ဖြစ်နေပါက စတော့ အရေအတွက် မသတ်မှတ်ဘဲ အကန့်အသတ်မရှိ ရောင်းချခွင့်ပြုထားခြင်း ဖြစ်သည်။
- ထို့ကြောင့် `stock` တန်ဖိုးတစ်ခုတည်းကို မစစ်ဆေးဘဲ `stock_unlimited` flag ကိုပါ မဖြစ်မနေ ထည့်သွင်း စစ်ဆေးရပါမည်။

### 2. Entity Helper Method ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- Twig Template ထဲတွင် `if stock == 0 and stock_unlimited == 0 ...` စသည့် ရှုပ်ထွေးသော Business Logic များ ထည့်သွင်းမည့်အစား `Product` Entity ပေါ်တွင် Clean Method တစ်ခု ရေးသားထားခြင်းဖြင့် Code Reusability ကောင်းမွန်စေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Product Entity တွင် စတော့ စစ်ဆေးသည့် Logic ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductStockTrait.php`

```php
<?php

namespace Customize\Entity;

use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductStockTrait
{
    /**
     * 合計在庫数および在庫ステータスを判定して返す
     *
     * @return array [ 'status' => 'out_of_stock'|'unlimited'|'low_stock'|'in_stock', 'stock' => int, 'label' => string ]
     */
    public function getStockStatusInfo(): array
    {
        $totalStock = 0;
        $isUnlimited = false;
        $hasAnyStock = false;

        foreach ($this->getProductClasses() as $pc) {
            // 在庫無制限の商品が1つでも含まれる場合
            if ($pc->isStockUnlimited()) {
                $isUnlimited = true;
                $hasAnyStock = true;
                break;
            }

            $stock = (int) $pc->getStock();
            if ($stock > 0) {
                $hasAnyStock = true;
                $totalStock += $stock;
            }
        }

        if (!$hasAnyStock) {
            return [
                'status' => 'out_of_stock',
                'stock' => 0,
                'label' => 'SOLD OUT（完売）',
                'css_class' => 'badge-danger',
            ];
        }

        if ($isUnlimited) {
            return [
                'status' => 'unlimited',
                'stock' => 999,
                'label' => '在庫あり',
                'css_class' => 'badge-success',
            ];
        }

        // 残りわずか判定（例: 5個以下）
        if ($totalStock <= 5) {
            return [
                'status' => 'low_stock',
                'stock' => $totalStock,
                'label' => '残りわずか (残り ' . $totalStock . ' 点)',
                'css_class' => 'badge-warning text-dark',
            ];
        }

        return [
            'status' => 'in_stock',
            'stock' => $totalStock,
            'label' => '在庫あり (残り ' . $totalStock . ' 点)',
            'css_class' => 'badge-success',
        ];
    }
}
```

---

### အဆင့် ၂: Twig Template တွင် Stock Badge ဖော်ပြခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

```twig
{# 在庫状況バッジ #}
{% set stockInfo = Product.stockStatusInfo %}
<div class="ec-productRole__stockStatus my-1">
    <span class="badge {{ stockInfo.css_class }} p-2">
        {% if stockInfo.status == 'out_of_stock' %}
            <i class="fas fa-times-circle"></i>
        {% elseif stockInfo.status == 'low_stock' %}
            <i class="fas fa-exclamation-triangle"></i>
        {% else %}
            <i class="fas fa-check-circle"></i>
        {% endif %}
        {{ stockInfo.label }}
    </span>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Proxy Generate ပြုလုပ်ရန် မမေ့ပါနှင့်:**
   ```bash
   bin/console eccube:generate:proxies
   bin/console cache:clear --no-warmup
   ```
2. **規格（Variations）များအကြား စတော့ ကွဲပြားမှု:**  
   အကယ်၍ Product တစ်ခုတွင် Size S သည် Sold Out ဖြစ်ပြီး Size M သည် စတော့ ကျန်နေပါက Total အားဖြင့် `在庫あり` ဟု ပြသနိုင်သော်လည်း Detail Page တွင် Size ရွေးချယ်မှုအလိုက် တိကျစွာ ခွဲခြားပြသပေးရန် လိုအပ်ပါသည်။
