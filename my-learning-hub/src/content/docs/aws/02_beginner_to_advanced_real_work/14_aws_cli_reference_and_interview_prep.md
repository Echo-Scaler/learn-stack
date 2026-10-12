---
title: "၁၄။ AWS CLI Complete Reference Cheatsheet & Technical Interview Prep"
description: "ဂျပန်နှင့် ကမ္ဘာတစ်ဝှမ်းရှိ AWS Cloud & DevOps အင်ဂျင်နီယာ အင်တာဗျူးများတွင် အမေးအများဆုံး Real-World Questions (၂၀) ခုနှင့် လက်တွေ့လုပ်ငန်းခွင်သုံး AWS CLI Commands Reference အပြည့်အစုံ"
---

## ၁၄။ AWS CLI Complete Reference Cheatsheet & Technical Interview Prep

ဤအပိုင်းတွင် Japan IT Cloud 現場 နှင့် Global Enterprise Project များတွင် နေ့စဉ် မဖြစ်မနေ အသုံးပြုရသော **AWS CLI Commands Reference (အဆင့်မြင့် JMESPath Filtering အပါအဝင်)** နှင့် **Senior Cloud / DevOps Engineer အင်တာဗျူးများတွင် မေးလေ့ရှိသည့် အခက်ခဲဆုံး မေးခွန်းနှင့် စံနမူနာ အဖြေ (၂၀) ခု** ကို အသေးစိတ် ပြုစုထားပါသည်။

---

## ၁၄.၁ AWS CLI Commands Complete Cheatsheet

### ၁။ Profile, SSO & Authentication (認証・プロファイル管理)
```bash
# ၁။ လက်ရှိ Login ဝင်ထားသော Account ID, IAM User/Role ARN စစ်ဆေးခြင်း
aws sts get-caller-identity

# ၂။ AWS IAM Identity Center (AWS SSO) ဖြင့် Login ဝင်ခြင်း
aws sso login --profile japan-prod

# ၃။ Profile တစ်ခုချင်းအလိုက် အသုံးပြုခြင်း သို့မဟုတ် Default Profile သတ်မှတ်ခြင်း
export AWS_PROFILE=japan-prod
export AWS_DEFAULT_REGION=ap-northeast-1

# ၄။ AssumeRole ဖြင့် ယာယီ Security Credentials (Token) ရယူခြင်း
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/DeployerRole \
  --role-session-name ProductionDeploymentSession
```

---

### ၂။ Amazon EC2 & EBS (仮想サーバー & ストレージ)
```bash
# ၁။ Run နေသော EC2 Instance များကို Name Tag, Type, IP များဖြင့် ဇယားထုတ်ကြည့်ခြင်း
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].[InstanceId,InstanceType,PrivateIpAddress,PublicIpAddress,Tags[?Key=='Name'].Value|[0]]" \
  --output table

# ၂။ EC2 Instance ကို Start / Stop / Reboot လုပ်ခြင်း
aws ec2 start-instances --instance-ids i-0123456789abcdef0
aws ec2 stop-instances --instance-ids i-0123456789abcdef0
aws ec2 reboot-instances --instance-ids i-0123456789abcdef0

# ၃။ Security Group စာရင်းနှင့် ၎င်းတို့၏ Inbound Rules များကို စစ်ဆေးခြင်း
aws ec2 describe-security-groups \
  --group-ids sg-0123456789abcdef0 \
  --query "SecurityGroups[*].IpPermissions[*].[IpProtocol,FromPort,ToPort,IpRanges[*].CidrIp]" \
  --output json

# ၄။ EBS Volume Snapshot ရယူခြင်း
aws ec2 create-snapshot \
  --volume-id vol-0123456789abcdef0 \
  --description "Production DB Volume Backup before Release" \
  --tag-specifications "ResourceType=snapshot,Tags=[{Key=Env,Value=Production}]"
```

---

### ၃။ AWS Systems Manager (SSM) — 踏み台・SSH 不要のターミナルアクセス
```bash
# ၁။ SSH Port 22 ဖွင့်စရာမလိုဘဲ EC2 Instance ထဲသို့ Terminal Shell ဝင်ရောက်ခြင်း
aws ssm start-session --target i-0123456789abcdef0

# ၂။ Private Subnet ရှိ Aurora MySQL Database သို့ Local မှ Tunnel Port-Forwarding ဖောက်ခြင်း
aws ssm start-session \
  --target i-0123456789abcdef0 \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["prod-db.cluster-xxxxxx.ap-northeast-1.rds.amazonaws.com"],"portNumber":["3306"],"localPortNumber":["3306"]}'

# ၃။ SSM Parameter Store မှ Encrypted Secret တန်ဖိုးကို ဆွဲထုတ်ကြည့်ရှုခြင်း
aws ssm get-parameter \
  --name "/production/database/password" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text
```

---

### ၄။ Amazon S3 (オブジェクトストレージ)
```bash
# ၁။ Bucket များ စာရင်းနှင့် ဖိုင်ဆိုက် အကျဉ်းချုပ် ကြည့်ခြင်း
aws s3 ls
aws s3 ls s3://my-japan-prod-assets-bucket/ --recursive --human-readable --summarize

# ၂။ Local Directory မှ ဖိုင်များကို S3 နှင့် စင့်ခ်လုပ်ခြင်း (ပိုနေသောဖိုင်များ ဖျက်ပစ်ခြင်း)
aws s3 sync ./dist/ s3://my-japan-prod-assets-bucket/ --delete --cache-control "max-age=31536000,public"

# ၃။ S3 Presigned URL (သက်တမ်း ၁၅ မိနစ်) ထုတ်ယူခြင်း (လုံခြုံစွာ ယာယီ ဒေါင်းလုဒ်/အပ်လုဒ် ခွင့်ပြုခြင်း)
aws s3 presign s3://my-japan-prod-assets-bucket/invoices/report.pdf --expires-in 900

# ၄။ S3 Block Public Access ကို ချက်ချင်း ပိတ်ချခြင်း (Security Enforcement)
aws s3api put-public-access-block \
  --bucket my-japan-prod-assets-bucket \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

---

### ၅။ Amazon RDS & Aurora (マネージドデータベース)
```bash
# ၁။ RDS DB Clusters စာရင်းနှင့် Multi-AZ/Status အခြေအနေ စစ်ဆေးခြင်း
aws rds describe-db-clusters \
  --query "DBClusters[*].[DBClusterIdentifier,Engine,Status,Endpoint,ReaderEndpoint]" \
  --output table

