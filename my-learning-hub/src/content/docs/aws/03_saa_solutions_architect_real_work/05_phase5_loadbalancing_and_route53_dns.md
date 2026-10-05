---
title: "Phase 5 — Load Balancing & Route 53 DNS (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် Traffic Distribution နှင့် DNS Traffic Routing သည် စနစ်၏ အဓိက တံခါးပေါက် ဖြစ်သည်။ ALB ပေ"
---

## Phase 5 — Load Balancing & Route 53 DNS (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် Traffic Distribution နှင့် DNS Traffic Routing သည် စနစ်၏ အဓိက တံခါးပေါက် ဖြစ်သည်။ ALB ပေါ်တွင် HTTPS SSL Redirect, SNI (Multiple Domains), Path/Host Routing နှင့် Route 53 ၏ Health Check-driven Failover DR တို့ကို အဆင့်ဆင့် တည်ဆောက်နိုင်ရမည်။

---

## ၅.၁ Application Load Balancer (ALB) Production Setup (အဆင့်ဆင့် တည်ဆောက်ပုံ)

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION ENTERPRISE ALB ARCHITECTURE                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                [Internet Users]                                   |
|                                       |                                           |
|                                       v                                           |
|                         +---------------------------+                             |
|                         |    Route 53 Alias Record  |                             |
|                         |  (api.example.com -> ALB) |                             |
|                         +---------------------------+                             |
|                                       |                                           |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | Application Load Balancer (Public Multi-AZ Subnets)                       |   |
|   |  - Listener Port 80 : **HTTP 301 Permanent Redirect to Port 443 (HTTPS)**   |   |
|   |  - Listener Port 443: **ACM SSL Certificate (with SNI for multi-domains)**|   |
|   |  - Routing Rule 1   : Host `api.app.com`  -> Target Group API (Node.js)    |   |
|   |  - Routing Rule 2   : Path `/images/*`    -> Target Group Static (S3/EC2) |   |
|   |  - Default Rule     : Forward to Main Web Target Group                    |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|               +-----------------------+-----------------------+                   |
|               v                                               v                   |
|   [Target Group: Web Apps]                        [Target Group: API Backends]    |
|   - Health: GET `/healthz` (200 OK)               - Health: GET `/api/status`     |
|   - Deregistration Delay: 300s                    - Deregistration Delay: 60s     |
|   - Targets: EC2 Private Subnet                   - Targets: ECS Fargate Tasks    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: Security Group တည်ဆောက်ခြင်း (Security Best Practice)
ALB နှင့် EC2 ကြား Security Group ကို အောက်ပါအတိုင်း ချိတ်ဆက်ရမည် (EC2 သို့ မည်သည့် Public IP ကမျှ တိုက်ရိုက် မလာစေရ):

1. **ALB Security Group (`sg-alb`):**
   - Inbound: Port 80 (HTTP) from `0.0.0.0/0`
   - Inbound: Port 443 (HTTPS) from `0.0.0.0/0`
   - Outbound: All Traffic to EC2 Security Group (`sg-ec2-web`)
2. **EC2 Web Security Group (`sg-ec2-web`):**
   - Inbound: Port 80 from **`sg-alb` (ALB Security Group ID သာ ထည့်ရမည် - IP ထည့်ရန်မလိုပါ!)**
   - Inbound: Port 22: **None (လုံးဝ ပိတ်ထားမည် - SSM သုံးမည်)**
   - Outbound: All Traffic (Updates ရယူရန်)

### အဆင့် ၂: HTTP to HTTPS Automatic 301 Redirect ဖွဲ့စည်းခြင်း
User များ `http://` ဖြင့် လာပါက `https://` သို့ အလိုအလျောက် ရောက်ရှိသွားစေရန် ALB Listener 80 တွင် Default Action အဖြစ် Redirect Rule ထည့်သွင်းရမည်:

```bash
# ALB Port 80 ကို Port 443 သို့ Redirect လုပ်သော CLI Command
aws elbv2 create-listener \
    --load-balancer-arn <ALB-ARN> \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,Host="#{host}",Path="/#{path}",Query="#{query}",StatusCode=HTTP_301}'
```

### အဆင့် ၃: SNI (Server Name Indication) ဖြင့် Domain အများအပြားကို ALB တစ်ခုတည်းတွင် သုံးခြင်း
ALB တစ်ခုတည်းတွင် `app.example.com`, `shop.example.com`, `admin.example.com` စသည့် မတူညီသော Domain များစွာအတွက် သီးခြား SSL Certificates များကို **SNI (Server Name Indication)** ဖြင့် တွဲဖက် အသုံးပြုနိုင်သည်။ ALB က Client ၏ Hostname အပေါ် မူတည်၍ သင့်တော်သော SSL Certificate ကို အလိုအလျောက် ရွေးထုတ်ပေးသည်။

