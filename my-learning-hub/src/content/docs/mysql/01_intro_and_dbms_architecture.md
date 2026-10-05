---
title: "01. DBMS Architecture"
description: "1. [Database နှင့် DBMS ဆိုတာဘာလဲ? (ရိုးရိုး Excel/Text File နှင့် ဘာကွာသလဲ?)](#၁-database-နှင့်-dbms-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁) - MySQL DBMS မိတ်ဆက်နှင့် Architecture အလုပ်လုပ်ပုံ
### (Lesson 1: Introduction to RDBMS, MySQL Client-Server Architecture & Storage Engines)

---

## 📌 မာတိကာ (Contents)
1. [Database နှင့် DBMS ဆိုတာဘာလဲ? (ရိုးရိုး Excel/Text File နှင့် ဘာကွာသလဲ?)](#၁-database-နှင့်-dbms-ဆိုတာဘာလဲ)
2. [Relational Database Model သဘောတရားများ (Tables, Rows, PK, FK)](#၂-relational-database-model-သဘောတရားများ)
3. [MySQL Client-Server Architecture အလုပ်လုပ်ပုံ Diagram](#၃-mysql-client-server-architecture)
4. [Storage Engines နှိုင်းယှဉ်ချက် (InnoDB vs MyISAM vs Memory)](#၄-storage-engines-နှိုင်းယှဉ်ချက်)
5. [လက်တွေ့ Lab: MySQL Server သို့ ချိတ်ဆက်ခြင်းနှင့် အခြေခံ Commands များ](#၅-လက်တွေ့-lab)
6. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၆-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Database နှင့် DBMS ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is a DBMS?)
* **Data**: အချက်အလက်များ (ဥပမာ- လူနာမည် "Aung Aung", ဈေးနှုန်း "5000", ဖုန်းနံပါတ်)။
* **Database (DB)**: ဒေတာများကို စနစ်တကျ စုစည်းသိမ်းဆည်းထားသော အချက်အလက် သိုလှောင်ရုံ။
* **DBMS (Database Management System)**: အဆိုပါ Database အတွင်းသို့ ဒေတာ အသစ်ထည့်ခြင်း၊ ရှာဖွေခြင်း၊ ပြင်ဆင်ခြင်း၊ ဖျက်ခြင်း၊ လုံခြုံရေး ထိန်းသိမ်းခြင်း စသည်တို့ကို လုပ်ဆောင်ပေးသည့် ဆော့ဖ်ဝဲလ် ဖြစ်သည်။

### (ခ) ရိုးရိုး Excel သို့မဟုတ် Text File ထဲ သိမ်းလျှင် ဘာဖြစ်မလဲ?
အစပြုသူ အချို့က မေးတတ်သည် - *"ဒေတာတွေကို Excel Sheet ထဲ ဒါမှမဟုတ် JSON/Text file ထဲ သိမ်းရင် မရဘူးလား?"*

Excel / Text File တွင် သိမ်းပါက အောက်ပါ ကြီးမားသော ပြဿနာများ ကြုံရသည်:
1. **Concurrency ပြဿနာ**: လူ ၂ ယောက် တစ်ပြိုင်နက် ဖိုင်တစ်ခုတည်းကို ဝင်ပြင်ပါက Data များ ရောထွေးပျက်စီးသွားခြင်း (File Lock Conflict)။
2. **Performance အလွန်နှေးကွေးခြင်း**: Data အကြောင်းရေ ၁ သန်း ရှိလာပါက Excel သည် ဖွင့်မရတော့ဘဲ Hang ဖြစ်သွားခြင်း။
3. **Data Integrity (အမှားအယွင်း မရှိစေရန် စစ်ဆေးမှု) မရှိခြင်း**: အသက် နေရာတွင် စာသားများ ဝင်သွားခြင်း၊ Customer မရှိဘဲ Order ဖန်တီးမိခြင်း။
4. **Security မရှိခြင်း**: File တစ်ခုလုံးကို ဖွင့်ဖတ်နိုင်သူက Password အားလုံးကို အလွယ်တကူ မြင်တွေ့သွားနိုင်ခြင်း။

**RDBMS (MySQL)** သည် ဤပြဿနာအားလုံးကို ဖြေရှင်းပေးနိုင်သောကြောင့် ကမ္ဘာ့ Web Applications ၉၀% ကျော် (Facebook, Twitter, WordPress, E-Commerce) တွင် အဓိက အသုံးပြုကြခြင်း ဖြစ်သည်။

---

## ၂။ Relational Database Model သဘောတရားများ

MySQL သည် ဒေတာများကို **ဇယား (Tables)** အသွင်ဖြင့် သက်ဆိုင်ရာ ဆက်စပ်မှု (Relations) များ ဖန်တီး၍ သိမ်းဆည်းပါသည်။

```
┌────────────────────────────────────────────────────────┐
│                   USERS TABLE                          │
├────────────┬──────────────────┬────────────────────────┤
│ id (PK)    │ name             │ email                  │
├────────────┼──────────────────┼────────────────────────┤
│ 1          │ Ko Aung          │ aung@gmail.com         │
│ 2          │ Ma Su            │ su@gmail.com           │
└─────┬──────┴──────────────────┴────────────────────────┘
      │
      │ 1-to-Many Relationship (တစ်ဦးက အော်ဒါများစွာ တင်နိုင်သည်)
      ▼
┌────────────────────────────────────────────────────────┐
│                   ORDERS TABLE                         │
├────────────┬──────────────────┬───────────┬────────────┤
│ order_id   │ user_id (FK)     │ amount    │ status     │
├────────────┼──────────────────┼───────────┼────────────┤
│ 101        │ 1                │ 25000     │ paid       │
│ 102        │ 1                │ 12000     │ pending    │
│ 103        │ 2                │ 45000     │ shipped    │
└────────────┴──────────────────┴───────────┴────────────┘
```

* **Table (ဇယား)**: သက်ဆိုင်ရာ ဒေတာ အုပ်စုတစ်ခု (ဥပမာ- `users`, `products`, `orders`)။
* **Row / Record (အတန်း)**: ဒေတာတစ်ခုချင်းစီ (ဥပမာ- Ko Aung ၏ အချက်အလက် တစ်ကြောင်း)။
* **Column / Field (ဒေါင်လိုက်ကော်လံ)**: သတ်မှတ်ထားသော ဂုဏ်သတ္တိ (ဥပမာ- `name`, `price`, `created_at`)။
* **Primary Key (PK)**: ဇယားတစ်ခုတွင် Row တစ်ခုချင်းစီကို မထပ်ဘဲ သီးခြားခွဲခြားနိုင်သော တမူထူးခြားသည့် သော့ချက် (ဥပမာ- `id` - တန်ဖိုး မထပ်ရ၊ `NULL` မဖြစ်ရ)။
* **Foreign Key (FK)**: အခြား ဇယားတစ်ခု၏ Primary Key ကို လှမ်းညွှန်းထားသော ဆက်စပ်မှု သော့ချက် (ဥပမာ- `orders` ဇယားထဲရှိ `user_id`)။

---

## ၃။ MySQL Client-Server Architecture

MySQL သည် **Client-Server Model** ဖြင့် အလုပ်လုပ်သည်:

```
┌─────────────────────────────────┐
│     MySQL Clients / Apps        │
│  - PHP / Laravel Application    │
│  - mysql CLI (Terminal)         │
│  - DBeaver / TablePlus GUI      │
└───────────────┬─────────────────┘
                │ SQL Queries over TCP Port 3306 / UNIX Socket
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MySQL SERVER (mysqld daemon)                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Connection Pooler & Authentication (User, Pass, SSL)      │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │ SQL Parser, Optimizer & Query Cache                       │  │
│  │ (Query ကို အမြန်ဆုံး အလုပ်ဖြစ်မည့် Execution Plan ဆွဲသည်)      │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │ PLUGGABLE STORAGE ENGINES                                 │  │
│  │  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │  │
│  │  │   InnoDB     │     │    MyISAM    │     │  Memory   │  │  │
│  │  │ (ACID & Row) │     │ (Table-Lock) │     │  (RAM)    │  │  │
│  │  └──────┬───────┘     └──────────────┘     └───────────┘  │  │
│  └─────────┼─────────────────────────────────────────────────┘  │
└────────────┼────────────────────────────────────────────────────┘
             ▼
     [ Physical Disk Files (.ibd data, redo logs, binlogs) ]
```

---

## ၄။ Storage Engines နှိုင်းယှဉ်ချက်

MySQL ၏ အလွန်ထူးခြားသော အားသာချက်မှာ ဒေတာများကို Disk ပေါ်တွင် သိမ်းဆည်းသည့် **Storage Engine** ကို လိုသလို လဲလှယ်တပ်ဆင်နိုင်ခြင်း (Pluggable Storage Engines) ဖြစ်သည်။

| သွင်ပြင်လက္ခဏာ | InnoDB (Default & စံနှုန်း) | MyISAM (Legacy ခေတ်ဟောင်း) | Memory (HEAP) |
| :--- | :--- | :--- | :--- |
| **Transactions (ACID)** | **ထောက်ပံ့သည် (အပြည့်အဝ)** | မထောက်ပံ့ပါ | မထောက်ပံ့ပါ |
| **Locking Level** | **Row-level Locking** (အပြိုင် ပြင်ဆင်နိုင်သည်) | Table-level Locking (ဇယားတစ်ခုလုံး Lock ကျသည်) | Table-level Locking |
| **Foreign Keys** | **ထောက်ပံ့သည်** | မထောက်ပံ့ပါ | မထောက်ပံ့ပါ |
| **Crash Recovery** | အလွန်ကောင်းမွန်သည် (Redo Logs ဖြင့် auto-recover) | ပျက်စီးလွယ်သည် (`REPAIR TABLE` လုပ်ရသည်) | Server ပိတ်ပါက Data အားလုံး ပျောက်သည် |
| **အသုံးပြုသင့်သည့် နေရာ** | **လုပ်ငန်းခွင်သုံး Web Apps အားလုံးအတွက်** | ခေတ်ဟောင်း Read-only archives | အလွန်မြန်သော ယာယီ Lookup tables များ |

> [!IMPORTANT]
> လက်ရှိခေတ်တွင် Production အတွက် **InnoDB မှလွဲ၍ အခြား engine များကို လုံးဝ မသုံးသင့်ပါ**။

---

## ၅။ လက်တွေ့ Lab: MySQL Server သို့ ချိတ်ဆက်ခြင်း

### အဆင့် ၁: Terminal မှတစ်ဆင့် MySQL သို့ Login ဝင်ခြင်း
```bash
mysql -u root -p
# Password ရိုက်ထည့်ပါ
```

### အဆင့် ၂: Server Status နှင့် ဗားရှင်း စစ်ဆေးခြင်း
```sql
STATUS;
SELECT VERSION();
```

### အဆင့် ၃: Database အသစ် ဖန်တီးခြင်းနှင့် ကြည့်ရှုခြင်း
```sql
-- Database များ အားလုံး စာရင်းကြည့်ခြင်း
SHOW DATABASES;

-- UTF-8 စာလုံးပေါင်းစုံ (မြန်မာစာ အပါအဝင်) ထောက်ပံ့သော Database တည်ဆောက်ခြင်း
CREATE DATABASE shop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- အဆိုပါ Database ထဲသို့ ဝင်ရောက် အသုံးပြုခြင်း
USE shop_db;

-- လက်ရှိ ရောက်နေသော Database အမည်ကို စစ်ဆေးခြင်း
SELECT DATABASE();
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက်အလက် (Concept) | သဘောပေါက် နားလည်မှု |
| :--- | :---: |
| **RDBMS Role** | Concurrency, Data Integrity, Security ကြောင့် File/Excel အစား RDBMS သုံးရကြောင်း နားလည်ခြင်း |
| **Relational Model** | Primary Key (PK) နှင့် Foreign Key (FK) ၏ အရေးပါပုံကို သဘောပေါက်ခြင်း |
| **Storage Engine** | Production တွင် Transaction နှင့် Row-level locking ရရှိသော InnoDB ကိုသာ သုံးရမည်ကို သိရှိခြင်း |
| **UTF8MB4 Encoding** | မြန်မာစာနှင့် Emojis များ မပျက်စီးစေရန် `utf8mb4` character set သုံးရမည်ကို သိရှိခြင်း |

နောက်သင်ခန်းစာ [02_datatypes_and_table_schema_design.md](/mysql/02_datatypes_and_table_schema_design/) တွင် MySQL ၏ Data Types များနှင့် ဇယားများ စနစ်တကျ ရေးဆွဲတည်ဆောက်ပုံကို ဆက်လက် လေ့လာပါမည်။
