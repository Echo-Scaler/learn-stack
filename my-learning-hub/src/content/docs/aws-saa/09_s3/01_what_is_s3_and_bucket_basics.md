---
title: "၁။ S3 ဆိုတာဘာလဲ & Bucket Basics"
description: "Amazon S3 (Simple Storage Service) ၏ သဘောတရား၊ Object vs Block vs File နှိုင်းယှဉ်ချက်၊ Bucket Naming Rules၊ 11 9s Durability နှင့် Strong Read-After-Write Consistency"
---

# ၁။ S3 ဆိုတာဘာလဲ & Bucket Basics

## Amazon S3 ဆိုတာဘာလဲ?

**Amazon S3 (Simple Storage Service)** — **Highly durable object storage for files, images, and backups.**

Amazon S3 သည် အကန့်အသတ်မရှိ (Scalable) ဒေတာများကို သိုလှောင်နိုင်သော **Cloud Object Storage** ဖြစ်ပါသည်။ သမားရိုးကျ Hard Disk (Block Storage) သို့မဟုတ် Folder စနစ် (File Storage) များကဲ့သို့ မဟုတ်ဘဲ ဖိုင်များကို **Object** များအဖြစ် Flat Hierarchy ဖြင့် သိမ်းဆည်းပါသည်။

---

## 🆚 Storage အမျိုးအစား ၃ မျိုး နှိုင်းယှဉ်ချက်

| အချက် | Object Storage (Amazon S3) | Block Storage (Amazon EBS) | File Storage (Amazon EFS) |
| :--- | :--- | :--- | :--- |
| **Data Structure** | Flat Hierarchy (Key-Value Objects) | Blocks of Data (Raw Sector-level) | Hierarchical Directories & Files |
| **Access Protocol** | HTTP / HTTPS (REST API, SDK, CLI) | Direct Block I/O (SATA/NVMe attach) | NFSv4.1 Protocol (POSIX compliant) |
| **Attached To** | Standalone Internet Service (No EC2 needed) | Single EC2 Instance within same AZ | Multiple EC2/ECS/EKS instances (Multi-AZ) |
| **File Edit စွမ်းရည်** | ဖိုင်တစ်ခုလုံး ပြန် overwrite လုပ်ရသည် | Block တစ်ခုတည်းကို partial update ပြုလုပ်နိုင်သည် | လွတ်လပ်စွာဖိုင်ဖွင့်ဖတ်/ပြင်ဆင်နိုင်သည် |
| **အသုံးချပုံ** | Media, Images, Backups, Data Lake, Static Web | OS Drive, Transactional Database (MySQL) | Multi-server shared code, CMS (WordPress) |

---

## 🪣 Bucket နှင့် Object ဖွဲ့စည်းပုံ

S3 တွင် Data များကို **Buckets** (Folder ကဲ့သို့ သဘောထားနိုင်သော ထိပ်ဆုံး Container) များအတွင်း **Objects** (ဖိုင်များ) အဖြစ် သိမ်းဆည်းပါသည်။

