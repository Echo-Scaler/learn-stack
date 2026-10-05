---
title: "၁၄။ AWS CLI Complete Reference Cheatsheet & Technical Interview Prep"
description: "bash"
---

## ၁၄။ AWS CLI Complete Reference Cheatsheet & Technical Interview Prep

---

## ၁၄.၁ AWS CLI Commands Reference (အမျိုးအစားအလိုက် စုံလင်စွာ)

### ၁. General & Authentication
```bash
# Credentials နှင့် လက်ရှိ Login ဝင်ထားသော Account / Role စစ်ဆေးခြင်း
aws sts get-caller-identity

# AWS CLI Help ကြည့်ရှုခြင်း
aws help
aws ec2 help
```

### ၂. Amazon EC2
```bash
# Run နေသော EC2 Instance များကို ဇယားပုံစံဖြင့် ကြည့်ရှုခြင်း
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].[InstanceId,InstanceType,PrivateIpAddress,PublicIpAddress,Tags[?Key=='Name'].Value|[0]]" \
  --output table

# EC2 Instance တစ်ခုကို စတင်ခြင်း / ရပ်တန့်ခြင်း
aws ec2 start-instances --instance-ids i-0123456789abcdef0
aws ec2 stop-instances --instance-ids i-0123456789abcdef0

# Security Groups စာရင်း ကြည့်ရှုခြင်း
aws ec2 describe-security-groups \
  --query "SecurityGroups[*].[GroupId,GroupName,Description]" \
  --output table
```

### ၃. Amazon S3
```bash
# Bucket များ စာရင်း ကြည့်ခြင်း
aws s3 ls

# Local Directory မှ ဖိုင်များကို S3 နှင့် အပြိုင် Sync ပြုလုပ်ခြင်း
aws s3 sync ./build/ s3://my-japan-prod-assets-bucket/ --delete

# ဖိုင်တစ်ခုကို S3 ပေါ်သို့ တင်ခြင်း / ဖျက်ပစ်ခြင်း
aws s3 cp document.pdf s3://my-japan-prod-assets-bucket/invoices/
aws s3 rm s3://my-japan-prod-assets-bucket/temp-file.txt
```

### ၄. AWS IAM
```bash
# IAM Users စာရင်း ကြည့်ရှုခြင်း
aws iam list-users --output table

# IAM Roles စာရင်း ကြည့်ရှုခြင်း
aws iam list-roles --query "Roles[*].RoleName" --output table

# သတ်မှတ်ထားသော Role ၏ အသေးစိတ် အချက်အလက် ကြည့်ရှုခြင်း
aws iam get-role --role-name Prod-EC2-App-Role
```

### ၅. Amazon RDS
```bash
# RDS Database Instances စာရင်းနှင့် Status ကြည့်ရှုခြင်း
aws rds describe-db-instances \
  --query "DBInstances[*].[DBInstanceIdentifier,Engine,DBInstanceStatus,Endpoint.Address]" \
  --output table
```

### ၆. Amazon ECR & ECS
```bash
# ECR Login Password ရယူခြင်း
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com

# ECS Clusters စာရင်း ကြည့်ခြင်း
aws ecs list-clusters

# ECS Service တစ်ခုကို Downtime မရှိဘဲ Force Deployment အသစ် ပြုလုပ်ခြင်း
aws ecs update-service \
  --cluster prod-fargate-cluster \
  --service laravel-web-service \
  --force-new-deployment
```

### ၇. Amazon CloudWatch & Logs
```bash
# CloudWatch Metrics စာရင်း ကြည့်ရှုခြင်း
aws cloudwatch list-metrics --namespace AWS/EC2

# Log Groups များ စာရင်း ကြည့်ရှုခြင်း
aws logs describe-log-groups --query "logGroups[*].logGroupName"

# ECS Task ၏ Log ဖိုင်များကို Real-time Follow လိုက်ကြည့်ခြင်း
aws logs tail /ecs/prod-laravel-app --follow
```

---

## ၁၄.၂ Technical Interview Preparation (Q&A)

### Q1: Security Group နှင့် Network ACL (NACL) ၏ အဓိက ကွာခြားချက်ကို ရှင်းပြပါ။
**အဖြေ:**  
- **Security Group** သည် Instance Level (EC2/ALB) Virtual Firewall ဖြစ်ပြီး **Stateful** ဖြစ်သည်။ Stateful ဆိုသည်မှာ Inbound တွင် Port တစ်ခုခု ဖွင့်ပေးလိုက်ပါက Outbound တွင် သီးခြား ထပ်ဖွင့်စရာမလိုဘဲ အလိုအလျောက် Response ထွက်ခွင့် ရရှိသည်။ Rule များတွင် `Allow` သာ သတ်မှတ်နိုင်ပြီး `Deny` သီးခြား ရေး၍ မရပါ။
- **Network ACL** သည် Subnet Level တွင် အလုပ်လုပ်ပြီး **Stateless** ဖြစ်သည်။ Inbound ကော Outbound ပါ Traffic အတွက် သီးခြားစီ Rule နံပါတ်စဉ်ဖြင့် ရေးပေးရသည်။ `Allow` ကော `Deny` ပါ တိကျစွာ ရေးနိုင်သဖြင့် တိုက်ခိုက်လာသော IP လိပ်စာများကို Subnet မရောက်မီ ကြိုတင် Block သည့်အခါ အသုံးဝင်သည်။

---

