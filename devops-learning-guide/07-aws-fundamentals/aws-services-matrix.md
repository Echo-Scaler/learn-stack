# ☁️ AWS Core Services Architectural Matrix for DevOps

> **AWS Core Services (၁၀) မျိုးကို ၁၀ ဆင့် စံနှုန်း (What, Why, How, When, Cost, Security, Lab, Interview) ဖြင့် အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာချက်**

---

## 🧭 ၁။ AWS IAM (Identity and Access Management)

1. **What it is**: AWS Cloud အရင်းအမြစ်များကို မည်သူက မည်သည့် အတိုင်းအတာအထိ ဝင်ရောက် သုံးစွဲခွင့်ရှိသည်ကို ထိန်းချုပ်ပေးသော ဗဟို Identity ဝန်ဆောင်မှု။
2. **What problem it solves**: လူတိုင်းကို Root Password မပေးရဘဲ သီးခြား credentials နှင့် permissions များကို စနစ်တကျ ကန့်သတ်ပေးသည်။
3. **How it works**: Users, Groups, Roles နှင့် JSON-based Policy documents များကို အခြေခံ၍ Request တိုင်းကို Authentication (AuthN) နှင့် Authorization (AuthZ) စစ်ဆေးသည်။
4. **When to use it**: AWS Account ဖွင့်လိုက်သည်နှင့် ပထမဆုံး စတင် အသုံးပြုရသည်။
5. **When not to use it**: End-user (Customer) app login အတွက် မသုံးပါ (ထိုအတွက် AWS Cognito သုံးသည်)။
6. **Real-world Example**: Developer Alice အား S3 bucket တစ်ခုတည်းသာ read-only ဖတ်ခွင့်ပေးပြီး EC2 ဖျက်ခွင့် မပေးဘဲ ကန့်သတ်ထားခြင်း။
7. **Security Considerations**: Root account တွင် MFA မဖြစ်မနေ ထည့်ပါ။ Access keys များကို ၉၀ ရက်တစ်ကြိမ် rotate လုပ်ပါ။
8. **Cost Considerations**: **၁၀၀% အခမဲ့ (Free Service)** ဖြစ်ပါသည်။
9. **Small Lab**: `ReadOnlyAccess` policy ပါဝင်သော IAM User အသစ်ဆောက်၍ Console သို့ login ဝင်ပြီး EC2 ဖန်တီး၍ မရကြောင်း စစ်ဆေးပါ။
10. **Common Interview Question**: *IAM Role နှင့် IAM User ကွာခြားချက်မှာ အဘယ်နည်း?* (Role တွင် static credentials မရှိဘဲ temporary tokens သာ ထုတ်ပေးသည်)။

---

## 🌐 ၂။ Amazon VPC (Virtual Private Cloud)

1. **What it is**: AWS Cloud ပေါ်တွင် သင့်အတွက် သီးသန့် ခွဲထုတ်ပေးထားသော Isolated Virtual Network အိမ်တော်။
2. **What problem it solves**: Server များကို အများသုံး Internet တွင် တိုက်ရိုက် မပြန့်ကျဲစေဘဲ Private IP ranges ဖြင့် လုံခြုံစွာ ကာကွယ်ပေးသည်။
3. **How it works**: CIDR block (e.g. `10.0.0.0/16`) ကို အခြေခံ၍ Subnets, Route Tables, Internet Gateway (IGW) နှင့် NAT Gateways များဖြင့် traffic flow ကို ထိန်းကျောင်းသည်။
4. **When to use it**: EC2, RDS, ECS, EKS စသည့် Infrastructure resources များ မတည်ဆောက်မီ မဖြစ်မနေ အရင်ဆုံး ဆောက်ရသည်။
5. **When not to use it**: Serverless services (DynamoDB, S3) သီးသန့်သာ သုံးပါက VPC မလိုပါ။
6. **Real-world Example**: Production VPC တွင် Public Subnet တွင် Web servers ထားပြီး Private Subnet တွင် Database ကို လုံးဝ ဝှက်ထားခြင်း။
7. **Security Considerations**: Default VPC အစား Custom VPC အသစ် ဆောက်သုံးပါ။ Subnet များအား Public/Private တိကျစွာ ခွဲပါ။
8. **Cost Considerations**: VPC ကိုယ်တိုင်သည် အခမဲ့ဖြစ်သော်လည်း **NAT Gateway ($0.045/hour ~ $32/month)** သည် ကုန်ကျစရိတ် မြင့်မားပါသည်။
9. **Small Lab**: CIDR `10.0.0.0/16` ဖြင့် Custom VPC တစ်ခု ဆောက်ပါ။
10. **Common Interview Question**: *Public Subnet နှင့် Private Subnet ကို Route Table တွင် မည်သို့ ခွဲခြားသတ်မှတ်သနည်း?* (Public Subnet တွင် `0.0.0.0/0 ➜ igw` လမ်းကြောင်း ပါဝင်သည်)။

