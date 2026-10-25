---
title: "Module 05: Docker & Containers for DevOps Engineers"
description: "Virtual Machines vs Containers, Dockerfile Deep Dive, Multi-stage Builds, Networking, Volumes, Docker Compose Fullstack Stack & Security Hardening"
---

# 🐳 Module 05: Docker & Containers for DevOps Engineers

> **"It works on my machine" ပြဿနာကို အပြီးတိုင် ဖြေရှင်းပြီး Lightweight, Production-Ready, Secure Containers များ တည်ဆောက်ခြင်းနှင့် Docker Compose ဖြင့် Multi-Tier Stacks များ စီမံခန့်ခွဲခြင်း**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Production Containerization: Docker Architecture, Multi-Stage Builds, Volumes, Networks, Docker Compose & Non-Root Security**
- **Track Level**: Core Containerization (ကွန်တိန်နာ နည်းပညာ)
- **Target Audience**: DevOps Engineers, Full-Stack Developers, Cloud Architects
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **VMs vs Containers**: Hypervisor (Type 1/2) နှင့် Container Engine (cgroups, namespaces, shared kernel) တို့၏ ကွာခြားချက်ကို ရှင်းလင်းစွာ ခွဲခြမ်းသိရှိခြင်း။
* [x] **Docker Architecture**: Docker Client, Docker Daemon (`dockerd`), containerd, runc, OCI Standards နှင့် Registries အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
* [x] **Dockerfile Optimization & Layer Caching**: Instruction caching စည်းမျဉ်းများကို နားလည်ပြီး build အချိန်ကို အဆပေါင်းများစွာ မြန်ဆန်စေခြင်း။
* [x] **Multi-Stage Builds**: Build dependencies များကို နောက်ဆုံး image ထဲ မပါစေဘဲ Production Image size ကို 1GB မှ 50MB အောက်သို့ ချုံ့ပစ်နိုင်ခြင်း။
* [x] **Docker Storage**: Bind Mounts vs Named Volumes ၏ ကွာခြားချက်ကို သိရှိပြီး Database Persistent Data များကို ဘေးကင်းစွာ ထိန်းသိမ်းနိုင်ခြင်း။
* [x] **Docker Networking**: Bridge, Host, None နှင့် User-Defined Bridge Networks များတွင် DNS Service Discovery အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
* [x] **Docker Compose Mastery**: Web App + PostgreSQL Database + Nginx Reverse Proxy Stack ကို `docker-compose.yml` ဖြင့် စနစ်တကျ ရေးဆွဲ run နိုင်ခြင်း။
* [x] **Container Security & Resource Limits**: Non-root user (`USER 1001`) ဖြင့် container ကို လုံခြုံစွာ ပြေးဆွဲခြင်း၊ CPU/Memory limits (`deploy.resources.limits`) သတ်မှတ်ခြင်းနှင့် Trivy ဖြင့် Vulnerability scan ပြုလုပ်နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 01: Linux Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/01-linux/README.md) — Linux processes, users, permissions (`chmod`, `chown`) နှင့် filesystem သဘောတရားများ။
2. [Module 02: Networking Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/02-networking/README.md) — Ports, Sockets, Reverse Proxies (Nginx) နှင့် DNS resolution။
3. Docker Desktop (macOS/Windows) သို့မဟုတ် Docker Engine (Linux) ကို စက်တွင် သွင်းယူထားခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Container vs Image** | Image သည် ရေးဆွဲထားသော Blueprint/Template (Read-only) ဖြစ်ပြီး Container သည် အဆိုပါ Image ကို Memory ပေါ်တွင် အမှန်တကယ် run ထားသော Process (Read/Write) ဖြစ်သည် | Developer စက်မှ image ကို server ပေါ်တွင် တသမတ်တည်း ထပ်တူညီစွာ run နိုင်ရန် အဓိက အုတ်မြစ် ဖြစ်သည်။ | `docker build -t myapp .` (Image) ➜ `docker run myapp` (Container) |
| **Namespaces** | Linux Kernel ၏ Feature ဖြစ်ပြီး Container တစ်ခုစီကို သီးခြား Process, Network, Mount စသည့် ကမ္ဘာတစ်ခုအဖြစ် အမြင်အာရုံ သီးသန့် ခွဲထုတ်ပေးခြင်း (Isolation) | Container တစ်ခုထဲမှ process များသည် အခြား container ၏ processes များနှင့် network များကို မမြင်နိုင်စေရန် ကာကွယ်ပေးသည်။ | PID namespace, NET namespace, MNT namespace |
| **Control Groups (cgroups)** | Linux Kernel ၏ Feature ဖြစ်ပြီး Container တစ်ခု အသုံးပြုနိုင်သော CPU, Memory, Disk I/O ပမာဏကို ကန့်သတ်ထိန်းချုပ်ပေးခြင်း | Container တစ်ခု Memory leak ဖြစ်၍ ဆာဗာတစ်ခုလုံးရှိ RAM အကုန်စားပစ်ခြင်းမှ ကာကွယ်ပေးသည်။ | `--memory="512m" --cpus="1.0"` |
| **Multi-Stage Build** | Dockerfile တစ်ခုတည်းတွင် Stage များစွာခွဲ၍ Compiler/SDK tools များကို ပထမ stage တွင်သာသုံးကာ နောက်ဆုံး production stage သို့ ရလဒ် binary သာ ကူးယူခြင်း | Image size ကို 90% အထိ လျှော့ချပေးပြီး Hackers များ သုံးနိုင်သော build tools များကို ဖယ်ထုတ်သဖြင့် အလွန် လုံခြုံသည်။ | `FROM golang AS builder` ➜ `FROM alpine` |
| **Bind Mount vs Named Volume** | Bind Mount သည် Host စက်ရှိ သတ်မှတ် folder ကို container ထဲသို့ တိုက်ရိုက် ချိတ်ဆက်ခြင်းဖြစ်ပြီး Named Volume သည် Docker engine မှ `/var/lib/docker/volumes` တွင် စီမံပေးသော Persistent Storage ဖြစ်သည် | Local code development တွင် Bind mount သုံးပြီး Production Database (MySQL/Postgres) တွင် Named volume သုံးသည်။ | `volume: - db_data:/var/lib/postgresql/data` |
| **Docker Compose** | Multi-container applications (Web + DB + Redis + Nginx) များကို Declarative YAML ဖိုင်တစ်ခုတည်းဖြင့် တစ်ပြိုင်နက် ဖန်တီး၊ ချိတ်ဆက်၊ ပြေးဆွဲပေးသော Tool | Microservices stack တစ်ခုလုံးကို `docker compose up -d` တစ်ချက်နှိပ်ရုံဖြင့် မိနစ်ပိုင်းအတွင်း တက်လာစေသည်။ | `docker-compose.yml` |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ Virtual Machines (VMs) vs Containers

