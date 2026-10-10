---
title: Phase 3 Lesson 9 — SSH Hardening & Network Socket Tooling
description: SSH Architecture, /etc/ssh/sshd_config Hardening (Disable Root Login, Key-only Auth), Network Socket စစ်ဆေးခြင်း (ss -tulpn), ip addr, nc နှင့် rsync (မြန်မာဘာသာ)
---

# 🔐 Phase 3 — Lesson 9: SSH Hardening & Network Socket Tooling

Production Linux Server တိုင်းကို ကမ္ဘာပေါ်ရှိ မည်သည့်နေရာမှမဆို လုံခြုံစွာ အဝေးထိန်း ချိတ်ဆက်ရန် **SSH (Secure Shell - Port 22)** ကို အသုံးပြုပါသည်။ သို့သော် Default SSH Configuration ဖြင့် ထားရှိပါက Hacker များနှင့် Bot များ၏ ၂၄ နာရီ မနားတမ်း Brute-force Password တိုက်ခိုက်မှုကို ခံရမည် ဖြစ်ပါသည်။

ဤအခန်းတွင် **SSH Server Hardening**, ဘယ် Port တွင် ဘယ် Process နားထောင်နေသည်ကို စစ်ဆေးပေးသည့် **`ss -tulpn`**, **`ip addr`**, **`nc` (Netcat)** နှင့် **`rsync`** တို့ကို လေ့လာသွားပါမည်။

---

## 🛡️ ၁။ Production SSH Hardening (`/etc/ssh/sshd_config`)

Production Server အသစ်တစ်လုံး တည်ဆောက်ပြီးပါက SSH Config ဖိုင် (`/etc/ssh/sshd_config`) တွင် အောက်ပါ စံနှုန်း ၅ ချက်ကို မဖြစ်မနေ ပြင်ဆင်ရပါမည်:

```ini
# ၁။ Root အကောင့်ဖြင့် SSH တိုက်ရိုက် Login ဝင်ခြင်းကို ပိတ်ပင်ပါ
PermitRootLogin no

# ၂။ Password ဖြင့် Login ဝင်ခြင်းကို လုံးဝ ပိတ်ပင်ပြီး SSH Key ဖြင့်သာ ဝင်ခွင့်ပြုပါ
PasswordAuthentication no
PubkeyAuthentication yes

# ၃။ Password မှားယွင်းရိုက်နှိပ်ခွင့်ကို ၃ ကြိမ်သာ ကန့်သတ်ပါ
MaxAuthTries 3

# ၄။ မည်သည့် command မှ မရိုက်ဘဲ ချိတ်ထားပါက အလိုအလျောက် disconnect ချပါ
ClientAliveInterval 300
ClientAliveCountMax 2

# ၅။ (ရွေးချယ်ရန်) Automated Bot တိုက်ခိုက်မှုများကို လျှော့ချရန် Port ပြောင်းပါ
Port 2222
```

### 🚨 Senior Safety Rule — `sudo sshd -t`
SSH Config ပြင်ဆင်ပြီးပါက `systemctl restart ssh` မလုပ်မီ **Syntax အမှား ရှိ/မရှိ စစ်ဆေးရပါမည်**:
```bash
sudo sshd -t
```
*အကယ်၍ Error မရှိမှသာ SSH service ကို restart ချပါ။ မဟုတ်ပါက Server ထဲသို့ မည်သူမျှ SSH ဝင်မရတော့ဘဲ ပြင်ပတွင် သောင်တင်သွားပါမည်။*

---

## 🔌 ၂။ Socket & Listening Port စစ်ဆေးခြင်း (`ss -tulpn`)

Legacy command ဖြစ်သော `netstat` အစား ခေတ်သစ် Linux တွင် **`ss` (Socket Statistics)** ကို အသုံးပြုပါသည်:

```bash
sudo ss -tulpn
```

