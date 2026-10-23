---
title: "Amazon SNS — Publish/Subscribe Notification Service"
description: "Amazon SNS (Simple Notification Service) ၏ Architecture၊ Pub/Sub Fan-Out Pattern၊ Message Filtering၊ FIFO Topics နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon SNS (Simple Notification Service)
### Fully Managed Publish/Subscribe Messaging and Mobile Notifications

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon SNS (Simple Notification Service)** သည် Serverless **Publish/Subscribe (Pub/Sub)** Messaging Service တစ်ခုဖြစ်ပါသည်။ Publisher (မက်ဆေ့ခ်ျ ထုတ်လုပ်သူ) တစ်ခုတည်းမှ subscriber ပေါင်းများစွာ (A2A - Application to Application နှင့် A2P - Application to Person) ထံသို့ message တစ်ပြိုင်နက်တည်း တွန်းပို့ (Push) ပေးရန် အသုံးပြုပါသည်။

```
                    +---> Amazon SQS Queue A (Billing)
                    |
[Publisher] ---> [Amazon SNS Topic] ---> Amazon SQS Queue B (Analytics)
                    |
                    +---> AWS Lambda Function (Email Alert)
                    |
                    +---> SMS / Mobile Push Notification
```

### ဘာကြောင့် SNS ကို သုံးရသလဲ?
1. **Fan-Out Pattern (1-to-Many):** Event တစ်ခုဖြစ်ပေါ်တိုင်း application မျိုးစုံသို့ message အသီးသီး သီးခြားပို့နေစရာမလိုဘဲ SNS Topic တစ်ခုတည်းသို့ publish လုပ်ရုံဖြင့် SQS queues, Lambda functions, HTTP endpoints, SMS များထံ ချက်ချင်း ပျံ့နှံ့ရောက်ရှိသွားသည်။
2. **Instant Push Delivery:** Polling လုပ်စရာမလိုဘဲ Real-time Push model ဖြစ်သောကြောင့် low-latency notification များအတွက် အထူးသင့်လျော်သည်။
3. **Decoupled Architecture:** Publisher သည် မည်သည့် subscriber တွေ နားထောင်နေသည်ကို သိရှိရန်မလိုသဖြင့် loosely-coupled microservices စနစ်ကို ဖန်တီးပေးသည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **SNS Topic:** Message များကို စုစည်းလက်ခံပြီး subscriber များထံသို့ fan-out လုပ်ပေးသည့် communication channel / access point။
2. **Publisher:** Topic သို့ message ထုတ်ပေးသော client သို့မဟုတ် AWS service (ဥပမာ- CloudWatch Alarms, S3 Event Notifications, Auto Scaling lifecycle events, Custom code)။
3. **Subscribers:** Topic မှ message များကို လက်ခံနားထောင်ကြသော endpoints များ:
   - **A2A (Application):** Amazon SQS, AWS Lambda, Amazon Kinesis Data Firehose, Custom HTTP/HTTPS Webhooks။
   - **A2P (Person):** SMS text messages, Email/Email-JSON, Mobile Push Notifications (APNs, FCM)။
4. **Message Filtering:** Subscriber တစ်ခုချင်းစီသည် topic မှ message အားလုံးကို လက်မခံဘဲ JSON Filter Policy သတ်မှတ်ကာ မိမိနှင့် သက်ဆိုင်သော message များကိုသာ စစ်ထုတ်လက်ခံနိုင်သည်။
5. **Message Attributes:** Payload အပြင် metadata (ဥပမာ- `{"store": "yangon", "event": "order_placed"}`) ကို တွဲပို့နိုင်ပြီး Filter Policy စစ်ရာတွင် အသုံးပြုသည်။
6. **Dead-Letter Queue (DLQ):** Subscriber endpoint down သွား၍ delivery retry 3 ကြိမ် ပြည့်သွားပါက message မပျောက်စေရန် တွဲဖက်ထားသော SQS Queue။

---

## 3. Architecture & Request Flow

