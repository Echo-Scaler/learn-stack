---
title: "၁၁။ Level 11 — Japanese Workplace IT Vocabulary & 25 Real-Work Ticket Labs (現場実務シミュレーション)"
description: "ဂျပန် IT Cloud လုပ်ငန်းခွင် (現場 - Genba) တွင် နေ့စဉ် တွေ့ဆုံအသုံးပြုရသော မဖြစ်မနေသိရမည့် ဝေါဟာရ ၂၅ မျိုး:"
---

## ၁၁။ Level 11 — Japanese Workplace IT Vocabulary & 25 Real-Work Ticket Labs (現場実務シミュレーション)

---

## ၁၁.၁ Japanese IT Terminology (現場で必須のIT実務用語集)

ဂျပန် IT Cloud လုပ်ငန်းခွင် (現場 - Genba) တွင် နေ့စဉ် တွေ့ဆုံအသုံးပြုရသော မဖြစ်မနေသိရမည့် ဝေါဟာရ ၂၅ မျိုး:

| No | 漢字 / カタカナ | 読み方 (Romaji) | English / Technical Meaning | မြန်မာလို အဓိပ္ပာယ်ရှင်းလင်းချက် |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **要件定義** | Youken Teigi | Requirement Definition | Client လိုချင်သော System Feature, Traffic, SLA လိုအပ်ချက်များကို မေးမြန်းသတ်မှတ်ခြင်း |
| 2 | **基本設計** | Kihon Sekkei | High-Level Design (HLD) | အကြမ်းဖျင်း System Architecture, VPC Network မူဘောင်နှင့် Service ရွေးချယ်မှု ရေးဆွဲခြင်း |
| 3 | **詳細設計** | Shousai Sekkei | Low-Level Design (LLD) | Parameter, IP CIDR, Security Group Rule တစ်ခုချင်း အသေးစိတ် Specifications ရေးဆွဲခြင်း |
| 4 | **構築** | Kouchiku | Infrastructure Construction | AWS ပေါ်တွင် Server, Database, Load Balancer များကို အမှန်တကယ် ဆောက်လုပ်ခြင်း |
| 5 | **実装** | Jissou | Implementation / Coding | Application Code ရေးသားခြင်း သို့မဟုတ် Terraform Code အမှန်တကယ် ရေးဖွဲ့ခြင်း |
| 6 | **単体テスト** | Tantai Tesuto | Unit Test | Component သို့မဟုတ် Module တစ်ခုချင်းစီကို သီးခြား ခွဲထုတ် စမ်းသပ်ခြင်း |
| 7 | **結合テスト** | Ketsugou Tesuto | Integration Test | Server နှင့် Database, API အချင်းချင်း ချိတ်ဆက်မှု အဆင်ပြေမပြေ ပေါင်းစပ် စမ်းသပ်ခြင်း |
| 8 | **本番環境** | Honban Kankyou | Production Environment | User အစစ်အမှန်များ အသုံးပြုနေသော Live စနစ် |
| 9 | **検証環境 / STG** | Kenshou / Sute-jingu | Staging Environment | Production နှင့် ပုံစံတူ ထားရှိပြီး Deploy မလုပ်မီ နောက်ဆုံး စမ်းသပ်သည့် စနစ် |
| 10 | **開発環境 / DEV** | Kaihatsu Kankyou | Development Environment | Developer များ နေ့စဉ် စမ်းသပ် Code ရေးသော စနစ် |
| 11 | **障害対応** | Shouga Taiou | Incident / Troubleshooting | System ပျက်ကျခြင်း သို့မဟုတ် Error တက်လာပါက အရေးပေါ် စုံစမ်း ပြုပြင်ခြင်း |
| 12 | **切り戻し** | Kirimodoshi | Rollback | Deploy အသစ်ကြောင့် Error တက်ပါက မူလ Version ဟောင်းသို့ ချက်ချင်း ပြန်လှည့်ခြင်း |
| 13 | **リリース** | Riri-su | Release / Production Deploy | စနစ်အသစ် သို့မဟုတ် Feature အသစ်ကို Production သို့ စတင် လွှင့်တင်ခြင်း |
| 14 | **可用性** | Kayousei | Availability | စနစ်တစ်ခု အချိန်မရွေး အသုံးပြုနိုင်စွမ်း ရှိမှု (Uptime) |
| 15 | **冗長化** | Joutyouka | Redundancy | စက်တစ်လုံး ပျက်သော်လည်း မရပ်တန့်စေရန် အရန်စက်များ ထပ်ဆောင်းထားရှိခြင်း (Multi-AZ) |
| 16 | **負荷分散** | Fuka Bunsan | Load Balancing | ဝင်လာသော User Traffic ဝန်ကို Server များစွာဆီသို့ မျှဝေပေးခြင်း (ALB) |
| 17 | **性能 / パフォーマンス** | Seinon / Pafo-mansu | Performance | စနစ်၏ မြန်ဆန်မှုနှင့် Request လက်ခံနိုင်စွမ်း (Latency, Throughput) |
| 18 | **運用** | Unyou | Operations | နေ့စဉ် စနစ်ပုံမှန် လည်ပတ်နေစေရန် စောင့်ကြည့်ထိန်းကျောင်းခြင်း |
| 19 | **保守** | Hoshu | Maintenance | လုံခြုံရေး Patch တင်ခြင်း၊ Version Upgrade ပြုလုပ်ခြင်း |
| 20 | **監視** | Kanshi | Monitoring | CloudWatch ဖြင့် Metric, Log များကို စောင့်ကြည့်ခြင်း |
| 21 | **バックアップ** | Bakkuappu | Backup | Data ပျက်စီးပါက အစားထိုးနိုင်ရန် ကြိုတင် ကူးယူသိမ်းဆည်းထားခြင်း |
| 22 | **復旧 / リストア** | Fukkyuu / Risutoa | Recovery / Restore | ပျက်စီးသွားသော စနစ် သို့မဟုတ် Data ကို မူလအခြေအနေသို့ ပြန်လည် ထူထောင်ခြင်း |
| 23 | **アクセス制御** | Akusesu Seigyo | Access Control | IAM Policy နှင့် Security Group ဖြင့် ဝင်ရောက်ခွင့် ကန့်သတ်ခြင်း |
| 24 | **踏み台サーバー** | Fumidai Sa-ba- | Bastion Host / Jump Server | Private Subnet ရှိ Server များဆီသို့ ဝင်ရောက်ရန် ကြားခံ ဖြတ်သန်းရသော Server |
| 25 | **証跡管理** | Shouseki Kanri | Audit Trail Management | CloudTrail ဖြင့် မည်သူဘာလုပ်သွားသည်ကို သက်သေအထောက်အထား မှတ်တမ်းတင်ခြင်း |

