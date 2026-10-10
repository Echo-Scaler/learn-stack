---
title: Phase 8 Lesson 17 — Monitoring, Observability & Incident Response
description: Production Observability, System Metrics (iostat, vmstat, iftop), Prometheus & Node Exporter, Incident Triage, 5 Whys Root Cause Analysis (RCA) နှင့် Runbooks (မြန်မာဘာသာ)
---

# 🩺 Phase 8 — Lesson 17: Monitoring, Observability & Incident Response

Production Server များတွင် အရေးပေါ် Incident တစ်ခု ဖြစ်ပေါ်လာချိန် (ဥပမာ- ညဉ့်နက် ၂:၀၀ နာရီတွင် Website Down သွားခြင်း) တွင် ထိတ်လန့်မသွားဘဲ စနစ်တကျ **Triage (အဆင့်ခွဲခြားခြင်း)** ပြုလုပ်နိုင်ပြီး **Root Cause Analysis (RCA)** ရှာဖွေနိုင်ခြင်းသည် ၄ နှစ်လုပ်သက် Senior Engineer တစ်ဦး၏ အဓိက အရည်အသွေး ဖြစ်ပါသည်။

ဤအခန်းတွင် **Production Observability မဏ္ဍိုင် ၃ ရပ်**, **Deep Diagnostics Tools (`iostat`, `vmstat`)**, **Prometheus & Node Exporter** နှင့် **Incident Investigation Runbook** တို့ကို လေ့လာသွားပါမည်။

---

## 📊 ၁။ The 3 Pillars of Observability (စောင့်ကြည့်လေ့လာရေး မဏ္ဍိုင် ၃ ရပ်)

1. **Metrics (ကိန်းဂဏန်းများ)**: အချိန်နှင့်အမျှ တိုင်းတာရရှိသော ဂဏန်းတန်ဖိုးများ (CPU%, Memory Usage, Network Bandwidth, HTTP 500 error rate)။
2. **Logs (မှတ်တမ်းများ)**: ဖြစ်ရပ်တစ်ခုချင်းစီ ဖြစ်ပွားခဲ့သည့် အသေးစိတ် စာသားမှတ်တမ်းများ (`/var/log/syslog`, `/var/log/nginx/error.log`)။
3. **Traces (ခြေရာခံမှုများ)**: Request တစ်ခုသည် Frontend မှတစ်ဆင့် API Gateway, Microservice, Database အထိ ဖြတ်သန်းသွားသော ခရီးစဉ်။

---

## 🔬 ၂။ Senior Deep Diagnostics Tools (`iostat`, `vmstat`, `iftop`)

ပုံမှန် `top` ဖြင့် မမြင်နိုင်သော Storage Disk Bottlenecks များနှင့် Network Spikes များကို အောက်ပါ ကိရိယာများဖြင့် စစ်ဆေးပါသည်:

```bash
# ၁။ sysstat package ကို ထည့်သွင်းပါ
sudo apt install -y sysstat iftop

# ၂။ Disk I/O Bottleneck စစ်ဆေးခြင်း (Hard disk အလုပ်များပြီး ကြန့်ကြာနေသလား)
iostat -xz 1 5
```
* **အဓိက ကော်လံ**: `%util` (Disk Utilization) သည် 90% ကျော်နေပါက Hard Disk သည် Database I/O မနိုင်တော့ဘဲ Server နှေးကွေးနေခြင်း ဖြစ်သည်။

```bash
# ၃။ Virtual Memory & CPU Context Switches စစ်ဆေးခြင်း
vmstat 1 5
```
* **အဓိက ကော်လံ**: `si` (swap in), `so` (swap out) များ သုညထက် ကြီးနေပါက RAM လုံးဝမလောက်တော့ဘဲ Disk ပေါ်ရှိ Swap Memory ကို အသုံးပြုနေရသဖြင့် စနစ် အလွန်လေးလံနေခြင်း ဖြစ်သည်။

```bash
# ၄။ Network Bandwidth ကို မည်သည့် IP က အများဆုံး စားသုံးနေသည်ကို စစ်ဆေးခြင်း
sudo iftop -i eth0
```

---

## 🚨 ၃။ Production Incident Triage & Troubleshooting Runbook

Website Down သွားသည်ဟူသော သတိပေးချက် ရရှိပါက အောက်ပါ အဆင့် ၅ ဆင့်အတိုင်း စနစ်တကျ စုံစမ်းစစ်ဆေးပါ (USE Method: Utilization, Saturation, Errors):

