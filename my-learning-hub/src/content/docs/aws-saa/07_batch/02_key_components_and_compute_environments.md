---
title: "၂။ Components & Compute Environments"
description: "AWS Batch အဓိက အစိတ်အပိုင်း ၄ ခု (Job, Definition, Queue, Compute Environment), Array Jobs, Dependencies နှင့် Job States ဘဝသံသရာ"
---

# ၂။ Components & Compute Environments

## AWS Batch အဓိက အစိတ်အပိုင်း ၄ ခု

1. **Job:** သင် မောင်းနှင်လိုသော သီးခြား အလုပ်တစ်ခု (Linux Command သို့မဟုတ် Docker Container Script) ဖြစ်သည်။
2. **Job Definition:** အလုပ်၏ Blueprint ပုံစံခွက် ဖြစ်သည် (ECR Image URI, လိုအပ်သော vCPU, RAM, Environment Variables နှင့် Mount Points များကို သတ်မှတ်သည်)။
3. **Job Queue:** Submit လုပ်လိုက်သော အလုပ်များကို တန်းစီသိမ်းဆည်းရာနေရာ ဖြစ်သည် (Priority သတ်မှတ်ချက်ဖြင့် အရေးကြီးသော အလုပ်ကို အရင် run စေနိုင်သည်)။
4. **Compute Environment:** အလုပ်များကို အမှန်တကယ် run ပေးမည့် Compute Capacity (EC2, Spot Instances သို့မဟုတ် Fargate) ဖြစ်သည်။

---

## Managed vs Unmanaged Compute Environments

- **Managed Compute Environment (Recommended):**  
  AWS က အလုပ်အရေအတွက်အလိုက် EC2 Instance Size များနှင့် Auto Scaling ကို အလိုအလျောက် တာဝန်ယူ စီမံပေးသည်။ အလုပ်မရှိချိန်တွင် **Minimum vCPU = 0** ထားရှိနိုင်သဖြင့် **ဆာဗာစရိတ် သုည (Zero Cost)** ဖြစ်သည်။
- **Unmanaged Compute Environment:**  
  အဖွဲ့အစည်းက ကိုယ်ပိုင် AMI, Custom Configuration များဖြင့် EC2 များကို ကိုယ်တိုင် launch လုပ်ပြီး Batch Cluster ထဲသို့ ပေါင်းထည့်သည်။

### EC2 Spot Instances ဖြင့် ၉၀% စရိတ်ချွေတာခြင်း:
Batch Jobs များသည် ယာယီအလုပ်များဖြစ်သဖြင့် **Spot Instances** ကို အသုံးပြုရန် အကောင်းဆုံး ဖြစ်သည်။ AWS က Capacity ပြန်လိုပါက Batch Job ကို အလိုအလျောက် Retry လုပ်ပေးနိုင်သောကြောင့် စရိတ် ၉၀% အထိ သက်သာစေပါသည်။

---

## Array Jobs & Job Dependencies

### ၁။ Array Jobs (အလုပ် ၁၀,၀၀၀ တစ်ပြိုင်နက် ခွဲထုတ်ခြင်း):
ဖိုင်ပေါင်း ၁,၀၀၀ ကို တစ်ပြိုင်နက် process လုပ်လိုပါက Job ၁,၀၀၀ သီးခြား submit စရာမလိုပါ။
- **Array Job** တစ်ခုတည်း တင်လိုက်ရုံဖြင့် AWS Batch က Sub-jobs ၁,၀၀၀ အလိုအလျောက် ခွဲထုတ်ပေးပြီး Container တစ်ခုစီထံသို့ `AWS_BATCH_JOB_ARRAY_INDEX` (0 မှ 999 အထိ) ကို ထိုးထည့်ပေးသည်။

### ၂။ Job Dependencies:
အလုပ်များ အစဉ်လိုက် ဖြစ်စေရန် (ဥပမာ- Data Extract ပြီးမှသာ Data Transform လုပ်ရန်) `dependsOn` ဖြင့် ချိတ်ဆက်နိုင်ပါသည်:

```
[ Job A: Data Download ] ──(Succeeded)──► [ Job B: Image Processing ] ──► [ Job C: PDF Report ]
```

---

## Job Lifecycle States (ဘဝသံသရာ အဆင့်များ)

```
[ SUBMITTED ] ──► [ PENDING ] ──► [ RUNNABLE ] ──► [ STARTING ] ──► [ RUNNING ] ──► [ SUCCEEDED ]
                                         │                                      └──► [ FAILED ]
                                         ▼ (ဆာဗာရှာမရပါက ဤနေရာတွင် ပိတ်မိတတ်သည်)
```

- **RUNNABLE (အရေးကြီးဆုံး အဆင့်):** အလုပ်သည် စတင်ရန် အဆင်သင့်ဖြစ်နေပြီး Compute Environment တွင် လုံလောက်သော CPU/RAM သို့မဟုတ် Spot Capacity ရှိမရှိ AWS Scheduler က စောင့်ဆိုင်းနေသော အဆင့် ဖြစ်ပါသည်။
