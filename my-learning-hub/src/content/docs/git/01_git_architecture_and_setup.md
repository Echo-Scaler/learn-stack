---
title: Git Architecture Internals, Setup & SSH Security
description: Git ၏ အတွင်းပိုင်း Object Database (Blobs, Trees, Commits), .git/ ဖွဲ့စည်းပုံ, SSH Key Configuration နှင့် .gitignore အလေ့အကျင့်ကောင်းများ (မြန်မာဘာသာ)
---

# 🧱 အခန်း ၁ — Git Architecture Internals, Setup & SSH Security

Developer အများစုသည် Git ကို command အချို့သာ အလွတ်ကျက်မှတ်ပြီး အသုံးပြုလေ့ရှိကြသဖြင့် ပြဿနာတစ်ခုခုကြုံလာပါက ဖြေရှင်းရန် အလွန်ခက်ခဲသွားတတ်ပါသည်။ Git ၏ **အတွင်းပိုင်း Architecture (Internal Storage Model)** ကို နားလည်ထားပါက Git command တစ်ခုချင်းစီသည် စက်တွင်း၌ အမှန်တကယ် မည်သို့အလုပ်လုပ်သည်ကို ရှင်းလင်းစွာ မြင်ယောင်လာနိုင်မည် ဖြစ်ပါသည်။

---

## 🔬 ၁။ Git Object Model Internals (Git ၏ အတွင်းပိုင်း သိုလှောင်မှုစနစ်)

Git သည် ရိုးရိုး File Version စနစ်မဟုတ်ဘဲ **Content-Addressable Key-Value Object Store** တစ်ခု ဖြစ်ပါသည်။ ဖိုင်တစ်ခု သို့မဟုတ် အချက်အလက်တစ်ခုကို Git ထဲသို့ ထည့်လိုက်တိုင်း ၎င်းအချက်အလက်၏ အကြောင်းအရာ (Content) ကို **SHA-1 (သို့မဟုတ် SHA-256)** ဖြင့် Hash လုပ်ကာ ၄၀ လုံးပါ Hexadecimal Hash Key ထုတ်ယူပြီး `.git/objects/` ထဲတွင် သိမ်းဆည်းပါသည်။

Git တွင် အခြေခံ အရာဝတ္ထု (Objects) **၄ မျိုး** တည်ရှိပါသည် -

```
┌────────────────────────────────────────────────────────┐
│                   Commit Object                        │
│  Tree: 92a4e5...                                       │
│  Parent: 41b8f1...                                     │
│  Author: Kyaw Wai Yan <kyaw@example.com>               │
│  Message: "feat: implement user registration api"      │
└──────────────────────────┬─────────────────────────────┘
                           │ (points to root directory)
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Tree Object (src/)                  │
│  100644 blob a84f...  Main.java                        │
│  100644 blob c31e...  pom.xml                          │
│  040000 tree 72dd...  controller/                      │
└──────────────────────────┬─────────────────────────────┘
                           │ (points to file contents)
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Blob Object                         │
│  (Pure Raw File Content: public class Main { ... })    │
│  *မှတ်ချက်: ဖိုင်အမည်နှင့် Permissions များမပါဝင်ပါ*     │
└────────────────────────────────────────────────────────┘
```

1. **Blob (Binary Large Object)**:
   * ဖိုင်တစ်ခု၏ **အတွင်းသား အချက်အလက် (Content)** သက်သက်ကိုသာ သိမ်းဆည်းပါသည်။
   * ဖိုင်၏ အမည် (Filename) နှင့် Permissions (`chmod`) များကို Blob ထဲတွင် **မသိမ်းပါ**။ (ထို့ကြောင့် နာမည်မတူသော်လည်း အတွင်းသားတူညီသော ဖိုင်နှစ်ခုသည် Blob တစ်ခုတည်းကိုသာ မျှဝေသုံးစွဲသဖြင့် Disk Space သက်သာစေပါသည်)။
2. **Tree Object**:
   * Directory (Folder) တစ်ခုနှင့် ညီမျှပါသည်။
   * Tree ထဲတွင် ဖိုင်အမည်များ၊ File Permissions (ဥပမာ- `100644` normal file, `100755` executable script) နှင့် သက်ဆိုင်ရာ Blob သို့မဟုတ် Sub-Tree တို့၏ SHA-1 Hash များကို စာရင်းပြုစုထားပါသည်။
3. **Commit Object**:
   * Snapshot တစ်ခု၏ ထိပ်တန်း ခေါင်းဆောင် ဖြစ်ပါသည်။
   * ထို Commit ပြုလုပ်ချိန်ရှိ Root Tree ၏ SHA-1 Hash၊ ယခင် Parent Commit ၏ Hash၊ ရေးသားသူ (Author)၊ Commit လုပ်သူ (Committer)၊ အချိန် (Timestamp) နှင့် Commit Message တို့ ပါဝင်ပါသည်။
