---
title: "19. Rbac Security And Hardening"
description: "1. [Kubernetes Security ၏ အဓိက အခြေခံ (Authentication vs Authorization)](#၁-authentication-vs-authorization)"
---

## ☸️ သင်ခန်းစာ (၁၉) - RBAC၊ Cluster Security နှင့် Network Policies
### (Lesson 19: Role-Based Access Control, ServiceAccounts, NetworkPolicies & Pod Security)

---

## 📌 မာတိကာ (Contents)
1. [Kubernetes Security ၏ အဓိက အခြေခံ (Authentication vs Authorization)](#၁-authentication-vs-authorization)
2. [RBAC (Role-Based Access Control) သဘောတရားများ](#၂-rbac-သဘောတရားများ)
   - [၂.၁။ Role vs ClusterRole](#၂၁-role-vs-clusterrole)
   - [၂.၂။ RoleBinding vs ClusterRoleBinding](#၂၂-rolebinding-vs-clusterrolebinding)
   - [၂.၃။ Verbs နှင့် Resources (ခွင့်ပြုချက်များ သတ်မှတ်ပုံ)](#၂၃-verbs-နှင့်-resources)
3. [ServiceAccounts (ကွန်ပျူတာ ပရိုဂရမ်များနှင့် CI/CD အတွက် Account)](#၃-serviceaccounts)
4. [လက်တွေ့ RBAC Manifest: Junior Developer တစ်ဦးအတွက် View-Only အခွင့်အရေး ပေးခြင်း](#၄-လက်တွေ့-rbac-manifest)
5. [Network Policies ဖြင့် Zero-Trust ကွန်ရက် လုံခြုံရေး တည်ဆောက်ခြင်း](#၅-network-policies-ဖြင့်-ကွန်ရက်လုံခြုံရေး)
6. [Pod Security Standards နှင့် `securityContext`](#၆-pod-security-standards-နှင့်-securitycontext)
7. [လုပ်ငန်းခွင်သုံး Security Checklist](#၇-လုပ်ငန်းခွင်သုံး-security-checklist)

---

## ၁။ Authentication vs Authorization

Kubernetes API Server သို့ Request တစ်ခု လာသည့်အခါ အဆင့် ၂ ဆင့် စစ်ဆေးသည်:

1. **Authentication (သင် ဘယ်သူလဲ?)**:
   * Client Certificate, OIDC Token (Google/Okta), သို့မဟုတ် ServiceAccount Token ဖြင့် လူမှန်/မမှန် အတည်ပြုခြင်း။
2. **Authorization (သင် ဘာလုပ်ခွင့်ရှိသလဲ?)**:
   * ထိုသူသည် Pod ကို ဖျက်ခွင့် ရှိသလား? Secret ကို ကြည့်ခွင့် ရှိသလား? ဟု စစ်ဆေးခြင်း။ ဤနေရာတွင် **RBAC** ကို အသုံးပြုပါသည်။

---

## ၂။ RBAC (Role-Based Access Control) သဘောတရားများ

```
┌────────────────────────┐      ┌────────────────────────┐
│        SUBJECT         │      │          ROLE          │
│ (User: aung-aung)      │      │ (Rules: Can Get/List)  │
│ (ServiceAccount: ci-bot│      │ (Resource: Pods/Logs)  │
└───────────┬────────────┘      └───────────┬────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │ ချိတ်ဆက်ပေးခြင်း
                            ▼
              ┌───────────────────────────┐
              │        ROLEBINDING        │
              │ "Aung Aung has Developer" │
              └───────────────────────────┘
```

### ၂.၁။ Role vs ClusterRole
* **`Role`**: သီးခြား **Namespace တစ်ခုအတွင်း၌သာ** အကျုံးဝင်သော ခွင့်ပြုချက် (ဥပမာ- `staging` namespace ထဲတွင်သာ Pod ဖန်တီးခွင့်)။
* **`ClusterRole`**: Cluster တစ်ခုလုံးရှိ **Namespace အားလုံးနှင့် Cluster-scoped Resources** (ဥပမာ- Nodes, StorageClasses) အားလုံးတွင် အကျုံးဝင်သော ခွင့်ပြုချက်။

### ၂.၂။ Verbs (လုပ်ပိုင်ခွင့်များ)
* `get`, `list`, `watch` (ဖတ်ရှုခွင့်)
* `create`, `update`, `patch` (ဖန်တီး၊ ပြင်ဆင်ခွင့်)
* `delete` (ဖျက်ဆီးခွင့်)

---

## ၃။ ServiceAccounts

လူသားများအတွက် User Account သုံးသကဲ့သို့ပင် Kubernetes အတွင်းရှိ Pod များ၊ CI/CD Pipeline (GitHub Actions / GitLab) များသည် API Server သို့ လှမ်းခေါ်လိုသည့်အခါ **ServiceAccount** ကို အသုံးပြုကြပါသည်။

---

## ၄။ လက်တွေ့ RBAC Manifest: Junior Developer အား Pod ကြည့်ခွင့်သာပေးခြင်း

`developer-rbac.yaml`:

```yaml
# အဆင့် ၁: Pod နှင့် Logs ဖတ်ခွင့်သာရှိသော Role ဖန်တီးခြင်း
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: pod-reader-role
rules:
  - apiGroups: [""] # Core API group
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"] # ဖျက်ခွင့် (delete) မပါဝင်ပါ!

---
# အဆင့် ၂: ထို Role အား developer user နှင့် ချိတ်ဆက်ခြင်း
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: development
subjects:
  - kind: User
    name: junior-dev
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader-role
  apiGroup: rbac.authorization.k8s.io
```

---

## ၅။ Network Policies ဖြင့် Zero-Trust ကွန်ရက် လုံခြုံရေး

Default အားဖြင့် Kubernetes တွင် Pod တစ်ခုသည် အခြား မည်သည့် Pod နှင့်မဆို တိုက်ရိုက် စကားပြောနိုင်ပါသည်။

အကယ်၍ Hacker သည် Frontend Web Pod ကို ဖောက်ထွင်းမိပါက Database ဆီသို့ တိုက်ရိုက် လှမ်းဆက်သွယ်ပြီး Data များ ခိုးယူနိုင်သည် (Lateral Movement Attack)။

**NetworkPolicy** ဖြင့် Database သို့ **Backend API Pod မှလွဲ၍ မည်သည့် Pod မှ လှမ်းခေါ်၍ မရအောင်** ပိတ်ဆို့ထားနိုင်ပါသည်:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-backend-to-db-only
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: mysql-db # Database Pod ကို အကာအကွယ်ပေးမည်
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend-api # Backend Pod တစ်ခုတည်းကိုသာ ဝင်ခွင့်ပြုသည်
      ports:
        - protocol: TCP
          port: 3306
```

---

## ၆။ Pod Security Standards နှင့် `securityContext`

Pod တစ်ခုချင်းစီတွင် Root မသုံးရန်နှင့် Linux Privileges များကို တင်းကျပ်စွာ ပိတ်ဆို့ရန်:

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 10001
  containers:
    - name: hardened-app
      image: myapp:1.0
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Security Checklist

| လုံခြုံရေး စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :---: |
| **Least Privilege (အနည်းဆုံး အာဏာသာပေးခြင်း)** | Developer များကို ClusterAdmin မပေးဘဲ သက်ဆိုင်ရာ Role သာ ပေးထားသလား? | [ ] |
| **No Secrets in Role** | သာမန် developer များကို `secrets` ကြည့်ခွင့်/ဖတ်ခွင့် ပိတ်ထားသလား? | [ ] |
| **Network Isolation** | Database များဆီသို့ Frontend မှ တိုက်ရိုက် မခေါ်နိုင်အောင် NetworkPolicy သတ်မှတ်ထားသလား? | [ ] |
| **Non-Root Pods** | Pod များတွင် `runAsNonRoot: true` ထည့်သွင်းထားသလား? | [ ] |

နောက်ဆုံးသင်ခန်းစာ [20_observability_gitops_and_cloud.md](/devops/02_kubernetes_and_cloud/20_observability_gitops_and_cloud/) တွင် Monitoring (Prometheus & Grafana), GitOps (ArgoCD) နှင့် Cloud Managed K8s (AWS EKS) အကြောင်းကို လေ့လာပါမည်။
