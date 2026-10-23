---
title: "AWS Auto Scaling — Complete Master Architectural Guide"
description: "AWS Auto Scaling — Automatically adjusts compute capacity to maintain performance and lower costs ကို မြန်မာလို အခြေခံမှ စတင်၍ Launch Templates, Scaling Policies, Lifecycle Hooks နှင့် SAA-C03 Guide"
---

# 8. Auto Scaling — Automatically Adjusts Compute Capacity
### Dynamic Scaling, High Availability, Self-Healing & Cost Optimization Framework

AWS Auto Scaling သည် Application များ၏ Traffic အတက်အကျအပေါ် မူတည်၍ တွက်ချက်မှု စွမ်းရည် (EC2 Instances, ECS Tasks, DynamoDB RCU/WCU) ကို **အလိုအလျောက် တိုးမြှင့်ခြင်း (Scale-Out) နှင့် လျှော့ချခြင်း (Scale-In)** ပြုလုပ်ပေးသော **AWS မဏ္ဍိုင် Elasticity ဝန်ဆောင်မှု** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

လုပ်ငန်းများတွင် အသုံးပြုသူ များပြားချိန် (ဥပမာ- ညနေ ၇ နာရီမှ ၁၀ နာရီအတွင်း) ဆာဗာများ ဝန်ပိပြီး ပျက်ကျသွားခြင်းကို ကာကွယ်ရန် ဆာဗာ အများအပြား အမြဲတမ်း ဖွင့်ထားပါက လူမရှိသော ညသန်းခေါင်နှင့် နံနက်ခင်းများတွင် မလိုအပ်ဘဲ Cloud ကုန်ကျစရိတ် အဆမတန် ကုန်ကျနေမည် ဖြစ်သည်။

**AWS Auto Scaling ၏ အဓိက ရည်ရွယ်ချက်:**  
Traffic များလာပါက ဆာဗာများကို အလိုအလျောက် ချက်ချင်း တိုးချဲ့ပေးပြီး၊ Traffic ပြန်နည်းသွားပါက ပိုနေသော ဆာဗာများကို အလိုအလျောက် ပြန်လည် ပိတ်သိမ်းပေးခြင်းဖြင့် **High Availability ကို ထိန်းသိမ်းကာ ကုန်ကျစရိတ်ကို အသက်သာဆုံးဖြစ်အောင် အလိုအလျောက် စီမံပေးရန်** ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Launch Template (LT)** | Instance Blueprint | EC2 launch ရန် လိုအပ်သော AMI, Instance Type, Key Pair, Security Groups, User Data Script များကို Versioning ဖြင့် သိမ်းဆည်းထားသော Blueprint ဖြစ်သည်။ (Launch Config အဟောင်းကို အစားထိုးသည်)။ |
| **Auto Scaling Group (ASG)** | Management Container | ဆာဗာ အရေအတွက်ကို စီမံသော အဓိက Container ဖြစ်သည်။ **Minimum Size** (အနည်းဆုံး ရှိရမည့် အရေအတွက်), **Maximum Size** (အများဆုံး တိုးခွင့်), **Desired Capacity** (လက်ရှိ အလိုရှိသော အရေအတွက်) တို့ ပါဝင်သည်။ |
| **Scaling Policies** | Trigger Rules | မည်သည့်အချိန်တွင် ဆာဗာတိုးမည်/လျှော့မည်ကို ဆုံးဖြတ်သော မူဝါဒများ (Target Tracking, Step, Scheduled, Predictive)။ |
| **Lifecycle Hooks** | Custom Scripts on State | ဆာဗာ အသစ်စတင်ချိန် (Pending:Wait) သို့မဟုတ် ဖျက်ပစ်ခါနီး (Terminating:Wait) တွင် ဒေတာ အရန်သိမ်းခြင်း သို့မဟုတ် Log ထုတ်ယူခြင်း စသည့် Scripts များကို စောင့်ဆိုင်း run စေခြင်း။ |
| **Instance Refresh** | Rolling Deployment | Launch Template အသစ်ထွက်လာပါက ဆာဗာအဟောင်းများကို တစ်လုံးချင်းစီ အလိုအလျောက် Zero-downtime ဖြင့် အသစ်လဲလှယ်ပေးခြင်း။ |
| **Self-Healing Replacement** | Health Check Recovery | EC2 ဆာဗာတစ်ခု Crash ဖြစ်သွားပါက ထိုစက်ကို အလိုအလျောက် ဖျက်ပြီး တူညီသော စက်အသစ်တစ်လုံး ချက်ချင်း အစားထိုး launch လုပ်ပေးသည်။ |

