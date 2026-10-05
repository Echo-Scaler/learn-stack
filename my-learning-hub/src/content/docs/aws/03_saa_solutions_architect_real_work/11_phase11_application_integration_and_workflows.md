---
title: "Phase 11 — Application Integration & Workflows"
description: "Architect Perspective: Microservices နှင့် Event-driven စနစ်များတွင် Component တစ်ခုချင်းစီကို တိုက်ရိုက်ခေါ်ဆိုခြင်းထက် Central Event Bus နှင့် Visual Orchestr"
---

## Phase 11 — Application Integration & Workflows

> **Architect Perspective:** Microservices နှင့် Event-driven စနစ်များတွင် Component တစ်ခုချင်းစီကို တိုက်ရိုက်ခေါ်ဆိုခြင်းထက် Central Event Bus နှင့် Visual Orchestration Workflows များကို အသုံးပြုခြင်းဖြင့် စနစ်၏ ရေရှည်ခံနိုင်ရည်နှင့် ပြုပြင်ထိန်းသိမ်းရ လွယ်ကူမှုကို ရရှိစေသည်။

---

## ၁၁.၁ Application Integration Core Suite

```
+-----------------------------------------------------------------------------------+
|                        APPLICATION INTEGRATION SERVICES                           |
+-----------------------------------------------------------------------------------+
|  1. Amazon SQS: Pull-based Point-to-point Message Buffering                       |
|  2. Amazon SNS: Push-based Pub/Sub Topic Fan-out                                  |
|  3. Amazon EventBridge: Declarative Event Routing with Filtering Rules            |
|  4. AWS Step Functions: Complex Multi-step State Machine Orchestration            |
|  5. Amazon API Gateway: REST/HTTP API Exposure to Clients                         |
|  6. AWS Lambda: Event Processing & Business Logic Execution                       |
+-----------------------------------------------------------------------------------+
```

---

## ၁၁.၂ Real Event-Driven Scenario: Order Processing Pipeline

```
+-----------------------------------------------------------------------------------+
|                     EVENTBRIDGE EVENT-DRIVEN E-COMMERCE FLOW                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                               +------------------+                                |
|                               | User Places Order|                                |
|                               +------------------+                                |
|                                        |                                          |
|                                        v                                          |
|                    +---------------------------------------+                      |
|                    | Amazon EventBridge (Default Event Bus)|                      |
|                    +---------------------------------------+                      |
|                           /            |            \                             |
|       Rule: "Payment"    /             |             \   Rule: "Notification"     |
|                         /  Rule:       |              \                           |
|                        v   "Inventory" v               v                          |
|                 +-----------+   +-------------+   +--------------+                |
|                 |  Payment  |   |  Inventory  |   | Notification |                |
|                 |  Service  |   |   Service   |   |   Service    |                |
|                 | (Lambda)  |   |    (ECS)    |   |  (SNS Topic) |                |
|                 +-----------+   +-------------+   +--------------+                |
|                                                          |                        |
|                                                   +------+------+                 |
|                                                   |             |                 |
|                                                   v             v                 |
|                                              [Send SMS]   [Send Email]            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အကျိုးကျေးဇူး:
- Service တစ်ခုနှင့် တစ်ခု အချင်းချင်း သိရှိစရာမလိုဘဲ EventBridge ပေါ်ရှိ Event JSON ကိုသာ စောင့်ကြည့်ကြသည်။
- အနာဂတ်တွင် "Fraud Detection Service" အသစ် ထပ်တိုးလိုပါက မူလ Code များကို မပြင်ဘဲ EventBridge တွင် Rule အသစ်တစ်ခု ထပ်ထည့်ရုံသာ ဖြစ်သည်။

---

## ၁၁.၃ AWS Step Functions (State Machine Workflows)

Distributed Microservices များတွင် ငွေပေးချေမှု မအောင်မြင်ပါက ကုန်ပစ္စည်းစာရင်းကို ပြန်လည် ညှိပေးရသော **Compensating Transactions (Saga Pattern)** ကို Step Functions ဖြင့် Visual အနေဖြင့် တည်ဆောက်နိုင်သည်။

```
+-----------------------------------------------------------------------------------+
|                          STEP FUNCTIONS STATE MACHINE                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   [Start] ---> [Check Inventory]                                                  |
|                      |                                                            |
|          +-----------+-----------+                                                |
|          | (In Stock)            | (Out of Stock)                                 |
|          v                       v                                                |
|   [Charge Payment]          [Cancel Order & End]                                  |
|          |                                                                        |
|   +------+------+                                                                 |
|   | (Success)   | (Card Declined)                                                 |
|   v             v                                                                 |
| [Ship Goods]  [Rollback Inventory (Compensate)] ---> [Notify User]                |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [12_Phase12_Monitoring_Operations_and_AWS_SSM.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/12_Phase12_Monitoring_Operations_and_AWS_SSM.md)
