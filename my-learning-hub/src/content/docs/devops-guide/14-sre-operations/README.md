---
title: "Module 14: SRE & Production Operations"
description: "Site Reliability Engineering principles, Incident Management, Blameless Postmortems, Runbooks, and On-Call Operations (မြန်မာဘာသာ)"
---

> **Site Reliability Engineering (SRE) အခြေခံမူများ၊ SEV-1 Incident Response၊ Runbooks ရေးသားနည်း၊ Blameless Postmortems နှင့် On-Call လုပ်ငန်းစဉ်များ**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

Software တစ်ခုကို Cloud ပေါ်သို့ deploy လုပ်ပြီးရုံဖြင့် အလုပ်မပြီးသေးပါ။ အမှန်တကယ် စိန်ခေါ်မှုမှာ ထိုစနစ်ကို ၂၄ နာရီ ၇ ရက်ပတ်လုံး (24/7) သုံးစွဲသူများ အဆင်ပြေချောမွေ့စွာ အသုံးပြုနိုင်ရန် ထိန်းသိမ်းခြင်း ဖြစ်ပါသည်။

Google မှ စတင်ကျင့်သုံးခဲ့သော **Site Reliability Engineering (SRE)** ဆိုသည်မှာ Software Engineering အလေ့အကျင့်များကို စနစ်လည်ပတ်ရေး (Operations) တွင် အသုံးချခြင်း ဖြစ်ပါသည်။ စနစ်တစ်ခုတွင် အမှားအယွင်းများ (Failures) သည် မလွဲမသွေ ဖြစ်ပေါ်လာနိုင်သည် (Failure is inevitable) ဟူသော အမှန်တရားကို လက်ခံပြီး၊ ပြဿနာဖြစ်ပေါ်လာပါက အမြန်ဆုံး ဖြေရှင်းနိုင်မည့် **Incident Management**၊ ထပ်ခါတလဲလဲ မဖြစ်စေရန် ပြုလုပ်မည့် **Blameless Postmortem** နှင့် အလိုအလျောက် ဖြေရှင်းမည့် **Automated Runbooks** များကို စနစ်တကျ ရေးဆွဲရမည် ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Google SRE Principles**: "Hope is not a strategy" — အင်ဂျင်နီယာနည်းကျ စနစ်ယုံကြည်စိတ်ချရမှု တည်ဆောက်ခြင်း။
2. **SLI, SLO & Error Budget Policies**: စနစ်ပျက်ကျခွင့် ဘတ်ဂျက်ကုန်သွားပါက Feature Release များကို ခေတ္တရပ်ပြီး Stability ကိုသာ ဦးစားပေးသည့် စည်းမျဉ်းများ သတ်မှတ်ခြင်း။
3. **Incident Severity Levels (SEV-1 to SEV-4)**: ပြဿနာ၏ အရေးကြီးမှုအလိုက် ဦးစားပေး သတ်မှတ်ခြင်းနှင့် Escalation Path။
4. **Incident Commander Role & War Room**: အရေးပေါ် အခြေအနေတွင် အဖွဲ့လိုက် ညှိနှိုင်း ဆောင်ရွက်ပုံ (Communication & Coordination)။
5. **Actionable Runbooks**: သန်းခေါင်ယံ အချိန်တွင် နှိုးခံရသော On-Call Engineer မည်သူမဆို ဖတ်ရှုဖြေရှင်းနိုင်မည့် Standard Operating Procedures (SOPs) ရေးဆွဲခြင်း။
6. **Blameless Postmortems**: လူကို အပြစ်မတင်ဘဲ စနစ်၏ အားနည်းချက် (Systemic Failure) ကို 5 Whys နည်းလမ်းဖြင့် Root Cause ရှာဖွေခြင်း။
7. **Toil Reduction**: ထပ်ခါတလဲလဲ ပြုလုပ်ရသော manual အလုပ်များကို Bash, Ansible, Terraform ဖြင့် အလိုအလျောက် စနစ်သို့ ပြောင်းလဲခြင်း (Toil < 50%)။

---

