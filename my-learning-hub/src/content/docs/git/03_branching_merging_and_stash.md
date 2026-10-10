---
title: Branching Strategies, Merge Conflicts & Git Stash
description: Branch သဘောတရား, Fast-Forward vs 3-Way Merge, Merge Conflicts ဖြေရှင်းနည်းနှင့် git stash အသုံးချပုံ (မြန်မာဘာသာ)
---

# 🌿 အခန်း ၃ — Branching Strategies, Merge Conflicts & Git Stash

Git ၏ အကြီးမားဆုံး အားသာချက်တစ်ခုမှာ **Branching (အကိုင်းအခက် ခွဲထုတ်ခြင်း)** သည် အလွန်ပေါ့ပါးမြန်ဆန်ပြီး Team တစ်ခုအတွင်း လူအများအပြား တစ်ပြိုင်နက်တည်း အပြိုင်ကုဒ်ရေးသားနိုင်ခြင်း ဖြစ်ပါသည်။

သို့သော် မတူညီသော Branch များကို ပြန်လည်ပေါင်းစည်း (Merge) သောအခါ **Merge Conflicts (ကုဒ်တိုက်ခိုက်မှုများ)** ဖြစ်ပေါ်တတ်ပြီး Developer အများစု စိတ်ဖိစီးရလေ့ရှိပါသည်။ ဤအခန်းတွင် Branch ၏ အတွင်းပိုင်းအလုပ်လုပ်ပုံ၊ **Fast-Forward vs 3-Way Merge**, Conflict ရှင်းလင်းနည်း အဆင့်ဆင့်နှင့် **Git Stash** အသုံးချပုံတို့ကို လေ့လာသွားပါမည်။

---

## 📌 ၁။ Git Branch ၏ အတွင်းပိုင်း သဘောတရား (Under the Hood)

အခြား Version Control စနစ်များတွင် Branch ဆောက်ခြင်းသည် ဖိုင်အားလုံးကို Folder အသစ်တစ်ခုထဲသို့ ကူးယူ (Copy) ရသဖြင့် လေးလံနှေးကွေးပါသည်။

Git တွင်မူ **Branch တစ်ခုဆိုသည်မှာ ၄၀ လုံးပါ Commit SHA-1 Hash ကို ညွှန်ပြထားသော 41-byte Pointer ဖိုင်ငယ်လေးတစ်ခု** သက်သက်သာ ဖြစ်ပါသည်။

```
Commit A (Hash: 1a2b) ◄─── Commit B (Hash: 3c4d) ◄─── Commit C (Hash: 5e6f)
                                                           ▲            ▲
                                                           │            │
                                                      main branch   feature branch
                                                                        ▲
                                                                        │
                                                                   HEAD pointer
```

* `git branch feature/cart`: `main` ညွှန်ပြနေသော Commit C ပေါ်တွင် pointer အသစ်တစ်ခု ဖန်တီးလိုက်ခြင်း ဖြစ်သည်။
* `git switch feature/cart`: `HEAD` pointer ကို `feature/cart` ဘက်သို့ ချိန်လိုက်ခြင်း ဖြစ်သည်။
* ထို့ကြောင့် Git တွင် Branch အသစ် ၁၀၀၀ ဆောက်လျှင်ပင် စက္ကန့်ပိုင်းမျှသာ ကြာမြင့်ပြီး Disk Space နေရာမယူပါ။

---

## 🔀 ၂။ Fast-Forward vs 3-Way Merge နှိုင်းယှဉ်ချက်

Feature Branch တစ်ခုကို `main` သို့ ပေါင်းစည်းသောအခါ အခြေအနေပေါ်မူတည်၍ Merge ပုံစံ ၂ မျိုး ဖြစ်ပေါ်ပါသည် -

### က။ Fast-Forward Merge (ရိုးရှင်းသော ရှေ့တိုး ပေါင်းစည်းမှု)

Feature Branch ခွဲထွက်သွားပြီးနောက် `main` branch တွင် မည်သည့် Commit အသစ်မှ တိုးမလာခဲ့ပါက Git သည် `main` pointer ကို Feature ၏ နောက်ဆုံး commit ဆီသို့ ရှေ့တိုးရွှေ့ပေးလိုက်ရုံသာ ပြုလုပ်ပါသည်။ ထိုအခါ Merge Commit အသစ် ထွက်ပေါ်မလာပါ။

```
Before Merge:
main:    A ─── B
                \
feature:         C ─── D (HEAD)

After Fast-Forward Merge (`git merge feature`):
main & feature: A ─── B ─── C ─── D (HEAD)
```

### ခ။ 3-Way Merge (True Merge with Merge Commit)

