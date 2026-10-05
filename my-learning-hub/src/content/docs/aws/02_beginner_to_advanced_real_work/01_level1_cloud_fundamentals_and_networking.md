---
title: "၀၁။ Level 1 — Cloud Computing & AWS Fundamentals & Networking Basics"
description: "Cloud Computing ဆိုသည်မှာ ကွန်ပျူတာ Hardware များ (Server, CPU, RAM, Hard Disk, Network Switch, Router) ကို မိမိတို့ရုံးခန်းထဲတွင် ကိုယ်တိုင်ဝယ်ယူ ထားရှိစရာမလို"
---

## ၀၁။ Level 1 — Cloud Computing & AWS Fundamentals & Networking Basics

## ၁.၁ Cloud Computing ဆိုတာဘာလဲ & On-premises vs Cloud

### ဒီ Concept က ဘာလဲ? (What is it?)
**Cloud Computing** ဆိုသည်မှာ ကွန်ပျူတာ Hardware များ (Server, CPU, RAM, Hard Disk, Network Switch, Router) ကို မိမိတို့ရုံးခန်းထဲတွင် ကိုယ်တိုင်ဝယ်ယူ ထားရှိစရာမလိုဘဲ **Internet မှတစ်ဆင့် လိုအပ်သလောက် Instant ငှားရမ်းအသုံးပြုပြီး အသုံးပြုသလောက်သာ ပေးချေရသော စနစ် (On-demand delivery of IT resources over the internet with pay-as-you-go pricing)** ဖြစ်သည်။

```
[ Traditional On-Premises (オンプレミス) ]
  ရုံးခန်း/Server Room ငှားရခြင်း -> Server Hardware များ ကြိုတင်ဝယ်ယူရခြင်း (3 to 6 လ ကြာ) 
  -> AC အအေးပေးစက်, မီးစက်, UPS ထားရခြင်း -> Network ကြိုးသွယ်တန်းရခြင်း 
  -> Hardware ပျက်စီးပါက အစားထိုးလဲလှယ်ရခြင်း -> ကုန်ကျစရိတ်ကြီးမားပြီး အချိန်ကြန့်ကြာခြင်း။

[ AWS Cloud (アマゾン クラウド) ]
  Internet -> AWS Management Console သို့မဟုတ် Terraform Code 
  -> ၂ မိနစ်အတွင်း အဆင့်မြင့် Server, Database, Load Balancer များကို ချက်ချင်း Instant Spin-up ပြုလုပ်နိုင်ခြင်း 
  -> အသုံးမလိုလျှင် ဖျက်ပစ်နိုင်ပြီး သုံးစွဲသည့် မိနစ်/စက္ကန့်အလိုက်သာ ငွေရှင်းရခြင်း။
```

### ဘာ Problem ကို ဖြေရှင်းပေးတာလဲ? (Real-world Example ဥပမာ)
- **လက်တွေ့ ဥပမာ:** Tokyo အခြေစိုက် EC Site (Online Shopping Mall) တစ်ခုသည် "Black Friday" သို့မဟုတ် "New Year Sale" ကာလတွင် User ပေါင်း ၁ သန်း တစ်ပြိုင်နက်တည်း ဝင်ရောက်လာမည်။
- **On-premises ပြဿနာ:** ထို User ပမာဏကို ခံနိုင်ရန် Server Hardware အလုံး ၅၀ ကို ကြိုတင်ဝယ်ယူရမည် (ကုန်ကျစရိတ် ယန်းသန်းပေါင်းများစွာ ကုန်ကျပြီး ဝယ်ယူတပ်ဆင်ရန် ၃ လ ကြာမြင့်သည်)။ Sale ပြီးသွားပါက ထို Server ၄၀ ကျော်သည် အသုံးမရှိဘဲ လျှပ်စစ်ခနှင့် ရုံးခန်းနေရာ အလဟဿ ကုန်ကျနေမည်။
- **Cloud ဖြေရှင်းချက်:** Sale စတင်သည့် နာရီပိုင်းအတွင်း AWS Auto Scaling ဖြင့် Server အလုံးရေ ၅၀ သို့ အလိုအလျောက် တိုးမြှင့်လိုက်ပြီး Sale ပြီးဆုံးပါက မူလ ၅ လုံးသို့ ပြန်လည် လျှော့ချပစ်သည်။ သုံးစွဲခဲ့သည့် နာရီပိုင်းအတွက်သာ ငွေရှင်းရသည်။

