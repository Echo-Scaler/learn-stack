---
title: "Module 07: Cloud Fundamentals & AWS for DevOps Engineers"
description: "AWS Cloud Fundamentals, Shared Responsibility Model, Global Infrastructure, IAM Least Privilege, Custom VPC, Core Services & Cost Guardrails"
---

> **Cloud Computing သဘောတရားများ၊ AWS Global Infrastructure၊ IAM Least Privilege လုံခြုံရေး၊ Custom VPC Networking နှင့် ဒေါ်လာကုန်ကျစရိတ် ကာကွယ်ရေးစနစ် (Cost Guardrails) များ**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **AWS Cloud Architecture: IAM Security, VPC Networking, Core Cloud Services & Cost Management**
- **Track Level**: Core Cloud Architecture (Cloud အခြေခံအဆောက်အအုံ)
- **Target Audience**: DevOps Engineers, Cloud Engineers, Solutions Architects
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **Cloud Computing & Shared Responsibility**: IaaS, PaaS, SaaS မော်ဒယ်များနှင့် AWS နှင့် Customer ကြား လုံခြုံရေးတာဝန်ခွဲဝေမှု (Shared Responsibility Model) ကို ရှင်းလင်းစွာ နားလည်ခြင်း။
* [x] **Global Infrastructure**: Regions, Availability Zones (AZs) နှင့် Edge Locations များ၏ ကွာခြားချက်နှင့် Multi-AZ High Availability (HA) ဒီဇိုင်း ရေးဆွဲနိုင်ခြင်း။
* [x] **IAM Least Privilege Mastery**: Root Account ကို ကာကွယ်ခြင်း (MFA), IAM Users, Groups, Roles (Instance Profiles) နှင့် JSON Policies များကို အသုံးချတတ်ခြင်း။
* [x] **Custom VPC Architecture**: Custom VPC (`10.0.0.0/16`), Public Subnets, Private Subnets, Route Tables, Internet Gateway (IGW) နှင့် NAT Gateway များကို စနစ်တကျ ဒီဇိုင်းဆွဲနိုင်ခြင်း။
* [x] **Firewalls in Cloud**: Security Groups (Stateful) နှင့် Network ACLs (Stateless) တို့၏ ကွာခြားချက်ကို သိရှိပြီး Port များကို လုံခြုံစွာ ကန့်သတ်နိုင်ခြင်း။
* [x] **Core Services Overview**: EC2, S3, RDS, ALB, Route 53, CloudWatch, Systems Manager (SSM) တို့၏ အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
* [x] **Zero-Cost / Free Tier Protection**: မလိုလားအပ်သော Cloud ကုန်ကျစရိတ်များ မတက်စေရန် **AWS Budgets ($0.01 threshold)** နှင့် Billing Alarms များကို မဖြစ်မနေ တပ်ဆင်နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 01: Linux Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/01-linux/README.md) — SSH keys နှင့် system administration အခြေခံ။
2. [Module 02: Networking Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/02-networking/README.md) — CIDR subnetting (`/16`, `/24`), TCP/IP, DNS, NAT နှင့် Routing tables။
3. **AWS Account**: Credit/Debit card ဖြင့် ဖွင့်လှစ်ထားသော AWS Free Tier Account အဆင်သင့်ရှိခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Region & Availability Zone (AZ)** | Region သည် ကမ္ဘာအနှံ့ရှိ ပထဝီဝင်ဒေသ (e.g. `ap-southeast-1` Singapore) ဖြစ်ပြီး AZ သည် Region တစ်ခုအတွင်းရှိ သီးခြား မီးလိုင်း/နက်ဝပ်ခွဲထားသော Data Center အဆောက်အအုံများ ဖြစ်သည် | Data center တစ်ခု မီးပျက်သော်လည်း ဝန်ဆောင်မှု မပြတ်တောက်စေရန် Multi-AZ Architecture တည်ဆောက်ရသည်။ | Singapore Region တွင် `ap-southeast-1a`, `1b`, `1c` ဟူသော AZ (၃) ခု ရှိသည်။ |
| **Shared Responsibility Model** | "Security OF the Cloud" (Hardware/Data center) ကို AWS က တာဝန်ယူပြီး "Security IN the Cloud" (Data, OS, Firewall, IAM) ကို Customer က တာဝန်ယူရသည့် မူဝါဒ | Database ပေါက်ကြားသွားပါက သို့မဟုတ် Port ဖွင့်ထားမိပါက AWS အပြစ်မဟုတ်ဘဲ မိမိ၏ Security ပေါ့လျော့မှု ဖြစ်သည်။ | AWS protects physical hardware; You patch OS and configure Security Groups. |
| **IAM Role vs User** | IAM User သည် လူတစ်ဦးချင်းစီအတွက် အမြဲတမ်း Credentials ဖြစ်ပြီး IAM Role သည် Application သို့မဟုတ် EC2/Lambda အား ယာယီ ခွင့်ပြုချက် (Temporary STS Token) ပေးအပ်သော ယန္တရား ဖြစ်သည် | EC2 သို့မဟုတ် App ထဲတွင် Access Keys များကို Hardcode မထည့်ဘဲ လုံခြုံစွာ Cloud services များ သုံးခွင့်ရစေသည်။ | EC2 Instance Profile (Role) ဖြင့် S3 bucket ဖတ်ခွင့် ပေးခြင်း။ |
| **VPC (Virtual Private Cloud)** | AWS Cloud ပေါ်တွင် သင့်ကုမ္ပဏီအတွက် သီးသန့် ခွဲထုတ်သတ်မှတ်ပေးထားသော Isolated Virtual Network အိမ်တော် | သင်၏ Servers များ၊ Databases များကို ကမ္ဘာ့အင်တာနက်မှ သီးခြားခွဲထုတ်၍ လုံခြုံစွာ တည်ဆောက်ပေးသည်။ | Custom CIDR: `10.0.0.0/16` |
| **NAT Gateway** | Private Subnet ရှိ Server များကို Public Internet မှ တိုက်ရိုက် မမြင်စေဘဲ အပြင်သို့ Software Updates / Patches ထွက်ဆွဲခွင့်ပေးသော Managed Network Service | Database သို့မဟုတ် Backend application server များကို လုံခြုံစွာထားရှိရန် မရှိမဖြစ် သုံးရသည်။ | `0.0.0.0/0` ➜ `nat-0123456789` |
| **Security Group vs NACL** | Security Group သည် Instance အဆင့်တွင် စစ်ဆေးသော **Stateful** Firewall ဖြစ်ပြီး NACL သည် Subnet အဆင့်တွင် စစ်ဆေးသော **Stateless** Firewall ဖြစ်သည် | Inbound ပြန်ဖွင့်ပေးလိုက်ပါက Outbound အလိုအလျောက် ပွင့်သွားခြင်းသည် Stateful Security Group ၏ အားသာချက် ဖြစ်သည်။ | SG: Allow TCP 443; NACL: Rule 100 Allow Inbound & Outbound Ephemeral Ports. |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ AWS Shared Responsibility Model (လုံခြုံရေး တာဝန်ခွဲဝေမှု မော်ဒယ်)

