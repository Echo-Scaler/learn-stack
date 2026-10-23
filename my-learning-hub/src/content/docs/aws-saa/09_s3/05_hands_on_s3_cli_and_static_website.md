---
title: "၅။ Hands-on: S3 CLI & Static Website Hosting"
description: "AWS CLI ဖြင့် S3 စီမံခန့်ခွဲနည်း (mb, cp, sync, presign) နှင့် S3 Static Website Hosting + CloudFront OAC Architecture တည်ဆောက်ခြင်း"
---

# ၅။ Hands-on: S3 CLI & Static Website Hosting

## လက်တွေ့ AWS CLI Commands များ

S3 တွင် နေ့စဉ် အသုံးအများဆုံး High-Level S3 CLI Commands များကို လေ့လာကြပါမည်-

### 1. Bucket အသစ်တစ်ခု တည်ဆောက်ခြင်း (Make Bucket)
```bash
aws s3 mb s3://my-cloud-backup-2026-unique --region ap-southeast-1
```

### 2. ဖိုင်တစ်ခု Upload တင်ခြင်း (Copy)
```bash
aws s3 cp app-logo.png s3://my-cloud-backup-2026-unique/images/
```

### 3. Folder တစ်ခုလုံးကို Sync ပြုလုပ်ခြင်း (Production Deployments)
Local မှ ဖိုင်အသစ်များကိုသာ တင်ပြီး Local တွင် ဖျက်လိုက်သောဖိုင်များကို S3 မှပါ တစ်ပါတည်း ဖျက်ရန် `--delete` ကို သုံးပါသည်:
```bash
aws s3 sync ./dist s3://my-cloud-backup-2026-unique/web/ --delete
```

### 4. ယာယီ ဒေါင်းလုဒ် Link ထုတ်ပေးခြင်း (Pre-signed URL)
Private S3 Bucket ထဲရှိ ဖိုင်တစ်ခုကို Public မဖွင့်ဘဲ မိနစ် ၆၀ သာ အသုံးပြုနိုင်သော လုံခြုံသည့် Download URL ထုတ်ပေးခြင်း:
```bash
aws s3 presign s3://my-cloud-backup-2026-unique/reports/q1_financial.pdf --expires-in 3600
```

---

## 🌐 S3 Static Website Hosting Architecture

Amazon S3 ကို အသုံးပြု၍ Server မလိုဘဲ HTML, CSS, JavaScript (React, Vue, Astro) Single Page Application (SPA) များကို ကုန်ကျစရိတ် အသက်သာဆုံး လွှင့်တင်နိုင်ပါသည်:

```
[ User Browser ]
       │ (HTTPS / Custom Domain: www.example.com)
       ▼
[ Amazon Route 53 ] (DNS Alias)
       │
       ▼
[ Amazon CloudFront (CDN) ] ── (Origin Access Control - OAC)
       │
       ▼ (Private S3 Access Only)
[ Amazon S3 Bucket ] (Static Assets: index.html, styles.css)
```

### Best Practice Architecture ရှင်းလင်းချက်:
1. **S3 Direct Public Website Hosting:** S3 သီးသန့် Static Website သည် **HTTP သာ ထောက်ပံ့ပြီး HTTPS (SSL) မရပါ**။ ထို့ပြင် Bucket Name သည် Domain Name နှင့် အတိအကျ တူညီရပါသည် (`www.mycompany.com`)။
2. **Production Enterprise Setup:**
   - S3 Bucket တွင် **Block Public Access** ကို အပြည့်အဝ ဖွင့်ထားသည်။
   - **Amazon CloudFront (CDN)** ကို ရှေ့တွင် ထား၍ Free SSL (ACM Certificate) ဖြင့် HTTPS ရယူသည်။
   - CloudFront တွင် **Origin Access Control (OAC)** သတ်မှတ်ပြီး CloudFront မှတစ်ဆင့်သာ S3 ကို ဖတ်ခွင့်ပြုကာ အင်တာနက်မှ တိုက်ရိုက်ဖတ်ရှုခြင်းကို ပိတ်ပင်ထားသည်။
