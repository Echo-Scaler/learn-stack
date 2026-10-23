---
title: "၁။ ECS ဆိုတာဘာလဲ & Architecture"
description: "AWS ECS (Elastic Container Service) မိတ်ဆက်၊ Docker, ECR, EC2, Fargate, CloudWatch ခွဲခြားနားလည်ခြင်းနှင့် Laravel API Production Architecture Flow"
---

# ၁။ ECS ဆိုတာဘာလဲ။

> **Official Documentation:** [Amazon Elastic Container Service](https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/amazon-elastic-container-service.html?utm_source=chatgpt.com)

**ECS = Amazon Elastic Container Service**

AWS ECS ဆိုတာ Docker containers တွေကို AWS ပေါ်မှာ run လုပ်ဖို့၊ manage လုပ်ဖို့၊ scale လုပ်ဖို့ အသုံးပြုတဲ့ **Container Orchestration Service** ဖြစ်ပါတယ်။

---

## ခွဲခြားနားလည်ရမည့် အခြေခံ Features များနှင့် ၎င်းတို့၏ Usage

- **Docker** — Application ကို container image အဖြစ် တည်ဆောက်ဖို့ (Build Tool)။
- **ECR (Elastic Container Registry)** — Container images တွေ သိမ်းထားဖို့ (Private Registry)။
- **ECS** — Containers တွေ ဘယ်နေရာမှာ၊ ဘယ်နှခု run မလဲဆိုတာ စီမံဖို့ (Orchestrator)။
- **EC2 / AWS Fargate** — Containers တွေ အမှန်တကယ် run နိုင်ဖို့ compute resources ပေးဖို့ (Compute Capacity)။
- **CloudWatch** — Application နဲ့ infrastructure ရဲ့ logs, metrics တွေကို စောင့်ကြည့်ဖို့ (Monitoring & Observability)။

---

## လက်တွေ့ Usage ဥပမာ — Laravel API တစ်ခုကို AWS ECS ပေါ်တင်ခြင်း

```text
Developer
Laravel Code → Docker Image
      ↓
Amazon ECR
Docker Image သိမ်းဆည်းထားခြင်း
      ↓
Amazon ECS
Service က Task များကို စီမံခြင်း
┌──────────────┬──────────────┐
│    Task 1    │    Task 2    │
└──────────────┴──────────────┘
      ↑
Application Users
ALB မှတစ်ဆင့် API ကို အသုံးပြုခြင်း
```

### High Availability (HA) အတွက် အရေးကြီးချက်:
ဒီဥပမာမှာ Task 2 ခုက Application ကို တစ်ပြိုင်နက် run ထားပေးနိုင်တာကြောင့် request အများကြီးကို ကိုင်တွယ်နိုင်ပါတယ်။ ဒါပေမဲ့ Task 2 ခုထားရုံနဲ့ High Availability အပြည့်အဝ မရသေးပါဘူး။ **Availability Zones (AZs)** မတူတဲ့နေရာတွေမှာ ဖြန့်ချထားဖို့နဲ့ **Load Balancer (ALB)** ကို မှန်ကန်စွာ configure လုပ်ဖို့လည်း လိုပါတယ်။
