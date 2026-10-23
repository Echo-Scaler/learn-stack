---
title: "၁။ Glacier Tiers: Instant, Flexible & Deep Archive"
description: "Amazon S3 Glacier အဆင့် ၃ ဆင့် နှိုင်းယှဉ်ချက် (Instant Retrieval, Flexible Retrieval, Deep Archive)၊ စရိတ်စကနှင့် သိုလှောင်မှု စည်းမျဉ်းများ"
---

# ၁။ Glacier Tiers: Instant, Flexible & Deep Archive

## Amazon S3 Glacier ဆိုတာဘာလဲ?

**Amazon S3 Glacier** — **Ultra low-cost storage class for data archiving and long-term backup.**

Amazon S3 Glacier သည် နေ့စဉ်အသုံးမပြုတော့ဘဲ နှစ်ရှည်လများ သိမ်းဆည်းထားရန် လိုအပ်သော ဒေတာဟောင်းများ (Cold Data) အတွက် AWS မှ ဖန်တီးထားသော **Ultra Low-Cost Cloud Archive Storage** ဖြစ်ပါသည်။ 99.999999999% (11 9s) Durability ပေးစွမ်းပြီး သမားရိုးကျ Magnetic Tape Backups များထက် စိတ်ချရပြီး စီမံရ လွယ်ကူပါသည်။

---

## ❄️ Glacier Tiers ၃ မျိုး အသေးစိတ် နှိုင်းယှဉ်ချက်

| Storage Tier | Data Retrieval Time (ထုတ်ယူချိန်) | Minimum Storage Duration | လစဉ်သိုလှောင်ခ (GB လျှင်) | အဓိက အသုံးချပုံ & SAA-C03 Focus |
| :--- | :---: | :---: | :---: | :--- |
| **S3 Glacier Instant Retrieval** | **Milliseconds (စက္ကန့်ပိုင်း မကြာပါ)** | **90 Days** | ~$0.004 / GB | တစ်နှစ်လျှင် ၁ ကြိမ်သာ ကြည့်သော်လည်း လိုအပ်ပါက ချက်ချင်း ကြည့်ရှုရမည့် ဆေးရုံ X-ray ဓာတ်မှန်များ၊ သတင်း မော်ကွန်းများ။ |
| **S3 Glacier Flexible Retrieval** | **1-5 မိနစ် မှ 3-5 နာရီ** | **90 Days** | ~$0.0036 / GB | Backup ဒေတာဟောင်းများ၊ တစ်နှစ်လျှင် ၁ ကြိမ်ခန့် စာရင်းစစ်ရန် နာရီပိုင်း စောင့်ဆိုင်းနိုင်သော ဘဏ္ဍာရေး မှတ်တမ်းများ။ |
| **S3 Glacier Deep Archive** | **12 နာရီ မှ 48 နာရီ** | **180 Days** | **~$0.00099 / GB** (အသက်သာဆုံး) | **ကမ္ဘာ့ဈေးအသက်သာဆုံး Cloud Storage။** ဥပဒေအရ ၇ နှစ်မှ ၁၀ နှစ် သိမ်းရမည့် ဒေတာများ၊ ပြန်ထုတ်ယူရန် လုံးဝနီးပါး မလိုအပ်သော မော်ကွန်းများ။ |

---

## ⚠️ Glacier ၏ အရေးကြီးသော ကုန်ကျစရိတ် စည်းမျဉ်းများ

1. **Minimum Billable Object Size (128 KB):**
   - ဖိုင်အရွယ်အစားသည် 10 KB သာ ရှိသော်လည်း S3 Glacier တွင် **128 KB ဟု သတ်မှတ်၍ ငွေကောက်ခံပါသည်**။ ထို့ကြောင့် သေးငယ်သော ဖိုင်ပေါင်းများစွာကို တင်ပါက ZIP သို့မဟုတ် TAR ဖြင့် ဖိုင်တစ်ခုတည်း အဖြစ် ပေါင်းစည်းပြီးမှ Glacier သို့ ရွှေ့သင့်သည်။
2. **Minimum Storage Duration Fee (ရက်သတ်မှတ်ချက်):**
   - Instant Retrieval နှင့် Flexible Retrieval တွင် ဖိုင်တစ်ခုကို ရက် ၉၀ မပြည့်မီ ဖျက်လိုက်ပါက ရက် ၉၀ ပြည့်သည်အထိ ကျန်ရှိသော ရက်များအတွက် Early Deletion Fee ပေးဆောင်ရသည်။
   - Deep Archive တွင် အနည်းဆုံး **ရက်ပေါင်း ၁၈၀ (၆ လ)** မပြည့်မီ ဖျက်လိုက်ပါက Early Deletion Fee ပေးဆောင်ရသည်။
3. **Retrieval Fees (ထုတ်ယူစရိတ်):**
   - Glacier တွင် ဒေတာ သိုလှောင်ခ (Storage Cost) မှာ အလွန်သက်သာသော်လည်း ဒေတာကို ပြန်လည် ထုတ်ယူဖတ်ရှုသည့်အခါ GB အလိုက် Retrieval Fee ပေးဆောင်ရပါသည်။
