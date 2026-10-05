---
title: "06. Multistage Builds And Optimization"
description: "1. [ကြီးမားလွန်းသော Docker Images များ၏ ဆိုးကျိုး (The Bloated Image Problem)](#၁-ကြီးမားလွန်းသော-docker-images-များ၏-ဆိုးကျိုး)"
---

## 🐳 သင်ခန်းစာ (၆) - Multi-Stage Builds နှင့် Image Size လျှော့ချခြင်း
### (Lesson 6: Docker Multi-Stage Builds, Minimal Base Images & Production Optimization)

---

## 📌 မာတိကာ (Contents)
1. [ကြီးမားလွန်းသော Docker Images များ၏ ဆိုးကျိုး (The Bloated Image Problem)](#၁-ကြီးမားလွန်းသော-docker-images-များ၏-ဆိုးကျိုး)
2. [Multi-Stage Build ဆိုတာဘာလဲ? အလုပ်လုပ်ပုံ Architecture Diagram](#၂-multi-stage-build-ဆိုတာဘာလဲ)
3. [Image Optimization အတွက် ရွှေစည်းမျဉ်း ၄ ချက်](#၃-image-optimization-အတွက်-ရွှေစည်းမျဉ်း-၄-ချက်)
   - [၃.၁။ `.dockerignore` အသုံးပြုခြင်း](#၃၁-dockerignore-အသုံးပြုခြင်း)
   - [၃.၂။ Lightweight Base Images များ ရွေးချယ်ခြင်း (Alpine vs Distroless)](#၃၂-lightweight-base-images-များ-ရွေးချယ်ခြင်း)
   - [၃.၃။ RUN Commands များကို ပေါင်းစည်းပြီး Cache ရှင်းလင်းခြင်း](#၃၃-run-commands-များကို-ပေါင်းစည်းခြင်း)
   - [၃.၄။ Non-root User ဖြင့် Run ခြင်း](#၃၄-non-root-user-ဖြင့်-run-ခြင်း)
4. [လက်တွေ့ Production ဥပမာ (၁): Node.js / Frontend App ကို Nginx ဖြင့် Deploy ပြုလုပ်ခြင်း](#၄-လက်တွေ့-production-ဥပမာ-၁)
5. [လက်တွေ့ Production ဥပမာ (၂): Laravel Multi-Stage Dockerfile (Composer + Node + PHP)](#၅-လက်တွေ့-production-ဥပမာ-၂)
6. [Image Layers များကို စစ်ဆေးတိုင်းတာခြင်း (`docker history`)](#၆-image-layers-များကို-စစ်ဆေးတိုင်းတာခြင်း)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ ကြီးမားလွန်းသော Docker Images များ၏ ဆိုးကျိုး

အတွေ့အကြုံနည်းသော Developer များ ရေးဆွဲထားသည့် Docker Image များသည် မကြာခဏ **1.5 GB မှ 2.5 GB** အထိ ကြီးမားနေတတ်သည်။ 

ဤသို့ Image ကြီးမားခြင်းကြောင့် Production တွင် အောက်ပါဆိုးကျိုးများ ကြုံရသည်:
1. **နှေးကွေးသော CI/CD Pipeline**: GitHub Actions သို့မဟုတ် AWS ECR သို့ Push/Pull ပြုလုပ်ရာတွင် မိနစ်ပေါင်းများစွာ ကြာမြင့်ခြင်း။
2. **လုံခြုံရေး အားနည်းချက် (Large Attack Surface)**: Build tools များ (GCC, Make, Git, Curl, NPM) ပါဝင်နေသဖြင့် Hacker များ တိုက်ခိုက်နိုင်သော လမ်းကြောင်း (CVE Vulnerabilities) ပိုမိုများပြားခြင်း။
3. **Cloud Bandwidth & Storage ကုန်ကျစရိတ် မြင့်မားခြင်း**။

**ရည်မှန်းချက်**: Multi-Stage Build ဖြင့် အဆိုပါ 1.5 GB Image ကို **50 MB မှ 120 MB** ဝန်းကျင်အထိ သေးငယ်သွားအောင် ညှစ်ထုတ်ဖယ်ရှားမည် ဖြစ်သည်။

---

## ၂။ Multi-Stage Build ဆိုတာဘာလဲ?

ယခင်က Build လုပ်ရန် လိုအပ်သော Compilers, Node.js, Composer များနှင့် Production Run ရန် လိုအပ်သော Runtime တို့ကို Dockerfile တစ်ခုတည်းတွင် ရောထွေးသွင်းခဲ့ကြသည်။

**Multi-Stage Build** တွင်မူ Dockerfile တစ်ခုတည်း၌ပင် `FROM` instruction ကို အကြိမ်ကြိမ် သုံးခွင့်ရရှိပြီး၊ ပထမအဆင့်တွင် Build လုပ်ပြီး ထွက်လာသော အချောသတ်ဖိုင် (Artifacts) များကိုသာ နောက်ဆုံး သန့်ရှင်းသော Stage ဆီသို့ ကူးယူခွင့် ရရှိစေပါသည်။

```
[ STAGE 1: BUILDER ]                              [ STAGE 2: PRODUCTION RUNTIME ]
FROM node:20 AS builder                            FROM nginx:alpine
(Size: ~1.2 GB)                                   (Size: ~25 MB)
- Installs npm, devDependencies                   - Clean Nginx Server only
- Runs `npm run build`                            - No Node.js, No npm
- Output: /app/dist (HTML/JS/CSS)                 - No devDependencies
         │
         │ COPY --from=builder /app/dist /usr/share/nginx/html
         └───────────────────────────────────────────────►
                                                   [ FINAL IMAGE SIZE: ~30 MB ONLY! ]
```

---

## ၃။ Image Optimization အတွက် ရွှေစည်းမျဉ်း ၄ ချက်

### ၃.၁။ `.dockerignore` အသုံးပြုခြင်း
Git တွင် `.gitignore` သုံးသကဲ့သို့ပင် Docker build context ထဲသို့ မလိုအပ်သော ဖိုင်ကြီးများ မပါသွားစေရန် Project root တွင် `.dockerignore` ဖိုင် မဖြစ်မနေ ထားရှိရမည်:

```
# .dockerignore နမူနာ
.git
.github
node_modules
vendor
npm-debug.log
.env
.env.example
tests/
Dockerfile*
docker-compose*
README.md
```

### ၃.၂။ Lightweight Base Images များ ရွေးချယ်ခြင်း
* `ubuntu:22.04` (ခန့်မှန်းခြေ 80 MB)
* `php:8.3` (Debian အခြေခံ - ခန့်မှန်းခြေ 450 MB)
* `php:8.3-fpm-alpine` (Alpine Linux အခြေခံ - **ခန့်မှန်းခြေ 85 MB သာရှိသည်**)

### ၃.၃။ RUN Commands များကို ပေါင်းစည်းခြင်း
Dockerfile တွင် `RUN` တစ်ကြောင်းချင်းစီသည် Layer အသစ် ဖြစ်စေသည်။ ထို့ကြောင့် Linux packages သွင်းပြီးပါက Package Cache များကို စာကြောင်းတစ်ကြောင်းတည်း (`&&`) တွင် ချက်ချင်း ဖျက်ပစ်ရမည်:

```dockerfile
# မကောင်းသော ပုံစံ (Layer ၂ ခုဖြစ်ပြီး Cache ကျန်နေသည်)
RUN apt-get update
RUN apt-get install -y git

# ကောင်းမွန်သော ပုံစံ (Layer ၁ ခုတည်းနှင့် အမှိုက်များ ချက်ချင်းရှင်းသည်)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*
```

---

## ၄။ လက်တွေ့ Production ဥပမာ (၁): Node/React App ကို Nginx ဖြင့် Deploy ခြင်း

```dockerfile
# Stage 1: Build Frontend Assets
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.25-alpine AS production-stage
# Build-stage ထံမှ Compiled HTML/JS/CSS များကိုသာ ကူးယူခြင်း
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
*ရလဒ်*: Node.js နှင့် ဧရာမ `node_modules` အားလုံး အပြီးဖယ်ရှားလိုက်သဖြင့် Final Image သည် **30 MB သာ** ရှိတော့မည်!

---

## ၅။ လက်တွေ့ Production ဥပမာ (၂): Laravel Multi-Stage Dockerfile

```dockerfile
# ==========================================
# Stage 1: Frontend Assets Compiler (Vite/Node)
# ==========================================
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources/ resources/
COPY vite.config.js .
RUN npm run build

# ==========================================
# Stage 2: Composer Dependencies Builder
# ==========================================
FROM composer:2.7 AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-autoloader \
    --no-scripts

# ==========================================
# Stage 3: Final Production PHP-FPM Image
# ==========================================
FROM php:8.3-fpm-alpine

# Production အတွက် လိုအပ်သလောက်သာ သွင်းခြင်း
RUN apk add --no-cache libpng libzip oniguruma \
    && apk add --no-cache --virtual .build-deps \
       libpng-dev libzip-dev oniguruma-dev $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_mysql mbstring zip opcache \
    && apk del .build-deps  # Build dependencies များကို ချက်ချင်း ပြန်ဖျက်သည်

WORKDIR /var/www/html

# Composer stage မှ vendor folder ကို ကူးယူခြင်း
COPY --from=composer-builder /app/vendor /var/www/html/vendor
# Node stage မှ compiled assets များကို ကူးယူခြင်း
COPY --from=node-builder /app/public/build /var/www/html/public/build

# Application Code ကူးယူခြင်း
COPY . .

# Composer Classmap Generate လုပ်ခြင်း
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer dump-autoload --optimize --no-dev && rm /usr/bin/composer

# Security: Non-root www-data user သတ်မှတ်ခြင်း
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
USER www-data

EXPOSE 9000
CMD ["php-fpm"]
```

---

## ၆။ Image Layers များကို စစ်ဆေးတိုင်းတာခြင်း

Image တစ်ခု၏ Layer အသီးသီးသည် မည်သည့် စာကြောင်းကြောင့် အရွယ်အစား မည်မျှ ကြီးမားသွားသည်ကို စစ်ဆေးရန်:

```bash
docker history <image_name_or_id>
```

ဥပမာအားဖြင့် မည်သည့် `RUN` command က 500 MB ယူသွားသည်ကို တိကျစွာ မြင်တွေ့ရပြီး ပြန်လည် လျှော့ချနိုင်မည် ဖြစ်သည်။

---

## ၇။ လုပ်ငန်းခွင် Real-World Tasks & Scenarios (Beginner Case Study)

### 📌 Task Scenario: Senior မှ ပေးအပ်သော လက်တွေ့တာဝန်
> **အခြေအနေ**: သင်သည် Software House တစ်ခုတွင် Junior Developer / DevOps Trainee အဖြစ် စတင်ဝင်ရောက်လုပ်ကိုင်နေသည်။  
> **ပြဿနာ**: ကုမ္ပဏီ၏ Laravel + Vue.js Project သည် `docker build` လုပ်ပြီး ECR ပေါ်သို့ Push လုပ်တိုင်း အချိန် ၁၅ မိနစ် ကြာနေပြီး Image Size မှာ **1.9 GB** အထိ ကြီးမားနေသည်။ CI/CD Pipeline တွင် နေရာပြည့်သွားသောကြောင့် Deploy မအောင်မြင်တော့ပါ။  
> **တာဝန်**: အဆိုပါ Dockerfile ကို Multi-Stage Build အဖြစ် ပြောင်းလဲပြီး Image Size ကို 100MB အောက် ရောက်အောင် ချုံ့ပေးရန်။

### 🛠️ Before vs After နှိုင်းယှဉ်ချက် (လက်တွေ့ မျက်မြင်ရလဒ်)

```
[ BEFORE: Single Stage Dockerfile ]
- Image Size: 1.9 GB
- Build & Push Time: ~14 မိနစ်
- Security Vulnerabilities: 48 (High & Critical CVEs because of gcc, git, npm, nodejs)
- Production RAM Consumption: မြင့်မားသည်

[ AFTER: Multi-Stage Build (Alpine Based) ]
- Image Size: 68 MB (96% လျော့ကျသွားသည်!) ⚡
- Build & Push Time: 45 စက္ကန့်သာ ကြာသည်
- Security Vulnerabilities: 0 Critical (No compilers or npm in runtime) 🛡️
- Production RAM Consumption: သန့်ရှင်း ပေါ့ပါးသည်
```

### 💡 ဘာကြောင့် Multi-Stage ကို သုံးရသလဲ? အဓိက အားသာချက်များ (Why & Advantages):
1. **Developer Experience မြန်ဆန်ခြင်း**: Code အသစ် ပြင်တိုင်း မိနစ် ၂၀ စောင့်စရာမလိုဘဲ စက္ကန့်ပိုင်းအတွင်း Deploy ဖြစ်ခြင်း။
2. **Cloud Bandwidth ကုန်ကျစရိတ် ချွေတာနိုင်ခြင်း**: AWS ECR / Google Artifact Registry တွင် Data Transfer ကုန်ကျစရိတ် ၉၀% ကျော် သက်သာသွားခြင်း။
3. **Enterprise Security Compliance**: Production Server ပေါ်တွင် NPM, C++ Compilers နှင့် Git မပါရှိတော့သဖြင့် Hacker များ Container Escape လုပ်၍ မရတော့ခြင်း။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| Optimization နည်းပညာ | လုပ်ဆောင်ချက် | ရလဒ် |
| :--- | :--- | :---: |
| **`.dockerignore` ထားရှိခြင်း** | `node_modules` နှင့် `.git` ဖိုင်များ context ထဲ မပါစေရန် | Build အချိန် သိသိသာသာ မြန်ဆန်ခြင်း |
| **Multi-Stage Build သုံးခြင်း** | Build tools များနှင့် Final Runtime ကို သီးခြားခွဲထုတ်ခြင်း | Image Size 70% မှ 90% အထိ ကျဆင်းခြင်း |
| **Alpine / Slim Base သုံးခြင်း** | မလိုအပ်သော Linux utilities များကို ဖယ်ရှားခြင်း | Attack Surface နည်းပါးပြီး လုံခြုံခြင်း |
| **Virtual Build Deps ရှင်းခြင်း** | Extensions compile ပြီးသည်နှင့် Build libraries များကို ချက်ချင်း ဖျက်ခြင်း | Clean Image Size |

နောက်သင်ခန်းစာ [07_docker_compose_mastery.md](/devops/02_kubernetes_and_cloud/07_docker_compose_mastery/) တွင် Container များစွာကို တစ်ပြိုင်နက် မောင်းနှင်စီမံနိုင်သည့် Docker Compose အကြောင်းကို ဆက်လက် လေ့လာပါမည်။
