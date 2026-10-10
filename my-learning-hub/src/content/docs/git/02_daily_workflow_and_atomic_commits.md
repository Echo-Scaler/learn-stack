---
title: Daily Developer Workflow & Atomic Commits
description: နေ့စဉ် Developer Workflow, git add -p ဖြင့် အပိုင်းလိုက် Staging ပြုလုပ်နည်း, Conventional Commits စံနှုန်းနှင့် Modern Git Commands (မြန်မာဘာသာ)
---

# ⚡ အခန်း ၂ — Daily Developer Workflow & Atomic Commits

Software Engineer တစ်ဦး၏ နေ့စဉ်ဘဝတွင် Git commands များကို အကြိမ်ပေါင်းများစွာ ရိုက်နှိပ်အသုံးပြုရပါသည်။ အကယ်၍ မိမိသည် `git add .` နှင့် `git commit -m "update"` မျှသာ ရေးသားနေပါက Code Review ပြုလုပ်သည့်အခါ Reviewer အတွက် အလွန်ခက်ခဲစေပြီး Bug ဖြစ်ပေါ်ပါက Rollback ပြုလုပ်ရန် မဖြစ်နိုင်တော့ပါ။

ဤအခန်းတွင် ၄ နှစ်လုပ်သက် Senior Developer များ ကျင့်သုံးသည့် **Atomic Commits Principle**, **Hunk Staging (`git add -p`)**, **Conventional Commits Standard** နှင့် Git 2.23+ ၏ **Modern Commands (`switch`, `restore`)** များကို လေ့လာသွားပါမည်။

---

## 🧩 ၁။ Atomic Commit Principle (သီးသန့် တိကျသော Commit များ)

**Atomic Commit** ဆိုသည်မှာ "Logical Change တစ်ခုတည်း (Single Responsibility Principle)" ကိုသာ ကိုယ်စားပြုသော Commit ဖြစ်ပါသည်။

```
❌ BAD COMMIT (Messy / Anti-Pattern):
  git commit -m "fix login bug, update navbar styling, change db password, remove console log"
  (ဖိုင်ပေါင်း ၂၀ ကျော်ရောပြွမ်းနေပြီး နောက်ပိုင်းတွင် navbar ပြန်ပြင်လိုပါက login bug ပါ revert ဖြစ်သွားနိုင်သည်)

✅ GOOD ATOMIC COMMITS (Clean / Modular):
  Commit 1: feat(auth): add email regex validation to login form
  Commit 2: fix(auth): prevent null pointer on empty user token
  Commit 3: style(navbar): adjust mobile padding to 16px
```

### Atomic Commit ပြုလုပ်ခြင်း၏ အကျိုးကျေးဇူးများ
1. **Easy Code Review**: Pull Request ဖတ်ရှုသူသည် Feature တစ်ခုချင်းစီ၏ ပြောင်းလဲမှုကို သဲသဲကွဲကွဲ လွယ်ကူစွာ နားလည်နိုင်သည်။
2. **Effortless Revert**: Feature တစ်ခုတွင် ပြဿနာတွေ့ပါက အခြားအပိုင်းများကို မထိခိုက်စေဘဲ `git revert <hash>` ဖြင့် ထို commit တစ်ခုတည်းကိုသာ ဖယ်ရှားနိုင်သည်။
3. **Safe Cherry-Picking**: Production Hotfix ပြုလုပ်ရန် လိုအပ်ပါက သက်ဆိုင်ရာ commit တစ်ခုတည်းကို အခြား branch သို့ လွယ်ကူစွာ ကူးယူနိုင်သည်။

---

## ✂️ ၂။ Hunk Staging with `git add -p` (ဖိုင်တစ်ခုအတွင်းမှ လိုချင်သောအကွက်သာ ခွဲခြား Staging ပြုလုပ်နည်း)

အလုပ်လုပ်ရင်း ဖိုင်တစ်ခုတည်းတွင် Production Business Logic ရော၊ မိမိစမ်းသပ်ထားသော `console.log()` သို့မဟုတ် Debugging Code များပါ ရောနှောနေလေ့ရှိပါသည်။ ထိုအခါ `git add .` လုပ်လိုက်ပါက အမှိုက်ကုဒ်များပါ Staging Area သို့ ပါသွားတတ်ပါသည်။

