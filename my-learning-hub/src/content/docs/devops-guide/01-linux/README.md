---
title: "Module 01: Linux Fundamentals for DevOps Engineers"
description: "Production Linux Server Administration, Filesystem, Permissions & Process Management Mastery"
---

> **Linux Server အခြေခံမှသည် Production SysAdmin & DevOps အဆင့်သို့: Filesystem Hierarchy, Permissions, Systemd Daemons & Process Management**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Production Linux Server Administration, Filesystem, Permissions & Process Management Mastery**
- **Track Level**: Core Foundation (အခြေခံအုတ်မြစ်)
- **Target Audience**: DevOps Engineers, Cloud Administrators, Software Developers
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 2. Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)
ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -
1. Linux Architecture (Kernel vs Shell vs User Space) နှင့် Distribution များ၏ ကွာခြားချက်ကို ရှင်းလင်းစွာ ခွဲခြားသိရှိခြင်း။
2. Filesystem Hierarchy Standard (`/`, `/etc`, `/var`, `/opt`, etc.) ကို နားလည်ပြီး Server ပေါ်တွင် သွက်လက်စွာ သွားလာ၊ ဖိုင်များကို စီမံနိုင်ခြင်း။
3. File I/O Streams, Pipes နှင့် Redirection (`stdout`, `stderr`, `2>&1`, `/dev/null`) တို့ကို တိကျစွာ အသုံးချတတ်ခြင်း။
4. Text Processing Tools (`grep`, `find`, `awk`, `sed`, `cut`, `sort`, `uniq`) ဖြင့် Server logs များကို လျင်မြန်စွာ စစ်ဆေးနိုင်ခြင်း။
5. Users, Groups, File Permissions (`chmod`, `chown`, SUID/SGID, Sticky Bit) နှင့် `sudoers` least privilege principle ကို လက်တွေ့ အကောင်အထည်ဖော်နိုင်ခြင်း။
6. Linux Processes, Signals (`SIGTERM`, `SIGKILL`), CPU Load Average နှင့် Memory (RAM/Swap/OOM) ကို စောင့်ကြည့် ထိန်းကျောင်းနိုင်ခြင်း။
7. `systemd` ဖြင့် Custom Application Service unit files ရေးသားပြေးဆွဲနိုင်ပြီး `journalctl` ဖြင့် Logs analysis ပြုလုပ်နိုင်ခြင်း။
8. Environment Variables (`$PATH`, `.bashrc`, `/etc/environment`) နှင့် Cron jobs များကို စနစ်တကျ ပြင်ဆင်နိုင်ခြင်း။

---

## 3. Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)
- ကွန်ပျူတာတွင် Terminal သို့မဟုတ် Bash shell ကို ဖွင့်လှစ် အသုံးပြုတတ်ခြင်း။
- Local Lab အဖြစ် Ubuntu 22.04 / 24.04 LTS စက် (Multipass, Docker, VirtualBox, UTM သို့မဟုတ် WSL 2) အဆင်သင့်ရှိခြင်း။

---

