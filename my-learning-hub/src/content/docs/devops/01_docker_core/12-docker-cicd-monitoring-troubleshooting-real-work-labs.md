---
title: "12. Docker, CI/CD & Monitoring - Real-Work Labs (D1-D10)"
description: "Application ကို Run ရုံမက Deploy၊ Monitor၊ Troubleshoot အထိ လက်တွေ့လုပ်ရသော Docker + GitHub Actions CI/CD + Prometheus/Grafana/Loki Lab ၁၀ ခု၊ ဗမာလို Step-by-step"
---

> 🎯 **ဤသင်ခန်းစာ၏ ရည်ရွယ်ချက်:** App တစ်ခုကို `docker run` လုပ်တတ်ရုံမက အလုပ်ခွင်တွင် လုပ်ရသော **Build -> Test -> Deploy -> Monitor -> Troubleshoot** အပြည့်အစုံကို Lab တစ်ခုချင်း လက်တွေ့လုပ်ရန်။
> ကြိုတင်လိုအပ်ချက်: [Docker & Docker Hub Step-by-Step](/devops/01_docker_core/11-docker-and-docker-hub-step-by-step-for-devops/) ကို ဖတ်ပြီး Docker Hub Account၊ GitHub Account ရှိထားရမည်။

## 🔁 အလုပ်ခွင်၏ DevOps Lifecycle

```
 Developer        GitHub          CI (GitHub Actions)              Registry        Server
 git push  ---->  Repo  ---->  Test -> Build -> Scan  ---->  Docker Hub/GHCR  ---->  Deploy
                                                                                     |
                      Alert <---- Prometheus/Grafana/Loki  <---- Monitor <-----------+
                        |
                  Troubleshoot -> Fix -> git push  (Loop)
```

| Lab | ခေါင်းစဉ် | အလုပ်ခွင်တွင် ဘာကြောင့်လိုလဲ |
| :-: | :--- | :--- |
| D1 | Production-grade Dockerfile | Image သေး၊ လုံခြုံ၊ Health check ပါ |
| D2 | Multi-container Stack (App+DB+Cache+Proxy) | Real App တစ်ခုလုံးကို Compose ဖြင့် |
| D3 | CI Pipeline: Test -> Build -> Scan -> Push | Push တိုင်း အလိုအလျောက် စစ်/တည်ဆောက် |
| D4 | CD: SSH Deploy + Auto Rollback | Server သို့ လုံခြုံစွာ Deploy |
| D5 | Image Versioning & Digest Pinning | "ဘယ် Version Run နေလဲ" ခြေရာခံ |
| D6 | Container Monitoring (Prometheus+cAdvisor+Grafana) | CPU/RAM/Restart ကြည့် |
| D7 | Centralized Logging (Loki+Promtail) | Log ကို တစ်နေရာတည်း ရှာ |
| D8 | Alerting Rules | Customer မတိုင်ကြားမီ အရင်သိ |
| D9 | Troubleshooting Clinic (ပျက်နေသော Container ၁၀ မျိုး) | နေ့စဉ်အလုပ်၏ ၅၀% |
| D10 | Rolling / Blue-Green Deploy + Rollback | Downtime မရှိ Release |

> ⚠️ Lab အားလုံးကို **Local Mac / Practice VM** တွင်သာ လုပ်ပါ။ Server အစစ် (Production) ဖြင့် မစမ်းပါနှင့်။

---

## 🧰 အဆင့် ၀ - Lab Project ပြင်ဆင်ခြင်း

နမူနာ App တစ်ခုကို အသုံးပြုမည် (Node.js + Express, `/health` နှင့် `/metrics` ပါ)။

```bash
mkdir -p ~/devops-lab/app && cd ~/devops-lab/app
```

`package.json`
```json
{
  "name": "orders-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^4.19.2",
    "prom-client": "^15.1.3",
    "pg": "^8.12.0",
    "redis": "^4.7.0"
  }
}
```

`server.js`
```javascript
const express = require("express");
const client = require("prom-client");
const { Pool } = require("pg");
const { createClient } = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "dev";

// ---- Metrics ----
client.collectDefaultMetrics();
const httpReq = new client.Counter({
  name: "http_requests_total", help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});
const httpDur = new client.Histogram({
  name: "http_request_duration_seconds", help: "Request duration",
  labelNames: ["route"], buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
});

// ---- Dependencies (optional) ----
const pool = process.env.DB_HOST ? new Pool({
  host: process.env.DB_HOST, user: process.env.DB_USER || "app",
  password: process.env.DB_PASSWORD, database: process.env.DB_NAME || "appdb",
}) : null;
let redis = null;
if (process.env.REDIS_HOST) {
  redis = createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });
  redis.on("error", (e) => console.error(JSON.stringify({ level: "error", msg: "redis", err: e.message })));
  redis.connect();
}

app.use((req, res, next) => {
  const end = httpDur.startTimer({ route: req.path });
  res.on("finish", () => {
    httpReq.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
  });
  next();
});

app.get("/", (req, res) => res.json({ app: "orders-api", version: VERSION }));

app.get("/health", async (req, res) => {
  try {
    if (pool) await pool.query("SELECT 1");
    if (redis) await redis.ping();
    res.status(200).json({ status: "ok", version: VERSION });
  } catch (e) {
    console.error(JSON.stringify({ level: "error", msg: "health failed", err: e.message }));
    res.status(503).json({ status: "unhealthy", err: e.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const r = pool ? await pool.query("SELECT now() AS t") : { rows: [{ t: new Date() }] };
    res.json({ orders: [], at: r.rows[0].t });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Troubleshooting Lab များအတွက် ရည်ရွယ်ချက်ရှိရှိ ပျက်စေသော endpoints
app.get("/slow", (req, res) => setTimeout(() => res.send("slow done"), 1500));
app.get("/error", (req, res) => { console.error(JSON.stringify({ level: "error", msg: "boom" })); res.status(500).send("boom"); });
const leak = [];
app.get("/leak", (req, res) => { leak.push(Buffer.alloc(20 * 1024 * 1024, 1)); res.send(`leaked ${leak.length * 20}MB`); });

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

const server = app.listen(PORT, () =>
  console.log(JSON.stringify({ level: "info", msg: "started", port: PORT, version: VERSION })));

// Graceful shutdown (docker stop / rolling deploy အတွက် အရေးကြီး)
process.on("SIGTERM", () => {
  console.log(JSON.stringify({ level: "info", msg: "SIGTERM received, draining" }));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
});

module.exports = app;
```

`server.test.js`
```javascript
const { test } = require("node:test");
const assert = require("node:assert");

test("sanity: version env fallback", () => {
  assert.strictEqual(process.env.APP_VERSION || "dev", "dev");
});
```

```bash
git init && echo "node_modules\n.env\n*.log" > .gitignore
```

---

# 🟦 PART A - Docker (Build & Run အလုပ်ခွင်စံနှုန်း)

## 🔹 Lab D1 - Production-grade Dockerfile

**📋 Scenario:** Dev ရေးထားသော Dockerfile သည် Image 1.1GB၊ Root ဖြင့် Run၊ Health check မရှိ။ Security Team က ပယ်ချသည်။ ပြင်ရမည်။

### အဆင့် ၁ - "ဆိုးသော" Dockerfile ကို အရင် Build ပြီး တိုင်း
`Dockerfile.bad`
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD npm start
```
```bash
docker build -f Dockerfile.bad -t orders-api:bad .
docker images orders-api:bad
docker run --rm orders-api:bad id          # uid=0(root)  <- ပြဿနာ
```

### အဆင့် ၂ - Production Dockerfile
`Dockerfile`
```dockerfile
# ---------- Stage 1: dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# dumb-init: PID 1 signal handling (SIGTERM ကို မှန်မှန်ကန်ကန် လက်ခံ)
RUN apk add --no-cache dumb-init curl

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

# Build-time metadata
ARG APP_VERSION=dev
ARG GIT_SHA=unknown
ENV APP_VERSION=${APP_VERSION}
LABEL org.opencontainers.image.version=${APP_VERSION} \
      org.opencontainers.image.revision=${GIT_SHA} \
      org.opencontainers.image.source="https://github.com/YOUR_USER/orders-api"

USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

`.dockerignore`
```
node_modules
.git
.env
*.log
Dockerfile*
docker-compose*.yml
.github
```

### အဆင့် ၃ - Build, နှိုင်းယှဉ်, စစ်
```bash
docker build -t orders-api:good --build-arg APP_VERSION=1.0.0 --build-arg GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo local) .

docker images | grep orders-api                         # Size နှိုင်းယှဉ်
docker run --rm orders-api:good id                      # uid=1000(node)
docker history orders-api:good | head
docker inspect orders-api:good --format '{{json .Config.Labels}}' | head -c 400
```

