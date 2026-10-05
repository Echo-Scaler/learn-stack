---
title: "06. Docker Compose And Multi Container"
description: "သင်သည် Laravel Application အပြည့်အစုံတစ်ခု Run လိုပါက အောက်ပါအတိုင်း Command ပေါင်းများစွာကို တစ်ခုပြီးတစ်ခု အရှည်ကြီး ရိုက်ထည့်ရပါမည်-"
---

## 🐙 အခန်း (၆) - Docker Compose & Multi-Container Applications

---

## ၁၅။ Docker Compose ဆိုတာ ဘာလဲ? (Why Docker Compose?)

### 😫 Single Docker CLI ဖြင့် အလုပ်လုပ်ရသော ဒုက္ခ
သင်သည် Laravel Application အပြည့်အစုံတစ်ခု Run လိုပါက အောက်ပါအတိုင်း Command ပေါင်းများစွာကို တစ်ခုပြီးတစ်ခု အရှည်ကြီး ရိုက်ထည့်ရပါမည်-
```bash
docker network create laravel-net
docker volume create mysql-data

# MySQL Run ရန်
docker run -d --name db --network laravel-net -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret mysql:8.0

# Redis Run ရန်
docker run -d --name redis --network laravel-net redis:alpine

# PHP-FPM Run ရန်
docker run -d --name app --network laravel-net -v $(pwd):/var/www/html php:8.3-fpm

# Nginx Web Server Run ရန်
docker run -d --name web --network laravel-net -p 80:80 -v $(pwd):/var/www/html nginx:alpine
```
ဤသို့ Command များကို အလွတ်မှတ်ပြီး နေ့တိုင်း ရိုက်နေရခြင်းသည် အမှားများစေပြီး အလွန် လက်ဝင်စေပါသည်။

### 💡 Docker Compose ၏ အခန်းကဏ္ဍ
**Docker Compose** သည် Multi-Container Applications များကို **YAML Configuration File (`docker-compose.yml`)** တစ်ခုတည်းတွင် စနစ်တကျ ကြေညာပြီး-
```bash
docker compose up -d
```
ဟူသော Command တစ်ကြောင်းတည်းဖြင့် Container အားလုံး၊ Network များနှင့် Volume များကို **တစ်ပြိုင်နက်တည်း (All in One)** အဆင်သင့် ဖြစ်အောင် ဆောက်လုပ် Run ပေးသည့် Tool ဖြစ်သည်။

---

## ၁၆။ Multi-Container Architecture & `docker-compose.yml` ဖွဲ့စည်းပုံ

အောက်တွင် ခေတ်မီ Web Architecture အရ Container ၄ ခုဖြင့် တည်ဆောက်ထားသော စနစ်ကို လေ့လာကြည့်ပါ-

```mermaid
graph LR
    User["🌐 Web Browser (Client)"] -->|Port 80| NGINX["Nginx Web Server Container<br/>(Reverse Proxy & Static Files)"]
    NGINX -->|FastCGI (Port 9000)| PHP["Laravel PHP-FPM Container<br/>(Application Logic)"]
    PHP -->|Port 3306| MYSQL["MySQL Database Container<br/>(Data Persistence)"]
    PHP -->|Port 6379| REDIS["Redis Container<br/>(Cache & Session)"]
```

---

### 📝 `docker-compose.yml` ဖိုင်တည်ဆောက်ပုံ အပြည့်အစုံ

