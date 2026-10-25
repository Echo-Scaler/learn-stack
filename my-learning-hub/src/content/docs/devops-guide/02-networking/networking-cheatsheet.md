---
title: "🌐 DevOps Networking Diagnostic Command Cheatsheet"
description: "🌐 DevOps Networking Diagnostic Command Cheatsheet"
---


> **Network Flow စစ်ဆေးခြင်း၊ Port စုံစမ်းခြင်း၊ DNS နှင့် HTTP/S အမှားရှာဖွေခြင်းတွင် မရှိမဖြစ် တူးလ်များ**

---

## 🔌 ၁။ Common Network Ports Reference (မကြာခဏ သုံးရသော Ports များ)

| Port | Protocol | Service / Application | DevOps Notes |
|:---:|:---:|---|---|
| **22** | TCP | **SSH** (Secure Shell) | Server remote management အတွက် သုံးသည်။ Production တွင် port ပြောင်းထားတတ်သည်။ |
| **53** | UDP/TCP | **DNS** (Domain Name System) | Domain resolution အတွက် UDP ကို အဓိကသုံးသည်။ Large zone transfer တွင် TCP သုံးသည်။ |
| **80** | TCP | **HTTP** (Plain Web Traffic) | မလုံခြုံသဖြင့် HTTPS (443) သို့ 301 Redirect ပြုလုပ်လေ့ရှိသည်။ |
| **443** | TCP | **HTTPS** (TLS/SSL Encrypted) | Standard Production Web Traffic port။ |
| **3306** | TCP | **MySQL / MariaDB** | Database port။ Public internet သို့ လုံးဝ မဖွင့်ရ။ |
| **5432** | TCP | **PostgreSQL** | Database port။ Private Subnet တွင်သာ နားထောင်စေရမည်။ |
| **6379** | TCP | **Redis In-Memory Cache** | Cache & Queue port။ Password authentication မဖြစ်မနေ ထည့်ရမည်။ |
| **8080** | TCP | **Alternative HTTP / App Port** | Tomcat, Spring Boot, Jenkins, Node.js တို့ မကြာခဏ သုံးသည်။ |
| **9090** | TCP | **Prometheus Server** | DevOps Monitoring metrics scraping port။ |
| **3000** | TCP | **Grafana / Node.js Frontend** | Monitoring Dashboard သို့မဟုတ် Frontend dev server port။ |

---

## 🚀 ၂။ `curl` — HTTP/HTTPS Power Diagnostic Tool

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `curl -I https://example.com` | **Headers Only**: Response headers များနှင့် HTTP status code သာ ထုတ်ယူသည်။ |
| `curl -Iv https://example.com` | **Verbose Mode**: IP connection, SSL handshake, Cipher suite နှင့် Headers အပြည့်အစုံကို ပြသသည်။ |
| `curl -L https://example.com` | **Follow Redirects**: 301/302 redirect ဖြစ်ပါက နောက်ဆုံး destination URL အထိ အလိုအလျောက် လိုက်သွားသည်။ |
| `curl -k https://127.0.0.1:8443` | **Insecure SSL**: Self-signed certificate ဖြစ်နေသော်လည်း SSL error ကို ကျော်တက်၍ စမ်းသပ်သည်။ |
| `curl -H "Host: myapp.internal" http://10.0.0.15` | **Custom Host Header**: DNS မပြောင်းသေးမီ Load Balancer သို့မဟုတ် Server IP ကို တိုက်ရိုက် စမ်းသပ်ခြင်း။ |
| `curl -X POST -H "Content-Type: application/json" -d '{"key":"val"}' https://api.com/data` | **POST JSON Request**: API သို့ JSON payload ပို့ဆောင်ခြင်း။ |
| `curl -s -o /dev/null -w "%{http_code}\n" https://example.com` | **Silent Status Code**: Script များတွင် Status code (200, 404, 500) တစ်ခုတည်း သီးသန့် ထုတ်ယူခြင်း။ |

### ⏱️ Advanced `curl` Latency Timing Breakdown:
Network latency အဆင့်ဆင့်ကို စက္ကန့်ပိုင်းအလိုက် တိုင်းတာရန်:
```bash
curl -w "DNS: %{time_namelookup}s | Connect: %{time_connect}s | TLS: %{time_appconnect}s | TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s https://example.com
```

---

## 🔍 ၃။ `dig` & `nslookup` — DNS Resolution Tools

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `dig +short example.com A` | Domain ၏ **A Record (IPv4)** လိပ်စာကို အတိုကောက် သာ ထုတ်ယူသည်။ |
| `dig example.com CNAME +short` | Domain ၏ **CNAME (Alias)** Record ကို စစ်ဆေးသည်။ |
| `dig example.com MX +short` | Mail Server (MX Record) များကို စစ်ဆေးသည်။ |
| `dig example.com TXT +short` | SPF, DKIM, Domain Verification TXT records များကို ကြည့်ရှုသည်။ |
| `dig @8.8.8.8 example.com` | သီးခြား DNS Server (Google DNS 8.8.8.8) သို့ တိုက်ရိုက် မေးမြန်းသည်။ |
| `dig +trace example.com` | Root Server မှ စတင်ကာ Authoritative Server အထိ **အဆင့်ဆင့် DNS ခရီးစဉ် (Trace)** ကို ခြေရာခံသည်။ |
| `dig -x 8.8.8.8 +short` | **Reverse DNS (PTR)**: IP လိပ်စာမှ Domain အမည်သို့ ပြောင်းပြန် ရှာဖွေခြင်း။ |

