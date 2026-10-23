---
title: "၈။ Security Best Practices & Monitoring"
description: "EC2 လုံခြုံရေး အကောင်းဆုံးနည်းလမ်းများ (IMDSv2, IAM Profiles, SSM), CloudWatch Metrics, Unified CloudWatch Agent နှင့် CloudTrail Audit"
---

# ၈။ Security Best Practices & Monitoring

## EC2 Security Best Practices (လုံခြုံရေး အခြေခံ ၆ ချက်)

### ၁။ Hardcoded Credentials များကို လုံးဝ (လုံးဝ) မသုံးပါနှင့် (Use IAM Roles)
EC2 ပေါ်ရှိ Application (ဥပမာ- Laravel API) က S3 Bucket ထဲသို့ ပုံများ Upload လုပ်လိုပါက Access Key ID နှင့် Secret Key များကို `.env` သို့မဟုတ် Code ထဲတွင် ဘယ်သောအခါမျှ မထည့်ပါနှင့်။
- **ဖြေရှင်းနည်း:** လိုအပ်သော S3 Permission သာပါဝင်သည့် **IAM Role** တစ်ခု တည်ဆောက်ပြီး EC2 Instance ထံသို့ **IAM Instance Profile** အဖြစ် Attach ပြုလုပ်ပေးပါ။ AWS သည် ယာယီလုံခြုံရေး Token (Temporary Credentials) များကို အလိုအလျောက် ပေးအပ်ပြီး ၆ နာရီတစ်ကြိမ် Rotate ပြုလုပ်ပေးပါမည်။

### ၂။ IMDSv2 ကို မဖြစ်မနေ အသုံးပြုပါ (Protect Against SSRF Attacks)
EC2 Instance Metadata (169.254.169.254) တွင် IAM Role ၏ ယာယီ Credentials များ တည်ရှိပါသည်။
- **IMDSv1 အားနည်းချက်:** ရိုးရိုး HTTP GET request ဖြင့် ခေါ်ယူနိုင်သဖြင့် Web Application တွင် **SSRF (Server-Side Request Forgery)** အားနည်းချက်ရှိပါက ဟက်ကာက Server မှတစ်ဆင့် Metadata ကို လှမ်းခိုးယူနိုင်သည်။
- **IMDSv2 ကာကွယ်မှု:** Session-oriented ဖြစ်ပြီး အရင်ဆုံး `HTTP PUT` ဖြင့် Token တောင်းယူရသည်။ ထို့နောက်မှ ထို Token ခေါင်းစီး (`X-aws-ec2-metadata-token`) ပါမှသာ ဒေတာ ပေးသည်။

```bash
# EC2 တွင် IMDSv2 ကိုသာ အတင်းအကျပ် သုံးစေရန် (Enforce IMDSv2)
aws ec2 modify-instance-metadata-options \
    --instance-id i-0123456789abcdef0 \
    --http-tokens required \
    --http-endpoint enabled
```

### ၃။ Port 22 (SSH) ကို အင်တာနက် အများပြည်သူသို့ မဖွင့်ပါနှင့်
Inbound Rule တွင် `0.0.0.0/0:22` ဖွင့်ထားခြင်းသည် Brute-force တိုက်ခိုက်မှုများကို ဖိတ်ခေါ်နေခြင်း ဖြစ်သည်။
- **အကြံပြုချက်:** **AWS Systems Manager (SSM) Session Manager** သို့မဟုတ် **EC2 Instance Connect Endpoint (EICE)** ကို သုံးပါက Private Subnet ရှိ Server များကိုပင် Internet Gateway သို့မဟုတ် Bastion Host မလိုဘဲ AWS Console မှ တိုက်ရိုက် လုံခြုံစွာ Login ဝင်ရောက်နိုင်ပါသည်။

---

## EC2 Monitoring with Amazon CloudWatch

