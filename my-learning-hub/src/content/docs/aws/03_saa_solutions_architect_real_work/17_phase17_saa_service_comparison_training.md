---
title: "Phase 17 — SAA Service Comparison Master Training (၁၃ မျိုး နှိုင်းယှဉ်ချက်နှင့် စာမေးပွဲ လက်တွေ့ လေ့ကျင့်ခန်း)"
description: "Architect Perspective: SAA-C03 စာမေးပွဲတွင် မေးခွန်းတိုင်းနီးပါးသည် Service တစ်ခုတည်း၏ သဘောတရားကို သီးသန့်မေးခြင်း မရှိပါ။ ပေးထားသော Requirement (စရိတ်သက်သာမှု"
---

## Phase 17 — SAA Service Comparison Master Training (၁၃ မျိုး နှိုင်းယှဉ်ချက်နှင့် စာမေးပွဲ လက်တွေ့ လေ့ကျင့်ခန်း)

> **Architect Perspective:** SAA-C03 စာမေးပွဲတွင် မေးခွန်းတိုင်းနီးပါးသည် Service တစ်ခုတည်း၏ သဘောတရားကို သီးသန့်မေးခြင်း မရှိပါ။ "ပေးထားသော Requirement (စရိတ်သက်သာမှု၊ မြန်နှုန်း၊ စီမံခန့်ခွဲရ လွယ်ကူမှု) အတွက် မည်သည့် Service ကို ရွေးချယ်သင့်သနည်း" ဟု အမြဲတမ်း နှိုင်းယှဉ်ရွေးချယ်ခိုင်းသည်။ ဤ Master Comparison (၁၃) မျိုးကို အလွတ်မကျက်ဘဲ **Real Work Usage** နှင့် **Exam Keywords** များဖြင့် အသေးစိတ် ပိုင်နိုင်ထားရပါမည်။

---

## ၁။ Compute: Amazon EC2 vs Amazon ECS (Fargate) vs AWS Lambda

```
+-----------------------------------------------------------------------------------------+
|                            COMPUTE HEAD-TO-HEAD COMPARISON                              |
+-----------------------------------------------------------------------------------------+
|  အချက်အလက်           |  Amazon EC2           |  Amazon ECS (Fargate) |  AWS Lambda       |
+----------------------+-----------------------+-----------------------+-------------------+
|  Service Model       |  IaaS (Virtual Server)|  CaaS (Serverless CTN)|  FaaS (Serverless)|
|  Server Management   |  OS, Patch, Security  |  Zero Server Mgmt     |  Zero Server Mgmt |
|  Execution Limit     |  Unlimited (24/7 Run) |  Unlimited (24/7 Run) |  **Max 15 minutes**|
|  Scaling Speed       |  2-5 mins (ASG Boot)  |  30-60 seconds        |  **Milliseconds** |
|  Billing Unit        |  Per second (Min 60s) |  Per vCPU / GB-sec    |  Per millisecond  |
|  State Management    |  Stateful or Stateless|  Stateful (with EFS)  |  **Stateless only**|
+----------------------+-----------------------+-----------------------+-------------------+
```

### Real-World Production Usage (လုပ်ငန်းခွင် လက်တွေ့ အသုံးချပုံ):
- **EC2:** Windows Server Application များ၊ Legacy Monolithic Systems (SAP, ERP)၊ Custom Kernel / Network Driver လိုအပ်သော စနစ်များတွင် သုံးသည်။
- **ECS (Fargate):** Microservices Web APIs (Node.js, Go, Spring Boot, Laravel)၊ Docker Container များကို OS Patching စရာမလိုဘဲ ၂၄ နာရီ Run ထားလိုသောအခါ သုံးသည်။
- **Lambda:** S3 Upload Event Processing (Image resizing)၊ Cron Jobs (ညဘက် DB cleanup)၊ REST APIs (Serverless HTTP APIs) တို့တွင် သုံးသည်။

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario:** *"A company runs a batch data transformation job once a day that takes 25 minutes to complete. The company wants to run this job with the least operational overhead."*
  - **မှန်ကန်သောအဖြေ:** **Amazon ECS on AWS Fargate** (သို့မဟုတ် AWS Batch on Fargate)။
  - **ဘာကြောင့် Lambda မှားသလဲ (Trap):** Lambda ၏ အမြင့်ဆုံး Runtime သည် **၁၅ မိနစ်သာ** ဖြစ်သောကြောင့် ၂၅ မိနစ် ကြာမည့် အလုပ်ကို လုပ်ဆောင်၍ မရပါ။
  - **ဘာကြောင့် EC2 မှားသလဲ (Trap):** EC2 သည် Least Operational Overhead မဟုတ်ပါ (OS patch စီမံရသည်)။

