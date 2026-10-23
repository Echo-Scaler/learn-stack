---
title: "၆။ Production CI/CD Workflow & Troubleshooting"
description: "GitHub Actions ဖြင့် ECR CI/CD Pipeline တည်ဆောက်ခြင်း၊ Git SHA Tagging Strategy၊ CloudTrail Auditing နှင့် အဖြစ်များသော ECR Errors ဖြေရှင်းနည်း"
---

# ၆။ Production CI/CD Workflow & Troubleshooting

## Production CI/CD Pipeline (GitHub Actions + Amazon ECR)

လက်တွေ့ လုပ်ငန်းခွင်တွင် Developer များသည် Docker command များကို Terminal တွင် ကိုယ်တိုင်ရိုက်၍ ECR သို့ တင်လေ့မရှိပါ။ GitHub သို့ Code Push လိုက်သည်နှင့် **Automated CI/CD Pipeline** က အလိုအလျောက် တာဝန်ယူ တည်ဆောက်ပေးပါသည်:

```
[ Developer Git Push (main) ]
              │
              ▼
    [ GitHub Actions Runner ]
              │
       (1. Checkout Code & Run Unit Tests)
              │
       (2. Authenticate to AWS via OIDC Role - No Keys)
              │
       (3. Docker Build Image)
              │
       (4. Tag Image with Git Commit SHA)
              │
       (5. Docker Push to ECR)
              │
              ▼
   [ Amazon ECR Repository ] ──► (Inspector Vulnerability Scan)
              │
              ▼
   [ Deploy to ECS / EKS ]
```

---

## ⚠️ Tagging Strategy: `:latest` Tag ကို အဘယ်ကြောင့် မသုံးသင့်သနည်း?

အတွေ့အကြုံနည်းသော အင်ဂျင်နီယာများသည် Docker Image အားလုံးကို `my-app:latest` ဟုသာ အမြဲ တင်လေ့ရှိကြသည်။
- **ပြဿနာ:** Production Server ပေါ်တွင် Bug ဖြစ်ပေါ်၍ ယခင် Version သို့ Rollback ပြန်ဆင်းလိုသည့်အခါ `latest` က မည်သည့် Code ဖြစ်သည်ကို ခွဲခြားမရနိုင်တော့ပါ။
- **အကြံပြုချက်:** အမြဲတမ်း **Git Commit SHA** သို့မဟုတ် **Semantic Versioning** ဖြင့် Tag တပ်ပါ:
  - ဥပမာ- `pos-api:sha-7b2e8c9` သို့မဟုတ် `pos-api:v2.4.1`

---

## GitHub Actions Workflow YAML စံနမူနာ (OIDC Role Based)

```yaml
name: Deploy to Amazon ECR

on:
  push:
    branches: [ "main" ]

permissions:
  id-token: write # AWS OIDC Login အတွက် လိုအပ်သည်
  contents: read

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        use: actions/checkout@v4

      - name: Configure AWS Credentials (OIDC)
        use: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsECRRole
          aws-region: us-east-1

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, Tag and Push Docker Image
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          REPOSITORY: my-web-app
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG .
          docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG
          echo "IMAGE_URI=$REGISTRY/$REPOSITORY:$IMAGE_TAG" >> $GITHUB_ENV
```

---

## ECR Troubleshooting: အဖြစ်များသော Errors များနှင့် ဖြေရှင်းနည်း

| Error မက်ဆေ့ခ်ျ | အကြောင်းအရင်း | ဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **`no basic auth credentials`** | Docker CLI က ECR Auth Token မရရှိသေးခြင်း | `aws ecr get-login-password \| docker login ...` command ကို အရင်ဆုံး run ပါ |
| **`authorization token has expired`** | Login ဝင်ထားသော ECR Auth Token ၏ ၁၂ နာရီ သက်တမ်း ကုန်သွားခြင်း | `aws ecr get-login-password` ဖြင့် Token အသစ် ပြန်လည် ရယူပါ |
| **`ImageAlreadyExistsException`** | Repository တွင် Tag Immutability ဖွင့်ထားပြီး ရှိပြီးသား Tag အမည်တူဖြင့် Push တင်ရန် ကြိုးစားခြင်း | Version Tag အသစ် (ဥပမာ- `:v1.0.1`) သို့မဟုတ် Git SHA သို့ ပြောင်းလဲ Push တင်ပါ |
| **`CannotPullContainerError`** | ECS Task က ECR မှ Image ဆွဲမရခြင်း | ECS **Task Execution Role** တွင် ECR Read Policy ရှိမရှိ စစ်ဆေးပါ။ Private Subnet ဖြစ်ပါက **VPC Endpoints (ECR API, DKR & S3)** ရှိမရှိ စစ်ဆေးပါ |
| **`RepositoryNotFoundException`** | Image Tag တွင် ECR Repository အမည် မှားယွင်းစွာ ရေးမိခြင်း | `aws ecr describe-repositories` ဖြင့် အမည် မှန်မမှန် ပြန်လည် စစ်ဆေးပါ |
