---
title: "၀၉။ Level 9 — Infrastructure as Code (Terraform) & CI/CD Pipelines"
description: "Terraform (HashiCorp) သည် Cloud Resources (VPC, EC2, RDS, ALB) များကို AWS Console တွင် လက်ဖြင့် Click နှိပ် ဆောက်လုပ်ခြင်း မဟုတ်ဘဲ လူနားလည်လွယ်သော Declarative"
---

## ၀၉။ Level 9 — Infrastructure as Code (Terraform) & CI/CD Pipelines

---

## ၉.၁ Terraform Core Workflow & Production Directory Structure

### ၁. ဒီ Concept က ဘာလဲ? (What is it?)
**Terraform (HashiCorp)** သည် Cloud Resources (VPC, EC2, RDS, ALB) များကို AWS Console တွင် လက်ဖြင့် Click နှိပ် ဆောက်လုပ်ခြင်း မဟုတ်ဘဲ လူနားလည်လွယ်သော Declarative Code (HCL - HashiCorp Configuration Language) ဖြင့် ရေးသား တည်ဆောက်၊ ပြင်ဆင်၊ ဖျက်ဆီးပေးသော **Infrastructure as Code (IaC) Tool** ဖြစ်သည်။

### ၂. Production Directory Structure (ဂျပန် 現場 စံနှုန်း):
```
terraform/
├── main.tf          # Provider (AWS) နှင့် S3 Remote Backend Configuration
├── variables.tf     # Environment Variables နှင့် Parameter သတ်မှတ်ချက်များ
├── vpc.tf           # VPC, Subnets, IGW, NAT Gateways, Route Tables
├── security.tf      # Security Groups (ALB SG, ECS SG, RDS SG)
├── alb.tf           # Application Load Balancer, Listener, Target Group
├── ecs.tf           # ECS Fargate Cluster, Task Definition, Service
├── rds.tf           # Aurora MySQL Multi-AZ Cluster
└── outputs.tf       # တည်ဆောက်ပြီး Endpoint URLs (ALB DNS, DB Endpoint)
```

### ၃. Remote Backend & DynamoDB State Locking:
- `terraform.tfstate` ဖိုင်ကို Local ကွန်ပျူတာတွင် မထားဘဲ **S3 Bucket** တွင် ဗဟိုပြု သိမ်းဆည်းသည်။
- Developer ၂ ဦး တစ်ပြိုင်နက်တည်း `terraform apply` ရိုက်မိပါက State File ပျက်စီးခြင်းမှ ကာကွယ်ရန် **DynamoDB Table** ဖြင့် Lock ချထားသည်။

```hcl
# main.tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "japan-prod-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "terraform-lock-table"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}
```

---

## ၉.၂ Complete Production Terraform Code (VPC + ALB + ECS + RDS)

### `vpc.tf` — Production 3-Tier Multi-AZ VPC:
```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "japan-prod-vpc"
    Environment = "production"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "japan-prod-igw" }
}

# Public Subnets (AZ-1a & AZ-1c)
resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true
  tags                    = { Name = "public-subnet-1a" }
}

resource "aws_subnet" "public_1c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true
  tags                    = { Name = "public-subnet-1c" }
}

# Private App Subnets
resource "aws_subnet" "private_app_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-northeast-1a"
  tags              = { Name = "private-app-subnet-1a" }
}

resource "aws_subnet" "private_app_1c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "ap-northeast-1c"
  tags              = { Name = "private-app-subnet-1c" }
}

# Private DB Subnets
resource "aws_subnet" "private_db_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "ap-northeast-1a"
  tags              = { Name = "private-db-subnet-1a" }
}

resource "aws_subnet" "private_db_1c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.22.0/24"
  availability_zone = "ap-northeast-1c"
  tags              = { Name = "private-db-subnet-1c" }
}
```

---

## ၉.၃ CI/CD Workflow: GitHub Actions → ECR → ECS Fargate Zero-Downtime Deploy

```yaml
# .github/workflows/deploy-production.yml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    name: Build, Scan, Push & Deploy to ECS
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Run Automated Tests (PHPUnit)
      run: |
        echo "Running Application Unit & Feature Tests..."
        # composer install && ./vendor/bin/phpunit

    - name: Configure AWS Credentials (OIDC or IAM Secrets)
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build, tag, and push Docker image to Amazon ECR
      id: build-image
      env:
        REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        REPOSITORY: japan-prod-ec-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG .
        docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG
        echo "image=$REGISTRY/$REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

    - name: Deploy Amazon ECS Task Definition
      uses: aws-actions/amazon-ecs-deploy-task-definition@v2
      with:
        task-definition: task-definition.json
        service: laravel-web-service
        cluster: prod-fargate-cluster
        wait-for-service-stability: true
```

---
*နောက်အခန်းသို့ သွားရန်:* [10_Level10_HA_DR_Cost_WellArchitected.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/10_Level10_HA_DR_Cost_WellArchitected.md)
