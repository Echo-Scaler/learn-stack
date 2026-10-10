---
title: Phase 1 Lesson 1 — Linux Server Basics & Mac Lab Setup
description: Linux ဆိုတာဘာလဲ, Linux Server နှင့် Desktop ကွာခြားချက်, macOS vs Linux နှိုင်းယှဉ်ချက်, Linux Architecture နှင့် Mac ပေါ်တွင် Ubuntu Lab တည်ဆောက်ခြင်း (မြန်မာဘာသာ)
---

# 🐧 Phase 1 — Lesson 1: What is Linux, Linux Server & Mac Lab Setup

မင်္ဂလာပါ! ကျွန်ုပ်တို့၏ **Linux Server Engineering Course** မှ ကြိုဆိုပါသည်။ ဤပထမဆုံး Lesson တွင် Linux ၏ အနှစ်သာရ၊ Server များတွင် Linux ကို အဘယ်ကြောင့် ၉၀% ကျော် အသုံးပြုကြရသည့် အကြောင်းရင်း၊ သင်၏ Mac စက်နှင့် Linux မည်သို့ ကွာခြားပုံ၊ နှင့် Mac ပေါ်တွင် စမ်းသပ်ရန် **Ubuntu Server Virtual Lab** ကို စတင် တည်ဆောက်သွားပါမည်။

---

## 💡 ၁။ What is it? (Linux ဆိုတာ ဘာလဲ? Linux Server ဆိုတာ ဘာလဲ?)

### Linux ဆိုတာ ဘာလဲ?
**Linux** သည် ကွန်ပျူတာ၏ Hardware အစိတ်အပိုင်းများ (CPU, RAM, Hard Disk, Network Card) ကို ထိန်းချုပ်မောင်းနှင်ပေးသည့် **Open-Source Operating System Kernel (လည်ပတ်ရေးစနစ် ဗဟိုအူတိုင်)** ဖြစ်ပါသည်။ ၁၉၉၁ ခုနှစ်တွင် Linus Torvalds မှ စတင်တီထွင်ခဲ့ပြီး GNU Tools များနှင့် ပေါင်းစပ်ကာ ပြီးပြည့်စုံသော OS အဖြစ် ကမ္ဘာတစ်ဝှမ်းလုံးတွင် လွတ်လပ်စွာ အခမဲ့ အသုံးပြုနေကြပါသည်။

### Linux Server ဆိုတာ ဘာလဲ?
ကျွန်ုပ်တို့ နေ့စဉ်သုံးနေသော Windows သို့မဟုတ် macOS ကဲ့သို့ လှပသော Graphical User Interface (Mouse ဖြင့် ကလစ်နှိပ်ရသော မျက်နှာပြင်) မပါဝင်ဘဲ **Headless (မျက်နှာပြင်မပါသော)** ဖြစ်ပြီး **CLI (Command Line Interface - စာရိုက်၍ ခိုင်းစေရသော Terminal)** ဖြင့်သာ ၂၄ နာရီ ၃၆၅ ရက် မနားတမ်း ဝန်ဆောင်မှုပေးနေသော စနစ်ကို **Linux Server** ဟု ခေါ်ပါသည်။

---

## 🎯 ၂။ Why do we need it? (ဘာကြောင့် Linux Server ကို မဖြစ်မနေ လိုအပ်တာလဲ?)

ကမ္ဘာ့ Cloud စနစ်များ (AWS, Google Cloud, Azure)၊ နာမည်ကျော် Website များ (Google, Facebook, Netflix, Amazon) နှင့် Supercomputer အားလုံး၏ **၉၀% ကျော်** သည် Linux Server ပေါ်တွင်သာ လည်ပတ်နေပါသည်။

