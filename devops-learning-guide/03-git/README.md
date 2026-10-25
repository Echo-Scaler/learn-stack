---
title: "Module 03: Git & Collaboration for DevOps Engineers"
description: "Git Architecture, Branching Strategies, Interactive Rebase, Secret Leak Prevention & Disaster Recovery Mastery (Burmese & English)"
---

# 🐙 Module 03: Git & Collaboration for DevOps Engineers

> **Beginner မှ Production DevOps အဆင့်သို့: Git ၏ အတွင်းပိုင်းဖွဲ့စည်းပုံ၊ Rebase Mastery၊ Merge Conflicts ဖြေရှင်းနည်းနှင့် Secret Leaks အရေးပေါ် ဖယ်ရှားရေး လက်စွဲ**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Git Architecture, Branching Strategies, Interactive Rebase, Secret Leak Prevention & Disaster Recovery Mastery**
- **Track Level**: Core Foundation (အခြေခံအုတ်မြစ်)
- **Target Audience**: DevOps Engineers, Cloud Administrators, Software Developers
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **Git Internal Architecture**: Working Tree, Staging Area (Index), Local Repository (.git) နှင့် Remote Repository တို့၏ အလုပ်လုပ်ပုံကို တိကျစွာ ခွဲခြားသိရှိခြင်း။
* [x] **Branching Strategies**: GitHub Flow, GitFlow နှင့် Trunk-Based Development တို့၏ အားသာချက်/အားနည်းချက်များကို နားလည်ပြီး CI/CD အတွက် အကောင်းဆုံး ရွေးချယ်နိုင်ခြင်း။
* [x] **Rebase vs Merge**: `git merge` နှင့် `git rebase` ကွာခြားချက်ကို ရှင်းလင်းစွာ သဘောပေါက်ပြီး Interactive Rebase (`git rebase -i`) ဖြင့် messy commits များကို သပ်ရပ်စွာ squash ပြုလုပ်နိုင်ခြင်း။
* [x] **Merge Conflict Resolution**: အဖွဲ့လိုက် လုပ်ဆောင်ရာတွင် ဖြစ်ပွားလေ့ရှိသော Merge conflicts များကို markers များဖတ်ပြီး ယုံကြည်မှုရှိရှိ ရှင်းလင်းနိုင်ခြင်း။
* [x] **Semantic Versioning & Releases**: `vMAJOR.MINOR.PATCH` (SemVer) စံနှုန်းဖြင့် Git Release Tags ထုတ်ပြီး Automated CI/CD triggers များ ပြုလုပ်နိုင်ခြင်း။
* [x] **Secret Leak Remediation**: AWS Access Keys, Passwords များ Git history ထဲသို့ မတော်တဆ ပါသွားပါက `git-filter-repo` ဖြင့် အပြီးတိုင် ရှင်းထုတ်နိုင်ခြင်း။
* [x] **Disaster Recovery with reflog**: `git reset --hard` ကြောင့် ပျောက်သွားသော commits သို့မဟုတ် မှားဖျက်မိသော branches များကို `git reflog` ဖြင့် ၁၀၀% ပြန်လည် ကယ်တင်နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 01: Linux Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/01-linux/README.md) — Terminal CLI navigation နှင့် basic file commands များကို တတ်မြောက်ထားခြင်း။
2. [Module 02: Networking Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/02-networking/README.md) — SSH keys (`~/.ssh/id_rsa.pub`) ဖြင့် GitHub သို့ authenticated ချိတ်ဆက်မှု အခြေခံ နားလည်ထားခြင်း။
3. **GitHub Account**: Public/Private repository စမ်းသပ်ရန် အခမဲ့ GitHub အကောင့် အဆင်သင့်ရှိခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Working Tree vs Index vs Commit** | ဖိုင်ပြင်ဆင်နေသော နေရာ (Working Tree)၊ စင်တင်ထားသော နေရာ (Staging/Index) နှင့် အတည်ပြုသိမ်းထားသော သမိုင်းမှတ်တမ်း (Commit) | Commit မတင်မီ ဘယ်ဖိုင်တွေ အပြောင်းအလဲဖြစ်နေသည်ကို တိကျစွာ ထိန်းကျောင်းရန် မရှိမဖြစ် သိရမည်။ | `git status`, `git add .`, `git commit -m "..."` |
| **Interactive Rebase (`rebase -i`)** | Branch တစ်ခုရှိ Commits အများအပြားကို ပြန်လည်တည်းဖြတ်ခြင်း၊ ပေါင်းစည်းခြင်း (Squash) သို့မဟုတ် ဖျက်ထုတ်ခြင်း | Main branch သို့ မရောက်မီ messy commit များ (ဥပမာ- "fix typo", "test again") ကို professional commit တစ်ခုတည်းအဖြစ် သပ်ရပ်စေသည်။ | `git rebase -i HEAD~4` |
| **Merge Conflict** | မတူညီသော Branches (၂) ခုမှ တူညီသော ဖိုင်၏ တူညီသော နေရာကို မတူညီသော ကုဒ်များ ပြင်ဆင်ထားသဖြင့် Git မှ အလိုအလျောက် မပေါင်းစည်းနိုင်ဘဲ ရပ်တန့်သွားခြင်း | Team ပူးပေါင်းလုပ်ဆောင်ရာတွင် အမြဲကြုံတွေ့ရပြီး CI/CD pipeline ပျက်စီးမသွားစေရန် လက်ဖြင့် သေချာ စိစစ်ရှင်းလင်းရသည်။ | `<<<<<<< HEAD` vs `>>>>>>> feature` |
| **Semantic Versioning (SemVer)** | Software Releases များကို `MAJOR.MINOR.PATCH` (e.g. `v2.4.1`) စံနှုန်းဖြင့် စနစ်တကျ ဗားရှင်းသတ်မှတ်ခြင်း | Docker Images, Helm Charts နှင့် Terraform Modules များ၏ Version ထိန်းသိမ်းရာတွင် အခြေခံ အုတ်မြစ် ဖြစ်သည်။ | Breaking Change: `v3.0.0`, New Feature: `v2.5.0`, Bug Fix: `v2.4.2` |
| **`git reflog`** | Git တွင် ပြုလုပ်ခဲ့သော `checkout`, `commit`, `rebase`, `reset` စသည့် လှုပ်ရှားမှုတိုင်း၏ HEAD ရွှေ့လျားမှု မှတ်တမ်း | Branch မှားဖျက်မိခြင်း သို့မဟုတ် `git reset --hard` ကြောင့် ကုဒ်များ ပျောက်သွားသည့်အခါ ပြန်လည်ကယ်တင်နိုင်သော အသက်ကယ် တူးလ် ဖြစ်သည်။ | `git reflog` ➜ `git reset --hard HEAD@{2}` |
| **Secret Leak** | AWS Keys, Database Passwords, API Tokens များကို `.gitignore` မလုပ်မိဘဲ Git Repository ထဲသို့ commit တင်မိခြင်း | Hackers များ၏ automated bot များမှ မိနစ်ပိုင်းအတွင်း ဖမ်းယူကာ ဒေါ်လာ ထောင်သောင်းချီ Cloud bills တက်စေနိုင်သော အဆိုးရွားဆုံး အမှား ဖြစ်သည်။ | Pre-commit hook ဖြင့် `git-secrets` သို့မဟုတ် `trufflehog` သုံး၍ ကာကွယ်ခြင်း။ |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ Git ၏ အဆင့် (၄) ဆင့် ဖွဲ့စည်းပုံ (The 4 Stages of Git)

