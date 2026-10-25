---
title: "🗺️ DevOps Engineer Master Learning Roadmap"
description: "Linux Server အခြေခံမှသည် AWS Cloud၊ Terraform IaC၊ CI/CD နှင့် Production Kubernetes အထိ အသေးစိတ် လမ်းပြမြေပုံ (မြန်မာဘာသာ)"
---

> **Linux Server အခြေခံမှသည် AWS Cloud၊ Terraform IaC၊ CI/CD နှင့် Production Kubernetes အထိ အသေးစိတ် လမ်းပြမြေပုံ**

ဤ Roadmap သည် ခေတ်သစ် IT နှင့် Cloud အခြေခံအဆောက်အအုံများတွင် အလုပ်လုပ်ကိုင်မည့် **DevOps Engineer, Cloud Engineer, Site Reliability Engineer (SRE)** များအတွက် လိုအပ်သော နည်းပညာနှင့် စွမ်းရည်များကို အဆင့်ဆင့် ခွဲခြမ်းပြသထားပါသည်။

---

## 📊 Roadmap Overview Table (အဆင့်လိုက် အကျဉ်းချုပ် ဇယား)

| အဆင့် | လေ့လာရမည့်အကြောင်းအရာ | အဓိက Tools | ခန့်မှန်းကြာချိန် | အဓိက လက်တွေ့ ထွက်ပေါ်လာမည့် စွမ်းရည် (Real Work Skills) |
|:---:|---|---|:---:|---|
| **1** | **Linux Fundamentals** | Ubuntu, Debian, Linux CLI | 2–3 ပတ် | Server Navigation, User/Permission Management, Processes & systemd Services |
| **2** | **Networking Fundamentals** | DNS, HTTP/S, SSH, ss, curl | 1–2 ပတ် | Network Flow, Port Binding, Firewall & SSL/TLS Debugging |
| **3** | **Git & GitHub** | Git, GitHub, GitFlow | 3–5 ရက် | Branching Strategies, Conflict Resolution, Release Tagging & PR Reviews |
| **4** | **Bash Scripting** | Bash, Shell, Cron | 1–2 ပတ် | Server Health Monitoring, Automated Backups, Log Rotation & Alerts |
| **5** | **Docker & Containers** | Docker, Docker Compose | 2–3 ပတ် | Multi-stage Dockerfiles, Container Networks, Multi-service Stacks (App + DB) |
| **6** | **CI/CD Pipeline** | GitHub Actions | 2 ပတ် | Automated Test, Lint, Docker Build, ECR Push & Deployment Automation |
| **7** | **Cloud Fundamentals** | AWS Console, AWS CLI, IAM | 2–3 ပတ် | IAM Least Privilege, Cloud Economics & Shared Responsibility Model |
| **8** | **AWS Deployment** | EC2, IAM, S3, ALB, RDS, VPC | 2–4 ပတ် | High-Availability 2-Tier Architecture, Private Subnet DB, SSL via ACM |
| **9** | **Infrastructure as Code** | Terraform, OpenTofu | 2–3 ပတ် | Automated AWS Infrastructure, State Locking via S3 & DynamoDB |
| **10** | **Configuration Management** | Ansible | 1–2 ပတ် | Automated Server Hardening, Nginx & App Provisioning Across 10+ Nodes |
| **11** | **Monitoring & Logging** | CloudWatch, Prometheus, Grafana | 2 ပတ် | Metrics Scrapes, Alertmanager Alerts, Grafana Dashboards & Incident Analysis |
| **12** | **DevSecOps** | IAM, Trivy, Secrets, OWASP | 1–2 ပတ် | Container Vulnerability Scanning, Secret Management & CI/CD Security Gates |
| **13** | **Kubernetes** | Minikube, K8s, Helm, EKS | 3–5 ပတ် | Container Orchestration, Self-healing, Ingress Controllers & Helm Charts |
| **14** | **Real-world Projects** | AWS, Docker, CI/CD, Terraform | 3–6 ပတ် | 4 Job-ready Production Portfolio Projects & Interview Case Studies |

---

## 🧭 အဆင့်လိုက် အသေးစိတ် လေ့လာမှု လမ်းညွှန် (Detailed Step-by-Step Breakdown)

---

