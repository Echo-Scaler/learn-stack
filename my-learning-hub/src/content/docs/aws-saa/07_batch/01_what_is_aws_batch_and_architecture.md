---
title: "၁။ AWS Batch ဆိုတာဘာလဲ & Architecture"
description: "AWS Batch ၏ အခြေခံသဘောတရား၊ Batch Processing နှင့် Web Service ကွာခြားချက်၊ Docker/ECR ပေါင်းစပ်မှုနှင့် Architecture Flow"
---

# ၁။ AWS Batch ဆိုတာဘာလဲ & Architecture

## AWS Batch ဆိုတာဘာလဲ?

**AWS Batch** သည် အင်ဂျင်နီယာများ၊ သုတေသီများနှင့် Developer များအနေဖြင့် ဒေတာအမြောက်အမြား တွက်ချက်ရသော လုပ်ငန်းစဉ်ထောင်ပေါင်းများစွာ (Batch Computing Jobs) ကို အရင်းခံ ဆာဗာများ (EC2, Spot Instances, Fargate) ကိုယ်တိုင် စီမံခန့်ခွဲစရာမလိုဘဲ အချိန်နှင့်တစ်ပြေးညီ စနစ်တကျ မောင်းနှင်ပေးသော **Fully-managed Batch Computing Service** ဖြစ်ပါသည်။

- **Batch Processing vs Web Services:**  
  Web Server (EC2/ECS) သည် အင်တာနက် အသုံးပြုသူထံမှ Request များကို ၂၄ နာရီ မနားတမ်း စောင့်ဆိုင်းဖြေကြားရသည်။  
  **Batch Processing** သည် မည်သည့် User ကိုမျှ မစောင့်ဆိုင်းဘဲ ညသန်းခေါင်အချိန်တွင် ဖိုင်ကြီးများကို စုပြုံဖတ်ခြင်း၊ ဗီဒီယိုများ Render လုပ်ခြင်းနှင့် ဘဏ္ဍာရေးစာရင်းများ အလိုအလျောက် တွက်ချက်ပြီးစီးပါက **Server အားလုံးကို အလိုအလျောက် ဖျက်ပစ်သော အလုပ်အမျိုးအစား** ဖြစ်ပါသည်။

---

## လက်တွေ့ လုပ်ငန်းခွင် Use Cases များ

1. **Media Transcoding & Video Processing:** အသုံးပြုသူများ Upload တင်လိုက်သော 4K ဗီဒီယိုများကို 1080p, 720p, 480p သို့ တစ်ပြိုင်နက် Parallel Render လုပ်ခြင်း။
2. **Financial Analysis & Fraud Detection:** ဘဏ်လုပ်ငန်းများတွင် နေ့စဉ် အရောင်းအဝယ် သန်းပေါင်းများစွာကို စာရင်းချုပ်၍ လိမ်လည်မှု ရှိမရှိ ML Algorithms ဖြင့် တွက်ချက်ခြင်း။
3. **Scientific & Genomic Computing:** ဆေးဝါးသုတေသနများတွင် DNA Sequencing နှင့် မော်လီကျူး ဓာတုဗေဒ ပုံစံများကို Parallel အလုပ်ပေါင်း ထောင်နှင့်ချီ ခွဲထုတ်၍ မောင်းနှင်ခြင်း။
4. **Scheduled ETL (Extract, Transform, Load):** နေ့စဉ် S3 ထဲသို့ ရောက်လာသော Log ဖိုင်ကြီးများကို Database ထဲသို့ သန့်စင်ထည့်သွင်းခြင်း။

---

## AWS Batch Architecture Flow

```
[ User / App / EventBridge ]
             │
             ▼ (1. Submit Job)
      [ Job Queue ] ──► (Job Priority စစ်ဆေးခြင်း)
             │
             ▼ (2. Schedule & Provision)
   [ AWS Batch Scheduler ]
             │
             ▼ (3. Pull Image from ECR & Launch Compute)
  ┌─────────────────────────────────────────────────────────────┐
  │                    Compute Environment                      │
  │                                                             │
  │   [ Dynamic EC2 / Spot Instances / AWS Fargate ]            │
  │                                                             │
  │   ┌───────────────────┐               ┌───────────────────┐ │
  │   │ Job 1 (Container) │               │ Job 2 (Container) │ │
  │   └─────────┬─────────┘               └─────────┬─────────┘ │
  └─────────────┼───────────────────────────────────┼───────────┘
                │                                   │
                └─────────────────┬─────────────────┘
                                  ▼ (4. Save Output)
                      [ Amazon S3 Output Bucket ]
```
