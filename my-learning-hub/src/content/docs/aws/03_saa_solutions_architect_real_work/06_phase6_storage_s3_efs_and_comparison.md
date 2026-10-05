---
title: "Phase 6 — Storage (S3, EFS & Storage Comparison) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် Storage ကဏ္ဍသည် Data Security, Durability, Performance နှင့် Cost အပေါ် တိုက်ရိုက် သက်ရေ"
---

## Phase 6 — Storage (S3, EFS & Storage Comparison) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် Storage ကဏ္ဍသည် Data Security, Durability, Performance နှင့် Cost အပေါ် တိုက်ရိုက် သက်ရောက်သည်။ S3 Bucket Policy Hardening, Lifecycle Automation, Cross-Region Replication (CRR), Presigned URLs နှင့် Amazon EFS Mount Target Configuration များကို အဆင့်ဆင့် တည်ဆောက်နိုင်ရမည်။

---

## ၆.၁ Amazon S3 Production Architecture & Setup (အဆင့်ဆင့် တည်ဆောက်ပုံ)

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION S3 SECURITY & LIFECYCLE FLOW                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [Security Hardening Layer]                                                       |
|  - S3 Block Public Access : **ENABLED (Account & Bucket Level)**                  |
|  - Encryption             : **SSE-KMS with S3 Bucket Key (Saves 99% KMS Fees)**   |
|  - Bucket Policy          : **Deny all non-HTTPS (Insecure) traffic**             |
|  - Versioning             : **ENABLED + MFA Delete for Ransomware Protection**    |
|                                                                                   |
|  [Lifecycle Transition Progression]                                               |
|  Day 0         Day 30                 Day 90                     Day 365          |
|  [Upload] ---> [Transition to IA] --> [Transition to Glacier] -> [Expire & Delete|
|  Standard      Standard-IA            Glacier Deep Archive       Old Versions]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: Bucket Policy ဖြင့် HTTPS သာ ခွင့်ပြုရန် ပိတ်ပင်ခြင်း (PCI-DSS Mandate)
သတင်းအချက်အလက် ပေါက်ကြားမှု မဖြစ်စေရန် HTTP (Port 80) ဖြင့် လာသော မည်သည့် S3 Request ကိုမဆို Explicit `Deny` ပြုလုပ်သော Production Standard Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceTLSRequestsOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-production-company-bucket",
        "arn:aws:s3:::my-production-company-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

### အဆင့် ၂: S3 Bucket Key (KMS ကုန်ကျစရိတ် ၉၉% ချွေတာနည်း)
S3 Object သန်းပေါင်းများစွာကို AWS KMS ဖြင့် Encrypt လုပ်သည့်အခါ Object တစ်ခုချင်းစီအတွက် KMS API Call ပေးပို့ပါက လစဉ် KMS ငွေတောင်းခံလွှာ ဒေါ်လာထောင်ပေါင်းများစွာ ကုန်ကျနိုင်သည်။ **S3 Bucket Key** ကို Enable လုပ်ထားပါက S3 က Key ကို Cache လုပ်ပေးသဖြင့် **KMS API Request Cost ကို ၉၉% အထိ ချက်ချင်း လျှော့ချပေးသည်**။

```bash
# Bucket Key ပါဝင်သော SSE-KMS Encryption သတ်မှတ်ခြင်း
aws s3api put-bucket-encryption \
    --bucket my-production-company-bucket \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "aws:kms",
                "KMSMasterKeyId": "arn:aws:kms:ap-northeast-1:123456789012:key/my-key-id"
            },
            "BucketKeyEnabled": true
        }]
    }'
```

### အဆင့် ၃: S3 Lifecycle Configuration (ကုန်ကျစရိတ် အလိုအလျောက် လျှော့ချခြင်း)
```bash
aws s3api put-bucket-lifecycle-configuration \
    --bucket my-production-company-bucket \
    --lifecycle-configuration '{
        "Rules": [{
            "ID": "ArchiveOldLogsAndCleanVersions",
            "Status": "Enabled",
            "Filter": {"Prefix": "logs/"},
            "Transitions": [
                {"Days": 30, "StorageClass": "STANDARD_IA"},
                {"Days": 90, "StorageClass": "GLACIER_IR"},
                {"Days": 180, "StorageClass": "DEEP_ARCHIVE"}
            ],
            "NoncurrentVersionExpiration": {"NoncurrentDays": 365}
        }]
    }'
```

