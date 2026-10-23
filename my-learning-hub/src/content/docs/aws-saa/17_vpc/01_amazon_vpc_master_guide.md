---
title: "Amazon VPC — Complete Master Architectural Guide"
description: "Amazon VPC (Virtual Private Cloud) — Isolated virtual network to securely run your AWS resources ကို မြန်မာလို အခြေခံမှ စတင်၍ Subnets, IGW, NAT Gateway, NACLs vs SGs, Endpoints နှင့် SAA-C03 Guide"
---

# Amazon VPC (Virtual Private Cloud)
### Isolated Virtual Network to Securely Run Your AWS Cloud Resources

Amazon VPC သည် AWS Cloud ပေါ်တွင် သီးသန့် ကာရံထားသော သင်၏ **ကိုယ်ပိုင် Virtual Data Center Network** တစ်ခု တည်ဆောက်နိုင်စေသော မဏ္ဍိုင် Network Infrastructure ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

Cloud ပေါ်တွင် Server များနှင့် Database များကို Network အကာအကွယ်မရှိဘဲ တင်ထားပါက အင်တာနက်မှ ဟက်ကာများ၏ တိုက်ခိုက်မှုကို တိုက်ရိုက် ခံရမည် ဖြစ်သည်။

**Amazon VPC ၏ အဓိက ရည်ရွယ်ချက်:**  
မိမိပိုင် IP Address အတိုင်းအတာ (CIDR Block)၊ Subnets၊ Route Tables နှင့် Network Firewalls များကို စိတ်ကြိုက် သတ်မှတ်ပြီး၊ အင်တာနက်နှင့် တိုက်ရိုက်ထိတွေ့နိုင်သော **Public Subnet** (ဥပမာ- Load Balancer) နှင့် အင်တာနက်မှ တိုက်ရိုက် လုံးဝဝင်ရောက်၍ မရသော **Private Subnet** (ဥပမာ- Database/App Server) များကို လုံခြုံစွာ ခွဲခြားတည်ဆောက်ရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **CIDR Block** | IP Address Range | VPC ၏ စုစုပေါင်း IP ပမာဏ (ဥပမာ- `10.0.0.0/16` = IP ပေါင်း 65,536 ခု)။ |
| **Subnet (Public & Private)** | Network Segments | Availability Zone တစ်ခုအတွင်း IP များကို ခွဲဝေထားခြင်း။ Public Subnet သည် IGW သို့ Route ရှိပြီး၊ Private Subnet သည် တိုက်ရိုက် Route မရှိပါ။ |
| **Internet Gateway (IGW)** | Internet Doorway | VPC အတွင်းရှိ Public Subnet Resources များကို Public Internet နှင့် ဝင်/ထွက် ဆက်သွယ်ပေးသော Gateway ဖြစ်သည်။ |
| **NAT Gateway** | Managed Outbound NAT | Private Subnet ရှိ Server များ အင်တာနက်မှ တိုက်ရိုက် အဝင်မခံဘဲ (No inbound) ပြင်ပသို့ Software updates ဒေါင်းလုဒ်ဆွဲရန် (Outbound only) သုံးသည်။ |
| **Route Table** | Traffic Router | IP Packets များ မည်သည့် Gateway ဆီသို့ ဦးတည်သွားရမည်ကို သတ်မှတ်သော လမ်းညွှန်စာရင်း ဖြစ်သည်။ |
| **Security Group (SG)** | Instance Firewall | **Stateful Virtual Firewall** ဖြစ်ပြီး EC2/RDS Instance Level တွင် Inbound/Outbound Rules ကို စစ်ဆေးသည်။ |
| **Network ACL (NACL)** | Subnet Firewall | **Stateless Subnet Firewall** ဖြစ်ပြီး Subnet အဆင့်တွင် IP အဝင်/အထွက်ကို Rule Number အစဉ်အတိုင်း စစ်ဆေးသည်။ |
| **VPC Peering** | Private Inter-VPC Link | VPC ၂ ခုအကြား Public Internet မဖြတ်ဘဲ Private IP ဖြင့် တိုက်ရိုက် ချိတ်ဆက်ပေးသည်။ (Transitive Peering မရပါ)။ |
| **VPC Endpoints** | Private AWS Service Link | S3/DynamoDB (Gateway Endpoint) သို့မဟုတ် အခြား AWS Services (Interface Endpoint/PrivateLink) များကို Private IP ဖြင့် ခေါ်ယူခြင်း။ |
| **Transit Gateway (TGW)** | Hub-and-Spoke Router | VPC ရာထောင်ချီနှင့် On-premises Data Center များကို ဗဟိုမှ အချက်အချာကျကျ ချိတ်ဆက်ပေးသော Hub Router ဖြစ်သည်။ |

