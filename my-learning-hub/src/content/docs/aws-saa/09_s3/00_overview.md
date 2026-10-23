---
title: "Feature 9: Amazon S3 — Feature Titles & Usage Overview"
description: "Amazon S3 (Simple Storage Service) — Highly durable object storage for files, images, and backups ကို မြန်မာလို အခြေခံမှ စတင်၍ SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ အသုံးချပုံ အပြည့်အစုံ"
---

# Feature 9: Amazon S3 ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### Highly Durable Object Storage for Files, Images, and Backups & SAA-C03 Guide

**Amazon S3 (Simple Storage Service)** သည် အင်တာနက်ပေါ်တွင် မည်သည့် Data ပမာဏကိုမဆို သိမ်းဆည်းနိုင်ပြီး နေရာမရွေး ပြန်လည်ရယူနိုင်သော စက်မှုလုပ်ငန်း ဦးဆောင် **Object Storage Service** ဖြစ်ပါသည်။ 99.999999999% (11 9s) Data Durability ပေးစွမ်းပြီး SAA-C03 စာမေးပွဲတွင် အမေးအများဆုံးနှင့် မဖြစ်မနေ သိရှိထားရမည့် မဏ္ဍိုင်ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ S3 ဆိုတာဘာလဲ & Bucket Basics**](/aws-saa/09_s3/01_what_is_s3_and_bucket_basics/) | Object vs Block vs File, Bucket Naming Rules, 11 9s Durability, Strong Consistency | Static Assets (Images, Videos), Backups, Data Lake များ သိမ်းဆည်းခြင်း |
| **02** | [**၂။ Storage Classes & Lifecycle Rules**](/aws-saa/09_s3/02_storage_classes_and_lifecycle/) | Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Lifecycle Transitions & Expiration | အသုံးနည်းသော ဒေတာများကို ကုန်ကျစရိတ် အနည်းဆုံးဖြစ်အောင် အလိုအလျောက် ရွှေ့ပြောင်းခြင်း |
| **03** | [**၃။ S3 Security, Bucket Policies & Encryption**](/aws-saa/09_s3/03_security_bucket_policies_and_encryption/) | Block Public Access, Bucket Policy vs IAM, SSE-S3 vs SSE-KMS, Enforce HTTPS | ကုမ္ပဏီဒေတာ လုံခြုံရေး၊ Public Leaks ကာကွယ်ခြင်းနှင့် HIPAA/PCI-DSS စည်းမျဉ်းလိုက်နာခြင်း |
| **04** | [**၄။ Versioning, Replication & Object Lock**](/aws-saa/09_s3/04_versioning_replication_and_object_lock/) | Object Versioning, MFA Delete, CRR / SRR Replication, Object Lock (WORM) | မတော်တဆ ဖျက်မိခြင်းမှ ကာကွယ်ခြင်းနှင့် Disaster Recovery (DR) အတွက် အခြား Region သို့ ကူးယူခြင်း |
| **05** | [**၅။ Hands-on: S3 CLI & Static Website Hosting**](/aws-saa/09_s3/05_hands_on_s3_cli_and_static_website/) | `aws s3` CLI Commands, Static Website Hosting, Pre-signed URLs | Serverless Static Website လွှင့်တင်ခြင်းနှင့် ယာယီ Download Link ဖန်တီးခြင်း |
| **06** | [**၆။ Performance Optimization & SAA-C03 Quiz**](/aws-saa/09_s3/06_performance_and_saa_c03_traps/) | Multipart Upload, S3 Transfer Acceleration, Byte-Range Fetches, SAA-C03 Traps & Quiz | ကြီးမားသောဖိုင်များ အမြန် Upload တင်ခြင်းနှင့် စာမေးပွဲ မေးခွန်းများ ဖြေဆိုလေ့ကျင့်ခြင်း |
