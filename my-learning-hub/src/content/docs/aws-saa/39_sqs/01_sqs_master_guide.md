---
title: "Amazon SQS — Distributed Message Queuing Service"
description: "Amazon SQS (Simple Queue Service) ၏ Architecture၊ Standard vs FIFO Queues၊ Visibility Timeout၊ Dead Letter Queues (DLQ) နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon SQS (Simple Queue Service)
### Fully Managed Message Queuing Service for Decoupled Architectures

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon SQS (Simple Queue Service)** သည် AWS ၏ အစောဆုံးနှင့် အဓိကအကျဆုံး Serverless Message Queuing Service တစ်ခုဖြစ်ပါသည်။ Distributed Software Components များနှင့် Microservices များအကြား direct dependency မရှိစေဘဲ **Asynchronous Decoupling** ပြုလုပ်ရန် အသုံးပြုပါသည်။

```
[Producer: Web App] ---> [Amazon SQS Queue] ---> [Consumer: Worker EC2 / Lambda]
```

### ဘာကြောင့် SQS ကို မဖြစ်မနေ သုံးရသလဲ?
1. **Tightly-Coupled vs Loosely-Coupled:** Web tier နှင့် Worker tier ကို တိုက်ရိုက် HTTP call ခေါ်ပါက Worker down သွားချိန်တွင် Web request ပါ fail သွားမည် (Single Point of Failure)။ SQS ကြားခံထားပါက Web tier က message ကို queue ထဲထည့်ပြီးချက်ချင်း 200 OK ပြန်ပေးနိုင်ပြီး Worker က အားမှ queue ထဲမှ ဆွဲယူ (poll) လုပ်ဆောင်နိုင်သည်။
2. **Buffer Traffic Spikes (Load Leveling):** Black Friday သို့မဟုတ် Flash Sale ကဲ့သို့ traffic အဆမတန် တက်လာချိန်တွင် database နှင့် backend server များ overload မဖြစ်စေရန် queue ထဲတွင် temporary buffer အဖြစ် ထိန်းသိမ်းထားပေးသည်။
3. **Infinite Scaling & Zero Administration:** Server provisioning, cluster management, patching ပြုလုပ်ရန် မလိုဘဲ အလိုအလျောက် သန်းပေါင်းများစွာသော message များကို scale လုပ်ပေးနိုင်သည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **Queue (မက်ဆေ့ခ်ျ တန်းစီစနစ်):** Message များကို consumer က လာမယူမချင်း သိမ်းဆည်းထားရာ နေရာ။
2. **Producer (ထုတ်လုပ်သူ):** `SendMessage` API ဖြင့် Queue ထဲသို့ data ထည့်သွင်းပေးသော service (ဥပမာ- EC2, Lambda, API Gateway, CloudWatch Events)။
3. **Consumer / Worker (ရယူသုံးစွဲသူ):** `ReceiveMessage` API ဖြင့် Queue ထဲမှ message ကို poll လုပ်ကာ process လုပ်ပြီးနောက် `DeleteMessage` API ဖြင့် ဖျက်ပစ်သော service (ဥပမာ- Auto Scaling Group EC2, ECS Task, Lambda)။
4. **Visibility Timeout:** Consumer တစ်ခုက message ကို ရယူဖတ်ရှုနေချိန်တွင် အခြား consumer များ duplicate မဖတ်နိုင်စေရန် အဆိုပါ message ကို ယာယီ ဝှက်ထားပေးသည့် ကြာချိန် (Default: 30 seconds, Max: 12 hours)။
5. **Dead-Letter Queue (DLQ):** Processing error ကြောင့် သို့မဟုတ် unparseable data ကြောင့် အကြိမ်ကြိမ် fail ဖြစ်နေသော "Poison Pill" message များကို သီးခြားခွဲထုတ်ဖယ်ရှားပေးသည့် Queue။ `maxReceiveCount` ပြည့်ပါက DLQ သို့ အလိုအလျောက် ရောက်ရှိသည်။
6. **Message Retention Period:** Queue ထဲတွင် message ကို သိမ်းဆည်းထားသည့် သက်တမ်း (Default: 4 days, Minimum: 60 seconds, Maximum: 14 days)။
7. **Message Size Limit:** Standard payload size မှာ **256 KB** ဖြစ်သည်။ 256 KB ထက်ကြီးသော file/payload များအတွက် **Amazon S3 Extended Client Library for Java** ကိုသုံး၍ payload ကို S3 တွင်သိမ်းပြီး pointer ကိုသာ SQS ထဲ ထည့်ရသည်။

