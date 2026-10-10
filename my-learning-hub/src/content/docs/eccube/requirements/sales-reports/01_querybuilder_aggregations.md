---
title: "01. Querybuilder Aggregations"
description: "> Technical Overview:"
---

## 01 - QueryBuilder Aggregation (QueryBuilder စုစည်းတွက်ချက်မှု သဘောတရား ၅ မျိုး)

> **Technical Overview**:  
> ရောင်းအားနှင့် စာရင်းဇယားများ (Reports & Analytics) တည်ဆောက်ရာတွင် သာမန် Single Row Query များ မလုံလောက်ဘဲ စုစုပေါင်းရောင်းရငွေ၊ ပျမ်းမျှတန်ဖိုး၊ အော်ဒါအရေအတွက်များကို တွက်ချက်ပေးသည့် **SQL Aggregation Functions (COUNT, SUM, AVG, GROUP BY, ORDER BY)** ကို အသုံးပြုရပါသည်:

---

## 📊 Aggregation Functions ၅ မျိုး နှိုင်းယှဉ်ချက် ဇယား

| Function / Clause | သဘောတရား | စီးပွားရေးဆိုင်ရာ အသုံးချမှု (E-Commerce Use Case) | Doctrine QueryBuilder တွင် ရေးပုံ |
|:---|:---|:---|:---|
| **`COUNT()`** | အရေအတွက် ရေတွက်ခြင်း | အော်ဒါ အကြိမ်ရေ၊ ဝယ်ယူသူ ဦးရေ စုစုပေါင်း | `->addSelect('COUNT(o.id) AS order_count')` |
| **`SUM()`** | စုစုပေါင်း ပေါင်းစပ်ခြင်း | စုစုပေါင်း ရောင်းရငွေ၊ ရောင်းရသော ကုန်ပစ္စည်း စုစုပေါင်း | `->addSelect('SUM(o.payment_total) AS total_sales')` |
| **`AVG()`** | ပျမ်းမျှ တန်ဖိုး တွက်ခြင်း | ပျမ်းမျှ တစ်ကြိမ်ဝယ်ယူငွေ (Average Order Value / 客単価) | `->addSelect('AVG(o.payment_total) AS avg_sales')` |
| **`GROUP BY`** | အုပ်စုဖွဲ့ စုစည်းခြင်း | နေ့အလိုက် (日別)၊ လအလိုက် (月別)၊ ပစ္စည်းအလိုက် ခွဲထုတ်ခြင်း | `->groupBy('order_date_day')` |
| **`ORDER BY`** | အစီအစဉ် စီတန်းခြင်း | အရောင်းရဆုံးမှ စတင်၍ ငွေပမာဏ အများဆုံးသို့ စီခြင်း | `->orderBy('total_sales', 'DESC')` |

---

## 🔍 တစ်ခုချင်းစီ အသေးစိတ် ရှင်းလင်းချက်နှင့် Code ဥပမာများ

### 1. `COUNT()` - အော်ဒါအရေအတွက်နှင့် ဝယ်ယူသူဦးရေ
အော်ဒါ အရေအတွက်ကို `COUNT(o.id)` ဖြင့် တွက်ပြီး၊ လူဦးရေ မထပ်စေဘဲ သီးခြား ဝယ်ယူသူဦးရေကို `COUNT(DISTINCT o.Customer)` ဖြင့် ရေတွက်ပါသည်:

```php
$qb->select('COUNT(o.id) AS total_orders')
   ->addSelect('COUNT(DISTINCT o.Customer) AS unique_customers')
   ->from('Eccube\Entity\Order', 'o')
   ->where('o.OrderStatus NOT IN (:excludeStatuses)')
   ->setParameter('excludeStatuses', [OrderStatus::ORDER_CANCEL, OrderStatus::ORDER_RETURNED]);
```

---

### 2. `SUM()` - စုစုပေါင်း ရောင်းရငွေနှင့် ကုန်ပစ္စည်း အရေအတွက်
အမှန်တကယ် လက်ခံရရှိသော ရောင်းရငွေ စုစုပေါင်းနှင့် ရောင်းထွက်သွားသော ပစ္စည်းအရေအတွက် စုစုပေါင်း:

```php
$qb->select('SUM(o.payment_total) AS total_revenue') // ငွေ စုစုပေါင်း
   ->addSelect('SUM(oi.quantity) AS total_items_sold') // ပစ္စည်း အရေအတွက် စုစုပေါင်း
   ->from('Eccube\Entity\Order', 'o')
   ->innerJoin('o.OrderItems', 'oi')
   ->where('oi.isProduct = true');
```

---

