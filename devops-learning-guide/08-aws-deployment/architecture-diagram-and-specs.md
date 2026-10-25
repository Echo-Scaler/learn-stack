# 🏛️ AWS Production 2-Tier Architecture Specifications

> **Production Deployment အတွက် ကွန်ရက်ခွဲဝေမှု (Subnet CIDRs)၊ Security Groups Rules Matrix၊ IAM JSON Policies နှင့် Data Flow အသေးစိတ် သတ်မှတ်ချက်များ**

---

## 🗺️ ၁။ Subnet CIDR Allocations Table

VPC CIDR: `10.0.0.0/16` (Singapore Region: `ap-southeast-1`)

| Subnet Name | Subnet Type | Availability Zone | CIDR Block | Usable IPs | ချိတ်ဆက်ထားသော Resources |
|---|---|---|---|---|---|
| `public-subnet-1a` | Public | `ap-southeast-1a` | `10.0.1.0/24` | 251 | ALB Node A, NAT Gateway A |
| `public-subnet-1b` | Public | `ap-southeast-1b` | `10.0.2.0/24` | 251 | ALB Node B |
| `private-app-1a` | Private | `ap-southeast-1a` | `10.0.11.0/24` | 251 | EC2 Web App Server 1 |
| `private-app-1b` | Private | `ap-southeast-1b` | `10.0.12.0/24` | 251 | EC2 Web App Server 2 |
| `private-db-1a` | Private | `ap-southeast-1a` | `10.0.21.0/24` | 251 | RDS Primary Database |
| `private-db-1b` | Private | `ap-southeast-1b` | `10.0.22.0/24` | 251 | RDS Multi-AZ Standby |

---

## 🔒 ၂။ Security Groups Inbound & Outbound Rules Matrix

### ၁။ `sg-alb` (Application Load Balancer Security Group)
- **Inbound Rules**:
  - Type: `HTTP (80)`, Protocol: `TCP`, Port: `80`, Source: `0.0.0.0/0` (Anywhere)
  - Type: `HTTPS (443)`, Protocol: `TCP`, Port: `443`, Source: `0.0.0.0/0` (Anywhere)
- **Outbound Rules**:
  - Type: `Custom TCP`, Port: `3000`, Destination: `sg-web` (Only to Web App Instances)

### ၂။ `sg-web` (Application Tier Security Group)
- **Inbound Rules**:
  - Type: `Custom TCP`, Port: `3000`, Source: `sg-alb` (Only from ALB)
  - Type: `SSH (22)`, Port: `22`, Source: Bastion Host SG (or SSM only, no 22 needed)
- **Outbound Rules**:
  - Type: `PostgreSQL (5432)`, Port: `5432`, Destination: `sg-db` (Only to Database)
  - Type: `HTTPS (443)`, Port: `443`, Destination: `0.0.0.0/0` (via NAT GW for S3/SSM API)

### ၃။ `sg-db` (Database Tier Security Group)
- **Inbound Rules**:
  - Type: `PostgreSQL (5432)`, Port: `5432`, Source: `sg-web` (Only from App Instances)
- **Outbound Rules**:
  - All Outbound Blocked (Isolated Database Tier)

---

## 📜 ၃။ IAM Instance Profile JSON Policy (EC2 Role)

EC2 instances ပေါ်တွင် AWS credentials များ hardcode ရေးသားရန် မလိုစေဘဲ S3 bucket သို့ လုံခြုံစွာ upload တင်နိုင်ရန် IAM Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppMediaS3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mycompany-production-media",
        "arn:aws:s3:::mycompany-production-media/*"
      ]
    },
    {
      "Sid": "AllowCloudWatchLogsPut",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

---

## 🎯 ၄။ ALB Listener & Target Group Healthcheck Specs

| Specification | Configuration Value | အဓိပ္ပာယ် ရှင်းလင်းချက် |
|---|---|---|
| **ALB Port 80 Listener** | `HTTP:80` ➜ Redirect to `HTTPS:443` | User များ လုံခြုံမှုမရှိသော HTTP ဖြင့် ဝင်လာပါက အလိုအလျောက် 301 Permanent Redirect လုပ်သည်။ |
| **ALB Port 443 Listener** | `HTTPS:443` ➜ Forward to `tg-web-production` | SSL လက်မှတ် (ACM) ဖြင့် ဖြည်ထုတ်ပြီး Target Group သို့ ပို့သည်။ |
| **Target Group Port** | `HTTP:3000` | EC2 container တွင် Node/Express app နားထောင်နေသော port ဖြစ်သည်။ |
| **Health Check Path** | `/healthz` | App ၏ database ချိတ်ဆက်မှု အခြေအနေကို စစ်ဆေးသော API လမ်းကြောင်း။ |
| **Healthy Threshold** | `3` consecutive successes | ၃ ကြိမ်ဆက်တိုက် 200 OK ရမှ Healthy အဖြစ် သတ်မှတ်သည်။ |
| **Unhealthy Threshold** | `2` consecutive failures | ၂ ကြိမ် ဆက်တိုက် fail ဖြစ်ပါက traffic ဖြတ်တောက်ပြီး မပို့တော့ပါ။ |
| **Interval** | `15 seconds` | ၁၅ စက္ကန့်တစ်ကြိမ် health probe စစ်ဆေးသည်။ |