---

## 3. Architecture & Request Flow

```
+-----------------------------------------------------------------------------------------+
|                                    Amazon SQS Architecture                              |
|                                                                                         |
|   +-------------------+    1. SendMessage (Payload <= 256KB)     +------------------+   |
|   |   Producer Tier   | --------------------------------------> |   Amazon SQS     |   |
|   | (EC2 / API / App) |                                         |   Standard Queue |   |
|   +-------------------+                                         +--------+---------+   |
|                                                                          |              |
|                                    2. Long Polling (WaitTime: 20s)       |              |
|                               +------------------------------------------+              |
|                               |                                                         |
|                               v                                                         |
|                   +-----------------------+                                             |
|                   | Consumer / Worker EC2 |                                             |
|                   +-----------+-----------+                                             |
|                               |                                                         |
|                               | 3. Process Logic                                        |
|                               | 4. DeleteMessage (ReceiptHandle)                        |
|                               v                                                         |
|                   +-----------------------+                                             |
|                   | Message Deleted OK    |                                             |
|                   +-----------------------+                                             |
+-----------------------------------------------------------------------------------------+
```

### Request Lifecycle အဆင့်ဆင့်:
1. **Producer Send:** Producer သည် message payload ကို SQS သို့ `SendMessage` action ဖြင့် ပို့သည်။ Message ID နှင့် MD5 digest ပြန်ရသည်။
2. **In-Flight & Visibility Timeout:** Consumer သည် message ကို `ReceiveMessage` ဖြင့် ဖတ်လိုက်သောအခါ Message သည် "In-Flight" အခြေအနေသို့ ရောက်သွားပြီး Visibility Timeout (ဥပမာ 30s) timer စတင်သည်။
3. **Receipt Handle:** SQS က consumer ထံသို့ message body နှင့်အတူ `ReceiptHandle` တစ်ခု ပေးပို့သည်။
4. **Message Deletion:** Consumer သည် processing ပြီးဆုံးပါက အဆိုပါ `ReceiptHandle` ကို အသုံးပြု၍ `DeleteMessage` API ခေါ်ကာ queue ထဲမှ အပြီးဖျက်ပစ်ရသည်။ (အကယ်၍ processing မပြီးမီ timeout ကုန်သွားပါက message သည် queue ထဲ ပြန်ပေါ်လာပြီး အခြား worker က duplicate process လုပ်မိနိုင်သည်)။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### A. Standard Queue vs FIFO Queue

| အင်္ဂါရပ် | Standard Queue | FIFO Queue (`.fifo`) |
| :--- | :--- | :--- |
| **Throughput** | Unlimited transactions per second | 300 msg/sec (without batching), up to 3,000 msg/sec with batching (or High Throughput FIFO mode) |
| **Ordering** | Best-effort ordering (အစီအစဉ် လွဲနိုင်သည်) | Strictly First-In-First-Out (အတိအကျ အစဉ်လိုက်) |
| **Delivery Guarantee** | At-least-once (Message duplicate ဖြစ်နိုင်သည်) | Exactly-once delivery (Duplicate မရှိ) |
| **Deduplication** | မပါဝင် (Application logic ဖြင့် idempotency လုပ်ရသည်) | Content-based deduplication (SHA-256) သို့မဟုတ် Deduplication ID (5-minute window) |
| **Message Group ID** | မလိုအပ်ပါ | မဖြစ်မနေ လိုအပ်သည် (Group အလိုက် ordered delivery ရရှိစေရန်) |

