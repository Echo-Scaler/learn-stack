---
title: VLSM (Variable Length Subnet Masking) Deep Dive
description: Fixed Length Subnet Masking (FLSM) ၏ အားနည်းချက်၊ VLSM သဘောတရား၊ အကြီးဆုံးမှ အသေးဆုံးသို့ အဆင့်ဆင့်တွက်ချက်နည်း (Algorithm) နှင့် လက်တွေ့ လုပ်ငန်းခွင် ဥပမာ
---

ကွန်ရက်အင်ဂျင်နီယာနှင့် Cloud Architect တစ်ဦးအတွက် မရှိမဖြစ် အရည်အချင်းတစ်ခုမှာ **VLSM (Variable Length Subnet Masking)** ကို အသုံးပြု၍ IP လိပ်စာများကို အလေအလွင့် အနည်းဆုံးဖြင့် အချိုးကျ ခွဲဝေနိုင်ခြင်း ဖြစ်သည်။ ဤလမ်းညွှန်တွင် VLSM ၏ သဘောတရားနှင့် လက်တွေ့တွက်ချက်နည်းများကို အသေးစိတ် ရှင်းပြပါမည်။

---

## ၁။ VLSM ဆိုတာ ဘာလဲ? (What is VLSM?)

**VLSM (Variable Length Subnet Masking)** ဆိုသည်မှာ ကွန်ရက်တစ်ခုတည်း (Network Address တစ်ခုတည်း) မှ မတူညီသော ဌာနများ၊ အခန်းကဏ္ဍများ၏ လိုအပ်ချက်ပေါ် မူတည်၍ **မတူညီသော Subnet Mask များ (ဥပမာ- `/25`, `/26`, `/28`, `/30`) ကို ရောနှောအသုံးပြုကာ Subnet ခွဲဝေခြင်း** ဖြစ်သည်။

---

## ၂။ FLSM vs VLSM (ဘာကြောင့် VLSM ကို သုံးရသလဲ?)

### ပြဿနာ: FLSM (Fixed Length Subnet Masking) ၏ ချို့ယွင်းချက်
Fixed Length Subnet Masking (FLSM) တွင် Network တစ်ခုကို တူညီသော အရွယ်အစားရှိ Subnet များအဖြစ်သာ အညီအမျှ ပုံသေ ခွဲဝေပေးသည်:

```
[ Base Network: 192.168.1.0/24 (Total 256 IPs) ]
ခွဲဝေမှု (FLSM - Fixed /26):
  - Subnet A: 64 IPs (လိုချင်သည်မှာ 100 hosts)  ---> မလုံလောက်ပါ (Shortage!)
  - Subnet B: 64 IPs (လိုချင်သည်မှာ 50 hosts)   ---> အဆင်ပြေသည်
  - Subnet C: 64 IPs (လိုချင်သည်မှာ 5 hosts)    ---> ၅၉ လုံး အလဟဿ ဖြစ်သည် (Massive Waste!)
  - Subnet D: 64 IPs (Router Link: 2 hosts)     ---> ၆၂ လုံး အလဟဿ ဖြစ်သည် (Massive Waste!)
```

### ဖြေရှင်းချက်: VLSM ၏ ပြောင်းလွယ်ပြင်လွယ်မှု (Efficiency)
VLSM တွင်မူ လိုအပ်ချက် အနည်းအများကို ကြည့်၍ သင့်တော်သော Subnet Mask ကို ကွက်တိ ခွဲဝေပေးနိုင်သည်:

```
[ Base Network: 192.168.1.0/24 (Total 256 IPs) ]
ခွဲဝေမှု (VLSM):
  - Subnet A: /25 (128 IPs)  ---> Hosts 100 အတွက် လုံလောက်သည်
  - Subnet B: /26 (64 IPs)   ---> Hosts 50 အတွက် အံကိုက်ဖြစ်သည်
  - Subnet C: /28 (16 IPs)   ---> Hosts 5 အတွက် ၁၆ လုံးသာ သုံးပြီး နေရာချွေတာသည်
  - Subnet D: /30 (4 IPs)    ---> Router Link အတွက် ၄ လုံးသာ သုံးသည်
```

---

