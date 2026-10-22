---
title: "11. Docker & Docker Hub Step-by-Step (Beginner to DevOps)"
description: "Docker ကို အစကနေ DevOps level အထိ အဆင့်ဆင့် လက်တွေ့လုပ်ကြည့်နိုင်သော လမ်းညွှန်။ Install, Run, Dockerfile, Docker Hub Push/Pull, Compose, CI/CD။"
---

## 🎯 ဤသင်ခန်းစာ၏ ရည်ရွယ်ချက်

Docker ကို **လုံးဝ မသိသေးသူ** တစ်ယောက်က အောက်ပါ DevOps လုပ်ငန်းစဉ်ကို ကိုယ်တိုင် လုပ်နိုင်အောင် အဆင့်ဆင့် လေ့ကျင့်ရန်ဖြစ်သည်။

```
 Code ရေး  ->  Dockerfile  ->  Image Build  ->  Test (Container)
                                                     |
                                                     v
   Server မှာ Pull & Run  <-  Docker Hub (Push)  <-  Tag
                                                     ^
                                  CI/CD (GitHub Actions) က အလိုအလျောက်လုပ်
```

| အဆင့် (Level) | လုပ်နိုင်ရမည့်အရာ |
| :--- | :--- |
| 🟢 Level 1 | Docker Install, `docker run`, Container စီမံခြင်း |
| 🟡 Level 2 | Dockerfile ရေးပြီး ကိုယ်ပိုင် Image Build |
| 🟠 Level 3 | Docker Hub Account, Push / Pull, Tag, Private Repo |
| 🔴 Level 4 | Docker Compose, Volume, Network |
| 🔵 Level 5 | GitHub Actions ဖြင့် Docker Hub သို့ Auto Push (CI/CD) |
| ⚫ Level 6 | Server (VM) တွင် Deploy, Troubleshooting, Best Practices |

---

# 🟢 Level 1 - Docker စတင်အသုံးပြုခြင်း

## အဆင့် ၁။ Docker Install လုပ်ခြင်း

### macOS / Windows
1. https://www.docker.com/products/docker-desktop/ မှ **Docker Desktop** ဒေါင်းပါ။
2. Install ပြီး Docker Desktop ကို ဖွင့်ပါ (ဘယ်ဘက်အောက်ထောင့်တွင် "Engine running" စိမ်းနေရမည်)။

### Ubuntu / Debian Linux
```bash
# တရားဝင် install script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# sudo မလိုဘဲ docker သုံးနိုင်ရန် (logout/login ပြန်ဝင်ရမည်)
sudo usermod -aG docker $USER
newgrp docker
```

## အဆင့် ၂။ Install မှန်မမှန် စစ်ခြင်း

```bash
docker --version
docker compose version
docker run hello-world
```

`Hello from Docker!` ဟု မြင်ရပါက အောင်မြင်ပြီ။ ဤ command တစ်ခုက ဖြစ်ပျက်သွားသည့် အဆင့်များ-

```
1. docker CLI  -> Docker Daemon ကို "hello-world run ပေးပါ" ဟု ပြောသည်
2. Daemon      -> Local တွင် Image မရှိတာ တွေ့သည်
3. Daemon      -> Docker Hub မှ Image ကို Pull လုပ်သည်
4. Daemon      -> Image မှ Container ဖန်တီးပြီး Run သည်
5. Output ကို Terminal သို့ ပြန်ပို့သည်
```

## အဆင့် ၃။ ပထမဆုံး Web Server Container Run ကြည့်ခြင်း

```bash
docker run -d --name web1 -p 8080:80 nginx:alpine
```

| Flag | အဓိပ္ပါယ် |
| :--- | :--- |
| `-d` | Background (detached) တွင် Run |
| `--name web1` | Container နာမည်ပေး |
| `-p 8080:80` | `HOST_PORT:CONTAINER_PORT` - မိမိစက် 8080 -> Container 80 |
| `nginx:alpine` | သုံးမည့် Image (`name:tag`) |

Browser တွင် http://localhost:8080 ဖွင့်ကြည့်ပါ။

## အဆင့် ၄။ Container စီမံခြင်း နေ့စဉ်သုံး Command များ