---

## 3. Architecture (Diagram & Elastic Scaling Flow)

ALB နှင့် တွဲဖက်ထားသော Multi-AZ Auto Scaling Architecture Flow:

```
                            [ Varying User Traffic ]
                                        │
                                        ▼ (Port 443 HTTPS)
┌───────────────────────────────────────┼────────────────────────────────────────┐
│ Amazon Application Load Balancer      │                                        │
│ (Evaluates Request Count / Latency)   │                                        │
└───────────────────────────────────────┼────────────────────────────────────────┘
                                        │
       ┌────────────────────────────────┼────────────────────────────────┐
       ▼                                ▼                                ▼
┌───────────────────────────────┬────────────────────────────────┬───────────────┐
│ Availability Zone A           │ Availability Zone B            │ Availability C│
│                               │                                │               │
│  [ EC2 Instance #1 ]          │  [ EC2 Instance #2 ]           │ [ EC2 Inst #3]│
│  (Healthy In-Service)         │  (Healthy In-Service)          │ (Healthy)     │
│                               │                                │               │
│  ┌─────────────────────────┐  │  ┌──────────────────────────┐  │               │
│  │ New Auto-Scaled Inst #4 │  │  │ New Auto-Scaled Inst #5  │  │               │
│  │ (Spike: Scale-Out)      │  │  │ (Spike: Scale-Out)       │  │               │
│  └─────────────────────────┘  │  └──────────────────────────┘  │               │
└───────────────────────────────┴────────────────────────────────┴───────────────┘
                                        ▲
                                        │ (Target Tracking: Keep CPU at 60%)
                         [ AWS Auto Scaling Controller ]
```

---

## 4. How it works (Scaling Policies ၄ မျိုး နှိုင်းယှဉ်ချက်)

AWS Auto Scaling တွင် အသုံးပြုနိုင်သော Scaling Policies များ (SAA-C03 Core):

