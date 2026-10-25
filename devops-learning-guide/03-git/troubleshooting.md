# 🛠️ Git & Collaboration Incident Troubleshooting Guide

> **Git တွင် ဖြစ်ပွားတတ်သော အမှားများ၊ Merge Conflicts များ၊ Secret Leaks များနှင့် Disaster Recovery နည်းလမ်းများ**

---

## 🚨 Incident 1: Accidental Secret Leak in Git History (AWS Keys / Passwords ပေါက်ကြားခြင်း)

### 症状 (Symptoms):
- Developer မှ AWS Access Key, Database Password သို့မဟုတ် `.env` ဖိုင်ကို GitHub သို့ အမှားပါ commit တင်မိခြင်း။
- နောက်ထပ် commit တစ်ခုတွင် ဖိုင်ကို delete လုပ်လိုက်သော်လည်း ယခင် commit history ထဲတွင် လျှို့ဝှက်ချက် ဆက်လက် ကျန်ရှိနေခြင်း။

### 🔍 အရေးပေါ် စုံစမ်းစစ်ဆေးနည်း & ကုစားမှု အဆင့် (၃) ဆင့်:

#### အဆင့် ၁: Key ကို AWS ဘက်မှ ချက်ချင်း Revoke လုပ်ခြင်း
Git history တွင် အချိန်ဖြုန်းမနေပါနှင့်။ AWS IAM Console သို့ ချက်ချင်းသွား၍ အဆိုပါ Access Key ကို **Deactivate** ပြုလုပ်ပြီး **Delete** ချက်ချင်း လုပ်ဆောင်ပါ။

#### အဆင့် ၂: `git-filter-repo` ဖြင့် Git History အားလုံးမှ အပြီးတိုင် ဖျက်ထုတ်ခြင်း
```bash
# git-filter-repo tool ကို အသုံးပြုပါ (git filter-branch သည် နှေးကွေးပြီး deprecated ဖြစ်သည်)
# macOS: brew install git-filter-repo
# Linux: pip install git-filter-repo

# သီးခြား ဖိုင်တစ်ခုလုံးကို commit history အစအဆုံးမှ လုံးဝ ရှင်းထုတ်ခြင်း
git filter-repo --path .env --invert-paths --force

# သို့မဟုတ် text pattern (လျှို့ဝှက် key string) ကို history အားလုံးထဲတွင် အစားထိုးခြင်း
git filter-repo --replace-text <(echo "AKIAIOSFODNN7EXAMPLE==>REDACTED_BY_SECURITY") --force
```

#### အဆင့် ၃: Remote Repository သို့ Force Push ပြုလုပ်ခြင်း
```bash
git remote add origin <REMOTE_URL>
git push origin --force --all
git push origin --force --tags
```
*(သတိပေးချက်: အဖွဲ့သားများအားလုံး Repository ကို အသစ် ပြန်လည် clone ရပါမည်)*

---

## 🚨 Incident 2: Complex Merge Conflict Resolution

### 症状 (Symptoms):
- `git merge feature` သို့မဟုတ် `git pull` လုပ်သောအခါ:
  ```text
  CONFLICT (content): Merge conflict in src/app.config.js
  Automatic merge failed; fix conflicts and then commit the result.
  ```

### 🔍 စုံစမ်းစစ်ဆေးနည်း:
```bash
# မည်သည့် ဖိုင်များ conflict ဖြစ်နေသည်ကို စစ်ဆေးပါ
git status
# "both modified: src/app.config.js" ဟု ပြနေမည်။
```

### 💡 ဖြေရှင်းနည်း:
1. ဖိုင်ကို ဖွင့်ကြည့်ပါ:
   ```javascript
   <<<<<<< HEAD
   const DATABASE_TIMEOUT = 5000;
   =======
   const DATABASE_TIMEOUT = 10000;
   >>>>>>> feature/long-timeout
   ```
2. Conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) များကို ဖျက်ပြီး လိုချင်သော တန်ဖိုးအမှန် (`10000`) ကိုသာ ရွေးချယ်ချန်ထားပါ။
3. ဖိုင်ကို stage လုပ်ပြီး merge ကို အဆုံးသတ်ပါ:
   ```bash
   git add src/app.config.js
   git commit -m "fix: resolve DATABASE_TIMEOUT conflict by adopting 10000ms"
   ```
