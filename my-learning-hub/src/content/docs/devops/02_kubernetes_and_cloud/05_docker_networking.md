---
title: "05. Docker Networking"
description: "1. [Container Networking ဆိုတာဘာလဲ? ဘာကြောင့် လိုအပ်သလဲ?](#၁-container-networking-ဆိုတာဘာလဲ)"
---

## 🐳 သင်ခန်းစာ (၅) - Docker Networking နှင့် Service Discovery
### (Lesson 5: Docker Network Drivers, Embedded DNS & Container Communication)

---

## 📌 မာတိကာ (Contents)
1. [Container Networking ဆိုတာဘာလဲ? ဘာကြောင့် လိုအပ်သလဲ?](#၁-container-networking-ဆိုတာဘာလဲ)
2. [Docker Network Drivers ၄ မျိုး နှိုင်းယှဉ်ချက် (Bridge, Host, Overlay, None)](#၂-docker-network-drivers-၄-မျိုး)
3. [Default Bridge vs User-Defined Custom Bridge (အရေးကြီးသော ကွာခြားချက်)](#၃-default-bridge-vs-user-defined-custom-bridge)
4. [Docker Embedded DNS Server အလုပ်လုပ်ပုံ (Automatic Service Discovery)](#၄-docker-embedded-dns-server-အလုပ်လုပ်ပုံ)
5. [Network စီမံခန့်ခွဲသည့် CLI Commands များ](#၅-network-စီမံခန့်ခွဲသည့်-cli-commands-များ)
6. [လက်တွေ့ Lab: Custom Network တည်ဆောက်ပြီး Web App နှင့် MySQL ချိတ်ဆက်ခြင်း](#၆-လက်တွေ့-lab)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Container Networking ဆိုတာဘာလဲ?

လုပ်ငန်းခွင်တွင် Application တစ်ခုသည် အစိတ်အပိုင်းတစ်ခုတည်း မဟုတ်ဘဲ Frontend (React/Vue/Nginx), Backend API (Laravel/Node), Database (MySQL/PostgreSQL) နှင့် Cache (Redis) စသည်ဖြင့် သီးခြား Container များ ခွဲထုတ်တည်ဆောက်ထားကြသည်။

ဤ Container များ တစ်ခုနှင့်တစ်ခု လုံခြုံစွာ စကားပြောဆက်သွယ်နိုင်စေရန် Docker Engine တွင် **Software-Defined Networking (SDN)** ပါဝင်ပြီး၊ Container တစ်ခုချင်းစီအတွက် သီးခြား Virtual Ethernet Interface (`veth`) နှင့် သီးသန့် IP Address များ သတ်မှတ်ပေးပါသည်။

---

## ၂။ Docker Network Drivers ၄ မျိုး

```
1. BRIDGE NETWORK (Default & အသုံးအများဆုံး)
┌───────────────────────────────────────────────┐
│ Host Machine                                  │
│  ┌──────────────┐     ┌──────────────┐        │
│  │ Container A  │     │ Container B  │        │
│  │ 172.18.0.2   │     │ 172.18.0.3   │        │
│  └──────┬───────┘     └──────┬───────┘        │
│         │                    │                │
│   ──────┴────────────┬───────┴─────           │
│             docker0 / custom-bridge           │
│                      │                        │
│                [Host eth0]                    │
└──────────────────────┼────────────────────────┘
                       ▼ (Internet)

2. HOST NETWORK (Isolation မရှိ၊ Direct Port)
   Container Port 80 ──► Host Port 80 တိုက်ရိုက်ယူသည်

3. NONE NETWORK (လုံးဝ Network မရှိ၊ လုံခြုံရေး အမြင့်ဆုံး)
   No Internet, No Loopback communication
```

| Network Driver | အလုပ်လုပ်ပုံ အကျဉ်း | အသုံးပြုသည့် နေရာ |
| :--- | :--- | :--- |
| **`bridge`** | Host အတွင်း Private Virtual Network ဖန်တီးပေးပြီး NAT ဖြင့် အင်တာနက်ထွက်စေသည် | **Standalone Application များအားလုံးအတွက် အဓိက သုံးသည်** |
| **`host`** | Container ၏ Network Isolation ကို ဖယ်ရှားပြီး Host Machine ၏ Network ကို တိုက်ရိုက်သုံးသည် | Network Performance အမြင့်ဆုံး လိုအပ်သော ကိစ္စများ |
| **`overlay`** | မတူညီသော Physical Server ပေါင်းများစွာပေါ်ရှိ Container များ အချင်းချင်း ဆက်သွယ်စေသည် | **Docker Swarm** နှင့် Multi-host Cluster များတွင် သုံးသည် |
| **`none`** | Container တွင် မည်သည့် Network ကတ်မှ မထည့်ပေးဘဲ လုံးဝ အဆက်အသွယ်ဖြတ်ထားသည် | အလွန်လျှို့ဝှက်သော Batch Computation, Encryption Keys တွက်ချက်ခြင်း |
| **`macvlan`** | Container အား Router ထံမှ တကယ့် Physical IP တိုက်ရိုက်ရရှိစေသည် | Legacy Network Tools များနှင့် တိုက်ရိုက်ချိတ်ဆက်ရာတွင် သုံးသည် |

---

## ၃။ Default Bridge vs User-Defined Custom Bridge

အစပြုသူ အများစု ကြုံတွေ့ရသော ပြဿနာတစ်ခုရှိပါသည် -
* Docker သွင်းပြီးပြီးချင်း ပါလာသော **Default Bridge (`bridge`)** တွင် Container ၂ ခုကို run လိုက်ပါက Container IP Address ဖြင့်သာ Ping ခေါ်၍ ရပြီး၊ Container အမည်ဖြင့် ခေါ်ဆို၍ **မရပါ** (DNS Resolution မရှိပါ)။
* သို့သော် ကိုယ်တိုင် ဖန်တီးလိုက်သော **User-Defined Bridge Network** တွင်မူ Container နာမည် (ဥပမာ- `mysql-db`, `redis-cache`) ကို ရိုက်ထည့်ရုံဖြင့် Docker က IP Address အလိုအလျောက် ရှာဖွေပေးပါသည် (Automatic DNS Resolution)။

> [!IMPORTANT]
> လုပ်ငန်းခွင်တွင် မည်သည့်အခါမျှ Default Bridge ကို မသုံးသင့်ပါ။ Container များ ချိတ်ဆက်ရန်အတွက် **အမြဲတမ်း Custom Bridge Network ကိုသာ ဖန်တီး အသုံးပြုရပါမည်**။

---

## ၄။ Docker Embedded DNS Server အလုပ်လုပ်ပုံ

Docker တွင် Internal DNS Server (IP: `127.0.0.11`) အသင့်ပါဝင်ပါသည်။

```
[ Laravel Container ]
        │
        │ Query: "mysql-db ၏ IP ဘယ်လောက်လဲ?"
        ▼
[ Docker Embedded DNS (127.0.0.11) ]
        │
        │ Reply: "mysql-db သည် 172.20.0.3 ဖြစ်သည်"
        ▼
[ ချိတ်ဆက်မှု အောင်မြင်စွာ စတင်သည် ] ──► [ MySQL Container (172.20.0.3) ]
```

ဤစနစ်ကြောင့် Database IP ပြောင်းသွားစေကာမူ Application Code (ဥပမာ- `.env`) တွင် `DB_HOST=mysql-db` ဟု နာမည်သာ ထည့်ထားပါက မည်သည့်အခါမျှ ချိတ်ဆက်မှု ပြတ်တောက်ခြင်း မရှိတော့ပါ။

---

## ၅။ Network စီမံခန့်ခွဲသည့် CLI Commands များ

```bash
# Bridge Network အသစ် ဖန်တီးခြင်း
docker network create my-app-net

# ရှိပြီးသား Networks အားလုံး စာရင်းကြည့်ခြင်း
docker network ls

# Network ၏ အသေးစိတ် (မည်သည့် Container များ ချိတ်ဆက်ထားသည်ကို စစ်ဆေးခြင်း)
docker network inspect my-app-net

# Run နေသော Container ကို Network တစ်ခုနှင့် ချိတ်ဆက်ပေးခြင်း
docker network connect my-app-net <container_name>

# Container ကို Network မှ ပြန်လည် ဖြုတ်ထုတ်ခြင်း
docker network disconnect my-app-net <container_name>

# အသုံးမပြုတော့သော Network ဖျက်ခြင်း
docker network rm my-app-net
```

---

## ၆။ လက်တွေ့ Lab: Custom Network တည်ဆောက်ပြီး Web App နှင့် MySQL ချိတ်ဆက်ခြင်း

### အဆင့် ၁: User-Defined Bridge Network တစ်ခု တည်ဆောက်မည်
```bash
docker network create lab-network
```

### အဆင့် ၂: MySQL Database ကို အဆိုပါ Network ထဲတွင် Run မည်
```bash
docker run -d \
  --name db-service \
  --network lab-network \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=testdb \
  mysql:8.0
```
*(သတိပြုရန်: `-p 3306:3306` port အပြင်သို့ ထုတ်စရာ မလိုပါ! Container အချင်းချင်း Network တူနေပါက Port အလိုအလျောက် ပွင့်ပြီးသား ဖြစ်သည်)*

### အဆင့် ၃: PHP/Alpine Container ကို ထို Network ထဲတွင်ပင် Run ပြီး စမ်းသပ်မည်
```bash
docker run -it --rm --network lab-network alpine sh
```

### အဆင့် ၄: Container နာမည်ဖြင့် Ping ခေါ်ကြည့်ပါ
Container အတွင်းရောက်ရှိပါက:
```sh
ping -c 3 db-service
```
Docker Embedded DNS ကြောင့် `PING db-service (172.x.x.x)` ဟူ၍ ချက်ချင်း ping မိသည်ကို တွေ့ရပါမည်။

### အဆင့် ၅: စမ်းသပ်မှု ရှင်းလင်းခြင်း
```bash
docker stop db-service && docker rm db-service
docker network rm lab-network
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ (Scenario) | မှန်ကန်သော နည်းလမ်း |
| :--- | :--- |
| **Container အချင်းချင်း ချိတ်ဆက်ရန်** | ကိုယ်ပိုင် Custom Bridge Network ဖန်တီးပြီး ချိတ်ဆက်ပါ |
| **Database Host နေရာတွင် သုံးရန်** | IP Address မသုံးပါနှင့်၊ Container အမည် (`db-service`) ကိုသာ သုံးပါ |
| **Security အရ Database Port ဖွင့်ခြင်း** | Database ကို အင်တာနက်ပြင်ပသို့ ပေးမသိစေရန် `-p 3306:3306` မသုံးပါနှင့် (Network ထဲမှ Application သာ ခေါ်ခွင့်ပေးပါ) |
| **ပြင်ပ Client / Browser ဝင်ရောက်ရန်** | Web Server / Nginx ကိုသာ `-p 80:80` ဖြင့် Host Port ဖွင့်ပေးပါ |

နောက်သင်ခန်းစာ [06_multistage_builds_and_optimization.md](/devops/02_kubernetes_and_cloud/06_multistage_builds_and_optimization/) တွင် Docker Image Size ကို 1GB မှ 50MB သို့ လျှော့ချပေးနိုင်သည့် Multi-Stage Builds နှင့် Production Optimization နည်းလမ်းများကို လေ့လာပါမည်။
