---
title: "Amazon EMR — Big Data Processing with Hadoop & Spark"
description: "Amazon EMR (Elastic MapReduce) ၏ Architecture၊ Master/Core/Task Nodes၊ Apache Spark၊ Hive၊ Presto၊ EMR on EC2 vs EKS vs Serverless၊ EMRFS နှင့် SAA-C03 Exam Traps အပြည့်အစုံ"
---

# Amazon EMR (Elastic MapReduce)
### Industry-Leading Cloud Big Data Platform for Distributed Frameworks (Hadoop, Spark, Hive, Presto)

---

## 1. What is it? — အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ

**Amazon EMR (ယခင် Elastic MapReduce)** သည် Petabytes မှ Exabytes ချီသော Big Data များကို စျေးသက်သာပြီး မြန်ဆန်စွာ စီမံခန့်ခွဲ၊ တွက်ချက်နိုင်သော AWS ၏ Managed Big Data Platform ဖြစ်ပါသည်။ Open-Source Distributed Framework များဖြစ်သော **Apache Spark, Apache Hadoop, Apache Hive, Presto, Trino, HBase, Flink** များကို AWS cloud ပေါ်တွင် မိနစ်ပိုင်းအတွင်း cluster အဖြစ် တည်ဆောက် run နိုင်စေပါသည်။

```
[Massive Data Lake on S3 / HDFS] ---> [Amazon EMR Cluster (Master + Core + Task Nodes)] ---> [ML Models / BI Warehouses]
                                                (Spark / Hadoop / Hive)
```

### ဘာကြောင့် EMR ကို သုံးရသလဲ?
1. **Easy Open-Source Big Data:** Hadoop/Spark cluster တစ်ခုကို on-premises တွင် တည်ဆောက်ပါက ရက်သတ္တပတ်ပေါင်းများစွာ ကြာမြင့်နိုင်သော်လည်း EMR ဖြင့် မိနစ်ပိုင်းအတွင်း nodes ရာပေါင်းများစွာကို deploy လုပ်နိုင်သည်။
2. **Decoupled Storage & Compute (EMRFS):** Data များကို cluster ပေါ်ရှိ HDFS တွင် သိမ်းဆည်းမည့်အစား Amazon S3 ပေါ်တွင် **EMR File System (EMRFS)** ဖြင့် သိမ်းဆည်းထားနိုင်သဖြင့် cluster ကို အလုပ်ပြီးပါက terminate ဖျက်ပစ်နိုင်ပြီး data မပျောက်ပျက်ဘဲ ကုန်ကျစရိတ် အဆမတန် သက်သာသည်။
3. **Massive Cost Savings with Spot Instances:** Task Nodes များကို EC2 Spot Instances များဖြင့် run ပါက On-Demand စျေးထက် 90% အထိ စရိတ်သက်သာသည်။

---

## 2. Key Components — အဓိက ပါဝင်သော အစိတ်အပိုင်းများ

Amazon EMR Cluster တစ်ခုတွင် Node အမျိုးအစား ၃ မျိုးဖြင့် ဖွဲ့စည်းထားပါသည်:

1. **Master Node (ခေါင်းဆောင် Node):**
   - Cluster တစ်ခုလုံး၏ ကျန်းမာရေးကို စောင့်ကြည့်ပြီး distributed tasks များကို ကြီးကြပ်ခွဲဝေပေးသော node (YARN ResourceManager, HDFS NameNode run သည်)။
   - Master node down သွားပါက cluster တစ်ခုလုံး ရပ်တန့်နိုင်သဖြင့် High Availability အတွက် **Multi-Master (3 Master Nodes)** cluster ထားရှိနိုင်သည်။
2. **Core Node (ဒေတာနှင့် တွက်ချက်မှု Node):**
   - Task များကို တွက်ချက်သည့်အပြင် **HDFS (Hadoop Distributed File System)** data blocks များကိုပါ သိမ်းဆည်းပေးသော node (DataNode + NodeManager)။
   - Data loss မဖြစ်စေရန် Core nodes များကို terminate လုပ်ခြင်း သို့မဟုတ် Spot instances ထားရှိခြင်းကို အထူးသတိထားရသည်။
