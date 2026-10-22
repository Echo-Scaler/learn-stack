---
title: "21. Advanced Level Real-Work Labs (A1-A10)"
description: "Linux Advanced Level လက်တွေ့ လေ့ကျင့်ခန်း ၁၀ ခု - Performance, Security, Nginx HTTPS, Bash automation, Incident response၊ Step-by-step ဗမာလို"
---

> 🔴 **Advanced Level** - Production Server ကို တာဝန်ယူပြီး ပြဿနာကို Root Cause အထိ ရှာနိုင်ရန်။
> ကြိုတင်လိုအပ်ချက်: [Mid Level Labs M1-M8](/linux/20_mid_level_real_work_labs/) ကို ပြီးထားပါ။

| Lab | ခေါင်းစဉ် | ကျွမ်းကျင်ရမည့်အရာ |
| :-: | :--- | :--- |
| A1 | Server နှေးနေသည် - Performance Triage | CPU/RAM/IO/Network |
| A2 | Memory Leak & OOM Killer | Process, Memory |
| A3 | Brute-force တိုက်ခိုက်မှု - Fail2ban | Security |
| A4 | Firewall Default-Deny Design | ufw / nftables |
| A5 | Nginx Reverse Proxy + HTTPS | Web, TLS |
| A6 | Zero-Downtime Deployment | Deploy |
| A7 | Bash Health-check & Alert Script | Automation |
| A8 | Process Isolation: Limits, cgroups, Namespaces | Kernel |
| A9 | Incident Response & Postmortem | Operations |
| A10 | Server Hardening Audit | Security |

---

## 🔸 Lab A1 - "Server နှေးနေသည်" Performance Triage

**📋 Scenario:** Website နှေးနေသည်ဟု တိုင်ကြား။ CPU / RAM / Disk / Network ဘယ်ဟာ ပြဿနာလဲ ၅ မိနစ်အတွင်း ခွဲရမည်။

### USE Method (Utilization, Saturation, Errors)
```bash
# ① ခြုံငုံကြည့် - Load average
uptime
# load average: 8.20, 6.10, 3.00   (CPU core အရေအတွက်ထက် များနေလား?)
nproc

# ② CPU
top -o %CPU                 # (htop ပိုကောင်း)
mpstat -P ALL 2 3           # sysstat package
#   %usr မြင့် = App code၊ %sys မြင့် = Kernel၊ %iowait မြင့် = Disk စောင့်နေ

# ③ Memory
free -h
vmstat 2 5                  # si/so (swap in/out) မြင့်လျှင် RAM မလောက်
ps aux --sort=-%mem | head

# ④ Disk I/O
iostat -xz 2 3              # %util ~100, await မြင့် = Disk bottleneck
sudo iotop -oPa             # ဘယ် Process က Disk သုံးနေ

# ⑤ Network
ss -s                       # Connection အရေအတွက်
sar -n DEV 2 3
```

### စမ်းသပ် Stress ဖန်တီး
```bash
sudo apt install -y stress-ng sysstat
stress-ng --cpu 2 --timeout 60s &
top                          # CPU မြင့်တက်လာသည်ကို ကြည့်
stress-ng --vm 1 --vm-bytes 80% --timeout 30s &
free -h
stress-ng --io 2 --timeout 30s &
iostat -xz 2 3
```

### ဖတ်ပုံ ဇယား
| လက္ခဏာ | ဆိုလိုရင်း | နောက်ထပ် စစ်ရန် |
| :--- | :--- | :--- |
| Load > core ၊ `%usr` မြင့် | App CPU-bound | `perf top`, App profile |
| Load မြင့်၊ CPU နိမ့်၊ `%iowait` မြင့် | Disk နှေး | `iostat`, `iotop` |
| `free` နည်း၊ `so` > 0 | Memory ပြည့်၊ Swap | Leak? Limit? |
| Connection များ၊ `TIME_WAIT` များ | Network/Keepalive | `ss -tan state time-wait \| wc -l` |

### ✅ စစ်ဆေးရန်
Bottleneck ကို "CPU / Memory / Disk / Network" ထဲမှ တစ်ခုအဖြစ် **Command output ကို သက်သေပြ၍** ပြောနိုင်ရမည်။

