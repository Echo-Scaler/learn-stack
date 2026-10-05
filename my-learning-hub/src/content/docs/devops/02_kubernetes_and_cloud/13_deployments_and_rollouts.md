---
title: "13. Deployments And Rollouts"
description: "1. [Deployment ဆိုတာဘာလဲ? ရိုးရိုး Pod နှင့် ဘာကွာသလဲ?](#၁-deployment-ဆိုတာဘာလဲ)"
---

## ☸️ သင်ခန်းစာ (၁၃) - Deployments, ReplicaSets နှင့် Zero-Downtime Rollouts
### (Lesson 13: Kubernetes Deployments, Rolling Updates, Rollbacks & Scaling Strategies)

---

## 📌 မာတိကာ (Contents)
1. [Deployment ဆိုတာဘာလဲ? ရိုးရိုး Pod နှင့် ဘာကွာသလဲ?](#၁-deployment-ဆိုတာဘာလဲ)
2. [Deployment, ReplicaSet နှင့် Pods ဆက်သွယ်မှု ပုံကြမ်း Diagram](#၂-deployment-replicaset-နှင့်-pods-ဆက်သွယ်မှု)
3. [Production Deployment YAML Manifest ရေးဆွဲခြင်း](#၃-production-deployment-yaml-manifest)
4. [Zero-Downtime Rolling Update အလုပ်လုပ်ပုံ (စက္ကန့်ပိုင်းမျှ Downtime မရှိဘဲ ဗားရှင်းသစ်တင်ခြင်း)](#၄-zero-downtime-rolling-update)
5. [ဗားရှင်းဟောင်းသို့ ပြန်ဆုတ်ခွာခြင်း (Instant Rollback)](#၅-ဗားရှင်းဟောင်းသို့-ပြန်ဆုတ်ခွာခြင်း)
6. [Scaling Workloads (Manual Scaling & Horizontal Pod Autoscaler - HPA)](#၆-scaling-workloads)
7. [အခြား Kubernetes Workloads များနှင့် နှိုင်းယှဉ်ချက် (StatefulSet, DaemonSet, Job)](#၇-အခြား-kubernetes-workloads-များနှင့်-နှိုင်းယှဉ်ချက်)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Deployment ဆိုတာဘာလဲ?

ယခင်သင်ခန်းစာတွင် လေ့လာခဲ့သော ရိုးရိုး Pod သည် Crash ဖြစ်သွားပါက သို့မဟုတ် Node ပျက်သွားပါက အသစ်ပြန်လည် အစားထိုးပေးနိုင်စွမ်း မရှိပါ။

**Deployment** ဆိုသည်မှာ:
1. သင်လိုချင်သော Pod အရေအတွက် (ဥပမာ- ၃ လုံး သို့မဟုတ် ၅ လုံး) ကို အချိန်ပြည့် တပြိုင်နက် Run နေစေရန် အာမခံပေးသည့် အထက်တန်း Controller ဖြစ်သည်။
2. Pod တစ်လုံး သေဆုံးသွားပါက **တစ်စက္ကန့်အတွင်း အသစ်ချက်ချင်း မွေးဖွားပေးသည် (Self-Healing)**။
3. Application ဗားရှင်းအသစ် တင်သည့်အခါ အသုံးပြုသူများ Website မပြတ်တောက်စေဘဲ **သုည Downtime ဖြင့် တစ်လုံးချင်း လဲလှယ်ပေးနိုင်သည် (Zero-Downtime Rolling Update)**။

---

## ၂။ Deployment, ReplicaSet နှင့် Pods ဆက်သွယ်မှု

Kubernetes တွင် အောက်ပါ Hierarchy အဆင့် ၃ ဆင့်ဖြင့် အလုပ်လုပ်သည်:

```
┌────────────────────────────────────────────────────────┐
│                   DEPLOYMENT (v1)                      │
│   (ဗားရှင်းသစ်တင်ခြင်းနှင့် Rollback သမိုင်းမှတ်တမ်းကို စီမံသည်)  │
└──────────────────────────┬─────────────────────────────┘
                           │ Creates & Manages
                           ▼
┌────────────────────────────────────────────────────────┐
│                   REPLICASET (v1)                      │
│   (Pod အရေအတွက် ၃ လုံး အတိအကျ ပြည့်စေရန် ထိန်းသိမ်းပေးသည်)    │
└──────────────┬───────────┼───────────┬─────────────────┘
               │           │           │
               ▼           ▼           ▼
          ┌─────────┐ ┌─────────┐ ┌─────────┐
          │  Pod 1  │ │  Pod 2  │ │  Pod 3  │
          └─────────┘ └─────────┘ └─────────┘
```

---

## ၃။ Production Deployment YAML Manifest

`app-deployment.yaml` အမည်ဖြင့် ဖိုင်ရေးသားပါ:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-web-app
  labels:
    app: web-app
spec:
  replicas: 3 # Pod ၃ လုံး အမြဲတမ်း run နေစေရန် သတ်မှတ်ခြင်း
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Update လုပ်စဉ် သတ်မှတ်ထားသည်ထက် အပို run ခွင့်ပြုသည့် Pod အရေအတွက်
      maxUnavailable: 0  # Update လုပ်နေစဉ် မည်သည့် Pod ကိုမျှ Down ခွင့် မပြုပါ
  selector:
    matchLabels:
      app: web-app       # ဤ label ရှိသော Pod များကိုသာ Deployment က ထိန်းချုပ်မည်
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web-container
          image: nginx:1.24-alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "250m"
              memory: "256Mi"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 2
            periodSeconds: 5
```

### Apply ပြုလုပ်ပြီး Pod များ စစ်ဆေးခြင်း:
```bash
kubectl apply -f app-deployment.yaml
kubectl get deployments
kubectl get pods
```
Pod ၃ လုံး တစ်ပြိုင်နက် `Running` ဖြစ်နေသည်ကို တွေ့ရမည်။

---

## ၄။ Zero-Downtime Rolling Update အလုပ်လုပ်ပုံ

Application ကို `nginx:1.24-alpine` မှ `nginx:1.25-alpine` သို့ ဗားရှင်းမြှင့်တင်လိုပါက:

```
[ ROLLING UPDATE လုပ်ဆောင်နေပုံ ]
Step 1: Pod အသစ် (v2) ၁ လုံး စတင်မွေးဖွားသည်  ──►  (v2 Ready ဖြစ်သွားသည်)
Step 2: Pod အဟောင်း (v1) ၁ လုံးကို ဖျက်ပစ်သည်
Step 3: နောက်ထပ် Pod အသစ် (v2) ၁ လုံး မွေးဖွားသည်  ──►  (v2 Ready ဖြစ်သည်)
Step 4: Pod အဟောင်း (v1) ၁ လုံးကို ထပ်ဖျက်သည်
...
အဆုံးတွင် Pod အသစ် (v2) ၃ လုံး အပြည့်ဖြစ်သွားပြီး User ဘက်မှ စက္ကန့်ပိုင်းမျှ ချိတ်ဆက်မှု မပြတ်တောက်ပါ!
```

### CLI မှတစ်ဆင့် ဗားရှင်း အသစ်တင်ခြင်း:
```bash
kubectl set image deployment/enterprise-web-app web-container=nginx:1.25-alpine --record
```

### Update ပြုလုပ်နေသော အခြေအနေကို စောင့်ကြည့်ခြင်း:
```bash
kubectl rollout status deployment/enterprise-web-app
```

---

## ၅။ ဗားရှင်းဟောင်းသို့ ပြန်ဆုတ်ခွာခြင်း (Instant Rollback)

အကယ်၍ ဗားရှင်းအသစ်တွင် Bug ပါလာပြီး Production တွင် ပြဿနာတက်ပါက ယခင် ဗားရှင်းဟောင်းသို့ **၁ စက္ကန့်အတွင်း** ပြန်လည် ဆုတ်ခွာနိုင်ပါသည်:

```bash
# ယခင် Version သမိုင်းကြောင်းများကို ကြည့်ခြင်း
kubectl rollout history deployment/enterprise-web-app

# ချက်ချင်း ချက်ချင်း ယခင် Version သို့ Undo လုပ်ခြင်း
kubectl rollout undo deployment/enterprise-web-app

# တိကျသော Revision နံပါတ်တစ်ခုသို့ ပြန်ဆုတ်ခွာခြင်း
kubectl rollout undo deployment/enterprise-web-app --to-revision=1
```

---

## ၆။ Scaling Workloads

### (က) Manual Scaling:
Traffic များလာပါက Pod ၃ လုံးမှ ၆ လုံးသို့ ချက်ချင်း တိုးမြှင့်ခြင်း:
```bash
kubectl scale deployment/enterprise-web-app --replicas=6
```

### (ခ) Horizontal Pod Autoscaler (HPA - Auto-Scaling):
CPU သုံးစွဲမှု ၇၀% ကျော်သွားပါက Pod အနည်းဆုံး ၃ လုံးမှ အများဆုံး ၁၀ လုံးအထိ အလိုအလျောက် တိုးစေရန် သတ်မှတ်ခြင်း:
```bash
kubectl autoscale deployment/enterprise-web-app --min=3 --max=10 --cpu-percent=70
```

---

## ၇။ အခြား Kubernetes Workloads များနှင့် နှိုင်းယှဉ်ချက်

| Workload အမျိုးအစား | ဘယ်နေရာတွင် သုံးသလဲ? | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| **`Deployment`** | Stateless Web Apps (PHP, React, Node) | Pod များကို အချိန်မရွေး ဖျက်၊ အသစ်လဲလှယ်နိုင်သော စနစ်များအတွက် |
| **`StatefulSet`** | Stateful Databases (MySQL, PostgreSQL, MongoDB) | Pod တစ်ခုချင်းစီတွင် အမြဲမပြောင်းလဲသော နာမည် (`db-0`, `db-1`) နှင့် သီးသန့် Persistent Disk ရှိရမည့် စနစ်များအတွက် |
| **`DaemonSet`** | Log & Monitoring Agents (Fluentd, Prometheus Node-Exporter) | Cluster အတွင်းရှိ **Node တိုင်းပေါ်တွင် အတိအကျ ၁ လုံးစီ မဖြစ်မနေ Run ရမည့်** စနစ်များအတွက် |
| **`Job` / `CronJob`** | Database Backup, Scheduled Tasks, Data Cleaning | အချိန်ကိုက် run ပြီးသည်နှင့် ပိတ်သွားမည့် Batch အလုပ်များအတွက် |

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | အတည်ပြုချက် |
| :--- | :---: |
| **Production Pod Deployment** | Pod ကို တိုက်ရိုက်မ run ဘဲ Deployment ဖြင့်သာ အမြဲ run သလား? | [ ] |
| **High Availability** | Replicas ကို အနည်းဆုံး ၂ လုံး သို့မဟုတ် ၃ လုံး ထားရှိသလား? | [ ] |
| **Health Probes** | `livenessProbe` နှင့် `readinessProbe` ထည့်သွင်းထားသလား? | [ ] |
| **Rolling Update Strategy** | `maxUnavailable: 0` ဖြင့် Zero-Downtime ဖြစ်အောင် စီစဉ်ထားသလား? | [ ] |

နောက်သင်ခန်းစာ [14_k8s_services_and_networking.md](/devops/02_kubernetes_and_cloud/14_k8s_services_and_networking/) တွင် Pod များ၏ ပြောင်းလဲနေသော IP များကို တည်ငြိမ်စွာ ချိတ်ဆက်ပေးမည့် Kubernetes Services အကြောင်းကို လေ့လာပါမည်။
