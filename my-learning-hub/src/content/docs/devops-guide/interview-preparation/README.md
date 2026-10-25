---
title: "DevOps Technical Interview Preparation"
description: "Top 25 Scenario-Based DevOps Engineer Technical Interview Questions & Model Answers (မြန်မာဘာသာ)"
---

> **လုပ်ငန်းခွင်သုံး Scenario-Based DevOps & Cloud Engineer အင်တာဗျူး မေးခွန်းများနှင့် အကောင်းဆုံး ဖြေဆိုနည်း နမူနာများ**

---

## 💡 အင်တာဗျူး ဖြေဆိုရာတွင် အဓိက သတိပြုရမည့် အချက် (STAR Method)
Scenario မေးခွန်းများ ဖြေဆိုရာတွင် **STAR Method** (Situation ➜ Task ➜ Action ➜ Result) ဖြင့် ဖြေဆိုပါ:
- **Situation (အခြေအနေ)**: မည်သည့် ပြဿနာ သို့မဟုတ် အခင်းအကျင်း ကြုံတွေ့ခဲ့ရသနည်း။
- **Task (တာဝန်)**: သင် မည်သည့် ရည်မှန်းချက်ကို ပြီးမြောက်အောင် လုပ်ဆောင်ရမည်နည်း။
- **Action (လုပ်ဆောင်ချက်)**: သင် မည်သည့် Tools/Command/Architecture ကို အသုံးပြု၍ ဖြေရှင်းခဲ့သနည်း။
- **Result (ရလဒ်)**: တိကျသော ကိန်းဂဏန်း ရလဒ် (ဥပမာ "Downtime ကို မိနစ် ၄၀ မှ ၅ မိနစ်သို့ လျှော့ချနိုင်ခဲ့သည်")။

---

## ❓ မေးခွန်း ၁: "Website မတက်ပါ (502 Bad Gateway) ဟု Customer Support မှ လာပြောပါက သင် မည်သို့ စတင် စုံစမ်းစစ်ဆေးမည်နည်း?"
### 💡 အကောင်းဆုံး အဖြေ (Model Answer):
> "ကျွန်တော် အဆင့် ၄ ဆင့်ဖြင့် စနစ်တကျ စုံစမ်းပါမည်:
> 
> ၁။ **External Verification**: Browser သို့မဟုတ် `curl -Iv https://example.com` ဖြင့် SSL, HTTP Response Code နှင့် Response Time ကို ပြင်ပမှ စစ်ဆေးပါမည်။
> 
> ၂။ **Load Balancer & Reverse Proxy Logs**: Nginx သို့မဟုတ် ALB ၏ error log (`/var/log/nginx/error.log`) ကို ကြည့်ပြီး Upstream backend သို့ ဆက်သွယ်၍ မရခြင်း (Connection Refused သို့မဟုတ် Timeout) ဟုတ်မဟုတ် စစ်ပါမည်။
> 
> ၃။ **Backend Server & Process**: App server အတွင်းသို့ ဝင်ရောက်ပြီး `ss -tulpn` ဖြင့် application port (ဥပမာ 3000/8080) အလုပ်လုပ်နေဆဲ ဟုတ်မဟုတ်၊ `systemctl status my-app` သို့မဟုတ် `docker ps` ဖြင့် container အခြေအနေကို စစ်ဆေးပါမည်။
> 
> ၄။ **System Resources & OOM**: `free -m`, `df -h`, `journalctl -xe` ဖြင့် Memory ပြည့်၍ Out-Of-Memory (OOM Killer) ကြောင့် backend process သေဆုံးသွားခြင်း ဟုတ်မဟုတ် စစ်ဆေးပြီး အမြန်ဆုံး restart ချကာ root cause ကို log များမှ ဖော်ထုတ်ဖြေရှင်းပါမည်။"

---

## ❓ မေးခွန်း ၂: "Terraform ဖြင့် Infrastructure ဆောက်ရာတွင် State File လုံခြုံရေးကို မည်သို့ စီမံထားသနည်း?"
### 💡 အကောင်းဆုံး အဖြေ (Model Answer):
> "Terraform State file တွင် Database passwords နှင့် infrastructure ဖွဲ့စည်းပုံ အားလုံး ပါဝင်နေသဖြင့် ကျွန်တော်တို့သည် Local disk ပေါ်တွင် လုံးဝ မထားရှိဘဲ:
> 
> ၁။ **Remote Backend**: AWS S3 bucket တွင် ဗဟိုပြု သိမ်းဆည်းပါသည်။
> ၂။ **Encryption at Rest**: S3 Bucket တွင် AWS KMS Key ဖြင့် AES-256 Server-Side Encryption အမြဲ ဖွင့်ထားပါသည်။
> 3။ **State Locking with DynamoDB**: အင်ဂျင်နီယာ ၂ ဦးမှ တပြိုင်နက် `terraform apply` လုပ်၍ state file ပျက်စီးခြင်းမှ ကာကွယ်ရန် DynamoDB table ဖြင့် Distributed Locking စနစ် တပ်ဆင်ထားပါသည်။
> ၄။ **Least Privilege**: State file ရှိသော S3 bucket သို့ CI/CD IAM Role နှင့် DevOps admin မှလွဲ၍ မည်သူမျှ ဝင်ရောက်ခွင့်မရအောင် IAM Bucket Policy ဖြင့် တင်းကြပ်စွာ ကန့်သတ်ထားပါသည်။"

