---
title: "02. Schema Design and DataTypes"
description: "1. [MySQL Data Types အမျိုးအစားများ အသေးစိတ်](#၁-mysql-data-types-အမျိုးအစားများ)"
---

## 🐬 သင်ခန်းစာ (၂) - Data Types များနှင့် ဇယားများ စနစ်တကျ ဒီဇိုင်းရေးဆွဲခြင်း
### (Lesson 2: MySQL Data Types, DDL Schema Design, Table Constraints & Foreign Keys)

---

## 📌 မာတိကာ (Contents)
1. [MySQL Data Types အမျိုးအစားများ အသေးစိတ်](#၁-mysql-data-types-အမျိုးအစားများ)
   - [၁.၁။ ကိန်းဂဏန်းအမျိုးအစားများ (Numbers) - ငွေကြေးအတွက် `DECIMAL` အဘယ်ကြောင့် သုံးရသလဲ?](#၁၁-ကိန်းဂဏန်းအမျိုးအစားများ)
   - [၁.၂။ စာသားအမျိုးအစားများ (Strings) - `CHAR` vs `VARCHAR` vs `TEXT`](#၁၂-စာသားအမျိုးအစားများ)
   - [၁.၃။ ရက်စွဲနှင့် အချိန်အမျိုးအစားများ (Dates) - `DATETIME` vs `TIMESTAMP`](#၁၃-ရက်စွဲနှင့်-အချိန်အမျိုးအစားများ)
   - [၁.၄။ အခြားအမျိုးအစားများ (`BOOLEAN`, `ENUM`, `JSON`)](#၁၄-အခြားအမျိုးအစားများ)
2. [ဇယား စည်းမျဉ်းများ (Constraints)](#၂-ဇယား-စည်းမျဉ်းများ-constraints)
   - [`PRIMARY KEY` နှင့် `AUTO_INCREMENT`](#primary-key-နှင့်-auto_increment)
   - [`NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`](#not-null-unique-default-check)
   - [`FOREIGN KEY` ဆက်သွယ်ချက်များနှင့် `ON DELETE CASCADE`](#foreign-key-ဆက်သွယ်ချက်များ)
3. [DDL Commands (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`)](#၃-ddl-commands)
4. [လက်တွေ့ Production E-Commerce Schema တည်ဆောက်ခြင်း Project](#၄-လက်တွေ့-production-e-commerce-schema)
5. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၅-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ MySQL Data Types အမျိုးအစားများ

Database တစ်ခု တည်ဆောက်ရာတွင် Column တစ်ခုချင်းစီအတွက် မှန်ကန်သော **Data Type** ကို ရွေးချယ်ခြင်းသည် Disk နေရာချွေတာနိုင်ခြင်း၊ Query ရှာဖွေမှု အလွန်မြန်ဆန်ခြင်းနှင့် Data မှားယွင်းမှု မရှိစေခြင်းတို့အတွက် အသက်သွေးကြော ဖြစ်သည်။

---

### ၁.၁။ ကိန်းဂဏန်းအမျိုးအစားများ (Numbers)

| Data Type | Storage Size | လက်ခံနိုင်သော ပမာဏ Range | အသုံးပြုသင့်သည့် နေရာ |
| :--- | :---: | :--- | :--- |
| **`TINYINT`** | 1 Byte | -128 to 127 (Unsigned: 0 to 255) | Status (0=inactive, 1=active), အသက် |
| **`SMALLINT`** | 2 Bytes | -32,768 to 32,767 (Unsigned: 0 to 65,535) | ခုနှစ် (Year), စာမျက်နှာ အရေအတွက် |
| **`INT`** | 4 Bytes | -2.1 Billion to +2.1 Billion | သာမန် ID များ၊ ပစ္စည်းအရေအတွက် (Quantity) |
| **`BIGINT`** | 8 Bytes | ကြီးမားလွန်းသော ကိန်းဂဏန်းများ | Facebook Like များ၊ Global Transaction IDs |
| **`DECIMAL(M,D)`**| Variable | **တိကျသော ဒသမကိန်း (Exact Fixed Point)** | **ငွေကြေး၊ ဈေးနှုန်း (Prices, Balance)** |
| **`FLOAT` / `DOUBLE`**| 4/8 Bytes | ခန့်မှန်း ဒသမကိန်း (Approximate Floating) | သိပ္ပံနည်းကျ တွက်ချက်မှု၊ GPS Coordinates |

> [!CAUTION]
> **အလွန်အရေးကြီးသော သတိပေးချက်**:  
> ဘဏ်စနစ်၊ ငွေပေးချေမှု၊ ကုန်ပစ္စည်းဈေးနှုန်းများအတွက် **`FLOAT` သို့မဟုတ် `DOUBLE` ကို မည်သည့်အခါမျှ မသုံးပါနှင့်!**  
> ကွန်ပျူတာ၏ IEEE 754 Floating-point သဘာဝအရ `0.1 + 0.2 = 0.30000000000000004` စသဖြင့် ပြားစွန်း ဒသမအမှားများ ဖြစ်ပေါ်တတ်သည်။  
> ငွေကြေးအတွက် **`DECIMAL(12, 2)` (ဂဏန်းစုစုပေါင်း ၁၂ လုံး၊ ဒသမနောက် ၂ လုံး) ကိုသာ အမြဲတမ်း သုံးရပါမည်**။

---

### ၁.၂။ စာသားအမျိုးအစားများ (Strings)

* **`CHAR(N)` (Fixed-length - အလျားအသေ)**:
  * သတ်မှတ်ထားသော စာလုံးရေ အတိအကျ အမြဲရှိသော နေရာများတွင် သုံးသည် (ဥပမာ- နိုင်ငံကုဒ် `CHAR(2)` -> 'MM', 'US', MD5 Hash `CHAR(32)`)။
* **`VARCHAR(N)` (Variable-length - အလျားအရှင်)**:
  * စာလုံးအရှည် မတူညီသော နေရာများတွင် သုံးသည် (ဥပမာ- နာမည် `VARCHAR(100)`, Email `VARCHAR(255)`)။ အမှန်တကယ် ရိုက်ထည့်လိုက်သော စာလုံးအရှည်လောက်သာ နေရာယူသဖြင့် Disk ချွေတာသည်။
* **`TEXT` (`MEDIUMTEXT`, `LONGTEXT`)**:
  * စာပိုဒ်ရှည်ကြီးများ၊ Blog ပို့စ်များ၊ အသုံးပြုသူ မှတ်ချက်များ သိမ်းဆည်းရန် သုံးသည်။ (မှတ်ချက်: `TEXT` columns များသည် Memory တွင် နေရာပိုယူသဖြင့် လိုအပ်မှသာ သုံးသင့်သည်)။

---

### ၁.၃။ ရက်စွဲနှင့် အချိန်အမျိုးအစားများ (Dates)

* **`DATE`**: 'YYYY-MM-DD' (ဥပမာ- မွေးသက္ကရာဇ် '1995-10-25')။
* **`TIME`**: 'HH:MM:SS' (ဥပမာ- ဆိုင်ဖွင့်ချိန် '09:00:00')။
* **`DATETIME`**: 'YYYY-MM-DD HH:MM:SS' (Timezone မပါဝင်ဘဲ ရိုက်ထည့်လိုက်သော အချိန်အတိုင်း အသေသိမ်းဆည်းသည်)။
* **`TIMESTAMP`**: UTC Timezone သို့ အလိုအလျောက် ပြောင်းလဲသိမ်းဆည်းပြီး ဖတ်သည့်အခါ Client Timezone အတိုင်း အလိုအလျောက် ပြန်လည်ပြောင်းပေးသည်။ (Post created_at, updated_at များအတွက် အလွန်သင့်တော်သည်)။

---

## ၂။ ဇယား စည်းမျဉ်းများ (Constraints)

ဒေတာများ မမှားယွင်းစေရန် ဇယားတွင် အောက်ပါ စည်းမျဉ်းများ ထည့်သွင်းရပါသည်:

1. **`PRIMARY KEY`**: ဇယား၏ အဓိက သော့ချက်။ တန်ဖိုး မထပ်ရ၊ `NULL` မဖြစ်ရ။
2. **`AUTO_INCREMENT`**: ဒေတာအသစ် ထည့်လိုက်တိုင်း `id` ကို ၁၊ ၂၊ ၃ ဟု အလိုအလျောက် ၁ တိုးပေးခြင်း။
3. **`NOT NULL`**: အဆိုပါ Column ထဲတွင် တန်ဖိုး မဖြစ်မနေ ထည့်ရမည် (ဗလာ ချန်မထားရ)။
4. **`UNIQUE`**: တန်ဖိုး မထပ်ရ (ဥပမာ- `email` သို့မဟုတ် `phone_number`)။
5. **`DEFAULT <value>`**: တန်ဖိုး မထည့်ခဲ့ပါက မူလသတ်မှတ်ထားသော တန်ဖိုး အလိုအလျောက် ဝင်သွားစေရန် (ဥပမာ- `status DEFAULT 'pending'`)။
6. **`CHECK (condition)`**: MySQL 8.0 တွင် တန်ဖိုး စည်းကမ်းချက် စစ်ဆေးခြင်း (ဥပမာ- `CHECK (age >= 18)`)။
7. **`FOREIGN KEY` (FK)**:
   * အခြားဇယားနှင့် ဆက်စပ်ပေးခြင်း။
   * **`ON DELETE CASCADE`**: မိဘဇယားမှ User ပျက်သွားပါက ထို User ၏ အော်ဒါများကို အလိုအလျောက် တစ်ပါတည်း ဖျက်ပစ်ခြင်း။
   * **`ON DELETE RESTRICT` (Default)**: အော်ဒါများ ကျန်ရှိနေသေးပါက အဆိုပါ User ကို ဖျက်ခွင့် မပြုဘဲ တားဆီးခြင်း (လုံခြုံရေးအရ ပိုမိုကောင်းမွန်သည်)။

---

## ၃။ DDL Commands (Data Definition Language)

```sql
-- ဇယားအသစ် ဆောက်ခြင်း
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ဇယားထဲသို့ Column အသစ် ထပ်ထည့်ခြင်း
ALTER TABLE categories ADD description TEXT NULL AFTER name;

-- Column ၏ Data Type ကို ပြင်ဆင်ခြင်း
ALTER TABLE categories MODIFY name VARCHAR(150) NOT NULL;

-- Column ကို ပြန်လည် ဖျက်ထုတ်ခြင်း
ALTER TABLE categories DROP COLUMN description;

-- ဇယားတစ်ခုလုံးကို အပြီးတိုင် ဖျက်ပစ်ခြင်း
DROP TABLE IF EXISTS categories;
```

---

## ၄။ လက်တွေ့ Production E-Commerce Schema တည်ဆောက်ခြင်း

လက်တွေ့ လုပ်ငန်းခွင် စံချိန်မီ Relational Database Schema တစ်ခုကို ရေးဆွဲပါမည်:

```sql
-- ၁။ Users ဇယား (ဖောက်သည်များ)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ၂။ Categories ဇယား (ကုန်ပစ္စည်း အမျိုးအစား)
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ၃။ Products ဇယား (ကုန်ပစ္စည်းများ)
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ၄။ Orders ဇယား (အော်ဒါခေါင်းစဉ်)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ၅။ Order Items ဇယား (အော်ဒါတစ်ခုချင်းစီရှိ ပစ္စည်းအသေးစိတ်)
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;
```

---

## ၅။ လုပ်ငန်းခွင်သုံး Summary Checklist

| ဒီဇိုင်း စည်းမျဉ်း | မှန်ကန်သော အလေ့အကျင့် | စစ်ဆေးပြီး |
| :--- | :--- | :---: |
| **Money Storage** | ငွေကြေးအတွက် `DECIMAL(10, 2)` သုံးထားသလား? (`FLOAT` မသုံးရ) | [ ] |
| **Primary Keys** | ဇယားတိုင်းတွင် `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` ရှိသလား? | [ ] |
| **Time Tracking** | စာရင်းအသစ်နှင့် ပြင်ဆင်ချိန်အတွက် `created_at` နှင့် `updated_at` ထည့်ထားသလား? | [ ] |
| **Foreign Keys** | စည်းမဲ့ကမ်းမဲ့ မဖျက်နိုင်စေရန် `ON DELETE RESTRICT` ကို ဦးစားပေးထားသလား? | [ ] |
| **Data Integrity** | အနှုတ်လက္ခဏာ မဖြစ်စေရန် `UNSIGNED` သို့မဟုတ် `CHECK (price >= 0)` သုံးထားသလား? | [ ] |

နောက်သင်ခန်းစာ [03_crud_and_sql_essentials.md](/mysql/03_crud_and_sql_essentials/) တွင် အဆိုပါ ဇယားများထဲသို့ ဒေတာများ ထည့်သွင်းခြင်း၊ ပြင်ဆင်ခြင်း၊ ဖျက်ခြင်းဆိုင်ရာ CRUD Operations များကို လက်တွေ့ ဆက်လက်လေ့လာပါမည်။
