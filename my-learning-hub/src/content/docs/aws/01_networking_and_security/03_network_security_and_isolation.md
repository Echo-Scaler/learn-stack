---
title: "အခန်း (၃) — Network လုံခြုံရေးနှင့် သီးခြားခွဲထုတ်ခြင်း (NAT, Firewall, Security Group, Public Access)"
description: "Cloud Security တွင် Network အဆင့် လုံခြုံရေးသည် ပထမဆုံးသော ကာကွယ်ရေးတံတိုင်း (First Line of Defense) ဖြစ်ပါသည်။ ဤအခန်းတွင် NAT, Firewall, Security Group နှင့် P"
---

## အခန်း (၃) — Network လုံခြုံရေးနှင့် သီးခြားခွဲထုတ်ခြင်း (NAT, Firewall, Security Group, Public Access)

Cloud Security တွင် Network အဆင့် လုံခြုံရေးသည် ပထမဆုံးသော ကာကွယ်ရေးတံတိုင်း (First Line of Defense) ဖြစ်ပါသည်။ ဤအခန်းတွင် **NAT, Firewall, Security Group** နှင့် **Public Access ထိန်းချုပ်မှု** တို့၏ အရေးပါပုံနှင့် AWS လက်တွေ့ ဒီဇိုင်းများကို ရှင်းပြထားပါသည်။

---

## ၁။ NAT (Network Address Translation)

### (က) ဒါကဘာလဲ? (What is it?)
- **NAT** ဆိုသည်မှာ Private Subnet အတွင်းရှိ စက်များ၏ Private IP များကို Public IP တစ်ခုအဖြစ် ပြောင်းလဲပေးပြီး အင်တာနက်သို့ ထွက်ခွာနိုင်စေရန် လုပ်ဆောင်ပေးသော နည်းပညာဖြစ်ပါသည်။
- အိမ်သုံး Wi-Fi Router များသည်လည်း ဖုန်းနှင့် Laptop များ၏ Private IP များကို ISP ပေးထားသော Public IP တစ်ခုတည်းအဖြစ် NAT ပြုလုပ်ပေးသကဲ့သို့ ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် သုံးတာလဲ? (Why use it?)
- Backend Database များ၊ App Server များကို Hacker များ တိုက်ရိုက် မဝင်ရောက်နိုင်စေရန် **Private Subnet** ထဲတွင် ထားရှိရပါသည်။
- သို့သော် ထို Private စက်များသည် Linux OS Security Updates များ၊ Docker Image များ သို့မဟုတ် Third-party API (ဥပမာ Stripe Payment API) များကို အင်တာနက်မှတစ်ဆင့် လှမ်းခေါ်ရန် (Outbound) လိုအပ်ပါသည်။
- NAT ကို အသုံးပြုခြင်းဖြင့် **အတွင်းမှ အပြင်သို့ အင်တာနက်ထွက်ခွင့်ပေးပြီး၊ ပြင်ပမှ အတွင်းသို့ တိုက်ရိုက်ဝင်ရောက်ခြင်းကို ၁၀၀% ပိတ်ပင်** ကာကွယ်ပေးနိုင်ပါသည်။

```
[ အင်တာနက် ပြင်ပလောက (Internet) ]
                 ▲ (Outbound Only)
                 │ (Inbound တိုက်ရိုက်ဝင်၍ မရပါ)
         [ NAT Gateway ] (Public Subnet ပေါ်တွင် Elastic IP ဖြင့် တပ်ဆင်ထားသည်)
                 ▲
                 │ (Private IP: 10.0.2.100)
    [ Backend App / Database EC2 ] (Private Subnet - လုံခြုံသည်)
```

### (ဂ) AWS တွင် အသုံးပြုပုံ
- AWS တွင် စီမံခန့်ခွဲမှုကင်းသော **AWS Managed NAT Gateway** ကို Public Subnet တွင် ဆောက်လုပ်ပြီး Elastic IP (EIP) တစ်ခု ချိတ်ဆက်ပေးရပါသည်။
- ထို့နောက် Private Subnet ၏ Route Table တွင် `0.0.0.0/0` ကို NAT Gateway ID (`nat-xxxxxx`) သို့ ညွှန်ပေးရပါသည်။

---

## ၂။ Firewall (မီးတံတိုင်း လုံခြုံရေးစနစ်)

### (က) ဒါကဘာလဲ? (What is it?)
- **Firewall** ဆိုသည်မှာ ကြိုတင်သတ်မှတ်ထားသော လုံခြုံရေး စည်းမျဉ်းများ (Security Rules) ပေါ် အခြေခံ၍ ဝင်လာသော (Inbound) နှင့် ထွက်သွားသော (Outbound) ကွန်ရက် Traffic များကို စစ်ဆေးကာ ခွင့်ပြုခြင်း (Allow) သို့မဟုတ် ပိတ်ပင်ခြင်း (Deny/Drop) ပြုလုပ်ပေးသည့် အကာအကွယ် စနစ်ဖြစ်ပါသည်။

### (ခ) Firewall အမျိုးအစား နှစ်မျိုး (Stateful vs Stateless)
1. **Stateful Firewall (ဥပမာ AWS Security Group):**
   - ဆက်သွယ်မှု အခြေအနေ (State) ကို မှတ်မိနေသော Firewall ဖြစ်သည်။
   - အကယ်၍ Inbound (အဝင်) ကို ခွင့်ပြုလိုက်ပါက ထိုတောင်းဆိုမှုအတွက် အထွက် Traffic (Outbound Response) သည် စည်းမျဉ်းသီးသန့် ရေးစရာမလိုဘဲ အလိုအလျောက် ပြန်လည် ထွက်ခွာခွင့် ရရှိပါသည်။
