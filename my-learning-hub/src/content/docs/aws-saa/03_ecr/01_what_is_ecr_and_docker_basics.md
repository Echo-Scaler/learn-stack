---
title: "၁။ ECR ဆိုတာဘာလဲ & Docker အခြေခံ"
description: "Amazon ECR ၏ အဓိက အခန်းကဏ္ဍ၊ Docker Images၊ Containers၊ Registries၊ Tags၊ Digests၊ Image Layers နှင့် Developer မှ Production Deployment အထိ Architecture Flow"
---

# ၁။ ECR ဆိုတာဘာလဲ & Docker အခြေခံ

## Amazon ECR (Elastic Container Registry) ဆိုတာဘာလဲ?

**Amazon ECR** သည် Docker Container Images များနှင့် Open Container Initiative (OCI) artifacts များကို လုံခြုံစွာ သိမ်းဆည်း၊ စီမံခန့်ခွဲပြီး ဖြန့်ဝေပေးသော **Fully-managed Container Image Registry** ဖြစ်ပါသည်။

Application တစ်ခုကို Dockerize ပြုလုပ်ပြီးပါက ထို Docker Image ကို Cloud ပေါ်တွင် လုံခြုံစွာ သိမ်းဆည်းရန် "Registry (စတိုခန်း)" တစ်ခု မဖြစ်မနေ လိုအပ်ပါသည်။ Amazon ECR သည် အဆိုပါ ရည်ရွယ်ချက်အတွက် AWS မှ သီးသန့် ထုတ်လုပ်ပေးထားသော ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## Docker အခြေခံ ဝေါဟာရများ ရှင်းလင်းချက်

ECR ကို နားလည်ရန် အောက်ပါ အခြေခံ သဘောတရားများကို ဦးစွာ သဘောပေါက်ထားရပါမည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Container Terminology                           │
├───────────────────┬────────────────────────────────────────────────────┤
│ Docker Image      │ Code, Libraries, Runtime အားလုံးပါဝင်သော Read-only  │
│                   │ Blueprint ပုံစံခွက် (ဥပမာ- OS + PHP 8.2 + Laravel)  │
├───────────────────┼────────────────────────────────────────────────────┤
│ Docker Container  │ ထို Image ကို အခြေခံပြီး အမှန်တကယ် Run နေသော        │
│                   │ သီးခြားခွဲထုတ်ထားသည့် Executable Instance           │
├───────────────────┼────────────────────────────────────────────────────┤
│ Registry          │ Docker Images များ သိမ်းဆည်းထားရာ စတိုတိုက်ကြီး        │
│                   │ (ဥပမာ- AWS ECR, Docker Hub)                       │
├───────────────────┼────────────────────────────────────────────────────┤
│ Repository        │ Application တစ်ခုတည်း၏ Version အမျိုးမျိုးကို စုထားရာ  │
│                   │ အံဆွဲ (ဥပမာ- `my-app/pos-api`)                     │
├───────────────────┼────────────────────────────────────────────────────┤
│ Image Tag         │ Version အမှတ်အသား (ဥပမာ- `:v1.0.0`, `:v2.1`, `:latest`)│
├───────────────────┼────────────────────────────────────────────────────┤
│ Image Digest      │ Image ရဲ့ မပြောင်းလဲနိုင်သော SHA256 Cryptographic Hash │
│                   │ (ဥပမာ- `sha256:7b2e8c...` လုံးဝ အတုမပြုလုပ်နိုင်ပါ)   │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## Docker Image Layers အလုပ်လုပ်ပုံ

Docker Image တစ်ခုသည် ဖိုင်တစ်ခုတည်း မဟုတ်ဘဲ အလွှာများစွာ (**Layers**) စုစည်းတည်ဆောက်ထားခြင်း ဖြစ်ပါသည်:

```
┌────────────────────────────────────────────────────────┐
│ Container Write Layer (Read-Write - Running Container) │
├────────────────────────────────────────────────────────┤
│ Layer 4: COPY . /var/www/html (Application Code - 5MB)  │ ◄── Code ပြင်ပါက ဤ Layer သာ အသစ်ဖြစ်သည်
├────────────────────────────────────────────────────────┤
│ Layer 3: RUN composer install (Vendor Libs - 40MB)     │
├────────────────────────────────────────────────────────┤
│ Layer 2: RUN apt-get install php-fpm nginx (150MB)     │
├────────────────────────────────────────────────────────┤
│ Layer 1: FROM ubuntu:22.04 (Base OS - 70MB)            │ ◄── အောက်ဆုံး Base Layer
└────────────────────────────────────────────────────────┘
```

### Layer Caching ၏ အားသာချက်:
အကယ်၍ သင်သည် Application Code အနည်းငယ်သာ ပြင်ဆင်ပြီး Image အသစ် Build လုပ်ပါက:
- အောက်ခြေရှိ Ubuntu နှင့် PHP Layers များကို ECR သို့ ပြန်လည် Upload လုပ်စရာ မလိုပါ။
- ပြောင်းလဲသွားသော **Code Layer (5MB) ကိုသာ ECR သို့ Push တင်ရသဖြင့်** CI/CD Pipeline အလွန်မြန်ဆန်ပြီး Network Bandwidth ချွေတာပေးပါသည်။

---

## ECR End-to-End Architecture Flow

Developer ၏ Local Computer မှ Production Server အထိ Image စီးဆင်းပုံ:

```
[ Developer Local Machine ]
       │
       ▼ (1. docker build)
[ Local Docker Image ]
       │
       ▼ (2. aws ecr get-login-password & docker push)
[ Amazon ECR Private Repository ] ──► (Automated Security Vulnerability Scan)
       │
       ├─────────────────────────────────┐
       ▼ (3. Image Pull via IAM Role)    ▼ (Image Pull via IAM Role)
[ Amazon ECS / Fargate ]          [ Amazon EKS (Kubernetes) ]
Running Task Containers           Running Pod Containers
       │                                 │
       └────────────────┬────────────────┘
                        │
                        ▼
               [ End-User Traffic ]
```

1. **Build:** Developer က Dockerfile ဖြင့် Image တည်ဆောက်သည်။
2. **Push:** ECR Registry သို့ Login ဝင်ပြီး Version Tag (ဥပမာ- `pos-api:1.0.0`) ဖြင့် Push တင်သည်။
3. **Scan:** ECR က ထို Image ပေါ်ရှိ လုံခြုံရေး အားနည်းချက် (CVE vulnerabilities) များကို အလိုအလျောက် စစ်ဆေးသည်။
4. **Deploy:** ECS Task သို့မဟုတ် EKS Pods များက IAM Execution Role ခွင့်ပြုချက်ဖြင့် ECR မှ Image ကို ဆွဲယူ၍ (Pull) Application ကို စတင် run ပေးသည်။
