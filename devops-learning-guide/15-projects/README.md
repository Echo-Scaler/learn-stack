# 🏆 Module 15: Real-World Portfolio Projects (မြန်မာဘာသာ)

> **အင်တာဗျူးများတွင် မိမိ၏ လက်တွေ့ အရည်အချင်းကို အခိုင်အမာ သက်သေပြနိုင်မည့် Job-Ready DevOps Capstone Projects (၄) ခုနှင့် Resume ပြင်ဆင်နည်း**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

DevOps Engineer သို့မဟုတ် Cloud Engineer အဖြစ် အလုပ်လျှောက်ထားရာတွင် "မည်သည့်သင်တန်း တက်ဖူးသည်" ဟူသော လက်မှတ်ထက် **"GitHub ပေါ်တွင် မည်သည့် Real-World System များကို အမှန်တကယ် တည်ဆောက်ထားသနည်း"** ဟူသော လက်တွေ့ Portfolio Project များသည် အလုပ်ရရှိရန် အဆုံးအဖြတ် ဖြစ်ပါသည်။

ဤ Module 15 တွင် လုပ်ငန်းခွင်သုံး Enterprise စံချိန်စံညွှန်းများနှင့် ကိုက်ညီသော **Capstone Portfolio Projects (၄) ခု** ကို စနစ်တကျ တည်ဆောက်နည်း၊ Architecture Diagrams များ ရေးဆွဲနည်းနှင့် GitHub တွင် Professional ကျစွာ တင်ပြနည်းများကို အသေးစိတ် လမ်းညွှန်ပေးမည် ဖြစ်ပါသည်။

### 🎯 တည်ဆောက်မည့် Capstone Projects (၄) ခု:
1. 📌 [**Project A: Linux Server Automated Health & Backup Monitor**](./project-a-specs.md)
   - *Tech Stack*: Bash, Linux Cron, gzip, AWS S3 CLI, Telegram/Slack Webhook Bot
   - *Key Skills*: Shell scripting strict mode, idempotency, automated MySQL dump & offsite S3 backup, automated log cleanup, instant failure notifications.
   - 👉 [📖 Project A Complete Source Code & Implementation Guide](./project-a-specs.md)
2. 📌 [**Project B: Production Multi-Tier Containerized Web App**](./project-b-specs.md)
   - *Tech Stack*: Docker, Docker Compose, Nginx Reverse Proxy, Let's Encrypt SSL, Node.js/PHP, PostgreSQL, Redis
   - *Key Skills*: Multi-stage Dockerfile hardening, non-root user execution, named volumes, custom bridge network isolation, zero-downtime container updates.
   - 👉 [📖 Project B Complete Docker Compose & Configuration Guide](./project-b-specs.md)
3. 📌 [**Project C: Enterprise Automated CI/CD Pipeline**](./project-c-specs.md)
   - *Tech Stack*: GitHub Actions, Docker Buildx, Trivy Vulnerability Scanner, Gitleaks, AWS ECR/Docker Hub, SSH Remote Deploy
   - *Key Skills*: Automated testing, secret leak prevention, container vulnerability security gates, layer caching, zero-downtime deployment with health check rollback.
   - 👉 [📖 Project C Complete GitHub Actions Workflow & Rollback Script](./project-c-specs.md)
4. 📌 [**Project D: End-to-End AWS Production Cloud Architecture via Terraform IaC**](./project-d-specs.md)
   - *Tech Stack*: Terraform / OpenTofu, AWS Custom VPC, Public/Private Subnets, NAT Gateway, Application Load Balancer (ALB), EC2 Auto Scaling, RDS PostgreSQL Multi-AZ
   - *Key Skills*: Declarative IaC, remote state in S3 with DynamoDB state locking, Security Group chaining, least-privilege IAM roles, automated teardown scripts.
   - 👉 [📖 Project D Complete Multi-AZ Terraform HCL Infrastructure Code](./project-d-specs.md)

---

## 🚀 ၂။ Project A: Linux Server Health & Backup Monitor

### ၂.၁ Architecture Overview:
```text
[Ubuntu Linux Server]
         │
    Cron Daemon (Runs at 02:00 AM UTC daily)
         │
         ▼
  [ backup-and-monitor.sh ]
   ├─ 1. Check CPU, RAM, Disk Space (> 85% alert)
   ├─ 2. Dump MySQL/PostgreSQL DB to /tmp/db-backup.sql
   ├─ 3. Compress with tar.gz (AES encrypted)
   ├─ 4. Upload to AWS S3 (s3://my-company-backups/daily/)
   ├─ 5. Delete local & S3 backups older than 7 days
   └─ 6. Send Rich HTML Summary to Telegram / Slack Bot
```

### ၂.၂ GitHub Repo တွင် တင်ပြရမည့်ပုံစံ:
- `README.md` (Architecture diagram, setup guide, cron installation)
- `scripts/backup-and-monitor.sh`
- `config/backup.conf.example`
- `systemd/backup.service` & `systemd/backup.timer`

---

## 🚀 ၃။ Project B: Multi-Tier Containerized Web Stack

### ၃.၁ Architecture Overview:
```text
[Internet / Users] ─── HTTPS (Port 443) ───► [ Nginx Reverse Proxy (SSL) ]
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
       [ Web App Container 01 ]                                            [ Web App Container 02 ]
         (Node.js / PHP-FPM)                                                 (Node.js / PHP-FPM)
                      │                                                                   │
                      └─────────────────┬─────────────────────────────────────────────────┘
                                        │ User-defined Bridge Network
                                        ▼
                         ┌─────────────────────────────┐
                         │   [ Redis Cache Container ] │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │ [ PostgreSQL DB Container ] │
                         │ (Named Persistent Volume)   │
                         └─────────────────────────────┘
```

