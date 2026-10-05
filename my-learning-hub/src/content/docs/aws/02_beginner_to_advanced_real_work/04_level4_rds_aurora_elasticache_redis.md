---
title: "၀၄။ Level 4 — Database & In-Memory Caching (RDS, Aurora, ElastiCache Redis)"
description: "AWS RDS သည် MySQL, PostgreSQL, MariaDB, Oracle, SQL Server စသည့် Relational Database များကို Setup ပြုလုပ်ခြင်း၊ OS Patching လုပ်ခြင်း၊ အလိုအလျောက် နေ့စဉ် Backu"
---

## ၀၄။ Level 4 — Database & In-Memory Caching (RDS, Aurora, ElastiCache Redis)

---

## ၄.၁ AWS RDS (Relational Database Service)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
AWS RDS သည် MySQL, PostgreSQL, MariaDB, Oracle, SQL Server စသည့် Relational Database များကို Setup ပြုလုပ်ခြင်း၊ OS Patching လုပ်ခြင်း၊ အလိုအလျောက် နေ့စဉ် Backup ယူခြင်း၊ Storage Auto-scaling နှင့် High Availability Failover ပြုလုပ်ခြင်းတို့ကို AWS မှ တာဝန်ယူ စီမံခန့်ခွဲပေးသော **Fully Managed Relational Database Service** ဖြစ်သည်။

### ၂. ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Problem Statement & Real Example)
- **EC2 ပေါ်တွင် MySQL သွင်းသုံးခြင်း၏ ပြဿနာ:**  
  EC2 ပေါ်တွင် MySQL ကိုယ်တိုင် သွင်းပါက Linux Update လုပ်ခြင်း၊ MySQL Patch တင်ခြင်း၊ Master-Slave Replication သီးခြား Config ချခြင်း၊ Backup script (cron job) ရေး၍ S3 သို့ ပို့ခြင်းများကို ကိုယ်တိုင် လုပ်ရသည်။ Database disk ပြည့်သွားပါက Server ပိတ်ပြီး Volume ချဲ့ရသည်။ ထို့အပြင် Server ပျက်ကျပါက Manual အစားထိုးရသဖြင့် နာရီနှင့်ချီ Downtime ဖြစ်စေသည်။
- **AWS RDS ဖြင့် ဖြေရှင်းချက်:**  
  ခလုတ်တစ်ချက် နှိပ်ရုံဖြင့် Multi-AZ စနစ် ရရှိပြီး ၆၀ စက္ကန့်အတွင်း Auto Failover ပြုလုပ်ပေးသည်။ Disk ပြည့်ခါနီးပါက Storage Auto-scaling ဖြင့် အလိုအလျောက် ချဲ့ထွင်ပေးပြီး ၃၅ ရက်အထိ Point-in-Time Restore (စက္ကန့်အထိ တိကျစွာ ပြန် Restore လုပ်နိုင်ခြင်း) ကို AWS က အလိုအလျောက် လုပ်ဆောင်ပေးသည်။

### ၃. EC2 MySQL vs AWS RDS နှိုင်းယှဉ်ချက် ဇယား
| Feature | Self-Managed MySQL on EC2 | AWS RDS Managed Service |
| :--- | :--- | :--- |
| **OS & Security Patching** | ကိုယ်တိုင် Command ရိုက်၍ Update လုပ်ရသည် | AWS က Maintenance Window တွင် Auto လုပ်ပေးသည် |
| **Automated Backups** | Cron job နှင့် Shell Script ရေး၍ S3 သို့ ပို့ရသည် | Point-in-time restore အထိ AWS က ၃၅ ရက်အထိ Auto ယူပေးသည် |
| **Multi-AZ Failover** | Master-Slave replication ကိုယ်တိုင် config ချရသည် | ခလုတ်တစ်ချက်နှိပ်ရုံဖြင့် ၆၀ စက္ကန့်အတွင်း Standby သို့ Auto Failover |
| **Storage Auto Scaling** | Disk ပြည့်သွားပါက Server ပိတ်ပြီး Resize လုပ်ရသည် | Disk ပြည့်ခါနီးလျှင် အလိုအလျောက် Auto-expand လုပ်သည် |
| **Root/SSH Access** | OS Terminal Root ဝင်ရောက်ခွင့် ရှိသည် | OS သို့ ဝင်ခွင့်မရှိပါ (Database User အဖြစ်သာ သုံးရသည်) |

