---
title: "၅။ Security Scanning & Lifecycle Policies"
description: "ECR Image Scanning (Basic vs Enhanced Inspector), Tag Immutability, Lifecycle Policy ဖြင့် Storage စရိတ်လျှော့ချခြင်း နှင့် Cross-Region Replication"
---

# ၅။ Security Scanning & Lifecycle Policies

## ECR Image Scanning (လုံခြုံရေး အားနည်းချက် စစ်ဆေးခြင်း)

Docker Image များတွင် OS Packages များနှင့် Third-party Libraries များ ပါဝင်သောကြောင့် လုံခြုံရေး အားနည်းချက်များ (Common Vulnerabilities and Exposures - CVE) ပါရှိနေတတ်ပါသည်။ ECR တွင် Scanning အမျိုးအစား ၂ မျိုး ပေးအပ်ထားပါသည်:

| အချက်အလက် | Basic Scanning | Enhanced Scanning (Recommended) |
| :--- | :--- | :--- |
| **စစ်ဆေးပေးသော Engine** | Open-source Clair Engine | **Amazon Inspector Engine** |
| **စစ်ဆေးသည့် အရာများ** | Linux OS Packages (Alpine, Debian, Ubuntu) | **OS Packages အပြင် Programming Language Packages (npm, pip, composer, maven, gem)** |
| **စစ်ဆေးသည့် အချိန်** | Push တင်ချိန် (Scan on push) သို့မဟုတ် Manual | **Push တင်ချိန်အပြင် CVE အသစ် ထွက်လာတိုင်း အချိန်နှင့်တစ်ပြေးညီ အမြဲတမ်း စစ်ဆေးပေးသည် (Continuous)** |
| **စရိတ်** | **အခမဲ့ (Free)** | Amazon Inspector စရိတ် အနည်းငယ် ကျသင့်သည် |

---

## Image Tag Immutability (Overwrite မခံရအောင် ကာကွယ်ခြင်း)

Production စနစ်များတွင် **Tag Immutability (တံဆိပ် ပြန်မပြင်နိုင်သော စည်းမျဉ်း)** ကို မဖြစ်မနေ ဖွင့်ထားရပါမည်:
- **ပြဿနာ:** အကယ်၍ Immutability ပိတ်ထားပါက မသမာသူ သို့မဟုတ် Developer အမှားကြောင့် `my-app:1.0.0` ကို အခြား Code အသစ်ဖြင့် ထပ်မံ Push တင်လိုက်သောအခါ မူလ Version အဟောင်း ပျက်စီးသွားမည် ဖြစ်သည်။
- **ကာကွယ်မှု:** Tag Immutability ဖွင့်ထားပါက ရှိပြီးသား Tag အမည်တူဖြင့် နောက်တစ်ကြိမ် Push တင်ရန် ကြိုးစားပါက ECR က ချက်ချင်း ငြင်းပယ်ပါမည် (`ImageAlreadyExistsException`)။

```bash
# Repository တွင် Tag Immutability ဖွင့်ခြင်း
aws ecr put-image-tag-mutability \
    --repository-name "my-web-app" \
    --image-tag-mutability IMMUTABLE \
    --region us-east-1
```

---

## Lifecycle Policies (သန့်ရှင်းရေး မူဝါဒဖြင့် Storage စရိတ် လျှော့ချခြင်း)

CI/CD Pipeline က Code ပြင်တိုင်း Image အသစ်များ ဆက်တိုက် တည်ဆောက်ပါက ရက်ပိုင်းအတွင်း ECR Storage သည် Gigabytes ရာနှင့်ချီ ပြည့်သွားပြီး စရိတ်များ တက်လာပါမည်။
ထိုပြဿနာကို ဖြေရှင်းရန် **Lifecycle Policy** ဖြင့် စည်းမျဉ်းသတ်မှတ်ရပါမည်:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images older than 14 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 14
      },
      "action": {
        "type": "expire"
      }
    },
    {
      "rulePriority": 2,
      "description": "Keep only the latest 20 production images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["v", "release"],
        "countType": "imageCountMoreThan",
        "countNumber": 20
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

### စည်းမျဉ်း ၂ ခု၏ အကျိုးသက်ရောက်မှု:
- **Rule 1:** Tag မပါတော့သော အစအန Image (Untagged dangling images) များကို ၁၄ ရက်ပြည့်ပါက အလိုအလျောက် ဖျက်ပစ်သည်။
- **Rule 2:** Production Releases များအတွက် နောက်ဆုံးထွက် ၂၀ ခုကိုသာ သိမ်းထားပြီး အဟောင်းများကို အလိုအလျောက် ရှင်းလင်းပေးသည်။

---

## Cross-Region & Cross-Account Replication

လုပ်ငန်းကြီးများတွင် Global Low-Latency ရရှိစေရန် သို့မဟုတ် Disaster Recovery (DR) အတွက် Image တစ်ခုကို `us-east-1` တွင် Push တင်လိုက်သည်နှင့် `ap-southeast-1` (Singapore) သို့ အလိုအလျောက် ကူးယူပေးစေနိုင်ပါသည်:

- Registry Settings တွင် Replication Configuration သတ်မှတ်ထားရုံဖြင့် AWS က နောက်ကွယ်မှ အလိုအလျောက် Sync ပြုလုပ်ပေးသည်။
- ဒေသတွင်း ECS/EKS မှ Image ဆွဲယူရာတွင် Latency အလွန်မြန်ဆန်ပြီး Cross-region Data Transfer စရိတ်ကို သက်သာစေပါသည်။
