---
title: "04. Storage Volumes And Bind Mounts"
description: "ယခင် အခန်း (၂) တွင် ဖော်ပြခဲ့သည့်အတိုင်း Container တစ်ခုသည် Ephemeral (ယာယီ) ဖြစ်သည်။"
---

## 💾 အခန်း (၄) - Storage: Docker Volumes & Bind Mounts

---

## ၁၀။ Docker Volumes ဆိုတာ ဘာလဲ? (Data Persistence)

### ⚠️ Ephemeral Nature ပြဿနာ
ယခင် အခန်း (၂) တွင် ဖော်ပြခဲ့သည့်အတိုင်း Container တစ်ခုသည် **Ephemeral (ယာယီ)** ဖြစ်သည်။  
ဥပမာ- သင်သည် MySQL Container တစ်ခုကို Run ပြီး Table များ၊ User စာရင်းများ ထည့်သွင်းထားသည် ဆိုပါစို့။ အကယ်၍ Container ပျက်သွားပါက သို့မဟုတ် `docker rm` လုပ်လိုက်ပါက **Database ထဲရှိ Data အားလုံးသည် ပြန်မရနိုင်တော့ဘဲ ပျောက်ဆုံးသွားပါမည်**။

ဤပြဿနာကို ဖြေရှင်းရန် Docker တွင် Storage နည်းလမ်း ၃ မျိုး ရှိပါသည်-
1. **Docker Volumes** (Docker မှ စီမံခန့်ခွဲသော Persistent Storage - **အကြံပြုချက်**)
2. **Bind Mounts** (Host Machine ၏ တိကျသော Folder ကို တိုက်ရိုက် ချိတ်ဆက်ခြင်း)
3. **tmpfs Mounts** (RAM ပေါ်တွင် ယာယီသိမ်းဆည်းခြင်း)

```
+-------------------------------------------------------------+
|                        HOST MACHINE                         |
|                                                             |
|   +--------------------------+   +----------------------+   |
|   | /var/lib/docker/volumes/ |   | /Users/user/project/ |   |
|   | (Managed by Docker)      |   | (Your Source Code)   |   |
|   +--------------------------+   +----------------------+   |
|                 |                            |              |
|        [Docker Volume]                 [Bind Mount]         |
|                 |                            |              |
|                 v                            v              |
|   +-----------------------------------------------------+   |
|   |               DOCKER CONTAINER                      |   |
|   |   /var/lib/mysql               /var/www/html        |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

---

### 📦 Named Volumes vs Anonymous Volumes

1. **Anonymous Volume (အမည်မဲ့ Volume):**
   - နာမည် မပေးဘဲ အလိုအလျောက် Random Hash ID ဖြင့် ဆောက်ပေးခြင်း ဖြစ်သည်။
   - Container ဖျက်လိုက်ပါက မည်သည့် Volume က မည်သည့် Container အတွက်ဖြစ်သည်ကို ခွဲခြားရခက်သဖြင့် ရှင်းလင်းရ ခက်စေသည်။
   - ဥပမာ: `docker run -v /var/lib/mysql mysql:8.0`

2. **Named Volume (အမည်ပေးထားသော Volume - Best Practice):**
   - မှတ်မိလွယ်သော နာမည် သတ်မှတ်ထားသဖြင့် အခြား Container အသစ်များသို့လည်း ပြန်လည် ချိတ်ဆက် အသုံးပြုနိုင်သည်။
   - ဥပမာ: `docker run -v mysql_data:/var/lib/mysql mysql:8.0`

---

### 🛠️ Hands-On: MySQL Database တွင် Volume စမ်းသပ်ခြင်း

#### အဆင့် ၁- Named Volume ဆောက်ခြင်း
```bash
docker volume create my_database_store
```

#### အဆင့် ၂- Volume ကို စစ်ဆေးကြည့်ရှုခြင်း
```bash
docker volume inspect my_database_store
```
*(Docker သည် Host OS ၏ `/var/lib/docker/volumes/...` လမ်းကြောင်းတွင် သီးသန့် နေရာချထားပေးသည်ကို တွေ့ရမည်)*

#### အဆင့် ၃- Volume ကို ချိတ်ဆက်၍ MySQL Run ခြင်း
```bash
docker run -d \
  --name db-server \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=shop_db \
  -v my_database_store:/var/lib/mysql \
  mysql:8.0
```

#### အဆင့် ၄- Container ကို ဖျက်ပစ်သော်လည်း Data မပျက်ကြောင်း သက်သေပြခြင်း
```bash
# Container ကို ရပ်ပြီး ဖျက်ပစ်လိုက်မည်
docker stop db-server
docker rm db-server

