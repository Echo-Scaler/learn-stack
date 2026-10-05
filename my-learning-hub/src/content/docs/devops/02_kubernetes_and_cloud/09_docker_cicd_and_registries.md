---
title: "09. Docker Cicd And Registries"
description: "1. [Container Registry ဆိုတာဘာလဲ? (Docker Hub, AWS ECR, GHCR)](#၁-container-registry-ဆိုတာဘာလဲ)"
---

## 🐳 သင်ခန်းစာ (၉) - Docker CI/CD Automation နှင့် Container Registries
### (Lesson 9: Registries, Multi-Arch Buildx, Image Tagging Strategy & GitHub Actions CI/CD)

---

## 📌 မာတိကာ (Contents)
1. [Container Registry ဆိုတာဘာလဲ? (Docker Hub, AWS ECR, GHCR)](#၁-container-registry-ဆိုတာဘာလဲ)
2. [CLI ဖြင့် Registry သို့ Login ဝင်ခြင်း၊ Tag ပေးခြင်းနှင့် Push လုပ်ခြင်း](#၂-cli-ဖြင့်-registry-လုပ်ငန်းစဉ်များ)
3. [Production Image Tagging Strategy (`:latest` Tag ၏ အန္တရာယ်)](#၃-production-image-tagging-strategy)
4. [Docker Buildx နှင့် Multi-Architecture Builds (Mac ARM64 vs Cloud AMD64)](#၄-docker-buildx-နှင့်-multi-architecture)
5. [GitHub Actions ဖြင့် Automated Docker CI/CD Pipeline တည်ဆောက်ခြင်း](#၅-github-actions-ဖြင့်-docker-cicd-pipeline)
6. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၆-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Container Registry ဆိုတာဘာလဲ?

Container Registry ဆိုသည်မှာ Build ပြီးသား Docker Images များကို လုံခြုံစွာ စုစည်းသိမ်းဆည်းထားပြီး၊ မည်သည့် Server ကမဆို Download (Pull) ဆွဲယူ Run နိုင်စေသည့် Cloud / On-Premise Repository ဖြစ်ပါသည်။

```
[ Developer Machine ] ──► (git push) ──► [ GitHub Actions CI/CD ]
                                                    │
                                                    │ docker build & push
                                                    ▼
                                         ┌─────────────────────┐
                                         │ Container Registry  │
                                         │ (Docker Hub / ECR)  │
                                         └──────────┬──────────┘
                                                    │
                                                    │ docker pull
                                                    ▼
                                         [ Production Server ]
```

### အသုံးများသော Registries ၃ မျိုး:
1. **Docker Hub (`docker.io`)**: ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး Public/Private Registry။
2. **GitHub Container Registry (`ghcr.io`)**: GitHub Repository များနှင့် တိုက်ရိုက်ချိတ်ဆက်ရ လွယ်ကူသော အကောင်းဆုံး Registry။
3. **AWS ECR (Elastic Container Registry)**: AWS Cloud (ECS, EKS) သုံးစွဲသော Enterprise လုပ်ငန်းများအတွက် လုံခြုံစိတ်ချရဆုံး Private Registry။

---

## ၂။ CLI ဖြင့် Registry လုပ်ငန်းစဉ်များ

### အဆင့် ၁: Registry သို့ Login ဝင်ခြင်း
```bash
# Docker Hub သို့ Login ဝင်ခြင်း
docker login -u myusername -p mypassword

# GitHub Container Registry (GHCR) သို့ Login ဝင်ခြင်း
echo $CR_PAT | docker login ghcr.io -u mygithubuser --password-stdin
```

### အဆင့် ၂: Image အား Registry Path အတိုင်း Tag ပေးခြင်း
Docker Registry သို့ Push လုပ်ရန် Image Name သည် `registry_url/username/repo_name:tag` ပုံစံ ဖြစ်ရမည်:
```bash
docker tag my-local-app:1.0 myusername/my-laravel-app:1.0.0
```

### အဆင့် ၃: Registry သို့ Push တင်ခြင်း
```bash
docker push myusername/my-laravel-app:1.0.0
```

---

## ၃။ Production Image Tagging Strategy

> [!WARNING]
> Production ပတ်ဝန်းကျင်တွင် **`:latest` tag ကို မည်သည့်အခါမျှ အားမကိုးပါနှင့်!**

အဘယ်ကြောင့်နည်း?
* `:latest` သည် ဗားရှင်းအသစ် push လုပ်လိုက်တိုင်း ပြောင်းလဲသွားသဖြင့် ယမန်နေ့က run ခဲ့သော container နှင့် ယနေ့ run သော container သည် တူညီခြင်း ရှိ/မရှိ မသိနိုင်ပါ။
* Bug ဖြစ်ပေါ်ပါက ယခင်ဗားရှင်းဟောင်းသို့ ပြန်လည် ဆုတ်ခွာရန် (Rollback လုပ်ရန်) လုံးဝ မဖြစ်နိုင်တော့ပါ။

### အကြံပြုထားသော Enterprise Tagging စနစ်:
1. **Semantic Versioning (SemVer)**: `v1.0.0`, `v1.0.1`, `v1.1.0` (Release အသစ်များအတွက်)
2. **Git Commit SHA**: `sha-7a8b9c1` (Commit တစ်ခုချင်းစီကို တိကျစွာ ခြေရာခံနိုင်သည်)
3. **Environment Tag**: `staging`, `production`

---

## ၄။ Docker Buildx နှင့် Multi-Architecture (ARM64 vs AMD64)

လက်ရှိ ခေတ်တွင် Developer အများစုသည် **Apple Silicon Mac (M1/M2/M3 - ARM64 architecture)** ကို အသုံးပြုကြပြီး၊ AWS / DigitalOcean Cloud Server အများစုမှာမူ **Intel/AMD (x86_64 / AMD64 architecture)** ဖြစ်နေတတ်သည်။

Mac ပေါ်တွင် ရိုးရိုး `docker build` ပြုလုပ်ပြီး Server ပေါ်သို့ တင်ပါက အောက်ပါ Error တက်လေ့ရှိသည်:
`exec /usr/local/bin/php: exec format error`

### ဖြေရှင်းနည်း: Docker Buildx ဖြင့် Multi-Arch Build ပြုလုပ်ခြင်း
```bash
# Multi-platform builder စတင်ဖန်တီးခြင်း
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# ARM64 နှင့် AMD64 ၂ မျိုးစလုံးအတွက် တစ်ပြိုင်နက် build လုပ်ပြီး Registry သို့ တိုက်ရိုက် push ခြင်း
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myusername/my-laravel-app:1.0.0 \
  --push .
```
ဤသို့ build လုပ်လိုက်ပါက Mac ပေါ်တွင်ဖြစ်စေ၊ Cloud Linux Server ပေါ်တွင်ဖြစ်စေ Architecture အလိုအလျောက် ကိုက်ညီစွာ Run သွားမည် ဖြစ်ပါသည်။

---

## ၅။ GitHub Actions ဖြင့် Docker CI/CD Pipeline

Git Repository တွင် Commit အသစ်တင်လိုက်သည်နှင့် အလိုအလျောက် Test စစ်ဆေး၊ Docker Build ပြုလုပ်ပြီး Registry သို့ Push ပေးမည့် Workflow ဖိုင် (`.github/workflows/deploy.yml`):

```yaml
name: Build, Scan and Push Docker Image

on:
  push:
    branches: [ "main" ]
    tags: [ 'v*.*.*' ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      # ၁။ Code ကို Checkout ဆွဲယူခြင်း
      - name: Checkout repository
        uses: actions/checkout@v4

      # ၂။ Multi-platform build အတွက် QEMU တပ်ဆင်ခြင်း
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      # ၃။ Docker Buildx တပ်ဆင်ခြင်း
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # ၄။ Docker Hub သို့ Login ဝင်ခြင်း
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # ၅။ Git Tag နှင့် Commit SHA အပေါ်မူတည်၍ Docker Tags သတ်မှတ်ခြင်း
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKERHUB_USERNAME }}/my-app
          tags: |
            type=semver,pattern={{version}}
            type=sha,format=short
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      # ၆။ Build & Push လုပ်ဆောင်ခြင်း
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ငန်းစဉ် (Task) | အတည်ပြုချက် |
| :--- | :---: |
| **No `:latest` in Production** | Deployment များတွင် Immutable Tags (Git SHA သို့မဟုတ် SemVer) သုံးထားသလား? | [ ] |
| **Multi-Architecture Ready** | Mac နှင့် Linux Server ပေါ်တွင် အလုပ်လုပ်စေရန် `docker buildx` ဖြင့် build ထားသလား? | [ ] |
| **Automated CI/CD** | Developer လက်ဖြင့် Push မလုပ်ဘဲ GitHub Actions မှ လုံခြုံစွာ build & push လုပ်သလား? | [ ] |
| **Secure Credentials** | Registry Password များကို GitHub Secrets ထဲတွင် ထည့်သွင်းထားသလား? | [ ] |

နောက်သင်ခန်းစာ [10_why_orchestration_swarm_vs_k8s.md](/devops/02_kubernetes_and_cloud/10_why_orchestration_swarm_vs_k8s/) တွင် Single-Server Docker မှ Multi-Server Kubernetes သို့ ကူးပြောင်းရခြင်း အကြောင်းအရင်းများကို ဆက်လက် လေ့လာပါမည်။
