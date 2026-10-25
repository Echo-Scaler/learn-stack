---
title: "Module 09: Infrastructure as Code (IaC) with Terraform for DevOps Engineers"
description: "Declarative Infrastructure, HCL Syntax, Terraform Workflow, Remote State & DynamoDB Locking, Modular Architecture & Production AWS Project"
---

# 🏗️ Module 09: Infrastructure as Code (IaC) with Terraform for DevOps Engineers

> **Cloud Console ပေါ်တွင် လက်ဖြင့် Click နှိပ် ဆောက်လုပ်ခြင်းကို အဆုံးသတ်ပြီး Declarative HCL Code ဖြင့် Version-Controlled, Reusable, Production-Grade AWS Infrastructure များ အလိုအလျောက် တည်ဆောက်ခြင်း**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Infrastructure as Code (IaC) with HashiCorp Terraform: HCL Mastery, Remote State Locking with S3 & DynamoDB, Reusable Modules & CI Integration**
- **Track Level**: Core Cloud Automation (Cloud အလိုအလျောက် တည်ဆောက်မှု)
- **Target Audience**: DevOps Engineers, Cloud Engineers, SREs
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **IaC Concepts & Benefits**: Declarative (Terraform) vs Imperative (Ansible/Scripts) ကွာခြားချက်နှင့် IaC ၏ တန်ဖိုးကို ရှင်းလင်းစွာ နားလည်ခြင်း။
* [x] **HCL (HashiCorp Configuration Language)**: Blocks, Arguments, Identifiers, Providers, Resources, Data Sources, Variables, Outputs နှင့် Locals များကို ပိုင်နိုင်စွာ ရေးသားနိုင်ခြင်း။
* [x] **Terraform Core Workflow**: `terraform init`, `fmt`, `validate`, `plan`, `apply` နှင့် `destroy` အဆင့်များကို စနစ်တကျ အသုံးချတတ်ခြင်း။
* [x] **State Management & State Security**: `terraform.tfstate` ၏ အရေးပါပုံ၊ အန္တရာယ်များ၊ Remote Backend in AWS S3 နှင့် DynamoDB State Locking (Race Condition ကာကွယ်မှု) ကို တပ်ဆင်နိုင်ခြင်း။
* [x] **Modular Architecture**: Reusable Terraform Modules (VPC Module, Web App Module) ရေးဆွဲပြီး Dev, Staging, Prod Environment များကို ခွဲခြား စီမံနိုင်ခြင်း။
* [x] **State Drift Detection & Imports**: AWS Console မှ လက်ဖြင့် ပြင်ဆင်လိုက်သော Drift များကို ဖမ်းယူနိုင်ခြင်းနှင့် လက်ရှိ Cloud Resource များကို `terraform import` ဖြင့် Code ထဲ သွင်းယူနိုင်ခြင်း။
* [x] **Safe Code Habits**: State file များနှင့် Secrets များကို Git repository သို့ မည်သည့်အခါမျှ မပါစေရန် လုံခြုံစွာ ကာကွယ်နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 03: Git & Collaboration](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/03-git/README.md) — Git versioning, `.gitignore` စည်းမျဉ်းများ။
2. [Module 07: Cloud Fundamentals & AWS](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/07-aws-fundamentals/README.md) — AWS VPC, EC2, Security Groups နှင့် IAM အခြေခံ။
3. Local စက်တွင် Terraform CLI (v1.5+) နှင့် AWS CLI ကို သွင်းယူထားခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Declarative vs Imperative** | Declarative သည် "အလိုရှိသော နောက်ဆုံးရလဒ် (What to achieve)" ကို ကြေညာခြင်းဖြစ်ပြီး Imperative သည် "အဆင့်ဆင့် လုပ်ရမည့် အမိန့်များ (How to do)" ကို ရေးသားခြင်း ဖြစ်သည် | Terraform သည် Declarative ဖြစ်သဖြင့် VPC/Server ၏ Final State ကို ရေးရုံဖြင့် လိုအပ်သော အဆင့်များကို ၎င်းဘာသာ တွက်ချက်ဆောက်ပေးသည်။ | Terraform (Declarative) vs Bash (Imperative) |
| **State File (`terraform.tfstate`)** | Terraform ကုဒ်များနှင့် တကယ့် Cloud ပေါ်ရှိ Resource များအကြား ချိတ်ဆက်ပေးသော Single Source of Truth မှတ်တမ်း | State file ပျက်စီးသွားပါက Terraform သည် Cloud ပေါ်တွင် ဘာတွေ ဆောက်ပြီးပြီဖြစ်ကြောင်း မသိတော့ဘဲ ထပ်မံ အသစ်ဆောက်မိနိုင်သည်။ | `backend "s3" { bucket = "my-tfstate" }` |
| **State Locking** | အင်ဂျင်နီယာတစ်ဦးမှ `terraform apply` လုပ်နေစဉ် အခြားသူတစ်ဦးမှ တစ်ပြိုင်နက် ပြင်ဆင်ခွင့် မရအောင် Database ဖြင့် သော့ခတ်ထားသော ယန္တရား | အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် Concurrent state corruption မဖြစ်စေရန် မရှိမဖြစ် လိုအပ်သည်။ | AWS DynamoDB LockTable |
| **Drift Detection** | Terraform ကုဒ်ထဲတွင် မပါဘဲ တစ်စုံတစ်ဦးမှ AWS Console ပေါ်တွင် လက်ဖြင့် သွားရောက် ပြင်ဆင်ထားသော ကွာဟချက်ကို ရှာဖွေဖော်ထုတ်ခြင်း | Production စနစ်များတွင် "ဘယ်သူ ဘာပြင်လိုက်မှန်း မသိဘဲ စနစ်ပျက်ခြင်း" ကို ကာကွယ်ပေးသည်။ | `terraform plan` (Drift တွေ့ရှိပါက ကုဒ်အတိုင်း ပြန်ပြင်ပေးမည်) |
| **Terraform Module** | သီးခြား resource များကို အုပ်စုဖွဲ့၍ ပြန်လည်အသုံးပြုနိုင်သော Container Package (ဥပမာ- VPC Module) | Code duplication မဖြစ်စေဘဲ Client သို့မဟုတ် Environment အသစ်တိုင်းတွင် ကုဒ်အဟောင်းကို ပြန်သုံးနိုင်သည်။ | `module "vpc" { source = "./modules/vpc" }` |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ Terraform ၏ အဓိက အလုပ်လုပ်ပုံ အဆင့် (၅) ဆင့် (The Core Workflow)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TERRAFORM WORKFLOW                              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. `terraform init`     ──► Download AWS Provider Plugins & Backend    │
│ 2. `terraform fmt`      ──► Format HCL code to standard indentation    │
│ 3. `terraform validate` ──► Verify syntax, argument names & types      │
│ 4. `terraform plan`     ──► Dry-run: Preview What will be Created (+)  │
│                             Modified (~) or Destroyed (-)              │
│ 5. `terraform apply`    ──► Execute and provision Real Cloud Resources │
└────────────────────────────────────────────────────────────────────────┘
```

---

### ၅.၂ Remote State Architecture with S3 & DynamoDB Locking

```text
[ DevOps Engineer A ]                [ DevOps Engineer B ]
        │ `terraform apply`                  │ `terraform apply`
        ▼                                    ▼
