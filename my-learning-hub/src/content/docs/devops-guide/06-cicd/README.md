---
title: "Module 06: CI/CD Pipelines with GitHub Actions for DevOps Engineers"
description: "Continuous Integration, Continuous Delivery/Deployment, GitHub Actions Workflows, Automated Tests, Docker Buildx, Registries, SSH Deployment & Rollback Strategies"
---

> **Manual Deployment ဖြင့် အချိန်ဖြုန်းခြင်းကို အဆုံးသတ်ပြီး Automated Testing, Docker Image Building, Security Scanning နှင့် Zero-Downtime Deployment Pipelines တည်ဆောက်ခြင်း**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Continuous Integration & Continuous Delivery (CI/CD) with GitHub Actions, Automated Testing, Container Registries & Safe Deployment Strategies**
- **Track Level**: Core Automation & Delivery (အလိုအလျောက် ဖြန့်ကြက်ခြင်း)
- **Target Audience**: DevOps Engineers, Software Engineers, Release Managers
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **CI vs CD**: Continuous Integration, Continuous Delivery နှင့် Continuous Deployment တို့၏ အဓိက ကွာခြားချက်နှင့် တန်ဖိုးကို ရှင်းလင်းစွာ ခွဲခြားသိရှိခြင်း။
* [x] **GitHub Actions Architecture**: Workflows, Events/Triggers (`push`, `pull_request`, `workflow_dispatch`), Jobs, Steps, Actions နှင့် Runners (GitHub-hosted vs Self-hosted) အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
* [x] **Automated Testing & Quality Gates**: Code push တိုင်းတွင် Unit Tests, Linters များကို အလိုအလျောက် ပြေးဆွဲစေပြီး စမ်းသပ်မှု ကျရှုံးပါက Merge လုပ်ခွင့် ပိတ်ပင်နိုင်ခြင်း။
* [x] **Docker Buildx & Registry Push**: GitHub Actions တွင် Docker Buildx caching သုံး၍ Docker Image တည်ဆောက်ကာ Docker Hub သို့မဟုတ် AWS ECR သို့ Semantic Tags (`v1.2.0`) ဖြင့် အလိုအလျောက် push ပြုလုပ်နိုင်ခြင်း။
* [x] **Secure Secrets Management**: GitHub Secrets (`${{ secrets.AWS_ACCESS_KEY }}`) ကို အသုံးပြု၍ Credentials များကို logs များတွင် Masking ပြုလုပ်ကာ လုံခြုံစွာ ကိုင်တွယ်နိုင်ခြင်း။
* [x] **Deployment Strategies**: Rolling Update, Blue-Green Deployment နှင့် Canary Deployment သဘောတရားများကို နားလည်ပြီး Rollback အလိုအလျောက် လုပ်ဆောင်နိုင်ခြင်း။
* [x] **Automated SSH Deployment**: Staging/Production Server သို့ SSH Key-based authentication ဖြင့် Zero-Downtime Deployment ပြုလုပ်နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 03: Git & Collaboration](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/03-git/README.md) — Git commits, branches, PRs နှင့် SemVer tags အသုံးပြုတတ်ခြင်း။
2. [Module 05: Docker & Containers](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/05-docker/README.md) — Dockerfile, Image build & push အခြေခံ နားလည်ထားခြင်း။
3. GitHub Account နှင့် Docker Hub (သို့မဟုတ် AWS) အကောင့် ရှိထားခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Continuous Integration (CI)** | Developer များ ရေးသားလိုက်သော code များကို main branch သို့ မကြာခဏ ပေါင်းထည့်ပြီး အလိုအလျောက် build နှင့် test စစ်ဆေးပေးသည့် စနစ် | Bug များနှင့် code breaking ပြဿနာများကို Production မရောက်မီ စက္ကန့်ပိုင်းအတွင်း ဖော်ထုတ်ပေးသည်။ | PR တင်တိုင်း `npm test` သို့မဟုတ် `phpunit` အလိုအလျောက် ပြေးခြင်း။ |
| **Continuous Delivery (CD)** | စမ်းသပ်ပြီးသား Code များကို Production သို့ တင်ရန် အမြဲအသင့်ဖြစ်နေအောင် (Deployable Artifact) အလိုအလျောက် ပြင်ဆင်ပေးခြင်း (Human Approval လိုအပ်သည်) | Production သို့ တင်ရန် ခလုတ်တစ်ချက် နှိပ်ရုံဖြင့် ဘေးကင်းစွာ release ထုတ်နိုင်စေသည်။ | Docker Image တည်ဆောက်ပြီး AWS ECR သို့ တင်ထားခြင်း။ |
| **Continuous Deployment (CD)** | လူကိုယ်တိုင် ခလုတ်နှိပ်စရာမလိုဘဲ Test အားလုံး အောင်မြင်သည်နှင့် Production Server ပေါ်သို့ တိုက်ရိုက် အလိုအလျောက် ဖြန့်ကြက်ပေးခြင်း | High-velocity tech companies များတွင် တစ်နေ့လျှင် အကြိမ်ပေါင်းများစွာ update ထုတ်နိုင်စေသည်။ | `main` သို့ merge သည်နှင့် Production Server ပေါ် အလိုအလျောက် deploy ဖြစ်ခြင်း။ |
| **GitHub Actions Runner** | Workflow job များကို လက်တွေ့ run ပေးသော Virtual Machine (Ubuntu/Windows/macOS) | CI/CD pipeline အလုပ်လုပ်မည့် server instance ဖြစ်သည်။ GitHub မှ အခမဲ့ ၂၀၀၀ မိနစ် ထောက်ပံ့ထားသည်။ | `runs-on: ubuntu-latest` |
| **Workflow / Job / Step** | Workflow သည် YAML ဖိုင်တစ်ခုလုံး ဖြစ်ပြီး၊ Job သည် Runner တစ်ခုပေါ်တွင် run မည့် လုပ်ငန်းစုဖြစ်ကာ၊ Step သည် Job အတွင်းရှိ သီးခြား command တစ်ခုချင်းစီ ဖြစ်သည် | Pipeline များကို modular ဖြစ်အောင် ခွဲခြမ်းစီမံရာတွင် အသုံးပြုသည့် Hierarchy ဖြစ်သည်။ | `.github/workflows/deploy.yml` |
| **Secret Masking** | GitHub Actions console logs များတွင် Password များ၊ API Keys များကို လူမမြင်နိုင်အောင် `***` အဖြစ် အလိုအလျောက် ဖုံးကွယ်ပေးခြင်း | Developer များ logs ကြည့်ရှုချိန်တွင် sensitive credentials များ ပေါက်ကြားမသွားစေရန် ကာကွယ်ပေးသည်။ | `${{ secrets.DB_PASSWORD }}` ➜ `***` |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ The Modern DevOps CI/CD Lifecycle

