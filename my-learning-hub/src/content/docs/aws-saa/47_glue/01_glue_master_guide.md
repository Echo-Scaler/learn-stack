---
title: "AWS Glue — Serverless Data Integration & ETL"
description: "AWS Glue ၏ Architecture၊ Glue Data Catalog၊ Crawlers၊ Spark Serverless ETL Jobs၊ Glue DataBrew၊ Triggers နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# AWS Glue
### Fully Managed Serverless Data Integration and ETL (Extract, Transform, Load) Service

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**AWS Glue** သည် Data Analytics, Machine Learning နှင့် Application များအတွက် ဒေတာများကို ရှာဖွေဖော်ထုတ်ခြင်း (Discover)၊ ပြင်ဆင်ခြင်း (Prepare)၊ ပေါင်းစပ်သန့်စင်ခြင်း (Transform) နှင့် လိုအပ်ရာသို့ ထည့်သွင်းခြင်း (Load) တို့ကို ဆောင်ရွက်ပေးသော fully managed, serverless **ETL (Extract, Transform, Load)** service ဖြစ်ပါသည်။

```
[Raw Sources: S3, RDS, DynamoDB] ---> [AWS Glue Crawler] ---> [Glue Data Catalog]
                                               |
                                     [Glue Spark ETL Job] (CSV -> Parquet, Filter)
                                               |
                                               v
              [Clean Data Targets: Amazon S3 Data Lake / Amazon Redshift]
```

### ဘာကြောင့် AWS Glue ကို သုံးရသလဲ?
1. **Serverless Big Data Processing:** Apache Spark cluster များကို လူကိုယ်တိုင် setup လုပ်စရာမလိုဘဲ Glue က background တွင် compute capacity (DPUs - Data Processing Units) ကို အလိုအလျောက် provision လုပ်ပြီး scale ပေးသည်။
2. **Automated Schema Discovery (Crawlers):** S3 သို့မဟုတ် Database ထဲရှိ file အသစ်များကို crawler ဖြင့် scan ဖတ်ကာ schema, data types, partitions များကို အလိုအလျောက် သတ်မှတ်ပေးသည်။
3. **Central Metadata Catalog (Data Lake Foundation):** Athena, Redshift Spectrum, EMR, SageMaker စသည့် analytics services အားလုံး မျှဝေအသုံးပြုနိုင်သော ဗဟို **Glue Data Catalog** ကို ဖန်တီးပေးသည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **AWS Glue Data Catalog:** AWS Account အတွင်းရှိ structural data အားလုံး၏ Metadata (Database names, Table schemas, Column types, S3 partitions) များကို စုစည်းထားရာ ဗဟို repository (Apache Hive Metastore-compatible)။
2. **Glue Crawler:** Data store များ (Amazon S3, RDS, DynamoDB) ကို ဝင်ရောက် scan ဖတ်ကာ file formats (JSON, CSV, Parquet) များကို နားလည်ပြီး Data Catalog ထဲသို့ table metadata အဖြစ် အလိုအလျောက် ရေးသွင်း/update ပေးသော ပရိုဂရမ်။
3. **Glue ETL Jobs:** Python သို့မဟုတ် Scala (Apache Spark framework) ဖြင့် data transform ပြုလုပ်ပေးသော script များ။
   - **Glue Spark Job:** ကြီးမားသော data volumes များကို parallel distributed processing ပြုလုပ်ရန်။
   - **Glue Python Shell Job:** သေးငယ်သော tasks များအတွက် Python scripts (Pandas, NumPy) run ရန်။
   - **Glue Streaming Job:** Kinesis သို့မဟုတ် Kafka မှ real-time streaming data များကို transform လုပ်ရန်။
4. **Data Processing Unit (DPU):** Glue ၏ compute resource တိုင်းတာမှု ယူနစ် (1 DPU = 4 vCPUs နှင့် 16 GB memory)။
5. **Glue Studio:** ETL pipeline များကို code မရေးဘဲ Visual drag-and-drop interface ဖြင့် လွယ်ကူစွာ တည်ဆောက်နိုင်သော graphical tool။
6. **Glue DataBrew:** Data Analysts များအတွက် code မလိုဘဲ spreadsheet interface ဖြင့် visual data cleaning နှင့် normalization (250+ pre-built transforms) ပြုလုပ်ပေးသော tool။
7. **Triggers:** ETL jobs များကို အချိန်ဇယား (Schedule) သို့မဟုတ် Event (S3 upload, job success) ပေါ်မူတည်၍ အလိုအလျောက် execute လုပ်ပေးသော orchestration logic။