3. **Task Node (တွက်ချက်မှု သီးသန့် Node):**
   - HDFS data လုံးဝ မသိမ်းဆည်းဘဲ **တွက်ချက်မှု (Compute/Spark tasks) သီးသန့်** ဆောင်ရွက်သော node။
   - Data မသိမ်းသဖြင့် task node များ ရုတ်တရက် ပျက်စီးသွားသော်လည်း data loss မရှိပါ။ ထို့ကြောင့် **EC2 Spot Instances** များကို Task Nodes များအဖြစ် အသုံးပြုရန် အကောင်းဆုံးဖြစ်သည်။
4. **EMR Deployment Options:**
   - **EMR on EC2:** EC2 instances များပေါ်တွင် cluster တည်ဆောက်ခြင်း (အသုံးအများဆုံး classic ပုံစံ)။
   - **EMR on EKS:** Kubernetes cluster ပေါ်တွင် containerized Spark jobs များကို run ခြင်း။
   - **EMR Serverless:** Cluster nodes များကို လုံးဝ manage စရာမလိုဘဲ job run သည့် compute capacity ပေါ်တွင်သာ auto-scale ဖြစ်စေသော serverless option။

---

## 3. Architecture & Cluster Flow

```
+-----------------------------------------------------------------------------------------+
|                                  Amazon EMR Architecture                                |
|                                                                                         |
|                               +-------------------------------+                         |
|                               |          Master Node          |                         |
|                               | (YARN ResourceManager, Driver)|                         |
|                               +---------------+---------------+                         |
|                                               |                                         |
|                 +-----------------------------+-----------------------------+           |
|                 |                                                           |           |
|                 v                                                           v           |
|   +---------------------------+                               +-----------------------+ |
|   |        Core Nodes         |                               |      Task Nodes       | |
|   | - Compute Tasks (Spark)   |                               | - Compute Tasks ONLY  | |
|   | - HDFS Data Storage       |                               | - NO HDFS Data        | |
|   | (On-Demand / Reserved)    |                               | (100% Spot Instances) | |
|   +-------------+-------------+                               +-----------+-----------+ |
|                 |                                                         |             |
|                 +----------------------------+----------------------------+             |
|                                              |                                          |
|                                              v EMRFS (S3 Connector)                     |
|                               +-------------------------------+                         |
|                               |     Amazon S3 (Data Lake)     |                         |
|                               +-------------------------------+                         |
+-----------------------------------------------------------------------------------------+
```

---

## 4. How it works — နက်ရှိုင်းစွာ အလုပ်လုပ်ပုံ

### Transient vs Long-Running Clusters
1. **Transient Cluster (ယာယီ Cluster - Cost-Optimized):**
   - နေ့စဉ် ညသန်းခေါင်တွင် ETL batch job တစ်ခု run ရန် cluster ကို အလိုအလျောက် launch လုပ်သည်။
   - S3 ပေါ်ရှိ EMRFS မှ data ဖတ်ပြီး Spark job execute လုပ်ကာ ရလဒ်ကို S3 ထဲ ပြန်သိမ်းသည်။
   - Job ပြီးဆုံးသည်နှင့် Cluster တစ်ခုလုံးကို **Auto-Terminate** လုပ်ပစ်သည်။ (နံနက်ပိုင်းတွင် compute စရိတ် သုည ဖြစ်သည်)။
2. **Long-Running Cluster (အမြဲတမ်း Cluster):**
   - Data analysts များက Presto/Hue/Zeppelin notebook များဖြင့် interactive queries များကို 24/7 run နိုင်ရန် အမြဲဖွင့်ထားသော cluster။

---

## 5. Use Cases — လက်တွေ့ အသုံးချမှုများ

