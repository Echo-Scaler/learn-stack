---
title: "Module 12: DevSecOps & Security Hardening"
description: "Shift-Left Security, Secret Scanning, Container Vulnerability Scanning with Trivy, Linux Hardening, and Secrets Management (မြန်မာဘာသာ)"
---

> **Shift-Left Security Mindset၊ Gitleaks Secret Detection၊ Trivy Container Scanning၊ Linux Server Hardening နှင့် AWS Secrets Management**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

အတိတ်ကာလတွင် Security (လုံခြုံရေး) ဆိုသည်မှာ Software Development ပြီးဆုံးပြီးမှသာ သီးသန့် Security Team မှ Penetration Test ပြုလုပ်သော အဆင့်ဖြစ်ခဲ့သည်။ သို့သော် ခေတ်သစ် CI/CD နှင့် Cloud ခေတ်တွင် တစ်ရက်လျှင် အကြိမ်ပေါင်းများစွာ deploy ပြုလုပ်နေကြသဖြင့် Security ကို နောက်ဆုံးမှ စစ်ဆေးခြင်းသည် deployment ကို ကြန့်ကြာစေပြီး (Bottleneck)၊ Production ပေါ်သို့ Secret Leaks သို့မဟုတ် CVE Vulnerabilities များ မတော်တဆ ပါသွားစေနိုင်ပါသည်။

**DevSecOps (Development + Security + Operations)** ၏ အဓိက ရည်ရွယ်ချက်မှာ **Shift-Left Security** ဖြစ်ပြီး Developer ကုဒ်စတင်ရေးသားသည့် အချိန်မှစ၍ CI/CD Pipeline တစ်လျှောက်လုံးတွင် လုံခြုံရေး စစ်ဆေးမှုများကို အလိုအလျောက် ပေါင်းစပ်ထည့်သွင်းခြင်း ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Shift-Left Security Mindset**: လုံခြုံရေးကို နောက်ဆုံးမှ စစ်ဆေးခြင်း မဟုတ်ဘဲ SDLC ၏ အစောဆုံး အဆင့်များတွင် ထည့်သွင်းခြင်း။
2. **Secret Leak Detection with Gitleaks**: API keys, Database passwords, AWS tokens များကို Git commit မလုပ်မီ အလိုအလျောက် ဖမ်းယူတားဆီးခြင်း။
3. **Container Vulnerability Scanning with Trivy**: Docker base images, OS packages နှင့် Application dependencies (npm/pip/composer) များကို CVE vulnerability scanning ပြုလုပ်ခြင်း။
4. **CI/CD Security Gates**: Vulnerability Severity "CRITICAL" သို့မဟုတ် "HIGH" တွေ့ရှိပါက Build ကို အလိုအလျောက် fail ပေးသည့် pipeline ရေးဆွဲခြင်း။
5. **Linux Production Hardening**: SSH Hardening, Passwordless Sudo, Least Privilege, UFW Firewall နှင့် Lynis Security Audit ပြုလုပ်ခြင်း။
6. **Container Security Best Practices**: Non-root container user (`USER appuser`), Read-only root filesystem နှင့် Multi-stage minimal images အသုံးချခြင်း။
7. **Centralized Secrets Management**: AWS Secrets Manager နှင့် SSM Parameter Store ကို အသုံးပြုပြီး credentials များကို code ထဲတွင် မသိမ်းဆည်းဘဲ dynamic ထုတ်ယူခြင်း။

---

## 🧠 ၂။ Shift-Left Security နှင့် DevSecOps Lifecycle

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DEVSECOPS PIPELINE LIFECYCLE                    │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ 1. CODE      │ 2. BUILD     │ 3. TEST      │ 4. DEPLOY    │ 5. RUN     │
├──────────────┼──────────────┼──────────────┼──────────────┼────────────┤
│ • Pre-commit │ • Multi-stage│ • DAST /     │ • Signed     │ • Least    │
│   Hooks      │   Builds     │   Dynamic API│   Artifacts  │   Privilege│
│ • Gitleaks   │ • Trivy Image│   Testing    │ • Immutable  │ • Runtime  │
│   Detection  │   Scanning   │ • SBOM       │   Infra      │   Monitoring│
│ • SAST Scans │ • Non-root   │   Generation │ • IaC Policy │ • Falco /  │
│   (SonarQube)│   Container  │   (Syft)     │   (Checkov)  │   Auditd   │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
     ◄─────────────────────── SHIFT-LEFT ──────────────────────────────
