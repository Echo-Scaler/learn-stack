---
title: "05. Aggregations and Grouping"
description: "1. [Aggregate Functions ဆိုတာဘာလဲ? (COUNT, SUM, AVG, MIN, MAX)](#၁-aggregate-functions-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၅) - Aggregate Functions နှင့် GROUP BY Grouping စနစ်
### (Lesson 5: Aggregation, GROUP BY, HAVING vs WHERE & Logical Query Processing Order)

---

## 📌 မာတိကာ (Contents)
1. [Aggregate Functions ဆိုတာဘာလဲ? (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`)](#၁-aggregate-functions-ဆိုတာဘာလဲ)
2. [`COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT column)` ကွာခြားချက်](#၂-count-အမျိုးအစားများ-ကွာခြားချက်)
3. [`GROUP BY` အလုပ်လုပ်ပုံ သဘောတရား](#၃-group-by-အလုပ်လုပ်ပုံ-သဘောတရား)
4. [`ONLY_FULL_GROUP_BY` SQL Mode နှင့် ဖြစ်တတ်သော Error 1055](#၄-only_full_group_by-sql-mode)
5. [`HAVING` နှင့် `WHERE` အလွန်အရေးကြီးသော ကွာခြားချက်](#၅-having-နှင့်-where-ကွာခြားချက်)
6. [SQL Query Execution Order (Query တစ်ခု အဆင့်ဆင့် အလုပ်လုပ်ပုံ သဘာဝ)](#၆-sql-query-execution-order)
7. [လက်တွေ့ Production အရောင်းစာရင်း Reporting Queries နမူနာ](#၇-လက်တွေ့-reporting-queries)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Aggregate Functions ဆိုတာဘာလဲ?

**Aggregate Functions** ဆိုသည်မှာ Row ပေါင်းများစွာတွင် ရှိသော ဒေတာများကို စုစည်းတွက်ချက်ပြီး **ရလဒ်တစ်ခုတည်း (Single Summary Value)** အဖြစ် ထုတ်ပေးသော Functions များ ဖြစ်သည်:

* **`COUNT()`**: အကြောင်းရေ အရေအတွက်ကို ရေတွက်ခြင်း
* **`SUM()`**: ကိန်းဂဏန်းများ စုစုပေါင်း ပေါင်းခြင်း
* **`AVG()`**: ပျမ်းမျှတန်ဖိုး (Average) ရှာဖွေခြင်း
* **`MIN()`**: အနည်းဆုံး / အနိမ့်ဆုံး တန်ဖိုး ရှာဖွေခြင်း
* **`MAX()`**: အများဆုံး / အမြင့်ဆုံး တန်ဖိုး ရှာဖွေခြင်း

```sql
-- ဆိုင်ရှိ ပစ္စည်းအားလုံး၏ စုစုပေါင်းတန်ဖိုးနှင့် ပျမ်းမျှဈေးနှုန်း ရှာခြင်း
SELECT 
    COUNT(*) AS total_products,
    SUM(price * stock_quantity) AS total_inventory_value,
    AVG(price) AS average_price,
    MIN(price) AS cheapest_price,
    MAX(price) AS most_expensive_price
FROM products;
```

---

## ၂။ `COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT column)`

အင်တာဗျူးများနှင့် လက်တွေ့လုပ်ငန်းခွင်တွင် မကြာခဏ မှားတတ်သော အပိုင်းဖြစ်သည်:

1. **`COUNT(*)`**:
   * ဇယားထဲရှိ Row အားလုံးကို ရေတွက်သည် (`NULL` ပါဝင်သော်လည်း ရေတွက်သည်)။ **အကြောင်းရေ စုစုပေါင်း ရေတွက်ရန် အမြဲတမ်း `COUNT(*)` ကိုသာ သုံးပါ**။
2. **`COUNT(column_name)`**:
   * အဆိုပါ Column ထဲတွင် တန်ဖိုးရှိသော Row များကိုသာ ရေတွက်ပြီး **`NULL` ဖြစ်နေသော Row များကို ချန်လှပ်သွားပါသည်**!
3. **`COUNT(DISTINCT column_name)`**:
   * ထပ်နေသော တန်ဖိုးများကို ဖယ်ထုတ်ပြီး တမူထူးခြားသော အရေအတွက်ကိုသာ ရေတွက်သည် (ဥပမာ- ဆိုင်တွင် အော်ဒါမှာဖူးသော ဖောက်သည် ဦးရေ စုစုပေါင်းကို ရေတွက်ခြင်း `COUNT(DISTINCT user_id)`)။

---

## ၃။ `GROUP BY` အလုပ်လုပ်ပုံ သဘောတရား

တန်ဖိုး တူညီသော ဒေတာများကို အုပ်စုတစ်ခုတည်း (Bucket) ဖြစ်အောင် စုစည်းလိုက်ပြီး အုပ်စုတစ်ခုချင်းစီအတွက် Aggregate တွက်ချက်မှု ပြုလုပ်ခြင်း ဖြစ်သည်:

```
[ မူလ PRODUCTS DATA ]                         [ GROUP BY category_id ]
Title           | Category | Price              Category 1 (Laptops)
----------------+----------+------              ├── MacBook ($2000)
MacBook         | 1        | 2000               └── Dell XPS ($1500)
iPhone          | 2        | 1000               ──► SUM = $3500, COUNT = 2
Dell XPS        | 1        | 1500               
Samsung S24     | 2        | 900                Category 2 (Phones)
                                                ├── iPhone ($1000)
                                                └── Samsung ($900)
                                                ──► SUM = $1900, COUNT = 2
