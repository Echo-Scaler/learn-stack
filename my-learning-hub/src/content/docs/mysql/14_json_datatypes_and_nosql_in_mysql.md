---
title: "14. JSON DataTypes and NoSQL"
description: "1. [MySQL တွင် JSON အဘယ်ကြောင့် အသုံးပြုရသလဲ? (RDBMS + NoSQL ပေါင်းစပ်မှု)](#၁-mysql-တွင်-json-အဘယ်ကြောင့်-အသုံးပြုရသလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၄) - Native JSON Data Types နှင့် NoSQL စွမ်းဆောင်ရည်
### (Lesson 14: MySQL as Document Store, JSON Operators, JSON Functions & Indexing JSON)

---

## 📌 မာတိကာ (Contents)
1. [MySQL တွင် JSON အဘယ်ကြောင့် အသုံးပြုရသလဲ? (RDBMS + NoSQL ပေါင်းစပ်မှု)](#၁-mysql-တွင်-json-အဘယ်ကြောင့်-အသုံးပြုရသလဲ)
2. [Native `JSON` Data Type နှင့် သာမန် `TEXT` ဖိုင် မတူညီပုံ](#၂-native-json-data-type)
3. [JSON Extraction Operators (`->` နှင့် `->>`)](#၃-json-extraction-operators)
4. [JSON Functions များ (`JSON_SET`, `JSON_INSERT`, `JSON_REMOVE`, `JSON_CONTAINS`)](#၄-json-functions-များ)
5. [JSON Fields များကို Index တင်၍ ရှာဖွေမှု အလွန်မြန်ဆန်စေနည်း (Virtual Columns & Multi-Valued Indexes)](#၅-json-fields-များကို-index-တင်နည်း)
6. [လက်တွေ့ Production E-Commerce Dynamic Attributes Schema](#၆-လက်တွေ့-dynamic-attributes)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ MySQL တွင် JSON အဘယ်ကြောင့် အသုံးပြုရသလဲ?

E-Commerce စနစ်တွင် ကုန်ပစ္စည်းများသည် မတူညီသော သွင်ပြင်လက္ခဏာများ ရှိကြသည်:
* တီရှပ် (T-Shirt) အတွက် `size`, `color`, `fabric` လိုအပ်သည်။
* လက်တော့ပ် (Laptop) အတွက် `ram`, `storage`, `cpu`, `screen_size` လိုအပ်သည်။

အကယ်၍ အဆိုပါ Attributes တစ်ခုချင်းစီအတွက် ဇယားထဲတွင် Column အသစ်များ လိုက်ဆောက်ပါက ဇယားသည် ကော်လံပေါင်း ရာနှင့်ချီ ဖြစ်လာပြီး အလွတ်များ (`NULL`) များစွာ ဖြစ်ပေါ်စေသည်။

MySQL ၏ **Native JSON Type** ကို အသုံးပြုခြင်းဖြင့် Relational ACID တည်ငြိမ်မှုနှင့် NoSQL (MongoDB) ကဲ့သို့ Dynamic Schema လွတ်လပ်မှု ၂ မျိုးစလုံးကို တစ်ပြိုင်နက် ရရှိစေပါသည်။

---

## ၂။ Native `JSON` Data Type

MySQL ၏ `JSON` column သည် ရိုးရိုး String/Text မဟုတ်ဘဲ **Internal Binary Format** ဖြင့် သိမ်းဆည်းသောကြောင့်:
1. JSON Syntax မှန်/မမှန် အလိုအလျောက် Validate စစ်ဆေးပေးသည်။
2. JSON Document တစ်ခုလုံးကို Parse မလုပ်ဘဲ လိုအပ်သော Key တစ်ခုတည်းကို မိုက်ခရိုစက္ကန့်ပိုင်းဖြင့် တိုက်ရိုက် ခုန်ကူးဖတ်ရှုနိုင်သည်။

```sql
CREATE TABLE product_catalogs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    attributes JSON NOT NULL
) ENGINE=InnoDB;

-- ဒေတာ ထည့်သွင်းခြင်း
INSERT INTO product_catalogs (title, attributes) VALUES
('Gaming Laptop', '{"brand": "ASUS", "specs": {"ram": "16GB", "cpu": "i7"}, "tags": ["gaming", "pc"]}');
```

---

## ၃။ JSON Extraction Operators (`->` နှင့် `->>`)

* **`->` (Arrow Operator)**: တန်ဖိုးကို JSON ပုံစံအတိုင်း ထုတ်ယူသည် (စာသားတွင် Quote `""` ပါလာသည်)။
* **`->>` (Double Arrow / Inline Path Operator)**: Quote များကို ဖယ်ရှားပြီး **သန့်ရှင်းသော String (Unquoted)** အဖြစ် ထုတ်ယူသည် (အသုံးအများဆုံး)။

```sql
-- "ASUS" (Quote ပါလာသည်)
SELECT attributes->'$.brand' FROM product_catalogs;

-- ASUS (Quote မပါသော သန့်ရှင်းသည့် စာသား)
SELECT attributes->>'$.brand' AS brand_name FROM product_catalogs;

-- Nested JSON အောက်မှ တန်ဖိုးဆွဲထုတ်ခြင်း
SELECT attributes->>'$.specs.ram' AS ram_size FROM product_catalogs;
```

---

## ၄။ JSON Functions များ

### (က) တန်ဖိုး အသစ်ထည့်ခြင်း သို့မဟုတ် ပြင်ဆင်ခြင်း (`JSON_SET`):
```sql
-- RAM ကို 32GB သို့ ပြောင်းလဲခြင်း
UPDATE product_catalogs 
SET attributes = JSON_SET(attributes, '$.specs.ram', '32GB')
WHERE id = 1;
```

### (ခ) Key တစ်ခုကို ဖျက်ပစ်ခြင်း (`JSON_REMOVE`):
```sql
UPDATE product_catalogs 
SET attributes = JSON_REMOVE(attributes, '$.specs.cpu')
WHERE id = 1;
```

### (ဂ) Array ထဲတွင် စာလုံး ပါ/မပါ စစ်ဆေးခြင်း (`JSON_CONTAINS`):
```sql
-- tags ထဲတွင် "gaming" ပါဝင်သော ပစ္စည်းများကို ရှာဖွေခြင်း
SELECT * FROM product_catalogs 
WHERE JSON_CONTAINS(attributes->'$.tags', '"gaming"');
```

---

## ၅။ JSON Fields များကို Index တင်နည်း

MySQL တွင် JSON Column တစ်ခုလုံးကို တိုက်ရိုက် B-Tree Index တင်၍ မရပါ။ သို့သော် အောက်ပါ အစွမ်းထက် နည်းလမ်း ၂ မျိုးဖြင့် အလွန်မြန်အောင် ပြုလုပ်နိုင်ပါသည်:

### နည်းလမ်း (က): Virtual Generated Column + Index (MySQL 5.7+)
JSON ထဲမှ Brand အမည်ကို Virtual Column အဖြစ် ထုတ်ယူပြီး Index တင်ခြင်း:
```sql
-- အဆင့် ၁: Virtual Column ထည့်ခြင်း (Disk နေရာမယူပါ)
ALTER TABLE product_catalogs 
ADD COLUMN brand VARCHAR(50) 
GENERATED ALWAYS AS (attributes->>'$.brand') VIRTUAL;

-- အဆင့် ၂: ထို Column ပေါ်တွင် B-Tree Index တင်ခြင်း
CREATE INDEX idx_product_brand ON product_catalogs (brand);

-- အလွန်မြန်ဆန်သော Query (Index မိသွားပြီ ဖြစ်သည်)
SELECT * FROM product_catalogs WHERE brand = 'ASUS';
```

### နည်းလမ်း (ခ): Multi-Valued Index (MySQL 8.0.17+ Array Indexing)
JSON Array တစ်ခုလုံးပေါ်တွင် တိုက်ရိုက် Index တင်ခြင်း:
```sql
CREATE INDEX idx_tags ON product_catalogs ( (CAST(attributes->'$.tags' AS CHAR(50) ARRAY)) );
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အကြံပြုချက် |
| :--- | :--- |
| **Dynamic / Polymorphic Attributes သိမ်းရန်** | Column ပေါင်းများစွာ မဆောက်ဘဲ `JSON` column သုံးပါ |
| **Data ထုတ်ဖတ်ရန်** | Quote ရှင်းလင်းပြီးသား ရရှိစေရန် `->>` ကို သုံးပါ |
| **JSON Performance Tuning** | မကြာခဏ `WHERE` စစ်ရသော JSON Key များကို Virtual Column ပြုလုပ်ပြီး Index တင်ပါ |

နောက်သင်ခန်းစာ [15_partitioning_and_large_scale_data.md](/mysql/15_partitioning_and_large_scale_data/) တွင် သန်းပေါင်း ဆယ်နှင့်ချီသော Big Data များကို Disk ပေါ်တွင် အကန့်လိုက် ခွဲခြမ်းစီမံနိုင်သည့် Table Partitioning အကြောင်းကို လေ့လာပါမည်။
