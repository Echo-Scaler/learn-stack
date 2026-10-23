---
title: "Network Load Balancer (NLB) — Complete Master Architectural Guide"
description: "Amazon NLB (Network Load Balancer) — Layer 4 ultra-high performance load balancing for TCP, UDP, and TLS ကို မြန်မာလို အခြေခံမှ စတင်၍ Static IPs, Microsecond Latency နှင့် SAA-C03 Guide"
---

# 2. NLB — Network Load Balancer
### Layer 4 Ultra-High Performance, Extreme Low-Latency & Static IP Load Balancing

Amazon Network Load Balancer (NLB) သည် OSI Model ၏ **Transport Layer (Layer 4)** တွင် အလုပ်လုပ်ပြီး တစ်စက္ကန့်လျှင် **Requests သန်းပေါင်းများစွာ (Millions of RPS)** ကို မိုက်ခရိုစက္ကန့် (Ultra-low Microsecond Latency) တုံ့ပြန်မှုနှုန်းဖြင့် စွမ်းဆောင်နိုင်သော **AWS Ultra-High Performance Load Balancer** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

HTTP မဟုတ်သော Protocol များ (ဥပမာ- TCP Socket, UDP Gaming Traffic, IoT MQTT) သို့မဟုတ် ရုတ်တရက် အဆမတန် တက်လာသော Extreme Traffic Spikes များကို ကိုင်တွယ်ရာတွင် Layer 7 ALB သည် Request parsing ပြုလုပ်ရသဖြင့် မလုံလောက်ဘဲ နှေးကွေးသွားတတ်သည်။ ထို့အပြင် Corporate Client များသည် ပြင်ပ Firewall တွင် Whitelist ထည့်သွင်းရန် **ပုံသေ Public Static IP** ကို မဖြစ်မနေ တောင်းဆိုလေ့ရှိသည်။

**Network Load Balancer (NLB) ၏ အဓိက ရည်ရွယ်ချက်:**  
Traffic များကို Packet အဆင့် (Layer 4) မှ မိုက်ခရိုစက္ကန့်အတွင်း အမြန်ဆုံး ဖြတ်သန်းပို့ဆောင်ပေးရန်နှင့် **Availability Zone တစ်ခုစီတိုင်းအတွက် သီးခြား Elastic IP (Static IP) တစ်ခုစီ ထုတ်ပေးနိုင်ရန်** ဖြစ်ပါသည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Layer 4 Listeners** | Protocol Handlers | **TCP**, **UDP**, **TCP_UDP** (တပြိုင်နက်သုံး), **TLS** (Encrypted TCP) protocol များကို နားထောင်သည်။ |
| **Static Elastic IP (EIP)** | Zonal Public IPs | **Availability Zone တစ်ခုစီအတွက် ပုံသေ Static IP တစ်ခုစီ သတ်မှတ်နိုင်သည်။** (Client ဘက်မှ Firewall Whitelist လုပ်ရန် မရှိမဖြစ် သုံးသည်)။ |
| **Client IP Preservation** | Original IP Transparency | Client ၏ တကယ့် Public IP ကို မူရင်း Packet Header အတိုင်း Backend Server ဆီသို့ တိုက်ရိုက် ပို့ဆောင်ပေးသည်။ (`X-Forwarded-For` မလိုဘဲ တကယ့် IP ရရှိသည်)။ |
| **Target Groups** | Layer 4 Targets | EC2 Instances, Private IP Addresses (On-Premises အပါအဝင်) နှင့် ALB (NLB fronting ALB) ကို Target အဖြစ် ထားနိုင်သည်။ |
| **Cross-Zone Load Balancing** | Multi-AZ Distribution | NLB တွင် Cross-Zone Balancing သည် **Default အနေဖြင့် OFF (ပိတ်ထားသည်)** ဖြစ်ပြီး AZ တစ်ခုအတွင်းသာ Local မျှဝေသည်။ (ဖွင့်ပါက Data Transfer fee ရှိသည်)။ |

---

## 3. Architecture (Diagram & Extreme Throughput Flow)

NLB ၏ Layer 4 Ultra-Low Latency Packet Routing Flow:

```
                            [ Millions of Client Devices ]
                                         │
                                         ▼ (TCP/UDP/TLS Connections)
┌────────────────────────────────────────┼────────────────────────────────────────┐
│ Amazon Network Load Balancer (NLB)     │                                        │
│                                        │                                        │
│   Availability Zone A                  │           Availability Zone B          │
│  ┌───────────────────────────────┐     │          ┌───────────────────────────┐ │
│  │ Static Elastic IP: 52.74.1.10 │     │          │ Static Elastic IP: 54.255.│ │
│  └──────────────┬────────────────┘     │          └─────────────┬─────────────┘ │
└─────────────────┼──────────────────────┴────────────────────────┼───────────────┘
                  │                                               │
                  │ (Pass-through with Zero Packet Inspection)   │
                  ▼ (Direct Packet Routing - Microseconds)        ▼
┌────────────────────────────────────────┐     ┌──────────────────────────────────┐
│ Private Subnet A                       │     │ Private Subnet B                 │
│  ┌──────────────────────────────────┐  │     │  ┌─────────────────────────────┐ │
│  │ High-Frequency Trading App (EC2) │  │     │  │ High-Frequency Trading (EC2)│ │
│  │ (Direct TCP Handshake)           │  │     │  │ (Direct TCP Handshake)      │ │
│  └──────────────────────────────────┘  │     │  └─────────────────────────────┘ │
└────────────────────────────────────────┘     └──────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Direct Transport Layer Routing:** Client ထံမှ TCP SYN Packet ရောက်လာသည်နှင့် NLB သည် Packet ကို unpack မလုပ်ဘဲ Flow Hash အပေါ် မူတည်၍ Target EC2 ဆီသို့ မိုက်ခရိုစက္ကန့်အတွင်း တိုက်ရိုက် လမ်းကြောင်းပေးသည်။
2. **TLS Termination at Layer 4:** TLS Listener သုံးထားပါက NLB သည် SSL Decryption ကို Hardware အဆင့်တွင် စက္ကန့်ပိုင်းအတွင်း ပြီးစီးအောင် ဖြေရှင်းပေးပြီး Backend ဆာဗာများ၏ CPU ဝန်ထုပ်ဝန်ပိုးကို လျှော့ချပေးသည်။
3. **Zonal Isolation:** AZ တစ်ခုခုအတွင်းရှိ Backend Targets များ ပျက်စီးသွားပါက Route 53 DNS သည် ထို AZ ၏ Static IP ကို DNS Lookup စာရင်းမှ အလိုအလျောက် ဖယ်ရှားပေးသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Extreme High Throughput & Low Latency:** တစ်စက္ကန့်လျှင် Transactions သန်းဆယ်ချီ ဖြစ်ပေါ်သော စတော့ရှယ်ယာ စျေးကွက်အရောင်းအဝယ် (Financial Trading) စနစ်များ။
- **Real-time Multiplayer Gaming:** Packet နှောင့်နှေးမှု လုံးဝမဖြစ်စေရန် **UDP Protocol** ဖြင့် ပြေးဆွဲသော ဂိမ်းဆာဗာများ။
- **Static IP Whitelisting:** ဘဏ်များ၊ အစိုးရနှင့် ကော်ပိုရိတ် ဖောက်သည်များ၏ On-Premises Firewalls များတွင် Whitelist ထည့်သွင်းရန် ပုံသေ IP ၂ ခု သို့မဟုတ် ၃ ခု ပေးအပ်ရသော B2B စနစ်များ။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- တစ်စက္ကန့်လျှင် Requests သန်းပေါင်းများစွာကို Pre-warming မလိုဘဲ ရုတ်တရက် ခံနိုင်ရည်ရှိသည်။
- အလွန်နည်းပါးသော **Microsecond Latency**။
- Availability Zone တစ်ခုစီတိုင်းအတွက် **Static Elastic IP** ရရှိခြင်း။
- Client IP Address ကို Header မပြောင်းဘဲ နဂိုအတိုင်း ရရှိခြင်း။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- Layer 7 Features များ မရရှိပါ (URL Path `/api/*` သို့မဟုတ် Host Header အလိုက် routing မခွဲနိုင်ပါ)။
- AWS WAF ကို တိုက်ရိုက် မချိတ်ဆက်နိုင်ပါ (ALB ရှေ့တွင်သာ WAF ရသည်)။

---

## 7. Comparison: NLB vs ALB

| Feature | Network Load Balancer (NLB) | Application Load Balancer (ALB) |
| :--- | :--- | :--- |
| **OSI Layer** | **Layer 4 (Transport)** | **Layer 7 (Application)** |
| **Supported Protocols** | **TCP, UDP, TLS** | **HTTP, HTTPS, gRPC, WebSocket** |
| **Latency** | **Microseconds (μs)** | Milliseconds (ms) |
| **Static IP Support** | **Yes (Elastic IP per AZ)** | No (Public DNS Name Only) |
| **Content-Based Routing** | No | **Yes (Path, Host, Headers)** |
| **Default Cross-Zone Balancing** | **Disabled (Off by default)** | **Enabled (On by default)** |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Static Elastic IPs ပါဝင်သော NLB ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-load-balancer \
    --name "ultra-fast-nlb" \
    --type "network" \
    --scheme "internet-facing" \
    --subnet-mappings SubnetId=subnet-0123456789,AllocationId=eipalloc-01111111111111111 SubnetId=subnet-0987654321,AllocationId=eipalloc-02222222222222222
```

### Step 2: TCP Target Group ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-target-group \
    --name "tg-tcp-gaming-servers" \
    --protocol TCP \
    --port 9000 \
    --vpc-id "vpc-0123456789" \
    --target-type instance
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Security Groups on NLBs (ယခုအခါ Security Group တပ်ဆင်နိုင်ပါပြီ), Client IP Preservation (Backend Security Group တွင် Client IP စစ်ဆေးနိုင်ခြင်း), TLS 1.3 Termination.
- **Monitoring:** CloudWatch Metrics (`ActiveFlowCount`, `TCP_Target_Reset_Count`, `ProcessedBytes`).
- **Cost:** NLB hour ($0.0225/hr) + NLCU (Network Load Balancer Capacity Units - $0.006/NLCU-hour)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Static IP per Availability Zone:** စာမေးပွဲတွင် "The application requires a fixed, static public IP address for each AZ so external clients can whitelist it in their firewalls" ဟု ပါလာပါက အဖြေသည် **Network Load Balancer (NLB)** ဖြစ်ပါသည်။
> 2. **Extreme Performance / Non-HTTP Traffic:** Gaming UDP, IoT MQTT သို့မဟုတ် Extreme traffic spikes with microsecond latency အတွက် အဖြေသည် **NLB** ဖြစ်ပါသည်။
> 3. **Cross-Zone Data Transfer Cost:** NLB တွင် Cross-Zone Load Balancing ကို ဖွင့်ပါက AZs များအကြား Data Transfer ကုန်ကျစရိတ် ရှိပါသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
ဘဏ္ဍာရေး အဖွဲ့အစည်းတစ်ခုသည် ကော်ပိုရိတ်ဖောက်သည်များထံမှ TCP အခြေပြု ငွေလွှဲဒေတာများကို လက်ခံနေသည်။ ဖောက်သည်များ၏ ရုံးတွင်း Firewall များတွင် အဝင်/အထွက် ခွင့်ပြုရန်အတွက် Load Balancer ၏ Public IP Addresses များသည် အချိန်မရွေး ပြောင်းလဲသွားခြင်း မရှိဘဲ ပုံသေ (Static IP) ဖြစ်ရပါမည်။ ထို့အပြင် တစ်စက္ကန့်လျှင် Requests သန်းနှင့်ချီသော ဒေတာများကို အမြန်ဆုံး မိုက်ခရိုစက္ကန့်ဖြင့် ဖြတ်သန်းစေလိုသည်။ မည်သည့် Load Balancer ကို ရွေးချယ်သင့်သနည်း?

- A) Application Load Balancer (ALB)
- B) Network Load Balancer (NLB) with Elastic IPs
- C) Classic Load Balancer (CLB)
- D) Gateway Load Balancer (GWLB)

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Network Load Balancer (NLB)** သည် TCP protocol ကို မိုက်ခရိုစက္ကန့် အမြန်နှုန်းဖြင့် သန်းနှင့်ချီ ဖြတ်သန်းစေနိုင်ပြီး AZ တစ်ခုစီအတွက် **Static Elastic IP (EIP)** ကို တိုက်ရိုက် သတ်မှတ်ခွင့်ပြုသဖြင့် Firewall Whitelist အတွက် တစ်ခုတည်းသော အကောင်းဆုံး ဖြေရှင်းချက် ဖြစ်ပါသည်။
</details>
