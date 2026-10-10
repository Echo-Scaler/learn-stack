---
title: Phase 3 Lesson 10 — Linux Firewalls (UFW), nftables & TLS/HTTPS
description: Linux Firewalls, UFW (Uncomplicated Firewall) စည်းမျဉ်းများ, Default Deny Policy, Port Management, TLS/HTTPS သဘောတရားနှင့် Let's Encrypt Certbot (မြန်မာဘာသာ)
---

# 🧱 Phase 3 — Lesson 10: Linux Firewalls (UFW), nftables & TLS/HTTPS

Production Server တစ်ခုကို အင်တာနက် Public IP ပေါ်သို့ တင်လိုက်သည်နှင့် စက္ကန့်ပိုင်းအတွင်း ကမ္ဘာအနှံ့မှ Hacker များနှင့် Vulnerability Scanners များ၏ တံခါးပေါက်ရှာဖွေမှုကို စတင်ကြုံတွေ့ရမည် ဖြစ်ပါသည်။

ဤအခန်းတွင် မလိုအပ်သော Port အားလုံးကို ပိတ်ပင်ပြီး လိုအပ်သော Traffic ကိုသာ စိစစ်ခွင့်ပြုသည့် **Linux Firewall (UFW)** နှင့် ဝဘ်ဆိုဒ်များကို လုံခြုံစွာ Encrypt ပြုလုပ်ပေးသည့် **TLS/HTTPS Certificates** အလုပ်လုပ်ပုံကို လေ့လာသွားပါမည်။

---

## 💡 ၁။ Linux Firewall Architecture (Netfilter, iptables, nftables & UFW)

Linux Kernel ၏ အတွင်းပိုင်းတွင် Packet များကို စစ်ဆေးသည့် **Netfilter** စနစ် ပါဝင်ပါသည်။
* **iptables / nftables**: အလွန်စွမ်းအားကြီးသော်လည်း ရေးသားရ ရှုပ်ထွေးသော Low-level firewall tools များ ဖြစ်သည်။
* **UFW (Uncomplicated Firewall)**: Ubuntu တွင် အသုံးပြုရန် ရိုးရှင်းလွယ်ကူအောင် ထုတ်လုပ်ထားသော Command-line Frontend ဖြစ်ပါသည်။

```
Incoming Internet Traffic ──► [ UFW / Netfilter Firewall ]
                                      │
                                      ├── Port 22 (SSH)   ──► ALLOW (ခွင့်ပြုသည်)
                                      ├── Port 80 (HTTP)  ──► ALLOW (ခွင့်ပြုသည်)
                                      ├── Port 443 (HTTPS)──► ALLOW (ခွင့်ပြုသည်)
                                      └── All other ports ──► DENY (လုံခြုံရေးအရ ပိတ်ပင်ပစ်သည်)
```

---

## 🚨 ၂။ UFW သတ်မှတ်ခြင်း အဆင့်ဆင့် (The Golden Rules)

> **အသက်တမျှ အရေးကြီးသော သတိပေးချက်**: `ufw enable` မလုပ်မီ **SSH Port (22) ကို ဦးစွာ ALLOW မလုပ်ပါက Server ထဲမှ ချက်ချင်း ပြုတ်ထွက်သွားပြီး ပြန်လည်ဝင်ရောက်၍ မရတော့ပါ!**

### အဆင့် ၁ — Default Policy သတ်မှတ်ခြင်း
Server သို့ ဝင်လာသမျှ အားလုံးကို မူလအားဖြင့် ပိတ်ပင်ပြီး (Deny incoming)၊ Server ထဲမှ ထွက်သွားသမျှကို ခွင့်ပြုပါ (Allow outgoing):
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### အဆင့် ၂ — မရှိမဖြစ် SSH Port ကို ဦးစွာ ခွင့်ပြုခြင်း
```bash
sudo ufw allow 22/tcp
# သို့မဟုတ် Brute-force တိုက်ခိုက်မှု ကာကွယ်ရန် rate limit သတ်မှတ်ခြင်း (၃၀ စက္ကန့်အတွင်း ၆ ကြိမ်ထက်ပိုလျှင် block သည်)
sudo ufw limit 22/tcp
```

