---
title: "04. Filtering, Sorting and Pagination"
description: "1. [WHERE Clause ဖြင့် ဒေတာများ စစ်ထုတ်ခြင်း (Comparison & Logical Operators)](#၁-where-clause-ဖြင့်-ဒေတာများ-စစ်ထုတ်ခြင်း)"
---

## 🐬 သင်ခန်းစာ (၄) - Filtering၊ Sorting နှင့် Pagination စနစ်များ
### (Lesson 4: Advanced WHERE Filtering, Pattern Matching, ORDER BY & Cursor Pagination)

---

## 📌 မာတိကာ (Contents)
1. [`WHERE` Clause ဖြင့် ဒေတာများ စစ်ထုတ်ခြင်း (Comparison & Logical Operators)](#၁-where-clause-ဖြင့်-ဒေတာများ-စစ်ထုတ်ခြင်း)
2. [`BETWEEN`, `IN` နှင့် Pattern Matching (`LIKE % _`)](#၂-between-in-နှင့်-like)
3. [Three-Valued Logic: `NULL` စစ်ဆေးခြင်း (`IS NULL` vs `= NULL`)](#၃-three-valued-logic-null-စစ်ဆေးခြင်း)
4. [`ORDER BY` ဖြင့် ဒေတာများ အစဉ်လိုက် စီစဉ်ခြင်း (Sorting)](#၄-order-by-ဖြင့်-ဒေတာများ-စီစဉ်ခြင်း)
5. [`LIMIT` & `OFFSET` ဖြင့် Pagination ပြုလုပ်နည်း](#၅-limit--offset-ဖြင့်-pagination-ပြုလုပ်နည်း)
6. [Deep Pagination ပြဿနာနှင့် Cursor-Based Pagination အဖြေ](#၆-deep-pagination-ပြဿနာ)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ `WHERE` Clause ဖြင့် ဒေတာများ စစ်ထုတ်ခြင်း

သန်းပေါင်းများစွာသော ဒေတာများထဲမှ လိုအပ်သော အချက်အလက်ကိုသာ စစ်ထုတ်ရန် `WHERE` clause ကို အသုံးပြုသည်:

```sql
-- Comparison Operators (=, !=, <, >, <=, >=)
SELECT id, title, price FROM products WHERE price >= 500.00;

-- Logical Operators (AND, OR, NOT)
-- ဥပမာ - Category 1 ထဲမှ ဈေးနှုန်း $1000 အောက် ပစ္စည်းများ ရှာဖွေခြင်း
SELECT id, title, price FROM products 
WHERE category_id = 1 AND price < 1000.00;
```

> **Operator Precedence (ဦးစားပေးမှု အစီအစဉ် သတိပြုရန်)**:  
> `AND` သည် `OR` ထက် ဦးစားပေး အရင်အလုပ်လုပ်သည်။ ထို့ကြောင့် ရောထွေးရေးသည့်အခါ **လက်သည်းကွင်း `( )` မဖြစ်မနေ ထည့်သွင်းပါ**:
> ```sql
> -- မှန်ကန်သော ပုံစံ: (Admin သို့မဟုတ် Manager) ဖြစ်ပြီး Active ဖြစ်သူများ
> SELECT * FROM users 
> WHERE (role = 'admin' OR role = 'manager') AND is_active = 1;
> ```

---

## ၂။ `BETWEEN`, `IN` နှင့် `LIKE`

### (က) `BETWEEN ... AND ...` (အတိုင်းအတာ ကြားရှိ ဒေတာများ):
```sql
-- ဈေးနှုန်း $100 နှင့် $500 ကြားရှိ ပစ္စည်းများ (100 နှင့် 500 ပါဝင်သည်)
SELECT id, title, price FROM products 
WHERE price BETWEEN 100.00 AND 500.00;

-- ရက်စွဲအပိုင်းအခြား စစ်ဆေးခြင်း
SELECT * FROM orders 
WHERE order_date BETWEEN '2026-01-01 00:00:00' AND '2026-01-31 23:59:59';
```

### (ခ) `IN (...)` နှင့် `NOT IN (...)` (စာရင်းထဲ ပါဝင်မှု စစ်ဆေးခြင်း):
`OR` များကို အများကြီး ဆက်တိုက် ရေးမည့်အစား `IN` ကို သုံးပါ:
```sql
-- Status သည် pending, shipped, paid တစ်ခုခု ဖြစ်သူများ
SELECT * FROM orders 
WHERE status IN ('pending', 'shipped', 'paid');
```

### (ဂ) `LIKE` Pattern Matching:
* `%` (စာလုံး မည်မျှမဆို အစားထိုးနိုင်သည် - သုညလုံးမှ အဆုံးမရှိ)
* `_` (စာလုံး အတိအကျ **၁ လုံးတည်း** ကိုသာ အစားထိုးသည်)

```sql
-- "Pro" ဖြင့် စတင်သော ပစ္စည်းများ ရှာဖွေခြင်း
SELECT * FROM products WHERE title LIKE 'Pro%';

-- မည်သည့်နေရာတွင်မဆို "Apple" စာလုံး ပါဝင်သော ပစ္စည်းများ ရှာဖွေခြင်း
SELECT * FROM products WHERE title LIKE '%Apple%';

-- နိုင်ငံကုဒ် ၂ လုံး စာလုံးဖြစ်ပြီး 'U' ဖြင့် စတင်သူ (ဥပမာ- US, UK)
SELECT * FROM countries WHERE code LIKE 'U_';
```

---

## ၃။ Three-Valued Logic: `NULL` စစ်ဆေးခြင်း

SQL တွင် Boolean တန်ဖိုးသည် `TRUE`, `FALSE` သာမက **`UNKNOWN` (NULL)** ဟူ၍ ၃ မျိုး ရှိပါသည်။

```sql
-- ❌ လုံးဝ မှားယွင်းသော ရေးနည်း (မည်သည့်အခါမျှ အလုပ်မလုပ်ပါ)
SELECT * FROM users WHERE deleted_at = NULL;

-- ✅ မှန်ကန်သော ရေးနည်း
SELECT * FROM users WHERE deleted_at IS NULL;
SELECT * FROM users WHERE deleted_at IS NOT NULL;
```
*(အကြောင်းမှာ `NULL` သည် တန်ဖိုးမရှိခြင်း (Unknown) ဖြစ်သဖြင့် မည်သည့်အရာနှင့်မျှ ညီမျှခြင်း တိုက်စစ်၍ မရနိုင်သောကြောင့် ဖြစ်သည်)*

---

## ၄။ `ORDER BY` ဖြင့် ဒေတာများ စီစဉ်ခြင်း

* `ASC` (Ascending - ငယ်စဉ်ကြီးလိုက် / A မှ Z အထိ - Default ဖြစ်သည်)
* `DESC` (Descending - ကြီးစဉ်ငယ်လိုက် / Z မှ A အထိ / အသစ်ဆုံးမှ အဟောင်းဆုံး)

```sql
-- ဈေးအကြီးဆုံး ပစ္စည်းများကို အပေါ်ဆုံးမှ ပြသခြင်း
SELECT title, price FROM products ORDER BY price DESC;

-- Multi-column Sorting (Category အလိုက် စီပြီး Category တူပါက ဈေးနှုန်း အကြီးဆုံး အရင်ပြပါ)
SELECT category_id, title, price FROM products 
ORDER BY category_id ASC, price DESC;
```

---

## ၅။ `LIMIT` & `OFFSET` ဖြင့် Pagination ပြုလုပ်နည်း

Web Application များတွင် စာမျက်နှာတစ်မျက်နှာလျှင် ပစ္စည်း အခု ၂၀ စီ ပြသလိုသည့်အခါ အောက်ပါ Formula ကို အသုံးပြုသည်:

$$\text{OFFSET} = (\text{Page Number} - 1) \times \text{Per Page}$$

```sql
-- စာမျက်နှာ (၁): ပထမဆုံး ပစ္စည်း ၂၀ ပြပါ (Page 1)
SELECT id, title, price FROM products 
ORDER BY id ASC LIMIT 20 OFFSET 0;

-- စာမျက်နှာ (၂): နောက်ထပ် ပစ္စည်း ၂၀ ပြပါ (Page 2)
SELECT id, title, price FROM products 
ORDER BY id ASC LIMIT 20 OFFSET 20;

-- စာမျက်နှာ (၃): (Page 3)
SELECT id, title, price FROM products 
ORDER BY id ASC LIMIT 20 OFFSET 40;
```

---

## ၆။ Deep Pagination ပြဿနာနှင့် Cursor-Based Pagination အဖြေ

### ကြီးမားသော ပြဿနာ:
သင်သည် `LIMIT 20 OFFSET 1000000;` (စာမျက်နှာ ၅ သောင်းမြောက်) ကို ခေါ်ဆိုလိုက်ပါက:
MySQL သည် ပထမဆုံး ဒေတာ **၁,၀၀၀,၀၂၀ လုံးကို Disk ပေါ်မှ အကုန်ဖတ်ရှုပြီးမှ** ပထမ ၁ သန်းကို လွှင့်ပစ်ကာ နောက်ဆုံး ၂၀ လုံးကိုသာ ပြသပေးပါလိမ့်မည်!  
ဤသည်မှာ Server ၏ CPU နှင့် Disk ကို 100% ပြည့်သွားစေပြီး Database Crash ဖြစ်သွားစေသည်။

### အဖြေ: Keyset / Cursor-Based Pagination (အလွန်မြန်ဆန်သည်)
`OFFSET` မသုံးဘဲ ယခင်စာမျက်နှာ၏ **နောက်ဆုံးတွေ့ခဲ့သော `id` (Last Seen ID)** ကို အခြေခံ၍ ဆွဲယူခြင်း:

```sql
-- နောက်စာမျက်နှာ သွားလိုပါက ယခင်နောက်ဆုံး ID သည် 250 ဖြစ်သည် ဆိုပါစို့
SELECT id, title, price FROM products 
WHERE id > 250 
ORDER BY id ASC 
LIMIT 20;
```
ဤနည်းလမ်းတွင် MySQL သည် B-Tree Index ကို တိုက်ရိုက် ခုန်ကူးရှာဖွေနိုင်သဖြင့် ဒေတာ သန်း ၁၀၀ ရှိစေကာမူ **မီလီစက္ကန့်ပိုင်း (0.001s)** ဖြင့် အဖြေထွက်လာမည် ဖြစ်ပါသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Logic Parentheses** | `AND` နှင့် `OR` တွဲသုံးသည့်အခါ လက်သည်းကွင်း `( )` သေချာ ထည့်ထားသလား? | [ ] |
| **NULL Comparison** | `= NULL` မသုံးဘဲ `IS NULL` သုံးထားသလား? | [ ] |
| **LIKE Optimization** | `LIKE '%keyword%'` (ရှေ့တွင် `%` ပါခြင်း) သည် Index မသုံးနိုင်ဘဲ Full Table Scan ဖြစ်စေကြောင်း သတိပြုမိသလား? | [ ] |
| **Big Data Pagination** | ဒေတာ သန်းချီရှိသော ဇယားများတွင် `OFFSET` အစား Keyset Pagination (`WHERE id > last_id`) သုံးထားသလား? | [ ] |

နောက်သင်ခန်းစာ [05_aggregate_functions_and_grouping.md](/mysql/05_aggregate_functions_and_grouping/) တွင် ဒေတာများကို ပေါင်းရုံးတွက်ချက်ပေးသည့် Aggregate Functions များနှင့် `GROUP BY`, `HAVING` အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