### Q2: ဂျပန် Web Application တစ်ခုတွင် Database ကို အပြင် Internet မှ တိုက်ရိုက် မရရှိစေရန် မည်သို့ Architecture ဆွဲမလဲ?
**အဖြေ:**  
1. Database (RDS/Aurora) ကို **Private DB Subnet** အတွင်းတွင်သာ ထားရှိရမည်။
2. RDS ၏ `Publicly Accessible` Option ကို `No` အဖြစ် သတ်မှတ်ရမည်။
3. Route Table တွင် Internet Gateway (IGW) ကော NAT Gateway ပါ မရှိစေဘဲ Local VPC Traffic သာ ခွင့်ပြုရမည်။
4. RDS ၏ Security Group တွင် Application Server (EC2/ECS) တည်ရှိရာ **Security Group ID ကိုသာ Source အဖြစ် သတ်မှတ်၍ Port 3306 ခွင့်ပြုရမည်** (မည်သည့် IP မှ ခွင့်မပြုပါ)။
5. Developer များ Maintenance ပြုလုပ်ရန် လိုအပ်ပါက Bastion Host သို့မဟုတ် **AWS Systems Manager (SSM) Session Manager Port Forwarding** မှတစ်ဆင့်သာ လုံခြုံစွာ Tunnel ဖောက်၍ ဝင်ရောက်စေရမည်။

---

### Q3: Application Load Balancer (ALB) တွင် 504 Gateway Timeout တက်လာပါက မည်သည့်အချက်များကို စစ်ဆေးမည်လဲ?
**အဖြေ:**  
504 Gateway Timeout ဆိုသည်မှာ ALB က Request ကို လက်ခံရရှိသော်လည်း နောက်ကွယ်ရှိ Target Server ထံမှ သတ်မှတ်ထားသော အချိန်အတွင်း Response ပြန်မရရှိသည့် အခြေအနေ ဖြစ်သည်။
1. Target Server (EC2/Container) ၏ Application သည် Database Slow Query ကြောင့် သို့မဟုတ် Memory Leak ကြောင့် Hang ဖြစ်နေခြင်း ရှိမရှိ စစ်ဆေးမည်။
2. ALB ၏ **Idle Timeout** (Default 60s) ထက် Application ၏ Response Time က ပိုမို ကြာမြင့်နေခြင်း ရှိမရှိ စစ်ဆေးမည်။
3. Target Server ပေါ်ရှိ Web Server (Nginx `fastcgi_read_timeout` သို့မဟုတ် PHP-FPM `request_terminate_timeout`) က Timeout စောစော ပိတ်သွားခြင်း ရှိမရှိ စစ်ဆေးမည်။

---

### Q4: S3 Bucket ပေါ်သို့ အရေးကြီးသော လျှို့ဝှက်စာရွက်စာတမ်းများ Upload တင်သည့်အခါ Serverless Architecture တွင် မည်သို့ Secure ဖြစ်အောင် ပြုလုပ်မလဲ?
**အဖြေ:**  
1. Client (Frontend) ကို S3 သို့ တိုက်ရိုက် အခွင့်အရေး မပေးဘဲ Backend (Lambda/API Gateway) ထံသို့ အရင် Request ပို့စေမည်။
2. Backend က Authentication (Cognito/JWT) စစ်ဆေးပြီး အောင်မြင်ပါက သက်တမ်း ၁၀ မိနစ်သာ ခံသော **S3 Presigned URL** ကို ထုတ်ပေးမည်။
3. Client သည် ထို Presigned URL ကို သုံး၍ S3 သို့ တိုက်ရိုက် HTTPS PUT ဖြင့် Upload တင်မည်။
4. S3 Bucket တွင် **AWS KMS (SSE-KMS)** ဖြင့် Data at Rest Encryption ဖွင့်ထားမည်။
5. Upload ပြီးဆုံးပါက S3 Event က EventBridge/Lambda သို့ သတင်းပို့ပြီး Virus Scanning (ClamAV) နှင့် File Validation ကို အလိုအလျောက် ဆက်လက် လုပ်ဆောင်စေမည်။

---

### Q5: Terraform တွင် State Lock ဆိုတာ ဘာလဲ? အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် State File ကို မည်သို့ စီမံခန့်ခွဲသလဲ?
**အဖြေ:**  
- Terraform ၏ `terraform.tfstate` ဖိုင်သည် တည်ဆောက်ထားသော Real Cloud Resource များနှင့် Code အကြား Mapping မှတ်တမ်း ဖြစ်သည်။
- Local ကွန်ပျူတာတွင် မထားဘဲ **Remote Backend** အဖြစ် **Amazon S3 Bucket** တွင် ဗဟိုချုပ်ကိုင် သိမ်းဆည်းရမည် (S3 Versioning ဖွင့်ထားရမည်)။
- Developer နှစ်ဦးက တစ်ပြိုင်နက်တည်း `terraform apply` ရိုက်မိပါက State File ပျက်စီးသွားနိုင်သဖြင့် **Amazon DynamoDB Table** ကို အသုံးပြု၍ **State Locking** ပြုလုပ်ရမည်။ တစ်ဦးက Run နေစဉ် DynamoDB တွင် Lock ချထားမည်ဖြစ်ပြီး ပြီးဆုံးမှသာ အခြားတစ်ဦးကို ခွင့်ပြုမည် ဖြစ်သည်။

---
*မူလမာတိကာသို့ ပြန်သွားရန်:* [README.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/README.md)
