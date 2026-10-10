---
title: Disaster Recovery, Advanced Git Tools & Troubleshooting
description: git reflog အသက်ကယ်နည်း, Soft vs Mixed vs Hard Reset, git revert, git cherry-pick, git bisect bug ရှာနည်းနှင့် Detached HEAD ဖြေရှင်းနည်း (မြန်မာဘာသာ)
---

# 🧯 အခန်း ၆ — Disaster Recovery, Advanced Git Tools & Troubleshooting

Senior Developer တစ်ဦး၏ တန်ဖိုးအစစ်အမှန်သည် အရာအားလုံး အဆင်ပြေချောမွေ့နေချိန်တွင် မဟုတ်ဘဲ **"မှားယွင်းပြီး ကုဒ်များ ပျောက်ဆုံးသွားပြီဟု ထင်ရသော အရေးပေါ် အခြေအနေများ"** တွင် ပေါ်လွင်လာလေ့ရှိပါသည်။

Git တွင် ကုဒ်တစ်ခုကို Commit ပြုလုပ်ပြီးသွားပါက ထိုကုဒ်သည် စက်တွင်းမှ လုံးဝပျောက်ကွယ်သွားခြင်း မရှိသလောက် ရှားပါးပါသည်။ ဤအခန်းတွင် မတော်တဆ `git reset --hard` လုပ်မိခြင်းမှ အသက်ကယ်ဆယ်ပေးနိုင်သော **`git reflog`**, **Reset vs Revert**, **`git cherry-pick`**, Bug ရှာဖွေရေး စက်ရုပ် **`git bisect`** နှင့် **Detached HEAD** ဖြေရှင်းနည်းများကို လေ့လာသွားပါမည်။

---

## 🦸‍♂️ ၁။ `git reflog`: The Ultimate Undo Safety Net (အသက်ကယ် ကိရိယာ)

Developer အများစုသည် `git reset --hard HEAD~5` ကို မတော်တဆ ရိုက်နှိပ်မိပြီး လွန်ခဲ့သော ၅ ရက်လုံး လုပ်ဆောင်ခဲ့သမျှ ကုဒ်များ ပျောက်ဆုံးသွားပြီဟု ယူဆကာ ထိတ်လန့်သွားတတ်ကြသည်။

**Git ၏ လျှို့ဝှက်ချက်**: Git သည် `HEAD` pointer ရွေ့လျားသွားသည့် အကြိမ်တိုင်း (Commit, Checkout, Switch, Rebase, Reset) ကို `.git/logs/HEAD` ဟူသော မှတ်တမ်းစာအုပ်ထဲတွင် သိုလှောင်ထားပါသည်။ ထို commit များသည် အနည်းဆုံး ရက် ၃၀ မှ ၉၀ အထိ Garbage Collection (`git gc`) မလုပ်မချင်း စက်တွင်း၌ နဂိုအတိုင်း ကျန်ရှိနေပါသည်။

```bash
git reflog
```

Output နမူနာ:
```
3a1b2c4 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~5   <-- မှားယွင်းစွာ reset လုပ်လိုက်မိသော အဆင့်
9f8e7d6 HEAD@{1}: commit: feat(checkout): implement payment gateway logic <-- ကယ်ဆယ်ရမည့် commit!
5c4b3a2 HEAD@{2}: commit: fix: address circular dependency in auth
...
```

### 🚨 ကယ်ဆယ်နည်း အဆင့် ၁ — Commit ကို ရှာဖွေပြီး Branch အသစ် ထုတ်ယူခြင်း

ပျောက်ဆုံးသွားသည်ဟု ထင်ရသော Commit `9f8e7d6` ကို တွေ့ရှိပါက ထိုနေရာမှ Branch အသစ်တစ်ခု ချက်ချင်း ဖန်တီးလိုက်ပါ -

```bash
git branch rescue-payment 9f8e7d6
```
*အံ့သြဖွယ်ကောင်းစွာပင် ပျောက်ဆုံးသွားသော ကုဒ်အားလုံး `rescue-payment` branch အနေဖြင့် ၁ စက္ကန့်အတွင်း ၁၀၀% ပြန်လည် ရရှိသွားပါမည်။*