```
+-----------------------------------------------------------------------------------------+
|                                    Amazon SNS Architecture                              |
|                                                                                         |
|   +-------------------+              +-----------------------+                          |
|   |   Publisher       |              |   Amazon SNS Topic    |                          |
|   | (CloudWatch/App)  | -----------> |   (Standard / FIFO)   |                          |
|   +-------------------+   Publish    +-----------+-----------+                          |
|                                                  |                                      |
|                 +--------------------------------+--------------------------------+     |
|                 |                                |                                |     |
|                 v                                v                                v     |
|       +-------------------+            +-------------------+            +---------------+
|       | SQS Queue (Orders)|            | Lambda Function   |            | Email / SMS   |
|       | (Filter: order)   |            | (Filter: fraud)   |            | (Admin Alert) |
|       +-------------------+            +-------------------+            +---------------+
+-----------------------------------------------------------------------------------------+
```

### Fan-Out Request Flow:
1. Publisher သည် SNS API `Publish` ဖြင့် topic သို့ JSON message payload နှင့် message attributes များကို ပို့သည်။
2. SNS သည် message ကို Multi-AZ redundancy ဖြင့် ချက်ချင်း replicate လုပ်သည်။
3. SNS သည် subscriber တစ်ခုချင်းစီ၏ subscription filter policy ကို စစ်ဆေးသည်။
4. ကိုက်ညီသော subscriber များ (SQS, Lambda, HTTPS) ထံသို့ parallel push ပေးပို့သည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### Standard Topic vs FIFO Topic

| အင်္ဂါရပ် | Standard Topic | FIFO Topic (`.fifo`) |
| :--- | :--- | :--- |
| **Throughput** | Nearly unlimited message throughput | Up to 3,000 msg/sec (or 300 without batching) |
| **Ordering** | Best-effort ordering (အစဉ်လိုက် မသေချာပါ) | Strict First-In-First-Out ordering |
| **Deduplication** | အလိုအလျောက် မပါဝင်ပါ | Deduplication ID (5-min window) ဖြင့် Duplicate ကာကွယ်သည် |
| **Subscribers** | SQS, Lambda, HTTP, Email, SMS | **Amazon SQS FIFO Queues သာလျှင်** subscriber အဖြစ် ထားရှိခွင့်ရှိသည် |

### SNS + SQS Fan-Out Pattern (အလွန် အရေးကြီးသော SAA-C03 Pattern)
- အကယ်၍ application တစ်ခုက event တစ်ခုကို microservices ၅ ခုသို့ တစ်ပြိုင်နက်တည်း broadcast ပေးချင်သည်ဆိုပါက:
  - Producer သည် SNS Topic သို့ publish လုပ်သည်။
  - Service ၅ ခုအတွက် သီးခြား SQS Queue ၅ ခုကို SNS Topic သို့ subscribe လုပ်ထားသည်။
  - တစ်ခုချင်းစီသည် queue ဖြစ်သွားသဖြင့် service တစ်ခု down သွားလျှင်လည်း ၎င်း၏ SQS queue ထဲတွင် message ကျန်ရှိနေမည်ဖြစ်ပြီး data loss မဖြစ်နိုင်ပါ။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Pub/Sub Fan-Out for E-Commerce Orders:** Customer order တင်လိုက်သည်နှင့် SNS Topic မှတစ်ဆင့် `Invoice Service Queue`, `Shipping Service Queue`, `Fraud Detection Lambda` များသို့ တစ်ပြိုင်နက်တည်း ခွဲပို့ခြင်း။
2. **CloudWatch Alarm Notifications:** EC2 CPU > 90% ဖြစ်ပါက CloudWatch Alarm မှ SNS Topic သို့ trigger လုပ်ပြီး DevOps အဖွဲ့ထံသို့ SMS နှင့် Email ပို့ခြင်း။
3. **Emergency Broadcasts / OTP:** ဘဏ် Application များမှ One-Time Password (OTP) များကို SMS ဖြင့် ကမ္ဘာတစ်ဝှမ်းသို့ ပေးပို့ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Serverless & Instant:** Infrastructure maintain စရာမလိုဘဲ sub-second latency ဖြင့် message များကို push ပို့ပေးသည်။
- **Multi-Protocol Support:** HTTP/S, Email, SMS, SQS, Lambda စသော protocol မျိုးစုံကို single topic မှ broadcast လုပ်နိုင်သည်။
- **Cross-Account & Cross-Region Delivery:** အခြား AWS Account သို့မဟုတ် အခြား Region ရှိ SQS Queue များသို့ ပို့နိုင်သည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- **Message Persistence မရှိပါ:** Subscriber down ဖြစ်နေပြီး delivery retry ကုန်သွားပါက message ပျောက်ဆုံးသွားနိုင်သည် (DLQ သို့မဟုတ် SQS Fan-Out တွဲမသုံးပါက)။
- FIFO Topic ၏ subscriber အဖြစ် SMS, Email, Lambda များကို တိုက်ရိုက် မချိတ်ဆက်နိုင်ပါ (SQS FIFO မှတစ်ဆင့်သာ ခေါ်ယူရသည်)။
- Message size သည် SQS ကဲ့သို့ပင် **256 KB** ကန့်သတ်ချက် ရှိသည်။

