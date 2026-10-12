---
title: Network Fundamentals & Client-Server Architecture
description: Network အခြေခံသဘောတရားများ၊ Client-Server ပုံစံ၊ LAN, WAN, Internet နှင့် Bandwidth, Latency, Packet Loss အကြောင်း
---

## ၁။ Network (ကွန်ရက်) ဆိုတာဘာလဲ?

**Computer Network (ကွန်ပျူတာကွန်ရက်)** ဆိုသည်မှာ ကွန်ပျူတာများ၊ Server များ၊ Network Devices (Routers, Switches, Firewalls) နှင့် မိုဘိုင်းဖုန်းများ အချင်းချင်း ဆက်သွယ်ထားသော စနစ်တစ်ခု ဖြစ်သည်။
၎င်းစနစ်၏ အဓိက ရည်ရွယ်ချက်မှာ:
1. **ဒေတာ ဖလှယ်ခြင်း (Data Exchange):** ဖိုင်များ၊ စာတိုများ၊ API Requests များကို ပို့ဆောင်ခြင်း။
2. **အရင်းအမြစ် မျှဝေသုံးစွဲခြင်း (Resource Sharing):** Database, Cloud Compute, Storage, Printers များကို အများသုံးနိုင်စေခြင်း။
3. **ဗဟိုမှ စီမံခန့်ခွဲခြင်း (Centralized Management):** Cloud နှင့် Data Center များတွင် စနစ်တစ်ခုလုံးကို တစ်နေရာတည်းမှ ထိန်းချုပ်နိုင်ခြင်း။

---

## ၂။ Client–Server Architecture (ကလိုင်းရန့်-ဆာဗာ ဖွဲ့စည်းပုံ)

ခေတ်သစ် Web နှင့် Cloud Application အားလုံးနီးပါးသည် Client-Server ပုံစံဖြင့် လည်ပတ်သည်:

```
+--------------------+                               +--------------------+
|  Client (Browser)  |  --- 1. HTTP Request (GET) --> |   Server (Nginx)   |
|  IP: 203.0.113.15  |  <-- 2. HTTP Response (200) -- |   IP: 198.51.100.4 |
+--------------------+                               +--------------------+
```

- **Client (ကလိုင်းရန့်):** ဝန်ဆောင်မှု သို့မဟုတ် အချက်အလက်ကို Request (တောင်းဆို) သည့် စက် ဖြစ်သည်။ ဥပမာ - Chrome/Safari Browser, Mobile App, Postman, `curl` CLI။
- **Server (ဆာဗာ):** Client ၏ Request ကို လက်ခံစစ်ဆေးပြီး Response (အဖြေ/ဒေတာ) ပြန်လည်ပေးပို့သည့် စက် ဖြစ်သည်။ ဥပမာ - Nginx, Node.js API, Spring Boot, MySQL Database။
- **Request / Response Cycle:** Client က တောင်းဆိုမှသာ Server က အလုပ်လုပ်ပြီး အဖြေပေးသည်။

---

## ၃။ LAN, WAN နှင့် Internet ကွာခြားချက်များ

| နယ်ပယ် | အမည်အပြည့်အစုံ | အတိုင်းအတာ | ဥပမာ | Bandwidth & Latency |
| :--- | :--- | :--- | :--- | :--- |
| **LAN** | Local Area Network | အဆောက်အအုံတစ်ခု၊ ရုံးခန်းတစ်ခု သို့မဟုတ် အိမ်တွင်း | ရုံးတွင်း Wi-Fi Router နှင့် ချိတ်ထားသော PC များ | 1Gbps - 10Gbps, Latency < 1ms |
| **WAN** | Wide Area Network | မြို့များ၊ နိုင်ငံများနှင့် တိုက်ကြီးများအကြား ချိတ်ဆက်မှု | AWS Global Fiber Backbone, ကုမ္ပဏီရုံးချုပ်နှင့် ရုံးခွဲများ ချိတ်ဆက်မှု | 10ms - 200ms Latency ရှိနိုင်သည် |
| **Internet** | Inter-Network of Networks | ကမ္ဘာတစ်ဝှမ်းရှိ LAN နှင့် WAN များအားလုံး ချိတ်ဆက်ထားသော ကမ္ဘာ့ကွန်ရက်ကြီး | World Wide Web (WWW) | တစ်ကမ္ဘာလုံးဆိုင်ရာ ချိတ်ဆက်မှု |

---

## ၄။ Bandwidth, Latency နှင့် Packet Loss

လုပ်ငန်းခွင်တွင် Network Performance ကို တိုင်းတာရာတွင် အောက်ပါ အဓိက အချက် ၃ ချက်ကို အမြဲ ကြည့်ရှုရသည်:

```
[ Sender ] ================= (Pipe အကျယ် = Bandwidth) =================> [ Receiver ]
                      (သွားလာရသည့် ကြာချိန် = Latency)
                      (လမ်းတွင် ကျပျောက်မှု = Packet Loss)
```

1. **Bandwidth (လှိုင်းအကျယ် / ဒေတာစီးဆင်းနိုင်မှုနှုန်း):**
   - တစ်စက္ကန့်အတွင်း ပိုက်လိုင်းမှ ဖြတ်သန်းစီးဆင်းနိုင်သော အမြင့်ဆုံး ဒေတာ ပမာဏ ဖြစ်သည် (Bits per second - Mbps, Gbps)။
   - ပိုက်လိုင်းကြီးလေ ဒေတာ ပိုမိုစီးဆင်းနိုင်လေ ဖြစ်သည်။

2. **Latency (တုံ့ပြန်မှု ကြန့်ကြာချိန်):**
   - Packet တစ်ခုသည် မူလစက်မှ ပန်းတိုင်စက်သို့ ရောက်ရှိပြီး မူလစက်သို့ ပြန်လည်ရောက်ရှိရန် ကြာမြင့်ချိန် (Round Trip Time - RTT) ဖြစ်သည်။
   - မီလီစက္ကန့် (ms) ဖြင့် တိုင်းတာသည်။ AWS Tokyo Region မှ Singapore သို့ ~60ms ကြာပြီး၊ Same AZ အတွင်း ~0.5ms သာ ကြာသည်။

3. **Packet Loss (ဒေတာအထုပ် ကျပျောက်မှု):**
   - Network ကြပ်တည်းခြင်း (Congestion) သို့မဟုတ် Hardware ချို့ယွင်းမှုကြောင့် ပန်းတိုင်မရောက်မီ လမ်းတွင် ပျောက်ဆုံးသွားသော Packet ရာခိုင်နှုန်း (%) ဖြစ်သည်။
   - 1% အထက် ဖြစ်ပေါ်ပါက Web Application များ အလွန်နှေးကွေးသွားနိုင်သည်။
