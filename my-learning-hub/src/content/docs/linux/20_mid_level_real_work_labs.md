---
title: "20. Mid Level Real-Work Labs (M1-M8)"
description: "Linux Mid Level လက်တွေ့ လေ့ကျင့်ခန်း ၈ ခု - Permissions, SSH, systemd, Logs, Cron, Disk, Network Troubleshooting၊ Step-by-step ဗမာလို"
---

> 🟡 **Mid Level** - Server တစ်လုံးကို ကိုယ်တိုင် Setup/စီမံ/ပြဿနာရှင်းနိုင်ရန်။
> Lab များကို Practice VM တွင်သာ လုပ်ပါ ([Lab ပြင်ဆင်ပုံ](/linux/19_level_map_mid_vs_advanced_roadmap/))။

| Lab | ခေါင်းစဉ် | ကျွမ်းကျင်ရမည့်အရာ |
| :-: | :--- | :--- |
| M1 | Permission denied ကို ပြင်ခြင်း | Files / Permissions |
| M2 | Team Shared Folder | Users, Groups, setgid |
| M3 | Key-based SSH Setup | SSH |
| M4 | App ကို systemd Service ဖြင့် Run | Services |
| M5 | Log ဖတ်ပြီး Error ရှာခြင်း | Logs |
| M6 | Cron Backup | Automation |
| M7 | Disk ပြည့်ပြဿနာ | Storage |
| M8 | "Site ဝင်မရ" Troubleshooting | Network |

---

## 🔹 Lab M1 - "Permission denied" ကို ပြင်ခြင်း

**📋 Scenario:** Developer က Deploy script ကို Run တိုင်း `Permission denied` ပြသည်။ Web server ကလည်း uploads folder ထဲ ဖိုင်ရေးမရ။

**🎯 ရည်ရွယ်ချက်:** Permission ကို ဖတ်တတ်၊ အနည်းဆုံး လိုအပ်သလောက်သာ ပေးတတ်ရန်။

### အဆင့် ၁ - ပြဿနာ ဖန်တီးခြင်း
```bash
mkdir -p ~/lab-m1/uploads && cd ~/lab-m1
echo '#!/bin/bash
echo "Deploy OK"' > deploy.sh
./deploy.sh
# bash: ./deploy.sh: Permission denied
```

### အဆင့် ၂ - Permission ဖတ်ခြင်း
```bash
ls -l deploy.sh
# -rw-r--r-- 1 ubuntu ubuntu 36 ... deploy.sh
```
```
 -  rw-  r--  r--
 |   |    |    |
 |  Owner Group Others
 |  (r=4 w=2 x=1)
 ဖိုင်အမျိုးအစား (- ဖိုင်, d folder)
```
`x` မရှိသောကြောင့် Run မရ။

### အဆင့် ၃ - ပြင်ခြင်း
```bash
chmod u+x deploy.sh      # Owner ကိုသာ execute ပေး
./deploy.sh              # Deploy OK
```

### အဆင့် ၄ - Web Server (www-data) အတွက် uploads
```bash
sudo useradd -r -s /usr/sbin/nologin www-data 2>/dev/null
sudo chown -R ubuntu:www-data uploads
sudo chmod 775 uploads
ls -ld uploads
# drwxrwxr-x 2 ubuntu www-data ...
```

### ✅ စစ်ဆေးရန်
```bash
sudo -u www-data touch uploads/test.txt && echo "write OK"
sudo -u nobody touch uploads/x.txt   # Permission denied ပေါ်ရမည် (လုံခြုံ)
```

