---
title: "AWS Cloud & DevOps Master Real Labs — Complete Production Blueprint"
description: "Japan IT Industry & Modern Cloud Web Architecture Production Guide — 10-Point Master Structure ဖြင့် Core Services များ၊ Hands-on Labs၊ Terraform၊ Troubleshooting နှင့် SAA-C03 Exam Notes အပြည့်အစုံ"
---

# ☁️ AWS Cloud & DevOps Master Real Labs
### Japan IT Industry & Modern Cloud Web Architecture Production Guide

> **Target Audience:** Beginner to Senior Cloud / DevOps Engineer & Solution Architect  
> **Course Scope:** ၄၁ ခန်း (15 Level Production Labs, 18 SAA Architecture Phases, 7 Real Exam Sets)  
> **Structure Standard:** Service တစ်ခုချင်းစီအတွက် 10-Point Master Structure (Architecture, How it works, Hands-on Lab, Cost, Troubleshooting, SAA-C03 Exam Traps & Quiz) ဖြင့် စနစ်တကျ ရေးသားထားပါသည်။

---

## 🗺️ Master Curriculum Navigation & Syllabus Hub

အောက်ပါ Navigation Tables များမှတစ်ဆင့် Course အတွင်းရှိ သက်ဆိုင်ရာ Level Labs၊ Architecture Phases နှင့် Exam Sets များသို့ တိုက်ရိုက် သွားရောက်လေ့လာနိုင်ပါသည်:

### 🛠️ Module 1: 15-Level Production Real-Work Labs
| Level | အခန်း ခေါင်းစဉ် | အဓိက Focus & AWS Services | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **00** | **Course Overview & Rules** | Course Mission, Japan Genba Blueprint & Teaching Methodology | [**Course Overview →**](/aws/02_beginner_to_advanced_real_work/00_course_overview_and_rules/) |
| **01** | **Level 1: Cloud & Networking Basics** | Cloud Models (IaaS/PaaS/SaaS), Shared Responsibility, CIDR, Subnets, Tokyo vs Osaka | [**Level 1 Lab →**](/aws/02_beginner_to_advanced_real_work/01_level1_cloud_fundamentals_and_networking/) |
| **02** | **Level 2: IAM, VPC & EC2 Core Infra** | 3-Tier VPC, Public/Private Subnets, NAT Gateway, EC2 Linux, EBS Types & Snapshots | [**Level 2 Lab →**](/aws/02_beginner_to_advanced_real_work/02_level2_iam_vpc_ec2_ebs/) |
| **03** | **Level 3: ALB, Route 53, S3 & CDN** | Application Load Balancer, ACM HTTPS, S3 OAC, CloudFront Global CDN Caching | [**Level 3 Lab →**](/aws/02_beginner_to_advanced_real_work/03_level3_alb_route53_acm_s3_cloudfront/) |
| **04** | **Level 4: RDS, Aurora & ElastiCache** | RDS Multi-AZ, Read Replicas, Amazon Aurora Serverless, Redis Session Caching | [**Level 4 Lab →**](/aws/02_beginner_to_advanced_real_work/04_level4_rds_aurora_elasticache_redis/) |
| **05** | **Level 5: Container Architecture** | Docker to AWS, Amazon ECR Image Scanning, ECS with AWS Fargate Serverless | [**Level 5 Lab →**](/aws/02_beginner_to_advanced_real_work/05_level5_docker_ecr_ecs_fargate/) |
| **06** | **Level 6: Serverless & NoSQL** | AWS Lambda Cold Starts, API Gateway REST vs HTTP, DynamoDB Single-Table Design | [**Level 6 Lab →**](/aws/02_beginner_to_advanced_real_work/06_level6_lambda_apigateway_dynamodb/) |
| **07** | **Level 7: Event-Driven Systems** | Amazon SQS Decoupling, SNS Pub/Sub Fan-Out, EventBridge Rules & Scheduler | [**Level 7 Lab →**](/aws/02_beginner_to_advanced_real_work/07_level7_sqs_sns_eventbridge/) |
| **08** | **Level 8: Observability & Security** | CloudWatch Alarms/Logs, CloudTrail Audit, AWS SSM Session Manager (No SSH 22), KMS | [**Level 8 Lab →**](/aws/02_beginner_to_advanced_real_work/08_level8_cloudwatch_cloudtrail_ssm_security/) |
| **09** | **Level 9: Terraform & CI/CD Pipelines** | Complete Production Terraform (VPC+ALB+ECS+RDS), GitHub Actions Zero-Downtime | [**Level 9 Lab →**](/aws/02_beginner_to_advanced_real_work/09_level9_terraform_cicd_githubactions/) |
| **10** | **Level 10: HA, DR, FinOps & Well-Arch** | Multi-Region Disaster Recovery (RPO/RTO), Cost Optimization, 6 Pillars Framework | [**Level 10 Lab →**](/aws/02_beginner_to_advanced_real_work/10_level10_ha_dr_cost_wellarchitected/) |
| **11** | **Level 11: Japanese IT Genba & Tickets** | 現場で必須のIT用語集, 25 Real-Work Incident Tickets (障害対応シミュレーション) | [**Level 11 Lab →**](/aws/02_beginner_to_advanced_real_work/11_level11_japanese_workplace_it_and_tickets/) |
| **12** | **Level 12: Production Troubleshooting** | 障害対応マニュアル: Downtime, 502 Bad Gateway, DB Connection, S3 403 Access Denied | [**Level 12 Lab →**](/aws/02_beginner_to_advanced_real_work/12_level12_production_troubleshooting_runbook/) |
| **13** | **Level 13: Capstone Laravel EC Site** | Full Production Deployment: VPC + ALB + ECS Fargate + RDS Aurora + Redis + S3/CDN | [**Level 13 Lab →**](/aws/02_beginner_to_advanced_real_work/13_final_capstone_laravel_production_project/) |
| **14** | **Level 14: AWS CLI & Interview Prep** | Complete AWS CLI Production Reference Cheatsheet & Senior Architect Interview Q&A | [**Level 14 Lab →**](/aws/02_beginner_to_advanced_real_work/14_aws_cli_reference_and_interview_prep/) |

