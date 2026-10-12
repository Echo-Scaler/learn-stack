---
title: Multi-Tier Architecture & Load Balancing Architecture
description: Single-Server vs 3-Tier Architecture (Web, App, DB Layers), Reverse Proxy Architecture, Load Balancer Design
---

## ၁။ Single-Server vs Multi-Tier Architecture

```
[ Single-Server: Nginx + App + DB တစ်လုံးတည်း ]
-> Single Point of Failure ဖြစ်ပြီး Traffic တက်ပါက ပြိုလဲတတ်သည်။

[ 3-Tier Architecture ]
Tier 1: Public Subnet -> Application Load Balancer
Tier 2: Private Subnet -> Auto Scaling EC2 Backend App
Tier 3: Isolated Subnet -> Amazon RDS MySQL Multi-AZ Primary & Standby
```

---

## ၂။ Reverse Proxy & ALB SSL Offloading

ALB တွင် SSL Certificate ချိတ်တွဲပြီး HTTPS Handshake ကို အဆုံးသတ်ပေးသည် (SSL Offloading)။ Backend EC2 Servers များသို့ ရိုးရိုး HTTP ဖြင့် ကူးပြောင်းပေးသဖြင့် Server CPU ဝန်ကို လျှော့ချပေးသည်။
