---
title: "၇။ High Availability, ASG & ALB"
description: "Auto Scaling Groups (ASG)၊ Launch Templates၊ Application Load Balancer (ALB)၊ Target Groups နှင့် Multi-AZ High Availability ဗိသုကာ"
---

# ၇။ High Availability, ASG & ALB

## High Availability (HA) ဆိုတာဘာလဲ?

Single EC2 Instance တစ်ခုတည်းဖြင့် Run ထားသော စနစ်သည် **Single Point of Failure (SPOF)** ဖြစ်ပါသည်။ အကယ်၍ ထို Server ရှိရာ Data Center (Availability Zone) တွင် မီးပျက်သွားပါက သို့မဟုတ် Hardware ချွတ်ယွင်းသွားပါက လုပ်ငန်းတစ်ခုလုံး ရပ်ဆိုင်းသွားပါမည်။

**High Availability (HA)** ဆိုသည်မှာ Server များ သို့မဟုတ် Data Center တစ်ခု ပျက်စီးသွားသော်လည်း အခြားသော Server များနှင့် Availability Zones များက အစားထိုး တာဝန်ယူပေးနိုင်သော စနစ်ကို ခေါ်ဆိုပါသည်။ ၎င်းကို အကောင်အထည်ဖော်ရန် **Elastic Load Balancing (ELB)** နှင့် **Auto Scaling Groups (ASG)** တို့ကို ပေါင်းစပ်အသုံးပြုရပါသည်။

---

## Multi-AZ High Availability Architecture

```
                       [ Internet Users ]
                               │
                               ▼
               [ Application Load Balancer (ALB) ]
               (Public Subnets across AZ-A & AZ-B)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  Availability Zone A │        │  Availability Zone B │
    │  (Private Subnet)    │        │  (Private Subnet)    │
    │                      │        │                      │
    │  ┌────────────────┐  │        │  ┌────────────────┐  │
    │  │ EC2 Instance 1 │  │        │  │ EC2 Instance 2 │  │
    │  │ (ASG Managed)  │  │        │  │ (ASG Managed)  │  │
    │  └────────────────┘  │        │  └────────────────┘  │
    └──────────────────────┘        └──────────────────────┘
               ▲                               ▲
               └───────────────┬───────────────┘
                               │
                 [ Auto Scaling Group (ASG) ]
                 Desired: 2 | Min: 2 | Max: 10
```

---

## Auto Scaling Groups (ASG) ၏ အဓိက အစိတ်အပိုင်းများ

1. **Launch Template (အသစ်ထွက်မည့် Server ၏ Blueprint):**  
   ASG မှ Server အသစ်များ အလိုအလျောက် ထုတ်လုပ်ပေးရန် AMI ID, Instance Type, Key Pair, Security Group, IAM Role နှင့် User Data Script များကို Launch Template ထဲတွင် သတ်မှတ်ထားရပါသည် (ယခင် Legacy ဖြစ်သော Launch Configuration ကို မသုံးရတော့ပါ)။
2. **Capacity Parameters (ပမာဏ သတ်မှတ်ချက် ၃ ခု):**
   - **Minimum Capacity (အနည်းဆုံး):** မည်မျှပင် Traffic နည်းပါစေ အနည်းဆုံး run ထားရမည့် Server အရေအတွက် (ဥပမာ- 2)။
   - **Desired Capacity (လက်ရှိ လိုချင်သော ပမာဏ):** ပုံမှန်အချိန်တွင် Run ထားစေလိုသော အရေအတွက် (ဥပမာ- 2)။
   - **Maximum Capacity (အများဆုံး တိုးခွင့်):** Traffic အလွန်များလာပါက အများဆုံး တိုးခွင့်ပြုမည့် ကန့်သတ်ချက် (ဥပမာ- 10)။
3. **Scaling Policies (အလိုအလျောက် တိုးချဲ့/လျှော့ချ စည်းမျဉ်းများ):**
   - **Target Tracking Scaling (အကြံပြုချက်):** သတ်မှတ်ထားသော Metric တစ်ခု (ဥပမာ- Average CPU Utilization = 50%) ကို ပစ်မှတ်ထားပြီး ၎င်းထက်ကျော်ပါက Server အသစ်တိုးပေးပြီး၊ လျော့သွားပါက Server ပြန်ဖျက်ပေးသည်။
   - **Step / Simple Scaling:** CloudWatch Alarm တစ်ခု တက်လာပါက (ဥပမာ- CPU > 80%) Instance +2 တိုးပေးခြင်း။
   - **Scheduled Scaling:** ရုံးဖွင့်ရက် နံနက် ၉ နာရီတွင် Server ၅ လုံးတင်ပြီး၊ ညနေ ၆ နာရီတွင် ၂ လုံးသို့ လျှော့ချစေခြင်း။
   - **Predictive Scaling:** Machine Learning ဖြင့် လာမည့်ရက်များ၏ Traffic ကို ကြိုတင်ခန့်မှန်း၍ Scaling ပြုလုပ်ခြင်း။

---

## Elastic Load Balancing (ELB) - ALB vs NLB

Traffic များကို EC2 Instances များစွာဆီသို့ မျှဝေပို့ဆောင်ပေးသော Load Balancer အမျိုးအစားများ:

| အချက်အလက် | Application Load Balancer (ALB) | Network Load Balancer (NLB) |
| :--- | :--- | :--- |
| **OSI Layer** | **Layer 7 (Application Layer)** | **Layer 4 (Transport Layer)** |
| **Protocols** | HTTP, HTTPS, gRPC, WebSocket | TCP, UDP, TLS |
| **Routing အစွမ်း** | **Path-based** (`/api`, `/users`), Host-based (`admin.com`) | IP Address & Port အခြေခံသာ |
| **Performance** | ကောင်းမွန်သော Latency (Millisecond) | **Ultra-high Performance (Microsecond), Millions req/sec** |
| **IP Address** | Static IP မရပါ (DNS Name သာ ရသည်) | **AZ တစ်ခုလျှင် Static / Elastic IP ၁ ခု ရသည်** |
| **Use Case** | Modern Web Apps, Microservices, Containers | Gaming, FinTech, Extreme High Throughput, Static IP လိုအပ်ချက် |

---

## ASG Health Checks: EC2 Status Check vs ELB Health Check

ဤအချက်သည် **SAA-C03 စာမေးပွဲတွင် အလွန်လှည့်စားတတ်သော မေးခွန်း** ဖြစ်ပါသည်:

```
[ Problem Scenario ]
EC2 Hardware ကောင်းနေသည် (EC2 Status Check: PASS)
သို့သော် Nginx / Application Process က Crash ဖြစ်သွားသည် (HTTP 502/500 Bad Gateway)
```

- **EC2 Health Check သာ သုံးထားပါက:** ASG က VM Hardware ကောင်းနေသည်ဟု ယူဆသဖြင့် Crash ဖြစ်နေသော Server ကို မဖျက်ဘဲ ဆက်ထားမည် (User များ Web ကြည့်မရဖြစ်နေမည်)။
- **ELB Health Check ကိုပါ ဖွင့်ထားပါက:** ALB က `/healthz` endpoint သို့ HTTP Request ပို့ပြီး 200 OK မရပါက Instance ကို **"Unhealthy"** ဟု သတ်မှတ်ကာ ASG ထံ အကြောင်းကြားသည်။ ASG က ထို Instance အပျက်ကို ချက်ချင်းဖျက်ပစ်ပြီး **ကျန်းမာသော Instance အသစ်တစ်ခု ချက်ချင်း အစားထိုး တည်ဆောက်ပေးပါသည် (Self-Healing)**။