### 🧠 ဘာကြောင့်လဲ
"Server နှေးတယ်" ကို ခန့်မှန်းမလုပ်ဘဲ **တိုင်းတာပြီးမှ ပြင်ပါ**။ `top` တစ်ခုတည်းနှင့် ဆုံးဖြတ်ခြင်း မမှန်ပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** ၃ ခုစလုံးကို တစ်ခုချင်းဖန်တီး၍ metrics ပုံစံ ၃ မျိုးကို မှတ်တမ်းတင်ပါ။

---

## 🔸 Lab A2 - Memory Leak & OOM Killer

**📋 Scenario:** App တစ်ခု နာရီအနည်းငယ်အကြာတွင် အလိုလိုပျောက်သွားသည်၊ Log ထဲ ဘာမှမတွေ့။

### OOM ဖြစ်ကြောင်း စစ်
```bash
sudo dmesg -T | grep -iE "killed process|out of memory"
sudo journalctl -k | grep -i oom
```

### စမ်းသပ် (Lab VM တွင်သာ)
```bash
# Memory ကို တဖြည်းဖြည်း စားသော Script
cat > /tmp/leak.py <<'EOF'
import time
data = []
while True:
    data.append(bytearray(10*1024*1024))   # 10MB တိုး
    time.sleep(0.5)
EOF
python3 /tmp/leak.py &
watch -n1 'ps -o pid,rss,cmd -p $(pgrep -f leak.py)'
```
RSS တက်နေပြီး နောက်ဆုံး `Killed` ဖြစ်မည်။ `dmesg` တွင် OOM log တွေ့ရမည်။

### Memory limit ဖြင့် ကာကွယ် (systemd)
```bash
sudo systemd-run --scope -p MemoryMax=200M python3 /tmp/leak.py
# 200MB ရောက်လျှင် အဆိုပါ process သာ ပိတ်ခံရ၊ Server တစ်ခုလုံး မထိ
```

### Swap နှင့် Tuning
```bash
swapon --show
cat /proc/sys/vm/swappiness
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swap.conf
sudo sysctl --system
```

### Process ကို OOM မှ ကာကွယ်/ဦးစားပေး
```bash
cat /proc/$(pgrep -f leak.py)/oom_score
echo -500 | sudo tee /proc/$(pidof nginx | cut -d' ' -f1)/oom_score_adj
# Service file တွင်: OOMScoreAdjust=-500
```

### 🧠 ဘာကြောင့်လဲ
App Log တွင်မပါသော "ရုတ်တရက်သေခြင်း" ၏ အဓိက အကြောင်းရင်းမှာ Kernel OOM Killer ဖြစ်တတ်သည်။ **`dmesg` ကို အမြဲစစ်ပါ**။ Container တွင် `docker run --memory=512m` ဖြင့်လည်း ကန့်သတ်နိုင်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `/proc/PID/status` ထဲ `VmRSS` ကို ၁ စက္ကန့်တစ်ကြိမ် log ဖိုင်သို့ ရေးသော script ရေးပါ။

---

## 🔸 Lab A3 - Brute-force တိုက်ခိုက်မှု နှင့် Fail2ban

**📋 Scenario:** `auth.log` ထဲ `Failed password` အကြိမ်ထောင်ချီ တွေ့သည်။

### အဆင့် ၁ - တိုက်ခိုက်သူများ ရှာ
```bash
sudo grep "Failed password" /var/log/auth.log | \
  grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head
sudo lastb | head           # မအောင်မြင်သော login
last | head                 # အောင်မြင်သော login
```

