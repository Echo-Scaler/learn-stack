---
title: "17. Replication and High Availability"
description: "1. [Replication ဆိုတာဘာလဲ? ဘာကြောင့် Single Database Server မသုံးသင့်သလဲ?](#၁-replication-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၇) - MySQL Replication၊ High Availability နှင့် Clustering
### (Lesson 17: Master-Slave Replication, Read/Write Splitting, GTID & MySQL InnoDB Cluster)

---

## 📌 မာတိကာ (Contents)
1. [Replication ဆိုတာဘာလဲ? ဘာကြောင့် Single Database Server မသုံးသင့်သလဲ?](#၁-replication-ဆိုတာဘာလဲ)
2. [Source-Replica (Master-Slave) Architecture အလုပ်လုပ်ပုံ Diagram](#၂-source-replica-architecture)
3. [Read/Write Splitting (Web Application များတွင် ရေး/ဖတ် ခွဲထုတ်ပုံ)](#၃-readwrite-splitting)
4. [Replication စနစ် ၃ မျိုး (Asynchronous, Semi-Sync, Group Replication)](#၄-replication-စနစ်-၃-မျိုး)
5. [GTID (Global Transaction Identifier) စနစ်](#၅-gtid-စနစ်)
6. [လက်တွေ့ Source-Replica ချိတ်ဆက်ပုံ အဆင့်ဆင့် Configuration](#၆-လက်တွေ့-configuration)
7. [MySQL InnoDB Cluster မိတ်ဆက် (Enterprise High Availability)](#၇-mysql-innodb-cluster)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Replication ဆိုတာဘာလဲ?

ဆာဗာတစ်ခုတည်း (Single Database Server) ပေါ်တွင်သာ Database run ထားပါက:
1. **Single Point of Failure (SPOF)**: ထို Server Hardware သို့မဟုတ် Hard Disk ပျက်သွားသည်နှင့် ကုမ္ပဏီတစ်ခုလုံး အလုပ်ရပ်တန့်သွားမည်။
2. **Read Traffic များပြားလွန်းခြင်း**: သုံးစွဲသူ သန်းချီက Website ကို တစ်ပြိုင်နက် ကြည့်ရှုနေချိန်တွင် Server တစ်လုံးတည်းက မခံနိုင်တော့ဘဲ ပြုတ်ကျသွားမည်။

**Database Replication** ဆိုသည်မှာ Master Server (Source) ပေါ်တွင် ရှိသော Data များကို အခြား အရန်ဆာဗာများ (Replicas / Slaves) ဆီသို့ အချိန်နှင့်တပြေးညီ အလိုအလျောက် ကူးယူပြန့်ပွားစေသည့် စနစ် ဖြစ်ပါသည်။

---

## ၂။ Source-Replica Architecture အလုပ်လုပ်ပုံ Diagram

```
                             [ WEB APPLICATION (Laravel / Node) ]
                                      │                     │
                     (Write: INSERT, UPDATE)     (Read: SELECT Queries)
                                      ▼                     ▼
                       ┌─────────────────────────┐   ┌─────────────────────────┐
                       │   SOURCE (MASTER) DB    │   │     LOAD BALANCER       │
                       │   - Handles All Writes  │   └───────────┬─────────────┘
                       │   - Writes to Binlog    │               │
                       └────────────┬────────────┘     ┌─────────┴─────────┐
                                    │                  ▼                   ▼
                          Binlog    │           ┌─────────────┐     ┌─────────────┐
                          Stream    ├──────────►│  REPLICA 1  │     │  REPLICA 2  │
                                    │           │  (Read-Only)│     │  (Read-Only)│
                                    └──────────►└─────────────┘     └─────────────┘
```

1. **Source (Master)** ပေါ်တွင် Write ပြုလုပ်သမျှကို **Binary Log (Binlog)** ထဲသို့ ရေးသည်။
2. **Replica (Slave)** ပေါ်ရှိ **I/O Thread** က ထို Binlog ကို ကွန်ရက်မှတစ်ဆင့် ဆွဲယူပြီး Relay Log ထဲ သိမ်းသည်။
3. Replica ပေါ်ရှိ **SQL Thread** က Relay Log ထဲရှိ SQL များကို မူရင်းအတိုင်း ပြန်လည် execute လုပ်ပေးသည်။

---

## ③။ Read/Write Splitting

Web Application အများစုတွင် **ဖတ်ရှုမှု (Read) သည် ၉၀%** ရှိပြီး **ရေးသားမှု (Write) သည် ၁၀% သာ** ရှိသည်။

Laravel / Framework များတွင် Connection ၂ ခု ခွဲထားလိုက်ပါသည်:
* ဒေတာ အသစ်ထည့်ခြင်း၊ ပြင်ခြင်း၊ ဖျက်ခြင်းများကို **Source DB** ဆီသို့ ပို့သည်။
* ဒေတာ ရှာဖွေဖတ်ရှုသမျှ SELECT အားလုံးကို **Replica DB များ** ဆီသို့ Load Balancing ဖြင့် မျှဝေပို့သည်။

ဤနည်းဖြင့် ဆာဗာ ဝန်ထုပ်ဝန်ပိုးကို အဆမတန် လျှော့ချနိုင်ပါသည်။

---

## ၄။ Replication စနစ် ၃ မျိုး

1. **Asynchronous Replication (Default)**:
   * Source က Replica ထံသို့ သတင်းပို့ပြီး စောင့်မနေဘဲ ချက်ချင်း Commit လုပ်သည်။ အလွန်မြန်သော်လည်း ကွန်ရက်နှေးပါက ဒေတာ စက္ကန့်ပိုင်း နောက်ကျကျန်ရစ်နိုင်သည် (Replication Lag)။
2. **Semi-Synchronous Replication**:
   * အနည်းဆုံး Replica ၁ လုံးက ဒေတာလက်ခံရရှိပြီဟု အတည်ပြုချက် ပြန်ပေးမှသာ Source က Commit လုပ်သည်။ ဒေတာ လုံးဝ မဆုံးရှုံးနိုင်ပါ။
3. **Group Replication / InnoDB Cluster**:
   * Paxos Consensus Algorithm သုံးပြီး Multi-Master သို့မဟုတ် Auto-Failover စနစ် အပြည့်အဝ ရရှိသည်။

---

## ၅။ GTID (Global Transaction Identifier) စနစ်

ခေတ်ဟောင်း MySQL တွင် Master ပျက်သွားပါက မည်သည့် Log ဖိုင်၏ မည်သည့် Position နံပါတ် ရောက်နေပြီလဲဟု လက်ဖြင့် လိုက်မှတ်ရသဖြင့် အလွန်ရှုပ်ထွေးသည်။

**GTID (MySQL 8.0 စံနှုန်း)** တွင် Transaction တိုင်းအတွက် ကမ္ဘာလုံးဆိုင်ရာ သီးသန့် ID (UUID + Sequence Number) ပေးထားသဖြင့် မည်သည့် Server ပျက်စီးသွားစေကာမူ အခြား Server အား Master အသစ်အဖြစ် လဲလှယ်ရာတွင် စက္ကန့်ပိုင်းဖြင့် ချောမွေ့စွာ ချိတ်ဆက်နိုင်ပါသည်။

---

## ၆။ လက်တွေ့ Configuration အကျဉ်းချုပ်

### (က) Source (Master) Server ၏ `my.cnf`:
```ini
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog_format = ROW
gtid_mode = ON
enforce_gtid_consistency = ON
```

### (ခ) Replica Server ၏ `my.cnf`:
```ini
[mysqld]
server-id = 2
relay_log = mysql-relay-bin
read_only = ON # Replica ကို Read-only အဖြစ်သာ သတ်မှတ်သည်
gtid_mode = ON
enforce_gtid_consistency = ON
```

### (ဂ) Replica Server တွင် ချိတ်ဆက်ခြင်း:
```sql
CHANGE REPLICATION SOURCE TO
    SOURCE_HOST = '192.168.1.10',
    SOURCE_USER = 'repl_user',
    SOURCE_PASSWORD = 'password',
    SOURCE_AUTO_POSITION = 1;

START REPLICA;

-- အခြေအနေ စစ်ဆေးခြင်း
SHOW REPLICA STATUS\G
```
`Replica_IO_Running: Yes` နှင့် `Replica_SQL_Running: Yes` ဖြစ်နေပါက အောင်မြင်စွာ Replication အလုပ်လုပ်နေပြီ ဖြစ်ပါသည်။

---

## ၇။ MySQL InnoDB Cluster

Enterprise အဆင့်တွင် လက်ဖြင့် Failover မလုပ်ဘဲ:
* **MySQL Group Replication**
* **MySQL Router** (Traffic အလိုအလျောက် ခွဲပေးသော proxy)
* **MySQL Shell**
တို့ကို ပေါင်းစပ်ပြီး Master ပျက်သွားပါက Replica အား Master အဖြစ် **လူမသိဘဲ အလိုအလျောက် ရာထူးတိုးမြှင့်ပေးသည့် (Zero-Downtime Auto-Failover)** စနစ်ကို အသုံးပြုကြပါသည်။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက်အလက် | စစ်ဆေးရန် | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **High Availability** | Single DB မဟုတ်ဘဲ အနည်းဆုံး Source ၁ လုံးနှင့် Replica ၁ လုံး ထားရှိသလား? | [ ] |
| **GTID Enabled** | ခေတ်ဟောင်း Position အစား `gtid_mode = ON` သုံးထားသလား? | [ ] |
| **Replica Read Only** | Replica ပေါ်တွင် မှားယွင်းစွာ Write မမိစေရန် `read_only = ON` ပေးထားသလား? | [ ] |
| **Replication Lag** | `SHOW REPLICA STATUS` တွင် `Seconds_Behind_Source` ကို စောင့်ကြည့်သလား? | [ ] |

နောက်ဆုံးသင်ခန်းစာ [18_security_user_privileges_and_hardening.md](/mysql/18_security_user_privileges_and_hardening/) တွင် Hacker များ မဖောက်ထွင်းနိုင်စေရန် MySQL Users, Privileges, SQL Injection ကာကွယ်ခြင်းနှင့် Server Hardening နည်းလမ်းများကို လေ့လာပါမည်။
