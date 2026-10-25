---
title: "Docker Compose Multi-Tier Sample Stack Guide"
description: "Line-by-line breakdown of a Production-grade Nginx + Node.js Express + PostgreSQL Compose Stack"
---

# 🐳 Fullstack Multi-Tier Docker Compose Sample Guide

ဤ Sample Project သည် DevOps သင်ယူသူများအတွက် **Production-Grade Architecture** ကို လက်တွေ့ စမ်းသပ်လေ့လာနိုင်စေရန် ဖန်တီးထားသော အပြည့်အစုံ Stack ဖြစ်ပါသည်။

---

## 🏗️ Stack Architecture

```text
[ Browser / curl http://localhost:8080 ]
                  │
                  ▼
         ┌──────────────────┐
         │   sample-nginx   │ ── (Reverse Proxy : Port 80)
         └──────────────────┘
                  │ (app-net bridge)
                  ▼
         ┌──────────────────┐
         │    sample-web    │ ── (Node.js Express API : Port 3000)
         └──────────────────┘
                  │ (app-net bridge)
                  ▼
         ┌──────────────────┐
         │    sample-db     │ ── (PostgreSQL 15 : Port 5432)
         │ [postgres_data]  │
         └──────────────────┘
```

---

## 🚀 How to Run & Test (စတင် ပြေးဆွဲ စမ်းသပ်ပုံ)

### အဆင့် ၁: Stack အားလုံးကို Background တွင် စတင်ပါ
```bash
cd devops-learning-guide/05-docker/docker-compose-sample
docker compose up -d
```

### အဆင့် ၂: Container အခြေအနေများ စစ်ဆေးပါ
```bash
docker compose ps
# Expected: sample-nginx, sample-web, sample-db အားလုံး running/healthy ဖြစ်နေရမည်။
```

### အဆင့် ၃: HTTP API နှင့် Database Connectivity ကို စမ်းသပ်ပါ
```bash
# Web API စမ်းသပ်ခြင်း (Nginx port 8080 မှတဆင့်)
curl http://localhost:8080/

# Healthcheck & Database Connection Status စစ်ဆေးခြင်း
curl http://localhost:8080/healthz
# Expected Response: {"status":"HEALTHY","database":"CONNECTED"}
```

### အဆင့် ၄: Clean Up
```bash
docker compose down -v
```

---

## 📝 Line-by-Line Configuration Breakdown (ဖိုင်အလိုက် အသေးစိတ် ရှင်းလင်းချက်)

### ၁။ `Dockerfile`:
- `FROM node:20-alpine AS builder`: ပထမ stage တွင် Node 20 alpine base ကိုသုံး၍ `npm ci` ဖြင့် dependencies များ သွင်းယူသည်။
- `FROM node:20-alpine AS runner`: ဒုတိယ production stage သို့ လိုအပ်သော build artifacts များသာ ကူးယူသည်။
- `USER node`: Container လုံခြုံရေးအတွက် Root အစား unprivileged `node` user ကို သုံးသည်။

### ၂။ `docker-compose.yml`:
- `depends_on: db: condition: service_healthy`: Database service အမှန်တကယ် ready မဖြစ်မီ Web app ကို စတင်မပြေးဆွဲစေရန် ထိန်းချုပ်ထားခြင်း (Race Condition ကာကွယ်မှု)။
- `volumes: postgres_data:/var/lib/postgresql/data`: Container restart ချသော်လည်း Database အချက်အလက်များ မပျောက်ပျက်စေရန် Persistent Named Volume အသုံးပြုထားခြင်း။
- `networks: app-net`: Container အချင်းချင်း Domain name (`web`, `db`) ဖြင့် သီးသန့် လုံခြုံစွာ ဆက်သွယ်နိုင်သော Private Bridge Network ဖြစ်သည်။
