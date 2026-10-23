---
title: "Amazon DynamoDB — Complete Master Architectural Guide"
description: "Amazon DynamoDB — Managed NoSQL database offering single-digit millisecond performance ကို မြန်မာလို အခြေခံမှ စတင်၍ Partition Keys, GSI/LSI, DAX, Streams နှင့် SAA-C03 Guide"
---

# Amazon DynamoDB
### Managed NoSQL Database Offering Single-Digit Millisecond Performance at Any Scale

Amazon DynamoDB သည် မည်သည့် Data ပမာဏနှင့် Request ပမာဏတွင်မဆို **Single-Digit Millisecond (10 ms အောက်)** တုံ့ပြန်မှုနှုန်းကို အာမခံနိုင်သော AWS ၏ **Serverless, Fully Managed NoSQL Key-Value & Document Database** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

သမားရိုးကျ Relational Database များသည် User ပေါင်း သန်းနှင့်ချီလာသောအခါ Horizontal Sharding ပြုလုပ်ရ ခက်ခဲပြီး Database Bottleneck ဖြစ်လေ့ရှိသည်။

**Amazon DynamoDB ၏ အဓိက ရည်ရွယ်ချက်:**  
Server Provisioning၊ Patching၊ Clustering နှင့် Sharding များကို လူကိုယ်တိုင် ပြုလုပ်စရာမလိုဘဲ အလိုအလျောက် အကန့်အသတ်မရှိ (Scalable) ချဲ့ထွင်ပေးနိုင်သော NoSQL Database ဖြစ်ပြီး တစ်စက္ကန့်လျှင် Requests သန်းဆယ်ချီအထိ Single-digit millisecond ဖြင့် တည်ငြိမ်စွာ အလုပ်လုပ်နိုင်စေရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Tables** | Collections of Items | Relational DB ၏ Table နှင့် တူသော်လည်း Schema-less ဖြစ်ပြီး Row တစ်ခုစီတွင် Column များ တူညီစရာ မလိုပါ။ |
| **Items & Attributes** | Records & Columns | Item သည် Record (အများဆုံး 400 KB) ဖြစ်ပြီး Attributes များသည် အချက်အလက်များ ဖြစ်သည်။ |
| **Partition Key (Hash Key)** | Primary Key Type 1 | ဒေတာများကို မည်သည့် Physical Storage Partition သို့ ခွဲဝေသိမ်းဆည်းရမည်ကို ဆုံးဖြတ်သော Unique Key ဖြစ်သည်။ |
| **Sort Key (Range Key)** | Primary Key Type 2 | တူညီသော Partition Key အတွင်းရှိ Items များကို အစီအစဉ်တကျ စီစဉ်ရန် သုံးသော Composite Key ဖြစ်သည်။ |
| **Global Secondary Index (GSI)** | Flexible Query Index | မူလ Table နှင့် မတူညီသော Partition Key နှင့် Sort Key ဖြင့် Query ရှာဖွေနိုင်သော Index ဖြစ်သည်။ (Table ဆောက်ပြီးနောက် အချိန်မရွေး ထည့်/ဖျက်နိုင်သည်)။ |
| **Local Secondary Index (LSI)** | Alternative Sort Index | မူလ Table နှင့် Partition Key တူညီသော်လည်း Sort Key ကွဲပြားသော Index ဖြစ်သည်။ (**Table ဆောက်စဉ်ကတည်းကသာ ထည့်သွင်းရမည်**)။ |
| **DynamoDB Accelerator (DAX)** | In-Memory Cache | DynamoDB ရှေ့တွင် ထားရှိသော In-Memory Cache ဖြစ်ပြီး Latency ကို **Microseconds (μs)** အထိ လျှော့ချပေးသည်။ |
| **DynamoDB Streams** | Change Data Capture (CDC) | Table အတွင်း Insert/Update/Delete ဖြစ်သွားသော အချက်အလက်များကို ၂၄ နာရီအတွင်း အစီအစဉ်တကျ Event အဖြစ် မှတ်တမ်းတင်ပေးသည်။ (AWS Lambda နှင့် ချိတ်ဆက်လေ့ရှိသည်)။ |

---

## 3. Architecture (Diagram & Request Flow)

DynamoDB သည် Partition Key ၏ MD5 Hash Algorithm ပေါ် မူတည်၍ ဒေတာများကို မတူညီသော Partitions များဆီသို့ အလိုအလျောက် ဖြန့်ကျက် သိမ်းဆည်းပါသည်:

```
                                  [ Application Clients ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼ (Microsecond Cache Hit)                   ▼ (Single-digit ms)
        ┌─────────────────────────────┐             ┌─────────────────────────────┐
        │ DynamoDB Accelerator (DAX)  │             │   Amazon DynamoDB Table     │
        │    (In-Memory Write-Through)│             │  (Primary Key: UserID + Date)│
        └──────────────┬──────────────┘             └──────────────┬──────────────┘
                       │ (Cache Miss)                              │
                       └─────────────────────┬─────────────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼ (Hash Key Calculation)                  ▼
       ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
       │   Storage Partition 1 (Users A-M)│       │   Storage Partition 2 (Users N-Z)│
       │  ┌─────────────────────────────┐│       │  ┌─────────────────────────────┐│
       │  │ Replicated across 3 AZs     ││       │  │ Replicated across 3 AZs     ││
       │  └─────────────────────────────┘│       │  └─────────────────────────────┘│
       └────────────────┬────────────────┘       └─────────────────────────────────┘
                        │ (Change Log)
                        ▼
       ┌─────────────────────────────────┐
       │     DynamoDB Streams (24-Hour)  │ ─────► [ AWS Lambda Function ] ──► [ SNS / SQS ]
       └─────────────────────────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Partitioning Model:** အသုံးပြုသူမှ Item တစ်ခု `put-item` လုပ်လိုက်ပါက Partition Key တန်ဖိုးကို Hash တွက်ချက်ပြီး သက်ဆိုင်ရာ Partition Storage Node ၃ ခု (Multi-AZ) သို့ တပြိုင်နက် ရေးသားသည်။
2. **Read Consistency Modes:**
   - **Eventually Consistent Read (Default):** ချက်ချင်းဖတ်ပါက ဒေတာအသစ်ဆုံး မရနိုင်သေးဘဲ စက္ကန့်ပိုင်းအတွင်း တူညီသွားမည်။ (RCU ကုန်ကျစရိတ် တစ်ဝက်သက်သာသည်)။
   - **Strongly Consistent Read:** နောက်ဆုံးရေးထားသော အသစ်ဆုံး ဒေတာကို သေချာပေါက် ရရှိမည်။ (RCU နှစ်ဆ ကုန်ကျသည်)။
3. **Capacity Modes:**
   - **On-Demand Mode:** Traffic ကို ကြိုမသိနိုင်သောအခါ သုံးသည်။ ရောက်လာသလောက် Request အလိုက်သာ ငွေပေးချေရသည်။
   - **Provisioned Mode:** နေ့စဉ် Traffic တည်ငြိမ်သောအခါ RCU (Read Capacity Units) နှင့် WCU (Write Capacity Units) ကို ကြိုတင် သတ်မှတ်ထားပြီး Auto-scaling တွဲသုံးသည်။
4. **Time To Live (TTL):** သတ်မှတ်ထားသော Timestamp ကုန်ဆုံးသွားပါက (ဥပမာ- ရက် ၃၀ ကြာပြီးနောက်) ထို Item ကို AWS ဘက်မှ အခမဲ့ အလိုအလျောက် ဖျက်ပစ်ပေးသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **User Sessions & Shopping Carts:** E-Commerce ဝဘ်ဆိုဒ်များတွင် User ၏ Session Data များကို Single-digit ms ဖြင့် အမြန်ဆုံး ဖတ်/ရေး ပြုလုပ်ခြင်း။
- **Mobile & Gaming Backends:** Player Leaderboards၊ Player Inventory နှင့် Real-time State စီမံခန့်ခွဲခြင်း။
- **IoT Device Telemetry Data:** စက်ရုံ Sensor များမှ တစ်စက္ကန့်လျှင် ထောင်ချီ ဝင်ရောက်လာသော ဒေတာများကို Serverless ဖြင့် လက်ခံသိမ်းဆည်းခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Fully Serverless (ဆာဗာစီမံရန်၊ Patching လုပ်ရန် လုံးဝ မလိုပါ)။
- အကန့်အသတ်မရှိ Scale လုပ်နိုင်ပြီး Latency မှာ အမြဲ Single-digit ms တည်ငြိမ်သည်။
- **Global Tables:** Multi-Region Multi-Active (Active-Active) Replication ရရှိသည်။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **No Complex JOINs:** Table အချင်းချင်း JOIN ခေါ်ယူ၍ မရပါ။ (Single-Table Design စနစ်တကျ ရေးဆွဲရမည်)။
- **Item Size Limit:** Item တစ်ခု၏ အမြင့်ဆုံး အရွယ်အစားမှာ **400 KB** သာ ဖြစ်သည်။ (ပိုကြီးပါက S3 တွင် သိမ်းပြီး S3 URL ကို Attribute အဖြစ် ထည့်ရသည်)။

---

## 7. Comparison (DynamoDB vs RDS vs ElastiCache)

| Feature | Amazon DynamoDB | Amazon RDS | Amazon ElastiCache |
| :--- | :--- | :--- | :--- |
| **Data Model** | NoSQL (Key-Value / Document) | Relational (SQL Tables) | In-Memory Key-Value |
| **Latency** | **Single-digit Milliseconds** | Tens of Milliseconds | **Sub-millisecond (Microseconds)** |
| **Scaling** | Unlimited Auto-scale | Vertical Compute Scale | Cluster Node Scaling |
| **Server Management** | **Zero (Serverless)** | Managed Instance (Patching) | Managed Nodes |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: DynamoDB Table အသစ် ဆောက်ခြင်း
```bash
aws dynamodb create-table \
    --table-name "UserProfiles" \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
        AttributeName=GameId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
        AttributeName=GameId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

