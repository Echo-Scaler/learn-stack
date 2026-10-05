---
title: "၀၈။ Level 8 — Production Observability, Auditing & Security"
description: "Amazon CloudWatch သည် AWS ပေါ်တွင် Run နေသော Resources များနှင့် Application များ၏ ကျန်းမာရေး၊ Performance Metrics၊ Logs နှင့် Alarms များကို တစ်နေရာတည်းတွင် ဗဟ"
---

## ၀၈။ Level 8 — Production Observability, Auditing & Security

---

## ၈.၁ Amazon CloudWatch

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Amazon CloudWatch သည် AWS ပေါ်တွင် Run နေသော Resources များနှင့် Application များ၏ ကျန်းမာရေး၊ Performance Metrics၊ Logs နှင့် Alarms များကို တစ်နေရာတည်းတွင် ဗဟိုပြု စောင့်ကြည့်စီမံပေးသော **Full-Stack Observability Platform** ဖြစ်သည်။

### ၂. အဓိက အစိတ်အပိုင်း ၄ မျိုး:
1. **CloudWatch Metrics:** ကိန်းဂဏန်းများ (CPUUtilization, DiskReadOps, NetworkIn, ALB 5XXErrorCount, TargetResponseTime)။
2. **CloudWatch Logs:** Application Logs (Nginx access/error log, Laravel `laravel.log`, ECS container stdout/stderr)။
3. **CloudWatch Alarms:** သတ်မှတ်ချက် ကျော်လွန်ပါက (ဥပမာ- CPU > 85% for 5 mins) Slack သို့မဟုတ် PagerDuty သို့ Alert ပို့ပေးခြင်း။
4. **CloudWatch Logs Insights:** Terabytes ရှိသော Log များအတွင်း SQL ကဲ့သို့ Query ရေး၍ စက္ကန့်ပိုင်းအတွင်း Error ရှာဖွေခြင်း:

```sql
fields @timestamp, @message
| filter @message like /Exception/ or @message like /SQLSTATE/
| parse @message "* [*] *" as date, level, error_msg
| sort @timestamp desc
| limit 50
```

---

## ၈.၂ AWS CloudTrail

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
AWS CloudTrail သည် AWS Account အတွင်း မည်သူက (Who)၊ မည်သည့်အချိန်တွင် (When)၊ မည်သည့် Service ကို (What Action)၊ မည်သည့် IP လိပ်စာမှတစ်ဆင့် (Where) API Call ခေါ်ယူခဲ့သည်ကို စုံစမ်းမှတ်တမ်းတင်ပေးသော **Audit & Governance Compliance Service** ဖြစ်သည်။

### ၂. Production Incident Investigation Scenario (障害調査):
- **အရေးပေါ် အခြေအနေ:** Production RDS Database တစ်လုံး မနက် ၂ နာရီတွင် အလိုအလျောက် ရုတ်တရက် Delete ဖြစ်သွားသည်။
- **စုံစမ်းနည်း:** CloudTrail Console -> **Event history** သို့ သွားပါ။
- **CLI Query:**
```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteDBInstance \
  --query "Events[*].[EventTime,Username,SourceIPAddress,CloudTrailEvent]" \
  --output table
```
- ထိုအခါ မည်သည့် IAM User (သို့မဟုတ် Leak ဖြစ်သွားသော Access Key) က မည်သည့် IP လိပ်စာမှတစ်ဆင့် ဖျက်လိုက်သည်ကို အတိအကျ သက်သေအထောက်အထား ထုတ်ယူနိုင်သည်။

---

## ၈.၃ AWS Systems Manager (SSM)

### Session Manager ဖြင့် Secure EC2 Remote Access (No SSH Port 22):
ဂျပန် Cloud လုပ်ငန်းခွင်တွင် EC2 Instance များအတွက် **Inbound Port 22 (SSH) ကို Security Group တွင် လုံးဝ (0.0.0.0/0) ပိတ်ထားရမည်** ဖြစ်သည်။

