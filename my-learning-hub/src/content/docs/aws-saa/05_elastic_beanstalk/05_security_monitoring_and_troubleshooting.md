---
title: "၅။ Security, Monitoring & Troubleshooting"
description: "Elastic Beanstalk IAM Roles၊ Enhanced Health စနစ် (Color Codes), CloudWatch Logs Streaming နှင့် အဖြစ်များသော Errors (502 Bad Gateway, Deployment Failures)"
---

# ၅။ Security, Monitoring & Troubleshooting

## Elastic Beanstalk IAM Roles ၂ မျိုး

1. **Service Role (`aws-elasticbeanstalk-service-role`):**  
   Elastic Beanstalk Service ကိုယ်တိုင်က သင့်ကိုယ်စား EC2, Auto Scaling Groups, Load Balancer များကို ဖန်တီးခွင့် ရရှိစေသော Role ဖြစ်သည်။
2. **EC2 Instance Profile (`aws-elasticbeanstalk-ec2-role`):**  
   Beanstalk က တည်ဆောက်လိုက်သော EC2 Instance များအတွင်း၌ တပ်ဆင်ထားသည့် Role ဖြစ်ပြီး S3 မှ Code ဒေါင်းလုဒ်ဆွဲခြင်းနှင့် CloudWatch သို့ Logs ပေးပို့ခြင်းများကို ခွင့်ပြုသည်။

---

## Enhanced Health Monitoring (အရောင်စနစ် ၄ မျိုး)

Beanstalk သည် Server များ၏ ကျန်းမာရေးကို အောက်ပါ အရောင် ၄ မျိုးဖြင့် ရှင်းလင်းစွာ ပြသပေးပါသည်:

| အရောင် | အခြေအနေ (Status) | အဓိပ္ပာယ် |
| :---: | :--- | :--- |
| 🟢 **Green** | **OK** | Application သည် ပုံမှန်အတိုင်း လည်ပတ်နေပြီး Request အားလုံး 200 OK ရရှိနေသည် |
| 🟡 **Yellow** | **Warning** | Request latency မြင့်မားနေခြင်း သို့မဟုတ် 4xx Client Errors များ အနည်းငယ် စတင်ပေါ်ပေါက်နေသည် |
| 🔴 **Red** | **Degraded / Severe** | Server အများစု ပျက်ကျနေခြင်း သို့မဟုတ် 5xx Server Errors အများအပြား ထွက်ပေါ်နေသည် |
| ⚪ **Grey** | **Info / Suspended** | Server အသစ် စတင်နေဆဲ (Updating) သို့မဟုတ် Health စစ်ဆေးမှု ရပ်တန့်ထားခြင်း |

---

## Troubleshooting Runbook: အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်း

| ပြဿနာ | ဖြစ်ရသည့် အကြောင်းအရင်း | စစ်ဆေးဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **HTTP 502 Bad Gateway** | Application Server (Node/PHP/Python) သည် Start မတက်ဘဲ Crash ဖြစ်သွားခြင်း | `eb logs` ဖြင့် `/var/log/web.stdout.log` ကို ဖတ်ရှုပါ။ Application နားထောင်သော Port နှင့် Beanstalk Port (`PORT=8080`) တူမတူ စစ်ဆေးပါ |
| **Deployment Failed** | `.ebextensions` ထဲရှိ Shell script error တက်ခြင်း သို့မဟုတ် `npm install` timeout ဖြစ်ခြင်း | `/var/log/eb-engine.log` တွင် မည်သည့် command ၌ ရပ်တန့်သွားသည်ကို စစ်ဆေးပါ |
| **Environment "Severe" ဖြစ်နေခြင်း** | ALB ၏ Health Check Path (ဥပမာ- `/`) က 404 သို့မဟုတ် 500 error ပြန်ပေးနေခြင်း | Beanstalk Configuration တွင် Health Check Path ကို အမှန်တကယ် ရှိသော Route (ဥပမာ- `/health` သို့မဟုတ် `/api/status`) သို့ ပြောင်းပါ |
