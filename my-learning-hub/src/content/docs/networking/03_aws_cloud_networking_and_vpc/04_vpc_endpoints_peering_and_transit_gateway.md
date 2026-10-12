---
title: VPC Endpoints (PrivateLink), Peering & Transit Gateway
description: VPC Endpoints (Gateway vs Interface), VPC Peering နှင့် AWS Transit Gateway Hub-and-Spoke
---

## ၁။ VPC Endpoints (AWS PrivateLink)

Private Subnet ထဲရှိ EC2 များမှ AWS S3, DynamoDB သို့ သွားသည့်အခါ NAT Gateway နှင့် Public Internet ကို မဖြတ်ဘဲ AWS Internal Network မှ သီးသန့် ချိတ်ဆက်ပေးသည်:
- **Gateway Endpoint:** S3 နှင့် DynamoDB အတွက် အခမဲ့ Route Table Entry။
- **Interface Endpoint:** CloudWatch, SSM, ECR စသည်တို့အတွက် Private IP (ENI) ဖန်တီးပေးသော စနစ်။

---

## ၂။ VPC Peering vs AWS Transit Gateway

- **VPC Peering:** VPC ၂ ခုကြား တိုက်ရိုက် ချိတ်ဆက်ခြင်း (ရိုးရှင်းသည်၊ Non-transitive ဖြစ်သည်)။
- **AWS Transit Gateway:** VPC ပေါင်းများစွာ (10+ VPCs) နှင့် On-premises Network များကို ဗဟိုမှ ထိန်းချုပ်ပေးသော Cloud Router ကြီး ဖြစ်သည်။
