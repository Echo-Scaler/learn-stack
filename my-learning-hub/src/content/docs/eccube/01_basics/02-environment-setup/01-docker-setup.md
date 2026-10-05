---
title: "01. Docker Setup"
description: "EC-CUBE 4.x ကို Local စက်တွင် အလွယ်ကူဆုံးနှင့် အမှားအယွင်း အကင်းဆုံး စမ်းသပ်လေ့လာနိုင်ရန်အတွက် Docker & Docker Compose ကို အသုံးပြုခြင်းသည် အကောင်းဆုံးနည်းလမ်းဖ"
---

## Module 02 - အခန်း ၁: Docker ဖြင့် Local Development Environment တည်ဆောက်ခြင်း

EC-CUBE 4.x ကို Local စက်တွင် အလွယ်ကူဆုံးနှင့် အမှားအယွင်း အကင်းဆုံး စမ်းသပ်လေ့လာနိုင်ရန်အတွက် **Docker & Docker Compose** ကို အသုံးပြုခြင်းသည် အကောင်းဆုံးနည်းလမ်းဖြစ်ပါသည်။

---

## ၁။ လိုအပ်ချက်များ (Prerequisites)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS, Windows သို့မဟုတ် Linux)
- [Git](https://git-scm.com/)

Docker တပ်ဆင်ထားပြီးဖြစ်ကြောင်း အတည်ပြုရန် Terminal တွင် အောက်ပါအတိုင်း စစ်ဆေးနိုင်ပါသည်-

```bash
docker --version
docker compose version
```

---

## ၂။ နည်းလမ်း (၁): EC-CUBE Official Docker Image ကို အသုံးပြုခြင်း (အမြန်ဆုံးနည်း)

EC-CUBE အဖွဲ့မှ တရားဝင် ထုတ်ဝေထားသော Docker Image ကို အသုံးပြု၍ ချက်ချင်း စတင်နိုင်ပါသည်-

```bash
# 1. Project Directory ဖန်တီးပါ
mkdir my-eccube-app && cd my-eccube-app

# 2. docker-compose.yml ဖိုင်ကို ဖန်တီးပါ
```

အောက်ပါ `docker-compose.yml` ဖိုင်ကို ရေးသားပါ-

```yaml
version: '3.8'

services:
  eccube:
    image: eccube/eccube:4.2-apache
    container_name: eccube_app
    ports:
      - "8080:80"
    environment:
      # Database ချိတ်ဆက်မှု URL
      DATABASE_URL: "mysql://eccube_db_user:eccube_db_pass@mysql:3306/eccube_db"
      DATABASE_SERVER_VERSION: "8.0"
      # Developer Mode (Debug Bar ပေါ်စေရန်)
      APP_ENV: "dev"
      APP_DEBUG: "1"
      # Mail Server ချိတ်ဆက်မှု (MailHog)
      MAILER_URL: "smtp://mailhog:1025"
      # Admin URL Prefix (ဥပမာ: http://localhost:8080/admin/)
      ECCUBE_ADMIN_ROUTE: "admin"
    volumes:
      - ./app:/var/www/html/app
      - ./html:/var/www/html/html
      - ./var:/var/www/html/var
    depends_on:
      - mysql
      - mailhog

  mysql:
    image: mysql:8.0
    container_name: eccube_mysql
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: eccube_db
      MYSQL_USER: eccube_db_user
      MYSQL_PASSWORD: eccube_db_pass
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "33060:3306"

  mailhog:
    image: mailhog/mailhog
    container_name: eccube_mailhog
    ports:
      - "8025:8025" # MailHog Web UI
      - "1025:1025" # SMTP port

volumes:
  mysql_data:
```

---

## ၃။ Container များ စတင် Run ခြင်း

Terminal မှ အောက်ပါ command ကို Run ပါ-

```bash
# Container များကို Background တွင် Run ပါ
docker compose up -d
```

### Initial Setup (ပထမဆုံးအကြိမ် Database တည်ဆောက်ခြင်း):

Container စတင်ပြီးနောက် EC-CUBE Database Schema နှင့် Dummy Data များကို Install ပြုလုပ်ရန် container ထဲသို့ command ပို့ပါ-

```bash
# Initial Setup Command ကို Run ပါ
docker compose exec eccube bin/console eccube:install --no-interaction
```

> 💡 **မှတ်ချက်**: Install command ပြီးသွားပါက အောက်ပါ URL များသို့ Browser ဖြင့် ဝင်ရောက်ကြည့်ရှုနိုင်ပါပြီ-
> - **Storefront (ဆိုင်မျက်နှာစာ)**: `http://localhost:8080/`
> - **Admin Dashboard (စီမံခန့်ခွဲမှုစာမျက်နှာ)**: `http://localhost:8080/admin/`
> - **MailHog (စမ်းသပ် Email ကြည့်ရှုရန်)**: `http://localhost:8025/`

### Default Admin Login Credentials:
- **Admin ID**: `admin`
- **Password**: `password`

---

## ၄။ နည်းလမ်း (၂): GitHub Source Code မှ Docker ဖြင့် တည်ဆောက်ခြင်း (အပြည့်အစုံ Customization ပြုလုပ်ရန်)

Source code တစ်ခုလုံးကို ကိုယ်တိုင် ပြင်ဆင်ပြီး စမ်းသပ်လိုပါက GitHub Repository မှ Clone ပြုလုပ်နိုင်ပါသည်-

```bash
# 1. EC-CUBE 4.2 Repository ကို Clone ပါ
git clone https://github.com/EC-CUBE/ec-cube.git my-eccube-src
cd my-eccube-src
git checkout 4.2

# 2. Composer Dependencies သွင်းပါ (Host တွင် composer ရှိပါက)
composer install

# 3. .env ဖိုင်ကို ပြင်ဆင်ပါ
cp .env.dist .env

# 4. Docker Compose စတင်ပါ
docker compose up -d
```

---

## ၅။ အသုံးဝင်သော Docker Commands များ

Development ပြုလုပ်နေစဉ် နေ့စဉ်သုံးရမည့် အရေးကြီး Command များ-

```bash
# 1. EC-CUBE Cache ရှင်းထုတ်ခြင်း (အပြောင်းအလဲများ မပေါ်ပါက မဖြစ်မနေ Run ရန်)
docker compose exec eccube bin/console cache:clear --no-warmup

# 2. Container ထဲသို့ Bash Shell ဖြင့် ဝင်ရောက်ခြင်း
docker compose exec eccube bash

# 3. Database Schema Update လုပ်ခြင်း
docker compose exec eccube bin/console doctrine:schema:update --force

# 4. Container Log များကို ကြည့်ရှုခြင်း
docker compose logs -f eccube

# 5. Container များကို ရပ်တန့်ခြင်း
docker compose down
```

---

## ၆။ တွေ့ကြုံရတတ်သော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting)

### ပြဿနာ (၁): Permission Denied Error (`var/cache` or `var/log`)
Linux/macOS တွင် file permission error ဖြစ်ပေါ်ပါက Container ထဲတွင် permission ပေးပါ-
```bash
docker compose exec eccube chmod -R 777 var/
```

### ပြဿနာ (၂): Database Connection Refused
MySQL container သည် အပြည့်အဝ boot မဖြစ်သေးမီ EC-CUBE က ချိတ်ဆက်ရန် ကြိုးစားပါက connection error ဖြစ်တတ်ပါသည်။ 
`docker compose ps` ဖြင့် mysql healthy ဖြစ်မဖြစ် စစ်ဆေးပြီး မိနစ်အနည်းငယ်စောင့်၍ ပြန်စမ်းပါ။

---

နောက်အခန်းတွင် **[Module 02 - အခန်း ၂: Manual Installation ဖြင့် တပ်ဆင်နည်း](/eccube/01_basics/02-environment-setup/02-manual-installation/)** ကို ဆက်လက်လေ့လာပါမည်။
