---
title: "08. Docker Security And Hardening"
description: "1. [Container Security အဘယ်ကြောင့် အရေးကြီးသနည်း?](#၁-container-security-အဘယ်ကြောင့်-အရေးကြီးသနည်း)"
---

## 🐳 သင်ခန်းစာ (၈) - Docker Security နှင့် Container Hardening
### (Lesson 8: Container Security, Vulnerability Scanning with Trivy & Production Hardening)

---

## 📌 မာတိကာ (Contents)
1. [Container Security အဘယ်ကြောင့် အရေးကြီးသနည်း?](#၁-container-security-အဘယ်ကြောင့်-အရေးကြီးသနည်း)
2. [အဓိက လုံခြုံရေး အားနည်းချက်များနှင့် ကာကွယ်နည်း (Container Hardening Rules)](#၂-အဓိက-လုံခြုံရေး-အားနည်းချက်များနှင့်-ကာကွယ်နည်း)
   - [၂.၁။ Root User အနေဖြင့် မည်သည့်အခါမျှ မ Run ရန် (Non-root User သတ်မှတ်ခြင်း)](#၂၁-root-user-အနေဖြင့်-မrunရန်)
   - [၂.၂။ Read-Only Root Filesystem အသုံးပြုခြင်း](#၂၂-read-only-root-filesystem)
   - [၂.၃။ Linux Capabilities များကို ဖြုတ်ချခြင်း (`cap-drop ALL`)](#၂၃-linux-capabilities-များကို-ဖြုတ်ချခြင်း)
   - [၂.၄။ Privilege Escalation တားဆီးခြင်း (`no-new-privileges`)](#၂၄-privilege-escalation-တားဆီးခြင်း)
   - [၂.၅။ Resource Limits သတ်မှတ်ခြင်း (DoS Attack ကာကွယ်ခြင်း)](#၂၅-resource-limits-သတ်မှတ်ခြင်း)
3. [Trivy ဖြင့် Docker Image Vulnerabilities (CVE) ရှာဖွေစစ်ဆေးနည်း](#၃-trivy-ဖြင့်-image-vulnerabilities-စစ်ဆေးနည်း)
4. [Hardened Production Dockerfile နမူနာ](#၄-hardened-production-dockerfile-နမူနာ)
5. [Hardened Docker Compose Service Configuration](#၅-hardened-docker-compose-service-configuration)
6. [Rootless Docker ဆိုတာဘာလဲ?](#၆-rootless-docker-ဆိုတာဘာလဲ)
7. [လုပ်ငန်းခွင်သုံး Security Checklist](#၇-လုပ်ငန်းခွင်သုံး-security-checklist)

---

## ၁။ Container Security အဘယ်ကြောင့် အရေးကြီးသနည်း?

Container များသည် Virtual Machine ကဲ့သို့ သီးခြား OS မဟုတ်ဘဲ **Host OS ၏ Linux Kernel ကို အတူတကွ မျှဝေသုံးစွဲ (Shared Kernel)** ထားခြင်း ဖြစ်သည်။

အကယ်၍ သင်၏ Container သည် `root` user အဖြစ် Run နေပြီး Application ထဲတွင် Code Injection (ဥပမာ- RCE Vulnerability) ပါဝင်နေပါက Hacker သည် Container အတွင်းမှ ဖောက်ထွက်ကာ Host Server တစ်ခုလုံး၏ `root` အာဏာကို ရရှိသွားနိုင်သည် (Container Escape Attack)။

ထို့ကြောင့် Production Container များကို မဖြစ်မနေ Hardening (လုံခြုံရေး တင်းကျပ်ခြင်း) ပြုလုပ်ရပါမည်။

---

## ၂။ အဓိက လုံခြုံရေး အားနည်းချက်များနှင့် ကာကွယ်နည်း

### ၂.၁။ Root User အနေဖြင့် မ Run ရန်
Default အနေဖြင့် Dockerfile ထဲတွင် `USER` မသတ်မှတ်ထားပါက Container သည် `root` (UID 0) အနေဖြင့် Run ပါသည်။

**ကာကွယ်နည်း**:
Dockerfile ထဲတွင် သာမန် User အသစ် ဖန်တီး၍ အဆိုပါ User ဖြင့်သာ Process ကို run စေပါ:

```dockerfile
# Alpine Linux တွင် UID 10001 ဖြင့် appuser တည်ဆောက်ခြင်း
RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -S appuser -G appgroup

# Non-root user သို့ ပြောင်းလဲခြင်း
USER appuser
```

---

### ၂.၂။ Read-Only Root Filesystem အသုံးပြုခြင်း
Hacker သည် Container ထဲသို့ ခိုးဝင်မိသည့်အခါ Malicious Shell Scripts သို့မဟုတ် Crypto Miner binary များကို download ဆွဲထည့်လေ့ရှိသည်။

Container ၏ Root File System ကို **Read-Only (ဖတ်ရုံသာ)** အဖြစ် ပိတ်ထားလိုက်ပါက Hacker သည် မည်သည့် File ကိုမျှ အသစ်ရေးသား၍ မရတော့ပါ။

```bash
docker run -d --read-only --tmpfs /tmp --tmpfs /var/run -p 80:80 nginx:alpine
```
*(ယာယီ data ရေးရန် လိုအပ်သော `/tmp` လမ်းကြောင်းကို RAM ပေါ်တွင် tmpfs ဖြင့် ဖွင့်ပေးထားသည်)*

---

### ၂.၃။ Linux Capabilities များကို ဖြုတ်ချခြင်း (`cap-drop ALL`)
Linux Kernel တွင် Process တစ်ခု လုပ်ဆောင်နိုင်သော အခွင့်အာဏာများကို Capabilities (ဥပမာ- Network ဖွဲ့စည်းပုံ ပြင်ခွင့်၊ Kernel module သွင်းခွင့်) အဖြစ် ခွဲထားသည်။ Container အများစုသည် ဤအရာများ မလိုအပ်ပါ။

```bash
docker run -d \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \
  my-web-app
```
* အာဏာအားလုံးကို ဖြုတ်ချပြီး Port 80/443 ဖွင့်ရန် လိုအပ်သော `NET_BIND_SERVICE` တစ်ခုတည်းကိုသာ ခွင့်ပြုလိုက်ခြင်း ဖြစ်သည်။

---

### ၂.၄။ Privilege Escalation တားဆီးခြင်း (`no-new-privileges`)
Process တစ်ခုသည် `setuid` binary များမှတစ်ဆင့် Root အာဏာသို့ မြှင့်တင်ယူခြင်း (Privilege Escalation) မပြုလုပ်နိုင်ရန် တားဆီးခြင်း:

```bash
docker run --security-opt no-new-privileges:true my-app
```

---

### ၂.၅။ Resource Limits သတ်မှတ်ခြင်း (DoS Attack ကာကွယ်ခြင်း)
အကယ်၍ Container တစ်ခုတွင် Memory Leak ဖြစ်ပါက သို့မဟုတ် Traffic အလုံးအရင်း ဝင်လာပါက Host Server ၏ RAM အကုန်လုံးကို ဝါးမြိုသွားပြီး အခြား Services များပါ ပြုတ်ကျသွားနိုင်သည်။

```bash
docker run -d \
  --memory="512m" \
  --memory-reservation="256m" \
  --cpus="1.5" \
  my-app
```

---

## ၃။ Trivy ဖြင့် Docker Image Vulnerabilities (CVE) ရှာဖွေစစ်ဆေးနည်း

**Trivy** သည် ကမ္ဘာကျော် Open-Source Container Vulnerability & Security Scanner ဖြစ်ပြီး CI/CD တွင် မဖြစ်မနေ ထည့်သွင်းသုံးစွဲကြသည်။

### Mac / Linux တွင် Trivy သွင်းခြင်း:
```bash
# macOS
brew install trivy

# Docker ဖြင့် တိုက်ရိုက် run လိုပါက
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image my-image:tag
```

### Image တစ်ခုကို Scan စစ်ဆေးခြင်း:
```bash
trivy image --severity HIGH,CRITICAL php:8.3-fpm-alpine
```

```
┌────────────────────────────────────────────────────────┐
│ TRIVY SCANNER REPORT                                   │
├───────────────────┬──────────────┬──────────┬──────────┤
│ Library / Package │ Vulnerability│ Severity │ Fixed In │
├───────────────────┼──────────────┼──────────┼──────────┤
│ openssl           │ CVE-2024-xxx │ CRITICAL │ 3.1.4-r1 │
│ libxml2           │ CVE-2023-yyy │ HIGH     │ 2.11.5   │
└───────────────────┴──────────────┴──────────┴──────────┘
```
Severity သည် `CRITICAL` သို့မဟုတ် `HIGH` ရှိနေပါက ထို Base Image သို့မဟုတ် Package ကို အသစ် update မြှင့်တင်ရပါမည်။

---

## ၄။ Hardened Production Dockerfile နမူနာ

```dockerfile
FROM php:8.3-fpm-alpine

# Non-root System User & Group တည်ဆောက်ခြင်း
RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -S appuser -G appgroup

WORKDIR /var/www/html

# Source Code များကို appuser ပိုင်ဆိုင်ခွင့်ဖြင့် ကူးယူခြင်း
COPY --chown=appuser:appgroup . .

# Root အာဏာကို ဖြုတ်ချပြီး appuser ဖြင့်သာ Run စေခြင်း
USER appuser

EXPOSE 9000
CMD ["php-fpm"]
```

---

## ၅။ Hardened Docker Compose Service Configuration

```yaml
services:
  web:
    image: my-hardened-web:1.0
    restart: unless-stopped
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    tmpfs:
      - /tmp
      - /var/run
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

---

## ၆။ Rootless Docker ဆိုတာဘာလဲ?

သမားရိုးကျ Docker Daemon (`dockerd`) သည် Linux Host ပေါ်တွင် `root` user အဖြစ် Run ရသည်။ အကယ်၍ Docker Daemon ကိုယ်တိုင် Bug ဖြစ်ပါက Server တစ်ခုလုံး အန္တရာယ်ရှိနိုင်သည်။

**Rootless Docker** သည် သာမန် User Account (Non-root user) အောက်တွင် Docker Daemon ကို User Namespace အသုံးပြု၍ Run ပေးသော နည်းပညာဖြစ်ပြီး Enterprise ပတ်ဝန်းကျင်များတွင် လုံခြုံရေး အမြင့်ဆုံးအနေဖြင့် အသုံးပြုကြသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Security Checklist

| Security Control | မေးခွန်း | အတည်ပြုပြီး |
| :--- | :--- | :---: |
| **No Root Execution** | Dockerfile တွင် `USER` သတ်မှတ်ထားပြီး သာမန် user ဖြင့် run သလား? | [ ] |
| **Trivy Vulnerability Scan** | Image မတင်မီ `CRITICAL` / `HIGH` CVE များကို Scan စစ်ပြီးပြီလား? | [ ] |
| **Memory & CPU Limits** | Container တစ်ခုချင်းစီအတွက် Memory & CPU Limit သတ်မှတ်ထားသလား? | [ ] |
| **Drop Capabilities** | မလိုအပ်သော Linux Capabilities များကို `cap-drop: ALL` ဖြင့် ဖြုတ်ချထားသလား? | [ ] |
| **No Secrets in Dockerfile** | API Keys နှင့် Passwords များကို Dockerfile ထဲတွင် Hardcode မထည့်ထားဘူး မဟုတ်လား? | [ ] |

နောက်သင်ခန်းစာ [09_docker_cicd_and_registries.md](/devops/02_kubernetes_and_cloud/09_docker_cicd_and_registries/) တွင် Docker Image များကို GitHub Actions ဖြင့် Build လုပ်၍ Docker Hub / AWS ECR သို့ အလိုအလျောက် Push ပြုလုပ်သည့် CI/CD Pipeline ကို လေ့လာပါမည်။