### အဆင့် ၃ — Web Traffic Ports များကို ခွင့်ပြုခြင်း
```bash
# HTTP (80) နှင့် HTTPS (443) ကို ဖွင့်ပေးခြင်း
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### အဆင့် ၄ — Database Port ကို သီးသန့် Internal IP မှသာ ခွင့်ပြုခြင်း
MySQL (3306) ကို အင်တာနက်တစ်ခွင်သို့ ဘယ်သောအခါမှ မဖွင့်ရပါ! Backend App Server ၏ Private IP မှသာ ဝင်ခွင့်ပြုပါ:
```bash
sudo ufw allow from 10.0.1.50 to any port 3306 proto tcp
```

### အဆင့် ၅ — Firewall ကို အသက်သွင်းခြင်း
```bash
sudo ufw enable
```

### အဆင့် ၆ — စည်းမျဉ်းများကို နံပါတ်စဉ်ဖြင့် စစ်ဆေးခြင်းနှင့် ဖျက်ပစ်ခြင်း
```bash
# အခြေအနေ စစ်ဆေးခြင်း
sudo ufw status numbered

# နံပါတ် ၃ စည်းမျဉ်းကို ပြန်လည် ဖျက်ပစ်ခြင်း
sudo ufw delete 3
```

---

## 🔒 ၃။ TLS, HTTPS & Let's Encrypt Certbot

HTTP (Port 80) သည် စာသားများကို Plain text ဖြင့် ပို့သဖြင့် Password များကို ကြားဖြတ် ခိုးယူနိုင်ပါသည်။ **HTTPS (Port 443)** သည် **TLS (Transport Layer Security)** ဖြင့် End-to-End Encryption ပြုလုပ်ပေးပါသည်။

### Let's Encrypt Certbot ဖြင့် အခမဲ့ SSL/TLS Certificate ထုတ်ယူနည်း

```bash
# ၁။ Certbot နှင့် Nginx plugin သွင်းပါ
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# ၂။ Certificate ထုတ်ယူပြီး Nginx တွင် အလိုအလျောက် SSL config ထည့်သွင်းပါ
sudo certbot --nginx -d example.com -d www.example.com
```

### Certificate သိမ်းဆည်းရာ လမ်းကြောင်းများ:
* `/etc/letsencrypt/live/example.com/fullchain.pem`: Public SSL Certificate + Intermediate Chain
* `/etc/letsencrypt/live/example.com/privkey.pem`: **Private Key** (အလွန်လျှို့ဝှက်စွာ သိမ်းရပါမည်)

### Auto-Renewal စစ်ဆေးခြင်း:
Let's Encrypt သည် ရက်ပေါင်း ၉၀ သာ သက်တမ်းရှိပြီး Ubuntu တွင် `certbot.timer` က နေ့စဉ် ၂ ကြိမ် အလိုအလျောက် သက်တမ်းတိုးပေးပါသည်။ စမ်းသပ်ရန်:
```bash
sudo certbot renew --dry-run
```

---

## 🏋️ ၄။ Hands-on Practice

1. Ubuntu VM တွင် `sudo ufw status` ဖြင့် လက်ရှိ firewall ပိတ်/ပွင့် စစ်ဆေးပါ။
2. `sudo ufw allow 22/tcp` နှင့် `sudo ufw allow 80/tcp` ကို ထည့်ပါ။
3. `sudo ufw enable` ဖြင့် ဖွင့်ပြီး `sudo ufw status numbered` ဖြင့် စည်းမျဉ်းများကို ကြည့်ရှုပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: UFW ကို `sudo ufw enable` မလုပ်မီ မည်သည့် command ကို မဖြစ်မနေ အရင်ဆုံး run ရမည်နည်း? အဘယ်ကြောင့်နည်း?
2. **မေးခွန်း ၂**: Production Database Server တစ်ခုတွင် MySQL port 3306 ကို Public Internet အားလုံးသို့ မဖွင့်ဘဲ Private App Server တစ်ခုတည်းသို့သာ ဖွင့်ပေးရန် UFW command မည်သို့ ရေးရမည်နည်း?
3. **မေးခွန်း ၃**: Let's Encrypt Certificate တွင် `fullchain.pem` နှင့် `privkey.pem` ၏ ကွာခြားချက်မှာ အဘယ်နည်း?