---

## ၁၁.၂ Real-Work Ticket Simulations (၂၅ ခု လက်တွေ့ 現場 စိန်ခေါ်မှုများ)

---

### Ticket 01 — 本番環境EC2へのSSHアクセス制限およびSSM Session Manager移行

```markdown
【チケット番号】 AWS-SEC-2026-001
【タイトル】 本番環境EC2へのSSHアクセス制限およびSSM Session Manager移行の件
【優先度】 高 (High)
【担当者】 Cloud Infrastructure Engineer
【要件概要】
セキュリティ監査 (Security Audit) の指摘に基づき、本番WebサーバーEC2のInbound Port 22 (SSH)を完全に閉鎖し、
AWS Systems Manager (SSM) Session Manager経由のみでターミナルアクセスできるように設定を変更する。
```
- **ပြဿနာနောက်ခံ:** Port 22 ပွင့်နေပါက Brute-force တိုက်ခိုက်ခံရနိုင်ပြီး `.pem` key ပေါက်ကြားပါက အန္တရာယ်ရှိသည်။
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. EC2 ၏ IAM Role တွင် `AmazonSSMManagedInstanceCore` Policy ချိတ်ပါ။
  2. EC2 Security Group တွင် Inbound Port 22 Rule အား ဖျက်ပစ်ပါ။
  3. CLI ဖြင့် Session Manager စမ်းသပ်ဝင်ရောက်ပါ။
```bash
# 1. IAM Role အား Policy ချိတ်ခြင်း
aws iam attach-role-policy --role-name Prod-EC2-App-Role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
# 2. Port 22 Inbound ဖျက်ခြင်း
aws ec2 revoke-security-group-ingress --group-id sg-0123456789web --protocol tcp --port 22 --cidr 0.0.0.0/0
# 3. Connection Verification
aws ssm start-session --target i-0123456789abcdef0
```
- **Rollback Plan:** အကယ်၍ ချိတ်မရပါက `aws ec2 authorize-security-group-ingress` ဖြင့် Admin IP သို့ Port 22 ယာယီ ပြန်ဖွင့်ပေးရန်။

---

### Ticket 02 — Webサイトレスポンス遅延に伴うElastiCache Redis導入

```markdown
【チケット番号】 AWS-PERF-2026-002
【タイトル】 データベース負荷軽減のためのRedisキャッシュクラスタ構築
【優先度】 高 (High)
【担当者】 Cloud Database Engineer
【要件概要】
ECサイトのトップページ表示時、商品一覧クエリが毎秒300回RDS MySQLに集中し、CPUが85%を超過している。
ElastiCache Redisを導入し、クエリ結果をキャッシュしてDB負荷を軽減する。
```
- **ပြဿနာနောက်ခံ:** MySQL ပေါ်တွင် SELECT Query ပိနေသဖြင့် Response Time ၃ စက္ကန့်ကျော် နှေးကွေးနေသည်။
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. Private Subnet များတွင် ElastiCache Subnet Group ဆောက်ပါ။
  2. EC2 SG မှ Port 6379 သာ ခွင့်ပြုထားသော Security Group ဆောက်ပါ။
  3. Redis Cluster (Engine 7.0, `cache.t4g.medium`) တည်ဆောက်ပါ။
```bash
# Redis Subnet Group ဆောက်ခြင်း
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name prod-redis-subnet-group \
  --cache-subnet-group-description "Subnets for Redis" \
  --subnet-ids "subnet-01234567891a" "subnet-01234567891c"

# Redis Replication Group ဆောက်ခြင်း
aws elasticache create-replication-group \
  --replication-group-id prod-redis-cluster \
  --replication-group-description "Prod Redis Cache" \
  --engine redis \
  --cache-node-type cache.t4g.medium \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --cache-subnet-group-name prod-redis-subnet-group \
  --security-group-ids "sg-0123456789redis"
```
- **စစ်ဆေးခြင်း:** EC2 ပေါ်မှ `redis-cli -h <primary-endpoint> ping` ရိုက်ပါက `PONG` ပြန်ရမည်။

---

### Ticket 03 — S3バケットPublic Access遮断およびOAC経由CloudFront配信化