```bash
docker ps                 # Run နေသော container များ
docker ps -a              # ရပ်ထားသည်များ အပါအဝင် အားလုံး
docker logs web1          # Log ကြည့်
docker logs -f web1       # Log ကို live ဆက်ကြည့် (Ctrl+C ဖြင့်ထွက်)
docker exec -it web1 sh   # Container ထဲ ဝင်ကြည့်
docker stop web1          # ရပ်
docker start web1         # ပြန်စ
docker restart web1       # Restart
docker rm -f web1         # အတင်းရပ်ပြီး ဖျက်
docker stats              # CPU/RAM သုံးစွဲမှု live
docker inspect web1       # အသေးစိတ် JSON (IP, Mounts, Env)
```

### ✅ လေ့ကျင့်ခန်း ၁
1. `nginx:alpine` ကို port `9090` တွင် `web2` အမည်ဖြင့် run ပါ။
2. `docker exec -it web2 sh` ဖြင့် ဝင်ပြီး `ls /usr/share/nginx/html` ကြည့်ပါ။
3. `exit` ဖြင့်ထွက်ပြီး `docker rm -f web2` လုပ်ပါ။

## အဆင့် ၅။ Image များ စီမံခြင်း

```bash
docker images                 # Local Image စာရင်း
docker pull ubuntu:22.04      # Pull (ဒေါင်းရုံ)
docker rmi ubuntu:22.04       # Image ဖျက်
docker image prune            # မသုံးတော့သော (dangling) image ရှင်း
docker system df              # Docker က disk ဘယ်လောက်စားနေလဲ
docker system prune -a        # ⚠️ မသုံးသည့် အားလုံးရှင်း (သတိထားပါ)
```

---

# 🟡 Level 2 - Dockerfile ရေးပြီး ကိုယ်ပိုင် Image Build

## အဆင့် ၆။ နမူနာ Project ပြင်ဆင်ခြင်း (Node.js)

```bash
mkdir my-first-app && cd my-first-app
```

`app.js`
```javascript
const http = require("http");
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.end("Hello from my Docker image! v1\n");
}).listen(port, () => console.log("Listening on " + port));
```

`package.json`
```json
{
  "name": "my-first-app",
  "version": "1.0.0",
  "scripts": { "start": "node app.js" }
}
```

## အဆင့် ၇။ Dockerfile ရေးခြင်း

`Dockerfile` (ဖိုင်အမည် D အကြီး၊ extension မပါ)
```dockerfile
# 1) Base image
FROM node:20-alpine

# 2) Container ထဲ အလုပ်လုပ်မည့် folder
WORKDIR /app

# 3) Dependency file အရင်ကူး (Layer cache အတွက် အရေးကြီး)
COPY package*.json ./
RUN npm install --omit=dev

# 4) Source code ကူး
COPY . .

# 5) Non-root user (Security)
USER node

# 6) Port document လုပ်
EXPOSE 3000

# 7) စတင်မည့် command
CMD ["npm", "start"]
```

`.dockerignore`
```
node_modules
.git
.env
*.log
Dockerfile
```

> 💡 `.dockerignore` မပါလျှင် `node_modules`, `.env` (လျှို့ဝှက်ချက်) တို့ပါ Image ထဲ ဝင်သွားနိုင်သည်။

## အဆင့် ၈။ Image Build လုပ်ခြင်း

```bash
docker build -t my-first-app:1.0 .
```

- `-t name:tag` -> Image အမည်နှင့် Version ပေး
- နောက်ဆုံးက `.` -> Build Context (လက်ရှိ folder)

```bash
docker images | grep my-first-app
docker history my-first-app:1.0     # Layer တစ်ခုချင်း size ကြည့်
```

## အဆင့် ၉။ Run ပြီး စမ်းခြင်း

```bash
docker run -d --name app1 -p 3000:3000 my-first-app:1.0
curl http://localhost:3000
# Hello from my Docker image! v1
```

Environment variable ပြောင်းပြီး Run:
```bash
docker run -d --name app2 -p 3001:3001 -e PORT=3001 my-first-app:1.0
curl http://localhost:3001
```

