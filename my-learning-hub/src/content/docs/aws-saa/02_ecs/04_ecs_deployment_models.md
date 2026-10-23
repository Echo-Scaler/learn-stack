---
title: "၄။ ECS Deployment Models"
description: "ECS Deployment Strategies ၄ ခု — Rolling, Blue/Green, Canary, Linear Deployment အလုပ်လုပ်ပုံနှင့် အသုံးပြုသင့်သည့် အခြေအနေများ"
---

# ၄။ ECS Deployment Models

Deployment ဆိုတာ Application Version အသစ်ကို Server ပေါ်မှာ အလုပ်လုပ်အောင် တင်ခြင်းဖြစ်ပါတယ်။

ဥပမာ POS API မှာ Bug တစ်ခုကို ပြင်ပြီး Version 1.0 ကနေ Version 1.1 ကို Deploy လုပ်မယ်ဆိုပါစို့။ User တွေ လက်ရှိအသုံးပြုနေချိန်မှာ Downtime မဖြစ်အောင် ဘယ်လိုပြောင်းမလဲဆိုတာကို Deployment Strategy က ဆုံးဖြတ်ပေးပါတယ်။

AWS ECS ရဲ့ ECS deployment controller မှာ **Rolling, Blue/Green, Linear နဲ့ Canary** strategies တွေ ရွေးချယ်နိုင်ပါတယ်။

---

