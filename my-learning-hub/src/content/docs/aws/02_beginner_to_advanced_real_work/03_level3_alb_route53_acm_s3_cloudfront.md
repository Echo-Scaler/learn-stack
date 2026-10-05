---
title: "၀၃။ Level 3 — High Availability & Scalable Web Frontend (ALB, ASG, Route 53, ACM, S3, CloudFront)"
description: "OSI Layer 7 (HTTP/HTTPS) တွင် အလုပ်လုပ်သော Intelligent Load Balancer ဖြစ်ပြီး User များထံမှ ဝင်လာသော Web Traffic များကို နောက်ကွယ်ရှိ Server (EC2/ECS Container)"
---

## ၀၃။ Level 3 — High Availability & Scalable Web Frontend (ALB, ASG, Route 53, ACM, S3, CloudFront)

---

## ၃.၁ ALB (Application Load Balancer)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
OSI Layer 7 (HTTP/HTTPS) တွင် အလုပ်လုပ်သော Intelligent Load Balancer ဖြစ်ပြီး User များထံမှ ဝင်လာသော Web Traffic များကို နောက်ကွယ်ရှိ Server (EC2/ECS Container) အများအပြားထံသို့ မျှဝေပေးသည်။

### ၂. ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ဥပမာ:** EC Site တစ်ခုတွင် Flash Sale စတင်ချိန်တွင် တစ်စက္ကန့်လျှင် Request ပေါင်း ၅,၀၀၀ ဝင်လာသည်။ Server ၁ လုံးတည်း ထားရှိပါက CPU 100% တက်ကာ Server Crash သွားမည်။
- **ဖြေရှင်းချက်:** ALB ခံထားပြီး နောက်ကွယ်တွင် Server ၅ လုံး ထားရှိပါက တစ်လုံးလျှင် Request ၁,၀၀၀ စီ အညီအမျှ ခွဲဝေပေးသည်။ Server တစ်လုံး ပျက်ကျသွားပါကလည်း ALB Health Check က သိရှိပြီး ကျန် ၄ လုံးဆီသို့သာ အလိုအလျောက် လမ်းလွှဲပေးသည်။

### ၃. ALB အလုပ်လုပ်ပုံ အသေးစိတ် လုပ်ငန်းစဉ် (Process):
```
                         [ Client Request (HTTPS:443) ]
                                       |
                         [ ALB Listener (Port 443) ]
                                       |
                   +-------------------+-------------------+
                   | Path: /api/*                          | Default: /*
        [ API Target Group ]                      [ Web Target Group ]
       Health Check: /api/health                 Health Check: /healthz
        +--------+--------+                       +--------+--------+
        |                 |                       |                 |
    [ EC2 App 1 ]    [ EC2 App 2 ]            [ EC2 Web 1 ]    [ EC2 Web 2 ]
```

1. **Listener:** သတ်မှတ်ထားသော Port (ဥပမာ- HTTP 80 သို့မဟုတ် HTTPS 443) ကို စောင့်နားထောင်ပြီး Rule စစ်ဆေးသည်။
2. **Path-based Routing:** `/api/*` လာလျှင် Backend API Servers များဆီသို့ ပို့မည်။ `/admin/*` လာလျှင် Admin Servers ဆီသို့ ပို့မည်။
3. **Target Group & Health Check:** ALB က Target Server များဆီသို့ ၃၀ စက္ကန့်တစ်ကြိမ် `GET /health` လှမ်းခေါ်ပြီး `HTTP 200 OK` ပြန်ရမရ စစ်သည်။ Server တစ်လုံး အဖြေမပေးနိုင်ပါက `Unhealthy` အဖြစ် သတ်မှတ်ပြီး Traffic လုံးဝ မပို့တော့ပေ။
4. **Deregistration Delay (Connection Draining):** Server တစ်ခုကို Deploy အသစ်လုပ်ရန် ဖြုတ်သည့်အခါ လက်ရှိ လုပ်ဆောင်ဆဲ Request များကို ချက်ချင်း မဖြတ်တောက်ပစ်ဘဲ စက္ကန့် ၃၀ (Default 300s) စောင့်ဆိုင်းပြီးမှ ဘေးကင်းစွာ ဖြုတ်ပေးသော စနစ်။

### ၄. Terraform ဖြင့် ALB တည်ဆောက်ပုံ
```hcl
resource "aws_lb" "web_alb" {
  name               = "prod-web-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_1a.id, aws_subnet.public_1c.id]

  tags = { Environment = "Production" }
}

resource "aws_lb_target_group" "web_tg" {
  name        = "prod-web-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/healthz"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}
```

---

## ၃.၂ Auto Scaling Group (ASG)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Traffic အတိုးအလျှော့ပေါ် မူတည်၍ EC2 Instance အရေအတွက်ကို အလိုအလျောက် တိုးပေးခြင်း (Scale Out) နှင့် လျှော့ပေးခြင်း (Scale In) ပြုလုပ်ပေးသော စနစ်။

