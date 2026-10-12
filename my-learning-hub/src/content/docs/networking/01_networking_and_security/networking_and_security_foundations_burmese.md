---
title: "AWS & Cloud Networking & Security Foundations (မြန်မာဘာသာ)"
description: "ဤစာအုပ်သည် Cloud Computing (AWS) နှင့် Web Application Development ကို စတင်လေ့လာနေသော အင်ဂျင်နီယာများအတွက် အခြေခံအကျဆုံးနှင့် မသိမဖြစ် လိုအပ်သော Networking, Sec"
---

## AWS & Cloud Networking & Security Foundations (မြန်မာဘာသာ)
### ကွန်ရက်အခြေခံမှသည် Cloud Security & Operations အထိ ပြည့်စုံသော လမ်းညွှန်ကျမ်း

ဤစာအုပ်သည် Cloud Computing (AWS) နှင့် Web Application Development ကို စတင်လေ့လာနေသော အင်ဂျင်နီယာများအတွက် အခြေခံအကျဆုံးနှင့် မသိမဖြစ် လိုအပ်သော **Networking, Security, Governance & Operations** အယူအဆများကို မြန်မာဘာသာဖြင့် သဘောတရား၊ အသုံးပြုရသည့် အကြောင်းရင်း၊ အလုပ်လုပ်ပုံနှင့် လက်တွေ့ Cloud ဒီဇိုင်းများကို တစ်စုတစ်စည်းတည်း ရေးသားထားသော Master Guide ဖြစ်ပါသည်။

---

## မာတိကာ (Table of Contents)

