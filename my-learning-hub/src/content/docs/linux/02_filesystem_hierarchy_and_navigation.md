---
title: Phase 1 Lesson 2 — Filesystem Hierarchy & Navigation
description: Linux Filesystem Hierarchy Standard (FHS), Directory တည်ဆောက်ပုံ (/, /etc, /var, /usr, /opt), Absolute vs Relative Paths နှင့် ဖိုင်လမ်းညွှန် command များ (မြန်မာဘာသာ)
---

# 📁 Phase 1 — Lesson 2: Filesystem Hierarchy Standard (FHS) & File Navigation

Windows စနစ်တွင် `C:\`, `D:\` စသည့် Drive အကွက်များဖြင့် စတင်သော်လည်း Linux တွင် Drive ဟူ၍ မရှိပါ။ Linux တွင် သိုလှောင်မှုစနစ်တစ်ခုလုံးသည် Root Directory ဟုခေါ်သော **Single Inverted Tree (`/`)** အောက်တွင်သာ စုစည်းတည်ရှိပါသည်။

ဤအခန်းတွင် **Filesystem Hierarchy Standard (FHS)**, အရေးကြီးသော System Directories များ၏ တာဝန်များ၊ **Absolute vs Relative Paths** နှင့် နေ့စဉ်အသုံးပြုရမည့် File Navigation command များကို အသေးစိတ် လေ့လာသွားပါမည်။

---

## 💡 ၁။ What is it? (Filesystem Hierarchy Standard ဆိုတာ ဘာလဲ)

**Filesystem Hierarchy Standard (FHS)** ဆိုသည်မှာ Linux Distribution အားလုံး (Ubuntu, Debian, RHEL, CentOS) တွင် မည်သည့်ဖိုင်ကို မည်သည့် Folder ထဲ၌ စနစ်တကျ သိမ်းဆည်းရမည်ဟု ကမ္ဘာလုံးဆိုင်ရာ စံသတ်မှတ်ထားသော Directory ဖွဲ့စည်းပုံ ဖြစ်ပါသည်။

### Linux Directory Tree Architecture

```
/ (Root Directory - စနစ်တစ်ခုလုံး၏ အစ)
├── bin -> usr/bin       # Essential User Binaries (ls, cp, rm, bash စသည့် command များ)
├── boot/                # Linux Kernel image နှင့် GRUB bootloader ဖိုင်များ
├── dev/                 # Device files (Hard disk /dev/sda, Terminal /dev/pts, Random /dev/urandom)
├── etc/                 # System Configurations (nginx.conf, sshd_config, passwd, fstab)
├── home/                # ပုံမှန် User များ၏ Personal Directories (/home/ubuntu, /home/john)
├── root/                # Superuser (root) ၏ သီးသန့် Home Directory
├── lib -> usr/lib       # Shared Libraries (.so files)
├── opt/                 # Optional Add-on Software (Google Chrome, Datadog agent, Custom Apps)
├── proc/                # Virtual Filesystem (လက်ရှိ CPU, RAM, Kernel state ကို RAM ထဲတွင် ပြသထားသည်)
├── sys/                 # Virtual Filesystem (Hardware subsystem အချက်အလက်များ)
├── tmp/                 # Temporary Files (စက် restart ချပါက အလိုအလျောက် ပျက်စီးသည်)
├── usr/                 # User Utilities & Applications (/usr/bin, /usr/lib, /usr/local)
└── var/                 # Variable Data (logs /var/log, databases /var/lib/mysql, web /var/www)
```

---

## 🎯 ၂။ Why do we need it? (SysAdmin တစ်ဦး အဘယ်ကြောင့် ဤဖွဲ့စည်းပုံကို အလွတ်ရထားရမည်နည်း)

Production Incident တစ်ခု ဖြစ်ပေါ်လာပါက (ဥပမာ- Disk 100% ပြည့်သွားခြင်း၊ Web Server Crash ဖြစ်ခြင်း) Senior Engineer တစ်ဦးသည် မည်သည့်နေရာကို ဦးစွာ သွားရမည်ကို ချက်ချင်း သိရှိရပါမည် -
* **Configuration ပြင်ဆင်လိုပါက**: `/etc/` သို့ သွားရမည်။
* **Log ဖိုင်များ စစ်ဆေးလိုပါက**: `/var/log/` သို့ သွားရမည်။
* **Disk ပြည့်နေပါက**: များသောအားဖြင့် `/var/log/` သို့မဟုတ် `/var/lib/docker/` တွင် ကြီးမားနေတတ်သည်။
* **Custom Enterprise Application ထည့်သွင်းလိုပါက**: `/opt/` သို့မဟုတ် `/var/www/` သို့ သွားရမည်။

---

## 🧭 ၃။ Absolute Path vs Relative Path (လမ်းကြောင်း အမျိုးအစား ၂ မျိုး)

1. **Absolute Path (ပြည့်စုံသော လမ်းကြောင်း)**:
   * အမြဲတမ်း Root (`/`) ဖြင့် စတင်ပါသည်။ မိမိ မည်သည့်နေရာတွင် ရောက်နေသည်ဖြစ်စေ တိကျသော လမ်းကြောင်းအမှန်ကို ရောက်ရှိစေသည်။
   * ဥပမာ: `/etc/nginx/nginx.conf`, `/var/log/syslog`
2. **Relative Path (လက်ရှိနေရာ အခြေခံ လမ်းကြောင်း)**:
   * မိမိလက်ရှိ ရောက်ရှိနေသော Directory (Current Working Directory) မှ အခြေခံ၍ ရည်ညွှန်းသည်။
   * `.` (လက်ရှိ Directory ကို ကိုယ်စားပြုသည်)
   * `..` (Parent Directory / အပေါ် ၁ ဆင့်ဖိုဒါကို ကိုယ်စားပြုသည်)
   * ဥပမာ: `cd ../nginx`, `./start.sh`

---

## ⌨️ ၄။ Important Commands & Breakdown

### က။ လက်ရှိတည်နေရာနှင့် လမ်းညွှန်ခြင်း (`pwd`, `cd`)

```bash
pwd
cd /var/log
cd ..
cd ~
cd -
```
* **Command Breakdown**:
  * `pwd`: **P**rint **W**orking **D**irectory (လက်ရှိ ရောက်ရှိနေသော absolute path ကို ပြပါ)။
  * `cd /var/log`: `/var/log` Directory ထဲသို့ ဝင်ရောက်ပါ။
  * `cd ..`: အပေါ် ၁ ဆင့် (Parent directory) သို့ ပြန်ထွက်ပါ။
  * `cd ~` (သို့မဟုတ် `cd` သက်သက်): မိမိ၏ Home Directory (`/home/username`) သို့ ချက်ချင်း ပြန်ရောက်စေသည်။
  * `cd -`: ယခင်ရောက်ခဲ့သော နောက်ဆုံး Directory သို့ ပြန်ကူးပါ (Toggle back)။

### ခ။ ဖိုင်စာရင်း စစ်ဆေးကြည့်ရှုခြင်း (`ls`)

```bash
ls -la /var/log
```
* **Options Breakdown**:
  * `-l`: Long listing format (Permissions, Owner, Size, Modified Date များကို အသေးစိတ် ဇယားဖြင့် ပြပါ)။
  * `-a`: All files (Hidden files ဖြစ်သော `.` ဖြင့် စသည့် ဖိုင်များပါ အကုန်ပြပါ)။
  * `-h`: Human-readable sizes (Bytes အစား `4.2K`, `12M`, `1.5G` ဖြင့် ဖတ်ရလွယ်အောင် ပြပါ)။

### ဂ။ ဖိုင်နှင့် ဖိုဒါများ ဖန်တီးခြင်း၊ ကူးယူခြင်း၊ ဖျက်ခြင်း

```bash
# Directory အဆင့်ဆင့် တစ်ခါတည်း ဆောက်ခြင်း (-p: parents)
mkdir -p /tmp/myapp/config