Feature Branch ပေါ်တွင် အလုပ်လုပ်နေစဉ်အတွင်း `main` ပေါ်သို့လည်း အခြား Developer တစ်ဦး၏ Commit အသစ်များ ရောက်ရှိနှင့်နေပါက History သည် အကိုင်းနှစ်ခုအဖြစ် ခွဲထွက်သွားပါပြီ (Diverged)။ ထိုအခါ Git သည် Common Ancestor (ဘုံဘိုးဘေး Commit) ကို အခြေခံ၍ **3-Way Merge** ပြုလုပ်ကာ Parent ၂ ခုပါသော **Merge Commit** အသစ်တစ်ခုကို ဖန်တီးပေးပါသည်။

```
Before Merge:
main:    A ─── B ─────── E (New commit on main)
                \
feature:         C ─── D (New commit on feature)

After 3-Way Merge:
main:    A ─── B ─────── E ────── M (Merge Commit with 2 parents: E & D)
                \                /
feature:         C ─── D ───────┘
```

### 💡 `--no-ff` Flag (အဘယ်ကြောင့် Team Lead များက Fast-Forward ကို ပိတ်ထားခိုင်းသနည်း)

Fast-Forward ဖြစ်နိုင်သည့် အခြေအနေတွင်ပင် `git merge --no-ff feature` ဟု ပေးလိုက်ပါက Git သည် Merge Commit တစ်ခုကို အမြဲတမ်း အတင်းအကျပ် ဆောက်ပေးပါသည်။

**အကြောင်းရင်း**: Feature တစ်ခုတွင် commit ၁၀ ခုပါဝင်ခဲ့ပါက `--no-ff` ကြောင့် ထို ၁၀ ခုသည် Feature တစ်ခုတည်းအဖြစ် သပ်ရပ်စွာ အစုအဖွဲ့လိုက် မြင်တွေ့နိုင်ပြီး နောင်တစ်ချိန်တွင် ထို feature တစ်ခုလုံးကို ပြန်ဖျက်လိုပါက Merge Commit `M` တစ်ခုတည်းကို revert လုပ်ရုံဖြင့် ပြီးပြည့်စုံသောကြောင့် ဖြစ်ပါသည်။

---

## ⚔️ ၃။ Merge Conflicts ဖြေရှင်းနည်း အဆင့်ဆင့် (Step-by-Step Conflict Resolution)

Merge Conflict ဆိုသည်မှာ Developer နှစ်ဦးသည် **ဖိုင်တစ်ခုတည်း၏ တူညီသော စာကြောင်းနေရာကို တစ်ပြိုင်နက်တည်း မတူညီသော ကုဒ်များဖြင့် ပြင်ဆင်မိသောအခါ** Git က မည်သည့်ကုဒ်ကို ရွေးချယ်ရမည်မှန်း မဆုံးဖြတ်နိုင်တော့ဘဲ Developer ထံ ဆုံးဖြတ်ချက်တောင်းခံခြင်း ဖြစ်ပါသည်။

### Conflict Marker ဖွဲ့စည်းပုံ နားလည်ခြင်း

Conflict ဖြစ်ပါက ဖိုင်အတွင်း၌ အောက်ပါအတိုင်း ပေါ်လာပါမည် -

```javascript
<<<<<<< HEAD (Current Branch / main ပေါ်ရှိ လက်ရှိကုဒ်)
const API_BASE_URL = "https://api.production.domain.com/v1";
const TIMEOUT_MS = 5000;
=======
const API_BASE_URL = "https://api.v2.newservice.com";
const TIMEOUT_MS = 10000;
>>>>>>> feature/v2-upgrade (Incoming Branch / ပေါင်းစည်းမည့် အကိုင်းခွဲမှ ကုဒ်)
```

### Conflict ဖြေရှင်းခြင်း လုပ်ငန်းစဉ် (Resolution Checklist)

1. **Conflict ဖြစ်နေသော ဖိုင်များကို ရှာဖွေပါ**:
   ```bash
   git status
   # Output တွင် 'both modified: src/config.js' ဟု တွေ့ရပါမည်
   ```
2. **Code Editor (VS Code / IntelliJ) ဖြင့် ဖိုင်ကို ဖွင့်ပါ**:
   * မိမိနှင့် လုပ်ဖော်ကိုင်ဖက် နှစ်ဦးစလုံး၏ ကုဒ်ကို သုံးသပ်ပြီး လိုအပ်သော logic ကို ပေါင်းစပ်ပါ။
   * `<<<<<<< HEAD`, `=======`, `>>>>>>> feature/...` စာကြောင်းအမှတ်အသားများကို **လုံးဝ ဖျက်ပစ်ရပါမည်**။
3. **Application Build & Test ပြေးကြည့်ပါ**:
   * Conflict ရှင်းပြီးနောက် ကုဒ် Syntax error မရှိကြောင်း၊ Test များ အောင်မြင်ကြောင်း သေချာအောင် စစ်ဆေးပါ။
4. **Resolved အဖြစ် Staging Area သို့ ထည့်ပါ**:
   ```bash
   git add src/config.js
   ```
