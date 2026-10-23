---
title: "All in One Feature of SAA — Complete Master Blueprint"
description: "AWS Solutions Architect - Associate (SAA-C03) အတွက် မဖြစ်မနေ တတ်မြောက်ထားရမည့် Core Compute, Storage, Databases, Networking, AI, Security, Scaling, Integration, Migration & Analytics Services ၅၀ လက်စွဲ"
---

# All in One Feature of SAA
### AWS Solutions Architect - Associate (SAA-C03) & Production Infrastructure Guide

AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Production Infrastructure တည်ဆောက်ရာတွင် အဓိက အကျဆုံးဖြစ်သော **AWS Core Services ၅၀ ခု** ကို သက်ဆိုင်ရာ 12 Sectors များအလိုက် အခြေခံမှ စတင်၍ 10-Point Master Structure (Architecture, How it works, Comparison, Hands-on Lab, Cost, SAA-C03 Exam Traps & Quiz) ဖြင့် ဤ Track တစ်ခုတည်းတွင် အပြည့်အစုံ စနစ်တကျ စုစည်းတင်ပြထားပါသည်:

---

## 🏛️ Part 1: Compute & Container Services (တွက်ချက်မှုနှင့် ကွန်တိန်နာ ဝန်ဆောင်မှုများ)

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Services & Focus | အခန်းရေ | လေ့လာရန် Link |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **Amazon EC2 (Elastic Compute Cloud)** | IaaS Virtual Servers, Nitro System, Instance Lifecycle, VPC, EBS/EFS, ASG & ALB | ၁၁ ခန်း | [**EC2 စတင်လေ့လာရန် →**](/aws-saa/01_ec2/00_overview/) |
| **02** | **Amazon ECS (Elastic Container Service)** | Docker Containers, Task Definitions, ECS Services, Fargate vs EC2, Deployments & Monitoring | ၇ ခန်း | [**ECS စတင်လေ့လာရန် →**](/aws-saa/02_ecs/00_overview/) |
| **03** | **Amazon ECR (Elastic Container Registry)** | Private/Public Registries, Docker Push/Pull, Image Scanning, Lifecycle Policies & CI/CD | ၇ ခန်း | [**ECR စတင်လေ့လာရန် →**](/aws-saa/03_ecr/00_overview/) |
| **04** | **Amazon EKS (Elastic Kubernetes Service)** | Kubernetes Control Plane, Managed Nodes, Fargate, VPC CNI, IRSA, Pods & Services | ၈ ခန်း | [**EKS စတင်လေ့လာရန် →**](/aws-saa/04_eks/00_overview/) |
| **05** | **AWS Elastic Beanstalk** | Platform as a Service (PaaS), Web vs Worker Tiers, Rolling/Immutable Deployments | ၆ ခန်း | [**Beanstalk စတင်လေ့လာရန် →**](/aws-saa/05_elastic_beanstalk/00_overview/) |
| **06** | **AWS Lambda (Serverless Compute)** | Event-driven FaaS, Concurrency, Cold Starts, API Gateway/S3/EventBridge Triggers | ၇ ခန်း | [**Lambda စတင်လေ့လာရန် →**](/aws-saa/06_lambda/00_overview/) |
| **07** | **AWS Batch (Batch Computing Service)** | Job Definitions, Job Queues, Compute Environments, Spot Sizing & Parallel Processing | ၆ ခန်း | [**Batch စတင်လေ့လာရန် →**](/aws-saa/07_batch/00_overview/) |
| **08** | **Amazon Lightsail** | Easy-to-use virtual private servers (VPS) for simple websites or apps, WordPress & LAMP | ၃ ခန်း | [**Lightsail စတင်လေ့လာရန် →**](/aws-saa/08_lightsail/00_overview/) |

---

## 💾 Part 2: Storage Services (ဒေတာ သိုလှောင်မှု၊ အရန်သိမ်းဆည်းမှုနှင့် မော်ကွန်းတိုက် ဝန်ဆောင်မှုများ)

