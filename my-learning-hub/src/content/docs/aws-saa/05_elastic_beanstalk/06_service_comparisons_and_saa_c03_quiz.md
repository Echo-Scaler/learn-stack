---
title: "၆။ Service Comparisons & SAA-C03 Quiz"
description: "Elastic Beanstalk vs EC2 / ECS / Lambda နှိုင်းယှဉ်ချက်၊ Blue/Green CNAME Swap၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၆။ Service Comparisons & SAA-C03 Quiz

## Compute Services နှိုင်းယှဉ်ချက် (Beanstalk vs Others)

| ဝန်ဆောင်မှု | Infrastructure စီမံရမှု | အားသာချက် | စာမေးပွဲ သော့ချက်စကားလုံး (Keyword) |
| :--- | :---: | :--- | :--- |
| **Elastic Beanstalk** | **အနည်းငယ် (PaaS)** | Code တင်ရုံဖြင့် EC2/ALB ကို Auto ဆောက်ပေးသလို Full OS Control လည်း ဆက်ရသည် | *"Deploy web app quickly without managing infrastructure"* |
| **Amazon EC2** | **အများဆုံး (IaaS)** | OS, Kernel, Drivers အားလုံး စိတ်ကြိုက် ချိန်ညှိနိုင်သည် | *"Full control over the underlying operating system"* |
| **Amazon ECS** | **အလယ်အလတ်** | Docker Microservices များကို AWS Native စနစ်ဖြင့် လွယ်ကူစွာ run နိုင်သည် | *"Docker containers, Task Definitions, Fargate"* |
| **AWS Lambda** | **လုံးဝ မလိုပါ (FaaS)** | Server လုံးဝ မလိုဘဲ Event လာမှ run သဖြင့် အသက်သာဆုံးဖြစ်သည် | *"Event-driven, 15-minute max, millisecond billing"* |

---

## 🏆 SAA-C03 Beanstalk ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **Blue/Green Deployment via CNAME Swap:**  
   Beanstalk တွင် Version အဟောင်း (Blue) မှ Version အသစ် (Green) သို့ DNS အဆင့်တွင် Downtime လုံးဝ မရှိဘဲ ကူးပြောင်းရန် **"Swap Environment URLs (CNAME Swap)"** ကို အသုံးပြုသည်။
2. **Worker Environment with SQS:**  
   Web Server က Background အလုပ်များ (Email, Image Processing) ကို တိုက်ရိုက် မလုပ်ဘဲ SQS ထဲသို့ ထည့်ပေးပြီး **Worker Environment Tier** က တာဝန်ယူ လုပ်ဆောင်ခြင်းသည် Standard Decoupling Pattern ဖြစ်သည်။
3. **Zero Impact on Production Capacity:**  
   Deployment လုပ်နေစဉ်အတွင်း Server အရေအတွက် လုံးဝ မကျသွားစေလိုပါက **Immutable** သို့မဟုတ် **Rolling with additional batch** ကို သုံးရမည်။ (ရိုးရိုး Rolling သည် Batch အရွယ်အစားအလိုက် Capacity ခေတ္တ လျော့သွားသည်)။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
စတင်တည်ထောင်ခါစ Startup ကုမ္ပဏီတစ်ခုတွင် သီးသန့် DevOps အင်ဂျင်နီယာ မရှိသေးပါ။ Developer များသည် မိမိတို့ ရေးသားထားသော Node.js Web Application ကို Infrastructure တည်ဆောက်ခြင်း၊ Auto Scaling ချိန်ခြင်း၊ Load Balancer တပ်ဆင်ခြင်း စသည်တို့ကို ကိုယ်တိုင် မလုပ်လိုဘဲ AWS ပေါ်သို့ အမြန်ဆုံး လွှင့်တင်လိုပါသည်။ မည်သည့် ဝန်ဆောင်မှုသည် အသင့်တော်ဆုံး ဖြစ်သနည်း?

- [ ] A) Amazon EC2 တွင် Nginx နှင့် Node.js ကိုယ်တိုင် တပ်ဆင်ခြင်း
- [ ] B) Amazon EKS Cluster တည်ဆောက်ခြင်း
- [x] C) AWS Elastic Beanstalk
- [ ] D) AWS Batch

> **ရှင်းလင်းချက်:** **AWS Elastic Beanstalk** သည် Developer များအတွက် အခြေခံအဆောက်အအုံကို ကိုယ်တိုင် စီမံစရာမလိုဘဲ Code တင်ရုံဖြင့် အမြန်ဆုံး ဝဘ်ဆိုဒ်လွှင့်တင်ပေးနိုင်သော Platform as a Service (PaaS) ဖြစ်ပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် Production Elastic Beanstalk Application တစ်ခုအတွက် Version အသစ်ကို Deploy လုပ်လိုပါသည်။ လုပ်ငန်းလိုအပ်ချက်အရ Deployment လုပ်နေစဉ်အတွင်း လက်ရှိ Server စွမ်းအား (Full Capacity) လုံးဝ မကျဆင်းရမည့်အပြင် Code တွင် Error ပါပါက မူလ Version သို့ စက္ကန့်ပိုင်းအတွင်း အလုံခြုံဆုံး Rollback ပြန်ဆင်းနိုင်ရပါမည်။ မည်သည့် Deployment Strategy ကို ရွေးချယ်သင့်သနည်း?

- [ ] A) All at once
- [ ] B) Rolling
- [x] C) Immutable Deployment
- [ ] D) In-place deployment

> **ရှင်းလင်းချက်:** **Immutable Deployment** သည် ယာယီ ASG အသစ်ဖြင့် Server အသစ်များ Launch လုပ်သဖြင့် မူလ Server စွမ်းအား 100% မကျဆင်းပါ။ ထို့အပြင် Error တက်ပါက ယာယီ Server များကို ဖျက်ပစ်ရုံဖြင့် မူလ Server များကို ဘာမျှ မထိခိုက်စေသော အလုံခြုံဆုံး မဟာဗျူဟာ ဖြစ်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [AWS Elastic Beanstalk Developer Guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)
- [Elastic Beanstalk Deployment Policies](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html)
- [Customizing Software on Linux Servers (.ebextensions)](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html)
