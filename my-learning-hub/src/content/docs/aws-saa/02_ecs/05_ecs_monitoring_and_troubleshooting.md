---
title: "၅။ ECS Monitoring နဲ့ Troubleshooting"
description: "ECS Monitoring အဓိက Services ၄ ခု၊ စောင့်ကြည့်ရမည့် Metrics & Signals နှင့် Restaurant POS API လက်တွေ့ Troubleshooting Runbook"
---

# ၅။ ECS Monitoring နဲ့ Logging

Monitoring ဆိုတာ Application ကောင်းကောင်း အလုပ်လုပ်နေလား၊ CPU/RAM ပြည့်နေလား၊ Error တွေတက်နေလားဆိုတာ စောင့်ကြည့်ခြင်း ဖြစ်ပါတယ်။

AWS ECS မှာ အဓိကအသုံးပြုရမယ့် Monitoring Services တွေက အောက်ပါအတိုင်းပါ။

---

## အဓိက Monitoring Services ၄ ခုနှင့် ၎င်းတို့၏ Usage

1. **Amazon CloudWatch — Metrics နဲ့ Alarms**
   - CPU Utilization
   - Memory Utilization
   - Task အရေအတွက်
   - Application Error Metrics
   - Threshold ကျော်သွားရင် Alarm ပေးခြင်း (ဥပမာ CPU အသုံးပြုမှု 80% ကျော်နေတာကို သတ်မှတ်ထားတဲ့ အချိန်အတွင်း တွေ့ရင် SNS မှတစ်ဆင့် Notification ပို့နိုင်တယ်)
2. **CloudWatch Logs — Application Logs**
   - Container ထဲက Application Output နဲ့ Error Messages တွေကို သိမ်းဆည်းကြည့်ရှုနိုင်တယ် (PHP Exception, Database Connection Error, HTTP 500 Error စတာတွေကို စစ်ဆေးနိုင်တယ်)
3. **CloudWatch Container Insights — Container အသေးစိတ် Monitoring**
   - Cluster, Service နဲ့ Task တွေရဲ့ Resource Usage နဲ့ Performance ကို ပိုမိုအသေးစိတ် စောင့်ကြည့်နိုင်တယ် (Container Insights အတွက် Additional Charges ရှိနိုင်ပါတယ်)
4. **AWS CloudTrail — API Activity Audit**
   - ECS Resource တွေကို ဘယ်သူက ဘယ်အချိန်မှာ ဘယ်လို API Call လုပ်ခဲ့တယ်ဆိုတာ စစ်ဆေးနိုင်တယ်

---

## Monitoring မှာ ဘာတွေ စောင့်ကြည့်ရမလဲ (Signals & Usage Table)

| Metric / Signal | ဘာကို သိနိုင်လဲ။ (Usage & Meaning) |
| :--- | :--- |
| **CPU Utilization** | Application က CPU အများကြီး သုံးနေလား |
| **Memory Utilization** | RAM ပြည့်နေလား၊ Memory Limit ကျော်နေလား |
| **Task Running Count** | လိုအပ်တဲ့ Task အရေအတွက် ပြည့်မီလား |
| **Task Stopped Reason** | Task ဘာကြောင့် ရပ်သွားတာလဲ |
| **Application Logs** | Code Error နဲ့ Database Error ရှိလား |
| **ALB Target Health** | Load Balancer က Task တွေကို Healthy လို့ သတ်မှတ်ထားလား |
| **HTTP 5xx / Latency** | Server Error များလာလား၊ Response နှေးနေလား |
| **Deployment Alarms** | Version အသစ် Deploy လုပ်ချိန်မှာ ပြဿနာဖြစ်နေလား |

> **မှတ်ချက်:** CloudWatch Metrics တွေကို Alarm တွေနဲ့ ချိတ်ဆက်ပြီး ECS Service Auto Scaling သို့မဟုတ် Failed Deployment Rollback အတွက်လည်း အသုံးပြုနိုင်ပါတယ်။

---

## လက်တွေ့ Troubleshooting ဥပမာ (Restaurant POS API)

Restaurant POS API က ရုတ်တရက် အလုပ်မလုပ်တော့ဘူးဆိုရင် ဒီအစီအစဉ်အတိုင်း စစ်ဆေးနိုင်ပါတယ်။

1. **အဆင့် ၁:** ECS → Cluster → Service ကို ဝင်ပြီး Running Tasks နဲ့ Desired Tasks ကို နှိုင်းယှဉ်ပါ။
2. **အဆင့် ၂:** Task ရပ်သွားရင် Stopped Reason ကို စစ်ပါ။ ဥပမာ Memory ကျော်ခြင်း (OOM)، Image Pull မရခြင်း၊ IAM Permission မလုံလောက်ခြင်း။
3. **အဆင့် ၃:** CloudWatch Logs ထဲမှာ Application Error နဲ့ Stack Trace ကို စစ်ပါ။
4. **အဆင့် ၄:** CloudWatch Metrics မှာ CPU/RAM တက်နေလား၊ ALB Target Health မှာ Healthy ဖြစ်လား စစ်ပါ။
5. **အဆင့် ၅:** ပြဿနာအကြောင်းရင်းကို ပြင်ပြီး Version အသစ် Deploy လုပ်ပါ။ Deployment Health မကောင်းရင် သတ်မှတ်ထားတဲ့ Rollback Mechanism ကို အသုံးပြုပါ။
