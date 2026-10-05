---
title: "14. Admin Product List Column"
description: "> 「管理画面の商品マスター一覧（検索結果テーブル）に、現在表示されている『商品名』や『価格』に加えて、『メーカー名』と『総販売数（累計売上個数）』の列を新設し、一覧画面からすぐに実績を確認できるようにしてください。」"
---

## Task 14: 管理画面の商品一覧に項目を追加してください (New Column in Admin Product List)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面の商品マスター一覧（検索結果テーブル）に、現在表示されている『商品名』や『価格』に加えて、『メーカー名』と『総販売数（累計売上個数）』の列を新設し、一覧画面からすぐに実績を確認できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Admin Panel ရှိ ကုန်ပစ္စည်းစာရင်း Table (Admin Product Grid) တွင် မူရင်းပါဝင်သော ကော်လံများအပြင် **"ထုတ်လုပ်သူ (Manufacturer)"** နှင့် **"ရောင်းရပြီး စုစုပေါင်း အရေအတွက် (Total Sold Units)"** ကော်လံအသစ် ၂ ခုကို ဖြည့်စွက် ပြသပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Admin Operation Efficiency (業務効率化)
- ဆိုင်မန်နေဂျာများသည် ပစ္စည်းတစ်ခုစီ၏ Detail ထဲသို့ တစ်ခုချင်း ဝင်မကြည့်ဘဲ List Table တစ်ခုတည်းတွင် အဓိက စီးပွားရေး အချက်အလက် (KPI Data) များကို ချက်ချင်း မြင်တွေ့နိုင်ခြင်းဖြင့် အချိန်ကုန် သက်သာစေပါသည်။

### 2. Twig Override vs Event Hook System
- Admin Table တွင် Column အသစ် ထည့်သွင်းရာ၌ `app/template/admin/Product/index.twig` ကို Copy ကူးယူကာ Custom Template အနေဖြင့် သန့်ရှင်းစွာ ပြင်ဆင်ခြင်းသည် Column Header (`<th>`) နှင့် Body (`<td>`) အစီအစဉ်များကို ဇယားကွက် မရွေ့စေဘဲ အတိအကျ ထိန်းသိမ်းနိုင်သော အကောင်းဆုံး နည်းလမ်း ဖြစ်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Template ဖိုင်ကို Override Folder ထဲသို့ ကူးယူပြင်ဆင်ခြင်း
မူရင်း Template ဖြစ်သော `src/Eccube/Resource/template/admin/Product/index.twig` ကို `app/template/admin/Product/index.twig` သို့ ကူးယူပါ။

---

### အဆင့် ၂: Table Header (`<thead>`) တွင် Column Title ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/admin/Product/index.twig`

Table Header နေရာတွင် အောက်ပါ `<th>` များကို ထည့်သွင်းပါ:

```twig
<thead class="table-active">
    <tr>
        <th class="border-top-0 pt-2 pb-2 text-center pl-3">ID</th>
        <th class="border-top-0 pt-2 pb-2 text-center">画像</th>
        <th class="border-top-0 pt-2 pb-2">商品名・コード</th>
        {# === 新規追加カラム（Header） === #}
        <th class="border-top-0 pt-2 pb-2 text-center">メーカー名</th>
        <th class="border-top-0 pt-2 pb-2 text-right">累計販売数</th>
        {# ================================ #}
        <th class="border-top-0 pt-2 pb-2 text-right">価格</th>
        <th class="border-top-0 pt-2 pb-2 text-right">在庫数</th>
        <th class="border-top-0 pt-2 pb-2">カテゴリ</th>
        <th class="border-top-0 pt-2 pb-2">更新日</th>
        <th class="border-top-0 pt-2 pb-2 pr-3"></th>
    </tr>
</thead>
```

---

### အဆင့် ၃: Table Body (`<tbody>`) တွင် Data Cell ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/admin/Product/index.twig`

Loop ပတ်နေသော အတန်း (`{% for Product in pagination %}`) နေရာတွင် အောက်ပါ `<td>` များကို ထည့်သွင်းပါ:

```twig
<tbody>
{% for Product in pagination %}
    <tr>
        <td class="align-middle text-center pl-3">{{ Product.id }}</td>
        <td class="align-middle text-center">...</td>
        <td class="align-middle">...</td>

        {# === 新規追加カラム（Data Cell） === #}
        {# 1. メーカー名 #}
        <td class="align-middle text-center">
            <span class="badge badge-light border">
                {{ Product.manufacturerName|default('未設定') }}
            </span>
        </td>

        {# 2. 累計販売数（Trait Method သို့မဟုတ် Custom Function ဖြင့် ခေါ်ယူခြင်း） #}
        <td class="align-middle text-right font-weight-bold">
            {{ Product.totalSalesCount|default(0)|number_format }} 点
        </td>
        {# ===================================== #}

        <td class="align-middle text-right">...</td>
        <td class="align-middle text-right">...</td>
        <td class="align-middle">...</td>
        <td class="align-middle">...</td>
    </tr>
{% endfor %}
</tbody>
```

---

### အဆင့် ၄: Product Entity တွင် `getTotalSalesCount` Method ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductAdminExtensionTrait.php`

```php
<?php

namespace Customize\Entity;

use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductAdminExtensionTrait
{
    /**
     * 該当商品の全受注における販売総数を集計して返す
     *
     * @return int
     */
    public function getTotalSalesCount(): int
    {
        $total = 0;
        foreach ($this->getProductClasses() as $pc) {
            foreach ($pc->getOrderItems() as $orderItem) {
                // キャンセルされていない注文のみカウント
                $order = $orderItem->getOrder();
                if ($order && $order->getOrderStatus()->getId() !== \Eccube\Entity\Master\OrderStatus::CANCEL) {
                    $total += (int) $orderItem->getQuantity();
                }
            }
        }
        return $total;
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Table Responsive & Column Width (レスポンシブ崩れ):**  
   Admin Table တွင် Column များ အလွန်အမင်း များပြားလာပါက Screen အပြင်ဘက်သို့ ထွက်သွားခြင်း သို့မဟုတ် Text များ ကျဉ်းကျပ်သွားခြင်း ဖြစ်တတ်ပါသည်။ Column အသစ်များတွင် `white-space: nowrap;` သို့မဟုတ် fixed width (ဥပမာ `style="width: 120px;"`) သတ်မှတ်ပေးသင့်ပါသည်။
2. **Performance Tip:**  
   Admin Table တွင် အတန်းပေါင်း ၅၀ ပြသထားပါက `getTotalSalesCount()` ကို loop ပတ်ကာ ဆွဲယူခြင်းသည် Order များပြားချိန်တွင် နှေးကွေးနိုင်ပါသည်။ Admin Controller သို့မဟုတ် QueryBuilder တွင် `SUM(oi.quantity)` ကို batch ဆွဲယူပြီး Twig သို့ pass လုပ်ခြင်းက ပိုမိုမြန်ဆန်ပါသည်။
