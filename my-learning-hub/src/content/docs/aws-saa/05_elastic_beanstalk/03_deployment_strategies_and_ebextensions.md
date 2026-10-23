---
title: "၃။ Deployment Strategies & .ebextensions"
description: "Elastic Beanstalk Deployment Strategies ၅ မျိုး (All at Once, Rolling, Immutable, Traffic Splitting) နှင့် .ebextensions Configuration လမ်းညွှန်"
---

# ၃။ Deployment Strategies & .ebextensions

## Deployment Strategies ၅ မျိုး နှိုင်းယှဉ်ချက် (SAA-C03 အမေးအများဆုံး)

Elastic Beanstalk တွင် Application Version အသစ်တစ်ခုကို Deploy လုပ်သည့်အခါ စရိတ်၊ အချိန်နှင့် Downtime အပေါ် မူတည်၍ မဟာဗျူဟာ ၅ မျိုး ရွေးချယ်နိုင်ပါသည်:

| Strategy | Deployment အမြန်နှုန်း | Downtime ရှိ/မရှိ | Capacity ထိခိုက်မှု | အန္တရာယ် (Risk) & Rollback | အကောင်းဆုံး Use Case |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **All at once** | **အမြန်ဆုံး** | **ရှိသည်** | 100% ရပ်ဆိုင်းသွားသည် | Rollback ခက်ခဲသည် (ပြန် deploy ရသည်) | Development / Staging ပတ်ဝန်းကျင်များ |
| **Rolling** | အလယ်အလတ် | မရှိပါ | **Capacity လျော့သွားသည်** (Batch အလိုက်) | အဟောင်းသို့ ပြန် deploy ရသည် | Production (Traffic နည်းပါးချိန်) |
| **Rolling with additional batch**| နှေးသည် | မရှိပါ | **Capacity အပြည့် ဆက်ရှိသည်** | အဟောင်းသို့ ပြန် deploy ရသည် | Production (Peak Traffic အချိန်) |
| **Immutable** | နှေးသည် | မရှိပါ | **Capacity အပြည့် ဆက်ရှိသည်** | **Rollback အလွန်လွယ်ကူပြီး အလုံခြုံဆုံး** | **Mission-Critical Production Systems** |
| **Traffic Splitting (Canary)** | စောင့်ဆိုင်းချိန်လိုသည် | မရှိပါ | **Capacity အပြည့် ဆက်ရှိသည်** | **Auto-Rollback ဖြစ်သည်** | Live Users များဖြင့် စမ်းသပ်လိုသော Releases |

---

## ၁။ Immutable Deployment (အလုံခြုံဆုံး မဟာဗျူဟာ)
- **အလုပ်လုပ်ပုံ:** ရှိပြီးသား Production EC2 Instances များကို လုံးဝ (လုံးဝ) မထိခိုက်ပါ။
- AWS က ယာယီ **Temporary Auto Scaling Group အသစ်တစ်ခု** တည်ဆောက်ပြီး ထိုထဲတွင် Version အသစ်ဖြင့် Server အသစ်များ Launch လုပ်သည်။
- Health Checks အားလုံး အောင်မြင်မှသာ အဆိုပါ Server များကို Main ASG သို့ ပေါင်းစည်းပြီး Server အဟောင်းများကို ဖျက်ပစ်သည်။
- **အားသာချက်:** အကယ်၍ Code အသစ်တွင် Error ပါပါက ယာယီ Server များကို ချက်ချင်းဖျက်ပစ်ရုံဖြင့် မူလ Server အဟောင်းများ ဘာမျှ မထိခိုက်ဘဲ Zero-downtime Rollback ရရှိသည်။

## ၂။ Traffic Splitting (Canary Deployment)
- ALB မှတစ်ဆင့် Live Traffic ၏ ရာခိုင်နှုန်းအနည်းငယ် (ဥပမာ- 10%) ကို Version အသစ်သို့ ပို့ဆောင်ပြီး ၁၅ မိနစ်ခန့် စောင့်ကြည့်သည်။
- HTTP 500 Errors များ တက်လာပါက CloudWatch Alarm က မူလ Version သို့ **အလိုအလျောက် 100% ပြန်ခေါက်ပေးသည် (Automatic Rollback)**။

---

## `.ebextensions` ဖြင့် Linux OS စိတ်ကြိုက်ပြင်ဆင်ခြင်း

Application Code Zip ဖိုင်၏ Root တွင် `.ebextensions/` folder ဆောက်ပြီး YAML config ဖိုင်များ ထည့်သွင်းခြင်းဖြင့် Server OS ကို စိတ်ကြိုက် ညွှန်ကြားနိုင်ပါသည်:

```yaml
# .ebextensions/01_setup.config
packages:
  yum:
    git: []
    htop: []

container_commands:
  01_run_migrations:
    command: "php artisan migrate --force"
    leader_only: true # Instance အားလုံး မလုပ်ဘဲ Leader Server တစ်ခုတည်းကသာ DB migrate လုပ်စေရန်
```

- `packages`: Server စတင်ချိန်တွင် Linux package များ အလိုအလျောက် သွင်းပေးသည်။
- `container_commands`: Code unpack ပြီးချိန်တွင် Database migration သို့မဟုတ် asset build လုပ်ပေးသည်။
- `leader_only: true`: Auto Scaling Instances များစွာရှိသော်လည်း Database Migration ကဲ့သို့သော အလုပ်များကို Instance တစ်ခုတည်းကသာ ပြုလုပ်စေရန် ကာကွယ်ပေးသည်။