### အဆင့် ၁: Linux Fundamentals (လင်းနစ် အခြေခံနှင့် ဆာဗာ စီမံခန့်ခွဲမှု)
- **ကြာချိန်**: ၂–၃ ပတ်
- **အဓိက Tools**: Ubuntu Server (LTS), Linux CLI (Bash), `systemctl`, `journalctl`
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Cloud ပေါ်ရှိ Production Server ၉၅% ကျော်၊ Docker Containers များနှင့် Kubernetes Nodes များအားလုံးသည် Linux OS ပေါ်တွင် အခြေခံ၍ ပြေးဆွဲနေခြင်း ဖြစ်သည်။ Linux အခြေခံ မပိုင်နိုင်ပါက Server Error များကို ဖြေရှင်းနိုင်မည် မဟုတ်ပါ။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Linux Distribution များ (Debian/Ubuntu vs RHEL/CentOS/Rocky Linux)
  2. Filesystem Hierarchy Standard (`/`, `/etc`, `/var/log`, `/opt`, `/home`, `/tmp`)
  3. Essential Commands (`ls`, `cd`, `pwd`, `cp`, `mv`, `rm`, `cat`, `less`, `grep`, `find`, `sed`, `awk`)
  4. Pipes and Redirection (`|`, `>`, `>>`, `2>&1`, `/dev/null`)
  5. Users, Groups, File Permissions (`chmod`, `chown`, `umask`, `sudoers`)
  6. Process Management (`ps aux`, `top`, `htop`, `kill`, `pkill`, `nice`)
  7. Service Management with systemd (`systemctl start|stop|restart|status|enable`)
  8. Log Inspection with `journalctl` နှင့် `/var/log/syslog`
  9. Environment Variables (`export`, `.bashrc`, `$PATH`)
  10. Disk Management (`df -h`, `du -sh`, `lsblk`, `mount`)
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Web Server တစ်ခု Memory ပြည့်ပြီး Out-Of-Memory (OOM) Killer ဖြစ်သွားသည့်အခါ `journalctl -xe` နှင့် `dmesg` ကို စစ်ဆေး၍ မည်သည့် process က memory leak ဖြစ်နေသည်ကို ဖမ်းယူခြင်း။
  - App Server အတွက် dedicated non-root user ဖန်တီးပေးပြီး `/var/www/app` folder အား Least Privilege principle ဖြင့် permission သတ်မှတ်ခြင်း။

---

### အဆင့် ၂: Networking Fundamentals (ကွန်ရက် အခြေခံနှင့် Web Flow)
- **ကြာချိန်**: ၁–၂ ပတ်
- **အဓိက Tools**: `curl`, `ss`, `ip`, `dig`, `nslookup`, `ping`, `traceroute`, `tcpdump`
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: DevOps Engineer တစ်ဦး နေ့စဉ်ကြုံတွေ့ရသော ပြဿနာ ၇၀% သည် Network Connection, DNS resolution, Firewall port blocked သို့မဟုတ် SSL/TLS handshake error များ ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. IPv4, IPv6, Public vs Private IP, CIDR Notation (`/24`, `/16`)
  2. Subnetting, Routing Table နှင့် Default Gateway
  3. TCP vs UDP, Three-way Handshake (SYN, SYN-ACK, ACK)
  4. Ports and Sockets (`ss -tulpn`, `lsof -i`)
  5. DNS Resolution Flow, Record Types (A, CNAME, MX, TXT, NS, PTR)
  6. HTTP/HTTPS Protocol, Methods, Status Codes, Request/Response Headers
  7. SSL/TLS Certificates, Public/Private Key, Handshake & Certificate Chains
  8. Firewalls (`ufw`, `iptables`), NAT (Network Address Translation)
  9. Reverse Proxy (Nginx) vs Load Balancer (Layer 4 vs Layer 7)
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - User များမှ "Website မတက်ပါ" ဟု report တင်လာပါက `dig domain.com` ဖြင့် DNS စစ်ခြင်း၊ `curl -Iv https://domain.com` ဖြင့် SSL/HTTP status စစ်ခြင်း၊ server အတွင်း `ss -tulpn` ဖြင့် port 80/443 နားထောင်နေခြင်း ရှိမရှိ စစ်ဆေးပြီး Root Cause ကို မိနစ်ပိုင်းအတွင်း ဖော်ထုတ်ခြင်း။

---

