---
title: "၂။ Storage Classes, Lifecycle & Performance"
description: "EFS Standard vs One Zone၊ Infrequent Access (IA) စရိတ် လျှော့ချနည်း၊ General Purpose vs Max I/O နှင့် Elastic Throughput Mode"
---

# ၂။ Storage Classes, Lifecycle & Performance

## EFS Storage Classes နှိုင်းယှဉ်ချက် ဇယား

Amazon EFS တွင် ကုန်ကျစရိတ်နှင့် ရရှိနိုင်မှု (Availability) ပေါ် မူတည်၍ ရွေးချယ်နိုင်သော Storage Classes များ ရှိပါသည်:

| Storage Class | AZ ပြန့်နှံ့မှု | Availability | Durability | ကုန်ကျစရိတ် နှိုင်းယှဉ်ချက် | အဓိက အသုံးချပုံ |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **EFS Standard** | **Multi-AZ** (3+ AZs) | 99.99% | 11 9s | Standard Rate ($0.30/GB) | **Default ရွေးချယ်မှု။** Production Web Application များ၊ Multi-AZ High Availability |
| **EFS One Zone** | **Single AZ သာ** | 99.9% | 11 9s | **၄၇% သက်သာသည်** ($0.16/GB) | Development/Testing ပတ်ဝန်းကျင်၊ AZ ပျက်စီးသွားပါက ဒေတာဆုံးရှုံးနိုင်ခြေကို လက်ခံနိုင်သော အခြေအနေ |
| **EFS Standard-IA** | **Multi-AZ** | 99.99% | 11 9s | **၉၂% အထိ သက်သာသည်** ($0.025/GB + Read Fee) | ရက် ၃၀ ကျော် အသုံးနည်းသော်လည်း ရံဖန်ရံခါ Multi-AZ ဖွင့်ဖတ်ရမည့် ဖိုင်ဟောင်းများ |
| **EFS One Zone-IA** | **Single AZ** | 99.9% | 11 9s | အလွန်သက်သာသည် ($0.013/GB + Read Fee) | Dev/Test အတွက် အသုံးနည်းသော ဖိုင်ဟောင်းများ |

---

## 🔄 EFS Lifecycle Management

EFS Lifecycle Management ဖွင့်ထားပါက လူကိုယ်တိုင် စီမံစရာမလိုဘဲ ဖိုင်များကို စရိတ်သက်သာသော **Infrequent Access (IA)** သို့ အလိုအလျောက် ရွှေ့ပေးပါသည်:

- **Transition to IA:** ဖိုင်တစ်ခုကို ၇ ရက်၊ ၁၄ ရက်၊ ၃၀ ရက်၊ ၆၀ ရက် သို့မဟုတ် ၉၀ ရက်အတွင်း မည်သူမျှ မဖွင့်ဖတ်ပါက EFS IA သို့ အလိုအလျောက် ရွှေ့ပြောင်းပေးသည်။
- **Transition back to Standard:** ဖိုင်တစ်ခုကို IA မှ ပြန်လည်ဖွင့်ဖတ်လိုက်သည်နှင့် တစ်ပြိုင်နက် **EFS Standard သို့ အလိုအလျောက် ပြန်ရောက်သွားစေရန် (Read-access transition)** ဖွင့်ထားနိုင်ပါသည်။

---

## ⚙️ Performance Modes (စွမ်းဆောင်ရည် စနစ် ၂ မျိုး)

| Performance Mode | အဓိက အားသာချက် | ကန့်သတ်ချက် | အသင့်တော်ဆုံး Workloads |
| :--- | :--- | :--- | :--- |
| **General Purpose** (Default) | **အလွန်မြန်ဆန်သော Latency (Sub-millisecond)** | Max I/O ထက် IOPS ကန့်သတ်ချက်ရှိသည် | Web Servers, CMS (WordPress), Content Management, Development tools |
| **Max I/O** | **အကန့်အသတ်မရှိ မြင့်မားသော IOPS & Scale** | Latency အနည်းငယ် ပိုကြာသည် | Big Data Analytics, Media processing, Parallel cluster computing (10,000+ nodes) |

---

## 🚀 Throughput Modes (ဒေတာ စီးဆင်းမှု စနစ် ၃ မျိုး)

1. **Bursting Throughput (Default):** Storage ပမာဏ ကြီးလေလေ Throughput မြန်လေလေ ဖြစ်သည်။ (Storage 1 TB လျှင် 50 MB/s baseline throughput ရရှိပြီး 100 MB/s အထိ burst လုပ်နိုင်သည်)။
2. **Provisioned Throughput:** Storage Size သေးငယ်သော်လည်း (ဥပမာ- 10 GB သာရှိသော်လည်း) Throughput ကို 100 MB/s သို့မဟုတ် 500 MB/s ဟု ပုံသေ ပေးချေ၍ ကြိုတင် သတ်မှတ်ထားခြင်း။
3. **Elastic Throughput (AWS Recommended):** Application ၏ Traffic အတက်အကျအပေါ် မူတည်၍ AWS က Throughput ကို **အလိုအလျောက် Auto-tune** ချိန်ညှိပေးသည်။ Traffic ကို ကြိုမခန့်မှန်းနိုင်သော Spiky Workloads များအတွက် အကောင်းဆုံး ဖြစ်ပါသည်။