---

## 7. Comparison: SNS vs SQS vs EventBridge

| အင်္ဂါရပ် | Amazon SNS | Amazon SQS | Amazon EventBridge |
| :--- | :--- | :--- | :--- |
| **Pattern** | Pub/Sub (Push) | Message Queue (Pull) | Event Bus (Router with Rules) |
| **Delivery Model** | Push to subscribers | Pull/Poll by workers | Push to targets |
| **Filtering Capability** | Message Attributes Filtering | None (Consumer filters code) | Advanced Content-based JSON payload filtering |
| **SaaS Integration** | မပါဝင်ပါ (Custom code လိုအပ်သည်) | မပါဝင်ပါ | Native SaaS (Datadog, Shopify, Zendesk, Salesforce) |
| **Latency** | Single-digit milliseconds | Polling latency (Long poll 20s) | Sub-second latency |

---

## 8. Hands-on Lab: SNS Topic ဖန်တီးခြင်းနှင့် SQS Fan-Out ချိတ်ဆက်ခြင်း

### Step 1: SNS Topic ဖန်တီးခြင်း
```bash
aws sns create-topic --name order-events-topic
```

### Step 2: SQS Queue ကို SNS Topic သို့ Subscribe လုပ်ခြင်း
```bash
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:order-events-topic \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:us-east-1:123456789012:order-processing-queue
```

### Step 3: Subscription Filter Policy သတ်မှတ်ခြင်း (Orders event သာ လက်ခံရန်)
```bash
aws sns set-subscription-attributes \
    --subscription-arn <Subscription-ARN> \
    --attribute-name FilterPolicy \
    --attribute-value '{"event_type": ["order_created", "order_paid"]}'
```