`git add -p` (Patch Mode) သည် ဖိုင်တစ်ခုချင်းစီရှိ ပြောင်းလဲမှုများကို **Hunk (အကွက်ငယ်များ)** အဖြစ် ခွဲခြမ်းပြသပေးပြီး တစ်ကွက်ချင်းစီကို စိတ်ကြိုက်ရွေးချယ် stage လုပ်ခွင့်ပေးပါသည်။

```bash
git add -p
```

Terminal တွင် ပြောင်းလဲမှုကို ပြသပြီး အောက်ပါ Option များကို ရွေးချယ်ခိုင်းပါမည် -

```
Stage this hunk [y,n,q,a,d,s,e,?]?
```

| Key | အဓိပ္ပာယ်နှင့် လုပ်ဆောင်ချက် |
| :---: | :--- |
| **`y`** | **Yes** — ဤကွက်လပ် (Hunk) ကို Staging Area သို့ ထည့်မည်။ |
| **`n`** | **No** — ဤကွက်လပ်ကို ယခု commit တွင် မထည့်ဘဲ Working Tree တွင်သာ ထားခဲ့မည်။ |
| **`s`** | **Split** — လက်ရှိ hunk သည် ကြီးမားနေပါက ပိုမိုသေးငယ်သော အကွက်ငယ်များအဖြစ် ထပ်မံခွဲခြမ်းမည်။ |
| **`e`** | **Edit** — လက်ရှိ hunk ကို Text Editor ဖြင့် တိုက်ရိုက်ဝင်ပြင်ပြီး လိုချင်သော စာကြောင်းကိုသာ သီးသန့်ရွေးချယ်မည်။ |
| **`q`** | **Quit** — Patch mode မှ ထွက်မည် (ယခင် stage ပြီးသမျှ ကျန်ရှိနေမည်)။ |
| **`a`** | **All** — ဤဖိုင်ရှိ ကျန်ရှိသော hunk အားလုံးကို တစ်ခါတည်း stage လုပ်မည်။ |
| **`d`** | **Do not stage** — ဤဖိုင်ရှိ ကျန်ရှိသော hunk အားလုံးကို မယူတော့ဘဲ နောက်ဖိုင်သို့ ကျော်မည်။ |

> **Pro Tip**: `git add -p` ကို အသုံးပြုခြင်းဖြင့် မလိုအပ်သော console logs, secrets များနှင့် temporary test codes များ Git ထဲသို့ မတော်တဆ ပါသွားခြင်းကို ၁၀၀% ကာကွယ်နိုင်ပါသည်။

---

## 📝 ၃။ Conventional Commits စံနှုန်း (Industry Standard Commit Messages)

နိုင်ငံတကာ ကုမ္ပဏီကြီးများနှင့် Open-source Project များတွင် **Conventional Commits 1.0.0 Specification** ကို အသုံးပြုကြပါသည်။ ဤစံနှုန်းသည် Semantic Versioning (SemVer) နှင့် Automated Changelog Generator များအတွက် အခြေခံအုတ်မြစ် ဖြစ်ပါသည်။

### Structure Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### အသုံးများသော Types များ

| Type | အဓိပ္ပာယ်နှင့် အသုံးပြုရမည့် အခြေအနေ |
| :--- | :--- |
| **`feat`** | Feature အသစ်တစ်ခု ထည့်သွင်းခြင်း (ဥပမာ- `feat(auth): add google oauth login`) |
| **`fix`** | Bug တစ်ခုကို ပြင်ဆင်ဖာထေးခြင်း (ဥပမာ- `fix(payment): resolve stripe webhook timeout`) |
| **`refactor`** | Feature မတိုး၊ Bug မပြင်ဘဲ ကုဒ်တည်ဆောက်ပုံကို ပိုမိုသန့်ရှင်းအောင် ပြင်ဆင်ခြင်း |
| **`perf`** | Performance ပိုမိုမြန်ဆန်အောင် တိုးတက်စေခြင်း (ဥပမာ- SQL query optimization) |
| **`docs`** | Documentation သို့မဟုတ် README ပြင်ဆင်ခြင်း |
| **`style`** | Code formatting, semicolon, whitespace များ ပြင်ဆင်ခြင်း (Logic မပြောင်းလဲပါ) |
| **`test`** | Unit test, Integration test များ ထည့်သွင်းခြင်း သို့မဟုတ် ပြင်ဆင်ခြင်း |
| **`chore`** | Build tool, dependencies, .gitignore စသည့် အထွေထွေပြင်ဆင်မှုများ |

