---
title: "Amazon API Gateway — Complete Master Architectural Guide"
description: "Amazon API Gateway — Managed service to create, publish, and secure APIs at scale ကို မြန်မာလို အခြေခံမှ စတင်၍ REST vs HTTP vs WebSocket, Stages, Throttling နှင့် SAA-C03 Guide"
---

# Amazon API Gateway
### Managed Service to Create, Publish, Maintain, Monitor, and Secure APIs at Any Scale

Amazon API Gateway သည် Serverless Applications၊ မိုဘိုင်းအက်ပ်များနှင့် Microservices များအတွက် ရာထောင်ချီသော API Calls များကို လုံခြုံစွာ စီမံခန့်ခွဲ၊ ထိန်းချုပ်နှင့် စောင့်ကြည့်ပေးနိုင်သော **AWS Fully Managed API Management Service** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

Backend Architecture တွင် AWS Lambda Functions သို့မဟုတ် EC2 Containers များစွာ ရှိနေသောအခါ သုံးစွဲသူ Client များအား ထို Services များနှင့် တိုက်ရိုက် ချိတ်ဆက်စေပါက Authentication၊ Rate Limiting၊ CORS၊ Versioning နှင့် SSL Certificate များကို Backend Service တစ်ခုစီတိုင်းတွင် ထပ်ခါတလဲလဲ ကိုယ်တိုင် ရေးသားနေရမည် ဖြစ်သည်။

**Amazon API Gateway ၏ အဓိက ရည်ရွယ်ချက်:**  
Application တစ်ခုလုံးအတွက် **ဗဟို တံခါးပေါက် (Unified Front Door)** အဖြစ် ရပ်တည်ပေးပြီး၊ Client ထံမှ Request များကို လက်ခံစစ်ဆေးကာ နောက်ကွယ်ရှိ AWS Lambda၊ DynamoDB၊ Step Functions သို့မဟုတ် VPC အတွင်းရှိ Private Server များဆီသို့ စနစ်တကျ ခွဲဝေပို့ဆောင်ပေးရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **HTTP API** | Lightweight REST | စရိတ်စက အသက်သာဆုံး (REST ထက် ၇၁% သက်သာ) နှင့် Latency အနည်းဆုံးဖြစ်သော ခေတ်မီ REST API ဖြစ်သည်။ |
| **REST API** | Full-Featured API | Request Transformation (VTL), API Keys, Usage Plans, Request Caching နှင့် WAF အပြည့်အစုံ ပါဝင်သော Enterprise API ဖြစ်သည်။ |
| **WebSocket API** | Two-Way Realtime | Server နှင့် Client အကြား အပြန်အလှန် (Bidirectional) အချိန်နှင့်တပြေးညီ ချိတ်ဆက်ထားသော Real-time Chat/Trading API ဖြစ်သည်။ |
| **Endpoint Types** | Deployment Scope | **Edge-Optimized** (CloudFront ဖြင့် ကမ္ဘာအနှံ့ အမြန်ဆုံး ဖြန့်သည်), **Regional** (Single Region အတွက် သုံးသည်), **Private** (VPC အတွင်းသာ သီးသန့် အလုပ်လုပ်သည်)။ |
| **Stages & Variables** | Environment Isolation | `dev`, `staging`, `prod` စသည့် ပတ်ဝန်းကျင်များကို သီးခြား ခွဲထုတ်ပြီး Stage Variables ဖြင့် သက်ဆိုင်ရာ Lambda သို့ ချိတ်ဆက်ပေးသည်။ |
| **Authorizers** | Authentication Layer | **Cognito User Pools** (OAuth/JWT) သို့မဟုတ် **Lambda Request Authorizer** ဖြင့် API ခေါ်ယူခွင့်ကို စစ်ဆေးသည်။ |
| **Usage Plans & API Keys** | Rate Limiting & Throttling | မတူညီသော ဖောက်သည်အဆင့်များ (Basic, Pro, Enterprise) အလိုက် တစ်စက္ကန့်လျှင် Request မည်မျှခေါ်နိုင်သည်ကို ကန့်သတ်ခြင်း။ |

---

## 3. Architecture (Diagram & Serverless Integration Flow)

