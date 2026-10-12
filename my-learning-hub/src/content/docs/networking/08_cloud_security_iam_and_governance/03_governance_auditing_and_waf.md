---
title: Governance, Auditing (CloudTrail), AWS Config & WAF
description: CloudTrail Audit Logs, AWS Config Compliance, Security Hub, WAF Rules နှင့် Hardcoding Prevention
---

## ၁။ AWS CloudTrail & AWS Config

- **AWS CloudTrail:** AWS Account အတွင်း မည်သူက ဘယ်အချိန်တွင် မည်သည့် API ခေါ်ယူခဲ့သည်ကို မှတ်တမ်းတင်ပေးသော Audit Trail စနစ်။
- **AWS Config:** Security Compliance မပြည့်မီသော Resources များကို အချိန်နှင့်တပြေးညီ စောင့်ကြည့်အကြောင်းကြားခြင်း (ဥပမာ S3 Bucket Public ပွင့်သွားခြင်း)။

---

## ၂။ Security Group Automation & WAF

Security Group တွင် အန္တရာယ်ရှိသော Port ပွင့်သွားပါက EventBridge + Lambda ဖြင့် Auto-remediate ပိတ်ပစ်ခြင်းနှင့် AWS WAF ဖြင့် SQLi, XSS ကာကွယ်ခြင်း။
