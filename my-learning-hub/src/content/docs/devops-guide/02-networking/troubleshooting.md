---
title: "🌐 Production Network Incident Troubleshooting Guide"
description: "🌐 Production Network Incident Troubleshooting Guide"
---


> **Network Outage များ၊ DNS ကျိုးပေါက်ခြင်း၊ SSL ချို့ယွင်းချက်များနှင့် Nginx 502/504 Errors များကို စနစ်တကျ ဖြေရှင်းနည်း**

---

## 🧭 Network Troubleshooting ၏ ရွှေရောင် စည်းမျဉ်း (Bottom-Up Approach)

ကွန်ရက် ပြဿနာတစ်ခုကို ဖြေရှင်းရာတွင် OSI Model ၏ အောက်ခြေမှ အထက်သို့ စနစ်တကျ စစ်ဆေးရမည် ဖြစ်ပါသည်:
```text
[ Layer 7: Application ]  ──► 502/504 Bad Gateway, HTTP Headers, SSL Errors
            ▲
[ Layer 4: Transport ]    ──► Port Closed, Connection Refused, SYN Timeout
            ▲
[ Layer 3: Network ]      ──► Routing, Default Gateway, Ping/ICMP, Subnetting
            ▲
[ Layer 1-2: Physical/Link] ──► Network Interface Down, Cable/Virtual Link Disconnected
```

---

## 🚨 Scenario 1: "Website is Down" (ပြည့်စုံသော အဆင့်ဆင့် စုံစမ်းစစ်ဆေးမှု Runbook)

User များထံမှ "Website သို့ ဝင်၍မရတော့ပါ" ဟု Report ရောက်လာပါက အောက်ပါ စစ်ဆေးမှု (၅) ဆင့်ကို အစဉ်လိုက် ပြုလုပ်ပါ:

### အဆင့် ၁: DNS အဆင့် စစ်ဆေးခြင်း
```bash
dig +short mycompany.com
```
- **ရလဒ်တွင် IP မထွက်ပါက**: Domain registration သက်တမ်းကုန်သွားခြင်း သို့မဟုတ် Route 53 / Nameserver settings လွဲနေခြင်း ဖြစ်သည်။
- **ရလဒ်တွင် IP ထွက်ပေါ်ပါက**: အဆင့် ၂ သို့ ဆက်သွားပါ။

### အဆင့် ၂: Server အဆင့် Connectivity စစ်ဆေးခြင်း
```bash
ping -c 3 <SERVER_IP>
```
- **Packet Loss 100% ဖြစ်ပါက**: Server ပြုတ်ကျ (powered off) နေခြင်း သို့မဟုတ် Cloud Provider ၏ Security Group/Firewall မှ ICMP ကို ပိတ်ထားခြင်း ဖြစ်နိုင်သည်။

### အဆင့် ၃: Port & TCP Connection စစ်ဆေးခြင်း
```bash
nc -zv -w 3 <SERVER_IP> 443
# သို့မဟုတ်
curl -Iv https://mycompany.com
```
- **"Connection Refused" တက်ပါက**: Server ပွင့်နေသော်လည်း Nginx/Web Server ဝန်ဆောင်မှု သေနေခြင်း ဖြစ်သည်။
- **"Connection Timed Out" တက်ပါက**: AWS Security Group သို့မဟုတ် `ufw` Firewall မှ Port 443 ကို ပိတ်ထားခြင်း ဖြစ်သည်။

### အဆင့် ၄: Server အတွင်းပိုင်း ဝန်ဆောင်မှု စစ်ဆေးခြင်း (SSH ဝင်ရောက်ပြီး)
```bash
# Nginx အခြေအနေ စစ်ဆေးပါ
sudo systemctl status nginx

# Port 80/443 နားထောင်နေမှု စစ်ဆေးပါ
sudo ss -tulpn | grep -E ":(80|443)\b"
```

### အဆင့် ၅: Backend Application စစ်ဆေးခြင်း
```bash
# Nginx Error log ကို စစ်ဆေးပါ
sudo tail -n 50 /var/log/nginx/error.log
```

