---
title: "၂။ Components & Authentication"
description: "Private vs Public ECR၊ ECR Registry Components၊ Docker Login Authentication (12-hour token) နှင့် Cross-Account Repository Policies"
---

# ၂။ Components & Authentication

## Private ECR vs Public ECR

Amazon ECR တွင် Registry အမျိုးအစား ၂ မျိုး ရှိပါသည်:

| အချက်အလက် | Amazon ECR Private | Amazon ECR Public (Gallery) |
| :--- | :--- | :--- |
| **URL Format** | `<aws_account_id>.dkr.ecr.<region>.amazonaws.com` | `public.ecr.aws/<alias>/<repo>` |
| **ဝင်ရောက်ခွင့် (Access)** | **သီးသန့် (Private)** - AWS IAM အထောက်အထား မဖြစ်မနေ လိုအပ်သည် | **အများပြည်သူ (Public)** - မည်သူမဆို authentication မလိုဘဲ pull ဆွဲနိုင်သည် |
| **အကောင်းဆုံး Use Case** | လုပ်ငန်းတွင်း Proprietary Application Code, POS API, Database Images | Open-source Projects, Base Images များကို ကမ္ဘာတစ်ဝှမ်း မျှဝေခြင်း |
| **Data Transfer Free Tier** | တူညီသော Region အတွင်း ECS/EKS ဆီသို့ Transfer အခမဲ့ | အင်တာနက်သို့ တစ်လလျှင် 50GB အထိ အခမဲ့ |

---

## ECR အဓိက အစိတ်အပိုင်းများ (Key Components)

1. **Private Registry:** AWS Account နှင့် Region တစ်ခုစီတွင် သီးသန့် Default ပါရှိပြီး Repositories များကို စုစည်းထားသည်။
2. **Repository:** Microservice တစ်ခုချင်းစီအတွက် Image များကို ခွဲခြားသိမ်းဆည်းရာနေရာ (ဥပမာ- `pos-order-service`, `pos-payment-service`)။
3. **Repository Policy (Resource-based Policy):** မည်သည့် AWS Account သို့မဟုတ် IAM User က ဤ Repository ထဲသို့ Image Push သို့မဟုတ် Pull လုပ်ခွင့်ရှိသည်ကို ခွင့်ပြုသော JSON Policy။
4. **Lifecycle Policy:** သတ်မှတ်ရက် ကျော်လွန်သွားသော သို့မဟုတ် Untagged ဖြစ်နေသော Image အဟောင်းများကို အလိုအလျောက် ဖျက်ပစ်စေသည့် သန့်ရှင်းရေး မူဝါဒ။
5. **Image Scanning:** Common Vulnerabilities and Exposures (CVE) လုံခြုံရေး အားနည်းချက်များကို အလိုအလျောက် ရှာဖွေစစ်ဆေးပေးသည့် စနစ်။

---

## Docker CLI အား ECR ဖြင့် Authentication ပြုလုပ်ပုံ (၁၂ နာရီ Token)

Docker CLI သည် AWS IAM Credential ကို တိုက်ရိုက် နားမလည်ပါ။ ထို့ကြောင့် **AWS CLI ဖြင့် ယာယီ Auth Token (၁၂ နာရီ သက်တမ်းရှိသော Password)** ကို ရယူပြီး Docker CLI ထံသို့ ပေးပို့ရပါသည်:

```bash
# ECR သို့ Docker Login ဝင်ရောက်ခြင်း (Standard Command)
aws ecr get-login-password --region us-east-1 | docker login \
    --username AWS \
    --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
```

### Command အဆင့်ဆင့် ရှင်းလင်းချက်:
- `aws ecr get-login-password`: AWS IAM Credential ကို စစ်ဆေးပြီး ၁၂ နာရီ သက်တမ်းရှိသော လျှို့ဝှက် Authorization Token တစ်ခု ထုတ်ပေးသည်။
- `|` (Pipe): ထို Token ကို နောက် command သို့ ပေးပို့သည်။
- `docker login --username AWS`: ECR အတွက် Username သည် အမြဲတမ်း **`AWS`** ဖြစ်ရပါမည်။
- `--password-stdin`: Token ကို stdin မှတစ်ဆင့် လုံခြုံစွာ လက်ခံသည်။
- `123456789012.dkr.ecr.us-east-1.amazonaws.com`: မိမိ၏ သီးသန့် ECR Registry URI ဖြစ်သည်။

> **သတိပြုရန်:** ဤ Auth Token သည် **၁၂ နာရီ (12 Hours)** သာ သက်တမ်းရှိသဖြင့် ၁၂ နာရီ ကျော်လွန်သွားပါက နောက်တစ်ကြိမ် login ပြန်ဝင်ရပါမည်။

---

## Cross-Account ECR Access (Repository Policy)

လုပ်ငန်းကြီးများတွင် Development Account (Account A: `111111111111`) ရှိ ECR Image ကို Production Account (Account B: `222222222222`) ရှိ ECS/EKS မှ လှမ်းဆွဲသုံးလိုသည့်အခါ **ECR Repository Policy** ကို အသုံးပြုရပါသည်:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCrossAccountPull",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::222222222222:root"
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  ]
}
```

ဤနည်းအားဖြင့် Image ကို Account အသစ်တွင် ပြန်လည် Upload လုပ်စရာ မလိုဘဲ အခြား Account မှ လုံခြုံစွာ တိုက်ရိုက် ဆွဲယူ အသုံးပြုနိုင်ပါသည်။
