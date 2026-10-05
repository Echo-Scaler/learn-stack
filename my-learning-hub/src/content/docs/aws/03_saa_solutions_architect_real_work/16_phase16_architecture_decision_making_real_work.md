---
title: "Phase 16 — Architecture Decision Making (Real-World Genba Scenarios)"
description: "Architect Perspective: ဤအပိုင်းသည် စာမေးပွဲထက် တကယ့် Production IT လုပ်ငန်းခွင်အတွက် ပိုမို အရေးကြီးပါသည်။ Requirement တစ်ခု လာသည့်အခါ အဘယ်ကြောင့် ဤ Service ကို"
---

## Phase 16 — Architecture Decision Making (Real-World Genba Scenarios)

> **Architect Perspective:** ဤအပိုင်းသည် စာမေးပွဲထက် တကယ့် Production IT လုပ်ငန်းခွင်အတွက် ပိုမို အရေးကြီးပါသည်။ Requirement တစ်ခု လာသည့်အခါ အဘယ်ကြောင့် ဤ Service ကို ရွေးချယ်ပြီး အခြား Service ကို ပယ်ဖျက်ရသနည်း (Trade-off Rationale) ကို တိကျစွာ အကြောင်းပြချက် ပေးနိုင်ရမည်။

---

## ၁၆.၁ Real Production Architecture Challenge

### လုပ်ငန်း လိုအပ်ချက် (Client Requirements):
- **စနစ်အမျိုးအစား:** E-Commerce Online Shopping Website
- **သုံးစွဲသူအရေအတွက်:** နေ့စဉ် အသုံးပြုသူ ၁ သိန်း (100,000 Users)
- **အဓိက လုပ်ဆောင်ချက်:** ကုန်ပစ္စည်း ဓာတ်ပုံများစွာ တင်နိုင်ရမည် (High Image Uploads)
- **ရရှိနိုင်မှု လိုအပ်ချက်:** စနစ် လုံးဝ မပြိုလဲစေရ (Highly Available)
- **ဘတ်ဂျက် ကန့်သတ်ချက်:** ငွေကြေး ကုန်ကျစရိတ်ကို အတတ်နိုင်ဆုံး ချွေတာရမည် (Budget Constrained)

---

## ၁၆.၂ Architect's Decision Breakdown: "ဘာကြောင့် ဒီ Service ကို ရွေးတာလဲ?"

