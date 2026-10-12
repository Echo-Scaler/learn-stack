---
title: Project 3 — Infrastructure as Code (Terraform) Lab
description: Terraform ဖြင့် VPC, Subnets, Gateways, Route Tables နှင့် Security Groups များကို အလိုအလျောက် တည်ဆောက်ခြင်း
---

## 📌 Project Overview
အထက်ပါ AWS Network တစ်ခုလုံးကို Terraform Code ဖြင့် အလိုအလျောက် တည်ဆောက်ပါမည်။

### Tasks Breakdown
1. Terraform Provider (`aws`) နှင့် Variables ရေးသားပါ။
2. VPC, Subnets, IGW, NAT Gateway, Route Tables များကို Resources အဖြစ် ရေးသားပါ။
3. S3 Remote State Backend နှင့် DynamoDB State Locking သတ်မှတ်ပါ။
4. `terraform plan` ဖြင့် စစ်ဆေးပြီး `terraform apply` ဖြင့် စက္ကန့်ပိုင်းအတွင်း တည်ဆောက်ပါ။
5. Code ပြင်ဆင်ချက်များကို Git Commit ဖြင့် မှတ်တမ်းတင်ပါ။