```text
┌────────────────────────────────────────────────────────────────────────┐
│               CUSTOMER: Security "IN" the Cloud                        │
├────────────────────────────────────────────────────────────────────────┤
│ • Customer Data & Database Encryption (KMS)                            │
│ • Identity & Access Management (IAM, MFA, Least Privilege)             │
│ • OS Patches, Updates & Network Firewalls (Security Groups / NACLs)    │
└────────────────────────────────────────────────────────────────────────┘
                                    ▲
                         (လုံခြုံရေး ခွဲခြားမျဉ်း)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 AWS: Security "OF" the Cloud                           │
├────────────────────────────────────────────────────────────────────────┤
│ • Physical Data Center Security (Guards, Cameras, Power Generators)    │
│ • Hardware & Server Maintenance (Motherboards, NVMe, Cables)           │
│ • Global Networking Infrastructure & Hypervisor Layer (Nitro)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### ၅.၂ Enterprise Custom VPC Architecture (အဆင့်မြင့် Cloud ကွန်ရက် ဒီဇိုင်း)

Production-Ready VPC တစ်ခုတွင် အနည်းဆုံး **Availability Zones (၂) ခု** ဖြန့်ကြက်ထားပြီး **Public Subnets (၂) ခု** နှင့် **Private Subnets (၂) ခု** ပါဝင်ရမည် ဖြစ်ပါသည်:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  AWS CUSTOM VPC: 10.0.0.0/16 (Singapore Region: ap-southeast-1)                              │
│                                                                                               │
│  [ Internet Gateway: igw-xxxx ] ◄── (Public Internet Inbound/Outbound)                        │
│                                                                                               │
│  ┌───────────────────────────────────────────────┐   ┌────────────────────────────────────────┐
│  │ Availability Zone A (ap-southeast-1a)         │   │ Availability Zone B (ap-southeast-1b)  │
│  │                                               │   │                                        │
│  │ ┌───────────────────────────────────────────┐ │   │ ┌────────────────────────────────────┐ │
│  │ │ Public Subnet A: 10.0.1.0/24              │ │   │ │ Public Subnet B: 10.0.2.0/24       │ │
│  │ │ • Application Load Balancer (ALB) Node    │ │   │ │ • Application Load Balancer (ALB)  │ │
│  │ │ • NAT Gateway A (nat-xxx)                 │ │   │ │                                    │ │
│  │ └───────────────────────────────────────────┘ │   │ └────────────────────────────────────┘ │
│  │                       │                       │   │                       │                │
│  │                       ▼                       │   │                       ▼                │
│  │ ┌───────────────────────────────────────────┐ │   │ ┌────────────────────────────────────┐ │
│  │ │ Private Subnet A: 10.0.11.0/24            │ │   │ │ Private Subnet B: 10.0.12.0/24     │ │
│  │ │ • EC2 Web App Server                      │ │   │ │ • EC2 Web App Server               │ │
│  │ │ • RDS Multi-AZ Primary Database           │ │   │ │ • RDS Multi-AZ Standby Replica     │ │
│  │ └───────────────────────────────────────────┘ │   │ └────────────────────────────────────┘ │
│  └───────────────────────────────────────────────┘   └────────────────────────────────────────┘
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ ၆။ IAM Least Privilege Architecture (လုံခြုံရေး မဏ္ဍိုင်)

1. **Root Account Guard**:
   - AWS စတင်ဖွင့်လှစ်သော Root Account ကို နေ့စဉ်အလုပ်များအတွက် **လုံးဝ အသုံးမပြုရ**။
   - Hardware သို့မဟုတ် Authenticator App ဖြင့် **Multi-Factor Authentication (MFA)** ကို ချက်ချင်း အသက်သွင်းပါ။
2. **Dedicated IAM Admin User**:
   - နေ့စဉ် Cloud အလုပ်များအတွက် သီးခြား Admin user တစ်ဦး ဆောက်၍ သုံးပါ။
3. **No Hardcoded Keys (Use IAM Roles)**:
   - EC2 သို့မဟုတ် Container များမှ S3, SQS သို့ ဆက်သွယ်လိုပါက Access Key ID / Secret Key များကို code ထဲ မထည့်ဘဲ **IAM Instance Profile (Role)** ကို instance နှင့် ချိတ်ဆက်ပေးပါ။

---

## 💰 ၇။ Cloud Cost Guardrails (ဒေါ်လာ ကုန်ကျစရိတ် ကာကွယ်ရေး စည်းမျဉ်းများ)

> [!CAUTION]
> **အရေးကြီးသော ကုန်ကျစရိတ် သတိပေးချက်**:
> AWS Free Tier တွင် EC2 t2.micro (750 hours/month), S3 (5GB), RDS db.t3.micro (750 hours) တို့ကို အခမဲ့ ပေးသော်လည်း အောက်ပါအချက်များကို သတိမပြုမိပါက ဘေလ်တက်နိုင်ပါသည်:
> - **NAT Gateway**: တစ်နာရီလျှင် ~$0.045 + Data processing fee (တစ်လလျှင် ~$32 ကျသင့်ပါသည်)။ စမ်းသပ်ပြီးပါက ချက်ချင်း Delete ပြုလုပ်ရမည်။
> - **Elastic IP (EIP)**: Instance နှင့် မချိတ်ဘဲ အလွတ်ထားရှိပါက နာရီအလိုက် ပိုက်ဆံဖြတ်ပါသည်။
> - **Unattached EBS Volumes**: EC2 terminate လုပ်သော်လည်း disk volume ကျန်ခဲ့ပါက storage ခ ပေးရပါသည်။

### အရေးပေါ် ကာကွယ်မှု တပ်ဆင်ပုံ:
1. **AWS Budgets ($0.01 Threshold)**:
   - AWS Console ➜ **Billing and Cost Management** ➜ **Budgets** သို့ သွားပါ။
   - Monthly Cost Budget အသစ် ဆောက်ပြီး Budget Amount ကို `$1.00` (သို့မဟုတ် `$0.01`) ထားရှိပါ။
   - Threshold 80% ကျော်ပါက သင့် Email သို့ ချက်ချင်း သတိပေးချက် ပို့စေရန် ချိတ်ဆက်ပါ။
2. **CloudWatch Billing Alarm**:
   - `us-east-1` (N. Virginia) Region သို့ သွားပါ (Billing metrics သည် us-east-1 တွင်သာ ရှိသည်)။
   - Metric: `EstimatedCharges` > `$1` ဖြစ်ပါက SNS Topic မှတဆင့် Email ပို့ရန် Alarm သတ်မှတ်ပါ။

---

## 💻 ၈။ AWS CLI Essential Commands (Terminal စီမံခန့်ခွဲမှု)

```bash
# AWS CLI အကောင့် ချိတ်ဆက်ခြင်း
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: ap-southeast-1
# Default output format [None]: json

