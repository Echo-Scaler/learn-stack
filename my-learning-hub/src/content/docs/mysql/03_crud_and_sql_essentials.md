---
title: "03. CRUD and SQL Essentials"
description: "1. [SQL Commands အမျိုးအစား ၅ မျိုး (DDL, DML, DQL, DCL, TCL)](#၁-sql-commands-အမျိုးအစား-၅-မျိုး)"
---

## 🐬 သင်ခန်းစာ (၃) - CRUD Operations နှင့် SQL Essentials
### (Lesson 3: DDL vs DML, Bulk Inserts, Upsert ON DUPLICATE KEY, UPDATE & DELETE vs TRUNCATE)

---

## 📌 မာတိကာ (Contents)
1. [SQL Commands အမျိုးအစား ၅ မျိုး (DDL, DML, DQL, DCL, TCL)](#၁-sql-commands-အမျိုးအစား-၅-မျိုး)
2. [CREATE (Data အသစ် ထည့်သွင်းခြင်း)](#၂-create-data-အသစ်-ထည့်သွင်းခြင်း)
   - [Single Insert vs Bulk Insert (Performance အဆ ၁၀ မြန်ဆန်စေနည်း)](#single-insert-vs-bulk-insert)
   - [`INSERT IGNORE` နှင့် Upsert (`ON DUPLICATE KEY UPDATE`)](#insert-ignore-နှင့်-upsert)
3. [READ (Data ရှာဖွေဖတ်ရှုခြင်း) - `SELECT *` ၏ ဆိုးကျိုး](#၃-read-data-ရှာဖွေဖတ်ရှုခြင်း)
4. [UPDATE (Data ပြင်ဆင်ခြင်း) - `WHERE` မပါလျှင် ဖြစ်တတ်သော ဘေးထွက်ဆိုးကျိုး](#၄-update-data-ပြင်ဆင်ခြင်း)
5. [DELETE vs TRUNCATE (အလွန်အရေးကြီးသော ကွာခြားချက်)](#၅-delete-vs-truncate)
6. [MySQL Safe Updates Mode (စနစ်တစ်ခုလုံး မတော်တဆ ပျက်စီးမှု ကာကွယ်ခြင်း)](#၆-mysql-safe-updates-mode)
7. [လက်တွေ့ CRUD Lab လေ့ကျင့်ခန်း](#၇-လက်တွေ့-crud-lab)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ SQL Commands အမျိုးအစား ၅ မျိုး

SQL (Structured Query Language) တွင် Commands များကို လုပ်ဆောင်ချက်အလိုက် အုပ်စု ၅ စု ခွဲခြားထားပါသည်:

```
┌────────────────────────────────────────────────────────┐
│                      SQL COMMANDS                      │
├─────────┬───────────────────────────────┬──────────────┤
│ Category│ အဓိပ္ပာယ်                     │ Commands     │
├─────────┼───────────────────────────────┼──────────────┤
│ 1. DDL  │ Data Definition (ဖွဲ့စည်းပုံ) │ CREATE, ALTER│
│         │                               │ DROP, TRUNCATE
├─────────┼───────────────────────────────┼──────────────┤
│ 2. DML  │ Data Manipulation (ဒေတာကိုင်)  │ INSERT, UPDATE
│         │                               │ DELETE       │
├─────────┼───────────────────────────────┼──────────────┤
│ 3. DQL  │ Data Query (ဒေတာထုတ်ဖတ်)       │ SELECT       │
├─────────┼───────────────────────────────┼──────────────┤
│ 4. DCL  │ Data Control (အခွင့်အာဏာ)     │ GRANT, REVOKE│
├─────────┼───────────────────────────────┼──────────────┤
│ 5. TCL  │ Transaction Control (ငွေလွှဲ)  │ COMMIT,      │
│         │                               │ ROLLBACK     │
└─────────┴───────────────────────────────┴──────────────┘
```

---

## ၂။ CREATE (Data အသစ် ထည့်သွင်းခြင်း)

### (က) ရိုးရိုး Single Insert:
```sql
INSERT INTO categories (name, slug) 
VALUES ('Smartphones', 'smartphones');
```

### (ခ) Bulk Insert (ဒေတာ အများအပြား တစ်ပြိုင်နက် သွင်းခြင်း):
အကယ်၍ Record ၁၀၀၀ ထည့်သွင်းလိုပါက `INSERT INTO` ကို အကြိမ် ၁၀၀၀ သီးခြားစီ မ run ပါနှင့် (Network roundtrip ကြောင့် အလွန်နှေးသည်)။  
Commas (`,`) ခြားပြီး Bulk Insert ပြုလုပ်ပါက **အဆ ၁၀ မှ အဆ ၂၀ အထိ ပိုမိုမြန်ဆန်ပါသည်**:

```sql
INSERT INTO categories (name, slug) VALUES 
('Laptops', 'laptops'),
('Headphones', 'headphones'),
('Smart Watches', 'smart-watches'),
('Tablets', 'tablets');
```

### (ဂ) Upsert (`ON DUPLICATE KEY UPDATE`):
ဒေတာရှိပြီးသားဆိုလျှင် ပြင်မည်၊ မရှိသေးလျှင် အသစ်ထည့်မည် (Insert or Update):

```sql
-- ဥပမာ - Product stock အရေအတွက် တိုးခြင်း
INSERT INTO products (id, category_id, title, price, stock_quantity)
VALUES (1, 1, 'iPhone 15 Pro', 999.00, 10)
ON DUPLICATE KEY UPDATE 
    stock_quantity = stock_quantity + 10,
    price = 999.00;
```

---

## ၃။ READ (Data ရှာဖွေဖတ်ရှုခြင်း)

```sql
-- မကောင်းသော ပုံစံ (Production တွင် ရှောင်ကြဉ်ပါ)
SELECT * FROM users;

-- ကောင်းမွန်သော ပုံစံ (လိုအပ်သော Columns များကိုသာ သီးသန့် ရွေးထုတ်ပါ)
SELECT id, name, email, created_at FROM users;
```

> [!WARNING]
> **Production တွင် `SELECT *` အဘယ်ကြောင့် မသုံးသင့်သနည်း?**  
> 1. မလိုအပ်သော Columns များ (ဥပမာ- ကြီးမားသော Description, Profile Image base64) ပါလာသဖြင့် Network Bandwidth နှင့် Memory အလဟဿ ဖြစ်ခြင်း။
> 2. Database Index (Covering Index) ကို ကျော်လွန်သွားသဖြင့် Query နှေးသွားခြင်း။

---

## ၄။ UPDATE (Data ပြင်ဆင်ခြင်း)

> [!CAUTION]
> **အသက်တမျှ အရေးကြီးသော သတိပေးချက်**:  
> `UPDATE` လုပ်သည့်အခါ **`WHERE` clause ကို အမြဲတမ်း စစ်ဆေးပါ!**  
> `WHERE` မပါဘဲ `UPDATE products SET price = 0;` ဟု ရိုက်လိုက်ပါက ဆိုင်ရှိ ပစ္စည်းအားလုံး၏ ဈေးနှုန်း သုည ဖြစ်သွားပါလိမ့်မည်!

```sql
-- မှန်ကန်သော အသုံးပြုပုံ: ID=1 ရှိသော ပစ္စည်းကိုသာ ဈေးနှုန်း ပြင်ဆင်ခြင်း
UPDATE products 
SET price = 899.00, stock_quantity = 15 
WHERE id = 1;
```

---

## ၅။ DELETE vs TRUNCATE

ဒေတာများကို ဖျက်ပစ်ရာတွင် နည်းလမ်း ၂ မျိုး ရှိပြီး အလွန်ကွာခြားပါသည်:

| အချက်အလက် | `DELETE FROM table` | `TRUNCATE TABLE table` |
| :--- | :--- | :--- |
| **SQL Category** | **DML** (Data Manipulation) | **DDL** (Data Definition) |
| **WHERE ပါဝင်နိုင်မှု** | **ရသည်** (`WHERE id = 5`) | **မရပါ** (ဇယားတစ်ခုလုံး အကုန်ဖျက်သည်) |
| **အလုပ်လုပ်ပုံ** | Row တစ်ခုချင်းစီကို လိုက်ဖျက်ပြီး Log ရေးသည် | ဇယားကို ဖျက်ချပြီး အလွတ်အသစ် ချက်ချင်း ပြန်ဆောက်သည် |
| **မြန်နှုန်း Speed** | နှေးသည် (Records များလျှင် မိနစ်ချီ ကြာနိုင်သည်) | **အလွန်မြန်သည်** (Records သန်းချီရှိလည်း စက္ကန့်ပိုင်း) |
| **Transaction Rollback** | Rollback ပြန်ခေါ်၍ **ရသည်** (Undo ရသည်) | Rollback ပြန်ခေါ်၍ **မရပါ** (Auto-commit ဖြစ်သည်) |
| **AUTO_INCREMENT** | မူလ နံပါတ်အတိုင်း ဆက်သွားသည် (Reset မဖြစ်ပါ) | **နံပါတ် ၁ သို့ Reset ပြန်ဖြစ်သွားသည်** |

```sql
-- တိကျသော User တစ်ယောက်တည်းကိုသာ ဖျက်ခြင်း
DELETE FROM users WHERE id = 10;

-- Test Data ဇယားတစ်ခုလုံးကို သုညမှ အစ ပြန်စရန်
TRUNCATE TABLE order_items;
```

---

## ၆။ MySQL Safe Updates Mode

မတော်တဆ `WHERE` မပါဘဲ `UPDATE` သို့မဟုတ် `DELETE` လုပ်မိပြီး Database ပျက်စီးသွားခြင်းမှ ကာကွယ်ရန် MySQL တွင် **Safe Updates Mode** ဖွင့်ထားနိုင်ပါသည်:

```sql
-- Safe Updates ဖွင့်ခြင်း (WHERE တွင် Key Column မပါလျှင် Error ပြပြီး အလုပ်မလုပ်ပါ)
SET sql_safe_updates = 1;

-- စမ်းသပ်ကြည့်ပါ (Error တက်ပါလိမ့်မည်)
DELETE FROM users; 
-- Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.
```

---

## ၇။ လက်တွေ့ CRUD Lab

```sql
-- အဆင့် ၁: Categories အသစ် ထည့်သွင်းခြင်း
INSERT INTO categories (name, slug) VALUES ('Electronics', 'electronics');

-- အဆင့် ၂: Products ထည့်သွင်းခြင်း
INSERT INTO products (category_id, title, price, stock_quantity)
VALUES (1, 'MacBook Pro M3', 1999.00, 5);

-- အဆင့် ၃: ထည့်လိုက်သော Product ကို စစ်ဆေးခြင်း
SELECT id, title, price, stock_quantity FROM products WHERE category_id = 1;

-- အဆင့် ၄: ဈေးနှုန်းကို $1899.00 သို့ လျှော့ချခြင်း
UPDATE products SET price = 1899.00 WHERE title = 'MacBook Pro M3';

-- အဆင့် ၅: ပစ္စည်းဖျက်ခြင်း
DELETE FROM products WHERE id = 1;
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Bulk Insert အသုံးပြုမှု** | Loop ပတ်၍ Insert မလုပ်ဘဲ Multiple Values ဖြင့် တစ်ချက်တည်း သွင်းသလား? | [ ] |
| **No `SELECT *`** | လိုအပ်သော Columns များကိုသာ သီးခြား ခေါ်ယူထားသလား? | [ ] |
| **Safe Update Check** | `UPDATE` နှင့် `DELETE` တိုင်းတွင် `WHERE` clause သေချာ ထည့်ထားသလား? | [ ] |
| **Truncate Caution** | `TRUNCATE` သည် Rollback ပြန်ခေါ်မရကြောင်း သတိပြုမိသလား? | [ ] |

နောက်သင်ခန်းစာ [04_filtering_sorting_and_pagination.md](/mysql/04_filtering_sorting_and_pagination/) တွင် သန်းပေါင်းများစွာသော ဒေတာများထဲမှ လိုရာကို အတိအကျ စစ်ထုတ်ရှာဖွေပေးနိုင်သည့် `WHERE`, `LIKE`, `IN`, `ORDER BY` နှင့် Pagination လုပ်ဆောင်ပုံကို လေ့လာပါမည်။
