---
title: "၂။ Key Components များ & Instance Lifecycle"
description: "EC2 ၏ အဓိက Key Components ၁၂ ခု၊ Instance Naming Convention၊ User Data၊ Metadata နှင့် Instance Lifecycle အဆင့်များ ရှင်းလင်းချက်"
---

# ၂။ Key Components များ & Instance Lifecycle

## EC2 Key Components (အဓိက အစိတ်အပိုင်း ၁၂ ခု)

EC2 Virtual Server တစ်လုံး အဆင်ပြေချောမွေ့စွာ လည်ပတ်နိုင်ရန် အောက်ပါ အခြေခံ အစိတ်အပိုင်းများ စုစည်းလုပ်ဆောင်ရပါသည်:

| Component | မြန်မာလို အဓိပ္ပာယ် | အလုပ်လုပ်ပုံနှင့် Usage |
| :--- | :--- | :--- |
| **AMI (Amazon Machine Image)** | Server ၏ ပုံစံခွက် (Blueprint) | OS (Ubuntu/Amazon Linux), Software နှင့် Initial Storage ပါဝင်သော ပုံစံခွက် |
| **Instance Type** | Hardware အရွယ်အစား (Size) | vCPU, RAM, Storage throughput နှင့် Network bandwidth ပမာဏကို သတ်မှတ်သည် |
| **vCPU & Memory** | တွက်ချက်နိုင်စွမ်းနှင့် မှတ်ဉာဏ် | Hyper-threading နည်းပညာဖြင့် ဖန်တီးထားသော Virtual Core များနှင့် RAM |
| **EBS (Elastic Block Store)** | ကွန်ပျူတာ Hard Disk အပြင်တပ် | Server ပိတ်ထားသော်လည်း Data ပျောက်မသွားသော Persistent Network-attached Disk |
| **Instance Store** | Server တွဲလျက် ယာယီ Hard Disk | Host Physical Server ပေါ်တွင် တိုက်ရိုက်ရှိသော အလွန်မြန်သည့် Ephemeral (ယာယီ) Disk |
| **Key Pair** | လုံခြုံရေး သော့တွဲ | SSH/RDP ဖြင့် Server သို့ လုံခြုံစွာ Login ဝင်ရောက်ရန် အသုံးပြုသော Public/Private Key |
| **Security Group** | Virtual Firewall စစ်ဆေးရေးဂိတ် | မည်သည့် Port နှင့် IP address ကို Server ထဲသို့ ဝင်ခွင့်/ထွက်ခွင့်ပေးမည်ကို စစ်ဆေးသည် |
| **ENI (Elastic Network Interface)** | Virtual Network Card | Private IP, Elastic IP, MAC Address များကို ဆောင်ယူထားသော Network Card |
| **Elastic IP** | အမြဲတမ်း တည်ငြိမ်သော Public IP | Server ကို Stop/Start ပြုလုပ်သော်လည်း မပြောင်းလဲသော Static IPv4 Address |
| **User Data** | ပထမဆုံး စတင်ချိန်တွင် run မည့် Script | Server မွေးဖွားလာချိန်တွင် Package များ အလိုအလျောက် သွင်းပေးသည့် Bash Script (Bootstrap) |
| **IAM Instance Profile** | Server အတွက် ခွင့်ပြုချက် အထောက်အထား | Access Key/Secret Key မသုံးဘဲ EC2 အား S3, DynamoDB သို့ လုံခြုံစွာ ခေါ်ယူခွင့်ပေးခြင်း |
| **Placement Group** | Server များ တည်နေရာ နေရာချထားမှု | Server အချင်းချင်းကြား Network latency အနည်းဆုံးဖြစ်စေရန် သို့မဟုတ် သီးခြားခွဲထားရန် စီမံခြင်း |

---

## Instance Types Naming Convention (အမည်ပေးပုံ စနစ်)

AWS Instance Type များ၏ အမည် (ဥပမာ- `c6i.2xlarge`) ကို ကြည့်ရုံဖြင့် ၎င်း၏ စွမ်းဆောင်ရည်ကို သိရှိနိုင်ပါသည်:

```
    c        6        i    .    2xlarge
 ───────  ───────  ───────     ─────────
  Family   Gen      Proc          Size
 (Compute) (6th)  (Intel)     (8 vCPU / 16GB)
```

1. **Family (အမျိုးအစား):**
   - **T / M (General Purpose):** Web servers, Dev environments, Microservices (ဥပမာ- `t3.medium`, `m6i.large`)
   - **C (Compute Optimized):** High-performance web servers, Batch processing, Video encoding (ဥပမာ- `c6i.xlarge`)
   - **R / X (Memory Optimized):** In-memory caches (Redis/Memcached), High-performance Databases (ဥပမာ- `r6i.2xlarge`)
   - **I / D (Storage Optimized):** Data Warehousing, Distributed File Systems (NoSQL, Elasticsearch)
   - **G / P (Accelerated Computing):** Machine Learning, AI Training, 3D Rendering (NVIDIA GPUs)
2. **Generation:** နံပါတ်ကြီးလေလေ ပိုသစ်ပြီး စွမ်းဆောင်ရည် ပိုကောင်းကာ ဈေးပိုသက်သာလေဖြစ်သည် (ဥပမာ- `c6` သည် `c5` ထက် သစ်သည်)။
3. **Processor:** `i` = Intel, `a` = AMD, `g` = AWS Graviton (ARM-based ဈေးအသက်သာဆုံး chip)။
4. **Size:** `nano`, `micro`, `small`, `medium`, `large`, `xlarge`, `2xlarge` စသဖြင့် CPU/RAM အချိုးကျ တိုးသွားသည်။