```text
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│        VIRTUAL MACHINE (VM)          │     │          DOCKER CONTAINER            │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│  [ App A ]   [ App B ]   [ App C ]   │     │  [ App A ]   [ App B ]   [ App C ]   │
│  [ Libs  ]   [ Libs  ]   [ Libs  ]   │     │  [ Libs  ]   [ Libs  ]   [ Libs  ]   │
│  [Guest OS]  [Guest OS]  [Guest OS]  │     │                                      │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│      Hypervisor (ESXi, KVM)          │     │     Docker Engine (containerd)       │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│         Host Operating System        │     │         Host Operating System        │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│               Hardware               │     │               Hardware               │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
* VM: GB ချီသော Guest OS ပါဝင်သဖြင့် လေးလံပြီး Boot တက်ရန် မိနစ်ပိုင်း ကြာသည်။
* Container: Host Kernel ကို မျှဝေသုံးစွဲသဖြင့် MB အနည်းငယ်သာ ရှိပြီး စက္ကန့်ပိုင်းအတွင်း တက်သည်။
```

---

### ၅.၂ Dockerfile Layer Caching စည်းမျဉ်း (Caching Optimization)

Docker သည် Dockerfile ရှိ Instruction တစ်ခုချင်းစီကို Layer တစ်ခုအဖြစ် Cache သိမ်းဆည်းပါသည်။  
**စည်းမျဉ်း**: အပြောင်းအလဲ နည်းသော အရာများကို အပေါ်တွင်ထားပြီး မကြာခဏ ပြောင်းလဲတတ်သော Source Code ကို အောက်ဆုံးတွင် ထားရမည်။