---

## 3. Architecture & ETL Pipeline Flow

```
+-----------------------------------------------------------------------------------------+
|                                    AWS Glue Architecture                                |
|                                                                                         |
|   +-----------------------+              +-----------------------+                      |
|   | Source Data Stores    |              | AWS Glue Crawler      |                      |
|   | (S3 / RDS / DynamoDB) | -----------> | - Scans files         |                      |
|   +-----------------------+              | - Infers schema       |                      |
|                                          +-----------+-----------+                      |
|                                                      |                                  |
|                                                      v Writes metadata                  |
|                                          +-----------------------+                      |
|                                          | AWS Glue Data Catalog |                      |
|                                          | (Central Schema Hub)  |                      |
|                                          +-----------+-----------+                      |
|                                                      |                                  |
|                                                      v Schema Reference                 |
|   +-----------------------+              +-----------------------+                      |
|   | Glue ETL Job          | <----------  | Transformed Data      |                      |
|   | (Serverless Spark)    | -----------> | (Clean Parquet files) |                      |
|   +-----------------------+  Write S3    +-----------+-----------+                      |
|                                                      |                                  |
|                                                      v Query / Analytics                |
|                                          +-----------------------+                      |
|                                          | Amazon Athena /       |                      |
|                                          | Amazon Redshift       |                      |
|                                          +-----------------------+                      |
+-----------------------------------------------------------------------------------------+
```

### ETL Pipeline အဆင့်ဆင့်:
1. S3 bucket ထဲသို့ နေ့စဉ် raw logs သို့မဟုတ် data files အသစ်များ ရောက်ရှိသည်။
2. Glue Crawler က run ပြီး schema အသစ် သို့မဟုတ် partition အသစ်များကို Glue Data Catalog ထဲ update လုပ်သည်။
3. EventBridge သို့မဟုတ် Glue Trigger က Glue ETL Job (Spark) ကို စတင်သည်။
4. Job သည် raw files များကို ဖတ်ယူကာ deduplicate လုပ်ခြင်း၊ null values များ ရှင်းလင်းခြင်း၊ JSON/CSV မှ **Apache Parquet** သို့ ပြောင်းလဲခြင်းတို့ကို ပြုလုပ်၍ target S3 data lake ထဲ ရေးသားသိမ်းဆည်းသည်။
5. Athena နှင့် QuickSight တို့က ချက်ချင်း clean data ကို query run နိုင်သွားသည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### DynamicFrame vs Spark DataFrame
Glue တွင် Spark ၏ standard DataFrame အပြင် AWS ၏ ကိုယ်ပိုင် **DynamicFrame** ကို အသုံးပြုသည်:
- Standard Spark DataFrame သည် schema တင်းကျပ်ပြီး type မကိုက်ပါက fail ဖြစ်တတ်သည်။
- **Glue DynamicFrame** သည် schema မတူညီသော (Schema-on-read) စာကြောင်းများ ပါဝင်နေလျှင်လည်း fail မဖြစ်ဘဲ column type အပြောင်းအလဲများကို အဆင်ပြေစွာ transform လုပ်ပေးနိုင်သည်။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Building an S3 Data Lake:** On-premises databases နှင့် S3 ရှိ raw data များကို နေ့စဉ် schedule ဖြင့် crawl လုပ်ပြီး Parquet သို့ convert ကာ partitioned data lake တည်ဆောက်ခြင်း။
2. **Data Warehouse Ingestion (Redshift ETL):** မတူညီသော transactional databases (MySQL, Postgres, DynamoDB) မှ data များကို extract လုပ်၊ aggregate လုပ်ပြီး Redshift သို့ အသင့်သုံး format ဖြင့် load သွင်းခြင်း။
3. **Data Anonymization / PII Masking:** ဆေးရုံ သို့မဟုတ် ဘဏ် data များထဲမှ Customer Social Security Number (SSN), Credit Card နံပါတ်များကို analytics မလုပ်မီ mask ဖုံးအုပ်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Serverless & Auto-Scaling:** Spark infrastructure ပြင်ဆင်ထိန်းသိမ်းစရာ မလိုဘဲ အလုပ်ရှိမှ DPU auto-scale ဖြစ်သည်။
- **Universal Catalog Integration:** Athena, EMR, Redshift Spectrum အားလုံးနှင့် natively ချိတ်ဆက်နိုင်သည်။
- **Code Generation:** Glue Studio က PySpark ETL script များကို အလိုအလျောက် ရေးသားပေးသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- **Warm-Up Time:** Spark ETL Job စတင် run ရာတွင် container provision လုပ်ရန် ၁ မိနစ်မှ ၂ မိနစ်ခန့် ကြာမြင့်နိုင်သည် (Real-time sub-second ETL အတွက် Kinesis Firehose သို့မဟုတ် Lambda က ပိုမိုမြန်ဆန်သည်)။
- Python Shell job များတွင် Third-party C-libraries အချို့ သုံးရန် သီးခြား package package လုပ်ရသည်။