### Step 4: Topic သို့ Message Publish လုပ်ခြင်း
```bash
aws sns publish \
    --topic-arn arn:aws:sns:us-east-1:123456789012:order-events-topic \
    --message '{"order_id": "1001", "total": 250}' \
    --message-attributes '{"event_type": {"DataType": "String", "StringValue": "order_created"}}'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security & Access Control:**
  - **SNS Topic Policy:** Resource-based policy ဖြင့် မည်သည့် AWS Service (ဥပမာ S3, CloudWatch) က topic သို့ publish လုပ်ခွင့်ရှိကြောင်း IAM သတ်မှတ်ရသည်။
  - **KMS SSE:** AWS KMS customer managed key (CMK) သို့မဟုတ် AWS managed key ဖြင့် at-rest payload encryption ပြုလုပ်နိုင်သည်။
  - **VPC Endpoint:** VPC အတွင်းမှ private subnet မှ SNS သို့ PrivateLink ဖြင့် လုံခြုံစွာ publish လုပ်နိုင်သည်။
- **Monitoring (CloudWatch):**
  - `NumberOfMessagesPublished`: Topic သို့ ရောက်ရှိလာသော message ပမာဏ။
  - `NumberOfNotificationsDelivered` vs `NumberOfNotificationsFailed`: ပေးပို့မှု အောင်မြင်/ကျရှုံးမှုနှုန်း။
- **Troubleshooting:**
  - **SQS Subscription မရောက်ခြင်း:** SQS Queue Policy တွင် SNS Topic ARN မှ `sqs:SendMessage` ခေါ်ခွင့် Policy မပေးထားပါက delivery fail ဖြစ်တတ်သည်။
- **Cost Structure:**
  - ပထမ 1,000,000 publishes/month အခမဲ့။ ထို့နောက် $0.50 per 1M publishes။
  - SQS/Lambda သို့ delivery ပေးပို့မှု အခမဲ့ဖြစ်ပြီး SMS/HTTP endpoints များအတွက်သာ သီးခြား အပိုကျသင့်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Pub/Sub Fan-Out:** "Broadcast single message to multiple independent processing services" ဆိုပါက အမြဲတမ်း **SNS + SQS Fan-Out** ဖြစ်သည်။
- **Filter Policies:** Subscriber များသို့ message အကုန်မပို့ဘဲ သက်ဆိုင်ရာ message သာ ပို့စေလိုပါက SNS Subscription Filter Policy ကို အသုံးပြုရသည်။
- **Cross-Account Access:** Account A ရှိ SNS Topic မှ Account B ရှိ SQS Queue သို့ message ပို့လိုပါက SQS Policy တွင် Account A Topic ARN ကို allow ပေးရသည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် ငွေပေးချေမှုပြီးဆုံးသည့် transaction event များကို Accounting Service နှင့် Analytics Service နှစ်ခုလုံးသို့ ပေးပို့ရမည်။ Accounting Service သည် transaction တစ်ခုမျှ မကျန်စေဘဲ ဖြည်းဖြည်းချင်း အတိအကျ process လုပ်ရန် လိုအပ်ပြီး၊ Analytics Service သည် traffic များပါက အနည်းငယ် delay ဖြစ်နိုင်ပါသည်။ စနစ်တစ်ခုပျက်စီးပါက အခြားစနစ်ကို မထိခိုက်စေရန် မည်သို့ design ဆွဲရမည်နည်း?
>
> **အဖြေမှန်:** Application မှ Transaction event ကို **Amazon SNS Topic** သို့ publish လုပ်ပါ။ Accounting Service အတွက် SQS FIFO Queue တစ်ခုနှင့် Analytics Service အတွက် SQS Standard Queue တစ်ခုတို့ကို အဆိုပါ SNS Topic သို့ subscribe လုပ်ပေးပါ။ (SNS + SQS Fan-Out Pattern)။

### ❓ SAA-C03 Mini Quiz:

**Q1: Amazon SNS Topic FIFO အမျိုးအစားတွင် Subscriber အဖြစ် အောက်ပါတို့အနက် မည်သည့် endpoint ကိုသာ ချိတ်ဆက်ခွင့်ရှိသနည်း?**
- A) AWS Lambda functions
- B) Amazon SQS FIFO Queues
- C) Email via SMTP
- D) SMS Mobile Phone numbers
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — SNS FIFO Topic များသည် Amazon SQS FIFO Queues များကိုသာ Subscriber အဖြစ် တိုက်ရိုက် ထောက်ပံ့ပေးပါသည်။</details>

**Q2: SNS Topic မှ subscriber SQS Queue များသို့ message ပို့ရာတွင် SQS Queue ထဲသို့ မည်သည့် message မှ မရောက်လာဘဲ CloudWatch တွင် NumberOfNotificationsFailed တက်နေပါသည်။ မည်သည့်အချက်ကြောင့် ဖြစ်နိုင်သနည်း?**
- A) SQS Queue ၏ Visibility Timeout နည်းလွန်းနေခြင်း
- B) SQS Queue Policy တွင် SNS Topic မှ sqs:SendMessage ခွင့်မပြုထားခြင်း
- C) SNS Topic ၏ Retention Period ကုန်ဆုံးသွားခြင်း
- D) SQS Queue ကို Short Polling ဖြင့်သာ configure လုပ်ထားခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — SQS Access Policy တွင် SNS Topic ARN မှ SendMessage ခေါ်ခွင့် resource policy ပေးထားရန် မဖြစ်မနေ လိုအပ်ပါသည်။</details>

**Q3: Multiple subscribers ရှိသော SNS Topic တစ်ခုတွင် Subscriber တစ်ခုသည် "urgent" status ပါသော message များကိုသာ လက်ခံလိုပြီး အခြား message များကို အလိုအလျောက် ပယ်ချလိုပါသည်။ မည်သည့် feature ကို အသုံးပြုရမည်နည်း?**
- A) SQS Dead-Letter Queue
- B) SNS Subscription Filter Policy on Message Attributes
- C) API Gateway Validation
- D) Lambda Pre-traffic Hook
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — SNS Subscription Filter Policy ဖြင့် Message Attributes ပေါ်မူတည်၍ subscriber အလိုက် message များကို စစ်ထုတ်နိုင်ပါသည်။</details>
