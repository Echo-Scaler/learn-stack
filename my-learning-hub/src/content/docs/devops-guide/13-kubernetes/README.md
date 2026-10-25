---
title: "Module 13: Kubernetes & Container Orchestration"
description: "Kubernetes Architecture, Pods, Deployments, Services, Ingress, Helm, and AWS EKS (မြန်မာဘာသာ)"
---

> **K8s Architecture၊ Control Plane vs Worker Nodes၊ Deployments၊ Services၊ Ingress၊ ConfigMaps၊ Helm Charts နှင့် AWS EKS**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

Docker Container များသည် application တစ်ခုချင်းစီကို သီးခြား run ပေးနိုင်သော်လည်း၊ Production ပတ်ဝန်းကျင်တွင် Container အလုံးပေါင်း ရာနှင့်ချီ ရှိလာသည့်အခါ:
- Container တစ်ခု ပျက်ကျသွားပါက အသစ်တစ်ခု အလိုအလျောက် ပြန် run ပေးရန် (Self-Healing)၊
- Traffic များလာပါက Container အရေအတွက်ကို အလိုအလျောက် တိုးပေးရန် (Auto-Scaling)၊
- Version အသစ်တင်သည့်အခါ User များဘက်မှ ဝန်ဆောင်မှု မပြတ်တောက်စေရန် (Zero-Downtime Rolling Update)၊
- Container များအကြား Network traffic များကို အညီအမျှ ခွဲဝေပေးရန် (Load Balancing) စသည့် လုပ်ဆောင်ချက်များကို လူကိုယ်တိုင် လိုက်လုပ်ရန် မဖြစ်နိုင်တော့ပါ။

ဤလိုအပ်ချက်များကို ဖြေရှင်းပေးနိုင်သော ကမ္ဘာ့စံချိန်စံညွှန်း Open-Source Container Orchestration Platform မှာ Google မှ စတင်တီထွင်ခဲ့သော **Kubernetes (K8s)** ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Docker Compose vs Kubernetes**: Single-host မှ Multi-host Orchestration သို့ ပြောင်းလဲခြင်း၏ အဓိက အကြောင်းရင်းကို နားလည်ခြင်း။
2. **K8s Architecture Deep Dive**: Control Plane (`api-server`, `etcd`, `scheduler`, `controller-manager`) နှင့် Worker Node (`kubelet`, `kube-proxy`, Container Runtime) တို့၏ အလုပ်လုပ်ပုံကို နားလည်ခြင်း။
3. **Core Kubernetes Objects**: Pods, ReplicaSets, Deployments များကို Declarative YAML ဖြင့် ဖန်တီးခြင်း။
4. **Networking & Service Types**: ClusterIP, NodePort, LoadBalancer နှင့် Ingress Controllers (Layer 7 Routing) အလုပ်လုပ်ပုံ။
5. **Configuration Decoupling**: ConfigMaps နှင့် Secrets များကို အသုံးပြုပြီး Environment Variables နှင့် Configuration Files များကို inject လုပ်ခြင်း။
6. **Persistent Storage**: PersistentVolume (PV), PersistentVolumeClaim (PVC) နှင့် StorageClass (AWS EBS CSI Driver) ဖြင့် database ဒေတာများ မပျောက်ပျက်အောင် ထိန်းသိမ်းခြင်း။
7. **Auto-Scaling (HPA)**: CPU/Memory တက်လာပါက Pods များကို အလိုအလျောက် တိုး/လျှော့ပေးသော Horizontal Pod Autoscaler တပ်ဆင်ခြင်း။
8. **Package Management with Helm**: Kubernetes manifests များကို Helm Charts ဖြင့် version control လုပ်ကာ တစ်ချက်နှိပ် deploy ပြုလုပ်ခြင်း။
9. **AWS EKS Overview**: Managed Kubernetes Cluster (Amazon EKS) နှင့် IAM Roles for Service Accounts (IRSA) မိတ်ဆက်။

---

