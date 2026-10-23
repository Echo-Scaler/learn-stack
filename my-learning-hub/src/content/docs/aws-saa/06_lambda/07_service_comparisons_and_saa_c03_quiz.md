---
title: "၇။ Service Comparisons & SAA-C03 Quiz"
description: "Lambda vs EC2/ECS/Batch နှိုင်းယှဉ်ချက်၊ RDS Proxy ပေါင်းစပ်မှု၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၇။ Service Comparisons & SAA-C03 Quiz

## Compute Services နှိုင်းယှဉ်ချက် (Lambda vs Others)

| ဝန်ဆောင်မှု | Execution Model | အမြင့်ဆုံးကြာချိန် | Pricing Model | စာမေးပွဲ သော့ချက်စကားလုံး (Keyword) |
| :--- | :--- | :--- | :--- | :--- |
| **AWS Lambda** | **Serverless (FaaS)** | **အများဆုံး ၁၅ မိနစ်** | Millisecond & Request အလိုက် | *"Short-lived, event-driven, microsecond billing"* |
| **Amazon ECS (Fargate)** | Container (CaaS) | **ကန့်သတ်ချက် မရှိပါ** | vCPU/RAM အလိုက် (စက္ကန့်အလိုက်) | *"Long-running Docker container, microservices"* |
| **Amazon EC2** | Virtual Machine (IaaS) | **ကန့်သတ်ချက် မရှိပါ** | နာရီ/စက္ကန့်အလိုက် | *"Full OS control, 24/7 steady state, custom kernels"* |
| **AWS Batch** | Batch Computing | **ကန့်သတ်ချက် မရှိပါ** | အရင်းခံ EC2/Spot/Fargate စရိတ်သာ | *"Non-interactive batch jobs, array jobs, parallel computing"* |

---

## 🏆 SAA-C03 Lambda ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **၁၅ မိနစ် ကန့်သတ်ချက်:** အကယ်၍ အလုပ်တစ်ခုသည် ၁၅ မိနစ်ထက် ပိုကြာပါက Lambda ဖြင့် မရပါ။ AWS Batch, ECS Task သို့မဟုတ် EC2 သို့ ပြောင်းရမည်။
2. **Database Connection Exhaustion (RDS Proxy Trap):**  
   Lambda သည် အလွန်မြန်စွာ ပွားများနိုင်သဖြင့် RDS PostgreSQL သို့ တိုက်ရိုက် ခေါ်ပါက Database Connections ပြည့်သွားတတ်သည်။ ထိုပြဿနာကို ဖြေရှင်းရန် **Amazon RDS Proxy** ကို ကြားခံထား၍ Connection Pooling ပြုလုပ်ရမည်။
3. **VPC Lambda Internet Outbound:**  
   VPC Lambda သည် Public Subnet တွင် ထားသော်လည်း အင်တာနက် တိုက်ရိုက် မထွက်နိုင်ပါ။ Private Subnet တွင် ထားပြီး **NAT Gateway** ဖြင့်သာ ထွက်ရမည်။
4. **Provisioned Concurrency:**  
   Cold Start ကို လုံးဝ မလိုချင်သောအခါ Provisioned Concurrency ကို ဖွင့်ရမည်။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
ဓာတ်ပုံမျှဝေသည့် ဝဘ်ဆိုဒ်တစ်ခုတွင် အသုံးပြုသူများက Amazon S3 Bucket သို့ ဓာတ်ပုံများ Upload တင်သည့်အခါ အလိုအလျောက် သေးငယ်သော Thumbnail ပုံများ ပြုလုပ်ပေးသည့် အလုပ်တစ်ခု လိုအပ်ပါသည်။ ပုံအသစ်တင်သည့် အကြိမ်တိုင်းတွင်သာ လုပ်ဆောင်ရမည်ဖြစ်ပြီး သမားရိုးကျ Server တစ်လုံးကို အမြဲတမ်း ၂၄ နာရီ ငှားရမ်းထားခြင်းဖြင့် ငွေကုန်ကြေးကျ မဖြစ်စေလိုပါ။ ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် အထိရောက်ဆုံး ဖြေရှင်းချက်မှာ အဘယ်နည်း?

- [ ] A) Amazon EC2 Instance တစ်ခုကို Auto Scaling Group ဖြင့် ၂၄ နာရီ run ထားပါ
- [ ] B) AWS Elastic Beanstalk Single Instance တစ်ခု တည်ဆောက်ပါ
- [x] C) Amazon S3 Event Notification ဖြင့် AWS Lambda Function တစ်ခုကို Trigger ပေးပြီး Thumbnail ပြုလုပ်စေပါ
- [ ] D) Amazon EKS Cluster တွင် Pods အမြဲ run ထားပါ

> **ရှင်းလင်းချက်:** **S3 Event Notification + AWS Lambda** သည် ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် စံပြ Event-driven Serverless Architecture ဖြစ်ပါသည်။ ပုံတင်ချိန် စက္ကန့်အနည်းငယ်သာ ပိုက်ဆံကျသင့်ပြီး အခြားအချိန်များတွင် ကုန်ကျစရိတ် သုည (Zero Cost) ဖြစ်ပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် AWS Lambda မှတစ်ဆင့် VPC အတွင်းရှိ Amazon Aurora MySQL Database သို့ ဒေတာများ ဆက်တိုက် ရေးသားနေပါသည်။ ရုတ်တရက် Flash Sale ဖြစ်ပေါ်ချိန်တွင် Lambda Functions ထောင်နှင့်ချီ ပွားများသွားပြီး Aurora Database သည် `Too many connections` error ဖြင့် Crash ဖြစ်သွားပါသည်။ အနည်းဆုံး ပြင်ဆင်မှုဖြင့် ဤပြဿနာကို မည်သို့ ဖြေရှင်းမည်နည်း?

- [ ] A) Aurora Instance Size ကို အကြီးဆုံး သို့ upgrade လုပ်ပါ
- [ ] B) Lambda Function Timeout ကို တိုးမြှင့်ပါ
- [x] C) Lambda နှင့် Aurora ကြားတွင် Amazon RDS Proxy ကို ချိတ်ဆက်တပ်ဆင်ပါ
- [ ] D) Lambda အစား EC2 သို့ ပြောင်းပါ

> **ရှင်းလင်းချက်:** **Amazon RDS Proxy** သည် Serverless Applications များအတွက် Database Connection Pooling ကို စီမံပေးသော Fully-managed Proxy ဖြစ်ပြီး Lambda Functions များစွာက Connection အလွန်အကျွံ ဖွင့်ခြင်းမှ ကာကွယ်ပေးပါသည်။

---

## 🔗 Official AWS Documentation Links

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [AWS Lambda Concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)
- [Configuring Lambda for VPC Access](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [Amazon RDS Proxy with Lambda](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)
