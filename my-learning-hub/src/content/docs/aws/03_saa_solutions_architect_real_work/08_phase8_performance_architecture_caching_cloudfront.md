---
title: "Phase 8 — Performance Architecture (Caching, CloudFront & Optimization)"
description: "Architect Perspective: SAA-C03 ၏ Domain 3 (Design High-Performing Architectures - 24%) တွင် Storage, Compute, Database, Networking အလွှာတိုင်းတွင် စွမ်းဆောင်ရည်"
---

## Phase 8 — Performance Architecture (Caching, CloudFront & Optimization)

> **Architect Perspective:** SAA-C03 ၏ Domain 3 (Design High-Performing Architectures - 24%) တွင် Storage, Compute, Database, Networking အလွှာတိုင်းတွင် စွမ်းဆောင်ရည် အမြင့်မားဆုံးဖြစ်အောင် Caching နှင့် Content Delivery ကို မည်သို့ အသုံးချရမည်ကို အဓိကထား မေးမြန်းသည်။

---

## ၈.၁ In-Memory Caching: Amazon ElastiCache (Redis vs Memcached)

Application မှ Database သို့ သွားသော Query ဝန်ပိမှုကို လျှော့ချပြီး Latency ကို Microsecond အဆင့်သို့ လျှော့ချရန် RAM ပေါ်တွင် Cache လုပ်ခြင်း ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                        CACHE-ASIDE PATTERN (LAZY LOADING)                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                   1. Check Cache                                                  |
|   [App Server] -----------------------> [ElastiCache Redis]                       |
|        |                                        |                                 |
|        |                                        | 2. Cache Miss! (Data မရှိပါ)     |
|        |                                        v                                 |
|        +--------------------------------> [Amazon RDS Database]                   |
|                   3. Fetch from DB & Write back to Cache                          |
|                                                                                   |
|  - Cache Hit: ရှာဖွေသော Data သည် Cache ထဲတွင် ရှိနေသဖြင့် DB သို့ မသွားဘဲ ချက်ချင်းရသည်|
|  - Cache Miss: Cache ထဲတွင် မရှိသဖြင့် DB ထံမှ သွားယူပြီး Cache ထဲ ထည့်ရသည်          |
|  - TTL (Time-To-Live): Cache ထဲရှိ Data ၏ သက်တမ်း (ဥပမာ 300s ပြီးလျှင် Expire ဖြစ်သည်)|
|  - Cache Invalidation: DB ထဲရှိ Data ပြောင်းသွားပါက Cache အဟောင်းကို ဖျက်ပစ်ခြင်း     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Redis vs Memcached နှိုင်းယှဉ်ချက်
- **Amazon ElastiCache for Redis:** Complex Data Types (Sorted sets for leaderboards), **Multi-AZ with Auto-Failover**, Read Replicas, Persistent Snapshots, Pub/Sub ပါဝင်သည်။ *(Production Standard)*
- **Amazon ElastiCache for Memcached:** ရိုးရှင်းသော Key-Value Strings သာ ရသည်။ Pure In-Memory ဖြစ်ပြီး Multi-AZ, Persistence မပါဝင်ပါ။

---

## ၈.၂ Amazon CloudFront (Content Delivery Network - CDN)

CloudFront သည် ကမ္ဘာအနှံ့ရှိ Edge Locations (PoPs) ၄၀၀ ကျော်တွင် Static နှင့် Dynamic Web Content များကို Cache လုပ်ပေးသော ကမ္ဘာလုံးဆိုင်ရာ CDN Service ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                           CLOUDFRONT ARCHITECTURE FLOW                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   [Global Users]                                                                  |
|         |                                                                         |
|         v                                                                         |
|   +---------------------------------------------------------------------------+   |
|   | Amazon CloudFront Distribution (Edge Location Caching - Low Latency)      |   |
|   +---------------------------------------------------------------------------+   |
|         |                                                 |                       |
|         | (Static Assets: Images/JS/CSS)                  | (Dynamic API Requests)|
|         v                                                 v                       |
|   +-----------------------+                     +-----------------------+         |
|   | Origin 1: S3 Bucket   |                     | Origin 2: ALB / EC2   |         |
|   | (Origin Access Control|                     | (Dynamic Backend API) |         |
|   |  - OAC Protected)     |                     +-----------------------+         |
|   +-----------------------+                                                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဓိက CloudFront သဘောတရားများ:
- **Distribution:** CloudFront ၏ Configuration Unit (Domain Name ထုတ်ပေးသည်)။
- **Origin:** မူရင်းဖိုင်များ တည်ရှိရာနေရာ (S3 Bucket, ALB, EC2 သို့မဟုတ် On-premises Server)။
- **Origin Access Control (OAC):** S3 Bucket ကို Public ဖွင့်စရာမလိုဘဲ CloudFront မှတစ်ဆင့်သာ လုံခြုံစွာ ဝင်ရောက်ခွင့်ပေးသော ခေတ်သစ် Best Practice (OAI အဟောင်းနေရာတွင် အစားထိုးသည်)။
- **Cache Policy:** Header, Cookie, Query String များအပေါ် မူတည်၍ Cache လုပ်မည့် အချိန် (TTL) ကို ထိန်းချုပ်ခြင်း။

---

## ၈.၃ Performance Optimization Scenario: "Website Slow ဖြစ်နေတယ်! ဘယ်လို စဉ်းစားမလဲ?"

Architect တစ်ဦးအနေဖြင့် စနစ်တစ်ခု နှေးကွေးနေပါက အောက်ပါ End-to-End Flow အတိုင်း အလွှာအလိုက် စနစ်တကျ စစ်ဆေးရမည်-

```
+-----------------------------------------------------------------------------------+
|                     STEP-BY-STEP PERFORMANCE DIAGNOSIS FLOW                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. DNS Layer (Route 53):                                                         |
|     -> User သည် Latency-based Routing ဖြင့် အနီးဆုံး Region သို့ ရောက်နေသလား?     |
|                                                                                   |
|  2. CDN & Edge Layer (CloudFront):                                                |
|     -> Static Assets (Images, Videos, JS) များ CloudFront Cache Hit ဖြစ်နေသလား?   |
|     -> TTL နည်းလွန်းသဖြင့် Origin S3 သို့ ခဏခဏ သွားဆွဲနေရသလား?                     |
|                                                                                   |
|  3. Load Balancer Layer (ALB / NLB):                                              |
|     -> Target Group Response Time တက်နေသလား? (504 Gateway Timeout ဖြစ်နေသလား?)    |
|                                                                                   |
|  4. Compute Layer (EC2 / ECS / ASG):                                              |
|     -> CPU Utilization > 80% ဖြစ်နေသလား? Auto Scaling က အချိန်မီ မတိုးနိုင်ဘူးလား?  |
|     -> Storage IOPS (EBS gp3 Burst) ကုန်နေသလား?                                   |
|                                                                                   |
|  5. Caching Layer (ElastiCache Redis):                                            |
|     -> မကြာခဏ Query လုပ်သော Data များကို Redis တွင် Cache လုပ်ထားသလား?             |
|                                                                                   |
|  6. Database Layer (RDS / Aurora):                                                |
|     -> Slow Queries များ ရှိနေသလား? Read Traffic များပြားနေပါက Read Replicas     |
|        ထပ်တိုးရန် လိုအပ်နေသလား?                                                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [09_Phase9_Resilient_Architecture_and_Decoupling.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/09_Phase9_Resilient_Architecture_and_Decoupling.md)