# ၂။ Aurora Cluster ကို Manual Failover ပြုလုပ်၍ Reader ကို Writer အဖြစ် ပြောင်းလဲခြင်း
aws rds failover-db-cluster --db-cluster-identifier prod-aurora-cluster

# ၃။ DB Instance ၏ Manual Snapshot Backup ရယူခြင်း
aws rds create-db-snapshot \
  --db-instance-identifier prod-mysql-instance \
  --db-snapshot-identifier "prod-mysql-backup-$(date +%Y%m%d%H%M)"
```

---

### ၆။ Amazon ECR & ECS Fargate (コンテナ基盤)
```bash
# ၁။ ECR Docker Login Token ရယူပြီး Docker Daemon သို့ ချိန်ဆက်ခြင်း
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com

# ၂။ ECS Fargate Task Definition အသစ် Deploy တင်ပြီး Force Update ပြုလုပ်ခြင်း
aws ecs update-service \
  --cluster prod-fargate-cluster \
  --service web-app-service \
  --force-new-deployment

# ၃။ Running ဖြစ်နေသော ECS Tasks များ စာရင်းနှင့် Container Status စစ်ဆေးခြင်း
aws ecs list-tasks --cluster prod-fargate-cluster --service-name web-app-service
aws ecs describe-tasks \
  --cluster prod-fargate-cluster \
  --tasks <task-id> \
  --query "tasks[*].containers[*].[name,lastStatus,exitCode,reason]" \
  --output table

# ၄။ ECS Execute Command ဖြင့် Fargate Container အတွင်းသို့ တိုက်ရိုက် Bash ဝင်ရောက်ခြင်း
aws ecs execute-command \
  --cluster prod-fargate-cluster \
  --task <task-id> \
  --container laravel-app \
  --command "/bin/sh" \
  --interactive
```

---

### ၇။ Elastic Load Balancing (ALB) & Route 53 (DNS)
```bash
# ၁။ ALB Target Group Health အခြေအနေ စစ်ဆေးခြင်း (Unhealthy Targets ရှာဖွေခြင်း)
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/prod-web-tg/abcdef \
  --query "TargetHealthDescriptions[*].[Target.Id,Target.Port,TargetHealth.State,TargetHealth.Reason]" \
  --output table

# ၂။ Route 53 Hosted Zone ရှိ DNS Record များကို ရှာဖွေဖတ်ရှုခြင်း
aws route53 list-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --query "ResourceRecordSets[?Type=='A'].[Name,Type,AliasTarget.DNSName,TTL]" \
  --output table
```

---

### ၈။ Amazon CloudWatch & CloudTrail (ログ監視・監査)
```bash
# ၁။ ECS / Application Log များကို Real-time Follow လိုက်ကြည့်ခြင်း
aws logs tail /ecs/prod-laravel-app --follow --since 15m

# ၂။ CloudWatch Logs Insights ဖြင့် HTTP 5xx Error များကို Query ရိုက်ရှာဖွေခြင်း
aws logs start-query \
  --log-group-name /aws/alb/access-logs \
  --start-time $(date -u -v-1H +%s) \
  --end-time $(date -u +%s) \
  --query-string 'fields @timestamp, elb_status_code, request_url | filter elb_status_code >= 500 | limit 20'

# ၃။ လတ်တလော အရေးကြီးသော CloudTrail Management Events (ဘယ်သူ EC2 ဖျက်သွားသလဲ စစ်ဆေးခြင်း)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=TerminateInstances \
  --max-results 5 \
  --query "Events[*].[EventTime,Username,EventName]" \
  --output table
```

---

### ၉။ Advanced JMESPath Querying & Filtering Tips
AWS CLI ၏ `--query` parameter သည် **JMESPath** query engine ကို အသုံးပြုထားပြီး JSON output ကြီးမားသည့်အခါ အလွန်မြန်ဆန်စွာ Filter လုပ်ပေးနိုင်သည်:

```bash
# Multi-Select Hash: လိုချင်သော Field များကို Key-Value ပုံစံဖြင့် ထုတ်ယူခြင်း
aws ec2 describe-instances \
  --query "Reservations[*].Instances[*].{ID: InstanceId, Type: InstanceType, State: State.Name}" \
  --output json

# Filter Expressions: t3.micro စက်များထဲမှ running ဖြစ်နေသော စက်များသာ ရှာခြင်း
aws ec2 describe-instances \
  --query "Reservations[*].Instances[?InstanceType=='t3.micro' && State.Name=='running'].InstanceId" \
  --output text

# Pipe Expressions: ရလာသော Array ကို Flatten လုပ်ပြီး အကြီးအသေး Sort စီခြင်း
aws s3api list-objects-v2 \
  --bucket my-japan-prod-assets-bucket \
  --query "sort_by(Contents, &Size)[-5:].{Key: Key, Size: Size}" \
  --output table