### အဆင့် ၄: Deregistration Delay (Connection Draining) ချိန်ညှိခြင်း
Target Group တွင် Instance တစ်ခု Terminate ဖြစ်တော့မည့်အခါ Request လက်စများကို အပြီးသတ် စောင့်ဆိုင်းပေးသော အချိန်ဖြစ်သည်:
- Web Application များအတွက်: `300 seconds` (ပုံမှန် အကြံပြုချက်)
- အလွန်မြန်သော Microservices API များအတွက်: `30-60 seconds` (အမြန် ဆာဗာ ဖယ်ထုတ်နိုင်ရန်)

---

## ၅.၂ Network Load Balancer (NLB) Production Best Practices

- **Preserve Client IP:** NLB သည် Layer 4 ဖြစ်သဖြင့် Target EC2 ဆီသို့ ရောက်ရှိသောအခါ User ၏ မူရင်း Client Public IP ကို အလိုအလျောက် ထိန်းသိမ်းပေးထားသည်။
- **Cross-Zone Load Balancing:** NLB တွင် Cross-Zone Load Balancing သည် Default အားဖြင့် "Disabled" ဖြစ်နေတတ်သည်။ AZ တစ်ခုစီရှိ Server များသို့ မျှမျှတတ Traffic ရောက်ရှိစေရန် Production တွင် **Cross-Zone Load Balancing ကို "Enable" လုပ်ပေးရမည်** (Data transfer fee အနည်းငယ် ရှိသည်)။

---

## ၅.၃ Amazon Route 53 Production DNS Setup (အဆင့်ဆင့်)

### အဆင့် ၁: Public Hosted Zone နှင့် Alias Record ဖန်တီးခြင်း
Root Domain (Apex Domain - `example.com`) သို့မဟုတ် Subdomain (`www.example.com`) ကို ALB သို့ ညွှန်ရာတွင် CNAME မသုံးရပါ။ **Route 53 Alias Record ကိုသာ သုံးရမည်** (အဘယ်ကြောင့်ဆိုသော် Alias Record သည် Root Domain တွင် အလုပ်လုပ်ပြီး AWS DNS Query Fees လုံးဝ အခမဲ့ ဖြစ်သောကြောင့် ဖြစ်သည်)။

```json
{
  "Comment": "Point apex domain to ALB",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "example.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z1LMS91P8CMLE5", 
          "DNSName": "my-alb-123456789.ap-northeast-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }
  ]
}
```

### အဆင့် ၂: Route 53 Active-Passive Disaster Recovery Setup (Failover Policy)

```
+-----------------------------------------------------------------------------------+
|                        ROUTE 53 FAILOVER ARCHITECTURE                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                               [Global Web User]                                   |
|                                       |                                           |
|                                       v                                           |
|                    +-------------------------------------+                        |
|                    | Route 53 DNS Record: app.example.com|                        |
|                    | Routing Policy: **Failover**        |                        |
|                    +-------------------------------------+                        |
|                                       |                                           |
|              +------------------------+------------------------+                  |
|              | (Primary: Health Check PASS)                    | (Failover Trigger|
|              v                                                 v  when Primary 5xx|
|    +--------------------+                            +--------------------+       |
|    | Primary Region     |                            | Secondary DR Region|       |
|    | Tokyo ALB (Online) |                            | Osaka ALB (Standby)|       |
|    +--------------------+                            +--------------------+       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

1. **Route 53 Health Check ဖန်တီးခြင်း:**
   - Protocol: `HTTPS`, Endpoint: `primary-alb.example.com`, Path: `/healthz`, Request Interval: 10s, Failure Threshold: 3 times.
2. **Primary Record သတ်မှတ်ခြင်း:**
   - Record Type: `A (Alias)`, Target: Tokyo ALB, Routing Policy: `Failover`, Failover Record Type: `Primary`, Health Check ID တွဲဖက်ထားသည်။
3. **Secondary Record သတ်မှတ်ခြင်း:**
   - Record Type: `A (Alias)`, Target: Osaka Standby ALB, Routing Policy: `Failover`, Failover Record Type: `Secondary`။
4. **အလုပ်လုပ်ပုံ:** Tokyo ALB ပေါ်ရှိ Health Check ကျဆင်းသွားသည်နှင့် စက္ကန့် ၃၀ အတွင်း Route 53 က DNS Query များကို Osaka ALB သို့ အလိုအလျောက် စတင် ညွှန်ပြပေးမည်ဖြစ်သည်။

### Split-View DNS (Private vs Public Hosted Zone)
ကုမ္ပဏီအတွင်း စနစ်များအတွက် `internal.company.com` ကို သီးခြား Domain မဝယ်ဘဲ VPC အတွင်းမှသာ ခေါ်ဆိုနိုင်စေရန် **Route 53 Private Hosted Zone** ကို သက်ဆိုင်ရာ VPC ID နှင့် ချိတ်ဆက် အသုံးပြုသည်။ ပြင်ပ အင်တာနက်မှ မည်သို့မျှ ဖွင့်ကြည့်၍ မရနိုင်ပါ။

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [06_Phase6_Storage_S3_EFS_and_Comparison.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/06_Phase6_Storage_S3_EFS_and_Comparison.md)
