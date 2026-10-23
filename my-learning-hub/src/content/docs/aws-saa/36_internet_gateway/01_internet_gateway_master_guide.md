---
title: "Internet Gateway (IGW) — Complete Master Architectural Guide"
description: "Internet Gateway (IGW) — Internet connectivity for an Amazon VPC ကို မြန်မာလို အခြေခံမှ စတင်၍ 1:1 NAT, Route Tables, Public Subnets နှင့် SAA-C03 Guide"
---

# 6. Internet Gateway (IGW) — Internet Connectivity for a VPC
### Highly Available, Horizontally Scaled VPC Internet Gateway & 1:1 NAT Translation

Amazon VPC Internet Gateway (IGW) သည် သင်၏ VPC အတွင်းရှိ သယံဇာတများနှင့် ပြင်ပ Public Internet အကြား **အသွား/အပြန် (Bidirectional) နှစ်ဖက် ဆက်သွယ်မှု** ကို ပေးစွမ်းနိုင်သော **AWS Horizontally Scaled, Redundant & Highly Available VPC Component** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

Default အားဖြင့် VPC အသစ်တစ်ခု ဆောက်လုပ်လိုက်သောအခါ ၎င်းသည် ပြင်ပ အင်တာနက်နှင့် လုံးဝ အဆက်အသွယ်မရှိသော သီးသန့်ကျွန်း (Isolated Network) တစ်ခု ဖြစ်နေသည်။ ပြင်ပမှ မည်သည့် User မျှ ဝင်ရောက်၍ မရသလို၊ အတွင်းရှိ ဆာဗာများလည်း ပြင်ပသို့ ထွက်ခွာ၍ မရပါ။

**Internet Gateway (IGW) ၏ အဓိက ရည်ရွယ်ချက်:**  
VPC အတွက် **အင်တာနက် တံခါးပေါက်ကြီး** အဖြစ် တာဝန်ယူပေးပြီး၊ Public Subnet အတွင်းရှိ Resources များ (Load Balancers, Web Servers) အား အင်တာနက် အသုံးပြုသူများနှင့် တိုက်ရိုက် ဆက်သွယ်ခွင့် ပေးရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **VPC Attachment** | One-to-One Binding | **VPC တစ်ခုတွင် Internet Gateway (IGW) တစ်ခုသာ တပ်ဆင်ခွင့်ရှိသည်။** (VPC ၁ ခု = IGW ၁ ခု)။ |
| **Route Table Target** | Default Internet Route | Public Subnet ၏ Route Table တွင် `0.0.0.0/0` (Destination) ကို `igw-xxxx` (Target) သို့ လမ်းညွှန်ပေးရသည်။ |
| **1:1 Static NAT** | Private to Public IP Mapping | EC2 ၏ Private IPv4 Address ကို ပြင်ပသို့ ထွက်ခွာချိန်တွင် ၎င်း၏ Public IPv4 (သို့မဟုတ် Elastic IP) သို့ အလိုအလျောက် ပြောင်းလဲပေးသည်။ |
| **Software-Defined Scalability** | Zero Bandwidth Bottleneck | IGW သည် ဆာဗာ သို့မဟုတ် ဟာ့ဒ်ဝဲစက် မဟုတ်ဘဲ AWS Network Fabric ဖြစ်သဖြင့် **Bandwidth ကန့်သတ်ချက် သို့မဟုတ် Traffic Bottleneck လုံးဝ မရှိပါ**။ |

---

## 3. Architecture (Diagram & Bidirectional Traffic Flow)

Internet Gateway မှတစ်ဆင့် Public Subnet သို့ အသွား/အပြန် ချိတ်ဆက်ပုံ Flow:

```
                            [ Public Internet Users ]
                                        │
                                        ▼ (Bidirectional Traffic: Inbound & Outbound)
┌───────────────────────────────────────┼────────────────────────────────────────┐
│ Amazon VPC (CIDR: 10.0.0.0/16)       │                                        │
│                                       ▼                                        │
│                        [ Internet Gateway (IGW) ]                              │
│                        (Performs 1:1 Static NAT)                               │
│                                       │                                        │
│ ══════════════════════════════════════╪═══════════════════════════════════════ │
│ PUBLIC SUBNET (Route Table: 0.0.0.0/0 ──► igw-12345)                           │
│                                       │                                        │
│                                       ▼ (Port 443 HTTPS)                       │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ Amazon EC2 Web Instance (Public Subnet)                                  │  │
│  │  • Private IP: 10.0.1.50                                                 │  │
│  │  • Public IP:  54.251.100.22 (Mapped by IGW)                             │  │
│  │  • Security Group: Inbound Port 443 ALLOW                                │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (EC2 တစ်လုံး အင်တာနက် အမှန်တကယ် ရရှိရန် အချက် ၄ ချက်)

SAA-C03 စာမေးပွဲတွင် အလွန်မေးလေ့ရှိသော အခြေခံ မဏ္ဍိုင် ၄ ချက်:

1. **Attach IGW to VPC:** VPC တွင် Internet Gateway ကို Attach လုပ်ထားရမည်။
2. **Configure Route Table:** Subnet ၏ Route Table တွင် `0.0.0.0/0` (All traffic) ၏ Target အဖြစ် `igw-xxxx` ကို ထည့်သွင်းထားရမည်။ (ဤသို့ ချိတ်ဆက်ထားသော Subnet ကို **Public Subnet** ဟု ခေါ်သည်)။
3. **Public IP Address:** EC2 Instance တွင် **Public IPv4 Address** သို့မဟုတ် **Elastic IP** ရှိရမည်။ (Private IP သက်သက်ဖြင့် IGW ကို မဖြတ်နိုင်ပါ)။
4. **Security Group & NACL:** Security Group နှင့် Subnet NACL တို့တွင် သက်ဆိုင်ရာ Port များ (HTTP:80, HTTPS:443) Inbound နှင့် Outbound ခွင့်ပြုထားရမည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Public-Facing Web Applications:** Application Load Balancer (ALB) များကို အင်တာနက်မှ User များ ခေါ်ယူနိုင်စေရန် Public Subnet တွင် ထားရှိခြင်း။
- **Bastion Hosts (Jump Boxes):** Private Subnet ရှိ ဆာဗာများသို့ SSH ဝင်ရောက်ရန် ကြားခံ ထားရှိသော လုံခြုံသည့် စီမံခန့်ခွဲရေး ဆာဗာများ။
- **NAT Gateway Internet Access:** Private Subnet ရှိ စက်များ အင်တာနက်သို့ ထွက်နိုင်ရန် NAT Gateway ကို Public Subnet ရှိ IGW နှင့် တွဲဖက်ထားရှိခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **100% Free of Charge:** Internet Gateway တပ်ဆင်အသုံးပြုခအတွက် မည်သည့် လစဉ်ကြေးမျှ မရှိပါ (လုံးဝ အခမဲ့)။
- High Availability (AZ ပျက်စီးမှုဒဏ်ကို ခံနိုင်ရည်ရှိပြီး Single Point of Failure မရှိပါ)။
- အကန့်အသတ်မရှိ Bandwidth စွမ်းရည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **VPC တစ်ခုတွင် IGW ၁ ခုသာ တပ်ဆင်ခွင့်ရှိသည်။**
- Private IP သက်သက်ရှိသော ဆာဗာများသည် IGW ကို တိုက်ရိုက် မသုံးနိုင်ပါ (NAT Gateway ကြားခံ လိုအပ်သည်)။

---

## 7. Comparison: Internet Gateway (IGW) vs NAT Gateway vs Egress-Only IGW

| Feature | Internet Gateway (IGW) | NAT Gateway | Egress-Only IGW |
| :--- | :--- | :--- | :--- |
| **Traffic Direction** | **Bidirectional (Inbound & Outbound)** | **Outbound Only (No Inbound from Internet)** | **Outbound Only** |
| **IP Protocol** | **IPv4 & IPv6** | **IPv4 Only** | **IPv6 Only** |
| **Subnet Placement** | VPC-level (Attached to VPC) | Public Subnet တွင် ထားရသည် | Attached to VPC |
| **Cost** | **100% Free (အခမဲ့)** | **Paid ($0.045/hr + Data fee)** | **100% Free (အခမဲ့)** |
| **Public IP Needed?** | EC2 တွင် Public IP လိုအပ်သည် | EC2 တွင် Private IP သာ လိုသည် | IPv6 Global Address |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Internet Gateway တည်ဆောက်ပြီး VPC သို့ ချိတ်ဆက်ခြင်း
```bash
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-vpc-igw}]'
aws ec2 attach-internet-gateway --internet-gateway-id "igw-0123456789abcdef0" --vpc-id "vpc-0123456789"
```

### Step 2: Route Table တွင် Default Internet Route ထည့်သွင်းခြင်း
```bash
aws ec2 create-route \
    --route-table-id "rtb-0123456789" \
    --destination-cidr-block "0.0.0.0/0" \
    --gateway-id "igw-0123456789abcdef0"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Ingress Route Tables (IGW မှ ဝင်လာသော traffic ကို Firewalls/GWLBE ဆီသို့ ကြားဖြတ် လမ်းလွှဲနိုင်ခြင်း)။