## 4. Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Kernel** | ဟာ့ဒ်ဝဲ (CPU/RAM/Disk) နှင့် ဆော့ဖ်ဝဲလ်ကြား ကြားခံ ဆက်သွယ်ပေးသော OS ၏ အူတိုင် | Container များနှင့် VM များသည် Kernel အဆင့်တွင် cgroups/namespaces ဖြင့် resource ခွဲဝေသုံးစွဲခြင်း ဖြစ်သည်။ | `uname -r` ဖြင့် လက်ရှိပြေးနေသော Linux Kernel version ကို စစ်ဆေးခြင်း။ |
| **Shell** | အသုံးပြုသူ ရိုက်ထည့်လိုက်သော Command များကို Kernel နားလည်အောင် ဘာသာပြန်ပေးသော ကြားခံ Command Interpreter | DevOps ၏ နေ့စဉ် အလိုအလျောက် ခိုင်းစေမှု (Automation/CI-CD) သည် Bash Shell ပေါ်တွင် အဓိက အလုပ်လုပ်သည်။ | `/bin/bash` သို့မဟုတ် `/bin/sh` |
| **Daemon** | Background တွင် အမြဲ အလုပ်လုပ်နေသော System ဝန်ဆောင်မှု (Service) | Web Server (Nginx), Database (Postgres), Docker Daemon များသည် နောက်ကွယ်တွင် အမြဲ အလုပ်လုပ်နေရသည်။ | `systemctl status nginx` ဖြင့် daemon အခြေအနေ စစ်ဆေးခြင်း။ |
| **I/O Redirection** | Command တစ်ခု၏ Output သို့မဟုတ် Error ကို Screen ပေါ် မပြဘဲ File ထဲသို့ လမ်းကြောင်းလွှဲ ထည့်သွင်းခြင်း | Cron job များ၊ CI/CD log များနှင့် backup logs များကို ဖိုင်ထဲသို့ သိမ်းဆည်းရန် မရှိမဖြစ် သုံးရသည်။ | `mysqldump db > backup.sql 2> error.log` |
| **Least Privilege** | User သို့မဟုတ် Process တစ်ခုကို လုပ်ငန်းဆောင်ရွက်ရန် လိုအပ်သော အနည်းဆုံး အခွင့်အရေးသာ ပေးအပ်ခြင်း မူဝါဒ | Root အကောင့်ဖြင့် App run လိုက်ပါက Hack ခံရလျှင် Server တစ်ခုလုံး အဖျက်ခံရနိုင်သဖြင့် Non-root user သုံးရသည်။ | App အတွက် dedicated `deployer` user ဆောက်ပြီး `/var/www` သာ ပိုင်ဆိုင်ခွင့်ပေးခြင်း။ |
| **OOM Killer** | ဆာဗာတွင် RAM လုံးဝ ကုန်သွားပါက Server crash မဖြစ်စေရန် Kernel မှ Memory အများဆုံးစားသော Process ကို အတင်းသတ်ပစ်ခြင်း | Production တွင် Database သို့မဟုတ် App ရုတ်တရက် ရပ်တန့်သွားရခြင်း၏ အဓိက တရားခံ ဖြစ်သည်။ | `dmesg -T \| grep -i oom` ဖြင့် အသတ်ခံရသော process ကို ရှာဖွေခြင်း။ |

---

## 5. Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ Linux Distribution များ ကွာခြားချက် (Debian/Ubuntu vs RHEL/Rocky/CentOS)
- **Debian / Ubuntu Family**: `apt` (Advanced Package Tool) ကို အသုံးပြုသည်။ `.deb` package များ သုံးသည်။ Cloud Instances (AWS EC2, DigitalOcean) နှင့် Docker Base Images များတွင် အသုံးအများဆုံး ဖြစ်သည်။
- **RHEL / Rocky / Fedora Family**: `dnf` သို့မဟုတ် `yum` ကို အသုံးပြုသည်။ `.rpm` package များ သုံးသည်။ Enterprise Banks, Telecom စသည့် ကုမ္ပဏီကြီးများ၏ On-premise Infrastructure များတွင် အသုံးများသည်။
- **DevOps Core**: Commands အများစု (Filesystem, systemd, networking, bash) သည် တူညီပြီး Package Manager (`apt` vs `dnf`) သာ အဓိက ကွာခြားပါသည်။

