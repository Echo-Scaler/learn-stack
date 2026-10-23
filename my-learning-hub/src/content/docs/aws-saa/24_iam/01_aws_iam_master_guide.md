---
title: "AWS IAM — Complete Master Architectural Guide"
description: "AWS IAM (Identity and Access Management) — Securely manage access to AWS services and resources ကို မြန်မာလို အခြေခံမှ စတင်၍ Users, Groups, Roles, Policies, STS နှင့် SAA-C03 Guide"
---

# AWS IAM (Identity and Access Management)
### Centralized Access Control, Roles, Policies & Authorization Framework

AWS IAM သည် AWS အကောင့်တစ်ခုလုံးရှိ မည်သူက (Authentication) မည်သည့် အရင်းအမြစ်များကို (Authorization) မည်သို့သော အခွင့်အရေးများဖြင့် ဝင်ရောက်အသုံးပြုနိုင်သည်ကို ဗဟိုမှ အပြည့်အဝ ထိန်းချုပ်ပေးသော **AWS Global Core Security Service** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

AWS Account ကို စတင်ဖွင့်လှစ်ချိန်တွင် ပါရှိသော **Root User Account** သည် အကောင့်တစ်ခုလုံးကို အကန့်အသတ်မရှိ စီမံနိုင်သော အမြင့်ဆုံး အခွင့်အာဏာရှိသည်။ အဆိုပါ Root User ၏ Password သို့မဟုတ် Access Key ပေါက်ကြားသွားပါက ကုမ္ပဏီတစ်ခုလုံး၏ Infrastructure ဖျက်ဆီးခံရနိုင်သည်။

**AWS IAM ၏ အဓိက ရည်ရွယ်ချက်:**  
Root Account ကို သော့ခတ်ထားပြီး ဝန်ထမ်းတစ်ဦးချင်းစီအတွက် သီးခြား အကောင့်များ (IAM Users)၊ ဝန်ဆောင်မှုများ အချင်းချင်း ချိတ်ဆက်ရန် ယာယီ ခွင့်ပြုချက်များ (IAM Roles) နှင့် **Least Privilege Principle (အနည်းဆုံး လိုအပ်သော အခွင့်အရေးသာ ပေးခြင်း)** မူဝါဒကို တင်းကျပ်စွာ ကျင့်သုံးနိုင်စေရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Root User** | Account Owner | အကောင့်ဖွင့်စ Email ဖြစ်ပြီး အကောင့်ပိတ်ခြင်း၊ Support Plan ပြောင်းခြင်းကဲ့သို့ အနည်းငယ်သော ကိစ္စများမှလွဲ၍ နေ့စဉ် မသုံးရပါ။ |
| **IAM Users** | Individual People | ဝန်ထမ်းတစ်ဦးစီအတွက် ဖန်တီးထားသော အကောင့် (Console Password သို့မဟုတ် CLI Access Keys)။ |
| **IAM User Groups** | Collections of Users | ဌာနအလိုက် (ဥပမာ- `Developers`, `DevOps`, `Finance`) အခွင့်အရေးများကို အစုလိုက် ပေးအပ်ရန် သုံးသည်။ |
| **IAM Roles** | Temporary Personas | လူတစ်ဦးအတွက် မဟုတ်ဘဲ **AWS Services (EC2, Lambda) သို့မဟုတ် External Identity များအတွက် ယာယီ Credentials ထုတ်ပေးခြင်း**။ |
| **IAM Policies (JSON)** | Permission Documents | မည်သည့် Action ကို မည်သည့် Resource ပေါ်တွင် ခွင့်ပြု/ငြင်းပယ်သည်ကို ရေးသားထားသော JSON စာရွက်စာတမ်း ဖြစ်သည်။ |
| **Permissions Boundary** | Maximum Ceiling | IAM User သို့မဟုတ် Role တစ်ခု တိုးမြှင့်ရယူနိုင်သော အမြင့်ဆုံး အခွင့်အာဏာကို ကန့်သတ်ထားသော မျက်နှာကျက် ဖြစ်သည်။ |
| **AWS STS** | Security Token Service | IAM Role assume လုပ်ချိန်တွင် အချိန်အကန့်အသတ်ရှိသော ယာယီ Security Credentials (Token) ထုတ်ပေးသည်။ |

