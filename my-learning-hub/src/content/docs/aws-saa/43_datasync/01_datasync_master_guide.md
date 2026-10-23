---
title: "AWS DataSync — Accelerated Online Data Transfer"
description: "AWS DataSync ၏ Architecture၊ Network Acceleration Protocol၊ Agent Deployment၊ S3/EFS/FSx Migration၊ Task Scheduling နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# AWS DataSync
### Accelerated Online File and Object Data Transfer to AWS

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**AWS DataSync** သည် On-Premises storage စနစ်များ (NFS, SMB, HDFS, Object Storage) နှင့် AWS Storage Services များ (Amazon S3, Amazon EFS, Amazon FSx) အကြား သို့မဟုတ် AWS Storage အချင်းချင်းအကြား Terabytes မှ Petabytes ချီသော file နှင့် object data များကို Network ပေါ်မှ **10x ပိုမိုမြန်ဆန်စွာ (Accelerated)** အလိုအလျောက် ရွှေ့ပြောင်းပေးသော online data transfer service ဖြစ်ပါသည်။

```
[On-Prem NAS (NFS/SMB)] ---> [DataSync Agent VM] ===(TLS Encrypted 10Gbps)===> [AWS DataSync Service] ---> [Amazon S3 / EFS / FSx]
```

### ဘာကြောင့် DataSync ကို သုံးရသလဲ?
1. **10x Faster than Open-Source Tools:** ရိုးရိုး `rsync`, `scp` သို့မဟုတ် custom scripts များနှင့် မတူဘဲ AWS proprietary network protocol ကို အသုံးပြုထားသဖြင့် network bandwidth ကို အပြည့်အဝ အသုံးချပြီး ၁၀ ဆ ပိုမိုမြန်ဆန်သည်။
2. **Automated Data Integrity & Verification:** Data transfer ပြီးဆုံးတိုင်း MD5/SHA checksum ဖြင့် source နှင့် target data ကို bit-by-bit အလိုအလျောက် cross-verify လုပ်ပေးသည်။
3. **Preserves Metadata & Permissions:** POSIX permissions, ownership, timestamps, ACLs များကို မပျောက်ပျက်စေဘဲ အတိအကျ သယ်ဆောင်ပေးသည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

1. **DataSync Agent:** On-premises virtualization environment (VMware ESXi, Hyper-V, KVM) သို့မဟုတ် EC2 instance ပေါ်တွင် run ရသော software appliance VM။ ၎င်းသည် local storage (NFS/SMB) သို့ ချိတ်ဆက်ကာ AWS သို့ data transmit လုပ်ပေးသည်။
2. **Source Location:** Data ထုတ်ယူမည့် နေရာ (On-Premises NFS/SMB share, HDFS cluster, Amazon S3 bucket, Amazon EFS, Amazon FSx)။
3. **Target Location:** Data ရောက်ရှိသိမ်းဆည်းမည့် နေရာ (Amazon S3 bucket, Amazon EFS file system, Amazon FSx for Windows File Server / Lustre / NetApp ONTAP / OpenZFS)။
4. **Task (လုပ်ငန်းစဉ်):** Source မှ Target သို့ data transfer ပြုလုပ်ရာတွင် schedule (အချိန်ဇယား)၊ bandwidth limit၊ filtering pattern (include/exclude) နှင့် verification options များ သတ်မှတ်ထားသော task config။
5. **DataSync Gateway / Endpoint:** VPC Endpoint (PrivateLink) သို့မဟုတ် Public AWS endpoint မှတစ်ဆင့် agent နှင့် AWS အကြား TLS ဖြင့် လုံခြုံစွာ ဆက်သွယ်ခြင်း။

---

## 3. Architecture & Request Flow

