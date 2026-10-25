# 🚨 Module 14: SRE & Production Operations (မြန်မာဘာသာ)

> **Site Reliability Engineering (SRE) အခြေခံမူများ၊ SEV-1 Incident Response၊ Runbooks ရေးသားနည်း၊ Blameless Postmortems နှင့် On-Call လုပ်ငန်းစဉ်များ**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

Site Reliability Engineering (SRE) ဆိုသည်မှာ Software Engineering အလေ့အကျင့်များကို စနစ်လည်ပတ်ရေး (Operations) တွင် အသုံးချခြင်း ဖြစ်ပါသည်။ စနစ်တစ်ခုတွင် အမှားအယွင်းများ (Failures) သည် မလွဲမသွေ ဖြစ်ပေါ်လာနိုင်သည် ဟူသော အမှန်တရားကို လက်ခံပြီး၊ အရေးပေါ် အခြေအနေတွင် အမြန်ဆုံး ဖြေရှင်းနိုင်မည့် **Incident Management**၊ ထပ်ခါတလဲလဲ မဖြစ်စေရန် ပြုလုပ်မည့် **Blameless Postmortem** နှင့် **Automated Runbooks** များကို စနစ်တကျ ရေးဆွဲရမည် ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Google SRE Principles**: "Hope is not a strategy" — အင်ဂျင်နီယာနည်းကျ စနစ်ယုံကြည်စိတ်ချရမှု တည်ဆောက်ခြင်း။
2. **SLI, SLO & Error Budget Policies**: စနစ်ပျက်ကျခွင့် ဘတ်ဂျက်ကုန်သွားပါက Feature Release များကို ခေတ္တရပ်ပြီး Stability ကိုသာ ဦးစားပေးသည့် စည်းမျဉ်းများ သတ်မှတ်ခြင်း။
3. **Incident Severity Levels (SEV-1 to SEV-4)**: ပြဿနာ၏ အရေးကြီးမှုအလိုက် ဦးစားပေး သတ်မှတ်ခြင်း။
4. **Actionable Runbooks**: သန်းခေါင်ယံ အချိန်တွင် မည်သူမဆို ဖတ်ရှုဖြေရှင်းနိုင်မည့် SOPs ရေးဆွဲခြင်း။
5. **Blameless Postmortems**: လူကို အပြစ်မတင်ဘဲ စနစ်၏ အားနည်းချက် (5 Whys) ကို ရှာဖွေခြင်း။
6. **Toil Reduction**: ထပ်ခါတလဲလဲ ပြုလုပ်ရသော manual အလုပ်များကို automation စနစ်သို့ ပြောင်းလဲခြင်း (Toil < 50%)။

---

## 🚨 ၂။ Incident Management Severity Levels

- **SEV-1 (Critical)**: Core Service Down, MTTR < 15 mins (Payment Gateway Down, DB Crash)
- **SEV-2 (Major)**: Critical Feature Impaired, MTTR < 30 mins (Checkout broken)
- **SEV-3 (Minor)**: Degraded Performance with workaround, MTTR < 4 hours
- **SEV-4 (Low)**: Minor UI bug, cosmetic issue

---

## 📖 ၃။ Actionable Runbook Blueprint

1. **Alert Name & Meaning**: ဘာဖြစ်နေတာလဲ?
2. **Severity & Triage**: ဘယ်လောက် အရေးကြီးသလဲ?
3. **Instant Verification**: အမှန်တကယ် ဟုတ်မဟုတ် ဘယ် command ဖြင့် စစ်မလဲ?
4. **Step-by-Step Mitigation**: ချက်ချင်း ဖြေရှင်းရန် အမိန့်များ
5. **Escalation Path**: မရပါက မည်သူ့ကို ဆက်သွယ်ရမည်နည်း?

---

## 📝 ၄။ Blameless Postmortem (5 Whys Analysis)

- လူကို လက်ညှိုးမထိုးဘဲ "အဘယ်ကြောင့် စနစ်သည် ထိုကဲ့သို့ မှားယွင်းစွာ နှိပ်ခွင့် ပြုထားသနည်း" ကို 5 Whys ဖြင့် ရှာဖွေပြီး အနာဂတ်အတွက် Automated Guardrails တည်ဆောက်ခြင်း။

---

## 💼 ၅။ အင်တာဗျူး အမေးအဖြေများ

### မေးခွန်း: Blameless Postmortem ဆိုတာ ဘာလဲ?
> "Incident ဖြစ်ပွားပြီးနောက် မည်သည့် အင်ဂျင်နီယာကိုမျှ အပြစ်တင် လက်ညှိုးမထိုးဘဲ စနစ်၏ အားနည်းချက်ကို ပွင့်လင်းစွာ စုံစမ်းလေ့လာပြီး ထပ်မံမဖြစ်စေရန် Automated Guardrails တည်ဆောက်သော အလေ့အကျင့် ဖြစ်ပါသည်။"

---

## 📋 ၆။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့်

👉 **နောက်တစ်ဆင့်**: **[Module 15: Real-World Portfolio Projects (AWS, Docker, CI/CD, Terraform)](../15-projects/README.md)**
