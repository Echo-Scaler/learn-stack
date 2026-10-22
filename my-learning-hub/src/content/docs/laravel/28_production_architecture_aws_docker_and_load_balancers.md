---
title: "28. Production Architecture: AWS, Docker & Load Balancers"
description: "Laravel ကို AWS Cloud နှင့် Docker ပေါ်တွင် Production-grade အဆင့် တင်ဆင်ခြင်း၊ Load Balancer (ALB)၊ Nginx Reverse Proxy၊ Stateless App Architecture (Redis Sessions & AWS S3)၊ Supervisor Worker၊ Log စစ်ဆေးခြင်းနှင့် Deployment Automation"
---

> Laravel 11 / 12 အခြေခံ။
> "Application တစ်ခုကို Local စက်တွင် Run တတ်ရုံဖြင့် မလုံလောက်ပါ။ User သန်းချီ ဝင်ရောက်လာချိန်တွင် မပြိုလဲစေရန် **High Availability (HA), Load Balancer, Docker Multi-Container နှင့် AWS Cloud Architecture** ကို စနစ်တကျ ဒီဇိုင်းဆွဲ တည်ဆောက်နိုင်ရပါမည်။"

---

## 🧭 မာတိကာ (Table of Contents)
1. [Production Cloud Architecture ခြုံငုံသုံးသပ်ချက်](#၁-production-cloud-architecture-ခြုံငုံသုံးသပ်ချက်)
2. [Stateless Application Design (Load Balancer အတွက် မရှိမဖြစ် စည်းမျဉ်း ၃ ချက်)](#၂-stateless-application-design-load-balancer-အတွက်-မရှိမဖြစ်-စည်းမျဉ်း-၃-ချက်)
3. [AWS Application Load Balancer (ALB) & `TrustProxies` Configuration](#၃-aws-application-load-balancer-alb--trustproxies-configuration)
4. [Production-Grade Docker Setup (PHP-FPM, Nginx & Alpine Linux)](#၄-production-grade-docker-setup-php-fpm-nginx--alpine-linux)
5. [Queue Workers & Task Scheduling with Supervisor & Cron in Containers](#၅-queue-workers--task-scheduling-with-supervisor--cron-in-containers)
6. [AWS S3 File Storage & CloudFront CDN Integration](#၆-aws-s3-file-storage--cloudfront-cdn-integration)
7. [Docker & AWS Production Logs Check (CloudWatch, Loki, Docker Logs)](#၇-docker--aws-production-logs-check-cloudwatch-loki-docker-logs)
8. [Zero-Downtime Deployment Script (CI/CD Pipeline Workflow)](#၈-zero-downtime-deployment-script-cicd-pipeline-workflow)
9. [Production Performance Optimization Checklist (Command Reference)](#၉-production-performance-optimization-checklist-command-reference)
10. [လေ့ကျင့်ခန်းများ (Hands-on Exercises)](#၁၀-လေ့ကျင့်ခန်းများ-hands-on-exercises)

---

## ၁။ Production Cloud Architecture ခြုံငုံသုံးသပ်ချက်

Enterprise Laravel System တစ်ခု၏ High Availability (HA) Cloud Architecture ပုံကြမ်း:

```
                                  Internet (Clients)
                                          │
                                          ▼
                         AWS Route 53 (DNS) + CloudFront (CDN)
                                          │
                                          ▼
                      AWS Application Load Balancer (ALB) 
                             (SSL / HTTPS Termination)
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
          [App Server 1 (EC2 / ECS)]                  [App Server 2 (EC2 / ECS)]
          ┌────────────────────────┐                  ┌────────────────────────┐
          │ Nginx + PHP 8.3 FPM    │                  │ Nginx + PHP 8.3 FPM    │
          └───────────┬────────────┘                  └───────────┬────────────┘
                      │                                           │
                      └─────────────────────┬─────────────────────┘
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     ▼                      ▼                      ▼
           [AWS RDS (MySQL)]      [AWS ElastiCache (Redis)]  [AWS S3 Bucket]
           - Master (Write)       - Shared Sessions          - Uploaded Images
           - Read Replica (Read)  - Shared Cache             - PDF Invoices
                                  - Queues (Horizon)
```

---

## ၂။ Stateless Application Design (Load Balancer အတွက် မရှိမဖြစ် စည်းမျဉ်း ၃ ချက်)

Load Balancer နောက်ကွယ်တွင် Server အများအပြား (Server 1, Server 2) ထားရှိပါက Request တစ်ခုသည် Server 1 ဆီ ရောက်သွားပြီး နောက် Request တစ်ခုသည် Server 2 ဆီ ရောက်သွားနိုင်သည်။

ထို့ကြောင့် Application သည် **မည်သည့် State (အခြေအနေ) ကိုမျှ မိမိ Server စက်ထဲတွင် မသိမ်းဆည်းရပါ (Stateless)**:

```
 ❌ Stateful (မှားယွင်းသည်)                 ✅ Stateless (မှန်ကန်သည်)
 ─────────────────────────                 ─────────────────────────
 Session ကို Server 1 disk ထဲသိမ်းသည်      Session အားလုံးကို Redis ထဲ စုပေါင်းသိမ်းသည်
 Image ကို Server 1 local disk ထဲသိမ်းသည်  Image အားလုံးကို AWS S3 Cloud Storage ထဲ ပို့သည်
 Cache ကို Server 1 memory ထဲသိမ်းသည်      Cache အားလုံးကို Redis Cluster ထဲ မျှဝေသုံးသည်
 (Server 2 သို့ရောက်လျှင် Logout ဖြစ်သွားမည်) (မည်သည့် Server သို့ရောက်ရောက် အတူတူပင်ဖြစ်သည်)
```

### `.env` Production Settings:
```env
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
FILESYSTEM_DISK=s3
```

---

## ၃။ AWS Application Load Balancer (ALB) & `TrustProxies` Configuration

Load Balancer သည် Client ၏ HTTPS ကို လက်ခံပြီး Server များဆီသို့ HTTP (Port 80) ဖြင့် Forward ပို့လေ့ရှိသည် (**SSL Termination / Offloading**)။

### 🚨 ပြဿနာ:
Laravel သည် Request ကို HTTP အနေဖြင့် မြင်နေရသဖြင့် `url()` helper များ ခေါ်ယူချိန်တွင် `http://` ထွက်လာခြင်း၊ Redirect Loop ဖြစ်ခြင်းများ ကြုံရမည်။

### ✅ အဖြေ: `TrustProxies` သတ်မှတ်ခြင်း (Laravel 11+)
`bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    // AWS ALB / Reverse Proxy အားလုံးကို ယုံကြည်စိတ်ချရသော Proxy အဖြစ် သတ်မှတ်ခြင်း
    $middleware->trustProxies(at: '*');
    
    // Header အားလုံးကို အသိအမှတ်ပြုခြင်း
    $middleware->trustProxies(headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
        \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
        \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
        \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
        \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

---

## ၄။ Production-Grade Docker Setup (PHP-FPM, Nginx & Alpine Linux)

Production အတွက် အလွန်ပေါ့ပါးပြီး လုံခြုံသော Multi-Stage Dockerfile နမူနာ:

### `Dockerfile`
```dockerfile
# ---------------- Stage 1: Build Dependencies ----------------
FROM composer:2.7 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# ---------------- Stage 2: Production Runtime ----------------
FROM php:8.3-fpm-alpine

# လိုအပ်သော Extensions များ ထည့်သွင်းခြင်း
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring zip pcntl bcmath gd opcache

# OPcache Production Tuning
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Source code နှင့် Vendor ဖိုင်များ ကူးယူခြင်း
COPY . .
COPY --from=vendor /app/vendor ./vendor

# Permission သတ်မှတ်ခြင်း (Security)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Nginx & Supervisor Configs
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
```

---

## ၅။ Queue Workers & Task Scheduling with Supervisor & Cron in Containers

Container တစ်ခုတည်းတွင် Nginx, PHP-FPM, Queue Worker နှင့် Cron Scheduler တို့ကို တစ်ပြိုင်နက် Run နိုင်ရန် **Supervisor** ကို အသုံးပြုသည်:

### `docker/supervisord.conf`
```ini
[supervisord]
nodaemon=true
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:php-fpm]
command=docker-php-fpm
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=4
stdout_logfile=/var/www/html/storage/logs/worker.log

[program:laravel-cron]
command=sh -c "while true; do php /var/www/html/artisan schedule:run --verbose --no-interaction & sleep 60; done"
autostart=true
autorestart=true
```

---

## ၆။ AWS S3 File Storage & CloudFront CDN Integration

User တင်လိုက်သော ပုံများ၊ ဖိုင်များကို S3 သို့ တိုက်ရိုက် သိမ်းဆည်းရန်:

```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

### `.env` Configuration:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=my-production-media-bucket
AWS_URL=https://d111111abcdef8.cloudfront.net  # CloudFront CDN Domain
```

### Code ထဲတွင် အသုံးပြုပုံ:
```php
use Illuminate\Support\Facades\Storage;

// ဖိုင် သိမ်းဆည်းခြင်း (S3 သို့ အလိုအလျောက် ရောက်သွားသည်)
$path = $request->file('avatar')->store('avatars', 's3');

// CloudFront CDN URL ရယူခြင်း
$url = Storage::disk('s3')->url($path);
// Output: https://d111111abcdef8.cloudfront.net/avatars/randomname.jpg

// သီးသန့် ဖိုင်များ (Private Documents) အတွက် သက်တမ်းရှိသော Pre-signed URL ထုတ်ခြင်း
$temporaryUrl = Storage::disk('s3')->temporaryUrl(
    'invoices/inv_001.pdf',
    now()->addMinutes(15) // ၁၅ မိနစ်သာ အသုံးပြုခွင့်ရှိသည်
);
```

---

## ၇။ Docker & AWS Production Logs Check (CloudWatch, Loki, Docker Logs)

Production တွင် Container ထဲသို့ SSH ဝင်စရာမလိုဘဲ Log များကို အမြန် စစ်ဆေးနည်း:

### (က) Docker CLI Commands
```bash
# Container ၏ Live Output ကြည့်ခြင်း
docker logs -f --tail=100 my-laravel-app

# Worker Log သီးသန့် စစ်ဆေးခြင်း
docker exec -it my-laravel-app tail -f storage/logs/worker.log
```

### (ခ) AWS CloudWatch Logs သို့ ပို့ဆောင်ခြင်း
`docker-compose.yml` တွင် `awslogs` driver သုံးနိုင်သည်:
```yaml
logging:
  driver: "awslogs"
  options:
    awslogs-region: "ap-southeast-1"
    awslogs-group: "/ecs/laravel-production"
    awslogs-stream-prefix: "app"
```

---

## ၈။ Zero-Downtime Deployment Script (CI/CD Pipeline Workflow)

GitHub Actions သို့မဟုတ် Deploy Script တွင် အောက်ပါ Commands များကို အစဉ်လိုက် Run ပေးရမည်:

```bash
#!/bin/bash
set -e

echo "Deploying application ..."

# ၁။ Maintenance Mode ခေတ္တ ဖွင့်ထားခြင်း (Bypass secret ပါရှိသည်)
php artisan down --secret="deployment-secret-token-123" --render="errors::503"

# ၂။ Code အသစ်များ Pull လုပ်ခြင်း
git pull origin main

# ၃။ Dependencies Install ပြုလုပ်ခြင်း
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# ၄။ Database Migration (Safety)
php artisan migrate --force

# ၅။ Cache အားလုံးကို Pre-compile ပြုလုပ်ခြင်း (အလွန်မြန်သွားစေသည်)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ၆။ Queue Worker များကို Restart ပြုလုပ်ခြင်း (Code အသစ် သိစေရန်)
php artisan queue:restart

# ၇။ Maintenance Mode ပြန်ပိတ်ခြင်း
php artisan up

echo "Application deployed successfully!"
```

---

## ၉။ Production Performance Optimization Checklist (Command Reference)

Production Server တွင် အောက်ပါ ၅ ခုကို မဖြစ်မနေ Cache လုပ်ထားရပါမည်:

```bash
# ၁။ Config Cache (ဖိုင်ပေါင်းများစွာ ဖတ်ရခြင်းမှ ကင်းဝေးသည်)
php artisan config:cache

# ၂။ Route Cache (Routing အားလုံးကို Fast Array အဖြစ် ပြောင်းသည်)
php artisan route:cache

# ၃။ View Cache (Blade ဖိုင်များကို Pre-compile ပြုလုပ်သည်)
php artisan view:cache

# ၄။ Event Cache (Events & Listeners Discovery ကို Cache လုပ်သည်)
php artisan event:cache

# ၅။ Composer Autoloader Optimize
composer dump-autoload --optimize --classmap-authoritative
```

> ⚠️ သတိပြုရန်: `config:cache` လုပ်ပြီးပါက Controller သို့မဟုတ် Code ထဲတွင် `env('KEY')` ဟု တိုက်ရိုက် မခေါ်ရပါ။ အမြဲတမ်း `config('services.key')` ဟုသာ ခေါ်ယူရမည်။

---

## ၁၀။ လေ့ကျင့်ခန်းများ (Hands-on Exercises)

### 🏋️ လေ့ကျင့်ခန်း (၁) - Stateless Session Simulation
Local တွင် Docker ဖြင့် Redis တင်ပြီး Laravel ၏ `SESSION_DRIVER=redis` သတ်မှတ်ကာ Browser Session များသည် Redis ထဲသို့ မှန်ကန်စွာ ရောက်ရှိသွားခြင်း ရှိမရှိ `redis-cli KEYS "*"` ဖြင့် စစ်ဆေးပါ။

### 🏋️ လေ့ကျင့်ခန်း (၂) - S3 Pre-signed URL Generation
AWS S3 Bucket တစ်ခု ဖန်တီးကာ သီးသန့် PDF ဖိုင်တစ်ခု တင်ပြီး မိနစ် ၂၀ သက်တမ်းရှိသော Pre-signed URL တစ်ခု ထုတ်ယူပြသပါ။

### 🏋️ လေ့ကျင့်ခန်း (၃) - Production Caching Benchmark
`php artisan route:cache` နှင့် `config:cache` မလုပ်မီ နှင့် လုပ်ပြီးနောက် `ab -n 1000 -c 10 http://localhost/` ဖြင့် Benchmark တိုင်းတာပြီး Request/sec မည်မျှ တိုးတက်လာသည်ကို နှိုင်းယှဉ်ပါ။
