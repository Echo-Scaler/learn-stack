---
title: Linux Network Interfaces, ip addr & ip route Commands
description: Linux Network Interface စီမံခန့်ခွဲမှု၊ ip addr ဖြင့် IP စစ်ဆေးခြင်း၊ ip route ဖြင့် Routing စစ်ဆေးခြင်းနှင့် Interface Configuration
---

## ၁။ Linux Network Interface ဆိုတာဘာလဲ?

Linux တွင် Network Hardware နှင့် Virtual Network များကို **Network Interface** အဖြစ် ကိုယ်စားပြုသည်:
- `lo`: Local Loopback Interface (`127.0.0.1` - စက်တွင်း Localhost)
- `eth0` / `ens5`: Ethernet Network Interface Card (Physical LAN သို့မဟုတ် AWS EC2 Virtual NIC)
- `wlan0`: Wi-Fi Wireless Interface
- `docker0`: Docker Bridge Network Interface

```bash
# Interface အားလုံး၏ Link အခြေအနေ စစ်ဆေးခြင်း
ip link show
```

---

## ၂။ `ip addr` — IP Address စစ်ဆေးခြင်းနှင့် စီမံခြင်း

```bash
# ၁။ Network Interfaces အားလုံးနှင့် သက်ဆိုင်ရာ IP များကို ကြည့်ရှုခြင်း
ip addr show
# (အတိုကောက်: ip a)

# ၂။ သီးခြား Interface တစ်ခု (ဥပမာ eth0) သာ ကြည့်ရှုခြင်း
ip addr show dev eth0

# ၃။ IP Address ယာယီ ထည့်သွင်းခြင်း (Testing အတွက်)
sudo ip addr add 192.168.1.100/24 dev eth0

# ၄။ IP Address ပြန်လည်ဖျက်ပစ်ခြင်း
sudo ip addr del 192.168.1.100/24 dev eth0
```

---

## ၃။ `ip route` — Routing Table နှင့် Default Gateway စစ်ဆေးခြင်း

```bash
# ၁။ Kernel Routing Table ကြည့်ရှုခြင်း
ip route show
# Output Example:
# default via 172.31.0.1 dev eth0 proto dhcp src 172.31.10.45 metric 100
# 172.31.0.0/20 dev eth0 proto kernel scope link src 172.31.10.45

# ၂။ သီးခြား IP သို့ Packet မည်သည့်လမ်းကြောင်းမှ သွားမည်ကို အစမ်းစစ်ဆေးခြင်း
ip route get 8.8.8.8
# Output Example:
# 8.8.8.8 via 172.31.0.1 dev eth0 src 172.31.10.45 uid 1000

# ၃။ Static Route ထည့်သွင်းခြင်း
sudo ip route add 10.10.0.0/16 via 192.168.1.1 dev eth0
```
