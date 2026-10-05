---
title: "07. Subqueries and CTEs"
description: "1. [Subquery ဆိုတာဘာလဲ? (Query အတွင်းရှိ နောက်ထပ် Query)](#၁-subquery-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၇) - Subqueries နှင့် Common Table Expressions (CTEs)
### (Lesson 7: Scalar & Correlated Subqueries, EXISTS vs IN, CTEs & Recursive CTEs)

---

## 📌 မာတိကာ (Contents)
1. [Subquery ဆိုတာဘာလဲ? (Query အတွင်းရှိ နောက်ထပ် Query)](#၁-subquery-ဆိုတာဘာလဲ)
2. [Subqueries အမျိုးအစား ၃ မျိုး](#၂-subqueries-အမျိုးအစား-၃-မျိုး)
   - [၂.၁။ Scalar Subquery (တန်ဖိုး တစ်ခုတည်း ပြန်ပေးခြင်း)](#၂၁-scalar-subquery)
   - [၂.၂။ Multi-Row Subquery (`IN`, `NOT IN`)](#၂၂-multi-row-subquery)
   - [၂.၃။ Correlated Subquery (အတွင်းနှင့် အပြင် အပြန်အလှန် မှီခိုခြင်း)](#၂၃-correlated-subquery)
3. [`EXISTS` vs `IN` (Performance အလွန်မြန်ဆန်သော နည်းလမ်း)](#၃-exists-vs-in)
4. [CTEs (Common Table Expressions - `WITH ... AS`)](#၄-ctes-common-table-expressions)
5. [Recursive CTEs (ခေတ်မီ အဆင့်ဆင့် မိဘ-သားသမီး Hierarchy Tree ရှာဖွေနည်း)](#၅-recursive-ctes)
6. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၆-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Subquery ဆိုတာဘာလဲ?

**Subquery (Inner Query)** ဆိုသည်မှာ အဓိက SQL Query (Outer Query) ၏ အတွင်းထဲတွင် ထည့်သွင်းရေးသားထားသော နောက်ထပ် SELECT Statement တစ်ခု ဖြစ်ပါသည်။

---

## ၂။ Subqueries အမျိုးအစား ၃ မျိုး

### ၂.၁။ Scalar Subquery
တန်ဖိုးတစ်ခုတည်း (Single Value - 1 Row, 1 Column) ကိုသာ ထုတ်ပေးသော Subquery ဖြစ်သည်:

```sql
-- ပျမ်းမျှဈေးနှုန်းထက် ပိုမိုဈေးကြီးသော ပစ္စည်းများကို ရှာဖွေခြင်း
SELECT id, title, price 
FROM products 
WHERE price > (SELECT AVG(price) FROM products);
```
*(အတွင်းထဲရှိ `SELECT AVG(price)` သည် ဥပမာ $450 ဟူသော တန်ဖိုးတစ်ခုတည်း ထွက်လာပြီး အပြင် Query က အဆိုပါ $450 ထက် ကြီးသူများကို ရှာဖွေပေးခြင်း ဖြစ်သည်)*

---

### ၂.၂။ Multi-Row Subquery (`IN`)
တန်ဖိုးများစွာ (List of Values) ထွက်လာပြီး `IN` ဖြင့် စစ်ဆေးခြင်း:

```sql
-- အနည်းဆုံး အော်ဒါတစ်ခု ချဖူးသော အသုံးပြုသူများကို ရှာဖွေခြင်း
SELECT id, name, email 
FROM users 
WHERE id IN (SELECT DISTINCT user_id FROM orders);
```

---

### ၂.၃။ Correlated Subquery
အတွင်း Query သည် အပြင် Query ရှိ Row တစ်ခုချင်းစီ၏ တန်ဖိုးပေါ်တွင် မှီခိုတွက်ချက်ရသော ပုံစံ ဖြစ်သည်:

```sql
-- မိမိ၏ Category အလိုက် ပျမ်းမျှဈေးထက် ပိုကြီးသော ပစ္စည်းများကို ရှာဖွေခြင်း
SELECT p1.title, p1.category_id, p1.price
FROM products AS p1
WHERE p1.price > (
    SELECT AVG(p2.price) 
    FROM products AS p2 
    WHERE p2.category_id = p1.category_id
);
```

---

## ၃။ `EXISTS` vs `IN`

သန်းချီသော ဒေတာများတွင် `IN` အစား **`EXISTS`** ကို အသုံးပြုခြင်းသည် Performance အဆပေါင်းများစွာ သာလွန်ပါသည်:

* **`IN`**: အတွင်း Query မှ ဒေတာအားလုံးကို Memory ထဲ အကုန်ဆွဲထုတ်ပြီးမှ တစ်ခုချင်း တိုက်စစ်သည်။
* **`EXISTS`**: ကိုက်ညီသော ဒေတာ **၁ ခုတည်း တွေ့ရှိသည်နှင့် ချက်ချင်း စစ်ဆေးမှုကို ရပ်တန့် (Short-circuit)** လိုက်သဖြင့် အလွန်မြန်ဆန်သည်။

```sql
-- EXISTS အသုံးပြု၍ အော်ဒါရှိသော ဖောက်သည်များကို ရှာဖွေခြင်း (Fast)
SELECT u.id, u.name 
FROM users AS u
WHERE EXISTS (
    SELECT 1 FROM orders AS o 
    WHERE o.user_id = u.id
);
```

---

## ၄။ CTEs (Common Table Expressions - `WITH ... AS`)

MySQL 8.0 တွင် Subquery များ အထပ်ထပ် ရှုပ်ထွေးနေခြင်း (Spaghetti SQL) ကို ရှင်းလင်းလှပစေရန် **CTE (`WITH ... AS`)** ကို မိတ်ဆက်ခဲ့ပါသည်:

```sql
-- CTE သုံး၍ ဖောက်သည်များ၏ စုစုပေါင်း သုံးစွဲငွေကို အရင် တွက်ချက်ခြင်း
WITH CustomerSpending AS (
    SELECT 
        user_id,
        SUM(total_amount) AS total_spent,
        COUNT(id) AS order_count
    FROM orders
    WHERE status = 'paid'
    GROUP BY user_id
)
-- ထွက်လာသော CTE ဇယားကို ရိုးရိုး Table ကဲ့သို့ အသုံးပြုခြင်း
SELECT 
    u.name,
    cs.total_spent,
    cs.order_count
FROM users AS u
INNER JOIN CustomerSpending AS cs ON u.id = cs.user_id
WHERE cs.total_spent >= 500.00
ORDER BY cs.total_spent DESC;
```

---

## ၅။ Recursive CTEs (မိဘ-သားသမီး Hierarchy ရှာဖွေနည်း)

Category များသည် အဆင့်ဆင့် သားဖ ခွဲထားသည့်အခါ (ဥပမာ- Electronics ──► Computers ──► Laptops ──► Gaming Laptops):

```sql
-- Recursive CTE ဖြင့် မိဘ Category အောက်ရှိ မျိုးဆက်အားလုံးကို ရှာဖွေခြင်း
WITH RECURSIVE CategoryPath AS (
    -- Anchor Member (အစပြုရာ ထိပ်ဆုံး Category)
    SELECT id, name, parent_id, 1 AS depth
    FROM categories
    WHERE id = 1

    UNION ALL

    -- Recursive Member (သားသမီးများကို အောက်သို့ ဆက်တိုက် ဆွဲယူခြင်း)
    SELECT c.id, c.name, c.parent_id, cp.depth + 1
    FROM categories AS c
    INNER JOIN CategoryPath AS cp ON c.parent_id = cp.id
)
SELECT * FROM CategoryPath;
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အကြံပြုချက် |
| :--- | :--- |
| **တန်ဖိုး တစ်ခုတည်း တိုက်စစ်ရန်** | `Scalar Subquery` |
| **ဆက်စပ် ဒေတာ ရှိ/မရှိ စစ်ဆေးရန်** | `IN` အစား `EXISTS` ကို ဦးစားပေးသုံးပါ |
| **Nested Subqueries များ ရှုပ်ထွေးလာပါက** | ရှင်းလင်းသော `WITH ... AS` (CTE) သို့ ပြောင်းလဲပါ |
| **Tree / Hierarchy / Organization Charts** | `WITH RECURSIVE` ကို အသုံးပြုပါ |

နောက်သင်ခန်းစာ [08_window_functions_and_analytical_queries.md](/mysql/08_window_functions_and_analytical_queries/) တွင် ခေတ်သစ် MySQL 8.0 ၏ အစွမ်းထက်ဆုံး Feature တစ်ခုဖြစ်သော Window Functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD`, `LAG`) အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
