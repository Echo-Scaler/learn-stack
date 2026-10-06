---
title: Networking & Cloud Automation Overview
description: Basic Networking, CIDR, VLSM Subnetting, Cloud VPC Architecture နှင့် Infrastructure as Code (Terraform) Automation အတွက် ပြည့်စုံသော လမ်းညွှန်သင်ရိုး
---

## 🌐 Networking, VLSM/CIDR & Cloud Infrastructure Automation Hub
### (ပြည့်စုံသော ကွန်ရက်အခြေခံ၊ Subnetting တွက်ချက်မှုနှင့် Cloud အခြေခံအဆောက်အအုံ Automation လမ်းညွှန်)

ခေတ်သစ် Software Engineer၊ Backend Developer နှင့် DevOps/Cloud Engineer တစ်ဦးအတွက် Code ရေးတတ်ရုံသာမက မိမိ၏ Application များ လည်ပတ်နေသည့် **Network ဖွဲ့စည်းပုံ၊ IP Subnetting (CIDR/VLSM) နှင့် Cloud Infrastructure ပေါ်တွင် အလိုအလျောက် တည်ဆောက်ခြင်း (IaC Automation)** ကို နားလည်တတ်ကျွမ်းထားရန် အရေးကြီးပါသည်။

---

## 📌 ၁။ သင်တန်းမိတ်ဆက် (Course Overview)

| အချက်အလက် (Item) | အသေးစိတ်ဖော်ပြချက် (Details) |
| :--- | :--- |
| **Course Title** | **Enterprise Networking, VLSM/CIDR & Cloud Infrastructure Automation** |
| **Level** | Zero to Cloud/DevOps Professional Ready |
| **Language** | မြန်မာဘာသာ (Burmese) ဖြင့် အသေးစိတ်ရှင်းလင်းချက် + လုပ်ငန်းခွင်သုံး English Technical Terms |
| **Methodology** | သီအိုရီအနှစ်ချုပ် (30%) + Subnetting လက်တွေ့တွက်ချက်နည်း (35%) + Cloud IaC Code Lab (35%) |
| **Target Audience** | Backend Developers, DevOps/SRE Engineers, Cloud Architects, System Administrators |

---

## 🎯 ၂။ ဘာကြောင့် Networking နှင့် Cloud Automation ကို တတ်မြောက်ထားသင့်သလဲ?

လုပ်ငန်းခွင် (Genba) တွင် အောက်ပါပြဿနာများကို ဖြေရှင်းနိုင်ရန် ဖြစ်သည်:
1. **Network Blindness ပပျောက်စေခြင်း**: Web Request တစ်ခု Slow ဖြစ်နေခြင်း၊ Database သို့ ချိတ်မရခြင်း (`Connection Timed Out`) များ ကြုံရသည့်အခါ Firewall, Security Group, Route Table သို့မဟုတ် NAT Gateway ပြဿနာလားဆိုသည်ကို ချက်ချင်း Trace လိုက်နိုင်ခြင်း။
2. **IP Exhaustion & Cloud Budget Waste ကာကွယ်ခြင်း**: CIDR နှင့် VLSM ကို မတွက်ချက်ဘဲ AWS VPC ဆောက်မိပါက IP မလုံလောက်၍ VPC အသစ်ပြန်ဆောက်ရခြင်း၊ သို့မဟုတ် IP အလဟဿ ဖြုန်းတီးမိခြင်းမှ ကာကွယ်ပေးခြင်း။
3. **Manual Human Errors ကို ဖယ်ရှားခြင်း**: Cloud Console UI မှ ခလုတ်များ လိုက်နှိပ်ပြီး VPC, Subnet, Route Table ဆောက်မည့်အစား Terraform ဖြင့် Code အဖြစ် ရေးသားကာ စက္ကန့်ပိုင်းအတွင်း တည်ဆောက်နိုင်ခြင်း (Infrastructure as Code)။

---

## 🗺️ ၃။ အခန်းလိုက် သင်ရိုးညွှန်းတမ်း (Syllabus Roadmap)

```
[Module 01: Core Networking]
  - OSI 7 Layer vs TCP/IP Model
  - Packet Journey, DNS, DHCP, NAT
  - TCP 3-Way Handshake, UDP, Common Ports
       │
       ▼
[Module 02: IPv4 & CIDR]
  - IPv4 Structure (Network ID vs Host ID)
  - Classful vs Classless (CIDR /8 to /32)
  - Subnet Masks & Usable Hosts Formula
       │
       ▼
[Module 03: VLSM Deep Dive]
  - Variable Length Subnet Masking (Why & How)
  - Step-by-step Subnet Allocation Algorithm
  - Real-world Enterprise Office & Multi-Tier Subnetting
       │
       ▼
[Module 04: Cloud VPC Architecture]
  - AWS/Cloud VPC, Public vs Private Subnets
  - Internet Gateway (IGW) vs NAT Gateway
  - Route Tables, Security Groups (Stateful) vs NACLs (Stateless)
       │
       ▼
[Module 05: Cloud Infrastructure Automation]
  - Infrastructure as Code (IaC) with Terraform
  - Dynamic Subnetting via `cidrsubnet()`
  - Automated Bastion Host, Cloud-Init & CI/CD Pipeline
```

---

## 📖 ၄။ သင်ခန်းစာဖိုင်များ လမ်းညွှန် (Dedicated Learning Guides)

| အခန်း | ခေါင်းစဉ် (Topic) | ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အချက်များ |
| :---: | :--- | :--- | :--- |
| **01** | **Basic Networking Fundamentals** | [01_basic_networking_fundamentals.md](/networking/01_basic_networking_fundamentals/) | OSI 7 Layers vs TCP/IP၊ Packet Delivery Flow၊ Switch vs Router၊ DNS Resolution Flow၊ DHCP အလုပ်လုပ်ပုံ၊ NAT (SNAT/DNAT)၊ TCP vs UDP |
| **02** | **IPv4, Subnetting & CIDR** | [02_ipv4_cidr_and_subnetting.md](/networking/02_ipv4_cidr_and_subnetting.md/) | IPv4 Structure၊ Classful ပြဿနာ၊ CIDR Notation (/24, /16, /28)၊ Subnet Mask တွက်ချက်နည်း၊ Usable Hosts Formula ($2^{H} - 2$) |
| **03** | **VLSM (Variable Length Subnet Masking)** | [03_vlsm_variable_length_subnet_masking.md](/networking/03_vlsm_variable_length_subnet_masking.md/) | VLSM ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးရသလဲ၊ အကြီးဆုံးမှ အသေးဆုံးသို့ အဆင့်ဆင့် ခွဲဝေတွက်ချက်နည်း၊ Enterprise ရုံးခွဲများအတွက် Practical Worked Examples |
| **04** | **Cloud VPC Networking Design** | [04_cloud_infrastructure_networking_design.md](/networking/04_cloud_infrastructure_networking_design.md/) | AWS VPC Architecture၊ Public/Private/Database Subnets၊ IGW, NAT Gateway၊ Route Table Routing၊ Stateful Security Groups vs Stateless NACLs |
| **05** | **Cloud Infrastructure Automation** | [05_cloud_infrastructure_automation_preparation.md](/networking/05_cloud_infrastructure_automation_preparation.md/) | Terraform ဖြင့် VPC & Subnets အလိုအလျောက် ဆောက်ခြင်း၊ `cidrsubnet()` Function၊ Cloud-Init Bootstrap Script၊ CI/CD Pipeline Ready Setup |
