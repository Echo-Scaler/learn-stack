---
title: Team Collaboration, GitHub Workflow & Branching Models
description: Remote Repositories စီမံခန့်ခွဲမှု, fetch vs pull --rebase, PR/MR အကောင်းဆုံး အလေ့အကျင့်များ, Trunk-Based vs GitFlow မော်ဒယ်များနှင့် Branch Protection (မြန်မာဘာသာ)
---

# 👥 အခန်း ၅ — Team Collaboration, GitHub Workflow & Branching Models

Software Development သည် တစ်ဦးတည်း လုပ်ဆောင်သော အလုပ်မဟုတ်ဘဲ အဖွဲ့သားများစွာနှင့် ပူးပေါင်းလုပ်ဆောင်ရသော Teamwork ဖြစ်ပါသည်။ ကုဒ်များကို ကောင်းမွန်စွာ ရေးသားနိုင်ရုံသာမက **Remote Syncing**, **Pull Request (PR) စံနှုန်းများ**, **Branch Protection Rules** နှင့် လုပ်ငန်းခွင်သုံး **Branching Models (Trunk-Based vs GitFlow)** များကို နားလည်ထားရန် အလွန်အရေးကြီးပါသည်။

---

## 🌐 ၁။ Remote Repositories စီမံခန့်ခွဲခြင်း

Remote Repository ဆိုသည်မှာ GitHub, GitLab သို့မဟုတ် Bitbucket စသည့် Cloud/Server ပေါ်တွင် တည်ရှိသော ဗဟိုကုဒ်တိုက် ဖြစ်ပါသည်။

```bash
# လက်ရှိချိတ်ဆက်ထားသော Remote စာရင်းကို ကြည့်ရှုခြင်း (-v: verbose URL များပါပြသရန်)
git remote -v
# Output:
# origin  git@github.com:my-org/core-api.git (fetch)
# origin  git@github.com:my-org/core-api.git (push)

# Remote အသစ်တစ်ခု ချိတ်ဆက်ထည့်သွင်းခြင်း
git remote add origin git@github.com:my-org/core-api.git

# Remote URL ပြောင်းလဲခြင်း (ဥပမာ- HTTPS မှ SSH သို့ ပြောင်းလိုပါက)
git remote set-url origin git@github.com:my-org/core-api.git

# Remote တွင် ဖျက်ပစ်လိုက်သော branch များကို local cache ထဲမှ သန့်ရှင်းထုတ်ပစ်ခြင်း
git remote prune origin
```

---

## 🔄 ၂။ `git fetch` vs `git pull` Deep Dive

Developer အများစုသည် Remote မှ ကုဒ်များကို ဆွဲယူရာတွင် `git pull` ကိုသာ မျက်စိမှိတ် အသုံးပြုတတ်ကြသည်။ သို့သော် ၎င်းတို့၏ အတွင်းပိုင်း ကွာခြားချက်မှာ အောက်ပါအတိုင်း ဖြစ်သည် -

```
Remote Repository (GitHub)
       │
       ▼ [ git fetch ] (Safe: Downloads objects, updates origin/main pointer only)
Remote-Tracking Branch (origin/main)
       │
       ▼ [ git merge origin/main ] (Can create unwanted Diamond Merge Commits!)
Local Working Directory & Local main
```

1. **`git fetch`**:
   * Remote ပေါ်ရှိ Commit အသစ်များကို Local Object Database သို့ ဒေါင်းလုဒ်ဆွဲယူပြီး `origin/main` pointer ကိုသာ update လုပ်ပေးသည်။
   * Developer ၏ လက်ရှိ Working Directory နှင့် Local `main` branch ကို **လုံးဝ မထိခိုက်ပါ** (၁၀၀% Safe ဖြစ်သည်)။
   * ဆွဲယူပြီးနောက် `git log HEAD..origin/main --oneline` ဖြင့် မည်သည့် commit များ တိုးလာသည်ကို ဦးစွာ စစ်ဆေးနိုင်ပါသည်။
2. **`git pull` (Default)**:
   * `git fetch` ပြုလုပ်ပြီးနောက် `git merge origin/main` ကို ချက်ချင်း အလိုအလျောက် run ပေးခြင်း ဖြစ်သည်။
   * အကယ်၍ မိမိ local တွင်လည်း commit ရှိနေပါက မလိုအပ်သော **Diamond Merge Commit ("Merge branch 'main' of github.com...")** အမှိုက်များ အလိုအလျောက် ထွက်ပေါ်လာပါသည်။

