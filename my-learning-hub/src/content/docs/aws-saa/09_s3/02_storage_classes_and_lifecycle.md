---
title: "၂။ Storage Classes & Lifecycle Rules"
description: "S3 Storage Classes နှိုင်းယှဉ်ချက် (Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier) နှင့် Lifecycle Rules ဖြင့် ကုန်ကျစရိတ် လျှော့ချနည်း"
---

# ၂။ Storage Classes & Lifecycle Rules

## S3 Storage Classes နှိုင်းယှဉ်ချက် ဇယား

S3 တွင် Data များ၏ အသုံးပြုမှုပုံစံ (Access Pattern) ပေါ် မူတည်၍ ကုန်ကျစရိတ် အသက်သာဆုံးဖြစ်စေရန် Storage Classes အမျိုးမျိုး ခွဲခြားထားပါသည်-

| Storage Class | Durability | Availability | AZs အရေအတွက် | Retrieval Fee | အဓိက အသုံးချပုံ & SAA-C03 Keyword |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **S3 Standard** | 11 9s | 99.99% | >= 3 AZs | မရှိပါ | မကြာခဏ အသုံးပြုသော Active Data, Web Assets, APIs |
| **S3 Intelligent-Tiering** | 11 9s | 99.9% | >= 3 AZs | မရှိပါ (Auto Tiering) | Access pattern ကို ကြိုမသိနိုင်သော ဒေတာများ (No operational overhead) |
| **S3 Standard-IA** | 11 9s | 99.9% | >= 3 AZs | ရှိသည် (per GB) | အသုံးနည်းသော်လည်း လိုအပ်ပါက ချက်ချင်း ဖွင့်ဖတ်ရမည့် Disaster Recovery backups |
| **S3 One Zone-IA** | 11 9s | 99.5% | **1 AZ သာ** | ရှိသည် (per GB) | ပြန်ထုတ်ယူရလွယ်ကူပြီး AZ တစ်ခု ပျက်စီးသွားပါက ပျောက်ဆုံးခွင့်ရှိသော Secondary backups |
| **Glacier Instant Retrieval** | 11 9s | 99.9% | >= 3 AZs | ရှိသည် (Milliseconds) | တစ်နှစ်လျှင် ၁ ကြိမ်ခန့်သာ ကြည့်သော်လည်း ချက်ချင်း ms ဖြင့် လိုအပ်သော ဆေးမှတ်တမ်းများ |
| **Glacier Flexible Retrieval** | 11 9s | 99.9% | >= 3 AZs | မိနစ်/နာရီ ကြာသည် | 1 to 5 mins (Expedited) သို့မဟုတ် 3 to 5 hours (Standard) ခွင့်ပြုနိုင်သော မော်ကွန်းများ |
| **Glacier Deep Archive** | 11 9s | 99.9% | >= 3 AZs | ၁၂ နာရီ ကြာသည် | ဈေးအသက်သာဆုံး ($0.00099/GB)၊ ဥပဒေစည်းမျဉ်းအရ ၇ နှစ်မှ ၁၀ နှစ် သိမ်းရမည့် ဒေတာများ |

---

## 🤖 S3 Intelligent-Tiering ဆိုတာဘာလဲ?

Data များ၏ access frequency ကို ကြိုမသိနိုင်သောအခါ AWS သည် Access pattern ပေါ်မူတည်၍ Storage Class များကို အလိုအလျောက် ရွှေ့ပြောင်းပေးသည်:
- **Frequent Access Tier:** ဖိုင်တင်စတွင် စတင်သည်။
- **Infrequent Access Tier:** ရက် ၃၀ မသုံးပါက အလိုအလျောက် ရွှေ့ပြီး ၄၀% သက်သာစေသည်။
- **Archive Instant Access Tier:** ရက် ၉၀ မသုံးပါက အလိုအလျောက် ရွှေ့ပြီး ၆၈% သက်သာစေသည်။
- **Optional Deep Archive Tiers:** ရက် ၁၈၀ မသုံးပါက Deep Archive သို့ ရွှေ့ပေးသည်။

> **SAA-C03 သော့ချက်:** အကယ်၍ မေးခွန်းတွင် *"Unknown or unpredictable access patterns with zero operational overhead and no retrieval fee"* ဟု ပါရှိပါက အဖြေသည် **S3 Intelligent-Tiering** ဖြစ်ပါသည်။

---

## 🔄 S3 Lifecycle Rules (အလိုအလျောက် သက်တမ်း စီမံခန့်ခွဲခြင်း)

ဖိုင်များကို Manual လိုက်လံ မဖျက်ရဘဲ Lifecycle Policies သတ်မှတ်၍ အလိုအလျောက် ရွှေ့ပြောင်း/ဖျက်ပစ်နိုင်ပါသည်-

```
[ Day 0: Object Created ] ──► S3 Standard
                                   │
                                   ▼ (After 30 Days)
                              S3 Standard-IA
                                   │
                                   ▼ (After 90 Days)
                              S3 Glacier Flexible Retrieval
                                   │
                                   ▼ (After 365 Days)
                              S3 Glacier Deep Archive
                                   │
                                   ▼ (After 2555 Days / 7 Years)
                              Permanently Deleted (Expired)
```

### 1. Transition Actions (အဆင့် လျှော့ချခြင်း)
- ဖိုင်တစ်ခုကို S3 Standard မှ Standard-IA သို့ ပြောင်းရန် အနည်းဆုံး **30 days** ကြာမြင့်ရမည်။
- Standard-IA မှ Glacier သို့ ပြောင်းရန် နောက်ထပ် **30 days** ကြာမြင့်ရမည်။

### 2. Expiration Actions (ဖျက်ပစ်ခြင်း)
- ဖိုင်များကို သတ်မှတ်ရက်ကျော်လွန်ပါက အပြီးတိုင် ဖျက်ပစ်ခြင်း (Permanent Delete)။
- Versioning ဖွင့်ထားပါက **Noncurrent Version Expiration** (ဥပမာ- ယခင် Version အဟောင်းများကို ရက် ၆၀ ကျော်ပါက အလိုအလျောက် ဖျက်ပစ်ခြင်း)။

### 3. Abort Incomplete Multipart Uploads
- Multipart Upload တင်နေစဉ် အကြောင်းအမျိုးမျိုးကြောင့် မပြီးပြတ်ဘဲ ကျန်နေခဲ့သော ဖိုင်အပိုင်းအစများ (Incomplete Parts) သည် S3 တွင် နေရာယူ၍ ပိုက်ဆံကုန်ကျနေတတ်သည်။
- Lifecycle rule တွင် **"Abort incomplete multipart uploads after 7 days"** ထည့်သွင်းခြင်းဖြင့် မလိုအပ်ဘဲ ငွေကုန်ကျမှုကို ရပ်တန့်နိုင်ပါသည်။