### 🏛️ Module 2 & 3: SAA Architecture Phases & Real Exam Sets
- [Phase 00 - 17: SAA Solutions Architect Master Guide (VPC, Resilient Decoupling, SAA Decision Making)](/aws/03_saa_solutions_architect_real_work/00_phase0_foundations_cloud_networking_linux/)
- [Exam Sets 01 - 07: SAA-C03 Real Exam Practice Sets with Deep Explanations](/aws/04_saa_c03_practice_exams/exam_set_01_security_iam/)

---

# 🌟 Core Production Services Master Guides (10-Point Structure)

ဂျပန် Cloud လုပ်ငန်းခွင် (現場 - Genba) နှင့် AWS SAA-C03 စာမေးပွဲအတွက် အဓိက အလိုအပ်ဆုံးဖြစ်သော Core AWS Services များကို 10-Point Master Structure ဖြင့် အသေးစိတ် တင်ပြထားပါသည်:

---

## 1. Amazon EC2 (Elastic Compute Cloud) & Nitro System

### 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ
**Amazon EC2** သည် AWS ၏ အခြေခံအကျဆုံး Virtual Computing Service (IaaS) ဖြစ်ပါသည်။ Cloud ပေါ်တွင် လိုအပ်သလို CPU, Memory, Storage နှင့် OS (Linux/Windows) များကို မိနစ်ပိုင်းအတွင်း တည်ဆောက်ပြီး Web applications များ၊ background workers များနှင့် enterprise workloads များကို run ရန် အသုံးပြုပါသည်။

### 2. Key Components
- **AMI (Amazon Machine Image):** OS, libraries နှင့် software dependencies များ ပါဝင်သော instance template (Amazon Linux 2023, Ubuntu, RHEL)။
- **Instance Types:** Workload အလိုက် ခွဲခြားထားသော မိသားစုများ (`t4g/t3` General Purpose, `c7g` Compute, `r7g` Memory, `i4i` Storage, `g5` GPU)။
- **AWS Nitro System:** Virtualization overhead ကို dedicated hardware card သို့ လွှဲပြောင်းပေးသဖြင့် 100% နီးပါး bare-metal performance ရရှိစေသော system။
- **EBS (Elastic Block Store):** EC2 နှင့် network မှ ချိတ်ဆက်ထားသော persistent block storage (OS drive)။
- **Instance Store:** EC2 physical host ပေါ်ရှိ ultra-high IOPS ephemeral SSD (Instance ရပ်တန့်ပါက data ပျက်စီးသည်)။

### 3. Architecture & Request Flow
```
[ Internet Users ] ---> [ Internet Gateway ] ---> [ Public Subnet: Bastion / ALB ]
                                                              │
                                            Private IP Routing via Security Group
                                                              ▼
                                            [ Private Subnet: EC2 Instance (App) ]
                                            └── Attached: Amazon EBS (gp3 Volume)
```