### On-Premises နှင့် AWS နှိုင်းယှဉ်ချက် ဇယား
| Feature | On-Premises (オンプレミス) | AWS Cloud (アマゾン クラウド) |
| :--- | :--- | :--- |
| **Initial Cost (初期費用)** | အလွန်မြင့်မား (CapEx - Capital Expenditure) | မရှိသလောက်နည်းပါး (OpEx - Operating Expense) |
| **Setup Time (構築期間)** | ရက်သတ္တပတ်မှ လပေါင်းများစွာ ကြာမြင့် | မိနစ်ပိုင်းအတွင်း ရရှိ |
| **Maintenance (保守・運用)** | Hardware, Power, Fan, Cable ကိုယ်တိုင်ပြင်ရသည် | AWS က Physical Data Center အကုန်တာဝန်ယူသည် |
| **Scalability (拡張性)** | Server အသစ်ထပ်ဝယ်ရသည် (ခက်ခဲ) | Click တစ်ချက် သို့မဟုတ် Auto Scaling ဖြင့် အကန့်အသတ်မရှိ တိုးနိုင် |
| **Disaster Recovery (DR)** | အခြားမြို့တွင် ဒုတိယ Data Center ငှားရ၍ အကုန်အကျများ | Multi-AZ သို့မဟုတ် Region အခြားသို့ Data replicate လုပ်ရုံ |

---

## ၁.၂ IaaS, PaaS, SaaS ကွာခြားချက်များ & Shared Responsibility Model

```
+-------------------------------------------------------------------------+
|                  SHARED RESPONSIBILITY MODEL COMPARISON                 |
|                                                                         |
| Layer                 | On-Premises |   IaaS    |   PaaS    |   SaaS    |
|-----------------------+-------------+-----------+-----------+-----------|
| Applications          |   YOU       |   YOU     |   YOU     |  Provider |
| Data                  |   YOU       |   YOU     |   YOU     |  Provider |
| Runtime               |   YOU       |   YOU     |  Provider |  Provider |
| Middleware            |   YOU       |   YOU     |  Provider |  Provider |
| Operating System (OS) |   YOU       |   YOU     |  Provider |  Provider |
| Virtualization        |   YOU       |  Provider |  Provider |  Provider |
| Servers / Hardware    |   YOU       |  Provider |  Provider |  Provider |
| Storage               |   YOU       |  Provider |  Provider |  Provider |
| Networking            |   YOU       |  Provider |  Provider |  Provider |
+-------------------------------------------------------------------------+
```

1. **IaaS (Infrastructure as a Service):**  
   - **ဥပမာ:** Amazon EC2, Amazon VPC, Amazon EBS။  
   - AWS က Physical Server, Storage, Network Switch များကို တာဝန်ယူသည်။ OS (Ubuntu, Amazon Linux), Software, Security Patches, Application Code များကို မိမိတို့က တာဝန်ယူရသည်။
2. **PaaS (Platform as a Service):**  
   - **ဥပမာ:** AWS Elastic Beanstalk, AWS App Runner, AWS Lambda။  
   - OS နှင့် Runtime (PHP, Node.js, Python) ကိုပါ AWS က စီမံပေးသည်။ မိမိတို့က Application Code နှင့် Database Data သာ တင်ရန် လိုသည်။
3. **SaaS (Software as a Service):**  
   - **ဥပမာ:** Slack, Gmail, Zoom, Salesforce, AWS WorkMail။  
   - မည်သည့် Code မှ ရေးစရာမလိုဘဲ အသင့်သုံး Software ကို Browser မှတစ်ဆင့် သုံးစွဲခြင်း ဖြစ်သည်။

---

## ၁.၃ Cloud Core Characteristics

