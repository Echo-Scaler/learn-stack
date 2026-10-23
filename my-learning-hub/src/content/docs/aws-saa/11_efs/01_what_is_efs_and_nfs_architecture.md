---
title: "၁။ EFS ဆိုတာဘာလဲ & NFS Architecture"
description: "Amazon EFS (Elastic File System) ၏ သဘောတရား၊ Multi-AZ Mount Targets၊ POSIX စံနှုန်း၊ Linux Support နှင့် Multi-Compute ချိတ်ဆက်မှု Architecture"
---

# ၁။ EFS ဆိုတာဘာလဲ & NFS Architecture

## Amazon EFS ဆိုတာဘာလဲ?

**Amazon EFS (Elastic File System)** — **Serverless, fully managed file system for use with compute services.**

Amazon EFS သည် Cloud ပေါ်တွင် သီးခြား Server တစ်လုံး ထောင်စရာမလိုဘဲ အသုံးပြုနိုင်သော **Serverless Network File System (NFS)** ဖြစ်ပါသည်။

- **Shared Storage:** EBS Volume ကဲ့သို့ Instance တစ်ခုတည်းတွင် ကန့်သတ်မထားဘဲ မတူညီသော **Availability Zones (AZs) များအတွင်းရှိ EC2 Instances ရာထောင်ချီ၊ ECS Containers၊ EKS Pods နှင့် AWS Lambda Functions များက တပြိုင်နက်တည်း ဖတ်/ရေး (Concurrent Read/Write)** ပြုလုပ်နိုင်ပါသည်။
- **Elastic Capacity:** ဒေတာ ထည့်သွင်းလိုက်ပါက Storage အရွယ်အစား အလိုအလျောက် ကြီးထွားလာပြီး၊ ဒေတာ ဖျက်လိုက်ပါက အလိုအလျောက် ပြန်လည် ကျုံ့သွားပါသည်။ ကြိုတင်၍ 500 GB သို့မဟုတ် 1 TB ဟု သတ်မှတ်ပေးရန် မလိုဘဲ အမှန်တကယ် သုံးသလောက် (Pay-as-you-go) သာ ပေးဆောင်ရသည်။
- **POSIX Compliant:** Linux စံနှုန်းအတိုင်း Directory Tree, File Permissions (chmod, chown) များကို အပြည့်အဝ ထောက်ပံ့သည်။
- **OS Support:** **Linux သာ ထောက်ပံ့ပါသည်** (Windows OS အတွက် SMB protocol သုံးသော **Amazon FSx for Windows File Server** ကို သုံးရပါမည်)။

---

## 🏛️ EFS Multi-AZ Architecture

EFS သည် ဒေတာများကို Availability Zones ၃ ခုကျော်တွင် သီးခြား replicate လုပ်ထားပြီး Region တစ်ခုလုံးတွင် တစ်ပြေးညီ အသုံးပြုနိုင်ရန် Subnet တစ်ခုစီတိုင်း၌ **Mount Target** တစ်ခုစီ ချထားပေးပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Amazon VPC (Region)                             │
│                                                                        │
│  ┌────────────────────────┐            ┌────────────────────────┐      │
│  │ Availability Zone A    │            │ Availability Zone B    │      │
│  │                        │            │                        │      │
│  │  ┌──────────────────┐  │            │  ┌──────────────────┐  │      │
│  │  │ EC2 Web Node #1  │  │            │  │ EC2 Web Node #2  │  │      │
│  │  └────────┬─────────┘  │            │  └────────┬─────────┘  │      │
│  │           │            │            │           │            │      │
│  │           ▼            │            │           ▼            │      │
│  │  ┌──────────────────┐  │            │  ┌──────────────────┐  │      │
│  │  │ Mount Target A   │  │            │  │ Mount Target B   │  │      │
│  │  │ (ENI: 10.0.1.50) │  │            │  │ (ENI: 10.0.2.80) │  │      │
│  │  └────────┬─────────┘  │            │  └────────┬─────────┘  │      │
│  └───────────┼────────────┘            └───────────┼────────────┘      │
│              └─────────────────┬───────────────────┘                   │
│                                │ (NFSv4 Port 2049)                     │
│                                ▼                                       │
│          ┌──────────────────────────────────────────────┐              │
│          │            Amazon EFS File System            │              │
│          │  (Multi-AZ Replicated, Elastic POSIX Files)  │              │
│          └──────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Compute Services ချိတ်ဆက်နိုင်မှု

EFS ကို AWS ၏ မတူညီသော Compute Platforms အားလုံးနှင့် အလွယ်တကူ ချိတ်ဆက်နိုင်ပါသည်:

1. **Amazon EC2:** Standard Linux NFS client သို့မဟုတ် `amazon-efs-utils` ဖြင့် `/mnt/efs` သို့ mount လုပ်ခြင်း။
2. **Amazon ECS & AWS Fargate:** Task Definition ထဲတွင် EFS Volume အဖြစ် သတ်မှတ်၍ Container အတွင်း Persistent Storage အဖြစ် သုံးခြင်း (ဥပမာ- WordPress `wp-content` uploads)။
3. **Amazon EKS:** AWS EFS CSI Driver ဖြင့် Kubernetes Persistent Volumes (PV/PVC) အဖြစ် Multi-AZ Pods များ အတူမျှဝေသုံးစွဲခြင်း။
4. **AWS Lambda:** Serverless Function တစ်ခုအတွင်း ကြီးမားသော AI Model weights သို့မဟုတ် Shared Libraries များကို Read/Write လုပ်ရန် EFS ချိတ်ဆက်ခြင်း။
5. **On-Premises Servers:** AWS Direct Connect သို့မဟုတ် AWS Site-to-Site VPN မှတစ်ဆင့် ရုံးတွင်း Data Center ဆာဗာများမှလည်း Mount လုပ်နိုင်ပါသည်။