API Gateway ၏ Serverless Microservices Request Flow:

```
                            [ Web & Mobile Clients ]
                                        │
                                        ▼ (HTTPS: /v1/orders)
┌────────────────────────────────────────────────────────────────────────┐
│ Amazon API Gateway (Front Door)                                        │
│                                                                        │
│  [ AWS WAF (DDoS / SQLi Protection) ]                                  │
│                   │                                                    │
│  [ Cognito / Lambda Authorizer ] ──► (Verify JWT Bearer Token)         │
│                   │                                                    │
│  [ Rate Limiting & Throttling ]  ──► (Check Quota & Token Bucket)      │
│                   │                                                    │
│  [ API Gateway Cache ] ─────────────► (Return Cached Response if hit)  │
│                   │                                                    │
└───────────────────┼────────────────────────────────────────────────────┘
                    │ (AWS Service Proxy / Direct Integration)
                    ├──────────────────────────┬─────────────────────────┐
                    ▼                          ▼                         ▼
         [ AWS Lambda Function ]     [ Amazon DynamoDB ]      [ VPC Private Link ]
         (Business Logic Core)       (Direct CRUD Proxy)      (Internal ALB / Microservice)
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Request Intake & Authentication:** Client ထံမှ Request ရောက်လာသည်နှင့် API Gateway သည် Authorization Header (JWT Token) ကို Cognito သို့မဟုတ် Lambda Authorizer ဖြင့် စစ်ဆေးသည်။ အခွင့်မရှိပါက Backend သို့ မရောက်စေဘဲ 401 Unauthorized ပြန်ပို့သည်။
2. **Throttling & Quotas:** Token Bucket Algorithm ဖြင့် Account-level (Default: 10,000 RPS) သို့မဟုတ် Client-level ကန့်သတ်ချက်များကို စစ်ဆေးသည်။ သတ်မှတ်ပမာဏ ကျော်လွန်ပါက **429 Too Many Requests** အလိုအလျောက် ပြန်ပေးသည်။
3. **Backend Execution & Caching:** Caching ဖွင့်ထားပါက တူညီသော Query Response ကို Cache Memory မှ Sub-millisecond ဖြင့် ပြန်ပေးသည်။ Cache မရှိပါက Lambda Function ကို Invoke လုပ်ကာ ရလာသော JSON response ကို Client ထံ ပြန်လည် ပေးပို့သည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Serverless Web Application Backends:** React/Vue Frontend နှင့် AWS Lambda Functions များကို ချိတ်ဆက်သော RESTful APIs။
- **Real-Time Applications:** WebSocket API ဖြင့် Chat Application များ၊ Live Sport Scores နှင့် စတော့ရှယ်ယာ စျေးကွက်ပြသမှုများ။
- **Monetized SaaS Developer Platforms:** ပြင်ပ Developer များအား API Keys ထုတ်ပေးပြီး လစဉ် API Calls အရေအတွက်အလိုက် ငွေကောက်ခံသော SaaS Platforms များ။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Fully Serverless (ဆာဗာ စီမံခန့်ခွဲရန် မလိုဘဲ အလိုအလျောက် Scale ဖြစ်သည်)။
- Built-in Throttling နှင့် Rate Limiting ပါဝင်သဖြင့် Backend Servers များ Crash မဖြစ်အောင် ကာကွယ်ပေးသည်။
- Canary Release Deployments (API အသစ်သို့ Traffic ၅% စမ်းသပ် လွှဲပြောင်းနိုင်သည်)။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **Maximum Request Timeout:** API Gateway ၏ အမြင့်ဆုံး Request Timeout မှာ **29 seconds** သာ ဖြစ်သည်။ (၂၉ စက္ကန့်ထက် ကြာသော Long-running tasks များအတွက် SQS သို့မဟုတ် Step Functions ဖြင့် Asynchronous ပြုလုပ်ရမည်)။
- **Payload Size Limit:** Request/Response Payload အရွယ်အစားမှာ အများဆုံး **10 MB** သာ ဖြစ်သည်။

---

## 7. Comparison: HTTP API vs REST API

| Feature | HTTP API | REST API |
| :--- | :--- | :--- |
| **ကုန်ကျစရိတ်** | **၇၁% ပိုမိုသက်သာသည်** ($1.00 per million) | Standard ($3.50 per million) |
| **Latency** | **အလွန်နည်းပါးသည်** (Low Latency) | Feature များသဖြင့် အနည်းငယ် ပိုကြာသည် |
| **API Caching** | မရပါ | **ရရှိသည် (Built-in Response Cache)** |
| **Usage Plans & API Keys**| မရပါ | **ရရှိသည်** |
| **Request Transformation** | မရပါ | **ရရှိသည် (VTL Mapping Templates)** |
| **WAF Integration** | ရရှိသည် | ရရှိသည် |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: HTTP API အသစ် ဆောက်လုပ်ခြင်း
```bash
aws apigatewayv2 create-api \
    --name "ServerlessUserApi" \
    --protocol-type HTTP \
    --target "arn:aws:lambda:ap-southeast-1:123456789012:function:GetUserProfile"