### 🚨 ကယ်ဆယ်နည်း အဆင့် ၂ — မှားယွင်းစွာ Branch ဖျက်မိခြင်းကို ပြန်ဆယ်နည်း

အကယ်၍ `git branch -D feature/login` ဟု ရိုက်နှိပ်ပြီး unmerged branch ကို ဖျက်မိခဲ့လျှင်ပင် `git reflog` ထဲတွင် ထို branch ၏ နောက်ဆုံး commit hash ကို ရှာဖွေပြီး အောက်ပါအတိုင်း ပြန်လည် ဖန်တီးနိုင်ပါသည် -

```bash
git checkout -b feature/login 9f8e7d6
```

---

## 🔄 ၂။ Undoing Commits: Soft vs Mixed vs Hard Reset

Commit များကို နောက်ပြန်ဆုတ်လိုသောအခါ အောက်ပါ Reset Flag ၃ မျိုး၏ ကွာခြားချက်ကို သေချာစွာ နားလည်ထားရပါမည် -

```
                        HEAD~1 (Previous Commit)
                           ▲
     [ git reset --soft ]  │  (HEAD moves back, Changes stay STAGED in Index)
     [ git reset --mixed ] │  (HEAD moves back, Changes stay UNSTAGED in Working Tree)
     [ git reset --hard ]  │  (Nuclear: Overwrites HEAD, Index AND Working Tree!)
```

### က။ `git reset --soft HEAD~1`
* **လုပ်ဆောင်ချက်**: `HEAD` pointer ကို နောက်ဆုံး commit ၏ နောက်သို့ ၁ ဆင့် ဆုတ်လိုက်သည်။
* **ဖိုင်များ အခြေအနေ**: ပြင်ဆင်ထားသမျှ ကုဒ်အားလုံးသည် **Staging Area ထဲတွင် အသင့်ရှိနေဆဲ (Green)** ဖြစ်သည်။
* **အသုံးပြုရမည့် နေရာ**: Commit Message မှားသွား၍ ပြင်ချင်သောအခါ သို့မဟုတ် နောက်ဆုံး commit ၂ ခုကို တစ်ခုတည်းအဖြစ် ပေါင်းစပ် commit အသစ် ပြန်ထိုးချင်သောအခါ သုံးသည်။

### ခ။ `git reset --mixed HEAD~1` (Default)
* **လုပ်ဆောင်ချက်**: Flag မထည့်ပါက default ဖြစ်သည်။
* **ဖိုင်များ အခြေအနေ**: ပြင်ဆင်ထားသမျှ ကုဒ်များသည် မပျက်စီးဘဲ **Working Tree ထဲတွင် Unstaged အဖြစ် ကျန်ရှိနေသည် (Red)**။
* **အသုံးပြုရမည့် နေရာ**: Commit ကို ပြန်ဖြုတ်ပြီး ဖိုင်များကို အပိုင်းလိုက် စနစ်တကျ ပြန်လည် stage လုပ်လိုသောအခါ သုံးသည်။

### ဂ။ `git reset --hard HEAD~1` (The Nuclear Option)
* **လုပ်ဆောင်ချက်**: `HEAD` pointer, Staging Area နှင့် Working Tree သုံးခုစလုံးကို နောက်ဆုံး commit အဟောင်းအတိုင်း အတင်းအကျပ် အစားထိုး ဖျက်ပစ်သည်။
* **သတိပေးချက်**: မ commit ရသေးသော Uncommitted ဖိုင်များ ပါရှိပါက ထိုဖိုင်များသည် ထာဝရ ပျက်စီးသွားနိုင်ပါသည် (Reflog ထဲတွင်ပင် ရှာမတွေ့နိုင်ပါ)။

---

## 🛡️ ၃။ `git reset` vs `git revert` (Public Branches တွင် Safe ဖြစ်သော နည်းလမ်း)

> **အရေးကြီးသော ဥပဒေသ**: အခြားသူများနှင့် မျှဝေထားသော Public `main` branch ပေါ်သို့ ရောက်ရှိသွားပြီးသော Commit များကို နောက်ပြန်ဆုတ်လိုပါက **`git reset` ကို လုံးဝ မသုံးရပါ**!

