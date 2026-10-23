---
title: "Amazon Kinesis — Real-Time Streaming Data Service"
description: "Amazon Kinesis Data Streams၊ Kinesis Data Firehose၊ Kinesis Data Analytics၊ Shards Capacity၊ Consumer Fan-Out နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon Kinesis
### Real-Time Streaming Data Processing, Ingestion, and Analytics at Scale

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon Kinesis** သည် ရင်းမြစ်ပေါင်း ထောင်သောင်းများစွာ (IoT sensors, Web Clickstreams, Financial transactions, Social media feeds, Application logs) မှ စက္ကန့်တိုင်း ထွက်ပေါ်နေသော **Real-Time Streaming Data (တိုက်ရိုက်စီးဆင်းနေသော ဒေတာများ)** ကို Sub-Second Latency ဖြင့် လက်ခံရယူခြင်း၊ process လုပ်ခြင်းနှင့် data stores များသို့ load သွင်းခြင်းတို့ကို ဆောင်ရွက်ပေးသော fully managed platform ဖြစ်ပါသည်။

```
[IoT Devices / Web Apps / Logs] ---> [Amazon Kinesis Data Streams] ---> [Custom EC2/Lambda Workers] (Real-time Analytics)
                                 ---> [Amazon Kinesis Data Firehose] ---> [Amazon S3 / Redshift / OpenSearch / Splunk]
```

### SQS နှင့် Kinesis အဘယ်ကြောင့် ကွာခြားသလဲ?
- **Amazon SQS:** 1 message ကို consumer ၁ ခုကသာ poll ဖတ်ယူပြီး process လုပ်ပြီးပါက delete လုပ်ပစ်သည်။ (Decoupling individual worker tasks)။
- **Amazon Kinesis:** Data stream တစ်ခုတည်းကို **Multiple Consumer Applications များက တစ်ပြိုင်နက်တည်း (Parallel)** ဖတ်ရှုနိုင်ပြီး data ကို replay ပြုလုပ်နိုင်သည်။ (Real-time big data streaming analytics)။

---

## 2. Key Components — Kinesis Family ဝန်ဆောင်မှုများ

Amazon Kinesis တွင် အဓိက Service ၄ မျိုး ပါဝင်ပါသည်:

1. **Amazon Kinesis Data Streams (KDS):**
   - Developer-managed, highly customizable real-time data streaming service။
   - Data များကို **Shards (အပိုင်းအစများ)** ဖြင့် စုစည်းသိမ်းဆည်းသည်။
   - **Retention Period:** 24 hours (default) မှ **365 days (1 year)** အထိ သိမ်းဆည်းထားနိုင်ပြီး past data များကို အချိန်မရွေး replay ပြန်ဖတ်နိုင်သည်။
2. **Amazon Kinesis Data Firehose (ယခု Amazon Data Firehose):**
   - **Zero Administration, Near-Real-Time Delivery:** Custom consumer code ရေးစရာမလိုဘဲ data များကို **Amazon S3, Amazon Redshift, Amazon OpenSearch, Splunk** ထံသို့ အလိုအလျောက် သွင်းပေးသည်။
   - **Built-in Transformation:** Lambda ဖြင့် data format ပြောင်းလဲခြင်း (CSV -> Parquet) နှင့် GZIP/Snappy compression အလိုအလျောက် ဆောင်ရွက်ပေးသည်။
   - **Buffering:** Buffer Size (1MB - 128MB) သို့မဟုတ် Buffer Interval (60s - 900s) ပြည့်မှ target သို့ flush ရေးသွင်းသည်။
3. **Amazon Managed Service for Apache Flink (ယခင် Kinesis Data Analytics):**
   - Streaming data များပေါ်တွင် SQL queries သို့မဟုတ် Apache Flink code ဖြင့် Real-time window aggregations (Tumbling, Sliding windows) တွက်ချက်ခြင်း။
4. **Amazon Kinesis Video Streams (KVS):**
   - Security cameras, drones, smartphones များမှ video/audio stream များကို real-time ingest လုပ်ပြီး ML computer vision (AWS Rekognition) ဖြင့် analyze လုပ်ခြင်း။

---

## 3. Architecture & Data Flow

