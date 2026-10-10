---
title: Phase 5 Lesson 13 — Nginx Architecture, Reverse Proxy & SSL
description: Nginx Event-driven Architecture, Master/Worker Processes, Reverse Proxy (proxy_pass), Upstream Load Balancing, Virtual Hosts နှင့် SSL Offloading (မြန်မာဘာသာ)
---

# 🌐 Phase 5 — Lesson 13: Nginx Architecture, Reverse Proxy & SSL

ခေတ်သစ် Web Infrastructure တွင် **Nginx (Engine-X)** သည် ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး High-Performance Web Server & Reverse Proxy ဖြစ်ပါသည်။

Apache ကဲ့သို့ Thread/Process per Connection မဟုတ်ဘဲ **Asynchronous, Non-blocking Event-driven Architecture** ကို အသုံးပြုထားသဖြင့် Nginx သည် Memory အလွန်နည်းပါးစွာဖြင့် Concurrent Connections သောင်းနှင့်ချီ၍ တစ်ပြိုင်နက်တည်း ချောမွေ့စွာ ကိုင်တွယ်နိုင်ပါသည်။

---

## 💡 ၁။ Nginx Architecture & Process Model

```
┌────────────────────────────────────────────────────────┐
│               Nginx Master Process (Root)              │
│        (Reads config, binds ports 80/443)              │
└──────────────────────────┬─────────────────────────────┘
                           │ (manages worker processes)
         ┌─────────────────┼─────────────────┐
         ▼                                   ▼
┌────────────────────────┐       ┌────────────────────────┐
│ Nginx Worker 1 (epoll) │       │ Nginx Worker 2 (epoll) │
│  (Non-blocking Event)  │       │  (Non-blocking Event)  │
└────────────────────────┘       └────────────────────────┘
```

* **Master Process**: Root အခွင့်အရေးဖြင့် run ပြီး Configuration များကို ဖတ်ကာ Port 80/443 ကို ဖွင့်ထားပေးသည်။
* **Worker Processes**: CPU Core အရေအတွက်အလိုက် (`worker_processes auto;`) မွေးဖွားပေးပြီး unprivileged user (`www-data`) ဖြင့် Client Requests သန်းပေါင်းများစွာကို CPU ချင့်ချိန် စီမံပေးသည်။

---

## 🔄 ၂။ Forward Proxy vs Reverse Proxy

* **Forward Proxy**: Client ဘက်ခြမ်းတွင် ရှိပြီး Client က အင်တာနက်သို့ ထွက်ရာတွင် ကူညီပေးသည် (ဥပမာ- VPN သို့မဟုတ် ကုမ္ပဏီရုံးတွင်း အင်တာနက် firewall)။
* **Reverse Proxy**: Server ဘက်ခြမ်းတွင် ရှိပြီး Client Users များက Backend Application Servers (Java, Node.js, Python, PHP) များကို တိုက်ရိုက်မမြင်နိုင်အောင် ကာကွယ်ပေးကာ Traffic များကို ကြားခံလက်ခံ၍ ခွဲဝေပို့ဆောင်ပေးသည်။

```
Client Browser ──[ HTTPS :443 ]──► Nginx (Reverse Proxy & SSL Offload)
                                            │
                                            ├──► Backend API 1 (http://127.0.0.1:8080)
                                            ├──► Backend API 2 (http://127.0.0.1:8081)
                                            └──► Static Assets (/var/www/html/dist)
```

---

## 🛠️ ၃။ Production Nginx Server Block Configuration

`/etc/nginx/sites-available/api.example.com` ဖိုင်တွင် Production Reverse Proxy ကို အောက်ပါအတိုင်း ရေးသားပါသည်:

```nginx
# Upstream Load Balancing Cluster
upstream backend_cluster {
    server 127.0.0.1:8080 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:8081 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

server {
    listen 80;
    server_name api.example.com;

    # HTTP to HTTPS Auto-Redirect
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # Modern SSL Protocols
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Static Assets Caching
    location /static/ {
        alias /var/www/api/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Reverse Proxy to Backend API
    location / {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        # Client Real IP Headers (Backend မှ Client IP အစစ်ကို သိစေရန်)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
```

---

## 🚨 ၄။ Nginx Configuration စစ်ဆေးခြင်းနှင့် Reload

Nginx Config ပြင်ဆင်ပြီးပါက **Syntax မှားယွင်းပါက Web Traffic တစ်ခုလုံး ပြတ်တောက်သွားနိုင်သည်**။ ထို့ကြောင့် မဖြစ်မနေ အမြဲစစ်ပါ:

```bash
# ၁။ Syntax စစ်ဆေးပါ (Syntax is OK & test is successful ဖြစ်မှသာ ရှေ့ဆက်ပါ)
sudo nginx -t

# ၂။ Zero-Downtime ဖြင့် Reload ပြုလုပ်ပါ (လက်ရှိ ချိတ်ဆက်ထားသော user မပြုတ်ကျပါ)
sudo systemctl reload nginx
```

---

## 🏋️ ၅။ Hands-on Practice

1. Ubuntu VM တွင် `sudo nginx -t` ရိုက်ပြီး default configuration စစ်ဆေးပါ။
2. `/etc/nginx/sites-available/default` ဖိုင်ကို `cat` ဖြင့် ဖွင့်ဖတ်ကြည့်ပါ။
3. `curl http://localhost` ရိုက်ပြီး Nginx Welcome Page HTML ထွက်/မထွက် စစ်ဆေးပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: Nginx Configuration ကို ပြင်ဆင်ပြီးပါက `systemctl restart` မလုပ်မီ မည်သည့် command ဖြင့် syntax စစ်ဆေးရမည်နည်း?
2. **မေးခွန်း ၂**: Nginx ကို Reverse Proxy အဖြစ် သုံးရာတွင် Backend Application ထံသို့ Client အသုံးပြုသူ၏ IP အစစ်အမှန် ရောက်ရှိစေရန် မည်သည့် Proxy Header ကို ထည့်ပေးရမည်နည်း?
3. **မေးခွန်း ၃**: Static Files (CSS, JS, Images) များကို Backend App သို့ မပို့ဘဲ Nginx မှ တိုက်ရိုက် serve ပေးခြင်း၏ အကျိုးကျေးဇူးမှာ အဘယ်နည်း?
