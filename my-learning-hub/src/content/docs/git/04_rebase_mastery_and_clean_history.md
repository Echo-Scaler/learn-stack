---
title: Rebase Mastery, Interactive Rebase & Clean History
description: Rebase vs Merge အတွင်းပိုင်း နှိုင်းယှဉ်ချက်, Interactive Rebase (git rebase -i), Squashing & Fixup, The Golden Rule of Rebasing နှင့် Force Push Safe Guard (မြန်မာဘာသာ)
---

# 🪄 အခန်း ၄ — Rebase Mastery, Interactive Rebase & Clean History

Software Engineering အဖွဲ့အစည်းကြီးများတွင် Git Commit History သည် ကုမ္ပဏီ၏ တန်ဖိုးမဖြတ်နိုင်သော Documentation ဖြစ်ပါသည်။ Commit History ထဲတွင် `"wip"`, `"fix typo"`, `"test1"`, `"oops"` စသည့် မလိုအပ်သော အမှိုက် commit များ ပြည့်နှက်နေပါက နောင်တစ်ချိန်တွင် Bug ပြန်လည်ရှာဖွေရန် မဖြစ်နိုင်တော့ပါ။

Senior Developer များသည် Pull Request (PR) မတင်မီ **Interactive Rebase (`git rebase -i`)** ကို အသုံးပြု၍ မိမိ၏ local commits များကို သပ်ရပ်စွာ ပေါင်းစပ် (Squash) လေ့ရှိကြပါသည်။ ဤအခန်းတွင် **Rebase ၏ အတွင်းပိုင်းအလုပ်လုပ်ပုံ**, **Interactive Rebase Lab**, **The Golden Rule of Rebasing** နှင့် **`--force-with-lease`** တို့ကို အသေးစိတ် လေ့လာသွားပါမည်။

---

## 🔬 ၁။ Rebase ၏ အတွင်းပိုင်း အလုပ်လုပ်ပုံ (Under the Hood)

`git merge` သည် Branch နှစ်ခုကို Merge Commit ဖြင့် ချိတ်ဆက်ပေါင်းစည်းပေးသော်လည်း `git rebase` သည် **"အခြေခံအုတ်မြစ် (Base) ကို ပြောင်းလဲခြင်း"** ဖြစ်ပါသည်။

```
Before Rebase:
main:    A ─── B ─────── C (HEAD of main)
                \
feature:         D ─── E (HEAD of feature)

After Rebase (`git switch feature` -> `git rebase main`):
main:    A ─── B ─────── C
                          \
feature:                   D' ─── E' (New hashes! Replayed on top of C)
```

### Rebase လုပ်ဆောင်သည့် အဆင့် ၅ ဆင့် (Step-by-Step Replay Process)
1. Git သည် `main` နှင့် `feature` တို့၏ ဘုံဘိုးဘေး (Common Ancestor) ဖြစ်သော Commit B ကို ရှာဖွေသည်။
2. Feature branch ပေါ်ရှိ Commit D နှင့် E တို့ကို ယာယီ Patch ဖိုင်များအဖြစ် သိမ်းဆည်းလိုက်သည်။
3. Feature branch ၏ pointer ကို `main` ၏ ထိပ်ဆုံးဖြစ်သော Commit C ဆီသို့ အတင်းအကျပ် Reset ချလိုက်သည်။
4. သိမ်းထားသော Patch Commit D နှင့် E တို့ကို Commit C ၏ ထိပ်ပေါ်သို့ **တစ်ဆင့်ပြီးတစ်ဆင့် အစမှပြန်လည် Run (Replay)** သည်။
5. **အလွန်အရေးကြီးသော အချက်**: Replay လုပ်ပြီး ထွက်ပေါ်လာသော Commit D' နှင့် E' တို့သည် ယခင် D, E တို့နှင့် တူညီသော်လည်း Parent ပြောင်းသွားသဖြင့် **SHA-1 Hash အသစ်စက်စက်များ** ဖြစ်သွားပါသည်။

### ⚖️ Rebase vs Merge နှိုင်းယှဉ်ချက် ဇယား

