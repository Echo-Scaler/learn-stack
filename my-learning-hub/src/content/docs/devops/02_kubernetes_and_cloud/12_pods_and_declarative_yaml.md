---
title: "12. Pods And Declarative Yaml"
description: "1. [Pod ဆိုတာဘာလဲ? (ကွန်တိန်နာ အိမ်ထောင်စု)](#၁-pod-ဆိုတာဘာလဲ)"
---

## ☸️ သင်ခန်းစာ (၁၂) - Pods နှင့် Declarative YAML Manifests ရေးဆွဲနည်း
### (Lesson 12: Pod Anatomy, Multi-Container Sidecars, Init Containers & YAML Syntax)

---

## 📌 မာတိကာ (Contents)
1. [Pod ဆိုတာဘာလဲ? (ကွန်တိန်နာ အိမ်ထောင်စု)](#၁-pod-ဆိုတာဘာလဲ)
2. [Kubernetes YAML Manifest ၏ အဓိက Root Fields ၄ ခု](#၂-kubernetes-yaml-manifest-၏-အဓိက-fields)
3. [Single-Container Pod လက်တွေ့ ရေးသား Run ခြင်း](#၃-single-container-pod-လက်တွေ့-ရေးသား-run-ခြင်း)
4. [Multi-Container Pods နှင့် Sidecar Pattern](#၄-multi-container-pods-နှင့်-sidecar-pattern)
5. [Init Containers အသုံးပြုပုံ (Database Migration ကြိုတင် run ခြင်း)](#၅-init-containers-အသုံးပြုပုံ)
6. [Pod Lifecycle နှင့် Status အဓိပ္ပာယ်များ (`CrashLoopBackOff`, `Pending`)](#၆-pod-lifecycle-နှင့်-status-များ)
7. [Pods စီမံခန့်ခွဲရာတွင် အသုံးအများဆုံး `kubectl` Commands များ](#၇-pods-စီမံခန့်ခွဲသည့်-kubectl-commands)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Pod ဆိုတာဘာလဲ?

Kubernetes တွင် Container တစ်ခုချင်းစီကို တိုက်ရိုက် သီးခြား run လေ့မရှိပါ။ Container များကို **Pod** ဟုခေါ်သော အိတ်ငယ်လေးတစ်ခုအတွင်း ထည့်သွင်း၍သာ နေရာချထား (Deploy) ပြုလုပ်ပါသည်။

**Pod** သည် Kubernetes ၏ **အသေးငယ်ဆုံး အခြေခံ ယူနစ် (Smallest Deployable Unit)** ဖြစ်သည်။

```
┌────────────────────────────────────────────────────────┐
│                        POD                             │
│  IP: 10.244.1.15                                       │
│                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │  Main App Container     │  │  Sidecar Container  │  │
│  │  (Laravel / PHP-FPM)    │  │  (Log Shipper/Proxy)│  │
│  │  Port: 9000             │  │  Port: 8080         │  │
│  └───────────┬─────────────┘  └──────────┬──────────┘  │
│              │                           │             │
│              ▼                           ▼             │
│      [ Localhost Network Communication (Same IP) ]     │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Shared Storage Volume                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Pod တစ်ခုအတွင်းရှိ Containers များ၏ ထူးခြားချက်:
1. **Shared Network**: Pod အတွင်းရှိ Containers များအားလုံးသည် IP Address တစ်ခုတည်းကို မျှဝေသုံးစွဲကြပြီး `localhost` ဖြင့် အချင်းချင်း ဆက်သွယ်နိုင်သည်။
2. **Shared Storage**: Pod အတွင်း ချိတ်ဆက်ထားသော Volume ကို Container အချင်းချင်း အတူတကွ ဖတ်/ရေး ပြုလုပ်နိုင်သည်။

---

## ၂။ Kubernetes YAML Manifest ၏ အဓိက Root Fields ၄ ခု

Kubernetes သို့ မည်သည့် Resource (Pod, Deployment, Service) တင်သည်ဖြစ်စေ အောက်ပါ အဓိက အပိုင်း ၄ ပိုင်း အမြဲတမ်း ပါဝင်ရပါသည်:

1. **`apiVersion`**: အဆိုပါ Object ၏ Kubernetes API ဗားရှင်း (ဥပမာ- `v1`, `apps/v1`)။
2. **`kind`**: မည်သည့် အမျိုးအစား ဖန်တီးလိုသနည်း (ဥပမာ- `Pod`, `Deployment`, `Service`)။
3. **`metadata`**: Object ၏ အမည်၊ Namespace နှင့် ခွဲခြားရန် သတ်မှတ်သော `labels` များ။
4. **`spec` (Specification)**: အမှန်တကယ် လိုချင်သော Container အသေးစိတ် (Image, Port, Environment)။

---

## ၃။ Single-Container Pod လက်တွေ့ ရေးသား Run ခြင်း

`nginx-pod.yaml` အမည်ဖြင့် ဖိုင်အသစ်တစ်ခု ဖန်တီးပါ:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-first-pod
  labels:
    app: web-server
    environment: dev
spec:
  containers:
    - name: nginx-container
      image: nginx:alpine
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "100m"
        limits:
          memory: "128Mi"
          cpu: "250m"
```

### Cluster ထဲသို့ Apply ပြုလုပ်ခြင်း:
```bash
kubectl apply -f nginx-pod.yaml
```

### Pod အခြေအနေ စစ်ဆေးခြင်း:
```bash
kubectl get pods
```

---

## ၄။ Multi-Container Pods နှင့် Sidecar Pattern

လုပ်ငန်းခွင်တွင် Main Container အား အကူအညီပေးသော Container ကို **Sidecar Container** ဟု ခေါ်သည်။

ဥပမာ - Web App Container သည် File ထဲသို့ Log များ ရေးနေပြီး၊ Sidecar Container က အဆိုပါ Log များကို Cloud (AWS CloudWatch သို့မဟုတ် ElasticSearch) ဆီသို့ တိုက်ရိုက် လှမ်းပို့ပေးသော ပုံစံ:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod-demo
spec:
  volumes:
    - name: shared-logs
      emptyDir: {}

  containers:
    # Main Application
    - name: app-container
      image: alpine
      command: ["/bin/sh", "-c"]
      args:
        - while true; do
            echo "$(date) - Payment processed successfully" >> /var/log/app.log;
            sleep 3;
          done
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log

    # Sidecar Container (Log Streamer)
    - name: sidecar-log-collector
      image: alpine
      command: ["/bin/sh", "-c"]
      args: ["tail -n+1 -f /var/log/app.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log
```

---

## ၅။ Init Containers အသုံးပြုပုံ

**Init Containers** ဆိုသည်မှာ Main Application Container မစတင်မီ ရှေ့ဦးစွာ အောင်မြင်စွာ Run ရမည့် ကွန်တိန်နာများ ဖြစ်သည်။ ဥပမာ - Database Migration ပြီးစီးအောင် စောင့်ခြင်း၊ Config ဖိုင် ကြိုတင် Download ဆွဲခြင်း:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-init
spec:
  initContainers:
    # Database Ready ဖြစ်/မဖြစ် အရင် စစ်ဆေးသော Init Container
    - name: wait-for-db
      image: busybox:latest
      command: ['sh', '-c', 'until nc -z -v -w3 db-service 3306; do echo "Waiting for DB..."; sleep 2; done;']

  containers:
    # DB ready ဖြစ်ပြီးမှ တက်လာမည့် Main App
    - name: main-laravel-app
      image: myusername/laravel-app:1.0
      ports:
        - containerPort: 9000
```

---

## ၆။ Pod Lifecycle နှင့် Status များ

| Pod Status | အဓိပ္ပာယ် |
| :--- | :--- |
| **`Pending`** | Pod ကို လက်ခံထားပြီးဖြစ်သော်လည်း Node ပေါ်တွင် နေရာမရသေးခြင်း (သို့မဟုတ် Image ဆွဲနေဆဲ) |
| **`Running`** | Pod သည် Node တစ်ခုပေါ်တွင် ရောက်ရှိပြီး Container များ ကောင်းမွန်စွာ Run နေသည် |
| **`Succeeded`** | Job ကဲ့သို့သော Task များ အောင်မြင်စွာ ပြီးဆုံးသွားသည် |
| **`Failed`** | Container များ Error တက်ပြီး ရပ်တန့်သွားသည် |
| **`CrashLoopBackOff`** | ⚠️ **အဖြစ်အများဆုံး Error** - App Code အမှား၊ Port မကိုက်ခြင်း သို့မဟုတ် Config မရှိခြင်းကြောင့် Container ခဏခဏ Restart ကျနေခြင်း |

---

## ၇။ Pods စီမံခန့်ခွဲသည့် `kubectl` Commands

```bash
# Pod များအားလုံးကို IP Address နှင့် Run နေသော Node အပါအဝင် ကြည့်ခြင်း
kubectl get pods -o wide

# Pod ၏ အတွင်းရေး Event မှတ်တမ်းများကို စစ်ဆေးခြင်း (Debugging အတွက် အဓိက အသက်)
kubectl describe pod my-first-pod

# Pod ၏ Log ကို ကြည့်ခြင်း
kubectl logs -f my-first-pod

# Pod အတွင်း Shell ဝင်ရောက်ခြင်း
kubectl exec -it my-first-pod -- sh

# Local Computer Port နှင့် Pod Port ချိတ်ဆက်ပြီး Browser မှ စမ်းသပ်ခြင်း
kubectl port-forward pod/my-first-pod 8080:80
```
*(ယခုအခါ Browser မှ `http://localhost:8080` ကို ဖွင့်ကြည့်နိုင်ပါပြီ)*

---

## ၈။ လုပ်ငန်းခွင် Real-World Task: Junior Engineer ၏ Pod Debugging လုပ်ငန်းစဉ်

### 📌 Task Scenario: Production Pod Crash ဖြစ်နေခြင်း
> **အခြေအနေ**: သင် ရုံးရောက်သည့်အခါ QA သို့မဟုတ် Senior Developer က လှမ်းပြောသည်:  
> *"ညီလေး ... Staging ပေါ်က Laravel Pod က မနက်ကတည်းက တက်မလာဘဲ Crash ဖြစ်နေတယ်တဲ့။ ဘာဖြစ်လဲ စစ်ပြီး ပြင်ပေးပါဦး။"*

### 🔍 Junior Engineer တစ်ဦး အဆင့်ဆင့် Debug ပြုလုပ်ရမည့် Flow:
1. **အဆင့် ၁: Pod အခြေအနေကို စစ်ဆေးပါ**:
   ```bash
   kubectl get pods
   # ရလဒ်: app-pod-6d8b9   0/1   CrashLoopBackOff   4 restarts
   ```
2. **အဆင့် ၂: အဘယ်ကြောင့် မတက်သနည်း Event မှတ်တမ်းကို ကြည့်ပါ**:
   ```bash
   kubectl describe pod app-pod-6d8b9
   ```
   အောက်ဆုံးရှိ `Events:` ဇယားတွင် `BackOff restarting failed container` ဟု တွေ့ရမည်။
3. **အဆင့် ၃: Container အတွင်းရှိ Error Log ကို ဖတ်ပါ**:
   ```bash
   kubectl logs app-pod-6d8b9
   # တွေ့ရှိရသော Error: "SQLSTATE[HY000] [2002] Connection refused (Database connection failed)"
   ```
4. **အဆင့် ၄: ပြဿနာကို ချက်ချင်း ရှာဖွေတွေ့ရှိခြင်း**:
   Application Code က Database သို့ မချိတ်ဆက်နိုင်မီ စတင် run နေခြင်းကြောင့် ဖြစ်သည်။
5. **အဆင့် ၅: ဖြေရှင်းခြင်း**:
   အထက်တွင် သင်ယူခဲ့သော **`Init Container` (Wait-for-db)** ကို YAML ထဲတွင် ထည့်သွင်းလိုက်ပြီး `kubectl apply -f pod.yaml` ပြန်တင်လိုက်ပါက Pod သည် `Running` အဖြစ် ကျန်းမာစွာ တက်လာပါမည်။

---

## ၉။ လုပ်ငန်းခွင်သုံး Summary Checklist

| မေးခွန်း | အကြံပြုချက် |
| :--- | :--- |
| **Production တွင် ရိုးရိုး Pod တိုက်ရိုက် run သင့်သလား?** | **မ run သင့်ပါ!** ရိုးရိုး Pod သေသွားပါက ပြန်လည်မွေးဖွားပေးနိုင်စွမ်း မရှိပါ။ အမြဲတမ်း **Deployment** ဖြင့် ထိန်းကျောင်းရပါမည်။ |
| **Resources (Requests & Limits)** | Pod တိုင်းတွင် Memory / CPU Request & Limit အမြဲ ထည့်သွင်းထားရပါမည်။ |
| **Port Forwarding** | `kubectl port-forward` သည် Development စမ်းသပ်ရန်သာ ဖြစ်ပြီး Production အတွက် `Service` နှင့် `Ingress` သုံးရပါမည်။ |
| **Debugging Habit** | Error တက်ပါက ပထမဆုံး `kubectl describe pod` နှင့် `kubectl logs` ကို အရင် စစ်ဆေးပါ။ |

နောက်သင်ခန်းစာ [13_deployments_and_rollouts.md](/devops/02_kubernetes_and_cloud/13_deployments_and_rollouts/) တွင် Production ၌ Pod များကို အလိုအလျောက် ပွားများပေးခြင်း၊ Self-healing လုပ်ပေးခြင်းနှင့် Zero-Downtime Rolling Update ပြုလုပ်ပေးသည့် Deployments အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