### 3. `AVG()` - ပျမ်းမျှ တစ်ကြိမ်ဝယ်ယူငွေ (客単価 - Average Order Value)
Customer တစ်ဦးက အော်ဒါ ၁ ကြိမ် တင်တိုင်း ပျမ်းမျှ မည်မျှ သုံးစွဲသွားသနည်း (客単価 = Total Sales / Total Orders):

```php
$qb->select('ROUND(AVG(o.payment_total)) AS average_order_value')
   ->from('Eccube\Entity\Order', 'o');
```

---

### 4. `GROUP BY` - နေ့ရက်၊ လနှင့် ကုန်ပစ္စည်းအလိုက် အုပ်စုဖွဲ့ခြင်း
ရောင်းအားများကို တစ်ရက်ချင်းစီ (သို့မဟုတ်) တစ်လချင်းစီ ခွဲထုတ်ပြသရန်အတွက် အသုံးပြုပါသည်:

> 💡 **Doctrine DQL ရက်စွဲ မှတ်ချက်**:  
> DQL တွင် MySQL ၏ `DATE()` function ကို တိုက်ရိုက် မပံ့ပိုးပါက ရက်စွဲ၏ ပထမ ၁၀ လုံး (YYYY-MM-DD) ကို `SUBSTRING(o.order_date, 1, 10)` ဖြင့် အုပ်စုဖွဲ့နိုင်ပါသည်:

```php
// နေ့အလိုက် (Daily) အုပ်စုဖွဲ့ခြင်း
$qb->select('SUBSTRING(o.order_date, 1, 10) AS order_day')
   ->addSelect('COUNT(o.id) AS order_count')
   ->addSelect('SUM(o.payment_total) AS daily_sales')
   ->from('Eccube\Entity\Order', 'o')
   ->groupBy('order_day')
   ->orderBy('order_day', 'DESC');
```

---

### 5. `ORDER BY` - အများဆုံး ရောင်းအားဖြင့် စီတန်းခြင်း
Aggregation ပြုလုပ်ထားသော Alias (ဥပမာ- `total_sales`) အပေါ် အခြေခံ၍ အကြီးမှ အငယ်သို့ စီတန်းပါသည်:

```php
// အရောင်းရဆုံး ပစ္စည်းများကို အပေါ်ဆုံးမှ ပြသခြင်း
$qb->select('oi.product_name, SUM(oi.quantity) AS total_qty, SUM(oi.priceIncTax * oi.quantity) AS total_sales')
   ->from('Eccube\Entity\OrderItem', 'oi')
   ->groupBy('oi.product_name')
   ->orderBy('total_sales', 'DESC') // အရောင်းရဆုံး ဦးစားပေး
   ->setMaxResults(10);
```

---

## 💻 ပြီးပြည့်စုံသော QueryBuilder ဥပမာ (Full Aggregation Query)

```php
// လွန်ခဲ့သော ရက် ၃၀ အတွင်း နေ့စဉ်ရောင်းအား အစီရင်ခံစာ ဆွဲထုတ်ခြင်း
public function getDailySalesReport(\DateTime $startDate, \DateTime $endDate): array
{
    $qb = $this->entityManager->createQueryBuilder();

    $qb->select('SUBSTRING(o.order_date, 1, 10) AS sales_date')
        ->addSelect('COUNT(o.id) AS order_count')
        ->addSelect('SUM(o.subtotal) AS subtotal_sales')
        ->addSelect('SUM(o.delivery_fee_total) AS total_shipping')
        ->addSelect('SUM(o.payment_total) AS net_sales')
        ->addSelect('ROUND(AVG(o.payment_total)) AS avg_order_value')
        ->from('Eccube\Entity\Order', 'o')
        ->where('o.order_date BETWEEN :start AND :end')
        ->andWhere('o.OrderStatus NOT IN (:excludeStatuses)')
        ->setParameter('start', $startDate)
        ->setParameter('end', $endDate)
        ->setParameter('excludeStatuses', [OrderStatus::ORDER_CANCEL, OrderStatus::ORDER_RETURNED])
        ->groupBy('sales_date')
        ->orderBy('sales_date', 'ASC');

    return $qb->getQuery()->getResult();
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **集計関数 (Shuukei Kansuu)**: Aggregation Functions (`COUNT`, `SUM`, `AVG`)
- **グループ化 (Guruupu-ka)**: Grouping (`GROUP BY`)
- **並び順 (Narabi-jun)**: Order / Sort (`ORDER BY`)
- **ユニーク顧客数 (Yuniiku Kokyakusuu)**: Unique Customer Count (`COUNT(DISTINCT)`)
- **平均客単価 (Heikin Kyakutanka)**: Average Order Value (`AVG()`)