2. **Stateless Firewall (ဥပမာ AWS Network ACL - NACL):**
   - State ကို မမှတ်မိပါ။ Packet တစ်ခုချင်းစီကို သီးခြား စစ်ဆေးပါသည်။
   - အဝင် (Inbound Rule) တွင် ခွင့်ပြုရုံသာမက အထွက် (Outbound Rule - Ephemeral Ports 1024-65535) တွင်လည်း သီးသန့် Allow လုပ်ပေးရပါသည်။

---

## ၃။ Security Group (AWS Virtual Firewall)

### (က) ဒါကဘာလဲ? (What is it?)
- **Security Group (SG)** ဆိုသည်မှာ AWS EC2 Instance, ECS Task, RDS Database, ALB စသည့် Cloud Resource တစ်ခုချင်းစီ၏ ပတ်လည်တွင် တပ်ဆင်ထားသော **Stateful Virtual Firewall** ဖြစ်ပါသည်။
- Default အနေဖြင့်:
  - **Inbound Rules:** အဝင်အားလုံးကို အလိုအလျောက် ပိတ်ထားပါသည် (Default Deny All)။ မိမိ ခွင့်ပြုလိုသော Port နှင့် IP ကိုသာ ဖွင့်ပေးရပါမည် (Whitelist Approach)။
  - **Outbound Rules:** အထွက်အားလုံးကို အလိုအလျောက် ခွင့်ပြုထားပါသည် (Allow All Outbound)။

### (ခ) Security Group အချင်းချင်း ညွှန်းဆိုသော စနစ် (Chained Security Groups)
Production Architecture တွင် အလုံခြုံဆုံး နည်းလမ်းမှာ IP Address အစား **အခြား Security Group ၏ ID ကို Source အဖြစ် ထည့်သွင်းခြင်း** ဖြစ်ပါသည်:

```
[ Internet ]
     │ (HTTPS Port 443 ဖွင့်: Source 0.0.0.0/0)
[ ALB ] (Security Group: sg-alb)
     │
     │ (HTTP Port 80 ဖွင့်: Source = sg-alb သာ ခွင့်ပြုသည်)
[ Backend App EC2 ] (Security Group: sg-app)
     │
     │ (MySQL Port 3306 ဖွင့်: Source = sg-app သာ ခွင့်ပြုသည်)
[ Aurora MySQL DB ] (Security Group: sg-db)
```
*အကျိုးကျေးဇူး:* Database သည် App Server မှလွဲ၍ ALB သို့မဟုတ် မည်သည့်စက်မှမဆို လုံးဝ ချိတ်ဆက်၍ မရနိုင်တော့သဖြင့် လုံခြုံရေး အမြင့်မားဆုံး ဖြစ်သွားပါသည်။

---

## ၄။ Public Access (အများသုံး ဝင်ရောက်ခွင့် ထိန်းချုပ်ခြင်း)

### (က) Public Access ၏ အန္တရာယ်
- Cloud ပေါ်တွင် Data ပေါက်ကြားမှု (Data Breach) အများစုသည် Server ကို Hack လုပ်ခံရခြင်းထက် **S3 Bucket သို့မဟုတ် Database ကို Public Internet သို့ မှားယွင်းဖွင့်ထားမိခြင်း (Misconfigured Public Access)** ကြောင့် ဖြစ်လေ့ရှိပါသည်။
- စက်တစ်ခု သို့မဟုတ် Data Storage တစ်ခုသည် Public ဖြစ်သွားပါက ကမ္ဘာတစ်ဝှမ်းရှိ Hacker Bot များ၏ 24/7 Scan ဖတ်ခြင်းနှင့် တိုက်ခိုက်ခြင်းကို ခံရမည်ဖြစ်ပါသည်။

### (ခ) AWS တွင် Public Access ကာကွယ်နည်း အကောင်းဆုံး အလေ့အကျင့်များ

```
             [ ကာကွယ်ရေး အလွှာ ၃ ခု ]
             
1. S3 Block Public Access (Account-Level & Bucket-Level)
   -> အမှားယွင်းဖြင့် Public ဖြစ်သွားခြင်းကို မူလကတည်းက ပိတ်ပင်ထားခြင်း။

2. Subnet Isolation (Public vs Private Subnet)
   -> Database နှင့် Business Logic စက်များကို Private Subnet တွင်သာ ထားရှိခြင်း။

3. Bastion Host အစား AWS Systems Manager (SSM) သုံးခြင်း
   -> EC2 စက်များတွင် Public IP မပေးဘဲ၊ Port 22 SSH မဖွင့်ဘဲ AWS Console မှ တိုက်ရိုက် Login ဝင်ခြင်း။
```

| Resource | Public Access အခြေအနေ | အကြံပြုထားသော အလေ့အကျင့် |
| :--- | :--- | :--- |
| **Application Load Balancer** | **Public** (ဖွင့်ရန် လိုအပ်သည်) | Port 80/443 သာဖွင့်ပြီး AWS WAF ဖြင့် ကာကွယ်ရမည်။ |
| **App Server / ECS Fargate** | **Private** (ပိတ်ရမည်) | Private Subnet တွင် ထားပြီး ALB ကသာ Forward လုပ်ရမည်။ |
| **RDS / Aurora Database** | **Private** (လုံးဝ ပိတ်ရမည်) | `Publicly Accessible: No` သတ်မှတ်ပြီး Private Subnet တွင် ထားရမည်။ |
| **S3 Storage Bucket** | **Private** (ပိတ်ရမည်) | `Block Public Access: ON` ထားပြီး CloudFront OAC သို့မဟုတ် Presigned URL ဖြင့်သာ ဖွင့်ရမည်။ |