## 🧠 ၂။ Kubernetes ၏ အဓိက ဖွဲ့စည်းပုံ (Architecture Overview)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONTROL PLANE (MASTER NODE)                           │
│                                                                             │
│   ┌────────────────────┐            ┌───────────────────────────────────┐   │
│   │  kube-apiserver    │ ◄────────► │        etcd (Key-Value Store)     │   │
│   │ (Cluster Gateway)  │            │ (Single Source of Truth / Cluster)│   │
│   └─────────┬──────────┘            └───────────────────────────────────┘   │
│             │                                                               │
│   ┌─────────┴──────────┐            ┌───────────────────────────────────┐   │
│   │  kube-scheduler    │            │     kube-controller-manager       │   │
│   │ (Pod Placement)    │            │ (Replication, Node, Endpoints)    │   │
│   └────────────────────┘            └───────────────────────────────────┘   │
└─────────────┬───────────────────────────────────────────────────────────────┘
              │ TLS Communication
              ├───────────────────────────────────────┐
              ▼                                       ▼
┌───────────────────────────┐           ┌───────────────────────────┐
│     WORKER NODE 01        │           │     WORKER NODE 02        │
│                           │           │                           │
│ ┌───────────────────────┐ │           │ ┌───────────────────────┐ │
│ │ kubelet (Node Agent)  │ │           │ │ kubelet (Node Agent)  │ │
│ └───────────────────────┘ │           │ └───────────────────────┘ │
│ ┌───────────────────────┐ │           │ ┌───────────────────────┐ │
│ │ kube-proxy (IPTables) │ │           │ │ kube-proxy (IPTables) │ │
│ └───────────────────────┘ │           │ └───────────────────────┘ │
│ ┌───────────────────────┐ │           │ ┌───────────────────────┐ │
│ │ Container Runtime     │ │           │ │ Container Runtime     │ │
│ │ (containerd / CRI-O)  │ │           │ │ (containerd / CRI-O)  │ │
│ └───────────────────────┘ │           │ └───────────────────────┘ │
│                           │           │                           │
│  [ Pod 1 ]    [ Pod 2 ]   │           │  [ Pod 3 ]    [ Pod 4 ]   │
└───────────────────────────┘           └───────────────────────────┘
```

### Control Plane Components (ဦးနှောက် အစိတ်အပိုင်းများ):
1. **`kube-apiserver`**: Cluster တစ်ခုလုံး၏ အဓိက ဝင်ပေါက် (API Gateway)။ `kubectl` commands များနှင့် Worker nodes အားလုံးသည် ဤ API Server နှင့်သာ ဆက်သွယ်သည်။
2. **`etcd`**: Cluster ၏ State, Configuration, Secrets အားလုံးကို သိမ်းဆည်းထားသော Highly Available Distributed Key-Value Store။
3. **`kube-scheduler`**: Pod အသစ်များကို မည်သည့် Worker Node ပေါ်တွင် run ရမည်ကို CPU/Memory resources အပေါ် မူတည်၍ ရွေးချယ်ပေးသော အစိတ်အပိုင်း။
4. **`kube-controller-manager`**: Cluster ၏ လက်ရှိ အခြေအနေသည် သတ်မှတ်ထားသော Desired State နှင့် ကိုက်ညီမှု ရှိမရှိ အမြဲစောင့်ကြည့် ထိန်းကျောင်းပေးသော daemon (ဥပမာ Pod ပျက်ကျပါက အသစ်ပြန်ဖွင့်ပေးခြင်း)။

### Worker Node Components (အလုပ်သမား ဆာဗာများ):
1. **`kubelet`**: Control plane (API Server) ထံမှ ညွှန်ကြားချက်များကို လက်ခံပြီး Container Runtime အား Pod များကို စတင် run ရန် ခိုင်းစေသော Node Agent။
2. **`kube-proxy`**: Node ပေါ်တွင် Network rules များနှင့် IPTables များကို စီမံပြီး Pods အချင်းချင်းနှင့် ပြင်ပမှ ဆက်သွယ်နိုင်အောင် လမ်းကြောင်းပေးသော component။
3. **Container Runtime**: Container များကို အမှန်တကယ် run ပေးသော engine (ခေတ်သစ် K8s တွင် `containerd` သို့မဟုတ် `CRI-O` ကို သုံးသည်)။

---

## 📦 ၃။ Kubernetes Core Objects (အခြေခံ အစိတ်အပိုင်းများ)

### ၃.၁ Pod ဆိုသည်မှာ အဘယ်နည်း?
- Kubernetes တွင် အသေးငယ်ဆုံး Deploy ပြုလုပ်နိုင်သော ယူနစ် ဖြစ်သည်။
- Pod တစ်ခုအတွင်း Container တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော tightly-coupled containers များ ပါဝင်နိုင်ပြီး Network IP နှင့် Storage ကို မျှဝေသုံးစွဲကြသည်။

### ၃.၂ Deployment ဆိုသည်မှာ အဘယ်နည်း?
- Pod များကို တိုက်ရိုက် မဆောက်ဘဲ **Deployment** ဖြင့် စီမံခန့်ခွဲရပါသည်:
  - **Replicas**: Pod အရေအတွက် (ဥပမာ ၃ ခု) ကို အမြဲ ပြည့်မီအောင် ထိန်းပေးသည်။
  - **Rolling Updates**: Zero downtime ဖြင့် application version အသစ်သို့ တစ်လုံးချင်း အစားထိုး ပြောင်းလဲပေးသည်။
  - **Rollback**: Version အသစ်တွင် bug ပါလာပါက ယခင် version သို့ စက္ကန့်ပိုင်းအတွင်း ပြန်လည် ဆုတ်ခွာပေးနိုင်သည် (`kubectl rollout undo`)။

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web-container
          image: nginx:alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "250m"
              memory: "256Mi"
```

