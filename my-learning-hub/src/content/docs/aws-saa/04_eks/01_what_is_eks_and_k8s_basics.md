---
title: "၁။ EKS ဆိုတာဘာလဲ & Kubernetes အခြေခံ"
description: "Amazon EKS ၏ အခြေခံသဘောတရား၊ Kubernetes vs EKS vs ECS၊ Cluster၊ Pods၊ Deployments၊ Services၊ ReplicaSets နှင့် Namespaces ရှင်းလင်းချက်"
---

# ၁။ EKS ဆိုတာဘာလဲ & Kubernetes အခြေခံ

## Amazon EKS (Elastic Kubernetes Service) ဆိုတာဘာလဲ?

**Amazon EKS** သည် Google မှ စတင်တီထွင်ခဲ့သော ကမ္ဘာ့အသုံးအများဆုံး Open-source Container Orchestration စနစ်ဖြစ်သည့် **Kubernetes (K8s)** ကို AWS Cloud ပေါ်တွင် လွယ်ကူလုံခြုံစွာ မောင်းနှင်နိုင်စေသော Managed Service ဖြစ်ပါသည်။

သမားရိုးကျ On-Premises သို့မဟုတ် ကိုယ်ပိုင် EC2 များပေါ်တွင် Kubernetes တည်ဆောက်မည်ဆိုပါက:
- Master Nodes (Control Plane - etcd, kube-apiserver, kube-scheduler, kube-controller-manager) များကို Multi-AZ ဖြင့် တည်ဆောက်ခြင်း၊
- etcd Database ကို Backup ပုံမှန်ယူခြင်း၊
- Kubernetes Version အသစ်ထွက်တိုင်း Upgrade ပြုလုပ်ခြင်း စသည့် အလွန်ခက်ခဲရှုပ်ထွေးသော အလုပ်များကို အင်ဂျင်နီယာများ ကိုယ်တိုင် လုပ်ဆောင်ရပါသည်။

**Amazon EKS တွင်မူ:** AWS က Control Plane တစ်ခုလုံးကို Multi-AZ (Availability Zones အနည်းဆုံး ၃ ခု) တွင် 99.95% Uptime SLA အာမခံဖြင့် အလိုအလျောက် တာဝန်ယူ စီမံပေးပါသည်။ သင်သည် Worker Nodes များနှင့် မိမိ Application Pods များအပေါ်တွင်သာ အာရုံစိုက်ရန် လိုအပ်ပါသည်။

---

## Kubernetes vs EKS vs ECS vs Docker vs Fargate နှိုင်းယှဉ်ချက်

ဤ ဝေါဟာရ ၅ ခု၏ ကွာခြားချက်ကို သဲကွဲစွာ သိရှိထားရန် အလွန်အရေးကြီးပါသည်:

| နာမည် | အမျိုးအစား | အဓိက အခန်းကဏ္ဍ |
| :--- | :--- | :--- |
| **Docker** | Container Engine | Application များကို Container Image အဖြစ် ထုပ်ပိုးတည်ဆောက်ပေးသော ကိရိယာ |
| **Kubernetes (K8s)**| Open-source Orchestrator | Containers ရာနှင့်ချီကို Server အများအပြားပေါ်တွင် Auto-scale, Self-heal, Deploy လုပ်ပေးသော စံစနစ် |
| **Amazon EKS** | Managed K8s Service | Kubernetes Control Plane ကို AWS က တာဝန်ယူ စီမံခန့်ခွဲပေးသော ဝန်ဆောင်မှု |
| **Amazon ECS** | AWS-Native Orchestrator | Kubernetes မဟုတ်ဘဲ AWS ၏ ကိုယ်ပိုင် ရိုးရှင်းလွယ်ကူသော Container Orchestration စနစ် |
| **AWS Fargate** | Serverless Compute Engine | EC2 Server တပ်ဆင်စရာမလိုဘဲ ECS Tasks သို့မဟုတ် EKS Pods များကို Serverless အဖြစ် တိုက်ရိုက် မောင်းနှင်ပေးသည့် စနစ် |

---

## Kubernetes Fundamentals (အခြေခံ အစိတ်အပိုင်း ၁၀ ခု)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                              │
│                                                                        │
│  [ Control Plane (AWS Managed) ]                                       │
│  • kube-apiserver • etcd • kube-scheduler • kube-controller-manager    │
│                                                                        │
│  [ Worker Nodes (EC2 / Fargate) ]                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Node 1 (EC2)                     Node 2 (EC2)                    │  │
│  │ ┌─────────────────────────────┐  ┌─────────────────────────────┐ │  │
│  │ │ Pod A (Laravel API)         │  │ Pod B (Laravel API)         │ │  │
│  │ │ [Container 1] [Container 2] │  │ [Container 1] [Container 2] │ │  │
│  │ └─────────────────────────────┘  └─────────────────────────────┘ │  │
│  │         ▲                                    ▲                   │  │
│  │         └─────────────────┬──────────────────┘                   │  │
│  │                           │                                      │  │
│  │              [ Service (ClusterIP / ALB) ]                       │  │
│  │                           ▲                                      │  │
│  │                           │                                      │  │
│  │                 [ Deployment / ReplicaSet ]                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Pod (အခြေခံအကျဆုံး အစိတ်အပိုင်း):** Kubernetes တွင် Container ကို တိုက်ရိုက် run ခြင်း မဟုတ်ဘဲ **Pod** ဟုခေါ်သော အိမ်ငယ်လေးအတွင်း ထည့်သွင်း run ပါသည်။ Pod တစ်ခုအတွင်း Container တစ်ခု သို့မဟုတ် နှစ်ခု (Sidecar pattern) မျှဝေ တွဲဖက် run နိုင်သည်။
2. **Deployment:** Pod များကို တိုက်ရိုက် create မလုပ်ဘဲ Deployment Object ဖြင့် စီမံသည်။ Deployment က Version အသစ်များကို Zero-Downtime Rolling Update ပြုလုပ်ပေးပြီး မလိုလားအပ်သော အခြေအနေတွင် Rollback ပြန်ဆင်းပေးသည်။
3. **ReplicaSet:** Deployment ၏ နောက်ကွယ်တွင် ရှိပြီး သတ်မှတ်ထားသော Pod အရေအတွက် (ဥပမာ- Replicas: 3) အမြဲတမ်း run နေစေရန် ထိန်းသိမ်းပေးသည်။
4. **Service:** Pod များသည် သေဆုံးပြီး အသစ်ပြန်ဖြစ်တတ်သဖြင့် IP အမြဲပြောင်းသည်။ **Service** သည် တည်ငြိမ်သော Virtual IP နှင့် DNS Name ကို ပေးအပ်ပြီး Pod များဆီသို့ Traffic Load Balancing လုပ်ပေးသည်။
5. **Ingress:** ပြင်ပ အင်တာနက်မှ HTTP/HTTPS Traffic များကို Path-based (`/api`, `/web`) ဖြင့် မတူညီသော Services များဆီသို့ လမ်းကြောင်းပေးသည့် Application Gateway ဖြစ်သည်။ (AWS တွင် AWS Load Balancer Controller ဖြင့် ALB သို့ ချိတ်ဆက်သည်)။
6. **Namespace:** Cluster တစ်ခုတည်းအတွင်း `development`, `staging`, `production` စသဖြင့် Environment များကို Virtual ပိုင်းခြားပေးခြင်း။
7. **ConfigMap & Secret:** Application ၏ Environment Variables များနှင့် လျှို့ဝှက် Passwords များကို Code နှင့် ခွဲခြားသိမ်းဆည်းရာနေရာ။
