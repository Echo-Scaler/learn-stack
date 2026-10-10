---
title: Phase 5 Lesson 14 — Application Deployment (PHP, Java & Databases)
description: PHP-FPM Deployment, Spring Boot Java JAR Daemon, MySQL Production Security, Symlink Zero-Downtime Deployment Pattern နှင့် Instant Rollback (မြန်မာဘာသာ)
---

# 🚀 Phase 5 — Lesson 14: Application Deployment (PHP, Java & Databases)

Web Server အခြေခံများကို နားလည်ပြီးနောက် တကယ့် **Production Web Applications (PHP, Java, Node.js)** များကို Database (MySQL) နှင့် တွဲဖက်၍ Server ပေါ်သို့ အမှားအယွင်းမရှိ Deploy ပြုလုပ်နိုင်ရန် လိုအပ်ပါသည်။

ဤအခန်းတွင် **PHP-FPM**, **Java Spring Boot JAR Systemd Daemon**, **MySQL Production Hardening** နှင့် လုပ်ငန်းခွင်သုံး **Symlink Zero-Downtime Deployment Pattern** တို့ကို လေ့လာသွားပါမည်။

---

## 🐘 ၁။ PHP-FPM (FastCGI Process Manager) Deployment

PHP သည် Java ကဲ့သို့ ကိုယ်ပိုင် Web Server မပါဝင်သဖြင့် Nginx မှတစ်ဆင့် **PHP-FPM Socket** သို့ FastCGI protocol ဖြင့် လွှဲပြောင်းပေးရပါသည် -

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

* **Web Permissions စံနှုန်း**:
  Web directory ရှိ ဖိုင်အားလုံးကို Web Server process ဖြစ်သော `www-data` အား ပိုင်ဆိုင်ခွင့် ပေးရပါမည်:
  ```bash
  sudo chown -R www-data:www-data /var/www/myapp
  sudo find /var/www/myapp -type d -exec chmod 755 {} \;
  sudo find /var/www/myapp -type f -exec chmod 644 {} \;
  ```

---

## ☕ ၂။ Java Spring Boot JAR Deployment via systemd

Spring Boot JAR ဖိုင်တွင် Embedded Tomcat ပါဝင်ပြီးသားဖြစ်သဖြင့် Nginx ၏ နောက်ကွယ် Port 8080 တွင် Daemon အဖြစ် run ပေးရပါသည်:

```ini
[Unit]
Description=Production Spring Boot Application
After=network.target mysql.service

[Service]
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java -Xms512m -Xmx1024m -Dspring.profiles.active=prod -jar /opt/myapp/current/app.jar
Restart=always
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

---

## 🗄️ ၃။ MySQL Database Production Hardening

```bash
# ၁။ MySQL Server ထည့်သွင်းပါ
sudo apt install -y mysql-server

# ၂။ Root Password သတ်မှတ်ပြီး Default အမှိုက်များ ရှင်းလင်းပါ
sudo mysql_secure_installation

# ၃။ Application အတွက် Dedicated User & Database ဖန်တီးပါ (Root ကို မသုံးရပါ)
sudo mysql -u root -p
```

```sql
CREATE DATABASE production_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!2026';
GRANT ALL PRIVILEGES ON production_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🔄 ၄။ Symlink Zero-Downtime Deployment Pattern

Enterprise ကုမ္ပဏီကြီးများတွင် ကုဒ်အသစ်တင်တိုင်း ဝဘ်ဆိုဒ်ခဏရပ်သွားခြင်း (Downtime) ကို လုံးဝခွင့်မပြုပါ။ **Atomic Symlink Pattern** ဖြင့် Zero-Downtime Deployment ကို လုပ်ဆောင်ပါသည်:

```
/var/www/myapp/
├── releases/
│   ├── 20261010_01/   (Version 1 - ယခင်ဗားရှင်း)
│   └── 20261010_02/   (Version 2 - ဗားရှင်းအသစ်)
└── current ──────────► releases/20261010_02/ (Symlink ဖြင့် ညွှန်ပြထားသည်)
```

Nginx သို့မဟုတ် Systemd သည် `/var/www/myapp/current` ကိုသာ ညွှန်ပြထားသည်။

### Deployment အဆင့်ဆင့်:
1. Version အသစ်ကို `/var/www/myapp/releases/20261010_02` ထဲသို့ git pull / build ဆွဲသည်။
2. Dependencies သွင်းပြီး Database migrations အားလုံး ပြုလုပ်သည်။
3. အားလုံး အဆင်သင့်ဖြစ်မှ Symlink ကို ၁ မီလီစက္ကန့်အတွင်း ပြောင်းလဲညွှန်းလိုက်သည်:
   ```bash
   ln -sfn /var/www/myapp/releases/20261010_02 /var/www/myapp/current
   ```
4. Nginx reload လုပ်သည်။

### 🚨 Instant Rollback (၁ စက္ကန့်အတွင်း ဗားရှင်းအဟောင်းသို့ ပြန်ဆုတ်နည်း)
အကယ်၍ Version 2 တွင် အရေးပေါ် Bug တွေ့ပါက ချက်ချင်း Rollback လုပ်ရန်:
```bash
ln -sfn /var/www/myapp/releases/20261010_01 /var/www/myapp/current
sudo systemctl reload nginx
```
*အင်တာနက် အသုံးပြုသူများ သိပင်မသိလိုက်ဘဲ ယခင် ဗားရှင်း ၁ သို့ စက္ကန့်ပိုင်းအတွင်း ပြန်လည် ရောက်ရှိသွားပါမည်။*

---

## 🏋️ ၅။ Hands-on Practice

1. `/tmp/test_deploy/releases/v1` နှင့် `v2` ကို `mkdir -p` ဆောက်ပါ။
2. `v1/index.html` တွင် `"Version 1"`, `v2/index.html` တွင် `"Version 2"` ရေးပါ။
3. `ln -sfn /tmp/test_deploy/releases/v1 /tmp/test_deploy/current` ဖြင့် symlink ဆောက်ပါ။
4. `cat /tmp/test_deploy/current/index.html` စစ်ဆေးပါ။
5. Symlink ကို `v2` သို့ switch ပြုလုပ်ပြီး instant change ကို စမ်းသပ်ပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: Web Server Document Root (`/var/www/`) ရှိ ဖိုင်များအား Owner ကို မည်သည့် User အဖြစ် သတ်မှတ်ရမည်နည်း?
2. **မေးခွန်း ၂**: Symlink Deployment Pattern သည် အဘယ်ကြောင့် Zero-Downtime Deployment ဖြစ်စေသနည်း?
3. **မေးခွန်း ၃**: Release အသစ်တွင် Fatal Error တက်ပါက Symlink ဖြင့် မည်သို့ Instant Rollback ပြုလုပ်နိုင်သနည်း?
