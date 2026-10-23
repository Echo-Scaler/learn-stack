---
title: "Amazon Athena — Serverless Interactive SQL Analytics"
description: "Amazon Athena ၏ Architecture၊ Serverless S3 Querying၊ Presto/Trino Engine၊ AWS Glue Catalog Integration၊ Partitioning၊ Parquet Cost Optimization နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon Athena
### Serverless Interactive SQL Analytics for Amazon S3 Data Lakes

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon Athena** သည် Serverless interactive query service တစ်ခုဖြစ်ပြီး **Amazon S3** ပေါ်တွင် သိမ်းဆည်းထားသော ဒေတာများကို database ထဲသို့ load သွင်းစရာမလိုဘဲ Standard SQL (Presto/Trino engine) ဖြင့် တိုက်ရိုက် query run ကာ စစ်ဆေးနိုင်သော ဝန်ဆောင်မှု ဖြစ်ပါသည်။

```
[Raw Files on Amazon S3 (CSV / JSON / Parquet)]
                       |
                       v
         [AWS Glue Data Catalog (Schema)]
                       |
                       v
  [Amazon Athena (Serverless SQL Query Engine)] <--- [Analyst / CloudWatch Logs / BI]
```

### ဘာကြောင့် Athena ကို သုံးရသလဲ?
1. **100% Serverless (Zero Infrastructure):** Server provisioning, cluster setup, software patching လုံးဝ ပြုလုပ်ရန် မလိုပါ။ Query run သည့်အချိန်တွင်သာ serverless တွက်ချက်ပြီး ရလဒ်ထွက်သည်နှင့် ပြီးဆုံးသည်။
2. **Pay-Per-Query Pricing:** လစဉ်ကြေးမရှိပါ။ Query run စဉ် S3 ပေါ်မှ scan ဖတ်သွားသော data ပမာဏပေါ်တွင်သာ **$5.00 per 1 TB scanned** ပေးချေရသည်။ (Data မစစ်ပါက စရိတ် သုည ဖြစ်သည်)။
3. **Ad-Hoc Log Analysis:** CloudTrail logs, VPC Flow logs, ALB Access logs များကို database ထဲသွင်းစရာမလိုဘဲ အချိန်မရွေး SQL ဖြင့် ad-hoc စစ်ဆေးနိုင်သည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **Amazon Athena Query Engine:** Presto / Trino open-source distributed SQL engine ပေါ်တွင် အခြေခံထားပြီး parallel distributed queries များကို execute လုပ်ပေးသည်။
2. **AWS Glue Data Catalog:** S3 ပေါ်ရှိ files များ၏ Schema (Table name, Column names, Data types) များကို စုစည်းသတ်မှတ်ပေးထားသော ဗဟို metadata repository။ (Athena တွင် table ဆောက်လိုက်ပါက Glue Data Catalog ထဲသို့ အလိုအလျောက် ရောက်သွားသည်)။
3. **Amazon S3 Source Bucket:** Raw files များ (JSON, CSV, TSV, Parquet, ORC, Avro) သိမ်းဆည်းထားရာ bucket။
4. **Athena Query Result Location (S3):** Query run ပြီး ထွက်လာသော CSV ရလဒ်များကို သိမ်းဆည်းရန်အတွက် သတ်မှတ်ပေးရသော S3 output bucket။
5. **Workgroups:** အဖွဲ့အစည်းအတွင်း ကုန်ကျစရိတ်နှင့် query execution ကို ထိန်းချုပ်ရန် user များ/teams များကို ခွဲခြားထားသော နေရာ။ Workgroup တစ်ခုချင်းစီတွင် data scan limit (ဥပမာ 10 GB per query) သတ်မှတ်ထားနိုင်သည်။
6. **Partitioning:** S3 file structure ကို ရက်စွဲ၊ ဒေသ (ဥပမာ `year=2026/month=10/day=24/`) စသည်ဖြင့် ခွဲခြားထားရှိခြင်းဖြင့် query run သည့်အခါ သက်ဆိုင်ရာ partition ကိုသာ scan ဖတ်စေပြီး စရိတ်နှင့် ကြာချိန်ကို လျှော့ချပေးသည်။

---

## 3. Architecture & Query Flow

