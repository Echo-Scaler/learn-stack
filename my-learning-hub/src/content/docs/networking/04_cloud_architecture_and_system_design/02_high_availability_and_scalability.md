---
title: High Availability, Fault Tolerance & Scaling Strategies
description: Region vs AZ, HA vs Fault Tolerance, Scalability vs Elasticity, Vertical Scaling vs Horizontal Scaling
---

## ၁။ High Availability (HA) vs Fault Tolerance

- **HA:** Component တစ်ခု ပျက်စီးသော်လည်း စနစ်တစ်ခုလုံး မကျသွားဘဲ ဆက်လက်လည်ပတ်နိုင်ခြင်း (Multi-AZ Deployment)။
- **Fault Tolerance:** စနစ်အတွင်း Server တစ်ခု သေသွားသော်လည်း သုံးစွဲသူထံ Zero Downtime ဖြင့် ချက်ချင်း အလိုအလျောက် အစားထိုးနိုင်ခြင်း။

---

## ၂။ Vertical Scaling (Scale-Up) vs Horizontal Scaling (Scale-Out)

- **Vertical Scaling:** စက်တစ်လုံးတည်း၏ CPU/RAM ကို မြှင့်တင်ခြင်း (`t3.micro` -> `m5.large`) — Downtime ရှိနိုင်ပြီး အကန့်အသတ်ရှိသည်။
- **Horizontal Scaling:** တူညီသော Server အသေးစားများကို Load Balancer နောက်တွင် အလုံးရေ တိုးမြှင့်ခြင်း — Zero Downtime ဖြစ်ပြီး အကန့်အသတ်မရှိ တိုးချဲ့နိုင်သည်။
