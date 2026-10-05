---
title: "၁၀။ Level 10 — High Availability, Disaster Recovery, Cost Optimization (FinOps) & Well-Architected Framework"
description: "High Availability (HA) ဆိုသည်မှာ System အတွင်းရှိ Hardware (Server, Hard Disk, Power Supply) သို့မဟုတ် Network Switch တစ်ခုခု ပျက်စီးချွတ်ယွင်းသွားစေကာမူ Servic"
---

## ၁၀။ Level 10 — High Availability, Disaster Recovery, Cost Optimization (FinOps) & Well-Architected Framework

---

## ၁၀.၁ High Availability (HA - 高可用性) & Single Point of Failure (SPOF)

### ၁. ဒီ Concept က ဘာလဲ? (What is it?)
**High Availability (HA)** ဆိုသည်မှာ System အတွင်းရှိ Hardware (Server, Hard Disk, Power Supply) သို့မဟုတ် Network Switch တစ်ခုခု ပျက်စီးချွတ်ယွင်းသွားစေကာမူ Service ရပ်တန့်မသွားဘဲ (Zero or Minimal Downtime ဖြင့်) အသုံးပြုသူများထံ ဆက်လက်ဝန်ဆောင်မှု ပေးနိုင်စွမ်းရှိသော စနစ်တည်ဆောက်ပုံ ဖြစ်သည်။

### ၂. ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Problem Statement & Real Example)
- **ပြဿနာ (SPOF - Single Point of Failure):** Tokyo Data Center ရှိ Availability Zone (AZ-1a) တစ်ခုတည်းတွင် EC2 Server တစ်လုံးနှင့် RDS MySQL တစ်လုံးတည်း ထားရှိသော စနစ်တစ်ခု ရှိသည်။ တစ်ညတွင် ထို Data Center ၏ Fiber Cable ပြတ်တောက်သွားခြင်း သို့မဟုတ် မီးပြတ်သွားသည့်အခါ EC Site တစ်ခုလုံး ပိတ်သွားပြီး နံနက်ပိုင်းအထိ ဝင်ငွေ ယန်းသန်းပေါင်းများစွာ ဆုံးရှုံးသွားသည်။
- **HA ဖြင့် ဖြေရှင်းချက်:** Multi-AZ Architecture ဖြင့် AZ-1a နှင့် AZ-1c နှစ်နေရာလုံးတွင် Server နှင့် Database များကို ခွဲထားလိုက်သည်။ AZ-1a ပျက်ကျသွားသော်လည်း ALB နှင့် RDS Auto Failover ကြောင့် User များမှာ မည်သည့် Error မှ မကြုံတွေ့ရဘဲ စနစ်သည် ဆက်လက် လည်ပတ်နေမည်။

### ၃. Japan Cloud Industry (現場) တွင် ဘာကြောင့် မဖြစ်မနေ သုံးတာလဲ?
ဂျပန်နိုင်ငံသည် ငလျင်နှင့် သဘာဝဘေးအန္တရာယ် မကြာခဏ ဖြစ်ပွားလေ့ရှိသော နိုင်ငံဖြစ်သဖြင့် Client များသည် **SLA (Service Level Agreement) 99.99% (တစ်နှစ်လျှင် Downtime ၅၂ မိနစ်အောက်)** ကို စာချုပ်တွင် မဖြစ်မနေ ထည့်သွင်း တောင်းဆိုကြသည်။ Single-AZ ဖြင့် Run ပါက SLA ကို မထိန်းနိုင်သဖြင့် Multi-AZ HA သည် ဂျပန် Production Project တိုင်း၏ မဖြစ်မနေ စံသတ်မှတ်ချက် (デファクトスタンダード) ဖြစ်သည်။

### ၄. Architecture Diagram: High Availability Web System
```
                              [ Internet (ユーザー) ]
                                         |
                            [ Route 53 (DNS Health Check) ]
                                         |
                           [ CloudFront CDN (Global Edge) ]
                                         |
                            [ AWS WAF (Security Shield) ]
                                         |
             [ Application Load Balancer (Public Subnets AZ-1a & AZ-1c) ]
                                         |
             +---------------------------+---------------------------+
             |                                                       |
  [ AZ-1a (Public/Private Subnet) ]                       [ AZ-1c (Public/Private Subnet) ]
  +-------------------------------+                       +-------------------------------+
  |  NAT Gateway AZ-1a            |                       |  NAT Gateway AZ-1c            |
  |  ECS Web Task 1 (Active)      |                       |  ECS Web Task 2 (Active)      |
  |  RDS Aurora Writer (Active)   | <=== Live Sync ====>  |  RDS Aurora Reader (Standby)  |
  +-------------------------------+                       +-------------------------------+
```

