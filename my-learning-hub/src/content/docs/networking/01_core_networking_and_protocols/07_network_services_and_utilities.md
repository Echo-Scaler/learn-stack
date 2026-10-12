---
title: Network Protocols & Services (SSH, SFTP, DHCP, ICMP, WebSocket)
description: SSH Remote Login, FTP vs SFTP, DHCP DORA Process, ICMP Ping, ARP, Email Protocols (SMTP/IMAP/POP3) နှင့် WebSocket
---

## ၁။ SSH & SFTP vs FTP

- **SSH (Port 22):** Remote Linux Server ကို Encrypted Tunnel ဖြင့် စီမံခန့်ခွဲခြင်း (Public/Private Key Auth)။
- **SFTP (Port 22):** SSH ပေါ်မှ ဖိုင်များကို လုံခြုံစွာ ကူးယူခြင်း။
- **FTP (Port 21):** Plain Text ဖြစ်၍ ခေတ်ဟောင်းတွင်သာ သုံးပြီး ယခု မသုံးသင့်တော့ပါ။

---

## ၂။ DHCP (Dynamic Host Configuration) - The DORA Process

Device အသစ်တစ်ခု ချိတ်ဆက်လာတိုင်း IP အလိုအလျောက် သတ်မှတ်ပေးပုံ:
1. **D - Discover:** Client က "IP လိုချင်ပါတယ်" ဟု Broadcast ကြေညာသည်။
2. **O - Offer:** DHCP Server က IP နှင့် Gateway ကို ကမ်းလှမ်းသည်။
3. **R - Request:** Client က အဆိုပါ IP ကို ယူပါမည်ဟု တောင်းဆိုသည်။
4. **A - Acknowledge:** DHCP Server က အတည်ပြု မှတ်တမ်းတင်ပေးသည်။

---

## ၃။ ICMP & Ping, ARP

- **ICMP:** Network Error များနှင့် Connectivity စစ်ဆေးရန် သုံးသည် (`ping` command)။
- **ARP (Address Resolution Protocol):** IP Address မှ သက်ဆိုင်ရာ MAC Address ကို ရှာဖွေပေးသည်။

---

## ၄။ Email Protocols & WebSocket

- **SMTP (Port 587):** Email ပို့ဆောင်ခြင်း။
- **IMAP (Port 993) vs POP3 (Port 995):** Email ဖတ်ရှုခြင်း (IMAP က Multi-device Sync လုပ်ပေးနိုင်သည်)။
- **WebSocket (Port 80/443):** Single TCP Connection ပေါ်တွင် Client နှင့် Server အပြန်အလှန် Real-time ဒေတာ ပို့နိုင်သော Full-Duplex ချိတ်ဆက်မှု (Chat, Live Charts)။
