---
title: Phase 9 Lesson 18 — Enterprise Production Server Capstone Project
description: Real-World Enterprise Production Server တည်ဆောက်ခြင်း၊ Hardening၊ Nginx Reverse Proxy၊ TLS/HTTPS၊ Database၊ Zero-Downtime Deployment၊ Automated Backup & Disaster Recovery Drill (မြန်မာဘာသာ)
---

# 🏆 Phase 9 — Lesson 18: End-to-End Enterprise Production Server Capstone Project

ဂုဏ်ယူပါသည်! သင်သည် Phase 1 မှ Phase 8 အထိ Linux Fundamentals၊ Process၊ Storage၊ Networking၊ Firewalls၊ Hardening၊ Web Servers၊ Shell Scripting၊ Docker နှင့် Observability ဘာသာရပ်အားလုံးကို စနစ်တကျ သင်ယူလေ့လာပြီး ဖြစ်ပါသည်။

ဤ **Lesson 18 Capstone Project** တွင် သင်သည် Senior Linux Infrastructure Engineer တစ်ဦး၏ အခန်းကဏ္ဍမှ တာဝန်ယူ၍ **Enterprise-grade Production Ubuntu Server တစ်လုံးကို အစအဆုံး ကိုယ်တိုင် လက်တွေ့တည်ဆောက်၊ လုံခြုံရေးတပ်ဆင်၊ ဝန်ဆောင်မှုများ run ပြီး Disaster Recovery စမ်းသပ်မှု ပြုလုပ်သွားမည်** ဖြစ်ပါသည်။

---

## 🏗️ ၁။ Project Architecture Blueprint (စနစ်တည်ဆောက်ပုံ အကျဉ်းချုပ်)

ဤ Capstone Project တွင် တည်ဆောက်မည့် Architecture ပုံစံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:

```
                  [ Public Internet (Clients / Browsers) ]
                                      │
                                      ▼ HTTPS (Port 443)
┌─────────────────────────────────────────────────────────────────────────────┐
│ UBUNTU PRODUCTION SERVER (Hardened Host)                                    │
│                                                                             │
│  [ UFW Firewall ] -> Allow: 443 (HTTPS), 80 (HTTP), 2222 (Hardened SSH)    │
│                   -> Deny: All other inbound traffic                        │
│                                                                             │
│  [ Fail2ban IDS/IPS ] -> Protects SSH from Brute-force                      │
│                                                                             │
│  [ Nginx Edge Reverse Proxy ]                                               │
│    ├─ SSL/TLS Termination (Strict Ciphers, HTTP/2, HSTS)                   │
│    ├─ Rate Limiting (10 req/sec zone to prevent DoS)                        │
│    ├─ Security Headers (X-Frame-Options, X-Content-Type, CSP)               │
│    └─ Reverse Proxy Proxy_Pass -> http://127.0.0.1:8080                     │
│                                                                             │
│  [ Application Tier ]                                                       │
│    └─ Systemd Service / Docker Container (Running as unprivileged appuser)  │
│                                                                             │
│  [ Database Tier ]                                                          │
│    └─ MySQL / PostgreSQL (Bound to 127.0.0.1 ONLY, Strict Grants)          │
│                                                                             │
│  [ Reliability & Maintenance Automations ]                                  │
│    ├─ Cron Nightly Automated DB & App Backup Script (Gzip + 7-Day Retention)│
│    ├─ Logrotate (/var/log/nginx, /var/log/app)                              │
│    └─ Node Exporter & Health Check Monitoring Watchdog                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 ၂။ Phase-by-Phase Implementation Checklist

Capstone Project ကို အဆင့် ၆ ဆင့်ဖြင့် လက်တွေ့ အကောင်အထည်ဖော်သွားပါမည်:

1. **Step 1: Base Server Provisioning & OS Hardening** (User, SSH, UFW, Fail2ban)
2. **Step 2: Database Server Installation & Hardening** (MySQL Secure Installation)
3. **Step 3: Application Service Deployment** (Systemd Isolated Service)
4. **Step 4: Nginx Reverse Proxy, Security Headers & TLS** (HTTPS Setup)
5. **Step 5: Automated Backup Script & Cron Automation** (3-2-1 Backup Strategy)
6. **Step 6: Disaster Recovery (DR) Simulation & Incident Response Drill**

---

## 🛡️ အဆင့် (၁) — Base Server Provisioning & OS Hardening

Server စတင်ရရှိသည်နှင့် တပြိုင်နက် root အဖြစ် တိုက်ရိုက် မသုံးစွဲဘဲ အောက်ပါ Hardening အဆင့်များကို ဆောင်ရွက်ပါ:

### ၁.၁ Update & Create Unprivileged Admin User
```bash
# System packages များကို အဆင့်မြှင့်တင်ပါ
sudo apt update && sudo apt upgrade -y

