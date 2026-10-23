---
title: "AWS DMS — Database Migration Service"
description: "AWS Database Migration Service (DMS) ၏ Architecture၊ Continuous Replication (CDC)၊ Homogeneous vs Heterogeneous Migrations၊ SCT (Schema Conversion Tool) နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# AWS DMS (Database Migration Service)
### Seamless Database and Analytics Migration with Minimal Downtime

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**AWS Database Migration Service (AWS DMS)** သည် On-Premises data centers များ၊ virtual machines များ သို့မဟုတ် cloud ပေါ်ရှိ databases များကို AWS သို့ **Minimal Downtime (နီးပါး သုည ရပ်တန့်ချိန်)** ဖြင့် လုံခြုံချောမွေ့စွာ ပြောင်းရွှေ့ပေးသော fully managed migration service ဖြစ်ပါသည်။

```
[Source DB: On-Prem Oracle/MySQL] ---> [AWS DMS Replication Instance] ---> [Target DB: Amazon Aurora/RDS/S3]
                                              |
                                     (CDC: Ongoing Changes)
```

### ဘာကြောင့် DMS ကို မဖြစ်မနေ သုံးရသလဲ?
1. **Zero / Minimal Application Downtime:** Migration ပြုလုပ်နေစဉ်အတွင်း Source database ကို offline ချစရာမလိုဘဲ users များ ဆက်လက် အသုံးပြုနေနိုင်ပြီး **Continuous Data Replication (CDC - Change Data Capture)** ဖြင့် နောက်ဆုံးပြောင်းလဲမှုများကို target သို့ အချိန်နှင့်တစ်ပြေးညီ synchronize လုပ်ပေးသည်။
2. **Homogeneous & Heterogeneous Support:** တူညီသော database အချင်းချင်း (ဥပမာ- Oracle to Oracle, PostgreSQL to PostgreSQL) သာမက ကွဲပြားသော engine များ (ဥပမာ- Microsoft SQL Server မှ Amazon Aurora PostgreSQL သို့) ပြောင်းရွှေ့နိုင်သည်။
3. **High Reliability & Self-Healing:** Network ပြတ်တောက်ခြင်း သို့မဟုတ် replication error ဖြစ်ပေါ်ပါက auto-restart ပြုလုပ်ပြီး ရပ်တန့်ခဲ့သည့်နေရာမှ အလိုအလျောက် ပြန်လည်ဆက်လက်ဆောင်ရွက်သည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **Replication Instance:** DMS task များကို run ရန်အတွက် CPU, Memory ပါဝင်သော EC2-managed compute server (General Purpose dms.t3 သို့မဟုတ် Memory Optimized dms.r5)။
2. **Source Endpoint:** Data ဆွဲထုတ်မည့် Database ချိတ်ဆက်မှု configuration (On-premises DB, EC2 DB, RDS, S3, MongoDB)။
3. **Target Endpoint:** Data ပြောင်းရွှေ့သိမ်းဆည်းမည့် Database ချိတ်ဆက်မှု configuration (Amazon RDS, Amazon Aurora, DynamoDB, Redshift, S3, OpenSearch)။
4. **Replication Task:** Source မှ Target သို့ data ရွှေ့ပြောင်းမည့် စည်းမျဉ်းနှင့် နည်းလမ်း:
   - **Full Load:** လက်ရှိရှိပြီးသား data အားလုံးကို တစ်ကြိမ်တည်း ကူးယူခြင်း။
   - **Full Load + Ongoing Replication (CDC):** Data အားလုံး ကူးယူပြီးနောက် ဆက်လက်ဖြစ်ပေါ်လာသော transaction logs (redo/binlog) များကို အချိန်နှင့်တစ်ပြေးညီ sync လုပ်ခြင်း။
   - **CDC Only:** ရှိပြီးသား data ကို အခြားနည်းဖြင့် ရွှေ့ပြီးနောက် incremental changes များကိုသာ sync လုပ်ခြင်း။
5. **AWS Schema Conversion Tool (AWS SCT):** Heterogeneous migration (ဥပမာ- Oracle မှ Aurora PostgreSQL) ပြုလုပ်ရာတွင် Source schema, stored procedures, triggers, views များကို target engine နှင့် ကိုက်ညီသော code အဖြစ် convert ပြုလုပ်ပေးသည့် application tool။
6. **DMS Serverless:** Compute instance capacity ကို manual ရွေးစရာမလိုဘဲ workload အလိုက် DMS Capacity Units (DCUs) ကို အလိုအလျောက် auto-scale ပေးသော serverless model။

