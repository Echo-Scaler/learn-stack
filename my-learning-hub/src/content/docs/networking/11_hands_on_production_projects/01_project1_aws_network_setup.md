---
title: Project 1 — AWS Production Network Setup Lab
description: Multi-AZ VPC တည်ဆောက်ခြင်း, Public/Private Subnets ခွဲခြင်း, Route Tables, Security Groups နှင့် SSM Session Manager
---

## 📌 Project Overview
AWS ပေါ်တွင် Enterprise-grade Multi-AZ Network တစ်ခုကို အစအဆုံး တည်ဆောက်ပါမည်။

### Tasks Breakdown
1. **VPC Creation:** CIDR `10.0.0.0/16` ဖြင့် VPC တည်ဆောက်ပါ။
2. **Subnets:** AZ-a နှင့် AZ-c တွင် Public Subnet ၂ ခု (`10.0.1.0/24`, `10.0.2.0/24`) နှင့် Private Subnet ၂ ခု (`10.0.11.0/24`, `10.0.12.0/24`) တည်ဆောက်ပါ။
3. **Internet Gateway & Route:** IGW တပ်ဆင်ပြီး Public Route Table တွင် `0.0.0.0/0 -> igw` ချိတ်ပါ။
4. **NAT Gateway & Private Route:** Public Subnet တွင် NAT Gateway ထားရှိပြီး Private Route Table တွင် `0.0.0.0/0 -> nat` ချိတ်ပါ။
5. **SSM Testing:** Private Subnet ထဲရှိ EC2 သို့ Port 22 မဖွင့်ဘဲ **AWS Systems Manager (Session Manager)** ဖြင့် ဝင်ရောက်စမ်းသပ်ပါ။