```

---

## 🔍 ၃။ Secret Leak Prevention with Gitleaks (လျှို့ဝှက်ချက်များ မပေါက်ကြားစေရန် တားဆီးခြင်း)

လုပ်ငန်းခွင်တွင် အဖြစ်အများဆုံးနှင့် အန္တရာယ်အကြီးဆုံး ပြဿနာမှာ AWS Access Key သို့မဟုတ် Database Password ကို Developer မှ GitHub သို့ commit push လုပ်မိခြင်း ဖြစ်ပါသည်။

### ၃.၁ Gitleaks ကို ထည့်သွင်းခြင်း:
```bash
# macOS
brew install gitleaks

# Linux
curl -sSL https://github.com/gitleaks/gitleaks/releases/download/v8.18.4/gitleaks_8.18.4_linux_x64.tar.gz | sudo tar -xz -C /usr/local/bin gitleaks

# ဗားရှင်း စစ်ဆေးခြင်း
gitleaks version
```

### ၃.၂ Git Repository တစ်ခုလုံးအား Scan စစ်ဆေးခြင်း:
```bash
# လက်ရှိ repository ထဲရှိ commit history အားလုံးကို scan ဖတ်ခြင်း
gitleaks detect --source . --verbose

# မပေါက်ကြားမီ commit မတင်မီ စစ်ဆေးခြင်း (Pre-commit hook)
gitleaks protect --staged --verbose
```

### ၃.၃ `.pre-commit-config.yaml` ဖြင့် Developer စက်တိုင်းတွင် Auto-Protect ပြုလုပ်ခြင်း:
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks
```
*အကျိုးကျေးဇူး: Developer တစ်ဦးသည် code ထဲတွင် password ရေးသားမိပါက `git commit` ရိုက်လိုက်သည်နှင့် commit မဖြစ်ဘဲ terminal တွင် ချက်ချင်း block ပေးပါသည်။*

---

## 🐳 ၄။ Trivy Container Vulnerability Scanning (ကွန်တိန်နာ လုံခြုံရေး စစ်ဆေးခြင်း)

Aqua Security ၏ **Trivy** သည် Cloud Native ပတ်ဝန်းကျင်တွင် အကျယ်ပြန့်ဆုံး အသုံးပြုသော vulnerability scanner ဖြစ်ပါသည်။ ၎င်းသည် Container Image သာမက Git Repository, Filesystem နှင့် Terraform IaC code များကိုပါ scan စစ်ဆေးပေးနိုင်ပါသည်။

### ၄.၁ Trivy ကို ထည့်သွင်းခြင်း:
```bash
# macOS
brew install trivy

# Docker container အဖြစ် တိုက်ရိုက် run ခြင်း (Install လုပ်စရာမလိုပါ)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image <IMAGE_NAME>
```

### ၄.၂ Docker Image အား Vulnerability Scan ဖတ်ခြင်း:
```bash
# ၁။ Image တစ်ခုလုံးကို scan စစ်ဆေးခြင်း
trivy image nginx:latest

# ၂။ CRITICAL နှင့် HIGH ပြဿနာများကိုသာ filter လုပ်ကြည့်ခြင်း
trivy image --severity HIGH,CRITICAL node:20-alpine

# ၃။ CI/CD Pipeline တွင် CRITICAL တွေ့ပါက Exit Code 1 ဖြင့် Build ကို ရပ်တန့်စေခြင်း
trivy image --exit-code 1 --severity CRITICAL my-app:v1.0.0
```

### ၄.၃ Output ကို နားလည်ခြင်း:
```text
node:20 (debian 12.5)
====================
Total: 125 (UNKNOWN: 0, LOW: 80, MEDIUM: 35, HIGH: 8, CRITICAL: 2)

┌────────────────┬────────────────┬──────────┬───────────────────┬───────────────┐
│    Library     │ Vulnerability  │ Severity │ Installed Version │ Fixed Version │
├────────────────┼────────────────┼──────────┼───────────────────┼───────────────┤
│ libssl3        │ CVE-2024-2511  │ CRITICAL │ 3.0.11-1~deb12u1  │ 3.0.11-1~deb12│
│ zlib1g         │ CVE-2023-45853 │ HIGH     │ 1:1.2.13.dfsg-1   │ 1:1.2.13.dfsg2│
└────────────────┴────────────────┴──────────┴───────────────────┴───────────────┘
```
*ဖြေရှင်းနည်း: Base image ကို `node:20-alpine` (Minimal Alpine Linux) သို့ ပြောင်းလဲခြင်း သို့မဟုတ် Dockerfile တွင် `apt-get upgrade` ထည့်သွင်းပေးခြင်းဖြင့် ဖြေရှင်းနိုင်ပါသည်။*