```
┌───────────────────────────────────────────────────────────┐
│              Amazon S3 Region (e.g., ap-southeast-1)      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Bucket: my-prod-app-assets-sg                       │  │
│  │                                                     │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Object: images/banner.png                      │ │  │
│  │  │  • Key: "images/banner.png"                    │ │  │
│  │  │  • Value: Binary Image Data (Bytes)            │ │  │
│  │  │  • Version ID: "null" သို့မဟုတ် UUID          │ │  │
│  │  │  • Metadata: Content-Type: image/png           │ │  │
│  │  │  • Storage Class: STANDARD                     │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 1. Bucket Naming Rules (ကမ္ဘာတစ်ဝန်း တစ်ခုတည်းသာ ရှိရမည်)
- **Globally Unique:** AWS အကောင့်အားလုံး၊ Region အားလုံးပေါင်းတွင် နာမည်တစ်ခုသည် တစ်ဦးတည်းသာ ပိုင်ဆိုင်ခွင့်ရှိသည်။ (ဥပမာ- `test` ဟု ပေး၍မရပါ)။
- **Naming Constraints:** စာလုံးရေ ၃ လုံးမှ ၆၃ လုံးအထိ၊ Lowercase စာလုံးများ၊ နံပါတ်များနှင့် hyphen (`-`) သာ သုံးနိုင်သည်။
- Uppercase စာလုံးများ သို့မဟုတ် underscore (`_`) မသုံးရပါ။ IP Address ပုံစံ (ဥပမာ `192.168.1.1`) မပေးရပါ။

### 2. Object Components
- **Key:** Object ၏ နာမည်အပြည့်အစုံ (Path အပါအဝင် ဥပမာ- `uploads/2026/avatar.jpg`)။
- **Value:** သိမ်းဆည်းထားသော Binary Data (ဖိုင်ဆိုဒ် 0 bytes မှ အများဆုံး **5 TB** အထိ ရနိုင်သည်)။
- **Version ID:** Versioning ဖွင့်ထားပါက ထွက်ပေါ်လာသော ထူးခြားသည့် ID။
- **Metadata:** System metadata (Creation date, size) နှင့် Custom metadata (`x-amz-meta-*`)။
- **Tags:** ကုန်ကျစရိတ်ခွဲခြမ်းစိတ်ဖြာရန် Key-Value tags (အများဆုံး ၁၀ ခု)။

---

## 🛡️ 11 9s Durability vs Availability

AWS S3 ၏ အဓိက အားသာချက်မှာ ကမ္ဘာပေါ်တွင် အမြင့်ဆုံးဖြစ်သော **99.999999999% (11 9s) Durability** ဖြစ်ပါသည်။

- **Durability (ဒေတာ မပျောက်ပျက်မှု):** သင်သိမ်းဆည်းထားသော ဖိုင်ပေါင်း ၁၀,၀၀၀,၀၀၀ (၁၀ သန်း) တွင် ဖိုင် ၁ ဖိုင် ပျက်စီးနိုင်ခြေသည် အနှစ် ၁၀,၀၀၀ တွင် တစ်ကြိမ်သာ ရှိသည်။ အဘယ်ကြောင့်ဆိုသော် AWS သည် ဖိုင်တစ်ခုကို အနည်းဆုံး **3 Availability Zones (AZs)** တွင် သီးခြားခွဲ၍ အလိုအလျောက် replicate လုပ်ထားသောကြောင့် ဖြစ်သည်။
- **Availability (ဒေတာဖွင့်ဖတ်နိုင်မှု):** S3 Standard သည် **99.99% Availability** ပေးစွမ်းပြီး တစ်နှစ်ပတ်လုံးတွင် မိနစ် ၅၀ ခန့်သာ downtime ဖြစ်နိုင်ခြေရှိသည်။

---

## ⚡ Strong Read-After-Write Consistency

အတိတ်ကာလတွင် S3 သည် Eventual Consistency ဖြစ်ခဲ့သော်လည်း ယခုအခါ **Strong Read-After-Write Consistency** ကို အပြည့်အဝ ပံ့ပိုးထားပါသည်:
- ဖိုင်အသစ်တစ်ခု **PUT** (Upload) တင်ပြီးသည်နှင့် တပြိုင်နက် မည်သည့်နေရာမှမဆို **GET** လုပ်ပါက အသစ်တင်လိုက်သော ဖိုင်ကို ချက်ချင်း ရရှိမည်ဖြစ်သည်။
- ဖိုင်တစ်ခုကို Update လုပ်ပြီးနောက် သို့မဟုတ် **DELETE** လုပ်ပြီးနောက် ချက်ချင်း GET လုပ်ပါကလည်း နောက်ဆုံး ပြင်ဆင်ချက် သို့မဟုတ် 404 Not Found ကို ချက်ချင်း ရရှိမည်ဖြစ်ပါသည်။