### အဆင့် ၃: Git & GitHub (ဗားရှင်း ထိန်းချုပ်မှုနှင့် အဖွဲ့လိုက် ပူးပေါင်းဆောင်ရွက်မှု)
- **ကြာချိန်**: ၃–၅ ရက်
- **အဓိက Tools**: `git`, GitHub CLI (`gh`), GitFlow, GitHub Actions triggers
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Git သည် DevOps တွင် Application Code သာမက Infrastructure as Code (Terraform)၊ Kubernetes manifests နှင့် CI/CD workflows အားလုံးကို ထိန်းသိမ်းရာ Single Source of Truth ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Working Directory, Staging Area, Local Repository, Remote Repository
  2. Commits, Branches, HEAD, Checkout vs Switch
  3. Merge vs Rebase (Interactive Rebase `git rebase -i` ဖြင့် commit squash ပြုလုပ်ပုံ)
  4. Merge Conflicts ရှင်းလင်းခြင်းနှင့် Safe Resolving
  5. Semantic Versioning (`v1.0.0`) နှင့် Git Release Tags
  6. `.gitignore` စနစ်တကျ ရေးသားခြင်းနှင့် Secret များကို Git သို့ မပါစေရန် ကာကွယ်ခြင်း (`git-secrets`)
  7. Disaster Recovery (`git reflog`, `git revert`, `git reset --hard`)
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Developer မှ Production code ထဲသို့ AWS Access Key အမှားပါသွားသည့်အခါ Git history မှ အပြီးတိုင် ဖယ်ရှားပေးခြင်း (`git filter-repo`) နှင့် feature release အတွက် Git tag ထုတ်ပြီး CI/CD trigger ပြုလုပ်ပေးခြင်း။

---

### အဆင့် ၄: Bash Scripting (ဆာဗာ လုပ်ငန်းများ အလိုအလျောက် ဆောင်ရွက်ခြင်း)
- **ကြာချိန်**: ၁–၂ ပတ်
- **အဓိက Tools**: Bash CLI, Cron, ShellCheck, `systemd-timer`
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: ထပ်ခါတလဲလဲ လုပ်ဆောင်ရသော Server Backups, Health Checks, Log Rotations များကို လူကိုယ်တိုင် လိုက်လုပ်မနေဘဲ အလိုအလျောက် ပြေးဆွဲနိုင်ရန် Bash Script ရေးသားတတ်ရပါမည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Shebang (`#!/usr/bin/env bash`), Script Permissions, Execution
  2. Variables, Command Substitution (`$(command)`), Special Parameters (`$0`, `$1`, `$#`, `$?`)
  3. Conditionals (`if [ ... ]`, `test`, `[[ ... ]]`), Logical Operators
  4. Loops (`for`, `while`), Functions and Scope
  5. Exit Codes (`set -euo pipefail` ဖြင့် robust script ရေးခြင်း)
  6. Text Processing (`grep`, `cut`, `awk`, `sed`)
  7. Crontab Syntax (`* * * * *`) နှင့် Automated Scheduling
  8. Telegram/Slack Webhook သို့ Alert Notification ပို့ဆောင်ခြင်း
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - ညတိုင်း နံနက် ၂ နာရီတွင် MySQL database ကို `mysqldump` ဖြင့် backup ယူ၊ tar gz ချုံ့၊ S3 bucket သို့ upload တင်ပြီး မအောင်မြင်ပါက Slack သို့ error notification ပို့ပေးသော Automated Backup Script တည်ဆောက်ခြင်း။

---

### အဆင့် ၅: Docker & Containers (ကွန်တိန်နာ နည်းပညာ)
- **ကြာချိန်**: ၂–၃ ပတ်
- **အဓိက Tools**: Docker Engine, Dockerfile, Docker Compose, Docker Hub / AWS ECR
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: "ကျွန်တော့်စက်မှာ အလုပ်လုပ်ပြီး Server ပေါ်မှာ ဘာလို့ Error တက်သလဲ" ဟူသော ပြဿနာကို အပြီးတိုင် ဖြေရှင်းပေးနိုင်သည့် Microservices ခေတ်၏ အဓိက အုတ်မြစ် ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Virtual Machines vs Containers (cgroups, namespaces, kernel sharing)
  2. Images, Layers, Registry, Containers Lifecycle
  3. Dockerfile Best Practices (Instruction Caching, `.dockerignore`)
  4. Multi-Stage Builds (Image size ကို 1GB မှ 50MB အောက် လျှော့ချခြင်း)
  5. Volumes (Named Volumes vs Bind Mounts) နှင့် Persistent Data
  6. Docker Networking (Bridge, Host, None, Custom Overlay)
  7. Container Security: Non-root User ဖြင့် Container ပြေးဆွဲခြင်း
  8. Docker Compose ဖြင့် Multi-container Stacks (Web + DB + Cache) စီမံခြင်း
  9. Container Healthchecks နှင့် Restart Policies
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Laravel/Node.js web application တစ်ခုကို Nginx, Application Worker, MySQL, Redis တို့ပါဝင်သော Multi-container Stack အဖြစ် Docker Compose ဖြင့် ရေးဆွဲပြီး Staging Server ပေါ်တွင် တစ်ချက်နှိပ် (`docker compose up -d`) ဖြင့် အလုပ်လုပ်စေခြင်း။

