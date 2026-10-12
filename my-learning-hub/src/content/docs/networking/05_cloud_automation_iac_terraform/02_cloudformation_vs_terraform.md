---
title: CloudFormation vs Terraform & Core Fundamentals
description: AWS CloudFormation vs Terraform နှိုင်းယှဉ်ချက်, Providers, Resources, Data Sources, Variables နှင့် Outputs
---

## ၁။ CloudFormation vs Terraform

> [!TIP]
> **အဓိက Tools:** AWS CloudFormation သို့မဟုတ် Terraform ကို အရင်တစ်ခု ကျွမ်းကျင်အောင် လေ့လာပါ။ နှစ်ခုစလုံးကို တစ်ပြိုင်နက် စတင်ဖို့ မလိုပါဘူး။ လုပ်ငန်းခွင် အများစုတွင် Multi-cloud သုံးနိုင်သော **Terraform** ကို အသုံးများပါသည်။

---

## ၂။ Terraform Core Building Blocks

```hcl
# 1. Provider
provider "aws" {
  region = var.aws_region
}

# 2. Variables
variable "aws_region" {
  default = "ap-northeast-1"
}

# 3. Resources
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "prod-vpc" }
}

# 4. Data Sources (လက်ရှိ AWS မှ အချက်အလက် ခေါ်ယူခြင်း)
data "aws_availability_zones" "available" {
  state = "available"
}

# 5. Outputs
output "vpc_id" {
  value = aws_vpc.main.id
}
```
