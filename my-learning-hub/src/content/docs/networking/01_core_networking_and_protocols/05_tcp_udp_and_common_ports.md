---
title: TCP vs UDP, Ports & Protocols Master Reference
description: TCP 3-Way Handshake, UDP Datagrams, Well-Known Production Ports (22, 53, 80, 443, 3306, 5432, 6379, 8080, 9000)
---

## ၁။ TCP vs UDP နှိုင်းယှဉ်ချက်

| အင်္ဂါရပ် | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection Type** | Connection-Oriented (3-Way Handshake) | Connectionless (တိုက်ရိုက်လွှတ်သည်) |
| **Reliability** | စိတ်ချရသည် (Retransmission ရှိသည်) | အာမမခံပါ (Packet ပျောက်နိုင်သည်) |
| **Speed** | Heavy Overhead ကြောင့် အနည်းငယ် နှေးသည် | Low Overhead ကြောင့် အလွန်မြန်သည် |
| **Use Cases** | Web (HTTP/HTTPS), SSH, DB, Mail | Video Streaming, Gaming, DNS, VoIP |

---

## ၂။ TCP 3-Way Handshake အဆင့်ဆင့်

```
[ Client ]                                         [ Server ]
    │                                                  │
    │  1. SYN (Sequence = 100)                         │
    │ ───────────────────────────────────────────────► │
    │                                                  │
    │  2. SYN-ACK (Seq = 300, Ack = 101)               │
    │ ◄─────────────────────────────────────────────── │
    │                                                  │
    │  3. ACK (Ack = 301)                              │
    │ ───────────────────────────────────────────────► │
    │                                                  │
    ▼ ===== Connection Established (Data Flow) ======= ▼
```

---

## ၃။ လုပ်ငန်းခွင်သုံး Production Standard Ports Reference Table

| Port | Protocol / Service | အဓိက အသုံးပြုမှု | Firewall / Security အကြံပြုချက် |
| :---: | :--- | :--- | :--- |
| **22** | **SSH** | Linux Server Terminal Remote Access | Bastion Host / VPN မှသာ ဖွင့်ပါ (Internet လုံးဝမဖွင့်ရ) |
| **53** | **DNS** | Domain Name Resolution (UDP/TCP) | VPC Internal DNS သို့မဟုတ် Route 53 |
| **80** | **HTTP** | Unencrypted Web Traffic | Port 443 HTTPS သို့ Redirect လုပ်ရန်သာ သုံးပါ |
| **443** | **HTTPS** | Encrypted Secure Web Traffic (TLS) | Public ALB တွင် `0.0.0.0/0` ဖွင့်နိုင်သည် |
| **3306** | **MySQL** | Relational Database Engine | Private DB Subnet အတွင်း App SG မှသာ ဖွင့်ပါ |
| **5432** | **PostgreSQL** | Relational Database Engine | Private DB Subnet အတွင်း App SG မှသာ ဖွင့်ပါ |
| **6379** | **Redis** | In-Memory Caching & Sessions | Private Subnet အတွင်း Backend App မှသာ ဖွင့်ပါ |
| **8080** | **Alternative HTTP** | Node.js, Spring Boot, Jenkins | Reverse Proxy နောက်ကွယ်တွင် Internal သာ သုံးပါ |
| **9000** | **PHP-FPM** | FastCGI PHP Execution Engine | Localhost / Nginx မှသာ ခွင့်ပြုပါ |
