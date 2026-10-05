---
title: "Phase 2 — Identity, Access Management & Security (IAM & Security)"
description: "Architect Perspective: SAA-C03 ၏ Domain 1 သည် Design Secure Architectures (30%) ဖြစ်ပြီး စာမေးပွဲတွင် အမှတ်အများဆုံး နယ်ပယ်ဖြစ်သည်။ Cloud Architecture တည်ဆောက်ရ"
---

## Phase 2 — Identity, Access Management & Security (IAM & Security)

> **Architect Perspective:** SAA-C03 ၏ Domain 1 သည် **Design Secure Architectures (30%)** ဖြစ်ပြီး စာမေးပွဲတွင် အမှတ်အများဆုံး နယ်ပယ်ဖြစ်သည်။ Cloud Architecture တည်ဆောက်ရာတွင် "Zero Trust" မူဝါဒနှင့် "Principle of Least Privilege" (အနည်းဆုံး လိုအပ်သော လုပ်ပိုင်ခွင့်သာ ပေးခြင်း) ကို စနစ်တကျ အကောင်အထည်ဖော်ရမည်။

---

## ၂.၁ IAM (Identity and Access Management) Deep Dive

IAM သည် AWS ရှိ Resource များသို့ မည်သူက မည်သည့်အရာများကို ပြုလုပ်ခွင့်ရှိသည်ကို ထိန်းချုပ်ပေးသော **Global Service** ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                             AWS IAM CORE COMPONENTS                               |
+-----------------------------------------------------------------------------------+
|  1. Root User: Account စတင်ဖွင့်စဉ်က Email ဖြစ်သည်။ Full Access ရှိသည်။ ပုံမှန် မသုံးရ!|
|  2. IAM User: လူတစ်ဦးချင်းစီအတွက် Login (Password for Console, Access Key for CLI)  |
|  3. IAM Group: တူညီသော အခန်းကဏ္ဍရှိ User များ စုဖွဲ့မှု (Developers, DevOps, Admins) |
|  4. IAM Role: လူမဟုတ်ဘဲ Service (EC2, Lambda) သို့မဟုတ် External User အတွက် ယာယီပေးအပ်|
|  5. IAM Policy: JSON format ဖြင့် ရေးသားထားသော ခွင့်ပြုချက် စည်းမျဉ်း (Permissions) |
+-----------------------------------------------------------------------------------+
```

### အထူးလေ့လာရန် နှိုင်းယှဉ်ချက် (Crucial Comparison):

```
+-----------------------------------------------------------------------------------+
|                 HUMAN ACCESS PATTERN VS SERVICE ACCESS PATTERN                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [PATTERN 1: Human User Access]                                                   |
|  User (Ko Aung) ---> Member of Group (Developers) ---> Attached Policy (S3 Read)  |
|  - လူတစ်ဦးချင်းစီအတွက် User တစ်ခုစီ သီးခြားဆောက်သည်                                  |
|  - User ပေါ်သို့ တိုက်ရိုက် Policy မတွဲဘဲ Group ပေါ်သို့ Policy တွဲပေးသည်              |
|  - Multi-Factor Authentication (MFA) မဖြစ်မနေ ဖွင့်ခိုင်းသည်                        |
|                                                                                   |
|  ===============================================================================  |
|                                                                                   |
|  [PATTERN 2: AWS Service Access (Best Practice!)]                                 |
|  EC2 Instance ---> IAM Role (Instance Profile) ---> Temporary STS Token ---> S3  |
|  - **Code ထဲတွင် Access Key & Secret Key လုံးဝ မထည့်ရပါ!**                          |
|  - AWS STS (Security Token Service) က နာရီပိုင်းအလိုက် ယာယီ Credentials အလိုအလျောက် |
|    ထုတ်ပေးပြီး Rotate လုပ်ပေးသည်                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Policy အမျိုးအစားများ နှိုင်းယှဉ်ချက်:
- **AWS Managed Policy:** AWS မှ ကြိုတင် ရေးသားပေးထားသော Policy (ဥပမာ `AdministratorAccess`, `AmazonS3ReadOnlyAccess`)။
- **Customer Managed Policy:** မိမိ စိတ်ကြိုက် ပြင်ဆင်ရေးသားထားပြီး Reusable ဖြစ်သော Policy။
- **Inline Policy:** User သို့မဟုတ် Role တစ်ခုတည်းအတွင်းသို့ တိုက်ရိုက် ရေးထည့်ထားသော Policy (အခြားနေရာတွင် ပြန်သုံး၍ မရပါ)။
- **Identity-based Policy vs Resource-based Policy:**
  - *Identity-based:* User, Group သို့မဟုတ် Role ပေါ်တွင် ကပ်ထားသော Policy။
  - *Resource-based:* Resource ကိုယ်တိုင်ပေါ်တွင် ကပ်ထားသော Policy (ဥပမာ - S3 Bucket Policy, SQS Queue Policy, KMS Key Policy)။

