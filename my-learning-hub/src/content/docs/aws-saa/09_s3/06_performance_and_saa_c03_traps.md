---
title: "၆။ Performance Optimization & SAA-C03 Quiz"
description: "S3 Performance (Multipart Upload, Transfer Acceleration, Byte-Range Fetches) နှင့် SAA-C03 စာမေးပွဲ Exam Traps & Practice Quiz"
---

# ၆။ Performance Optimization & SAA-C03 Quiz

## 🚀 S3 Performance Optimization နည်းပညာများ

### 1. Multipart Upload
- **စည်းမျဉ်း:** ဖိုင်အရွယ်အစား **100 MB ကျော်ပါက Multipart Upload သုံးရန် အကြံပြုပြီး၊ 5 GB ကျော်ပါက မဖြစ်မနေ အသုံးပြုရမည်** ဖြစ်ပါသည်။ (Single PUT ဖြင့် အများဆုံး 5 GB သာ တင်နိုင်ပြီး၊ S3 Object တစ်ခု၏ အမြင့်ဆုံး အရွယ်အစားမှာ **5 TB** ဖြစ်သည်)။
- **အားသာချက်:** ဖိုင်ကို အပိုင်းငယ်လေးများ ခွဲ၍ Parallel တပြိုင်နက် Upload တင်သဖြင့် အမြန်နှုန်း အဆများစွာ တက်လာပြီး လိုင်းပြတ်တောက်သွားပါက ပျက်သွားသောအပိုင်းကိုသာ ပြန်တင်ရသဖြင့် အလွန်စိတ်ချရသည်။

### 2. S3 Transfer Acceleration
- ကမ္ဘာအနှံ့ရှိ User များမှ S3 Bucket သို့ အဝေးမှ ဖိုင်တင်ရာတွင် **AWS CloudFront Edge Locations** များကို ကြားခံအသုံးပြု၍ AWS ၏ သီးသန့် high-speed backbone network မှတစ်ဆင့် အမြန်ဆုံး ပို့ဆောင်ပေးခြင်း ဖြစ်သည်။

### 3. S3 Byte-Range Fetches
- ဖိုင်တစ်ခုလုံးကို ဒေါင်းလုဒ်မလုပ်ဘဲ ဖိုင်၏ သတ်မှတ်ထားသော Byte အပိုင်းအစများကိုသာ Parallel ခွဲ၍ ဒေါင်းလုဒ်ဆွဲခြင်း (ဥပမာ- Video ဖိုင်တစ်ခု၏ ပထမ စက္ကန့် ၃၀ ကိုသာ အမြန် buffer လုပ်ခြင်း သို့မဟုတ် Header data သာ ဖတ်ရှုခြင်း)။

### 4. S3 Prefix Scale Limits
- S3 Bucket အတွင်း Prefix (Folder) တစ်ခုစီတိုင်းသည် **3,500 PUT/COPY/POST/DELETE requests per second** နှင့် **5,500 GET/HEAD requests per second** ကို ခံနိုင်ရည်ရှိသည်။ Prefix များ ခွဲခြားသတ်မှတ်ခြင်းဖြင့် Performance ကို အဆမတန် မြှင့်တင်နိုင်ပါသည်။

---

## ⚠️ SAA-C03 Exam Traps (သတိပြုရမည့် အချက်များ)

> [!WARNING]
> 1. **5 GB Single Upload Limit:** စာမေးပွဲတွင် 10 GB ရှိသော database backup ဖိုင်ကို တင်ရာတွင် error တက်နေပါက အဖြေသည် **Multipart Upload** ကို ပြောင်းလဲအသုံးပြုရန် ဖြစ်သည်။
> 2. **S3 Static Website HTTPS Trap:** S3 Static Website Hosting သီးသန့်သည် HTTPS (SSL) မရပါ။ HTTPS လိုအပ်ပါက ရှေ့တွင် **Amazon CloudFront + ACM SSL Certificate** ထားရှိရမည်။
> 3. **CRR Versioning Trap:** Cross-Region Replication (CRR) အလုပ်လုပ်ရန် Source Bucket နှင့် Destination Bucket **နှစ်ခုစလုံးတွင် Versioning ဖွင့်ထားရပါမည်**။
> 4. **Bucket Name Uniqueness:** Bucket Name သည် Region တစ်ခုတည်းတွင် မဟုတ်ဘဲ ကမ္ဘာတစ်ဝန်းရှိ AWS Accounts အားလုံးတွင် Globally Unique ဖြစ်ရမည်။