# Timezone ကို UTC သတ်မှတ်ပါ
sudo timedatectl set-timezone UTC

# Dedicated Admin User အသစ်ဆောက်ပါ
sudo adduser deployer
sudo usermod -aG sudo deployer

# SSH Public Key ကို deployer သို့ ကူးယူထည့်သွင်းပါ
sudo mkdir -p /home/deployer/.ssh
sudo cp ~/.ssh/authorized_keys /home/deployer/.ssh/
sudo chown -R deployer:deployer /home/deployer/.ssh
sudo chmod 700 /home/deployer/.ssh
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```

### ၁.၂ SSH Daemon Hardening (`/etc/ssh/sshd_config.d/99-hardened.conf`)
```bash
sudo tee /etc/ssh/sshd_config.d/99-hardened.conf << 'EOF'
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# SSH Config Syntax စစ်ဆေးပြီး Restart လုပ်ပါ
sudo sshd -t && sudo systemctl restart ssh
```

### ၁.၃ UFW Firewall & Fail2ban Configuration
```bash
# UFW တပ်ဆင်ပြီး Policy သတ်မှတ်ပါ
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp comment "Hardened SSH Port"
sudo ufw allow 80/tcp comment "HTTP for ACME challenge"
sudo ufw allow 443/tcp comment "HTTPS Web Traffic"
sudo ufw --force enable

# Fail2ban တပ်ဆင်ပြီး SSH Jail ဖွင့်ပါ
sudo apt install -y fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable --now fail2ban
```

---

## 🗄️ အဆင့် (၂) — Production Database Setup & Hardening

Database ကို ပြင်ပ Network သို့ ပေါက်မထွက်စေဘဲ Localhost သီးသန့် ချိတ်ဆက်နိုင်ရန် သတ်မှတ်ပါ:

```bash
# MySQL Server သွင်းယူပါ
sudo apt install -y mysql-server

# Service ဖွင့်လှစ်ပါ
sudo systemctl enable --now mysql

# MySQL bind address ကို 127.0.0.1 တွင်သာ ချိတ်ထားကြောင်း စစ်ဆေးပါ
sudo grep "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf

# Database နှင့် Dedicated User တည်ဆောက်ပါ
sudo mysql -e "CREATE DATABASE enterprise_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'prod_user'@'127.0.0.1' IDENTIFIED BY 'SuperSecretP@ssw0rd2026!';"
sudo mysql -e "GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON enterprise_prod.* TO 'prod_user'@'127.0.0.1';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

---

## 🚀 အဆင့် (၃) — Application Tier Deployment (Systemd Service)

Application ကို root အဖြစ် ဘယ်သောအခါမှ မ run ဘဲ `www-data` သို့မဟုတ် သီးသန့် Service User ဖြင့် run ပါမည်:

### ၃.၁ Application User & Directory တည်ဆောက်ခြင်း
```bash
sudo useradd -r -s /usr/sbin/nologin -d /opt/enterprise-app apprunner
sudo mkdir -p /opt/enterprise-app/{releases,shared/logs}
sudo chown -R apprunner:apprunner /opt/enterprise-app
```

