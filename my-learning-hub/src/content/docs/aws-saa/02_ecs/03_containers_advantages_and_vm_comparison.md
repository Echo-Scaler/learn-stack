---
title: "၃။ Containers ရဲ့ အားသာချက်များ & VM နှိုင်းယှဉ်ချက်"
description: "Container ဆိုတာဘာလဲ၊ မသုံးခင်နှင့် သုံးပြီးနောက် နှိုင်းယှဉ်ချက်၊ အားသာချက် ၆ ခုနှင့် Container vs Virtual Machine (VM) ကွာခြားချက်များ"
---

# ၃။ Containers ရဲ့ အားသာချက်များ

**Container** ဆိုတာ Application Code၊ Runtime နဲ့ လိုအပ်တဲ့ Libraries တွေကို တစ်စုတစ်စည်းတည်း ထည့်ထားတဲ့ သီးခြား Execution Environment ဖြစ်ပါတယ်။ Docker Image က Container တစ်ခုကို တည်ဆောက်ဖို့ အသုံးပြုတဲ့ Template ဖြစ်တယ်။

---

## Container မသုံးခင်နဲ့ သုံးပြီးနောက် လက်တွေ့ Usage

ဥပမာ Developer ရဲ့ Mac မှာ PHP 8.3 ရှိပေမဲ့ Production Server မှာ PHP 8.1 ပဲ ရှိတယ်ဆိုပါစို့။
- **Container မသုံးရင်:** PHP Version၊ Extensions၊ Libraries နဲ့ Configuration မတူတာကြောင့် Application အလုပ်မလုပ်တာ ဖြစ်နိုင်တယ်။
- **Container သုံးရင်:** PHP 8.3 နဲ့ လိုအပ်တဲ့ Extensions တွေပါဝင်တဲ့ Image ကို Build လုပ်ပြီး Development နဲ့ Production မှာ တူညီတဲ့ Environment ကို အသုံးပြုနိုင်တယ်။ သို့သော် Host OS၊ CPU Architecture နဲ့ Environment Configuration တွေကိုလည်း ကိုက်ညီအောင် စီမံဖို့လိုပါတယ်။

---

## အားသာချက် ၆ ခု (Key Advantages & Usage)

1. **Consistency:** Development, Testing, Production Environment တွေကို ပိုမိုတူညီစေတယ်။
2. **Fast Deployment:** Image ကို ပြန်လည်အသုံးပြုပြီး Application Version အသစ်တွေကို မြန်မြန် Deploy လုပ်နိုင်တယ်။
3. **Scalability:** Request များလာရင် Task အရေအတွက်ကို 2 ကနေ 5၊ 10 စသည်ဖြင့် တိုးနိုင်တယ်။
4. **Isolation:** Application တစ်ခုစီရဲ့ Dependencies တွေကို သီးခြားခွဲထားနိုင်တယ်။ ဒါပေမဲ့ Container တစ်ခုတည်းနဲ့ Security အပြည့်အဝ မရပါဘူး။
5. **Recovery:** ECS Service က ပျက်သွားတဲ့ Task ကို အစားထိုးဖို့ ကြိုးစားနိုင်တယ်။ Application Bug ကိုတော့ ကိုယ်တိုင်ပြင်ဖို့ လိုတယ်။
6. **Version Control နဲ့ Rollback:** Image Tag နဲ့ Task Definition Revision တွေကို စနစ်တကျ စီမံထားရင် Version အဟောင်းကို ပြန် Deploy လုပ်နိုင်တယ်။

---

## Container နဲ့ Virtual Machine ဘာကွာလဲ။

| အချက် | Container | Virtual Machine (VM) |
| :--- | :--- | :--- |
| **OS** | Host Kernel ကို မျှဝေသုံးတယ် | Guest OS ပါဝင်တယ် |
| **စတင်ချိန်** | ပုံမှန်အားဖြင့် မြန်တယ် | ပုံမှန်အားဖြင့် ပိုကြာတယ် |
| **Resource** | များသောအားဖြင့် ပိုပေါ့ပါးတယ် | Guest OS အတွက် Resource လိုတယ် |
| **အသုံးပြုမှု** | Microservices, API, Web Apps | OS သီးခြားလိုအပ်တဲ့ Workloads |

> **မှတ်ချက်:** Container နဲ့ VM က တစ်ခုကိုတစ်ခု အစားထိုးရမယ်လို့ မဆိုလိုပါဘူး။ AWS ECS on EC2 မှာဆိုရင် Container တွေကို run ပေးတဲ့ EC2 instance တွေကိုယ်တိုင်က VM တွေ ဖြစ်နိုင်ပါတယ်။