# ဖိုင်အလွတ် ဖန်တီးခြင်း
touch /tmp/myapp/config/app.env

# ဖိုဒါတစ်ခုလုံး ကူးယူခြင်း (-r: recursive)
cp -r /tmp/myapp /tmp/myapp_backup

# ဖိုင်ရွှေ့ခြင်း သို့မဟုတ် နာမည်ပြောင်းခြင်း
mv /tmp/myapp/config/app.env /tmp/myapp/config/production.env

# ဖိုင် သို့မဟုတ် ဖိုဒါကို ဖျက်ပစ်ခြင်း (-r: recursive, -f: force prompt မတောင်းဘဲ)
rm -rf /tmp/myapp_backup
```

> **🚨 Senior Safety Warning**: Linux တွင် Recycle Bin (အမှိုက်ပုံး) မရှိပါ။ `rm -rf` ဖြင့် ဖျက်လိုက်ပါက စက္ကန့်ပိုင်းအတွင်း ထာဝရ ပျက်စီးသွားပါမည်။ မည်သည့်အခါမျှ `rm -rf /` သို့မဟုတ် `rm -rf /*` မရိုက်မိပါစေနှင့်!

### ဃ။ ဖိုင်များ ရှာဖွေခြင်း (`find`)

```bash
find /var/log -type f -name "*.log"
```
* `find /var/log`: `/var/log` အောက်တွင် စတင်ရှာပါ။
* `-type f`: Directory မဟုတ်ဘဲ File သက်သက်ကိုသာ ရှာပါ။
* `-name "*.log"`: အမည်နောက်တွင် `.log` ဆုံးသော ဖိုင်အားလုံးကို ရှာပါ။

---

## 🏋️ ၅။ Hands-on Practice & Exercises

သင်၏ Ubuntu Lab (Multipass shell) တွင် အောက်ပါ အဆင့်များကို လေ့ကျင့်ပါ:

1. `pwd` ရိုက်ပြီး မိမိလက်ရှိ မည်သည့် directory တွင် ရောက်နေသည်ကို စစ်ဆေးပါ။
2. `cd /etc` သို့ ဝင်ပြီး `ls -la` ဖြင့် စနစ် configuration ဖိုင်များကို လေ့လာပါ။
3. `cd /var/log` သို့ သွားပြီး မည်သည့် log ဖိုင်များ ရှိသည်ကို ကြည့်ပါ။
4. `mkdir -p ~/projects/web/src` ဖြင့် Nested Directory ဆောက်ပါ။
5. `touch ~/projects/web/src/index.html` ဖြင့် ဖိုင်တစ်ခု ဆောက်ပါ။
6. `find ~/projects -name "index.html"` ဖြင့် ပြန်လည်ရှာဖွေပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: Linux တွင် Server Configurations များ သိမ်းဆည်းသည့် Directory နှင့် Log files များ သိမ်းဆည်းသည့် Directory အမည်မှာ အဘယ်နည်း?
2. **မေးခွန်း ၂**: `cd ..` နှင့် `cd -` ၏ လုပ်ဆောင်ချက် ကွာခြားချက်မှာ အဘယ်နည်း?
3. **မေးခွန်း ၃**: `mkdir /app/backend/api` ရိုက်ရာတွင် `No such file or directory` ဟု တက်လာပါက မည်သည့် Option ထည့်ပေးရမည်နည်း? အဘယ်ကြောင့်နည်း?
