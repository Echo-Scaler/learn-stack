---
title: "02. Manual Installation"
description: "Docker မသုံးဘဲ မိမိ၏ Local OS (macOS / Linux / Windows XAMPP / Valet) ပေါ်တွင် တိုက်ရိုက် တပ်ဆင်အသုံးပြုလိုသူများအတွက် ဤလမ်းညွှန်ကို ဖော်ပြပေးထားပါသည်။"
---

## Module 02 - အခန်း ၂: Composer & Manual Installation ဖြင့် တပ်ဆင်နည်း

Docker မသုံးဘဲ မိမိ၏ Local OS (macOS / Linux / Windows XAMPP / Valet) ပေါ်တွင် တိုက်ရိုက် တပ်ဆင်အသုံးပြုလိုသူများအတွက် ဤလမ်းညွှန်ကို ဖော်ပြပေးထားပါသည်။

---

## ၁။ စနစ်လိုအပ်ချက်များ စစ်ဆေးခြင်း (System Check)

ပထမဆုံး မိမိစက်တွင် PHP 8.0/8.1/8.2 နှင့် Composer ရှိမရှိ စစ်ဆေးပါ-

```bash
php -v
composer --version
```

လိုအပ်သော PHP Extension များကို စစ်ဆေးပါ-
```bash
php -m | grep -E "mbstring|intl|pdo_mysql|gd|curl|openssl|zip"
```

---

## ၂။ နည်းလမ်း (၁): Composer Create-Project ဖြင့် တပ်ဆင်ခြင်း (အကြံပြုသည့်နည်းလမ်း)

Terminal ကိုဖွင့်ပြီး မိမိ Project ထားလိုသော နေရာတွင် အောက်ပါ command ကို Run ပါ-

```bash
# EC-CUBE 4.2 ဗားရှင်းကို Composer ဖြင့် Download ရယူပါ
composer create-project ec-cube/ec-cube:4.2.x-dev my-ec-store

# Project Directory ထဲသို့ ဝင်ပါ
cd my-ec-store
```

---

## ၃။ Database တစ်ခု ဖန်တီးခြင်း (MySQL Database Setup)

MySQL Client သို့မဟုတ် phpMyAdmin သို့ ဝင်ရောက်ပြီး Database အသစ်တစ်ခု ဆောက်ပါ-

```sql
CREATE DATABASE eccube_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'eccube_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON eccube_db.* TO 'eccube_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ၄။ ပတ်ဝန်းကျင်ဆိုင်ရာ ပြင်ဆင်မှုဖိုင် (`.env`) ဖန်တီးခြင်း

Project Root Folder ထဲရှိ `.env.dist` ကို `.env` အဖြစ် ကူးယူပါ-

```bash
cp .env.dist .env
```

`.env` ဖိုင်ကို Text Editor ဖြင့်ဖွင့်ပြီး Database Connection နှင့် Admin URL ကို ပြင်ဆင်ပါ-

```dotenv
###> symfony/framework-bundle ###
APP_ENV=dev
APP_DEBUG=1
APP_SECRET=a_very_secret_random_string_32_chars_long
###< symfony/framework-bundle ###

###> doctrine/doctrine-bundle ###
# MySQL Connection String: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://eccube_user:secure_password@127.0.0.1:3306/eccube_db"
DATABASE_SERVER_VERSION="8.0"
###< doctrine/doctrine-bundle ###

###> eccube/eccube ###
ECCUBE_ADMIN_ROUTE=admin
ECCUBE_COOKIE_PATH=/
ECCUBE_LOCALE=ja
ECCUBE_TIMEZONE=Asia/Tokyo
###< eccube/eccube ###
```

---

## ၅။ Installation ပြုလုပ်ခြင်း (CLI Installer vs Web GUI)

### နည်းလမ်း A: CLI Installer (Command Line ဖြင့် အမြန်သွင်းခြင်း)

```bash
# Database Schema တည်ဆောက်ပြီး Initial Data သွင်းခြင်း
bin/console eccube:install --no-interaction
```

အကယ်၍ interactive mode ဖြင့် ကိုယ်တိုင် အချက်အလက်များ (Database User, Password, Admin Username, Password) ရွေးချယ်လိုပါက:
```bash
bin/console eccube:install
```

### နည်းလမ်း B: Web Browser GUI Installer ဖြင့် တပ်ဆင်ခြင်း

Server ကို စတင်ပြီး Web Browser ဖြင့် `http://localhost:8000/install.php` သို့ သွားရောက်ကာ အဆင့်ဆင့် နှိပ်၍ သွင်းနိုင်ပါသည်-

```bash
# PHP Built-in Server ဖြင့် စတင်ခြင်း
php -S 127.0.0.1:8000 -t html/
```

Browser တွင် အောက်ပါ Wizard ပေါ်လာမည်ဖြစ်သည်-
1. **Step 1: System Requirements Check (環境チェック)** - လိုအပ်သော Extension များနှင့် File Permissions များ မှန်ကန်မှု ရှိမရှိ စစ်ဆေးခြင်း။
2. **Step 2: Site & Admin Account Settings (サイトの設定)** - ဆိုင်အမည်၊ Admin ID နှင့် Password သတ်မှတ်ခြင်း။
3. **Step 3: Database Settings (データベースの設定)** - Database Engine (MySQL / PostgreSQL), Host, User, Password ထည့်သွင်းခြင်း။
4. **Step 4: Database Initial Setup (データベースの初期化)** - Table များ တည်ဆောက်ခြင်း။
5. **Step 5: Completion (完了)** - `install.php` ဖိုင်ကို လုံခြုံရေးအရ အလိုအလျောက် ဖျက်ပေးခြင်း သို့မဟုတ် ဖျက်ရန် သတိပေးခြင်း။

---

## ၆။ File & Folder Permissions သတ်မှတ်ခြင်း

Linux သို့မဟုတ် macOS တွင် EC-CUBE မှ ဖိုင်များ၊ Cache များနှင့် Upload ပြုလုပ်သော ပုံများကို ရေးသားနိုင်စေရန် အောက်ပါ Folder များကို Write Permission ပေးရပါမည်-

```bash
chmod -R 777 var/
chmod -R 777 app/
chmod -R 777 html/
```

---

## ၇။ Apache / Nginx Web Server Configuration

Production သို့မဟုတ် Local Virtual Host ပြုလုပ်လိုပါက DocumentRoot ကို သတိပြုရပါမည်။

> ⚠️ **အရေးကြီးသော အချက်**:  
> EC-CUBE 4.x တွင် `DocumentRoot` ကို **Project Root** သို့ ချိန်ရပါသည် (ဥပမာ: `/var/www/my-ec-store`)။  
> (မှတ်ချက်- Apache တွင် Root ရှိ `.htaccess` နှင့် `html/.htaccess` တို့မှတဆင့် Request များကို အလိုအလျောက် `html/index.php` သို့ Route လုပ်ပေးပါသည်)။

### Apache VirtualHost ဥပမာ:
```apache
<VirtualHost *:80>
    ServerName eccube.local
    DocumentRoot "/var/www/my-ec-store"

    <Directory "/var/www/my-ec-store">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/eccube_error.log
    CustomLog ${APACHE_LOG_DIR}/eccube_access.log combined
</VirtualHost>
```

---

နောက်အခန်းတွင် **[Module 02 - အခန်း ၃: Directory Structure နှင့် CLI Commands များ](/eccube/01_basics/02-environment-setup/03-directory-structure-and-cli/)** ကို ဆက်လက်လေ့လာပါမည်။
