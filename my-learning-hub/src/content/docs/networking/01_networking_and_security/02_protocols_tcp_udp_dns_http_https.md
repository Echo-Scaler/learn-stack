---
title: "အခန်း (၂) — Transport နှင့် Web Protocols (TCP, UDP, DNS, HTTP, HTTPS)"
description: "ဤအခန်းတွင် အင်တာနက်နှင့် Cloud Networking ၏ သွေးကြောသဖွယ် အရေးပါသော Transport Layer (TCP, UDP) နှင့် Application/Web Layer (DNS, HTTP, HTTPS) တို့၏ သဘောတရားများ"
---

## အခန်း (၂) — Transport နှင့် Web Protocols (TCP, UDP, DNS, HTTP, HTTPS)

ဤအခန်းတွင် အင်တာနက်နှင့် Cloud Networking ၏ သွေးကြောသဖွယ် အရေးပါသော **Transport Layer (TCP, UDP)** နှင့် **Application/Web Layer (DNS, HTTP, HTTPS)** တို့၏ သဘောတရားများ၊ ၎င်းတို့ အလုပ်လုပ်ပုံနှင့် လက်တွေ့ ကွာခြားချက်များကို မြန်မာဘာသာဖြင့် အသေးစိတ် ဖော်ပြထားပါသည်။

---

## ၁။ TCP (Transmission Control Protocol)

### (က) ဒါကဘာလဲ? (What is it?)
- **TCP** ဆိုသည်မှာ Data ပို့ဆောင်ရာတွင် အစမှ အဆုံးတိုင်အောင် **စိတ်ချယုံကြည်စိတ်ချရမှု (Reliability)** ကို အဓိကထားသော ချိတ်ဆက်မှုအခြေပြု (Connection-Oriented) Protocol ဖြစ်ပါသည်။
- Data Packet များ ပျောက်ဆုံးသွားပါက အလိုအလျောက် ပြန်လည်ပို့ဆောင်ပေးခြင်း (Retransmission)၊ စာရွက်စာတမ်းများ အစီအစဉ်မလွဲစေရန် ပြန်လည်စီစဉ်ပေးခြင်း (Ordering) နှင့် အမြန်နှုန်းကို ထိန်းညှိပေးခြင်း (Flow Control) တို့ကို လုပ်ဆောင်ပေးပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- Web Page ဖွင့်ခြင်း (HTTP/HTTPS)၊ ဖိုင်ဒေါင်းလုဒ်ဆွဲခြင်း၊ Database Query ပို့ခြင်း၊ ငွေလွှဲခြင်း စသည့် **Data တစ်စက်မှ ပျောက်ဆုံး၍ မရသော လုပ်ငန်းစဉ်များ** အတွက် မဖြစ်မနေ သုံးရပါသည်။
- ဥပမာ- စာမျက်နှာတစ်ခု ဖွင့်ရာတွင် Data အပိုင်းအစ ပျောက်သွားပါက ပုံများ ပျက်သွားခြင်း သို့မဟုတ် Script များ အလုပ်မလုပ်တော့ခြင်း ဖြစ်နိုင်သောကြောင့် TCP ၏ အာမခံချက် လိုအပ်ပါသည်။

### (ဂ) အလုပ်လုပ်ပုံ: 3-Way Handshake
TCP သည် Data မပို့မီ Client နှင့် Server အကြား အောက်ပါအတိုင်း လက်ဆွဲနှုတ်ဆက် (Handshake) အတည်ပြုချက် ၃ ကြိမ် ပြုလုပ်ပါသည်:

```
[ Client ]                            [ Server ]
    |                                     |
    | -------- 1. SYN (ဆက်သွယ်ခွင့်တောင်း) ---> |
    |                                     |
    | <------- 2. SYN-ACK (လက်ခံကြောင်းပြန်) --- |
    |                                     |
    | -------- 3. ACK (အသိအမှတ်ပြု အတည်ပြု) --> |
    |                                     |
[ Connection Established! Data ပို့ဆောင်ခြင်း စတင် ]
```

---

## ၂။ UDP (User Datagram Protocol)

