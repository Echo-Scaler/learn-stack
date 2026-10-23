---
title: "၂။ EKS Architecture & Compute Models"
description: "EKS Architecture၊ Control Plane vs Data Plane၊ Managed Node Groups၊ Self-Managed Nodes၊ AWS Fargate Profiles နှင့် EKS Auto Mode နှိုင်းယှဉ်ချက်"
---

# ၂။ EKS Architecture & Compute Models

## EKS High-Availability Architecture

Amazon EKS ၏ ဗိသုကာလက်ရာသည် **AWS Shared Responsibility Model** ပေါ်တွင် အခြေခံထားပါသည်:

```
┌─────────────────────────────────────────────────────────────────────────┐
│              AWS-Managed Control Plane (Single-Tenant VPC)              │
│                                                                         │
│    Availability Zone A        Availability Zone B    Availability Zone C│
│  ┌────────────────────┐     ┌────────────────────┐ ┌──────────────────┐ │
│  │   kube-apiserver   │     │   kube-apiserver   │ │  kube-apiserver  │ │
│  │   etcd database    │     │   etcd database    │ │  etcd database   │ │
│  └────────────────────┘     └────────────────────┘ └──────────────────┘ │
│                               ▲                                         │
│                      [ Network Load Balancer ]                          │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │ (ENIs / AWS PrivateLink)
┌───────────────────────────────▼─────────────────────────────────────────┐
│                    Customer-Managed Data Plane (Your VPC)               │
│                                                                         │
│   [ Managed Node Group ]       [ AWS Fargate Profile ]   [ Karpenter ]  │
│   EC2 Instances (Auto-Scale)   Serverless MicroVMs       Just-in-Time   │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Control Plane SLA:** AWS သည် etcd ဒေတာဘေ့စ်နှင့် API Servers များကို AZ ၃ ခုတွင် အနည်းဆုံး ထားရှိပေးထားပြီး Cluster တစ်ခုလျှင် **$0.10/hour ($73/month)** သာ ကောက်ခံပါသည်။
- **Data Plane (Worker Nodes):** မိမိ Application များ အမှန်တကယ် run သည့်နေရာဖြစ်ပြီး မိမိ၏ VPC Subnet များအတွင်း၌ တည်ရှိပါသည်။

---

## EKS Compute Models ၄ မျိုး နှိုင်းယှဉ်ချက်

EKS တွင် Worker Nodes များကို မောင်းနှင်ရန် ရွေးချယ်စရာ နည်းလမ်း ၄ မျိုး ရှိပါသည်:

| အချက်အလက် | Managed Node Groups | Self-Managed Nodes | AWS Fargate Profiles | EKS Auto Mode (New) |
| :--- | :--- | :--- | :--- | :--- |
| **စီမံခန့်ခွဲမှု** | **အလယ်အလတ် (Recommended)** | အမြင့်ဆုံး (Manual Setup) | **အနည်းဆုံး (Serverless)** | အလိုအလျောက် (Fully Automated) |
| **OS Upgrades** | AWS Console/CLI မှ 1-click update ရသည် | ကိုယ်တိုင် ASG နှင့် AMI ချိန်းရသည် | **AWS က အလိုအလျောက် အမြဲ patch ပေးသည်** | AWS က Node များကို အလိုအလျောက် စီမံသည် |
| **DaemonSets** | ထောက်ပံ့သည် | ထောက်ပံ့သည် | **လုံးဝ အသုံးမပြုနိုင်ပါ** | ထောက်ပံ့သည် |
| **Host Isolation** | Shared VM Host | Shared VM Host | **Dedicated MicroVM per Pod (အမြင့်ဆုံး Isolation)** | AWS Managed |
| **Stateful Storage** | EBS နှင့် EFS နှစ်မျိုးလုံးရသည် | EBS နှင့် EFS နှစ်မျိုးလုံးရသည် | **EFS သာ ရသည် (EBS မရပါ)** | EBS/EFS အလိုအလျောက် ချိတ်သည် |
| **အကောင်းဆုံး Use Case** | အများစုသော General Kubernetes Workloads | Custom Linux Kernels, GPU Clusters | Web APIs, CI/CD Jobs, Batch Processing | Infrastructure မကိုင်တွယ်လိုသော အဖွဲ့များ |

---

## ၁။ EKS Managed Node Groups
AWS သည် EC2 Auto Scaling Group ကို နောက်ကွယ်မှ ဖန်တီးပေးပြီး Kubernetes Version အသစ်ထွက်သည့်အခါ **Drain and Cordon** စနစ်ဖြင့် Pod များကို မပြတ်တောက်စေဘဲ Node များကို တစ်လုံးချင်း Zero-Downtime Rolling Upgrade ပြုလုပ်ပေးပါသည်။

## ၂။ AWS Fargate for EKS (Serverless Pods)
EC2 Instance တစ်လုံးမျှ ဝယ်ယူစရာမလိုဘဲ Pod တစ်ခုချင်းစီကို သီးခြား MicroVM အနေဖြင့် စက္ကန့်ပိုင်းအတွင်း Run ပေးပါသည်။
- **ကန့်သတ်ချက် (SAA-C03 Key Trap):** Fargate တွင် Linux Root access မရှိသဖြင့် Monitoring Agents များအတွက် **DaemonSets Run ၍ မရပါ**။ ထို့အပြင် **EBS Volume ကို Attach လုပ်၍မရဘဲ Amazon EFS ကိုသာ Storage အဖြစ် သုံးနိုင်ပါသည်**။