### ၂. အလုပ်လုပ်ပုံ လုပ်ငန်းစဉ် (Process):
1. **Launch Template:** Server အသစ်တိုးလာသည့်အခါ မည်သည့် AMI (Ubuntu), Instance Type (`t3.medium`), Security Group, IAM Role နှင့် User Data Script (Nginx/App start) ကို သုံးပြီး တည်ဆောက်ရမည်ကို သတ်မှတ်ထားသော Template ဖြစ်သည်။
2. **Target Tracking Scaling Policy:** CloudWatch Metric ကို စောင့်ကြည့်သည်။ ဥပမာ- `Average CPU Utilization = 70%` ဟု သတ်မှတ်ထားပါက CPU 75% ဖြစ်သွားသည်နှင့် ASG က Server ၁ လုံး ချက်ချင်း စတင်ထည့်သွင်းပေးသည်။
3. **Cooldown Period:** Server အသစ်တစ်ခု စတင်ပြီး Boot တက်ချိန်တွင် Metric တက်နေသေးသဖြင့် မလိုအပ်ဘဲ နောက်တစ်လုံး ထပ်မတိုးစေရန် မိနစ်အနည်းငယ် (ဥပမာ- ၃ မိနစ်) စောင့်ဆိုင်းပေးသော စနစ်။

---

## ၃.၃ AWS Route 53 (Managed DNS)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာအနှံ့ 99.999% SLA အာမခံချက်ရှိသော AWS ၏ Scalable Cloud DNS (Domain Name System) Service ဖြစ်သည်။

### ၂. မဖြစ်မနေသိရမည့် DNS Record Types & ဂျပန်現場 အသုံးပြုပုံ:
- **A Record:** Domain Name ကို IPv4 Address သို့ ချိတ်ဆက်ပေးခြင်း (ဥပမာ- `example.com` -> `13.112.55.10`)။
- **CNAME Record:** Domain တစ်ခုကို အခြား Domain နာမည်တစ်ခုသို့ ညွှန်းပေးခြင်း (ဥပမာ- `www.example.com` -> `example.com`)။
- **Alias Record (AWS သီးသန့် အထူး Record):** Root Domain (`example.com`) ကို AWS ALB သို့မဟုတ် CloudFront CDN ဆီသို့ IP မလိုဘဲ ညွှန်းပေးနိုင်သော Record ဖြစ်သည်။ CNAME သည် Root Domain တွင် သုံး၍ မရသောကြောင့် **Route 53 Alias Record** ကိုသာ မဖြစ်မနေ သုံးရသည်။
- **Routing Policies:**
  - **Simple Routing:** Domain တစ်ခုကို IP တစ်ခုဆီသို့ တိုက်ရိုက်ညွှန်းခြင်း။
  - **Weighted Routing:** Traffic ၏ ၈၀% ကို System ဗားရှင်းဟောင်းဆီသို့ ပို့ပြီး ၂၀% ကို စမ်းသပ်ဗားရှင်းသစ်ဆီသို့ ပို့ခြင်း (Canary Testing)။
  - **Failover Routing:** Primary Region (Tokyo) Down သွားပါက Secondary Region (Osaka) ဆီသို့ အလိုအလျောက် လမ်းလွှဲပေးခြင်း။

---

## ၃.၄ AWS ACM (Certificate Manager & SSL/TLS)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Website များကို `http://` မှ လုံခြုံစိတ်ချရသော `https://` (Green Padlock) သို့ ပြောင်းလဲပေးနိုင်သည့် SSL/TLS Digital Certificates များကို Free of charge ထုတ်ပေးပြီး သက်တမ်းကုန်ဆုံးပါက အလိုအလျောက် Auto-renew လုပ်ပေးသော Service ဖြစ်သည်။

### ၂. Production Steps for HTTPS Setup:
1. AWS ACM Console -> **Request public certificate** နှိပ်ပါ။
2. Fully qualified domain name တွင် `example.com` နှင့် `*.example.com` ထည့်ပါ။
3. Validation method အနေဖြင့် **DNS validation** ကို ရွေးချယ်ပါ။
4. Route 53 တွင် CNAME Record ကို ခလုတ်တစ်ချက်နှိပ်ရုံဖြင့် အလိုအလျောက် ထည့်သွင်းအတည်ပြုပါ။
5. Certificate ထွက်လာပါက ALB ၏ HTTPS:443 Listener တွင် ချိတ်ဆက်ပေးပါ။
6. ALB တွင် HTTP:80 ဖြင့် ဝင်လာသမျှ Traffic အားလုံးကို HTTPS:443 သို့ Redirect (301 Moved Permanently) လုပ်သည့် Rule ထည့်သွင်းပါ။

---