---

## 7. Comparison: AWS Glue vs Amazon EMR vs AWS Lambda

| အင်္ဂါရပ် | AWS Glue | Amazon EMR | AWS Lambda |
| :--- | :--- | :--- | :--- |
| **Type** | Serverless Spark ETL | Managed Big Data Cluster (EC2) | Serverless Micro-Compute |
| **Setup & Mgmt** | Zero server management | Manage EC2 nodes, cluster configs | Zero server management |
| **Data Size** | Gigabytes to Petabytes | Petabytes to Exabytes (Custom tuning) | Megabytes to few Gigabytes |
| **Execution Time** | Hours (Custom ETL jobs) | Continuous 24/7 or batch clusters | **15 minutes max timeout** |
| **Best For** | Scheduled batch ETL & Cataloging | Highly customized Spark/Hadoop/Flink jobs | Event-driven lightweight file transforms |

---

## 8. Hands-on Lab: Glue Crawler နှင့် Job တည်ဆောက်ခြင်း (AWS CLI)

### Step 1: Glue Database ဖန်တီးခြင်း
```bash
aws glue create-database --database-input '{"Name": "ecommerce_raw_db"}'
```

### Step 2: S3 Data ကို Scan ဖတ်မည့် Crawler ဖန်တီးခြင်း
```bash
aws glue create-crawler \
    --name sales-data-crawler \
    --role "arn:aws:iam::123456789012:role/AWSGlueServiceRole" \
    --database-name "ecommerce_raw_db" \
    --targets '{"S3Targets": [{"Path": "s3://company-sales-bucket/raw-data/"}]}'
```

### Step 3: Crawler ကို စတင် Run ခြင်း
```bash
aws glue start-crawler --name sales-data-crawler
```