---

## ၂။ Database: Amazon RDS vs Amazon Aurora vs Amazon DynamoDB

```
+-----------------------------------------------------------------------------------------+
|                            DATABASE HEAD-TO-HEAD COMPARISON                             |
+-----------------------------------------------------------------------------------------+
|  အချက်အလက်           |  Amazon RDS           |  Amazon Aurora        |  Amazon DynamoDB  |
+----------------------+-----------------------+-----------------------+-------------------+
|  Data Architecture   |  Traditional SQL (EBS)|  Cloud-Native Shared  |  NoSQL Document / |
|                      |  (Single-AZ Disk)     |  Storage (3 AZs / 6c) |  Key-Value        |
|  Supported Engines   |  MySQL, Postgres, etc.|  MySQL, PostgreSQL    |  Proprietary NoSQL|
|  Scaling Storage     |  Manual/Auto up to 64T|  **Auto up to 128 TiB**| **Virtually Unltd**|
|  Replication Lag     |  Seconds to Minutes   |  **< 10 milliseconds**|  < 1s (Global Tbl)|
|  Query Performance   |  Single-digit ms      |  Single-digit ms (5x) |  **Single-digit ms|
|                      |                       |                       |  / Microseconds** |
|  Complex Joins / SQL |  Full SQL Support     |  Full SQL Support     |  **No Joins (PK)**|
+----------------------+-----------------------+-----------------------+-------------------+
```

### Real-World Production Usage:
- **RDS:** Standard Open Source Database (MySQL/Postgres) သို့မဟုတ် Commercial License (Oracle, MS SQL Server) သုံးစွဲရသော သမားရိုးကျ Web Apps များ။
- **Aurora:** Enterprise E-Commerce, Core Banking, SaaS Multi-Tenant Databases (Traffic ရုတ်တရက် အဆမတန် တက်လာနိုင်ပြီး High Availability မဖြစ်မနေ လိုအပ်သောအခါ)။
- **DynamoDB:** Mobile App User Profiles, IoT Sensor Readings, Gaming Leaderboards, Shopping Cart Sessions (Millions of Reads/Writes per second လိုအပ်သောအခါ)။

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario:** *"An e-commerce company needs a database that can handle millions of key-value lookups per second with consistent single-digit millisecond latency, without managing servers or storage provisioning."*
  - **မှန်ကန်သောအဖြေ:** **Amazon DynamoDB (On-Demand mode)**။
  - **ဘာကြောင့် RDS/Aurora မှားသလဲ:** Millions of writes/sec အတွက် Relational DB သည် Connection pooling နှင့် Lock contention ကြောင့် စရိတ်အဆမတန် ကြီးမားပြီး Serverless NoSQL လောက် စွမ်းဆောင်ရည် မကောင်းနိုင်ပါ။

---

## ၃။ Storage: Amazon S3 vs Amazon EBS vs Amazon EFS