```text
┌──────────────────┐       `git add`       ┌──────────────────┐
│   Working Tree   │ ────────────────────► │   Staging Area   │
│ (Modified Files) │                       │     (Index)      │
└──────────────────┘                       └──────────────────┘
         ▲                                           │
         │ `git restore`                             │ `git commit`
         │                                           ▼
┌──────────────────┐       `git push`      ┌──────────────────┐
│   Remote Repo    │ ◄──────────────────── │ Local Repository │
│ (GitHub/GitLab)  │                       │ (.git directory) │
└──────────────────┘      `git pull/fetch` └──────────────────┘
```

### ၅.၂ Branching Strategies နှိုင်းယှဉ်ချက် (DevOps Perspectives)

1. **GitHub Flow (DevOps CI/CD အတွက် အကြံပြုပါသည်)**:
   - Branch အဓိက (၁) ခုတည်းသာ ထားရှိသည်: `main` (Production-ready အမြဲ ဖြစ်နေရမည်)။
   - Feature တိုင်းအတွက် Short-lived feature branch ဖောက်သည် (`feature/payment-api`)။
   - Pull Request (PR) တင်သည် ➜ Automated CI Tests ပြေးသည် ➜ Merge သည် ➜ Production သို့ CD အလိုအလျောက် Deploy ဖြစ်သည်။
