---
title: "15. Ingress Controllers And Routing"
description: "1. [Ingress ဆိုတာဘာလဲ? ဘာကြောင့် LoadBalancer Service ထက် သာလွန်သလဲ?](#၁-ingress-ဆိုတာဘာလဲ)"
---

## ☸️ သင်ခန်းစာ (၁၅) - Ingress Controllers နှင့် HTTP Traffic Routing
### (Lesson 15: Ingress Architecture, Nginx Ingress Controller, Host/Path Routing & SSL/TLS)

---

## 📌 မာတိကာ (Contents)
1. [Ingress ဆိုတာဘာလဲ? ဘာကြောင့် LoadBalancer Service ထက် သာလွန်သလဲ?](#၁-ingress-ဆိုတာဘာလဲ)
2. [Ingress Resource vs Ingress Controller (အရေးကြီးသော ကွာခြားချက်)](#၂-ingress-resource-vs-ingress-controller)
3. [Ingress Architecture အလုပ်လုပ်ပုံ Diagram](#၃-ingress-architecture-အလုပ်လုပ်ပုံ-diagram)
4. [Routing ပုံစံ ၂ မျိုး (Host-Based vs Path-Based Routing)](#၄-routing-ပုံစံ-၂-မျိုး)
5. [လက်တွေ့ Production Ingress YAML Manifest ရေးဆွဲခြင်း](#၅-လက်တွေ့-production-ingress-yaml-manifest)
6. [SSL/TLS Certificate တပ်ဆင်ခြင်း (Cert-Manager & Let's Encrypt)](#၆-ssltls-certificate-တပ်ဆင်ခြင်း)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Ingress ဆိုတာဘာလဲ?

ယခင်သင်ခန်းစာတွင် လေ့လာခဲ့သော `LoadBalancer` Service ကို Service တစ်ခုစီတိုင်းအတွက် သုံးစွဲမည်ဆိုပါက AWS သို့မဟုတ် Google Cloud တွင် Service ၁၀ ခုအတွက် Cloud Load Balancer ၁၀ လုံး ပေးဆောင်ရမည်ဖြစ်ပြီး တစ်လလျှင် ဒေါ်လာ ရာပေါင်းများစွာ ကုန်ကျပါလိမ့်မည်။

**Ingress** သည် Cloud Load Balancer **တစ်ခုတည်း (Single IP)** ကိုသာ အသုံးပြုပြီး၊ ထိုတစ်ခုတည်းသော IP သို့ ဝင်လာသမျှ Traffic များကို:
* Domain Name အလိုက် (ဥပမာ- `api.myshop.com` သို့မဟုတ် `shop.com`)
* URL Path လမ်းကြောင်းအလိုက် (ဥပမာ- `/api` သို့မဟုတ် `/payment`)
ခွဲခြားကာ Cluster အတွင်းရှိ သက်ဆိုင်ရာ `ClusterIP` Service များဆီသို့ ဉာဏ်ရည်ထက်မြက်စွာ လမ်းလွှဲပေးသည့် **Smart HTTP/HTTPS Layer 7 Reverse Proxy Router** ဖြစ်ပါသည်။

---

## ၂။ Ingress Resource vs Ingress Controller

ဤအပိုင်းကို ရှင်းလင်းစွာ သဘောပေါက်ထားရန် လိုအပ်သည်:
1. **Ingress Resource**:
   * "မည်သည့် Domain လာလျှင် မည်သည့် Service သို့ ပို့ပါ" ဟု Developer က ရေးသားသော **YAML စည်းမျဉ်းဖိုင် (Rules)** သာ ဖြစ်သည်။ ၎င်းကိုယ်တိုင် Traffic မလွှဲနိုင်ပါ။
2. **Ingress Controller**:
   * အဆိုပါ YAML စည်းမျဉ်းများကို လက်တွေ့ အကောင်အထည်ဖော်ပေးသော တကယ့် **Reverse Proxy Software (ဥပမာ- Ingress-Nginx, Traefik, HAProxy, Envoy)** ဖြစ်သည်။
   * Ingress Controller မသွင်းထားပါက Ingress YAML တင်သော်လည်း မည်သည့်အလုပ်မျှ ဖြစ်ပေါ်မည် မဟုတ်ပါ။

---

## ၃။ Ingress Architecture အလုပ်လုပ်ပုံ Diagram

```
                              [ INTERNET / CLIENTS ]
                                         │
                                         ▼ (Single Cloud LoadBalancer IP)
┌────────────────────────────────────────────────────────────────────────┐
│                        INGRESS CONTROLLER                              │
│                    (e.g., NGINX Ingress Controller)                    │
│                                                                        │
│  RULES CHECK:                                                          │
│  - If host == "shop.com"        ──► Forward to frontend-service:80     │
│  - If host == "api.shop.com"    ──► Forward to backend-api-service:8080│
│  - If path == "/admin"          ──► Forward to admin-service:80        │
└───────────────┬────────────────────────┬───────────────────────┬───────┘
                │                        │                       │
                ▼                        ▼                       ▼
      ┌──────────────────┐     ┌──────────────────┐    ┌─────────────────┐
      │ frontend-service │     │backend-api-servi │    │  admin-service  │
      │   (ClusterIP)    │     │   (ClusterIP)    │    │   (ClusterIP)   │
      └─────────┬────────┘     └────────┬─────────┘    └────────┬────────┘
                ▼                       ▼                       ▼
           [ App Pods ]            [ API Pods ]           [ Admin Pods ]
```

---

## ၄။ Routing ပုံစံ ၂ မျိုး

### ၄.၁။ Host-Based Routing (Domain အလိုက် ခွဲခြားခြင်း)
* `example.com` ──► Web Frontend Service
* `api.example.com` ──► Backend Laravel API Service
* `auth.example.com` ──► Authentication Service

### ၄.၂။ Path-Based Routing (URL လမ်းကြောင်းအလိုက် ခွဲခြားခြင်း)
* `example.com/` ──► Web Frontend
* `example.com/api/v1` ──► Backend API
* `example.com/billing` ──► Payment Service

---

## ၅။ လက်တွေ့ Production Ingress YAML Manifest

`enterprise-ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: enterprise-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "20m" # File Upload limit
spec:
  tls:
    - hosts:
        - example.com
        - api.example.com
      secretName: example-tls-secret # SSL Certificate သိမ်းထားသော Secret အမည်
  rules:
    # Rule 1: Main Frontend Website
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

    # Rule 2: Backend API Subdomain
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backend-api-service
                port:
                  number: 8000
```

### Apply ပြုလုပ်ပြီး Ingress IP စစ်ဆေးခြင်း:
```bash
kubectl apply -f enterprise-ingress.yaml
kubectl get ingress
```
`ADDRESS` အကွက်တွင် External IP ပေါ်လာပါက Domain DNS တွင် ၎င်း IP အား A Record အဖြစ် ထည့်သွင်းပေးရမည်။

---

## ၆။ SSL/TLS Certificate တပ်ဆင်ခြင်း

### နည်းလမ်း (က): ကိုယ်ပိုင် SSL Secret ဖန်တီးခြင်း
```bash
kubectl create secret tls example-tls-secret \
  --cert=path/to/fullchain.pem \
  --key=path/to/privkey.pem
```

### နည်းလမ်း (ခ): `cert-manager` ဖြင့် Let's Encrypt အခမဲ့ SSL အလိုအလျောက် သက်တမ်းတိုးခြင်း (Best Practice)
Production တွင် **cert-manager** ကို အသုံးပြုပါက SSL Certificate ကို Let's Encrypt ထံမှ အလိုအလျောက် တောင်းယူပေးပြီး ရက်ပေါင်း ၉၀ တိုင်း အလိုအလျောက် သက်တမ်းတိုးပေးပါသည်:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      - http01:
          ingress:
            class: nginx
```
Ingress YAML တွင် `cert-manager.io/cluster-issuer: "letsencrypt-prod"` annotation ထည့်လိုက်ရုံဖြင့် HTTPS အလိုအလျောက် အသက်ဝင်သွားမည် ဖြစ်ပါသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အကြောင်းအရာ | စစ်ဆေးရန် | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Ingress Controller** | Cluster ထဲတွင် Nginx Ingress Controller အသင့်သွင်းထားပြီးပြီလား? | [ ] |
| **Cost Optimization** | Service တိုင်းကို LoadBalancer မသုံးဘဲ Ingress ဖြင့် တစ်ခုတည်း ချုံ့ထားသလား? | [ ] |
| **SSL Redirection** | HTTP မှ HTTPS သို့ အလိုအလျောက် Redirect annotation ထည့်ထားသလား? | [ ] |
| **Upload Limit** | File upload များအတွက် `proxy-body-size` သတ်မှတ်ထားသလား? | [ ] |

နောက်သင်ခန်းစာ [16_configmaps_and_secrets.md](/devops/02_kubernetes_and_cloud/16_configmaps_and_secrets/) တွင် Application ၏ Settings များနှင့် လျှို့ဝှက် Passwords များကို စနစ်တကျ ခွဲထုတ်သိမ်းဆည်းမည့် ConfigMaps & Secrets အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
