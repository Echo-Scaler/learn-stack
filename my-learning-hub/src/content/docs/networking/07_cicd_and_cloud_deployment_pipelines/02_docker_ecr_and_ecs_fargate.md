---
title: Docker Containerization, Amazon ECR & ECS Fargate
description: Docker Image Build, Amazon ECR Private Registry နှင့် Amazon ECS Fargate Serverless Containers
---

## ၁။ Docker to Amazon ECR Flow

```bash
# ၁။ Docker Image Build ပြုလုပ်ခြင်း
docker build -t my-app:v1.0.0 .

# ၂။ Amazon ECR သို့ Login ဝင်ခြင်း
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com

# ၃။ Tag ကပ်ပြီး ECR သို့ Push တင်ခြင်း
docker tag my-app:v1.0.0 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:v1.0.0
docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:v1.0.0
```

---

## ၂။ Amazon ECS with Fargate

Server (EC2) များကိုယ်တိုင် OS Patching လုပ်စရာမလိုဘဲ Serverless အနေဖြင့် Container Task များကို AWS က အပြည့်အဝ စီမံခန့်ခွဲပေးသည်။