---

## 3. Architecture & Request Flow

```
+-----------------------------------------------------------------------------------------+
|                                  AWS DMS Architecture                                   |
|                                                                                         |
|   +-----------------------+              +-----------------------+                      |
|   |   On-Premises Source  |              | AWS DMS Replication   |                      |
|   |   Oracle Database     | -----------> | Instance (VPC)        |                      |
|   +-----------------------+   Direct     +-----------+-----------+                      |
|             ^                Connect/VPN             |                                  |
|             |                                        | Target Write (Aurora)            |
|             | Schema Conversion                      v                                  |
|       +-----+---------------+              +-----------------------+                    |
|       | AWS SCT (Schema)    |              | Amazon Aurora Postgre |                    |
|       +---------------------+              | Target Database       |                    |
|                                            +-----------------------+                    |
+-----------------------------------------------------------------------------------------+
```

### Migration Workflow အဆင့်ဆင့်:
1. **Schema Conversion (Heterogeneous ဖြစ်ပါက):** ပထမဦးစွာ **AWS SCT** ကို run ၍ Oracle schema/tables/functions များကို PostgreSQL format သို့ convert လုပ်ကာ Aurora ထဲ ကြိုတင် create လုပ်ထားသည်။
2. **DMS Task Run (Full Load):** DMS Replication Instance က Source DB မှ data အားလုံးကို extract လုပ်ပြီး Target DB သို့ bulk write လုပ်သည်။
3. **CDC Sync:** Full Load ပြီးသည်နှင့် Source DB ၏ Transaction Log (Binlog/WAL) ကို နားထောင်၍ အသစ်တက်လာသော transactions များကို Target သို့ စက္ကန့်ပိုင်းအတွင်း ဆက်တိုက် replicate လုပ်နေသည်။
4. **Cutover (လွှဲပြောင်းခြင်း):** Target DB သည် Source DB နှင့် 100% sync ဖြစ်သွားချိန်တွင် Application DB Connection string ကို Aurora သို့ ပြောင်းလဲချိတ်ဆက်ကာ migration ပြီးဆုံးသည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### Homogeneous vs Heterogeneous Migrations

| အင်္ဂါရပ် | Homogeneous Migration | Heterogeneous Migration |
| :--- | :--- | :--- |
| **Database Engines** | Source နှင့် Target engine တူညီသည် (e.g. MySQL -> Amazon RDS MySQL) | Source နှင့် Target engine မတူညီပါ (e.g. Oracle -> Amazon Aurora) |
| **AWS SCT လိုအပ်မှု** | မလိုအပ်ပါ (Native backup/dump သုံးနိုင်သည်) | **မဖြစ်မနေ လိုအပ်သည်** (SCT ဖြင့် Schema, Stored Procedures convert ရမည်) |
| **DMS ၏ အခန်းကဏ္ဍ** | Data replication နှင့် CDC သီးသန့် ဆောင်ရွက်သည် | Schema convert ပြီးနောက် Data replication နှင့် CDC ဆောင်ရွက်သည် |

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **On-Premises to Cloud Database Migration:** Legacy data center ရှိ Oracle / SQL Server databases များကို Amazon Aurora / RDS သို့ စီးပွားရေးလုပ်ငန်း မရပ်တန့်စေဘဲ ရွှေ့ပြောင်းခြင်း။
2. **Continuous Data Streaming to Data Lake (S3):** Production database ၏ ongoing updates များကို Amazon S3 သို့ Parquet format ဖြင့် replicate လုပ်ကာ Athena/Glue ဖြင့် analytics ပြုလုပ်ခြင်း။
3. **Database Consolidation & Replication:** မတူညီသော branch office databases ပေါင်းများစွာမှ data များကို ဗဟို Amazon Redshift data warehouse သို့ စုစည်းခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Minimal Downtime:** Cutover လုပ်ချိန် (Application connection လွှဲချိန်) မိနစ်အနည်းငယ်သာ downtime လိုအပ်သည်။
- **Multi-Engine Compatibility:** Relational (SQL), NoSQL (DynamoDB/MongoDB) နှင့် Object Storage (S3) အထိ support ပေးသည်။
- **High Availability (Multi-AZ):** Production migration များအတွက် Multi-AZ replication instance ထားရှိနိုင်သည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- DMS သည် Secondary Indexes, Triggers နှင့် Stored Procedures များကို အလိုအလျောက် သယ်ဆောင်ပေးခြင်း မရှိပါ (AWS SCT သို့မဟုတ် manual schema script လိုအပ်သည်)။
- LOB (Large Object) data ကော်လံများ ပါဝင်ပါက throughput နှေးကွေးနိုင်သဖြင့် Limited LOB mode သို့မဟုတ် Full LOB mode ကို သေချာ tuning လုပ်ရသည်။

