---
title: "04. Docker Storage And Volumes"
description: "1. [Container များ၏ Ephemeral သဘာဝ (Data အဘယ်ကြောင့် ပျောက်သွားသလဲ?)](#၁-container-များ၏-ephemeral-သဘာဝ)"
---

## 🐳 သင်ခန်းစာ (၄) - Docker Storage နှင့် Data Persistence (Volumes & Mounts)
### (Lesson 4: Docker Storage Types, Named Volumes, Bind Mounts & Backup Strategies)

---

## 📌 မာတိကာ (Contents)
1. [Container များ၏ Ephemeral သဘာဝ (Data အဘယ်ကြောင့် ပျောက်သွားသလဲ?)](#၁-container-များ၏-ephemeral-သဘာဝ)
2. [Docker Storage Mounting ပုံစံ ၃ မျိုး နှိုင်းယှဉ်ချက်](#၂-docker-storage-mounting-ပုံစံ-၃-မျိုး)
   - [၂.၁။ Named Volumes (Production Database အတွက် အကောင်းဆုံး)](#၂၁-named-volumes)
   - [၂.၂။ Bind Mounts (Local Development Live-Reload အတွက်)](#၂၂-bind-mounts)
   - [၂.၃။ tmpfs Mounts (Memory ပေါ်တွင် ယာယီသိမ်းခြင်း)](#၂၃-tmpfs-mounts)
3. [Volumes စီမံခန့်ခွဲသည့် CLI Commands များ](#၃-volumes-စီမံခန့်ခွဲသည့်-cli-commands-များ)
4. [လက်တွေ့ Lab: MySQL Database ကို Volume ဖြင့် Data မပျောက်ပျက်အောင် သိမ်းဆည်းခြင်း](#၄-လက်တွေ့-lab)
5. [Docker Volume Backup နှင့် Restore ပြုလုပ်ပုံနည်းလမ်း](#၅-docker-volume-backup-နှင့်-restore)
6. [Permission ပြဿနာများ (UID/GID) ဖြေရှင်းနည်း](#၆-permission-ပြဿနာများ)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Container များ၏ Ephemeral သဘာဝ

Container များသည် မူလအားဖြင့် **Stateless (Ephemeral)** ဖြစ်သည်။ ဆိုလိုသည်မှာ Container တစ်ခုကို `docker rm` ဖြင့် ဖျက်လိုက်ပါက ၎င်း Container ၏ Read-Write Layer ပေါ်တွင် ရေးသားထားသမျှ Data များ (ဥပမာ- Database Tables, Uploaded Images, Log files) အားလုံးသည် အပြီးတိုင် ပျောက်ကွယ်သွားမည် ဖြစ်သည်။

```
[ ပုံမှန် Container ]
┌────────────────────────┐
│  Writable Layer        │ ◄── Container ပျက်သွားပါက Data ပါ အပြီး ပျက်စီးသွားသည်!
├────────────────────────┤
│  Read-Only Image Layer │
└────────────────────────┘

[ Volume ဖြင့် ချိတ်ဆက်ထားသော Container ]
┌────────────────────────┐
│  Container Logic       │
└───────────┬────────────┘
            │ Writes Data to Mounted Storage
            ▼
┌────────────────────────┐
│ Docker Managed Volume  │ ◄── Container ပျက်သွားသော်လည်း Data သည် Host OS ပေါ်တွင်
│ (Persistent Storage)   │     လုံခြုံစွာ အမြဲကျန်ရှိနေသည်!
└────────────────────────┘
```

လုပ်ငန်းခွင်တွင် MySQL, PostgreSQL, Redis, MongoDB ကဲ့သို့သော Database များနှင့် File Upload များအတွက် Data Persistence (အမြဲတည်မြဲမှု) ရှိစေရန် **Docker Volumes** သို့မဟုတ် **Bind Mounts** ကို မဖြစ်မနေ အသုံးပြုရပါသည်။

---

## ၂။ Docker Storage Mounting ပုံစံ ၃ မျိုး

```
                  ┌───────────────────────────────┐
                  │       Host File System        │
                  │                               │
 ┌─────────────┐  │  /var/lib/docker/volumes/...  │  ┌─────────────┐
 │  Container  │──┼─► [ Docker Volumes ]          │  │  Container  │
 │      A      │  │   (Docker က စီမံခန့်ခွဲသည်)   │  │      B      │
 └─────────────┘  │                               │  └─────────────┘
                  │  /Users/dev/my-project/src    │
 ┌─────────────┐  │  [ Bind Mounts ]              │
 │  Container  │──┼─► (Host Directory တိုက်ရိုက်) │
 │      C      │  │                               │
 └─────────────┘  │  [ tmpfs Mount ]              │
                  │  (Host Memory / RAM သာဖြစ်သည်)│
                  └───────────────────────────────┘
```

### ၂.၁။ Named Volumes
* **ဒါက ဘာလဲ**: Host OS ၏ Docker သီးသန့် Directory (`/var/lib/docker/volumes/`) ထဲတွင် Docker Engine ကိုယ်တိုင် စီမံခန့်ခွဲသော Storage ဖြစ်သည်။
* **ဘယ်နေရာမှာ သုံးမလဲ**: **Production Database များ** (MySQL, Postgres), Application Upload Files များနှင့် Container အချင်းချင်း Data မျှဝေရန်အတွက် **အကောင်းဆုံး ရွေးချယ်မှု** ဖြစ်သည်။
* **အားသာချက်**: OS သီးခြားဖိုင်လမ်းကြောင်းများကို မှတ်ထားစရာမလိုခြင်း၊ Performance မြန်ဆန်ခြင်း၊ Backup/Migrate လုပ်ရ လွယ်ကူခြင်း။

### ၂.၂။ Bind Mounts
* **ဒါက ဘာလဲ**: Host စက်၏ မည်သည့် Directory မဆို (ဥပမာ- `/Users/username/my-php-project`) Container အတွင်းရှိ လမ်းကြောင်းဆီသို့ တိုက်ရိုက် ထိုးဖောက် ချိတ်ဆက်ပေးခြင်း ဖြစ်သည်။
* **ဘယ်နေရာမှာ သုံးမလဲ**: **Local Development ပြုလုပ်ရာတွင်** Source Code များကို ပြင်ဆင်လိုက်သည်နှင့် Container ထဲ ပြန် build စရာမလိုဘဲ ချက်ချင်း Live-Reload အကျိုးသက်ရောက်စေရန် သုံးသည်။

### ၂.၃။ tmpfs Mounts
* **ဒါက ဘာလဲ**: Disk ပေါ်တွင် မသိမ်းဘဲ Host စက်၏ **RAM (System Memory)** ပေါ်တွင်သာ ယာယီ သိမ်းဆည်းသော Storage ဖြစ်သည်။
* **ဘယ်နေရာမှာ သုံးမလဲ**: လုံခြုံရေး အလွန်မြင့်မားသော Passwords, Secret Keys များနှင့် အလွန်မြန်ဆန်သော ယာယီ Cache ဖိုင်များအတွက် သုံးသည်။ Container ရပ်သွားပါက Data ပျက်သွားသည်။

---

## ၃။ Volumes စီမံခန့်ခွဲသည့် CLI Commands များ

```bash
# Volume အသစ် ဖန်တီးခြင်း
docker volume create mysql_data

# လက်ရှိ စက်ထဲရှိ Volumes အားလုံး စာရင်းကြည့်ခြင်း
docker volume ls

# Volume ၏ Host ပေါ်ရှိ တည်နေရာနှင့် အသေးစိတ် ကြည့်ခြင်း
docker volume inspect mysql_data

# အသုံးမလိုတော့သော Volume တစ်ခုကို ဖျက်ခြင်း
docker volume rm mysql_data

# မည်သည့် Container မှ အသုံးမပြုတော့သော Volume အားလုံးကို ရှင်းလင်းခြင်း
docker volume prune -f
```

---

## ၄။ လက်တွေ့ Lab: MySQL Database ကို Volume ဖြင့် Run ခြင်း

Database Data မပျောက်ပျက်ကြောင်း သက်သေပြစမ်းသပ်ပါမည်။

### အဆင့် ၁: MySQL အတွက် Named Volume တစ်ခု တည်ဆောက်မည်
```bash
docker volume create my_db_data
```

### အဆင့် ၂: MySQL Container ကို အဆိုပါ Volume ဖြင့် ချိတ်ဆက် Run မည်
```bash
docker run -d \
  --name prod-mysql \
  -e MYSQL_ROOT_PASSWORD=secretpassword \
  -e MYSQL_DATABASE=shop_db \
  -v my_db_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

> **Syntax ရှင်းလင်းချက်**:  
> `-v my_db_data:/var/lib/mysql`  
> Host ပေါ်ရှိ `my_db_data` volume အား Container အတွင်းရှိ MySQL ၏ Data သိမ်းဆည်းရာ `/var/lib/mysql` လမ်းကြောင်းသို့ mount ချိတ်လိုက်ခြင်း ဖြစ်သည်။

### အဆင့် ၃: Container ထဲဝင်၍ စမ်းသပ် Data သွင်းမည်
```bash
docker exec -it prod-mysql mysql -u root -psecretpassword -e "USE shop_db; CREATE TABLE users (id INT, name VARCHAR(50)); INSERT INTO users VALUES (1, 'Ko Aung');"
```

### အဆင့် ၄: Container ကို အပြီးတိုင် ဖျက်ပစ်မည်
```bash
docker stop prod-mysql
docker rm prod-mysql
```
ယခုအခါ Container အပြီး ပျက်စီးသွားပြီ ဖြစ်သည်။

### အဆင့် ၅: Container အသစ်တစ်ခုကို ယခင် Volume အဟောင်းဖြင့် ပြန်လည် Run မည်
```bash
docker run -d \
  --name prod-mysql-new \
  -e MYSQL_ROOT_PASSWORD=secretpassword \
  -v my_db_data:/var/lib/mysql \
  mysql:8.0
```

### အဆင့် ၆: ယခင် Data ကျန်ရှိနေသေးခြင်းကို စစ်ဆေးမည်
```bash
docker exec -it prod-mysql-new mysql -u root -psecretpassword -e "USE shop_db; SELECT * FROM users;"
```
Output အနေဖြင့် `1 | Ko Aung` ကို အောင်မြင်စွာ တွေ့မြင်ရမည်။ Container အသစ်ဖြစ်သော်လည်း Data လုံးဝ မပျောက်ပျက်ပါ။

---

## ၅။ Docker Volume Backup နှင့် Restore ပြုလုပ်ပုံနည်းလမ်း

Production Volume များကို Backup လုပ်လိုပါက ယာယီ Container အသေးလေးတစ်ခု သုံးပြီး `.tar.gz` အဖြစ် Host စက်ထဲသို့ ထုတ်ယူလေ့ရှိပါသည်:

```bash
# Backup ပြုလုပ်ခြင်း (Volume ထဲမှ Data ကို backup.tar.gz အဖြစ် ထုတ်ယူခြင်း)
docker run --rm \
  -v my_db_data:/data \
  -v $(pwd):/backup \
  alpine tar -czvf /backup/mysql_backup.tar.gz -C /data .

# Restore ပြုလုပ်ခြင်း (backup.tar.gz ကို Volume အသစ်ထဲသို့ ပြန်လည် ဖြည်ထည့်ခြင်း)
docker run --rm \
  -v my_new_db_data:/data \
  -v $(pwd):/backup \
  alpine tar -xzvf /backup/mysql_backup.tar.gz -C /data
```

---

## ၆။ Permission ပြဿနာများ (UID/GID) ဖြေရှင်းနည်း

Bind Mount ဖြင့် Development လုပ်သည့်အခါ Host OS (macOS/Linux) ၏ User နှင့် Container အတွင်းရှိ User (ဥပမာ- PHP ၏ `www-data`) တို့ User ID မကိုက်ညီသဖြင့် "Permission Denied" Error တက်တတ်သည်။

### ဖြေရှင်းနည်း:
1. Dockerfile တွင် `www-data` အား Host User ၏ UID (ဥပမာ- 1000) နှင့် ကိုက်ညီအောင် ပြင်ဆင်ခြင်း။
2. သို့မဟုတ် `docker run` အခါ `--user 1000:1000` ဟု သတ်မှတ်ပေးခြင်း။
3. Laravel Application များအတွက်:
   ```bash
   docker exec -it my-app chown -R www-data:www-data storage bootstrap/cache
   ```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ (Scenario) | အသုံးပြုသင့်သော Storage ပုံစံ |
| :--- | :--- |
| **MySQL / Postgres / Redis Production Data** | `Named Volume` (`-v my_vol:/path`) |
| **Local Source Code Live Edit (Hot-Reload)** | `Bind Mount` (`-v $(pwd):/var/www/html`) |
| **Temporary Secret Token / In-Memory Session** | `tmpfs Mount` (`--tmpfs /tmp`) |
| **Scheduled Database Backup** | Temporary Container + `tar` archiving |

နောက်သင်ခန်းစာ [05_docker_networking.md](/devops/02_kubernetes_and_cloud/05_docker_networking/) တွင် Container အချင်းချင်း တစ်ခုနှင့်တစ်ခု အမည်ဖြင့် ခေါ်ဆိုဆက်သွယ်နိုင်သည့် Docker Networking စနစ်ကို ဆက်လက်လေ့လာပါမည်။
