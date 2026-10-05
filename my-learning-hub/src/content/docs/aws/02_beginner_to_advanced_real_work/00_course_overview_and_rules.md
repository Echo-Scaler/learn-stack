---
title: "၀၀။ သင်ရိုးညွှန်းတမ်း၏ အဓိကရည်ရွယ်ချက်နှင့် စည်းမျဉ်းများ (Course Overview & Rules)"
description: "ဒီ Course ၏ အဓိကရည်ရွယ်ချက်မှာ AWS service များကို အလွတ်ကျက်မှတ်ရုံမျှသာ မဟုတ်ဘဲ Japan ရှိ Cloud / Web Application Development လုပ်ငန်းခွင် (現場 - Genba) တွင် တက"
---

## ၀၀။ သင်ရိုးညွှန်းတမ်း၏ အဓိကရည်ရွယ်ချက်နှင့် စည်းမျဉ်းများ (Course Overview & Rules)

## ၀.၁ Course ရဲ့ အဓိကရည်ရွယ်ချက် (Course Mission)
ဒီ Course ၏ အဓိကရည်ရွယ်ချက်မှာ AWS service များကို အလွတ်ကျက်မှတ်ရုံမျှသာ မဟုတ်ဘဲ **Japan ရှိ Cloud / Web Application Development လုပ်ငန်းခွင် (現場 - Genba) တွင် တကယ်အသုံးများသည့် AWS Architecture, Service Configurations, Command-line (CLI), Automation (Terraform), Security Best Practices, Troubleshooting (障害対応) နှင့် နေ့စဉ် Operation လုပ်ငန်းစဉ်များ** ကို Beginner အဆင့်မှ Senior Architect အဆင့်အထိ နားလည်ပြီး လက်တွေ့လုပ်ဆောင်နိုင်စေရန် ဖြစ်သည်။

သင်ကြားမှုအားလုံးကို **မြန်မာဘာသာ** ဖြင့် ရှင်းပြထားပြီး AWS Official English Terminology နှင့် ဂျပန် IT 現場 Terminology များကို မူရင်းအတိုင်း တိကျစွာ ပေါင်းစပ်ရှင်းပြထားသည်။

---

## ၀.၂ သင်ကြားပုံ အခြေခံစည်းမျဉ်း (Systematic Teaching Blueprint)
Topic နှင့် Service တိုင်းအတွက် အောက်ပါ standard ၁၆ ချက် formula အတိုင်း စနစ်တကျ လေ့လာသင်ယူပါမည်-
1. **ဒီ Service/Concept က ဘာလဲ?** (Concept & Definition)
2. **ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ?** (Problem Statement & Real-world Example)
3. **Japan Cloud/Web Development Company တွေမှာ ဘာကြောင့် သုံးကြတာလဲ?** (Market Context & 現場での採用理由)
4. **ဘယ်အချိန်မှာ သုံးသင့်ပြီး ဘယ်အချိန်မှာ မသုံးသင့်ဘူးလဲ?** (When to Use & When NOT to Use)
5. **Architecture Diagram တွင် မည်သည့်နေရာတွင် ပါဝင်သလဲ?** (Architectural Placement)
6. **အခြား မည်သည့် Service များနှင့် တွဲဖက်အလုပ်လုပ်သလဲ?** (Ecosystem Integration)
7. **AWS Management Console တွင် မည်သို့ Step-by-Step တည်ဆောက်မလဲ?** (Console Steps)
8. **AWS CLI Commands များသည် အဘယ်နည်း?** (CLI Commands with flags & outputs)
9. **Terraform (Infrastructure as Code) ဖြင့် မည်သို့ရေးမလဲ?** (Production Terraform Snippet)
10. **Security & Least Privilege ကို မည်သို့စိစစ်မလဲ?** (Security Best Practice)
11. **Cost (ငွေကြေးကုန်ကျမှု) မည်သို့ဖြစ်လာနိုင်သလဲ?** (Pricing & FinOps)
12. **Monitoring & Logging မည်သို့လုပ်မလဲ?** (CloudWatch & Audit)
13. **Error တက်လာလျှင် မည်သို့ Root Cause ရှာပြီး ဖြေရှင်းမလဲ?** (Troubleshooting Steps)
14. **Production တွင် နေ့စဉ် မည်သို့ Run ရမလဲ?** (Operations Runbook)
15. **Interview မေးခွန်းများနှင့် အဖြေများ** (Technical Interview Prep)
16. **လက်တွေ့ Hands-on Exercise & Verification** (Validation Steps)

---

## ၀.၃ Japan Cloud Industry Target & Priority Services

ဂျပန် IT လုပ်ငန်းခွင် (SIer - System Integrator ကုမ္ပဏီများနှင့် Web/SaaS 自社開発 Startup များ) တွင် AWS Services များကို တန်းတူအသုံးပြုခြင်း မဟုတ်ပါ။ အောက်ပါအတိုင်း အဆင့်ခွဲခြား ဦးစားပေး သင်ယူရမည်-

```
+-------------------------------------------------------------------------------+
|                      HIGH PRIORITY (မဖြစ်မနေ ကျွမ်းကျင်ရမည်)                       |
| IAM | VPC | EC2 | ALB | Route 53 | ACM | S3 | CloudFront | RDS / Aurora           |
| CloudWatch | CloudTrail | Systems Manager (SSM) | ECR | ECS (Fargate)         |
| Lambda | API Gateway | SQS | SNS | EventBridge | Secrets Manager | KMS         |
| ElastiCache (Redis) | WAF | AWS Backup | Auto Scaling | Cost Explorer         |
+-------------------------------------------------------------------------------+
|                   IMPORTANT NEXT LEVEL (ပိုမိုအဆင့်မြင့်သော Feature များ)           |
| DynamoDB | Step Functions | Cognito | SES | EFS | OpenSearch | AWS Batch       |
| AWS Config | GuardDuty | Security Hub | Inspector | VPC Endpoint / PrivateLink |
+-------------------------------------------------------------------------------+
|               ADVANCED & ARCHITECTURE LEVEL (ခေါင်းဆောင်/Architect အဆင့်)        |
| Multi-AZ / Multi-Region Architecture | Disaster Recovery (RPO/RTO)            |
| Blue/Green & Canary Deployments | Event-Driven & Microservices                 |
| Terraform (IaC) | CI/CD (GitHub Actions / CodePipeline) | Well-Architected     |
+-------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ သွားရန်:* [01_Level1_Cloud_Fundamentals_and_Networking.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/01_Level1_Cloud_Fundamentals_and_Networking.md)