### 🧠 ဘာကြောင့်လဲ
- ❌ `chmod 777` ဆိုသည်မှာ လူတိုင်းကို ရေးခွင့်ပေးခြင်း - Hack ခံရနိုင်သည်။ Real work တွင် **Least Privilege** သာ။
- Permission error တွင် `ls -l` နှင့် `namei -l /full/path` ကို အရင်သုံးပါ (Parent folder `x` မရှိလျှင်လည်း ပိတ်သည်)။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `/var/www/app/storage` ကို `www-data` ရေးနိုင်ပြီး `others` မဖတ်နိုင်အောင် (`chmod 770`) သတ်မှတ်ပါ။

---

## 🔹 Lab M2 - Team Shared Folder (Users, Groups, setgid)

**📋 Scenario:** Developer ၃ ဦးသည် `/srv/project` ကို တစ်ပေါင်းတည်း သုံးရမည်။ တစ်ယောက်ဖန်တီးသောဖိုင်ကို တစ်ယောက်ပြင်မရ ဖြစ်နေသည်။

```bash
# 1) Group နှင့် User ဖန်တီး
sudo groupadd devteam
for u in alice bob carol; do
  sudo useradd -m -s /bin/bash -G devteam $u
done
id alice

# 2) Folder ပြင်ဆင်
sudo mkdir -p /srv/project
sudo chown root:devteam /srv/project
sudo chmod 2775 /srv/project     # 2 = setgid
ls -ld /srv/project
# drwxrwsr-x 2 root devteam ...   (s = setgid)
```
**setgid** ကြောင့် Folder ထဲ ဖန်တီးသော ဖိုင်အသစ်တိုင်း Group = `devteam` ဖြစ်သည်။

```bash
# 3) စမ်းသပ်
sudo -u alice bash -c 'umask 002; echo hi > /srv/project/a.txt'
sudo -u bob   bash -c 'echo bob >> /srv/project/a.txt && echo "bob can edit"'
ls -l /srv/project
```

### ✅ စစ်ဆေးရန်
`a.txt` group သည် `devteam` နှင့် `-rw-rw-r--` ဖြစ်ရမည်။

### 🧠 ဘာကြောင့်လဲ
Team ပူးပေါင်းလုပ်ငန်း၊ Deploy user + Web user မျှဝေသုံးခြင်းတွင် setgid + umask 002 သည် စံနည်းဖြစ်သည်။ **ACL** (`setfacl -m u:bob:rw file`) ဖြင့်လည်း အသေးစိတ် ထိန်းနိုင်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `dave` ကို Read-only ဖြင့်သာ ဝင်ကြည့်နိုင်အောင် `setfacl` သုံးပါ။ User ကို group မှ ဖယ်ရန် `sudo gpasswd -d bob devteam`။

---

## 🔹 Lab M3 - Key-based SSH Setup

**📋 Scenario:** Server အသစ်ကို Password ဖြင့်မဟုတ်ဘဲ SSH Key ဖြင့်သာ ဝင်ရမည်ဟု Security Team က တောင်းဆိုသည်။

### Client (သင့် Mac) တွင်
```bash
ssh-keygen -t ed25519 -C "kyaw@laptop" -f ~/.ssh/lab_key
# passphrase ထည့်ပါ (အကြံပြု)
ls ~/.ssh/lab_key*     # lab_key (private), lab_key.pub (public)
```
> 🔑 **Private key (`lab_key`) ကို ဘယ်သူ့ကိုမှ မပေးရ၊ Git ထဲ မထည့်ရ။**

### Server သို့ Public key ထည့်
```bash
ssh-copy-id -i ~/.ssh/lab_key.pub ubuntu@SERVER_IP
ssh -i ~/.ssh/lab_key ubuntu@SERVER_IP
```

### Server ပေါ်တွင် Permission မှန်ရမည်
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### ~/.ssh/config ဖြင့် လွယ်အောင်
```
Host lab
    HostName SERVER_IP
    User ubuntu
    IdentityFile ~/.ssh/lab_key
```
```bash
ssh lab
```

