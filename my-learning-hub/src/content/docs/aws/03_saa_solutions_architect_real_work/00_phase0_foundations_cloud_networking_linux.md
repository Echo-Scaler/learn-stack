---
title: "Phase 0 — SAA ကို မစခင် လိုအပ်သော အခြေခံအုတ်မြစ်များ (Foundation)"
description: "Architect Perspective: Solutions Architect တစ်ဦးဖြစ်ရန် AWS Service များကို မလေ့လာမီ ကွန်ပျူတာ Cloud အခြေခံများ၊ Computer Networking သဘောတရားများနှင့် Linux Com"
---

## Phase 0 — SAA ကို မစခင် လိုအပ်သော အခြေခံအုတ်မြစ်များ (Foundation)

> **Architect Perspective:** Solutions Architect တစ်ဦးဖြစ်ရန် AWS Service များကို မလေ့လာမီ ကွန်ပျူတာ Cloud အခြေခံများ၊ Computer Networking သဘောတရားများနှင့် Linux Command-line စွမ်းရည်များကို မဖြစ်မနေ ပိုင်နိုင်စွာ နားလည်ထားရပါမည်။

---

## ၀.၁ Cloud Computing Basics (အခြေခံသဘောတရားများ)

### ၁။ Cloud Computing ဆိုတာဘာလဲ?
Cloud Computing ဆိုသည်မှာ မိမိကိုယ်တိုင် ရုပ်ပိုင်းဆိုင်ရာ ကွန်ပျူတာ Hardware (Servers, Storage, Routers) များ ဝယ်ယူတပ်ဆင်စရာမလိုဘဲ အင်တာနက် (Internet) မှတစ်ဆင့် **On-demand (လိုသလောက် ချက်ချင်း)** ရယူပြီး **Pay-as-you-go (အသုံးပြုသလောက်သာ ကျသင့်ငွေပေးချေရသော)** ပုံစံဖြင့် ငှားရမ်းသုံးစွဲသည့် နည်းပညာ ဖြစ်သည်။

### ၂။ On-Premise vs Cloud နှိုင်းယှဉ်ချက်
```
+------------------------------------+------------------------------------+
| On-Premises (ရိုးရိုး ရုံးတွင်း Server)  | Cloud Computing (AWS)              |
+------------------------------------+------------------------------------+
| - CapEx (Capital Expenditure) မြင့်မား| - OpEx (Operational Expenditure) သာရှိ|
|   (ဆာဗာများ ကြိုတင် ငွေရင်းစိုက်ဝယ်ရသည်) |   (သုံးသလောက်သာ လစဉ် ပေးရသည်)        |
| - Server ဝယ်ယူတပ်ဆင်ရန် လပေါင်းများစွာ ကြာ | - စက္ကန့်ပိုင်းအတွင်း Server ရာချီ ဖွင့်နိုင်|
| - Hardware ပျက်စီးမှု၊ မီးပျက်မှု ကိုယ်တိုင်| - AWS မှ ကမ္ဘာ့အဆင့် Data Center အားလုံး|
|   အကုန် တာဝန်ယူ ပြုပြင်ရသည်          |   တာဝန်ယူ စောင့်ရှောက်ပေးသည်         |
| - Capacity မှန်းဆရခက် (Over/Under) | - လိုအပ်သလို အတိုး/အလျှော့ ချက်ချင်းလုပ်နိုင်|
+------------------------------------+------------------------------------+
```

### ၃။ IaaS / PaaS / SaaS (Cloud ဝန်ဆောင်မှု ၃ မျိုး)
- **IaaS (Infrastructure as a Service):** အခြေခံ Infrastructure (Hardware, Storage, Network) ကို AWS က ပေးပြီး OS, Patching, Runtime နှင့် App ကို မိမိက စီမံရသည်။ *(ဥပမာ - Amazon EC2, Amazon VPC, Amazon EBS)*
- **PaaS (Platform as a Service):** OS နှင့် Hardware ကို AWS က စီမံပေးပြီး မိမိက Application Code သာ တင်ရသည်။ *(ဥပမာ - AWS Elastic Beanstalk, AWS Lambda)*
- **SaaS (Software as a Service):** အစအဆုံး ပြီးစီးပြီးဖြစ်သော Software ကို အင်တာနက်မှ တိုက်ရိုက် သုံးရုံသာဖြစ်သည်။ *(ဥပမာ - Google Workspace, Microsoft 365, Amazon QuickSight)*