```
+-----------------------------------------------------------------------------------------+
|                                Amazon Kinesis Architecture                              |
|                                                                                         |
|   +-----------------------+              +------------------------------------------+   |
|   | Producers             |              |       Amazon Kinesis Data Streams        |   |
|   | (IoT, Web, Kinesis    | -----------> | +--------------------------------------+ |   |
|   |  Agent / SDK)         |  PutRecord   | | Shard 1: Ingest 1MB/s | Output 2MB/s | |   |
|   +-----------------------+              | +--------------------------------------+ |   |
|                                          | | Shard 2: Ingest 1MB/s | Output 2MB/s | |   |
|                                          | +--------------------------------------+ |   |
|                                          +--------------------+---------------------+   |
|                                                               |                         |
|                 +---------------------------------------------+--------------------+    |
|                 |                                                                  |    |
|                 v Real-Time (<200ms)                                               v    |
|   +-------------------------------+                              +--------------------+ |
|   | Real-time Consumers           |                              | Kinesis Data       | |
|   | - Lambda Function             |                              | Firehose (Buffer)  | |
|   | - Kinesis Client Lib (KCL)    |                              +---------+----------+ |
|   | - Real-time Fraud Detection   |                                        |            |
|   +-------------------------------+                                        | Near RT    |
|                                                                            v            |
|                                                            +--------------------------+ |
|                                                            | S3 / Redshift / Splunk   | |
|                                                            +--------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### A. Kinesis Data Streams Shard Limits (မဖြစ်မနေ ကျက်ထားရမည့် SAA-C03 Metrics)

| Feature | ကန့်သတ်ချက် (Per Shard) |
| :--- | :--- |
| **Ingest Capacity (Write)** | **1 MB/sec** သို့မဟုတ် **1,000 records/sec** per shard |
| **Egress Capacity (Read - Standard)** | **2 MB/sec** per shard (Shared across all consumers) |
| **Enhanced Fan-Out (EFO)** | **2 MB/sec dedicated per consumer** (HTTP/2 push, 70ms latency) |
| **Capacity Modes** | **Provisioned Mode** (Manual shard count) သို့မဟုတ် **On-Demand Mode** (Auto-scales up to 200MB/s) |

- အကယ်၍ Ingestion data သည် 1 MB/s သို့မဟုတ် 1000 records/s ကျော်သွားပါက `ProvisionedThroughputExceededException` error တက်မည်။ (ဖြေရှင်းနည်း- **Resharding / Split Shards** ပြုလုပ်ပါ သို့မဟုတ် On-Demand mode သုံးပါ)။

### B. Kinesis Data Streams vs Kinesis Data Firehose

| အင်္ဂါရပ် | Kinesis Data Streams | Kinesis Data Firehose |
| :--- | :--- | :--- |
| **Management** | Shards များ ကိုယ်တိုင် manage လုပ်ရသည် (Provisioned/On-Demand) | Fully Serverless (Auto-scaling) |
| **Latency** | Real-time (70ms - 200ms) | Near real-time (Buffer: 60s to 900s) |
| **Consumers** | Custom Apps (Lambda, EC2 KCL, Flink) | Target ပို့ဆောင်မှု သီးသန့် (S3, Redshift, OpenSearch, Splunk) |
| **Data Storage** | 1 to 365 days retention (Replay possible) | Storage မရှိပါ (Target သို့ ရောက်သည်နှင့် ပျောက်သွားသည်) |

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Real-Time Fraud Detection:** ဘဏ်ငွေလွှဲ transaction များကို Kinesis Data Streams ထဲသို့ ထည့်သွင်းပြီး Lambda ဖြင့် sub-second အတွင်း ML model စစ်ဆေးကာ လိမ်လည်မှုရှိပါက ချက်ချင်း block ခြင်း။
2. **Log & Clickstream Ingestion to S3 Data Lake:** ဝဘ်ဆိုက်၏ clickstream logs များကို Kinesis Firehose ဖြင့် buffer လုပ်ကာ GZIP Parquet အဖြစ် S3 သို့ နေ့စဉ်စုစည်းခြင်း။
3. **IoT Fleet Monitoring:** ကားအစီးရေ ၁ သိန်းမှ GPS နှင့် အင်ဂျင် sensor data များကို stream လုပ်ပြီး Apache Flink ဖြင့် အပူချိန်လွန်ကဲသော ကားများကို ချက်ချင်း alert ထုတ်ပေးခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Continuous Real-Time Processing:** Batch မဟုတ်ဘဲ data ထွက်ပေါ်သည့် စက္ကန့်ပိုင်းအတွင်း တုံ့ပြန်နိုင်သည်။
- **Multiple Parallel Consumers:** အဖွဲ့ ၃ ဖွဲ့မှ application ၃ ခုသည် stream တစ်ခုတည်းကို အနှောင့်အယှက်မရှိ တစ်ပြိုင်နက်တည်း ဖတ်နိုင်သည်။
- **Data Replay:** ပြီးခဲ့သော ၇ ရက်က data များကို ပြန်လည် run နိုင်သည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- Record payload အများဆုံး **1 MB** သာ ရသည်။
- Provisioned mode တွင် shard count မလုံလောက်ပါက Throughput error တက်နိုင်သည်။

---

## 7. Comparison: Kinesis Data Streams vs SQS vs SNS

| အင်္ဂါရပ် | Amazon Kinesis Data Streams | Amazon SQS | Amazon SNS |
| :--- | :--- | :--- | :--- |
| **Focus** | Real-time Big Data Ingestion & Ordering | Message Queuing & Worker Decoupling | Pub/Sub Topic Notification |
| **Consumer Count** | Multiple consumers read same shard | 1 consumer deletes message after reading | All subscribers get pushed copy |
| **Ordering** | Shard Partition Key အလိုက် strictly ordered | FIFO Queue သုံးမှ ordered ဖြစ်သည် | FIFO Topic သုံးမှ ordered ဖြစ်သည် |
| **Replay Data** | Yes (Up to 365 days) | No (Deleted after processing) | No (No storage retention) |

---

## 8. Hands-on Lab: Kinesis Stream ဖန်တီးခြင်းနှင့် Record ထည့်သွင်းခြင်း

### Step 1: Kinesis Data Stream ဖန်တီးခြင်း (On-Demand Mode)
```bash
aws kinesis create-stream \
    --stream-name web-clickstream \
    --stream-mode-details StreamMode=ON_DEMAND
