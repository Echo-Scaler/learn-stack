---
title: "Phase 4 — Compute (EC2, Storage & Auto Scaling) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: SAA-C03 ၏ Core Compute Domain တွင် EC2 Lifecycle၊ EBS Storage စွမ်းဆောင်ရည်နှင့် Auto Scaling Groups (ASG) ၏ Dynamic Elasticity ကို စနစ်တ"
---

## Phase 4 — Compute (EC2, Storage & Auto Scaling) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** SAA-C03 ၏ Core Compute Domain တွင် EC2 Lifecycle၊ EBS Storage စွမ်းဆောင်ရည်နှင့် Auto Scaling Groups (ASG) ၏ Dynamic Elasticity ကို စနစ်တကျ ဒီဇိုင်းထုတ်နိုင်ရမည်။ လုပ်ငန်းခွင် (Genba) တွင် Single Server ရပ်တည်ခြင်းထက် Multi-AZ, Launch Template, Auto Healing နှင့် Mixed Instances Policy (On-Demand + Spot) ကို စနစ်တကျ အကောင်အထည်ဖော်ရမည်။

---

## ၄.၁ Amazon EC2 Production Setup (အဆင့်ဆင့် တည်ဆောက်ပုံ)

EC2 ကို Production တွင် စတင် Launch ပြုလုပ်ရာတွင် Default settings များကို မသုံးဘဲ အောက်ပါ Enterprise Security & Reliability အချက်များကို အဆင့်ဆင့် ရွေးချယ်ရမည်-

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION EC2 PROVISIONING WORKFLOW                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. AMI Selection       : Amazon Linux 2023 / Ubuntu 22.04 LTS (Minimal)          |
|  2. Instance Family     : Graviton ARM (`t4g.medium` / `c7g.large` - 20% Cheaper) |
|  3. Network (VPC)       : Private App Subnet (Never assign Public IP!)            |
|  4. IAM Instance Profile: Attach Role with least privilege (e.g. SSM + S3 access) |
|  5. Security (IMDSv2)   : Token Required (HttpTokens=required, HopLimit=1)       |
|  6. Storage (EBS)       : Root Volume gp3 (3000 IOPS, 125 MB/s, Encrypted by KMS) |
|  7. User Data Script    : Automated Package Installation & CloudWatch Log stream  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Production User Data Script နမူနာ (Bootstrap Automation)
Server စတင်တက်လာချိန်တွင် Nginx Web Server သွင်းခြင်း၊ Security Hardening ပြုလုပ်ခြင်းနှင့် CloudWatch Logs ထံ User Data execution log ပို့ခြင်း:

```bash
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "=== Starting EC2 Production Bootstrap ==="

# OS Security Updates
dnf update -y

# Install Core Utilities & Nginx
dnf install -y nginx amazon-cloudwatch-agent

# Configure Nginx
cat << 'EOF' > /usr/share/nginx/html/index.html
<!DOCTYPE html>
<html>
<head><title>Production App</title></head>
<body><h1>Running on AWS EC2 via ASG</h1></body>
</html>
EOF

# Start & Enable Nginx
systemctl start nginx
systemctl enable nginx

echo "=== Bootstrap Completed Successfully ==="
```

### IMDSv2 (Instance Metadata Service Version 2) Security Mandate
SSRF (Server-Side Request Forgery) တိုက်ခိုက်မှုမှတစ်ဆင့် EC2 ပေါ်ရှိ IAM Role Token ခိုးယူခံရခြင်းမှ ကာကွယ်ရန် IMDSv1 ကို လုံးဝ ပိတ်ပြီး **IMDSv2 (Session Token Required)** ကို မဖြစ်မနေ အသုံးပြုရမည်:

```bash
# IMDSv2 သာ ခွင့်ပြုရန် CLI ဖြင့် ပြင်ဆင်ခြင်း
aws ec2 modify-instance-metadata-options \
    --instance-id i-0123456789abcdef0 \
    --http-tokens required \
    --http-put-response-hop-limit 1 \
    --http-endpoint enabled
```

---

## ၄.၂ Amazon EBS Production Operations (Down-Time မရှိဘဲ Disk ချဲ့နည်း)

Production Server တွင် Hard Drive ပြည့်ခါနီးဖြစ်ပါက Server ကို Stop/Restart စရာမလိုဘဲ **Live (Zero Downtime)** ဖြင့် Disk Volume ချဲ့ထွင်နိုင်သည်။

```
+-----------------------------------------------------------------------------------+
|                     ONLINE LIVE EBS VOLUME EXPANSION WORKFLOW                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  Step 1: AWS Console / CLI မှတစ်ဆင့် EBS Volume Size ကို 50GB မှ 100GB သို့ ပြင်သည်  |
|  Step 2: Linux OS က Partition အသစ်ကို ချက်ချင်း သိရှိစေရန် `growpart` Run သည်     |
|  Step 3: Filesystem (XFS သို့မဟုတ် EXT4) ကို အွန်လိုင်းမှ `xfs_growfs` ဖြင့် ချဲ့သည်   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### လက်တွေ့ Run ရမည့် Linux Commands:
```bash
# ၁။ လက်ရှိ Disk Partition အခြေအနေကို စစ်ဆေးခြင်း
lsblk
# Output:
# nvme0n1     259:0    0  100G  0 disk
# └─nvme0n1p1 259:1    0   50G  0 part /   <-- Disk က 100G ဖြစ်နေသော်လည်း Partition က 50G သာရှိသေးသည်

# ၂။ Partition နံပါတ် 1 ကို Disk Size အပြည့်ဖြစ်အောင် ချဲ့ခြင်း
sudo growpart /dev/nvme0n1 1