### Production Commit Message နမူနာ

```git
feat(order): implement multi-currency checkout calculation

Add support for JPY, USD, and MMK real-time exchange rates
using central bank API cache. Prevent precision loss with BigDecimal.

Closes #204
BREAKING CHANGE: Payment payload now requires 'currencyCode' ISO string.
```

---

## 🔍 ၄။ `git diff` ဖြင့် ပြောင်းလဲမှုများကို စစ်ဆေးဖတ်ရှုခြင်း

Commit မပြုလုပ်မီ မိမိပြင်ဆင်ထားသော ကုဒ်များကို သေချာစွာ စစ်ဆေးခြင်းသည် အကောင်းဆုံး Developer Habit ဖြစ်ပါသည်။

```bash
# ၁။ Working Directory နှင့် Staging Area အကြား ကွာခြားချက် (Unstaged Changes)
git diff

# ၂။ Staging Area နှင့် Last Commit (HEAD) အကြား ကွာခြားချက် (Staged Changes)
git diff --staged
# သို့မဟုတ်
git diff --cached

# ၃။ ဖိုင်တစ်ခုတည်း၏ ပြောင်းလဲမှုကို သီးသန့်ကြည့်ရှုခြင်း
git diff src/main/java/App.java

# ၄။ Branch နှစ်ခုအကြား ကွာခြားချက်ကို နှိုင်းယှဉ်ခြင်း
git diff main..feature/auth
```

---

## 🚀 ၅။ Modern Git 2.23+ Navigation (`switch` & `restore`)

ရှေးယခင်က `git checkout` command တစ်ခုတည်းဖြင့် Branch ပြောင်းခြင်းရော၊ ဖိုင်အမှိုက်ရှင်းခြင်းပါ လုပ်ဆောင်ရသဖြင့် ရှုပ်ထွေးမှုများစွာ ဖြစ်ပေါ်ခဲ့ပါသည်။ Git 2.23 မှစ၍ တာဝန်များကို သီးခြားခွဲထုတ်လိုက်ပါသည် -

### က။ Branch ကူးပြောင်းရန် — `git switch`

```bash
# ရှိပြီးသား Branch သို့ ကူးပြောင်းခြင်း
git switch main

# Branch အသစ်ဆောက်ပြီး တစ်ခါတည်း switch လုပ်ခြင်း (Classic: git checkout -b ...)
git switch -c feature/payment-gateway

# ယခင်ရောက်ခဲ့သော နောက်ဆုံး Branch သို့ ပြန်ကူးခြင်း (Toggle back)
git switch -
```

### ခ။ ဖိုင်များ ပြန်လည်ပြင်ဆင်/Discard လုပ်ရန် — `git restore`

```bash
# Working Directory ထဲရှိ မလိုလားအပ်သော ပြင်ဆင်မှုများကို မူလအတိုင်း ဖျက်ပစ်ခြင်း
git restore src/App.js

# Staging Area ထဲ ရောက်နေသော ဖိုင်ကို Staging မှ ပြန်ထုတ်ခြင်း (Unstage)
git restore --staged src/App.js

# ဖိုင်တစ်ခုလုံးကို commit တစ်ခုခု၏ မူလအခြေအနေအတိုင်း အစားထိုးဆွဲယူခြင်း
git restore --source=HEAD~2 config.json
```

---

## 📊 ၆။ Git Log ကို သန့်ရှင်းလှပစွာ စစ်ဆေးခြင်း (Pretty Logs)

Default `git log` သည် စာမျက်နှာအပြည့် နေရာယူလေ့ရှိသဖြင့် Team အတွင်း Commit History ကို ရှင်းလင်းစွာ မြင်နိုင်ရန် အောက်ပါ format ကို အသုံးပြုပါ -

```bash
git log --graph --oneline --decorate --all
```

### Senior Developer Alias သတ်မှတ်ခြင်း

Terminal တွင် အမြဲတမ်း စာကြောင်းရှည် မရိုက်ရစေရန် Shortcut Alias အဖြစ် သတ်မှတ်ထားနိုင်ပါသည် -

```bash
git config --global alias.lg "log --graph --oneline --decorate --all"
```

ယခုအခါ `git lg` ဟု ရိုက်နှိပ်ရုံဖြင့် လှပသော Branch Graph များကို Terminal တွင် တွေ့မြင်ရမည် ဖြစ်ပါသည်။
