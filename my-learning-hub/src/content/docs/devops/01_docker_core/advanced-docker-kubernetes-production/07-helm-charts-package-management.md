---
title: "07. Helm Charts Package Management"
description: "Production တွင် Dev, Staging နှင့် Production ပတ်ဝန်းကျင် ၃ ခု ရှိသည် ဆိုပါစို့-"
---

## ⛑️ အခန်း (၇) - Helm Charts (Kubernetes Package Management)

---

## ၁။ Helm ဆိုတာ ဘာလဲ? အဘယ်ကြောင့် သုံးရသနည်း?

### 📌 Plain YAML Manifests များ၏ အခက်အခဲ
Production တွင် Dev, Staging နှင့် Production ပတ်ဝန်းကျင် ၃ ခု ရှိသည် ဆိုပါစို့-
- Dev တွင် Replica 1 ခု၊ Staging တွင် Replica 2 ခု၊ Prod တွင် Replica 10 ခု သုံးလိုသည်။
- မတူညီသော ပတ်ဝန်းကျင်များအတွက် YAML ဖိုင်များကို Copy ကူးပြီး ရေးသားရပါက ဖိုင်ပေါင်းများစွာ ပွားလာပြီး ပြင်ဆင်ထိန်းသိမ်းရ အလွန် ခက်ခဲလာသည်။

**Helm** သည် Kubernetes အတွက် **Package Manager** ဖြစ်သည်။ (PHP တွင် Composer၊ Node.js တွင် npm ကဲ့သို့ ဖြစ်သည်)။  
Helm သည် YAML ဖိုင်များကို **Dynamic Templates** များအဖြစ် ပြောင်းလဲပေးပြီး `values.yaml` ဖိုင်တစ်ခုတည်းဖြင့် တန်ဖိုးများကို အလွယ်တကူ လဲလှယ်ထည့်သွင်းပေးနိုင်ပါသည်။

---

## ၂။ Helm Chart တစ်ခု၏ တည်ဆောက်ပုံ

```text
my-laravel-chart/
├── Chart.yaml              # Chart ၏ အမည်၊ Version နှင့် ဖော်ပြချက်
├── values.yaml             # Default configuration တန်ဖိုးများ
└── templates/              # Dynamic Kubernetes Manifest Templates များ
    ├── deployment.yaml     # {{ .Values.replicaCount }} စသည်ဖြင့် template ရေးထားသည်
    ├── service.yaml
    ├── ingress.yaml
    └── _helpers.tpl        # ပြန်လည်အသုံးချနိုင်သော Go template functions များ
```

---

### 📄 `values.yaml` နမူနာ:
```yaml
replicaCount: 3

image:
  repository: ghcr.io/mycompany/laravel-app
  pullPolicy: IfNotPresent
  tag: "v1.2.0"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  host: mylaravelapp.com
  tls: true

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

### 📄 `templates/deployment.yaml` ထဲတွင် ချိတ်ဆက်ပုံ:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-laravel
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

---

## ၃။ Helm CLI အသုံးများသော Commands များ

```bash
# Chart အသစ်တစ်ခု စတင်ဆောက်လုပ်ခြင်း
helm create my-laravel-chart

# Chart အား Cluster ပေါ်သို့ စတင် Install လုပ်ခြင်း (Release Name ပေး၍)
helm install laravel-prod ./my-laravel-chart -f values-production.yaml -n production

# Version အသစ် Deploy လုပ်ခြင်း (Upgrade)
helm upgrade laravel-prod ./my-laravel-chart --set image.tag="v1.3.0" -n production

# Deploy လုပ်ထားသော Releases စာရင်းနှင့် History ကြည့်ခြင်း
helm list -n production
helm history laravel-prod -n production

# ⚡ အမှားအယွင်းဖြစ်ပါက ယခင် Version သို့ ၁ စက္ကန့်အတွင်း ပြန်လှည့်ခြင်း (Instant Rollback)
helm rollback laravel-prod 1 -n production

# Release အား Cluster မှ ပြန်လည် ဖျက်ပစ်ခြင်း
helm uninstall laravel-prod -n production
```
