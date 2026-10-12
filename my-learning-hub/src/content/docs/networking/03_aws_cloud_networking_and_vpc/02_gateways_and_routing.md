---
title: Internet Gateway (IGW), NAT Gateway & Route Tables
description: Internet Gateway (IGW), NAT Gateway, Route Tables Configuration နှင့် Elastic IP (EIP)
---

## ၁။ Internet Gateway (IGW) vs NAT Gateway

- **Internet Gateway (IGW):** နှစ်ဖက်စလုံး (Inbound & Outbound) သွားလာနိုင်ပြီး Serverless ဖြစ်သည်။ Public Subnet အတွက် သုံးသည်။
- **NAT Gateway:** Private Subnet ထဲရှိ Server များ Outbound သာ သွားနိုင်ပြီး အပြင်မှ တိုက်ရိုက် ဝင်မရအောင် ကာကွယ်ပေးသည်။ Public Subnet ထဲတွင် ထားရှိရသည်။

---

## ၂။ Route Tables Configuration

```
[ Public Subnet Route Table ]
Destination        Target
10.0.0.0/16        local
0.0.0.0/0          igw-0123456789abcdef0 (Internet Gateway)

[ Private Subnet Route Table ]
Destination        Target
10.0.0.0/16        local
0.0.0.0/0          nat-0123456789abcdef0 (NAT Gateway)
```

---

## ၃။ Elastic IP (EIP)

ပြောင်းလဲခြင်းမရှိသော Static Public IPv4 Address ဖြစ်ပြီး NAT Gateway များတွင် ချိတ်တွဲရန် မဖြစ်မနေ လိုအပ်သည်။
