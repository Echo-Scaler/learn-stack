---
title: "Module 08: Deploy an Application on AWS for DevOps Engineers"
description: "Step-by-Step Production 2-Tier Architecture Deployment: Custom VPC, ALB, EC2 Docker, Private RDS PostgreSQL, S3, ACM HTTPS & CloudWatch"
---

> **Production-Grade 2-Tier Highly Available Cloud Deployment: Custom VPC မှစတင်၍ Application Load Balancer, EC2 Docker, Private Subnet RDS PostgreSQL, S3 Media Storage နှင့် ACM Free HTTPS တပ်ဆင်ခြင်း လက်တွေ့လမ်းညွှန်**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Production Web Application Deployment on AWS: 13-Stage Architectural Implementation, Security Lockdown & Disaster Recovery**
- **Track Level**: Practical Production Deployment (လက်တွေ့ ထုတ်လုပ်မှု အဆင့်)
- **Target Audience**: DevOps Engineers, Cloud Architects, Full-Stack Developers
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **Production Architecture Design**: ALB + Multi-AZ EC2 Docker + Private RDS PostgreSQL + S3 ဖြင့် ဖွဲ့စည်းထားသော Enterprise 2-Tier Architecture ကို ကိုယ်တိုင် ရေးဆွဲနိုင်ခြင်း။
* [x] **Secure Network Isolation**: Public Subnets တွင် ALB ကိုသာထားပြီး App Servers နှင့် Database ကို ပြင်ပမှ မမြင်နိုင်သော Private Subnets များတွင် သီးခြားခွဲထုတ်နိုင်ခြင်း။
* [x] **IAM Instance Profiles (Zero Credentials)**: EC2 ပေါ်တွင် Hardcoded Access Keys မသုံးဘဲ IAM Role ဖြင့် S3 နှင့် CloudWatch သို့ လုံခြုံစွာ ချိတ်ဆက်နိုင်ခြင်း။
* [x] **Dockerized Deployment**: EC2 instance ပေါ်တွင် Docker Engine ဖြင့် Web App ကို healthcheck probe များနှင့်တကွ ပြေးဆွဲနိုင်ခြင်း။
* [x] **Private Database Connectivity**: Web App မှ Private Subnet ရှိ RDS PostgreSQL သို့ Security Group Chaining ဖြင့် လုံခြုံစွာ ချိတ်ဆက်နိုင်ခြင်း။
* [x] **HTTPS / TLS with ACM**: AWS Certificate Manager (ACM) မှ အခမဲ့ SSL ရယူ၍ ALB တွင် HTTPS (Port 443) တပ်ဆင်ပြီး HTTP (80) ကို 301 Redirect လုပ်နိုင်ခြင်း။
* [x] **Monitoring & Automated Teardown**: CloudWatch Alarms များ တပ်ဆင်ပြီး Lab ပြီးဆုံးပါက ဘေလ်မတက်စေရန် စနစ်တကျ အပြီးတိုင် ဖျက်သိမ်းနိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 05: Docker & Containers](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/05-docker/README.md) — Docker Compose Multi-Tier App (Nginx + Node + Postgres)။
2. [Module 07: Cloud Fundamentals & AWS](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/07-aws-fundamentals/README.md) — VPC, Subnets, IAM, Security Groups အခြေခံ။
3. AWS Free Tier Account အဆင်သင့်ရှိခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **2-Tier Architecture** | Web/App Layer နှင့် Database Layer ကို သီးခြားခွဲထုတ်၍ Security နှင့် Scalability မြှင့်တင်ထားသော စနစ် | Database ပျက်ကျသော်လည်း Web layer မပျက်စီးစေဘဲ သီးခြားစီ scale လုပ်နိုင်စေသည်။ | Tier 1: ALB + EC2 App; Tier 2: RDS PostgreSQL |
| **Security Group Chaining** | Security Group တစ်ခု၏ Inbound Source တွင် IP အစား အခြား Security Group ID (e.g. `sg-web`) ကို တိုက်ရိုက် ညွှန်ပြခြင်း | Web servers များ၏ IP ပြောင်းလဲသွားစေကာမူ Database port ကို သီးခြား ပြန်ဖွင့်စရာမလိုဘဲ အမြဲ လုံခြုံစေသည်။ | RDS SG Inbound: Allow Port 5432 from `sg-web-servers` only. |
| **SSL Termination at ALB** | Client ထံမှ လာသော HTTPS traffic ကို Load Balancer (ALB) တွင် SSL ဖြည်ထုတ်ပြီး Backend servers များဆီသို့ သာမန် HTTP ဖြင့် လျင်မြန်စွာ လွှဲပြောင်းပေးခြင်း | EC2 instances များ၏ CPU ဝန်ထုပ်ဝန်ပိုးကို လျှော့ချပေးပြီး Certificate စီမံခန့်ခွဲမှုကို ALB တစ်နေရာတည်းတွင် ဗဟိုပြုစေသည်။ | Client ➜ (HTTPS 443) ➜ ALB ➜ (HTTP 3000) ➜ EC2 |
| **Bastion Host (Jump Box)** | Private Subnet ရှိ Servers များဆီသို့ လုံခြုံစွာ SSH လှမ်းဝင်ရန် Public Subnet တွင် တပ်ဆင်ထားသော ကြားခံ Hardened Server | Private servers များကို Public IP မပေးဘဲ အင်ဂျင်နီယာများအား လုံခြုံစွာ troubleshoot လုပ်ခွင့်ပေးသည်။ | `ssh -J ubuntu@bastion-ip ubuntu@private-ec2-ip` |
| **Multi-AZ RDS Failover** | Primary Database ပျက်စီးသွားပါက အခြား AZ တစ်ခုရှိ Standby Replica ဆီသို့ ၆၀ စက္ကန့်အတွင်း အလိုအလျောက် ပြောင်းလဲပေးသော စနစ် | Production Database downtime မဖြစ်စေဘဲ စီးပွားရေးလုပ်ငန်း ဆက်လက် လည်ပတ်နိုင်စေသည်။ | Primary (AZ-a) ➜ Auto-failover ➜ Standby (AZ-b) |