```
+-----------------------------------------------------------------------------------------+
|                                  Amazon Athena Architecture                             |
|                                                                                         |
|   +-----------------------+              +------------------------------------------+   |
|   | User / Analyst / BI   | -----------> |            Amazon Athena Engine          |   |
|   | (Athena Console/JDBC) |  SQL Query   | - Presto/Trino Distributed SQL Engine    |   |
|   +-----------------------+              +--------------------+---------------------+   |
|                                                               |                         |
|                                                               | 1. Fetch Schema         |
|                                                               v                         |
|                                                  +-------------------------+            |
|                                                  | AWS Glue Data Catalog   |            |
|                                                  | (Tables, Columns, Types)|            |
|                                                  +-------------------------+            |
|                                                               |                         |
|                                                               | 2. Read only matching   |
|                                                               |    partitions/columns   |
|                                                               v                         |
|                                                  +-------------------------+            |
|                                                  | Amazon S3 (Data Lake)   |            |
|                                                  | (Parquet / Gzip files)  |            |
|                                                  +------------+------------+            |
|                                                               |                         |
|                                                               | 3. Write CSV Results    |
|                                                               v                         |
|                                                  +-------------------------+            |
|                                                  | S3 Query Result Bucket  |            |
|                                                  +-------------------------+            |
+-----------------------------------------------------------------------------------------+
```

### Request Flow အဆင့်ဆင့်:
1. User က Athena Console တွင် SQL Query တစ်ခု ရိုက်နှိပ် run လိုက်သည်။
2. Athena သည် AWS Glue Data Catalog သို့ ဆက်သွယ်ပြီး table schema နှင့် S3 file path location ကို ရယူသည်။
3. Athena ၏ serverless compute nodes များသည် S3 ပေါ်ရှိ သက်ဆိုင်ရာ partition files များကို parallel ဖတ်ရှုသည်။
4. Query တွက်ချက်မှု ရလဒ်ကို S3 query result bucket ထဲ ရေးသားပြီး user ၏ screen ပေါ်တွင် tabular data အဖြစ် ဖော်ပြပေးသည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### S3 Data Partitioning & Parquet Optimization (အရေးကြီးဆုံး Concept)
Athena ၏ ကုန်ကျစရိတ်နှင့် စွမ်းဆောင်ရည်သည် **S3 Data Scanned ပမာဏ** ပေါ်တွင် တိုက်ရိုက် မူတည်သည်။

```
Raw CSV (Uncompressed, Unpartitioned)       ---> 1 TB Scanned  ---> Cost: $5.00  (Time: 45s)
Compressed Apache Parquet + Partitioned     ---> 10 GB Scanned ---> Cost: $0.05  (Time: 2s)
                                                                (99% Cost Savings!)
```

1. **Partitioning:** S3 key path တွင် `/year=2026/month=10/` ကဲ့သို့ folder ခွဲထားပြီး query တွင် `WHERE year = '2026' AND month = '10'` ဟု ထည့်သွင်းပါက ကျန်ရှိသော နှစ်များမှ files များကို လုံးဝ scan မဖတ်ဘဲ ကျော်သွားသည်။
2. **Columnar Storage (Parquet / ORC):** CSV ကဲ့သို့ row-by-row မဟုတ်ဘဲ column-by-column သိမ်းဆည်းသဖြင့် `SELECT customer_name FROM sales` ဟု run ပါက `customer_name` column data ကိုသာ scan ဖတ်ပြီး ကျန် column များကို ကျော်သွားသည်။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Security & Compliance Auditing (CloudTrail / VPC Flow Logs):** Security incident ဖြစ်ပေါ်လာပါက S3 ထဲရှိ CloudTrail logs များကို Athena ဖြင့် SQL query run ၍ မည်သည့် IP က API call ခေါ်သွားသည်ကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေဖော်ထုတ်ခြင်း။
2. **Ad-Hoc Business Intelligence (BI):** Data Warehouse မတည်ဆောက်မီ S3 data lake ပေါ်ရှိ raw sales data များကို Amazon QuickSight ဖြင့် တိုက်ရိုက် ချိတ်ဆက်၍ အမြန်စမ်းသပ် visualization ပြုလုပ်ခြင်း။
3. **Application Log Debugging:** ALB access logs များကို S3 ထဲသိမ်းထားပြီး HTTP 500 error အများဆုံးတက်နေသော URL paths များကို SQL ဖြင့် aggregate လုပ်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Zero Maintenance:** Server, cluster, database engine မလိုဘဲ SQL query run နိုင်သည်။
- **Cost Effective:** Query မ run သည့် အချိန်တွင် ကုန်ကျစရိတ် လုံးဝ မရှိပါ။
- **Open Standards Support:** Presto/Trino SQL, CSV, JSON, Parquet, Avro, ORC စသည့် open formats မျိုးစုံကို ထောက်ပံ့သည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- **Complex OLAP Reporting အတွက် Redshift ထက် latency ပိုမြင့်သည်:** Sub-second response လိုအပ်သော ultra-fast dashboard queries များအတွက် Redshift က ပိုမိုသင့်တော်သည်။
- Query execution timeout ကန့်သတ်ချက်မှာ **30 minutes** ဖြစ်သည်။

