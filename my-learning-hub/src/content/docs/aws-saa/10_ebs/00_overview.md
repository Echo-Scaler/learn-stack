---
title: "Feature 10: Amazon EBS — Feature Titles & Usage Overview"
description: "Amazon EBS (Elastic Block Store) — High-performance block storage volumes for Amazon EC2 ကို မြန်မာလို အခြေခံမှ စတင်၍ Volume Types, Snapshots, Multi-Attach နှင့် SAA-C03 Guide"
---

# Feature 10: Amazon EBS ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### High-Performance Block Storage Volumes for Amazon EC2 & SAA-C03 Guide

**Amazon EBS (Elastic Block Store)** သည် Amazon EC2 Instances များနှင့် တွဲဖက်အသုံးပြုရန် ဒီဇိုင်းဆင်ထားသော **High-Performance Network-Attached Block Storage** ဖြစ်ပါသည်။ OS Boot Drive များ၊ Transactional Relational Databases (MySQL, PostgreSQL, Oracle) နှင့် မြန်ဆန်သော Read/Write Disk I/O လိုအပ်သော လုပ်ငန်းသုံး Workloads များအတွက် မရှိမဖြစ် လိုအပ်သော Core Storage ဖြစ်ပါသည်။

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ EBS ဆိုတာဘာလဲ & Volume Types**](/aws-saa/10_ebs/01_what_is_ebs_and_volume_types/) | Block Storage, Single AZ Scope, gp3 vs gp2, io2 Block Express, st1 vs sc1 | Boot Volumes, Databases, High IOPS vs Big Data Throughput ရွေးချယ်ခြင်း |
| **02** | [**၂။ Snapshots, Encryption & DLM**](/aws-saa/10_ebs/02_snapshots_encryption_and_dlm/) | Incremental Snapshots in S3, Fast Snapshot Restore (FSR), KMS Encryption, Amazon DLM | Point-in-time Backups၊ Unencrypted Volume မှ Encrypted Volume သို့ ပြောင်းလဲခြင်း |
| **03** | [**၃။ Multi-Attach & Volume Management**](/aws-saa/10_ebs/03_ebs_multi_attach_and_volume_management/) | EBS Multi-Attach (io1/io2), Elastic Volumes (Zero Downtime Resize), Move across AZs | Cluster File Systems၊ Volume အရွယ်အစားနှင့် IOPS ကို Server မရပ်ဘဲ တိုးချဲ့ခြင်း |
| **04** | [**၄။ SAA-C03 Exam Traps & Practice Quiz**](/aws-saa/10_ebs/04_saa_c03_traps_and_quiz/) | DeleteOnTermination, Boot Disk Restrictions, EBS vs Instance Store, SAA-C03 Quiz | စာမေးပွဲ မေးခွန်းဟောင်းများနှင့် ထောင်ချောက်များကို လက်တွေ့ လေ့ကျင့်ဖြေဆိုခြင်း |
