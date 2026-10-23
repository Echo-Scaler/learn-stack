---
title: "AWS Snow Family — Offline Edge Computing & Data Migration"
description: "AWS Snowcone၊ Snowball Edge နှင့် Snowmobile တို့၏ Architecture၊ Offline Petabyte-Scale Migration၊ Edge Computing (EC2/EKS Anywhere)၊ AWS OpsHub နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# AWS Snow Family
### Physical Edge Computing and Petabyte-to-Exabyte Offline Data Migration Devices

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**AWS Snow Family** သည် အင်တာနက်လိုင်းမရှိသော သို့မဟုတ် network bandwidth အလွန်အားနည်းသော အခြေအနေများတွင် Terabytes မှ Petabytes နှင့် Exabytes ချီသော data များကို **ရုပ်ပိုင်းဆိုင်ရာ Hardware Device များဖြင့် Offline သယ်ယူပို့ဆောင်ပေးသည့် (Physical Shipping)** ဝန်ဆောင်မှုအုပ်စု ဖြစ်ပါသည်။ ထို့အပြင် စက်ရုံများ၊ သဘောင်္များ၊ သတ္တုတွင်းများကဲ့သို့ ကြမ်းတမ်းသော Edge ပတ်ဝန်းကျင်တွင် Local Compute (EC2, ECS, Lambda) run ရန်အတွက်လည်း အသုံးပြုပါသည်။

```
[On-Premises Data] ===(Direct Local 10/40/100 GbE)===> [AWS Snowball Device] ===(UPS/FedEx Delivery)===> [AWS Data Center] ---> [Amazon S3]
```

### ဘာကြောင့် Snow Family ကို သုံးရသလဲ?
- **Network Bandwidth Limitation:** ဥပမာ- 100 TB data ကို 100 Mbps အင်တာနက် bandwidth ဖြင့် online transfer လုပ်ပါက ရက်ပေါင်း **၁၀၀ ကျော် (၃ လကျော်)** ကြာမြင့်မည် ဖြစ်သည်။ AWS Snowball Edge device တစ်လုံးကို AWS မှမှာယူပြီး local switch ဖြင့် ၁ ရက်အတွင်း ကူးယူကာ ပြန်လည်ပို့ဆောင်လိုက်ပါက **၅ ရက်မှ ၇ ရက်အတွင်း** အပြီးသတ်နိုင်သည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

AWS Snow Family တွင် စွမ်းဆောင်ရည်နှင့် data capacity အလိုက် Device ၃ မျိုး ပါဝင်ပါသည်:

1. **AWS Snowcone (အသေးစား Ultra-Portable Device):**
   - **Data Capacity:** 8 TB (HDD) သို့မဟုတ် 14 TB (SSD) usable storage။
   - **Weight:** ပေါင် ၄.၅ ပေါင် (2.1 kg) သာရှိ၍ ကျောပိုးအိတ်ထဲ ထည့်သယ်နိုင်ပြီး battery ဖြင့်ပါ run နိုင်သည်။
   - **Compute:** 2 vCPUs, 4 GB RAM (EC2 micro instances, AWS IoT Greengrass)။
   - **Connectivity:** Wi-Fi သို့မဟုတ် 1 GbE wired network။
2. **AWS Snowball Edge (အလတ်စား Ruggedized Appliance):**
   - **Storage Optimized:** **80 TB** HDD (သို့မဟုတ် 210 TB NVMe) storage၊ 40 vCPUs, 80 GB RAM (Data transfer နှင့် local object storage အတွက် အဓိက သုံးသည်)။
   - **Compute Optimized:** **42 TB** HDD/NVMe storage၊ 104 vCPUs, 416 GB RAM (Local ML inference နှင့် video processing အတွက် GPU option ပါဝင်သည်)။
   - **Ruggedized Casing:** မိုးကြိုးဒဏ်၊ ရေစိုဒဏ်၊ ပြုတ်ကျဒဏ်ခံနိုင်သော case ပါရှိပြီး e-ink shipping label တပ်ဆင်ထားသည်။
3. **AWS Snowmobile (အကြီးစား 45-foot Rugged Shipping Container):**
   - **Data Capacity:** Device တစ်စီးလျှင် **100 PB (Petabytes)** အထိ ဆန့်သော ကုန်တင်ကွန်တိန်နာ ယာဉ်ကြီး။
   - **Use Case:** Exabyte-scale (100 PB+) data center decommissioning များအတွက် သီးသန့် အသုံးပြုသည်။ (2024 ခုနှစ်တွင် AWS မှ Snowball Edge clusters များကိုသာ ပိုမိုအကြံပြုလာသည်)။
