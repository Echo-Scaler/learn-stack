---
title: "07. Php Laravel Nginx Mysql Redis Stack"
description: "Official PHP Image တွင် Variant ၃ မျိုး ရှိပါသည်-"
---

## 🐘 အခန်း (၇) - PHP, Laravel, Nginx, MySQL & Redis Stack

---

## ၁၇။ PHP + Docker (PHP CLI vs PHP-FPM & Extensions)

Official PHP Image တွင် Variant ၃ မျိုး ရှိပါသည်-
1. `php:<version>-cli` : Command Line Script များ၊ Artisan Command များ၊ Queue Worker များအတွက် သီးသန့်သုံးသည်။
2. `php:<version>-apache` : Apache Web Server နှင့် PHP ကို တစ်ခါတည်း ပေါင်းစပ်ထားသည်။ (အတော်လေး Size ကြီးသည်)။
3. `php:<version>-fpm-alpine` : Nginx နှင့် တွဲဖက် အသုံးပြုသော **FastCGI Process Manager (FPM)** ဖြစ်ပြီး အလွန်ပေါ့ပါး၊ မြန်ဆန်ကာ Modern Microservices တွင် အသုံးအများဆုံး ဖြစ်သည်။

### 🧩 PHP Extensions များ တပ်ဆင်နည်း (Official Helper Scripts)
Docker ၏ Official PHP image တွင် Extension များ အလွယ်တကူ တပ်ဆင်နိုင်ရန် အောက်ပါ Scripts များ ပါရှိပြီး ဖြစ်သည်-
- `docker-php-ext-install` : Core PHP extensions များကို Compile လုပ်ပြီး သွင်းပေးသည်။
- `docker-php-ext-configure` : Extension များ မသွင်းမီ လိုအပ်သော C-libraries လမ်းကြောင်းများ ကြိုတင် ချိန်ညှိပေးသည်။
- `pecl install` : PECL repository မှ Third-party extensions (ဥပမာ- Redis, Xdebug) များကို သွင်းပေးသည်။

```dockerfile
# ဥပမာ- Laravel အတွက် လိုအပ်သော Extensions များ တပ်ဆင်ခြင်း
RUN apk add --no-cache \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    zip \
    $PHPIZE_DEPS

# GD Extension အတွက် JPEG နှင့် Freetype configuration ချိန်ညှိခြင်း
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Extensions များ compile လုပ်သွင်းခြင်း
RUN docker-php-ext-install -j$(nproc) gd pdo_mysql zip bcmath opcache

# PECL မှတစ်ဆင့် Redis extension သွင်းခြင်း
RUN pecl install redis && docker-php-ext-enable redis
```

---

## ၁၈။ Laravel + Docker (Directory Permissions & Artisan)

Laravel သည် Linux ပေါ်တွင် Run သည့်အခါ အရေးအကြီးဆုံး ကိစ္စ ၂ ခု ရှိပါသည်-

### ၁။ Storage & Bootstrap Cache Permission ပြဿနာ
Laravel သည် User များ Upload ပြုလုပ်သော ပုံများ၊ Session ဖိုင်များ၊ Blade Cache များနှင့် Logs များကို `storage/` နှင့် `bootstrap/cache/` ထဲတွင် သိမ်းဆည်းသည်။  
Docker Container အတွင်း Web Server/PHP Process သည် `www-data` အနေဖြင့် အလုပ်လုပ်သောကြောင့် ထို Folder များကို Write Permission ပေးထားရမည်-

```dockerfile
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
```

### ၂။ Docker အတွင်း Artisan Commands များ အသုံးပြုပုံ
Container အပြင်ဘက် Terminal မှနေ၍ Artisan command များကို အောက်ပါအတိုင်း အလွယ်တကူ Run နိုင်ပါသည်-

```bash
# Database Migration လုပ်ဆောင်ခြင်း
docker compose exec php php artisan migrate

# Seed Data ထည့်သွင်းခြင်း
docker compose exec php php artisan db:seed

# Cache များ ရှင်းလင်းခြင်း
docker compose exec php php artisan optimize:clear

# Interactive Shell (Tinker) ဖွင့်ခြင်း
docker compose exec php php artisan tinker
```

