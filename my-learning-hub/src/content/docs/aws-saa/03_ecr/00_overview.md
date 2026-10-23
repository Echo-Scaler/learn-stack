---
title: "Feature 3: Amazon ECR — Feature Titles & Usage Overview"
description: "Amazon Elastic Container Registry (ECR) ကို Docker၊ ECS၊ EKS နှင့် SAA-C03 စာမေးပွဲအတွက် အခြေခံမှ လက်တွေ့အထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# Feature 3: Amazon ECR ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Container Registry လမ်းညွှန်

Amazon ECR (Elastic Container Registry) သည် Docker Container Images များကို လုံခြုံစိတ်ချစွာ သိမ်းဆည်းခြင်း၊ စီမံခန့်ခွဲခြင်းနှင့် လိုအပ်သည့်နေရာသို့ ဖြန့်ဝေပေးခြင်းတို့ကို ဆောင်ရွက်ပေးသော AWS Managed Container Registry ဖြစ်ပါသည်။ အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ လက်တွေ့ အသုံးချပုံ (Usages) များကို အစဉ်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ ECR ဆိုတာဘာလဲ & Docker အခြေခံ**](/aws-saa/03_ecr/01_what_is_ecr_and_docker_basics/) | Registry, Repository, Images, Containers, Tags, Digests, Layers | Docker Image တည်ဆောက်ပုံ၊ Image Layers များ မျှဝေသုံးစွဲပုံနှင့် Developer မှ Production Flow အထိ |
| **02** | [**၂။ Components & Authentication**](/aws-saa/03_ecr/02_ecr_components_and_authentication/) | Private vs Public ECR, IAM Policies, Repository Policies, `get-login-password` | Docker CLI အား AWS CLI ဖြင့် အထောက်အထားစစ်ဆေးခြင်း (Auth) နှင့် Account အချင်းချင်း Image မျှဝေသုံးစွဲခြင်း |
| **03** | [**၃။ Hands-on Lab: Docker to ECR**](/aws-saa/03_ecr/03_hands_on_lab_docker_to_ecr/) | Repo ဖန်တီးခြင်း၊ Build, Tag, Push, Pull, Test & Resource Cleanup | Web App ကို Docker Image ပြုလုပ်၍ ECR သို့ Push တင်ခြင်း၊ Version update ပြုလုပ်ခြင်းနှင့် စရိတ်ရှင်းလင်းခြင်း |
| **04** | [**၄။ ECS & EKS Image Pull Integration**](/aws-saa/03_ecr/04_ecs_and_eks_image_pull_integration/) | ECS Task Execution Role, `AmazonECSTaskExecutionRolePolicy`, EKS IRSA | ECS Fargate နှင့် EKS Cluster များက ECR မှ Image ဆွဲယူနိုင်ရန် IAM Permissions သတ်မှတ်ပုံ |
| **05** | [**၅။ Security Scanning & Lifecycle Policies**](/aws-saa/03_ecr/05_security_scanning_and_lifecycle_policies/) | Basic Scanning, Enhanced Inspector, Immutable Tags, Lifecycle Rules, Replication | Image ပေါ်ရှိ လုံခြုံရေး အားနည်းချက် (CVE) စစ်ဆေးခြင်း၊ Image အဟောင်းများ Auto-delete ပြုလုပ်ခြင်းနှင့် Multi-Region ကူးယူခြင်း |
| **06** | [**၆။ Production CI/CD Workflow & Troubleshooting**](/aws-saa/03_ecr/06_production_cicd_workflow_and_monitoring/) | GitHub Actions Pipeline, Git SHA Tagging, CloudTrail, ImagePullBackOff Runbook | Code Push လိုက်သည်နှင့် ECR သို့ Auto-build/scan/push ပြုလုပ်ခြင်းနှင့် Image Pull မရသည့် Error ဖြေရှင်းနည်း |
| **07** | [**၇။ ECR vs Docker Hub & SAA-C03 Quiz**](/aws-saa/03_ecr/07_ecr_vs_dockerhub_and_saa_c03_quiz/) | ECR vs Docker Hub နှိုင်းယှဉ်ချက်၊ SAA-C03 Traps နှင့် Quiz မေးခွန်းများ | စာမေးပွဲတွင် မေးလေ့ရှိသော ECR လှည့်ကွက်များနှင့် အသေးစိတ် ရှင်းလင်းချက်ပါဝင်သည့် အလေ့အကျင့် စာမေးပွဲ |