---

## 🔒 ၅။ Dockerfile Hardening Best Practices

မလုံခြုံသော Dockerfile နှင့် လုံခြုံစွာ Hardened ပြုလုပ်ထားသော Dockerfile နှိုင်းယှဉ်ချက်:

### ❌ မလုံခြုံသော Dockerfile (Anti-Pattern):
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
# အမှား ၁: root user အနေဖြင့် run ထားသည်
# အမှား ၂: devDependencies များ ပါဝင်နေသည်
# အမှား ၃: unnecessary tools များ ပါနေသည်
CMD ["node", "server.js"]
```

### ✅ လုံခြုံစွာ Hardened ပြုလုပ်ထားသော Dockerfile (Production Standard):
```dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Minimal Distroless / Alpine Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Best Practice 1: Dedicated non-root user ဖန်တီးခြင်း
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Best Practice 2: Builder မှ လိုအပ်သော ဖိုင်များကိုသာ ကူးယူခြင်း
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup server.js ./

# Best Practice 3: Non-root user သို့ ပြောင်းလဲခြင်း (Root privilege ပိတ်ပင်ခြင်း)
USER appuser

# Best Practice 4: Read-only container port
EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "server.js"]
```

---

## 🐧 ၆။ Linux Server Hardening & Auditing

ဆာဗာ အသစ်တစ်ခု တည်ဆောက်ပြီးပါက Production သို့ မလွှတ်မီ အောက်ပါ Security Baseline ကို ပြင်ဆင်ရပါမည်:

### ၆.၁ SSH Configuration Hardening (`/etc/ssh/sshd_config`):
```ini
# SSH Port ကို ပုံမှန် port 22 မှ အခြား port သို့ ပြောင်းပါ (optional)
# Port 2222

# Root user ဖြင့် တိုက်ရိုက် SSH ဝင်ရောက်ခြင်းကို ပိတ်ပါ
PermitRootLogin no

# Password ဖြင့် ဝင်ရောက်ခြင်းကို လုံးဝ ပိတ်ပြီး SSH Key သာ ခွင့်ပြုပါ
PasswordAuthentication no
PubkeyAuthentication yes

# အလွတ်ထားသော password များ ပိတ်ပါ
PermitEmptyPasswords no

# အမြင့်ဆုံး ကြိုးစားခွင့် ကန့်သတ်ပါ
MaxAuthTries 3
```
ပြင်ဆင်ပြီးပါက စစ်ဆေးပြီး reload လုပ်ပါ:
```bash
sudo sshd -t && sudo systemctl reload sshd
```

### ၆.၂ Lynis Security Auditing Tool ဖြင့် စစ်ဆေးခြင်း:
**Lynis** သည် Linux စနစ်တစ်ခုလုံး၏ Security Hardening Index ကို အမှတ်ပေး စစ်ဆေးပေးသော Open-Source tool ဖြစ်သည်:

```bash
# Lynis သွင်းယူခြင်း
sudo apt install -y lynis

# စနစ်တစ်ခုလုံးအား Security Audit စစ်ဆေးခြင်း
sudo lynis audit system --quick
```
- စစ်ဆေးမှု ပြီးဆုံးပါက **Hardening Index (ဥပမာ: 82/100)** နှင့် စနစ်တွင် ပြင်ဆင်ရန် လိုအပ်သော **Warnings & Suggestions** များကို စာရင်းထုတ်ပေးမည် ဖြစ်ပါသည်။

---

## 🔑 ၇။ Centralized Secrets Management with AWS Secrets Manager

Application များတွင် Database Credentials များကို `.env` ဖိုင်ထဲတွင် plain text အဖြစ် သိမ်းဆည်းခြင်းအစား **AWS Secrets Manager** မှ Run-time တွင် API ဖြင့် ဆွဲယူသုံးစွဲရပါမည်:

### ၇.၁ AWS CLI ဖြင့် Secret ဖန်တီးခြင်း:
```bash
aws secretsmanager create-secret \
    --name "production/ecommerce/database" \
    --description "Production PostgreSQL DB credentials" \
    --secret-string '{"username":"dbadmin","password":"VerySecureRandomPassword99!#","dbname":"production_db","host":"rds.example.internal","port":5432}'
```

### ၇.၂ Application Code မှ Secret ကို ရယူခြင်း (Node.js Example):
```javascript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "ap-southeast-1" });

