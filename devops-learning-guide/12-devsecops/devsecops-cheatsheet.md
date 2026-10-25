# 📋 DevSecOps & Hardening Cheatsheet

> **လုပ်ငန်းခွင်သုံး Trivy Vulnerability Scanner၊ Gitleaks၊ Linux Hardening နှင့် Secrets Management လက်စွဲ**

---

## ⚡ ၁။ Trivy Vulnerability Scanner Commands

| Command | ရည်ရွယ်ချက် |
|---|---|
| `trivy image nginx:latest` | Container image တစ်ခုလုံးကို CVE scan ဖတ်ခြင်း |
| `trivy image --severity HIGH,CRITICAL node:20` | High နှင့် Critical အဆင့်များကိုသာ စစ်ဆေးခြင်း |
| `trivy image --ignore-unfixed my-app:latest` | Fix မရှိသေးသော CVE များကို ချန်လှပ်၍ scan ဖတ်ခြင်း |
| `trivy image --exit-code 1 --severity CRITICAL my-app:latest` | Critical တွေ့ပါက exit code 1 ထုတ်ပေးခြင်း (CI/CD Gates) |
| `trivy fs /path/to/project` | Local filesystem / dependencies (`package-lock.json`) ကို scan ဖတ်ခြင်း |
| `trivy config ./terraform/` | Terraform / Dockerfile / K8s manifests code များမှ misconfigurations စစ်ဆေးခြင်း |

---

## 🔑 ၂။ Gitleaks Secret Detection Commands

```bash
gitleaks detect --source . --verbose
gitleaks protect --staged --verbose
```

---

## 🐧 ၃။ Linux Server Hardening & Lynis Audit

```bash
sudo lynis audit system --quick
sudo ss -tulpn
```

---

## 🔐 ၄။ AWS Secrets Manager CLI Reference

```bash
aws secretsmanager get-secret-value --secret-id "prod/app/db" --query SecretString --output text
```
