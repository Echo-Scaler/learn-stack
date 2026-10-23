---
title: "Amazon CloudWatch — Complete Master Architectural Guide"
description: "Amazon CloudWatch — Monitoring and management service providing data and insights for AWS resources ကို မြန်မာလို အခြေခံမှ စတင်၍ Metrics, Logs, Alarms, Unified Agent နှင့် SAA-C03 Guide"
---

# Amazon CloudWatch
### Observability, Monitoring, Log Analytics & Automated Remediation Framework

Amazon CloudWatch သည် AWS Cloud နှင့် On-Premises ပတ်ဝန်းကျင်ရှိ Resources များနှင့် Application များ၏ **စွမ်းဆောင်ရည် (Performance Metrics)၊ လုပ်ငန်းမှတ်တမ်းများ (Logs) နှင့် အလိုအလျောက် သတိပေးမှုများ (Alarms)** ကို တစ်နေရာတည်းတွင် စောင့်ကြည့်ပေးသော **AWS မဏ္ဍိုင် Observability Service** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

ဆာဗာများစွာနှင့် Microservices များ လည်ပတ်နေသော Cloud စနစ်တွင် မည်သည့် Server က CPU ပြည့်နေသနည်း၊ မည်သည့် Application က 500 Internal Server Error တက်နေသနည်း၊ Disk Storage မည်မျှ ကျန်ရှိသနည်း စသည်တို့ကို လူကိုယ်တိုင် လိုက်လံ စစ်ဆေးရန် မဖြစ်နိုင်ပေ။

**Amazon CloudWatch ၏ အဓိက ရည်ရွယ်ချက်:**  
AWS Services အားလုံးထံမှ Telemetry Data (Metrics နှင့် Logs) များကို စဉ်ဆက်မပြတ် စုစည်းပေးပြီး၊ ပြဿနာ တစ်စုံတစ်ရာ ဖြစ်ပေါ်ပါက **Amazon SNS မှတစ်ဆင့် ဖုန်း/Email သို့ ချက်ချင်း သတိပေးခြင်း** သို့မဟုတ် **EC2 Auto Scaling ဖြင့် ဆာဗာအသစ် အလိုအလျောက် တိုးချဲ့ပေးခြင်း** တို့ကို စက္ကန့်ပိုင်းအတွင်း ဆောင်ရွက်ပေးရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **CloudWatch Metrics** | Numerical Time-Series Data | စွမ်းဆောင်ရည် ကိန်းဂဏန်းများ (ဥပမာ- EC2 `CPUUtilization`, NetworkIn, DiskReadBytes)။ Standard Monitoring (၅ မိနစ်တစ်ကြိမ်) နှင့် Detailed Monitoring (၁ မိနစ်တစ်ကြိမ်)။ |
| **Unified CloudWatch Agent** | Guest OS Collector | **EC2 အတွင်းပိုင်း Memory (RAM) Utilization နှင့် Disk Space Used** စသည့် Default အနေဖြင့် မရရှိနိုင်သော OS-level Metrics များကို ရယူရန် Instance ပေါ်တွင် သွင်းရသော Software ဖြစ်သည်။ |
| **CloudWatch Logs** | Centralized Log Store | System Logs, Application Logs (`nginx`, `error.log`) များကို စုစည်းထားသော နေရာ ဖြစ်သည်။ (Log Groups & Log Streams)။ |
| **Metric Filters** | Log-to-Metric Converter | Logs များထဲတွင် `"ERROR"` သို့မဟုတ် `"Exception"` စာလုံး ပါလာတိုင်း ကိန်းဂဏန်း Metric အဖြစ် ပြောင်းလဲပေးသည်။ |
| **CloudWatch Alarms** | Automated Triggers | Metric တန်ဖိုး သတ်မှတ်ထားသော Threshold (ဥပမာ- CPU > 80%) ကျော်လွန်ပါက သုံးစွဲသူထံ အကြောင်းကြားခြင်း သို့မဟုတ် EC2 Auto Scaling/Auto-Recovery ပြုလုပ်ခြင်း။ |
| **CloudWatch Dashboards** | Visual Status Board | AWS အကောင့်တစ်ခုလုံး၏ ကျန်းမာရေး အခြေအနေကို Single Page Graphical Widgets ဖြင့် ပြသခြင်း။ |

---

## 3. Architecture (Diagram & Observability Pipeline)

