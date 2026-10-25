# 🎯 DevOps Technical Interview Preparation (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်သုံး Scenario-Based DevOps & Cloud Engineer အင်တာဗျူး မေးခွန်းများနှင့် အကောင်းဆုံး ဖြေဆိုနည်း နမူနာများ**

---

## 💡 STAR Method
- **Situation**: မည်သည့် အခင်းအကျင်း ကြုံတွေ့ခဲ့သနည်း
- **Task**: မည်သည့် တာဝန် ပြီးမြောက်အောင် လုပ်ရမည်နည်း
- **Action**: မည်သို့ ဖြေရှင်းခဲ့သနည်း
- **Result**: တိကျသော ကိန်းဂဏန်း ရလဒ်

---

## ❓ မေးခွန်း ၁: "Website မတက်ပါ (502 Bad Gateway) ဟု Customer Support မှ လာပြောပါက သင် မည်သို့ စတင် စုံစမ်းစစ်ဆေးမည်နည်း?"
- External Verification (`curl -Iv https://example.com`)
- Nginx / ALB Error Log စစ်ဆေးခြင်း
- App Server port (`ss -tulpn`) နှင့် process စစ်ဆေးခြင်း
- System Memory & OOM Killer (`journalctl -xe`, `free -m`) စစ်ဆေးခြင်း

---

## ❓ မေးခွန်း ၂: "Terraform ဖြင့် Infrastructure ဆောက်ရာတွင် State File လုံခြုံရေးကို မည်သို့ စီမံထားသနည်း?"
- Remote S3 Backend + KMS Server-Side Encryption
- DynamoDB State Locking (Race condition ကာကွယ်ခြင်း)
- IAM Least Privilege Policies

---

## ❓ မေးခွန်း ၃: "AWS Access Key ပါသွားသော Commit ကို GitHub သို့ Push မိပါက ဘာလုပ်မည်နည်း?"
1. AWS IAM Console မှ Key ကို **ချက်ချင်း Deactivate/Delete လုပ်ပါ** (အရေးအကြီးဆုံး)။
2. CloudTrail ဖြင့် မသမာသော လှုပ်ရှားမှု ရှိမရှိ စစ်ဆေးပါ။
3. `git-filter-repo` ဖြင့် History မှ သုတ်သင်ပြီး CI/CD တွင် Gitleaks တပ်ဆင်ပါ။

---

## ❓ မေးခွန်း ၄: "Docker Multi-Stage Build ကို ဘာကြောင့် သုံးသင့်သလဲ?"
- Image Size ၉၀% ချုံ့နိုင်ခြင်း
- Build tools များ မပါဝင်တော့သဖြင့် Attack Surface ကျဉ်းသွားပြီး လုံခြုံမှု မြင့်မားခြင်း

---

## ❓ မေးခွန်း ၅: "Kubernetes တွင် Zero-Downtime Deployment ကို မည်သို့ အာမခံသနည်း?"
- `RollingUpdate` Strategy (`maxUnavailable: 0`)
- `readinessProbe` ဖြင့် Healthcheck စစ်ပြီးမှ Traffic လွှဲခြင်း
- `preStop` hook နှင့် Graceful Termination