### ၅. ဘယ်အချိန်မှာ သုံးသင့်ပြီး ဘယ်အချိန်မှာ မသုံးသင့်ဘူးလဲ?
- **သုံးသင့်သည့် အချိန်:** Production Environment (本番環境), E-Commerce Sites, Payment Systems, Corporate Portals။
- **မသုံးသင့်သည့် အချိန်:** Local Development (開発環境), Staging စမ်းသပ်ကာလ (စရိတ် ၂ ဆ သက်သာစေရန် Single-AZ သာ ထားသင့်သည်)။

### ၆. Terraform ဖြင့် High Availability Multi-AZ တည်ဆောက်ပုံ
```hcl
# ALB အတွက် Subnets အနည်းဆုံး ၂ ခု Multi-AZ ထားရှိခြင်း
resource "aws_lb" "main" {
  name               = "prod-ha-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_1a.id, aws_subnet.public_1c.id]

  tags = { Environment = "Production", HA = "true" }
}

# RDS Aurora Multi-AZ Cluster (Writer in 1a, Reader in 1c)
resource "aws_rds_cluster" "aurora_ha" {
  cluster_identifier     = "prod-aurora-cluster"
  engine                 = "aurora-mysql"
  engine_version         = "8.0.mysql_aurora.3.04.0"
  availability_zones     = ["ap-northeast-1a", "ap-northeast-1c"]
  database_name          = "proddb"
  master_username        = "dbadmin"
  master_password        = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name
  skip_final_snapshot    = false
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count              = 2
  identifier         = "prod-aurora-instance-${count.index}"
  cluster_identifier = aws_rds_cluster.aurora_ha.id
  instance_class     = "db.r6g.large"
  engine             = aws_rds_cluster.aurora_ha.engine
}
```

---

## ၁၀.၂ Disaster Recovery (DR - ディザスタリカバリ) Deep Dive

### ၁. ဒီ Concept က ဘာလဲ? (What is it?)
**Disaster Recovery (DR)** ဆိုသည်မှာ ကြီးမားသော ငလျင်၊ ဆူနာမီ၊ မီးလောင်ကျွမ်းမှု သို့မဟုတ် ဒေသတွင်း Network ပြတ်တောက်မှုများကြောင့် **AWS Region တစ်ခုလုံး (ဥပမာ- Tokyo Region တစ်ခုလုံး)** ချို့ယွင်းပျက်စီးသွားပါက ဒုတိယ Region (ဥပမာ- Osaka Region) တွင် System ကို ပြန်လည် ထူထောင်လည်ပတ်နိုင်စေရန် ကြိုတင်ပြင်ဆင်ထားသော စနစ် ဖြစ်သည်။

### ၂. RPO နှင့် RTO ကို Beginner နားလည်အောင် ရှင်းလင်းချက်
- **RPO (Recovery Point Objective - 許容データ損失量):**
  - "ဘေးဒုက္ခဖြစ်ပြီးနောက် မည်မျှကြာသော အချိန်က Data ဆုံးရှုံးမှုကို ကုမ္ပဏီက လက်ခံနိုင်သလဲ?"
  - ဥပမာ- နေ့စဉ် ည ၁၂ နာရီတွင် တစ်ကြိမ်သာ Backup ယူသော စနစ်သည် မွန်းလွဲ ၂ နာရီတွင် ပျက်ကျပါက ၁၄ နာရီစာ စာရင်းများ အကုန်ဆုံးရှုံးမည် (RPO = 14 hours)။ ဘဏ်များတွင် RPO = 0 (Data လုံးဝ မဆုံးရှုံးရ) သတ်မှတ်သည်။
- **RTO (Recovery Time Objective - 許容停止時間):**
  - "စနစ်ပျက်ကျသွားပြီးနောက် မည်မျှမြန်မြန် ပြန်လည် လည်ပတ်နိုင်ရမည်လဲ (Downtime မည်မျှ ကြာခွင့်ရှိသလဲ)?"
  - ဥပမာ- Backup မှ Server အသစ် ပြန်ဆောက်ရန် ၂ နာရီ ကြာပါက RTO = 2 hours ဖြစ်သည်။