### အဆင့် ၂ - Fail2ban ထည့်
```bash
sudo apt install -y fail2ban
sudo tee /etc/fail2ban/jail.local > /dev/null <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 YOUR_OFFICE_IP

[sshd]
enabled = true
port    = ssh
EOF
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

### အဆင့် ၃ - စမ်းသပ်
Lab VM သို့ **ဒုတိယစက်မှ** Password အမှား ၆ ကြိမ်ထည့်-
```bash
for i in $(seq 6); do ssh -o PubkeyAuthentication=no wrong@SERVER_IP; done
sudo fail2ban-client status sshd      # Banned IP ပေါ်လာမည်
sudo fail2ban-client set sshd unbanip 1.2.3.4   # ပြန်ဖွင့်
```

### အဆင့် ၄ - SSH ပိုလုံခြုံအောင်
`/etc/ssh/sshd_config.d/99-hardening.conf`
```
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
LoginGraceTime 20
AllowUsers ubuntu deploy
```
```bash
sudo sshd -t && sudo systemctl reload ssh
```

### ✅ စစ်ဆေးရန်
`fail2ban-client status sshd` တွင် Banned IP စာရင်းရှိရမည်။ `sudo iptables -L f2b-sshd -n` ဖြင့်လည်း ကြည့်ပါ။

### 🧠 ဘာကြောင့်လဲ
Public IP ရှိသော Server ကို မိနစ်ပိုင်းအတွင်း Bot ရှာတွေ့သည်။ Key-only + Fail2ban + AllowUsers သည် အနည်းဆုံး စံအဆင့်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** SSH port ကို `2222` သို့ ပြောင်းလျှင် (Firewall ကြိုဖွင့်ပါ!) Log ထဲ Attempt ဘယ်လောက်ကျသလဲ နှိုင်းယှဉ်ပါ။ (Security by obscurity သာဖြစ်ကြောင်း သတိပြုပါ)

---

## 🔸 Lab A4 - Firewall Default-Deny Design

**📋 Scenario:** Web Server တွင် 22, 80, 443 သာ ဖွင့်ပြီး DB port (3306) ကို Private network မှသာ ဝင်ခွင့်ပေးရမည်။

```bash
sudo ufw reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH ကို Office IP မှသာ
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
# Web အားလုံး
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# MySQL ကို Private subnet မှသာ
sudo ufw allow from 10.0.1.0/24 to any port 3306 proto tcp

# Rate limit (SSH brute-force ကာကွယ်)
sudo ufw limit 22/tcp

sudo ufw logging on
sudo ufw enable
sudo ufw status numbered
```

### Rule ဖျက်ခြင်း
```bash
sudo ufw delete 3
```

### Firewall Log ဖတ်ခြင်း
```bash
sudo tail -f /var/log/ufw.log | grep BLOCK
```

### ✅ စစ်ဆေးရန် (အပြင်စက်မှ)
```bash
nmap -Pn -p 22,80,443,3306 SERVER_IP
# 80,443 open၊ 3306 filtered ဖြစ်ရမည်
```

### 🧠 ဘာကြောင့်လဲ
**Default Deny** (ပိတ်ထားပြီး လိုသည်ကိုသာဖွင့်) သည် Firewall အခြေခံ။ Cloud တွင် Security Group ကိုလည်း ဤနည်းအတိုင်း ပြုလုပ်သည်။ ⚠️ SSH rule မထည့်ဘဲ `ufw enable` မလုပ်ပါနှင့်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `nftables` ဖြင့် တူညီသော Rule ကို ရေးပါ (`nft list ruleset`)။

---

## 🔸 Lab A5 - Nginx Reverse Proxy + HTTPS

**📋 Scenario:** Backend app (port 8000) ကို Domain အမည်ဖြင့် HTTPS ဖြင့် ဖော်ပြရမည်။

### ① Backend ကို Lab M4 ၏ `hello.service` ဖြင့် Run ထား
```bash
curl localhost:8000
```

### ② Nginx Install နှင့် Site Config
```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/myapp > /dev/null <<'EOF'
upstream backend {
    server 127.0.0.1:8000;
    keepalive 16;
}