---

## 💡 ၅။ End-to-End Production Deployment (အဆင့် ၁၃ ဆင့်ပါ လက်တွေ့ စီမံချက်)

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   INTERNET TRAFFIC                                            │
└───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                │ (HTTPS Port 443 / HTTP 80 Redirect)
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  PUBLIC SUBNETS (AZ-A & AZ-B)                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     AWS APPLICATION LOAD BALANCER (ALB)                                 │  │
│  │                     • SSL Termination via ACM Certificate                               │  │
│  │                     • Security Group: sg-alb (Allow 80, 443 from 0.0.0.0/0)             │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                │ (Internal HTTP Port 3000)
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  PRIVATE SUBNETS (AZ-A & AZ-B)                                                                │
│  ┌───────────────────────────────────────────────┐   ┌─────────────────────────────────────┐  │
│  │ EC2 Instance 1 (Docker App Container)         │   │ EC2 Instance 2 (Docker App)         │  │
│  │ • Security Group: sg-web (Allow 3000 from ALB)│   │ • Security Group: sg-web            │  │
│  │ • IAM Role: S3ReadWrite + SSMManagedInstance  │   │ • IAM Role: S3ReadWrite + SSM       │  │
│  └───────────────────────┬───────────────────────┘   └───────────────────┬─────────────────┘  │
│                          │                                               │                    │
│                          └───────────────────────┬───────────────────────┘                    │
│                                                  ▼ (Internal SQL Port 5432)                   │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    AMAZON RDS POSTGRESQL (MULTI-AZ)                                     │  │
│  │                    • Security Group: sg-db (Allow 5432 from sg-web ONLY)                │  │
│  │                    • Database Subnet Group (Private Subnets A & B)                      │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ ၆။ Step-by-Step Hands-on Deployment Guide (အဆင့်ဆင့် တပ်ဆင်ပုံ)