```yaml
# Docker Compose Version (ယခု Compose v2 တွင် version မထည့်လည်း ရပါသည်)
services:

  # -------------------------------------------------------------
  # ၁။ Nginx Web Server Service
  # -------------------------------------------------------------
  nginx:
    image: nginx:alpine
    container_name: laravel-nginx
    restart: unless-stopped
    ports:
      - "80:80"        # Host Port 80 သို့ ဖွင့်လှစ်ပေးထားသည်
    volumes:
      - ./:/var/www/html                     # Laravel Source Code Bind Mount
      - ./docker/nginx:/etc/nginx/conf.d     # Nginx Configuration Bind Mount
    depends_on:
      - php                                  # PHP မတက်မချင်း Nginx ကို မ run ပါ
    networks:
      - laravel-network

  # -------------------------------------------------------------
  # ၂။ Laravel PHP 8.3 FPM Application Service
  # -------------------------------------------------------------
  php:
    build:
      context: .
      dockerfile: Dockerfile                 # Local Dockerfile မှ Custom Build မည်
    container_name: laravel-app
    restart: unless-stopped
    volumes:
      - ./:/var/www/html                     # Source Code Live Sync
    environment:
      - DB_HOST=mysql                        # Service Name 'mysql' ကို တိုက်ရိုက် သုံးနိုင်သည်
      - REDIS_HOST=redis                     # Service Name 'redis' ကို တိုက်ရိုက် သုံးနိုင်သည်
    depends_on:
      mysql:
        condition: service_healthy           # MySQL Healthcheck အောင်မြင်မှသာ PHP စတင်မည်
      redis:
        condition: service_started
    networks:
      - laravel-network

  # -------------------------------------------------------------
  # ၃။ MySQL Database Service
  # -------------------------------------------------------------
  mysql:
    image: mysql:8.0
    container_name: laravel-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_secret
      MYSQL_DATABASE: laravel_db
      MYSQL_USER: laravel_user
      MYSQL_PASSWORD: user_secret
    ports:
      - "127.0.0.1:3306:3306"                # Local စက်မှ TablePlus / DBeaver ဖြင့် ဝင်ကြည့်ရန်
    volumes:
      - mysql-data:/var/lib/mysql            # Persistent Data Volume
    healthcheck:                             # Database အမှန်တကယ် အဆင်သင့်ဖြစ်မဖြစ် စစ်ဆေးခြင်း
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_secret"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - laravel-network

  # -------------------------------------------------------------
  # ၄။ Redis In-Memory Cache Service
  # -------------------------------------------------------------
  redis:
    image: redis:alpine
    container_name: laravel-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - laravel-network

# ---------------------------------------------------------------
# Persistent Volumes ကြေညာခြင်း
# ---------------------------------------------------------------
volumes:
  mysql-data:
    driver: local
  redis-data:
    driver: local

# ---------------------------------------------------------------
# Custom Bridge Network ကြေညာခြင်း
# ---------------------------------------------------------------
networks:
  laravel-network:
    driver: bridge
```

---

### 🔑 အရေးကြီးသော Compose သဘောတရားများ နှင့် Service တစ်ခုချင်းစီ၏ အတွင်းသဘော (Deep Dive)

အထက်ပါ `docker-compose.yml` တွင် ရေးသားထားသော အစိတ်အပိုင်းများသည် မည်သို့အလုပ်လုပ်ပြီး အခြားမည်သည့် Project အတွက်မဆို မည်သို့ စဉ်းစားရေးသားရမည်ကို အောက်ပါအတိုင်း အသေးစိတ် လေ့လာနိုင်ပါသည်-

---

#### ၁။ Nginx Web Server Service ကို အသေးစိတ် နားလည်ခြင်း

```yaml
  nginx:
    image: nginx:alpine
    container_name: laravel-nginx
    restart: unless-stopped
    ports:
      - "80:80"        # Host Port 80 သို့ ဖွင့်လှစ်ပေးထားသည်
    volumes:
      - ./:/var/www/html                     # Laravel Source Code Bind Mount
      - ./docker/nginx:/etc/nginx/conf.d     # Nginx Configuration Bind Mount
    depends_on:
      - php                                  # PHP မတက်မချင်း Nginx ကို မ run ပါ
    networks:
      - laravel-network
```

##### 💡 ဘာကြောင့် Nginx ကို သီးခြား Container အဖြစ် လိုအပ်သနည်း (Requirement)?
- Node.js သို့မဟုတ် Python (FastAPI/Flask) ကဲ့သို့သော ဘာသာစကားများတွင် ကိုယ်ပိုင် Web Server (Express, Uvicorn) ပါဝင်သော်လည်း **PHP-FPM သည် Web Server မဟုတ်ပါ (FastCGI Processor သာ ဖြစ်သည်)**။
- PHP-FPM သည် Browser ထံမှ ဝင်လာသော HTTP Request များကို တိုက်ရိုက် နားမလည်နိုင်သလို CSS, JS, Images ကဲ့သို့သော Static ဖိုင်များကိုလည်း တိုက်ရိုက် မပြသနိုင်ပါ။
- ထို့ကြောင့် **Nginx သည် ရှေ့တန်းတံခါး (Reverse Proxy & Front Door)** အဖြစ် ရပ်တည်ပေးပြီး Static files များကို အလွန်မြန်ဆန်စွာ ဖြေကြားပေးကာ `.php` dynamic request များကိုသာ FastCGI protocol ဖြင့် PHP-FPM (Port 9000) သို့ လွှဲပြောင်းပေးခြင်း ဖြစ်သည်။

##### 📂 Nginx ရှိ `volumes` များကို ဘာကြောင့် သုံးရသနည်း?
1. **`./:/var/www/html` (Source Code Mount):**
   - အဘယ်ကြောင့် Nginx ဘက်တွင်ပါ Source code ကို mount လုပ်ရသနည်း?
   - အကြောင်းမှာ Nginx သည် CSS, JavaScript, Images နှင့် `public/index.php` တည်ရှိရာ လမ်းကြောင်းကို Disk ပေါ်တွင် အမှန်တကယ် စစ်ဆေးရသောကြောင့် ဖြစ်သည်။ အကယ်၍ ဤ Volume ကို Nginx ထဲ မထည့်ပါက Nginx သည် ဖိုင်မတွေ့ဘဲ `404 Not Found` error ပြန်ပေးပါလိမ့်မည်။
