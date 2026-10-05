---
title: "01. Docker Architecture And Concepts"
description: "1. [Containerization ဆိုတာဘာလဲ? (Traditional Deployment vs Containerization)](#၁-containerization-ဆိုတာဘာလဲ)"
---

## 🐳 သင်ခန်းစာ (၁) - Docker Architecture နှင့် အခြေခံသဘောတရားများ
### (Lesson 1: Docker Architecture, Core Concepts & Containerization vs Virtualization)

---

## 📌 မာတိကာ (Contents)
1. [Containerization ဆိုတာဘာလဲ? (Traditional Deployment vs Containerization)](#၁-containerization-ဆိုတာဘာလဲ)
2. [Virtual Machine (VM) နှင့် Docker Container မတူညီပုံ နှိုင်းယှဉ်ချက်](#၂-virtual-machine-vm-နှင့်-docker-container-မတူညီပုံ)
3. [Docker Engine Architecture အလုပ်လုပ်ပုံ Diagram](#၃-docker-engine-architecture-အလုပ်လုပ်ပုံ-diagram)
4. [Docker ၏ အဓိက အစိတ်အပိုင်း ၄ ရပ် (Core Components)](#၄-docker-၏-အဓိက-အစိတ်အပိုင်း-၄-ရပ်)
   - [၄.၁။ Docker Client & CLI](#၄၁-docker-client--cli)
   - [၄.၂။ Docker Daemon (`dockerd`)](#၄၂-docker-daemon-dockerd)
   - [၄.၃။ Docker Images & Containers](#၄၃-docker-images--containers)
   - [၄.၄။ Docker Registry (Docker Hub / Private Registry)](#၄၄-docker-registry)
5. [Linux Kernel Magic: Namespaces နှင့် Cgroups](#၅-linux-kernel-magic-namespaces-နှင့်-cgroups)
6. [လက်တွေ့ ပထမဆုံး Hello-World Container Run ကြည့်ခြင်း](#၆-လက်တွေ့-ပထမဆုံး-hello-world-container-run-ကြည့်ခြင်း)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Containerization ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is Containerization?)
**Containerization** ဆိုသည်မှာ Application တစ်ခုနှင့် ၎င်းအလုပ်လုပ်ရန် လိုအပ်သော Code, Runtime (ဥပမာ- PHP, Node.js, Python), Libraries, Configuration ဖိုင်များနှင့် Dependencies အားလုံးကို အထုပ်တစ်ထုပ်တည်း (Container) အဖြစ် စုစည်းထုပ်ပိုးလိုက်သည့် နည်းပညာ ဖြစ်ပါသည်။

အလွယ်ဆုံး ဥပမာပြောရလျှင် - သင်္ဘောပေါ်တွင် ကုန်စည်များတင်ဆောင်သည့်အခါ အသီးအနှံဖြစ်စေ၊ ကားဖြစ်စေ၊ အဝတ်အထည်ဖြစ်စေ စံချိန်မီ **Shipping Container** သေတ္တာထဲသို့ ထည့်လိုက်ပါက မည်သည့် ကရိန်း၊ မည်သည့် သင်္ဘောပေါ်တွင်မဆို လွယ်ကူစွာ သယ်ယူတင်ချနိုင်သကဲ့သို့ ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why do we use Docker?)
Software ဖွံ့ဖြိုးတိုးတက်မှုသမိုင်းတွင် အဆိုးရွားဆုံး ကြုံတွေ့ရသည့် စကားရပ်တစ်ခုရှိပါသည် -
> **"It works on my machine, why does it fail on production?"**  
> (ကျွန်တော့်စက်ထဲမှာတော့ ကောင်းကောင်း Run နေပြီး Server ပေါ်တင်လိုက်မှ PHP Version မကိုက်တာ၊ Extension မရှိတာတွေနဲ့ Error တက်နေတယ်)

Docker မသုံးခင် ရိုးရိုး Server ပေါ်တွင် Deploy လုပ်လျှင် အောက်ပါပြဿနာများ ဖြစ်ပွားသည်:
1. **Dependency Hell**: Server ပေါ်တွင် PHP 8.1 သုံးထားသည့် Project နှင့် PHP 8.3 သုံးမည့် Project အသစ်တို့ Version မကိုက်ဘဲ ပဋိပက္ခ (Conflict) ဖြစ်ခြင်း။
2. **Environment Inconsistency**: Developer ၏ စက်သည် macOS ဖြစ်ပြီး Production Server သည် Ubuntu Linux ဖြစ်နေသဖြင့် Path ပြဿနာ၊ File Permission ပြဿနာများ ကြုံရခြင်း။
3. **Onboarding ခက်ခဲခြင်း**: Developer အသစ်တစ်ဦး အဖွဲ့ထဲရောက်လာပါက Database, Redis, Web Server, PHP Extensions များ သွင်းရန် ရက်ပေါင်းများစွာ အချိန်ကုန်ရခြင်း။

Docker ကို အသုံးပြုလိုက်သည့်အခါ:
* **Write Once, Run Anywhere**: Developer စက်တွင် run သော Container သည် Staging နှင့် Production Cloud Server ပေါ်တွင် 100% ထပ်တူညီစွာ အလုပ်လုပ်သည်။
* **Instant Setup**: `docker compose up` ဟု command တစ်ချက် ရိုက်ရုံဖြင့် Developer အသစ်သည် ၅ မိနစ်အတွင်း Coding စတင်နိုင်ပါသည်။

---

## ၂။ Virtual Machine (VM) နှင့် Docker Container မတူညီပုံ

အစောပိုင်းကာလများတွင် VMware သို့မဟုတ် VirtualBox ကဲ့သို့သော Virtual Machine (VM) များကို သုံးခဲ့ကြသော်လည်း Docker သည် ၎င်းတို့ထက် အဆပေါင်းများစွာ ပေါ့ပါးမြန်ဆန်ပါသည်။

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       VIRTUAL MACHINES (VM)     │       │        DOCKER CONTAINERS        │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│  App A   │   App B   │   App C  │       │  App A   │   App B   │   App C  │
│ Bins/Libs│ Bins/Libs │ Bins/Libs│       │ Bins/Libs│ Bins/Libs │ Bins/Libs│
├──────────┼───────────┼──────────┤       ├─────────────────────────────────┤
│ Guest OS │ Guest OS  │ Guest OS │       │          Docker Engine          │
│ (Ubuntu) │ (CentOS)  │ (Debian) │       │   (Namespaces, Cgroups, CRI)    │
├──────────┴───────────┴──────────┤       ├─────────────────────────────────┤
│       Hypervisor (Type 1/2)     │       │       Host Operating System     │
├─────────────────────────────────┤       │        (Linux / Mac / Win)      │
│      Host OS / Physical Server  │       ├─────────────────────────────────┤
│         Infrastructure          │       │          Infrastructure         │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

| သွင်ပြင်လက္ခဏာ (Feature) | Virtual Machine (VM) | Docker Container |
| :--- | :--- | :--- |
| **OS Architecture** | VM တစ်ခုချင်းစီတွင် သီးသန့် **Guest OS** (GB ပေါင်းများစွာ) ပါဝင်သည် | Host OS ၏ Linux Kernel ကို အတူတကွ **မျှဝေသုံးစွဲ (Shared Kernel)** သည် |
| **Boot တက်ချိန် (Startup Speed)** | မိနစ်နှင့်ချီ၍ ကြာမြင့်သည် (OS အသစ် boot တက်ရသဖြင့်) | **မီလီစက္ကန့် သို့မဟုတ် စက္ကန့်ပိုင်း** သာ ကြာသည် (ရိုးရိုး process အဖြစ် run သဖြင့်) |
| **Resource အသုံးပြုမှု** | RAM/CPU ကို အသေ သတ်မှတ်ဖယ်ထားရသည် (Heavy Overhead) | လိုအပ်သလောက်သာ အသုံးပြုသည် (Lightweight & High Efficiency) |
| **Storage Size** | Image တစ်ခုလျှင် 10 GB မှ 50 GB အထိ ကြီးမားနိုင်သည် | Image တစ်ခုလျှင် MB အနည်းငယ် (ဥပမာ- Alpine Linux သည် 5 MB သာရှိသည်) |
| **Portability** | ရွှေ့ပြောင်းရ ခက်ခဲပြီး File ကြီးမားသည် | Docker Image အဖြစ် ကမ္ဘာ့မည်သည့်နေရာမဆို စက္ကန့်ပိုင်းဖြင့် push/pull ပြုလုပ်နိုင်သည် |

---

## ၃။ Docker Engine Architecture အလုပ်လုပ်ပုံ Diagram

Docker သည် **Client-Server Architecture** ပုံစံဖြင့် တည်ဆောက်ထားပါသည်။

```
┌─────────────────────────────────┐
│     Docker Client (CLI)         │
│  (docker build, run, pull)      │
└───────────────┬─────────────────┘
                │ REST API over UNIX Socket / TCP
                ▼
┌────────────────────────────────────────────────────────┐
│           Docker Host (Docker Daemon / dockerd)         │
│                                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────┐ │
│  │   Containers   │  │     Images     │  │ Networks │ │
│  │ ┌────────────┐ │  │ ┌────────────┐ │  │  Volumes │ │
│  │ │Container A │ │  │ │ nginx:1.25 │ │  └──────────┘ │
│  │ ├────────────┤ │  │ ├────────────┤ │               │
│  │ │Container B │ │  │ │ php:8.3    │ │               │
│  │ └────────────┘ │  │ └────────────┘ │               │
│  └────────────────┘  └────────────────┘               │
│         │                    ▲                        │
└─────────┼────────────────────┼────────────────────────┘
          │                    │ Pull / Push Images
          │                    ▼
          │       ┌─────────────────────────────────────┐
          │       │    Docker Registry (Docker Hub)     │
          └──────►│    hub.docker.com / AWS ECR         │
                  └─────────────────────────────────────┘
```

---

## ၄။ Docker ၏ အဓိက အစိတ်အပိုင်း ၄ ရပ် (Core Components)

### ၄.၁။ Docker Client & CLI
* Terminal တွင် Developer များ ရိုက်နှိပ်သော `docker run`, `docker ps`, `docker build` စသည့် commands များ ဖြစ်သည်။
* Client သည် အလုပ်တိုက်ရိုက်မလုပ်ဘဲ Daemon ထံသို့ REST API Request များ ပို့ပေးခြင်း ဖြစ်သည်။

### ၄.၂။ Docker Daemon (`dockerd`)
* Background တွင် အမြဲ အလုပ်လုပ်နေသော Service ဖြစ်ပြီး Container များ ဖန်တီးခြင်း၊ စီမံခြင်း၊ Network နှင့် Volume များကို ထိန်းချုပ်ခြင်း စသည်တို့ကို အမှန်တကယ် လုပ်ဆောင်ပေးသည့် ဦးနှောက် ဖြစ်ပါသည်။

### ၄.၃။ Docker Images & Containers
* **Image (Blueprint / Class)**: 
  * OOP တွင် Class နှင့်တူသည်။ Read-only Template ဖြစ်သည်။ ဥပမာ - Ubuntu + PHP 8.3 + Laravel Code ပါဝင်သော Read-only image ဖြစ်သည်။
* **Container (Living Instance / Object)**: 
  * Image ကို run လိုက်သည့်အခါ ထွက်ပေါ်လာသော အမှန်တကယ် လည်ပတ်နေသည့် Process ဖြစ်သည်။ OOP တွင် Object နှင့်တူသည်။ Container ပေါ်တွင် ရေးသားသမျှ data များသည် Read-Write Layer ဖြစ်သည်။

### ၄.၄။ Docker Registry
* Docker Image များကို စုစည်းသိမ်းဆည်းရာ App Store သဖွယ် နေရာဖြစ်ပါသည်။
* လူသုံးအများဆုံး အခမဲ့ Registry မှာ **Docker Hub** ဖြစ်ပြီး၊ Enterprise များတွင် **AWS ECR (Elastic Container Registry)**၊ **GitHub Packages (GHCR)** သို့မဟုတ် Private GitLab Registry များကို အသုံးပြုကြသည်။

---

## ၅။ Linux Kernel Magic: Namespaces နှင့် Cgroups

Container များသည် Virtual Machine ကဲ့သို့ OS အပြည့်မပါဘဲ ဘာကြောင့် သီးသန့် ကမ္ဘာတစ်ခုအဖြစ် လုံခြုံစွာ သီးခြားခွဲထုတ် (Isolate) ထားနိုင်သနည်း?

အဖြေမှာ Linux Kernel ၏ အဓိက Features ၂ ခုကြောင့် ဖြစ်ပါသည်:
1. **Namespaces (Isolation - အမြင်ကန့်သတ်ခြင်း)**:
   * **PID Namespace**: Container အတွင်းရှိ Process သည် PID 1 အဖြစ် သီးသန့်မြင်ရပြီး Host ပေါ်ရှိ အခြား process များကို မမြင်ရပါ။
   * **NET Namespace**: Container တစ်ခုစီတွင် သီးသန့် Virtual Network Interface နှင့် IP Address ရရှိစေသည်။
   * **MNT Namespace**: Container ၏ File System အား သီးခြား ခွဲထုတ်ပေးထားသည်။
2. **Control Groups - Cgroups (Resource Limitation - အရင်းအမြစ် ကန့်သတ်ခြင်း)**:
   * Container တစ်ခုသည် CPU မည်မျှရာခိုင်နှုန်း၊ RAM မည်မျှ (ဥပမာ- အများဆုံး 512MB) သာ သုံးစွဲခွင့်ရှိကြောင်း Kernel မှ ကန့်သတ်ထိန်းချုပ်ပေးသည်။ Application တစ်ခုတည်းကြောင့် Server တစ်ခုလုံး Memory ပြည့်ပြီး Crash မဖြစ်အောင် ကာကွယ်ပေးသည်။

---

## ၆။ လက်တွေ့ ပထမဆုံး Hello-World Container Run ကြည့်ခြင်း

Terminal ကို ဖွင့်ပြီး အောက်ပါ command ကို ရိုက်ထည့်ကြည့်ပါ:

```bash
docker run hello-world
```

### ဖြစ်ပျက်သွားသော အဆင့်ဆင့် လုပ်ငန်းစဉ်:
1. Docker Client သည် Daemon ထံသို့ "hello-world image ကို run ပေးရန်" တောင်းဆိုသည်။
2. Daemon သည် Local စက်ထဲတွင် `hello-world` image ရှိ/မရှိ စစ်ဆေးသည်။
3. မရှိသေးသဖြင့် **Docker Hub** မှ image ကို အလိုအလျောက် Download ဆွဲယူသည် (`Unable to find image locally... Pulling from library/hello-world`).
4. Download ပြီးသည်နှင့် အဆိုပါ Image မှ Container အသစ်တစ်ခု ချက်ချင်း ဖန်တီးပြီး run ပေးသည်။
5. Terminal မျက်နှာပြင်ပေါ်တွင် "Hello from Docker!" ဟူသော မက်ဆေ့ခ်ျ ပြသပေးပြီး Container အလုပ်ပြီးဆုံးကာ ရပ်တန့်သွားသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ငန်းစဉ် (Task) | စစ်ဆေးရမည့် အချက် (Checklist Item) | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Docker Desktop Setup** | Local Machine တွင် Docker Desktop သို့မဟုတ် OrbStack တပ်ဆင်ထားပြီး `docker --version` စစ်ဆေးပြီးပြီလား? | [ ] |
| **Architecture Concept** | Container သည် Host Kernel ကို မျှဝေသုံးစွဲပြီး VM ထက် ပေါ့ပါးကြောင်း သဘောပေါက်ပြီလား? | [ ] |
| **Image vs Container** | Image သည် Read-Only Blueprint ဖြစ်ပြီး Container သည် Executable Instance ဖြစ်ကြောင်း နားလည်ပြီလား? | [ ] |
| **Client-Daemon Separation** | CLI command များသည် Daemon သို့ REST API မှတစ်ဆင့် သွားကြောင်း သဘောပေါက်ပြီလား? | [ ] |

နောက်သင်ခန်းစာ [02_docker_cli_essentials.md](/devops/02_kubernetes_and_cloud/02_docker_cli_essentials/) တွင် လုပ်ငန်းခွင်၌ နေ့စဉ် မဖြစ်မနေ အသုံးပြုရသော Docker CLI Commands များကို လက်တွေ့ ဆက်လက် လေ့လာပါမည်။