အကြောင်းရင်းများမှာ -
1. **Stability & Uptime (တည်ငြိမ်မှု)**: Windows ကဲ့သို့ Update တိုင်း Restart ချစရာမလိုဘဲ နှစ်နှင့်ချီ၍ မနားတမ်း Run နိုင်သည်။
2. **Resource Efficiency (ပေါ့ပါးမြန်ဆန်မှု)**: GUI မျက်နှာပြင် မပါဝင်သဖြင့် RAM 512MB မျှသာရှိသော စက်ပေါ်တွင်ပင် Nginx Web Server ကို သွက်လက်စွာ Run နိုင်သည်။
3. **Security & Permissions (လုံခြုံရေး)**: Multi-user architecture နှင့် တင်းကျပ်သော Root / File Permission စနစ်ကြောင့် Virus နှင့် Malware အန္တရာယ် အလွန်နည်းပါးသည်။
4. **Automation & Scripting**: အရာအားလုံးသည် File ဖြစ်ပြီး Bash Script သို့မဟုတ် Ansible ဖြင့် Server ထောင်ပေါင်းများစွာကို စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ထိန်းချုပ်နိုင်သည်။
5. **Cost (အခမဲ့)**: Windows Server ကဲ့သို့ Client Access License (CAL) ကြေးများ ပေးစရာမလိုဘဲ အခမဲ့ Open Source ဖြစ်သည်။

---

## ⚙️ ၃။ How does it work? (Linux Architecture နှင့် OS နှိုင်းယှဉ်ချက်)

### Linux Architecture အလွှာ ၄ လွှာ

```
┌────────────────────────────────────────────────────────┐
│   User Applications (Nginx, MySQL, Python, Docker)     │
├────────────────────────────────────────────────────────┤
│   Shell / CLI (Bash, Zsh) & System Utilities           │
├────────────────────────────────────────────────────────┤
│   Linux Kernel (CPU Scheduler, Memory Manager, Drivers)│
├────────────────────────────────────────────────────────┤
│   Hardware (CPU, RAM, SSD/HDD, Network Interface Card) │
└────────────────────────────────────────────────────────┘
```

1. **Hardware**: တကယ့်ရုပ်ပိုင်းဆိုင်ရာ စက်ပစ္စည်း။
2. **Kernel**: Hardware နှင့် Program များအကြား ကြားခံဆက်သွယ်ပေးသော ဗဟိုအူတိုင် (System Calls များကို စီမံသည်)။
3. **Shell (Bash)**: Developer က ရိုက်နှိပ်လိုက်သော Command များကို နားလည်အောင် ဘာသာပြန်ပေးပြီး Kernel ထံ ပေးပို့သည့် စကားပြန်။
4. **Applications**: Nginx, MySQL, Java, Node.js စသည့် ကျွန်ုပ်တို့ run ထားသော Program များ။

### ⚖️ macOS vs Linux vs Windows နှိုင်းယှဉ်ချက်

| အချက်အလက် | macOS (Darwin/BSD) | Linux Server (Ubuntu) | Windows Server |
| :--- | :--- | :--- | :--- |
| **Kernel** | XNU (Mach + BSD hybrid) | **Linux Kernel (Monolithic)** | Windows NT Kernel |
| **User Interface** | GUI First (Aqua/Metal Desktop) | **CLI Only (Headless Terminal)** | GUI or Server Core |
| **Package Manager** | Homebrew (`brew`) | **APT (`apt`), DNF (`dnf`), Pacman** | winget / Chocolatey |
| **Service Manager** | `launchd` | **`systemd` (`systemctl`)** | Windows Services (`services.msc`) |
| **Filesystem Case** | Case-Insensitive (Default) | **Strictly Case-Sensitive** (`file.txt` ≠ `File.txt`) | Case-Insensitive |

> **အရေးကြီးသော သတိပြုချက်**: သင်၏ Mac ပေါ်တွင် `brew` သို့မဟုတ် `launchctl` သုံးသော်လည်း Linux Server ပေါ်တွင် `apt` နှင့် `systemctl` ကို သုံးရပါမည်။

---

## 🐧 ၄။ Linux Distributions (Distros) ဆိုတာ ဘာလဲ?

Linux Kernel ကို အခြေခံ၍ Package Manager၊ Tools များနှင့် ပေါင်းစပ်ထုတ်လုပ်ထားသော အမျိုးကွဲများကို **Distribution (Distro)** ဟု ခေါ်ပါသည်။

