---
title: "၁။ Amazon EC2 ဆိုတာဘာလဲ & Architecture"
description: "Amazon EC2 ၏ အခြေခံသဘောတရား၊ IaaS Model၊ အသုံးပြုရသည့် အကြောင်းအရင်း၊ Nitro System Architecture နှင့် Request Flow အဆင့်ဆင့် ရှင်းလင်းချက်"
---

# ၁။ Amazon EC2 ဆိုတာဘာလဲ & Architecture

## Amazon EC2 (Elastic Compute Cloud) ဆိုတာဘာလဲ?

**Amazon EC2** ဆိုသည်မှာ AWS Cloud ပေါ်တွင် စက္ကန့်ပိုင်းအတွင်း အလွယ်တကူ ငှားရမ်းအသုံးပြုနိုင်သော **Virtual Computing Servers (Virtual Machines - VMs)** ဖြစ်ပါသည်။

- **Elastic:** လိုအပ်သလို CPU, Memory, Disk Space များကို တိုးချဲ့ခြင်း (Scale Up/Out) သို့မဟုတ် လျှော့ချခြင်း (Scale Down/In) ချက်ချင်း ပြုလုပ်နိုင်သောကြောင့် "Elastic" ဟု ခေါ်ဆိုခြင်း ဖြစ်ပါသည်။
- **Compute:** Application များ၊ Database များနှင့် Logic များကို တွက်ချက် run ပေးသည့် Computer CPU & RAM စွမ်းအားကို ဆိုလိုပါသည်။
- **Cloud:** ကွန်ပျူတာ ဟာ့ဒ်ဝဲများကို မိမိကိုယ်တိုင် ဝယ်ယူတပ်ဆင်စရာမလိုဘဲ AWS ၏ ကမ္ဘာအနှံ့ရှိ Data Centers များမှတစ်ဆင့် အင်တာနက်ဖြင့် အသုံးပြုနိုင်ခြင်း ဖြစ်ပါသည်။

Cloud Computing Service Models တွင် EC2 သည် **Infrastructure as a Service (IaaS)** အမျိုးအစား ဖြစ်ပါသည်။ ဆိုလိုသည်မှာ Operating System (Ubuntu, Amazon Linux, Windows Server) မှစတင်၍ Root/Administrator access အပြည့်အဝရရှိပြီး မည်သည့် Software ကိုမဆို စိတ်ကြိုက် တပ်ဆင်ခွင့် ရရှိပါသည်။

---

## EC2 ကို အဘယ်ကြောင့် အသုံးပြုသင့်သနည်း? (Real-World Use Cases)

အကယ်၍ On-Premises Physical Data Center တစ်ခု တည်ဆောက်မည်ဆိုပါက Server ဝယ်ယူခြင်း၊ လျှပ်စစ်မီး၊ အအေးပေးစနစ်၊ Network ကြိုးသွယ်တန်းခြင်း စသည်တို့အတွက် သီတင်းပတ်ပေါင်းများစွာ အချိန်နှင့် ငွေကြေး ကုန်ကျမည် ဖြစ်သည်။ EC2 တွင်မူ ကလစ်အနည်းငယ် နှိပ်ရုံဖြင့် မိနစ်ပိုင်းအတွင်း Server အဆင်သင့် ဖြစ်လာပါသည်။

### လက်တွေ့ လုပ်ငန်းခွင် Use Cases များ:
1. **Web & Mobile Backend Hosting:**  
   Laravel, Node.js, Django, Java Spring Boot စသည့် Web APIs များနှင့် Website များကို စိတ်ကြိုက် Runtime တပ်ဆင်၍ လွှင့်တင်ခြင်း။
2. **Relational & NoSQL Database Servers:**  
   AWS RDS ကို အသုံးမပြုဘဲ PostgreSQL, MySQL, MongoDB သို့မဟုတ် Redis များကို OS Level Tuning စိတ်ကြိုက် ပြုလုပ်လိုသည့်အခါ EC2 ပေါ်တွင် ကိုယ်တိုင် Host လုပ်ခြင်း။
3. **Enterprise & Legacy System Migration:**  
   လုပ်ငန်းခွင်ရှိ ရုံးတွင်း Server (On-Premises VM) များတွင် run နေသော သမားရိုးကျ ERP, Accounting Software (Windows/Linux) များကို Cloud သို့ 'Lift-and-Shift' ပြောင်းရွှေ့ခြင်း။
4. **Batch Processing & Big Data Computation:**  
   ဗီဒီယို ဖိုင်များ Render လုပ်ခြင်း၊ Data Analysis တွက်ချက်ခြင်းနှင့် AI/ML Model Training များအတွက် GPU Instance များကို လိုအပ်သည့် နာရီအနည်းငယ်သာ ယာယီ ငှားရမ်းအသုံးပြုခြင်း။

---

## EC2 Internal Architecture & AWS Nitro System