# ၃။ Filesystem အမျိုးအစား စစ်ဆေးခြင်း
df -Th
# Type က 'xfs' ဖြစ်လျှင်:
sudo xfs_growfs -d /

# Type က 'ext4' ဖြစ်လျှင်:
sudo resize2fs /dev/nvme0n1p1

# ၄။ 100GB ပြည့်သွားကြောင်း အတည်ပြုခြင်း
df -h /
```

### EBS Data Lifecycle Manager (DLM) Automated Snapshots
တကယ့်လုပ်ငန်းခွင်တွင် Backup Snapshot များကို လူကိုယ်တိုင် လိုက်ရိုက်လေ့မရှိပါ။ **Amazon Data Lifecycle Manager (DLM)** ဖြင့် Lifecycle Policy သတ်မှတ်ထားသည်:
- ညစဉ် 01:00 AM တွင် Snapshot အလိုအလျောက် ရိုက်ယူမည်။
- နောက်ဆုံး ၇ ရက်စာ Snapshots များကို ထိန်းသိမ်းပြီး ၇ ရက်ကျော်ပါက အဟောင်းများကို အလိုအလျောက် ဖျက်ပစ်မည် (Cost Saving)။
- Disaster Recovery အတွက် အဆိုပါ Snapshot ကို Secondary Region (Osaka) သို့ Cross-Region Copy အလိုအလျောက် ပို့ထားမည်။

---

## ၄.၃ Production Auto Scaling Group (ASG) အဆင့်ဆင့် တည်ဆောက်ပုံ

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION ASG ARCHITECTURAL DESIGN                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                          [Application Load Balancer]                              |
|                                       |                                           |
|                  +--------------------+--------------------+                      |
|                  | (Health Check: HTTP 200 on `/healthz`)  |                      |
|                  v                                         v                      |
|     [Subnet AZ-1a (Private)]                  [Subnet AZ-1c (Private)]            |
|     +-------------------------+               +-------------------------+         |
|     | EC2 Instance 1 (On-Dem) |               | EC2 Instance 2 (On-Dem) |         |
|     | EC2 Instance 3 (Spot)   |               | EC2 Instance 4 (Spot)   |         |
|     +-------------------------+               +-------------------------+         |
|                                                                                   |
|     ASG Policy: Mixed Instances (2 Base On-Demand + 70% Spot for scale-out)       |
|     Scaling Metric: Average CPU Utilization 60% OR ALB Request Count 1000/target  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: Launch Template ဖန်တီးခြင်း
Launch Configuration သည် ရှေးဟောင်း Legacy ဖြစ်ပြီး လက်ရှိတွင် **Launch Template** ကိုသာ မဖြစ်မနေ သုံးရမည် (Versioning, Mixed Instances, Graviton ပံ့ပိုးသည်)။

```bash
# Launch Template တစ်ခုကို CLI ဖြင့် ဖန်တီးခြင်း
aws ec2 create-launch-template \
    --launch-template-name "ProductionWebTemplate" \
    --version-description "v1-Production" \
    --launch-template-data '{
        "ImageId": "ami-0123456789abcdef0",
        "InstanceType": "t4g.medium",
        "IamInstanceProfile": {"Name": "WebRoleInstanceProfile"},
        "SecurityGroupIds": ["sg-0123456789abcdef0"],
        "MetadataOptions": {
            "HttpTokens": "required",
            "HttpPutResponseHopLimit": 1
        },
        "UserData": "IyEvYmluL2Jhc2gKZG5mIHVwZGF0ZSAteQo="
    }'
```

### အဆင့် ၂: Mixed Instances Policy (On-Demand + Spot ဖြင့် ၇၀% စရိတ်ချွေတာနည်း)
Production တွင် Base Server အနည်းဆုံး ၂ လုံးကို မပြိုလဲစေရန် **On-Demand** ဖြင့် Run ပြီး Traffic များလာ၍ ထပ်တိုးသော Server များကို **Spot Instances** ဖြင့် Run စေခြင်းဖြင့် ကုန်ကျစရိတ်ကို အလွန်အမင်း ချွေတာနိုင်သည်:
- **Base On-Demand Capacity:** 2 (အမြဲ On-Demand Server ၂ လုံး ရှိနေမည်)
- **Percentage Above Base (Spot %):** 70% Spot / 30% On-Demand
- **Spot Allocation Strategy:** `capacity-optimized` (AWS မှ အပျက်စီးနိုင်ခြေ အနည်းဆုံး Spot pool ကို အလိုအလျောက် ရွေးပေးသည်)

### အဆင့် ၃: Lifecycle Hooks (Graceful Termination)
Traffic နည်းသွား၍ Server ကို Terminate လုပ်တော့မည့်အခါ Active Users များ၏ Connection ပြတ်တောက်မသွားစေရန် **ASG Lifecycle Hook (`EC2_INSTANCE_TERMINATING`)** ကို အသုံးပြုသည်:
1. ASG က Server ကို Terminate မလုပ်သေးဘဲ `Terminating:Wait` အခြေအနေတွင် စက္ကန့် ၃၀၀ (၅ မိနစ်) ဆိုင်းငံ့ထားသည်။
2. ALB က အဆိုပါ Server ဆီသို့ Request အသစ်များ မပို့တော့ဘဲ လက်ရှိ Request များ ပြီးဆုံးအောင် စောင့်ဆိုင်းပေးသည် (**Connection Draining / Deregistration Delay**).
3. Server ပေါ်ရှိ Log ဖိုင်များကို S3 သို့ အပြီးသတ် Upload တင်ပြီးမှသာ Server ကို အပြီးတိုင် ဖျက်ပစ်သည်။

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [05_Phase5_LoadBalancing_and_Route53_DNS.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/05_Phase5_LoadBalancing_and_Route53_DNS.md)
