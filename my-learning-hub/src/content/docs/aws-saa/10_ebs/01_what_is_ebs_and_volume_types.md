---
title: "၁။ EBS ဆိုတာဘာလဲ & Volume Types"
description: "Amazon EBS (Elastic Block Store) ၏ သဘောတရား၊ Single AZ Scope၊ gp3 vs gp2၊ io2 Block Express၊ st1 vs sc1 Volume Types အသေးစိတ် နှိုင်းယှဉ်ချက်"
---

# ၁။ EBS ဆိုတာဘာလဲ & Volume Types

## Amazon EBS ဆိုတာဘာလဲ?

**Amazon EBS (Elastic Block Store)** — **High-performance block storage volumes for Amazon EC2.**

Amazon EBS သည် EC2 Instance တစ်ခုအတွက် Hard Disk (သို့မဟုတ် USB Drive) ကဲ့သို့ ချိတ်ဆက်အသုံးပြုရသော **Network-Attached Block Storage** ဖြစ်ပါသည်။

- **Network-attached:** EC2 Instance ၏ Motherboard ပေါ်တွင် ရုပ်ပိုင်းဆိုင်ရာ တပ်ဆင်ထားခြင်း မဟုတ်ဘဲ Ultra-high-speed network ကြိုးဖြင့် ချိတ်ဆက်ထားသဖြင့် EC2 Instance ကို ရပ်တန့် (Stop) သို့မဟုတ် ဖျက်ပစ် (Terminate) လိုက်သော်လည်း EBS Volume ထဲရှိ Data များသည် ဆက်လက်တည်ရှိနေနိုင်ပါသည် (Persistent Storage)။
- **Single AZ Scope:** EBS Volume တစ်ခုသည် ၎င်းကို ဖန်တီးထားသော **Availability Zone (AZ) တစ်ခုတည်းတွင်သာ တည်ရှိပြီး** အခြား AZ သို့ တိုက်ရိုက် သွားရောက် attach လုပ်၍ မရပါ။

```
┌────────────────────────────────────────────────────────┐
│             Availability Zone: us-east-1a              │
│                                                        │
│  ┌───────────────────────┐    High-Speed Network Cable │
│  │ Amazon EC2 Instance   │◄─────────────────────────┐  │
│  │ (OS / Web App / DB)   │                          │  │
│  └───────────────────────┘                          │  │
│                                                     ▼  │
│                                        ┌───────────────┴───────────────┐
│                                        │ Amazon EBS Volume (gp3 / io2) │
│                                        │ (Filesystem: ext4, xfs, NTFS) │
│                                        └───────────────────────────────┘
└────────────────────────────────────────────────────────┘
```

---

## 💽 EBS Volume Types ၅ မျိုး နှိုင်းယှဉ်ချက် ဇယား

AWS EBS တွင် အဓိကအားဖြင့် **Solid State Drives (SSD)** နှင့် **Hard Disk Drives (HDD)** ဟူ၍ ၂ မျိုး ခွဲခြားထားပါသည်-

| Volume Type | နာမည်အပြည့်အစုံ | Volume Size | Max IOPS / Throughput | Boot Disk ဖြစ်နိုင်သလား | အဓိက အသုံးချပုံ & SAA-C03 Focus |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **gp3** | **General Purpose SSD (New)** | 1 GiB - 16 TiB | 16,000 IOPS / 1,000 MB/s | **Yes** | **Default ရွေးချယ်မှု။** Storage size မတိုးဘဲ IOPS နှင့် Throughput ကို သီးခြား တိုးနိုင်သည် (gp2 ထက် ၂၀% သက်သာ)။ |
| **gp2** | General Purpose SSD (Legacy) | 1 GiB - 16 TiB | 16,000 IOPS / 250 MB/s | **Yes** | IOPS သည် Storage Size ပေါ် မူတည်သည် (1 GB လျှင် 3 IOPS)။ |
| **io2** | **Provisioned IOPS SSD (Block Express)** | 4 GiB - 64 TiB | **256,000 IOPS** / 4,000 MB/s | **Yes** | **Sub-millisecond latency** လိုအပ်သော Mission-critical Databases (SAP HANA, Oracle, MS SQL Server)။ 99.999% durability။ |
| **st1** | **Throughput Optimized HDD** | 125 GiB - 16 TiB | 500 IOPS / 500 MB/s | **No (မရပါ)** | **Sequential I/O** များသော Big Data, Apache Kafka, EMR, Data Warehouses, Log Processing။ |
| **sc1** | **Cold HDD** | 125 GiB - 16 TiB | 250 IOPS / 250 MB/s | **No (မရပါ)** | အသုံးနည်းသော ဖိုင်များ၊ စရိတ် အသက်သာဆုံး သိမ်းဆည်းရန် HDD။ |

---

## 💡 SSD vs HDD အဓိက ကွာခြားချက်

1. **SSD (gp3, io2):** Small, Random I/O Operations များအတွက် အထူးသင့်လျော်သည်။ (ဥပမာ- OS Boot Drive များ၊ Transactional Database များ)။ Boot Volume အဖြစ် အသုံးပြုနိုင်သည်။
2. **HDD (st1, sc1):** Large, Streaming, Sequential I/O Operations များအတွက် အထူးသင့်လျော်သည်။ (ဥပမာ- Video rendering, Big Data Analytics)။ **သတိပြုရန်: HDD (st1, sc1) များကို OS Boot Volume အဖြစ် လုံးဝ အသုံးပြုခွင့် မရှိပါ!**
