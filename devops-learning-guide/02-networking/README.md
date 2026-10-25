---
title: "Module 02: Networking Fundamentals for DevOps Engineers"
description: "Production Network Flow, TCP/IP, DNS, Reverse Proxies, Firewalls & Network Diagnostics Mastery"
---

# 🌐 Module 02: Networking Fundamentals for DevOps Engineers

> **Production Network Flow, TCP/IP, DNS, Reverse Proxies, Firewalls & Network Diagnostics Mastery**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Production Network Flow, TCP/IP, DNS, Reverse Proxies, Firewalls & Network Diagnostics Mastery**
- **Track Level**: Core Foundation (အခြေခံအုတ်မြစ်)
- **Target Audience**: DevOps Engineers, Cloud Administrators, Software Developers
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 2. Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)
ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -
1. IP Addressing (IPv4 vs IPv6), Public vs Private IP ranges (RFC 1918) နှင့် CIDR Subnetting (`/24`, `/16`, etc.) ကို တိကျစွာ တွက်ချက်ခွဲခြမ်းနိုင်ခြင်း။
2. TCP vs UDP ကွာခြားချက်၊ TCP Three-Way Handshake (SYN, SYN-ACK, ACK) နှင့် Ports/Sockets အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
3. DNS Resolution Flow (Root, TLD, Authoritative Nameservers) နှင့် DNS Records (A, CNAME, MX, TXT, NS) များကို စုံစမ်းစစ်ဆေးနိုင်ခြင်း။
4. HTTP/HTTPS Protocol, Request/Response Headers, HTTP Status Codes (2xx, 3xx, 4xx, 5xx) နှင့် SSL/TLS Handshake အဆင့်များကို ရှင်းလင်းစွာ ခွဲခြမ်းသိရှိခြင်း။
5. NAT (Network Address Translation), Firewalls (`ufw`, `iptables`, Security Groups) နှင့် Packet Filtering ကို စီမံနိုင်ခြင်း။
6. Reverse Proxy (Nginx) နှင့် Load Balancer (Layer 4 vs Layer 7) တို့၏ ကွာခြားချက်နှင့် Production Request Flow ကို ဒီဇိုင်းဆွဲနိုင်ခြင်း။
7. Network Diagnostic Tools (`curl`, `dig`, `ss`, `ip`, `traceroute`, `ping`, `tcpdump`) ဖြင့် Network Outage များကို စနစ်တကျ Troubleshoot ပြုလုပ်နိုင်ခြင်း။

---

## 3. Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)
- [Module 01: Linux Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/01-linux/README.md) ကို ပြီးမြောက်ထားခြင်း (CLI အသုံးပြုမှုနှင့် process management အခြေခံ ရှိပြီးဖြစ်ခြင်း)။
- Web Client နှင့် Server အခြေခံ သဘောတရားကို သိရှိထားခြင်း။

---