---

## 🌐 ၄။ Kubernetes Networking & Service Types

Pod များသည် အချိန်မရွေး သေဆုံးနိုင်ပြီး ပြန်တက်လာပါက IP လိပ်စာ အသစ် ပြောင်းလဲသွားပါသည်။ ထို့ကြောင့် Pods များဆီသို့ ပုံသေ ဆက်သွယ်နိုင်သော Static IP နှင့် Load Balancing ပေးရန် **Service** ကို သုံးရပါသည်:

```text
[Internet / Browser]
         │
         ▼ (Layer 7 Domain Routing: app.example.com)
  [ Ingress Controller ]
         │
         ▼ (Stable Service DNS)
    [ Service ] (ClusterIP / NodePort / LoadBalancer)
    ┌────┴────┐
    ▼         ▼
 [ Pod 1 ] [ Pod 2 ]
```

| Service Type | အသုံးဝင်ပုံ |
|---|---|
| **ClusterIP** (Default) | Cluster အတွင်းပိုင်းတွင်သာ အချင်းချင်း ဆက်သွယ်ရန် (Internal IP သာ ရရှိသည်)။ Database နှင့် Backend API များအတွက် သုံးသည်။ |
| **NodePort** | Worker Node တိုင်း၏ port (30000–32767) တွင် port ဖွင့်ပေးပြီး ပြင်ပမှ `<NodeIP>:<NodePort>` ဖြင့် ဝင်ရောက်နိုင်စေသည်။ |
| **LoadBalancer** | Cloud Provider (AWS/GCP) တွင် Network Load Balancer (NLB) အလိုအလျောက် ဆောက်ပေးပြီး External IP ပေးသည်။ |
| **Ingress** | Domain name အလိုက် (ဥပမာ `api.com`, `web.com`) သို့မဟုတ် path အလိုက် (`/users`, `/orders`) HTTP/HTTPS routing ပြုလုပ်ပေးသော Layer 7 Ingress Controller။ |

---

## ⚙️ ၅။ ConfigMaps & Secrets (Configuration Decoupling)

Application ၏ configuration များကို container image ထဲတွင် hardcode မလုပ်ဘဲ ပြင်ပမှ inject လုပ်ခြင်း:

