---
title: "၁။ Lightsail ဆိုတာဘာလဲ & Architecture"
description: "Amazon Lightsail ၏ အခြေခံသဘောတရား၊ All-in-one VPS Bundle၊ ပုံသေလစဉ်ကြေး ($3.50/mo)၊ 1-Click Blueprints (WordPress, LAMP, Node) နှင့် Architecture"
---

# ၁။ Lightsail ဆိုတာဘာလဲ & Architecture

## Amazon Lightsail ဆိုတာဘာလဲ?

**Amazon Lightsail** — **Easy-to-use virtual private servers (VPS) for simple websites or apps.**

Amazon Lightsail သည် ရှုပ်ထွေးသော Cloud Networking နှင့် IAM Configuration များကို မလိုလားဘဲ ရိုးရှင်းသော ဝဘ်ဆိုဒ်များ၊ WordPress Blogs၊ developer environments နှင့် အသေးစား Application များကို ပုံသေနှုန်းထား (Predictable Monthly Pricing) ဖြင့် လွယ်ကူလျင်မြန်စွာ လွှင့်တင်နိုင်သော AWS ၏ Virtual Private Server (VPS) ဝန်ဆောင်မှု ဖြစ်ပါသည်။

**Amazon Lightsail တွင်မူ:** အရာအားလုံးကို အထုပ်တစ်ထုပ်တည်း (**All-in-one Bundle**) အဖြစ် စုစည်းပေးထားပါသည်:
- **Virtual Server (Compute):** vCPU နှင့် RAM ပါဝင်သည်။
- **SSD-based Storage:** မြန်ဆန်သော SSD Hard Disk ပါဝင်သည်။
- **Monthly Data Transfer Allowance:** လစဉ် ဒေတာအဝင်/အထွက် (ဥပမာ- 1TB မှ 7TB အထိ) အခမဲ့ ပါဝင်သည်။
- **Static IP & DNS Management:** အခမဲ့ Static Public IP နှင့် ရိုးရှင်းသော DNS စီမံခန့်ခွဲမှု ပါဝင်သည်။
- **Predictable Pricing:** တစ်လလျှင် **$3.50 မှ စတင်သော ပုံသေလစဉ်နှုန်းထား** ဖြစ်သည်။

---

## 1-Click Blueprints (တစ်ချက်နှိပ်ရုံဖြင့် တင်နိုင်သော Apps)

Lightsail တွင် OS သက်သက်တင်နိုင်သလို (Amazon Linux, Ubuntu, Debian, Windows)၊ အောက်ပါ Application Stacks များကိုလည်း ကလစ်တစ်ချက်နှိပ်ရုံဖြင့် အလိုအလျောက် တပ်ဆင်ပြီးသား ရရှိနိုင်ပါသည်:

1. **WordPress & WordPress Multisite** (ကမ္ဘာ့လူသုံးအများဆုံး CMS ဘလော့ဂ်)
2. **LAMP Stack** (Linux, Apache, MySQL, PHP)
3. **LEMP Stack** (Linux, Nginx, MySQL, PHP)
4. **Node.js, Django, GitLab, Ghost, Drupal, Magento, cPanel**

---

## Lightsail Architecture

```
[ Internet Users ]
        │
        ▼ (Port 80 / 443)
[ Lightsail Static IP ]
        │
┌───────▼──────────────────────────────────────────────┐
│             Amazon Lightsail Instance                │
│                                                      │
│  ┌────────────────────────┐  ┌─────────────────────┐ │
│  │ Application (WordPress)│  │ MySQL Database      │ │
│  │ (Node.js / PHP / Nginx)│  │ (Attached Storage)  │ │
│  └────────────────────────┘  └─────────────────────┘ │
└───────────────────────┬──────────────────────────────┘
                        │ (VPC Peering)
┌───────────────────────▼──────────────────────────────┐
│           Your Full Amazon VPC Infrastructure        │
│    (Amazon S3, RDS, DynamoDB, SageMaker, etc.)       │
└──────────────────────────────────────────────────────┘
```

> **VPC Peering စွမ်းရည်:**  
> Lightsail Instance များသည် AWS ၏ အခြားသော အဆင့်မြင့် Services များ (ဥပမာ- Amazon S3 သို့မဟုတ် AWS Secrets Manager) နှင့်လည်း **VPC Peering** ဖွင့်ထားရုံဖြင့် တိုက်ရိုက် Private ချိတ်ဆက် အသုံးပြုနိုင်ပါသည်။