```
+-----------------------------------------------------------------------------------------+
|                            STORAGE HEAD-TO-HEAD COMPARISON                              |
+-----------------------------------------------------------------------------------------+
|  အချက်အလက်           |  Amazon S3            |  Amazon EBS           |  Amazon EFS       |
+----------------------+-----------------------+-----------------------+-------------------+
|  Storage Classification Object Storage       |  Block Storage        |  File Storage     |
|  Attachment Scope    |  Global (HTTP/HTTPS)  |  **Single AZ Only**   |  **Multi-AZ**     |
|  Simultaneous Access |  Millions of clients  |  1 Instance (io2: 16) |  Thousands of EC2s|
|  Access Protocol     |  REST API (GET, PUT)  |  NVMe Block I/O Bus   |  NFSv4 (POSIX)    |
|  Typical Cost        |  ~$0.023 / GB / month |  ~$0.08 / GB (gp3)    |  ~$0.30 / GB      |
|  Durability SLA      |  **11 9's (99.999..%)**| 99.8% to 99.999%     |  **11 9's**       |
+----------------------+-----------------------+-----------------------+-------------------+
```

### Real-World Production Usage:
- **S3:** Static Web Assets, User Uploads (Photos/Videos), Big Data Analytics (Parquet files), Backup Archives။
- **EBS:** EC2 OS Root Boot Volume, Relational Database Data Disks (MySQL `/var/lib/mysql`)။
- **EFS:** WordPress Media Uploads Directory (`wp-content/uploads`) ကို EC2 Server ပေါင်း ၂၀ မှ တပြိုင်နက် ဖတ်ရှုရေးသားခြင်း၊ Linux Shared Home Directories။

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario:** *"A fleet of Linux web servers in multiple Availability Zones needs shared access to a POSIX-compliant filesystem to store uploaded documents."*
  - **မှန်ကန်သောအဖြေ:** **Amazon EFS (Elastic File System)**။
  - **ဘာကြောင့် EBS မှားသလဲ:** EBS gp3 သည် AZ တစ်ခုတည်းတွင်သာ ချိတ်နိုင်ပြီး Multi-AZ ရှိ EC2 များ ဆီသို့ ဖြန့်ကြက် ချိတ်ဆက်၍ မရပါ။

---

## ၄။ Load Balancing: Application Load Balancer (ALB) vs Network Load Balancer (NLB)

```
+-----------------------------------------------------------------------------------------+
|                         LOAD BALANCING HEAD-TO-HEAD COMPARISON                          |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Application Load Balancer (ALB) |  Network Load Balancer (NLB)  |
+----------------------+----------------------------------+-------------------------------+
|  OSI Layer           |  **Layer 7 (Application)**       |  **Layer 4 (Transport)**      |
|  Supported Protocols |  HTTP, HTTPS, gRPC, WebSockets   |  TCP, UDP, TLS                |
|  Routing Logic       |  Path (`/api`), Host (`app.com`),|  IP Address and Port only     |
|                      |  Headers, Query String           |                               |
|  Static IP / EIP     |  **မရပါ (DNS CNAME သာ ရသည်)**     |  **Elastic Static IP ရသည်**   |
|  Latency & Speed     |  Milliseconds                    |  **Ultra-Low (Microseconds)** |
|  Security Suite      |  AWS WAF, User Auth (OIDC/Cognito)| AWS Shield, Target SGs       |
+----------------------+----------------------------------+-------------------------------+
```

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario 1:** *"The client application requires a static IP address to whitelist in their corporate on-premises firewall."*
  - **မှန်ကန်သောအဖြေ:** **Network Load Balancer (NLB)** (AZ တစ်ခုစီအတွက် Static Elastic IP ပေးနိုင်သောကြောင့်)။
  - **ဘာကြောင့် ALB မှားသလဲ:** ALB သည် AWS က IP အမြဲပြောင်းလဲနေသောကြောင့် Static IP မရနိုင်ပါ။
- **Scenario 2:** *"Route requests to `/orders` to a microservice target group and `/users` to another target group."*
  - **မှန်ကန်သောအဖြေ:** **Application Load Balancer (ALB)** (Path-based routing စွမ်းရည်ကြောင့်)။

---