### Stage 1: Secure Network Design (VPC & Subnets)
1. **VPC ဖန်တီးပါ**: `10.0.0.0/16`
2. **Subnets (၄) ခု ခွဲထုတ်ပါ**:
   - `Public-Subnet-1a`: `10.0.1.0/24` (AZ: `ap-southeast-1a`)
   - `Public-Subnet-1b`: `10.0.2.0/24` (AZ: `ap-southeast-1b`)
   - `Private-Subnet-1a`: `10.0.11.0/24` (AZ: `ap-southeast-1a`)
   - `Private-Subnet-1b`: `10.0.12.0/24` (AZ: `ap-southeast-1b`)
3. **Internet Gateway (IGW)** ကို ချိတ်ဆက်ပြီး Public Subnets များအတွက် Route Table တွင် `0.0.0.0/0 ➜ igw` ထည့်သွင်းပါ။

---

### Stage 2: Security Groups Configuration (Least Privilege Chaining)

အောက်ပါအတိုင်း Security Groups (၃) ခုကို အဆင့်ဆင့် သံကြိုးသဖွယ် ချိတ်ဆက်ပါ:

```text
1. sg-alb (Internet Facing)
   ├── Inbound  : TCP 80  (0.0.0.0/0)
   ├── Inbound  : TCP 443 (0.0.0.0/0)
   └── Outbound : All Traffic to sg-web

2. sg-web (Internal Application Tier)
   ├── Inbound  : TCP 3000 from sg-alb ONLY
   ├── Inbound  : TCP 22   from Bastion Host IP (optional)
   └── Outbound : All Traffic (to RDS and S3)

3. sg-db (Internal Database Tier)
   ├── Inbound  : TCP 5432 from sg-web ONLY
   └── Outbound : None (Isolated)
```

---

### Stage 3: IAM Role Creation (Instance Profile)

EC2 instances များအတွက် **IAM Role** တစ်ခု ဆောက်ပါ:
- Trusted Entity: `EC2`
- Attached Policies:
  1. `AmazonSSMManagedInstanceCore` (SSH key မလိုဘဲ AWS Systems Manager ဖြင့် terminal ဝင်ရောက်နိုင်ရန်)
  2. `AmazonS3ReadOnlyAccess` (သို့မဟုတ် တိကျသော App S3 bucket policy)

---

### Stage 4: Deploying Database (Amazon RDS PostgreSQL)
1. **Subnet Group**: Private Subnet 1a နှင့် 1b ကို ရွေးချယ်၍ DB Subnet Group ဆောက်ပါ။
2. **Database Engine**: PostgreSQL 15 (Free Tier: `db.t3.micro` သို့မဟုတ် `db.t4g.micro`)
3. **Connectivity**:
   - VPC: `Custom VPC`
   - Publicly Accessible: **No** (Private ဖြစ်ရမည်)
   - VPC Security Group: `sg-db` ရွေးချယ်ပါ။
4. **Database Endpoint** (ဥပမာ- `ecom.xxxx.ap-southeast-1.rds.amazonaws.com`) ကို မှတ်သားထားပါ။

---

### Stage 5: Deploying Web App on EC2 with Docker

EC2 Launch Wizard တွင် **User Data (Startup Script)** ထည့်သွင်း၍ Docker ကို အလိုအလျောက် သွင်းယူပြီး application စတင်ပြေးဆွဲပုံ:

```bash
#!/bin/bash
# ==============================================================================
# EC2 User Data Bootstrap Script
# ==============================================================================
set -euo pipefail

# System Updates & Docker Installation
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker daemon
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Run Production Application Container
docker run -d \
  --name web-api \
  --restart always \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST="ecom.xxxx.ap-southeast-1.rds.amazonaws.com" \
  -e DB_PORT=5432 \
  -e DB_USER="appuser" \
  -e DB_PASSWORD="SecretPassword123" \
  -e DB_NAME="ecommerce_prod" \
  node:20-alpine sh -c "echo 'App running on AWS EC2'; sleep 3600"
```

---