## 4.1 Rolling Deployment
[medium.com reference](https://medium.com/%40elouadinouhaila566/quick-overview-of-deployment-strategies-3f6b06231013?utm_source=chatgpt.com)

**အဓိပ္ပာယ်:** Container အဟောင်းတွေကို တစ်ခုပြီးတစ်ခု (သို့မဟုတ် အုပ်စုလိုက်) Version အသစ်တွေနဲ့ အစားထိုးခြင်း။

ဥပမာ Task 4 ခု Run နေတယ်ဆိုပါစို့။

- **Before deployment — Version 1.0**
  - Task 1: v1.0
  - Task 2: v1.0
  - Task 3: v1.0
  - Task 4: v1.0
- **During deployment — old/new mixed**
  - Task 1: v1.0
  - Task 2: v1.0
  - Task 3: v1.1
  - Task 4: v1.1
- **After deployment — Version 1.1**
  - Task 1: v1.1
  - Task 2: v1.1
  - Task 3: v1.1
  - Task 4: v1.1

- **အားသာချက်** — Setup ရိုးရှင်းတယ်၊ Resource ပိုသက်သာတတ်တယ်။
- **အားနည်းချက်** — Version အဟောင်းနဲ့ အသစ် ရောပြီး Run နေတဲ့အချိန် ရှိနိုင်တယ်။ Application Compatibility ကို စစ်ဆေးဖို့လိုတယ်။
- **သင့်တော်တဲ့အခြေအနေ (Usage)** — ပုံမှန် Web API နဲ့ စရိတ်ကို ထိန်းချင်တဲ့ Project များ။

---

## 4.2 Blue/Green Deployment
[newsletter.systemdesigncodex.com reference](https://newsletter.systemdesigncodex.com/p/5-must-know-deployment-strategies?utm_source=chatgpt.com)

**အဓိပ္ပာယ်:** Version အဟောင်း (Blue) နဲ့ Version အသစ် (Green) ကို ယာယီအတူတူ Run ထားပြီး စမ်းသပ်ပြီးမှ Traffic ကို ပြောင်းပေးခြင်း။

- **BLUE:** Version 1.0 — လက်ရှိ User Traffic ကို လက်ခံနေတယ်။
- **GREEN:** Version 1.1 — Test လုပ်ပြီး အဆင်ပြေမပြေ စစ်ဆေးနေတယ်။
- **Application Load Balancer:** စမ်းသပ်မှုအောင်မြင်ပါက Traffic ကို Green ဆီ ပြောင်းပေးတယ်။

- **အားသာချက်** — Version အသစ်ကို Production Traffic မပေးခင် စမ်းသပ်နိုင်တယ်။ Rollback လုပ်ရတာလည်း ပိုလွယ်တယ်။
- **အားနည်းချက်** — Version နှစ်ခု ယာယီ Run နေရလို့ Resource နဲ့ Cost ပိုများနိုင်တယ်။
- **သင့်တော်တဲ့အခြေအနေ (Usage)** — Payment System၊ Restaurant POS နဲ့ Downtime နည်းဖို့ အရေးကြီးတဲ့ Application များ။
- **မှတ်ချက်** — Blue/Green ဆိုတာ အမြဲတမ်း Zero Downtime အာမခံတယ်လို့ မဆိုလိုပါဘူး။ Health Checks, Load Balancer, Database Compatibility နဲ့ Deployment Configuration တွေ မှန်ကန်ဖို့လိုပါတယ်။

---

## 4.3 Canary Deployment
[medium.com reference](https://medium.com/%40enaikeleomoh/devops-deployment-strategies-rolling-blue-green-and-canary-deployments-explained-d4d1639a10c6?utm_source=chatgpt.com)

**အဓိပ္ပာယ်:** User Traffic ရဲ့ အနည်းငယ်ကို Version အသစ်ဆီ အရင်ပို့ပြီး အဆင်ပြေမှ ကျန် Traffic ကို ပြောင်းပေးခြင်း။

ဥပမာ —
1. Version 1.0 က User Traffic 100% ကို လက်ခံထားတယ်။
2. Version 1.1 ကို Deploy လုပ်ပြီး Traffic 10% ပို့တယ်။
3. Error Rate, Latency နဲ့ Logs တွေကို စောင့်ကြည့်တယ်။
4. အဆင်ပြေရင် Traffic 100% ကို Version 1.1 ဆီ ပြောင်းတယ်။
5. ပြဿနာတွေ့ရင် Rollback လုပ်တယ်။

- **အားသာချက်** — Version အသစ်ကြောင့် ဖြစ်လာနိုင်တဲ့ ပြဿနာကို User အားလုံးဆီ မရောက်ခင် ရှာဖွေနိုင်တယ်။
- **အားနည်းချက်** — Traffic Routing, Monitoring နဲ့ Testing ပိုလိုတယ်။

---

## 4.4 Linear Deployment

**အဓိပ္ပာယ်:** Version အသစ်ဆီ Traffic ကို သတ်မှတ်ထားတဲ့ ရာခိုင်နှုန်းအတိုင်း တဖြည်းဖြည်း တိုးပေးခြင်း။

ဥပမာ — `10% → 20% → 30% → 40% ... → 100%`။  
အဆင့်တစ်ခုစီမှာ သတ်မှတ်ထားတဲ့အချိန် စောင့်ပြီး Error Rate နဲ့ Application Health ကို စစ်ဆေးနိုင်ပါတယ်။

---

## Deployment Models နှိုင်းယှဉ်ချက် (Feature & Usage Summary)

| Strategy | Traffic ပြောင်းပုံ | Cost | အသုံးပြုသင့်တဲ့အခြေအနေ (Usage) |
| :--- | :--- | :--- | :--- |
| **Rolling** | Task တွေကို တဖြည်းဖြည်း အစားထိုး | ပုံမှန်အားဖြင့် နည်း | ပုံမှန် Web Apps |
| **Blue/Green** | စမ်းသပ်ပြီးနောက် အဟောင်းမှ အသစ်သို့ ပြောင်း | ပိုများနိုင် | Rollback မြန်ဖို့ လိုတဲ့ App |
| **Canary** | Traffic အနည်းငယ် စမ်းပြီးမှ အပြည့်ပြောင်း | ပိုများနိုင် | Risk နည်းအောင် ဖြန့်ချိလိုတဲ့ App |
| **Linear** | Traffic ကို အဆင့်ဆင့် တိုး | ပိုများနိုင် | အဆင့်တိုင်း Performance စောင့်ကြည့်လိုတဲ့ App |

> **AWS SAA-C03 အတွက် မှတ်ထားရန်:** Rolling က ပုံမှန်အားဖြင့် ရိုးရှင်းပြီး၊ Blue/Green က Version နှစ်ခု ယှဉ်တွဲစမ်းသပ်နိုင်ပြီး၊ Canary က Traffic အနည်းငယ်နဲ့ အရင်စမ်းပြီး၊ Linear က Traffic ကို အဆင့်ဆင့် တိုးပေးပါတယ်။
