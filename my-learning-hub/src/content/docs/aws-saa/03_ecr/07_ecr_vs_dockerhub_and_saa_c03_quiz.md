---
title: "၇။ ECR vs Docker Hub & SAA-C03 Quiz"
description: "ECR vs Docker Hub နှိုင်းယှဉ်ချက်၊ ECR vs ECS/EKS ကွာခြားချက်၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၇။ ECR vs Docker Hub & SAA-C03 Quiz

## Amazon ECR vs Docker Hub နှိုင်းယှဉ်ချက်

| အချက်အလက် | Amazon ECR | Docker Hub |
| :--- | :--- | :--- |
| **Cloud Integration** | **AWS Native** (IAM, CloudWatch, KMS, EventBridge နှင့် အပြည့်အဝ ပေါင်းစပ်ထားသည်) | သီးသန့် Third-Party ဝန်ဆောင်မှု |
| **လုံခြုံရေး စစ်ဆေးမှု** | **Amazon Inspector** ဖြင့် CVE များကို အချိန်နှင့်တစ်ပြေးညီ Continuous Scan လုပ်ပေးသည် | Docker Scout (Paid tier လိုအပ်သည်) |
| **Network Latency** | AWS Data Center အတွင်းရှိသဖြင့် ECS/EKS သို့ **အလွန်မြန်ဆန်သော Local Speed ရရှိသည်** | အင်တာနက်ကို ဖြတ်သန်းရသဖြင့် Latency ပိုကြာသည် |
| **Pull Rate Limits** | **AWS IAM Authenticated ဖြစ်ပါက Rate Limit မရှိသလောက်ဖြစ်သည်** | Anonymous users: 100 pulls / 6 hours ကန့်သတ်ချက်ရှိသည် |
| **Data Transfer စရိတ်** | တူညီသော AWS Region အတွင်း ECS/EKS ဆီသို့ Data Transfer အခမဲ့ဖြစ်သည် | အင်တာနက် Inbound/Outbound Bandwidth စရိတ် ရှိသည် |
| **အကောင်းဆုံး Use Case** | AWS ပေါ်တွင် run မည့် Production Applications, Enterprise Microservices | Open-source Public Images ရှာဖွေခြင်း၊ Local Development စမ်းသပ်ခြင်း |

---

## ECR vs ECS vs EKS (အသုံးအများဆုံး ဝေါဟာရ ၃ ခု ကွာခြားချက်)

- **Amazon ECR:** Docker Images များကို သိမ်းဆည်းထားရာ **"စတိုခန်း (Storage Registry)"** ဖြစ်သည်။ ၎င်းကိုယ်တိုင် Container ကို Run မပေးပါ။
- **Amazon ECS:** ထို ECR စတိုခန်းမှ Image များကို ဆွဲယူ၍ AWS ပေါ်တွင် ကွန်တိန်နာများ အဖြစ် မောင်းနှင်ပေးသည့် **"AWS-Native Orchestrator (မောင်းနှင်သူ)"** ဖြစ်သည်။
- **Amazon EKS:** ထို ECR မှ Image များကို စံသတ်မှတ်ချက် **Kubernetes Cluster** ဖြင့် စီမံမောင်းနှင်ပေးသည့် **"Enterprise K8s Engine"** ဖြစ်သည်။

---

## 🏆 SAA-C03 ECR ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **Private Subnet Pull Failure (S3 Endpoint Trap):**  
   Private Subnet ရှိ ECS Task က ECR မှ Image ဆွဲမရဖြစ်နေပါက Interface Endpoints (`ecr.api`, `ecr.dkr`) အပြင် **Amazon S3 Gateway Endpoint** ကိုပါ Route Table တွင် ချိတ်ဆက်ထားရမည် (အကြောင်းမှာ Image Layers များကို S3 တွင် သိမ်းထားသောကြောင့် ဖြစ်သည်)။
2. **ECS Execution Role:**  
   ECR မှ Image Pull ဆွဲရန်အတွက် ခွင့်ပြုချက်သည် ECS Task Role မဟုတ်ဘဲ **ECS Task Execution Role** တွင် ရှိရမည်။
3. **Cross-Account Pull:**  
   အခြား AWS Account တစ်ခုက မိမိ၏ ECR Image ကို ဆွဲယူခွင့်ပြုရန် **ECR Repository Policy (Resource-based Policy)** ကို သုံးရမည်။
4. **Token သက်တမ်း:**  
   `aws ecr get-login-password` ဖြင့် ရရှိသော Auth Token သည် **၁၂ နာရီ** သာ သက်တမ်းရှိသည်။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
