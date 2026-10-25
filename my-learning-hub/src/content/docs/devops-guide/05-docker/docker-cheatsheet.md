---
title: "🐳 Docker & Docker Compose Command Cheatsheet for DevOps"
description: "🐳 Docker & Docker Compose Command Cheatsheet for DevOps"
---


> **Production Docker CLI Commands, Compose Workflows, Volume/Network Management & System Cleanup Reference**

---

## 📦 ၁။ Image Management (Images စီမံခန့်ခွဲခြင်း)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `docker build -t <name>:<tag> .` | Build image from Dockerfile | လက်ရှိ directory ရှိ Dockerfile မှ image တည်ဆောက်သည်။ |
| `docker build --no-cache -t <name> .` | Build without caching | Cache မသုံးဘဲ အစအဆုံး အသစ် build ပြုလုပ်သည်။ |
| `docker images` | List local images | Local စက်တွင် ရှိသော Docker images အားလုံးကို ပြသည်။ |
| `docker tag <old> <new>` | Tag image with new name | Registry သို့ push ရန် image name/tag ပြောင်းလဲပေးသည်။ |
| `docker push <registry>/<image>:<tag>` | Push image to registry | Docker Hub သို့မဟုတ် AWS ECR သို့ image တင်သည်။ |
| `docker pull <image>:<tag>` | Pull image from registry | Remote registry မှ image ဒေါင်းလုဒ် ဆွဲယူသည်။ |
| `docker rmi <image_id>` | Remove local image | Image ကို စက်ပေါ်မှ ဖျက်ပစ်သည်။ |
| `docker history <image>` | Show image layers & size | Image ၏ layers တစ်ခုချင်းစီ၏ အရွယ်အစားနှင့် commands များကို ပြသည်။ |

---

## 🏃 ၂။ Container Lifecycle Management (Containers ပြေးဆွဲ စီမံခြင်း)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `docker run -d --name <name> -p <host>:<cont> <img>` | Run container in background | Port forward လုပ်၍ container ကို background daemon အဖြစ် ပြေးဆွဲသည်။ |
| `docker run --rm -it <img` /bin/sh | Run interactive & remove on exit | ယာယီစမ်းသပ်ရန် container shell ဖွင့်ပြီး ထွက်သည်နှင့် container ကို အလိုအလျောက် ဖျက်သည်။ |
| `docker ps` | List running containers | လက်ရှိ အလုပ်လုပ်နေသော containers များကို ပြသည်။ |
| `docker ps -a` | List all containers (including stopped) | ရပ်တန့်သွားသော containers များပါမကျန် အကုန် ပြသသည်။ |
| `docker stop <container>` | Graceful stop (SIGTERM) | Container အား safe shutdown ပြုလုပ်စေသည်။ |
| `docker kill <container>` | Force stop (SIGKILL) | Container ကို ချက်ချင်း အတင်း ရပ်တန့်ပစ်သည်။ |
| `docker restart <container>` | Restart container | Container ကို ပိတ်ပြီး ပြန်ဖွင့်သည်။ |
| `docker rm -f <container>` | Force remove container | ပြေးနေသော container ကို အတင်း ဖျက်ပစ်သည်။ |

---

## 🔍 ၃။ Inspection, Debugging & Logs (စစ်ဆေး ရှာဖွေခြင်း)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `docker logs -f <container>` | Follow live container logs | Container ၏ log output ကို real-time စောင့်ကြည့်သည်။ |
| `docker logs --tail 100 <container>` | View last 100 log lines | နောက်ဆုံး log အကြောင်း ၁၀၀ ကိုသာ ကြည့်သည်။ |
| `docker exec -it <container> sh` | Open interactive shell inside container | Container အတွင်းသို့ terminal ဖြင့် ဝင်ရောက်သည်။ |
| `docker inspect <container>` | View detailed JSON metadata | IP address, mount paths, environment variables များကို ကြည့်သည်။ |
| `docker stats` | Live CPU, Memory, I/O usage | Container များ၏ resource စားသုံးမှုကို real-time စောင့်ကြည့်သည်။ |
| `docker top <container>` | Display running processes inside container | Container အတွင်း ပြေးနေသော Linux processes များကို ပြသည်။ |
| `docker cp <src> <container>:<dest>` | Copy files between host and container | Host နှင့် Container ကြား ဖိုင်များကို ကူးယူဖလှယ်သည်။ |

---

## 💾 ၄။ Volumes & Networks Management

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `docker volume ls` | List all named volumes | Persistent volumes စာရင်းကို ပြသည်။ |
| `docker volume create <name>` | Create persistent volume | Volume အသစ် ဖန်တီးသည်။ |
| `docker volume inspect <name>` | Show volume mount path on host | Host စက်ပေါ်ရှိ volume ၏ တကယ့်လမ်းကြောင်းကို ပြသည်။ |
| `docker volume prune -f` | Remove unused volumes | မည်သည့် container ကမှ မသုံးတော့သော volumes များကို ရှင်းထုတ်သည်။ |
| `docker network ls` | List all docker networks | Bridge, host, overlay networks များကို ပြသည်။ |
| `docker network create <name>` | Create user-defined bridge network | DNS discovery ရရှိသော network အသစ် ဖန်တီးသည်။ |
| `docker network inspect <name>` | Inspect connected containers & IPs | Network ထဲတွင် မည်သည့် containers များ ချိတ်ဆက်နေသည်ကို ပြသည်။ |

---

## 🎼 ၅။ Docker Compose Commands

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `docker compose up -d` | Start full stack in background | `docker-compose.yml` ပါ services အားလုံးကို build လုပ်ပြီး background တွင် run သည်။ |
| `docker compose down` | Stop and remove stack | Services, containers, networks များကို ဖျက်သိမ်းသည်။ |
| `docker compose down -v` | Stop and delete volumes as well | Persistent Database volumes များပါ မကျန် အကုန် ဖျက်ပစ်သည်။ |
| `docker compose ps` | Check status of all stack services | Services များ၏ ကျန်းမာရေး (healthy/unhealthy) ကို စစ်ဆေးသည်။ |
| `docker compose logs -f <service>` | Follow logs of specific service | ဥပမာ `docker compose logs -f web` ဖြင့် သီးခြား service log ကြည့်သည်။ |
| `docker compose exec <service> sh` | Exec into specific compose service | ဥပမာ `docker compose exec db psql -U appuser` ဖြင့် database console သို့ ဝင်သည်။ |
| `docker compose restart <service>` | Restart single service | Stack တစ်ခုလုံး မထိခိုက်စေဘဲ သီးခြား service တစ်ခုတည်းကို restart ချသည်။ |

---

## 🧹 ၆။ Docker System Cleanup & Garbage Collection

Server ပေါ်တွင် Docker Disk space (100%) ပြည့်သွားပါက ရှင်းလင်းရန်:

```bash
# မသုံးတော့သော Containers, Networks, Dangling Images အားလုံးကို ရှင်းထုတ်ခြင်း
docker system prune -f

# အသုံးမပြုတော့သော Images အားလုံးနှင့် Volumes များပါ အကုန် ရှင်းထုတ်ခြင်း (Deep Cleanup)
docker system prune -af --volumes
```
