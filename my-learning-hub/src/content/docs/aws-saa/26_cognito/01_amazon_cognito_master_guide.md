---
title: "Amazon Cognito — Complete Master Architectural Guide"
description: "Amazon Cognito — Customer identity and access management for web and mobile apps ကို မြန်မာလို အခြေခံမှ စတင်၍ User Pools vs Identity Pools, JWT Tokens နှင့် SAA-C03 Guide"
---

# Amazon Cognito
### Customer Identity & Access Management (CIAM) for Web and Mobile Applications

Amazon Cognito သည် မိုဘိုင်းအက်ပ်များနှင့် ဝဘ်ဆိုက်များအတွက် အသုံးပြုသူ သန်းပေါင်းများစွာ၏ **Sign-Up (အကောင့်ဖွင့်ခြင်း)၊ Sign-In (ဝင်ရောက်ခြင်း)၊ Access Control နှင့် ယာယီ AWS ခွင့်ပြုချက်များ** ကို လွယ်ကူလျင်မြန်စွာ စီမံပေးသော AWS ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

Application တစ်ခုတွင် User Authentication စနစ်ကို ကိုယ်တိုင် ရေးသားပါက Password Hashing, Email Verification, SMS Multi-Factor Authentication (MFA), Google/Facebook Social Login နှင့် Token Refreshing စသည့် လုံခြုံရေး အစိတ်အပိုင်းများကို ရှုပ်ထွေးစွာ တည်ဆောက်ရသည်။

**Amazon Cognito ၏ အဓိက ရည်ရွယ်ချက်:**  
ဆာဗာမလိုဘဲ (Serverless) အသုံးပြုသူ User Directory တစ်ခုလုံးကို အလိုအလျောက် Scale လုပ်ပေးပြီး၊ အသုံးပြုသူများအား **Amazon S3 သို့မဟုတ် DynamoDB ဆီသို့ ကြားခံဆာဗာ မလိုဘဲ တိုက်ရိုက် လုံခြုံစွာ Upload တင်ခွင့် (Temporary AWS Credentials)** ပေးအပ်နိုင်ရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

Amazon Cognito တွင် အဓိက မဏ္ဍိုင် ၂ ခု ရှိပါသည် (SAA-C03 အလွန်အမေးများပါသည်):

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Cognito User Pools (CUP)** | **User Directory (Authentication)** | အသုံးပြုသူ စာရင်းကို ထိန်းသိမ်းသည်။ Sign-up, Sign-in, Password Reset, MFA နှင့် Social Identity (Google, Apple, Facebook, SAML) မှတစ်ဆင့် **JSON Web Tokens (JWT: ID Token, Access Token)** ထုတ်ပေးသည်။ |
| **Cognito Identity Pools (CIP)** | **AWS Access (Authorization)** | Federated Identities ဟုလည်း ခေါ်သည်။ User Pool သို့မဟုတ် Social Login မှ ရလာသော Token ကို **ယာယီ AWS IAM Credentials (STS)** အဖြစ် လဲလှယ်ပေးပြီး S3 သို့မဟုတ် DynamoDB ကို တိုက်ရိုက် သုံးခွင့်ပေးသည်။ |
| **Cognito Sync** | Device Synchronization | User Preferences များကို စက်ပစ္စည်းအမျိုးမျိုး (Mobile, Web) အကြား အလိုအလျောက် Sync လုပ်ပေးသည်။ (ယခုအခါ AppSync ကို ပိုမို အကြံပြုသည်)။ |
| **Lambda Triggers** | Custom Hooks | အကောင့်ဖွင့်ချိန် (Pre-sign-up)၊ အတည်ပြုချိန် (Post-confirmation) တွင် အလိုအလျောက် စစ်ဆေးဆောင်ရွက်သော AWS Lambda Hooks များ ဖြစ်သည်။ |

---

## 3. Architecture (Diagram & Two-Step Auth Flow)

User Pools မှ Identity Pools သို့ ဖြတ်သန်း၍ AWS Resource များကို တိုက်ရိုက် သုံးစွဲသော **Production Architecture Flow**:

```
                       [ Mobile / Web Application ]
                                    │
                                    ▼ (1. Sign-In with Username/Password or Google)
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: AUTHENTICATION (COGNITO USER POOLS)                            │
│                                                                        │
│   [ Amazon Cognito User Pool ] ──► (Verify Credentials & MFA)          │
│               │                                                        │
│               ▼ (2. Returns JWT Tokens: ID, Access, Refresh Token)     │
└───────────────┼────────────────────────────────────────────────────────┘
                │
                ▼ (3. Exchange JWT Token for AWS Credentials)
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: AUTHORIZATION (COGNITO IDENTITY POOLS)                         │
│                                                                        │
│   [ Amazon Cognito Identity Pool ] ──► (Assumes IAM Authenticated Role)│
│               │                                                        │
│               ▼ (4. AWS STS Issues Temporary AWS Access Key & Secret)  │
└───────────────┼────────────────────────────────────────────────────────┘
                │
                ▼ (5. Direct API Call: Upload Photo to S3)
┌────────────────────────────────────────────────────────────────────────┐
│ TARGET AWS RESOURCES (No Web Server Needed!)                           │
│                                                                        │
│   [ Amazon S3 Bucket: /user-uploads/${cognito-identity.amazonaws.com:sub} ]
│   [ Amazon DynamoDB: /UserScores ]                                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Authentication (User Pool):** User သည် App မှတစ်ဆင့် Login ဝင်သည်။ User Pool က စစ်ဆေးပြီးနောက် စံနှုန်းညီ **JWT Tokens (ID Token, Access Token)** ကို Client ထံ ပြန်ပို့သည်။
2. **Authorization (Identity Pool):** Client App သည် ရရှိလာသော JWT Token ကို Identity Pool ထံ ပေးပို့သည်။ Identity Pool က AWS STS မှတစ်ဆင့် ယာယီ AWS IAM Credentials (Access Key ID, Secret Key, Session Token) ကို ထုတ်ပေးသည်။
3. **Direct Resource Access:** Mobile App သည် ကြားခံ Node.js/PHP Backend Server သို့ ဓာတ်ပုံ ပေးပို့စရာ မလိုတော့ဘဲ **S3 Bucket သို့ တိုက်ရိုက် Upload** တင်နိုင်သည်။ IAM Policy တွင် User တစ်ဦးစီသည် မိမိ၏ သီးခြား Folder (`/user-uploads/${user-id}/*`) ကိုသာ ဝင်ရောက်နိုင်အောင် ကန့်သတ်ထားသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Mobile Photo Sharing Apps (Instagram-style):** သုံးစွဲသူများမှ ဓာတ်ပုံများကို Backend Web Server မဖြတ်ဘဲ S3 သို့ တိုက်ရိုက် မြန်ဆန်စွာ Upload တင်ခြင်း။
- **Serverless SaaS Customer Authentication:** API Gateway ရှေ့တွင် Cognito User Pool Authorizer ထားရှိပြီး JWT Token စစ်ဆေးခြင်း။
- **Enterprise Single Sign-On (SSO):** ဝန်ထမ်းများသည် ရုံးတွင်း Active Directory (SAML 2.0 / OIDC) အကောင့်ဖြင့် မိုဘိုင်းအက်ပ်သို့ ဝင်ရောက်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- သန်းနှင့်ချီသော သုံးစွဲသူများအတွက် အလိုအလျောက် Auto-scaling။
- Google, Apple, Facebook Social Logins များကို ကလစ်အနည်းငယ်ဖြင့် ချိတ်ဆက်နိုင်ခြင်း။
- Backend ဆာဗာ ကုန်ကျစရိတ်ကို သုညအထိ လျှော့ချပေးနိုင်ခြင်း (Direct AWS Access)။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- User Pool Token သက်တမ်းနှင့် Custom Claim များကို စနစ်တကျ ဒီဇိုင်းဆွဲရသည်။

---

## 7. Comparison: Cognito User Pools vs Identity Pools

| Feature | Cognito User Pools (CUP) | Cognito Identity Pools (CIP) |
| :--- | :--- | :--- |
| **အဓိက တာဝန်** | **Authentication (Identity)** | **Authorization (Access Control)** |
| **ထုတ်ပေးသော အရာ** | **JWT Tokens (ID, Access, Refresh)** | **Temporary AWS IAM Credentials (STS)** |
| **ဘယ်နေရာမှာ သုံးသလဲ** | User Directory, Sign-Up/Sign-In, API Gateway | S3, DynamoDB များကို Client မှ တိုက်ရိုက်ခေါ်ယူရန် |
| **Federation** | Google, Facebook, Apple, SAML | User Pools, Google, Facebook, Apple, Unauthenticated Guests |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Cognito User Pool အသစ် ဆောက်လုပ်ခြင်း
```bash
aws cognito-idp create-user-pool \
    --pool-name "ProdMobileUserPool" \
    --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":false}}' \
    --auto-verified-attributes "email"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Advanced Security Features (Adaptive Authentication: သံသယဖြစ်ဖွယ် IP သို့မဟုတ် Device အသစ်မှ လာပါက SMS MFA အလိုအလျောက် တောင်းဆိုခြင်း, Compromised Credentials Check)။
- **Monitoring:** CloudWatch Metrics, CloudTrail User Pool Logs.
- **Cost:** **လစဉ် အသုံးပြုသူ ပထမ ၅၀,၀၀၀ (50,000 MAU - Monthly Active Users) အထိ လုံးဝ အခမဲ့ (Free Tier)** ဖြစ်ပြီး၊ ကျော်လွန်ပါက MAU တစ်ဦးလျှင် $0.0055 သာ ကျသင့်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **User Pools vs Identity Pools:**  
>    - သုံးစွဲသူ အကောင့်ဖွင့်ခြင်း၊ Login ဝင်ခြင်း၊ Password မေ့ခြင်း ➔ **Cognito User Pools**  
>    - အသုံးပြုသူအား S3 သို့မဟုတ် DynamoDB သို့ တိုက်ရိုက် Access ပေးရန် ယာယီ AWS Credentials ရယူခြင်း ➔ **Cognito Identity Pools**
> 2. **Unauthenticated Guest Access:** Login မဝင်ရသေးသော ဧည့်သည်များအား S3 ထဲရှိ နမူနာဖိုင်များ ဖတ်ရှုခွင့်ပေးရန် **Cognito Identity Pools (Enable Unauthenticated Identities)** ကို သုံးရမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
မိုဘိုင်းဂိမ်း Application တစ်ခုသည် ကစားသမားများအား Login ဝင်စေပြီး ၎င်းတို့၏ Game Profile ပုံရိပ်များကို Amazon S3 Bucket ထဲသို့ တိုက်ရိုက် Upload တင်ခွင့် ပြုလိုသည်။ Application သည် အလယ်တွင် Backend Server တစ်ခု ထားရှိ၍ Proxy လုပ်မည့်အစား အသုံးပြုသူတစ်ဦးချင်းစီအတွက် သီးသန့် ကန့်သတ်ထားသော ယာယီ AWS IAM Credentials ထုတ်ပေးလိုသည်။ မည်သည့် AWS Service ပေါင်းစပ်မှုကို ရွေးချယ်သင့်သနည်း?

- A) AWS IAM User အကောင့်များ ကစားသမားတိုင်းအတွက် ဆောက်ပေးမည်။
- B) Cognito User Pools ဖြင့် Login စစ်ဆေးပြီး Cognito Identity Pools ဖြင့် ယာယီ AWS Credentials ထုတ်ယူကာ S3 သို့ တိုက်ရိုက် Upload တင်မည်။
- C) S3 Bucket Policy တွင် Anonymous Write ခွင့်ပြုမည်။
- D) API Gateway REST API ဖြင့် ဓာတ်ပုံများကို Passthrough လုပ်မည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Cognito User Pools** ဖြင့် Authentication ပြုလုပ်ပြီး **Cognito Identity Pools (Federated Identities)** မှတစ်ဆင့် ကစားသမားတစ်ဦးချင်းစီအတွက် ယာယီ STS Credentials ထုတ်ယူကာ S3 သို့ တိုက်ရိုက် Access ပေးခြင်းသည် AWS Serverless Mobile Architecture ၏ အကောင်းဆုံး စံနှုန်း ဖြစ်ပါသည်။
</details>
