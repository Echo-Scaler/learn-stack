# 🚀 DevOps Engineer Comprehensive Learning Guide (မြန်မာဘာသာ)

> **Beginner မှ Job-Ready Production DevOps Engineer အဆင့်သို့ စနစ်တကျ တက်လှမ်းနိုင်မည့် လက်တွေ့အသုံးချ သင်ရိုးလမ်းညွှန်**

မင်္ဂလာပါ! ဤ **DevOps Engineer Learning Guide** သည် Software Development သို့မဟုတ် IT အခြေခံရှိပြီး modern Cloud & DevOps Engineer တစ်ဦးအဖြစ် လုပ်ငန်းခွင်ဝင်ရောက်နိုင်ရန် ရည်ရွယ်၍ ရေးဆွဲထားသော **Burmese-First (မြန်မာဘာသာ အဓိကရှင်းလင်းချက်) + Standard English Technical Terms** ပြည့်စုံသည့် လက်တွေ့ သင်ရိုးညွှန်းတမ်း ဖြစ်ပါသည်။

---

## 🎯 သင်ရိုး၏ အဓိက ရည်မှန်းချက် (Core Objectives)

1. **သဘောတရားနှင့် အတွေးအခေါ် (Concepts & Mindset)**: Tool များကို အလွတ်ကျက်ခြင်း မဟုတ်ဘဲ "ဘာကြောင့် သုံးရသည် (Why)" နှင့် "စနစ်အတွင်း ဘယ်လိုအလုပ်လုပ်သည် (How it works)" ကို နားလည်စေရန်။
2. **Terminal Hands-on Skills**: GUI ကို အားမကိုးဘဲ Linux CLI, Bash, Git, Docker, Terraform, Kubernetes တို့ကို terminal တွင် ယုံကြည်မှုရှိရှိ အသုံးပြုနိုင်စေရန်။
3. **AWS Cloud Production Mastery**: AWS ပေါ်တွင် Secure, Highly Available, Scalable ဖြစ်သော Web Applications (Laravel, Node.js, Spring Boot, etc.) များကို အမှန်တကယ် Deploy ပြုလုပ်နိုင်စေရန်။
4. **Automation & CI/CD**: Manual deploy လုပ်ရသော အချိန်ဖြုန်းခြင်းကို ဖျက်သိမ်းပြီး GitHub Actions ဖြင့် Automated Testing, Building, Security Scanning နှင့် Zero-Downtime Deployment ပြုလုပ်နိုင်စေရန်။
5. **Real-world Troubleshooting & DevSecOps**: Production incident များ၊ network timeout များ၊ disk leak များ၊ permission issues များကို စနစ်တကျ စုံစမ်းဖြေရှင်းနိုင်စေရန် (Root Cause Analysis)။
6. **Job-Ready Portfolio**: GitHub တွင် ခိုင်မာသော Real-world Capstone Projects (၄) ခု တည်ဆောက်ပြီး Interview တွင် အောင်မြင်စွာ ဖြေဆိုနိုင်စေရန်။

---

## 🧭 သင်ရိုးလမ်းပြမြေပုံ (Curriculum Overview)

အသေးစိတ် အဆင့် (၁၄) ဆင့်ပါဝင်သော သင်ရိုးလမ်းပြမြေပုံ:

| အဆင့် | လေ့လာရမည့်အကြောင်းအရာ | အဓိက Tools | ခန့်မှန်းကြာချိန် | အဓိက ရည်မှန်းချက် (Milestone) |
|---|---|---|---|---|
| **0** | **DevOps Overview & Local Lab Setup** | Vagrant, Multipass, VS Code | 3–5 ရက် | DevOps Mindset & Safe Lab Environment |
| **1** | **Linux Fundamentals** | Ubuntu, Linux CLI, systemd | 2–3 ပတ် | Server Admin, Permissions & Processes |
| **2** | **Networking Fundamentals** | DNS, HTTP/S, SSH, ss, curl | 1–2 ပတ် | Network Flow, Reverse Proxy & Troubleshooting |
| **3** | **Git & Collaboration** | Git, GitHub, GitFlow | 3–5 ရက် | Branching, Conflicts & Safe Releases |
| **4** | **Bash Scripting & Automation** | Bash, Shell, Cron | 1–2 ပတ် | Automated Healthchecks & Backup Scripts |
| **5** | **Docker & Containers** | Docker, Docker Compose | 2–3 ပတ် | Containerization, Multi-stage & Compose |
| **6** | **CI/CD Pipeline** | GitHub Actions | 2 ပတ် | Automated Test, Build & Deploy Pipeline |
| **7** | **Cloud Fundamentals (AWS)** | AWS Console, AWS CLI, IAM | 2–3 ပတ် | Cloud Architecture & Shared Responsibility |
| **8** | **AWS Production Deployment** | EC2, VPC, S3, RDS, ALB, ACM | 2–4 ပတ် | Secure 2-Tier/3-Tier Web App Architecture |
| **9** | **Infrastructure as Code (IaC)** | Terraform | 2–3 ပတ် | Declarative Infrastructure Provisioning |
| **10** | **Configuration Management** | Ansible | 1–2 ပတ် | Server Hardening & Automated Provisioning |
| **11** | **Monitoring & Logging** | CloudWatch, Prometheus, Grafana | 2 ပတ် | Observability, Dashboards & Alert Rules |
| **12** | **DevSecOps** | IAM, Trivy, Secrets, OWASP | 1–2 ပတ် | Security Scans, Least Privilege & Vault |
| **13** | **Kubernetes** | Minikube, K8s, Helm, EKS | 3–5 ပတ် | Container Orchestration & Microservices |
| **14** | **Portfolio Projects & Interview Prep** | Full Stack DevOps Capstones | 3–6 ပတ် | 4 Real-world Portfolio Projects & Resume |

---

## 📂 လမ်းညွှန် ဖိုင်တွဲ တည်ဆောက်ပုံ (Directory Structure)