---

## 3. Architecture (Diagram & Policy Evaluation Logic)

AWS တွင် မည်သည့် API Request မဆို အောက်ပါ **Policy Evaluation Flow** အတိုင်း စစ်ဆေးပါသည်:

```
                          [ Incoming AWS API Request ]
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │ 1. Is there an EXPLICIT DENY?     │ ──YES──► [ ❌ ACCESS DENIED ]
                     └─────────────────┬─────────────────┘
                                       │ NO
                                       ▼
                     ┌───────────────────────────────────┐
                     │ 2. Is there an EXPLICIT ALLOW?    │ ──NO───► [ ❌ ACCESS DENIED ]
                     └─────────────────┬─────────────────┘          (Implicit Deny)
                                       │ YES
                                       ▼
                     ┌───────────────────────────────────┐
                     │ 3. Check SCPs / Permission Bounds │ ──FAIL─► [ ❌ ACCESS DENIED ]
                     └─────────────────┬─────────────────┘
                                       │ PASS
                                       ▼
                             [ ✅ ACCESS GRANTED ]
```

---

## 4. How it works (JSON Policy Structure ရှင်းလင်းချက်)

IAM Policy တိုင်းသည် အောက်ပါ JSON အစိတ်အပိုင်း ၅ ခုဖြင့် ဖွဲ့စည်းထားပါသည်:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnlyProduction",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::production-assets-bucket",
        "arn:aws:s3:::production-assets-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```
- **Effect:** `Allow` သို့မဟုတ် `Deny`။
- **Action:** ခွင့်ပြုမည့် API စာရင်း (ဥပမာ- `s3:GetObject`)။
- **Resource:** သက်ရောက်မည့် AWS Resource ၏ ARN (Amazon Resource Name)။
- **Condition:** လိုအပ်သော စည်းကမ်းချက် (ဥပမာ- MFA ဖွင့်ထားမှသာ ခွင့်ပြုမည်)။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **EC2 Instance Profile:** EC2 Server ပေါ်တွင် Application ရေးသားရာ၌ Access Key ID နှင့် Secret Key များကို Code ထဲတွင် Hardcode မထည့်ဘဲ **IAM Role** ချိတ်ဆက်ပေးခြင်း။
- **Cross-Account Access:** ကုမ္ပဏီ၏ Development Account မှ Production Account ရှိ S3 Bucket သို့ STS AssumeRole ဖြင့် ယာယီ ခွင့်ပြုချက် ရယူခြင်း။
- **Federated Single Sign-On (SSO):** ဝန်ထမ်းများသည် Google Workspace သို့မဟုတ် Microsoft Entra ID (Azure AD) အကောင့်ဖြင့် AWS Console သို့ တိုက်ရိုက် Login ဝင်ရောက်ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **100% Free of Charge:** IAM ဝန်ဆောင်မှု အသုံးပြုခြင်းအတွက် မည်သည့် ငွေကြေးမျှ ပေးဆောင်ရန် မလိုပါ။
- Global Consistency (Region ရွေးချယ်ရန် မလိုဘဲ ကမ္ဘာတစ်ဝန်း တစ်ပြေးညီ အလုပ်လုပ်သည်)။
- Granular Permission Control (Resource ARN နှင့် IP Condition များအထိ တိကျစွာ ကန့်သတ်နိုင်ခြင်း)။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- ရှုပ်ထွေးသော Multi-Account ပတ်ဝန်းကျင်တွင် Policy များ ပေါင်းစပ်မှုကို နားလည်ရန် ဂရုစိုက်ရမည်။

---

## 7. Comparison: IAM Role vs IAM User

| Feature | IAM User | IAM Role |
| :--- | :--- | :--- |
| **Credentials** | Long-term Password & Access Keys | **Short-term Temporary Credentials (STS)** |
| **Intended For** | လူပုဂ္ဂိုလ် (Individual Humans) | **AWS Services (EC2, Lambda) & External Apps** |
| **Security Risk** | Access Keys ပေါက်ကြားပါက အန္တရာယ်ရှိသည် | **Credentials သက်တမ်းကုန်သဖြင့် အလွန်လုံခြုံသည်** |
| **Best Practice** | အတတ်နိုင်ဆုံး လျှော့သုံးရမည် | **အမြဲတမ်း ဦးစားပေး အသုံးပြုရမည်** |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: EC2 အတွက် IAM Role တည်ဆောက်ခြင်း
```bash
aws iam create-role \
    --role-name "EC2-S3-ReadOnly-Role" \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "ec2.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }'
```

