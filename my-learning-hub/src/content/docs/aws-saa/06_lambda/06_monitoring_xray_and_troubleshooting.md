---
title: "၆။ Monitoring, X-Ray & Troubleshooting"
description: "CloudWatch Metrics/Logs၊ AWS X-Ray Distributed Tracing၊ Lambda REPORT Log ဖတ်ရှုနည်း နှင့် အဖြစ်များသော Errors (Timeouts, OOM, 429 Throttles)"
---

# ၆။ Monitoring, X-Ray & Troubleshooting

## CloudWatch Logs & REPORT Log ဖတ်ရှုနည်း

Lambda Function တစ်ခု Run ပြီးတိုင်း CloudWatch Logs တွင် အောက်ပါကဲ့သို့ **REPORT line** ကို အလိုအလျောက် ရေးသားပေးပါသည်:

```
REPORT RequestId: 7b2e8c91-4d32-4e12-8f90-123456789abc
Duration: 85.42 ms    Billed Duration: 86 ms    Memory Size: 256 MB    Max Memory Used: 78 MB
```

### အချက်အလက် ခွဲခြမ်းစိတ်ဖြာချက်:
- **Duration (85.42 ms):** Code က အမှန်တကယ် ကြာမြင့်ခဲ့သော အချိန်။
- **Billed Duration (86 ms):** ပိုက်ဆံ ကောက်ခံမည့် Millisecond (အနီးဆုံး 1ms သို့ ညှိသည်)။
- **Memory Size (256 MB):** Function အတွက် သင် သတ်မှတ်ပေးထားသော RAM ပမာဏ။
- **Max Memory Used (78 MB):** အမှန်တကယ် သုံးစွဲခဲ့သော အမြင့်ဆုံး RAM။ (ဤနေရာတွင် 78MB သာ သုံးသဖြင့် 256MB သည် သင့်တော်နေကြောင်း သိရှိနိုင်သည်)။

---

## AWS X-Ray (Distributed Tracing)

Serverless Architecture တွင် API Gateway မှတစ်ဆင့် Lambda ထိုမှတစ်ဆင့် DynamoDB သို့မဟုတ် S3 သို့ သွားသော ခရီးစဉ်တစ်ခုလုံးတွင် မည်သည့်နေရာ၌ အချိန်မည်မျှ ကြာနေသည်ကို ခြေရာခံရန် **AWS X-Ray** ကို အသုံးပြုပါသည်:

```
[ API Gateway ] ──(15ms)──► [ Lambda Function ] ──(120ms)──► [ Amazon DynamoDB ]
                                  │
                       [ AWS X-Ray Service Map ]
```

Function တွင် **Active Tracing** ဖွင့်ထားရုံဖြင့် Microservices အချင်းချင်းကြား Latency နှောင့်နှေးမှုများကို အချိန်နှင့်တစ်ပြေးညီ ရှာဖွေဖော်ထုတ်နိုင်ပါသည်။

---

## Troubleshooting Runbook (အဖြစ်များသော အမှားများ)

| အမှားအခြေအနေ | အကြောင်းအရင်း | ဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **`Task timed out after 3.00 seconds`** | Function အလုပ်မပြီးမီ သတ်မှတ်ထားသော Timeout (Default 3s) သို့ ရောက်သွားခြင်း | Lambda Configuration တွင် Timeout ကို လိုအပ်သလို တိုးမြှင့်ပေးပါ (Max 15 minutes) သို့မဟုတ် External Network call ကို စစ်ဆေးပါ |
| **Out of Memory (OOM)** | Function ၏ Memory Size (ဥပမာ- 128MB) ထက် ဒေတာက ပိုမိုကြီးမားနေခြင်း | Memory Size ကို 256MB သို့မဟုတ် 512MB သို့ တိုးမြှင့်ပေးပါ (CPU စွမ်းအားပါ အလိုအလျောက် တိုးသွားပါမည်) |
| **`429 Too Many Requests (Throttling)`** | Account သို့မဟုတ် Function ၏ Concurrent Executions ကန့်သတ်ချက် ပြည့်သွားခြင်း | AWS Support ထံ သို့မဟုတ် Service Quotas တွင် Concurrency တိုးပေးရန် တောင်းဆိုပါ သို့မဟုတ် Reserved Concurrency စစ်ဆေးပါ |
| **`AccessDeniedException`** | Function က S3 သို့မဟုတ် DynamoDB သို့ ဖတ်/ရေးရန် IAM Execution Role တွင် ခွင့်ပြုချက် မရှိခြင်း | IAM Execution Role တွင် သက်ဆိုင်ရာ AWS Managed Policy သို့မဟုတ် Inline Policy ထည့်သွင်းပေးပါ |