### ✅ လေ့ကျင့်ခန်း ၂
1. `app.js` ၏ စာသားကို `v2` သို့ ပြောင်းပါ။
2. `docker build -t my-first-app:2.0 .` ဖြင့် ပြန် Build ပါ။ ("CACHED" ပေါ်သော layer များကို သတိပြုပါ)
3. v1 နှင့် v2 နှစ်ခုလုံး port မတူစေဘဲ တစ်ပြိုင်နက် run ကြည့်ပါ။

---

# 🟠 Level 3 - Docker Hub အပြည့်အစုံ (Step by Step)

## 🌐 Docker Hub ဆိုတာ ဘာလဲ?

**Docker Hub** = Docker Image များအတွက် **GitHub** လိုမျိုး Cloud Registry ဖြစ်သည်။

| GitHub | Docker Hub |
| :--- | :--- |
| Code သိမ်းသည် | **Image** သိမ်းသည် |
| `git push` / `git pull` | `docker push` / `docker pull` |
| Repository | Repository |
| Branch/Tag | Image Tag (`1.0`, `latest`) |

Image အမည်ဖွဲ့စည်းပုံ-
```
docker.io / kyaw123 / my-first-app : 1.0
   |           |            |         |
 Registry   Username    Repository   Tag
(default)   (Namespace)
```
> `docker pull nginx` ဟု ရိုက်လျှင် `docker.io/library/nginx:latest` ကို ဆိုလိုသည် (Official image များ namespace = `library`)။

## အဆင့် ၁၀။ Docker Hub Account ဖွင့်ခြင်း

1. https://hub.docker.com သို့ သွားပါ။
2. **Sign up** နှိပ်ပြီး Username, Email, Password ဖြည့်ပါ။
3. Email ထဲက Verification link ကို နှိပ်ပါ။
4. Username ကို မှတ်ထားပါ (ဥပမာ `kyaw123`) - Image အမည်တိုင်းတွင် ပါရမည်။ **အက္ခရာသေးများသာ** သုံးပါ။

## အဆင့် ၁၁။ Access Token ဖန်တီးခြင်း (Password အစား - လုံခြုံ)

> ⚠️ Terminal / CI တွင် Account Password မသုံးပါနှင့်။ **Access Token** သုံးပါ။ ပျောက်လျှင် Token တစ်ခုတည်း ဖျက်နိုင်သည်။

1. Docker Hub ဝင် -> ညာထောင့် Avatar -> **Account settings**
2. ဘယ်ဘက် **Personal access tokens** (သို့မဟုတ် Security) -> **Generate new token**
3. Description: `my-laptop` / `github-actions`
4. Access permissions: **Read & Write** (Push လုပ်ရန်) ရွေးပါ။
5. **Generate** နှိပ်ပြီး ပေါ်လာသော Token ကို **ချက်ချင်း Copy ကူးသိမ်းပါ** (နောက်ထပ် ပြန်မြင်ရမည်မဟုတ်)။

## အဆင့် ၁၂။ Terminal မှ Login ဝင်ခြင်း

```bash
docker login -u kyaw123
# Password: <ဤနေရာတွင် Access Token ကို paste လုပ်>
# Login Succeeded
```

Script/CI တွင် Token ကို stdin ဖြင့်ပေးခြင်း (history ထဲ မကျန်စေရန်)-
```bash
echo "$DOCKERHUB_TOKEN" | docker login -u kyaw123 --password-stdin
```

Logout:
```bash
docker logout
```

## အဆင့် ၁၃။ Repository ဖန်တီးခြင်း

1. Docker Hub -> **Repositories** -> **Create repository**
2. Name: `my-first-app`
3. Visibility: **Public** (အားလုံးမြင်) သို့မဟုတ် **Private** (မိမိသာ - Free plan တွင် အကန့်အသတ်ရှိ)
4. **Create**

> 💡 Repository ကို ကြိုမဖန်တီးလည်း `docker push` လုပ်လျှင် Public repo အလိုအလျောက် ဖြစ်သွားတတ်သည်။ Private လိုပါက ကြိုဖန်တီးပါ။

