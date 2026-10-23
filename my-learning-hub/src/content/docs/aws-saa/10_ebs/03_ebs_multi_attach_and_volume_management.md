---
title: "၃။ Multi-Attach & Volume Management"
description: "EBS Multi-Attach (io1/io2)၊ Elastic Volumes ဖြင့် Zero Downtime Volume ပြင်ဆင်ခြင်းနှင့် EBS Volume ကို အခြား AZ သို့ ရွှေ့ပြောင်းခြင်း"
---

# ၃။ Multi-Attach & Volume Management

## 🔗 EBS Multi-Attach ဆိုတာဘာလဲ?

သမားရိုးကျ EBS Volume တစ်ခုသည် EC2 Instance တစ်ခုတည်းတွင်သာ attach လုပ်နိုင်သော်လည်း **EBS Multi-Attach** ကို အသုံးပြုပါက **Single EBS Volume တစ်ခုတည်းကို EC2 Instances ၁၆ ခုအထိ တပြိုင်နက် ချိတ်ဆက် (Concurrent Read/Write)** အသုံးပြုနိုင်ပါသည်:

```
┌────────────────────────────────────────────────────────┐
│             Availability Zone: us-east-1a              │
│                                                        │
│  ┌──────────────────┐            ┌──────────────────┐  │
│  │ EC2 Instance #1  │            │ EC2 Instance #2  │  │
│  └────────┬─────────┘            └────────┬─────────┘  │
│           │                               │            │
│           └───────────────┬───────────────┘            │
│                           │ (Concurrent Multi-Attach)  │
│                           ▼                            │
│           ┌───────────────────────────────┐            │
│           │ EBS io1 / io2 Volume          │            │
│           │ (Clustered Filesystem: GFS2)  │            │
│           └───────────────────────────────┘            │
└────────────────────────────────────────────────────────┘
```

### Multi-Attach ၏ အရေးကြီးသော စည်းမျဉ်းများ (SAA-C03 Critical Points):
1. **Supported Volume Types:** **io1** နှင့် **io2** (Provisioned IOPS SSD) များတွင်သာ ရရှိပြီး၊ gp2/gp3 သို့မဟုတ် HDD များတွင် Multi-Attach မရပါ။
2. **Same AZ Restriction:** ချိတ်ဆက်မည့် EC2 Instances များ အားလုံးသည် EBS Volume နှင့် **တူညီသော Availability Zone (Same AZ)** အတွင်း ရှိရပါမည်။
3. **Cluster-Aware Filesystem:** သမားရိုးကျ Linux ext4 သို့မဟုတ် Windows NTFS filesystem များသည် server များစွာမှ တပြိုင်နက် write လုပ်ပါက data corruption (ဒေတာပျက်စီးခြင်း) ဖြစ်စေသည်။ ထို့ကြောင့် **Cluster-aware Filesystem (ဥပမာ- GFS2 သို့မဟုတ် Oracle RAC)** ကို မဖြစ်မနေ အသုံးပြုရပါမည်။

---

## 🔧 Elastic Volumes (Zero-Downtime Volume Resize)

AWS Elastic Volumes စွမ်းရည်ကြောင့် EC2 Server ကို **Stop လုပ်စရာမလိုဘဲ (Zero Downtime)** Volume Configuration များကို အချိန်မရွေး ပြင်ဆင်နိုင်ပါသည်:

- **Increase Size:** Storage 100 GB မှ 500 GB သို့ ချက်ချင်း တိုးမြှင့်ခြင်း။
- **Change Volume Type:** ကုန်ကျစရိတ်သက်သာပြီး စွမ်းဆောင်ရည်မြင့်သော `gp2` မှ `gp3` သို့ တိုက်ရိုက် ပြောင်းလဲခြင်း။
- **Adjust IOPS & Throughput:** လိုအပ်ချက်အရ IOPS ကို တိုးမြှင့်ခြင်း/လျှော့ချခြင်း။

> **OS Filesystem Resize:** AWS Console မှ EBS Size တိုးပြီးပါက Linux Server အတွင်းသို့ SSH ဝင်၍ `growpart` နှင့် `resize2fs` (ext4) သို့မဟုတ် `xfs_growfs` (xfs) command များ run ပေးရပါမည်။

---

## 🚚 EBS Volume ကို အခြား AZ သို့ ရွှေ့ပြောင်းနည်း

EBS Volume များသည် AZ တစ်ခုအတွင်းသာ ကန့်သတ်ထားသောကြောင့် Volume တစ်ခုကို AZ-A မှ AZ-B သို့ ရွှေ့ပြောင်းလိုပါက အောက်ပါအဆင့် ၃ ဆင့်ကို လုပ်ဆောင်ရပါသည်:

```
[ EBS Volume in AZ-A ]
         │ (Step 1: Take Snapshot)
         ▼
[ EBS Snapshot in S3 ]
         │ (Step 2: Create Volume from Snapshot)
         ▼
[ New EBS Volume in AZ-B ] ──► (Step 3: Attach to EC2 in AZ-B)
```

အခြား AWS Region သို့ ရွှေ့ပြောင်းလိုပါကလည်း Snapshot ကို Target Region သို့ Copy ကူးပြီးမှ ထို Region တွင် Volume အသစ် ပြန်တည်ဆောက်နိုင်ပါသည်။