## 4. Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **CIDR (Classless Inter-Domain Routing)** | IP လိပ်စာများကို အုပ်စုဖွဲ့၍ Subnet Mask ကို `/24`, `/16` စသည့် Prefix ဖြင့် အတိုကောက် သတ်မှတ်သည့် စနစ် | AWS VPC, Kubernetes Pod Network များနှင့် Docker Networks များ ဆောက်လုပ်ရာတွင် IP အရေအတွက် သတ်မှတ်ရန် မဖြစ်မနေ သုံးရသည်။ | `10.0.0.0/16` (IP ပေါင်း 65,536 ခု)၊ `192.168.1.0/24` (IP ပေါင်း 256 ခု) |
| **DNS (Domain Name System)** | လူဖတ်လွယ်သော Domain အမည် (e.g. `example.com`) ကို Computer နားလည်သော IP လိပ်စာ (e.g. `93.184.216.34`) သို့ ပြောင်းလဲပေးသည့် အင်တာနက် ဖုန်းစာအုပ် | DNS record မှားယွင်းပါက Website သို့ user များ လုံးဝ ဝင်ရောက်၍မရဘဲ Outage ဖြစ်ပွားသည်။ | `dig +short api.company.com` |
| **TCP Three-Way Handshake** | Data မပို့မီ Client နှင့် Server ကြား ချိတ်ဆက်မှု ခိုင်မာစေရန် SYN ➜ SYN-ACK ➜ ACK စနစ်ဖြင့် အပြန်အလှန် နှုတ်ဆက်အတည်ပြုခြင်း | Web traffic (HTTP/S), SSH, Database connections အားလုံးသည် Reliable data transfer အတွက် TCP handshake ပေါ်တွင် အလုပ်လုပ်သည်။ | `ss -tulpn` ဖြင့် TCP connection states စစ်ဆေးခြင်း။ |
| **Reverse Proxy** | Client များထံမှ Request များကို လက်ခံပြီး Internal Application Servers များဆီသို့ ကြားခံ လမ်းကြောင်းလွှဲ ပေးပို့ပေးသော Server (ဥပမာ- Nginx) | SSL Termination, Load Balancing, Caching နှင့် Backend app များအား လုံခြုံစွာ ဝှက်ထားရန် မရှိမဖြစ် သုံးရသည်။ | Port 80/443 မှ Request ကို internal Node/PHP app port 3000/8000 သို့ လွှဲပေးခြင်း။ |
| **SSL/TLS Handshake** | Browser နှင့် Server ကြား Data များကို Encrypt လုပ်ရန် Symmetric Session Key ကို လုံခြုံစွာ ညှိနှိုင်းဖလှယ်ခြင်း | HTTPS မပါသော Website များကို Browser မှ "Not Secure" ပြပြီး User sensitive data (passwords, cards) များ ကြားဖြတ် ခိုးယူခံရနိုင်သည်။ | `curl -Iv https://secure.bank.com` |
| **NAT (Network Address Translation)** | Private IP များကို Public IP အဖြစ် ပြောင်းလဲပေး၍ ပြင်ပ Internet သို့ ထွက်ခွင့်ပေးသော နည်းပညာ | AWS Private Subnet ရှိ Database သို့မဟုတ် App server များသည် အပြင်မှ တိုက်ရိုက် hack ဝင်မရသော်လည်း အပြင်သို့ patch updates ထွက်ဆွဲနိုင်စေသည်။ | AWS NAT Gateway သို့မဟုတ် Router NAT |

---

## 5. Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ IP Address အမျိုးအစားများနှင့် Private IP Ranges (RFC 1918)
အင်တာနက်လောကတွင် Private IP များကို Local Network (LAN, AWS VPC, Home Wi-Fi) များတွင်သာ အသုံးပြုခွင့်ပေးပြီး၊ Public Internet တွင် တိုက်ရိုက် လမ်းကြောင်း မဖောက် (non-routable) ထားပါ:

| Class | IP Range | အသုံးပြုသည့် ပုံစံ | စုစုပေါင်း IP အရေအတွက် |
|---|---|---|---|
| **Class A** | `10.0.0.0` – `10.255.255.255` (`10.0.0.0/8`) | AWS VPCs, Large Enterprise Networks | 16,777,216 |
| **Class B** | `172.16.0.0` – `172.31.255.255` (`172.16.0.0/12`) | Docker default bridge networks, Medium networks | 1,048,576 |
| **Class C** | `192.168.0.0` – `192.168.255.255` (`192.168.0.0/16`) | Home Wi-Fi Routers, Small Office LAN | 65,536 |

> [!IMPORTANT]
> **Subnet Mask တွက်ချက်ပုံ အခြေခံ**:
> - `/32`: IP လိပ်စာ (၁) ခုတည်း (Single Host)။
> - `/24`: နောက်ဆုံး 8 bits သည် host အတွက်ဖြစ်သဖြင့် $2^8 = 256$ IPs (254 usable IPs)။
> - `/16`: နောက်ဆုံး 16 bits သည် host အတွက်ဖြစ်သဖြင့် $2^{16} = 65,536$ IPs။

