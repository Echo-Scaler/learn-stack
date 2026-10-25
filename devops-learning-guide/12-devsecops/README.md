# 🛡️ Module 12: DevSecOps & Security Hardening (မြန်မာဘာသာ)

> **Shift-Left Security Mindset၊ Gitleaks Secret Detection၊ Trivy Container Scanning၊ Linux Server Hardening နှင့် AWS Secrets Management**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

အတိတ်ကာလတွင် Security (လုံခြုံရေး) ဆိုသည်မှာ Software Development ပြီးဆုံးပြီးမှသာ သီးသန့် Security Team မှ Penetration Test ပြုလုပ်သော အဆင့်ဖြစ်ခဲ့သည်။ သို့သော် ခေတ်သစ် CI/CD နှင့် Cloud ခေတ်တွင် တစ်ရက်လျှင် အကြိမ်ပေါင်းများစွာ deploy ပြုလုပ်နေကြသဖြင့် Security ကို နောက်ဆုံးမှ စစ်ဆေးခြင်းသည် deployment ကို ကြန့်ကြာစေပြီး (Bottleneck)၊ Production ပေါ်သို့ Secret Leaks သို့မဟုတ် CVE Vulnerabilities များ မတော်တဆ ပါသွားစေနိုင်ပါသည်။

**DevSecOps (Development + Security + Operations)** ၏ အဓိက ရည်ရွယ်ချက်မှာ **Shift-Left Security** ဖြစ်ပြီး Developer ကုဒ်စတင်ရေးသားသည့် အချိန်မှစ၍ CI/CD Pipeline တစ်လျှောက်လုံးတွင် လုံခြုံရေး စစ်ဆေးမှုများကို အလိုအလျောက် ပေါင်းစပ်ထည့်သွင်းခြင်း ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Shift-Left Security Mindset**: လုံခြုံရေးကို နောက်ဆုံးမှ စစ်ဆေးခြင်း မဟုတ်ဘဲ SDLC ၏ အစောဆုံး အဆင့်များတွင် ထည့်သွင်းခြင်း။
2. **Secret Leak Detection with Gitleaks**: API keys, Database passwords, AWS tokens များကို Git commit မလုပ်မီ အလိုအလျောက် ဖမ်းယူတားဆီးခြင်း။
3. **Container Vulnerability Scanning with Trivy**: Docker base images, OS packages နှင့် Application dependencies များကို CVE vulnerability scanning ပြုလုပ်ခြင်း။
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

## 🔍 ၃။ Secret Leak Prevention with Gitleaks

```bash
# Git repository ထဲရှိ commit history အားလုံးကို scan ဖတ်ခြင်း
gitleaks detect --source . --verbose

# Pre-commit hook ဖြင့် commit မတင်မီ စစ်ဆေးခြင်း
gitleaks protect --staged --verbose
```

---

## 🐳 ၄။ Trivy Container Vulnerability Scanning

```bash
# Image တစ်ခုလုံးကို scan စစ်ဆေးခြင်း
trivy image nginx:latest

# CRITICAL နှင့် HIGH ပြဿနာများကိုသာ filter လုပ်ကြည့်ခြင်း
trivy image --severity HIGH,CRITICAL node:20-alpine

# CI/CD Pipeline တွင် CRITICAL တွေ့ပါက Exit Code 1 ဖြင့် Fail စေခြင်း
trivy image --exit-code 1 --severity CRITICAL my-app:v1.0.0
```

---

## 🔒 ၅။ Dockerfile Hardening Best Practices

```dockerfile
# Minimal Alpine Base & Non-Root User
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appgroup . .
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🐧 ၆။ Linux Server Hardening & Auditing

- SSH Hardening (`PermitRootLogin no`, `PasswordAuthentication no`)
- Lynis Security Auditing: `sudo lynis audit system --quick`

---

## 🔑 ၇။ Centralized Secrets Management with AWS Secrets Manager

```bash
aws secretsmanager create-secret \
    --name "production/ecommerce/database" \
    --description "Production DB credentials" \
    --secret-string '{"username":"dbadmin","password":"VerySecurePassword!"}'
```

---

## 🚀 ၈။ GitHub Actions Automated Security Gates

```yaml
name: DevSecOps Security Scan
on: [push, pull_request]
jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t my-app .
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'my-app'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
```

---

## 🔍 ၉။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ

```bash
gitleaks detect --verbose
trivy image --severity CRITICAL my-image:latest
sudo lynis audit system --quick | grep "Hardening index"
```

---

## 💼 ၁၀။ အင်တာဗျူး အမေးအဖြေများ

### မေးခွန်း: Shift-Left Security ဆိုတာ ဘာလဲ?
> "SDLC တွင် Security စစ်ဆေးမှုများကို Production ရောက်မှမဟုတ်ဘဲ Developer Code ရေးသည့် အစောဆုံး အဆင့်ဆီသို့ ဘယ်ဘက်သို့ ရွှေ့ပြောင်းထည့်သွင်းခြင်း ဖြစ်ပါသည်။"

---

## 📋 ၁၁။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့်

👉 **နောက်တစ်ဆင့်**: **[Module 13: Kubernetes & Container Orchestration](../13-kubernetes/README.md)**
