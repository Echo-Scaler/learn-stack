---
title: "၁၃။ Final Capstone Project — Production Laravel EC Site on AWS"
description: "Tokyo အခြေစိုက် အဝတ်အထည်နှင့် ဖက်ရှင် Online EC Site ကုမ္ပဏီတစ်ခုက လက်ရှိ On-premises Server ပေါ်ရှိ စနစ်အား AWS Cloud Production Environment သို့ ပြောင်းရွှေ့"
---

## ၁၃။ Final Capstone Project — Production Laravel EC Site on AWS

---

## ၁၃.၁ Japanese Web Company Simulation (現場シミュレーション)

### Client Requirement (クライアント要件):
Tokyo အခြေစိုက် အဝတ်အထည်နှင့် ဖက်ရှင် Online EC Site ကုမ္ပဏီတစ်ခုက လက်ရှိ On-premises Server ပေါ်ရှိ စနစ်အား **AWS Cloud Production Environment** သို့ ပြောင်းရွှေ့ (Migration) တည်ဆောက်ပေးရန် တောင်းဆိုလာသည်။

### စနစ် လိုအပ်ချက်များ (System Requirements):
1. **High Availability:** Single Point of Failure မရှိစေရ (Multi-AZ Architecture)။
2. **Security:** အပြင် Internet မှ Database နှင့် Backend Server များကို တိုက်ရိုက် မမြင်စေရ။ HTTPS (SSL/TLS) မဖြစ်မနေ ပါဝင်ရမည်။ Passwords များကို Plain Text မထားရ။
3. **High Performance:** ပုံများနှင့် Static Files များကို ကမ္ဘာအနှံ့ User များထံ လျင်မြန်စွာ ပို့ဆောင်နိုင်ရမည် (CDN Caching)။
4. **Scalability:** Flash Sale ကာလတွင် Container အရေအတွက် အလိုအလျောက် တိုးပွားနိုင်ရမည် (Auto Scaling)။
5. **Background Jobs:** အမှာစာ Email ပို့ခြင်းနှင့် PDF Invoice ပြုလုပ်ခြင်းများကို Async Queue စနစ်ဖြင့် ခွဲထုတ်ထားရမည်။

---

## ၁၃.၂ Enterprise Production Architecture Diagram

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
  - Nginx Container (Port 80)                               - Nginx Container (Port 80)
  - Laravel PHP 8.2 Container                               - Laravel PHP 8.2 Container
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
             v                                                         v
  [ ElastiCache Redis Cluster ]                             [ Aurora MySQL Multi-AZ Cluster ]
  - Sessions Store & Query Cache                            - Primary Writer (AZ-1a)
  - Queue Workers Buffer                                    - Standby Reader (AZ-1c)
             |                                                         |
             +----------------------------+----------------------------+
                                          |
                        [ Amazon S3 (Encrypted Storage) ]
                        - Product Images & PDF Invoices (OAC Protected)

Supporting Enterprise Services:
- AWS Secrets Manager: DB Credentials & Stripe API Keys
- AWS KMS: AES-256 Customer Managed Encryption Keys
- Amazon CloudWatch: Container Insights & Slack Alarms
- AWS CloudTrail: Multi-Region Audit Trail
- AWS Systems Manager: Portless Secure Terminal Access
```

---

## ၁၃.၃ Development to Production Workflow (開発から本番リリースまでの流れ)

```
[ Step 1: Local Development ]
  Developer က Docker Compose (PHP 8.2 + MySQL + Redis) ဖြင့် Local တွင် Code ရေးသား စမ်းသပ်သည်။

[ Step 2: Source Control & Testing ]
  GitHub `main` branch သို့ Pull Request တင်သည်။
  -> GitHub Actions က PHPUnit Automated Unit Tests များကို Run သည်။

[ Step 3: Containerization & Push ]
  Tests အောင်မြင်ပါက GitHub Actions က Production Docker Image ကို Build ပြုလုပ်သည်။
  -> Amazon ECR သို့ Image Tag ရိုက်၍ Push တင်သည်။
  -> ECR Scan on Push က Security Vulnerabilities များကို Scan ဖတ်သည်။

[ Step 4: Infrastructure Provisioning ]
  Terraform ဖြင့် VPC, ALB, ECS, Aurora, Redis, S3, WAF များကို အလိုအလျောက် တည်ဆောက်သည်။
  -> `terraform apply`

[ Step 5: Zero-Downtime Deployment ]
  ECS Fargate က ECR မှ Image အသစ်ကို Pull ဆွဲပြီး Rolling Update စတင်သည်။
  -> ALB Health Check အောင်မြင်မှသာ Traffic လွှဲပြောင်းပေးသည်။

[ Step 6: Operations & Observability ]
  CloudWatch Logs Insights, Metrics နှင့် Alarms များ ဖွင့်ထားပြီး နေ့စဉ် စောင့်ကြည့်သည်။
```

---

## ၁၃.၄ Production Release Checklist (本番リリースコントロール)
- [x] **Network:** VPC 10.0.0.0/16 တွင် Public ၂ ခု၊ Private App ၂ ခု၊ Private DB ၂ ခု ခွဲထားခြင်း။
- [x] **Database:** Aurora MySQL Multi-AZ ဖွင့်ထားပြီး Storage Encryption (KMS) ပါဝင်ခြင်း။
- [x] **Security:** Security Group များတွင် Specific Source SG ID ဖြင့်သာ Port ခွင့်ပြုထားခြင်း။
- [x] **SSL/TLS:** ACM Certificate ဖြင့် HTTPS သာ လက်ခံပြီး HTTP ကို 301 Redirect လုပ်ထားခြင်း။
- [x] **Zero Plain Text:** Passwords များကို Secrets Manager တွင် ထားရှိခြင်း။
- [x] **Storage:** S3 Public Access အားလုံးကို Block ထားပြီး CloudFront OAC ဖြင့်သာ ဖတ်ခွင့်ပြုခြင်း။
- [x] **Observability:** CloudWatch Container Insights နှင့် Alarms များ ဖွင့်ထားခြင်း။

---
*နောက်အခန်းသို့ သွားရန်:* [14_AWS_CLI_Reference_and_Interview_Prep.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/14_AWS_CLI_Reference_and_Interview_Prep.md)
