---
title: Phase 2 Lesson 6 — systemd, Services & journalctl Logging
description: Linux systemd Init System, Service Daemons, systemctl command များ, Custom Unit File ရေးသားနည်းနှင့် journalctl Log Analysis (မြန်မာဘာသာ)
---

# 🤖 Phase 2 — Lesson 6: systemd, Services & journalctl Logging

ခေတ်မီ Linux Server များတွင် Application တစ်ခုကို Background Daemon အဖြစ် ၂၄ နာရီ မနားတမ်း run ထားရန်နှင့် Server ပြန်ပွင့်လာတိုင်း (Auto-boot) အလိုအလျောက် ပွင့်လာစေရန် **`systemd` (System Daemon - PID 1)** ကို အသုံးပြုပါသည်။

ဤအခန်းတွင် Service များကို စီမံခန့်ခွဲသည့် **`systemctl`**, မိမိ၏ ကိုယ်ပိုင် Custom Application အတွက် **Production-grade Systemd Unit File** ရေးသားနည်းနှင့် Error ရှာဖွေရေး **`journalctl`** ကို လေ့လာသွားပါမည်။

---

## 💡 ၁။ What is it? (`systemd` ဆိုတာ ဘာလဲ)

Linux Server တစ်ခု စတင် Boot တက်လာသောအခါ Linux Kernel သည် **`systemd` (PID 1)** ဟုခေါ်သော မိခင် Process ကြီးကို ဦးစွာ စတင်မွေးဖွားပေးပါသည်။ ထို့နောက် `systemd` ကမှတစ်ဆင့် Network, SSH, Web Server, Database စသည့် Service အားလုံးကို အပြိုင်အဆိုင် စတင်ခေါ်ယူမောင်းနှင်ပေးပါသည်။

### Systemd Unit File အမျိုးအစားများ
* `.service`: Background Daemons များ (Nginx, MySQL, Spring Boot, Node.js)
* `.timer`: Cron job ကဲ့သို့ အချိန်ကိုက် run ပေးသော timer units
* `.target`: စနစ်၏ run-level အခြေအနေများ (ဥပမာ- `multi-user.target` networking အသင့်ဖြစ်သော အခြေအနေ)

---

## ⌨️ ၂။ `systemctl` ဖြင့် Service များ စီမံခန့်ခွဲခြင်း

```bash
# ၁။ Service အခြေအနေ စစ်ဆေးခြင်း (Active, Dead, Failed)
sudo systemctl status nginx

# ၂။ Service ကို ချက်ချင်း စတင်ခြင်း / ရပ်တန့်ခြင်း
sudo systemctl start nginx
sudo systemctl stop nginx

# ၃။ Service ကို အသစ်ပြန်လည် Restart ချခြင်း
sudo systemctl restart nginx

# ၄။ Configuration အသစ်ကို Downtime မရှိဘဲ Reload လုပ်ခြင်း
sudo systemctl reload nginx

# ၅။ Server ပြန်ပွင့်တိုင်း အလိုအလျောက် ပွင့်လာစေရန် သတ်မှတ်ခြင်း (Auto-boot on restart)
sudo systemctl enable nginx

# ၆။ Auto-boot ကို ပြန်လည်ပိတ်သိမ်းခြင်း
sudo systemctl disable nginx

# ၇။ Failed ဖြစ်နေသော Service များကို ရှာဖွေခြင်း
systemctl --failed
```

---

## 🛠️ ၃။ Custom Systemd Service Unit File ရေးသားနည်း (လက်တွေ့ Production Lab)

မိမိရေးသားထားသော Java JAR, Node.js သို့မဟုတ် Python API ကို Server ပေါ်တွင် ၂၄ နာရီ မပြုတ်ကျစေဘဲ (Crash ဖြစ်ပါက auto-restart ပေးမည့်) Service အဖြစ် ဖန်တီးလိုပါက `/etc/systemd/system/myapp.service` ဖိုင်ကို အောက်ပါအတိုင်း ရေးသားရပါမည် -