### Password login ပိတ်ခြင်း (Key ဖြင့်ဝင်နိုင်ကြောင်း အတည်ပြုပြီးမှသာ!)
```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo nano /etc/ssh/sshd_config
#   PasswordAuthentication no
#   PermitRootLogin no
sudo sshd -t                       # Syntax စစ်
sudo systemctl reload ssh
```
> ⚠️ **လက်ရှိ SSH session ကို မပိတ်ဘဲ** Terminal အသစ်တစ်ခုဖြင့် ဝင်ကြည့်ပြီးမှ ပိတ်ပါ။ မဟုတ်လျှင် ကိုယ့်ကိုယ်ကို Server မှ ပိတ်ထားမိနိုင်သည်။

### ✅ စစ်ဆေးရန်
```bash
ssh -o PubkeyAuthentication=no ubuntu@SERVER_IP
# Permission denied (publickey) ဖြစ်ရမည်
```

### 🧠 ဘာကြောင့်လဲ
Internet ပေါ်ရှိ Server များကို Bot များက တစ်နေ့လုံး Password guess လုပ်နေသည်။ Key-only ဖြစ်လျှင် Brute-force အလုပ်မဖြစ်တော့ပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** SSH Local Port Forward စမ်းပါ - `ssh -L 8080:localhost:80 lab` ပြီး Browser မှ `localhost:8080` ကြည့်ပါ။

---

## 🔹 Lab M4 - App ကို systemd Service အဖြစ် Run

**📋 Scenario:** Node/Python app ကို `nohup` ဖြင့် Run ထားရာ Server reboot ပြီးနောက် ပျောက်သွားသည်။ Auto-start, Auto-restart လိုချင်သည်။

### App ပြင်ဆင်
```bash
sudo mkdir -p /opt/hello && cd /opt/hello
sudo tee app.py > /dev/null <<'EOF'
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200); self.end_headers()
        self.wfile.write(b"Hello from systemd service\n")
HTTPServer(("0.0.0.0", 8000), H).serve_forever()
EOF
sudo useradd -r -s /usr/sbin/nologin hello
sudo chown -R hello:hello /opt/hello
```

### Service file
```bash
sudo tee /etc/systemd/system/hello.service > /dev/null <<'EOF'
[Unit]
Description=Hello Python App
After=network.target

[Service]
User=hello
WorkingDirectory=/opt/hello
ExecStart=/usr/bin/python3 /opt/hello/app.py
Restart=on-failure
RestartSec=3
Environment=APP_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

### Run
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hello
systemctl status hello
curl localhost:8000
```

### Crash စမ်းသပ် (Auto-restart)
```bash
sudo kill -9 $(systemctl show -p MainPID --value hello)
sleep 4
systemctl status hello     # active (running) ပြန်ဖြစ်ရမည်
```

### ✅ စစ်ဆေးရန်
```bash
sudo reboot
# ပြန်ဝင်ပြီး
systemctl is-active hello     # active
```

### 🧠 ဘာကြောင့်လဲ
- Root မဟုတ်သော သီးသန့် User ဖြင့် Run -> Hack ခံရလည်း ပျက်စီးမှုနည်း။
- `Restart=on-failure` ဖြင့် Crash ဖြစ်လျှင် ကိုယ့်ဘာသာ ပြန်စ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `MemoryMax=200M` ထည့်ပြီး limit ကျော်လျှင် ဘာဖြစ်သလဲ ကြည့်ပါ။ `systemd-analyze security hello` ကို Run ကြည့်ပါ။

---

## 🔹 Lab M5 - Log ဖတ်ပြီး Error ရှာခြင်း

**📋 Scenario:** Customer က "ညသန်းခေါင်ကတည်းက 500 error တက်နေတယ်" ဟု တိုင်ကြားသည်။

### journalctl (systemd service log)
```bash
journalctl -u hello                    # service ၏ log အားလုံး
journalctl -u hello -f                 # live
journalctl -u hello --since "1 hour ago"
journalctl -u hello -p err             # error အဆင့်သာ
journalctl -b -1 -p err                # ယခင် boot ၏ error
journalctl --disk-usage
```

