---
title: Phase 1 Lesson 3 — File Permissions, Ownership & sudo Privileges
description: Linux Permissions စနစ် (rwx, 755, 600), Ownership (chown), Users & Groups စီမံခန့်ခွဲမှု, sudo privileges နှင့် /etc/sudoers လုံခြုံရေး (မြန်မာဘာသာ)
---

# 🛡️ Phase 1 — Lesson 3: File Permissions, Ownership & sudo Privileges

Linux သည် မူလကတည်းက **Multi-User Operating System** အဖြစ် တည်ဆောက်ထားသဖြင့် မည်သည့် User သည် မည်သည့် ဖိုင်ကို ဖတ်ရှုခွင့်၊ ရေးသားခွင့်နှင့် Program အဖြစ် run ခွင့်ရှိသည်ကို တင်းကျပ်သော **File Permissions & Ownership** စနစ်ဖြင့် ကာကွယ်ထားပါသည်။

လုပ်ငန်းခွင်တွင် Web Server စတင်မရခြင်း (Permission Denied), Database မချိတ်ဆက်နိုင်ခြင်း သို့မဟုတ် SSH Key ချိတ်မရခြင်း ပြဿနာများ၏ ၇၀% သည် Permission မမှန်ကန်ခြင်းကြောင့် ဖြစ်ပါသည်။

---

## 💡 ၁။ What is it? (Permission စနစ် ဖွဲ့စည်းပုံ)

ဖိုင်တစ်ခုကို `ls -l` ဖြင့် စစ်ဆေးကြည့်ပါက အောက်ပါအတိုင်း တွေ့ရပါမည် -

```
-rwxr-xr-- 1 ubuntu developers 4096 Oct 10 23:00 deploy.sh
▲▲▲▲▲▲▲▲▲▲   ▲      ▲
││  │  │     │      │
││  │  │     │      └── Group Owner (အုပ်စုပိုင်ရှင်)
││  │  │     └──────── User Owner (ဖိုင်ပိုင်ရှင်)
││  │  └────────────── Others Permissions (လောကီသားအားလုံး၏ အခွင့်အရေး)
││  └───────────────── Group Permissions (Group အဖွဲ့ဝင်များ၏ အခွင့်အရေး)
│└──────────────────── User (Owner) Permissions (ဖိုင်ပိုင်ရှင်၏ အခွင့်အရေး)
└───────────────────── File Type (-: Regular file, d: Directory, l: Symlink)
```

### Permission တန်ဖိုး ၃ မျိုး (Binary & Octal Math)

| Permission | အက္ခရာ | Numeric Value | File အပေါ် သက်ရောက်မှု | Directory အပေါ် သက်ရောက်မှု |
| :---: | :---: | :---: | :--- | :--- |
| **Read** | `r` | **4** | ဖိုင်အတွင်းသားကို ဖတ်ရှုခွင့်ရှိသည် | Directory အတွင်းရှိ ဖိုင်စာရင်းကို `ls` ကြည့်ခွင့်ရှိသည် |
| **Write** | `w` | **2** | ဖိုင်ကို ပြင်ဆင်/ဖျက်ပစ်ခွင့်ရှိသည် | Directory ထဲတွင် ဖိုင်အသစ်ဆောက်/ဖျက်ခွင့်ရှိသည် |
| **Execute** | `x` | **1** | Script/Program အဖြစ် run ခွင့်ရှိသည် | Directory ထဲသို့ `cd` ဝင်ရောက်ခွင့်ရှိသည် |

* **Total Math**:
  * `rwx` = 4 + 2 + 1 = **7** (အကုန်လုံး ခွင့်ပြုသည်)
  * `rw-` = 4 + 2 + 0 = **6** (ဖတ်ခွင့်၊ ရေးခွင့်ရှိ၊ execute မရပါ)
  * `r-x` = 4 + 0 + 1 = **5** (ဖတ်ခွင့်နှင့် execute ရသည်၊ ပြင်မရပါ)
  * `r--` = 4 + 0 + 0 = **4** (ဖတ်ခွင့် သက်သက်)
  * `---` = 0 + 0 + 0 = **0** (မည်သည့်အခွင့်အရေးမျှ မရှိပါ)

---

## 🎯 ၂။ Production Standrad Permissions (လုပ်ငန်းခွင်သုံး စံနှုန်းများ)

* **`chmod 755` (`rwxr-xr-x`)**: Scripts, Web Directories, Public HTML files များအတွက် စံနှုန်း (Owner သည် အကုန်ရပြီး ကျန်သူများက ဖတ်/run ရုံသာရသည်)။
* **`chmod 644` (`rw-r--r--`)**: Standard Files (HTML, CSS, Image, Config) များအတွက် စံနှုန်း (Owner က ပြင်နိုင်ပြီး ကျန်သူများက ဖတ်ရုံသာရသည်)။
* **`chmod 600` (`rw-------`)**: **Secret Files & SSH Keys** (`id_rsa`, `.env`, Database passwords) များအတွက် မဖြစ်မနေ သတ်မှတ်ရမည့် စံနှုန်း (Owner တစ်ဦးတည်းသာ ဖတ်/ပြင်နိုင်သည်)။
* **`chmod 700` (`rwx------`)**: Private Directories (`~/.ssh` folder) များအတွက် စံနှုန်း။