server {
    listen 80;
    server_name myapp.example.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### ③ HTTPS (Let's Encrypt)
DNS A record သည် Server IP ကိုညွှန်ပြီး ဖြစ်ရမည်။
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d myapp.example.com
sudo certbot renew --dry-run          # Auto renew စစ်
systemctl list-timers | grep certbot
```
> Domain မရှိသေးလျှင် Self-signed ဖြင့် လေ့ကျင့်နိုင်သည်-
> ```bash
> sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
>   -keyout /etc/ssl/private/lab.key -out /etc/ssl/certs/lab.crt -subj "/CN=localhost"
> ```

### ④ Security Header နှင့် Rate-limit
```nginx
# http {} အတွင်း
limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;

# server {} အတွင်း
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;
add_header Strict-Transport-Security "max-age=31536000" always;
location / {
    limit_req zone=perip burst=20 nodelay;
    # ... proxy settings
}
```

### ✅ စစ်ဆေးရန်
```bash
curl -I https://myapp.example.com
openssl s_client -connect myapp.example.com:443 -servername myapp.example.com </dev/null 2>/dev/null | openssl x509 -noout -dates
# Backend ရပ်ကြည့် -> 502 Bad Gateway ရမည်
sudo systemctl stop hello && curl -I localhost
```

### 🧠 ဘာကြောင့်လဲ
Backend ကို Internet သို့ တိုက်ရိုက်မဖော်ဘဲ Nginx နောက်ကွယ်တွင်ထား၊ TLS, Rate-limit, Header အားလုံးကို Nginx တွင် စုစည်းကိုင်တွယ်သည်။ **502 = Nginx ကောင်း၊ Backend ကျ**။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Backend ၂ ခု (`8000`, `8001`) ကို `upstream` တွင်ထည့်ပြီး Load balance ကို `curl` ၁၀ ကြိမ်ဖြင့် အတည်ပြုပါ။ HTTP -> HTTPS redirect ထည့်ပါ။

---

## 🔸 Lab A6 - Zero-Downtime Deployment (Symlink Release)

**📋 Scenario:** Deploy လုပ်နေစဉ် User များ Error မမြင်စေရ၊ ပြဿနာရှိလျှင် ၁၀ စက္ကန့်အတွင်း Rollback။

### Folder ဖွဲ့စည်းပုံ
```
/var/www/myapp/
├── releases/
│   ├── 20261022_100000/
│   └── 20261022_150000/
├── shared/            (uploads, .env - release များ မျှဝေ)
└── current -> releases/20261022_150000   (symlink)
```

### Deploy script
```bash
sudo tee /opt/scripts/deploy.sh > /dev/null <<'EOF'
#!/bin/bash
set -euo pipefail
BASE=/var/www/myapp
REL=$BASE/releases/$(date +%Y%m%d_%H%M%S)
KEEP=5

mkdir -p "$REL" "$BASE/shared"
# 1) Code ယူ (နမူနာ - Git)
git clone --depth 1 https://github.com/YOUR/REPO.git "$REL"

# 2) Shared ချိတ်
ln -sfn "$BASE/shared/.env" "$REL/.env"

# 3) Build / Dependency ... (composer install --no-dev, npm ci စသည်)

# 4) Atomic switch (ln -sfn + mv = ချက်ချင်း)
ln -sfn "$REL" "$BASE/current_tmp"
mv -Tf "$BASE/current_tmp" "$BASE/current"

# 5) Service reload (restart မဟုတ်)
sudo systemctl reload php8.3-fpm || sudo systemctl reload myapp

# 6) Health check မအောင်လျှင် Rollback
if ! curl -fs -m 5 http://localhost/health >/dev/null; then
  echo "Health check FAILED -> rollback"
  PREV=$(ls -1dt "$BASE"/releases/* | sed -n 2p)
  ln -sfn "$PREV" "$BASE/current_tmp" && mv -Tf "$BASE/current_tmp" "$BASE/current"
  exit 1
fi

# 7) Release အဟောင်းရှင်း
ls -1dt "$BASE"/releases/* | tail -n +$((KEEP+1)) | xargs -r rm -rf
echo "Deploy OK: $REL"
EOF
sudo chmod +x /opt/scripts/deploy.sh
```

### Manual Rollback
```bash
cd /var/www/myapp
ls -1t releases
ln -sfn releases/PREVIOUS current_tmp && mv -Tf current_tmp current
```

### ✅ စစ်ဆေးရန်
Terminal တစ်ခုတွင် `while true; do curl -s -o /dev/null -w "%{http_code}\n" localhost; sleep 0.2; done` ကို Run ထားပြီး Deploy လုပ်ကြည့်ပါ - **200 သာထွက်ရမည်၊ 5xx မပါရ**။

### 🧠 ဘာကြောင့်လဲ
`mv -T` သည် atomic ဖြစ်သောကြောင့် Request တစ်ခုမျှ ပျက်မသွား။ Release folder များကို ထားခြင်းဖြင့် Rollback သည် Symlink ပြောင်းရုံသာ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `/health` endpoint ကို ရိုးရိုး HTML ဖြင့်ဖန်တီး၍ ရည်ရွယ်ချက်ရှိရှိ ပျက်စေပြီး Auto-rollback အလုပ်လုပ်သလား စမ်းပါ။

---

## 🔸 Lab A7 - Bash Health-check & Alert Script

**📋 Scenario:** Server ၏ Disk, Memory, Service, Website ကို ၅ မိနစ်တစ်ကြိမ် စစ်ပြီး ပြဿနာရှိလျှင် Slack/Discord သို့ သတိပေးရမည်။

```bash
sudo tee /opt/scripts/healthcheck.sh > /dev/null <<'EOF'
#!/bin/bash
set -uo pipefail

WEBHOOK_URL="${WEBHOOK_URL:-}"          # env မှ ယူ (Script ထဲ မရေးပါနှင့်)
HOST=$(hostname)
DISK_LIMIT=80
MEM_LIMIT=90
SERVICES=("nginx" "hello")
URL="http://localhost/"
problems=()

# Disk
disk=$(df / --output=pcent | tail -1 | tr -dc '0-9')
(( disk >= DISK_LIMIT )) && problems+=("Disk ${disk}% used")

# Memory
mem=$(free | awk '/Mem:/ {printf "%d", $3/$2*100}')
(( mem >= MEM_LIMIT )) && problems+=("Memory ${mem}% used")

# Load
load=$(awk '{print $1}' /proc/loadavg)
cores=$(nproc)
awk -v l="$load" -v c="$cores" 'BEGIN{exit !(l>c*2)}' && problems+=("High load: $load (cores: $cores)")

# Services
for s in "${SERVICES[@]}"; do
  systemctl is-active --quiet "$s" || problems+=("Service DOWN: $s")
done

# Website
code=$(curl -s -o /dev/null -m 5 -w "%{http_code}" "$URL")
[[ "$code" =~ ^(2|3) ]] || problems+=("Website HTTP $code")

if (( ${#problems[@]} > 0 )); then
  msg="🚨 [$HOST] $(date '+%F %T')\n$(printf -- '- %s\\n' "${problems[@]}")"
  echo -e "$msg"
  [[ -n "$WEBHOOK_URL" ]] && curl -s -H 'Content-Type: application/json' \
      -d "{\"content\": \"$msg\"}" "$WEBHOOK_URL" >/dev/null
  exit 1
fi
echo "$(date '+%F %T') OK"
EOF
sudo chmod +x /opt/scripts/healthcheck.sh
sudo /opt/scripts/healthcheck.sh
```

### Schedule (systemd timer - cron ထက်ပိုကောင်း)
```bash
sudo tee /etc/systemd/system/healthcheck.service >/dev/null <<'EOF'
[Unit]
Description=Server health check
[Service]
Type=oneshot
EnvironmentFile=-/etc/healthcheck.env
ExecStart=/opt/scripts/healthcheck.sh
EOF
sudo tee /etc/systemd/system/healthcheck.timer >/dev/null <<'EOF'
[Unit]
Description=Run health check every 5 min
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
echo 'WEBHOOK_URL=https://discord.com/api/webhooks/XXX' | sudo tee /etc/healthcheck.env
sudo chmod 600 /etc/healthcheck.env
sudo systemctl daemon-reload
sudo systemctl enable --now healthcheck.timer
systemctl list-timers | grep healthcheck
journalctl -u healthcheck -n 20
```

### ✅ စစ်ဆေးရန်
`sudo systemctl stop nginx` ပြီး Script Run -> Alert ပေါ်ရမည်။

### 🧠 ဘာကြောင့်လဲ
`set -uo pipefail`, Secret ကို env/`chmod 600` ဖိုင်တွင်ထား၊ Output ကို journal တွင်ကြည့်နိုင်ခြင်းတို့သည် Production-grade Script ၏ လက္ခဏာများ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** SSL Certificate သက်တမ်း ၁၄ ရက်အောက်ကျလျှင် Alert ပေးသော စစ်ဆေးမှု ထည့်ပါ (`openssl x509 -checkend`)။

---

## 🔸 Lab A8 - Resource Limits, cgroups & Namespaces (Container ၏ အတွင်းသား)

**📋 Scenario:** Docker/Kubernetes သည် Linux ၏ ဘယ်နည်းပညာကို သုံးသလဲ နားလည်ရန်။ App တစ်ခု Server တစ်ခုလုံးကို မစားစေရန် ကန့်သတ်ရန်။

### File descriptor / Process limit
```bash
ulimit -a
ulimit -n                          # open files limit (1024 ဆိုလျှင် Busy server တွင်မလောက်)
cat /proc/$(pidof nginx | cut -d' ' -f1)/limits | grep -i "open files"
```
systemd service တွင်-
```
[Service]
LimitNOFILE=65535
```

### cgroups v2 ဖြင့် CPU ကန့်သတ်
```bash
systemd-run --scope -p CPUQuota=30% stress-ng --cpu 1 --timeout 30s &
top           # CPU ~30% သာ
systemd-cgls  # cgroup tree
systemd-cgtop
```

### Namespace - Container မပါဘဲ Isolation
```bash
# သီးခြား PID namespace
sudo unshare --pid --fork --mount-proc bash
ps aux          # PID 1 မှ စတင်၊ Host process မမြင်
exit

# သီးခြား Network namespace
sudo ip netns add lab
sudo ip netns exec lab ip a        # lo သာ
sudo ip netns exec lab ping -c1 8.8.8.8   # မရ (Network isolation)
sudo ip netns del lab
```

### Docker နှင့် ချိတ်ဆက်ကြည့်
```bash
docker run -d --name limited --memory=128m --cpus=0.5 nginx:alpine
docker stats --no-stream limited
cat /sys/fs/cgroup/system.slice/docker-$(docker inspect -f '{{.Id}}' limited).scope/memory.max
docker rm -f limited
```

### 🧠 ဘာကြောင့်လဲ
**Container = Namespace (သီးခြားမြင်ကွင်း) + cgroups (အရင်းအမြစ်ကန့်သတ်) + Image filesystem**။ ဤအချက်ကို နားလည်လျှင် Docker/K8s ပြဿနာများကို ပိုနက်ရှိုင်းစွာ debug နိုင်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Network namespace နှစ်ခုကို `veth` pair ဖြင့် ချိတ်ပြီး ping ရအောင်လုပ်ပါ (`ip link add veth0 type veth peer name veth1`)။

---

## 🔸 Lab A9 - Incident Response & Postmortem

**📋 Scenario (၂ နာရီ ည ၂ နာရီ):** Alert ဝင်လာသည် - "Website 502 error"။ ၁၅ မိနစ်အတွင်း ပြန်လည်ကောင်းမွန်စေရမည်။

### Incident Runbook (အစဉ်လိုက်)

```
① Acknowledge   -> အသိပေး (Team channel: "ကျွန်ုပ်စစ်နေသည်")
② Scope         -> ဘယ်လောက်ထိခိုက်? (အားလုံး? တစ်စိတ်တစ်ပိုင်း?)
③ Recent change -> နောက်ဆုံး Deploy/Config ပြောင်း ရှိသလား?
④ Mitigate      -> အရင် ပြန်လည်ကောင်းအောင် (Rollback/Restart) - Root cause နောက်မှ
⑤ Root cause    -> Log/Metric ဖြင့် တကယ့်အကြောင်းရင်း
⑥ Postmortem    -> မှတ်တမ်းရေး၊ ထပ်မဖြစ်အောင်
```

### ၁၅ မိနစ် Command စာရင်း
```bash
# Scope + အခြေအနေ
curl -I https://myapp.example.com
systemctl --failed
uptime; free -h; df -h

# ③ နောက်ဆုံး ဘာပြောင်းလဲ?
last -x | head
sudo journalctl --since "2 hours ago" -p warning | tail -50
ls -lt /var/www/myapp/releases | head -3
sudo grep -iE "install|upgrade" /var/log/apt/history.log | tail

# ဘယ် Service က ကျ?
systemctl status nginx myapp php8.3-fpm
sudo tail -n 100 /var/log/nginx/error.log
sudo ss -tulpn | grep -E ':80|:8000|:9000'

# ④ Mitigation
sudo systemctl restart myapp           # အမြန်ပြန်စ
# သို့မဟုတ် Lab A6 ၏ Rollback
```

### 🔥 စမ်းသပ် Game Day (Lab VM တွင်)
ကိုယ်တိုင် ပြဿနာကို ဖန်တီးပြီး (သို့မဟုတ် သူငယ်ချင်းကို ဖန်တီးခိုင်း) Runbook အတိုင်း ဖြေရှင်းပါ-

| Incident | ဖန်တီးပုံ | ရှာဖွေပုံ |
| :--- | :--- | :--- |
| Service ကျ | `systemctl stop hello` | `systemctl --failed`, 502 |
| Disk ပြည့် | `fallocate -l 90%...` | `df -h`, `du` (Lab M7) |
| Config အမှား | nginx.conf တွင် typo | `nginx -t`, `journalctl -u nginx` |
| Permission ပြောင်း | `chmod 000 /opt/hello/app.py` | `journalctl -u hello`, `namei -l` |
| Port ဝင်ရောက်တိုက်ခိုက် | Port ကို တခြား process သုံး | `ss -tulpn` |

### Postmortem Template
```markdown
# Incident Report: 2026-10-22 Website 502

**Duration:** 02:05 - 02:18 (13 min)  **Severity:** SEV2
**Impact:** User အားလုံး API ခေါ်မရ

## Timeline
- 02:05 Alert ဝင်
- 02:07 `systemctl status myapp` -> failed, OOM
- 02:12 Restart + MemoryMax ချိန်
- 02:18 ပြန်ကောင်း

## Root Cause
Memory leak ကြောင့် OOM Killer က myapp ကိုသတ်

## What went well / What went wrong
...

## Action Items
- [ ] Memory alert 80% (Owner: Kyaw, Due: 10/29)
- [ ] Leak ပြင်ဆင် (Owner: Dev team)
- [ ] systemd MemoryMax + Restart=always
```
> Postmortem သည် **အပြစ်ရှာခြင်း မဟုတ် (Blameless)**။ စနစ်ကို တိုးတက်စေခြင်းသာ ရည်ရွယ်သည်။

### 🧠 ဘာကြောင့်လဲ
Incident တွင် **အရင်ပြန်ကောင်းအောင်လုပ် (Mitigate)၊ ပြီးမှ အကြောင်းရှာ**။ အလုပ်ခန့်ရာတွင်လည်း ဤစဉ်းစားပုံကို အမြဲမေးသည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** အပေါ်ဇယားမှ Incident ၃ ခုကို Game Day ပြုလုပ်၍ Postmortem ၃ ခု ရေးပါ။

---

## 🔸 Lab A10 - Server Hardening Audit

**📋 Scenario:** Security Team က Server အသစ်ကို Production မတင်မီ Audit လုပ်ရမည်ဟု ဆိုသည်။

### Checklist ကို Command ဖြင့် စစ်

```bash
echo "== 1. User/Privilege =="
awk -F: '$3==0 {print "UID0:", $1}' /etc/passwd          # root တစ်ခုတည်း ဖြစ်ရမည်
awk -F: '($2=="" ) {print "Empty password:", $1}' /etc/shadow 2>/dev/null
sudo grep -rE "NOPASSWD" /etc/sudoers /etc/sudoers.d/ 2>/dev/null

echo "== 2. SSH =="
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication|maxauthtries|x11forwarding"

echo "== 3. Listening ports =="
sudo ss -tulpn

echo "== 4. Firewall =="
sudo ufw status verbose

echo "== 5. Updates =="
apt list --upgradable 2>/dev/null | head
systemctl is-enabled unattended-upgrades

echo "== 6. SUID/World-writable =="
sudo find / -xdev -perm -4000 -type f 2>/dev/null
sudo find / -xdev -type f -perm -0002 2>/dev/null | head
sudo find / -xdev -nouser -o -nogroup 2>/dev/null | head

echo "== 7. Services =="
systemctl list-unit-files --state=enabled | head -30

echo "== 8. Time sync =="
timedatectl | grep -E "synchronized|NTP"

echo "== 9. Logs & Backup =="
ls /etc/logrotate.d | head; ls -lh /var/backups/app | tail -3
```

### Auto security update ဖွင့်
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Lynis ဖြင့် အလိုအလျောက် Audit
```bash
sudo apt install -y lynis
sudo lynis audit system
# "Hardening index" ကို မှတ်ထားပြီး ပြင်ပြီးနောက် ထပ်စစ်ကာ နှိုင်းယှဉ်ပါ
```

### Audit Log (ဘယ်သူ ဘာပြင်သလဲ)
```bash
sudo apt install -y auditd
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/ssh/sshd_config -p wa -k sshd_changes
sudo ausearch -k passwd_changes
```

### ✅ စစ်ဆေးရန်
Audit Report တစ်ခုထုတ်ပါ - ရှာတွေ့သော ပြဿနာများ၊ ပြင်ဆင်ပုံ၊ Lynis score အကြိုနှင့်အကြောင်း။

### 🧠 ဘာကြောင့်လဲ
Hardening သည် တစ်ကြိမ်လုပ်ပြီးပြီ မဟုတ်၊ **ပုံမှန် Audit** လိုသည်။ Compliance (ISO27001, PCI) ကို ဖြေရန်ပါ ဤ Evidence များ လိုအပ်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** အပေါ် Check များကို Script တစ်ခုတည်း (`audit.sh`) ထဲထည့်၍ ရလဒ်ကို PASS/FAIL ဖြင့် ပြပေးသော Report ထုတ်ပါ။

---

## 🏆 Advanced Capstone - ကိုယ်တိုင်ပေါင်းစပ်လုပ်ကြည့်ပါ

Ubuntu VM အသစ်တစ်လုံးတွင် အောက်ပါအားလုံးကို **တစ်ခုပြီး တစ်ခု** ဆောက်ပြီး Documentation (README) ရေးပါ-

| # | လုပ်ရမည့်အရာ | ဆက်စပ် Lab |
| :-: | :--- | :-: |
| 1 | Non-root deploy user, SSH key-only, Root login ပိတ် | M3, A3 |
| 2 | UFW default-deny + 22/80/443 သာ | A4 |
| 3 | App ကို systemd service (limit ပါ) | M4, A2, A8 |
| 4 | Nginx reverse proxy + HTTPS | A5 |
| 5 | Symlink release deploy + auto-rollback | A6 |
| 6 | နေ့စဉ် Backup + Restore စမ်းသပ် | M6 |
| 7 | Logrotate + Disk alert | M7 |
| 8 | Health-check timer + Webhook alert | A7 |
| 9 | Fail2ban + Lynis audit | A3, A10 |
| 10 | Incident ၂ ခု ဖန်တီး၍ Postmortem ရေး | A9 |

ပြီးလျှင် [Lesson 18 - Enterprise Capstone](/linux/18_enterprise_production_server_capstone_project/) နှင့် [Docker & Docker Hub Lesson](/devops/01_docker_core/11-docker-and-docker-hub-step-by-step-for-devops/) သို့ ဆက်လက်လေ့လာပါ။

## 🏁 Advanced Level Checklist

| Lab | ကိုယ်တိုင် ပြန်လုပ်နိုင်ပြီလား? |
| :--- | :-: |
| A1 Performance triage (USE method) | ⬜ |
| A2 OOM ရှာဖွေ + Memory limit | ⬜ |
| A3 Fail2ban + SSH hardening | ⬜ |
| A4 Default-deny firewall | ⬜ |
| A5 Nginx + HTTPS | ⬜ |
| A6 Zero-downtime deploy + rollback | ⬜ |
| A7 Health-check + Alert | ⬜ |
| A8 cgroups / namespaces | ⬜ |
| A9 Incident + Postmortem | ⬜ |
| A10 Hardening audit | ⬜ |