### ၃. DR Strategies ၄ မျိုး နှိုင်းယှဉ်ချက် (Cost vs Speed)
```
[ 1. Backup & Restore ]  စရိတ် အသက်သာဆုံး ($) | RPO: နာရီပိုင်း | RTO: ၂၄ နာရီအထိ ကြာနိုင်
  S3 Cross-Region Replication ဖြင့် Backup များကို Osaka သို့ ပို့ထားပြီး ပြဿနာဖြစ်မှ Terraform ဖြင့် ပြန်ဆောက်သည်။

[ 2. Pilot Light ]       စရိတ် သက်သာ ($$) | RPO: စက္ကန့်ပိုင်း | RTO: ၁၀ - ၃၀ မိနစ်
  Database ကို Osaka Region သို့ Live Sync Replicate လုပ်ထားသည်။ Application Server များကို ပိတ်ထားပြီး ဒုက္ခဖြစ်မှ ချက်ချင်း ဖွင့်သည်။

[ 3. Warm Standby ]      စရိတ် အသင့်အတင့် ($$$) | RPO: သုညနီးပါး | RTO: မိနစ်ပိုင်း
  Osaka Region တွင် Server နှင့် DB များကို အသေးစား (Scaled-down version) အမြဲ Run ထားပြီး Traffic ရောက်လာပါက Auto Scaling ဖြင့် အင်အားချဲ့သည်။

[ 4. Multi-Site Active-Active ] စရိတ် အမြင့်ဆုံး ($$$$) | RPO = 0 | RTO = 0 (Zero Downtime)
  Tokyo နှင့် Osaka နှစ်ဖက်စလုံးတွင် Full-scale Production System အပြိုင်အဆိုင် အမြဲတမ်း Live Run နေခြင်း။
```

### ၄. Tokyo (`ap-northeast-1`) မှ Osaka (`ap-northeast-3`) သို့ Failover ပြုလုပ်ပုံ အဆင့်ဆင့်
```
                                 [ Users / DNS ]
                                        |
                          [ Route 53 Failover Record ]
                         /                            \
              (Primary: 99.9%)                  (Secondary: Failover)
                       /                                \
           [ Tokyo Region (Live) ]             [ Osaka Region (Standby) ]
           - ALB + ECS Fargate                 - ALB + ECS Fargate
           - Aurora MySQL (Writer)             - Aurora Global DB (Secondary Replica)
                       \                                ^
                        +===== Storage Replication =====+
```
1. **Aurora Global Database တည်ဆောက်ခြင်း:** Tokyo ရှိ Aurora Cluster ၏ Storage-level replication ကို Osaka Region သို့ ချိတ်ဆက်ထားသည် (Lag time သည် 1 second အောက်သာ ရှိသည်)။
2. **S3 Cross-Region Replication (CRR):** S3 ရှိ User Upload ဖိုင်များကို Osaka S3 Bucket သို့ အလိုအလျောက် Sync လုပ်ထားသည်။
3. **Route 53 Health Check Failover:** Tokyo ALB မရတော့ပါက Route 53 က သိရှိပြီး Osaka ALB ဆီသို့ DNS Resolution ချက်ချင်း လွှဲပြောင်းပေးသည်။
4. **Aurora Failover Command:**
```bash
# Tokyo Region ပျက်စီးသွားပါက Osaka Cluster အား Primary Writer အဖြစ် အဆင့်မြှင့်တင်ခြင်း
aws rds failover-global-cluster \
  --global-cluster-identifier prod-global-ec-db \
  --target-db-cluster-identifier arn:aws:rds:ap-northeast-3:123456789012:cluster:osaka-prod-cluster \
  --region ap-northeast-3
```

---

## ၁၀.၃ FinOps & Cost Optimization (コスト最適化)

### ၁. ဒီ Concept က ဘာလဲ? (What is it?)
**FinOps (Cloud Financial Operations)** ဆိုသည်မှာ Cloud Architecture ကို တည်ဆောက်ရာတွင် နည်းပညာအရ ကောင်းမွန်ရုံသာမက **ငွေကြေးကုန်ကျစရိတ်ကို အလေအလွင့်မရှိစေရန် အဆက်မပြတ် တိုင်းတာ၊ သုံးသပ်၊ ချွေတာသော စနစ်** ဖြစ်သည်။