4. **AWS OpsHub:** Snowball device ကို local network မှတစ်ဆင့် စီမံခန့်ခွဲရန်၊ volume mount ရန်နှင့် EC2 instances များ launch ရန် graphical user interface (GUI) desktop application။

---

## 3. Architecture & Migration Workflow

```
+-----------------------------------------------------------------------------------------+
|                                AWS Snow Family Workflow                                 |
|                                                                                         |
|   1. Order Device            2. Ship Device             3. Local Copy                   |
|   +---------------+          +---------------+          +---------------------------+   |
|   | AWS Console   | -------> | UPS / Carrier | -------> | Customer On-Premises      |   |
|   | Request Snow  |          | Shipping      |          | (Local 10/40 GbE Network) |   |
|   +---------------+          +---------------+          +-------------+-------------+   |
|                                                                       |                 |
|                                                                       | 4. Copy 80TB    |
|                                                                       v                 |
|   6. S3 Data Ready           5. Return Shipment         +---------------------------+   |
|   +---------------+          +---------------+          | AWS Snowball Edge Device  |   |
|   | Amazon S3     | <------- | AWS Data      | <------- | E-Ink Label updates       |   |
|   | Bucket        |          | Center        |          | automatically to AWS      |   |
|   +---------------+          +---------------+          +---------------------------+   |
+-----------------------------------------------------------------------------------------+
```

### အဆင့်ဆင့် ဆောင်ရွက်ပုံ:
1. AWS Console မှ Snowball Edge job ဖန်တီး၍ သက်ဆိုင်ရာ S3 bucket ကို target ရွေးချယ်သည်။
2. AWS မှ Device ကို သုံးစွဲသူလိပ်စာသို့ delivery ပို့ပေးသည်။
3. သုံးစွဲသူသည် Local Data Center တွင် device ကို power သွင်း၊ 10/40 GbE cable ချိတ်ဆက်ပြီး **AWS OpsHub** ဖြင့် unlock လုပ်ကာ data ကူးယူသည်။
4. Data ကူးပြီးပါက device ကို power ပိတ်လိုက်သည်နှင့် E-Ink display ပေါ်တွင် AWS return shipping address အလိုအလျောက် ပြောင်းလဲသွားသည်။
5. Carrier မှ device ကို AWS data center သို့ ပြန်သယ်ပြီး AWS engineers များက Amazon S3 bucket ထဲသို့ data သွင်းပေးသည်။
6. သွင်းပြီးပါက Department of Defense (DoD) စံချိန်စံညွှန်းအတိုင်း device ပေါ်မှ data များကို လုံးဝ ဖျက်ဆီးသန့်စင်ပစ်သည်။

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### Data Transfer vs Edge Computing

| အင်္ဂါရပ် | Data Migration Workload | Edge Computing Workload |
| :--- | :--- | :--- |
| **ရည်ရွယ်ချက်** | On-prem မှ S3 သို့ Terabytes/Petabytes data ကူးယူပြီး AWS သို့ ပြန်ပို့ရန် | စက်ရုံ၊ စစ်မြေပြင်၊ သဘောင်္ပေါ်တွင် disconnected compute run ရန် |
| **Compute လိုအပ်မှု** | Basic S3 Adapter interface သာ လိုအပ်သည် | EC2-compatible AMIs, Lambda, EKS Anywhere cluster run ရန် |
| **Device Retention** | Data ကူးပြီးသည်နှင့် ရက်ပိုင်းအတွင်း AWS သို့ ပြန်ပို့ရသည် | လနှင့်ချီ၍ (သို့မဟုတ် နှစ်နှင့်ချီ၍) local တွင် အငှားထားရှိသည် |

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Cloud Migration / Data Center Decommissioning:** Data center ပိတ်သိမ်းချိန်တွင် 100TB မှ 10PB ရှိသော database backups နှင့် file archives များကို ရက်သတ္တပတ်အတွင်း S3 သို့ ရွှေ့ပြောင်းခြင်း။
2. **Maritime & Cruise Ships (Edge Computing):** အင်တာနက်လိုင်းမရှိသော ပင်လယ်ပြင်ရှိ သဘောင်္ကြီးများပေါ်တွင် Snowball Edge ပေါ်၌ IoT data processing နှင့် local analytics run ခြင်း။
3. **Defense, Mining & Remote Sites:** မိုဘိုင်းကားများ၊ သတ္တုတွင်းများနှင့် တောတောင်များတွင် ဒရုန်းဗီဒီယိုများကို Snowcone ဖြင့် သိမ်းဆည်းကာ ML edge inference run ခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Bypasses Network Bottlenecks:** Network bandwidth မလုံလောက်သော ပြဿနာကို physical shipping ဖြင့် အထိရောက်ဆုံး ဖြေရှင်းသည်။
- **Military-Grade Security:** Data အားလုံးကို 256-bit encryption (KMS) ဖြင့် အလိုအလျောက် encrypt လုပ်ထားပြီး hardware tamper-evident seals ပါရှိသည်။
- **Rugged & Durable:** အပူချိန်လွန်ကဲမှု၊ ရေငွေ့နှင့် တုန်ခါမှုဒဏ်များကို ခံနိုင်ရည်ရှိသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- Real-time continuous sync မဟုတ်ဘဲ Batch offline transfer သာ ဖြစ်သည်။
- Physical shipping time (၂ ရက်မှ ၄ ရက်) ကြာမြင့်နိုင်သည်။
- 10 TB ထက်နည်းသော data များအတွက် Network Transfer (AWS DataSync သို့မဟုတ် S3 multipart) က ကုန်ကျစရိတ် ပိုမိုသက်သာသည်။

