---
title: "၆။ Hands-on Lab: Web App Deployment"
description: "EC2 Instance တစ်လုံးကို AWS CLI နှင့် Console ဖြင့် စတင်တည်ဆောက်ခြင်း၊ Session Manager/SSH ဖြင့် ဝင်ရောက်ခြင်း၊ Nginx Web Server တင်ခြင်းနှင့် Resource Cleanup လမ်းညွှန်"
---

# ၆။ Hands-on Lab: Web App Deployment

ဤ Lab တွင် အခြေခံအကျဆုံးနှင့် လက်တွေ့အသုံးအများဆုံး Linux EC2 Server တစ်လုံးကို တည်ဆောက်ပြီး Nginx Web Server တပ်ဆင်ကာ Sample Web Page လွှင့်တင်စမ်းသပ်ပုံကို အဆင့်ဆင့် လေ့လာပါမည်။

---

## 📋 Lab Prerequisites (ကြိုတင်ပြင်ဆင်ရန်)
1. Active ဖြစ်သော **AWS Free Tier Account** တစ်ခု။
2. AWS CLI ကို မိမိ Local Terminal တွင် install လုပ်ထားခြင်း (`aws configure` ဖြင့် Region နှင့် Credentials ထည့်ထားပြီးဖြစ်ရမည်)။
3. Default VPC တစ်ခု ရှိထားပြီးဖြစ်ခြင်း။

---

## အဆင့် (၁) - Security Group ဖန်တီးခြင်း

Server ထံသို့ Port 80 (HTTP) နှင့် Port 22 (SSH) ခွင့်ပြုရန် Security Group တစ်ခု တည်ဆောက်ပါမည်:

```bash
# ၁။ Security Group အသစ် တည်ဆောက်ခြင်း
aws ec2 create-security-group \
    --group-name "web-server-sg" \
    --description "Allow HTTP and SSH traffic" \
    --vpc-id "vpc-0123456789abcdef0"

# CLI အထွက် output မှ GroupId (ဥပမာ- sg-0a1b2c3d4e5f) ကို မှတ်သားပါ။
```

```bash
# ၂။ Inbound HTTP (Port 80) ခွင့်ပြုခြင်း
aws ec2 authorize-security-group-ingress \
    --group-id "sg-0a1b2c3d4e5f" \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# ၃။ Inbound SSH (Port 22) မိမိ IP မှသာ ခွင့်ပြုခြင်း (လုံခြုံရေးအတွက်)
aws ec2 authorize-security-group-ingress \
    --group-id "sg-0a1b2c3d4e5f" \
    --protocol tcp \
    --port 22 \
    --cidr "203.0.113.50/32"
```

---

## အဆင့် (၂) - User Data Script ဖြင့် EC2 Instance စတင်ခြင်း (Launch)

Server မွေးဖွားလာချိန်တွင် Nginx ကို အလိုအလျောက် တပ်ဆင် run ပေးရန် `userdata.sh` ဖိုင်ငယ်တစ်ခု ရေးသားပါမည်:

```bash
cat << 'EOF' > userdata.sh
#!/bin/bash
dnf update -y
dnf install -y nginx
systemctl start nginx
systemctl enable nginx

# Sample HTML ဖန်တီးခြင်း
cat << 'HTML' > /usr/share/nginx/html/index.html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to AWS EC2</title>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px; }
        .card { background: #1e293b; border-radius: 12px; padding: 30px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        h1 { color: #f59e0b; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 EC2 Nginx Web Server Live!</h1>
        <p>Host Instance ID: <span id="inst">AWS Cloud</span></p>
        <p>Server Status: <strong>Online & Healthy</strong></p>
    </div>
</body>
</html>
HTML
EOF
```

ယခု `aws ec2 run-instances` ဖြင့် Instance စတင်ပါမည်:

```bash
aws ec2 run-instances \
    --image-id ami-0c101f26f147fa7fd \
    --instance-type t3.micro \
    --security-group-ids "sg-0a1b2c3d4e5f" \
    --user-data file://userdata.sh \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyDemoWebServer}]'
```

