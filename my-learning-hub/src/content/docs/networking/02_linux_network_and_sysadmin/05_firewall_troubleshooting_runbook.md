---
title: Linux Network & Firewall Troubleshooting Runbook
description: Web Server သို့ ချိတ်မရခြင်း၊ Connection Timed Out နှင့် Connection Refused ပြဿနာများကို အဆင့်ဆင့် ဖြေရှင်းနည်း
---

## ၁။ Connection Refused vs Connection Timed Out

| Error Message | ဖြစ်နိုင်ခြေ အကြောင်းရင်း | စစ်ဆေးရမည့်နေရာ |
| :--- | :--- | :--- |
| **Connection Refused** | Packet သည် Server သို့ ရောက်သော်လည်း Port ပေါ်တွင် နားထောင်သော Service မရှိခြင်း | Server ပေါ်တွင် Service သေနေခြင်း (`systemctl status`) |
| **Connection Timed Out** | Packet သည် လမ်းခုလတ် သို့မဟုတ် Firewall တွင် ကျပျောက်နေခြင်း (Drop) | Security Group, Firewall, Route Table သို့မဟုတ် NAT GW |

---

## ၂။ ၄ ဆင့် စုံစမ်းစစ်ဆေးမှု စံနှုန်း (4-Step Investigation)

```
[ Step 1: Server Inside ] -> Service အသက်ရှိပြီး Port Listen လုပ်နေသလား?
         sudo ss -tulpn | grep 80

[ Step 2: Local Firewall ] -> Linux Kernel Firewall က Block ထားသလား?
         sudo ufw status သို့မဟုတ် sudo iptables -L

[ Step 3: Cloud Security ] -> AWS Security Group / NACL က Allow ပေးထားသလား?
         Inbound Rule: Port 80/443 Source 0.0.0.0/0 ရှိမရှိ

[ Step 4: Routing Path ] -> Route Table တွင် Default Gateway ရှိမရှိ?
         ip route show
```
