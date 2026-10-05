---
title: "Phase 12 — Monitoring, Operations & AWS Systems Manager (SSM) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)"
description: "Architect Perspective: စနစ်တစ်ခုကို Deploy လုပ်ပြီးရုံဖြင့် Architect တာဝန် မပြီးဆုံးသေးပါ။ Production IT လုပ်ငန်းခွင်တွင် System Downtime မဖြစ်စေရန် အချိန်နှင့"
---

## Phase 12 — Monitoring, Operations & AWS Systems Manager (SSM) (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် လမ်းညွှန်)

> **Architect Perspective:** စနစ်တစ်ခုကို Deploy လုပ်ပြီးရုံဖြင့် Architect တာဝန် မပြီးဆုံးသေးပါ။ Production IT လုပ်ငန်းခွင်တွင် System Downtime မဖြစ်စေရန် အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်ခြင်း (**Observability - CloudWatch**), လုံခြုံရေး ပေါက်ကြားမှု စစ်ဆေးနိုင်ခြင်း (**Auditing - CloudTrail**) နှင့် Port 22 (SSH) ဖွင့်စရာမလိုဘဲ ရာနှင့်ချီသော Server များကို ဗဟိုမှ အလိုအလျောက် စီမံခန့်ခွဲနိုင်ခြင်း (**Fleet Management - AWS Systems Manager**) တို့ကို အဆင့်ဆင့် လက်တွေ့ လုပ်ဆောင်နိုင်ရမည်။

---

## ၁၂.၁ Amazon CloudWatch: Production Observability (အဆင့်ဆင့် တည်ဆောက်ပုံ)

EC2 Instance တစ်ခုကို စတင်ဖွင့်လိုက်ချိန်တွင် AWS သည် **Hypervisor Level မှ ရရှိသော Metrics (CPU, Disk I/O, Network In/Out)** ကိုသာ ပေးသည်။ **Memory (RAM) နှင့် Disk Space Usage တို့ကို Default အနေဖြင့် မရနိုင်ပါ!** (အဘယ်ကြောင့်ဆိုသော် RAM နှင့် Disk Space သည် Guest OS အတွင်းပိုင်း Data ဖြစ်ပြီး AWS Hypervisor က User ၏ OS အတွင်းသို့ ဝင်မကြည့်သောကြောင့် ဖြစ်သည်)။

```
+-----------------------------------------------------------------------------------+
|                        CLOUDWATCH OBSERVABILITY ARCHITECTURE                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   | Amazon EC2 Instance (Linux / Windows)                                     |   |
|   |                                                                           |   |
|   |   [Application & Nginx Logs] -------\                                     |   |
|   |                                      v                                    |   |
|   |   [CloudWatch Unified Agent] -------------> Sends RAM & Disk Metrics      |   |
|   |   (Installed on OS)          -------------> Streams Log Files             |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | Amazon CloudWatch Service                                                 |   |
|   |  - Metrics: CPU, RAM Utilization, Disk Used %, Network                    |   |
|   |  - Log Groups: `/aws/ec2/production-app/nginx/access.log`                  |   |
|   |  - Metric Filter: "Count 500 Internal Server Errors"                      |   |
|   |  - Alarms: Trigger Auto Scaling / Alert DevOps Team via SNS               |   |
|   |  - Dashboard: Real-Time Operational Overview                              |   |
|   +---------------------------------------------------------------------------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Step-by-Step: CloudWatch Agent ဖြင့် RAM နှင့် Disk Metrics ရယူနည်း

1. **Step 1 - IAM Role သတ်မှတ်ခြင်း:**
   - EC2 Instance Profile ပေါ်တွင် AWS Managed Policy ဖြစ်သော `CloudWatchAgentServerPolicy` ကို တွဲဖက်ပေးရမည်။
2. **Step 2 - CloudWatch Agent သွင်းခြင်း (via AWS Systems Manager):**
   ```bash
   # Amazon Linux 2023 တွင် Package သွင်းခြင်း
   sudo dnf install -y amazon-cloudwatch-agent
   ```
3. **Step 3 - Configuration JSON ရေးဆွဲခြင်း (`/opt/aws/amazon-cloudwatch-agent/bin/config.json`):**
   ```json
   {
     "metrics": {
       "metrics_collected": {
         "mem": {
           "measurement": [
             "mem_used_percent"
           ],
           "metrics_collection_interval": 60
         },
         "disk": {
           "measurement": [
             "used_percent"
           ],
           "resources": [
             "/"
           ],
           "metrics_collection_interval": 60
         }
       }
     },
     "logs": {
       "logs_collected": {
         "files": {
           "collect_list": [
             {
               "file_path": "/var/log/nginx/error.log",
               "log_group_name": "/production/nginx/error.log",
               "log_stream_name": "{instance_id}"
             }
           ]
         }
       }
     }
   }
   ```
4. **Step 4 - Agent ကို စတင် Run ခြင်း:**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
       -a fetch-config \
       -m ec2 \
       -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json \
       -s
   ```

