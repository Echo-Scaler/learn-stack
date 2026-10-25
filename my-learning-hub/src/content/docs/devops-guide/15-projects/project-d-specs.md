---
title: "Project D: End-to-End AWS Production Cloud Architecture via Terraform IaC"
description: "Job-Ready Terraform IaC project provisioning multi-tier AWS VPC, ALB, Auto-Scaling EC2, and Multi-AZ RDS PostgreSQL (မြန်မာဘာသာ)"
---

> **ကျွမ်းကျင်မှုနယ်ပယ်**: Terraform, OpenTofu, AWS VPC, ALB, Auto Scaling, Multi-AZ RDS, IAM Least Privilege, S3 Remote Backend, DynamoDB State Locking

---

## 📌 ၁။ ပရောဂျက် မိတ်ဆက်နှင့် ရည်ရွယ်ချက် (Project Overview)

AWS Management Console ပေါ်တွင် click နှိပ်ဆောက်ခြင်း (ClickOps) သည် လူအမှား (Human Error) များပြီး Disaster Recovery ပြုလုပ်ရန် မဖြစ်နိုင်သလောက် ခက်ခဲပါသည်။ လုပ်ငန်းခွင်သုံး Enterprise စံနှုန်းအရ Cloud Infrastructure တစ်ခုလုံးကို Declarative Code အဖြစ် Terraform ဖြင့် ရေးသားပြီး Version Control ပြုလုပ်ထားရမည် ဖြစ်ပါသည်။

ဤ Project D တွင် Production-Ready Multi-AZ 2-Tier Architecture (Custom VPC + Public Subnets with Application Load Balancer + Private Subnets with Auto Scaling EC2 + Database Subnets with RDS Multi-AZ PostgreSQL) ကို Terraform ဖြင့် အစအဆုံး အလိုအလျောက် တည်ဆောက်ပါမည်။

### 🎯 Key Deliverables:
1. S3 Remote State with DynamoDB Concurrent State Locking
2. Multi-AZ Custom VPC (2 Public, 2 Private App, 2 Private DB Subnets across 2 AZs)
3. Chained Security Groups (`sg_alb` ➜ `sg_web` ➜ `sg_db`)
4. Application Load Balancer (ALB) with Target Group & Healthchecks
5. Auto Scaling Group (ASG) with EC2 Launch Template & User Data Docker Bootstrap
6. RDS PostgreSQL Database with Multi-AZ Standby Failover
7. Automated `terraform init`, `terraform plan`, `terraform apply`, and clean `terraform destroy` workflow

---

## 🏗️ ၂။ စနစ် တည်ဆောက်ပုံ (Architecture Diagram)

```text
                     [ Internet / Route 53 DNS ]
                                  │
                                  ▼
                   [ AWS Internet Gateway (IGW) ]
                                  │
┌─────────────────────────────────┴─────────────────────────────────┐
│ AWS Custom VPC (10.0.0.0/16) - ap-southeast-1                     │
│                                                                   │
│  ┌─────────────────────── Public Subnets ──────────────────────┐  │
│  │ AZ-1a (10.0.1.0/24)                 AZ-1b (10.0.2.0/24)     │  │
│  │  [ NAT Gateway A ]                   [ NAT Gateway B ]      │  │
│  │  └───────────────────┬───────────────────────┘              │  │
│  │                      ▼                                      │  │
│  │       [ Application Load Balancer (ALB) ]                   │  │
│  │       (Listens on Port 80/443 - Security Group: sg_alb)     │  │
│  └──────────────────────┬──────────────────────────────────────┘  │
│                         │ Traffic Forwarded (Port 3000)           │
│  ┌──────────────────────▼ Private App Subnets ─────────────────┐  │
│  │ AZ-1a (10.0.10.0/24)                AZ-1b (10.0.20.0/24)    │  │
│  │  [ EC2 Instance 1 ]                  [ EC2 Instance 2 ]     │  │
│  │  └─────────────────── Auto Scaling Group ──────────────────┘│  │
│  │   (Running Docker Web App - Security Group: sg_app)         │  │
│  └──────────────────────┬──────────────────────────────────────┘  │
│                         │ SQL Traffic (Port 5432)                 │
│  ┌──────────────────────▼ Private DB Subnets ──────────────────┐  │
│  │ AZ-1a (10.0.100.0/24)               AZ-1b (10.0.200.0/24)   │  │
│  │  [ RDS PostgreSQL Primary ] ◄──Sync──► [ RDS Multi-AZ ]     │  │
│  │  (No Internet Access - Security Group: sg_db)               │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## 💻 ၃။ အပြည့်အစုံ ရေးသားထားသော Terraform Script များ (Infrastructure as Code)

### ၃.၁ Provider & Remote State (`providers.tf`):
```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # S3 Remote Backend with DynamoDB State Locking
  backend "s3" {
    bucket         = "mycompany-terraform-states-2026"
    key            = "production/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "Production"
      ManagedBy   = "Terraform"
      Project     = "DevOps-Capstone-D"
    }
  }
}
```

---

### ၃.၂ Variables (`variables.tf`):
```hcl
variable "aws_region" {
  type    = string
  default = "ap-southeast-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-southeast-1a", "ap-southeast-1b"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_app_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "private_db_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.100.0/24", "10.0.200.0/24"]
}

variable "instance_type" {
  type    = string
  default = "t3.small"
}