2. **`./docker/nginx:/etc/nginx/conf.d` (Config Mount):**
   - Nginx Official Image တွင် ပါလာသော default configuration သည် သာမန် "Welcome to nginx" စာမျက်နှာကိုသာ ပြသပေးသည်။
   - ကျွန်ုပ်တို့ local ရှိ `default.conf` ဖိုင်ကို Container ထဲရှိ `/etc/nginx/conf.d/` ထဲသို့ လှမ်းတပ် (Mount) ပေးလိုက်ခြင်းဖြင့် Nginx အား "ဝင်လာသမျှ PHP request များကို `php:9000` သို့ ပို့ပေးပါ" ဟု ညွှန်ကြားနိုင်ခြင်း ဖြစ်သည်။

---

#### ၂။ PHP Application Service ကို အသေးစိတ် နားလည်ခြင်း

```yaml
  php:
    build:
      context: .
      dockerfile: Dockerfile                 # Local Dockerfile မှ Custom Build မည်
    container_name: laravel-app
    restart: unless-stopped
    volumes:
      - ./:/var/www/html                     # Source Code Live Sync
    environment:
      - DB_HOST=mysql                        # Service Name 'mysql' ကို တိုက်ရိုက် သုံးနိုင်သည်
      - REDIS_HOST=redis                     # Service Name 'redis' ကို တိုက်ရိုက် သုံးနိုင်သည်
    depends_on:
      mysql:
        condition: service_healthy           # MySQL Healthcheck အောင်မြင်မှသာ PHP စတင်မည်
      redis:
        condition: service_started
    networks:
      - laravel-network
```

##### 💡 ဘာကြောင့် `image:` မသုံးဘဲ `build:` ကို သုံးရသနည်း?
- MySQL သို့မဟုတ် Redis တို့သည် Docker Hub မှ တရားဝင် image ကို တိုက်ရိုက် ဒေါင်းလုဒ်ဆွဲရုံဖြင့် သုံးနိုင်သော်လည်း Laravel အတွက်မူ ကျွန်ုပ်တို့ အခန်း (၃) တွင် ရေးသားခဲ့သော **PHP Extensions (pdo_mysql, gd, zip, opcache) ပါဝင်သည့် Custom Dockerfile** ကို တည်ဆောက် (Build) ရန် လိုအပ်သောကြောင့် `build:` ကို သုံးရခြင်း ဖြစ်သည်။
  - `context: .` ဆိုသည်မှာ လက်ရှိ directory တစ်ခုလုံးကို build environment အဖြစ် သတ်မှတ်ခြင်း ဖြစ်သည်။
  - `dockerfile: Dockerfile` ဆိုသည်မှာ မည်သည့် Dockerfile ကို ဖတ်ရမည်ကို ညွှန်ပြခြင်း ဖြစ်သည်။

##### 🔄 `volumes: ./:/var/www/html` ဆိုတာ ဘာလဲ? (Live Sync vs Production)
- **Local Development အတွက် အသက်သွေးကြော:** မိမိ Host ကွန်ပျူတာပေါ်ရှိ ဖိုဒါနှင့် Container အတွင်းရှိ `/var/www/html` ကို တိုက်ရိုက် ချိတ်ဆက် (Bind Mount) ထားခြင်း ဖြစ်သည်။
- သင်သည် VS Code ထဲတွင် Controller သို့မဟုတ် Blade ဖိုင်ကို Code တစ်ကြောင်း ပြင်ပြီး `Save` လိုက်သည်နှင့် Container ထဲတွင် ချက်ချင်း ပြောင်းလဲသွားပြီး Browser တွင် Refresh လုပ်ရုံဖြင့် တွေ့မြင်နိုင်သည်။ Docker Image ကို အသစ်ထပ်မံ Build စရာ လုံးဝမလိုတော့ပါ။
*(သတိပြုရန်: Production Deploy လုပ်ချိန်တွင်မူ အခန်း ၃ ကဲ့သို့ Dockerfile ထဲတွင် `COPY` လုပ်ပြီး volume mount မသုံးရပါ)*