---

## ၁၉။ Nginx + Docker (Reverse Proxy & FastCGI)

Nginx သည် Browser မှ ဝင်လာသော HTTP Request (Port 80/443) ကို လက်ခံပြီး၊ `.css`, `.js`, `.png` စသည့် Static Assets များကို ကိုယ်တိုင် တိုက်ရိုက် ပေးပို့သည်။  
PHP Script (`.php` သို့မဟုတ် Dynamic Route) များ ဖြစ်ပါက FastCGI Protocol ဖြင့် `php:9000` သို့ လွှဲပြောင်း (Pass) ပေးသည်။

### 📄 Nginx Configuration (`default.conf`) နမူနာ

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;

    index index.php index.html;
    charset utf-8;

    # Laravel Pretty URLs (SPA/Routing) အတွက်
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    # PHP FastCGI လွှဲပြောင်းပေးခြင်း
    location ~ \.php$ {
        fastcgi_pass php:9000;           # Service name 'php' ၏ Port 9000 သို့ ပို့သည်
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # လုံခြုံရေးအရ .hidden files (ဥပမာ- .env, .git) များကို ပိတ်ထားခြင်း
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## ၂၀။ MySQL + Docker

Laravel အတွက် MySQL Container အသုံးပြုရာတွင် အောက်ပါ အချက်များကို အထူး ဂရုပြုရမည်-
- **`MYSQL_ROOT_PASSWORD`**: Root user ၏ စကားဝှက်။
- **`MYSQL_DATABASE`**: Container စတင်သည်နှင့် အလိုအလျောက် ဆောက်ပေးမည့် Database နာမည်။
- **`MYSQL_USER` & `MYSQL_PASSWORD`**: Laravel App က သုံးရန် သာမန် User။
- **Character Encoding**: မြန်မာစာ ယူနီကုဒ်နှင့် Emoji များ အဆင်ပြေစေရန် `utf8mb4` ကို သုံးသင့်သည်။

```yaml
mysql:
  image: mysql:8.0
  command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  volumes:
    - mysql-data:/var/lib/mysql
```

---

## ၂၁။ Redis + Docker (Cache, Session & Queue Workers)

Laravel တွင် Redis ကို Cache, Session နှင့် Background Queue များအတွက် အသုံးပြုရာတွင် `redis:alpine` ပေါ့ပါးသော Image ကို သုံးနိုင်သည်။

### Laravel `.env` ထဲတွင် ချိတ်ဆက်ပုံ:
```ini
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

## ၂၂။ Container Communication (Internal DNS Resolution)

Docker Network တစ်ခုအတွင်းရှိ Container များသည် တစ်ခုနှင့်တစ်ခု မည်သို့ ဆက်သွယ်ကြသနည်း?

```
Browser ----> [ laravel-nginx ]
                     |
                 (FastCGI)
                     v
             [ laravel-app (PHP) ]
              /                 \
        (Port 3306)         (Port 6379)
            v                     v
   [ laravel-mysql ]      [ laravel-redis ]
```

1. Laravel App သည် Database သို့ ချိတ်လိုသောအခါ Docker ၏ **Embedded DNS Server (127.0.0.11)** ဆီသို့ `mysql` ဟူသော Hostname ၏ IP address ကို မေးမြန်းသည်။
2. Docker DNS သည် MySQL container ၏ လက်ရှိ Private IP (ဥပမာ- `172.20.0.3`) ကို ပြန်လည် ဖြေရှင်းပေးသည်။
3. ထို့ကြောင့် Developer များသည် IP address အပြောင်းအလဲများကို စိတ်ပူစရာ မလိုဘဲ Service Name များကို Hostname အဖြစ် အမြဲတမ်း စိတ်ချစွာ သုံးနိုင်ခြင်း ဖြစ်သည်။