```
+-----------------------------------------------------------------------------------------+
|                                  AWS DataSync Architecture                              |
|                                                                                         |
|   +-----------------------+              +-----------------------+                      |
|   |   On-Premises Storage |              | DataSync Agent (VM)   |                      |
|   |   (NFS / SMB Share)   | -----------> | (VMware / Hyper-V)    |                      |
|   +-----------------------+ Local Network+-----------+-----------+                      |
|                                                      |                                  |
|                                    AWS Direct Connect / VPN / Internet                  |
|                                    (Custom Protocol, Multi-threaded TLS)                |
|                                                      v                                  |
|                                          +-----------------------+                      |
|                                          | AWS DataSync Service  |                      |
|                                          | (Managed Cloud Engine)|                      |
|                                          +-----------+-----------+                      |
|                                                      |                                  |
|                                 +--------------------+--------------------+             |
|                                 v                    v                    v             |
|                         +---------------+    +---------------+    +---------------+     |
|                         |   Amazon S3   |    |   Amazon EFS  |    |   Amazon FSx  |     |
|                         +---------------+    +---------------+    +---------------+     |
+-----------------------------------------------------------------------------------------+
```

### DataSync Transfer Steps:
1. Agent သည် source NFS/SMB share ကို mount လုပ်ပြီး file system metadata များကို scan ဖတ်သည်။
2. DataSync သည် ပြောင်းလဲသွားသော file များကိုသာ ရှာဖွေပြီး parallel multi-threaded stream ဖြင့် AWS Cloud သို့ ပို့သည်။
3. Transfer ပြီးသည်နှင့် Target ပေါ်ရှိ checksum နှင့် Source checksum ကို နှိုင်းယှဉ်ကာ Data Integrity ကို verify လုပ်ပြီး CloudWatch သို့ report ပို့သည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### Incremental Transfer & Verification Options
- **Incremental Transfer:** ပထမအကြိမ်တွင် Full load သယ်ဆောင်ပြီး နောက်ပိုင်း Task များတွင် အသစ်တက်လာသော သို့မဟုတ် ပြင်ဆင်လိုက်သော files (delta changes) များကိုသာ scan လုပ်၍ sync လုပ်သည်။
- **Verification Modes:**
  - `Verify full object`: Transfer ပြီးဆုံးပါက source နှင့် destination data တစ်ခုလုံးကို bit-by-bit check လုပ်သည်။
  - `Verify only transferred data`: Task အတွင်း လွှဲပြောင်းခဲ့သော data အပိုင်းကိုသာ စစ်ဆေးသည်။
  - `Do not verify`: အမြန်ဆုံး အချိန်တိုအတွင်း transfer ပြီးစီးလိုပါက စစ်ဆေးမှုကို ကျော်သွားနိုင်သည်။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Large-Scale File Migration to Cloud:** On-premises NAS တွင်ရှိသော 100TB ဖိုင်များကို Amazon S3 သို့မဟုတ် Amazon EFS သို့ Direct Connect မှတစ်ဆင့် နေ့ချင်းညချင်း online transfer လုပ်ခြင်း။
2. **Periodic Data Replication & Backup:** Local file server မှ data များကို ညစဉ် Amazon S3 Glacier သို့ အလိုအလျောက် incremental backup လုပ်ရန် task schedule ဆွဲထားခြင်း။
3. **Disaster Recovery (DR) Sync:** On-premises mission-critical file storage ကို AWS Storage ထဲသို့ schedule ဖြင့် အမြဲတစေ sync လုပ်ထားခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **High Speed:** AWS-designed custom protocol ဖြင့် WAN bandwidth ကို အပြည့်အဝ အသုံးချနိုင်သည်။
- **Bandwidth Throttling:** လုပ်ငန်းချိန်အတွင်း production network မကျပ်စေရန် bandwidth limit (ဥပမာ 200 Mbps) သတ်မှတ်ထားနိုင်သည်။
- **Fully Automated:** Script ရေးစရာမလိုဘဲ Scheduling, retry, checksum verification များကို ပြီးပြည့်စုံစွာ လုပ်ဆောင်ပေးသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- On-premises ဘက်တွင် **DataSync Agent VM (4 vCPU, 32 GB RAM)** လိုအပ်သည်။
- Network bandwidth အလွန်နည်းပါးသော နေရာများတွင် Terabytes ချီသော data ကို ရွှေ့ရန် ရက်သတ္တပတ်များစွာ ကြာနိုင်သည် (ဤအခြေအနေမျိုးတွင် **AWS Snow Family** က ပိုမိုသင့်တော်သည်)။