EC2 Virtual Machine များသည် AWS ၏ Physical Host Server ကြီးများပေါ်တွင် မည်သို့ အလုပ်လုပ်သနည်း?

```
┌─────────────────────────────────────────────────────────────┐
│                   Physical Host Hardware                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Host CPU & Memory                  │  │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────┐  │  │
│  │  │  EC2 Instance A │ │  EC2 Instance B │ │ ...     │  │  │
│  │  │ (Amazon Linux)  │ │    (Ubuntu)     │ │         │  │  │
│  │  └─────────────────┘ └─────────────────┘ └─────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             AWS Nitro Hypervisor (Lightweight)        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Dedicated Nitro Cards                  │  │
│  │   [Nitro VPC Card]  [Nitro EBS Card]  [Security Card] │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Traditional Hypervisor vs AWS Nitro System:
- **သမားရိုးကျ Virtualization:** Hypervisor Software က CPU, Storage, Network အားလုံးကို software ဖြင့် စီမံခန့်ခွဲသဖြင့် Host CPU ၏ 15% မှ 30% ခန့် အလဟဿ ဆုံးရှုံးသည်။
- **AWS Nitro System (ခေတ်သစ် EC2 အားလုံး၏ အခြေခံ):**  
  Network, Storage (EBS) နှင့် Security encryption လုပ်ဆောင်ချက်များကို သီးသန့် Hardware ကတ်ပြားများ (**Nitro Cards**) သို့ လွှဲပြောင်းပေးလိုက်သည်။ ထို့ကြောင့် Physical Host ၏ CPU နှင့် Memory 100% နီးပါးကို User ၏ EC2 Instances များက အပြည့်အဝ အသုံးပြုနိုင်ပြီး အမြန်ဆုံး Performance နှင့် သီးခြားခွဲထုတ်ထားသော လုံခြုံရေး (Hardware-level Isolation) ကို ရရှိစေသည်။

---

## Request Flow: အင်တာနက် အသုံးပြုသူထံမှ EC2 Application သို့ ရောက်ရှိပုံ

အသုံးပြုသူတစ်ဦးက Browser တွင် `https://myapi.example.com` ဟု ရိုက်ထည့်လိုက်သည့်အခါ EC2 ပေါ်ရှိ Application သို့ ရောက်ရှိရန် အောက်ပါ အဆင့် ၈ ဆင့်အတိုင်း ဖြတ်သန်းရပါသည်:

```
[ User Browser ]
       │
       ▼ (1. DNS Resolution)
[ Amazon Route 53 ] ──► Returns EC2 Public IP / ALB DNS
       │
       ▼ (2. Internet Traffic)
[ AWS Internet Gateway (IGW) ]
       │
       ▼ (3. Subnet Routing Table)
[ Public Route Table (0.0.0.0/0 -> IGW) ]
       │
       ▼ (4. Subnet Boundary - Stateless Filter)
[ Network ACL (NACL) - Inbound Rules Allowed ]
       │
       ▼ (5. Instance Boundary - Stateful Firewall)
[ Security Group (SG) - Allow Port 80 / 443 ]
       │
       ▼ (6. Virtual Network Card)
[ Elastic Network Interface (ENI) ]
       │
       ▼ (7. Operating System Kernel & Network Stack)
[ Linux Kernel (TCP Handshake -> Socket) ]
       │
       ▼ (8. Application Process)
[ Nginx Reverse Proxy / PHP-FPM / Laravel API ]
```

### အဆင့်တစ်ခုချင်းစီ၏ အခန်းကဏ္ဍ:
1. **Route 53:** Domain Name ကို အများပြည်သူသုံး Public IP Address သို့ ပြောင်းလဲပေးသည်။
2. **Internet Gateway (IGW):** AWS VPC နှင့် အင်တာနက်ပြင်ပကမ္ဘာကို ချိတ်ဆက်ပေးသော တံခါးပေါက်။
3. **Route Table:** Packet များ မည်သည့် Subnet သို့ သွားရမည်ကို လမ်းညွှန်ပေးသည့် လမ်းပြမြေပုံ။
4. **Network ACL (NACL):** Subnet အဆင့်တွင် စစ်ဆေးသည့် Stateless firewall (Inbound နှင့် Outbound နှစ်ခုစလုံးကို စစ်ဆေးသည်)။
5. **Security Group:** EC2 Instance အဆင့်တွင် စစ်ဆေးသည့် Stateful virtual firewall (ခွင့်ပြုထားသော Port များကိုသာ ဖြတ်ခွင့်ပေးသည်)။
6. **ENI (Elastic Network Interface):** EC2 Instance ၏ Virtual Network Card ဖြစ်ပြီး IP Address ကို သယ်ဆောင်ထားသည်။
7. **OS Network Stack & Web Server:** Linux OS မှ Port 80/443 ကို နားထောင်နေသော Nginx/Apache ထံ Packet အချက်အလက်များကို ပေးပို့ပြီး HTTP Response ပြန်လည် ထုတ်ပေးသည်။