```ini
[Unit]
Description=My Enterprise Backend API Service
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java -jar /opt/myapp/app.jar
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment="APP_ENV=production" "PORT=8080"

[Install]
WantedBy=multi-user.target
```

### အစိတ်အပိုင်းများ ရှင်းလင်းချက်:
* **`After=network.target`**: Network အပြည့်အဝ ပွင့်ပြီးမှသာ ဤ application ကို စတင်ပါ။
* **`User=ubuntu`**: Root အကောင့်ဖြင့် မ run ဘဲ unprivileged user ဖြင့် လုံခြုံစွာ run ပါ။
* **`Restart=always`**: အကယ်၍ Memory ပြည့်၍ဖြစ်စေ၊ Exception ကြောင့်ဖြစ်စေ App crash ဖြစ်သွားပါက `systemd` က **၅ စက္ကန့်အတွင်း အလိုအလျောက် ပြန်လည် နိုးထစေပါမည် (Auto-healing)**။

### Service အသစ်ကို အသက်သွင်းခြင်း:
```bash
# Systemd daemon အား ဖိုင်အသစ်ကို သိရှိစေရန် Reload လုပ်ပါ
sudo systemctl daemon-reload

# Service ကို စတင်ပြီး enable လုပ်ပါ
sudo systemctl enable --now myapp.service
```

---

## 📜 ၄။ `journalctl` ဖြင့် System Logs စစ်ဆေးဖတ်ရှုနည်း

Systemd တွင် Logs အားလုံးကို Binary format ဖြင့် စုစည်းသိမ်းဆည်းထားသဖြင့် **`journalctl`** ဖြင့် စစ်ဆေးရပါမည် -

```bash
# Service တစ်ခု၏ Logs များကို Real-time စောင့်ကြည့်ခြင်း (Live stream - tail -f ကဲ့သို့)
sudo journalctl -u nginx -f

# နောက်ဆုံး ထွက်ရှိထားသော log စာကြောင်း ၁၀၀ ကိုသာ ကြည့်ရှုခြင်း
sudo journalctl -u myapp.service -n 100

# လွန်ခဲ့သော ၁ နာရီအတွင်း ထွက်ပေါ်ခဲ့သော log များကို စစ်ဆေးခြင်း
sudo journalctl -u myapp.service --since "1 hour ago"

# Service စတင်မရဘဲ Failed ဖြစ်သွားပါက အသေးစိတ် အမှားရှာဖွေခြင်း (SysAdmin မရှိမဖြစ်)
sudo journalctl -xe
```

---

## 🏋️ ၅။ Hands-on Practice

1. Ubuntu VM တွင် `sudo apt install -y nginx` ဖြင့် Nginx ကို သွင်းပါ။
2. `sudo systemctl status nginx` ဖြင့် အခြေအနေကို စစ်ဆေးပါ။
3. `sudo systemctl stop nginx` ဖြင့် ပိတ်ပြီး status ပြန်ကြည့်ပါ။
4. `sudo systemctl start nginx` ဖြင့် ပြန်ဖွင့်ပါ။
5. `sudo journalctl -u nginx -n 20` ဖြင့် Nginx logs များကို စစ်ဆေးပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: `systemctl restart` နှင့် `systemctl reload` ၏ အဓိကကွာခြားချက်မှာ အဘယ်နည်း? မည်သည့်အခါတွင် `reload` ကို သုံးသင့်သနည်း?
2. **မေးခွန်း ၂**: Application တစ်ခု Crash ဖြစ်သွားပါက အလိုအလျောက် ပြန်ဖွင့်ပေးရန် systemd unit file တွင် မည်သည့် directive ကို ထည့်သွင်းရမည်နည်း?
3. **မေးခွန်း ၃**: Service Unit ဖိုင်တစ်ခုကို ပြင်ဆင်ပြီးတိုင်း `systemctl start` မလုပ်မီ မည်သည့် command ကို မဖြစ်မနေ run ရမည်နည်း?