### အဆင့် ၄: S3 Presigned URLs (လုံခြုံသော Direct Browser Uploads)
Frontend User များသည် ကြီးမားသော Video/PDF ဖိုင်များကို EC2 Server ဆီသို့ အရင်မပို့ဘဲ S3 သို့ တိုက်ရိုက် Upload တင်နိုင်ရန် Backend (Node.js/Python) က ၁၅ မိနစ် သက်တမ်းရှိသော Presigned URL ထုတ်ပေးနိုင်သည်:

```bash
# AWS CLI ဖြင့် ၁၅ မိနစ် သက်တမ်းရှိ Presigned Download URL ထုတ်ယူခြင်း
aws s3 presign s3://my-production-company-bucket/financial-report-2026.pdf --expires-in 900
```

---

## ၆.၂ Amazon EFS Production Setup & Mount Target Operations (အဆင့်ဆင့်)

```
+-----------------------------------------------------------------------------------+
|                        AMAZON EFS ENTERPRISE ARCHITECTURE                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   Amazon EFS File System (General Purpose | Bursting Throughput | Multi-AZ)       |
|                                       |                                           |
|       +-------------------------------+-------------------------------+           |
|       |                                                               |           |
|       v (Mount Target Port 2049)                                      v           |
|  [Subnet AZ-1a (Private)]                                    [Subnet AZ-1c]       |
|  Mount IP: 10.0.11.50                                        Mount IP: 10.0.12.50 |
|       ^                                                               ^           |
|       | (NFSv4 Protocol over TLS)                                     |           |
|  [EC2 Web Instance 1]                                        [EC2 Web Instance 2] |
|  Mount Path: `/var/www/html/wp-content/uploads`              Mount Path: (Same)   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဆင့် ၁: EFS Security Group တည်ဆောက်ခြင်း (`sg-efs-mount`)
- **Inbound Rule:** Port `2049` (NFS)
- **Source:** EC2 Web Server Security Group ID (`sg-ec2-web`) သာ ခွင့်ပြုရမည်။

### အဆင့် ၂: Linux EC2 ပေါ်တွင် EFS ချိတ်ဆက် Mount ပြုလုပ်ခြင်း
Amazon Linux / Ubuntu တွင် `amazon-efs-utils` Package ကို သုံး၍ Encrypted NFS ဖြင့် Mount ပြုလုပ်သည်:

```bash
# ၁။ EFS Helper Package သွင်းခြင်း
sudo dnf install -y amazon-efs-utils

# ၂။ Mount Point Folder ဆောက်ခြင်း
sudo mkdir -p /var/www/html/uploads

# ၃။ TLS Encryption ဖြင့် လက်တွေ့ Mount ချိတ်ခြင်း
sudo mount -t efs -o tls fs-0123456789abcdef0:/ /var/www/html/uploads

# ၄။ Server Reboot တက်တိုင်း အလိုအလျောက် Mount တက်စေရန် `/etc/fstab` တွင် ထည့်ခြင်း
echo "fs-0123456789abcdef0:/ /var/www/html/uploads efs _netdev,tls 0 0" | sudo tee -a /etc/fstab
```

### အဆင့် ၃: EFS Lifecycle Management (Infrequent Access - IA)
- **EFS IA (Infrequent Access):** ရက် ၃၀ အတွင်း မည်သူမျှ မဖွင့်ကြည့်သော ဖိုင်များကို EFS IA သို့ အလိုအလျောက် ရွှေ့ပြောင်းပေးပြီး **သိုလှောင်ခ ၉၀% အထိ သက်သာစေသည်** (Standard: $0.30/GB vs IA: $0.025/GB)။

---

## ၆.၃ EBS vs EFS vs S3 မဖြစ်မနေ သိရမည့် ဆုံးဖြတ်ချက် ဇယား (Crucial Comparison)

```
+-----------------------------------------------------------------------------------------+
|                            EBS VS EFS VS S3 DECISION MATRIX                             |
+-----------------------------------------------------------------------------------------+
|  Scenario Requirement                                |  အသင့်တော်ဆုံး ရွေးချယ်ရမည့် Storage  |
+------------------------------------------------------+----------------------------------+
|  - EC2 Root Boot Disk, OS files, single MySQL server |  **Amazon EBS (gp3 / io2)**      |
|  - Shared filesystem across hundreds of Linux EC2s   |  **Amazon EFS (NFSv4)**          |
|  - Windows Active Directory file sharing (SMB)       |  **Amazon FSx for Windows**      |
|  - Static web images, video streaming, big data lake|  **Amazon S3 Standard**          |
|  - Compliance 7-10 years archival with zero access   |  **S3 Glacier Deep Archive**     |
+------------------------------------------------------+----------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [07_Phase7_Databases_RDS_Aurora_DynamoDB.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/07_Phase7_Databases_RDS_Aurora_DynamoDB.md)