## အဆင့် ၁၄။ Image ကို Tag လုပ်ခြင်း

Push မလုပ်မီ Image အမည်သည် `USERNAME/REPO:TAG` ပုံစံ ဖြစ်ရမည်။

```bash
docker tag my-first-app:1.0 kyaw123/my-first-app:1.0
docker tag my-first-app:1.0 kyaw123/my-first-app:latest

docker images | grep my-first-app
```
Image ID တူနေသည်ကို သတိပြုပါ - `tag` သည် နာမည်အသစ်တစ်ခု ထပ်ပေးခြင်းသာ ဖြစ်ပြီး Image ကူးခြင်းမဟုတ်။

## အဆင့် ၁၅။ Docker Hub သို့ Push ခြင်း

```bash
docker push kyaw123/my-first-app:1.0
docker push kyaw123/my-first-app:latest
```

Output တွင် `Pushed` နှင့် `digest: sha256:...` ပေါ်လာလိမ့်မည်။ Docker Hub Website -> Repository -> **Tags** တွင် စစ်ကြည့်ပါ။

## အဆင့် ၁၆။ အခြားစက်/Server မှ Pull ပြီး Run ခြင်း

Local Image ကို အရင်ဖျက်ပြီး Hub မှ ပြန်ယူခြင်းဖြင့် စမ်းပါ-

```bash
docker rm -f app1 app2
docker rmi kyaw123/my-first-app:1.0 my-first-app:1.0

docker pull kyaw123/my-first-app:1.0
docker run -d -p 3000:3000 --name from-hub kyaw123/my-first-app:1.0
curl http://localhost:3000
```

ဤနည်းဖြင့် **ဘယ် Server မှာမဆို** တူညီသော App ကို `docker run` တစ်ကြောင်းတည်းဖြင့် Run နိုင်သည်။ ဤအချက်က DevOps ၏ အဓိကတန်ဖိုးဖြစ်သည်။

## အဆင့် ၁၇။ Tagging Strategy (DevOps လုပ်ငန်းသုံး)

| Tag ပုံစံ | ဥပမာ | အသုံးပြုပုံ |
| :--- | :--- | :--- |
| Semantic version | `1.4.2` | Release version - ပြောင်းလဲမှု မရှိစေရ |
| Git commit SHA | `a1b2c3d` | ဘယ် code မှ build လဲ ခြေရာခံ |
| Branch | `dev`, `staging` | Environment အလိုက် |
| `latest` | `latest` | နောက်ဆုံး - **Production တွင် မသုံးပါနှင့်** |

```bash
GIT_SHA=$(git rev-parse --short HEAD)
docker build -t kyaw123/my-first-app:$GIT_SHA -t kyaw123/my-first-app:1.1.0 .
docker push --all-tags kyaw123/my-first-app
```

> ✅ Production တွင် `latest` မဟုတ်ဘဲ **တိကျသော Version / SHA** ကို Deploy ပါ။ Rollback လုပ်လိုလျှင် ယခင် Tag ကိုသာ ပြန် Run ရုံဖြစ်သည်။

## အဆင့် ၁၈။ Docker Hub ရှာဖွေခြင်း & Official Image ရွေးခြင်း

```bash
docker search nginx --limit 5
docker search --filter is-official=true redis
```

Image ရွေးသည့်အခါ စစ်ရန်-
- ✅ **Docker Official Image** / **Verified Publisher** badge
- ✅ Update နောက်ဆုံးရက် မကြာသေး
- ✅ Pull အရေအတွက် များ
- ✅ `alpine` / `slim` variant (ပေါ့ပါး၊ လုံခြုံ)
- ❌ မသိသော Publisher ၏ Image ကို Production တွင် မသုံးပါနှင့်

## အဆင့် ၁၉။ Docker Hub Rate Limit နှင့် Private Repo

- **Anonymous** pull -> ကန့်သတ်ချက် နည်း၊ **Login ဝင်ထားလျှင်** ပိုများသည်။ CI/Server တွင် `docker login` လုပ်ထားပါ။
- `toomanyrequests: You have reached your pull rate limit` ပေါ်လျှင် Login ဝင်ပါ။
- Private repo အသုံးပြုမည့် Server တွင်လည်း `docker login` လိုအပ်သည်။