### B. Short Polling vs Long Polling
- **Short Polling (`WaitTimeSeconds = 0`):** Consumer request ရောက်သည်နှင့် SQS server subset တစ်ခုတည်းကို ချက်ချင်းစစ်ဆေးပြီး message မရှိပါက empty response ချက်ချင်းပြန်သည်။ API call များလွန်းသဖြင့် Cost မြင့်တက်စေသည်။
- **Long Polling (`WaitTimeSeconds = 1 to 20s`):** Message မရှိသေးပါက server ပေါ်တွင် 20 seconds အထိ စောင့်ဆိုင်းပေးသည်။ Message ရောက်လာသည်နှင့် ချက်ချင်း response ပြန်သည်။ Empty response အကြိမ်ရေကို လျှော့ချပေးသဖြင့် **Cost 90% ကျော် သက်သာပြီး latency နည်းပါးသည် (SAA-C03 Best Practice)**။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Decoupled Order Processing (E-Commerce):** ဖောက်သည် Order တင်လိုက်ချိန်တွင် Payment, Inventory, Email Notification စနစ်များကို SQS ဖြင့် buffer ခံထားပြီး worker များက asynchronous ဆောင်ရွက်ခြင်း။
2. **Batch Job Processing:** Video transcoding သို့မဟုတ် Image resizing task များကို SQS ထဲထည့်ပြီး Spot Instance EC2 Auto Scaling Group က queue backlog အတိုင်း scale လုပ်၍ တွက်ချက်ခြင်း။
3. **Financial Transaction Logging:** ငွေသွင်းငွေထုတ် အစီအစဉ် မလွဲစေရန် FIFO Queue (`.fifo`) ကို သုံး၍ transaction များကို sequence အတိုင်း execute လုပ်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **High Availability & Durability:** Message များကို Multi-AZ တွင် redundant စွာ replicate လုပ်ထားသည်။
- **Decoupled Failure Domain:** Consumer server များ အကုန် down သွားသော်လည်း message များ မပျောက်ပျက်ဘဲ queue ထဲတွင် 14 ရက်အထိ တည်ရှိနေနိုင်သည်။
- **Auto Scaling Integration:** SQS metric `ApproximateNumberOfMessagesVisible` ကို အသုံးပြု၍ Backlog Per Instance တွက်ချက်ကာ EC2 ASG ကို scale-out/scale-in ပြုလုပ်နိုင်သည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- Standard Queue တွင် duplicate messages ရောက်ရှိနိုင်သဖြင့် Consumer code သည် **Idempotent** ဖြစ်ရန် လိုအပ်သည်။
- Message payload အများဆုံး **256 KB** သာ ရသည်။
- FIFO Queue သည် Standard Queue ထက် throughput ကန့်သတ်ချက် ရှိသည်။

---

## 7. Comparison: SQS vs SNS vs Kinesis

| အင်္ဂါရပ် | Amazon SQS | Amazon SNS | Amazon Kinesis Data Streams |
| :--- | :--- | :--- | :--- |
| **Model** | Pull Model (Consumer polls message) | Push Model (Fan-out to subscribers) | Pull/Streaming Model (Real-time data stream) |
| **Consumers** | 1 message ကို consumer ၁ ခုကသာ ဖတ်သည် | 1 message ကို subscriber ထောင်ပေါင်းများစွာ ရရှိသည် | Multiple consumer groups က shard အလိုက် replay ဖတ်နိုင်သည် |
| **Persistence** | 1 minute to 14 days | မသိမ်းဆည်းပါ (Push & forget) | 24 hours to 365 days (Replay capability) |
| **Ordering** | FIFO Queue သုံးမှ ရသည် | FIFO Topic သုံးမှ ရသည် | Shard partition key အလိုက် ordered ဖြစ်သည် |

---

## 8. Hands-on Lab: SQS Queue ဖန်တီးခြင်းနှင့် Message ပို့/ဖတ်ခြင်း

