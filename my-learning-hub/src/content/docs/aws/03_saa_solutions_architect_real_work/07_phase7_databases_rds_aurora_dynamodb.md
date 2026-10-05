---
title: "Phase 7 — Databases (RDS, Aurora & DynamoDB) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: Database ဒီဇိုင်းသည် Application တစ်ခုလုံး၏ ယုံကြည်စိတ်ချရမှု (Reliability) နှင့် စွမ်းဆောင်ရည် (Performance) ကို အဓိက ဆုံးဖြတ်သည်။ RDS M"
---

## Phase 7 — Databases (RDS, Aurora & DynamoDB) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** Database ဒီဇိုင်းသည် Application တစ်ခုလုံး၏ ယုံကြည်စိတ်ချရမှု (Reliability) နှင့် စွမ်းဆောင်ရည် (Performance) ကို အဓိက ဆုံးဖြတ်သည်။ RDS Multi-AZ, Read Scaling, Aurora Serverless v2 Capacity Units (ACUs), DynamoDB Hot Partition ရှောင်လွှဲနည်း၊ GSI ဒီဇိုင်းနှင့် TTL Auto-Purging တို့ကို အဆင့်ဆင့် တည်ဆောက်နိုင်ရမည်။

---

## ၇.၁ Amazon RDS Production Setup (အဆင့်ဆင့် တည်ဆောက်ပုံ)

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION RDS MULTI-AZ ARCHITECTURE                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|     [Private App Subnet AZ-1a]                     [Private App Subnet AZ-1c]     |
|     +-----------------------+                      +-----------------------+      |
|     | Backend EC2 App 1     |                      | Backend EC2 App 2     |      |
|     +-----------------------+                      +-----------------------+      |
|                 \                                              /                  |
|                  \--- Security Group: Port 3306 from App-SG --/                   |
|                                       v                                           |
|                           [RDS DB Subnet Group]                                   |
|                                       |                                           |
|       +-------------------------------+-------------------------------+           |
|       |                                                               |           |
|       v                                                               v           |
|  [Private DB Subnet AZ-1a]                                   [Private DB AZ-1c]   |
|  +---------------------------+       Synchronous             +------------------+ |
|  | RDS Primary Master (Write)| ============================> | RDS Standby Node | |
|  | Endpoint: `db.prod.rds...`|       (Zero Data Loss)        | (Invisible to App| |
|  +---------------------------+                               +------------------+ |
|               |                                                                   |
|               | Asynchronous Replication                                          |
|               v                                                                   |
|  [Private DB Subnet AZ-1b]                                                        |
|  +---------------------------+                                                    |
|  | RDS Read Replica (Read)   | <--- Handles Reporting / Heavy SELECT Queries      |
|  +---------------------------+                                                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: DB Subnet Group တည်ဆောက်ခြင်း
- Private Subnet **အနည်းဆုံး AZ (၂) ခု (AZ-1a နှင့် AZ-1c)** ပါဝင်ရမည်။
- အဆိုပါ Subnet များတွင် Internet Gateway သို့ Route မရှိစေရ (Completely Isolated)။

### အဆင့် ၂: Security Group Hardening (`sg-rds-db`)
- **Inbound Rule:** Port `3306` (MySQL) သို့မဟုတ် `5432` (PostgreSQL)
- **Source:** Backend Application Security Group ID (`sg-app-backend`) သာ ထည့်သွင်းရမည် (IP Address မထည့်ရပါ)။

### အဆင့် ၃: Parameter Group & Logging
1. **SSL/TLS ချိတ်ဆက်မှု မဖြစ်မနေ စစ်ဆေးခြင်း:** `rds.force_ssl = 1`
2. **Slow Query Log ထုတ်ယူခြင်း:** `slow_query_log = 1`, `long_query_time = 2` (၂ စက္ကန့်ထက် ကြာသော Query များကို CloudWatch Logs သို့ အလိုအလျောက် ပို့ရန် ဖွင့်ထားခြင်း)။

### အဆင့် ၄: Monitoring & Backups
- **Multi-AZ Deployment:** Enable (Standby Node ကို အခြား AZ တွင် Synchronous ထားရှိသည်)။
- **Automated Backup Retention:** ၇ ရက်မှ ၃၅ ရက် သတ်မှတ်ထားခြင်း (Point-in-Time Recovery ရရှိသည်)။
- **Enhanced Monitoring:** 1-second granularity သတ်မှတ်ပြီး CPU, Disk I/O process များကို အသေးစိတ် စောင့်ကြည့်သည်။
- **Performance Insights:** Database Load ကို Average Active Sessions (AAS) ဖြင့် စစ်ဆေးပြီး မည်သည့် SQL query က DB ကို ဝန်ပိစေသည်ကို ရှာဖွေသည်။

---

## ၇.၂ Amazon Aurora Enterprise Setup & Serverless v2

Aurora သည် Cloud အတွက် သီးသန့် အသစ်ပြန်လည် တည်ဆောက်ထားသောကြောင့် Compute နှင့် Storage သီးခြားစီ ခွဲထားသည်။

```
+-----------------------------------------------------------------------------------+
|                            AMAZON AURORA ENDPOINTS ARCHITECTURE                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. Cluster Endpoint (Writer Endpoint):                                           |
|     - `mydb.cluster-xyz.ap-northeast-1.rds.amazonaws.com`                         |
|     - Primary DB ထံသို့သာ အမြဲ ညွှန်ပြပြီး INSERT, UPDATE, DELETE အားလုံးကို လက်ခံသည် |
|                                                                                   |
|  2. Reader Endpoint (Load-Balanced Reads):                                        |
|     - `mydb.cluster-ro-xyz.ap-northeast-1.rds.amazonaws.com`                      |
|     - Read Replicas များအားလုံးဆီသို့ Round-robin ဖြင့် SELECT queries များ မျှဝေပေးသည်|
|                                                                                   |
|  3. Custom Endpoint (သီးသန့် ရည်ရွယ်ချက် Endpoints):                              |
|     - ဥပမာ ကြီးမားသော Analytics Reporting queries များအတွက် သီးခြား Reader       |
|       node အကြီးကြီးတစ်ခုကိုသာ ညွှန်ပြထားသော Endpoint ဖြစ်သည်                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Aurora Serverless v2 (စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် စရိတ်ချွေတာနည်း)
Traffic နည်းပါးချိန်တွင် ငွေကုန်သက်သာစေရန် Aurora Serverless v2 ကို အောက်ပါအတိုင်း သတ်မှတ်သည်:
- **Minimum Capacity:** `0.5 ACU` (Aurora Capacity Unit: 1 ACU = 2 GB RAM)
- **Maximum Capacity:** `16 ACU` (32 GB RAM)
- **အလုပ်လုပ်ပုံ:** ပုံမှန်အချိန်တွင် 0.5 ACU ($0.06/hour) ဖြင့် အလွန်သက်သာစွာ Run နေပြီး Traffic ရုတ်တရက် တက်လာပါက စက္ကန့်ပိုင်းအတွင်း (Without dropping connections) 16 ACU အထိ ချဲ့ထွင်ပေးသည်။

### Aurora Global Database (Cross-Region Disaster Recovery)
- Primary Region (Tokyo) နှင့် Secondary Region (Osaka) အကြား Storage Level မှ တိုက်ရိုက် Data ကူးယူသည်။
- Cross-region replication latency သည် **< 1 second (Single-digit second)** သာ ရှိသည်။
- Tokyo တစ်ခုလုံး ပျက်ကျပါက Osaka Region ရှိ Database ကို Master အဖြစ် **RTO < 1 minute** ဖြင့် အလိုအလျောက် တင်ပေးနိုင်သည် (Zero Data Loss)။

---

## ၇.၃ Amazon DynamoDB Production Setup (အဆင့်ဆင့်)

```
+-----------------------------------------------------------------------------------+
|                        DYNAMODB ENTERPRISE ARCHITECTURE                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   Table Name: `ECommerceOrders`                                                   |
|   - Partition Key (PK) : `TenantID#CustomerID` (High-cardinality avoids hot keys!)|
|   - Sort Key (SK)      : `OrderDate#OrderID`   (Enables range queries)            |
|                                                                                   |
|   Global Secondary Index (GSI):                                                   |
|   - GSI PK : `OrderStatus` (e.g. "PENDING")                                       |
|   - GSI SK : `OrderDate`                                                          |
|   - Purpose: Pending ဖြစ်နေသော အော်ဒါများကို ရက်စွဲအလိုက် ရှာဖွေနိုင်ရန်             |
|                                                                                   |
|   Automations:                                                                    |
|   - TTL (Time to Live) : `ExpirationTime` (Epoch time - Auto purges carts)        |
|   - DynamoDB Streams   : Enabled (NEW_AND_OLD_IMAGES -> Triggers AWS Lambda)      |
|   - PITR Backup        : Enabled (Point-in-Time continuous 35 days protection)    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Hot Partition ပြဿနာနှင့် ဖြေရှင်းနည်း (Crucial Concept)
Partition Key တစ်ခုတည်းသို့သာ Traffic အားလုံး စုပြုံရောက်ရှိပါက **Hot Partition** ဖြစ်ပြီး Request များ Throttling (Error 400) ခံရမည်:
- **အမှား (Anti-pattern):** PK အဖြစ် `Country` (ဥပမာ `MM`) သို့မဟုတ် `OrderDate` (ဥပမာ `2026-09-21`) သုံးခြင်း (လူအားလုံး ထို Partition သို့ သွားဆွဲသဖြင့် ပျက်ကျမည်)။
- **အမှန် (Best Practice):** PK အဖြစ် Unique ဖြစ်သော `UUID`, `CustomerID` သို့မဟုတ် Partition Sharding (Suffix ထည့်ခြင်း `OrderID_0`, `OrderID_1`) ကို အသုံးပြုရမည်။

### DynamoDB TTL (အလိုအလျောက် သက်တမ်းကုန် ဖျက်ဆီးခြင်း - Zero Cost!)
Shopping Cart Sessions သို့မဟုတ် Verification OTP Codes များကို ဖျက်ပစ်ရန်အတွက် Script ရေးပြီး Cron job ပတ်စရာ မလိုပါ:
1. Item ထဲတွင် `TimeToLive` attribute (Unix Epoch Timestamp) ထည့်သွင်းထားသည်။
2. DynamoDB က အဆိုပါ အချိန်ရောက်ပါက **Background မှ အလိုအလျောက် ဖျက်ပစ်ပေးသည် (Database Capacity RCU/WCU မကုန်ပါ - လုံးဝ အခမဲ့!)**။

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [08_Phase8_Performance_Architecture_Caching_CloudFront.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/08_Phase8_Performance_Architecture_Caching_CloudFront.md)