### Step 2: Item အသစ် ထည့်သွင်းခြင်း (Put Item)
```bash
aws dynamodb put-item \
    --table-name "UserProfiles" \
    --item '{
        "UserId": {"S": "usr_9981"},
        "GameId": {"S": "game_moba_01"},
        "Score": {"N": "14500"},
        "Rank": {"S": "Diamond"}
    }'
```

### Step 3: Primary Key ဖြင့် Item ရှာဖွေခြင်း (Get Item)
```bash
aws dynamodb get-item \
    --table-name "UserProfiles" \
    --key '{
        "UserId": {"S": "usr_9981"},
        "GameId": {"S": "game_moba_01"}
    }'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** IAM Fine-Grained Access Control (User သည် မိမိ၏ `UserId` item ကိုသာ ဖတ်/ပြင်ခွင့် ပေးခြင်း), KMS Encryption at Rest, VPC Endpoint (Gateway Endpoint) ဖြင့် Private Access ရယူခြင်း။
- **Monitoring:** CloudWatch Metrics (`UserErrors`, `SystemErrors`, `ThrottledRequests` - WCU/RCU မလောက်ငှပါက သတိပေးခြင်း)။
- **Cost:** WCU ($0.00065 per WCU hour) + RCU ($0.00013 per RCU hour) သို့မဟုတ် On-Demand Request Unit အလိုက် ပေးချေခြင်း + Storage ($0.25 per GB/mo)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **DAX for Microsecond Latency:** မေးခွန်းတွင် "DynamoDB read performance must be improved from milliseconds to **microseconds**" ဟု ပါပါက အဖြေသည် **DynamoDB Accelerator (DAX)** ဖြစ်ပါသည်။
> 2. **LSI vs GSI:** **LSI** ကို Table ဆောက်စဉ်ကတည်းကသာ သတ်မှတ်ရမည်ဖြစ်ပြီး နောက်ပိုင်း ထပ်တိုး၍ မရပါ။ **GSI** ကိုမူ Table တည်ဆောက်ပြီးနောက် အချိန်မရွေး ထည့်သွင်း/ဖျက်ပစ်နိုင်ပါသည်။
> 3. **Change Data Capture (CDC):** DynamoDB ဒေတာ အပြောင်းအလဲများကို အခြား Service များသို့ Real-time ပို့ဆောင်ရန် **DynamoDB Streams + AWS Lambda** ကို သုံးရမည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
Gaming Application တစ်ခုသည် အသုံးပြုသူ သန်းပေါင်းများစွာ၏ Live Leaderboard ကို ပြသနေပြီး DynamoDB Table မှ စက္ကန့်တိုင်း ထောင်ချီသော Read Queries များ ဝင်ရောက်နေသည်။ Read Latency ကို Milliseconds မှ **Microseconds** အဆင့်သို့ လျှော့ချလိုပြီး Application Code ပြောင်းလဲမှုကို အနည်းဆုံး ဖြစ်စေလိုသည်။ Solutions Architect အနေဖြင့် မည်သို့ အကြံပြုသင့်သနည်း?

- A) DynamoDB Table ရှေ့တွင် Amazon DAX (DynamoDB Accelerator) Cluster ကို တပ်ဆင်မည်။
- B) DynamoDB Global Tables ကို ဖွင့်မည်။
- C) Table ကို ElastiCache Memcached သို့ ပြောင်းမည်။
- D) Strongly Consistent Reads သို့ ပြောင်းမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: A**  
**ရှင်းလင်းချက်:** **Amazon DAX** သည် DynamoDB အတွက် အထူးထုတ်လုပ်ထားသော In-Memory Cache ဖြစ်ပြီး Read Latency ကို Microseconds အထိ လျှော့ချပေးကာ DynamoDB API နှင့် 100% Compatible ဖြစ်သဖြင့် Code ပြင်ဆင်ရန် မလိုပါ။
</details>
