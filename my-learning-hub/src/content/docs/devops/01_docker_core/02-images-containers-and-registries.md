---
title: "02. Images Containers And Registries"
description: "- Docker Image ဆိုသည်မှာ အိမ်တစ်လုံး ဆောက်လုပ်ရန် ရေးဆွဲထားသော ဗိသုကာ ပုံစံကြမ်း (Blueprint) နှင့် တူပါသည်။"
---

## 📦 အခန်း (၂) - Images, Containers & Registries

---

## ၅။ Docker Images ဆိုတာ ဘာလဲ? (Deep Dive into Images)

### 📌 ရိုးရှင်းသော ဥပမာ- Blueprint နှင့် အိမ်
- **Docker Image** ဆိုသည်မှာ အိမ်တစ်လုံး ဆောက်လုပ်ရန် ရေးဆွဲထားသော **ဗိသုကာ ပုံစံကြမ်း (Blueprint)** နှင့် တူပါသည်။
- **Docker Container** ဆိုသည်မှာ ထိုပုံစံကြမ်း (Image) အတိုင်း အမှန်တကယ် မြေပြင်တွင် ဆောက်လုပ်လိုက်သော **အိမ်အစစ်** ဖြစ်ပါသည်။
- ပုံစံကြမ်း (Image) တစ်ခုတည်းမှနေ၍ အိမ် (Container) ပေါင်း ရာနှင့်ချီ၍ တစ်ထေရာတည်း တူအောင် ဆောက်လုပ်နိုင်ပါသည်။

```
+-------------------------------------------------------------+
|                Docker Image (Read-Only Template)            |
|  - Alpine Linux OS Base                                     |
|  - PHP 8.3 Binaries                                         |
|  - Laravel Project Code                                     |
+-------------------------------------------------------------+
               |                       |
               v                       v
+-----------------------------+ +-----------------------------+
|   Container 1 (Port 8001)   | |   Container 2 (Port 8002)   |
|   (Live Running Instance)   | |   (Live Running Instance)   |
+-----------------------------+ +-----------------------------+
```

---

### 🧱 Docker Image Layers နှင့် Union File System (UnionFS)

Docker Image သည် File ကြီး တစ်ခုတည်း မဟုတ်ပါ။ **အလွှာများ (Layers)** ဆင့်ကာဆင့်ကာ တည်ဆောက်ထားခြင်း ဖြစ်ပြီး **Read-Only (ဖတ်ရှုရန်သာရပြီး ပြင်ဆင်၍ မရသော)** သဘောသဘာဝ ရှိသည်။

```
+-------------------------------------------------------------+
| Layer 4: COPY . /var/www/html (Laravel Code)     ~ 15 MB    |
+-------------------------------------------------------------+
| Layer 3: RUN composer install (Vendor Libraries) ~ 35 MB    |
+-------------------------------------------------------------+
| Layer 2: RUN docker-php-ext-install pdo_mysql    ~ 10 MB    |
+-------------------------------------------------------------+
| Layer 1: FROM php:8.3-fpm-alpine (Base OS + PHP) ~ 80 MB    |
+-------------------------------------------------------------+
```

#### အဘယ်ကြောင့် Layer စနစ်ကို သုံးရသနည်း?
1. **နေရာချွေတာနိုင်ခြင်း (Storage Efficiency):** သင့်စက်ထဲတွင် Laravel App ၅ ခု run ထားပြီး အားလုံးသည် `php:8.3-fpm-alpine` ကို အခြေခံထားပါက အဆိုပါ 80MB ရှိသော Base Layer ကို တစ်ကြိမ်သာ ဒေါင်းလုဒ်ဆွဲ သိမ်းဆည်းပြီး App ၅ ခုစလုံးက မျှဝေသုံးစွဲကြသည်။
2. **Build မြန်ဆန်ခြင်း (Layer Caching):** သင်သည် Laravel Source Code တစ်ကြောင်းသာ ပြင်ဆင်ခဲ့ပါက အပေါ်ဆုံး Layer 4 သာ ပြန် rebuild ဖြစ်မည်ဖြစ်ပြီး၊ အောက်က PHP extension နှင့် composer library layers များသည် Cache ထဲမှ ချက်ချင်း ပြန်သုံးသဖြင့် စက္ကန့်ပိုင်းအတွင်း Build ပြီးစီးသွားသည်။

---

### 🏷️ Image Tags နှင့် Digests အကြောင်း

Image တစ်ခုကို ခေါ်ယူရာတွင် `NAME:TAG` ပုံစံဖြင့် ခေါ်သည်။
ဥပမာ-
- `php:latest` -> နောက်ဆုံးထွက် version ကို ရည်ညွှန်းသည်။ (Production တွင် latest ကို ဘယ်တော့မှ မသုံးသင့်ပါ၊ update ဖြစ်သွားပါက code error တက်နိုင်သည်)
- `php:8.3-fpm` -> Debian base ပေါ်တွင် PHP 8.3 fpm တင်ထားသည်။
- `php:8.3-fpm-alpine` -> အလွန်ပေါ့ပါးသော Alpine Linux ပေါ်တွင် တင်ထားသည်။
- **Digest (SHA256):** Image ၏ မပြောင်းလဲနိုင်သော Unique Hash Code ဖြစ်သည်။ (ဥပမာ- `php@sha256:abcd1234...`)။ Security အလွန်မြင့်မားသော Production များတွင် Digest ကို သုံးကြသည်။

