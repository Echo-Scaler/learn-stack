---
title: "၅။ Storage စနစ်များ (EBS, Instance Store & EFS)"
description: "EBS Volume Types (gp3, io2, st1), Snapshots, Encryption, Instance Store ယာယီ Disk နှင့် EFS Multi-Attach နှိုင်းယှဉ်ချက်"
---

# ၅။ Storage စနစ်များ (EBS, Instance Store & EFS)

## Storage ရွေးချယ်စရာ ၃ မျိုး နှိုင်းယှဉ်ချက်

EC2 Instance များတွင် Data သိမ်းဆည်းရန်အတွက် Storage အမျိုးအစား ၃ မျိုးကို အဓိက အသုံးပြုနိုင်ပါသည်:

| အချက်အလက် | Amazon EBS | EC2 Instance Store | Amazon EFS |
| :--- | :--- | :--- | :--- |
| **ချိတ်ဆက်ပုံ** | Network-attached (ကြိုးတပ် Hard Disk) | Direct Hardware-attached (Host ပေါ်တွင် ကပ်လျက်ရှိ) | Network File System (NFSv4) |
| **Data တည်မြဲမှု** | **Persistent** (Instance ပိတ်သော်လည်း ကျန်ရှိသည်) | **Ephemeral** (Instance Stop သို့မဟုတ် Terminate ဖြစ်ပါက **Data ပျောက်သည်**) | **Persistent** (Multi-AZ တွင် အမြဲတည်တံ့သည်) |
| **တစ်ပြိုင်နက် ချိတ်ဆက်မှု** | Instance တစ်ခုသာ (io1/io2 multi-attach မှလွဲ၍) | Physical Host ၁ ခုရှိ Instance တစ်ခုတည်းသာ | **EC2 Instances ရာနှင့်ချီ၍ တစ်ပြိုင်နက် ဖတ်/ရေးနိုင်သည်** |
| **အမြင့်ဆုံး စွမ်းဆောင်ရည်** | အလွန်ကောင်းမွန် (သီးသန့် EBS Network ဖြင့် သွားသည်) | **အမြန်ဆုံး (Ultra-high IOPS / Lowest Latency)** | ကောင်းမွန် (Distributed Network File System) |
| **အကောင်းဆုံး Use Case** | OS Boot Volume, Relational Database (Postgres/MySQL) | Caching, Temp Processing, Buffer, High-speed Scratch | WordPress Uploads, Shared Configuration, Content Management |

---

## Amazon EBS Volume Types (အမျိုးအစားများ)

