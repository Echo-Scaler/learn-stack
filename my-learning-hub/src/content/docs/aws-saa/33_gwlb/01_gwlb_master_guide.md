---
title: "Gateway Load Balancer (GWLB) — Complete Master Architectural Guide"
description: "AWS GWLB (Gateway Load Balancer) — Transparent network gateway and load balancing for 3rd-party virtual appliances ကို မြန်မာလို အခြေခံမှ စတင်၍ GENEVE Protocol, GWLBE, Security VPC နှင့် SAA-C03 Guide"
---

# 3. GWLB — Gateway Load Balancer
### Transparent Layer 3/4 Gateway & Scaling for 3rd-Party Virtual Firewalls & Appliances

AWS Gateway Load Balancer (GWLB) သည် OSI Model ၏ **Network & Transport Layer (Layer 3 & 4)** တွင် အလုပ်လုပ်ပြီး ပြင်ပ Third-party Virtual Appliances များ (ဥပမာ- Palo Alto Networks, Fortinet, Check Point Next-Generation Firewalls, IDS/IPS, Deep Packet Inspection) ကို **အလိုအလျောက် Auto-scaling ပြုလုပ်ပေးပြီး Traffic များကို ကြားခံမှ ပွင့်လင်းမြင်သာစွာ (Transparently) စစ်ဆေးပေးသော** အထူးပြု Load Balancer ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

လုပ်ငန်းကြီးများသည် AWS ပေါ်သို့ စနစ်များ ပြောင်းရွှေ့ရာတွင် ကုမ္ပဏီမူဝါဒအရ ရုံးတွင်း၌ အသုံးပြုနေသော နာမည်ကျော် Hardware Firewalls (Palo Alto, Fortinet) များ၏ Virtual Appliances (EC2 VMs) များကို ဆက်လက် အသုံးပြုလိုကြသည်။ သို့သော် အဆိုပါ Appliance VMs များရှေ့တွင် သမားရိုးကျ Load Balancer ထားရှိပါက မူရင်း IP Header ပြောင်းလဲသွားခြင်း၊ Single Point of Failure ဖြစ်ခြင်းနှင့် Traffic ပြန်လည်လမ်းကြောင်းလွှဲရန် အလွန်ခက်ခဲသော ပြဿနာများ ရှိသည်။

**Gateway Load Balancer (GWLB) ၏ အဓိက ရည်ရွယ်ချက်:**  
Traffic များ၏ မူရင်း Source IP နှင့် Destination IP Header များကို လုံးဝ မပြောင်းလဲစေဘဲ (Transparent Passthrough)၊ Virtual Firewalls အစုအဝေး (Appliance Fleet) ကြားတွင် ဝန်မျှဝေပေးကာ အင်တာနက် အဝင်/အထွက် Traffic အားလုံးကို မလွတ်တမ်း အသေးစိတ် စစ်ဆေးစေရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **GWLB (Gateway Load Balancer)** | Transparent Appliance Router | Virtual Firewall VMs များ တည်ရှိရာ **Security VPC** အတွင်း တပ်ဆင်ရသော Load Balancer ဖြစ်သည်။ |
| **GWLB Endpoints (GWLBE)** | PrivateLink Entry Point | Application VPC များအတွင်း တပ်ဆင်ရသော VPC Endpoint ဖြစ်ပြီး Traffic များကို Security VPC သို့ သွားရောက်စစ်ဆေးစေရန် ကြားခံ လမ်းညွှန်ပေးသည်။ |
| **GENEVE Protocol (Port 6081)** | Tunneling Protocol | GWLB နှင့် Virtual Appliance များအကြား ဒေတာပို့ဆောင်ရာတွင် မူရင်း IP Packet တစ်ခုလုံးကို **UDP Port 6081 (GENEVE Protocol)** ဖြင့် ထုပ်ပိုး (Encapsulate) ပေးသည်။ |
| **VPC Ingress Routing** | Route Table Redirection | Internet Gateway (IGW) မှ ဝင်လာသော Traffic များကို Application ဆာဗာသို့ တိုက်ရိုက် မသွားစေဘဲ GWLB Endpoint ဆီသို့ အရင် လမ်းလွှဲပေးသော Route Table စနစ် ဖြစ်သည်။ |

---

## 3. Architecture (Diagram & Centralized Inspection Flow)

Centralized Security Inspection VPC Architecture Flow:

```
                            [ Public Internet Traffic ]
                                         │
                                         ▼
┌────────────────────────────────────────┼────────────────────────────────────────┐
│ CONSUMER APPLICATION VPC               │                                        │
│                            [ Internet Gateway (IGW) ]                           │
│                                        │ (VPC Ingress Routing: Route to GWLBE)  │
│                                        ▼                                        │
│                       [ GWLB Endpoint (GWLBE) ]                                 │
└────────────────────────────────────────┼────────────────────────────────────────┘
                                         │ (AWS PrivateLink Tunnel)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CENTRALIZED SECURITY VPC                                                        │
│                                                                                 │
│                     [ Gateway Load Balancer (GWLB) ]                            │
│                                        │                                        │
│          ┌─────────────────────────────┴─────────────────────────────┐          │
│          │ (GENEVE Protocol - Port 6081)                             │          │
│          ▼                                                           ▼          │
│  ┌───────────────────────────────┐                   ┌───────────────────────┐  │
│  │ 3rd-Party Virtual Firewall #1 │                   │ Virtual Firewall #2   │  │
│  │ (Palo Alto / Fortinet EC2)    │                   │ (Deep Packet Inspect) │  │
│  │  • Inspects Clean Payload     │                   │                       │  │
│  └──────────────┬────────────────┘                   └───────────┬───────────┘  │
│                 │ (Return Inspected Clean Packet)                │              │
│                 └──────────────────────┬─────────────────────────┘              │
│                                        ▼                                        │
│                     [ Return via GWLB to GWLBE ]                                │
└────────────────────────────────────────┼────────────────────────────────────────┘
                                         │
                                         ▼ (Safe Inspected Traffic)
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CONSUMER APPLICATION VPC                                                        │
│                                                                                 │
│                 [ Private Subnet: Backend EC2 Workloads ]                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Traffic Interception (Ingress Routing):** အင်တာနက်မှ Packet တစ်ခု Internet Gateway ဆီသို့ ရောက်ရှိလာသည်နှင့် Route Table က ထို Packet ကို Application EC2 ဆီသို့ မပို့ဘဲ **GWLB Endpoint (GWLBE)** ဆီသို့ အရင် လမ်းကြောင်းလွှဲ ပေးပို့လိုက်သည်။
2. **GENEVE Encapsulation:** GWLBE မှတစ်ဆင့် Security VPC ရှိ GWLB ဆီသို့ ရောက်ရှိသည်။ GWLB သည် မူရင်း Packet ကို ပြင်ဆင်ခြင်း မပြုဘဲ **GENEVE Protocol (UDP Port 6081)** ဖြင့် ထုပ်ပိုး၍ Virtual Firewall VM ဆီသို့ ပို့ဆောင်သည်။
3. **Deep Packet Inspection & Return:** Virtual Firewall က Packet အတွင်း Virus, Malware သို့မဟုတ် တိုက်ခိုက်မှု ပါ/မပါ စစ်ဆေးသည်။ အန္တရာယ်မရှိပါက မူရင်း Packet အတိုင်း GWLB ဆီသို့ ပြန်ပို့ပြီး GWLB Endpoint မှတစ်ဆင့် အမှန်တကယ် ဦးတည်ရာ Application EC2 ဆီသို့ အန္တရာယ်ကင်းစွာ ရောက်ရှိသွားသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Next-Generation Firewall (NGFW) Scaling:** Palo Alto, Check Point, Fortinet VM စက်များကို ဝန်အားအလိုက် Auto Scaling ဖြင့် စီမံခန့်ခွဲခြင်း။
- **Intrusion Detection & Prevention (IDS/IPS):** ကုမ္ပဏီတစ်ခုလုံး၏ VPC များအတွင်းသို့ ဝင်/ထွက်လာသော North-South နှင့် East-West Traffic အားလုံးကို ဗဟိုမှ အပြည့်အဝ စစ်ဆေးခြင်း။
- **SSL/TLS Decryption & URL Filtering:** အဖွဲ့အစည်းအတွင်း ဝန်ထမ်းများနှင့် ဆာဗာများ ပြင်ပသို့ သွားရောက်သော Web Traffic များကို မူဝါဒနှင့် ညီ/မညီ စစ်ထုတ်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Transparent Layer 3/4 Insertion (Application ဆာဗာများ၏ IP Configuration ကို ပြင်ဆင်ရန် မလိုပါ)။
- Virtual Appliance များ ပျက်စီးသွားပါက အလိုအလျောက် ကျန်စက်များသို့ လွှဲပေးသော Health Checking ပါဝင်ခြင်း။
- AWS Organizations ရှိ VPC ရာပေါင်းများစွာအတွက် ဗဟို Security VPC တစ်ခုတည်းဖြင့် ဝန်ဆောင်မှုပေးနိုင်ခြင်း။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- Target Virtual Appliances များသည် **GENEVE Protocol (UDP Port 6081)** ကို ထောက်ပံ့နိုင်ရမည်။

---

## 7. Comparison: GWLB vs AWS Network Firewall

| Feature | Gateway Load Balancer (GWLB) | AWS Network Firewall |
| :--- | :--- | :--- |
| **Appliance Type** | **3rd-Party Virtual Appliances (Palo Alto, Fortinet)** | **AWS Native Managed Firewall (Suricata-compatible)** |
| **Management** | Firewall OS & Licenses ကိုယ်တိုင် စီမံရသည် | AWS Fully Managed (No OS, No Licenses) |
| **Protocol** | **GENEVE Port 6081** | Native VPC Routing |
| **Use Case** | လက်ရှိ ရုံးတွင်းသုံး Firewall စံနှုန်းများကို Cloud တွင် ဆက်သုံးလိုသောအခါ | AWS Cloud-native ရိုးရှင်းသော Stateful/Stateless Inspection လိုအပ်သောအခါ |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Gateway Load Balancer ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-load-balancer \
    --name "security-gwlb" \
    --type "gateway" \
    --subnets "subnet-0123456789abcdef0" "subnet-0fedcba9876543210"
```

