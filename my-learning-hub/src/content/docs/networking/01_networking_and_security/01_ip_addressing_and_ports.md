---
title: "အခန်း (၁) — IP Addressing နှင့် Port Fundamentals (မြန်မာဘာသာ)"
description: "Cloud Computing နှင့် AWS ကို လေ့လာရာတွင် ကွန်ရက်အခြေခံ (Networking Foundations) ကို မဖြစ်မနေ နားလည်ထားရပါမည်။ ဤအခန်းတွင် IP, Private IP, Public IP, Port တို့၏"
---

## အခန်း (၁) — IP Addressing နှင့် Port Fundamentals (မြန်မာဘာသာ)

Cloud Computing နှင့် AWS ကို လေ့လာရာတွင် ကွန်ရက်အခြေခံ (Networking Foundations) ကို မဖြစ်မနေ နားလည်ထားရပါမည်။ ဤအခန်းတွင် **IP, Private IP, Public IP, Port** တို့၏ သဘောတရား၊ အသုံးပြုပုံနှင့် လက်တွေ့ Cloud Infrastructure တွင် ချိတ်ဆက်ပုံများကို အသေးစိတ် ရှင်းပြထားပါသည်။

---

## ၁။ IP (Internet Protocol) ဆိုတာဘာလဲ?

### (က) ဒါကဘာလဲ? (What is it?)
- **IP Address** ဆိုသည်မှာ ကွန်ရက် (Network) ပေါ်ရှိ Computer, Server, Router သို့မဟုတ် စမတ်ဖုန်းတစ်ခုချင်းစီကို အခြားစက်များနှင့် မမှားယွင်းဘဲ ခွဲခြားသိရှိနိုင်စေရန် သတ်မှတ်ပေးထားသော **သီးသန့် လိပ်စာ (Unique Logical Address)** ဖြစ်ပါသည်။
- လူတစ်ဦးချင်းစီတွင် စာပို့ရန် "အိမ်လိပ်စာ" ရှိသကဲ့သို့ ကွန်ပျူတာများ အချင်းချင်း Data ပေးပို့ဆက်သွယ်ရန် "IP Address" လိုအပ်ပါသည်။
- ယနေ့ခေတ်တွင် အဓိကအားဖြင့် **IPv4** (32-bit: ဥပမာ `192.168.1.1`) နှင့် **IPv6** (128-bit: ဥပမာ `2001:0db8:85a3::8a2e:0370:7334`) ဟူ၍ နှစ်မျိုးရှိပြီး AWS တွင် IPv4 ကို အဓိက အခြေခံထားပြီး အသုံးပြုကြပါသည်။

```
IPv4 ဖွဲ့စည်းပုံ (32-bit, Octet ၄ ခု):
[ 192 ] . [ 168 ] . [ 1 ] . [ 10 ]
 8-bit     8-bit    8-bit   8-bit  = စုစုပေါင်း 32 bits (လိပ်စာပေါင်း ၄.၃ ဘီလီယံခန့်)
```

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- ကွန်ရက်ချိတ်ဆက်မှုတိုင်းတွင် Data Packet တစ်ခု ထွက်ခွာသည့်အခါ **Source IP (ဘယ်စက်က ပို့တာလဲ)** နှင့် **Destination IP (ဘယ်စက်ကို ပို့မှာလဲ)** မပါမဖြစ် လိုအပ်သောကြောင့် ဖြစ်ပါသည်။
- IP မရှိပါက Packet များသည် လမ်းပျောက်ပြီး မည်သည့်စက်သို့ ရောက်ရှိရမည်ကို Router များက လမ်းကြောင်း (Routing) မရှာပေးနိုင်ပါ။

### (ဂ) လက်တွေ့ ဘယ်လိုသုံးမလဲ? (How to use it?)
- **AWS တွင် သုံးပုံ:** AWS တွင် Virtual Private Cloud (VPC) တည်ဆောက်သည့်အခါ CIDR notation (ဥပမာ `10.0.0.0/16`) ဖြင့် IP Range ကို သတ်မှတ်ရပါသည်။
- **Linux Command စစ်ဆေးနည်း:**
  ```bash
  # လက်ရှိ Server ၏ IP address များကို စစ်ဆေးခြင်း
  ip addr show
  # သို့မဟုတ်
  hostname -I
  ```

---

## ၂။ Private IP (သီးသန့် အတွင်းပိုင်း IP)

