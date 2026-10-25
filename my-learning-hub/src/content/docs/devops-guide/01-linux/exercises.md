---
title: "🏋️ Module 01: Linux Hands-on Exercises & Labs"
description: "🏋️ Module 01: Linux Hands-on Exercises & Labs"
---


> **Linux Server အုပ်ချုပ်မှုနှင့် DevOps အခြေခံအုတ်မြစ်များကို စမ်းသပ်လေ့ကျင့်မည့် လက်တွေ့ Labs (၅) ခု**

---

## 🎯 Lab 1: Multi-Tier User, Group & Permission Lockdown

### 📌 ရည်မှန်းချက်:
Production Server တစ်ခုတွင် Application များ၊ Logs များနှင့် Developer များအတွက် လုံခြုံစိတ်ချရသော User/Group Permission Architecture တည်ဆောက်ခြင်း။

### 📝 လိုအပ်ချက်များ (Requirements):
1. အောက်ပါ Users များကို ဖန်တီးပါ:
   - `app-runner`: Service run ရန်အတွက် Login shell မရှိသော System user (`/bin/false`)။
   - `dev-alice`: Developers group အဖွဲ့ဝင်ဖြစ်သော Normal user။
   - `audit-bob`: Auditor group အဖွဲ့ဝင်ဖြစ်သော Normal user။
2. အောက်ပါ Groups များကို ဖန်တီးပါ:
   - `appteam`
   - `auditteam`
3. Folder ဖွဲ့စည်းပုံ ဖန်တီးပါ:
   - `/var/apps/ecom-service/src`
   - `/var/apps/ecom-service/logs`
   - `/var/apps/ecom-service/config`
4. Permissions သတ်မှတ်ချက်:
   - `/var/apps/ecom-service/config/database.env`: Owner သည် `app-runner` ဖြစ်ပြီး Permission မှာ `600` (Owner read/write only) ဖြစ်ရမည်။
   - `/var/apps/ecom-service/logs`: `app-runner` မှ log ရေးနိုင်ရမည်ဖြစ်ပြီး `auditteam` မှ ဖတ်ရှုနိုင်ရမည်။ အခြား user များ ဝင်ခွင့်မရှိရ (`750` သို့မဟုတ် ACL)။

### 💻 Step-by-Step Execution Commands:
```bash
# ၁။ Users နှင့် Groups များ ဖန်တီးခြင်း
sudo groupadd appteam
sudo groupadd auditteam

sudo useradd -r -s /bin/false -d /var/apps/ecom-service app-runner
sudo useradd -m -s /bin/bash -g appteam dev-alice
sudo useradd -m -s /bin/bash -g auditteam audit-bob

# ၂။ Folder ဖွဲ့စည်းပုံ တည်ဆောက်ခြင်း
sudo mkdir -p /var/apps/ecom-service/{src,logs,config}

# ၃။ Config ဖိုင် ဖန်တီးပြီး Permission Lockdown ပြုလုပ်ခြင်း
sudo touch /var/apps/ecom-service/config/database.env
echo "DB_PASS=SuperSecretProductionPass123" | sudo tee /var/apps/ecom-service/config/database.env > /dev/null

sudo chown -R app-runner:appteam /var/apps/ecom-service
sudo chown app-runner:appteam /var/apps/ecom-service/config/database.env
sudo chmod 600 /var/apps/ecom-service/config/database.env

# ၄။ Logs folder permissions
sudo chown app-runner:auditteam /var/apps/ecom-service/logs
sudo chmod 750 /var/apps/ecom-service/logs
```

### ✅ Verification Steps:
```bash
# Permission string စစ်ဆေးခြင်း
ls -la /var/apps/ecom-service/config/database.env
# Expected: -rw------- 1 app-runner appteam ... database.env

# audit-bob user အဖြစ် logs folder ထဲ ဝင်ရောက်နိုင်ခြင်း စစ်ဆေးခြင်း
sudo -u audit-bob ls -la /var/apps/ecom-service/logs
# Expected: Success (ဝင်ရောက်ကြည့်ရှုနိုင်ရမည်)

# dev-alice user အဖြစ် config ဖိုင် ဝင်ဖတ်ခြင်း စမ်းသပ်ခြင်း
sudo -u dev-alice cat /var/apps/ecom-service/config/database.env
# Expected: Permission denied (အလိုအလျောက် ပိတ်ပင်ရမည်)
```

---

## 🎯 Lab 2: Production Log Parsing & Traffic Analysis (grep, awk, cut, sort)

### 📌 ရည်မှန်းချက်:
Dummy Nginx web access log ဖိုင်တစ်ခုမှ Error ဖြစ်ပွားမှုများ၊ Request အများဆုံး IP များနှင့် HTTP Status code များကို Command Line တူးလ်များဖြင့် စစ်ဆေးခြင်း။

### 📝 Setup Dummy Log Data:
```bash
mkdir -p /tmp/log-analysis
cat << 'EOF' > /tmp/log-analysis/access.log
192.168.1.10 - - [25/Oct/2026:10:00:01 +0000] "GET /api/v1/products HTTP/1.1" 200 1024
192.168.1.15 - - [25/Oct/2026:10:00:02 +0000] "POST /api/v1/checkout HTTP/1.1" 500 234
192.168.1.10 - - [25/Oct/2026:10:00:03 +0000] "GET /api/v1/cart HTTP/1.1" 200 512
10.0.0.99 - - [25/Oct/2026:10:00:04 +0000] "GET /admin/login HTTP/1.1" 403 128
192.168.1.15 - - [25/Oct/2026:10:00:05 +0000] "POST /api/v1/checkout HTTP/1.1" 500 234
10.0.0.99 - - [25/Oct/2026:10:00:06 +0000] "GET /admin/login HTTP/1.1" 403 128
192.168.1.20 - - [25/Oct/2026:10:00:07 +0000] "GET /healthz HTTP/1.1" 200 64
10.0.0.99 - - [25/Oct/2026:10:00:08 +0000] "GET /admin/config HTTP/1.1" 404 128
192.168.1.10 - - [25/Oct/2026:10:00:09 +0000] "GET /api/v1/products HTTP/1.1" 200 1024
EOF
```

