---
title: "၁၁။ AWS SAA-C03 Exam Notes, Traps & Quiz"
description: "AWS Solutions Architect Associate (SAA-C03) EC2 စာမေးပွဲ အဓိက လှည့်ကွက်များ၊ ရွှေစည်းမျဉ်း ၈ ချက်နှင့် အဖြေရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၁၁။ AWS SAA-C03 Exam Notes, Traps & Quiz

## 🏆 SAA-C03 EC2 ရွှေစည်းမျဉ်း ၈ ချက် (Golden Rules)

1. **EBS vs Instance Store:** Server ပိတ်လိုက်သည့်အခါ (Stop) သို့မဟုတ် ရပ်တန့်သွားသည့်အခါ Data မပျောက်စေလိုပါက **Amazon EBS** ကိုသာ သုံးရမည်။ **Instance Store သည် Ephemeral (ယာယီ) ဖြစ်ပြီး Stop လုပ်ပါက Data ပျောက်သည်** (Reboot လုပ်ပါကမူ မပျောက်ပါ)။
2. **Security Group သည် Stateful ဖြစ်သည်:** Inbound ခွင့်ပြုလိုက်ပါက Outbound အတွက် စည်းမျဉ်းသီးသန့် ထပ်ရေးစရာ မလိုဘဲ အလိုအလျောက် ပွင့်သည်။
3. **Network ACL သည် Stateless ဖြစ်သည်:** Inbound ဖွင့်ရုံဖြင့် မပြီးဘဲ Outbound Return Traffic အတွက် **Ephemeral Ports (1024-65535)** ကိုပါ သီးသန့် Allow ပေးရမည်။
4. **Spot Instances:** Fault-tolerant, Batch Processing များအတွက်သာ သုံးရမည်။ AWS က ပြန်သိမ်းခါနီးတွင် **၂ မိနစ် ကြိုတင်သတိပေးချက်** ပေးသည်။ Database များအတွက် ဘယ်တော့မှ မသုံးရပါ။
5. **ASG Health Checks:** Web Application Server များအတွက် EC2 Health Check တစ်ခုတည်း သုံး၍မရပါ။ Process Crash ဖြစ်မှုကို သိရှိစေရန် **ELB Health Check** ကို ASG တွင် ဖွင့်ထားရမည်။
6. **EBS gp3 vs io2:** General Purpose လိုအပ်ချက်အတွက် `gp3` (3000 IOPS အခမဲ့) ကို သုံးပါ။ Sub-millisecond latency နှင့် Extreme High IOPS (256,000 IOPS) လိုအပ်သော Mission-critical DB အတွက်သာ `io2` ကို သုံးပါ။
7. **CloudWatch Metrics:** RAM (Memory) နှင့် Disk Space သုံးစွဲမှုများသည် Default Metric မဟုတ်ပါ။ ၎င်းတို့အတွက် **Unified CloudWatch Agent** တင်ရမည်။
8. **Unencrypted Volume ကို Encrypt လုပ်နည်း:** Snapshot ယူ → Encrypted Snapshot အဖြစ် Copy ကူး → AMI တည်ဆောက် → Instance အသစ် Launch လုပ်။

---

## ⚠️ SAA-C03 Common Exam Traps (အမေးများသော လှည့်ကွက်များ)

- **Trap 1: "အသက်သာဆုံးနည်းဖြင့် HPC (High Performance Computing) အလုပ်လုပ်ရန်"**  
  Cluster Placement Group ထဲတွင် တူညီသော Availability Zone အတွင်း EC2 များကို ထားရှိပြီး Enhanced Networking (ENA) ဖွင့်ရမည်။
- **Trap 2: "Private Subnet ရှိ EC2 မှ OS Updates များ ဒေါင်းလုဒ်ဆွဲလိုသည်"**  
  Public Subnet တွင် **NAT Gateway** ထားပြီး Private Route Table အား `0.0.0.0/0 -> nat-gateway-id` ချိန်ပေးရမည်။ (Internet Gateway ကို Private Subnet သို့ တိုက်ရိုက် ချိတ်၍မရပါ)။