### (က) ဒါကဘာလဲ? (What is it?)
- **UDP** ဆိုသည်မှာ Handshake ပြုလုပ်ခြင်း၊ အတည်ပြုချက် (Acknowledgment) စောင့်ဆိုင်းခြင်း မရှိဘဲ Data များကို တစ်ဖက်သတ် အမြန်ဆုံး ပစ်ပို့ပေးသော (Connectionless) Protocol ဖြစ်ပါသည်။
- Data Packet ပျောက်ဆုံးသွားသော်လည်း ပြန်လည်မပို့ဆောင်ပါ (Best-effort delivery)။ ထို့ကြောင့် TCP ထက် များစွာ ပိုမိုပေါ့ပါးပြီး အလွန်မြန်ဆန်ပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- အချိန်နှင့်တစ်ပြေးညီ ဖြစ်ပျက်နေသော **Real-time Streaming, VoIP (အသံဖုန်းခေါ်ဆိုမှု), Video Call (Zoom/Teams), Online Multiplayer Gaming** နှင့် **DNS Query** များတွင် သုံးပါသည်။
- ဥပမာ- Video Call ပြောနေစဉ် စကားတစ်လုံး ကျန်ခဲ့သော် နောက်မှ ပြန်ပို့ပါက အသံများ ထပ်သွားမည် ဖြစ်သဖြင့် လက်ရှိအချိန်နှင့် ကိုက်ညီစေရန် ပျောက်သွားသော Packet ကို စွန့်လွှတ်ပြီး အမြန်နှုန်းကို ဦးစားပေးပါသည်။

### (ဂ) TCP vs UDP နှိုင်းယှဉ်ချက် ဇယား

| အချက်အလက် | TCP | UDP |
| :--- | :--- | :--- |
| **ချိတ်ဆက်မှု (Connection)** | Connection-Oriented (3-Way Handshake) | Connectionless (No Handshake) |
| **ယုံကြည်စိတ်ချရမှု (Reliability)** | အာမခံချက် အပြည့်ရှိသည် (Packet Loss မရှိ) | အာမခံချက် မရှိပါ (Packet Loss ဖြစ်နိုင်သည်) |
| **အမြန်နှုန်း (Speed)** | Header ကြီးပြီး အတည်ပြုချက်စောင့်ရသဖြင့် ပိုနှေးသည် | Header သေးငယ်ပြီး တိုက်ရိုက်ပစ်ပို့သဖြင့် အလွန်မြန်သည် |
| **အသုံးပြုသော နေရာ** | Web (HTTP/HTTPS), SSH, FTP, Database (MySQL) | DNS, DHCP, Video Streaming, VoIP, HTTP/3 (QUIC) |

---

## ၃။ DNS (Domain Name System)

### (က) ဒါကဘာလဲ? (What is it?)
- **DNS** ဆိုသည်မှာ အင်တာနက်၏ **ဖုန်းစာအုပ် (Phonebook of the Internet)** ဖြစ်ပါသည်။
- လူသားများသည် `13.230.12.45` ကဲ့သို့သော ဂဏန်း IP Address များကို မှတ်မိရန် ခက်ခဲသောကြောင့် `example.com` ဟူသော စာလုံး (Domain Name) ကို လူသားဖတ်နိုင်အောင် ရိုက်ထည့်ကြသည်။ DNS သည် ထို Domain နာမည်ကို စက်များနားလည်သည့် IP Address အဖြစ် ဘာသာပြန်ပေးပါသည်။

```
User: "google.com" ရိုက်ထည့်သည် 
          ↓ (DNS Resolution)
DNS Server: "google.com ရဲ့ IP က 142.250.196.46 ဖြစ်ပါတယ်" ဟု အကြောင်းပြန်သည်
          ↓
Browser: 142.250.196.46 သို့ ဝဘ်ဆိုက်တောင်းဆိုမှု စတင်သည်
```

