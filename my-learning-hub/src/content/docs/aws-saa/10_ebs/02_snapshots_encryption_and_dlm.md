---
title: "၂။ Snapshots, Encryption & DLM"
description: "EBS Incremental Snapshots၊ Fast Snapshot Restore (FSR)၊ KMS Encryption နည်းလမ်းများနှင့် Amazon Data Lifecycle Manager (DLM)"
---

# ၂။ Snapshots, Encryption & DLM

## EBS Snapshots (အရန်သိမ်းဆည်းမှု စနစ်)

**EBS Snapshot** ဆိုသည်မှာ သတ်မှတ်ထားသော အချိန်ကာလတစ်ခုရှိ EBS Volume ၏ ဒေတာများကို **Point-in-time Backup** အဖြစ် မှတ်တမ်းတင် သိမ်းဆည်းခြင်း ဖြစ်ပါသည်။

- **Stored in Amazon S3:** EBS Snapshot များကို AWS ၏ 11 9s Durability ရှိသော Amazon S3 ပေါ်တွင် အလိုအလျောက် သိုလှောင်ထားသော်လည်း သင်၏ S3 Bucket List ထဲတွင် ပေါ်မည် မဟုတ်ဘဲ EBS Console အောက်တွင် စီမံရသည်။
- **Incremental Backup (ဆင့်ပွား အရန်သိမ်းခြင်း):** ပထမဆုံးရိုက်သော Snapshot (Base Snapshot) သာ Volume တစ်ခုလုံး အရွယ်အစားရှိပြီး၊ နောက်ပိုင်းရိုက်သော Snapshots များသည် ယခင် Snapshot မှ ပြောင်းလဲသွားသော **Block အသစ်များကိုသာ ဆင့်ပွားသိမ်းဆည်းပါသည် (Incremental)**။ ထို့ကြောင့် Storage စရိတ် အလွန်သက်သာသည်။

```
Day 1: 10 GB Data (Original)       ──► Snapshot 1: [10 GB Saved]
Day 2: 2 GB Changed + 8 GB Same   ──► Snapshot 2: [ 2 GB Saved Only]
Day 3: 1 GB Changed + 9 GB Same   ──► Snapshot 3: [ 1 GB Saved Only]
```

> **Snapshot ဖျက်ပစ်ခြင်း စည်းမျဉ်း:** Snapshot 2 ကို ဖျက်လိုက်သော်လည်း Snapshot 3 အတွက် လိုအပ်သော ဒေတာ block များ မပျက်စီးသွားပါ။ AWS သည် အခြား Snapshot များနှင့် မျှဝေသုံးစွဲနေသော blocks များကို အလိုအလျောက် ဆက်လက် ထိန်းသိမ်းပေးထားပါသည်။

---

## ⚡ Fast Snapshot Restore (FSR)

သမားရိုးကျ Snapshot မှ EBS Volume အသစ် ပြန်ဆောက်သောအခါ ဒေတာများကို S3 မှ ပထမဆုံးအကြိမ် ဆွဲယူဖတ်ရှုရသဖြင့် ကနဦးတွင် I/O Latency မြင့်မားတတ်သည် (Storage Pre-warming လိုအပ်ခြင်း)။
- **FSR (Fast Snapshot Restore)** ဖွင့်ထားပါက Volume ကို Restore လုပ်လိုက်သည်နှင့် တပြိုင်နက် **အမြင့်ဆုံး စွမ်းဆောင်ရည် (Maximum IOPS & Throughput) ချက်ချင်း အပြည့်အဝ ရရှိစေပါသည်**။

---

## 🔐 EBS Encryption (လုံခြုံရေး ကုဒ်ဝှက်ခြင်း)

EBS Volume တစ်ခုကို Encrypt လုပ်လိုက်ပါက အောက်ပါအချက်များ အလိုအလျောက် Encrypt ဖြစ်သွားပါသည်:
1. Volume ပေါ်ရှိ Data at Rest (ဖိုင်များ အားလုံး)
2. EC2 Instance နှင့် EBS Volume အကြား Network ပေါ်တွင် စီးဆင်းနေသော Data in Flight
3. ထို Volume မှ ရိုက်ကူးထားသော Snapshots များ အားလုံး
4. ထို Snapshots များမှ ပြန်လည်ထုတ်ယူဆောက်လုပ်သော Volumes များ အားလုံး

### Unencrypted Volume တစ်ခုကို Encrypted ဖြစ်အောင် ပြောင်းလဲနည်း (SAA-C03 Classic Question):
```
[ Unencrypted EBS Volume ]
            │ (Step 1: Take Snapshot)
            ▼
[ Unencrypted Snapshot ]
            │ (Step 2: Copy Snapshot & Check "Encrypt with KMS")
            ▼
[ Encrypted Snapshot ]
            │ (Step 3: Create Volume from Encrypted Snapshot)
            ▼
[ Encrypted EBS Volume ]
```

---

## ⏰ Amazon Data Lifecycle Manager (DLM)

လုပ်ငန်းခွင်တွင် နေ့စဉ် Snapshot များကို လူကိုယ်တိုင် လိုက်လံရိုက်ကူးရန် မလိုအပ်ဘဲ **Amazon DLM Policy** ရေးဆွဲ၍ အလိုအလျောက် စီမံနိုင်ပါသည်:
- **Tag-based Automation:** ဥပမာ `Environment: Production` ဟု Tag တပ်ထားသော Volume အားလုံးကို နေ့စဉ် ည ၁၂ နာရီတွင် Snapshot ရိုက်မည်။
- **Retention Schedule:** Snapshot အရေအတွက် ၁၄ ခု (၂ ပတ်စာ) သာ သိမ်းဆည်းပြီး ၁၄ ရက် ကျော်လွန်သော Snapshot အဟောင်းများကို အလိုအလျောက် ဖျက်ပစ်မည်။
- **Cross-Region Snapshot Copy:** သဘာဝဘေးအန္တရာယ် ကာကွယ်ရေး (DR) အတွက် အခြား AWS Region သို့လည်း Snapshot ကို အလိုအလျောက် ကူးယူပေးနိုင်သည်။
