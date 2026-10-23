---
title: "၄။ SAA-C03 Exam Traps & Practice Quiz"
description: "EBS နှင့် ပတ်သက်သော SAA-C03 စာမေးပွဲ ထောင်ချောက်များ (DeleteOnTermination, Boot Volume Restrictions, Instance Store vs EBS) နှင့် Practice Quiz"
---

# ၄။ SAA-C03 Exam Traps & Practice Quiz

## ⚠️ SAA-C03 Exam Traps (စာမေးပွဲ သတိပြုရန် ထောင်ချောက်များ)

> [!WARNING]
> 1. **DeleteOnTermination Attribute:**
>    - EC2 Instance တစ်ခု ဆောက်သောအခါ **Root EBS Volume** အတွက် `DeleteOnTermination` သည် Default အားဖြင့် **True** ဖြစ်နေသည်။ ဆိုလိုသည်မှာ EC2 Instance ကို Terminate လုပ်လိုက်ပါက Root Volume ထဲရှိ ဒေတာများပါ ပျက်စီးသွားမည် ဖြစ်သည်။ ဒေတာမပျက်စေလိုပါက အဆိုပါ attribute ကို **False** ပြောင်းထားရမည်။
>    - ထပ်ဆောင်း Attach လုပ်ထားသော **Additional Data EBS Volumes** များအတွက်မူ `DeleteOnTermination` သည် Default အားဖြင့် **False** ဖြစ်သည်။
> 2. **Boot Volume Restrictions:**
>    - **gp2, gp3, io1, io2 (SSD များသာ)** Boot Volume အဖြစ် အသုံးပြုခွင့်ရှိသည်။
>    - **st1 နှင့် sc1 (HDD များသည်)** Sequential Data သာ သုံးနိုင်သဖြင့် Boot Volume အဖြစ် **လုံးဝ သုံး၍ မရပါ**။
> 3. **EBS vs EC2 Instance Store:**
>    - **EBS:** Network-attached ဖြစ်ပြီး Server Stop/Start လုပ်သော်လည်း ဒေတာ မပျောက်ပါ။
>    - **Instance Store:** EC2 Physical Host ပေါ်ရှိ တကယ့် Hard Disk ဖြစ်ပြီး သန်းနှင့်ချီသော အလွန်မြန်သည့် IOPS ရရှိသော်လည်း Server ကို **Stop လုပ်လိုက်သည်နှင့် Data အားလုံး ပျက်စီးသွားပါသည် (Ephemeral Storage)**။ Cache သို့မဟုတ် Temp ဖိုင်များအတွက်သာ သုံးသင့်သည်။
> 4. **EBS Scope:** EBS Volume တစ်ခုသည် Single AZ အတွင်းသာ သီးသန့်ဖြစ်ပြီး Multi-AZ မျှဝေသုံးစွဲလိုပါက **Amazon EFS** ကို ရွေးချယ်ရမည်။

---

## 📝 SAA-C03 Practice Questions (စာမေးပွဲ အလေ့အကျင့် မေးခွန်းများ)

### မေးခွန်း ၁
ကုမ္ပဏီတစ်ခုသည် ငွေကြေးဆိုင်ရာ Transactional Database တစ်ခုကို EC2 Instance ပေါ်တွင် run နေသည်။ အဆိုပါ Database သည် အမြင့်ဆုံး စွမ်းဆောင်ရည်အဖြစ် 80,000 IOPS နှင့် အလွန်နည်းပါးသော Sub-millisecond Storage Latency လိုအပ်ပါသည်။ မည်သည့် EBS Volume အမျိုးအစားကို ရွေးချယ်သင့်သနည်း?

- A) General Purpose SSD (gp3)
- B) Throughput Optimized HDD (st1)
- C) Provisioned IOPS SSD (io2 Block Express)
- D) Cold HDD (sc1)

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: C**  
**ရှင်းလင်းချက်:** **io2 Block Express** သည် အမြင့်ဆုံး 256,000 IOPS အထိ ထောက်ပံ့ပေးပြီး Sub-millisecond latency ရှိသဖြင့် Mission-critical Database များအတွက် အသင့်တော်ဆုံး ဖြစ်ပါသည်။ gp3 ၏ အမြင့်ဆုံး IOPS မှာ 16,000 သာ ရှိသဖြင့် မေးခွန်းပါ 80,000 IOPS ကို မပြည့်မီပါ။
</details>

---

### မေးခွန်း ၂
Solutions Architect သည် EC2 Instance တစ်ခုတွင် attach လုပ်ထားသော 500 GB Unencrypted EBS Volume တစ်ခုကို တွေ့ရှိခဲ့သည်။ ကုမ္ပဏီ၏ Security Policy အရ Storage Volume အားလုံးသည် AWS KMS Key ဖြင့် မဖြစ်မနေ Encrypted ဖြစ်ရပါမည်။ မည်သည့် လုပ်ငန်းစဉ်သည် အမှန်ကန်ဆုံး ဖြစ်သနည်း?

- A) EBS Console မှ Modify Volume ကို နှိပ်ပြီး Encryption ကို Enable လုပ်မည်။
- B) Unencrypted Volume မှ Snapshot ရိုက်မည်။ ထို Snapshot ကို Encrypt လုပ်ပြီး ကူးယူ (Copy) မည်။ ထို့နောက် Encrypted Snapshot မှ Volume အသစ် ဆောက်၍ EC2 သို့ Attach လုပ်မည်။
- C) AWS KMS Console သို့ သွား၍ EBS Volume ID ကို KMS Key သို့ Assign လုပ်မည်။
- D) Volume ကို AWS S3 သို့ sync လုပ်ပြီး S3 Default Encryption သုံးမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** နဂိုရှိပြီးသား Unencrypted EBS Volume ကို တိုက်ရိုက် In-place Encrypt လုပ်၍ မရပါ။ Snapshot ရိုက်ခြင်း ➔ Snapshot Copy ကူးစဉ် KMS Encryption ရွေးချယ်ခြင်း ➔ ထို Encrypted Snapshot မှ Volume အသစ် ပြန်လည်တည်ဆောက်ခြင်းသည် AWS စံနှုန်း ဖြစ်ပါသည်။
</details>