```text
[ Developer Machine ]
        │ `git push`
        ▼
[ GitHub Repository ]
        │ Triggers: on [push, pull_request]
        ▼
┌─────────────────────────────────────────────────────────────┐
│                 GITHUB ACTIONS CI PIPELINE                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Lint & Code Style Check (`npm run lint`)                 │
│ 2. Automated Unit Tests (`npm test`)                        │
│ 3. Security Vulnerability Scan (`trivy fs .`)               │
└─────────────────────────────────────────────────────────────┘
        │ If all tests PASS (Quality Gate)
        ▼
┌─────────────────────────────────────────────────────────────┐
│                 GITHUB ACTIONS CD PIPELINE                  │
├─────────────────────────────────────────────────────────────┤
│ 4. Build Docker Image (`docker buildx`)                     │
│ 5. Push to Container Registry (Docker Hub / AWS ECR)        │
│ 6. Deploy to Staging / Production Server via SSH / K8s      │
│ 7. Send Slack/Discord Deployment Notification Alert         │
└─────────────────────────────────────────────────────────────┘
```

---

### ၅.၂ Deployment Strategies (ဖြန့်ကြက်မှု မဟာဗျူဟာများ နှိုင်းယှဉ်ချက်)

1. **Recreate (Downtime Deployment)**:
   - Server အဟောင်းကို ပိတ်ချ ➜ အသစ်ကို တင်သည်။
   - **အားနည်းချက်**: မိနစ်အနည်းငယ် Downtime ဖြစ်သည်။
