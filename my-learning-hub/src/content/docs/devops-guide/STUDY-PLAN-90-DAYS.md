---
title: "🚀 DevOps 90-Day Foundation Plan"
description: "ရက် ၉၀ Job-Ready ပြည့်စုံသော DevOps & Cloud Engineer အဆင့်ဆင့် လေ့လာမှု စီမံချက် (မြန်မာဘာသာ)"
---

> **ရည်မှန်းချက်**: Linux & Networking အခြေခံမှ စတင်ကာ Docker, GitHub Actions CI/CD, AWS Production Cloud Deployment, Terraform IaC, Prometheus/Grafana Monitoring နှင့် Real-world Portfolio Projects များ ပြီးမြောက်၍ **Junior/Mid-level DevOps Engineer** အဖြစ် အလုပ်စတင် လျှောက်ထားနိုင်စေရန်။

---

## 🎯 ၉၀ ရက်တာ အဆင့်ဆင့် တိုးတက်မှု အကျဉ်းချုပ် (12-Week Roadmap)

```text
[ Week 1-2: Linux Mastery ] ─────────► [ Week 3-4: Network & Bash ]
                 │                                      │
                 ▼                                      ▼
[ Week 5-6: Docker & Compose ] ──────► [ Week 7-8: CI/CD & GitHub Actions ]
                 │                                      │
                 ▼                                      ▼
[ Week 9-10: AWS Cloud Architecture ] ► [ Week 11-12: Terraform IaC & Monitoring ]
                 │                                      │
                 └──────────────────► [ Week 13: Capstone Projects & Interview Prep ]
```

---

## ⏱️ လေ့လာချိန် သတ်မှတ်ချက် (Weekly Time Commitment)
- **တနင်္လာ မှ သောကြာ**: တစ်နေ့လျှင် ၂ နာရီ (Hands-on Practice)
- **စနေ၊ တနင်္ဂနွေ**: တစ်နေ့လျှင် ၃ နာရီ (Architectural Design, Project Building, Testing)
- **တစ်ပတ်တာ စုစုပေါင်း**: ၁၄–၁၆ နာရီ (ရက်ပေါင်း ၉၀ အတွင်း နာရီ ၁၈၀–၂၀၀ ခန့်)

---

## 🗓️ အပတ်စဉ် အသေးစိတ် သင်ရိုးညွှန်းတမ်း (Week-by-Week Curriculum)

---

### 🔹 PHASE 1: CORE FOUNDATIONS (သီတင်းပတ် ၁ မှ ၄)

#### Week 1: Linux Architecture, Filesystem & User Management
- **ရည်မှန်းချက်**: Linux OS အလုပ်လုပ်ပုံ၊ Filesystem hierarchy၊ Users/Groups နှင့် File Permissions အဆင့်မြင့် သဘောတရားများ ပိုင်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Virtual Ubuntu Lab setup (Multipass သို့မဟုတ် Mac UTM/VirtualBox)။
  - File viewing (`less`, `tail -f`), Text manipulation (`grep`, `awk`, `sed`)။
  - Permissions model: `chmod`, `chown`, Sticky bit, SUID/SGID၊ `visudo` ဖြင့် safe user privileges သတ်မှတ်ခြင်း။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Multi-user permission structure script နှင့် command cheatsheet။

#### Week 2: Linux Processes, Daemons & System Administration
- **ရည်မှန်းချက်**: System resources (CPU, RAM, Disk) ကို စောင့်ကြည့်နိုင်ခြင်း၊ systemd services ရေးဆွဲ run နိုင်ခြင်းနှင့် Logs များ စစ်ဆေးနိုင်ခြင်း။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Process signals (`SIGTERM`, `SIGKILL`), CPU load average, OOM killer analysis။
  - Systemd custom service (`/etc/systemd/system/myapp.service`) ရေးသားပြီး auto-restart စမ်းသပ်ခြင်း။
  - `journalctl` advanced filters (`--since`, `-u`, `-p err`)။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Custom Node.js/Python app ကို systemd service အဖြစ် ထိန်းကျောင်းပြသနိုင်ခြင်း။

#### Week 3: Networking Deep Dive & Diagnostic Tools
- **ရည်မှန်းချက်**: Client-to-Server network packet flow၊ DNS resolution၊ Firewalls နှင့် SSL/TLS handshake အဆင့်များကို ရှင်းရှင်းလင်းလင်း နားလည်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Subnetting calculator လေ့ကျင့်ခြင်း၊ CIDR blocks (`/24`, `/16`) ခွဲခြမ်းခြင်း။
  - Network troubleshooting: `curl -Iv`, `ss -tulpn`, `dig +trace`, `traceroute`, `tcpdump` packet capture။
  - Nginx Reverse Proxy တပ်ဆင်၍ port 80 မှ internal app port 3000 သို့ proxy pass ပြုလုပ်ခြင်း။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Nginx Reverse Proxy + Custom Domain Simulation (`/etc/hosts`) Setup။