### (ခ) အရေးပါသော DNS Record အမျိုးအစားများ (AWS Route 53)
1. **A Record (Address):** Domain Name ကို IPv4 လိပ်စာသို့ တိုက်ရိုက် ညွှန်းပေးခြင်း (ဥပမာ `app.example.com → 54.23.10.1`)။
2. **AAAA Record:** Domain Name ကို IPv6 လိပ်စာသို့ ညွှန်းပေးခြင်း။
3. **CNAME (Canonical Name):** Domain Name တစ်ခုကို အခြား Domain Name တစ်ခုသို့ Alias ပြုလုပ်ပေးခြင်း (ဥပမာ `www.example.com → example.com`)။
4. **ALIAS Record (AWS Route 53 သီးသန့်):** AWS Application Load Balancer (ALB) သို့မဟုတ် CloudFront ၏ ရှည်လျားသော AWS DNS သို့ Root Domain (`example.com`) မှ တိုက်ရိုက် ညွှန်းပေးနိုင်သော အထူးစနစ်။
5. **MX Record:** Email လက်ခံမည့် Mail Server ကို ညွှန်းပေးခြင်း။
6. **TXT Record:** Domain ပိုင်ဆိုင်မှု အတည်ပြုခြင်း (Google Search Console, ACM SSL DNS Validation)။

### (ဂ) Command စစ်ဆေးနည်း
```bash
# Domain တစ်ခု၏ IP Address ကို ရှာဖွေစစ်ဆေးခြင်း
dig example.com
# သို့မဟုတ်
nslookup example.com
```

---

## ၄။ HTTP (HyperText Transfer Protocol)

### (က) ဒါကဘာလဲ? (What is it?)
- **HTTP** ဆိုသည်မှာ Web Browser (Client) နှင့် Web Server အကြား HTML စာမျက်နှာများ၊ ပုံများ၊ CSS, JS ဖိုင်များနှင့် JSON Data များကို အပြန်အလှန် ဖလှယ်ရန် အသုံးပြုသော Application Protocol ဖြစ်ပါသည်။
- Port နံပါတ် **80** တွင် အလုပ်လုပ်ပြီး Plain-text (စာသားအတိုင်း) ပေးပို့သောကြောင့် လုံခြုံရေး အားနည်းပါသည်။

### (ခ) အသုံးများသော HTTP Methods
- `GET`: Server ထံမှ Data ကို ရယူခြင်း (ဥပမာ ဝဘ်စာမျက်နှာ ဖွင့်ခြင်း)။
- `POST`: Server ပေါ်သို့ Data အသစ် ပေးပို့သိမ်းဆည်းခြင်း (ဥပမာ Login Form, Register Form ဖြည့်ခြင်း)။
- `PUT / PATCH`: Server ပေါ်ရှိ Data ကို ပြင်ဆင် Update ပြုလုပ်ခြင်း။
- `DELETE`: Server ပေါ်ရှိ Data ကို ဖျက်ထုတ်ခြင်း။

### (ဂ) အရေးကြီးသော HTTP Status Codes (Japan IT & Cloud Operations)
- **2xx (Success):** 
  - `200 OK`: လုပ်ငန်းအောင်မြင်ပြီး Data ပြန်လည်ရရှိသည်။
  - `201 Created`: Data အသစ် အောင်မြင်စွာ ဖန်တီးပြီးစီးသည်။
- **3xx (Redirection):**
  - `301 Moved Permanently`: URL အမြဲတမ်း ပြောင်းလဲသွားသည် (HTTP to HTTPS Redirect တွင် သုံးသည်)။
- **4xx (Client Error - User ဘက်က အမှား):**
  - `400 Bad Request`: Data ပို့ပုံစံ မှားယွင်းခြင်း။
  - `401 Unauthorized`: Login မဝင်ရသေးခြင်း။
  - `403 Forbidden`: Login ဝင်ထားသော်လည်း ဤနေရာကို ကြည့်ခွင့်မရှိခြင်း (Permission မရှိခြင်း)။
  - `404 Not Found`: တောင်းဆိုသော Web Page သို့မဟုတ် API မရှိခြင်း။
