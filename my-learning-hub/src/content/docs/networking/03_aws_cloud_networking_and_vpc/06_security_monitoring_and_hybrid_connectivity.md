---
title: AWS WAF, VPC Flow Logs, Site-to-Site VPN & Direct Connect
description: AWS WAF Web Application Firewall, VPC Flow Logs, Hybrid Cloud Connectivity (Site-to-Site VPN & AWS Direct Connect)
---

## ၁။ AWS WAF & VPC Flow Logs

- **AWS WAF:** SQL Injection, XSS, Rate Limiting (DDoS ကာကွယ်မှု) များကို ALB ပေါ်တွင် စစ်ဆေးကာကွယ်ပေးသည်။
- **VPC Flow Logs:** Subnet နှင့် Interface များပေါ်ရှိ Network Traffic (Source, Dest, Port, ACCEPT/REJECT) များကို CloudWatch သို့ မှတ်တမ်းတင်ပေးသည်။

---

## ၂။ Hybrid Cloud: Site-to-Site VPN vs Direct Connect (DX)

- **AWS Site-to-Site VPN:** Public Internet ပေါ်မှ IPsec Encrypted Tunnel ဖြင့် ချိတ်ဆက်ခြင်း (သက်သာသည်၊ မြန်ဆန်စွာ Setup လုပ်နိုင်သည်)။
- **AWS Direct Connect (DX):** Internet ကို မဖြတ်ဘဲ သီးသန့် Physical Fiber Cable ဖြင့် AWS သို့ တိုက်ရိုက် ချိတ်ဆက်ခြင်း (Bandwidth အမြင့်မားဆုံး၊ Latency တည်ငြိမ်သည်)။
