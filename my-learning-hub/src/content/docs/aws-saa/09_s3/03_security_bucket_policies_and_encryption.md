---
title: "၃။ S3 Security, Bucket Policies & Encryption"
description: "S3 Block Public Access၊ Bucket Policies JSON ရေးသားနည်း၊ Enforce HTTPS၊ SSE-S3 vs SSE-KMS Encryption နှင့် VPC Gateway Endpoints"
---

# ၃။ S3 Security, Bucket Policies & Encryption

## S3 Security Architecture

Amazon S3 တွင် ဒေတာလုံခြုံရေးအတွက် အလွှာ ၄ လွှာဖြင့် ကာကွယ်ထားပါသည်-

```
[ Request to S3 ]
       │
       ▼
1. S3 Block Public Access (Account / Bucket Level)  ──► Blocked if Public
       │
       ▼
2. IAM Policy (Who is requesting? User/Role)
       │
       ▼
3. Bucket Policy (Resource-based JSON rules)
       │
       ▼
4. Encryption Check (SSL/TLS in transit & SSE at rest)
       │
       ▼
[ Access Granted / Denied ]
```

---

## 🚫 S3 Block Public Access

S3 Bucket အသစ်တစ်ခု ဆောက်တိုင်း AWS သည် **Block Public Access** ကို Default အနေဖြင့် အပြည့်အဝ ဖွင့်ထားပေးပါသည်။
- မတော်တဆ Bucket Policy သို့မဟုတ် ACL မှားယွင်းသတ်မှတ်မှုကြောင့် ကုမ္ပဏီဒေတာများ Internet သို့ ပေါက်ကြားသွားခြင်းမှ ကာကွယ်ပေးသည်။
- Web assets များကို Public ထုတ်လိုပါက Block Public Access ကို သတိပြု၍ သီးခြား Uncheck လုပ်ရမည်။

---

## 📜 S3 Bucket Policy (JSON Example)

Bucket Policy သည် S3 Bucket တစ်ခုလုံး သို့မဟုတ် သီးခြား Folder များအတွက် ခွင့်ပြုချက် (Allow/Deny) သတ်မှတ်သော **Resource-based Policy** ဖြစ်ပါသည်။

### နမူနာ ၁: HTTPS (SSL/TLS) မသုံးသော Request များကို ပိတ်ပင်ခြင်း (Enforce In-Transit Encryption)

SAA-C03 စာမေးပွဲတွင် အလွန်မေးလေ့ရှိသော Best Practice ဖြစ်ပြီး HTTP ဖြင့် ဝင်ရောက်မှုကို အပြီးတိုင် ငြင်းပယ်ပါသည်:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceSSLRequestsOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-company-secure-bucket",
        "arn:aws:s3:::my-company-secure-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

---

## 🔐 S3 Encryption at Rest (၄ မျိုး နှိုင်းယှဉ်ချက်)

S3 တွင် Data များ Hard Disk ပေါ်တွင် သိမ်းဆည်းချိန် Encrypt လုပ်ရန် နည်းလမ်း ၄ မျိုး ရှိပါသည်:

| Encryption Type | Key စီမံခန့်ခွဲမှု | Header Parameter | စာမေးပွဲ သော့ချက် & Audit |
| :--- | :--- | :--- | :--- |
| **SSE-S3** | AWS Fully Managed (AES-256) | `"x-amz-server-side-encryption": "AES256"` | **Default ဖြစ်သည်။** ထပ်ဆောင်းစရိတ် မရှိဘဲ အလိုအလျောက် Encrypt လုပ်ပေးသည်။ |
| **SSE-KMS** | AWS Key Management Service | `"x-amz-server-side-encryption": "aws:kms"` | **Audit Trail လိုအပ်ပါက သုံးသည်။** KMS Call ပေါ် မူတည်၍ CloudTrail တွင် မည်သူဖတ်သည်ကို စစ်ဆေးနိုင်သော်လည်း KMS Quotas ရှိသည်။ |
| **SSE-C** | Customer Provided Key | Customer ပေးသော Key ကို S3 သို့ Header မှ ပို့ရသည် | AWS မှ Key ကို လုံးဝ မသိမ်းဆည်းလိုသောအခါ သုံးသည်။ |
| **Client-Side** | Client မှ Encrypt လုပ်ပြီးမှ S3 သို့ တင်သည် | Encrypted bytes သာ S3 သို့ ရောက်သည် | အမြင့်ဆုံး လုံခြုံရေးအတွက် S3 မရောက်မီ မိမိ Application ဘက်မှ Encrypt လုပ်ခြင်း။ |

---

## 🌐 S3 VPC Gateway Endpoint

EC2 Instance များမှ S3 Bucket များသို့ Private IP ဖြင့် လုံခြုံစွာ သွားရောက်နိုင်ရန် **VPC Gateway Endpoint** ကို အခမဲ့ အသုံးပြုနိုင်ပါသည်:
- NAT Gateway သို့မဟုတ် Internet Gateway မလိုဘဲ AWS Internal Network မှ တိုက်ရိုက် ချိတ်ဆက်သည်။
- Data Transfer ကုန်ကျစရိတ်ကို လျှော့ချပေးပြီး Public Internet သို့ ဒေတာ မရောက်စေပါ။