---

### အဆင့် ၆: CI/CD Pipeline (အလိုအလျောက် စမ်းသပ်၊ တည်ဆောက်၊ ဖြန့်ကြက်ခြင်း)
- **ကြာချိန်**: ၂ ပတ်
- **အဓိက Tools**: GitHub Actions, GitHub Secrets, Docker Buildx, Trivy
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Developer များ ရေးသားလိုက်သော code အသစ်များကို စက္ကန့်ပိုင်းအတွင်း Unit Test စစ်ဆေးပေးပြီး Production သို့ Zero-Downtime ဖြင့် အလိုအလျောက် တင်ပေးနိုင်ခြင်းသည် DevOps ၏ အဓိက တန်ဖိုး ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Continuous Integration (CI), Continuous Delivery vs Continuous Deployment (CD)
  2. GitHub Actions Architecture: Workflow YAML, Triggers, Jobs, Steps, Runners
  3. Environment Secrets & Variables (`${{ secrets.AWS_ACCESS_KEY }}`)
  4. Automated Testing (Unit Tests, Linting, Syntax Checks)
  5. Building and Tagging Docker Images with Git SHA & Semantic Tags
  6. Pushing Images to AWS ECR / Docker Hub
  7. Automated Deployment Strategies (Rolling, Blue-Green, Canary concepts)
  8. Automatic Rollback on Failure & Slack/Discord Deployment Alerts
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - `main` branch သို့ Pull Request merge ဖြစ်သည်နှင့် GitHub Actions workflow အလိုအလျောက် ပွင့်လာကာ automated test များ စစ်ဆေးခြင်း၊ docker image build လုပ်ပြီး AWS ECR သို့ တင်ကာ Staging server ပေါ်သို့ SSH ဖြင့် deploy အလိုအလျောက် လုပ်ဆောင်ပေးခြင်း။

---

### အဆင့် ၇: Cloud Fundamentals (AWS အခြေခံနှင့် လုံခြုံရေး)
- **ကြာချိန်**: ၂–၃ ပတ်
- **အဓိက Tools**: AWS Management Console, AWS CLI, IAM
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: ကုမ္ပဏီအများစုသည် On-premise Data Center များအစား AWS Cloud ကို ပြောင်းလဲအသုံးပြုနေကြသဖြင့် Cloud Architecture အလုပ်လုပ်ပုံကို နားလည်ရန် မဖြစ်မနေ လိုအပ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility Model
  2. Global Infrastructure: Regions, Availability Zones (AZ), Edge Locations
  3. AWS IAM (Identity and Access Management): Users, Groups, Roles, Policies
  4. Principle of Least Privilege (PoLP) နှင့် Multi-Factor Authentication (MFA)
  5. AWS CLI Setup, Profiles, Credentials Security
  6. AWS Cost Management, AWS Free Tier Rules, Billing Alarms & Budgets
  7. AWS Service Categories: Compute, Storage, Database, Networking
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Developer တစ်ဦးစီအတွက် အကောင့်ဖွင့်ပေးရာတွင် Root account မပေးဘဲ IAM Role နှင့် Policy ကန့်သတ်ပေးခြင်း၊ 0.01$ ကျော်သည်နှင့် Email သို့ Alert လာမည့် AWS CloudWatch Billing Alarm တည်ဆောက်ခြင်း။

---

