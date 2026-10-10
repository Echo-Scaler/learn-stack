---
title: Phase 2 Lesson 5 — Process Management & System Resources
description: Linux Process Lifecycle, PID, signals (SIGTERM vs SIGKILL), ps aux, top, htop, kill, free -h, df -h နှင့် du -sh (မြန်မာဘာသာ)
---

# ⚙️ Phase 2 — Lesson 5: Process Management & System Resources

Linux Server ပေါ်တွင် Run နေသမျှ Application (Nginx, Java, Node.js, MySQL, Python) တိုင်းသည် **Process (လည်ပတ်နေသော ပရိုဂရမ်)** တစ်ခုစီ ဖြစ်ကြပါသည်။

Production Server တွင် Memory ပြည့်သွားခြင်း၊ CPU 100% တက်၍ Hang ဖြစ်သွားခြင်း သို့မဟုတ် Zombie Process များ ဖြစ်ပေါ်လာပါက Senior SysAdmin တစ်ဦးသည် မည်သည့် Process က အရင်းအမြစ် စားသုံးနေသည်ကို ရှာဖွေပြီး **Graceful Shutdown သို့မဟုတ် Force Kill** ပြုလုပ်နိုင်ရပါမည်။

---

## 💡 ၁။ What is it? (Process Lifecycle & PIDs)

* **Process**: RAM ထဲတွင် တင်ဆောင်ကာ CPU ဖြင့် အလုပ်လုပ်နေသော Running Program Instance ဖြစ်ပါသည်။
* **PID (Process ID)**: Linux Kernel က Process တစ်ခုစီတိုင်းကို ခွဲခြားသိရှိရန် ပေးအပ်ထားသော သီးသန့် ကိန်းဂဏန်း ID ဖြစ်ပါသည်။
* **PPID (Parent Process ID)**: ထို Process ကို မွေးဖွားပေးလိုက်သော မိခင် Process ၏ ID ဖြစ်သည်။ (Linux စတင်ချိန်တွင် ပထမဆုံး မွေးဖွားသော Process သည် `systemd` ဖြစ်ပြီး PID 1 ဖြစ်ပါသည်)။

---

## 🛑 ၂။ Linux Signals (Process များကို ထိန်းချုပ်သည့် အချက်ပြသင်္ကေတများ)

Linux တွင် Process တစ်ခုကို ရပ်တန့်ရန် **Signals** များကို ပေးပို့ပါသည်။ အရေးကြီးဆုံး Signal ၃ ခုမှာ -

| Signal | Name | Number | လုပ်ဆောင်ချက်နှင့် စံနှုန်း |
| :---: | :---: | :---: | :--- |
| **SIGTERM** | Terminate | **`15`** | **Graceful Shutdown (နူးညံ့စွာ ပိတ်ခြင်း - Default)**: Process အား လက်စသတ်စရာ Database connection များနှင့် ဖိုင်များကို သပ်ရပ်စွာ ပိတ်သိမ်းခွင့် ပေးပြီးမှ ရပ်တန့်သည်။ *(အမြဲတမ်း ဦးစွာ သုံးရမည်)* |
| **SIGKILL** | Kill | **`9`** | **Force Kill (အကြမ်းဖက် သတ်ပစ်ခြင်း)**: Process အား စဉ်းစားချိန် မပေးဘဲ Kernel က RAM ပေါ်မှ ချက်ချင်း ဆွဲချပစ်သည်။ Data corruption ဖြစ်နိုင်သဖြင့် SIGTERM ဖြင့် မရမှသာ သုံးရသည်။ |
| **SIGHUP** | Hangup | **`1`** | **Reload Configuration**: Process ကို မပိတ်ဘဲ Configuration ဖိုင် အသစ်ကိုသာ Reload ပြန်လုပ်စေသည်။ (ဥပမာ- Nginx reload) |

---

## ⌨️ ၃။ Important Commands & Breakdown

### က။ Process များကို ရှာဖွေစစ်ဆေးခြင်း (`ps aux`, `pgrep`)

