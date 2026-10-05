---
title: "Phase 1 — AWS Core Concepts & Global Infrastructure"
description: "Architect Core Question: Application တစ်ခုကို ဘယ် AWS Region / AZ / Edge Location မှာ ထားရှိတည်ဆောက်ရင် Availability, Latency, Cost နဲ့ Compliance တွေ ဘယ်လိုပြ"
---

## Phase 1 — AWS Core Concepts & Global Infrastructure

> **Architect Core Question:** "Application တစ်ခုကို ဘယ် AWS Region / AZ / Edge Location မှာ ထားရှိတည်ဆောက်ရင် Availability, Latency, Cost နဲ့ Compliance တွေ ဘယ်လိုပြောင်းလဲသွားမလဲ?"

---

## ၁.၁ AWS Global Infrastructure (ကမ္ဘာလုံးဆိုင်ရာ အခြေခံအဆောက်အအုံ)

AWS ၏ Global Network သည် ကမ္ဘာ့အကြီးမားဆုံးနှင့် အလုံခြုံဆုံး Private Fiber Optic Backbone ကွန်ရက်ပေါ်တွင် တည်ဆောက်ထားသည်။

```
+-----------------------------------------------------------------------------------+
|                           AWS GLOBAL INFRASTRUCTURE MATRIX                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [AWS Regions]                                                                    |
|  - ကမ္ဘာတဝှမ်းရှိ သီးခြား ပထဝီဝင် နယ်မြေများ (ဥပမာ - Tokyo, Singapore, N. Virginia)   |
|  - Region အချင်းချင်းသည် လုံးဝ သီးခြားဖြစ်ပြီး AWS Private High-Speed Network ဖြင့် ချိတ်သည်|
|                                                                                   |
|  [Availability Zones (AZs)]                                                       |
|  - Region တစ်ခုစီတွင် အနည်းဆုံး AZ (၃) ခု သို့မဟုတ် ထို့ထက်ပို၍ ပါဝင်သည်              |
|  - AZ တစ်ခုစီသည် သီးခြား မီးလိုင်း၊ Generator နှင့် အအေးပေးစနစ်ပါသော Data Center များဖြစ်|
|  - AZ အချင်းချင်းကို <1-2ms Latency ရှိသော Private Redundant Fiber ဖြင့် ဆက်ထားသည်   |
|                                                                                   |
|  [Edge Locations (400+ Points of Presence - PoPs)]                                |
|  - ကမ္ဘာအနှံ့ မြို့ကြီး ၄၀၀ ကျော်တွင် ရှိသော Caching Node များ ဖြစ်သည်                |
|  - Amazon CloudFront (CDN), AWS Route 53 (DNS), AWS WAF, AWS Shield တို့ သုံးသည်    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Multi-AZ vs Multi-Region မဟာဗျူဟာ နှိုင်းယှဉ်ချက်

```
+------------------------------------+------------------------------------+
| Multi-AZ Architecture             | Multi-Region Architecture          |
+------------------------------------+------------------------------------+
| - Region တစ်ခုတည်းအတွင်း AZ (၂) ခု  | ကွဲပြားသော နိုင်ငံ/ဒေသ (၂) ခုတွင်  |
|   သို့မဟုတ် (၃) ခု ခွဲထားခြင်း     | စနစ် တပြိုင်နက် Run ထားခြင်း       |
| - Data Center ပျက်ကျမှု (DC Failure)| Region တစ်ခုလုံး ငလျင်/စစ်ပွဲကြောင့် |
|   ကို ကာကွယ်သည် (High Availability)| လုံးဝ ပျက်စီးသွားမှုကို ကာကွယ်သည် (DR)|
| - Latency: အလွန်မြန်သည် (<2ms)     | Latency: Cross-region ကြောင့် 10-100ms|
| - Synchronous DB Replication ဖြစ်နိုင်| Asynchronous DB Replication ဖြစ်သည်|
| - ကုန်ကျစရိတ်: သင့်တင့်သည်         | ကုန်ကျစရိတ်: ၂ ဆ သို့မဟုတ် ပိုကြီးသည်|
+------------------------------------+------------------------------------+
```

### Architect's Decision Matrix: Region ရွေးချယ်ရာတွင် စဉ်းစားရမည့် အချက် (၄) ချက်
1. **Compliance & Legal (ဥပဒေ စည်းမျဉ်း):** နိုင်ငံ၏ Data Sovereignty ဥပဒေအရ Customer Data သည် နိုင်ငံတွင်းသာ ရှိရမည် (ဥပမာ - ဂျပန် Financial data သည် Tokyo/Osaka တွင်သာ ရှိရမည်)။
2. **Proximity & Latency (သုံးစွဲသူနှင့် အကွာအဝေး):** သုံးစွဲသူအများစု ရှိရာနေရာနှင့် အနီးဆုံး Region ကို ရွေးရမည် (ဂျပန် User များအတွက် `ap-northeast-1` Tokyo)။
3. **Available Services (ဝန်ဆောင်မှု ရရှိနိုင်မှု):** AWS Service အသစ်များ (ဥပမာ Generative AI / Bedrock models အသစ်များ) သည် Region အားလုံးတွင် တပြိုင်နက် မရနိုင်ပါ (`us-east-1` တွင် အရင်ဆုံး ရလေ့ရှိသည်)။
4. **Pricing (ကုန်ကျစရိတ် ကွာခြားမှု):** Region အလိုက် ဒေသဆိုင်ရာ လျှပ်စစ်ခနှင့် အခွန်မတူညီသဖြင့် ဈေးနှုန်း ကွာခြားပါသည် (us-east-1 သည် အသက်သာဆုံးဖြစ်ပြီး Sao Paulo, Brazil သည် ကုန်ကျစရိတ် အမြင့်ဆုံးဖြစ်သည်)။

---

## ၁.၂ AWS Shared Responsibility Model (လုံခြုံရေး တာဝန်ခွဲဝေမှု မော်ဒယ်)

SAA-C03 စာမေးပွဲတွင်ရော Production တွင်ပါ Service တစ်ခုကို သုံးသည့်အခါ **"ဒါ AWS တာဝန်လား? Customer တာဝန်လား?"** ကို တိကျစွာ ခွဲခြားနိုင်ရမည်။

```
+-----------------------------------------------------------------------------------+
|                         AWS SHARED RESPONSIBILITY MODEL                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [CUSTOMER RESPONSIBILITY] -> "Security IN the Cloud"                             |
|  ├── Customer Data (Encryption at rest & in transit)                              |
|  ├── IAM (Users, Roles, Password Policy, MFA enforcement)                         |
|  ├── Operating System Configuration & Security Patches (EC2)                      |
|  ├── Network & Firewall Configuration (Security Groups, NACLs, Routing)           |
|  └── Application Code & Logic Security                                            |
|                                                                                   |
|  ===============================================================================  |
|                                                                                   |
|  [AWS RESPONSIBILITY] -> "Security OF the Cloud"                                  |
|  ├── Physical Data Center Security (Biometrics, Armed Guards, CCTV, Fences)       |
|  ├── Hardware & Global Infrastructure (Servers, Storage Disks, Fiber Cables)      |
|  ├── Power & Cooling Infrastructure (Generators, HVAC)                            |
|  ├── Virtualization Layer (Hypervisor, Nitro System)                              |
|  └── Managed Services Management (S3, DynamoDB, RDS Underlying OS Patching)       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Exam Service Responsibilities Scenario Matrix

| AWS Service | AWS တာဝန် | Customer တာဝန် |
| :--- | :--- | :--- |
| **Amazon EC2** | Physical Host, Hypervisor, Network cable | **OS Installation, OS Security Patches, App code, Security Groups, SSH Keys** |
| **Amazon RDS** | Hardware, **OS Installation & OS Security Patching**, DB Engine Installation | **DB User Passwords, DB Optimization, Table Schema, Network Subnets, Encryption** |
| **AWS Lambda** | Hardware, OS, Language Runtime, Scaling, Patching | **Application Code သီးသန့်, IAM Execution Role, Function Timeout/Memory settings** |
| **Amazon S3** | Disk Storage, Hardware Replacement, 11 9's Durability | **Bucket Policy, S3 Block Public Access, Data Encryption, Object Versioning** |

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [02_Phase2_IAM_and_Security.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/02_Phase2_IAM_and_Security.md)
