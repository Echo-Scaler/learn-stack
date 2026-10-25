---
title: "🛠️ Terraform Incident Troubleshooting & State Recovery Guide"
description: "🛠️ Terraform Incident Troubleshooting & State Recovery Guide"
---


> **Terraform ပြေးဆွဲရာတွင် ကြုံတွေ့ရသော State Locking Errors၊ Resource Import လုပ်နည်း၊ Drift ဖြေရှင်းနည်းနှင့် ဘေးကင်းရေး အကြံပြုချက်များ**

---

## 🚨 Incident 1: `Error: Error acquiring the state lock` (DynamoDB Lock Stuck)

### 症状 (Symptoms):
- `terraform apply` သို့မဟုတ် `plan` လုပ်သောအခါ အောက်ပါ Error တက်ခြင်း:
  ```text
  Error: Error acquiring the state lock: ConditionalCheckFailedException: The conditional request failed
  Lock Info:
    ID:        5a8b7c9d-1234-5678-90ab-cdef12345678
    Path:      company-tf-states/production.tfstate
    Operation: OperationTypeApply
    Who:       alice@macbook-pro.local
  ```

### 💡 Root Cause:
- ယခင် `terraform apply` လုပ်ဆောင်နေစဉ် network ပြတ်တောက်သွားခြင်း၊ terminal ပိတ်ချလိုက်ခြင်း သို့မဟုတ် အခြား အင်ဂျင်နီယာတစ်ဦးမှ တပြိုင်နက် apply ပြေးဆွဲနေခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
1. အခြား အင်ဂျင်နီယာတစ်ဦး တကယ် apply မလုပ်နေကြောင်း သေချာစွာ မေးမြန်းစစ်ဆေးပါ။
2. သေချာပါက Lock ID ကို အသုံးပြု၍ Lock ကို အတင်း ဖယ်ရှားပါ:
   ```bash
   terraform force-unlock 5a8b7c9d-1234-5678-90ab-cdef12345678
   ```

---

## 🚨 Incident 2: `Resource already exists` (Console ပေါ်တွင် ကြိုဆောက်ထားမိခြင်း)

### 症状 (Symptoms):
- `terraform apply` လုပ်ရာတွင်:
  ```text
  Error: creating EC2 Security Group (web-sg): InvalidGroup.Duplicate: The security group 'web-sg' already exists in VPC 'vpc-012345'
  ```

### 💡 Root Cause:
- အဆိုပါ Security Group ကို ယခင်က AWS Console ပေါ်တွင် လက်ဖြင့် သွားရောက် ဆောက်လုပ်ခဲ့သော်လည်း Terraform State file ထဲတွင် မှတ်တမ်း မပါဝင်သေးခြင်း။

### 🛠️ ဖြေရှင်းနည်း (`terraform import` သုံးခြင်း):
Cloud ပေါ်ရှိ Resource ကို မဖျက်ဘဲ Terraform State ထဲသို့ သွင်းယူပါ:
```bash
# Syntax: terraform import <resource_type>.<resource_name> <cloud_id>
terraform import aws_security_group.web_sg sg-0123456789abcdef0

# ထို့နောက် plan ပြန်စစ်ပါ (Drift မရှိကြောင်း စစ်ဆေးပါ)
terraform plan
```

---

## 🚨 Incident 3: Accidental Resource Recreation (`# forces replacement` သတိပေးချက်)

### 症状 (Symptoms):
- `terraform plan` ထွက်လာသောအခါ အနီရောင် `- / +` သင်္ကေတဖြင့် Database သို့မဟုတ် Server ကို **Destroy လုပ်ပြီးမှ အသစ်ပြန်ဆောက်မည် (forces replacement)** ဟု ပြနေခြင်း။

### 💡 Root Cause:
- In-place update ပြုလုပ်၍မရသော Argument (ဥပမာ- Database Name, Availability Zone, VPC ID) တစ်ခုခုကို ကုဒ်ထဲတွင် ပြောင်းလဲလိုက်မိခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
1. **Never Apply blindly**: `forces replacement` ပါနေပါက မည်သည့်အခါမျှ yes မရိုက်ပါနှင့်။
2. အရေးကြီးသော Resources များ (RDS, S3) ကို မတော်တဆ မဖျက်မိစေရန် HCL ထဲတွင် **`prevent_destroy` lifecycle rule** ကို မဖြစ်မနေ ထည့်သွင်းထားပါ:
   ```hcl
   resource "aws_db_instance" "prod_db" {
     # ...
     lifecycle {
       prevent_destroy = true
     }
   }
   ```

---

## 🚨 Incident 4: Circular Dependency Cycles (`Cycle: A -> B -> A`)

### 症状 (Symptoms):
- `terraform plan` တွင် `Error: Cycle: aws_security_group.web -> aws_security_group.db -> aws_security_group.web` ဟု ပြခြင်း။

### 💡 Root Cause:
- Security Group Web သည် DB ကို မှီခိုနေပြီး DB သည် Web ကို ပြန်လည် မှီခိုနေသော စက်ဝိုင်းသဖွယ် ချိတ်ဆက်မှု ဖြစ်နေခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
- Security Group အတွင်း Inline `ingress` အစား သီးခြား **`aws_security_group_rule` standalone resource** ကို ခွဲထုတ်ရေးသားခြင်းဖြင့် Dependency loop ကို ဖြတ်တောက်နိုင်ပါသည်။