---

## 🖥️ ၃။ Amazon EC2 (Elastic Compute Cloud)

1. **What it is**: Cloud ပေါ်တွင် လိုသလို အရွယ်အစား အတိုးအလျှော့ ပြုလုပ်နိုင်သော Virtual Servers (VMs) ဝန်ဆောင်မှု။
2. **What problem it solves**: Physical hardware ဆာဗာများ ဝယ်ယူစောင့်ဆိုင်းစရာမလိုဘဲ မိနစ်ပိုင်းအတွင်း Ubuntu/Linux server များ တည်ဆောက်နိုင်သည်။
3. **How it works**: AWS Nitro Hypervisor ပေါ်တွင် AMI (Amazon Machine Image), Instance Type (t3.micro, c5.large) နှင့် EBS Storage တို့ဖြင့် ပေါင်းစပ် run သည်။
4. **When to use it**: OS-level control အပြည့်အဝ လိုအပ်သော Monolithic apps, Legacy systems, သို့မဟုတ် Custom services များ run ရန်။
5. **When not to use it**: Event-driven short tasks များအတွက် Lambda က ပိုမို ဈေးသက်သာသည်။
6. **Real-world Example**: Laravel/Node.js application ကို Ubuntu EC2 instance ပေါ်တွင် Docker Compose ဖြင့် ပြေးဆွဲခြင်း။
7. **Security Considerations**: Port 22 (SSH) ကို `0.0.0.0/0` သို့ မဖွင့်ပါနှင့်။ AWS Systems Manager (SSM) ဖြင့် SSH-less secure access သုံးပါ။
8. **Cost Considerations**: Free Tier တွင် **t2.micro / t3.micro (750 hours/month)** အခမဲ့ ရရှိသည်။ မသုံးပါက Stop သို့မဟုတ် Terminate လုပ်ပါ။
9. **Small Lab**: Ubuntu 22.04 LTS t2.micro EC2 တစ်လုံး launch လုပ်ပြီး User Data script ဖြင့် Nginx ကို အလိုအလျောက် သွင်းယူပြသပါ။
10. **Common Interview Question**: *EBS Volume နှင့် Instance Store Volume ကွာခြားချက်မှာ အဘယ်နည်း?* (EBS သည် Network persistent disk ဖြစ်ပြီး Instance Store သည် ယာယီ Ephemeral disk ဖြစ်သည်)။

---

## 🪣 ၄။ Amazon S3 (Simple Storage Service)