4. အကယ်၍ အလွန်ရှုပ်ထွေးပြီး မူလအခြေအနေသို့ ပြန်ဆုတ်လိုပါက:
   ```bash
   git merge --abort
   ```

---

## 🚨 Incident 3: Lost Commits Recovery with `git reflog` (Disaster Recovery)

### 症状 (Symptoms):
- မတော်တဆ `git reset --hard HEAD~3` ရိုက်မိသဖြင့် အရေးကြီးသော feature commits (၃) ခုသည် `git log` ထဲမှ လုံးဝ ပျောက်ကွယ်သွားခြင်း။

### 🔍 ဖြေရှင်းနည်း:
1. Git ၏ Action မှတ်တမ်းအပြည့်အစုံကို `reflog` ဖြင့် ကြည့်ပါ:
   ```bash
   git reflog
   ```
   Output ဥပမာ:
   ```text
   a1b2c3d HEAD@{0}: reset: moving to HEAD~3
   e4f5g6h HEAD@{1}: commit: feat: complete stripe checkout flow
   7i8j9k0 HEAD@{2}: commit: feat: add checkout validation
   ```
2. ပျောက်သွားသော commit hash (`e4f5g6h` - `HEAD@{1}`) ကို တွေ့ရှိပါက အဆိုပါနေရာမှ branch အသစ် ဖောက်၍ ကယ်တင်ပါ:
   ```bash
   git branch recovered-work e4f5g6h
   git switch recovered-work
   ```
   *(ပျောက်ဆုံးသွားသော ဖိုင်များနှင့် commits အားလုံး ၁၀၀% ပြန်လည် ရရှိသွားမည် ဖြစ်ပါသည်)*

---

## 🚨 Incident 4: Detached HEAD State

### 症状 (Symptoms):
- Terminal တွင် အောက်ပါ message ပြနေခြင်း:
  ```text
  You are in 'detached HEAD' state. You can look around, make experimental
  changes and commit them...
  ```

### 💡 Root Cause:
- Branch အမည်ဆီသို့ မဟုတ်ဘဲ သီးခြား commit hash တစ်ခု (ဥပမာ- `git checkout a1b2c3d`) ဆီသို့ တိုက်ရိုက် သွားရောက်ခဲ့မိခြင်း။ ဤအခြေအနေတွင် commit အသစ်တင်ပါက မည်သည့် branch တွင်မှ ပါဝင်မည် မဟုတ်ပါ။

### 🛠️ ဖြေရှင်းနည်း:
- အကယ်၍ ဤနေရာတွင် commit အသစ် ရေးသားထားပြီးဖြစ်ပါက branch အသစ် ဖောက်လိုက်ပါ:
  ```bash
  git switch -c rescue-detached-branch
  ```
- အကယ်၍ ကြည့်ရှုရုံသက်သက်သာဖြစ်ပြီး ဘာမှ မပြင်ဆင်ရသေးပါက main branch သို့ ပြန်လှည့်ပါ:
  ```bash
  git switch main
  ```

---

## 🚨 Incident 5: `.gitignore` Not Working for Tracked Files

### 症状 (Symptoms):
- `.gitignore` ထဲတွင် `config/database.yml` ဟု ထည့်ထားသော်လည်း အဆိုပါဖိုင်ကို ပြင်ဆင်တိုင်း `git status` တွင် ပြောင်းလဲမှုအဖြစ် ဆက်လက် ပေါ်နေခြင်း။

### 💡 Root Cause:
- `.gitignore` သည် Git မသိသေးသော (untracked) ဖိုင်များကိုသာ လျစ်လျူရှုပေးနိုင်ပါသည်။ အဆိုပါဖိုင်သည် ယခင်က Git သို့ commit တင်ပြီးသား ဖြစ်နေသောကြောင့် Git က ဆက်လက် စောင့်ကြည့်နေခြင်း ဖြစ်သည်။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# Local ဖိုင်ကို မဖျက်ဘဲ Git ၏ Index (Cache) မှသာ ဖယ်ရှားခြင်း
git rm --cached config/database.yml

# ထို့နောက် commit အသစ် တင်ပါ
git commit -m "chore: stop tracking database.yml in git"
```
*(ယခုအခါ `.gitignore` စတင် အလုပ်လုပ်သွားပြီး နောက်နောင် မည်မျှပြင်ဆင်စေကာမူ `git status` တွင် မပေါ်တော့ပါ)*