### ၄. Multi-AZ Deployment vs Read Replica
```
[ Multi-AZ Deployment (HA & DR အတွက်ဖြစ်သည်) ]
  Primary Writer (AZ-1a) <==== Synchronous Replication ====> Standby Instance (AZ-1c)
  - Standby Instance ကို SELECT Query ဖတ်ရန် သုံး၍ မရပါ (Sync Backup အဖြစ်သာ စောင့်နေသည်)။
  - Primary ပျက်ကျပါက DNS Switch ဖြင့် Standby သည် Primary ချက်ချင်း ဖြစ်လာသည်။

[ Read Replica (Performance Scaling အတွက်ဖြစ်သည်) ]
  Primary Writer (AZ-1a) ---- Asynchronous Replication ----> Read Replica 1 (AZ-1a)
                                                      ----> Read Replica 2 (AZ-1c)
  - SELECT Query အလွန်များသော Application များတွင် Read ဝန်ကို မျှဝေထမ်းဆောင်ပေးသည်။
  - အများဆုံး ၁၅ လုံးအထိ ထားရှိနိုင်သည်။
```

### ၅. AWS CLI Commands for RDS
```bash
# RDS Instance အချက်အလက်များကို ဇယားဖြင့် ကြည့်ရှုခြင်း
aws rds describe-db-instances \
  --query "DBInstances[*].[DBInstanceIdentifier,DBInstanceClass,Engine,DBInstanceStatus,Endpoint.Address]" \
  --output table

# Manual Snapshot တစ်ခု ချက်ချင်း ရယူခြင်း
aws rds create-db-snapshot \
  --db-instance-identifier prod-mysql-db \
  --db-snapshot-identifier prod-mysql-manual-backup-20260921

# Multi-AZ Failover စမ်းသပ်ခြင်း (Reboot with Failover)
aws rds reboot-db-instance \
  --db-instance-identifier prod-mysql-db \
  --force-failover
```

---

## ၄.၂ Amazon Aurora (Enterprise Cloud-Native Database)

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
Amazon Aurora သည် Cloud အတွက် သီးသန့် အစအဆုံး ပြန်လည်ရေးဆွဲထားသော AWS ၏ အမြင့်ဆုံး Flagship Relational Database ဖြစ်သည်။ MySQL နှင့် PostgreSQL နှင့် 100% Code အပြည့်အဝ ကိုက်ညီပြီး ရိုးရိုး MySQL ထက် ၅ ဆ၊ ရိုးရိုး PostgreSQL ထက် ၃ ဆ ပိုမို မြန်ဆန်သည်။

### ၂. Aurora Architecture Deep Dive (Distributed Storage)
```
                         [ Aurora Cluster Architecture ]
                                        |
                 +----------------------+----------------------+
                 | (Writes & Reads)                            | (Reads Only)
        [ Writer Instance ]                           [ Reader Instance ]
                 \                                             /
  ================ Distributed Storage Fleet (Fault Tolerant) ================
  AZ-1a: [ Copy 1 ] [ Copy 2 ] | AZ-1b: [ Copy 3 ] [ Copy 4 ] | AZ-1c: [ Copy 5 ] [ Copy 6 ]
  (Data တစ်ခုကို AZ ၃ ခုရှိ Storage စုစုပေါင်း ၆ နေရာတွင် Replicate ပြုလုပ်ထားပါသည်)
```
- **Quorum Model:** Data ရေးသည့်အခါ ၆ နေရာအနက် ၄ နေရာ အောင်မြင်ပါက Write အောင်မြင်သည်ဟု သတ်မှတ်သည်။ AZ တစ်ခုလုံး ပျက်ကျပြီး ဒုတိယ AZ ရှိ Storage တစ်ခု ထပ်ပျက်သော်လည်း (Failure စုစုပေါင်း ၃ ခု ဖြစ်သော်လည်း) Data လုံးဝ မဆုံးရှုံးပါ။
- **Instant Crash Recovery:** ရိုးရိုး MySQL သည် Crash ပြီး ပြန်တက်ချိန်တွင် Redo Log replay လုပ်ရသဖြင့် မိနစ်နှင့်ချီ ကြာသော်လည်း Aurora တွင် Storage Layer က အပြိုင်အဆိုင် လုပ်ဆောင်သဖြင့် စက္ကန့်ပိုင်းအတွင်း ချက်ချင်း တက်လာသည်။