### Traditional log files
```bash
ls /var/log
sudo tail -f /var/log/syslog
sudo tail -n 100 /var/log/auth.log     # Login / sudo / SSH
sudo tail -n 50 /var/log/nginx/error.log
```

### Log Analysis (grep / awk / sort)
Nginx log နမူနာ ဖန်တီးပါ-
```bash
cat > /tmp/access.log <<'EOF'
1.1.1.1 - - [22/Oct/2026:00:01:01 +0900] "GET / HTTP/1.1" 200 512
2.2.2.2 - - [22/Oct/2026:00:01:05 +0900] "GET /api HTTP/1.1" 500 128
2.2.2.2 - - [22/Oct/2026:00:01:06 +0900] "GET /api HTTP/1.1" 500 128
3.3.3.3 - - [22/Oct/2026:00:02:10 +0900] "POST /login HTTP/1.1" 401 64
2.2.2.2 - - [22/Oct/2026:00:02:11 +0900] "GET /api HTTP/1.1" 502 0
EOF
```
```bash
# Status code အလိုက် အရေအတွက်
awk '{print $9}' /tmp/access.log | sort | uniq -c | sort -rn

# 5xx error များသာ
awk '$9 ~ /^5/' /tmp/access.log

# Error အများဆုံးထုတ်သော IP
awk '$9 ~ /^5/ {print $1}' /tmp/access.log | sort | uniq -c | sort -rn | head

# Error အများဆုံး URL
awk '$9 ~ /^5/ {print $7}' /tmp/access.log | sort | uniq -c | sort -rn
```

### SSH Login ကျရှုံးမှု စစ်ခြင်း
```bash
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head
```

### ✅ စစ်ဆေးရန်
`/api` သည် 500/502 ထွက်နေသည်ဟု 30 စက္ကန့်အတွင်း ပြောနိုင်ရမည်။

### 🧠 ဘာကြောင့်လဲ
Log ဖတ်ပုံ အစီအစဉ်- **ဘယ်အချိန်** -> **ဘယ် Service** -> **Error စာသား** -> **ဘာပြောင်းလဲခဲ့လဲ (deploy?)**။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** မိနစ်အလိုက် Request အရေအတွက်ကို `awk '{print substr($4,2,17)}' | sort | uniq -c` ဖြင့် ထုတ်ပါ (Traffic spike ရှာရန်)။

---

## 🔹 Lab M6 - Cron ဖြင့် Backup Automation

**📋 Scenario:** Database/Uploads ကို နေ့စဉ် 02:00 တွင် Backup ယူပြီး ၇ ရက်ထက်ကျော်သည်ကို ဖျက်ချင်သည်။

### Backup script
```bash
sudo mkdir -p /opt/scripts /var/backups/app
sudo tee /opt/scripts/backup.sh > /dev/null <<'EOF'
#!/bin/bash
set -euo pipefail

SRC="/srv/project"
DEST="/var/backups/app"
DATE=$(date +%F_%H%M)
FILE="$DEST/backup_$DATE.tar.gz"

tar -czf "$FILE" "$SRC"
echo "$(date '+%F %T') backup OK: $FILE ($(du -h "$FILE" | cut -f1))"

# ၇ ရက်ထက်ကြာသော backup ဖျက်
find "$DEST" -name "backup_*.tar.gz" -mtime +7 -delete
EOF
sudo chmod +x /opt/scripts/backup.sh
sudo /opt/scripts/backup.sh
```

### Cron Schedule
```bash
sudo crontab -e
```
```
# မိနစ် နာရီ ရက် လ ရက်သတ္တပတ်   command
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```
```
┌──── minute (0-59)
│ ┌── hour (0-23)
│ │ ┌ day of month
│ │ │ ┌ month
│ │ │ │ ┌ day of week (0=Sun)
0 2 * * *
```