---

## ❓ မေးခွန်း ၃: "Developer တစ်ဦးသည် AWS Access Key ပါသွားသော Commit ကို GitHub Public Repo သို့ Push လုပ်မိပါက သင် ဘာလုပ်မည်နည်း?"
### 💡 အကောင်းဆုံး အဖြေ (Model Answer):
> "အရေးပေါ် အဆင့် ၃ ဆင့်ကို စက္ကန့်ပိုင်းအတွင်း ဆောင်ရွက်ပါမည်:
> 
> ၁။ **Immediate Key Revocation**: Git history ဖျက်မနေမီ AWS IAM Console သို့မဟုတ် AWS CLI ဖြင့် အဆိုပါ ပေါက်ကြားသွားသော Access Key ကို **ချက်ချင်း Deactivate သို့မဟုတ် Delete ပြုလုပ်ပါမည်** (အဘယ်ကြောင့်ဆိုသော် Hacker Bot များသည် စက္ကန့်ပိုင်းအတွင်း ဖမ်းယူပြီး crypto mining EC2 များ အမြောက်အများ ဆောက်လုပ်တတ်သောကြောင့် ဖြစ်ပါသည်)။
> 
> ၂။ **CloudTrail Audit**: AWS CloudTrail ကို စစ်ဆေးပြီး ထို key ကို အသုံးပြု၍ မည်သည့် resources များ မသမာသူမှ ဆောက်လုပ်ထားခြင်း ရှိမရှိ စစ်ဆေးပြီး ဖျက်ဆီးပါမည်။
> 
> ၃။ **Git History Cleanup & Prevention**: Local repo တွင် `git-filter-repo` ဖြင့် commit history တစ်ခုလုံးမှ သုတ်သင်ပြီး force-push လုပ်ပါမည်။ အနာဂတ်တွင် ထပ်မံမဖြစ်စေရန် CI/CD တွင် **Gitleaks** scanner တပ်ဆင်ပြီး Developer စက်တိုင်းတွင် pre-commit hooks ထည့်သွင်းပေးပါမည်။"

---

## ❓ မေးခွန်း ၄: "Docker Multi-Stage Build ကို ဘာကြောင့် သုံးသင့်သလဲ?"
### 💡 အကောင်းဆုံး အဖြေ (Model Answer):
> "အဓိက အကျိုးကျေးဇူး ၂ ချက် ရှိပါသည်:
> 
> ၁။ **Image Size ချုံ့နိုင်ခြင်း**: Code compile လုပ်ရန် လိုအပ်သော SDKs, Build Tools (ဥပမာ GCC, Maven, Node devDependencies) များကို Builder Stage တွင်သာ ထားရှိပြီး၊ နောက်ဆုံး Final Runtime Image ထဲသို့ တိုက်ရိုက် compile ပြီးသား binary သို့မဟုတ် production assets များကိုသာ ကူးယူသဖြင့် Image size ကို 1GB မှ 50MB အောက်သို့ ၉၀% ကျော် ချုံ့နိုင်ပါသည်။
> 
> ၂။ **Security (တိုက်ခိုက်ခံရနိုင်ခြေ နည်းပါးခြင်း)**: Final image တွင် compilers, package managers (curl, wget) များ မပါဝင်တော့သဖြင့် Vulnerability မျက်နှာပြင် (Attack Surface) ကို အလွန် သေးငယ်သွားစေပြီး CVE scanners (Trivy) များတွင် Clean ဖြစ်စေပါသည်။"

---

## ❓ မေးခွန်း ၅: "Kubernetes တွင် Zero-Downtime Deployment ကို မည်သို့ အာမခံသနည်း?"
### 💡 အကောင်းဆုံး အဖြေ (Model Answer):
> "အချက် ၃ ချက်ဖြင့် အာမခံပါသည်:
> 
> ၁။ **RollingUpdate Strategy**: Deployment spec တွင် `maxUnavailable: 0` နှင့် `maxSurge: 1` သတ်မှတ်ထားခြင်းဖြင့် Pod အသစ်တစ်ခု အပြည့်အဝ အဆင်သင့် မဖြစ်မချင်း Pod အဟောင်းကို မဖျက်ဆီးစေပါ။
> 
> ၂။ **Readiness Probe**: Application သည် Database နှင့် အပြည့်အဝ ချိတ်ဆက်ပြီးမှသာ Pod အသစ်ကို Ready ဟု သတ်မှတ်စေပြီး Service Load Balancer သို့ traffic လွှဲပေးစေပါသည်။
> 
> ၃။ **Graceful Shutdown**: Pod အဟောင်းကို သတ်သည့်အခါ လက်ကျန် requests များကို အပြီးတိုင် လုပ်ဆောင်နိုင်စေရန် `preStop` hook (ဥပမာ `sleep 10`) နှင့် `terminationGracePeriodSeconds` ကို သင့်လျော်စွာ သတ်မှတ်ထားပါသည်။"
