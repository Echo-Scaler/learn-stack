---
title: "15. CGI, FastCGI & PHP-FPM Architecture"
description: "CGI vs FastCGI ကွာခြားချက်၊ PHP-FPM Worker Pool Architecture၊ Nginx ချိတ်ဆက်မှု၊ pm.max_children Tuning နှင့် 502 Bad Gateway ဖြေရှင်းနည်းများ"
---

# CGI, FastCGI & PHP-FPM Architecture (Production Server Deep Dive)

PHP Web Application တစ်ခုသည် အင်တာနက်ပေါ်တွင် မည်သို့ Run နေသနည်း? Web Server (Nginx / Apache) က အသုံးပြုသူ၏ HTTP Request ကို လက်ခံရရှိပြီး PHP Code ထံသို့ မည်သို့ ပေးပို့သနည်း? ထိုမေးခွန်းများ၏ အဓိက အဖြေမှာ **CGI, FastCGI နှင့် PHP-FPM** ဖြစ်ပါသည်။

---

## ၁။ CGI ဆိုတာဘာလဲ? (Common Gateway Interface)

### (က) သမိုင်းကြောင်းနှင့် အလုပ်လုပ်ပုံ (What is Classic CGI?)
၁၉၉၀ ပြည့်လွန်နှစ်များတွင် Web Server (Apache) များသည် HTML, Image ကဲ့သို့သော Static ဖိုင်များကိုသာ ပြသနိုင်ခဲ့သည်။ Dynamic Content (ဒေတာဘေ့စ်မှ ဒေတာထုတ်ပြခြင်း) အတွက် Server သည် ပြင်ပ Script (Perl, C, PHP) များကို ခေါ်ယူ Run ပေးရန် စံသတ်မှတ်ချက်တစ်ခု လိုအပ်လာခဲ့ပြီး ၎င်းကို **CGI (Common Gateway Interface)** ဟု ခေါ်ဆိုခဲ့သည်။

```
[Browser Request] ──► [Web Server (Apache)]
                              │
                      (Fork New OS Process)
                              ▼
                     [PHP CLI Process Starts]
                              │ (Load PHP Engine, Parse Code, Run)
                              ▼
                     [Return HTML to Web Server]
                              │
                     [PHP Process KILLED (Exit)]
```

### (ခ) CGI ၏ အဓိက ပြဿနာကြီး (Why CGI is Dead in Production?)
Request တစ်ခု လာတိုင်း Web Server သည် Operating System (Linux) ထံတွင် **Process အသစ်တစ်ခုကို Fork (တည်ဆောက်)** ရပြီး PHP Engine တစ်ခုလုံးကို Memory ထဲ တင်ရသည်။ Request ပြီးသည်နှင့် ထို Process ကို ပြန်သတ်ပစ်သည်။
- အကယ်၍ တစ်စက္ကန့်လျှင် Request ၁,၀၀၀ လာပါက Server သည် Process အသစ် ၁,၀၀၀ ဆောက်လိုက် ဖျက်လိုက် လုပ်ရသဖြင့် **CPU & RAM ပြည့်ကျပ်သွားပြီး Server Crash** ဖြစ်သွားသည်။

---

## ၂။ FastCGI ဆိုတာဘာလဲ? (Persistent Worker Model)

CGI ၏ Fork Overhead ပြဿနာကို ဖြေရှင်းရန် **FastCGI** ပေါ်ပေါက်လာခဲ့သည်။
- FastCGI သည် Request တစ်ခုပြီးတိုင်း Process ကို မသတ်ပစ်ပါ။
- PHP Process များကို Memory ပေါ်တွင် အမြဲ အသင့်စောင့်ဆိုင်းနေစေသည် (**Persistent Worker Pool**).
- Request အသစ် ရောက်လာပါက အသင့်စောင့်နေသော Worker Process တစ်ခုထံသို့ Request ကို လွှဲပြောင်းပေးပြီး အဖြေပြန်ပို့စေသည်။ ပြီးလျှင် နောက် Request အတွက် ဆက်လက် အသင့်စောင့်နေပါသည်။