### အဆင့် ၈: AWS Production Deployment (အဆင့်မြင့် Cloud Deployment)
- **ကြာချိန်**: ၂–၄ ပတ်
- **အဓိက Tools**: VPC, EC2, S3, RDS (PostgreSQL/MySQL), ALB, Route 53, ACM
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Server တစ်လုံးတည်းတွင် အရာအားလုံး ထည့်သွင်းထားသော မလုံခြုံသည့် monolithic setup မှသည် လုပ်ငန်းခွင်သုံး Highly Available 2-Tier/3-Tier Architecture သို့ ပြောင်းလဲ တည်ဆောက်နိုင်စေရန်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Virtual Private Cloud (VPC), Public Subnets, Private Subnets, Internet Gateway, NAT Gateway
  2. Route Tables, Security Groups (Stateful) vs Network ACLs (Stateless)
  3. EC2 Provisioning, Key Pairs, IAM Instance Profiles (No hardcoded credentials)
  4. AWS RDS Multi-AZ Database ကို Private Subnet တွင် လုံခြုံစွာထားရှိခြင်း
  5. S3 Bucket Policies, Block Public Access, Pre-signed URLs for Static Assets
  6. Application Load Balancer (ALB), Target Groups, Path-based Routing
  7. Route 53 DNS Configuration, AWS Certificate Manager (ACM) ဖြင့် အခမဲ့ HTTPS SSL တပ်ဆင်ခြင်း
  8. Auto Scaling Group (ASG) အခြေခံနှင့် Launch Templates
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Production E-commerce Web Application တစ်ခုအတွက် User traffic များကို ALB မှတဆင့် EC2 instance များဆီသို့ မျှဝေပေးပြီး၊ Database ကို ပြင်ပမှ လုံးဝ ဝင်ရောက်၍မရသော Private Subnet တွင် RDS အဖြစ် လုံခြုံစွာ ချိတ်ဆက်တည်ဆောက်ခြင်း။

---

### အဆင့် ၉: Infrastructure as Code (Terraform ဖြင့် Cloud တည်ဆောက်ခြင်း)
- **ကြာချိန်**: ၂–၃ ပတ်
- **အဓိက Tools**: Terraform, HashiCorp HCL, AWS Provider, Terraform Cloud
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Cloud Console ပေါ်တွင် လက်ဖြင့် click နှိပ်ဆောက်ခြင်းသည် အမှားများပြီး ပြန်လည် recreate လုပ်ရန် ခက်ခဲသည်။ Code အဖြစ် ရေးသားထားပါက version control လုပ်နိုင်ပြီး မိနစ်ပိုင်းအတွင်း infrastructure တစ်ခုလုံးကို deploy/destroy လုပ်နိုင်ပါသည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Declarative vs Imperative Infrastructure Management
  2. Terraform Workflow: `init`, `fmt`, `validate`, `plan`, `apply`, `destroy`
  3. HCL Syntax: Providers, Resources, Data Sources, Variables, Outputs, Locals
  4. Terraform State (`terraform.tfstate`) အလုပ်လုပ်ပုံနှင့် ဘေးအန္တရာယ်များ
  5. Remote State in AWS S3 with State Locking in DynamoDB (အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် state မပျက်စေရန်)
  6. Terraform Reusable Modules ဖန်တီးခြင်း (VPC Module, Web App Module)
  7. Environments Separation (Dev, Staging, Prod) with Workspaces / Directory Structure
  8. State Drift Detection & Resource Import
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - VPC, Subnets, EC2, ALB, RDS အားလုံးကို Terraform script တစ်ခုဖြင့် ရေးသားထားပြီး Client အသစ် သို့မဟုတ် Staging Environment အသစ် လိုအပ်ပါက `terraform apply` တစ်ချက်ဖြင့် ၁၀ မိနစ်အတွင်း အပြည့်အစုံ ဆောက်ပေးနိုင်ခြင်း။

---

