---
title: "၅။ Hands-on Lab: Web App Deployment"
description: "eksctl ဖြင့် Development EKS Cluster တည်ဆောက်ခြင်း၊ kubectl ဖြင့် Web App Deploy လုပ်ခြင်း၊ Rolling Updates စမ်းသပ်ခြင်းနှင့် Resource Cleanup"
---

# ၅။ Hands-on Lab: Web App Deployment

ဤ Lab တွင် တရားဝင် Tool ဖြစ်သော `eksctl` ဖြင့် EKS Cluster တစ်ခု တည်ဆောက်ကာ Sample Web App ကို Pods ၃ ခုဖြင့် Deploy လုပ်ခြင်း၊ Rolling Update စမ်းသပ်ခြင်းနှင့် Cluster ဖျက်ဆီးခြင်းတို့ကို အဆင့်ဆင့် လေ့လာပါမည်။

---

## 📋 Prerequisites
- `aws` CLI, `kubectl` နှင့် `eksctl` tool များကို local စက်တွင် တပ်ဆင်ထားပြီးဖြစ်ခြင်း။

---

## အဆင့် (၁) - `eksctl` ဖြင့် Development EKS Cluster တည်ဆောက်ခြင်း

Low-cost စရိတ်သက်သာစေရန် `t3.medium` Node ၂ လုံးဖြင့် Cluster ဆောက်ပါမည်:

```bash
eksctl create cluster \
  --name "demo-k8s-cluster" \
  --region "us-east-1" \
  --nodegroup-name "standard-workers" \
  --node-type "t3.medium" \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed
```

*(Cluster တည်ဆောက်ရန် ၁၀ မိနစ် မှ ၁၅ မိနစ်ခန့် ကြာမြင့်ပါမည်)*

Cluster ပြီးစီးပါက `kubectl` ချိတ်ဆက်မှုကို စစ်ဆေးပါ:
```bash
aws eks update-kubeconfig --region us-east-1 --name demo-k8s-cluster
kubectl get nodes
```

---

## အဆင့် (၂) - Sample Web Application Deployment & Service ဖန်တီးခြင်း

`app.yaml` ဖိုင်တစ်ခု ရေးသားပါမည်:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        # Health Checks စစ်ဆေးချက်များ
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
          initialDelaySeconds: 3
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: demo-web-service
spec:
  type: LoadBalancer # AWS Network Load Balancer (NLB) အလိုအလျောက် ဆောက်ပေးသည်
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
```

Deploy လုပ်ပါ:
```bash
kubectl apply -f app.yaml
```

---

## အဆင့် (၃) - Pods၊ Services နှင့် Logs စစ်ဆေးခြင်း

```bash
# Pods ၃ ခု အလုပ်လုပ်နေခြင်းကို စစ်ဆေးခြင်း
kubectl get pods -l app=web

# AWS Load Balancer ၏ External IP/DNS ရှာဖွေခြင်း
kubectl get svc demo-web-service

# Pod တစ်ခု၏ Log များကို ဖတ်ရှုခြင်း
kubectl logs -l app=web --tail=20
```

`kubectl get svc` မှ ရရှိသော External Load Balancer DNS (ဥပမာ- `a1b2c3...elb.amazonaws.com`) ကို Browser တွင် ဖွင့်ကြည့်ပါက Nginx Welcome Page ကို တွေ့မြင်ရမည်။

---

## အဆင့် (၄) - Zero-Downtime Rolling Update စမ်းသပ်ခြင်း

Image Version ကို `nginx:1.26-alpine` သို့ update ပြုလုပ်ပါ:

```bash
kubectl set image deployment/demo-web-app nginx=nginx:1.26-alpine

# Rolling update တိုးတက်မှုကို စောင့်ကြည့်ခြင်း
kubectl rollout status deployment/demo-web-app
```

Kubernetes သည် Pod အဟောင်းများကို တစ်ပြိုင်နက် မဖျက်ဘဲ အသစ်တစ်ခု စတင်ပြီးမှသာ အဟောင်းကို တစ်ခုချင်း ဖျက်သဖြင့် **Downtime လုံးဝ မရှိဘဲ ဗားရှင်းသစ်သို့ ကူးပြောင်းပေးပါသည်**။

---

## 🧹 အဆင့် (၅) - Resource Cleanup Checklist (စရိတ်မကျန်စေရန် ရှင်းလင်းခြင်း)

EKS Control Plane သည် တစ်နာရီလျှင် $0.10 ကောက်ခံသဖြင့် စမ်းသပ်ပြီးပါက မဖြစ်မနေ ဖျက်ပစ်ပါ:

```bash
# ၁။ LoadBalancer Service အရင်ဖျက်ပါ (AWS NLB ကို အရင်ရှင်းရန်)
kubectl delete -f app.yaml

# ၂။ EKS Cluster နှင့် EC2 Worker Nodes များကို အပြီးအပိုင် ဖျက်ပစ်ခြင်း
eksctl delete cluster --name "demo-k8s-cluster" --region "us-east-1"
```
