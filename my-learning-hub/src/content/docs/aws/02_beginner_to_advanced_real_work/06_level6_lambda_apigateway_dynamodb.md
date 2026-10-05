---
title: "၀၆။ Level 6 — Serverless & NoSQL (Lambda, API Gateway, DynamoDB)"
description: "AWS Lambda သည် Server များကို Provision ပြုလုပ်ခြင်း သို့မဟုတ် စီမံခန့်ခွဲခြင်း လုံးဝ မလိုဘဲ မိမိတို့၏ Code Function (Node.js, Python, PHP via Custom Runtime, G"
---

## ၀၆။ Level 6 — Serverless & NoSQL (Lambda, API Gateway, DynamoDB)

---

## ၆.၁ AWS Lambda Deep Dive

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
AWS Lambda သည် Server များကို Provision ပြုလုပ်ခြင်း သို့မဟုတ် စီမံခန့်ခွဲခြင်း လုံးဝ မလိုဘဲ မိမိတို့၏ Code Function (Node.js, Python, PHP via Custom Runtime, Go, Java) ကိုသာ ရေးသား Upload တင်ထားပြီး Request သို့မဟုတ် Event တစ်ခုခု ဖြစ်ပေါ်လာမှသာ Run သော **Event-driven Serverless Compute Service** ဖြစ်သည်။

### ၂. ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ပြဿနာ:** User များ Profile ပုံ တင်သည့်အခါ Thumbnail (150x150) သို့ Resize လုပ်သော Batch Process တစ်ခု ရှိသည်။ ထိုလုပ်ငန်းအတွက် EC2 Server တစ်လုံးကို ၂၄ နာရီပတ်လုံး ဖွင့်ထားပါက တစ်နေ့လျှင် User ၁၀ ယောက်သာ ပုံတင်သော်လည်း တစ်လလုံးအတွက် EC2 ကုန်ကျစရိတ် ပေးနေရမည်။
- **Lambda ဖြင့် ဖြေရှင်းချက်:** S3 ထဲသို့ ပုံရောက်လာမှသာ (`s3:ObjectCreated:*` Event) Lambda က စက္ကန့်ပိုင်းအတွင်း နိုးထလာပြီး ပုံကို Resize လုပ်ပေးသည်။ တစ်လလျှင် လုပ်ဆောင်သည့် အကြိမ်အရေအတွက်နှင့် ကြာချိန် (Milliseconds) အတွက်သာ ဒေါ်လာ ဆင့်အနည်းငယ် ပေးရသဖြင့် စရိတ် ၉၅% သက်သာသွားသည်။

### ၃. Architecture Flow: Serverless REST API
```
[ Mobile App / React Frontend ]
               |
               v (HTTPS GET /users)
     [ Amazon API Gateway ]
  - JWT Cognito Authorizer (Login စစ်ဆေးခြင်း)
  - Rate Limiting / WAF Shield
               |
               v (Event Payload JSON)
     [ AWS Lambda Function ]
  - Execution Role: DynamoDB သို့ ဖတ်ခွင့်
  - Logic: User Profile ရှာဖွေခြင်း
               |
               v (Boto3 / AWS SDK Query)
     [ Amazon DynamoDB (NoSQL) ]
```

### ၄. မဖြစ်မနေသိရမည့် အဓိက သဘောတရားများ:
- **Cold Start:** Function သည် အချိန်အတန်ကြာ မသုံးဘဲ ငြိမ်နေပြီးမှ ပထမဆုံး Request ရောက်လာသည့်အခါ AWS က MicroVM အသစ် တည်ဆောက်ရသဖြင့် ကနဦး Response Time ၅၀၀ms မှ ၁ စက္ကန့်ခန့် ကြာမြင့်ခြင်း။
  - *ဖြေရှင်းနည်း (ဂျပန် 現場 စံနှုန်း):* အလွန်အရေးကြီးသော API များတွင် **Provisioned Concurrency** (ကြိုတင် Warm လုပ်ထားသော Instance) ကို ဖွင့်ထားခြင်း သို့မဟုတ် Python/Node.js ကဲ့သို့ Lightweight Runtime များကို ရွေးချယ်ခြင်း။
- **Timeout & Limits:** အများဆုံး Run နိုင်သော ကြာချိန်မှာ **၁၅ မိနစ် (900s)** ဖြစ်သည်။ Memory ကို 128MB မှ 10,240MB (10GB) အထိ သတ်မှတ်နိုင်ပြီး Memory တိုးပေးလေ vCPU စွမ်းအား အချိုးကျ ပိုရလေ ဖြစ်သည်။
- **Lambda Layers:** Shared Library များကို Function တိုင်းတွင် ထပ်ခါထပ်ခါ မထည့်ရစေရန် သီးခြား ZIP Package အဖြစ် ဗဟိုတွင် ထားရှိပြီး Function အများအပြားက မျှဝေသုံးစွဲနိုင်သော စနစ်။

