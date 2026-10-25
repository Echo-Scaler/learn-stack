# 🛠️ Production Linux Incident Troubleshooting Guide

> **Production Server များတွင် မကြာခဏ ကြုံတွေ့ရသော ပြဿနာများ (Incidents)၊ Root Cause Analysis (RCA) နှင့် စနစ်တကျ ဖြေရှင်းနည်းများ**

DevOps Engineer တစ်ဦး၏ တန်ဖိုးအရှိဆုံး စွမ်းရည်မှာ **"System ပျက်သွားသောအခါ အချိန်တိုအတွင်း ပြဿနာ၏ မူလရင်းမြစ်ကို စုံစမ်းဖော်ထုတ် ဖြေရှင်းနိုင်ခြင်း (Troubleshooting & RCA)"** ဖြစ်ပါသည်။ ဤလမ်းညွှန်တွင် အဖြစ်အများဆုံး Production Incident (၇) ခုကို အဆင့်ဆင့် ဖြေရှင်းပုံ ဖော်ပြထားပါသည်။

---

## 🚨 Incident 1: High CPU Load & Unresponsive Server (ဆာဗာ တုံ့ပြန်မှု နှေးကွေးခြင်း)

### 症状 (Symptoms):
- Website တက်ရန် အလွန်ကြာနေခြင်း သို့မဟုတ် Gateway Timeout (504) တက်ခြင်း။
- SSH ဖြင့် ဆာဗာသို့ ဝင်ရောက်ရာတွင် terminal စာလုံးရိုက်ရသည်မှာ အလွန်နှေးကွေး (lag) နေခြင်း။
- `uptime` တွင် Load Average သည် CPU Core အရေအတွက်ထက် ၃ ဆ သို့မဟုတ် ၅ ဆ ကျော်လွန်နေခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ Load Average နှင့် CPU Core အရေအတွက် စစ်ဆေးပါ
uptime
nproc

# ၂။ CPU အများဆုံး စားသုံးနေသော Process များကို စစ်ဆေးပါ
top -b -n 1 | head -n 20
# သို့မဟုတ်
ps aux --sort=-%cpu | head -n 10

# ၃။ Disk I/O Wait (%wa) မြင့်မားနေခြင်း ရှိမရှိ စစ်ဆေးပါ
vmstat 1 5
```

### 💡 ဖြစ်နိုင်သော အကြောင်းရင်းများ (Root Causes):
1. **CPU Intensive Process**: Application code တွင် infinite loop ဖြစ်နေခြင်း သို့မဟုတ် crypto-mining malware ကူးစက်ခံရခြင်း။
2. **I/O Bottleneck (%wa မြင့်မားခြင်း)**: Disk သို့ အဆက်မပြတ် ရေးနေ/ဖတ်နေရသဖြင့် CPU သည် disk response ကို စောင့်ဆိုင်းနေရခြင်း။

### 🛠️ ဖြေရှင်းနည်း (Resolution):
- ပြဿနာဖြစ်စေသော Process ကို စစ်ဆေးပြီး Graceful restart ပြုလုပ်ပါ:
  ```bash
  kill -15 <PID>
  # ၅ စက္ကန့်အတွင်း မရပ်ပါက
  kill -9 <PID>
  ```
- Nginx သို့မဟုတ် Web application workers များ CPU လုနေပါက worker limit ကို `/etc/nginx/nginx.conf` တွင် ချိန်ညှိပါ။

---

## 🚨 Incident 2: Out of Memory (OOM) & Killed Process (Process ရုတ်တရက် ရပ်တန့်သွားခြင်း)

### 症状 (Symptoms):
- PostgreSQL သို့မဟုတ် Java/Node Application process သည် Error မပြဘဲ ရုတ်တရက် ပျောက်ကွယ်သွားခြင်း။
- Terminal တွင် `Killed` ဟူသော စကားလုံးတစ်ခုတည်း ထွက်ပေါ်လာခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ လက်ရှိ RAM နှင့် Swap အခြေအနေကို စစ်ဆေးပါ
free -h

# ၂။ Kernel Ring Buffer (dmesg) ထဲတွင် OOM Killer မှတ်တမ်း ရှာဖွေပါ
dmesg -T | grep -i -E "oom|killed process"
# သို့မဟုတ်
grep -i "oom-killer" /var/log/syslog
```