---

## ၆။ Docker Containers ဆိုတာ ဘာလဲ? (Container Internals)

Container ဆိုသည်မှာ Docker Image (Read-Only) ၏ အပေါ်ဆုံးတွင် **Writable Container Layer (ရေးသားပြင်ဆင်နိုင်သော အလွှာ)** တစ်ခု ထပ်တင်ပြီး သီးခြား Isolated Process အနေဖြင့် Run ထားခြင်း ဖြစ်သည်။

```
+-------------------------------------------------------------+
| [TOP] Container Layer (Read-Write) <-- ဖိုင်အသစ်ရေးခြင်း/ပြင်ခြင်း |
+-------------------------------------------------------------+
| Layer 4: Laravel Source Code (Read-Only)                    |
+-------------------------------------------------------------+
| Layer 3: Dependencies (Read-Only)                           |
+-------------------------------------------------------------+
| Layer 2: PHP Extensions (Read-Only)                         |
+-------------------------------------------------------------+
| Layer 1: Base Alpine Image (Read-Only)                      |
+-------------------------------------------------------------+
```

### 🔄 Copy-on-Write (CoW) မဟာဗျူဟာ
Container ထဲတွင် ဖိုင်တစ်ခုခုကို ပြင်ဆင်လိုက်သည့်အခါ (ဥပမာ- log file ရေးခြင်း သို့မဟုတ် config ပြင်ခြင်း) မူလ Image ထဲက ဖိုင်သည် ပျက်မသွားပါ။ Docker သည် ထိုဖိုင်ကို အောက်လွှာ (Read-Only Image) မှ အပေါ်ဆုံး (Writable Container Layer) သို့ ကူးယူလိုက်ပြီးမှ ပြင်ဆင်ခွင့်ပြုသည်။ ဤစနစ်ကို **Copy-on-Write** ဟု ခေါ်သည်။

### ⚠️ Containers are Ephemeral (ယာယီသာဖြစ်ခြင်း)
**Container တစ်ခု ပျက်သွားပါက (သို့မဟုတ် rm လုပ်လိုက်ပါက) ထို Container Layer ထဲတွင် သိမ်းထားသော Data အားလုံးသည် ထာဝရ ပျောက်ကွယ်သွားမည် ဖြစ်သည်။**
ထို့ကြောင့် Database Data များနှင့် File Upload များကို Container အပြင်ဘက် Host စက်တွင် အမြဲတည်ရှိနေစေရန် **Docker Volumes** သို့မဟုတ် **Bind Mounts** များကို အသုံးပြုရခြင်း ဖြစ်သည်။ (အခန်း ၄ တွင် ဆက်လက်သင်ကြားမည်)။

---

## ၇။ Docker Hub နှင့် Container Registries

### 🌐 Container Registry ဆိုတာ ဘာလဲ?
Developer များ Source Code များကို GitHub တွင် သိမ်းဆည်းသကဲ့သို့ Docker Image များကို ကမ္ဘာအနှံ့ မျှဝေသိမ်းဆည်းရန် **Container Registry** ကို အသုံးပြုသည်။

1. **Docker Hub (hub.docker.com):**
   - Docker ၏ တရားဝင် Public Registry ဖြစ်သည်။
   - Nginx, MySQL, PHP, Redis, Node, Ubuntu စသည့် **Official Images** များကို ရှာဖွေရယူနိုင်သည်။
2. **Private Registries:**
   - ကုမ္ပဏီပိုင် Code များ မပေါက်ကြားစေရန် အသုံးပြုသော သီးသန့် Registry များ (ဥပမာ- AWS ECR, Google Artifact Registry, GitHub Packages `ghcr.io`, GitLab Registry)။

---

### 🚀 လက်တွေ့ စမ်းသပ်လေ့ကျင့်ခန်း (Hands-On Lab)

Terminal ကိုဖွင့်၍ အောက်ပါ command များကို အဆင့်ဆင့် စမ်းသပ်ကြည့်ပါ-

#### အဆင့် ၁- Docker Hub မှ Nginx Image ဆွဲယူခြင်း
```bash
docker pull nginx:alpine
```

#### အဆင့် ၂- ဒေါင်းထားသော Image စာရင်း စစ်ဆေးခြင်း
```bash
docker images
```

#### အဆင့် ၃- Image မှ Container တစ်ခု စတင် Run ခြင်း
```bash
docker run -d --name my-test-nginx -p 8080:80 nginx:alpine
```
- `-d` : Background တွင် run မည်။
- `--name my-test-nginx` : Container ကို နာမည်ပေးခြင်း။
- `-p 8080:80` : မိမိစက်၏ Port 8080 ကို Nginx ၏ Port 80 သို့ လမ်းကြောင်းလွှဲခြင်း။

#### အဆင့် ၄- Browser တွင် စမ်းသပ်ကြည့်ရှုခြင်း
Browser တွင် `http://localhost:8080` ဟု ရိုက်ဖွင့်ကြည့်ပါက "Welcome to nginx!" စာမျက်နှာကို ချက်ချင်း မြင်တွေ့ရမည် ဖြစ်သည်။

#### အဆင့် ၅- Container အား ရပ်တန့်ပြီး ဖျက်ပစ်ခြင်း
```bash
# Container ကို ရပ်တန့်ခြင်း
docker stop my-test-nginx

# Container ကို စက်ထဲမှ ဖျက်ပစ်ခြင်း
docker rm my-test-nginx
```
