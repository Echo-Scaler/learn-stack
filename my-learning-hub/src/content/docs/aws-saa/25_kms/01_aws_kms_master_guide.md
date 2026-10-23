---
title: "AWS KMS — Complete Master Architectural Guide"
description: "AWS KMS (Key Management Service) — Managed service to create and control cryptographic keys ကို မြန်မာလို အခြေခံမှ စတင်၍ Envelope Encryption, CMKs, Key Policies နှင့် SAA-C03 Guide"
---

# AWS KMS (Key Management Service)
### Managed Cryptographic Key Management & Envelope Encryption Service

AWS KMS သည် ဒေတာများကို လုံခြုံစွာ Encrypt (ကုဒ်ဝှက်) လုပ်ရန် လိုအပ်သော Cryptographic Keys များကို ဖန်တီးခြင်း၊ ထိန်းချုပ်ခြင်းနှင့် စီမံခန့်ခွဲခြင်းတို့ကို **FIPS 140-2/3 Level 3 Hardware Security Modules (HSMs)** ဖြင့် အာမခံပေးသော AWS လုံခြုံရေး ဝန်ဆောင်မှု ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

လုပ်ငန်းများတွင် Database များ၊ ဖိုင်များနှင့် Disk များကို Encrypt လုပ်ရန် Encryption Keys များကို Application Server ပေါ်ရှိ ဖိုင်များအတွင်း သိမ်းဆည်းထားပါက Server ဖောက်ထွင်းခံရသည်နှင့် Key ပါ ပေါက်ကြားသွားမည် ဖြစ်သည်။

**AWS KMS ၏ အဓိက ရည်ရွယ်ချက်:**  
Encryption Keys များကို AWS ၏ ခိုင်မာသော သီးသန့် Hardware စက်များ (HSMs) အတွင်း၌သာ အမြဲတမ်း လုံခြုံစွာ ထိန်းသိမ်းထားပေးပြီး၊ **KMS Key ၏ Plaintext တန်ဖိုးကို မည်သူမျှ (AWS ဝန်ထမ်းများပင်လျှင်) အပြင်သို့ ထုတ်ယူကြည့်ရှုခွင့် မရှိစေဘဲ** အသုံးပြုသူ ခွင့်ပြုချက်ရှိမှသာ ဒေတာများကို Encrypt/Decrypt လုပ်ဆောင်ပေးရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **AWS Managed Keys** | Free Default Keys | AWS Services များ (ဥပမာ- `aws/s3`, `aws/ebs`) အတွက် အလိုအလျောက် သတ်မှတ်ပေးသော အခမဲ့ Key များ ဖြစ်သည်။ (Key Policy ပြင်ခွင့် မရှိပါ)။ |
| **Customer Managed Keys (CMK)** | Custom Control Keys | သုံးစွဲသူ ကိုယ်တိုင် ဖန်တီးသော Key များဖြစ်ပြီး **Key Policy ပြင်ဆင်ခြင်း၊ Automatic Annual Rotation ဖွင့်ခြင်းနှင့် Delete ပြုလုပ်ခြင်း** တို့ကို အပြည့်အဝ ထိန်းချုပ်နိုင်သည်။ |
| **Symmetric vs Asymmetric Keys** | Cryptographic Algorithms | **Symmetric** (256-bit AES Key တစ်ခုတည်းဖြင့် Encrypt/Decrypt လုပ်သည် - အသုံးအများဆုံး)၊ **Asymmetric** (Public/Private Key pair ဖြင့် Sign/Verify သို့မဟုတ် Encrypt လုပ်သည်)။ |
| **Key Policy** | KMS Access Control | **KMS Key တိုင်းတွင် မဖြစ်မနေ ပါဝင်ရမည့် Resource-based Policy ဖြစ်သည်။** Key Policy တွင် ခွင့်မပြုပါက IAM Admin ပင်လျှင် Key ကို သုံးခွင့် မရှိပါ။ |
| **Envelope Encryption** | 2-Tier Encryption Model | ကြီးမားသော ဒေတာများကို KMS က တိုက်ရိုက် Encrypt မလုပ်ဘဲ Data Key (DEK) ဖြင့် Encrypt လုပ်သော စနစ် ဖြစ်သည်။ |
| **Multi-Region Keys** | Disaster Recovery Keys | မတူညီသော AWS Regions များတွင် တူညီသော Key ID နှင့် Key Material ဖြင့် Encrypt/Decrypt ပြုလုပ်နိုင်သော သီးသန့် Key များ ဖြစ်သည်။ |

---

## 3. Architecture (Diagram & Envelope Encryption Flow)

