---
title: "Phase 3 — VPC & Enterprise Networking"
description: "Architect Perspective: SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် VPC Architecture သည် အခရာကျဆုံး ဖြစ်သည်။ Network Isolation, Subnetting, Stateful/Statele"
---

## Phase 3 — VPC & Enterprise Networking

> **Architect Perspective:** SAA စာမေးပွဲနှင့် Production IT လုပ်ငန်းခွင်တွင် VPC Architecture သည် အခရာကျဆုံး ဖြစ်သည်။ Network Isolation, Subnetting, Stateful/Stateless Firewalls နှင့် Hybrid Connectivity များကို ရှင်းလင်းပြတ်သားစွာ ပိုင်နိုင်ရမည်။

---

## ၃.၁ Amazon VPC အခြေခံနှင့် Real Enterprise Architecture

Virtual Private Cloud (VPC) သည် AWS Cloud အတွင်း မိမိပိုင်ဆိုင်သော သီးသန့် အထီးကျန် ကွန်ရက် (Isolated Network) ဖြစ်သည်။

```
+-----------------------------------------------------------------------------------+
|                        PRODUCTION MULTI-AZ VPC ARCHITECTURE                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                     Internet                                      |
|                                        |                                          |
|                                 Internet Gateway                                  |
|                                        |                                          |
|                     +------------------+------------------+                       |
|                     |                                     |                       |
|              Public AZ-A (10.0.1.0/24)             Public AZ-B (10.0.2.0/24)      |
|              +-----------------------+             +-----------------------+      |
|              | Public ALB (Node 1)   |             | Public ALB (Node 2)   |      |
|              | NAT Gateway AZ-A      |             | NAT Gateway AZ-B      |      |
|              +-----------------------+             +-----------------------+      |
|                     |                                     |                       |
|                     +------------------+------------------+                       |
|                                        |                                          |
|                     +------------------+------------------+                       |
|                     |                                     |                       |
|              Private App AZ-A (10.0.11.0/24)       Private App AZ-B (10.0.12.0/24)|
|              +-----------------------+             +-----------------------+      |
|              | Backend EC2 App 1     |             | Backend EC2 App 2     |      |
|              | (Route to NAT-GW-A)   |             | (Route to NAT-GW-B)   |      |
|              +-----------------------+             +-----------------------+      |
|                     |                                     |                       |
|                     +------------------+------------------+                       |
|                                        |                                          |
|                     +------------------+------------------+                       |
|                     |                                     |                       |
|              Private DB AZ-A (10.0.21.0/24)        Private DB AZ-B (10.0.22.0/24) |
|              +-----------------------+             +-----------------------+      |
|              | Aurora / RDS Primary  |             | Aurora / RDS Standby  |      |
|              | (No Internet Route)   |             | (Synchronous Replica) |      |
|              +-----------------------+             +-----------------------+      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### အဓိက VPC Components များ:
1. **CIDR Block (ဥပမာ `10.0.0.0/16`):** VPC တစ်ခုလုံးအတွက် သတ်မှတ်သော IP Range (65,536 IPs)။
2. **Subnet:** Availability Zone တစ်ခုချင်းစီအတွင်း ခွဲထုတ်ထားသော IP Range (AWS က IP ၅ ခု ဖယ်ချန်ထားသည်)။
3. **Public Subnet:** Route Table တွင် Internet Gateway (IGW) သို့ လမ်းကြောင်းဖွင့်ထားသော Subnet (`0.0.0.0/0 -> igw-xxxx`)။
4. **Private Subnet:** Internet မှ တိုက်ရိုက် လှမ်းဝင်၍ မရသော Subnet။
5. **Route Table:** Subnet တစ်ခုချင်းစီမှ Packet များ မည်သည့်နေရာသို့ သွားရမည်ကို ညွှန်ပြသော လမ်းညွှန်စာရင်း။
6. **Internet Gateway (IGW):** VPC နှင့် Internet အကြား အပြန်အလှန် (Two-way) ချိတ်ဆက်ပေးသော Gateway။
7. **NAT Gateway:** Private Subnet ရှိ Server များ အင်တာနက်သို့ Outbound updates သွားယူနိုင်စေရန် Public Subnet တွင် ထားရှိရသော Managed Service (Elastic IP လိုအပ်သည်)။
8. **Elastic Network Interface (ENI):** Virtual Network Card ဖြစ်ပြီး Private IP, MAC address နှင့် Security Group များ တွဲဖက်ထားသည်။
9. **Elastic IP (EIP):** ပြောင်းလဲမှုမရှိသော Static Public IPv4 Address ဖြစ်သည်။

---

## ၃.၂ Security Group vs Network ACL (NACL) သီးသန့် နှိုင်းယှဉ်ချက်

ဒီနှစ်ခုကို စာမေးပွဲတွင်ရော လက်တွေ့တွင်ပါ လုံးဝ ရောထွေး၍ မရပါ-

```
+-----------------------------------------------------------------------------------+
|                        SECURITY GROUP VS NETWORK ACL (NACL)                       |
+-----------------------------------------------------------------------------------+
|  အချက်အလက်           |  Security Group                    |  Network ACL (NACL)   |
+----------------------+------------------------------------+-----------------------+
|  Level               |  Instance / ENI Level              |  Subnet Level         |
+----------------------+------------------------------------+-----------------------+
|  State သဘောသဘာဝ      |  **Stateful**                      |  **Stateless**        |
|                      |  (Inbound ခွင့်ပြုပါက Outbound ကို   |  (Inbound ရော Outbound|
|                      |  အလိုအလျောက် ပြန်ခွင့်ပြုသည်)       |  ပါ သီးခြား ရေးပေးရသည်)|
+----------------------+------------------------------------+-----------------------+
|  Rules အမျိုးအစား     |  **Allow Rules သာ** ရေးနိုင်သည်    |  **Allow ရော Deny ပါ**|
|                      |  (Deny ရေး၍ မရပါ)                  |  ရေးနိုင်သည်          |
+----------------------+------------------------------------+-----------------------+
|  Rule Evaluation     |  Rule အားလုံးကို တပြိုင်နက် စစ်ဆေးသည်|  Rule Number အစဉ်လိုက်|
|                      |                                    |  (အငယ်မှ အကြီးသို့)   |
+----------------------+------------------------------------+-----------------------+
|  အသုံးချမှု           |  App, DB Server Port ဖွင့်ခြင်း     |  Malicious IP တစ်ခုကို|
|                      |                                    |  Block ပိတ်ဆို့ခြင်း   |
+----------------------+------------------------------------+-----------------------+
```

---

## ၃.၃ VPC Connectivity Options (ချိတ်ဆက်မှု နည်းလမ်းများ)

```
+-----------------------------------------------------------------------------------+
|                               VPC CONNECTIVITY MATRIX                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. VPC Peering: VPC (၂) ခု တိုက်ရိုက်ချိတ်ဆက်ခြင်း (1-to-1)                       |
|     - Transitive Routing မရပါ (VPC A -> B -> C ဖြစ်လျှင် A မှ C သို့ မရောက်ပါ)       |
|     - CIDR IP Blocks များ ထပ်တူ မကျရပါ (No overlapping CIDRs)                     |
|                                                                                   |
|  2. AWS Transit Gateway (TGW): Enterprise Hub-and-Spoke Router                    |
|     - ထောင်ပေါင်းများစွာသော VPC များနှင့် On-Premises Network များကို ဗဟိုမှ ချိတ်ဆက်|
|     - Transitive Routing ကို အပြည့်အဝ ပံ့ပိုးသည်                                   |
|                                                                                   |
|  3. VPC Endpoints (Gateway vs Interface PrivateLink):                             |
|     - Gateway Endpoint: **Amazon S3** နှင့် **Amazon DynamoDB** အတွက်သာ (အခမဲ့!)  |
|     - Interface Endpoint (PrivateLink): SQS, SNS, KMS, Secrets Manager နှင့်        |
|       အခြား Service များအတွက် ENI သုံး၍ Private IP ဖြင့် ချိတ်ခြင်း (စရိတ်ရှိသည်)   |
|                                                                                   |
|  4. AWS Site-to-Site VPN: Public Internet ပေါ်မှ IPsec VPN Tunnel (1.25 Gbps)      |
|                                                                                   |
|  5. AWS Direct Connect (DX): On-Premises မှ AWS သို့ သီးသန့်ရုပ်ပိုင်းဆိုင်ရာ Fiber  |
|     Dedicated Cable တိုက်ရိုက် ချိတ်ဆက်ခြင်း (High Throughput 1-100 Gbps, No Internet)|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---
*နောက်အခန်းသို့ ဆက်လက်လေ့လာရန်:* [04_Phase4_Compute_EC2_Storage_AutoScaling.md](file:///Users/kyawwaiyan/Documents/my-Home-tech/AWS-Most-Used-Feature/aws_saa_solutions_architect_real_work/04_Phase4_Compute_EC2_Storage_AutoScaling.md)