---

## 7. Comparison: Athena vs Redshift vs EMR

| အင်္ဂါရပ် | Amazon Athena | Amazon Redshift | Amazon EMR |
| :--- | :--- | :--- | :--- |
| **Model** | Serverless Interactive SQL | Dedicated Data Warehouse (MPP) | Managed Big Data Cluster (Hadoop/Spark) |
| **Data Location** | Amazon S3 ပေါ်တွင်သာ တိုက်ရိုက် run သည် | Local Redshift Disk သို့မဟုတ် S3 Spectrum | HDFS, S3 (EMRFS) |
| **Workload** | Ad-hoc queries, log analysis, S3 data lake | Enterprise BI, high concurrency complex joins | Machine Learning, Big Data ETL, distributed computing |
| **Pricing** | $5 per TB scanned on S3 | Node instance hours သို့မဟုတ် Serverless RPU | EC2 instance pricing + EMR software fee |

---

## 8. Hands-on Lab: Athena ဖြင့် ALB Access Logs Query Run ခြင်း

### Step 1: Glue Data Catalog Table ဖန်တီးခြင်း (Athena DDL)
```sql
CREATE EXTERNAL TABLE IF NOT EXISTS alb_logs (
    type string,
    time string,
    elb string,
    client_ip string,
    client_port int,
    target_ip string,
    target_port int,
    request_processing_time double,
    target_processing_time double,
    response_processing_time double,
    elb_status_code int,
    target_status_code string,
    received_bytes bigint,
    sent_bytes bigint,
    request_verb string,
    request_url string,
    request_proto string,
    user_agent string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
WITH SERDEPROPERTIES (
    'serialization.format' = '1',
    'input.regex' = '([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*):([0-9]*) ([^ ]*)[:-]([0-9]*) ([-.0-9]*) ([-.0-9]*) ([-.0-9]*) (|[-0-9]*) (-|[-0-9]*) ([-0-9]*) ([-0-9]*) \"([^ ]*) (.*) (- |[^ ]*)\" \"([^\"]*)\".*'
)
LOCATION 's3://my-alb-logs-bucket/AWSLogs/123456789012/elasticloadbalancing/us-east-1/';
```

