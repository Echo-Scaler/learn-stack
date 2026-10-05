---
title: "03. Dockerfile Deep Dive"
description: "1. [Dockerfile ဆိုတာဘာလဲ? (Blueprint for Images)](#၁-dockerfile-ဆိုတာဘာလဲ)"
---

## 🐳 သင်ခန်းစာ (၃) - Dockerfile Deep Dive နှင့် ကိုယ်ပိုင် Image များ တည်ဆောက်ခြင်း
### (Lesson 3: Dockerfile Instructions, Layer Caching Architecture & Best Practices)

---

## 📌 မာတိကာ (Contents)
1. [Dockerfile ဆိုတာဘာလဲ? (Blueprint for Images)](#၁-dockerfile-ဆိုတာဘာလဲ)
2. [အဓိက Dockerfile Instructions များ စုံလင်စွာ လေ့လာခြင်း](#၂-အဓိက-dockerfile-instructions-များ)
3. [`CMD` နှင့် `ENTRYPOINT` မတူညီပုံနှင့် ပေါင်းစပ်အသုံးချနည်း](#၃-cmd-နှင့်-entrypoint-မတူညီပုံ)
4. [`COPY` နှင့် `ADD` ဘာကွာသလဲ? ဘယ်ဟာသုံးသင့်သလဲ?](#၄-copy-နှင့်-add-ဘာကွာသလဲ)
5. [Docker Image Layer Architecture နှင့် Cache Invalidation အလုပ်လုပ်ပုံ](#၅-docker-image-layer-architecture)
6. [လက်တွေ့ Production PHP 8.3 App အတွက် Dockerfile ရေးဆွဲခြင်း](#၆-လက်တွေ့-production-php-83-app-အတွက်-dockerfile)
7. [Image Build ပြုလုပ်ခြင်းနှင့် Tag သတ်မှတ်ခြင်း (`docker build`)](#၇-image-build-ပြုလုပ်ခြင်းနှင့်-tag-သတ်မှတ်ခြင်း)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Dockerfile ဆိုတာဘာလဲ?

**Dockerfile** ဆိုသည်မှာ Docker Image အသစ်တစ်ခု တည်ဆောက်ရန် Docker Daemon အား အဆင့်ဆင့် ညွှန်ကြားထားသည့် Text Configuration File တစ်ခု ဖြစ်ပါသည်။ 

Dockerfile တစ်ခုချင်းစီတွင် ရေးသားထားသော စာကြောင်းများသည် Image ၏ **Layer (အလွှာ)** တစ်ခုချင်းစီ ဖြစ်လာပြီး၊ အားလုံးပေါင်းစည်းလိုက်သောအခါ မည်သည့် စက်ပေါ်တွင်မဆို တပြေးညီ Run နိုင်သည့် Container Image ရရှိလာပါသည်။

---

## ၂။ အဓိက Dockerfile Instructions များ

| Instruction | လုပ်ဆောင်ချက် အကျဉ်း | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| `FROM` | Base Image ရွေးချယ်ခြင်း | Dockerfile တိုင်း၏ ပထမဆုံး စာကြောင်း ဖြစ်ရမည် (ဥပမာ- `FROM php:8.3-fpm-alpine`) |
| `WORKDIR` | Default Working Directory သတ်မှတ်ခြင်း | နောက်ဆက်တွဲ command များ အလုပ်လုပ်မည့် လမ်းကြောင်း (Linux ၏ `cd` နှင့်တူသည်) |
| `COPY` | ဖိုင်များကို Container ထဲ ကူးထည့်ခြင်း | Host စက်မှ Source Code များကို Container File System ထဲသို့ ထည့်သွင်းခြင်း |
| `RUN` | Build Time တွင် Command များ run ခြင်း | Software Packages သွင်းခြင်း၊ PHP Extensions များ compile လုပ်ခြင်း (Image Layer အသစ် ဖြစ်စေသည်) |
| `ENV` | အမြဲတမ်း Environment Variable သတ်မှတ်ခြင်း | Image တည်ဆောက်ပြီး Container Run သည့်အချိန်အထိ အတည်ဖြစ်သော Variable |
| `ARG` | Build Time သီးသန့် Variable သတ်မှတ်ခြင်း | Image တည်ဆောက်စဉ် (Build Time) သာ သုံးခွင့်ရှိပြီး Container ထဲ ပါမသွားပါ |
| `EXPOSE` | Container ဖွင့်ထားသော Port ကို အသိပေးခြင်း | Documentation အနေဖြင့် မည်သည့် Port အသုံးပြုထားကြောင်း ဖော်ပြခြင်း |
| `USER` | User Switch လုပ်ခြင်း | Security အရ root user မဟုတ်ဘဲ သာမန် unprivileged user ဖြင့် run ရန် |
| `CMD` | Container စတင်ချိန် Default Run မည့် Command | Container စ run သည့်အခါ Run ပေးမည့် Program/Command |
| `ENTRYPOINT` | Container ၏ အဓိက Executable သတ်မှတ်ခြင်း | Container စတင်ချိန် မဖြစ်မနေ အမြဲ Run ပေးမည့် Base Executable |

---

## ၃။ `CMD` နှင့် `ENTRYPOINT` မတူညီပုံ

အများဆုံး မှားယွင်းတတ်သော အပိုင်းဖြစ်ပြီး အလွန်အရေးကြီးပါသည်:

### (က) Shell Form vs Exec Form:
Docker တွင် Command များကို ၂ မျိုး ရေးနိုင်သည်:
* **Shell Form**: `CMD php artisan serve` (၎င်းသည် နောက်ကွယ်တွင် `/bin/sh -c` ဖြင့် run သဖြင့် Unix Signals `SIGTERM` ကို တိုက်ရိုက် မရရှိနိုင်ဘဲ Container Graceful Stop မဖြစ်နိုင်ပါ)။
* **Exec Form (Recommended)**: `CMD ["php", "artisan", "serve"]` (JSON Array ပုံစံဖြင့် တိုက်ရိုက် Run သဖြင့် Signal များ အပြည့်အဝ ရရှိသည်)။

### (ခ) `CMD` vs `ENTRYPOINT` ကွာခြားချက်:
* **`CMD`**: Override လုပ်ရလွယ်ကူသည်။ Container run သည့်အခါ အပြင်မှ command ပေးလိုက်ပါက default CMD သည် ပျက်ပြယ်သွားသည်။
* **`ENTRYPOINT`**: အသေ သတ်မှတ်ထားသော Command ဖြစ်ပြီး Override လုပ်ရန် ခက်ခဲသည်။ Container အပြင်မှ ပေးလိုက်သော စကားလုံးများသည် ENTRYPOINT ၏ Argument (နောက်မြီး) အဖြစ် တွဲလျက် ပါသွားသည်။

```dockerfile
# ဥပမာ - ENTRYPOINT နှင့် CMD ပေါင်းစပ်နည်း (Best Practice)
ENTRYPOINT ["php"]
CMD ["-a"]
```
* အကယ်၍ `docker run my-app` ဟု run ပါက: `php -a` အလုပ်လုပ်မည်။
* အကယ်၍ `docker run my-app artisan migrate` ဟု run ပါက: `php artisan migrate` အဖြစ် အလိုအလျောက် ပြောင်းလဲသွားမည်။

---

## ၄။ `COPY` နှင့် `ADD` ဘာကွာသလဲ?

* **`COPY` (အမြဲ သုံးသင့်သည်)**:
  * Local စက်မှ ဖိုင်/ဖိုဒါများကို Container ထဲသို့ ရိုးရှင်းစွာ ကူးယူပေးသည်။ ကြိုတင်ခန့်မှန်းရ လွယ်ကူပြီး လုံခြုံသည်။
* **`ADD` (အထူးကိစ္စမှလွဲ၍ ရှောင်ကြဉ်ပါ)**:
  * Local မှ ဖိုင်ကူးယူနိုင်သည့်အပြင် URL (Web Link) မှ တိုက်ရိုက် Download ဆွဲနိုင်ခြင်း၊ `.tar.gz` compressed archive ဖိုင်များကို အလိုအလျောက် ဖြည်ချ (Auto Extract) ပေးနိုင်ခြင်းများ ပါဝင်သည်။
  * **Best Practice**: Tar archive ဖိုင်ဖြည်ချရန် ကိစ္စမှအပ သာမန် ဖိုင်များအတွက် **`COPY` ကိုသာ အမြဲ အသုံးပြုပါ**။

---

## ၅။ Docker Image Layer Architecture နှင့် Cache Invalidation

Docker Image တစ်ခုသည် အလွှာများစွာ (Layers) ဖြင့် ဖွဲ့စည်းထားပါသည်။

```
┌────────────────────────────────────────────────────────┐
│  Container Read-Write Layer (Logs, Temp files)         │ ◄── Container စ run မှ ပေါ်လာသည်
├────────────────────────────────────────────────────────┤
│  Layer 5: CMD ["php-fpm"]                              │ ◄── Read-Only Image Layers
├────────────────────────────────────────────────────────┤
│  Layer 4: COPY . /var/www/html (Source Code ပြောင်းလဲမှု) │ ◄── ⚠️ Code ပြင်တိုင်း ဤနေရာမှစ၍ Cache ပျက်သည်
├────────────────────────────────────────────────────────┤
│  Layer 3: RUN composer install --no-dev                │ ◄── Composer Dependencies Layer
├────────────────────────────────────────────────────────┤
│  Layer 2: COPY composer.json composer.lock ./          │ ◄── Dependencies Config
├────────────────────────────────────────────────────────┤
│  Layer 1: RUN docker-php-ext-install pdo pdo_mysql     │ ◄── Extensions & Tools
├────────────────────────────────────────────────────────┤
│  Base Layer: FROM php:8.3-fpm-alpine                   │ ◄── OS & PHP Core
└────────────────────────────────────────────────────────┘
```

### ⚡ Caching စည်းမျဉ်းနှင့် Build Optimization Trick:
အကယ်၍ သင်သည် Dockerfile အပေါ်ဆုံးတွင် `COPY . .` ဟု တစ်ပြိုင်နက် ရေးလိုက်ပါက သင်၏ PHP Code ထဲတွင် စာတစ်လုံး ပြင်လိုက်တိုင်း Docker သည် အောက်တွင်ရှိသော `composer install` နှင့် အခြား command အားလုံး၏ Cache ကို ဖျက်ပစ်ပြီး အစမှ ပြန်လည် Download ဆွဲပါလိမ့်မည်။

**မှန်ကန်သော အလေ့အကျင့် (Best Practice)**:
1. အပြောင်းအလဲ နည်းသော System Dependencies များကို အပေါ်တွင် ရေးပါ။
2. `composer.json` ကို အရင် `COPY` လုပ်ပြီး `composer install` ကို အရင် Run ပါ။
3. အမြဲတမ်း ပြောင်းလဲနေသော Application Code ကိုမှ နောက်ဆုံးမှ `COPY` လုပ်ပါ။
ဤသို့ ပြုလုပ်ခြင်းဖြင့် Code ဘယ်လောက်ပြင်ပြင် `composer install` ထပ်လုပ်စရာမလိုဘဲ Image Build ပြုလုပ်ချိန်သည် စက္ကန့်ပိုင်းသာ ကြာမြင့်တော့မည် ဖြစ်ပါသည်။

---

## ၆။ လက်တွေ့ Production PHP 8.3 App အတွက် Dockerfile

အောက်ပါ Dockerfile သည် Production အဆင့် စံချိန်မီ ရေးဆွဲထားသော ဥပမာ ဖြစ်ပါသည်:

```dockerfile
# အဆင့် ၁: တရားဝင် ပေါ့ပါးသော PHP 8.3 FPM Alpine Image ကို အခြေခံသည်
FROM php:8.3-fpm-alpine

# အဆင့် ၂: လိုအပ်သော Linux Packages များနှင့် PHP Extension တည်ဆောက်ရန် tools များ သွင်းခြင်း
RUN apk add --no-cache \
    bash \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    oniguruma-dev

# အဆင့် ၃: PHP Extensions များကို Compile လုပ်ပြီး သွင်းခြင်း
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    zip \
    exif \
    pcntl \
    bcmath \
    opcache

# အဆင့် ၄: တရားဝင် Composer Image ထဲမှ composer binary ကို ကူးယူခြင်း
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# အဆင့် ၅: Working Directory သတ်မှတ်ခြင်း
WORKDIR /var/www/html

# အဆင့် ၆: Cache Layer မိစေရန် composer ဖိုင်များကို ဦးစွာ ကူးယူခြင်း
COPY composer.json composer.lock ./

# အဆင့် ၇: Production Dependencies သွင်းခြင်း (Dev tools များ မပါဝင်စေရန်)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# အဆင့် ၈: Application Code တစ်ခုလုံးကို ကူးထည့်ခြင်း
COPY . .

# အဆင့် ၉: Composer Autoload optimize ပြုလုပ်ခြင်း
RUN composer dump-autoload --optimize

# အဆင့် ၁၀: File Permission များ ချိန်ညှိခြင်း (Security အရ www-data user ပေးခြင်း)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# အဆင့် ၁၁: PHP-FPM Port 9000 ကို ဖွင့်လှစ်ပြသခြင်း
EXPOSE 9000

# အဆင့် ၁၂: Default အနေဖြင့် PHP-FPM ကို စတင် Run စေခြင်း
CMD ["php-fpm"]
```

---

## ၇။ Image Build ပြုလုပ်ခြင်းနှင့် Tag သတ်မှတ်ခြင်း

Dockerfile ရေးသားထားသော Directory အတွင်းတွင် အောက်ပါ command ဖြင့် Image Build ပြုလုပ်နိုင်ပါသည်:

```bash
# syntax: docker build -t <repository_name>:<tag> <context_path>
docker build -t my-laravel-app:1.0.0 .
```

* **`-t` (Tag)**: Image အမည်နှင့် Version သတ်မှတ်ခြင်း (ဥပမာ- `my-laravel-app:1.0.0`)။
* **`.` (Build Context)**: လက်ရှိ directory ရှိ ဖိုင်အားလုံးကို Docker Daemon ထံ ပို့ပေးခြင်း ဖြစ်သည်။

### Build လုပ်ထားသော Image ကို စစ်ဆေးခြင်း:
```bash
docker images
```

### Build ပြီးသော Image အသစ်ကို စမ်းသပ် Run ခြင်း:
```bash
docker run -d --name test-app -p 9000:9000 my-laravel-app:1.0.0
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက်အလက် (Checklist) | အကြံပြုချက် | စစ်ဆေးပြီး |
| :--- | :--- | :---: |
| **Base Image ရွေးချယ်မှု** | ပေါ့ပါးသော `alpine` သို့မဟုတ် `slim` images များကို ဦးစားပေး သုံးထားသလား? | [ ] |
| **Layer Caching Optimization** | Dependencies ဖိုင်များ (`composer.json`) ကို Source Code အပြည့် မကူးခင် ကြိုတင် run ထားသလား? | [ ] |
| **Instruction ပုံစံ** | `CMD` တွင် Shell form မဟုတ်ဘဲ Exec form `["cmd", "arg"]` သုံးထားသလား? | [ ] |
| **Cleanup on RUN** | Package manager ၏ cache များကို ရှင်းလင်းထားသလား? (`apk --no-cache` / `apt-get clean`) | [ ] |

နောက်သင်ခန်းစာ [04_docker_storage_and_volumes.md](/devops/02_kubernetes_and_cloud/04_docker_storage_and_volumes/) တွင် Container ပျက်သွားသော်လည်း Data မပျောက်ပျက်စေရန် Docker Storage & Volumes စနစ်များကို ဆက်လက် လေ့လာပါမည်။