```

---

## ၁၄.၂ Technical Interview Preparation (၂၀ ခု အမေးအများဆုံး မေးခွန်းနှင့် စံနမူနာ အဖြေများ)

---

### 🇯🇵 Part A: Japan IT Workplace & Genba Specific Questions (ဂျပန် လုပ်ငန်းခွင် မေးခွန်းများ)

#### Q1: ဂျပန် IT 現場 (Genba) တွင် EC2 သို့ တိုက်ရိုက် SSH Port 22 ဖွင့်ခွင့် မပြုခြင်း (SSH 禁止) ၏ အကြောင်းရင်းနှင့် အစားထိုး မည်သို့ ဖြေရှင်းသလဲ?
**အဖြေ:**
* **အကြောင်းရင်း:**
  1. Port 22 ကို Public ဖွင့်ထားပါက ကမ္ဘာအနှံ့မှ Brute-force Password / SSH Key Attack များ နေ့စဉ် ရိုက်ခတ်နိုင်သည်။
  2. `.pem` Key Pair ကို Developer များ၏ Local PC များတွင် မျှဝေကိုင်တွယ်ရသဖြင့် Key ပေါက်ကြားနိုင်ခြေ (Key Leak Risk) အလွန်မြင့်မားသည်။
  3. မည်သည့် အင်ဂျင်နီယာက မည်သည့် Command ရိုက်နှိပ်လုပ်ဆောင်ခဲ့သည်ကို Audit Trail မှတ်တမ်းတင်ရန် ခက်ခဲသည်။
* **ဂျပန်စံနှုန်း ဖြေရှင်းနည်း (現場のベストプラクティス):**
  - **AWS Systems Manager (SSM) Session Manager** ကို အသုံးပြုသည်။
  - Inbound Port 22 ကို လုံးဝ ပိတ်ထားပြီး (`Inbound Rule: None`)၊ EC2 တွင် `AmazonSSMManagedInstanceCore` IAM Policy ပေးထားကာ Outbound HTTPS (Port 443) ဖြင့် SSM Endpoint သို့ ဆက်သွယ်သည်။
  - အကျိုးကျေးဇူးအနေဖြင့် IAM Role + MFA ဖြင့် ဝင်ရောက်နိုင်ပြီး၊ ဝင်ရောက်ရိုက်နှိပ်ခဲ့သော Shell Command အားလုံးကို **CloudWatch Logs နှင့် S3 Bucket ထဲတွင် အလိုအလျောက် သက်သေအထောက်အထား (Audit Log) အပြည့်အစုံ** မှတ်တမ်းတင်ပေးသည်။

---

#### Q2: 本番リリース (Production Release) တွင် User များ ဝန်ဆောင်မှု မရပ်တန့်စေရန် (Zero Downtime Deployment) မည်သို့ Architecture ဆွဲမလဲ?
**အဖြေ:**
1. **ALB + ECS Fargate (Blue/Green Deployment with AWS CodeDeploy):**
   - Version အသစ် Container Task (Green) ကို သီးခြား Test Port (ဥပမာ- `8080`) တွင် စတင် run သည်။
   - Deployment lifecycle hook စမ်းသပ်မှု အောင်မြင်ပြီး Health Check အားလုံး OK ဖြစ်မှသာ ALB Traffic ကို Version ဟောင်း (Blue) မှ အသစ် (Green) သို့ ၁၀၀% ပြောင်းလွှဲပေးသည်။
   - အကယ်၍ Error ဖြစ်ပါက စက္ကန့်ပိုင်းအတွင်း Blue သို့ **အလိုအလျောက် 切り戻し (Automatic Rollback)** လုပ်ဆောင်သည်။
2. **Database Migration နှင့် Backward Compatibility:**
   - Database Column ဖျက်ခြင်း သို့မဟုတ် Rename လုပ်ခြင်းကို တစ်ပြိုင်နက် မလုပ်ရပါ။ **Expand/Contract Pattern (Phase 2-Step Release)** ဖြင့် လုပ်ဆောင်ရမည်။
   - Step 1: Column အသစ်ထည့်ပြီး Code အသစ် Deploy တင်သည်။ (Code အဟောင်းကော အသစ်ပါ run နိုင်သည်။)
   - Step 2: Data Migrate လုပ်ပြီးမှသာ Column အဟောင်းကို နောက် Release တစ်ခုတွင် ဖြုတ်ချရမည်။

---

#### Q3: 障害対応 (Incident Response) တွင် HTTP 502 / 504 Error တက်လာပါက အဆင့်ဆင့် စုံစမ်းစစ်ဆေးပုံ (切り分け手順) ကို ရှင်းပြပါ။
**အဖြေ:**
ဂျပန် 現場 တွင် **"切り分け" (Layer-by-Layer Root Cause Isolation)** ကို အောက်ပါအတိုင်း အဆင့်ဆင့် စစ်ဆေးသည်-
1. **502 Bad Gateway စစ်ဆေးခြင်း:**
   - ALB Access Log တွင် `elb_status_code=502` နှင့် `target_status_code` ကို စစ်သည်။
   - `target_status_code` သည် `-` ဖြစ်နေပါက ALB နှင့် App Server အကြား KeepAlive Timeout မကိုက်ညီခြင်း သို့မဟုတ် App Server Process (Nginx/PHP-FPM/Node) Crash ဖြစ်သွားခြင်း ဖြစ်သည်။
   - ALB Target Group Health Check status (`Unhealthy` ဖြစ်နေမဖြစ်နေ) ကို ချက်ချင်း စစ်ဆေးသည်။
2. **504 Gateway Timeout စစ်ဆေးခြင်း:**
   - App Server က ALB သတ်မှတ်ထားသော Idle Timeout (Default 60s) အတွင်း Response ပြန်မပေးနိုင်ခြင်း ဖြစ်သည်။
   - RDS/Aurora တွင် **Long Running Query / Lock Waiting** ဖြစ်နေခြင်း ရှိမရှိ Performance Insights တွင် စစ်သည်။
   - External 3rd Party API (Payment Gateway, LINE API) ချိတ်ဆက်မှု Timeout ဖြစ်နေခြင်း ရှိမရှိ Log များတွင် စစ်ဆေးသည်။
3. **初動対応 (Initial Workaround):**
   - ပျက်စီးနေသော Task/Instance များကို သီးခြားခွဲထုတ်၍ Restart/Scale-out လုပ်ကာ Service အရင် ပြန်လည်အသက်သွင်းသည် (暫定復旧)။ နောက်မှ Root Cause ကို စုံစမ်းစစ်ဆေးသည်။

---

#### Q4: Amazon Aurora Multi-AZ Cluster တွင် Failover ဖြစ်ပွားသည့်အခါ ဘာတွေဖြစ်ပျက်သလဲ? App ဘက်က ဘာတွေ သတိထားရမလဲ?
**အဖြေ:**
* **AWS အခြမ်းတွင် ဖြစ်ပျက်ပုံ:**
  - Primary Writer Instance ပျက်ကျသွားပါက Aurora သည် အနီးဆုံး Reader Instance တစ်ခုကို Writer အဖြစ် အလိုအလျောက် ရာထူးတိုးမြှင့် (Promote) ပေးသည်။
  - Aurora Cluster Endpoint ၏ CNAME DNS Record သည် ၅ စက္ကန့် မှ ၁၀ စက္ကန့်အတွင်း Writer အသစ်၏ IP လိပ်စာသို့ အလိုအလျောက် ပြောင်းလဲညွှန်းဆိုပေးသည်။
* **Application ဘက်မှ မဖြစ်မနေ သတိထားရမည့်အချက် (現場での注意点):**
  - **DNS Caching Problem:** Java JVM, PHP PDO, Node.js တို့သည် DNS Resolution ကို အချိန်ကြာမြင့်စွာ Cache လုပ်ထားလေ့ရှိသည်။ ထို့ကြောင့် Failover ပြီးသော်လည်း ပျက်စီးသွားသော IP အဟောင်းဆီသို့ ဆက်တိုက် request ပို့ပြီး Error တက်နေတတ်သည်။
  - **ဖြေရှင်းချက်:** App တွင် Connection Re-try Logic ထည့်သွင်းထားရမည် ဖြစ်ပြီး DNS TTL ကို `5` စက္ကန့် သတ်မှတ်ရမည်။ ပိုမိုကောင်းမွန်သော နည်းလမ်းမှာ **Amazon RDS Proxy** ကို အသုံးပြုခြင်း ဖြစ်သည် (RDS Proxy သည် Failover Time ကို ၆၆% အထိ လျှော့ချပေးသည်)။

---

#### Q5: Security Group နှင့် Network ACL (NACL) ၏ ခြားနားချက်ကို ဂျပန် ပရောဂျက် လုံခြုံရေးရှုထောင့်မှ ရှင်းပြပါ။
**အဖြေ:**
* **Security Group (Stateful & Instance Level):**
  - EC2, ALB, RDS အဆင့်တွင် ကာကွယ်ပေးသည်။
  - **Stateful:** Inbound ခွင့်ပြုလိုက်ပါက Outbound အတွက် သီးခြား ဖွင့်စရာမလိုဘဲ အလိုအလျောက် Response ပြန်ထွက်နိုင်သည်။
  - `Allow` Rules သာ ရေးနိုင်သည်။ အဓိကအားဖြင့် Application Tier အချင်းချင်း ချိတ်ဆက်မှု (ဥပမာ- ALB SG မှ App SG သို့၊ App SG မှ DB SG သို့) စီမံရာတွင် အသုံးပြုသည်။
* **Network ACL (Stateless & Subnet Level):**
  - Subnet တစ်ခုလုံး၏ နယ်နိမိတ်တွင် စစ်ဆေးသည်။
  - **Stateless:** Inbound ကော Outbound ပါ Port များကို သီးခြားစီ Rule နံပါတ်စဉ်ဖြင့် ခွင့်ပြုပေးရသည် (Ephemeral Ports `1024-65535` ပါ ထည့်သွင်းရမည်)။
  - `Allow` ကော `Deny` ပါ ရေးနိုင်သည်။
  - **現場での用途:** တိုက်ခိုက်လာသော သံသယဖြစ်ဖွယ် Blacklisted IP Addresses များကို Subnet အတွင်းသို့ မဝင်ရောက်မီ အမြစ်ပြတ် တားဆီးရန် အသုံးပြုသည်။

---

#### Q6: ဂျပန်ကုမ္ပဏီများတွင် Client များက ကုန်ကျစရိတ်ကို အလွန်အလေးထားသဖြင့် AWS Cost Optimization (FinOps) ကို မည်သို့ အကောင်အထည်ဖော်မလဲ?
**အဖြေ:**
1. **Compute Tier:**
   - ပုံမှန် အမြဲ Run နေသော Production Workloads များအတွက် **Savings Plans (Compute / EC2)** သို့မဟုတ် **Reserved Instances (RI)** ကို ၁ နှစ် သို့မဟုတ် ၃ နှစ် Commit လုပ်ပြီး ၆၀%~၇၀% အထိ လျှော့ချသည်။
   - x86 (Intel/AMD) အစား **AWS Graviton (ARM64)** Instances (`t4g`, `c7g`, `r7g`) သို့ ပြောင်းလဲအသုံးပြုခြင်းဖြင့် Performance ၂၀% ပိုကောင်းပြီး Cost ၂၀% သက်သာစေသည်။
   - Non-Production (Dev/Staging) စက်များကို ညဘက်နှင့် စနေ/တနင်္ဂနွေတွင် EventBridge + Lambda ဖြင့် အလိုအလျောက် Auto Start/Stop ပြုလုပ်သည်။
2. **Storage & Data Transfer Tier:**
   - S3 Lifecycle Rules ထည့်သွင်း၍ ရက် ၃၀ ကျော်သော Data များကို **S3 Standard-IA** နှင့် **S3 Glacier Flexible / Deep Archive** သို့ ရွှေ့ပြောင်းသည်။
   - S3 နှင့် ECR သို့ ဆက်သွယ်သော Traffic များအတွက် NAT Gateway မဖြတ်စေဘဲ **VPC Endpoints (Gateway / Interface)** သုံးစွဲ၍ Data Transfer Fee ချွေတာသည်။
   - အသုံးမပြုဘဲ ကျန်နေသော Unattached Elastic IPs နှင့် Detached EBS Volumes များကို ပုံမှန် Audit ပြုလုပ်၍ ဖျက်ပစ်သည်။

---

#### Q7: 障害報告書 (Incident Post-Mortem Report) ရေးသားရာတွင် "なぜなぜ分析 (5 Whys Root Cause Analysis)" ကို မည်သို့ အသုံးချသလဲ?
**အဖြေ:**
ဂျပန် IT 現場 တွင် ပြဿနာဖြစ်ရုံမျှဖြင့် မပြီးဘဲ မည်သည့်အတွက်ကြောင့် ထိုသို့ဖြစ်ရသည်ကို အကြောင်းရင်းရင်းမြစ် (Root Cause) ပေါ်ပေါက်သည်အထိ "Why (なぜ)" ကို ၅ ဆင့် ဆက်တိုက် မေးမြန်းစိစစ်ရသည်-
* **နမူနာ Case: Production Web App DB Connection Error ဖြစ်ခြင်း:**
  1. *Why 1:* ဘာကြောင့် ဝက်ဘ်ဆိုက် Error တက်သွားသလဲ?  
     → Database ထံသို့ Connection ချိတ်ဆက်၍ မရတော့သောကြောင့်။
  2. *Why 2:* ဘာကြောင့် DB ချိတ်မရတော့သလဲ?  
     → RDS ၏ `max_connections` (500) ပြည့်သွားသောကြောင့်။
  3. *Why 3:* ဘာကြောင့် Connection ပြည့်သွားသလဲ?  
     → Traffic တက်လာချိန်တွင် ECS Task များ အလုံးရေ အဆမတန် Auto-scale ထွက်သွားသောကြောင့်။
  4. *Why 4:* ဘာကြောင့် Task တိုင်းက DB ကို တိုက်ရိုက်ချိတ်ပြီး Connection ကုန်သွားသလဲ?  
     → Connection Pool စနစ် မရှိဘဲ Task တစ်ခုချင်းစီက Persistent DB Connection များ အများအပြား ဖွင့်ထားသောကြောင့်။
  5. *Why 5 (Root Cause):* ဘာကြောင့် Connection Pool စနစ် မပါရှိခဲ့သလဲ?  
     → Initial Design ရေးဆွဲစဉ်က Traffic Spike ခန့်မှန်းချက် လွဲမှားခဲ့ပြီး RDS Proxy ကို မူလ Architecture တွင် ထည့်သွင်းရန် ချန်လှပ်ခဲ့မိသောကြောင့်။
* **再発防止策 (Permanent Fix):** ECS နှင့် RDS အကြားတွင် **Amazon RDS Proxy** ကို ချက်ချင်း ထည့်သွင်း တည်ဆောက်ခဲ့သည်။

---

### 🌍 Part B: Worldwide & Global Architecture Questions (ကမ္ဘာလုံးဆိုင်ရာ အဆင့်မြင့် မေးခွန်းများ)

#### Q8: SQS (Simple Queue Service), SNS (Simple Notification Service) နှင့် EventBridge တို့၏ Architectural Use-cases မတူညီပုံကို နှိုင်းယှဉ်ပြပါ။
**အဖြေ:**
| Service | Pattern | Model | Delivery Target | အဓိက အသုံးပြုသည့် နေရာ |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon SQS** | Point-to-Point (Queue) | Pull Model (Consumer က လှမ်းယူရသည်) | Single Consumer | Heavy Batch Processing, Worker Jobs, Rate Limiting & Decoupling |
| **Amazon SNS** | Pub/Sub (Topic) | Push Model (Subscriber ဆီ တန်းပို့သည်) | Multi-Subscribers (Fan-Out) | Email/SMS Notifications, SQS Queues အများအပြားသို့ တစ်ပြိုင်နက် Message ခွဲပို့ခြင်း |
| **Amazon EventBridge** | Event Bus | Content-based Routing & Schema Registry | SaaS Apps, Lambda, Step Functions, AWS Services | Microservices Event-Driven Architecture, Third-party Webhooks (Stripe, GitHub) |

---

#### Q9: AWS IAM Evaluation Logic တွင် Identity-based Policy, Resource-based Policy နှင့် SCP (Service Control Policy) တို့ ပေါင်းစပ်လာပါက မည်သို့ အလုပ်လုပ်သလဲ?
**အဖြေ:**
AWS IAM ၏ ဆုံးဖြတ်ချက်ချမှတ်မှု မူဘောင် (Decision Tree):
1. **Default Deny:** အစပိုင်းတွင် အရာအားလုံးကို ပိတ်ထားသည် (Implicit Deny)။
2. **Explicit Deny အမြဲ ဦးစားပေး:** မည်သည့် Policy တွင်မဆို `Deny` တစ်ခုတည်း ပါရှိနေပါက အခြား မည်သည့် `Allow` ပေးထားစေကာမူ **လုံးဝ အပိတ်ခံရမည်** ဖြစ်သည်။
3. **AWS Organizations SCP (Service Control Policy):** Account အဆင့်တွင် အဆိုပါ Action ကို SCP က `Allow` မပေးထားပါက Root User ပင်လျှင် လုပ်ဆောင်၍ မရပါ။
4. **Permissions Boundary:** IAM User/Role ပေါ်တွင် Boundary သတ်မှတ်ထားပါက ထို Boundary အတွင်းတွင်လည်း Allow ဖြစ်နေရမည်။
5. **Identity-based vs Resource-based:**
   - တူညီသော AWS Account အတွင်းဖြစ်ပါက Identity Policy သို့မဟုတ် Resource-based Policy (ဥပမာ- S3 Bucket Policy) **တစ်ခုခုတွင် Allow ဖြစ်ရုံဖြင့်** အခွင့်အရေး ရရှိသည်။
   - မတူညီသော Cross-Account ဖြစ်ပါက **Account နှစ်ခုစလုံးတွင် Allow ပေးထားမှသာ** ဝင်ရောက်ခွင့် ရရှိမည်ဖြစ်သည်။

---

#### Q10: Multi-Region Disaster Recovery (DR) Strategies (၄) မျိုး၏ ကွာခြားချက်နှင့် RPO / RTO ချိန်ညှိပုံကို ရှင်းပြပါ။
**အဖြေ:**
| Strategy | Downtime (RTO) | Data Loss (RPO) | Cost | Architecture ပုံစံ |
| :--- | :--- | :--- | :--- | :--- |
| **1. Backup & Restore** | နာရီပိုင်း မှ ရက်ပိုင်း | နာရီပိုင်း | အသက်သာဆုံး ($) | S3 Cross-Region Replication (CRR) နှင့် Snapshot များကို အခြား Region သို့ ပို့ထားပြီး ပြဿနာဖြစ်မှ အသစ်ပြန်ဆောက်သည်။ |
| **2. Pilot Light** | မိနစ်ဆယ်ဂဏန်း | မိနစ်ပိုင်း | သက်သာ ($$) | Core Data (Aurora Global Database) ကို အမြဲ Sync လုပ်ထားပြီး Server များကို 0 အဖြစ် ထားကာ DR ဖြစ်မှ Terraform/AMI ဖြင့် Scale တင်သည်။ |
| **3. Warm Standby** | မိနစ်ပိုင်း | စက္ကန့်ပိုင်း | အလယ်အလတ် ($$$) | DR Region တွင် စက်အနည်းငယ် (Minimum Capacity) အမြဲ Run ထားပြီး Failover ဖြစ်ပါက Auto-Scaling ဖြင့် ချက်ချင်း အပြည့်တင်သည်။ |
| **4. Multi-Site Active/Active** | သုညနီးပါး (Real-time) | သုညနီးပါး | ဈေးအကြီးဆုံး ($$$$) | Region ၂ ခုလုံးတွင် System အပြည့်အစုံ အမြဲ Run ထားပြီး Route 53 Geolocation / Latency Routing ဖြင့် User များကို ခွဲပို့သည်။ |

---

#### Q11: Serverless Architecture တွင် AWS Lambda Cold Start ဆိုတာ ဘာလဲ? Production တွင် မည်သို့ လျှော့ချမလဲ?
**အဖြေ:**
* **Cold Start ဖြစ်ရသည့် အကြောင်းရင်း:**
  Lambda Function ကို အချိန်အတန်ကြာ မခေါ်ယူဘဲ ထားပြီးမှ Request အသစ် ဝင်လာသည့်အခါ AWS သည် Container အသစ်တစ်ခုကို Provision လုပ်ခြင်း၊ Runtime Initialize လုပ်ခြင်းနှင့် Code/Dependencies များကို Memory ပေါ်သို့ တင်ခြင်းတို့ ပြုလုပ်ရသဖြင့် ပထမဆုံး Request တွင် Latency မြင့်တက်သွားခြင်း ဖြစ်သည်။
* **လျှော့ချနည်း (Production Strategies):**
  1. **Provisioned Concurrency:** အရေးကြီးသော API များအတွက် Lambda Execution Environments များကို ကြိုတင်၍ Warm အဖြစ် အမြဲ အဆင်သင့် ဖွင့်ထားပေးခြင်း (Cold Start လုံးဝ မရှိတော့ပါ)။
  2. **Lightweight Runtime:** Java/C# ကဲ့သို့ JVM Boot time ကြာသော ဘာသာစကားများအစား Go, Rust, သို့မဟုတ် Node.js/Python ကို သုံးစွဲခြင်း။
  3. **Package Size လျှော့ချခြင်း:** မလိုအပ်သော Library များကို ဖြုတ်ပစ်ပြီး Webpack/esbuild ဖြင့် Bundling ပြုလုပ်ခြင်း။
  4. **Database Connection:** Global Scope (Handler အပြင်ဘက်) တွင် DB Connection ကို Initialize လုပ်ထားခြင်းဖြင့် Warm Container များတွင် Connection ကို ပြန်လည် အသုံးပြုနိုင်စေခြင်း။

---

#### Q12: Amazon S3 တွင် ဒေတာလုံခြုံရေးအတွက် S3 Block Public Access, Bucket Policy, IAM Policy နှင့် S3 KMS Key Policy တို့ မည်သို့ အပြန်အလှန် ပေါင်းစပ်အလုပ်လုပ်သလဲ?
**အဖြေ:**
1. **S3 Block Public Access:** အကောင့် သို့မဟုတ် Bucket အဆင့်တွင် Master Safety Switch အဖြစ် အလုပ်လုပ်ပြီး မတော်တဆ Public ဖွင့်မိသော မည်သည့် ACL နှင့် Policy မျိုးကိုမဆို ဗဟိုမှ အတင်းအကျပ် ပိတ်ချထားပေးသည်။
2. **Bucket Policy (Resource-based):** S3 Bucket ၏ တံခါးဝတွင် ရှိပြီး မည်သည့် IP, မည်သည့် VPC Endpoint သို့မဟုတ် CloudFront Origin ကသာ ဖတ်ခွင့်ရှိသည်ကို တိကျစွာ စစ်ဆေးသည်။
3. **IAM Policy (Identity-based):** ကုမ္ပဏီဝန်ထမ်း သို့မဟုတ် EC2/ECS Instance Role က S3 ပေါ်ရှိ မည်သည့် Folder လမ်းကြောင်းကို ဖတ်ခွင့်/ရေးခွင့် ရှိသည်ကို ကန့်သတ်သည်။
4. **AWS KMS Key Policy:** S3 Object ကို ဖတ်ခွင့်ရှိသော်လည်း KMS Key ၏ Key Policy တွင် `kms:Decrypt` လုပ်ပိုင်ခွင့် မပါရှိပါက ဒေတာကို ဖတ်ရှု၍ မရဘဲ `Access Denied` တက်မည် ဖြစ်သည်။

---

#### Q13: AWS Transit Gateway နှင့် VPC Peering မည်သည့်အချိန်တွင် ရွေးချယ်သင့်သလဲ?
**အဖြေ:**
* **VPC Peering:**
  - VPC အရေအတွက် နည်းပါးချိန် (၂ ခု မှ ၃ ခုခန့်) တွင် အကောင်းဆုံးဖြစ်သည်။
  - Point-to-Point တိုက်ရိုက် ဆက်သွယ်သဖြင့် အပို Service ကုန်ကျစရိတ် မရှိဘဲ Performance Latency အလွန်နည်းသည်။
  - အားနည်းချက်: **Transitive Routing မရရှိပါ** (VPC A ↔ B ↔ C ချိတ်ထားသော်လည်း A က C ကို တိုက်ရိုက် သွားမရပါ၊ VPC ၂၀ ရှိပါက Connection ၁၉၀ ဆက်သွယ်ရမည် ဖြစ်သည်)။
* **AWS Transit Gateway (TGW):**
  - Enterprise ပရောဂျက်များတွင် VPC ပေါင်း ဆယ်ချီ/ရာချီ ရှိလာချိန်နှင့် On-premises Data Center (Direct Connect / VPN) များ ချိတ်ဆက်ရချိန်တွင် အသုံးပြုသည်။
  - **Hub-and-Spoke Architecture** ဖြစ်သဖြင့် ဗဟို Router တစ်ခုတည်းတွင် ချိတ်ဆက်၍ လုံခြုံရေးနှင့် Routing ကို ဗဟိုမှ ထိန်းချုပ်နိုင်သည်။ Transitive Routing အပြည့်အဝ ထောက်ပံ့သည်။

---

#### Q14: S3 Standard, S3 Intelligent-Tiering, S3 One Zone-IA နှင့် Glacier Deep Archive တို့၏ Lifecycle Strategy ကို မည်သို့ ရေးဆွဲမလဲ?
**အဖြေ:**
1. **နေ့စဉ် မကြာခဏ အသုံးပြုသော ဖိုင်များ (Frequent Access):** `S3 Standard` တွင် ထားရှိသည်။
2. **Access Pattern မသေချာသော Data များ:** `S3 Intelligent-Tiering` တွင် ထားရှိခြင်းဖြင့် Data Retrieval Fee မကုန်ကျဘဲ ၃၀ ရက်၊ ၉၀ ရက် မသုံးပါက AWS က အလိုအလျောက် Tier အသက်သာဆုံးသို့ ရွှေ့ပေးသည်။
3. **ရက် ၃၀ ကျော်သော Backup Logs များ:** `S3 Standard-IA` (Infrequent Access) သို့ Lifecycle Rule ဖြင့် ရွှေ့သည်။
4. **ပြန်လည်အစားထိုးနိုင်သော ယာယီ Thumbnail များ:** `S3 One Zone-IA` (20% ပိုသက်သာသည်) သို့ ထားနိုင်သည်။
5. **ဥပဒေအရ ၇ နှစ် သိမ်းဆည်းရမည့် Audit Logs / Compliance Data:** ရက် ၉၀ ပြည့်ပါက `S3 Glacier Deep Archive` ($0.00099/GB) သို့ ရွှေ့ပြောင်းခြင်းဖြင့် သိုလှောင်စရိတ်ကို ၉၅% ကျော် လျှော့ချနိုင်သည်။

---

#### Q15: Amazon API Gateway တွင် REST API နှင့် HTTP API မည်သို့ ကွာခြားသလဲ?
**အဖြေ:**
* **HTTP API:**
  - Serverless CRUD API နှင့် Lambda Proxy သုံးစွဲမှုများအတွက် ပေါ့ပါးမြန်ဆန်ပြီး REST API ထက် **၇၀% ပိုမို ဈေးသက်သာသည်**။
  - OpenID Connect (OIDC) နှင့် OAuth 2.0 (JWT) Authorizer များ ထောက်ပံ့သည်။
* **REST API:**
  - ပိုမို ရှုပ်ထွေးသော Enterprise Features များ လိုအပ်သည့်အခါ သုံးရသည်:
  - API Keys, Usage Plans, Request/Response Data Transformation (VTL Templates), AWS WAF Integration, Private REST APIs (VPC Endpoints သီးသန့်) နှင့် Request Validation တို့ လိုအပ်ပါက REST API ကိုသာ မဖြစ်မနေ သုံးစွဲရသည်။

---

#### Q16: Amazon DynamoDB Single-Table Design ဆိုတာ ဘာလဲ? RDBMS Table များစွာနှင့် ဘာကြောင့် ကွာခြားသလဲ?
**အဖြေ:**
* **သဘောတရား:**
  DynamoDB တွင် User Table, Order Table, Product Table ဟု သီးခြား ခွဲမဆောက်ဘဲ Entity အားလုံးကို Generic Partition Key (`PK`) နှင့် Sort Key (`SK`) သတ်မှတ်၍ **Table တစ်ခုတည်းတွင် စုစည်း သိမ်းဆည်းသော ပုံစံ** ဖြစ်သည်။
* **အကျိုးကျေးဇူး:**
  - RDBMS တွင် `JOIN` လုပ်ရသော Data များကို DynamoDB တွင် `Query` တစ်ခုတည်းဖြင့် စက္ကန့်ပိုင်းအတွင်း တပြိုင်နက် ဆွဲထုတ်နိုင်သည် (ဥပမာ- `PK = USER#101`, `SK begins_with ORDER#`)။
  - Table တစ်ခုတည်းသာ Provision လုပ်ရသဖြင့် Database Request Unit (RCU/WCU) ကုန်ကျစရိတ်ကို အများအပြား ချွေတာနိုင်သည်။

