---
title: "၃။ Security, Mount Targets & SAA-C03 Quiz"
description: "EFS Security Groups (Port 2049)၊ EFS Access Points၊ EFS vs EBS vs FSx နှိုင်းယှဉ်ချက်နှင့် SAA-C03 Exam Traps & Quiz"
---

# ၃။ Security, Mount Targets & SAA-C03 Quiz

## 🛡️ EFS Security Architecture & Port 2049

EFS ကို လုံခြုံစွာ Mount လုပ်နိုင်ရန် Network Level နှင့် Identity Level နှစ်ခုစလုံးတွင် အောက်ပါအတိုင်း သတ်မှတ်ရပါသည်-

```
[ EC2 Security Group ]
  (Outbound: Port 2049 Allow to EFS SG)
            │
            ▼ (TCP Port 2049 - NFS Protocol)
[ Mount Target Security Group ]
  (Inbound: Allow Port 2049 from EC2 Security Group)
            │
            ▼
[ EFS Access Point (POSIX UID/GID Enforcement) ]
            │
            ▼
[ Encrypted EFS File System (KMS at rest & TLS in transit) ]
```

### 1. Security Group Configuration (SAA-C03 Frequent Question)
- EFS Mount Target ၏ Security Group တွင် **Inbound Rule အဖြစ် NFS (TCP Port 2049)** ကို ဖွင့်ပေးရမည်။
- Source အဖြစ် IP Address အစား **EC2 Instance များ သုံးစွဲထားသော Security Group ID (sg-xxxx)** ကို ညွှန်းဆိုပေးခြင်းသည် အလုံခြုံဆုံး Best Practice ဖြစ်ပါသည်။

### 2. EFS Access Points
- Shared File System အတွင်း Application တစ်ခုစီအတွက် Root Directory ကို သီးခြားကန့်သတ်ပေးခြင်း (Directory restriction)။
- Client မှ မည်သည့် User အဖြစ် လာရောက်သည်ဖြစ်စေ သတ်မှတ်ထားသော POSIX User ID (UID) နှင့် Group ID (GID) သို့ အလိုအလျောက် Mapping လုပ်ပေးခြင်းဖြင့် File Permission လုံခြုံရေးကို ထိန်းသိမ်းပေးသည်။

---

## 🆚 EFS vs EBS vs Amazon FSx vs S3 — Master Comparison

| Feature | Amazon EFS | Amazon EBS | Amazon FSx for Windows | Amazon S3 |
| :--- | :--- | :--- | :--- | :--- |
| **Protocol** | NFSv4.1 / NFSv4.0 | Block Device (NVMe) | SMB Protocol | REST API (HTTP/HTTPS) |
| **Operating System** | **Linux သာ ရရှိသည်** | Linux & Windows | **Windows & Linux** | OS Independent |
| **Multi-Instance Sharing** | **ထောင်ချီ Multi-AZ ချိတ်နိုင်သည်** | Single Instance (io1/io2 Multi-Attach Single AZ သာ) | Multi-AZ ချိတ်ဆက်နိုင်သည် | အင်တာနက်ပေါ်မှ နေရာမရွေး ရယူနိုင်သည် |
| **Storage Capacity** | Elastic (Auto-scaling) | Fixed Provisioned Size | Fixed Provisioned Size | Infinite Scalability |

---

## ⚠️ SAA-C03 Exam Traps (စာမေးပွဲ သတိပြုရန် ထောင်ချောက်များ)

> [!WARNING]
> 1. **Windows Support Trap:** မေးခွန်းတွင် Windows Server များစွာမှ Shared File Storage အဖြစ် မျှဝေသုံးစွဲမည်ဟု ပါရှိပါက EFS ကို မရွေးပါနှင့်! အဖြေမှန်သည် **Amazon FSx for Windows File Server (SMB)** ဖြစ်ပါသည်။
> 2. **Multi-AZ Auto Scaling Group Shared Data:** Auto Scaling Group ရှိ Linux EC2 Instances များစွာသည် ပုံများ သို့မဟုတ် code ဖိုင်များကို တပြိုင်နက်တည်း ဖတ်/ရေး ရမည်ဆိုပါက အဖြေသည် **Amazon EFS** ဖြစ်ပါသည်။ EBS Volume သည် Multi-AZ cross ချိတ်ဆက်၍ မရပါ။
> 3. **Firewall Block:** EC2 မှ EFS သို့ mount လုပ်၍ မရဘဲ Connection timeout ဖြစ်နေပါက Mount Target Security Group တွင် **NFS Port 2049 Inbound** ခွင့်ပြုထားခြင်း ရှိ/မရှိ အရင်ဆုံး စစ်ဆေးရပါမည်။