- **5xx (Server Error - Developer / Cloud ဘက်က အမှား):**
  - `500 Internal Server Error`: Backend Code (Laravel/Node.js) တွင် Error တက်ပြီး Crash ဖြစ်ခြင်း။
  - `502 Bad Gateway`: ALB က Backend EC2/Fargate Container စက်သို့ ချိတ်မရခြင်း။
  - `503 Service Unavailable`: Server ပေါ်တွင် Traffic များလွန်း၍ မခံနိုင်တော့ခြင်း သို့မဟုတ် Deployment လုပ်နေခြင်း။
  - `504 Gateway Timeout`: Backend App က သတ်မှတ်ချိန် (ဥပမာ 60s) အတွင်း Response ပြန်မပေးနိုင်ခြင်း (Database Slow Query ကြောင့် ဖြစ်လေ့ရှိသည်)။

---

## ၅။ HTTPS (HTTP Secure - TLS/SSL)

### (က) ဒါကဘာလဲ? (What is it?)
- **HTTPS** ဆိုသည်မှာ HTTP ၏ Data များကို **SSL/TLS (Transport Layer Security)** နည်းပညာဖြင့် လျှို့ဝှက်ကုဒ်ပြောင်း (Encryption) ပြုလုပ်ထားသော လုံခြုံစိတ်ချရသည့် Web Protocol ဖြစ်ပါသည်။
- Port နံပါတ် **443** တွင် အလုပ်လုပ်ပါသည်။
- HTTP တွင် သုံးစွဲသူ ရိုက်ထည့်လိုက်သော Password နှင့် Credit Card နံပါတ်များကို ကြားဖြတ်ခိုးယူသူ (Man-in-the-Middle) က အလွယ်တကူ မြင်တွေ့နိုင်သော်လည်း၊ HTTPS တွင်မူ အဆင့်မြင့် သင်္ချာနည်းပညာဖြင့် ဝှက်ထားသဖြင့် မည်သူမျှ ကြားမှ ဖတ်မရနိုင်ပါ။

```
[ Browser ]                                       [ Web Server / ALB ]
     |                                                    |
     | === 1. Client Hello (ပံ့ပိုးသော Cipher စာရင်း) ====> |
     |                                                    |
     | <== 2. Server Hello + SSL Certificate (ACM) ===== |
     |                                                    |
     | === 3. Key Exchange & Symmetric Key သဘောတူညီမှု ===> |
     |                                                    |
     | <================================================> |
     |     [ TLS Encrypted Tunnel ထဲမှ Data ပို့ခြင်း ]     |
```

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
1. **Confidentiality (လျှို့ဝှက်ချက်လုံခြုံမှု):** Data များကို Hackers များ ကြားဖြတ် ခိုးယူဖတ်ရှု၍ မရနိုင်ပါ။
2. **Integrity (မပျက်မစီး အာမခံချက်):** ပေးပို့လိုက်သော Data ကို ကြားမှ ပြင်ဆင်ပြောင်းလဲခြင်း (Tampering) မရှိကြောင်း သေချာစေပါသည်။
3. **Authentication (အစစ်အမှန်ဖြစ်မှု အာမခံချက်):** မိမိ ဝင်ရောက်နေသော ဝဘ်ဆိုဒ်သည် အတုအယောင် Phishing Site မဟုတ်ဘဲ တရားဝင် Certificate ရရှိထားသော ဝဘ်ဆိုဒ် အစစ်ဖြစ်ကြောင်း Browser က အစိမ်းရောင် သော့ခတ်ပုံပြသပေးပါသည်။

### (ဂ) AWS တွင် လက်တွေ့ အသုံးပြုပုံ
- AWS တွင် **AWS Certificate Manager (ACM)** မှတစ်ဆင့် Public SSL/TLS Certificate များကို အခမဲ့ ထုတ်ယူနိုင်ပါသည်။
- ထုတ်ယူထားသော Certificate ကို **Application Load Balancer (ALB)** သို့မဟုတ် **CloudFront (CDN)** ပေါ်တွင် တင်ဆင် (SSL Termination) ပေးရပြီး Client ထံမှ Port 443 ဖြင့် လုံခြုံစွာ လက်ခံပေးပါသည်။