### Command အချက်အလက် ရှင်းလင်းချက်:
- `--image-id`: Amazon Linux 2023 ၏ တရားဝင် AMI ID။
- `--instance-type t3.micro`: Free Tier အကျုံးဝင်သော 2 vCPU, 1GB RAM အရွယ်အစား။
- `--user-data file://userdata.sh`: Server boot တက်လာသည်နှင့် အလိုအလျောက် Nginx တင်ပေးမည့် script။

---

## အဆင့် (၃) - Public IP စစ်ဆေးခြင်းနှင့် Web Server စမ်းသပ်ခြင်း

Instance ၏ Public IP ကို အောက်ပါ command ဖြင့် ရှာဖွေပါ:

```bash
aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=MyDemoWebServer" "Name=instance-state-name,Values=running" \
    --query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress]" \
    --output table
```

Output တွင် ပေါ်လာသော Public IP (ဥပမာ- `54.214.120.35`) ကို Browser တွင် `http://54.214.120.35` ဟု ရိုက်ထည့်၍ ကြည့်ရှုပါ။ Nginx စာမျက်နှာကို တွေ့မြင်ရမည် ဖြစ်ပါသည်။

Terminal မှ `curl` ဖြင့် စမ်းသပ်လိုပါက:
```bash
curl -I http://54.214.120.35
# Expected Output: HTTP/1.1 200 OK
```

---

## အဆင့် (၄) - AWS Systems Manager (SSM) Session Manager ဖြင့် လုံခြုံစွာ Login ဝင်ရောက်ခြင်း

ခေတ်သစ် AWS Architecture တွင် **Port 22 (SSH) ကို အင်တာနက်သို့ ဖွင့်ထားခြင်းသည် အန္တရာယ်ရှိပါသည်**။
အစားထိုးအနေဖြင့် **AWS Systems Manager (SSM) Session Manager** ကို အသုံးပြုပါက:
1. Inbound Port 22 လုံးဝ ဖွင့်စရာ မလိုပါ။
2. SSH Key Pair (`.pem` file) သိမ်းဆည်းထားစရာ မလိုပါ။
3. IAM Policy ဖြင့် စီမံနိုင်ပြီး Command ရိုက်သမျှကို CloudTrail / S3 တွင် Audit Log မှတ်တမ်းတင်ထားနိုင်သည်။

```bash
# Session Manager ဖြင့် Browser Console သို့မဟုတ် CLI မှ တိုက်ရိုက် Terminal ဝင်ရောက်ခြင်း
aws ssm start-session --target i-0123456789abcdef0
```

ဝင်ရောက်ပြီးပါက Nginx Log များကို စစ်ဆေးကြည့်ပါ:
```bash
# Nginx Status စစ်ဆေးခြင်း
sudo systemctl status nginx

# Web Traffic Access Logs ကြည့်ရှုခြင်း
sudo tail -f /var/log/nginx/access.log
```

---

## 🧹 အဆင့် (၅) - Resource Cleanup Checklist (စရိတ်မကျစေရန် ရှင်းလင်းခြင်း)

Lab စမ်းသပ်ပြီးပါက မလိုအပ်ဘဲ ငွေကုန်ကြေးကျ မဖြစ်စေရန် အောက်ပါ အဆင့်အတိုင်း ဖျက်ပစ်ပါ:

1. **EC2 Instance ကို Terminate ပြုလုပ်ပါ:**
   ```bash
   aws ec2 terminate-instances --instance-ids i-0123456789abcdef0
   ```
2. **Instance "Terminated" ဖြစ်သွားသည်အထိ စောင့်ပါ:**
   ```bash
   aws ec2 wait instance-terminated --instance-ids i-0123456789abcdef0
   ```
3. **Security Group ကို ဖျက်ပါ:**
   ```bash
   aws ec2 delete-security-group --group-id sg-0a1b2c3d4e5f
   ```
4. **Elastic IP ပေးထားခဲ့ပါက Release လုပ်ပါ:**  
   Instance နှင့် တွဲမထားသော EIP သည် ပိုက်ဆံကျသင့်သဖြင့် မဖြစ်မနေ `aws ec2 release-address --allocation-id eipalloc-xxxx` လုပ်ရပါမည်။
