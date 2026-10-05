---
title: "10. Real World Laravel Docker Project"
description: "ဤအခန်းတွင် Nginx Web Server, PHP 8.3-FPM (Composer ပါဝင်သော), MySQL 8.0 Database, Redis In-Memory Cache နှင့် Local Email စမ်းသပ်နိုင်သော Mailpit ပါဝင်သည့် အသင့"
---

## 🏗️ အခန်း (၁၀) - Real-World Laravel Docker Project (လက်တွေ့ ပရောဂျက် တည်ဆောက်ခြင်း)

---

## ၃၀။ Real-World Full-Stack Laravel Docker Project

ဤအခန်းတွင် Nginx Web Server, PHP 8.3-FPM (Composer ပါဝင်သော), MySQL 8.0 Database, Redis In-Memory Cache နှင့် Local Email စမ်းသပ်နိုင်သော Mailpit ပါဝင်သည့် **အသင့်သုံး Real-World Multi-Container Stack** ကို တည်ဆောက်သွားပါမည်။

---

### 📁 Directory Structure (ဖိုင်တွဲ တည်ဆောက်ပုံ)

```text
laravel-docker-project/
├── docker/
│   ├── nginx/
│   │   └── default.conf            # Nginx Configuration
│   └── php/
│       └── local.ini               # Custom PHP configurations (upload size, memory limit)
├── src/                            # Laravel Source Code (Bind Mount)
│   ├── public/
│   │   └── index.php               # Web Entry Point
│   └── ...
├── .dockerignore                   # Docker Build မှ ဖယ်ထုတ်မည့် ဖိုင်များ
├── .env.example                    # Environment Variables နမူနာ
├── Dockerfile                      # PHP 8.3 FPM Custom Image
└── docker-compose.yml              # Multi-container orchestration
```

---

### ⚙️ ၁။ `Dockerfile` (PHP 8.3-FPM + Composer + Extensions)

```dockerfile
FROM php:8.3-fpm-alpine

# စနစ်အတွက် လိုအပ်သော Linux packages များ တပ်ဆင်ခြင်း
RUN apk update && apk add --no-cache \
    curl \
    git \
    bash \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    $PHPIZE_DEPS

# PHP Extensions များကို Compile လုပ်၍ တပ်ဆင်ခြင်း
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd

# PECL မှတစ်ဆင့် Redis extension သွင်းခြင်း
RUN pecl install redis \
    && docker-php-ext-enable redis

# Composer 2.x ကို Official image မှ ကူးယူတပ်ဆင်ခြင်း
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# အလုပ်လုပ်မည့် လမ်းကြောင်း သတ်မှတ်ခြင်း
WORKDIR /var/www/html

# Port 9000 ကို FastCGI အတွက် ဖွင့်ထားခြင်း
EXPOSE 9000

CMD ["php-fpm"]
```

---

### 🌐 ၂။ Nginx Configuration (`docker/nginx/default.conf`)

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
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

### 🐙 ၃။ `docker-compose.yml` (ဝန်ဆောင်မှု အားလုံး ပေါင်းစည်းခြင်း)

```yaml
services:
  # Nginx Web Server
  nginx:
    image: nginx:alpine
    container_name: app-nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php
    networks:
      - app-network

  # PHP Application (Laravel)
  php:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app-php
    restart: unless-stopped
    volumes:
      - ./src:/var/www/html
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_DATABASE=laravel_db
      - DB_USERNAME=laravel_user
      - DB_PASSWORD=laravel_password
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network

  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: app-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_secret_password
      MYSQL_DATABASE: laravel_db
      MYSQL_USER: laravel_user
      MYSQL_PASSWORD: laravel_password
    ports:
      - "127.0.0.1:3306:3306"
    volumes:
      - mysql-storage:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_secret_password"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis In-Memory Cache
  redis:
    image: redis:alpine
    container_name: app-redis
    restart: unless-stopped
    volumes:
      - redis-storage:/data
    networks:
      - app-network

  # Mailpit (Local Email Testing UI)
  mailpit:
    image: axllent/mailpit:latest
    container_name: app-mailpit
    restart: unless-stopped
    ports:
      - "8025:8025"   # Web UI Dashboard
      - "1025:1025"   # SMTP Port
    networks:
      - app-network

volumes:
  mysql-storage:
    driver: local
  redis-storage:
    driver: local

networks:
  app-network:
    driver: bridge
```

---

### 🚀 လက်တွေ့ စတင် Run နည်း လမ်းညွှန်

1. **Terminal ဖွင့်၍ Project folder ထဲသို့ သွားပါ:**
   ```bash
   cd laravel-docker-project
   ```

2. **Stack တစ်ခုလုံးကို Background တွင် စတင် Run ပါ:**
   ```bash
   docker compose up -d --build
   ```

3. **Status စစ်ဆေးပါ:**
   ```bash
   docker compose ps
   ```

4. **Browser တွင် ဖွင့်လှစ်စမ်းသပ်ပါ:**
   - **Laravel App:** `http://localhost:8080` (PHP Info, MySQL Connection status, Redis connection status ကို မြင်တွေ့ရမည်)
   - **Mailpit Dashboard:** `http://localhost:8025` (Email စမ်းသပ် Dashboard)

5. **Container အတွင်း Artisan Command များ စမ်းသပ်ခြင်း:**
   ```bash
   # Container အတွင်းသို့ ဝင်ရောက်ခြင်း
   docker compose exec php bash

   # Artisan command run ခြင်း
   docker compose exec php php -v
   ```

6. **Stack ကို ပြန်လည် ရပ်တန့်ခြင်း:**
   ```bash
   docker compose down
   ```