- **Trap 3: "EC2 Instance တစ်ခု ပိတ်ပြီး ပြန်ဖွင့်သောအခါ Public IP ပြောင်းသွားသည်"**  
  Public IP အမြဲတမ်း တည်ငြိမ်စေလိုပါက **Elastic IP (EIP)** ချိတ်ဆက်ပေးရမည်။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz (လက်တွေ့ စာမေးပွဲ မေးခွန်းများ)

### မေးခွန်း (၁)
လုပ်ငန်းတစ်ခုသည် အင်တာနက်မှ လူများ ဝင်ရောက်ကြည့်ရှုနိုင်သော e-Commerce Web Server တစ်ခုကို EC2 ဖြင့် တည်ဆောက်ထားသည်။ အသုံးပြုသူတစ်ဦးက HTTP Port 80 ဖြင့် ဝဘ်ဆိုဒ်သို့ ဆက်သွယ်ရန် ကြိုးစားသောအခါ `Connection Timed Out` Error ရရှိနေပါသည်။ စစ်ဆေးကြည့်ရာ Internet Gateway ချိတ်ဆက်ထားပြီး Route Table လည်း မှန်ကန်နေပါသည်။ အောက်ပါတို့အနက် မည်သည့်အချက်ကြောင့် ဤပြဿနာ ဖြစ်နိုင်သနည်း?

- [ ] A) EC2 Instance တွင် Elastic IP မချိတ်ရသေးခြင်း
- [x] B) Security Group Inbound Rule တွင် Port 80 (HTTP) အား `0.0.0.0/0` သို့ ခွင့်မပြုထားခြင်း
- [ ] C) Security Group Outbound Rule တွင် Port 80 ကို ပိတ်ထားခြင်း
- [ ] D) EBS Volume ပေါ်တွင် နေရာလွတ် မကျန်တော့ခြင်း

> **ရှင်းလင်းချက်:** `Connection Timed Out` ဆိုသည်မှာ Firewall တစ်ခုခုက Packet ကို အသံတိတ် ဖျက်ချလိုက်ခြင်း (Drop) ဖြစ်ပါသည်။ Security Group Inbound တွင် Port 80 မဖွင့်ထားပါက ဤ Error ဖြစ်ပေါ်ပါသည်။ Security Group သည် Stateful ဖြစ်သဖြင့် Outbound ပိတ်ထားသော်လည်း Inbound ဖွင့်ထားပါက Response ပြန်ထွက်နိုင်သောကြောင့် (C) သည် အဖြေမှား ဖြစ်ပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် သတင်းဝက်ဘ်ဆိုဒ်တစ်ခုအတွက် Auto Scaling Group (ASG) နောက်ကွယ်တွင် EC2 Web Server များကို တည်ဆောက်ထားပါသည်။ Web Server များပေါ်ရှိ Nginx လုပ်ငန်းစဉ်သည် မကြာခဏ Crash ဖြစ်ပြီး 502 Bad Gateway ဖြစ်နေသော်လည်း Auto Scaling Group က Server အသစ်များ အစားထိုး မတည်ဆောက်ပေးဘဲ ဖြစ်နေပါသည်။ မည်သည့် ဖြေရှင်းချက်က အထိရောက်ဆုံး ဖြစ်သနည်း?

- [ ] A) CloudWatch Alarm ဖြင့် EC2 Reboot Action ပြုလုပ်ပေးရန် ချိတ်ဆက်ပါ
- [ ] B) ASG Desired Capacity ကို ၂ ဆ တိုးမြှင့်ပါ
- [x] C) Auto Scaling Group တွင် Health Check Type ကို `EC2` မှ `ELB` သို့ ပြောင်းလဲသတ်မှတ်ပါ
- [ ] D) EC2 Instance Type ကို t3 မှ c6i သို့ ပြောင်းပါ