### အဆင့် ၄ - Run ပြီး Health စစ်
```bash
docker run -d --name api -p 3000:3000 orders-api:good
sleep 12
docker ps                                  # STATUS: Up ... (healthy)
curl localhost:3000/health
docker inspect api --format '{{json .State.Health}}' | head -c 400
```

### အဆင့် ၅ - Graceful Shutdown စစ်
```bash
time docker stop api         # ~ စက္ကန့် 1 အတွင်း ပိတ်ရမည် (SIGTERM လက်ခံ)
docker logs api | tail -3    # "SIGTERM received, draining"
```
> `dumb-init` မပါဘဲ `CMD npm start` ဖြင့်ဆိုလျှင် 10 စက္ကန့်စောင့်ပြီးမှ SIGKILL ဖြစ်တတ်သည်။ (Deploy ကြာခြင်း၊ Request ပြတ်ခြင်း ဖြစ်စေ)

### ✅ စစ်ဆေးရန်
| စစ်ချက် | ရလဒ် |
| :--- | :-: |
| Image Size ကျသည် (bad vs good) | ⬜ |
| Non-root user (`uid=1000`) | ⬜ |
| `(healthy)` ပြ | ⬜ |
| `docker stop` < 3 စက္ကန့် | ⬜ |

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
Non-root = Hack ခံရလည်း ပျက်စီးမှုနည်း။ HEALTHCHECK = Orchestrator (Compose/K8s) က "ဘယ် Container ဆိုးနေလဲ" သိရန်။ Labels = Image တစ်ခုကို Git commit သို့ ပြန်ခြေရာခံရန်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `docker run --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges -p 3000:3000 orders-api:good` ဖြင့် Run ပြီး App ဆက်အလုပ်လုပ်သလား စစ်ပါ။

---

## 🔹 Lab D2 - Multi-container Stack (App + Postgres + Redis + Nginx)

**📋 Scenario:** App သည် DB၊ Cache လိုသည်။ `docker run` ၄ ခုကို လက်ဖြင့်မရိုက်နိုင်၊ Dev/Staging/Prod တွင် တူညီစွာ Run ရမည်။

`docker-compose.yml`
```yaml
name: orders

services:
  proxy:
    image: nginx:1.27-alpine
    ports: ["80:80"]
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    networks: [frontend]

  api:
    image: orders-api:good          # CI ပြီးလျှင် registry image သို့ပြောင်း
    environment:
      APP_VERSION: ${APP_VERSION:-1.0.0}
      DB_HOST: db
      DB_USER: app
      DB_PASSWORD_FILE: /run/secrets/db_password
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: appdb
      REDIS_HOST: cache
    depends_on:
      db:    { condition: service_healthy }
      cache: { condition: service_healthy }
    healthcheck:
      test: ["CMD-SHELL", "curl -fs http://localhost:3000/health || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits: { cpus: "0.50", memory: 256M }
    restart: unless-stopped
    networks: [frontend, backend]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped
    networks: [backend]               # Internet/Proxy မှ တိုက်ရိုက်မမြင်

  cache:
    image: redis:7-alpine
    command: ["redis-server", "--maxmemory", "64mb", "--maxmemory-policy", "allkeys-lru"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped
    networks: [backend]

volumes:
  pgdata:

networks:
  frontend:
  backend:
    internal: true                    # Internet သို့ outbound မရ၊ ပိုလုံခြုံ
```

`nginx/default.conf`
```nginx
upstream api { server api:3000; }
server {
    listen 80;
    location / {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 3s;
        proxy_read_timeout 30s;
    }
}
```

`.env` (Git ထဲမထည့်)
```
DB_PASSWORD=Ch@ngeMe-Str0ng
APP_VERSION=1.0.0
```

```bash
mkdir -p nginx   # (အပေါ်ဖိုင်များကို ဖန်တီးပြီးနောက်)
docker compose config                      # Syntax စစ် + ပေါင်းစပ်ပြီးသော config
docker compose up -d
docker compose ps                          # Service အားလုံး healthy ဖြစ်ရမည်
curl localhost/health
curl localhost/orders
```

### Dependency / Network Isolation စစ်
```bash
# Proxy မှ DB ကို မမြင်ရ (network ခွဲထား)
docker compose exec proxy sh -c "nc -zv db 5432" ; echo "exit=$?"     # fail ဖြစ်ရမည်
# API မှ DB ကို မြင်ရ
docker compose exec api sh -c "nc -zv db 5432"
# Host မှ DB port မဖွင့်ထားသောကြောင့် ဝင်မရ
nc -zv localhost 5432 ; echo "exit=$?"
```

### Data မပျောက်ကြောင်း စစ်
```bash
docker compose exec db psql -U app -d appdb -c "CREATE TABLE t(id int); INSERT INTO t VALUES (1);"
docker compose down                         # Container ဖျက် (Volume မဖျက်)
docker compose up -d
docker compose exec db psql -U app -d appdb -c "SELECT * FROM t;"      # 1 ပြန်တွေ့ရမည်
```

### ✅ စစ်ဆေးရန်
`docker compose ps` တွင် ၄ ခုလုံး `healthy`၊ DB ကို Proxy/Host မှ ဝင်မရ၊ `down` ပြီး `up` လုပ်လည်း Data ရှိနေခြင်း။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
`depends_on: condition: service_healthy` သည် "DB မ Ready ခင် App စ၍ Crash" ပြဿနာကို ကာကွယ်သည်။ Network ခွဲခြင်း (`internal: true`) သည် **Defense in depth**။ Resource limit ဖြင့် App တစ်ခုက Host တစ်ခုလုံးကို မစားစေ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `docker compose -f docker-compose.yml -f docker-compose.dev.yml` Override pattern ဖြင့် Dev တွင် Source ကို bind mount လုပ်ပြီး DB port ဖွင့်ပါ။ `docker compose --profile debug` ဖြင့် `adminer` ကို ရွေးချယ်ဖွင့်ပါ။

---

# 🟩 PART B - CI/CD (Deploy အလိုအလျောက်)

## 🔹 Lab D3 - CI Pipeline: Test -> Build -> Scan -> Push

**📋 Scenario:** Developer တိုင်း `git push` လုပ်တိုင် (၁) Test Run (၂) Image Build (၃) Vulnerability Scan (၄) Registry သို့ Push အလိုအလျောက်ဖြစ်စေလိုသည်။ Test ကျလျှင် Merge မခွင့်ပြုရ။

### GitHub Repo ဖန်တီးပြီး Secrets ထည့်
GitHub Repo -> Settings -> Secrets and variables -> Actions

| Secret | တန်ဖိုး |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Access Token (Read & Write) |

### Workflow
`.github/workflows/ci.yml`
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    tags: ["v*.*.*"]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true          # Push ထပ်လျှင် အဟောင်းကို ရပ်

permissions:
  contents: read
  security-events: write