### ၃.၂ Systemd Service Unit ဖန်တီးခြင်း (`/etc/systemd/system/enterprise-app.service`)
```ini
[Unit]
Description=Enterprise Production Web API Service
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=apprunner
Group=apprunner
WorkingDirectory=/opt/enterprise-app/current
ExecStart=/usr/bin/python3 -m http.server 8080 --bind 127.0.0.1
Restart=always
RestartSec=5s

# Security Hardening Directives for Systemd
NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true

# Resource Limits
LimitNOFILE=65535
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

```bash
# Reload and Enable Service
sudo systemctl daemon-reload
sudo systemctl enable --now enterprise-app
sudo systemctl status enterprise-app
```

---

## 🌐 အဆင့် (၄) — Nginx Reverse Proxy, Security & SSL Setup

Nginx ကို Edge Server အဖြစ် တပ်ဆင်ပြီး Reverse Proxy, SSL Ciphers နှင့် Rate Limiting များကို ထည့်သွင်းပါ:

### ၄.၁ Nginx Configuration (`/etc/nginx/sites-available/enterprise.conf`)
```nginx
# Rate Limiting Zone: IP တစ်ခုလျှင် 1 စက္ကန့်အတွင်း 10 requests သာ ခွင့်ပြုမည်
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

upstream app_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Certbot ACME Challenge path
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL Certificates (Self-signed သို့မဟုတ် Let's Encrypt)
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    # Modern TLS Security Configurations
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Enterprise Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxying to Internal App
    location / {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
```

```bash
# Enable Site and Test Configuration
sudo ln -sf /etc/nginx/sites-available/enterprise.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 💾 အဆင့် (၅) — Automated Production Backup & Rotation Automation

Database နှင့် Config များ ပျက်စီးဆုံးရှုံးမှုမဖြစ်စေရန် Production-grade Bash Script ရေးသားပါ:

### ၅.၁ Backup Script (`/usr/local/bin/enterprise_backup.sh`)
```bash
sudo tee /usr/local/bin/enterprise_backup.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/enterprise"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7
LOG_FILE="/var/log/enterprise_backup.log"

mkdir -p "${BACKUP_DIR}"

log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log_msg "Starting automated enterprise production backup..."

# 1. Backup MySQL Database
DB_FILE="${BACKUP_DIR}/db_enterprise_${DATE}.sql.gz"
if mysqldump --single-transaction --quick enterprise_prod | gzip > "${DB_FILE}"; then
    log_msg "Database backup completed successfully: ${DB_FILE}"
else
    log_msg "ERROR: Database backup failed!" >&2
    exit 1
fi

# 2. Backup Critical Server Configurations (/etc/nginx, /etc/ssh)
CONFIG_FILE="${BACKUP_DIR}/config_etc_${DATE}.tar.gz"
tar -czf "${CONFIG_FILE}" /etc/nginx /etc/ssh
log_msg "System configs archived: ${CONFIG_FILE}"

# 3. Rotate Old Backups (> 7 days)
log_msg "Purging backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "*.gz" -mtime +"${RETENTION_DAYS}" -exec rm -f {} +

log_msg "Enterprise backup cycle finished cleanly."
EOF

sudo chmod +x /usr/local/bin/enterprise_backup.sh
```

### ၅.၂ Configure Nightly Cron Task (`/etc/cron.d/enterprise_backup`)
```bash
sudo tee /etc/cron.d/enterprise_backup << 'EOF'
# Every night at 02:00 AM UTC
0 2 * * * root /usr/local/bin/enterprise_backup.sh > /dev/null 2>&1
EOF
```

---

## 💥 အဆင့် (၆) — Disaster Recovery (DR) Simulation & Incident Response Drill

Senior Engineer တစ်ဦးအနေဖြင့် စနစ်ကို တည်ဆောက်ရုံသာမက အရေးပေါ် ပျက်စီးမှုများတွင် စနစ်တကျ ပြန်လည်ကုစားနိုင်ကြောင်း စမ်းသပ်ပြသရပါမည်:

### 🚨 Drill 1: Application Service Crashes (模擬 Service Down)
```bash
# 模擬: Application process ကို SIGKILL ဖြင့် ရပ်တန့်ခြင်း
sudo systemctl kill -s SIGKILL enterprise-app

# စစ်ဆေးချက်: systemd ၏ `Restart=always` ကြောင့် 5 စက္ကန့်အတွင်း အလိုအလျောက် ပြန် run လာသလား စစ်ဆေးပါ
sleep 6
sudo systemctl status enterprise-app
```
* **အောင်မြင်မှု စံနှုန်း**: `Active: active (running)` အဖြစ် အလိုအလျောက် Self-heal ဖြစ်သွားရမည်။

### 🚨 Drill 2: Accidental Database Data Loss (模擬 Disaster Recovery)
```bash
# 模擬: Database ထဲမှ Table တစ်ခုကို မတော်တဆ DROP လုပ်မိခြင်း
sudo mysql enterprise_prod -e "DROP TABLE IF EXISTS users;"

# Recovery Action: နောက်ဆုံးရရှိသော Backup မှ Restore ပြန်သွင်းခြင်း
LATEST_BACKUP=$(ls -t /var/backups/enterprise/db_*.sql.gz | head -n 1)
echo "Restoring from ${LATEST_BACKUP}..."
gunzip -c "${LATEST_BACKUP}" | sudo mysql enterprise_prod

echo "Data restored successfully!"
```

---

## 🎯 Capstone Project Evaluation Criteria (အကဲဖြတ် စံနှုန်းများ)

| အပိုင်း | စစ်ဆေးရမည့် အချက် | ရမှတ် | အောင်မြင်မှု အခြေအနေ |
| :--- | :--- | :--- | :--- |
| **Security** | SSH Port 2222, Root Login Disabled, Key Only | 20% | `sshd -T \| grep permitrootlogin` = no |
| **Network & Firewall** | UFW ဖွင့်ထားပြီး 80, 443, 2222 သာ ပွင့်ထားခြင်း | 20% | `sudo ufw status` |
| **Reverse Proxy** | Nginx SSL/TLS, Rate Limiting, Security Headers | 20% | `curl -I https://localhost` |
| **App & Database** | App running under `apprunner`, MySQL isolated | 20% | `ss -tulpn` |
| **Automation & DR** | Nightly Backups, 7-day retention, Self-healing App | 20% | Backup script exits with code 0 |

---

## 🎓 အနှစ်ချုပ်နှင့် နောက်ဆက်တွဲ ခရီးစဉ် (Senior Linux Engineer Graduation)

သင်သည် Linux Server Engineering Track အားလုံးကို အောင်မြင်စွာ ပြီးမြောက်ခဲ့ပြီ ဖြစ်ပါသည်။ သင် ရရှိသွားသော ကျွမ်းကျင်မှုများသည် Cloud Platforms (AWS EC2, Google Cloud Compute Engine, DigitalOcean), Kubernetes Nodes နှင့် Bare-metal On-premise Data Centers များတွင် အပြည့်အဝ အသုံးချနိုင်သည့် Production-ready Engineering Skills များ ဖြစ်ပါသည်။ 

ဆက်လက်၍ Docker, Kubernetes, CI/CD Pipeline နှင့် Cloud Architecture ဘာသာရပ်များတွင် ဤ Linux အခြေခံခိုင်မာမှုကို အသုံးချကာ အဆင့်မြင့် အောင်မြင်မှုများကို ဆွတ်ခူးနိုင်ပါစေကြောင်း ဆုမွန်ကောင်းတောင်းအပ်ပါသည်။