### Stage 6: Application Load Balancer (ALB) & HTTPS Setup
1. **Target Group ဖန်တီးပါ**:
   - Target Type: `Instances`
   - Protocol: `HTTP`, Port: `3000`
   - Health Check Path: `/healthz`
   - EC2 Instances များကို Register လုပ်ပါ။
2. **ALB ဖန်တီးပါ**:
   - Scheme: `Internet-facing`
   - Subnets: `Public-Subnet-1a` နှင့် `Public-Subnet-1b`
   - Security Group: `sg-alb`
   - Listeners:
     - **HTTPS (443)**: Forward to Target Group (Attach ACM Certificate)
     - **HTTP (80)**: Redirect to HTTPS Port 443 (HTTP to HTTPS 301 Redirect)

---

## 💰 ၇။ Cost Optimization & Teardown Protocol (ငွေကုန်ကျစရိတ် ရှင်းလင်းခြင်း)

> [!CAUTION]
> **အရေးကြီးသော ကုန်ကျစရိတ် ရှင်းလင်းမှု သတိပေးချက်**:
> ဤ Lab တွင် ALB နှင့် RDS ပါဝင်သဖြင့် စမ်းသပ်မှု ပြီးဆုံးပါက အောက်ပါအစဉ်အတိုင်း **၁၀၀% ရှင်းလင်းရပါမည်**:
> 1. **ALB**: Load Balancer ကို Delete လုပ်ပါ (နံပါတ်တစ် ဦးစားပေး)။
> 2. **Target Group**: Target Group ကို Delete လုပ်ပါ။
> 3. **EC2 Instances**: Terminate ပြုလုပ်ပါ။
> 4. **RDS Database**: Delete ပြုလုပ်ပါ (Snapshot မယူပါနှင့်)။
> 5. **Security Groups & VPC**: VPC ကို Delete လုပ်ပါ။

---

## ⚠️ ၈။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **ALB Target Group "Unhealthy"** | EC2 ပေါ်ရှိ App သည် port 3000 တွင် မပြေးသေးခြင်း သို့မဟုတ် `/healthz` မှ 200 OK မပြန်ခြင်း | EC2 ပေါ်သို့ SSM ဖြင့် ဝင်၍ `docker ps` နှင့် `curl http://localhost:3000/healthz` စစ်ပါ။ `sg-web` တွင် ALB SG မှ port 3000 ခွင့်ပြုထားမှု စစ်ပါ။ |
| **Database Connection Timeout from Web App** | `sg-db` တွင် `sg-web` မှ port 5432 ဝင်ခွင့် Inbound rule မရှိခြင်း သို့မဟုတ် Subnet routing မှားယွင်းနေခြင်း | `sg-db` Inbound Rule တွင် Type: PostgreSQL (5432), Source: `sg-web` ထည့်ပေးပါ။ |
| **ALB Shows "503 Service Temporarily Unavailable"** | Target Group ထဲတွင် Healthy Target တစ်ခုမှ မရှိခြင်း | EC2 instances များအားလုံး Unhealthy ဖြစ်နေသဖြင့် Health Check Path နှင့် response code ကို စစ်ဆေးပါ။ |

---

## 🏋️ ၉။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Deploy a Secure Web App on EC2 with Private RDS Database**
1. Custom VPC တွင် Public Subnet ၂ ခုနှင့် Private Subnet ၂ ခုကို ဖန်တီးပါ။
2. Private Subnets များတွင် Free-tier PostgreSQL RDS database တစ်လုံး တည်ဆောက်ပါ။
3. Public Subnet တွင် EC2 instance တစ်လုံး launch လုပ်ပြီး Docker ဖြင့် Node.js/PHP App run ပါ။
4. Web App မှ Private RDS သို့ database query စမ်းသပ် run ပါ (`SELECT NOW();`)။
5. ALB တပ်ဆင်၍ ပြင်ပ browser မှ DNS name ဖြင့် ဝင်ရောက်ကြည့်ရှုပြီး အောင်မြင်ပါက Resource အားလုံးကို Clean up လုပ်ပါ။

---

