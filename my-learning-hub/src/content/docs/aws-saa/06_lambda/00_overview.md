---
title: "Feature 6: AWS Lambda — Feature Titles & Usage Overview"
description: "AWS Lambda ကို Serverless အခြေခံမှ Invocation Models (Sync/Async/Poll), Cold Starts, Concurrency, VPC Networking နှင့် SAA-C03 စာမေးပွဲအထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# Feature 6: AWS Lambda ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Serverless Architecture လမ်းညွှန်

AWS Lambda သည် Server တစ်လုံးမျှ တည်ဆောက်စရာမလိုဘဲ (Serverless) Event တစ်ခု ဖြစ်ပေါ်လာချိန်တွင်သာ Code ကို စက္ကန့်ပိုင်းအတွင်း လျှပ်တစ်ပြက် Run ပေးပြီး သုံးစွဲသည့် Millisecond အလိုက်သာ ကျသင့်စေသော AWS ၏ အထင်ကရ Function as a Service (FaaS) ဖြစ်ပါသည်။ အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ လက်တွေ့ အသုံးချပုံ (Usages) များကို အစဉ်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ Lambda ဆိုတာဘာလဲ & Serverless အခြေခံ**](/aws-saa/06_lambda/01_what_is_lambda_and_serverless_basics/) | FaaS, Serverless Mindset, Function, Handler, Memory & Timeout (15m) | Server ငှားစရာမလိုဘဲ Event လာမှ run သော စနစ်နှင့် EC2 vs Lambda ရွေးချယ်ပုံ |
| **02** | [**၂။ Invocation Models & Event Sources**](/aws-saa/06_lambda/02_invocation_models_and_event_sources/) | Synchronous (API Gateway), Asynchronous (S3, SNS), Event-Source Mapping (SQS, DynamoDB) | Request ခေါ်ဆိုပုံ ၃ မျိုး၊ အလိုအလျောက် Retry လုပ်ဆောင်ပုံနှင့် Dead Letter Queue (DLQ) |
| **03** | [**၃။ Execution Lifecycle, Cold Starts & Concurrency**](/aws-saa/06_lambda/03_execution_lifecycle_cold_starts_concurrency/) | Cold Start vs Warm Start, Reserved Concurrency, Provisioned Concurrency, Throttling (429) | ပထမဆုံး စတင်ချိန်တွင် ကြန့်ကြာမှု မရှိစေရန် Provisioned Concurrency သုံးခြင်းနှင့် Throttling ကာကွယ်နည်း |
| **04** | [**၄။ Hands-on Lab: Serverless Deployment**](/aws-saa/06_lambda/04_hands_on_lab_serverless_deployment/) | Python/Node Lambda, API Gateway Trigger, S3 File Processing, EventBridge Cron & Cleanup | Serverless API ဖန်တီးခြင်း၊ ပုံတင်လိုက်သည်နှင့် အလိုအလျောက် Resize လုပ်ခြင်းနှင့် ရှင်းလင်းခြင်း |
| **05** | [**၅။ VPC Networking & Security**](/aws-saa/06_lambda/05_vpc_networking_and_security/) | Hyperplane ENI, Private Subnet RDS Access, Execution Roles, Secrets Manager | Private Subnet ရှိ RDS Database သို့ Lambda မှ လုံခြုံစွာ ချိတ်ဆက်နည်းနှင့် Least Privilege IAM |
| **06** | [**၆။ Monitoring, X-Ray & Troubleshooting**](/aws-saa/06_lambda/06_monitoring_xray_and_troubleshooting/) | CloudWatch Logs/Metrics, AWS X-Ray Distributed Tracing, Timeouts, OOM Errors | Microservices ကြား Latency နှောင့်နှေးမှုများကို X-Ray ဖြင့် ခြေရာခံခြင်းနှင့် Error ဖြေရှင်းနည်း Runbook |
| **07** | [**၇။ Service Comparisons & SAA-C03 Quiz**](/aws-saa/06_lambda/07_service_comparisons_and_saa_c03_quiz/) | Lambda vs EC2 / ECS / Batch, SAA-C03 Exam Traps & Quiz | စာမေးပွဲတွင် အမေးများသော Serverless မေးခွန်းများနှင့် အသေးစိတ် ရှင်းလင်းချက်ပါဝင်သည့် အလေ့အကျင့် စာမေးပွဲ |
