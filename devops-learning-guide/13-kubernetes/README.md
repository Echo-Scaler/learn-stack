# ☸️ Module 13: Kubernetes & Container Orchestration (မြန်မာဘာသာ)

> **K8s Architecture၊ Control Plane vs Worker Nodes၊ Deployments၊ Services၊ Ingress၊ ConfigMaps၊ Helm Charts နှင့် AWS EKS**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

Docker Container များသည် application တစ်ခုချင်းစီကို သီးခြား run ပေးနိုင်သော်လည်း၊ Production ပတ်ဝန်းကျင်တွင် Container အလုံးပေါင်း ရာနှင့်ချီ ရှိလာသည့်အခါ Self-Healing, Auto-Scaling, Zero-Downtime Rolling Update နှင့် Load Balancing စသည့် လုပ်ဆောင်ချက်များကို အလိုအလျောက် စီမံခန့်ခွဲပေးရန် **Kubernetes (K8s)** ကို အသုံးပြုရပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Docker Compose vs Kubernetes**: Single-host မှ Multi-host Orchestration သို့ ပြောင်းလဲခြင်း။
2. **K8s Architecture Deep Dive**: Control Plane (`api-server`, `etcd`, `scheduler`, `controller-manager`) နှင့် Worker Node (`kubelet`, `kube-proxy`, Container Runtime)။
3. **Core Kubernetes Objects**: Pods, ReplicaSets, Deployments များကို Declarative YAML ဖြင့် ဖန်တီးခြင်း။
4. **Networking & Service Types**: ClusterIP, NodePort, LoadBalancer နှင့် Ingress Controllers။
5. **Configuration Decoupling**: ConfigMaps နှင့် Secrets။
6. **Persistent Storage**: PersistentVolume (PV), PersistentVolumeClaim (PVC) နှင့် StorageClass။
7. **Auto-Scaling (HPA)**: Horizontal Pod Autoscaler တပ်ဆင်ခြင်း။
8. **Package Management with Helm**: Helm Charts ဖြင့် Version Control နှင့် Deployment။
9. **AWS EKS Overview**: Managed Kubernetes Cluster (Amazon EKS) နှင့် IRSA။

---

## 🧠 ၂။ Kubernetes ၏ အဓိက ဖွဲ့စည်းပုံ (Architecture Overview)

```text
Control Plane (API Server, etcd, Scheduler, Controller Manager)
     │
     ▼
Worker Nodes (kubelet, kube-proxy, containerd) ➜ Pods
```

---

## 📦 ၃။ Kubernetes Core Objects (Pods, Deployments, Services)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
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

- **ClusterIP**: Internal-only Cluster Communication
- **NodePort**: `<NodeIP>:<NodePort>` (30000-32767)
- **LoadBalancer**: Cloud Provider NLB/ALB External IP
- **Ingress**: Layer 7 Domain & Path-based HTTP Routing

---

## ⎈ ၅။ Package Management with Helm

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install my-app ./my-chart -f values.yaml
helm upgrade my-app ./my-chart --set replicaCount=5
helm rollback my-app 1
```

---

## 🔍 ၆။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ

```bash
kubectl get pods -o wide
kubectl describe pod <POD_NAME>
kubectl logs -f <POD_NAME>
kubectl top pods
```

---

## 💼 ၇။ အင်တာဗျူး အမေးအဖြေများ

### မေးခွန်း: Pod နှင့် Container ဘာကွာသလဲ?
> "Container သည် App packaging runtime unit ဖြစ်ပြီး Pod သည် K8s ၏ အသေးငယ်ဆုံး deployable unit ဖြစ်ကာ container တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို၍ တူညီသော network IP နှင့် storage volume ကို မျှဝေသုံးစွဲကြပါသည်။"

---

## 📋 ၈။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့်

👉 **နောက်တစ်ဆင့်**: **[Module 14: SRE & Production Operations](../14-sre-operations/README.md)**