### ၅.၂ Linux Filesystem Hierarchy Standard (FHS)
Linux တွင် Windows ကဲ့သို့ `C:\`, `D:\` drive များ မရှိပါ။ အရာအားလုံးသည် **Single Root Directory (`/`)** အောက်တွင် သစ်ပင်သဖွယ် ဖြာထွက် တည်ရှိပါသည်:
- `/` (Root): စနစ်တစ်ခုလုံး၏ ထိပ်ဆုံး အစမှတ်။
- `/home/<username>`: သာမန် User များ၏ ကိုယ်ပိုင် ဖိုင်များနှင့် ချိန်ညှိချက်များ။
- `/root`: စနစ်၏ အမြင့်ဆုံး Administrator (root user) ၏ Home folder။
- `/etc`: System & Application Configuration Files များ တည်ရှိရာ (ဥပမာ- `/etc/nginx/`, `/etc/ssh/sshd_config`, `/etc/hosts`)။
- `/var`: မကြာခဏ ပြောင်းလဲနေသော Dynamic Data များ (Logs: `/var/log/`, Web files: `/var/www/`, Package cache: `/var/cache/`)။
- `/tmp`: ယာယီဖိုင်များ ထားရှိရာ (Server restart ချပါက အလိုအလျောက် ရှင်းလင်းသွားသည်)။
- `/opt`: Third-party Add-on Applications များ ထည့်သွင်းရာ (ဥပမာ- `/opt/gitlab`, `/opt/datadog`)။
- `/usr`: User Binaries နှင့် Libraries များ (`/usr/bin`, `/usr/lib`)။

---

## 6. Why This Matters in Real DevOps Work (လုပ်ငန်းခွင် လက်တွေ့ တန်ဖိုး)
1. **Config Drift ရှာဖွေခြင်း**: Nginx သို့မဟုတ် Database မတက်တော့ပါက `/etc/` အောက်ရှိ configuration ဖိုင် syntax မှားယွင်းနေခြင်းကို မိနစ်ပိုင်းအတွင်း ပြင်ဆင်နိုင်ရမည်။
2. **Disk Full Outage ကယ်တင်ခြင်း**: `/var/log/` ပြည့်သွား၍ Production Server တစ်ခုလုံး ရပ်တန့်သွားချိန်တွင် Disk space စားနေသော log ဖိုင်ကြီးများကို ဘေးကင်းစွာ ရှင်းလင်းနိုင်ရမည်။
3. **Application Security Hardening**: Node.js, Laravel သို့မဟုတ် Java Spring Boot app များကို root privilege ဖြင့် မပြေးဆွဲစေဘဲ လုံခြုံသော Linux Service အဖြစ် ထိန်းကျောင်းနိုင်ရမည်။

---

## 7. Architecture & Workflow Diagram (စနစ် အတွင်းပိုင်း အလုပ်လုပ်ပုံ)

```text
+-------------------------------------------------------------------------+
|                              USER SPACE                                 |
|                                                                         |
|  [ Web Browser / SSH Client ] ──► [ Nginx / App (systemd service) ]    |
|                                         │ (Process: PID 1024, User: www)|
|                                         ▼                               |
|                         [ Standard Shell / CLI Commands ]               |
|                           (ls, grep, chmod, systemctl)                  |
|                                         │                               |
|                                 (System Calls)                          |
+-----------------------------------------┼-------------------------------+
|                                         ▼                               |
|                                    LINUX KERNEL                         |
|   +-----------------------------------------------------------------+   |
|   |  Process Scheduler | Memory Manager (OOM) | VFS (Filesystem)    |   |
|   |  Network Stack     | Security & Cgroups   | Device Drivers      |   |
|   +-----------------------------------------------------------------+   |
+-----------------------------------------┼-------------------------------+
|                                         ▼                               |
|                                 HARDWARE LAYER                          |
|                     [ CPU ]   [ RAM ]   [ NVMe/SSD ]   [ NIC ]          |
+-------------------------------------------------------------------------+
```

---

## 8. Step-by-Step Instructions & Commands (အဆင့်ဆင့် လက်တွေ့ လမ်းညွှန်)

### အဆင့် ၁: Filesystem Navigation နှင့် စစ်ဆေးခြင်း
```bash
# လက်ရှိ ရောက်ရှိနေသော လမ်းကြောင်းကို စစ်ဆေးခြင်း
pwd

# ဖိုင်များနှင့် folder များ၏ အသေးစိတ် အချက်အလက်များကို ကြည့်ရှုခြင်း (hidden files များ အပါအဝင်)
ls -la /etc

# Directory အသစ်တစ်ခု ဆောက်လုပ်ခြင်း (-p flag သည် parent directory မရှိပါက တစ်ပြိုင်နက် ဆောက်ပေးသည်)
mkdir -p /tmp/devops-lab/config

# ဖိုင်အလွတ်တစ်ခု ဖန်တီးခြင်း
touch /tmp/devops-lab/config/app.env
```

### အဆင့် ၂: I/O Redirection နှင့် Pipes အသုံးချပုံ
Linux တွင် Stream (၃) မျိုး ရှိပါသည်:
- `0`: Standard Input (`stdin`)
- `1`: Standard Output (`stdout`)
- `2`: Standard Error (`stderr`)

```bash
# stdout ကို ဖိုင်ထဲသို့ အသစ်ရေးသွင်းခြင်း (Overwrite)
echo "APP_ENV=production" > /tmp/devops-lab/config/app.env

