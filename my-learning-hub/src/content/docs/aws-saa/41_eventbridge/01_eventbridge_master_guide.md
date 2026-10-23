---
title: "Amazon EventBridge — Serverless Event Bus"
description: "Amazon EventBridge (ယခင် CloudWatch Events) ၏ Architecture၊ Event Buses၊ Rules၊ Content-based Filtering၊ Schema Registry၊ Partner Integrations နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon EventBridge
### Serverless Event Bus for Scalable Event-Driven Architectures

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon EventBridge** (ယခင် CloudWatch Events ၏ နောက်မျိုးဆက်) သည် AWS services များ၊ ပြင်ပ Third-party SaaS applications များနှင့် ကိုယ်ပိုင် Custom applications များကို ချိတ်ဆက်ပေးသော Serverless **Event Bus** Service ဖြစ်ပါသည်။

```
[AWS Services: S3, EC2, IAM] \
[SaaS Apps: Datadog, Shopify] ---> [EventBridge Event Bus] ---> [Rules & Filtering] ---> [Targets: Lambda, Step Functions, SQS]
[Custom Microservices       ] /
```

### ဘာကြောင့် EventBridge ကို သုံးရသလဲ?
1. **True Event-Driven Decoupling:** Event producer များသည် consumer များ ဘာလုပ်ရမည်ကို မသိဘဲ Event Bus သို့ JSON event များကို ပစ်ထည့်ရုံသာဖြစ်သည်။
2. **Advanced JSON Content Filtering:** SNS ထက် သာလွန်စွာ Event payload ၏ JSON field မျိုးစုံ (ဥပမာ- `{"detail": {"state": ["terminated", "stopped"]}}`) ပေါ် မူတည်၍ တိကျသော rule များဖြင့် filter လုပ်နိုင်သည်။
3. **Native 3rd-Party SaaS Integration:** Datadog, PagerDuty, Shopify, Zendesk, Auth0 စသည့် partner services များထံမှ event များကို custom webhook code ရေးစရာမလိုဘဲ တိုက်ရိုက် လက်ခံနိုင်သည်။
4. **Scheduled Cron Jobs:** Linux cron ကဲ့သို့ EventBridge Scheduler ဖြင့် serverless recurring tasks များကို run နိုင်သည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **Event Bus:** Event များကို လက်ခံရာ router တံခါးပေါက်။
   - **Default Event Bus:** AWS services များ (EC2, S3, RDS, IAM) မှ ထုတ်လွှင့်သော events အားလုံး အလိုအလျောက် ရောက်ရှိရာ bus။
   - **Custom Event Bus:** ကိုယ်ပိုင် application များအတွက် သီးခြား ဖန်တီးသော bus။
   - **Partner Event Bus:** Third-party SaaS (ဥပမာ Datadog, Shopify) များအတွက် သီးသန့် bus။
2. **Event (အဖြစ်အပျက်):** စနစ်တစ်ခုခုတွင် အပြောင်းအလဲဖြစ်ပေါ်ကြောင်း ဖော်ပြသည့် standard JSON payload (Time, Region, Source, Detail-Type, Detail)။
3. **Rules (စည်းမျဉ်းများ):** ရောက်ရှိလာသော event များကို event pattern matching ဖြင့် စစ်ဆေးကာ ကိုက်ညီပါက target များသို့ လမ်းကြောင်းလွှဲ (route) ပေးသည့် စည်းမျဉ်း။
4. **Targets (ပန်းတိုင်များ):** Rule နှင့် ကိုက်ညီသော event ကို လက်ခံရယူဆောင်ရွက်မည့် AWS Services များ (AWS Lambda, Amazon SQS, Amazon SNS, Step Functions, Kinesis, ECS Task, SSM Run Command)။
5. **Schema Registry & Discovery:** Event JSON payload ၏ structure ကို အလိုအလျောက် detect လုပ်ပြီး Java, Python, TypeScript code bindings များ ထုတ်ပေးသော feature။
6. **Archive & Replay:** Event bus ပေါ် ဖြတ်သန်းသွားသော events များကို archive လုပ်ထားနိုင်ပြီး debugging ပြုလုပ်ရန် event များကို ပြန်လည် replay ပေးပို့နိုင်သည်။