## ၃။ VLSM တွက်ချက်ခြင်း၏ ရွှေရောင်စည်းမျဉ်း (The Golden Rule)

> [!IMPORTANT]
> **အမြဲတမ်း မှတ်သားရမည့် စည်းမျဉ်း (Largest to Smallest Rule)**:  
> VLSM တွက်ချက်သည့်အခါ **Host အရေအတွက် အများဆုံး လိုအပ်သော ဌာန (Largest Subnet) မှ စတင်၍ အနည်းဆုံး လိုအပ်သော ဌာန (Smallest Subnet) သို့ အစဉ်လိုက် စီတန်းပြီးမှသာ** စတင်တွက်ချက် ခွဲဝေရပါမည်။  
> (အကယ်၍ အသေးဆုံးမှ စတင်ခွဲဝေပါက Subnet Block များ ထပ်သွားပြီး Network Overlapping ဖြစ်ပေါ်တတ်သည်)။

---

## ၄။ လက်တွေ့ လုပ်ငန်းခွင် တွက်ချက်မှု Scenario (Worked Example)

ကုမ္ပဏီတစ်ခုတွင် အသုံးပြုရန် Base Network အဖြစ် **`172.16.1.0/24` (Total 256 IPs)** ကို သတ်မှတ်ပေးထားသည် ဆိုပါစို့။

### ဌာနအသီးသီး၏ လိုအပ်ချက်များ:
1. **Engineering Department**: ကွန်ပျူတာ **၁၀၀ လုံး**
2. **Sales & Marketing Department**: ကွန်ပျူတာ **၅၀ လုံး**
3. **Finance & HR Department**: ကွန်ပျူတာ **၂၀ လုံး**
4. **Server Room (DMZ)**: ဆာဗာ **၁၀ လုံး**
5. **WAN Link (Router to Router)**: Point-to-Point **၂ လုံး**

---

### အဆင့် ၁: လိုအပ်ချက်များကို အကြီးဆုံးမှ အသေးဆုံးသို့ စီတန်းခြင်း
1. Engineering: 100 hosts
2. Sales: 50 hosts
3. Finance: 20 hosts
4. Server DMZ: 10 hosts
5. WAN Link: 2 hosts

---

### အဆင့် ၂: တစ်ခုချင်းစီအတွက် Formula ဖြင့် Mask ရှာဖွေခြင်း
Formula: $2^H - 2 \ge \text{Hosts Needed}$ (Prefix $= 32 - H$)

#### ၁။ Engineering (100 Hosts လိုအပ်သည်)
- $2^6 - 2 = 62$ (မလုံလောက်ပါ)
- $2^7 - 2 = 126$ (လုံလောက်သည်, $H = 7$)
- Prefix: $32 - 7 =$ **/25** (Total 128 IPs, Subnet Mask: `255.255.255.128`)
- **Network ID**: `172.16.1.0/25`
- **Usable Host Range**: `172.16.1.1` မှ `172.16.1.126`
- **Broadcast Address**: `172.16.1.127`
- *နောက် Subnet စတင်မည့် IP*: `172.16.1.128`

---

#### ၂။ Sales & Marketing (50 Hosts လိုအပ်သည်)
- $2^5 - 2 = 30$ (မလုံလောက်ပါ)
- $2^6 - 2 = 62$ (လုံလောက်သည်, $H = 6$)
- Prefix: $32 - 6 =$ **/26** (Total 64 IPs, Subnet Mask: `255.255.255.192`)
- **Network ID**: `172.16.1.128/26`
- **Usable Host Range**: `172.16.1.129` မှ `172.16.1.190`
- **Broadcast Address**: `172.16.1.191`
- *နောက် Subnet စတင်မည့် IP*: `172.16.1.192`

---

#### ၃။ Finance & HR (20 Hosts လိုအပ်သည်)
- $2^4 - 2 = 14$ (မလုံလောက်ပါ)
- $2^5 - 2 = 30$ (လုံလောက်သည်, $H = 5$)
- Prefix: $32 - 5 =$ **/27** (Total 32 IPs, Subnet Mask: `255.255.255.224`)
- **Network ID**: `172.16.1.192/27`
- **Usable Host Range**: `172.16.1.193` မှ `172.16.1.222`
- **Broadcast Address**: `172.16.1.223`
- *နောက် Subnet စတင်မည့် IP*: `172.16.1.224`

