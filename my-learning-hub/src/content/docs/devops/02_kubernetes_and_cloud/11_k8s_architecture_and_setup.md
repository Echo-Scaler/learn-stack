---
title: "11. K8s Architecture And Setup"
description: "1. [Kubernetes Architecture အလုပ်လုပ်ပုံ Diagram](#၁-kubernetes-architecture-အလုပ်လုပ်ပုံ-diagram)"
---

## ☸️ သင်ခန်းစာ (၁၁) - Kubernetes Architecture နှင့် Cluster စတင်တပ်ဆင်ခြင်း
### (Lesson 11: Control Plane, Worker Nodes Architecture, Local Cluster Setup & Kubectl)

---

## 📌 မာတိကာ (Contents)
1. [Kubernetes Architecture အလုပ်လုပ်ပုံ Diagram](#၁-kubernetes-architecture-အလုပ်လုပ်ပုံ-diagram)
2. [Control Plane (Master Node) ၏ ဦးနှောက် အစိတ်အပိုင်း ၄ ခု](#၂-control-plane-၏-အစိတ်အပိုင်း-၄-ခု)
   - [၂.၁။ `kube-apiserver` (ဗဟိုဝင်ပေါက်)](#၂၁-kube-apiserver)
   - [၂.၂။ `etcd` (Cluster ၏ သမိုင်းမှတ်တမ်း Database)](#၂၂-etcd)
   - [၂.၃။ `kube-scheduler` (နေရာချထားရေးမှူး)](#၂၃-kube-scheduler)
   - [၂.၄။ `kube-controller-manager` (အခြေအနေ ထိန်းညှိရေးမှူး)](#၂၄-kube-controller-manager)
3. [Worker Nodes (အလုပ်သမား Node) ၏ အစိတ်အပိုင်း ၃ ခု](#၃-worker-nodes-၏-အစိတ်အပိုင်း-၃-ခု)
   - [၃.၁။ `kubelet` (စက်ရုံမှူး အေးဂျင့်)](#၃၁-kubelet)
   - [၃.၂။ `kube-proxy` (ကွန်ရက် လမ်းညွှန်)](#၃၂-kube-proxy)
   - [၃.၃။ Container Runtime (containerd / CRI-O)](#၃၃-container-runtime)
4. [Local စက်တွင် K8s Cluster စတင်စမ်းသပ်ရန် ရွေးချယ်စရာများ](#၄-local-စက်တွင်-cluster-တပ်ဆင်ခြင်း)
   - [နည်းလမ်း (က): Docker Desktop Kubernetes ဖွင့်လှစ်ခြင်း (အလွယ်ဆုံး)](#နည်းလမ်း-က)
   - [နည်းလမ်း (ခ): Minikube တပ်ဆင်ခြင်း](#နည်းလမ်း-ခ)
   - [နည်းလမ်း (ဂ): Kind (Kubernetes in Docker)](#နည်းလမ်း-ဂ)
5. [`kubectl` CLI မိတ်ဆက်နှင့် အရေးကြီးဆုံး စစ်ဆေးမှု Commands များ](#၅-kubectl-cli-မိတ်ဆက်)
6. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၆-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Kubernetes Architecture အလုပ်လုပ်ပုံ Diagram

Kubernetes Cluster တစ်ခုတွင် **Control Plane (ဦးနှောက်စင်တာ)** နှင့် အမှန်တကယ် Container များကို သယ်ဆောင် Run ပေးသော **Worker Nodes (လုပ်သားဆာဗာများ)** ဟူ၍ အပိုင်း ၂ ပိုင်းဖြင့် ဖွဲ့စည်းထားပါသည်။

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CONTROL PLANE (MASTER)                          │
│                                                                        │
│   ┌───────────────────┐               ┌───────────────────┐            │
│   │   kube-scheduler  │               │ controller-mgr    │            │
│   └─────────┬─────────┘               └─────────┬─────────┘            │
│             │                                   │                      │
│             ▼                                   ▼                      │
│     ┌───────────────────────────────────────────────────┐              │
│     │               kube-apiserver                      │◄── (kubectl) │
│     └─────────────────────────┬─────────────────────────┘              │
│                               │                                        │
│                               ▼                                        │
│                     ┌───────────────────┐                              │
│                     │       etcd        │ (Cluster State Database)     │
│                     └───────────────────┘                              │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
         ┌──────────────────────┴──────────────────────┐
         ▼                                             ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│        WORKER NODE 1        │               │        WORKER NODE 2        │
│                             │               │                             │
│ ┌─────────────────────────┐ │               │ ┌─────────────────────────┐ │
│ │         kubelet         │ │               │ │         kubelet         │ │
│ └────────────┬────────────┘ │               │ └────────────┬────────────┘ │
│              ▼              │               │              ▼              │
│ ┌─────────────────────────┐ │               │ ┌─────────────────────────┐ │
│ │   Container Runtime     │ │               │ │   Container Runtime     │ │
│ │      (containerd)       │ │               │ │      (containerd)       │ │
│ ├────────────┬────────────┤ │               │ ├────────────┬────────────┤ │
│ │ [ Pod 1 ]  │ [ Pod 2 ]  │ │               │ │ [ Pod 3 ]  │ [ Pod 4 ]  │ │
│ └────────────┴────────────┘ │               │ └────────────┴────────────┘ │
│ ┌─────────────────────────┐ │               │ ┌─────────────────────────┐ │
│ │       kube-proxy        │ │               │ │       kube-proxy        │ │
│ └─────────────────────────┘ │               │ └─────────────────────────┘ │
└─────────────────────────────┘               └─────────────────────────────┘
```

---

## ၂။ Control Plane ၏ အစိတ်အပိုင်း ၄ ခု

### ၂.၁။ `kube-apiserver`
* Cluster တစ်ခုလုံး၏ ဗဟိုဝင်ပေါက် (Front door) ဖြစ်သည်။
* `kubectl` မှ ပို့လိုက်သော အမိန့်များ၊ Worker Node များမှ ပို့လိုက်သော သတင်းပို့ချက်များ အားလုံးသည် REST API မှတစ်ဆင့် `kube-apiserver` သို့သာ တိုက်ရိုက်ရောက်ရှိပြီး စစ်ဆေးအတည်ပြုသည်။

### ၂.၂။ `etcd`
* Kubernetes Cluster ၏ အချက်အလက်များအားလုံး (Pod မည်မျှ run နေသည်၊ Secret passwords များ၊ IP များ) ကို သိုလှောင်ထားသော **Distributed Key-Value Store Database** ဖြစ်သည်။
* etcd မရှိပါက Kubernetes သည် အတိတ်သမိုင်းနှင့် လက်ရှိအခြေအနေကို လုံးဝ မမှတ်မိနိုင်ပါ။

### ၂.၃။ `kube-scheduler`
* Pod အသစ်တစ်ခု run ရန် တောင်းဆိုလာသည့်အခါ မည်သည့် Worker Node တွင် CPU/RAM လွတ်နေသနည်း၊ မည်သည့် Node က သင့်တော်သနည်းဟု တွက်ချက်ဆုံးဖြတ်ပေးသည့် အရာရှိ ဖြစ်သည်။

### ၂.၄။ `kube-controller-manager`
* Desired State (လိုချင်သော အခြေအနေ) နှင့် Actual State (လက်ရှိ အခြေအနေ) ကို အမြဲတမ်း စောင့်ကြည့်ချိန်ညှိနေသော ဦးနှောက် ဖြစ်သည်။ (ဥပမာ- Node ပျက်သွားလျှင် Pod အသစ် ပြန်ထူပေးခြင်း)။

---

## ၃။ Worker Nodes ၏ အစိတ်အပိုင်း ၃ ခု

### ၃.၁။ `kubelet`
* Worker Node တိုင်းပေါ်တွင် အမြဲ Run နေသော Agent ဖြစ်သည်။ API Server ၏ အမိန့်ကို နားထောင်ပြီး Container များကို အမှန်တကယ် Run ပေးခြင်း၊ Pod ကျန်းမာရေးကို API Server သို့ ပြန်လည်သတင်းပို့ပေးခြင်း ပြုလုပ်သည်။

### ၃.၂။ `kube-proxy`
* Node ပေါ်ရှိ Network Routing နှင့် Port Forwarding များကို Linux iptables / IPVS စနစ်များ သုံး၍ စီမံပေးသော Network Proxy ဖြစ်သည်။

### ၃.၃။ Container Runtime
* Container များကို စတင် run ပေးသော အောက်ခံ Engine ဖြစ်သည်။ ခေတ်သစ် K8s တွင် Docker အစား ပိုမိုပေါ့ပါးသော **containerd** သို့မဟုတ် **CRI-O** ကို စံအဖြစ် သုံးစွဲပါသည်။

---

## ၄။ Local စက်တွင် Cluster တပ်ဆင်ခြင်း

### နည်းလမ်း (က): Docker Desktop Kubernetes (အလွယ်ဆုံး)
အကယ်၍ သင့်စက်တွင် Docker Desktop သွင်းထားပြီးပါက:
1. Docker Desktop ၏ **Settings (Gear Icon)** ကို နှိပ်ပါ။
2. ဘယ်ဘက်ခြမ်းရှိ **Kubernetes** tab ကို သွားပါ။
3. **Enable Kubernetes** ကို အမှန်ခြစ်ပြီး **Apply & Restart** ကို နှိပ်ပါ (၅ မိနစ်ခန့် စောင့်ဆိုင်းပါ)။

### နည်းလမ်း (ခ): Minikube တပ်ဆင်ခြင်း
```bash
# Mac (Homebrew)
brew install minikube

# Minikube Cluster စတင်ဖွင့်လှစ်ခြင်း
minikube start --driver=docker
```

### နည်းလမ်း (ဂ): Kind (Kubernetes in Docker)
```bash
brew install kind
kind create cluster --name enterprise-cluster
```

---

## ၅။ `kubectl` CLI မိတ်ဆက်

`kubectl` (Kube Control / Kube Cuddle) သည် Kubernetes Cluster ကို ထိန်းချုပ်မောင်းနှင်ရန် အသုံးပြုသည့် CLI Tool ဖြစ်သည်။

### (က) အသုံးဝင်သော Shell Alias သတ်မှတ်ခြင်း:
`~/.zshrc` သို့မဟုတ် `~/.bashrc` တွင် ထည့်သွင်းထားပါက ရိုက်ရ အလွန်မြန်ဆန်ပါသည်:
```bash
alias k="kubectl"
```

### (ခ) Cluster ကျန်းမာရေး စစ်ဆေးခြင်း:
```bash
# Cluster Information စစ်ဆေးခြင်း
kubectl cluster-info

# Cluster အတွင်းရှိ Nodes (ဆာဗာများ) စာရင်းကြည့်ခြင်း
kubectl get nodes
```
*(Node Status သည် `Ready` ဟု ပြသနေပါက Cluster စတင် အသုံးပြုနိုင်ပြီ ဖြစ်သည်)*

### (ဂ) Namespaces များ ကြည့်ခြင်း:
```bash
kubectl get namespaces
```
Default အားဖြင့် `default`, `kube-system`, `kube-public`, `kube-node-lease` ဟူ၍ တွေ့ရမည်။

---

## ၆။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အစိတ်အပိုင်း | ရာထူး / တာဝန် |
| :--- | :--- |
| **`kube-apiserver`** | အားလုံး ဆက်သွယ်ရသော ဗဟိုအချက်အချာ REST API |
| **`etcd`** | Cluster အချက်အလက်များ သိမ်းဆည်းရာ ဦးနှောက်မှတ်ဉာဏ် DB |
| **`kube-scheduler`** | Pod ကို မည်သည့် Node တွင် တင်ရမည်ကို ဆုံးဖြတ်သူ |
| **`kubelet`** | Node ပေါ်တွင် Container များ အမှန်တကယ် Run ပေးသူ |
| **`kubectl`** | Developer များ Cluster အား ခိုင်းစေရန် သုံးသော CLI |

နောက်သင်ခန်းစာ [12_pods_and_declarative_yaml.md](/devops/02_kubernetes_and_cloud/12_pods_and_declarative_yaml/) တွင် Kubernetes ၏ အခြေခံအကျဆုံး အယူအဆဖြစ်သော Pods များနှင့် YAML Manifest ရေးသားပုံကို လေ့လာပါမည်။
