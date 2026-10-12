---
title: CloudFormation Templates, Stacks & Rollbacks
description: AWS CloudFormation YAML Templates, Stacks, Rollback Automation နှင့် Change Sets
---

## ၁။ CloudFormation Templates Structure

CloudFormation သည် YAML/JSON ဖြင့် Stack တည်ဆောက်သည်:
- `Parameters`: Input တန်ဖိုးများ
- `Resources`: တည်ဆောက်မည့် AWS Services များ (VPC, Subnet, EC2)
- `Outputs`: ပြန်လည်ရရှိသော တန်ဖိုးများ

---

## ၂။ Automatic Rollback & Change Sets

- **Stack Rollback:** Update လုပ်ရာတွင် တစ်ခုခု Error ဖြစ်ပါက မူလကောင်းမွန်သော အခြေအနေသို့ အလိုအလျောက် ပြန်ဆုတ်ပေးသည် (No Broken State)။
- **Change Sets:** Template မတင်မီ Cloud ပေါ်တွင် မည်သည့် Resources များ ပြောင်းလဲသွားမည်ကို Preview ကြည့်ရှုနိုင်သည်။