2. **Trunk-Based Development (Enterprise Velocity)**:
   - Developer အားလုံးသည် `main` (Trunk) သို့ နေ့စဉ် အကြိမ်ကြိမ် ပေါင်းထည့်သည်။ Long-lived branches မရှိဘဲ Feature Flags များဖြင့် ထိန်းချုပ်သည်။
3. **GitFlow (Traditional)**:
   - `main`, `develop`, `release/*`, `hotfix/*` စသည်ဖြင့် branch များစွာ ခွဲခြားသဖြင့် CI/CD တွင် overhead များပြားသည်။

### ၅.၃ `git merge` vs `git rebase`

```text
[ Feature Branch Rebase Flow: Linear History ]
Base Branch (main):     A ─── B ─── C ─── D
                               \           \
Feature Branch:                 E ─── F ──► E' ─── F' (သန့်ရှင်းသော မျဉ်းဖြောင့်သမိုင်း)

[ Feature Branch Merge Flow: Non-linear with Merge Commit ]
Base Branch (main):     A ─── B ─── C ─── D ─── M (Merge Commit)
                               \               /
Feature Branch:                 E ──────────── F
```

> **ရွှေရောင် စည်းမျဉ်း (Golden Rule of Rebase):**  
> အခြားသူများနှင့် ဝေမျှထားသော Public/Shared branch (ဥပမာ- `main` သို့မဟုတ် `develop`) ပေါ်တွင် မည်သည့်အခါမျှ Rebase မလုပ်ရပါ။ မိမိ local စက်ရှိ private feature branch ပေါ်တွင်သာ သုံးရမည်။

---

## 🌟 ၆။ Why This Matters in Real DevOps Work (လုပ်ငန်းခွင် လက်တွေ့ တန်ဖိုး)

1. **Infrastructure as Code (IaC) Collaboration**: Terraform ဖိုင်များကို အင်ဂျင်နီယာ ၅ ဦး ပြိုင်တူ ရေးသားရာတွင် Branching စနစ် မရှိပါက `terraform.tfstate` ပျက်စီးပြီး Production Cloud တစ်ခုလုံး downtime ဖြစ်နိုင်သည်။
2. **Automated CI/CD Triggering**: `git tag v1.2.0` ထုတ်လိုက်သည်နှင့် GitHub Actions မှ အလိုအလျောက် နားထောင်၍ Docker Image build ကာ Production Server သို့ တင်ပေးနိုင်ခြင်း။
3. **Audit Trail & Rollback**: Production ပျက်သွားပါက `git bisect` သို့မဟုတ် `git log` ဖြင့် မည်သည့် commit၊ မည်သူ့ကုဒ်ကြောင့် ဖြစ်သွားသည်ကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေနိုင်ပြီး `git revert` ဖြင့် ချက်ချင်း rollback ချနိုင်ခြင်း။

---

## 💻 ၇။ Step-by-Step Hands-on Commands (လက်တွေ့ လေ့ကျင့်ရန် Commands များ)