---

## ၃။ PHP-FPM ဆိုတာဘာလဲ? (FastCGI Process Manager)

**PHP-FPM (FastCGI Process Manager)** သည် PHP အတွက် တရားဝင် Production-Grade FastCGI Daemon ဖြစ်ပြီး ယနေ့ခေတ် Production Server များ (Nginx + PHP-FPM) ၏ ၉၉% တွင် အသုံးပြုနေသော အဓိက အင်ဂျင်ဖြစ်ပါသည်။

```
[Client / Browser]
        │ (HTTPS Request)
        ▼
[Nginx Web Server]
        │ (FastCGI Protocol via Unix Socket / TCP)
        ▼
[PHP-FPM Master Process (Root)]
   ├── Worker 1 (Handling Request A)
   ├── Worker 2 (Handling Request B)
   ├── Worker 3 (Idle - Waiting)
   └── Worker 4 (Idle - Waiting)
```

### Master Process နှင့် Worker Processes များ၏ တာဝန်များ:
1. **Master Process (PID 1 or Main Service)**:
   - Root privilege ဖြင့် စတင်သည်။
   - Worker processes များကို စောင့်ကြည့်သည် (Health Check)။
   - Worker တစ်ခု Memory Leak ဖြစ်၍ သေသွားပါက Worker အသစ် ချက်ချင်း ပြန်ဆောက်ပေးသည်။
   - Graceful Reload (Downtime မရှိဘဲ ကုဒ်အသစ် သို့မဟုတ် config အသစ် ထည့်သွင်းခြင်း) ကို လုပ်ဆောင်သည်။
2. **Worker Processes (`www-data` or `nginx` user)**:
   - သာမန် User Privilege ဖြင့်သာ Run သဖြင့် Security လုံခြုံသည်။
   - Client များထံမှ Request များကို တိုက်ရိုက် လက်ခံ၍ PHP Script များကို Execute လုပ်သည်။

---

## ၄။ Unix Domain Socket vs TCP Socket

Nginx နှင့် PHP-FPM ဆက်သွယ်ရာတွင် နည်းလမ်း ၂ မျိုး ရှိသည်:

| အချက်အလက် | Unix Domain Socket | TCP Socket |
| :--- | :--- | :--- |
| **ပုံစံ (Syntax)** | `unix:/run/php/php8.2-fpm.sock` | `127.0.0.1:9000` |
| **အလုပ်လုပ်ပုံ** | Linux Kernel ၏ File System Memory buffer ကို သုံးသည် | Loopback Network Stack (TCP/IP) ကို သုံးသည် |
| **အမြန်နှုန်း (Speed)** | **၁၅% မှ ၂၅% ပိုမိုမြန်ဆန်သည်** (TCP overhead မရှိ) | TCP handshake ကြောင့် အနည်းငယ် ပိုနှေးသည် |
| **အသုံးပြုသင့်သည့် အခြေအနေ** | Nginx နှင့် PHP-FPM သည် **Server တစ်ခုတည်း** ပေါ်တွင် ရှိသောအခါ | Nginx နှင့် PHP-FPM သည် **သီးခြား Server ခွဲထားသောအခါ** (Distributed) |

---

## ၅။ Production Nginx + PHP-FPM Configuration နမူနာ

```nginx
# /etc/nginx/sites-available/production-app.conf
server {
    listen 80;
    server_name api.myservice.com;
    root /var/www/my-app/public;

    index index.php index.html;

    # Static Assets (Images, CSS, JS) ကို PHP ဆီ မပို့ဘဲ Nginx က တိုက်ရိုက် ပို့ပေးသည်
    location ~* \.(jpg|jpeg|gif|png|css|js|ico|webp|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }

    # Dynamic Request အားလုံးကို index.php သို့ Route လုပ်သည်
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM သို့ FastCGI Protocol ဖြင့် လွှဲပြောင်းပေးခြင်း
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;

        # Timeout သတ်မှတ်ချက်များ (504 Gateway Timeout ကာကွယ်ရန်)
        fastcgi_connect_timeout 60s;
        fastcgi_send_timeout 180s;
        fastcgi_read_timeout 180s;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 256 16k;
    }
}
```