| Feature | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| **Commit History** | Non-linear (အကိုင်းအခက်များ၊ Merge nodes များဖြင့် ရှုပ်ထွေးနိုင်သည်) | **Linear (စာကြောင်းတစ်ကြောင်းတည်း ဖြောင့်တန်းလှပသော သမိုင်းကြောင်း)** |
| **Commit Hashes** | မူလ Commit Hashes များကို မပြောင်းလဲဘဲ ထိန်းသိမ်းထားသည် | **Commit Hashes အသစ်များဖြင့် History ကို ပြန်လည်ရေးသားသည် (Rewrites History)** |
| **Traceability** | Branch ခွဲထွက်သွားသည့် အချိန်နှင့် ဖြစ်စဉ်အမှန်ကို အပြည့်အစုံ ပြသသည် | သန့်ရှင်း၍ `git log` ဖတ်ရှုရ အလွန်လွယ်ကူသည် |
| **အသုံးပြုရမည့် နေရာ** | Public Shared Branches (`main`, `develop`) များ ပေါင်းစည်းရာတွင် သုံးသည် | **Local Private Feature Branches** များကို Clean up လုပ်ရာတွင် သုံးသည် |

---

## 🛠️ ၂။ Interactive Rebase (`git rebase -i`) လက်တွေ့ အသုံးချနည်း

Interactive Rebase သည် Developer များအား လွန်ခဲ့သော Commits များကို စိတ်ကြိုက် ပြန်လည်မွမ်းမံခွင့်ပေးသော အစွမ်းထက်ဆုံး Git Tool ဖြစ်ပါသည်။

### Scenario: စမ်းသပ်ထားသော အမှိုက် Commits များကို ရှင်းလင်းခြင်း

ကျွန်ုပ်တို့သည် Login feature ရေးရင်း အောက်ပါအတိုင်း commit ၅ ခု ပြုလုပ်ထားမိသည် ဆိုပါစို့ -

```bash
git log --oneline -5
# a1b2c3d (HEAD -> feature/login) fix typo
# e4f5g6h oops forgot css
# 7i8j9k0 test again
# 1l2m3n4 add password validation
# 5o6p7q8 initial login form
```

အထက်ပါ commit ၅ ခုကို `main` သို့ PR မတင်မီ Commit တစ်ခုတည်းအဖြစ် သပ်ရပ်စွာ ပေါင်းစည်း (Squash) လိုပါက -

```bash
git rebase -i HEAD~5
```

Terminal တွင် Text Editor ပွင့်လာပြီး အောက်ပါအတိုင်း စာရင်းပေါ်လာပါမည် -

```git
pick 5o6p7q8 initial login form
pick 1l2m3n4 add password validation
pick 7i8j9k0 test again
pick e4f5g6h oops forgot css
pick a1b2c3d fix typo

# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = meld into previous commit (keeps commit message)
# f, fixup <commit> = like "squash", but discard this commit's log message
# d, drop <commit> = remove commit completely
```

### Squash & Fixup ပြုလုပ်ရန် စာသားများကို အောက်ပါအတိုင်း ပြင်ဆင်ပါ -

```git
pick 5o6p7q8 initial login form
squash 1l2m3n4 add password validation
fixup 7i8j9k0 test again
fixup e4f5g6h oops forgot css
fixup a1b2c3d fix typo
```

* **`pick`**: ပထမဆုံး commit ကို အခြေခံအဖြစ် ထားရှိမည်။
* **`squash`**: ဒုတိယ commit ကို ပထမ commit ထဲ ပေါင်းထည့်မည် (message ကို ပြင်ခွင့်ပေးမည်)။
* **`fixup`**: ကျန်ရှိသော typo နှင့် test commit များကို ပထမ commit ထဲသို့ တိတ်တဆိတ် ပေါင်းထည့်ပြီး အမှိုက် message များကို အပြီးဖျက်ပစ်မည်။

ဖိုင်ကို Save ပြီး ပိတ်လိုက်ပါက Git သည် commit ၅ ခုလုံးကို ပေါင်းစည်းပြီး Commit အသစ်တစ်ခုတည်း ဖြစ်သွားပါမည် -

```bash
git log --oneline -1
# 9z8y7x6 (HEAD -> feature/login) feat(auth): implement user login form with password validation
```
*အမှိုက် commit ၅ ခု ပျောက်ကွယ်သွားပြီး သန့်ရှင်းသော Production-grade Commit တစ်ခုတည်းသာ ကျန်ရှိပါတော့သည်။*

---

## ⚔️ ၃။ Rebase လုပ်နေစဉ် Conflict ဖြစ်လာပါက ဖြေရှင်းနည်း