```
┌─────────────────────────────────────────────────────────────────┐
│                      CloudWatch Monitoring                      │
├────────────────────────────────┬────────────────────────────────┤
│    Basic Metrics (အခမဲ့/Default) │    Custom Metrics (Agent လိုအပ်) │
│    [Hypervisor မှ တိုက်ရိုက်ရသည်] │    [OS အတွင်းပိုင်း အချက်အလက်]   │
├────────────────────────────────┼────────────────────────────────┤
│ • CPUUtilization (%)           │ • Memory (RAM) Utilization (%) │
│ • NetworkIn / NetworkOut       │ • Disk Space Used (%)          │
│ • DiskReadBytes / DiskWrite    │ • Swap Utilization             │
│ • StatusCheckFailed_Instance   │ • Application Process Logs     │
│ • StatusCheckFailed_System     │                                │
└────────────────────────────────┴────────────────────────────────┘
```

### 💡 SAA-C03 အရေးကြီးဆုံး စာမေးပွဲ အချက်:
> **အဘယ်ကြောင့် RAM (Memory) နှင့် Disk Space သုံးစွဲမှုများသည် CloudWatch Default Metrics တွင် မပါဝင်သနည်း?**  
> **အဖြေ:** AWS Hypervisor သည် Virtual Machine ၏ ပြင်ပမှသာ စောင့်ကြည့်နိုင်ပြီး VM အတွင်းရှိ Operating System ၏ RAM Memory allocation နှင့် File System နေရာလွတ်များကို လုံခြုံရေးနှင့် သီးသန့်ဖြစ်မှုအရ တိုက်ရိုက် မမြင်တွေ့နိုင်ပါ။  
> ထို Memory နှင့် Disk Metrics များကို ရရှိရန် EC2 အတွင်း၌ **Unified CloudWatch Agent (`amazon-cloudwatch-agent`)** ကို တပ်ဆင် run ပေးရပါမည်။

---

## CloudWatch Alarms & Auto Recovery

Server ချွတ်ယွင်းမှုများကို အလိုအလျောက် တုံ့ပြန်ရန် CloudWatch Alarms ကို သတ်မှတ်နိုင်ပါသည်:

1. **Auto Recovery Action:**  
   အကယ်၍ `StatusCheckFailed_System` (AWS Physical Host ချွတ်ယွင်းမှု) ဖြစ်ပေါ်ပါက CloudWatch Alarm မှတစ်ဆင့် ထို Instance ကို **အခြား ကျန်းမာသော Physical Host ပေါ်သို့ အလိုအလျောက် ရွှေ့ပြောင်းပေးခြင်း (EC2 Auto-Recover)** ပြုလုပ်နိုင်သည်။ (Instance ID, Private IP, Elastic IP နှင့် EBS Data များ မပြောင်းလဲဘဲ မူလအတိုင်း ဆက်ရှိနေသည်)။
2. **Notification Action:**  
   CPU သုံးစွဲမှု 80% ကျော်ပါက **Amazon SNS** မှတစ်ဆင့် DevOps အင်ဂျင်နီယာ၏ Email သို့မဟုတ် Slack သို့ သတိပေးချက် ချက်ချင်း ပေးပို့စေခြင်း။
3. **Auto Scaling Action:**  
   Traffic တက်လာပါက ASG အား Instance +2 ထပ်တိုးစေခြင်း။

---

## AWS CloudTrail ဖြင့် စာရင်းစစ်ခြင်း (Auditing)

AWS အကောင့်အတွင်း မည်သူက မည်သည့်အချိန်တွင် EC2 ကို စတင်ခဲ့သည်၊ ပိတ်ခဲ့သည်၊ သို့မဟုတ် Security Group ကို ပြင်ဆင်ခဲ့သည် စသည့် API Activity တိုင်းကို **AWS CloudTrail** က Event History အဖြစ် အလိုအလျောက် မှတ်တမ်းတင်ပေးပါသည်။ လုံခြုံရေး စစ်ဆေးခြင်း (Forensic Analysis) နှင့် အမှားရှာဖွေခြင်းများတွင် အဓိက အသုံးပြုပါသည်။