## ၅။ Messaging: Amazon SQS vs Amazon SNS vs Amazon EventBridge

```
+-----------------------------------------------------------------------------------------+
|                           MESSAGING HEAD-TO-HEAD COMPARISON                             |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Amazon SQS        |  Amazon SNS        |  Amazon EventBridge    |
+----------------------+--------------------+--------------------+------------------------+
|  Message Model       |  **Pull (Poll)**   |  **Push (Pub/Sub)**|  **Push (Event Bus)**  |
|  Delivery Target     |  1 Consumer Queue  |  Multiple Subs     |  Multiple Targets (AWS)|
|  Message Persistence |  **Up to 14 days** |  **No Storage**    |  Archive & Replay ရသည် |
|  Ordering Guaranteed |  FIFO Queue ရသည်   |  FIFO Topic ရသည်   |  Order မသေချာပါ        |
|  Content Filtering   |  None              |  Message Attribute |  **Rich JSON Pattern** |
|  SaaS Integration    |  None              |  Limited           |  Salesforce, Datadog   |
+----------------------+--------------------+--------------------+------------------------+
```

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario:** *"When a user completes a purchase, the system must trigger 3 separate backend actions simultaneously: charge card, notify warehouse, and send SMS. The actions must not block each other."*
  - **မှန်ကန်သောအဖြေ:** **Amazon SNS Topic ဖြင့် Publish လုပ်ပြီး SQS Queues ၃ ခုဆီသို့ Fan-out ပို့ဆောင်ခြင်း**။

---

## ၆။ In-Memory Cache: Amazon ElastiCache for Redis vs Memcached

```
+-----------------------------------------------------------------------------------------+
|                             ELASTICACHE COMPARISON MATRIX                               |
+-----------------------------------------------------------------------------------------+
|  Feature             |  ElastiCache for Redis           |  ElastiCache for Memcached    |
+----------------------+----------------------------------+-------------------------------+
|  Data Structures     |  Strings, Hashes, Lists, Sets,   |  Pure Key-Value Strings only  |
|                      |  **Sorted Sets (Leaderboards)**  |                               |
|  High Availability   |  **Multi-AZ with Auto-Failover** |  No Multi-AZ (Independent)    |
|  Read Scaling        |  **Read Replicas (Up to 5)**     |  Multi-node sharding          |
|  Data Persistence    |  **RDB Snapshots & AOF logs**    |  **None (Memory Loss on Down)**|
|  Pub/Sub Messaging   |  Yes                             |  No                           |
+----------------------+----------------------------------+-------------------------------+
```

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario:** *"An online mobile game requires a real-time leaderboard ranking top 100 players with sub-millisecond latency. The cache must survive node failures without losing data."*
  - **မှန်ကန်သောအဖြေ:** **Amazon ElastiCache for Redis** (Sorted Sets + Multi-AZ replication)။

---

## ၇။ DNS: Amazon Route 53 Routing Policies

```
+-----------------------------------------------------------------------------------------+
|                         ROUTE 53 POLICIES CHEAT SHEET                                   |
+-----------------------------------------------------------------------------------------+
|  Policy Name         |  အလုပ်လုပ်ပုံ                       |  အသုံးချသည့် Exam Scenario            |
+----------------------+------------------------------------+-----------------------------+
|  **Simple**          |  1 Domain -> 1 IP (သို့ Round-robin)| Single server, No HA check  |
|  **Weighted**        |  Traffic ကို % ဖြင့် ဝေခြမ်းသည်       | Canary Deployment (10%/90%) |
|  **Latency-Based**   |  User နှင့် Ping နည်းဆုံး Region ပို့ | Global Low Latency web apps |
|  **Failover**        |  Health check စစ်ပြီး Active/Passive| Disaster Recovery (DR)      |
|  **Geolocation**     |  User ၏ နိုင်ငံ/တိုက်ပေါ် မူတည်သည်   | GDPR, Language Localization |
|  **Geoproximity**    |  GPS Coordinates & Route 53 Bias   | Regional traffic shift      |
|  **Multi-Value**     |  Healthy IPs ၈ ခုအထိ ကျပန်း ပြန်ပေး  | Client-side load balancing  |
+-----------------------------------------------------------------------------------------+
```

