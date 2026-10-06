---
title: IPv4, Subnetting & CIDR (Classless Inter-Domain Routing)
description: IPv4 ဖွဲ့စည်းပုံ၊ Classful vs Classless၊ CIDR Prefix Notation (/16, /24, /28)၊ Subnet Mask တွက်ချက်ပုံ၊ Usable Host Formula နှင့် AWS Cloud Reserved IPs
---

Internet ပေါ်တွင် Device တစ်ခုနှင့်တစ်ခု ချိတ်ဆက်ရာတွင် လိပ်စာ (Address) အဖြစ် **IPv4 (Internet Protocol version 4)** ကို အသုံးပြုကြသည်။ သို့သော် ကမ္ဘာပေါ်ရှိ IPv4 လိပ်စာပေါင်း ၄.၃ ဘီလီယံ (4.29 Billion) ခန့်သာ ရှိသောကြောင့် IP များ ရှားပါးပြတ်လပ်မှုကို ကာကွယ်ရန် **Subnetting** နှင့် **CIDR** စနစ် ပေါ်ပေါက်လာခဲ့သည်။ ၎င်းတို့၏ သဘောတရားနှင့် တွက်ချက်နည်းများကို အသေးစိတ် လေ့လာပါမည်။

---

## ၁။ IPv4 ၏ ဖွဲ့စည်းပုံ (IPv4 Structure)

IPv4 Address တစ်ခုသည် **32-bit Binary Number (0 နှင့် 1 ပေါင်း ၃၂ လုံး)** ဖြင့် ဖွဲ့စည်းထားသည်။
လူသားများ ဖတ်ရှုရ လွယ်ကူစေရန်အတွက် 8-bit စီပါဝင်သော **Octet ၄ ခု** အဖြစ် ခွဲထုတ်ပြီး Dot (.) ဖြင့် ပိုင်းခြားကာ Dotted-Decimal Notation အဖြစ် ရေးသားသည်:

```
Decimal Format:       192   .    168   .     1     .     10
                       │          │          │          │
Binary (8 bits each): 11000000 . 10101000 . 00000001 . 00001010
Total Bits:           8 bits   +  8 bits   +  8 bits   +  8 bits   = 32 Bits (4 Bytes)
```

IPv4 လိပ်စာတိုင်းတွင် အပိုင်း ၂ ပိုင်း ပါဝင်သည်:
1. **Network ID (လမ်းအမည်)**: မည်သည့် ကွန်ရက်အုပ်စု ဖြစ်ကြောင်း ပြသသည့် အပိုင်း။
2. **Host ID (အိမ်နံပါတ်)**: ထို ကွန်ရက်အတွင်းရှိ တိကျသော ကွန်ပျူတာ/ဆာဗာ ဖြစ်ကြောင်း ပြသသည့် အပိုင်း။

---

## ၂။ Classful Addressing ၏ ပြဿနာနှင့် ကျဆုံးရခြင်း အကြောင်းအရင်း

အစောပိုင်း ကာလများတွင် IP များကို Class ၅ မျိုး (A, B, C, D, E) ဖြင့် ပုံသေ ခွဲဝေခဲ့သည်:

| Class | First Octet Range | Default Subnet Mask | Prefix | Number of Networks | Number of Hosts per Network |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **A** | `1 - 126` | `255.0.0.0` | `/8` | 128 | **16,777,214** (၁၆ သန်းကျော်) |
| **B** | `128 - 191` | `255.255.0.0` | `/16` | 16,384 | **65,534** (၆ သောင်းခွဲ) |
| **C** | `192 - 223` | `255.255.255.0` | `/24` | 2,097,152 | **254** |
| **D** | `224 - 239` | N/A | N/A | Multicast သီးသန့် | N/A |
| **E** | `240 - 255` | N/A | N/A | Research & Experimental | N/A |

### ပြဿနာ (Massive IP Wastage)
ကုမ္ပဏီတစ်ခုတွင် ကွန်ပျူတာ ၅၀၀ ခန့်သာ ရှိသည်ဆိုပါစို့:
- Class C (`/24`) ယူပါက အများဆုံး ၂၅၄ လုံးသာ ရသဖြင့် မလုံလောက်ပါ။
- ထို့ကြောင့် Class B (`/16`) ကို ယူလိုက်ရသည်။ Class B သည် IP ၆၅,၅၃၄ လုံး ပါရှိရာ ကွန်ပျူတာ ၅၀၀ အတွက် သုံးပြီး ကျန် **၆၅,၀၀၀ ကျော်သော IP များသည် အလဟဿ အလွတ်ဖြစ်သွားသည် (Huge Wastage)**။

