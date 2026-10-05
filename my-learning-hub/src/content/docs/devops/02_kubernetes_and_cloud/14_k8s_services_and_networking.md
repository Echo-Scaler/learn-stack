---
title: "14. K8s Services And Networking"
description: "1. [ပြဿနာ - Pod IP များ အမြဲတမ်း ပြောင်းလဲနေခြင်း (Dynamic Pod IP Problem)](#၁-ပြဿနာ---pod-ip-များ-အမြဲတမ်း-ပြောင်းလဲနေခြင်း)"
---

## ☸️ သင်ခန်းစာ (၁၄) - Kubernetes Services နှင့် Networking
### (Lesson 14: Dynamic Pod IPs, Service Types, Endpoints & CoreDNS Discovery)

---

## 📌 မာတိကာ (Contents)
1. [ပြဿနာ - Pod IP များ အမြဲတမ်း ပြောင်းလဲနေခြင်း (Dynamic Pod IP Problem)](#၁-ပြဿနာ---pod-ip-များ-အမြဲတမ်း-ပြောင်းလဲနေခြင်း)
2. [Kubernetes Service ဆိုတာဘာလဲ? (တည်ငြိမ်သော Virtual IP နှင့် Load Balancer)](#၂-kubernetes-service-ဆိုတာဘာလဲ)
3. [Service နှင့် Pods ချိတ်ဆက်ပုံ (Labels, Selectors နှင့် Endpoints)](#၃-service-နှင့်-pods-ချိတ်ဆက်ပုံ)
4. [Kubernetes Service အမျိုးအစား ၄ မျိုး](#၄-kubernetes-service-အမျိုးအစား-၄-မျိုး)
   - [၄.၁။ `ClusterIP` (Default - Cluster အတွင်းပိုင်း သီးသန့်သုံးရန်)](#၄၁-clusterip)
   - [၄.၂။ `NodePort` (Node များ၏ Physical Port ဖွင့်လှစ်ခြင်း)](#၄၂-nodeport)
   - [၄.၃။ `LoadBalancer` (Cloud Provider များ၏ External IP ရယူခြင်း)](#၄၃-loadbalancer)
   - [၄.၄။ `ExternalName` (ပြင်ပ ဒိုမိန်းများသို့ လမ်းလွှဲပေးခြင်း)](#၄၄-externalname)
5. [CoreDNS Service Discovery စနစ် (DNS ဖြင့် ခေါ်ဆိုနည်း)](#၅-coredns-service-discovery-စနစ်)
6. [လက်တွေ့ YAML Manifest ရေးဆွဲခြင်းနှင့် စမ်းသပ်ခြင်း](#၆-လက်တွေ့-yaml-manifest)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ ပြဿနာ - Pod IP များ အမြဲတမ်း ပြောင်းလဲနေခြင်း

Kubernetes တွင် Pod များသည် အချိန်မရွေး သေဆုံးသွားနိုင်ပြီး အသစ်ပြန်လည် မွေးဖွားလာနိုင်ပါသည်။

အသစ်မွေးဖွားလာသော Pod တိုင်းသည် **IP Address အသစ်** ရရှိသွားသည် (ဥပမာ- ယခင် Pod IP သည် `10.244.1.25` ဖြစ်ပြီး အသစ်တက်လာသော Pod IP သည် `10.244.2.80` ဖြစ်သွားနိုင်သည်)။

အကယ်၍ Frontend သည် Backend ၏ IP ကို တိုက်ရိုက်ခေါ်ထားပါက Backend Pod Restart ကျသွားသည်နှင့် စနစ်တစ်ခုလုံး ချိတ်ဆက်မှု ပျက်စီးသွားမည် ဖြစ်သည်။

---

## ၂။ Kubernetes Service ဆိုတာဘာလဲ?

**Kubernetes Service** ဆိုသည်မှာ Pod များစွာ၏ ရှေ့တွင် တည်ငြိမ်သော **တစ်ခုတည်းသော Virtual IP (Static IP)** နှင့် **DNS Name** ကို ဖန်တီးပေးပြီး၊ ဝင်လာသမျှ Traffic များကို နောက်ကွယ်ရှိ ကျန်းမာသော Pod များဆီသို့ မျှဝေပို့ဆောင်ပေးသည့် **Built-in Layer 4 Load Balancer** ဖြစ်ပါသည်။

```
                                [ CLIENT / BROWSER ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          KUBERNETES SERVICE           │
                     │  Virtual IP: 10.96.0.100              │
                     │  DNS Name: my-backend-service         │
                     └───────────────────┬───────────────────┘
                                         │ Built-in Load Balancing
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
          ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
          │    Pod 1    │         │    Pod 2    │         │    Pod 3    │
          │ 10.244.1.12 │         │ 10.244.2.45 │         │ 10.244.1.99 │
          └─────────────┘         └─────────────┘         └─────────────┘
```

Service ရှိနေသရွေ့ Pod များ ဘယ်နှစ်ကြိမ် သေဆုံးပြီး IP ဘယ်လိုပင် ပြောင်းစေကာမူ Client သည် Service Virtual IP (သို့မဟုတ် DNS Name) ကိုသာ ခေါ်ဆိုရသဖြင့် မည်သည့်အခါမျှ အဆက်အသွယ် မပြတ်တောက်တော့ပါ။

---

## ၃။ Service နှင့် Pods ချိတ်ဆက်ပုံ

Service သည် မည်သည့် Pod များကို Traffic ပို့ရမည်ကို **Labels & Selectors** ဖြင့် ဆုံးဖြတ်ပါသည်:

1. Deployment ထဲရှိ Pod တွင် label တပ်ထားသည်: `app: web-api`
2. Service ထဲတွင် selector သတ်မှတ်သည်: `selector: app: web-api`
3. Kubernetes သည် အဆိုပါ Label နှင့် ကိုက်ညီသော Pod IPs များကို **`Endpoints` (သို့မဟုတ် `EndpointSlice`)** အဖြစ် စုစည်းထားပြီး အလိုအလျောက် Traffic မျှဝေပေးသည်။

---

## ၄။ Kubernetes Service အမျိုးအစား ၄ မျိုး

### ၄.၁။ `ClusterIP` (Default)
* Cluster အတွင်းပိုင်းတွင်သာ အလုပ်လုပ်သော Private Virtual IP ရရှိသည်။
* အင်တာနက် ပြင်ပမှ တိုက်ရိုက် ဝင်ရောက်၍ မရပါ။
* **အသုံးပြုသည့် နေရာ**: Database (MySQL/PostgreSQL), Redis, Backend Microservices များ။

### ၄.၂။ `NodePort`
* Worker Node အားလုံး၏ တကယ့် Physical IP ပေါ်တွင် Port တစ်ခု (ပုံမှန်အားဖြင့် `30000` မှ `32767` ကြား) ကို ဖွင့်လှစ်ပေးသည်။
* ဥပမာ - `http://<Node_IP>:30080` ဖြင့် ပြင်ပမှ လှမ်းခေါ်နိုင်သည်။
* **အသုံးပြုသည့် နေရာ**: On-Premise သို့မဟုတ် စမ်းသပ်စစ်ဆေးမှုများ။

### ၄.၃။ `LoadBalancer`
* AWS, Google Cloud (GCP) သို့မဟုတ် Azure ကဲ့သို့ Cloud များတွင် သုံးသည့်အခါ Cloud Provider ထံမှ **တကယ့် Public Static IP** ပါဝင်သော Network Load Balancer (NLB/ALB) ကို အလိုအလျောက် ဝယ်ယူချိတ်ဆက်ပေးသည်။
* **အသုံးပြုသည့် နေရာ**: Production Internet Facing Web Applications များ။

### ၄.၄။ `ExternalName`
* Cluster အတွင်းရှိ Pod များကို ပြင်ပ Domain (ဥပမာ- `my-rds-db.aws.com`) ဆီသို့ CNAME DNS Record ဖြင့် လမ်းလွှဲပေးခြင်း။

---

## ၅။ CoreDNS Service Discovery စနစ်

Kubernetes တွင် **CoreDNS** အသင့်ပါဝင်ပြီး Pod များသည် အခြား Service များကို အောက်ပါ စံသတ်မှတ်ချက် FQDN (Fully Qualified Domain Name) ဖြင့် လှမ်းခေါ်နိုင်ပါသည်:

```
<service-name>.<namespace>.svc.cluster.local
```

* **Namespace တူပါက**: Service Name တစ်ခုတည်းဖြင့် တိုက်ရိုက် ခေါ်ဆိုနိုင်သည် (ဥပမာ- `curl http://backend-service:8080`)။
* **Namespace မတူပါက**: `curl http://backend-service.production.svc.cluster.local:8080`

---

## ၆။ လက်တွေ့ YAML Manifest ရေးဆွဲခြင်း

`services-demo.yaml`:

```yaml
# ၁။ Backend Database အတွက် ClusterIP Service
apiVersion: v1
kind: Service
metadata:
  name: mysql-internal-service
spec:
  type: ClusterIP
  selector:
    app: mysql-db
  ports:
    - protocol: TCP
      port: 3306        # Service Virtual Port
      targetPort: 3306  # Container ၏ Port

---
# ၂။ Web Frontend အတွက် LoadBalancer Service
apiVersion: v1
kind: Service
metadata:
  name: frontend-public-service
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - protocol: TCP
      port: 80         # Public Port
      targetPort: 80   # Container Nginx Port
```

### Apply ပြုလုပ်ပြီး စစ်ဆေးခြင်း:
```bash
kubectl apply -f services-demo.yaml

# Services စာရင်းကြည့်ခြင်း
kubectl get services

# Endpoints (Pods IP များ ချိတ်မိခြင်း ရှိ/မရှိ) စစ်ဆေးခြင်း
kubectl get endpoints
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လိုအပ်ချက် (Requirement) | အသုံးပြုရမည့် Service Type |
| :--- | :--- |
| **Database / Cache (အတွင်းပိုင်းသာ ဆက်သွယ်ရန်)** | `ClusterIP` |
| **Local / Bare-metal Node ပေါ်တွင် Port ဖွင့်ရန်** | `NodePort` |
| **AWS / GCP Cloud ပေါ်တွင် Public IP ရယူရန်** | `LoadBalancer` |
| **Cluster ပြင်ပရှိ Third-Party API သို့ လမ်းလွှဲရန်** | `ExternalName` |

သို့သော် Service တစ်ခုချင်းစီအတွက် LoadBalancer တစ်လုံးစီ ဆွဲယူသုံးစွဲပါက Cloud ကုန်ကျစရိတ် အလွန်ကြီးမားသွားပါမည်။

ထို့ကြောင့် နောက်သင်ခန်းစာ [15_ingress_controllers_and_routing.md](/devops/02_kubernetes_and_cloud/15_ingress_controllers_and_routing/) တွင် LoadBalancer တစ်လုံးတည်းဖြင့် Domain ပေါင်းများစွာနှင့် HTTPS/SSL ကို စီမံနိုင်သော Ingress Controllers အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
