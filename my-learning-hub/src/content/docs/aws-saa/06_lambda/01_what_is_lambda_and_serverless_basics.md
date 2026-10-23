---
title: "၁။ Lambda ဆိုတာဘာလဲ & Serverless အခြေခံ"
description: "AWS Lambda ၏ Serverless သဘောတရား၊ Function၊ Handler၊ Memory (128MB to 10GB)၊ Timeout (15m) နှင့် EC2 vs Lambda ရွေးချယ်ပုံ"
---

# ၁။ Lambda ဆိုတာဘာလဲ & Serverless အခြေခံ

## AWS Lambda (Function as a Service - FaaS) ဆိုတာဘာလဲ?

**AWS Lambda** သည် Server တစ်လုံးမျှ ဝယ်ယူ/ငှားရမ်းစရာမလိုဘဲ (Serverless) မိမိရေးသားထားသော Code Function လေးများကိုသာ တင်ထားပြီး၊ လိုအပ်ချိန် (Event ဖြစ်ပေါ်ချိန်) တွင်မှ AWS က လျှပ်တစ်ပြက် Run ပေးသော Compute ဝန်ဆောင်မှု ဖြစ်ပါသည်။

- **No Servers to Manage:** OS Patching, Security Updates, Server Monitoring များကို လုပ်ဆောင်စရာ လုံးဝ မလိုပါ။
- **Continuous Auto-Scaling:** Request ၁ ခု လာပါက Function ၁ ခု run ပြီး၊ တစ်ပြိုင်နက် Request ၁၀,၀၀၀ လာပါက Function ၁၀,၀၀၀ သို့ စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ပွားများပေးသည်။
- **Sub-millisecond Metering:** Code အလုပ်လုပ်နေသည့် ကြာချိန် (Execution Time) အတွက်သာ စက္ကန့်၏ တစ်ထောင်ပုံတစ်ပုံ (Millisecond) အဆင့်အထိ တိကျစွာ ပေးဆောင်ရသည်။ မည်သူမျှ မသုံးချိန်တွင် စရိတ်သည် **$0 (Zero Cost)** ဖြစ်ပါသည်။

---

## EC2 vs AWS Lambda: ဘယ်အချိန် ဘာသုံးမလဲ?

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EC2 vs Lambda ရွေးချယ်မှု                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ Amazon EC2 (Continuous Server)    │ AWS Lambda (Serverless Function)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • ၂၄ နာရီ မနားတမ်း Request အမြဲလာနေသော│ • အခါအားလျော်စွာသာ လာသော Traffic     │
│   စနစ်များ                        │ • File Upload ပြီးမှ လုပ်ရသော အလုပ် │
│ • တွက်ချက်မှုတစ်ခုသည် မိနစ်ပေါင်းများစွာ   │ • တွက်ချက်မှုတစ်ခုသည် စက္ကန့်ပိုင်းမျှသာ │
│   ကြာမြင့်နိုင်သော အလုပ်များ         │   ကြာမြင့်သော အလုပ်များ (Max 15m)  │
│ • Custom OS Kernel, Socket လိုအပ်ခြင်း│ • Stateless REST APIs, Webhooks    │
│ • ပုံသေ Predictable စရိတ် လိုချင်သည့်အခါ│ • Traffic ရုတ်တရက် မခန့်မှန်းနိုင်သောအခါ│
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## Lambda အဓိက သတ်မှတ်ချက်များ (Key Components)

1. **Function:** သင် ရေးသားထားသော Logic Code အစုအဝေး (Node.js, Python, Java, Go, C#, Ruby သို့မဟုတ် Custom Docker Image up to 10GB)။
2. **Handler Function:** AWS က Event စတင်ခေါ်ဆိုချိန်တွင် ဝင်ရောက်မည့် အဓိက Entrypoint Method (ဥပမာ- `index.handler`)။
3. **Memory Allocation (128 MB မှ 10,240 MB / 10 GB):**  
   Lambda တွင် CPU Core ကို တိုက်ရိုက် မရွေးချယ်ရပါ။ **Memory (RAM) ကို တိုးမြှင့်လိုက်သည်နှင့်အမျှ AWS က CPU Core စွမ်းအားကိုပါ အချိုးကျ အလိုအလျောက် တိုးပေးပါသည်** (1,769 MB တွင် 1 Full vCPU ရရှိသည်)။
4. **Timeout (အများဆုံး ၁၅ မိနစ် - 900 Seconds):**  
   Function တစ်ခု၏ အမြင့်ဆုံး အလုပ်လုပ်ချိန် ကန့်သတ်ချက် ဖြစ်သည်။ Default သည် 3 စက္ကန့်ဖြစ်ပြီး အများဆုံး **၁၅ မိနစ် (15 Minutes)** အထိသာ တိုးခွင့်ရှိသည်။ (၁၅ မိနစ်ထက် ကျော်လွန်မည့် အလုပ်များအတွက် EC2, ECS သို့မဟုတ် AWS Batch ကို သုံးရမည်)။
5. **Execution Role:** Function က S3, DynamoDB, CloudWatch Logs များသို့ ဆက်သွယ်ရန် လိုအပ်သော IAM Role ဖြစ်သည်။
