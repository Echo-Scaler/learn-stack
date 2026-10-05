---
title: "Phase 13 — Backup & Disaster Recovery (RPO & RTO)"
description: "Architect Perspective: အရာအားလုံးသည် အချိန်မရွေး ပျက်စီးသွားနိုင်သည် (Everything fails, all the time) ဟူသော AWS CTO Werner Vogels ၏ စကားအတိုင်း Architect တစ်ဦ"
---

## Phase 13 — Backup & Disaster Recovery (RPO & RTO)

> **Architect Perspective:** "အရာအားလုံးသည် အချိန်မရွေး ပျက်စီးသွားနိုင်သည် (Everything fails, all the time)" ဟူသော AWS CTO Werner Vogels ၏ စကားအတိုင်း Architect တစ်ဦးသည် စနစ်ပျက်ကျချိန်တွင် အမြန်ဆုံးနှင့် Data အဆုံးအရှုံး အနည်းဆုံးဖြင့် ပြန်လည် ထူထောင်နိုင်မည့် နည်းဗျူဟာကို ကြိုတင် ဒီဇိုင်းထုတ်ထားရမည်။

---

## ၁၃.၁ AWS Backup Services Ecosystem

```
+-----------------------------------------------------------------------------------+
|                            AWS BACKUP SERVICES MATRIX                             |
+-----------------------------------------------------------------------------------+
|  1. Amazon EBS Snapshots: Point-in-time Incremental Backup (Stored in S3)         |
|  2. Amazon RDS Automated Backups: Transaction Logs အပြည့်အစုံဖြင့် 35 ရက်အထိ PITR |
|  3. Amazon RDS Snapshots: User က Manual သိမ်းဆည်းပြီး မဖျက်မချင်း အမြဲတည်ရှိသည်    |
|  4. Amazon S3 Versioning: Object မတော်တဆ ဖျက်မိ/Overwrite ဖြစ်ခြင်းမှ ကာကွယ်ခြင်း   |
|  5. AWS Backup (Centralized Managed Backup):                                      |
|     - EBS, RDS, DynamoDB, EFS, FSx, EC2, S3 အားလုံးကို ဗဟို Backup Plan တစ်ခုတည်းမှ |
|       Schedule အလိုက် Backup ယူခြင်း၊ Lifecycle သတ်မှတ်ခြင်းနှင့် Cross-Region/     |
|       Cross-Account Vault သို့ လုံခြုံစွာ ကူးယူသိမ်းဆည်းခြင်း                        |
+-----------------------------------------------------------------------------------+
```

---

## ၁၃.၂ RPO နှင့် RTO တိုင်းတာချက်များ

```
+-----------------------------------------------------------------------------------+
|                            RPO AND RTO RECOVERY TIMELINE                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|           <----------- RPO ----------->               <----------- RTO ---------> |
|  ---------+---------------------------*---------------+-------------------------> |
|      Last Backup                  Disaster Strikes       System Fully Restored    |
|      (1:00 PM)                      (2:00 PM)                  (3:30 PM)          |
|                                                                                   |
|  - RPO (Recovery Point Objective): ဆုံးရှုံးသွားသော ဒေတာပမာဏ (၁ နာရီစာ Data)         |
|  - RTO (Recovery Time Objective): စနစ်ပြန်လည် ကောင်းမွန်ရန် ကြာမြင့်ချိန် (၁ နာရီခွဲ) |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Scenario: "Database ပျက်သွားရင် ဘယ်လောက်အတွင်း ပြန်ရမလဲ?"
- လုပ်ငန်းတစ်ခုက ပြောသည်: *"ကျွန်တော်တို့ DB ပျက်သွားရင် ၁၅ မိနစ်ထက်ပိုပြီး Down နေလို့ မရဘူး (RTO = 15 mins)၊ ပြီးတော့ နောက်ဆုံး ၅ မိနစ်စာထက်ပိုတဲ့ အော်ဒါတွေ ပျောက်လို့ မရဘူး (RPO = 5 mins)"*
- **Architectural Decision:**
  - ရိုးရိုး Daily S3 Backup & Restore ဖြင့် မရနိုင်ပါ (RTO သည် နာရီနှင့်ချီ ကြာမည်)။
  - **RDS Multi-AZ (Automatic Failover within 60s - RTO < 1 min, RPO = 0)** သို့မဟုတ် **Aurora Global Database (RPO < 1s, RTO < 1 min)** ကို အသုံးပြုရမည်။

---

## ၁၃.၃ Disaster Recovery (DR) နည်းဗျူဟာ (၄) မျိုး နှိုင်းယှဉ်ချက်

```
+-----------------------------------------------------------------------------------+
|                         DISASTER RECOVERY 4 STRATEGIES                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. Backup & Restore (စရိတ် အသက်သာဆုံး / RTO, RPO နာရီနှင့်ချီ ကြာသည်):             |
|     - Data ကို S3 သို့ Backup လုပ်ထားပြီး ဘေးဒဏ်သင့်မှ အသစ်ပြန်ဆောက်သည်            |
|                                                                                   |
|  2. Pilot Light (စရိတ် သက်သာသည် / RTO ဆယ်ဂဏန်းမိနစ် ကြာသည်):                     |
|     - Database ကို အရန် Region တွင် အမြဲ Sync လုပ်ထားပြီး Server များကို ပိတ်ထားသည် |
|     - ဘေးဒဏ်ကျမှ EC2 များကို AMI မှ အမြန် Launch လုပ်သည်                           |
|                                                                                   |
|  3. Warm Standby (စရိတ် သင့်တင့်သည် / RTO မိနစ်ပိုင်းသာ ကြာသည်):                    |
|     - အရန် Region တွင် စနစ်တစ်ခုလုံး၏ အသေးစား Version (Minimum Size) ကို ၂၄ နာရီ   |
|       အမြဲ Run ထားပြီး ဘေးဒဏ်ကျပါက ASG ဖြင့် ချက်ချင်း Scale Out လုပ်သည်            |
|                                                                                   |
|  4. Multi-Site Active-Active (စရိတ် အကြီးဆုံး / RPO ~ 0, RTO ~ 0):                |
|     - Region (၂) ခုစလုံးတွင် စနစ် အပြည့်အစုံကို ၂၄ နာရီ တပြိုင်နက် Run ထားသည်       |
|     - Region တစ်ခု ပျက်ကျလျှင် အခြား Region က ချက်ချင်း အပြည့်အဝ တာဝန်ယူသည်         |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [14_Phase14_Cost_Optimization_and_FinOps.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/14_Phase14_Cost_Optimization_and_FinOps.md)
