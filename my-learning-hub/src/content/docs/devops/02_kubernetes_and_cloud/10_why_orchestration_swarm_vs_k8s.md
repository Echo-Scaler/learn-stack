---
title: "10. Why Orchestration Swarm Vs K8s"
description: "1. [Standalone Docker & Docker Compose ၏ အကန့်အသတ်များ](#၁-standalone-docker--docker-compose-၏-အကန့်အသတ်များ)"
---

## 🐳☸️ သင်ခန်းစာ (၁၀) - Docker မှ Kubernetes သို့ ကူးပြောင်းခြင်း (Why Orchestration?)
### (Lesson 10: Limitations of Standalone Docker, Swarm vs Kubernetes & The Declarative Shift)

---

## 📌 မာတိကာ (Contents)
1. [Standalone Docker & Docker Compose ၏ အကန့်အသတ်များ](#၁-standalone-docker--docker-compose-၏-အကန့်အသတ်များ)
2. [Container Orchestration ဆိုတာဘာလဲ? (ကွန်တိန်နာ တူရိယာဝိုင်း ဦးဆောင်သူ)](#၂-container-orchestration-ဆိုတာဘာလဲ)
3. [Orchestrator တစ်ခု၏ အဓိက စွမ်းဆောင်ရည် ၅ ရပ်](#၃-orchestrator-တစ်ခု၏-အဓိက-စွမ်းဆောင်ရည်-၅-ရပ်)
4. [Docker Swarm နှင့် Kubernetes (K8s) နှိုင်းယှဉ်ချက် (K8s ဘာကြောင့် အနိုင်ရခဲ့သလဲ?)](#၄-docker-swarm-နှင့်-kubernetes-နှိုင်းယှဉ်ချက်)
5. [Mindset Shift: Imperative vs Declarative Management](#၅-mindset-shift-imperative-vs-declarative)
6. [Docker အယူအဆမှ Kubernetes အယူအဆသို့ ဘာသာပြန် မြေပုံ](#၆-docker-မှ-kubernetes-သို့-ဘာသာပြန်-မြေပုံ)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Standalone Docker & Docker Compose ၏ အကန့်အသတ်များ

ယခင်သင်ခန်းစာများတွင် သင်ယူခဲ့သော Docker နှင့် Docker Compose သည် **Single Host (Server တစ်လုံးတည်း)** ပေါ်တွင် အလွန်ကောင်းမွန်သော်လည်း တကယ့် Enterprise Production ပတ်ဝန်းကျင်တွင် အောက်ပါ ကြီးမားသော စိန်ခေါ်မှုများနှင့် ရင်ဆိုင်ရပါသည်:

```
[ SINGLE DOCKER HOST ပြဿနာ ]
┌───────────────────────────────────────────────┐
│ Server Hardware Crash! / Power Outage! 💥    │
│  ┌──────────────┐     ┌──────────────┐        │
│  │ Web App      │     │ MySQL DB     │        │
│  │ (DEAD ❌)     │     │ (DEAD ❌)     │        │
│  └──────────────┘     └──────────────┘        │
└───────────────────────────────────────────────┘
  ▲
  │ Single Point of Failure (SPOF)
  │ စနစ်တစ်ခုလုံး အပြီးတိုင် ရပ်တန့်သွားသည်!
```

1. **Single Point of Failure (SPOF)**: ထို Server ပျက်စီးသွားပါက Container အားလုံး တစ်ပြိုင်နက် ပြုတ်ကျသွားမည်။
2. **Auto-scaling မရှိခြင်း**: သီတင်းကျွတ် သို့မဟုတ် Black Friday ကဲ့သို့ Traffic အဆ ၁၀၀ တက်လာပါက Container အရေအတွက်ကို အလိုအလျောက် တိုးပေးနိုင်စွမ်း မရှိခြင်း။
3. **Cross-Server Auto-Healing မရှိခြင်း**: Server Node တစ်ခု ပျက်ကျသွားပါက အခြား ကျန်းမာသော Server ဆီသို့ Container များကို အလိုအလျောက် ရွှေ့ပြောင်း run ပေးနိုင်စွမ်း မရှိခြင်း။
4. **Complex Networking**: Server ပေါင်း ၂၀ ခန့်အနှံ့ ဖြန့်ကြက်ထားသော Container များ အချင်းချင်း ချိတ်ဆက်ရန် အလွန်ခက်ခဲခြင်း။

---

## ၂။ Container Orchestration ဆိုတာဘာလဲ?

ဂီတတီးဝိုင်းကြီးတစ်ခု (Orchestra) တွင် တယော၊ ပုလွေ၊ စန္ဒရား၊ ဒရမ် တီးခတ်သူ ရာပေါင်းများစွာကို သဟဇာတဖြစ်အောင် ဦးဆောင်ထိန်းကျောင်းပေးသည့် **Conductor (တူရိယာဝိုင်း ဦးဆောင်သူ)** လိုအပ်သကဲ့သို့ပင် —

Cloud ပေါ်ရှိ Server ပေါင်း ရာနှင့်ချီ၊ Container ပေါင်း ထောင်နှင့်ချီ လည်ပတ်နေသောအခါ ၎င်းတို့ကို အလိုအလျောက် နေရာချထားပေးခြင်း၊ ကျန်းမာရေး စောင့်ကြည့်ပေးခြင်း၊ ပျက်စီးသွားပါက အသစ်ပြန်အစားထိုးပေးခြင်း စသည်တို့ကို အလိုအလျောက် စီမံခန့်ခွဲပေးသည့် စနစ်ကို **Container Orchestration Engine** ဟု ခေါ်ပါသည်။

---

## ၃။ Orchestrator တစ်ခု၏ အဓိက စွမ်းဆောင်ရည် ၅ ရပ်

```
┌────────────────────────────────────────────────────────┐
│           KUBERNETES ORCHESTRATION ENGINE              │
├────────────────────┬───────────────────────────────────┤
│ 1. Self-Healing    │ Container သေသွားလျှင် ချက်ချင်း အသစ် Run ပေးသည်    │
├────────────────────┼───────────────────────────────────┤
│ 2. Auto-Scaling    │ CPU တက်လာလျှင် 3 pods မှ 20 pods သို့ တိုးပေးသည်   │
├────────────────────┼───────────────────────────────────┤
│ 3. Load Balancing  │ Traffic များကို Pod များဆီသို့ မျှဝေပို့ပေးသည်       │
├────────────────────┼───────────────────────────────────┤
│ 4. Zero-Downtime   │ Version အသစ်တင်သည့်အခါ တစ်လုံးချင်း Update လုပ်သည် │
├────────────────────┼───────────────────────────────────┤
│ 5. Storage / Secret│ Cloud Disk နှင့် Passwords များကို စနစ်တကျ ထိန်းသည် │
└────────────────────┴───────────────────────────────────┘
```

---

## ၄။ Docker Swarm နှင့် Kubernetes (K8s) နှိုင်းယှဉ်ချက်

Docker ကုမ္ပဏီ ကိုယ်တိုင်က **Docker Swarm** ကို ထုတ်လုပ်ခဲ့ပြီး၊ Google က **Kubernetes (K8s)** ကို Open-source အဖြစ် ထုတ်ဝေခဲ့ပါသည်။

| အချက်အလက် (Feature) | Docker Swarm | Kubernetes (K8s) |
| :--- | :--- | :--- |
| **တပ်ဆင်ရ လွယ်ကူမှု** | အလွန်လွယ်ကူသည် (`docker swarm init`) | Setup ရှုပ်ထွေးသည် (သို့သော် Managed Cloud များရှိသည်) |
| **လုပ်ဆောင်နိုင်စွမ်း** | အခြေခံ Clustering သာ ရရှိသည် | အလွန်ကျယ်ပြန့်သော Enterprise Features အပြည့်ပါဝင်သည် |
| **Auto-scaling** | မူလအားဖြင့် မပါဝင်ပါ (Manual scaling သာရ) | **Horizontal Pod Autoscaler (HPA)** အလိုအလျောက် ပါဝင်သည် |
| **Market Share & Community** | အသုံးပြုမှု နည်းပါးသွားပြီ ဖြစ်သည် | **ကမ္ဘာ့စံချိန် အဖြစ် ကမ္ဘာ့ထိပ်တန်းကုမ္ပဏီ ၉၀% ကျော် သုံးစွဲသည်** |
| **Cloud Provider Support** | Support အားနည်းသည် | AWS (EKS), Google Cloud (GKE), Azure (AKS) အားလုံး First-Class Support ပေးသည် |

---

## ၅။ Mindset Shift: Imperative vs Declarative Management

Kubernetes သို့ စတင်ကူးပြောင်းရာတွင် အဓိက အရေးကြီးဆုံး စိတ်ဓာတ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲမှာ **Imperative မှ Declarative သို့ ပြောင်းလဲခြင်း** ဖြစ်သည်:

### (က) Imperative (Docker CLI ပုံစံ - "ဘယ်လိုလုပ်ရမလဲ အမိန့်ပေးခြင်း"):
> "Docker ရေ ... Container တစ်ခု run လိုက်ပါ။ ပြီးရင် Port 80 ကို ဖွင့်ပါ။ ပြီးရင် Memory 512MB ကန့်သတ်ပါ။"  
> *(Developer က အဆင့်ဆင့် အမိန့်ပေးခိုင်းစေရသည်)*

### (ခ) Declarative (Kubernetes YAML ပုံစံ - "လိုချင်သော အခြေအနေကို ကြေညာခြင်း"):
> "Kubernetes ရေ ... ငါ့ရဲ့ Web App အတွက် ကျန်းမာတဲ့ Container **၃ လုံး အမြဲတမ်း အချိန်ပြည့် ရှိနေရမယ်** (Desired State)။ မင်း ဘယ်လိုစီမံမလဲ မင်းအပိုင်း!"  
> *(Kubernetes သည် Desired State နှင့် Actual State ကို အမြဲတမ်း ချိန်ညှိနေပြီး တစ်လုံးသေသွားပါက အလိုအလျောက် အသစ်အစားထိုးပေးသည်)*

```
[ Developer Declare: "ငါ 3 Pods လိုချင်တယ်" ]
                    │
                    ▼
       ┌────────────────────────┐
       │ Kubernetes Control Loop│ ◄── Actual State (လက်ရှိ ၂ လုံးသာရှိနေသည်)
       └────────────┬───────────┘
                    │ ချိန်ညှိခြင်း (Reconcile)
                    ▼
       [ Pod အသစ် ၁ လုံး အလိုအလျောက် မွေးဖွားပေးသည် ]
                    │
                    ▼
       [ Desired State = Actual State (၃ လုံး ပြည့်သွားသည် ✅) ]
```

---

## ၆။ Docker အယူအဆမှ Kubernetes အယူအဆသို့ ဘာသာပြန် မြေပုံ

သင်၏ Docker အသိပညာများသည် Kubernetes တွင် လုံးဝ အသုံးဝင်ပါသည်:

| Docker Concept | Kubernetes Equivalents | အဓိပ္ပာယ် |
| :--- | :--- | :--- |
| **Docker Image** | **Container Image** | Application Blueprint (ပြောင်းလဲမှုမရှိ) |
| **Docker Container** | **Pod** (သို့မဟုတ် Pod အတွင်းရှိ Container) | K8s တွင် Container တစ်ခုချင်းစီကို တိုက်ရိုက်မကိုင်တွယ်ဘဲ Pod ထဲထည့်သွင်းသည် |
| **`docker run`** | **Pod / Job** | တစ်ကြိမ် run သော workload |
| **`docker-compose` service** | **Deployment** | ကွန်တိန်နာ အမြောက်အမြား အမြဲ run နေစေရန် ထိန်းကျောင်းသည့် Controller |
| **Port Mapping (`-p 80:80`)** | **Service (ClusterIP, NodePort, LoadBalancer)** | Pod များဆီသို့ Traffic လမ်းကြောင်းလွှဲပေးသည့် ကွန်ရက် |
| **Named Volumes (`-v`)** | **PersistentVolumeClaim (PVC)** | K8s ရှိ Data မပျောက်ပျက်အောင် သိမ်းသော Storage |
| **`.env` Variables** | **ConfigMap & Secret** | Environment variable များနှင့် လျှို့ဝှက်ကုဒ်များ |
| **Nginx Reverse Proxy** | **Ingress Controller** | ဒိုမိန်းအမည်ဖြင့် ခွဲခြားပေးသော Traffic Router |

---

---

## ၇။ လုပ်ငန်းခွင် Real-World Case Study (ကုမ္ပဏီတစ်ခု Swarm မှ K8s သို့ ကူးပြောင်းပုံ)

### 📌 ဖြစ်ရပ်မှန် ဇာတ်လမ်း:
> **ကုမ္ပဏီ**: အွန်လိုင်း လက်မှတ်အရောင်း Website တစ်ခု (Online Ticketing System)  
> **ယခင်အခြေအနေ (Docker Swarm)**: စတင်တည်ထောင်စဉ်က Server ၃ လုံးပေါ်တွင် Docker Swarm ဖြင့် run ထားသည်။ Setup လွယ်ကူသဖြင့် ပထမ ၆ လ အဆင်ပြေခဲ့သည်။  
> **ကြုံတွေ့ရသော ပြဿနာ**: နှစ်သစ်ကူး ဂီတဖျော်ဖြေပွဲ လက်မှတ်ရောင်းသောနေ့တွင် User ပေါင်း သိန်းနှင့်ချီ တစ်ပြိုင်နက် ဝင်ရောက်လာသည်။ Swarm တွင် Automatic Horizontal Scaling မပါဝင်သဖြင့် Developer များက Server ထဲဝင်ပြီး လက်ဖြင့် Scale လုပ်နေစဉ် Server RAM ပြည့်ကာ ထိုးကျသွားခဲ့သည်။ ထို့အပြင် Zero-Downtime Deployment ပြုလုပ်ရာတွင် Traffic ညှိရ ခက်ခဲခဲ့သည်။  
> **အဖြေ (Kubernetes သို့ ပြောင်းလဲခြင်း)**:  
> ၁။ AWS EKS (Kubernetes) သို့ ပြောင်းလိုက်ပြီး HPA (Auto-scaler) ချိန်ညှိလိုက်သည်။  
> ၂။ Traffic တက်လာသည်နှင့် Pods များကို ၃ လုံးမှ အလုံး ၅၀ အထိ စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ပွားပေးသည်။  
> ၃။ အသုံးပြုသူ နည်းသွားချိန်တွင် အလိုအလျောက် ပြန်လျှော့ပေးသဖြင့် Cloud Server စရိတ် ချွေတာနိုင်ခဲ့သည်။

### 💼 Junior / DevOps Engineer ၏ လုပ်ငန်းခွင် Task:
1. Docker Compose ဖိုင်ကို ကြည့်၍ K8s Deployment နှင့် Service YAML အဖြစ် ပြောင်းလဲရေးဆွဲခြင်း (Translation Task)။
2. Production Cluster ပေါ်သို့ မတင်မီ Local Minikube / Kind တွင် အစမ်း run စစ်ဆေးခြင်း။
3. Developer များအတွက် Zero-Downtime Deployment Command များကို Documentation ပြင်ဆင်ပေးခြင်း။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက်အလက် (Concept) | သဘောပေါက် နားလည်မှု |
| :--- | :---: |
| **Single Host Limit** | Docker Compose သည် Single Server ကန့်သတ်ချက်ရှိကြောင်း သိရှိခြင်း |
| **Orchestrator Role** | K8s သည် Self-healing, Auto-scaling, Rolling Update လုပ်ဆောင်ပေးကြောင်း နားလည်ခြင်း |
| **Declarative Paradigm** | YAML ဖြင့် "Desired State" ကို ရေးသားပြီး K8s က အလိုအလျောက် ထိန်းကြောင်းပေးခြင်း |
| **Swarm vs K8s** | Swarm သည် ရိုးရှင်းသော်လည်း Ecosystem နှင့် Auto-scaling ကြောင့် K8s က စံနှုန်းဖြစ်သွားကြောင်း သိရှိခြင်း |

နောက်သင်ခန်းစာ [11_k8s_architecture_and_setup.md](/devops/02_kubernetes_and_cloud/11_k8s_architecture_and_setup/) တွင် Kubernetes ၏ အတွင်းပိုင်း ဗိသုကာလက်ရာ (Control Plane & Worker Nodes) နှင့် Local Machine တွင် K8s Cluster စတင်တပ်ဆင်ပုံကို လေ့လာပါမည်။