### ✅ Senior Developer Workflow: `git pull --rebase`

မလိုအပ်သော Merge Commit အမှိုက်များ မဖြစ်ပေါ်စေဘဲ Remote မှ commit များကို ရှေ့တွင်ထားကာ မိမိ၏ local commits များကို ထိပ်ဆုံးသို့ သပ်ရပ်စွာ တင်ပေးရန် **`--rebase`** flag ကို သုံးပါ -

```bash
git pull --rebase origin main
```

> **Pro Tip**: စက်တိုင်းတွင် `git pull` ရိုက်တိုင်း အလိုအလျောက် rebase ဖြစ်စေရန် Global Config သတ်မှတ်ထားနိုင်ပါသည် -
> ```bash
> git config --global pull.rebase true
> ```

---

## 🍴 ၃။ Fork & Upstream Open-Source / Enterprise Workflow

ကုမ္ပဏီကြီးများ သို့မဟုတ် Open-Source Project များတွင် Main Repository သို့ တိုက်ရိုက် Push လုပ်ခွင့် (Write Access) မပေးဘဲ **Forked Repository** မှတစ်ဆင့်သာ ကုဒ်များ လက်ခံလေ့ရှိပါသည် -

```
Upstream Repo (github.com/facebook/react)  ──[ Fork ]──► Origin Repo (github.com/my-user/react)
                │                                                          │
                │ [ git fetch upstream ]                                   │ [ git push origin ]
                ▼                                                          ▼
        Local Machine (Developer PC with 2 remotes: 'origin' and 'upstream')
```

### Setup လုပ်ဆောင်နည်း အဆင့်ဆင့်
```bash
# ၁။ မိမိ Fork ထားသော Repo ကို Clone ဆွဲပါ
git clone git@github.com:my-user/core-engine.git
cd core-engine

# ၂။ မူလ Central Repo ကို 'upstream' ဟူသော အမည်ဖြင့် ချိတ်ဆက်ပါ
git remote add upstream git@github.com:enterprise-org/core-engine.git

# ၃။ Upstream မှ ကုဒ်အသစ်များကို အမြဲ Update ဖြစ်နေအောင် ဆွဲယူနည်း
git fetch upstream
git switch main
git rebase upstream/main
git push origin main
```

---

## 🏆 ၄။ Pull Request (PR) Crafting Excellence

Pull Request (သို့မဟုတ် GitLab တွင် Merge Request) တစ်ခု တင်သွင်းရာတွင် Code Reviewer များ အလွယ်တကူ စစ်ဆေးနိုင်ရန် အောက်ပါ အလေ့အကျင့်များကို လိုက်နာသင့်ပါသည် -

1. **Keep PRs Small (< 400 Lines of Code)**:
   * သုတေသနများအရ PR တစ်ခုတွင် ကုဒ်စာကြောင်း ၄၀၀ ကျော်သွားပါက Reviewer သည် သေချာမဖတ်တော့ဘဲ အပေါ်ယံသာ ကြည့်သွားသဖြင့် Production Bug များ လွတ်ထွက်သွားတတ်ပါသည်။
2. **Clear PR Description Template**:
   ```markdown
   ## 📌 Summary
   Implement multi-currency payment calculation supporting JPY and MMK.

   ## 🔍 Changes Made
   - Added ExchangeRateService with Redis caching.
   - Migrated CartTotal from float to BigDecimal to prevent rounding errors.

   ## 🧪 How to Test
   1. Run `mvn test`
   2. Send POST to `/api/v1/checkout` with currency="JPY" and verify 0 decimal places.

   Closes #142
   ```
3. **Use Draft PRs (WIP)**:
   * အလုပ်မပြီးသေးသော်လည်း Architecture ဒီဇိုင်းကို Team Lead နှင့် စောစီးစွာ ဆွေးနွေးလိုပါက GitHub တွင် **"Create Draft Pull Request"** ကို ရွေးချယ်ပါ။
4. **Link Issues Automatically**:
   * PR description တွင် `Closes #142` သို့မဟုတ် `Fixes #89` ဟု ထည့်သွင်းပါက PR merge ဖြစ်သည်နှင့် သက်ဆိုင်ရာ GitHub Issue သည် အလိုအလျောက် Auto-Closed ဖြစ်သွားပါမည်။

---

## 🔒 ၅။ GitHub Branch Protection Rules (Enterprise Standards)