---

## ၁၂.၂ CloudWatch Logs Insights (လက်တွေ့ အသုံးများသော Production Queries)

Log ဖိုင်များထဲတွင် Error ရှာဖွေရာတွင် Terminal တွင် `grep` ရိုက်မည့်အစား **CloudWatch Logs Insights** ဖြင့် SQL ကဲ့သို့ အလွန်မြန်ဆန်စွာ စစ်ဆေးနိုင်သည်-

### Query 1: အဖြစ်အများဆုံး HTTP 5xx Server Errors များကို ရှာဖွေခြင်း
```sql
fields @timestamp, @message, status, request_uri
| filter status >= 500
| sort @timestamp desc
| limit 50
```

### Query 2: Error အများဆုံး ဖြစ်စေသော Client IP Addresses များကို Top 10 စာရင်းထုတ်ခြင်း
```sql
fields client_ip
| filter status >= 400
| stats count(*) as errorCount by client_ip
| sort errorCount desc
| limit 10
```

### Query 3: Application Exception Stack Traces များကို ရှာဖွေခြင်း
```sql
fields @timestamp, @message
| filter @message like /(?i)(Exception|Fatal|Error)/
| sort @timestamp desc
| limit 25
```

---

## ၁၂.၃ CloudWatch Alarms & Auto-Recovery Actions

CloudWatch Alarm တစ်ခုသည် သတ်မှတ်ထားသော Threshold (ဥပမာ CPU > 80% for 5 mins) ကျော်လွန်ပါက အောက်ပါ အရေးယူဆောင်ရွက်မှု (၃) မျိုး ပြုလုပ်နိုင်သည်-

1. **Notification Action:** Amazon SNS Topic သို့ Message ပို့၍ DevOps Team ထံ Email သို့မဟုတ် Slack Alert ပေးပို့ခြင်း။
2. **Auto Scaling Action:** Auto Scaling Group သို့ အကြောင်းကြားပြီး Server အရေအတွက် တိုးချဲ့စေခြင်း (Scale Out)။
3. **EC2 Action (Auto-Recovery):**
   - အကယ်၍ EC2 ၏ **Status Check Failed (System)** - ဆိုလိုသည်မှာ AWS ဘက်ခြမ်းမှ Physical Hardware ချို့ယွင်းသွားပါက CloudWatch Alarm က **EC2 Instance ကို အခြား ကျန်းမာသော Physical Hardware ပေါ်သို့ အလိုအလျောက် ရွှေ့ပြောင်း နိုးထပေးသည် (Recover)**။ Private IP, Elastic IP, Instance ID နှင့် Volume များ မပြောင်းလဲဘဲ မူလအတိုင်း ပြန်လည် အလုပ်လုပ်သည်။

```bash
# EC2 Hardware ကျပါက Auto-Recover လုပ်မည့် Alarm ဖန်တီးသော CLI Command
aws cloudwatch put-metric-alarm \
    --alarm-name "EC2-AutoRecover-On-HardwareFailure" \
    --metric-name StatusCheckFailed_System \
    --namespace AWS/EC2 \
    --statistic Minimum \
    --period 60 \
    --evaluation-periods 2 \
    --threshold 1 \
    --comparison-operator GreaterThanOrEqualToThreshold \
    --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
    --alarm-actions arn:aws:automate:ap-northeast-1:ec2:recover
```

---

## ၁၂.၄ AWS CloudTrail: Security Auditing & Forensic Investigation