```yaml
# ConfigMap (Non-sensitive data)
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  PORT: "8080"
---
# Secret (Base64 Encrypted Sensitive data)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DB_PASSWORD: "SuperSecretPassword123!"
```

---

## 📈 ၆။ Auto-Scaling with Horizontal Pod Autoscaler (HPA)

CPU သို့မဟုတ် Memory အသုံးပြုမှု ၇၀% ကျော်လာပါက Pods အရေအတွက်ကို အလိုအလျောက် တိုးပေးခြင်း:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## ⎈ ၇။ Package Management with Helm (K8s Package Manager)

Helm သည် Kubernetes အတွက် `apt` သို့မဟုတ် `npm` ကဲ့သို့သော Package Manager ဖြစ်ပါသည်။ Manifests များစွာကို Template တစ်ခုအဖြစ် ထုပ်ပိုးပေးပါသည်:

```text
my-chart/
├── Chart.yaml          # Package metadata (Name, Version)
├── values.yaml         # Default configuration variables
└── templates/
    ├── deployment.yaml # Jinja-like parameterized K8s manifests
    └── service.yaml
```

### Helm အသုံးများသော Commands:
```bash
# Helm repository ထည့်သွင်းခြင်း
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Nginx Ingress Controller ကို တစ်ချက်နှိပ် သွင်းယူခြင်း
helm install my-ingress ingress-nginx/ingress-nginx

# မိမိ application chart ကို deploy လုပ်ခြင်း
helm install my-app ./my-chart -f values-prod.yaml

# Version အသစ်သို့ upgrade ပြုလုပ်ခြင်း
helm upgrade my-app ./my-chart --set replicaCount=5

# Error ဖြစ်ပါက ယခင် version သို့ ပြန်ဆုတ်ခြင်း
helm rollback my-app 1
```

---

## ☁️ ၈။ AWS Elastic Kubernetes Service (Amazon EKS)

Production တွင် Master Node (Control Plane) များကို ကိုယ်တိုင် maintain လုပ်မနေဘဲ AWS မှ Managed ပေးသော **Amazon EKS** ကို အသုံးပြုပါသည်:

### EKS ၏ အဓိက အားသာချက်များ:
1. **High Availability Control Plane**: Multi-AZ ပေါ်တွင် API Server များနှင့် `etcd` ကို 99.95% SLA ဖြင့် AWS မှ အလိုအလျောက် manage လုပ်ပေးခြင်း။
2. **EKS Managed Node Groups**: EC2 instances များကို Auto Scaling Group ဖြင့် အလိုအလျောက် စီမံပေးခြင်း။
3. **AWS Fargate for EKS**: EC2 server manage လုပ်စရာမလိုဘဲ Serverless container အဖြစ် Pods များကို run နိုင်ခြင်း။
4. **IRSA (IAM Roles for Service Accounts)**: Pod တစ်ခုချင်းစီကို သီးခြား AWS IAM Role သတ်မှတ်ပေးပြီး S3, DynamoDB သို့ Least Privilege ဖြင့် ဝင်ရောက်ခွင့်ပေးခြင်း။

---

## 🛠️ ၉။ လက်တွေ့ လေ့ကျင့်ခန်း: Local K8s Lab Setup & Deployment

### ၉.၁ Minikube သို့မဟုတ် Kind ထည့်သွင်းခြင်း:
```bash
# macOS
brew install minikube kubectl

# Local Cluster စတင် run ခြင်း
minikube start --driver=docker

# Cluster status စစ်ဆေးခြင်း
kubectl cluster-info
kubectl get nodes
```

### ၉.၂ Application အား Deploy ပြုလုပ်ခြင်း:
```bash
# Deployment ဖန်တီးခြင်း
kubectl apply -f deployment.yaml

# Pods များ status စစ်ဆေးခြင်း
kubectl get pods -w

# Service ဖန်တီးခြင်း
kubectl apply -f service.yaml

# Local port forwarding ဖြင့် စမ်းသပ်ခြင်း
kubectl port-forward svc/web-app 8080:80
```
Browser တွင် `http://localhost:8080` သို့ ဝင်ရောက်၍ စမ်းသပ်နိုင်ပါပြီ။