```
┌────────────────────────────────────────────────────────────────────────┐
│ Step 1: Server သို့ SSH ဝင်၍ရသေးသလား?                                  │
│         - မရပါက Cloud Console မှ CPU/Reboot အခြေအနေ စစ်ဆေးပါ။        │
├────────────────────────────────────────────────────────────────────────┤
│ Step 2: စနစ်၏ အရင်းအမြစ်များ မည်သည့်အရာ ပြည့်နေသနည်း?                   │
│         - `uptime` (CPU load)                                          │
│         - `free -h` (RAM & Swap)                                       │
│         - `df -h` (Disk 100% ပြည့်နေသလား)                               │
├────────────────────────────────────────────────────────────────────────┤
│ Step 3: Web Server & Database ဝန်ဆောင်မှုများ Running ဖြစ်နေသလား?      │
│         - `sudo systemctl status nginx`                                │
│         - `sudo systemctl status mysql`                                │
│         - `sudo ss -tulpn` (Port 80/443 ပွင့်နေဆဲလား)                  │
├────────────────────────────────────────────────────────────────────────┤
│ Step 4: နောက်ဆုံးထွက် Log Error များသည် မည်သည်နည်း?                    │
│         - `sudo journalctl -xe -n 50`                                  │
│         - `sudo tail -n 100 /var/log/nginx/error.log`                  │
├────────────────────────────────────────────────────────────────────────┤
│ Step 5: အမြန်ဆုံး ဝန်ဆောင်မှု ပြန်လည်ရရှိအောင် လုပ်ဆောင်ပြီးနောက်       │
│         5 Whys Root Cause Analysis (RCA) စာတမ်း ရေးသားပါ။               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 ၄။ The "5 Whys" Root Cause Analysis (RCA) နမူနာ

Production ပြဿနာ ပြီးဆုံးသွားတိုင်း Senior Engineer သည် နောင်တွင် ထပ်မဖြစ်စေရန် **5 Whys စနစ်** ဖြင့် အစီရင်ခံစာ ရေးသားရပါမည်:

1. **Why 1**: Web Server အဘယ်ကြောင့် Crash ဖြစ်သွားသနည်း?  
   -> Hard disk နေရာလွတ် 100% ပြည့်သွားသောကြောင့် ဖြစ်သည်။
2. **Why 2**: Hard disk အဘယ်ကြောင့် 100% ပြည့်သွားသနည်း?  
   -> `/var/log/nginx/access.log` ဖိုင်သည် 80GB အထိ ကြီးထွားသွားသောကြောင့် ဖြစ်သည်။
3. **Why 3**: Log ဖိုင် အဘယ်ကြောင့် 80GB အထိ ကြီးထွားသွားသနည်း?  
   -> Logrotate စနစ် ထို server ပေါ်တွင် မသတ်မှတ်ရသေးသောကြောင့် ဖြစ်သည်။
4. **Why 4**: Logrotate အဘယ်ကြောင့် မသတ်မှတ်ရသေးသနည်း?  
   -> Server စတင်ဆောက်စဉ်က Day-1 Provisioning Checklist ကို ကျော်သွားခဲ့သောကြောင့် ဖြစ်သည်။
5. **Why 5 (Root Cause)**: Production Server တည်ဆောက်မှုကို Automation (Terraform/Ansible) မသုံးဘဲ လူဖြင့် Manual ဆောက်ခဲ့သောကြောင့် ဖြစ်သည်။
* **Action Item**: ဆာဗာအားလုံးတွင် Logrotate ကို အလိုအလျောက် တပ်ဆင်ရန် Ansible Playbook ရေးသားမည်။

---

## 🏋️ ၅။ Hands-on Practice

1. Ubuntu VM တွင် `sudo apt install -y sysstat` ကို သွင်းပါ။
2. `vmstat 1 3` ရိုက်ပြီး CPU `us` (user), `sy` (system), `id` (idle) ရာခိုင်နှုန်းများကို စစ်ဆေးပါ။
3. `sudo tail -n 20 /var/log/syslog` (သို့မဟုတ် `/var/log/auth.log`) ကို ဖတ်ရှုပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: Observability ၏ မဏ္ဍိုင် ၃ ရပ်မှာ အဘယ်နည်း?
2. **မေးခွန်း ၂**: `vmstat` တွင် `si` (swap in) နှင့် `so` (swap out) ဂဏန်းများ တက်နေပါက စနစ်တွင် မည်သည့် ပြဿနာ ဖြစ်ပွားနေသနည်း?
3. **မေးခွန်း ၃**: Incident တစ်ခု ဖြစ်ပေါ်ပြီးနောက် "5 Whys" Root Cause Analysis ပြုလုပ်ခြင်း၏ အဓိက ရည်ရွယ်ချက်မှာ အဘယ်နည်း?
