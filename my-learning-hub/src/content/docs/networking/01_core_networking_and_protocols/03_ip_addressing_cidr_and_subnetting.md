---
title: IP Addressing, MAC, Subnet Mask & CIDR Calculations
description: IPv4, IPv6, Public vs Private IP, Static vs Dynamic, MAC Address, Subnet Mask နှင့် CIDR Subnetting တွက်ချက်နည်း
---

## ၁။ IP Address ဆိုတာဘာလဲ? (IPv4 vs IPv6)

IP Address (Internet Protocol Address) သည် Network ပေါ်ရှိ Device တစ်ခုစီကို ခွဲခြားသိရှိနိုင်စေရန် သတ်မှတ်ပေးထားသော Logical Identity ဖြစ်သည်။

- **IPv4:** 32-bit Address ဖြစ်ပြီး Octet ၄ ခုဖြင့် ဖွဲ့စည်းထားသည် (ဥပမာ - `192.168.1.1`)။ စုစုပေါင်း $2^{32} pprox 4.29$ ဘီလီယံ သာရှိသည်။
- **IPv6:** 128-bit Address ဖြစ်ပြီး Hexadecimal ဂဏန်း ၈ တွဲဖြင့် ဖွဲ့စည်းထားသည် (ဥပမာ - `2001:0db8:85a3:0000:0000:8a2e:0370:7334`)။ မကုန်ခမ်းနိုင်သော IP အရေအတွက် ပေးစွမ်းနိုင်သည်။

---

## ၂။ Public IP vs Private IP (RFC 1918)

- **Public IP:** Internet ပေါ်တွင် တိုက်ရိုက် သွားလာနိုင်ပြီး Globally Unique ဖြစ်သည်။ ISP သို့မဟုတ် Cloud Provider ထံမှ ငှားရမ်းရသည်။
- **Private IP:** ကုမ္ပဏီတွင်း သို့မဟုတ် Cloud VPC အတွင်းတွင်သာ အသုံးပြုနိုင်ပြီး Internet မှ တိုက်ရိုက် မမြင်နိုင်ပါ။

### RFC 1918 Private IP Blocks
1. **Class A (`10.0.0.0/8`):** `10.0.0.0` မှ `10.255.255.255` (AWS VPC များတွင် အသုံးအများဆုံး)
2. **Class B (`172.16.0.0/12`):** `172.16.0.0` မှ `172.31.255.255` (Docker Defaults)
3. **Class C (`192.168.0.0/16`):** `192.168.0.0` မှ `192.168.255.255` (Home Wi-Fi Routers)

---

## ၃။ Static IP vs Dynamic IP & MAC Address

- **Static IP:** အမြဲမပြောင်းလဲဘဲ သတ်မှတ်ထားသော IP (Production Servers, Databases, Ingress Gateways)။
- **Dynamic IP:** DHCP Server မှ အခိုက်အတန့် ငှားရမ်းပေးသော IP (Client PCs, Mobile Devices)။
- **MAC Address (Layer 2):** Network Interface Card (NIC) ပေါ်တွင် ထုတ်လုပ်သူ ရိုက်နှိပ်ထားသော 48-bit Physical Address (ဥပမာ `00:1A:2B:3C:4D:5E`)။

---

## ၄။ Subnet Mask & CIDR Notation (/24, /16, /32)

**CIDR (Classless Inter-Domain Routing)** သည် Slash (`/`) ဖြင့် Network Bits အရေအတွက်ကို ဖော်ပြသည်:

| CIDR Prefix | Subnet Mask | စုစုပေါင်း IP ($2^{(32-	ext{Prefix})}$) | အသုံးချရာနေရာ |
| :--- | :--- | :--- | :--- |
| **/16** | `255.255.0.0` | $65,536$ IPs | AWS VPC Default Size |
| **/24** | `255.255.255.0` | $256$ IPs | Standard Subnet (Web / DB) |
| **/28** | `255.255.255.240` | $16$ IPs | Microservices / NAT Subnet |
| **/32** | `255.255.255.255` | $1$ Host IP | Single IP White-listing in Security Group |

> [!IMPORTANT]
> **AWS VPC Subnet စည်းမျဉ်း:** Subnet တိုင်းတွင် IP ၅ ခုကို AWS က အမြဲ Reserve လုပ်ထားသဖြင့် `10.0.1.0/24` တွင် $256 - 5 = 251$ IP သာ အသုံးပြုနိုင်သည်။