### ၂. Japan 現場တွင် မဖြစ်မနေ အသုံးပြုရသော Cost Reduction နည်းဗျူဟာများ:

#### နည်းဗျူဟာ (၁) — Compute Right-Sizing
- **ပြဿနာ:** အစပိုင်းတွင် မသိသဖြင့် EC2 `t3.2xlarge` (8 vCPU, 32GB RAM - တစ်လ ~$250) ကို ယူထားသော်လည်း CloudWatch တွင် CPU Average သည် 5% သာ ရှိနေသည်။
- **ဖြေရှင်းချက်:** `t3.medium` (2 vCPU, 4GB RAM - တစ်လ ~$30) သို့ ပြောင်းလဲလိုက်ပါက တစ်လလျှင် $220 (၈၈%) ချက်ချင်း သက်သာသွားမည်။

#### နည်းဗျူဟာ (၂) — AWS Graviton (ARM Processors) သို့ ပြောင်းခြင်း
- Intel/AMD (x86) အစား AWS ၏ Custom ARM Chip ဖြစ်သော **Graviton 3 (c7g, m7g, t4g)** Instance များကို ရွေးချယ်ပါ။
- အကျိုးကျေးဇူး: Performance ၂၀% ပိုမိုမြန်ဆန်ပြီး ကုန်ကျစရိတ် ၂၀% သက်သာသည်။

#### နည်းဗျူဟာ (၃) — Savings Plans & Reserved Instances (RI)
- Production တွင် အနည်းဆုံး ၁ နှစ် ဆက်တိုက် Run မည့် စက်များအတွက် On-Demand အစား **Compute Savings Plans (1 Year / 3 Years No Upfront)** ဝယ်ယူပါက **၄၀% မှ ၇၂% အထိ Discount** ရရှိသည်။

#### နည်းဗျူဟာ (၄) — NAT Gateway စရိတ်လျှော့ချခြင်း (အလွန်အရေးကြီး)
- NAT Gateway ၁ လုံးသည် တစ်လလျှင် Fixed Cost ~$32 ကျသင့်ပြီး Data Transfer 1GB လျှင် $0.062 ကုန်ကျသည်။
- Subnet ၃ ခုအတွက် NAT Gateway ၃ လုံးဆောက်ပါက Fixed Cost သာလျှင် $100 နီးပါး ဖြစ်နေမည်။
- **ဖြေရှင်းချက်:** Development (開発環境) တွင် AZ-1a တွင် NAT Gateway ၁ လုံးသာ ထားရှိပြီး AZ အားလုံးကို ထိုတစ်ခုတည်းမှ မျှဝေသုံးစွဲစေပါ (Shared NAT GW)။ ထို့အပြင် S3 နှင့် DynamoDB သို့ သွားသော Traffic များအတွက် **VPC Gateway Endpoints (Free of charge)** ကို မဖြစ်မနေ ချိတ်ဆက်ပါ။

#### နည်းဗျူဟာ (၅) — S3 Lifecycle & Intelligent-Tiering
- မကြာခဏ အသုံးမပြုသော ဖိုင်များကို S3 Standard-IA သို့မဟုတ် Glacier Deep Archive သို့ ရွှေ့ပြောင်းခြင်းဖြင့် Storage စရိတ် ၇၀% မှ ၉၅% အထိ လျှော့ချနိုင်သည်။

---

## ၁၀.၄ AWS Well-Architected Framework (၆ မဏ္ဍိုင်)

ဂျပန် IT ကုမ္ပဏီများတွင် Architecture Review (設計審査) ပြုလုပ်သည့်အခါ အောက်ပါ မဏ္ဍိုင် ၆ ရပ်ဖြင့် အကဲဖြတ်သည်:

```
+-------------------------------------------------------------------------------+
|                      AWS WELL-ARCHITECTED 6 PILLARS                           |
|-------------------------------------------------------------------------------|
| 1. Operational Excellence (運用の優秀性):                                      |
|    - အရာရာကို Code အဖြစ် Run ပါ (IaC - Terraform)။                             |
|    - ပြောင်းလဲမှုများကို သေးငယ်စွာနှင့် မကြာခဏ လုပ်ဆောင်ပါ (Small & Frequent)။     |
|    - Failure များကို ကြိုတင်ခန့်မှန်းပြီး Runbook ရေးဆွဲထားပါ။                   |
|-------------------------------------------------------------------------------|
| 2. Security (セキュリティ):                                                   |
|    - အလွှာတိုင်းတွင် ကာကွယ်ပါ (Defense in Depth: WAF -> SG -> IAM)။            |
|    - Least Privilege (အနည်းဆုံး လိုအပ်သော အခွင့်အရေးသာ ပေးပါ)။                   |
|    - Data at Rest & in Transit ကို မဖြစ်မနေ Encrypt ပြုလုပ်ပါ (KMS, HTTPS)။      |
|-------------------------------------------------------------------------------|
| 3. Reliability (信頼性):                                                      |
|    - Single Point of Failure မရှိစေရ (Multi-AZ Deployment)။                    |
|    - Failure ဖြစ်ပါက အလိုအလျောက် ပြန်ကုစားနိုင်ရမည် (Self-healing & Auto Scaling)။ |
|    - RPO နှင့် RTO ကို တိကျစွာ သတ်မှတ်ထားပါ။                                   |
|-------------------------------------------------------------------------------|
| 4. Performance Efficiency (パフォーマンス効率):                                |
|    - Serverless နှင့် Managed Service များကို ဦးစားပေးပါ။                      |
|    - CDN (CloudFront) နှင့် In-Memory Cache (Redis) ကို ထိရောက်စွာ သုံးပါ။       |
|-------------------------------------------------------------------------------|
| 5. Cost Optimization (コスト最適化):                                           |
|    - အသုံးမလိုသော စက်များကို ပိတ်ထားပါ (Right-Sizing)။                          |
|    - Graviton Processors နှင့် Savings Plans ကို အသုံးချပါ။                     |
|-------------------------------------------------------------------------------|
| 6. Sustainability (持続可能性 - 環境負荷低減):                                 |
|    - စွမ်းအင် အလေအလွင့် နည်းစေရန် အမြင့်ဆုံး စွမ်းဆောင်ရည်ရှိသော Resource ကို ရွေးပါ။|
+-------------------------------------------------------------------------------+
```

---

## ၁၀.၅ Hands-on Exercise: AWS Budgets ဖြင့် စရိတ်စောင့်ကြည့် Alert တပ်ဆင်ခြင်း

### ရည်ရွယ်ချက်:
လစဉ် AWS စရိတ်သည် $50 ကျော်သွားပါက သို့မဟုတ် ခန့်မှန်းခြေ စရိတ်သည် $50 ကျော်နိုင်ခြေ ရှိပါက မိမိ၏ Email နှင့် Slack သို့ Alert ပို့စေရန် Configure လုပ်ခြင်း။

### AWS CLI ဖြင့် Budget ဖန်တီးခြင်း:
```bash
# Budget Definition JSON ဖိုင် တည်ဆောက်ခြင်း
cat <<EOF > budget.json
{
  "BudgetName": "Monthly-Cost-Alert-50USD",
  "BudgetLimit": {
    "Amount": "50",
    "Unit": "USD"
  },
  "CostFilters": {},
  "CostTypes": {
    "IncludeTax": true,
    "IncludeSubscription": true,
    "UseBlended": false,
    "IncludeRefund": false,
    "IncludeCredit": false,
    "IncludeUpfront": true,
    "IncludeRecurring": true,
    "IncludeOtherSubscription": true,
    "IncludeSupport": true,
    "IncludeDiscount": true,
    "UseAmortized": false
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
EOF

# Notification Definition JSON ဖိုင်
cat <<EOF > notifications.json
[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [
      {
        "SubscriptionType": "EMAIL",
        "Address": "your-email@example.com"
      }
    ]
  }
]
EOF

# Budget ကို AWS Account အတွင်း ဖန်တီးခြင်း
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### Verification & စစ်ဆေးခြင်း:
1. AWS Console -> **AWS Budgets** သို့ သွားပါ။
2. `Monthly-Cost-Alert-50USD` ပေါ်လာပြီး လက်ရှိ အသုံးပြုမှု ရာခိုင်နှုန်း (Bar chart) ဖြင့် ပြသနေသည်ကို စစ်ဆေးပါ။

---
*နောက်အခန်းသို့ သွားရန်:* [11_Level11_Japanese_Workplace_IT_and_Tickets.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/11_Level11_Japanese_Workplace_IT_and_Tickets.md)