### အဆင့် ၁၀: Configuration Management (Ansible ဖြင့် ဆာဗာ စီမံခြင်း)
- **ကြာချိန်**: ၁–၂ ပတ်
- **အဓိက Tools**: Ansible, YAML, Ansible Galaxy, Jinja2 Templates
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Terraform သည် Server များကို ဆောက်လုပ်ပေးပြီး၊ Ansible သည် အဆိုပါ Server များအတွင်းသို့ လိုအပ်သော software များ သွင်းယူခြင်း၊ config ဖိုင်များ ထည့်သွင်းခြင်းနှင့် security hardening ပြုလုပ်ပေးသည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Agentless Architecture via SSH (No extra agents required on target nodes)
  2. Inventory Files (Static & Dynamic Groups)
  3. Ad-hoc Commands (`ansible all -m ping`, `ansible web -m apt -a "name=nginx state=latest"`)
  4. Playbooks, Tasks, Handlers (Notification on configuration change)
  5. Idempotency (ထပ်ခါထပ်ခါ run သော်လည်း မူလအခြေအနေ မပျက်စီးစေခြင်း)
  6. Ansible Variables, Facts, Loops, Conditionals
  7. Jinja2 Templates (`.j2`) ဖြင့် Dynamic Configuration Files ရေးသားခြင်း
  8. Ansible Roles Structure (Reusable Modular Playbooks)
  9. Ansible Vault ဖြင့် လျှို့ဝှက်ချက် (Passwords, Keys) များကို encrypt လုပ်ခြင်း
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Server အလုံး ၅၀ သို့ Security Patch တစ်ပြိုင်နက် update သွင်းခြင်း၊ Nginx configuration ဖိုင်သစ် တစ်ပြိုင်နက် deploy ပြုလုပ်ပြီး Nginx service ကို အလိုအလျောက် reload လုပ်ဆောင်ပေးခြင်း။

---

### အဆင့် ၁၁: Monitoring, Logging & Observability (စောင့်ကြည့် လေ့လာခြင်း)
- **ကြာချိန်**: ၂ ပတ်
- **အဓိက Tools**: Prometheus, Grafana, Node Exporter, AWS CloudWatch
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Production စနစ်များတွင် "System ပျက်သွားမှ သိခြင်း" သည် မဖြစ်သင့်ပါ။ ကြိုတင်၍ High CPU, Disk Full, High Latency တို့ကို Alarm ဖြင့် သိရှိပြီး ချက်ချင်း မပြုပြင်နိုင်ပါက စီးပွားရေး ထိခိုက်စေပါသည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Observability ၏ မဏ္ဍိုင် (၃) ရပ်: Metrics, Logs, Traces
  2. Golden Signals: Latency, Traffic, Errors, Saturation
  3. Prometheus Architecture (Pull-based metrics collection, TSDB)
  4. Node Exporter ဖြင့် Linux Server CPU, Memory, Disk metrics ရယူခြင်း
  5. PromQL (Prometheus Query Language) အခြေခံ
  6. Grafana ဖြင့် Visual Dashboard များ လှပစွာ တည်ဆောက်ခြင်း
  7. Alertmanager ဖြင့် Slack/Telegram Alert Notification ချိတ်ဆက်ခြင်း
  8. CloudWatch Metrics, Log Groups, Metric Filters, Dashboard & SNS Alarms
  9. SLI (Service Level Indicator), SLO (Service Level Objective), SLA (Service Level Agreement)
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - Production Server တွင် Disk Usage ၈၅% ကျော်ပါက DevOps Team ၏ Telegram သို့ ချက်ချင်း Alert ပေးပို့စေပြီး၊ Grafana Dashboard တွင် User traffic တက်လာမှုနှင့် API latency ကို Real-time စောင့်ကြည့်ခြင်း။

---

### အဆင့် ၁၂: DevSecOps (လုံခြုံရေး ပေါင်းစပ် ထည့်သွင်းခြင်း)
- **ကြာချိန်**: ၁–၂ ပတ်
- **အဓိက Tools**: Trivy, GitGuardian, HashiCorp Vault / AWS Secrets Manager, OWASP Dependency-Check
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Security သည် နောက်ဆုံးမှ စဉ်းစားရမည့် အရာမဟုတ်ဘဲ Software Development Lifecycle တစ်လျှောက်လုံး (Shift-Left) ပေါင်းစပ်ရမည် ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Shift-Left Security Concept
  2. Static Application Security Testing (SAST) & Dependency Scanning
  3. Secret Detection in Git (GitLeaks, Pre-commit hooks)
  4. Container Security & Image Vulnerability Scanning with Trivy
  5. Server Hardening (SSH port change, Disable root login, Fail2ban)
  6. Secrets Management (AWS Secrets Manager / SSM Parameter Store)
  7. Least Privilege Access Management & Audit Logs (AWS CloudTrail)
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - CI/CD pipeline တွင် Trivy scanner ထည့်သွင်းထားပြီး၊ Docker image အတွင်း CRITICAL vulnerability တွေ့ရှိပါက Build ကို အလိုအလျောက် ပိတ်ချ (fail) ပေးကာ Production သို့ မလုံခြုံသော ကုဒ် မရောက်စေရန် ကာကွယ်ခြင်း။