---

## ၃။ CIDR (Classless Inter-Domain Routing) ဆိုတာ ဘာလဲ? (What & Why)

### ဖြေရှင်းချက် (The CIDR Revolution - RFC 1519)
Class များ၏ ပုံသေကန့်သတ်ချက် (Fixed /8, /16, /24) ကို ဖျက်သိမ်းပြီး မိမိ လိုအပ်သော Host အရေအတွက်အလိုက် Bits များကို လွတ်လပ်စွာ ညှိယူနိုင်သော **CIDR (Classless Inter-Domain Routing)** ကို ၁၉၉၃ ခုနှစ်တွင် စတင်အသုံးပြုခဲ့သည်။

### Slash Notation (`/`) ၏ အဓိပ္ပာယ်
IP ၏ နောက်တွင် `/` ဖြင့် ကပ်ထားသော ဂဏန်းသည် **Network ID အတွက် အသုံးပြုသော Bit အရေအတွက် (Prefix Length)** ကို ကိုယ်စားပြုသည်။
- ကျန်ရှိသော `(32 - Prefix)` bits များသည် **Host ID** အတွက် ဖြစ်သည်။

```
192.168.1.0/24  ---> ပထမ 24 bits သည် Network ID (ကျန် 8 bits သည် Host ID)
10.0.0.0/16     ---> ပထမ 16 bits သည် Network ID (ကျန် 16 bits သည် Host ID)
172.16.0.0/28   ---> ပထမ 28 bits သည် Network ID (ကျန် 4 bits သည် Host ID)
```

---

## ၄။ Subnetting တွက်ချက်ခြင်း သီအိုရီနှင့် Formula များ

### ၄.၁ Total IPs Formula
Subnet တစ်ခုအတွင်း ပါဝင်သော စုစုပေါင်း IP အရေအတွက်:
$$\text{Total IPs} = 2^{(32 - \text{Prefix})}$$

### ၄.၂ Standard Usable Hosts Formula
သာမန် ကွန်ရက်များတွင် အစဆုံး IP (Network Address) နှင့် အဆုံးစွန် IP (Broadcast Address) ကို Host တွင် သုံးခွင့်မရှိသဖြင့် **၂ ခု နုတ်ရပါသည်**:
$$\text{Usable Hosts} = 2^{(32 - \text{Prefix})} - 2$$

> [!IMPORTANT]
> **Cloud (AWS VPC) သီးသန့် ခြွင်းချက် (AWS Subnet Reserved IPs)**:  
> AWS VPC Subnet တစ်ခုစီတွင် AWS မှ အောက်ပါ IP **၅ ခု** ကို အမြဲတမ်း ကြိုတင် သိမ်းဆည်း (Reserve) ထားပါသည်:
> 1. `10.0.0.0`: Network Address
> 2. `10.0.0.1`: AWS VPC Router
> 3. `10.0.0.2`: AWS DNS Server (AmazonProvidedDNS)
> 4. `10.0.0.3`: Future Use (Reserved by AWS)
> 5. `10.0.0.255`: Network Broadcast Address  
> **AWS Usable Hosts Formula:** $2^{(32 - \text{Prefix})} - 5$

---

## ၅။ Complete CIDR Prefix to Subnet Mask Cheatsheet Table

