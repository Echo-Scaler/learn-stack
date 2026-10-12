---
title: Deployment Strategies (Rolling, Blue/Green) & Automated Rollbacks
description: Rolling Deployment, Blue/Green Deployment, Database Migrations, Health Checks နှင့် Rollback Strategies
---

## ၁။ Rolling vs Blue/Green Deployment

- **Rolling Deployment:** Container/Server အဟောင်းများကို တစ်လုံးချင်း ဖျက်ပြီး အသစ်တစ်လုံးချင်း အစားထိုးလဲလှယ်သည် (Resources သက်သာသည်)။
- **Blue/Green Deployment:** Green Environment အသစ်တစ်ခုလုံးကို သီးသန့် တည်ဆောက်ပြီး စမ်းသပ်ကာ အဆင်ပြေမှ Load Balancer ဖြင့် Traffic ချက်ချင်း ပြောင်းပေးသည် (Zero Downtime, ချက်ချင်း Rollback လုပ်နိုင်သည်)။

---

## ၂။ Zero-Downtime Database Migration

Deployment Pipeline တွင် Container အသစ် မတက်မီ Backward-compatible DB Migrations (`php artisan migrate --force`) ကို သီးသန့် Step ဖြင့် အရင် Run ရမည်။ ALB Health Check မအောင်မြင်ပါက မူလ Task Definition သို့ အလိုအလျောက် Rollback ပြုလုပ်ရသည်။
