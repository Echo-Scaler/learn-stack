---
title: "၇။ ကိုယ့်ကိုယ်ကို စမ်းသပ်ကြည့်ပါ & နောက်ဆုံး အနှစ်ချုပ်"
description: "ECS Self-Test Quiz မေးခွန်း ၄ ခု၊ အဖြေမှန်များ၊ ECS ကို ကျွမ်းကျင်စွာ အသုံးချနိုင်ရန် မဖြစ်မနေ သိရမည့် နောက်ဆုံး အနှစ်ချုပ်နှင့် တရားဝင် References"
---

# ၇။ ကိုယ့်ကိုယ်ကို စမ်းသပ်ကြည့်ပါ

အောက်ပါ မေးခွန်းများကို ဖြေဆိုပြီး မိမိ၏ ECS အသိပညာကို စမ်းသပ်ပါ:

---

### ၁။ ECS Service မှာ Desired Count = 3 သတ်မှတ်ထားတယ်။ Task တစ်ခု ပျက်သွားရင် ဘာလုပ်ဖို့ ကြိုးစားမလဲ။
- [ ] Task အားလုံးကို ရပ်မယ်
- [x] **Replacement Task တစ်ခု စတင်မယ် (အဖြေမှန်)**
- [ ] Database ကို ဖျက်မယ်

---

### ၂။ Container Logs နဲ့ CPU/RAM Metrics ကို အဓိက ဘယ် Service မှာ စစ်မလဲ။
- [ ] Amazon Route 53
- [x] **Amazon CloudWatch (အဖြေမှန်)**
- [ ] Amazon ECR

---

### ၃။ Version အသစ်ကို User အနည်းငယ်ဆီ အရင်ပို့ချင်တယ်။ ဘယ် Strategy ကို ရွေးမလဲ။
- [x] **Canary (အဖြေမှန်)**
- [ ] Rolling only
- [ ] Task Definition

---

### ၄။ Server တွေကို ကိုယ်တိုင်စီမံရတာ လျှော့ချချင်တယ်။ ဘယ် Compute Option ကို စဉ်းစားသင့်လဲ။
- [x] **AWS Fargate (အဖြေမှန်)**
- [ ] ကိုယ်တိုင် EC2 Host အားလုံးစီမံခြင်း
- [ ] ECR တစ်ခုတည်း

---

## နောက်ဆုံး အနှစ်ချုပ်

ECS ကို နားလည်ဖို့ ဒီအချက်တွေကို အရင်ဆုံး ကျွမ်းကျင်အောင် လေ့လာပါ-

1. **ECR** — Image သိမ်းတယ်။
2. **Task Definition** — Container ဘယ်လို Run မလဲ သတ်မှတ်တယ်။
3. **Cluster** — Tasks နဲ့ Services တွေကို စုစည်းထားတယ်။
4. **Task / Service** — Application ကို Run လုပ်ပြီး လိုအပ်တဲ့ Task အရေအတွက်ကို ထိန်းပေးတယ်။
5. **Fargate / EC2** — Compute Capacity ပေးတယ်။
6. **ALB** — Traffic ဖြန့်ဝေပေးတယ်။
7. **CloudWatch** — Monitoring, Logs, Alarms လုပ်တယ်။
8. **Rolling / Blue-Green / Canary / Linear** — Application Version အသစ်တွေကို ဖြန့်ချိတဲ့ နည်းလမ်းတွေ ဖြစ်တယ်။

---

### Official Documentation Reference:
- Amazon ECS Documentation: [AWS ECS လေ့လာရန် တရားဝင်လမ်းညွှန်](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html?utm_source=chatgpt.com)
