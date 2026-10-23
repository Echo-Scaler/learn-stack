---
title: "၄။ ECS & EKS Image Pull Integration"
description: "ECS Task Execution Role vs Task Role၊ Private Subnet တွင် VPC Endpoints ဖြင့် ECR Image ဆွဲယူနည်း နှင့် EKS Worker Node/IRSA Integration"
---

# ၄။ ECS & EKS Image Pull Integration

## ECS တွင် ECR Image ဆွဲယူခြင်း (Image Pull Permissions)

Amazon ECS Task တစ်ခုက ECR မှ Container Image ကို ဆွဲယူနိုင်ရန် IAM Permissions မဖြစ်မနေ လိုအပ်ပါသည်။ ဤနေရာတွင် Solution Architect များ အများဆုံး ရောထွေးလေ့ရှိသော Role ၂ ခု ရှိပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ECS IAM Roles: Execution vs Task                     │
├───────────────────────────────────┬────────────────────────────────────┤
│ ECS Task Execution Role           │ ECS Task Role                      │
│ (executionRoleArn)                │ (taskRoleArn)                      │
├───────────────────────────────────┼────────────────────────────────────┤
│ • **ECS Agent (AWS)** က သုံးသည်     │ • **Container Application** က သုံးသည် │
│ • ECR မှ Image Pull ဆွဲရန်         │ • S3 သို့ ဓာတ်ပုံ Upload လုပ်ရန်     │
│ • CloudWatch Logs သို့ Log ပို့ရန်  │ • DynamoDB သို့ Data ရေးရန်          │
│ • Secrets Manager မှ လျှို့ဝှက်ချက်   │ • SQS သို့ Message ပေးပို့ရန်       │
│   ဆွဲယူရန်                        │                                    │
│ • **Policy:**                     │ • **Policy:**                      │
│   AmazonECSTaskExecutionRolePolicy│   Custom Application Permissions   │
└───────────────────────────────────┴────────────────────────────────────┘
```

> **သတိပြုရန် (SAA-C03 Key Trap):**  
> အကယ်၍ ECS Fargate Task က ECR မှ Image ဆွဲမရဖြစ်နေပါက (CannotPullContainerError) အဖြေသည် Task Role မဟုတ်ဘဲ **Task Execution Role** တွင် ECR Permission ပျောက်ဆုံးနေခြင်း ဖြစ်ပါသည်။

---

## Private Subnet ရှိ ECS Task များ NAT မလိုဘဲ Image Pull ပြုလုပ်နည်း (VPC Endpoints)

အကယ်၍ ECS Task များသည် **Private Subnet** တွင် ရှိနေပြီး Internet Gateway သို့မဟုတ် NAT Gateway မရှိပါက ECR မှ Image ကို မည်သို့ ဆွဲယူမည်နည်း?

```
[ Private Subnet: ECS Fargate Task ]
       │
       ├─────────────────────────────────────────┐
       ▼ (Control & Auth API)                    ▼ (Docker Image Layers)
[ ECR Interface VPC Endpoints ]          [ S3 Gateway VPC Endpoint ]
  • com.amazonaws.region.ecr.api           • com.amazonaws.region.s3
  • com.amazonaws.region.ecr.dkr
```

### 💡 SAA-C03 မဖြစ်မနေ သိရမည့် စာမေးပွဲ အချက်:
ECR Image Layers များ၏ အမှန်တကယ် Raw Data များကို **Amazon S3** ပေါ်တွင် သိမ်းဆည်းထားပါသည်။ ထို့ကြောင့် Private Subnet တွင် NAT Gateway မရှိဘဲ ECR Image ဆွဲယူနိုင်ရန် အောက်ပါ **VPC Endpoints ၃ ခုစလုံး** လိုအပ်ပါသည်:
1. **`com.amazonaws.<region>.ecr.api` (Interface Endpoint):** ECR Auth နှင့် Metadata အတွက်။
2. **`com.amazonaws.<region>.ecr.dkr` (Interface Endpoint):** Docker Image manifest ဆွဲယူရန်။
3. **`com.amazonaws.<region>.s3` (Gateway Endpoint - အခမဲ့):** Image ၏ Data Layers များကို S3 မှ တိုက်ရိုက် ဒေါင်းလုဒ်ဆွဲရန်။

---

## Amazon EKS တွင် ECR Image ဆွဲယူပုံ

Kubernetes Cluster (EKS) တွင် ECR မှ Image ဆွဲယူရန် နည်းလမ်း ၂ မျိုး သုံးနိုင်သည်:

1. **EKS Node Group IAM Role (Node-level):**  
   EC2 Worker Node များ၏ IAM Role တွင် `AmazonEC2ContainerRegistryReadOnly` Managed Policy ကို ပေးထားခြင်းဖြင့် ထို Node ပေါ်ရှိ မည်သည့် Pod မဆို Image ဆွဲယူခွင့် ရရှိသည်။
2. **IAM Roles for Service Accounts (IRSA / Pod Identity - Pod-level):**  
   Pod တစ်ခုချင်းစီအလိုက် သီးခြား ECR Repository ကိုသာ ဆွဲယူခွင့်ပေးလိုပါက ServiceAccount နှင့် IAM Role ကို OIDC ဖြင့် ချိတ်ဆက်၍ Least Privilege စည်းမျဉ်းအတိုင်း ခွင့်ပြုနိုင်သည်။
3. **Cross-Account Pull:**  
   အကယ်၍ EKS သည် အခြား Account ရှိ ECR မှ Image ဆွဲလိုပါက Kubernetes `imagePullSecrets` (Secret) ဖြင့် ECR Login Token ကို pass ပေးရသည်။
