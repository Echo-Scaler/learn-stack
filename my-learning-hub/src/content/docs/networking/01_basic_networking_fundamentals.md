---
title: Basic Networking Fundamentals
description: OSI 7 Layer vs TCP/IP, Packet Journey, DNS Flow, DHCP DORA, NAT, TCP 3-Way Handshake နှင့် Production Network Troubleshooting Commands
---

ကွန်ပျူတာကွန်ရက် (Computer Networking) ဆိုသည်မှာ Device များ၊ Servers များနှင့် Cloud Resources များ အချင်းချင်း ဒေတာ (Data Packets) ဖလှယ်နိုင်ရန် ချိတ်ဆက်ထားသော စနစ်ဖြစ်သည်။ Backend Developer နှင့် DevOps Engineer များအတွက် မသိမဖြစ်လိုအပ်သော အခြေခံ Networking သဘောတရားများ၊ Packet များ သွားလာပုံနှင့် လက်တွေ့စစ်ဆေးနည်းများကို လေ့လာပါမည်။

---

## ၁။ OSI 7 Layers vs TCP/IP Model (What & Why)

### ဘာကြောင့် Model များကို လေ့လာရသလဲ?
ကမ္ဘာပေါ်ရှိ ကွဲပြားသော Hardware (Cisco, Juniper, Apple, Intel) နှင့် Operating System (Linux, Windows, macOS) များ အချင်းချင်း အဆင်ပြေချောမွေ့စွာ ဒေတာပို့ဆောင်နိုင်ရန် ကမ္ဘာ့စံချိန်စံညွှန်းအဖြစ် သတ်မှတ်ထားခြင်း ဖြစ်သည်။

```
  OSI 7 LAYERS                         TCP/IP MODEL              PDU (Protocol Data Unit)
+-----------------------+           +-----------------------+    
| 7. Application Layer  | ---\      |                       |    
| 6. Presentation Layer | ----+---> |   Application Layer   |    Data (Payload)
| 5. Session Layer      | ---/      | (HTTP, DNS, SSH, SSL) |    
+-----------------------+           +-----------------------+    
| 4. Transport Layer    | --------> |    Transport Layer    |    Segments (TCP) / Datagrams (UDP)
| (TCP, UDP, Ports)     |           |       (TCP, UDP)      |    
+-----------------------+           +-----------------------+    
| 3. Network Layer      | --------> |     Internet Layer    |    Packets (IP Addresses)
| (IP, Routers, ICMP)   |           |     (IPv4, IPv6, IP)  |    
+-----------------------+           +-----------------------+    
| 2. Data Link Layer    | ---\      |                       |    Frames (MAC Addresses)
| (MAC Address, Switch) | ----+---> |   Network Access Layer|    ------------------------
| 1. Physical Layer     | ---/      |   (Ethernet, Wi-Fi)   |    Bits (01010101 Electrical/Optical)
+-----------------------+           +-----------------------+    
```

### Layer တစ်ခုချင်းစီ၏ တာဝန်များ (Functions & Protocols)

1. **Application Layer (Layer 7)**: End-user application များနှင့် တိုက်ရိုက် ထိတွေ့သည့် နေရာ (HTTP/HTTPS, DNS, SSH, FTP, SMTP)။
2. **Presentation Layer (Layer 6)**: Data များကို Format ပြောင်းခြင်း၊ Compress လုပ်ခြင်းနှင့် Encryption/Decryption (SSL/TLS) ပြုလုပ်ပေးခြင်း။
3. **Session Layer (Layer 5)**: Server နှင့် Client ကြား Connection Session ကို စတင်ခြင်း၊ ထိန်းသိမ်းခြင်းနှင့် အဆုံးသတ်ခြင်း။
4. **Transport Layer (Layer 4)**: Data များကို Segment များအဖြစ် ခွဲထုတ်ခြင်း၊ Port Number (ဥပမာ- Port 80, 443) ဖြင့် သက်ဆိုင်ရာ Application ထံ ခွဲပို့ပေးခြင်း၊ Flow Control နှင့် Error Correction (TCP vs UDP)။
5. **Network Layer (Layer 3)**: Packet များကို ဘယ်လမ်းကြောင်းက ပို့မည်ကို လမ်းညွှန်ပေးခြင်း (Logical Addressing - IP Addresses, Routers)။
6. **Data Link Layer (Layer 2)**: တူညီသော Local Network အတွင်း Physical MAC Address ဖြင့် Frame များကို Switch မှတစ်ဆင့် တိကျစွာ ပို့ဆောင်ပေးခြင်း (Ethernet, ARP)။
7. **Physical Layer (Layer 1)**: ဒေတာများကို လျှပ်စစ်လှိုင်း (Electrical Signals), အလင်းလှိုင်း (Fiber Optic), သို့မဟုတ် ရေဒီယိုလှိုင်း (Wi-Fi) အဖြစ် Bits (0/1) ပို့ဆောင်ပေးခြင်း။

---

## ၂။ Network Hardware Devices: Hub vs Switch vs Router vs Gateway

