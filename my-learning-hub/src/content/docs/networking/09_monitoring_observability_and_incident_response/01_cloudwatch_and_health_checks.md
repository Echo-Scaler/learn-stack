---
title: Amazon CloudWatch Metrics, Logs, Alarms & Health Checks
description: CloudWatch Metrics, CloudWatch Logs Insights, Alarms, SNS Notifications, EC2 Status Checks နှင့် ALB Health Checks
---

## ၁။ CloudWatch Metrics & Logs

- **Metrics:** EC2 CPUUtilization, ALB RequestCount, RDS FreeStorageSpace စသည်တို့ကို စောင့်ကြည့်ခြင်း။
- **Logs Insights:** Nginx သို့မဟုတ် Application Error Logs များကို SQL Query ကဲ့သို့ ရှာဖွေခွဲခြမ်းစိတ်ဖြာခြင်း။

---

## ၂။ CloudWatch Alarms & ALB Health Checks

- **Alarms:** CPU 80% ကျော်ပါက Amazon SNS မှတစ်ဆင့် Slack / PagerDuty သို့ Alert ပို့ပေးသည်။
- **ALB Health Checks:** `/health` endpoint မအောင်မြင်သော Unhealthy Target များကို Traffic မပို့ဘဲ ဖယ်ရှားပေးသည်။
