---
title: Phase 3 Lesson 8 — Network Fundamentals & DNS Resolution
description: Linux Networking အခြေခံ, IP Addresses, Subnet Mask, CIDR (/24), TCP vs UDP, Ports & Sockets, DNS Resolution Flow (/etc/resolv.conf) နှင့် dig/ping/curl (မြန်မာဘာသာ)
---

# 🌐 Phase 3 — Lesson 8: Network Fundamentals & DNS Resolution

Linux Server များသည် ကမ္ဘာတစ်ဝှမ်းရှိ Client Users များ၊ Database Servers များနှင့် အခြား Microservices များနှင့် အင်တာနက်/Local Network မှတစ်ဆင့် အပြန်အလှန် ချိတ်ဆက်ဆက်သွယ်နေရပါသည်။

SysAdmin / DevOps Engineer တစ်ဦးအနေဖြင့် **IP Addressing**, **Subnetting (CIDR)**, **TCP vs UDP**, **Well-known Ports** နှင့် **DNS Resolution အလုပ်လုပ်ပုံ** ကို နားလည်ထားမှသာ Network ချိတ်ဆက်မှု ပြဿနာများကို စနစ်တကျ ဖြေရှင်းနိုင်မည် ဖြစ်ပါသည်။

---

## 💡 ၁။ Network Fundamentals (IP, Subnets, Ports & Sockets)

### IP Address & CIDR Notation
* **IP Address**: ကွန်ရက်ပေါ်ရှိ စက်တစ်ခုစီ၏ သီးသန့် လိပ်စာ (ဥပမာ- `192.168.1.50`, `10.0.0.1`)။
* **Subnet Mask & CIDR (Classless Inter-Domain Routing)**: IP လိပ်စာတွင် မည်သည့်အပိုင်းသည် Network ဖြစ်ပြီး မည်သည့်အပိုင်းသည် Host ဖြစ်ကြောင်း သတ်မှတ်ခြင်း။
  * `/24`: 255.255.255.0 (IP လိပ်စာပေါင်း 256 ခု၊ သုံးစွဲနိုင်သော Host ပေါင်း 254 ခု)။
  * `/16`: 255.255.0.0 (IP လိပ်စာပေါင်း 65,536 ခု)။

### TCP vs UDP
* **TCP (Transmission Control Protocol)**: 3-Way Handshake (SYN -> SYN-ACK -> ACK) ဖြင့် စိတ်ချသေချာသော Connection တည်ဆောက်ပြီးမှ Data ပို့သည်။ Packet ပျောက်ဆုံးပါက ပြန်ပို့သည်။ (HTTP, HTTPS, SSH, MySQL, Postgres)။
* **UDP (User Datagram Protocol)**: Connection မဆောက်ဘဲ အမြန်ဆုံး အရောက်ပို့ပေးသည်။ Packet ပျောက်လျှင် ပြန်မပို့ပါ။ (DNS queries, Video streaming, VoIP, Gaming)။

### Ports & Sockets
* **Port**: Server စက်တစ်ခုတည်းတွင် Application များစွာ အပြိုင်အဆိုင် အလုပ်လုပ်နိုင်ရန် ခွဲခြားပေးထားသော တံခါးပေါက်နံပါတ် (0 မှ 65535 အထိ)။
  * **22**: SSH (Remote terminal)
  * **80**: HTTP (Unsecured Web)
  * **443**: HTTPS (Encrypted Web with TLS)
  * **3306**: MySQL Database
  * **5432**: PostgreSQL Database
  * **6379**: Redis In-Memory Cache
* **Socket**: `IP Address + Port Number` (ဥပမာ- `192.168.1.10:443`) ဖြစ်ပြီး Network Connection တစ်ခု၏ အဆုံးသတ် အမှတ်အသား ဖြစ်ပါသည်။

---

## 🔍 ၂။ DNS Resolution Flow (Linux တွင် Domain Name မည်သို့ ပြောင်းလဲသနည်း)

User က `curl https://api.example.com` ဟု ရိုက်လိုက်သောအခါ Linux စနစ်သည် အောက်ပါ အဆင့်အတိုင်း IP အဖြစ် ဘာသာပြန်ယူပါသည် -

```
1. Local Host Cache & /etc/hosts ဖိုင်ကို အရင်ဆုံး စစ်ဆေးသည်။
                    │
                    ▼ (ရှာမတွေ့ပါက)
2. /etc/resolv.conf ထဲရှိ DNS Nameserver (ဥပမာ- 8.8.8.8, 1.1.1.1, AWS Route53) သို့ မေးမြန်းသည်။
                    │
                    ▼
3. Root Nameserver (.) ──► TLD (.com) ──► Authoritative DNS Server
                    │
                    ▼
4. IP Address (93.184.216.34) ကို ရရှိပြီးမှ Web Request ပို့သည်။
```

### `/etc/hosts` ဖိုင်၏ အသုံးဝင်ပုံ:
DNS မချိတ်ရသေးမီ မိမိ စမ်းသပ်လိုသော Domain ကို Local IP နှင့် အတင်းအကျပ် တွဲချည်လိုပါက `/etc/hosts` တွင် ထည့်သွင်းနိုင်သည်:
```
127.0.0.1  localhost
192.168.1.100  api.dev.local
```

---

## ⌨️ ၃။ Network Troubleshooting Commands

```bash
# ၁။ Network ချိတ်ဆက်မှု ရှိ/မရှိ စစ်ဆေးခြင်း (ICMP Ping)
ping -c 4 8.8.8.8

# ၂။ DNS Query အသေးစိတ် စစ်ဆေးခြင်း (DNS Lookup via dig)
dig example.com +short
dig @8.8.8.8 example.com A

# ၃။ HTTP Request နှင့် Response Headers စစ်ဆေးခြင်း
curl -I https://google.com
curl -v https://api.github.com

# ၄။ Network Packet ခရီးလမ်းကြောင်း စစ်ဆေးခြင်း (Hop by Hop)
traceroute google.com
```

---

## 🏋️ ၄။ Hands-on Practice

1. Ubuntu VM တွင် `ping -c 3 1.1.1.1` ဖြင့် အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပါ။
2. `cat /etc/resolv.conf` ဖြင့် လက်ရှိ Server သုံးနေသော DNS Nameserver IP ကို ကြည့်ပါ။
3. `curl -I https://httpbin.org/get` ဖြင့် HTTP Status Code `200 OK` ကို စစ်ဆေးပါ။
4. `sudo nano /etc/hosts` ဖွင့်ပြီး `127.0.0.1 myserver.local` ဟု ထည့်ပါ။
5. `ping -c 2 myserver.local` ဖြင့် စမ်းသပ်ကြည့်ပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: TCP နှင့် UDP တို့၏ အဓိကကွာခြားချက်မှာ အဘယ်နည်း? Web Browsing (HTTPS) သည် အဘယ်ကြောင့် TCP ကို သုံးသနည်း?
2. **မေးခွန်း ၂**: Domain name တစ်ခုမှ IP မထွက်ဘဲ `Could not resolve host` ဟု Error တက်ပါက မည်သည့် Linux configuration ဖိုင်ကို အရင်ဆုံး စစ်ဆေးရမည်နည်း?
3. **မေးခွန်း ၃**: Standard HTTPS Port နှင့် MySQL Port နံပါတ်များမှာ အဘယ်နည်း?