┌────────────────────────────────────────────────────────┐
│         AWS DynamoDB Table (`tf-state-locks`)          │
│   (Acquires Lock: Engineer A holds the lock! 🔒)       │
│   (Engineer B is blocked until Lock is released 🚫)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         Amazon S3 Bucket (`company-tf-states`)         │
│   • Versioning: ENABLED (Revert state on accident)     │
│   • Encryption: AES-256 / AWS KMS (Secure Secrets)     │
│   • File: `production/terraform.tfstate`               │
└────────────────────────────────────────────────────────┘
```

---

## 🏗️ ၆။ Production HCL Project Structure (ဖိုင်တွဲ ဖွဲ့စည်းပုံ)

```text
sample-terraform-project/
├── backend.tf         # Remote S3 Backend & DynamoDB Lock Table configuration
├── providers.tf       # AWS Provider version specification
├── main.tf            # Core Cloud Resources (VPC, Subnets, EC2, Security Groups)
├── variables.tf       # Input Variables declarations with validation & defaults
├── outputs.tf         # Output Values (EC2 Public IP, VPC ID, etc.)
├── terraform.tfvars   # Actual Environment Variable Values (DO NOT COMMIT TO GIT!)
└── .gitignore         # State files, local locks & sensitive tfvars exclusions
```

---

## 💻 ၇။ Production Code Examples (အဓိက ဖိုင်များ ရှင်းလင်းချက်)

### ၁။ `providers.tf`:
```hcl
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
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = "E-Commerce-Production"
    }
  }
}
```

### ၂။ `backend.tf` (Remote State with DynamoDB Locking):
```hcl
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-states-prod"
    key            = "ecommerce/production.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock-table"
  }
}
```

### ၃။ `variables.tf`:
```hcl
variable "aws_region" {
  type        = string
  description = "AWS Region to deploy infrastructure"
  default     = "ap-southeast-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the Virtual Private Cloud"
  default     = "10.0.0.0/16"
}

