---
title: "02. Docker Cli Essentials"
description: "1. [Docker CLI Syntax နှင့် အခြေခံသဘောတရား](#၁-docker-cli-syntax-နှင့်-အခြေခံသဘောတရား)"
---

## 🐳 သင်ခန်းစာ (၂) - လုပ်ငန်းခွင်သုံး မဖြစ်မနေသိထားရမည့် Docker CLI Commands များ
### (Lesson 2: Essential Docker CLI & Container Lifecycle Management)

---

## 📌 မာတိကာ (Contents)
1. [Docker CLI Syntax နှင့် အခြေခံသဘောတရား](#၁-docker-cli-syntax-နှင့်-အခြေခံသဘောတရား)
2. [Container Lifecycle စီမံခန့်ခွဲခြင်း (Run, Start, Stop, Kill, Remove)](#၂-container-lifecycle-စီမံခန့်ခွဲခြင်း)
3. [`docker run` ၏ အရေးကြီးဆုံး Flags များ (`-d`, `-p`, `--name`, `-e`, `-v`, `--rm`)](#၃-docker-run-၏-အရေးကြီးဆုံး-flags-များ)
4. [Container အတွင်းသို့ ဝင်ရောက်ခြင်း (`docker exec -it`)](#၄-container-အတွင်းသို့-ဝင်ရောက်ခြင်း)
5. [Logs စစ်ဆေးခြင်းနှင့် Monitoring (`docker logs`, `stats`, `inspect`)](#၅-logs-စစ်ဆေးခြင်းနှင့်-monitoring)
6. [Disk နေရာလွတ်ရှင်းလင်းခြင်း (Prune & Cleanup)](#၆-disk-နေရာလွတ်ရှင်းလင်းခြင်း)
7. [လက်တွေ့ Lab: Nginx Web Server ကို Port Mapping ဖြင့် Run ပြုလုပ်ခြင်း](#၇-လက်တွေ့-lab)
8. [လုပ်ငန်းခွင်သုံး Cheatsheet ဇယား](#၈-လုပ်ငန်းခွင်သုံး-cheatsheet-ဇယား)

---

## ၁။ Docker CLI Syntax နှင့် အခြေခံသဘောတရား

ခေတ်သစ် Docker CLI တွင် Command များကို စနစ်တကျ အမျိုးအစားခွဲခြားထားသည့် **Management Commands** ပုံစံဖြင့် ရေးသားနိုင်သလို ရိုးရိုး Short syntax ဖြင့်လည်း ရေးနိုင်ပါသည်:

```bash
# ခေတ်သစ် စံသတ်မှတ်ချက် (Management Commands)
docker container run ...
docker image ls
docker volume create ...
docker network ls

# အရင်သုံးနေကျ Short Syntax (လုပ်ငန်းခွင်တွင် အသုံးများဆဲဖြစ်သည်)
docker run ...
docker images
docker ps
```

---

## ၂။ Container Lifecycle စီမံခန့်ခွဲခြင်း

Container တစ်ခု၏ ဘဝစက်ဝန်း (Lifecycle) ကို နားလည်ထားရန် အလွန်အရေးကြီးပါသည်။

```
              docker run
         ┌──────────────────┐
         │                  │
         ▼                  │
   ┌───────────┐      ┌─────┴─────┐      ┌───────────┐
   │  Created  ├─────►│  Running  ├─────►│  Paused   │
   └───────────┘      └─────┬─────┘      └─────┬─────┘
                            │ docker stop      │ docker unpause
                            ▼                  ▼
                      ┌───────────┐      ┌───────────┐
                      │  Stopped  │◄─────┤  Stopped  │
                      └─────┬─────┘      └───────────┘
                            │ docker rm
                            ▼
                      ┌───────────┐
                      │ Destroyed │
                      └───────────┘
```

### အဓိက Commands များ:
* **အလုပ်လုပ်နေသော Container များကို ကြည့်ခြင်း**:
  ```bash
  docker ps
  ```
* **ရပ်တန့်သွားသော အပါအဝင် အားလုံးကို ကြည့်ခြင်း**:
  ```bash
  docker ps -a
  ```
* **Container တစ်ခုကို ပုံမှန် ရပ်တန့်ခြင်း (Graceful Shutdown - SIGTERM)**:
  ```bash
  docker stop <container_name_or_id>
  ```
* **Container တစ်ခုကို ချက်ချင်း အတင်းရပ်တန့်ခြင်း (Force Kill - SIGKILL)**:
  ```bash
  docker kill <container_name_or_id>
  ```
* **Stopped Container ကို ပြန်လည် Start ပြုလုပ်ခြင်း**:
  ```bash
  docker start <container_name_or_id>
  ```
* **Container ကို ဖျက်ပစ်ခြင်း**:
  ```bash
  docker rm <container_name_or_id>
  # အကယ်၍ Container သည် Run နေဆဲဆိုပါက -f (force) ဖြင့် ဖျက်နိုင်သည်
  docker rm -f <container_name_or_id>
  ```

---

## ၃။ `docker run` ၏ အရေးကြီးဆုံး Flags များ

`docker run` သည် Docker တွင် အသုံးအများဆုံးနှင့် အစွမ်းထက်ဆုံး Command ဖြစ်ပြီး အောက်ပါ Flags များကို အမြဲ တွဲသုံးရပါသည်:

```bash
docker run -d --name my-nginx -p 8080:80 -e APP_ENV=production --restart unless-stopped nginx:alpine
```

### အသေးစိတ် Flags ရှင်းလင်းချက်:
1. **`-d` (Detached Mode)**:
   * Container ကို Background တွင် အလုပ်လုပ်စေသည်။ မပါလျှင် Terminal ပေါ်တွင် Log များ တန်းစီပြပြီး Terminal ပိတ်လိုက်ပါက Container ရပ်သွားမည်။
2. **`--name <name>`**:
   * Container အား လူဖတ်ရလွယ်သော နာမည်ပေးခြင်း (ဥပမာ- `my-nginx`)။ မပေးလျှင် Docker က `suspicious_einstein` စသဖြင့် random နာမည် ပေးသွားမည်။
3. **`-p <Host_Port>:<Container_Port>` (Port Forwarding / Mapping)**:
   * အရေးကြီးဆုံး flag ဖြစ်သည်။ Local Computer ၏ Port `8080` သို့ လာသမျှ Traffic ကို Container အတွင်းရှိ Nginx ၏ Port `80` သို့ လွှဲပေးခြင်း ဖြစ်သည်။
4. **`-e <KEY=VALUE>` (Environment Variables)**:
   * Database Password သို့မဟုတ် App Environment setting များကို Container ထဲသို့ လှမ်းပို့ခြင်း။
5. **`--rm`**:
   * Container အလုပ်ပြီးဆုံး၍ ရပ်တန့်သွားသည်နှင့် Container ကို အလိုအလျောက် အပြီးဖျက်ပစ်ခိုင်းခြင်း (Test စမ်းသပ်သည့်အခါ အသုံးဝင်သည်)။
6. **`--restart <policy>`**:
   * Server Restart ကျသွားသည့်အခါ သို့မဟုတ် Crash ဖြစ်သွားသည့်အခါ အလိုအလျောက် ပြန် run စေမည့် မူဝါဒ။ (`always`, `unless-stopped`, `on-failure`)။

---

## ၄။ Container အတွင်းသို့ ဝင်ရောက်ခြင်း (`docker exec -it`)

လုပ်ငန်းခွင်တွင် Container အတွင်းရှိ ဖိုင်များကို စစ်ဆေးရန်၊ PHP Artisan command သို့မဟုတ် MySQL Shell ကို ခေါ်ရန် Container ထဲသို့ တိုက်ရိုက် ဝင်ရောက်လေ့ရှိသည်။

```bash
docker exec -it <container_name> sh
# သို့မဟုတ် bash ပါဝင်ပါက
docker exec -it <container_name> bash
```

* **`-i` (Interactive)**: Container ၏ Standard Input (STDIN) ကို ဖွင့်ထားပေးသည်။
* **`-t` (TTY)**: Terminal မျက်နှာပြင်တစ်ခု (Pseudoterminal) ခွဲထုတ်ပေးသည်။
* အကယ်၍ Container အထဲသို့ မဝင်ဘဲ Command တစ်ခုတည်းကို အပြင်မှ လှမ်း run လိုပါက:
  ```bash
  docker exec -it my-laravel-app php artisan migrate
  docker exec -it my-laravel-app php artisan config:cache
  ```

---

## ၅။ Logs စစ်ဆေးခြင်းနှင့် Monitoring

Production ပေါ်တွင် Error ရှာဖွေရာ၌ (Troubleshooting) အဓိက အသက်သွေးကြောဖြစ်သည်:

### (က) Log စစ်ဆေးခြင်း:
```bash
# Container ၏ နောက်ဆုံး log များကို ကြည့်ခြင်း
docker logs my-nginx

# Live အချိန်နှင့်တပြေးညီ တက်လာသော Logs များကို စောင့်ကြည့်ခြင်း (-f = follow)
docker logs -f my-nginx

# နောက်ဆုံး လိုင်း ၁၀၀ ကိုသာ ကြည့်ပြီး စောင့်ကြည့်ခြင်း
docker logs -f --tail 100 my-nginx
```

### (ခ) Real-time Resource Usage စစ်ဆေးခြင်း:
```bash
docker stats
```
Container တစ်ခုချင်းစီ၏ CPU %, Memory Usage / Limit, Network I/O, Block I/O များကို Live တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။

### (ဂ) Container ၏ အသေးစိတ် Configuration JSON ကြည့်ခြင်း:
```bash
docker inspect my-nginx
```
Container ၏ IP address, Mount path များ၊ State များကို JSON Format ဖြင့် အသေးစိတ် မြင်တွေ့ရမည်။

---

## ၆။ Disk နေရာလွတ်ရှင်းလင်းခြင်း (Prune & Cleanup)

Docker ကို ကြာကြာသုံးလာသည့်အခါ မလိုအပ်တော့သော Dangling Images များ၊ ရပ်တန့်နေသော Container များကြောင့် Hard Disk ပြည့်သွားတတ်သည်။

```bash
# ရပ်တန့်နေသော Container များ အားလုံးကို ဖျက်ခြင်း
docker container prune -f

# အသုံးမပြုတော့သော Images များကို ဖျက်ခြင်း
docker image prune -a -f

# Docker တစ်ခုလုံးရှိ မသုံးသော Container, Image, Volume, Network အားလုံးကို ရှင်းထုတ်ပစ်ခြင်း
docker system prune -a --volumes -f
```

> [!WARNING]
> `--volumes` flag ပါဝင်ပါက Database data သိမ်းထားသော Volumes များပါ ပျက်စီးသွားနိုင်သဖြင့် Production Server များတွင် သတိပြု၍ run ပါ။

---

## ၇။ လက်တွေ့ Lab: Nginx Web Server ကို Port Mapping ဖြင့် Run ပြုလုပ်ခြင်း

### အဆင့် ၁: Nginx Web Server ကို Background တွင် Run မည်
```bash
docker run -d --name demo-web -p 8080:80 nginx:alpine
```

### အဆင့် ၂: Browser သို့မဟုတ် Curl ဖြင့် စစ်ဆေးမည်
```bash
curl http://localhost:8080
```
HTML မျက်နှာပြင်တွင် "Welcome to nginx!" ဟူသော စာမျက်နှာကို တွေ့ရမည်။

### အဆင့် ၃: Container ထဲသို့ ဝင်၍ Default HTML ဖိုင်ကို ပြင်ဆင်မည်
```bash
docker exec -it demo-web sh
```
Container အတွင်းရောက်သွားပါက အောက်ပါ command ဖြင့် HTML ဖိုင်ကို အသစ်အစားထိုးပါ:
```sh
echo "<h1>Hello from Myanmar Docker Class!</h1>" > /usr/share/nginx/html/index.html
exit
```

### အဆင့် ၄: Browser တွင် `http://localhost:8080` ကို Refresh လုပ်ကြည့်ပါ
ချက်ချင်း ပြောင်းလဲသွားသည်ကို မြင်တွေ့ရမည် ဖြစ်ပါသည်။

### အဆင့် ၅: စမ်းသပ်မှုပြီးပါက Container ကို ဖျက်ပစ်ပါ
```bash
docker stop demo-web
docker rm demo-web
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Cheatsheet ဇယား

| လိုလားချက် (Goal) | Docker Command |
| :--- | :--- |
| Image ကို Registry မှ ဆွဲယူရန် | `docker pull <image_name>:<tag>` |
| Container ကို Background တွင် Port ချိန်ညှိ run ရန် | `docker run -d -p 80:80 --name <app> <image>` |
| Active Containers စာရင်းကြည့်ရန် | `docker ps` |
| Container အတွင်း Shell ဝင်ရောက်ရန် | `docker exec -it <container> sh` |
| Real-time Logs စောင့်ကြည့်ရန် | `docker logs -f --tail 50 <container>` |
| CPU / Memory Monitoring ကြည့်ရန် | `docker stats` |
| Container ကို ရပ်ရန်နှင့် ဖျက်ရန် | `docker stop <id> && docker rm <id>` |
| မသုံးတော့သော Cache အားလုံးရှင်းရန် | `docker system prune -f` |

နောက်သင်ခန်းစာ [03_dockerfile_deep_dive.md](/devops/02_kubernetes_and_cloud/03_dockerfile_deep_dive/) တွင် ကိုယ်ပိုင် Custom Docker Image များ တည်ဆောက်ရန် Dockerfile ညွှန်ကြားချက်များ (Instructions) ကို အသေးစိတ် ဆက်လက်လေ့လာပါမည်။
