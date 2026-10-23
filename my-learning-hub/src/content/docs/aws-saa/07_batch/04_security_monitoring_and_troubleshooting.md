---
title: "၄။ Security, Monitoring & Troubleshooting"
description: "AWS Batch IAM Roles ၄ ခု၊ CloudWatch Metrics၊ EventBridge Alerts၊ Jobs Stuck in RUNNABLE ဖြေရှင်းနည်းနှင့် Container Exit Codes"
---

# ၄။ Security, Monitoring & Troubleshooting

## AWS Batch IAM Roles ၄ မျိုး (ဘယ်သူက ဘာလုပ်သလဲ?)

AWS Batch တွင် Security ခွဲခြားမှုကို အောက်ပါအတိုင်း ၄ ဆင့် စီမံထားပါသည်:

1. **Batch Service Role (`AWSBatchServiceRole`):** AWS Batch က သင်၏အကောင့်အတွင်း EC2 Instances များနှင့် Auto Scaling Groups များကို ဆောက်ခွင့်/ဖျက်ခွင့် ရရှိစေသော Role ဖြစ်သည်။
2. **Instance Role:** Managed Compute Environment ရှိ EC2 Host များက ECS Cluster နှင့် ချိတ်ဆက်ရန် သုံးသော Role ဖြစ်သည်။
3. **Job Execution Role:** ECS Agent က ECR မှ Docker Image ကို ဆွဲယူရန်နှင့် CloudWatch သို့ Log ပို့ရန် သုံးသည်။
4. **Job Role (Application Role):** Container အတွင်းရှိ သင့် Code က S3 Bucket သို့ ဒေတာရေးရန် သို့မဟုတ် DynamoDB ခေါ်ယူရန် သုံးသော Role ဖြစ်သည်။

---

## ⚠️ Troubleshooting: အလုပ်သည် `RUNNABLE` တွင် အဘယ်ကြောင့် ပိတ်မိနေသနည်း?

AWS Batch အင်ဂျင်နီယာများ အများဆုံး တွေ့ကြုံရသည့် ပြဿနာမှာ Job သည် `RUNNING` မဖြစ်ဘဲ `RUNNABLE` အဆင့်တွင် နာရီပေါင်းများစွာ ပိတ်မိနေခြင်း ဖြစ်ပါသည်:

```
[ Problem Scenario ]
Job Status: RUNNABLE (အလုပ်စတင်၍ မရဖြစ်နေသည်)
```

### ဖြစ်နိုင်ခြေရှိသော အကြောင်းအရင်း ၄ ချက်နှင့် ဖြေရှင်းနည်း:
1. **Compute Environment ၏ `maxvCpus` သည် `0` ဖြစ်နေခြင်း:**  
   `maxvCpus` အား လုံလောက်သော ပမာဏ (ဥပမာ- 64 သို့မဟုတ် 128) ထားရှိထားခြင်း ရှိမရှိ စစ်ဆေးပါ။
2. **Private Subnet တွင် Internet ထွက်မရခြင်း:**  
   EC2 Host များက ECS Control Plane နှင့် ECR ကို မဆက်သွယ်နိုင်ပါက Job မစတင်နိုင်ပါ။ Subnet တွင် **NAT Gateway** သို့မဟုတ် **VPC Endpoints** ချိတ်ထားရပါမည်။
3. **Job Definition ရှိ vCPU/Memory က Node ထက် ပိုကြီးနေခြင်း:**  
   ဥပမာ- Job က 16 vCPU တောင်းထားသော်လည်း Compute Environment တွင် `t3.medium` (2 vCPU) သာ ခွင့်ပြုထားပါက မည်သည့်အခါမျှ အလုပ်မဖြစ်နိုင်ပါ။
4. **Spot Instance Capacity မရရှိခြင်း:**  
   သတ်မှတ်ထားသော AZ တွင် ထို Instance Type အတွက် Spot Capacity မရှိပါက `BEST_FIT_PROGRESSIVE` သို့မဟုတ် `SPOT_CAPACITY_OPTIMIZED` Allocation Strategy သို့ ပြောင်းလဲပေးပါ။

---

## Container Exit Codes အဓိပ္ပာယ်များ

- **Exit Code 0:** အလုပ် အောင်မြင်စွာ ပြီးဆုံးသည် (SUCCEEDED)။
- **Exit Code 1:** Application Code အတွင်း Syntax သို့မဟုတ် Logic Exception တက်သွားခြင်း။
- **Exit Code 137 (OOM Killer):** Container က ၎င်းအား ခွင့်ပြုထားသော Memory Limit ထက် ကျော်လွန်သုံးစွဲသဖြင့် Linux Kernel က သတ်ပစ်လိုက်ခြင်း ဖြစ်သည်။ (Job Definition တွင် RAM ပိုတိုးပေးရမည်)။
- **Exit Code 139:** C/C++ သို့မဟုတ် Memory Allocation ဆိုင်ရာ Segmentation Fault ဖြစ်ပွားခြင်း။
