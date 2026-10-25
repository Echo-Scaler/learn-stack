# 🛠️ DevSecOps Troubleshooting Guide (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်သုံး DevSecOps၊ Trivy နှင့် Secret Scanning တွင် အဖြစ်များဆုံး ပြဿနာ ၅ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Non-Root User ပြောင်းလဲပြီးနောက် Container အတွင်း `Permission Denied` ဖြစ်ခြင်း
Dockerfile တွင် `chown -R` ဖြင့် ownership အားလုံးကို `appuser` သို့ ကြိုတင်လွှဲပြောင်းပေးပါ:
```dockerfile
COPY --chown=appuser:appgroup . .
USER appuser
```

---

## 🚨 ပြဿနာ ၂: Gitleaks မှ Dummy Password ကို ဖမ်းမိခြင်း
`.gitleaksignore` ဖိုင်တွင် ထည့်သွင်းပေးပါ:
```text
tests/mock_auth.py
```

---

## 🚨 ပြဿနာ ၃: Trivy DB Rate-Limit ကျခြင်း
`export GITHUB_TOKEN="ghp_xxx"` သတ်မှတ်ပေးပါ။

---

## 🚨 ပြဿနာ ၄: Upstream Fix မရှိသေးသော CVEs များ
`trivy image --ignore-unfixed --severity CRITICAL my-app:latest`

---

## 🚨 ပြဿနာ ၅: Secret Push မိသွားခြင်း (Emergency Protocol)
1. Token/Key ကို AWS Console / Provider မှ ချက်ချင်း Revoke လုပ်ပါ။
2. `git-filter-repo` ဖြင့် Git History တစ်ခုလုံးမှ သုတ်သင်ပြီး force-push လုပ်ပါ။
