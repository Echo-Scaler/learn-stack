---
title: Routing, Route Tables, Default Gateway & NAT
description: Default Gateway, Routing အလုပ်လုပ်ပုံ, Route Tables နှင့် NAT (Network Address Translation - SNAT / DNAT)
---

## ၁။ Default Gateway ဆိုတာဘာလဲ?

**Default Gateway** သည် မိမိ၏ Local Subnet အပြင်ဘက်သို့ သွားလိုသော Packet များ (ဥပမာ - Internet `8.8.8.8`) အတွက် ပို့ဆောင်ရမည့် တံခါးပေါက် Router ၏ IP Address ဖြစ်သည်။

---

## ၂။ Routing & Route Tables

Routing ဆိုသည်မှာ Packet တစ်ခုကို Source မှ Destination သို့ ရောက်ရှိစေရန် အကောင်းဆုံး လမ်းကြောင်း ရွေးချယ်ပေးခြင်း ဖြစ်သည်။

```
[ Linux Server Route Table နမူနာ ]
Destination        Gateway          Genmask          Iface
10.0.1.0           0.0.0.0          255.255.255.0    eth0 (Local Subnet)
0.0.0.0            10.0.1.1         0.0.0.0          eth0 (Default Gateway -> Internet)
```
- `0.0.0.0/0` (Default Route): စာရင်းထဲတွင် တိုက်ရိုက် မပါသော ကမ္ဘာ့ IP အားလုံးအတွက် Default Gateway ဆီသို့ လွှဲပို့ပေးသည်။

---

## ၃။ NAT (Network Address Translation)

NAT သည် Private IP များကို Public IP အဖြစ်သို့ ပြောင်းလဲပေးသော နည်းပညာ ဖြစ်သည်:

```
[ Private Server: 10.0.2.15 ]
             │ (Source IP: 10.0.2.15)
             ▼
[ NAT Gateway: Public IP 54.23.11.8 ]
             │ (Translated Source: 54.23.11.8)
             ▼
[ Public Internet (GitHub / Ubuntu Mirror) ]
```

1. **SNAT (Source NAT):** Private Subnet ထဲရှိ Server များ Package Update ပြုလုပ်ရန် Internet သို့ ထွက်သည့်အခါ Private IP ကို Public IP အဖြစ် ပြောင်းလဲပေးသည်။ (AWS NAT Gateway)
2. **DNAT (Destination NAT / Port Forwarding):** အပြင်မှ Public IP သို့ ဝင်လာသော Traffic ကို အတွင်းရှိ Private Server IP သို့ ပြောင်းလဲပို့ဆောင်ပေးသည်။
