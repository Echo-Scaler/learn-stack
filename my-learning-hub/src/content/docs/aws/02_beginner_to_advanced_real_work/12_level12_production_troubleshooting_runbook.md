---
title: "၁၂။ Level 12 — Production Troubleshooting Runbook (障害対応マニュアル)"
description: "ဂျပန် IT Cloud လုပ်ငန်းခွင် (本番障害対応 - Production Incidents) တွင် အဖြစ်အများဆုံး Critical Incidents ၅ မျိုးနှင့် ၎င်းတို့ကို အဆင့်ဆင့် စုံစမ်းစစ်ဆေး ဖြေရှင်းရမည့"
---

## ၁၂။ Level 12 — Production Troubleshooting Runbook (障害対応マニュアル)

ဂျပန် IT Cloud လုပ်ငန်းခွင် (本番障害対応 - Production Incidents) တွင် အဖြစ်အများဆုံး Critical Incidents ၅ မျိုးနှင့် ၎င်းတို့ကို အဆင့်ဆင့် စုံစမ်းစစ်ဆေး ဖြေရှင်းရမည့် Standard Operating Procedures (SOP):

---

## Scenario 1: Website Downtime (アクセス不可・接続タイムアウト)

### ၁. ပြဿနာ လက္ခဏာ:
User များ Browser တွင် `https://example.com` ဟု ရိုက်ထည့်သော်လည်း `ERR_CONNECTION_TIMED_OUT` တက်ပြီး ဝက်ဘ်ဆိုက် လုံးဝ ပွင့်မလာခြင်း။

### ၂. အဆင့်ဆင့် စစ်ဆေးရမည့် Flowchart:
```
[ Step 1: DNS စစ်ဆေးခြင်း ]
  dig +trace example.com
  (Route 53 မှ IP သို့မဟုတ် CloudFront/ALB DNS မှန်ကန်စွာ ထွက်မထွက် စစ်ပါ)
          |
          v (DNS မှန်ကန်သည်)
[ Step 2: CloudFront & AWS WAF စစ်ဆေးခြင်း ]
  - AWS WAF Blocked Requests Graph တွင် User ၏ IP အား Block ခံထားရခြင်း ရှိမရှိ စစ်ပါ။
          |
          v (Block မရှိပါ)
[ Step 3: ALB & Security Group စစ်ဆေးခြင်း ]
  - ALB Security Group တွင် Inbound Port 80/443 ပွင့်မပွင့် စစ်ပါ။
  - ALB Target Group ရှိ Targets များ Healthy ဖြစ်မဖြစ် စစ်ပါ။
          |
          v (Unhealthy ဖြစ်နေပါက)
[ Step 4: EC2/ECS Target Health စစ်ဆေးခြင်း ]
  - EC2/Container Security Group တွင် ALB မှ လာသော Inbound Traffic ခွင့်ပြုထားခြင်း ရှိမရှိ စစ်ပါ။
  - Target Server အတွင်း Nginx/PHP-FPM Process သေမသေ စစ်ဆေးပါ။
```

### ၃. Diagnostic Commands:
```bash
# DNS Resolution စစ်ဆေးခြင်း
dig example.com +short

# ALB Target Group Health အခြေအနေ စစ်ဆေးခြင်း
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/prod-web-tg/abcdef

# ECS Service Events တွင် Container Crash ဖြစ်မဖြစ် စစ်ဆေးခြင်း
aws ecs describe-services \
  --cluster prod-fargate-cluster \
  --services laravel-web-service \
  --query "services[0].events[0:5].message"
```

---

## Scenario 2: HTTP 502 Bad Gateway

### ၁. ပြဿနာ လက္ခဏာ:
Browser တွင် `502 Bad Gateway` Error ချက်ချင်း တက်လာခြင်း (ALB ထံသို့ ရောက်သော်လည်း နောက်ကွယ်ရှိ Server က Response မပေးနိုင်ခြင်း)။

### ၂. အဖြစ်များဆုံး အကြောင်းအရင်း ၃ ချက်နှင့် ဖြေရှင်းနည်း:
1. **Target Server ပေါ်ရှိ Web Process (Nginx/Node.js) ရပ်တန့်နေခြင်း:**
   - စစ်ဆေးနည်း: `sudo systemctl status nginx` သို့မဟုတ် Container Exit Code ကို ကြည့်ပါ။
   - ဖြေရှင်းနည်း: Process ကို Restart လုပ်ပါ (`sudo systemctl restart nginx`)။
2. **Health Check Path မှားယွင်းနေခြင်း:**
   - ALB Health Check Path ကို `/` ဟု ထားထားသော်လည်း Laravel App က Route မရှိသဖြင့် `404 Not Found` ပြန်ပေးနေသည့်အခါ ALB က ထို Server အား Unhealthy အဖြစ် သတ်မှတ်ပြီး 502 ပြန်ပေးသည်။
   - ဖြေရှင်းနည်း: ALB Health Check Path ကို Application အမှန်တကယ် Return `200 OK` ပေးသော `/healthz` သို့ ပြောင်းလဲပါ။