### Step 4: Serverless Spark ETL Job ဖန်တီးခြင်း
```bash
aws glue create-job \
    --name csv-to-parquet-job \
    --role "arn:aws:iam::123456789012:role/AWSGlueServiceRole" \
    --command '{"Name": "glueetl", "ScriptLocation": "s3://company-scripts-bucket/transform.py", "PythonVersion": "3"}' \
    --glue-version "4.0" \
    --number-of-workers 2 \
    --worker-type "G.1X"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:**
  - Glue Data Catalog တွင် metadata encryption (KMS) ဖွင့်ထားနိုင်သည်။
  - Glue Connection ဖြင့် Private Subnet (VPC) အတွင်းရှိ RDS databases များကို NAT Gateway မလိုဘဲ လုံခြုံစွာ ချိတ်ဆက်နိုင်သည်။
  - IAM role တွင် `AWSGlueServiceRole` managed policy လိုအပ်သည်။
- **Monitoring (CloudWatch):**
  - `glue.driver.aggregate.bytesRead` / `bytesWritten`: Job အတွင်း ကူးယူခဲ့သော data ပမာဏ။
  - `glue.driver.jvm.heap.usage`: Memory leak ရှိ/မရှိ စစ်ဆေးခြင်း။
- **Troubleshooting:**
  - **Out of Memory (OOM) Errors:** Data volume ကြီးမားပါက Worker Type ကို `G.1X` မှ `G.2X` သို့ တိုးမြှင့်ပါ သို့မဟုတ် Worker အရေအတွက်ကို တိုးပါ။
- **Cost Structure:**
  - DPU-Hour ပေါ်တွင် တွက်ချက်သည် ($0.44 per DPU-Hour)။ စက္ကန့်ပိုင်းအလိုက် တွက်ချက်ပြီး အနည်းဆုံး 1 minute သာ ကောက်ခံသည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Serverless ETL & Data Catalog:** "Discover data schema, extract from S3, transform to Parquet, and load without managing servers" ဆိုပါက အမြဲတမ်း **AWS Glue** ဖြစ်သည်။
- **Glue Crawler:** S3 ထဲ data အသစ်ရောက်လာတိုင်း table schema ကို အလိုအလျောက် update လုပ်ပေးသော component ဖြစ်သည်။
- **Athena + Glue:** Athena တွင် table ဖန်တီးရန် သို့မဟုတ် query run ရန် schema သိမ်းဆည်းသည့် အဓိကနေရာသည် **AWS Glue Data Catalog** ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုသည် နေ့စဉ် CSV format ဖြင့် ရောက်ရှိလာသော 500 GB application logs များကို Amazon Athena ဖြင့် query run လိုသည်။ သို့သော် CSV format ကြောင့် query နှေးကွေးပြီး ကုန်ကျစရိတ် မြင့်တက်နေသည်။ မည်သည့် serverless solution ဖြင့် အဆိုပါ CSV ဖိုင်များကို နေ့စဉ် Parquet သို့ အလိုအလျောက် convert ပြုလုပ်သင့်သနည်း?
>
> **အဖြေမှန်:** **AWS Glue ETL Job (Spark)** ကို အသုံးပြု၍ နေ့စဉ် schedule trigger ဖြင့် CSV ဖိုင်များကို ဖတ်ယူကာ Apache Parquet format သို့ convert လုပ်ပြီး ရက်စွဲအလိုက် partition ပြုလုပ်ကာ Target S3 bucket ထဲ သိမ်းဆည်းပါ။ ထို့နောက် Glue Crawler ဖြင့် Data Catalog ကို update လုပ်ပါ။

### ❓ SAA-C03 Mini Quiz:

**Q1: Amazon S3 ထဲသို့ ရောက်ရှိလာသော raw data files များ၏ schema နှင့် data types များကို အလိုအလျောက် scan ဖတ်ပြီး AWS Glue Data Catalog ထဲသို့ table metadata အဖြစ် ရေးသွင်းပေးသော feature မှာ အဘယ်နည်း?**
- A) Glue DataBrew
- B) AWS Glue Crawler
- C) Amazon Athena Engine
- D) AWS DataSync Agent
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS Glue Crawler သည် data sources များကို scan ဖတ်ပြီး schema များကို Data Catalog ထဲသို့ အလိုအလျောက် ဖြည့်သွင်းပေးပါသည်။</details>

**Q2: AWS Glue ETL Job များ၏ compute resource ကို မည်သည့် unit ဖြင့် တိုင်းတာတွက်ချက်သနည်း?**
- A) vCPU hours
- B) Data Processing Unit (DPU)
- C) Redshift Processing Unit (RPU)
- D) Memory GiB/sec
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS Glue သည် compute capacity ကို Data Processing Unit (DPU) ဖြင့် တိုင်းတာပြီး 1 DPU တွင် 4 vCPUs နှင့် 16 GB memory ပါဝင်ပါသည်။</details>

**Q3: AWS Glue တွင် Data Analysts များသည် code ရေးစရာမလိုဘဲ visual spreadsheet interface ဖြင့် data cleaning နှင့် normalization ပြုလုပ်နိုင်သော feature မှာ အဘယ်နည်း?**
- A) Glue Studio
- B) AWS Glue DataBrew
- C) AWS Lake Formation
- D) Amazon QuickSight
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS Glue DataBrew သည် visual data preparation tool တစ်ခုဖြစ်ပြီး code မလိုဘဲ data cleaning လုပ်ဆောင်နိုင်ပါသည်။</details>