### 4. How it works
1. **Launch Template:** AMI, Instance Type, Key Pair, Security Group နှင့် User Data script ကို သတ်မှတ်သည်။
2. **User Data Bootstrap:** Instance စတင် launch ဖြစ်ချိန်တွင် Nginx/PHP သွင်းခြင်းနှင့် configuration ဆွဲတင်ခြင်းကို root user ဖြင့် တစ်ကြိမ် run ပေးသည်။
3. **Nitro Hypervisor:** Lightweight hypervisor က EC2 instance ကို host hardware ပေါ်တွင် လုံခြုံစွာ ခွဲခြား run ပေးသည်။

### 5. Use Cases
- Production Laravel, Node.js, Spring Boot Web Applications run ခြင်း။
- Custom C++ daemon သို့မဟုတ် proprietary legacy enterprise software များ run ခြင်း။
- High-Performance Computing (HPC) နှင့် Batch processing jobs များ run ခြင်း။

### 6. Advantages, Disadvantages & Limitations
- **Advantages:** Full root access ရရှိခြင်း၊ OS kernel နှင့် packages များကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ခြင်း၊ Spot instances ဖြင့် စရိတ် ၉၀% လျှော့ချနိုင်ခြင်း။
- **Disadvantages:** OS updates, security patching နှင့် scaling များကို engineer က တာဝန်ယူရခြင်း (IaaS model)။
- **Limitations:** Single EC2 instance သည် hardware failure ဖြစ်ပါက down သွားနိုင်သဖြင့် Multi-AZ ASG ဖြင့် run ရမည်။

### 7. Comparison: EC2 vs ECS vs Lambda
| အင်္ဂါရပ် | Amazon EC2 | Amazon ECS (Fargate) | AWS Lambda |
| :--- | :--- | :--- | :--- |
| **Model** | Infrastructure as a Service (IaaS) | Container as a Service (CaaS) | Function as a Service (FaaS) |
| **Management** | OS patching, capacity ကိုယ်တိုင် လုပ်ရသည် | Container image သာ စီမံရသည် | Code သီးသန့် (Serverless) |
| **Startup Time** | ၁ မိနစ်မှ ၂ မိနစ် | စက္ကန့်ပိုင်း (Containers) | မီလီစက္ကန့်ပိုင်း (Cold start < 1s) |

### 8. Hands-on Lab: EC2 Web Server Launch via AWS CLI
```bash
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.micro \
    --key-name my-tokyo-key \
    --security-group-ids sg-0123456789abcdef0 \
    --subnet-id subnet-0123456789abcdef0 \
    --user-data file://bootstrap.sh \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=prod-web-server}]'
```

### 9. Security, Monitoring, Troubleshooting & Cost
- **Security:** SSH Port 22 ကို internet သို့ မဖွင့်ပါနှင့်။ **AWS Systems Manager (SSM) Session Manager** ဖြင့် Port-less လုံခြုံစွာ login ဝင်ပါ။
- **Monitoring:** CloudWatch CPUUtilization, StatusCheckFailed_Instance (OS issue), StatusCheckFailed_System (AWS hardware issue)။
- **Troubleshooting:**
  - `StatusCheckFailed_System`: Stop and Start ပြုလုပ်ပါ (Host hardware ပြောင်းသွားမည်)။
  - `Permission Denied (publickey)`: Key Pair mismatch သို့မဟုတ် file permission `chmod 400` မဟုတ်ခြင်း။
- **Cost:** 24/7 production instances များအတွက် **Savings Plans (၁ နှစ် သို့မဟုတ် ၃ နှစ်)** ဝယ်ယူပါက ၇၂% အထိ စရိတ်သက်သာသည်။

### 10. AWS SAA-C03 Exam Notes & Quiz
> **Exam Tip:** Spot Instances များသည် 2-minute interruption notice ပေးသည်။ Batch processing, fault-tolerant workloads များအတွက်သာ သင့်တော်ပြီး critical databases များတွင် လုံးဝ မသုံးရပါ။
> 
> **Quiz:** EC2 Instance တစ်ခုတွင် StatusCheckFailed_System တက်နေပါက အမြန်ဆုံး ဖြေရှင်းနည်းမှာ အဘယ်နည်း?  
> **အဖြေ:** Instance ကို Stop လုပ်ပြီး Start ပြန်လုပ်ပါ (AWS physical host အသစ်သို့ ရွှေ့ပြောင်းသွားမည်)။

---

## 2. AWS VPC (Virtual Private Cloud) & 3-Tier Architecture

### 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ
**Amazon VPC** သည် သင်၏ AWS resources များကို အခြား customer များနှင့် သီးခြားခွဲထုတ်ထားသော သင်ပိုင် **Isolated Private Virtual Network** ဖြစ်ပါသည်။ IP address range (CIDR), Subnets, Route Tables, Gateways များကို ကိုယ်တိုင် စိတ်ကြိုက် ဒီဇိုင်းဆွဲခွင့် ရရှိပါသည်။