---

## ⌨️ ၃။ Important Commands & Breakdown

### က။ Permissions ပြောင်းလဲခြင်း (`chmod`)

```bash
# Numeric Mode ဖြင့် ပြောင်းလဲခြင်း
chmod 755 deploy.sh
chmod 600 ~/.ssh/id_ed25519

# Symbolic Mode ဖြင့် Execute ခွင့် ဖြည့်စွက်ခြင်း (+x)
chmod +x build.sh
chmod u=rwx,g=rx,o=r test.txt
```

### ခ။ ဖိုင်ပိုင်ရှင်နှင့် Group ပြောင်းလဲခြင်း (`chown`, `chgrp`)

```bash
# ဖိုင်ပိုင်ရှင် User ကို deploy သို့ ပြောင်းလဲခြင်း
chown deploy app.jar

# User ရော Group ပါ တစ်ခါတည်း ပြောင်းလဲခြင်း (User:Group)
chown -R www-data:www-data /var/www/html
```
* **Options Breakdown**:
  * `-R` (Recursive): ထို Directory အောက်ရှိ Sub-folders နှင့် Files အားလုံးကိုပါ အလိုအလျောက် သက်ရောက်စေပါ။

### ဂ။ User နှင့် Group အသစ်များ စီမံခန့်ခွဲခြင်း

```bash
# ၁။ User အသစ်ဆောက်ခြင်း (-m: create home directory, -s: default shell)
sudo useradd -m -s /bin/bash developer1

# ၂။ စကားဝှက် သတ်မှတ်ပေးခြင်း
sudo passwd developer1

# ၃။ User အား sudo အုပ်စုထဲသို့ ထည့်သွင်းခြင်း (-aG: append to group)
sudo usermod -aG sudo developer1
```

---

## 👑 ၄။ `sudo` Privileges & `/etc/sudoers` လုံခြုံရေး

Linux တွင် **Root User (UID 0)** သည် စနစ်တစ်ခုလုံး၏ ဘုရင်ဖြစ်ပြီး မည်သည့်အရာကိုမဆို ဖျက်ဆီးပိုင်ခွင့်ရှိသည်။ Production Server များတွင် Root အကောင့်ဖြင့် တိုက်ရိုက် Login ဝင်ခြင်းကို ပိတ်ပင်ထားရပြီး ပုံမှန် User မှတစ်ဆင့် **`sudo` (SuperUser DO)** ဖြင့်သာ လိုအပ်သည့် command ကို ယာယီ အခွင့်အရေးတောင်းခံကာ run ရပါမည်။

### `/etc/sudoers` ပြင်ဆင်နည်း
Sudoers ဖိုင်ကို သာမန် text editor ဖြင့် တိုက်ရိုက် **ဘယ်သောအခါမှ မပြင်ရပါ** (Syntax မှားပါက Server ပေါ်တွင် sudo အားလုံး သေသွားနိုင်သည်)။ အမြဲတမ်း syntax စစ်ဆေးပေးသည့် command ဖြင့်သာ ပြင်ပါ:

```bash
sudo visudo
```

---

## 🏋️ ၅။ Hands-on Practice

1. Home folder တွင် Script တစ်ခု ဆောက်ပါ: `echo 'echo "Hello Server"' > hello.sh`
2. `./hello.sh` run ကြည့်ပါ။ (`Permission denied` ဟု တက်ပါမည်)။
3. `ls -l hello.sh` ဖြင့် permission ကို စစ်ဆေးပါ။
4. `chmod +x hello.sh` ပေးပြီး `./hello.sh` ကို ပြန်လည် run ကြည့်ပါ။
5. Private secret ဖိုင်တစ်ခု ဆောက်ပါ: `touch secrets.txt && chmod 600 secrets.txt`
6. `ls -l secrets.txt` ဖြင့် `-rw-------` ဖြစ်မဖြစ် အတည်ပြုပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: ဖိုင်တစ်ခုကို Owner အား ဖတ်/ရေး/run ခွင့်၊ Group အား ဖတ်/run ခွင့်၊ Other အား ဖတ်ရုံသာခွင့် ပေးလိုပါက Numeric chmod တန်ဖိုး မည်မျှ ပေးရမည်နည်း?
2. **မေးခွန်း ၂**: SSH Private Key (`id_rsa`) ဖိုင်တစ်ခုကို `chmod 777` ပေးမိပါက SSH ချိတ်ဆက်ရာတွင် အဘယ်ကြောင့် ချိတ်မရဘဲ Error တက်သွားသနည်း?
3. **မေးခွန်း ၃**: Web Server Document Root (`/var/www/html`) ရှိ ဖိုင်အားလုံးကို Nginx/Apache က ရေးသားခွင့်ရစေရန် မည်သည့် `chown` command ကို အသုံးပြုရမည်နည်း?