### ၃.၂ Key Implementation Highlights:
1. **Multi-Stage Build**: Base image size ကို 1GB မှ 100MB အောက်သို့ ၉၀% ချုံ့ထားခြင်း။
2. **Non-Root Execution**: Container ကို UID 10001 (`appuser`) ဖြင့်သာ run ခြင်း။
3. **Database Security**: Database port 5432 ကို ပြင်ပသို့ expose မလုပ်ဘဲ internal bridge network တွင်သာ ချိတ်ဆက်ခြင်း။

---

## 🚀 ၄။ Project C: Enterprise Automated CI/CD Pipeline

### ၄.၁ Pipeline Workflow:
```text
[ Developer: git push to main ]
              │
              ▼
    [ GitHub Actions CI ]
    ├─ 1. Lint & Unit Tests
    ├─ 2. Gitleaks Secret Detection (Pass/Fail)
    ├─ 3. Docker Buildx Build with Layer Cache
    ├─ 4. Trivy Vulnerability Scan (Exit code 1 on CRITICAL CVE)
    ├─ 5. Push Hardened Image to AWS ECR with Git SHA Tag
              │ (If all stages pass)
              ▼
    [ Continuous Deployment (CD) ]
    ├─ 1. SSH into Production EC2 Instance
    ├─ 2. Pull new image from ECR
    ├─ 3. Start new container & perform /healthz check
    ├─ 4. If healthcheck fails ➜ Instant Rollback to previous container
    └─ 5. Send Deployment Success notification to Telegram
```

---

## 🚀 ၅။ Project D: Complete AWS Production Architecture via Terraform IaC

### ၅.၁ Production Cloud Architecture Blueprint:
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        AWS CUSTOM VPC (10.0.0.0/16)                    │
│                                                                        │
│  [ PUBLIC SUBNET 1 ]                    [ PUBLIC SUBNET 2 ]            │
│  ├── NAT Gateway A                      ├── NAT Gateway B              │
│  └── Internet-Facing ALB (HTTPS 443 with ACM Free SSL Certificate)     │
│             │                                     │                    │
│             ▼                                     ▼                    │
│  [ PRIVATE SUBNET 1 ]                   [ PRIVATE SUBNET 2 ]           │
│  └── EC2 Auto Scaling Group             └── EC2 Auto Scaling Group     │
│      (Docker Web App + IAM Role)            (Docker Web App + IAM Role)│
│             │                                     │                    │
│             ▼                                     ▼                    │
│  [ DATABASE SUBNET 1 ]                  [ DATABASE SUBNET 2 ]          │
│  └── RDS PostgreSQL Primary             └── RDS PostgreSQL Multi-AZ    │
│      (Multi-AZ Standby Sync)                (Automatic Failover)       │
└────────────────────────────────────────────────────────────────────────┘
```

### ၅.၂ Terraform Project Structure:
```text
terraform-aws-production/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    ├── vpc/             # VPC, Subnets, NAT Gateways, Route Tables
    ├── alb/             # ALB, Target Groups, ACM Listeners
    ├── security_groups/ # SG Chaining (ALB ➜ App ➜ RDS)
    ├── compute/         # Launch Templates, Auto Scaling Group, IAM Instance Profile
    └── database/        # RDS Multi-AZ PostgreSQL Cluster
```

---

## 💼 ၆။ Resume & LinkedIn တွင် Portfolio ထည့်သွင်းနည်း (Resume Bullet Points)

အင်တာဗျူးခေါ်ယူမှု ၃ ဆ ပိုမိုရရှိစေရန် မိမိ၏ Resume တွင် အောက်ပါ Action-Oriented Metric-Driven ပုံစံဖြင့် ရေးသားပါ:

### 📝 Resume Example Bullets:
- *"Architected and deployed a highly available, multi-AZ cloud infrastructure on AWS for containerized web applications using **Terraform**, reducing manual provisioning time by **90%**."*
- *"Engineered an automated end-to-end **CI/CD pipeline with GitHub Actions**, integrating **Gitleaks** secret detection and **Trivy** vulnerability scanning to enforce a Zero-Trust security gate."*
- *"Containerized full-stack web services using **Docker & Docker Compose**, optimizing base images with multi-stage builds to reduce image sizes by **85%** and eliminating environment inconsistencies."*
- *"Implemented enterprise monitoring and alerting using **Prometheus, Node Exporter, and Grafana**, designing custom PromQL dashboards that reduced Mean Time To Detection (MTTD) by **60%**."*

---

## 📋 ၇။ မော်ဂျူး အကျဉ်းချုပ် (Summary)

ယခု Module 15 ပြီးဆုံးပါက သင်သည်:
- GitHub ပေါ်တွင် အလုပ်ရှင်များ စိတ်ဝင်စားမည့် ခိုင်မာသော Real-world Capstone Projects (၄) ခုကို ပိုင်ဆိုင်သွားမည်။
- Architecture Diagrams များ၊ Runbooks များနှင့် Clean Code documentation များကို တည်ဆောက်နိုင်သွားမည်။
- Technical Interview များတွင် မည်သည့် မေးခွန်းမဆို လက်တွေ့ လုပ်ကိုင်ဖူးသည့် အတွေ့အကြုံဖြင့် ယုံကြည်မှုရှိရှိ ဖြေဆိုနိုင်မည့် **Job-Ready DevOps Engineer** တစ်ဦး ဖြစ်လာပါပြီ။