### 2. Key Components
- **VPC CIDR Block:** ဥပမာ `10.0.0.0/16` (IP ပေါင်း 65,536 ခု ရရှိသည်)။
- **Subnets:**
  - **Public Subnet:** Internet Gateway သို့ တိုက်ရိုက် route ရှိသော subnet (ALB, Bastion)။
  - **Private Subnet:** Internet သို့ တိုက်ရိုက်လမ်းကြောင်း မရှိသော subnet (App Servers, Backend)။
  - **Database Subnet (Isolated):** Outbound internet ပါ မရှိသော သီးသန့် subnet (RDS, Aurora)။
- **Internet Gateway (IGW):** VPC နှင့် Public Internet အကြား 2-way communication တံခါးပေါက်။
- **NAT Gateway:** Private subnet ရှိ instance များ internet သို့ outbound updates သွားယူနိုင်ပြီး အပြင်မှ private ထဲသို့ ဝင်မလာနိုင်အောင် ကာကွယ်ပေးသော 1-way gateway။
- **Route Table (RT):** Network packets များ မည်သည့်နေရာသို့ သွားရမည်ကို ညွှန်ကြားသည့် စည်းမျဉ်းစာရင်း။

### 3. Architecture: Production 3-Tier Multi-AZ VPC
```
+-----------------------------------------------------------------------------------------+
|                                Amazon VPC (10.0.0.0/16)                                 |
|                                                                                         |
|   +----------------------- AZ 1a -----------------------+ +--------- AZ 1c ---------+   |
|   | Public Subnet (10.0.1.0/24)                         | | Public Subnet           |   |
|   | └── [ Application Load Balancer ] ──> [ IGW ]       | | └── [ ALB Replica ]     |   |
|   | └── [ NAT Gateway 1 ]                               | |                         |   |
|   +-----------------------------------------------------+ +-------------------------+   |
|                                                                                         |
|   +----------------------- AZ 1a -----------------------+ +--------- AZ 1c ---------+   |
|   | Private App Subnet (10.0.10.0/24)                   | | Private App Subnet      |   |
|   | └── [ EC2 / ECS App Server ]                        | | └── [ EC2 / ECS App ]   |   |
|   |      (Default Route -> NAT Gateway 1)               | |                         |   |
|   +-----------------------------------------------------+ +-------------------------+   |
|                                                                                         |
|   +----------------------- AZ 1a -----------------------+ +--------- AZ 1c ---------+   |
|   | Isolated DB Subnet (10.0.20.0/24)                   | | Isolated DB Subnet      |   |
|   | └── [ Amazon Aurora Primary ] <======Replication====> | └── [ Aurora Replica ]  |   |
|   +-----------------------------------------------------+ +-------------------------+   |
+-----------------------------------------------------------------------------------------+
```

### 4. How it works
1. Client request သည် Internet Gateway မှတစ်ဆင့် Public Subnet ရှိ ALB သို့ ရောက်ရှိသည်။
2. ALB သည် SSL/TLS ကို ဖြုတ် (terminate) ပြီး Private Subnet ရှိ App Server သို့ forward လုပ်သည်။
3. App Server သည် Isolated Subnet ရှိ Database သို့ private IP ဖြင့် query လုပ်ပြီး ပြန်လည်ဖြေကြားသည်။

### 5. Use Cases
- လုပ်ငန်းခွင်သုံး PCI-DSS, HIPAA လိုက်နာရသော လုံခြုံရေးမြင့် Enterprise Web Applications များ။
- On-premises Data Center နှင့် AWS အကြား Direct Connect သို့မဟုတ် Site-to-Site VPN ချိတ်ဆက်ခြင်း။

### 6. Advantages, Disadvantages & Limitations
- **Advantages:** Complete network isolation၊ Security Groups နှင့် Network ACLs ဖြင့် အလွှာနှစ်ထပ် ကာကွယ်နိုင်ခြင်း။
- **Disadvantages:** Subnet CIDR တွက်ချက်မှု မှားယွင်းပါက နောက်ပိုင်း IP မလုံလောက်သည့် ပြဿနာ ဖြစ်တတ်သည်။
- **Limitations:** VPC CIDR တစ်ခုတွင် အနည်းဆုံး `/28` (16 IPs) မှ အများဆုံး `/16` (65,536 IPs) သာ ခွင့်ပြုသည်။ AWS က subnet တိုင်းတွင် IP ၅ ခုကို အမြဲ reserve လုပ်ထားသည်။