1. [၁။ IP (Internet Protocol)](#၁-ip-internet-protocol)
2. [၂။ Private IP (သီးသန့် အတွင်းပိုင်း IP)](#၂-private-ip-သီးသန့်-အတွင်းပိုင်း-ip)
3. [၃။ Public IP (အများသုံး အင်တာနက် IP)](#၃-public-ip-အများသုံး-အင်တာနက်-ip)
4. [၄။ Port (ကွန်ရက် ဆိပ်ကမ်းပေါက်)](#၄-port-ကွန်ရက်-ဆိပ်ကမ်းပေါက်)
5. [၅။ TCP (Transmission Control Protocol)](#၅-tcp-transmission-control-protocol)
6. [၆။ UDP (User Datagram Protocol)](#၆-udp-user-datagram-protocol)
7. [၇။ DNS (Domain Name System)](#၇-dns-domain-name-system)
8. [၈။ HTTP (HyperText Transfer Protocol)](#၈-http-hypertext-transfer-protocol)
9. [၉။ HTTPS (HTTP Secure - TLS/SSL)](#၉-https-http-secure---tlsssl)
10. [၁၀။ NAT (Network Address Translation)](#၁၀-nat-network-address-translation)
11. [၁၁။ Firewall (မီးတံတိုင်း လုံခြုံရေး)](#၁၁-firewall-မီးတံတိုင်း-လုံခြုံရေး)
12. [၁၂။ IAM Least Privilege (အနည်းဆုံး အခွင့်အာဏာ ပေးအပ်ခြင်း)](#၁၂-iam-least-privilege-အနည်းဆုံး-အခွင့်အာဏာ-ပေးအပ်ခြင်း)
13. [၁၃။ Public Access (အများသုံး ဝင်ရောက်ခွင့် ထိန်းချုပ်ခြင်း)](#၁၃-public-access-အများသုံး-ဝင်ရောက်ခွင့်-ထိန်းချုပ်ခြင်း)
14. [၁၄။ Security Group (AWS Virtual Firewall)](#၁၄-security-group-aws-virtual-firewall)
15. [၁၅။ Encryption (ဒေတာ လျှို့ဝှက်ကုဒ်ပြောင်းလဲခြင်း)](#၁၅-encryption-ဒေတာ-လျှို့ဝှက်ကုဒ်ပြောင်းလဲခြင်း)
16. [၁၆။ Secrets Management (လျှို့ဝှက် အချက်အလက်များ ထိန်းသိမ်းခြင်း)](#၁၆-secrets-management-လျှို့ဝှက်-အချက်အလက်များ-ထိန်းသိမ်းခြင်း)
17. [၁၇။ Logging (စနစ်ဖြစ်ရပ်များ မှတ်တမ်းတင်ခြင်း)](#၁၇-logging-စနစ်ဖြစ်ရပ်များ-မှတ်တမ်းတင်ခြင်း)
18. [၁၈။ Monitoring (စနစ်ကျန်းမာရေး စောင့်ကြည့်စစ်ဆေးခြင်း)](#၁၈-monitoring-စနစ်ကျန်းမာရေး-စောင့်ကြည့်စစ်ဆေးခြင်း)
19. [၁၉။ Backup (ဒေတာ အရန်သိမ်းဆည်းခြင်းနှင့် ကယ်ဆယ်ခြင်း)](#၁၉-backup-ဒေတာ-အရန်သိမ်းဆည်းခြင်းနှင့်-ကယ်ဆယ်ခြင်း)
20. [၂၀။ Audit (လုပ်ဆောင်ချက်များအား စစ်ဆေးအတည်ပြုခြင်း)](#၂၀-audit-လုပ်ဆောင်ချက်များအား-စစ်ဆေးအတည်ပြုခြင်း)

---

## ၁။ IP (Internet Protocol)
- **ဒါကဘာလဲ?** ကွန်ရက်ပေါ်ရှိ ကွန်ပျူတာ၊ ဆာဗာ သို့မဟုတ် စက်တစ်ခုချင်းစီကို အခြားစက်များနှင့် မမှားယွင်းဘဲ ခွဲခြားသိရှိနိုင်စေရန် သတ်မှတ်ပေးထားသော ၃၂-ဘစ် (IPv4) သို့မဟုတ် ၁၂၈-ဘစ် (IPv6) လိပ်စာ ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** Data Packet တစ်ခု ထွက်ခွာသည့်အခါ Source IP နှင့် Destination IP မပါပါက Router များက လမ်းကြောင်း (Routing) မရှာပေးနိုင်သောကြောင့် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS တွင် VPC ဆောက်သည့်အခါ `10.0.0.0/16` ကဲ့သို့သော CIDR Block ဖြင့် IP Range ကို သတ်မှတ်သည်။

## ၂။ Private IP (သီးသန့် အတွင်းပိုင်း IP)
- **ဒါကဘာလဲ?** အင်တာနက်ပေါ်တွင် တိုက်ရိုက် မပေါက်ဘဲ (Non-routable)၊ ရုံးတွင်းကွန်ရက် သို့မဟုတ် AWS VPC အတွင်း စက်အချင်းချင်းသာ ဆက်သွယ်နိုင်သော IP ဖြစ်သည်။ (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)။
- **ဘာကြောင့်သုံးတာလဲ?** ပြင်ပ Hacker များသည် Private IP ကို တိုက်ရိုက် Scan ဖတ်၍ မရသောကြောင့် Database များနှင့် Backend စနစ်များကို လုံခြုံစွာထားရှိနိုင်ရန်နှင့် အခမဲ့ အကန့်အသတ်မရှိ သုံးနိုင်ရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS VPC ရှိ RDS Database နှင့် ECS Container များကို Private Subnet တွင် Private IP ဖြင့်သာ ဖွင့်လှစ်သည်။

## ၃။ Public IP (အများသုံး အင်တာနက် IP)
- **ဒါကဘာလဲ?** ကမ္ဘာတစ်ဝှမ်းရှိ အင်တာနက်ပေါ်တွင် တိုက်ရိုက် လမ်းကြောင်းပေါက်ပြီး မည်သည့်နေရာမှမဆို လှမ်းခေါ်နိုင်သော တရားဝင် လိပ်စာ ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** အများပြည်သူ (End-users) များသည် မိမိတို့၏ Web Application သို့မဟုတ် API သို့ Browser မှတစ်ဆင့် ဝင်ရောက်ကြည့်ရှုနိုင်ရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS ALB (Load Balancer) သို့မဟုတ် NAT Gateway တွင် Elastic IP (Static Public IP) တပ်ဆင်ပေးရသည်။

## ၄။ Port (ကွန်ရက် ဆိပ်ကမ်းပေါက်)
- **ဒါကဘာလဲ?** Server တစ်ခုတည်းတွင် Web Server, Database, SSH စသည့် App များစွာ Run နေနိုင်ရာ၊ ၎င်းတို့ကို ခွဲခြားပေးသည့် ၁ မှ ၆၅၅၃၅ အထိ နံပါတ်များ (အခန်းနံပါတ် သဘော) ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** ဝင်လာသော Data Packet သည် မည်သည့် Program အတွက် ဖြစ်သည်ကို OS က တိကျစွာ ခွဲခြားလက်ခံနိုင်ရန် ဖြစ်သည်။
- **လက်တွေ့ အသုံးများသော Port များ:**
  - `22`: SSH / Linux Terminal Remote Login
  - `80`: HTTP (Plaintext Web)
  - `443`: HTTPS (Secure Web)
  - `3306`: MySQL / Aurora Database
  - `5432`: PostgreSQL Database
  - `6379`: Redis In-Memory Cache

## ၅။ TCP (Transmission Control Protocol)
- **ဒါကဘာလဲ?** 3-Way Handshake (SYN → SYN-ACK → ACK) ဖြင့် စတင်ပြီး Data တစ်စက်မှ မပျောက်ဆုံးစေရန် အာမခံချက်ပေးသော ချိတ်ဆက်မှုအခြေပြု (Connection-Oriented) Protocol ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** ဖိုင်ဒေါင်းလုဒ်၊ ငွေလွှဲခြင်း၊ Web Page ဖတ်ခြင်းနှင့် Database ချိတ်ဆက်မှုများတွင် Data ပျောက်ဆုံးပါက စနစ်ပျက်စီးနိုင်သောကြောင့် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** HTTP, HTTPS, SSH, MySQL, Postgres အားလုံးသည် TCP ပေါ်တွင် အလုပ်လုပ်သည်။

## ၆။ UDP (User Datagram Protocol)
- **ဒါကဘာလဲ?** Handshake မလုပ်ဘဲ Data ကို တစ်ဖက်သတ် အမြန်ဆုံး ပစ်ပို့ပေးသော (Connectionless) Protocol ဖြစ်သည်။ Packet ပျောက်သွားသော်လည်း ပြန်မပို့ပါ။
- **ဘာကြောင့်သုံးတာလဲ?** Real-time Voice (VoIP), Video Call (Zoom), Live Streaming, Online Gaming နှင့် DNS Lookup ကဲ့သို့သော အမြန်နှုန်း အဓိက လိုအပ်သည့် နေရာများအတွက် သုံးသည်။
- **လက်တွေ့အသုံးပြုပုံ:** DNS (Port 53) နှင့် ခေတ်သစ် HTTP/3 (QUIC) တို့သည် UDP ကို အသုံးပြုသည်။

## ၇။ DNS (Domain Name System)
- **ဒါကဘာလဲ?** လူသားဖတ်နိုင်သော Domain Name (`example.com`) ကို ကွန်ပျူတာများ နားလည်သော IP (`13.230.12.45`) သို့ ဘာသာပြန်ပေးသော အင်တာနက်၏ ဖုန်းစာအုပ် ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** လူများသည် ဂဏန်း IP များကို မှတ်မိရန် မဖြစ်နိုင်သောကြောင့် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS Route 53 တွင် A Record (Domain → IP), CNAME (Domain → Domain), ALIAS Record (Domain → AWS ALB/CloudFront) တို့ကို သတ်မှတ်သည်။

## ၈။ HTTP (HyperText Transfer Protocol)
- **ဒါကဘာလဲ?** Web Browser နှင့် Web Server အကြား HTML, CSS, JavaScript, JSON Data ဖလှယ်ရာတွင် အသုံးပြုသော Application Protocol ဖြစ်ပြီး Port 80 တွင် အလုပ်လုပ်သည်။
- **အရေးပါသော Status Codes:** `200 OK`, `301 Redirect`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`, `502 Bad Gateway`, `504 Timeout`။

## ၉။ HTTPS (HTTP Secure - TLS/SSL)
- **ဒါကဘာလဲ?** HTTP Data များကို SSL/TLS Encryption စနစ်ဖြင့် Encrypt ပြုလုပ်ထားပြီး Port 443 တွင် လုံခြုံစွာ အလုပ်လုပ်သော Protocol ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** စကားဝှက်များ၊ Credit Card နံပါတ်များကို Hacker များ ကြားဖြတ်ခိုးယူဖတ်ရှုခြင်း (Man-in-the-Middle Attack) မှ ကာကွယ်ရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS Certificate Manager (ACM) မှ အခမဲ့ SSL Certificate ရယူကာ Application Load Balancer (ALB) တွင် တင်ဆင်သည်။

## ၁၀။ NAT (Network Address Translation)
- **ဒါကဘာလဲ?** Private Subnet ရှိ Server များ၏ Private IP များကို Public IP အဖြစ် ပြောင်းလဲပေးသည့် နည်းပညာ ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** အတွင်းရှိ Private Database/App Server များကို Hacker များ တိုက်ရိုက် မဝင်ရောက်နိုင်အောင် ကာကွယ်ထားသော်လည်း၊ OS Updates နှင့် Third-party API များကို အင်တာနက်သို့ ထွက်ခေါ်နိုင်စေရန် (Outbound Only) ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS Managed NAT Gateway ကို Public Subnet တွင် ထားရှိပြီး Elastic IP တွဲဖက်ကာ Private Subnet Route Table တွင် ညွှန်းပေးသည်။

## ၁၁။ Firewall (မီးတံတိုင်း လုံခြုံရေး)
- **ဒါကဘာလဲ?** စည်းမျဉ်းများ (Security Rules) အရ အဝင် (Inbound) နှင့် အထွက် (Outbound) ကွန်ရက် Packet များကို စစ်ဆေးပြီး Allow သို့မဟုတ် Deny လုပ်ပေးသည့် စနစ် ဖြစ်သည်။
- **အမျိုးအစားများ:**
  - *Stateful Firewall (ဥပမာ AWS Security Group):* အဝင်ခွင့်ပြုပါက အထွက် အလိုအလျောက် ပြန်ထွက်ခွင့်ရသည်။
  - *Stateless Firewall (ဥပမာ AWS Network ACL):* အဝင်ကော အထွက်ပါ သီးခြား စည်းမျဉ်းရေးရသည်။

## ၁၂။ IAM Least Privilege (အနည်းဆုံး အခွင့်အာဏာ ပေးအပ်ခြင်း)
- **ဒါကဘာလဲ?** User သို့မဟုတ် Server (EC2/Lambda) တစ်ခုကို ၎င်း၏ တာဝန်ပြီးမြောက်ရန် လိုအပ်သော အနည်းဆုံး Permission ကိုသာ ပေးပြီး အခြားအရာအားလုံးကို ပိတ်ထားခြင်း ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** Credential ပေါက်ကြားသွားသော်လည်း အခြား Cloud Resources များကို Hacker က ဖျက်ဆီး၍ မရနိုင်စေရန် ကာကွယ်ခြင်း ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** `Action: "*"` အစား `s3:GetObject`, `s3:PutObject` ကဲ့သို့သော တိကျသည့် Action များနှင့် သီးသန့် Bucket ARN များကိုသာ Policy တွင် ရေးသားသည်။

## ၁၃။ Public Access (အများသုံး ဝင်ရောက်ခွင့် ထိန်းချုပ်ခြင်း)
- **ဒါကဘာလဲ?** Cloud Resources များကို အင်တာနက်မှ တိုက်ရိုက် လှမ်းဝင်နိုင်ခြင်း ရှိမရှိ ထိန်းချုပ်ခြင်း ဖြစ်သည်။
- **အကောင်းဆုံး အလေ့အကျင့်:**
  - S3 Block Public Access ကို အမြဲ ON ထားရမည်။
  - RDS Database များကို `Publicly Accessible: No` ထားရမည်။
  - EC2 တွင် Port 22 SSH ဖွင့်မည့်အစား AWS Systems Manager (SSM) ကိုသာ အသုံးပြုရမည်။

## ၁၄။ Security Group (AWS Virtual Firewall)
- **ဒါကဘာလဲ?** EC2, ECS, RDS စသည့် AWS Resources များ ပတ်လည်တွင် ကာရံထားသော Stateful Firewall ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** Inbound ကို မူလအားဖြင့် အကုန်ပိတ်ထားပြီး (Default Deny)၊ မိမိ ခွင့်ပြုလိုသော Port (ဥပမာ HTTP 80/443) ကိုသာ ဖွင့်ပေးနိုင်သောကြောင့် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** Database Security Group ၏ Inbound တွင် App Server ၏ Security Group ID ကိုသာ Source အဖြစ် ထည့်သွင်းခြင်း (Chained SG)။

## ၁၅။ Encryption (ဒေတာ လျှို့ဝှက်ကုဒ်ပြောင်းလဲခြင်း)
- **ဒါကဘာလဲ?** သာမန်စာသား (Plaintext) များကို သော့ (Key) မရှိပါက ဖတ်မရသော Ciphertext အဖြစ် သင်္ချာနည်းအရ ဝှက်ထားခြင်း ဖြစ်သည်။
- **အမျိုးအစားများ:**
  - *Encryption in Transit:* ကွန်ရက်ကြိုးပေါ်တွင် TLS 1.3 / HTTPS ဖြင့် ကာကွယ်ခြင်း။
  - *Encryption at Rest:* Hard Disk / SSD ပေါ်တွင် AWS KMS (AES-256) ဖြင့် ကာကွယ်ခြင်း။

## ၁၆။ Secrets Management (လျှို့ဝှက် အချက်အလက်များ ထိန်းသိမ်းခြင်း)
- **ဒါကဘာလဲ?** Database Passwords, API Keys များကို Git Source Code ထဲတွင် Hardcode မရေးဘဲ လုံခြုံသော နေရာတွင် သိမ်းဆည်းခြင်း ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** Code Leak ဖြစ်သော်လည်း Password မပါသွားစေရန်နှင့် Password များကို အလိုအလျောက် Rotate လုပ်နိုင်ရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS Secrets Manager နှင့် SSM Parameter Store ကို အသုံးပြုသည်။

## ၁၇။ Logging (စနစ်ဖြစ်ရပ်များ မှတ်တမ်းတင်ခြင်း)
- **ဒါကဘာလဲ?** စနစ်အတွင်း ဖြစ်ပျက်သမျှ Event, Connection, Request နှင့် Error များကို အချိန်မှတ်တမ်း (Timestamp) နှင့်တကွ ရေးသားသိမ်းဆည်းခြင်း ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** App Error များအတွက် Laravel/Nginx Logs၊ Network လုံခြုံရေးအတွက် VPC Flow Logs၊ အားလုံးကို CloudWatch Logs သို့ စုစည်းပို့ဆောင်ပြီး Insights ဖြင့် Query ရှာဖွေသည်။

## ၁၈။ Monitoring (စနစ်ကျန်းမာရေး စောင့်ကြည့်စစ်ဆေးခြင်း)
- **ဒါကဘာလဲ?** CPU %, Memory %, Disk Space, 5xx Error Count ကဲ့သို့သော Metrics များကို အချိန်နှင့်တစ်ပြေးညီ စောင့်ကြည့်နေခြင်း ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** စနစ် ပြုတ်မကျမီ ကြိုတင်သတိပေးချက် ရယူနိုင်ရန်နှင့် Traffic များပါက Auto-scaling လုပ်နိုင်ရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS CloudWatch Alarms မှတစ်ဆင့် အရေးပေါ် အခြေအနေများကို SNS မှတစ်ဆင့် Slack / PagerDuty သို့ အလိုအလျောက် သတိပေးချက် ပို့သည်။

## ၁၉။ Backup (ဒေတာ အရန်သိမ်းဆည်းခြင်းနှင့် ကယ်ဆယ်ခြင်း)
- **ဒါကဘာလဲ?** စက်ပျက်ခြင်း၊ Ransomware တိုက်ခိုက်ခံရခြင်း သို့မဟုတ် လူမှားယွင်းဖျက်မိခြင်းများမှ မူလအခြေအနေသို့ ပြန်လည်ရယူနိုင်ရန် မိတ္တူကူးထားခြင်း ဖြစ်သည်။
- **အဓိက စံနှုန်းများ:** RPO (ဒေတာ ဆုံးရှုံးမှု ခံနိုင်ရည် အချိန်) နှင့် RTO (စနစ် ပြန်လည်ထူထောင်ရန် ကြာချိန်)။
- **လက်တွေ့အသုံးပြုပုံ:** RDS Point-In-Time Recovery (PITR)၊ AWS Backup ဖြင့် Daily Automated Snapshot များ ကူးယူခြင်းနှင့် Cross-Region Backup (Tokyo → Osaka)။

## ၂၀။ Audit (လုပ်ဆောင်ချက်များအား စစ်ဆေးအတည်ပြုခြင်း)
- **ဒါကဘာလဲ?** Cloud စနစ်အတွင်း "မည်သူက၊ မည်သည့်အချိန်တွင်၊ မည်သည့်နေရာမှ၊ မည်သည့် API ကို ခေါ်ယူလုပ်ဆောင်သွားသနည်း" ကို အတည်ပြုစစ်ဆေးခြင်း ဖြစ်သည်။
- **ဘာကြောင့်သုံးတာလဲ?** လုံခြုံရေး စုံစမ်းစစ်ဆေးခြင်း (Security Forensics) ပြုလုပ်ရန်နှင့် ISO 27001, SOC2 Compliance ဥပဒေ စံနှုန်းများနှင့် ကိုက်ညီစေရန် ဖြစ်သည်။
- **လက်တွေ့အသုံးပြုပုံ:** AWS CloudTrail (API Call Audit Log) နှင့် AWS Config (Configuration History Audit) တို့ကို အသုံးပြုသည်။
