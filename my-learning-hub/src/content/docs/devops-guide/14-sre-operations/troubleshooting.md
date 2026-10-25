---
title: "SRE Production Operations Troubleshooting Guide"
description: "Resolving cascading failures, alert fatigue, split-brain, and runaway background processes (မြန်မာဘာသာ)"
---


> **လုပ်ငန်းခွင်သုံး SRE & Operations တွင် အဖြစ်များဆုံး စနစ်ပြဿနာ ၅ ခုနှင့် အရေးပေါ် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Cascading Failures (ကွင်းဆက် ပျက်စီးမှုများ)

### လက္ခဏာ (Symptom):
ဆာဗာတစ်ခု ပျက်ကျသွားပြီးနောက် ကျန်ရှိသော ဆာဗာများပါ traffic ဝန်မခံနိုင်ဘဲ တစ်လုံးပြီးတစ်လုံး ဆက်တိုက် ပျက်ကျသွားခြင်း (Domino effect)။

### ဖြေရှင်းနည်း (Fix):
1. **Circuit Breakers ဖွင့်ပါ**: Service အချင်းချင်း ချိတ်ဆက်မှုတွင် Circuit breaker တပ်ဆင်ပြီး မတုံ့ပြန်နိုင်သော backend သို့ query ထပ်မပို့အောင် ဖြတ်တောက်ပါ။
2. **Rate Limiting သတ်မှတ်ပါ**: Nginx သို့မဟုတ် Cloudflare တွင် User requests များကို rate limit လုပ်ပါ။
3. **Graceful Degradation**: အရေးမကြီးသော features များ (ဥပမာ Recommendation engine, Real-time reviews) ကို ခေတ္တ ပိတ်ထားပြီး Core checkout service ကိုသာ ဦးစားပေးပါ။

---

## 🚨 ပြဿနာ ၂: Runaway Cron Job / Background Worker Loop

### လက္ခဏာ (Symptom):
ဆာဗာတွင် CPU 100% အမြဲတက်နေပြီး အချိန်တိုအတွင်း queue messages သန်းနှင့်ချီ စုပြုံသွားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
# ပြဿနာဖြစ်စေသော runaway process ကို ရှာဖွေပါ
top -b -n 1 | head -n 20

# Safe terminate (SIGTERM 15) ပေးပါ
kill -15 <PID>

# မရပါက အတင်းအကျပ် သတ်ပါ (SIGKILL 9)
kill -9 <PID>

# Redis queue ထဲမှ dead jobs များကို flush/clear ပြုလုပ်ပါ
redis-cli -h <REDIS_HOST> FLUSHDB
```

---

## 🚨 ပြဿနာ ၃: Alert Fatigue (သတိပေးချက်များ လွန်ကဲစွာ ရောက်ရှိလာခြင်း)

### လက္ခဏာ (Symptom):
Slack သို့မဟုတ် PagerDuty တွင် နေ့စဉ် alert ပေါင်းရာနှင့်ချီ ရောက်လာသဖြင့် အင်ဂျင်နီယာများမှ မဖတ်တော့ဘဲ အမှန်တကယ် SEV-1 ဖြစ်ချိန်တွင် လွတ်သွားခြင်း။

### ဖြေရှင်းနည်း (Fix):
1. Actionable မဟုတ်သော alert များကို ချက်ချင်း mute လုပ်ပါ သို့မဟုတ် ဖျက်ပစ်ပါ။
2. Warning alert များကို PagerDuty (ဖုန်းခေါ်သံ) မပေးဘဲ Slack digest channel သို့သာ ပို့ပါ။
3. PagerDuty တွင် အမှန်တကယ် User impact ရှိသော SEV-1/SEV-2 alerts များကိုသာ ဖုန်းခေါ်ဆိုခွင့် ပေးပါ။

---

## 🚨 ပြဿနာ ၄: Database Connection Pool Exhaustion

### ဖြေရှင်းနည်း (Fix):
1. AWS RDS Proxy ကို အသုံးပြုပြီး Lambda သို့မဟုတ် Web Apps များ၏ connections များကို Multiplexing ပြုလုပ်ပါ။
2. Idle connections များကို auto-kill လုပ်မည့် `wait_timeout` ကို လျှော့ချပါ။

---

## 🚨 ပြဿနာ ၅: Deployment အသစ်ကြောင့် Database Migration Failure ဖြစ်ခြင်း

### ဖြေရှင်းနည်း (Fix):
1. **Never Make Backward-Incompatible Schema Changes**: Column ဖျက်ခြင်း သို့မဟုတ် rename လုပ်ခြင်းကို migration တစ်ခုတည်းတွင် မလုပ်ပါနှင့် (Expand and Contract Pattern ကို သုံးပါ)။
2. အရေးပေါ် rollback ပြုလုပ်ပြီး database snapshot မှ point-in-time restore ပြန်လည် ရယူပါ။
