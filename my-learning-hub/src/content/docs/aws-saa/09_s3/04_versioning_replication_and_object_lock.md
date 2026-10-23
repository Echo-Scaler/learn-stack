---
title: "၄။ Versioning, Replication & Object Lock"
description: "S3 Versioning၊ Delete Marker၊ MFA Delete၊ Cross-Region Replication (CRR) နှင့် S3 Object Lock (WORM Model: Governance vs Compliance Mode)"
---

# ၄။ Versioning, Replication & Object Lock

## S3 Versioning (ဗားရှင်း ထိန်းသိမ်းခြင်း)

S3 Versioning ကို ဖွင့်ထားပါက ဖိုင်တစ်ခုတည်းကို overwrite လုပ်မိခြင်း သို့မဟုတ် မတော်တဆ ဖျက်မိခြင်းမှ ကာကွယ်နိုင်ပါသည်:

- ဖိုင်တစ်ခုကို ပြင်ဆင်ပြီး ထပ်တင်ပါက နဂိုဖိုင် ပျောက်မသွားဘဲ **Version ID** အသစ်တစ်ခုဖြင့် တိုးလာသည်။
- ဖိုင်တစ်ခုကို သမားရိုးကျ **DELETE** လုပ်ပါက အမှန်တကယ် ဖျက်မပစ်ဘဲ **Delete Marker** တစ်ခုသာ တင်ပေးလိုက်သည်။ Delete Marker ကို ပြန်ဖျက်လိုက်ပါက မူလဖိုင် ပြန်လည် ပေါ်လာမည်ဖြစ်သည်။ (Soft Delete)
- ဖိုင်ဗားရှင်းတစ်ခုကို အပြီးတိုင် ဖျက်ပစ်လိုပါက **Version ID ကို တိကျစွာ သတ်မှတ်၍ ဖျက်မှသာ** Permanent Delete ဖြစ်သည်။

> **မှတ်ချက်:** Versioning ကို တစ်ကြိမ် ဖွင့်ပြီးပါက လုံးဝ Disable လုပ်၍ မရတော့ဘဲ **Suspend (ယာယီရပ်တန့်ခြင်း)** သာ ပြုလုပ်နိုင်ပါသည်။

---

## 🔒 MFA Delete (Multi-Factor Authentication Delete)

အရေးကြီးသော ကုမ္ပဏီဒေတာများကို မသမာသူ သို့မဟုတ် အမှားအယွင်းကြောင့် ဖျက်ဆီးခံရခြင်းမှ ကာကွယ်ရန်:
- Version အဟောင်းများကို အပြီးတိုင် ဖျက်ရန် သို့မဟုတ် Versioning ကို Suspend လုပ်ရန် **MFA Token Code** ရိုက်ထည့်ရန် လိုအပ်သည်။
- **AWS CLI / SDK** ဖြင့်သာ Enable လုပ်နိုင်ပြီး Root Account ပိုင်ရှင်သာ ပြုလုပ်နိုင်ပါသည်။

---

## 🌍 S3 Replication: CRR vs SRR

အခြား Bucket တစ်ခုသို့ ဒေတာများကို အလိုအလျောက် asynchronous ကူးယူပေးသော နည်းပညာ ဖြစ်ပါသည်:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     Source Bucket (US-East-1)   │           │ Destination Bucket (AP-East-1)  │
│      • Versioning: ENABLED      │ ────────► │      • Versioning: ENABLED      │
│      • Object A (v1, v2)        │  (CRR)    │      • Replicated Object A      │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

| အမျိုးအစား | နာမည်အပြည့်အစုံ | အဓိက အသုံးချပုံ & SAA-C03 Focus |
| :--- | :--- | :--- |
| **CRR** | **Cross-Region Replication** | Disaster Recovery (DR), မတူညီသော နိုင်ငံများရှိ User များအတွက် Low Latency ဖြင့် ဒေတာဖတ်စေခြင်း |
| **SRR** | **Same-Region Replication** | Log Aggregation, Dev နှင့် Prod Bucket အကြား ဒေတာမျှဝေခြင်း, Single Region အတွင်း Data Isolation |

### Replication အတွက် မဖြစ်မနေ လိုအပ်ချက်များ:
1. Source နှင့် Destination Bucket နှစ်ခုစလုံးတွင် **Versioning ကို Enable** လုပ်ထားရမည်။
2. AWS IAM Role တွင် Source မှ ဖတ်ပြီး Destination သို့ ရေးသားနိုင်သော ခွင့်ပြုချက် (Replication Role) ပေးထားရမည်။
3. **S3 Replication Time Control (S3 RTC):** SLA အရ ဒေတာများ၏ 99.9% ကို **၁၅ မိနစ်အတွင်း** ကူးယူပြီးစီးစေရန် အာမခံသော Enterprise Feature ဖြစ်သည်။

---

## 🛡️ S3 Object Lock (WORM Model)

**WORM = Write Once, Read Many**  
ဘဏ္ဍာရေး စည်းမျဉ်းများ (SEC Rule 17a-4, FINRA) နှင့် ဥပဒေရေးရာအရ သတ်မှတ်ထားသော ကာလတစ်ခုအတွင်း မည်သူမျှ (AWS Root Account ပင်လျှင်) ဖိုင်ကို ပြင်ဆင်ခြင်း၊ ဖျက်ပစ်ခြင်း မပြုနိုင်စေရန် ပိတ်ပင်သော စနစ် ဖြစ်သည်။

| စနစ် (Mode) | အဓိက သဘောတရား | စည်းမျဉ်း ကျော်လွှားခွင့် (Override) |
| :--- | :--- | :--- |
| **Governance Mode** | အချို့သော အထူး IAM Permission (`s3:BypassGovernanceRetention`) ရှိသူများသာ Retention Period မတိုင်မီ ဖိုင်ကို ဖျက်ခွင့် သို့မဟုတ် သက်တမ်း လျှော့ခွင့်ရှိသည်။ | အခွင့်အာဏာရှိသော Admin များ ဖျက်ခွင့်ရှိသည်။ |
| **Compliance Mode** | **Root User အပါအဝင် မည်သူမျှ ဖိုင်ကို လုံးဝ ဖျက်ခွင့်၊ သက်တမ်း လျှော့ခွင့် မရှိပါ။** AWS Support အဖွဲ့ပင်လျှင် ဖျက်ပေးနိုင်စွမ်း မရှိပါ။ | မည်သူမျှ ကျော်လွှား၍ မရပါ။ (Strict WORM) |
| **Legal Hold** | ရက်စွဲ သတ်မှတ်ချက် မလိုဘဲ အမှုရင်ဆိုင်နေစဉ် ကာလအတွင်း ဖိုင်ကို မဖျက်နိုင်ရန် On/Off switch ဖြင့် ချိတ်ဆွဲထားခြင်း။ | Legal Hold ကို Off မလုပ်မချင်း ဖျက်၍မရပါ။ |
