---
title: Phase 7 Lesson 16 — Docker, DevOps Containers & Cloud VMs
description: Virtual Machines vs Docker Containers, Docker Engine on Ubuntu, Volumes, Networks, Docker Compose Multi-container Stack, Restart Policies နှင့် Cloud VM (AWS EC2) (မြန်မာဘာသာ)
---

# 🐳 Phase 7 — Lesson 16: Docker, DevOps Containers & Cloud VMs

ခေတ်သစ် Cloud & DevOps လောကတွင် Application များကို Server ပေါ်တွင် တိုက်ရိုက် Bare-metal install လုပ်မည့်အစား **Docker Containers (ကွန်တိန်နာများ)** ဖြင့် ထုပ်ပိုးကာ သီးခြားခွဲထုတ်၍ Run လေ့ရှိပါသည်။

ဤအခန်းတွင် **Virtual Machines (VM) vs Docker Containers** ကွာခြားချက်၊ **Docker Engine on Linux**, **Volumes & Networks**, **Docker Compose** နှင့် Cloud Server ပေါ်တွင် Auto-restart မူဝါဒများကို လေ့လာသွားပါမည်။

---

## 💡 ၁။ Virtual Machines (VM) vs Docker Containers

```
        VIRTUAL MACHINES (VMs)                      DOCKER CONTAINERS
┌─────────────────┐ ┌─────────────────┐     ┌─────────────────┐ ┌─────────────────┐
│  App A + Libs   │ │  App B + Libs   │     │  App A + Libs   │ │  App B + Libs   │
├─────────────────┤ ├─────────────────┤     ├─────────────────┴─┴─────────────────┤
│ Guest OS (2-5GB)│ │ Guest OS (2-5GB)│     │      Docker Engine Daemon           │
├─────────────────┴─┴─────────────────┤     ├─────────────────────────────────────┤
│      Hypervisor (Type 1 or 2)       │     │     Host Linux Kernel (Shared!)     │
├─────────────────────────────────────┤     ├─────────────────────────────────────┤
│         Host Hardware               │     │         Host Hardware               │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
```

* **Virtual Machine (VM)**: စက်တစ်လုံးစီတိုင်းတွင် ကိုယ်ပိုင် Guest OS အပြည့်အစုံ (Linux/Windows) ပါရှိသဖြင့် Boot တက်ရန် မိနစ်ပိုင်းကြာပြီး RAM နေရာယူမှု ကြီးမားသည်။
* **Docker Container**: Host Linux Kernel ကို အတူတကွ မျှဝေသုံးစွဲပြီး **Namespaces & Cgroups** ဖြင့် Process သီးသန့် အခန်းခွဲထုတ်ထားခြင်းသာ ဖြစ်သည်။ ထို့ကြောင့် စက္ကန့်ပိုင်းအတွင်း ချက်ချင်းပွင့်ပြီး RAM အနည်းငယ်သာ ကုန်ကျသည်။

---

## ⌨️ ၂။ Essential Docker Commands on Linux

```bash
# ၁။ Ubuntu ပေါ်တွင် Docker Engine သွင်းပါ
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER   # Sudo မလိုဘဲ docker သုံးနိုင်ရန်

# ၂။ Container တစ်ခု စတင် run ခြင်း
docker run -d --name my-nginx -p 80:80 --restart unless-stopped nginx:alpine

# ၃။ Running Containers စာရင်း စစ်ဆေးခြင်း
docker ps

# ၄။ Container ၏ Live Logs စစ်ဆေးခြင်း
docker logs -f my-nginx

# ၅။ Container အတွင်းသို့ Shell ဖြင့် ဝင်ရောက်ခြင်း
docker exec -it my-nginx sh

# ၆။ Container နှင့် Volume အမှိုက်များ ရှင်းလင်းခြင်း
docker system prune -af --volumes
```

---

## 🏗️ ၃။ Production Docker Compose Multi-Container Stack

Backend API, Nginx နှင့် MySQL Database တို့ကို တစ်ပြိုင်နက်တည်း ချိတ်ဆက်မောင်းနှင်ရန် `docker-compose.yml` ကို အသုံးပြုပါသည်:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: prod_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootSecretPassword!
      MYSQL_DATABASE: app_db
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - internal_net

  backend:
    build: ./backend
    container_name: prod_api
    restart: always
    environment:
      DB_HOST: db
      PORT: 8080
    depends_on:
      - db
    networks:
      - internal_net

  web:
    image: nginx:alpine
    container_name: prod_web
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend
    networks:
      - internal_net

volumes:
  db_data:

networks:
  internal_net:
    driver: bridge
```

### Stack စတင်ခြင်း:
```bash
docker compose up -d
```
* **`restart: always`**: Server စက် reboot ကျသွားပါက Docker Daemon က Container များကို အလိုအလျောက် ပြန်လည် နိုးထပေးပါမည်။
* **Named Volume (`db_data`)**: Container ပျက်စီးသွားသော်လည်း Database အချက်အလက်များ မပျောက်ပျက်အောင် Host Disk ပေါ်တွင် အမြဲသိမ်းဆည်းပေးသည်။

---

## 🏋️ ၄။ Hands-on Practice

1. Ubuntu VM တွင် `sudo apt install -y docker.io` သွင်းပါ။
2. `sudo docker run -d --name test-web -p 8080:80 nginx:alpine` ဖြင့် container run ပါ။
3. `curl http://localhost:8080` ဖြင့် Nginx response ရ/မရ စစ်ဆေးပါ။
4. `sudo docker stop test-web && sudo docker rm test-web` ဖြင့် ပြန်လည်ရှင်းလင်းပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: Virtual Machine နှင့် Docker Container တို့၏ အဓိက ကွာခြားချက်မှာ အဘယ်နည်း? Container သည် အဘယ်ကြောင့် ပိုမိုပေါ့ပါးမြန်ဆန်သနည်း?
2. **မေးခွန်း ၂**: Container တစ်ခု ပျက်စီးသွားသော်လည်း Database Data များ ဆုံးရှုံးမသွားစေရန် Docker တွင် မည်သည့် Feature ကို အသုံးပြုရမည်နည်း?
3. **မေးခွန်း ၃**: Server Reboot ကျပြီးနောက် Container များ အလိုအလျောက် ပြန်ပွင့်လာစေရန် မည်သည့် Restart Policy ကို သတ်မှတ်ရမည်နည်း?