### အဆင့် ၁: Local Repository တည်ဆောက်ခြင်းနှင့် စတင်ခြင်း
```bash
# Lab folder ဆောက်ပြီး git စတင် အသက်သွင်းခြင်း
mkdir -p /tmp/git-mastery-lab && cd /tmp/git-mastery-lab
git init -b main

# Git identity သတ်မှတ်ခြင်း
git config user.name "DevOps Engineer"
git config user.email "devops@company.local"

# မလိုလားအပ်သော ဖိုင်များအတွက် .gitignore ရေးသားခြင်း
cat << 'EOF' > .gitignore
.env
*.log
node_modules/
vendor/
.DS_Store
EOF

git add .gitignore
git commit -m "chore: initial commit with gitignore"
```

### အဆင့် ၂: Feature Branch နှင့် Workflows
```bash
# Feature branch အသစ် ဖောက်ပြီး ပြောင်းရွှေ့ခြင်း (Modern switch command)
git switch -c feature/payment-gateway

# Feature ကုဒ် ထည့်သွင်းခြင်း
echo "function processPayment() { return true; }" > payment.js
git add payment.js
git commit -m "feat: implement payment gateway handler"

# Main branch သို့ ပြန်လှည့်ခြင်း
git switch main
```

### အဆင့် ၃: Interactive Rebase (`git rebase -i`) ဖြင့် Messy Commits များကို Clean ပြုလုပ်ခြင်း
```bash
# နောက်ဆုံး commit ၃ ခုကို interactive ပြင်ဆင်ရန်
git rebase -i HEAD~3
```
Editor ပွင့်လာပါက အောက်ပါအတိုင်း commands များကို ပြင်ဆင်နိုင်ပါသည်:
```text
pick 1a2b3c4 feat: add database migration
squash 5e6f7g8 fix typo in migration
squash 9h0i1j2 add missing index
```
- `pick`: Commit ကို မူလအတိုင်း ထားရှိသည်။
- `squash` (သို့မဟုတ် `s`): အထက်ပါ commit နှင့် ပေါင်းစည်းပစ်ပြီး commit message အသစ် ရေးသားစေသည်။

### အဆင့် ၄: Semantic Versioning Tagging
```bash
# Annotated tag (DevOps Releases များအတွက် အကြံပြုပါသည်)
git tag -a v1.1.0 -m "Release v1.1.0: Add Stripe payment integration"

# Tag အားလုံး ကြည့်ရှုခြင်း
git tag -n
```

---

## 🔀 ၈။ Merge Conflict Resolution Walkthrough (Merge Conflict ဖြေရှင်းနည်း လက်တွေ့)

Merge conflict ဖြစ်ပွားပုံ ဥပမာ:
```text
<<<<<<< HEAD (Current Change - main branch)
const API_URL = "https://api.production.com";
=======
const API_URL = "https://api.v2.production.com";
>>>>>>> feature/api-upgrade (Incoming Change)
```

### ဖြေရှင်းသည့် အဆင့်ဆင့်:
1. `git status` ဖြင့် Conflict ဖြစ်နေသော ဖိုင်များကို ရှာပါ။
2. အဆိုပါ ဖိုင်ကို Editor ဖြင့် ဖွင့်ပြီး `<<<<<<<`, `=======`, `>>>>>>>` marker များကို ဖယ်ရှားကာ လိုချင်သော ကုဒ်အမှန်ကိုသာ ချန်ထားပါ။
3. ဖိုင်ကို သိမ်းဆည်းပြီး Staging Area သို့ ထည့်ပါ:
   ```bash
   git add <resolved-file>
   ```
4. Merge (သို့မဟုတ် Rebase) ကို ဆက်လက် အဆုံးသတ်ပါ:
   ```bash
   git commit -m "fix: resolve API_URL merge conflict"
   # သို့မဟုတ် rebase လုပ်နေစဉ်ဖြစ်ပါက:
   # git rebase --continue
   ```

---

## 🛡️ ၉။ Accidental Secret Leak Prevention & Emergency Removal (လျှို့ဝှက်ချက် ပါသွားပါက ဖယ်ရှားနည်း)

