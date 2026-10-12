---
title: Infrastructure as Code (IaC) Concepts & Tooling
description: Cloud Automation, ClickOps vs IaC, Declarative vs Imperative, YAML, JSON, Git နှင့် AWS CLI
---

## ၁။ Cloud Automation ဆိုတာဘာလဲ?

Cloud Automation ဆိုသည်မှာ Server, Network, Database စသည်တို့ကို AWS Console Web UI မှ လက်ဖြင့် တစ်ခုချင်း ကလစ်နှိပ်တည်ဆောက်မည့်အစား **Code ဖြင့် ထပ်တလဲလဲ တည်ဆောက်၊ ပြင်ဆင်၊ ဖျက်သိမ်းနိုင်အောင် ပြုလုပ်ခြင်း** ဖြစ်သည်။

---

## ၂။ Declarative vs Imperative Configuration

- **Declarative (Terraform, CloudFormation):** "ငါဘာလိုချင်သလဲ (What you want)" ကိုသာ ကြေညာသည်။ Idempotent ဖြစ်ပြီး အကြိမ်ကြိမ် Run သော်လည်း လိုအပ်သော State အတိုင်း ထိန်းသိမ်းပေးသည်။
- **Imperative (Bash Scripts, AWS CLI):** "ဘယ်လိုလုပ်ရမလဲ (How to do it)" ကို အဆင့်ဆင့် ခိုင်းစေသည်။ ထပ်ခါတလဲလဲ Run ပါက Error တက်ခြင်း သို့မဟုတ် Duplicate ဖြစ်ခြင်း ကြုံရနိုင်သည်။

---

## ၃။ Git & AWS CLI

Infrastructure Code များကို Git Repository တွင် Version ထိန်းသိမ်းပြီး Pull Request (PR) ဖြင့် Code Review ပြုလုပ်သည်။ Terminal မှ AWS CLI ဖြင့် အရင်းအမြစ်များကို လျင်မြန်စွာ စစ်ဆေးနိုင်သည်။
