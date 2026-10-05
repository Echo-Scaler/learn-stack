---
title: "Phase 10 — Serverless Architecture (Lambda & API Gateway) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: Serverless Architecture သည် ဆာဗာ စီမံခန့်ခွဲမှု ဝန်ထုပ်ဝန်ပိုး (Operational Overhead) ကို သုညသို့ လျှော့ချပေးသည်။ AWS Lambda ၏ Cold Start"
---

## Phase 10 — Serverless Architecture (Lambda & API Gateway) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** Serverless Architecture သည် ဆာဗာ စီမံခန့်ခွဲမှု ဝန်ထုပ်ဝန်ပိုး (Operational Overhead) ကို သုညသို့ လျှော့ချပေးသည်။ AWS Lambda ၏ Cold Start ဖြေရှင်းနည်း၊ VPC ENI ချိတ်ဆက်မှု၊ Execution Role လုံခြုံရေး၊ API Gateway JWT Authorizer, Throttling Rate Limiting နှင့် Schema Validation များကို အဆင့်ဆင့် စနစ်တကျ တည်ဆောက်နိုင်ရမည်။

---

## ၁၀.၁ AWS Lambda Production Deep Dive (အဆင့်ဆင့် တည်ဆောက်ပုံ)

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION AWS LAMBDA ARCHITECTURE                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                               Amazon API Gateway                                  |
|                                       |                                           |
|                                       | (Passes Validated JWT & JSON Body)        |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | AWS Lambda Function                                                       |   |
|   |  - Execution Role : Least Privilege (Access only to specific DynamoDB ARN)|   |
|   |  - Concurrency    : Reserved Concurrency (100) / Provisioned Concurrency |   |
|   |  - Environment    : Encrypted via KMS (`DB_SECRET_ARN`, `STAGE=prod`)     |   |
|   |  - Ephemeral Disk : `/tmp` (512 MB to 10 GB customizable)                 |   |
|   +---------------------------------------------------------------------------+   |
|                   |                                           |                   |
|                   | (If Lambda inside VPC via Hyperplane ENI) | (Direct API Call) |
|                   v                                           v                   |
|       +-----------------------+                   +-----------------------+       |
|       | Private Subnet RDS    |                   | Amazon DynamoDB Table |       |
|       | (Port 3306 MySQL)     |                   | (Microsecond Storage) |       |
|       +-----------------------+                   +-----------------------+       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: Memory Size နှင့် CPU Power ဆက်နွှယ်မှု
Lambda တွင် CPU Cores ကို သီးခြား ရွေးချယ်၍ မရပါ။ **Memory Size (128 MB မှ 10,240 MB)** ကို သတ်မှတ်လိုက်သည်နှင့် CPU စွမ်းဆောင်ရည်သည် ၎င်းနှင့် အချိုးကျ အလိုအလျောက် တက်လာသည်:
- `128 MB` မှ `1,769 MB`: Single vCPU ၏ အစိတ်အပိုင်းသာ ရရှိသည်။
- `1,769 MB`: **Dedicated 1 Full vCPU Core** ကို အပြည့်အဝ စတင် ရရှိသည်။
- `10,240 MB (10 GB)`: Up to 6 vCPUs အထိ ရရှိသည်။
- *Production Tip:* Memory ကို ၂ ဆ မြှင့်လိုက်ခြင်းဖြင့် Function Runtime သည် ၂ ဆ ပိုမြန်သွားပါက စက္ကန့်ပိုင်း ပေးချေရသော ကုန်ကျစရိတ်သည် မူလနှင့် အတူတူပင် ဖြစ်သွားပြီး User Response Time ပိုမို မြန်ဆန်စေသည်။

### အဆင့် ၂: Cold Start ပြဿနာနှင့် ဖြေရှင်းနည်း (SnapStart & Provisioned Concurrency)
- **Cold Start အကြောင်းရင်း:** Function အကြာကြီး မခေါ်ဘဲ နေပြီးမှ ရုတ်တရက် ခေါ်ဆိုပါက Container အသစ် စတင် ဆောက်ရသဖြင့် မီလီစက္ကန့် ရာနှင့်ချီ ကြာမြင့်ခြင်း။
- **ဖြေရှင်းနည်း ၁ - Provisioned Concurrency:** သတ်မှတ်ထားသော Function အရေအတွက် (ဥပမာ ၅ ခု) ကို Memory ပေါ်တွင် အမြဲ နိုးထပြီးသား ဖြစ်နေစေရန် ကြိုတင် Standby ထားရှိခြင်း (Cold Start Zero ဖြစ်သွားသည်)။
- **ဖြေရှင်းနည်း ၂ - AWS Lambda SnapStart:** Java / Python / Node.js runtimes များတွင် Function ၏ Initialized Snapshot ကို ကြိုတင် ရိုက်ကူးထားပြီး ခေါ်ဆိုချိန်တွင် ချက်ချင်း ဖွင့်လှစ်ပေးခြင်း (အပို ကုန်ကျစရိတ် မရှိပါ)။

### အဆင့် ၃: Lambda inside VPC (Private RDS သို့ ချိတ်ဆက်နည်း)
Private Subnet ထဲရှိ RDS Database ကို Lambda ဖြင့် ချိတ်ဆက်လိုပါက:
1. Lambda Configuration ထဲတွင် **VPC ID, Private Subnets (အနည်းဆုံး AZ ၂ ခု) နှင့် Security Group (`sg-lambda`)** ကို ရွေးချယ်ပေးရမည်။
2. Lambda ၏ IAM Role တွင် **`AWSLambdaVPCAccessExecutionRole`** Managed Policy (ENI ဖန်တီးခွင့်နှင့် ဖျက်ခွင့်) ပါဝင်ရမည်။
3. AWS Nitro Hyperplane နည်းပညာကြောင့် Cold Start ဖြစ်ပေါ်ခြင်း မရှိဘဲ စက္ကန့်ပိုင်းအတွင်း Private RDS သို့ လုံခြုံစွာ ဆက်သွယ်နိုင်သည်။

