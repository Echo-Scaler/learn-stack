---
title: "အခန်း (၄) — အသုံးပြုခွင့်နှင့် ဒေတာလုံခြုံရေး (IAM Least Privilege, Encryption, Secrets)"
description: "Cloud Security တွင် Network လုံခြုံရေးအပြင် မည်သူက မည်သည့်အရာကို လုပ်ပိုင်ခွင့်ရှိသနည်း (Identity & Access Management) နှင့် Data များကို ခိုးယူမခံရစေရန် မည်သို"
---

## အခန်း (၄) — အသုံးပြုခွင့်နှင့် ဒေတာလုံခြုံရေး (IAM Least Privilege, Encryption, Secrets)

Cloud Security တွင် Network လုံခြုံရေးအပြင် မည်သူက မည်သည့်အရာကို လုပ်ပိုင်ခွင့်ရှိသနည်း (Identity & Access Management) နှင့် Data များကို ခိုးယူမခံရစေရန် မည်သို့ ကာကွယ်မည်နည်း (Data Protection) သည် အထူးပင် အဓိကကျပါသည်။ ဤအခန်းတွင် **IAM Least Privilege, Data Encryption** နှင့် **Secrets Management** ကို အသေးစိတ် ရှင်းပြထားပါသည်။

---

## ၁။ IAM Least Privilege (အနည်းဆုံး အခွင့်အာဏာ ပေးအပ်ခြင်း သဘောတရား)

### (က) ဒါကဘာလဲ? (What is it?)
- **Principle of Least Privilege (PoLP)** ဆိုသည်မှာ အသုံးပြုသူ (User)၊ Developer သို့မဟုတ် Application/Server (EC2/Lambda) တစ်ခုကို ၎င်း၏ လုပ်ငန်းတာဝန် အောင်မြင်စွာ ပြီးမြောက်စေရန် **လိုအပ်သော အနည်းဆုံး အခွင့်အာဏာ (Permission) ကိုသာ ကွက်တိ ခွင့်ပြုပေးပြီး၊ မလိုအပ်သော အခြား အခွင့်အာဏာ အားလုံးကို ပိတ်ပင်ထားခြင်း** ဖြစ်ပါသည်။
- ဥပမာ- ရုံးတွင်းရှိ ဧည့်သည်အား ရုံးအဆောက်အဦတစ်ခုလုံးရှိ အခန်းတိုင်းကို ဖွင့်နိုင်သော Master Key မပေးဘဲ၊ ဧည့်ခန်း တံခါးတစ်ပေါက်တည်းကိုသာ ဖွင့်နိုင်သော ကတ်ပြား ပေးသကဲ့သို့ ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- အကယ်၍ Developer တစ်ဦး၏ AWS Access Key သည် GitHub ပေါ်သို့ မတော်တဆ ပေါက်ကြားသွားခဲ့ပါက:
  - `AdministratorAccess` (Full Power) ပေးထားပါက Hacker သည် Account တစ်ခုလုံးရှိ Database များကို ဖျက်ဆီးခြင်း၊ Bitcoin တူးသော စက်ကြီးများ ထောင်ပြီး ဒေါ်လာ သောင်းချီ ကုန်ကျစေခြင်းများ ပြုလုပ်နိုင်ပါသည်။
  - သို့သော် `Least Privilege` အရ S3 Bucket တစ်ခုတည်းကိုသာ ဖတ်ခွင့် (`s3:GetObject`) ပေးထားပါက အခြား Resource များကို မည်သို့မျှ ထိခိုက်အောင် မလုပ်နိုင်တော့ပါ။

### (ဂ) လက်တွေ့ ဘယ်လိုသုံးမလဲ? (JSON Policy နှိုင်းယှဉ်ချက်)

#### ❌ မှားယွင်းသောပုံစံ (အလွန် အန္တရာယ်ကြီးသည် - Overly Permissive):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```
*(အဓိပ္ပာယ်: AWS ပေါ်ရှိ Service အားလုံး၊ Data အားလုံးကို မည်သူမဆို စိတ်ကြိုက် ဖျက်ပိုင်ခွင့်ရှိသည်)*

