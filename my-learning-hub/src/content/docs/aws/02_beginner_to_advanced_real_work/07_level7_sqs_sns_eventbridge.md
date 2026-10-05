---
title: "၀၇။ Level 7 — Asynchronous & Event-Driven Architecture (SQS, SNS, EventBridge)"
description: "AWS SQS သည် Microservices၊ Distributed Systems များနှင့် Serverless Applications များ အကြားတွင် Message များကို ပျောက်ပျက်မသွားစေဘဲ ခေတ္တထိန်းသိမ်း Buffer လုပ်ပ"
---

## ၀၇။ Level 7 — Asynchronous & Event-Driven Architecture (SQS, SNS, EventBridge)

---

## ၇.၁ AWS SQS (Simple Queue Service) & Decoupling

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
AWS SQS သည် Microservices၊ Distributed Systems များနှင့် Serverless Applications များ အကြားတွင် Message များကို ပျောက်ပျက်မသွားစေဘဲ ခေတ္တထိန်းသိမ်း Buffer လုပ်ပေးထားသော **Fully Managed Message Queue Service** ဖြစ်သည်။

### ၂. ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Decoupling Architecture)
- **Synchronous Tight Coupling ၏ ပြဿနာ:**  
  User က "Place Order" ခလုတ်နှိပ်သည့်အခါ Web Server သည် (၁) ကတ်ဖြတ်ခြင်း၊ (၂) အတည်ပြု Email ပို့ခြင်း၊ (၃) PDF Invoice ထုတ်ခြင်း၊ (၄) Inventory စာရင်းရှင်းခြင်း ၄ ခုလုံးကို တန်းစီပြီး တိုက်ရိုက်လုပ်သည်။ Email Server နှေးကွေးပါက User သည် ၁၀ စက္ကန့်ကြာ Loading စောင့်ဆိုင်းရပြီး တစ်ခုခု Error ဖြစ်ပါက Order တစ်ခုလုံး Fail သွားသည်။
- **SQS Asynchronous ဖြင့် ဖြေရှင်းချက်:**  
  Web Server သည် Order အချက်အလက်ကို SQS ထဲသို့ Message ပစ်ထည့်လိုက်ပြီး User ထံ "Order Placed Successfully" ဟု 0.2 စက္ကန့်အတွင်း Instant Response ပေးလိုက်သည်။ နောက်ကွယ်ရှိ Worker Servers များက SQS ထဲမှ Message ကို အားလပ်သည့်အခါ အေးအေးဆေးဆေး ဖောက်ယူပြီး Email နှင့် PDF ထုတ်ခြင်းကို ဆက်လက်လုပ်ဆောင်သည်။

### ၃. Standard Queue vs FIFO Queue
```
[ Standard Queue ]
- Throughput: အကန့်အသတ်မရှိ (Nearly Unlimited TPS)
- Ordering: Best-effort ordering (အစီအစဉ် အနည်းငယ် လွဲချော်နိုင်သည်)
- Delivery: At-least-once delivery (Message တစ်ခုသည် ၂ ကြိမ် ရောက်သွားနိုင်သဖြင့် Application Code တွင် Idempotent ဖြစ်အောင် ရေးရသည်)

[ FIFO Queue (First-In, First-Out) - နာမည်တွင် .fifo ပါဝင်ရမည် ]
- Throughput: တစ်စက္ကန့်လျှင် Message ၃၀၀ မှ ၃,၀၀၀ အထိ (Batching သုံးပါက ၃,၀၀၀ TPS)
- Ordering: First-In, First-Out တိကျစွာ အစီအစဉ်အတိုင်း သွားသည် (ငွေစာရင်း၊ ဘဏ်လုပ်ငန်း)
- Delivery: Exactly-once processing (Duplicate Deduplication ID ဖြင့် ၂ ခါ မပို့အောင် AWS က အာမခံသည်)
```

### ၄. အလွန်အရေးကြီးသော SQS Parameter များ:
- **Visibility Timeout (Default 30s):** Worker တစ်ခုက Message ကို ဆွဲထုတ်ဖတ်ရှုနေစဉ် အခြား Worker တစ်ခုက ထပ်မံဆွဲယူ၍ မရအောင် ခေတ္တ ဖျောက်ထားပေးသော ကြာချိန်။ Worker က သတ်မှတ်ချိန်အတွင်း မပြီးပါက Message သည် Queue ထဲသို့ အလိုအလျောက် ပြန်ပေါ်လာမည်။
- **Dead Letter Queue (DLQ):** Worker ပေါ်ရှိ Bug ကြောင့် Message တစ်ခုကို အကြိမ်ကြိမ် ဖောက်ဖတ်သော်လည်း Crash ဖြစ်နေပါက အခြား Message များ မပိတ်ဆို့စေရန် ၃ ကြိမ် (MaxReceiveCount) မအောင်မြင်ပါက သီးခြား ဖယ်ထုတ်သိမ်းဆည်းပေးသော စနစ်။
- **Long Polling (WaitTimeSeconds = 20s):** Worker က Queue ထဲ Message ရှိမရှိ လှမ်းမေးသည့်အခါ စက္ကန့် ၂၀ ကြာ စောင့်ဆိုင်းပေးခြင်းဖြင့် မလိုလားအပ်သော Empty API Calls များကို လျှော့ချပြီး ကုန်ကျစရိတ် သက်သာစေသည်။

