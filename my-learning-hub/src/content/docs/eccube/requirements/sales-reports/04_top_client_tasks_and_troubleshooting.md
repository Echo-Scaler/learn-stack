---
title: "04. Top Client Tasks And Troubleshooting"
description: "> Real-World Client Requirement Guide:"
---

## 04 - Top Client Sales Tasks & Fixes (အရောင်းစာရင်းဆိုင်ရာ အသုံးအများဆုံး Client Tasks များနှင့် ဖြေရှင်းနည်းများ)

> **Real-World Client Requirement Guide**:  
> လုပ်ငန်းခွင်တွင် ဂျပန် Client များနှင့် စာရင်းကိုင်အဖွဲ့များ အများဆုံး တောင်းဆိုလေ့ရှိသော အရောင်းစာရင်းဆိုင်ရာ Task ကြီး ၅ ခုနှင့် ၎င်းတို့ကို အဆင့်ဆင့် ဖြေရှင်းပုံ (Fixing Guide) ကို လက်တွေ့ Code များနှင့်တကွ ဖော်ပြထားပါသည်။

---

## 📌 Task 1: ဖျက်သိမ်းထားသော အော်ဒါများကို ဖယ်ထုတ်၍ အမှန်တကယ် ရောင်းရငွေ (純売上高) တွက်ချက်ခြင်း

> **Client Problem / Complaint**:  
> *"Admin Dashboard တွင် ရောင်းအား ¥10,000,000 (ယန်း ၁ သန်း) ဟု ပြနေသော်လည်း၊ ကုမ္ပဏီဘဏ်စာရင်းထဲတွင် ¥8,500,000 သာ ဝင်လာပါသည်။ ကွာခြားနေသော ယန်း ၁ သိန်းခွဲသည် အဘယ်ကြောင့် ဖြစ်နေသနည်း? အမြန်ဆုံး ဖြေရှင်းပေးပါ။"*

### 🛠️ အကြောင်းရင်းနှင့် ဖြေရှင်းနည်း (The Root Cause & Fix):
- **အကြောင်းရင်း**: Developer သည် `dtb_order` ဇယားမှ `SUM(payment_total)` ကို သာမန်ပေါင်းလိုက်သဖြင့် ဝယ်ယူသူက ဖျက်သိမ်းလိုက်သော အော်ဒါများ (**キャンセル - ID: 3**) နှင့် ပစ္စည်းပြန်ပို့ထားသော အော်ဒါများ (**返品 - ID: 9**) ပါ ရောင်းရငွေထဲတွင် ပါဝင်ပေါင်းစပ်သွားခြင်း ဖြစ်သည်။
- **ဖြေရှင်းနည်း**: QueryBuilder တွင် အဆိုပါ Status များကို မဖြစ်မနေ ဖယ်ထုတ်ပေးရပါမည်:

```php
// ✅ မှန်ကန်သော Net Sales (純売上高) တွက်ချက်နည်း
$qb->select('SUM(o.payment_total) AS net_revenue')
   ->from('Eccube\Entity\Order', 'o')
   // Cancel (3) နှင့် Returned (9) ကို မဖြစ်မနေ ဖယ်ထုတ်ခြင်း
   ->where('o.OrderStatus NOT IN (:invalidStatuses)')
   ->setParameter('invalidStatuses', [
       OrderStatus::ORDER_CANCEL,   // 3: 注文取消し
       OrderStatus::ORDER_RETURNED, // 9: 返品
       OrderStatus::ORDER_PROCESSING // 2: 購入処理中 (ကျရှုံးသွားသော ယာယီအော်ဒါ)
   ]);
```

---

## 📌 Task 2: စာရင်းစစ်ရန်အတွက် ငွေချေနည်းလမ်းအလိုက် ရောင်းအားခွဲထုတ်ခြင်း (決済方法別集計)

> **Client Requirement**:  
> *"ဘဏ်စာရင်းနှင့် ငွေချေစနစ် (GMO/Stripe) တို့မှ လွှဲငွေများကို တိုက်ဆိုင်စစ်ဆေးနိုင်ရန်အတွက် Credit Card ဖြင့် မည်မျှရောင်းရပြီး၊ ဘဏ်လွှဲဖြင့် မည်မျှ၊ CVS ဖြင့် မည်မျှ ရောင်းရသည်ကို ငွေချေနည်းလမ်းအလိုက် ခွဲထုတ်ပြသပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Grouping by Payment Method):
```php
public function getSalesByPaymentMethod(\DateTime $start, \DateTime $end): array
{
    return $this->entityManager->createQueryBuilder()
        ->select('p.method AS payment_method')
        ->addSelect('COUNT(o.id) AS order_count')
        ->addSelect('SUM(o.payment_total) AS total_amount')
        ->from('Eccube\Entity\Order', 'o')
        ->innerJoin('o.Payment', 'p')
        ->where('o.order_date BETWEEN :start AND :end')
        ->andWhere('o.OrderStatus NOT IN (:excludeStatuses)')
        ->setParameter('start', $start)
        ->setParameter('end', $end)
        ->setParameter('excludeStatuses', [OrderStatus::ORDER_CANCEL, OrderStatus::ORDER_RETURNED])
        ->groupBy('p.id')
        ->orderBy('total_amount', 'DESC')
        ->getQuery()
        ->getResult();
}
```