---

## 🔌 ၄။ `ss` — Socket Statistics (Modern `netstat` Replacement)

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `sudo ss -tulpn` | **Listening Ports အားလုံး**: TCP (`-t`), UDP (`-u`), Listening (`-l`), Process PID/Name (`-p`), Numeric IP (`-n`)။ |
| `ss -tulpn \| grep :80` | Port 80 တွင် မည်သည့် Application ပြေးနေသည်ကို စစ်ဆေးသည်။ |
| `ss -ta` | System ပေါ်ရှိ TCP connection အားလုံး (ESTABLISHED, CLOSE_WAIT, TIME_WAIT) ကို ပြသည်။ |
| `ss -s` | Socket Summary: လက်ရှိ စုစုပေါင်း connection အရေအတွက်ကို အကျဉ်းချုပ် ပြသည်။ |

---

## 🛣️ ၅။ `ip` Tool — Linux Modern Networking

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `ip a` (သို့မဟုတ် `ip addr`) | Network interface ကတ်များ (`eth0`, `lo`, `docker0`) နှင့် IP လိပ်စာများကို ပြသသည်။ |
| `ip route show` | Routing Table: Default Gateway (e.g. `default via 192.168.1.1 dev eth0`) ကို ပြသည်။ |
| `ip link show` | Physical network link ၏ အခြေအနေ (UP/DOWN, MTU size) ကို စစ်ဆေးသည်။ |
| `ip neigh` | ARP Cache: Local network အတွင်း ချိတ်ဆက်ထားသော devices များ၏ MAC address ကို ပြသည်။ |

---

## 📡 ၆။ `ping` & `traceroute` — Connectivity & Path Tracing

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `ping -c 4 8.8.8.8` | ICMP Echo Request Packet (၄) ခု ပို့ပြီး latency နှင့် packet loss ကို စစ်ဆေးသည်။ |
| `ping -i 0.2 -c 10 10.0.0.1` | Packet များကို 0.2 စက္ကန့်ခြား အမြန်ပို့ပြီး Network Jitter ကို စစ်ဆေးသည်။ |
| `traceroute -n example.com` | Target server သို့ ရောက်ရှိရန် ကြားခံ Router Hops များကို IP ဖြင့် ပြသသည်။ |
| `mtr example.com` | Ping နှင့် Traceroute နှစ်ခုကို ပေါင်းစပ်ထားသော Real-time dynamic network quality monitor။ |

---

## 🛡️ ၇။ `ufw` — Ubuntu Uncomplicated Firewall

| Command Syntax | အသုံးပြုပုံနှင့် ရှင်းလင်းချက် |
|---|---|
| `sudo ufw status verbose` | Firewall စည်းမျဉ်းများနှင့် လက်ရှိ အခြေအနေကို စစ်ဆေးသည်။ |
| `sudo ufw default deny incoming` | ပြင်ပမှ ဝင်လာသော traffic အားလုံးကို Default အနေဖြင့် ပိတ်ချသည်။ |
| `sudo ufw default allow outgoing` | Server အတွင်းမှ အပြင်သို့ ထွက်သော traffic များကို ခွင့်ပြုသည်။ |
| `sudo ufw allow 22/tcp` | SSH port 22 ကို ဖွင့်ပေးသည်။ |
| `sudo ufw allow proto tcp from 192.168.1.0/24 to any port 3306` | MySQL port (3306) သို့ Internal Subnet (`192.168.1.0/24`) မှသာ ဝင်ခွင့်ပြုသည်။ |
| `sudo ufw delete allow 80/tcp` | Port 80 ဖွင့်ထားသော rule ကို ပြန်လည် ဖျက်ပစ်သည်။ |

---

## 🦈 ၈။ `tcpdump` — Deep Packet Sniffing & Capture

```bash
# eth0 interface ပေါ်တွင် port 80 traffic များကို real-time ဖမ်းယူကြည့်ရှုခြင်း
sudo tcpdump -i eth0 port 80 -n

# သီးခြား IP တစ်ခုနှင့် ဆက်သွယ်နေသော packet များကို ဖမ်းယူခြင်း
sudo tcpdump -i eth0 host 192.168.1.50 -n

# Packet အားလုံးကို Wireshark ဖြင့် ပြန်လည်ဖွင့်ကြည့်နိုင်ရန် .pcap ဖိုင်အဖြစ် သိမ်းဆည်းခြင်း
sudo tcpdump -i eth0 port 443 -w /tmp/capture.pcap
```