Unified CloudWatch Agent မှ Metrics စုဆောင်း၍ အလိုအလျောက် အရေးယူဆောင်ရွက်သော Flow:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Amazon EC2 Instance (Guest OS)                                         │
│                                                                        │
│  [ CPU / Network ] ──► (Built-in AWS Hypervisor Metric - No Agent)     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Unified CloudWatch Agent (Installed Inside OS)                   │  │
│  │  • Memory (RAM) Utilization %                                    │  │
│  │  • Disk Space Available %                                        │  │
│  │  • App Logs: /var/log/nginx/access.log                           │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ (Push Metrics & Logs)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Amazon CloudWatch Platform                                             │
│                                                                        │
│   [ CloudWatch Logs ] ──► (Metric Filter: Filter "404 Not Found")      │
│            │                                                           │
│            ▼                                                           │
│   [ CloudWatch Metrics (CPU > 85% or Memory > 90%) ]                   │
│            │                                                           │
│            ▼ (State: ALARM)                                            │
│   [ CloudWatch Alarm Actions ]                                         │
│            │                                                           │
│            ├─────────────────────────┬─────────────────────────┐       │
│            ▼                         ▼                         ▼       │
│     [ Amazon SNS ]          [ EC2 Auto Scaling ]     [ EC2 Recovery ]  │
│     (Email / SMS Alert)     (Scale-out +2 Instances) (Reboot VM)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Metric Collection:** AWS Services များ (EC2, S3, RDS, Lambda) သည် ၎င်းတို့၏ စွမ်းဆောင်ရည် အချက်အလက်များကို CloudWatch သို့ အလိုအလျောက် ပေးပို့သည်။
2. **Alarm States ၃ မျိုး စစ်ဆေးခြင်း:**
   - **OK:** Metric တန်ဖိုးသည် သတ်မှတ်ထားသော ကန့်သတ်ချက်အတွင်း ပုံမှန် ရှိနေသည်။
   - **ALARM:** Metric တန်ဖိုးသည် သတ်မှတ်ထားသော Threshold ထက် ကျော်လွန်သွားသည် (ဥပမာ- CPU 80% ကျော်နေသည်)။
   - **INSUFFICIENT_DATA:** ဆာဗာ စတင် run ခါစ သို့မဟုတ် Metric အချက်အလက် မလုံလောက်သေးပါ။
3. **Automated Action Execution:** Alarm State ဖြစ်သွားသည်နှင့် ကြိုတင်ချိတ်ဆက်ထားသော Target (Auto Scaling Group ဖြင့် Server အရေအတွက် တိုးမြှင့်ခြင်း သို့မဟုတ် SNS ဖြင့် အင်ဂျင်နီယာများထံ PagerDuty/Email ပို့ခြင်း) ကို ချက်ချင်း အကောင်အထည်ဖော်သည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Dynamic Auto Scaling:** CPU သို့မဟုတ် Request Count တက်လာပါက EC2 Auto Scaling Group ကို အလိုအလျောက် ချိန်ညှိခြင်း။
- **Memory & Disk Space Monitoring:** CloudWatch Agent ဖြင့် RAM ပြည့်လျှံခြင်းနှင့် Hard Disk ပြည့်သွားခြင်းများကို ကြိုတင် သိရှိကာကွယ်ခြင်း။
- **EC2 Instance Auto-Recovery:** Hypervisor Hardware ပျက်စီးသွားပါက တူညီသော IP/EBS ဖြင့် EC2 Instance ကို အလိုအလျောက် Reboot လုပ်၍ ပြန်လည် အသက်သွင်းခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- AWS Services အားလုံးနှင့် အနီးကပ်ဆုံး ချိတ်ဆက်ထားသော Native Observability စနစ်။
- Retention Period အလိုက် Logs များကို အလိုအလျောက် ဖျက်ပစ်နိုင်သဖြင့် နေရာမယူပါ။
- Cross-Account and Cross-Region Dashboards ထောက်ပံ့ခြင်း။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **Memory (RAM) Metric is NOT Default:** AWS သည် Instance ၏ အတွင်းပိုင်း RAM ကို မသိရှိနိုင်သဖြင့် CloudWatch Agent ကိုယ်တိုင် ထည့်သွင်းရသည်။

---

## 7. Comparison: CloudWatch vs CloudTrail vs AWS X-Ray (SAA-C03 Critical)