---

## 7. Comparison: AWS DMS vs AWS DataSync vs Snow Family

| အင်္ဂါရပ် | AWS DMS | AWS DataSync | AWS Snow Family |
| :--- | :--- | :--- | :--- |
| **Primary Workload** | **Databases & Analytics** (MySQL, Oracle, Mongo) | **Files & Object Storage** (NFS, SMB, S3, EFS) | **Petabyte-Scale Offline Data Transfer** |
| **Real-Time CDC** | Yes (Change Data Capture) | No (Scheduled periodic sync) | No (Physical hardware shipping) |
| **Transfer Method** | Network Online (VPN/Direct Connect) | Network Online (10 Gbps accelerated) | Physical Device (Snowball, Snowcone) |

---

## 8. Hands-on Lab: AWS DMS Migration Setup

### Step 1: Replication Subnet Group ဖန်တီးခြင်း
```bash
aws dms create-replication-subnet-group \
    --replication-subnet-group-identifier dms-subnet-group \
    --replication-subnet-group-description "DMS Multi-AZ Subnets" \
    --subnet-ids subnet-01234567 subnet-89abcdef
```

### Step 2: Replication Instance ဖန်တီးခြင်း
```bash
aws dms create-replication-instance \
    --replication-instance-identifier prod-dms-instance \
    --replication-instance-class dms.t3.medium \
    --allocated-storage 50 \
    --replication-subnet-group-identifier dms-subnet-group \
    --no-multi-az
```

### Step 3: Source Endpoint ဖန်တီးခြင်း (MySQL Source)
```bash
aws dms create-endpoint \
    --endpoint-identifier onprem-mysql-source \
    --endpoint-type source \
    --engine-name mysql \
    --username dms_user \
    --password "SecretPassword123" \
    --server-name 192.168.1.100 \
    --port 3306
```