---

## 🚨 Scenario 2: DNS Resolution Failures (`NXDOMAIN` vs `SERVFAIL`)

### 症状 (Symptoms):
- `curl: (6) Could not resolve host: api.mycompany.com`

### 🔍 စုံစမ်းစစ်ဆေးနည်း:
```bash
# DNS Query အပြည့်အစုံကို စစ်ဆေးပါ
dig api.mycompany.com

# Authoritative Nameserver သို့ တိုက်ရိုက် မေးမြန်းပါ
dig @ns-123.awsdns.org api.mycompany.com
```

### 💡 Root Cause ခွဲခြမ်းစိတ်ဖြာခြင်း:
1. **`NXDOMAIN` (Non-Existent Domain)**: ဤ Domain သို့မဟုတ် Subdomain အမည်ဖြင့် DNS Record လုံးဝ မရှိခြင်း (Typo စစ်ဆေးပါ သို့မဟုတ် A/CNAME record အသစ် ထည့်ပေးပါ)။
2. **`SERVFAIL` (Server Failure)**: DNS Server ဘက်မှ DNSSEC key validation မအောင်မြင်ခြင်း သို့မဟုတ် Zone file syntax မှားယွင်းနေခြင်း။
3. **DNS Propagation Delay**: DNS record အသစ် ပြောင်းလဲပြီးနောက် ကမ္ဘာအနှံ့ TTL (Time To Live) မစေ့သေးသဖြင့် အချို့ဒေသများတွင် မရသေးခြင်း (TTL ကို record မပြောင်းမီ ကြိုတင် လျှော့ချထားရမည်)။

---

## 🚨 Scenario 3: "Connection Refused" vs "Connection Timed Out"

| အခြေအနေ | အဓိပ္ပာယ် | ဖြစ်နိုင်သော အကြောင်းရင်း | ဖြေရှင်းနည်း |
|---|---|---|---|
| **Connection Refused** | Client Packet သည် Server သို့ အောင်မြင်စွာ ရောက်ရှိသော်လည်း Server OS မှ **RST (Reset)** packet ဖြင့် ချက်ချင်း ငြင်းပယ်လိုက်ခြင်း | ပစ်မှတ်ထားသော Port (ဥပမာ 80 သို့မဟုတ် 3000) တွင် မည်သည့် Application မှ နားထောင် (listen) မနေခြင်း | Server ပေါ်တွင် `systemctl start nginx` သို့မဟုတ် application daemon ကို စတင်ပါ။ `ss -tulpn` ဖြင့် port ဖွင့်ထားမှု verify လုပ်ပါ။ |
| **Connection Timed Out** | Client မှ ပို့လိုက်သော SYN packet သည် Server ဆီသို့ လုံးဝ မရောက်ရှိဘဲ လမ်းခုလတ်တွင် တိတ်ဆိတ်စွာ ပျောက်ဆုံးသွားခြင်း | AWS Security Group, Network ACL, Router NAT သို့မဟုတ် `ufw` firewall မှ packet ကို drop ချထားခြင်း | AWS Security Group Inbound Rule တွင် Port (80/443) ကို `0.0.0.0/0` ဖြင့် ဖွင့်ပေးပါ။ `sudo ufw allow <port>` လုပ်ပါ။ |

---

## 🚨 Scenario 4: SSL/TLS Certificate Errors

### 症状 (Symptoms):
- Browser တွင် `Your connection is not private (NET::ERR_CERT_DATE_INVALID)` တက်ခြင်း။
- `curl: (60) SSL certificate problem: certificate has expired`

### 🔍 စုံစမ်းစစ်ဆေးနည်း:
```bash
# OpenSSL ဖြင့် Certificate ၏ သက်တမ်းကုန်ဆုံးမည့်ရက်နှင့် အချက်အလက်များကို စစ်ဆေးပါ
echo | openssl s_client -servername mycompany.com -connect mycompany.com:443 2>/dev/null | openssl x509 -noout -dates -subject
```