- **Troubleshooting:**
  - EC2 ပေါ်မှ အင်တာနက် ထွက်မရပါက: 1. Route Table တွင် `0.0.0.0/0 -> igw` ရှိမရှိ၊ 2. EC2 တွင် Public IP ရှိမရှိ၊ 3. Security Group Outbound ပွင့်မပွင့် စစ်ဆေးပါ။
- **Cost:** **အခမဲ့ (Free)**။ EC2 မှ ထွက်သွားသော Standard Data Transfer Out စရိတ်သာ ကျသင့်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **VPC to IGW Ratio:** VPC တစ်ခုတွင် Internet Gateway အများဆုံး **၁ ခုသာ (Exactly 1 IGW)** ချိတ်ဆက်ခွင့် ရှိသည်။
> 2. **NAT Gateway vs IGW:**  
>    - အင်တာနက် အသုံးပြုသူများဆီမှ အဝင် Traffic လက်ခံရန် ➔ **Internet Gateway (IGW)**  
>    - Private Subnet ရှိ ဆာဗာများ ပြင်ပ အင်တာနက်သို့ ထွက်ခွာ၍ Patch update ရယူရန် (အပြင်မှ အဝင် လုံးဝ လက်မခံလိုပါက) ➔ **NAT Gateway**
> 3. **Egress-Only Internet Gateway:** IPv6 ဒေတာများအတွက် Outbound-only အင်တာနက် ရယူရန် အဖြေသည် **Egress-Only IGW** ဖြစ်ပါသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
အင်ဂျင်နီယာတစ်ဦးသည် VPC အသစ်တစ်ခုအတွင်း Public Subnet တစ်ခု တည်ဆောက်ပြီး EC2 Instance တစ်ခုကို Launch လုပ်ခဲ့သည်။ EC2 တွင် Public IP Address ရရှိထားပြီး Security Group တွင်လည်း Inbound Port 80 ကို ခွင့်ပြုထားသော်လည်း အင်တာနက်မှ ထို EC2 ဆီသို့ ဝင်ရောက်၍ မရဖြစ်နေသည်။ မည်သည့် အဆင့် လိုအပ်နေသေးသနည်း?

- A) EC2 Instance ကို Stop/Start လုပ်ရမည်။
- B) VPC တွင် Internet Gateway (IGW) ကို Attach လုပ်ပြီး Subnet ၏ Route Table တွင် `0.0.0.0/0` ကို ထို IGW သို့ လမ်းညွှန်ပေးရမည်။
- C) NAT Gateway ထပ်ဆောက်ရမည်။
- D) Elastic IP ဝယ်ယူရမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** EC2 တွင် Public IP ရှိရုံဖြင့် အင်တာနက် မရနိုင်ပါ။ VPC တွင် **Internet Gateway (IGW)** ချိတ်ဆက်ထားရမည်ဖြစ်ပြီး Subnet ၏ Route Table တွင် **0.0.0.0/0 -> IGW** လမ်းကြောင်း မဖြစ်မနေ ထည့်သွင်းပေးရပါမည်။
</details>