---

## ၂.၂ Security Concepts & Core Security Services

```
+------------------------------------+------------------------------------+
| Authentication (Who are you?)      | Authorization (What can you do?)   |
+------------------------------------+------------------------------------+
| - မည်သူဖြစ်ကြောင်း စိစစ်ခြင်း      | - မည်သည့် အလုပ်ကို လုပ်ပိုင်ခွင့်ရှိ |
| - Username/Password, MFA, API Keys |   သည်ကို ဆုံးဖြတ်ခြင်း (IAM Policy)|
+------------------------------------+------------------------------------+
| Encryption at Rest                 | Encryption in Transit              |
+------------------------------------+------------------------------------+
| - Disk/Storage ပေါ်တွင် Data သိမ်းဆည်း| - ကွန်ရက်ပေါ်မှ Data ပေးပို့နေစဉ်    |
|   ထားစဉ် Encrypt လုပ်ခြင်း (KMS)   |   ကာကွယ်ခြင်း (HTTPS / TLS 1.3)   |
+------------------------------------+------------------------------------+
```

### Core AWS Security Services ခြုံငုံသုံးသပ်ချက်

```
+-----------------------------------------------------------------------------------+
|                            AWS SECURITY SERVICES ECOSYSTEM                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. AWS KMS (Key Management Service)                                              |
|     - Encryption Key များ (CMK) ကို လုံခြုံစွာ ထိန်းသိမ်းပြီး Envelope Encryption သုံးသည်|
|                                                                                   |
|  2. AWS Secrets Manager                                                           |
|     - Database Passwords, API Keys များကို အလိုအလျောက် Rotate လုပ်ပေးနိုင်သော Service|
|                                                                                   |
|  3. AWS Systems Manager (SSM) Parameter Store                                     |
|     - App Configuration နှင့် လျှို့ဝှက် Strings များကို အခမဲ့ သိမ်းဆည်းပေးသည်     |
|                                                                                   |
|  4. AWS Certificate Manager (ACM)                                                 |
|     - SSL/TLS Certificates (HTTPS) များကို အခမဲ့ ထုတ်ပေးပြီး အလိုအလျောက် သက်တမ်းတိုးသည်|
|     - ALB, CloudFront, API Gateway တို့နှင့် တွဲဖက် သုံးရသည်                       |
|                                                                                   |
|  5. AWS WAF (Web Application Firewall)                                            |
|     - Layer 7 တွင် SQL Injection, Cross-Site Scripting (XSS), Rate Limiting ကာကွယ်သည်|
|                                                                                   |
|  6. AWS Shield (DDoS Protection)                                                  |
|     - Standard (အခမဲ့): Layer 3/4 SYN floods ကာကွယ်သည်                            |
|     - Advanced ($3000/mo): 24/7 DDoS Response Team (SRT) နှင့် ငွေကြေးအာမခံ ပေးသည်|
|                                                                                   |
|  7. Amazon GuardDuty (Intelligent Threat Detection)                               |
|     - AI/Machine Learning ဖြင့် CloudTrail, VPC Flow Logs, DNS Logs များကို        |
|       စစ်ဆေးပြီး Crypto Mining, compromised credentials များကို အချိန်နှင့်တပြေးညီ ရှာသည်|
|                                                                                   |
|  8. AWS Security Hub                                                              |
|     - GuardDuty, Inspector, Macie နှင့် AWS Config မှ တွေ့ရှိချက်များကို            |
|       Dashboard တစ်ခုတည်းတွင် ဗဟိုပြု ပြသပေးသော Single-pane-of-glass စနစ် ဖြစ်သည် |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [03_Phase3_VPC_and_Networking.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/03_Phase3_VPC_and_Networking.md)
