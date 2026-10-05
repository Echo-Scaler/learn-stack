---
title: "09. Views and Generated Columns"
description: "1. [Database View ဆိုတာဘာလဲ? (Virtual Table သဘောတရား)](#၁-database-view-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၉) - Database Views နှင့် Generated Columns
### (Lesson 9: Virtual Tables, Security Abstraction, Updatable Views & Generated Columns)

---

## 📌 မာတိကာ (Contents)
1. [Database View ဆိုတာဘာလဲ? (Virtual Table သဘောတရား)](#၁-database-view-ဆိုတာဘာလဲ)
2. [Views အဘယ်ကြောင့် အသုံးပြုရသလဲ? (အဓိက အကျိုးကျေးဇူး ၂ ရပ်)](#၂-views-အဘယ်ကြောင့်-အသုံးပြုရသလဲ)
   - [၂.၁။ Complex SQL Queries များကို ရိုးရှင်းစေခြင်း](#၂၁-complex-sql-queries-များကို-ရိုးရှင်းစေခြင်း)
   - [၂.၂။ လုံခြုံရေးအရ Sensitive Columns များကို ဖုံးကွယ်ခြင်း (Security Abstraction)](#၂၂-လုံခြုံရေးအရ-ဖုံးကွယ်ခြင်း)
3. [View တည်ဆောက်ခြင်း၊ ပြင်ဆင်ခြင်းနှင့် ဖျက်ပစ်ခြင်း Commands များ](#၃-view-commands)
4. [Updatable Views နှင့် `WITH CHECK OPTION`](#၄-updatable-views-နှင့်-with-check-option)
5. [Generated Columns (Auto-Computed Columns)](#၅-generated-columns)
   - [Virtual Columns vs Stored Columns](#virtual-vs-stored)
   - [Generated Columns ပေါ်တွင် Index တင်ခြင်း၏ အစွမ်းထက်ပုံ](#generated-columns-indexing)
6. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၆-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Database View ဆိုတာဘာလဲ?

**View** ဆိုသည်မှာ Physical Disk ပေါ်တွင် သီးခြား ဒေတာ အသစ် မသိမ်းဆည်းဘဲ၊ ရေးသားထားသော SQL Query ကို **"ဇယား အတု (Virtual Table)"** အနေဖြင့် သိမ်းဆည်းပေးထားသော စနစ် ဖြစ်ပါသည်။

View ကို `SELECT * FROM my_view;` ဟု ခေါ်ဆိုလိုက်သည့်အခါတိုင်း နောက်ကွယ်တွင် ရှိသော မူလ SQL Query ကို MySQL က အလိုအလျောက် သွားရောက် မေးမြန်းပေးပါသည်။

---

## ၂။ Views အဘယ်ကြောင့် အသုံးပြုရသလဲ?

### ၂.၁။ Complex Queries များကို ရိုးရှင်းစေခြင်း
Developer အဖွဲ့တွင် ဇယား ၄ ခု ဆက်ထားသော Complex JOIN Query ရှည်ကြီးကို နေ့တိုင်း ရိုက်ထည့်နေရမည့်အစား View တစ်ခုအဖြစ် သိမ်းဆည်းထားနိုင်ပါသည်:

```sql
-- View တည်ဆောက်ခြင်း
CREATE VIEW v_order_summaries AS
SELECT 
    o.id AS order_id,
    u.name AS customer_name,
    u.email AS customer_email,
    o.total_amount,
    o.status,
    o.order_date
FROM orders AS o
INNER JOIN users AS u ON o.user_id = u.id;

-- အသုံးပြုသည့်အခါ ရိုးရိုး Table ကဲ့သို့ ခေါ်ယူနိုင်ခြင်း
SELECT * FROM v_order_summaries WHERE status = 'paid';
```

---

### ၂.၂။ လုံခြုံရေးအရ Sensitive Columns များကို ဖုံးကွယ်ခြင်း
Data Analyst သို့မဟုတ် Report ထုတ်သူများအား `users` ဇယားတစ်ခုလုံးကို ပေးမသုံးဘဲ Password Hash များကို ဖယ်ထုတ်ထားသော View ကိုသာ ခွင့်ပြုပေးခြင်း:

```sql
CREATE VIEW v_public_users AS
SELECT id, name, email, created_at 
FROM users; -- password_hash ကို ချန်လှပ်ထားသည်
```

---

## ၃။ View Commands

```sql
-- View အသစ် ဖန်တီးခြင်း (ရှိပြီးသားဖြစ်ပါက အစားထိုးခြင်း)
CREATE OR REPLACE VIEW v_active_products AS
SELECT id, title, price, stock_quantity
FROM products
WHERE stock_quantity > 0;

-- View ကို ဖျက်ပစ်ခြင်း
DROP VIEW IF EXISTS v_active_products;
```

---

## ၄။ Updatable Views နှင့် `WITH CHECK OPTION`

အကယ်၍ View တစ်ခုတွင် `GROUP BY`, `DISTINCT`, Aggregate functions များ မပါဝင်ပါက ထို View မှတစ်ဆင့် မူလ Table ထဲသို့ ဒေတာ `INSERT` / `UPDATE` တိုက်ရိုက် ပြုလုပ်နိုင်ပါသည်။

`WITH CHECK OPTION` ထည့်သွင်းထားပါက View ၏ စည်းကမ်းချက်နှင့် မကိုက်ညီသော ဒေတာများကို Update / Insert လုပ်ခွင့် မပြုဘဲ ပိတ်ပင်ပေးပါသည်:

```sql
CREATE VIEW v_cheap_products AS
SELECT id, title, price FROM products
WHERE price <= 100.00
WITH CHECK OPTION;

-- ❌ Error တက်မည် (ဈေးနှုန်း $150 ဖြစ်နေသဖြင့် View စည်းကမ်းနှင့် မညီပါ)
UPDATE v_cheap_products SET price = 150.00 WHERE id = 5;
```

---

## ၅။ Generated Columns (Auto-Computed Columns)

တန်ဖိုးတစ်ခုကို အခြား Columns များမှ အလိုအလျောက် တွက်ချက်စေလိုသည့်အခါ Generated Columns ကို သုံးသည်:

```sql
ALTER TABLE order_items 
ADD COLUMN line_total DECIMAL(12, 2) 
GENERATED ALWAYS AS (quantity * unit_price) VIRTUAL;
```

### (က) Virtual vs Stored:
* **`VIRTUAL` (Default)**: Disk နေရာ လုံးဝ မယူပါ။ Data ဖတ်သည့်အချိန်မှ ချက်ချင်း တွက်ထုတ်ပေးသည်။
* **`STORED`**: Disk ပေါ်တွင် အမှန်တကယ် ရေးသားသိမ်းဆည်းသည်။

### (ခ) Generated Columns ပေါ်တွင် Index တင်ခြင်း:
Virtual Column ပေါ်တွင် **Database Index တင်ထားနိုင်ပါသည်**!  
ဥပမာအားဖြင့် `first_name` နှင့် `last_name` ကို ပေါင်းထားသော `full_name` virtual column ပေါ်တွင် Index တင်ထားပါက Full Name ရှာဖွေမှုသည် မီလီစက္ကန့်ပိုင်းဖြင့် မြန်ဆန်သွားမည် ဖြစ်ပါသည်။

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **View Security** | ပြင်ပ Reporting အဖွဲ့များအတွက် Password ကော်လံများကို View ဖြင့် ဖုံးကွယ်ထားသလား? | [ ] |
| **View Performance** | View ပေါ်တွင် ထပ်မံ View ဆင့်ကဲ မလုပ်ရန် သတိပြုမိသလား? (Nested Views များသည် နှေးကွေးတတ်သည်) | [ ] |
| **Generated Columns** | အမြဲတမ်း တွက်ချက်ရသော ဖော်မြူလာများအတွက် Generated Column သုံးထားသလား? | [ ] |

နောက်သင်ခန်းစာ [10_stored_procedures_and_functions.md](/mysql/10_stored_procedures_and_functions/) တွင် Database အတွင်း၌ Programming Logic များကို တိုက်ရိုက် ရေးဆွဲ run ပေးနိုင်သော Stored Procedures & Functions အကြောင်းကို လေ့လာပါမည်။