4. **Annotated Tag Object**:
   * Specific Commit တစ်ခုကို ညွှန်ပြပြီး Tag Name (ဥပမာ- `v1.0.0`)၊ Message နှင့် GPG Signature တို့ ပါဝင်ပါသည်။

---

## 📂 ၂။ `.git/` Directory Anatomy (Git ဖိုဒါအတွင်းပိုင်း တည်ဆောက်ပုံ)

မည်သည့် Project တွင်မဆို `git init` ပြုလုပ်လိုက်ပါက `.git` ဟုခေါ်သော Hidden Folder တစ်ခု ထွက်ပေါ်လာပါသည်။

```bash
$ ls -la .git
├── HEAD            # လက်ရှိ Developer ရောက်ရှိနေသော Branch/Commit ကို ညွှန်ပြသော pointer (ဥပမာ- ref: refs/heads/main)
├── config          # ဤ Project တစ်ခုတည်းအတွက် သီးသန့် Local Configurations (Remote URL, User Email)
├── description     # GitWeb အတွက် Project အကျဉ်းချုပ်
├── hooks/          # Client နှင့် Server ဘက်ခြမ်း script များ (pre-commit, post-checkout စသည်)
├── index           # Staging Area (Binary format ဖြင့် သိမ်းထားသော staging buffer)
├── info/           # Global exclude ဖိုင်များ
├── objects/        # Git ၏ Object Database (Blobs, Trees, Commits အားလုံး ဤနေရာ၌ သိမ်းသည်)
└── refs/
    ├── heads/      # Local Branches များ (ဥပမာ- main, feature/login စသည့် 41-byte text ဖိုင်များ)
    ├── remotes/    # Remote-tracking branches များ (ဥပမာ- origin/main)
    └── tags/       # Release tags များ
```

> **Senior Insight**: Branch တစ်ခုဆိုသည်မှာ Magic တစ်ခုမဟုတ်ပါ။ `.git/refs/heads/main` ဖိုင်ထဲတွင် ရေးသားထားသော **၄၀ လုံးပါ SHA-1 Commit Hash** သက်သက်သာ ဖြစ်ပါသည်။ ထို့ကြောင့် Git တွင် Branch ဆောက်ခြင်းသည် အလွန်ပေါ့ပါးမြန်ဆန် (Lightweight) ပါသည်။

---

## ⚙️ ၃။ စနစ်တကျ ပြင်ဆင်သတ်မှတ်ခြင်း (Essential Git Setup)

စက်အသစ်တစ်လုံးတွင်ဖြစ်စေ၊ Developer ဘဝအစတွင်ဖြစ်စေ အောက်ပါ Standard Global Configurations များကို မဖြစ်မနေ သတ်မှတ်ထားသင့်ပါသည် -

### က။ User Identity နှင့် Default Branch သတ်မှတ်ခြင်း

```bash
# Developer အမည်နှင့် Email (GitHub Account နှင့် ကိုက်ညီရပါမည်)
git config --global user.name "Kyaw Wai Yan"
git config --global user.email "kyawwaiyan@example.com"

# Git 2.28+ မှစ၍ master အစား main ကို Default Branch အဖြစ် သတ်မှတ်ရန်
git config --global init.defaultBranch main

# Default Code Editor သတ်မှတ်ခြင်း (VS Code ကို အသုံးပြုလိုပါက)
git config --global core.editor "code --wait"
```

### ခ။ Line Endings သတ်မှတ်ချက် (Windows vs Mac/Linux)

Windows စက်များတွင် Line Ending သည် `CRLF` (\r\n) ဖြစ်ပြီး Mac/Linux တွင် `LF` (\n) ဖြစ်သောကြောင့် Team ထဲတွင် OS မတူပါက ဖိုင်အားလုံး diff တက်နေတတ်ပါသည်။

```bash
# macOS သို့မဟုတ် Linux အသုံးပြုသူများအတွက်
git config --global core.autocrlf input

# Windows အသုံးပြုသူများအတွက်
git config --global core.autocrlf true
```

### ဂ။ Current Configuration အားလုံးကို စစ်ဆေးခြင်း

```bash
# ပြင်ဆင်ထားသမျှနှင့် မည်သည့် config file မှ လာသည်ကို အသေးစိတ် ကြည့်ရှုခြင်း
git config --list --show-origin
```

---

## 🔐 ၄။ SSH Security & GitHub Integration Setup

GitHub/GitLab သို့ ကုဒ်များ push/pull ပြုလုပ်ရာတွင် Password သို့မဟုတ် Personal Access Token (PAT) အသုံးပြုခြင်းထက် **SSH Key Pair (Ed25519)** အသုံးပြုခြင်းသည် ပိုမိုလုံခြုံပြီး နေ့စဉ်စကားဝှက်ရိုက်ရသည့် ဒုက္ခမှ ကင်းဝေးစေပါသည်။

### အဆင့် ၁ — Modern Ed25519 SSH Key ထုတ်ယူခြင်း

RSA (2048/4096) ထက် ပိုမိုမြန်ဆန်ပြီး ခေတ်မီ Cryptography စံနှုန်းဖြစ်သော **Ed25519** ကို အသုံးပြုပါ -