---

## 7. Comparison: Snowcone vs Snowball Edge vs Snowmobile

| အင်္ဂါရပ် | AWS Snowcone | AWS Snowball Edge | AWS Snowmobile |
| :--- | :--- | :--- | :--- |
| **Storage Capacity** | 8 TB to 14 TB | **80 TB to 210 TB** | **Up to 100 PB** |
| **Portability** | Ultra-light (2.1 kg, fits in backpack) | Ruggedized case with wheels (22 kg) | 45-foot shipping container truck |
| **Edge Compute** | 2 vCPU, 4 GB RAM | 40 to 104 vCPUs, up to 416 GB RAM | None (Data transfer only) |
| **Best For** | Space-constrained, drone, mobile IoT | Large-scale migrations & Edge computing | Multi-Petabyte to Exabyte data centers |

---

## 8. Hands-on Lab: Snowball Edge Job ဖန်တီးခြင်း (AWS CLI)

### Step 1: Snowball Import Job ဖန်တီးခြင်း
```bash
aws snowball create-job \
    --job-type IMPORT \
    --resources '{"S3Resources": [{"BucketArn": "arn:aws:s3:::corporate-migration-bucket"}]}' \
    --address-id "ADID12345678-ABCD-1234-EF01-123456789012" \
    --kms-key-arn "arn:aws:kms:us-east-1:123456789012:key/snowball-key" \
    --role-arn "arn:aws:iam::123456789012:role/SnowballS3ImportRole" \
    --snowball-type EDGE \
    --snowball-capacity-preference T80 \
    --shipping-option SECOND_DAY
```

