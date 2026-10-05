---
title: "18. Helm Package Manager"
description: "1. [ပြဿနာ - YAML Hell (YAML ဖိုင် ရာနှင့်ချီ ပွားများရှုပ်ထွေးလာခြင်း)](#၁-ပြဿနာ---yaml-hell)"
---

## ☸️ သင်ခန်းစာ (၁၈) - Helm Package Manager (Kubernetes ၏ Apt / Composer)
### (Lesson 18: The YAML Hell Problem, Helm 3 Architecture, Charts, Values & Custom Charts)

---

## 📌 မာတိကာ (Contents)
1. [ပြဿနာ - YAML Hell (YAML ဖိုင် ရာနှင့်ချီ ပွားများရှုပ်ထွေးလာခြင်း)](#၁-ပြဿနာ---yaml-hell)
2. [Helm ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၂-helm-ဆိုတာဘာလဲ)
3. [Helm 3 Architecture (Chart, Values, Release)](#၃-helm-3-architecture)
4. [မဖြစ်မနေ သိထားရမည့် Helm CLI Commands များ](#၄-မဖြစ်မနေ-သိထားရမည့်-helm-cli-commands)
5. [Helm Chart Directory Structure ဖွဲ့စည်းပုံ](#၅-helm-chart-directory-structure)
6. [လက်တွေ့ Production Lab: ကိုယ်ပိုင် Custom Helm Chart ရေးဆွဲခြင်း](#၆-လက်တွေ့-production-lab)
7. [Environment အလိုက် Deploy ပြုလုပ်ခြင်း (`values-dev.yaml` vs `values-prod.yaml`)](#၇-environment-အလိုက်-deploy-ပြုလုပ်ခြင်း)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ ပြဿနာ - YAML Hell

တကယ့် လုပ်ငန်းခွင်တွင် Service တစ်ခု Deploy လုပ်ရန်အတွက် YAML ဖိုင် ၇ ခုခန့် (Deployment, Service, Ingress, ConfigMap, Secret, HPA, PVC) လိုအပ်ပါသည်။

အကယ်၍ သင့်တွင် Microservices ၁၀ ခုရှိပြီး Environment ၃ ခု (Development, Staging, Production) အတွက် Deploy လုပ်မည်ဆိုပါက YAML ဖိုင်ပေါင်း **၂၀၀ ကျော်** ဖြစ်လာပြီး:
* Port ပြောင်းလိုပါက ဖိုင်အားလုံး လိုက်ပြင်ရခြင်း။
* Image Tag အသစ်တင်လိုပါက ဖိုင်တိုင်းတွင် လိုက်ပြင်ရသဖြင့် Typo Error ဖြစ်လွယ်ခြင်း။
* ဗားရှင်း အဟောင်းသို့ Rollback ပြုလုပ်ရန် ခက်ခဲခြင်း စသည့် **YAML Hell** ပြဿနာ ကြုံရသည်။

---

## ၂။ Helm ဆိုတာဘာလဲ?

Ubuntu အတွက် `apt`၊ PHP အတွက် `composer`၊ Node.js အတွက် `npm` ရှိသကဲ့သို့ပင် —  
**Helm** သည် **Kubernetes အတွက် Package Manager (အထုပ်လိုက် စီမံခန့်ခွဲသူ)** ဖြစ်ပါသည်။

Helm သည် YAML ဖိုင်များကို Hardcode အသေမရေးဘဲ **Go Template Variables** များဖြင့် ပြောင်းလဲပေးနိုင်ပြီး၊ Parameters ဖိုင် (`values.yaml`) တစ်ခုတည်းကို ပြောင်းလဲရုံဖြင့် Development, Staging နှင့် Production တို့ဆီသို့ တစ်ချက်တည်း Deploy / Upgrade / Rollback ပြုလုပ်ပေးနိုင်ပါသည်။

---

## ၃။ Helm 3 Architecture

Helm 3 တွင် အဓိက သဘောတရား ၃ ခု ရှိပါသည်:

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│           HELM CHART            │   +   │           VALUES.YAML           │
│   (Reusable Template Files)     │       │   (Dynamic Configurations)      │
│   templates/deployment.yaml     │       │   replicaCount: 3               │
│   templates/service.yaml        │       │   image: myapp:v2.0             │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 └───────────────────┬─────────────────────┘
                                     │ helm install / upgrade
                                     ▼
                 ┌─────────────────────────────────────────┐
                 │              HELM RELEASE               │
                 │   (Running Instance in Kubernetes)      │
                 └─────────────────────────────────────────┘
```

1. **Chart**: Kubernetes Manifest ဖိုင်များ ပါဝင်သော Template အထုပ် (Package)။
2. **Values (`values.yaml`)**: Template ထဲသို့ ထည့်သွင်းပေးမည့် Config တန်ဖိုးများ (Variables)။
3. **Release**: Cluster ထဲတွင် အမှန်တကယ် Run နေသော Chart ၏ အမည်တပ် ထုတ်ဝေမှု (Instance)။

---

## ၄။ မဖြစ်မနေ သိထားရမည့် Helm CLI Commands

### (က) Public Charts များ သွင်းယူခြင်း (ဥပမာ- Ingress, Redis, MySQL):
```bash
# Bitnami Repository ထည့်သွင်းခြင်း
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Redis ကို Cluster ထဲသို့ command တစ်ချက်တည်းဖြင့် Install ပြုလုပ်ခြင်း
helm install my-redis bitnami/redis
```

### (ခ) Release များ စီမံခန့်ခွဲခြင်း:
```bash
# လက်ရှိ Install လုပ်ထားသော Releases စာရင်းကြည့်ခြင်း
helm list

# Config ပြောင်းလဲပြီး Release ကို Upgrade ပြုလုပ်ခြင်း
helm upgrade my-app ./my-chart -f values-prod.yaml

# Error တက်ပါက ယခင် Revision သို့ Instant Rollback ပြုလုပ်ခြင်း
helm rollback my-app 1

# Release တစ်ခုလုံးကို ပြန်လည် ဖျက်ပစ်ခြင်း (Clean Uninstall)
helm uninstall my-app
```

---

## ၅။ Helm Chart Directory Structure

ကိုယ်ပိုင် Chart အသစ် တည်ဆောက်ရန်:
```bash
helm create my-laravel-chart
```

ဖန်တီးလိုက်သော ဖိုဒါ ဖွဲ့စည်းပုံ:
```
my-laravel-chart/
├── Chart.yaml          # Chart ၏ အမည်၊ ဗားရှင်း စသည့် Metadata
├── values.yaml         # Default Variable တန်ဖိုးများ သတ်မှတ်ရာ နေရာ
├── charts/             # အခြား Dependency Charts များ ထားရာနေရာ
└── templates/          # Kubernetes YAML Templates များ
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    └── _helpers.tpl
```

---

## ၆။ လက်တွေ့ Production Lab: Template ရေးဆွဲခြင်း

`templates/deployment.yaml` တွင် Hardcode တန်ဖိုးများ အစား Template Variables သုံးထားပုံ:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
            - containerPort: {{ .Values.service.port }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

---

## ၇။ Environment အလိုက် Deploy ပြုလုပ်ခြင်း

Developer များသည် YAML Template ကို လုံးဝ ထိစရာမလိုဘဲ `values` ဖိုင်ကိုသာ ခွဲခြားထားပါသည်:

### `values-dev.yaml`:
```yaml
replicaCount: 1
image:
  repository: myusername/laravel-app
  tag: dev-latest
resources:
  requests:
    cpu: 50m
    memory: 64Mi
```

### `values-prod.yaml`:
```yaml
replicaCount: 5
image:
  repository: myusername/laravel-app
  tag: v1.5.0
resources:
  requests:
    cpu: 250m
    memory: 512Mi
```

### Deploy လုပ်ပုံ:
```bash
# Staging / Dev သို့ တင်ရန်
helm upgrade --install my-app ./my-laravel-chart -f values-dev.yaml

# Production သို့ တင်ရန်
helm upgrade --install my-app ./my-laravel-chart -f values-prod.yaml
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အသုံးပြုပုံ |
| :--- | :--- |
| **Open Source Tools များ တပ်ဆင်ရန် (Redis/Nginx-Ingress)** | Public Helm Repo မှ `helm install` သုံးပါ |
| **ကိုယ်ပိုင် Microservices များ စီမံရန်** | Custom Helm Chart ဖန်တီးပြီး Templates သုံးပါ |
| **Dev / Staging / Prod ခွဲခြားရန်** | `values-dev.yaml` နှင့် `values-prod.yaml` သီးခြားထားပါ |
| **Version Rollback** | `helm rollback <release> <revision>` ဖြင့် စက္ကန့်ပိုင်းဖြင့် ပြန်ဆုတ်ပါ |

နောက်သင်ခန်းစာ [19_rbac_security_and_hardening.md](/devops/02_kubernetes_and_cloud/19_rbac_security_and_hardening/) တွင် Cluster လုံခြုံရေး၊ Access Control (RBAC) နှင့် Network Policies အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
