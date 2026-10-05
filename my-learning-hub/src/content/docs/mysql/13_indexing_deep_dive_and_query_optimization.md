---
title: "13. Indexing and Query Optimization"
description: "1. [Database Index ဆိုတာဘာလဲ? (စာအုပ်မာတိကာ ဥပမာ)](#၁-database-index-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၃) - B-Tree Indexing Deep Dive နှင့် Query Optimization
### (Lesson 13: How B-Tree Works, Clustered vs Secondary Indexes, Composite Index & EXPLAIN ANALYZE)

---

## 📌 မာတိကာ (Contents)
1. [Database Index ဆိုတာဘာလဲ? (စာအုပ်မာတိကာ ဥပမာ)](#၁-database-index-ဆိုတာဘာလဲ)
2. [B-Tree (Balanced Tree) အတွင်းပိုင်း အလုပ်လုပ်ပုံ Diagram](#၂-b-tree-အတွင်းပိုင်း-အလုပ်လုပ်ပုံ)
3. [Clustered Index vs Secondary Index (အရေးကြီးသော ကွာခြားချက်)](#၃-clustered-index-vs-secondary-index)
4. [Composite Index (Multi-Column) နှင့် Leftmost Prefix Rule](#၄-composite-index-နှင့်-leftmost-prefix-rule)
5. [Covering Index (Database ၏ အမြန်ဆုံး Query)](#၅-covering-index)
6. [`EXPLAIN` နှင့် `EXPLAIN ANALYZE` ဖတ်ရှုနည်း (Slow Query Debugging)](#၆-explain-နှင့်-explain-analyze-ဖတ်ရှုနည်း)
7. [Index အလုပ်မလုပ်တော့အောင် ဖျက်ဆီးမိတတ်သော အမှား ၃ ချက်](#၇-index-အလုပ်မလုပ်တော့သော-အမှားများ)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Database Index ဆိုတာဘာလဲ?

စာမျက်နှာ ၅၀၀ ရှိသော စာအုပ်ကြီးထဲတွင် "Database" ဟူသော စကားလုံးကို ရှာလိုသည် ဆိုပါစို့:
* **Index မပါပါက (Full Table Scan)**: စာမျက်နှာ ၁ မှစ၍ ၅၀၀ အထိ စာမျက်နှာတိုင်းကို လက်ဖြင့် လှန်လှောဖတ်ရသဖြင့် အချိန် အလွန်ကြာမြင့်သည် ($O(N)$)။
* **စာအုပ်နောက်ကျောရှိ Index (မာတိကာ) ပါပါက**: အက္ခရာ 'D' အောက်တွင် သွားကြည့်ပြီး "စာမျက်နှာ ၄၂" ဟု ချက်ချင်း လှန်ဖတ်နိုင်သည် ($O(\log N)$)။

Database တွင်လည်း သန်းပေါင်းများစွာသော Data များကို အစမှအဆုံး ရှာမနေရဘဲ စက္ကန့်ပိုင်းအတွင်း ရှာတွေ့စေရန် **Index (အညွှန်းဇယား)** ကို အသုံးပြုပါသည်။

---

## ၂။ B-Tree (Balanced Tree) အတွင်းပိုင်း အလုပ်လုပ်ပုံ

MySQL InnoDB သည် Index များကို **B-Tree (Balanced Search Tree)** ဖြင့် တည်ဆောက်ထားပါသည်:

```
                      ┌──────────────────────┐
                      │      ROOT NODE       │
                      │     [ 50  |  100 ]   │
                      └──────────┬───────────┘
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │ BRANCH NODE │   │ BRANCH NODE │   │ BRANCH NODE │
        │ [ 20 | 35 ] │   │ [ 65 | 80 ] │   │[ 120 | 150] │
        └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │ LEAF PAGES  │   │ LEAF PAGES  │   │ LEAF PAGES  │
        │ [10, 20, 35]│◄─►│ [50, 65, 80]│◄─►│[100,120,150]│
        └─────────────┘   └─────────────┘   └─────────────┘
```

ဒေတာ အကြောင်းရေ **၁ သန်း** ရှိလျှင်ပင် B-Tree ၏ အဆင့် (Height) သည် ၃ ဆင့် သို့မဟုတ် ၄ ဆင့်သာ ရှိသဖြင့် Disk ကို ၃ ကြိမ် သာ လှမ်းဖတ်ရုံဖြင့် မည်သည့် Data မဆို ချက်ချင်း ရှာတွေ့နိုင်ပါသည်။

---

## ၃။ Clustered Index vs Secondary Index

### (က) Clustered Index (Primary Key):
* InnoDB တွင် ဇယား၏ **Primary Key သည် Clustered Index** ဖြစ်သည်။
* Data အစစ်အမှန်များသည် Primary Key စီစဉ်ထားသော အစဉ်အတိုင်း Disk ပေါ်တွင် ရုပ်ပိုင်းဆိုင်ရာ အမှန်တကယ် စီတန်းသိမ်းဆည်းထားသည်။ (ဇယားတစ်ခုတွင် Clustered Index တစ်ခုတည်းသာ ရှိနိုင်သည်)။

### (ခ) Secondary Index (Non-Clustered Index):
* မိမိတို့ အသစ်ထပ်ထည့်သော Index များ (ဥပမာ- `email`, `created_at`) ဖြစ်သည်။
* Secondary Index ၏ Leaf Node ထဲတွင် တကယ့် Data များ မရှိဘဲ **Primary Key တန်ဖိုးကိုသာ ညွှန်ပြထားသည်**။
* ထို့ကြောင့် Secondary Index ဖြင့် ရှာပါက (၁) Index ထဲမှ PK ကို ရှာပြီး (၂) မူလ Clustered Index ဆီသို့ သွားရောက် ဒေတာပြန်ထုတ်ရသည် (Double Lookup)။

---

## ၄။ Composite Index နှင့် Leftmost Prefix Rule

Columns ၂ ခု သို့မဟုတ် ထိုထက်ပို၍ ပေါင်းစပ် Index တင်ခြင်းကို **Composite Index** ဟု ခေါ်သည်:

```sql
CREATE INDEX idx_category_price ON products (category_id, price);
```

### ⚠️ The Leftmost Prefix Rule (အလွန်အရေးကြီးသည်):
အကယ်၍ Index သည် `(category_id, price)` အစဉ်အတိုင်း ဖြစ်နေပါက:
* `WHERE category_id = 1` ──► **Index အလုပ်လုပ်သည် ✅**
* `WHERE category_id = 1 AND price < 500` ──► **Index အလုပ်လုပ်သည် ✅**
* `WHERE price < 500` (category_id မပါဝင်ပါ) ──► **Index လုံးဝ အလုပ်မလုပ်ပါ ❌ (Leftmost မကိုက်သောကြောင့်)**

---

## ၅။ Covering Index (Database ၏ အမြန်ဆုံး Query)

အကယ်၍ သင် `SELECT` လုပ်လိုက်သော Columns အားလုံးသည် Index ထဲတွင် အကုန်ပါဝင်နေပါက MySQL သည် တကယ့် Main Table သို့ သွားစရာမလိုဘဲ Index မှပင် တိုက်ရိုက် အဖြေထုတ်ပေးနိုင်သည်:

```sql
-- Index သတ်မှတ်ထားခြင်း
CREATE INDEX idx_user_lookup ON users (email, name);

-- Query လုပ်ခြင်း: တကယ့် Table ထဲ သွားမရှာတော့ဘဲ Index ကပင် ချက်ချင်း ပြန်ဖြေပေးသည် (Ultra Fast)
SELECT email, name FROM users WHERE email = 'aung@gmail.com';
```

---

## ၆။ `EXPLAIN` နှင့် `EXPLAIN ANALYZE` ဖတ်ရှုနည်း

မိမိ၏ Query မည်မျှ မြန်ဆန်သည်၊ Index သုံး/မသုံး သိရှိရန် Query ရှေ့တွင် `EXPLAIN` သို့မဟုတ် `EXPLAIN ANALYZE` တပ်၍ run ပါ:

```sql
EXPLAIN SELECT * FROM products WHERE price > 500;
```

```
┌──────┬──────────┬────────┬──────────────┬────────┬─────────┬────────┐
│ id   │ table    │ type   │ possible_keys│ key    │ rows    │ Extra  │
├──────┼──────────┼────────┼──────────────┼────────┼─────────┼────────┤
│ 1    │ products │ ref    │ idx_price    │idx_pric│ 15      │ NULL   │
└──────┴──────────┴────────┴──────────────┴────────┴─────────┴────────┘
```

### `type` ကော်လံ ကြည့်ရှုနည်း (အကောင်းဆုံးမှ အဆိုးဆုံးသို့):
$$\text{const} > \text{eq\_ref} > \text{ref} > \text{range} > \text{index} > \mathbf{ALL}$$
* **`ALL` ဖြစ်နေပါက (Full Table Scan)**: ဇယားတစ်ခုလုံး အစမှအဆုံး လိုက်ရှာနေရသဖြင့် အလွန်ဆိုးရွားပြီး အရေးပေါ် Index တင်ပေးရပါမည်။
* **`Extra` ထဲတွင်**:
  * `Using index`: အလွန်ကောင်းမွန်သည် (Covering index မိနေသည်)။
  * `Using filesort` / `Using temporary`: နှေးကွေးနေသည် (Memory/Disk ပေါ်တွင် ယာယီစီစဉ်နေရသည်)။

---

## ၇။ Index အလုပ်မလုပ်တော့အောင် ဖျက်ဆီးမိတတ်သော အမှား ၃ ချက်

### အမှား ၁: Column ပေါ်တွင် Function အုပ်လိုက်ခြင်း
```sql
-- ❌ Index မသုံးနိုင်ပါ (သန်းချီသော Row တိုင်းကို YEAR function လိုက်တွက်ရသည်)
SELECT * FROM orders WHERE YEAR(order_date) = 2026;

-- ✅ Index ကောင်းစွာ အလုပ်လုပ်သည်
SELECT * FROM orders 
WHERE order_date >= '2026-01-01 00:00:00' AND order_date <= '2026-12-31 23:59:59';
```

### အမှား ၂: ရှေ့တွင် `%` ပါသော LIKE
```sql
-- ❌ Index မသုံးနိုင်ပါ (Full Table Scan)
SELECT * FROM products WHERE title LIKE '%Apple';

-- ✅ Index အလုပ်လုပ်သည်
SELECT * FROM products WHERE title LIKE 'Apple%';
```

### အမှား ၃: Data Type မကိုက်ညီခြင်း (Implicit Type Conversion)
`phone_number` သည် `VARCHAR` ဖြစ်နေပြီး ဂဏန်းအဖြစ် ရှာဖွေမိပါက Index ပျက်ပြယ်သွားသည်:
```sql
-- ❌ Index မသုံးနိုင်ပါ
SELECT * FROM users WHERE phone_number = 09123456;

-- ✅ Index အလုပ်လုပ်သည်
SELECT * FROM users WHERE phone_number = '09123456';
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အကြံပြုချက် |
| :--- | :--- |
| **Index ဘယ်နေရာ တင်သင့်သလဲ?** | `WHERE`, `JOIN ON`, `ORDER BY` တွင် မကြာခဏ ပါဝင်သော Columns များကို တင်ပါ |
| **Index အများကြီး မတင်ရန် သတိပေးချက်** | Index များလွန်းပါက `INSERT`, `UPDATE` လုပ်တိုင်း Index များကို ပြန်ပြင်ရသဖြင့် ရေးသားမှု နှေးသွားသည် |
| **Query Tuning** | Slow Query ဖြစ်ပါက `EXPLAIN ANALYZE` ဖြင့် `type: ALL` ဖြစ်နေခြင်း ရှိ/မရှိ စစ်ဆေးပါ |

နောက်သင်ခန်းစာ [14_json_datatypes_and_nosql_in_mysql.md](/mysql/14_json_datatypes_and_nosql_in_mysql/) တွင် MySQL အား MongoDB ကဲ့သို့ Document Store အဖြစ် သုံးနိုင်သည့် Native JSON Data Types အကြောင်းကို လေ့လာပါမည်။
