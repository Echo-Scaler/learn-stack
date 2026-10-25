# 🚀 Capstone Project A: Linux Server Automated Health & Backup Monitor (မြန်မာဘာသာ)

> **ကျွမ်းကျင်မှုနယ်ပယ်**: Bash Scripting, Linux System Administration, Cron / Systemd Timers, AWS S3, OpenSSL, Telegram Webhook API

---

## 📌 ၁။ ပရောဂျက် မိတ်ဆက်နှင့် ရည်ရွယ်ချက် (Project Overview)

အသေးစားနှင့် အလတ်စား ကုမ္ပဏီများတွင် Web Server နှင့် Database Server များကို နေ့စဉ်ပုံမှန် စစ်ဆေးရန်နှင့် Database Backup များကို Offsite Cloud (AWS S3) သို့ လုံခြုံစွာ သိမ်းဆည်းရန်အတွက် Automated Script တစ်ခု မဖြစ်မနေ လိုအပ်ပါသည်။

ဤ Project A တွင် Production Linux Server တစ်ခုပေါ်ရှိ System Health (CPU, RAM, Disk) ကို စောင့်ကြည့်ပြီး၊ Database ကို Dump ထုတ်ကာ AES-256 ဖြင့် encrypt လုပ်၍ AWS S3 သို့ အလိုအလျောက် ပေးပို့သိမ်းဆည်းပေးသော စနစ်ကို အစအဆုံး တည်ဆောက်ပါမည်။

### 🎯 Key Deliverables:
1. `set -euo pipefail` ဖြင့် ရေးသားထားသော Robust Bash Script
2. System Resource Check (> 85% Disk/RAM Alert)
3. Automated MySQL / PostgreSQL Database Dump
4. OpenSSL AES-256-CBC Encrypted & Gzip Compressed Archive
5. AWS S3 CLI Sync with 7-Day Local & Remote Retention Policy
6. Telegram Bot Rich HTML Alert Notification
7. Linux Systemd Timer / Cron Automated Scheduling

---

## 🏗️ ၂။ စနစ် တည်ဆောက်ပုံ (Architecture Diagram)

```text
[ Ubuntu Linux Server ]
         │
    Systemd Timer (Runs daily at 02:00 AM UTC)
         │
         ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ backup-and-monitor.sh                                       │
 │                                                             │
 │ 1. System Health Check:                                     │
 │    - CPU Load, RAM (>85%), Disk (>85%)                      │
 │                                                             │
 │ 2. Database Backup:                                         │
 │    - mysqldump --single-transaction app_db                  │
 │                                                             │
 │ 3. Compression & Encryption:                                │
 │    - tar.gz + openssl enc -aes-256-cbc                      │
 │                                                             │
 │ 4. Offsite Cloud Sync:                                      │
 │    - aws s3 cp ... s3://prod-backups-bucket/daily/          │
 │                                                             │
 │ 5. Retention Cleanup:                                       │
 │    - Delete local & S3 files older than 7 days              │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Alerting & Monitoring:                                      │
 │ - Success / Failure HTML Alert sent to Telegram Channel     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 💻 ၃။ အပြည့်အစုံ ရေးသားထားသော Script များ (Source Code)

### ၃.၁ Configuration File (`/etc/server-backup/backup.conf`):
```bash
# Database Configuration
DB_NAME="production_app"
DB_USER="backup_agent"
DB_PASS="StrongSecretPassword123!"
DB_HOST="127.0.0.1"

# Backup Paths
BACKUP_DIR="/var/backups/daily"
RETENTION_DAYS=7

# AWS S3 Configuration
S3_BUCKET="s3://mycompany-production-backups/database"
AWS_REGION="ap-southeast-1"

# Encryption Secret Key
ENCRYPTION_KEY="SuperSecretAES256EncryptionKeyPassphrase"

# Telegram Bot Alert Configuration
TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
TELEGRAM_CHAT_ID="-100987654321"

# Thresholds
DISK_THRESHOLD=85
RAM_THRESHOLD=85
```

---

### ၃.၂ Production Backup Script (`/usr/local/bin/backup-and-monitor.sh`):
```bash
#!/usr/bin/env bash
# ==============================================================================
# Script Name: backup-and-monitor.sh
# Purpose: Server Health Check, MySQL Dump, AES Encryption, S3 Sync & Telegram Alert
# Author: DevOps Engineering Team
# ==============================================================================