3. **Application Timeout ဖြစ်သွားခြင်း:**
   - Database Query ကြာနေသဖြင့် ALB ၏ Idle Timeout (60s) ကျော်သွားခြင်း။ Nginx `fastcgi_read_timeout 300;` ညှိပေးရန် လိုသည်။

---

## Scenario 3: Database Connection Error (DB接続エラー)

### ၁. ပြဿနာ လက္ခဏာ:
Website တွင် `SQLSTATE[HY000] [2002] Connection refused` သို့မဟုတ် `Connection timed out` တက်နေခြင်း။

### ၂. စစ်ဆေးရမည့် Checklists (現場手順):
1. **RDS Status စစ်ဆေးခြင်း:**  
   RDS Console တွင် DB Status သည် `available` ဖြစ်မဖြစ် စစ်ပါ (Storage Full ဖြစ်နေပါက DB Hang ပြီး Read-only သို့မဟုတ် Error ဖြစ်တတ်သည်)။
2. **Security Group Rule စစ်ဆေးခြင်း (နံပါတ်တစ် အဖြစ်အများဆုံး အမှား):**  
   RDS Security Group တွင် Application Server (EC2/ECS) တည်ရှိရာ **Security Group ID မှ Inbound Port 3306 (MySQL)** ခွင့်ပြုထားမှု ရှိမရှိ စစ်ပါ။
3. **Subnet Routing စစ်ဆေးခြင်း:**  
   EC2 နှင့် RDS သည် VPC တူညီမှု ရှိမရှိ စစ်ပါ။
4. **Secrets Manager / Credentials စစ်ဆေးခြင်း:**  
   Application `.env` ထဲရှိ DB Password သို့မဟုတ် Secrets Manager ထဲရှိ Password သည် RDS Master Password နှင့် အမှန်တကယ် ကိုက်ညီမှု ရှိမရှိ စစ်ပါ။

```bash
# EC2 Terminal အတွင်းမှ RDS Port 3306 သို့ Network ပေါက်မပေါက် စမ်းသပ်ခြင်း
nc -zv mydb.prod.ap-northeast-1.rds.amazonaws.com 3306
```

---

## Scenario 4: High Latency & Slow Performance (レスポンス遅延)

### ၁. ပြဿနာ လက္ခဏာ:
Website သည် ပွင့်သော်လည်း Page Load Time သည် ၅ စက္ကန့်မှ ၁၀ စက္ကန့်အထိ ကြာမြင့်နေခြင်း။

### ၂. CloudWatch တွင် စစ်ဆေးရမည့် Metrics များ:
1. **RDS CPUUtilization & Read/Write IOPS:**  
   Index မပါသော Slow Query များကြောင့် Database CPU 100% တက်နေခြင်း ရှိမရှိ **RDS Performance Insights** တွင် စစ်ဆေးပါ။
2. **ElastiCache Redis CPU & Evictions:**  
   Redis Memory ပြည့်သွားသဖြင့် Data များ Evict ဖြစ်ကာ DB သို့ အလုံးအရင်း ရိုက်ခတ်နေခြင်း ရှိမရှိ စစ်ဆေးပါ။
3. **ALB TargetResponseTime:**  
   CloudWatch Logs Insights ဖြင့် မည်သည့် URL Path သည် Response အကြာဆုံး ဖြစ်နေသည်ကို Filter ဆွဲထုတ်ပါ:
```sql
fields @timestamp, request_verb, request_url, target_processing_time
| filter target_processing_time > 2.0
| sort target_processing_time desc
| limit 20
```

---

## Scenario 5: Amazon S3 403 Access Denied

### ၁. ပြဿနာ လက္ခဏာ:
User များ ပုံတင်သည့်အခါ သို့မဟုတ် Backend Code က S3 ဖိုင်ဖတ်သည့်အခါ `AccessDenied: Access Denied` Error တက်ခြင်း။

### ၂. စစ်ဆေးရမည့် အချက် ၄ ချက်:
1. **Block Public Access:** S3 Bucket ပေါ်ရှိ Block Public Access Setting က ပိတ်ထားခြင်း ရှိမရှိ စစ်ပါ။
2. **Bucket Policy:** S3 Bucket Policy တွင် `Deny` Statement တစ်ခုခု ရေးမိထားခြင်း ရှိမရှိ စစ်ပါ။
3. **IAM Role Permissions:** EC2 သို့မဟုတ် ECS Task Role တွင် ထို S3 Bucket ဆီသို့ `s3:GetObject`, `s3:PutObject`, `s3:ListBucket` ခွင့်ပြုထားသော Policy ရှိမရှိ စစ်ပါ။
4. **KMS Key Permission:** S3 Bucket ကို Custom KMS Key (CMK) ဖြင့် Encrypt လုပ်ထားပါက User/Role တွင် ထို KMS Key အား အသုံးပြုခွင့် (`kms:Decrypt`, `kms:GenerateDataKey`) ရှိရမည် (KMS Key Policy တွင် ခွင့်ပြုရမည်)။

---
*နောက်အခန်းသို့ သွားရန်:* [13_Final_Capstone_Laravel_Production_Project.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/13_Final_Capstone_Laravel_Production_Project.md)
