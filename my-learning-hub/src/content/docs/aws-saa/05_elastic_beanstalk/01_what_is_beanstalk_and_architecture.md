---
title: "၁။ Elastic Beanstalk ဆိုတာဘာလဲ & Architecture"
description: "AWS Elastic Beanstalk ၏ PaaS သဘောတရား၊ AWS က ဘာတွေစီမံပေးပြီး Developer က ဘာလုပ်ရသနည်း၊ Supported Platforms များနှင့် Architecture Flow"
---

# ၁။ Elastic Beanstalk ဆိုတာဘာလဲ & Architecture

## AWS Elastic Beanstalk ဆိုတာဘာလဲ?

**AWS Elastic Beanstalk** သည် AWS ပေါ်တွင် Web Application များနှင့် Services များကို အမြန်ဆန်ဆုံးနှင့် အလွယ်ကူဆုံး လွှင့်တင်ပေးနိုင်သော **Platform as a Service (PaaS)** ဝန်ဆောင်မှု ဖြစ်ပါသည်။

သမားရိုးကျ EC2 ဖြင့် Deploy လုပ်ပါက Developer များသည် VPC, Subnets, Security Groups, EC2 Instances, OS Updates, Auto Scaling Groups, Load Balancer များကို တစ်ခုချင်းစီ ကိုယ်တိုင် Setup လုပ်ရပါသည်။
**Elastic Beanstalk တွင်မူ:** သင်သည် မိမိရေးသားထားသော Source Code (Zip file သို့မဟုတ် Git Repo) ကို Upload တင်ပေးလိုက်ရုံဖြင့် နောက်ကွယ်ရှိ Cloud Infrastructure အားလုံးကို AWS က အလိုအလျောက် တည်ဆောက် ပေးသွားပါမည်။

---

## AWS Shared Responsibility in Elastic Beanstalk

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Elastic Beanstalk Model                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ Developer တာဝန်                   │ AWS Elastic Beanstalk က စီမံပေးသောအရာ │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Application Source Code ရေးသားခြင်း│ • EC2 Instances များ Launch လုပ်ခြင်း│
│ • Database Schema & Logic ရေးဆွဲခြင်း│ • Auto Scaling Group တည်ဆောက်ခြင်း   │
│ • Environment Variables ထည့်သွင်းခြင်း│ • Elastic Load Balancer (ALB) ချိန်ခြင်း│
│                                   │ • OS Patching & Updates လုပ်ဆောင်ခြင်း │
│                                   │ • Health Monitoring & Logs စုဆောင်းခြင်း│
└───────────────────────────────────┴────────────────────────────────────┘
```

> **အရေးကြီးသော အချက် (Control Advantage):**  
> အခြား Third-party PaaS (ဥပမာ- Heroku) များနှင့် မတူဘဲ Elastic Beanstalk သည် နောက်ကွယ်ရှိ EC2 Instance များ၊ Security Groups များကို လုံးဝ ပိတ်ပင်ထားခြင်း မရှိပါ။ Developer သည် လိုအပ်ပါက EC2 ထဲသို့ SSH/SSM ဖြင့် ဝင်ရောက်၍ Root Administrator အနေဖြင့် စိတ်ကြိုက် ပြင်ဆင်နိုင်သော အခွင့်အရေး အပြည့်အဝ ရှိပါသည်။

---

## Supported Platforms (ထောက်ပံ့ထားသော ဘာသာစကားများ)

Elastic Beanstalk သည် ခေတ်ပေါ် နာမည်ကြီး Programming Languages အားလုံးကို တရားဝင် ထောက်ပံ့ထားပါသည်:
- **PHP** (PHP 8.1, 8.2, 8.3 running on Linux)
- **Node.js** (Node 18, 20, 22 LTS)
- **Python** (Python 3.9, 3.10, 3.11, 3.12)
- **Java** (Java with Tomcat သို့မဟုတ် Corretto)
- **Go, Ruby, .NET Core on Linux**
- **Docker** (Single Container သို့မဟုတ် Multi-Container Docker on AL2023)

---

## Architecture Flow

```
[ Developer Source Code (Zip / Git) ]
                 │
                 ▼ (Upload via Console / EB CLI)
    [ AWS Elastic Beanstalk Engine ]
                 │
  ┌──────────────┼─────────────────────────────┐
  ▼              ▼                             ▼
[ Amazon S3 ]  [ Application Load Balancer ] [ Auto Scaling Group ]
Source Storage    (Public Subnet - HTTP/HTTPS) (Private Subnet - EC2 Instances)
                         │                             ▲
                         └─────────────────────────────┘
```
