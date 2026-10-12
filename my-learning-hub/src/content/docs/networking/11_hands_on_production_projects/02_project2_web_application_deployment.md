---
title: Project 2 — Production Web Application Deployment Lab
description: EC2 Nginx, Web Application, Amazon RDS Multi-AZ MySQL, S3 Bucket Upload နှင့် ACM SSL Domain Setup
---

## 📌 Project Overview
3-Tier Web Application တစ်ခုကို AWS VPC ပေါ်တွင် Deploy လုပ်ပါမည်။

### Tasks Breakdown
1. Private Subnet ထဲရှိ EC2 ပေါ်တွင် Nginx Web Server နှင့် Backend API တင်ပါ။
2. Public Subnet တွင် Internet-Facing Application Load Balancer (ALB) တည်ဆောက်ပြီး EC2 Target Group သို့ ချိတ်ဆက်ပါ။
3. Private DB Subnet တွင် Multi-AZ Amazon RDS MySQL ချိတ်ဆက်ပါ။
4. User Media Uploads များအတွက် S3 Bucket ဖန်တီးပြီး IAM Role ဖြင့် ချိတ်ဆက်ပါ။
5. Route 53 Domain Name နှင့် AWS ACM SSL Certificate ချိတ်တွဲကာ HTTPS (Port 443) ဖြင့် စမ်းသပ်ပါ။