---

### ၅.၂ TCP vs UDP
- **TCP (Transmission Control Protocol)**:
  - **Connection-oriented**: Data မပို့မီ Handshake အရင်လုပ်သည်။
  - **Reliable**: Packet ပျောက်ဆုံးပါက ပြန်ပို့ပေးသည် (Retransmission)။ အစဉ်လိုက် ပြန်စီပေးသည်။
  - **အသုံးပြုမှု**: HTTP/HTTPS, SSH, FTP, MySQL/Postgres database connections။
- **UDP (User Datagram Protocol)**:
  - **Connectionless**: Handshake မလုပ်ဘဲ တန်းပို့သည်။ အမြန်ဆုံး data ပို့ခြင်းကို ဦးစားပေးသည်။
  - **Unreliable**: Packet ပျောက်သော်လည်း ပြန်မပို့ပါ။
  - **အသုံးပြုမှု**: DNS Queries (Port 53), Video Streaming, VoIP, Online Gaming, NTP (Network Time Protocol)။

---

### ၅.၃ DNS Resolution Flow (Domain Name တစ်ခု အလုပ်လုပ်ပုံ)
User တစ်ဦးမှ Browser တွင် `https://app.example.com` ဟု ရိုက်ထည့်လိုက်သောအခါ:
1. **Browser Cache & OS Cache**: မိမိစက်ထဲတွင် IP ရှိပြီးသားလား အရင်စစ်သည်။
2. **Recursive Resolver (ISP / 8.8.8.8)**: ရှာမတွေ့ပါက DNS Resolver သို့ မေးသည်။
3. **Root Nameserver (`.` )**: Top Level Domain (`.com` server) ၏ IP ကို ပြန်ပေးသည်။
4. **TLD Nameserver (`.com` )**: `example.com` ၏ Authoritative Nameserver (ဥပမာ- AWS Route 53) IP ကို ပြန်ပေးသည်။
5. **Authoritative Nameserver**: `app.example.com` ၏ တကယ့် Server Public IP (ဥပမာ- `52.77.10.20`) ကို အဖြေပြန်ပေးသည်။
6. **Browser**: အဆိုပါ IP ဆီသို့ TCP Handshake စတင် ချိတ်ဆက်သည်။

---

### ၅.၄ Reverse Proxy vs Load Balancer

```text
[ Client Request ] ──► [ Internet ] 
                            │
                            ▼
     [ Load Balancer (AWS ALB / HAProxy) ] ── (Traffic Distribution)
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    [ Web Server 1 (Nginx) ]    [ Web Server 2 (Nginx) ]  ── (Reverse Proxy & SSL Termination)
              │                           │
              ▼                           ▼
    [ App Service (Port 3000) ] [ App Service (Port 3000) ]
              │                           │
              └─────────────┬─────────────┘
                            ▼
              [ Database (RDS in Private Subnet) ]
```

---

## 6. Why This Matters in Real DevOps Work (လုပ်ငန်းခွင် လက်တွေ့ တန်ဖိုး)
1. **Zero-Downtime Deployment**: Nginx Reverse Proxy ကို အသုံးပြုခြင်းဖြင့် Backend App အသစ် reload ချချိန်တွင် Client ဘက်မှ Request ပြတ်တောက်မှု မရှိစေရန် စီမံနိုင်သည်။
2. **Security Isolation**: Database များကို Public Internet မှ တိုက်ရိုက် မမြင်စေဘဲ Private Subnet တွင် ထားရှိပြီး Nginx မှတဆင့်သာ ဝင်ရောက်စေခြင်းဖြင့် Hack ခံရနိုင်ခြေကို ၉၀% လျှော့ချနိုင်သည်။
3. **Root Cause Analysis (RCA)**: Website down ပြဿနာ ကြုံလာပါက DNS ကြောင့်လား၊ Firewall ကြောင့်လား၊ SSL သက်တမ်းကုန်သွား၍လား သို့မဟုတ် Backend App crash ဖြစ်၍လား ၅ မိနစ်အတွင်း ခွဲခြားသိရှိနိုင်သည်။