---

## ၁၀.၂ Amazon API Gateway Production Setup (အဆင့်ဆင့်)

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION API GATEWAY ARCHITECTURE                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                               [Web / Mobile Client]                               |
|                                       |                                           |
|                                       | 1. Request with `Authorization: Bearer...`|
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | Amazon API Gateway                                                        |   |
|   |                                                                           |   |
|   |  Step 2: [Cognito / JWT Authorizer]                                       |   |
|   |          (စစ်ဆေးပြီး Token မမှန်ပါက 401 Unauthorized ဖြင့် ချက်ချင်း ပယ်သည်)   |   |
|   |                                                                           |   |
|   |  Step 3: [JSON Request Body Validation]                                   |   |
|   |          (Required fields မပါပါက 400 Bad Request ချက်ချင်း ပြန်သည်)          |   |
|   |                                                                           |   |
|   |  Step 4: [Throttling & Rate Limiting]                                     |   |
|   |          (တစ်စက္ကန့်လျှင် Req 10,000 ထက် ကျော်ပါက 429 Too Many Requests)    |   |
|   |                                                                           |   |
|   |  Step 5: [API Gateway Response Cache]                                     |   |
|   |          (Cache Hit ဖြစ်ပါက Backend သို့ မသွားဘဲ ချက်ချင်း ပြန်ပေးသည်)        |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|                                       | 6. Forward only Validated Requests        |
|                                       v                                           |
|                              [AWS Lambda Function]                                |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: Cognito JWT Authorizer (လုံခြုံရေး အဆင့်မြင့်တင်ခြင်း)
Lambda Function ကို မခေါ်ခင် API Gateway Level တွင် သုံးစွဲသူ၏ Identity Token (JWT) ကို အရင် စစ်ဆေးသည်:
- Token မှန်ကန်မှသာ Lambda ဆီသို့ Request ရောက်ရှိသည်။
- Token မှားယွင်းပါက API Gateway က **`401 Unauthorized`** အဖြစ် တိုက်ရိုက် ပြန်လွှတ်လိုက်သဖြင့် **Lambda Execution Fees လုံးဝ မကုန်ဘဲ စရိတ်နှင့် လုံခြုံရေး နှစ်ခုစလုံးကို ကာကွယ်ပေးသည်**။

### အဆင့် ၂: Request Body Validation (Schema Validation)
Client ဆီမှ လာသော JSON Body တွင် မဖြစ်မနေ ပါရမည့် Field များ (ဥပမာ `email`, `amount`) ပါမပါကို API Gateway JSON Schema Model ဖြင့် စစ်ဆေးသည်:
- Field မစုံလင်ပါက Lambda ဆီသို့ မပို့ဘဲ API Gateway က **`400 Bad Request`** ချက်ချင်း ပြန်ပေးသည်။

### အဆင့် ၃: Throttling & Usage Plans (DDoS နှင့် Abuse ကာကွယ်ခြင်း)
API ကို တစ်စက္ကန့်လျှင် Request ထောင်ပေါင်းများစွာ အလွဲသုံးစား ပို့ပြီး ဝန်ပိစေခြင်းမှ ကာကွယ်ရန်:
- **Rate Limit:** 10,000 requests per second (RPS)
- **Burst Limit:** 5,000 requests
- သတ်မှတ်ချက် ကျော်လွန်ပါက API Gateway က **`HTTP 429 (Too Many Requests)`** အလိုအလျောက် ပြန်လည် တုံ့ပြန်သည်။

### အဆင့် ၄: CORS (Cross-Origin Resource Sharing) ဖွင့်လှစ်ခြင်း
Browser (React, Vue, Angular) မှတစ်ဆင့် API ကို ခေါ်ဆိုရာတွင် CORS Error မတက်စေရန် API Gateway တွင် `Enable CORS` ကို ဖွင့်ပြီး:
- `Access-Control-Allow-Origin: '*'` (သို့မဟုတ် မိမိ Domain `https://example.com`)
- `Access-Control-Allow-Methods: 'GET,POST,PUT,DELETE,OPTIONS'`
- `Access-Control-Allow-Headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key'`

---

## ၁၀.၃ Serverless Production Failure Handling (DLQ & Retries)

Lambda ကို Asynchronous (ဥပမာ S3 Event သို့မဟုတ် EventBridge) ဖြင့် ခေါ်ဆိုချိန်တွင် Error တက်ပါက:
1. Lambda သည် **အလိုအလျောက် ၂ ကြိမ် ထပ်မံ ကြိုးစားသည် (2 Automatic Retries)**။
2. ၃ ကြိမ်စလုံး မအောင်မြင်ပါက အဆိုပါ ပျက်စီးသွားသော Message ကို စွန့်ပစ်မည့်အစား **Amazon SQS Dead-Letter Queue (DLQ)** သို့ ထည့်သွင်းပေးသည်။
3. DevOps အင်ဂျင်နီယာများသည် DLQ ထဲမှ Message များကို စစ်ဆေး၍ Bug ပြင်ပြီးနောက် ပြန်လည် Replay ပြုလုပ်နိုင်သည်။

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [11_Phase11_Application_Integration_and_Workflows.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/11_Phase11_Application_Integration_and_Workflows.md)
