---
title: VPN, Proxies, Load Balancing & REST API Networking
description: VPN, Forward vs Reverse Proxy, Load Balancing, Timeout/Retry, CORS နှင့် REST Networking
---

## ၁။ VPN (Virtual Private Network)

Public Internet ပေါ်တွင် Encrypted Tunnel တည်ဆောက်ပြီး Remote ဝန်ထမ်းများ သို့မဟုတ် ရုံးခွဲများကို ရုံးတွင်း Private Network သို့ လုံခြုံစွာ ချိတ်ဆက်ပေးသည်။

---

## ၂။ Forward Proxy vs Reverse Proxy

```
[ Client ] ──► [ Forward Proxy ] ──► [ Internet ]
(Client ကို ဖုံးကွယ်ပြီး ရုံးတွင်း Web အသုံးပြုမှုကို စစ်ဆေးကန့်သတ်သည်)

[ Internet ] ──► [ Reverse Proxy (Nginx) ] ──► [ Backend App 1, App 2 ]
(Backend Server များကို ဖုံးကွယ်ပြီး SSL Termination, Caching, Load Balancing လုပ်ပေးသည်)
```

---

## ၃။ Load Balancing Algorithms
- **Round Robin:** အလှည့်ကျ တစ်လုံးစီ ပို့ခြင်း။
- **Least Connections:** လက်ရှိ Request အနည်းဆုံး လက်ခံထားသော Server ဆီ ပို့ခြင်း။
- **IP Hash:** User IP ပေါ်မူတည်၍ သတ်မှတ်ထားသော Server တူရာဆီ ပို့ခြင်း (Session Sticky)။

---

## ၄။ Connection Timeout, Retry & CORS

- **Connection Timeout:** သတ်မှတ် စက္ကန့်အတွင်း Handshake မပြီးပါက Connection ဖြတ်တောက်ခြင်း။
- **Retry with Exponential Backoff:** Network ကျပါက 1s, 2s, 4s, 8s စသဖြင့် ကြားကာလတိုး၍ ပြန်ကြိုးစားခြင်း။
- **CORS (Cross-Origin Resource Sharing):** Browser က Domain မတူသော Backend API ဆီသို့ Request ပို့ခွင့်ကို HTTP Headers (`Access-Control-Allow-Origin`) ဖြင့် ကန့်သတ်ခြင်း။