### (က) ဒါကဘာလဲ? (What is it?)
- **Private IP** ဆိုသည်မှာ အင်တာနက် (Public Internet) ပေါ်တွင် တိုက်ရိုက် လမ်းကြောင်းမရှာနိုင်ဘဲ (Non-routable)၊ မိမိတို့၏ ရုံးတွင်းကွန်ရက် (Local Area Network - LAN) သို့မဟုတ် **AWS VPC (Virtual Private Cloud)** အတွင်းပိုင်း အချင်းချင်းသာ ဆက်သွယ်ရန် သတ်မှတ်ထားသော IP Address ဖြစ်ပါသည်။
- ကမ္ဘာ့အင်တာနက်အဖွဲ့အစည်း (IANA) ၏ **RFC 1918** စံနှုန်းအရ အောက်ပါ IP Range သုံးခုကို Private IP အဖြစ် အခမဲ့ သတ်မှတ်ပေးထားပါသည်:
  1. `10.0.0.0` မှ `10.255.255.255` အထိ (CIDR: `10.0.0.0/8` — AWS VPC တွင် အသုံးအများဆုံး)
  2. `172.16.0.0` မှ `172.31.255.255` အထိ (CIDR: `172.16.0.0/12` — AWS Default VPC)
  3. `192.168.0.0` မှ `192.168.255.255` အထိ (CIDR: `192.168.0.0/16` — အိမ်တွင်း Wi-Fi Router များ)

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
1. **Security (လုံခြုံရေး):** အင်တာနက်ပေါ်မှ Hacker များသည် Private IP သို့ တိုက်ရိုက် Scan ဖတ်ပြီး ဝင်ရောက်တိုက်ခိုက်၍ မရပါ။ (Database, Internal Microservice များကို လုံခြုံစွာထားရှိနိုင်သည်)။
2. **Cost & IP Exhaustion:** Public IPv4 လိပ်စာများသည် ကမ္ဘာပေါ်တွင် ရှားပါးပြီး စျေးကြီးသဖြင့် အတွင်းပိုင်း Server သန်းပေါင်းများစွာအတွက် Private IP ကို အခမဲ့ စိတ်ကြိုက် သုံးစွဲနိုင်ပါသည်။

### (ဂ) လက်တွေ့ ဘယ်လိုသုံးမလဲ? (How to use it?)
- AWS VPC တွင် Database (RDS) နှင့် Backend App Server များကို **Private Subnet** ထဲတွင် ထားရှိပြီး Private IP သာ တပ်ဆင်ပေးရပါသည်။
- AWS တွင် EC2 စက်တစ်ခုဖွင့်လိုက်ပါက Private IP အလိုအလျောက် ရရှိပါသည်။

```
[ Internet ]
     | (Public Internet)
[ NAT Gateway / ALB ] (Public Subnet)
     | (Private IP: 10.0.10.15)
[ Backend EC2 / RDS DB ] (Private Subnet - လုံခြုံစိတ်ချရသည်)
```

---

## ၃။ Public IP (အများသုံး အင်တာနက် IP)

### (က) ဒါကဘာလဲ? (What is it?)
- **Public IP** ဆိုသည်မှာ ကမ္ဘာတစ်ဝှမ်းလုံးရှိ အင်တာနက် (World Wide Web) ပေါ်တွင် တိုက်ရိုက် မြင်တွေ့နိုင်ပြီး မည်သည့်နေရာမှမဆို လှမ်းရောက်နိုင်သော (Globally Unique & Routable) လိပ်စာ ဖြစ်ပါသည်။
- ကမ္ဘာပေါ်တွင် တစ်ချိန်တည်း၌ တူညီသော Public IP နှစ်ခု မရှိနိုင်ပါ။ Internet Service Provider (ISP) သို့မဟုတ် AWS ကဲ့သို့သော Cloud Provider များထံမှသာ တရားဝင် ရယူရပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- ပြင်ပ User များသည် မိမိတို့၏ Web Application, E-commerce Website, API Endpoint များသို့ Browser မှတစ်ဆင့် ဝင်ရောက်ကြည့်ရှုနိုင်ရန် Public IP မဖြစ်မနေ လိုအပ်ပါသည်။
- Public IP မရှိသော Server သည် အင်တာနက်မှ မည်သူမျှ တိုက်ရိုက် လှမ်းခေါ်၍ မရနိုင်ပါ။

### (ဂ) လက်တွေ့ ဘယ်လိုသုံးမလဲ? (How to use it?)
- **AWS တွင် နှစ်မျိုးရှိပါသည်:**
  1. **Auto-assigned Public IP:** EC2 စက်ကို Public Subnet တွင် ဆောက်သည့်အခါ AWS မှ ခေတ္တငှားပေးသော IP ဖြစ်သည်။ စက်ကို Stop ပြီး Start ပြန်လုပ်ပါက IP ပြောင်းလဲသွားပါသည်။
  2. **Elastic IP (EIP):** မိမိအပိုင် Static Public IPv4 ဖြစ်သည်။ စက်ကို Restart ပြုလုပ်သော်လည်း IP မပြောင်းလဲပါ။ (NAT Gateway, Bastion Host များတွင် သုံးသည်)။
- **စစ်ဆေးနည်း:**
  ```bash
  # မိမိ Server ၏ Public IP ကို အင်တာနက်မှတစ်ဆင့် စစ်ဆေးခြင်း
  curl https://checkip.amazonaws.com
  ```

---

## ၄။ Port (ကွန်ရက် ဆိပ်ကမ်းပေါက်)

