---
title: "၃။ Purchasing Options & Cost Optimization"
description: "EC2 Purchasing Options ၆ မျိုး (On-Demand, Spot, Reserved, Savings Plans, Dedicated Hosts/Instances) နှိုင်းယှဉ်ချက်နှင့် စရိတ်ချွေတာနည်း မဟာဗျူဟာများ"
---

# ၃။ Purchasing Options & Cost Optimization

## EC2 Purchasing Models နှိုင်းယှဉ်ချက်

AWS တွင် မိမိ Application ၏ သဘောသဘာဝနှင့် ဘတ်ဂျက်ပေါ် မူတည်၍ ငွေကြေးချွေတာနိုင်သော Purchasing Options အမျိုးမျိုးကို ပေးအပ်ထားပါသည်:

| Option | Discount ပမာဏ | ကာလ သတ်မှတ်ချက် | အကောင်းဆုံး အသုံးချမှု (Use Case) | အားနည်းချက် / သတိပြုရန် |
| :--- | :---: | :---: | :--- | :--- |
| **On-Demand** | မရှိ (အခြေခံဈေး) | မရှိ (စက္ကန့်အလိုက်) | ခန့်မှန်းရခက်သော Traffic၊ စတင်ကာစ App၊ စမ်းသပ်ခြင်း | ဈေးအကြီးဆုံး ဖြစ်သည် |
| **Spot Instances** | ၉၀% အထိ | မရှိ (ပိုလျှံသော Capacity) | Batch Processing၊ CI/CD Jobs၊ ပြတ်တောက်ခံနိုင်သော App | AWS က Capacity ပြန်လိုပါက **၂ မိနစ် ကြိုတင်သတိပေးချက်** ဖြင့် သိမ်းယူနိုင်သည် |
| **Reserved Instances (RI)** | ၇၂% အထိ | ၁ နှစ် သို့မဟုတ် ၃ နှစ် | Steady-state (၂၄ နာရီ မနားတမ်း run ရမည့်) Database/Backend | ကြာရှည် ကတိကဝတ် လိုအပ်သည် |
| **Savings Plans** | ၇၂% အထိ | ၁ နှစ် သို့မဟုတ် ၃ နှစ် | EC2, Fargate, Lambda ပေါင်းစပ်အသုံးပြုသော လုပ်ငန်းများ | တစ်နာရီ ဒေါ်လာ မည်မျှ သုံးမည်ဟု ကတိပေးရသည် |
| **Dedicated Hosts** | အကန့်အသတ် | ၁ နှစ် / ၃ နှစ် / On-Demand | Physical Core လိုက် License စစ်ဆေးသော Software (BYOL) | ဈေးအကြီးဆုံး ဖြစ်သည် |
| **Dedicated Instances** | အကန့်အသတ် | On-Demand သို့မဟုတ် RI | အခြား Customer များနှင့် Hardware မမျှဝေလိုသော Compliance လိုအပ်ချက် | Instance တစ်ခုချင်းစီအလိုက် စရိတ် ထပ်ဆောင်း ကောက်ခံသည် |

---

## ၁။ On-Demand Instances
- **အလုပ်လုပ်ပုံ:** သင် Server ဖွင့်ထားသည့် စက္ကန့်/မိနစ်တိုင်းအတွက်သာ တိုက်ရိုက်ပေးဆောင်ရပြီး ပိတ်လိုက်သည်နှင့် ငွေမကျတော့ပါ။
- **ဘယ်အချိန်သုံးမလဲ:** အသစ်စတင်တီထွင်နေသော Project များ၊ ယာယီ Test ပြုလုပ်ရန် လိုအပ်သောအခါနှင့် Traffic မည်မျှလာမည်ကို မသိရှိနိုင်သေးသော Workload များတွင် အသုံးပြုသည်။

## ၂။ Spot Instances (အသက်သာဆုံး - ၉၀% သက်သာ)
- **အလုပ်လုပ်ပုံ:** AWS Data Center များတွင် မည်သူမျှ မသုံးဘဲ ပိုလျှံနေသော (Spare Capacity) များကို ဈေးလျှော့၍ လေလံသဘောမျိုး ရောင်းချပေးခြင်း ဖြစ်သည်။
- **Spot Interruption (၂ မိနစ် သတိပေးချက်):** အကယ်၍ On-Demand Customer တစ်ဦးက ထို Hardware ကို လိုအပ်လာပါက AWS သည် သင့်ထံသို့ **၂ မိနစ် ကြိုတင်သတိပေးချက် (2-Minute Warning via EventBridge / Metadata)** ပေးပို့ပြီး Instance ကို ရပ်တန့် (Hibernate/Stop/Terminate) ပါမည်။
- **ဘယ်အချိန်သုံးမလဲ:** Data Processing, Video Transcoding, Machine Learning Training, Kubernetes Stateless Worker Nodes များကဲ့သို့ Server ခေတ္တရပ်သွားသော်လည်း အခြား Node က ဆက်လုပ်နိုင်သော Fault-tolerant Workload များတွင်သာ သုံးရပါမည်။ **Database Server များအတွက် လုံးဝ မသုံးရပါ။**