---

## ၇.၂ AWS SNS (Simple Notification Service) & Fan-Out Pattern

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
AWS SNS သည် Publish/Subscribe (Pub/Sub) ပုံစံဖြင့် Message တစ်ခုတည်းကို လက်ခံသူ အများအပြား (SQS Queues, AWS Lambda, HTTP Webhooks, Email, SMS) ဆီသို့ တစ်ပြိုင်နက်တည်း ဖြန့်ဝေပေးသော **High-Throughput Messaging Service** ဖြစ်သည်။

### ၂. Fan-Out Pattern Architecture Diagram:
```
                              [ User Places Order ]
                                        |
                             [ SNS Topic: New-Order ]
                                        |
       +--------------------------------+--------------------------------+
       | (Filter: All Orders)           | (Filter: Payment Completed)    | (Filter: VIP Users)
       v                                v                                v
[ SQS Inventory Queue ]      [ SQS Invoice Email Queue ]     [ Lambda VIP Promo Function ]
       |                                |
[ Inventory Worker ]           [ Email Worker ]
```

---

## ၇.၃ Amazon EventBridge

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Amazon EventBridge သည် Serverless Event Bus တစ်ခုဖြစ်ပြီး AWS Services များ (ဥပမာ- S3 ထဲ ဖိုင်ရောက်လာခြင်း၊ EC2 State ပြောင်းလဲခြင်း)၊ SaaS Applications (DataDog, GitHub, Stripe) နှင့် ကိုယ်ပိုင် Custom Application Events များကို Event-driven ပုံစံဖြင့် ချိတ်ဆက် စီမံခန့်ခွဲပေးသော စနစ်ဖြစ်သည်။

### ၂. EventBridge Rule ဥပမာ (Cron Schedule & Event Pattern):
- **Schedule Cron:** နေ့စဉ် ဂျပန်စံတော်ချိန် ည ၁၂ နာရီတွင် Database Cleanup လုပ်သော Lambda ကို လှမ်းခေါ်ခြင်း:  
  `cron(0 15 * * ? *)` (UTC 15:00 = JST 24:00).
- **Service Event Pattern:** S3 ထဲသို့ `invoices/` folder အောက် ဖိုင်အသစ် ရောက်လာပါက Lambda သို့ အလိုအလျောက် သတင်းပို့ခြင်း:
```json
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": { "name": ["japan-prod-invoices"] },
    "object": { "key": [{ "prefix": "invoices/" }] }
  }
}
```

---

## ၇.၄ Hands-on Exercise: SQS + SNS Fan-Out တည်ဆောက်ခြင်း

```bash
# ၁။ SNS Topic တည်ဆောက်ခြင်း
TOPIC_ARN=$(aws sns create-topic --name order-events-topic --query TopicArn --output text)

# ၂။ SQS Queue ၂ ခု တည်ဆောက်ခြင်း
INVENTORY_QUEUE_URL=$(aws sqs create-queue --queue-name inventory-queue --query QueueUrl --output text)
EMAIL_QUEUE_URL=$(aws sqs create-queue --queue-name email-queue --query QueueUrl --output text)

INVENTORY_QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url $INVENTORY_QUEUE_URL --attribute-names QueueArn --query Attributes.QueueArn --output text)
EMAIL_QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url $EMAIL_QUEUE_URL --attribute-names QueueArn --query Attributes.QueueArn --output text)

# ၃။ SNS Topic နှင့် SQS Queue များကို Subscribe ချိတ်ဆက်ခြင်း
aws sns subscribe --topic-arn $TOPIC_ARN --protocol sqs --notification-endpoint $INVENTORY_QUEUE_ARN
aws sns subscribe --topic-arn $TOPIC_ARN --protocol sqs --notification-endpoint $EMAIL_QUEUE_ARN

# ၄။ SNS သို့ Message တစ်ခု စမ်းသပ် Publish လုပ်ခြင်း
aws sns publish --topic-arn $TOPIC_ARN --message '{"order_id": "ORD-2026-999", "amount": 25000}'
```

---
*နောက်အခန်းသို့ သွားရန်:* [08_Level8_CloudWatch_CloudTrail_SSM_Security.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/08_Level8_CloudWatch_CloudTrail_SSM_Security.md)