```bash
ssh-keygen -t ed25519 -C "kyawwaiyan@example.com"
```
*Prompt တောင်းလာပါက default path ဖြစ်သော `~/.ssh/id_ed25519` တွင် Enter ခေါက်ပြီး သတ်မှတ်နိုင်ပါသည်။*

### အဆင့် ၂ — SSH Agent သို့ Key ထည့်သွင်းခြင်း

```bash
# Background SSH Agent ကို စတင်ခြင်း
eval "$(ssh-agent -s)"

# macOS Keychain သို့ Key သိမ်းဆည်းရန် (~/.ssh/config ဖိုင်တွင် ထည့်သွင်းနိုင်သည်)
ssh-add --apple-use-keychain ~/.ssh/id_ed25519   # macOS
# သို့မဟုတ် Linux တွင်
ssh-add ~/.ssh/id_ed25519
```

### အဆင့် ၃ — Public Key ကို GitHub သို့ ထည့်သွင်းခြင်း

Public Key အား ကူးယူပါ (`.pub` ဖိုင်သာဖြစ်ရပါမည်၊ private key ကို လုံးဝ မဝေမျှရပါ) -

```bash
cat ~/.ssh/id_ed25519.pub
```
* GitHub သို့သွားပါ: **Settings** -> **SSH and GPG keys** -> **New SSH key**
* Key Title ရိုက်ထည့်ပြီး အထက်ပါ output ကို ကူးယူထည့်ကာ သိမ်းဆည်းပါ။

### အဆင့် ၄ — ချိတ်ဆက်မှု အောင်မြင်ခြင်း ရှိ/မရှိ စမ်းသပ်ခြင်း

```bash
ssh -T git@github.com
```
အောက်ပါအတိုင်း ပေါ်လာပါက SSH Setup အောင်မြင်ပါပြီ -
```
Hi Kyaw Wai Yan! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🛡️ ၅။ `.gitignore` Best Practices & Architecture

Project အတွင်းသို့ Compiler Build ဖိုင်များ၊ Dependencies များ၊ Secret Environment Variables များနှင့် OS Temporary ဖိုင်များ မရောက်ရှိစေရန် `.gitignore` ဖိုင်ကို တိကျစွာ ရေးသားရပါမည်။

### Production Grade `.gitignore` နမူနာ

```gitignore
# ==========================================
# Operating System Temporary Files
# ==========================================
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# ==========================================
# Security & Secrets (ဘယ်တော့မှ commit မလုပ်ရ)
# ==========================================
.env
.env.local
.env.*.local
*.pem
*.key
id_rsa
secrets.json

# ==========================================
# Dependencies & Package Managers
# ==========================================
node_modules/
vendor/
.venv/
env/

# ==========================================
# Build Outputs & Compilers
# ==========================================
dist/
build/
target/
*.class
*.jar
*.war

# ==========================================
# IDE & Code Editors
# ==========================================
.idea/
*.iml
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
*.sublime-project
*.sublime-workspace

# ==========================================
# Logs & Diagnostics
# ==========================================
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 💡 မတော်တဆ Track မိသွားသော ဖိုင်ကို `.gitignore` အသက်ဝင်စေရန် ပြန်ထုတ်နည်း

ဖိုင်တစ်ခုကို Git တွင် `git add` လုပ်ပြီးသွားပါက ထိုဖိုင်ကို `.gitignore` ထဲ ထည့်လိုက်ရုံဖြင့် Git က ဥပေက္ခာမပြုနိုင်တော့ပါ။ ထိုဖိုင်ကို Disk ပေါ်မှ မဖျက်ဘဲ Git Index မှသာ ဖယ်ရှားရန် အောက်ပါ command ကို သုံးရပါမည် -

```bash
# ဖိုင်တစ်ခုတည်းကို index မှ ဖယ်ထုတ်ခြင်း
git rm --cached .env

# သို့မဟုတ် ဖိုဒါတစ်ခုလုံးကို index မှ ဖယ်ထုတ်ခြင်း
git rm -r --cached target/

# ပြီးနောက် commit ရေးသားပါ
git commit -m "chore: remove sensitive .env from git tracking"
```

---

## 📝 အနှစ်ချုပ် လေ့ကျင့်ခန်း (Hands-on Lab)

1. Terminal တွင် `git init test-repo` ဖြင့် repository အသစ်တစ်ခု ဆောက်ပါ။
2. `cd test-repo` ဝင်ပြီး `.git/` ဖိုဒါတည်ဆောက်ပုံကို `ls -la .git` ဖြင့် စစ်ဆေးပါ။
3. ဖိုင်တစ်ခု `echo "Hello Git" > readme.txt` ဆောက်ပြီး `git add readme.txt` လုပ်ပါ။
4. `.git/objects/` ထဲတွင် Blob Hash ဖိုင်အသစ် ထွက်ပေါ်လာပုံကို ရှာဖွေကြည့်ပါ။