## 🧠 ၂။ SRE အခြေခံ သဘောတရားများနှင့် Error Budget

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        THE SRE TRIANGLE & ERROR BUDGET                 │
├───────────────────────────────────┬────────────────────────────────────┤
│ SLI (Service Level Indicator)     │ တိုင်းတာရရှိသော တန်ဖိုး (99.92%)     │
│ SLO (Service Level Objective)     │ သတ်မှတ်ထားသော ပစ်မှတ် (99.90%)       │
│ Error Budget (100% - SLO)         │ ခွင့်ပြုထားသော ပျက်ကျချိန် (0.10%)   │
├───────────────────────────────────┴────────────────────────────────────┤
│                     ERROR BUDGET POLICY (စည်းမျဉ်း)                    │
│                                                                        │
│ • Error Budget ကျန်ရှိနေသေးလျှင် ➜ Feature အသစ်များကို လွတ်လပ်စွာ Deploy လုပ်နိုင်သည် │
│ • Error Budget ကုန်ဆုံးသွားလျှင်  ➜ Feature Deployments အားလုံးကို FREEZE လုပ်ပြီး    │
│                                  Bug Fixes & Reliability သာ ဦးစားပေးရသည် │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 ၃။ Incident Management Severity Levels (ပြဿနာ အဆင့် သတ်မှတ်ချက်များ)

| Severity | အဓိပ္ပာယ်နှင့် သက်ရောက်မှု | ဖြေရှင်းရန် ပစ်မှတ် (MTTR) | ဥပမာ |
|---|---|---|---|
| **SEV-1 (Critical)** | Core Service လုံးဝ ပျက်ကျနေခြင်း၊ သုံးစွဲသူ အားလုံး ဝန်ဆောင်မှု မရနိုင်ခြင်း၊ ဝင်ငွေ တိုက်ရိုက် ထိခိုက်ခြင်း။ | < ၁၅ မိနစ် အတွင်း တုံ့ပြန် | Payment Gateway Down၊ Database Crash |
| **SEV-2 (Major)** | အရေးကြီးသော Feature တစ်ခု ချို့ယွင်းနေခြင်း သို့မဟုတ် Customer အများစု ထိခိုက်ခြင်း (Workaround မရှိ)။ | < ၃၀ မိနစ် အတွင်း တုံ့ပြန် | Checkout Cart မရခြင်း၊ Search Feature ပျက်ခြင်း |
| **SEV-3 (Minor)** | အစိတ်အပိုင်း အချို့ ချို့ယွင်းသော်လည်း Workaround ရှိနေခြင်း၊ လုပ်ငန်း မရပ်တန့်ခြင်း။ | < ၄ နာရီ အတွင်း တုံ့ပြန် | Email Notification နှောင့်နှေးခြင်း |
| **SEV-4 (Low)** | အမြင်ပိုင်းဆိုင်ရာ အမှား သို့မဟုတ် Internal Tool အသေးစား ပြဿနာ။ | နောက် Release တွင် ဖြေရှင်း | UI layout bug၊ Admin panel typo |

---

## 👥 ၄။ Incident Response Protocol & Roles (အရေးပေါ် တုံ့ပြန်ဆောင်ရွက်ပုံ)

SEV-1 သို့မဟုတ် SEV-2 ဖြစ်ပွားလာပါက အောက်ပါ တာဝန်ခွဲဝေမှုဖြင့် **War Room (Zoom/Slack)** တွင် စုဝေးဆောင်ရွက်ရပါသည်:

1. **Incident Commander (IC)**:
   - စစ်သေနာပတိသဖွယ် ဦးဆောင်သူ ဖြစ်သည်။ နည်းပညာလိုက်ပြင်နေသူ မဟုတ်ဘဲ မည်သူက ဘာလုပ်ရမည်ကို တာဝန်ခွဲပေးပြီး ဆုံးဖြတ်ချက် ချမှတ်သူ ဖြစ်သည်။
2. **Technical Lead / Operations Lead**:
   - ဆာဗာ log များ၊ metrics များကို စစ်ဆေးပြီး အမှန်တကယ် ပြင်ဆင်မှု (Mitigation & Rollback) ပြုလုပ်သော အင်ဂျင်နီယာ။
3. **Communications Lead**:
   - Management၊ Customer Support နှင့် ပြင်ပ Status Page (`status.example.com`) သို့ မိနစ် ၃၀ တကြိမ် အခြေအနေ အစီရင်ခံစာ ထုတ်ပြန်ပေးသူ။

---

## 📖 ၅။ Actionable Runbook ဖွဲ့စည်းပုံ (Standard Operating Procedure)