Production Server နှင့် တိုက်ရိုက်ချိတ်ဆက်ထားသော `main` သို့မဟုတ် `production` branch များကို မတော်တဆ ပျက်စီးမှုမှ ကာကွယ်ရန် GitHub Repo Settings တွင် အောက်ပါ Branch Protection Rules များကို မဖြစ်မနေ ဖွင့်ထားသင့်ပါသည် -

1. **Require a pull request before merging**: မည်သူမျှ `main` ပေါ်သို့ တိုက်ရိုက် `git push` မလုပ်နိုင်အောင် တားဆီးခြင်း။
2. **Require approvals (At least 1 or 2 approvals)**: အခြား Senior Developer အနည်းဆုံး ၁ ဦးမှ Approve ပေးမှသာ Merge ပြုလုပ်ခွင့်ရရှိခြင်း။
3. **Dismiss stale pull request approvals when new commits are pushed**: PR ကို approve ပေးပြီးနောက် ကုဒ်အသစ်ထပ်တင်ပါက ယခင် approval ကို အလိုအလျောက် ပယ်ဖျက်ပြီး အသစ်ပြန်စစ်ခိုင်းခြင်း။
4. **Require status checks to pass before merging**: GitHub Actions CI/CD Pipeline တွင် Unit Test များ အောင်မြင်ခြင်း၊ SonarQube Code Quality စစ်ဆေးမှု အောင်မြင်ခြင်း ရှိမှသာ Merge ခွင့်ပြုခြင်း။
5. **Require linear history**: Merge Commit အရှုပ်အထွေးများကို ပိတ်ပင်ပြီး Squash merge သို့မဟုတ် Rebase merge သာ ခွင့်ပြုခြင်း။
6. **Do not allow bypassing the above settings (Include administrators)**: Admin များပင်လျှင် ဤစည်းမျဉ်းကို ချိုးဖောက်၍ တိုက်ရိုက် push မလုပ်နိုင်အောင် ကာကွယ်ခြင်း။

---

## 📐 ၆။ Production Branching Models နှိုင်းယှဉ်ချက် (Trunk-Based vs GitFlow)

| မော်ဒယ် (Model) | အလုပ်လုပ်ပုံ သဘောတရား | အသုံးပြုသည့် နေရာ | အားသာချက် / အားနည်းချက် |
| :--- | :--- | :--- | :--- |
| **Trunk-Based Development** *(Modern Silicon Valley Standard)* | Developer အားလုံးသည် `main` (Trunk) ပေါ်သို့ တစ်နေ့လျှင် အကြိမ်ပေါင်းများစွာ သေးငယ်သော Short-lived branch များဖြင့် merge လုပ်သည်။ မပြီးသေးသော Feature များကို **Feature Flags (Toggles)** ဖြင့် ထိန်းချုပ်သည်။ | Google, Meta, Netflix, Amazon စသည့် High-velocity DevOps အဖွဲ့များ | **အားသာချက်**: Merge conflict မရှိသလောက် နည်းပါးပြီး နေ့စဉ် Continuous Deployment ပြုလုပ်နိုင်သည်။<br>**အားနည်းချက်**: Automated Test များ ၁၀၀% ခိုင်မာနေရန် လိုအပ်သည်။ |
| **GitHub Flow** | ရိုးရှင်းသော Model ဖြစ်သည်။ `main` မှ Feature branch ခွဲ -> PR တင် -> Code Review -> Test အောင်မြင်ပါက `main` သို့ Merge -> Production Deploy တိုက်ရိုက် ပြုလုပ်သည်။ | Web Applications, SaaS Projects, Startups များ | အလွန်ရိုးရှင်းပြီး နားလည်ရလွယ်ကူသည်။ |
| **GitFlow** *(Traditional Enterprise Model)* | `main` (Production), `develop` (Staging), `feature/*`, `release/*`, `hotfix/*` စသည့် Long-lived branches များစွာ ခွဲထားသည်။ | လစဉ်/နှစ်စဉ် သတ်မှတ်ရက်မှ Release ထုတ်ရသော Desktop Software သို့မဟုတ် Mobile Apps များ | **အားသာချက်**: Version ထိန်းသိမ်းရ လွယ်ကူသည်။<br>**အားနည်းချက်**: Branch များလွန်းသဖြင့် Merge Conflict ဒုက္ခ အလွန်ကြီးမားသည်။ |
