---
title: "Blameless Postmortem Template"
description: "Standardized SRE blameless postmortem template with timeline, 5-whys, and action items"
---


> **စနစ်တစ်ခုလုံး၏ အားနည်းချက်ကို ရှာဖွေဖော်ထုတ်ပြီး ထပ်မံမဖြစ်ပွားစေရန် ကာကွယ်မည့် စံပြ ပုံစံခွက်**

---

## 📌 Incident Summary
- **Incident Title**: SEV-1: Payment Gateway Outage due to Database Connection Saturation
- **Date & Time**: 2026-10-25 14:00 UTC - 14:45 UTC (ကြာချိန်: ၄၅ မိနစ်)
- **Incident Commander**: SRE Lead
- **Services Affected**: `payment-service`, `checkout-api`
- **Customer Impact**: သုံးစွဲသူ ခန့်မှန်းခြေ ၃,၅၀၀ ဦး ငွေချေ၍ မရဖြစ်ခဲ့ပြီး $15,000 ခန့် ဝင်ငွေ နှောင့်နှေးခဲ့သည်။

---

## ⏱️ Timeline (အချိန်မှတ်တမ်း)
- **14:00 UTC**: Deployment v2.4.0 ကို Production သို့ လွှင့်တင်ခဲ့သည်။
- **14:05 UTC**: PagerDuty Alert `HighDatabaseConnections` စတင် အသံမြည်ခဲ့သည်။
- **14:10 UTC**: On-Call SRE မှ စတင် စစ်ဆေးပြီး SEV-1 ကြေညာကာ War Room ဖွင့်ခဲ့သည်။
- **14:20 UTC**: DB Connection Pool ပြည့်နေပြီး Database မတုံ့ပြန်နိုင်တော့သည်ကို တွေ့ရှိခဲ့သည်။
- **14:30 UTC**: v2.4.0 တွင် Connection Leak ဖြစ်နေသော Bug ကြောင့်ဖြစ်ကြောင်း အတည်ပြုပြီး `kubectl rollout undo` ဖြင့် rollback ပြုလုပ်ခဲ့သည်။
- **14:45 UTC**: Connection များ ပုံမှန် ပြန်ဖြစ်သွားပြီး ဝန်ဆောင်မှု အပြည့်အဝ ပြန်လည်ရရှိခဲ့သည်။

---

## ❓ 5 Whys Root Cause Analysis (၅ ဆင့် အကြောင်းအရင်း ရှာဖွေခြင်း)
1. **အဘယ်ကြောင့် Payment Gateway down ဖြစ်သွားသနည်း?** ➜ Database connection pool ပြည့်သွား၍ query များ timeout ဖြစ်သွားသောကြောင့်။
2. **အဘယ်ကြောင့် Connection pool ပြည့်သွားသနည်း?** ➜ v2.4.0 ကုဒ်အသစ်တွင် DB connection ကို close မလုပ်သော bug ပါသွားသောကြောင့်။
3. **အဘယ်ကြောင့် အဆိုပါ bug ကို မသိခဲ့သနည်း?** ➜ Unit Test တွင် connection leak test case မပါဝင်ခဲ့သောကြောင့်။
4. **အဘယ်ကြောင့် Staging တွင် မတွေ့ခဲ့သနည်း?** ➜ Staging ပတ်ဝန်းကျင်တွင် automated load test မပြုလုပ်ခဲ့သောကြောင့်။
5. **အဘယ်ကြောင့် စနစ်သည် မပျက်ကျမီ အလိုအလျောက် သတိမပေးခဲ့သနည်း?** ➜ DB connection 80% ကျော်ပါက သတိပေးသော Alert threshold မရှိခဲ့သောကြောင့်။

---

## ✅ Action Items & Preventative Measures (ကာကွယ်ရေး အစီအမံများ)

| အမှတ် | Action Item (လုပ်ဆောင်ချက်) | အမျိုးအစား | တာဝန်ယူသူ | သတ်မှတ်ရက် |
|---|---|---|---|---|
| **1** | Connection leak test case များကို CI unit tests တွင် ထည့်သွင်းရန် | Preventative | Backend Team | 2026-10-28 |
| **2** | Staging ပတ်ဝန်းကျင်တွင် PR တိုင်းအတွက် Automated Load Test ထည့်ရန် | Preventative | DevOps Team | 2026-11-02 |
| **3** | RDS Connection 75% ကျော်ပါက သတိပေးမည့် Prometheus Alert တပ်ဆင်ရန် | Monitoring | SRE Team | 2026-10-26 |
| **4** | RDS Proxy ထည့်သွင်းပြီး Connection Pooling စနစ် ခိုင်မာအောင် ပြုလုပ်ရန် | Architectural | Cloud Team | 2026-11-15 |
