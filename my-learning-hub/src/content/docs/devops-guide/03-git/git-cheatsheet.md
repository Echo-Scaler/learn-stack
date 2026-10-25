---
title: "🐙 DevOps Git Command Cheatsheet & Workflow Reference"
description: "🐙 DevOps Git Command Cheatsheet & Workflow Reference"
---


> **နေ့စဉ် အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် သုံးစွဲရသော Essential နှင့် Advanced Git Commands များ စုစည်းမှု**

---

## 📌 ၁။ အခြေခံ ဖိုင်နှင့် Commit စီမံခန့်ခွဲမှု (Basic Workflow)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git status` | Check working tree status | ပြင်ဆင်ထားသော ဖိုင်များ၊ Staging area အခြေအနေကို စစ်ဆေးသည်။ |
| `git add <file>` | Stage specific file | သီးခြား ဖိုင်တစ်ခုကို Staging area ထဲသို့ ထည့်သည်။ |
| `git add .` (သို့မဟုတ် `-A`) | Stage all changes | ပြင်ဆင်ထားသော ဖိုင်အားလုံး (Deleted ဖိုင်များ အပါအဝင်) ကို Staging area သို့ ထည့်သည်။ |
| `git commit -m "feat: message"` | Commit staged files | Conventional Commits စံနှုန်းဖြင့် commit သိမ်းဆည်းသည်။ |
| `git commit --amend --no-edit` | Amend last commit | နောက်ဆုံး commit ထဲသို့ မေ့ကျန်ခဲ့သော ပြင်ဆင်ချက်ကို အသံတိတ် ပေါင်းထည့်သည်။ |
| `git diff` | Diff working vs staged | Staging area သို့ မထည့်ရသေးသော ပြင်ဆင်ချက် ကုဒ်လိုင်းများကို ပြသည်။ |
| `git diff --staged` | Diff staged vs last commit | Commit တင်တော့မည့် ကုဒ် အပြောင်းအလဲများကို ပြသသည်။ |

---

## 🌿 ၂။ Branches နှင့် Switching (ခေတ်မီ `switch` / `restore` Syntax)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git branch -a` | List all local and remote branches | Local နှင့် Remote ရှိ branch အားလုံးကို စာရင်းထုတ်ပြသည်။ |
| `git switch <branch>` | Switch to existing branch | သတ်မှတ်ထားသော branch ဆီသို့ ကူးပြောင်းသည်။ |
| `git switch -c <new-branch>` | Create and switch to new branch | Branch အသစ် ဖောက်ပြီး တစ်ခါတည်း ပြောင်းရွှေ့သည် (`checkout -b` အစား သုံးသည်)။ |
| `git branch -d <branch>` | Delete merged branch safely | Main ထဲသို့ merge ပြီးသား branch အဟောင်းကို ဖျက်သည်။ |
| `git branch -D <branch>` | Force delete unmerged branch | Merge မလုပ်ရသေးသော်လည်း branch ကို အတင်း ဖျက်ပစ်သည်။ |

---

## 🔀 ၃။ Merging, Rebasing & Cherry-Pick

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git merge <branch>` | Merge branch into current | လက်ရှိ branch ထဲသို့ target branch ကို ပေါင်းထည့်သည်။ |
| `git rebase main` | Rebase current branch on main | လက်ရှိ branch ၏ commits များကို `main` ၏ ထိပ်ဆုံးသို့ ပြန်လည် အခြေပြုပြောင်းလဲသည်။ |
| `git rebase -i HEAD~N` | Interactive rebase last N commits | နောက်ဆုံး commit N ခုကို squash / edit / drop / reword လုပ်ရန် interactive editor ဖွင့်သည်။ |
| `git rebase --abort` | Abort rebase safely | Rebase လုပ်နေစဉ် conflict များလွန်းပါက မူလအခြေအနေသို့ ပြန်ဆုတ်သည်။ |
| `git cherry-pick <COMMIT_HASH>` | Apply specific commit to current branch | အခြား branch မှ သီးခြား commit တစ်ခုတည်းကိုသာ လက်ရှိ branch သို့ ကူးယူထည့်သွင်းသည်။ |

---

## 📦 ၄။ Stashing (အလုပ်မပြီးသေးသော ဖိုင်များကို ယာယီ ဖယ်သိမ်းခြင်း)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git stash` | Stash modified tracked files | ပြင်လက်စ code များကို ယာယီ ဖယ်ရှားသိမ်းဆည်းပေးသည်။ |
| `git stash -u` | Stash untracked files as well | အသစ်ဆောက်ထားသော untracked files များပါ မကျန် အကုန် သိမ်းသည်။ |
| `git stash list` | List all stashed changes | သိမ်းထားသော stash stack စာရင်းကို ပြသည်။ |
| `git stash pop` | Apply and remove latest stash | နောက်ဆုံး သိမ်းထားသော stash ကို ပြန်ထုတ်ယူပြီး stack မှ ဖျက်သည်။ |
| `git stash apply stash@{1}` | Apply specific stash without dropping | သီးခြား stash တစ်ခုကို ပြန်ယူသုံးသော်လည်း stack ထဲတွင် ချန်ထားသည်။ |
| `git stash drop` | Delete latest stash | မလိုတော့သော stash ကို ဖျက်ပစ်သည်။ |

