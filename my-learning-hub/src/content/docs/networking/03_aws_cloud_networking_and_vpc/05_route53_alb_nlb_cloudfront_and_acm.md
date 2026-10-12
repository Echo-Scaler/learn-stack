---
title: Route 53, ALB, NLB, CloudFront (CDN) & ACM
description: Amazon Route 53 Managed DNS, Application Load Balancer vs Network Load Balancer, CloudFront Edge Caching နှင့် ACM SSL Certificates
---

## ၁။ Route 53 & ACM

- **Amazon Route 53:** 100% SLA ရှိသော Highly Available Managed DNS ဝန်ဆောင်မှု။
- **AWS Certificate Manager (ACM):** အခမဲ့ Public SSL/TLS Certificates ထုတ်ပေးပြီး ALB/CloudFront တွင် Auto-Renewal ဖြင့် သုံးနိုင်သည်။

---

## ၂။ Application Load Balancer (ALB) vs Network Load Balancer (NLB)

- **ALB (Layer 7):** HTTP/HTTPS, Path-based routing (`/api`), SSL Termination, Cookie Sticky Sessions။
- **NLB (Layer 4):** Ultra-high Performance, Static IP, Millions of requests per second, Extreme low latency။

---

## ၃။ CloudFront (CDN)

Static Assets (Images, CSS, JS) များကို Edge Locations များမှတစ်ဆင့် Cache လုပ်ပေးပြီး Website တုံ့ပြန်မှု မြန်ဆန်စေသည်။