# stdout ကို မူလဖိုင်အောက်တွင် ဆက်ထည့်ခြင်း (Append)
echo "APP_PORT=8080" >> /tmp/devops-lab/config/app.env

# stdout နှင့် stderr နှစ်ခုစလုံးကို ဖိုင်တစ်ခုတည်းသို့ ထည့်သွင်းခြင်း (2>&1)
ls -la /root /tmp/devops-lab > /tmp/devops-lab/output.log 2>&1

# Output မလိုချင်ပါက Black hole (/dev/null) ထဲသို့ စွန့်ပစ်ခြင်း
curl -s https://example.com > /dev/null 2>&1
```

### အဆင့် ၃: Text Processing (grep, awk, sed, find)
```bash
# /var/log/syslog ထဲမှ "error" သို့မဟုတ် "failed" စကားလုံးကို case-insensitive ရှာဖွေခြင်း
grep -inE "error|failed" /var/log/syslog | head -n 10

# Disk space ကြီးမားသော log ဖိုင်များကို ရှာဖွေခြင်း (50MB ထက်ကြီးသောဖိုင်များ)
find /var/log -type f -size +50M -exec ls -lh {} \;

# Text အစားထိုးခြင်း (sed stream editor ဖြင့် port 8080 မှ 9000 သို့ ပြောင်းခြင်း)
sed -i 's/APP_PORT=8080/APP_PORT=9000/g' /tmp/devops-lab/config/app.env

# Column ခွဲထုတ်ခြင်း (awk ဖြင့် process ID နှင့် memory usage သာ ရွေးထုတ်ခြင်း)
ps aux | awk '{print $2, $4, $11}' | sort -k2 -nr | head -n 5
```

### အဆင့် ၄: Users, Groups နှင့် Permissions Management
Permission string တစ်ခုတွင် အပိုင်း (၄) ပိုင်း ပါရှိပါသည်: `d rwx r-x r--`
- ပထမအက္ခရာ: `d` (Directory) သို့မဟုတ် `-` (Regular File)
- အက္ခရာ ၂-၄: **Owner (User)** Permissions
- အက္ခရာ ၅-၇: **Group** Permissions
- အက္ခရာ ၈-၁၀: **Others (World)** Permissions

```bash
# User အသစ်ဆောက်ခြင်း (Dedicated service user, no login shell)
sudo useradd -r -s /bin/false -d /opt/myapp myappuser

# Group အသစ်ဆောက်ခြင်း
sudo groupadd appteam

# User ကို Group ထဲသို့ ထည့်သွင်းခြင်း
sudo usermod -aG appteam myappuser

# Folder ပိုင်ဆိုင်မှုကို ပြောင်းလဲခြင်း
sudo chown -R myappuser:appteam /tmp/devops-lab

# File permissions သတ်မှတ်ခြင်း (Owner: Full, Group: Read+Execute, Others: No access)
sudo chmod -R 750 /tmp/devops-lab
```

### အဆင့် ၅: Process & System Resources Management
```bash
# CPU နှင့် Memory စားသုံးမှု အမြင့်ဆုံး process များကို real-time ကြည့်ရှုခြင်း
top

# RAM နှင့် Swap အခြေအနေကို လူဖတ်ရလွယ်ကူသော format (MB/GB) ဖြင့် ကြည့်ခြင်း
free -h

# Disk Partition များ၏ နေရာလွတ် အခြေအနေကို စစ်ဆေးခြင်း
df -h

