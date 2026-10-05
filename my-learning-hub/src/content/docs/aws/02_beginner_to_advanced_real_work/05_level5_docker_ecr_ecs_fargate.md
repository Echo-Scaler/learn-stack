---
title: "၀၅။ Level 5 — Container Architecture (Docker, ECR, ECS Fargate)"
description: "Container နည်းပညာ (Docker) သည် Application တစ်ခုနှင့် ၎င်းအတွက် လိုအပ်သော Code, Runtime (PHP/Node.js), Libraries များနှင့် Configurations အားလုံးကို Package တစ်"
---

## ၀၅။ Level 5 — Container Architecture (Docker, ECR, ECS Fargate)

---

## ၅.၁ Docker to AWS Architecture Flow

### ၁. ဒီ Concept က ဘာလဲ? (What is it?)
Container နည်းပညာ (Docker) သည် Application တစ်ခုနှင့် ၎င်းအတွက် လိုအပ်သော Code, Runtime (PHP/Node.js), Libraries များနှင့် Configurations အားလုံးကို Package တစ်ခုတည်းအဖြစ် ထုပ်ပိုးထားသော ပေါ့ပါးသည့် Virtualization နည်းပညာ ဖြစ်သည်။ AWS တွင် ထို Container များကို ECR (Image Registry) မှတစ်ဆင့် ECS Fargate (Serverless Container Runner) ဖြင့် Run သော စနစ် ဖြစ်သည်။

```
[ Local Developer Environment ]
  Developer ရေးသားထားသော Laravel / Node.js Code
  -> Multi-stage Dockerfile တည်ဆောက်ခြင်း
  -> docker build -t my-japan-ec-app:v1.0.0 .
                 |
                 v
[ AWS ECR (Private Container Registry) ]
  Private Image Repository သို့ Tag ရိုက်၍ Push တင်ခြင်း
  -> aws ecr get-login-password | docker login ...
  -> docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-japan-ec-app:v1.0.0
  -> ECR Scan on Push က လုံခြုံရေး အားနည်းချက် (CVE) များကို စစ်ဆေးသည်
                 |
                 v
[ AWS ECS + Fargate (Serverless Container Orchestration) ]
  ECS Task Definition က ECR မှ Image ကို Pull ဆွဲထုတ်သည်
  -> ALB နောက်ကွယ်ရှိ Private Subnet (AZ-1a / AZ-1c) တွင် Task ၂ ခု စတင် Run ပေးသည်
  -> Health Check အောင်မြင်ပါက Traffic စတင်လက်ခံပြီး Zero-downtime Rolling Update ပြုလုပ်သည်
```

### ၂. ဘာကြောင့် EC2 ပေါ်တွင် Docker မ run ဘဲ ECS Fargate ကို သုံးတာလဲ?
- **EC2 ပေါ်တွင် Docker run သည့်အခါ:** EC2 OS ကိုယ်တိုင် Patching လုပ်ရသည်၊ Docker Daemon သေသွားပါက ကိုယ်တိုင် ဝင်ထူရသည်၊ Disk ပြည့်မပြည့် စောင့်ကြည့်ရသည်၊ Server အလုံးရေတိုးရန် Auto Scaling ကိုယ်တိုင် ညှိရသည်။
- **ECS Fargate သုံးသည့်အခါ (Serverless Containers):**  
  Underlying Server ဟူ၍ လုံးဝ မရှိတော့ပါ။ CPU နှင့် RAM (ဥပမာ- 0.5 vCPU, 1GB RAM) ကိုသာ သတ်မှတ်ပေးရုံဖြင့် Container ကို Instant Run ပေးသည်။ Container တစ်လုံး ပျက်ကျပါက စက္ကန့်ပိုင်းအတွင်း အသစ်တစ်ခု အလိုအလျောက် အစားထိုး ပြန်ထူပေးသည် (Self-Healing)။

---

## ၅.၂ AWS ECR (Elastic Container Registry)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Docker Container Images များကို လုံခြုံစိတ်ချစွာ သိမ်းဆည်းပေးသော AWS ၏ Private Docker Registry Service ဖြစ်သည်။

### ၂. အရေးကြီးသော Feature များနှင့် Best Practices:
1. **Enhanced Image Scanning:** Image ကို ECR သို့ Push တင်လိုက်သည်နှင့် Amazon Inspector သို့မဟုတ် Clair Engine ဖြင့် OS packages နှင့် Application packages များတွင် CVE Vulnerabilities ပါမပါ အလိုအလျောက် စစ်ဆေးပေးသည်။
2. **Lifecycle Policies:** Image အဟောင်းများ စုပုံနေပြီး S3 Storage စရိတ် မတက်စေရန် Rule သတ်မှတ်ခြင်း (ဥပမာ- နောက်ဆုံးတင်ထားသော Tagged Images ၂၀ သာ ထားရှိပြီး ကျန်အဟောင်းများကို အလိုအလျောက် Delete ပစ်ခြင်း)။
3. **KMS Encryption:** Container Images များကို AWS KMS (SSE-KMS) ဖြင့် Encrypt ပြုလုပ်ထားနိုင်သည်။