## ၃။ Reserved Instances (RI) vs Savings Plans
လုပ်ငန်းများတွင် ၂၄ နာရီ ၃၆၅ ရက်လုံး မရပ်မနား run ရမည့် Production Server များအတွက် ၁ နှစ် သို့မဟုတ် ၃ နှစ် ကတိကဝတ် (Commitment) ပြုလုပ်ပြီး ၇၀%+ အထိ စရိတ်ချွေတာနိုင်ပါသည်:

### Standard RI vs Convertible RI:
- **Standard RI (၇၂% အထိ သက်သာ):** Instance Type ကို နောင်တွင် ပြောင်းလဲခွင့် မရှိပါ (ဥပမာ- `t3.medium` မှ `m6i.large` သို့ ပြောင်း၍မရ)။ သို့သော် မလိုတော့ပါက Reserved Instance Marketplace တွင် ပြန်လည်ရောင်းချနိုင်သည်။
- **Convertible RI (၆၆% အထိ သက်သာ):** နောင်တွင် Instance Family, OS သို့မဟုတ် Size အသစ်သို့ ပြောင်းလဲ upgrade လုပ်ခွင့်ရှိသည်။ (Marketplace တွင် ပြန်ရောင်း၍မရ)။

### Savings Plans (AWS ၏ ခေတ်သစ် အကြံပြုချက်):
ယခုအခါ AWS သည် ရိုးရိုး RI ထက် ပိုမိုပြောင်းလွယ်ပြင်လွယ်ရှိသော **Savings Plans** ကို သုံးရန် တိုက်တွန်းပါသည်:
1. **EC2 Instance Savings Plans:** သတ်မှတ်ထားသော Region အတွင်း Instance Family တစ်ခုတည်းအတွင်း Size များကို လွတ်လပ်စွာ ပြောင်းလဲခွင့်ရသည် (ဥပမာ- `c6i.large` မှ `c6i.xlarge` သို့)။
2. **Compute Savings Plans (အလွန်ပြောင်းလွယ်သည်):** Region မတူခြင်း၊ Instance Family ပြောင်းခြင်းအပြင် **EC2 မှ Fargate သို့မဟုတ် Lambda သို့ ပြောင်းလဲအသုံးပြုသော်လည်း Discount ဆက်လက်ရရှိသည်**။

---

## ၄။ Dedicated Hosts vs Dedicated Instances (SAA-C03 အမေးများဆုံး Trap)

စာမေးပွဲတွင် ဤနှစ်ခု၏ ကွာခြားချက်ကို အမြဲလှည့်မေးလေ့ရှိပါသည်:

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│         Dedicated Host          │   │       Dedicated Instance        │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ • Physical Server တစ်လုံးလုံးကို  │   │ • Physical Server ပေါ်တွင် မိမိ၏ │
│   မိမိအကောင့်တစ်ခုတည်းက ထိန်းချုပ် │   │   Instances များကိုသာ ထားပေးသည် │
│ • Sockets, Cores များကို တိုက်ရိုက်  │   │ • သို့သော် Physical Cores/CPU   │
│   မြင်နိုင်သည်                   │   │   တည်နေရာကို ထိန်းချုပ်ခွင့်မရှိ  │
│ • BYOL (Bring Your Own License) │   │ • အခြား Customer များနှင့် Hardware│
│   အတွက် မဖြစ်မနေ လိုအပ်သည်        │   │   မမျှဝေရုံသာ ရည်ရွယ်သည်       │
│ • စရိတ်: Host တစ်လုံးလုံးအတွက် ပေးရ │   │ • စရိတ်: Instance တစ်ခုချင်းစီ +   │
│                                 │   │   Dedicated Fee ပေးရသည်         │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 🎯 Production Cost Optimization Decision Tree (ဆုံးဖြတ်ချက်ဇယား)

```
                       [ သင်၏ Workload အမျိုးအစား ]
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
[ မရပ်မနား Run မည့် Steady State ]                 [ ယာယီ / ခန့်မှန်းရခက်သော State ]
           │                                                 │
   ┌───────┴───────┐                                 ┌───────┴───────┐
   ▼               ▼                                 ▼               ▼
[ 1~3 Year ]  [ License Per Core ]           [ Interrupt ခံနိုင် ] [ Interrupt မခံနိုင် ]
   │               │                                 │               │
Savings Plans   Dedicated Host                  Spot Instances   On-Demand
```
