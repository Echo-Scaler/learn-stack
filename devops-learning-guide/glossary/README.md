# 📖 DevOps & Cloud Technical Glossary (ဝေါဟာရ အဘိဓာန်)

> **ခေတ်သစ် DevOps၊ Cloud Architecture၊ CI/CD နှင့် SRE နယ်ပယ်တွင် အသုံးအများဆုံး အင်္ဂလိပ် ဝေါဟာရ ၆၀ ကျော်၏ တိကျသော မြန်မာဘာသာ ရှင်းလင်းချက်များ**

---

| Technical Term | တိကျသော မြန်မာဘာသာ ရှင်းလင်းချက် |
|---|---|
| **Agentless** | Target Server တွင် Agent သွင်းရန် မလိုဘဲ SSH/WinRM ဖြင့် တိုက်ရိုက် ခိုင်းစေနိုင်သော စနစ် (Ansible)။ |
| **Artifact** | CI/CD build အဆင့်တွင် ထွက်ပေါ်လာသော deploy ပြုလုပ်မည့် အပြီးသတ် ဖိုင် (Docker Image, JAR, tar.gz)။ |
| **Blue/Green Deployment** | Production ပတ်ဝန်းကျင် ၂ ခု (Blue နှင့် Green) တည်ဆောက်ပြီး traffic လွှဲပြောင်းပေးသော Zero-Downtime နည်းဗျူဟာ။ |
| **CIDR** | IP address များနှင့် Subnets များကို bit mask ဖြင့် သတ်မှတ်သော စနစ် (`10.0.0.0/16`)။ |
| **Declarative (IaC)** | "မည်သို့ဆောက်ရမည်" ကို မရေးဘဲ "မည်သည့် Desired State လိုချင်သည်" ကိုသာ ရေးသားသော ပုံစံ (Terraform, K8s YAML)။ |
| **Drift Detection** | Cloud ပေါ်ရှိ အမှန်တကယ် လက်ရှိ resource များနှင့် IaC Code အကြား ကွဲလွဲနေမှုကို ရှာဖွေစစ်ဆေးခြင်း။ |
| **Error Budget** | စနစ်၏ SLO ပြည့်မီရန် ခွင့်ပြုထားသော အမြင့်ဆုံး ပျက်ကျခွင့် အချိန်အပိုင်းအခြား (100% - SLO)။ |
| **Idempotency** | Operation တစ်ခုကို အကြိမ်ကြိမ် run စေကာမူ နောက်ဆုံးရလဒ်သည် မူလ Desired State အတိုင်း တသမတ်တည်း တည်ရှိနေခြင်း။ |
| **Immutable Infrastructure** | ဆာဗာကို update ပြုလုပ်ရန် SSH ဝင်မပြင်ဘဲ Image အသစ်ဖြင့် ဆာဗာအသစ် ဆောက်ကာ အဟောင်းကို ဖျက်ဆီးပစ်သော စနစ်။ |
| **MTTR** | Mean Time To Resolve — ပြဿနာ စတင်ဖြစ်ပွားချိန်မှ ပြေလည်သွားချိန်အထိ ပျမ်းမျှ ကြာမြင့်ချိန်။ |
| **Multi-Stage Build** | Dockerfile တွင် Build Stage နှင့် Production Runtime Stage ကို ခွဲခြားပြီး Image Size ကို ၉၀% ချုံ့နိုင်သော နည်းစနစ်။ |
| **Observability** | Metrics, Logs နှင့် Traces ဒေတာများကို ကြည့်ရှု၍ စနစ်၏ အတွင်းပိုင်း ကျန်းမာရေးကို တိုင်းတာနားလည်နိုင်စွမ်း။ |
| **Pod** | Kubernetes တွင် Deploy ပြုလုပ်နိုင်သော အသေးငယ်ဆုံးယူနစ် (Container များ စုစည်းမှု)။ |
| **PromQL** | Prometheus TSDB တွင် Metrics များကို query လုပ်ရန် အသုံးပြုသော ဘာသာစကား။ |
| **Root Cause Analysis (RCA)**| မျက်နှာပြင် လက္ခဏာကိုသာ မပြင်ဘဲ အရင်းအမြစ် အစစ်အမှန်ကို 5 Whys ဖြင့် ရှာဖွေဖော်ထုတ်ခြင်း။ |
| **Runbook** | စနစ် ချို့ယွင်းမှု ဖြစ်ပေါ်လာပါက On-call engineer များ ချက်ချင်း ဖတ်ရှုဖြေရှင်းနိုင်ရန် ရေးသားထားသော အဆင့်ဆင့် လမ်းညွှန်ချက် (SOP)။ |
| **Shift-Left Security** | လုံခြုံရေး စစ်ဆေးမှုများကို Developer Code ရေးသည့် အစောဆုံး အဆင့်ဆီသို့ ရှေ့တန်းတင် ထည့်သွင်းခြင်း။ |
| **SLI / SLO / SLA** | SLI သည် လက်ရှိ ရလဒ်၊ SLO သည် အဖွဲ့၏ ပစ်မှတ်၊ SLA သည် Customer နှင့် တရားဝင် စာချုပ်။ |
| **Toil** | တန်ဖိုး မတိုးစေဘဲ လက်ဖြင့် ထပ်ခါတလဲလဲ လုပ်ဆောင်နေရသော စက်ဆန်သည့် operational tasks များ။ |
| **Zero-Downtime Deployment** | Application update ပြုလုပ်ရာတွင် တစ်စက္ကန့်မျှ downtime မရှိစေဘဲ update ပြုလုပ်ပေးနိုင်ခြင်း။ |