---

## 7. Comparison: AWS DataSync vs Storage Gateway vs Snowball

| အင်္ဂါရပ် | AWS DataSync | AWS Storage Gateway | AWS Snowball Edge |
| :--- | :--- | :--- | :--- |
| **Primary Goal** | **One-time or periodic fast data transfer/migration** | **Hybrid cloud active storage extension** (File/Volume/Tape cache) | **Offline physical appliance migration** (No network / Slow network) |
| **Transfer Type** | Batch / Scheduled Online Sync | Continuous Real-time Caching | Offline Physical Mail Shipping |
| **Agent Requirement** | DataSync Agent VM | Storage Gateway VM | No VM (Physical Hardware Box) |
| **Ideal Data Size** | Megabytes to Hundreds of Terabytes | Active Working Datasets | 10 TB to Petabytes |

---

## 8. Hands-on Lab: DataSync Task ဖန်တီးခြင်း (AWS CLI)

### Step 1: DataSync Agent ကို Activate လုပ်ခြင်း
```bash
aws datasync create-agent \
    --agent-name OnPrem-NFS-Agent \
    --activation-key "AAAAA-BBBBB-CCCCC-DDDDD-EEEEE" \
    --tags Key=Environment,Value=Production
```

### Step 2: Source NFS Location ဖန်တီးခြင်း
```bash
aws datasync create-location-nfs \
    --subdirectory /shared/data \
    --server-hostname 192.168.10.50 \
    --on-prem-config AgentArns=["<Agent-ARN>"]
```

### Step 3: Target Amazon S3 Location ဖန်တီးခြင်း
```bash
aws datasync create-location-s3 \
    --s3-bucket-arn arn:aws:s3:::company-cloud-archive-bucket \
    --s3-config '{"BucketAccessRoleArn": "arn:aws:iam::123456789012:role/DataSyncS3AccessRole"}' \
    --subdirectory /onprem-backup/
```