variable "db_password" {
  type        = string
  description = "RDS Master Password"
  sensitive   = true
}
```

---

### ၃.၃ Networking & Subnets (`vpc.tf`):
```hcl
# 1. Custom VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "prod-vpc"
  }
}

# 2. Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "prod-igw"
  }
}

# 3. Public Subnets (ALB & NAT Gateways)
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "prod-public-subnet-${count.index + 1}"
  }
}

# 4. Elastic IP & NAT Gateway (for Private Subnets Outbound Internet)
resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "prod-nat-gateway"
  }
  depends_on = [aws_internet_gateway.igw]
}

# 5. Private App Subnets (EC2 Containers)
resource "aws_subnet" "private_app" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_app_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "prod-private-app-subnet-${count.index + 1}"
  }
}

# 6. Private Database Subnets (RDS Multi-AZ)
resource "aws_subnet" "private_db" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_db_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "prod-private-db-subnet-${count.index + 1}"
  }
}

# 7. Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "prod-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = { Name = "prod-private-rt" }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private_app[count.index].id
  route_table_id = aws_route_table.private.id
}
```

---

### ၃.၄ Security Groups with Least Privilege Chaining (`security_groups.tf`):
```hcl
# SG 1: Public ALB (Allows Port 80/443 from Internet)
resource "aws_security_group" "alb" {
  name        = "prod-alb-sg"
  description = "Allow inbound HTTPS from Internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
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

# SG 2: EC2 App Cluster (Allows Traffic ONLY from ALB Security Group)
resource "aws_security_group" "app" {
  name        = "prod-app-sg"
  description = "Allow traffic exclusively from ALB SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Node API from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id] # Security Group Chaining
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# SG 3: RDS PostgreSQL (Allows Port 5432 ONLY from EC2 App Security Group)
resource "aws_security_group" "db" {
  name        = "prod-db-sg"
  description = "Allow Postgres exclusively from App SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from App Servers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id] # Security Group Chaining
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

---

### ၃.၅ Application Load Balancer & Auto Scaling Group (`compute.tf`):
```hcl
# 1. Target Group
resource "aws_lb_target_group" "app" {
  name        = "prod-app-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

# 2. Application Load Balancer
resource "aws_lb" "alb" {
  name               = "prod-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = { Name = "prod-alb" }
}

# 3. ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# 4. EC2 Launch Template with Docker Bootstrap
resource "aws_launch_template" "app" {
  name_prefix   = "prod-app-template-"
  image_id      = "ami-0df7a207adb9748c7" # Ubuntu 22.04 LTS (ap-southeast-1)
  instance_type = var.instance_type

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              systemctl enable --now docker
              docker run -d --name webapp -p 3000:3000 nginxdemos/hello
              EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

# 5. Auto Scaling Group
resource "aws_autoscaling_group" "asg" {
  name_prefix         = "prod-asg-"
  vpc_zone_identifier = aws_subnet.private_app[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"

  min_size         = 2
  max_size         = 4
  desired_capacity = 2

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
}
```

---

### ၃.၆ Multi-AZ RDS PostgreSQL (`database.tf`):
```hcl
resource "aws_db_subnet_group" "db" {
  name       = "prod-db-subnet-group"
  subnet_ids = aws_subnet.private_db[*].id

  tags = { Name = "prod-db-subnet-group" }
}

resource "aws_db_instance" "postgres" {
  identifier        = "prod-postgres-db"
  allocated_storage = 20
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.t4g.micro"
  db_name           = "production_app"
  username          = "postgres_admin"
  password          = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.db.name
  vpc_security_group_ids = [aws_security_group.db.id]

  multi_az            = true # Multi-AZ High Availability
  publicly_accessible = false
  skip_final_snapshot = true
  storage_encrypted   = true

  tags = { Name = "prod-postgres-db" }
}
```

---

### ၃.၇ Outputs (`outputs.tf`):
```hcl
output "alb_dns_name" {
  description = "Public URL to access the Application Load Balancer"
  value       = aws_lb.alb.dns_name
}

output "rds_endpoint" {
  description = "Private RDS PostgreSQL Database Endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = false
}
```

---

## 🛠️ ၄။ Deployment & Teardown Execution Commands

```bash
# 1. Initialize Terraform Providers & Remote State
terraform init

# 2. Format and Validate Code Quality
terraform fmt -check
terraform validate

# 3. Dry-Run Execution Plan
terraform plan -out=tfplan.binary

# 4. Apply Infrastructure to AWS
terraform apply tfplan.binary

# 5. Verification: Curl the ALB endpoint
curl -I http://$(terraform output -raw alb_dns_name)

# 6. Complete Clean Teardown (Avoid Cloud Costs)
terraform destroy -auto-approve
```

---

## 💼 ၅။ Resume ပေါ်တွင် ထည့်သွင်းဖော်ပြရမည့် စံပြစာသား (Resume Bullets)
- *"Architected and deployed an end-to-end multi-AZ production AWS cloud infrastructure via Terraform (HCL), encompassing a 3-tier custom VPC, Application Load Balancer, EC2 Auto Scaling Group, and Multi-AZ RDS PostgreSQL."*
- *"Implemented zero-trust security group chaining (ALB -> App -> DB) and remote state locking with AWS S3 and DynamoDB to prevent concurrent infrastructure race conditions."*
- *"Automated complete environment provisioning and teardown, slashing infrastructure deployment time from 2 days down to 8 minutes."*