### Step 2: GENEVE Protocol Target Group ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-target-group \
    --name "tg-firewall-fleet" \
    --protocol GENEVE \
    --port 6081 \
    --vpc-id "vpc-0123456789"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Appliance Health Checks (TCP/HTTP), Flow Sticking (တူညီသော Session မှ Packet များကို တူညီသော Firewall စက်ထံသို့သာ အမြဲတမ်း ပို့ပေးသည်)။
- **Monitoring:** CloudWatch Metrics (`ActiveFlowCount`, `ProcessedBytes_GWLB`, `HealthyHostCount`).
- **Cost:** GWLB hour ($0.0125/hr) + GLCU (Gateway Load Balancer Capacity Units - $0.004/GLCU-hr) + VPC Endpoint (GWLBE) hour + Data Processing fee။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **3rd-Party Firewalls & Virtual Appliances:** စာမေးပွဲတွင် "Deploy, scale, and manage a fleet of third-party firewalls (such as Palo Alto or Check Point) transparently" ဟု ပါပါက အမြဲတမ်း **Gateway Load Balancer (GWLB)** ကို ရွေးချယ်ပါ။
> 2. **GENEVE Protocol on Port 6081:** GWLB သည် Virtual Appliances များနှင့် ဆက်သွယ်ရာတွင် **GENEVE Protocol (UDP Port 6081)** ကို အသုံးပြုသည်။
> 3. **VPC Ingress Routing:** အင်တာနက်မှ ဝင်လာသော Packet များကို Firewall သို့ အရင် လမ်းလွှဲရန် IGW တွင် **Ingress Route Table** သတ်မှတ်ရမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
Enterprise ကုမ္ပဏီတစ်ခုသည် AWS Cloud သို့ Workloads များ ရွှေ့ပြောင်းနေသည်။ ကုမ္ပဏီ၏ Security Architecture အရ Application VPCs အားလုံးအတွင်းသို့ ဝင်ရောက်လာသော မည်သည့် Network Traffic မဆို Third-party Next-Generation Firewall (NGFW) appliances များဖြင့် Deep Packet Inspection ပြုလုပ်ပြီးမှသာ သက်ဆိုင်ရာ ဆာဗာများဆီသို့ ရောက်ရှိရမည် ဖြစ်သည်။ Firewall စက်များကို Auto Scaling ဖြင့် အလိုအလျောက် ချဲ့ထွင်လိုပြီး မူရင်း IP Header များကိုလည်း မပျက်စီးစေလိုပါ။ မည်သည့် နည်းပညာကို အသုံးပြုသင့်သနည်း?

- A) Application Load Balancer (ALB)
- B) Gateway Load Balancer (GWLB) with GWLB Endpoints
- C) Network Load Balancer (NLB) with Proxy Protocol
- D) AWS WAF

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Gateway Load Balancer (GWLB)** သည် Third-party Virtual Firewalls များကို Auto Scaling ဖြင့် ဝန်မျှဝေပေးနိုင်ပြီး GENEVE Protocol ဖြင့် မူရင်း IP Header များကို လုံးဝ မပြောင်းလဲစေဘဲ Transparent စစ်ဆေးနိုင်သော တစ်ခုတည်းသော AWS ဝန်ဆောင်မှု ဖြစ်ပါသည်။
</details>