```

### Step 2: Auto-Deploying Stage ဖန်တီးခြင်း
```bash
aws apigatewayv2 create-stage \
    --api-id "api-id-12345" \
    --stage-name "v1" \
    --auto-deploy
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** AWS WAF Integration, Mutual TLS (mTLS), Resource Policies, VPC Endpoints (Private APIs), IAM Authentication.
- **Monitoring:** CloudWatch Metrics (`Count`, `4XXError`, `5XXError`, `Latency`, `IntegrationLatency`), CloudWatch Access Logs, AWS X-Ray Distributed Tracing.
- **Cost:** API Calls အရေအတွက်အလိုက် ပေးချေရသည် (HTTP API: $1.00/million, REST API: $3.50/million) + Data Transfer Out + Optional Cache Memory per hour။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **29-Second Timeout Limit:** API Gateway သည် ၂၉ စက္ကန့်ကျော်ကြာသော Request များကို 504 Gateway Timeout ပေးသည်။ ဖြေရှင်းနည်းမှာ Background Tasks များအတွက် **API Gateway ➔ SQS Queue ➔ Lambda** ပုံစံဖြင့် Asynchronous ပြောင်းလဲရန် ဖြစ်သည်။
> 2. **HTTP API vs REST API:** ရိုးရှင်းသော Serverless Lambda Backend အတွက် အသက်သာဆုံးနှင့် အမြန်ဆုံး လိုအပ်ပါက အမြဲတမ်း **HTTP API** ကို ရွေးချယ်ပါ။ API Keys, Usage Plans သို့မဟုတ် VTL Data Transformation လိုအပ်ပါက **REST API** ကို ရွေးချယ်ပါ။
> 3. **Private API:** VPC အတွင်းမှသာ ခေါ်ယူနိုင်သော Private API အတွက် **Interface VPC Endpoint (AWS PrivateLink)** ကို အသုံးပြုရပါမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
ကုမ္ပဏီတစ်ခုသည် SaaS ဝန်ဆောင်မှုတစ်ခု တည်ဆောက်နေပြီး ပြင်ပ Third-party Developer များအား API များကို ခေါ်ယူခွင့် ပေးလိုသည်။ ကုမ္ပဏီသည် Developer များ၏ စာရင်းသွင်းမှု Tier အလိုက် (ဥပမာ- Silver Tier: 100 requests/sec, Gold Tier: 1,000 requests/sec) ခေါ်ယူခွင့် Rate Limits များကို ခွဲခြားသတ်မှတ်လိုသည်။ မည်သည့် Feature ကို အသုံးပြုသင့်သနည်း?

- A) AWS Lambda Concurrency Limits
- B) Amazon API Gateway REST API with Usage Plans and API Keys
- C) Amazon CloudFront Geo-restriction
- D) AWS WAF Rate-based Rule သီးသန့်

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **API Gateway REST API ၏ Usage Plans & API Keys** စနစ်သည် သုံးစွဲသူအလိုက် သီးခြား API Keys များ ထုတ်ပေးနိုင်ပြီး Tier အလိုက် Throttling (Rate limits) နှင့် Quotas (လစဉ် calls အကန့်အသတ်) များကို အလွယ်ကူဆုံး စီမံခန့်ခွဲနိုင်သော AWS စံနှုန်း ဖြစ်ပါသည်။
</details>