```
+-----------------------------------------------------------------------------------+
|                        ARCHITECTURAL DECISION MATRIX                              |
+-----------------------------------------------------------------------------------+
|  Component         |  ရွေးချယ်မှု       |  ပယ်ဖျက်ခဲ့သော Option |  ရွေးချယ်ရသည့် အကြောင်းပြချက် (Why?)   |
+--------------------+------------------+---------------------+-------------------------------------+
|  Compute           |  **Amazon ECS    |  EC2 Standalone     |  EC2 ထက် Container (Fargate) သည်   |
|                    |   (Fargate)**    |                     |  OS Patching စရာမလိုဘဲ အလိုအလျောက်  |
|                    |                  |                     |  Scale Out/In လုပ်နိုင်သဖြင့် စရိတ်သက်သာ|
+--------------------+------------------+---------------------+-------------------------------------+
|  Database Engine   |  **Amazon Aurora |  Self-hosted MySQL  |  Aurora Serverless v2 သည် Traffic   |
|                    |   Serverless v2**|  on EC2             |  နည်းချိန်တွင် ACU လျှော့ချသဖြင့်    |
|                    |                  |                     |  စရိတ်သက်သာပြီး 3 AZs HA ပါဝင်သည်   |
+--------------------+------------------+---------------------+-------------------------------------+
|  Storage for Images|  **Amazon S3     |  Amazon EFS         |  EFS သည် $0.30/GB ဖြစ်ပြီး S3 သည်  |
|                    |   Standard +     |                     |  $0.023/GB သာရှိသဖြင့် S3 က ၁၃ ဆ   |
|                    |   Lifecycle**    |                     |  စရိတ်သက်သာသည်။ 11 9's durability ရ|
+--------------------+------------------+---------------------+-------------------------------------+
|  Load Balancer     |  **Application   |  Network LB (NLB)   |  HTTP/HTTPS Layer 7 ဖြစ်ပြီး        |
|                    |   LB (ALB)**     |                     |  Path-based Routing (`/api`, `/cart`)|
|                    |                  |                     |  နှင့် AWS WAF ပူးတွဲသုံးနိုင်သောကြောင့်|
+--------------------+------------------+---------------------+-------------------------------------+
|  Edge Delivery     |  **Amazon        |  Direct S3 Access   |  S3 မှ Data ထွက်ခထက် CloudFront     |
|                    |   CloudFront**   |                     |  Caching ခ သက်သာပြီး User များထံ    |
|                    |                  |                     |  Millisecond latency ဖြင့် ပို့နိုင်သည်|
+--------------------+------------------+---------------------+-------------------------------------+
|  Session & Caching |  **ElastiCache   |  Disk Caching       |  User ၁ သိန်း၏ Shopping Cart        |
|                    |   Redis**        |                     |  Session ကို In-Memory သိမ်းဆည်း    |
|                    |                  |                     |  သဖြင့် DB ဝန်ပိမှုကို ၈၀% လျှော့ချသည်|
+--------------------+------------------+---------------------+-------------------------------------+
|  Order Buffering   |  **Amazon SQS    |  Direct Synchronous |  Flash Sale ကာလတွင် အော်ဒါများကို    |
|                    |   Queue**        |  DB Writes          |  SQS တွင် Buffer လုပ်ထားသဖြင့်       |
|                    |                  |                     |  DB ပျက်ကျခြင်း လုံးဝ မဖြစ်နိုင်တော့ပါ|
+--------------------+------------------+---------------------+-------------------------------------+
|  High Availability |  **Multi-AZ      |  Single AZ          |  AZ တစ်ခု မီးပျက်သော်လည်း အခြား AZ က|
|                    |   (2 AZs Deploy)**|                    |  ချက်ချင်း တာဝန်ယူနိုင်သည်           |
+--------------------+------------------+---------------------+-------------------------------------+
```

---

## ၁၆.၃ Complete E-Commerce Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                        OPTIMAL E-COMMERCE ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                              [Global Web Users]                                   |
|                                       |                                           |
|                                       v                                           |
|                        +-----------------------------+                            |
|                        |   Amazon Route 53 (DNS)     |                            |
|                        +-----------------------------+                            |
|                                       |                                           |
|                                       v                                           |
|                        +-----------------------------+                            |
|                        | Amazon CloudFront + AWS WAF |                            |
|                        +-----------------------------+                            |
|                                /             \                                    |
|         (Static Images / CSS) /               \ (Dynamic API Requests)            |
|                              v                 v                                  |
|                      +---------------+  +-------------------------------+         |
|                      |   Amazon S3   |  | Application Load Balancer(ALB)|         |
|                      +---------------+  +-------------------------------+         |
|                                                        |                          |
|                               +------------------------+                          |
|                               | (Multi-AZ Private Subnets)                        |
|                               v                                                   |
|                      +-------------------------------+                            |
|                      |  Amazon ECS Fargate Web App   |                            |
|                      |  (Auto Scaling Min:2, Max:10) |                            |
|                      +-------------------------------+                            |
|                              /        |          \                                |
|        (Cache Session)      /         |           \ (Buffer Orders)               |
|                            v          |            v                              |
|           +---------------------+     |     +--------------------+                |
|           | ElastiCache (Redis) |     |     |  Amazon SQS Queue  |                |
|           +---------------------+     |     +--------------------+                |
|                                       v              |                            |
|                      +------------------------+      v                            |
|                      | Amazon Aurora MySQL v2 |<-- [Worker Fargate]               |
|                      | (Multi-AZ Serverless)  |                                   |
|                      +------------------------+                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [17_Phase17_SAA_Service_Comparison_Training.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/17_Phase17_SAA_Service_Comparison_Training.md)
