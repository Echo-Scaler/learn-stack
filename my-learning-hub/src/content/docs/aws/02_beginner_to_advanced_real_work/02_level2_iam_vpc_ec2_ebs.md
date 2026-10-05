---
title: "၀၂။ Level 2 — IAM, VPC & EC2 Core Infrastructure"
description: "AWS IAM သည် AWS Resource များကို မည်သူ (Who) က မည်သည့် အခွင့်အရေး (What Actions) ဖြင့် ဝင်ရောက်အသုံးပြုခွင့် ရမည်ကို ထိန်းချုပ်ပေးသော Authentication & Authoriza"
---

## ၀၂။ Level 2 — IAM, VPC & EC2 Core Infrastructure

## ၂.၁ AWS IAM (Identity & Access Management)

### ဒီ Service က ဘာလဲ? (What is it?)
AWS IAM သည် AWS Resource များကို မည်သူ (Who) က မည်သည့် အခွင့်အရေး (What Actions) ဖြင့် ဝင်ရောက်အသုံးပြုခွင့် ရမည်ကို ထိန်းချုပ်ပေးသော **Authentication & Authorization Service** ဖြစ်သည်။ Global Service ဖြစ်ပြီး Region ရွေးစရာမလိုပါ။

### ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **ပြဿနာ:** ကုမ္ပဏီတစ်ခုတွင် Developer ၁၀ ဦး ရှိသည်။ အားလုံးကို Root Account Login ပေးထားပါက အသစ်ဝင်လာသော Junior Developer တစ်ဦးက မတော်တဆ Production Database ကို ဖျက်ပစ်မိခြင်း သို့မဟုတ် တစ်ဦးဦး၏ ကွန်ပျူတာ Hack ခံရပါက AWS Account တစ်ခုလုံး ဆုံးရှုံးနိုင်သည်။
- **ဖြေရှင်းချက်:** IAM ဖြင့် Tanaka-san အား Developer Role (S3/EC2 သာ ကြည့်ခွင့်) ပေးထားပြီး DB ဖျက်ခွင့် (DeleteDBInstance) ကို လုံးဝ ပိတ်ထားနိုင်သည်။

### IAM Core Concepts:
- **Root User:** AWS စတင်ဖွင့်စဉ်က Email/Password ဖြင့် ဝင်သော Superuser။ Production တွင် နေ့စဉ် အလုပ်များအတွက် **လုံးဝ မသုံးရပါ**။ MFA ခတ်ပြီး သိမ်းထားရမည်။
- **IAM User:** ဝန်ထမ်းတစ်ဦးချင်းစီအတွက် သီးသန့် အကောင့်။
- **IAM Group:** Permissions တူညီသော User အစုအဝေး (`Developers`, `BillingAdmins`)။
- **IAM Role:** လူမဟုတ်ဘဲ **AWS Service အချင်းချင်း ဝင်ရောက်ခွင့် (ဥပမာ- EC2 က S3 သို့ Access လုပ်ရန်)** အတွက် ယာယီ STS Token ထုတ်ပေးသော စနစ်။
- **IAM Policy:** JSON Format ဖြင့် ရေးသားထားသော ခွင့်ပြုချက် စာတမ်း:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnlyForApp",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-japan-production-bucket",
        "arn:aws:s3:::my-japan-production-bucket/*"
      ]
    }
  ]
}
```

### Golden Security Rule
> **CRITICAL SECURITY RULE:**  
> Application Source Code သို့မဟုတ် Git Repository (`.env`, `config.php`) ထဲတွင် AWS Access Key ID နှင့် Secret Access Key များကို **ဘယ်တော့မှ Hardcode မထည့်ရပါ**။  
> EC2 သို့မဟုတ် ECS Container များအတွက် **IAM Role (Instance Profile / Task Role)** ကိုသာ မဖြစ်မနေ အသုံးပြုရမည်။

### AWS CLI IAM Commands
```bash
# လက်ရှိ Login ဝင်ထားသော User / Role ကို စစ်ဆေးခြင်း
aws sts get-caller-identity