---

## 🛡️ ၁၀။ Production Kubernetes Checklist

1. ✅ **Always Define Resource Requests and Limits**: Pod တိုင်းတွင် `requests` (အနည်းဆုံး လိုအပ်ချက်) နှင့် `limits` (အများဆုံး သုံးခွင့်) မဖြစ်မနေ ထည့်ပါ (Node Memory ပြည့်ပြီး Out Of Memory ဖြစ်ခြင်းမှ ကာကွယ်ရန်)။
2. ✅ **Configure Liveness and Readiness Probes**: Pod သည် request လက်ခံနိုင်မှု ရှိမရှိ (`readinessProbe`) နှင့် crash ဖြစ်နေပါက auto-restart လုပ်ရန် (`livenessProbe`) တပ်ဆင်ထားပါ။
3. ✅ **Run as Non-Root**: Pod ၏ SecurityContext တွင် `runAsNonRoot: true` သတ်မှတ်ပါ။
4. ✅ **Do Not Store Secrets in Plain Git**: Secrets များကို Git ပေါ် တင်မည့်အစား Sealed Secrets, External Secrets Operator (AWS Secrets Manager မှ ဆွဲယူသောစနစ်) သို့မဟုတ် HashiCorp Vault ကို သုံးပါ။
5. ✅ **Use Namespaces**: Project သို့မဟုတ် Environment (dev, staging, prod) အလိုက် Namespaces ခွဲခြား သတ်မှတ်ပါ။

---

## 🔍 ၁၁။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ (Verification Commands)

```bash
# ၁။ Pods အားလုံး၏ အခြေအနေကို wide format ဖြင့် စစ်ဆေးခြင်း
kubectl get pods -o wide

# ၂။ Pod တစ်ခု၏ အသေးစိတ် Events နှင့် Failure Reason စစ်ဆေးခြင်း
kubectl describe pod <POD_NAME>

# ၃။ Pod ၏ Live Logs ကြည့်ရှုခြင်း
kubectl logs -f <POD_NAME>

# ၄။ Pod container အတွင်းသို့ interactive terminal ဖြင့် ဝင်ရောက်ခြင်း
kubectl exec -it <POD_NAME> -- /bin/sh

# ၅။ CPU/Memory အသုံးပြုမှု စစ်ဆေးခြင်း (Metrics Server လိုအပ်သည်)
kubectl top nodes
kubectl top pods
```

---

## 🚨 ၁၂။ အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting Scenarios)

### ပြဿနာ ၁: `CrashLoopBackOff`
- **အကြောင်းရင်း**: Container သည် စတင် run ပြီး စက္ကန့်ပိုင်းအတွင်း crash ဖြစ်သွားခြင်း (Configuration error, missing environment variable သို့မဟုတ် syntax error)။
- **ဖြေရှင်းနည်း**:
  ```bash
  # Crash ဖြစ်ရသည့် log ကို ကြည့်ပါ
  kubectl logs <POD_NAME> --previous
  ```

### ပြဿနာ ၂: `ImagePullBackOff` / `ErrImagePull`
- **အကြောင်းရင်း**: Docker Image name သို့မဟုတ် Tag မှားယွင်းနေခြင်း သို့မဟုတ် Private Container Registry (AWS ECR/Docker Hub) authentication credential မရှိခြင်း။
- **ဖြေရှင်းနည်း**:
  ```bash
  kubectl describe pod <POD_NAME>
  # Events တွင် 401 Unauthorized သို့မဟုတ် 404 Not Found ကို စစ်ဆေးပါ
  ```

