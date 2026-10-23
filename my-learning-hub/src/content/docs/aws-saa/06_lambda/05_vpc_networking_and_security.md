---
title: "၅။ VPC Networking & Security"
description: "Lambda in VPC၊ Hyperplane ENI၊ Private Subnet RDS Access၊ Outbound Internet via NAT Gateway နှင့် Resource-Based Policies"
---

# ၅။ VPC Networking & Security

## Lambda in VPC (Private Subnet ရှိ RDS Database သို့ ချိတ်ဆက်ခြင်း)

Default အားဖြင့် Lambda Function များသည် သင့် VPC ၏ ပြင်ပ (AWS Managed Serverless Network) တွင် Run သဖြင့် အင်တာနက်ကို တိုက်ရိုက် ထွက်နိုင်သော်လည်း **Private Subnet အတွင်းရှိ RDS PostgreSQL/MySQL Database သို့ တိုက်ရိုက် ဆက်သွယ်၍ မရပါ**။

Private Database ကို လှမ်းခေါ်နိုင်ရန် Lambda တွင် **VPC Configuration (Subnets & Security Groups)** ကို သတ်မှတ်ပေးရပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VPC (10.0.0.0/16)                               │
│                                                                        │
│  [ AWS Lambda Function ]                                               │
│            │                                                           │
│            ▼ (AWS Hyperplane ENI)                                      │
│  ┌─────────────────────────────────┐                                   │
│  │ Private Subnet (10.0.2.0/24)    │                                   │
│  │                                 │                                   │
│  │  [ Lambda ENI: 10.0.2.55 ]      │                                   │
│  │            │                    │                                   │
│  │            ▼ (Port 5432)        │                                   │
│  │  [ Amazon RDS Database ]        │                                   │
│  └─────────────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ SAA-C03 အရေးအကြီးဆုံး စာမေးပွဲ လှည့်ကွက်: "VPC Lambda မှ အင်တာနက် ထွက်ခြင်း"

> **စာမေးပွဲ အမေးများဆုံး ပြဿနာ:**  
> Lambda Function တစ်ခုကို VPC နှင့် ချိတ်ဆက်ပြီးသည့်အခါ Private RDS ကို ဆက်သွယ်နိုင်သော်လည်း **ပြင်ပ Third-Party API (ဥပမာ- Stripe Payment API) သို့ အင်တာနက် ထွက်၍ မရတော့ဘဲ Timeout ဖြစ်သွားသည်**။ Function ကို Public Subnet တွင် ထားထားသော်လည်း အင်တာနက် မထွက်နိုင်ပါ။

### 💡 ရှင်းလင်းချက်နှင့် အဖြေမှန်:
Lambda သည် Public Subnet တွင် ထားရှိစေကာမူ ၎င်း၏ ENI တွင် **Public IP မရရှိပါ** (Private IP သာ ရသည်)။ ထို့ကြောင့် Internet Gateway သို့ တိုက်ရိုက် မသွားနိုင်ပါ။  
**အဖြေမှန်:**  
Lambda ကို **Private Subnet** တွင် ထားရှိပြီး၊ ထို Subnet ၏ Route Table အား **Public Subnet တွင် ရှိသော NAT Gateway** ဆီသို့ `0.0.0.0/0 -> nat-gateway-id` ချိန်ပေးရပါမည်။

---

## AWS Hyperplane ENI (ခေတ်သစ် VPC Performance)

ယခင်က Lambda ကို VPC ထဲ ထည့်ပါက ENI ဆောက်ရသဖြင့် Cold Start သည် စက္ကန့် ၃၀ ခန့်အထိ ကြာမြင့်ခဲ့သည်။  
ခေတ်သစ် AWS တွင် **Hyperplane ENI** နည်းပညာဖြင့် Subnet/SG တူညီသော Lambda Functions ထောင်ပေါင်းများစွာသည် ကြိုတင်ဆောက်ထားသော Shared Network Interface ကို မျှဝေသုံးစွဲသဖြင့် **VPC Cold Start သည် သာမန် Lambda ကဲ့သို့ပင် မီလီစက္ကန့်ပိုင်းအတွင်း လျင်မြန်စွာ အလုပ်လုပ်ပါသည်**။