### 💡 တွေ့ရှိရမည့် Kernel Log ဥပမာ:
```text
[Sun Oct 25 14:15:22 2026] Out of memory: Killed process 15234 (node) total-vm:4124560kB, anon-rss:2045120kB
```

### 🛠️ ဖြေရှင်းနည်း (Resolution):
1. **Swap Memory ယာယီ ထည့်သွင်းခြင်း (Emergency Buffer)**:
   ```bash
   # 2GB Swap file ဖန်တီးခြင်း
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
2. **Application Memory Limits သတ်မှတ်ခြင်း**:
   - Node.js: `--max-old-space-size=1536`
   - Java: `-Xms512m -Xmx1536m`
   - Systemd: `MemoryMax=1.5G` ကို unit file တွင် ကန့်သတ်ခြင်း။

---

## 🚨 Incident 3: "No space left on device" (ဆာဗာ Disk ပြည့်သွားခြင်း)

### 症状 (Symptoms):
- Database သို့ အချက်အလက် အသစ် သိမ်းဆည်း၍ မရတော့ခြင်း။
- Log file မရေးနိုင်တော့ဘဲ Services များ crash ဖြစ်ခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ Disk Storage (GB) ပြည့်နေခြင်း ရှိမရှိ စစ်ဆေးပါ
df -h

# ၂။ Storage မပြည့်သော်လည်း Inode (ဖိုင်အရေအတွက်) ပြည့်နေခြင်း ရှိမရှိ စစ်ဆေးပါ
df -i

# ၃။ Disk နေရာ အများဆုံး ယူထားသော Folder များကို ရှာဖွေပါ
du -sh /* 2>/dev/null | sort -hr | head -n 10
du -sh /var/log/* 2>/dev/null | sort -hr | head -n 5
```

### 🛠️ ဖြေရှင်းနည်း (Resolution):
- ကြီးမားသော Log ဖိုင်များကို **Delete မလုပ်ပါနှင့်** (Process မှ open file handle ကိုင်ထားပါက နေရာလွတ် ပြန်မထွက်လာပါ)။ **Truncate လုပ်ပါ**:
  ```bash
  # ဖိုင်အရွယ်အစားကို 0 byte သို့ ချက်ချင်း ရှင်းထုတ်ခြင်း
  sudo truncate -s 0 /var/log/nginx/access.log
  ```
- Systemd journal logs များကို အရွယ်အစား ကန့်သတ်ရှင်းလင်းပါ:
  ```bash
  sudo journalctl --vacuum-size=200M
  ```
- Package cache များကို ရှင်းလင်းပါ:
  ```bash
  sudo apt-get clean
  ```

---

## 🚨 Incident 4: "Permission Denied" & Script Execution Failure

### 症状 (Symptoms):
- Bash script သို့မဟုတ် Deployment tool run သောအခါ `bash: ./deploy.sh: Permission denied` ဟု ပြခြင်း။
- Application မှ config ဖိုင် သို့မဟုတ် upload folder ကို ရေးသားခွင့် မရခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ ဖိုင်၏ Permissions နှင့် Owner/Group ကို စစ်ဆေးပါ
ls -la deploy.sh

