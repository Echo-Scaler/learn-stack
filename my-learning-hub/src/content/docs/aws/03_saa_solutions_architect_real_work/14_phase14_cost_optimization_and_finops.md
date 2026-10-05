---
title: "Phase 14 — Cost Optimization & FinOps (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် ကုန်ကျစရိတ် စီမံခန့်ခွဲမှု)"
description: "Architect Core Question: ဒီ Architecture က အလုပ်လုပ်မလား (Will it work)? ဟူသော မေးခွန်းအပြင် ဒီ Architecture က တစ်လကို ပိုက်ဆံ ဘယ်လောက် ကုန်ကျမလဲ (How much w"
---

## Phase 14 — Cost Optimization & FinOps (လက်တွေ့ လုပ်ငန်းခွင် အဆင့်ဆင့် ကုန်ကျစရိတ် စီမံခန့်ခွဲမှု)

> **Architect Core Question:** "ဒီ Architecture က အလုပ်လုပ်မလား (Will it work)?" ဟူသော မေးခွန်းအပြင် **"ဒီ Architecture က တစ်လကို ပိုက်ဆံ ဘယ်လောက် ကုန်ကျမလဲ (How much will it cost)?"** နှင့် **"မလိုအပ်ဘဲ ပိုလျှံနေသော ငွေကြေးများကို ဘယ်လို ဖြတ်တောက်မလဲ?"** ဟူသော မေးခွန်းကို အမြဲတမ်း တွဲဖက် တွေးခေါ်ရမည်။

---

## ၁၄.၁ AWS Budgets & Multi-Tier Automated Alerts (အဆင့်ဆင့် တည်ဆောက်ပုံ)

ကုမ္ပဏီတစ်ခုတွင် လကုန်မှ ငွေတောင်းခံလွှာကို ကြည့်ပြီး အံ့အားသင့်ရသည့် "AWS Bill Shock" မဖြစ်စေရန် **AWS Budgets** ကို အောက်ပါအတိုင်း အဆင့် ၃ ဆင့်ဖြင့် ကြိုတင် ကာကွယ်ရမည်:

```
+-----------------------------------------------------------------------------------+
|                        AWS BUDGETS MULTI-TIER ALERT WORKFLOW                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  Monthly Budget: **$5,000 USD**                                                   |
|                                                                                   |
|  Alert Tier 1 (Early Warning):                                                    |
|  -> **Forecasted spend > 80% ($4,000)**                                           |
|  -> Action: Send Email alert to DevOps Team ("လကုန်လျှင် ဘတ်ဂျက်ကျော်နိုင်သည်")      |
|                                                                                   |
|  Alert Tier 2 (Critical Alert):                                                   |
|  -> **Actual spend > 100% ($5,000)**                                              |
|  -> Action: Send Urgent Alert to CTO & Finance via Slack / PagerDuty              |
|                                                                                   |
|  Alert Tier 3 (Automated Cost Remediation Action):                                |
|  -> **Actual spend > 120% ($6,000)**                                              |
|  -> Action: **AWS Budget Action triggers IAM Policy to deny launching new EC2s**   |
|     (သို့မဟုတ် Dev / Sandbox Account ရှိ စက်များကို အလိုအလျောက် Stop ပစ်ခြင်း)       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## ၁၄.၂ Cost Allocation Tags နှင့် Tag Policy (Organization-Wide Governance)

ကုမ္ပဏီအတွင်း ဌာနအလိုက် (Finance, Marketing, Dev, QA) မည်သူက ငွေမည်မျှ သုံးသည်ကို တိကျစွာ ခွဲထုတ်ရန်:

1. **မဖြစ်မနေ ပါဝင်ရမည့် Mandatory Tags:**
   - `Environment`: `Production`, `Staging`, `Development`
   - `Project`: `ECommerce`, `BillingEngine`, `DataLake`
   - `CostCenter`: `Dept-101`, `Dept-202`
   - `Owner`: `ko.aung@company.com`
2. **Billing Console တွင် Activate လုပ်ခြင်း:**
   - Tag များ ရေးထိုးရုံဖြင့် Cost Explorer တွင် မပေါ်ပါ။ AWS Billing Console -> **Cost Allocation Tags** သို့ သွား၍ အဆိုပါ Tag များကို **"Activate"** ပြုလုပ်ပေးရမည် (၂၄ နာရီအတွင်း စတင် အသက်ဝင်သည်)။
3. **AWS Organizations Tag Policies:**
   - Developer များက Tag မထည့်ဘဲ Resource အသစ် (EC2, S3) ဖွင့်ပါက AWS Organizations က **အလိုအလျောက် ပိတ်ဆို့ (Enforce/Deny)** သည့် မူဝါဒကို ကျင့်သုံးသည်။

---

## ၁၄.၃ Compute FinOps: Savings Plans vs Spot vs Right-Sizing

```
+-----------------------------------------------------------------------------------+
|                           COMPUTE SAVINGS OPTIONS MATRIX                          |
+-----------------------------------------------------------------------------------+
|  Options              |  Discount Rate  |  Commitment  |  Flexibility Scope       |
+-----------------------+-----------------+--------------+--------------------------+
|  **Compute Savings    |  **Up to 66%**  |  1 or 3 Years|  **အမြင့်မားဆုံး:**         |
|   Plans (Best!)**     |                 |  ($/hour)    |  EC2, Fargate, Lambda    |
|                       |                 |              |  Region မရွေး အကျုံးဝင်သည် |
+-----------------------+-----------------+--------------+--------------------------+
|  **EC2 Instance       |  Up to 72%      |  1 or 3 Years|  Region တစ်ခုတည်းရှိ     |
|   Savings Plans**     |                 |  ($/hour)    |  Instance Family (e.g. m5)|
+-----------------------+-----------------+--------------+--------------------------+
|  **Standard Reserved  |  Up to 72%      |  1 or 3 Years|  ပြောင်းလဲ၍မရပါ (RDS     |
|   Instances (RI)**    |                 |  (Specific)  |  Database များအတွက် အဓိက)  |
+-----------------------+-----------------+--------------+--------------------------+
|  **Spot Instances**   |  **Up to 90%**  |  None        |  Stateless batch, CI/CD  |
|                       |                 |  (No commit) |  (2-min termination alert|
+-----------------------+-----------------+--------------+--------------------------+
```

### AWS Compute Optimizer ဖြင့် Right-Sizing ပြုလုပ်ပုံ
1. AWS Compute Optimizer ကို Console တွင် Enable ပြုလုပ်သည်။
2. Machine Learning က လွန်ခဲ့သော ၁၄ ရက်စာ EC2 CPU, Memory, Network သုံးစွဲမှုကို လေ့လာသည်။
3. တွေ့ရှိချက် ဥပမာ: *"Instance `i-12345` (`m5.2xlarge` - $0.384/hr) သည် CPU Utilization အများဆုံး ၄% သာ သုံးသည်။ `t4g.large` ($0.067/hr) သို့ ပြောင်းလဲသင့်သည်"* -> **လစဉ် ကုန်ကျစရိတ် ၈၂% ချက်ချင်း သက်သာစေသည်**။

---

## ၁၄.၄ S3 Storage Lens & Hidden Cost Killers

S3 ပေါ်တွင် မမြင်ရဘဲ ငွေကုန်နေသော "Hidden Traps" (၃) ခုကို ရှင်းထုတ်ခြင်း:

```
+-----------------------------------------------------------------------------------+
|                        S3 HIDDEN STORAGE COST REMEDIATION                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. Incomplete Multipart Uploads (မပြီးပြတ်သော Upload အပိုင်းအစများ):                |
|     - User က ဖိုင်ကြီး တင်နေစဉ် အင်တာနက်ပြတ်သွားပါက S3 ပေါ်တွင် Part ဖိုင်များ     |
|       အမြဲ သောင်တင်နေပြီး ပိုက်ဆံ ပေးနေရသည်!                                       |
|     - **ဖြေရှင်းချက်:** Lifecycle Rule တွင်                                         |
|       `AbortIncompleteMultipartUpload: 7 Days` ထည့်သွင်းထားရမည်။                  |
|                                                                                   |
|  2. Non-Current Versions (အဟောင်း Version များ ပုံနေခြင်း):                        |
|     - Versioning ဖွင့်ထားသော Bucket များတွင် ဖိုင်အသစ် ထပ်တင်တိုင်း အဟောင်းများ    |
|       မဖျက်ဘဲ ကျန်နေသဖြင့် Storage Size ၂ ဆ ၃ ဆ တက်လာသည်။                          |
|     - **ဖြေရှင်းချက်:** Lifecycle Rule တွင်                                         |
|       `NoncurrentVersionExpiration: 90 Days` ဖြင့် အဟောင်းများကို အလိုအလျောက်ဖျက်မည်။|
|                                                                                   |
|  3. S3 Storage Lens Dashboard:                                                    |
|     - Single pane of glass ဖြင့် မည်သည့် Bucket က အသုံးမပြုသော Data များ         |
|       သိမ်းထားသည်ကို နေ့စဉ် စစ်ဆေးနိုင်သည်။                                         |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## ၁၄.၅ Network FinOps: NAT Gateway နှင့် Data Egress Charges ရှောင်လွှဲနည်း

တကယ့်လုပ်ငန်းခွင်တွင် အင်ဂျင်နီယာ အများစု မသိရှိဘဲ ဒေါ်လာထောင်ပေါင်းများစွာ ကုန်ကျစေသော အကြီးမားဆုံး ကွန်ရက် ကုန်ကျစရိတ်မှာ **NAT Gateway Data Processing Fee** ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                   NAT GATEWAY VS S3 GATEWAY ENDPOINT FINOPS                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [HIGH COST DISASTER PATTERN]                                                     |
|  EC2 in Private Subnet ---> NAT Gateway ($0.045/GB Processing) ---> S3 Bucket     |
|  - နေ့စဉ် 10 TB Backup/Data ကို S3 သို့ တင်ပါက:                                    |
|    `10,000 GB * $0.045 = $450/day` -> **တစ်လလျှင် $13,500 ကုန်ကျမည်!**            |
|                                                                                   |
|  ===============================================================================  |
|                                                                                   |
|  [OPTIMAL ARCHITECTURAL FINOPS FIX]                                               |
|  EC2 in Private Subnet ---> VPC S3 Gateway Endpoint (FREE!) ---> S3 Bucket        |
|  - Data သည် AWS Internal Private Network မှ သွားသည်                               |
|  - Data Processing Fee = **$0.00 (လုံးဝ အခမဲ့!)**                                  |
|  - **လစဉ် ငွေစုဆောင်းနိုင်မှု = ဒေါ်လာ ၁၃,၅၀၀ အပြည့်အဝ သက်သာသွားမည်!**              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အခမဲ့ S3 Gateway Endpoint ကို CLI ဖြင့် ချက်ချင်း ဖန်တီးနည်း:
```bash
aws ec2 create-vpc-endpoint \
    --vpc-id vpc-0123456789abcdef0 \
    --service-name com.amazonaws.ap-northeast-1.s3 \
    --route-table-ids rtb-private-app-subnet
```

---

## ၁၄.၆ ပိုင်ရှင်မဲ့ စွန့်ပစ်ထားသော Resources များကို ဖျက်ပစ်ခြင်း (CLI Cleanups)

EC2 ကို Delete လုပ်သော်လည်း မေ့ကျန်နေခဲ့သော Unattached EBS Disks များနှင့် Unassociated Elastic IPs များသည် ပိုက်ဆံ ဆက်လက် ကုန်ကျနေသည်:

```bash
# ၁။ ပိုင်ရှင်မရှိဘဲ ပိုက်ဆံကုန်နေသော Unassociated Elastic IPs များကို စစ်ဆေးခြင်း
aws ec2 describe-addresses \
    --query "Addresses[?AssociationId==null].[PublicIp, AllocationId]" \
    --output table

# ၂။ Release (ဖျက်ပစ်ခြင်း) ပြုလုပ်ခြင်း
aws ec2 release-address --allocation-id eipalloc-0123456789abcdef0

# ၃။ မည်သည့် EC2 နှင့်မျှ မချိတ်ဆက်ထားသော 'available' EBS Volume များကို ရှာဖွေခြင်း
aws ec2 describe-volumes \
    --filters Name=status,Values=available \
    --query "Volumes[*].[VolumeId, Size, CreateTime]" \
    --output table

# ၄။ မလိုအပ်သော Volume ကို အပြီးတိုင် ဖျက်ပစ်ခြင်း
aws ec2 delete-volume --volume-id vol-0123456789abcdef0
```

---
*သင်ရိုးမာတိကာသို့ ပြန်သွားရန်:* [README.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/README.md)