| Scaling Policy | နာမည် | ဘယ်လို အလုပ်လုပ်သလဲ (Mechanism) | အသင့်တော်ဆုံး အခြေအနေ |
| :--- | :--- | :--- | :--- |
| **Target Tracking** | ပစ်မှတ်တန်ဖိုး ထိန်းညှိခြင်း | **အကြံပြုဆုံး Default နည်းလမ်း။** Thermostat ကဲ့သို့ ဥပမာ `ASG Average CPU = 60%` ဟု သတ်မှတ်ထားပါက AWS က ဆာဗာကို အလိုအလျောက် တိုး/လျှော့ လုပ်ပေးသည်။ | CPU, ALB Request Count per target အလိုက် ထိန်းလိုသောအခါ |
| **Step Scaling** | အဆင့်လိုက် တိုးမြှင့်ခြင်း | CloudWatch Alarm အပေါ် မူတည်၍ CPU 70% ကျော်ပါက +1 စက်၊ CPU 90% ကျော်ပါက +3 စက် စသည်ဖြင့် အဆင့်လိုက် တိုးသည်။ | ရုတ်တရက် ဝန်တက်လာမှုများကို ချက်ချင်း အဆင့်လိုက် တုံ့ပြန်ရန် |
| **Scheduled Scaling** | အချိန်ဇယား အလိုက် | နေ့ရက်နှင့် အချိန်ကို ကြိုတင်သတ်မှတ်ခြင်း (ဥပမာ- တနင်္လာနေ့ မနက် ၉ နာရီတွင် Desired Capacity ကို 10 စက် ပြောင်းမည်)။ | ပုံမှန် ရုံးတက်ချိန် သို့မဟုတ် ကြိုတင်ကြေညာထားသော Black Friday အရောင်းပွဲ |
| **Predictive Scaling** | AI ဖြင့် ကြိုတင်ခန့်မှန်းခြင်း | Machine Learning ဖြင့် လွန်ခဲ့သော ရက်သတ္တပတ်များ၏ Traffic ပုံစံကို လေ့လာပြီး Traffic မတက်မီ မိနစ်ပိုင်း ကြိုတင်၍ ဆာဗာများကို အသင့် launch လုပ်ထားပေးသည်။ | နေ့စဉ် ပုံမှန် ထပ်ခါတလဲလဲ ဖြစ်ပေါ်သော Cyclic Traffic Workloads |

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Unpredictable Web Workloads:** ရုတ်တရက် Viral ဖြစ်သွားသော သတင်းဝဘ်ဆိုက်များ ပျက်မကျစေရန် အလိုအလျောက် ဆာဗာ တိုးချဲ့ခြင်း။
- **Cost Reduction with Spot Instances:** Launch Template တွင် **On-Demand ၃၀% နှင့် Spot ၇၀%** ရောနှောအသုံးပြု၍ Infrastructure ကုန်ကျစရိတ်ကို ၇၀% အထိ လျှော့ချခြင်း။
- **Self-Healing Fleet:** ဆာဗာတစ်ခု ဟာ့ဒ်ဝဲ ချို့ယွင်းပါက မည်သူမှ Manual ဝင်ပြင်စရာမလိုဘဲ အသစ် အလိုအလျောက် အစားထိုးခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- **100% Free Service:** Auto Scaling ဝန်ဆောင်မှုအတွက် ထပ်ဆောင်းစရိတ် မရှိပါ (Run ထားသော EC2 စက်များအတွက်သာ ပေးရသည်)။
- Multi-AZ Balancing (Availability Zones များကြားတွင် ဆာဗာအရေအတွက်ကို အမြဲတမ်း ညီတူမျှတူ ဖြန့်ခွဲပေးသည်)။
- Predictive Scaling ဖြင့် Cold Start နှောင့်နှေးမှုကို ကြိုတင် ဖြေရှင်းနိုင်ခြင်း။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- Cooldown Period သို့မဟုတ် Warm-up Time စနစ်တကျ မသတ်မှတ်ပါက ဆာဗာများ ခဏခဏ တိုးလိုက် လျှော့လိုက် (Flapping) ဖြစ်ပေါ်နိုင်သည်။

---

## 7. Comparison: Launch Template vs Launch Configuration

| Feature | Launch Template (LT) | Launch Configuration (LC) |
| :--- | :--- | :--- |
| **Status** | **Current Generation (အမြဲတမ်း သုံးရမည်)** | **Deprecated (အသုံးမပြုသင့်တော့ပါ)** |
| **Versioning** | **Yes (v1, v2 စသည်ဖြင့် Version ထိန်းနိုင်သည်)** | No (Immutable - ပြင်၍မရပါ) |
| **Instance Types Mix** | **Spot & On-Demand ရောနှောသုံးနိုင်သည်** | Single Instance Type သာ ရသည် |
| **T2/T3 Unlimited** | ရရှိသည် | မရပါ |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Launch Template အသစ် ဆောက်လုပ်ခြင်း
```bash
aws ec2 create-launch-template \
    --launch-template-name "prod-web-template" \
    --version-description "v1 production" \
    --launch-template-data '{
        "ImageId": "ami-0c55b159cbfafe1f0",
        "InstanceType": "t3.medium",
        "SecurityGroupIds": ["sg-0123456789abcdef0"]
    }'
```