ညဥ့်နက် ၂ နာရီတွင် အိပ်ရေးပျက်နေသော အင်ဂျင်နီယာတစ်ဦးသည် ရှုပ်ထွေးသော စာအုပ်ကြီးများကို ဖတ်ရှုမနေနိုင်ပါ။ Runbook တိုင်းတွင် အောက်ပါ ၅ ချက် အတိအကျ ပါဝင်ရမည်:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ACTIONABLE RUNBOOK BLUEPRINT                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Alert Name & Meaning: ဘာဖြစ်နေတာလဲ? (ဥပမာ: HighDatabaseConnections)│
│ 2. Severity & Triage: ဘယ်လောက် အရေးကြီးသလဲ? (SEV-1 / SEV-2)            │
│ 3. Instant Verification: အမှန်တကယ် ဟုတ်မဟုတ် ဘယ် command ဖြင့် စစ်မလဲ?│
│ 4. Step-by-Step Mitigation: ချက်ချင်း ဖြေရှင်းရန် အမိန့်များ            │
│ 5. Escalation Path: မရပါက မည်သူ့ကို ဆက်သွယ်ရမည်နည်း?                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 ၆။ Blameless Postmortem (လူကို အပြစ်မတင်သော အစီရင်ခံစာ)

ပြဿနာ ပြေလည်သွားပြီးနောက် ၄၈ နာရီအတွင်း **Postmortem (Post-Incident Review)** ကို ရေးသားရမည်။

### Blameless Culture ၏ အဓိက သဘောတရား:
- "မည်သူ့ကြောင့် ပျက်ရသနည်း" ဟု လူကို လက်ညှိုးမထိုးရပါ။
- "အဘယ်ကြောင့် စနစ်သည် ထိုကဲ့သို့ မှားယွင်းစွာ နှိပ်ခွင့် ပြုထားသနည်း"၊ "မည်သည့် Automated Safety Guardrail လိုအပ်နေသနည်း" ကိုသာ ရှာဖွေရမည်။

### ၅ Whys Root Cause Analysis (အဘယ်ကြောင့် ၅ ဆင့် မေးခွန်း):
1. **အဘယ်ကြောင့် Database ရပ်သွားသနည်း?** ➜ Disk Space ပြည့်သွားသောကြောင့်။
2. **အဘယ်ကြောင့် Disk ပြည့်သွားသနည်း?** ➜ `/var/log` ထဲတွင် error log ဖိုင် 100GB ဖြစ်သွားသောကြောင့်။
3. **အဘယ်ကြောင့် Log ဖိုင် ကြီးသွားသနည်း?** ➜ Codebase ထဲတွင် Debug log များ အဆက်မပြတ် ရေးနေမိသောကြောင့်။
4. **အဘယ်ကြောင့် Debug log များ Production ရောက်သွားသနည်း?** ➜ Configuration merge လုပ်စဉ် developer မတော်တဆ ဖွင့်ထားမိသောကြောင့်။
5. **အဘယ်ကြောင့် Logrotate သို့မဟုတ် Disk Alarm မတက်ခဲ့သနည်း?** ➜ Logrotate script config တွင် အဆိုပါ path မပါဝင်ခဲ့သဖြင့်။
- **Action Item (ဖြေရှင်းချက်)**: လူကို အပြစ်မတင်ဘဲ Logrotate config တွင် path အသစ် ထည့်သွင်းခြင်းနှင့် Disk 80% ကျော်ပါက Telegram သို့ alert လာမည့် Prometheus rule တပ်ဆင်ခြင်း။

---

## 😴 ၇။ Alert Fatigue နှင့် Toil Reduction

### Toil ဆိုသည်မှာ အဘယ်နည်း?
- မည်သည့် ရေရှည်တန်ဖိုးမျှ မထွက်ပေါ်ဘဲ ထပ်ခါတလဲလဲ လက်ဖြင့် လိုက်လုပ်နေရသော စက်ဆန်သည့် operational tasks များ ဖြစ်သည် (ဥပမာ- ဆာဗာ Memory ပြည့်တိုင်း လက်ဖြင့် restart သွားချပေးခြင်း၊ database backup လက်ဖြင့်ယူခြင်း)။
- SRE စံနှုန်းအရ အင်ဂျင်နီယာတစ်ဦး၏ အချိန် **၅၀% ထက် ပို၍ Toil တွင် မကုန်ဆုံးစေရပါ**။ ကျန် ၅၀% ကို Automation ရေးသားခြင်းတွင်သာ အသုံးပြုရမည်။

---

## 🛡️ ၈။ Production Operations Checklist