အကြောင်းရင်းမှာ Reset သည် History ကို ဖျက်ပစ်သဖြင့် အခြား Developer များထံတွင် Error တက်စေသောကြောင့် ဖြစ်သည်။ ထိုအစား **`git revert`** ကို အသုံးပြုရပါမည်။

```bash
# ပြဿနာဖြစ်စေသော commit ကို ဆန့်ကျင်ဘက် အပြောင်းအလဲဖြင့် ဖျက်ပယ်သော Commit အသစ် ထိုးခြင်း
git revert a1b2c3d
```

`git revert` သည် မူလ Commit ကို မဖျက်ဘဲ ထို commit တွင် ထည့်ခဲ့သမျှကို ပြန်လည်နှုတ်ပယ်သော **Inverse Commit အသစ်** တစ်ခုကို ရှေ့သို့ ဆက်လက် ဖန်တီးပေးသဖြင့် အဖွဲ့သားအားလုံးအတွက် ၁၀၀% ဘေးကင်းလုံခြုံပါသည်။

### 💡 Merge Commit တစ်ခုကို Revert လုပ်နည်း
Merge commit တွင် Parent ၂ ခု ပါရှိသဖြင့် မည်သည့် parent ဘက်သို့ ပြန်ဆုတ်မည်ကို `-m 1` (Mainline parent) ဖြင့် ညွှန်ပြပေးရပါသည် -
```bash
git revert -m 1 <merge-commit-hash>
```

---

## 🍒 ၄။ `git cherry-pick`: လိုအပ်သော Commit ကိုသာ သီးသန့် ရွေးထုတ်ယူခြင်း

အခြား Developer တစ်ဦး၏ Branch ပေါ်တွင် Commit ပေါင်း ၃၀ ခန့် ပါရှိနေပြီး ၎င်းတို့အနက်မှ Production အတွက် အရေးပေါ်လိုအပ်သော **Bug Fix Commit ၁ ခုတည်းကိုသာ** မိမိ၏ `main` branch သို့ ယူဆောင်လိုပါက Cherry-pick ကို သုံးပါသည် -

```bash
# လက်ရှိ main branch ပေါ်သို့ အခြား branch မှ commit တစ်ခုတည်းကို ကူးယူထည့်သွင်းခြင်း
git switch main
git cherry-pick e4f5g6h
```

အကယ်၍ Cherry-pick လုပ်စဉ် Conflict ဖြစ်လာပါက -
1. ဖိုင်များကို Editor တွင် ရှင်းလင်းပြီး `git add <file>` ပြုလုပ်ပါ။
2. `git cherry-pick --continue` ဖြင့် ရှေ့ဆက်ပါ။
3. မယူတော့ဘဲ ဖျက်သိမ်းလိုပါက `git cherry-pick --abort` ကို သုံးပါ။

---

## 🕵️ ၅။ `git bisect`: Production Bug များကို Binary Search ဖြင့် အလိုအလျောက် ရှာဖွေခြင်း

Project တွင် လွန်ခဲ့သော ၂ လက Bug မရှိခဲ့ဘဲ ယနေ့တွင် Bug ဖြစ်နေသည်ဟု ဆိုပါစို့။ Commit ပေါင်း ၅၀၀ ကျော် ရှိနေသဖြင့် မည်သည့် Commit ကြောင့် Bug စတင်ဖြစ်ပွားခဲ့သည်ကို လူဖြင့် တစ်ခုချင်း စစ်ဆေးရန် မဖြစ်နိုင်တော့ပါ။

`git bisect` သည် **Binary Search Algorithm ($O(\log N)$)** ကို အသုံးပြု၍ ၉ ကြိမ်ခန့် စစ်ဆေးရုံဖြင့် တရားခံ Commit ကို တိကျစွာ ရှာဖွေဖော်ထုတ်ပေးပါသည် -

```bash
# ၁။ Bisect စတင်ပါ
git bisect start

# ၂။ လက်ရှိ commit သည် Bug ရှိနေကြောင်း သတ်မှတ်ပါ
git bisect bad

# ၃။ Bug မရှိခဲ့သော လွန်ခဲ့သည့် Release Tag သို့မဟုတ် Commit Hash ကို သတ်မှတ်ပါ
git bisect good v1.0.0
```