### 💡 ဖြေရှင်းနည်း (Resolution):
1. **Certificate သက်တမ်း ကုန်ဆုံးသွားပါက**:
   ```bash
   # Let's Encrypt Certbot သက်တမ်းတိုးခြင်း
   sudo certbot renew --force-renewal
   sudo systemctl reload nginx
   ```
2. **Incomplete Certificate Chain (Intermediate Cert Missing)**:
   - Nginx configuration တွင် `ssl_certificate` ကို `cert.pem` တစ်ခုတည်း မပေးရပါ။ Root နှင့် Intermediate CA များ ပါဝင်သော **`fullchain.pem`** ကို ညွှန်ပေးရမည်:
     ```nginx
     ssl_certificate /etc/letsencrypt/live/mycompany.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/mycompany.com/privkey.pem;
     ```

---

## 🚨 Scenario 5: 502 Bad Gateway vs 504 Gateway Timeout in Nginx

### 1️⃣ 502 Bad Gateway
- **အဓိပ္ပာယ်**: Nginx သည် Reverse Proxy အဖြစ် ရှေ့မှ ခံထားသော်လည်း ၎င်းချိတ်ဆက်ရမည့် Backend Application (Node.js/Gunicorn/PHP-FPM) သည် သေဆုံးနေခြင်း သို့မဟုတ် listening မလုပ်ထားခြင်း။
- **Nginx Error Log**:
  ```text
  [error] 1234#0: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 1.2.3.4, server: api.com, request: "GET /api HTTP/1.1", upstream: "http://127.0.0.1:3000/api"
  ```
- **ဖြေရှင်းနည်း**: Backend Application (Port 3000) ကို `systemctl restart myapp` ဖြင့် ပြန်လည် စတင်ပါ။

### 2️⃣ 504 Gateway Timeout
- **အဓိပ္ပာယ်**: Backend Application သည် အသက်ရှင်နေပြီး request ကို လက်ခံလိုက်သော်လည်း Database တွင် Slow Query မိနေခြင်း သို့မဟုတ် CPU over-utilize ဖြစ်နေသဖြင့် Nginx ၏ timeout (Default: 60s) အတွင်း အဖြေမပေးနိုင်ဘဲ အချိန်စေ့သွားခြင်း။
- **Nginx Error Log**:
  ```text
  [error] 1234#0: *2 upstream timed out (110: Connection timed out) while reading response header from upstream
  ```
- **ဖြေရှင်းနည်း**: 
  - Backend Application ၏ Database queries များနှင့် API logic ကို optimize ပြုလုပ်ပါ။
  - လိုအပ်ပါက Nginx တွင် ယာယီ timeout တိုးမြှင့်ပါ:
    ```nginx
    proxy_connect_timeout 120s;
    proxy_send_timeout 120s;
    proxy_read_timeout 120s;
    ```

---

## 🚨 Scenario 6: MTU Size & SSH Freezing / Hanging (Packet Drop at Large Payloads)

### 症状 (Symptoms):
- SSH login သည် စကားဝှက်ရိုက်ပြီးနောက် ချက်ချင်း freeze ဖြစ်သွားခြင်း။
- `ls -la` ကဲ့သို့ output တိုတို ရိုက်ပါက အလုပ်လုပ်ပြီး `cat bigfile.txt` ကဲ့သို့ data ကြီးကြီး ထုတ်ပါက connection ပြတ်တောက်သွားခြင်း။

### 💡 Root Cause:
- Network Path တွင် **MTU (Maximum Transmission Unit)** အရွယ်အစား မညီမျှခြင်း (ဥပမာ- VPN သို့မဟုတ် AWS Jumbo frames 9001 vs Standard 1500)။ Router မှ packet fragment မလုပ်နိုင်ဘဲ drop ချပစ်ခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# Network interface ၏ MTU ကို Standard 1500 သို့မဟုတ် 1400 သို့ ယာယီ လျှော့ချစမ်းသပ်ခြင်း
sudo ip link set dev eth0 mtu 1400
```