| Service | နာမည် | အဓိက မေးခွန်း (Core Question Answered) | Focus Area |
| :--- | :--- | :--- | :--- |
| **Amazon CloudWatch** | **Performance & Metrics** | *"စနစ်ရဲ့ CPU, Memory ဘယ်လောက်ရှိလဲ? Error ဘယ်လောက်တက်နေလဲ?"* | **Metrics, CPU, RAM, Alarms, Logs** |
| **AWS CloudTrail** | **Auditing & Governance** | *"ဒီ API ကို ဘယ်သူ၊ ဘယ်အချိန်၊ ဘယ် IP က ခေါ်သွားတာလဲ?"* | **Who did what, API History, Security Audit** |
| **AWS X-Ray** | **Distributed Tracing** | *"Microservices အချင်းချင်း ခေါ်ယူရာမှာ ဘယ်နေရာက နှေးနေတာလဲ?"* | **Latency Bottlenecks, Request Call Path** |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: CPU 80% ကျော်ပါက Alarm ပေးမည့် CloudWatch Alarm ဆောက်ခြင်း
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name "High-CPU-Utilization-Alarm" \
    --metric-name "CPUUtilization" \
    --namespace "AWS/EC2" \
    --statistic "Average" \
    --period 300 \
    --threshold 80 \
    --comparison-operator "GreaterThanThreshold" \
    --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
    --evaluation-periods 2 \
    --alarm-actions "arn:aws:sns:ap-southeast-1:123456789012:DevOpsAlertTopic"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** IAM Policy for CloudWatch, Log Groups Encryption using KMS, Data Protection in Logs (PII masking)။
- **Monitoring:** CloudWatch Service Quotas, Log Insights Queries (SQL-like syntax ဖြင့် logs ရှာဖွေခြင်း)။
- **Cost:** Basic Metrics (Free), Detailed Metrics ($2.10/instance/mo), First 10 Alarms (Free), Ingested Logs ($0.50 per GB)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **RAM / Memory is Missing by Default:** စာမေးပွဲတွင် "Monitor EC2 memory (RAM) utilization or disk space" ဟု ပါလာပါက အဖြေမှန်သည် အမြဲတမ်း **Install Unified CloudWatch Agent on EC2** ဖြစ်ပါသည်။
> 2. **CloudWatch vs CloudTrail:** Performance ကျဆင်းမှု စောင့်ကြည့်ရန် ➔ **CloudWatch**။ မသမာသူတစ်ဦး အကောင့်ထဲ ဝင်ရောက်ပြီး Security Group ပြင်သွားသည်ကို စစ်ဆေးရန် ➔ **CloudTrail**။
> 3. **Standard vs Detailed Monitoring:** Standard Monitoring သည် **၅ မိနစ်** ဖြစ်ပြီး၊ Detailed Monitoring ဖွင့်ပါက **၁ မိနစ်** တစ်ကြိမ် Metric ရရှိသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
SysOps Administrator တစ်ဦးသည် Linux EC2 Instance များ၏ Memory (RAM) အသုံးပြုမှု ရာခိုင်နှုန်းကို CloudWatch Management Console ပေါ်တွင် ရှာမတွေ့ဘဲ ဖြစ်နေသည်။ အဘယ်ကြောင့် ဤသို့ ဖြစ်ရသနည်း? ထိုသို့ ရရှိရန် မည်သို့ ပြုလုပ်ရမည်နည်း?

- A) EC2 Instance Type ကို အဆင့်မြှင့်တင်ရမည်။
- B) Memory Utilization သည် OS-level metric ဖြစ်သဖြင့် AWS Hypervisor က မသိနိုင်ပါ။ EC2 Instance အတွင်း **Unified CloudWatch Agent** ကို တပ်ဆင်ပြီး Metric ပေးပို့ရမည်။
- C) CloudTrail တွင် Logging ဖွင့်ရမည်။
- D) EC2 Detailed Monitoring ကို ဖွင့်ရမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** AWS Hypervisor သည် CPU, Disk I/O, Network I/O များကိုသာ ပြင်ပမှ သိရှိနိုင်ပြီး Guest OS အတွင်းရှိ Memory (RAM) နှင့် Disk Space Utilization များကို သိရှိနိုင်စွမ်း မရှိပါ။ ထို့ကြောင့် **Unified CloudWatch Agent** ကို OS တွင်း၌ မဖြစ်မနေ သွင်းယူရပါမည်။
</details>
