---
title: "06. Product Sorting"
description: "> 「商品一覧の並び替え（ソート）セレクトボックスに、既存の『価格順』『新着順』に加えて『人気順（販売個数順 / 売れ筋順）』や『おすすめ順』を追加してください。」"
---

## Task 06: 商品一覧に並び替え機能を追加してください (Product Sorting: Price/New/Popularity)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品一覧の並び替え（ソート）セレクトボックスに、既存の『価格順』『新着順』に加えて『人気順（販売個数順 / 売れ筋順）』や『おすすめ順』を追加してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Product List Page ရှိ စီတန်းရွေးချယ်မှု (Sort Dropdown) တွင် ပုံမှန်ပါဝင်သော "ဈေးနှုန်းအနိမ့်/အမြင့်"၊ "အသစ်ရောက်ပစ္စည်း" အပြင် **"လူကြိုက်အများဆုံး/အရောင်းရဆုံး အစီအစဉ် (Popularity / Sales Count)"** ကို ထပ်တိုးပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Database အဆင့်တွင် Order By (QueryBuilder) ပြုလုပ်ရသည့် အကြောင်းပြချက်
- ပစ္စည်းအရေအတွက် ထောင်သောင်းချီ ရှိသောအခါ PHP Array ထဲသို့ ပစ္စည်းအားလုံး ဆွဲတင်ပြီး Sort လုပ်ပါက Memory Exhausted (Out of Memory) ဖြစ်သွားပါမည်။
- Pagination (Page 1, 2, 3) တိကျစေရန် SQL Query ၏ `ORDER BY` clause တွင် Database Engine မှ တိုက်ရိုက် စီတန်းခိုင်းရမည်။

### 2. QueryCustomizer Architecture ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- EC-CUBE 4.2+ တွင် Repository Code ကို Direct Override လုပ်စရာမလိုဘဲ `QueryCustomizer` ဖြင့် Event-driven သဘောတရားအတိုင်း သန့်ရှင်းစွာ Order By logic ထည့်သွင်းနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Sort Dropdown Form တွင် ရွေးချယ်စရာ အသစ် ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/ProductListOrderByExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\SearchProductBlockType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;

class ProductListOrderByExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [SearchProductBlockType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // ရှိပြီးသား orderby choice များကို extension ဖြင့် ထပ်မံ ဖြည့်စွက်နိုင်သည်
        // EC-CUBE Master Data (mtb_product_list_order_by) တွင် ထည့်သွင်းခြင်း သို့မဟုတ် Form အဆင့်တွင် override ပြုလုပ်နိုင်သည်
    }
}
```
*(အကြံပြုချက်: ဂျပန် EC-CUBE တွင် အများအားဖြင့် DB Table `mtb_product_list_order_by` ထဲသို့ ID: 5, Name: "人気順" ဟု Record ထည့်သွင်းလေ့ရှိသည်)*

---

### အဆင့် ၂: QueryCustomizer ဖြင့် Order By SQL သတ်မှတ်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/ProductPopularitySortCustomizer.php`

```php
<?php

namespace Customize\Repository;

use Eccube\Doctrine\Query\QueryCustomizer;
use Doctrine\ORM\QueryBuilder;

class ProductPopularitySortCustomizer implements QueryCustomizer
{
    public function customize(QueryBuilder $builder, array $params, array $handling): void
    {
        // User ရွေးချယ်လိုက်သော orderby ID ကို စစ်ဆေးခြင်း
        // ဥပမာ: orderby = 'popularity' သို့မဟုတ် ID 5
        if (isset($params['orderby']) && $params['orderby'] == 'popularity') {
            
            // OrderItem နှင့် LEFT JOIN ချိတ်ဆက်ကာ အရောင်းရဆုံး ပစ္စည်းများကို စီတန်းခြင်း
            $builder
                ->leftJoin('p.OrderItems', 'oi')
                ->addSelect('SUM(oi.quantity) AS HIDDEN total_sales')
                ->groupBy('p.id')
                ->orderBy('total_sales', 'DESC')
                ->addOrderBy('p.id', 'DESC');
        }
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\ProductRepository\getQueryBuilderBySearchData';
    }
}
```

---

### အဆင့် ၃: Twig Template တွင် Sort Link / Dropdown ပြင်ဆင်ခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

```twig
<div class="ec-searchnavRole__action">
    <div class="ec-select">
        <select name="orderby" class="form-control" onchange="this.form.submit();">
            <option value="1" {% if searchData.orderby.id|default('') == 1 %}selected{% endif %}>価格が安い順</option>
            <option value="2" {% if searchData.orderby.id|default('') == 2 %}selected{% endif %}>価格が高い順</option>
            <option value="3" {% if searchData.orderby.id|default('') == 3 %}selected{% endif %}>新着順</option>
            {# 新規追加: 人気順 #}
            <option value="popularity" {% if searchData.orderby == 'popularity' %}selected{% endif %}>人気順（売れ筋）</option>
        </select>
    </div>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Large Scale E-commerce Performance (High Traffic):**  
   `LEFT JOIN OrderItems` သုံး၍ `SUM(quantity)` ကို Dynamic တွက်ချက်ခြင်းသည် Order အချက်အလက် သန်းချီရှိသောအခါ Query ကြာမြင့်နိုင်ပါသည်။ ထို့ကြောင့် Real-world Enterprise Project များတွင် `dtb_product` ထဲ၌ `sales_count` Column သီးသန့်ထည့်ကာ Batch Job သို့မဟုတ် Order Event ဖြင့် Incremental update ပြုလုပ်လေ့ရှိပါသည်။
2. **Deterministic Sort (ပစ္စည်းများ မလွဲချော်စေရန်):**  
   Order By တွင် `addOrderBy('p.id', 'DESC')` ကို အမြဲ ပူးတွဲထည့်သွင်းပေးရပါမည်။ ရောင်းအားအရေအတွက် တူညီနေသော ပစ္စည်းများတွင် ID ဖြင့် Secondary Sort မပါပါက Pagination ကူးပြောင်းချိန်တွင် ပစ္စည်းများ ထပ်နေခြင်း သို့မဟုတ် ပျောက်ဆုံးခြင်း ဖြစ်တတ်ပါသည်။