##### 🌐 `environment:` နှင့် Docker DNS (Service Discovery)
- Docker Compose တွင် Container အချင်းချင်း ချိတ်ဆက်ရာတွင် IP address များကို ရိုက်ထည့်စရာ မလိုပါ။
- Compose သည် User-defined bridge network ပေါ်တွင် **Built-in DNS Server** ကို အလိုအလျောက် ပေးထားသဖြင့် Service နာမည်များ (`mysql`, `redis`) သည် Domain Name အဖြစ် အလိုအလျောက် အလုပ်လုပ်သည်။
- ထို့ကြောင့် `DB_HOST=192.168.1.5` သို့မဟုတ် `localhost` ဟု မရေးရဘဲ `DB_HOST=mysql` ဟု ရေးသားနိုင်ခြင်း ဖြစ်သည်။

##### ⏱️ `depends_on` နှင့် `condition: service_healthy` (အလွန်အရေးကြီးသော အချက်)
- **သာမန် `depends_on: - mysql` ၏ အားနည်းချက်:** Docker သည် MySQL container process စတင် boot တက်သည်နှင့် PHP container ကို run လိုက်သည်။ သို့သော် MySQL သည် Server စတင်ချိန်တွင် Database Initialization လုပ်ရန် စက္ကန့် ၂၀ ခန့် ကြာတတ်သည်။ ထိုအချိန်တွင် PHP စတင် run ပါက `Database Connection Refused` error ချက်ချင်း တက်ပါလိမ့်မည်။
- **`condition: service_healthy` အဖြေ:** MySQL ထဲတွင် `mysqladmin ping` ဖြင့် စစ်ဆေးထားသော `healthcheck` အောင်မြင်ပြီး အမှန်တကယ် Query လက်ခံနိုင်သည့် အဆင့်ရောက်မှသာ PHP service စတင် အလုပ်လုပ်စေရန် ထိန်းချုပ်ပေးခြင်း ဖြစ်သည်။

---

#### ၃။ Docker Compose ဖိုင် ရေးဆွဲရာတွင် လိုက်နာရမည့် စံစည်းမျဉ်း (Is this a format or rule?)

Docker Compose သည် **ပုံသေ တင်းကျပ်ထားသော Rule မဟုတ်ဘဲ YAML Syntax စံနှုန်း (Standard Specification)** ကို အသုံးပြုထားခြင်း ဖြစ်သည်။

မည်သည့် Application သို့မဟုတ် Feature မဆို Compose ထဲတွင် ထည့်သွင်းလိုပါက အောက်ပါ **အခြေခံ မဏ္ဍိုင် (၅) ရပ်** ဖြင့် ဖွဲ့စည်း စဉ်းစားပါ-

```yaml
services:
  <service_name>:                 # ၁။ မိမိ စိတ်ကြိုက် ပေးနိုင်သော Service နာမည် (DNS Name ဖြစ်သွားမည်)
    image: <image_name>           # ၂။ အသုံးပြုမည့် Docker Image (သို့မဟုတ် build: .)
    ports:
      - "<host_port>:<container_port>" # ၃။ အပြင်ကွန်ပျူတာမှ လှမ်းခေါ်မည့် Port Mapping
    volumes:
      - <source>:<target>         # ၄။ File ချိတ်ဆက်မှု (Code live sync သို့မဟုတ် Data သိမ်းဆည်းရန်)
    environment:
      - KEY=VALUE                 # ၅။ Database password, credentials, configuration များ
    networks:
      - <network_name>            # ၆။ တခြား service များနှင့် ဆက်သွယ်ရန် သီးသန့် network
```

##### 🧭 အခြား Tech Stack များအတွက် စဉ်းစားပုံ ဥပမာ-
* **Node.js (Next.js/React + Express + MongoDB) ဖြစ်ပါက:**
  * Service ၁: `frontend` (Image/Build, Port: `3000:3000`, depends_on: `backend`)
  * Service ၂: `backend` (Build, Port: `5000:5000`, depends_on: `mongo`, env: `MONGO_URL=mongodb://mongo:27017`)
  * Service ၃: `mongo` (Image: `mongo:latest`, volumes: `mongo-data:/data/db`)
* **Python (FastAPI + PostgreSQL) ဖြစ်ပါက:**
  * Service ၁: `web` (Build, Port: `8000:8000`, env: `DATABASE_URL=postgres://db:5432`)
  * Service ၂: `db` (Image: `postgres:16`, volumes: `pgdata:/var/lib/postgresql/data`)

---

#### ၄။ Multi-Container Lifecycle စီမံခန့်ခွဲပုံ:

```bash
   # Containers အားလုံးကို Background တွင် စတင် run ခြင်း
   docker compose up -d

   # Status စစ်ဆေးခြင်း
   docker compose ps

   # Log များကို Live ကြည့်ရှုခြင်း
   docker compose logs -f

   # Stack တစ်ခုလုံးကို ပြန်လည် ပိတ်သိမ်းခြင်း
   docker compose down
   ```