---

#### Q17: AWS KMS (Key Management Service) တွင် AWS Managed Key နှင့် Customer Managed Key (CMK) မည်သို့ ကွာခြားသလဲ?
**အဖြေ:**
* **AWS Managed Key (`aws/s3`, `aws/rds`):**
  - AWS က အလိုအလျောက် အခမဲ့ ဖန်တီးပေးပြီး နှစ်စဉ် အလိုအလျောက် Key Rotation လုပ်ပေးသည်။
  - အားနည်းချက်: Key Policy ကို မိမိတို့ စိတ်ကြိုက် ပြင်ဆင်၍ မရပါ၊ Cross-Account Sharing ပြုလုပ်ရန် ခက်ခဲသည်။
* **Customer Managed Key (CMK):**
  - Developer က အစအဆုံး ပိုင်ဆိုင်ပြီး တစ်လလျှင် $1 ကုန်ကျသည်။
  - Key Policy တွင် မည်သည့် IAM Role သို့မဟုတ် CloudFront OAC ကသာ Decrypt လုပ်ခွင့်ရှိသည်ကို အသေးစိတ် ထိန်းချုပ်နိုင်သည်။
  - Security Audit (PCI-DSS, ISMS) စံနှုန်းများနှင့် ကိုက်ညီပြီး Key အား Disable ပြုလုပ်ခြင်း၊ Delete ပြုလုပ်ခြင်းနှင့် CloudTrail Audit မှတ်တမ်းများကို တိကျစွာ စစ်ဆေးနိုင်သည်။