ဂျပန် IT လုပ်ငန်းခွင်တွင် မကြာခဏ အသုံးပြုရသော Architecture Terms များ:
- **Scalability (拡張性 - Kakuchousei):** Workload တိုးလာသည့်အခါ System က Server အင်အားကို ကြီးထွားနိုင်စွမ်း (Scale Up = CPU/RAM မြှင့်ခြင်း, Scale Out = Server အလုံးရေတိုးခြင်း)။
- **Elasticity (弾力性 - Danryokusei):** Traffic များလာလျှင် Server အလိုအလျောက်တိုးလာပြီး Traffic နည်းသွားပါက ကုန်ကျစရိတ်သက်သာစေရန် Server ပြန်လည်လျော့ကျသွားသော သဘောတရား (ဥပမာ- AWS Auto Scaling)။
- **High Availability - HA (高可用性 - Koukayousei):** Hardware တစ်ခုခု ပျက်စီးသွားသော်လည်း Service ပျက်ကျမသွားဘဲ အမြဲအလုပ်လုပ်နေစေခြင်း (ဥပမာ- Multi-AZ Deployment)။
- **Fault Tolerance (耐障害性 - Taishougaisei):** Component တစ်ခု (Server သို့မဟုတ် Data Center တစ်ခု) ပျက်ကျသွားသော်လည်း Zero Downtime ဖြင့် Auto Failover လုပ်နိုင်ခြင်း။
- **Disaster Recovery - DR (ディザスタリカバリ):** ငလျင်လှုပ်ခြင်း၊ ရေကြီးခြင်း၊ စစ်ပွဲ စသည့် မမျှော်လင့်သော ကပ်ဘေးများကြောင့် Data Center တစ်ခုလုံး ပျက်စီးသွားပါက အခြား Region သို့ ပြန်လည် Restore လုပ်နိုင်သော စနစ်။
- **Pay-as-you-go (従量課金制 - Juuryou Kakisei):** မိမိအသုံးပြုသည့် အချိန် (နာရီ/မိနစ်/စက္ကန့်) နှင့် Data Storage ပမာဏအလိုက်သာ အတိအကျ ပေးချေရသော စနစ်။

---

## ၁.၄ Beginner မဖြစ်မနေသိရမည့် Networking အခြေခံများ

1. **IP Address (Internet Protocol Address):** Network ပေါ်ရှိ စက်တစ်ခုချင်းစီ၏ လိပ်စာ (ဥပမာ- `192.168.1.1` သို့မဟုတ် `10.0.1.50`)။
2. **Public IP vs Private IP:**
   - **Public IP:** Internet ပေါ်မှ တိုက်ရိုက်ခေါ်ယူနိုင်သော ကမ္ဘာ့ Global Address (ဥပမာ- Website များ၊ ALB များတွင် သုံးသည်)။
   - **Private IP:** မိမိတို့၏ VPC သို့မဟုတ် Local Network အတွင်းတွင်သာ အချင်းချင်း ဆက်သွယ်နိုင်သော အတွင်းလိပ်စာ (Internet မှ တိုက်ရိုက် Hack မရနိုင်သဖြင့် Database နှင့် Backend Server များကို Private IP ဖြင့်သာ ထားရှိရသည်)။
3. **CIDR Notation (Classless Inter-Domain Routing) တွက်နည်း:**  
   - `10.0.0.0/16` -> Host bits မှာ `32 - 16 = 16` ဖြစ်သဖြင့် $2^{16} = 65,536$ IPs ရရှိသည်။
   - `10.0.1.0/24` -> Host bits မှာ `32 - 24 = 8` ဖြစ်သဖြင့် $2^8 = 256$ IPs ရရှိသည်။
   - *AWS Reserved IPs Rule:* Subnet တစ်ခုစီတွင် IP ၅ ခုကို AWS က Reserve လုပ်ထားပါသည်:
     - `.0` -> Network Address
     - `.1` -> VPC Router
     - `.2` -> AWS DNS Server
     - `.3` -> Future Reserved
     - `.255` -> Broadcast Address
     - ထို့ကြောင့် `/24` တွင် အမှန်တကယ် စက်များအား ပေးနိုင်သော IP မှာ `256 - 5 = 251` ခုသာ ဖြစ်သည်။
4. **Port Numbers (ポート番号):**
   - `Port 80`: HTTP (Plain Web Traffic)
   - `Port 443`: HTTPS (Encrypted Secure Web Traffic)
   - `Port 22`: SSH (Linux Terminal Remote Access)
   - `Port 3306`: MySQL / Amazon Aurora MySQL Database
   - `Port 5432`: PostgreSQL Database
   - `Port 6379`: Redis Cache
5. **TCP vs UDP:**
   - **TCP:** Handshake လုပ်ပြီး Packet များ မပျောက်မပျက်ရောက်အောင် သေချာပို့သည် (HTTP, HTTPS, SSH, Database)။
   - **UDP:** မြန်ဆန်မှုကို ဦးစားပေးပြီး Packet ဆုံးရှုံးမှုကို ဂရုမစိုက် (Live Video Streaming, Online Voice Calls, DNS Query)။