### 7. Comparison: Security Group vs Network ACL (NACL)
| အင်္ဂါရပ် | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operates at** | Instance / ENI level (Virtual Firewall) | Subnet level (Boundary Firewall) |
| **State** | **Stateful** (Inbound ခွင့်ပြုလျှင် Outbound အလိုအလျောက် ပွင့်သည်) | **Stateless** (Inbound နှင့် Outbound နှစ်ခုလုံး manual ဖွင့်ရသည်) |
| **Rules Support** | **ALLOW rules သာ** ရေးနိုင်သည် (Deny မရပါ) | **ALLOW နှင့် DENY rules** နှစ်မျိုးလုံး ရေးနိုင်သည် |
| **Rule Processing** | Rules အားလုံးကို တစ်ပြိုင်နက် evaluate လုပ်သည် | Rule Number (100, 200) အလိုက် အစဉ်အတိုင်း စစ်သည် |

### 8. Hands-on Lab: VPC Creation with AWS CLI
```bash
# 1. Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]'

# 2. Enable DNS Hostnames
aws ec2 modify-vpc-attribute --vpc-id vpc-01234567 --enable-dns-hostnames '{"Value": true}'

# 3. Create Internet Gateway & Attach
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]'
aws ec2 attach-internet-gateway --vpc-id vpc-01234567 --internet-gateway-id igw-01234567
```

### 9. Security, Monitoring & Troubleshooting
- **VPC Flow Logs:** VPC အတွင်း ဖြတ်သန်းသွားသော network traffic (Accepted & Rejected IPs) များကို CloudWatch Logs သို့မဟုတ် S3 သို့ သိမ်းဆည်းစစ်ဆေးနိုင်သည်။
- **Troubleshooting:** Private subnet ရှိ instance က internet မထွက်နိုင်ပါက Route Table တွင် `0.0.0.0/0 -> nat-gateway-id` ပါမပါ စစ်ဆေးပါ။

### 10. AWS SAA-C03 Exam Notes & Quiz
> **Exam Trap:** "Specific IP address တစ်ခုကို block လုပ်ချင်သည်" ဆိုပါက Security Group တွင် Deny ရေး၍ မရပါ။ **Network ACL (NACL) Deny Rule** ကို သုံးရမည်။
> 
> **Quiz:** Subnet တစ်ခုလျှင် `/24` CIDR သတ်မှတ်ပါက usable IP address မည်မျှ ရရှိမည်နည်း?  
> **အဖြေ:** 251 IPs (256 - 5 reserved IPs by AWS = 251)။

---

## 3. AWS IAM (Identity & Access Management)

### 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ
**AWS IAM** သည် AWS account အတွင်းရှိ resources များကို မည်သူက (Authentication)၊ မည်သည့် လုပ်ပိုင်ခွင့်ဖြင့် (Authorization) သုံးစွဲခွင့်ရှိကြောင်း စီမံပေးသော **Global Security Foundation Service** ဖြစ်ပါသည်။

### 2. Key Components
- **IAM Users:** လူပုဂ္ဂိုလ်တစ်ဦးချင်းစီအတွက် Account (Username/Password, MFA)။
- **IAM Groups:** Users များကို စုစည်းထားသော အဖွဲ့ (ဥပမာ Developers, Admins)။
- **IAM Roles:** လူမဟုတ်သော AWS Services များ (EC2, Lambda) သို့မဟုတ် ပြင်ပ Identity Providers (Okta, Azure AD) များ ယာယီ access ရယူရန် အသုံးပြုသည့် temporary credentials (`sts:AssumeRole`)။
- **IAM Policies:** လုပ်ပိုင်ခွင့်များကို JSON ဖြင့် သတ်မှတ်ထားသော စာရွက်စာတမ်း (`Effect`, `Action`, `Resource`, `Condition`)။

### 3. Architecture: Principle of Least Privilege
```
[ Developer / CLI ] ---> [ IAM Policy: ReadOnlyS3 ] ---> [ S3: List & Get ALLOW ]
                                                    ---> [ S3: Delete DENY ]
[ EC2 Instance Profile ] ===(AssumeRole STS)===> [ S3 Bucket: Read/Write Access ]
```

### 4. How it works: Policy Evaluation Logic
1. Default အနေဖြင့် access အားလုံးသည် **Implicit DENY** ဖြစ်သည်။
2. Policy ထဲတွင် **Explicit ALLOW** ပါရှိမှသာ ခွင့်ပြုသည်။
3. အကယ်၍ မည်သည့်နေရာတွင်မဆို **Explicit DENY** တစ်ခုပါရှိပါက ကျန်ရှိသော ALLOW များ အားလုံးကို override လုပ်၍ access ကို ပိတ်ပစ်သည်။