1. **Large-Scale Genomic & Financial Modeling:** Terabytes မှ Petabytes ချီသော ဘဏ္ဍာရေး algorithm များကို Apache Spark ဖြင့် parallel တွက်ချက်ခြင်း။
2. **Data Transformation & Machine Learning Prep:** Web clickstream logs သန်းထောင်ပေါင်းများစွာကို ML model သို့ မထည့်မီ feature engineering ပြုလုပ်ခြင်း။
3. **Web Indexing & Graph Analytics:** GraphX သို့မဟုတ် Presto ဖြင့် interconnected big data relationships များကို ရှာဖွေခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **Flexible Framework Ecosystem:** Spark, Hive, Presto, Flink, HBase တို့ကို checkbox တစ်ချက်ဖြင့် ထည့်သွင်းနိုင်သည်။
- **Extreme Cost Efficiency with Spot:** Task nodes များကို Spot ဖြင့် run ကာ S3 ပေါ် data သိမ်းဆည်းခြင်းဖြင့် စရိတ် 80-90% လျှော့ချနိုင်သည်။
- **Elastic Auto-Scaling:** Workload အတက်အကျအလိုက် EMR Managed Scaling က nodes များကို auto-scale လုပ်ပေးသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Limitations):
- Serverless မဟုတ်သော EMR on EC2 သည် cluster provisioning နှင့် tuning ကျွမ်းကျင်မှု လိုအပ်သည်။
- Core nodes များတွင် Spot သုံးမိပါက Spot interruption ကြောင့် HDFS data corrupt ဖြစ်နိုင်သည်။

---

## 7. Comparison: Amazon EMR vs AWS Glue vs Amazon Athena

| အင်္ဂါရပ် | Amazon EMR | AWS Glue | Amazon Athena |
| :--- | :--- | :--- | :--- |
| **Primary Technology** | Apache Spark, Hadoop, Hive, Presto | Serverless Spark Engine | Presto/Trino SQL Engine |
| **Control Level** | Full OS/Framework Configuration | Serverless (Script level control) | Pure Serverless SQL Query |
| **Spot Instance Support** | Yes (Task nodes heavily leverage Spot) | No | No (Shared serverless fleet) |
| **Best For** | Heavy Big Data, custom Spark, ML pipelines | Scheduled ETL pipelines & Data Cataloging | Fast ad-hoc interactive SQL on S3 |

---

## 8. Hands-on Lab: EMR Cluster ဖန်တီးခြင်း (AWS CLI)

### Step 1: EMR Cluster Launch လုပ်ခြင်း (Spark & Core/Task Nodes)
```bash
aws emr create-cluster \
    --name "Analytics-Spark-Cluster" \
    --release-label emr-7.0.0 \
    --applications Name=Spark Name=Hadoop Name=Hive \
    --ec2-attributes KeyName=my-key-pair,SubnetId=subnet-12345678 \
    --service-role EMR_DefaultRole \
    --job-flow-role EMR_EC2_DefaultRole \
    --instance-groups \
        InstanceGroupType=MASTER,InstanceCount=1,InstanceType=m5.xlarge \
        InstanceGroupType=CORE,InstanceCount=2,InstanceType=m5.xlarge \
        InstanceGroupType=TASK,InstanceCount=4,InstanceType=r5.xlarge,BidPrice=0.10
```