# မိမိ မည်သည့် User အဖြစ် ချိတ်ဆက်မိနေသည်ကို စစ်ဆေးခြင်း
aws sts get-caller-identity

# Region ရှိ VPCs များကို စာရင်းကြည့်ရှုခြင်း
aws ec2 describe-vpcs --output table

# ပြေးဆွဲနေသော EC2 Instances များကို စစ်ဆေးခြင်း
aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]" --output table

# S3 Buckets များကို ကြည့်ရှုခြင်း
aws s3 ls
```

---

## ⚠️ ၉။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **`AccessDenied: User is not authorized to perform: ...`** | IAM User သို့မဟုတ် Role တွင် သက်ဆိုင်ရာ Action (ဥပမာ `ec2:RunInstances`) ခွင့်ပြုချက် Policy မရှိခြင်း | IAM Console ➜ Users/Roles ➜ Policy တွင် လိုအပ်သော JSON permission ကို Least Privilege အတိုင်း ပေါင်းထည့်ပါ။ |
| **EC2 Instance in Public Subnet cannot connect to Internet** | Subnet Route Table တွင် Internet Gateway (`0.0.0.0/0 ➜ igw-xxx`) မရှိခြင်း သို့မဟုတ် Auto-assign Public IP ပိတ်နေခြင်း | Route Table တွင် IGW လမ်းကြောင်း ပေါင်းထည့်ပါ။ Instance တွင် Public IP ရှိမရှိ စစ်ဆေးပါ။ |
| **EC2 in Private Subnet cannot run `apt update`** | Private Subnet Route Table တွင် NAT Gateway လမ်းကြောင်း မရှိခြင်း | Public Subnet တွင် NAT Gateway တည်ဆောက်ပြီး Private Route Table တွင် `0.0.0.0/0 ➜ nat-xxx` လမ်းဖောက်ပေးပါ။ |
| **Unexpected Charges on Free Tier Account** | Terminate လုပ်ရန် မေ့ကျန်ခဲ့သော NAT Gateway, Elastic IP, KMS Key သို့မဟုတ် EBS Volume ရှိနေခြင်း | AWS Cost Explorer ➜ Daily costs ကို စစ်ဆေးပြီး မလိုလားအပ်သော Resources များကို ချက်ချင်း Delete ပြုလုပ်ပါ။ |

---

## 🏋️ ၁၀။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Zero-Dollar AWS Budget & Custom VPC Setup**
1. AWS Console သို့ သွားရောက်ပြီး `$1.00` Threshold ဖြင့် **AWS Monthly Cost Budget** ကို တပ်ဆင်ပါ။
2. VPC Console သို့ သွားရောက်ပြီး Custom VPC အသစ် ဆောက်ပါ:
   - Name: `devops-lab-vpc`
   - CIDR: `10.0.0.0/16`
3. အဆိုပါ VPC အတွင်း **Public Subnet** တစ်ခု ဆောက်ပါ:
   - Name: `public-subnet-1a`
   - CIDR: `10.0.1.0/24`
   - AZ: `ap-southeast-1a`
4. **Internet Gateway (IGW)** ဆောက်ပြီး VPC နှင့် Attach တွဲချိတ်ပါ။
5. Route Table အသစ် ဆောက်ပြီး `0.0.0.0/0 ➜ igw-xxxx` လမ်းကြောင်း ဖောက်ကာ `public-subnet-1a` နှင့် Associate လုပ်ပါ။
6. AWS CLI ဖြင့် အဆိုပါ Subnet တည်ရှိမှုကို terminal မှ verify လုပ်ပါ:
   ```bash
   aws ec2 describe-subnets --filters "Name=vpc-id,Values=<YOUR_VPC_ID>"
   ```

---

## ❓ ၁၁။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. AWS Availability Zone (AZ) တစ်ခု ပျက်စီးသွားပါက သင်၏ Website မရပ်တန့်သွားစေရန် မည်သို့ ဒီဇိုင်းဆွဲရမည်နည်း?
2. Security Group နှင့် Network ACL (NACL) ၏ အဓိက ကွာခြားချက် (၂) ခုကို ဖော်ပြပါ။
3. EC2 Instance တစ်ခုမှ S3 Bucket ထဲသို့ logs များ upload တင်ရန်အတွက် IAM Access Keys များကို EC2 ထဲ ထည့်သွင်းခြင်းနှင့် IAM Role ချိတ်ဆက်ပေးခြင်း မည်သည်က ပိုမို လုံခြုံသနည်း? အဘယ်ကြောင့်နည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. မတူညီသော AZ (၂) ခု သို့မဟုတ် (၃) ခုတွင် Subnets များခွဲ၍ EC2 instances များကို ဖြန့်ကြက် run ထားပြီး၊ ၎င်းတို့၏ ရှေ့တွင် Multi-AZ **Application Load Balancer (ALB)** ခံထားရပါမည် (Multi-AZ High Availability Design)။
2. (က) **Stateful vs Stateless**: Security Group သည် Stateful ဖြစ်သဖြင့် Inbound ခွင့်ပြုပါက Outbound အလိုအလျောက် ပွင့်သည်။ NACL သည် Stateless ဖြစ်သဖြင့် Inbound ရော Outbound ပါ သီးခြားစီ ခွင့်ပြုပေးရသည်။ (ခ) **Instance vs Subnet level**: Security Group သည် Instance အဆင့်တွင် အလုပ်လုပ်ပြီး NACL သည် Subnet နယ်နိမိတ် အဆင့်တွင် အလုပ်လုပ်သည်။
3. **IAM Role (Instance Profile)** ချိတ်ဆက်ပေးခြင်းသည် အဆပေါင်းများစွာ ပိုမို လုံခြုံပါသည်။ အဘယ်ကြောင့်ဆိုသော် EC2 အတွင်း Long-lived static credentials (Secret Keys) များကို ထားရှိစရာ မလိုဘဲ AWS STS မှ စက္ကန့်ပိုင်းအလိုက် Short-lived temporary tokens များ အလိုအလျောက် ထုတ်ပေးပြီး လှည့်လည်ပေးသောကြောင့် Key ခိုးယူခံရနိုင်ခြေ မရှိပါ။
</details>

---

## 💼 ၁၂။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production Database (AWS RDS) ကို Public Subnet တွင် မထားဘဲ Private Subnet တွင် အဘယ်ကြောင့် မဖြစ်မနေ ထားရှိရသနည်း? Developer များသည် Database ကို ပြင်ပမှ မည်သို့ ချိတ်ဆက် စစ်ဆေးနိုင်မည်နည်း?**
> **Sample Answer**:
> "Database တွင် စီးပွားရေးလုပ်ငန်း၏ အရေးကြီးဆုံး Sensitive Customer Data များ သိမ်းဆည်းထားသောကြောင့် Public Internet မှ Brute-force တိုက်ခိုက်မှု၊ Zero-day exploits များနှင့် DDoS တိုက်ခိုက်မှုများ တိုက်ရိုက် မထိတွေ့စေရန် Public IP လုံးဝ မရှိသော **Private Subnet** တွင်သာ ထားရှိရပါသည်။ Developer သို့မဟုတ် DBA များမှ Database ကို ချိတ်ဆက် စစ်ဆေးလိုပါက နည်းလမ်း (၂) မျိုး သုံးနိုင်ပါသည်: (၁) **AWS Systems Manager (SSM) Session Manager**: Public IP မလိုဘဲ IAM permission ဖြင့် လုံခြုံစွာ Port Forwarding ပြုလုပ်ခြင်း။ (၂) **Bastion Host (Jump Server)**: Public Subnet တွင် ထားရှိသော လုံခြုံစိတ်ချရသည့် EC2 Bastion host မှတဆင့် SSH Tunneling ဖောက်၍ Private RDS သို့ ချိတ်ဆက်ခြင်းတို့ ဖြစ်ပါသည်။"

---

## 📚 ၁၃။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Amazon VPC User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Free Tier Limits and Details](https://aws.amazon.com/free/)