---

#### Q18: CloudWatch Alarms တွင် Static Threshold နှင့် Anomaly Detection မည်သည့်အခါ သုံးသလဲ?
**အဖြေ:**
* **Static Threshold (ပုံသေ သတ်မှတ်ချက်):**
  - တိကျသော ကန့်သတ်ချက်များတွင် သုံးသည် (ဥပမာ- `RDS Disk Space Free < 10GB` သို့မဟုတ် `EC2 StatusCheckFailed >= 1`)။
* **Anomaly Detection (Machine Learning အခြေခံ):**
  - နေ့နှင့် ည၊ သို့မဟုတ် တနင်္လာနှင့် စနေ တူညီမှုမရှိဘဲ လှိုင်းထနေသော User Traffic Patterns များတွင် သုံးသည်။
  - CloudWatch သည် အတိတ်က Metric အချက်အလက် ၂ ပတ်စာကို လေ့လာပြီး ပုံမှန် Band မျဉ်းကြောင်းကို ဆွဲထားပေးသည်။ ပုံမှန်ထက် ထူးခြားစွာ Request ကျဆင်းသွားခြင်း သို့မဟုတ် ထိုးတက်လာခြင်း (Traffic Spike / Drop) ဖြစ်ပေါ်ပါက Alarm သတိပေးသည်။