Git သည် Commit ၅၀၀ ၏ အလယ်ဗဟို (Commit ၂၅၀) ဆီသို့ အလိုအလျောက် switch ပေးပါမည်။
* Developer သည် ကုဒ်ကို run ကြည့်ပြီး Bug ရှိပါက `git bisect bad`၊ Bug မရှိပါက `git bisect good` ဟု ရိုက်ပေးရပါမည်။
* ဤသို့ဖြင့် Git သည် အပိုင်းဝက်စီ ခွဲခြမ်းသွားပြီး နောက်ဆုံးတွင် အောက်ပါအတိုင်း တရားခံကို ထုတ်ဖော်ပြသပေးပါမည် -

```
7a8b9c0d is the first bad commit
Author: John Doe <john@example.com>
Date:   Mon Oct 5 14:20:11 2026

    fix: change token expiration calculation logic
```

အလုပ်ပြီးဆုံးပါက မူလနေရာသို့ ပြန်သွားရန် -
```bash
git bisect reset
```

---

## 👻 ၆။ "Detached HEAD" ပြဿနာနှင့် ဖြေရှင်းနည်း

Terminal တွင် ရံဖန်ရံခါ အောက်ပါ ကြောက်မက်ဖွယ် သတိပေးချက်ကို တွေ့ရတတ်ပါသည် -

```
You are in 'detached HEAD' state. You can look around, make experimental changes...
```

### Detached HEAD ဆိုသည်မှာ အဘယ်နည်း?
ပုံမှန်အားဖြင့် `HEAD` သည် Branch Pointer (`main`) ကို ညွှန်ပြပြီး ထို Branch Pointer ကမှတစ်ဆင့် Commit Hash ကို ညွှန်ပြပါသည်။ သို့သော် Developer က `git checkout <commit-hash>` သို့မဟုတ် `git checkout <tag>` ဟု သီးသန့် Hash တစ်ခုကို တိုက်ရိုက်ရိုက်နှိပ်လိုက်သောအခါ `HEAD` သည် Branch ပေါ်တွင် မရှိတော့ဘဲ **Commit ပေါ်သို့ တိုက်ရိုက် ကပ်တွယ်သွားခြင်း** ဖြစ်ပါသည်။

### 💡 Detached HEAD တွင် ရေးသားမိသော ကုဒ်များကို မပျောက်ပျက်အောင် ကယ်ဆယ်နည်း
Detached HEAD ပေါ်တွင် ကုဒ်များ ပြင်ဆင်ပြီး commit ထိုးမိခဲ့ပါက အခြား branch သို့ switch လိုက်သည်နှင့် ထို commit များသည် လွင့်မျောပျောက်ကွယ်သွားနိုင်ပါသည်။

**ကယ်ဆယ်နည်း**: လက်ရှိ Detached HEAD ရှိနေသော နေရာမှ Branch အသစ်တစ်ခု ချက်ချင်း ဖန်တီးလိုက်ပါ -

```bash
git switch -c feature/my-saved-work
```
*ယခုအခါ Detached HEAD မဟုတ်တော့ဘဲ ပုံမှန် Named Branch အဖြစ် ပြောင်းလဲသွားသဖြင့် ကုဒ်များ ဘေးကင်းသွားပါပြီ။*

---

## 📝 Senior Developer Checklist (Summary)

1. **Commit လုပ်ပြီးသမျှ မည်သည့်အရာမှ အလွယ်တကူ မပျောက်ပါ**: ပြဿနာကြုံတိုင်း `git reflog` ကို အမြဲ သတိရပါ။
2. **Public branches ပေါ်တွင် Revert ကို သုံးပါ**: မည်သည့်အခါမျှ အများသုံး branch တွင် `reset --hard` သို့မဟုတ် force push မလုပ်ပါနှင့်။
3. **Branching သည် အခမဲ့ဖြစ်သည်**: စမ်းသပ်မှုတစ်ခုခု မလုပ်မီ `git branch backup-before-experiment` ဖြင့် backup pointer တစ်ခု ကြိုယူထားခြင်းသည် အကောင်းဆုံး အလေ့အကျင့် ဖြစ်ပါသည်။