---

## ၈။ CDN & Global Edge: CloudFront + S3 vs Direct S3 Website

```
+-----------------------------------------------------------------------------------------+
|                         CLOUDFRONT VS DIRECT S3 COMPARISON                              |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Amazon CloudFront + S3          |  Direct S3 Website Hosting    |
+----------------------+----------------------------------+-------------------------------+
|  Performance         |  Global 400+ Edge Caches (Fast)  |  Single Region (Slow outside) |
|  Custom Domain SSL   |  **Free ACM HTTPS Certificates** |  **HTTPS မရပါ (HTTP Only!)**  |
|  S3 Security         |  **Private Bucket (OAC Auth)**   |  **Public Read Bucket**       |
|  Data Egress Cost    |  CloudFront discounted egress    |  Full S3 Data Transfer Out    |
|  Geo-Restriction     |  Allow/Block specific countries  |  None                         |
+----------------------+----------------------------------+-------------------------------+
```

> [!IMPORTANT]
> **Exam Trap:** S3 Static Website Hosting သည် Custom Domain အတွက် HTTPS (SSL) ကို မပံ့ပိုးပါ။ Domain Name ဖြင့် HTTPS လိုအပ်ပါက အမြဲတမ်း **Amazon CloudFront + AWS Certificate Manager (ACM)** ကို တွဲဖက်ရွေးချယ်ရမည်။

---

## ၉။ Access Management: IAM User vs IAM Role

```
+-----------------------------------------------------------------------------------------+
|                         IAM USER VS IAM ROLE COMPARISON                                 |
+-----------------------------------------------------------------------------------------+
|  အချက်အလက်           |  IAM User                        |  IAM Role                     |
+----------------------+----------------------------------+-------------------------------+
|  အသုံးပြုသူ           |  လူသားတစ်ဦးချင်းစီ (Human Login)  |  AWS Services, Cross-Account  |
|  Credentials         |  Long-term Password & Access Key |  **Short-term STS Tokens**    |
|  Expiration          |  Never expires (Manual delete)   |  **Expires in 1 to 12 hours** |
|  Security Risk       |  High (Hardcoded keys leak)      |  **Zero Hardcoded Keys Risk** |
+----------------------+----------------------------------+-------------------------------+
```

### Exam Rule:
EC2, Lambda, ECS များမှ S3, DynamoDB သို့ ချိတ်ဆက်ရာတွင် Code ထဲ၌ Access Key ရေးထည့်ခြင်းကို **Anti-pattern** အဖြစ် သတ်မှတ်ပြီး **IAM Role (Instance Profile)** သာ အမြဲတမ်း အဖြေမှန် ဖြစ်သည်။

---

## ၁၀။ Network: Public Subnet vs Private Subnet

```
+-----------------------------------------------------------------------------------------+
|                         PUBLIC VS PRIVATE SUBNET MATRIX                                 |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Public Subnet                   |  Private Subnet               |
+----------------------+----------------------------------+-------------------------------+
|  Default Route       |  `0.0.0.0/0 -> Internet Gateway` |  `0.0.0.0/0 -> NAT Gateway`   |
|  Public IP           |  Yes (Auto-assign Public IP)     |  No (Private RFC 1918 IPs)    |
|  Direct Internet In  |  Allowed (via IGW)               |  **Blocked (Zero Inbound)**   |
|  Typical Workloads   |  ALB, NAT Gateways, Bastion      |  App Servers, Backend DBs     |
+----------------------+----------------------------------+-------------------------------+
```

---

## ၁၁။ Database Availability: RDS Multi-AZ vs RDS Read Replica

