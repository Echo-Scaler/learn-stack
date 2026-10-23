---
title: "၄။ Networking & VPC Integration"
description: "VPC၊ Public/Private Subnets၊ Internet Gateway၊ NAT Gateway၊ Elastic IP နှင့် Security Groups vs Network ACLs နှိုင်းယှဉ်ချက်"
---

# ၄။ Networking & VPC Integration

## EC2 နှင့် Virtual Private Cloud (VPC) ဆက်သွယ်မှု

EC2 Instance တိုင်းသည် သီးသန့် လုံခြုံသော Virtual Network ဖြစ်သည့် **Amazon VPC** အတွင်း၌သာ တည်ရှိရပါမည်။ Network ကို စနစ်တကျ မခွဲခြားထားပါက Server သည် ဟက်ကာများ၏ တိုက်ခိုက်မှုကို လွယ်ကူစွာ ခံရနိုင်ပါသည်။

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VPC (CIDR: 10.0.0.0/16)                         │
│                                                                        │
│  [ Internet Gateway (IGW) ] ◄── Traffic from Internet                  │
│               │                                                        │
│  ┌────────────┴──────────────────────┐                                 │
│  │   Public Subnet (10.0.1.0/24)     │                                 │
│  │   Route: 0.0.0.0/0 ──► IGW        │                                 │
│  │                                   │                                 │
│  │   ┌────────────────────────────┐  │                                 │
│  │   │  EC2 Web Server / Bastion  │  │                                 │
│  │   │  (Public IP: 54.x.x.x)     │  │                                 │
│  │   └─────────────┬──────────────┘  │                                 │
│  │                 │                 │                                 │
│  │          [ NAT Gateway ] ─────────┼──────────────────┐              │
│  └─────────────────┼─────────────────┘                  │              │
│                    │                                    │              │
│  ┌─────────────────┴─────────────────┐                  │              │
│  │   Private Subnet (10.0.2.0/24)    │                  │              │
│  │   Route: 0.0.0.0/0 ──► NAT Gateway│ ◄────────────────┘              │
│  │                                   │ (Outbound Internet only)        │
│  │   ┌────────────────────────────┐  │                                 │
│  │   │  EC2 Database / App Server │  │                                 │
│  │   │  (Private IP: 10.0.2.15)   │  │                                 │
│  │   └────────────────────────────┘  │                                 │
│  └───────────────────────────────────┘                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Public Subnet vs Private Subnet

Subnet တစ်ခုကို **Public Subnet** ဖြစ်စေသည့် တစ်ခုတည်းသော အချက်မှာ ၎င်းနှင့် ချိတ်ဆက်ထားသော Route Table တွင် အင်တာနက်ပြင်ပသို့ သွားရန် `0.0.0.0/0` ကို **Internet Gateway (IGW)** သို့ လမ်းကြောင်းညွှန်ပြထားခြင်း ဖြစ်သည်။

- **Public Subnet:** အင်တာနက်မှ တိုက်ရိုက် ဝင်ရောက်ဆက်သွယ်နိုင်သော Web Servers, Application Load Balancers (ALB) နှင့် Bastion Hosts များကို ထားရှိသည်။
- **Private Subnet:** အင်တာနက်မှ တိုက်ရိုက် ဝင်ရောက်ခွင့် မပေးနိုင်သော Core Database (MySQL/PostgreSQL) နှင့် Backend Microservices များကို ထားရှိသည်။

### Private Subnet ရှိ Server များ Software Update မည်သို့ လုပ်မည်နည်း?
Private Subnet ရှိ Server များသည် အပြင်မှ Direct Inbound Connection လက်မခံသော်လည်း OS update (ဥပမာ- `apt update` သို့မဟုတ် `dnf update`) ပြုလုပ်ရန် အပြင်သို့ ထွက်ခွာခွင့် (Outbound Internet) လိုအပ်ပါသည်။
ထိုအတွက် **NAT Gateway** (သို့မဟုတ် NAT Instance) ကို **Public Subnet** တွင် တည်ဆောက်ပြီး Private Route Table အား `0.0.0.0/0 -> nat-gateway-id` ဟု လမ်းကြောင်းပေးရပါမည်။

---

## IP Addresses အမျိုးအစားများ (Public vs Private vs Elastic IP)