```text
devops-learning-guide/
├── README.md                      # သင်ရိုးမိတ်ဆက်၊ အခြေခံလမ်းညွှန်နှင့် Quick Start
├── ROADMAP.md                     # အဆင့် ၁၄ ဆင့်ပါ အသေးစိတ် သင်ရိုး Roadmap & Topics
├── STUDY-PLAN-30-DAYS.md          # ရက် ၃၀ အခြေခံအုတ်မြစ် အထူးလေ့လာမှု စီမံချက်
├── STUDY-PLAN-90-DAYS.md          # ရက် ၉၀ Job-Ready Comprehensive အဆင့်ဆင့် လေ့လာမှု စီမံချက်
│
├── 00-devops-overview/            # DevOps Mindset, SDLC, Local Lab Setup & Cost Safety
├── 01-linux/                      # [COMPLETED] Linux Fundamentals
│   ├── README.md                  # Main Lesson: FHS, Permissions, Processes, systemd
│   ├── commands-cheatsheet.md     # Production Command Reference
│   ├── exercises.md               # 5 Production Hands-on Labs & Challenges
│   └── troubleshooting.md        # 7 Real-world Linux Incident Case Studies
├── 02-networking/                 # [COMPLETED] Networking Fundamentals
│   ├── README.md                  # Main Lesson: CIDR, TCP/UDP, DNS, Reverse Proxy
│   ├── networking-cheatsheet.md   # Diagnostic Command Reference (curl, dig, ss, ufw)
│   └── troubleshooting.md        # 6 Production Network Incidents (502/504, DNS, TLS)
├── 03-git/                        # [COMPLETED] Git & Collaboration
│   ├── README.md                  # Main Lesson: Git Stages, Rebase, Branching, SemVer
│   ├── git-cheatsheet.md          # Workflow & Command Reference
│   └── troubleshooting.md        # 5 Git Incidents (Secret Purge, reflog, Detached HEAD)
├── 04-bash-automation/            # [COMPLETED] Bash Scripting & Automation
│   ├── README.md                  # Main Lesson: Strict Mode, Health Checks, Cron & Alerts
│   ├── bash-cheatsheet.md         # Production Syntax, Expansions & Webhooks
│   └── troubleshooting.md        # 5 Scripting Bugs (CRLF, Subshells, Quotes, Cron Env)
├── 05-docker/                     # [COMPLETED] Docker & Containers
│   ├── README.md                  # Main Lesson: Architecture, Multi-Stage, Volumes, Networks
│   ├── docker-cheatsheet.md       # Production CLI, Compose & Prune Reference
│   ├── docker-compose-sample/     # Working Sample Fullstack Multi-Tier App (Nginx+Node+Postgres)
│   └── troubleshooting.md        # 5 Container Incidents (OOM 137, Port Conflict, PID 1 Exit)
├── 06-cicd/                       # [COMPLETED] CI/CD Pipeline
│   ├── README.md                  # Main Lesson: CI/CD Lifecycle, GitHub Actions, Deploy Strategies
│   ├── github-actions-cheatsheet.md # Workflows Syntax, Triggers, Contexts & Expressions
│   └── troubleshooting.md        # 5 Pipeline Gotchas (Secret Masking, SSH Keys, Concurrency)
├── 07-aws-fundamentals/           # [COMPLETED] Cloud Fundamentals & AWS
│   ├── README.md                  # Main Lesson: Shared Responsibility, Global Infra, IAM & Custom VPC
│   ├── aws-services-matrix.md     # 10-Point Architectural Matrix for 10 Core Services
│   └── cost-guardrails-and-troubleshooting.md # Free Tier Traps, Budgets & Teardown Checklist
├── 08-aws-deployment/             # [COMPLETED] Deploy an Application on AWS
│   ├── README.md                  # Main Lesson: 13-Stage Production 2-Tier Architecture
│   ├── architecture-diagram-and-specs.md # Subnet CIDRs, SG Chaining & IAM JSON Policies
│   └── teardown-and-cost-optimization.md # Complete Teardown Protocol & Instant Rollback
├── 09-terraform/                  # [COMPLETED] Infrastructure as Code (Terraform)
│   ├── README.md                  # Main Lesson: Declarative HCL, S3 Remote State & DynamoDB Locking
│   ├── terraform-cheatsheet.md    # CLI Commands, Workspaces & HCL Functions Reference
│   ├── sample-terraform-project/  # Working Terraform AWS VPC & Security Group Infrastructure Project
│   └── troubleshooting.md        # 4 Terraform Incidents (Lock Stuck, Resource Import, Replacement)
├── 10-ansible/                    # [COMPLETED] Configuration Management with Ansible
│   ├── README.md                  # Main Lesson: Push Model, Playbooks, Jinja2, Handlers & Vault
│   ├── ansible-cheatsheet.md      # Ad-hoc, Playbook CLI & Vault Commands Reference
│   ├── sample-ansible-project/    # Modular Production Roles (Nginx Webserver Cluster)
│   └── troubleshooting.md        # 7 Ansible Issues (SSH Keys, Sudo Pass, Jinja2 Undefined)
├── 11-monitoring-observability/   # [COMPLETED] Monitoring & Observability
│   ├── README.md                  # Main Lesson: Three Pillars, Prometheus TSDB, PromQL, Grafana & CloudWatch
│   ├── monitoring-cheatsheet.md   # PromQL Queries, Node Exporter Metrics & Promtool CLI
│   ├── sample-monitoring-stack/   # Working Docker Compose Stack (Prometheus + Grafana + Alertmanager)
├── 12-devsecops/                  # [COMPLETED] DevSecOps & Security Hardening
│   ├── README.md                  # Main Lesson: Shift-Left Security, Gitleaks, Trivy & Lynis Audit
│   ├── devsecops-cheatsheet.md    # Trivy CLI, Gitleaks, SSH Hardening & AWS Secrets Manager Reference
│   ├── sample-security-pipeline/  # Working GitHub Actions Security Scanning Pipeline & Hardened Dockerfile
├── 13-kubernetes/                 # [COMPLETED] Kubernetes & Container Orchestration
│   ├── README.md                  # Main Lesson: Control Plane, Pods, Deployments, Services, Helm & EKS
│   ├── k8s-cheatsheet.md          # Essential kubectl CLI, Imperative Generators & Helm Reference
│   ├── sample-k8s-manifests/      # Production Multi-Replica Manifests with HPA & ConfigMaps
│   └── troubleshooting.md        # 5 K8s Issues (CrashLoopBackOff, ImagePullBackOff, OOMKilled)
├── 14-sre-operations/             # [COMPLETED] SRE & Production Operations
│   ├── README.md                  # Main Lesson: Incident Triage, SEV Levels, Postmortems & Runbooks
│   ├── sre-runbook-template.md    # Standardized Production On-Call Runbook Template
│   ├── postmortem-template.md     # Blameless Postmortem Template with 5-Whys Analysis
│   └── troubleshooting.md        # 5 SRE Incidents (Cascading Failures, Runaways, Alert Fatigue)
├── 15-projects/                   # [COMPLETED] Capstone Portfolio Projects A, B, C, D
│   └── README.md                  # 4 Job-Ready Project Specs, Architectures & Resume Guidelines
├── interview-preparation/         # [COMPLETED] Scenario-based Technical Interview Questions & Answers
│   └── README.md                  # STAR Method, Top 25 Scenario Questions & Model Answers
├── glossary/                      # [COMPLETED] DevOps English-to-Burmese Detailed Glossary
│   └── README.md                  # 60+ Essential Cloud & DevOps Terms with Exact Burmese Explanations
└── references/                    # Official Documentation Links & Cheat Sheets
```