---

#### Q19: AWS Well-Architected Framework ၏ မဏ္ဍိုင် (၆) ရပ် (Six Pillars) ကို အနှစ်ချုပ် ရှင်းပြပါ။
**အဖြေ:**
1. **Operational Excellence (運用上の優秀性):** Infrastructure as Code (IaC) ဖြင့် အလိုအလျောက် စီမံခြင်း၊ ပြောင်းလဲမှုများကို သေးငယ်စွာ မကြာခဏ Deploy လုပ်ခြင်းနှင့် အမှားများမှ သင်ခန်းစာယူခြင်း။
2. **Security (セキュリティ):** Identity Least Privilege၊ Data at Rest/In Transit Encryption နှင့် အလွှာတိုင်းတွင် ကာကွယ်ရေးတံတိုင်း ချထားခြင်း (Defense in Depth)။
3. **Reliability (信頼性):** Single Point of Failure မရှိစေဘဲ Multi-AZ ထားရှိခြင်း၊ ပျက်စီးသွားသော စနစ်များကို အလိုအလျောက် ကုစားနိုင်စေခြင်း (Self-healing & Auto Scaling)။
4. **Performance Efficiency (パフォーマンス効率):** သင့်လျော်သော Serverless / Container နည်းပညာ ရွေးချယ်ခြင်း၊ Caching (Redis/CloudFront) နှင့် Read Replicas အသုံးပြုခြင်း။
5. **Cost Optimization (コスト最適化):** မလိုအပ်သော စက်များ ပိတ်ခြင်း၊ Graviton နှင့် Savings Plans အသုံးပြုခြင်း၊ စရိတ်စကများကို Tag များဖြင့် စောင့်ကြည့်တိုင်းတာခြင်း။
6. **Sustainability (持続可能性):** သဘာဝပတ်ဝန်းကျင် ထိခိုက်မှု အနည်းဆုံးဖြစ်စေရန် မလိုအပ်သော Cloud Resource များ ပိုလျှံမနေစေဘဲ စွမ်းအင်အသုံးချမှု ထိရောက်စေခြင်း။