---

## ⏪ ၅။ Undoing, Resetting & Restoring

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git restore <file>` | Discard changes in working directory | မ commit ရသေးသော ဖိုင်အပြောင်းအလဲများကို မူလအတိုင်း ပြန်ဆုတ်သည်။ |
| `git restore --staged <file>` | Unstage file | Staging area ရောက်နေသော ဖိုင်ကို working tree သို့ ပြန်ထုတ်သည်။ |
| `git revert <COMMIT_HASH>` | Invert commit safely | Public branch ပေါ်တွင် သမိုင်းကြောင်း မဖျက်ဘဲ ဆန့်ကျင်ဘက် commit ဆောက်၍ rollback ချသည်။ |
| `git reset --soft HEAD~1` | Undo commit, keep changes staged | နောက်ဆုံး commit ကို ဖျက်သော်လည်း code များကို staged အဖြစ် ချန်ထားသည်။ |
| `git reset --hard HEAD~1` | Undo commit, wipe all changes | နောက်ဆုံး commit နှင့် code များကို မူလအတိုင်း အပြီးတိုင် ဖျက်ပစ်သည် (**သတိဖြင့်သုံးရန်**)။ |
| `git clean -fd` | Force remove untracked files & dirs | Git မသိသေးသော အမှိုက်ဖိုင်များနှင့် folder များကို အကုန် ရှင်းထုတ်သည်။ |

---

## 🕵️ ၆။ History Inspection, Logs & Disaster Recovery

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git log --oneline --graph --all` | Pretty ASCII commit tree | Branch လမ်းခွဲများနှင့် commit များကို တစ်ကြောင်းချင်း သပ်ရပ်စွာ ပြသည်။ |
| `git show <COMMIT_HASH>` | Show commit details and diff | သီးခြား commit တစ်ခု၏ အသေးစိတ် code diff ကို ပြသည်။ |
| `git blame <file>` | Show author and commit per line | ဖိုင်၏ စာကြောင်းတစ်ကြောင်းချင်းစီကို မည်သူက မည်သည့်ရက်စွဲတွင် ရေးခဲ့သည်ကို ပြသည်။ |
| `git reflog` | Log of all HEAD movements | `reset`, `rebase`, `checkout` မှတ်တမ်းအားလုံးကို ပြပြီး ပျောက်သွားသော commits များကို ကယ်တင်နိုင်သည်။ |

---

## 🏷️ ၇။ Releases & Semantic Version Tags

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `git tag` | List all tags | Repository ရှိ Release tag အားလုံးကို ပြသည်။ |
| `git tag -a v1.2.0 -m "Release v1.2.0"` | Create annotated release tag | Message နှင့် author ပါဝင်သော Release tag ဖန်တီးသည်။ |
| `git push origin v1.2.0` | Push specific tag to remote | Tag တစ်ခုတည်းကို GitHub သို့ ပို့ဆောင်ပြီး CI/CD trigger ပြုလုပ်သည်။ |
| `git push origin --tags` | Push all local tags | Local ရှိ tag အားလုံးကို remote သို့ တစ်ပြိုင်နက် ပို့သည်။ |
| `git tag -d v1.2.0` | Delete local tag | Local tag ကို ဖျက်သည်။ |
| `git push origin --delete v1.2.0` | Delete remote tag | GitHub ပေါ်ရှိ release tag ကို ဖျက်ထုတ်သည်။ |
