---
title: "၂။ Lightsail vs EC2 & SAA-C03 Quiz"
description: "Amazon Lightsail vs Amazon EC2 နှိုင်းယှဉ်ချက်၊ Upgrade to EC2 Export Feature၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၂။ Lightsail vs EC2 & SAA-C03 Quiz

## Amazon Lightsail vs Amazon EC2 နှိုင်းယှဉ်ချက်

| အချက်အလက် | Amazon Lightsail | Amazon EC2 |
| :--- | :--- | :--- |
| **ရည်ရွယ်ချက်** | ရိုးရှင်းသော ဝဘ်ဆိုဒ်များ၊ Dev စမ်းသပ်ခြင်း၊ Small Apps | အကြီးစား Enterprise Apps၊ Custom Networking၊ High Performance |
| **စရိတ်တွက်ချက်ပုံ** | **လစဉ် ပုံသေနှုန်းထား ($3.50/mo မှစတင်သည်)** | စက္ကန့်/နာရီအလိုက် (Compute, EBS, Bandwidth သီးခြားစီကျသင့်သည်) |
| **Data Transfer** | **လစဉ် Allowance (1TB ~ 5TB) အခမဲ့ ပါဝင်ပြီးသား** | Outbound Data Transfer အားလုံးအတွက် GB အလိုက် ပေးဆောင်ရသည် |
| **ရှုပ်ထွေးမှု** | **အလွန်ရိုးရှင်းသည်** (VPC, Subnet, Route Table မလိုပါ) | အဆင့်မြင့် VPC, Security Group, Route Table များကို ကိုယ်တိုင်စီမံရသည် |
| **Scaling** | Manual vertical scaling သာ ရသည် | **Auto Scaling Groups (ASG) ဖြင့် အလိုအလျောက် ပွားများနိုင်သည်** |
| **အဆင့်မြင့် Features** | ရိုးရှင်းသော Load Balancer နှင့် Managed DB သာ ရသည် | Spot, Savings Plans, Placement Groups, Nitro System, GPU Instances |

---

## 🚀 "Upgrade to EC2" (Lightsail မှ EC2 သို့ ကူးပြောင်းခြင်း)

Lightsail ဖြင့် စတင်တည်ဆောက်ခဲ့သော ဝဘ်ဆိုဒ်တစ်ခုသည် လုပ်ငန်းကြီးထွားလာပြီး Auto Scaling, Multi-AZ သို့မဟုတ် အဆင့်မြင့် AWS Features များ လိုအပ်လာပါက အစမှ ပြန်ဆောက်စရာမလိုပါ:

1. Lightsail Console တွင် Instance ၏ **Snapshot** ကို ရယူပါ။
2. Snapshot မီနူးတွင် **"Export to Amazon EC2"** ကို နှိပ်ပါ။
3. AWS က ထို Snapshot ကို **Amazon EC2 AMI** အဖြစ်သို့ အလိုအလျောက် ပြောင်းလဲပေးမည် ဖြစ်ပြီး၊ ထို AMI မှတစ်ဆင့် Enterprise-grade EC2 Instance အဖြစ်သို့ အလွယ်တကူ Upgrade ပြုလုပ်နိုင်ပါသည်။

---

## 🏆 SAA-C03 Lightsail ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **"Predictable Monthly Budget / Lowest Complexity":**  
   စာမေးပွဲတွင် "WordPress ဝဘ်ဆိုဒ်တစ်ခုကို အနိမ့်ဆုံး စီမံခန့်ခွဲမှုနှင့် လစဉ် ဘတ်ဂျက် ပုံသေ ခန့်မှန်းနိုင်သော စရိတ်ဖြင့် လွှင့်တင်လိုသည်" ဟု မေးပါက **အဖြေမှန်သည် Amazon Lightsail** ဖြစ်ပါသည်။
2. **"Growing beyond Lightsail":**  
   Lightsail စွမ်းအားထက် ကျော်လွန်လာပါက EC2 သို့ မည်သို့ ပြောင်းရွှေ့ရမည်နည်းဟု မေးပါက **"Export snapshot to Amazon EC2"** ဖြစ်ပါသည်။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
အသေးစား စာအုပ်ဆိုင်ပိုင်ရှင်တစ်ဦးသည် WordPress ဖြင့် Online Shop တစ်ခု တည်ဆောက်လိုပါသည်။ ၎င်းတွင် Cloud Networking နှင့် Infrastructure စီမံခန့်ခွဲမည့် နည်းပညာရှင် မရှိဘဲ၊ လစဉ် ကုန်ကျစရိတ်ကိုလည်း အတိအကျ ကြိုတင် ခန့်မှန်းနိုင်သော ပုံသေနှုန်းထားဖြင့်သာ သုံးစွဲလိုပါသည်။ အသင့်တော်ဆုံး AWS ဝန်ဆောင်မှုမှာ အဘယ်နည်း?

- [ ] A) Amazon EC2 တွင် Auto Scaling Group ဖြင့် Nginx နှင့် WordPress ကိုယ်တိုင် တင်ခြင်း
- [ ] B) Amazon EKS Cluster တည်ဆောက်ခြင်း
- [x] C) Amazon Lightsail တွင် 1-Click WordPress Blueprint ဖြင့် VPS တစ်လုံး တည်ဆောက်ခြင်း
- [ ] D) AWS Lambda နှင့် API Gateway ဖြင့် Serverless WordPress လုပ်ဆောင်ခြင်း

> **ရှင်းလင်းချက်:** **Amazon Lightsail** သည် ပုံသေလစဉ်နှုန်းထား ($3.50/mo မှစသည်) ပါရှိပြီး 1-click WordPress blueprint ဖြင့် နည်းပညာဗဟုသုတ နည်းပါးသူများပင် အလွယ်တကူ လွှင့်တင်နိုင်သောကြောင့် အကောင်းဆုံး ရွေးချယ်မှု ဖြစ်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [Amazon Lightsail Documentation](https://docs.aws.amazon.com/lightsail/)
- [Exporting a Lightsail snapshot to Amazon EC2](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-exporting-snapshots.html)
- [Amazon Lightsail Pricing](https://aws.amazon.com/lightsail/pricing/)