---

## 📝 SAA-C03 Practice Questions (စာမေးပွဲ အလေ့အကျင့် မေးခွန်းများ)

### မေးခွန်း ၁
ကုမ္ပဏီတစ်ခုသည် သုံးစွဲသူများ Upload တင်ထားသော ဓာတ်ပုံများကို S3 Bucket တွင် သိမ်းဆည်းထားသည်။ အဆိုပါ ဓာတ်ပုံများကို ပထမ ရက် ၃၀ အတွင်း အလွန်အကြိမ်ရေများစွာ ဝင်ရောက်ကြည့်ရှုကြသော်လည်း ရက် ၉၀ ကျော်လွန်သွားပါက တစ်ခါတစ်ရံမှသာ ပြန်လည်ကြည့်ရှုကြတော့သည်။ ကုမ္ပဏီသည် Data များကို မည်သည့်အခါမျှ မဖျက်လိုဘဲ ကုန်ကျစရိတ်ကို အလိုအလျောက် အသက်သာဆုံး စီမံလိုသည်။ မည်သည့် Solution သည် အသင့်တော်ဆုံး ဖြစ်သနည်း?

- A) S3 Lifecycle rule ဖြင့် ရက် ၃၀ တွင် S3 Standard-IA သို့ ပြောင်းပြီး ရက် ၉၀ တွင် S3 Glacier Flexible Retrieval သို့ ပြောင်းမည်။
- B) ဖိုင်အားလုံးကို S3 One Zone-IA တွင် စတင်သိမ်းဆည်းမည်။
- C) S3 Bucket Versioning ကို ပိတ်ထားမည်။
- D) ဖိုင်အားလုံးကို S3 Glacier Deep Archive သို့ ချက်ချင်း တင်မည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: A**  
**ရှင်းလင်းချက်:** S3 Standard-IA သည် ရက် ၃၀ ကျော် အသုံးနည်းသော ဒေတာများအတွက် ကုန်ကျစရိတ် သက်သာစေပြီး၊ ရက် ၉၀ ကျော်ပါက Glacier သို့ Lifecycle Rule ဖြင့် အလိုအလျောက် အဆင့်ဆင့် ရွှေ့ပြောင်းခြင်း (Transition) သည် အကောင်းဆုံး Cost Optimization ဖြစ်ပါသည်။
</details>

---

### မေးခွန်း ၂
Solutions Architect တစ်ဦးသည် အဖွဲ့အစည်းတစ်ခုအတွက် စည်းမျဉ်းစည်းကမ်း လိုက်နာမှု (Compliance) အရ ဖိုင်များကို ၅ နှစ်ကြာ မည်သူမျှ (AWS Root User အပါအဝင်) ပြင်ဆင်ခြင်း၊ ဖျက်ပစ်ခြင်း မပြုနိုင်စေရန် တားမြစ်ရမည် ဖြစ်သည်။ မည်သည့် နည်းပညာကို ရွေးချယ်ရမည်နည်း?

- A) S3 Bucket Policy ဖြင့် Delete Object ကို Deny လုပ်မည်။
- B) S3 Object Lock ကို Compliance Mode ဖြင့် ၅ နှစ် သတ်မှတ်မည်။
- C) S3 Object Lock ကို Governance Mode ဖြင့် ၅ နှစ် သတ်မှတ်မည်။
- D) IAM Role ဖြင့် User များကို Read Only ပေးထားမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **S3 Object Lock in Compliance Mode** သည် Root Account အပါအဝင် မည်သူမျှ Retention Period မကုန်မချင်း ဖျက်ခွင့် မရှိသော တင်းကျပ်သည့် WORM စံနှုန်း ဖြစ်ပါသည်။ Governance Mode တွင်မူ အခွင့်အာဏာရှိသော Admin များသည် ဖျက်နိုင်စွမ်း ရှိနေသေးသဖြင့် မေးခွန်း၏ လိုအပ်ချက်နှင့် မကိုက်ညီပါ။
</details>