# ၂။ လက်ရှိ User မည်သူဖြစ်ကြောင်း စစ်ဆေးပါ
whoami
id
```

### 🛠️ ဖြေရှင်းနည်း (Resolution):
- Executable permission မရှိပါက `+x` ပေးပါ:
  ```bash
  chmod +x deploy.sh
  ```
- Web Application upload folder ပိုင်ဆိုင်မှုကို web server user ထံ ပြောင်းလဲပေးပါ:
  ```bash
  sudo chown -R www-data:www-data /var/www/html/storage
  sudo chmod -R 775 /var/www/html/storage
  ```

---

## 🚨 Incident 5: Systemd Service Crash & "Start-Limit-Hit"

### 症状 (Symptoms):
- Service ကို `systemctl start` လုပ်ရာတွင် အလုပ်မလုပ်ဘဲ `Failed to start` ဟု ပြခြင်း။
- ခဏကြာသောအခါ `start request repeated too quickly` ဟု ထွက်ပေါ်လာခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ Service status အကျဉ်းချုပ် ကြည့်ပါ
systemctl status myapp.service

# ၂။ အသေးစိတ် Error trace log ကို journalctl ဖြင့် စစ်ဆေးပါ
journalctl -u myapp.service -xe --no-pager | tail -n 50
```

### 💡 အဓိက ဖြစ်လေ့ရှိသော အကြောင်းရင်းများ:
- **Port Conflict**: သတ်မှတ်ထားသော port ကို အခြား service တစ်ခုမှ ကြိုတင် နားထောင်ထားခြင်း (`sudo ss -tulpn | grep :8080`)။
- **Missing File / Path**: `WorkingDirectory` သို့မဟုတ် `ExecStart` လမ်းကြောင်း မှားယွင်းနေခြင်း။
- **Environment Variable Missing**: Database URL သို့မဟုတ် API Key မရှိ၍ crash ဖြစ်ခြင်း။

---

## 🚨 Incident 6: SSH Connection Refused သို့မဟုတ် Permission Denied (publickey)

### 症状 (Symptoms):
- `ssh user@server_ip` ရိုက်သောအခါ `Connection refused` သို့မဟုတ် `Permission denied (publickey)` တက်ခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း & ဖြေရှင်းနည်း:
1. **Connection Refused ဖြစ်ပါက**:
   - SSH Daemon ရပ်တန့်နေခြင်း သို့မဟုတ် Port ပြောင်းထားခြင်း:
     ```bash
     # Local console မှ စစ်ဆေးခြင်း
     sudo systemctl status ssh
     sudo ss -tulpn | grep 22
     ```
   - Firewall မှ Block လုပ်ထားခြင်း:
     ```bash
     sudo ufw status
     sudo ufw allow 22/tcp
     ```
2. **Permission Denied (publickey) ဖြစ်ပါက**:
   - `~/.ssh` folder နှင့် `authorized_keys` ၏ permission မှားယွင်းနေခြင်း (SSH သည် permission ချောင်နေပါက လုံခြုံရေးအရ ငြင်းပယ်သည်):
     ```bash
     chmod 700 ~/.ssh
     chmod 600 ~/.ssh/authorized_keys
     chown -R $USER:$USER ~/.ssh
     ```
   - Client ဘက်မှ SSH Verbose mode ဖြင့် Debug လုပ်ပါ:
     ```bash
     ssh -vvv user@server_ip
     ```

---

## 🚨 Incident 7: Zombie Processes (Defunct PIDs)

### 症状 (Symptoms):
- `ps aux` တွင် `<defunct>` ဟု ပြနေသော process များ ရှိနေပြီး `kill -9` ဖြင့် သတ်၍ မရခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း (Investigation Flow):
```bash
# ၁။ Defunct (Zombie) process များကို ရှာဖွေပါ
ps aux | grep 'Z'

# ၂။ Zombie process ၏ Parent PID (PPID) ကို ရှာပါ
ps -o ppid= -p <ZOMBIE_PID>
```

### 🛠️ ဖြေရှင်းနည်း (Resolution):
- Zombie process ကို တိုက်ရိုက်သတ်၍ မရပါ (၎င်းသည် သေဆုံးပြီးသား ဖြစ်သော်လည်း Parent process မှ `wait()` system call မခေါ်သောကြောင့် Process Table တွင် ကျန်နေခြင်း ဖြစ်သည်)။
- ၎င်း၏ **Parent Process (PPID)** ကို Graceful Restart ချပေးရပါမည်:
  ```bash
  kill -15 <PPID>
  ```
