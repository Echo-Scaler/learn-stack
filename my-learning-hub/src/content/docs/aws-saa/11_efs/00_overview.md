---
title: "Feature 11: Amazon EFS — Feature Titles & Usage Overview"
description: "Amazon EFS (Elastic File System) — Serverless, fully managed file system for use with compute services ကို မြန်မာလို အခြေခံမှ စတင်၍ NFS Architecture, Storage Classes နှင့် SAA-C03 Guide"
---

# Feature 11: Amazon EFS ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### Serverless, Fully Managed File System for Compute Services & SAA-C03 Guide

**Amazon EFS (Elastic File System)** သည် AWS Compute ဝန်ဆောင်မှုများ (EC2, ECS, EKS, AWS Lambda) နှင့် ချိတ်ဆက်အသုံးပြုနိုင်သော **Serverless, Fully Managed, Multi-AZ Shared File System** ဖြစ်ပါသည်။ POSIX စံနှုန်းညီ Linux File System ဖြစ်ပြီး အလိုအလျောက် ကျုံ့နိုင်/ကျယ်နိုင် (Elastic Auto-scaling) ကာ Storage Size ကြိုတင် သတ်မှတ်ပေးရန် မလိုဘဲ အသုံးပြုသလောက်သာ ပေးချေရသော စနစ် ဖြစ်ပါသည်။

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ EFS ဆိုတာဘာလဲ & NFS Architecture**](/aws-saa/11_efs/01_what_is_efs_and_nfs_architecture/) | Managed NFSv4, Multi-AZ Mount Targets, POSIX Permissions, Linux Support | Server ရာထောင်ချီမှ တပြိုင်နက် ဖတ်/ရေးနိုင်သော Shared Code, WordPress Uploads |
| **02** | [**၂။ Storage Classes, Lifecycle & Performance**](/aws-saa/11_efs/02_storage_classes_lifecycle_and_performance/) | EFS Standard vs One Zone, Infrequent Access (IA), General Purpose vs Max I/O, Elastic Throughput | ရက် ၃၀ ကျော် အသုံးနည်းသော ဖိုင်များကို ၉၂% ကုန်ကျစရိတ် လျှော့ချခြင်း |
| **03** | [**၃။ Security, Mount Targets & SAA-C03 Quiz**](/aws-saa/11_efs/03_security_mount_targets_and_saa_c03_quiz/) | Mount Target Security Groups (Port 2049), EFS Access Points, EFS vs EBS vs FSx, SAA-C03 Quiz | လုံခြုံစွာ Mount လုပ်နည်းနှင့် စာမေးပွဲ မေးခွန်းများ ဖြေဆိုလေ့ကျင့်ခြင်း |
