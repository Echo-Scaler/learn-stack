---
title: "01. Querybuilder Fundamentals"
description: "> Technical Overview:"
---

## 01 - QueryBuilder Fundamentals (QueryBuilder အခြေခံ သဘောတရား ၁၀ မျိုး)

> **Technical Overview**:  
> EC-CUBE သည် Database မှ ဒေတာများ ဆွဲထုတ်ရာတွင် Raw SQL အစား Symfony ၏ **Doctrine ORM QueryBuilder** ကို အသုံးပြုပါသည်။ QueryBuilder ၏ အဓိက Method ၁၀ မျိုး၏ သဘောတရားနှင့် အလုပ်လုပ်ပုံကို Raw SQL များနှင့် နှိုင်းယှဉ်၍ အသေးစိတ် ရှင်းပြထားပါသည်။

---

## 📚 QueryBuilder Methods ၁၀ မျိုး မာတိကာဇယား

| QueryBuilder Method | SQL သဘောတရား | အသုံးပြုပုံ အဓိပ္ပာယ် |
|:---|:---|:---|
| `where()` | `WHERE` | ပထမဆုံး မဖြစ်မနေ စည်းမျဉ်း သတ်မှတ်ခြင်း (Overwrite ဖြစ်တတ်သည်) |
| `andWhere()` | `AND WHERE` | ရှိပြီးသား စည်းမျဉ်းများအပေါ် အခြား စည်းမျဉ်းများ ထပ်ဆောင်းခြင်း |
| `innerJoin()` | `INNER JOIN` | ဇယား ၂ ခုစလုံးတွင် တူညီသော ဒေတာ ရှိမှသာ ဆွဲထုတ်ခြင်း |
| `leftJoin()` | `LEFT JOIN` | ညာဘက်ဇယားတွင် ဒေတာမရှိစေကာမူ ဘယ်ဘက်ဇယားမှ အချက်အလက်များ မပျောက်ဘဲ ဆွဲထုတ်ခြင်း |
| `orderBy() / addOrderBy()` | `ORDER BY` | အကြီးမှအငယ် (DESC) သို့မဟုတ် အငယ်မှအကြီး (ASC) စီတန်းခြင်း |
| `groupBy()` | `GROUP BY` | ကုန်ပစ္စည်း ID အလိုက် အုပ်စုဖွဲ့ စုစည်းခြင်း |
| `select('COUNT(...)')` | `COUNT()` | အရေအတွက် စုစုပေါင်း တွက်ချက်ခြင်း |
| `expr()->between()` | `BETWEEN ... AND` | တန်ဖိုး ၂ ခုကြား (အနိမ့်ဆုံးနှင့် အမြင့်ဆုံး) စစ်ထုတ်ခြင်း |
| `expr()->like()` | `LIKE '%...%'` | စာသား အစိတ်အပိုင်း ပါဝင်မှု ရှာဖွေခြင်း (Wildcard) |
| `expr()->in()` | `IN (...)` | တန်ဖိုးများစွာထဲမှ တစ်ခုခုနှင့် ကိုက်ညီမှု စစ်ဆေးခြင်း |

---

## 🔍 တစ်ခုချင်းစီ အသေးစိတ် ရှင်းလင်းချက်နှင့် Code ဥပမာများ

### 1. `where()` vs `andWhere()`
> ⚠️ **Junior Developer များ အဖြစ်အများဆုံး အမှား**:  
> `where()` ကို အကြိမ်ကြိမ် ခေါ်ယူပါက ယခင် ရေးထားသော Condition များ **ပျက်ပြယ် (Overwrite)** သွားပါသည်။ ထို့ကြောင့် Repository Methods များတွင် အမြဲတမ်း **`andWhere()`** ကိုသာ အသုံးပြုရပါမည်။

```php
// ❌ မှားယွင်းသော နည်းလမ်း (Status condition ပျောက်သွားမည်)
$qb->where('p.Status = 1');
$qb->where('p.name LIKE :name'); // ယခင် where('p.Status = 1') ပျက်သွားသည်!

// ✅ မှန်ကန်သော နည်းလမ်း
$qb->where('p.Status = 1')
   ->andWhere('p.name LIKE :name'); // SQL: WHERE p.Status = 1 AND p.name LIKE ...
```

---

### 2. `innerJoin()` vs `leftJoin()`

- **`innerJoin()`**: ချိတ်ဆက်ထားသော Table တွင် ဒေတာ အမှန်တကယ် ရှိမှသာ လိုချင်သည့်အခါ သုံးသည် (ဥပမာ- Category ရွေးထားသော ပစ္စည်းများ)။
- **`leftJoin()`**: ချိတ်ဆက်ထားသော Table တွင် ဒေတာ မရှိစေကာမူ ပင်မ ကုန်ပစ္စည်းကို မပျောက်စေချင်သည့်အခါ သုံးသည် (ဥပမာ- ပုံ မတင်ရသေးသော ကုန်ပစ္စည်းများ၊ စတော့ မရှိသော ပစ္စည်းများ)။

