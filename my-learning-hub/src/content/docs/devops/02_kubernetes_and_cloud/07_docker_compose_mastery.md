---
title: "07. Docker Compose Mastery"
description: "1. [Docker Compose ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-docker-compose-ဆိုတာဘာလဲ)"
---

## 🐳 သင်ခန်းစာ (၇) - Docker Compose Mastery (Multi-Container Fullstack Stack)
### (Lesson 7: Multi-Container Orchestration, Compose Spec, Healthchecks & Fullstack Stack)

---

## 📌 မာတိကာ (Contents)
1. [Docker Compose ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-docker-compose-ဆိုတာဘာလဲ)
2. [`docker-compose.yml` ၏ အဓိက အစိတ်အပိုင်းများ (Structure Explained)](#၂-docker-composeyml-၏-အဓိက-အစိတ်အပိုင်းများ)
3. [မဖြစ်မနေ သိထားရမည့် Docker Compose CLI Commands များ](#၃-မဖြစ်မနေ-သိထားရမည့်-docker-compose-cli-commands)
4. [လက်တွေ့ Fullstack Project: Nginx + PHP 8.3 FPM + MySQL 8.0 + Redis](#၄-လက်တွေ့-fullstack-project)
   - [၄.၁။ `docker-compose.yml` အပြည့်အစုံ ရေးဆွဲခြင်း](#၄၁-docker-composeyml-အပြည့်အစုံ)
   - [၄.၂။ Nginx Site Configuration (`nginx/default.conf`)](#၄၂-nginx-site-configuration)
   - [၄.၃။ `.env` ဖိုင်ဖြင့် Environment Variables များ ထိန်းချုပ်ခြင်း](#၄၃-env-ဖိုင်ဖြင့်-environment-variables-များ)
5. [Healthchecks နှင့် `depends_on` ချိန်ညှိနည်း (Database တက်မှ App စတင်စေခြင်း)](#၅-healthchecks-နှင့်-depends_on)
6. [Container အချင်းချင်း Service Discovery ပြုလုပ်ပုံ](#၆-container-အချင်းချင်း-service-discovery)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Docker Compose ဆိုတာဘာလဲ?

တကယ့် လက်တွေ့ လုပ်ငန်းခွင်တွင် Web Application တစ်ခု Run ရန်အတွက် Nginx, PHP, MySQL, Redis စသည့် Container ၄ ခု/ ၅ ခုကို `docker run` command များ တစ်ကြောင်းပြီးတစ်ကြောင်း Terminal တွင် လက်ဖြင့် ရိုက်ထည့်နေရမည်ဆိုပါက Ports များ မှားယွင်းခြင်း၊ Network မတူခြင်း၊ Volume ချိတ်ဆက်ရန် မေ့လျော့ခြင်း စသည့် လူ့အမှား (Human Errors) များစွာ ဖြစ်ပေါ်စေပါသည်။

**Docker Compose** သည် Multi-Container Docker Application များကို YAML ဖိုင်တစ်ခုတည်း (`docker-compose.yml`) ဖြင့် တစ်စုတစ်စည်းတည်း သတ်မှတ်ပြီး Command တစ်ချက်တည်းဖြင့် အားလုံးကို တစ်ပြိုင်နက် Run စေနိုင်သော Tool ဖြစ်ပါသည်။

```
                    ┌─────────────────────────┐
                    │   docker-compose.yml    │
                    └────────────┬────────────┘
                                 │ docker compose up -d
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Nginx Service  │◄───►│ PHP-FPM Service │◄───►│  MySQL Database │
│   (Port 80/443) │     │   (FastCGI 9000)│     │   (Port 3306)   │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Redis Service  │
                        │   (Port 6379)   │
                        └─────────────────┘
```

---

## ၂။ `docker-compose.yml` ၏ အဓိက အစိတ်အပိုင်းများ

* **`services`**: Run မည့် Container တစ်ခုချင်းစီကို သတ်မှတ်သည့်နေရာ (ဥပမာ- `app`, `web`, `db`, `redis`)။
* **`build`**: Dockerfile မှတစ်ဆင့် Custom Image အသစ် တည်ဆောက်ရန် ညွှန်ပြခြင်း။
* **`image`**: Docker Hub မှ အသင့်သုံး Image ကို ဆွဲယူသုံးစွဲရန် (ဥပမာ- `mysql:8.0`)။
* **`ports`**: Host Port နှင့် Container Port ချိတ်ဆက်ခြင်း (`"8080:80"`)။
* **`volumes`**: Host စက်ရှိ ဖိုင်များနှင့် Named Volumes များကို mount ချိတ်ဆက်ခြင်း။
* **`environment` / `env_file`**: Database Passwords နှင့် App Settings များကို ထည့်သွင်းခြင်း။
* **`depends_on`**: Container များ စတင်သည့် အစီအစဉ်ကို သတ်မှတ်ခြင်း (ဥပမာ- DB မတက်မချင်း App ကို မ run ရန်)။
* **`networks`**: Services အားလုံး အတူတကွ စကားပြောနိုင်မည့် Shared Network သတ်မှတ်ခြင်း။

---

## ၃။ မဖြစ်မနေ သိထားရမည့် Docker Compose CLI Commands

> **မှတ်ချက်**: Docker Compose v2 မှစ၍ `docker-compose` (တုံးတိုဖြင့်) မဟုတ်ဘဲ `docker compose` (space ခြား၍) ရေးသားရပါသည်။

```bash
# Services အားလုံးကို Background တွင် စတင် run ခြင်း
docker compose up -d

# Dockerfile အပြောင်းအလဲရှိပါက Image ကို Rebuild လုပ်ပြီး ပြန် run ခြင်း
docker compose up -d --build

# Run နေသော Services များ၏ Status ကို ကြည့်ခြင်း
docker compose ps

# Container အားလုံး၏ Logs များကို Live စောင့်ကြည့်ခြင်း
docker compose logs -f

# သီးသန့် Service တစ်ခုတည်း၏ Log ကို ကြည့်ခြင်း
docker compose logs -f app

# Service တစ်ခု၏ အတွင်းသို့ Shell ဝင်ရောက်ခြင်း
docker compose exec app sh

# Services အားလုံးကို ရပ်တန့်ပြီး Containers များကို ဖျက်ပစ်ခြင်း
docker compose down

# Containers များအပြင် ဖန်တီးထားသော Volumes များပါ အကုန်ဖျက်ပစ်ခြင်း
docker compose down -v
```

---

## ၄။ လက်တွေ့ Fullstack Project: Nginx + PHP-FPM + MySQL + Redis

### ၄.၁။ `docker-compose.yml` အပြည့်အစုံ

```yaml
services:
  # ၁။ Nginx Web Server (Reverse Proxy)
  nginx:
    image: nginx:1.25-alpine
    container_name: enterprise_nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./:/var/www/html:ro
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
    networks:
      - app_network

  # ၂။ PHP 8.3 FPM Application Logic
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: enterprise_app
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - ./:/var/www/html
    env_file:
      - .env
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app_network

  # ၃။ MySQL Database
  mysql:
    image: mysql:8.0
    container_name: enterprise_mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${DB_DATABASE:-my_app}
      MYSQL_USER: ${DB_USERNAME:-db_user}
      MYSQL_PASSWORD: ${DB_PASSWORD:-secret123}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootsecret}
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_ROOT_PASSWORD:-rootsecret}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  # ၄။ Redis In-Memory Cache & Session
  redis:
    image: redis:7-alpine
    container_name: enterprise_redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app_network

# Persistent Volumes
volumes:
  db_data:
    driver: local
  redis_data:
    driver: local

# Shared Isolated Network
networks:
  app_network:
    driver: bridge
```

---

### ၄.၂။ Nginx Site Configuration (`docker/nginx/default.conf`)

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass app:9000; # Docker DNS က "app" နာမည်ဖြင့် PHP Container သို့ ပို့ပေးသည်
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

### ၄.၃။ `.env` ဖိုင်ဖြင့် Environment Variables များ ချိတ်ဆက်ခြင်း

Application ၏ `.env` ဖိုင်ထဲတွင် Database Host နှင့် Redis Host ကို Container Services နာမည်များ အတိုင်း အလွယ်တကူ သတ်မှတ်နိုင်ပါသည်:

```ini
APP_NAME="Dockerized App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql         # docker-compose ထဲရှိ mysql service အမည်
DB_PORT=3306
DB_DATABASE=my_app
DB_USERNAME=db_user
DB_PASSWORD=secret123

REDIS_HOST=redis      # docker-compose ထဲရှိ redis service အမည်
REDIS_PORT=6379
```

---

## ၅။ Healthchecks နှင့် `depends_on` ချိန်ညှိနည်း

အလွန်အရေးကြီးသော Production အချက်တစ်ခုမှာ - MySQL Container သည် စတင် run ပြီးချင်း အဆင်သင့် မဖြစ်သေးပါ (Database Initialization ပြုလုပ်ရန် စက္ကန့် ၂၀ ခန့် ကြာတတ်သည်)။

အကယ်၍ PHP App သည် ချက်ချင်း တက်လာပြီး Database သို့ ချိတ်ဆက်ပါက `Connection Refused` ဖြစ်ပြီး Crash ဖြစ်သွားမည်။

ထို့ကြောင့် `docker-compose.yml` တွင်:
1. MySQL ထဲ၌ `healthcheck` ထည့်သွင်းခြင်း (`mysqladmin ping`)။
2. PHP App ထံတွင်:
   ```yaml
   depends_on:
     mysql:
       condition: service_healthy
   ```
ဤသို့ ရေးသားလိုက်ပါက MySQL သည် အမှန်တကယ် Query လက်ခံရန် အသင့်ဖြစ်ပြီ (Healthy ဖြစ်ပြီ) ဟု အတည်ပြုပြီးမှသာ PHP App Container ကို စတင် run ပေးမည် ဖြစ်ပါသည်။

---

## ၆။ Container အချင်းချင်း Service Discovery ပြုလုပ်ပုံ

Docker Compose သည် Services အားလုံးအတွက် Default အနေဖြင့် Private Custom Bridge Network တစ်ခုကို အလိုအလျောက် တည်ဆောက်ပေးပြီးဖြစ်သည်။

ထို့ကြောင့်:
* Nginx သည် `app:9000` ဟု ခေါ်ဆိုနိုင်သည်
* PHP သည် `mysql:3306` ဟု ခေါ်ဆိုနိုင်သည်
* PHP သည် `redis:6379` ဟု ခေါ်ဆိုနိုင်သည်
IP Address များကို လုံးဝ စိုးရိမ်စရာမလိုဘဲ အားလုံး အလိုအလျောက် ချိတ်ဆက်မိနေမည် ဖြစ်ပါသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ငန်းစဉ် (Task) | စစ်ဆေးရမည့် အချက် | အတည်ပြုပြီး |
| :--- | :--- | :---: |
| **Multi-Container Stack** | Nginx, PHP, MySQL, Redis အားလုံးကို Compose ဖိုင်တစ်ခုတည်းဖြင့် စီမံထားသလား? | [ ] |
| **Data Persistence** | MySQL နှင့် Redis အတွက် Named Volumes များ ထည့်သွင်းထားသလား? | [ ] |
| **Startup Order** | Database Crash မဖြစ်စေရန် `healthcheck` နှင့် `condition: service_healthy` သုံးထားသလား? | [ ] |
| **One-Command Setup** | Developer အသစ်သည် `docker compose up -d` တစ်ချက်တည်းဖြင့် App စတင်နိုင်သလား? | [ ] |

နောက်သင်ခန်းစာ [08_docker_security_and_hardening.md](/devops/02_kubernetes_and_cloud/08_docker_security_and_hardening/) တွင် Docker Container များကို Production ပေါ်တွင် လုံခြုံစိတ်ချစွာ Run နိုင်ရန် Container Hardening & Security နည်းလမ်းများကို လေ့လာပါမည်။
