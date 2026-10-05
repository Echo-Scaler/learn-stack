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