---

## 3. Architecture & Request Flow

```
+-----------------------------------------------------------------------------------------+
|                                Amazon EventBridge Architecture                          |
|                                                                                         |
|   +-----------------------+                                                             |
|   | AWS Services (S3/EC2) | -----\                                                      |
|   +-----------------------+       \                                                     |
|   +-----------------------+        ---> +-------------------------+                     |
|   | Custom Apps (CLI/SDK) | ----------> |   EventBridge Event Bus |                     |
|   +-----------------------+        ---> +------------+------------+                     |
|   +-----------------------+       /                  |                                  |
|   | SaaS (Shopify/Zendesk)| -----/                   |                                  |
|   +-----------------------+                          | Pattern Matching                 |
|                                                      v                                  |
|                                             +-----------------+                         |
|                                             | Rules & Filters |                         |
|                                             +--------+--------+                         |
|                                                      |                                  |
|                      +-------------------------------+-------------------------------+  |
|                      |                               |                               |  |
|                      v                               v                               v  |
|              +---------------+               +---------------+               +-------+--+
|              | Lambda Exec   |               | Step Function |               | SQS Queue|
|              +---------------+               +---------------+               +----------+
+-----------------------------------------------------------------------------------------+
```

### Event Processing Flow:
1. Producer (ဥပမာ EC2 State Change) သည် JSON event ကို Default Event Bus သို့ ပို့သည်။
2. EventBridge Bus သည် တပ်ဆင်ထားသော Rules များကို စက္ကန့်ပိုင်းအတွင်း evaluate လုပ်သည်။
3. Pattern ကိုက်ညီသော Rules များသည် သတ်မှတ်ထားသော Target များ (ဥပမာ Lambda, SNS) သို့ event ကို asynchronous push လုပ်ပေးသည်။
4. Target တွင် failure ဖြစ်ပါက Dead-Letter Queue (DLQ) သို့ ပို့နိုင်သည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### A. Event Pattern Matching Structure
အောက်ပါသည် EC2 instance တစ်ခု "terminated" ဖြစ်သွားချိန်တွင်သာ trigger ဖြစ်စေရန် သတ်မှတ်သော JSON Rule ဖြစ်သည်:

```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["terminated"]
  }
}
```

### B. EventBridge Scheduler vs Classic Rules
- **EventBridge Scheduler:** One-time schedules (သတ်မှတ်ထားသော နေ့ရက်အချိန်တွင် တစ်ကြိမ်သာ run မည့် tasks) နှင့် Recurring schedules (cron / rate) များကို time zones မျိုးစုံဖြင့် သန်းပေါင်းများစွာ precision အတိအကျ run နိုင်သည်။
- **Archive and Replay:** Past events များကို အချိန်မရွေး archive မှ ပြန်လည်ထုတ်ယူ၍ development သို့မဟုတ် bug tracking အတွက် test environment ထဲ ပြန်လည် replay လုပ်နိုင်သည်။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Security Automation (GuardDuty / IAM alerts):** Root account login လုပ်ခြင်း သို့မဟုတ် GuardDuty alert တက်လာသည်နှင့် EventBridge Rule မှ Lambda function ကို ခေါ်ယူပြီး Security Group ကို revoke လုပ်ခြင်း သို့မဟုတ် Slack message ပို့ခြင်း။
2. **S3 Object Created Processing:** S3 bucket ထဲ file အသစ်ရောက်လာသည်နှင့် EventBridge မှတစ်ဆင့် Step Functions workflow ကို အလိုအလျောက် trigger လုပ်ခြင်း။
3. **Cross-Account Event Routing:** Development AWS Account ရှိ build success event ကို Management Account ရှိ Central Event Bus သို့ ပို့ဆောင်ပြီး reporting လုပ်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Deepest AWS Service Integration:** AWS Services ပေါင်း 200 ကျော်နှင့် 3rd-party SaaS ပေါင်း 40 ကျော်ကို code မလိုဘဲ ချိတ်ဆက်ပေးသည်။
- **Content-Based Filtering:** Message body ထဲရှိ nested JSON fields များကို match လုပ်နိုင်သည်။
- **Schema Discovery:** Developer များအတွက် data contract structure ကို အလွယ်တကူ generate လုပ်ပေးသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- Latency မှာ 0.5s ခန့်ရှိနိုင်သဖြင့် Ultra-low sub-millisecond latency လိုအပ်သော High-Frequency Trading များတွင် SNS သို့မဟုတ် SQS ကို ဦးစားပေးရသည်။
- Message size ကန့်သတ်ချက်မှာ **256 KB** ဖြစ်သည်။