set -euo pipefail
IFS=$'\n\t'

# 1. Load Configuration
CONFIG_FILE="/etc/server-backup/backup.conf"
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "ERROR: Configuration file $CONFIG_FILE not found!" >&2
    exit 1
fi
# shellcheck source=/dev/null
source "$CONFIG_FILE"

# 2. Setup Variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
HOSTNAME=$(hostname -f 2>/dev/null || hostname)
SERVER_IP=$(curl -s -m 5 https://api.ipify.org || echo "Unknown")
LOG_FILE="/var/log/server-backup-${TIMESTAMP}.log"
BACKUP_FILENAME="${DB_NAME}_${TIMESTAMP}.sql.gz.enc"
TARGET_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

mkdir -p "$BACKUP_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=========================================================="
echo "Starting Backup & Health Monitor at $(date)"
echo "Host: $HOSTNAME ($SERVER_IP)"
echo "=========================================================="

# 3. Helper: Send Telegram Notification
send_telegram() {
    local status_icon="$1"
    local message="$2"
    local payload
    payload=$(cat <<EOF
{
  "chat_id": "$TELEGRAM_CHAT_ID",
  "parse_mode": "HTML",
  "text": "$status_icon <b>[Server Backup Report]</b>\n<b>Host:</b> <code>$HOSTNAME</code> ($SERVER_IP)\n<b>Time:</b> <code>$(date)</code>\n\n$message"
}
EOF
)
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
         -H "Content-Type: application/json" \
         -d "$payload" >/dev/null || true
}

# Trap unexpected errors
trap 'send_telegram "❌" "<b>BACKUP FAILED!</b>\nScript terminated unexpectedly on line $LINENO."; exit 1' ERR

# 4. Step 1: System Health Check
echo "[*] Checking System Health..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
RAM_USAGE=$(free | awk '/Mem:/ {printf("%.0f"), $3/$2 * 100}')
CPU_LOAD=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | tr -d ' ')

HEALTH_MSG="<b>CPU Load:</b> <code>$CPU_LOAD</code> | <b>RAM:</b> <code>${RAM_USAGE}%</code> | <b>Disk:</b> <code>${DISK_USAGE}%</code>"

if [[ "$DISK_USAGE" -ge "$DISK_THRESHOLD" ]]; then
    send_telegram "⚠️" "<b>WARNING: High Disk Usage Detected!</b>\nRoot partition is at <b>${DISK_USAGE}%</b> (Threshold: ${DISK_THRESHOLD}%)\n$HEALTH_MSG"
fi

if [[ "$RAM_USAGE" -ge "$RAM_THRESHOLD" ]]; then
    send_telegram "⚠️" "<b>WARNING: High RAM Usage Detected!</b>\nMemory usage is at <b>${RAM_USAGE}%</b> (Threshold: ${RAM_THRESHOLD}%)\n$HEALTH_MSG"
fi

# 5. Step 2: Database Dump, Gzip & AES-256 Encryption
echo "[*] Dumping Database: $DB_NAME..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --quick \
    --skip-lock-tables \
    "$DB_NAME" | \
    gzip -9 | \
    openssl enc -aes-256-cbc -salt -pbkdf2 -pass "pass:$ENCRYPTION_KEY" \
    -out "$TARGET_PATH"

BACKUP_SIZE=$(du -sh "$TARGET_PATH" | awk '{print $1}')
echo "[✔] Backup completed and encrypted. Size: $BACKUP_SIZE"

# 6. Step 3: Upload to AWS S3
echo "[*] Uploading backup to AWS S3: $S3_BUCKET..."
aws s3 cp "$TARGET_PATH" "${S3_BUCKET}/${BACKUP_FILENAME}" \
    --region "$AWS_REGION" \
    --storage-class STANDARD_IA

echo "[✔] Successfully uploaded to S3."

# 7. Step 4: Cleanup Retention Policy (Local & Remote)
echo "[*] Cleaning up backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz.enc" -mtime +"$RETENTION_DAYS" -exec rm -f {} +