```dockerfile
# ❌ မှားယွင်းသော နည်းလမ်း (Source code ပြောင်းတိုင်း `npm install` ပြန် run ရမည်)
COPY . .
RUN npm install

# ✅ အကောင်းဆုံး စံပြ နည်းလမ်း (Package ဖိုင်များ မပြောင်းသရွေ့ `npm install` ကို cache မှ ချက်ချင်းယူမည်)
COPY package*.json ./
RUN npm install
COPY . .
```

---

## 🏗️ ၆။ Multi-Stage Production Dockerfile Example (Node.js / Express Web App)

အောက်ပါ Dockerfile သည် Node.js Web Application တစ်ခုအတွက် စံပြ Multi-Stage Build ဖြစ်ပါသည်:

```dockerfile
# ==============================================================================
# Stage 1: Build & Dependencies
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies ဖိုင်များကို အရင် ကူးယူ၍ layer caching အသုံးချခြင်း
COPY package*.json ./
RUN npm ci --only=production

# Source code ကူးယူခြင်း
COPY . .

# ==============================================================================
# Stage 2: Production Lean & Secure Runtime
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# လုံခြုံရေး: Root အကောင့်ဖြင့် မပြေးဆွဲဘဲ Non-root user အသုံးပြုခြင်း
USER node

# Builder stage ထံမှ လိုအပ်သော node_modules နှင့် code များကိုသာ ကူးယူခြင်း
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app ./

# Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

# Container Healthcheck သတ်မှတ်ခြင်း
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 🌐 ၇။ Fullstack Multi-Container Architecture with Docker Compose

လက်တွေ့ လုပ်ငန်းခွင်တွင် Web Application တစ်ခုကို Nginx (Reverse Proxy), Node/PHP App (Application Service) နှင့် PostgreSQL (Database) တို့ဖြင့် ချိတ်ဆက်ပုံ:

```text
                           [ External Traffic: Port 80 ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │        nginx-proxy (Port 80)          │
                     │  (SSL termination, Static file cache) │
                     └───────────────────────────────────────┘
                                         │ (internal bridge network)
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          web-api (Port 3000)          │
                     │        (Node.js / Express App)        │
                     └───────────────────────────────────────┘
                                         │ (internal bridge network)
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          postgres-db (Port 5432)      │
                     │       [ Volume: db_data:/var/... ]    │
                     └───────────────────────────────────────┘
```

### `docker-compose.yml` ဖိုင် အပြည့်အစုံ:

```yaml
version: '3.8'

services:
  # 1. Reverse Proxy Service
  nginx:
    image: nginx:alpine
    container_name: production-nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      web:
        condition: service_healthy
    networks:
      - app-network

  # 2. Web Application Service
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: production-web
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=appuser
      - DB_PASSWORD=SecretPassword123
      - DB_NAME=ecommerce_prod
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - app-network
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M

  # 3. Database Service
  db:
    image: postgres:15-alpine
    container_name: production-db
    restart: always
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: SecretPassword123
      POSTGRES_DB: ecommerce_prod
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d ecommerce_prod"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - app-network
    deploy:
      resources:
        limits:
          memory: 1G

networks:
  app-network:
    driver: bridge

volumes:
  db_data:
    driver: local
```

---

## 💻 ၈။ Essential Docker CLI Commands (မရှိမဖြစ် Commands များ)

```bash
# Image build လုပ်ခြင်း (Tag name ပေး၍)
docker build -t mycompany/payment-api:v1.0.0 .

# Background တွင် container run ခြင်း (Port forward 8080:3000)
docker run -d --name payment-service -p 8080:3000 mycompany/payment-api:v1.0.0

# လက်ရှိ ပြေးဆွဲနေသော containers များကို စစ်ဆေးခြင်း
docker ps

# Crash ဖြစ်သွားသော containers များ အပါအဝင် အားလုံးကို ကြည့်ရှုခြင်း
docker ps -a

# Container ၏ Live Logs များကို စောင့်ကြည့်ခြင်း
docker logs -f payment-service

# ပြေးနေသော Container အတွင်းသို့ Terminal shell ဖြင့် ဝင်ရောက်ခြင်း
docker exec -it payment-service /bin/sh

# Container များ၏ Real-time CPU & Memory စားသုံးမှုကို စောင့်ကြည့်ခြင်း
docker stats

# Docker Compose stack အားလုံးကို background တွင် စတင်ပြေးဆွဲခြင်း
docker compose up -d

# Docker Compose stack အားလုံးကို ရပ်တန့်ဖျက်သိမ်းခြင်း
docker compose down
```

---

## 🛡️ ၉။ Container Security Best Practices (လုံခြုံရေး စည်းမျဉ်းများ)

1. **Never Run as Root**: Base image တိုင်းတွင် Non-root user (`USER node` သို့မဟုတ် `USER 1001`) ကို အမြဲ ကြေညာပါ။ Root container တစ်ခု breakout ဖြစ်သွားပါက Host Server တစ်ခုလုံးကို hacker ထိန်းချုပ်သွားနိုင်သည်။
2. **Use Minimal Base Images**: Full Ubuntu/Debian image (800MB+) အစား **Alpine Linux** (5MB) သို့မဟုတ် **Google Distroless** ကို အသုံးပြုပါ။ Vulnerabilities ဖြစ်နိုင်ခြေ ၉၀% လျော့ကျသွားသည်။
3. **Use `.dockerignore`**: `.git`, `.env`, `node_modules`, `tests` ဖိုင်များကို Docker image ထဲ မပါစေရန် `.dockerignore` တွင် ထည့်သွင်းပါ။
4. **Vulnerability Scanning with Trivy**:
   ```bash
   trivy image --severity HIGH,CRITICAL mycompany/payment-api:v1.0.0
   ```

---

## ⚠️ ၁၀။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **`bind: address already in use`** | Host စက်ပေါ်ရှိ port (ဥပမာ 80 သို့မဟုတ် 5432) ကို အခြား service တစ်ခုမှ ကြိုတင် နေရာယူထားခြင်း | `sudo ss -tulpn \| grep :80` ဖြင့် ရှာဖွေပြီး မလိုသော service ကို ပိတ်ပါ သို့မဟုတ် host port ပြောင်းပါ (`-p 8080:80`)။ |
| **Container Exited with code 137** | **Out Of Memory (OOM Killer)**: Container သည် ၎င်းအား သတ်မှတ်ထားသော memory limit (ဥပမာ 512MB) ထက် ကျော်လွန်သုံးစွဲသဖြင့် Docker မှ အတင်း သတ်ပစ်လိုက်ခြင်း | `docker inspect <container>` ဖြင့် `OOMKilled: true` စစ်ပါ။ Memory limit ကို တိုးမြှင့်ပေးပါ သို့မဟုတ် app memory leak ကို ရှင်းပါ။ |
| **Database Connection Refused between containers** | Container တစ်ခုမှ အခြားတစ်ခုသို့ `localhost` ဟု ခေါ်ယူမိခြင်း | Docker network တွင် container အချင်းချင်း ချိတ်ဆက်ရာတွင် `localhost` မဟုတ်ဘဲ `service name` (ဥပမာ `db` သို့မဟုတ် `postgres`) ဖြင့် ချိတ်ဆက်ရပါမည်။ |
| **Permission Denied on Mounted Volume** | Container အတွင်းရှိ non-root user တွင် host ပေါ်ရှိ mounted directory အား read/write ခွင့် မရှိခြင်း | Host directory ၏ ownership ကို container user ID နှင့် ကိုက်ညီအောင် ပြောင်းပေးပါ (`sudo chown -R 1001:1001 /host/dir`)။ |

---

## 🏋️ ၁၁။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Build & Optimize a Multi-Stage Container**
1. Node.js (သို့မဟုတ် Python) dummy application တစ်ခု ဖန်တီးပါ။
2. Single-stage Dockerfile ရေးသားပြီး image build ပါ (`docker images` တွင် size ကို မှတ်သားပါ - ဥပမာ ~1GB)။
3. Multi-stage Dockerfile အဖြစ် ပြောင်းလဲပြင်ဆင်ပြီး Alpine base ဖြင့် ပြန်လည် build ပါ။
4. Image size သည် 100MB အောက်သို့ ကျဆင်းသွားကြောင်း စစ်ဆေးအတည်ပြုပါ။
5. `docker run -d -p 3000:3000` ဖြင့် run ပြီး `curl http://localhost:3000` အလုပ်လုပ်ကြောင်း verify လုပ်ပါ။

---

## ❓ ၁၂။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. Dockerfile ရှိ `CMD` နှင့် `ENTRYPOINT` မည်သို့ ကွာခြားသနည်း?
2. `docker compose down` နှင့် `docker compose down -v` မည်သို့ ကွာခြားသနည်း?
3. Docker တွင် Named Volume အသုံးပြုခြင်း၏ အဓိက အကျိုးကျေးဇူးမှာ အဘယ်နည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. `ENTRYPOINT` သည် Container စတင်ချိန်တွင် မဖြစ်မနေ အမြဲ အလုပ်လုပ်မည့် အဓိက command ဖြစ်သည်။ `CMD` သည် `ENTRYPOINT` ဆီသို့ ပေးပို့သော default arguments များ ဖြစ်ပြီး `docker run image <custom_arg>` ဖြင့် အပြင်မှ override လွယ်ကူစွာ လုပ်ဆောင်နိုင်သည်။
2. `docker compose down` သည် containers နှင့် networks များကိုသာ ဖျက်ပြီး database volume များကို မူလအတိုင်း ထိန်းသိမ်းသည်။ `docker compose down -v` သည် `-v` (volumes) flag ပါဝင်သဖြင့် Database ထဲရှိ persistent data အားလုံးကို အပြီးတိုင် ဖျက်ပစ်မည် ဖြစ်သည်။
3. Container ပျက်စီးသွားသော်လည်း အရေးကြီးသော Database data များ မပျက်စီးဘဲ ကျန်ရှိနေခြင်း (Data Persistence) နှင့် Container အသစ် ထပ်တက်လာပါက အဆိုပါ Volume နှင့် ပြန်လည် ချိတ်ဆက်နိုင်ခြင်း ဖြစ်သည်။
</details>

---

## 💼 ၁၃။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Docker Container တစ်ခုတွင် 'Application works on my local Docker but crashes with code 137 on Kubernetes/Server' ဖြစ်ရသည့် အကြောင်းရင်းနှင့် ဖြေရှင်းပုံကို ရှင်းပြပါ။**
> **Sample Answer**:
> "Exit code 137 ဆိုသည်မှာ Linux Kernel မှ `SIGKILL (Signal 9)` ဖြင့် အတင်း သတ်ပစ်လိုက်ခြင်း ဖြစ်ပြီး $128 + 9 = 137$ ဟူ၍ ဖြစ်လာခြင်း ဖြစ်ပါသည်။ အဓိက အကြောင်းရင်းမှာ **Out-Of-Memory (OOM Killer)** ဖြစ်သည်။ Local စက်တွင် memory limit မသတ်မှတ်ထားသဖြင့် ကွန်ပျူတာ၏ RAM အားလုံးကို လွတ်လပ်စွာ ယူသုံးနိုင်သော်လည်း Production Server သို့မဟုတ် Kubernetes တွင် `memory limits: 512Mi` ကန့်သတ်ထားသဖြင့် အဆိုပါ limit ကျော်သွားချိန်တွင် Kernel က kill ပစ်ခြင်း ဖြစ်သည်။ ဖြေရှင်းရန်အတွက် `docker inspect` သို့မဟုတ် `dmesg -T | grep -i oom` ဖြင့် OOM ဖြစ်ကြောင်း အတည်ပြုပြီး Application ၏ Memory Leak ကို စစ်ဆေးခြင်း သို့မဟုတ် Heap Memory (`--max-old-space-size`) ချိန်ညှိခြင်းနှင့် Container Memory Limit ကို သင့်လျော်စွာ တိုးမြှင့်ပေးခြင်းတို့ ဆောင်ရွက်ပါမည်။"

---

## 📚 ၁၄။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Docker Official Documentation](https://docs.docker.com/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Specification](https://docs.docker.com/compose/)
- [Trivy Vulnerability Scanner](https://aquasecurity.github.io/trivy/)