```markdown
【チケット番号】 AWS-SEC-2026-003
【タイトル】 S3バケット完全非公開化およびCloudFront OAC移行
【優先度】 緊急 (Critical)
【担当者】 Security Engineer
【要件概要】
画像アセット用S3バケットがパブリック公開されており情報漏洩リスクがある。
Block Public Accessを有効化し、CloudFrontのOrigin Access Control (OAC)経由のみでセキュアに配信する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. S3 ပေါ်ရှိ Block Public Access အား အကုန် `true` ပေးပါ။
  2. CloudFront တွင် OAC ဖန်တီးပြီး S3 Bucket Policy တွင် CloudFront ARN သာ ခွင့်ပြုပေးပါ။
```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Sid": "AllowCloudFrontOAC",
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::japan-prod-assets/*",
    "Condition": {
      "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/EDFDVBD6EXAMPLE" }
    }
  }
}
```
- **စစ်ဆေးခြင်း:** S3 Direct URL ဖြင့် ခေါ်ပါက `403 Forbidden` ဖြစ်ရမည်ဖြစ်ပြီး CloudFront Domain ဖြင့် ခေါ်ပါက ပုံ ပွင့်ရမည်။

---

### Ticket 04 — ACM証明書発行およびALBのHTTPS化 (HTTP to HTTPS 301 Redirect)

```markdown
【チケット番号】 AWS-NET-2026-004
【タイトル】 本番ドメインの常時SSL化 (HTTPSリダイレクト設定)
【優先度】 高 (High)
【要件概要】
本番Webサイト (example.com) を常時HTTPS化するため、ACMでパブリックSSL証明書を発行し、
ALBに適用。HTTP(Port 80)へのアクセスをHTTPS(Port 443)へ301恒久リダイレクトする。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. AWS ACM တွင် DNS Validation ဖြင့် Certificate တောင်းပါ။ Route 53 တွင် CNAME ထည့်ပါ။
  2. ALB တွင် Listener Port 443 (HTTPS) ဆောက်ပြီး Certificate တွဲပါ။
  3. Port 80 Listener တွင် Redirect Action ထည့်ပါ:
```bash
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:listener/app/prod-alb/123/456 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"
```
- **စစ်ဆေးခြင်း:** `curl -I http://example.com` တွင် `HTTP/1.1 301 Moved Permanently` နှင့် `Location: https://example.com/` ပြရမည်။

---

### Ticket 05 — セールイベント対策としてのAuto Scaling Group (ASG) 構築

```markdown
【チケット番号】 AWS-OPS-2026-005
【タイトル】 スパイクアクセスに備えたEC2 Auto Scaling設定
【優先度】 高 (High)
【要件概要】
来週のテレビ放映に伴うアクセス急増(平常時の5倍)に備え、Webサーバーを2台から最大10台まで
CPU使用率60%をトリガーに自動スケールアウトするようASGを構築する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. Launch Template တည်ဆောက်ပါ (AMI, Instance Type `t3.medium`, User Data ဖြင့် App start)။
  2. ASG ဆောက်ပါ (`min=2`, `desired=2`, `max=10`)။
  3. Target Tracking Policy ဖြင့် `ASGAverageCPUUtilization = 60` သတ်မှတ်ပါ။
```bash
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name prod-web-asg \
  --policy-name cpu-target-tracking-60 \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://config.json
```

---

### Ticket 06 — 開発環境NAT Gatewayコスト削減 (Single-AZ化およびS3 Endpoint導入)

```markdown
【チケット番号】 AWS-COST-2026-006
【タイトル】 開発環境におけるNAT Gateway費用削減およびS3 Gateway Endpoint導入
【優先度】 中 (Medium)
【要件概要】
開発環境(DEV)でAZごとに3台設置されているNAT Gatewayを1台に集約し、
S3への通信を無料のVPC Gateway Endpoint経由に迂回して月額約$150削減する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. DEV Private Route Tables များအားလုံးတွင် `0.0.0.0/0` ကို AZ-1a ရှိ NAT GW တစ်ခုတည်းသို့ ညွှန်းပါ။
  2. ကျန် NAT GW ၂ ခုကို Delete လုပ်ပြီး Elastic IP များကို Release ပြုလုပ်ပါ။
  3. S3 အတွက် Free Gateway Endpoint တည်ဆောက်ပြီး Route Table တွင် ချိတ်ဆက်ပါ။
```bash
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-0123456789dev \
  --service-name com.amazonaws.ap-northeast-1.s3 \
  --route-table-ids rtb-0123456789app
```

---

### Ticket 07 — RDS MySQLのMulti-AZ冗長化およびフェイルオーバー訓練

```markdown
【チケット番号】 AWS-DB-2026-007
【タイトル】 RDS MySQLの高可用性化 (Multi-AZ化) と切り替え訓練
【優先度】 高 (High)
【要件概要】
単一AZで稼働しているRDSを無停止でMulti-AZ配置に変更し、
週末の定期メンテナンス時間帯に強制フェイルオーバーを実施してダウンタイムが60秒以内であることを確認する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
```bash
# Multi-AZ အဖြစ် ပြောင်းလဲခြင်း
aws rds modify-db-instance --db-instance-identifier prod-mysql-db --multi-az --apply-immediately

# ဖေးလ်အိုဗာ စမ်းသပ်ခြင်း (Failover Drill)
aws rds reboot-db-instance --db-instance-identifier prod-mysql-db --force-failover
```
- **စစ်ဆေးခြင်း:** Application Log တွင် ၆၀ စက္ကန့်အတွင်း DB Connection ပြန်လည် ချိတ်ဆက်မိခြင်း ရှိမရှိ စစ်ဆေးပါ။

---

### Ticket 08 — Aurora MySQLへのリードレプリカ追加による参照クエリ負荷分散

```markdown
【チケット番号】 AWS-DB-2026-008
【タイトル】 Aurora MySQLリーダーインスタンス増設および参照エンドポイント適用
【優先度】 中 (Medium)
【要件概要】
データ集計バッチ処理によりWriterインスタンスのCPUが高騰している。
Readerインスタンスを1台増設し、Laravelの `database.php` で `read` と `write` の接続先を分離する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. Aurora Cluster တွင် Reader Instance အသစ် ထည့်သွင်းပါ။
  2. Laravel `config/database.php` တွင်:
```php
'mysql' => [
    'write' => [ 'host' => env('DB_HOST_WRITER') ],
    'read'  => [ 'host' => env('DB_HOST_READER') ],
],
```

---

### Ticket 09 — EC2モノリスアプリケーションのDockerコンテナ化およびECR登録

```markdown
【チケット番号】 AWS-CNT-2026-009
【タイトル】 Webアプリのコンテナ化およびECRリポジトリへの初回プッシュ
【優先度】 中 (Medium)
【要件概要】
EC2で直接動いているLaravel環境をコンテナ移行するため、本番用Dockerfileを整備し、
ECRにリポジトリを作成してタグ付きイメージをプッシュする。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
```bash
# ECR Repo ဆောက်ခြင်း
aws ecr create-repository --repository-name prod-web-app --image-scanning-configuration scanOnPush=true
# Build & Push
docker build -t prod-web-app:v1.0.0 .
docker tag prod-web-app:v1.0.0 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/prod-web-app:v1.0.0
docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/prod-web-app:v1.0.0
```

---

### Ticket 10 — ECS Fargateサービス新規構築およびALBターゲットグループ連携

```markdown
【チケット番号】 AWS-CNT-2026-010
【タイトル】 ECS Fargate本番Webサービスの構築
【優先度】 高 (High)
【要件概要】
プッシュされたコンテナイメージを用いて、ECS Fargateタスク定義を作成。
Private Subnetに2タスク起動し、ALBターゲットグループと紐づけてルーティングを確立する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
  1. Task Definition JSON register လုပ်ပါ။
  2. Service ဆောက်ပြီး `awsvpcConfiguration` တွင် Private Subnets ထည့်ပါ။ Target Group တွဲပါ။

---

### Ticket 11 — 注文処理非同期化のためのSQSキューおよびデッドレターキュー(DLQ)構築

```markdown
【チケット番号】 AWS-APP-2026-011
【タイトル】 注文処理パイプラインのSQS導入およびエラー退避用DLQ設定
【優先度】 高 (High)
【要件概要】
外部決済APIの遅延が注文処理全体をブロックしている。
SQSキューで非同期化し、3回リトライ失敗したメッセージを退避するDLQを紐づける。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:**
```bash
# 1. DLQ ဆောက်ခြင်း
DLQ_ARN=$(aws sqs create-queue --queue-name order-dlq --query QueueArn --output text)

# 2. Main Queue ကို Redrive Policy ဖြင့် ချိတ်ဆောက်ခြင်း
aws sqs create-queue --queue-name order-queue --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"'"$DLQ_ARN"'\",\"maxReceiveCount\":\"3\"}",
  "VisibilityTimeout": "60"
}'
```

---

### Ticket 12 — 新規会員登録通知のためのSNS Fan-Outアーキテクチャ実装

```markdown
【チケット番号】 AWS-APP-2026-012
【タイトル】 会員登録イベントのSNS Fan-Out配信構成
【優先度】 中 (Medium)
【要件概要】
ユーザー登録時、(1)ウェルカムメール送信、(2)社内Slack通知、(3)CRM同期 の3つの処理を
疎結合に実行するため、SNSトピックを作成し各処理キューへFan-Out配信する。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:** SNS Topic တစ်ခု ဆောက်ပြီး SQS Queue ၃ ခုသို့ Subscribe လုပ်ပါ။

---

### Ticket 13 — 毎日深夜の自動DBバッチ処理用EventBridgeスケジュールおよびLambda構築

```markdown
【チケット番号】 AWS-SRV-2026-013
【タイトル】 深夜データアーカイブバッチのサーバレス定期実行設定
【優先度】 中 (Medium)
【要件概要】
毎日日本時間深夜2:00 (UTC 17:00) に古い未決済カートデータを論理削除するLambda関数を、
Amazon EventBridgeのCronスケジュール機能を用いて定期実行する。
```
- **Cron Expression:** `cron(0 17 * * ? *)`
```bash
aws events put-rule --name DailyCartCleanupRule --schedule-expression "cron(0 17 * * ? *)"
aws events put-targets --rule DailyCartCleanupRule --targets "Id=1,Arn=arn:aws:lambda:...:function:CartCleanup"
```

---

### Ticket 14 — 機密情報管理のためのAWS Secrets Manager移行 (.env平文排除)

```markdown
【チケット番号】 AWS-SEC-2026-014
【タイトル】 DBパスワードおよび決済APIキーのSecrets Manager移行
【優先度】 緊急 (Critical)
【要件概要】
Gitリポジトリや.envファイルにハードコードされているデータベースパスワードとStripe秘密鍵を
AWS Secrets Managerに登録し、ECSタスク起動時に環境変数として安全にインジェクションする。
```
- **လုပ်ဆောင်ရမည့် အဆင့်ဆင့်:** Secrets Manager တွင် JSON သိမ်းပြီး ECS Task Definition ၏ `secrets` block တွင် `valueFrom: <secret-arn>` ဖြင့် ချိတ်ပါ။

---

### Ticket 15 — S3およびEBSの暗号化強化のためのAWS KMS (Customer Managed Key) 導入

```markdown
【チケット番号】 AWS-SEC-2026-015
【タイトル】 S3およびEBSのカスタマー管理型KMSキー (CMK) による暗号化
【優先度】 高 (High)
【要件概要】
金融機関監査要件を満たすため、AWS管理キーから自社管理のKMS CMKキーへ切り替え、
年次キーローテーションを有効化する。
```
- **Command:** `aws kms create-key --description "Prod Data CMK"` နှင့် `aws kms enable-key-rotation --key-id <key-id>`.

---

### Ticket 16 — Webアプリケーション層へのAWS WAF導入 (SQLi/XSS/レート制限)

```markdown
【チケット番号】 AWS-SEC-2026-016
【タイトル】 ALBへのAWS WAF適用および不正アクセス遮断ルール設定
【優先度】 緊急 (Critical)
【要件概要】
海外IPからの脆弱性スキャンおよびブルートフォース攻撃を遮断するため、
ALBにAWS WAFを関連付け、AWSマネージドルール (Core, SQLi) とレート制限(5分間300回超)を適用する。
```
- **Rules to Add:** `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesSQLiRuleSet`, `RateBasedRule (300 requests / 5 mins)`.

---

### Ticket 17 — 不審な通信検知のためのAmazon GuardDuty有効化およびSlack通知

```markdown
【チケット番号】 AWS-SEC-2026-017
【タイトル】 Amazon GuardDutyの全リージョン有効化とインシデントSlack通知
【優先度】 高 (High)
【要件概要】
アカウント内の不正通信や認証情報流出をAI検知するためGuardDutyを有効化。
重大度「High」の脅威検知時にEventBridge経由でSlackチャンネルへ即時アラート送信する。
```
- **Command:** `aws guardduty create-detector --enable`.

---

### Ticket 18 — 本番リソース変更追跡のためのCloudTrailマルチリージョン証跡設定

```markdown
【チケット番号】 AWS-SEC-2026-018
【タイトル】 監査ログ収集のためのCloudTrailマルチリージョン証跡設定
【優先度】 高 (High)
【要件概要】
全リージョンのManagement Eventsを改ざん防止機能(Log File Validation)付きで専用S3バケットに永久保管する。
```
- **Command:** `aws cloudtrail create-trail --name prod-audit-trail --s3-bucket-name prod-audit-logs --is-multi-region-trail --enable-log-file-validation`.

---

### Ticket 19 — ALB 5xxエラー急増時の緊急Slack通知アラーム構築

```markdown
【チケット番号】 AWS-MON-2026-019
【タイトル】 HTTP 5xxエラー検知CloudWatchアラームの構築
【優先度】 高 (High)
【要件概要】
ALBにおいて5分間にHTTP 5xxエラーが10件以上発生した場合、
システム障害の疑いがあるためSNS経由でオンコールエンジニアへ緊急通知する。
```
- **Metric:** `HTTPCode_Target_5XX_Count` >= 10 for period 300s.

---

### Ticket 20 — CloudWatch Logs InsightsによるLaravelエラーログ集計ダッシュボード

```markdown
【チケット番号】 AWS-MON-2026-020
【タイトル】 本番アプリケーションエラーログの可視化ダッシュボード作成
【優先度】 中 (Medium)
【要件概要】
ECS上のLaravelログからFatal ErrorおよびSQLSTATEエラーの発生頻度を
CloudWatch Logs Insightsクエリで抽出し、ウィジェットとしてダッシュボードに配置する。
```

---

### Ticket 21 — GitHub ActionsによるECRビルドおよびECS Fargate無停止デプロイCI/CD

```markdown
【チケット番号】 AWS-CICD-2026-021
【タイトル】 本番ECS Fargate向けGitHub Actions自動デプロイパイプライン構築
【優先度】 高 (High)
【要件概要】
Git mainブランチへのマージをトリガーに、テスト、Dockerビルド、ECRプッシュ、
ECSタスク定義更新およびローリングアップデートを完全自動化する。
```

---

### Ticket 22 — 本番インフラのコード化 (TerraformによるVPC自動構築)

```markdown
【チケット番号】 AWS-IAC-2026-022
【タイトル】 本番VPCおよびサブネットのTerraformリファクタリング
【優先度】 中 (Medium)
【要件概要】
手動作成されていたVPC環境をIaC化するため、S3+DynamoDBのRemote Stateを用いた
Terraformコードを作成し、`terraform import` で安全にコード管理下へ移行する。
```

---

### Ticket 23 — 東京リージョン障害対策としての大阪リージョンS3レプリケーション (CRR)

```markdown
【チケット番号】 AWS-DR-2026-023
【タイトル】 災害復旧 (DR) 対策としてのS3 Cross-Region Replication (CRR) 設定
【優先度】 高 (High)
【要件概要】
東京リージョンの画像バケットに保存されたデータを、大阪リージョンのバックアップバケットへ
VersioningおよびKMS暗号化を維持したままリアルタイム自動レプリケーションする。
```

---

### Ticket 24 — ユーザー直接アップロード用S3 Presigned URL生成API (Lambda)

```markdown
【チケット番号】 AWS-APP-2026-024
【タイトル】 大容量ファイルアップロード用S3 Presigned URL発行APIの実装
【優先度】 中 (Medium)
【要件概要】
Webサーバーの帯域圧迫を避けるため、フロントエンドがS3へ直接ファイルアップロードできる
有効期限15分の署名付きURLを払い出すサーバレスAPIを作成する。
```

---

### Ticket 25 — 開発者権限の最小権限化 (Least Privilege IAM Role & Permission Boundary)

```markdown
【チケット番号】 AWS-IAM-2026-025
【タイトル】 開発者IAMロールの最小権限化およびPermission Boundary適用
【優先度】 高 (High)
【要件概要】
開発者が誤ってVPCやRoute 53などのネットワーク基幹リソースを変更・削除できないよう、
IAMポリシーを見直し、権限昇格を防ぐPermission Boundaryを全開発者ロールへ適用する。
```
- **Permission Boundary Policy:** 開発者が新しいRoleを作成する際にも、Admin権限を自分に付与できないよう上限枠 (Boundary) を強制する。

---

### Ticket 26 — ECS Fargate タスク起動直後の異常終了 (Essential container in task exited: Exit Code 1 / 137 OOM)

```markdown
【チケット番号】 AWS-CNT-2026-026
【タイトル】 本番ECS FargateタスクのCrashLoopBackOff原因調査および復旧
【優先度】 緊急 (Critical)
【担当者】 SRE / DevOps Engineer
【要件概要】
新バージョンデプロイ直後、ECS Fargateタスクが起動と停止を繰り返し(Desired count: 2 に達しない)、
サービスが停止状態となっている。エラーログを特定し、緊急復旧を実施する。
```
- **ပြဿနာနောက်ခံ:** ECS Fargate Task သည် `PENDING` မှ `RUNNING` ဖြစ်ပြီး စက္ကန့်ပိုင်းအတွင်း `STOPPED` ဖြစ်သွားခြင်း (CrashLoop)။
- **အဖြစ်များဆုံး အကြောင်းအရင်း ၂ ချက်:**
  1. `Exit Code 1`: Application Code Error (ဥပမာ- `.env` မရှိခြင်း၊ Database Connection မရခြင်း သို့မဟုတ် Nginx configuration syntax error)။
  2. `Exit Code 137`: **Out of Memory (OOM)** — Container သုံးစွဲသော RAM သည် Task Definition တွင် သတ်မှတ်ထားသော Memory (ဥပမာ- 512MB) ထက် ကျော်လွန်သွားသဖြင့် Linux Kernel က Process အား သတ်ပစ်ခြင်း။
- **စုံစမ်းစစ်ဆေးနည်း (CLI):**
```bash
# ရပ်တန့်သွားသော Task များ၏ Stop Reason နှင့် Exit Code ကို စစ်ဆေးခြင်း
aws ecs list-tasks --cluster prod-fargate-cluster --desired-status STOPPED
aws ecs describe-tasks --cluster prod-fargate-cluster --tasks <stopped-task-id> \
  --query "tasks[0].containers[0].[exitCode,reason]"

# CloudWatch Logs မှ Fatal Error စစ်ဆေးခြင်း
aws logs tail /ecs/prod-laravel-app --since 30m --filter-pattern "Fatal"
```
- **ဖြေရှင်းနည်း:** Task Definition တွင် Memory ကို 1024MB (1GB) သို့ တိုးမြှင့်ပေးခြင်း သို့မဟုတ် Application Configuration အမှားကို ပြင်ဆင်ပြီး Service အား Update လုပ်ပါ။

---

### Ticket 27 — ALBヘルスチェック失敗に伴う全タスク登録解除 (502 Bad Gateway Outage)

```markdown
【チケット番号】 AWS-ALB-2026-027
【タイトル】 ALB Target GroupのHealth Check失敗による全系ダウン障害対応
【優先度】 緊急 (Critical)
【要件概要】
本番Webサイトが502 Bad Gatewayとなり完全停止。
ALBターゲットグループ内の全ECSタスクが「unhealthy」判定されているため、
ヘルスチェックパスの不整合を解消し、即時トラフィックを復旧させる。
```
- **ပြဿနာနောက်ခံ:** ALB သည် Target Server ထံ `GET /` လှမ်းစစ်ရာတွင် Laravel က Login Page သို့ Redirect (302) လုပ်နေသော်လည်း ALB က `200` သာ မျှော်လင့်ထားသဖြင့် Unhealthy ဖြစ်ကာ Task အားလုံး Traffic ဖြတ်ခံရခြင်း။
- **ဖြေရှင်းနည်း:**
  1. ALB Target Group ၏ Health Check Matcher ကို `200,302` သို့ ပြောင်းပါ သို့မဟုတ် Application တွင် သီးသန့် `GET /healthz` endpoint ဆောက်၍ `200 OK` ပြန်ပေးပါ။
```bash
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/prod-web-tg/abcdef \
  --health-check-path /healthz \
  --matcher HttpCode=200
```

---

### Ticket 28 — RDSストレージ枯渇によるデータベース読み取り専用化 (Storage Full Emergency)

```markdown
【チケット番号】 AWS-DB-2026-028
【タイトル】 RDS MySQL空き容量ゼロに伴う緊急ストレージ拡張対応
【優先度】 緊急 (Critical)
【要件概要】
大量のログテーブル肥大化によりRDSのFreeStorageSpaceが0MBとなり、
MySQLが強制的にRead-Onlyモードへ移行。書き込み処理が全滅しているため、ストレージを緊急増量する。
```
- **ပြဿနာနောက်ခံ:** Disk ပြည့်သွားပါက MySQL သည် Data မပျက်စီးစေရန် Disk Write ကို Lock ချလိုက်သည်။
- **ဖြေရှင်းနည်း (CLI ဖြင့် ချက်ချင်း Volume ချဲ့ခြင်း):**
```bash
aws rds modify-db-instance \
  --db-instance-identifier prod-mysql-db \
  --allocated-storage 100 \
  --max-allocated-storage 500 \
  --apply-immediately
```
- **ကြိုတင်ကာကွယ်နည်း:** Storage Auto-scaling (`--max-allocated-storage`) ကို အစကတည်းက ဖွင့်ထားပါ။

---

### Ticket 29 — RDSデータベース最大接続数超過エラー (Too Many Connections)

```markdown
【チケット番号】 AWS-DB-2026-029
【タイトル】 PHP-FPMプロセス増殖によるRDS接続数上限オーバーの解消 (RDS Proxy導入)
【優先度】 高 (High)
【要件概要】
アクセスピーク時、PHP-FPMの各プロセスがDBコネクションを占有し、
`Error 1040: Too many connections` が多発。Amazon RDS Proxyを導入して接続プールを最適化する。
```
- **ဖြေရှင်းနည်း:**
  1. ယာယီအားဖြင့် RDS Parameter Group တွင် `max_connections` ကို တွက်ချက်တိုးမြှင့်ပါ။
  2. ရေရှည်အတွက် **Amazon RDS Proxy** တည်ဆောက်ပြီး Connection Pooling စနစ်ဖြင့် Connection ထောင်ပေါင်းများစွာကို RDS ဆီသို့ အနည်းငယ်သာ ချိတ်ဆက်စေရန် ပြုလုပ်ပါ။

---

### Ticket 30 — LambdaとVPC連携时的ENI/Private IP枯渇トラブル

```markdown
【チケット番号】 AWS-SRV-2026-030
【タイトル】 LambdaのVPC接続サブネットにおけるPrivate IP枯渇およびタイムアウト解消
【優先度】 高 (High)
【要件概要】
Lambda関数がスパイクアクセス時に急増し、割り当てられた/28サブネットのPrivate IP (11個) が枯渇。
後続のLambdaがENIを生成できずタイムアウトエラーとなる事象を、サブネット拡張により解消する。
```
- **ပြဿနာနောက်ခံ:** VPC ထဲတွင် Run သော Lambda သည် Private Subnet ထဲရှိ IP Address များကို စားသုံးသည်။ Subnet CIDR သေးငယ်ပါက IP ပြည့်သွားပြီး Lambda Crash ဖြစ်သည်။
- **ဖြေရှင်းနည်း:** Lambda အတွက် သီးသန့် Subnet အသစ် `/24` (IP 251 ခု) တည်ဆောက်ပြီး Lambda VPC Configuration တွင် ထို Subnet ID များ ပြောင်းလဲပေးပါ။

---

### Ticket 31 — S3 Bucketへの大規模アクセス時のスローダウン (503 Slow Down / Rate Limit)

```markdown
【チケット番号】 AWS-STG-2026-031
【タイトル】 S3バケットへの毎秒数千回アクセスに伴う「503 Slow Down」対策
【優先度】 中 (Medium)
【要件概要】
セール開始と同時に特定フォルダ `images/` へのアクセスが集中し、S3が「503 Slow Down」を返却。
Partition Prefixを分散させ、CloudFrontキャッシュ設定を強化する。
```
- **AWS Rule:** S3 Prefix တစ်ခုလျှင် တစ်စက္ကန့်လျှင် PUT 3,500 requests နှင့် GET 5,500 requests သာ ခံနိုင်ရည်ရှိသည်။
- **ဖြေရှင်းနည်း:** Folder အမည်ရှေ့တွင် Hash Key ထည့်ပေးခြင်း (ဥပမာ- `images/a1b2-product.jpg`) သို့မဟုတ် CloudFront CDN ရှေ့တွင် ခံပြီး Cache Hit Ratio ကို 90% ကျော်အောင် တင်ပေးပါ။

---

### Ticket 32 — NAT Gatewayデータ転送料金の急激な高騰原因調査 (VPC Flow Logs)

```markdown
【チケット番号】 AWS-COST-2026-032
【タイトル】 NAT Gatewayデータ転送量急増に伴う通信元インスタンスの特定と是正
【優先度】 中 (Medium)
【要件概要】
AWS請求額でNAT GatewayのData Processing費用が前日比10倍に跳ね上がった。
VPC Flow LogsをCloudWatch Logs Insightsで分析し、大容量通信を行っているEC2と宛先を特定する。
```
- **စုံစမ်းနည်း (CloudWatch Logs Insights Query):**
```sql
fields @timestamp, srcAddr, dstAddr, bytes
| stats sum(bytes) as TotalBytes by srcAddr, dstAddr
| sort TotalBytes desc
| limit 10
```
- **ရလဒ်နှင့် ဖြေရှင်းချက်:** Backend EC2 တစ်ခုက S3 သို့ Database Backup ဖိုင် 200GB ကို NAT GW မှတစ်ဆင့် ပို့နေသည်ကို တွေ့ရှိရပြီး S3 Gateway Endpoint သို့ Route လွှဲပြောင်းပေးလိုက်သဖြင့် စရိတ် ချက်ချင်း ကျဆင်းသွားသည်။

---

### Ticket 33 — Route 53 DNS伝播遅延およびTTL設定不備による旧環境アクセス残留

```markdown
【チケット番号】 AWS-DNS-2026-033
【タイトル】 ドメイン切り替え前のRoute 53 TTL短縮およびスムーズなDNS移行手順
【優先度】 高 (High)
【要件概要】
新環境への本番ドメイン切り替え時、DNSキャッシュによりユーザーが旧サーバーへアクセスし続けるのを防ぐため、
切り替え48時間前にRoute 53レコードのTTLを300秒(5分)へ短縮する。
```
- **လုပ်ဆောင်ပုံ:** `TTL=86400` (၂၄ နာရီ) ဖြစ်နေပါက အသစ်ပြောင်းပြီးနောက် ၂၄ နာရီကြာသည်အထိ အချို့ User များ Server အဟောင်းသို့ ရောက်နေမည်။ ထို့ကြောင့် မပြောင်းမီ ၂ ရက်ကြိုတင်၍ `TTL=60` သို့ လျှော့ချထားရမည်။

---

### Ticket 34 — CloudFrontキャッシュが更新されない問題 (Cache Invalidation)

```markdown
【チケット番号】 AWS-CDN-2026-034
【タイトル】 フロントエンド静的アセットリリース後のCloudFrontキャッシュ無効化
【優先度】 高 (High)
【要件概要】
Vue.jsの新しいJS/CSSをS3へアップロードしたが、ユーザーのブラウザに古いデザインが表示されたままとなっている。
CloudFrontのキャッシュクリア (Invalidation) を実行し、即時反映させる。
```
- **Command:**
```bash
aws cloudfront create-invalidation \
  --distribution-id EDFDVBD6EXAMPLE \
  --paths "/*"
```

---

### Ticket 35 — ACMパブリック証明書の自動更新失敗 (DNS CNAMEレコード誤削除)

```markdown
【チケット番号】 AWS-SEC-2026-035
【タイトル】 ACM証明書の自動更新エラー警告の解消 (Route 53 CNAME再登録)
【優先度】 緊急 (Critical)
【要件概要】
AWSから「Certificate renewal failed for example.com」という警告メールを受信。
Route 53から検証用CNAMEレコードが誤って削除されていたため、再登録して証明書を即時更新させる。
```
- **ဖြေရှင်းနည်း:** ACM Console သို့သွား၍ "Export DNS records" နှိပ်ပြီး Route 53 တွင် validation CNAME ကို ပြန်လည် ထည့်သွင်းပေးပါ။

---

### Ticket 36 — ECRコンテナイメージプル時のレート制限および認証切れトラブル

```markdown
【チケット番号】 AWS-CNT-2026-036
【タイトル】 CI/CDパイプラインにおけるECR認証エラー (403 Forbidden) の解消
【優先度】 高 (High)
【要件概要】
GitHub ActionsからのECR pushが突然 `no basic auth credentials` で失敗するようになった。
IAM Access Keyの失効を確認し、よりセキュアなGitHub OIDC認証へ移行する。
```
- **ဖြေရှင်းနည်း:** ရေတို Password သက်တမ်းကုန်သော Access Key အစား **GitHub Actions OpenID Connect (OIDC)** ကို သုံးပြီး AWS IAM Role သို့ Temporary Token ဖြင့် ချိတ်ဆက်စေပါ။

---

### Ticket 37 — ECS Execが動作しないトラブルシューティング (SSM Agent & Task Role)

```markdown
【チケット番号】 AWS-CNT-2026-037
【タイトル】 本番ECS Fargateコンテナへの `ecs-exec` 接続機能有効化
【優先度】 中 (Medium)
【要件概要】
本番環境のFargateコンテナ内でデバッグコマンドを実行するため `aws ecs execute-command` を実行したがエラーとなる。
ECS Service設定およびTask IAM Roleに必要な権限を付与して利用可能にする。
```
- **ဖြေရှင်းနည်း:**
  1. ECS Service တွင် `--enable-execute-command` ဖွင့်ပါ။
  2. Task Role တွင် `ssmmessages:CreateControlChannel`, `ssmmessages:OpenControlChannel` စသည့် SSM API Permissions များ ပေးထားပါ။

---

### Ticket 38 — SQSメッセージ重複処理による二重決済障害の防止 (FIFO & Visibility Timeout)

```markdown
【チケット番号】 AWS-APP-2026-038
【タイトル】 決済ワーカーにおけるSQSメッセージ二重処理の防止対策
【優先度】 緊急 (Critical)
【要件概要】
決済処理ワーカーの処理時間が45秒かかっているのに対し、SQSのVisibility Timeoutが30秒に設定されていたため、
タイムアウト後に別のワーカーが同一メッセージを取得し、ユーザーへ二重請求が発生した。
Visibility Timeoutの延長とFIFO Deduplicationを導入する。
```
- **ဖြေရှင်းနည်း:** Visibility Timeout ကို အများဆုံး ကြာချိန်ထက် ကျော်လွန်သော `120s` သို့ ပြောင်းပြီး Application Code တွင် Database Transaction ID ဖြင့် Deduplication (Idempotency Key) စစ်ဆေးပါ။

---

### Ticket 39 — ElastiCache Redis OOM (Out of Memory) によるデータ書き込み拒否

```markdown
【チケット番号】 AWS-DB-2026-039
【タイトル】 Redisメモリ上限到達に伴うOOMエラーの解消 (allkeys-lru適用)
【優先度】 高 (High)
【要件概要】
Redisがメモリ上限に達し `OOM command not allowed when used memory > 'maxmemory'` を返却。
Parameter Groupの `maxmemory-policy` を `volatile-lru` から `allkeys-lru` へ変更し、
古いキャッシュを自動破棄するよう是正する。
```
- **ဖြေရှင်းနည်း:** Parameter Group တွင် `maxmemory-policy = allkeys-lru` သတ်မှတ်ခြင်းဖြင့် Memory ပြည့်ပါက အသုံးအနည်းဆုံး Key များကို အလိုအလျောက် ဖျက်ထုတ်ပေးသည်။

---

### Ticket 40 — Security Group循環参照および通信拒否によるDB接続タイムアウト

```markdown
【チケット番号】 AWS-NET-2026-040
【タイトル】 ECSからRDSへの通信タイムアウト解消 (Security Group相互参照修正)
【優先度】 高 (High)
【要件概要】
ECSタスクからRDSへ接続できずタイムアウトが発生。
RDSのSecurity Group Inboundルールで、ECSのSecurity Group IDからのPort 3306通信が正しく許可されているか監査・修正する。
```
- **စစ်ဆေးနည်း:** RDS SG Inbound တွင် `Source: sg-0123456789ecs` (Type: MySQL/Aurora 3306) ရှိမရှိ စစ်ဆေးပြီး ထည့်သွင်းပေးပါ။

---

### Ticket 41 — AWS WAFの誤検知(False Positive)による正規決済リクエスト遮断

```markdown
【チケット番号】 AWS-SEC-2026-041
【タイトル】 AWS WAFのSQLi誤検知による決済APIの403ブロック解除 (Countモード化)
【優先度】 緊急 (Critical)
【要件概要】
正規のユーザーが入力した住所文字列がAWSマネージドルール(SQLi)に誤検知され、決済画面で403エラーが多発。
当該ルールを特定して一時的に `Count` モード(監視のみ)へ変更し、除外設定を入れる。
```
- **လုပ်ဆောင်ပုံ:** CloudWatch WAF Sampled Requests တွင် Block ခံရသော Rule ID ကို ရှာပါ။ ထို Rule အား `Action: Override to Count` ပြောင်းပေးလိုက်ပါက ချက်ချင်း ပွင့်သွားမည်။

---

### Ticket 42 — Terraform Stateロック解除不能トラブル (Stuck DynamoDB Lock)

```markdown
【チケット番号】 AWS-IAC-2026-042
【タイトル】 Terraform apply異常終了に伴うDynamoDB State Lockの強制解除
【優先度】 高 (High)
【要件概要】
CI/CDパイプラインが途中でタイムアウト強制終了されたため、DynamoDB上にTerraform State Lockが残存。
後続のデプロイが `Error acquiring the state lock` でブロックされている事象を安全に解除する。
```
- **Command:**
```bash
terraform force-unlock <LOCK-ID>
```

---

### Ticket 43 — GitHub Actions CI/CDビルド時のディスク容量不足 (No space left on device)

```markdown
【チケット番号】 AWS-CICD-2026-043
【タイトル】 CIランナーにおけるDockerイメージキャッシュ肥大化に伴うディスク枯渇解消
【優先度】 中 (Medium)
【要件概要】
GitHub Actions Runner上で `docker build` 実行時に `no space left on device` でビルド失敗。
Runnerの事前クリーンアップステップを追加し、不要なDockerキャッシュを自動パージする。
```
- **ဖြေရှင်းနည်း:** YAML step တွင် `docker system prune -af --volumes` ကို Build မစတင်မီ ထည့်သွင်းပါ။

---

### Ticket 44 — SCP (Service Control Policy) によるリージョン外リソース作成拒否

```markdown
【チケット番号】 AWS-GOV-2026-044
【タイトル】 AWS Organizations SCPによる東京・大阪以外のリージョン利用制限設定
【優先度】 中 (Medium)
【要件概要】
誤操作による海外リージョンでのリソース作成と課金を防ぐため、
OrganizationsのSCPを用いて `ap-northeast-1` (東京) および `ap-northeast-3` (大阪) 以外の
全リソース作成APIをDenyするポリシーを適用する。
```

---

### Ticket 45 — EBS gp2 VolumeのBurst Balance枯渇によるI/O待ちレスポンス急低下

```markdown
【チケット番号】 AWS-STG-2026-045
【タイトル】 EBS gp2のBurst Balance 0%枯渇に伴うgp3ボリュームへの無停止移行
【優先度】 高 (High)
【要件概要】
夜間バッチ処理のI/O負荷によりgp2ボリュームのBurst Balanceが0%に枯渇し、ディスクI/Oがボトルネック化。
Elastic Volumes機能を用いて、無停止で最新の `gp3` (ベースライン3,000 IOPS保証) へボリュームタイプを変更する。
```
- **Command:**
```bash
aws ec2 modify-volume --volume-id vol-0123456789abcdef0 --volume-type gp3 --iops 3000 --throughput 125
```

---

### Ticket 46 — CloudWatch Logsログ保管コスト増大対策 (Retention Period一括短縮)

```markdown
【チケット番号】 AWS-COST-2026-046
【タイトル】 全CloudWatch Log Groupの保持期間一括見直し (Never Expireから30日へ)
【優先度】 低 (Low)
【要件概要】
全開発環境および本番環境のLog Groupの保持期間が「Never Expire (無期限)」となっており、
不要なログ保管料が累積。スクリプトを実行して一括で「30日保持」へ設定変更する。
```
```bash
for group in $(aws logs describe-log-groups --query "logGroups[*].logGroupName" --output text); do
  aws logs put-retention-policy --log-group-name "$group" --retention-in-days 30
done
```

---

### Ticket 47 — Amazon SESバウンス率上昇によるアカウント一時停止警告の回避

```markdown
【チケット番号】 AWS-SES-2026-047
【タイトル】 メールバウンス率5%超過に伴うSESサプレッションリスト導入
【優先度】 高 (High)
【要件概要】
無効なメールアドレスへの配信多発によりバウンス率が5%を超過し、AWSから警告通知を受信。
SNSとLambdaを連携してHard Bounce発生アドレスを即座にデータベース上で配信停止フラグに更新する。
```

---

### Ticket 48 — EC2インスタンスのRoot Disk 100%フルによるSSH/SSM接続不能の緊急復旧

```markdown
【チケット番号】 AWS-OPS-2026-048
【タイトル】 ルートボリューム容量100%枯渇に伴うレスキューインスタンスを用いた救済
【優先度】 緊急 (Critical)
```
- **ပြဿနာနောက်ခံ:** Linux Root Disk သည် 100% ပြည့်သွားပါက SSH ကော SSM ပါ Login ဝင်၍ မရတော့ပေ။
- **ဖြေရှင်းနည်း (現場レスキュー手順):**
  1. EC2 Instance ကို Stop လုပ်ပါ။
  2. EBS Root Volume ကို Detach လုပ်ပါ။
  3. အခြား Rescue EC2 Instance တစ်ခုတွင် Secondary Volume အဖြစ် Attach တွဲပါ။
  4. Rescue စက်ထဲမှ Mount လုပ်ပြီး ကြီးမားနေသော Log ဖိုင်များကို ရှင်းထုတ်ပါ (`rm /var/log/*.log`)။
  5. ပြန်လည် Detach လုပ်ပြီး မူလ EC2 တွင် `/dev/sda1` အဖြစ် ပြန်တပ်ကာ Boot ပြန်တက်ပါ။

---

### Ticket 49 — Aurora MySQLのスロークエリによるCPU 100%高騰およびデッドロック解消

```markdown
【チケット番号】 AWS-DB-2026-049
【タイトル】 Performance Insightsを用いたスロークエリ特定およびインデックス最適化
【優先度】 高 (High)
```
- **ဖြေရှင်းနည်း:** Performance Insights သို့သွား၍ Database Load အများဆုံး ဖြစ်စေသော SQL Statement ကို ရှာပါ။ `EXPLAIN SELECT ...` ဖြင့် စစ်ဆေးပြီး Table Scan (ALL) ဖြစ်နေသော Column ပေါ်တွင် Index အသစ် တပ်ဆင်ပေးပါ။

---

### Ticket 50 — CloudFrontとALB間のSSLハンドシェイク失敗 (502 Bad Gateway)

```markdown
【チケット番号】 AWS-CDN-2026-050
【タイトル】 CloudFront Custom Origin SSL証明書ミスマッチに伴う502エラー解消
【優先度】 高 (High)
```
- **ပြဿနာနောက်ခံ:** CloudFront က ALB Custom Origin သို့ HTTPS ဖြင့် ချိတ်ဆက်ရာတွင် ALB ပေါ်ရှိ ACM Certificate ၏ Domain Name နှင့် CloudFront Origin Domain Name ကွဲလွဲနေသဖြင့် SSL Handshake ပျက်စီးကာ 502 တက်ခြင်း။
- **ဖြေရှင်းနည်း:** CloudFront Origin Domain Name ကို ALB DNS နာမည် အစား ACM Certificate ထဲတွင် ပါဝင်သော Custom CNAME Domain (ဥပမာ- `origin.example.com`) သို့ သတ်မှတ်ပေးပြီး Route 53 တွင် ALB သို့ ညွှန်းပေးပါ။

---
*မူလမာတိကာသို့ ပြန်သွားရန်:* [README.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/README.md)