### Options Breakdown:
* **`-t`**: TCP sockets များကို ပြပါ။
* **`-u`**: UDP sockets များကို ပြပါ။
* **`-l`**: Listening sockets (အခြားသူ ချိတ်ဆက်ရန် စောင့်ဆိုင်းနေသော Ports) များကိုသာ ပြပါ။
* **`-p`**: ထို Port ကို မည်သည့် Program အမည်နှင့် PID က ပိုင်ဆိုင်ထားသည်ကို ပြပါ။
* **`-n`**: Service အမည်အစား Numeric Port (80, 443) ဖြင့် တိကျစွာ ပြပါ။

### Expected Output နမူနာ:
```
Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
tcp    LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("nginx",pid=1234,fd=6))
tcp    LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=850,fd=3))
```
*Port 80 တွင် Nginx (PID 1234) နှင့် Port 22 တွင် SSH (PID 850) အသင့်နားထောင်နေသည်ကို တိကျစွာ မြင်တွေ့ရပါသည်။*

---

## 🧰 ၃။ Network Tooling (`ip`, `nc`, `rsync`)

### က။ IP Address နှင့် Network Interface စစ်ဆေးခြင်း (`ip addr`)
```bash
# လက်ရှိ Server ၏ Network Interfaces (eth0, ens3) နှင့် Private IP စစ်ဆေးခြင်း
ip addr show
# Default Gateway Router IP စစ်ဆေးခြင်း
ip route show
```

### ခ။ Port ပွင့်/မပွင့် အဝေးမှ စမ်းသပ်ခြင်း (`nc` - Netcat)
Application တစ်ခု စတင်မရပါက Firewall ပိတ်နေသလား၊ Service အမှန်တကယ် ပွင့်နေသလားကို စက္ကန့်ပိုင်းအတွင်း စစ်ဆေးနိုင်သည်:
```bash
# Remote Server ၏ Port 443 ပွင့်/မပွင့် စစ်ဆေးခြင်း (-z: zero I/O scan, -v: verbose)
nc -zv 192.168.1.50 443
# Output: Connection to 192.168.1.50 port 443 [tcp/https] succeeded!
```

### ဂ။ Production File Syncing (`rsync`)
Server အချင်းချင်း ဖိုင်များ အမြန်ဆုံးနှင့် အလုံခြုံဆုံး ကူးယူရန် `scp` ထက် **`rsync`** ကို အသုံးပြုပါ (ပြောင်းလဲသွားသော အပိုင်းကိုသာ Delta Sync လုပ်ပေးသည်):
```bash
rsync -avz -e ssh /var/www/html/ ubuntu@192.168.1.50:/var/www/html/
```
* `-a` (archive: permissions, timestamps, owner များကို မူလအတိုင်း ထိန်းသိမ်းသည်)
* `-v` (verbose: ကူးယူသမျှ ပြသသည်)
* `-z` (compress: network ပေါ်တွင် data ကို ချုံ့၍ ပို့သဖြင့် မြန်ဆန်သည်)

---

## 🏋️ ၄။ Hands-on Practice

1. `sudo ss -tulpn` ဖြင့် သင်၏ Ubuntu Server ပေါ်တွင် မည်သည့် Port များ ပွင့်နေသည်ကို စစ်ဆေးပါ။
2. `ip addr show` ဖြင့် သင်၏ VM IP address ကို ရှာဖွေပါ။
3. Mac Terminal မှနေ၍ `nc -zv <VM-IP> 22` ဖြင့် SSH port ချိတ်ဆက်မှုကို စမ်းသပ်ပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: SSH တွင် `PermitRootLogin no` နှင့် `PasswordAuthentication no` အဘယ်ကြောင့် သတ်မှတ်ရသနည်း?
2. **မေးခွန်း ၂**: Server ပေါ်တွင် Port 80 ကို မည်သည့် Application က နေရာယူထားသည်ကို ရှာဖွေရန် မည်သည့် command ကို အသုံးပြုရမည်နည်း?
3. **မေးခွန်း ၃**: Large directories များကို Server တစ်ခုမှ အခြားတစ်ခုသို့ ကူးယူရာတွင် `scp` ထက် `rsync` က အဘယ်ကြောင့် ပိုမိုမြန်ဆန် ကောင်းမွန်သနည်း?
