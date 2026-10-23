---
title: "၁၀။ Service Comparisons & Production Architectures"
description: "EC2 vs Lambda, ECS/Fargate, EKS, Elastic Beanstalk, Lightsail နှိုင်းယှဉ်ချက်နှင့် Production Multi-Tier Web Architecture"
---

# ၁၀။ Service Comparisons & Production Architectures

## AWS Compute Services နှိုင်းယှဉ်ချက် (ဘယ်အချိန် ဘာသုံးမလဲ?)

AWS တွင် Compute ဝန်ဆောင်မှု အမျိုးမျိုးရှိပြီး Application လိုအပ်ချက်ပေါ် မူတည်၍ မှန်ကန်စွာ ရွေးချယ်တတ်ရန် လိုအပ်ပါသည်:

| Service | Architecture Model | စီမံခန့်ခွဲရမှု (Overhead) | Scaling အမြန်နှုန်း | စရိတ်တွက်ချက်ပုံ | အကောင်းဆုံး အသုံးချမှု (Best For) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Amazon EC2** | **IaaS** (Virtual Server) | အမြင့်ဆုံး (OS, Patching, Security မိမိတာဝန်) | မိနစ်ပိုင်း (ASG Boot Time လိုသည်) | တစ်နာရီ / တစ်စက္ကန့်အလိုက် (Running Time) | Full Root OS Access လိုအပ်ခြင်း၊ Legacy Apps၊ အချိန်ပြည့် ၂၄ နာရီ မနားတမ်း Run မည့် Server |
| **AWS Lambda** | **Serverless (FaaS)** | မရှိသလောက် (Zero Server Management) | **စက္ကန့်ပိုင်း (Instant auto-scale 0 to thousands)** | Executions အရေအတွက်နှင့် Millisecond အလိုက် | Event-driven Workloads၊ File Processing၊ စက္ကန့်အနည်းငယ်သာကြာမည့် REST APIs |
| **Amazon ECS** | **Container Service (CaaS)** | အလယ်အလတ် (Fargate သုံးပါက Server မလိုပါ) | စက္ကန့်ပိုင်း (Docker Container start time) | vCPU နှင့် RAM သုံးစွဲမှုအလိုက် | Microservices၊ Dockerized Applications၊ Web APIs |
| **Amazon EKS** | **Kubernetes (K8s)** | အမြင့်ဆုံး (Kubernetes Management Complexity) | မြန်ဆန်သည် | Cluster Fee ($0.10/hr) + Worker Nodes စရိတ် | Large Enterprise Microservices၊ Multi-Cloud Portability လိုအပ်ချက် |
| **Elastic Beanstalk**| **PaaS (Platform as a Service)** | အနိမ့် (Code တင်ရုံဖြင့် Infra အလိုအလျောက် ဆောက်သည်) | မိနစ်ပိုင်း (EC2 အခြေခံ) | အခမဲ့ (နောက်ကွယ်ရှိ EC2, ALB စရိတ်သာ ပေးရသည်) | Developers များ အခြေခံအဆောက်အအုံ မလုပ်ချင်ဘဲ Web App အမြန်လွှင့်တင်လိုသည့်အခါ |
| **Amazon Lightsail** | **Simplified VPS** | အလယ်အလတ် (ရိုးရှင်းသော Control Panel) | Manual | **လစဉ် ပုံသေနှုန်းထား ($3.50/mo မှစသည်)** | ရိုးရှင်းသော WordPress Website၊ ကျောင်းသား/စတင်လေ့လာသူများ၏ Small Projects |

---

## 🏛️ Real-World Production Architecture: Multi-Tier Resilient Web Application

လက်တွေ့ လုပ်ငန်းခွင်တွင် EC2 ကို အခြားသော AWS Services များနှင့် ပေါင်းစပ်၍ အောက်ပါအတိုင်း High Availability Architecture အဖြစ် တည်ဆောက်ကြပါသည်:

```
                                [ Internet Users ]
                                        │
                                        ▼
                            [ Amazon CloudFront (CDN) ]
                           (DDoS Protection via AWS WAF)
                                        │
                ┌───────────────────────┴───────────────────────┐
                ▼ (Static Assets - Images/CSS)                  ▼ (Dynamic API Traffic)
       [ Amazon S3 Bucket ]                     [ Application Load Balancer (ALB) ]
                                                (Public Subnets across AZ-A & AZ-B)
                                                                │
                                ┌───────────────────────────────┴───────────────────────────────┐
                                ▼                                                               ▼
                     ┌──────────────────────┐                                        ┌──────────────────────┐
                     │ Availability Zone A  │                                        │ Availability Zone B  │
                     │ (Private App Subnet) │                                        │ (Private App Subnet) │
                     │                      │                                        │                      │
                     │  ┌────────────────┐  │                                        │  ┌────────────────┐  │
                     │  │ EC2 Web Server │  │                                        │  │ EC2 Web Server │  │
                     │  │ (Auto Scaling) │  │                                        │  │ (Auto Scaling) │  │
                     │  └────────┬───────┘  │                                        │  └────────┬───────┘  │
                     └───────────┼──────────┘                                        └───────────┼──────────┘
                                 │                                                               │
                                 └───────────────────────────────┬───────────────────────────────┘
                                                                 │
                                ┌────────────────────────────────┴────────────────────────────────┐
                                ▼ (Fast Cache Layer)                                              ▼ (Persistent Storage)
                     [ Amazon ElastiCache (Redis) ]                              [ Amazon RDS PostgreSQL (Multi-AZ) ]
                     Session Data & Query Caching                                Primary DB (AZ-A) ──► Standby DB (AZ-B)
```

### ဗိသုကာ၏ အဓိက အချက်များ:
1. **Zero Public Access to Core Compute:** EC2 Web Server များကို Public Subnet တွင် မထားဘဲ Private Subnet များတွင်သာ Auto Scaling Group ဖြင့် ထားရှိသည်။ အင်တာနက်မှ လူများသည် ALB မှတစ်ဆင့်သာ လှမ်းခေါ်နိုင်သည်။
2. **Static & Dynamic Separation:** ရုပ်ပုံများ၊ ဗီဒီယိုများနှင့် Frontend static files များကို EC2 ပေါ်မတင်ဘဲ S3 + CloudFront ဖြင့် Cache ပေးထားသဖြင့် Server ဝန်ထုပ်ဝန်ပိုး ၇၀% ကျဆင်းသွားသည်။
3. **Database Multi-AZ Resiliency:** Primary Database ချွတ်ယွင်းသွားပါက ၆၀ စက္ကန့်အတွင်း Standby DB သို့ အလိုအလျောက် Failover ပြုလုပ်ပေးသည်။

---

## 💰 Production Cost Optimization Checklist

1. **AWS Graviton (ARM) Instances သို့ ပြောင်းပါ:** `t3`/`m5`/`c5` (Intel) အစား `t4g`/`m6g`/`c6g` (Graviton) ကို သုံးပါက စွမ်းဆောင်ရည် ၄၀% တက်ပြီး စရိတ် ၂၀% သက်သာသည်။
2. **Right-Sizing ပြုလုပ်ပါ:** CloudWatch Metrics များကို စစ်ဆေး၍ ပျမ်းမျှ CPU ၂၀% အောက်သာ သုံးနေသော Server များကို တစ်ဆင့်ငယ်သော Instance Size သို့ လျှော့ချပါ။
3. **Unattached Resources များကို ရှင်းလင်းပါ:**
   - Terminate လုပ်ထားပြီး ကျန်နေသော **Unattached EBS Volumes** များကို ရှာဖွေဖျက်ပစ်ပါ။
   - မသုံးဘဲ အလွတ်ထားသော **Elastic IP (EIP)** များကို ချက်ချင်း Release ပြုလုပ်ပါ။
4. **24/7 Steady-state Workload များအတွက် Savings Plans ဝယ်ယူပါ** (On-Demand ထက် ၇၂% အထိ သက်သာစေသည်)။