### ၃. RDS MySQL vs Amazon Aurora ရွေးချယ်မှု စံနှုန်းများ
| မေးခွန်း | RDS MySQL | Amazon Aurora |
| :--- | :--- | :--- |
| **စရိတ်အကန့်အသတ်** | သက်သာသည် ($30~$100/mo) | အသင့်အတင့်မှ မြင့်မား ($80~$300+/mo) |
| **Failover ကြာချိန်** | ၆၀ - ၁၂၀ စက္ကန့် | ၃၀ စက္ကန့်အောက် (၁၀ စက္ကန့်ခန့်သာ) |
| **Storage အလိုအလျောက်တိုးခြင်း** | Auto-scaling သတ်မှတ်ပေးရသည် | 128TB အထိ 10GB စီ အလိုအလျောက် တိုးသည် |
| **Read Replica Lag** | သာမန်အားဖြင့် စက္ကန့်ပိုင်း ကြာနိုင်သည် | 10 milliseconds အောက်သာ ရှိသည် |
| **Japan 現場 ရွေးချယ်မှု** | အသေးစား Project / Internal Tools | Enterprise EC Sites / FinTech Core Systems |

---

## ၄.၃ AWS ElastiCache for Redis

### ၁. ဒီ Service က ဘာလဲ? (What is it?)
RAM (Memory) ပေါ်တွင် Data သိမ်းဆည်းသော Ultra-Fast In-Memory Data Store & Cache Service ဖြစ်သည်။ Microsecond Latency ဖြင့် Data ရယူနိုင်ပြီး Redis Engine ကို Fully Managed အနေဖြင့် Run ပေးသည်။

### ၂. Production Real-World Use Cases (Laravel & Node.js):

#### Use Case (၁) — Cache-Aside Pattern (Database Query ဝန်လျှော့ချခြင်း)
```php
// Laravel Example Code
$products = Cache::remember('featured_products', 3600, function () {
    // Redis ထဲတွင် ဒေတာမရှိမှသာ MySQL သို့ သွားရောက် Query ဆွဲသည်
    return DB::table('products')->where('is_featured', true)->get();
});
```
- ရလဒ်: MySQL ထံ တိုက်ရိုက်သွားပါက 150ms ကြာပြီး CPU တက်မည်။ Redis မှ ယူပါက 1.5ms သာ ကြာသဖြင့် အဆ ၁၀၀ ပိုမို မြန်ဆန်သည်။

#### Use Case (၂) — User Session Store
- Web Server များ Auto Scaling ဖြစ်လာပါက User Login Session များကို EC2 Local Disk တွင် မထားနိုင်ပါ။ Redis တွင် ဗဟိုပြု သိမ်းဆည်းထားခြင်းဖြင့် Server များ မည်မျှပင် သေသွားစေကာမူ User မှာ Login မပြုတ်သွားပါ။

#### Use Case (၃) — Laravel Queue Worker & Rate Limiting
- Background Jobs များ (Email ပို့ခြင်း၊ PDF ပြုလုပ်ခြင်း) ကို Redis Queue ထဲ ထည့်ထားပြီး Worker က ဖောက်ယူသည်။
- API တစ်ခုကို User တစ်ဦးက ၁ မိနစ်လျှင် အကြိမ် ၆၀ ထက် ပိုမခေါ်နိုင်စေရန် Rate Limiting ပြုလုပ်သည်။

---

## ၄.၄ Hands-on Exercise: RDS MySQL Multi-AZ တည်ဆောက်ခြင်း

### အဆင့် (၁) — DB Subnet Group ဖန်တီးခြင်း
Database သည် Private Subnet အနည်းဆုံး AZ ၂ ခုတွင် ရှိရပါမည်:
```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name prod-db-subnet-group \
  --db-subnet-group-description "Private DB Subnets for Multi-AZ" \
  --subnet-ids "subnet-01234567891a" "subnet-01234567891c"
```

### အဆင့် (၂) — RDS Multi-AZ Instance တည်ဆောက်ခြင်း
```bash
aws rds create-db-instance \
  --db-instance-identifier prod-mysql-db \
  --db-instance-class db.t4g.medium \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username dbadmin \
  --master-user-password "YourStrongPassword2026!" \
  --allocated-storage 20 \
  --max-allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --no-publicly-accessible \
  --db-subnet-group-name prod-db-subnet-group \
  --vpc-security-group-ids "sg-0123456789db" \
  --backup-retention-period 7
```

### အဆင့် (၃) — Verification:
```bash
aws rds describe-db-instances \
  --db-instance-identifier prod-mysql-db \
  --query "DBInstances[0].[DBInstanceStatus,MultiAZ,Endpoint.Address]"
```
Expected Output: Status သည် `available` ဖြစ်ရမည်ဖြစ်ပြီး MultiAZ သည် `true` ဖြစ်နေရမည်။

---
*နောက်အခန်းသို့ သွားရန်:* [05_Level5_Docker_ECR_ECS_Fargate.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/05_Level5_Docker_ECR_ECS_Fargate.md)