```

### Step 2: Record ထည့်သွင်းခြင်း (Producer)
```bash
aws kinesis put-record \
    --stream-name web-clickstream \
    --partition-key "user-1002" \
    --data "eyJldmVudCI6ICJjbGljayIsICJwYWdlIjogIi9jaGVja291dCJ9"
```

### Step 3: Kinesis Data Firehose Delivery Stream ဖန်တီးခြင်း (Target: S3)
```bash
aws firehose create-delivery-stream \
    --delivery-stream-name s3-backup-firehose \
    --delivery-stream-type DirectPut \
    --extended-s3-destination-configuration '{
        "RoleARN": "arn:aws:iam::123456789012:role/FirehoseS3DeliveryRole",
        "BucketARN": "arn:aws:s3:::company-streaming-lake",
        "BufferingHints": {"SizeInMBs": 5, "IntervalInSeconds": 300},
        "CompressionFormat": "GZIP"
    }'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:**
  - AWS KMS (Server-Side Encryption) ဖြင့် data in stream ကို encrypt လုပ်ထားသည်။
  - VPC Interface Endpoints (PrivateLink) ဖြင့် Private Subnet မှ secure access ရရှိသည်။
- **Monitoring (CloudWatch):**
  - `WriteProvisionedThroughputExceeded`: Ingestion limit ပြည့်နေခြင်း (Shard တိုးရန် လိုအပ်သည်)။
  - `GetRecords.IteratorAgeMilliseconds`: Consumer သည် stream ထက် အဆမတန် နောက်ကျကျန်နေခြင်း (Lagging)။
- **Troubleshooting:**
  - **IteratorAge တိုးလာခြင်း:** Consumer processing logic နှေးကွေးနေခြင်း ဖြစ်သည်။ Consumer instances များ တိုးပါ သို့မဟုတ် **Enhanced Fan-Out (EFO)** ဖွင့်ပါ။
- **Cost Structure:**
  - Provisioned Mode: Shard-hour ($0.015/hr) + PUT payload units။
  - On-Demand Mode: Ingestion/Egress per GB ($0.08/GB ingested)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Real-Time Clickstream / IoT at Scale:** မေးခွန်းတွင် "Ingest streaming data in real-time with multiple consumers and replay capability" ဆိုပါက **Amazon Kinesis Data Streams** ဖြစ်သည်။
