---
title: "၃။ Execution Lifecycle, Cold Starts & Concurrency"
description: "Lambda Execution Lifecycle၊ Cold Start vs Warm Start၊ Execution Environment Reuse၊ Reserved Concurrency vs Provisioned Concurrency"
---

# ၃။ Execution Lifecycle, Cold Starts & Concurrency

## Execution Lifecycle: Cold Start vs Warm Start

Lambda Function တစ်ခု စတင်အလုပ်လုပ်ရာတွင် အဆင့် ၃ ဆင့် ရှိပါသည်:

```
[ First Request (Cold Start) ]
┌──────────────────────────────────────────────┐ ┌───────────────────┐
│                 INIT PHASE                   │ │   INVOKE PHASE    │
│ 1. Download Code 2. Start MicroVM 3. Init SDK│ │ Run handler() Code│
└──────────────────────────────────────────────┘ └───────────────────┘
               (ကြာချိန်: 100ms ~ 1000ms)             (ကြာချိန်: 20ms)

[ Subsequent Request (Warm Start) ]
                                                 ┌───────────────────┐
                                                 │   INVOKE PHASE    │
                                                 │ Run handler() Code│
                                                 └───────────────────┘
                                                     (ကြာချိန်: 20ms)
```

1. **Cold Start (ပထမဆုံး အကြိမ်):** Function ကို အကြာကြီး မခေါ်ဘဲနေပြီးမှ ရုတ်တရက် ခေါ်လိုက်သောအခါ AWS သည် MicroVM အသစ် တည်ဆောက်ပြီး Runtime နှင့် Libraries များကို Initialize လုပ်ရသဖြင့် စက္ကန့်ပိုင်းခန့် အနည်းငယ် ကြန့်ကြာတတ်သည်။
2. **Warm Start (ဒုတိယအကြိမ်နှင့် နောက်ပိုင်း):** အဆိုပါ Execution Environment သည် ၅ မိနစ် မှ ၁၅ မိနစ်ခန့် အသင့်ရှိနေသဖြင့် ကြန့်ကြာမှု မရှိဘဲ ချက်ချင်း Run နိုင်သည်။

### 💡 Execution Environment Reuse (Optimization Best Practice):
Database Connection ဖွင့်ခြင်း သို့မဟုတ် SDK Client တည်ဆောက်ခြင်းများကို `handler()` အတွင်း၌ မရေးဘဲ `handler()` အပြင်ဘက် (Global Scope) တွင် ကြိုတင် ရေးသားထားပါက Warm Start အကြိမ်တိုင်းတွင် Database Connection အသစ် ထပ်ဆောက်စရာမလိုဘဲ မူလ Connection ကို ပြန်လည်အသုံးပြုနိုင်ပါသည် (Reuse)။

---

## Concurrency (တစ်ပြိုင်နက်တည်း Run နိုင်စွမ်း)

Default အားဖြင့် AWS Account တစ်ခုတွင် Region တစ်ခုလျှင် **1,000 Concurrent Executions** ခွင့်ပြုထားပါသည်။

### ၁။ Reserved Concurrency:
- သတ်မှတ်ထားသော Function တစ်ခုအတွက် အမြင့်ဆုံး Limit ကို ကန့်သတ်ပေးသည် (ဥပမာ- 100)။
- **အဘယ်ကြောင့် သုံးသနည်း:** အကယ်၍ Lambda က တစ်ပြိုင်နက် ၁,၀၀၀ အထိ ပွားများသွားပါက နောက်ကွယ်ရှိ RDS PostgreSQL Database တွင် Connection ပြည့်သွားပြီး Database ပျက်ကျသွားနိုင်သည်။ ထိုသို့ မဖြစ်စေရန် Lambda ၏ Max Concurrency ကို ကန့်သတ်ရန် သုံးသည်။

### ၂။ Provisioned Concurrency (Cold Start ကို လုံးဝ ပျောက်ကွယ်စေခြင်း):
- ကြိုတင်သတ်မှတ်ထားသော အရေအတွက်အတိုင်း (ဥပမာ- 50 Environments) AWS တွင် မီးမသေဘဲ အမြဲတမ်း Pre-warmed အသင့်ထားရှိပေးထားသည်။
- **ရလဒ်:** **Cold Start လုံးဝ မရှိတော့ဘဲ** အသုံးပြုသူတိုင်း Double-digit Millisecond Latency အမြန်ဆုံး အတွေ့အကြုံ ရရှိစေသည်။ (ငွေကြေး အနည်းငယ် ပိုကျသင့်သည်)။