### 💻 လေ့ကျင့်ခန်း မေးခွန်းများနှင့် ဖြေဆိုနည်း:

1. **HTTP 500 Internal Server Error ဖြစ်ပွားခဲ့သော စာကြောင်းအားလုံးကို ရှာဖွေပါ:**
   ```bash
   grep ' 500 ' /tmp/log-analysis/access.log
   ```
2. **Web server သို့ Request အများဆုံး ပို့ဆောင်ခဲ့သော Top IP Address များကို အရေအတွက်နှင့်တကွ စီတန်းပြပါ:**
   ```bash
   awk '{print $1}' /tmp/log-analysis/access.log | sort | uniq -c | sort -nr
   ```
3. **HTTP Status Code (column 9) တစ်ခုချင်းစီ၏ အရေအတွက်ကို စာရင်းထုတ်ပါ:**
   ```bash
   awk '{print $9}' /tmp/log-analysis/access.log | sort | uniq -c
   ```

---

## 🎯 Lab 3: Build a Custom Systemd Service with Auto-Restart

### 📌 ရည်မှန်းချက်:
Python ဖြင့်ရေးထားသော Background HTTP Worker တစ်ခုကို Server restart ဖြစ်သွားသော်လည်း အလိုအလျောက် ပြန်တက်လာပြီး၊ Crash ဖြစ်ပါက ၃ စက္ကန့်အတွင်း Self-heal ဖြစ်စေသော `systemd` unit တည်ဆောက်ခြင်း။

### 💻 Step-by-Step:
1. Application directory နှင့် dummy script ဆောက်ပါ:
   ```bash
   sudo mkdir -p /opt/pyapp
   cat << 'EOF' | sudo tee /opt/pyapp/server.py > /dev/null
   import http.server
   import socketserver

   PORT = 8888
   Handler = http.server.SimpleHTTPRequestHandler

   print(f"Serving at port {PORT}")
   with socketserver.TCPServer(("", PORT), Handler) as httpd:
       httpd.serve_forever()
   EOF
   ```

2. Systemd service unit ဖိုင် ရေးသားပါ:
   ```ini
   # ဖိုင်တည်နေရာ: /etc/systemd/system/pyapp.service
   [Unit]
   Description=Python Micro HTTP Server
   After=network.target

   [Service]
   Type=simple
   User=nobody
   WorkingDirectory=/opt/pyapp
   ExecStart=/usr/bin/python3 /opt/pyapp/server.py
   Restart=always
   RestartSec=3

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable ပြုလုပ်ပြီး စတင်ပါ:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start pyapp.service
   sudo systemctl enable pyapp.service
   ```

4. **Self-Healing Test (Crash Simulation)**:
   ```bash
   # လက်ရှိ PID ကို ကြည့်ပါ
   PID=$(pgrep -f "server.py")
   echo "Current PID is: $PID"

   # Process ကို အတင်းသတ်ပစ်ပါ
   sudo kill -9 $PID

   # ၄ စက္ကန့် စောင့်ပါ
   sleep 4

   # Systemd မှ အသစ် ပြန်ဆောက်ပေးထားသော PID သစ်ကို စစ်ဆေးပါ
   NEW_PID=$(pgrep -f "server.py")
   echo "New Auto-Recovered PID is: $NEW_PID"
   sudo systemctl status pyapp.service
   ```

---

## 🎯 Lab 4: Disk Alert & Log Rotation Simulation

### 📌 ရည်မှန်းချက်:
`/tmp/` သို့မဟုတ် root partition ပေါ်တွင် ကြီးမားသော ယာယီ dump ဖိုင်များကို ရှာဖွေဖယ်ရှားခြင်းနှင့် Disk usage စစ်ဆေးခြင်း။

```bash
# ၁။ 100MB dummy test ဖိုင်တစ်ခု ဖန်တီးခြင်း
dd if=/dev/zero of=/tmp/bigfile.img bs=1M count=100

# ၂။ 50MB ထက်ကြီးသောဖိုင်များကို find ဖြင့် ရှာဖွေခြင်း
find /tmp -type f -size +50M -exec ls -lh {} \;

# ၃။ ဖိုင်ကို ဘေးကင်းစွာ ရှင်းလင်းခြင်း (File truncate လုပ်နည်း)
truncate -s 0 /tmp/bigfile.img

# ၄။ ရလဒ် စစ်ဆေးခြင်း
ls -lh /tmp/bigfile.img
rm -f /tmp/bigfile.img
```

---

## 🎯 Lab 5: I/O Streams, Pipes and Signal Handling

### 📌 ရည်မှန်းချက်:
Background process များကို `&` ဖြင့် run ခြင်း၊ `jobs`, `fg`, `bg` သဘောတရားနှင့် `SIGTERM (15)` vs `SIGKILL (9)` ကို လက်တွေ့ စမ်းသပ်ခြင်း။

```bash
# Background တွင် sleep process တစ်ခု run ပါ
sleep 300 &
JOB_PID=$!
echo "Running in background with PID: $JOB_PID"

# Background jobs ကြည့်ခြင်း
jobs -l

# Graceful termination (SIGTERM) ပို့ခြင်း
kill -15 $JOB_PID

# Process ရပ်သွားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
ps aux | grep "[s]leep 300" || echo "Process cleanly terminated with SIGTERM."
```