---

## ၆.၂ Amazon API Gateway

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
မည်သည့် Scale တွင်မဆို Developer များ အနေဖြင့် API များကို လွယ်ကူစွာ ဖန်တီး၊ ထိန်းသိမ်း၊ စောင့်ကြည့်၊ လုံခြုံအောင် ပြုလုပ်နိုင်သော Fully Managed Reverse Proxy Service ဖြစ်သည်။

### ၂. HTTP API vs REST API ရွေးချယ်မှု လမ်းညွှန်:
| Feature | HTTP API | REST API |
| :--- | :--- | :--- |
| **စရိတ် (Pricing)** | အလွန်သက်သာသည် ($1.00 per million requests) | စံနှုန်း ($3.50 per million requests) |
| **Latency** | အလွန်မြန်ဆန်သည် (~10ms ပိုမြန်) | Standard Features များကြောင့် အနည်းငယ် ပိုကြာသည် |
| **Authorizer** | Native JWT OIDC / Cognito Authorizers | Lambda Authorizer, Cognito, IAM, API Keys |
| **WAF Integration** | မကြာသေးမီက ထောက်ပံ့ပေးထားသည် | အစကတည်းက AWS WAF နှင့် တိုက်ရိုက်တွဲနိုင်သည် |
| **အသုံးပြုသင့်သည့် နေရာ** | Modern Mobile/Web Serverless APIs | Enterprise Legacy API, Usage Plans & API Keys လိုအပ်သည့်နေရာ |

---

## ၆.၃ Amazon DynamoDB (NoSQL Data Modeling)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
မည်သည့် Scale တွင်မဆို Single-Digit Millisecond (10ms အောက်) Latency ဖြင့် အလုပ်လုပ်နိုင်သော Fully Managed NoSQL Key-Value & Document Database ဖြစ်သည်။

### ၂. Relational DB နှင့် မတူညီသော စဉ်းစားပုံ (NoSQL Single-Table Design):
- **Partition Key (PK - Hash Key):** Data များကို မည်သည့် Physical Storage Partition တွင် သွားရောက်သိမ်းဆည်းရမည်ကို ဆုံးဖြတ်ပေးသော အဓိက Key (ဥပမာ- `USER#1001`, `ORDER#9001`)။
- **Sort Key (SK - Range Key):** တူညီသော Partition Key အတွင်း Data များကို အစီအစဉ်တကျ စီပေးသော Key (ဥပမာ- `PROFILE`, `ORDER#2026-09-21`)။
- **GSI (Global Secondary Index):** မူလ PK မဟုတ်သော အခြား Attribute (ဥပမာ- User Email) ဖြင့် Query ရှာဖွေလိုသည့်အခါ အသစ် တည်ဆောက်ရသော Secondary Index ဖြစ်သည်။

### ၃. DynamoDB Table Design ဥပမာ:
```
+--------------------+-----------------------+---------------------+-------------------+
| Partition Key (PK) | Sort Key (SK)         | Data Attributes     | GSI1-PK (Email)   |
+--------------------+-----------------------+---------------------+-------------------+
| USER#u101          | METADATA              | Name: Tanaka, Age:30| tanaka@japan.jp   |
| USER#u101          | ORDER#20260901_001    | Total: 15,000 JPY   |                   |
| USER#u101          | ORDER#20260915_002    | Total: 4,500 JPY    |                   |
+--------------------+-----------------------+---------------------+-------------------+
```
- Query တစ်ချက်တည်းဖြင့် User ၏ Profile ကော ၎င်း၏ Orders အားလုံးကိုပါ JOIN ဆွဲစရာမလိုဘဲ 5ms အတွင်း ရယူနိုင်သည်။

---

## ၆.၄ Hands-on Exercise: Serverless API တည်ဆောက်ခြင်း (Lambda + DynamoDB)

### အဆင့် (၁) — DynamoDB Table ဖန်တီးခြင်း
```bash
aws dynamodb create-table \
  --table-name UsersTable \
  --attribute-definitions \
      AttributeName=UserId,AttributeType=S \
  --key-schema \
      AttributeName=UserId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### အဆင့် (၂) — Lambda Function Code ရေးသားခြင်း (`index.py`)
```python
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UsersTable')

def lambda_handler(event, context):
    user_id = event['queryStringParameters']['id']
    response = table.get_item(Key={'UserId': user_id})
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(response.get('Item', {'error': 'User not found'}))
    }
```

---
*နောက်အခန်းသို့ သွားရန်:* [07_Level7_SQS_SNS_EventBridge.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/07_Level7_SQS_SNS_EventBridge.md)