---

#### ၄။ Server Room DMZ (10 Hosts လိုအပ်သည်)
- $2^3 - 2 = 6$ (မလုံလောက်ပါ)
- $2^4 - 2 = 14$ (လုံလောက်သည်, $H = 4$)
- Prefix: $32 - 4 =$ **/28** (Total 16 IPs, Subnet Mask: `255.255.255.240`)
- **Network ID**: `172.16.1.224/28`
- **Usable Host Range**: `172.16.1.225` မှ `172.16.1.238`
- **Broadcast Address**: `172.16.1.239`
- *နောက် Subnet စတင်မည့် IP*: `172.16.1.240`

---

#### ၅။ WAN Point-to-Point Link (2 Hosts လိုအပ်သည်)
- $2^2 - 2 = 2$ (လုံလောက်သည်, $H = 2$)
- Prefix: $32 - 2 =$ **/30** (Total 4 IPs, Subnet Mask: `255.255.255.252`)
- **Network ID**: `172.16.1.240/30`
- **Usable Host Range**: `172.16.1.241` မှ `172.16.1.242`
- **Broadcast Address**: `172.16.1.243`
- *ကျန်ရှိသော အလွတ် IP များ*: `172.16.1.244` မှ `172.16.1.255` (အနာဂတ် ချဲ့ထွင်မှုအတွက် အလွတ်ကျန်ရှိသည်)

---

## ၅။ ပြီးပြည့်စုံသော VLSM Allocation Summary Table

| ဌာနအမည် (Department) | လိုအပ်သော Hosts | သတ်မှတ် Prefix | Subnet Mask | Network Address | Usable Range | Broadcast Address |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Engineering** | 100 | **/25** | `255.255.255.128` | `172.16.1.0` | `172.16.1.1` - `172.16.1.126` | `172.16.1.127` |
| **Sales & Marketing**| 50 | **/26** | `255.255.255.192` | `172.16.1.128` | `172.16.1.129` - `172.16.1.190` | `172.16.1.191` |
| **Finance & HR** | 20 | **/27** | `255.255.255.224` | `172.16.1.192` | `172.16.1.193` - `172.16.1.222` | `172.16.1.223` |
| **Server Room DMZ** | 10 | **/28** | `255.255.255.240` | `172.16.1.224` | `172.16.1.225` - `172.16.1.238` | `172.16.1.239` |
| **WAN Router Link** | 2 | **/30** | `255.255.255.252` | `172.16.1.240` | `172.16.1.241` - `172.16.1.242` | `172.16.1.243` |
| *(Spare Unallocated)*| - | - | - | `172.16.1.244` | *(Available for Future Expansion)* | `172.16.1.255` |

---

## ၆။ VLSM အသုံးပြုခြင်း၏ လက်တွေ့ အကျိုးကျေးဇူးများ (Key Advantages)

1. **Maximized IP Address Utilization**: IP လိပ်စာ အလေအလွင့်ကို 80% ကျော် လျှော့ချပေးနိုင်သည်။
2. **Security & Department Isolation**: ဌာနတစ်ခုစီအတွက် Subnet မတူညီသဖြင့် Router နှင့် Firewall Policy များတွင် ဥပမာ- "Sales ဌာနမှ Server DMZ သို့ ဝင်ခွင့်မရှိ" စသည့် Rules များကို အလွယ်တကူ သတ်မှတ်နိုင်သည်။
3. **Broadcast Domain Reduction**: Broadcast traffic များကို သက်ဆိုင်ရာ Subnet အတွင်းသာ ကန့်သတ်ထားနိုင်သဖြင့် Network Congestion မဖြစ်ဘဲ Speed ပိုမိုမြန်ဆန်စေသည်။
4. **Future Expansion Reserve**: မလိုအပ်ဘဲ IP အကုန်မသုံးဘဲ ချန်ထားနိုင်သဖြင့် နောင်တွင် ရုံးခွဲအသစ် သို့မဟုတ် Service အသစ်များအတွက် IP အလွယ်တကူ ချဲ့ထွင်နိုင်သည်။
