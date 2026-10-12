---
title: Drift Detection, Idempotency & Multi-Environment IaC
description: Configuration Drift ရှာဖွေခြင်း, Idempotency သဘောတရား, Secrets Security နှင့် Reusable Dev/Staging/Prod
---

## ၁။ Drift Detection & Idempotency

- **Drift Detection:** Cloud Console UI မှ လက်ဖြင့် ခိုးပြင်ထားသော အချက်အလက်များကို Code နှင့် နှိုင်းယှဉ်ရှာဖွေခြင်း။
- **Idempotency:** Code ကို အကြိမ် ၁၀၀ Run လျှင်လည်း ရလဒ်သည် တူညီနေခြင်း (No unintended duplicates)။

---

## ၂။ Reusable Multi-Environments (Dev / Staging / Prod)

Terraform Workspaces သို့မဟုတ် Directory ခွဲ၍ Parameter ပြောင်းရုံဖြင့် Dev, Staging, Production ပတ်ဝန်းကျင်များကို Code တစ်ခုတည်းဖြင့် ထပ်တူပွား တည်ဆောက်နိုင်သည်။