> **ရှင်းလင်းချက်:** Default အားဖြင့် ASG သည် `EC2` Status Check ကိုသာ စစ်ဆေးသဖြင့် VM Hardware ကောင်းနေပါက Nginx Crash ဖြစ်နေသော်လည်း Healthy ဟု မှတ်ယူနေပါသည်။ Health Check Type ကို `ELB` သို့ ပြောင်းလိုက်ပါက ALB ၏ HTTP `/healthz` check မအောင်မြင်သည်နှင့် ASG က Server အဟောင်းကို ဖျက်ပြီး အသစ် အလိုအလျောက် အစားထိုးပေးပါမည်။

---

### မေးခွန်း (၃)
ဘဏ္ဍာရေး အဖွဲ့အစည်းတစ်ခုသည် Regulatory Compliance အရ ကုဒ်မဖျက်ထားသော (Unencrypted) လက်ရှိ Production EBS Root Volume တစ်ခုကို KMS Customer Managed Key (CMK) ဖြင့် Encrypted ဖြစ်အောင် ချက်ချင်း ပြောင်းလဲလိုပါသည်။ အနည်းဆုံး လုပ်ဆောင်ချက်ဖြင့် အမှန်ကန်ဆုံး ပြုလုပ်နည်းမှာ အဘယ်နည်း?

- [ ] A) AWS Console တွင် Existing Volume ကို ညာကလစ်နှိပ်၍ "Encrypt Volume" ကို ရွေးပါ
- [ ] B) EC2 ကို ရပ်ပြီး Volume အသစ်ဆောက်ကာ data များကို `rsync` ဖြင့် ကူးပါ
- [x] C) Volume ကို Snapshot ရယူပါ၊ ထို Snapshot ကို KMS Key ဖြင့် Encrypted Snapshot အဖြစ် Copy ကူးပါ၊ ထို Snapshot မှ AMI တည်ဆောက်ပြီး EC2 အသစ် Launch လုပ်ပါ
- [ ] D) Volume ကို Detach လုပ်၍ S3 သို့ Export ထုတ်ပြီး ပြန်သွင်းပါ

> **ရှင်းလင်းချက်:** AWS တွင် ရှိပြီးသား EBS Volume တစ်ခုကို In-place Encryption ပြုလုပ်၍ မရနိုင်ပါ။ Snapshot ရယူခြင်း → Encrypted Copy ကူးခြင်း → AMI တည်ဆောက်ခြင်း → Instance အသစ် Launch လုပ်ခြင်းသည် တရားဝင် AWS Standard နည်းလမ်း ဖြစ်ပါသည်။

---

### မေးခွန်း (၄)
ဒေတာ ခွဲခြမ်းစိတ်ဖြာရေး ကုမ္ပဏီတစ်ခုသည် နေ့စဉ် ညသန်းခေါင်အချိန်တွင် ၄ နာရီကြာမြင့်သော Batch Processing အလုပ်တစ်ခုကို Run လေ့ရှိပါသည်။ ဤအလုပ်သည် Server ပြတ်တောက်သွားပါက အစမှ ပြန်လည် စတင်နိုင်သော သဘောသဘာဝ (Fault-tolerant) ရှိပါသည်။ ကုန်ကျစရိတ် အသက်သာဆုံးဖြစ်မည့် EC2 Purchasing Option မှာ အဘယ်နည်း?

- [ ] A) On-Demand Instances
- [ ] B) 3-Year Reserved Instances
- [x] C) Spot Instances
- [ ] D) Dedicated Hosts

> **ရှင်းလင်းချက်:** Fault-tolerant ဖြစ်ပြီး ယာယီသာ run သည့် Batch Processing များအတွက် ၉၀% အထိ စရိတ်ချွေတာနိုင်သော **Spot Instances** သည် အကောင်းဆုံးနှင့် အသက်သာဆုံး ရွေးချယ်မှု ဖြစ်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [Amazon EC2 User Guide for Linux](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/)
- [Amazon EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/)
- [Amazon EBS Volume Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)
- [AWS Auto Scaling Groups User Guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
- [Elastic Load Balancing Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)
