---
title: "Phase 9 — Resilient Architecture & Decoupling"
description: "Architect Perspective: SAA-C03 ၏ Domain 2 (Design Resilient Architectures - 26%) တွင် Scalable Loosely Coupled Architecture နှင့် High Availability / Fault Tole"
---

## Phase 9 — Resilient Architecture & Decoupling

> **Architect Perspective:** SAA-C03 ၏ Domain 2 (Design Resilient Architectures - 26%) တွင် Scalable Loosely Coupled Architecture နှင့် High Availability / Fault Tolerance စနစ်များကို မေးမြန်းသည်။ Tight Coupling (တင်းကျပ်စွာ ဆက်နွှယ်မှု) မှ Loose Coupling (လွတ်လပ်စွာ ဆက်သွယ်မှု) သို့ ပြောင်းလဲနိုင်ခြင်းသည် ခေတ်မီ Cloud Architect တစ်ဦး၏ အဓိက အရည်အချင်း ဖြစ်သည်။

---

## ၉.၁ High Availability & Fault Tolerance မဏ္ဍိုင်များ

- **Multi-AZ Redundancy:** Server သို့မဟုတ် Database တစ်ခုတည်း မထားဘဲ အနည်းဆုံး AZ ၂ ခု သို့မဟုတ် ၃ ခုတွင် ခွဲခြား တည်ဆောက်ခြင်း။
- **Health Check & Auto-Recovery:** အလုပ်မလုပ်တော့သော Server များကို Auto Scaling နှင့် Load Balancer တို့က အလိုအလျောက် ဖယ်ရှားပြီး အသစ် ပြန်ဆောက်ပေးခြင်း။
- **Failover:** Primary စနစ် ပျက်စီးသွားချိန်တွင် Secondary Standby သို့ အလိုအလျောက် ချောမောစွာ ကူးပြောင်းနိုင်ခြင်း။

---

## ၉.၂ Tight Coupling vs Loose Coupling (အရေးကြီးဆုံး သဘောတရား)

```
+-----------------------------------------------------------------------------------+
|                        TIGHT COUPLING VS LOOSE COUPLING                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [TIGHT COUPLING (အလွန် အန္တရာယ်များသော ပုံစံ)]                                     |
|  [Web App A] --------> [Payment App B] --------> [Invoice App C]                  |
|  - App B သို့မဟုတ် App C နှေးကွေးခြင်း သို့မဟုတ် Down သွားပါက App A ပါ ရပ်တန့်သွားမည် |
|  - Single Point of Failure (SPOF) ဖြစ်ပြီး Traffic မြင့်တက်လာပါက ပြိုလဲသွားနိုင်သည်|
|                                                                                   |
|  ===============================================================================  |
|                                                                                   |
|  [LOOSE COUPLING (ခေတ်မီ အကြမ်းခံသော ပုံစံ)]                                       |
|  [Web App A] --------> [Amazon SQS Queue] --------> [Worker Apps (Auto-Scaling)]  |
|  - App A သည် Message ကို SQS ထဲသို့ ထည့်ပြီး ချက်ချင်း အလုပ်ပြီးသည်               |
|  - Worker များ Down သွားလျှင်ပင် SQS က Message များကို လုံခြုံစွာ သိမ်းထားပေးသည်   |
|  - Worker ပြန်တက်လာချိန် သို့မဟုတ် Worker အရေအတွက် တိုးလိုက်ချိန်တွင် ပုံမှန် ပြန်လည်|
|    အလုပ်လုပ်နိုင်သည် (Data လုံးဝ မဆုံးရှုံးပါ)                                      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## ၉.၃ Messaging Services: SQS, SNS & EventBridge

```
+-----------------------------------------------------------------------------------+
|                        MESSAGING SERVICES TRIO MATRIX                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. Amazon SQS (Simple Queue Service - 1 to 1 Pull Model):                        |
|     - Producer က Message ပို့ပြီး Consumer က Poll လုပ်ကာ ဆွဲယူဖတ်ရှုသည်             |
|     - Standard Queue: Unlimited Throughput, At-least-once delivery, Best-effort   |
|     - FIFO Queue (`.fifo`): Strict First-In First-Out, Exactly-once processing    |
|     - Visibility Timeout: Consumer က ဖတ်နေစဉ် အခြားသူများ မမြင်အောင် ခေတ္တဖုံးထားခြင်း |
|     - Dead-Letter Queue (DLQ): ၅ ကြိမ် Process မအောင်မြင်သော Message များ သိမ်းရန် |
|     - Long Polling (WaitTimeSeconds > 0): စက္ကန့် ၂၀ စောင့်ဆိုင်းစေပြီး စရိတ်ချွေတာခြင်း|
|                                                                                   |
|  2. Amazon SNS (Simple Notification Service - 1 to Many Push Fan-out):            |
|     - Publisher က Topic တစ်ခုသို့ ပို့ပြီး Subscriber အားလုံးဆီသို့ တပြိုင်နက် Push |
|     - Subscribers: SQS Queues, Lambda Functions, HTTP Endpoints, Email, SMS       |
|     - Fan-out Pattern: Order တစ်ခုတည်းကို Shipping, Billing, Analytics queues များ|
|       သို့ တပြိုင်နက် ပို့ဆောင်ပေးခြင်း                                             |
|                                                                                   |
|  3. Amazon EventBridge (Enterprise Event Bus):                                    |
|     - JSON Events များကို Schema Registry နှင့် Rules များဖြင့် စစ်ဆေး လမ်းကြောင်းပြ|
|     - AWS Services (EC2 state change, S3 upload), SaaS Apps (Salesforce) နှင့်     |
|       Scheduled Cron Jobs များကို Targets များဆီသို့ ပို့ဆောင်ပေးသည်                |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [10_Phase10_Serverless_Architecture_Lambda_APIGateway.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/10_Phase10_Serverless_Architecture_Lambda_APIGateway.md)