# IAM Users စာရင်းကို ကြည့်ခြင်း
aws iam list-users

# IAM Roles စာရင်းကို ကြည့်ခြင်း
aws iam list-roles --query "Roles[?contains(RoleName, 'EC2')].RoleName"

# သတ်မှတ်ထားသော Role ၏ Policy များကို စစ်ဆေးခြင်း
aws iam list-attached-role-policies --role-name Production-EC2-S3Access-Role
```

---

## ၂.၂ AWS VPC (Virtual Private Cloud) Networking Deep Dive

### ဒီ Service က ဘာလဲ? (What is it?)
AWS Cloud ပေါ်တွင် မိမိတို့ ကုမ္ပဏီအတွက် သီးသန့် ကာရံထားသော **Logical Isolated Private Network (Private Data Center)** ဖြစ်သည်။

### Production 3-Tier VPC Architecture Diagram
```
                              [ Internet (အပြင်လောက) ]
                                          |
                              [ Internet Gateway (IGW) ]
                                          |
================================== AWS VPC (10.0.0.0/16) ==================================
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Public Subnet AZ-1a ]                                   [ Public Subnet AZ-1c ]
       (10.0.1.0/24)                                             (10.0.2.0/24)
  Route Table: 0.0.0.0/0 -> IGW                             Route Table: 0.0.0.0/0 -> IGW
  +---------------------------+                             +---------------------------+
  |  ALB (Load Balancer Node) |                             |  ALB (Load Balancer Node) |
  |  NAT Gateway (AZ-1a)      |                             |  (Optional NAT GW AZ-1c)  |
  +---------------------------+                             +---------------------------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Private App Subnet AZ-1a ]                              [ Private App Subnet AZ-1c ]
       (10.0.11.0/24)                                            (10.0.12.0/24)
  Route Table: 0.0.0.0/0 -> NAT Gateway                     Route Table: 0.0.0.0/0 -> NAT Gateway
  +---------------------------+                             +---------------------------+
  |  EC2 App Server (Nginx)   |                             |  EC2 App Server (Nginx)   |
  |  Private IP: 10.0.11.20   |                             |  Private IP: 10.0.12.20   |
  +---------------------------+                             +---------------------------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
  [ Private DB Subnet AZ-1a ]                               [ Private DB Subnet AZ-1c ]
       (10.0.21.0/24)                                            (10.0.22.0/24)
  Route Table: Local Only (No Internet Access)              Route Table: Local Only (No Internet)
  +---------------------------+                             +---------------------------+
  |  RDS MySQL Primary Writer | <====== Replication ======> |  RDS MySQL Standby Reader |
  |  Private IP: 10.0.21.50   |                             |  Private IP: 10.0.22.50   |
  +---------------------------+                             +---------------------------+