1. **Debian Family**:
   * **Ubuntu Server**: ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး (APT package manager ကို သုံးသည်)။ LTS (Long Term Support) သည် ၅ နှစ်အထိ အခမဲ့ လုံခြုံရေး update ပေးသည်။ *ကျွန်ုပ်တို့ သင်တန်းတွင် Ubuntu ကို အဓိက သုံးပါမည်။*
   * **Debian**: အလွန်တည်ငြိမ်ပြီး ပေါ့ပါးသော အခြေခံအုတ်မြစ်။
2. **RHEL (Red Hat Enterprise Linux) Family**:
   * **RHEL, Rocky Linux, AlmaLinux**: ဘဏ်များနှင့် Enterprise ကုမ္ပဏီကြီးများတွင် အသုံးများသည်။ (RPM / DNF ကို သုံးသည်)။
3. **Alpine Linux**:
   * အရွယ်အစား 5MB မျှသာရှိသော အလွန်ပေါ့ပါးသည့် Distro (Docker Container များတွင် အဓိက သုံးသည်)။

---

## 💻 ၅။ Mac ပေါ်တွင် Safe Linux Lab တည်ဆောက်ခြင်း (Canonical Multipass)

Production Linux Server ကို လေ့လာရန် မိမိ၏ Mac စက်ကို Linux ပြောင်းစရာမလိုပါ။ Ubuntu ကုမ္ပဏီ (Canonical) မှ တိုက်ရိုက်ထုတ်လုပ်ထားသော **Multipass** ကို သုံး၍ Apple Silicon (M1/M2/M3/M4) သို့မဟုတ် Intel Mac ပေါ်တွင် တကယ့် Ubuntu Server အစစ်ကို အလွယ်တကူ စတင်နိုင်ပါသည် -

### အဆင့် ၁ — Homebrew ဖြင့် Multipass သွင်းပါ (Mac Terminal တွင် ရိုက်ပါ)

```bash
brew install --cask multipass
```

### အဆင့် ၂ — Ubuntu Server 24.04 LTS Instance အသစ် စတင်ပါ

```bash
multipass launch 24.04 --name linux-lab --cpus 2 --memory 2G --disk 10G
```

### အဆင့် ၃ — Ubuntu Server ထဲသို့ ဝင်ရောက်ပါ (Open Shell)

```bash
multipass shell linux-lab
```

ဝင်ရောက်ပြီးပါက သင်၏ Mac Terminal Prompt သည် အောက်ပါအတိုင်း ပြောင်းလဲသွားပါမည် -
```
ubuntu@linux-lab:~$
```
*ဂုဏ်ယူပါသည်! သင်သည် ယခုအခါ တကယ့် Ubuntu Cloud VM တစ်ခုအတွင်းသို့ တိုက်ရိုက် ရောက်ရှိသွားပါပြီ!*

*(အကယ်၍ Multipass မသုံးလိုပါက Docker ဖြင့်လည်း `docker run -it --name linux-lab ubuntu:24.04 bash` ဖြင့် စမ်းသပ်နိုင်ပါသည်)*

---

## ⌨️ ၆။ Important Commands & Breakdown (ပထမဆုံး Linux စစ်ဆေးမှု Command များ)

Ubuntu Server ထဲသို့ ရောက်သည်နှင့် Server ၏ အချက်အလက်များကို အောက်ပါ command ၄ ခုဖြင့် စစ်ဆေးကြည့်ပါ -

### Command ၁: `uname -a`

```bash
uname -a
```
* **Command Breakdown**:
  * `uname`: Unix Name (OS အချက်အလက်ကို ပြပါ)
  * `-a` (all flag): Kernel နာမည်၊ Hostname၊ Kernel Version၊ Architecture အားလုံးကို အပြည့်အစုံ ပြသရန်။
* **Expected Output**:
  ```
  Linux linux-lab 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC ... aarch64 GNU/Linux
  ```
* **အဓိပ္ပာယ်ဖတ်နည်း**: OS သည် `Linux` ဖြစ်ပြီး Architecture သည် Apple Silicon ဖြစ်ပါက `aarch64` (ARM 64-bit) ဖြစ်သည်။

---

### Command ၂: `cat /etc/os-release`

```bash
cat /etc/os-release
```
* **Command Breakdown**:
  * `cat`: Concatenate & print (ဖိုင်အတွင်းသားကို ဖတ်ပြပါ)
  * `/etc/os-release`: မည်သည့် Linux Distribution ဖြစ်ကြောင်း သိမ်းဆည်းထားသော စနစ်ဖိုင်။
