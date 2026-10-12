---
title: Configuration Automation & Preventing Drift
description: User Automation, Package Management, Service Health Checks နှင့် Configuration Drift ကို ကာကွယ်ခြင်း
---

## ၁။ Configuration Drift ဆိုတာဘာလဲ?

Engineer များက Server ထဲသို့ SSH ဝင်ပြီး လက်ဖြင့် package သွင်းခြင်း၊ config ပြင်ခြင်းများ ပြုလုပ်မိသောအခါ Server များအချင်းချင်း မတူညီတော့ဘဲ ကွဲပြားသွားခြင်း (Drift ဖြစ်ခြင်း) ကို ခေါ်သည်။
Ansible သို့မဟုတ် IaC ဖြင့် အမြဲ Run ခြင်းဖြင့် Configuration Drift ကို ကာကွယ်နိုင်သည်။
