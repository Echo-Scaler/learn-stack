---
title: "Feature 5: AWS Elastic Beanstalk — Feature Titles & Usage Overview"
description: "AWS Elastic Beanstalk ကို PaaS အခြေခံမှ Web/Worker Tiers၊ Deployment Strategies (Immutable, Rolling), .ebextensions နှင့် SAA-C03 စာမေးပွဲအထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# Feature 5: AWS Elastic Beanstalk ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ PaaS Application Deployment လမ်းညွှန်

AWS Elastic Beanstalk သည် Developer များအနေဖြင့် Infrastructure (EC2, Load Balancers, Auto Scaling, OS) ကို ကိုယ်တိုင် ပြင်ဆင်စီမံစရာမလိုဘဲ Application Source Code ကို တင်လိုက်ရုံဖြင့် အလိုအလျောက် Deploy လုပ်ပေးသော AWS ၏ Platform as a Service (PaaS) ဖြစ်ပါသည်။ အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ လက်တွေ့ အသုံးချပုံ (Usages) များကို အစဉ်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ Elastic Beanstalk ဆိုတာဘာလဲ & Architecture**](/aws-saa/05_elastic_beanstalk/01_what_is_beanstalk_and_architecture/) | PaaS Model, Shared Responsibility, Supported Runtimes (PHP, Node, Python, Docker) | Developer က Code တင်ရုံဖြင့် နောက်ကွယ်တွင် EC2, ASG, ALB များကို Beanstalk က အလိုအလျောက် တည်ဆောက်ပေးပုံ |
| **02** | [**၂။ Components & Environment Tiers**](/aws-saa/05_elastic_beanstalk/02_components_and_environment_tiers/) | Application, Application Version, Web Server Tier vs Worker Tier (SQS) | Web APIs များအတွက် Web Tier နှင့် Background Job များအတွက် SQS-driven Worker Tier ခွဲခြားတည်ဆောက်ခြင်း |
| **03** | [**၃။ Deployment Strategies & .ebextensions**](/aws-saa/05_elastic_beanstalk/03_deployment_strategies_and_ebextensions/) | All at Once, Rolling, Rolling with Additional Batch, Immutable, Traffic Splitting | Zero-downtime ရရှိစေရန် Immutable သို့မဟုတ် Traffic Splitting သုံးခြင်းနှင့် `.ebextensions` ဖြင့် Linux OS စိတ်ကြိုက်ပြင်ဆင်ခြင်း |
| **04** | [**၄။ Hands-on Lab: Web App Deployment**](/aws-saa/05_elastic_beanstalk/04_hands_on_lab_beanstalk_deployment/) | EB CLI (`eb init`, `eb create`, `eb deploy`), Config, Logs & Resource Cleanup | Web App ကို CLI ဖြင့် Deploy လုပ်ခြင်း၊ Environment Variables ထည့်သွင်းခြင်း၊ Version အသစ်တင်ခြင်းနှင့် စရိတ်ရှင်းလင်းခြင်း |
| **05** | [**၅။ Security, Monitoring & Troubleshooting**](/aws-saa/05_elastic_beanstalk/05_security_monitoring_and_troubleshooting/) | Enhanced Health (Color codes), CloudWatch Logs, IAM Roles, HTTP 502/503 | Server ကျန်းမာရေး (Green, Yellow, Red) စောင့်ကြည့်ခြင်း၊ Deployment ပျက်စီးရသည့် အကြောင်းအရင်းများ စစ်ဆေးဖြေရှင်းနည်း |
| **06** | [**၆။ Service Comparisons & SAA-C03 Quiz**](/aws-saa/05_elastic_beanstalk/06_service_comparisons_and_saa_c03_quiz/) | Beanstalk vs EC2 / ECS / Lambda, SAA-C03 Exam Traps & Quiz | စာမေးပွဲတွင် အမေးများသော Deployment မေးခွန်းများနှင့် အသေးစိတ် ရှင်းလင်းချက်ပါဝင်သည့် အလေ့အကျင့် စာမေးပွဲ |