#### Week 4: Bash Scripting, Cron Automation & Git Collaboration
- **ရည်မှန်းချက်**: ထပ်ခါတလဲလဲ အလုပ်များကို Bash ဖြင့် automated လုပ်ပြီး Git ဖြင့် safe versioning ပြုလုပ်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Bash functions, exit codes (`set -euo pipefail`), arguments validation။
  - Automated Database backup script ရေးသား၍ Cron ဖြင့် အချိန်ဇယားဆွဲခြင်း။
  - Git Interactive Rebase (`git rebase -i`), Feature Branching, Merge conflict resolving။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Project A: Linux Server Automated Health & Backup Monitor (GitHub Repo)**။

---

### 🔹 PHASE 2: CONTAINERS & CI/CD AUTOMATION (သီတင်းပတ် ၅ မှ ၈)

#### Week 5: Docker Containerization Fundamentals
- **ရည်မှန်းချက်**: Virtual Machines နှင့် Container နည်းပညာ၏ ကွာခြားချက်ကို သိရှိပြီး Single-container applications များကို Dockerize ပြုလုပ်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Docker architecture: Client, Daemon, Containerd, RunC, Images, Containers။
  - Multi-stage Dockerfile ရေးသားခြင်း (Alpine base ဖြင့် Image size 90% လျှော့ချခြင်း)။
  - Non-root user ဖြင့် container လုံခြုံစွာ run ခြင်း (`USER 1001`)။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Optimized, lean production-grade Dockerfile for Web App။

#### Week 6: Docker Storage, Networking & Multi-Container Compose
- **ရည်မှန်းချက်**: Multi-container stacks (Web + Database + Cache) ကို Docker Compose ဖြင့် စနစ်တကျ ချိတ်ဆက် ပြေးဆွဲနိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Docker Named Volumes vs Bind Mounts (Database data persistence စမ်းသပ်ခြင်း)။
  - Docker User-defined Bridge Networks (DNS name ဖြင့် container အချင်းချင်း communicate လုပ်ခြင်း)။
  - `docker-compose.yml` ဖြင့် Nginx + Web App + PostgreSQL/MySQL stack တည်ဆောက်ခြင်း။
  - Healthchecks & Container depend_on conditions။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Project B: Multi-tier Containerized Web Application with Docker Compose**။

#### Week 7: CI/CD Fundamentals & GitHub Actions Workflow
- **ရည်မှန်းချက်**: Continuous Integration (CI) သဘောတရားကို နားလည်ပြီး Pull Request တိုင်းတွင် Automated Tests များ ပြေးဆွဲနိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - GitHub Actions syntax: Workflows, Triggers (`push`, `pull_request`), Jobs, Steps, Runners။
  - Code Linting, Unit Testing automation။
  - GitHub Secrets (`${{ secrets.SECRET_NAME }}`) လုံခြုံစွာ အသုံးပြုခြင်း။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Automated PR Test & Quality Gate Workflow in GitHub Actions။

#### Week 8: Continuous Delivery, Container Registries & Safe Deployment
- **ရည်မှန်းချက်**: Code အသစ်များကို Docker Image အဖြစ် build ပြုလုပ်ပြီး AWS ECR/Docker Hub သို့ push ကာ Staging Server သို့ အလိုအလျောက် Deploy လုပ်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Docker Buildx & Image Caching in GitHub Actions။
  - Image Tagging with Git commit SHA and SemVer (`v1.2.3`)။
  - Trivy Container Vulnerability Scan in CI/CD pipeline။
  - Automated deployment over SSH to Staging Server with rollback support။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Project C: Enterprise Automated CI/CD Pipeline (GitHub Actions + Docker + Trivy + SSH Deploy)**။

---

### 🔹 PHASE 3: CLOUD INFRASTRUCTURE & AUTOMATION (သီတင်းပတ် ၉ မှ ၁၂)

#### Week 9: AWS Cloud Architecture & Core Services
- **ရည်မှန်းချက်**: AWS Global Infrastructure, IAM Security, VPC Networking များကို နားလည်ပြီး Secure Cloud Design တည်ဆောက်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - IAM Least Privilege: Roles, Policies, Service Accounts (No root access)။
  - Custom VPC: Public Subnets (2 AZs), Private Subnets (2 AZs), Internet Gateway, NAT Gateway, Route Tables။
  - Security Groups (Inbound/Outbound rules) & Network ACLs။
  - AWS Free Tier Cost Alerting & Budget Monitoring setup ($0.01 threshold)။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Multi-AZ Custom VPC Architecture Diagram & Manual Provisioning Verification။

