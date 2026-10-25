---
title: "Kubernetes & kubectl Cheatsheet"
description: "Essential kubectl commands, imperative generators, Helm CLI, and debugging commands"
---


> **လုပ်ငန်းခွင်သုံး `kubectl` Commands၊ Resource Generators၊ Debugging Flags နှင့် Helm CLI လက်စွဲ**

---

## ⚡ ၁။ အသုံးများသော `kubectl` Get, Describe & Logs Commands

| Command | ရှင်းလင်းချက် |
|---|---|
| `kubectl get nodes -o wide` | Worker nodes များ၏ Status, IP, OS, Kernel စစ်ဆေးခြင်း |
| `kubectl get pods -A` | Namespaces အားလုံးရှိ Pods အားလုံးကို ကြည့်ရှုခြင်း |
| `kubectl get pods -w` | Pods များ ပြောင်းလဲမှု status ကို real-time စောင့်ကြည့်ခြင်း |
| `kubectl describe pod <POD_NAME>` | Pod ၏ Events နှင့် Error အသေးစိတ် စစ်ဆေးခြင်း |
| `kubectl logs -f <POD_NAME>` | Pod log ကို real-time stream ကြည့်ခြင်း |
| `kubectl logs <POD_NAME> --previous` | Crash ဖြစ်သွားသော Container အဟောင်း၏ log ကြည့်ခြင်း |
| `kubectl logs -l app=my-app --tail 100` | Label အလိုက် Pods အားလုံး၏ logs များကို ကြည့်ခြင်း |
| `kubectl exec -it <POD_NAME> -- /bin/sh` | Container ထဲသို့ shell ဖြင့် ဝင်ရောက်ခြင်း |
| `kubectl port-forward svc/my-svc 8080:80` | Local port 8080 ကို Service port 80 သို့ ချိတ်ဆက်ခြင်း |

---

## 🚀 ၂။ Imperative Commands (YAML အမြန် ထုတ်ယူခြင်း)

YAML ကို အစမှ လက်ဖြင့် မရေးဘဲ `--dry-run=client -o yaml` ဖြင့် ချက်ချင်း generate ထုတ်ယူနိုင်ပါသည်:

```bash
# Pod YAML template ထုတ်ယူခြင်း
kubectl run my-pod --image=nginx:alpine --dry-run=client -o yaml > pod.yaml

# Deployment YAML template ထုတ်ယူခြင်း (3 Replicas)
kubectl create deployment my-deploy --image=nginx:alpine --replicas=3 --dry-run=client -o yaml > deploy.yaml

# Service ClusterIP ထုတ်ယူခြင်း
kubectl expose deployment my-deploy --port=80 --target-port=80 --dry-run=client -o yaml > svc.yaml

# ConfigMap ဖန်တီးခြင်း
kubectl create configmap app-cfg --from-literal=ENV=prod --from-literal=PORT=8080

# Secret ဖန်တီးခြင်း
kubectl create secret generic app-secret --from-literal=DB_PASS="MySecret123"
```

---

## 🔄 ၃။ Deployment Rollout & Scaling Commands

| Command | ရည်ရွယ်ချက် |
|---|---|
| `kubectl scale deployment my-deploy --replicas=5` | Pods အရေအတွက်ကို ၅ ခုသို့ တိုး/လျှော့ခြင်း |
| `kubectl set image deployment/my-deploy nginx=nginx:1.25` | Version အသစ်သို့ Rolling Update စတင်ခြင်း |
| `kubectl rollout status deployment/my-deploy` | Update လုပ်နေမှု အခြေအနေကို စောင့်ကြည့်ခြင်း |
| `kubectl rollout history deployment/my-deploy` | ယခင် deployment revision history ကြည့်ခြင်း |
| `kubectl rollout undo deployment/my-deploy` | အမှားပါလာပါက ယခင် version သို့ ချက်ချင်း rollback ပြုလုပ်ခြင်း |
| `kubectl rollout restart deployment/my-deploy` | Pods အားလုံးကို zero-downtime ဖြင့် restart ချခြင်း |

---

## ⎈ ၄။ Helm CLI Reference

| Command | လုပ်ဆောင်ချက် |
|---|---|
| `helm list -A` | Installed releases အားလုံး ကြည့်ရှုခြင်း |
| `helm install <RELEASE_NAME> <CHART_DIR>` | Chart အသစ် deploy လုပ်ခြင်း |
| `helm upgrade <RELEASE_NAME> <CHART_DIR> -f values.yaml` | Configuration ပြင်ဆင်၍ upgrade လုပ်ခြင်း |
| `helm rollback <RELEASE_NAME> <REVISION>` | သတ်မှတ်ထားသော revision သို့ ပြန်ဆုတ်ခြင်း |
| `helm uninstall <RELEASE_NAME>` | Deployed release အား အပြီးဖျက်ခြင်း |
| `helm template ./my-chart` | Chart မှ ထွက်ပေါ်လာမည့် K8s YAML ကို ကြည့်ရှုခြင်း |