# သီးခြား folder တစ်ခု၏ အရွယ်အစားကို တွက်ချက်ခြင်း
du -sh /var/log/* 2>/dev/null | sort -hr | head -n 10

# သတ်မှတ်ထားသော process ကို safe shutdown ဖြစ်အောင် အချက်ပြခြင်း (SIGTERM)
kill -15 <PID>

# တုံ့ပြန်မှု မရှိတော့သော process ကို အတင်း အပြီးသတ် သတ်ပစ်ခြင်း (SIGKILL)
kill -9 <PID>
```

### အဆင့် ၆: systemd Service တည်ဆောက်ခြင်းနှင့် စီမံခြင်း
Production application များကို background daemon အဖြစ် အလိုအလျောက် ပြေးဆွဲနိုင်ရန် systemd unit file တစ်ခု တည်ဆောက်ပါမည်။

```ini
# ဖိုင်တည်နေရာ: /etc/systemd/system/dummy-app.service
[Unit]
Description=Production Dummy Web App Service
After=network.target

[Service]
Type=simple
User=myappuser
Group=appteam
WorkingDirectory=/tmp/devops-lab
ExecStart=/usr/bin/python3 -m http.server 9000
Restart=always
RestartSec=5
StandardOutput=append:/var/log/dummy-app.log
StandardError=append:/var/log/dummy-app-err.log

[Install]
WantedBy=multi-user.target
```

Service အား စတင်ခြင်းနှင့် စစ်ဆေးခြင်း:
```bash
# Systemd daemon အား configuration အသစ်များကို ပြန်ဖတ်စေခြင်း
sudo systemctl daemon-reload

# Service ကို စတင်ပြေးဆွဲခြင်း
sudo systemctl start dummy-app.service

# Server reboot တက်လာပါက အလိုအလျောက် ပွင့်စေရန် enable ပြုလုပ်ခြင်း
sudo systemctl enable dummy-app.service

# Service အခြေအနေ စစ်ဆေးခြင်း
sudo systemctl status dummy-app.service

# Service ၏ Live Logs များကို စောင့်ကြည့်ခြင်း
journalctl -u dummy-app.service -f -n 50
```

---

## 9. Expected Output Verification (ထွက်ပေါ်လာမည့် စစ်ဆေးမှု ရလဒ်များ)

`sudo systemctl status dummy-app.service` ကို run သောအခါ အောက်ပါအတိုင်း **active (running)** ဖြစ်နေရပါမည်:

```text
● dummy-app.service - Production Dummy Web App Service
     Loaded: loaded (/etc/systemd/system/dummy-app.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2026-10-25 13:00:00 UTC; 12s ago
   Main PID: 14205 (python3)
      Tasks: 1 (limit: 4642)
     Memory: 14.2M
        CPU: 45ms
     CGroup: /system.slice/dummy-app.service
             └─14205 /usr/bin/python3 -m http.server 9000
```

Local port 9000 တွင် service အလုပ်လုပ်နေခြင်းကို စစ်ဆေးခြင်း:
```bash
curl -I http://127.0.0.1:9000
# Expected Output: HTTP/1.0 200 OK
```

---

## 10. Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အဖြစ်များသော အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **Permission Denied** | ဖိုင်ကို ဖွင့်ဖတ်/ပြင်ဆင်ရန် လက်ရှိ user တွင် privilege မရှိခြင်း သို့မဟုတ် execution bit (`+x`) မရှိခြင်း | `ls -la` ဖြင့် file owner နှင့် permissions စစ်ပါ။ လိုအပ်ပါက `sudo` သုံးပါ သို့မဟုတ် `chmod 755 <script>` ပေးပါ။ |
| **No space left on device** | Disk storage (100%) ပြည့်သွားခြင်း သို့မဟုတ် Inode အရေအတွက် ကုန်သွားခြင်း | `df -h` ဖြင့် storage စစ်ပါ။ `df -i` ဖြင့် inode စစ်ပါ။ `/var/log` ထဲမှ log ဖိုင်ဟောင်းများကို `truncate -s 0 file.log` ဖြင့် ရှင်းထုတ်ပါ။ |
| **Service Start-Limit-Hit** | Service သည် စတင်ပြီးနောက် ခဏချင်း crash ဖြစ်ကာ systemd restart loop ထဲ ရောက်သွားခြင်း | `journalctl -u <service> -e` ဖြင့် crash ဖြစ်ရသည့် အကြောင်းရင်း (ဥပမာ- port နေရာလုခြင်း၊ DB connection မမိခြင်း) ကို ရှာဖွေပြင်ဆင်ပါ။ |
| **Command not found** | Tool မသွင်းရသေးခြင်း သို့မဟုတ် executable binary သည် `$PATH` variable ထဲတွင် မပါဝင်ခြင်း | `which <cmd>` ဖြင့် ရှာပါ။ မရှိပါက `sudo apt install <pkg>` သွင်းပါ။ Path လွဲနေပါက `export PATH=$PATH:/custom/bin` ပေါင်းထည့်ပါ။ |

---

## 11. Security Best Practices (လုံခြုံရေး အကောင်းဆုံး အလေ့အကျင့်များ)
1. **Never Run Apps as Root**: Web Application များနှင့် Services များကို မည်သည့်အခါမျှ `root` user ဖြင့် တိုက်ရိုက် မပြေးဆွဲပါနှင့်။ Dedicated system user (`useradd -r`) ဖန်တီး၍ သုံးပါ။
2. **Restrict sudo Access**: `/etc/sudoers` တွင် `ALL=(ALL:ALL) ALL` အစား သီးခြား command များကိုသာ ကန့်သတ်ခွင့်ပြုပါ (`visudo` command ဖြင့်သာ အမြဲ edit လုပ်ပါ)။
3. **Protect Sensitive Files**: Password များ၊ Private keys များနှင့် `.env` ဖိုင်များကို `chmod 600` (Owner read/write only) သတ်မှတ်ပါ။
4. **Log Rotation**: Logs များ မပြည့်စေရန် `/etc/logrotate.d/` တွင် rotation စနစ် အမြဲ ထည့်သွင်းထားပါ။

---

## 12. Hands-on Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Production Directory Structure & Permission Lockdown**
1. `/opt/webapps/payment-api` ဟူသော directory တစ်ခု ဖန်တီးပါ။
2. `paymentuser` ဟူသော system user နှင့် `finance-devs` ဟူသော group တစ်ခု ဆောက်ပါ။
3. အဆိုပါ folder ၏ ပိုင်ဆိုင်မှုကို `paymentuser:finance-devs` သို့ ပြောင်းပါ။
4. Permissions ကို `750` သတ်မှတ်ပါ (Owner: Full, Group: Read+Execute, Others: No access)။
5. အခြား သာမန် user တစ်ဦးဖြင့် အဆိုပါ folder ထဲသို့ `cd` ဝင်ရောက်၍ မရကြောင်း စမ်းသပ် verify လုပ်ပါ။

---

## 13. Challenge Exercise (စိန်ခေါ်မှု လေ့ကျင့်ခန်း)

**Challenge: Automated Zombie Process & Memory Leak Hunter**
- System တွင် RAM အများဆုံး စားသုံးနေသော Top 5 processes များကို စစ်ဆေးကာ၊ အကယ်၍ Process တစ်ခုသည် RAM 50% ထက် ကျော်လွန်နေပါက `/var/log/high-memory-alerts.log` ထဲသို့ Timestamp နှင့်တကွ မှတ်တမ်းတင်ပေးသော Bash command chain (သို့မဟုတ် script) တစ်ခုကို `awk`, `ps`, `date` တို့ ပေါင်းစပ်၍ ရေးသားပါ။

---

## 14. Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. `chmod 755 script.sh` နှင့် `chmod 644 config.env` ၏ ဂဏန်းတစ်လုံးချင်းစီ၏ အဓိပ္ပာယ်မှာ အဘယ်နည်း?
2. `>` နှင့် `>>` ၏ အဓိက ကွာခြားချက်မှာ အဘယ်နည်း?
3. Process တစ်ခုကို ရပ်တန့်ရန် `SIGTERM (15)` နှင့် `SIGKILL (9)` တွင် မည်သည့် signal ကို အရင်သုံးသင့်သနည်း? အဘယ်ကြောင့်နည်း?
4. Linux တွင် Storage နေရာလွတ် (GB) ကျန်နေသော်လည်း "No space left on device" ဟု ပြနေပါက အဘယ်ကြောင့် ဖြစ်နိုင်သနည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. **755**: Owner (7 = 4+2+1 = rwx), Group (5 = 4+1 = r-x), Others (5 = 4+1 = r-x)။ **644**: Owner (6 = 4+2 = rw-), Group (4 = r--), Others (4 = r--)။
2. `>` သည် ဖိုင်ရှိ အချက်အလက်ဟောင်းများကို overwrite ဖျက်ချပြီး အသစ်ရေးသည်။ `>>` သည် ဖိုင်ဟောင်းအောက်တွင် စာကြောင်းအသစ် ဆက်လက်ထည့်သွင်း (append) ပြုလုပ်သည်။
3. `SIGTERM (15)` ကို အရင်ဆုံး သုံးရပါမည်။ အကြောင်းမှာ Application အား database connections များပိတ်ခြင်း၊ ယာယီ state များသိမ်းဆည်းခြင်း (Graceful Shutdown) ကို ခွင့်ပြုသောကြောင့် ဖြစ်သည်။ မရပ်တန့်နိုင်မှသာ `SIGKILL (9)` ဖြင့် အတင်း သတ်ပစ်ရမည်။
4. Inode အရေအတွက် (Number of inodes) ကုန်သွားခြင်းကြောင့် ဖြစ်သည်။ ဖိုင်သေးပေါင်း သန်းချီ ရှိနေပါက disk space ကျန်သော်လည်း ဖိုင်အသစ် ထပ်ဆောက်၍ မရတော့ပါ။ `df -i` ဖြင့် စစ်ဆေးနိုင်ပါသည်။
</details>

---

## 15. Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production Server တစ်ခုတွင် Load Average အလွန်တက်နေပြီး Server အလုပ်မလုပ်တော့ပါက သင် မည်သို့ Troubleshoot ပြုလုပ်မည်နည်း?**
> **Sample Answer**:
> "ပထမဦးစွာ `uptime` နှင့် `top` (သို့မဟုတ် `htop`) ကို run ပြီး Load Average ၏ 1-min, 5-min, 15-min trend ကို စစ်ဆေးပါမည်။ ထို့နောက် Load တက်ရသည့် အကြောင်းရင်းသည် CPU ကြောင့်လား၊ Memory Swap ကြောင့်လား သို့မဟုတ် Disk I/O Bottleneck (iowait - %wa) ကြောင့်လား ခွဲခြမ်းပါမည်။ `ps aux --sort=-%cpu` ဖြင့် CPU အများဆုံးစားသော process ကို ဖော်ထုတ်ပါမည်။ အကယ်၍ iowait မြင့်မားနေပါက `iotop` သို့မဟုတ် `iostat -xz 1` ဖြင့် မည်သည့် process က disk read/write အပြင်းအထန် လုပ်နေသည်ကို စုံစမ်းပြီး သက်ဆိုင်ရာ application team နှင့် ညှိနှိုင်းကာ process ကို safe restart ချခြင်း သို့မဟုတ် kill ပြုလုပ်ပါမည်။"

**Q2: Systemd service တစ်ခု `systemctl start` လုပ်ရာတွင် 'Failed with result exit-code' ဖြစ်သွားပါက မည်သို့ ရှာဖွေမည်နည်း?**
> **Sample Answer**:
> "`systemctl status <service-name>` ဖြင့် exit status code ကို အကြမ်းဖျင်း ကြည့်ပါမည်။ အသေးစိတ် Error message ကို သိရှိရန် `journalctl -u <service-name> -xe --no-pager` ကို run ပြီး Application crash ဖြစ်ရသည့် root cause (ဥပမာ- port conflict, missing environment variable, database connection refused, file permission issue) ကို ဖတ်ရှုစစ်ဆေးပါမည်။"

---

## 16. Completion Checklist (ပြီးမြောက်မှု စစ်ဆေးချက်)
- [ ] Linux Filesystem Hierarchy standard (`/etc`, `/var`, `/opt`, `/tmp`) ကို ရှင်းပြနိုင်ပြီ။
- [ ] File permissions (Octal 755/644, User/Group ownership) ကို ကျွမ်းကျင်စွာ ပြင်ဆင်နိုင်ပြီ။
- [ ] `grep`, `find`, `awk`, `sed` တို့ဖြင့် ဖိုင်နှင့် logs များကို လိုချင်သလို ရှာဖွေနိုင်ပြီ။
- [ ] `systemd` service unit file အသစ်တစ်ခုကို ကိုယ်တိုင်ရေးဆွဲပြီး `journalctl` ဖြင့် စစ်ဆေးနိုင်ပြီ။
- [ ] CPU, Memory, Disk Space များကို `top`, `free -h`, `df -h` ဖြင့် တိုင်းတာစစ်ဆေးနိုင်ပြီ။

---

## 17. References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Ubuntu Server Official Guide](https://ubuntu.com/server/docs)
- [Systemd System and Service Manager](https://systemd.io/)
- [GNU Coreutils Documentation](https://www.gnu.org/software/coreutils/manual/)
- [Linux Filesystem Hierarchy Standard (FHS)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)