### (က) ဒါကဘာလဲ? (What is it?)
- IP Address သည် "တိုက်အိမ်လိပ်စာ" ဆိုပါက **Port** သည် ထိုတိုက်အိမ်အတွင်းရှိ "အခန်းနံပါတ် (Room Number)" သို့မဟုတ် "တံခါးပေါက်" နှင့် တူပါသည်။
- Server တစ်ခုတည်းတွင် Web Server (Nginx), Database (MySQL), Remote Login (SSH) စသည့် Program များစွာ တစ်ပြိုင်နက် Run နေနိုင်ပါသည်။ ထို Program အချင်းချင်း Traffic မရောထွေးစေရန် 1 မှ 65535 အထိ နံပါတ်များ ခွဲခြားသတ်မှတ်ထားခြင်း ဖြစ်ပါသည်။
- Port Range ခွဲခြားပုံ:
  - **Well-Known Ports (0 – 1023):** စံသတ်မှတ်ထားသော System ဝန်ဆောင်မှုများ (ဥပမာ HTTP 80, SSH 22)။
  - **Registered Ports (1024 – 49151):** Database နှင့် Framework များ (ဥပမာ MySQL 3306, Redis 6379)။
  - **Dynamic / Ephemeral Ports (49152 – 65535):** Client စက်များက ပြန်လည် ဆက်သွယ်ရန် ယာယီဖွင့်သော Port များ။

### (ခ) လက်တွေ့ အသုံးအများဆုံး Port များ ဇယား (Japan IT & AWS Essential Ports)

| Port နံပါတ် | Protocol / Service | အဓိပ္ပာယ်နှင့် အသုံးပြုပုံ | AWS တွင် ထားရှိသင့်သော နေရာ |
| :---: | :---: | :--- | :--- |
| **22** | **SSH / SFTP** | Linux Server ကို Terminal မှ လုံခြုံစွာ Remote Login ဝင်ရောက်ခြင်း | Security Group တွင် ရုံး IP သာ ခွင့်ပြုရမည် (သို့မဟုတ် SSM သုံးပြီး ပိတ်ထားရမည်) |
| **80** | **HTTP** | Unencrypted Plain-text Web Traffic (ဝဘ်ဆိုဒ် ပုံမှန်ဖွင့်ခြင်း) | ALB တွင် ဖွင့်ပြီး HTTPS (443) သို့ Redirect လုပ်ရမည် |
| **443** | **HTTPS** | SSL/TLS စနစ်ဖြင့် Encrypt ပြုလုပ်ထားသော လုံခြုံစိတ်ချရသော Web Traffic | ALB / CloudFront တွင် အင်တာနက်သို့ အမြဲဖွင့်ပေးရမည် |
| **3306** | **MySQL / Aurora** | MySQL Database ချိတ်ဆက်ခြင်း | Private Subnet ရှိ App Server များသာ ချိတ်ခွင့်ပေးရမည် (အင်တာနက်သို့ လုံးဝ ပိတ်ရမည်) |
| **5432** | **PostgreSQL** | PostgreSQL Database ချိတ်ဆက်ခြင်း | App Server Security Group သာ ဝင်ရောက်ခွင့်ပေးရမည် |
| **6379** | **Redis** | ElastiCache Redis In-Memory Cache ချိတ်ဆက်ခြင်း | Session & Cache အတွက် Private Subnet တွင်သာ ဖွင့်ရမည် |
| **53** | **DNS** | Domain နာမည်များကို IP ပြောင်းလဲပေးခြင်း (TCP/UDP) | Route 53 / VPC Resolver |

### (ဂ) လက်တွေ့ Port စစ်ဆေးနည်း Command များ
```bash
# Server ပေါ်တွင် လက်ရှိ နားထောင် (Listen) နေသော Port များကို ကြည့်ခြင်း
ss -tulpn
# သို့မဟုတ် netstat ဖြင့်
netstat -tuln

# အဝေးမှ Server တစ်ခု၏ Port ဖွင့်မဖွင့် စစ်ဆေးခြင်း (ဥပမာ MySQL port)
nc -zv 10.0.2.50 3306
# သို့မဟုတ် telnet ဖြင့်
telnet 10.0.2.50 3306
```

---

## အနှစ်ချုပ် လေ့လာမှုမှတ်စု
1. **IP:** ကွန်ရက်ပေါ်ရှိ စက်၏ သီးသန့်လိပ်စာ။
2. **Private IP:** VPC အတွင်းပိုင်း အချင်းချင်းသာ ဆက်သွယ်ပြီး ပြင်ပမှ တိုက်ရိုက် မမြင်ရသဖြင့် လုံခြုံရေးမြင့်မားသည်။
3. **Public IP:** ကမ္ဘာ့အင်တာနက်ပေါ်မှ လူတိုင်း ဝင်ရောက်နိုင်သော တရားဝင်လိပ်စာ။
4. **Port:** Server ပေါ်တွင် Run နေသော Application များကို ခွဲခြားပေးသည့် ဆက်သွယ်ရေး တံခါးပေါက် (Web=80/443, DB=3306, SSH=22)။
