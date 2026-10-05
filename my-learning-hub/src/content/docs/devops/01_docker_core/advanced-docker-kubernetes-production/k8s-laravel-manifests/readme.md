---
title: "Overview"
description: "ဤ Folder ထဲရှိ YAML ဖိုင်များသည် တကယ့် Cloud Kubernetes Cluster (AWS EKS, Google Cloud GKE, DigitalOcean K8s သို့မဟုတ် Local Minikube / K3s) ပေါ်တွင် အဆင်သင့် D"
---

## ☸️ Production Kubernetes Deployment Guide (Manifests အသုံးပြုနည်း)

ဤ Folder ထဲရှိ YAML ဖိုင်များသည် တကယ့် Cloud Kubernetes Cluster (AWS EKS, Google Cloud GKE, DigitalOcean K8s သို့မဟုတ် Local Minikube / K3s) ပေါ်တွင် အဆင်သင့် Deploy လုပ်နိုင်သော Production Manifests များ ဖြစ်သည်။

---

## 🚀 Deployment အဆင့်ဆင့် လုပ်ဆောင်နည်း

### အဆင့် ၁- Namespace တည်ဆောက်ခြင်း
```bash
kubectl apply -f 01-namespace.yaml
```

### အဆင့် ၂- ConfigMap နှင့် Secrets များ ထည့်သွင်းခြင်း
```bash
kubectl apply -f 02-configmap-and-secrets.yaml
```

### အဆင့် ၃- Database (MySQL StatefulSet) စတင်ခြင်း
```bash
kubectl apply -f 03-mysql-statefulset.yaml
```
*(MySQL Pod အပြည့်အဝ Ready ဖြစ်စေရန် `kubectl get pods -n production -w` ဖြင့် စောင့်ကြည့်ပါ)*

### အဆင့် ၄- Cache Service (Redis) စတင်ခြင်း
```bash
kubectl apply -f 04-redis-deployment.yaml
```

### အဆင့် ၅- Laravel Backend Application Deploy လုပ်ခြင်း
```bash
kubectl apply -f 05-laravel-app-deployment.yaml
```

### အဆင့် ၆- Domain Routing နှင့် Ingress SSL/TLS စတင်ခြင်း
```bash
kubectl apply -f 06-ingress.yaml
```

### အဆင့် ၇- Auto-Scaling (HPA) စတင်ခြင်း
```bash
kubectl apply -f 07-hpa.yaml
```

---

## 🔍 အားလုံး တစ်ပြိုင်နက် Apply လုပ်နည်း:
```bash
kubectl apply -f .
```

## 📊 Deployment အခြေအနေ စစ်ဆေးခြင်း:
```bash
# Pods အားလုံး၏ အခြေအနေ ကြည့်ခြင်း
kubectl get pods -n production

# Services & Ingress IP စစ်ဆေးခြင်း
kubectl get svc,ingress -n production

# Auto-scaling status စစ်ဆေးခြင်း
kubectl get hpa -n production
```