KMS သည် 4 KB ထက်ကြီးသော ဒေတာများကို တိုက်ရိုက် Encrypt မလုပ်နိုင်သဖြင့် အောက်ပါ **Envelope Encryption Architecture** ကို အသုံးပြုပါသည်:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ENVELOPE ENCRYPTION FLOW (ENCRYPT DATA)                                │
│                                                                        │
│  [ Application Server ] ────(1. GenerateDataKey Request)────► [ AWS KMS ]
│            ▲                                                      │    │
│            │ (2. Returns Plaintext DEK + Encrypted DEK)           │    │
│            └──────────────────────────────────────────────────────┘    │
│                                                                        │
│   [ Plaintext Data Key (DEK) ] ──► (Encrypt 100 GB File)               │
│                                           │                            │
│                                           ▼                            │
│                             [ Encrypted Ciphertext File ]              │
│                                           │                            │
│  • Memory ပေါ်မှ Plaintext DEK ကို ချက်ချင်း ဖျက်ပစ်သည်!                     │
│  • [ Encrypted Data Key (Ciphertext) ] ကို Encrypted File ဘေးတွင် ကပ်သိမ်းသည်│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Encrypting Data:** Application သည် KMS ထံသို့ `GenerateDataKey` API ခေါ်ယူသည်။ KMS က **Plaintext Data Key** နှင့် KMS Key ဖြင့် ကုဒ်ဝှက်ထားသော **Encrypted Data Key** ဟူ၍ ၂ ခု ပြန်ပေးသည်။ Application သည် Plaintext Data Key ဖြင့် မိမိဖိုင်ကို Encrypt လုပ်ပြီးသည်နှင့် Plaintext Key ကို Memory မှ ဖျက်ပစ်ကာ Encrypted Data Key ကိုသာ ဖိုင်နှင့်အတူ သိမ်းဆည်းထားသည်။
2. **Decrypting Data:** ဖိုင်ကို ပြန်ဖတ်လိုပါက Encrypted Data Key ကို KMS ထံ ပို့၍ `Decrypt` ခေါ်သည်။ KMS ကသာလျှင် မူရင်း Plaintext Data Key ကို ပြန်လည် ဖြည်ပေးနိုင်ပြီး ထို Key ဖြင့် ဖိုင်ကို ပြန်ဖတ်သည်။
3. **Automatic Key Rotation:** Customer Managed Key တွင် Rotation ဖွင့်ထားပါက AWS သည် **၁ နှစ် (၃၆၅ ရက်) တစ်ကြိမ် Key Material အသစ်ကို အလိုအလျောက် အစားထိုးလဲလှယ်ပေးသည်**။ Key အဟောင်းဖြင့် Encrypt လုပ်ထားသော ဒေတာများကို ပြန်ပြင်စရာ မလိုဘဲ ဆက်လက် Decrypt လုပ်နိုင်သည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Storage & Database Encryption:** Amazon EBS Volumes, S3 Buckets, RDS Databases, EFS File Systems များကို စည်းမျဉ်းအရ မဖြစ်မနေ Encrypt ပြုလုပ်ခြင်း။
- **Secrets Management:** AWS Secrets Manager နှင့် Systems Manager Parameter Store ရှိ Passwords များကို လုံခြုံစွာ ကုဒ်ဝှက်ခြင်း။
- **Regulatory Compliance (HIPAA, PCI-DSS):** မည်သူက မည်သည့်အချိန်တွင် Encryption Key ကို အသုံးပြုသွားသည်ကို CloudTrail ဖြင့် စာရင်းစစ် (Audit Trail) ရယူခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- AWS Services ၄၀ ကျော်နှင့် တစ်ချက်နှိပ်ရုံဖြင့် ချိတ်ဆက်နိုင်ခြင်း။
- Audit Trail အပြည့်အစုံ (CloudTrail တွင် Key အသုံးပြုမှုတိုင်းကို မှတ်တမ်းတင်သည်)။
- FIPS 140-2 Level 3 Hardware Security။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **4 KB Direct Limit:** KMS API တိုက်ရိုက်ဖြင့် 4 KB ထက်ကြီးသော Data ကို Encrypt လုပ်၍ မရပါ။ (Envelope Encryption သုံးရမည်)။
- **KMS Request Throttling:** တစ်စက္ကန့်လျှင် API Calls သောင်းချီ ခေါ်ယူပါက KMS Quota ပြည့်သွားနိုင်သည်။ (S3 Bucket Key ဖွင့်၍ ၉၉% လျှော့ချနိုင်သည်)။

---

## 7. Comparison: AWS KMS vs AWS CloudHSM

