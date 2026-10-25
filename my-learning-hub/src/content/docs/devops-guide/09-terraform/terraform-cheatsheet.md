---
title: "🏗️ Terraform CLI & HCL Functions Cheatsheet for DevOps"
description: "🏗️ Terraform CLI & HCL Functions Cheatsheet for DevOps"
---


> **Production Terraform CLI Workflow, State Commands, HCL Built-in Functions & Workspace Operations Reference**

---

## ⚡ ၁။ Core Workflow Commands (အခြေခံ အလုပ်လုပ်ပုံ Commands များ)

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `terraform init` | Initialize working directory | Providers plugins များနှင့် Remote Backend ချိတ်ဆက်မှုများကို ဒေါင်းလုဒ် ဆွဲသည်။ |
| `terraform init -upgrade` | Upgrade provider plugins | Provider ဗားရှင်းအသစ်များသို့ upgrade လုပ်သည်။ |
| `terraform fmt -recursive` | Format HCL syntax | HCL ကုဒ်များ၏ Indentation နှင့် space များကို စံချိန်စံညွှန်းအတိုင်း သပ်ရပ်စွာ ပြင်ပေးသည်။ |
| `terraform validate` | Validate configuration syntax | Argument names, types များနှင့် syntax အမှားများကို စစ်ဆေးသည်။ |
| `terraform plan` | Dry-run execution preview | Cloud ပေါ်တွင် မည်သည့် resources များကို create/modify/destroy လုပ်မည်ကို ကြိုတင်ပြသသည်။ |
| `terraform plan -out=tfplan` | Save execution plan to file | Plan ရလဒ်ကို ဖိုင်အဖြစ် သိမ်းဆည်းပြီး CI/CD pipeline တွင် တိုက်ရိုက် apply ရန် သုံးသည်။ |
| `terraform apply` | Apply changes to cloud | Plan အတိုင်း အတည်ပြုချက်တောင်းပြီး Cloud ပေါ်တွင် အမှန်တကယ် တည်ဆောက်သည်။ |
| `terraform apply -auto-approve` | Apply without interactive prompt | CI/CD automation တွင် အတည်ပြုချက် မတောင်းဘဲ တိုက်ရိုက် run စေသည်။ |
| `terraform destroy` | Destroy all managed infrastructure | Terraform ဖြင့် ဆောက်ထားသော Cloud resources အားလုံးကို အပြီးတိုင် ဖျက်ပစ်သည်။ |

---

## 🎯 ၂။ Targeted Operations & Workspace Management

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `terraform apply -target=aws_s3_bucket.media` | Target specific resource only | Resource အားလုံး မဟုတ်ဘဲ သီးခြား Resource တစ်ခုတည်းကိုသာ ရွေးချယ် apply လုပ်သည်။ |
| `terraform plan -destroy` | Preview destruction | ဖျက်ဆီးမည့် resources များကိုသာ သီးခြား preview ကြည့်ရှုသည်။ |
| `terraform workspace list` | List environments | လက်ရှိ Terraform workspaces (default, dev, prod) ကို ပြသည်။ |
| `terraform workspace new staging` | Create new workspace | Environment အသစ်တစ်ခုအတွက် workspace သစ် ခွဲထုတ်သည်။ |
| `terraform workspace select prod` | Switch to workspace | သတ်မှတ်ထားသော environment workspace သို့ ကူးပြောင်းသည်။ |

---

## 🗄️ ၃။ State Inspection & State Manipulation Commands

| Command | အဓိက အသုံးပြုပုံ | ရှင်းလင်းချက် |
|---|---|---|
| `terraform state list` | List all resources in state | State file ထဲတွင် မှတ်တမ်းတင်ထားသော Cloud resources အားလုံးကို ပြသည်။ |
| `terraform state show <RESOURCE>` | Show detailed resource attributes | သီးခြား resource တစ်ခု၏ attributes အားလုံး (IPs, ARNs, IDs) ကို ပြသည်။ |
| `terraform state rm <RESOURCE>` | Remove resource from state | Cloud ပေါ်မှ မဖျက်ဘဲ Terraform ၏ ကြီးကြပ်မှုအောက်မှသာ ဖယ်ထုတ်သည်။ |
| `terraform state mv <OLD> <NEW>` | Rename or move resource in state | Resource အမည်ပြောင်းလဲခြင်း သို့မဟုတ် Module ထဲသို့ ရွှေ့ပြောင်းခြင်း။ |
| `terraform force-unlock <LOCK_ID>` | Force remove DynamoDB lock | Crash ကြောင့် ကျန်နေခဲ့သော State Lock ကို အတင်း ဖြုတ်ပစ်သည်။ |
| `terraform import <TYPE>.<NAME> <ID>` | Import existing cloud resource | AWS Console ပေါ်တွင် လက်ဖြင့် ဆောက်ထားပြီးသား resource ကို Terraform ထဲ သွင်းယူသည်။ |

---

## 🧩 ၄။ Useful HCL Built-in Functions

```hcl
# 1. lookup: Map ထဲမှ Key တန်ဖိုး ရှာဖွေခြင်း (Default value ပါဝင်သည်)
lookup({ dev = "t3.micro", prod = "t3.large" }, var.environment, "t3.micro")

# 2. merge: Maps နှစ်ခုကို ပေါင်းစည်းခြင်း (Tags စီမံရာတွင် အသုံးများပါသည်)
merge(local.common_tags, { Name = "production-app" })

# 3. element: List ထဲမှ index အလိုက် item ထုတ်ယူခြင်း
element(var.availability_zones, 0) # ➜ "ap-southeast-1a"

# 4. file: ဒေသတွင်း ဖိုင်ပါ စာသားများကို ဖတ်ယူခြင်း (Public key, User data)
file("${path.module}/scripts/bootstrap.sh")

# 5. jsonencode: HCL object ကို JSON string အဖြစ် ပြောင်းလဲခြင်း (IAM Policy တွင် သုံးသည်)
jsonencode({
  Version = "2012-10-17"
  Statement = [...]
})
```
