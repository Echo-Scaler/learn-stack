---
title: "Kubernetes Production Troubleshooting Guide"
description: "Resolving CrashLoopBackOff, ImagePullBackOff, OOMKilled, Pending pods, and Service routing issues (မြန်မာဘာသာ)"
---


> **လုပ်ငန်းခွင်သုံး Kubernetes Cluster တွင် အဖြစ်များဆုံး Pod & Service ပြဿနာ ၆ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: `CrashLoopBackOff`

### လက္ခဏာ (Symptom):
Pod status သည် `Running` ဖြစ်လိုက်ပြီး စက္ကန့်ပိုင်းအတွင်း `Error` / `CrashLoopBackOff` ဖြစ်သွားခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Application အတွင်း startup syntax error သို့မဟုတ် unhandled exception ဖြစ်ခြင်း။
2. လိုအပ်သော Database connection string သို့မဟုတ် Environment Variable မပြည့်စုံခြင်း။
3. Container command (PID 1) သည် background သို့ ချက်ချင်း exit ဖြစ်သွားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
# အဆင့် ၁: Crash ဖြစ်သွားသော Container ၏ အစောပိုင်း log ကို စစ်ဆေးပါ
kubectl logs <POD_NAME> --previous

# အဆင့် ၂: Container startup events များကို စစ်ဆေးပါ
kubectl describe pod <POD_NAME>
```

---

## 🚨 ပြဿနာ ၂: `ImagePullBackOff` သို့မဟုတ် `ErrImagePull`

### လက္ခဏာ (Symptom):
Pod status သည် `ImagePullBackOff` ဟု ပြနေပြီး Container မတက်လာခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Docker Image name သို့မဟုတ် Tag စာလုံးပေါင်း မှားယွင်းနေခြင်း (ဥပမာ `nginx:alpne`)။
2. Container Registry (AWS ECR, Docker Hub, GitHub Packages) သည် Private ဖြစ်နေပြီး K8s Secret (imagePullSecrets) မထည့်ထားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
kubectl describe pod <POD_NAME>
# Events တွင်:
# "Failed to pull image: 401 Unauthorized" တွေ့ပါက:
kubectl create secret docker-registry regcred \
  --docker-server=<REGISTRY_URL> \
  --docker-username=<USER> \
  --docker-password=<PASS>
# ထို့နောက် Deployment YAML တွင် imagePullSecrets: [{name: regcred}] ထည့်ပါ
```

---

## 🚨 ပြဿနာ ၃: `Pending` (Pod မ run နိုင်ဘဲ စောင့်ဆိုင်းနေခြင်း)

### လက္ခဏာ (Symptom):
Pod status သည် အချိန်ကြာမြင့်စွာ `Pending` ဖြစ်နေခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. **Insufficient CPU / Memory**: Cluster ရှိ Worker Nodes များတွင် Pod တောင်းဆိုသော `resources.requests` အတွက် နေရာမရှိခြင်း။
2. **PersistentVolumeClaim (PVC) Unbound**: Pod တောင်းဆိုသော Storage PV မရှိသေးခြင်း သို့မဟုတ် StorageClass အလုပ်မလုပ်ခြင်း။
3. **Node Taints / Tolerations**: Node ပေါ်တွင် Pod မဝင်ရောက်နိုင်သော Taint သတ်မှတ်ထားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
kubectl describe pod <POD_NAME>
# "0/3 nodes are available: 3 Insufficient cpu" တွေ့ပါက:
# Node အသစ် ထပ်တိုးပါ သို့မဟုတ် Pod ၏ CPU requests ကို လျှော့ချပါ
```

---

## 🚨 ပြဿနာ ၄: `OOMKilled` (Exit Code 137)

### လက္ခဏာ (Symptom):
Pod သည် ပုံမှန် run နေရင်း ရုတ်တရက် သေဆုံးသွားပြီး `Last State: Terminated, Reason: OOMKilled, Exit Code: 137` ဟု ပြနေခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
Pod သည် `resources.limits.memory` တွင် သတ်မှတ်ထားသော ပမာဏထက် ပိုမိုသုံးစွဲမိသဖြင့် Linux Kernel cgroups မှ Pod ကို သတ်ပစ်ခြင်း။

### ဖြေရှင်းနည်း (Fix):
Deployment YAML တွင် memory limit တိုးမြှင့်ပေးပါ:
```yaml
resources:
  limits:
    memory: "512Mi"  # မူလ 256Mi မှ တိုးမြှင့်ပါ
```

---

## 🚨 ပြဿနာ ၅: Service မှတဆင့် Pods ဆီသို့ Traffic မရောက်ရှိခြင်း (502 / Connection Refused)

### လက္ခဏာ (Symptom):
Service IP သို့မဟုတ် Ingress သို့ ဝင်ရောက်ရာတွင် `502 Bad Gateway` ပြခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
Service YAML ရှိ `spec.selector` နှင့် Deployment Pod template ရှိ `metadata.labels` စာလုံးပေါင်း မကိုက်ညီခြင်း။

### ဖြေရှင်းနည်း (Fix):
Service ၏ Endpoints ရှိမရှိ စစ်ဆေးပါ:
```bash
kubectl get endpoints <SERVICE_NAME>
# အကယ်၍ Endpoints နေရာတွင် <none> ဟု ပြနေပါက Selector နှင့် Labels မကိုက်ညီခြင်း ဖြစ်သည်
```
Service ၏ `targetPort` သည် Container ၏ `containerPort` နှင့် တူညီမှု ရှိမရှိ စစ်ဆေးပါ။