2. **Rolling Update (Standard)**:
   - Server အလုံး ၄ လုံးရှိပါက ၁ လုံးချင်းစီ အဟောင်းဖျက် အသစ်တင် လုပ်ဆောင်သည်။
   - **အားသာချက်**: Zero Downtime ဖြစ်သည်။
3. **Blue-Green Deployment (Enterprise Safe)**:
   - Environment ၂ ခု ထားရှိသည်: Blue (လက်ရှိ Live Production) နှင့် Green (အသစ်တင်မည့် စနစ်)။
   - Green ပေါ်တွင် Deploy လုပ်ပြီး Test အောင်မြင်မှ Load Balancer (ALB) ကို Green ဘက်သို့ ချက်ချင်း လွှဲပြောင်းပေးသည်။ ပြဿနာဖြစ်ပါက Blue သို့ စက္ကန့်ပိုင်းအတွင်း ပြန်ပြောင်း (Instant Rollback) နိုင်သည်။
4. **Canary Deployment**:
   - User အားလုံး၏ ၅% ကိုသာ version အသစ်ဆီသို့ ပို့ဆောင်ပြီး Error မရှိမှသာ ၁၀၀% အပြည့် ဖြန့်ကြက်သည်။

---

## 🏗️ ၆။ Production Pipeline Stage 1: Continuous Integration (Automated Test & Quality Gate)

ပထမဆုံး အဆင့်အနေဖြင့် Developer များ PR တင်တိုင်း Unit Tests များ စစ်ဆေးပေးသော workflow ဖြစ်ပါသည်:

```yaml
# ဖိုင်တည်နေရာ: .github/workflows/ci-test.yml
name: Continuous Integration (Test & Lint)

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ develop ]

jobs:
  test-and-lint:
    name: Run Automated Unit Tests & Quality Gates
    runs-on: ubuntu-latest

    steps:
      - name: Check out source code repository
        uses: actions/checkout@v4

      - name: Set up Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies cleanly
        run: npm ci

      - name: Run code linter
        run: npm run lint --if-present

      - name: Execute automated unit test suite
        run: npm test
```

---

## 🏗️ ၇။ Production Pipeline Stage 2: Continuous Delivery (Docker Build & Registry Push)

Test အားလုံး အောင်မြင်ပြီး `main` branch သို့ merge သောအခါ Docker Image အလိုအလျောက် build ပြုလုပ်ပြီး Docker Hub သို့ push တင်ပုံ:

```yaml
# ဖိုင်တည်နေရာ: .github/workflows/cd-build-push.yml
name: Continuous Delivery (Docker Build & Push)

on:
  push:
    branches: [ main ]
    tags:
      - 'v*.*.*'

jobs:
  build-and-push:
    name: Build Multi-Arch Docker Image & Push to Registry
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx (Layer Caching Engine)
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub Registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract Docker metadata (Tags & Labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKERHUB_USERNAME }}/ecommerce-api
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha,format=short

      - name: Build and push Docker image with GitHub cache
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🏗️ ၈။ Production Pipeline Stage 3: Automated SSH Remote Deployment with Rollback

Image အသစ်ကို Staging/Production Server ပေါ်သို့ SSH ဖြင့် လုံခြုံစွာ ဝင်ရောက် deploy ပြုလုပ်ပုံ:

```yaml
# ဖိုင်တည်နေရာ: .github/workflows/deploy-ssh.yml
name: Production Remote Deployment

on:
  workflow_run:
    workflows: ["Continuous Delivery (Docker Build & Push)"]
    types: [completed]
    branches: [main]

jobs:
  deploy-to-server:
    name: Deploy to Production Linux Server via SSH
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Execute Remote SSH Deployment Commands
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_SERVER_IP }}
          username: ${{ secrets.PROD_SERVER_USER }}
          key: ${{ secrets.PROD_SERVER_SSH_KEY }}
          port: 22
          script_stop: true
          script: |
            set -euo pipefail
            echo "=== Pulling latest Docker image on Server ==="
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/ecommerce-api:latest

            echo "=== Restarting application stack with zero downtime ==="
            cd /opt/webapps/ecommerce
            docker compose pull web
            docker compose up -d --no-deps --build web

            echo "=== Performing Health Check Probe ==="
            sleep 5
            curl --fail http://localhost:8080/healthz || {
                echo "HEALTHCHECK FAILED! Initiating automatic rollback...";
                docker compose rollback || true;
                exit 1;
            }
            echo "=== Deployment Successfully Completed ==="
