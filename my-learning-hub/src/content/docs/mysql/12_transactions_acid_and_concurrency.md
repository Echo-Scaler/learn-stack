---
title: "12. Transactions, ACID and Concurrency"
description: "1. [Transaction ဆိုတာဘာလဲ? (ဘဏ်ငွေလွှဲပြဿနာ ဥပမာ)](#၁-transaction-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၂) - ACID Transactions, Concurrency နှင့် Deadlocks
### (Lesson 12: ACID Properties, Transaction Isolation Levels, Row-Level Locking & Deadlocks)

---

## 📌 မာတိကာ (Contents)
1. [Transaction ဆိုတာဘာလဲ? (ဘဏ်ငွေလွှဲပြဿနာ ဥပမာ)](#၁-transaction-ဆိုတာဘာလဲ)
2. [ACID ဂုဏ်သတ္တိ ၄ ရပ် (Atomicity, Consistency, Isolation, Durability)](#၂-acid-ဂုဏ်သတ္တိ-၄-ရပ်)
3. [TCL Commands (`START TRANSACTION`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`)](#၃-tcl-commands)
4. [Concurrency ပြဿနာ ၃ မျိုး (Dirty Read, Non-Repeatable Read, Phantom Read)](#၄-concurrency-ပြဿနာ-၃-မျိုး)
5. [Transaction Isolation Levels ၄ မျိုး (MySQL Default: `REPEATABLE READ`)](#၅-transaction-isolation-levels-၄-မျိုး)
6. [Row-Level Locking နှင့် Race Condition ကာကွယ်ခြင်း (`FOR UPDATE`)](#၆-row-level-locking)
7. [Deadlock ဆိုတာဘာလဲ? မည်သို့ ဖြေရှင်းရသနည်း?](#၇-deadlock-ဆိုတာဘာလဲ)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Transaction ဆိုတာဘာလဲ? (ဘဏ်ငွေလွှဲပြဿနာ)

သင်သည် မောင်မောင် ထံမှ လှလှ ထံသို့ **ငွေကျပ် ၅ သောင်း** လွှဲပေးသည် ဆိုပါစို့။ ဤလုပ်ငန်းစဉ်တွင် SQL ၂ ကြောင်း ပါဝင်သည်:
1. မောင်မောင့် ဘဏ်အကောင့်ထဲမှ ၅ သောင်း နုတ်ယူခြင်း (`UPDATE accounts SET balance = balance - 50000 WHERE id = 1;`)
2. လှလှ၏ ဘဏ်အကောင့်ထဲသို့ ၅ သောင်း ထည့်ပေးခြင်း (`UPDATE accounts SET balance = balance + 50000 WHERE id = 2;`)

အကယ်၍ အဆင့် ၁ ပြီးဆုံးချိန်တွင် **မီးပျက်သွားပါက သို့မဟုတ် ဆာဗာ Crash ဖြစ်သွားပါက** မောင်မောင့်ဆီမှ ၅ သောင်း လျော့သွားသော်လည်း လှလှဆီသို့ ငွေမရောက်ဘဲ **ငွေ ၅ သောင်း လေထဲတွင် ပျောက်ဆုံးသွားပါလိမ့်မည်!**

**Transaction** ဆိုသည်မှာ အဆိုပါ အဆင့် ၂ ခုစလုံး **"အောင်မြင်လျှင် အကုန်လုံး အတူအောင်မြင်ရမည်၊ တစ်ခုခု အမှားဖြစ်ပါက မူလအခြေအနေသို့ ၁၀၀% အကုန်ပြန်ရောက်ရမည်"** ဟု အာမခံပေးသည့် စနစ် ဖြစ်ပါသည်။

---

## ၂။ ACID ဂုဏ်သတ္တိ ၄ ရပ်

```
┌────────────────────────────────────────────────────────┐
│                   ACID PROPERTIES                      │
├───────────────┬────────────────────────────────────────┤
│ A - Atomicity │ All or Nothing (အားလုံးဖြစ် သို့မဟုတ် ဘာမှမဖြစ်) │
├───────────────┼────────────────────────────────────────┤
│ C - Consistency│ Database စည်းကမ်းချက်များကို အမြဲ လိုက်နာသည်   │
├───────────────┼────────────────────────────────────────┤
│ I - Isolation │ Transaction အချင်းချင်း မမြင်ရဘဲ သီးခြားဖြစ်သည်│
├───────────────┼────────────────────────────────────────┤
│ D - Durability│ Commit ပြီးပါက Disk ပေါ် အမြဲတည်မြဲသည် (Redo Log)│
└───────────────┴────────────────────────────────────────┘
```

---

## ၃။ TCL Commands

```sql
-- ၁။ Transaction စတင်ခြင်း
START TRANSACTION;

-- အဆင့် (က): မောင်မောင့်ထံမှ ငွေနုတ်ခြင်း
UPDATE accounts SET balance = balance - 50000 WHERE id = 1;

-- အဆင့် (ခ): လှလှထံသို့ ငွေထည့်ခြင်း
UPDATE accounts SET balance = balance + 50000 WHERE id = 2;

-- အားလုံး အဆင်ပြေပါက Disk ပေါ်သို့ အတည်ပြု ရေးသားခြင်း
COMMIT;

-- အကယ်၍ တစ်ခုခု အမှားကြုံပါက မူလအတိုင်း အကုန်ပြန်ဖျက်သိမ်းခြင်း
-- ROLLBACK;
```

---

## ၄။ Concurrency ပြဿနာ ၃ မျိုး

လူသန်းပေါင်းများစွာ တစ်ပြိုင်နက် သုံးစွဲသည့်အခါ:
1. **Dirty Read**: အခြားသူတစ်ဦး မပြီးဆုံးသေးသော (Commit မလုပ်ရသေးသော) ယာယီဒေတာကို မှားယွင်းစွာ ကြိုတင်ဖတ်မိခြင်း။
2. **Non-Repeatable Read**: မိမိက ဒေတာတစ်ခုကို ၂ ကြိမ် ဖတ်ရာတွင် ကြားထဲ၌ အခြားသူက Update လုပ်လိုက်သဖြင့် တန်ဖိုး ၂ မျိုး ဖြစ်သွားခြင်း။
3. **Phantom Read**: မိမိက Query လုပ်နေစဉ် အခြားသူက Row အသစ် လာထည့်လိုက်သဖြင့် နောက်တစ်ကြိမ်တွင် မူလက မရှိသော "တစ္ဆေဒေတာ (Phantom row)" အသစ် ပေါ်လာခြင်း။

---

## ၅။ Transaction Isolation Levels ၄ မျိုး

MySQL InnoDB တွင် အောက်ပါ အဆင့် ၄ ဆင့် သတ်မှတ်နိုင်ပါသည်:

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
| :--- | :---: | :---: | :---: | :--- |
| **`READ UNCOMMITTED`** | ဖြစ်နိုင်သည် ❌ | ဖြစ်နိုင်သည် ❌ | ဖြစ်နိုင်သည် ❌ | အမြန်ဆုံး (မလုံခြုံပါ) |
| **`READ COMMITTED`** | ကာကွယ်သည် ✅ | ဖြစ်နိုင်သည် ❌ | ဖြစ်နိုင်သည် ❌ | မြန်ဆန်သည် |
| **`REPEATABLE READ`** *(MySQL Default)*| **ကာကွယ်သည် ✅** | **ကာကွယ်သည် ✅** | **ကာကွယ်သည် ✅** (MVCC) | **အကောင်းဆုံး မျှတမှု** |
| **`SERIALIZABLE`** | ကာကွယ်သည် ✅ | ကာကွယ်သည် ✅ | ကာကွယ်သည် ✅ | အလွန်နှေးသည် (Strict Lock) |

---

## ၆။ Row-Level Locking နှင့် Race Condition ကာကွယ်ခြင်း (`FOR UPDATE`)

ပစ္စည်းလက်ကျန် **၁ ခုတည်းသာ** ကျန်ရှိတော့သည့်အခါ Customer ၂ ဦးက တစ်ပြိုင်နက် Checkout နှိပ်ပါက ပစ္စည်းတစ်ခုတည်းကို ၂ ယောက်စလုံး ဝယ်ယူသွားနိုင်သည် (Race Condition Over-selling)။

**ကာကွယ်နည်း**: ဒေတာဖတ်သည့်အချိန်တွင် အခြားသူများ ဝင်မလုနိုင်စေရန် ထို Row ကို **Lock ခတ်ထားခြင်း (`FOR UPDATE`)**:

```sql
START TRANSACTION;

-- ထို Product Row ကို Lock ခတ်ပြီးမှ ဖတ်ရှုသည် (အခြားသူ စောင့်နေရမည်)
SELECT stock_quantity FROM products WHERE id = 10 FOR UPDATE;

-- လက်ကျန်ရှိပါက အော်ဒါတင်ပြီး stock လျှော့သည်
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 10;

COMMIT; -- Lock ပြန်လည် ပြေလျော့သွားသည်
```

---

## ၇။ Deadlock ဆိုတာဘာလဲ?

Transaction A သည် Row 1 ကို Lock ခတ်ထားပြီး Row 2 ကို တောင်းနေသည်။  
တစ်ချိန်တည်းတွင် Transaction B သည် Row 2 ကို Lock ခတ်ထားပြီး Row 1 ကို ပြန်တောင်းနေသည်။  
နှစ်ဦးစလုံး တစ်ယောက်ကိုတစ်ယောက် လည်ပင်းညှစ်ပြီး ဘယ်သူမှ မလျှော့ဘဲ ရပ်တန့်နေခြင်းကို **Deadlock (လမ်းပိတ်ဆို့မှု)** ဟု ခေါ်သည်။

```
[ Transaction A ] ──► Holds Lock on Row 1 ──► Waiting for Row 2 ──┐
       ▲                                                           │
       │                                                           ▼
       └────────────── Waiting for Row 1 ◄── Holds Lock on Row 2 ──[ Transaction B ]
```

### MySQL ၏ ဖြေရှင်းပုံ:
MySQL InnoDB သည် Deadlock ကို အလိုအလျောက် ခြေရာခံမိပြီး Transaction အသေးဆုံးတစ်ခုကို **ချက်ချင်း Rollback ချပစ်သည်** (Error: `Deadlock found when trying to get lock; try restarting transaction`)။

### Developer များ လိုက်နာရမည့် Best Practice:
1. ဇယားများကို Lock ခတ်သည့်အခါ မတူညီသော နေရာများမှ ID အစဉ်လိုက် **တူညီသော Order အတိုင်း အမြဲ lock ခတ်ပါ** (ဥပမာ- ID ငယ်ရာမှ ကြီးရာသို့ အမြဲ ခတ်ပါ)။
2. Application Code တွင် Deadlock တက်လာပါက အလိုအလျောက် Retry (ပြန်လည် ကြိုးစားသည့် Logic) ရေးသားထားပါ။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အသုံးပြုပုံ |
| :--- | :--- |
| **ငွေလွှဲခြင်း၊ Stock နုတ်ယူခြင်း၊ အော်ဒါတင်ခြင်း** | `START TRANSACTION` ... `COMMIT` မဖြစ်မနေ သုံးပါ |
| **Over-selling မဖြစ်စေရန်** | `SELECT ... FOR UPDATE` ဖြင့် Row-level exclusive lock ခတ်ပါ |
| **MySQL Default Isolation** | `REPEATABLE READ` ဖြစ်ကြောင်း သဘောပေါက်ပါ |
| **Deadlock Prevention** | Transaction များကို တိုတိုတုတ်တုတ်နှင့် အမြန်ဆုံး ပြီးအောင် စီမံပါ |

နောက်သင်ခန်းစာ [13_indexing_deep_dive_and_query_optimization.md](/mysql/13_indexing_deep_dive_and_query_optimization/) တွင် သန်းပေါင်းများစွာသော Data များကို ၁ စက္ကန့်အတွင်း ရှာဖွေနိုင်သည့် B-Tree Indexing နှင့် `EXPLAIN ANALYZE` Query Optimization အကြောင်းကို လေ့လာပါမည်။
