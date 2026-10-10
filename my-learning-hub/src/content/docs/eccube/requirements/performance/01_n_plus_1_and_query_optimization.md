---
title: "01. N Plus 1 And Query Optimization"
description: "Doctrine ORM ကို အသုံးပြုသော EC-CUBE စနစ်များတွင် ဆိုက်လေးလံရခြင်း၏ အဓိက တရားခံဖြစ်သည့် N+1 Query Problem နှင့် ၎င်းကို ဖြေရှင်းနည်းများ ဖြစ်ပါသည်။"
---

## 01. N+1 Problem & Query Optimization (N+1問題とクエリ最適化)

Doctrine ORM ကို အသုံးပြုသော EC-CUBE စနစ်များတွင် ဆိုက်လေးလံရခြင်း၏ အဓိက တရားခံဖြစ်သည့် **N+1 Query Problem** နှင့် ၎င်းကို ဖြေရှင်းနည်းများ ဖြစ်ပါသည်။

---

## 🔍 N+1 Problem ဆိုတာ အဘယ်နည်း?

အကယ်၍ ကုန်ပစ္စည်း စာရင်းမျက်နှာပြင်တွင် ပစ္စည်း အခု ၅၀ ကို ပြသမည်ဆိုပါစို့:
1. ပစ္စည်း ၅၀ ကို ဆွဲယူရန် Query **၁ ကြိမ်** အလုပ်လုပ်သည် (`SELECT * FROM dtb_product LIMIT 50`)။
2. ထို့နောက် Twig မျက်နှာပြင်တွင် Loop ပတ်၍ ပစ္စည်းတစ်ခုချင်းစီ၏ ဓာတ်ပုံ (`Product.ProductImage`)၊ ဈေးနှုန်းအတန်းအစား (`Product.ProductClasses`) နှင့် ကဏ္ဍ (`Product.ProductCategories`) များကို လှမ်းခေါ်သည့်အခါ Doctrine သည် ပစ္စည်း ၅၀ စီအတွက် သီးခြား Query တစ်ခုစီ ထပ်မံခေါ်ယူပါသည်။
3. အကျိုးဆက်အားဖြင့် စာမျက်နှာ ၁ ခု ပြသရန်အတွက် Database Query ပေါင်း **၁ + ၅၀ + ၅၀ + ၅၀ = ၁၅၁ ကြိမ်** တပြိုင်နက် ခေါ်ယူမိသွားပါသည်။

ဤသို့ Query အကြိမ်ရေ ရာချီ ပေါက်ကွဲများပြားသွားခြင်းကို **N+1 Problem** ဟု ခေါ်ပါသည်။

---

## ⚖️ Before & After နှိုင်းယှဉ်ချက်

