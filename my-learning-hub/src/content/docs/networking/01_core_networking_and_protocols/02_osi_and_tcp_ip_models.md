---
title: OSI 7 Layers vs TCP/IP Protocol Architecture
description: ကွန်ရက်အလွှာ ၇ လွှာနှင့် TCP/IP Model၊ ဒေတာထုပ်ပိုးမှု (Encapsulation) နှင့် Packet Journey
---

## ၁။ OSI Model (7 Layers) vs TCP/IP Model နှိုင်းယှဉ်ချက်

ကမ္ဘာပေါ်ရှိ မတူညီသော Hardware ထုတ်လုပ်သူများ (Cisco, Apple, Intel) နှင့် OS များ (Linux, Windows, macOS) အချင်းချင်း အဆင်ပြေစွာ ဒေတာပို့ဆောင်နိုင်ရန် Standard Model များကို သတ်မှတ်ထားခြင်း ဖြစ်သည်။

```
     OSI 7 LAYERS                         TCP/IP MODEL              PDU (Protocol Data Unit)
+-----------------------+           +-----------------------+    
| 7. Application Layer  | ---\      |                       |    
| 6. Presentation Layer | ----+---> |   Application Layer   |    Data / Payload
| 5. Session Layer      | ---/      | (HTTP, DNS, SSH, SSL) |    (Raw Message)
+-----------------------+           +-----------------------+    
| 4. Transport Layer    | --------> |    Transport Layer    |    Segments (TCP) / Datagrams (UDP)
| (TCP, UDP, Ports)     |           |       (TCP, UDP)      |    (Port Numbers)
+-----------------------+           +-----------------------+    
| 3. Network Layer      | --------> |     Internet Layer    |    Packets
| (IP, ICMP, Routing)   |           |      (IPv4, IPv6)     |    (IP Addresses)
+-----------------------+           +-----------------------+    
| 2. Data Link Layer    | ---\      |                       |    Frames
| (MAC Address, Switch) | ----+---> |  Network Access Layer |    (MAC Addresses)
| 1. Physical Layer     | ---/      |   (Ethernet, Wi-Fi)   |    Bits (01010101)
+-----------------------+           +-----------------------+    
```

---

## ၂။ OSI 7 Layers တစ်ခုချင်းစီ၏ တာဝန်များ

1. **Application Layer (Layer 7):**
   - End-user application များနှင့် တိုက်ရိုက် ထိတွေ့သည့် နေရာ (HTTP/HTTPS, DNS, SSH, FTP)။
2. **Presentation Layer (Layer 6):**
   - Data Compression, Data Formatting (JSON, XML) နှင့် Encryption/Decryption (SSL/TLS) ပြုလုပ်ပေးခြင်း။
3. **Session Layer (Layer 5):**
   - Connection Session ကို စတင်ခြင်း (Establish), ထိန်းသိမ်းခြင်း (Maintain), အဆုံးသတ်ခြင်း (Terminate)။
4. **Transport Layer (Layer 4):**
   - Port Number ဖြင့် Application ခွဲခြားခြင်း၊ Flow Control, Error Correction (TCP vs UDP)။
5. **Network Layer (Layer 3):**
   - Logical Addressing (IP Address) ဖြင့် ကွန်ရက်အချင်းချင်း လမ်းကြောင်းရှာဖွေပေးခြင်း (Routers, Routing)။
6. **Data Link Layer (Layer 2):**
   - Physical Addressing (MAC Address) ဖြင့် တူညီသော Local Network အတွင်း Switch မှတစ်ဆင့် Frame ပို့ဆောင်ပေးခြင်း (Ethernet, ARP)။
7. **Physical Layer (Layer 1):**
   - လျှပ်စစ်လှိုင်း၊ အလင်းလှိုင်း သို့မဟုတ် Wi-Fi လှိုင်းများဖြင့် Bits (0/1) ဒေတာများကို ရုပ်ပိုင်းဆိုင်ရာ ကြိုးများမှတစ်ဆင့် ပို့ဆောင်ခြင်း။

---

## ၃။ Data Encapsulation & Decapsulation (ဒေတာ စီးဆင်းမှု)

- **Encapsulation (Sender ဘက်တွင်):** Application Payload ထဲသို့ Layer 4 Header (Port) ကပ်သည် -> Layer 3 Header (IP) ကပ်သည် -> Layer 2 Header (MAC) ကပ်သည် -> Bits အဖြစ် ပြောင်းလဲပို့သည်။
- **Decapsulation (Receiver ဘက်တွင်):** Bits -> Frame (MAC စစ်ဆေး) -> Packet (IP စစ်ဆေး) -> Segment (Port စစ်ဆေး) -> သက်ဆိုင်ရာ Application (Nginx/DB) သို့ Payload ဒေတာ လွှဲပြောင်းပေးသည်။