env:
  IMAGE: ${{ secrets.DOCKERHUB_USERNAME }}/orders-api

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: app/package-lock.json
      - name: Install
        working-directory: app
        run: npm install
      - name: Unit tests
        working-directory: app
        run: npm test

  build-scan-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - name: Docker meta (tags/labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE }}
          tags: |
            type=sha,format=short
            type=semver,pattern={{version}}
            type=raw,value=latest,enable={{is_default_branch}}

      # 1) Build (push မလုပ်သေး) -> Scan အတွက် local load
      - name: Build image (for scan)
        uses: docker/build-push-action@v6
        with:
          context: ./app
          load: true
          tags: scan-target:ci
          build-args: |
            APP_VERSION=${{ github.ref_name }}
            GIT_SHA=${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # 2) Security scan - HIGH/CRITICAL တွေ့လျှင် Fail
      - name: Trivy scan
        uses: aquasecurity/trivy-action@0.24.0
        with:
          image-ref: scan-target:ci
          severity: HIGH,CRITICAL
          ignore-unfixed: true
          exit-code: "1"

      # 3) Smoke test: Container အစစ်ကို Run ပြီး /health စစ်
      - name: Smoke test
        run: |
          docker run -d --name smoke -p 3000:3000 scan-target:ci
          for i in $(seq 1 15); do
            curl -fs http://localhost:3000/health && exit 0
            sleep 2
          done
          docker logs smoke
          exit 1

      # 4) main / tag မှသာ Push
      - name: Login to Docker Hub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Push
        if: github.event_name != 'pull_request'
        uses: docker/build-push-action@v6
        with:
          context: ./app
          push: true
          platforms: linux/amd64,linux/arm64
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            APP_VERSION=${{ github.ref_name }}
            GIT_SHA=${{ github.sha }}
          cache-from: type=gha
```

```bash
cd app && npm install && cd ..        # package-lock.json ထုတ်
git add . && git commit -m "ci: add pipeline"
git branch -M main
git remote add origin git@github.com:YOUR_USER/orders-api.git
git push -u origin main
# GitHub -> Actions tab တွင် ကြည့်
```

### Pipeline ကို ရည်ရွယ်ချက်ရှိရှိ ဖျက်စီးကြည့် (Real work မှာ အမြဲကြုံ)

| စမ်းသပ်ချက် | လုပ်ပုံ | မျှော်လင့်ရလဒ် |
| :--- | :--- | :--- |
| Test ကျ | `server.test.js` ၏ assert ကို မှားထည့် | `test` job ကျ၊ Build/Push မလုပ် |
| Vulnerability | `FROM node:14-alpine` သို့ ပြောင်း | Trivy က HIGH/CRITICAL ဖြင့် Fail |
| Smoke fail | `/health` ကို 500 ပြန်စေ | Smoke test ကျ၊ Image Registry သို့ မရောက် |
| PR | Branch ဖြင့် PR ဖွင့် | Test+Build+Scan Run၊ **Push မလုပ်** |

### Branch Protection (အလုပ်ခွင်စံ)
GitHub -> Settings -> Branches -> Add rule (`main`)
- ✅ Require a pull request before merging
- ✅ Require status checks to pass: `test`, `build-scan-push`

### ✅ စစ်ဆေးရန်
Docker Hub Tags တွင် `sha-xxxxxxx` နှင့် `latest` ပေါ်၊ Test ဖျက်စီးလျှင် Push မဖြစ်ကြောင်း သက်သေပြပါ။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
**Shift-left:** ပြဿနာကို Production မရောက်ခင် CI တွင်ဖမ်း။ Scan ကို Push **မတိုင်မီ** လုပ်ခြင်းဖြင့် Registry တွင် မလုံခြုံသော Image မရှိစေ။ `concurrency` ဖြင့် CI Minutes ချွေတာ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Dependabot (`.github/dependabot.yml`) ဖြင့် Base image/npm အသစ်ထွက်တိုင် PR အလိုအလျောက်ဖွင့်ပါ။ `docker/scout-action` သို့ SBOM (`sbom: true`) ထပ်ထည့်ပါ။

---

## 🔹 Lab D4 - CD: SSH Deploy + Health Check + Auto Rollback

**📋 Scenario:** CI အောင်ပြီးလျှင် Staging/Prod Server (Ubuntu VM) သို့ အလိုအလျောက် Deploy လုပ်ရမည်။ Deploy ပြီး Health check မအောင်လျှင် **ယခင် Version သို့ အလိုအလျောက် Rollback**။

### Server ပြင်ပ (တစ်ကြိမ်သာ)
```bash
# Server (VM) ပေါ်တွင်
curl -fsSL https://get.docker.com | sudo sh
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo mkdir -p /opt/orders && sudo chown deploy:deploy /opt/orders

# Deploy အတွက်သီးသန့် SSH key (CI ကသာသုံး)
# (သင့် Mac တွင်)
ssh-keygen -t ed25519 -f ~/.ssh/ci_deploy -C "github-actions-deploy" -N ""
ssh-copy-id -i ~/.ssh/ci_deploy.pub deploy@SERVER_IP
```
Server ၏ `/opt/orders/` ထဲတွင် `docker-compose.yml` နှင့် `.env` (လျှို့ဝှက်ချက်) ကို ကူးထား။ Compose ရှိ `api.image` ကို အောက်ပါအတိုင်းပြောင်း-
```yaml
    image: ${IMAGE}:${TAG}
```

### Deploy Script (Server ပေါ်) `/opt/orders/deploy.sh`
```bash
#!/bin/bash
set -euo pipefail
cd /opt/orders

NEW_TAG="${1:?usage: deploy.sh <tag>}"
IMAGE="${IMAGE:?IMAGE env required}"
STATE_FILE=".current_tag"
PREV_TAG=$(cat "$STATE_FILE" 2>/dev/null || echo "")

echo "[deploy] $PREV_TAG -> $NEW_TAG"

export IMAGE TAG="$NEW_TAG"
docker pull "$IMAGE:$NEW_TAG"

docker compose up -d --no-build --remove-orphans api

# Health check (60s အထိ စောင့်)
ok=0
for i in $(seq 1 30); do
  status=$(docker inspect --format='{{.State.Health.Status}}' orders-api-1 2>/dev/null || echo "none")
  if [ "$status" = "healthy" ]; then ok=1; break; fi
  sleep 2
done

if [ "$ok" -eq 1 ] && curl -fs http://localhost/health >/dev/null; then
  echo "$NEW_TAG" > "$STATE_FILE"
  echo "[deploy] SUCCESS $NEW_TAG"
  docker image prune -f >/dev/null
  exit 0
fi

echo "[deploy] FAILED health check"
docker compose logs --tail=50 api || true
if [ -n "$PREV_TAG" ]; then
  echo "[deploy] ROLLBACK -> $PREV_TAG"
  export TAG="$PREV_TAG"
  docker compose up -d --no-build api
fi
exit 1
```
```bash
chmod +x /opt/orders/deploy.sh
```

### GitHub Actions - Deploy Job (ci.yml ၏ အောက်တွင် ဆက်ထည့်)
Secrets ထပ်ထည့်: `DEPLOY_HOST`, `DEPLOY_USER` (`deploy`), `DEPLOY_SSH_KEY` (`~/.ssh/ci_deploy` ၏ private key အကြောင်းအရာ)

```yaml
  deploy-staging:
    needs: build-scan-push
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging              # Environment protection ထည့်နိုင်
    steps:
      - name: Compute short sha
        id: v
        run: echo "tag=sha-$(echo ${{ github.sha }} | cut -c1-7)" >> $GITHUB_OUTPUT

      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script_stop: true
          script: |
            export IMAGE=${{ secrets.DOCKERHUB_USERNAME }}/orders-api
            /opt/orders/deploy.sh ${{ steps.v.outputs.tag }}

  deploy-production:
    needs: deploy-staging
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production           # Settings -> Environments -> Required reviewers (လူက Approve)
    steps:
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            export IMAGE=${{ secrets.DOCKERHUB_USERNAME }}/orders-api
            /opt/orders/deploy.sh ${GITHUB_REF_NAME#v}
```
> `deploy-production` Job သည် `production` Environment တွင် **Required reviewers** ထားလျှင် လူတစ်ဦး Approve မှ Run မည် (Manual gate)။

### စမ်းသပ်
```bash
# 1) ပုံမှန် Deploy
git commit --allow-empty -m "feat: deploy test" && git push
# Actions တွင် deploy-staging အောင်၊ Server တွင်
cat /opt/orders/.current_tag
curl http://SERVER_IP/            # {"version": "..."} အသစ်

# 2) Rollback စမ်း - /health ကို အမြဲ 503 ပြန်စေသော Commit ပို့
#    (server.js တွင် app.get("/health", (_, res) => res.status(503).end()) ပြောင်း)
git commit -am "break: bad release" && git push
# deploy.sh -> "FAILED health check" -> "ROLLBACK -> <prev>"
curl http://SERVER_IP/            # ယခင် version ပြန်ပြ
```

### ✅ စစ်ဆေးရန်
ပျက်သော Release ကို Deploy လုပ်ပြီး **Server မှ ယခင် Version ဖြင့် ဆက်လက်ဖြေနေ** ကြောင်း သက်သေပြပါ (Actions Log + curl)။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
- Deploy လုပ်ပြီးနောက် **Health check သည် မဖြစ်မနေ** (Exit code 0 ဖြစ်ရုံနှင့် Deploy အောင်မြင်သည်မဟုတ်)။
- Deploy User သည် Root မဟုတ်၊ SSH Key သည် CI အတွက်သီးသန့် (ပျောက်လျှင် ဖျက်ရုံ)။
- Production သည် Manual Approval Gate ဖြင့် (ထိန်းချုပ်မှု)။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Slack/Discord Webhook ဖြင့် "Deploy SUCCESS/ROLLBACK" Notification ပို့ပါ။ `workflow_dispatch` ဖြင့် Tag ရွေး၍ Manual Rollback Button ပြုလုပ်ပါ။

---

## 🔹 Lab D5 - Image Versioning & Digest Pinning

**📋 Scenario:** "Production တွင် ဘယ် Code Version Run နေသလဲ?" ဟု မေးလာ။ `latest` သုံးထားသောကြောင့် မသိ။ ထို့ပြင် ပြင်ပ Image (`node:20-alpine`) ပြောင်းသွားလို့ ညတွင်းချင်း Build ပျက်ဖူးသည်။

### Tag တစ်ခုက ပြောင်းလဲနိုင်သည်ကို သက်သေပြ
```bash
docker pull alpine:3.20
docker inspect alpine:3.20 --format '{{index .RepoDigests 0}}'
# alpine@sha256:xxxx...   <- Digest (မပြောင်းနိုင်)
```

### Digest ဖြင့် Pin
`Dockerfile` ၏ FROM ကို-
```dockerfile
FROM node:20-alpine@sha256:<digest>
```
```bash
docker buildx imagetools inspect node:20-alpine | head -5     # Digest ယူ
```

### Deploy လုပ်ထားသော Image ကို Server တွင် သိရန်
```bash
docker inspect orders-api-1 --format '{{.Config.Image}}  {{.Image}}'
docker inspect orders-api-1 --format '{{index .Config.Labels "org.opencontainers.image.revision"}}'
# -> Git commit SHA တိုက်ရိုက်ရ
git show <sha> --stat
```

### Tag မူဝါဒ (Team Standard)

| Tag | ပြောင်းလဲနိုင်? | သုံးရာ |
| :--- | :-: | :--- |
| `sha-a1b2c3d` | ❌ Immutable | **Production Deploy (အဓိက)**၊ Rollback |
| `1.4.2` | ❌ (စည်းကမ်းထား) | Release |
| `main` / `latest` | ✅ | Dev/Staging ကြည့်ရန်သာ |

### Registry တွင် Cleanup Policy
```bash
# Docker Hub: Repository -> Settings -> Tag retention (သို့မဟုတ်) API ဖြင့်
# ဥပမာ - sha-* tag ကို နောက်ဆုံး ၂၀ ခုသာ ထား
```

### SBOM ထုတ်
```bash
docker buildx build --sbom=true --provenance=true -t YOUR_USER/orders-api:sbom-test --push ./app
docker scout sbom YOUR_USER/orders-api:sbom-test 2>/dev/null | head   # သို့ syft YOUR_USER/orders-api:sbom-test
```

### ✅ စစ်ဆေးရန်
Server ပေါ်ရှိ Container တစ်ခုမှ **Git commit SHA ကို ပြန်ထုတ်** ၍ ထို Commit ၏ Code ကို ဖော်ပြနိုင်ရမည်။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
Incident တွင် "ဘာ Run နေလဲ" ကို ၃၀ စက္ကန့်အတွင်း ဖြေနိုင်ရမည်။ Digest Pinning သည် **Supply-chain** ကာကွယ်ရေးနှင့် Build ပြန်လုပ်နိုင်မှု (Reproducibility) ကို ပေးသည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `cosign` ဖြင့် Image ကို Sign လုပ်ပြီး Server တွင် Verify မလုပ်နိုင်လျှင် Deploy မလုပ်သော စစ်ဆေးမှု ထည့်ပါ။

---

# 🟧 PART C - Monitoring & Logging (စောင့်ကြည့်ခြင်း)

## 🔹 Lab D6 - Container Monitoring (Prometheus + cAdvisor + Grafana)

**📋 Scenario:** App ၏ CPU/RAM/Restart/Request Rate/Error Rate/Latency ကို Dashboard တစ်ခုတည်းတွင် မြင်လိုသည်။

`monitoring/docker-compose.yml`
```yaml
name: monitoring

services:
  prometheus:
    image: prom/prometheus:v2.54.1
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=15d
      - --web.enable-lifecycle
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alerts.yml:/etc/prometheus/alerts.yml:ro
      - promdata:/prometheus
    ports: ["9090:9090"]
    networks: [mon, orders_frontend]
    restart: unless-stopped

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    privileged: true
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks: [mon]
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.8.2
    pid: host
    volumes: ["/:/host:ro,rslave"]
    command: ["--path.rootfs=/host"]
    networks: [mon]
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.27.0
    volumes: ["./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro"]
    ports: ["9093:9093"]
    networks: [mon]
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.2.0
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
    volumes: [grafdata:/var/lib/grafana]
    ports: ["3001:3000"]
    networks: [mon]
    restart: unless-stopped

volumes: { promdata: {}, grafdata: {} }

networks:
  mon:
  orders_frontend:
    external: true
    name: orders_frontend           # D2 Compose ၏ frontend network (project name: orders)
```
> Mac တွင် cAdvisor ၏ host mounts အချို့ မရနိုင်ပါ။ Linux VM (Multipass) တွင် Run ခြင်းက ပိုမှန်ကန်သည်။

`prometheus.yml`
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files: ["/etc/prometheus/alerts.yml"]
alerting:
  alertmanagers:
    - static_configs: [{ targets: ["alertmanager:9093"] }]

scrape_configs:
  - job_name: prometheus
    static_configs: [{ targets: ["localhost:9090"] }]
  - job_name: cadvisor
    static_configs: [{ targets: ["cadvisor:8080"] }]
  - job_name: node
    static_configs: [{ targets: ["node-exporter:9100"] }]
  - job_name: orders-api
    metrics_path: /metrics
    static_configs: [{ targets: ["api:3000"] }]       # orders_frontend network ပေါ်မှ ခေါ်
```

```bash
cd ~/devops-lab && docker compose up -d                 # App stack အရင်
cd monitoring && touch alerts.yml alertmanager.yml       # D8 တွင်ဖြည့်မည် (ယခုအချည်းနှီး)
echo 'route: {receiver: none}
receivers: [{name: none}]' > alertmanager.yml
docker compose up -d
```
- Prometheus Targets: http://localhost:9090/targets (အားလုံး **UP**)
- Grafana: http://localhost:3001 -> Connections -> Data sources -> Prometheus -> `http://prometheus:9090`
- Dashboard Import: **ID 893** (Docker/cAdvisor)၊ **ID 1860** (Node Exporter)

### Load ဖန်တီးပြီး Metric လှုပ်ရှားမှု ကြည့်
```bash
sudo apt install -y apache2-utils    # (သို့) brew install httpd
ab -n 5000 -c 20 http://localhost/orders
for i in $(seq 50); do curl -s localhost/error >/dev/null; done
for i in $(seq 20); do curl -s localhost/slow  >/dev/null & done
```

### အလုပ်ခွင်သုံး PromQL (RED Method: Rate, Errors, Duration)
Prometheus -> Graph တွင် စမ်း-
```promql
# Request Rate (req/s)
sum(rate(http_requests_total[1m]))

# Error Rate (%)
100 * sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# p95 Latency
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# Container Memory (MB) - နာမည်အလိုက်
container_memory_working_set_bytes{name=~"orders-.*"} / 1024 / 1024

# Container CPU (%)
sum by (name) (rate(container_cpu_usage_seconds_total{name=~"orders-.*"}[1m])) * 100

# Restart ဖြစ်မှု (နောက် ၁ နာရီ)
changes(container_start_time_seconds{name=~"orders-.*"}[1h])
```

### Grafana Dashboard ကိုယ်ပိုင်ဖန်တီး (Panels)
| Panel | Query | Type |
| :--- | :--- | :--- |
| Req/s | `sum(rate(http_requests_total[1m]))` | Time series |
| Error % | အပေါ်က Error Rate | Stat (Threshold: >1% အနီ) |
| p95 latency | `histogram_quantile(...)` | Time series |
| API Memory | `container_memory_working_set_bytes{name="orders-api-1"}` | Gauge |
| Up | `up{job="orders-api"}` | State timeline |

### ✅ စစ်ဆေးရန်
`/error` ကို ခေါ်လျှင် Error % Panel တက်လာ၊ `/slow` ခေါ်လျှင် p95 latency တက်လာကြောင်း Dashboard ပေါ်မှာ မြင်ရမည်။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
**RED (Request) + USE (Resource)** နှစ်မျိုးပေါင်းကြည့်မှ ပြည့်စုံသည်။ "Server CPU ကောင်းပေမယ့် Error Rate ၁၀%" ကဲ့သို့ပြဿနာကို ရှာနိုင်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Dashboard ကို JSON ဖြင့် Export လုပ်၍ Git ထဲသိမ်းပါ။ Grafana **Provisioning** (`/etc/grafana/provisioning`) ဖြင့် Data source + Dashboard ကို အလိုအလျောက် Load ဖြစ်စေပါ။

---

## 🔹 Lab D7 - Centralized Logging (Loki + Promtail)

**📋 Scenario:** Container ၁၀ လုံးရှိလျှင် `docker logs` ကို တစ်လုံးချင်းမကြည့်နိုင်ပါ။ "မနေ့ညက 02:10 မှာ ဘာ Error တက်ခဲ့လဲ" ကို တစ်နေရာတည်းမှ ရှာလိုသည်။

### အဆင့် ၁ - Log Rotation (Disk မပြည့်စေရန် အရင်ဆုံး!)
`/etc/docker/daemon.json` (Server ပေါ်)
```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "5" }
}
```
```bash
sudo systemctl restart docker      # Container အသစ်များမှသာ သက်ရောက်
docker inspect api --format '{{.HostConfig.LogConfig}}'
```
Compose တစ်ခုချင်းဆိုလျှင်-
```yaml
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "5" }
```

### အဆင့် ၂ - Structured (JSON) Log သုံး
App တွင် `console.log(JSON.stringify({level, msg, ...}))` ပုံစံ ရေးထားပြီးဖြစ် - Filter/Parse လွယ်သည်။

### အဆင့် ၃ - Loki Stack
`monitoring/docker-compose.yml` ၏ services ထဲ ထပ်ထည့်-
```yaml
  loki:
    image: grafana/loki:3.1.1
    command: -config.file=/etc/loki/local-config.yaml
    volumes: [lokidata:/loki]
    ports: ["3100:3100"]
    networks: [mon]
    restart: unless-stopped

  promtail:
    image: grafana/promtail:3.1.1
    command: -config.file=/etc/promtail/config.yml
    volumes:
      - ./promtail.yml:/etc/promtail/config.yml:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    networks: [mon]
    restart: unless-stopped
```
`volumes:` တွင် `lokidata: {}` ထပ်ထည့်။

`monitoring/promtail.yml`
```yaml
server:
  http_listen_port: 9080
positions:
  filename: /tmp/positions.yaml
clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: container
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: service
    pipeline_stages:
      - json:
          expressions:
            level: level
            msg: msg
      - labels:
          level:
```
```bash
docker compose up -d
```
Grafana -> Data sources -> Add **Loki** -> `http://loki:3100`

### အဆင့် ၄ - LogQL ဖြင့် ရှာ (Grafana -> Explore -> Loki)
```logql
# API ၏ Log အားလုံး
{service="api"}

# Error များသာ
{service="api"} | json | level="error"

# "boom" ပါသော စာကြောင်း
{service="api"} |= "boom"

# ၅ မိနစ်အတွင်း Error အရေအတွက်
sum(count_over_time({service="api"} | json | level="error" [5m]))

# Nginx 5xx
{service="proxy"} |~ "\" 5\\d\\d "
```

### Log ထုတ်လုပ်ပြီး စမ်း
```bash
for i in $(seq 30); do curl -s localhost/error >/dev/null; done
docker compose -f ~/devops-lab/docker-compose.yml stop db       # DB ရပ်
curl -s localhost/health      # 503 + Log "health failed"
```
Grafana Explore တွင် `{service="api"} | json | level="error"` ဖြင့် အချိန်နှင့်တကွ မြင်ရမည်။

### ✅ စစ်ဆေးရန်
DB ကိုရပ်လိုက်သည့် အချိန်၏ `health failed` Error Log ကို Grafana ထဲတွင် ၁ မိနစ်အတွင်း ရှာတွေ့ရမည်။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
Container ဖျက်လိုက်လျှင် `docker logs` ပါ ပျောက်သည် - **Log ကို Container ပြင်ပသို့ ပို့ထားရမည်**။ Log Rotation မထားလျှင် Disk ပြည့်ခြင်းသည် Docker Server များ၏ အဖြစ်အများဆုံး Incident တစ်ခု။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Grafana တွင် Metric Panel (Error %) နှင့် Log Panel (Error log) ကို Dashboard တစ်ခုတည်းတွင် ရောထည့်ပါ (Metric မှ Log သို့ ခုန်ကြည့်ခြင်း)။ Loki တွင် Retention (`retention_period: 168h`) သတ်မှတ်ပါ။

---

## 🔹 Lab D8 - Alerting Rules (Customer မတိုင်ကြားမီ သိရန်)

**📋 Scenario:** မနက် ၃ နာရီတွင် API ကျလျှင် Slack/Discord သို့ ချက်ချင်း Alert ရောက်ရမည်။ သို့သော် Alert များလွန်း၍ Noise မဖြစ်စေရ။

`monitoring/alerts.yml`
```yaml
groups:
  - name: orders-api
    rules:
      - alert: ApiDown
        expr: up{job="orders-api"} == 0
        for: 1m
        labels: { severity: critical }
        annotations:
          summary: "orders-api is DOWN"
          runbook: "Lab D9 - Clinic #1, #2"

      - alert: HighErrorRate
        expr: |
          100 * sum(rate(http_requests_total{status=~"5.."}[5m]))
              / sum(rate(http_requests_total[5m])) > 5
        for: 3m
        labels: { severity: critical }
        annotations:
          summary: "5xx error rate {{ $value | printf \"%.1f\" }}% (>5%)"

      - alert: HighLatencyP95
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(http_request_duration_seconds_bucket[5m]))) > 1
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "p95 latency {{ $value | printf \"%.2f\" }}s"

  - name: containers
    rules:
      - alert: ContainerRestartingFrequently
        expr: changes(container_start_time_seconds{name=~"orders-.*"}[15m]) > 2
        labels: { severity: critical }
        annotations:
          summary: "{{ $labels.name }} restarted {{ $value }} times in 15m (crash loop?)"

      - alert: ContainerHighMemory
        expr: |
          container_memory_working_set_bytes{name=~"orders-.*"}
            / container_spec_memory_limit_bytes{name=~"orders-.*"} > 0.9
          and container_spec_memory_limit_bytes{name=~"orders-.*"} > 0
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "{{ $labels.name }} memory >90% of limit (OOM risk)"

      - alert: ContainerHighCPU
        expr: sum by (name)(rate(container_cpu_usage_seconds_total{name=~"orders-.*"}[5m])) > 0.8
        for: 10m
        labels: { severity: warning }
        annotations:
          summary: "{{ $labels.name }} CPU high"

  - name: host
    rules:
      - alert: DiskFillingUp
        expr: predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[1h], 4*3600) < 0
        for: 10m
        labels: { severity: critical }
        annotations:
          summary: "Disk will be full in <4h on {{ $labels.instance }}"

      - alert: HostHighMemory
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
        for: 5m
        labels: { severity: warning }
```

`monitoring/alertmanager.yml` (Discord webhook နမူနာ - Slack/Teams လည်းရ)
```yaml
route:
  receiver: team
  group_by: [alertname]
  group_wait: 30s          # အတူတူသော Alert များကို စုပေါင်း
  group_interval: 5m
  repeat_interval: 4h      # မဖြေရှင်းသေးလျှင် ၄ နာရီတစ်ခါ သတိပေး
  routes:
    - matchers: [severity="critical"]
      receiver: team
      repeat_interval: 1h

inhibit_rules:             # Critical ရှိလျှင် Warning ကို ဖိနှိပ် (Noise လျှော့)
  - source_matchers: [severity="critical"]
    target_matchers: [severity="warning"]
    equal: [alertname]

receivers:
  - name: team
    discord_configs:
      - webhook_url: "https://discord.com/api/webhooks/XXX/YYY"
```
```bash
docker compose exec prometheus promtool check rules /etc/prometheus/alerts.yml
curl -X POST localhost:9090/-/reload
# http://localhost:9090/alerts
```

### Alert တစ်ခုချင်း စမ်းသပ်ဖြစ်စေ

| Alert | ဖြစ်စေပုံ | ကြာချိန် |
| :--- | :--- | :-: |
| ApiDown | `docker compose -f ~/devops-lab/docker-compose.yml stop api` | ~1 မိ |
| HighErrorRate | `while true; do curl -s localhost/error >/dev/null; sleep 0.2; done` | ~3 မိ |
| HighLatencyP95 | `while true; do curl -s localhost/slow >/dev/null & sleep 0.3; done` | ~5 မိ |
| ContainerRestarting | `for i in 1 2 3 4; do docker restart orders-api-1; sleep 20; done` | ~2 မိ |
| ContainerHighMemory | `for i in $(seq 10); do curl -s localhost/leak; done` (limit 256M) | ~5 မိ |

### ✅ စစ်ဆေးရန်
Alert ၅ ခုလုံးကို တစ်ခုချင်း Trigger လုပ်ပြီး Discord/Slack သို့ ရောက်ကြောင်းနှင့် ပြန်ကောင်းလျှင် **Resolved** ရောက်ကြောင်း ပြပါ။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
- Alert တိုင်းတွင် **Runbook link** ပါရမည် (၃ နာရီတွင် နိုးလာသူက ဘာလုပ်ရမလဲသိရန်)။
- **`for:`** ကြာချိန်ဖြင့် Flapping ကိုကာ။ **Symptom (Error rate, Latency)** ကို Alert လုပ် - Cause (CPU) တစ်ခုတည်းအပေါ် မမူတည်ပါ။
- "Alert ရောက်ပြီး ဘာမှမလုပ်ရ" ဆိုလျှင် ထို Alert ကို ဖျက်ပါ (Alert fatigue)။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** **SLO** တစ်ခုသတ်မှတ် ("Request ၉၉.၅% သည် ၅၀၀ms အောက်")။ Error Budget Burn-rate Alert ရေးကြည့်ပါ။ Blackbox Exporter ဖြင့် အပြင်မှ Website Probe + SSL Expiry Alert ထည့်ပါ။

---

# 🟥 PART D - Troubleshooting & Release

## 🔹 Lab D9 - Troubleshooting Clinic (ပျက်နေသော Container ၁၀ မျိုး)

**📋 Scenario:** အောက်ပါ Case တစ်ခုချင်းသည် အလုပ်ခွင်တွင် အမြဲကြုံရသော ပြဿနာများဖြစ်သည်။ **ပထမ ကိုယ်တိုင်ဖန်တီး -> ရောဂါလက္ခဏာကြည့် -> အကြောင်းရင်းရှာ -> ပြင်** ဟူသော အစီအစဉ်ဖြင့် လုပ်ပါ။

### 🩺 Diagnostic Flow (ပထမဆုံး အမြဲလုပ်)
```bash
docker ps -a                                   # ① အခြေအနေ (Up? Exited? Restarting? (unhealthy)?)
docker logs --tail 100 -f NAME                 # ② Log
docker inspect NAME --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.State.Error}}'   # ③ ဘာကြောင့်ရပ်
docker inspect NAME --format '{{json .State.Health}}' | jq   # ④ Healthcheck ရလဒ်
docker exec -it NAME sh                        # ⑤ အထဲဝင်စစ်
docker events --since 10m                      # ⑥ Docker event
docker stats --no-stream                       # ⑦ Resource
```

### 🔢 Exit Code ဖတ်ပုံ
| Exit Code | အဓိပ္ပါယ် | နောက်ထပ်စစ်ရန် |
| :-: | :--- | :--- |
| 0 | ပုံမှန်ပြီးဆုံး | CMD က ချက်ချင်းပြီးသွား? (Foreground မဟုတ်) |
| 1 | App Error | `docker logs` |
| 126 | Command Execute မရ | Permission / Shebang |
| 127 | Command မတွေ့ | CMD/PATH/Alpine မှာ bash မရှိ |
| 137 | SIGKILL (128+9) | **OOMKilled?** / `docker kill` |
| 139 | Segfault | Native lib / Architecture |
| 143 | SIGTERM (128+15) | `docker stop` ပုံမှန် |

---

### 🧪 Case 1 - Crash Loop (Restarting)
**ဖန်တီး:**
```bash
docker run -d --name c1 --restart unless-stopped -e REQUIRED_VAR= alpine sh -c 'test -n "$REQUIRED_VAR" || { echo "ERROR: REQUIRED_VAR missing"; exit 1; }'
sleep 5; docker ps -a --filter name=c1
```
**လက္ခဏာ:** `STATUS: Restarting (1) ...`
**ရှာ:** `docker logs c1` -> `REQUIRED_VAR missing`
**ပြင်:**
```bash
docker rm -f c1
docker run -d --name c1 --restart unless-stopped -e REQUIRED_VAR=hello alpine sleep 3600
```
**ကာကွယ်:** App စတင်ချိန်တွင် Config Validate လုပ်ပြီး **ရှင်းလင်းသော Error** ပြ။ Compose တွင် `restart: on-failure:5` ဖြင့် အဆုံးမရှိ Loop မဖြစ်စေ။

---

### 🧪 Case 2 - OOMKilled (Exit 137)
**ဖန်တီး:**
```bash
docker run -d --name c2 -p 3010:3000 --memory=100m --memory-swap=100m orders-api:good
for i in $(seq 8); do curl -s localhost:3010/leak; echo; done
sleep 2
docker inspect c2 --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}'
```
**လက္ခဏာ:** Container ရုတ်တရက်ပျောက်၊ `exit=137 oom=true`၊ App Log တွင် Error မရှိ!
**ရှာ:** `docker inspect` ၏ `OOMKilled`၊ `dmesg -T | grep -i oom` (Host)၊ Grafana Memory Panel
**ပြင် (အဆင့်ဆင့်):**
1. ယာယီ - `--memory=512m` တိုး
2. ပြင်သင့်သည် - Leak ကို Code ပြင်၊ Node ဆိုလျှင် `NODE_OPTIONS=--max-old-space-size=200` ကို limit ထက်နည်းစေ
3. ကာကွယ် - Alert `ContainerHighMemory` (D8)
```bash
docker rm -f c2
```

---

### 🧪 Case 3 - Port Already Allocated
**ဖန်တီး:**
```bash
docker run -d --name c3a -p 8081:80 nginx:alpine
docker run -d --name c3b -p 8081:80 nginx:alpine
```
**လက္ခဏာ:** `Bind for 0.0.0.0:8081 failed: port is already allocated`
**ရှာ:**
```bash
docker ps --format '{{.Names}}\t{{.Ports}}' | grep 8081
sudo lsof -i :8081          # (သို့) sudo ss -tulpn | grep 8081   <- Docker မဟုတ်သော process လည်းဖြစ်နိုင်
```
**ပြင်:** Port ပြောင်း (`-p 8082:80`) သို့ ယခင် Container ရပ်။ `docker rm -f c3a c3b`

---

### 🧪 Case 4 - Container များ အချင်းချင်း ချိတ်ဆက်မရ (DNS/Network)
**ဖန်တီး:**
```bash
docker network create net-a && docker network create net-b
docker run -d --name web4 --network net-a nginx:alpine
docker run -d --name client4 --network net-b alpine sleep 3600
docker exec client4 wget -qO- -T 3 http://web4        # ❌ bad address 'web4'
```
**လက္ခဏာ:** `bad address` / `Could not resolve host`
**ရှာ:**
```bash
docker inspect web4    --format '{{json .NetworkSettings.Networks}}' | jq 'keys'
docker inspect client4 --format '{{json .NetworkSettings.Networks}}' | jq 'keys'    # Network မတူ!
```
**ပြင်:**
```bash
docker network connect net-a client4
docker exec client4 wget -qO- -T 3 http://web4 | head -3       # ✅
```
**သတိ:** Default `bridge` network တွင် **နာမည်ဖြင့် DNS မရ** - User-defined network (သို့) Compose ကိုသာ သုံး။ `localhost` သည် Container ကိုယ်တိုင်ကိုသာ ဆိုလိုသည် (Host/အခြား Container မဟုတ်)။
```bash
docker rm -f web4 client4; docker network rm net-a net-b
```

---

### 🧪 Case 5 - Volume Permission Denied
**ဖန်တီး:**
```bash
mkdir -p /tmp/c5data && sudo chown root:root /tmp/c5data && sudo chmod 755 /tmp/c5data
docker run --rm -u 1000:1000 -v /tmp/c5data:/data alpine sh -c 'echo hi > /data/x.txt'
```
**လက္ခဏာ:** `can't create /data/x.txt: Permission denied`
**ရှာ:**
```bash
ls -ldn /tmp/c5data                      # owner uid=0
docker run --rm -u 1000:1000 alpine id   # uid=1000
```
**ပြင် (ရွေးနိုင်):**
```bash
sudo chown 1000:1000 /tmp/c5data                              # ① Host ဘက်ပြင်
# ② Named volume + Dockerfile တွင် RUN mkdir -p /data && chown node:node /data
# ③ Compose: user: "1000:1000" ကို Host UID နှင့် ညှိ
docker run --rm -u 1000:1000 -v /tmp/c5data:/data alpine sh -c 'echo hi > /data/x.txt && cat /data/x.txt'
```
**သတိ:** `chmod 777` ဖြင့် ဖြေရှင်းခြင်းကို Production တွင် မလုပ်ပါနှင့်။

---

### 🧪 Case 6 - (unhealthy) နှင့် Dependency
**ဖန်တီး:**
```bash
cd ~/devops-lab && docker compose up -d
docker compose stop db
sleep 40
docker compose ps                   # api: (unhealthy)
curl -i localhost/health            # 503 + err
```
**ရှာ:**
```bash
docker inspect orders-api-1 --format '{{range .State.Health.Log}}{{.ExitCode}} {{.Output}}{{end}}' | tail -3
docker compose logs --tail 20 api       # "health failed ... ENOTFOUND db" / "ECONNREFUSED"
docker compose ps db                    # Exited
```
**ပြင်:** `docker compose up -d db` -> api သည် အလိုအလျောက် `healthy` ပြန်ဖြစ်။
**သင်ခန်းစာ:** ပြဿနာသည် **api မဟုတ်၊ db** ဖြစ်သည်။ `unhealthy` ဖြစ်သော Container ၏ Dependency ကို အမြဲစစ်။ Healthcheck ကို Dependency အားလုံးပါ စစ်သင့်/မသင့် ဆုံးဖြတ်ချက် (Cascading failure ကာကွယ်ရန် Liveness vs Readiness ခွဲရေးသင့်) ကိုလည်း စဉ်းစား။

---

### 🧪 Case 7 - Disk Full ဖြစ်စေသော Docker
**ဖန်တီး (လုံခြုံသော စံနမူနာ):**
```bash
# Log မရိုက်နှိပ်ဘဲ ထုတ်သော Container
docker run -d --name c7 --log-driver json-file alpine sh -c 'while true; do echo "$(date) spam spam spam spam spam spam spam spam"; done'
sleep 20
ls -lh $(docker inspect c7 --format '{{.LogPath}}') 2>/dev/null   # Linux Host (Mac Docker Desktop တွင်ကြည့်မရ)
docker system df
```
**လက္ခဏာ:** Log ဖိုင် GB ပေါင်းများစွာ၊ Host Disk 100%။
**ရှာ:**
```bash
docker system df -v | head -30
sudo du -sh /var/lib/docker/* | sort -rh | head
sudo du -h /var/lib/docker/containers/*/*-json.log | sort -rh | head -3
```
**ပြင်:**
```bash
docker rm -f c7
docker system prune -f                       # Stopped containers, dangling images
docker builder prune -f                      # Build cache
# Log ဖိုင်ကြီးကို ချက်ချင်းလျှော့ (Container မရပ်ဘဲ)
sudo truncate -s 0 /var/lib/docker/containers/<id>/<id>-json.log
```
**ကာကွယ်:** `daemon.json` ၏ `max-size/max-file` (D7)၊ Alert `DiskFillingUp` (D8)၊ Cron `docker system prune` (သတိ: `-a`/volumes မထည့်)

---

### 🧪 Case 8 - `exec format error` (Architecture)
**ဖန်တီး:**
```bash
docker run --rm --platform linux/arm64 alpine uname -m          # Mac M-series: arm64 ရ
docker run --rm --platform linux/amd64 alpine uname -m          # emulation ဖြင့် x86_64
# ပြဿနာပုံစံ - Mac (arm64) တွင် Build ပြီး amd64 Linux Server တွင် Run လျှင်
docker buildx imagetools inspect YOUR_USER/orders-api:latest | grep -i platform
```
**လက္ခဏာ:** Server တွင် `exec /usr/local/bin/docker-entrypoint.sh: exec format error`
**ရှာ:** `uname -m` (Server) နှင့် `docker image inspect --format '{{.Architecture}}' IMAGE`
**ပြင်:**
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t YOUR_USER/orders-api:1.0.1 --push ./app
```
CI တွင် `platforms: linux/amd64,linux/arm64` (D3 တွင်ပါပြီ)။

---

### 🧪 Case 9 - Build Cache / "ပြင်ပြီးတာ မပြောင်းဘူး"
**ဖန်တီး:**
```bash
cd ~/devops-lab/app
sed -i.bak 's/dev/DEV-A/' server.js 2>/dev/null; docker build -t orders-api:c9 .
# Dockerfile ၏ `COPY . .` ကို npm install အပေါ်သို့ရွှေ့ထားလျှင် Dependency အကုန်ပြန်ဒေါင်းမည် (နှေး)
docker build -t orders-api:c9 . 2>&1 | grep -E "CACHED|RUN"
```
**ရှာ:** `docker build` Output ၏ `CACHED` နေရာများ၊ `docker history`
**ပြင်:**
```bash
docker build --no-cache -t orders-api:c9 .          # Cache မသုံး
docker compose up -d --build --force-recreate api   # Compose တွင် Image ပြန် Build + Container အသစ်
docker compose pull && docker compose up -d         # Registry မှ Image သုံးလျှင်
```
**သတိ:** Layer Order မှန်ရမည် - **ပြောင်းလဲမှုနည်းသော (package.json) အရင်၊ မကြာခဏပြောင်းသော (source) နောက်**။ `latest` tag သည် Server တွင် Cache ကျန်နေ၍ `docker pull` မလုပ်လျှင် အဟောင်းကိုသာ Run (D5 အရ SHA tag သုံးရခြင်း၏ အကြောင်းရင်း)။

---

### 🧪 Case 10 - Compose ၌ Env/Secret မဖတ်ရ & Time-skew / Zombie
**10-A Env မဖတ်ရ:**
```bash
cd ~/devops-lab
docker compose config | grep -A3 DB_PASSWORD                    # အမှန်တကယ် ဝင်သွားသော တန်ဖိုး
docker compose exec api printenv | grep -E "DB_|REDIS"
# .env တွင် Space/Quote မှား၊ ဖိုင်နာမည်မှား (.env.prod) -> တန်ဖိုးအလွတ်
```
`docker compose config` သည် **Env interpolation ရလဒ်ကို Run မတိုင်မီ** မြင်ရသော အကောင်းဆုံး Tool။

**10-B Zombie / PID 1:**
```bash
docker run -d --name c10 alpine sh -c 'sleep 1000 & sleep 1000'
docker exec c10 ps
docker stop -t 3 c10; echo "stop ကြာချိန်စစ်" 
# ENTRYPOINT ["dumb-init","--"] / docker run --init ဖြင့် Signal+Zombie အဖြေ
docker run -d --init --name c10b alpine sleep 1000 && time docker stop c10b
docker rm -f c10 c10b
```

---

### 📋 Troubleshooting Cheat-sheet (Print ထုတ်ထားပါ)

| လက္ခဏာ | ပထမ Command | ပုံမှန် အကြောင်းရင်း |
| :--- | :--- | :--- |
| `Exited (1)` | `docker logs` | App Error / Config မရှိ |
| `Exited (137)` | `inspect .State.OOMKilled` | Memory limit |
| `Restarting` | `docker logs --tail 50` | Crash loop |
| `(unhealthy)` | `inspect .State.Health` | Dependency / Endpoint |
| Port connect မရ | `ss -tulpn`, `docker port` | Port map မှား / Bind 127.0.0.1 |
| Name resolve မရ | `inspect .NetworkSettings.Networks` | Network မတူ |
| Permission denied | `ls -ldn`, `id` | UID မကိုက် |
| Disk Full | `docker system df -v` | Log / Image / Volume |
| Update မဖြစ် | `docker history`, Tag | Cache / `latest` stale |
| `exec format error` | `uname -m` | Architecture |
| Container နှေး | `docker stats`, `top` | CPU throttling (limit) |

### ✅ စစ်ဆေးရန်
Case ၁၀ ခုလုံးကို ကိုယ်တိုင်ဖန်တီးပြီး **"လက္ခဏာ -> ရှာဖွေပုံ -> ပြင်ပုံ"** ကို သင့်ကိုယ်ပိုင် Troubleshooting Notebook (Markdown) တွင် မှတ်တမ်းတင်ပါ။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
Interview နှင့် On-call တွင် **"Container ကျနေတယ်၊ ဘာလုပ်မလဲ?"** ကို စနစ်တကျ အဖြေပေးနိုင်ခြင်းသည် Junior နှင့် Mid ကို ခွဲခြားသည်။ အစဉ်လိုက်: **State -> Logs -> Exit code -> Inspect -> Exec -> Host resource**။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** သူငယ်ချင်းတစ်ယောက်ကို Case ၃ ခုကို လျှို့ဝှက်ဖန်တီးခိုင်း၍ သင်က Diagnostic Flow ဖြင့် ၅ မိနစ်စီအတွင်း ရှာဖွေပြပါ (Game Day)။

---

## 🔹 Lab D10 - Rolling / Blue-Green Deploy + Rollback (Zero-downtime)

**📋 Scenario:** D4 ၏ Deploy သည် Container ကို ရပ်ပြီး အသစ်စသဖြင့် စက္ကန့်အနည်းငယ် Downtime ရှိသည်။ Release လုပ်နေစဉ် User တစ်ဦးမျှ Error မမြင်စေရ။

### နည်း A - Blue/Green (Nginx ဖြင့် အလွယ်ဆုံး)
```
          +--> api-blue  (v1, လက်ရှိ Live)
 Nginx ---|
          +--> api-green (v2, စမ်းနေ)       <- Switch လုပ်ရန် Nginx upstream ပြောင်းရုံ
```
`docker-compose.bluegreen.yml`
```yaml
name: bg
services:
  proxy:
    image: nginx:1.27-alpine
    ports: ["8088:80"]
    volumes:
      - ./nginx/active.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [web]

  api-blue:
    image: ${IMAGE}:${BLUE_TAG}
    environment: { APP_VERSION: "${BLUE_TAG}" }
    healthcheck: &hc
      test: ["CMD-SHELL", "curl -fs http://localhost:3000/health || exit 1"]
      interval: 5s
      timeout: 3s
      retries: 3
    networks: [web]

  api-green:
    image: ${IMAGE}:${GREEN_TAG}
    environment: { APP_VERSION: "${GREEN_TAG}" }
    healthcheck: *hc
    networks: [web]

networks:
  web:
```
`nginx/active.conf` (Blue = Live)
```nginx
upstream live { server api-blue:3000; }
server {
    listen 80;
    location / { proxy_pass http://live; proxy_set_header Host $host; }
}
```

`switch.sh`
```bash
#!/bin/bash
set -euo pipefail
TARGET="${1:?blue|green}"
cd "$(dirname "$0")"

# 1) Target ကို Health check အရင်စစ်
CID=$(docker compose -f docker-compose.bluegreen.yml ps -q api-$TARGET)
for i in $(seq 1 20); do
  [ "$(docker inspect -f '{{.State.Health.Status}}' "$CID")" = "healthy" ] && break
  sleep 2
done
[ "$(docker inspect -f '{{.State.Health.Status}}' "$CID")" = "healthy" ] || { echo "target not healthy"; exit 1; }

# 2) Config ပြောင်းပြီး Nginx ကို Reload (Connection မဖြတ်)
sed "s/server api-[a-z]*:3000/server api-$TARGET:3000/" nginx/active.conf > nginx/active.conf.new
mv nginx/active.conf.new nginx/active.conf
docker compose -f docker-compose.bluegreen.yml exec proxy nginx -t
docker compose -f docker-compose.bluegreen.yml exec proxy nginx -s reload
echo "LIVE -> $TARGET"
```
```bash
chmod +x switch.sh
export IMAGE=YOUR_USER/orders-api BLUE_TAG=sha-aaaaaaa GREEN_TAG=sha-bbbbbbb
docker compose -f docker-compose.bluegreen.yml up -d
curl localhost:8088            # blue version
```

### Downtime စစ်ဆေးသည့် Load Test (သီးခြား Terminal)
```bash
while true; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -m 1 localhost:8088/orders)
  echo "$(date +%T) $code"
  sleep 0.1
done | tee /tmp/switch.log
```
```bash
# Terminal နောက်တစ်ခုတွင် Switch
./switch.sh green
curl localhost:8088            # green version

# Rollback (ပြဿနာရှိလျှင် ၁ စက္ကန့်အတွင်း)
./switch.sh blue

# ရလဒ်စစ်
grep -vc " 200$" /tmp/switch.log      # non-200 အရေအတွက် = 0 ဖြစ်ရမည်
```

### နည်း B - Compose Rolling (Replica ၂ ခုခွဲ၍ တစ်ခုချင်း)
```bash
docker compose up -d --scale api=2 --no-recreate
# Nginx upstream သည် service name `api` ကို DNS ဖြင့် round-robin
docker compose up -d --no-deps --scale api=2 --force-recreate api
```
> Docker Compose တစ်ခုတည်းဖြင့် စစ်မှန်သော Rolling update ကို ပြည့်ပြည့်ဝဝ မပေး။ **Kubernetes `Deployment` (RollingUpdate, `maxUnavailable: 0`)** သို့မဟုတ် Docker Swarm (`update_config`) သည် အလုပ်ခွင်တွင် ပိုသင့်တော်သည် (နောက်ဆက်တွဲ အခန်းများ)။

### Database Migration နှင့် Release (အလုပ်ခွင်၏ အခက်ခဲဆုံးအပိုင်း)
```
 ❌ အန္တရာယ်:  v2 code က column ကို rename   -> v1 (လက်ရှိ Live) ကျ
 ✅ Expand/Contract Pattern:
    Release 1: column အသစ် ADD (v1/v2 နှစ်ခုလုံး အလုပ်လုပ်)
    Release 2: Code ကို column အသစ်သို့ ကူး (နှစ်ခုစလုံးရေး)
    Release 3: Column အဟောင်း DROP (Rollback မလိုတော့မှ)
```

### ✅ စစ်ဆေးရန်
Switch လုပ်စဉ် Load Test Log တွင် **Non-200 = 0** ဖြစ်ပြီး `./switch.sh blue` ဖြင့် ၁ စက္ကန့်အတွင်း Rollback ပြုလုပ်နိုင်ကြောင်း သက်သေပြပါ။

### 🧠 အလုပ်ခွင်တွင် ဘာကြောင့်လဲ
Blue/Green = **Rollback သည် Traffic ပြောင်းရုံ** (Redeploy မလိုလို့ အလွန်မြန်)။ ဆိုးကျိုး - Infra ၂ ဆလို။ Canary (Traffic 5% ကိုသာ Version အသစ်သို့) သည် နောက်တစ်ဆင့် (Nginx `split_clients` / K8s Ingress / Argo Rollouts)။ **DB Migration** ကို Backward-compatible ဖြစ်အောင်ရေးခြင်းသည် Zero-downtime ၏ အဓိကသော့ချက်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Nginx `split_clients "${remote_addr}" { 10% green; * blue; }` ဖြင့် Canary 10% ကို ဖန်တီးပါ။ Grafana တွင် Error rate ကို Blue/Green အလိုက်ခွဲကြည့်ပြီး Green ဆိုးလျှင် Auto-rollback script ရေးပါ။

---

## 🏆 Capstone - "Idea မှ Production Monitoring အထိ" (၁ ရက်တာ Project)

ကိုယ်ပိုင် App (Node/PHP/Python) တစ်ခုဖြင့် အောက်ပါ **အဆုံးအထိ** Pipeline ကို တည်ဆောက်ပါ-

| # | Deliverable | Lab |
| :-: | :--- | :-: |
| 1 | Multi-stage, non-root, healthcheck ပါ Dockerfile | D1 |
| 2 | App + DB + Cache + Proxy Compose Stack (Network ခွဲ) | D2 |
| 3 | PR တွင် Test+Scan၊ main တွင် Push (SHA Tag) | D3 |
| 4 | Staging Auto-deploy + Prod Manual Approve + Auto-rollback | D4 |
| 5 | Image တိုင်းတွင် Git SHA Label၊ Digest-pinned base | D5 |
| 6 | Grafana Dashboard (RED + USE) + Provisioning | D6 |
| 7 | Loki Log + Docker log rotation | D7 |
| 8 | Alert ≥ ၆ ခု (Runbook link ပါ) -> Discord/Slack | D8 |
| 9 | Troubleshooting Notebook (Case ၁၀ ခု) | D9 |
| 10 | Blue/Green Zero-downtime + Rollback ဖြင့် Load test non-200 = 0 | D10 |

### 🎬 နောက်ဆုံး Game Day (Incident Drill)
Production-like Server တွင် အောက်ပါအစီအစဉ်ကို အချိန်တိုင်းပြီး လုပ်ပါ-

```
 T+0   သူငယ်ချင်းက ပျက်စီးမှု တစ်ခုထည့် (Bad release / Memory leak / DB stop)
 T+?   Alert Discord တွင်ရောက် ........ (Detection time ကို မှတ်)
 T+?   Dashboard + Log ဖြင့် ရှာဖွေ ...... (Diagnosis time)
 T+?   Rollback / Fix .................. (Recovery time)
 T+?   Postmortem 1 မျက်နှာ ရေး
```
| Metric | ပစ်မှတ် |
| :--- | :-: |
| **MTTD** (Detect) | < 3 မိနစ် |
| **MTTR** (Recover) | < 15 မိနစ် |
| Postmortem Action items | ≥ 3 ခု |

---

## 🏁 Checklist

| Lab | ကိုယ်တိုင်ပြန်လုပ်နိုင်ပြီလား? |
| :--- | :-: |
| D1 Production Dockerfile | ⬜ |
| D2 Multi-container Compose | ⬜ |
| D3 CI (Test/Build/Scan/Push) | ⬜ |
| D4 CD SSH Deploy + Rollback | ⬜ |
| D5 Versioning & Digest | ⬜ |
| D6 Prometheus/Grafana | ⬜ |
| D7 Loki Logging | ⬜ |
| D8 Alerting | ⬜ |
| D9 Troubleshooting Clinic (၁၀) | ⬜ |
| D10 Blue/Green Zero-downtime | ⬜ |

## 🎯 နောက်ဆက်တွဲ လေ့လာရန်

| ခေါင်းစဉ် | လင့်ခ် |
| :--- | :--- |
| Docker CI/CD & Registries (သီအိုရီ) | [09_docker_cicd_and_registries](/devops/02_kubernetes_and_cloud/09_docker_cicd_and_registries/) |
| Docker Security & Hardening | [08_docker_security_and_hardening](/devops/02_kubernetes_and_cloud/08_docker_security_and_hardening/) |
| Kubernetes (Rolling update ကို Native ရ) | [11_k8s_architecture_and_setup](/devops/02_kubernetes_and_cloud/11_k8s_architecture_and_setup/) |
| Observability & GitOps | [20_observability_gitops_and_cloud](/devops/02_kubernetes_and_cloud/20_observability_gitops_and_cloud/) |
| Linux Pro Labs (Prometheus, HA, DR) | [22_pro_level_real_work_labs](/linux/22_pro_level_real_work_labs/) |