```
+---------------+     Broadcasts to all     +---------------+
|     Hub       | ------------------------> | Dumb Device   | (Collisions ဖြစ်သည်၊ ယခုခေတ်မသုံးတော့ပါ)
+---------------+                           +---------------+

+---------------+     Inspects MAC Address  +---------------+
|    Switch     | ------------------------> | Layer 2 LAN   | (Local Network အတွင်း MAC Address ဖြင့် တိကျစွာပို့သည်)
+---------------+                           +---------------+

+---------------+     Inspects IP Address   +---------------+
|    Router     | ------------------------> | Layer 3 WAN   | (မတူညီသော Network ၂ ခုကို IP အခြေခံ၍ လမ်းကြောင်းရှာပေးသည်)
+---------------+                           +---------------+

+---------------+     Protocol Translation  +---------------+
|    Gateway    | ------------------------> | Entry/Exit    | (Private Network မှ အပြင် Internet သို့ ထွက်ရာ တံခါးပေါက်)
+---------------+                           +---------------+
```

---

## ၃။ အဓိက Network ဝန်ဆောင်မှုများ (DNS, DHCP, NAT)

### ၃.၁ DNS (Domain Name System) Resolution Flow Step-by-Step

လူသားများ မှတ်သားရလွယ်သော နာမည် (`google.com`) မှ ကွန်ပျူတာများ နားလည်သော IP (`142.250.190.46`) သို့ ပြောင်းလဲပေးသည့် စနစ်ဖြစ်သည်။

```
Browser: "google.com ရဲ့ IP ဘယ်လောက်လဲ?"
  │
  ├──► 1. Local Browser / OS Cache (မရှိပါက)
  │
  ├──► 2. Recursive Resolver (ISP DNS သို့မဟုတ် 8.8.8.8)
  │         │
  │         ├──► 3. Root DNS Server (.) ──► ".com Server ဆီ သွားမေးပါ"
  │         │
  │         ├──► 4. TLD DNS Server (.com) ──► "Google ရဲ့ Authoritative Server ဆီ သွားပါ"
  │         │
  │         └──► 5. Authoritative Nameserver (ns1.google.com) ──► "IP သည် 142.250.190.46 ဖြစ်သည်"
  │
  └──◄ 6. Client ထံသို့ IP ပြန်ပေးပြီး Connection စတင်သည်။
```

---

### ၃.၂ DHCP (Dynamic Host Configuration Protocol) - The DORA Process

Device အသစ်တစ်ခု Network သို့ ချိတ်ဆက်လာတိုင်း IP Address, Subnet Mask, Gateway, DNS များကို အလိုအလျောက် သတ်မှတ်ပေးသည့် စနစ်:

```
[ Client (New PC) ]                                 [ DHCP Server / Router ]
         │                                                      │
         │  1. DHCP DISCOVER (Broadcast: "IP လိုချင်ပါတယ်")       │
         │ ───────────────────────────────────────────────────► │
         │                                                      │
         │  2. DHCP OFFER (Unicast: "192.168.1.105 ရမလား?")      │
         │ ◄─────────────────────────────────────────────────── │
         │                                                      │
         │  3. DHCP REQUEST (Broadcast: "ဒီ IP ကို လက်ခံပါသည်")    │
         │ ───────────────────────────────────────────────────► │
         │                                                      │
         │  4. DHCP ACK (Unicast: "ငှားရမ်းမှု အတည်ပြုပြီးပါပြီ")    │
         │ ◄─────────────────────────────────────────────────── │
```

---

### ၃.၃ NAT (Network Address Translation)

အိမ်တွင်း သို့မဟုတ် ရုံးတွင်းရှိ ကွန်ပျူတာ ထောင်ပေါင်းများစွာသည် **Private IP (192.168.x.x, 10.x.x.x)** ကို အသုံးပြုကြသည်။ သို့သော် Internet ပေါ်တွင် သွားလာရန် **Public IP** လိုအပ်သည်။

- **Source NAT (SNAT / PAT)**: Private IP မှ အင်တာနက်သို့ ထွက်သည့်အခါ Router က မိမိ၏ Public IP နှင့် Dynamic Port နံပါတ်ဖြင့် လဲလှယ်ပေးခြင်း။
- **Destination NAT (DNAT / Port Forwarding)**: အင်တာနက်ပြင်ပမှ အိမ်တွင်း Web Server (`192.168.1.50:80`) သို့ ဝင်ရောက်နိုင်ရန် Router ၏ Public IP Port 80 သို့ လာသမျှ Traffic ကို အတွင်း Private IP ဆီသို့ လွှဲပေးခြင်း။

```
[ Local PC: 192.168.1.10 ] --(Port: 45000)--> [ Router / NAT ] --(Public IP: 203.0.113.5:61001)--> [ Web Server ]
```

---

## ၄။ Transport Protocols: TCP vs UDP