CloudTrail သည် Account အတွင်း ဖြစ်ပျက်သမျှ API Calls အားလုံးကို မှတ်တမ်းတင်သော "Black Box Flight Recorder" ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                            CLOUDTRAIL EVENT LOG ANATOMY                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  {                                                                                |
|    "eventTime": "2026-09-21T02:14:22Z",                                           |
|    "eventName": "DeleteBucket",                     <-- မည်သည့် API Action လဲ     |
|    "userIdentity": {                                                              |
|      "type": "IAMUser",                                                           |
|      "userName": "bad-actor-or-compromised-user"    <-- မည်သူ ပြုလုပ်သွားသလဲ     |
|    },                                                                             |
|    "sourceIPAddress": "198.51.100.45",              <-- မည်သည့် ပြင်ပ IP မှ လာသလဲ|
|    "requestParameters": {                                                         |
|      "bucketName": "production-finance-records-2026"                              |
|    },                                                                             |
|    "responseElements": null                                                       |
|  }                                                                                |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### CloudTrail Production Best Practices:
1. **Multi-Region Trail with Organization:** Account တစ်ခုတည်းသာမက AWS Organizations အောက်ရှိ Accounts အားလုံးအတွက် Region အားလုံးတွင် CloudTrail ကို တစ်ပြိုင်နက် ဖွင့်ထားရမည်။
2. **Log File Integrity Validation:** စာရင်းစစ် (Audit) လုပ်ရာတွင် မသမာသူများ Log ဖိုင်ကို ဝင်ရောက် ပြင်ဆင်ဖျက်ဆီးခြင်း မရှိစေရန် **SHA-256 Digest Validation** ဖွင့်ထားရမည်။
3. **Encrypted Log Storage:** S3 Bucket ပေါ်သို့ ရောက်ရှိသော Log များကို AWS KMS Customer Managed Key (CMK) ဖြင့် Encrypt လုပ်ပြီး Bucket Policy တွင် `MFA Delete` နှင့် `Object Lock` ကာကွယ်ထားရမည်။

---

## ၁၂.၅ AWS Systems Manager (SSM) Fleet Operations (အဆင့်ဆင့် အသုံးချပုံ)

အတွေ့အကြုံရှိသော Cloud Enterprise အဖွဲ့များသည် **Bastion Host (Jump Server) များကို မသုံးတော့ဘဲ SSH Port 22 ကို လုံးဝ ပိတ်ထားကြသည်**။ ၎င်းအစား AWS Systems Manager ကို အောက်ပါအတိုင်း အဆင့်ဆင့် အသုံးပြုသည်-

```
+-----------------------------------------------------------------------------------+
|                       TRADITIONAL BASTION VS AWS SSM WORKFLOW                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [OLD LEGACY WAY - HIGH RISK]                                                     |
|  Admin Laptop ---> Port 22 Open (Internet) ---> Bastion Host ---> EC2 in Private  |
|  - SSH Key Pairs ပေါက်ကြားနိုင်သည်၊ Port 22 တိုက်ခိုက်ခံရနိုင်သည်                   |
|                                                                                   |
|  ===============================================================================  |
|                                                                                   |
|  [MODERN AWS BEST PRACTICE - ZERO TRUST]                                          |
|  Admin Laptop ---> AWS IAM / Console Login ---> AWS Systems Manager ---> EC2     |
|  - **No Open Inbound Ports! (Port 22 လုံးဝ ပိတ်ထားသည်)**                           |
|  - **No SSH Keys to Manage!**                                                     |
|  - Session Activity အားလုံးကို CloudWatch Logs တွင် Video ကဲ့သို့ Keystroke မှတ်တမ်းတင်သည်|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Step 1: EC2 သို့ SSM Role ချိတ်ဆက်ခြင်း
1. IAM Console တွင် Role တစ်ခု ဆောက်ပြီး **`AmazonSSMManagedInstanceCore`** Managed Policy ကို Attach လုပ်ပါ။
2. EC2 Instance ပေါ်သို့ အဆိုပါ IAM Role (Instance Profile) ကို Attach ပြုလုပ်ပေးပါ။
3. Amazon Linux 2023, Ubuntu 20.04+ နှင့် Windows Server AMI များတွင် **SSM Agent သည် Pre-installed ပါဝင်ပြီးသား** ဖြစ်သဖြင့် အလိုအလျောက် Systems Manager နှင့် ဆက်သွယ်မိပါမည်။

### Step 2: One-Click Browser Shell ဝင်ရောက်ခြင်း (Session Manager)
- AWS Console -> Systems Manager -> **Session Manager** -> **Start Session** ကို နှိပ်ပြီး မိမိ Instance ကို ရွေးလိုက်သည်နှင့် Browser ထဲတွင် Terminal ချက်ချင်း ပွင့်လာပါမည်။

### Step 3: Local Terminal မှတစ်ဆင့် SSH CLI ဖြင့် ဝင်ရောက်ခြင်း
AWS CLI တွင် Session Manager Plugin သွင်းထားပါက မိမိ Laptop Terminal မှ အောက်ပါ command တစ်ကြောင်းဖြင့် ဝင်ရောက်နိုင်သည်-
```bash
aws ssm start-session --target i-0123456789abcdef0
```

### Step 4: Local Port Forwarding (Private RDS ကို မိမိ Laptop မှ လှမ်းချိတ်နည်း)
Private Subnet ထဲရှိ RDS MySQL Database ကို မိမိ Laptop ရှိ MySQL Workbench / DBeaver ဖြင့် လှမ်းချိတ်လိုပါက Bastion Host မလိုဘဲ SSM Port Forwarding ဖြင့် လုံခြုံစွာ ချိတ်နိုင်သည်-
```bash
# Local Port 3306 ကို Private Subnet ရှိ RDS Endpoint ၏ Port 3306 သို့ လုံခြုံစွာ Forward လုပ်ခြင်း
aws ssm start-session \
    --target i-0123456789abcdef0 \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters '{"host":["mydb.c8xyz.ap-northeast-1.rds.amazonaws.com"],"portNumber":["3306"],"localPortNumber":["3306"]}'