ကုမ္ပဏီတစ်ခုသည် Application အသစ်များကို CI/CD Pipeline ဖြင့် Deploy ပြုလုပ်ရာတွင် Developer တစ်ဦးက Code မှားယွင်း Push တင်မိသဖြင့် ရှိပြီးသား Production Docker Image ပေါ်သို့ အမည်တူ Version ဖြင့် မတော်တဆ Overwrite အစားထိုး တင်မိသွားပါသည်။ နောင်တွင် မည်သူမျှ ရှိပြီးသား Image Tag များကို ပြင်ဆင်အစားထိုး၍ မရစေရန် မည်သည့် စနစ်ကို ဖွင့်ထားသင့်သနည်း?

- [ ] A) ECR Enhanced Scanning
- [x] B) ECR Image Tag Immutability
- [ ] C) ECR Lifecycle Policy
- [ ] D) KMS Customer Managed Key

> **ရှင်းလင်းချက်:** **Tag Immutability** ကို ဖွင့်ထားပါက ECR သည် ရှိပြီးသား Tag အမည်တူဖြင့် ထပ်မံ Push တင်ရန် ကြိုးစားမှုတိုင်းကို ငြင်းပယ်ပြီး Overwrite မခံရအောင် ကာကွယ်ပေးပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် အင်တာနက် အဝင်/အထွက် လုံးဝ မရှိသော (No Internet Gateway / No NAT Gateway) သီးသန့် Private Subnet အတွင်း၌ ECS Fargate Tasks များကို တည်ဆောက်ထားပါသည်။ သို့သော် Task စတင်ချိန်တွင် `CannotPullContainerError` ဖြစ်ပေါ်နေပါသည်။ ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် လုံခြုံမှုအရှိဆုံး နည်းလမ်းဖြင့် ဤပြဿနာကို မည်သို့ ဖြေရှင်းမည်နည်း?

- [ ] A) Public Subnet တွင် NAT Gateway အသစ်တစ်ခု တည်ဆောက်ပြီး Private Route Table ကို လမ်းကြောင်းပေးပါ
- [ ] B) ECS Task များထံသို့ Public IP များ Assign ပြုလုပ်ပေးပါ
- [x] C) ECR အတွက် Interface VPC Endpoints (`ecr.api`, `ecr.dkr`) နှင့် Amazon S3 အတွက် Gateway VPC Endpoint တို့ကို တည်ဆောက်ချိတ်ဆက်ပါ
- [ ] D) Docker Hub သို့ Image ပြောင်းရွှေ့ပါ

> **ရှင်းလင်းချက်:** NAT Gateway ဆောက်ခြင်းသည် လစဉ်ကြေး ကုန်ကျစရိတ် ကြီးမြင့်ပါသည်။ VPC အတွင်း၌ Private အတိုင်း ဆက်လက်ထားရှိပြီး ECR Interface Endpoints နှင့် အခမဲ့ဖြစ်သော S3 Gateway Endpoint တို့ကို ချိတ်ဆက်ခြင်းသည် အလုံခြုံဆုံးနှင့် အသက်သာဆုံး AWS Best Practice ဖြစ်ပါသည်။

---

### မေးခွန်း (၃)
အဖွဲ့အစည်းတစ်ခုသည် Amazon ECR တွင် Microservices ရာပေါင်းများစွာအတွက် Docker Images များကို သိမ်းဆည်းထားသည်။ စစ်ဆေးကြည့်ရာ CI/CD မှ တင်ထားသော Version Tag မပါတော့သည့် Untagged (Dangling) Images များစွာကြောင့် လစဉ် ECR Storage ကုန်ကျစရိတ် အလွန်များပြားနေပါသည်။ ဤအဟောင်းများကို အလိုအလျောက် ပုံမှန် ရှင်းလင်းပေးရန် မည်သည့် Feature ကို သုံးရမည်နည်း?

- [ ] A) AWS Lambda Cron Job
- [x] B) ECR Lifecycle Policy
- [ ] C) CloudWatch Synthetics Canary
- [ ] D) Amazon S3 Glacier Archiving

> **ရှင်းလင်းချက်:** **ECR Lifecycle Policy** တွင် Untagged ဖြစ်နေသော Images များကို သတ်မှတ်ရက် (ဥပမာ- ၁၄ ရက်) ပြည့်ပါက အလိုအလျောက် သက်တမ်းကုန်ဖျက်ပစ်ရန် (`expire`) စည်းမျဉ်း သတ်မှတ်ပေးနိုင်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [Amazon ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [Amazon ECR Image Scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [Amazon ECR Lifecycle Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html)
- [Amazon ECR VPC Endpoints (AWS PrivateLink)](https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html)