---

## 7. Network Diagnostic Workflow Tree (ပြဿနာရှာဖွေရေး ဆုံးဖြတ်ချက် သစ်ပင်)

```text
               [ "Website is Down" Alert ]
                            │
                            ▼
             Run: `dig +short domain.com`
                            │
         ┌──────────────────┴──────────────────┐
     [ No IP Returned ]                 [ IP Returned ]
         │                                     │
         ▼                                     ▼
   DNS Issue: Check NS /            Run: `ping -c 3 <IP>`
   Domain Registrar / Route 53                 │
                                  ┌────────────┴────────────┐
                          [ Packet Loss 100% ]       [ Ping Success ]
                                  │                         │
                                  ▼                         ▼
                         Host Down OR ICMP       Run: `curl -Iv https://domain.com`
                         Firewalled                         │
                                                ┌───────────┴───────────┐
                                          [ SSL Error ]        [ HTTP Status Code ]
                                                │                       │
                                                ▼                       ▼
                                       Certificate Expired/     200 OK: Normal
                                       Domain Mismatch          502: Bad Gateway (App Down)
                                                                504: Gateway Timeout
                                                                403: Forbidden (Firewall/WAF)
```

---

## 8. Step-by-Step Hands-on Commands (လက်တွေ့ လေ့ကျင့်ရန် Commands များ)

### အဆင့် ၁: Listening Ports နှင့် Network Sockets များ စစ်ဆေးခြင်း (`ss`)
```bash
# TCP (t), UDP (u), Listening (l), Numeric (n), Process Info (p) အားလုံး ကြည့်ရှုခြင်း
sudo ss -tulpn

# Port 80 သို့မဟုတ် 443 တွင် မည်သည့် process က နေရာယူထားသည်ကို သီးသန့်စစ်ဆေးခြင်း
sudo ss -tulpn | grep -E ":(80|443)\b"
```

### အဆင့် ၂: HTTP Requests နှင့် SSL Handshake စစ်ဆေးခြင်း (`curl`)
```bash
# Headers များ၊ Request/Response cycle နှင့် SSL Handshake အသေးစိတ်ကို စစ်ဆေးခြင်း
curl -Iv https://httpbin.org/get

# Response HTTP status code သာ သီးသန့် ထုတ်ယူခြင်း (Automation scripts များတွင် သုံးရန်)
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/200

# SSL Certificate သက်တမ်း ကုန်ဆုံးမည့်ရက်ကို Terminal မှ တိုက်ရိုက် စစ်ဆေးခြင်း
curl -vI https://google.com 2>&1 | grep -i "expire date"
```

### အဆင့် ၃: DNS Lookup Queries (`dig`)
```bash
# Domain တစ်ခု၏ A Record IP ကို တိုက်ရိုက် မေးမြန်းခြင်း
dig +short google.com

# DNS resolution အဆင့်ဆင့် ဖြတ်သန်းပုံ (Trace flow from Root to Authoritative)
dig +trace example.com

# သီးခြား DNS Server (e.g. Cloudflare 1.1.1.1) သို့ တိုက်ရိုက် မေးမြန်းခြင်း
dig @1.1.1.1 example.com A
```

### အဆင့် ၄: Ubuntu Firewall စီမံခန့်ခွဲခြင်း (`ufw`)
```bash
# Firewall status စစ်ဆေးခြင်း
sudo ufw status verbose

# SSH (22), HTTP (80) နှင့် HTTPS (443) port များကို ဖွင့်ပေးခြင်း
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# မလိုလားအပ်သော IP တစ်ခုကို လုံးဝ ပိတ်ပင်ခြင်း (Block malicious IP)
sudo ufw deny from 203.0.113.50