```
+-----------------------------------------------------------------------------------------+
|                        MULTI-AZ VS READ REPLICA DEEP DIVE                               |
+-----------------------------------------------------------------------------------------+
|  Feature             |  RDS Multi-AZ Deployment         |  RDS Read Replica             |
+----------------------+----------------------------------+-------------------------------+
|  Primary Purpose     |  **High Availability (HA) & DR** |  **Read Scalability**         |
|  Replication Type    |  **Synchronous (Zero Data Loss)**|  **Asynchronous (Lag ရှိသည်)**|
|  Can read queries?   |  **Cannot read (Standby is off)**|  **Yes (SELECT queries only)**|
|  Failover Trigger    |  **Automatic via DNS CNAME**     |  **Manual Promotion Required**|
|  Scope               |  Single Region (Multiple AZs)    |  Same-Region or Cross-Region  |
+----------------------+----------------------------------+-------------------------------+
```

### SAA-C03 Real Exam Scenario & Trap Elimination:
- **Scenario 1:** *"The production database experiences high CPU due to reporting queries. Performance must be restored without affecting write transactions."*
  - **မှန်ကန်သောအဖြေ:** **RDS Read Replica** ဖန်တီးပြီး Reporting queries များကို Replica သို့ လွှဲပြောင်းပေးခြင်း။
  - **ဘာကြောင့် Multi-AZ မှားသလဲ:** Multi-AZ ၏ Standby DB သည် Query ဖတ်၍ မရသောကြောင့် Read Performance ကို မကူညီနိုင်ပါ။
- **Scenario 2:** *"Ensure the database can automatically recover within 60 seconds if an AZ data center fails."*
  - **မှန်ကန်သောအဖြေ:** **RDS Multi-AZ** (Synchronous Automatic Failover)။

---

## ၁၂။ Backup Strategy: Amazon EBS Snapshot vs AWS Backup

```
+-----------------------------------------------------------------------------------------+
|                         EBS SNAPSHOT VS AWS BACKUP MATRIX                               |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Amazon EBS Snapshot             |  AWS Backup                   |
+----------------------+----------------------------------+-------------------------------+
|  Coverage            |  EBS Volumes only                |  EBS, RDS, DynamoDB, EFS, S3  |
|  Management Scope    |  Individual volume level         |  **Central Organization Policy|
|  Compliance Vault    |  Standard S3 bucket storage      |  **WORM Vault Lock (Immutable)|
|  Cross-Account/Reg   |  Manual copy script needed       |  **Automated Policy Schedule**|
+----------------------+----------------------------------+-------------------------------+
```

---

## ၁၃။ Shared File Access: Amazon EFS vs Amazon S3

```
+-----------------------------------------------------------------------------------------+
|                             EFS VS S3 COMPARISON MATRIX                                 |
+-----------------------------------------------------------------------------------------+
|  Feature             |  Amazon EFS                      |  Amazon S3                    |
+----------------------+----------------------------------+-------------------------------+
|  Mountable on OS?    |  **Yes (Mounts as `/mnt/data`)** |  No (SDK API or FUSE mount)   |
|  File Locking        |  **POSIX byte-range locking**    |  No locking mechanism         |
|  File Modifications  |  In-place byte edits             |  Replaces entire object       |
|  Typical Cost        |  ~$0.30 / GB / month             |  ~$0.023 / GB / month         |
|  Application Fit     |  Legacy apps needing filesystems |  Cloud-native object storage  |
+----------------------+----------------------------------+-------------------------------+
```

### Exam Rule:
အကယ်၍ Application Code ကို မပြင်ဆင်ဘဲ Linux Filesystem အတိုင်း Mount ချိတ်ဆက်ပြီး Read/Write လုပ်လိုပါက **Amazon EFS** ဖြစ်ပြီး၊ REST API (`GetObject`/`PutObject`) ဖြင့် လှမ်းခေါ်လိုပါက **Amazon S3** ဖြစ်သည်။

---
*သင်ရိုးမာတိကာသို့ ပြန်သွားရန်:* [README.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/README.md)