```

---

## ၁၂.၆ SSM Run Command (ဆာဗာ ရာချီကို တပြိုင်နက် Automation လုပ်ခြင်း)

EC2 Server အလုံး ၅၀ တွင် Security Update တင်ရန် သို့မဟုတ် Nginx Configuration ပြင်ရန် Server တစ်လုံးချင်းစီ SSH ဝင်စရာ မလိုပါ။

```bash
# Production Web Servers အားလုံးတွင် Nginx Configuration ကို စစ်ဆေးပြီး Restart လုပ်ခြင်း
aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets '[{"Key":"tag:Role","Values":["WebServer"]}]' \
    --parameters 'commands=["nginx -t", "systemctl reload nginx"]' \
    --comment "Reload Nginx on all WebServers"
```

---

## ၁၂.၇ SSM Patch Manager (အလိုအလျောက် OS Patch တင်ခြင်း)

1. **Patch Baseline:**
   - Linux / Windows အတွက် "Critical" နှင့် "Important" Security Patches များကို ထုတ်ပြန်ပြီး ၇ ရက် ကြာလျှင် အလိုအလျောက် သွင်းယူရန် သတ်မှတ်ခြင်း (7 days auto-approval delay)။
2. **Maintenance Window:**
   - စနေနေ့ ညသန်းခေါင် (ဥပမာ 02:00 AM JST) တွင် အလိုအလျောက် Run စေပြီး Patching ပြီးဆုံးပါက လိုအပ်လျှင် Server Reboot လုပ်စေသည်။
3. **Compliance Dashboard:**
   - မည်သည့် Server က Patch မတင်ရသေး (Non-compliant) ဖြစ်နေသည်ကို Dashboard တစ်ခုတည်းတွင် အစီရင်ခံစာ ထုတ်ပေးသည်။

---

## ၁၂.၈ Real Incident Runbook: "EC2 CPU 95% အရေးပေါ် ဖြစ်ရပ်မှန် စစ်ဆေးဖြေရှင်းနည်း"

```
+-----------------------------------------------------------------------------------+
|                        CPU 95% INCIDENT RESPONSE RUNBOOK                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [PHASE 1: DETECTION & TRIAGE]                                                    |
|  1. CloudWatch Alarm က CPU > 90% ဖြစ်နေကြောင်း SNS မှတစ်ဆင့် PagerDuty / Slack သို့ |
|     အရေးပေါ် Alert ပို့သည်။                                                        |
|  2. On-call Engineer သည် CloudWatch Dashboard ဖွင့်ပြီး Instance ID: `i-0987abc`  |
|     ဖြစ်ကြောင်း အတည်ပြုသည်။                                                        |
|                                                                                   |
|  [PHASE 2: INVESTIGATION WITHOUT SSH]                                             |
|  3. Engineer သည် Port 22 ဖွင့်စရာမလိုဘဲ SSM Session Manager ဖြင့် Terminal ဝင်သည်။  |
|     `aws ssm start-session --target i-0987abc`                                    |
|  4. CPU စားနေသော Process ကို စစ်ဆေးသည်:                                            |
|     `top -b -n 1 | head -n 20`                                                    |
|     -> တွေ့ရှိချက်: Zombie Python worker script တစ်ခုက CPU 98% စားသုံးနေသည်။       |
|                                                                                   |
|  [PHASE 3: LOG DEEP-DIVE]                                                         |
|  5. CloudWatch Logs Insights တွင် အဆိုပါ Worker Script ၏ Error log ကို ရှာဖွေသည်:  |
|     `filter @message like /InfiniteLoopException/ | limit 10`                     |
|                                                                                   |
|  [PHASE 4: REMEDIATION & RESTORATION]                                             |
|  6. မသမာသော Rogue Process ကို ချက်ချင်း Kill လုပ်သည်:                               |
|     `sudo kill -9 <PID>`                                                          |
|  7. Application Service ကို ပြန်လည် စတင်သည်:                                       |
|     `sudo systemctl restart worker-service`                                       |
|  8. CPU Utilization ပြန်လည် ကျဆင်းသွားကြောင်း CloudWatch Graph တွင် စောင့်ကြည့်အတည်ပြုသည်|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*သင်ရိုးမာတိကာသို့ ပြန်သွားရန်:* [README.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/README.md)