## ❓ ၁၀။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. ALB တွင် HTTP to HTTPS 301 Redirect ပြုလုပ်ခြင်း၏ အကျိုးကျေးဇူးမှာ အဘယ်နည်း?
2. Database ကို Private Subnet တွင် ထားရှိပြီး Web Server ကို Public Subnet တွင် ထားခြင်းဖြင့် မည်သည့် Security အကျိုးကျေးဇူး ရရှိသနည်း?
3. AWS Systems Manager (SSM) Session Manager သုံးခြင်းဖြင့် Port 22 (SSH) ဖွင့်ခြင်းထက် အဘယ်ကြောင့် ပိုမို လုံခြုံသနည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. User များမှ မလုံခြုံသော HTTP (Port 80) ဖြင့် ဝင်လာသော်လည်း Encrypted HTTPS (Port 443) သို့ အလိုအလျောက် ပြောင်းလဲပေးသဖြင့် Data ပေါက်ကြားမှု မရှိစေရန် ကာကွယ်ပေးသည်။
2. Database သည် Public Internet မှ လုံးဝ ကွယ်ဝှက်ထားသဖြင့် Hackers များမှ တိုက်ရိုက် Port scanning, Brute-force သို့မဟုတ် DDoS တိုက်ခိုက်မှုများ မပြုလုပ်နိုင်တော့ပါ။
3. Port 22 ကို Internet သို့ ဖွင့်စရာမလိုသလို SSH Private Key များ စီမံခန့်ခွဲစရာ မလိုပါ။ IAM Permissions နှင့် MFA ဖြင့်သာ စစ်ဆေးပြီး Session အားလုံးကို AWS CloudTrail တွင် Audit log အပြည့်အစုံ မှတ်တမ်းတင်ထားနိုင်သောကြောင့် ဖြစ်သည်။
</details>

---

## 💼 ၁၁။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production တွင် High Availability (HA) ဖြစ်သော Web Application Architecture တစ်ခုကို AWS ပေါ်တွင် မည်သို့ ဒီဇိုင်းဆွဲ တည်ဆောက်မည်နည်း?**
> **Sample Answer**:
> "Production High Availability (HA) အတွက် Multi-AZ 2-Tier Architecture ကို အောက်ပါအတိုင်း ဒီဇိုင်းဆွဲပါမည်:
> 1. **Networking Layer**: Availability Zones (၂) ခု (e.g. ap-southeast-1a & 1b) ပေါ်တွင် ဖြန့်ကြက်ထားသော Custom VPC (`10.0.0.0/16`) တည်ဆောက်ပါမည်။ Public Subnets (၂) ခုနှင့် Private Subnets (၂) ခု ခွဲထားပါမည်။
> 2. **Public / Ingress Layer**: Multi-AZ Application Load Balancer (ALB) ကို Public Subnets တွင် ထားပြီး ACM Free SSL ဖြင့် HTTPS (443) တပ်ဆင်ပါမည်။
> 3. **Application Tier**: EC2 Web instances (သို့မဟုတ် ECS Fargate Containers) များကို Private Subnets များတွင် Auto Scaling Group (ASG) ဖြင့် run ထားပြီး traffic တက်လာပါက အလိုအလျောက် scale လုပ်စေပါမည်။
> 4. **Database Tier**: Amazon RDS PostgreSQL ကို Multi-AZ အနေဖြင့် Private Subnets တွင် ထားရှိပါမည် (Primary AZ ကျသွားပါက Standby AZ သို့ ၆၀ စက္ကန့်အတွင်း အလိုအလျောက် failover လုပ်ဆောင်ပါမည်)။
> 5. **Security & Storage**: Static assets များကို S3 + CloudFront CDN တွင် ထားပြီး Security Groups Chaining နှင့် IAM Instance Profiles ကို သုံး၍ Zero-hardcoded credentials စနစ်ဖြင့် လုံခြုံစွာ တည်ဆောက်ပါမည်။"

---

## 📚 ၁၂။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Deploy a Web App on Amazon EC2](https://aws.amazon.com/getting-started/hands-on/deploy-web-app/)
- [Application Load Balancers User Guide](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
- [Amazon RDS User Guide for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
