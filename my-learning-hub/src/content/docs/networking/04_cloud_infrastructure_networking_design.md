---
title: Cloud VPC Networking Design (AWS / Azure / GCP)
description: Cloud Virtual Private Cloud (VPC), Multi-Tier Subnets, Internet Gateway vs NAT Gateway, Route Tables, Stateful Security Groups vs Stateless NACLs, Multi-AZ High Availability
---

Cloud Platform များ (AWS, Azure, GCP) ပေါ်တွင် Enterprise System တစ်ခုကို တည်ဆောက်သည့်အခါ Physical Router/Cable များကို ကိုင်တွယ်စရာမလိုဘဲ Software ဖြင့် ကွန်ရက်တစ်ခုလုံးကို တည်ဆောက်ထိန်းချုပ်နိုင်သည့် **Software-Defined Networking (SDN)** သို့မဟုတ် **VPC (Virtual Private Cloud)** ကို အသုံးပြုကြသည်။ Production-Grade Cloud VPC ဗိသုကာကို အသေးစိတ် လေ့လာပါမည်။

---

## ၁။ Cloud VPC ဆိုတာ ဘာလဲ? (What & Why)

**VPC (Virtual Private Cloud)** ဆိုသည်မှာ AWS/Cloud ဒေတာစင်တာကြီးများအတွင်း မိမိကုမ္ပဏီ သီးသန့်အတွက် ခွဲထုတ်ပေးထားသော **သီးခြားလုံခြုံသည့် Isolated Virtual Network** ဖြစ်သည်။
- မိမိစိတ်ကြိုက် IP Range (ဥပမာ- `10.0.0.0/16`) သတ်မှတ်နိုင်သည်။
- Subnet များ၊ Routing Rules များ၊ Gateways များနှင့် Firewalls များကို လွတ်လပ်စွာ စီမံခန့်ခွဲနိုင်သည်။

```
+-----------------------------------------------------------------------------------------+
|                                AWS VPC (10.0.0.0/16)                                    |
|                                                                                         |
|  [ Availability Zone A (ap-northeast-1a) ]   [ Availability Zone C (ap-northeast-1c) ]  |
|                                                                                         |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Public Subnet A (10.0.1.0/24)         |   | Public Subnet C (10.0.2.0/24)         |  |
|  | - Internet Facing ALB                 |   | - Internet Facing ALB                 |  |
|  | - NAT Gateway A                       |   | - NAT Gateway C (HA)                  |  |
|  +---------------------------------------+   +---------------------------------------+  |
|                     │                                           │                       |
|                     ▼                                           ▼                       |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Private App Subnet A (10.0.11.0/24)   |   | Private App Subnet C (10.0.12.0/24)   |  |
|  | - EC2 Web / API / Docker Instances    |   | - EC2 Web / API / Docker Instances    |  |
|  +---------------------------------------+   +---------------------------------------+  |
|                     │                                           │                       |
|                     ▼                                           ▼                       |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Isolated DB Subnet A (10.0.21.0/24)   |   | Isolated DB Subnet C (10.0.22.0/24)   |  |
|  | - RDS MySQL Primary                   |   | - RDS MySQL Read Replica / Multi-AZ   |  |
|  +---------------------------------------+   +---------------------------------------+  |
+-----------------------------------------------------------------------------------------+
       │                                                              │
       ▼ (Via IGW)                                                    ▼ (Via NAT Gateway)
[ Public Internet ]                                            [ Outbound Only to Internet ]
```

---

## ၂။ 3-Tier Subnet Architecture (Public vs Private vs Isolated)

Production စနစ်များတွင် လုံခြုံရေးအရ Subnet များကို အဆင့် ၃ ဆင့် ခွဲခြားတည်ဆောက်ရပါသည်:

| Subnet Tier | အသုံးပြုသော Service များ | Internet ဝင်ရောက်နိုင်မှု (Inbound) | Internet ထွက်ခွာနိုင်မှု (Outbound) | လုံခြုံရေးအဆင့် |
| :--- | :--- | :---: | :---: | :---: |
| **1. Public Subnet** | Application Load Balancer (ALB), NAT Gateway, Bastion Host | ဖွင့်ထားသည် (Via IGW) | ဖွင့်ထားသည် (Via IGW) | အပြင်နှင့် တိုက်ရိုက် ထိတွေ့သည် |
| **2. Private App Subnet** | Backend API, Microservices, Worker Servers | လုံးဝပိတ်ထားသည် | ဖွင့်ထားသည် (Via NAT Gateway - Outbound only) | မြင့်မားသည် |
| **3. Isolated DB Subnet** | RDS MySQL, PostgreSQL, Redis ElastiCache | လုံးဝပိတ်ထားသည် | လုံးဝပိတ်ထားသည် (No Internet) | အမြင့်မားဆုံး လုံခြုံရေး |

---

## ၃။ Internet Gateway (IGW) vs NAT Gateway

အစပြုသူများ အမေးများဆုံးနှင့် အမှားများဆုံး အချက်ဖြစ်သည်:

```
+---------------------------------------+     Bi-directional      +--------------------+
| Internet Gateway (IGW)                | <=====================> | Public Subnet      |
| - Inbound & Outbound နှစ်ဖက်စလုံးရသည် |                         | (ALB, Bastion)     |
+---------------------------------------+                         +--------------------+

+---------------------------------------+     Outbound ONLY       +--------------------+
| NAT Gateway (Network Address Trans)   | ----------------------> | Private Subnet     |
| - အပြင်မှ အတွင်းသို့ လုံးဝ ဝင်မရပါ     | (One-way Egress)        | (App Instances)    |
| - အတွင်းမှ အပြင်သို့သာ ထွက်နိုင်သည်    |                         |                    |
+---------------------------------------+                         +--------------------+
```

### လက်တွေ့ အသုံးချမှု:
- **Private Subnet ရှိ App Server** သည် အင်တာနက်မှ User များနှင့် တိုက်ရိုက်မထိတွေ့လိုသော်လည်း `composer install`, `apt-get update` သို့မဟုတ် Stripe/KBZPay API သို့ Payment Call ခေါ်ရန်အတွက် အင်တာနက် ထွက်ခွင့် လိုအပ်သည်။
- ထိုအခါ App Server သည် **NAT Gateway** ကို ဖြတ်၍ အပြင်သို့ ထွက်ရသည်။ ပြင်ပ Hacker များသည် NAT Gateway ကို ဖြတ်၍ အတွင်း App Server ဆီသို့ လုံးဝ ဝင်ရောက်၍ မရပါ။

---

## ၄။ Route Tables နှင့် Packet Flow

Subnet တစ်ခုစီသည် မည်သည့်လမ်းကြောင်းသို့ သွားရမည်ကို ဆုံးဖြတ်ရန် **Route Table** တစ်ခုစီနှင့် ချိတ်ဆက်ထားရသည်:

### ၄.၁ Public Subnet Route Table
```
Destination          Target
10.0.0.0/16          local               (VPC အတွင်း အချင်းချင်း ဆက်သွယ်မှု)
0.0.0.0/0            igw-01928374a5b6c   (ကျန် အင်တာနက် အားလုံးသည် IGW သို့ သွားမည်)
```

### ၄.၂ Private Subnet Route Table
```
Destination          Target
10.0.0.0/16          local               (VPC အတွင်း အချင်းချင်း ဆက်သွယ်မှု)
0.0.0.0/0            nat-0987654321fed   (ကျန် အင်တာနက် အားလုံးသည် NAT Gateway သို့ သွားမည်)
```

### ၄.၃ Isolated Database Subnet Route Table
```
Destination          Target
10.0.0.0/16          local               (VPC အတွင်း အချင်းချင်းသာ ဆက်သွယ်နိုင်ပြီး အင်တာနက် လမ်းကြောင်း မရှိပါ)
```

---

## ၅။ Security Groups vs Network ACLs (NACLs)

Cloud ပေါ်တွင် Firewall အဆင့် ၂ ဆင့် ထားရှိကာ Defense-in-Depth လုံခြုံရေးကို တည်ဆောက်သည်:

```
Incoming Request
       │
       ▼
[ Network ACL (NACL) ]  <--- Subnet Level (Stateless)
       │
       ▼
[ Security Group (SG) ] <--- Instance / ENI Level (Stateful)
       │
       ▼
[ EC2 Instance / Container ]
```

| အချက်အလက် | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operating Level** | Instance / Network Interface (ENI) Level | Subnet Boundary Level |
| **State Nature** | **Stateful** (Inbound ခွင့်ပြုပါက Outbound အလိုအလျောက် ပွင့်သည်) | **Stateless** (Inbound နှင့် Outbound နှစ်ဖက်စလုံး သီးခြား စည်းကမ်းသတ်မှတ်ရသည်) |
| **Rules Type** | **ALLOW Rules သာ** ထည့်သွင်းနိုင်သည် | **ALLOW နှင့် DENY Rules နှစ်မျိုးစလုံး** ထည့်သွင်းနိုင်သည် |
| **Evaluation Order** | Rule အားလုံးကို တစ်ပြိုင်နက် Evaluate လုပ်သည် | Rule Number (ဥပမာ- 100, 200) အလိုက် အစဉ်လိုက် စစ်ဆေးသည် |
| **Real-work Use** | Server တိုင်း၏ Port ဖွင့်/ပိတ် အတွက် နေ့စဉ် သုံးသည် | Subnet တစ်ခုလုံးသို့ DDOS တိုက်ခိုက်သော Blacklisted IP များကို Block ရန် သုံးသည် |

---

## ၆။ Multi-AZ High Availability (လုပ်ငန်းခွင် စံချိန်စံညွှန်း)

Production စနစ်များတွင် ဒေတာစင်တာတစ်ခုလုံး မီးပျက်ခြင်း သို့မဟုတ် ငလျင်လှုပ်ခြင်းကြောင့် Down မသွားစေရန်:
- အနည်းဆုံး **Availability Zone (AZ) ၂ ခု သို့မဟုတ် ၃ ခု** (ဥပမာ- `ap-northeast-1a`, `ap-northeast-1c`, `ap-northeast-1d`) တွင် Subnet များကို အချိုးကျ ခွဲဝေဖြန့်ကြက်ရပါမည်။
- Public Load Balancer က AZ နှစ်ခုစလုံးရှိ Application Server များထံသို့ Traffic ကို အညီအမျှ ဝေမျှပေးပြီး၊ AZ တစ်ခု Down သွားပါက ကျန် AZ က စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ဆက်လက်လည်ပတ်ပေးမည် (High Availability)။
