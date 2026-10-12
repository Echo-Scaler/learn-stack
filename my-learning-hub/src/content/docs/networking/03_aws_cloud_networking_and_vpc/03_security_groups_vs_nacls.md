---
title: Security Groups (Stateful) vs Network ACLs (Stateless)
description: Security Groups vs NACL နက်နဲစွာ ကွာခြားချက်နှင့် Public Subnet ထဲရှိရုံဖြင့် အင်တာနက်မှ တိုက်ရိုက်ဝင်မရသည့် အကြောင်းရင်း
---

## ၁။ Security Group (SG) vs Network ACL (NACL) နှိုင်းယှဉ်ချက်

| အင်္ဂါရပ် | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **အလုပ်လုပ်သည့်နေရာ** | **Instance Level** (EC2, ALB, RDS Virtual Firewall) | **Subnet Level** (Subnet နယ်နိမိတ် စောင့်ကြပ်သူ) |
| **State သဘာဝ** | **Stateful** (Inbound ခွင့်ပြုပါက Outbound အလိုအလျောက် ပွင့်သည်) | **Stateless** (Inbound နှင့် Outbound နှစ်ဖက်စလုံး သီးသန့် ဖွင့်ပေးရသည်) |
| **Rules ပုံစံ** | **ALLOW Rules သာ** ရေးသားနိုင်သည် | **ALLOW နှင့် DENY Rules နှစ်မျိုးစလုံး** ရေးသားနိုင်သည် |
| **Rule ဦးစားပေး** | Rules အားလုံးကို တစ်ပြိုင်နက် Evaluate လုပ်သည် | Rule အမှတ်စဉ် (100, 200) အလိုက် အစဉ်အတိုင်း စစ်ဆေးသည် |

---

## ၂။ အထူးနားလည်ရမည့်အချက်: Public Subnet ထဲရှိတာနဲ့ တိုက်ရိုက်ဝင်လို့ရတာ ဘာကြောင့် မတူသလဲ?

Subnet တစ်ခုသည် Public Subnet ဖြစ်နေရုံဖြင့် ထို Subnet ထဲရှိ EC2 သို့ အင်တာနက်မှ တိုက်ရိုက် မဝင်နိုင်ပါ။ အောက်ပါ ၄ ချက်စလုံး ပြည့်စုံရမည်:
1. EC2 Instance တွင် **Public IPv4 Address** ရှိရမည်။
2. VPC Route Table တွင် `0.0.0.0/0 -> IGW` ရှိရမည်။
3. Subnet NACL က Inbound Port ကို ခွင့်ပြုထားရမည်။
4. EC2 Security Group က သင်၏ IP မှ Inbound Traffic ကို ALLOW ပေးထားရမည်။
