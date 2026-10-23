---
title: "၃။ Networking, VPC CNI & Security"
description: "Amazon VPC CNI၊ Pod IPs၊ Cluster Endpoint Access (Public vs Private)၊ EKS Access Entries၊ RBAC နှင့် IRSA / Pod Identity"
---

# ၃။ Networking, VPC CNI & Security

## Amazon VPC CNI Plugin (aws-node)

သမားရိုးကျ Kubernetes (Flannel သို့မဟုတ် Calico) တွင် Pod များသည် သီးခြား Virtual Overlay Network IP ကိုသာ ရရှိကြသဖြင့် AWS Services များနှင့် ဆက်သွယ်ရာတွင် NAT ပြုလုပ်ရပြီး နှေးကွေးရှုပ်ထွေးတတ်သည်။

**Amazon EKS တွင်မူ:** **Amazon VPC CNI Plugin** ကို အသုံးပြုထားသဖြင့်:
- **Pod တစ်ခုချင်းစီတိုင်းသည် သင်၏ AWS VPC Private Subnet ထဲမှ စစ်မှန်သော Private IP Address တစ်ခုစီကို တိုက်ရိုက် ရရှိပါသည်!**
- ထို့ကြောင့် Pod များသည် VPC အတွင်းရှိ EC2, RDS, ElastiCache များနှင့် တိုက်ရိုက် Native VPC Speed ဖြင့် အမြန်ဆုံး ဆက်သွယ်နိုင်ပါသည်။

```
┌─────────────────────────────────────────────────────────┐
│              Worker Node (EC2: 10.0.1.10)               │
│                                                         │
│  [ Primary ENI: eth0 ] ──► Node IP: 10.0.1.10           │
│  [ Secondary ENI: eth1 ]                                │
│       ├── IP 1: 10.0.1.11 ──► [ Pod 1: Laravel API ]    │
│       ├── IP 2: 10.0.1.12 ──► [ Pod 2: Redis Worker ]   │
│       └── IP 3: 10.0.1.13 ──► [ Pod 3: Nginx Proxy ]    │
└─────────────────────────────────────────────────────────┘
```

> **သတိပြုရန် (IP Exhaustion Trap):**  
> Pod တိုင်းက VPC IP စားသုံးသဖြင့် Subnet CIDR သေးငယ်ပါက (ဥပမာ- `/24` တွင် IP ၂၅၁ ခုသာရှိသည်) Pod အသစ်များ တည်ဆောက်မရဘဲ Error တက်နိုင်ပါသည်။ ထို့ကြောင့် EKS အတွက် Subnet များကို အနည်းဆုံး `/20` သို့မဟုတ် `/19` ထားရှိရပါမည်။

---

## EKS Cluster Endpoint Access (၃ မျိုး)

1. **Public Only:** အင်တာနက်ပေါ်ရှိ မည်သည့်နေရာမှမဆို `kubectl` ဖြင့် လှမ်းခေါ်နိုင်သည်။ (IAM authentication စစ်ဆေးဆဲ ဖြစ်သော်လည်း အန္တရာယ်ရှိသည်)။
2. **Public and Private (Recommended):** `kubectl` အသုံးပြုသူများသည် အင်တာနက်မှ ခေါ်နိုင်သော်လည်း Worker Nodes များနှင့် Control Plane ကြား ဆက်သွယ်မှုသည် Private VPC အတွင်း၌သာ သီးသန့် ဖြတ်သန်းသည်။
3. **Private Only (Highest Security):** အင်တာနက်မှ လုံးဝ ဝင်ရောက်၍မရဘဲ VPC အတွင်းရှိ Bastion Host သို့မဟုတ် VPN / AWS Direct Connect မှသာ Cluster ကို စီမံနိုင်သည်။

---

## IAM Roles for Service Accounts (IRSA) vs EKS Pod Identity

Pod တစ်ခုက S3 သို့ ဓာတ်ပုံ upload လုပ်လိုပါက Worker Node တစ်ခုလုံးအား S3 Full Access ပေးစရာ မလိုဘဲ **Least Privilege** စည်းမျဉ်းအတိုင်း သီးခြား Pod ကိုသာ ခွင့်ပြုရန် နည်းလမ်း ၂ မျိုး ရှိသည်:

### ၁။ IRSA (IAM Roles for Service Accounts - OIDC Based):
- AWS IAM OIDC Provider ကို အသုံးပြု၍ Kubernetes ServiceAccount တစ်ခုစီထံသို့ IAM Role ကို ချိတ်ဆက်ပေးသည်။
- Pod အသစ် စတင်လာသည်နှင့် AWS STS က ယာယီ Token ကို Pod အတွင်း အလိုအလျောက် Inject လုပ်ပေးသည်။

### ၂။ EKS Pod Identity (AWS ၏ ခေတ်သစ် အလွယ်ဆုံး စနစ်):
- OIDC Setup ရှုပ်ထွေးမှုများ မလိုတော့ဘဲ EKS Console သို့မဟုတ် CLI မှတစ်ဆင့် Cluster Name, Namespace, ServiceAccount အမည်ကို ရွေးချယ်ပြီး IAM Role နှင့် တိုက်ရိုက် တွဲဖက်ပေးရုံဖြင့် အလုပ်လုပ်သည်။

---

## Security Groups for Pods

ယခင်က Security Group ကို EC2 Worker Node အဆင့်တွင်သာ သတ်မှတ်နိုင်သော်လည်း ယခုအခါ **Pod တစ်ခုချင်းစီအလိုက် သီးသန့် AWS Security Group** တပ်ဆင်နိုင်ပါပြီ:
- ဥပမာ- `payment-pod` သည်သာ RDS Database Port 5432 သို့ သွားခွင့်ရှိပြီး၊ အခြား `frontend-pod` များသည် Database သို့ တိုက်ရိုက် မသွားနိုင်အောင် သီးခြား ပိတ်ပင်ထားနိုင်သည်။
