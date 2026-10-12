---
title: AWS Systems Manager (SSM) Operations & Automation
description: Session Manager (No Port 22 SSH), Run Command, Patch Manager နှင့် Parameter Store
---

## ၁။ Session Manager (SSH Port 22 လုံးဝပိတ်ထားနိုင်ခြင်း)

AWS SSM Session Manager သည် EC2 Security Group တွင် **Port 22 ကို လုံးဝ ဖွင့်စရာမလိုဘဲ** IAM Role ဖြင့် AWS Console သို့မဟုတ် CLI မှတစ်ဆင့် လုံခြုံစွာ Terminal ဝင်ရောက်နိုင်သော Enterprise နည်းပညာ ဖြစ်သည်။

```bash
# Terminal မှ Session Manager ဖြင့် တိုက်ရိုက်ဝင်ရောက်ခြင်း
aws ssm start-session --target i-0123456789abcdef0
```

---

## ၂။ Run Command, Patch Manager & Parameter Store

- **Run Command:** Server အလုံး ၁၀၀ သို့ Shell Script တစ်ခုကို Console/CLI မှ တစ်ပြိုင်နက် Run ပေးနိုင်သည်။
- **Patch Manager:** Linux OS Security Patches များကို Schedule ဆွဲ၍ အလိုအလျောက် သွင်းပေးသည်။
- **Parameter Store:** Database URLs, App Configs များကို Encrypted Key-Value အဖြစ် သိမ်းဆည်းပေးသည်။