## ၃.၅ AWS S3 (Simple Storage Service) & Best Practices

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး အရာဝတ္ထုအခြေပြု သိုလှောင်ရုံ (Object Storage) ဖြစ်သည်။ 99.999999999% (11 9's) Data Durability ရှိပြီး အကန့်အသတ်မရှိ Data သိမ်းဆည်းနိုင်သည်။

### ၂. Storage Classes & Cost Optimization (FinOps):
- **S3 Standard:** မကြာခဏ အသုံးပြုသော ဖိုင်များအတွက် (စံထားစျေးနှုန်း)။
- **S3 Standard-IA (Infrequent Access):** တစ်လလျှင် တစ်ကြိမ်သာ ကြည့်သော်လည်း လိုအပ်ပါက ချက်ချင်း ကြည့်လိုသော ဖိုင်များအတွက် (Storage စရိတ် ၅၀% သက်သာသည်)။
- **S3 Glacier Flexible / Deep Archive:** နှစ်စဉ် Audit အတွက် သိမ်းထားရသော Log ဖိုင်များနှင့် Backup များအတွက် (Storage စရိတ် ၉၀% သက်သာပြီး Data ပြန်ထုတ်ရန် နာရီအနည်းငယ် စောင့်ရသည်)။
- **Lifecycle Policy:** အသက် ၃၀ ရက်ကျော်သော ဖိုင်များကို S3 Standard မှ S3-IA သို့၊ ၉၀ ရက်ကျော်ပါက Glacier သို့ အလိုအလျောက် ရွှေ့ပြောင်းစေခြင်း။

### ၃. Presigned URL အလုပ်လုပ်ပုံ (Secure Upload Pattern):
```
[ User Browser ] ----(1. Request Upload URL)----> [ Laravel Backend API ]
                                                          | (2. S3 SDK generate presigned URL)
[ User Browser ] <---(3. Return 15-min Temp URL)----------+
       |
       +------------(4. Direct PUT Upload to S3)--------> [ Amazon S3 Bucket ]
       (Backend Server ၏ RAM နှင့် Bandwidth မကုန်ဘဲ လုံခြုံစွာ Upload တင်နိုင်သည်)
```

```php
// Laravel AWS SDK Presigned URL Generator Example
$s3Client = new Aws\S3\S3Client([
    'region' => 'ap-northeast-1',
    'version' => 'latest'
]);

$cmd = $s3Client->getCommand('PutObject', [
    'Bucket' => 'my-japan-prod-assets-bucket',
    'Key' => 'invoices/' . $filename,
    'ContentType' => 'application/pdf'
]);

$request = $s3Client->createPresignedRequest($cmd, '+15 minutes');
$presignedUrl = (string)$request->getUri();
```

---

## ၃.၆ AWS CloudFront (Global CDN & OAC)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
ကမ္ဘာအနှံ့ Edge Locations များမှတစ်ဆင့် Website ၏ HTML, CSS, JavaScript, Images နှင့် API များကို User အနီးဆုံး Cache မှ လျင်မြန်စွာ ပို့ဆောင်ပေးသော **Content Delivery Network (CDN)** ဖြစ်သည်။

### ၂. Origin Access Control (OAC) ၏ အရေးပါပုံ:
- ရှေးယခင်က S3 Bucket ပေါ်ရှိ ပုံများကို User ကြည့်ရှုနိုင်ရန် S3 Public Access ဖွင့်ပေးခဲ့ကြသည်။ ၎င်းသည် Hacker များ S3 ဖိုင်များကို တိုက်ရိုက် ခိုးယူဒေါင်းလုပ်ဆွဲခြင်းနှင့် Data Transfer Cost အဆမတန် ကုန်ကျစေသည်။
- **OAC (Origin Access Control):** S3 Bucket Public Access ကို လုံးဝ (Block All) ပိတ်ထားပြီး **CloudFront CDN မှတစ်ဆင့်သာ Cryptographic Signature ဖြင့် S3 ထဲသို့ ဖတ်ခွင့်ပြုသော စနစ်** ဖြစ်သည်။

---

## ၃.၇ Hands-on Exercise: Secure S3 + CloudFront OAC တည်ဆောက်ခြင်း

```bash
# ၁။ Private S3 Bucket တည်ဆောက်ခြင်း
aws s3api create-bucket \
  --bucket japan-prod-private-assets \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# ၂။ Public Access ကို လုံးဝ ပိတ်ချခြင်း
aws s3api put-public-access-block \
  --bucket japan-prod-private-assets \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# ၃။ CloudFront Origin Access Control (OAC) ဖန်တီးခြင်း
aws cloudfront create-origin-access-control \
  --origin-access-control-config \
    "Name=prod-s3-oac,Description=OAC-for-S3,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3"
```

---
*နောက်အခန်းသို့ သွားရန်:* [04_Level4_RDS_Aurora_ElastiCache_Redis.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/04_Level4_RDS_Aurora_ElastiCache_Redis.md)