---

## 7. Comparison: EventBridge vs SNS vs CloudWatch Events

| အင်္ဂါရပ် | Amazon EventBridge | Amazon SNS | CloudWatch Events |
| :--- | :--- | :--- | :--- |
| **Concept** | Event Bus Router with Rules | Pub/Sub Topic Broadcaster | EventBridge ၏ Legacy Core Engine |
| **SaaS Partner Sources** | Yes (Datadog, Shopify, etc.) | No | No |
| **Schema Registry** | Yes | No | No |
| **Archive & Replay** | Yes | No | No |
| **Targets** | 20+ AWS Services natively | SQS, Lambda, HTTP, Email, SMS | Limited AWS Services |

---

## 8. Hands-on Lab: EventBridge Rule ဖန်တီးခြင်း (AWS CLI)

### Step 1: Custom Event Bus ဖန်တီးခြင်း
```bash
aws events create-event-bus --name ecommerce-bus
```

### Step 2: Event Rule ဖန်တီးခြင်း (VIP Customer Orders သာ trigger လုပ်ရန်)
```bash
aws events put-rule \
    --name vip-order-rule \
    --event-bus-name ecommerce-bus \
    --event-pattern '{
        "source": ["myapp.orders"],
        "detail-type": ["OrderPlaced"],
        "detail": {
            "customer_tier": ["VIP"]
        }
    }'
```

### Step 3: Rule အတွက် Target ချိတ်ဆက်ခြင်း (SQS Queue)
```bash
aws events put-targets \
    --event-bus-name ecommerce-bus \
    --rule vip-order-rule \
    --targets "Id"="1","Arn"="arn:aws:sqs:us-east-1:123456789012:vip-orders-queue"
```