# Firewall ကို စတင် အသက်သွင်းခြင်း
sudo ufw enable
```

---

## 9. Nginx Reverse Proxy Configuration Example

Internal Node.js/Python/PHP application (Port 3000) ရှေ့တွင် Nginx Reverse Proxy တပ်ဆင်ပုံ:

```nginx
# ဖိုင်တည်နေရာ: /etc/nginx/sites-available/myapp.conf
server {
    listen 80;
    server_name api.mycompany.local;

    # Client Request Headers များကို Backend သို့ မပျောက်ပျက်ဘဲ လက်ဆင့်ကမ်း ပို့ဆောင်ခြင်း
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts (Backend တုံ့ပြန်မှု နှေးပါက 504 မတက်စေရန် ချိန်ညှိခြင်း)
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```bash
# Configuration Syntax စစ်ဆေးခြင်း
sudo nginx -t

# Nginx ကို Zero-Downtime ဖြင့် reload ပြုလုပ်ခြင်း
sudo systemctl reload nginx
```

---

## 10. Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| HTTP Code / Error | အဓိပ္ပာယ်နှင့် ဖြစ်နိုင်သော အကြောင်းရင်း | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **502 Bad Gateway** | Nginx Reverse Proxy သည် အလုပ်လုပ်နေသော်လည်း ၎င်းချိတ်ဆက်ရမည့် Backend App (Node/PHP/Python port 3000) သေဆုံးနေခြင်း သို့မဟုတ် listening မလုပ်ထားခြင်း | Backend service ပြေးနေခြင်း ရှိမရှိ စစ်ပါ: `systemctl status myapp` သို့မဟုတ် `sudo ss -tulpn \| grep 3000`။ App ကို restart ချပါ။ |
| **504 Gateway Timeout** | Backend App သည် အလုပ်လုပ်နေသော်လည်း Database slow query ကြောင့်ဖြစ်စေ၊ heavy computation ကြောင့်ဖြစ်စေ Nginx သတ်မှတ်ထားသော timeout (default 60s) အတွင်း data ပြန်မပို့နိုင်ခြင်း | Database slow queries များကို optimize လုပ်ပါ သို့မဟုတ် Nginx `proxy_read_timeout` ကို တိုးမြှင့်ပေးပါ။ |
| **Connection Refused** | Client မှ ချိတ်ဆက်သော Port တွင် မည်သည့် Service မှ နားထောင်မနေခြင်း သို့မဟုတ် Service မပွင့်သေးခြင်း | Server ပေါ်တွင် `ss -tulpn` ဖြင့် port နားထောင်နေမှု စစ်ပါ။ Service ကို start လုပ်ပါ။ |
| **SSL: CERTIFICATE_VERIFY_FAILED** | SSL Certificate သက်တမ်း ကုန်ဆုံးသွားခြင်း သို့မဟုတ် Domain name နှင့် Certificate အမည် မကိုက်ညီခြင်း (Mismatch) | `certbot renew` ဖြင့် SSL သက်တမ်းတိုးပါ သို့မဟုတ် Certificate SANs (Subject Alternative Names) ကို ပြန်စစ်ပါ။ |

---

## 11. Security Best Practices (ကွန်ရက် လုံခြုံရေး အလေ့အကျင့်ကောင်းများ)
1. **Never Expose Internal Ports**: Database (3306, 5432) နှင့် Redis (6379) port များကို Public Internet သို့ မည်သည့်အခါမျှ မဖွင့်ပါနှင့်။ `127.0.0.1` သို့မဟုတ် Private Subnet တွင်သာ နားထောင်စေပါ။
2. **Force HTTPS Redirection**: Port 80 သို့ လာသော HTTP traffic အားလုံးကို Port 443 (HTTPS) သို့ 301 Permanent Redirect အမြဲ လုပ်ဆောင်ပါ။
3. **Hide Server Tokens**: Nginx configuration တွင် `server_tokens off;` ထည့်သွင်းထားခြင်းဖြင့် Web server version ကို ဖောက်ထွင်းသူများ မမြင်အောင် ဖုံးကွယ်ထားပါ။
4. **Rate Limiting**: API endpoints များကို Brute-force တိုက်ခိုက်မှု မခံရစေရန် Nginx တွင် `limit_req_zone` ဖြင့် rate limiting ကန့်သတ်ပါ။

---

## 12. Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Nginx Reverse Proxy & Custom Domain Simulation**
1. မိမိစက်တွင် Python ဖြင့် dummy application တစ်ခုကို port 4000 တွင် run ပါ:
   ```bash
   python3 -m http.server 4000 &
   ```
2. Nginx configuration ဖိုင်အသစ် တစ်ခု ဖန်တီး၍ port 80 မှ port 4000 သို့ Reverse Proxy လမ်းကြောင်းလွှဲပေးပါ:
   - Server Name: `devops.test`
3. Local စက်၏ `/etc/hosts` ဖိုင်တွင် အောက်ပါအတိုင်း Domain override သတ်မှတ်ပါ:
   ```text
   127.0.0.1 devops.test
   ```
4. Terminal မှ `curl -I http://devops.test` ဖြင့် စမ်းသပ်စစ်ဆေးပြီး `HTTP/1.1 200 OK` ရရှိအောင် ပြုလုပ်ပါ။

---

## 13. Challenge Exercise (စိန်ခေါ်မှု လေ့ကျင့်ခန်း)

**Challenge: Automated Website Healthcheck & Latency Probe Script**
- URL တစ်ခု (ဥပမာ `https://example.com`) ကို ၅ စက္ကန့်တစ်ကြိမ်စစ်ဆေးပြီး၊ HTTP Status code, DNS lookup time, SSL handshake time နှင့် Total response time များကို အောက်ပါအတိုင်း format ဖော်ပြပေးသော Bash script တစ်ခုကို `curl -w` parameters အသုံးပြု၍ ရေးသားပါ:
  ```text
  [2026-10-25 15:30:00] URL: https://example.com | Status: 200 | DNS: 0.015s | TLS: 0.042s | Total: 0.124s
  ```

---

## 14. Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. Private IP Range `10.0.0.0/16` နှင့် `192.168.1.0/24` တွင် အသုံးပြုနိုင်သော Host IP အရေအတွက် မည်မျှစီ ရှိသနည်း?
2. Web application တစ်ခုတွင် `502 Bad Gateway` နှင့် `504 Gateway Timeout` မည်သို့ ကွာခြားသနည်း?
3. DNS Record အမျိုးအစားများဖြစ်သော `A Record` နှင့် `CNAME Record` ကွာခြားချက်မှာ အဘယ်နည်း?
4. TCP 3-way Handshake တွင် ပါဝင်သော packet (၃) ခု၏ အမည်များကို အစဉ်လိုက် ဖော်ပြပါ။

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. `10.0.0.0/16`: $2^{16} - 2 = 65,534$ usable hosts။ `192.168.1.0/24`: $2^8 - 2 = 254$ usable hosts (Network ID နှင့် Broadcast IP နှုတ်ပြီး)။
2. `502 Bad Gateway` သည် Nginx နောက်ကွယ်ရှိ backend application (Node/PHP) သေနေ၍ ချက်ချင်း ငြင်းပယ်ခံရခြင်း ဖြစ်သည်။ `504 Gateway Timeout` သည် backend application အလုပ်လုပ်နေသော်လည်း သတ်မှတ်ထားသော အချိန်အတွင်း response မပေးနိုင်ဘဲ အချိန်စေ့သွားခြင်း ဖြစ်သည်။
3. `A Record` သည် Domain အမည်ကို IPv4 လိပ်စာဆီသို့ တိုက်ရိုက် ညွှန်ပြသည် (e.g. `example.com` ➜ `1.2.3.4`)။ `CNAME Record` သည် Domain အမည်တစ်ခုကို အခြား Domain အမည်တစ်ခုဆီသို့ ညွှန်ပြသည် (e.g. `www.example.com` ➜ `example.com`)။
4. 1. `SYN` (Synchronize) ➜ 2. `SYN-ACK` (Synchronize-Acknowledge) ➜ 3. `ACK` (Acknowledge)။
</details>

---

## 15. Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: User များမှ "Website အလွန်နှေးနေသည်" သို့မဟုတ် "502 Bad Gateway ဖြစ်နေသည်" ဟု အကြောင်းကြားလာပါက သင် မည်သို့ စတင် စုံစမ်းစစ်ဆေးမည်နည်း?**
> **Sample Answer**:
> "ပထမဦးစွာ `curl -Iv https://domain.com` ဖြင့် ပြင်ပမှ Response status code နှင့် latency ကို တိုင်းတာပါမည်။ 502 တက်နေပါက Reverse Proxy (Nginx) နှင့် Backend App ကြား ပြဿနာဖြစ်ကြောင်း ချက်ချင်း သိရှိနိုင်ပါသည်။ ထို့နောက် Server ပေါ်သို့ ဝင်ရောက်ပြီး Nginx error log (`/var/log/nginx/error.log`) ကို စစ်ဆေးပါမည်။ ထိုအခါ `Connection refused while connecting to upstream` တွေ့ရပါက Backend Application (Node/Gunicorn/PHP-FPM) service crash ဖြစ်နေကြောင်း သေချာသဖြင့် `systemctl status <app>` နှင့် `journalctl -u <app>` တို့ဖြင့် crash ဖြစ်ရသည့် root cause ကို ရှာဖွေ ပြင်ဆင်ပါမည်။"

**Q2: Layer 4 Load Balancer နှင့် Layer 7 Load Balancer ကွာခြားချက်ကို ရှင်းပြပါ။**
> **Sample Answer**:
> "Layer 4 (L4) Load Balancer သည် OSI Model ၏ Transport Layer (TCP/UDP IP and Port) အဆင့်တွင်သာ အလုပ်လုပ်ပြီး packet ၏ content ကို ဖွင့်မကြည့်ဘဲ အလွန်လျင်မြန်စွာ forward လုပ်ပေးပါသည် (ဥပမာ- AWS Network Load Balancer / NLB)။ Layer 7 (L7) Load Balancer သည် Application Layer (HTTP/HTTPS) အဆင့်တွင် အလုပ်လုပ်သဖြင့် HTTP Headers, Cookies, URL Path (ဥပမာ- `/api` ကို API servers ဆီသို့၊ `/images` ကို CDN/S3 ဆီသို့) အလိုက် အသိဉာဏ်ရှိရှိ ခွဲဝေပို့ဆောင်ပေးနိုင်ပါသည် (ဥပမာ- AWS Application Load Balancer / ALB သို့မဟုတ် Nginx)။"

---

## 16. Completion Checklist (ပြီးမြောက်မှု စစ်ဆေးချက်)
- [ ] CIDR notation (`/24`, `/16`) နှင့် Private IP ranges (RFC 1918) ကို နားလည်တွက်ချက်နိုင်ပြီ။
- [ ] DNS resolution flow နှင့် Record အမျိုးအစားများကို `dig` ဖြင့် စစ်ဆေးနိုင်ပြီ။
- [ ] `curl -Iv` ဖြင့် HTTP status codes, headers နှင့် SSL certificate validity ကို စစ်ဆေးနိုင်ပြီ။
- [ ] `ss -tulpn` ဖြင့် open ports များနှင့် listening daemons များကို ရှာဖွေနိုင်ပြီ။
- [ ] Nginx Reverse Proxy ကို config ရေးဆွဲပြီး backend application နှင့် ချိတ်ဆက်နိုင်ပြီ။

---

## 17. References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [Nginx Reverse Proxy Official Documentation](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Cloudflare Learning: How DNS Works](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [RFC 1918 - Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