===========================================================================================
```

### Components များ၏ တာဝန်နှင့် မဖြစ်မနေသိရမည့် အချက်များ
1. **Public Subnet:** Internet Gateway သို့ တိုက်ရိုက် Route လမ်းကြောင်းရှိသည်။ Internet မှ User များ ဝင်ရောက်ရမည့် **ALB (Application Load Balancer)** သာ ထားရှိရမည်။
2. **Private App Subnet:** အပြင် Internet မှ တိုက်ရိုက် မမြင်ရပါ။ Application Server (EC2/ECS) များကို ထားရှိသည်။ Internet သို့ ပြင်ပ Library ဒေါင်းလုပ်ဆွဲရန် **NAT Gateway** မှတစ်ဆင့်သာ ထွက်ရသည်။
3. **Private DB Subnet:** Internet Gateway ကော NAT Gateway ပါ မရှိဘဲ Local VPC အတွင်းသာ ဆက်သွယ်နိုင်သည်။ Database (RDS) ကို Hackers များ Internet မှ Scan မဖတ်နိုင်စေရန် ဤနေရာတွင်သာ လုံးဝ ဝှက်ထားရမည်။
4. **Security Group vs Network ACL (NACL):**
   - **Security Group (SG):** Instance Level Virtual Firewall ဖြစ်သည်။ **Stateful** ဖြစ်သည် (Inbound ခွင့်ပြုထားပါက Outbound သည် အလိုအလျောက် ပွင့်ပြီးသားဖြစ်သည်)။
   - **Network ACL (NACL):** Subnet Level ဖြစ်သည်။ **Stateless** ဖြစ်သည် (Inbound ကော Outbound ပါ သီးခြားစီ Rule ရေးပေးရသည်)။

---

## ၂.၃ AWS EC2 (Elastic Compute Cloud) & Linux Administration

### ဒီ Service က ဘာလဲ? (What is it?)
Cloud ပေါ်တွင် လိုအပ်သလို အတိုးအလျှော့ ပြုလုပ်နိုင်သော **Virtual Machine (Server)** ဖြစ်သည်။

### Linux Administration Cheat Sheet for Production EC2
```bash
# Server CPU, Memory နှင့် Process များကို Real-time စောင့်ကြည့်ခြင်း
top
htop

# Disk အသုံးပြုမှု ပမာဏ စစ်ဆေးခြင်း
df -hT

# RAM အလွတ်နှင့် အသုံးပြုမှု စစ်ဆေးခြင်း
free -m

# Port များ ဖွင့်ထားမှုနှင့် နားထောင်နေမှု စစ်ဆေးခြင်း
sudo ss -tulpn

# Systemd Service Status (Nginx, PHP-FPM) စစ်ဆေးခြင်း/စတင်ခြင်း
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl status php8.2-fpm

# Log ဖိုင်များကို Real-time ကြည့်ရှုခြင်း (Error Tracking)
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f --no-pager
```

### Production Nginx + PHP-FPM Web Configuration Architecture
EC2 ပေါ်တွင် Laravel ကဲ့သို့ Modern Web App တစ်ခု Run ရန် Nginx VirtualHost File (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## ၂.၄ AWS EBS (Elastic Block Store) Storage

### ဒီ Service က ဘာလဲ? (What is it?)
EC2 Instance တွင် တပ်ဆင်အသုံးပြုရသော **High-Performance Network Virtual Hard Disk (Block Storage)** ဖြစ်သည်။ EC2 ပိတ်သွားသော်လည်း Data များ ပျက်မသွားဘဲ ကျန်ရှိနေပါသည်။

### EBS Types & Production Selection
1. **gp3 (General Purpose SSD - စံထားအကြံပြုချက်):** Japan Production အများစုတွင် 90% အသုံးပြုသည်။ ကုန်ကျစရိတ် အသက်သာဆုံးဖြစ်ပြီး Disk Size ကို တိုးစရာမလိုဘဲ IOPS (Input/Output Per Second) နှင့် Throughput (MB/s) ကို လိုသလို သီးခြား မြှင့်တင်နိုင်သည်။
2. **io2 (Provisioned IOPS SSD):** အလွန်ပြင်းထန်သော I/O လိုအပ်သည့် Enterprise Oracle/SQL Server Database များအတွက် သုံးသည်။ စရိတ်ကြီးသည်။
3. **EBS Snapshot:** EBS Disk တစ်ခုလုံးကို S3 ပေါ်သို့ Incremental Backup အဖြစ် Point-in-time သိမ်းဆည်းပေးသော စနစ်။ Disaster ဖြစ်ပါက Snapshot မှ EBS Volume အသစ် ချက်ချင်း ပြန်ဆောက်နိုင်သည်။

---
*နောက်အခန်းသို့ သွားရန်:* [03_Level3_ALB_Route53_ACM_S3_CloudFront.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/03_Level3_ALB_Route53_ACM_S3_CloudFront.md)
