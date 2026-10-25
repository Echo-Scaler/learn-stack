---
title: "Sample Terraform AWS VPC Infrastructure Guide"
description: "Step-by-step Execution, Plan Review, Apply and Destroy Guide for Sample Terraform Infrastructure"
---

# 🏗️ Sample Terraform AWS VPC Infrastructure

ဤ Sample Project သည် AWS Cloud ပေါ်တွင် **Custom VPC, Public Subnet, Internet Gateway, Route Table နှင့် Web Security Group** တို့ကို Terraform HCL Code ဖြင့် စနစ်တကျ အလိုအလျောက် တည်ဆောက်ပြထားသော လက်တွေ့စမ်းသပ်မှု ဖြစ်ပါသည်။

---

## 🚀 How to Execute & Review (စတင် ပြေးဆွဲ စမ်းသပ်ပုံ)

### အဆင့် ၁: Providers ကို Download ဆွဲပါ
```bash
cd devops-learning-guide/09-terraform/sample-terraform-project
terraform init
```

### အဆင့် ၂: Syntax နှင့် Format ကို စစ်ဆေးပါ
```bash
terraform fmt
terraform validate
```

### အဆင့် ၃: Dry-Run Plan ကို မဖြစ်မနေ ကြိုတင် စစ်ဆေးပါ (Plan Review)
```bash
terraform plan
# Terminal တွင် Plan: 5 to add, 0 to change, 0 to destroy ပြသမည်ကို သေချာ စစ်ဆေးပါ။
```

### အဆင့် ၄: AWS Cloud ပေါ်တွင် အမှန်တကယ် တည်ဆောက်ပါ
```bash
terraform apply
# Prompt တွင် "yes" ဟု ရိုက်ထည့်ပါ။
```

---

## 🧹 Cost Optimization & Cleanup (ဘေလ်မတက်စေရန် ရှင်းလင်းပုံ)

ဤ Project တွင် ဆောက်လုပ်ခဲ့သော Resources အားလုံး (VPC, Subnet, IGW, Route Table, Security Group) သည် AWS Free Tier အောက်တွင် အခမဲ့ဖြစ်သော်လည်း အသုံးမလိုတော့ပါက တစ်ချက်တည်းဖြင့် ချက်ချင်း ဖျက်သိမ်းနိုင်ပါသည်:

```bash
terraform destroy
# Prompt တွင် "yes" ဟု ရိုက်ထည့်ပါ။
```
*(၅ စက္ကန့်အတွင်း အားလုံး သန့်ရှင်းစွာ ပျက်စီးသွားမည် ဖြစ်ပါသည်)*