> **Storage Services Definition:** Services used for saving, backing up, and archiving data.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Storage အမျိုးအစား & Focus | အခန်းရေ | လေ့လာရန် Link |
| :---: | :--- | :--- | :---: | :--- |
| **09** | **Amazon S3 (Simple Storage Service)** | Highly durable object storage for files, images, and backups (11 9s durability, Lifecycle, Bucket Policies, Encryption) | ၇ ခန်း | [**Amazon S3 စတင်လေ့လာရန် →**](/aws-saa/09_s3/00_overview/) |
| **10** | **Amazon EBS (Elastic Block Store)** | High-performance block storage volumes for Amazon EC2 (gp3, io2, st1, Snapshots, Multi-Attach) | ၅ ခန်း | [**Amazon EBS စတင်လေ့လာရန် →**](/aws-saa/10_ebs/00_overview/) |
| **11** | **Amazon EFS (Elastic File System)** | Serverless, fully managed file system for use with compute services (Multi-AZ NFS, POSIX shared storage) | ၄ ခန်း | [**Amazon EFS စတင်လေ့လာရန် →**](/aws-saa/11_efs/00_overview/) |
| **12** | **Amazon S3 Glacier** | Ultra low-cost storage class for data archiving and long-term backup (Vault Lock, WORM compliance, Retrieval tiers) | ၃ ခန်း | [**S3 Glacier စတင်လေ့လာရန် →**](/aws-saa/12_s3_glacier/00_overview/) |

---

## 🗄️ Part 3: Databases (ဒေတာဘေ့စ် ဝန်ဆောင်မှုများ)

> **Databases Definition:** Managed relational, NoSQL, and in-memory transactional databases.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | Database Engine အမျိုးအစား & Focus | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **13** | **Amazon RDS (Relational Database Service)** | Managed relational databases for MySQL, PostgreSQL, Oracle, SQL Server (Multi-AZ, Read Replicas, Backups) | [**Amazon RDS Guide →**](/aws-saa/13_rds/01_amazon_rds_master_guide/) |
| **14** | **Amazon Aurora** | Cloud-native, high-performance relational database (5x MySQL, 3x Postgres, 6 Storage Copies across 3 AZs, Serverless v2) | [**Amazon Aurora Guide →**](/aws-saa/14_aurora/01_amazon_aurora_master_guide/) |
| **15** | **Amazon DynamoDB** | Managed NoSQL database offering single-digit millisecond performance (Key-Value, Document, DAX, Streams, Global Tables) | [**Amazon DynamoDB Guide →**](/aws-saa/15_dynamodb/01_amazon_dynamodb_master_guide/) |
| **16** | **Amazon ElastiCache** | In-memory caching service supporting Redis and Memcached to speed up apps (Sub-millisecond, Session Store, Leaderboards) | [**Amazon ElastiCache Guide →**](/aws-saa/16_elasticache/01_amazon_elasticache_master_guide/) |

---

## 🌐 Part 4: Networking & Content Delivery (ကွန်ရက်နှင့် အကြောင်းအရာ ဖြန့်ဝေမှု)

> **Networking & Content Delivery Definition:** Services for isolating infrastructure, managing traffic, and routing users.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & Networking နည်းပညာများ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **17** | **Amazon VPC (Virtual Private Cloud)** | Isolated virtual network to securely run your AWS resources (Public/Private Subnets, IGW, NAT Gateway, NACLs vs SGs) | [**Amazon VPC Guide →**](/aws-saa/17_vpc/01_amazon_vpc_master_guide/) |
| **18** | **Amazon Route 53** | Scalable cloud Domain Name System (DNS) and domain registration (7 Routing Policies, Health Checks, Alias Records) | [**Amazon Route 53 Guide →**](/aws-saa/18_route53/01_amazon_route53_master_guide/) |
| **19** | **Amazon CloudFront** | Global content delivery network (CDN) to speed up website loading (Edge Locations, Origin Access Control OAC, Signed URLs) | [**Amazon CloudFront Guide →**](/aws-saa/19_cloudfront/01_amazon_cloudfront_master_guide/) |
| **20** | **Amazon API Gateway** | Managed service to create, publish, and secure APIs at scale (HTTP API, REST API, WebSocket API, Throttling, Authorizers) | [**Amazon API Gateway Guide →**](/aws-saa/20_api_gateway/01_amazon_api_gateway_master_guide/) |

