---
title: "၂။ ECS ရဲ့ Key Components များ"
description: "ECS ၏ အဓိက Key Components ၁၀ ခု၊ မြန်မာလို အဓိပ္ပာယ်၊ အလုပ်လုပ်ပုံနှင့် Restaurant POS System လက်တွေ့ ဥပမာ ၄ ခု"
---

# ၂။ ECS ရဲ့ Key Components များ

ECS မှာ အဓိကသိထားရမယ့် Components တွေကို အောက်ကဇယားမှာ ကြည့်ပါ။

## Key Components နှင့် အလုပ်လုပ်ပုံ (Feature Title & Usage Table)

| Component | မြန်မာလို အဓိပ္ပာယ် | အလုပ်လုပ်ပုံနှင့် Usage |
| :--- | :--- | :--- |
| **Cluster** | အလုပ်လုပ်မယ့် ပတ်ဝန်းကျင် | Tasks နဲ့ Services တွေကို စုစည်းပေးတယ် |
| **Task Definition** | Run လုပ်ဖို့ Blueprint | Image, CPU, RAM, Port စတာတွေ သတ်မှတ်တယ် |
| **Task** | အမှန်တကယ် Run နေတဲ့ Workload | Task Definition ကို အခြေခံပြီး Container တွေ run တယ် |
| **Service** | ရေရှည် Run နေတဲ့ App ကို စီမံသူ | လိုအပ်တဲ့ Task အရေအတွက်ကို ထိန်းပေးတယ် |
| **Container** | Application ရဲ့ Running Instance | Code နဲ့ လိုအပ်တဲ့ Runtime တွေကို run တယ် |
| **ECR** | Image သိမ်းတဲ့ Registry | Docker Images တွေကို သိမ်းထားတယ် |
| **Fargate / EC2** | Compute Capacity | Containers တွေ run ဖို့ resources ပေးတယ် |
| **ALB / NLB** | Load Balancer | Request တွေကို Tasks တွေဆီ ပို့ပေးတယ် |
| **IAM** | Permission Management | ဘယ်သူ၊ ဘယ် Application က ဘာလုပ်ခွင့်ရှိလဲ သတ်မှတ်တယ် |
| **CloudWatch** | Monitoring နဲ့ Logging | CPU, RAM, Logs, Alarms တွေကို စောင့်ကြည့်တယ် |

---

## အရေးကြီးဆုံး ၄ ခုကို ဥပမာနှင့် အသုံးချပုံ (Usage)

1. **Cluster = အလုပ်လုပ်မယ့်နေရာ**  
   *ဥပမာ:* Restaurant POS System အတွက် `pos-production-cluster` ဆိုတဲ့ Cluster တစ်ခုရှိတယ်။
2. **Task Definition = လုပ်ငန်းညွှန်ကြားချက်**  
   *ဥပမာ:* `pos-api:5` ဆိုတဲ့ Revision မှာ Image, CPU, Memory, Port 8000 နဲ့ Logging Configuration တွေ သတ်မှတ်ထားတယ်။
3. **Task = အမှန်တကယ် Run နေတဲ့ Application**  
   *ဥပမာ:* `pos-api:5` ကို အသုံးပြုပြီး API Container တစ်ခု Run နေတယ်။
4. **Service = Task အရေအတွက်ကို ထိန်းပေးသူ**  
   *ဥပမာ:* Desired count ကို 2 သတ်မှတ်ထားရင် Task တစ်ခု ပျက်သွားတဲ့အခါ Service က replacement Task တစ်ခု စတင်ဖို့ ကြိုးစားတယ်။

> **မှတ်ရန်:** Cluster က နေရာ၊ Task Definition က Blueprint၊ Task က Running Workload၊ Service က လိုအပ်တဲ့ Task အရေအတွက်ကို ထိန်းသိမ်းသူ ဖြစ်ပါတယ်။
