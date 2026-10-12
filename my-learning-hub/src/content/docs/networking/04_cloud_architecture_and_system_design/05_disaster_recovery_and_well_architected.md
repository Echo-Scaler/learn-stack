---
title: Disaster Recovery (DR, RPO/RTO) & Well-Architected Framework
description: Disaster Recovery Strategies, Backup & Restore, RPO/RTO တွက်ချက်မှုနှင့် AWS Well-Architected Framework 6 Pillars
---

## ၁။ Disaster Recovery (DR) & RTO / RPO

```
Disaster အခိုက်အတန့်
        │
◄───────┼──────────────────────►
        │                      │
    [ RPO ]                 [ RTO ]
(Recovery Point Objective) (Recovery Time Objective)
"ဒေတာ မည်မျှ ဆုံးရှုံးခံနိုင်သလဲ"   "စနစ်ကို မည်မျှကြာအောင် ပြန်ထူထောင်နိုင်သလဲ"
```

1. **Backup & Restore:** S3/Glacier သို့ ပုံမှန် Backup သိမ်းပြီး ပျက်မှ အသစ်ပြန်တင်သည်။
2. **Pilot Light:** Core Database သာ တည်ရှိပြီး Server များကို ပျက်မှ Auto ဆောက်သည်။
3. **Warm Standby:** Production ၏ အသေးစားလေးကို အခြား Region တွင် အမြဲ Run ထားသည်။
4. **Multi-Region Active-Active:** Region ၂ ခုစလုံး Traffic လက်ခံနေသည် (Zero Downtime)။

---

## ၂။ AWS Well-Architected Framework (6 Pillars)

1. Operational Excellence, 2. Security, 3. Reliability, 4. Performance Efficiency, 5. Cost Optimization, 6. Sustainability.