---

## ၆။ PHP-FPM Performance Tuning (`www.conf`)

Production Server ၏ RAM ပမာဏပေါ် မူတည်၍ `/etc/php/8.2/fpm/pool.d/www.conf` ကို တွက်ချက် ချိန်ညှိရပါမည်:

### Process Management (`pm`) ၃ မျိုး:
1. `pm = static`: Worker အရေအတွက်ကို အမြဲတမ်း ပုံသေ ဖွင့်ထားသည်။ (Traffic အလွန်များသော High-Performance Server များအတွက် အကောင်းဆုံး)။
2. `pm = dynamic`: အနည်းဆုံးနှင့် အများဆုံး သတ်မှတ်ထားပြီး Traffic အတက်အကျပေါ် မူတည်၍ Worker အရေအတွက် ပြောင်းလဲသည်။ (Standard Server များအတွက် အကြံပြုသည်)။
3. `pm = ondemand`: Request လာမှ Worker ဆောက်သည်၊ မလာပါက Worker များ အိပ်နေသည်။ (RAM နည်းသော VPS များအတွက်)။

### 💡 Production တွက်ချက်ပုံ ဥပမာ (RAM 8GB Server):
- Server ၏ စုစုပေါင်း RAM = 8,192 MB
- OS + MySQL + Nginx အတွက် ချန်ထားမည့် RAM = 3,000 MB
- PHP-FPM အတွက် သုံးနိုင်သော RAM = 5,192 MB
- PHP Worker တစ်ခု၏ ပျမ်းမျှ RAM သုံးစွဲမှု = 50 MB
- **`pm.max_children`** = 5,192 MB ÷ 50 MB ≈ **100**

```ini
; /etc/php/8.2/fpm/pool.d/www.conf
[www]
user = www-data
group = www-data
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 100
pm.start_servers = 20
pm.min_spare_servers = 10
pm.max_spare_servers = 30

; Memory Leak ကာကွယ်ရန် အလွန်အရေးကြီးသော Parameter:
; Worker တစ်ခုသည် Request 1,000 ကြိမ် ဖြေဆိုပြီးပါက ထို Worker ကို အသစ် ပြန်လဲပေးသည်
pm.max_requests = 1000

; နှေးကွေးသော Query များကို ရှာဖွေဖော်ထုတ်မည့် Slow Log
request_slowlog_timeout = 5s
slowlog = /var/log/php-fpm/slow.log
```

---

## ၇။ 502 Bad Gateway နှင့် 504 Gateway Timeout ရှင်းလင်းနည်း

| HTTP Error | အကြောင်းရင်း (Root Cause) | ဖြေရှင်းနည်း (Resolution) |
| :--- | :--- | :--- |
| **502 Bad Gateway** | Nginx က PHP-FPM ထံ Request ပို့သော်လည်း PHP-FPM Daemon သေနေခြင်း သို့မဟုတ် Crash ဖြစ်သွားခြင်း | `systemctl status php8.2-fpm` စစ်ဆေးပါ။ Socket File permission မှန်မမှန် စစ်ဆေးပါ။ `pm.max_children` ပြည့်ကျပ်ပြီး Worker များ OOM (Out of Memory) ဖြစ်မဖြစ် စစ်ဆေးပါ။ |
| **504 Gateway Timeout** | PHP Script အလုပ်လုပ်ချိန် ကြာလွန်းပြီး Nginx ၏ `fastcgi_read_timeout` ထက် ကျော်လွန်သွားခြင်း | PHP ၏ Database Query နှေးကွေးမှု သို့မဟုတ် ပြင်ပ API Call ကြာမြင့်နေခြင်းကို စစ်ဆေးပါ။ လိုအပ်ပါက `fastcgi_read_timeout 180s;` သို့ တိုးမြှင့်ပါ။ |