### Step 2: Managed Policy ကို Role သို့ Attach လုပ်ခြင်း
```bash
aws iam attach-role-policy \
    --role-name "EC2-S3-ReadOnly-Role" \
    --policy-arn "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
```

### Step 3: Instance Profile ဆောက်ပြီး EC2 သို့ ချိတ်ဆက်ခြင်း
```bash
aws iam create-instance-profile --instance-profile-name "EC2-S3-Profile"
aws iam add-role-to-instance-profile --instance-profile-name "EC2-S3-Profile" --role-name "EC2-S3-ReadOnly-Role"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** Root User တွင် Hardware MFA ဖွင့်၍ Access Key လုံးဝ မထုတ်ရန်၊ Password Policy တင်းကျပ်ရန်၊ IAM Roles ကို ဦးစားပေးသုံးရန်။
- **Monitoring:** **IAM Credential Report** (ရက် ၉၀ ကျော်သော အသုံးမပြုသည့် Keys များကို စစ်ဆေးခြင်း), **IAM Access Analyzer** (အပြင်သို့ ပေါက်ကြားခွင့်ပြုထားသော S3/KMS များကို ရှာဖွေခြင်း)။
- **Cost:** **အခမဲ့ (Free Service)** ဖြစ်ပါသည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Explicit Deny Always Wins:** မည်မျှပင် Allow Policy များ ပေးထားပါစေ၊ မည်သည့်နေရာတွင်မဆို **Explicit Deny** တစ်ခု ရှိနေပါက Access Denied ချက်ချင်း ဖြစ်သွားသည်။
> 2. **Never Store AWS Credentials on EC2:** EC2 Instance ပေါ်တွင် Application က S3 ကို ခေါ်ယူရန်အတွက် `~/.aws/credentials` ဖိုင်ထဲတွင် Hardcoded Keys လုံးဝ မထည့်ရပါ! အမြဲတမ်း **IAM Role (Instance Profile)** ချိတ်ဆက်ပေးရပါမည်။
> 3. **Service Control Policies (SCPs):** AWS Organizations ရှိ Member Account ၏ Root User အပါအဝင် မည်သူမျှ မကျော်လွှားနိုင်အောင် အမြင့်ဆုံး အခွင့်အာဏာကို ကန့်သတ်ရန် **SCP** ကို သုံးရမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
EC2 Instance တစ်ခုပေါ်တွင် run နေသော Node.js Application သည် S3 Bucket တစ်ခုအတွင်းသို့ ဓာတ်ပုံများ Upload တင်ရန် လိုအပ်သည်။ လုံခြုံရေး အကောင်းဆုံးဖြစ်ပြီး Key Management ဝန်ထုပ်ဝန်ပိုး မရှိစေမည့် နည်းလမ်းမှာ အဘယ်နည်း?

- A) IAM User အသစ်ဆောက်၍ Access Key ID နှင့် Secret Key ကို EC2 Code ထဲတွင် ရေးထည့်မည်။
- B) S3 Write Permission ပါဝင်သော IAM Role တစ်ခု ဖန်တီး၍ EC2 Instance Profile အဖြစ် ချိတ်ဆက်ပေးမည်။
- C) S3 Bucket ကို Public ဖွင့်ပေးမည်။
- D) EC2 ၏ Root user password ဖြင့် S3 ကို ခေါ်မည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** EC2 Instances များမှ AWS Services များကို ခေါ်ယူရန်အတွက် အကောင်းဆုံး Security Best Practice မှာ **IAM Role (Instance Profile)** ဖြစ်ပါသည်။ AWS STS မှ ယာယီ Credentials အလိုအလျောက် ထုတ်ပေးပြီး Rotate ပြုလုပ်ပေးသဖြင့် Long-term Keys များ ပေါက်ကြားနိုင်ခြေ လုံးဝ မရှိပါ။
</details>