1. **What it is**: ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး Scalable, 99.999999999% (11 9's) Durability ရှိသော Cloud Object Storage။
2. **What problem it solves**: Server disk များ storage ပြည့်သွားနိုင်သည့် ပြဿနာကို ဖြေရှင်းပေးပြီး ပုံများ၊ ဗီဒီယိုများ၊ Database backups များကို အကန့်အသတ်မရှိ သိမ်းနိုင်သည်။
3. **How it works**: Data များကို Flat namespace တွင် Bucket အောက်၌ Key-Value Objects အဖြစ် HTTP REST API ဖြင့် သိမ်းဆည်းသည်။
4. **When to use it**: Static Web Hosting, User media uploads, Log archives, Terraform remote state files။
5. **When not to use it**: OS Boot disk သို့မဟုတ် High-IOPS transactional database storage အဖြစ် မသုံးနိုင်ပါ (EBS သုံးရသည်)။
6. **Real-world Example**: E-commerce website မှ user profile photos များနှင့် product images များကို S3 bucket တွင် သိမ်းဆည်းခြင်း။
7. **Security Considerations**: **Block Public Access** ကို default အမြဲ ဖွင့်ထားပါ။ Private objects များကို Pre-signed URLs ဖြင့်သာ ယာယီ download ပေးပါ။
8. **Cost Considerations**: Free Tier တွင် **5GB Standard Storage** အခမဲ့ ရရှိသည်။
9. **Small Lab**: S3 bucket တစ်ခုဆောက်ပြီး AWS CLI ဖြင့် ဖိုင် upload တင်ကြည့်ပါ (`aws s3 cp file.txt s3://my-bucket/`)။
10. **Common Interview Question**: *S3 Versioning ဆိုတာဘာလဲ? အဘယ်ကြောင့် သုံးသနည်း?* (ဖိုင်ကို မတော်တဆ overwrite သို့မဟုတ် delete လုပ်မိပါက ယခင် version သို့ ပြန်ဆုတ်နိုင်စေရန် သုံးသည်)။

---

## 🗄️ ၅။ Amazon RDS (Relational Database Service)

1. **What it is**: PostgreSQL, MySQL, MariaDB စသည့် ဆက်နွှယ်ဒေတာဘေ့စ်များကို AWS မှ အလိုအလျောက် စီမံပေးသော Managed Database ဝန်ဆောင်မှု။
2. **What problem it solves**: DB installation, OS patching, automated daily backups, read replicas များနှင့် Multi-AZ failover များကို လူမပါဘဲ အလိုအလျောက် ဆောင်ရွက်ပေးသည်။
3. **How it works**: Dedicated EC2 instance ပေါ်တွင် database engine ကို run ပေးပြီး OS level access ကို ပိတ်ကာ Database Endpoint သာ ထုတ်ပေးသည်။
4. **When to use it**: Production transactional business apps (ACID compliance လိုအပ်သော စနစ်များ)။
5. **When not to use it**: Key-Value caching အတွက် Redis/ElastiCache သုံးပြီး Unstructured schema-less data အတွက် DynamoDB သုံးရမည်။
6. **Real-world Example**: Production E-commerce app အတွက် PostgreSQL Multi-AZ cluster ထားရှိပြီး Primary ကျသွားပါက Standby သို့ အလိုအလျောက် switch လုပ်စေခြင်း။
7. **Security Considerations**: **Publicly Accessible = NO** သတ်မှတ်ပါ။ Database Security Group တွင် Web Server SG မှသာ port 5432 ကို လက်ခံပါ။
8. **Cost Considerations**: Free Tier တွင် **db.t3.micro / db.t4g.micro (750 hours/month)** အခမဲ့ ရရှိသည်။ Multi-AZ သည် Free tier တွင် မပါဝင်ပါ။
9. **Small Lab**: Free tier PostgreSQL database တစ်ခု ဆောက်ပြီး EC2 မှ psql client ဖြင့် ချိတ်ဆက် စမ်းသပ်ပါ။
10. **Common Interview Question**: *RDS Multi-AZ နှင့် Read Replica ကွာခြားချက်မှာ အဘယ်နည်း?* (Multi-AZ သည် Disaster Recovery/High Availability အတွက်ဖြစ်ပြီး Read Replica သည် Read performance တိုးတက်စေရန် ဖြစ်သည်)။

---

## ⚖️ ၆။ AWS Application Load Balancer (ALB)

1. **What it is**: Layer 7 (HTTP/HTTPS) အဆင့်တွင် Traffic များကို Target EC2 instances သို့မဟုတ် Containers များဆီသို့ မျှဝေပေးသော Intelligent Load Balancer။
2. **What problem it solves**: Server တစ်လုံးတည်း ဒဏ်မခံနိုင်သော ပြဿနာကို ဖြေရှင်းပေးပြီး Zero-Downtime Rolling updates များကို အထောက်အပံ့ပေးသည်။
3. **How it works**: Listeners (Port 80/443), Rules (Path-based `/api`, Host-based) နှင့် Target Groups များကို စစ်ဆေး၍ Traffic ကို မျှဝေပို့ဆောင်သည်။
4. **When to use it**: Web Applications, Microservices, REST APIs။
5. **When not to use it**: Extreme low-latency သို့မဟုတ် Non-HTTP protocols (e.g. Gaming UDP, Raw TCP) အတွက် Network Load Balancer (NLB) သုံးရမည်။
6. **Real-world Example**: `/api/*` traffic ကို Backend servers သို့ ပို့ပြီး `/*` static traffic ကို Frontend servers သို့ ခွဲပို့ခြင်း။
7. **Security Considerations**: ALB တွင် AWS WAF (Web Application Firewall) ချိတ်ဆက်၍ SQL Injection နှင့် DDoS တိုက်ခိုက်မှုများကို ကာကွယ်ပါ။
8. **Cost Considerations**: ALB သည် Free Tier တွင် အမြဲ အခမဲ့ မဟုတ်ပါ (နာရီအလိုက် ~$0.0225/hr ကျသင့်သဖြင့် စမ်းသပ်ပြီးပါက delete လုပ်ပါ)။
9. **Small Lab**: Target Group တစ်ခုဆောက်ပြီး EC2 instances ၂ လုံးကို ALB နောက်ကွယ်တွင် ချိတ်ဆက်၍ traffic မျှဝေမှုကို စမ်းသပ်ပါ။
10. **Common Interview Question**: *ALB Health Check အလုပ်လုပ်ပုံကို ရှင်းပြပါ။* (သတ်မှတ်ထားသော path ဥပမာ `/healthz` သို့ HTTP request ပို့၍ 200 OK မရပါက အဆိုပါ instance ကို Unhealthy သတ်မှတ်ပြီး traffic မပို့တော့ပါ)။

---

## 📊 ၇။ Amazon CloudWatch (Metrics, Logs, Alarms)

1. **What it is**: AWS Cloud အရင်းအမြစ်များနှင့် Application များ၏ ကျန်းမာရေးကို Real-time စောင့်ကြည့် စစ်ဆေးပေးသော Monitoring & Observability Service။
2. **What problem it solves**: Server CPU တက်ခြင်း၊ Disk ပြည့်ခြင်း၊ Database connection များပြားခြင်းတို့ကို မသိရှိဘဲ outage ဖြစ်သွားခြင်းမှ ကာကွယ်ပေးသည်။
3. **How it works**: AWS Services များထံမှ Metrics များကို အလိုအလျောက် စုဆောင်းပြီး CloudWatch Agent ဖြင့် Server logs များကို log groups ထဲသို့ သိမ်းဆည်းသည်။
4. **When to use it**: Server health metrics, Billing alarms, Auto-scaling trigger metrics, Container logs။
5. **When not to use it**: Complex APM tracing အတွက် Datadog သို့မဟုတ် Grafana/Prometheus တို့နှင့် ပေါင်းစပ် သုံးတတ်သည်။
6. **Real-world Example**: Production Web EC2 တွင် CPU > 80% ဆက်တိုက် ၅ မိနစ် ဖြစ်ပါက DevOps team ၏ Email/Slack သို့ SNS မှတဆင့် ချက်ချင်း Alert ပို့စေခြင်း။
7. **Security Considerations**: CloudWatch Logs များကို KMS ဖြင့် encrypt လုပ်ထားပြီး Retention Policy (e.g. 30 days) သတ်မှတ်ပါ။
8. **Cost Considerations**: Basic metrics အခမဲ့ ရရှိသော်လည်း Custom Metrics နှင့် Log Ingestion ပမာဏ များပြားပါက ကုန်ကျစရိတ် တက်နိုင်သည်။
9. **Small Lab**: Estimated Charges > $1.00 ဖြစ်ပါက Email သို့ သတိပေးချက် လာမည့် Billing Alarm တစ်ခု တည်ဆောက်ပါ။
10. **Common Interview Question**: *CloudWatch Metric တွင် Basic Monitoring နှင့် Detailed Monitoring ကွာခြားချက်မှာ အဘယ်နည်း?* (Basic သည် 5-minute interval ဖြစ်ပြီး Detailed သည် 1-minute interval ဖြစ်သည်)။