---

## 🛠️ စတင်ရန် လိုအပ်ချက်များ (Prerequisites & Setup)

1. **Hardware / OS**: 
   - macOS, Ubuntu Linux သို့မဟုတ် Windows (WSL 2)
   - အနည်းဆုံး 8GB RAM (16GB RAM အကြံပြုပါသည်)
   - 20GB+ Free SSD Storage
2. **အခမဲ့ အကောင့်များ (Free Tier Accounts)**:
   - **GitHub Account**: Code repository နှင့် GitHub Actions CI/CD အတွက်
   - **Docker Hub Account**: Container image push/pull အတွက်
   - **AWS Free Tier Account**: AWS Cloud ဝန်ဆောင်မှုများကို လက်တွေ့စမ်းသပ်ရန် (Free tier limits များကို စနစ်တကျ ထိန်းသိမ်းရမည်)

> [!CAUTION]
> **AWS Cloud ကုန်ကျစရိတ် သတိပေးချက် (Cloud Cost Safety)**:
> ဤသင်ရိုးတွင် AWS Free Tier ကို အသုံးပြုမည်ဖြစ်ပြီး သင်ခန်းစာတိုင်းတွင် **Billing Alert (0.01$)**၊ **Auto-teardown script** နှင့် **Cleanup checklist** များကို ဦးစားပေး သင်ကြားပေးသွားပါမည်။ မလိုအပ်သော Cloud Resource များကို အမြဲ Delete/Terminate လုပ်ရန် အလေးထား လိုက်နာရပါမည်။

---

## 📅 သင်ယူမှု စီမံချက်များ (Study Plans)

သင်၏ အချိန်နှင့် ရည်မှန်းချက်အလိုက် အောက်ပါ Study Plan များကို ရွေးချယ်နိုင်ပါသည် -

1. ⚡ **[30-Day Starter Plan](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/STUDY-PLAN-30-DAYS.md)**:
   - Linux, Networking, Git, Bash Automation နှင့် Docker Containers အခြေခံအုတ်မြစ်များကို (၁) လအတွင်း လက်တွေ့ကျွမ်းကျင်စေမည့် အမြန်လမ်း။
2. 🚀 **[90-Day Foundation Plan](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/STUDY-PLAN-90-DAYS.md)**:
   - Linux မှစ၍ Docker, CI/CD, AWS Deployment, Terraform, Monitoring နှင့် Capstone Projects အထိ အဆင့်ဆင့်လေ့လာပြီး Job-Ready ဖြစ်စေမည့် (၃) လတာ အပြည့်အစုံ လမ်းညွှန်။

---

## 🤝 မူဝါဒနှင့် သင်ကြားမှု အဆင့်ဆင့်သွားပုံ (Incremental Workflow)

သင်ရိုးတစ်ခုလုံးကို အဆင့်ဆင့် (Phase by Phase) တည်ဆောက်သွားပါမည်။ 
- **Phase 1 (လက်ရှိအဆင့်)**: သင်ရိုးလမ်းပြမြေပုံ (ROADMAP) နှင့် လေ့လာမှု စီမံချက်များ (STUDY PLANS) ကို အတည်ပြုခြင်း။
- **Phase 2**: Module 1 (Linux Fundamentals) မှစတင်ကာ Module တစ်ခုချင်းစီကို စနစ်တကျ လက်တွေ့လေ့ကျင့်ခန်း၊ Error Troubleshooting၊ Command Cheatsheet များနှင့်တကွ တည်ဆောက်ခြင်း။
