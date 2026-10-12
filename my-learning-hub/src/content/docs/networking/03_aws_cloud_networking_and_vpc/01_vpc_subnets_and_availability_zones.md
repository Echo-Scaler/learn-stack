---
title: AWS VPC, CIDR Blocks & Availability Zones
description: Virtual Private Cloud (VPC), CIDR Block သတ်မှတ်ခြင်း, Public vs Private Subnets, Availability Zones (AZ)
---

## ၁။ AWS VPC (Virtual Private Cloud) ဆိုတာဘာလဲ?

AWS VPC သည် AWS Cloud Data Center ကြီးများအတွင်း မိမိကုမ္ပဏီ သီးသန့် အသုံးပြုနိုင်ရန် သီးခြားခွဲထုတ်ထားသော Isolated Virtual Network ဖြစ်သည်။
- မူလ CIDR Block: `10.0.0.0/16` (65,536 IPs)
- DNS Hostnames နှင့် DNS Resolution Enable ပြုလုပ်ရသည်။

---

## ၂။ Public Subnet vs Private Subnet

- **Public Subnet:** Internet Gateway (IGW) သို့ တိုက်ရိုက် Route ရှိသော Subnet ဖြစ်သည်။ ALB, NAT Gateway, Bastion Hosts များကို ထားရှိသည်။
- **Private Subnet:** Internet Gateway သို့ တိုက်ရိုက် Route မရှိသော Subnet ဖြစ်သည်။ Backend APIs, Workers, EC2 Instances များကို ထားရှိသည်။

---

## ၃။ Availability Zones (AZ) နှင့် Multi-AZ Design

Tokyo Region တွင် `ap-northeast-1a` နှင့် `ap-northeast-1c` စသဖြင့် သီးခြား Data Center ၂ ခု သို့မဟုတ် ၃ ခုတွင် Subnet များကို ခွဲဝေတည်ဆောက်ခြင်းဖြင့် Data Center တစ်ခု မီးပျက်သော်လည်း System မရပ်တန့်သွားစေပါ။