### Restore စမ်းသပ်ခြင်း (အရေးကြီးဆုံး!)
```bash
mkdir /tmp/restore-test
tar -xzf /var/backups/app/backup_*.tar.gz -C /tmp/restore-test
ls -R /tmp/restore-test | head
```

### ✅ စစ်ဆေးရန်
```bash
sudo crontab -l
grep CRON /var/log/syslog | tail
tail /var/log/backup.log
```

### 🧠 ဘာကြောင့်လဲ
> **Restore မစမ်းဘူးသော Backup သည် Backup မဟုတ်။** Cron တွင် PATH မတူသောကြောင့် Script အတွင်း Full path သုံးပါ၊ Log ကို ဖိုင်ထဲ redirect ပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Backup ကို Remote Server သို့ `rsync -az -e ssh` ဖြင့် ကူးပါ။ `systemd timer` ဖြင့် အစားထိုး ရေးကြည့်ပါ။

---

## 🔹 Lab M7 - Disk ပြည့်ပြဿနာ (No space left on device)

**📋 Scenario:** App က `No space left on device` ဟု Error တက်၊ Database ရပ်သွားသည်။

### အဆင့် ၁ - ဘာပြည့်နေလဲ
```bash
df -h                      # Partition အလိုက်
df -i                      # Inode ပြည့်နေသလား (ဖိုင်သေးများ များလွန်း)
```

### အဆင့် ၂ - ဘယ် Folder ကြီးလဲ (အပေါ်မှ အောက်သို့ ရှာ)
```bash
sudo du -h --max-depth=1 / 2>/dev/null | sort -rh | head
sudo du -h --max-depth=1 /var | sort -rh | head
sudo find / -xdev -type f -size +100M -exec ls -lh {} \; 2>/dev/null
```

### အဆင့် ၃ - ဖြစ်တတ်သော အကြောင်းရင်းများ
```bash
sudo journalctl --vacuum-size=200M     # journal ကျုံ့
sudo apt clean                         # apt cache
docker system df && docker system prune -f   # Docker
sudo ls -lh /var/log | sort -k5 -h | tail
```

### အဆင့် ၄ - ဖိုင်ဖျက်ပြီး Space မပြန်ရ (Deleted but open)
```bash
sudo lsof +L1 | head
# Process က ဖိုင်ကို ဖွင့်ထားသေးလျှင် Space မပြန်ရ -> Service restart
```

### အဆင့် ၅ - ထပ်မဖြစ်အောင် (Prevention)
Log rotate config `/etc/logrotate.d/myapp`
```
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```
```bash
sudo logrotate -d /etc/logrotate.d/myapp     # dry-run
```

### 🧠 ဘာကြောင့်လဲ
Disk 100% ဆိုသည်မှာ Production Incident အဖြစ်ဆုံးတစ်ခု။ **df -> du -> find -> lsof** အစဉ်ကို ကျွမ်းအောင်လုပ်ပါ။ Disk 80% ကျော်လျှင် Alert ပို့ထားပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `fallocate -l 500M /tmp/big.img` ဖြင့် ဖန်တီး၊ `du`/`find` ဖြင့်ပြန်ရှာပြီး ဖျက်ပါ။

---

## 🔹 Lab M8 - "Site ဝင်မရ" Network Troubleshooting

**📋 Scenario:** `http://myapp.example.com` ကို ဝင်မရဟု Customer ပြောသည်။

### အလွှာအလိုက် အောက်မှ အထက်သို့ စစ်ပါ

```
 ① DNS ဖြေသလား?  ②  Server ရောက်သလား?  ③ Port ဖွင့်သလား?
 ④ Firewall ပိတ်ထားလား? ⑤ Service နားထောင်နေလား? ⑥ App Error လား?
```