| Feature | AWS KMS | AWS CloudHSM |
| :--- | :--- | :--- |
| **Tenancy** | **Multi-Tenant (Shared Hardware)** | **Single-Tenant (Dedicated Hardware)** |
| **Management** | Fully Managed by AWS | Customer Fully Manages HSM Cluster |
| **Control** | Key Policy & IAM Integration | Full Hardware & OS-level HSM Control |
| **Cost** | **$1.00 per key/month** (အလွန်သက်သာသည်) | **~$1,200 per month per HSM** (အလွန်ဈေးကြီးသည်) |
| **Standards** | FIPS 140-2 Level 3 Shared | FIPS 140-2 Level 3 Dedicated Hardware |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Customer Managed KMS Key အသစ် ဆောက်ခြင်း
```bash
aws kms create-key --description "Production Database Encryption Key"
```

### Step 2: စာသားတိုတစ်ခုကို တိုက်ရိုက် Encrypt လုပ်ခြင်း (Under 4 KB)
```bash
aws kms encrypt \
    --key-id "1234abcd-12ab-34cd-56ef-1234567890ab" \
    --plaintext fileb://secret.txt \
    --output text \
    --query CiphertextBlob > encrypted_secret.base64
```

### Step 3: ပြန်လည် Decrypt ပြုလုပ်ခြင်း
```bash
aws kms decrypt \
    --ciphertext-blob fileb://<(base64 -d encrypted_secret.base64) \
    --output text \
    --query Plaintext | base64 -d
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Key Policy (Least privilege), VPC Interface Endpoint for KMS, Multi-Factor Authentication for Key Deletion (7 to 30 days waiting period before deletion)။
- **Monitoring:** CloudWatch Metrics, CloudTrail Event History (`EventName: Decrypt` သို့မဟုတ် `GenerateDataKey`)။
- **Cost:** Customer Managed Key တစ်ခုလျှင် $1.00 per month + $0.03 per 10,000 API requests။ (AWS Managed Keys များသည် လစဉ်ကြေး အခမဲ့ဖြစ်သည်)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Key Policy is Mandatory:** IAM Policy တွင် Admin အခွင့်အရေး ပေးထားသော်လည်း KMS ၏ **Key Policy** တွင် အဆိုပါ IAM User အား ထည့်သွင်းခွင့်ပြုမထားပါက Access Denied ဖြစ်သည်။
> 2. **KMS vs CloudHSM:** ကုမ္ပဏီစည်းမျဉ်းအရ သီးသန့် Dedicated Hardware ပေါ်တွင် မိမိကိုယ်တိုင် Cryptographic Keys စီမံလိုပါက အဖြေသည် **AWS CloudHSM** ဖြစ်ပါသည်။ Standard Cloud Encryption အတွက်မူ **AWS KMS** သာ ရွေးချယ်ပါ။
> 3. **4 KB Data Limit:** ကြီးမားသော ဖိုင်များအတွက် **Envelope Encryption (GenerateDataKey API)** ကို သုံးရမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
ဆေးဝါးကုမ္ပဏီတစ်ခုသည် သုတေသနဖိုင်များကို S3 Bucket တွင် သိမ်းဆည်းထားပြီး ဥပဒေအရ Encryption Keys များကို ၁ နှစ်တစ်ကြိမ် မဖြစ်မနေ အလိုအလျောက် လဲလှယ်ပေးရပါမည် (Annual Key Rotation)။ ထို့ပြင် မည်သူက မည်သည့်ဖိုင်ကို Decrypt လုပ်သွားသည်ကိုလည်း စာရင်းစစ် မှတ်တမ်းအပြည့်အစုံ ရရှိရပါမည်။ မည်သည့် နည်းလမ်းသည် အကောင်းဆုံး ဖြစ်သနည်း?

- A) S3 Default Encryption (SSE-S3)
- B) Customer Managed Key (CMK) ဖြင့် AWS KMS (SSE-KMS) ကို အသုံးပြုပြီး Automatic Key Rotation ကို Enable ပြုလုပ်မည်။
- C) Client-side Encryption ကို ကိုယ်ပိုင် algorithm ဖြင့် ရေးမည်။
- D) S3 Glacier Vault Lock သုံးမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **AWS KMS Customer Managed Key (SSE-KMS)** သည် နှစ်စဉ် Automatic Key Rotation (၃၆၅ ရက်တစ်ကြိမ်) ကို ထောက်ပံ့ပေးပြီး AWS CloudTrail နှင့် ပေါင်းစပ်ကာ မည်သူ Decrypt လုပ်သည်ကို အတိအကျ စာရင်းစစ်ဆေးနိုင်သောကြောင့် ဖြစ်ပါသည်။ SSE-S3 တွင် Audit trail မရရှိပါ။
</details>