####  မှန်ကန်သော Least Privilege ပုံစံ (Production Standard):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppBucketReadWriteOnly",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-company-production-bucket/*"
    }
  ]
}
```
*(အဓိပ္ပာယ်: သတ်မှတ်ထားသော `my-company-production-bucket` အတွင်းရှိ ဖိုင်များကိုသာ ဖတ်ခွင့်/တင်ခွင့်ရှိပြီး၊ ဖျက်ခွင့် (Delete) သော်လည်းကောင်း၊ အခြား Bucket များကိုသော်လည်းကောင်း လုံးဝ ထိတွေ့ခွင့် မရှိပါ)*

---

## ၂။ Encryption (ဒေတာ လျှို့ဝှက်ကုဒ်ပြောင်းလဲခြင်း)

### (က) ဒါကဘာလဲ? (What is it?)
- **Encryption** ဆိုသည်မှာ လူသားများ ဖတ်ရှုနိုင်သော သာမန်စာသား (Plaintext) များကို သင်္ချာ Algorithm (ဥပမာ AES-256) အသုံးပြု၍ လျှို့ဝှက်သော သင်္ကေတများ (Ciphertext) အဖြစ် ပြောင်းလဲထားခြင်း ဖြစ်ပါသည်။ သက်ဆိုင်ရာ လျှို့ဝှက်သော့ (Decryption Key) ရှိမှသာ မူလစာသားအတိုင်း ပြန်လည် ဖတ်ရှုနိုင်ပါသည်။

### (ခ) Encryption အမျိုးအစား နှစ်မျိုး
1. **Encryption in Transit (ရွေ့လျားနေစဉ် Encrypt လုပ်ခြင်း):**
   - Data များသည် Network ကြိုးပေါ်မှတစ်ဆင့် Server သို့ သွားနေစဉ် ကြားဖြတ်ခိုးယူသူများ မဖတ်နိုင်စေရန် ကာကွယ်ခြင်း ဖြစ်သည်။
   - **အသုံးပြုသော နည်းပညာ:** **HTTPS, TLS 1.3, SSH, VPN (IPsec)**။
2. **Encryption at Rest (သိမ်းဆည်းထားစဉ် Encrypt လုပ်ခြင်း):**
   - Data များကို Hard Disk, SSD (EBS), S3 Storage သို့မဟုတ် Database (RDS) ပေါ်တွင် ရေးသားသိမ်းဆည်းထားစဉ် Encrypt လုပ်ထားခြင်း ဖြစ်သည်။
   - အကယ်၍ Hacker က Hard Disk အကြမ်းထည်ကို ဖြုတ်ယူသွားသော်လည်း Key မရှိသဖြင့် ဖတ်၍ မရနိုင်ပါ။
   - **အသုံးပြုသော နည်းပညာ:** **AWS Key Management Service (AWS KMS)** ဖြင့် စီမံသော **AES-256** Encryption။

```
[ User Browser ]
       │
       │ (1. Encryption in Transit: TLS 1.3 / HTTPS - Port 443)
       ▼
   [ ALB / Web App ]
       │
       │ (2. Encryption at Rest: AWS KMS Envelope Encryption)
       ▼
 [ RDS MySQL / S3 Storage ] (Disk ပေါ်တွင် AES-256 ဖြင့် သိမ်းဆည်းသည်)
```

---

## ၃။ Secrets Management (လျှို့ဝှက် အချက်အလက်များ စီမံခန့်ခွဲခြင်း)

### (က) ဒါကဘာလဲ? (What is it?)
- Application တစ်ခု လည်ပတ်ရန် လိုအပ်သော Database Passwords, API Keys (ဥပမာ Stripe API, SendGrid), OAuth Tokens, SSL Private Keys စသည့် အရေးကြီး အချက်အလက်များကို **Secrets** ဟု ခေါ်ပါသည်။
- **အကြီးမားဆုံး အမှား:** ထို Password များကို Git Repository ထဲရှိ `.env` သို့မဟုတ် Source Code (PHP/JS) ထဲတွင် Hardcode ရေးသား သိမ်းဆည်းမိခြင်း ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
1. **No Code Leak:** Code ကို GitHub သို့ Push လုပ်မိသော်လည်း Password များ ပါမသွားပါ။
2. **Centralized Management:** Password ပြောင်းလဲလိုပါက Application Code ကို ပြန် Deploy စရာမလိုဘဲ တစ်နေရာတည်းမှ ပြောင်းလဲနိုင်ပါသည်။
3. **Automated Rotation:** Database Password များကို ရက်ပေါင်း ၃၀ လျှင် တစ်ကြိမ် လူမပါဘဲ အလိုအလျောက် အသစ်လဲလှယ် (Rotate) ပေးနိုင်ပါသည်။

### (ဂ) AWS တွင် အသုံးပြုသော ဝန်ဆောင်မှု နှစ်ခု နှိုင်းယှဉ်ချက်

| အချက်အလက် | AWS Systems Manager (SSM) Parameter Store | AWS Secrets Manager |
| :--- | :--- | :--- |
| **အဓိက အသုံးပြုပုံ** | App Configuration များ (URL, Environment Variables) | Database Credentials, High-value API Keys |
| **Password အလိုအလျောက် လဲလှယ်ခြင်း (Rotation)** | မပါရှိပါ (Manual ပြောင်းရသည်) | **ပါရှိသည်** (RDS Password များကို Auto Rotate လုပ်နိုင်သည်) |
| **ကုန်ကျစရိတ်** | Standard Parameters များအတွက် **အခမဲ့ (Free)** | Secret တစ်ခုလျှင် တစ်လ **$0.40** ကျသင့်သည် |

### (ဃ) လက်တွေ့ App ထဲမှ လှမ်းခေါ်ယူပုံ (AWS CLI & PHP/Node.js)
```bash
# AWS CLI ဖြင့် Secret ကို လုံခြုံစွာ ဆွဲထုတ်ခြင်း
aws secretsmanager get-secret-value \
  --secret-id production/ecommerce/db \
  --query SecretString \
  --output text
```
Application Server သည် စတင် Boot တက်ချိန်တွင် AWS IAM Role ၏ ခွင့်ပြုချက်ဖြင့် အထက်ပါ Secret ကို Memory ထဲသို့သာ လှမ်းယူအသုံးပြုပြီး Hard Disk ပေါ်တွင် သိမ်းဆည်းခြင်း မပြုရပါ။