```

---

## 🛡️ ၉။ Security & Secret Management Best Practices (လုံခြုံရေး စည်းမျဉ်းများ)

1. **Never Hardcode Secrets**: AWS Keys, Database Passwords များကို မည်သည့်အခါမျှ YAML ဖိုင်ထဲတွင် တိုက်ရိုက် မရေးပါနှင့်။ GitHub Repository Settings ➜ **Secrets and variables** ➜ **Actions** တွင်သာ ထည့်သွင်းပါ။
2. **Use GitHub Deploy Tokens instead of Passwords**: Docker Hub သို့မဟုတ် GitHub Personal Access Token သုံးရာတွင် Password အစစ်အစား အခွင့်အရေး ကန့်သတ်ထားသော **Fine-grained Scoped Token** ကိုသာ သုံးပါ။
3. **Environment Protection Rules**: Production သို့ deploy မတင်မီ Senior Engineer တစ်ဦးမှ Manual Approval နှိပ်ပေးရမည့် **GitHub Environments (Reviewers Required)** စနစ်ကို သတ်မှတ်ထားပါ။
4. **Least Privilege Permissions**: Workflow ထိပ်ဆုံးတွင် default permissions ကို ကန့်သတ်ပါ:
   ```yaml
   permissions:
     contents: read
   ```

---

## ⚠️ ၁၀။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **Process completed with exit code 1** | Unit test တစ်ခု ကျရှုံးခြင်း သို့မဟုတ် syntax linter error တက်ခြင်း | Actions log တွင် မည်သည့် test file fail ဖြစ်သွားသည်ကို ဖတ်ရှုပြီး local တွင် ပြင်ဆင် commit ပြန်တင်ပါ။ |
| **`Error: Username and password required`** | GitHub Secrets အမည် (ဥပမာ `DOCKERHUB_USERNAME`) စာလုံးပေါင်း မှားယွင်းနေခြင်း သို့မဟုတ် မထည့်ရသေးခြင်း | Repository Settings ➜ Secrets ထဲတွင် Secret name နှင့် Token တန်ဖိုး မှန်ကန်စွာ ရှိမရှိ စစ်ဆေးပါ။ |
| **`Permission denied (publickey)` in SSH Deploy** | Runner ၏ Private key နှင့် Server ပေါ်ရှိ `~/.ssh/authorized_keys` မကိုက်ညီခြင်း သို့မဟုတ် server permission လွဲနေခြင်း | Server ပေါ်ရှိ `chmod 600 ~/.ssh/authorized_keys` ကို စစ်ပါ။ Secret ထဲရှိ Private Key တွင် `BEGIN OPENSSH PRIVATE KEY` မှ `END` အထိ အပြည့်အစုံ ပါဝင်မှု စစ်ပါ။ |
| **Workflow not triggering** | Trigger syntax မှားယွင်းခြင်း သို့မဟုတ် YAML indent space လွဲနေခြင်း | `.github/workflows/` path မှန်မမှန် စစ်ပါ။ YAML linter သို့မဟုတ် VS Code Actions extension ဖြင့် syntax စစ်ပါ။ |

---

## 🏋️ ၁၁။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Setup an End-to-End CI Pipeline in GitHub**
1. မိမိ၏ GitHub အကောင့်တွင် Repository အသစ်တစ်ခု ဖန်တီးပါ။
2. ရိုးရှင်းသော Node.js (သို့မဟုတ် Python) project နှင့် unit test တစ်ခု ထည့်သွင်းပါ။
3. `.github/workflows/ci.yml` ဖိုင်ကို ရေးသားပြီး `push` ဖြစ်တိုင်း test run စေရန် ပြင်ဆင်ပါ။
4. Test တစ်ခုကို တမင် အမှားလုပ်ပြီး push တင်ပါ ➜ GitHub Actions တွင် **Red X (Failed)** ပြသသည်ကို စောင့်ကြည့်ပါ။
5. Test ကို ပြန်လည်ပြင်ဆင်ပြီး push တင်ပါ ➜ GitHub Actions တွင် **Green Checkmark (Success)** ပြသသည်ကို အတည်ပြုပါ။

---

## ❓ ၁၂။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. Continuous Delivery နှင့် Continuous Deployment အဓိက ကွာခြားချက်မှာ အဘယ်နည်း?
2. GitHub Actions တွင် `cache-from: type=gha` သုံးခြင်း၏ အကျိုးကျေးဇူးမှာ အဘယ်နည်း?
3. Blue-Green Deployment သည် Recreate Deployment ထက် အဘယ်ကြောင့် ပိုမို လုံခြုံစိတ်ချရသနည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. Continuous Delivery တွင် Code သည် Production သို့ တင်ရန် အမြဲအသင့်ဖြစ်နေသော်လည်း Production သို့ တကယ်တင်ရန်အတွက် **လူကိုယ်တိုင် Manual Approval / ခလုတ်နှိပ်ခြင်း** လိုအပ်သည်။ Continuous Deployment တွင်မူ စမ်းသပ်မှု အောင်မြင်သည်နှင့် လူမပါဘဲ Production သို့ **တိုက်ရိုက် အလိုအလျောက် Deploy** ပြုလုပ်ပေးသည်။
2. Docker Image build ပြုလုပ်ရာတွင် ယခင် build မှ layer cache များကို GitHub Actions Cache storage (GHA) မှ ပြန်လည်ယူသုံးသဖြင့် နောက်ဆက်တွဲ build ပြုလုပ်ချိန်များကို မိနစ်ပိုင်းမှ စက္ကန့်ပိုင်းအထိ အဆပေါင်းများစွာ လျှော့ချပေးနိုင်သည်။
3. Blue-Green Deployment တွင် Version အသစ်ကို သီးခြား Environment (Green) ပေါ်တွင် အပြည့်အဝ စမ်းသပ်ပြီးမှ User traffic ကို လွှဲပြောင်းပေးခြင်းဖြစ်ပြီး၊ ပြဿနာတက်ပါက Traffic ကို Blue သို့ စက္ကန့်ပိုင်းအတွင်း ပြန်ကွေ့ (Zero-Downtime Instant Rollback) နိုင်သောကြောင့် ဖြစ်သည်။
</details>

---

## 💼 ၁၃။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production Deployment တစ်ခု ပြုလုပ်ပြီးနောက် Application တွင် Critical Bug တွေ့ရှိပါက သင် မည်သို့ Rollback အမြန်ဆုံး ဆောင်ရွက်မည်နည်း?**
> **Sample Answer**:
> "အရေးပေါ် Rollback ချရာတွင် အခြေအနေ (၂) မျိုးဖြင့် ချဉ်းကပ်ပါမည်: (၁) **Immediate Infrastructure Rollback**: အကယ်၍ Kubernetes သို့မဟုတ် Blue-Green/ALB စနစ်သုံးထားပါက Traffic ကို ယခင် Version အဟောင်း (Known Good State) ဆီသို့ ချက်ချင်း လွှဲပြောင်းပေးပါမည် (Kubernetes တွင် `kubectl rollout undo deployment/<name>`)။ ထိုအခါ မိနစ်ပိုင်းအတွင်း User များအတွက် ပြန်လည် ကောင်းမွန်သွားပါမည်။ (၂) **Git Flow Rollback**: Infrastructure တွင် အဆင်ပြေသွားပြီးနောက် Git repository ဘက်တွင် `git revert <bad-commit-hash>` ပြုလုပ်ပြီး PR တင်ကာ CI/CD pipeline မှတဆင့် Codebase ကို သန့်ရှင်းစွာ ပြန်လည် ချိန်ညှိပါမည်။ ထို့နောက် Root Cause Analysis (RCA) ပြုလုပ်ပြီး Postmortem မှတ်တမ်းတင်ပါမည်။"

---

## 📚 ၁၄။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [GitHub Actions Official Documentation](https://docs.github.com/en/actions)
- [Docker Buildx with GitHub Actions](https://docs.docker.com/build/ci/github-actions/)
- [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