1. ✅ **Every Alert Must Have a Runbook**: Runbook link မပါဝင်သော Alert မည်သည့်အရာမျှ Slack/Telegram သို့ မပို့ရ။
2. ✅ **Blameless Culture**: လူကို အပြစ်မတင်ဘဲ စနစ်နှင့် လုပ်ငန်းစဉ်ကိုသာ ကောင်းမွန်အောင် ပြုပြင်ပါ။
3. ✅ **Practice Chaos Engineering**: Game Day ပြုလုပ်ပြီး Staging ပတ်ဝန်းကျင်တွင် Server တစ်လုံးကို မကြေညာဘဲ ရုတ်တရက် ပိတ်ချကာ စနစ် အလုပ်လုပ်ပုံကို စမ်းသပ်ပါ။
4. ✅ **Respect Error Budgets**: စနစ်မငြိမ်မချင်း Feature အသစ်များ ထပ်မံမတင်ပါနှင့်။
5. ✅ **Track Action Items**: Postmortem တွင် ဆုံးဖြတ်ထားသော Action Items များကို Jira/GitHub Issues တွင် ထည့်သွင်းပြီး နောက် Sprint တွင် ပြီးစီးအောင် ဖြေရှင်းပါ။

---

## 💼 ၉။ အင်တာဗျူး အမေးအဖြေများ (Interview Questions & Model Answers)

### မေးခွန်း ၁: Blameless Postmortem ဆိုတာ ဘာလဲ? အဘယ်ကြောင့် အရေးကြီးသလဲ?
**အဖြေ**: 
> "Blameless Postmortem ဆိုသည်မှာ Production Incident ဖြစ်ပွားပြီးနောက် မည်သည့် အင်ဂျင်နီယာကိုမျှ အပြစ်တင် လက်ညှိုးထိုးခြင်း မပြုဘဲ၊ စနစ်၏ အားနည်းချက် (System Failure, Missing Guardrails, Flawed Processes) ကို ပွင့်လင်းစွာ စုံစမ်းလေ့လာသော အလေ့အကျင့် ဖြစ်ပါသည်။ 
> 
> လူကို အပြစ်တင်ပါက အမှားများကို ဖုံးကွယ်တတ်ကြပြီး စနစ်၏ အားနည်းချက်ကို မသိနိုင်တော့ပါ။ အမှားလုပ်မိစေရန် ခွင့်ပြုထားသော စနစ်ကို ပြင်ဆင်ပြီး အနာဂတ်တွင် မည်သူမဆို ထိုအမှားမျိုး ထပ်မံမလုပ်မိစေရန် Automated Guardrails တည်ဆောက်ခြင်းသည် အဓိက ရည်ရွယ်ချက် ဖြစ်ပါသည်။"

### မေးခွန်း ၂: MTTR နှင့် MTBF ဆိုတာ ဘာလဲ?
**အဖြေ**:
> "MTTR (Mean Time To Recovery/Resolve) ဆိုသည်မှာ ပြဿနာတစ်ခု စတင်ဖြစ်ပွားချိန်မှ ပြေလည်သွားချိန်အထိ ပျမ်းမျှ ကြာမြင့်ချိန် ဖြစ်ပြီး နည်းလေ ကောင်းလေ ဖြစ်ပါသည်။ 
> MTBF (Mean Time Between Failures) ဆိုသည်မှာ တစ်ကြိမ်နှင့်တစ်ကြိမ် ပျက်ကျမှုအကြား ပုံမှန် အလုပ်လုပ်နိုင်သော ပျမ်းမျှ အချိန်ကာလ ဖြစ်ပြီး များလေ ကောင်းလေ ဖြစ်ပါသည်။"

---

## 📋 ၁၀။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့် (Summary & Next Step)

ယခု Module 14 တွင် သင်သည်:
- Google SRE ၏ အခြေခံမူများနှင့် Error Budget သဘောတရားကို နားလည်ခဲ့သည်။
- SEV-1 မှ SEV-4 အဆင့်သတ်မှတ်ချက်များနှင့် Incident Commander ၏ အခန်းကဏ္ဍကို တတ်မြောက်ခဲ့သည်။
- သန်းခေါင်ယံ အချိန်တွင် မည်သူမဆို လိုက်နာနိုင်မည့် Actionable Runbook ကို ရေးဆွဲနိုင်ခဲ့သည်။
- 5 Whys နည်းလမ်းဖြင့် Blameless Postmortem အစီရင်ခံစာ ရေးသားနည်းကို ကျွမ်းကျင်ခဲ့သည်။

👉 **နောက်တစ်ဆင့်**: **[Module 15: Real-World Portfolio Projects (AWS, Docker, CI/CD, Terraform)](/devops-guide/15-projects/readme/)** သို့ ဆက်လက် တက်လှမ်းပါမည်။