---

## User Data & Instance Metadata (IMDS)

### ၁။ User Data (Bootstrapping Script)
EC2 စတင်စဥ် (First Boot) တစ်ကြိမ်တည်းသာ Root Privilege ဖြင့် အလိုအလျောက် Run သော Shell Script ဖြစ်ပါသည်။
```bash
#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from EC2 Bootstrapped Server!</h1>" > /var/www/html/index.html
```

### ၂။ Instance Metadata (IMDS - 169.254.169.254)
EC2 Instance အတွင်းမှနေ၍ မိမိ၏ Private IP, Instance ID, IAM Security Credentials စသည့် အချက်အလက်များကို လှမ်းမေးနိုင်သော Link-local IP ဖြစ်ပါသည်။
```bash
# IMDSv2 Token ရယူခြင်း
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`

# Instance ID ကို မေးမြန်းခြင်း
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id
```

---

## Placement Groups (အုပ်စုလိုက် တည်နေရာချထားမှု)

SAA-C03 စာမေးပွဲတွင် အလွန်မေးလေ့ရှိသော Placement Groups အမျိုးအစား ၃ မျိုး:

| Placement Group | ရည်ရွယ်ချက် | သင့်တော်သော Workload | အားသာချက် / သတိပြုရန် |
| :--- | :--- | :--- | :--- |
| **Cluster** | တူညီသော Availability Zone အတွင်း ကပ်လျက်ထားသည် | Big Data, HPC, Low-latency 10Gbps+ Network | အလွန်မြန်သော Network Speed ရသော်လည်း Rack ပျက်ပါက အားလုံး ထိခိုက်နိုင်သည် |
| **Spread** | မတူညီသော Hardware Racks များပေါ်သို့ သီးခြားခွဲထုတ်ထားသည် | Critical Databases, High Availability Applications | Hardware တစ်ခု ပျက်သော်လည်း ကျန် Server များ မထိခိုက်ပါ။ AZ တစ်ခုလျှင် အများဆုံး 7 Instances သာ ခွင့်ပြုသည် |
| **Partition** | Rack များကို Partition အကန့်များ ခွဲ၍ တည်ဆောက်သည် | HDFS, Apache Cassandra, Kafka | Partition တစ်ခု ပျက်စီးမှုသည် အခြား Partition ဆီသို့ ကူးစက်ခြင်း မရှိပါ |

---

## EC2 Instance Lifecycle (ဘဝသံသရာ အဆင့်များ)

```
        ┌──────────────┐
        │   PENDING    │ ◄── [Launch Instance]
        └──────┬───────┘
               │ (Ready)
               ▼
        ┌──────────────┐
  ┌───► │   RUNNING    │ ◄────────────────┐
  │     └──────┬───────┘                  │
  │            │                          │
  │ [Reboot]   │ [Stop]                   │ [Start]
  │            ▼                          │
  │     ┌──────────────┐                  │
  │     │   STOPPING   │                  │
  │     └──────┬───────┘                  │
  │            │                          │
  │            ▼                          │
  │     ┌──────────────┐                  │
  └──── │   STOPPED    │ ─────────────────┘
        └──────┬───────┘
               │ [Terminate]
               ▼
        ┌──────────────┐
        │ SHUTTING-DOWN│
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │  TERMINATED  │ (Cannot be recovered)
        └──────────────┘
```

### Lifecycle အဆင့်များတွင် ဖြစ်ပေါ်သော အရေးကြီးအချက်များ:
1. **Rebooting:**
   - Operating System ကို restart လုပ်ခြင်းဖြစ်ပြီး တူညီသော Physical Host ပေါ်တွင်သာ ဆက်ရှိနေသည်။
   - **Public IP နှင့် Private IP မပြောင်းလဲပါ။** EBS volume နှင့် RAM ပေါ်ရှိ Cache များ မပျက်စီးပါ။ Billing ဆက်လက် ကောက်ခံသည်။
2. **Stopping → Stopped:**
   - Server ကို shutdown ချလိုက်ခြင်း ဖြစ်သည်။ Physical Host ပေါ်မှ Instance ကို unregister လုပ်လိုက်သည်။
   - **EBS-backed ဖြစ်ပါက Data မပျောက်ပါ။ သို့သော် Instance Store (ယာယီ Disk) ပေါ်ရှိ Data များ အပြီးအပိုင် ပျောက်ဆုံးသွားပါမည်။**
   - **Public IPv4 Address ပြောင်းလဲသွားပါမည်** (Static Elastic IP မချိတ်ထားပါက)။ Private IP မပြောင်းပါ။
   - Stopped ဖြစ်နေချိန်တွင် EC2 Compute အတွက် စရိတ်မကျသော်လည်း ချိတ်ထားသော **EBS Volume Storage စရိတ် ဆက်လက် ကျသင့်ပါသည်**။
3. **Terminating → Terminated:**
   - Server ကို အပြီးအပိုင် ဖျက်ဆီးလိုက်ခြင်း ဖြစ်သည်။ မည်သည့်နည်းနှင့်မျှ ပြန်လည် recover မရနိုင်ပါ။
   - `DeleteOnTermination=true` သတ်မှတ်ထားသော Root EBS Volume များသည် Instance နှင့်အတူ အလိုအလျောက် ပျက်စီးသွားမည် ဖြစ်သည်။