* **Expected Output**:
  ```
  PRETTY_NAME="Ubuntu 24.04 LTS"
  NAME="Ubuntu"
  VERSION_ID="24.04"
  VERSION="24.04 (Noble Numbat)"
  ID=ubuntu
  ```

---

### Command ၃: `whoami` နှင့် `hostname`

```bash
whoami
hostname
```
* **Command Breakdown**:
  * `whoami`: လက်ရှိ မည်သည့် User Account ဖြင့် Login ဝင်ထားသည်ကို ပြသပါ (ဥပမာ- `ubuntu` သို့မဟုတ် `root`)။
  * `hostname`: ဤ Server စက်၏ အမည်ကို ပြသပါ (ဥပမာ- `linux-lab`)။

---

### Command ၄: `uptime`

```bash
uptime
```
* **Expected Output**:
  ```
  22:55:10 up 12 min, 1 user, load average: 0.05, 0.03, 0.00
  ```
* **အဓိပ္ပာယ်ဖတ်နည်း**: Server သည် စတင် run ခဲ့သည်မှာ ၁၂ မိနစ်ရှိပြီဖြစ်ပြီး User ၁ ဦး ချိတ်ဆက်နေကာ System Load မှာ သုညနီးပါး အလွန်ပေါ့ပါးနေသည်။

---

## ⚠️ ၇။ Common Mistakes & Troubleshooting

1. **Mac Terminal နှင့် Ubuntu Shell ကို ရောထွေးခြင်း**:
   * Prompt ရှေ့တွင် `username@computer-name %` (Zsh) ပေါ်နေပါက Mac ပေါ်တွင် ရှိနေသေးသည်။
   * `ubuntu@linux-lab:~$` ပေါ်မှသာ Linux VM ထဲ ရောက်နေခြင်း ဖြစ်သည်။
2. **Case Sensitivity အမှား**:
   * Linux တွင် အက္ခရာအကြီးအသေး တိကျစွာ ခွဲခြားသဖြင့် `UNAME` သို့မဟုတ် `WhoAmI` ဟု ရိုက်ပါက `command not found` ဖြစ်ပါမည်။ Command များအားလုံးကို lowercase ဖြင့်သာ ရိုက်ရပါမည်။

---

## 🏋️ ၈။ Hands-on Practice (လက်တွေ့ လေ့ကျင့်ခန်း)

1. Mac Terminal ကို ဖွင့်ပါ။
2. Multipass ကို install လုပ်ပြီး `linux-lab` ဟူသော Ubuntu Server ကို စတင်ပါ။
3. `multipass shell linux-lab` ဖြင့် Ubuntu ထဲ ဝင်ပါ။
4. အထက်တွင် ပြသထားသော command (၄) ခု (`uname -a`, `cat /etc/os-release`, `whoami`, `uptime`) ကို ကိုယ်တိုင် ရိုက်နှိပ် စစ်ဆေးကြည့်ပါ။
5. VM မှ ပြန်ထွက်လိုပါက `exit` ဟု ရိုက်ပါ။

---

## 🧠 ၉။ Knowledge Check (သင်၏ နားလည်မှုကို စစ်ဆေးမည့် မေးခွန်းများ)

အောက်ပါ မေးခွန်း ၃ ခုကို ဖြေဆိုကြည့်ပါ -

1. **မေးခွန်း ၁**: Linux Server နှင့် ကျွန်ုပ်တို့သုံးနေသော macOS / Windows တို့၏ အဓိကကွာခြားချက် (၃) ချက်မှာ အဘယ်နည်း?
2. **မေးခွန်း ၂**: Linux Kernel နှင့် Shell (Bash) တို့၏ တာဝန်ကွာခြားချက်မှာ အဘယ်နည်း?
3. **မေးခွန်း ၃**: မိမိလက်ရှိရောက်နေသော Linux Server ၏ Distribution အမည်နှင့် Version ကို သိရှိလိုပါက မည်သည့် command ဖြင့် မည်သည့်ဖိုင်ကို ဖတ်ရမည်နည်း?
