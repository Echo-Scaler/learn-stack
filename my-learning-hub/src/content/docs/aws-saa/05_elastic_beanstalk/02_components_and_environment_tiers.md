---
title: "၂။ Components & Environment Tiers"
description: "Application vs Environment၊ Web Server Tier vs Worker Environment Tier (SQS Daemon), Single-Instance vs Load-Balanced Environments"
---

# ၂။ Components & Environment Tiers

## Beanstalk အဓိက အစိတ်အပိုင်းများ (Key Components)

1. **Application:** ပရောဂျက်တစ်ခုလုံး၏ အမည် (Logical Container) ဖြစ်သည် (ဥပမာ- `Restaurant-POS-System`)။
2. **Application Version:** သီးခြား Code ဗားရှင်းတစ်ခု (ဥပမာ- `v1.0.0`, `v1.2.0`) ဖြစ်ပြီး Source Code ဖိုင်များကို **Amazon S3** ထဲတွင် သိုလှောင်ထားသည်။
3. **Environment:** သတ်မှတ်ထားသော Version တစ်ခုကို အမှန်တကယ် run ထားသည့် AWS Resources အစုအဝေး ဖြစ်သည် (ဥပမာ- `pos-development`, `pos-production`)။

---

## Environment Tiers ၂ မျိုး (Web Server Tier vs Worker Tier)

Elastic Beanstalk တွင် Workload သဘောသဘာဝအလိုက် Tier ၂ မျိုး ခွဲခြားထားပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Environment Tiers နှိုင်းယှဉ်ချက်                  │
├───────────────────────────────────┬────────────────────────────────────┤
│ Web Server Environment Tier       │ Worker Environment Tier            │
├───────────────────────────────────┼────────────────────────────────────┤
│ • အင်တာနက်မှ HTTP/HTTPS Requests  │ • အင်တာနက်မှ တိုက်ရိုက်ခေါ်၍ မရပါ      │
│   များကို လက်ခံဖြေကြားပေးသည်      │ • **Amazon SQS Queue** မှ Message များကို│
│ • Application Load Balancer (ALB) │   ဖတ်ယူပြီး Background Job run သည်  │
│   ပါဝင်သည်                        │ • **SQS Daemon (sqsd)** ပါရှိသည်    │
│ • အသုံးပြုမှု: Website, REST APIs  │ • အသုံးပြုမှု: Video Encoding, Email │
│                                   │   ပို့ခြင်း, PDF Generate ပြုလုပ်ခြင်း│
└───────────────────────────────────┴────────────────────────────────────┘
```

### Worker Tier ၏ ထူးခြားချက် (SQS Daemon - `sqsd`):
Worker Tier ရှိ EC2 Instance တိုင်းတွင် AWS ၏ `sqsd` background process ပါဝင်သည်။ ၎င်းက Amazon SQS Queue ထဲမှ Messages များကို အလိုအလျောက် ဆွဲယူပြီး Local Application (ဥပမာ- `http://localhost/process-task`) ထံသို့ HTTP POST request အဖြစ် ပို့ဆောင်ပေးသည်။

---

## Single-Instance vs Load-Balanced Environment

- **Single-Instance Environment:** EC2 Instance ၁ လုံးသာ ပါဝင်ပြီး Elastic IP (EIP) တိုက်ရိုက် ချိတ်ထားသည်။ Load Balancer မပါဝင်သဖြင့် စရိတ်အလွန်သက်သာပြီး Development သို့မဟုတ် Testing များအတွက် သင့်တော်သည်။
- **Load-Balanced & Auto-Scaling Environment:** Application Load Balancer (ALB) နှင့် Auto Scaling Group ပါဝင်ပြီး Multi-AZ ဖြန့်ကျက်ထားသဖြင့် **Production High Availability အတွက် မဖြစ်မနေ သုံးရပါမည်**။
