---
title: "DevSecOps & Hardening Cheatsheet"
description: "Quick reference for Trivy, Gitleaks, Lynis, SSH hardening, and AWS Secrets Manager commands"
---


> **လုပ်ငန်းခွင်သုံး Trivy Vulnerability Scanner၊ Gitleaks၊ Linux Hardening နှင့် Secrets Management လက်စွဲ**

---

## ⚡ ၁။ Trivy Vulnerability Scanner Commands

| Command | ရည်ရွယ်ချက် |
|---|---|
| `trivy image nginx:latest` | Container image တစ်ခုလုံးကို CVE scan ဖတ်ခြင်း |
| `trivy image --severity HIGH,CRITICAL node:20` | High နှင့် Critical အဆင့်များကိုသာ စစ်ဆေးခြင်း |
| `trivy image --ignore-unfixed my-app:latest` | Fix မရှိသေးသော CVE များကို ချန်လှပ်၍ scan ဖတ်ခြင်း |
| `trivy image --exit-code 1 --severity CRITICAL my-app:latest` | Critical တွေ့ပါက exit code 1 ထုတ်ပေးခြင်း (CI/CD Gates) |
| `trivy fs /path/to/project` | Local filesystem / dependencies (`package-lock.json`, `pom.xml`) ကို scan ဖတ်ခြင်း |
| `trivy repo https://github.com/org/repo` | Remote Git repository ကို တိုက်ရိုက် scan ဖတ်ခြင်း |
| `trivy config ./terraform/` | Terraform / Dockerfile / K8s manifests code များမှ misconfigurations စစ်ဆေးခြင်း |

---

## 🔑 ၂။ Gitleaks Secret Detection Commands

| Command | ရှင်းလင်းချက် |
|---|---|
| `gitleaks detect --source . --verbose` | လက်ရှိ Git repo ၏ Commit History အားလုံးတွင် secrets စစ်ဆေးခြင်း |
| `gitleaks protect --staged --verbose` | Git staged files (`git add` လုပ်ထားသော files) တွင် secrets စစ်ဆေးခြင်း |
| `gitleaks detect --log-opts="-n 10"` | နောက်ဆုံး commit ၁၀ ခုကိုသာ scan ဖတ်ခြင်း |
| `gitleaks dir /path/to/dir` | Git repo မဟုတ်သော folder အတွင်း secrets ရှာဖွေခြင်း |

---

## 🐧 ၃။ Linux Server Hardening & Lynis Audit

```bash
# Lynis System Security Audit
sudo lynis audit system --quick

# Lynis သီးသန့် အပိုင်း စစ်ဆေးခြင်း
sudo lynis audit system --tests-category security

# Open Ports အားလုံး စစ်ဆေးခြင်း
sudo ss -tulpn

# UFW Firewall Baseline
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔐 ၄။ AWS Secrets Manager CLI Reference

```bash
# Secret အသစ် ဖန်တီးခြင်း
aws secretsmanager create-secret \
    --name "prod/app/db" \
    --secret-string '{"username":"admin","password":"StrongPassword123!"}'

# Secret တန်ဖိုး ရယူခြင်း
aws secretsmanager get-secret-value \
    --secret-id "prod/app/db" \
    --query SecretString \
    --output text

# Secret တန်ဖိုး ပြင်ဆင်ခြင်း
aws secretsmanager update-secret \
    --secret-id "prod/app/db" \
    --secret-string '{"username":"admin","password":"NewPassword456!"}'
```