---

## 🤖 Part 5: Machine Learning & AI (စက်သင်ယူမှုနှင့် ဉာဏ်ရည်တု)

> **Machine Learning & AI Definition:** Tools for building intelligence, managing LLMs, and deploying algorithms.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & AI စွမ်းရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **21** | **Amazon Bedrock** | Service to build and scale generative AI applications using foundation models (Claude 3, Llama 3, Serverless RAG, Guardrails) | [**Amazon Bedrock Guide →**](/aws-saa/21_bedrock/01_amazon_bedrock_master_guide/) |
| **22** | **Amazon SageMaker** | Fully-managed platform to build, train, and deploy machine learning models (Studio, Managed Spot Training, Real-time/Serverless Inference) | [**Amazon SageMaker Guide →**](/aws-saa/22_sagemaker/01_amazon_sagemaker_master_guide/) |
| **23** | **Amazon Lex** | Service for building conversational interfaces into applications using voice and text (Powers Alexa, Intents, Slots, Amazon Connect) | [**Amazon Lex Guide →**](/aws-saa/23_lex/01_amazon_lex_master_guide/) |

---

## 🛡️ Part 6: Security, Identity, & Compliance (လုံခြုံရေး၊ အထောက်အထားနှင့် စည်းမျဉ်းလိုက်နာမှု)

> **Security, Identity, & Compliance Definition:** Tools for securing data access, identities, and encryption keys.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Security စနစ်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **24** | **AWS IAM (Identity and Access Management)** | Securely manage access to AWS services and resources (Users, Groups, Roles, Policies, STS, Least Privilege) | [**AWS IAM Guide →**](/aws-saa/24_iam/01_aws_iam_master_guide/) |
| **25** | **AWS KMS (Key Management Service)** | Managed service to create and control cryptographic keys (FIPS 140-2 Level 3 HSM, Envelope Encryption, Annual Rotation) | [**AWS KMS Guide →**](/aws-saa/25_kms/01_aws_kms_master_guide/) |
| **26** | **Amazon Cognito** | Customer identity and access management for web and mobile apps (User Pools for Auth, Identity Pools for Direct AWS Access) | [**Amazon Cognito Guide →**](/aws-saa/26_cognito/01_amazon_cognito_master_guide/) |
| **27** | **AWS WAF (Web Application Firewall)** | Protects web applications from common web exploits (Layer 7 Inspection, SQLi, XSS, Rate-based anti-DDoS, Managed Rules) | [**AWS WAF Guide →**](/aws-saa/27_waf/01_aws_waf_master_guide/) |

---

## ⚙️ Part 7: Management & Governance (စီမံခန့်ခွဲမှုနှင့် အုပ်ချုပ်မှု)

> **Management & Governance Definition:** Services to monitor architectures, automate deployments, and track costs.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စီမံခန့်ခွဲမှု ကိရိယာများ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **28** | **Amazon CloudWatch** | Monitoring and management service providing data and insights for AWS resources (Metrics, Unified Agent for RAM, Alarms, Logs) | [**Amazon CloudWatch Guide →**](/aws-saa/28_cloudwatch/01_amazon_cloudwatch_master_guide/) |
| **29** | **AWS CloudTrail** | Tracks user activity and API usage across your AWS infrastructure for auditing (Who did what, Log File Integrity SHA-256) | [**AWS CloudTrail Guide →**](/aws-saa/29_cloudtrail/01_aws_cloudtrail_master_guide/) |
| **30** | **AWS CloudFormation** | Infrastructure as Code (IaC) tool to model and set up AWS resources via templates (Stacks, Change Sets, StackSets, Drift Detection) | [**AWS CloudFormation Guide →**](/aws-saa/30_cloudformation/01_aws_cloudformation_master_guide/) |

