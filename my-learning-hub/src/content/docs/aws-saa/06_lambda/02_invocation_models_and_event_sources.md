---
title: "၂။ Invocation Models & Event Sources"
description: "Lambda ခေါ်ဆိုပုံ ၃ မျိုး (Synchronous, Asynchronous, Event-Source Mapping), Automatic Retries, Dead Letter Queue (DLQ) နှင့် Destinations"
---

# ၂။ Invocation Models & Event Sources

## Lambda Invocation Models (ခေါ်ယူအလုပ်လုပ်ပုံ ၃ မျိုး)

AWS Lambda ကို Event များက မည်သို့ လှမ်းခေါ် (Invoke) လုပ်သနည်း ဆိုသည့်အပေါ် မူတည်၍ အမျိုးအစား ၃ မျိုး ကွဲပြားပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Lambda Invocation Models                        │
├───────────────────┬────────────────────────────┬───────────────────────┤
│ Synchronous       │ Asynchronous               │ Event-Source Mapping  │
│ (တိုက်ရိုက်စောင့်ဆိုင်း)│ (နောက်ကွယ်မှ တန်းစီလုပ်သည်)  │ (Queue/Stream မှ ဆွဲယူ)│
├───────────────────┼────────────────────────────┼───────────────────────┤
│ • Client က Response│ • Lambda က Event ကို လက်ခံပြီး│ • Lambda က Queue ထဲသို့ │
│   ချက်ချင်း ရရှိရန်  │   **202 Accepted** ပြန်ပေးကာ │   Polling အမြဲဆွဲပြီး  │
│   စောင့်နေသည်       │   နောက်ကွယ်မှ တိတ်တဆိတ် run သည်│   Batch လိုက် ခေါ်သည်   │
│ • Services:       │ • Services:                │ • Services:           │
│   - API Gateway   │   - Amazon S3              │   - Amazon SQS        │
│   - ALB           │   - Amazon SNS             │   - DynamoDB Streams  │
│   - Cognito       │   - Amazon EventBridge     │   - Amazon Kinesis    │
│ • Retries:        │ • Retries:                 │ • Retries:            │
│   Client တာဝန်    │   **အလိုအလျောက် ၂ ကြိမ်**      │   Queue သက်တမ်းကုန်သည်│
│                   │   Retry ပြုလုပ်ပေးသည်       │   အထိ ဆက်တိုက် retry သည်│
└───────────────────┴────────────────────────────┴───────────────────────┘
```

---

## Asynchronous Invocation နှင့် Dead Letter Queue (DLQ)

Asynchronous စနစ်တွင် (ဥပမာ- S3 ထဲသို့ ဓာတ်ပုံ Upload လုပ်လိုက်ချိန်တွင် Thumbnail ထုတ်လုပ်မည့် Lambda):
- Lambda သည် Error ဖြစ်ပေါ်ပါက **အလိုအလျောက် ၂ ကြိမ် (စုစုပေါင်း ၃ ကြိမ်)** ပြန်လည် ကြိုးစား (Retry) ပေးပါသည်။
- အကယ်၍ ၃ ကြိမ်စလုံး အလုပ်မဖြစ်ဘဲ ဆက်လက် ပျက်စီးနေပါက ထို Event ဒေတာ ပျောက်ဆုံးမသွားစေရန် **Dead Letter Queue (Amazon SQS / SNS)** သို့မဟုတ် **Lambda Destinations (On-Failure)** သို့ ပို့ဆောင်ပြီး Alert ပေးနိုင်ပါသည်။

---

## Event-Source Mapping (DynamoDB Streams & SQS)

DynamoDB သို့မဟုတ် SQS တွင် Lambda သည် Event အသစ်ရောက်လာခြင်းကို စောင့်ကြည့်ရန် ကိုယ်တိုင် **Poll** လုပ်ပေးပါသည်:
- **Batch Size:** Record များကို တစ်ခုချင်း မခေါ်ဘဲ အများဆုံး ၁၀ ခု သို့မဟုတ် ၁၀၀ ခု စုစည်း၍ တစ်ပြိုင်နက် Batch အနေဖြင့် Lambda ထံသို့ ပေးပို့သဖြင့် စရိတ်နှင့် အချိန်ကို အလွန်ချွေတာပေးပါသည်။