---

## 📌 Task 3: အခွန် ၈% နှင့် ၁၀% ခွဲခြားထားသော အရောင်း CSV ထုတ်ယူခြင်း (消費税区分別売上CSV)

> **Client Requirement**:  
> *"ဂျပန် အခွန်စာရင်းကိုင်ထံ တင်ပြရန်အတွက် စားသောက်ကုန်များအတွက် ၈% အခွန်ရောင်းအား (軽減税率) နှင့် အထွေထွေကုန်စည်များအတွက် ၁၀% အခွန်ရောင်းအားကို သီးခြားစီ ခွဲထုတ်ထားသော CSV ဖိုင် လိုအပ်ပါသည်။"*

### 🛠️ ဖြေရှင်းနည်း:
`dtb_order_item.tax_rate` အပေါ် အခြေခံ၍ အခွန်နှုန်းအလိုက် Group ဖွဲ့ တွက်ချက်ခြင်း:

```php
public function getSalesByTaxRate(\DateTime $month): array
{
    return $this->entityManager->createQueryBuilder()
        ->select('oi.tax_rate AS tax_rate')
        ->addSelect('SUM(oi.price * oi.quantity) AS net_subtotal')
        ->addSelect('SUM((oi.priceIncTax - oi.price) * oi.quantity) AS total_tax_amount')
        ->addSelect('SUM(oi.priceIncTax * oi.quantity) AS total_gross_amount')
        ->from('Eccube\Entity\OrderItem', 'oi')
        ->innerJoin('oi.Order', 'o')
        ->where('o.order_date LIKE :month')
        ->andWhere('o.OrderStatus NOT IN (:excludeStatuses)')
        ->setParameter('month', $month->format('Y-m') . '%')
        ->setParameter('excludeStatuses', [OrderStatus::ORDER_CANCEL, OrderStatus::ORDER_RETURNED])
        ->groupBy('oi.tax_rate')
        ->getQuery()
        ->getResult();
}
```

---

## 📌 Task 4: အော်ဒါ သိန်းချီရှိသော ဆိုင်ကြီးများတွင် Admin စာမျက်နှာ Timeout မဖြစ်စေရန် ညစဉ် Cron Batch ဖြင့် တွက်ချက်ထားခြင်း

> **Client Problem / Performance Issue**:  
> *"ဆိုင်တွင် အော်ဒါ ၂ သိန်းကျော် ရှိလာသောအခါ Admin မှ '売上集計 (Sales Report)' ကို နှိပ်လိုက်ပါက ၁ မိနစ်ခန့် ကြာပြီးနောက် **504 Gateway Timeout** ဖြစ်ပြီး ပွင့်မလာတော့ပါ။"*

### 🛠️ အကြောင်းရင်းနှင့် ဖြေရှင်းနည်း (Pre-aggregated Summary Table):
- **အကြောင်းရင်း**: အော်ဒါပေါင်း ၂ သိန်းရှိသော Table ကြီးကို User က နှိပ်လိုက်တိုင်း `SUM()` နှင့် `COUNT()` လုပ်ပါက Database CPU 100% ပြည့်ပြီး Timeout ဖြစ်သွားခြင်း ဖြစ်သည်။
- **ဖြေရှင်းနည်း**:  
  1. Summary ဇယားသစ် (`dtb_summary_daily_sales`) တစ်ခု ဆောက်သည်။
  2. ည ၁၂ နာရီတိုင်း **Cron Job (Nightly Batch)** ဖြင့် ယမန်နေ့က ရောင်းအားကို ၁ ကြိမ်သာ တွက်ပြီး ထိုဇယားထဲ ထည့်သိမ်းထားသည်။
  3. Admin စာမျက်နှာသည် ထို Pre-calculated ဇယားမှ တိုက်ရိုက် ဆွဲထုတ်သဖြင့် ဒေတာ သန်းချီ ရှိစေကာမူ **၀.၀၅ စက္ကန့်အတွင်း** ချက်ချင်း ပွင့်လာပါမည်:

```bash
# Nightly Batch Command (ညစဉ် သန်းခေါင်ယံ အလိုအလျောက် တွက်ချက်မှု)
bin/console eccube:sales:aggregate-daily
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **純売上高 (Jun-uriagedaka)**: Net Sales (Cancel နှုတ်ပြီး အမှန်တကယ် ရောင်းအား)
- **総売上高 (Sou-uriagedaka)**: Gross Sales (စုစုပေါင်း ရောင်းအား)
- **決済別売上 (Kessai-betsu Uriage)**: Sales by Payment Method
- **消費税内訳 (Shouhizei Uchiwake)**: Tax Breakdown (10% vs 8%)
- **集計バッチ処理 (Shuukei Batchi Shorii)**: Scheduled Aggregation Batch Job
- **タイムアウト対策 (Taimuauto Taisaku)**: Timeout Prevention / Performance Optimization
