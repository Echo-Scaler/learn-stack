---
title: "DevOps & Cloud Technical Glossary"
description: "Comprehensive English-to-Burmese Dictionary of 60+ Essential DevOps and Cloud Terms (မြန်မာဘာသာ)"
---

> **ခေတ်သစ် DevOps၊ Cloud Architecture၊ CI/CD နှင့် SRE နယ်ပယ်တွင် အသုံးအများဆုံး အင်္ဂလိပ် ဝေါဟာရ ၆၀ ကျော်၏ တိကျသော မြန်မာဘာသာ ရှင်းလင်းချက်များ**

---

| Technical Term | တိကျသော မြန်မာဘာသာ ရှင်းလင်းချက် |
|---|---|
| **Agentless** | Target Server တွင် သီးခြား background software (Agent) ထည့်သွင်းရန် မလိုဘဲ SSH/WinRM ဖြင့် တိုက်ရိုက် ခိုင်းစေနိုင်သော စနစ် (ဥပမာ Ansible)။ |
| **Artifact** | CI/CD build အဆင့်တွင် ထွက်ပေါ်လာသော deploy ပြုလုပ်မည့် အပြီးသတ် ဖိုင် (ဥပမာ Docker Image, JAR binary, tar.gz)။ |
| **Blast Radius** | စနစ်တစ်ခု သို့မဟုတ် ဆာဗာတစ်ခု ပျက်ကျသွားပါက ထိခိုက်ပျက်စီးနိုင်သော အတိုင်းအတာ သို့မဟုတ် နယ်ပယ် အကျယ်အဝန်း။ |
| **Blue/Green Deployment** | Production ပတ်ဝန်းကျင် ၂ ခု (Blue နှင့် Green) တည်ဆောက်ပြီး Load Balancer မှ traffic ကို ချက်ချင်း လွှဲပြောင်းပေးသော Zero-Downtime deploy နည်းဗျူဟာ။ |
| **Canary Deployment** | Release အသစ်ကို သုံးစွဲသူ အားလုံးထံ ချက်ချင်း မလွှတ်ဘဲ ၅% သော user များထံသို့ အရင်စမ်းသပ် လွှတ်တင်ပြီး အမှားမရှိမှ ကျန် user များထံ ဖြန့်ကျက်သော စနစ်။ |
| **CIDR** | Classless Inter-Domain Routing — IP address များနှင့် Subnets များကို bit mask ဖြင့် သတ်မှတ်သော စနစ် (ဥပမာ `10.0.0.0/16`)။ |
| **Container Drift** | Container တစ်ခုအတွင်းသို့ လူကိုယ်တိုင် ဝင်ရောက်ပြင်ဆင်ခြင်းကြောင့် Base Image နှင့် Container အကြား ကွဲပြားခြားနားသွားသော အခြေအနေ (Anti-pattern)။ |
| **Daemon** | Linux သို့မဟုတ် Unix စနစ်တွင် background ၌ အဆက်မပြတ် run နေသော service process (ဥပမာ `sshd`, `dockerd`, `systemd`)။ |
| **Declarative (IaC)** | "မည်သို့ဆောက်ရမည် (How)" ကို အဆင့်ဆင့် မရေးဘဲ "မည်သည့်အရာ လိုချင်သည် (What desired state)" ကိုသာ ကြေညာရေးသားသော ပုံစံ (ဥပမာ Terraform, K8s YAML)။ |
| **Drift Detection** | Cloud ပေါ်ရှိ အမှန်တကယ် လက်ရှိ resource များနှင့် Terraform Code အကြား ကွဲလွဲနေမှုကို ရှာဖွေစစ်ဆေးခြင်း (`terraform plan`)။ |
| **Error Budget** | စနစ်၏ SLO (Service Level Objective) ပြည့်မီရန် ခွင့်ပြုထားသော အမြင့်ဆုံး ပျက်ကျခွင့် အချိန်အပိုင်းအခြား (100% - SLO)။ |
| **Hardening** | OS သို့မဟုတ် Application တွင် မလိုအပ်သော ports, services, default passwords များကို ပိတ်ပင်ပြီး လုံခြုံရေး အဆင့်မြှင့်တင်ခြင်း။ |
| **Idempotency** | Operation တစ်ခုကို အကြိမ်ကြိမ် ထပ်မံ run စေကာမူ နောက်ဆုံးရလဒ်သည် မူလ Desired State အတိုင်း တသမတ်တည်း တည်ရှိနေခြင်း (Ansible/Terraform ၏ အဓိက အခြေခံမူ)။ |
| **Immutable Infrastructure** | ဆာဗာတစ်ခုကို တည်ဆောက်ပြီးပါက update ပြုလုပ်ရန် SSH ဝင်မပြင်ဘဲ၊ Image အသစ်ဖြင့် ဆာဗာအသစ် ဆောက်ကာ အဟောင်းကို ဖျက်ဆီးပစ်သော စနစ်။ |
| **Ingress Controller** | Kubernetes တွင် Domain Name နှင့် Path အလိုက် HTTP/HTTPS traffic များကို သက်ဆိုင်ရာ Service များဆီသို့ လမ်းကြောင်းပေးသော Layer 7 Reverse Proxy (ဥပမာ Nginx Ingress)။ |
| **MTTR (Mean Time To Resolve)** | ပြဿနာ စတင်ဖြစ်ပွားချိန်မှ စနစ် ပုံမှန် ပြန်လည်လည်ပတ်ချိန်အထိ ပျမ်းမျှ ကြာမြင့်ချိန်။ |
| **Multi-Stage Build** | Dockerfile တစ်ခုတည်းတွင် Build Stage နှင့် Production Runtime Stage ကို ခွဲခြားပြီး Image Size ကို ၉၀% ချုံ့နိုင်သော နည်းစနစ်။ |
| **Observability** | စနစ်တစ်ခု၏ ပြင်ပမှ ရရှိသော Metrics, Logs နှင့် Traces ဒေတာများကို ကြည့်ရှု၍ အတွင်းပိုင်း ကျန်းမာရေးကို တိုင်းတာနားလည်နိုင်စွမ်း။ |
| **Orchestration** | Container ရာပေါင်းများစွာ၏ Deployment, Networking, Scaling နှင့် Self-healing များကို အလိုအလျောက် ပေါင်းစပ် ထိန်းကျောင်းပေးခြင်း (ဥပမာ Kubernetes)။ |
| **Pod** | Kubernetes တွင် Deploy ပြုလုပ်နိုင်သော အသေးငယ်ဆုံးယူနစ်ဖြစ်ပြီး Network IP နှင့် Storage ကို မျှဝေသုံးစွဲသည့် Container များ စုစည်းမှု။ |
| **PromQL** | Prometheus TSDB တွင် Metrics များကို query လုပ်ရန် အသုံးပြုသော သီးသန့် Query Language။ |
| **Pull vs Push (Monitoring)** | Push သည် Target မှ Monitor သို့ data ပို့ခြင်းဖြစ်ပြီး၊ Pull သည် Prometheus ကဲ့သို့သော Monitor မှ Target များဆီမှ data လှမ်းဆွဲယူခြင်း ဖြစ်သည်။ |
| **Rate Limiting** | API သို့မဟုတ် Website သို့ တစ်စက္ကန့်အတွင်း အကြိမ်ရေ ကန့်သတ်ချက်ထက် ပိုမို ဝင်ရောက်လာသော requests များကို ပိတ်ပင်ခြင်း (DDoS ကာကွယ်ရန်)။ |
| **Role-Based Access Control (RBAC)** | User တစ်ဦးချင်းစီအား ပေးအပ်ထားသော Role (အခွင့်အရေး) အပေါ် မူတည်၍သာ စနစ်အတွင်း ဝင်ရောက်ခွင့် ကန့်သတ်ခြင်း။ |
| **Rolling Update** | Pods သို့မဟုတ် EC2 Instances များကို ဝန်ဆောင်မှု မပြတ်တောက်စေဘဲ အသစ်တစ်လုံးချင်း စတင်ကာ အဟောင်းတစ်လုံးချင်း အစားထိုး လဲလှယ်ပေးသော စနစ်။ |
| **Root Cause Analysis (RCA)** | ပြဿနာတစ်ခု၏ မျက်နှာပြင် လက္ခဏာကိုသာ ယာယီမပြင်ဘဲ အရင်းအမြစ် အစစ်အမှန် (Root Cause) ကို 5 Whys ဖြင့် ရှာဖွေဖော်ထုတ်ခြင်း။ |
| **Runbook** | စနစ် ချို့ယွင်းမှု ဖြစ်ပေါ်လာပါက On-call engineer များ ချက်ချင်း ဖတ်ရှုဖြေရှင်းနိုင်ရန် ရေးသားထားသော အဆင့်ဆင့် လမ်းညွှန်ချက် (SOP)။ |
| **SAST (Static Application Security Testing)** | Code မ run မီ Source Code ဖိုင်များကို scan ဖတ်၍ လုံခြုံရေး အားနည်းချက် ရှာဖွေခြင်း။ |
| **Self-Healing** | Container သို့မဟုတ် Pod ပျက်ကျသွားပါက လူမပါဘဲ စနစ်မှ အလိုအလျောက် restart ပြုလုပ်ခြင်း သို့မဟုတ် အသစ်ပြန်အစားထိုးပေးခြင်း။ |
| **Shift-Left Security** | လုံခြုံရေး စစ်ဆေးမှုများကို နောက်ဆုံးမှ မဟုတ်ဘဲ Developer Code ရေးသည့် အစောဆုံး အဆင့်ဆီသို့ ရှေ့တန်းတင် ထည့်သွင်းခြင်း။ |
| **SLI / SLO / SLA** | SLI သည် လက်ရှိ ရလဒ်၊ SLO သည် အဖွဲ့၏ ပစ်မှတ်၊ SLA သည် Customer နှင့် တရားဝင် စာချုပ်။ |
| **State File (Terraform)** | Terraform ဖြင့် ဆောက်လုပ်ထားသော Cloud Resources များ၏ လက်ရှိ မြေပုံနှင့် Metadata များကို မှတ်တမ်းတင်ထားသော ဖိုင် (`terraform.tfstate`)။ |
| **Toil** | တန်ဖိုး မတိုးစေဘဲ လက်ဖြင့် ထပ်ခါတလဲလဲ လုပ်ဆောင်နေရသော စက်ဆန်သည့် operational tasks များ။ |
| **Zero-Downtime Deployment** | Application version အသစ်သို့ ပြောင်းလဲရာတွင် သုံးစွဲသူများဘက်မှ တစ်စက္ကန့်မျှ downtime မရှိစေဘဲ update ပြုလုပ်ပေးနိုင်ခြင်း။ |
