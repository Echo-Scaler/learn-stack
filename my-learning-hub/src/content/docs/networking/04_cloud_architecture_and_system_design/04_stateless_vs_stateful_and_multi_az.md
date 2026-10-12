---
title: Stateless vs Stateful Applications & Multi-AZ Deployment
description: Stateless App ဒီဇိုင်း၊ External Session Store (Redis), Object Storage (S3) နှင့် Multi-AZ High Availability
---

## ၁။ Stateless vs Stateful Applications

- **Stateless Application:** User Session သို့မဟုတ် File များကို Local Server Disk တွင် မသိမ်းဘဲ External Redis သို့မဟုတ် S3 တွင် သိမ်းဆည်းသည်။ မည်သည့် Server သေသွားစေကာမူ Auto Scaling လွတ်လပ်စွာ လုပ်နိုင်သည်။
- **Stateful Application:** Server Local Disk ပေါ်တွင် Session နှင့် File များ သိမ်းဆည်းသဖြင့် Server ပျက်စီးပါက Data ဆုံးရှုံးသည်။

---

## ၂။ Multi-AZ Deployment

Web Servers များနှင့် Database များကို Availability Zone ၂ ခု (AZ-a နှင့် AZ-c) တွင် ခွဲထားသဖြင့် Data Center တစ်ခု ပျက်စီးသွားသော်လည်း စနစ်သည် ဆက်လက် လည်ပတ်နေနိုင်သည်။
