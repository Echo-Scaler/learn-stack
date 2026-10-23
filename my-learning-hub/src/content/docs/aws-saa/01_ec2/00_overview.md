---
title: "AWS EC2 SAA Course — Feature Titles & Usage Overview"
description: "Amazon EC2 ကို AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Production Deployment တွင် ကျွမ်းကျင်စွာ အသုံးချနိုင်ရန် အခြေခံမှ လက်တွေ့အထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# AWS EC2 ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ ရှင်းပြမယ်
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Production Infrastructure လမ်းညွှန်

Amazon EC2 (Elastic Compute Cloud) သည် AWS ၏ အခြေခံအကျဆုံးနှင့် လူသုံးအများဆုံး Infrastructure as a Service (IaaS) Virtual Server ဝန်ဆောင်မှု ဖြစ်ပါသည်။ EC2 ကို AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ အလုပ်ခွင်တွင် ပိုင်နိုင်စွာ အသုံးချနိုင်စေရန် အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ လက်တွေ့ အသုံးချပုံ (Usages) များကို အစဉ်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ Amazon EC2 ဆိုတာဘာလဲ & Architecture**](/aws-saa/01_ec2/01_what_is_ec2_and_architecture/) | IaaS, Nitro System, Hypervisor, Request Flow, Use Cases | On-Premises Server များအစား AWS Cloud ပေါ်တွင် Virtual Server များ ချက်ချင်း တည်ဆောက်၍ Web App များ လွှင့်တင်ခြင်း |
| **02** | [**၂။ Key Components များ & Instance Lifecycle**](/aws-saa/01_ec2/02_key_components_and_lifecycle/) | AMI, Instance Types, vCPU/RAM, Key Pairs, User Data, IAM, Lifecycle States | Server Blueprint ရွေးချယ်ခြင်း၊ စတင်ချိန်တွင် Script ဖြင့် Auto-configure လုပ်ခြင်းနှင့် Reboot/Stop/Terminate သဘောတရားများ |
| **03** | [**၃။ Purchasing Options & Cost Optimization**](/aws-saa/01_ec2/03_purchasing_options_and_cost/) | On-Demand, Spot, Reserved Instances (RI), Savings Plans, Dedicated Hosts | စရိတ်သက်သာစေရန် 24/7 Workload အတွက် Savings Plans သုံးခြင်းနှင့် Batch Job များအတွက် Spot Instances ဖြင့် ၉၀% အထိ လျှော့ချခြင်း |
| **04** | [**၄။ Networking & VPC Integration**](/aws-saa/01_ec2/04_networking_and_vpc_integration/) | VPC, Public/Private Subnets, IGW, NAT Gateway, EIP, ENI, SG vs NACL | Database Server များကို Private Subnet တွင် လုံခြုံစွာထားရှိပြီး Public Web Server မှတစ်ဆင့်သာ ဆက်သွယ်ခွင့်ပြုခြင်း |
| **05** | [**၅။ Storage စနစ်များ (EBS, Instance Store & EFS)**](/aws-saa/01_ec2/05_storage_ebs_instance_store_efs/) | EBS (gp3, io2, st1), Snapshots, Encryption, Instance Store, EFS | Persistent Data အတွက် EBS Volume ချိတ်ဆက်ခြင်း၊ Backup အတွက် Snapshots ရယူခြင်းနှင့် Shared Filesystem အတွက် EFS သုံးခြင်း |
| **06** | [**၆။ Hands-on Lab: Web App Deployment**](/aws-saa/01_ec2/06_hands_on_lab_web_app_deployment/) | Session Manager, SSH, Nginx Web Server, AWS CLI line-by-line, Cleanup | Console နှင့် CLI ဖြင့် EC2 Instance တည်ဆောက်ခြင်း၊ Nginx တင်ခြင်း၊ Sample Web App စမ်းသပ်ခြင်းနှင့် ကုန်ကျစရိတ် ကာကွယ်ရန် Resource ဖျက်ခြင်း |
| **07** | [**၇။ High Availability, ASG & ALB**](/aws-saa/01_ec2/07_high_availability_asg_alb/) | Auto Scaling Groups (ASG), Application Load Balancer, Target Groups, Multi-AZ | Traffic များလာပါက Server အလိုအလျောက် တိုးပေးခြင်း (Scaling) နှင့် Data Center ပျက်ကျသော်လည်း မပြတ်တောက်စေသည့် Multi-AZ စနစ် |
| **08** | [**၈။ Security Best Practices & Monitoring**](/aws-saa/01_ec2/08_security_and_monitoring/) | IMDSv2, Least Privilege IAM, CloudWatch Metrics/Alarms, CloudTrail | SSRF တိုက်ခိုက်မှု ကာကွယ်ရန် IMDSv2 သုံးခြင်း၊ Hardcoded Key မသုံးဘဲ IAM Role သုံးခြင်းနှင့် CPU မြင့်ပါက Auto-alert ပေးခြင်း |
| **09** | [**၉။ Troubleshooting & Common Errors**](/aws-saa/01_ec2/09_troubleshooting_and_common_errors/) | SSH Failures, HTTP 403/502/503, Security Group Traps, Disk Full, High CPU | လုပ်ငန်းခွင်တွင် နေ့စဉ်ကြုံတွေ့ရတတ်သော Error များကို စနစ်တကျ Debugging ပြုလုပ်နည်းနှင့် Runbook ဖြေရှင်းချက်များ |
| **10** | [**၁၀။ Service Comparisons & Production Architectures**](/aws-saa/01_ec2/10_service_comparisons_and_production_architectures/) | EC2 vs Lambda / ECS / EKS / Beanstalk / Lightsail, Production Design | Workload အလိုက် EC2 ကို မည်သည့်အခါတွင် သုံးသင့်ပြီး မည်သည့်အခါတွင် Containers သို့မဟုတ် Serverless သို့ ပြောင်းသင့်ကြောင်း နှိုင်းယှဉ်ချက် |
| **11** | [**၁၁။ AWS SAA-C03 Exam Notes, Traps & Quiz**](/aws-saa/01_ec2/11_saa_c03_exam_notes_traps_and_quiz/) | SAA-C03 Exam Tips, Common Traps, Scenario-based Practice Questions | စာမေးပွဲတွင် မကြာခဏ ထွက်လေ့ရှိသော လှည့်ကွက်များနှင့် အသေးစိတ် ရှင်းလင်းချက်ပါဝင်သည့် Interactive စာမေးပွဲလေ့ကျင့်ခန်း |