---

### အဆင့် ၁၃: Kubernetes & Orchestration (ကွန်တိန်နာ စီမံခန့်ခွဲမှု)
- **ကြာချိန်**: ၃–၅ ပတ်
- **အဓိက Tools**: `kubectl`, Minikube, K3s, Helm, AWS EKS
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: Microservices ရာပေါင်းများစွာကို စီမံခန့်ခွဲရာတွင် Auto-scaling, Self-healing, Zero-downtime rolling update များကို အလိုအလျောက် ဆောင်ရွက်ပေးနိုင်သော ကမ္ဘာ့စံချိန်စံညွှန်း Orchestrator ဖြစ်သည်။
- **အဓိက လေ့လာရမည့် ခေါင်းစဉ်များ**:
  1. Kubernetes Architecture: Control Plane (API Server, etcd, Scheduler, Controller) vs Worker Nodes (kubelet, kube-proxy, Container Runtime)
  2. `kubectl` Essential Commands & Declarative YAML
  3. Pods, ReplicaSets, Deployments (Rolling Updates, Rollbacks)
  4. Networking & Services (ClusterIP, NodePort, LoadBalancer)
  5. Ingress Controllers (Nginx Ingress) & Path Routing
  6. ConfigMaps and Secrets Injection
  7. Storage in K8s: Persistent Volumes (PV), Persistent Volume Claims (PVC), StorageClasses
  8. Resource Management: Requests and Limits (Preventing Resource Starvation)
  9. Liveness, Readiness, Startup Probes
  10. Helm Package Manager (Values.yaml, Templates, Releases)
  11. AWS Elastic Kubernetes Service (EKS) မိတ်ဆက်
- **Real Work Example (လုပ်ငန်းခွင် လက်တွေ့ ဥပမာ)**:
  - E-commerce App ကို Kubernetes ပေါ်တင်ထားပြီး traffic တက်လာချိန်တွင် Pods များကို ၃ ခုမှ ၁၀ ခုအထိ Horizontal Pod Autoscaler (HPA) ဖြင့် အလိုအလျောက် တိုးမြှင့်ပေးခြင်း၊ Pod တစ်ခု crash ဖြစ်သွားပါက Kubernetes မှ အသစ်တစ်ခု အလိုအလျောက် ပြန်အစားထိုးပေးခြင်း (Self-healing)။

---

### အဆင့် ၁၄: Real-World Portfolio Projects (လက်တွေ့ အသုံးချ ပရောဂျက်များ)
- **ကြာချိန်**: ၃–၆ ပတ်
- **အဓိက Tools**: AWS, Terraform, GitHub Actions, Docker, Prometheus, Grafana
- **ဘာကြောင့် လေ့လာရသလဲ (Why it matters)**: ကုမ္ပဏီများမှ အင်တာဗျူးခေါ်ယူရာတွင် "သင် ဘာတွေ အမှန်တကယ် ဆောက်ဖူးသလဲ" ဟူသော လက်တွေ့ အထောက်အထား (Portfolio) ကို အဓိက ကြည့်ရှုစစ်ဆေးသောကြောင့် ဖြစ်သည်။
- **တည်ဆောက်မည့် ပရောဂျက် (၄) ခု**:
  1. 📌 **Project A: Linux Automated Server Monitor & Disaster Backup Script**
  2. 📌 **Project B: Production Multi-container Web App with Docker Compose & Nginx Reverse Proxy**
  3. 📌 **Project C: Enterprise Automated CI/CD Pipeline (GitHub Actions + AWS ECR + Trivy + SSH Deploy)**
  4. 📌 **Project D: End-to-End AWS Production Cloud Architecture with Terraform (VPC + ALB + EC2 + RDS + S3 + Monitoring)**

---

## 🏁 ဆက်လက်ဆောင်ရွက်မည့် အစီအစဉ် (Next Step)

Roadmap ကို အတည်ပြုပြီးပါက:
- **[30-Day Starter Plan](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/STUDY-PLAN-30-DAYS.md)** သို့မဟုတ် **[90-Day Foundation Plan](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/STUDY-PLAN-90-DAYS.md)** ကို လေ့လာပါ။
- သင်၏ အတည်ပြုချက် (Approval) ရရှိသည်နှင့် **Module 1: Linux Fundamentals** ကို လက်တွေ့ စတင် တည်ဆောက်သွားပါမည်။