---

## ⚖️ Part 8: Load Balancing, Gateways & Scaling (ဝန်မျှဝေမှု၊ ဂိတ်ဝေးများနှင့် အလိုအလျောက်ချဲ့ထွင်မှု)

> **Load Balancing, Gateways & Scaling Definition:** Services for high availability traffic distribution, network boundary transit, secure private endpoints, and automated compute elasticity.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စွမ်းဆောင်ရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **31** | **Amazon ALB (Application Load Balancer)** | Layer 7 intelligent HTTP/HTTPS load balancing (Path/Host routing, SSL termination, Target Groups, OIDC auth, WAF integration) | [**Amazon ALB Guide →**](/aws-saa/31_alb/01_alb_master_guide/) |
| **32** | **Amazon NLB (Network Load Balancer)** | Layer 4 ultra-high performance TCP/UDP/TLS load balancing (Millions RPS, Ultra-low latency, Static Elastic IPs, PrivateLink source) | [**Amazon NLB Guide →**](/aws-saa/32_nlb/01_nlb_master_guide/) |
| **33** | **Amazon GWLB (Gateway Load Balancer)** | Layer 3/4 fleet management for 3rd-party Virtual Appliances (Firewalls, IDS/IPS, GENEVE encapsulation, transparent bump-in-the-wire) | [**Amazon GWLB Guide →**](/aws-saa/33_gwlb/01_gwlb_master_guide/) |
| **34** | **Amazon CLB (Classic Load Balancer)** | Legacy Layer 4/7 balancer for EC2-Classic migration (Cross-zone load balancing, Stickiness, basic SSL termination) | [**Amazon CLB Guide →**](/aws-saa/34_clb/01_clb_master_guide/) |
| **35** | **Amazon API Gateway Deep Dive** | Serverless API management at scale (REST vs HTTP vs WebSocket, Usage Plans, API Keys, Cognito/Lambda Authorizers, Throttling) | [**API Gateway Deep Dive →**](/aws-saa/35_api_gateway_deep_dive/01_api_gateway_deep_dive_master_guide/) |
| **36** | **Internet Gateway (IGW)** | Scalable VPC-to-Internet bidirectional routing component (Public Subnets, Route Table 0.0.0.0/0 target, 1:1 NAT public IPs) | [**Internet Gateway Guide →**](/aws-saa/36_internet_gateway/01_internet_gateway_master_guide/) |
| **37** | **AWS VPC Endpoint** | Private access to AWS services without IGW, NAT Gateway, or Public IPs (Interface Endpoints via PrivateLink vs Gateway Endpoints for S3/DynamoDB) | [**VPC Endpoint Guide →**](/aws-saa/37_vpc_endpoint/01_vpc_endpoint_master_guide/) |
| **38** | **AWS Auto Scaling** | Automated compute capacity adjustment (ASG Launch Templates, Dynamic/Target Tracking/Predictive Scaling policies, ELB Health Checks) | [**Auto Scaling Guide →**](/aws-saa/38_auto_scaling/01_auto_scaling_master_guide/) |

---

## 📬 Part 9: Application Integration (အပလီကေးရှင်း ချိတ်ဆက်ပေါင်းစပ်မှု ဝန်ဆောင်မှုများ)

> **Application Integration Definition:** Loosely-coupled messaging queues, pub/sub notification broadcasters, and serverless event buses to decouple distributed microservices.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စွမ်းဆောင်ရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **39** | **Amazon SQS (Simple Queue Service)** | Distributed message queuing service (Standard vs FIFO, Visibility Timeout, Long Polling, Dead-Letter Queues) | [**Amazon SQS Guide →**](/aws-saa/39_sqs/01_sqs_master_guide/) |
| **40** | **Amazon SNS (Simple Notification Service)** | Fully managed Pub/Sub notification service (Fan-out to SQS/Lambda/SMS/Email, Message Filtering, FIFO Topics) | [**Amazon SNS Guide →**](/aws-saa/40_sns/01_sns_master_guide/) |
| **41** | **Amazon EventBridge** | Serverless event bus with advanced JSON content-based routing (SaaS Partner integrations, Schema Registry, Archive & Replay) | [**Amazon EventBridge Guide →**](/aws-saa/41_eventbridge/01_eventbridge_master_guide/) |