### ၄။ အဓိက Cloud Architectural ဝေါဟာရများ (Core Concepts)
1. **Scalability (စနစ်ကို ချဲ့ထွင်နိုင်စွမ်း):**
   - *Vertical Scaling (Scale Up):* Server တစ်လုံးတည်း၏ CPU/RAM ကို ပိုကြီးအောင် တင်ခြင်း (ဥပမာ `t3.micro` မှ `m5.4xlarge`)။ ကန့်သတ်ချက် ရှိသည်။
   - *Horizontal Scaling (Scale Out):* Server အသစ်များ ဘေးတိုက် ထပ်မံ တိုးချဲ့ခြင်း (ဥပမာ Server ၁ လုံးမှ ၅ လုံး ဖြစ်လာခြင်း)။ Unlimited ချဲ့ထွင်နိုင်သည်။
2. **Elasticity (အလိုအလျောက် ကျုံ့နိုင်ကျယ်နိုင်စွမ်း):**
   - Traffic တက်လာလျှင် Server အလိုအလျောက် တိုးပေးပြီး Traffic ပြန်နည်းသွားပါက Server များကို အလိုအလျောက် ပြန်ဖျက်ပေးခြင်း (Auto Scaling)။
3. **Availability (စနစ်အမြဲ လည်ပတ်နေနိုင်စွမ်း):**
   - စနစ်တစ်ခုသည် သုံးစွဲသူများ လာရောက်အသုံးပြုချိန်တွင် အမြဲ အဆင်သင့် ရှိနေခြင်း (Uptime: 99.99%)။
4. **Reliability (စိတ်ချယုံကြည်ရမှု):**
   - သတ်မှတ်ထားသော အလုပ်တာဝန်ကို သတ်မှတ်ထားသော အချိန်အတွင်း အမှားအယွင်းမရှိ မှန်ကန်စွာ လုပ်ဆောင်ပေးနိုင်မှု။
5. **Fault Tolerance (အမှားဒဏ် ခံနိုင်ရည်ရှိခြင်း):**
   - Component တစ်ခု (ဥပမာ Server တစ်လုံး သို့မဟုတ် Data Center တစ်ခု) ပျက်ကျသွားသော်လည်း စနစ်တစ်ခုလုံး လုံးဝ ရပ်တန့်မသွားဘဲ ဆက်လက် အလုပ်လုပ်နိုင်စွမ်း။
6. **Disaster Recovery (ဘေးအန္တရာယ် ပြန်လည်ထူထောင်ရေး):**
   - ငလျင်လှုပ်ခြင်း၊ မီးလောင်ခြင်း သို့မဟုတ် ဒေသတစ်ခုလုံး မီးပျက်သွားခြင်း စသည့် သဘာဝဘေးများ ဖြစ်ပေါ်လာပါက အခြား ဒေသ (Region) သို့ စနစ်ကို ပြန်လည်ရွှေ့ပြောင်း ထူထောင်နိုင်မှု။
7. **Pay-as-you-go (သုံးသလောက်သာ ပေးချေခြင်း):**
   - အသုံးမပြုသောအချိန်တွင် ပိတ်ထားပါက ပိုက်ဆံမကုန်ပါ။ တစ်နာရီသုံးလျှင် တစ်နာရီဖိုး၊ တစ်စက္ကန့်သုံးလျှင် တစ်စက္ကန့်ဖိုးသာ ကျသင့်သည်။

---

## ၀.၂ Networking Basics (ကွန်ရက် အခြေခံသဘောတရားများ)

AWS VPC ကို နားလည်ရန် အောက်ပါ Networking သဘောတရားများသည် အဓိက သော့ချက် ဖြစ်သည်-