5. **Merge Commit ကို အပြီးသတ်ပါ**:
   ```bash
   git commit
   # သို့မဟုတ်
   git merge --continue
   ```

### 🚨 အရေးပေါ် အခြေအနေ — Merge ကို ဖျက်သိမ်းပြီး မူလအခြေအနေသို့ ပြန်ဆုတ်နည်း

Conflict များ လွန်စွာရှုပ်ထွေးနေပြီး ယခုချက်ချင်း မရှင်းနိုင်သေးပါက Merge မစတင်မီ အခြေအနေသို့ အပြည့်အဝ ပြန်ဆုတ်နိုင်ပါသည် -

```bash
git merge --abort
```

---

## 🧰 ၄။ Git Stash Deep Dive (မပြီးပြတ်သေးသော ကုဒ်များကို ယာယီသိမ်းဆည်းခြင်း)

မိမိသည် Feature အသစ်တစ်ခုကို ရေးသားနေဆဲ (half-baked code) ဖြစ်ပြီး commit လုပ်ရန် အဆင်မသင့်သေးချိန်တွင် Production ၌ အရေးပေါ် Hotfix ဝင်လာပါက အခြား branch သို့ switch လုပ်၍ မရနိုင်တော့ပါ (Git က Uncommitted changes များကြောင့် တားဆီးပါမည်)။

ထိုအခါ **Git Stash** သည် လက်ရှိ Working Directory နှင့် Staging Area ရှိ ပြောင်းလဲမှုများကို Clipboard အဖြစ် ယာယီသိမ်းဆည်းပေးပြီး သန့်ရှင်းသော Clean Working Directory ကို ပြန်လည် ဖန်တီးပေးပါသည်။

```
Working Directory (Dirty) ────► [ git stash push ] ────► Stash Stack (stash@{0})
                                                               │
                                                               ▼
Clean Directory ◄───────────── [ git stash pop ] ◄─────────────┘
```

### အသုံးများသော Stash Commands များ

```bash
# ၁။ နာမည်မှတ်ချက်ဖြင့် သပ်ရပ်စွာ Stash သိမ်းဆည်းခြင်း
git stash push -m "WIP: payment calculation logic"

# ၂။ Untracked ဖိုင်အသစ်များပါ မကျန်အောင် အကုန် Stash သိမ်းခြင်း (-u: include untracked)
git stash -u -m "WIP: new checkout component and untracked images"

# ၃။ သိမ်းဆည်းထားသော Stash စာရင်းကို ကြည့်ရှုခြင်း
git stash list
# Output:
# stash@{0}: On feature/cart: WIP: payment calculation logic
# stash@{1}: On main: Temporary debug config

# ၄။ နောက်ဆုံးသိမ်းထားသော Stash ကို ပြန်ထုတ်ယူပြီး စာရင်းမှ ဖျက်ပစ်ခြင်း (Pop)
git stash pop

# ၅။ Stash ကို ပြန်ယူသုံးသော်လည်း Stash စာရင်းထဲတွင် မဖျက်ဘဲ ဆက်ထားလိုပါက (Apply)
git stash apply stash@{0}

# ၆။ Stash တစ်ခုချင်းစီကို ရွေးချယ်ဖျက်ပစ်ခြင်း သို့မဟုတ် အကုန်ရှင်းထုတ်ခြင်း
git stash drop stash@{0}   # တစ်ခုတည်းဖျက်ခြင်း
git stash clear            # Stash အားလုံး အပြီးရှင်းခြင်း

# ၇။ Stash ထဲရှိ ကုဒ်များဖြင့် Branch အသစ်တစ်ခု တိုက်ရိုက်ခွဲထုတ်ခြင်း
git stash branch feature/resumed-cart stash@{0}
```

---

## 📝 အနှစ်ချုပ် အလေ့အကျင့်ကောင်းများ (Best Practices)

1. **Short-lived Feature Branches**: Branch တစ်ခုကို ရက်သတ္တပတ်ပေါင်းများစွာ အကြာကြီး မထားပါနှင့်။ ၂ ရက်မှ ၃ ရက်အတွင်း `main` သို့ merge သို့မဟုတ် PR တင်နိုင်အောင် Feature ကို သေးငယ်စွာ ခွဲထုတ်ပါ။
2. **Meaningful Branch Naming**: `feat/user-auth`, `fix/checkout-timeout`, `refactor/sql-query` စသဖြင့် Prefix သုံးစွဲပါ။
3. **Commit before Stash if possible**: Stash သည် ယာယီအတွက်သာ ဖြစ်ပြီး ရက်ကြာသွားပါက မေ့လျော့သွားနိုင်သဖြင့် WIP commit သဘောမျိုး commit လုပ်ထားခြင်းက ပိုမိုလုံခြုံစိတ်ချရပါသည်။
