---
title: DNS, HTTP vs HTTPS & TLS/SSL Certificates
description: DNS Resolution Flow, Record Types, HTTP vs HTTPS, TLS Handshake နှင့် Certificates
---

## ၁။ DNS (Domain Name System) Resolution Flow

DNS သည် လူသားဖတ်နိုင်သော နာမည် (`api.example.com`) မှ IP သို့ ပြောင်းပေးသည့် အင်တာနက် လိပ်စာစာအုပ်စနစ် ဖြစ်သည်။

```
Client -> 1. Local Cache -> 2. Resolver (8.8.8.8) -> 3. Root DNS (.)
       -> 4. TLD DNS (.com) -> 5. Authoritative Nameserver (Route 53) -> IP ရရှိ
```

### အဓိက DNS Record Types
- **A:** Domain to IPv4 (`example.com -> 93.184.216.34`)
- **AAAA:** Domain to IPv6
- **CNAME:** Domain to Domain Alias (`www.example.com -> example.com`)
- **MX:** Mail Server Destination
- **TXT:** Text Data (SPF, DKIM, Domain Verification)

---

## ၂။ HTTP vs HTTPS

- **HTTP (Port 80):** Plain Text ဖြင့် ပို့ဆောင်သဖြင့် လမ်းခုလတ်တွင် Packet Sniffing ဖြင့် ဖတ်ရှုခိုးယူနိုင်သည်။
- **HTTPS (Port 443):** HTTP ဒေတာများကို TLS (Transport Layer Security) ဖြင့် Encrypt လုပ်ပြီးမှ ပို့ဆောင်သည်။

---

## ၃။ TLS/SSL Certificates & Handshake Flow

1. Client က Cipher Suites စာရင်းနှင့် "Client Hello" ပို့သည်။
2. Server က SSL Certificate (Public Key ပါဝင်သော) နှင့် "Server Hello" ပြန်ပို့သည်။
3. Client က Certificate Authority (CA) စစ်ဆေးပြီး Session Key တစ်ခုကို Server ၏ Public Key ဖြင့် Encrypt လုပ်၍ ပို့သည်။
4. Server က မိမိ၏ Private Key ဖြင့် Decrypt လုပ်ပြီး နှစ်ဦးစလုံး အမြန်နှုန်းမြင့်မားသော Symmetric Key (AES) ဖြင့် Data ဆက်သွယ်မှု စတင်သည်။