```
[ Traditional SSH ]
  Internet ---- Inbound Port 22 (Open) ----> EC2 (Brute Force Attack & Key Leakage Risk)

[ AWS SSM Session Manager ]
  Developer Browser / CLI ---- (HTTPS Port 443 Encrypted AWS API) ----> SSM Agent ----> EC2 Terminal
  (Inbound Port 22 လုံးဝ ဖွင့်စရာမလိုဘဲ Console သို့မဟုတ် CLI မှတစ်ဆင့် Terminal Screen ကို Secure ဝင်ရောက်နိုင်သည်)
```

### CLI Command ဖြင့် EC2 ဝင်ရောက်ပုံ:
```bash
aws ssm start-session --target i-0123456789abcdef0
```

---

## ၈.၄ AWS Secrets Manager & AWS KMS

### ၁. AWS Secrets Manager:
- Database Passwords, API Keys များကို Code ထဲတွင် Plain Text မထားဘဲ Secrets Manager တွင် သိမ်းဆည်းထားသည်။
- Password များကို ၃၀ ရက်တစ်ကြိမ် Lambda Function ဖြင့် အလိုအလျောက် Auto-rotate ပြုလုပ်ပေးနိုင်သည်။

### ၂. AWS KMS (Key Management Service) & Envelope Encryption:
- Hardware Security Module (HSM) ဖြင့် စစ်ဆေးကာ **AES-256 Bit Encryption** ပြုလုပ်ပေးသည်။
- **Customer Managed Key (CMK):** ကုမ္ပဏီက Key Rotation နှင့် Policy ကို ကိုယ်တိုင် စီမံခန့်ခွဲနိုင်သော သီးသန့် Key။
- **AWS Managed Key (`aws/s3`, `aws/rds`):** AWS က Free of charge အလိုအလျောက် ထိန်းသိမ်းပေးသော Default Key။

---

## ၈.၅ AWS WAF & Enterprise Security Services

| Service | တာဝန်နှင့် အဓိက ဖြေရှင်းပေးသည့် ပြဿနာ |
| :--- | :--- |
| **AWS WAF** | ALB နှင့် CloudFront ရှေ့တွင် ကာရံထားပြီး SQL Injection, XSS, DDoS Attack များကို စစ်ဆေး Block ပေးခြင်း။ |
| **Amazon GuardDuty** | AI/Machine Learning သုံး၍ VPC Flow Logs, DNS Logs များကို Scan ဖတ်ကာ EC2 ထဲတွင် Crypto Mining လုပ်နေခြင်း သို့မဟုတ် အန္တရာယ်ရှိသော Hacker IP များကို ထောက်လှမ်းပေးခြင်း။ |
| **AWS Security Hub** | AWS Security Best Practices (CIS Benchmarks) များနှင့် ကိုက်ညီမှု ရှိမရှိ ဗဟိုမှ အဆင့်သတ်မှတ် ပြသပေးသော စနစ်။ |
| **Amazon Inspector** | EC2, ECR Docker Images နှင့် Lambda Code များကို အလိုအလျောက် Scan ဖတ်၍ CVE Vulnerabilities ရှာဖွေပေးခြင်း။ |

---

## ၈.၆ Hands-on Exercise: CloudWatch Alarm တပ်ဆင်ခြင်း

```bash
# EC2 CPU 80% ကျော်ပါက Alert ပေးသော CloudWatch Alarm ဖန်တီးခြင်း
aws cloudwatch put-metric-alarm \
  --alarm-name "High-CPU-Utilization-Alert" \
  --alarm-description "Alert when CPU exceeds 80% for 5 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:ap-northeast-1:123456789012:slack-alert-topic
```

---
*နောက်အခန်းသို့ သွားရန်:* [09_Level9_Terraform_CICD_GitHubActions.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/09_Level9_Terraform_CICD_GitHubActions.md)