### Step 4: Test Event ပို့ဆောင်စမ်းသပ်ခြင်း
```bash
aws events put-events --entries '[{
    "EventBusName": "ecommerce-bus",
    "Source": "myapp.orders",
    "DetailType": "OrderPlaced",
    "Detail": "{\"order_id\": \"VIP-999\", \"customer_tier\": \"VIP\", \"amount\": 5000}"
}]'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security & IAM:**
  - **Resource-Based Policies:** အခြား AWS account များမှ Event Bus သို့ events များ ပို့ဆောင်ခွင့် (`events:PutEvents`) ကို bus policy ဖြင့် ကန့်သတ်နိုင်သည်။
  - **Target Execution Roles:** EventBridge သည် SQS သို့မဟုတ် Step Function သို့ event ပို့ရန် IAM Role လိုအပ်သည်။
- **Monitoring (CloudWatch):**
  - `MatchedEvents`: Rule နှင့် match ဖြစ်သော event အရေအတွက်။
  - `TriggeredRules`: Target များသို့ ပို့ဆောင်ပြီးစီးမှုနှုန်း။
  - `FailedInvocations`: Target ခေါ်ယူရာတွင် fail ဖြစ်သွားသော အကြိမ်ရေ (Target IAM role သို့မဟုတ် timeout ကြောင့် ဖြစ်တတ်သည်)။
- **Cost Structure:**
  - AWS Service events များအတွက် ပို့ဆောင်မှု **အခမဲ့** (Free)။
  - Custom events နှင့် SaaS partner events များအတွက် $1.00 per 1 million events သာ ကျသင့်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Event-Driven Architecture with SaaS:** မေးခွန်းတွင် "Integrate 3rd-party SaaS such as Datadog, Zendesk with AWS Lambda without custom polling" ဆိုပါက အမြဲတမ်း **Amazon EventBridge** ဖြစ်သည်။
- **Content-Based Filtering on JSON:** SNS Filter Policy မလုံလောက်ဘဲ JSON body ထဲရှိ specific key-value complex patterns များကို စစ်ချင်ပါက **EventBridge Rules** ကို ရွေးချယ်ပါ။
- **Scheduled Tasks:** "Run a Lambda function every night at 2:00 AM" ဆိုပါက **EventBridge Scheduler (Cron)** ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် AWS အကောင့်ပေါင်းများစွာရှိပြီး Security Compliance အတွက် မည်သည့် Account တွင်မဆို IAM Access Key အသစ် generate လုပ်လိုက်ပါက Central Security Account သို့ ချက်ချင်းအကြောင်းကြားကာ audit ပြုလုပ်လိုသည်။ အနည်းဆုံး operational overhead ဖြင့် မည်သို့ ပြုလုပ်သင့်သနည်း?
>
> **အဖြေမှန်:** အကောင့်တစ်ခုချင်းစီရှိ Default EventBridge Bus ပေါ်တွင် IAM `CreateAccessKey` API call အတွက် Rule တစ်ခု ဖန်တီးပါ။ Target အဖြစ် Central Security Account ရှိ **Central EventBridge Bus** သို့ events များကို cross-account route ပေးပို့ပါ။ ထိုဗဟို Bus မှတစ်ဆင့် Lambda function သို့မဟုတ် SNS ဖြင့် audit ဆောင်ရွက်ပါ။

### ❓ SAA-C03 Mini Quiz:

**Q1: Amazon EventBridge နှင့် ယခင် CloudWatch Events တို့၏ အဓိက ကွာခြားချက်မှာ အဘယ်နည်း?**
- A) EventBridge တွင် Third-Party SaaS partner integrations, Schema Registry နှင့် Event Replay များ ပါဝင်လာခြင်း
- B) EventBridge သည် Cron scheduling မလုပ်နိုင်တော့ခြင်း
- C) CloudWatch Events သည် JSON မသုံးနိုင်ခြင်း
- D) EventBridge သည် Serverless မဟုတ်တော့ခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: A</b> — EventBridge သည် CloudWatch Events အပေါ် အခြေခံပြီး Partner Event Buses, Schema Registry, Archive & Replay စသည့် အဆင့်မြင့် စွမ်းဆောင်ရည်များ ဖြည့်စွက်ထားခြင်း ဖြစ်ပါသည်။</details>

**Q2: အပလီကေးရှင်းတစ်ခုတွင် အရေးကြီးသော payload events များကို အချိန် ၃ လကြာ archive လုပ်ထားပြီး လိုအပ်ပါက ယခင် past events များကို test environment သို့ ပြန်လည်စမ်းသပ် run လိုပါသည်။ မည်သည့် feature ကို အသုံးပြုသင့်သနည်း?**
- A) S3 Glacier Flexible Retrieval
- B) EventBridge Archive and Replay
- C) SQS FIFO Dead-Letter Queue
- D) CloudWatch Logs Insights
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — EventBridge Archive & Replay feature သည် events များကို သိမ်းဆည်းထားပြီး သတ်မှတ်ကာလအတွင်း ပြန်လည် replay ပေးပို့နိုင်ပါသည်။</details>

**Q3: EC2 Instance တစ်ခု state ပြောင်းသွားချိန်တွင် EventBridge Rule က target Lambda function ကို trigger မလုပ်နိုင်ဘဲ CloudWatch တွင် FailedInvocations metric တက်နေပါသည်။ အဖြစ်အများဆုံး အကြောင်းရင်းမှာ အဘယ်နည်း?**
- A) EventBridge Rule တွင် Target Lambda function ကို invoke ခေါ်ယူရန် resource permission မရှိခြင်း
- B) EC2 instance ကို Multi-AZ တွင် မထားရှိခြင်း
- C) Event payload size သည် 10 KB ကျော်သွားခြင်း
- D) SQS Queue မရှိခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: A</b> — Lambda function ၏ Resource Policy တွင် EventBridge rule ARN မှ `lambda:InvokeFunction` ခွင့်မပြုထားပါက FailedInvocations ဖြစ်ပေါ်တတ်ပါသည်။</details>