variable "instance_type" {
  type        = string
  description = "EC2 Instance type"
  default     = "t3.micro"
}
```

### ၄။ `main.tf` (VPC, Subnet, Security Group & EC2):
```hcl
# 1. Custom Virtual Private Cloud
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.environment}-vpc"
  }
}

# 2. Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-subnet-1a"
  }
}

# 3. Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

# 4. Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.environment}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# 5. Security Group
resource "aws_security_group" "web" {
  name        = "${var.environment}-web-sg"
  description = "Allow HTTP and SSH inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-web-sg"
  }
}
```

---

## 🛡️ ၈။ State File Security & Secrets Handling Rules

> [!CAUTION]
> **အရေးကြီးသော လုံခြုံရေး စည်းမျဉ်းများ (Never Violate):**
> 1. **Never Commit `terraform.tfstate` to Git**: State file ထဲတွင် Database Passwords, Private Keys များနှင့် Resource IDs များ Plain text အဖြစ် ပါဝင်နေသဖြင့် Git ထဲ ရောက်သွားပါက အလွန် အန္တရာယ်ကြီးမားသည်။
> 2. **Always Encrypt S3 Backend**: S3 bucket တွင် `Server-Side Encryption (AES-256 / KMS)` နှင့် `Bucket Versioning` မဖြစ်မနေ အသက်သွင်းပါ။
> 3. **Add to `.gitignore`**:
>    ```text
>    .terraform/
>    *.tfstate
>    *.tfstate.backup
>    *.tfvars
>    .terraform.lock.hcl
>    ```

---

## ⚠️ ၉။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **`Error: Error acquiring the state lock`** | ယခင် `terraform apply` သည် အလယ်တွင် crash ဖြစ်သွားသဖြင့် DynamoDB ထဲတွင် Lock ID ကျန်ရှိနေခြင်း | အခြားသူ မ run နေကြောင်း သေချာပါက Lock ကို manual ဖြုတ်ပါ: `terraform force-unlock <LOCK_ID>` |
| **`Resource already exists`** | Terraform code မရေးမီ AWS Console ပေါ်တွင် အဆိုပါ Resource (ဥပမာ Security Group) ကို လက်ဖြင့် ကြိုတင် ဆောက်ထားမိခြင်း | လက်ရှိ Resource ကို Terraform state ထဲသို့ သွင်းယူပါ: `terraform import <resource_type>.<name> <resource_id>` |
| **`Cycle: ResourceA -> ResourceB -> ResourceA`** | Resource တစ်ခုနှင့်တစ်ခု အပြန်အလှန် မှီခိုနေသော Circular Dependency ဖြစ်နေခြင်း | Resource များကြား dependency လမ်းကြောင်းကို ဖြတ်တောက်ပြီး Sub-resources သီးခြား ခွဲထုတ်ပါ။ |

---

## 🏋️ ၁၀။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Provision & Destroy AWS VPC using Terraform**
1. `sample-terraform-project` folder ထဲသို့ ဝင်ရောက်ပါ။
2. `terraform init` run ၍ AWS Provider ကို download ဆွဲပါ။
3. `terraform fmt` နှင့် `terraform validate` ဖြင့် Syntax ကို စစ်ဆေးပါ။
4. `terraform plan` run ပြီး မည်သည့် Resources (၄) ခု တည်ဆောက်မည်ကို စစ်ဆေးပါ။
5. `terraform apply` ဖြင့် AWS ပေါ်တွင် အမှန်တကယ် တည်ဆောက်ပြပါ။
6. AWS Console တွင် VPC တက်လာမှုကို verify လုပ်ပါ။
7. ပြီးဆုံးပါက ဘေလ်မတက်စေရန် `terraform destroy` ဖြင့် အကုန် ပြန်လည် ဖျက်သိမ်းပါ။

---

## ❓ ၁၁။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. `terraform plan` မလုပ်ဘဲ တိုက်ရိုက် `terraform apply` လုပ်ခြင်းသည် အဘယ်ကြောင့် အန္တရာယ် ကြီးမားသနည်း?
2. Terraform တွင် Remote State နှင့် State Locking (DynamoDB) အသုံးပြုခြင်း၏ အဓိက အကျိုးကျေးဇူး (၂) ခုကို ဖော်ပြပါ။
3. Terraform တွင် Resource တစ်ခုကို ကုဒ်ထဲမှ delete လုပ်လိုက်ပြီး `terraform apply` လုပ်ပါက AWS ပေါ်ရှိ တကယ့် Resource မှာ အဘယ်သို့ ဖြစ်သွားမည်နည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. `terraform plan` ကို စစ်ဆေးခြင်းမပြုပါက မည်သည့် Resources များကို အသစ်ဆောက်မည်၊ မည်သည့်အရာများကို ဖျက်ဆီးပစ်မည် (Destroy/Recreate) ကို ကြိုတင် မသိရှိနိုင်ဘဲ Production Database သို့မဟုတ် Server များကို မတော်တဆ ဖျက်မိနိုင်သောကြောင့် ဖြစ်သည်။
2. (က) အင်ဂျင်နီယာ အများအပြား ပြိုင်တူ apply လုပ်ရာတွင် State file ပျက်စီးမသွားအောင် DynamoDB ဖြင့် lock ခတ်ပေးခြင်း။ (ခ) State file ကို S3 တွင် စနစ်တကျ Versioning နှင့် Encryption ဖြင့် လုံခြုံစွာ ဗဟိုပြု သိမ်းဆည်းနိုင်ခြင်း။
3. Terraform သည် Declarative ဖြစ်သောကြောင့် ကုဒ်ထဲတွင် မရှိတော့သော Resource ကို AWS ပေါ်မှ အလိုအလျောက် **Terminate / Delete (Destroy)** လုပ်ဆောင်သွားမည် ဖြစ်သည်။
</details>

---

## 💼 ၁၂။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production တွင် Terraform State Drift ဆိုတာဘာလဲ? ၎င်းကို သင် မည်သို့ ရှာဖွေပြီး မည်သို့ ဖြေရှင်းမည်နည်း?**
> **Sample Answer**:
> "State Drift ဆိုသည်မှာ Terraform ကုဒ်ထဲတွင် မပါဝင်ဘဲ တစ်စုံတစ်ဦးမှ AWS Console ပေါ်တွင် လက်ဖြင့် သွားရောက် ပြင်ဆင်လိုက်ခြင်း (ဥပမာ- Security Group တွင် port ဖွင့်လိုက်ခြင်း သို့မဟုတ် Instance type ပြောင်းလိုက်ခြင်း) ကြောင့် Terraform State နှင့် တကယ့် Cloud အခြေအနေ ကွာဟသွားခြင်း ဖြစ်သည်။
> ၎င်းကို ရှာဖွေရန် `terraform plan` ကို run ပါသည်။ Terraform သည် Cloud ပေါ်ရှိ အခြေအနေအစစ်အမှန်ကို Refresh လုပ်ပြီး ကုဒ်နှင့် မကိုက်ညီသော Drift များကို Terminal တွင် ရှင်းလင်းစွာ ထုတ်ပြပါမည်။
> **ဖြေရှင်းနည်း**: (၁) အကယ်၍ Console မှ ပြင်ဆင်ချက်သည် မတော်တဆ အမှားဖြစ်ပါက `terraform apply` လုပ်ခြင်းဖြင့် Terraform သည် ကုဒ်ပါအတိုင်း မူလအခြေအနေသို့ အလိုအလျောက် ပြန်လည် ပြင်ဆင်သွားပါမည်။ (၂) အကယ်၍ အဆိုပါ ပြင်ဆင်ချက်သည် အမှန်တကယ် လိုအပ်သော အပြောင်းအလဲဖြစ်ပါက Terraform ကုဒ်ထဲတွင် အဆိုပါ ပြင်ဆင်ချက်ကို ထည့်သွင်းပြီး Commit တင်ကာ Sync ပြန်လုပ်ပါမည်။"

---

## 📚 ၁၃။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Terraform Official Documentation](https://developer.hashicorp.com/terraform/docs)
- [Terraform AWS Provider Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices by Anton Babenko](https://www.terraform-best-practices.com/)