1. **Private IPv4 Address:**  
   VPC အတွင်းရှိ Server အချင်းချင်း ဆက်သွယ်ရန် သုံးသည်။ Instance စတင်ချိန်တွင် Subnet CIDR ထဲမှ auto-assign ဖြစ်ပြီး **Stop/Start ပြုလုပ်သော်လည်း ဘယ်တော့မှ မပြောင်းလဲပါ**။
2. **Public IPv4 Address (Auto-assigned):**  
   အင်တာနက်မှ လှမ်းခေါ်ရန် သုံးသည်။ **အရေးကြီးချက်: EC2 ကို Stop လုပ်ပြီး ပြန် Start လိုက်ပါက Public IP အသစ်တစ်ခုသို့ အလိုအလျောက် ပြောင်းလဲသွားပါမည်!**
3. **Elastic IP (EIP):**  
   AWS အကောင့်အတွင်း အမြဲတမ်း ပိုင်ဆိုင်ထားသော **Static Public IPv4** ဖြစ်သည်။ EC2 ကို Stop/Start မည်မျှပင် ပြုလုပ်စေကာမူ IP လုံးဝ မပြောင်းလဲပါ။
   > **Billing သတိပြုရန်:** Elastic IP တစ်ခုကို Instance နှင့် မချိတ်ဆက်ထားဘဲ (Unattached) အလွတ်ထားပါက AWS က တစ်နာရီလျှင် ဒဏ်ကြေးစရိတ် ကောက်ခံပါသည်။

---

## Security Groups (SG) vs Network ACLs (NACL) - SAA-C03 Key Comparison

ဤနှိုင်းယှဉ်ချက်သည် AWS Solution Architect စာမေးပွဲတွင် ၁၀၀% မေးသော အချက်ဖြစ်ပါသည်:

| အချက်အလက် | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **စစ်ဆေးသည့် အဆင့်** | **Instance Level** (ENI အဆင့်) | **Subnet Level** (Subnet နယ်နိမိတ်) |
| **သဘောသဘာဝ (State)** | **Stateful** (မှတ်ဉာဏ်ရှိသည်) | **Stateless** (မှတ်ဉာဏ်မရှိပါ) |
| **Return Traffic** | Inbound ခွင့်ပြုထားပါက Outbound သည် **အလိုအလျောက် ဖြတ်သန်းခွင့်ရသည်** | Inbound ခွင့်ပြုရုံဖြင့် မလုံလောက်ဘဲ Outbound Ephemeral Ports (1024-65535) ကို **ပါ ထပ်မံခွင့်ပြုပေးရသည်** |
| **စည်းမျဉ်းအမျိုးအစား** | **Allow Rules သာ ရေးနိုင်သည်** (Deny မရပါ) | **Allow ရော Deny စည်းမျဉ်းပါ ရေးနိုင်သည်** |
| **စည်းမျဉ်းစစ်ဆေးပုံ** | စည်းမျဉ်းအားလုံး (All Rules) ကို အကဲဖြတ်ပြီး ခွင့်ပြုသည် | **Rule Number အစဉ်အတိုင်း စစ်ဆေးသည်** (အငယ်ဆုံး နံပါတ်က အရင် ဦးစားပေးသည်) |
| **Default အခြေအနေ** | Inbound အားလုံး Block ထားပြီး၊ Outbound အားလုံး Allow လုပ်ထားသည် | Default NACL သည် အားလုံးကို Allow ပေးထားသည် |

---

## ENI (Elastic Network Interface)

ENI သည် EC2 Instance တွင် တပ်ဆင်ထားသော Virtual Network Interface Card (vNIC) ဖြစ်ပါသည်။
- **Primary ENI (`eth0`):** Instance စတင်ချိန်တွင် အလိုအလျောက် ပါရှိလာပြီး Instance နှင့် ခွဲထုတ်၍ မရပါ။
- **Secondary ENI (`eth1`):** လိုအပ်ပါက ထပ်မံဖန်တီး၍ Attach/Detach ပြုလုပ်နိုင်သည်။
- **Use Case:** Management Network နှင့် Public Data Network ကို IP Subnet သီးခြားခွဲထားလိုသောအခါ (Dual-homed instances) သို့မဟုတ် Network failover ပြုလုပ်လိုသောအခါတွင် အသုံးပြုသည်။