AWS EBS တွင် Performance နှင့် ဈေးနှုန်းအလိုက် Volume အမျိုးအစားများ ခွဲခြားထားပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          EBS Volume Types                              │
├───────────────────────────────┬────────────────────────────────────────┤
│          SSD-backed           │               HDD-backed               │
│  (Small, Random I/O, OS Boot) │      (Large, Sequential Streaming)     │
├───────────────────────────────┼────────────────────────────────────────┤
│ • gp3: General Purpose SSD    │ • st1: Throughput Optimized HDD        │
│   (3000 IOPS, 125 MB/s base)  │   (Big Data, Data Warehouses, Logs)    │
│ • gp2: Legacy General Purpose │ • sc1: Cold HDD                        │
│ • io2: Provisioned IOPS SSD   │   (Lowest cost, Infrequent Access)     │
│   (Mission-critical Databases)│                                        │
└───────────────────────────────┴────────────────────────────────────────┘
```

1. **gp3 (General Purpose SSD - Recommended):**  
   ခေတ်သစ် AWS စနစ်များတွင် **Default အသုံးပြုရမည့် အမျိုးအစား** ဖြစ်သည်။ Volume Size မည်မျှပင် သေးငယ်စေကာမူ အခြေခံ 3,000 IOPS နှင့် 125 MB/s Throughput ကို အခမဲ့ ပေးထားပြီး လိုအပ်ပါက Volume Size မတိုးဘဲ IOPS သီးသန့် ဝယ်ယူနိုင်သည်။ `gp2` ထက် ၂၀% ဈေးပိုသက်သာသည်။
2. **io2 / io2 Block Express (Provisioned IOPS SSD):**  
   Oracle, SAP HANA, Microsoft SQL Server ကဲ့သို့ Sub-millisecond Latency နှင့် အမြင့်ဆုံး IOPS (Up to 256,000 IOPS) လိုအပ်သော Mission-critical Production Databases များအတွက် သုံးသည်။
3. **st1 (Throughput Optimized HDD):**  
   သန်းပေါင်းများစွာသော Log ဖိုင်များ သိမ်းဆည်းခြင်းနှင့် Big Data Hadoop/Kafka ကဲ့သို့ Sequential Read/Write များအတွက် ဈေးသက်သာစွာ သုံးနိုင်သည်။ **Boot Volume (OS တင်ရန်) အဖြစ် အသုံးမပြုနိုင်ပါ။**
4. **sc1 (Cold HDD):**  
   အလွန်နည်းပါးစွာသာ ပြန်လည်ကြည့်ရှုမည့် File Archiving များအတွက် ဈေးအသက်သာဆုံး HDD ဖြစ်သည်။ **Boot Volume အဖြစ် မရပါ။**

---

## EBS Snapshots & Data Lifecycle Manager (DLM)

- **EBS Snapshots:** EBS Volume ပေါ်ရှိ Data များကို Point-in-time အတိုင်း ကူးယူ၍ **Amazon S3** ပေါ်တွင် လုံခြုံစွာ သိမ်းဆည်းသော Backup စနစ် ဖြစ်သည်။
- **Incremental Backup:** ပထမအကြိမ်တွင် Volume အပြည့် Snapshot ယူသော်လည်း နောက်ပိုင်း အကြိမ်များတွင် ပြောင်းလဲသွားသော Block (Delta) များကိုသာ သိမ်းဆည်းသဖြင့် Storage စရိတ် အလွန်သက်သာသည်။
- **Amazon Data Lifecycle Manager (DLM):** နေ့စဉ် သို့မဟုတ် အပတ်စဉ် သတ်မှတ်ထားသော အချိန်တွင် Snapshot အလိုအလျောက် ရယူရန်နှင့် ရက်ပေါင်း ၃၀ ကျော်ပါက အဟောင်းများကို အလိုအလျောက် ဖျက်ပစ်ရန် မူဝါဒ (Policy) သတ်မှတ်နိုင်သည်။

---

## EBS Encryption (ဒေတာ လျှို့ဝှက်ကုဒ်စနစ်)

EBS Volume များကို **AWS KMS (Key Management Service)** ၏ AES-256 စံနှုန်းဖြင့် အလွယ်တကူ Encrypt ပြုလုပ်နိုင်ပါသည်။
- Data at rest (Volume ပေါ်ရှိ ဒေတာ)၊ Data in transit (Instance နှင့် EBS ကြား စီးဆင်းသော ဒေတာ) နှင့် ၎င်းမှ ယူထားသော Snapshots များအားလုံး အလိုအလျောက် Encrypted ဖြစ်သွားသည်။
- **Performance Impact:** AWS Nitro System က Hardware အဆင့်တွင် ကုဒ်ပြောင်းပေးသဖြင့် Server ၏ CPU အပေါ် ဝန်ထုပ်ဝန်ပိုး မဖြစ်စေပါ။

### 💡 SAA-C03 စာမေးပွဲ မေးခွန်းဟောင်း လှည့်ကွက်:
> **မေးခွန်း:** Unencrypted (ကုဒ်မဖျက်ထားသော) Existing Root EBS Volume တစ်ခုကို Encrypted Volume အဖြစ်သို့ မည်သို့ ပြောင်းလဲမည်နည်း?  
> **အဖြေမှန် (၄ ဆင့်):**
> 1. Unencrypted Volume ကို Snapshot ရယူပါ။
> 2. ထို Snapshot ကို အခြား Snapshot အသစ်တစ်ခုအဖြစ် Copy ကူးပါ (**Copy ကူးချိန်တွင် "Enable Encryption" ကို အမှန်ခြစ်ပါ**).
> 3. Encrypted Snapshot မှတစ်ဆင့် **AMI အသစ်** တည်ဆောက်ပါ။
> 4. ထို AMI အသစ်ဖြင့် EC2 Instance အသစ်ကို Launch ပြုလုပ်ပါ။

---

## Amazon EFS (Elastic File System)

အကယ်၍ Multiple EC2 Instances (ဥပမာ- Auto Scaling Group ရှိ Web Servers ၁၀ လုံး) က ဖိုင်တစ်ခုတည်းကို တစ်ပြိုင်နက် ဖတ်ခြင်း/ရေးခြင်း (Read-Write Many - RWX) ပြုလုပ်လိုပါက EBS ဖြင့် မရနိုင်ဘဲ **Amazon EFS** ကို သုံးရပါမည်:
- Linux OS တွင် `mount -t nfs4 ...` ဖြင့် အလွယ်တကူ Mount ဆွဲနိုင်သည်။
- Multi-AZ Resilience ရှိသဖြင့် Availability Zone တစ်ခုလုံး မီးပျက်သွားသော်လည်း Data လုံးဝ မပျက်စီးပါ။
- Storage ပမာဏ သတ်မှတ်စရာမလိုဘဲ ဖိုင်ထည့်လေ Auto-grow ဖြစ်ပြီး ဖျက်လိုက်ပါက Auto-shrink ဖြစ်သည်။