```

```sql
-- Category တစ်ခုချင်းစီအလိုက် ပစ္စည်းအရေအတွက်နှင့် ပျမ်းမျှဈေးနှုန်း
SELECT 
    category_id,
    COUNT(*) AS product_count,
    AVG(price) AS avg_price
FROM products
GROUP BY category_id;
```

---

## ၄။ `ONLY_FULL_GROUP_BY` SQL Mode

MySQL 5.7+ နှင့် 8.0 တွင် Default အားဖြင့် `ONLY_FULL_GROUP_BY` ပါဝင်သည်။

အကယ်၍ သင်သည် အောက်ပါအတိုင်း မှားယွင်းစွာ ရေးသားမိပါက:
```sql
-- ❌ ERROR 1055 တက်မည့် Query
SELECT category_id, title, AVG(price) 
FROM products 
GROUP BY category_id;
```
MySQL သည် Category တစ်ခုစီတွင် Titles တွေ အများကြီး ရှိနေသဖြင့် မည်သည့် `title` ကို ပြသရမည်မှန်း မသိသောကြောင့် Error တက်ပါလိမ့်မည်။

**စည်းမျဉ်း**: `SELECT` ထဲတွင် ပါဝင်သော Columns များသည် `GROUP BY` ထဲတွင် ပါဝင်သော Column ဖြစ်ရမည် (သို့မဟုတ်) Aggregate Function (`SUM`, `MAX`) ထဲတွင် ထည့်ထားသော Column သာ ဖြစ်ရမည်။

---

## ၅။ `HAVING` နှင့် `WHERE` ကွာခြားချက်

| သွင်ပြင်လက္ခဏာ | `WHERE` Clause | `HAVING` Clause |
| :--- | :--- | :--- |
| **စစ်ထုတ်ချိန် Timing** | **Aggregation မတိုင်မီ** Row တစ်ခုချင်းစီကို ကြိုတင် စစ်ထုတ်သည် | **Aggregation ပြီးဆုံးပြီးမှ** ထွက်လာသော Group ရလဒ်ကို စစ်ထုတ်သည် |
| **Aggregate Functions ပါဝင်နိုင်မှု** | **လုံးဝ သုံး၍ မရပါ** (`WHERE SUM(price) > 100` ရေး၍မရပါ) | **သုံးနိုင်သည်** (`HAVING SUM(price) > 1000`) |
| **Performance** | အလွန်မြန်သည် (Index သုံးနိုင်သည်) | Group များ အားလုံး တွက်ချက်ပြီးမှ စစ်ရသဖြင့် ပိုနှေးသည် |

```sql
-- ဥပမာ - ပစ္စည်းအရေအတွက် ၅ ခုထက်ပိုများသော Category များကိုသာ ရှာဖွေခြင်း
SELECT category_id, COUNT(*) AS total_items
FROM products
WHERE price > 50.00          -- အဆင့် ၁: ဈေးနှုန်း $50 ထက်ကြီးသော ပစ္စည်းများကိုသာ အရင်ယူသည် (WHERE)
GROUP BY category_id         -- အဆင့် ၂: Category အလိုက် အုပ်စုဖွဲ့သည်
HAVING COUNT(*) >= 5;        -- အဆင့် ၃: ပစ္စည်း အရေအတွက် ၅ ခုနှင့်အထက် ရှိသော အုပ်စုကိုသာ ရွေးထုတ်သည် (HAVING)
```

---

## ၆။ SQL Query Execution Order (Logical Processing)

Developer အများစုသည် `SELECT` ကို အပေါ်ဆုံးမှ ရေးကြသော်လည်း Database Engine သည် အောက်ပါ အစီအစဉ်အတိုင်း အလုပ်လုပ်ပါသည်:

```
Step 1: FROM & JOINs        ──► ဇယားများကို ပေါင်းစည်း ဆွဲထုတ်သည်
Step 2: WHERE               ──► Row တစ်ခုချင်းစီကို စစ်ထုတ်သည်
Step 3: GROUP BY            ──► အုပ်စုများ စုစည်းသည်
Step 4: HAVING              ──► Group အုပ်စုများကို စစ်ထုတ်သည်
Step 5: SELECT              ──► ကော်လံများကို ရွေးထုတ်တွက်ချက်သည်
Step 6: DISTINCT            ──► ထပ်နေသော တန်ဖိုးများကို ရှင်းထုတ်သည်
Step 7: ORDER BY            ──► အစဉ်လိုက် စီစဉ်သည်
Step 8: LIMIT / OFFSET      ──► သတ်မှတ်ထားသော အရေအတွက်သာ ဖြတ်ယူသည်
```

*(ထို့ကြောင့် `WHERE` clause ထဲတွင် `SELECT` ၌ သတ်မှတ်ခဲ့သော Alias အမည်ကို လှမ်းသုံး၍ မရခြင်း ဖြစ်သည်)*

---

## ၇။ လက်တွေ့ Reporting Queries

```sql
-- အော်ဒါစုစုပေါင်း $1000 ကျော်ဖူးသော Top Customers များကို ရှာဖွေခြင်း
SELECT 
    user_id,
    COUNT(id) AS total_orders,
    SUM(total_amount) AS lifetime_spent,
    MAX(order_date) AS last_order_date
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING lifetime_spent >= 1000.00
ORDER BY lifetime_spent DESC
LIMIT 10;
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Counting Rows** | `NULL` မကျန်စေရန် အလုံးစုံ ရေတွက်မှုအတွက် `COUNT(*)` ကို သုံးသလား? | [ ] |
| **WHERE vs HAVING** | Group မဖွဲ့မီ စစ်ထုတ်နိုင်သော Filter များကို `HAVING` တွင် မထည့်ဘဲ `WHERE` ထဲ ထည့်ထားသလား? | [ ] |
| **Full Group By Rule** | `SELECT` ထဲရှိ ကော်လံများသည် `GROUP BY` ထဲတွင် ပါဝင်မှု ရှိသလား? | [ ] |

နောက်သင်ခန်းစာ [06_joins_and_relational_queries.md](/mysql/06_joins_and_relational_queries/) တွင် ဇယားများစွာကို အတူတကွ ချိတ်ဆက်မေးမြန်းနိုင်သည့် `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `CROSS JOIN` များကို ဆက်လက်လေ့လာပါမည်။