```php
// Product နှင့် ProductClass ကို ချိတ်ဆက်ခြင်း
$qb->innerJoin('p.ProductClasses', 'pc')
   ->leftJoin('p.ProductImage', 'pi'); // ပုံမရှိသော ကုန်ပစ္စည်းလည်း ပါဝင်မည်
```

---

### 3. `orderBy()` နှင့် `addOrderBy()`
ကုန်ပစ္စည်းများကို စီတန်းပြသရာတွင် သုံးပါသည်:
- `ASC` (Ascending): အငယ်မှ အကြီး (စျေးအနည်းဆုံးမှ အများဆုံး)
- `DESC` (Descending): အကြီးမှ အငယ် (အသစ်ဆုံးမှ အဟောင်းဆုံး)

```php
// အသစ်ဆုံးကို အရင်ပြပြီး၊ ရက်စွဲတူပါက ID အလိုက် စီခြင်း
$qb->orderBy('p.create_date', 'DESC')
   ->addOrderBy('p.id', 'DESC');
```

---

### 4. `groupBy()` နှင့် `COUNT()`
ကုန်ပစ္စည်းတစ်ခုတွင် Variation အများအပြား ရှိနေသော်လည်း ကုန်ပစ္စည်းကို ၁ ကြိမ်သာ ပေါ်စေရန်နှင့် အရေအတွက် စုစည်းရန် သုံးပါသည်:

```php
// ကုန်ပစ္စည်း ID အလိုက် Group ဖွဲ့ပြီး စုစုပေါင်း စတော့ အရေအတွက် တွက်ခြင်း
$qb->select('p.id, p.name, COUNT(pc.id) as total_variations')
   ->innerJoin('p.ProductClasses', 'pc')
   ->groupBy('p.id');
```

---

### 5. `BETWEEN` (စျေးနှုန်း အတိုင်းအတာ စစ်ထုတ်ခြင်း)
စျေးနှုန်း အနိမ့်ဆုံးနှင့် အမြင့်ဆုံးကြား ရှာဖွေရာတွင် သုံးပါသည်:

```php
// SQL: WHERE pc.price02 BETWEEN 1000 AND 5000
$qb->andWhere($qb->expr()->between('pc.price02', ':min', ':max'))
   ->setParameter('min', 1000)
   ->setParameter('max', 5000);

// သို့မဟုတ် >= နှင့် <= သုံး၍ ရေးသားခြင်း:
$qb->andWhere('pc.price02 >= :min AND pc.price02 <= :max')
   ->setParameter('min', 1000)
   ->setParameter('max', 5000);
```

---

### 6. `LIKE` (Keyword ရှာဖွေခြင်း)
အမည် သို့မဟုတ် ဖော်ပြချက်စာသားထဲတွင် ရှာဖွေရာတွင် Wildcard (`%`) ဖြင့် သုံးပါသည်:

```php
// SQL: WHERE p.name LIKE '%shirt%'
$qb->andWhere($qb->expr()->like('p.name', ':name'))
   ->setParameter('name', '%'.$keyword.'%');
```

---

### 7. `IN` (တန်ဖိုးများစွာထဲမှ တစ်ခုခု ကိုက်ညီခြင်း)
ရွေးချယ်ထားသော Category ID များ သို့မဟုတ် Product ID များစွာထဲတွင် ပါမပါ စစ်ဆေးရာတွင် သုံးပါသည်:

```php
// SQL: WHERE p.id IN (5, 12, 19, 25)
$productIds = [5, 12, 19, 25];

$qb->andWhere($qb->expr()->in('p.id', ':productIds'))
   ->setParameter('productIds', $productIds);
```

---

## 💻 QueryBuilder အပြည့်အစုံ နမူနာ (Full Query Example)

```php
// ကုန်ပစ္စည်း အမည် 'T-shirt' ပါပြီး စျေးနှုန်း ¥1,000 နှင့် ¥5,000 ကြားရှိသော ပစ္စည်းများကို စျေးပေါရာမှ ကြီးရာသို့ စီထုတ်ခြင်း
$qb = $this->createQueryBuilder('p')
    ->innerJoin('p.ProductClasses', 'pc')
    ->where('p.Status = :status')
    ->andWhere('p.name LIKE :keyword')
    ->andWhere('pc.price02 BETWEEN :min AND :max')
    ->setParameter('status', ProductStatus::STATUS_DISPLAY_SHOW)
    ->setParameter('keyword', '%T-shirt%')
    ->setParameter('min', 1000)
    ->setParameter('max', 5000)
    ->orderBy('pc.price02', 'ASC');

$products = $qb->getQuery()->getResult();
```