```bash
# စနစ်တစ်ခုလုံးရှိ Running Processes အားလုံးကို အသေးစိတ် ကြည့်ရှုခြင်း
ps aux

# Nginx နှင့် သက်ဆိုင်သော process များကိုသာ ရှာဖွေခြင်း
ps aux | grep nginx

# Process အမည်ဖြင့် PID ကို တိုက်ရိုက် ရှာဖွေခြင်း
pgrep -l nginx
```
* **`ps aux` Breakdown**:
  * `a`: User အားလုံး၏ processes များကို ပြပါ။
  * `u`: User အမည်၊ CPU% နှင့် Memory% အသေးစိတ်ဖြင့် ပြပါ။
  * `x`: Terminal နှင့် မချိတ်ဆက်ထားသော Background daemons များကိုပါ ပြပါ။

### ခ။ Process ကို ရပ်တန့်သတ်ဖြတ်ခြင်း (`kill`, `killall`)

```bash
# ၁။ Graceful Shutdown ပေးပို့ခြင်း (Signal 15 - Default)
kill 1234
# သို့မဟုတ်
kill -15 1234

# ၂။ SIGTERM ဖြင့် မသေပါက အတင်းအကျပ် Force Kill ပြုလုပ်ခြင်း (Signal 9)
kill -9 1234

# ၃။ Process အမည်တူ အားလုံးကို တစ်ပြိုင်နက်တည်း သတ်ပစ်ခြင်း
killall nginx
```

### ဂ။ Real-time Performance Monitoring (`top`, `htop`)

```bash
# Default terminal process monitor
top

# ပိုမိုလှပပြီး အရောင်အသွေးစုံလင်သော Interactive Monitor (Recommended)
htop
```
* **htop Shortcut Keys**:
  * `F6`: Sort by (CPU% သို့မဟုတ် MEM% အလိုက် စီတန်းခြင်း)
  * `F9`: Kill (Signal ရွေးချယ်ပြီး Process သတ်ခြင်း)
  * `F10` သို့မဟုတ် `q`: ထွက်ခြင်း။

### ဃ။ Memory & Disk စစ်ဆေးခြင်း (`free -h`, `df -h`, `du -sh`)

```bash
# RAM နှင့် Swap Memory လက်ကျန် စစ်ဆေးခြင်း
free -h

# Disk Partitions များ၏ နေရာလွတ် စစ်ဆေးခြင်း (Filesystem usage)
df -h

# ဖိုဒါတစ်ခုချင်းစီ အမှန်တကယ် နေရာယူထားသော အရွယ်အစား စစ်ဆေးခြင်း
du -sh /var/log/*
```
* **`-h` flag**: Human-readable (`1.2G`, `500M` ဖြင့် ဖတ်ရလွယ်အောင် ပြသခြင်း)။

---

## 🏋️ ၄။ Hands-on Practice

1. အိပ်နေသော dummy process တစ်ခုကို background တွင် run ပါ:
   ```bash
   sleep 300 &
   ```
2. `ps aux | grep sleep` ဖြင့် ၎င်း၏ PID ကို ရှာဖွေပါ။
3. `kill -15 <PID>` ဖြင့် ပိတ်သိမ်းပါ။
4. `free -h` ရိုက်ပြီး Total RAM, Used RAM, Available RAM ကို စစ်ဆေးပါ။
5. `df -h` ရိုက်ပြီး Root partition (`/`) ၏ နေရာလွတ် Use% ကို စစ်ဆေးပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: Process တစ်ခုကို ရပ်တန့်လိုသည့်အခါ `kill -9` ကို တိုက်ရိုက် မသုံးဘဲ `kill -15` ကို ဦးစွာ အဘယ်ကြောင့် သုံးသင့်သနည်း?
2. **မေးခွန်း ၂**: Server Disk 100% ပြည့်သွားပါက မည်သည့် Directory များ နေရာယူနေသည်ကို ရှာဖွေရန် မည်သည့် command တွဲစပ်မှုကို သုံးရမည်နည်း?
3. **မေးခွန်း ၃**: `free -h` တွင် `free` နှင့် `available` Memory အကြား ကွာခြားချက်မှာ အဘယ်နည်း?
