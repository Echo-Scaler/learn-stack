# 📋 Kubernetes & kubectl Cheatsheet

> **လုပ်ငန်းခွင်သုံး `kubectl` Commands၊ Resource Generators၊ Debugging Flags နှင့် Helm CLI လက်စွဲ**

---

## ⚡ ၁။ အသုံးများသော `kubectl` Commands

| Command | ရှင်းလင်းချက် |
|---|---|
| `kubectl get nodes -o wide` | Worker nodes များ၏ Status, IP, OS စစ်ဆေးခြင်း |
| `kubectl get pods -A` | Namespaces အားလုံးရှိ Pods အားလုံး ကြည့်ရှုခြင်း |
| `kubectl describe pod <POD_NAME>` | Pod ၏ Events နှင့် Error အသေးစိတ် စစ်ဆေးခြင်း |
| `kubectl logs -f <POD_NAME>` | Pod log ကို real-time ကြည့်ခြင်း |
| `kubectl exec -it <POD_NAME> -- /bin/sh` | Container ထဲသို့ shell ဖြင့် ဝင်ရောက်ခြင်း |
| `kubectl port-forward svc/my-svc 8080:80` | Local port forwarding ဖြင့် test လုပ်ခြင်း |

---

## 🚀 ၂။ Imperative YAML Generator

```bash
kubectl create deployment my-deploy --image=nginx:alpine --replicas=3 --dry-run=client -o yaml > deploy.yaml
kubectl expose deployment my-deploy --port=80 --target-port=80 --dry-run=client -o yaml > svc.yaml
```

---

## 🔄 ၃။ Deployment Rollout Commands

```bash
kubectl rollout status deployment/my-deploy
kubectl rollout undo deployment/my-deploy
kubectl rollout restart deployment/my-deploy
```

---

## ⎈ ၄။ Helm CLI Reference

```bash
helm install my-app ./my-chart -f values.yaml
helm upgrade my-app ./my-chart --set replicaCount=5
helm rollback my-app 1
```
