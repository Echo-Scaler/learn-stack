---
title: Phase 4 Lesson 12 — Security Hardening, Logrotate & Backup Automation
description: Fail2ban Brute-force ကာကွယ်ခြင်း, Unattended Upgrades, Logrotate Architecture (/etc/logrotate.d/), 3-2-1 Backup Strategy, tar/mysqldump နှင့် Disaster Recovery (မြန်မာဘာသာ)
---

# 🛡️ Phase 4 — Lesson 12: Security Hardening, Logrotate & Backup Automation

Production Linux Server တစ်ခုကို ရေရှည်စိတ်ချစွာ လည်ပတ်နိုင်စေရန် အရေးကြီးဆုံး တာဝန် ၂ ရပ်မှာ **လုံခြုံရေးတိုက်ခိုက်မှုများကို အလိုအလျောက် ခုခံခြင်း** နှင့် **Disk မပြည့်စေရန် Log rotation ပြုလုပ်ပြီး ဒေတာများ ပျက်စီးဆုံးရှုံးမှုမရှိစေရန် Backup အလိုအလျောက် ရယူခြင်း** ဖြစ်ပါသည်။

---

## 🔒 ၁။ Security Hardening (Fail2ban & Automatic Security Updates)

### က။ Fail2ban ဖြင့် SSH Brute-force တိုက်ခိုက်မှုများကို အလိုအလျောက် ပိတ်ဆို့ခြင်း
Hacker များသည် SSH စကားဝှက်များကို Dictionary တိုက်စစ်ဖြင့် ခန့်မှန်းရိုက်နှိပ်လေ့ရှိသည်။ **Fail2ban** သည် `/var/log/auth.log` ကို စောင့်ကြည့်ပြီး Password မှားယွင်းမှု ၅ ကြိမ် ဆက်တိုက် ဖြစ်ပေါ်ပါက ထို တိုက်ခိုက်သူ၏ IP ကို Firewall မှတစ်ဆင့် ၁၀ မိနစ် သို့မဟုတ် ၂၄ နာရီ အလိုအလျောက် Block ပစ်ပါသည်:

```bash
# Fail2ban ထည့်သွင်းခြင်း
sudo apt install -y fail2ban

# Configuration ကူးယူပြင်ဆင်ခြင်း
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable --now fail2ban

# လက်ရှိ Block ခံထားရသော Hacker IP စာရင်းကို စစ်ဆေးခြင်း
sudo fail2ban-client status sshd
```

### ခ။ `unattended-upgrades` ဖြင့် Linux Security Patches များ အလိုအလျောက် တင်ခြင်း
Linux Kernel နှင့် OpenSSL စသည့် လုံခြုံရေး အားနည်းချက် (CVE) များကို လက်ဖြင့် စောင့်မတင်ရဘဲ အလိုအလျောက် patch လုပ်ပေးရန်:
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📜 ၂။ Logrotate Architecture (Disk မပြည့်စေရန် Log ဖိုင်များ ရှင်းလင်းခြင်း)

Nginx, Application Logs များကို မထိန်းချုပ်ဘဲထားပါက ရက်သတ္တပတ် အနည်းငယ်အတွင်း 50GB, 100GB အထိ ကြီးထွားလာပြီး Disk 100% ပြည့်ကာ Server တစ်ခုလုံး Crash ဖြစ်သွားတတ်ပါသည်။

**Logrotate** သည် Log ဖိုင်ဟောင်းများကို နေ့စဉ် Compress (gzip) ချုံ့ပေးပြီး သတ်မှတ်ထားသော ရက်ကျော်လွန်ပါက အလိုအလျောက် ဖျက်ပစ်ပေးပါသည်။

### Production Logrotate Configuration နမူနာ (`/etc/logrotate.d/myapp`)

```ini
/var/log/myapp/*.log {
    daily                   # နေ့စဉ် rotate လုပ်ပါ
    missingok               # ဖိုင်မရှိသေးပါက error မတက်ပါနှင့်
    rotate 14               # နောက်ဆုံး ၁၄ ရက်စာသာ သိမ်းပြီး ကျန်တာဖျက်ပါ
    compress                # Log ဖိုင်ဟောင်းများကို .gz ဖြင့် ချုံ့သိမ်းပါ
    delaycompress           # မနေ့ကဖိုင်ကိုတော့ မချုံ့ဘဲ ထားပါဦး
    notifempty              # ဖိုင်အလွတ်ဖြစ်ပါက မလုပ်ပါနှင့်
    create 0640 ubuntu adm  # Log ဖိုင်အသစ်ကို permission 640 ဖြင့် ဆောက်ပါ
}
```

### Logrotate စမ်းသပ်ခြင်း:
```bash
# Debug Mode (တကယ် မဖျက်ဘဲ ဘာလုပ်မည်ကို စမ်းသပ်ပြပါ)
sudo logrotate -d /etc/logrotate.d/myapp
```

---

## 💾 ၃။ 3-2-1 Backup Strategy & Automation Runbook

> **The 3-2-1 Rule**: ဒေတာအရေးကြီးပါက **Copy ၃ စုံ** ရှိရမည်၊ **မတူညီသော Media အမျိုးအစား ၂ မျိုး** ပေါ်တွင် သိမ်းရမည်၊ အနည်းဆုံး **၁ စုံကို Offsite (Cloud S3/အခြား Data Center)** တွင် သိမ်းရမည်။

### Production Automated Backup Script နမူနာ (`/opt/scripts/backup.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/daily"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_NAME="production_db"

mkdir -p "$BACKUP_DIR"

# ၁။ MySQL Database Dump ထုတ်ယူပြီး Gzip ချုံ့ပါ
echo "[INFO] Dumping Database..."
mysqldump -u root "$DATABASE_NAME" | gzip > "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"

# ၂။ Web Application Files များကို Tar Archive ချုံ့ပါ
echo "[INFO] Archiving Web Files..."
tar -czf "$BACKUP_DIR/web_${TIMESTAMP}.tar.gz" /var/www/html

# ၃။ (ရွေးချယ်ရန်) Cloud AWS S3 သို့ Offsite Backup ပေးပို့ပါ
# aws s3 cp "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz" s3://my-enterprise-backups/db/

# ၄။ ၇ ရက်ကျော်လွန်သော Backup အဟောင်းများကို စက်ပေါ်မှ ဖျက်ပစ်ပါ
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete

echo "[SUCCESS] Backup completed at $(date)"
```

---

## 🏋️ ၄။ Hands-on Practice

1. Ubuntu VM တွင် `sudo apt install -y fail2ban` ကို သွင်းပါ။
2. `sudo systemctl status fail2ban` ဖြင့် active ဖြစ်/မဖြစ် စစ်ဆေးပါ။
3. `/etc/logrotate.d/` ထဲတွင် မည်သည့် system logrotate ဖိုင်များ ရှိသည်ကို `ls /etc/logrotate.d` ဖြင့် လေ့လာပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: Fail2ban သည် တိုက်ခိုက်သူ၏ IP ကို မည်သည့် Log ဖိုင်မှ ခြေရာခံဖမ်းယူ၍ ပိတ်ဆို့ပေးသနည်း?
2. **မေးခွန်း ၂**: Logrotate တွင် `rotate 14` နှင့် `compress` တို့၏ အဓိပ္ပာယ်မှာ အဘယ်နည်း?
3. **မေးခွန်း ၃**: Server ပေါ်တွင် Backup ဖိုင်ကို သိမ်းဆည်းထားရုံဖြင့် အဘယ်ကြောင့် မလုံလောက်ဘဲ Offsite Cloud S3 သို့ ပေးပို့ရသနည်း?
