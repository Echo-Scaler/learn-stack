---
title: IAM Users, Roles, Policies & Principle of Least Privilege
description: IAM Architecture, Least Privilege Principle, Policy Evaluation, EC2 Instance Profiles, STS နှင့် MFA
---

## ၁။ IAM Core Components & Least Privilege

- **IAM User:** လူပုဂ္ဂိုလ်တစ်ဦးချင်းစီအတွက် Login အကောင့်။
- **IAM Role:** EC2, Lambda သို့မဟုတ် GitHub Actions ကဲ့သို့ ဝန်ဆောင်မှုများကို ယာယီ ခွင့်ပြုချက် အပ်နှင်းခြင်း။
- **Principle of Least Privilege (အနည်းဆုံး အခွင့်အာဏာ ပေးအပ်ခြင်း မူ):** သက်ဆိုင်ရာ အလုပ်တာဝန်အတွက် မရှိမဖြစ် လိုအပ်သော ခွင့်ပြုချက်မှလွဲ၍ ပိုလျှံသော အခွင့်အာဏာကို လုံးဝ မပေးရပါ။

---

## ၂။ EC2 Instance Profiles & AWS STS

EC2 ပေါ်တွင် Access Key/Secret Key များကို File ထဲတွင် Hardcode မသိမ်းဆည်းဘဲ IAM Role ချိတ်ပေးခြင်းဖြင့် **AWS STS** မှ Temporary Credentials များကို အလိုအလျောက် ရယူသုံးစွဲစေသည်။