### ပြဿနာ ၃: `Pending`
- **အကြောင်းရင်း**: Cluster တွင် CPU သို့မဟုတ် Memory မလုံလောက်ခြင်း (Insufficient resources) သို့မဟုတ် PersistentVolumeClaim (PVC) unbound ဖြစ်နေခြင်း။
- **ဖြေရှင်းနည်း**: `kubectl describe pod <POD_NAME>` ကို ကြည့်ပြီး Node capacity ကို စစ်ဆေးပါ။

### ပြဿနာ ၄: `OOMKilled` (Exit Code 137)
- **အကြောင်းရင်း**: Pod သည် သတ်မှတ်ထားသော memory limit ထက် ကျော်လွန်သုံးစွဲမိသဖြင့် Linux Kernel မှ သတ်ပစ်ခြင်း။
- **ဖြေရှင်းနည်း**: Deployment YAML တွင် `resources.limits.memory` ကို တိုးမြှင့်ပေးပါ။

---

## 💼 ၁၃။ အင်တာဗျူး အမေးအဖြေများ (Interview Questions & Model Answers)

### မေးခွန်း ၁: Pod နှင့် Container ဘာကွာသလဲ? (What is the difference between a Pod and a Container?)
**အဖြေ**: 
> "Container သည် Application တစ်ခုနှင့် ၎င်း၏ dependencies များကို ထုပ်ပိုးထားသော Runtime Unit ဖြစ်သည်။ 
> 
> Pod သည် Kubernetes ၏ အသေးငယ်ဆုံး Deployable Unit ဖြစ်ပြီး Container တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော Containers များကို စုစည်းထားသော wrapper ဖြစ်ပါသည်။ Pod အတွင်းရှိ Containers များသည် တူညီသော Network Namespace (တူညီသော IP address) နှင့် Storage Volumes များကို အတူတကွ မျှဝေသုံးစွဲကြပါသည်။"

### မေးခွန်း ၂: Liveness Probe နှင့် Readiness Probe ဘာကွာသလဲ?
**အဖြေ**:
> "Liveness Probe သည် Container သည် အသက်ရှင်နေဆဲ ဖြစ်မဖြစ် စစ်ဆေးပေးပြီး၊ မအောင်မြင်ပါက (ဥပမာ Deadlock ဖြစ်နေလျှင်) Kubelet မှ Container ကို restart ပြုလုပ်ပေးသည်။ 
> 
> Readiness Probe သည် Container သည် User traffic များကို စတင်လက်ခံနိုင်သော အခြေအနေသို့ ရောက်ရှိပြီး ဖြစ်မဖြစ် (ဥပမာ DB connection တည်ဆောက်ပြီးမပြီး) စစ်ဆေးပေးပြီး၊ မအောင်မြင်ပါက Service မှ ထို Pod ဆီသို့ traffic ပို့ဆောင်ခြင်းကို ခေတ္တ ရပ်တန့်ပေးထားပါသည်။"

---

## 📋 ၁၄။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့် (Summary & Next Step)

ယခု Module 13 တွင် သင်သည်:
- Kubernetes ၏ Control Plane နှင့် Worker Nodes အလုပ်လုပ်ပုံကို နားလည်ခဲ့သည်။
- Declarative YAML ဖြင့် Pods, Deployments, Services နှင့် Ingress routing ကို ဖန်တီးနိုင်ခဲ့သည်။
- Horizontal Pod Autoscaler (HPA) ဖြင့် traffic အလိုက် auto-scaling ပြုလုပ်နိုင်ခဲ့သည်။
- Helm Charts ဖြင့် application များကို modular package ပြုလုပ်ကာ version control စီမံနိုင်ခဲ့သည်။
- Amazon EKS Managed Cloud Architecture ၏ အခြေခံ သဘောတရားများကို ကျွမ်းကျင်စွာ သဘောပေါက်ခဲ့သည်။

👉 **နောက်တစ်ဆင့်**: **[Module 14: SRE & Production Operations (Incident Response, Runbooks, Postmortems & On-Call)](/devops-guide/14-sre-operations/readme/)** သို့ ဆက်လက် တက်လှမ်းပါမည်။
