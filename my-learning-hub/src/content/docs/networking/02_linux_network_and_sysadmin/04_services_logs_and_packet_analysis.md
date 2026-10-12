---
title: Systemd Services, journalctl Logs, iptables & tcpdump
description: systemctl ဖြင့် Service စီမံခြင်း, journalctl ဖြင့် Log ဖတ်ခြင်း, iptables/nftables Kernel Firewall နှင့် tcpdump Packet Analysis
---

## ၁။ `systemctl` — Systemd Services စီမံခန့်ခွဲခြင်း

```bash
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl enable nginx  # စက်ပွင့်တိုင်း Auto စတင်စေရန်
```

---

## ၂။ `journalctl` — System Logs ခွဲခြမ်းစိတ်ဖြာခြင်း

```bash
# Nginx Service ၏ Real-time logs များကို လိုက်လံကြည့်ရှုခြင်း
sudo journalctl -u nginx -f --no-pager

# Kernel Error Logs ကြည့်ရှုခြင်း
sudo journalctl -k -p err
```

---

## ၃။ `iptables` / `nftables` Basics

```bash
# လက်ရှိ Firewall Rules များကို စစ်ဆေးခြင်း
sudo iptables -L -n -v

# Port 80 သို့ ဝင်လာသော Inbound Traffic ကို Allow လုပ်ခြင်း
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

---

## ၄။ `tcpdump` — Packet Analysis (Packet Sniffing)

```bash
# Interface eth0 ပေါ်တွင် Port 80 သို့ သွားလာသော Packet များကို ဖမ်းယူကြည့်ရှုခြင်း
sudo tcpdump -i eth0 port 80 -n -X -c 10
# -n : Do not resolve hostnames
# -X : Print payload in HEX and ASCII
# -c 10 : Capture 10 packets only
```
