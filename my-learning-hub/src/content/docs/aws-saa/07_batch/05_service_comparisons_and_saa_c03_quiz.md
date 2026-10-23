---
title: "၅။ Service Comparisons & SAA-C03 Quiz"
description: "AWS Batch vs Lambda vs ECS Scheduled Tasks vs Step Functions၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၅။ Service Comparisons & SAA-C03 Quiz

## Batch Computing Services နှိုင်းယှဉ်ချက်

| ဝန်ဆောင်မှု | သင့်တော်သော ကြာချိန် | Scaling Model | စာမေးပွဲ သော့ချက်စကားလုံး (Keyword) |
| :--- | :--- | :--- | :--- |
| **AWS Batch** | **နာရီပေါင်းများစွာ (No Limit)** | Docker Containers (EC2 Spot / Fargate) ကို အလုပ်အရေအတွက်အလိုက် Auto-scale လုပ်ပေးသည် | *"Batch jobs, parallel computing, array jobs, Spot cost optimization"* |
| **AWS Lambda** | **၁၅ မိနစ် အောက်သာ** | Event လာသည်နှင့် မီလီစက္ကန့်ပိုင်းအတွင်း လျှပ်တစ်ပြက် auto-scale | *"Short-lived, serverless, event-driven"* |
| **ECS Scheduled Task** | နာရီအနည်းငယ် | Cron ဖြင့် သတ်မှတ်ထားသော အချိန်တွင် ECS Task အသစ် run သည် | *"Simple periodic cron job, container task"* |
| **AWS Step Functions** | **၁ နှစ်အထိ** | ဝန်ဆောင်မှုပေါင်းများစွာ၏ အဆင့်ဆင့် အလုပ်စီးဆင်းမှုကို ညှိနှိုင်းစီမံသည် (Orchestration) | *"State machine, workflow orchestration, visual diagram"* |

---

## 🏆 SAA-C03 AWS Batch ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **၁၅ မိနစ်ထက် ကျော်လွန်သော Parallel Workloads:**  
   အကယ်၍ စာမေးပွဲ မေးခွန်းတွင် "အလုပ်တစ်ခုသည် နာရီပေါင်းများစွာ ကြာနိုင်ပြီး၊ အလုပ်ပေါင်း ထောင်ချီကို တစ်ပြိုင်နက် Parallel တွက်ချက်ရမည်၊ စရိတ် အသက်သာဆုံး ဖြစ်ရမည်" ဟု ပါလာပါက **အဖြေမှန်သည် AWS Batch with Spot Instances** ဖြစ်ပါသည်။ (Lambda သည် ၁၅ မိနစ်ထက် ကျော်၍ မရပါ)။
2. **Array Jobs:**  
   ဖိုင်ပေါင်း ထောင်ချီကို အလုပ်ခွဲထုတ်ရာတွင် Job များစွာ တင်စရာမလိုဘဲ **Array Job (up to 10,000 sub-jobs)** ကို သုံးရမည်။
3. **Multi-Step Pipelines:**  
   အလုပ်တစ်ခု ပြီးမှ နောက်တစ်ခု ဆက်လုပ်စေရန် **Job Dependencies (`dependsOn`)** သို့မဟုတ် **AWS Step Functions** ကို ပေါင်းစပ်အသုံးပြုရမည်။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
သုတေသန ဓာတ်ခွဲခန်းတစ်ခုသည် နေ့စဉ် ညသန်းခေါင်အချိန်တွင် ၆ နာရီကြာမြင့်သော ရာသီဥတု ခန့်မှန်းတွက်ချက်မှု အလုပ်တစ်ခုကို Run လေ့ရှိပါသည်။ ဤအလုပ်သည် CPU အမြောက်အမြား လိုအပ်ပြီး Server ပျက်စီးသွားပါက အလိုအလျောက် ပြန်လည် စတင်နိုင်သော သဘောသဘာဝ (Fault-tolerant) ရှိပါသည်။ အရင်းခံ ဆာဗာများကို ကိုယ်တိုင် စီမံခန့်ခွဲစရာ မလိုဘဲ အနိမ့်ဆုံး ကုန်ကျစရိတ်ဖြင့် မည်သည့် AWS ဝန်ဆောင်မှုကို ရွေးချယ်သင့်သနည်း?

- [ ] A) AWS Lambda Functions များကို တစ်ခုပြီးတစ်ခု အဆက်မပြတ် ခေါ်ယူပါ
- [ ] B) Amazon EC2 Reserved Instances များကို တစ်နှစ်စာ ကြိုတင် ဝယ်ယူပါ
- [x] C) AWS Batch တွင် Managed Compute Environment ကို Spot Instances ဖြင့် တည်ဆောက်ပြီး မောင်းနှင်ပါ
- [ ] D) Amazon EKS Cluster တွင် On-Demand Node Groups ကို ၂၄ နာရီ run ထားပါ

> **ရှင်းလင်းချက်:** အလုပ်သည် ၆ နာရီ ကြာမြင့်သဖြင့် ၁၅ မိနစ်သာ ခံသော Lambda (A) ကို သုံး၍ မရပါ။ Fault-tolerant ဖြစ်သဖြင့် ၉၀% အထိ စရိတ်ချွေတာနိုင်သော **AWS Batch with Managed Spot Compute Environment** သည် အကောင်းဆုံးနှင့် အသက်သာဆုံး ဖြေရှင်းချက် ဖြစ်ပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် AWS Batch တွင် Submit လုပ်လိုက်သော အလုပ်များအားလုံးသည် `RUNNABLE` အဆင့်တွင် နာရီပေါင်းများစွာ ပိတ်မိနေပြီး မည်သည့်အခါမျှ စတင်မလာသည်ကို တွေ့ရှိရသည်။ မည်သည့် အကြောင်းအရင်းကြောင့် ဤသို့ ဖြစ်နိုင်သနည်း?

- [ ] A) Job Definition ၏ Timeout မသတ်မှတ်ရသေးခြင်း
- [ ] B) S3 Bucket သို့ ဆက်သွယ်ရန် IAM Role မရှိခြင်း
- [x] C) Compute Environment ၏ `maxvCpus` သည် `0` ဖြစ်နေခြင်း သို့မဟုတ် Private Subnet တွင် Internet ထွက်မရဘဲ ECR/ECS သို့ မဆက်သွယ်နိုင်ခြင်း
- [ ] D) Docker Image Size သည် 1GB ထက် ကြီးမားနေခြင်း

> **ရှင်းလင်းချက်:** Job သည် `RUNNABLE` တွင် ပိတ်မိနေခြင်း၏ အဓိက အကြောင်းအရင်းမှာ Compute Environment တွင် ဆာဗာထုတ်လုပ်ပေးရန် vCPU ကန့်သတ်ချက် ပြည့်နေခြင်း (`maxvCpus=0`) သို့မဟုတ် VPC Network မှတစ်ဆင့် AWS ECR/ECS Control Plane သို့ ချိတ်ဆက်မရခြင်းတို့ကြောင့် ဖြစ်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [AWS Batch User Guide](https://docs.aws.amazon.com/batch/latest/userguide/)
- [AWS Batch Compute Environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html)
- [AWS Batch Job Queues](https://docs.aws.amazon.com/batch/latest/userguide/job_queues.html)
- [Array Jobs in AWS Batch](https://docs.aws.amazon.com/batch/latest/userguide/array_jobs.html)