async function getDBCredentials() {
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "production/ecommerce/database" })
  );
  return JSON.parse(response.SecretString);
}
```
*အကျိုးကျေးဇူး: Server disk ပေါ်တွင် password မရှိတော့သဖြင့် ဆာဗာ hack ခံရလျှင်ပင် database password ပေါက်ကြားမှု မရှိစေပါ။ ထို့အပြင် AWS Secrets Manager သည် Password ကို ၃၀ ရက်တစ်ကြိမ် အလိုအလျောက် ပြောင်းလဲပေးနိုင်ပါသည် (Automatic Rotation)။*

---

## 🚀 ၈။ GitHub Actions တွင် Automated Security Gates တည်ဆောက်ခြင်း

Developer မှ Pull Request တင်လိုက်သည်နှင့် Secret Scan နှင့် Container Vulnerability Scan ကို အလိုအလျောက် စစ်ဆေးမည့် Pipeline:

```yaml
name: DevSecOps Security Scan

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  secret-scan:
    name: Secret Leak Detection (Gitleaks)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  vulnerability-scan:
    name: Container Vulnerability Scan (Trivy)
    runs-on: ubuntu-latest
    needs: secret-scan
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Build Local Docker Image
        run: docker build -t my-app:${{ github.sha }} .

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'my-app:${{ github.sha }}'
          format: 'table'
          exit-code: '1'              # CRITICAL တွေ့ပါက Pipeline Fail မည်
          ignore-unfixed: true        # Fix မရှိသေးသော CVE များကို ကျော်မည်
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'
```

---

## 🛡️ ၉။ Production DevSecOps Checklist

1. ✅ **No Secrets in Code**: Codebase ထဲတွင် Password, API Token, Private Key လုံးဝ မပါစေရ (Gitleaks ဖြင့် Pre-commit hook တပ်ဆင်ထားပါ)။
2. ✅ **Run as Non-Root**: Dockerfile တိုင်းတွင် `USER appuser` (Non-root user) သတ်မှတ်ထားပါ။
3. ✅ **Scan Dependencies Daily**: `npm audit`, `pip-audit` သို့မဟုတ် Snyk/Dependabot ဖြင့် dependency updates ပုံမှန်ယူပါ။
4. ✅ **Minimal Base Images**: အပို packages များ မပါဝင်သော Alpine သို့မဟုတ် Distroless base images ကိုသာ အသုံးပြုပါ။
5. ✅ **Disable Password Authentication on SSH**: Linux server များတွင် SSH Key သာ အသုံးပြုခွင့်ပေးပါ။
6. ✅ **Enable Secrets Rotation**: AWS Secrets Manager ဖြင့် Database password များကို ရက် ၃၀/၆၀ တကြိမ် auto-rotate လုပ်ပါ။

---

## 🔍 ၁၀။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ (Verification Commands)

```bash
# ၁။ Git repository ထဲတွင် secret ပါမပါ စစ်ဆေးခြင်း
gitleaks detect --verbose

# ၂။ Docker image ၏ critical vulnerabilities စစ်ဆေးခြင်း
trivy image --severity CRITICAL my-image:latest

# ၃။ Terraform IaC code တွင် security misconfigurations စစ်ဆေးခြင်း
trivy config ./terraform/

# ၄။ Linux Server Security Hardening Index စစ်ဆေးခြင်း
sudo lynis audit system --quick | grep "Hardening index"