### Step 2: Local Network တွင် AWS OpsHub ဖြင့် Unlock လုပ်ခြင်း
```bash
# Snowball Client CLI ဖြင့် Unlock ပြုလုပ်ခြင်း
snowballEdge unlock-device \
    --endpoint https://192.168.1.50 \
    --manifest-file ./manifest.bin \
    --unlock-code 12345-abcde-67890-fghij-12345
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security & Compliance:**
  - Hardware TPM (Trusted Platform Module) ချစ်ပ်ဖြင့် tamper-proofing စစ်ဆေးသည်။
  - AWS KMS 256-bit AES encryption အသုံးပြုထားသဖြင့် device ပျောက်ဆုံးသွားလျှင်ပင် data ကို decrypt မလုပ်နိုင်ပါ။
- **Monitoring (AWS Console):**
  - Job status ကို AWS Console တွင် (Job created -> Dispatched -> In transit -> At customer -> In transit to AWS -> At AWS -> Completed) အဆင့်ဆင့် track လုပ်နိုင်သည်။
- **Cost Structure:**
  - Snowball Edge Storage Optimized အတွက် ပထမ ၁၀ ရက်အထိ One-time service fee (ခန့်မှန်း $300) နှင့် delivery ခသာ ကျသင့်သည်။ ၁၀ ရက်ကျော်ပါက daily fee (ခန့်မှန်း $30/day) ပေးဆောင်ရသည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Decision Rule of Thumb (Network vs Snowball):** Transfer လုပ်မည့် data ကို ရှိပြီးသား network link ဖြင့် ပို့ပါက **တစ်ပတ်ထက် ပိုကြာမည် (၁၀ ရက်ကျော်မည်)** ဆိုပါက အမြဲတမ်း **AWS Snowball Edge** ကို ရွေးချယ်ပါ။
- **Edge Computing without Internet:** "Run EC2 instances on a remote ship with no internet access and collect sensor data" ဆိုပါက **AWS Snowball Edge Compute Optimized** ဖြစ်သည်။
- **Small Capacity Portable Migration:** "5 TB to 10 TB data in tight physical space" ဆိုပါက **AWS Snowcone** ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုတွင် 500 TB ပမာဏရှိသော On-premises Backup data များကို Amazon S3 သို့ ရွှေ့ပြောင်းလိုသည်။ လက်ရှိ ရရှိနိုင်သော အင်တာနက် bandwidth မှာ 50 Mbps သာရှိသည်။ အမြန်ဆုံးနှင့် ကုန်ကျစရိတ် အသက်သာဆုံး နည်းလမ်းဖြင့် မည်သို့ ရွှေ့ပြောင်းသင့်သနည်း?
>
> **အဖြေမှန်:** 50 Mbps ဖြင့် 500TB ပို့ပါက နှစ်နှင့်ချီ ကြာမြင့်မည်ဖြစ်သောကြောင့် **AWS Snowball Edge (80 TB or 210 TB)** devices များကို အစုလိုက် cluster သို့မဟုတ် multiple jobs အဖြစ် မှာယူပြီး offline local copy ကူးယူကာ AWS သို့ ပြန်လည်ပို့ဆောင်သည့် နည်းလမ်းကို အသုံးပြုရမည်။

### ❓ SAA-C03 Mini Quiz:

**Q1: AWS Snow Family device တစ်ခုကို On-premises တွင် data ကူးယူပြီးနောက် AWS Data Center သို့ ပြန်လည်ပို့ဆောင်ရာတွင် Delivery Address ကို မည်သို့ ကပ်ရသနည်း?**
- A) စက္ကူလိပ်စာ print ထုတ်ပြီး device ပေါ် ကော်ဖြင့် ကပ်ရသည်
- B) Device ကို power ပိတ်လိုက်သည်နှင့် E-Ink shipping label display ပေါ်တွင် AWS return address အလိုအလျောက် ပြောင်းလဲဖော်ပြပေးသည်
- C) Courier ရုံးသို့ လူကိုယ်တိုင် သွားရောက်ပို့ဆောင်ရသည်
- D) USB thumb drive ဖြင့် လိပ်စာထည့်ပေးရသည်
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Snowball device များတွင် အလိုအလျောက် ပြောင်းလဲနိုင်သော E-Ink shipping display ပါရှိပြီး power ပိတ်လိုက်သည်နှင့် AWS Return label ပြောင်းလဲသွားပါသည်။</details>

**Q2: အပလီကေးရှင်းတစ်ခုသည် အင်တာနက်လိုင်း လုံးဝမရှိသော သုတေသနစခန်းတစ်ခုတွင် ရုပ်ပိုင်းဆိုင်ရာအရ အလွန်ပေါ့ပါးပြီး 10 TB ပမာဏရှိသော ဒေတာများကို ကွင်းဆင်းကောက်ယူရန် လိုအပ်ပါသည်။ မည်သည့် device သည် အသင့်တော်ဆုံးဖြစ်သနည်း?**
- A) AWS Snowmobile
- B) AWS Snowcone
- C) AWS DataSync
- D) Amazon S3 Transfer Acceleration
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS Snowcone သည် 2.1 kg သာလေးပြီး 14 TB အထိ ဆန့်သဖြင့် ကျောပိုးအိတ်ထဲ ထည့်၍ သယ်ယူနိုင်သော portable edge device ဖြစ်ပါသည်။</details>

**Q3: AWS Snowball Edge device ပေါ်ရှိ data များကို AWS Data Center ရှိ Amazon S3 ထဲသို့ အောင်မြင်စွာ ကူးယူထည့်သွင်းပြီးနောက် device ပေါ်ရှိ customer data များကို မည်သို့ စီမံသနည်း?**
- A) Customer ထံသို့ hard drive ကို စာတိုက်ဖြင့် ပြန်ပို့ပေးသည်
- B) Department of Defense (DoD) စံနှုန်းများနှင့်အညီ Device ပေါ်မှ data များကို လုံးဝ ပြန်လည်မရနိုင်အောင် sanitize/erase လုပ်သည်
- C) အခြား customer သုံးရန် ထိုအတိုင်း ထားရှိသည်
- D) S3 Glacier သို့ zip archive လုပ်ပေးသည်
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — AWS သည် NIST/DoD media sanitation standards များအတိုင်း customer data များကို hardware ပေါ်မှ အပြီးတိုင် ဖျက်ဆီးသန့်စင်ပစ်ပါသည်။</details>