> [!CAUTION]
> **အရေးကြီးသော လုံခြုံရေး သတိပေးချက်**:
> AWS Access Key သို့မဟုတ် Private Key တစ်ခုသည် GitHub Public Repo သို့ ရောက်သွားပါက အသစ် commit ရေးပြီး ဖျက်လိုက်ရုံဖြင့် မလုံခြုံပါ (Git History ထဲတွင် ကျန်ရှိနေပါသည်)။ အရေးပေါ် အဆင့် (၂) ခု ပြုလုပ်ရမည်:
> 1. AWS Console သို့ ချက်ချင်းသွားပြီး အဆိုပါ Key ကို **Deactivate / Delete (Revoke)** ချက်ချင်း လုပ်ပါ။
> 2. Git History ထဲမှ အပြီးတိုင် ဖယ်ရှားရန် `git-filter-repo` ကို သုံးပါ။

```bash
# သီးခြား secret ဖိုင်တစ်ခုကို Git history အားလုံးမှ အပြီးတိုင် သုတ်သင်ခြင်း
git filter-repo --path config/secrets.env --invert-paths --force

# သို့မဟုတ် text pattern (AWS key string) ကို history တစ်ခုလုံးမှ အစားထိုးဖျက်ထုတ်ခြင်း
git filter-repo --replace-text <(echo "AKIAIOSFODNN7EXAMPLE==>REDACTED") --force
```

---

## ⚠️ ၁၀။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **You are in 'detached HEAD' state** | Branch မဟုတ်ဘဲ သီးခြား commit hash တစ်ခုဆီသို့ `checkout` လုပ်ထားမိခြင်း | Branch အသစ် ဖောက်၍ ကယ်တင်ပါ: `git switch -c new-branch-name` သို့မဟုတ် main သို့ ပြန်လှည့်ပါ: `git switch main`။ |
| **Updates were rejected because remote contains work** | Remote repository ပေါ်တွင် အခြားသူတစ်ဦးမှ commit တင်ထားပြီး မိမိစက်တွင် မရှိသေးခြင်း | `git pull --rebase origin main` ပြုလုပ်ပြီးမှ `git push` ပြန်လုပ်ပါ။ |
| **Accidental `git reset --hard`** | ရေးလက်စ code များနှင့် commits များ အကုန် ပျောက်ဆုံးသွားခြင်း | `git reflog` ကို run ပါ။ ပျောက်သွားသော commit hash ကို ရှာပြီး `git reset --hard HEAD@{n}` သို့မဟုတ် `git checkout -b recovered <HASH>` ဖြင့် ကယ်တင်ပါ။ |

---

## 🏋️ ၁၁။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Simulated Disaster Recovery with `git reflog`**
1. Repository တစ်ခုတွင် `secret-feature.txt` ဖိုင်ဆောက်ပြီး commit တင်ပါ (`feat: important work`)။
2. အဆိုပါ commit hash ကို မှတ်သားထားပါ။
3. မတော်တဆ အမှားဖြစ်ဟန်ဆောင်ပြီး `git reset --hard HEAD~1` ဖြင့် ယခင် commit သို့ ပြန်ဆုတ်ပစ်ပါ (`git log` တွင် ပျောက်သွားပါမည်)။
4. `git reflog` ကို အသုံးပြု၍ ဖျက်မိသွားသော commit hash ကို ရှာဖွေပါ။
5. `git branch recovery-branch <COMMIT_HASH>` ဖြင့် ပျောက်သွားသော ကုဒ်များကို ၁၀၀% အောင်မြင်စွာ ပြန်လည် ကယ်တင်ပြပါ။

---