- **Load directly into S3, Redshift, OpenSearch, Splunk:** Consumer code မလိုဘဲ target သို့ အလိုအလျောက် သွင်းပေးရန် ဆိုပါက **Amazon Kinesis Data Firehose** ဖြစ်သည်။
- **ProvisionedThroughputExceededException:** Shard ကန့်သတ်ချက် ပြည့်သွားခြင်းဖြစ်ပြီး ဖြေရှင်းနည်းမှာ **Partition Key များကို hash ညီအောင် ဖြန့်ကျက်ခြင်း (Random partition keys)** နှင့် **Shard Split ပြုလုပ်ခြင်း** ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် စမတ်ဖုန်းအသုံးပြုသူ သန်းပေါင်းများစွာထံမှ Mobile App Telemetry logs များကို လက်ခံပြီး အချိန်နှင့်တစ်ပြေးညီ (Near-Real-Time) Amazon S3 bucket ထဲသို့ Parquet format ဖြင့် သိမ်းဆည်းလိုသည်။ Custom consumer application သို့မဟုတ် cluster များကို manage ပြုလုပ်လိုခြင်း မရှိပါ။ မည်သည့် solution သည် အကောင်းဆုံးဖြစ်သနည်း?
>
> **အဖြေမှန်:** **Amazon Kinesis Data Firehose** ကို အသုံးပြုပါ။ Mobile App များမှ telemetry logs များကို Firehose သို့ တိုက်ရိုက် send စေပြီး Firehose ၏ built-in data format conversion တွင် AWS Lambda သို့မဟုတ် AWS Glue Data Catalog ကို တွဲဖက်ကာ Apache Parquet သို့ convert လုပ်၍ Amazon S3 ထဲသို့ အလိုအလျောက် ပေးပို့သိမ်းဆည်းစေရမည်။

### ❓ SAA-C03 Mini Quiz:

**Q1: Kinesis Data Stream တစ်ခုတွင် Single Shard တစ်ခုသည် အများဆုံး မည်မျှအထိ Write Ingestion data လက်ခံနိုင်သနည်း?**
- A) 10 MB/sec
- B) 1 MB/sec သို့မဟုတ် 1,000 records/sec
- C) 2 MB/sec
- D) Unlimited
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Kinesis Data Streams တွင် Shard တစ်ခုစီသည် 1 MB/sec သို့မဟုတ် 1,000 records/sec write ingestion throughput သာ ကန့်သတ်ချက် ရှိပါသည်။</details>

**Q2: အပလီကေးရှင်းတစ်ခုတွင် Kinesis Data Streams သို့ data ရေးသားစဉ် ProvisionedThroughputExceededException error တက်လာပါသည်။ အောက်ပါတို့အနက် မည်သည့်နည်းလမ်းဖြင့် ဖြေရှင်းနိုင်သနည်း?**
- A) Shard Split ပြုလုပ်၍ Shards အရေအတွက် တိုးမြှင့်ခြင်းနှင့် Partition Key များကို ညီညာစွာ ခွဲဝေဖြန့်ကြက်ခြင်း
- B) SQS FIFO Queue သို့ ပြောင်းလဲခြင်း
- C) CloudFront Cache ဖွင့်ခြင်း
- D) S3 Transfer Acceleration သုံးခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: A</b> — Shard Split ဖြင့် shard အရေအတွက် တိုးမြှင့်ခြင်းနှင့် partition key data skewing ကို ဖြေရှင်းခြင်းဖြင့် throughput exception ကို ဖြေရှင်းနိုင်ပါသည်။</details>

**Q3: Kinesis Data Streams မှ data များကို Consumer applications ၅ ခုက တစ်ပြိုင်နက်တည်း ဖတ်ရှုနေပြီး Latency ကို အနိမ့်ဆုံး (70ms ခန့်) ရရှိလိုပါက မည်သည့် feature ကို အသုံးပြုရမည်နည်း?**
- A) Kinesis Short Polling
- B) Enhanced Fan-Out (EFO) with dedicated 2MB/s throughput per consumer
- C) S3 Multipart Read
- D) DynamoDB Accelerator (DAX)
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Enhanced Fan-Out (EFO) သည် consumer တစ်ခုချင်းစီအတွက် dedicated 2MB/sec throughput ကို HTTP/2 push ဖြင့် ပေးဆောင်ပြီး latency ကို 70ms အထိ လျှော့ချပေးပါသည်။</details>
