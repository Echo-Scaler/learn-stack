---
title: Cloud Infrastructure Automation Preparation
description: Infrastructure as Code (IaC), Terraform VPC Networking Automation, cidrsubnet() Function, Cloud-Init Bootstrapping, Security Group Chaining, CI/CD Pipeline Integration
---

Cloud Console (Web UI) မှ ခလုတ်များလိုက်နှိပ်ပြီး VPC, Subnet, Route Table များ ဆောက်လုပ်ခြင်း (ခေါ် **ClickOps**) သည် အမှားများစေပြီး၊ Server အသစ် ထပ်တိုးသည့်အခါ မည်သို့ ဆောက်ခဲ့သည်ကို ပြန်လည်ခြေရာခံရန် မဖြစ်နိုင်တော့ပါ။ ဤပြဿနာကို ဖြေရှင်းရန် **Infrastructure as Code (IaC) - Terraform** ဖြင့် Cloud Networking ကို အလိုအလျောက် တည်ဆောက်ပုံကို လက်တွေ့ကျကျ လေ့လာပါမည်။

---

## ၁။ Cloud Infrastructure Automation ဆိုတာ ဘာလဲ? (What & Why)

**Infrastructure as Code (IaC)** ဆိုသည်မှာ Cloud ပေါ်ရှိ Server များ၊ Network များ၊ Database များနှင့် Firewall များကို လူကိုယ်တိုင် လိုက်မဆောက်ဘဲ **Code (Configuration File) အဖြစ် ရေးသားကာ အလိုအလျောက် တည်ဆောက်ခြင်း (Provisioning)** ဖြစ်သည်။

### ClickOps vs Infrastructure as Code (IaC)

| အချက်အလက် | ClickOps (AWS Console ပေါ်တွင် လက်ဖြင့်ဆောက်ခြင်း) | IaC (Terraform ဖြင့် Code ရေး၍ ဆောက်ခြင်း) |
| :--- | :--- | :--- |
| **Speed** | နှေးကွေးသည် (နာရီနှင့်ချီ၍ အချိန်ကုန်သည်) | **အလွန်မြန်သည်** (Command တစ်ချက်ဖြင့် စက္ကန့်ပိုင်းအတွင်း ပြီးသည်) |
| **Human Error** | အမှားများတတ်သည် (Subnet ID မှားချိတ်ခြင်း၊ Route မေ့ကျန်ခြင်း) | **လုံးဝမမှားနိုင်ပါ** (Code အတိုင်း တိကျစွာ ဆောက်ပေးသည်) |
| **Reproducibility** | Staging, QA, Production သို့ ထပ်တူပွားရန် ခက်ခဲသည် | Code ကို Parameter ပြောင်းရုံဖြင့် ပတ်ဝန်းကျင်သစ် ချက်ချင်းရသည် |
| **Version Control** | မည်သူ ဘယ်အချိန်က ပြင်ဆင်ခဲ့သည်ကို မသိနိုင်ပါ | **Git Commit** ဖြင့် သမိုင်းကြောင်း အပြည့်အစုံ မှတ်တမ်းတင်နိုင်သည် |

---

## ၂။ Terraform ၏ `cidrsubnet()` Function ဖြင့် Dynamic Subnet တွက်ချက်ခြင်း

Terraform တွင် Subnet IP များကို Hardcode မရိုက်ဘဲ `cidrsubnet()` function ဖြင့် စနစ်တကျ အလိုအလျောက် ခွဲဝေနိုင်သည်:

```hcl
cidrsubnet(prefix, newbits, netnum)
```
- **prefix**: မူလ Base VPC CIDR (ဥပမာ- `10.0.0.0/16`)
- **newbits**: ထပ်မံတိုးချဲ့လိုသော Bit အရေအတွက် (ဥပမာ- `8` တိုးပါက `/16 + 8 = /24` ဖြစ်သွားသည်)
- **netnum**: မည်သည့် Subnet အမှတ်စဉ် ဖြစ်သည် (ဥပမာ- `0, 1, 2, ...`)

```hcl
cidrsubnet("10.0.0.0/16", 8, 1)  # Output: "10.0.1.0/24"  (Public Subnet 1)
cidrsubnet("10.0.0.0/16", 8, 2)  # Output: "10.0.2.0/24"  (Public Subnet 2)
cidrsubnet("10.0.0.0/16", 8, 11) # Output: "10.0.11.0/24" (Private App Subnet 1)
cidrsubnet("10.0.0.0/16", 8, 21) # Output: "10.0.21.0/24" (Isolated DB Subnet 1)
```

---

## ၃။ Complete Production Terraform Networking Code (`main.tf`)

ဤ Terraform Script သည် AWS ပေါ်တွင် Production-grade Multi-AZ VPC, Public/Private Subnets, Internet Gateway, NAT Gateway, နှင့် Route Table များကို အလိုအလျောက် ဆောက်လုပ်ပေးပါမည်:

```hcl
# versions.tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1" # Tokyo Region
}

# -------------------------------------------------------------
# 1. VPC (Virtual Private Cloud)
# -------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "production-enterprise-vpc"
    Environment = "production"
  }
}

# -------------------------------------------------------------
# 2. INTERNET GATEWAY (For Public Inbound & Outbound)
# -------------------------------------------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "prod-internet-gateway"
  }
}

# -------------------------------------------------------------
# 3. PUBLIC SUBNETS (AZ-A & AZ-C for ALB & NAT Gateways)
# -------------------------------------------------------------
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 1) # 10.0.1.0/24
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "prod-public-subnet-1a"
  }
}

resource "aws_subnet" "public_c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 2) # 10.0.2.0/24
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    Name = "prod-public-subnet-1c"
  }
}

# -------------------------------------------------------------
# 4. ELASTIC IP & NAT GATEWAY (For Private Egress)
# -------------------------------------------------------------
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags   = { Name = "prod-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_a.id # NAT Gateway သည် Public Subnet တွင် ရှိရမည်

  tags = { Name = "prod-nat-gateway" }
  depends_on = [aws_internet_gateway.igw]
}

# -------------------------------------------------------------
# 5. PRIVATE APPLICATION SUBNETS (AZ-A & AZ-C)
# -------------------------------------------------------------
resource "aws_subnet" "private_app_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, 11) # 10.0.11.0/24
  availability_zone = "ap-northeast-1a"

  tags = { Name = "prod-private-app-1a" }
}

resource "aws_subnet" "private_app_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, 12) # 10.0.12.0/24
  availability_zone = "ap-northeast-1c"

  tags = { Name = "prod-private-app-1c" }
}

# -------------------------------------------------------------
# 6. ROUTE TABLES & ASSOCIATIONS
# -------------------------------------------------------------
# Public Route Table -> Routes all outbound traffic to IGW
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "prod-public-route-table" }
}

resource "aws_route_table_association" "pub_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "pub_c" {
  subnet_id      = aws_subnet.public_c.id
  route_table_id = aws_route_table.public_rt.id
}

# Private Route Table -> Routes all outbound traffic to NAT Gateway
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = { Name = "prod-private-route-table" }
}

resource "aws_route_table_association" "priv_a" {
  subnet_id      = aws_subnet.private_app_a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "priv_c" {
  subnet_id      = aws_subnet.private_app_c.id
  route_table_id = aws_route_table.private_rt.id
}
```

---

## ၄။ Security Group Chaining (IP မလိုဘဲ SG အချင်းချင်း ချိတ်ဆက်ခြင်း)

လုပ်ငန်းခွင် (Genba) တွင် အကောင်းဆုံး Security Best Practice မှာ Database Security Group တွင် IP Address ရိုက်ထည့်မည့်အစား **App Security Group ID ကိုသာ ဝင်ခွင့်ပေးသည့် (Chaining Pattern)** ဖြစ်သည်:

```hcl
# 1. Application Load Balancer SG (Internet မှ Port 80, 443 သာ လက်ခံမည်)
resource "aws_security_group" "alb_sg" {
  name        = "prod-alb-security-group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTPS from Internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. App Instance SG (ALB မှ လာသော Port 8080 ကိုသာ လက်ခံမည် - Direct Internet Blocked)
resource "aws_security_group" "app_sg" {
  name        = "prod-app-security-group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow traffic ONLY from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # Chained Security Group!
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Database SG (App SG မှ လာသော MySQL Port 3306 ကိုသာ လက်ခံမည်)
resource "aws_security_group" "db_sg" {
  name        = "prod-db-security-group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow MySQL ONLY from App Servers"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id] # Chained Security Group!
  }
}
```

---

## ၅။ Server Bootstrap Automation (Cloud-Init User Data)

Server အသစ် စတင် Boot တက်လာသည်နှင့် Docker, Nginx, Monitoring Agent များကို အလိုအလျောက် သွင်းပေးရန် **Cloud-Init (User Data)** ကို အသုံးပြုသည်:

```yaml
#cloud-config
# user-data.sh or cloud-init.yaml
package_update: true
package_upgrade: true

packages:
  - docker.io
  - git
  - curl
  - htop

runcmd:
  - systemctl enable docker
  - systemctl start docker
  - usermod -aG docker ubuntu
  # Run Production App Container automatically
  - docker run -d --name web_app --restart always -p 8080:80 nginx:alpine
```

---

## ၆။ CI/CD Automation Pipeline (GitHub Actions Ready)

Developer က GitHub သို့ Code Push လိုက်သည်နှင့် Network Infrastructure ကို အလိုအလျောက် စစ်ဆေးပြီး Deploy လုပ်ပေးမည့် Workflow:

```yaml
# .github/workflows/terraform-deploy.yml
name: "Terraform Infrastructure Automation"

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.7.0"

      - name: Terraform Format Check
        run: terraform fmt -check

      - name: Terraform Init
        run: terraform init
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Plan
        run: terraform plan -no-color

      - name: Terraform Apply (Main branch only)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## ၇။ Production Best Practices & Advantages Summary

1. **Remote State with S3 & DynamoDB Locking**: Terraform State File ကို Local စက်တွင် မသိမ်းဘဲ AWS S3 Bucket တွင် Encrypted သိမ်းပြီး DynamoDB ဖြင့် Team Concurrency State Lock ပြုလုပ်ပါ။
2. **Blast Radius Reduction**: VPC Network Infrastructure ကို App Deployment Code များနှင့် ရောမထားဘဲ သီးခြား Repository သို့မဟုတ် Terraform Module အဖြစ် ခွဲထုတ်ထားပါ။
3. **Zero Downtime Updates**: Multi-AZ နှင့် Route Table အလိုအလျောက် စီမံခန့်ခွဲမှုကြောင့် Traffic မပြတ်တောက်ဘဲ Network ချဲ့ထွင်နိုင်ခြင်း။