### Step 2: HTTP 5xx Error များ ရှာဖွေ query run ခြင်း
```sql
SELECT elb_status_code, request_verb, request_url, COUNT(*) as error_count
FROM alb_logs
WHERE elb_status_code >= 500
GROUP BY elb_status_code, request_verb, request_url
ORDER BY error_count DESC
LIMIT 10;
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security & IAM:**
  - IAM Policies ဖြင့် မည်သည့် Glue Catalog databases/tables နှင့် S3 buckets များကို query run ခွင့်ရှိကြောင်း ကန့်သတ်နိုင်သည်။
  - **AWS Lake Formation:** Column-level နှင့် Row-level granular access control ပြုလုပ်နိုင်သည်။
  - S3 Server-Side Encryption (SSE-S3, SSE-KMS) နှင့် Client-Side Encryption များကို အပြည့်အဝ ထောက်ပံ့သည်။
- **Monitoring (CloudWatch):**
  - `EngineExecutionTime`: Query engine မှ execute လုပ်ရန် ကြာချိန်။
  - `DataScannedInBytes`: Query တစ်ခုချင်းစီတွင် scan ဖတ်သွားသော byte ပမာဏ။
- **Cost Optimization Tips (အရေးကြီး):**
  - Data များကို **Apache Parquet format** သို့ convert လုပ်ပါ။
  - Data များကို Partition ပြုလုပ်ပါ။
  - GZIP, Snappy compression အသုံးပြုပါ။
  - Athena Workgroup တွင် **Per-query data usage limit** သတ်မှတ်ထားပါ။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Serverless SQL on S3:** "Analyze data in S3 using standard SQL without setting up or managing servers/databases" ဆိုပါက အမြဲတမ်း **Amazon Athena** ဖြစ်သည်။
- **Cost Optimization for Athena:** Athena query cost လျှော့ချရန် မေးခွန်းများတွင် အမြဲတမ်း **"Convert CSV/JSON to Parquet/ORC and partition data by date"** ဖြစ်သည်။
- **CloudTrail / VPC Flow Logs Analysis:** "Ad-hoc query on AWS service logs stored in S3" ဆိုပါက **Amazon Athena** သည် အနည်းဆုံး overhead ဖြင့် အဖြေမှန်ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခု၏ အက်ပလီကေးရှင်း Access Logs များသည် နေ့စဉ် 50 GB နှုန်းဖြင့် Amazon S3 bucket ထဲသို့ CSV format ဖြင့် ရောက်ရှိနေသည်။ Data Analyst အဖွဲ့သည် တစ်ပတ်လျှင် တစ်ကြိမ်သာ သီးခြား error codes များကို SQL ဖြင့် ad-hoc စစ်ဆေးလိုသည်။ Server provisioning မလိုဘဲ အနိမ့်ဆုံး ကုန်ကျစရိတ်ဖြင့် မည်သည့် solution ကို အသုံးပြုသင့်သနည်း?
>
> **အဖြေမှန်:** **Amazon Athena** ကို အသုံးပြုပါ။ ထို့အပြင် ကုန်ကျစရိတ်ကို ပိုမိုသက်သာစေရန်အတွက် CSV ဖိုင်များကို AWS Glue ETL job ဖြင့် **Apache Parquet format** သို့ convert လုပ်ပြီး ရက်စွဲအလိုက် partition ထားပါ။ ထိုအခါ Athena query run သည့်အခါ scan data ပမာဏ 90% ကျော် လျော့ကျသွားမည်ဖြစ်ပြီး စရိတ်အသက်သာဆုံး ဖြစ်စေမည်။

### ❓ SAA-C03 Mini Quiz:

**Q1: Amazon Athena ၏ ကုန်ကျစရိတ် တွက်ချက်မှု ပုံစံသည် မည်သည့်အရာအပေါ်တွင် အဓိက အခြေခံထားသနည်း?**
- A) Athena query run နေစဉ် ကြာမြင့်သော နာရီအရေအတွက်
- B) Query run စဉ် S3 ပေါ်မှ scan ဖတ်သွားသော data ပမာဏ (Data Scanned in Bytes)
- C) Query ရလဒ် table တွင် ထွက်ပေါ်လာသော row အရေအတွက်
- D) AWS Glue Catalog ထဲရှိ table အရေအတွက်
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Athena သည် S3 ပေါ်မှ scan ဖတ်သွားသော data ပမာဏပေါ်တွင် $5.00 per 1 TB scanned ဖြင့် ကောက်ခံပါသည်။</details>

**Q2: Amazon Athena ဖြင့် S3 logs များကို query run ရာတွင် ကုန်ကျစရိတ်ကို 90% ကျော် လျှော့ချနိုင်သော အကောင်းဆုံး နည်းလမ်းမှာ အဘယ်နည်း?**
- A) Query ကို ညသန်းခေါင်ယံ အချိန်တွင်သာ run ခြင်း
- B) S3 data များကို uncompressed CSV အဖြစ် ထားရှိခြင်း
- C) Data များကို Apache Parquet ကဲ့သို့ columnar format သို့ ပြောင်းလဲပြီး partition ပြုလုပ်ခြင်း
- D) Multi-AZ S3 bucket အသုံးပြုခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: C</b> — Columnar format (Parquet/ORC) နှင့် Partitioning အသုံးပြုခြင်းသည် query နှင့် မသက်ဆိုင်သော column များနှင့် partition များကို scan မဖတ်စေဘဲ data scanned ပမာဏကို ၉၀% ကျော် လျှော့ချပေးပါသည်။</details>

**Q3: Amazon Athena တွင် Table တစ်ခု၏ schema (table name, column types) များကို မည်သည့်နေရာတွင် သိမ်းဆည်းထိန်းသိမ်းထားသနည်း?**
- A) Amazon DynamoDB Table
- B) AWS Glue Data Catalog
- C) S3 Bucket Metadata
- D) Route 53 DNS Record
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Amazon Athena သည် table schemas များနှင့် metadata များအတွက် AWS Glue Data Catalog ကို အသုံးပြုပါသည်။</details>