```bash
# ① DNS
dig +short myapp.example.com
nslookup myapp.example.com
dig myapp.example.com @8.8.8.8        # အခြား DNS ဖြင့် နှိုင်းယှဉ်

# ② Server ရောက်သလား
ping -c 3 SERVER_IP
traceroute SERVER_IP                  # (mtr SERVER_IP ပိုကောင်း)

# ③ Port ဖွင့်သလား (Client မှ)
nc -zv SERVER_IP 80
nc -zv SERVER_IP 443
curl -v http://SERVER_IP

# ④ Server ပေါ်: Firewall
sudo ufw status verbose
sudo iptables -L -n | head -20

# ⑤ Server ပေါ်: ဘယ် Process က Port နားထောင်နေလဲ
sudo ss -tulpn | grep -E ':80|:443'
systemctl status nginx

# ⑥ App
curl -I http://localhost
sudo tail -n 50 /var/log/nginx/error.log
```

### ပြဿနာ ပုံစံများ ဖတ်ပုံ

| ရလဒ် | အဓိပ္ပါယ် | ပြင်ရန် |
| :--- | :--- | :--- |
| `dig` ဘာမှမထွက် | DNS record မရှိ / မှား | DNS A record စစ် |
| ping ရ၊ `nc` Timeout | Firewall/Security Group ပိတ် | `ufw allow 80`, Cloud SG |
| `nc` -> Connection refused | Port ဖွင့်ထား၊ Service မနားထောင် | `systemctl start nginx` |
| `ss` တွင် `127.0.0.1:80` သာ | Local ကိုသာ listen | `0.0.0.0` သို့ ပြောင်း |
| curl -> 502 | Nginx ရှိ၊ Backend ကျ | Backend service/log စစ် |
| curl -> 403 | Permission/Config | File permission, `nginx -t` |

### Lab - ရည်ရွယ်ချက်ရှိရှိ ဖျက်စီးပြီး ပြင်ကြည့်ပါ
```bash
sudo apt install -y nginx
sudo ufw allow OpenSSH && sudo ufw --force enable
curl -m 3 localhost            # ရ
# ပြင်ပမှ စမ်း -> Timeout (80 မဖွင့်ရသေး)
sudo ufw allow 80/tcp          # ဖွင့်
sudo systemctl stop nginx
curl localhost                 # Connection refused
sudo systemctl start nginx
```

### 🧠 ဘာကြောင့်လဲ
`Timeout` = Firewall ပိတ်၊ `Refused` = Service မနား။ ဤ ၂ ခုကို ခွဲခြားနိုင်ပါက Network ပြဿနာ၏ ၈၀% ကို မိနစ်ပိုင်းဖြင့် ဖြေရှင်းနိုင်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `curl -w "dns:%{time_namelookup} connect:%{time_connect} total:%{time_total}\n" -o /dev/null -s URL` ဖြင့် ဘယ်အဆင့် နှေးသလဲ တိုင်းပါ။ `tcpdump -i any port 80 -nn` ဖြင့် Packet လာမလာ ကြည့်ပါ။

---

## 🏁 Mid Level ပြီးဆုံးကြောင်း Checklist

| Lab | ကိုယ်တိုင် ပြန်လုပ်နိုင်ပြီလား? |
| :--- | :-: |
| M1 Permission ပြင် | ⬜ |
| M2 Shared folder (setgid) | ⬜ |
| M3 SSH key + password ပိတ် | ⬜ |
| M4 systemd service + auto-restart | ⬜ |
| M5 Log analysis (awk/grep) | ⬜ |
| M6 Cron backup + restore test | ⬜ |
| M7 Disk ပြည့် ရှာဖွေ | ⬜ |
| M8 Network layer troubleshooting | ⬜ |

အားလုံး ✅ ဖြစ်ပါက [Advanced Labs (A1-A10)](/linux/21_advanced_level_real_work_labs/) သို့ ဆက်သွားပါ။