```
┌────────────────────────────────────────────────────────────────────────┐
│ ❌ BEFORE (Default Lazy Loading):                                      │
│ • Database Queries: 151 ကြိမ်                                           │
│ • Database Response Time: 2.85 စက္ကန့်                                   │
│ • Memory Usage: 38 MB                                                  │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ ✅ AFTER (QueryBuilder Eager Loading with addSelect):                  │
│ • Database Queries: 1 ကြိမ်တည်းသာ!                                     │
│ • Database Response Time: 0.12 စက္ကန့် (၂၃ ဆ ပိုမိုမြန်ဆန်သည်)            │
│ • Memory Usage: 14 MB                                                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ❌ Before Code (N+1 ပြဿနာ ဖြစ်ပေါ်နေသော ကုဒ်)

### Repository / QueryBuilder:
```php
// ပစ္စည်း Entity များကိုသာ Select လုပ်ထားပြီး ဆက်စပ်ဇယားများကို မခေါ်ယူထားပါ
public function getProductsQueryBuilder(): QueryBuilder
{
    return $this->createQueryBuilder('p')
        ->where('p.Status = 1')
        ->orderBy('p.create_date', 'DESC');
}
```

### Twig Template (`Product/list.twig`):
```twig
{% for Product in pagination %}
    {# ဤနေရာတွင် Product တစ်ခုစီတိုင်းအတွက် Database Query ၁ ကြိမ်စီ ထပ်မံ Run သည်! #}
    <img src="{{ asset(Product.ProductImage[0].file_name, 'save_image') }}">
    
    <h3>{{ Product.name }}</h3>
    
    {# ဈေးနှုန်းအတွက် နောက်ထပ် Query ၁ ကြိမ် ထပ် run သည်! #}
    <p>¥{{ Product.getPrice02IncTaxMin|number_format }}</p>
    
    {# Category အတွက် နောက်ထပ် Query ၁ ကြိမ် ထပ် run သည်! #}
    <span>{{ Product.ProductCategories[0].Category.name }}</span>
{% endfor %}
```

---

## ✅ After Code (Eager Loading ဖြင့် ပြုပြင်ပြီးသော ကုဒ်)

`leftJoin()` နှင့်အတူ `addSelect()` ကို တွဲဖက် အသုံးပြုခြင်းဖြင့် ဆက်စပ်နေသော ဇယားများရှိ အချက်အလက်များကို Database မှ Query **၁ ကြိမ်တည်းဖြင့်** တစ်ပြိုင်နက် ဆွဲယူစေပါသည်:

```php
namespace Customize\Repository;

use Doctrine\ORM\QueryBuilder;
use Eccube\Repository\ProductRepository;

class OptimizedProductRepository extends ProductRepository
{
    public function getOptimizedProductListQuery(): QueryBuilder
    {
        $qb = $this->createQueryBuilder('p')
            // ၁။ ဆက်စပ်ဇယားများကို JOIN ချိတ်ဆက်ခြင်း
            ->leftJoin('p.ProductImage', 'pi')
            ->leftJoin('p.ProductClasses', 'pc')
            ->leftJoin('p.ProductCategories', 'pct')
            ->leftJoin('pct.Category', 'c')
            
            // ၂။ အဓိက အရေးကြီးချက်: addSelect ဖြင့် အချက်အလက်များကို တစ်ခါတည်း ဆွဲယူရန် ညွှန်ကြားခြင်း
            ->addSelect('pi')
            ->addSelect('pc')
            ->addSelect('pct')
            ->addSelect('c')
            
            ->where('p.Status = 1')
            ->orderBy('p.create_date', 'DESC');

        return $qb;
    }
}
```

---

## 💡 Query Optimization Tips (နောက်ထပ် လျှို့ဝှက်ချက်များ)

### ၁။ မလိုအပ်သော Entity တစ်ခုလုံးကို ဆွဲမတင်ပါနှင့် (DTO / Partial Selection)
အကယ်၍ Dropdown List သို့မဟုတ် Auto-complete အတွက် ပစ္စည်း ID နှင့် အမည်သာ လိုအပ်ပါက Entity တစ်ခုလုံး (`SELECT p`) မလုပ်ဘဲ လိုအပ်သော Column များကိုသာ Scalar Array ဖြင့် ရွေးထုတ်ပါ:

```php
// ✅ Memory သက်သာပြီး အလွန်မြန်ဆန်သည်
$results = $this->createQueryBuilder('p')
    ->select('p.id', 'p.name', 'pc.price02')
    ->leftJoin('p.ProductClasses', 'pc')
    ->where('p.Status = 1')
    ->getQuery()
    ->getArrayResult(); // Entity Object မဟုတ်ဘဲ Pure Array ဖြင့် ရယူခြင်း
```

### ၂။ Twig ထဲတွင် Query မခေါ်ယူပါနှင့်
Twig template ထဲတွင် `{{ Product.getOrderItems() }}` ကဲ့သို့သော Database ကို ပြန်သွားခေါ်စေမည့် Method များကို Loop ပတ်၍ မသုံးရပါ။ Controller သို့မဟုတ် Repository ဘက်မှ ကြိုတင်တွက်ချက်ပြီး Array သို့မဟုတ် DTO အဖြစ် ပို့ပေးသင့်ပါသည်။