### ၃. ECR အသုံးပြုပုံ CLI Commands:
```bash
# ECR Registry သို့ Docker CLI Authentication ရယူခြင်း
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com

# Repository အသစ်တစ်ခု Image Scanning ဖွင့်၍ တည်ဆောက်ခြင်း
aws ecr create-repository \
  --repository-name prod-laravel-app \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Local Docker Image ကို ECR ပုံစံ Tag ရိုက်ခြင်း
docker tag prod-laravel-app:latest 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/prod-laravel-app:v1.0.0

# ECR သို့ Push တင်ခြင်း
docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/prod-laravel-app:v1.0.0
```

---

## ၅.၃ AWS ECS with AWS Fargate (Serverless Containers)

### ၁. ECS Core Terminology ရှင်းလင်းချက်:
- **ECS Cluster:** Container များ စုစည်းတည်ရှိရာ Logical Boundary ဖြစ်သည်။ Fargate အတွက် Cluster ဆောက်ရာတွင် Server ကုန်ကျစရိတ် မရှိပါ (Free Cluster)။
- **Task Definition:** Container မည်မျှ Run မည်၊ မည်သည့် Image သုံးမည်၊ Port မည်မျှ ဖွင့်မည်၊ CPU/RAM မည်မျှ ပေးမည်၊ Secrets Manager မှ မည်သည့် Password ဆွဲယူမည်ကို ရေးသားထားသော JSON Blueprint (Docker Compose နှင့် အလွန်ဆင်တူသည်)။
- **Task:** Task Definition အတိုင်း အမှန်တကယ် Run နေသော Container Instance တစ်ခု။
- **Service:** သတ်မှတ်ထားသော Task အရေအတွက် (ဥပမာ- 2 Tasks) အမြဲ Run နေစေရန် ထိန်းကျောင်းပေးပြီး ALB Target Group နှင့် ချိတ်ဆက်ပေးသော စနစ်။
- **Task Execution Role:** ECS Agent က ECR မှ Image ဆွဲယူရန်နှင့် CloudWatch သို့ Log ပို့ရန် အသုံးပြုသော IAM Role။
- **Task Role:** Container အတွင်းရှိ Laravel Code က S3, SQS, Secrets Manager သို့ Access လုပ်ရန် အသုံးပြုသော IAM Role။

### ၂. Production ECS Task Definition JSON ဥပမာ:
```json
{
  "family": "prod-laravel-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskAppRole",
  "containerDefinitions": [
    {
      "name": "laravel-app",
      "image": "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/prod-laravel-app:v1.0.0",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "APP_ENV", "value": "production" },
        { "name": "APP_DEBUG", "value": "false" }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:ap-northeast-1:123456789012:secret:prod/db-secret:password::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/prod-laravel-app",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### ၃. Zero-Downtime Rolling Update အလုပ်လုပ်ပုံ (Process):
```
[ လက်ရှိအခြေအနေ (v1) ]
  ALB Target Group တွင် v1 Task A နှင့် v1 Task B (စုစုပေါင်း ၂ လုံး) Run နေသည်။

[ Deployment အသစ် စတင်ချိန် (v2) ]
  1. ECS Fargate က v2 Task C အသစ်ကို အရင် စတင် Run ပေးသည်။
  2. v2 Task C ၏ Health Check ကို ALB က စစ်ဆေးသည် (`GET /healthz` -> HTTP 200 OK)။
  3. Healthy ဖြစ်ပါက Traffic စတင် လွှဲပြောင်းပေးပြီးမှ v1 Task A ကို ဘေးကင်းစွာ ဖြုတ်သည် (Deregistration Delay)။
  4. ထို့နောက် v2 Task D ကို ထပ်မံ Run ပြီး အလားတူ စစ်ဆေးကာ v1 Task B ကို ဖြုတ်သည်။
  5. ရလဒ်: User များထံတွင် Downtime တစ်စက္ကန့်မျှ မဖြစ်ပေါ်ဘဲ စနစ် ဗားရှင်းသစ်သို့ ပြီးပြည့်စုံစွာ ကူးပြောင်းသွားသည်။
```

---

## ၅.၄ Hands-on Exercise: ECS Fargate Service တည်ဆောက်ခြင်း

### အဆင့် (၁) — ECS Cluster ဖန်တီးခြင်း
```bash
aws ecs create-cluster --cluster-name prod-fargate-cluster
```

### အဆင့် (၂) — Task Definition Register ပြုလုပ်ခြင်း
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### အဆင့် (၃) — Fargate Service တည်ဆောက်ခြင်း (ALB နှင့် တွဲဖက်၍)
```bash
aws ecs create-service \
  --cluster prod-fargate-cluster \
  --service-name laravel-web-service \
  --task-definition prod-laravel-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-01234567891a,subnet-01234567891c],securityGroups=[sg-0123456789ecs],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/prod-ecs-tg/abcdef,containerName=laravel-app,containerPort=80"
```

---
*နောက်အခန်းသို့ သွားရန်:* [06_Level6_Lambda_APIGateway_DynamoDB.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/06_Level6_Lambda_APIGateway_DynamoDB.md)