### Step 4: DataSync Task စတင်ခြင်း (Bandwidth 500Mbps limit ဖြင့်)
```bash
aws datasync create-task \
    --source-location-arn <Source-NFS-ARN> \
    --destination-location-arn <Target-S3-ARN> \
    --name OnPrem-to-S3-Sync \
    --options '{"BytesPerSecond": 62500000, "VerifyMode": "POINT_IN_TIME_CONSISTENT"}'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:**
  - Data in transit ကို TLS 1.3 encryption ဖြင့် ကာကွယ်ထားသည်။
  - AWS PrivateLink (VPC Endpoint) ကို အသုံးပြု၍ Public Internet မထွက်ဘဲ Direct Connect / VPN မှတစ်ဆင့် AWS သို့ data ပို့နိုင်သည်။
- **Monitoring (CloudWatch):**
  - `BytesTransferred`: Task တစ်ခုချင်းစီတွင် လွှဲပြောင်းပြီးစီးသော Data ပမာဏ။
  - `FilesTransferred`: File အရေအတွက်။
- **Troubleshooting:**
  - **Connection Refused:** On-premises firewall တွင် outbound port 443 (AWS endpoint) နှင့် port 2049 (NFS) / 445 (SMB) ဖွင့်ထားရန် လိုအပ်သည်။
- **Cost Structure:**
  - DataSync ဖြင့် လွှဲပြောင်းလိုက်သော data ပမာဏအတွက် **$0.0125 per GB** သာ ကျသင့်ပြီး Agent software အတွက် လစဉ်ကြေး မရှိပါ။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Fast Network File Migration:** "Migrate NFS/SMB on-premises file share to Amazon EFS or S3 with automated verification over Direct Connect" ဆိုပါက အမြဲတမ်း **AWS DataSync** ဖြစ်သည်။
- **DataSync vs Storage Gateway:** DataSync သည် "Moving data fast for migration or periodic copy" အတွက်ဖြစ်ပြီး၊ Storage Gateway သည် "Seamless low-latency hybrid cloud storage access" အတွက်ဖြစ်သည်။
- **DataSync vs Snowball:** Network bandwidth ကောင်းမွန်ပြီး online transfer လုပ်လိုပါက DataSync၊ Network မရှိပါက သို့မဟုတ် လပေါင်းများစွာ ကြာမြင့်မည့် Petabyte ပမာဏဆိုပါက Snowball Edge ကို ရွေးရမည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် On-premises NAS ပေါ်၌ 80TB ပမာဏရှိသော အရေးကြီး Document များရှိပြီး 1 Gbps AWS Direct Connect ချိတ်ဆက်ထားသည်။ အဆိုပါဖိုင်များကို Amazon S3 Standard သို့ POSIX metadata များနှင့် timestamp များ မပျောက်ပျက်စေဘဲ အမြန်ဆုံး online ရွှေ့ပြောင်းလိုသည်။ အနည်းဆုံး administrative overhead ဖြင့် မည်သည့် solution ကို ရွေးချယ်သင့်သနည်း?
>
> **အဖြေမှန်:** On-premises virtualization cluster ပေါ်တွင် **AWS DataSync Agent** ကို deploy လုပ်ပြီး Source အဖြစ် Local NAS (NFS/SMB) နှင့် Target အဖြစ် Amazon S3 bucket ကို ချိတ်ဆက်ကာ DataSync Task run ပါ။ ၎င်းသည် network acceleration ဖြင့် အမြန်ဆုံး transfer လုပ်ပေးပြီး metadata များကို အလိုအလျောက် ထိန်းသိမ်း verify လုပ်ပေးမည်။

### ❓ SAA-C03 Mini Quiz:

**Q1: AWS DataSync သည် On-premises storage မှ Amazon S3 သို့ data ပို့ဆောင်ရာတွင် အခြား tool များထက် ပိုမိုမြန်ဆန်စေသည့် အဓိက အကြောင်းရင်းမှာ အဘယ်နည်း?**
- A) UDP အစား Satellite link ကို အသုံးပြုခြင်း
- B) AWS ၏ သီးသန့် Multi-threaded network acceleration protocol ကို အသုံးပြုထားခြင်း
- C) Data များကို zip compress လုပ်ပြီးမှ ပို့ခြင်း
- D) EC2 Spot instance များကို အလိုအလျောက် ဝယ်ယူအသုံးပြုခြင်း
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS DataSync သည် WAN latency ကို ကျော်လွှားနိုင်သော multi-threaded network acceleration protocol ဖြင့် data များကို 10x မြန်ဆန်စွာ သယ်ဆောင်ပေးပါသည်။</details>

**Q2: အပလီကေးရှင်းတစ်ခုသည် On-premises NFS share မှ Amazon EFS သို့ data sync လုပ်နေစဉ် လုပ်ငန်းခွင်အင်တာနက် bandwidth မပြည့်သွားစေရန် ကန့်သတ်လိုပါသည်။ မည်သည့် configuration ကို သတ်မှတ်ရမည်နည်း?**
- A) S3 Lifecycle rule
- B) DataSync Task Options ထဲရှိ BytesPerSecond (Bandwidth limit)
- C) CloudFront Rate Limiting
- D) Route 53 Weighted routing
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — DataSync Task settings တွင် bandwidth limit (BytesPerSecond) ကို သတ်မှတ်၍ အသုံးပြုမည့် network throughput ကို ထိန်းညှိနိုင်ပါသည်။</details>

**Q3: AWS DataSync Task ပြီးဆုံးသွားသည့်အခါ data များ အမှားအယွင်းမရှိ အပြည့်အစုံ ရောက်ရှိကြောင်း အာမခံနိုင်ရန် မည်သို့ စစ်ဆေးပေးသနည်း?**
- A) Manual visual inspection
- B) Task ပြီးဆုံးတိုင်း အလိုအလျောက် ဆောင်ရွက်ပေးသော Bit-by-bit MD5/SHA Checksum Verification
- C) AWS CloudTrail API log စစ်ဆေးခြင်း
- D) SNS Notification ပို့ရုံသာ
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — DataSync တွင် Task options အလိုက် source နှင့် destination data integrity ကို bit-by-bit checksum verification အလိုအလျောက် ပြုလုပ်ပေးပါသည်။</details>