# ၅။ Container သည် Non-root ဖြင့် run နေမှု စစ်ဆေးခြင်း
docker exec -it <CONTAINER_ID> id
# မျှော်လင့်ထားသော ရလဒ်: uid=1000(appuser) gid=1000(appgroup) (uid=0 မဖြစ်ရပါ)
```

---

## 🚨 ၁၁။ အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting Scenarios)

### ပြဿနာ ၁: Non-Root User ပြောင်းပြီးနောက် Container တွင် `EACCES: permission denied` Error တက်ခြင်း
- **အကြောင်းရင်း**: Application directory သို့မဟုတ် log folder အား root user ဖြင့်သာ create လုပ်ထားသဖြင့် non-root user မှ write ခွင့် မရှိခြင်း။
- **ဖြေရှင်းနည်း**: Dockerfile တွင် `chown -R` ဖြင့် ownership လွှဲပြောင်းပေးပါ:
  ```dockerfile
  RUN mkdir -p /app/logs && chown -R appuser:appgroup /app
  USER appuser
  ```

### ပြဿနာ ၂: Trivy Scan တွင် Fix မရှိသေးသော (Unfixed) CVEs များကြောင့် CI/CD အမြဲ Fail ဖြစ်နေခြင်း
- **အကြောင်းရင်း**: Upstream Linux distribution (Debian/Ubuntu) ဘက်မှ security patch မထုတ်ပေးသေးသော vulnerabilities များ ဖြစ်နေခြင်း။
- **ဖြေရှင်းနည်း**: CI/CD pipeline တွင် `--ignore-unfixed` flag ထည့်သွင်းပေးပါ:
  ```bash
  trivy image --ignore-unfixed --severity CRITICAL my-app:latest
  ```

### ပြဿနာ ၃: Gitleaks မှ Dummy/Test Token များကို Secret အဖြစ် False Positive ဖမ်းမိနေခြင်း
- **ဖြေရှင်းနည်း**: Repository root တွင် `.gitleaksignore` ဖိုင် ဖန်တီးပြီး သက်ဆိုင်ရာ commit hash သို့မဟုတ် file path ကို ချန်လှပ်ပေးပါ:
  ```text
  # .gitleaksignore
  tests/mock_secrets.py
  ```

---

## 💼 ၁၂။ အင်တာဗျူး အမေးအဖြေများ (Interview Questions & Model Answers)

### မေးခွန်း ၁: Shift-Left Security ဆိုတာ ဘာလဲ? အဘယ်ကြောင့် အရေးကြီးသလဲ?
**အဖြေ**: 
> "Shift-Left Security ဆိုသည်မှာ Software Development Lifecycle (SDLC) တွင် လုံခြုံရေး စစ်ဆေးမှုများကို နောက်ဆုံး Production ရောက်မှ မဟုတ်ဘဲ Developer Code ရေးသည့် အစောဆုံး အဆင့်ဆီသို့ ဘယ်ဘက်သို့ ရွှေ့ပြောင်း (Shift-Left) ထည့်သွင်းခြင်း ဖြစ်ပါသည်။ 
> 
> ၎င်းသည် အလွန်အရေးကြီးပါသည်၊ အဘယ်ကြောင့်ဆိုသော် Production ပေါ်ရောက်မှ တွေ့ရှိရသော Security Vulnerability တစ်ခုကို ဖြေရှင်းရန် ကုန်ကျစရိတ်နှင့် အန္တရာယ်သည် Code စရေးချိန် သို့မဟုတ် PR အဆင့်တွင် မိနစ်ပိုင်းအတွင်း ဖြေရှင်းရသည်ထက် အဆပေါင်း ၁၀၀ ကျော် ပိုမိုကြီးမားသောကြောင့် ဖြစ်ပါသည်။"

### မေးခွန်း ၂: Container များကို Root User အနေဖြင့် အဘယ်ကြောင့် မ run သင့်သလဲ?
**အဖြေ**:
> "Docker Container တစ်ခုအတွင်း root user (UID 0) အနေဖြင့် run ထားပါက အကယ်၍ application တွင် Remote Code Execution (RCE) သို့မဟုတ် Container Escape vulnerability တစ်ခုခု ဖြစ်ပေါ်ခဲ့လျှင် တိုက်ခိုက်သူသည် Host Linux Server ၏ root privileges ကိုပါ ရရှိသွားနိုင်ပါသည်။ Non-root user (ဥပမာ UID 10001) သို့ ကန့်သတ်ထားခြင်းဖြင့် တိုက်ခိုက်ခံရလျှင်ပင် Host System တစ်ခုလုံးကို ထိခိုက်ပျက်စီးခြင်းမှ ကာကွယ်ပေးနိုင်ပါသည်။"

---

## 📋 ၁၃။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့် (Summary & Next Step)

ယခု Module 12 တွင် သင်သည်:
- Shift-Left Security အတွေးအခေါ်နှင့် DevSecOps CI/CD Lifecycle ကို သဘောပေါက်ခဲ့သည်။
- Gitleaks ဖြင့် Source Code ထဲသို့ API keys နှင့် passwords များ ပေါက်ကြားခြင်းမှ တားဆီးနိုင်ခဲ့သည်။
- Trivy ဖြင့် Docker Container Images များကို CVE vulnerability scanning ပြုလုပ်နိုင်ခဲ့သည်။
- Production-grade Dockerfile hardening (Non-root, multi-stage) ကို လက်တွေ့ တည်ဆောက်ခဲ့သည်။
- Linux OS Hardening (SSH, Lynis audit) နှင့် AWS Secrets Manager အသုံးပြုပုံကို တတ်မြောက်ခဲ့သည်။

👉 **နောက်တစ်ဆင့်**: **[Module 13: Kubernetes & Container Orchestration (Pods, Deployments, Services, Helm & EKS)](/devops-guide/13-kubernetes/readme/)** သို့ ဆက်လက် တက်လှမ်းပါမည်။