# Container အသစ်တစ်ခုကို ယခင် volume အဟောင်းဖြင့် ပြန်လည် run မည်
docker run -d \
  --name new-db-server \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v my_database_store:/var/lib/mysql \
  mysql:8.0
```
*(ယခင် ရေးသွင်းထားသော `shop_db` နှင့် Data များ အားလုံး အပြည့်အစုံ ပြန်လည် ပါရှိလာမည် ဖြစ်သည်)*

---

## ၁၁။ Bind Mounts ဆိုတာ ဘာလဲ? (Local Development အတွက် မရှိမဖြစ်)

### 📌 အဓိပ္ပာယ်ဖွင့်ဆိုချက်
**Bind Mount** ဆိုသည်မှာ သင်၏ ကွန်ပျူတာ (Host) ပေါ်ရှိ သီးခြား Directory တစ်ခု (ဥပမာ- `/Users/username/my-laravel-app`) ကို Container အတွင်းရှိ လမ်းကြောင်း (ဥပမာ- `/var/www/html`) သို့ တိုက်ရိုက် မှန်ထိုးသကဲ့သို့ (Mirror) ချိတ်ဆက်ပေးခြင်း ဖြစ်သည်။

### 🚀 Local Development တွင် အဘယ်ကြောင့် အရေးပါသနည်း? (Hot Reloading)
Bind Mount မပါပါက သင်သည် Laravel Controller ထဲတွင် Code တစ်ကြောင်း ပြင်တိုင်း Docker Image ကို အစအဆုံး အသစ် ပြန်လည် Build လုပ်နေရပါမည်။  
Bind Mount ကို အသုံးပြုလိုက်ပါက:
- သင်၏ VS Code / PhpStorm ထဲတွင် Code ရေးပြီး `Ctrl + S` (Save) လိုက်သည်နှင့် Container အတွင်းသို့ ချက်ချင်း အချိန်မဆိုင်း ရောက်ရှိသွားမည် ဖြစ်သည်။

### 💻 Bind Mount Syntax & Example
```bash
# လက်ရှိ directory ($(pwd)) ကို container ၏ /var/www/html သို့ ချိတ်ဆက်ခြင်း
docker run -d \
  --name laravel-dev \
  -p 8000:8000 \
  -v $(pwd):/var/www/html \
  my-laravel-image
```

---

### ⚖️ Volume နှင့် Bind Mount မည်သည့်အချိန်တွင် မည်သည်ကို သုံးရမည်နည်း?

| လိုအပ်ချက် | သင့်တော်သော ရွေးချယ်မှု | အကြောင်းပြချက် |
| :--- | :--- | :--- |
| **MySQL, PostgreSQL, Redis Data** | **Docker Volume** | I/O Performance ကောင်းမွန်ပြီး Docker မှ အပြည့်အဝ စီမံပေးနိုင်သောကြောင့် ဖြစ်သည်။ |
| **Laravel Source Code (Local Dev)** | **Bind Mount** | Host စက်မှ IDE ဖြင့် ဖိုင်ပြင်လိုက်သည်နှင့် ချက်ချင်း Instant Sync ဖြစ်စေရန် ဖြစ်သည်။ |
| **Production Source Code** | **Image ထဲသို့ `COPY` လုပ်ခြင်း** | Production တွင် Bind Mount မသုံးသင့်ပါ၊ Image ထဲသို့ Source code ပါ တစ်ခါတည်း သွင်းထားမှသာ Portable ဖြစ်သည်။ |

---

### 🛡️ Permissions ပြဿနာများ ဖြေရှင်းခြင်း (Linux & Mac)

Linux ပတ်ဝန်းကျင်တွင် Host စက်၏ User ID (`UID 1000`) နှင့် Container အတွင်းရှိ Nginx/PHP (`www-data: UID 33` သို့မဟုတ် `UID 82`) မတူညီပါက `storage/logs` ဖိုင်များ ရေးမရသော `Permission Denied` error ဖြစ်တတ်သည်။

**အကောင်းဆုံး ဖြေရှင်းနည်းများ:**
1. Dockerfile ထဲတွင် UID ကို Host နှင့် ကိုက်ညီအောင် သတ်မှတ်ပေးခြင်း (Docker Compose တွင် `user: "1000:1000"` ပေးနိုင်သည်)။
2. Laravel Storage folder အား ခွင့်ပြုချက် ပေးခြင်း:
   ```bash
   docker exec -it <container-name> chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
   docker exec -it <container-name> chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
   ```
