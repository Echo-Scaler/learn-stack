---
title: Diagnostics Tools (ping, curl, ss -tulpn, dig, traceroute)
description: Network Connectivity စစ်ဆေးခြင်း (ping), HTTP Request (curl), Listening Ports (ss), DNS စစ်ဆေးခြင်း (dig/nslookup), Path Tracing (traceroute)
---

## ၁။ `ping` — Network Connectivity စစ်ဆေးခြင်း

```bash
# ICMP Echo Request ၄ ကြိမ် ပို့၍ Connectivity စစ်ဆေးခြင်း
ping -c 4 8.8.8.8
# Packet Loss 0% ဖြစ်ပါက Connectivity ကောင်းမွန်သည်
```

---

## ၂။ `curl` — HTTP/HTTPS Request စမ်းသပ်ခြင်း

```bash
# ၁။ HTTP Response Headers သာ ကြည့်ရှုခြင်း
curl -I https://api.example.com

# ၂။ Request/Response Cycle အပြည့်အစုံကို Debug လုပ်၍ ကြည့်ရှုခြင်း (Verbose)
curl -v https://api.example.com/health

# ၃။ DNS Lookup Time, Connect Time, Total Latency များကို တိုင်းတာခြင်း
curl -w "DNS: %{time_namelookup}s | Connect: %{time_connect}s | Total: %{time_total}s
" -o /dev/null -s https://api.example.com
```

---

## ၃။ `ss -tulpn` — Listening Ports စစ်ဆေးခြင်း

```bash
# နားထောင်နေသော Listening Ports များနှင့် Process PID များကို စစ်ဆေးခြင်း
sudo ss -tulpn
# Options Breakdown:
# -t : TCP sockets
# -u : UDP sockets
# -l : Listening sockets only
# -p : Show process PID and name
# -n : Show numeric ports (e.g. 80 instead of http)

# Port 80 သို့မဟုတ် 443 အသုံးပြုနေသော Process ကို Filter လုပ်ခြင်း
sudo ss -tulpn | grep -E ':80|:443'
```

---

## ၄။ `dig` / `nslookup` — DNS Resolution စစ်ဆေးခြင်း

```bash
# Domain A Record IP ရှာဖွေခြင်း
dig api.example.com +short

# သီးခြား DNS Server (ဥပမာ Google 8.8.8.8) သို့ တိုက်ရိုက် မေးမြန်းခြင်း
dig @8.8.8.8 api.example.com
```

---

## ၅။ `traceroute` / `tracepath` — Network Path စစ်ဆေးခြင်း

```bash
# Destination သို့ ရောက်ရှိရန် ဖြတ်သန်းရသော Router Hop များကို ကြည့်ရှုခြင်း
traceroute api.example.com
tracepath 8.8.8.8
```