| CIDR Prefix | Subnet Mask | Total IPs ($2^H$) | Standard Usable IPs | AWS Usable IPs | အသုံးများသော နေရာ (Common Use Case) |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **/16** | `255.255.0.0` | **65,536** | 65,534 | 65,531 | AWS VPC Root Block / Large Enterprise Campus |
| **/20** | `255.255.240.0` | **4,096** | 4,094 | 4,091 | Production Kubernetes Cluster Subnet |
| **/24** | `255.255.255.0` | **256** | 254 | 251 | Typical Office LAN / Cloud Standard Subnet |
| **/26** | `255.255.255.192` | **64** | 62 | 59 | Medium Tier Subnet (App Servers) |
| **/27** | `255.255.255.224` | **32** | 30 | 27 | Small Tier Subnet (Public Load Balancers) |
| **/28** | `255.255.255.240` | **16** | 14 | 11 | Database Subnets / Bastion Jump Hosts |
| **/30** | `255.255.255.252` | **4** | 2 | N/A (Not supported in AWS) | Point-to-Point Router Link (Router to Router) |
| **/32** | `255.255.255.255` | **1** | 1 (Single Host) | N/A | Firewall / Security Group Rule for exact 1 IP |

---

## ၆။ Step-by-Step Subnetting တွက်ချက်မှု လက်တွေ့နမူနာ

ဥပမာအားဖြင့် `192.168.10.0/26` ဟူသော Subnet Block တစ်ခု ရရှိထားသည် ဆိုပါစို့:

### အဆင့် ၁: Host Bits ရှာဖွေခြင်း
$$\text{Host Bits } (H) = 32 - 26 = 6 \text{ bits}$$

### အဆင့် ၂: စုစုပေါင်း IP အရေအတွက် တွက်ခြင်း
$$\text{Total IPs} = 2^6 = 64 \text{ IPs}$$

### အဆင့် ၃: Subnet Mask ရှာဖွေခြင်း
ပထမ Octet ၃ ခုသည် 24 bits ပြည့်သဖြင့် `255.255.255` ဖြစ်သည်။ နောက်ဆုံး 4th Octet တွင် Network Bit ၂ ခု (26 - 24 = 2 bits) ပါဝင်သည်:
$$11000000_2 = 128 + 64 = 192$$
ထို့ကြောင့် Subnet Mask သည် **`255.255.255.192`** ဖြစ်သည်။

### အဆင့် ၄: IP Range ခွဲဝေမှု (The 4 Critical Addresses)
- **Network Address (အစဆုံး IP)**: `192.168.10.0` (Host တွင် မသုံးရ)
- **First Usable Host IP**: `192.168.10.1` (ပထမဆုံး ကွန်ပျူတာ သို့မဟုတ် Gateway ပေးနိုင်သည်)
- **Last Usable Host IP**: `192.168.10.62` (နောက်ဆုံး ကွန်ပျူတာ ပေးနိုင်သည်)
- **Broadcast Address (အဆုံးစွန် IP)**: `192.168.10.63` (Host တွင် မသုံးရ၊ Broadcast အတွက်)
- **နောက် Subnet အသစ် စတင်မည့်နေရာ**: `192.168.10.64/26`

---

## ၇။ လုပ်ငန်းခွင် (Genba) တွင် CIDR ကို အသုံးချပုံနှင့် အားသာချက်များ

1. **Firewall & Security Group Hardening**:
   - အင်တာနက် တစ်ခုလုံးကို ဖွင့်ပေးလိုပါက `0.0.0.0/0` (Any IP) ဟု သတ်မှတ်သည်။
   - ရုံးတွင်း VPN မှသာ SSH ဝင်ခွင့်ပေးလိုပါက `203.0.113.45/32` (Exact Single IP) ဟု ကန့်သတ်ခြင်းဖြင့် Hacker များ ဝင်ရောက်ခြင်းမှ 100% ကာကွယ်နိုင်သည်။
2. **Microservices & Kubernetes (EKS/GKE) Pod Capacity Planning**:
   - Kubernetes Node တစ်ခုစီတွင် Pod အများအပြား Run မည်ဖြစ်ရာ Subnet အလွန်သေးငယ်ပါက Pod များ IP မရတော့ဘဲ Crash ဖြစ်သွားနိုင်သည်။ CIDR ကို မှန်ကန်စွာ ကြိုတင်တွက်ချက်ထားခြင်းဖြင့် Scalability ကို အာမခံနိုင်သည်။
3. **Route Aggregation (Supernetting)**:
   - Routers များတွင် Routing Table အရွယ်အစား သေးငယ်စေရန် Subnet ငယ်ပေါင်းများစွာကို CIDR တစ်ခုတည်း (ဥပမာ- `10.0.0.0/16`) ဖြင့် ချုံ့၍ လမ်းကြောင်းပြသပေးနိုင်သည်။