### Step 2: Auto Scaling Group တည်ဆောက်ခြင်း
```bash
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name "prod-web-asg" \
    --launch-template LaunchTemplateName="prod-web-template",Version="1" \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 2 \
    --vpc-zone-identifier "subnet-0123456789,subnet-0987654321" \
    --target-group-arns "arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-web/12345"
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** IAM Roles in Launch Template, Security Group isolation, Instance Metadata Service Version 2 (IMDSv2 Enforce)။
- **Monitoring:** CloudWatch ASG Metrics (`GroupMinSize`, `GroupMaxSize`, `GroupDesiredCapacity`, `GroupInServiceInstances`)။
- **Default Termination Policy:** ဆာဗာ လျှော့ချချိန်တွင် မည်သည့်စက်ကို အရင်ဖျက်မည်နည်း:
  1. ဆာဗာ အများဆုံးရှိနေသော AZ ကို အရင်ရွေးသည်။
  2. ထို AZ အတွင်းရှိ ရှေးအကျဆုံး Launch Template/Configuration ဖြင့် run ထားသော စက်ကို ရွေးသည်။
  3. နောက်ထပ် နာရီပိုင်း ကုန်ဆုံးခါနီးစက်ကို အရင်ဖျက်သည်။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Target Tracking Policy:** စာမေးပွဲတွင် "Automatically scale EC2 instances to keep average aggregate CPU utilization at 50%" ဟု ပါလာပါက အဖြေမှန်သည် အမြဲတမ်း **Target Tracking Scaling Policy** ဖြစ်ပါသည်။
> 2. **Lifecycle Hooks:** ဆာဗာ မဖျက်ပစ်မီ (Terminating state) အတွင်း Application data များကို S3 သို့ backup လုပ်ရန် အချိန်ရယူလိုပါက **ASG Lifecycle Hook (`autoscaling:EC2_INSTANCE_TERMINATING`)** ကို သုံးရမည်။
> 3. **Launch Template vs Launch Config:** အဖြေတွင် Launch Configuration ပါက အမြဲတမ်း မှားယွင်းပြီး **Launch Template** သာ အမှန်ဖြစ်ပါသည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
ဝဘ်ဆာဗာ Cluster တစ်ခုသည် Auto Scaling Group တွင် အလုပ်လုပ်နေသည်။ နေ့စဉ် နေ့လယ် ၁၂ နာရီမှ ၁ နာရီအတွင်း သုံးစွဲသူများ ထမင်းစားချိန် အော်ဒါမှာယူမှုကြောင့် Traffic အလွန်များပြားပြီး ဆာဗာသစ်များ launch လုပ်ရန် စောင့်ဆိုင်းနေစဉ် ကနဦးမိနစ်များတွင် ဝဘ်ဆိုက် တုံ့ပြန်မှု နှေးကွေးသွားတတ်သည်။ ဤအချိန်ဇယားအတိုင်း ကြိုတင်သိရှိထားသော Traffic အတွက် အကောင်းဆုံး Solution မှာ အဘယ်နည်း?

- A) Simple Scaling Policy ဖြင့် CPU ကို စောင့်ကြည့်မည်။
- B) Scheduled Scaling Policy ဖြင့် နေ့လယ် ၁၁:၄၅ နာရီတွင် Desired Capacity ကို ကြိုတင် တိုးမြှင့်ထားမည်။
- C) EC2 Instance Type ကို အမြဲတမ်း အကြီးဆုံးစက်ဖြင့် ထားမည်။
- D) CloudFront Cache ကို ပိတ်မည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** နေ့ရက်နှင့် အချိန် အတိအကျ ကြိုတင်သိရှိထားသော ပုံမှန် Traffic များအတွက် **Scheduled Scaling Policy** ဖြင့် Traffic မတက်မီ မိနစ်ပိုင်း ကြိုတင်၍ ဆာဗာများကို အသင့်တိုးချဲ့ထားခြင်းသည် အကောင်းဆုံး နည်းလမ်း ဖြစ်ပါသည်။
</details>