### Step 4: Replication Task စတင်ခြင်း (Full load + CDC)
```bash
aws dms create-replication-task \
    --replication-task-identifier mysql-to-aurora-task \
    --source-endpoint-arn <Source-ARN> \
    --target-endpoint-arn <Target-ARN> \
    --replication-instance-arn <Instance-ARN> \
    --migration-type full-load-and-cdc \
    --table-mappings '{"rules":[{"rule-type":"selection","rule-id":"1","rule-name":"1","object-locator":{"schema-name":"%","table-name":"%"},"rule-action":"include"}]}'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:**
  - SSL/TLS encryption in transit ဖြင့် source မှ target သို့ လုံခြုံစွာ သယ်ဆောင်သည်။
  - Storage volume များကို AWS KMS (SSE-KMS) ဖြင့် at-rest encrypt လုပ်ထားသည်။
- **Monitoring (CloudWatch):**
  - `CDCLatencySource`: Source database မှ replication instance သို့ change ရောက်ရှိရန် ကြာချိန်။
  - `CDCLatencyTarget`: Replication instance မှ target database သို့ apply လုပ်ရန် ကြာချိန် (Latency မြင့်ပါက memory/CPU တိုးရမည်)။
- **Troubleshooting:**
  - **Primary Key မပါဝင်သော Tables:** DMS သည် CDC ပြုလုပ်ရာတွင် target table ပေါ်၌ Primary Key သို့မဟုတ် Unique Index မရှိပါက performance အဆမတန် ကျဆင်းစေသည်။
- **Cost Structure:**
  - Replication instance running hours (On-Demand / Reserved) ပေါ် မူတည်၍ ပေးချေရသည်။
  - Target အဖြစ် Amazon Aurora, RDS, DynamoDB, Redshift သို့ ရွှေ့ပြောင်းပါက DMS Free Tier (t2/t3.micro) အခွင့်အရေး ရရှိနိုင်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Heterogeneous Database Migration:** "Migrate Oracle/SQL Server to Aurora MySQL/PostgreSQL with minimum downtime" ဆိုပါက အမြဲတမ်း **AWS SCT (for Schema) + AWS DMS (for Data & CDC)** တွဲသုံးရသည်။
- **Zero Downtime Migration:** "Continuous replication while keeping original database online" ဆိုပါက **DMS with CDC (Change Data Capture)** ဖြစ်သည်။
- **SCT vs DMS:** SCT သည် Schema, Stored Procedures, Views များကို convert လုပ်ပြီး၊ DMS သည် Data အစစ်အမှန်များကို replicate လုပ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုသည် On-premises တွင် run နေသော 2TB Microsoft SQL Server database ကို Amazon Aurora PostgreSQL သို့ ပြောင်းရွှေ့လိုသည်။ လုပ်ငန်းစဉ်အတွင်း database downtime ကို အနည်းဆုံးဖြစ်စေရမည်။ မည်သည့် ဖြေရှင်းနည်းသည် အသင့်တော်ဆုံးဖြစ်သနည်း?
>
> **အဖြေမှန်:** **AWS Schema Conversion Tool (AWS SCT)** ကို အသုံးပြု၍ SQL Server schema နှင့် stored procedures များကို PostgreSQL format သို့ convert လုပ်ကာ Aurora သို့ load လုပ်ပါ။ ထို့နောက် **AWS Database Migration Service (AWS DMS)** ကို အသုံးပြု၍ Full Load + Continuous CDC (Change Data Capture) replication task run ကာ data များကို sync လုပ်ပါ။ နောက်ဆုံးတွင် Application connection ကို Aurora သို့ cutover လုပ်ပါ။

### ❓ SAA-C03 Mini Quiz:

**Q1: AWS DMS သည် မတူညီသော database engines များအကြား (Heterogeneous) migration ပြုလုပ်ရာတွင် stored procedures များနှင့် schema များကို အလိုအလျောက် convert မလုပ်နိုင်ပါ။ မည်သည့် tool ကို တွဲဖက် အသုံးပြုရမည်နည်း?**
- A) AWS DataSync
- B) AWS Schema Conversion Tool (AWS SCT)
- C) AWS Application Discovery Service
- D) Amazon Athena
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS SCT (Schema Conversion Tool) သည် heterogeneous migration များအတွက် database schemas နှင့် code objects များကို ကြိုတင် convert လုပ်ပေးသည့် မရှိမဖြစ် tool ဖြစ်ပါသည်။</details>

**Q2: AWS DMS ဖြင့် migration ပြုလုပ်နေစဉ် source database ပေါ်သို့ အသစ်တက်လာသော transactions များကို target database ထံသို့ အချိန်နှင့်တစ်ပြေးညီ ဆက်လက် sync လုပ်ပေးသော နည်းပညာမှာ အဘယ်နည်း?**
- A) Change Data Capture (CDC)
- B) Cross-Region Snapshot Copy
- C) Multi-AZ Synchronous Mirroring
- D) S3 Multipart Upload
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: A</b> — Change Data Capture (CDC) သည် source transaction log (binlog/redo log) များကို ဖတ်ယူ၍ ongoing changes များကို ဆက်တိုက် synchronize လုပ်ပေးပါသည်။</details>

**Q3: CloudWatch metric ဖြစ်သော CDCLatencyTarget မြင့်တက်နေသည်ကို တွေ့ရပါသည်။ ဤအခြေအနေသည် မည်သည့်အရာကို ညွှန်ပြနေသနည်း?**
- A) Source database သည် down နေသည်
- B) Replication instance မှ Target database သို့ transaction changes များကို commit ပြုလုပ်ရာတွင် ကြန့်ကြာနေသည်
- C) S3 bucket တွင် encryption မရှိခြင်း
- D) AWS SCT license ကုန်ဆုံးသွားခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — CDCLatencyTarget သည် Replication instance မှ target database ထဲသို့ changes များ commit ရေးသားရာတွင် နှောင့်နှေးနေခြင်းကို ဖော်ပြပါသည်။</details>
