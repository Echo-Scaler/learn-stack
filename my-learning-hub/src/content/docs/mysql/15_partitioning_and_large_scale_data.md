---
title: "15. Partitioning and Large-Scale Data"
description: "1. [Table Partitioning ဆိုတာဘာလဲ? (ဖိုင်တွဲ အခန်းကန့်များ ဥပမာ)](#၁-table-partitioning-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၅) - Table Partitioning နှင့် သန်းပေါင်းများစွာသော Big Data များ စီမံခန့်ခွဲခြင်း
### (Lesson 15: Table Partitioning Strategies, Range/List/Hash, Partition Pruning & Fast Data Archiving)

---

## 📌 မာတိကာ (Contents)
1. [Table Partitioning ဆိုတာဘာလဲ? (ဖိုင်တွဲ အခန်းကန့်များ ဥပမာ)](#၁-table-partitioning-ဆိုတာဘာလဲ)
2. [မည်သည့်အချိန်တွင် Partitioning ပြုလုပ်သင့်သနည်း?](#၂-မည်သည့်အချိန်တွင်-partitioning-ပြုလုပ်သင့်သနည်း)
3. [Partitioning အမျိုးအစား ၄ မျိုး (RANGE, LIST, HASH, KEY)](#၃-partitioning-အမျိုးအစား-၄-မျိုး)
4. [Partitioning ၏ ရွှေစည်းမျဉ်း (Primary Key Requirement)](#၄-partitioning-၏-ရွှေစည်းမျဉ်း)
5. [Partition Pruning ၏ အစွမ်းထက်ပုံ (Query များကို အဆ ၁၀၀ မြန်စေခြင်း)](#၅-partition-pruning)
6. [လက်တွေ့ Production Range Partitioning ရေးဆွဲခြင်း](#၆-လက်တွေ့-range-partitioning)
7. [နှစ်ပေါင်းများစွာသော Data အဟောင်းများကို ၀.၁ စက္ကန့်ဖြင့် ရှင်းထုတ်နည်း (`DROP PARTITION`)](#၇-data-အဟောင်းများကို-ရှင်းထုတ်နည်း)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Table Partitioning ဆိုတာဘာလဲ?

ဇယားတစ်ခုတည်းတွင် ဒေတာ အကြောင်းရေ **သန်း ၅၀ သို့မဟုတ် သန်း ၁၀၀** ရှိလာပါက Index တင်ထားသော်လည်း Table ကြီးမားလွန်းသဖြင့် Disk I/O နှေးကွေးလာသည်။

**Table Partitioning** ဆိုသည်မှာ SQL ရေးသားသည့်အခါ ဇယားတစ်ခုတည်းအဖြစ်သာ မြင်တွေ့ရသော်လည်း၊ နောက်ကွယ် Physical Hard Disk ပေါ်တွင် အဆိုပါ ဇယားကြီးအား ဖိုင်အသေးစားလေးများ (ဥပမာ- ၂၀၂၃ ခုနှစ်ဖိုင်၊ ၂၀၂၄ ခုနှစ်ဖိုင်၊ ၂၀၂၅ ခုနှစ်ဖိုင်) အဖြစ် **အခန်းကန့် သီးခြားစီ ခွဲထုတ်သိမ်းဆည်းပေးသည့် နည်းပညာ** ဖြစ်ပါသည်။

```
[ LOGICAL TABLE (SQL က မြင်ရသော ပုံစံ) ]
orders (Total: 50,000,000 Rows)
                    │
                    ▼ (PARTITION BY RANGE)
[ PHYSICAL DISK FILES (Disk ပေါ် အမှန်တကယ် ကွဲထွက်သွားသော ဖိုင်များ) ]
├── orders#p_2023.ibd  (Data from 2023: 15 Million Rows)
├── orders#p_2024.ibd  (Data from 2024: 20 Million Rows)
└── orders#p_2025.ibd  (Data from 2025: 15 Million Rows)
```

---

## ၂။ မည်သည့်အချိန်တွင် Partitioning ပြုလုပ်သင့်သနည်း?

* ဇယားတစ်ခုထဲတွင် ဒေတာ အကြောင်းရေ **သန်း ၁၀ ကျော် (သို့မဟုတ် Disk ပေါ်တွင် 50GB ထက်ကြီးမား)** လာသည့်အခါ။
* Application တွင် **Historical Data (သမိုင်းမှတ်တမ်းများ)** ဖြစ်သော Orders, Payments, Audit Logs, System Activity များသည် ရက်စွဲအလိုက် စုပြုံလာသည့်အခါ။

---

## ၃။ Partitioning အမျိုးအစား ၄ မျိုး

1. **`RANGE` Partitioning**: ကိန်းဂဏန်း သို့မဟုတ် ရက်စွဲအပိုင်းအခြားအလိုက် ခွဲခြင်း (အသုံးအများဆုံး)။
2. **`LIST` Partitioning**: တိကျသော တန်ဖိုးအုပ်စုအလိုက် ခွဲခြင်း (ဥပမာ- တိုက်ကြီးများ သို့မဟုတ် နိုင်ငံကုဒ်များ)။
3. **`HASH` Partitioning**: Partition N ခု သတ်မှတ်ပြီး MySQL ၏ Hash Algorithm ဖြင့် ဒေတာများကို အညီအမျှ ခွဲဝေထည့်သွင်းခြင်း။
4. **`KEY` Partitioning**: HASH နှင့် ဆင်တူပြီး Primary Key ကို သုံးသည်။

---

## ၄။ Partitioning ၏ ရွှေစည်းမျဉ်း

> [!IMPORTANT]
> Partition ခွဲရန် ရွေးချယ်လိုက်သော Column (ဥပမာ- `created_at` သို့မဟုတ် `order_date`) သည် ဇယား၏ **Primary Key နှင့် Unique Key ထဲတွင် မဖြစ်မနေ ပါဝင်ရပါမည် (Part of the Primary Key)**။ မဟုတ်ပါက MySQL က Partition တည်ဆောက်ခွင့် မပြုပါ။

---

## ၅။ Partition Pruning

သင်သည် ၂၀၂၅ ခုနှစ်မှ အော်ဒါများကို ရှာလိုပါက:
```sql
SELECT * FROM orders WHERE order_date >= '2025-01-01';
```
MySQL Optimizer သည် ၂၀၂၃ နှင့် ၂၀၂၄ Partition ဖိုင်များကို လုံးဝ လှမ်းမဖတ်ဘဲ လျစ်လျူရှုထားခဲ့ပြီး **`orders#p_2025.ibd` ဖိုင်တစ်ခုတည်းကိုသာ တိုက်ရိုက် သွားဖတ်ပါသည် (Partition Pruning)**။  
ထို့ကြောင့် ဒေတာ သန်း ၁၀၀ ရှိနေစေကာမူ မီလီစက္ကန့်ပိုင်းဖြင့် မြန်ဆန်နေခြင်း ဖြစ်သည်။

---

## ၆။ လက်တွေ့ Production Range Partitioning ရေးဆွဲခြင်း

```sql
CREATE TABLE transaction_logs (
    id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    log_date DATE NOT NULL,
    PRIMARY KEY (id, log_date) -- ရွှေစည်းမျဉ်း: log_date သည် PK ထဲတွင် ပါရမည်
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(log_date)) (
    PARTITION p_2023 VALUES LESS THAN (2024),
    PARTITION p_2024 VALUES LESS THAN (2025),
    PARTITION p_2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### Partition Pruning စစ်ဆေးခြင်း:
```sql
EXPLAIN SELECT * FROM transaction_logs WHERE log_date = '2025-05-15';
```
`partitions` ကော်လံတွင် `p_2025` တစ်ခုတည်းကိုသာ ညွှန်ပြနေသည်ကို တွေ့ရမည်။

---

## ၇။ Data အဟောင်းများကို ၀.၁ စက္ကန့်ဖြင့် ရှင်းထုတ်နည်း (`DROP PARTITION`)

သမားရိုးကျ `DELETE FROM transaction_logs WHERE log_date < '2024-01-01';` ဟု ဖျက်ပါက:
* Row သန်းပေါင်းများစွာကို တစ်ကြောင်းချင်း လိုက်ဖျက်သဖြင့် ဇယားတစ်ခုလုံး Lock ကျပြီး မိနစ်ပေါင်းများစွာ ကြာမြင့်ကာ စနစ်တစ်ခုလုံး ရပ်တန့်သွားနိုင်သည်။

Partition သုံးထားပါက အဆိုပါ ၂၀၂၃ ဖိုင်တစ်ခုလုံးကို **Disk ပေါ်မှ ဖိုင်ဖျက်သကဲ့သို့ ၀.၁ စက္ကန့်အတွင်း အပြီးဖျက်ပစ်နိုင်ပါသည်**:

```sql
ALTER TABLE transaction_logs DROP PARTITION p_2023;
```
Lock မကျပါ၊ Undo Log မရေးရပါ၊ CPU 0% ဖြင့် ချက်ချင်း ရှင်းလင်းသွားပါမည်။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက်အလက် | စစ်ဆေးရန် | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Partition Column** | Partition လုပ်သော Column အား Primary Key ထဲ ထည့်ထားသလား? | [ ] |
| **Pruning Verification** | `EXPLAIN` တွင် သက်ဆိုင်ရာ Partition တစ်ခုတည်းကိုသာ ဖတ်ရှုကြောင်း စစ်ဆေးပြီးပြီလား? | [ ] |
| **Future Partition** | အသစ်ဝင်လာမည့် ဒေတာများအတွက် `MAXVALUE` ထည့်ထားသလား? | [ ] |
| **Instant Purge** | Log အဟောင်းများ ဖျက်ရန် `DELETE` အစား `DROP PARTITION` ကို အသုံးပြုသလား? | [ ] |

နောက်သင်ခန်းစာ [16_mysql_backup_restore_and_disaster_recovery.md](/mysql/16_mysql_backup_restore_and_disaster_recovery/) တွင် Database ပျက်စီးသွားပါက မည်သည့် Data မျှ မဆုံးရှုံးစေရန် `mysqldump` နှင့် Binary Logs (Binlog) အသုံးပြုပုံကို လေ့လာပါမည်။