---

## 📝 SAA-C03 Practice Questions (စာမေးပွဲ အလေ့အကျင့် မေးခွန်းများ)

### မေးခွန်း ၁
Web Application တစ်ခုသည် Multi-AZ Auto Scaling Group တွင် ပြေးဆွဲနေသော Linux EC2 Instances ၅၀ ပေါ်တွင် အလုပ်လုပ်နေသည်။ အသုံးပြုသူများ တင်လိုက်သော PDF ဖိုင်များနှင့် ပုံများကို အဆိုပါ EC2 Instances ၅၀ စလုံးမှ တပြိုင်နက် ဝင်ရောက်ဖတ်ရှု/ပြင်ဆင်နိုင်ရမည် ဖြစ်ပြီး Storage အရွယ်အစားကိုလည်း ကြိုတင်သတ်မှတ်စရာ မလိုဘဲ အလိုအလျောက် ကျုံ့နိုင်ကျယ်နိုင် ဖြစ်လိုသည်။ မည်သည့် Storage ဝန်ဆောင်မှုကို ရွေးချယ်သင့်သနည်း?

- A) EBS General Purpose SSD (gp3) with Multi-Attach
- B) Amazon EFS with Multi-AZ Mount Targets
- C) Amazon FSx for Lustre
- D) EC2 Instance Store

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Amazon EFS** သည် Linux OS အတွက် Multi-AZ ပေါ်ရှိ EC2 Instances များစွာမှ တပြိုင်နက်တည်း ဖတ်/ရေး ပြုလုပ်နိုင်သော POSIX Shared Storage ဖြစ်ပြီး Capacity ကို ကြိုတင် သတ်မှတ်ရန် မလိုဘဲ အလိုအလျောက် Elastic ကြီးထွားနိုင်ပါသည်။ EBS gp3 တွင် Multi-Attach မရရှိသလို Single AZ သာ ရရှိသဖြင့် မှားယွင်းပါသည်။
</details>

---

### မေးခွန်း ၂
Solutions Architect သည် ကုန်ကျစရိတ် အသက်သာဆုံး ဖြစ်စေရန် EFS File System တစ်ခုကို ဒီဇိုင်းဆွဲနေသည်။ ဖိုင်အသစ်များကို ပထမ ၁၄ ရက်အတွင်းသာ အပြင်းအထန် ဖတ်ရှုကြပြီး ၁၄ ရက် ကျော်လွန်သွားပါက တစ်လလျှင် တစ်ကြိမ်ပင် မဖတ်တော့ပါ။ ဤလိုအပ်ချက်အတွက် အနည်းဆုံးသော စီမံခန့်ခွဲမှုဖြင့် မည်သို့ ဖွဲ့စည်းသင့်သနည်း?

- A) AWS Lambda ရေး၍ ဖိုင်ဟောင်းများကို S3 Glacier သို့ နေ့စဉ် ရွှေ့မည်။
- B) EFS Lifecycle Management ဖွင့်၍ ရက် ၁၄ ရက် မသုံးသော ဖိုင်များကို EFS Infrequent Access (IA) သို့ အလိုအလျောက် ရွှေ့မည်။
- C) EFS One Zone ကိုသာ သုံးမည်။
- D) EFS ကို ဖျက်ပြီး EBS st1 သို့ ပြောင်းမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **EFS Lifecycle Management** တွင် ရက် ၁၄ ရက် သတ်မှတ်ထားပါက အသုံးနည်းသော ဖိုင်များကို ၉၂% အထိ ကုန်ကျစရိတ် သက်သာသော EFS Infrequent Access (IA) သို့ Zero Operational Overhead ဖြင့် အလိုအလျောက် ရွှေ့ပြောင်းပေးပါသည်။
</details>
