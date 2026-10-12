---
title: Terraform State Management, Remote State & Modules
description: terraform.tfstate, S3 Backend, DynamoDB Lock, Reusable Modules နှင့် CLI Commands
---

## ၁။ Terraform State File & S3 Remote Backend

Terraform သည် လက်ရှိ Cloud အခြေအနေကို `terraform.tfstate` တွင် မှတ်သားထားသည်။ Team အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် State ပျောက်ဆုံးခြင်းနှင့် တပြိုင်နက် ပြင်ဆင်မိခြင်း (Race Condition) ကို ကာကွယ်ရန် **Amazon S3** တွင် State သိမ်းဆည်းပြီး **DynamoDB** ဖြင့် Lock ချုပ်ရသည်:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-prod"
    key            = "network/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

---

## ၂။ Terraform CLI Commands

```bash
terraform init     # Provider plugins နှင့် backend ကို initialize လုပ်သည်
terraform plan     # မဆောက်မီ အပြောင်းအလဲများကို dry-run စစ်ဆေးသည်
terraform apply    # Cloud ပေါ်တွင် အမှန်တကယ် တည်ဆောက်သည်
terraform destroy  # တည်ဆောက်ထားသမျှ အကုန်ဖျက်ပစ်သည်
```