| အချက်အလက် | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection Type** | Connection-Oriented (ချိတ်ဆက်မှု အရင်တည်ဆောက်ရသည်) | Connectionless (တိုက်ရိုက် ပစ်လွှတ်သည်) |
| **Reliability** | အလွန်စိတ်ချရသည် (Packet ပျောက်ပါက ပြန်ပို့ပေးသည် - Retransmission) | အာမမခံပါ (Packet ပျောက်သွားနိုင်သည် - Best effort) |
| **Speed** | နှေးသည် (Handshake & Acknowledgment overhead ရှိသည်) | အလွန်မြန်သည် (Overhead မရှိသလောက် နည်းသည်) |
| **Use Cases** | Web Browsing (HTTP/HTTPS), Database (MySQL), SSH, Email (SMTP) | Video Streaming, Online Gaming, VoIP Calls, DNS Queries |

### TCP 3-Way Handshake (Connection တည်ဆောက်ခြင်း)
```
Client                                  Server
  │                                       │
  │ --- 1. SYN (Sequence = 100) --------> │ (Client: "ချိတ်ဆက်ခွင့် ပြုပါ")
  │                                       │
  │ <--- 2. SYN-ACK (Seq=300, Ack=101) -- │ (Server: "လက်ခံပါသည်၊ ချိတ်ဆက်ပါ")
  │                                       │
  │ --- 3. ACK (Seq=101, Ack=301) ------> │ (Client: "အတည်ပြုပါသည်၊ အဆင်သင့်ဖြစ်ပါပြီ")
  │                                       │
  [ ===== Connection Established - Data Transfer Starts ===== ]
```

---

## ၅။ အသုံးအများဆုံး Standard Ports & Protocols Cheatsheet

| Port | Protocol | ရည်ရွယ်ချက် (Purpose) |
| :---: | :--- | :--- |
| **22** | **SSH** (Secure Shell) | Linux Server များကို လုံခြုံစွာ Remote Login ဝင်ရောက်ခြင်း |
| **53** | **DNS** (Domain Name System) | Domain Name မှ IP သို့ ရှာဖွေခြင်း (UDP/TCP) |
| **80** | **HTTP** | Unencrypted Web Traffic |
| **443** | **HTTPS** (HTTP over TLS/SSL) | Encrypted Secure Web Traffic |
| **3306**| **MySQL / MariaDB** | Database ချိတ်ဆက်မှု Port |
| **5432**| **PostgreSQL** | PostgreSQL Database Port |
| **6379**| **Redis** | Redis In-Memory Cache Port |
| **8080**| **HTTP Alternative** | Development Server (Tomcat, Spring Boot, Vue/React Dev) |

---

## ၆။ Production Troubleshooting CLI Commands (လက်တွေ့ Genba စစ်ဆေးနည်း)

လုပ်ငန်းခွင်တွင် Server သို့ ချိတ်မရခြင်း၊ Slow ဖြစ်ခြင်း ကြုံတွေ့ရပါက အောက်ပါ Commands များကို အဆင့်ဆင့် သုံးစွဲရပါမည်:

```bash
# ၁။ Network ချိတ်ဆက်မှု ရှိမရှိ စစ်ဆေးခြင်း (ICMP Ping)
ping -c 4 8.8.8.8

# ၂။ Packet များ မည်သည့် Router/Node များ ဖြတ်သွားသည်ကို လမ်းကြောင်းလိုက်ခြင်း
traceroute 1.1.1.1
# (Windows: tracert 1.1.1.1)

# ၃။ DNS Record များနှင့် Resolution အချိန်ကို စစ်ဆေးခြင်း
dig +trace example.com
nslookup api.production.internal

# ၄။ သက်ဆိုင်ရာ Port ဖွင့်မဖွင့် (Port Listening) စစ်ဆေးခြင်း
nc -zv 192.168.1.50 3306      # Netcat ဖြင့် MySQL port စစ်ဆေးခြင်း
curl -Iv https://api.site.com  # HTTP Response Header & SSL handshake စစ်ဆေးခြင်း

# ၅။ လက်ရှိ Server ပေါ်တွင် မည်သည့် Port များ ဖွင့်ထားသည်ကို စစ်ဆေးခြင်း (Linux)
ss -tuln
# သို့မဟုတ်
netstat -tulpn
```

---

## ၇။ အကျဉ်းချုပ် ကောင်းကျိုးများနှင့် အားသာချက်များ (Advantages)

1. **Root Cause Analysis မြန်ဆန်ခြင်း**: Application Error (500) နှင့် Network Level Error (Connection Timeout, DNS Resolution Failed) ကို ချက်ချင်း ခွဲခြားနိုင်ခြင်း။
2. **Infrastructure Cost Optimization**: မလိုလားအပ်သော Public IP နှင့် NAT Gateway Data Transfer အကုန်အကျများကို လျှော့ချနိုင်ခြင်း။
3. **High Security Architecture**: Firewall နှင့် Security Group များတွင် မလိုအပ်သော Port များကို ပိတ်ထားနိုင်ပြီး SSH/DB ကဲ့သို့သော Sensitive Service များကို Private Network အတွင်း လုံခြုံစွာ ကာကွယ်နိုင်ခြင်း။