```
+-----------------------------------------------------------------------------------+
|                            BASIC NETWORK PACKET FLOW                              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [User Browser]                                                                   |
|         |                                                                         |
|         v                                                                         |
|  1. DNS (Domain Name System): "example.com" ကို 203.0.113.15 IP အဖြစ် ပြောင်းသည်    |
|         |                                                                         |
|         v                                                                         |
|  2. Public IP Address: အင်တာနက်ပေါ်မှ တိုက်ရိုက် ရှာဖွေဆက်သွယ်နိုင်သော IP           |
|         |                                                                         |
|         v                                                                         |
|  3. Load Balancer (ALB): Port 443 (HTTPS) ဖြင့် Traffic လက်ခံပြီး ဝေခြမ်းပေးသည်     |
|         |                                                                         |
|         v (Private Network)                                                       |
|  4. Private Subnet & Server: Internet နှင့် တိုက်ရိုက် မထိတွေ့သော အတွင်း Server    |
|         |                                                                         |
|         v                                                                         |
|  5. Database: Private Subnet ထဲရှိ Port 3306 (MySQL) တွင်သာ နားထောင်ထားသော DB     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အခြေခံ Networking ဝေါဟာရများ:
- **IP Address:** ကွန်ရက်ပေါ်ရှိ စက်ပစ္စည်းတစ်ခုချင်းစီကို ခွဲခြားပေးသော လိပ်စာ (ဥပမာ `192.168.1.10`)။
- **Public IP vs Private IP:**
  - *Public IP:* အင်တာနက်ပေါ်တွင် တစ်ကမ္ဘာလုံး တစ်ခုတည်းသာရှိပြီး အပြင်မှ တိုက်ရိုက် လှမ်းခေါ်နိုင်သော IP။
  - *Private IP:* ရုံးတွင်း သို့မဟုတ် VPC အတွင်းသာ သုံးပြီး အင်တာနက်မှ တိုက်ရိုက် ခေါ်မရသော IP (ဥပမာ `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)။
- **CIDR (Classless Inter-Domain Routing):** IP Range များကို သတ်မှတ်သော စနစ် (ဥပမာ `10.0.0.0/16` ဆိုသည်မှာ IP ပေါင်း 65,536 ခု၊ `10.0.1.0/24` ဆိုသည်မှာ IP ပေါင်း 256 ခု)။
- **Subnet:** ကြီးမားသော Network တစ်ခုကို သေးငယ်သော အပိုင်းအစများအဖြစ် ခွဲထုတ်ထားသော ကွန်ရက်ခွဲ။
- **Port:** Server တစ်ခုပေါ်တွင် မည်သည့် Application ဆီသို့ Data ပို့ရမည်ကို ခွဲခြားပေးသော နံပါတ်။
  - Port 80: HTTP (Web - Unencrypted)
  - Port 443: HTTPS (Web - Secure SSL/TLS)
  - Port 22: SSH (Linux Remote Login)
  - Port 3389: RDP (Windows Remote Desktop)
  - Port 3306: MySQL Database
  - Port 5432: PostgreSQL Database
  - Port 53: DNS
- **TCP vs UDP:**
  - *TCP (Transmission Control Protocol):* 3-way Handshake လုပ်ပြီး Data အစုံအလင် ရောက်မရောက် အာမခံသည် (Web, File transfer, Database)။
  - *UDP (User Datagram Protocol):* အလွန်မြန်သော်လည်း Packet ပျောက်ဆုံးမှုကို အာမမခံပါ (Live Video Streaming, VoIP, Online Gaming)။
- **NAT (Network Address Translation):** Private IP ရှိသော စက်များအား Public IP တစ်ခုတည်းကို မျှဝေသုံးစွဲစေပြီး အင်တာနက်သို့ ထွက်ခွာခွင့်ပေးသော နည်းပညာ။
- **Firewall (Security Group / NACL):** သတ်မှတ်ထားသော Port နှင့် IP များမှသာ Data အဝင်/အထွက်ကို စစ်ဆေးခွင့်ပြုသော လုံခြုံရေးတံတိုင်း။

---

## ၀.၃ Linux Basics for AWS Engineers (မဖြစ်မနေ တတ်ရမည့် Command များ)

AWS EC2 Server အများစုသည် Amazon Linux သို့မဟုတ် Ubuntu ဖြစ်သဖြင့် အောက်ပါ Command များကို နေ့စဉ် သုံးစွဲရပါမည်-