### Step 2: Spark Job Step တစ်ခု Submit ပြုလုပ်ခြင်း
```bash
aws emr add-steps \
    --cluster-id j-XXXXXXXXXXXXX \
    --steps Type=Spark,Name="CalculateMetrics",ActionOnFailure=CONTINUE,Args=[--deploy-mode,cluster,--class,org.apache.spark.examples.SparkPi,s3://my-code-bucket/spark-app.jar,100]
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:**
  - EMR Block Public Access (BPA) ဖြင့် cluster ကို internet သို့ public ပေါက်မသွားစေရန် ကာကွယ်ထားသည်။
  - Kerberos authentication ဖြင့် cluster အတွင်း user access ကို လုံခြုံစေသည်။
  - EMR Security Configurations ဖြင့် HDFS/S3 data at-rest နှင့် in-transit encryption (KMS) ဖွင့်နိုင်သည်။
- **Monitoring (CloudWatch):**
  - `IsIdle`: Cluster ပေါ်တွင် မည်သည့် job မှ မ run ဘဲ အလဟဿ ဖြစ်နေခြင်းကို စစ်ဆေးခြင်း (Auto-terminate trigger လုပ်ရန်)။
  - `YARNMemoryAvailablePercentage`: Compute memory လုံလောက်မှု ရှိ/မရှိ။
- **Troubleshooting:**
  - **HDFS Data Loss:** Core Node တွင် Spot instances မသုံးပါနှင့်။ Spot ကို Task Nodes များတွင်သာ အသုံးပြုရမည်။
- **Cost Structure:**
  - Underlying EC2 hourly cost + EMR Software surcharge (ခန့်မှန်းခြေ EC2 စရိတ်၏ 25%)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 Key Exam Tips:
- **Node Roles in EMR:**
  - **Master Node:** Coordinates cluster. (Do NOT use Spot).
  - **Core Node:** Runs tasks and holds HDFS data. (Recommended On-Demand / Reserved to prevent data loss).
  - **Task Node:** Compute only, NO data storage. (Perfect for **Spot Instances**).
- **EMRFS (Decouple Storage):** Store data on **Amazon S3** using EMRFS so you can terminate the EMR cluster when the job finishes to save costs.
- **Spark / Hadoop Keyword:** မေးခွန်းတွင် "Apache Spark, Hadoop, HBase, Petabyte processing with custom cluster control" ဆိုပါက **Amazon EMR** ဖြစ်သည်။

### 📝 Real Scenario Question:
> **မေးခွန်း:** ကုမ္ပဏီတစ်ခုသည် နေ့စဉ် ည ၁ နာရီတွင် 5 TB ပမာဏရှိသော Sensor log files များကို Apache Spark framework ဖြင့် တွက်ချက်ရမည်။ တွက်ချက်မှုသည် ၃ နာရီခန့် ကြာမြင့်ပြီး နေ့ခင်းဘက်တွင် မည်သည့်တွက်ချက်မှုမှ မရှိပါ။ ကုန်ကျစရိတ် အသက်သာဆုံးဖြစ်စေမည့် Architecture ကို မည်သို့ ရွေးချယ်သင့်သနည်း?
>
> **အဖြေမှန်:** **Transient Amazon EMR Cluster** တစ်ခုကို Step Functions သို့မဟုတ် EventBridge ဖြင့် ည ၁ နာရီတွင် launch လုပ်ပါ။ Source data များကို Amazon S3 တွင် EMRFS ဖြင့် သိမ်းဆည်းပါ။ Compute အတွက် Core node ကို အနည်းဆုံးထားပြီး Task Nodes များကို **EC2 Spot Instances** ဖြင့် run စေကာ Spark job ပြီးဆုံးသည်နှင့် Cluster ကို အလိုအလျောက် Terminate ပြုလုပ်ပါ။

### ❓ SAA-C03 Mini Quiz:

**Q1: Amazon EMR Cluster တစ်ခုတွင် EC2 Spot Instances များကို အသုံးပြုရန် အသင့်တော်ဆုံးနှင့် အန္တရာယ် အကင်းဆုံး ဖြစ်သော Node အမျိုးအစားမှာ အဘယ်နည်း?**
- A) Master Node
- B) Core Node
- C) Task Node
- D) Edge Node
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: C</b> — Task Node များသည် တွက်ချက်မှု သီးသန့်ဖြစ်ပြီး HDFS data သိမ်းဆည်းထားခြင်း မရှိသောကြောင့် Spot interruption ကြောင့် node ပျက်သွားလျှင်လည်း data loss မဖြစ်နိုင်ပါ။</details>

**Q2: Amazon EMR Cluster တွင် Data များကို Cluster ၏ Local HDFS ပေါ်တွင် မထားဘဲ Amazon S3 ပေါ်တွင် သိမ်းဆည်းနိုင်စေသည့် feature မှာ အဘယ်နည်း?**
- A) EMRFS (EMR File System)
- B) AWS DataSync
- C) Amazon EFS
- D) Storage Gateway
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: A</b> — EMRFS (EMR File System) သည် EMR cluster များအား Amazon S3 ကို persistent object store အဖြစ် တိုက်ရိုက် အသုံးပြုခွင့်ပေးပါသည်။</details>

**Q3: နေ့စဉ် သတ်မှတ်ထားသော အချိန်တွင်သာ Batch Big Data processing ပြုလုပ်ပြီး အလုပ်ပြီးသည်နှင့် cluster ကို ဖျက်ပစ်သော EMR Cluster အမျိုးအစားကို မည်သို့ခေါ်သနည်း?**
- A) Long-Running Cluster
- B) Transient Cluster
- C) Standalone Cluster
- D) Static Cluster
<details><summary>👉 အဖြေမှန် ကြည့်ရန်</summary><b>အဖြေမှန်: B</b> — Transient Cluster သည် batch job ပြီးဆုံးသည်နှင့် auto-terminate ဖြစ်အောင် တည်ဆောက်ထားသော ကုန်ကျစရိတ် အသက်သာဆုံး cluster ပုံစံဖြစ်ပါသည်။</details>
