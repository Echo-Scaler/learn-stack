---
title: "Classic Load Balancer (CLB) — Complete Master Architectural Guide"
description: "Amazon CLB (Classic Load Balancer) — Previous generation Layer 4/7 load balancing ကို မြန်မာလို အခြေခံမှ စတင်၍ Limitations, ALB/NLB သို့ Migrate ပြုလုပ်ခြင်းနှင့် SAA-C03 Guide"
---

# 4. CLB — Classic Load Balancer
### Previous-Generation Layer 4/7 Load Balancing & Modern Migration Strategies

Amazon Classic Load Balancer (CLB - ယခင် ELB v1) သည် AWS ၏ **ပထမမျိုးဆက် (Previous Generation) Load Balancer** ဖြစ်ပြီး Layer 4 (TCP) နှင့် Layer 7 (HTTP/HTTPS) နှစ်ခုစလုံးတွင် အခြေခံ ဝန်မျှဝေခြင်းကို ဆောင်ရွက်နိုင်ခဲ့သော ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

AWS Cloud အစောပိုင်းကာလ (EC2-Classic) တွင် Server များဆီသို့ အခြေခံ Traffic မျှဝေရန်အတွက် Classic Load Balancer ကို မိတ်ဆက်ခဲ့သည်။ သို့သော် ယနေ့ခေတ် Microservices၊ Docker Containers နှင့် Cloud-Native စနစ်များအတွက် လိုအပ်သော စွမ်းဆောင်ရည်များ မပါဝင်တော့ပေ။

**Classic Load Balancer (CLB) ၏ လက်ရှိ အခန်းကဏ္ဍ:**  
AWS မှ Application အသစ်များအတွက် CLB ကို အသုံးပြုရန် **လုံးဝ အကြံမပြုတော့ဘဲ (Deprecated/Legacy)**၊ လက်ရှိ ပြေးဆွဲနေဆဲဖြစ်သော ရှေးဟောင်း စနစ်များကို **Application Load Balancer (ALB)** သို့မဟုတ် **Network Load Balancer (NLB)** ဆီသို့ အောင်မြင်စွာ ပြောင်းရွှေ့ (Migrate) နိုင်ရန် အဓိက လေ့လာထားရမည် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Listeners** | Basic Port Handlers | HTTP (80), HTTPS (443), TCP, SSL ports များကို လက်ခံသည်။ |
| **EC2 Instance Registration** | Direct Instance Mapping | Target Group မရှိဘဲ EC2 Instances များကို CLB ထဲသို့ တိုက်ရိုက် ID ဖြင့် ထည့်သွင်းရသည်။ |
| **Fixed 1:1 Port Mapping** | Fixed Target Port | EC2 ပေါ်ရှိ Port တစ်ခု (ဥပမာ- Port 80) သို့သာ ပုံသေ ပို့နိုင်သည်။ (Docker Container များ၏ Dynamic Port ကို မထောက်ပံ့ပါ)။ |
| **Single SSL Certificate** | No SNI Support | **CLB တစ်ခုတွင် SSL Certificate ၁ ခုသာ တင်ခွင့်ရှိသည်။** (SNI မရသဖြင့် Domain ပေါင်းစုံအတွက် တွဲသုံး၍ မရပါ)။ |
| **Sticky Sessions** | Cookie-based Affinity | Application-controlled သို့မဟုတ် Duration-based Cookie ဖြင့် Session ထိန်းသိမ်းခြင်း။ |

---

## 3. Architecture (Diagram & Limitations Flow)

Classic Load Balancer ၏ အခြေခံ ဗိသုကာနှင့် ခေတ်မီစနစ်များတွင် မလုံလောက်တော့သော အားနည်းချက်များ:

```
                            [ Web Internet Clients ]
                                       │
                                       ▼ (Port 80 / 443)
┌────────────────────────────────────────────────────────────────────────┐
│ Amazon Classic Load Balancer (CLB - Legacy Generation)                 │
│                                                                        │
│  ❌ No Path-Based Routing (Cannot route /api or /images)               │
│  ❌ No Host-Based Routing (Cannot route shop.com vs app.com)           │
│  ❌ No SNI (Single SSL Certificate only - Multi-domain not possible)   │
│  ❌ No Dynamic Port Mapping (Only 1 Docker container per EC2 host)     │
│  ❌ No WebSocket / No HTTP/2 Support                                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼ (Basic Round-Robin Port 80)
┌────────────────────────────────────────────────────────────────────────┐
│ Fixed Backend EC2 Instances (Directly Registered)                      │
│                                                                        │
│       ┌──────────────────────┐        ┌──────────────────────┐         │
│       │ EC2 Instance #1      │        │ EC2 Instance #2      │         │
│       │ (Port 80 Only)       │        │ (Port 80 Only)       │         │
│       └──────────────────────┘        └──────────────────────┘         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Request Intake:** Client မှ HTTP သို့မဟုတ် TCP Request ရောက်လာပါက CLB က လက်ခံသည်။
2. **Basic Round-Robin:** ရောက်လာသော Request များကို Registered Instances များကြားတွင် အခြေခံ အလှည့်ကျစနစ် (Round-Robin) ဖြင့် မျှဝေပို့ဆောင်သည်။
3. **Health Check Probing:** `PING` သို့မဟုတ် `TCP` စစ်ဆေးပြီး မကောင်းသော Instance ကို ရှောင်ရှားသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Legacy Workload Maintenance:** ယခင် နှစ်ပေါင်းများစွာကတည်းက တည်ဆောက်ထားပြီးဖြစ်သော EC2-Classic သို့မဟုတ် ရှေးဟောင်း စနစ်များကို မွမ်းမံမှု မပြုလုပ်မီ ယာယီ ထိန်းသိမ်းထားခြင်း။
- **Migration Preparation:** AWS Application Load Balancer သို့ ပြောင်းလဲရန် စစ်ဆေးပြင်ဆင်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- TCP နှင့် HTTP နှစ်မျိုးလုံးကို Load Balancer တစ်ခုတည်းတွင် ရိုးရှင်းစွာ တွဲသုံးနိုင်ခဲ့ခြင်း (အတိတ်ကာလအတွက်)။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **Path-based / Host-based routing မရရှိပါ။**
- **SNI (Server Name Indication) မရရှိသဖြင့်** Domain အသစ်တစ်ခုစီတိုင်းအတွက် CLB တစ်ခုစီ ထပ်ဆောက်ရပြီး ကုန်ကျစရိတ် မြင့်မားသည်။
- **Container Dynamic Port Mapping မရရှိပါ။**
- **AWS WAF နှင့် တိုက်ရိုက် ချိတ်ဆက်၍ မရပါ။**

---

## 7. Comparison: CLB vs ALB vs NLB (အဘယ်ကြောင့် ALB/NLB သို့ ပြောင်းသင့်သလဲ)

| Feature | Classic Load Balancer (CLB) | Application Load Balancer (ALB) | Network Load Balancer (NLB) |
| :--- | :--- | :--- | :--- |
| **Generation** | **Previous Generation (Legacy)** | **Current Generation** | **Current Generation** |
| **Routing Flexibility** | မရပါ (Basic Only) | **အဆင့်မြင့် Path/Host/Header** | Extreme Layer 4 Port |
| **SSL / SNI** | Single Certificate Only | **Multiple Certs (SNI)** | Multiple Certs (SNI) |
| **Performance** | Basic | Milliseconds | **Microseconds (Extreme)** |
| **Cost** | ဈေးကြီးပြီး Feature နည်းသည် | **စရိတ်ပိုသက်သာပြီး Feature စုံသည်**| Ultra High Throughput |

---

## 8. Hands-on Lab (ALB သို့ Migrate ပြုလုပ်နည်း)

AWS Console တွင် **"Migrate to Application Load Balancer"** wizard ပါဝင်ပြီး အောက်ပါအဆင့်များဖြင့် ကလစ်အနည်းငယ်အတွင်း ပြောင်းလဲနိုင်ပါသည်:

1. CLB Listener Rules များကို ALB Listener Rules အဖြစ် အလိုအလျောက် ပြောင်းလဲခြင်း။
2. EC2 Instances များကို ALB Target Group အသစ်အတွင်းသို့ စာရင်းသွင်းခြင်း။
3. Route 53 DNS တွင် DNS Alias Record ကို ALB DNS အသစ်သို့ ညွှန်းဆိုပြောင်းလဲပြီး CLB အဟောင်းကို ဖျက်ပစ်ခြင်း။

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** SSL/TLS Policies (ခေတ်ဟောင်း TLS 1.0/1.1 ပါဝင်နေတတ်သဖြင့် Security Audit တွင် သတိပြုရမည်)။
- **Monitoring:** CloudWatch Metrics (`SurgeQueueLength`, `SpilloverCount` - CLB တန်းစီ Queue ပြည့်သွားပါက 503 error ပေါ်တတ်သည်)။
- **Cost:** CLB hour ($0.025/hr) + Data Transfer fee ($0.008/GB)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Migrate CLB to ALB:** စာမေးပွဲတွင် လက်ရှိ Classic Load Balancer သုံးနေပြီး **Path-based routing (`/images`, `/orders`) လိုအပ်လာသည်** သို့မဟုတ် **Multiple SSL Certificates (SNI) လိုအပ်လာသည်** ဟု ပါပါက အဖြေမှန်သည် အမြဲတမ်း **Migrate from CLB to Application Load Balancer (ALB)** ဖြစ်ပါသည်။
> 2. **Never Choose CLB for New Architecture:** Architecture အသစ် ရွေးချယ်ရသော မေးခွန်းများတွင် Classic Load Balancer သည် အမြဲတမ်း မှားယွင်းသော အဖြေ ဖြစ်ပါသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
ကုမ္ပဏီတစ်ခုသည် လက်ရှိတွင် Classic Load Balancer (CLB) ဖြင့် ဝဘ်ဆိုဒ်တစ်ခုကို လွှင့်တင်ထားသည်။ ကုမ္ပဏီသည် ဝဘ်ဆိုက်ပေါ်တွင် Domain Name သုံးခု (`site1.com`, `site2.com`, `site3.com`) ကို Single Load Balancer ဖြင့် ပေါင်းစည်းလွှင့်တင်လိုပြီး Domain တစ်ခုစီအတွက် သီးခြား SSL Certificate များ တပ်ဆင်လိုသည်။ လက်ရှိ CLB တွင် ဤလိုအပ်ချက်ကို မည်သို့ ဖြေရှင်းသင့်သနည်း?

- A) CLB ပေါ်တွင် SSL Certificate ၃ ခုလုံးကို တစ်ပြိုင်နက် တင်မည်။
- B) Classic Load Balancer ကို Application Load Balancer (ALB) သို့ Migrate ပြုလုပ်ပြီး Server Name Indication (SNI) ဖြင့် SSL Certificates များကို တပ်ဆင်မည်။
- C) Network ACL ဖြင့် SSL port ခွဲမည်။
- D) Route 53 Geolocation routing သုံးမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Classic Load Balancer (CLB) သည် SNI ကို မထောက်ပံ့ပါ** (Single SSL Certificate သာ ရရှိသည်)။ **Application Load Balancer (ALB)** သို့ Migrate ပြုလုပ်မှသာ SNI နည်းပညာဖြင့် Multiple SSL Certificates များကို Domain အမျိုးမျိုးအတွက် Single Load Balancer တွင် လုံခြုံစွာ တင်နိုင်သောကြောင့် ဖြစ်ပါသည်။
</details>