---

## 🚚 Part 10: Migration & Data Transfer (ဒေတာ ရွှေ့ပြောင်းခြင်းနှင့် လွှဲပြောင်းမှု ဝန်ဆောင်မှုများ)

> **Migration & Data Transfer Definition:** Accelerated online replication, heterogeneous database schema conversion, and offline physical appliances for petabyte-scale data migration.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စွမ်းဆောင်ရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **42** | **AWS DMS (Database Migration Service)** | Minimal downtime database migration (Continuous CDC replication, Homogeneous & Heterogeneous with AWS SCT) | [**AWS DMS Guide →**](/aws-saa/42_dms/01_dms_master_guide/) |
| **43** | **AWS DataSync** | Accelerated online file and object data transfer (10x network acceleration, automated checksum verification, S3/EFS/FSx sync) | [**AWS DataSync Guide →**](/aws-saa/43_datasync/01_datasync_master_guide/) |
| **44** | **AWS Snow Family** | Physical offline data migration & edge computing (Snowcone 8-14TB, Snowball Edge 80-210TB, Snowmobile up to 100PB) | [**AWS Snow Family Guide →**](/aws-saa/44_snow_family/01_snow_family_master_guide/) |

---

## 📊 Part 11: Analytics & Big Data (ဒေတာ ခွဲခြမ်းစိတ်ဖြာမှုနှင့် ဘစ်ဒေတာ ဝန်ဆောင်မှုများ)

> **Analytics & Big Data Definition:** Serverless interactive querying, enterprise data warehousing, automated ETL data integration, real-time streaming, and distributed Hadoop/Spark clusters.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စွမ်းဆောင်ရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **45** | **Amazon Redshift** | Petabyte-scale cloud data warehouse & OLAP (RA3 Managed Storage, Redshift Spectrum, MPP, Columnar Storage) | [**Amazon Redshift Guide →**](/aws-saa/45_redshift/01_redshift_master_guide/) |
| **46** | **Amazon Athena** | Serverless interactive SQL query engine on S3 (Presto/Trino, Pay-per-query $5/TB, Glue Data Catalog, Parquet Optimization) | [**Amazon Athena Guide →**](/aws-saa/46_athena/01_athena_master_guide/) |
| **47** | **AWS Glue** | Fully managed serverless ETL & Data Integration (Glue Crawlers, Data Catalog, Spark Serverless Jobs, DataBrew) | [**AWS Glue Guide →**](/aws-saa/47_glue/01_glue_master_guide/) |
| **48** | **Amazon Kinesis** | Real-time streaming data platform (Kinesis Data Streams, Data Firehose near-real-time S3 delivery, Shard scaling) | [**Amazon Kinesis Guide →**](/aws-saa/48_kinesis/01_kinesis_master_guide/) |
| **49** | **Amazon EMR** | Managed big data platform for open-source frameworks (Apache Spark, Hadoop, Hive, Presto, Master/Core/Task Spot Nodes) | [**Amazon EMR Guide →**](/aws-saa/49_emr/01_emr_master_guide/) |

---

## ✉️ Part 12: Business Applications & Messaging (စီးပွားရေး အပလီကေးရှင်းများနှင့် အီးမေးလ် ပေးပို့မှု)

> **Business Applications Definition:** Highly scalable cloud-based transactional and marketing email delivery with industry-standard authentication.

| Feature | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Focus & စွမ်းဆောင်ရည်များ | လေ့လာရန် Link |
| :---: | :--- | :--- | :--- |
| **50** | **Amazon SES (Simple Email Service)** | High-deliverability transactional and marketing emails (SPF, DKIM, DMARC, Suppression Lists, Sandbox vs Production) | [**Amazon SES Guide →**](/aws-saa/50_ses/01_ses_master_guide/) |