### Step 1: Standard Queue ဖန်တီးခြင်း (AWS CLI)
```bash
aws sqs create-queue \
    --queue-name production-order-queue \
    --attributes ReceiveMessageWaitTimeSeconds=20,VisibilityTimeout=60,MessageRetentionPeriod=86400
```

### Step 2: Message ပေးပို့ခြင်း (Producer)
```bash
aws sqs send-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/production-order-queue \
    --message-body '{"order_id": "ORD-9982", "amount": 145.00, "currency": "USD"}'
```

### Step 3: Long Polling ဖြင့် Message လက်ခံဖတ်ရှုခြင်း (Consumer)
```bash
aws sqs receive-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/production-order-queue \
    --wait-time-seconds 20 \
    --max-number-of-messages 1
```

### Step 4: Process ပြီးသွားသော Message ကို ဖျက်ပစ်ခြင်း
```bash
aws sqs delete-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/production-order-queue \
    --receipt-handle "AQEBwJnKyrHigUMZj6rY..."
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security & Encryption:**
  - **KMS SSE:** AWS KMS (`aws/sqs` သို့မဟုတ် CMK) ဖြင့် Server-Side Encryption (SSE-SQS / SSE-KMS) ပြုလုပ်နိုင်သည်။
  - **SQS Access Policy:** Resource-based policy ဖြင့် အခြား AWS account သို့မဟုတ် S3 bucket မှ SQS သို့ message သွင်းခွင့် (Publish/Send) ကို ခွင့်ပြုနိုင်သည်။
  - **VPC Interface Endpoint (PrivateLink):** Public Internet မဖြတ်ဘဲ Private Subnet မှ SQS သို့ လုံခြုံစွာ ခေါ်ယူနိုင်သည်။
- **Monitoring (CloudWatch):**
  - `ApproximateNumberOfMessagesVisible`: Queue ထဲတွင် consumer စောင့်နေသော message အရေအတွက်။
  - `ApproximateAgeOfOldestMessage`: အကြာဆုံး တင်ကျန်နေသော message ၏ သက်တမ်း (Backlog alert အတွက် အဓိက သုံးသည်)။
- **Troubleshooting:**
  - **Message Duplicate ဖြစ်ခြင်း:** Visibility Timeout ကို တိုးမြှင့်ပါ (`ChangeMessageVisibility` API)။ Worker မပြီးမီ timeout ကုန်သွားပါက duplicate ဖြစ်တတ်သည်။
  - **Poison Pill Messages:** DLQ သတ်မှတ်ပြီး `maxReceiveCount` (ဥပမာ 3 ကြိမ်) ပြည့်ပါက DLQ ထဲ ရွှေ့ကာ alarm စောင့်ကြည့်ပါ။
- **Cost Structure:**
  - ပထမ 1,000,000 requests/month အခမဲ့ (AWS Free Tier)။
  - ထို့နောက် $0.40 per 1 million requests (Standard) နှင့် $0.50 per 1 million requests (FIFO) ဖြစ်၍ ကုန်ကျစရိတ် အလွန်သက်သာသည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Decoupling Pattern:** မေးခွန်းတွင် "Web tier must not fail if backend is down" သို့မဟုတ် "Decouple components with buffer" ပါပါက **Amazon SQS** သည် အမြဲ အဖြေမှန်ဖြစ်သည်။
- **Auto Scaling Metric:** EC2 CPU utilization မဟုတ်ဘဲ Custom Metric ဖြစ်သော `Backlog per instance = (ApproximateNumberOfMessagesVisible / Number of EC2 instances)` ကို သုံးရသည်။
- **Visibility Timeout:** Consumer က message process လုပ်ရန် မိနစ် ၂၀ ကြာမည်ဆိုပါက Default 30s သည် မလုံလောက်ပါ။ Visibility Timeout ကို မိနစ် ၂၀ ထက်ကျော်အောင် သတ်မှတ်ရမည် သို့မဟုတ် `ChangeMessageVisibility` API ခေါ်ရမည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် Video Upload ဝဘ်ဆိုက်တစ်ခုရှိသည်။ အသုံးပြုသူ Upload လုပ်လိုက်သော Video file များသည် 500MB မှ 2GB အထိရှိပြီး နောက်ကွယ်မှ EC2 Worker များက Transcode လုပ်ရမည်။ Transcoding သည် ၅ မိနစ်ခန့် ကြာမြင့်နိုင်သည်။ High availability ရရှိပြီး request မပျောက်စေရန် မည်သို့ design ဆွဲသင့်သနည်း?
>
> **အဖြေမှန်:** Video file ကို S3 bucket ထဲ တိုက်ရိုက် upload တင်စေပြီး၊ S3 Event Notification မှတစ်ဆင့် Metadata ကို **Amazon SQS Queue** သို့ ပို့ပါ။ EC2 Worker များသည် SQS မှ message ကို Long Polling ဖြင့် ဖတ်ယူကာ S3 မှ video ကို download ဆွဲပြီး transcode လုပ်မည်။ SQS Visibility Timeout ကို 10 မိနစ်သတ်မှတ်ထားရမည်။

### ❓ SAA-C03 Mini Quiz:

**Q1: SQS Standard Queue ထဲသို့ ရောက်လာသော message တစ်ခုကို consumer က poll ယူပြီး process လုပ်နေသော်လည်း 30 seconds ပြည့်သွားသည်အထိ delete မလုပ်ရသေးပါ။ မည်သို့ ဖြစ်ပေါ်လာမည်နည်း?**
- A) Message သည် Expire ဖြစ်ပြီး အလိုအလျောက် ပျက်သွားမည်
- B) Message သည် အခြား consumer များထံသို့ ပြန်လည် မြင်တွေ့နိုင်ပြီး duplicate process လုပ်ခံရနိုင်သည်
- C) Message သည် DLQ သို့ ချက်ချင်း ရောက်သွားမည်
- D) SQS သည် Consumer instance ကို restart ချပစ်မည်
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Visibility Timeout ကုန်သွားပါက message သည် queue ထဲ ပြန်ပေါ်လာပြီး အခြား consumer တစ်ခုက ထပ်ဖတ်သွားနိုင်ပါသည်။</details>

**Q2: အပလီကေးရှင်းတစ်ခုသည် တစ်နေ့လျှင် ဘဏ်စာရင်းလွှဲပြောင်းမှုများကို အစဉ်လိုက်အတိအကျ (Strict Order) ဖြင့် duplicate message လုံးဝမပါဘဲ process လုပ်ရန် လိုအပ်ပါသည်။ မည်သည့် queue အမျိုးအစားကို ရွေးချယ်သင့်သနည်း?**
- A) SQS Standard Queue with short polling
- B) SQS FIFO Queue with deduplication ID and Message Group ID
- C) Amazon SNS Topic with multiple SQS subscriptions
- D) Amazon Kinesis Video Streams
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — SQS FIFO Queue သည် Strict ordering နှင့် Exactly-once delivery ကို အာမခံပါသည်။</details>

**Q3: Queue ထဲတွင် message မရှိသေးသည့် အချိန်များတွင် API polling calls များပြားပြီး CloudWatch/Billing ကုန်ကျစရိတ် မြင့်တက်နေသည်ကို လျှော့ချရန် မည်သည့် configuration ကို ပြုလုပ်ရမည်နည်း?**
- A) Visibility Timeout ကို 12 hours သို့ တိုးမြှင့်ပါ
- B) ReceiveMessageWaitTimeSeconds ကို 20 seconds ထားပြီး Long Polling အသုံးပြုပါ
- C) Message Retention Period ကို 14 days သို့ ပြောင်းပါ
- D) Queue ကို FIFO သို့ convert လုပ်ပါ
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Long Polling (`WaitTimeSeconds=20`) သည် empty response calls များကို လျှော့ချပေးပြီး ကုန်ကျစရိတ်ကို သိသိသာသာ သက်သာစေပါသည်။</details>