#### Week 10: Production Web Deployment on AWS (ALB + EC2 + RDS + S3)
- **ရည်မှန်းချက်**: Highly Available 2-Tier Architecture ဖြင့် Production Web App ကို Deploy ပြုလုပ်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - EC2 instance creation with IAM Instance Profile။
  - RDS Database (PostgreSQL/MySQL) in Private Subnet (No public access)။
  - S3 bucket for media upload with IAM policy restrictions။
  - Application Load Balancer (ALB) + Route 53 Custom Domain + ACM Free SSL (HTTPS)။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: Fully functional, HTTPS-secured Web Application running on AWS Architecture။

#### Week 11: Infrastructure as Code (Terraform Mastery)
- **ရည်မှန်းချက်**: Cloud resources အားလုံးကို လက်ဖြင့် မဆောက်ဘဲ Terraform HCL Code ဖြင့် automated provisioning ပြုလုပ်နိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Terraform Workflow: `init`, `fmt`, `validate`, `plan`, `apply`, `destroy`။
  - Variables, Outputs, Data Sources, Locals။
  - Remote State Management in AWS S3 + DynamoDB State Locking (Prevent concurrent state corruptions)။
  - Modular Architecture: Reusable VPC Module & App Module။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Project D (Part 1): Complete AWS Architecture provisioned via Terraform Code**။

#### Week 12: Observability, Monitoring & Log Management
- **ရည်မှန်းချက်**: Production Server များ၏ ကျန်းမာရေးကို စောင့်ကြည့်ပြီး ပြဿနာမဖြစ်မီ ကြိုတင်သတိပေးချက်များ ထုတ်ပေးနိုင်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - Prometheus setup & Node Exporter ဖြင့် Server CPU, Memory, Disk, Network metrics ကောက်ယူခြင်း။
  - Grafana dashboard လှပစွာ တည်ဆောက်ခြင်း (Linux Server Full metrics)။
  - Alertmanager ဖြင့် Disk 85% ကျော်ပါက Telegram/Slack သို့ Alert ပို့ခြင်း။
  - AWS CloudWatch Alarms & Metric Filters မိတ်ဆက်။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Project D (Part 2): Prometheus & Grafana Monitoring Dashboard with Alerting Rules**။

---

### 🔹 PHASE 4: CAPSTONE & CAREER READINESS (သီတင်းပတ် ၁၃)

#### Week 13: Portfolio Packaging, Interview Prep & Next Steps
- **ရည်မှန်းချက်**: Project ၄ ခုလုံးကို GitHub တွင် Professional README, Architecture Diagrams, Setup Guides များနှင့်အတူ ပြင်ဆင်ပြီး Interview အတွက် အသင့်ဖြစ်စေရန်။
- **လက်တွေ့ လုပ်ဆောင်ချက်များ**:
  - 4 Capstone Projects Code & Documentation Clean up။
  - Architectural Diagrams with Draw.io / Mermaid.js။
  - DevOps Scenario-based Interview Questions (e.g., "Website down ဘာလုပ်မလဲ", "Memory leak ဘယ်လိုရှာမလဲ", "Zero-downtime deployment ဘယ်လိုလုပ်မလဲ")။
  - Resume & LinkedIn Profile DevOps Focus Optimization။
- **အပတ်စဉ် ထွက်ကုန် (Deliverable)**: **Job-ready DevOps Portfolio with 4 Public Repositories**။

---

## 🔮 ရက်ပေါင်း ၉၀ အလွန် ဆက်လက်လေ့လာရန် လမ်းပြမြေပုံ (Beyond 90 Days)

ရက်ပေါင်း ၉၀ Foundation ကို အောင်မြင်စွာ တက်လှမ်းပြီးပါက အောက်ပါ Advanced နယ်ပယ်များကို ဆက်လက် တိုးချဲ့လေ့လာနိုင်ပါသည် -

1. ☸️ **Production Kubernetes (K8s & AWS EKS)**:
   - Helm Package Manager, Ingress Controllers, StatefulSets, Horizontal Pod Autoscaler (HPA)။
2. 🔄 **GitOps with ArgoCD**:
   - Declarative Kubernetes deployment with GitOps flow။
3. 📜 **Ansible Configuration Management**:
   - Large-scale multi-server configuration and security hardening at scale။
4. 🛡️ **DevSecOps & HashiCorp Vault**:
   - Centralized secret engine, dynamic database credentials, OWASP ZAP DAST scans။
5. 📈 **Site Reliability Engineering (SRE)**:
   - SLO, SLI, Error Budgets, Chaos Engineering (Chaos Mesh), Blameless Postmortems။
