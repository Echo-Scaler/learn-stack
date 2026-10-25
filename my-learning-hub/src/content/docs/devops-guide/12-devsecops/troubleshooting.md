---
title: "DevSecOps Troubleshooting Guide"
description: "Resolving Gitleaks blocks, Trivy rate-limits, Non-root permission issues, and false positive CVEs (မြန်မာဘာသာ)"
---


> **လုပ်ငန်းခွင်သုံး DevSecOps၊ Trivy နှင့် Secret Scanning တွင် အဖြစ်များဆုံး ပြဿနာ ၅ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Non-Root User ပြောင်းလဲပြီးနောက် Container အတွင်း `Permission Denied` ဖြစ်ခြင်း

### လက္ခဏာ (Symptom):
```text
Error: EACCES: permission denied, open '/app/logs/app.log'
```

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
Container ကို `USER appuser` (Non-root) ဖြင့် run သော်လည်း `/app` directory ပိုင်ဆိုင်ခွင့် (Ownership) သည် `root` ဖြစ်နေဆဲ ဖြစ်ခြင်း။

### ဖြေရှင်းနည်း (Fix):
Dockerfile တွင် `chown -R` ဖြင့် ownership အားလုံးကို `appuser` ဆီသို့ ကြိုတင်လွှဲပြောင်းပေးပါ:
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
```

---

## 🚨 ပြဿနာ ၂: Gitleaks မှ Test Secret / Dummy Password ကို ဖမ်းမိပြီး Commit မရဖြစ်ခြင်း

### လက္ခဏာ (Symptom):
```text
[Gitleaks] Leak found in tests/mock_auth.py: Generic-API-Key
Commit rejected by pre-commit hook.
```

### ဖြေရှင်းနည်း (Fix):
Repository root တွင် `.gitleaksignore` ဖိုင် ဖန်တီးပြီး သက်ဆိုင်ရာ file path သို့မဟုတ် commit hash ကို ignore လုပ်ပေးပါ:
```text
# .gitleaksignore
tests/mock_auth.py
tests/fixtures/*
```

---

## 🚨 ပြဿနာ ၃: Trivy Vulnerability Database Update Rate-Limit ကျခြင်း

### လက္ခဏာ (Symptom):
```text
FATAL: init error: DB error: failed to download vulnerability DB: rate limit exceeded
```

### ဖြေရှင်းနည်း (Fix):
GitHub Actions သို့မဟုတ် local runner တွင် GitHub Token ကို pass ပေးပါ:
```bash
export GITHUB_TOKEN="ghp_YourGitHubPersonalAccessToken"
trivy image nginx:latest
```

---

## 🚨 ပြဿနာ ၄: Upstream Fix မရှိသေးသော CVEs များကြောင့် CI/CD Pipeline အမြဲ Fail နေခြင်း

### ဖြေရှင်းနည်း (Fix):
Patch မထွက်သေးသော vulnerabilities များကို ခေတ္တချန်လှပ်ရန် `--ignore-unfixed` flag ကို အသုံးပြုပါ:
```bash
trivy image --ignore-unfixed --severity CRITICAL my-app:latest
```
သို့မဟုတ် သီးသန့် `.trivyignore` ဖိုင်တွင် CVE ID ထည့်သွင်းထားပါ:
```text
# .trivyignore
CVE-2024-12345
```

---

## 🚨 ပြဿနာ ၅: GitHub Repository ပေါ်သို့ Secret အမှန်တကယ် Push မိသွားခြင်း (Emergency Recovery)

### ဖြေရှင်းနည်း (Fix):
1. **ချက်ချင်း Revoke လုပ်ပါ**: Git history ဖျက်ရုံဖြင့် မလုံလောက်ပါ၊ AWS Console သို့မဟုတ် Stripe Dashboard မှ အဆိုပါ Token/Key ကို စက္ကန့်ပိုင်းအတွင်း ချက်ချင်း Revoke/Delete ပြုလုပ်ပါ။
2. **`git-filter-repo` ဖြင့် History တစ်ခုလုံးမှ ရှင်းထုတ်ပါ**:
   ```bash
   git filter-repo --invert-paths --path-match "secrets.env"
   git push origin --force --all
   ```