6. **DNS (Domain Name System):** လူနားလည်လွယ်သော နာမည် (`example.com`) ကို စက်နားလည်သော IP (`54.238.12.34`) သို့ ပြောင်းပေးသည့် စနစ် (AWS Route 53)။
7. **NAT (Network Address Translation):** Private Subnet ထဲရှိ Server များက အပြင် Internet သို့ Software Package Download ဆွဲရန် Private IP ကို Public IP အဖြစ် ယာယီ Mask လုပ်ပေးပြီး ပြန်ထွက်စေသော စနစ် (AWS NAT Gateway)။

---

## ၁.၅ AWS Global Infrastructure (Region, AZ, Edge Location)

AWS ၏ ကမ္ဘာလုံးဆိုင်ရာ အခြေခံအဆောက်အအုံကို အဓိက ၃ မျိုး ခွဲခြားထားပါသည်:

```
                       [ AWS Global Infrastructure ]
                                    |
          +-------------------------+-------------------------+
          |                                                   |
   [ AWS Regions ]                                    [ Edge Locations ]
          |                                                   |
+---------+---------+                               (CloudFront CDN / Route 53)
|                   |                                 ကမ္ဘာအနှံ့ 600+ နေရာတွင်ရှိပြီး
Tokyo Region      Osaka Region                         Static files များကို User အနီးဆုံးမှ
(ap-northeast-1)  (ap-northeast-3)                     Cache လုပ်၍ မြန်ဆန်စွာ ပို့ပေးသည်။
      |
+-----+---------------------------+
|                                 |
Availability Zone A     Availability Zone C     Availability Zone D
(ap-northeast-1a)       (ap-northeast-1c)       (ap-northeast-1d)
[ Data Center 1 ]       [ Data Center 2 ]       [ Data Center 3 ]
(တစ်ခုနှင့်တစ်ခု ကီလိုမီတာ ဆယ်နှင့်ချီ ကွာဝေးပြီး သီးခြား မီးလိုင်း၊ သီးခြား Fiber ကြိုးဖြင့် ချိတ်ဆက်ထားသည်)
```

### Japan Project များတွင် Region နှင့် AZ ရွေးချယ်မှု စည်းမျဉ်းများ
1. **Tokyo Region (`ap-northeast-1`):**  
   Japan ရှိ Project အများစု (95%) သည် Tokyo Region ကို အဓိက Primary Region အဖြစ် အသုံးပြုကြသည်။ Latency အလွန်နည်းပြီး Feature အားလုံး အပြည့်အစုံ ရရှိသည်။
2. **Osaka Region (`ap-northeast-3`):**  
   **Disaster Recovery (DR)** နှင့် Kansai ဒေသအတွက် ဖြစ်သည်။ Tokyo တွင် ကြီးမားသော ငလျင်လှုပ်ခတ်ပါက Tokyo မှ Data များကို Osaka Region သို့ Failover လုပ်နိုင်ရန် Backup Secondary Region အဖြစ် သုံးသည်။
3. **Availability Zone (AZ) တစ်ခုတည်း သုံးရင် ဘာ Risk ရှိလဲ?**  
   ထို AZ တည်ရှိရာ Data Center တွင် မီးပျက်ခြင်း၊ Hardware ပြဿနာဖြစ်ခြင်း သို့မဟုတ် Fiber Cable ပြတ်တောက်ပါက မိမိတို့ Web System တစ်ခုလုံး Down သွားမည် (Single Point of Failure - SPOF)။
4. **Multi-AZ Architecture မဖြစ်မနေ လိုအပ်ပုံ:**  
   Production Web System များတွင် အနည်းဆုံး AZ ၂ ခု (ဥပမာ- `ap-northeast-1a` နှင့် `ap-northeast-1c`) တွင် Server နှင့် Database များကို ခွဲထားရမည်။ တစ်ဖက် AZ ပျက်ကျသော်လည်း အခြားတစ်ဖက် AZ ရှိ Server များက ဆက်လက် Run နေမည် ဖြစ်သည်။

---
*နောက်အခန်းသို့ သွားရန်:* [02_Level2_IAM_VPC_EC2_EBS.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_beginner_to_advanced_real_work/02_Level2_IAM_VPC_EC2_EBS.md)