# Clean up AWS S3 old backups
CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d 2>/dev/null || date -v -"${RETENTION_DAYS}"d +%Y-%m-%d)
aws s3 ls "${S3_BUCKET}/" --region "$AWS_REGION" | while read -r line; do
    file_date=$(echo "$line" | awk '{print $1}')
    file_name=$(echo "$line" | awk '{print $4}')
    if [[ "$file_date" < "$CUTOFF_DATE" && -n "$file_name" ]]; then
        echo "[*] Deleting expired S3 object: $file_name"
        aws s3 rm "${S3_BUCKET}/${file_name}" --region "$AWS_REGION"
    fi
done

# 8. Step 5: Send Success Alert
SUCCESS_MSG="<b>Status:</b> SUCCESSFUL\n<b>Database:</b> <code>$DB_NAME</code>\n<b>Archive:</b> <code>$BACKUP_FILENAME</code>\n<b>Size:</b> <code>$BACKUP_SIZE</code>\n<b>S3 Location:</b> <code>${S3_BUCKET}/${BACKUP_FILENAME}</code>\n\n<b>System Health:</b>\n$HEALTH_MSG"
send_telegram "✅" "$SUCCESS_MSG"

echo "[✔] All backup and monitoring operations completed successfully."
exit 0
```

---

## ⚙️ ၄။ Automated Scheduling with Systemd (Timer Setup)

Cron အစား modern Linux standard ဖြစ်သော `systemd.timer` ကို အသုံးပြု၍ နေ့စဉ် ညဉ့် ၂:၀၀ နာရီတွင် run ရန် configure ပြုလုပ်ပုံ:

### ၄.၁ Systemd Service (`/etc/systemd/system/server-backup.service`):
```ini
[Unit]
Description=Daily Database Backup and System Health Monitor
After=network.target mysql.service

[Service]
Type=oneshot
User=root
ExecStart=/usr/local/bin/backup-and-monitor.sh
StandardOutput=journal
StandardError=journal
```

### ၄.၂ Systemd Timer (`/etc/systemd/system/server-backup.timer`):
```ini
[Unit]
Description=Run Daily Database Backup at 02:00 AM UTC
Requires=server-backup.service

[Timer]
OnCalendar=*-*-* 02:00:00 UTC
Persistent=true

[Install]
WantedBy=timers.target
```

### ၄.၃ Activation Commands:
```bash
# Make script executable
sudo chmod 700 /usr/local/bin/backup-and-monitor.sh
sudo chmod 600 /etc/server-backup/backup.conf

# Reload systemd and enable timer
sudo systemctl daemon-reload
sudo systemctl enable --now server-backup.timer

# Verify timer status
sudo systemctl list-timers --all | grep server-backup
```

---

## 🧪 ၅။ Restore Procedure (Backup ဖိုင်ကို ပြန်လည် ဖြေရှင်းနည်း)

မတော်တဆ Data ဆုံးရှုံးသွားပါက Encrypted backup ဖိုင်မှ Database ကို ပြန် restore လုပ်နည်း:

```bash
# 1. Download encrypted file from AWS S3
aws s3 cp s3://mycompany-production-backups/database/production_app_20261025_020000.sql.gz.enc ./

# 2. Decrypt with OpenSSL and decompress
openssl enc -d -aes-256-cbc -pbkdf2 -pass "pass:SuperSecretAES256EncryptionKeyPassphrase" \
    -in production_app_20261025_020000.sql.gz.enc | \
    gunzip > restored_db.sql

# 3. Import back into MySQL
mysql -u root -p production_app < restored_db.sql
```

---

## 💼 ၆။ Resume ပေါ်တွင် ထည့်သွင်းဖော်ပြရမည့် စံပြစာသား (Resume Bullets)
- *"Engineered an automated bash backup and server monitoring pipeline with OpenSSL AES-256 encryption, S3 offsite synchronization, and real-time Telegram alerts, cutting incident response time by 45% and ensuring zero data loss."*
- *"Implemented automated 7-day retention lifecycle across on-premise storage and AWS S3 Standard-IA, saving 35% monthly storage costs."*
