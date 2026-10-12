---
title: Incident Response Procedures & Automation
description: Systems Manager Automation, EventBridge Rules, Lambda Automation, Incident Response 4-Step Runbook
---

## ၁။ EventBridge & Lambda Automation

ညဘက် ရုံးပိတ်ချိန်တွင် Non-production EC2 များကို အလိုအလျောက် Stop လုပ်ပြီး မနက်ပိုင်းတွင် ပြန် Start လုပ်ပေးသော Serverless Automation။

---

## ၂။ Incident Response 4-Step Runbook

1. **Detect (သိရှိခြင်း):** CloudWatch Alarm မှ Alert တက်လာခြင်း။
2. **Triage (အကဲဖြတ်ခြင်း):** Production Downtime လား၊ Performance နှေးကွေးမှုလား ခွဲခြားခြင်း။
3. **Mitigate (ထိန်းသိမ်းသက်သာစေခြင်း):** Rollback ပြုလုပ်ခြင်း သို့မဟုတ် Auto-recovery လုပ်ဆောင်ခြင်း။
4. **Post-Mortem (သုံးသပ်ခြင်း):** Root Cause Analysis (RCA) ပြုလုပ်ပြီး ထပ်မဖြစ်စေရန် ကာကွယ်ခြင်း။
