---
title: "AWS Beginner → Advanced Real-Work Course (မြန်မာဘာသာ)"
description: "Target Audience: Beginner to Senior Cloud / DevOps Engineer & Solution Architect"
---

## AWS Beginner → Advanced Real-Work Course (မြန်မာဘာသာ)
### Japan IT Industry & Modern Cloud Web Architecture Production Guide
**Target Audience:** Beginner to Senior Cloud / DevOps Engineer & Solution Architect  
**Language:** မြန်မာဘာသာ (Official English AWS & Japanese IT 現場 Terminology အပြည့်အစုံ ပါဝင်သည်)

---

## မာတိကာ (Table of Contents)

- [၀။ သင်ရိုးညွှန်းတမ်း၏ အဓိကရည်ရွယ်ချက်နှင့် စည်းမျဉ်းများ (Course Mission & Methodology)](#၀-သင်ရိုးညွှန်းတမ်း၏-အဓိကရည်ရွယ်ချက်နှင့်-စည်းမျဉ်းများ)
- [၁။ Japan Cloud Industry Target & Priority Services](#၁-japan-cloud-industry-target--priority-services)
- [၁.၁။ AWS Production Practical Mastery Checklist & Usage Blueprint (လက်တွေ့ လုပ်ငန်းခွင်သုံး မဖြစ်မနေ လမ်းညွှန်)](#၁၁-aws-production-practical-mastery-checklist--usage-blueprint)
  - [၁.၁.၁ Core AWS Services](#၁၁၁-core-aws-services)
  - [၁.၁.၂ Server & Networking](#၁၁၂-server--networking)
  - [၁.၁.၃ Database](#၁၁၃-database)
  - [၁.၁.၄ Storage & File Management](#၁၁၄-storage--file-management)
  - [၁.၁.၅ Deployment & DevOps](#၁၁၅-deployment--devops)
  - [၁.၁.၆ Security](#၁၁၆-security)
  - [၁.၁.၇ Monitoring & Troubleshooting](#၁၁၇-monitoring--troubleshooting)
  - [၁.၁.၈ Advanced Services](#၁၁၈-advanced-services)
  - [၁.၁.၉ Recommended Learning Order (အဆင့် ၁ မှ ၁၂ ထိ စနစ်တကျ လေ့လာရန် လမ်းစဉ်)](#၁၁၉-recommended-learning-order)
- [၂။ Level 1 — Cloud Computing & AWS Fundamentals & Networking Basics](#၂-level-1--cloud-computing--aws-fundamentals--networking-basics)
  - [၂.၁ Cloud Computing ဆိုတာဘာလဲ & On-premises vs Cloud (နှိုင်းယှဉ်ချက် & ဥပမာ)](#၂၁-cloud-computing-ဆိုတာဘာလဲ--on-premises-vs-cloud)
  - [၂.၂ IaaS, PaaS, SaaS ကွာခြားချက်များ & Shared Responsibility Model](#၂၂-iaas-paas-saas-ကွာခြားချက်များ)
  - [၂.၃ Cloud Core Characteristics (Scalability, Elasticity, HA, Fault Tolerance, DR)](#၂၃-cloud-core-characteristics)
  - [၂.၄ Beginner မဖြစ်မနေသိရမည့် Networking အခြေခံများ (IP, CIDR, Port, DNS, HTTP/S, NAT)](#၂၄-beginner-မဖြစ်မနေသိရမည့်-networking-အခြေခံများ)
  - [၂.၅ AWS Global Infrastructure (Region, AZ, Edge Location, Tokyo vs Osaka)](#၂၅-aws-global-infrastructure)
- [၃။ Level 2 — IAM, VPC & EC2 Core Infrastructure](#၃-level-2--iam-vpc--ec2-core-infrastructure)
  - [၃.၁ AWS IAM (Identity & Access Management) - အသေးစိတ်ရှင်းလင်းချက် & Security Rules](#၃၁-aws-iam-identity--access-management)
  - [၃.၂ AWS VPC (Virtual Private Cloud) Networking Deep Dive (3-Tier Architecture)](#၃၂-aws-vpc-virtual-private-cloud-networking-deep-dive)
  - [၃.၃ AWS EC2 (Elastic Compute Cloud) & Linux Administration](#၃၃-aws-ec2-elastic-compute-cloud--linux-administration)
  - [၃.၄ AWS EBS (Elastic Block Store) Storage Types & Snapshots](#၃၄-aws-ebs-elastic-block-store-storage)
- [၄။ Level 3 — High Availability & Scalable Web Frontend](#၄-level-3--high-availability--scalable-web-frontend)
  - [၄.၁ ALB (Application Load Balancer) - Listeners, Routing, Health Checks & Target Groups](#၄၁-alb-application-load-balancer)
  - [၄.၂ Auto Scaling Group (ASG) - Launch Templates & Scaling Policies](#၄၂-auto-scaling-group-asg)
  - [၄.၃ AWS Route 53 (Managed DNS) - Record Types & Routing Policies](#၄၃-aws-route-53-managed-dns)
  - [၄.၄ AWS ACM (Certificate Manager & SSL/TLS HTTPS Setup)](#၄၄-aws-acm-certificate-manager--ssltls)
  - [၄.၅ AWS S3 (Simple Storage Service) - Storage Classes, OAC, Presigned URL & Lifecycle](#၄၅-aws-s3-simple-storage-service--best-practices)
  - [၄.၆ AWS CloudFront (Global CDN & Edge Caching)](#၄၆-aws-cloudfront-global-cdn--oac)
- [၅။ Level 4 — Database & In-Memory Caching](#၅-level-4--database--in-memory-caching)
  - [၅.၁ AWS RDS (Relational Database Service) - Multi-AZ & Read Replicas](#၅၁-aws-rds-relational-database-service)
  - [၅.၂ Amazon Aurora - Enterprise Cloud-Native Distributed Database](#၅၂-amazon-aurora-enterprise-cloud-native-database)
  - [၅.၃ AWS ElastiCache for Redis - Caching Strategies, Sessions & Queues](#၅၃-aws-elasticache-for-redis)
- [၆။ Level 5 — Container Architecture](#၆-level-5--container-architecture)
  - [၆.၁ Docker to AWS Architecture Flow](#၆၁-docker-to-aws-architecture-flow)
  - [၆.၂ AWS ECR (Elastic Container Registry) - Image Scanning & Lifecycle Policies](#၆၂-aws-ecr-elastic-container-registry)
  - [၆.၃ AWS ECS with AWS Fargate - Serverless Containers & Task Definitions](#၆၃-aws-ecs-with-aws-fargate)
- [၇။ Level 6 — Serverless & NoSQL](#၇-level-6--serverless--nosql)
  - [၇.၁ AWS Lambda Deep Dive - Cold Start, Layers, Concurrency & Triggers](#၇၁-aws-lambda-deep-dive)
  - [၇.၂ Amazon API Gateway - REST vs HTTP APIs, Authorizers & Throttling](#၇၂-amazon-api-gateway)
  - [၇.၃ Amazon DynamoDB - NoSQL Modeling, Partition/Sort Keys & Single-Table Design](#၇၃-amazon-dynamodb-nosql-data-modeling)
- [၈။ Level 7 — Asynchronous & Event-Driven Architecture](#၈-level-7--asynchronous--event-driven-architecture)
  - [၈.၁ AWS SQS (Simple Queue Service) - Decoupling, Standard vs FIFO & DLQ](#၈၁-aws-sqs-simple-queue-service)
  - [၈.၂ AWS SNS (Simple Notification Service) - Pub/Sub & Fan-Out Pattern](#၈၂-aws-sns-simple-notification-service)
  - [၈.၃ Amazon EventBridge - Event Bus & Scheduled Automation](#၈၃-amazon-eventbridge)
- [၉။ Level 8 — Production Observability, Auditing & Security](#၉-level-8--production-observability-auditing--security)
  - [၉.၁ Amazon CloudWatch - Metrics, Logs Insights, Alarms & Dashboards](#၉၁-amazon-cloudwatch)
  - [၉.၂ AWS CloudTrail - Governance, Audit Trail & Forensic Investigation](#၉၂-aws-cloudtrail)
  - [၉.၃ AWS Systems Manager (SSM) - Session Manager (No SSH Port 22) & Parameter Store](#၉၃-aws-systems-manager-ssm)
  - [၉.၄ AWS Secrets Manager & AWS KMS - Envelope Encryption & Key Policies](#၉၄-aws-secrets-manager--aws-kms)
  - [၉.၅ AWS WAF & Enterprise Security Services (GuardDuty, Security Hub, Inspector)](#၉၅-aws-waf--enterprise-security-services)
- [၁၀။ Level 9 — Infrastructure as Code (Terraform) & CI/CD Pipelines](#၁၀-level-9--infrastructure-as-code-terraform--cicd-pipelines)
  - [၁၀.၁ Terraform Core Workflow & Production Directory Structure](#၁၀၁-terraform-core-workflow)
  - [၁၀.၂ Complete Production Terraform Code (VPC + ALB + ECS + RDS)](#၁၀၂-complete-terraform-code)
  - [၁၀.၃ CI/CD Workflow: GitHub Actions → ECR → ECS Fargate Zero-Downtime Deploy](#၁၀၃-cicd-workflow)
- [၁၁။ Level 10 — High Availability, Disaster Recovery, Cost (FinOps) & Well-Architected](#၁၁-level-10--high-availability-disaster-recovery-cost-finops--well-architected)
  - [၁၁.၁ High Availability (HA) & Disaster Recovery (DR - RPO/RTO)](#၁၁၁-high-availability--disaster-recovery)
  - [၁၁.၂ FinOps & Cost Optimization Strategies (Graviton, Savings Plans, NAT Optimization)](#၁၁၂-finops--cost-optimization-strategies)
  - [၁၁.၃ AWS Well-Architected Framework (6 Pillars)](#၁၁၃-aws-well-architected-framework-6-pillars)
- [၁၂။ Level 11 — Japanese Workplace IT Vocabulary, Workflow & Ticket Simulation](#၁၂-level-11--japanese-workplace-it-vocabulary-workflow--ticket-simulation)
  - [၁၂.၁ Japanese IT Terminology (現場で必須のIT用語集)](#၁၂၁-japanese-it-terminology)
  - [၁၂.၂ Real-Work Ticket Simulations (現場タスクシミュレーション)](#၁၂၂-real-work-ticket-simulations)
- [၁၃။ Level 12 — Production Troubleshooting Runbook (障害対応マニュアル)](#၁၃-level-12--production-troubleshooting-runbook)
  - [Scenario 1: Website Downtime (アクセス不可・接続タイムアウト)](#scenario-1-website-downtime)
  - [Scenario 2: HTTP 502 Bad Gateway](#scenario-2-http-502-bad-gateway)
  - [Scenario 3: Database Connection Error (DB接続エラー)](#scenario-3-database-connection-error)
  - [Scenario 4: High Latency & Slow Performance (レスポンス遅延)](#scenario-4-high-latency--slow-performance)
  - [Scenario 5: Amazon S3 403 Access Denied](#scenario-5-amazon-s3-403-access-denied)
- [၁၄။ Final Capstone Project — Production Laravel EC Site on AWS](#၁၄-final-capstone-project--production-laravel-ec-site-on-aws)
- [၁၅။ AWS CLI Complete Reference Cheatsheet](#၁၅-aws-cli-complete-reference-cheatsheet)
- [၁၆။ Cloud Engineer Technical Interview Prep (Q&A)](#၁၆-cloud-engineer-technical-interview-prep-qa)

---

# ၀။ သင်ရိုးညွှန်းတမ်း၏ အဓိကရည်ရွယ်ချက်နှင့် စည်းမျဉ်းများ (Course Mission & Methodology)

### Course ရဲ့ ရည်ရွယ်ချက်
ဒီ Course ၏ အဓိကရည်ရွယ်ချက်မှာ AWS service များကို အလွတ်ကျက်မှတ်ရုံမျှသာ မဟုတ်ဘဲ **Japan ရှိ Cloud / Web Application Development လုပ်ငန်းခွင် (現場 - Genba) တွင် တကယ်အသုံးများသည့် AWS Architecture, Service Configurations, Command-line (CLI), Automation (Terraform), Security Best Practices, Troubleshooting (障害対応) နှင့် နေ့စဉ် Operation လုပ်ငန်းစဉ်များ** ကို Beginner အဆင့်မှ Senior Architect အဆင့်အထိ နားလည်ပြီး လက်တွေ့လုပ်ဆောင်နိုင်စေရန် ဖြစ်သည်။

### သင်ကြားပုံ အခြေခံစည်းမျဉ်း (Systematic Teaching Blueprint)
Topic နှင့် Service တိုင်းအတွက် အောက်ပါ standard formula အတိုင်း စနစ်တကျ လေ့လာသင်ယူပါမည်-
1. **ဒီ Service/Concept က ဘာလဲ?** (Concept & Definition)
2. **ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ?** (Problem Statement & Real-world Example)
3. **Japan Cloud/Web Development Company တွေမှာ ဘာကြောင့် သုံးကြတာလဲ?** (Market Context & 現場での採用理由)
4. **ဘယ်အချိန်မှာ သုံးသင့်ပြီး ဘယ်အချိန်မှာ မသုံးသင့်ဘူးလဲ?** (When to Use & When NOT to Use)
5. **Architecture Diagram တွင် မည်သည့်နေရာတွင် ပါဝင်သလဲ?** (Architectural Placement)
6. **အခြား မည်သည့် Service များနှင့် တွဲဖက်အလုပ်လုပ်သလဲ?** (Ecosystem Integration)
7. **AWS Management Console တွင် မည်သို့ Step-by-Step တည်ဆောက်မလဲ?** (Console Steps)
8. **AWS CLI Commands များသည် အဘယ်နည်း?** (CLI Commands with flags & outputs)
9. **Terraform (Infrastructure as Code) ဖြင့် မည်သို့ရေးမလဲ?** (Production Terraform Snippet)
10. **Security & Least Privilege ကို မည်သို့စိစစ်မလဲ?** (Security Best Practice)
11. **Cost (ငွေကြေးကုန်ကျမှု) မည်သို့ဖြစ်လာနိုင်သလဲ?** (Pricing & FinOps)
12. **Monitoring & Logging မည်သို့လုပ်မလဲ?** (CloudWatch & Audit)
13. **Error တက်လာလျှင် မည်သို့ Root Cause ရှာပြီး ဖြေရှင်းမလဲ?** (Troubleshooting Steps)
14. **Production တွင် နေ့စဉ် မည်သို့ Run ရမလဲ?** (Operations Runbook)
15. **Interview မေးခွန်းများနှင့် အဖြေများ** (Technical Interview Prep)
16. **လက်တွေ့ Hands-on Exercise & Verification** (Validation Steps)

---

# ၁။ Japan Cloud Industry Target & Priority Services

ဂျပန် IT လုပ်ငန်းခွင် (SIer - System Integrator ကုမ္ပဏီများနှင့် Web/SaaS 自社開発 Startup များ) တွင် AWS Services များကို တန်းတူအသုံးပြုခြင်း မဟုတ်ပါ။ အောက်ပါအတိုင်း အဆင့်ခွဲခြား အသုံးပြုကြသည်-

```
+-------------------------------------------------------------------------------+
|                      HIGH PRIORITY (မဖြစ်မနေ ကျွမ်းကျင်ရမည်)                       |
| IAM | VPC | EC2 | ALB | Route 53 | ACM | S3 | CloudFront | RDS / Aurora           |
| CloudWatch | CloudTrail | Systems Manager (SSM) | ECR | ECS (Fargate)         |
| Lambda | API Gateway | SQS | SNS | EventBridge | Secrets Manager | KMS         |
| ElastiCache (Redis) | WAF | AWS Backup | Auto Scaling | Cost Explorer         |
+-------------------------------------------------------------------------------+
|                   IMPORTANT NEXT LEVEL (ပိုမိုအဆင့်မြင့်သော Feature များ)           |
| DynamoDB | Step Functions | Cognito | SES | EFS | OpenSearch | AWS Batch       |
| AWS Config | GuardDuty | Security Hub | Inspector | VPC Endpoint / PrivateLink |
+-------------------------------------------------------------------------------+
|               ADVANCED & ARCHITECTURE LEVEL (ခေါင်းဆောင်/Architect အဆင့်)        |
| Multi-AZ / Multi-Region Architecture | Disaster Recovery (RPO/RTO)            |
| Blue/Green & Canary Deployments | Event-Driven & Microservices                 |
| Terraform (IaC) | CI/CD (GitHub Actions / CodePipeline) | Well-Architected     |
+-------------------------------------------------------------------------------+
```

---

# ၁.၁။ AWS Production Practical Mastery Checklist & Usage Blueprint (လက်တွေ့ လုပ်ငန်းခွင်သုံး မဖြစ်မနေ လမ်းညွှန်)

လုပ်ငန်းခွင် (Production / 現場) တွင် တကယ့် Application တစ်ခုကို Cloud ပေါ်တွင် လုံခြုံစိတ်ချစွာ တည်ဆောက်၊ စီမံခန့်ခွဲ၊ Deploy ပြုလုပ်ပြီး ပြဿနာရှာဖွေ (Troubleshoot) နိုင်ရန် မဖြစ်မနေ သိရှိကျွမ်းကျင်ရမည့် အဓိက ကဏ္ဍ (၈) ခုနှင့် အဆင့်ဆင့် လေ့လာသင့်သော လမ်းညွှန်ချက် (Recommended Learning Order) ဖြစ်ပါသည်။

---

## ၁.၁.၁ Core AWS Services

### Amazon EC2 — Virtual Server
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Virtual Server (Compute Instance) ၏ သဘောတရားနှင့် On-premises physical server တို့ ကွာခြားချက်
- Ubuntu / Amazon Linux 2023 Server တည်ဆောက်ခြင်း (AMI, Instance Type: t3.micro/t4g.nano ရွေးချယ်မှု)
- SSH Key Pair (`.pem`) ဖြင့် Server ထဲသို့ Secure Shell ဝင်ရောက်စီမံခြင်း
- Nginx / Apache Web Server တင်ပြီး Node.js, Python သို့မဟုတ် PHP Application များအား Systemd Service ဖြင့် Run ခြင်း
- CPU Utilization, RAM, Disk Usage (EBS), Port (Listening ports) နှင့် Server Syslog/Error Log များကို စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကိုယ့် Application က ဘယ် Operating System နှင့် ဘယ် Server Spec ပေါ်မှာ Background Process အဖြစ် Run နေလဲ၊ ပြဿနာတက်ရင် Server ထဲဝင်ပြီး ဘယ် Log ဖိုင်ကို ကြည့်ရမလဲဆိုတာ ပိုင်နိုင်ရပါမည်။

### Amazon S3 — File & Object Storage
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Object Storage ဆိုသည်မှာဘာလဲနှင့် Block Storage (EBS) တို့ ကွာခြားချက် နားလည်ခြင်း
- S3 Bucket အသစ်ဖန်တီးခြင်း၊ Unique Bucket Naming Rule နှင့် Region ရွေးချယ်မှု
- User Uploaded Files (ပုံများ၊ PDFs၊ Video များ) နှင့် Static Assets များကို Application မှ AWS SDK ဖြင့် သိမ်းဆည်းခြင်း
- Block Public Access (BPA) Setting ဖြင့် Data ပေါက်ကြားမှု မဖြစ်အောင် ပိတ်ထားခြင်း
- S3 Bucket Policy နှင့် IAM Role တို့ဖြင့် Access Control ကန့်သတ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Web Server ၏ Disk (EBS) ပေါ်တွင် User Upload File များကို မသိမ်းဘဲ အကန့်အသတ်မရှိ သိမ်းဆည်းနိုင်ပြီး 99.999999999% (11 9s) Durability ရှိသော S3 သို့ ဘာကြောင့် လွှဲပြောင်းသိမ်းရသလဲဆိုတာ သိရပါမည်။

### Amazon RDS — Managed Database (MySQL, PostgreSQL)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- EC2 ပေါ်တွင် ကိုယ်တိုင် DB တင်သွင်းခြင်းထက် Managed RDS ကို အသုံးပြုရသည့် အကျိုးကျေးဇူးများ
- MySQL / PostgreSQL Engine Setup ပြုလုပ်ခြင်း (DB Instance Class, Storage Autoscaling)
- Private Subnet တွင် ထားရှိပြီး Public IP မပေးဘဲ လုံခြုံရေးယူခြင်း
- Endpoint URL, Port (3306 / 5432) ဖြင့် Web Application မှ ချိတ်ဆက် အသုံးပြုခြင်း
- Automated Daily Backup, Point-in-time Restore နှင့် Multi-AZ High Availability တို့ကို ဖွင့်လှစ်ထားခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Database Server ပျက်စီးသွားပါက ဒေတာမဆုံးရှုံးစေရန် Automated Backup ဘယ်လိုလုပ်သလဲနှင့် Database ကို Internet ပေါ် တိုက်ရိုက်မထုတ်ဘဲ Application ကသာ လှမ်းချိတ်နိုင်အောင် ဘယ်လိုကာကွယ်ရမလဲဆိုတာ ဖြစ်သည်။

### Amazon VPC — Cloud Network
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ကိုယ်ပိုင် သီးသန့် Cloud Data Center အဖြစ် VPC ဖန်တီးခြင်း (ဥပမာ- `10.0.0.0/16`)
- Public Subnet (ပြင်ပ Internet နှင့် ထိတွေ့မည့်နေရာ) နှင့် Private Subnet (DB နှင့် Backend အတွက် သီးသန့်နေရာ) ခွဲခြားခြင်း
- Internet Gateway (IGW) တပ်ဆင်ပြီး Public Route Table ချိတ်ဆက်ခြင်း
- Private Subnet အတွက် NAT Gateway ထိုင်ပြီး Outbound Internet ပေးခြင်း
- CIDR Notation, IP Range တွက်ချက်မှုနှင့် Availability Zone အလိုက် Subnet ခွဲဝေမှု
> **💡 နားလည်ရမယ့်အချက်** — AWS ပေါ်ရှိ Server တိုင်းသည် မည်သည့် Network အခန်းအနားထဲတွင် ရှိနေပြီး ပြင်ပကမ္ဘာမှ တိုက်ရိုက်ဝင်ရောက်ခွင့် ရှိ/မရှိကို VPC က ချုပ်ကိုင်ထားသည်ကို သိရှိခြင်း ဖြစ်သည်။

### AWS IAM — Users, Roles & Permissions
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Root Account ကို နေ့စဉ်မသုံးဘဲ သီးသန့် IAM User ဖန်တီးကာ MFA (Multi-Factor Authentication) မဖြစ်မနေ ဖွင့်ခြင်း
- IAM Policy (JSON) ရေးသားခြင်း (Effect: Allow/Deny, Action, Resource)
- Principle of Least Privilege (အနည်းဆုံး လိုအပ်သော အခွင့်အရေးသာ ပေးခြင်း)
- EC2 သို့မဟုတ် ECS Service များအတွက် IAM Role သတ်မှတ်ပေးခြင်း (Access Key Hardcode မလုပ်ရ)
- Access Key ID နှင့် Secret Access Key ကို လုံခြုံစွာ စီမံခန့်ခွဲခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Cloud လောကတွင် လုံခြုံရေးသည် နံပါတ် (၁) ဖြစ်ပြီး၊ မည်သူက (User)၊ မည်သည့် Service က (Role)၊ မည်သည့် Resource ကို မည်သို့ လုပ်ပိုင်ခွင့်ရှိသလဲဆိုတာကို IAM က အပြည့်အဝ ထိန်းချုပ်ထားသည်။

### Amazon CloudFront — CDN & Caching
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Content Delivery Network (CDN) ၏ သဘောတရားနှင့် Global Edge Locations အကြောင်း
- S3 Bucket သို့မဟုတ် ALB ကို Origin အဖြစ် ချိတ်ဆက်ပြီး Static Assets များကို Cache လုပ်ခြင်း
- Origin Access Control (OAC) ဖြင့် S3 ကို တိုက်ရိုက် မဝင်နိုင်အောင် ကာကွယ်ပြီး CloudFront မှသာ ပေးဝင်ခြင်း
- Cache Invalidation (`/*`) ပြုလုပ်၍ Code Update ဖြစ်တိုင်း File အသစ် ချက်ချင်း ပြသနိုင်စေခြင်း
- Custom Domain Name နှင့် Free SSL (ACM) ပူးတွဲ တပ်ဆင်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကမ္ဘာအရပ်ရပ်မှ User များ Web Page ကို မျက်စိတစ်မှိတ်အတွင်း မြန်ဆန်စွာ ဖွင့်နိုင်စေရန်နှင့် မူရင်း Server ပေါ် Request ဝန်ထုပ်ဝန်ပိုး မကျရောက်စေရန် Edge Server တွင် သိမ်းဆည်းပြသပေးခြင်း ဖြစ်သည်။

### Elastic Load Balancing (ALB) — Distribute Traffic
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Application Load Balancer (Layer 7) ၏ လုပ်ဆောင်ချက်
- Target Group ဖန်တီးခြင်းနှင့် Backend EC2 / Container များသို့ Traffic မျှဝေပို့ဆောင်ခြင်း (Round Robin)
- HTTP (Port 80) မှ HTTPS (Port 443) သို့ အလိုအလျောက် Redirect ပြုလုပ်သည့် Listener Rule ရေးဆွဲခြင်း
- Path-based Routing (ဥပမာ- `/api/*` ကို Backend သို့၊ `/*` ကို Frontend သို့) သတ်မှတ်ခြင်း
- Target Health Check (`/healthz` or `/`) ဖြင့် Server ကောင်း/မကောင်း စဉ်ဆက်မပြတ် စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — User များ၏ Request ပေါင်း ထောင်သောင်းချီကို Server အများအပြားဆီ ဝန်မျှဝေပေးပြီး၊ Server တစ်လုံး ပျက်စီးသွားပါက Traffic ကို ကျန်ရှိသော Server ကောင်းများဆီ အလိုအလျောက် လွှဲပေးနိုင်ရန် ဖြစ်သည်။

### Amazon CloudWatch — Logs, Metrics & Monitoring
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- CloudWatch Metrics ဖြင့် EC2 CPU Utilization, Network In/Out, Disk I/O များကို Graph ဖြင့် စောင့်ကြည့်ခြင်း
- CloudWatch Logs Agent (Unified Agent) ဖြင့် Nginx Access/Error Logs နှင့် App Logs များကို Cloud ပေါ်သို့ တင်ပို့သိမ်းဆည်းခြင်း
- Metric Alarm သတ်မှတ်ခြင်း (ဥပမာ- CPU > 80% ဖြစ်ပါက သို့မဟုတ် 5xx Error များလာပါက)
- CloudWatch Alarms မှတစ်ဆင့် Amazon SNS ဖြင့် Slack သို့မဟုတ် Email သို့ သတိပေးချက် (Alert) ပို့ဆောင်ခြင်း
- CloudWatch Logs Insights ဖြင့် Query ရေးသားကာ Error Logs များကို ရှာဖွေစစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server ပျက်စီးခြင်း သို့မဟုတ် Application Error တက်ခြင်းကို User မတိုင်ကြားမီ Cloud Engineer က အချိန်နှင့်တပြေးညီ ကြိုတင်သိရှိပြီး ပြုပြင်နိုင်ရန် စောင့်ကြည့်စနစ် ထားရှိခြင်း ဖြစ်သည်။

### Amazon Route 53 — Domain & DNS
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- DNS (Domain Name System) ၏ သဘောတရားနှင့် Domain ဝယ်ယူ/လွှဲပြောင်းခြင်း
- Hosted Zone ဖန်တီးခြင်းနှင့် Nameservers (NS Records) ချိတ်ဆက်မှု နားလည်ခြင်း
- A Record, CNAME Record, MX Record များ ထည့်သွင်းခြင်း
- AWS Alias Record (A Record Alias) ဖြင့် CloudFront Distribution သို့မဟုတ် ALB သို့ IP မလိုဘဲ ချိတ်ဆက်ခြင်း
- DNS Health Checks နှင့် Routing Policies (Simple, Failover, Latency-based)
> **💡 နားလည်ရမယ့်အချက်** — လူသားများ မှတ်သားရလွယ်သော နာမည် (`example.com`) ကို ကွန်ပျူတာနားလည်သည့် IP Address သို့မဟုတ် AWS Resource များဆီ အမှားအယွင်းမရှိ လမ်းကြောင်းညွှန်ပြပေးရန် ဖြစ်သည်။

### AWS Certificate Manager (ACM) — SSL/TLS Certificates
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- SSL/TLS ၏ သဘောတရားနှင့် Web Security (HTTP vs HTTPS ကွာခြားချက်)
- Public Certificate အခမဲ့ Request ပြုလုပ်ခြင်း (`*.yourdomain.com` Wildcard အပါအဝင်)
- DNS Validation နည်းလမ်းဖြင့် Route 53 ပေါ်တွင် CNAME Record ထည့်သွင်းကာ Domain ပိုင်ဆိုင်မှု အတည်ပြုခြင်း
- Certificate ကို ALB သို့မဟုတ် CloudFront တွင် တပ်ဆင်အသုံးပြုခြင်း
- AWS မှ Auto-renewal (သက်တမ်း အလိုအလျောက် တိုးပေးခြင်း) အလုပ်လုပ်ပုံကို နားလည်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ဝဘ်ဆိုဒ်ကို လုံခြုံသော သော့ခတ်ပုံစံ (Green Padlock / HTTPS) ဖြစ်စေရန်နှင့် Data များကို လမ်းခုလတ်မှ ကြားဖြတ်မခိုးယူနိုင်စေရန် အခမဲ့ SSL လက်မှတ် ထုတ်ယူတပ်ဆင်ခြင်း ဖြစ်သည်။

---

## ၁.၁.၂ Server & Networking

### Linux Server Basics
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Linux File Hierarchy (`/var/log`, `/etc/nginx`, `/home/ubuntu`, `/tmp`)
- အခြေခံ မရှိမဖြစ် Commands များ (`ls -la`, `cd`, `pwd`, `cat`, `grep`, `tail -f`, `chmod`, `chown`, `sudo`)
- Package Management (`apt update && apt install -y` or `dnf / yum`)
- Process နှင့် Resource စစ်ဆေးခြင်း (`ps aux`, `top`, `htop`, `df -h`, `free -m`)
- Systemd Service စီမံခန့်ခွဲခြင်း (`systemctl start/stop/restart/status`, `journalctl -u <service> -f`)
> **💡 နားလည်ရမယ့်အချက်** — Cloud ပေါ်ရှိ Production Server ၉၅% ကျော်သည် Linux ဖြင့် လည်ပတ်နေသဖြင့် Terminal မှတစ်ဆင့် Server ကို အဆင်ပြေပြေ ထိန်းချုပ်ခိုင်းစေနိုင်ရပါမည်။

### SSH Connection
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Public Key Cryptography သဘောတရား (Private Key `.pem` vs Public Key `authorized_keys`)
- Terminal / PuTTY မှတစ်ဆင့် SSH ဝင်ရောက်ခြင်း (`ssh -i key.pem ubuntu@<Public-IP>`)
- Key File Permission သတ်မှတ်ခြင်း (`chmod 400 key.pem`) — Permission မှားပါက SSH ငြင်းပယ်ခံရခြင်း
- SSH Port 22 လုံခြုံရေး (Default Port ပြောင်းခြင်း သို့မဟုတ် Security Group ဖြင့် ကိုယ့် IP သာ ဖွင့်ပေးခြင်း)
- Bastion Host (Jump Server) သဘောတရားနှင့် AWS Systems Manager (SSM) Session Manager သို့ ပြောင်းလဲအသုံးပြုခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကမ္ဘာ့မည်သည့်နေရာမှမဆို မိမိ၏ Cloud Server အတွင်းသို့ လုံခြုံစိတ်ချစွာ Secure Shell ဖြင့် Login ဝင်ရောက် ပြုပြင်ထိန်းသိမ်းနိုင်ခြင်း ဖြစ်သည်။

### Public IP & Private IP
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Private IP Address (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) ၏ သဘောတရား
- Public IP Address (Internet ပေါ်တွင် တိုက်ရိုက်ခေါ်ဆိုနိုင်သော IP)
- Dynamic Public IP (EC2 Reboot/Stop လုပ်ပါက ပြောင်းလဲသွားခြင်း)
- Elastic IP (EIP) — ပြောင်းလဲမှုမရှိသော Static Public IPv4 ရယူခြင်းနှင့် အခကြေးငွေ ကောက်ခံပုံ
- Server များ အချင်းချင်း VPC အတွင်း Private IP ဖြင့်သာ ဆက်သွယ်သင့်သည့် အကြောင်းရင်း (Latency နည်းပြီး လုံခြုံမှုရှိခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — မည်သည့် Server က အပြင် Internet နှင့် တိုက်ရိုက်ထိတွေ့ခွင့်ရှိပြီး၊ မည်သည့် Server က အတွင်းကွန်ရက်သီးသန့် (Private) ထားရှိရမည်ကို IP အဆင့်မှ ခွဲခြားသိမြင်ခြင်း ဖြစ်သည်။

### Public Subnet & Private Subnet
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Subnet ဆိုသည်မှာ VPC ကွန်ရက်ကြီးကို Availability Zone အလိုက် အခန်းငယ်များ ခွဲထုတ်ထားခြင်း ဖြစ်ကြောင်း သိရှိခြင်း
- Public Subnet ၏ ဝိသေသလက္ခဏာ (Route Table တွင် `0.0.0.0/0 -> Internet Gateway` သို့ ညွှန်ထားခြင်း)
- Private Subnet ၏ ဝိသေသလက္ခဏာ (Internet Gateway သို့ တိုက်ရိုက်လမ်းကြောင်း မရှိဘဲ NAT Gateway သို့သာ ညွှန်ခြင်း သို့မဟုတ် လုံးဝ လမ်းမရှိခြင်း)
- 3-Tier Web Architecture အခင်းအကျင်း (Public Subnet: ALB/NAT | Private Subnet: App Servers | Isolated Private Subnet: Database)
- Subnet တစ်ခုစီအတွက် သင့်လျော်သော CIDR Block သတ်မှတ်ခြင်း (ဥပမာ- `/24` = 251 usable IPs)
> **💡 နားလည်ရမယ့်အချက်** — Database နှင့် အရေးကြီးသော Business Logic များကို Public Subnet ပေါ် တင်မထားဘဲ Private Subnet ထဲတွင် ဝှက်ထားရမည့် မဟာဗျူဟာကို နားလည်ခြင်း ဖြစ်သည်။

### Internet Gateway (IGW)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Internet Gateway ဆိုသည်မှာ VPC နှင့် အပြင်ဘက် Public Internet အကြား တံတားဖြစ်ကြောင်း နားလည်ခြင်း
- VPC တစ်ခုတွင် IGW တစ်ခုသာ Attach လုပ်ခွင့်ရှိခြင်း
- Horizontal Scalable, Redundant နှင့် Highly Available ဖြစ်ပြီး AWS မှ အပြည့်အဝ စီမံခန့်ခွဲပေးထားခြင်း
- Public Subnet Route Table တွင် Default Route `0.0.0.0/0 -> igw-xxxx` အဖြစ် ထည့်သွင်းခြင်း
- IGW ရှိရုံဖြင့် မလုံလောက်ဘဲ Instance တွင် Public IP ရှိရမည်ဖြစ်ပြီး Security Group ကလည်း ခွင့်ပြုထားရမည်ဖြစ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — VPC အတွင်းရှိ Server များသည် ပြင်ပ Internet သို့ ထွက်နိုင်ရန် သို့မဟုတ် ပြင်ပမှ လှမ်းဝင်နိုင်ရန် တံခါးမကြီး (Front Gate) တပ်ဆင်ပေးရခြင်း ဖြစ်သည်။

### NAT Gateway
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Network Address Translation (NAT) ၏ သဘောတရား (Private IPs များကို NAT Gateway ၏ Public IP အဖြစ် ပြောင်းလဲပေးခြင်း)
- NAT Gateway ကို **Public Subnet** တွင် တည်ဆောက်ရပြီး Elastic IP (EIP) တစ်ခု မဖြစ်မနေ လိုအပ်ခြင်း
- Private Subnet ရှိ Route Table တွင် `0.0.0.0/0 -> nat-xxxx` သို့ လမ်းကြောင်းပေးခြင်း
- One-way Outbound Traffic သာ ခွင့်ပြုခြင်း (Private Server မှ `apt update`, GitHub clone, External API ခေါ်ဆိုမှုများ ပြုလုပ်နိုင်သော်လည်း အပြင်မှ Private Server သို့ တိုက်ရိုက်လှမ်းဝင်၍ မရနိုင်ခြင်း)
- Multi-AZ NAT Gateway တည်ဆောက်မှုနှင့် Cost Optimization (NAT GW သည် တစ်နာရီလျှင် ငွေကျသင့်သဖြင့် စနစ်တကျ သုံးစွဲရန်လိုခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — Private Subnet ရှိ Database သို့မဟုတ် Backend App များသည် OS Update တင်ရန်နှင့် အပြင် API လှမ်းခေါ်ရန် Internet လိုအပ်သော်လည်း အပြင်လူ လုံးဝ မဝင်လာနိုင်အောင် တစ်ဖက်သတ် တံခါးပေါက် ထားရှိခြင်း ဖြစ်သည်။

### Route Tables
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Route Table ၏ လုပ်ဆောင်ချက် (VPC အတွင်း Packet များ မည်သည့် Target ဆီသို့ သွားရမည်ကို ဆုံးဖြတ်ပေးသော လမ်းညွှန်ဆိုင်းဘုတ်)
- Local Route (`10.0.0.0/16 -> local`) ၏ အခန်းကဏ္ဍ (VPC အတွင်း Subnet အချင်းချင်း အလိုအလျောက် သွားလာနိုင်ခြင်း)
- Default Route (`0.0.0.0/0`) ကို IGW သို့မဟုတ် NAT GW သို့ ချိန်ညှိခြင်း
- Explicit Subnet Association (မည်သည့် Subnet သည် မည်သည့် Route Table နှင့် ချိတ်ဆက်မည်ကို တိကျစွာ သတ်မှတ်ခြင်း)
- Main Route Table vs Custom Route Table ကွာခြားချက်
> **💡 နားလည်ရမယ့်အချက်** — Network ပေါ်တွင် ပို့လိုက်သော Data များ မည်သည့်လမ်းကြောင်းအတိုင်း စီးဆင်းသွားရမည်ကို Route Table က တိကျစွာ လမ်းပြပေးနေခြင်း ဖြစ်သည်။

### Security Groups (SG)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Stateful Firewall ဖြစ်ကြောင်း နားလည်ခြင်း (Inbound ခွင့်ပြုထားပါက Outbound သည် အလိုအလျောက် ပွင့်ပြီးဖြစ်ခြင်း)
- Inbound Rules (မည်သည့် Port, Protocol နှင့် မည်သည့် Source IP ကို ခွင့်ပြုမည်)
- Outbound Rules (Default အားဖြင့် `0.0.0.0/0` အကုန် ထွက်ခွင့်ပြုထားခြင်း)
- Security Group Chaining / Referencing (ဥပမာ- Database SG တွင် EC2 SG ID ကို Source အဖြစ် ထည့်သွင်း၍ EC2 မှသာ DB သို့ ဝင်ခွင့်ပြုခြင်း)
- Instance Level Firewall ဖြစ်ပြီး Subnet အဆင့် မဟုတ်ကြောင်း သိရှိခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server တစ်ခုချင်းစီ၏ ရှေ့တွင် ကာရံထားသော သီးသန့် အစောင့်အကြပ်ဖြစ်ပြီး လိုအပ်သော Port မှလွဲ၍ ကျန် Port အားလုံးကို Default အနေဖြင့် ပိတ်ဆို့ထားခြင်း ဖြစ်သည်။

### Network ACL (NACL)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Stateless Firewall ဖြစ်ကြောင်း နားလည်ခြင်း (Inbound ရော Outbound ပါ နှစ်ဖက်စလုံး Rule ရေးပေးရခြင်း)
- Subnet Level Firewall ဖြစ်ပြီး Subnet တစ်ခုလုံး၏ အဝင်အထွက်ကို စစ်ဆေးခြင်း
- Rule Numbers (100, 200, *) အလိုက် အစဉ်လိုက် အလုပ်လုပ်ပြီး ပထမဆုံး ကိုက်ညီသည့် Rule အတိုင်း ဆုံးဖြတ်ခြင်း
- Allow Rule အပြင် တိကျသော IP ကို Deny လုပ်နိုင်ခြင်း (ဥပမာ- Malicious Hacker IP ကို Block ပြုလုပ်ခြင်း)
- Ephemeral Ports (1024-65535) Outbound ခွင့်ပြုပေးရန် လိုအပ်မှု
> **💡 နားလည်ရမယ့်အချက်** — Subnet အဆင့်တွင် ကာကွယ်ထားသော ရပ်ကွက်လုံခြုံရေးဂိတ်ဖြစ်ပြီး မလိုလားအပ်သော Hacker IP များကို လုံးဝ ခြေမချနိုင်အောင် အဝေးမှ ကြိုတင်ပိတ်ပင်ပေးခြင်း ဖြစ်သည်။

### Ports: 22, 80, 443, 3306
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Port 22 (SSH) — Remote Server Management အတွက်ဖြစ်ပြီး Production တွင် `0.0.0.0/0` လုံးဝ မဖွင့်ရ၊ VPN သို့မဟုတ် ရုံး IP သာ ဖွင့်ရခြင်း
- Port 80 (HTTP) — Web Traffic အစိမ်းဖြစ်ပြီး HTTPS (443) သို့ Redirect လုပ်ရန်အတွက်သာ အသုံးပြုခြင်း
- Port 443 (HTTPS) — SSL Encrypted Web Traffic အတွက်ဖြစ်ပြီး Public အားလုံးအတွက် ဖွင့်ပေးရခြင်း
- Port 3306 (MySQL) / Port 5432 (PostgreSQL) — Database Port ဖြစ်ပြီး Internet အား လုံးဝ ဖွင့်မပေးရဘဲ App Server SG သာ ခွင့်ပြုရခြင်း
- `netstat -tulpn` သို့မဟုတ် `ss -tulpn` ဖြင့် Linux Server ပေါ်တွင် Port များ နားထောင်နေမှု စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server တွင် အပေါက်ပေါင်း ၆၅,၅၃၅ ပေါက်ရှိသည့်အနက် မိမိ Application ဝန်ဆောင်မှုပေးမည့် သက်ဆိုင်ရာ တံခါးပေါက်နံပါတ်များကိုသာ ရွေးချယ်ဖွင့်လှစ်ရမည် ဖြစ်သည်။

### Nginx / Apache Configuration
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Reverse Proxy ၏ သဘောတရား (Client Request ကို လက်ခံပြီး Port 3000/8000 ရှိ Node/Python App သို့ လွှဲပြောင်းပေးခြင်း)
- Nginx Virtual Host Configuration (`/etc/nginx/sites-available/` and `sites-enabled/`)
- `proxy_pass http://localhost:3000;`, `proxy_set_header Host $host;`, `proxy_set_header X-Forwarded-For $remote_addr;`
- Static File Serving (`root /var/www/html;` or Gzip Compression)
- `nginx -t` ဖြင့် Syntax စစ်ဆေးခြင်းနှင့် `systemctl reload nginx` ဖြင့် Zero-downtime Config Update ပြုလုပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — User ထံမှ လာသော Web Request များကို ရှေ့တန်းမှ ကြိုဆိုလက်ခံပြီး Backend Application ဆီသို့ ချောမွေ့စွာ ပို့ဆောင်ပေးသော Web Traffic Controller ဖြစ်သည်။

### Environment Variables
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Config / Secrets များကို Source Code ထဲတွင် Hardcode မရေးရဘဲ Environment Variable ဖြင့် ခွဲထုတ်ရသည့် အကြောင်းရင်း (12-Factor App)
- Linux System Environment Variables (`export DB_HOST="xxx"`, `/etc/environment`)
- Systemd Service ဖိုင်တွင် Environment File ချိတ်ဆက်ခြင်း (`EnvironmentFile=/var/www/app/.env`)
- Production တွင် `.env` ဖိုင်ကို Git Repository ထဲသို့ မဖြစ်မနေ `.gitignore` လုပ်ရခြင်း
- AWS Systems Manager Parameter Store သို့မဟုတ် Secrets Manager မှတစ်ဆင့် Runtime တွင် Environment Variables ဆွဲယူသုံးစွဲခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Database Password, API Keys များနှင့် Environment ဆိုင်ရာ အချက်အလက်များ လျှို့ဝှက်လုံခြုံစေရန်နှင့် Code ပြင်စရာမလိုဘဲ Server အလိုက် Config ပြောင်းနိုင်စေရန် ဖြစ်သည်။

---

## ၁.၁.၃ Database

### RDS Instance Setup
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Engine Edition ရွေးချယ်မှု (MySQL 8.0, PostgreSQL 15/16)
- DB Instance Class ရွေးချယ်မှု (Development အတွက် `db.t3.micro/db.t4g.micro`, Production အတွက် `db.m6g.large` or `db.r6g.large`)
- Storage Type (gp3 SSD) နှင့် Storage Autoscaling (Disk ပြည့်သွားပါက အလိုအလျောက် တိုးစေခြင်း)
- DB Subnet Group သတ်မှတ်ခြင်း (အနည်းဆုံး AZ နှစ်ခုရှိ Private Subnets များ ရွေးချယ်ရမည်)
- "Publicly Accessible: No" ဟု သတ်မှတ်၍ Internet ပေါ်မှ တိုက်ရိုက်ဝင်ရောက်ခွင့် လုံးဝ ပိတ်ထားခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Database Hardware ကိုယ်တိုင် ဝယ်ယူတပ်ဆင်စရာမလိုဘဲ AWS ၏ စနစ်တကျ ပြင်ဆင်ထားသော Database Engine ကို မိနစ်ပိုင်းအတွင်း စိတ်ချစွာ စတင်လည်ပတ်စေခြင်း ဖြစ်သည်။

### Database Endpoint & Connection
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- RDS Instance ၏ Connection Endpoint URL (ဥပမာ- `mydb.cxxxxxx.ap-northeast-1.rds.amazonaws.com`)
- IP Address အစား DNS Endpoint ကိုသာ အသုံးပြုရသည့် အကြောင်းရင်း (Failover ဖြစ်ပါက IP ပြောင်းသွားသော်လည်း DNS မပြောင်းလဲခြင်း)
- Web Application Config (Laravel `.env`, Node.js `process.env`) တွင် Host, Port, DB_Name, Username, Password ချိတ်ဆက်ခြင်း
- EC2 မှတစ်ဆင့် `mysql -h <endpoint> -u admin -p` ဖြင့် ချိတ်ဆက်စမ်းသပ်ခြင်း
- Connection Pooling နားလည်ခြင်း (Application မှ DB Connection အလွန်အကျွံဖွင့်၍ DB Hang မသွားစေရန် ထိန်းကျောင်းခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — Application Server သည် Database ဆီသို့ မည်သည့် လိပ်စာလမ်းကြောင်း (Endpoint) မှတစ်ဆင့် အမှားအယွင်းမရှိ ချိတ်ဆက် အလုပ်လုပ်ရသလဲဆိုတာ ဖြစ်သည်။

### Database Credentials Management
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Master Username နှင့် Password ကို လုံခြုံစွာ သတ်မှတ်ခြင်း
- Application အတွက် Root/Master အကောင့်ကို တိုက်ရိုက်မသုံးဘဲ သီးသန့် App User (`app_user`) အသစ်ဆောက်၍ သက်ဆိုင်ရာ Database ပေါ်တွင်သာ Permission ပေးခြင်း
- AWS Secrets Manager သို့မဟုတ် Parameter Store တွင် DB Credentials များကို သိမ်းဆည်းခြင်း
- Credential Rotation (စကားဝှက်များကို အချိန်အပိုင်းအခြားအလိုက် အလိုအလျောက် လဲလှယ်ခြင်း)
- Hardcoded Password များကို Git Commit ထဲ မပါစေရန် Pre-commit Hook စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကုမ္ပဏီဒေတာများ၏ အသက်သွေးကြောဖြစ်သော Database Password များ မပေါက်ကြားစေရန်နှင့် ဝန်ထမ်းအပြောင်းအလဲရှိသော်လည်း စကားဝှက်များကို အလွယ်တကူ လဲလှယ်နိုင်စေရန် ဖြစ်သည်။

### Database Migration
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- On-premises သို့မဟုတ် Local DB မှ RDS သို့ ဒေတာရွှေ့ပြောင်းခြင်း (`mysqldump`, `pg_dump`)
- Application Migration Frameworks အသုံးပြုခြင်း (Flyway, Liquibase, Laravel Migrations, Prisma Migrate, TypeORM)
- CI/CD Pipeline ထဲတွင် Database Migration အား Zero-downtime ဖြစ်အောင် Safe Schema Changes (Backward Compatibility) ရေးသားခြင်း
- ကြီးမားသော Data ပမာဏများအတွက် AWS Database Migration Service (AWS DMS) အသုံးပြုခြင်း
- Migration မပြုလုပ်မီ RDS Snapshot ကြိုတင် ရယူထားခြင်း (Rollback Plan)
> **💡 နားလည်ရမယ့်အချက်** — Production DB ပေါ်ရှိ ဇယားများ၊ Data များကို Data Loss မဖြစ်စေဘဲနှင့် Application Version အသစ်နှင့် လိုက်လျောညီထွေဖြစ်အောင် အဆင့်မြှင့်တင်ခြင်း ဖြစ်သည်။

### Backup & Restore
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Automated Backup (Backup Retention Period: ၁ ရက်မှ ၃၅ ရက်အထိ သတ်မှတ်ခြင်း)
- Point-in-time Restore (PITR) — လွန်ခဲ့သော ၅ မိနစ်ခန့်က မတော်တဆ Data ဖျက်မိခဲ့လျှင်ပင် ထိုစက္ကန့်အတိအကျသို့ ပြန်လည် Restore လုပ်နိုင်ခြင်း
- Manual DB Snapshot ရယူခြင်း (အရေးကြီးသော Release မတိုင်မီ ရယူထားပြီး Snapshot သည် မိမိဖျက်မှသာ ပျက်ခြင်း)
- Snapshot မှ RDS Instance အသစ်သို့ Restore ပြုလုပ်စမ်းသပ်ခြင်း
- Cross-Region Snapshot Copy (သဘာဝဘေးအန္တရာယ်ကြောင့် Region တစ်ခုလုံး ပျက်စီးသွားပါက အခြား Region တွင် ပြန်လည်ရယူနိုင်ရန်)
> **💡 နားလည်ရမယ့်အချက်** — မတော်တဆ ဒေတာဖျက်မိခြင်း သို့မဟုတ် စနစ်ချို့ယွင်းမှု ဖြစ်ပေါ်ပါက ကုမ္ပဏီ၏ ဒေတာများကို မိနစ်ပိုင်းအတွင်း နဂိုမူလအတိုင်း ပြန်လည် အသက်သွင်းနိုင်စေရန် ဖြစ်သည်။

### Multi-AZ Deployment
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Multi-AZ (Multiple Availability Zones) ၏ သဘောတရားနှင့် High Availability (HA) အရေးပါပုံ
- Primary DB မှ Standby DB သို့ Synchronous Replication ပြုလုပ်နေပုံ
- Standby DB သည် Read/Write အတွက် တိုက်ရိုက်သုံး၍မရဘဲ အရေးပေါ် Failover အတွက်သာ ဖြစ်ကြောင်း သိရှိခြင်း
- Primary AZ မီးပျက်ခြင်း/ပျက်စီးခြင်း ဖြစ်ပါက Standby DB သို့ ၆၀ စက္ကန့်အတွင်း Automatic Failover ဖြစ်သွားပုံ (Endpoint ပြောင်းစရာမလိုဘဲ DNS အလိုအလျောက် ပြောင်းသွားခြင်း)
- Multi-AZ ဖွင့်ခြင်းကြောင့် ကုန်ကျစရိတ် ၂ ဆ ဖြစ်သွားသဖြင့် Staging/Production အတွက်သာ အသုံးပြုရန် ဆုံးဖြတ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Tokyo ရှိ Data Center တစ်ခု မီးလောင်သွားသော်လည်း ဝဘ်ဆိုဒ်နှင့် Database လုံးဝ ရပ်တန့်မသွားဘဲ နောက် Data Center တစ်ခုသို့ အလိုအလျောက် ပြောင်းလဲလည်ပတ်ပေးနိုင်ခြင်း ဖြစ်သည်။

### Read Replicas
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Asynchronous Replication ဖြင့် Primary DB မှ Read Replica သို့ ဒေတာကူးယူပုံ
- Read-Heavy Applications (ဥပမာ- သတင်းဆိုဒ်များ၊ E-commerce ရှာဖွေမှုများ) တွင် Read Performance မြှင့်တင်ရန် သုံးစွဲခြင်း
- Application Code တွင် Write Query (INSERT, UPDATE, DELETE) ကို Primary Endpoint သို့ပို့ပြီး Read Query (SELECT) ကို Replica Endpoint သို့ ခွဲပို့ခြင်း
- Read Replica ကို သီးခြား Standalone DB အဖြစ် Promote လုပ်နိုင်ခြင်း
- Replication Lag ဖြစ်ပေါ်နိုင်မှုနှင့် Monitoring လုပ်ဆောင်ရန် လိုအပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — User များစွာက ဒေတာများကို တစ်ပြိုင်နက် ဖတ်ရှုနေချိန်တွင် မူရင်း Database ပေါ် ဝန်မပိစေရန် ဖတ်ရှုမှုသက်သက်အတွက် မိတ္တူ DB များ ခွဲထုတ်ထားရှိခြင်း ဖြစ်သည်။

### Database Security Groups
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- RDS အတွက် သီးသန့် Security Group (`rds-sg`) ဖန်တီးခြင်း
- Inbound Rule တွင် Port 3306 / 5432 ကို သတ်မှတ်ပြီး Source နေရာတွင် App Server ၏ SG ID (`sg-xxxxxx`) ကိုသာ Reference ပေးခြင်း
- Inbound တွင် `0.0.0.0/0` (Anywhere) လုံးဝ ခွင့်မပြုရခြင်း
- Developer များ စမ်းသပ်လိုပါက Bastion Host (Jump Server) သို့မဟုတ် AWS SSM မှတစ်ဆင့် Port Forwarding ဖြင့် လှမ်းချိတ်စေခြင်း
- Outbound Rule များ မလိုအပ်ပါက ပိတ်ဆို့ထားခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Database ဆီသို့ မည်သည့် ခွင့်ပြုချက်မရှိသော လူ သို့မဟုတ် ပြင်ပစက်မှ မဝင်ရောက်နိုင်ဘဲ သတ်မှတ်ထားသော Application Server များမှသာ စကားပြောနိုင်အောင် တင်းကျပ်စွာ ပိတ်ဆို့ခြင်း ဖြစ်သည်။

### AWS Secrets Manager
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Database Credentials, Third-party API Keys (Stripe, SendGrid) များကို Key-Value ပုံစံဖြင့် လုံခြုံစွာ သိမ်းဆည်းခြင်း
- AWS KMS ဖြင့် အလိုအလျောက် Encryption (At-rest) ပြုလုပ်ပေးခြင်း
- Automatic Credential Rotation စနစ် (Lambda ဖြင့် ၃၀ ရက်တစ်ကြိမ် DB Password အား Application မရပ်ဘဲ အလိုအလျောက် လဲလှယ်ပေးခြင်း)
- Application Runtime တွင် AWS SDK သို့မဟုတ် ECS Task Definition မှတစ်ဆင့် Secret အား Environment Variable အဖြစ် ဆွဲယူသုံးစွဲခြင်း
- IAM Policy ဖြင့် မည်သည့် App/Role ကသာ Secret ကို ဖတ်ခွင့်ရှိသည်ကို ကန့်သတ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — လျှို့ဝှက်စကားဝှက်များကို လူကိုယ်တိုင် လိုက်လံမှတ်သားစရာမလိုဘဲ AWS ၏ ဒစ်ဂျစ်တယ် လုံခြုံရေးသေတ္တာထဲတွင် ထည့်ထားပြီး စနစ်တကျ အလိုအလျောက် လဲလှယ်အသုံးပြုခြင်း ဖြစ်သည်။

---

## ၁.၁.၄ Storage & File Management

### S3 Bucket
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Bucket Naming Convention (Globally unique, Lowercase, hyphens only, no underscores)
- Region ရွေးချယ်မှု (Tokyo `ap-northeast-1` vs Osaka `ap-northeast-3`)
- Default Encryption (SSE-S3 / SSE-KMS) ဖွင့်ထားခြင်း
- Object Tagging နှင့် Metadata သဘောတရား နားလည်ခြင်း
- Bucket Deletion Protection နှင့် Empty Bucket မလုပ်ဘဲ Bucket ဖျက်၍မရသည့် သဘောတရား
> **💡 နားလည်ရမယ့်အချက်** — Cloud ပေါ်တွင် ဖိုင်များကို နာမည်တူမရှိသော သီးသန့် ဖိုင်သေတ္တာကြီးများအဖြစ် တည်ဆောက်ပြီး မည်သည့်နေရာမှမဆို အလွယ်တကူ သိမ်းဆည်းနိုင်ရန် ဖြစ်သည်။

### Bucket Policy
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- JSON-based Resource Policy ရေးသားခြင်း (`Version`, `Statement`, `Effect`, `Principal`, `Action`, `Resource`)
- S3 Bucket Policy နှင့် IAM User Policy ကွာခြားချက် နားလည်ခြင်း
- HTTPS (Encrypted In-Transit) သာ လက်ခံမည့် Enforce SSL Policy ရေးဆွဲခြင်း
- IP-based restriction (ဥပမာ- ရုံး IP မှသာ Bucket ထဲသို့ Access ပေးခြင်း)
- CloudFront OAC အတွက် သီးသန့် Read Access ပေးသည့် Policy ရေးသားခြင်း
> **💡 နားလည်ရမယ့်အချက်** — သက်ဆိုင်ရာ Bucket တစ်ခုလုံး၏ အဝင်ဝတွင် စည်းကမ်းချက်စာရွက် ကပ်ထားသကဲ့သို့ မည်သူ့ကို မည်သည့်အခြေအနေတွင် ခွင့်ပြုမည်/ငြင်းပယ်မည်ကို အတိအကျ ပြဋ္ဌာန်းခြင်း ဖြစ်သည်။

### IAM Role for S3 Access
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- EC2 သို့မဟုတ် ECS Task ပေါ်တွင် Run နေသော Application မှ S3 သို့ Access လုပ်ရန် IAM Role ဖန်တီးခြင်း
- `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` Permissions များကို သက်ဆိုင်ရာ Bucket ARN သို့သာ Least Privilege ပေးခြင်း
- Instance Profile အဖြစ် EC2 သို့ Attach လုပ်ခြင်း (AWS CLI သို့မဟုတ် SDK မှ အလိုအလျောက် Credentials ဆွဲယူသွားခြင်း)
- Access Key/Secret Key ကို Code ထဲ ထည့်စရာမလိုတော့သဖြင့် Key Leakage အန္တရာယ် ၁၀၀% ကင်းဝေးသွားခြင်း
- Role Assumption (`sts:AssumeRole`) လုပ်ဆောင်ပုံကို နားလည်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server ပေါ်တွင် သော့အစစ်ကို ကိုင်ဆောင်ထားစရာမလိုဘဲ AWS က တာဝန်ပေးအပ်ထားသော ယာယီတံဆိပ်ပြား (Role) ဖြင့် S3 ကို လုံခြုံစွာ ဖွင့်ဖောက်သုံးစွဲခြင်း ဖြစ်သည်။

### Object Permissions
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- S3 Access Control Lists (ACLs) ကို Disable လုပ်ပြီး Bucket Owner Enforced ထားရှိခြင်း (AWS Best Practice)
- Block Public Access (BPA) Setting အား Account Level နှင့် Bucket Level နှစ်ခုစလုံးတွင် Enable ထားရှိခြင်း
- Individual Object Permissions ကို Public မပေးဘဲ CloudFront သို့မဟုတ် Presigned URL ဖြင့်သာ ဖြန့်ဝေခြင်း
- Cross-Account S3 Access ပေးအပ်ခြင်းဆိုင်ရာ သဘောတရား
- Object Ownership နှင့် Bucket Owner Rights စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ဖိုင်တစ်ခုချင်းစီအလိုက် အများပြည်သူ တိုက်ရိုက် မတော်တဆ ဝင်ဖတ်၍ မရအောင် ပိတ်ဆို့ထားပြီး ခွင့်ပြုချက်ရသူသာ ရရှိစေရန် ထိန်းကျောင်းခြင်း ဖြစ်သည်။

### Versioning
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- S3 Bucket Versioning ကို Enable လုပ်ခြင်း
- ဖိုင်တစ်ခုကို အမည်တူဖြင့် ထပ်တင်ပါက ယခင်ဖိုင် ပျောက်မသွားဘဲ Version ID အသစ်ဖြင့် သိမ်းဆည်းထားခြင်း
- ဖိုင်ကို Delete လုပ်ပါက Delete Marker သာ ထိုင်ပြီး ယခင် Version များ မပျက်စီးဘဲ ပြန်လည် Recover လုပ်နိုင်ခြင်း
- Ransomware ကာကွယ်ရန် သို့မဟုတ် မတော်တဆ ဖျက်မိခြင်းမှ ကာကွယ်ရန် အရေးပါပုံ
- MFA Delete (Version အဟောင်းများကို ဖျက်ရန် Root MFA လိုအပ်သည့် စနစ်)
> **💡 နားလည်ရမယ့်အချက်** — User သို့မဟုတ် စနစ်က ဖိုင်တစ်ခုကို အမှားအယွင်းဖြင့် ဖျက်မိ/ပြင်မိသော်လည်း အချိန်မရွေး နောက်ကြောင်းပြန်လှည့် ရယူနိုင်ရန် Time Machine ကဲ့သို့ စီမံထားခြင်း ဖြစ်သည်။

### Lifecycle Rules
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ကုန်ကျစရိတ် ချွေတာရန် S3 Storage Classes သို့ အလိုအလျောက် ပြောင်းလဲခြင်း (S3 Standard -> Standard-IA -> Glacier Flexible -> Glacier Deep Archive)
- ရက် ၃၀ ကျော်သွားသော ဖိုင်ဟောင်းများကို Infrequent Access သို့ ရွှေ့ပြောင်းခြင်း
- ရက် ၉၀ ကျော်သွားသော ဖိုင်များကို Archive (Glacier) သို့ ရွှေ့ပြောင်းခြင်း
- Noncurrent Version (ဗားရှင်းအဟောင်းများ) ကို ရက်ပေါင်း ၆၀ ပြည့်ပါက အပြီးတိုင် ဖျက်ပစ်ရန် သတ်မှတ်ခြင်း
- Incomplete Multipart Uploads များကို ၇ ရက်အတွင်း အလိုအလျောက် သန့်ရှင်းရေးလုပ်ရန် Rule ထည့်သွင်းခြင်း
> **💡 နားလည်ရမယ့်အချက်** — မလိုအပ်တော့သော ဖိုင်ဟောင်းများနှင့် Logs များကို ကိုယ်တိုင်လိုက်ဖျက်စရာမလိုဘဲ အချိန်တန်လျှင် စျေးသက်သာသော Storage သို့ အလိုအလျောက်ရွှေ့ သို့မဟုတ် အပြီးဖျက်ပစ်ခြင်းဖြင့် ငွေကုန်သက်သာစေခြင်း ဖြစ်သည်။

### Static Website Hosting
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- S3 Static Website Hosting Feature ဖွင့်လှစ်ခြင်း (Index Document: `index.html`, Error Document: `404.html`)
- Single Page Applications (React, Vue, Astro) များကို S3 ပေါ် တင်ကာ စျေးသက်သာစွာ Host လုပ်ခြင်း
- S3 Website Endpoint vs REST API Endpoint ကွာခြားချက်
- S3 Static Hosting ကို Public မဖွင့်ဘဲ CloudFront CDN ဖြင့်သာ ရှေ့မှ ခံ၍ HTTPS ဖြင့် Host လုပ်ခြင်း (Modern Best Practice)
- Routing Rules (URL Redirects) သတ်မှတ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server မလိုဘဲ HTML, CSS, JavaScript ဖိုင်များသက်သက်ဖြင့် လည်ပတ်သော Web Frontend များကို လစဥ်ဒေါ်လာအနည်းငယ်ဖြင့် စိတ်ချစွာ Host လုပ်နိုင်ခြင်း ဖြစ်သည်။

### CloudFront + S3 Integration
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Origin Access Control (OAC) တည်ဆောက်ခြင်း (ယခင် OAI အစား အသစ်ထွက် OAC ကို သုံးရမည်)
- S3 Bucket Policy တွင် CloudFront Distribution ARN မှသာ `s3:GetObject` လုပ်ခွင့်ပေးခြင်း
- S3 Bucket ၏ Block Public Access အားလုံးကို ON ထားနိုင်ခြင်း (S3 သည် ၁၀၀% Private ဖြစ်နေမည်)
- Single Page Application (SPA) အတွက် Custom Error Response (403/404 တက်ပါက `index.html` သို့ 200 OK ဖြင့် ပြန်လွှဲပေးခြင်း)
- Compression (Gzip, Brotli) ကို CloudFront တွင် Enable ပြုလုပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — S3 Bucket ကို လုံးဝ သော့ခတ်ထားပြီး ကမ္ဘာအနှံ့ရှိ User များကို CloudFront မှတစ်ဆင့်သာ မြန်မြန်ဆန်ဆန်နှင့် လုံခြုံစွာ ဖိုင်များ ကြည့်ရှုခွင့်ပေးခြင်း ဖြစ်သည်။

### Presigned URLs
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Presigned URL ၏ သဘောတရား (Private S3 Object အား အချိန်ကန့်သတ်ချက်ဖြင့် ယာယီ ဒေါင်းလုဒ် သို့မဟုတ် တင်ခွင့် ပေးခြင်း)
- Backend Application (Node.js/Python) မှ AWS SDK ဖြင့် Presigned GET URL ထုတ်ပေးခြင်း (ဥပမာ- ၁၅ မိနစ်သာ သက်တမ်းရှိပြီး သက်တမ်းကုန်ပါက ဖွင့်မရတော့ခြင်း)
- Direct Browser-to-S3 Upload (Presigned PUT URL ဖြင့် Web Server ကို ဖြတ်စရာမလိုဘဲ Browser မှ S3 သို့ တိုက်ရိုက် Upload တင်ခြင်း)
- Web Server ၏ CPU နှင့် Bandwidth ဝန်ထုပ်ဝန်ပိုးကို သိသိသာသာ လျှော့ချပေးနိုင်ခြင်း
- Expiration Time ကို အနည်းဆုံးထားရှိခြင်းဖြင့် လုံခြုံရေး စောင့်ရှောက်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — အခပေးဖောက်သည် သို့မဟုတ် Login ဝင်ထားသူများကိုသာ မိမိတို့၏ ဗီဒီယို/PDF ဖိုင်များကို ယာယီ Link ထုတ်ပေး၍ ဒေါင်းလုဒ်ဆွဲခွင့်ပေးသည့် အဆင့်မြင့် နည်းပညာ ဖြစ်သည်။

---

## ၁.၁.၅ Deployment & DevOps

### AWS Management Console
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Web GUI မှတစ်ဆင့် AWS ဝန်ဆောင်မှုများကို မျက်မြင်လေ့လာ အသုံးပြုခြင်း
- Region Selector မှန်ကန်စွာ ရွေးချယ်တတ်ခြင်း (Tokyo `ap-northeast-1` တွင် တည်ဆောက်ပြီး မမြင်ရပါက Region မှားနေခြင်းကို သတိပြုမိခြင်း)
- Resource Search Bar, CloudShell (Browser အတွင်း CLI) အသုံးပြုခြင်း
- Billing Console နှင့် Cost Allocation Tags စစ်ဆေးခြင်း
- GUI ဖြင့် စတင်လေ့လာပြီး Production တွင် CLI / Terraform သို့ ကူးပြောင်းရမည့် Mindset မွေးမြူခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Cloud ဝန်ဆောင်မှုများကို ကနဦး စမ်းသပ်ရန်နှင့် မျက်စိဖြင့် တစ်ကွင်းတစ်ပြင်လုံး ခြုံငုံကြည့်ရှု စစ်ဆေးရန် အသုံးပြုသော Web Dashboard ဖြစ်သည်။

### AWS CLI
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- AWS CLI v2 တပ်ဆင်ခြင်း (`aws --version`)
- `aws configure` ဖြင့် AWS Access Key, Secret Key, Default Region သတ်မှတ်ခြင်း
- မရှိမဖြစ် Commands များ (`aws s3 ls`, `aws s3 sync`, `aws ec2 describe-instances`, `aws sts get-caller-identity`)
- Output Formatting (`--output json`, `--output table`, `--output text`)
- `--query` parameter (JMESPath) ဖြင့် လိုချင်သော Output Data ကို Filter လုပ်ယူခြင်း
> **💡 နားလည်ရမယ့်အချက်** — GUI တွင် ကလစ်များစွာ နှိပ်ရမည့်အစား Terminal မှ Command တစ်ကြောင်းတည်းဖြင့် အလုပ်ပြီးမြောက်စေပြီး Automation Script များ ရေးသားနိုင်စေရန် ဖြစ်သည်။

### Git & GitHub
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Git Version Control အခြေခံများ (`git init`, `git add`, `git commit`, `git push`, `git pull`)
- Branching Strategy (Git Flow / GitHub Flow: `main`, `develop`, `feature/*`)
- `.gitignore` စနစ်တကျ ရေးသားခြင်း (`.env`, `node_modules`, `vendor`, `.pem` keys များ လုံးဝ မပါစေရန်)
- Pull Request (PR) နှင့် Code Review စနစ် နားလည်ခြင်း
- GitHub Actions CI/CD စတင် ချိတ်ဆက်ရန် Repository Setup ပြုလုပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Application Code နှင့် Infrastructure Code များကို အသင်းအဖွဲ့လိုက် စနစ်တကျ ထိန်းသိမ်းပြီး Automated Deployment လုပ်ဆောင်နိုင်ရန် အခြေခံအုတ်မြစ် ဖြစ်သည်။

### EC2 Application Deployment
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- EC2 ပေါ်သို့ Git မှတစ်ဆင့် Code Clone ပြုလုပ်ခြင်း
- Runtime Dependencies တင်သွင်းခြင်း (Node.js/npm, Python/pip, PHP/Composer)
- PM2 (Node.js) သို့မဟုတ် Gunicorn/Supervisor (Python) သို့မဟုတ် PHP-FPM ဖြင့် Background Daemon Run ခြင်း
- Nginx Reverse Proxy နှင့် ချိတ်ဆက်ပြီး Domain ဖြင့် ခေါ်ဆိုနိုင်အောင် ပြင်ဆင်ခြင်း
- Code အသစ်တင်တိုင်း Pull ဆွဲပြီး Service Reload ပြုလုပ်သည့် Deployment Script (`deploy.sh`) ရေးသားခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ရေးသားထားသော Code များကို တကယ့် Cloud Server ပေါ်တွင် အမြဲမပြတ် ၂၄ နာရီ လည်ပတ်နေစေရန် Manual မှ Scripted Deployment အထိ လုပ်ဆောင်တတ်ခြင်း ဖြစ်သည်။

### Docker & Amazon ECR
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Dockerfile ရေးသားခြင်း (Multi-stage build ဖြင့် Image Size သေးငယ်အောင် ပြုလုပ်ခြင်း)
- Local တွင် Container Build & Run စမ်းသပ်ခြင်း (`docker build`, `docker run -p 80:80`)
- Amazon ECR (Elastic Container Registry) တွင် Private Repository ဖန်တီးခြင်း
- ECR သို့ Docker Login ပြုလုပ်ခြင်း (`aws ecr get-login-password | docker login ...`)
- Image Tagging နှင့် Push ပြုလုပ်ခြင်း (`docker push <account>.dkr.ecr.<region>.amazonaws.com/app:v1.0`)
> **💡 နားလည်ရမယ့်အချက်** — Application ကို မည်သည့် Server ပေါ်တွင်မဆို ပတ်ဝန်းကျင်မရွေး တစ်ပုံစံတည်း အလုပ်လုပ်နိုင်ရန် Container အဖြစ် ထုပ်ပိုးပြီး AWS ၏ လုံခြုံသော Registry တွင် သိမ်းဆည်းခြင်း ဖြစ်သည်။

### Amazon ECS (Elastic Container Service)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ECS Architecture ၏ အဓိက အစိတ်အပိုင်း ၃ ခု (Cluster, Task Definition, Service)
- Task Definition ရေးသားခြင်း (ECR Image URL, CPU, Memory, Port Mappings, Environment Variables, IAM Task Role)
- ECS Service တည်ဆောက်ခြင်း (Desired Tasks အရေအတွက်, ALB Target Group နှင့် ချိတ်ဆက်မှု)
- AWS Fargate (Serverless Compute) ရွေးချယ်မှု (EC2 Server ကိုယ်တိုင် Manage လုပ်စရာမလိုတော့ခြင်း)
- Rolling Update Deployment (Container အသစ် အရင်တက်ပြီးမှ အဟောင်းကို ဖျက်သဖြင့် Zero-downtime ဖြစ်ခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — Container ပေါင်းများစွာကို Server မလိုဘဲ အလိုအလျောက် စီမံခန့်ခွဲ၊ ချိတ်ဆက်၊ ဖြန့်ကျက်ပေးသော AWS ၏ ခေတ်မီ Container Orchestration ဝန်ဆောင်မှု ဖြစ်သည်။

### AWS CodePipeline / CI/CD Concepts
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Continuous Integration & Continuous Deployment (CI/CD) ၏ အနှစ်သာရ နားလည်ခြင်း
- CodePipeline (Source -> Build -> Deploy) အဆင့်ဆင့် ချိတ်ဆက်ခြင်း
- AWS CodeBuild (Buildspec.yml ရေးသား၍ Test Run ခြင်းနှင့် Docker Image Build လုပ်ခြင်း)
- GitHub Actions vs AWS Native CodePipeline နှိုင်းယှဉ်ချက် (Japan လုပ်ငန်းခွင်တွင် နှစ်မျိုးစလုံး တွင်ကျယ်စွာ သုံးစွဲခြင်း)
- Automated Deployment triggered by `git push` to `main` branch
> **💡 နားလည်ရမယ့်အချက်** — Developer က Code တစ်ကြောင်း ပြင်ပြီး Git Push လိုက်သည်နှင့် စနစ်က အလိုအလျောက် Test စစ်ဆေးပြီး Production ပေါ်သို့ လူမလိုဘဲ တင်ပေးသွားသော အလိုအလျောက် စနစ် ဖြစ်သည်။

### CloudFormation
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Infrastructure as Code (IaC) ၏ အကျိုးကျေးဇူးများ (လက်ဖြင့် ကလစ်နှိပ်စရာမလိုဘဲ Code ဖြင့် Infra တည်ဆောက်ခြင်း)
- CloudFormation Template ရေးသားခြင်း (YAML / JSON syntax: `Parameters`, `Resources`, `Outputs`)
- Stack ဖန်တီးခြင်း၊ Update လုပ်ခြင်းနှင့် Delete လုပ်ခြင်း
- Change Sets ၏ အရေးပါပုံ (Template မပြောင်းမီ မည်သည့် Resource များ ပြင်ဆင်/ဖျက်ပစ်မည်ကို ကြိုတင် Review လုပ်ခြင်း)
- CloudFormation vs Terraform နှိုင်းယှဉ်ချက် နားလည်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server, Network, Database အားလုံးကို Code စာရွက်တစ်ရွက်ဖြင့် ရေးသားဖော်ပြထားပြီး လိုအပ်ပါက မိနစ်ပိုင်းအတွင်း အလားတူ Environment အသစ် ပြန်လည်တည်ဆောက်နိုင်စေရန် ဖြစ်သည်။

### AWS Systems Manager (SSM)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- SSM Session Manager ဖြင့် Port 22 (SSH) ဖွင့်စရာမလိုဘဲ Browser/CLI မှတစ်ဆင့် EC2 ထဲ ဝင်ရောက်ခြင်း
- EC2 Security Group တွင် Inbound Port လုံးဝ ပိတ်ထားနိုင်သဖြင့် Attack Surface လျော့ကျသွားခြင်း
- SSM Parameter Store (Free Tier) ဖြင့် App Configurations များကို လုံခြုံစွာ သိမ်းဆည်းခြင်း
- Run Command ဖြင့် EC2 အလုံးပေါင်းများစွာဆီသို့ Shell Script တစ်ပြိုင်နက်တည်း လှမ်းခိုင်းခြင်း
- Patch Manager ဖြင့် OS Security Updates များကို အလိုအလျောက် တင်ပေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ခေတ်ဟောင်း SSH Port 22 သုံးစွဲမှုကို ဖျက်သိမ်းပြီး IAM Permission ဖြင့်သာ Server ထဲသို့ အလွန်လုံခြုံစွာ ဝင်ရောက်ထိန်းချုပ်နိုင်သော Enterprise စံနှုန်း ဖြစ်သည်။

### Deployment Rollback
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Deployment အသစ် ပြုလုပ်ပြီးနောက် Critical Bug သို့မဟုတ် 500 Error တက်လာပါက ယခင် Version သို့ အမြန်ဆုံး ပြန်ဆုတ်နိုင်ရန် ပြင်ဆင်ခြင်း
- ECS / Kubernetes တွင် Previous Task Definition Revision သို့ ချက်ချင်း Rollback ပြုလုပ်ခြင်း
- ALB Target Group Health Check မအောင်မြင်ပါက အလိုအလျောက် Deployment ပယ်ဖျက်သည့် စနစ်
- Database Schema Migration Rollback Plan (`down` migrations) ကြိုတင် ပြင်ဆင်ထားရှိခြင်း
- Deployment မလုပ်မီ Snapshot / Backup ကြိုတင် ယူထားခြင်း၏ အရေးပါမှု
> **💡 နားလည်ရမယ့်အချက်** — မည်သည့် Release တွင်မဆို အမှားအယွင်း ဖြစ်ပေါ်လာနိုင်သဖြင့် စက္ကန့်ပိုင်းအတွင်း ယခင် ကောင်းမွန်သော အခြေအနေသို့ အရေးပေါ် ပြန်လည်ဆုတ်ခွာနိုင်မည့် ထွက်ပေါက် အမြဲရှိနေရမည်။

### Development / Staging / Production Environments
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Environment သုံးခု ခွဲခြားရသည့် အကြောင်းရင်း (Dev: စမ်းသပ်တီထွင်ရန် | Staging: Production နှင့် ၁၀၀% တူညီသော စမ်းသပ်ခန်း | Production: အမှန်တကယ် User များ သုံးစွဲနေသော နေရာ)
- AWS Account ခွဲခြားခြင်း (Multi-Account Strategy using AWS Organizations) သို့မဟုတ် သီးခြား VPC များဖြင့် ခွဲခြားခြင်း
- Environment တစ်ခုစီအတွက် သီးခြား Resource Naming နှင့် IAM Permissions ကန့်သတ်ခြင်း
- Production ဒေတာများကို Dev/Staging တွင် တိုက်ရိုက် မသုံးဘဲ Data Masking/Anonymizing ပြုလုပ်ခြင်း
- Staging တွင် အပြည့်အဝ Test ပြီးမှသာ Production သို့ Release လုပ်သော Workflow ကျင့်သုံးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — စမ်းသပ်မှုကြောင့် အစစ်အမှန် User များ၏ ဒေတာနှင့် ဝန်ဆောင်မှု မထိခိုက်စေရန် စနစ်ပတ်ဝန်းကျင်များကို စည်းခြားကာကွယ်ထားခြင်း ဖြစ်သည်။

---

## ၁.၁.၆ Security

### IAM Policies & Roles
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- IAM Policy Structure နားလည်ခြင်း (`Version: 2012-10-17`, `Statement`: `Sid`, `Effect`, `Action`, `Resource`, `Condition`)
- Managed Policy (AWS Managed vs Customer Managed) နှင့် Inline Policy ကွာခြားချက်
- Trust Relationship (AssumeRolePolicyDocument) — မည်သည့် Service သို့မဟုတ် Account က ဤ Role ကို ယူဆခွင့်ရှိသလဲ သတ်မှတ်ခြင်း
- Instance Profile ဖြင့် EC2 သို့ Role ချိတ်ဆက်ခြင်း
- Permission Boundaries နှင့် Service Control Policies (SCPs)
> **💡 နားလည်ရမယ့်အချက်** — Cloud လုံခြုံရေး၏ နှလုံးသားဖြစ်ပြီး မည်သည့်စက်၊ မည်သည့်လူက မည်သည့် အလုပ်ကိုသာ လုပ်ခွင့်ရှိသည်ကို တိကျစွာ အမိန့်ထုတ်ပြန်ထားခြင်း ဖြစ်သည်။

### Least Privilege Principle
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- လုပ်ငန်းတာဝန်အတွက် အနည်းဆုံး လိုအပ်သော အခွင့်အရေးမှလွဲ၍ ပိုလျှံသော မည်သည့် အခွင့်အရေးကိုမျှ မပေးအပ်ခြင်း
- Policy တွင် Wildcard (`Action: "*"`, `Resource: "*"`) လုံးဝ အသုံးမပြုရခြင်း
- ဥပမာ- S3 Read သာ လိုအပ်သော App အား `s3:GetObject` သာ ပေးပြီး `s3:PutObject` သို့မဟုတ် `s3:DeleteObject` မပေးခြင်း
- IAM Access Advisor ဖြင့် အသုံးမပြုတော့သော ခွင့်ပြုချက်ဟောင်းများကို ပုံမှန် စစ်ဆေးဖြုတ်ချခြင်း
- Temporary Security Credentials (STS) သုံးစွဲခြင်း
> **💡 နားလည်ရမယ့်အချက်** — အကယ်၍ Server တစ်ခု Hacker လက်ထဲ ကျရောက်သွားလျှင်ပင် ပေးထားသော လုပ်ပိုင်ခွင့်ထက် ကျော်လွန်၍ တစ်ခြား AWS Service များကို ဖျက်ဆီးမရအောင် ဘောင်ခတ်ထားခြင်း ဖြစ်သည်။

### MFA (Multi-Factor Authentication)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Multi-Factor Authentication ဆိုသည်မှာ Password အပြင် ဖုန်း Authenticator App (Google Authenticator, 1Password) မှ 6-digit Code လိုအပ်သော စနစ်ဖြစ်ခြင်း
- AWS Root Account တွင် FIDO Security Key သို့မဟုတ် Virtual MFA မဖြစ်မနေ ဖွင့်ထားခြင်း
- IAM Users အားလုံးအတွက် MFA မဖွင့်မချင်း Console သို့မဟုတ် API သုံးမရအောင် IAM Policy ဖြင့် အတင်းအကျပ် သတ်မှတ်ခြင်း (Enforce MFA)
- CLI အသုံးပြုမှုအတွက် MFA Token Session ရယူခြင်း
- Hardware MFA Key (YubiKey) သုံးစွဲခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Password ပေါက်ကြားသွားလျှင်ပင် ဖုန်းထဲမှ ယာယီကုဒ်မရှိဘဲ AWS ထဲသို့ Hacker လုံးဝ ဝင်ရောက်မရနိုင်အောင် ဒုတိယသော့ခလောက် ခတ်ထားခြင်း ဖြစ်သည်။

### AWS KMS (Key Management Service)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Encryption at Rest ၏ သဘောတရား (Hard disk ပေါ်တွင် သိမ်းထားသော Data များကို ဝှက်ထားခြင်း)
- AWS Managed Keys (Free) vs Customer Managed Keys (CMK - $1/month) ကွာခြားချက်
- Envelope Encryption သဘောတရား (KMS Master Key ဖြင့် Data Key ကို encrypt လုပ်ပြီး Data Key ဖြင့် အချက်အလက်များကို encrypt လုပ်ခြင်း)
- KMS Key Policy ဖြင့် Key အသုံးပြုခွင့်ကို သီးခြား ထိန်းချုပ်ခြင်း
- EBS, S3, RDS, Secrets Manager များတွင် KMS ဖြင့် အလွယ်တကူ တစ်ချက်နှိပ် ချိတ်ဆက် အသုံးပြုခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကုမ္ပဏီဒေတာအားလုံးကို အစွမ်းထက်ဆုံး စစ်ဘက်သုံး စာဝှက်စနစ်ဖြင့် သိမ်းဆည်းပေးပြီး သော့ပိုင်ရှင်မှလွဲ၍ မည်သူမျှ ဖတ်မရအောင် ကာကွယ်ပေးသော ဝန်ဆောင်မှု ဖြစ်သည်။

### Secrets Manager
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- စကားဝှက်များကို Git သို့မဟုတ် Text File များတွင် မထားရှိဘဲ ဗဟိုမှ ထိန်းချုပ်ခြင်း
- Secrets Manager vs SSM Parameter Store နှိုင်းယှဉ်ချက် (Secrets Manager သည် Automatic Rotation ပါပြီး တစ်ခုလျှင် $0.40/month ကျသင့်၊ SSM Parameter Store Standard သည် Free ဖြစ်ခြင်း)
- API/SDK ဖြင့် Secret တောင်းယူရာတွင် Caching ပြုလုပ်၍ API Cost သက်သာအောင် ပြုလုပ်ခြင်း
- Resource-based Policy ဖြင့် Cross-Account Access ခွင့်ပြုခြင်း
- CloudTrail ဖြင့် Secret ကို မည်သူ၊ မည်သည့်အချိန်တွင် လာရောက် ဖတ်ရှုသွားသည်ကို ခြေရာခံခြင်း
> **💡 နားလည်ရမယ့်အချက်** — အရေးကြီး စကားဝှက်များကို လုံခြုံစွာ စီမံပြီး မည်သူဝင်ကြည့်သည်ကိုပါ Audit Trail မှတ်တမ်းအပြည့်အစုံ ရယူနိုင်စေရန် ဖြစ်သည်။

### HTTPS Configuration
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- HTTP (Port 80) Traffic အားလုံးကို HTTPS (Port 443) သို့ 301 Permanent Redirect ပြုလုပ်ခြင်း
- ALB Listener တွင် Port 80 ကို Rule ထည့်၍ `Redirect to HTTPS:443` သတ်မှတ်ခြင်း
- ACM မှ SSL/TLS Certificate ကို ALB သို့မဟုတ် CloudFront တွင် တပ်ဆင်ခြင်း
- Modern Security Policy ရွေးချယ်ခြင်း (TLS 1.2 / TLS 1.3 သာ လက်ခံပြီး အားနည်းသော SSLv3, TLS 1.0 ပိတ်ပင်ခြင်း)
- End-to-End Encryption (ALB မှ Backend EC2 သို့လည်း လိုအပ်ပါက Encrypted ချိတ်ဆက်ခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — User ၏ Browser နှင့် Server အကြား စီးဆင်းနေသော ဒေတာများကို လမ်းခုလတ်မှ မည်သူမျှ ကြားဖြတ်ခိုးယူ/ပြင်ဆင်၍ မရအောင် လုံခြုံသော လိုင်းပြွန်ခတ်ပေးခြင်း ဖြစ်သည်။

### Security Group Rules
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Inbound Rule များတွင် လိုအပ်သော Port မှလွဲ၍ ကျန် Port အားလုံးကို ပိတ်ထားခြင်း (Default Deny)
- Port 22 (SSH) ကို `0.0.0.0/0` ဖွင့်ထားခြင်း မရှိစေရန် စစ်ဆေးခြင်း
- Security Group Referencing ကို အသုံးပြုခြင်း (ဥပမာ- App SG သည် ALB SG မှသာ Port 80/3000 လက်ခံခြင်း၊ DB SG သည် App SG မှသာ Port 3306 လက်ခံခြင်း)
- Security Group Rule Description များကို ရှင်းလင်းစွာ ရေးသားမှတ်တမ်းတင်ထားခြင်း
- AWS Config သို့မဟုတ် Security Hub ဖြင့် Unrestricted Inbound Rules များကို အလိုအလျောက် စောင့်ကြည့် Alert ပေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Firewall အဆင့်တွင် အလွှာလိုက် (Defense in Depth) အချင်းချင်းသာ စကားပြောခွင့်ပြုပြီး အပြင်သို့ မလိုလားအပ်သော အပေါက်များ မဟနေစေရန် စိစစ်ခြင်း ဖြစ်သည်။

### AWS CloudTrail
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- CloudTrail ၏ လုပ်ဆောင်ချက် (AWS Account အတွင်း ဖြစ်ပျက်သမျှ API Calls အားလုံးကို မှတ်တမ်းတင်ခြင်း)
- မည်သူက (User/Role)၊ မည်သည့်အချိန်တွင် (Timestamp)၊ မည်သည့် IP မှ (Source IP)၊ မည်သည့် Resource ကို ဖျက်/ပြင် သွားသည်ကို Audit လုပ်နိုင်ခြင်း
- Event History တွင် လွန်ခဲ့သော ရက် ၉၀ အတွင်း API Activity များကို အခမဲ့ ရှာဖွေနိုင်ခြင်း
- Multi-Region Trail ဖန်တီး၍ Log များကို သီးသန့် လုံခြုံသော S3 Bucket ထဲတွင် ထာဝရ သိမ်းဆည်းထားခြင်း
- S3 Log File Integrity Validation ဖွင့်၍ Log များ အဖျက်ခံရခြင်း/အပြင်ခံရခြင်း ရှိမရှိ စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — AWS အိမ်တော်ကြီးတစ်ခုလုံးတွင် တပ်ဆင်ထားသော လုံခြုံရေး CCTV ကင်မရာဖြစ်ပြီး မည်သူ ဘာလုပ်သွားသည်ကို ငြင်းမရအောင် မှတ်တမ်းတင်ထားခြင်း ဖြစ်သည်။

### AWS WAF (Web Application Firewall)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ALB သို့မဟုတ် CloudFront ရှေ့တွင် WAF Web ACL ချိတ်ဆက်ခြင်း
- OWASP Top 10 Attacks (SQL Injection, Cross-Site Scripting - XSS) များကို ကာကွယ်သည့် AWS Managed Rules အသုံးပြုခြင်း
- Rate-based Rules (ဥပမာ- IP တစ်ခုတည်းမှ ၅ မိနစ်အတွင်း Request ၂,၀၀၀ ကျော် လာပါက အလိုအလျောက် Block လုပ်သည့် DDoS ကာကွယ်မှု)
- Geo-match Rules (မိမိ ဝန်ဆောင်မှု မပေးသော နိုင်ငံများမှ Traffic ကို ပိတ်ပင်ခြင်း)
- WAF Blocked Logs များကို CloudWatch / Kinesis မှတစ်ဆင့် စစ်ဆေးခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Web Application အား Hacker များ၏ SQL Injection နှင့် DDoS တိုက်ခိုက်မှုများမှ ရှေ့တန်းမှနေ၍ ဒိုင်းသဖွယ် ကာကွယ်ပေးသော စမတ်လုံခြုံရေးတံခါး ဖြစ်သည်။

### AWS Shared Responsibility Model
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Security **OF** the Cloud (AWS ၏ တာဝန် — Physical Data Center, Hardware, Virtualization Layer, Facilities)
- Security **IN** the Cloud (Customer ၏ တာဝန် — OS Updates, Application Code, Database Data, IAM, Firewall/Security Groups)
- IaaS (EC2) တွင် Customer တာဝန် အများဆုံးဖြစ်ပြီး၊ PaaS (RDS) နှင့် Serverless (Lambda/S3) တွင် AWS တာဝန် ပိုများလာပုံကို နားလည်ခြင်း
- "AWS သုံးထားရုံဖြင့် အလိုအလျောက် လုံခြုံနေမည် မဟုတ်" ဟူသော အမှန်တရားကို သဘောပေါက်ခြင်း
- Compliance နှင့် Data Privacy (GDPR, APPI Japan) အတွက် တာဝန်ယူမှု နားလည်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — မိမိ၏ အိမ်တံခါးကို သော့မခတ်မိ၍ သူခိုးဝင်ပါက အိမ်ငှားရှင် (Customer) ၏ တာဝန်သာဖြစ်ပြီး တိုက်ဆောက်ပေးသူ (AWS) ၏ တာဝန်မဟုတ်ကြောင်း ရှင်းလင်းစွာ ခွဲခြားသိမြင်ခြင်း ဖြစ်သည်။

---

## ၁.၁.၇ Monitoring & Troubleshooting

### CloudWatch Logs
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Log Group နှင့် Log Stream သဘောတရား နားလည်ခြင်း
- Retention Period သတ်မှတ်ခြင်း (Default: Never Expire ဖြစ်နေသဖြင့် မလိုအပ်ဘဲ ငွေမကုန်စေရန် ၃၀ ရက် သို့မဟုတ် ၉၀ ရက် သတ်မှတ်ခြင်း)
- CloudWatch Unified Agent တင်သွင်းပြီး `/var/log/nginx/access.log`, `/var/log/nginx/error.log` နှင့် System Log များကို ပို့ဆောင်ခြင်း
- CloudWatch Logs Insights ဖြင့် Filter Query ရေးသားခြင်း (ဥပမာ- `fields @timestamp, @message | filter @message like /error/ | sort @timestamp desc | limit 20`)
- Metric Filters ဖန်တီး၍ Error စကားလုံး ပါလာပါက Metric အဖြစ် ပြောင်းလဲရေတွက်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Server ပေါ်သို့ တစ်လုံးချင်း SSH ဝင်ကြည့်စရာမလိုဘဲ Server အားလုံး၏ Error နှင့် Log များကို နေရာတစ်နေရာတည်းတွင် စုစည်းရှာဖွေနိုင်ခြင်း ဖြစ်သည်။

### CloudWatch Metrics
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- EC2 Basic Monitoring (၅ မိနစ်တစ်ကြိမ်) vs Detailed Monitoring (၁ မိနစ်တစ်ကြိမ်)
- အဓိက Standard Metrics များ (CPUUtilization, NetworkIn, NetworkOut, DiskReadOps, DiskWriteOps)
- RAM / Memory Usage ကို Standard Metric အနေဖြင့် မရရှိနိုင်ဘဲ CloudWatch Agent ဖြင့် Custom Metric တင်ရကြောင်း သိရှိခြင်း
- RDS Metrics (DatabaseConnections, FreeStorageSpace, ReadIOPS, WriteIOPS)
- CloudWatch Dashboard ဖန်တီး၍ အရေးကြီးသော Graph များကို စုစည်းပြသခြင်း
> **💡 နားလည်ရမယ့်အချက်** — မိမိ စနစ်၏ သွေးခုန်နှုန်း၊ အပူချိန်နှင့် ကျန်းမာရေးအခြေအနေကို ကိန်းဂဏန်း ဂရပ်များဖြင့် အချိန်နှင့်တပြေးညီ မြင်တွေ့နေရခြင်း ဖြစ်သည်။

### CloudWatch Alarms
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Metric ပေါ်မူတည်၍ Alarm သတ်မှတ်ခြင်း (Static Threshold vs Anomaly Detection)
- ဥပမာ- `EC2 CPUUtilization >= 80% for 2 consecutive periods of 5 minutes`
- Alarm States ၃ ခု (OK, ALARM, INSUFFICIENT_DATA) နားလည်ခြင်း
- Alarm Trigger ဖြစ်ပါက Amazon SNS Topic သို့ Notification ပို့ဆောင်ခြင်း
- SNS မှတစ်ဆင့် Email သို့မဟုတ် Chatwork / Slack Webhook သို့ Alert ရောက်ရှိအောင် ချိတ်ဆက်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — စနစ်တွင် ပုံမှန်မဟုတ်သော အခြေအနေ ဖြစ်ပေါ်လာပါက အင်ဂျင်နီယာများထံ အရေးပေါ် အချက်ပေးခေါင်းလောင်း အလိုအလျောက် ထမြည်ပေးခြင်း ဖြစ်သည်။

### EC2 System Logs
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- EC2 Instance ထဲသို့ SSH လုံးဝ ဝင်မရတော့သည့်အခါ AWS Console မှ `Get System Log` (Console Output) ကို ကြည့်ရှုခြင်း
- Kernel Panic, Boot Failure, Out of Memory (OOM) Killer ဖြစ်ရပ်များကို စစ်ဆေးခြင်း
- `Get Instance Screenshot` ဖြင့် Server Screen အခြေအနေကို ဓာတ်ပုံရိုက်ကြည့်သကဲ့သို့ စစ်ဆေးခြင်း
- Linux Syslog (`/var/log/syslog` or `/var/log/messages`) တွင် Hardware/System level errors များ ကြည့်ရှုခြင်း
- Instance Status Checks (System Status Check vs Instance Status Check) ကွာခြားချက်
> **💡 နားလည်ရမယ့်အချက်** — Server ခေါင်းမာပြီး Login ဝင်မရအောင် သေသွားသည့်တိုင်အောင် အပြင်ဘက် AWS Console မှနေ၍ အဘယ်ကြောင့် သေသွားသည်ကို စစ်ဆေးနိုင်သော အရေးပေါ် ရောဂါရှာဖွေရေးစနစ် ဖြစ်သည်။

### Application Logs
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Application-level Logging Levels (DEBUG, INFO, WARN, ERROR, FATAL) စနစ်တကျ သုံးစွဲခြင်း
- Production တွင် DEBUG logs များကို ပိတ်ထားပြီး INFO နှင့် ERROR သာ မှတ်တမ်းတင်ခြင်း
- Structured Logging (JSON format ဖြင့် Log ထုတ်ခြင်း — CloudWatch Insights နှင့် Datadog တို့တွင် Parse လုပ်ရ လွယ်ကူစေရန်)
- Exception Stack Trace များကို ဖမ်းယူမှတ်တမ်းတင်ခြင်း
- Log Rotation (`logrotate`) ဖြင့် Server Disk ပြည့်မသွားအောင် နေ့စဉ် Compress ပြုလုပ်ပြီး သန့်ရှင်းရေးလုပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ကိုယ်ရေးထားသော Code ထဲတွင် မည်သည့် Function က Error တက်သွားသလဲ၊ မည်သည့် Data ကြောင့် ချွတ်ယွင်းသွားသလဲဆိုတာကို မျက်ခြေမပြတ် ခြေရာခံခြင်း ဖြစ်သည်။

### Health Checks
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ALB Target Group Health Check ၏ အလုပ်လုပ်ပုံ
- Dedicated Health Check Endpoint ဖန်တီးခြင်း (ဥပမာ- `/healthz` သို့မဟုတ် `/api/health`)
- Health Check Response (HTTP Status 200 OK ပြန်ရမည်ဖြစ်ပြီး DB နှင့် Cache အခြေအနေပါ စစ်ဆေးသင့်ခြင်း)
- Healthy Threshold, Unhealthy Threshold, Timeout, Interval Parameter များ ညှိယူခြင်း
- Server Unhealthy ဖြစ်သွားပါက ALB က Traffic မပို့တော့ဘဲ အလိုအလျောက် ဖယ်ထုတ်ပစ်ပုံ
> **💡 နားလည်ရမယ့်အချက်** — Server သည် အပြင်ပန်း အသက်ရှင်နေရုံမျှမက အမှန်တကယ် အလုပ်လုပ်နိုင်သေးရဲ့လားဆိုတာကို စက္ကန့်တိုင်း မေးခွန်းထုတ် စစ်ဆေးနေခြင်း ဖြစ်သည်။

### Load Balancer Logs
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- ALB Access Logs ကို S3 Bucket ထဲသို့ အလိုအလျောက် Export ထုတ်ရန် Enable ပြုလုပ်ခြင်း
- Access Log ပါ အဓိက အချက်အလက်များ (Client IP, Request Method, URL, Target Processing Time, Status Code `elb_status_code` vs `target_status_code`)
- Amazon Athena ဖြင့် S3 ထဲရှိ ALB Access Logs များကို SQL Query ရေးသားကာ စုံစမ်းစစ်ဆေးခြင်း
- မည်သည့် Client က Traffic အများဆုံး ပို့နေသလဲ (DDoS / Scraping) စစ်ဆေးခြင်း
- High Latency ဖြစ်စေသော API Endpoints များကို ရှာဖွေဖော်ထုတ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ဝဘ်ဆိုဒ်သို့ ရောက်ရှိလာသမျှ Request တိုင်း၏ အသေးစိတ် ခြေရာများကို မှတ်တမ်းတင်ထားပြီး ပြဿနာဖြစ်ပါက အကြောင်းရင်းကို ချက်ချင်း ရှာဖွေနိုင်ခြင်း ဖြစ်သည်။

### CloudTrail Event History
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- အရေးကြီးသော Infrastructure ပြောင်းလဲမှုများကို စုံစမ်းစစ်ဆေးခြင်း (ဥပမာ- မည်သူက Security Group ကို ဖျက်လိုက်သလဲ သို့မဟုတ် `0.0.0.0/0` ဖွင့်လိုက်သလဲ)
- Event Name ဖြင့် Filter လုပ်ခြင်း (`TerminateInstances`, `DeleteBucket`, `AuthorizeSecurityGroupIngress`)
- User Name သို့မဟုတ် Access Key ID ဖြင့် ရှာဖွေခြင်း
- Error Code (`AccessDenied`, `UnauthorizedOperation`) များကို ရှာဖွေ၍ Privilege Escalation အား စစ်ဆေးခြင်း
- ပြဿနာဖြစ်ပွားခဲ့သော အချိန်အတိအကျ (Timestamp) ဖြင့် Filter လုပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — စနစ်တစ်ခု ပျက်စီးသွားသောအခါ မည်သည့် Admin သို့မဟုတ် Script က မည်သည့် အမှားကို ပြုလုပ်ခဲ့သည်ကို အငြင်းပွားဖွယ်မရှိ အဖြေရှာနိုင်ခြင်း ဖြစ်သည်။

### Troubleshoot 403 / 404 / 500 / 502 / 504 Errors
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- **403 Forbidden:** IAM Policy ပိတ်ထားခြင်း၊ S3 Bucket Policy / BPA ပိတ်ထားခြင်း၊ Nginx File Permissions (`chmod/chown`) မှားယွင်းခြင်း၊ WAF Block လုပ်ခံရခြင်း
- **404 Not Found:** Nginx Routing မှားယွင်းခြင်း၊ File Path မရှိခြင်း၊ Route 53 / DNS လမ်းကြောင်းလွဲခြင်း၊ API Endpoint URL စာလုံးပေါင်းမှားခြင်း
- **500 Internal Server Error:** Application Code Crash ဖြစ်ခြင်း၊ Database Exception တက်ခြင်း၊ Unhandled Promise Rejection၊ `.env` Variable ပျောက်ဆုံးခြင်း (App Logs စစ်ဆေးရန်)
- **502 Bad Gateway:** Nginx သည် အသက်ရှင်သော်လည်း နောက်ကွယ်ရှိ Node/Python/PHP Application Daemon သေနေခြင်း သို့မဟုတ် Port မကိုက်ခြင်း (Application Process Restart လုပ်ရန်)
- **504 Gateway Timeout:** Backend Application က Process လုပ်တာ ကြာလွန်းခြင်း (Slow Query/DB Lock)၊ ALB မှ Backend သို့ ချိတ်ဆက်ရာတွင် Security Group ပိတ်နေခြင်း သို့မဟုတ် App Hang ဖြစ်နေခြင်း
> **💡 နားလည်ရမယ့်အချက်** — HTTP Status Code နံပါတ်ကို ကြည့်ရုံဖြင့် ပြဿနာသည် Client ဘက်ကလား၊ Web Server လား၊ Backend App လား၊ Network Firewall လားဆိုတာ ချက်ချင်း ခွဲခြားသိမြင်ပြီး အချိန်တိုအတွင်း ဖြေရှင်းနိုင်ရပါမည်။

---

## ၁.၁.၈ Advanced Services

### Auto Scaling
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Auto Scaling Group (ASG) ၏ အကျိုးကျေးဇူး (Traffic များလျှင် Server တိုး၊ နည်းလျှင် Server လျှော့)
- Launch Template ဖန်တီးခြင်း (AMI, Instance Type, Key Pair, Security Group, User Data Script)
- Scaling Policies (Target Tracking Scaling: CPU 50% တွင် ထိန်းထားခြင်း, Step Scaling, Scheduled Scaling)
- Min, Max, Desired Capacity သတ်မှတ်ခြင်း
- Scale-in Protection (အလုပ်လုပ်နေသော Server ကို မတော်တဆ အရင်ဖျက်မပစ်စေရန် ကာကွယ်ခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — Traffic အတက်အကျအပေါ် မူတည်ပြီး Server အရေအတွက်ကို လူမလိုဘဲ အလိုအလျောက် အတိုးအလျှော့ ပြုလုပ်ပေးခြင်းဖြင့် စရိတ်သက်သာပြီး ဝဘ်ဆိုဒ် မကျစေရန် ပြုလုပ်ခြင်း ဖြစ်သည်။

### ECS / Fargate
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Serverless Container Architecture (Fargate) ၏ အားသာချက် (EC2 OS Patching, Scaling, Capacity Management လုပ်စရာမလိုခြင်း)
- Fargate Task Definition (vCPU နှင့် Memory တိကျစွာ ခွဲဝေမှု: ဥပမာ 0.5 vCPU / 1 GB RAM)
- Private Subnet တွင် Fargate Task များ Run ခြင်းနှင့် ECR မှ Image ဆွဲရန် NAT GW သို့မဟုတ် VPC Endpoints လိုအပ်မှု
- ECS Service Auto Scaling (Container အရေအတွက်ကို Request အလိုက် အတိုးအလျှော့ လုပ်ခြင်း)
- Application Load Balancer နှင့် Dynamic Port Mapping ချိတ်ဆက်မှု
> **💡 နားလည်ရမယ့်အချက်** — ဆာဗာအလုံးလိုက် ဝယ်ယူထိန်းသိမ်းရသော ဒုက္ခမှ ကင်းဝေးပြီး Container Code သက်သက်ကိုသာ အာရုံစိုက် လည်ပတ်စေနိုင်သော ခေတ်မီ နည်းပညာ ဖြစ်သည်။

### EKS (Elastic Kubernetes Service)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Kubernetes (K8s) Control Plane ကို AWS မှ Managed လုပ်ပေးသော စနစ်ဖြစ်ကြောင်း သိရှိခြင်း
- Node Groups (Managed Node Groups vs Fargate Profiles vs Karpenter Autoscaler)
- `kubectl` CLI နှင့် `eksctl` ဖြင့် EKS Cluster စီမံခန့်ခွဲခြင်း
- AWS Load Balancer Controller ဖြင့် Kubernetes Ingress မှတစ်ဆင့် AWS ALB ကို အလိုအလျောက် ဆောက်လုပ်စေခြင်း
- IAM Roles for Service Accounts (IRSA) — Pod အဆင့်တွင် သီးသန့် AWS IAM Role ပေးအပ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ဧရာမ Enterprise Microservices စနစ်ကြီးများတွင် Container ထောင်ပေါင်းများစွာကို စံသတ်မှတ်ချက်အတိုင်း စီမံခန့်ခွဲနိုင်သော ကမ္ဘာ့အဆင့်မီ စနစ် ဖြစ်သည်။

### AWS Lambda
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Serverless Event-driven Compute (Code သက်သက် ရေးတင်ရုံဖြင့် Request လာမှသာ စက္ကန့်ပိုင်း အလုပ်လုပ်ပြီး ပြီးလျှင် ရပ်တန့်သွားခြင်း)
- Execution Limit (အများဆုံး ၁၅ မိနစ်သာ အလုပ်လုပ်နိုင်ခြင်း)
- Cold Start ၏ သဘောတရားနှင့် ဖြေရှင်းနည်းများ (Provisioned Concurrency)
- Event Sources (S3 ပေါ် ဖိုင်တင်လိုက်လျှင် Trigger ဖြစ်ခြင်း, DynamoDB Streams, SQS Message ရောက်လာလျှင် Run ခြင်း)
- Lambda Functions များအတွက် VPC Access ထည့်သွင်းခြင်း (RDS ချိတ်ဆက်လိုပါက)
> **💡 နားလည်ရမယ့်အချက်** — ၂၄ နာရီ Server ဖွင့်ထားစရာမလိုဘဲ အလုပ်ရှိမှသာ မျက်စိတစ်မှိတ်အတွင်း ထလာလုပ်ပေးပြီး သုံးစွဲသည့် မီလီစက္ကန့်အတွက်သာ ငွေပေးရသော အလွန်ချွေတာသည့် ကွန်ပျူတာ စနစ် ဖြစ်သည်။

### Amazon API Gateway
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- REST APIs vs HTTP APIs (HTTP API သည် ၇၀% စျေးပိုသက်သာပြီး ပိုမိုမြန်ဆန်ခြင်း)
- API Routing, Methods (GET, POST, PUT, DELETE) နှင့် Lambda Integration
- Lambda Authorizers သို့မဟုတ် Cognito User Pools ဖြင့် JWT Token စစ်ဆေး အတည်ပြုခြင်း
- Throttling နှင့် Quotas (DDoS နှင့် API အလွဲသုံးစားမှု ကာကွယ်ရန် Rate Limit သတ်မှတ်ခြင်း)
- API Versioning နှင့် Stages (`dev`, `staging`, `prod`) စီမံခန့်ခွဲခြင်း
> **💡 နားလည်ရမယ့်အချက်** — ပြင်ပ Mobile App နှင့် Frontend များမှ လာသော API Request များကို လုံခြုံစွာ စိစစ်လက်ခံပြီး Backend Lambda သို့မဟုတ် Service များဆီသို့ ပို့ဆောင်ပေးသော တံခါးစောင့် ဖြစ်သည်။

### Amazon SQS (Simple Queue Service)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Message Decoupling (စနစ်တစ်ခုနှင့် တစ်ခုကြား တိုက်ရိုက် မချိတ်ဘဲ ကြားခံ တန်းစီဇယား ထားရှိခြင်း)
- Standard Queue (Unlimited throughput, At-least-once delivery, Best-effort ordering)
- FIFO Queue (First-In-First-Out, အစဉ်လိုက် တိကျစွာ ပို့ဆောင်ခြင်း, Exactly-once processing)
- Visibility Timeout သဘောတရား (Worker က Message ကို စတင်လုပ်ဆောင်နေစဉ် အခြား Worker မမြင်နိုင်အောင် ဖျောက်ထားခြင်း)
- Dead Letter Queue (DLQ) — အကြိမ်ကြိမ် လုပ်ဆောင်သော်လည်း Error တက်နေသော Message များကို သီးခြား ခွဲထုတ်သိမ်းဆည်းခြင်း
> **💡 နားလည်ရမယ့်အချက်** — User များပြားချိန်တွင် စနစ်ကြီး ပြိုကျမသွားစေရန် Email ပို့ခြင်း၊ PDF ထုတ်ခြင်းစသည့် အလုပ်များကို တန်းစီဇယားထဲ ထည့်ထားပြီး နောက်ကွယ်မှ ဖြည်းဖြည်းချင်း ပြီးစီးအောင် ဖြေရှင်းစေခြင်း ဖြစ်သည်။

### Amazon SNS (Simple Notification Service)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Publish / Subscribe (Pub/Sub) Messaging Architecture
- Topic ဖန်တီးခြင်းနှင့် Subscribers (Email, SMS, Lambda, SQS, HTTP Webhooks) ချိတ်ဆက်ခြင်း
- Fan-Out Pattern (SNS Topic တစ်ခုတည်းသို့ Publish လုပ်လိုက်ရုံဖြင့် အောက်ရှိ SQS Queue များစွာနှင့် Lambda များဆီသို့ တစ်ပြိုင်နက် သတင်းဖြန့်ဝေခြင်း)
- Message Filtering (Subscriber က မိမိနှင့် သက်ဆိုင်သော Message Attributes များကိုသာ ရွေးယူခြင်း)
- CloudWatch Alarms မှတစ်ဆင့် အင်ဂျင်နီယာများထံ အရေးပေါ် သတိပေးစာ ပို့ဆောင်ရာတွင် အဓိက အသုံးပြုခြင်း
> **💡 နားလည်ရမယ့်အချက်** — အရေးကြီး သတင်းတစ်ခု ထွက်ပေါ်လာပါက သက်ဆိုင်ရာ ဌာနအားလုံးနှင့် စနစ်အားလုံးဆီသို့ တစ်ပြိုင်နက်တည်း အသံချဲ့စက်ဖြင့် အသိပေး ကြေညာပေးနိုင်သော စနစ် ဖြစ်သည်။

### Amazon ElastiCache (Redis)
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- In-memory Data Store ၏ သဘောတရား (Microsecond latency ဖြင့် အလွန်လျင်မြန်စွာ ဖတ်/ရေးနိုင်ခြင်း)
- Caching Strategy (Cache-Aside / Lazy Loading, Write-Through)
- Database Query Caching (ပြောင်းလဲမှုနည်းသော Data များကို Redis တွင် Cache လုပ်၍ RDS ပေါ် ဝန်လျှော့ချခြင်း)
- Session Store (User Login Sessions များကို Redis တွင် သိမ်းဆည်း၍ Multi-Server Architecture တွင် အသုံးပြုခြင်း)
- Redis Cluster, Multi-AZ with Auto-Failover နှင့် In-transit/At-rest Encryption
> **💡 နားလည်ရမယ့်အချက်** — အမြဲတစေ မေးလေ့ရှိသော အချက်အလက်များကို Database ထဲ သွားမရှာတော့ဘဲ Memory ပေါ်တွင် ကြိုတင်တင်ထားခြင်းဖြင့် ဝဘ်ဆိုဒ်ကို လျှပ်စီးကဲ့သို့ မြန်ဆန်စေခြင်း ဖြစ်သည်။

### AWS Backup
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- Centralized Backup Management (EBS, RDS, S3, EFS, DynamoDB အားလုံးကို နေရာတစ်ခုတည်းမှ ဗဟိုချုပ်ကိုင် Backup ယူခြင်း)
- Backup Plans ဖန်တီးခြင်း (Backup Schedule: နေ့စဉ် ညသန်းခေါင်, Retention Period: ရက် ၃၀)
- Resource Assignment (Tags ဖြင့် အလိုအလျောက် သတ်မှတ်ခြင်း: ဥပမာ `Backup = Daily` ဟု Tag ကပ်ထားသော Resource အားလုံးကို Backup ယူခြင်း)
- Cross-Region and Cross-Account Backup (သဘာဝဘေးနှင့် Ransomware ဘေးမှ ကာကွယ်ရန် အခြား Account သို့ မိတ္တူကူးခြင်း)
- AWS Backup Vault Lock (မည်သူမျှ သတ်မှတ်ကာလ မပြည့်မချင်း Backup ကို ဖျက်၍မရအောင် ပိတ်ဆို့ခြင်း)
> **💡 နားလည်ရမယ့်အချက်** — AWS Services တစ်ခုချင်းစီ လိုက်လံ Backup ယူရသော ဒုက္ခမှ ကင်းဝေးပြီး ကုမ္ပဏီတစ်ခုလုံး၏ ပိုင်ဆိုင်မှုအားလုံးကို အလိုအလျောက် နေ့စဉ် မပျက်မကွက် မိတ္တူကူး သိမ်းဆည်းပေးခြင်း ဖြစ်သည်။

### AWS Budgets & Cost Explorer
**မဖြစ်မနေ လုပ်ဆောင်/လေ့လာရမည့်အချက်များ**
- AWS Budgets ဖန်တီးခြင်း (လစဉ် သတ်မှတ်ငွေပမာဏ ထားရှိခြင်း: ဥပမာ $20/month သို့မဟုတ် $100/month)
- Actual Spend နှင့် Forecasted Spend (ခန့်မှန်းကုန်ကျငွေ) က ၈၀% ကျော်လွန်ပါက Email သို့ အရေးပေါ် Alert ပို့ခိုင်းခြင်း
- AWS Cost Explorer ဖြင့် မည်သည့် Service က မည်သည့်နေ့တွင် ငွေအများဆုံး ကုန်ကျနေသည်ကို Graph ဖြင့် ခွဲခြမ်းစိတ်ဖြာခြင်း
- Cost Allocation Tags (`Environment=production`, `Project=ecommerce`) တပ်ဆင်၍ ကုန်ကျစရိတ် ခွဲခြမ်းခြင်း
- Free Tier Limits ကို အမြဲစောင့်ကြည့်ခြင်းနှင့် မသုံးတော့သော Elastic IPs, NAT Gateways, Unattached EBS Volumes များကို ချက်ချင်း ဖျက်ပစ်ခြင်း
> **💡 နားလည်ရမယ့်အချက်** — Cloud သုံးစွဲရာတွင် မထင်မှတ်ဘဲ ဘေလ်များ အဆမတန် တက်မလာစေရန် ကြိုတင် ဘရိတ်အုပ်ထားပြီး ပိုက်ဆံ မပေါက်ကြားအောင် စောင့်ကြပ်ခြင်း ဖြစ်သည်။

---

## ၁.၁.၉ Recommended Learning Order (အဆင့် ၁ မှ ၁၂ ထိ စနစ်တကျ လေ့လာရန် လမ်းစဉ်)

Cloud ပညာရပ်ကို လေ့လာရာတွင် ရှေ့နောက်မညီပါက နားလည်ရခက်ခဲတတ်ပါသည်။ အောက်ပါ အဆင့် (၁၂) ဆင့် အတိုင်း စနစ်တကျ လက်တွေ့ တည်ဆောက် လေ့လာသွားရပါမည်-

```
+---------------------------------------------------------------------------------------------------+
| 1. EC2 + Linux        -> 2. VPC + Security Groups -> 3. IAM               -> 4. RDS + DB Connect  |
| 5. S3                 -> 6. Route 53 + ACM        -> 7. ALB + CloudFront  -> 8. CloudWatch        |
| 9. Docker + ECR + ECS -> 10. IaC + CI/CD          -> 11. Security + FinOps-> 12. Auto Scaling + Adv|
+---------------------------------------------------------------------------------------------------+
```

### အဆင့် ၁။ EC2 + Linux
- **ရည်ရွယ်ချက်:** Cloud ပေါ်တွင် Virtual Server တစ်လုံးကို အခြေခံကျကျ စတင်လည်ပတ်နိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** EC2 Ubuntu instance တစ်လုံး ဆောက်မည်။ SSH ဖြင့် ဝင်မည်။ Linux commands များ လေ့ကျင့်ပြီး Nginx တင်ကာ "Hello World" ဝဘ်စာမျက်နှာကို Browser မှ လှမ်းခေါ်ပြသနိုင်ရမည်။
- **Milestone:** Linux Terminal ပေါ်တွင် ရဲရဲဝံ့ဝံ့ အလုပ်လုပ်နိုင်ခြင်း။

### အဆင့် ၂။ VPC + Security Groups
- **ရည်ရွယ်ချက်:** Default VPC ကို အားမကိုးဘဲ ကိုယ်ပိုင် Custom Network တည်ဆောက်နိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** Public Subnet ၂ ခု၊ Private Subnet ၂ ခုပါသော VPC ဆောက်မည်။ Internet Gateway နှင့် NAT Gateway တပ်ဆင်မည်။ Security Groups များကို Inbound/Outbound စနစ်တကျ စည်းကမ်းသတ်မှတ်မည်။
- **Milestone:** Private Subnet ထဲရှိ Server များသည် အပြင်သို့ မပေါက်ဘဲ NAT မှတစ်ဆင့်သာ Internet ထွက်နိုင်ပုံကို လက်တွေ့ မျက်မြင်နားလည်ခြင်း။

### အဆင့် ၃။ IAM
- **ရည်ရွယ်ချက်:** စနစ်လုံခြုံရေးနှင့် ခွင့်ပြုချက်များကို စနစ်တကျ ပိုင်နိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** IAM User ဆောက်ပြီး MFA ဖွင့်မည်။ EC2 အတွက် S3 သို့ ဝင်ခွင့်ရှိသော IAM Role ဖန်တီးပြီး Attach လုပ်မည်။ EC2 ပေါ်မှ AWS CLI ဖြင့် S3 ဖိုင်များကို သော့မလိုဘဲ ဖတ်ပြမည်။
- **Milestone:** Access Key များကို Hardcode မလုပ်တော့ဘဲ IAM Role ဖြင့်သာ လုံခြုံစွာ အသုံးပြုတတ်ခြင်း။

### အဆင့် ၄။ RDS + Database Connection
- **ရည်ရွယ်ချက်:** Web Application နှင့် Database ကို သီးခြားခွဲထုတ် တည်ဆောက်နိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** Private Subnet ထဲတွင် RDS MySQL instance ဆောက်မည်။ Public Access ပိတ်ထားမည်။ Public EC2 ပေါ်ရှိ Application မှတစ်ဆင့် RDS သို့ 3306 ဖြင့် အောင်မြင်စွာ Data CRUD ချိတ်ဆက်မည်။
- **Milestone:** 2-Tier Web Architecture (Web + DB) ကို Cloud စံနှုန်းအတိုင်း တည်ဆောက်နိုင်ခြင်း။

### အဆင့် ၅။ S3
- **ရည်ရွယ်ချက်:** Static Files နှင့် User Upload များကို Scalable Storage သို့ လွှဲပြောင်းနိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** S3 Bucket ဖန်တီးမည်။ Block Public Access ဖွင့်ထားမည်။ App မှတစ်ဆင့် ပုံများကို S3 သို့ Upload တင်မည်။ ယာယီ ကြည့်ရှုနိုင်ရန် Presigned URL ထုတ်ပေးမည်။
- **Milestone:** Server Disk ပေါ်တွင် User ဖိုင်များ မသိမ်းတော့ဘဲ Stateless Architecture စတင် ဖြစ်ပေါ်လာခြင်း။

### အဆင့် ၆။ Route 53 + ACM
- **ရည်ရွယ်ချက်:** IP Address များအစား တကယ့် Domain Name နှင့် လုံခြုံသော HTTPS ရရှိစေရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** ကိုယ်ပိုင် Domain တစ်ခုကို Route 53 Hosted Zone နှင့် ချိတ်မည်။ ACM မှ Free SSL Certificate တောင်းယူပြီး DNS Validation ပြုလုပ်မည်။
- **Milestone:** ဝဘ်ဆိုဒ်ကို `https://yourdomain.com` ဖြင့် အစိမ်းရောင် သော့ခတ်ပုံစံ အောင်မြင်စွာ မြင်တွေ့ရခြင်း။

### အဆင့် ၇။ ALB + CloudFront
- **ရည်ရွယ်ချက်:** High Availability ရရှိစေရန်နှင့် ကမ္ဘာအနှံ့ မြန်ဆန်စွာ ဖွင့်နိုင်စေရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** EC2 နှစ်လုံးရှေ့တွင် Application Load Balancer ခံမည်။ ACM SSL တပ်ဆင်မည်။ အရှေ့ဆုံးမှ CloudFront CDN ခံပြီး Static Files များကို Cache လုပ်မည်။
- **Milestone:** Server တစ်လုံး ပျက်သွားသော်လည်း ဝဘ်ဆိုဒ် လုံးဝ မရပ်တန့်တော့သည့် အဆင့်သို့ ရောက်ရှိခြင်း။

### အဆင့် ၈။ CloudWatch
- **ရည်ရွယ်ချက်:** စနစ်၏ ကျန်းမာရေးကို စဉ်ဆက်မပြတ် စောင့်ကြည့် စစ်ဆေးနိုင်ရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** EC2 နှင့် Nginx logs များကို CloudWatch Logs သို့ တင်မည်။ CPU > 70% ဖြစ်ပါက Email/Discord သို့ အချက်ပေးခေါင်းလောင်း (Alarm) တပ်ဆင်မည်။
- **Milestone:** Error တက်လာပါက User မပြောမီ အင်ဂျင်နီယာက အရင်သိရှိပြီး ပြုပြင်နိုင်ခြင်း။

### အဆင့် ၉။ Docker + ECR + ECS
- **ရည်ရွယ်ချက်:** ခေတ်သစ် Containerized Microservices နည်းပညာသို့ ကူးပြောင်းရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** Application ကို Dockerfile ဖြင့် Image build မည်။ Amazon ECR သို့ Push မည်။ ECS Fargate ဖြင့် Serverless Container တည်ဆောက်ပြီး ALB နှင့် ချိတ်ဆက် Run မည်။
- **Milestone:** EC2 Server ကိုယ်တိုင် ပြုပြင်ထိန်းသိမ်းရသည့် ဒုက္ခမှ ကင်းဝေးသွားခြင်း။

### အဆင့် ၁၀။ CloudFormation + CI/CD
- **ရည်ရွယ်ချက်:** လက်ဖြင့် ကလစ်နှိပ်ခြင်းများကို ရပ်တန့်ပြီး Automation စနစ်သို့ ကူးပြောင်းရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** CloudFormation သို့မဟုတ် Terraform ဖြင့် VPC, ALB, ECS များကို Code အဖြစ် ရေးသားမည်။ GitHub Actions ဖြင့် Git Push လိုက်သည်နှင့် ECS ပေါ်သို့ အလိုအလျောက် Deploy ဖြစ်အောင် ချိတ်ဆက်မည်။
- **Milestone:** ကုဒ်တင်လိုက်ရုံဖြင့် အစအဆုံး အလိုအလျောက် စနစ်တကျ Deploy လုပ်ပေးသော DevOps စနစ် ရရှိခြင်း။

### အဆင့် ၁၁။ Security + Backup + Cost Management
- **ရည်ရွယ်ချက်:** Enterprise အဆင့် ခိုင်မာသော လုံခြုံရေး၊ ဘေးအန္တရာယ် ကာကွယ်ရေးနှင့် ငွေကြေး ထိန်းသိမ်းရေး ရရှိရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** AWS WAF ဖြင့် SQLi/DDoS ကာကွယ်မည်။ CloudTrail ဖြင့် Audit log သိမ်းမည်။ AWS Backup ဖြင့် Daily Automated Backup ချိတ်မည်။ AWS Budgets ဖြင့် လစဉ်ကုန်ကျငွေ ကန့်သတ်ချက် သတ်မှတ်မည်။
- **Milestone:** ကုမ္ပဏီဒေတာများ ပျောက်ဆုံးခြင်း၊ ပေါက်ကြားခြင်းနှင့် ဘေလ်အဆမတန် တက်ခြင်းတို့မှ ၁၀၀% ကာကွယ်နိုင်ခြင်း။

### အဆင့် ၁၂။ Auto Scaling + Advanced Services
- **ရည်ရွယ်ချက်:** Production စနစ်ကြီးကို အဆုံးစွန် စွမ်းဆောင်ရည်မြင့်မားပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေရန်။
- **လက်တွေ့လုပ်ဆောင်ချက်:** Auto Scaling ဖြင့် User များလာပါက Container/Server အလိုအလျောက် တိုးစေမည်။ Redis (ElastiCache) ဖြင့် Query Cache မည်။ Background Jobs များကို SQS / SNS / Lambda ဖြင့် Asynchronous ဖြစ်အောင် ခွဲထုတ်မည်။
- **Milestone:** User သန်းချီ ဝင်ရောက်လာသော်လည်း ဖြုံမသွားဘဲ ချောမွေ့စွာ ဝန်ဆောင်မှုပေးနိုင်သော Senior Cloud Architect အဆင့်သို့ ရောက်ရှိခြင်း။

---

# ၂။ Level 1 — Cloud Computing & AWS Fundamentals & Networking Basics

## ၂.၁ Cloud Computing ဆိုတာဘာလဲ & On-premises vs Cloud

### ဒီ Concept က ဘာလဲ? (What is it?)
**Cloud Computing** ဆိုသည်မှာ ကွန်ပျူတာ Hardware များ (Server, CPU, RAM, Hard Disk, Network Switch, Router) ကို မိမိတို့ရုံးခန်းထဲတွင် ကိုယ်တိုင်ဝယ်ယူ ထားရှိစရာမလိုဘဲ **Internet မှတစ်ဆင့် လိုအပ်သလောက် Instant ငှားရမ်းအသုံးပြုပြီး အသုံးပြုသလောက်သာ ပေးချေရသော စနစ် (On-demand delivery of IT resources over the internet with pay-as-you-go pricing)** ဖြစ်သည်။

### ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ဥပမာ:** Tokyo အခြေစိုက် EC Site (Online Shopping Mall) တစ်ခုသည် "Black Friday" သို့မဟုတ် "New Year Sale" ကာလတွင် User ပေါင်း ၁ သန်း တစ်ပြိုင်နက်တည်း ဝင်ရောက်လာမည်။
- **On-premises ပြဿနာ:** ထို User ပမာဏကို ခံနိုင်ရန် Server Hardware အလုံး ၅၀ ကို ကြိုတင်ဝယ်ယူရမည် (ကုန်ကျစရိတ် ယန်းသန်းပေါင်းများစွာ ကုန်ကျပြီး ဝယ်ယူတပ်ဆင်ရန် ၃ လ ကြာမြင့်သည်)။ Sale ပြီးသွားပါက ထို Server ၄၀ ကျော်သည် အသုံးမရှိဘဲ လျှပ်စစ်ခနှင့် ရုံးခန်းနေရာ အလဟဿ ကုန်ကျနေမည်။
- **Cloud ဖြေရှင်းချက်:** Sale စတင်သည့် နာရီပိုင်းအတွင်း AWS Auto Scaling ဖြင့် Server အလုံးရေ ၅၀ သို့ အလိုအလျောက် တိုးမြှင့်လိုက်ပြီး Sale ပြီးဆုံးပါက မူလ ၅ လုံးသို့ ပြန်လည် လျှော့ချပစ်သည်။ သုံးစွဲခဲ့သည့် နာရီပိုင်းအတွက်သာ ငွေရှင်းရသည်။

### On-Premises နှင့် AWS နှိုင်းယှဉ်ချက် ဇယား
| Feature | On-Premises (オンプレミス) | AWS Cloud (アマゾン クラウド) |
| :--- | :--- | :--- |
| **Initial Cost (初期費用)** | အလွန်မြင့်မား (CapEx - Capital Expenditure) | မရှိသလောက်နည်းပါး (OpEx - Operating Expense) |
| **Setup Time (構築期間)** | ရက်သတ္တပတ်မှ လပေါင်းများစွာ ကြာမြင့် | မိနစ်ပိုင်းအတွင်း ရရှိ |
| **Maintenance (保守・運用)** | Hardware, Power, Fan, Cable ကိုယ်တိုင်ပြင်ရသည် | AWS က Physical Data Center အကုန်တာဝန်ယူသည် |
| **Scalability (拡張性)** | Server အသစ်ထပ်ဝယ်ရသည် (ခက်ခဲ) | Click တစ်ချက် သို့မဟုတ် Auto Scaling ဖြင့် အကန့်အသတ်မရှိ တိုးနိုင် |
| **Disaster Recovery (DR)** | အခြားမြို့တွင် ဒုတိယ Data Center ငှားရ၍ အကုန်အကျများ | Multi-AZ သို့မဟုတ် Region အခြားသို့ Data replicate လုပ်ရုံ |

---

## ၂.၂ IaaS, PaaS, SaaS ကွာခြားချက်များ & Shared Responsibility Model

### ဒီ Models တွေက ဘာလဲ? (What are they?)
Cloud ဝန်ဆောင်မှု ၃ မျိုးတွင် မိမိနှင့် Cloud Provider အကြား တာဝန်ခွဲဝေမှု (Shared Responsibility Model) ကွာခြားပါသည်:

```
+-------------------------------------------------------------------------+
|                  SHARED RESPONSIBILITY MODEL COMPARISON                 |
|                                                                         |
| Layer                 | On-Premises |   IaaS    |   PaaS    |   SaaS    |
|-----------------------+-------------+-----------+-----------+-----------|
| Applications          |   YOU       |   YOU     |   YOU     |  Provider |
| Data                  |   YOU       |   YOU     |   YOU     |  Provider |
| Runtime               |   YOU       |   YOU     |  Provider |  Provider |
| Middleware            |   YOU       |   YOU     |  Provider |  Provider |
| Operating System (OS) |   YOU       |   YOU     |  Provider |  Provider |
| Virtualization        |   YOU       |  Provider |  Provider |  Provider |
| Servers / Hardware    |   YOU       |  Provider |  Provider |  Provider |
| Storage               |   YOU       |  Provider |  Provider |  Provider |
| Networking            |   YOU       |  Provider |  Provider |  Provider |
+-------------------------------------------------------------------------+
```

1. **IaaS (Infrastructure as a Service):**  
   - **ဥပမာ:** Amazon EC2, Amazon VPC, Amazon EBS။  
   - AWS က Physical Server, Storage, Network Switch များကို တာဝန်ယူသည်။ OS (Ubuntu, Amazon Linux), Software, Security Patches, Application Code များကို မိမိတို့က တာဝန်ယူရသည်။
2. **PaaS (Platform as a Service):**  
   - **ဥပမာ:** AWS Elastic Beanstalk, AWS App Runner, AWS Lambda။  
   - OS နှင့် Runtime (PHP, Node.js, Python) ကိုပါ AWS က စီမံပေးသည်။ မိမိတို့က Application Code နှင့် Database Data သာ တင်ရန် လိုသည်။
3. **SaaS (Software as a Service):**  
   - **ဥပမာ:** Slack, Gmail, Zoom, Salesforce, AWS WorkMail။  
   - မည်သည့် Code မှ ရေးစရာမလိုဘဲ အသင့်သုံး Software ကို Browser မှတစ်ဆင့် သုံးစွဲခြင်း ဖြစ်သည်။

---

## ၂.၃ Cloud Core Characteristics

ဂျပန် IT လုပ်ငန်းခွင်တွင် မကြာခဏ အသုံးပြုရသော Architecture Terms များ:
- **Scalability (拡張性 - Kakuchousei):** Workload တိုးလာသည့်အခါ System က Server အင်အားကို ကြီးထွားနိုင်စွမ်း (Scale Up = CPU/RAM မြှင့်ခြင်း, Scale Out = Server အလုံးရေတိုးခြင်း)။
- **Elasticity (弾力性 - Danryokusei):** Traffic များလာလျှင် Server အလိုအလျောက်တိုးလာပြီး Traffic နည်းသွားပါက ကုန်ကျစရိတ်သက်သာစေရန် Server ပြန်လည်လျော့ကျသွားသော သဘောတရား (ဥပမာ- AWS Auto Scaling)။
- **High Availability - HA (高可用性 - Koukayousei):** Hardware တစ်ခုခု ပျက်စီးသွားသော်လည်း Service ပျက်ကျမသွားဘဲ အမြဲအလုပ်လုပ်နေစေခြင်း (ဥပမာ- Multi-AZ Deployment)။
- **Fault Tolerance (耐障害性 - Taishougaisei):** Component တစ်ခု (Server သို့မဟုတ် Data Center တစ်ခု) ပျက်ကျသွားသော်လည်း Zero Downtime ဖြင့် Auto Failover လုပ်နိုင်ခြင်း။
- **Disaster Recovery - DR (ディザスタリカバリ):** ငလျင်လှုပ်ခြင်း၊ ရေကြီးခြင်း၊ စစ်ပွဲ စသည့် မမျှော်လင့်သော ကပ်ဘေးများကြောင့် Data Center တစ်ခုလုံး ပျက်စီးသွားပါက အခြား Region သို့ ပြန်လည် Restore လုပ်နိုင်သော စနစ်။
- **Pay-as-you-go (従量課金制 - Juuryou Kakisei):** မိမိအသုံးပြုသည့် အချိန် (နာရီ/မိနစ်/စက္ကန့်) နှင့် Data Storage ပမာဏအလိုက်သာ အတိအကျ ပေးချေရသော စနစ်။

---

## ၂.၄ Beginner မဖြစ်မနေသိရမည့် Networking အခြေခံများ

AWS ကို ကောင်းမွန်စွာ နားလည်ရန် အခြေခံ Network ဗဟုသုတ မဖြစ်မနေ လိုအပ်ပါသည်:

1. **IP Address (Internet Protocol Address):** Network ပေါ်ရှိ စက်တစ်ခုချင်းစီ၏ လိပ်စာ (ဥပမာ- `192.168.1.1` သို့မဟုတ် `10.0.1.50`)။
2. **Public IP vs Private IP:**
   - **Public IP:** Internet ပေါ်မှ တိုက်ရိုက်ခေါ်ယူနိုင်သော ကမ္ဘာ့ Global Address (ဥပမာ- Website များ၊ ALB များတွင် သုံးသည်)။
   - **Private IP:** မိမိတို့၏ VPC သို့မဟုတ် Local Network အတွင်းတွင်သာ အချင်းချင်း ဆက်သွယ်နိုင်သော အတွင်းလိပ်စာ (Internet မှ တိုက်ရိုက် Hack မရနိုင်သဖြင့် Database နှင့် Backend Server များကို Private IP ဖြင့်သာ ထားရှိရသည်)။
3. **CIDR Notation (Classless Inter-Domain Routing) တွက်နည်း:**  
   - `10.0.0.0/16` -> Host bits မှာ `32 - 16 = 16` ဖြစ်သဖြင့် $2^{16} = 65,536$ IPs ရရှိသည်။
   - `10.0.1.0/24` -> Host bits မှာ `32 - 24 = 8` ဖြစ်သဖြင့် $2^8 = 256$ IPs ရရှိသည်။
   - *AWS Reserved IPs Rule:* Subnet တစ်ခုစီတွင် IP ၅ ခုကို AWS က Reserve လုပ်ထားပါသည်:
     - `.0` -> Network Address
     - `.1` -> VPC Router
     - `.2` -> AWS DNS Server
     - `.3` -> Future Reserved
     - `.255` -> Broadcast Address
     - ထို့ကြောင့် `/24` တွင် အမှန်တကယ် စက်များအား ပေးနိုင်သော IP မှာ `256 - 5 = 251` ခုသာ ဖြစ်သည်။
4. **Port Numbers (ポート番号):**
   - `Port 80`: HTTP (Plain Web Traffic)
   - `Port 443`: HTTPS (Encrypted Secure Web Traffic)
   - `Port 22`: SSH (Linux Terminal Remote Access)
   - `Port 3306`: MySQL / Amazon Aurora MySQL Database
   - `Port 5432`: PostgreSQL Database
   - `Port 6379`: Redis Cache
5. **TCP vs UDP:**
   - **TCP:** Handshake လုပ်ပြီး Packet များ မပျောက်မပျက်ရောက်အောင် သေချာပို့သည် (HTTP, HTTPS, SSH, Database)။
   - **UDP:** မြန်ဆန်မှုကို ဦးစားပေးပြီး Packet ဆုံးရှုံးမှုကို ဂရုမစိုက် (Live Video Streaming, Online Voice Calls, DNS Query)။
6. **DNS (Domain Name System):** လူနားလည်လွယ်သော နာမည် (`example.com`) ကို စက်နားလည်သော IP (`54.238.12.34`) သို့ ပြောင်းပေးသည့် စနစ် (AWS Route 53)။
7. **NAT (Network Address Translation):** Private Subnet ထဲရှိ Server များက အပြင် Internet သို့ Software Package Download ဆွဲရန် Private IP ကို Public IP အဖြစ် ယာယီ Mask လုပ်ပေးပြီး ပြန်ထွက်စေသော စနစ် (AWS NAT Gateway)။

---

## ၂.၅ AWS Global Infrastructure (Region, AZ, Edge Location)

AWS ၏ ကမ္ဘာလုံးဆိုင်ရာ အခြေခံအဆောက်အအုံကို အဓိက ၃ မျိုး ခွဲခြားထားပါသည်:

```
                       [ AWS Global Infrastructure ]
                                    |
          +-------------------------+-------------------------+
          |                                                   |
   [ AWS Regions ]                                    [ Edge Locations ]
          |                                                   |
+---------+---------+                               (CloudFront CDN / Route 53)
|                   |                                 ကမ္ဘာအနှံ့ 600+ နေရာတွင်ရှိပြီး
Tokyo Region      Osaka Region                         Static files များကို User အနီးဆုံးမှ
(ap-northeast-1)  (ap-northeast-3)                     Cache လုပ်၍ မြန်ဆန်စွာ ပို့ပေးသည်။
      |
+-----+---------------------------+
|                                 |
Availability Zone A     Availability Zone C     Availability Zone D
(ap-northeast-1a)       (ap-northeast-1c)       (ap-northeast-1d)
[ Data Center 1 ]       [ Data Center 2 ]       [ Data Center 3 ]
(တစ်ခုနှင့်တစ်ခု ကီလိုမီတာ ဆယ်နှင့်ချီ ကွာဝေးပြီး သီးခြား မီးလိုင်း၊ သီးခြား Fiber ကြိုးဖြင့် ချိတ်ဆက်ထားသည်)
```

### Japan Project များတွင် Region နှင့် AZ ရွေးချယ်မှု စည်းမျဉ်းများ
1. **Tokyo Region (`ap-northeast-1`):**  
   Japan ရှိ Project အများစု (95%) သည် Tokyo Region ကို အဓိက Primary Region အဖြစ် အသုံးပြုကြသည်။ Latency အလွန်နည်းပြီး Feature အားလုံး အပြည့်အစုံ ရရှိသည်။
2. **Osaka Region (`ap-northeast-3`):**  
   **Disaster Recovery (DR)** နှင့် Kansai ဒေသအတွက် ဖြစ်သည်။ Tokyo တွင် ကြီးမားသော ငလျင်လှုပ်ခတ်ပါက Tokyo မှ Data များကို Osaka Region သို့ Failover လုပ်နိုင်ရန် Backup Secondary Region အဖြစ် သုံးသည်။
3. **Availability Zone (AZ) တစ်ခုတည်း သုံးရင် ဘာ Risk ရှိလဲ?**  
   ထို AZ တည်ရှိရာ Data Center တွင် မီးပျက်ခြင်း၊ Hardware ပြဿနာဖြစ်ခြင်း သို့မဟုတ် Fiber Cable ပြတ်တောက်ပါက မိမိတို့ Web System တစ်ခုလုံး Down သွားမည် (Single Point of Failure - SPOF)။
4. **Multi-AZ Architecture မဖြစ်မနေ လိုအပ်ပုံ:**  
   Production Web System များတွင် အနည်းဆုံး AZ ၂ ခု (ဥပမာ- `ap-northeast-1a` နှင့် `ap-northeast-1c`) တွင် Server နှင့် Database များကို ခွဲထားရမည်။ တစ်ဖက် AZ ပျက်ကျသော်လည်း အခြားတစ်ဖက် AZ ရှိ Server များက ဆက်လက် Run နေမည် ဖြစ်သည်။

---

# ၃။ Level 2 — IAM, VPC & EC2 Core Infrastructure

---

## ၃.၁ AWS IAM (Identity & Access Management)

### ဒီ Service က ဘာလဲ? (What is it?)
AWS IAM သည် AWS Resource များကို မည်သူ (Who) က မည်သည့် အခွင့်အရေး (What Actions) ဖြင့် ဝင်ရောက်အသုံးပြုခွင့် ရမည်ကို ထိန်းချုပ်ပေးသော **Authentication & Authorization Service** ဖြစ်သည်။ Global Service ဖြစ်ပြီး Region ရွေးစရာမလိုပါ။

### ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ပြဿနာ:** ကုမ္ပဏီတစ်ခုတွင် Developer ၁၀ ဦး ရှိသည်။ အားလုံးကို Root Account Login ပေးထားပါက အသစ်ဝင်လာသော Junior Developer တစ်ဦးက မတော်တဆ Production Database ကို ဖျက်ပစ်မိခြင်း သို့မဟုတ် တစ်ဦးဦး၏ ကွန်ပျူတာ Hack ခံရပါက AWS Account တစ်ခုလုံး ဆုံးရှုံးနိုင်သည်။
- **ဖြေရှင်းချက်:** IAM ဖြင့် Tanaka-san အား Developer Role (S3/EC2 သာ ကြည့်ခွင့်) ပေးထားပြီး DB ဖျက်ခွင့် (DeleteDBInstance) ကို လုံးဝ ပိတ်ထားနိုင်သည်။

### IAM Core Concepts:
- **Root User:** AWS စတင်ဖွင့်စဉ်က Email/Password ဖြင့် ဝင်သော Superuser။ Production တွင် နေ့စဉ် အလုပ်များအတွက် **လုံးဝ မသုံးရပါ**။ MFA ခတ်ပြီး သိမ်းထားရမည်။
- **IAM User:** ဝန်ထမ်းတစ်ဦးချင်းစီအတွက် သီးသန့် အကောင့်။
- **IAM Group:** Permissions တူညီသော User အစုအဝေး (`Developers`, `BillingAdmins`)။
- **IAM Role:** လူမဟုတ်ဘဲ **AWS Service အချင်းချင်း ဝင်ရောက်ခွင့် (ဥပမာ- EC2 က S3 သို့ Access လုပ်ရန်)** အတွက် ယာယီ STS Token ထုတ်ပေးသော စနစ်။
- **IAM Policy:** JSON Format ဖြင့် ရေးသားထားသော ခွင့်ပြုချက် စာတမ်း:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnlyForApp",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-japan-production-bucket",
        "arn:aws:s3:::my-japan-production-bucket/*"
      ]
    }
  ]
}
```

### Golden Security Rule
> **CRITICAL SECURITY RULE:**  
> Application Source Code သို့မဟုတ် Git Repository (`.env`, `config.php`) ထဲတွင် AWS Access Key ID နှင့် Secret Access Key များကို **ဘယ်တော့မှ Hardcode မထည့်ရပါ**။  
> EC2 သို့မဟုတ် ECS Container များအတွက် **IAM Role (Instance Profile / Task Role)** ကိုသာ မဖြစ်မနေ အသုံးပြုရမည်။

### AWS CLI IAM Commands
```bash
# လက်ရှိ Login ဝင်ထားသော User / Role ကို စစ်ဆေးခြင်း
aws sts get-caller-identity

# IAM Users စာရင်းကို ကြည့်ခြင်း
aws iam list-users

# IAM Roles စာရင်းကို ကြည့်ခြင်း
aws iam list-roles --query "Roles[?contains(RoleName, 'EC2')].RoleName"

# သတ်မှတ်ထားသော Role ၏ Policy များကို စစ်ဆေးခြင်း
aws iam list-attached-role-policies --role-name Production-EC2-S3Access-Role
```

---

## ၃.၂ AWS VPC (Virtual Private Cloud) Networking Deep Dive

### ဒီ Service က ဘာလဲ? (What is it?)
AWS Cloud ပေါ်တွင် မိမိတို့ ကုမ္ပဏီအတွက် သီးသန့် ကာရံထားသော **Logical Isolated Private Network (Private Data Center)** ဖြစ်သည်။

### Production 3-Tier VPC Architecture Diagram
```
                              [ Internet (အပြင်လောက) ]
                                          |
                              [ Internet Gateway (IGW) ]
                                          |
================================== AWS VPC (10.0.0.0/16) ==================================
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Public Subnet AZ-1a ]                                   [ Public Subnet AZ-1c ]
       (10.0.1.0/24)                                             (10.0.2.0/24)
  Route Table: 0.0.0.0/0 -> IGW                             Route Table: 0.0.0.0/0 -> IGW
  +---------------------------+                             +---------------------------+
  |  ALB (Load Balancer Node) |                             |  ALB (Load Balancer Node) |
  |  NAT Gateway (AZ-1a)      |                             |  (Optional NAT GW AZ-1c)  |
  +---------------------------+                             +---------------------------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Private App Subnet AZ-1a ]                              [ Private App Subnet AZ-1c ]
       (10.0.11.0/24)                                            (10.0.12.0/24)
  Route Table: 0.0.0.0/0 -> NAT Gateway                     Route Table: 0.0.0.0/0 -> NAT Gateway
  +---------------------------+                             +---------------------------+
  |  EC2 App Server (Nginx)   |                             |  EC2 App Server (Nginx)   |
  |  Private IP: 10.0.11.20   |                             |  Private IP: 10.0.12.20   |
  +---------------------------+                             +---------------------------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Private DB Subnet AZ-1a ]                               [ Private DB Subnet AZ-1c ]
       (10.0.21.0/24)                                            (10.0.22.0/24)
  Route Table: Local Only (No Internet Access)              Route Table: Local Only (No Internet)
  +---------------------------+                             +---------------------------+
  |  RDS MySQL Primary Writer | <====== Replication ======> |  RDS MySQL Standby Reader |
  |  Private IP: 10.0.21.50   |                             |  Private IP: 10.0.22.50   |
  +---------------------------+                             +---------------------------+
===========================================================================================
```

### Components များ၏ တာဝန်နှင့် မဖြစ်မနေသိရမည့် အချက်များ
1. **Public Subnet:** Internet Gateway သို့ တိုက်ရိုက် Route လမ်းကြောင်းရှိသည်။ Internet မှ User များ ဝင်ရောက်ရမည့် **ALB (Application Load Balancer)** သာ ထားရှိရမည်။
2. **Private App Subnet:** အပြင် Internet မှ တိုက်ရိုက် မမြင်ရပါ။ Application Server (EC2/ECS) များကို ထားရှိသည်။ Internet သို့ ပြင်ပ Library ဒေါင်းလုပ်ဆွဲရန် **NAT Gateway** မှတစ်ဆင့်သာ ထွက်ရသည်။
3. **Private DB Subnet:** Internet Gateway ကော NAT Gateway ပါ မရှိဘဲ Local VPC အတွင်းသာ ဆက်သွယ်နိုင်သည်။ Database (RDS) ကို Hackers များ Internet မှ Scan မဖတ်နိုင်စေရန် ဤနေရာတွင်သာ လုံးဝ ဝှက်ထားရမည်။
4. **Security Group vs Network ACL (NACL):**
   - **Security Group (SG):** Instance Level Virtual Firewall ဖြစ်သည်။ **Stateful** ဖြစ်သည် (Inbound ခွင့်ပြုထားပါက Outbound သည် အလိုအလျောက် ပွင့်ပြီးသားဖြစ်သည်)။
   - **Network ACL (NACL):** Subnet Level ဖြစ်သည်။ **Stateless** ဖြစ်သည် (Inbound ကော Outbound ပါ သီးခြားစီ Rule ရေးပေးရသည်)။

---

## ၃.၃ AWS EC2 (Elastic Compute Cloud) & Linux Administration

### ဒီ Service က ဘာလဲ? (What is it?)
Cloud ပေါ်တွင် လိုအပ်သလို အတိုးအလျှော့ ပြုလုပ်နိုင်သော **Virtual Machine (Server)** ဖြစ်သည်။

### Linux Administration Cheat Sheet for Production EC2
```bash
# Server CPU, Memory နှင့် Process များကို Real-time စောင့်ကြည့်ခြင်း
top
htop

# Disk အသုံးပြုမှု ပမာဏ စစ်ဆေးခြင်း
df -hT

# RAM အလွတ်နှင့် အသုံးပြုမှု စစ်ဆေးခြင်း
free -m

# Port များ ဖွင့်ထားမှုနှင့် နားထောင်နေမှု စစ်ဆေးခြင်း
sudo ss -tulpn

# Systemd Service Status (Nginx, PHP-FPM) စစ်ဆေးခြင်း/စတင်ခြင်း
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl status php8.2-fpm

# Log ဖိုင်များကို Real-time ကြည့်ရှုခြင်း (Error Tracking)
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f --no-pager
```

### Production Nginx + PHP-FPM Web Configuration Architecture
EC2 ပေါ်တွင် Laravel ကဲ့သို့ Modern Web App တစ်ခု Run ရန် Nginx VirtualHost File (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## ၃.၄ AWS EBS (Elastic Block Store) Storage

### ဒီ Service က ဘာလဲ? (What is it?)
EC2 Instance တွင် တပ်ဆင်အသုံးပြုရသော **High-Performance Network Virtual Hard Disk (Block Storage)** ဖြစ်သည်။ EC2 ပိတ်သွားသော်လည်း Data များ ပျက်မသွားဘဲ ကျန်ရှိနေပါသည်။

### EBS Types & Production Selection
1. **gp3 (General Purpose SSD - စံထားအကြံပြုချက်):** Japan Production အများစုတွင် 90% အသုံးပြုသည်။ ကုန်ကျစရိတ် အသက်သာဆုံးဖြစ်ပြီး Disk Size ကို တိုးစရာမလိုဘဲ IOPS (Input/Output Per Second) နှင့် Throughput (MB/s) ကို လိုသလို သီးခြား မြှင့်တင်နိုင်သည်။
2. **io2 (Provisioned IOPS SSD):** အလွန်ပြင်းထန်သော I/O လိုအပ်သည့် Enterprise Oracle/SQL Server Database များအတွက် သုံးသည်။ စရိတ်ကြီးသည်။
3. **EBS Snapshot:** EBS Disk တစ်ခုလုံးကို S3 ပေါ်သို့ Incremental Backup အဖြစ် Point-in-time သိမ်းဆည်းပေးသော စနစ်။ Disaster ဖြစ်ပါက Snapshot မှ EBS Volume အသစ် ချက်ချင်း ပြန်ဆောက်နိုင်သည်။

---

# ၄။ Level 3 — High Availability & Scalable Web Frontend

---

## ၄.၁ ALB (Application Load Balancer)

### ဒီ Service က ဘာလဲ? (What is it?)
OSI Layer 7 (HTTP/HTTPS) တွင် အလုပ်လုပ်သော Intelligent Load Balancer ဖြစ်ပြီး User များထံမှ ဝင်လာသော Web Traffic များကို နောက်ကွယ်ရှိ Server (EC2/ECS Container) အများအပြားထံသို့ မျှဝေပေးသည်။

### ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ဥပမာ:** EC Site တစ်ခုတွင် Flash Sale စတင်ချိန်တွင် တစ်စက္ကန့်လျှင် Request ပေါင်း ၅,၀၀၀ ဝင်လာသည်။ Server ၁ လုံးတည်း ထားရှိပါက CPU 100% တက်ကာ Server Crash သွားမည်။
- **ဖြေရှင်းချက်:** ALB ခံထားပြီး နောက်ကွယ်တွင် Server ၅ လုံး ထားရှိပါက တစ်လုံးလျှင် Request ၁,၀၀၀ စီ အညီအမျှ ခွဲဝေပေးသည်။ Server တစ်လုံး ပျက်ကျသွားပါကလည်း ALB Health Check က သိရှိပြီး ကျန် ၄ လုံးဆီသို့သာ အလိုအလျောက် လမ်းလွှဲပေးသည်။

### ALB အလုပ်လုပ်ပုံ အသေးစိတ် လုပ်ငန်းစဉ် (Process):
```
                         [ Client Request (HTTPS:443) ]
                                       |
                         [ ALB Listener (Port 443) ]
                                       |
                   +-------------------+-------------------+
                   | Path: /api/*                          | Default: /*
        [ API Target Group ]                      [ Web Target Group ]
       Health Check: /api/health                 Health Check: /healthz
        +--------+--------+                       +--------+--------+
        |                 |                       |                 |
    [ EC2 App 1 ]    [ EC2 App 2 ]            [ EC2 Web 1 ]    [ EC2 Web 2 ]
```

1. **Listener:** သတ်မှတ်ထားသော Port (ဥပမာ- HTTP 80 သို့မဟုတ် HTTPS 443) ကို စောင့်နားထောင်ပြီး Rule စစ်ဆေးသည်။
2. **Path-based Routing:** `/api/*` လာလျှင် Backend API Servers များဆီသို့ ပို့မည်။ `/admin/*` လာလျှင် Admin Servers ဆီသို့ ပို့မည်။
3. **Target Group & Health Check:** ALB က Target Server များဆီသို့ ၃၀ စက္ကန့်တစ်ကြိမ် `GET /health` လှမ်းခေါ်ပြီး `HTTP 200 OK` ပြန်ရမရ စစ်သည်။ Server တစ်လုံး အဖြေမပေးနိုင်ပါက `Unhealthy` အဖြစ် သတ်မှတ်ပြီး Traffic လုံးဝ မပို့တော့ပေ။
4. **Deregistration Delay (Connection Draining):** Server တစ်ခုကို Deploy အသစ်လုပ်ရန် ဖြုတ်သည့်အခါ လက်ရှိ လုပ်ဆောင်ဆဲ Request များကို ချက်ချင်း မဖြတ်တောက်ပစ်ဘဲ စက္ကန့် ၃၀ (Default 300s) စောင့်ဆိုင်းပြီးမှ ဘေးကင်းစွာ ဖြုတ်ပေးသော စနစ်။

---

## ၄.၂ Auto Scaling Group (ASG)

### ဒီ Service က ဘာလဲ? (What is it?)
Traffic အတိုးအလျှော့ပေါ် မူတည်၍ EC2 Instance အရေအတွက်ကို အလိုအလျောက် တိုးပေးခြင်း (Scale Out) နှင့် လျှော့ပေးခြင်း (Scale In) ပြုလုပ်ပေးသော စနစ်။

### အလုပ်လုပ်ပုံ လုပ်ငန်းစဉ် (Process):
1. **Launch Template:** Server အသစ်တိုးလာသည့်အခါ မည်သည့် AMI (Ubuntu), Instance Type (`t3.medium`), Security Group, IAM Role နှင့် User Data Script (Nginx/App start) ကို သုံးပြီး တည်ဆောက်ရမည်ကို သတ်မှတ်ထားသော Template ဖြစ်သည်။
2. **Target Tracking Scaling Policy:** CloudWatch Metric ကို စောင့်ကြည့်သည်။ ဥပမာ- `Average CPU Utilization = 70%` ဟု သတ်မှတ်ထားပါက CPU 75% ဖြစ်သွားသည်နှင့် ASG က Server ၁ လုံး ချက်ချင်း စတင်ထည့်သွင်းပေးသည်။
3. **Cooldown Period:** Server အသစ်တစ်ခု စတင်ပြီး Boot တက်ချိန်တွင် Metric တက်နေသေးသဖြင့် မလိုအပ်ဘဲ နောက်တစ်လုံး ထပ်မတိုးစေရန် မိနစ်အနည်းငယ် (ဥပမာ- ၃ မိနစ်) စောင့်ဆိုင်းပေးသော စနစ်။

---

## ၄.၃ AWS Route 53 (Managed DNS)

### ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာအနှံ့ 99.999% SLA အာမခံချက်ရှိသော AWS ၏ Scalable Cloud DNS (Domain Name System) Service ဖြစ်သည်။

### မဖြစ်မနေသိရမည့် DNS Record Types & ဂျပန်現場 အသုံးပြုပုံ:
- **A Record:** Domain Name ကို IPv4 Address သို့ ချိတ်ဆက်ပေးခြင်း (ဥပမာ- `example.com` -> `13.112.55.10`)။
- **CNAME Record:** Domain တစ်ခုကို အခြား Domain နာမည်တစ်ခုသို့ ညွှန်းပေးခြင်း (ဥပမာ- `www.example.com` -> `example.com`)။
- **Alias Record (AWS သီးသန့် အထူး Record):** Root Domain (`example.com`) ကို AWS ALB သို့မဟုတ် CloudFront CDN ဆီသို့ IP မလိုဘဲ ညွှန်းပေးနိုင်သော Record ဖြစ်သည်။ CNAME သည် Root Domain တွင် သုံး၍ မရသောကြောင့် **Route 53 Alias Record** ကိုသာ မဖြစ်မနေ သုံးရသည်။
- **Routing Policies:**
  - **Simple Routing:** Domain တစ်ခုကို IP တစ်ခုဆီသို့ တိုက်ရိုက်ညွှန်းခြင်း။
  - **Weighted Routing:** Traffic ၏ ၈၀% ကို System ဗားရှင်းဟောင်းဆီသို့ ပို့ပြီး ၂၀% ကို စမ်းသပ်ဗားရှင်းသစ်ဆီသို့ ပို့ခြင်း (Canary Testing)။
  - **Failover Routing:** Primary Region (Tokyo) Down သွားပါက Secondary Region (Osaka) ဆီသို့ အလိုအလျောက် လမ်းလွှဲပေးခြင်း။

---

## ၄.၄ AWS ACM (Certificate Manager & SSL/TLS)

### ဒီ Service က ဘာလဲ? (What is it?)
Website များကို `http://` မှ လုံခြုံစိတ်ချရသော `https://` (Green Padlock) သို့ ပြောင်းလဲပေးနိုင်သည့် SSL/TLS Digital Certificates များကို Free of charge ထုတ်ပေးပြီး သက်တမ်းကုန်ဆုံးပါက အလိုအလျောက် Auto-renew လုပ်ပေးသော Service ဖြစ်သည်။

### Production Steps for HTTPS Setup:
1. AWS ACM Console -> **Request public certificate** နှိပ်ပါ။
2. Fully qualified domain name တွင် `example.com` နှင့် `*.example.com` ထည့်ပါ။
3. Validation method အနေဖြင့် **DNS validation** ကို ရွေးချယ်ပါ။
4. Route 53 တွင် CNAME Record ကို ခလုတ်တစ်ချက်နှိပ်ရုံဖြင့် အလိုအလျောက် ထည့်သွင်းအတည်ပြုပါ။
5. Certificate ထွက်လာပါက ALB ၏ HTTPS:443 Listener တွင် ချိတ်ဆက်ပေးပါ။
6. ALB တွင် HTTP:80 ဖြင့် ဝင်လာသမျှ Traffic အားလုံးကို HTTPS:443 သို့ Redirect (301 Moved Permanently) လုပ်သည့် Rule ထည့်သွင်းပါ။

---

## ၄.၅ AWS S3 (Simple Storage Service) & Best Practices

### ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး အရာဝတ္ထုအခြေပြု သိုလှောင်ရုံ (Object Storage) ဖြစ်သည်။ 99.999999999% (11 9's) Data Durability ရှိပြီး အကန့်အသတ်မရှိ Data သိမ်းဆည်းနိုင်သည်။

### Storage Classes & Cost Optimization (FinOps):
- **S3 Standard:** မကြာခဏ အသုံးပြုသော ဖိုင်များအတွက် (စံထားစျေးနှုန်း)။
- **S3 Standard-IA (Infrequent Access):** တစ်လလျှင် တစ်ကြိမ်သာ ကြည့်သော်လည်း လိုအပ်ပါက ချက်ချင်း ကြည့်လိုသော ဖိုင်များအတွက် (Storage စရိတ် ၅၀% သက်သာသည်)။
- **S3 Glacier Flexible / Deep Archive:** နှစ်စဉ် Audit အတွက် သိမ်းထားရသော Log ဖိုင်များနှင့် Backup များအတွက် (Storage စရိတ် ၉၀% သက်သာပြီး Data ပြန်ထုတ်ရန် နာရီအနည်းငယ် စောင့်ရသည်)။
- **Lifecycle Policy:** အသက် ၃၀ ရက်ကျော်သော ဖိုင်များကို S3 Standard မှ S3-IA သို့၊ ၉၀ ရက်ကျော်ပါက Glacier သို့ အလိုအလျောက် ရွှေ့ပြောင်းစေခြင်း။

### Presigned URL အလုပ်လုပ်ပုံ (Secure Upload Pattern):
```
[ User Browser ] ----(1. Request Upload URL)----> [ Laravel Backend API ]
                                                          | (2. S3 SDK generate presigned URL)
[ User Browser ] <---(3. Return 15-min Temp URL)----------+
       |
       +------------(4. Direct PUT Upload to S3)--------> [ Amazon S3 Bucket ]
       (Backend Server ၏ RAM နှင့် Bandwidth မကုန်ဘဲ လုံခြုံစွာ Upload တင်နိုင်သည်)
```

---

## ၄.၆ AWS CloudFront (Global CDN & OAC)

### ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာအနှံ့ Edge Locations များမှတစ်ဆင့် Website ၏ HTML, CSS, JavaScript, Images နှင့် API များကို User အနီးဆုံး Cache မှ လျင်မြန်စွာ ပို့ဆောင်ပေးသော **Content Delivery Network (CDN)** ဖြစ်သည်။

### Origin Access Control (OAC) ၏ အရေးပါပုံ:
- ရှေးယခင်က S3 Bucket ပေါ်ရှိ ပုံများကို User ကြည့်ရှုနိုင်ရန် S3 Public Access ဖွင့်ပေးခဲ့ကြသည်။ ၎င်းသည် Hacker များ S3 ဖိုင်များကို တိုက်ရိုက် ခိုးယူဒေါင်းလုပ်ဆွဲခြင်းနှင့် Data Transfer Cost အဆမတန် ကုန်ကျစေသည်။
- **OAC (Origin Access Control):** S3 Bucket Public Access ကို လုံးဝ (Block All) ပိတ်ထားပြီး **CloudFront CDN မှတစ်ဆင့်သာ Cryptographic Signature ဖြင့် S3 ထဲသို့ ဖတ်ခွင့်ပြုသော စနစ်** ဖြစ်သည်။

---

# ၅။ Level 4 — Database & In-Memory Caching

---

## ၅.၁ AWS RDS (Relational Database Service)

### ဒီ Service က ဘာလဲ? (What is it?)
MySQL, PostgreSQL, MariaDB စသည့် Relational Database များကို Setup လုပ်ခြင်း၊ Backup ယူခြင်း၊ Patching လုပ်ခြင်း၊ High Availability ပြုလုပ်ခြင်းတို့ကို AWS မှ အလိုအလျောက် စီမံခန့်ခွဲပေးသော Managed Database Service ဖြစ်သည်။

### Multi-AZ Failover အလုပ်လုပ်ပုံ အသေးစိတ် (Process):
```
  [ Application Server (EC2/ECS) ]
                 |
                 v (Database Endpoint DNS: mydb.prod.ap-northeast-1.rds.amazonaws.com)
  [ Primary DB Instance (AZ-1a) ] <===== Synchronous Replication =====> [ Standby DB (AZ-1c) ]
                 | (Crash or Hardware Failure)                                     |
                 X                                                     (AWS DNS က Standby ကို
                                                                        Primary အဖြစ် ၆၀ စက္ကန့်အတွင်း
                                                                        အလိုအလျောက် ပြောင်းလဲပေးသည်)
```
- Standby DB သည် Primary ပျက်ကျမှသာ တက်လာမည်ဖြစ်ပြီး သာမန်အချိန်တွင် Read Query လက်ခံရန် သုံး၍ **မရပါ**။

### Read Replica ဖြင့် Database Performance ချဲ့ထွင်ခြင်း:
- Application တွင် Write/Insert/Update ကို Primary DB သို့ ပို့ပြီး SELECT Query များကို Read Replica များ (အများဆုံး ၁၅ လုံးအထိ) ထံသို့ Asynchronous လမ်းကြောင်းဖြင့် ပို့ဆောင်စေနိုင်သည်။

---

## ၅.၂ Amazon Aurora (Enterprise Cloud-Native Database)

### ဒီ Service က ဘာလဲ? (What is it?)
Cloud အတွက် သီးသန့် အစအဆုံး ပြန်လည်ရေးဆွဲထားသော AWS ၏ အမြင့်ဆုံး Flagship Relational Database ဖြစ်သည်။ MySQL ထက် ၅ ဆ၊ PostgreSQL ထက် ၃ ဆ ပိုမို မြန်ဆန်သည်။

### ဂျပန် Enterprise များ Aurora ကို ရွေးချယ်ရသည့် အကြောင်းရင်း (Why Aurora?):
1. **Fault-Tolerant Distributed Storage:** Data အပိုင်းအစ တစ်ခုချင်းစီကို Availability Zone ၃ ခုရှိ Storage စုစုပေါင်း ၆ နေရာတွင် Replicate လုပ်ထားသည်။ AZ ၂ ခုလုံး ပျက်စီးသွားသော်လည်း Data ဆုံးရှုံးမှု မရှိပါ။
2. **Instant Failover:** RDS MySQL သည် Failover ဖြစ်ရန် ၆၀ မှ ၁၂၀ စက္ကန့် ကြာသော်လည်း Aurora သည် စက္ကန့် ၃၀ အောက်အတွင်း ချက်ချင်း Failover ပြီးမြောက်သည်။
3. **Storage Auto-Expansion:** Database Disk ပြည့်သွားမည်ကို စိုးရိမ်စရာမလိုဘဲ 128TB အထိ 10GB တိုးပြီး အလိုအလျောက် ချဲ့ထွင်ပေးသည်။

---

## ၅.၃ AWS ElastiCache for Redis

### ဒီ Service က ဘာလဲ? (What is it?)
RAM (Memory) ပေါ်တွင် Data သိမ်းဆည်းသော Ultra-Fast In-Memory Data Store & Cache Service ဖြစ်သည်။ Microsecond Latency ဖြင့် Data ရယူနိုင်ပါသည်။

### Production Real-World Use Cases (Laravel & Node.js):
1. **Database Query Cache (Cache-Aside Pattern):**
   - Application က ဒေတာလိုချင်ပါက Redis ထံ အရင်မေးသည် (Cache Hit ဖြစ်ပါက 1ms ဖြင့် ချက်ချင်းရသည်)။
   - Redis တွင် မရှိမှသာ (Cache Miss) MySQL သို့ Query ဆွဲပြီး ထိုရလဒ်ကို Redis တွင် ၁ နာရီစာ Cache သွားသိမ်းသည်။
2. **Session Store:** User Login Session များကို Server Local တွင် မထားဘဲ Redis တွင် ထားသဖြင့် Server တစ်လုံး Down သွားသော်လည်း Login မပြုတ်သွားပါ။
3. **Queue Worker:** Laravel Queue Jobs များကို Redis RAM ပေါ်တွင် Buffer လုပ်ပြီး Worker များက Asynchronous Process လုပ်ဆောင်သည်။

---

# ၆။ Level 5 — Container Architecture

---

## ၆.၁ Docker to AWS Architecture Flow

```
[ Local Developer Environment ]
  Developer ရေးသားထားသော Laravel / Node.js Code
  -> Dockerfile တည်ဆောက်ခြင်း
  -> docker build -t my-app:latest .
                 |
                 v
[ AWS ECR (Container Image Registry) ]
  Private Image Repository သို့ Tag ရိုက်၍ Push တင်ခြင်း
  -> aws ecr get-login-password | docker login ...
  -> docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:v1.0.0
                 |
                 v
[ AWS ECS + Fargate (Serverless Container Orchestration) ]
  ECS Task Definition က ECR မှ Image ကို Pull ဆွဲထုတ်သည်
  -> ALB နောက်ကွယ်ရှိ Private Subnet တွင် Serverless Container အဖြစ် အလိုအလျောက် စတင် Run ပေးသည်
```

---

## ၆.၂ AWS ECR (Elastic Container Registry)

### ဒီ Service က ဘာလဲ? (What is it?)
Docker Container Images များကို လုံခြုံစိတ်ချစွာ သိမ်းဆည်းပေးသော AWS ၏ Private Docker Registry Service ဖြစ်သည်။

### အရေးကြီးသော Feature များ:
- **Scan on Push:** Docker Image ကို ECR သို့ Push တင်လိုက်သည်နှင့် CVE Security Vulnerabilities (လုံခြုံရေး အားနည်းချက်များ) ပါမပါ AWS က အလိုအလျောက် စစ်ဆေးပေးသည်။
- **Lifecycle Policy:** Image များ များပြားလာပြီး Storage စရိတ် မတက်စေရန် နောက်ဆုံးတင်ထားသော Image ဗားရှင်း ၁၀ ခုသာ ထားရှိပြီး ကျန်အဟောင်းများကို အလိုအလျောက် ဖျက်ပစ်စေခြင်း။

---

## ၆.၃ AWS ECS with AWS Fargate (Serverless Containers)

### ဒီ Service က ဘာလဲ? (What is it?)
**AWS ECS (Elastic Container Service)** သည် Container များကို စီမံခန့်ခွဲပေးသော Orchestration Service ဖြစ်ပြီး **AWS Fargate** သည် EC2 Server များကို မိမိတို့ဘက်မှ Patch လုပ်ခြင်း၊ စောင့်ကြည့်ခြင်း ပြုလုပ်စရာမလိုဘဲ CPU နှင့် Memory ကိုသာ သတ်မှတ်ပေးရုံဖြင့် Container များကို Run ပေးသော **Serverless Compute Engine** ဖြစ်သည်။

### Task Definition, Task နှင့် Service ကွာခြားချက်:
- **Task Definition:** Container မည်မျှ Run မည်၊ မည်သည့် Image သုံးမည်၊ CPU/RAM မည်မျှ ပေးမည်၊ Secrets Manager မှ မည်သည့် Password ဆွဲယူမည်ကို ရေးသားထားသော Blueprint (JSON)။
- **Task:** အမှန်တကယ် Run နေသော Container အကောင်အထည် (Single Container Instance)။
- **Service:** သတ်မှတ်ထားသော Task အရေအတွက် (ဥပမာ- 2 Tasks) အမြဲ အသက်ရှင်နေစေရန် ထိန်းကျောင်းပေးပြီး ALB Target Group နှင့် ချိတ်ဆက်ပေးသော စနစ် (Container တစ်ခု သေသွားပါက နောက်တစ်ခု အလိုအလျောက် ချက်ချင်း အစားထိုး ထူပေးသည်)။

---

# ၇။ Level 6 — Serverless & NoSQL

---

## ၇.၁ AWS Lambda Deep Dive

### ဒီ Service က ဘာလဲ? (What is it?)
Server မလိုဘဲ မိမိတို့၏ Code Function ကိုသာ ရေးသား Upload တင်ထားပြီး Request သို့မဟုတ် Event တစ်ခုခု ဖြစ်ပေါ်လာမှသာ Run သော **Event-driven Serverless Compute Service** ဖြစ်သည်။

### မဖြစ်မနေသိရမည့် သဘောတရားများ:
- **Cold Start:** အချိန်အတန်ကြာ မသုံးဘဲ ငြိမ်နေသော Function ဆီသို့ Request ပထမဆုံး ရောက်လာသည့်အခါ MicroVM အသစ် တည်ဆောက်ရသဖြင့် ကနဦး Response Time အနည်းငယ် ကြာမြင့်ခြင်း (ဒုတိယအကြိမ်မှစ၍ Warm ဖြစ်ပြီး Milliseconds အတွင်း မြန်ဆန်သည်)။
- **Timeout:** အများဆုံး Run နိုင်သော ကြာချိန်မှာ **၁၅ မိနစ် (900 seconds)** ဖြစ်သည်။
- **Lambda Layers:** Function တိုင်းတွင် Library များ ထပ်ခါထပ်ခါ မတင်ရစေရန် Common Libraries (ဥပမာ- AWS SDK, Stripe SDK) များကို သီးခြား Share လုပ်ထားနိုင်သော စနစ်။

---

## ၇.၂ Amazon API Gateway

### ဒီ Service က ဘာလဲ? (What is it?)
မည်သည့် Scale တွင်မဆို Developer များ အနေဖြင့် API များကို လွယ်ကူစွာ ဖန်တီး၊ ထိန်းသိမ်း၊ စောင့်ကြည့်၊ လုံခြုံအောင် ပြုလုပ်နိုင်သော Fully Managed Reverse Proxy Service ဖြစ်သည်။

### အဓိက Feature များ:
- **Cognito / Lambda Authorizer:** Request တိုင်းတွင် ပါလာသော JWT Token ကို စစ်ဆေးပြီး Login အောင်မြင်မှသာ Backend Lambda သို့ လွှတ်ပေးခြင်း။
- **Throttling & Rate Limiting:** Hacker များ DDOS မလုပ်နိုင်စေရန် User တစ်ဦးလျှင် တစ်စက္ကန့် Request ၁၀၀ ထက် ပိုခေါ်ပါက `HTTP 429 Too Many Requests` ဖြင့် ကာကွယ်ခြင်း။
- **REST API vs HTTP API:** HTTP API သည် Feature နည်းသော်လည်း Latency ပိုနည်းပြီး ကုန်ကျစရိတ် ၇၀% ပိုမို သက်သာသည်။

---

## ၇.၃ Amazon DynamoDB (NoSQL Data Modeling)

### ဒီ Service က ဘာလဲ? (What is it?)
မည်သည့် Scale တွင်မဆို Single-Digit Millisecond (10ms အောက်) Latency ဖြင့် အလုပ်လုပ်နိုင်သော Fully Managed NoSQL Key-Value & Document Database ဖြစ်သည်။

### Relational DB နှင့် မတူညီသော စဉ်းစားပုံ (NoSQL Mindset):
- MySQL ကဲ့သို့ Multiple Tables များ ဆောက်ပြီး `JOIN` ဆွဲ၍ မရပါ။
- **Single-Table Design:** Application ၏ Access Patterns (မည်သည့် Data ကို မည်သည့် ပုံစံဖြင့် ရှာဖွေမည်) ကို ကြိုတင် သိရှိပြီးမှသာ **Partition Key (PK)** နှင့် **Sort Key (SK)** ကို Design ရေးဆွဲရမည်။
- **Global Secondary Index (GSI):** မူလ PK မဟုတ်သော အခြား Attribute တစ်ခုခုဖြင့် Query ရှာဖွေလိုသည့်အခါ အသစ် ထပ်ဆောင်း တည်ဆောက်ရသော Index ဖြစ်သည်။

---

# ၈။ Level 7 — Asynchronous & Event-Driven Architecture

---

## ၈.၁ AWS SQS (Simple Queue Service) & Decoupling

### ဒီ Service က ဘာလဲ? (What is it?)
Microservices နှင့် Web Application များ အကြားတွင် Message များကို ပျောက်ပျက်မသွားစေဘဲ ခေတ္တထိန်းသိမ်းပေးထားသော Message Queue Service ဖြစ်သည်။

### Standard Queue vs FIFO Queue:
- **Standard Queue:** အကန့်အသတ်မရှိ Throughput ရရှိသည်။ Message များ အစီအစဉ် အနည်းငယ် လွဲချော်နိုင်သည် (At-least-once delivery)။
- **FIFO Queue (`.fifo`):** First-In, First-Out အတိအကျ အစီအစဉ်အတိုင်း သွားသည် (ငွေစာရင်း၊ ဘဏ်လုပ်ငန်း)။ တစ်စက္ကန့်လျှင် Message ၃,၀၀၀ အထိသာ ကန့်သတ်ချက်ရှိသည်။
- **Dead Letter Queue (DLQ):** Error ကြောင့် Worker Server က ဖောက်ဖတ်၍ မရဘဲ ၃ ကြိမ်ထက်မက ကျရှုံးသွားသော Message များကို သီးခြားခွဲထုတ် သိမ်းဆည်းပေးသော Queue ဖြစ်သည်။

---

## ၈.၂ AWS SNS (Simple Notification Service) & Fan-Out Pattern

### ဒီ Service က ဘာလဲ? (What is it?)
Publish/Subscribe (Pub/Sub) ပုံစံဖြင့် Message တစ်ခုတည်းကို လက်ခံသူ အများအပြား ဆီသို့ တစ်ပြိုင်နက်တည်း ဖြန့်ဝေပေးသော Service ဖြစ်သည်။

### Fan-Out Architecture Pattern:
```
                              [ User Places Order ]
                                        |
                             [ SNS Order Topic ]
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
       v                                v                                v
[ SQS Inventory Queue ]      [ SQS Invoice Email Queue ]     [ Lambda Analytics Function ]
       |                                |
[ Inventory Worker ]           [ Email Worker ]
```

---

## ၈.၃ Amazon EventBridge

### ဒီ Service က ဘာလဲ? (What is it?)
Serverless Event Bus တစ်ခုဖြစ်ပြီး AWS Services များ (ဥပမာ- S3 ထဲ ဖိုင်ရောက်လာခြင်း၊ EC2 State ပြောင်းလဲခြင်း)၊ SaaS Applications (DataDog, Zendesk) နှင့် ကိုယ်ပိုင် Custom Events များကို Event-driven ပုံစံဖြင့် ချိတ်ဆက် စီမံခန့်ခွဲပေးသော စနစ်ဖြစ်သည်။ နေ့စဉ် သတ်မှတ်အချိန်တွင် Batch Run သည့် **Cron Schedule** အတွက်လည်း အသုံးပြုသည်။

---

# ၉။ Level 8 — Production Observability, Auditing & Security

---

## ၉.၁ Amazon CloudWatch

### ဒီ Service က ဘာလဲ? (What is it?)
AWS Resources များနှင့် Application များ၏ ကျန်းမာရေး၊ Performance Metrics၊ Logs နှင့် Alarms များကို တစ်နေရာတည်းတွင် စောင့်ကြည့်စီမံပေးသော Observability Platform ဖြစ်သည်။

### CloudWatch Logs Insights ဖြင့် Error ရှာဖွေခြင်း:
```sql
fields @timestamp, @message
| filter @message like /Exception/ or @message like /Fatal/
| sort @timestamp desc
| limit 20
```

---

## ၉.၂ AWS CloudTrail

### ဒီ Service က ဘာလဲ? (What is it?)
AWS Account အတွင်း မည်သူက (Who)၊ မည်သည့်အချိန်တွင် (When)၊ မည်သည့် Service ကို (What Action)၊ မည်သည့် IP လိပ်စာမှတစ်ဆင့် (Where) API Call ခေါ်ယူခဲ့သည်ကို စုံစမ်းမှတ်တမ်းတင်ပေးသော **Audit & Governance Log** ဖြစ်သည်။

---

## ၉.၃ AWS Systems Manager (SSM)

### Session Manager ဖြင့် Secure EC2 Remote Access (No SSH Port 22):
Port 22 ကို လုံးဝ ပိတ်ထားပြီး HTTPS Port 443 Encrypted AWS API မှတစ်ဆင့် Browser Terminal ဖြင့် လုံခြုံစွာ ဝင်ရောက်အလုပ်လုပ်နိုင်သော စနစ် ဖြစ်သည်။

---

## ၉.၄ AWS Secrets Manager & AWS KMS

- **Secrets Manager:** Database Passwords, API Keys များကို `.env` ဖိုင်တွင် Plain Text မထားဘဲ သိမ်းဆည်းပြီး Auto-rotate ပြုလုပ်ပေးသည်။
- **AWS KMS:** AES-256 Bit Encryption ဖြင့် S3, EBS, RDS ထဲရှိ Data များကို Encrypt လုပ်ပေးသော Key Management Service ဖြစ်သည်။

---

## ၉.၅ AWS WAF & Enterprise Security Services

- **AWS WAF:** ALB ရှေ့တွင် ကာရံထားပြီး SQL Injection, XSS, DDoS Attack များကို Block ပေးသည်။
- **Amazon GuardDuty:** AI သုံး၍ VPC Logs များကို Scan ဖတ်ကာ Hacker ထိုးဖောက်မှုများကို ရှာဖွေပေးသည်။
- **AWS Security Hub:** CIS Benchmarks များနှင့် ကိုက်ညီမှု ရှိမရှိ ဗဟိုမှ အဆင့်သတ်မှတ် ပြသပေးသည်။

---

# ၁၀။ Level 9 — Infrastructure as Code (Terraform) & CI/CD Pipelines

---

## ၁၀.၁ Terraform Core Workflow & Production Directory Structure

```bash
terraform init       # Plugins ဒေါင်းလုပ်ဆွဲခြင်း
terraform fmt        # Format ညှိခြင်း
terraform validate   # Syntax စစ်ဆေးခြင်း
terraform plan       # Preview ကြည့်ခြင်း
terraform apply      # Cloud ပေါ် အမှန်တကယ် တည်ဆောက်ခြင်း
terraform destroy    # Resource များ ပြန်ဖျက်ဆီးခြင်း
```

---

## ၁၀.၂ Complete Production Terraform Code (VPC + ALB + ECS + RDS)

```hcl
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "japan-prod-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true
  tags                    = { Name = "public-subnet-1a" }
}

resource "aws_subnet" "public_1c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true
  tags                    = { Name = "public-subnet-1c" }
}
```

---

## ၁၀.၃ CI/CD Workflow: GitHub Actions → ECR → ECS Fargate Zero-Downtime Deploy

```yaml
name: Deploy to Production AWS ECS

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-1
    - uses: aws-actions/amazon-ecr-login@v2
      id: login-ecr
    - run: |
        docker build -t ${{ steps.login-ecr.outputs.registry }}/japan-ec-app:${{ github.sha }} .
        docker push ${{ steps.login-ecr.outputs.registry }}/japan-ec-app:${{ github.sha }}
    - uses: aws-actions/amazon-ecs-deploy-task-definition@v2
      with:
        task-definition: task-definition.json
        service: japan-ec-service
        cluster: japan-ec-cluster
        wait-for-service-stability: true
```

---

# ၁၁။ Level 10 — High Availability, Disaster Recovery, Cost & Well-Architected

---

## ၁၁.၁ High Availability (HA) & Disaster Recovery (DR - RPO/RTO)

- **RPO (Recovery Point Objective):** ဒုက္ခဖြစ်ပြီးနောက် မည်မျှကြာသော အချိန်က Data ဆုံးရှုံးမှုကို ကုမ္ပဏီက လက်ခံနိုင်သလဲ (ဥပမာ- ၁ နာရီစာ Data)။
- **RTO (Recovery Time Objective):** System ပျက်ကျသွားပြီးနောက် မည်မျှမြန်မြန် ပြန်လည် လည်ပတ်နိုင်ရမည်လဲ (ဥပမာ- ၁၅ မိနစ်အတွင်း)။

```
[ 1. Backup & Restore ]  စရိတ် အသက်သာဆုံး / RPO & RTO နာရီနှင့်ချီ ကြာမြင့်သည်
[ 2. Pilot Light ]       စရိတ် သက်သာ / DB Live Replicate လုပ်ထားပြီး စက်များ ပိတ်ထားသည်
[ 3. Warm Standby ]      စရိတ် အသင့်အတင့် / ဒုတိယ Region တွင် အသေးစား အမြဲ Run ထားသည်
[ 4. Multi-Site Active-Active ] စရိတ် အမြင့်ဆုံး / Tokyo နှင့် Osaka နှစ်ဖက်စလုံး Full Run နေသည်
```

---

## ၁၁.၂ FinOps & Cost Optimization Strategies

1. **Right-Sizing:** CloudWatch တွင် CPU အသုံးနည်းသော Server များကို Size ချုံ့ခြင်း။
2. **AWS Graviton:** ARM-based Graviton Instances (c7g, m7g, t4g) သုံးပါက Performance 20% တိုးပြီး စရိတ် 20% သက်သာသည်။
3. **Savings Plans & RI:** ၁ နှစ် သို့မဟုတ် ၃ နှစ် စာချုပ်ဖြင့် ၄၀% မှ ၇၂% စရိတ်ချွေတာခြင်း။
4. **NAT Gateway Optimization:** Dev Environment များတွင် AZ တိုင်း NAT GW မထည့်ဘဲ ၁ လုံးတည်း မျှဝေသုံးခြင်း။

---

## ၁၁.၃ AWS Well-Architected Framework (6 Pillars)

1. **Operational Excellence (運用の優秀性)**
2. **Security (セキュリティ)**
3. **Reliability (信頼性)**
4. **Performance Efficiency (パフォーマンス効率)**
5. **Cost Optimization (コスト最適化)**
6. **Sustainability (持続可能性)**

---

# ၁၂။ Level 11 — Japanese Workplace IT Vocabulary, Workflow & Ticket Simulation

---

## ၁၂.၁ Japanese IT Terminology (現場で必須のIT用語集)

| Japanese Term | 漢字 / カタカナ | English / Technical Meaning | မြန်မာလို အဓိပ္ပာယ်ရှင်းလင်းချက် |
| :--- | :--- | :--- | :--- |
| **Youken Teigi** | 要件定義 | Requirement Definition | Client လိုချင်သော စနစ်လိုအပ်ချက်များကို မေးမြန်းသတ်မှတ်ခြင်း |
| **Kihon Sekkei** | 基本設計 | High-Level Design (HLD) | အကြမ်းဖျင်း Architecture နှင့် Network မူဘောင် ရေးဆွဲခြင်း |
| **Shousai Sekkei** | 詳細設計 | Low-Level Design (LLD) | Parameter, IP, Security Group တစ်ခုချင်း အသေးစိတ် ရေးဆွဲခြင်း |
| **Kouchiku** | 構築 | Infrastructure Construction | AWS ပေါ်တွင် Server နှင့် Network များကို အမှန်တကယ် ဆောက်လုပ်ခြင်း |
| **Honban Kankyou**| 本番環境 | Production Environment | User အစစ်အမှန်များ အသုံးပြုနေသော Live စနစ် |
| **Staging Kankyou**| ステージング環境 | Staging Environment | Production နှင့် ပုံစံတူ ထားရှိပြီး Deploy မလုပ်မီ နောက်ဆုံး စမ်းသပ်သည့် စနစ် |
| **Kaihatsu Kankyou**| 開発環境 | Development Environment | Developer များ နေ့စဉ် စမ်းသပ် Code ရေးသော စနစ် |
| **Shouga Taiou** | 障害対応 | Incident / Troubleshooting | System ပျက်ကျခြင်း သို့မဟုတ် Error တက်လာပါက အရေးပေါ် ပြုပြင်ခြင်း |
| **Kirimodoshi** | 切り戻し | Rollback | Deploy အသစ်ကြောင့် Error တက်ပါက မူလ Version ဟောင်းသို့ ချက်ချင်း ပြန်လှည့်ခြင်း |
| **Joutyouka** | 冗長化 | Redundancy | စက်တစ်လုံး ပျက်သော်လည်း မရပ်တန့်စေရန် အရန်စက်များ ထပ်ဆောင်းထားရှိခြင်း |
| **Fuka Bunsan** | 負荷分散 | Load Balancing | ဝင်လာသော User Traffic ဝန်ကို ခွဲဝေမျှပေးခြင်း |
| **Unyou / Hoshu** | 運用・保守 | Operations & Maintenance | နေ့စဉ် စောင့်ကြည့်စစ်ဆေးခြင်းနှင့် ပုံမှန် ထိန်းသိမ်းစောင့်ရှောက်ခြင်း |

---

## ၁၂.၂ Real-Work Ticket Simulations (現場タスクシミュレーション)

### Ticket ဥပမာ- ၁
```markdown
【チケット番号】 AWS-SEC-2026-089
【タイトル】 本番環境EC2へのSSHアクセス制限およびSSM Session Manager移行の件
【優先度】 高 (High)
【担当者】 Cloud Engineer (You)

【要件概要】
現在、本番環境のEC2インスタンスにおいて、Inbound Port 22 (SSH) が開放されています。
セキュリティ監査に伴い、Port 22を完全に閉鎖し、
AWS Systems Manager (SSM) Session Manager経由のみでアクセスできるよう変更してください。

【作業手順】
1. EC2用のIAM Roleに `AmazonSSMManagedInstanceCore` Policy をアタッチする。
2. 対象EC2において `amazon-ssm-agent` がActive動作しているか確認する。
3. Security Groupの Inbound Rule から Port 22 を削除する。
4. CLI `aws ssm start-session --target <instance-id>` にて接続検証を行う。
```

---

# ၁၃။ Level 12 — Production Troubleshooting Runbook (障害対応マニュアル)

---

## Scenario 1: Website Downtime (アクセス不可・接続タイムアウト)
```
DNS စစ်ဆေးခြင်း (dig example.com)
  ↓ (OK)
CloudFront / WAF Block စစ်ဆေးခြင်း
  ↓ (OK)
ALB Inbound Port 80/443 & Target Group Health စစ်ဆေးခြင်း
  ↓ (Unhealthy)
EC2/ECS Container Process (Nginx/PHP) သေမသေ စစ်ဆေးခြင်း
```

---

## Scenario 2: HTTP 502 Bad Gateway
1. Target Server ပေါ်တွင် Web Service (Nginx/Node.js) ရပ်တန့်နေခြင်း။
2. ALB Health Check Path မှားယွင်းပြီး Target Unhealthy ဖြစ်နေခြင်း။
3. Application Timeout ဖြစ်သွားခြင်း။

---

## Scenario 3: Database Connection Error (DB接続エラー)
1. RDS Status သည် `available` ဖြစ်မဖြစ် စစ်ပါ။
2. RDS Security Group တွင် Application SG ID မှ Port 3306 ခွင့်ပြုထားမှု စစ်ပါ။
3. VPC Subnet Routing နှင့် Secrets Manager ထဲရှိ Password မှန်မမှန် စစ်ပါ။

---

## Scenario 4: High Latency & Slow Performance (レスポンス遅延)
1. RDS CPU & Slow Queries များကို Performance Insights တွင် ကြည့်ပါ။
2. Redis Cache Eviction ဖြစ်မဖြစ် စစ်ပါ။
3. ALB Target Response Time ကို CloudWatch Logs Insights ဖြင့် Filter ဆွဲထုတ်ပါ။

---

## Scenario 5: Amazon S3 403 Access Denied
1. S3 Block Public Access Setting စစ်ပါ။
2. Bucket Policy တွင် `Deny` Rule ရှိမရှိ စစ်ပါ။
3. IAM Task Role တွင် `s3:GetObject` Permission နှင့် KMS Key Permission စစ်ပါ။

---

# ၁၄။ Final Capstone Project — Production Laravel EC Site on AWS

```
                                 [ Users / Clients ]
                                          |
                              [ Route 53 (DNS Alias) ]
                                          |
                        [ CloudFront CDN (Global Caching) ]
                                          |
                         [ AWS WAF (Security Shield) ]
                                          |
             [ Application Load Balancer (Public Subnets AZ-1a / 1c) ]
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ ECS Fargate Web Task AZ-1a ]                            [ ECS Fargate Web Task AZ-1c ]
  (Private Subnet: 10.0.11.0/24)                            (Private Subnet: 10.0.12.0/24)
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
             v                                                         v
  [ ElastiCache Redis Cluster ]                             [ Aurora MySQL Multi-AZ Cluster ]
  - Sessions Store & Cache                                  - Writer (AZ-1a) & Reader (AZ-1c)
             |                                                         |
             +----------------------------+----------------------------+
                                          |
                        [ Amazon S3 (Encrypted Storage) ]
```

---

# ၁၅။ AWS CLI Complete Reference Cheatsheet

```bash
# Credentials စစ်ဆေးခြင်း
aws sts get-caller-identity

# EC2 စာရင်း ကြည့်ခြင်း
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --output table

# S3 Sync ပြုလုပ်ခြင်း
aws s3 sync ./dist/ s3://my-japan-prod-assets-bucket/ --delete

# ECS Service ကို Zero Downtime ဖြင့် Force Deploy လုပ်ခြင်း
aws ecs update-service --cluster japan-prod-cluster --service web-service --force-new-deployment

# CloudWatch Log ကို Real-time ကြည့်ခြင်း
aws logs tail /ecs/japan-prod-app --follow
```

---

# ၁၆။ Cloud Engineer Technical Interview Prep (Q&A)

### Q1: Security Group နှင့် Network ACL (NACL) ၏ အဓိက ကွာခြားချက်ကို ရှင်းပြပါ။
**အဖြေ:** Security Group သည် Instance Level ဖြစ်ပြီး Stateful ဖြစ်သည် (Inbound ပွင့်လျှင် Outbound အလိုအလျောက် ပွင့်သည်)။ NACL သည် Subnet Level ဖြစ်ပြီး Stateless ဖြစ်သည် (Inbound ကော Outbound ပါ သီးခြား Rule ရေးရပြီး Deny Rule သတ်မှတ်နိုင်သည်)။

### Q2: ဂျပန် Web Application တွင် Database ကို အပြင် Internet မှ တိုက်ရိုက် မရရှိစေရန် မည်သို့ Architecture ဆွဲမလဲ?
**အဖြေ:** Private DB Subnet တွင် ထားရှိမည်။ Publicly Accessible ကို No ထားမည်။ Security Group တွင် Application Server SG ID မှ Port 3306 သာ ခွင့်ပြုမည်။ ပြင်ပမှ ဝင်ရောက်ရန် SSM Session Manager Port Forwarding ကိုသာ အသုံးပြုမည်။

### Q3: ALB တွင် 504 Gateway Timeout တက်ပါက ဘာစစ်မလဲ?
**အဖြေ:** Backend Application ၏ Response ကြာချိန်သည် ALB Idle Timeout (60s) ထက် ကျော်လွန်နေခြင်း သို့မဟုတ် Database Slow Query ကြောင့် Backend Server Hang နေခြင်းကို စစ်ဆေးမည်။

### Q4: S3 Bucket ပေါ်သို့ အရေးကြီး စာရွက်စာတမ်းများ Upload တင်ရာတွင် မည်သို့ Secure ဖြစ်အောင် ပြုလုပ်မလဲ?
**အဖြေ:** Client အား S3 သို့ တိုက်ရိုက်ခွင့်မပြုဘဲ Backend မှ ၁၀ မိနစ် သက်တမ်းရှိ S3 Presigned URL ထုတ်ပေးမည်။ S3 Bucket တွင် KMS SSE-KMS Encryption ဖွင့်ထားမည်။

### Q5: Terraform တွင် State Lock ဆိုတာ ဘာလဲ?
**အဖြေ:** အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် Developer နှစ်ဦး တစ်ပြိုင်နက်တည်း apply လုပ်မိပါက State ပျက်စီးခြင်းမှ ကာကွယ်ရန် DynamoDB Table ဖြင့် State Lock ချထားသော စနစ် ဖြစ်သည်။

---

## ပြီးဆုံးခြင်း (Conclusion)
ဤ Course Book သည် Japan IT Cloud Industry တွင် တကယ်လက်တွေ့ အလုပ်လုပ်နိုင်သော **Professional AWS Cloud & DevOps Engineer** တစ်ဦး ဖြစ်လာစေရန် အစအဆုံး လမ်းညွှန်ပေးထားပါသည်။