## အဆင့် ၂၀။ Docker Hub အစား အခြား Registry များ

```bash
# GitHub Container Registry
docker tag my-first-app:1.0 ghcr.io/kyaw123/my-first-app:1.0
echo $GITHUB_TOKEN | docker login ghcr.io -u kyaw123 --password-stdin
docker push ghcr.io/kyaw123/my-first-app:1.0

# AWS ECR (နမူနာ)
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com
```

### ✅ လေ့ကျင့်ခန်း ၃ (Docker Hub)
1. Account ဖွင့်၊ Token ထုတ်ပါ။
2. `my-first-app` ကို `1.0` နှင့် `latest` အဖြစ် Push ပါ။
3. Local image အားလုံးဖျက်ပြီး Hub မှ Pull ပြီး Run ပါ။
4. `v2` ကို `2.0` Tag ဖြင့် Push ပြီး `1.0` သို့ Rollback လုပ်ပြပါ။

---

# 🔴 Level 4 - Volume, Network နှင့် Docker Compose

## အဆင့် ၂၁။ Data မပျောက်စေရန် Volume

Container ဖျက်လျှင် အတွင်းရှိ Data ပျောက်သည်။ Volume သုံးပါ-

```bash
docker volume create dbdata

docker run -d --name db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=appdb \
  -v dbdata:/var/lib/mysql \
  mysql:8.0

# Container ဖျက်ပြီး ပြန်ဆောက်လည်း Data ရှိနေမည်
docker rm -f db
docker run -d --name db -e MYSQL_ROOT_PASSWORD=secret -v dbdata:/var/lib/mysql mysql:8.0
```

| အမျိုးအစား | Syntax | အသုံးပြုရာ |
| :--- | :--- | :--- |
| Named Volume | `-v dbdata:/var/lib/mysql` | Database, Production data |
| Bind Mount | `-v $(pwd):/app` | Development (Code ပြင်တာ ချက်ချင်းမြင်) |

## အဆင့် ၂၂။ Network - Container များ အချင်းချင်း ဆက်သွယ်ခြင်း

```bash
docker network create mynet
docker run -d --name db --network mynet -e MYSQL_ROOT_PASSWORD=secret mysql:8.0
docker run -d --name app --network mynet -p 3000:3000 kyaw123/my-first-app:1.0

# app container ထဲမှ db ကို နာမည်ဖြင့် ခေါ်နိုင် (DNS)
docker exec -it app sh -c "ping -c 2 db"
```
> User-defined network တွင် **Container နာမည်သည် Hostname** ဖြစ်သည်။ (`DB_HOST=db`)

## အဆင့် ၂၃။ Docker Compose - Multi-Container ကို ဖိုင်တစ်ခုတည်းဖြင့်

`docker-compose.yml`
```yaml
services:
  app:
    image: kyaw123/my-first-app:1.0     # Docker Hub မှ Pull
    # build: .                          # သို့မဟုတ် local build
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      DB_HOST: db
      DB_PASSWORD: ${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: appdb
    volumes:
      - dbdata:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-p${DB_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  dbdata:
```

`.env` (Git ထဲ မထည့်ပါနှင့်)
```
DB_PASSWORD=ChangeMe123!
```

```bash
docker compose up -d            # စတင်
docker compose ps               # အခြေအနေ
docker compose logs -f app      # Log
docker compose pull             # Image အသစ်ဆွဲ
docker compose up -d --build    # Rebuild ပြီး update
docker compose down             # ရပ်ပြီးဖျက် (volume ကျန်)
docker compose down -v          # ⚠️ volume ပါ ဖျက်
```

---

# 🔵 Level 5 - CI/CD: GitHub Actions ဖြင့် Docker Hub သို့ Auto Push

## အဆင့် ၂၄။ ဘာကို အလိုအလျောက်လုပ်မလဲ

```
git push (main)  ->  GitHub Actions  ->  docker build  ->  docker push (Docker Hub)
                                                              |
                                                              v
                                                    Server က Pull & Deploy
```

## အဆင့် ၂၅။ GitHub Secrets ထည့်ခြင်း

GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**

| Secret Name | တန်ဖိုး |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | `kyaw123` |
| `DOCKERHUB_TOKEN` | အဆင့် ၁၁ မှ Access Token |

## အဆင့် ၂၆။ Workflow ဖိုင်

`.github/workflows/docker-publish.yml`
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ "main" ]
    tags: [ "v*.*.*" ]

env:
  IMAGE_NAME: ${{ secrets.DOCKERHUB_USERNAME }}/my-first-app

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Generate tags and labels
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=semver,pattern={{version}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

စမ်းရန်-
```bash
git add .
git commit -m "add docker publish workflow"
git push origin main
# GitHub -> Actions tab တွင် Run ကြည့်၊ ပြီးလျှင် Docker Hub Tags တွင် Image အသစ်ရှိမည်

# Release tag ဖြင့်
git tag v1.0.0 && git push origin v1.0.0
```

## အဆင့် ၂၇။ Multi-platform Image (Mac M1/M2 နှင့် Linux Server)

Apple Silicon (arm64) တွင် Build လျှင် Linux Server (amd64) တွင် `exec format error` ဖြစ်တတ်သည်။

```bash
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t kyaw123/my-first-app:1.0 \
  --push .
```

---

# ⚫ Level 6 - Server တွင် Deploy ခြင်းနှင့် Production အလေ့အထ

## အဆင့် ၂၈။ Cloud VM (Ubuntu) တွင် Deploy

```bash
# 1) VM သို့ SSH ဝင်
ssh ubuntu@YOUR_SERVER_IP

# 2) Docker Install (အဆင့် ၁ အတိုင်း)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker

# 3) Docker Hub Login (Private repo ဆိုလျှင်)
echo "$DOCKERHUB_TOKEN" | docker login -u kyaw123 --password-stdin

# 4) Pull & Run
docker pull kyaw123/my-first-app:1.0
docker run -d --name myapp --restart unless-stopped -p 80:3000 kyaw123/my-first-app:1.0
```

> ☁️ AWS EC2 ဆိုလျှင် Security Group တွင် Port 80/443 ကို ဖွင့်ပေးရမည်။

## အဆင့် ၂၉။ Zero-ish Downtime Update နှင့် Rollback

```bash
# Update
docker pull kyaw123/my-first-app:1.1.0
docker stop myapp && docker rm myapp
docker run -d --name myapp --restart unless-stopped -p 80:3000 kyaw123/my-first-app:1.1.0

# Rollback (ပြဿနာရှိလျှင် ယခင် Tag သို့)
docker stop myapp && docker rm myapp
docker run -d --name myapp --restart unless-stopped -p 80:3000 kyaw123/my-first-app:1.0
```

Compose ဖြင့်ဆိုလျှင် `image:` tag ပြောင်းပြီး `docker compose pull && docker compose up -d`။

## အဆင့် ၃၀။ Troubleshooting (အမြဲကြုံရသော ပြဿနာများ)

| Error / ပြဿနာ | အကြောင်းရင်း | ဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| `Cannot connect to the Docker daemon` | Docker မ run / permission မရှိ | Docker Desktop ဖွင့် / `sudo systemctl start docker` / user ကို `docker` group ထည့် |
| `port is already allocated` | Port ကို တခြားက သုံးနေ | `-p 8081:80` ပြောင်း / `docker ps` ဖြင့် ရှာပြီးရပ် |
| `denied: requested access to the resource is denied` | Login မဝင် / username မှားထည့် | `docker login`, Tag တွင် `USERNAME/` ပါမပါစစ် |
| `repository does not exist` | Repo နာမည်/Visibility မှား | Hub တွင် repo စစ်ပါ |
| `unauthorized: incorrect username or password` | Token မှား/သက်တမ်းကုန် | Token အသစ်ထုတ် |
| `exec format error` | CPU architecture မကိုက် | `--platform linux/amd64` / buildx multi-arch |
| Container ချက်ချင်း `Exited` | CMD မှား / App crash | `docker logs NAME`, `docker run -it IMAGE sh` ဖြင့် စမ်း |
| `no space left on device` | Image/Volume များ | `docker system df`, `docker system prune` |
| Code ပြင်ပေမယ့် မပြောင်း | Layer cache / Image ပြန်မ build | `docker build --no-cache` / `compose up -d --build` |
| `toomanyrequests` | Docker Hub rate limit | `docker login` |

Debug လုပ်ငန်းစဉ် အစဉ်-
```bash
docker ps -a                      # 1. အခြေအနေ
docker logs --tail 100 NAME       # 2. Log
docker inspect NAME               # 3. Config (Env, Ports, Mounts)
docker exec -it NAME sh           # 4. ထဲဝင်စစ်
docker events                     # 5. Docker event live
```

## အဆင့် ၃၁။ Production Best Practices Checklist

- [ ] Base image: `alpine` / `slim` + **Version pin** (`node:20-alpine`၊ `latest` မသုံး)
- [ ] `.dockerignore` ထည့်ထား
- [ ] **Non-root user** (`USER node`)
- [ ] Secret များ (Password, API key) ကို Image ထဲ **မထည့်** -> `-e`, `.env`, Secret manager
- [ ] **Multi-stage build** ဖြင့် Image အသေးဆုံးဖြစ်အောင်
- [ ] `HEALTHCHECK` ထည့်ပါ
- [ ] `--restart unless-stopped` သတ်မှတ်
- [ ] Resource limit: `--memory 512m --cpus 1`
- [ ] Image ကို ပုံမှန် Scan: `docker scout quickview` / `trivy image IMAGE`
- [ ] Docker Hub တွင် **Access Token** သုံး၊ CI တွင် Secrets ထဲသာ
- [ ] Tag ကို SHA/Version ဖြင့် - Rollback လွယ်စေ

Multi-stage နမူနာ (Build tool များ Final image ထဲ မပါစေရန်)-
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000 || exit 1
CMD ["node", "app.js"]
```

Security scan:
```bash
docker scout quickview kyaw123/my-first-app:1.0
```

---

# 🧭 DevOps Learning Roadmap (နောက်ဆက်တွဲ)

```
Docker Basics -> Dockerfile -> Docker Hub -> Compose -> CI/CD (GitHub Actions)
      -> Cloud VM Deploy (AWS EC2) -> Reverse Proxy + HTTPS (Nginx/Traefik)
      -> Monitoring (Prometheus/Grafana) -> Kubernetes -> Terraform / GitOps
```

| လက်ရှိ ပြီးပြီ | နောက်ဆက် သင်ရန် |
| :--- | :--- |
| Level 1-6 | [Docker Compose](/devops/01_docker_core/06-docker-compose-and-multi-container/) နက်နက်ရှိုင်းရှိုင်း |
| | [Laravel Docker Project](/devops/01_docker_core/10-real-world-laravel-docker-project/) |
| | [Docker CI/CD & Registries](/devops/02_kubernetes_and_cloud/09_docker_cicd_and_registries/) |
| | [Kubernetes Architecture](/devops/02_kubernetes_and_cloud/11_k8s_architecture_and_setup/) |

# 🏁 ကိုယ်တိုင်လုပ်ရမည့် နောက်ဆုံး Mini Project

1. ကိုယ်ပိုင် App (Node / PHP / Python တစ်ခုခု) ရေးပါ။
2. `Dockerfile` + `.dockerignore` ရေးပါ။
3. Local တွင် Build/Run စမ်းပါ။
4. GitHub Repo ဖွင့်ပြီး Code Push ပါ။
5. GitHub Actions ဖြင့် Docker Hub သို့ Auto Push ဖြစ်အောင် ပြင်ဆင်ပါ။
6. Cloud VM တစ်လုံးတွင် `docker compose` ဖြင့် Pull & Deploy လုပ်ပါ။
7. Version `1.1.0` ထုတ်ပြီး Update၊ ပြဿနာရှိလျှင် `1.0.0` သို့ Rollback ပြပါ။

ဤ ၇ ဆင့်ကို ကိုယ်တိုင် လုပ်နိုင်ပါက **Docker အခြေခံ DevOps** အဆင့်သို့ ရောက်ပြီ ဖြစ်သည်။ 🎉