Rebase သည် commit များကို တစ်ဆင့်ချင်းစီ replay လုပ်သဖြင့် replay အဆင့်တိုင်းတွင် conflict ဖြစ်ပေါ်နိုင်ပါသည်။

1. Conflict ဖြစ်သော ဖိုင်များကို Editor တွင် ရှင်းလင်းပါ။
2. ဖိုင်ကို Stage လုပ်ပါ:
   ```bash
   git add <resolved-file>
   ```
3. **သတိပြုရန်**: Rebase လုပ်နေစဉ်အတွင်း `git commit` **လုံးဝ မရိုက်ရပါ**။ အောက်ပါ command ဖြင့်သာ ရှေ့ဆက်ရပါမည် -
   ```bash
   git rebase --continue
   ```
4. အကယ်၍ Rebase လုပ်ငန်းစဉ် အလွန်အမင်း ရှုပ်ထွေးသွားပြီး မူလအခြေအနေသို့ ပြန်ဆုတ်လိုပါက -
   ```bash
   git rebase --abort
   ```

---

## 🚫 ၄။ The Golden Rule of Rebasing (ရွှေစည်းမျဉ်း)

> **"NEVER rebase commits that exist outside your local repository on shared public branches!"**  
> *(အခြား လုပ်ဖော်ကိုင်ဖက်များနှင့် အတူတကွ မျှဝေသုံးစွဲနေသော Public Branch များဖြစ်သည့် `main`, `master`, `develop`, `release` ပေါ်တွင် ဘယ်သောအခါမှ Rebase မလုပ်ရ!)*

### အဘယ်ကြောင့် ဤစည်းမျဉ်းကို လိုက်နာရသနည်း?
Rebase လုပ်လိုက်တိုင်း Commit Hashes များ အသစ်ပြောင်းလဲသွားပါသည်။ အကယ်၍ Developer တစ်ဦးက `main` branch ကို rebase လုပ်ပြီး force push လုပ်လိုက်ပါက Team ထဲရှိ အခြား Developer အားလုံး၏ Local Repo များတွင် Parent မတူညီသော Duplicate Commits များ ဖြစ်ပေါ်ကာ Merge History တစ်ခုလုံး ပျက်စီးသွားမည် ဖြစ်ပါသည်။

* **Rebase ကို မည်သည့်အခါ သုံးရမည်နည်း**: မိမိတစ်ဦးတည်းသာ ရေးသားနေသော Local Private Feature Branch ပေါ်တွင် PR မတင်မီ History သန့်ရှင်းစေရန်သာ သုံးရပါမည်။

---

## 🛡️ ၅။ Rebase ပြီးနောက် လုံခြုံစွာ Push ပြုလုပ်နည်း (`--force-with-lease`)

Rebase ပြုလုပ်ပြီးပါက Commit Hashes များ ပြောင်းသွားသဖြင့် ပုံမှန် `git push` သည် Remote မှ ငြင်းပယ် (Reject) ခံရပါမည်။

ထိုအခါ အချို့သော Developer များသည် `git push --force` (သို့မဟုတ် `-f`) ကို ရမ်းသမ်း အသုံးပြုတတ်ကြသည်။

### 🚨 `git push --force` ၏ အန္တရာယ်
အကယ်၍ မိမိ force push မလုပ်မီ စက္ကန့်ပိုင်းအလိုတွင် လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက ထို Feature Branch ပေါ်သို့ commit အသစ်တစ်ခု push လိုက်မိပါက `git push --force` သည် ထိုလုပ်ဖော်ကိုင်ဖက်၏ commit ကို သတိပေးချက်မရှိဘဲ **ထာဝရ ဖျက်ဆီး (Overwrite)** ပစ်မည် ဖြစ်ပါသည်။

### ✅ Industry Standard: `git push --force-with-lease`

```bash
git push --force-with-lease origin feature/login
```

**အလုပ်လုပ်ပုံ**: Git သည် Remote Branch ပေါ်တွင် အခြားသူတစ်ဦးဦး၏ Commit အသစ် ရောက်ရှိနေခြင်း ရှိ/မရှိ ဦးစွာ Lease Check စစ်ဆေးပါသည်။ အကယ်၍ အခြားသူက commit အသစ်တင်ထားပါက push ကို ရပ်တန့်ပေးပြီး မတော်တဆ data loss ဖြစ်ခြင်းမှ ၁၀၀% ကာကွယ်ပေးပါသည်။