### 5. Use Cases
- EC2 instance ပေါ်တွင် hardcoded AWS Access Key လုံးဝ မထည့်ဘဲ **IAM Instance Profile (Role)** ဖြင့် S3 bucket သို့ data ပို့ခြင်း။
- Multi-Account Organization များတွင် **Service Control Policies (SCPs)** ဖြင့် account အားလုံး၏ security guardrails သတ်မှတ်ခြင်း။

### 6. Hands-on Lab: IAM Role for EC2
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-company-backup-bucket/*"
    }
  ]
}
```

### 7. Security Best Practices (Japan IT Genba & SAA-C03)
- **Root User ကို နေ့စဉ် အသုံးမပြုပါနှင့်:** MFA တပ်ဆင်ပြီး Credentials များကို lock လုပ်ထားပါ။
- **Never Hardcode Secrets:** Code သို့မဟုတ် EC2 ပေါ်တွင် Access Key/Secret Key မသိမ်းပါနှင့်။ **IAM Roles** ကိုသာ သုံးပါ။
- **Rotate Credentials:** Access Keys များကို အနည်းဆုံး ရက်ပေါင်း ၉၀ တိုင်း rotate ပြုလုပ်ပါ။

---

## 4. Elastic Load Balancing (ALB & NLB) & Auto Scaling

### 1. What is it?
- **Application Load Balancer (ALB):** OSI Layer 7 (HTTP/HTTPS) အဆင့်တွင် Host/Path-based routing, SSL termination, WebSocket နှင့် redirect စွမ်းရည်များဖြင့် traffic ဝေမျှပေးသော load balancer။
- **Network Load Balancer (NLB):** OSI Layer 4 (TCP/UDP/TLS) အဆင့်တွင် ultra-low latency (microseconds) နှင့် millions of RPS ကို handle လုပ်နိုင်ပြီး Static Elastic IP ရရှိသော load balancer။
- **Auto Scaling Group (ASG):** Traffic အတက်အကျပေါ် မူတည်၍ EC2 instances များကို အလိုအလျောက် တိုးမြှင့်ခြင်း/လျှော့ချခြင်း ပြုလုပ်ပေးသော elasticity engine။

### 2. Architecture: HA Load Balancing & ASG
```
[ Users: HTTPS ] ---> [ Route 53: DNS ] ---> [ Application Load Balancer ]
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼ (Health Checks: HTTP 200 OK)                                        ▼
   [ Auto Scaling: EC2 Instance (AZ-1a) ]                                [ EC2 Instance (AZ-1c) ]
   (Target Tracking: Avg CPU = 60%)
```

### 3. Key Concepts & Exam Tips
- **Cross-Zone Load Balancing:** Load balancer သည် target instances များအား AZ အားလုံးသို့ အညီအမျှ ဖြန့်ဝေပေးသည်။ (ALB တွင် default ဖွင့်ထားပြီး အခမဲ့ဖြစ်သည်)။
- **Sticky Sessions (Session Affinity):** User တစ်ဦးတည်းထံမှ request များကို သတ်မှတ်ထားသော cookie သက်တမ်းအတွင်း target instance တစ်ခုတည်းသို့သာ အမြဲ ပို့ဆောင်ပေးသည်။
- **Connection Draining (Deregistration Delay):** Unhealthy သို့မဟုတ် scale-in ဖြစ်သွားသော instance ထဲရှိ လက်ရှိ active connections များကို ပြီးဆုံးအောင် အချိန်ပေး စောင့်ဆိုင်းခြင်း (Default: 300s)။

---

## 5. Amazon S3 & CloudFront (Global CDN)

### 1. What is it?
- **Amazon S3:** 11 9s (99.999999999%) data durability ရှိသော Unlimited Object Storage ဖြစ်ပြီး static files, videos, backups နှင့် data lakes များအတွက် အသုံးပြုပါသည်။
- **Amazon CloudFront:** ကမ္ဘာတစ်ဝှမ်းရှိ Edge Locations ပေါင်း ၆၀၀ ကျော်မှတစ်ဆင့် static နှင့် dynamic content များကို cache လုပ်၍ latency နည်းပါးစွာ ပို့ဆောင်ပေးသော Global Content Delivery Network (CDN)။

### 2. S3 Storage Classes Matrix
| Storage Class | Durability | Availability | Retrieval Time | Minimum Storage Duration |
| :--- | :---: | :---: | :--- | :--- |
| **S3 Standard** | 11 9s | 99.99% | Milliseconds | None |
| **S3 Intelligent-Tiering** | 11 9s | 99.9% | Milliseconds | None (Auto-moves based on access) |
| **S3 Standard-IA** | 11 9s | 99.9% | Milliseconds | 30 days |
| **S3 One Zone-IA** | 11 9s (Single AZ) | 99.5% | Milliseconds | 30 days |
| **S3 Glacier Flexible** | 11 9s | 99.99% | 1 min to 12 hours | 90 days |
| **S3 Glacier Deep Archive** | 11 9s | 99.99% | 12 to 48 hours | 180 days (Cheapest: $0.00099/GB) |

### 3. S3 + CloudFront Best Practice: OAC (Origin Access Control)
```
[ Users ] ---> [ CloudFront (HTTPS) ] ===(Origin Access Control - OAC)===> [ Amazon S3 Bucket (Private) ]
                                                                           (Block All Public Access: ON)
```
- S3 Bucket ကို Public ဖွင့်စရာမလိုဘဲ CloudFront OAC ဖြင့်သာ bucket policy တွင် allow ပေးထားခြင်းဖြင့် direct S3 access ကို လုံးဝ ပိတ်ပင်နိုင်သည်။

---

## 6. Amazon RDS & Amazon Aurora Databases

### 1. What is it?
- **Amazon RDS:** PostgreSQL, MySQL, MariaDB, Oracle, SQL Server တို့ကို automated backups, patching, Multi-AZ failover ဖြင့် စီမံပေးသော managed relational database။
- **Amazon Aurora:** Cloud-native architecture ဖြင့် MySQL ထက် ၅ ဆ၊ PostgreSQL ထက် ၃ ဆ ပိုမိုမြန်ဆန်ပြီး 6-way storage replication ပါဝင်သော AWS enterprise database။

### 2. Multi-AZ vs Read Replicas (အလွန်အရေးကြီးသော ခွဲခြားချက်)
| အင်္ဂါရပ် | Multi-AZ Deployment | Read Replicas |
| :--- | :--- | :--- |
| **Primary Goal** | **High Availability & Disaster Recovery** | **Read Performance Scalability** |
| **Replication Type** | **Synchronous Replication** (Zero data loss) | **Asynchronous Replication** (Eventual consistency) |
| **Active/Standby** | Standby instance သို့ တိုက်ရိုက် query run မရပါ | Replica instances ထံသို့ `SELECT` queries ခွဲပို့နိုင်သည် |
| **Automatic Failover** | **Yes** (DNS record သည် ၆၀ စက္ကန့်အတွင်း standby သို့ လွှဲပြောင်းသည်) | **No** (Manual သို့မဟုတ် promote to standalone လုပ်ရသည်) |
| **Regions** | Single Region (Across 2 AZs) | Same Region သို့မဟုတ် **Cross-Region** ရရှိသည် |

---

## 7. Amazon ECS with AWS Fargate (Container Architecture)

### 1. What is it?
**Amazon ECS (Elastic Container Service)** သည် Docker containers များကို scale လုပ်၍ စီမံပေးသော AWS native container orchestration platform ဖြစ်သည်။
- **EC2 Launch Type:** EC2 instances များကို cluster အဖြစ် ကိုယ်တိုင် manage လုပ်ရသည်။
- **AWS Fargate (Serverless Launch Type):** EC2 server လုံးဝ မလိုဘဲ Container CPU/RAM ကို သတ်မှတ်လိုက်ရုံဖြင့် AWS က container ကို serverless run ပေးသည်။

### 2. Core Hierarchy: Task Definition -> Task -> Service
```
[ Task Definition (JSON blueprint: Image, CPU/RAM, Port, Logs) ]
                           │
                           ▼
[ ECS Service (Desired Count: 3, ALB Target Group, Auto Scaling) ]
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       [ Fargate Task 1 ] [ Fargate Task 2 ] [ Fargate Task 3 ]
```

---

## 8. AWS Lambda & Amazon API Gateway (Serverless)

### 1. What is it?
- **AWS Lambda:** Server လုံးဝ မလိုဘဲ Event (S3 upload, API call, SQS message) ဖြစ်ပေါ်ချိန်တွင်သာ code ကို sub-second execution run ပေးသော Function-as-a-Service (FaaS)။
- **Amazon API Gateway:** REST, HTTP နှင့် WebSocket APIs များကို traffic throttling, API keys, Cognito authorization တို့ဖြင့် စီမံပေးသော serverless API management tool။

### 2. Lambda Execution Limits & Best Practices
- **Timeout Limit:** အများဆုံး **15 minutes** (900 seconds)။ 15 မိနစ်ထက် ကြာသော jobs များအတွက် **AWS Batch** သို့မဟုတ် **ECS Fargate** သုံးရမည်။
- **Memory & vCPU:** 128 MB မှ 10,240 MB (10 GB) အထိ ရရှိပြီး Memory တိုးလျှင် vCPU ပါ အချိုးကျ တိုးသွားသည်။
- **Ephemeral Storage (`/tmp`):** 512 MB မှ 10,240 MB (10 GB) အထိ ယာယီ file သိမ်းနိုင်သည်။

---

## 9. Infrastructure as Code (Terraform) & CI/CD Pipelines

### 1. Production Terraform Architecture
ဂျပန် Cloud Genba တွင် AWS Console မှ click နှိပ်ဆောက်ခြင်းကို Production တွင် တင်းကျပ်စွာ တားမြစ်ထားပြီး **Terraform** ဖြင့် အောက်ပါ directory standard အတိုင်း ရေးဆွဲကြသည်:

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    ├── vpc/
    ├── alb/
    ├── ecs_fargate/
    └── rds_aurora/
```

### 2. Zero-Downtime CI/CD Flow
```
[ Developer Git Push ] ---> [ GitHub Actions CI ] 
                                  │
                                  ├─ 1. Run Unit Tests & Linting
                                  ├─ 2. Build Docker Image
                                  ├─ 3. Amazon ECR Push (Tag: Git SHA)
                                  └─ 4. Deploy to Amazon ECS Fargate (Rolling Update)
```

---

## 10. Japan Workplace IT (現場) & Production Troubleshooting Runbook

### 1. 現場 (Genba) တွင် မဖြစ်မနေ သုံးရသော ဂျပန် IT စကားလုံးများ
- **障害対応 (Shougai Taiou):** Production စနစ်ချွတ်ယွင်းမှု အရေးပေါ် ဖြေရှင်းခြင်း။
- **一次切り分け (Ichiji Kiriwake):** ပြဿနာ၏ မူလ root cause ကို အလွှာလိုက် (Network, DB, App) ခွဲခြားစစ်ဆေးခြင်း။
- **踏み台サーバー (Fumidai Server):** Private subnet သို့ ဝင်ရောက်ရန် ကြားခံထားသော Bastion Host။
- **設計書 (Sekkeisho):** စနစ်တည်ဆောက်ပုံ နည်းပညာဆိုင်ရာ အသေးစိတ် ဒီဇိုင်းမှတ်တမ်း။

### 2. အဖြစ်အများဆုံး Production Incident ၅ ခု ဖြေရှင်းနည်း
1. **HTTP 502 Bad Gateway:** ALB က backend app ထံမှ response မရရှိခြင်း။ (စစ်ဆေးရန်: ECS Task down နေခြင်း၊ Security Group တွင် ALB IP ကို App က allow မလုပ်ထားခြင်း)။
2. **Database Connection Timeout:** App Server က RDS သို့ ဆက်သွယ်မရခြင်း။ (စစ်ဆေးရန်: RDS Security Group တွင် App Server SG မှ port 3306/5432 ကို ခွင့်မပြုထားခြင်း)။
3. **S3 403 Access Denied:** IAM Role တွင် `s3:GetObject` ခွင့်မရှိခြင်း သို့မဟုတ် S3 Bucket Policy တွင် Explicit Deny ရှိနေခြင်း။
4. **EC2 Disk Full (100%):** Log files များကြောင့် disk ပြည့်သွားခြင်း။ (ဖြေရှင်းရန်: CloudWatch Agent ဖြင့် logs များကို CloudWatch Logs သို့ stream လုပ်ပြီး local log retention ကို ရှင်းလင်းပါ)။
5. **Lambda Cold Start Latency:** ပထမဆုံး request တွင် container initialization ကြောင့် ကြန့်ကြာခြင်း။ (ဖြေရှင်းရန်: **Provisioned Concurrency** ဖွင့်ပါ)။

---

## 🎓 AWS SAA-C03 Real-World Scenario Final Exam Tips

1. **Decouple Applications:** မေးခွန်းတွင် "traffic spike ကြောင့် web app မကျစေရန် buffer ထားလိုသည်" ဆိုပါက **Amazon SQS** ဖြစ်သည်။
2. **Global Low-Latency Static/Dynamic Content:** ကမ္ဘာအနှံ့ latency လျှော့ချရန်အတွက် **Amazon CloudFront** ဖြစ်သည်။
3. **High-Performance Scalable File System:** EC2 instance ရာပေါင်းများစွာမှ တစ်ပြိုင်နက်တည်း access လုပ်နိုင်သော shared storage အတွက် **Amazon EFS** ဖြစ်သည်။
4. **Cost Optimization with Guaranteed Workload:** 24/7 run နေသော Compute အတွက် **Compute Savings Plans** သည် အကောင်းဆုံး ဖြစ်သည်။
5. **Database Multi-Region Disaster Recovery:** RPO နည်းပါးစွာ ဒေသကျော် backup ထားရှိရန် **Amazon Aurora Global Database** (Cross-Region replication < 1 second) ကို ရွေးချယ်ပါ။