### ဖိုင်နှင့် ဖိုဒါများ စီမံခန့်ခွဲခြင်း (Files & Navigation)
- `pwd`: Print Working Directory (လက်ရှိ မိမိရောက်နေသော လမ်းကြောင်းကို ပြသည်)။
- `ls -lah`: ဖိုင်နှင့် ဖိုဒါများ၏ အသေးစိတ် အချက်အလက်၊ Hidden files များနှင့် File size များကို လူဖတ်ရလွယ်အောင် ပြသသည်။
- `cd /var/log`: သတ်မှတ်ထားသော လမ်းကြောင်းသို့ ပြောင်းရွှေ့ဝင်ရောက်သည်။
- `cp -r folder1/ folder2/`: ဖိုင် သို့မဟုတ် ဖိုဒါများကို ကူးယူ (Copy) သည်။
- `mv old_name.txt new_name.txt`: ဖိုင်အမည် ပြောင်းလဲခြင်း သို့မဟုတ် နေရာရွှေ့ခြင်း။
- `rm -rf test_dir/`: ဖိုင် သို့မဟုတ် ဖိုဒါတစ်ခုလုံးကို မေးမြန်းခြင်းမရှိဘဲ အပြီးတိုင် ဖျက်ပစ်သည် *(သတိပြုသုံးရန်)*။

### ဖိုင်အကြောင်းအရာ ကြည့်ရှုခြင်းနှင့် ရှာဖွေခြင်း (Viewing & Searching)
- `cat app.log`: ဖိုင်တစ်ခုလုံး၏ အကြောင်းအရာကို Terminal တွင် အကုန်ဖော်ပြသည်။
- `grep -i "error" /var/log/nginx/error.log`: Log ဖိုင်အတွင်းမှ "error" ဟူသော စကားလုံး ပါဝင်သည့် စာကြောင်းများကို ရှာဖွေထုတ်ပြသည်။
- `find /var/www -name "*.php"`: လမ်းကြောင်းတစ်ခုအတွင်း သတ်မှတ်ထားသော ဖိုင်အမည်များကို ရှာဖွေသည်။

### System Monitoring & Performance (စနစ်စောင့်ကြည့်ခြင်း)
- `top` သို့မဟုတ် `htop`: လက်ရှိ CPU, RAM နှင့် Process များ မည်မျှ သုံးစွဲနေသည်ကို Real-time ပြသသည်။
- `ps aux | grep node`: လက်ရှိ Run နေသော Background Process များကို ရှာဖွေစစ်ဆေးသည်။
- `df -h`: Disk Space (Hard Drive) မည်မျှ ကျန်ရှိသည်ကို Gigabytes (GB) ဖြင့် ပြသသည်။
- `du -sh /var/log/*`: မည်သည့် ဖိုဒါက Disk နေရာ မည်မျှ စားသုံးနေသည်ကို စစ်ဆေးသည်။

### Permissions & Security (လုပ်ပိုင်ခွင့်နှင့် လုံခြုံရေး)
- `chmod 400 my-key.pem`: AWS SSH Key Pair ကို အခြားသူများ မဖတ်နိုင်အောင် Read-only permission သတ်မှတ်သည်။
- `chmod 755 script.sh`: Script ကို Execute (Run) ခွင့် ပေးသည်။
- `chown -R nginx:nginx /var/www/html`: ဖိုဒါ၏ ပိုင်ရှင် User နှင့် Group ကို ပြောင်းလဲသည်။

### Service Control & Logs (Services & Remote Access)
- `systemctl status nginx`: Nginx Web Server ၏ လက်ရှိ အလုပ်လုပ်နေမှု အခြေအနေကို စစ်ဆေးသည်။
- `systemctl restart nginx`: Service ကို ပြန်လည် စတင်သည်။
- `systemctl enable nginx`: Server ပြန် Reboot တက်လာတိုင်း Service အလိုအလျောက် စတင်စေရန် သတ်မှတ်သည်။
- `journalctl -u nginx -n 50 --no-pager`: Nginx ၏ နောက်ဆုံး Log စာကြောင်း ၅၀ ကို ကြည့်ရှုသည်။
- `curl -I https://example.com`: Website တစ်ခု၏ HTTP Response Header (200 OK, 404, 502) ကို စစ်ဆေးသည်။
- `ssh -i my-key.pem ec2-user@<PUBLIC-IP>`: EC2 Linux Server ထဲသို့ Secure Shell ဖြင့် Remote Login ဝင်ရောက်သည်။

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [01_Phase1_AWS_Core_Concepts_and_Global_Infrastructure.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/01_Phase1_AWS_Core_Concepts_and_Global_Infrastructure.md)