## ❓ ၁၂။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. `git reset --soft`, `git reset --mixed`, `git reset --hard` ၏ အဓိက ကွာခြားချက်မှာ အဘယ်နည်း?
2. `git revert` နှင့် `git reset` မည်သည့်အခြေအနေတွင် မည်သည်ကို သုံးသင့်သနည်း?
3. `.gitignore` ထဲတွင် ဖိုင်အမည် ထည့်ထားသော်လည်း အဆိုပါဖိုင်သည် `git status` တွင် ဆက်လက် ပါဝင်နေပါက အဘယ်ကြောင့်နည်း? မည်သို့ ဖြေရှင်းမည်နည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. **`--soft`**: Commit ကိုသာ ဖျက်ပြီး ပြင်ဆင်ထားသော ကုဒ်များကို Staging Area (Index) တွင် ဆက်လက် ချန်ထားသည်။ **`--mixed` (Default)**: Commit နှင့် Staging Area ကို ရှင်းထုတ်သော်လည်း Working Tree ထဲတွင် ကုဒ်များ မပျက်ဘဲ ကျန်ရှိသည်။ **`--hard`**: Commit, Staging Area နှင့် Working Tree ရှိ ကုဒ်အားလုံးကို မူလအခြေအနေသို့ အတင်း အကုန် ဖျက်ပစ်သည်။
2. Public/Shared branch (ဥပမာ- `main`) ပေါ်ရောက်ပြီးသား commit ကို ပြန်ပြင်လိုပါက **`git revert`** ကို သုံးရမည် (သမိုင်းကြောင်း မပျက်ဘဲ ဆန့်ကျင်ဘက် commit အသစ် ဆောက်ပေးသည်)။ မိမိ local branch ပေါ်တွင်သာ ရှိသေးသော commit ဖြစ်ပါက **`git reset`** ကို သုံးနိုင်သည်။
3. အဆိုပါ ဖိုင်သည် ယခင်က Git သို့ commit တင်ပြီးသား (Tracked File) ဖြစ်နေသောကြောင့် ဖြစ်သည်။ Git cache မှ ဖယ်ရှားရန် `git rm --cached <filename>` ကို run ပေးရမည်။
</details>

---

## 💼 ၁၃။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Developer တစ်ဦးသည် Production AWS Key ပါဝင်သော `.env` ဖိုင်ကို GitHub Public Repository သို့ အမှားပါ commit တင်မိပါက သင် မည်သို့ အရေးပေါ် ကိုင်တွယ်မည်နည်း?**
> **Sample Answer**:
> "အရေးကြီးဆုံး ပထမဆုံး အဆင့်မှာ Git သို့မဟုတ် Code ဘက်တွင် အချိန်ဖြုန်းမနေဘဲ AWS IAM Console သို့ ချက်ချင်းသွားရောက်ပြီး ပေါက်ကြားသွားသော AWS Access Key ID ကို **Deactivate** ပြုလုပ်၍ **Delete (Revoke)** ချက်ချင်း လုပ်ဆောင်ပါမည်။ အဘယ်ကြောင့်ဆိုသော် Bot များသည် စက္ကန့်ပိုင်းအတွင်း ဖမ်းယူအသုံးချနိုင်သောကြောင့် ဖြစ်သည်။ ထို့နောက် AWS CloudTrail logs များကို စစ်ဆေး၍ အဆိုပါ key ဖြင့် unauthorized activities ပြုလုပ်ထားခြင်း ရှိမရှိ စုံစမ်းပါမည်။ ဒုတိယအဆင့်အနေဖြင့် အခြား developer များ git pull လုပ်ရာတွင် secret မပါစေရန် `git-filter-repo` တူးလ်ကို အသုံးပြု၍ Git history အားလုံးထဲမှ အဆိုပါ secret string ကို အပြီးတိုင် ဖျက်ထုတ်ကာ force push ပြုလုပ်ပါမည်။ အနာဂတ်တွင် ထပ်မဖြစ်စေရန် CI/CD pipeline နှင့် Local Git Hooks များတွင် `trufflehog` သို့မဟုတ် `git-secrets` scanner ကို မဖြစ်မနေ ထည့်သွင်းထားပါမည်။"

---

## 📚 ၁၄။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Pro Git Book by Scott Chacon and Ben Straub (Official & Free)](https://git-scm.com/book/en/v2)
- [GitHub Flow Guide](https://docs.github.com/en/get-started/using-github/github-flow)
- [git-filter-repo Documentation](https://github.com/newren/git-filter-repo)
- [Semantic Versioning 2.0.0 Specification](https://semver.org/)
