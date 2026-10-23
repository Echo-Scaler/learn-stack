---
title: "Feature 2: Amazon ECS — Feature Titles & Usage Overview"
description: "ECS ကို AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ AWS Deployment တွင် အသုံးချနိုင်အောင် အခြေခံမှ လက်တွေ့အထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# Feature 2: Amazon ECS ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Container Infrastructure လမ်းညွှန်

ECS ကို AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ AWS Deployment တွင် ထိရောက်စွာ အသုံးချနိုင်စေရန် အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ အသုံးချပုံ (Usages) များကို အဆင့်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ ECS ဆိုတာဘာလဲ & Architecture**](/aws-saa/02_ecs/01_ecs_overview_and_architecture/) | Docker, ECR, ECS, Fargate/EC2, CloudWatch | Laravel API Container ကို ECR မှတစ်ဆင့် Multi-AZ ECS Tasks များအဖြစ် ALB ဖြင့် ဖြန့်ကြက်ခြင်း |
| **02** | [**၂။ ECS ရဲ့ Key Components များ**](/aws-saa/02_ecs/02_ecs_key_components/) | Cluster, Task Definition, Task, Service, Container, IAM, ALB | Restaurant POS System အတွက် Cluster သတ်မှတ်ခြင်း၊ Blueprint ရေးဆွဲခြင်းနှင့် Desired Count ထိန်းသိမ်းခြင်း |
| **03** | [**၃။ Containers ရဲ့ အားသာချက်များ & VM နှိုင်းယှဉ်ချက်**](/aws-saa/02_ecs/03_containers_advantages_and_vm_comparison/) | Consistency, Fast Deployment, Scalability, Isolation, Recovery | Dev/Prod Environment တူညီစေခြင်း၊ Task အမြန်တိုးချဲ့ခြင်းနှင့် Host OS Kernel မျှဝေသုံးစွဲပုံ |
| **04** | [**၄။ ECS Deployment Models**](/aws-saa/02_ecs/04_ecs_deployment_models/) | Rolling, Blue/Green, Canary, Linear Deployment | POS API ဗားရှင်းသစ်များကို Zero-Downtime ဖြင့် Deploy လုပ်ခြင်းနှင့် စွန့်စားမှုနည်းပါးစေရန် Traffic စမ်းသပ်ခြင်း |
| **05** | [**၅။ ECS Monitoring နဲ့ Troubleshooting**](/aws-saa/02_ecs/05_ecs_monitoring_and_troubleshooting/) | CloudWatch Metrics, Logs, Container Insights, CloudTrail | CPU/RAM သုံးစွဲမှု၊ Task crash စစ်ဆေးခြင်း၊ ALB Target Health နှင့် POS API Incident ဖြေရှင်းနည်း Runbook |
| **06** | [**၆။ ECS Compute Models & POS Architecture**](/aws-saa/02_ecs/06_ecs_compute_models_and_pos_architecture/) | AWS Fargate, Amazon EC2, ECS Managed Instances | Serverless Fargate ဖြင့် Server စီမံခန့်ခွဲမှု လျှော့ချခြင်းနှင့် RDS, Secrets Manager ပါဝင်သော Production Architecture |
| **07** | [**၇။ ကိုယ့်ကိုယ်ကို စမ်းသပ်ကြည့်ပါ & နောက်ဆုံး အနှစ်ချုပ်**](/aws-saa/02_ecs/07_ecs_self_test_quiz_and_summary/) | Interactive Self-Test Quiz (မေးခွန်း ၄ ခု) နှင့် အနှစ်ချုပ် | SAA-C03 စာမေးပွဲအတွက် မဖြစ်မနေ သိရမည့် အခြေခံစည်းမျဉ်း ၈ ချက်နှင့် Official Docs References |