---

#### Q20: CI/CD Pipeline မှတစ်ဆင့် GitHub Actions ဖြင့် AWS ECS Fargate သို့ လုံခြုံစွာ Deploy တင်နည်း အဆင့်ဆင့်ကို ရှင်းပြပါ။
**အဖြေ:**
1. **OIDC (OpenID Connect) ဖြင့် Password-less Authentication:**
   - GitHub Repository ထဲတွင် Permanent AWS Access Key / Secret Key ကို မသိမ်းဆည်းရပါ။
   - AWS IAM တွင် GitHub OIDC Identity Provider ဆောက်ပြီး GitHub Actions Runner အတွက် ယာယီ AssumeRole ခွင့်ပြုပေးသည်။
2. **Docker Build & Push to ECR:**
   - GitHub Actions Runner က Source Code ကို Build ဆွဲပြီး Commit SHA Tag (ဥပမာ- `app:v1.2.0-abc1234`) ဖြင့် Amazon ECR သို့ Push တင်သည်။
3. **Render Task Definition:**
   - Task Definition JSON ဖိုင်ရှိ Image URI ကို အသစ် Push တင်ထားသော Image SHA ဖြင့် အစားထိုးသည်။
4. **AWS CodeDeploy / ECS Service Update:**
   - AWS CLI ဖြင့် `aws ecs update-service --force-new-deployment` ခေါ်ယူပြီး Container အသစ်များကို Rolling Update သို့မဟုတ် Blue/Green ပုံစံဖြင့် Zero-Downtime Deploy ပြုလုပ်သည်။
5. **Health Check & Verification:**
   - ALB Target Group က Container အသစ်များ Healthy ဖြစ်ကြောင်း အတည်ပြုပြီးမှသာ Traffic လွှဲပြောင်းပေးသည်။