---

## 3. Architecture (Diagram & Production Traffic Flow)

AWS Enterprise စံနှုန်းညီ Multi-AZ 3-Tier Production VPC Architecture:

```
                            [ Public Internet Users ]
                                        │
                                        ▼ (Port 443 HTTPS)
┌───────────────────────────────────────┼────────────────────────────────────────┐
│ Amazon VPC (CIDR: 10.0.0.0/16)       │                                        │
│                                       ▼                                        │
│                            [ Internet Gateway (IGW) ]                          │
│                                       │                                        │
│ ══════════════════════════════════════╪═══════════════════════════════════════ │
│ PUBLIC SUBNETS                        │                                        │
│   AZ-A (10.0.1.0/24)                  │               AZ-B (10.0.2.0/24)       │
│  ┌───────────────────────────────┐    │              ┌──────────────────────┐  │
│  │ Application Load Balancer (ALB)◄───┴─────────────►│ ALB (Cross-AZ Target)│  │
│  │                               │                   │                      │  │
│  │ [ NAT Gateway A ]             │                   │ [ NAT Gateway B ]    │  │
│  └──────────────┬────────────────┘                   └──────────────┬───────┘  │
│ ════════════════╪═══════════════════════════════════════════════════╪═════════ │
│ PRIVATE APP SUBNETS (No Public IP)                                  │          │
│   AZ-A (10.0.11.0/24)                                 AZ-B (10.0.12.0/24)      │
│  ┌──────────────▼────────────────┐                   ┌──────────────▼───────┐  │
│  │ EC2 Web / App Instance #1     │◄─────────────────►│ EC2 Web / App Inst #2│  │
│  └──────────────┬────────────────┘                   └──────────────┬───────┘  │
│ ════════════════╪═══════════════════════════════════════════════════╪═════════ │
│ PRIVATE DATABASE SUBNETS (Isolated - No Internet Access)            │          │
│   AZ-A (10.0.21.0/24)                                 AZ-B (10.0.22.0/24)      │
│  ┌──────────────▼────────────────┐  Synchronous Sync ┌──────────────▼───────┐  │
│  │ Primary RDS DB (Multi-AZ)     │──────────────────►│ Standby RDS Replica  │  │
│  └───────────────────────────────┘                   └──────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Traffic Inbound Flow:** အင်တာနက် User သည် HTTPS request ခေါ်လိုက်ပါက Internet Gateway (IGW) မှတစ်ဆင့် Public Subnet ရှိ Application Load Balancer (ALB) ဆီသို့ ရောက်ရှိသည်။
2. **Internal Proxy:** ALB သည် Request ကို စစ်ဆေးပြီးနောက် Private Subnet ထဲရှိ EC2 Application Server များဆီသို့ Private IP (`10.0.11.x`) ဖြင့် လမ်းကြောင်းလွှဲ ပေးပို့သည်။
3. **Outbound Internet Flow:** Private Subnet ရှိ EC2 Instance သည် Linux OS update (`apt-get` သို့မဟုတ် `yum update`) ပြုလုပ်လိုပါက ၎င်း၏ Route Table တွင် `0.0.0.0/0 -> NAT Gateway` ဟု ညွှန်ပြထားသည်။ NAT Gateway သည် IGW မှတစ်ဆင့် အင်တာနက်သို့ သွားရောက် ဒေါင်းလုဒ်ယူပြီး EC2 သို့ ပြန်ပို့ပေးသည်။ ပြင်ပ အင်တာနက်မှ EC2 ဆီသို့ တိုက်ရိုက် မည်သူမျှ မဝင်ရောက်နိုင်ပါ။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Secure Production Web Hosting:** Public Subnet တွင် Load Balancer ထားပြီး App Server နှင့် Database များကို Private Subnet တွင် လုံခြုံစွာ သီးခြားခွဲထားခြင်း။
- **Hybrid Cloud Integration:** AWS Direct Connect သို့မဟုတ် AWS Site-to-Site VPN ဖြင့် ရုံးတွင်း Data Center နှင့် AWS VPC ကို Private IP ဖြင့် ပေါင်းစည်းခြင်း။
- **Multi-Account Networking:** AWS Organizations ရှိ အကောင့် ရာပေါင်းများစွာ၏ VPC များကို **AWS Transit Gateway** ဖြင့် ဗဟိုမှ ထိန်းချုပ်ချိတ်ဆက်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Complete Network Isolation နှင့် စိတ်ကြိုက် IP Addressing။
- Security Groups နှင့် NACLs ဖြင့် အဆင့်ဆင့် လုံခြုံရေး အကာအကွယ်။
- High Availability Multi-AZ Design။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **VPC Reserved IPs:** Subnet တစ်ခုစီတိုင်းတွင် AWS မှ IP ၅ ခုကို အမြဲတမ်း ကြိုတင် reserve လုပ်ထားသည် (ဥပမာ- `.0`, `.1`, `.2`, `.3`, `.255`)။
- **NAT Gateway Cost:** NAT Gateway တစ်ခုလျှင် တစ်နာရီ $0.045 အပြင် Data processing charge ($0.045/GB) ရှိသဖြင့် Multi-AZ တွင် ကုန်ကျစရိတ် မြင့်မားနိုင်သည်။
- **VPC Peering Non-transitive:** VPC A မှ B သို့၊ B မှ C သို့ ချိတ်ထားသော်လည်း A မှ C သို့ တိုက်ရိုက်မရောက်နိုင်ပါ။ (Transit Gateway လိုအပ်သည်)။

---

## 7. Comparison: Security Group vs Network ACL (SAA-C03 Core)

| Feature | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Level** | **Instance Level** (EC2, RDS, ALB) | **Subnet Level** (Subnet boundary) |
| **State Nature** | **Stateful** (Inbound ခွင့်ပြုပါက Outbound အလိုအလျောက် ပွင့်သည်) | **Stateless** (Inbound နှင့် Outbound နှစ်ဖက်စလုံး သီးခြားစီ ခွင့်ပြုပေးရသည်) |
| **Rules Type** | **ALLOW Rules သာ ရေးခွင့်ရှိသည်** (DENY ရေး၍ မရပါ) | **ALLOW နှင့် DENY Rules နှစ်မျိုးလုံး ရေးနိုင်သည်** |
| **Evaluation** | Rules အားလုံးကို တပြိုင်နက် Evaluate လုပ်သည် | **Rule Number အစဉ်လိုက် (Rule 100, 200) Evaluate လုပ်သည်** |
| **IP Block စွမ်းရည်** | Specific Malicious IP ကို Deny မလုပ်နိုင်ပါ | **မသမာသော IP Address ကို တိုက်ရိုက် DENY Rule ဖြင့် ပိတ်ပင်နိုင်သည်** |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: VPC အသစ် ဆောက်လုပ်ခြင်း
```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=production-vpc}]'
```

### Step 2: Public Subnet ဆောက်လုပ်ခြင်း
```bash
aws ec2 create-subnet --vpc-id vpc-0123456789 --cidr-block 10.0.1.0/24 --availability-zone ap-southeast-1a
```

### Step 3: Internet Gateway တည်ဆောက်ပြီး VPC သို့ Attach လုပ်ခြင်း
```bash
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]'
aws ec2 attach-internet-gateway --internet-gateway-id igw-0123456789 --vpc-id vpc-0123456789
```

### Step 4: Route Table တွင် Internet Route ထည့်သွင်းခြင်း
```bash
aws ec2 create-route --route-table-id rtb-0123456789 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0123456789
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Security Group (Least Privilege principle), NACL (Malicious IP blocking), AWS Network Firewall, VPC Flow Logs.
- **Monitoring:** **VPC Flow Logs** ကို CloudWatch Logs သို့မဟုတ် S3 သို့ ပို့၍ ဝင်/ထွက်လာသော IP Traffic (ACCEPT / REJECT status) များကို စစ်ဆေးခြင်း။
- **Cost:** VPC, Subnets, Route Tables, IGW များသည် အခမဲ့ (Free) ဖြစ်သည်။ NAT Gateway ($0.045/hr + $0.045/GB), VPC Peering (Cross-AZ/Cross-Region Data Transfer), Transit Gateway attachments များတွင် ကုန်ကျစရိတ် ရှိသည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Block a Specific IP Address:** မေးခွန်းတွင် Hacker သို့မဟုတ် Spammer ၏ Single IP Address တစ်ခုကို ပိတ်ပင်ရမည်ဆိုပါက Security Group တွင် DENY မရသဖြင့် အဖြေသည် **Network ACL (NACL) တွင် DENY Rule ထည့်သွင်းရန်** ဖြစ်ပါသည်။
> 2. **Stateful vs Stateless:** Security Group တွင် Inbound Port 80 ဖွင့်ပေးထားပါက Outbound Port 80 ကို သီးခြားဖွင့်ရန် မလိုပါ။ NACL တွင်မူ Inbound ခွင့်ပြုသည့်အပြင် Return Traffic အတွက် Outbound Ephemeral Ports (1024-65535) ကိုပါ ဖွင့်ပေးရပါမည်။
> 3. **Gateway Endpoint vs Interface Endpoint:** Amazon S3 နှင့် DynamoDB အတွက် အခမဲ့ သုံးနိုင်သော Endpoint သည် **Gateway Endpoint** ဖြစ်သည်။ အခြား AWS Services အားလုံးအတွက်မူ **Interface Endpoint (AWS PrivateLink)** ဖြစ်ပါသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
Security အဖွဲ့သည် သီးခြား IP Address တစ်ခု (`203.0.113.50`) ထံမှ ဝဘ်ဆာဗာများဆီသို့ မသမာသော Brute-force တိုက်ခိုက်မှုများ စဉ်ဆက်မပြတ် ဝင်ရောက်နေသည်ကို တွေ့ရှိခဲ့သည်။ Solutions Architect အနေဖြင့် ဤ IP Address တစ်ခုတည်းကို VPC အတွင်းသို့ လုံးဝ ဝင်ရောက်ခွင့် မရအောင် အမြန်ဆုံး မည်သို့ ပိတ်ပင်သင့်သနည်း?

- A) EC2 Security Group တွင် Inbound DENY Rule ရေးမည်။
- B) Subnet ၏ Network ACL (NACL) တွင် ထို IP အတွက် အငယ်ဆုံး Rule Number (ဥပမာ- Rule 50) ဖြင့် Inbound DENY Rule သတ်မှတ်မည်။
- C) Internet Gateway ကို ဖြုတ်ပစ်မည်။
- D) Route Table မှ Route ကို ဖျက်မည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** Security Group တွင် **DENY Rule ရေးခွင့် မရှိပါ** (ALLOW သာ ရေးနိုင်သည်)။ **Network ACL (NACL)** တွင်သာ တိကျသော IP Address ကို Inbound DENY Rule ဖြင့် စစ်ထုတ်ပိတ်ပင်နိုင်ပါသည်။
</details>
