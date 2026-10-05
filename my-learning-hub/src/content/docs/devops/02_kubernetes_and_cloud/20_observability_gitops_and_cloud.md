---
title: "20. Observability Gitops And Cloud"
description: "1. [Production Observability ၏ မဏ္ဍိုင် ၃ ရပ် (Metrics, Logs, Traces)](#၁-observability-၏-မဏ္ဍိုင်-၃-ရပ်)"
---

## ☸️ သင်ခန်းစာ (၂၀) - Production Observability၊ GitOps နှင့် Managed Cloud Kubernetes
### (Lesson 20: Prometheus/Grafana, Loki, GitOps with ArgoCD & AWS EKS / GCP GKE)

---

## 📌 မာတိကာ (Contents)
1. [Production Observability ၏ မဏ္ဍိုင် ၃ ရပ် (Metrics, Logs, Traces)](#၁-observability-၏-မဏ္ဍိုင်-၃-ရပ်)
2. [Metrics Monitoring (Prometheus နှင့် Grafana)](#၂-metrics-monitoring-prometheus-နှင့်-grafana)
3. [Centralized Logging (Loki နှင့် Fluent Bit)](#၃-centralized-logging-loki-နှင့်-fluent-bit)
4. [ခေတ်သစ် GitOps Deployment စနစ် (ArgoCD ဖြင့် အလိုအလျောက် Deploy ခြင်း)](#၄-ခေတ်သစ်-gitops-deployment-စနစ်-argocd)
5. [Managed Kubernetes in Cloud (AWS EKS, GCP GKE, DigitalOcean)](#၅-managed-kubernetes-in-cloud)
6. [Cluster Backup နှင့် Disaster Recovery (Velero)](#၆-cluster-backup-နှင့်-disaster-recovery)
7. [Enterprise End-to-End Production Architecture Diagram](#၇-enterprise-production-architecture-diagram)
8. [သင်တန်းဆင်း လုပ်ငန်းခွင်သုံး Master Checklist](#၈-သင်တန်းဆင်း-လုပ်ငန်းခွင်သုံး-master-checklist)

---

## ၁။ Observability ၏ မဏ္ဍိုင် ၃ ရပ်

Enterprise စနစ်ကြီးတစ်ခုတွင် Pod ပေါင်း ရာချီ ပြေးနေသည့်အခါ "ဆာဗာ နှေးနေသလား? Error ဘယ်ကတက်နေသလဲ?" ကို စစ်ဆေးရန် အချက် ၃ ချက် လိုအပ်သည်:

```
                  ┌───────────────────────────────┐
                  │    CLOUD-NATIVE OBSERVABILITY │
                  └───────────────┬───────────────┘
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐    ┌──────────────────┐
│     METRICS      │     │       LOGS       │    │     TRACES       │
│  (ကိန်းဂဏန်းများ)  │     │   (မှတ်တမ်းများ)   │    │ (ခရီးစဉ်ခြေရာခံ) │
│ CPU, RAM, Latency│     │ Error, Warnings  │    │ End-to-End Flow  │
│ Prometheus/Grafana│    │ FluentBit + Loki │    │ OpenTelemetry    │
└──────────────────┘     └──────────────────┘    └──────────────────┘
```

---

## ၂။ Metrics Monitoring (Prometheus နှင့် Grafana)

* **Prometheus**: Cluster အတွင်းရှိ Nodes နှင့် Pods များထံမှ CPU %, Memory, Disk I/O, Network Traffic ဒေတာများကို စက္ကန့်ပိုင်းအလိုက် လှမ်းဆွဲယူ (Scrape) သော Time-Series Database ဖြစ်သည်။
* **Grafana**: Prometheus ထံမှ Data များကို လှပသော UI Dashboard များ (Chart, Graphs, Gauges) ဖြင့် ပြသပေးပြီး၊ CPU 90% ကျော်ပါက Telegram / Slack သို့ အလိုအလျောက် Alert ပို့ပေးသည်။

---

## ③။ Centralized Logging (Loki နှင့် Fluent Bit)

Pod ပေါင်း ရာချီရှိနေသည့်အခါ `kubectl logs` လိုက်ကြည့်၍ မဖြစ်နိုင်တော့ပါ။
* **Fluent Bit**: Pod များ၏ Container Log များကို စုဆောင်းပေးသည်။
* **Grafana Loki**: Log များကို စုစည်းသိမ်းဆည်းပေးပြီး Grafana Dashboard ပေါ်တွင် Log Keyword (ဥပမာ- `error 500`) များကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေဖတ်ရှုနိုင်စေသည်။

---

## ၄။ ခေတ်သစ် GitOps Deployment စနစ် (ArgoCD)

ယခင်က CI/CD Pipeline က `kubectl apply` ဟု Cluster ထဲသို့ Push ပေးခဲ့ရသည် (Push-based)။

**GitOps (ArgoCD)** တွင်မူ:
1. **Git Repository** သည် အမှန်တရား၏ တစ်ခုတည်းသော ရင်းမြစ် (Single Source of Truth) ဖြစ်သည်။
2. Cluster အတွင်းရှိ **ArgoCD Operator** က Git Repository ကို အမြဲ စောင့်ကြည့်နေသည်။
3. Developer က Git တွင် Version အသစ် commit တင်လိုက်သည်နှင့် ArgoCD က Cluster ကို အလိုအလျောက် Sync လုပ်ပေးသည်။
4. အကယ်၍ တစ်စုံတစ်ယောက်က Cluster ထဲတွင် လက်ဖြင့် သွားပြင်ပါက ArgoCD က ချက်ချင်း သိရှိပြီး မူလ Git အတိုင်း ပြန်လည် အမှန်ပြင်ပေးသည် (Self-Healing Drift Detection)။

---

## ၅။ Managed Kubernetes in Cloud

လုပ်ငန်းခွင်တွင် Control Plane (Master Node, etcd) ကို ကိုယ်တိုင် တပ်ဆင်ထိန်းသိမ်းစရာ မလိုဘဲ Cloud Provider များက အပြည့်အဝ တာဝန်ယူပေးသော **Managed Kubernetes** ကို အသုံးပြုကြပါသည်:

1. **AWS EKS (Elastic Kubernetes Service)**: AWS Cloud နှင့် တိုက်ရိုက်ချိတ်ဆက်ရာတွင် ကမ္ဘာ့အသုံးအများဆုံး။
2. **Google Cloud GKE (Google Kubernetes Engine)**: Kubernetes မွေးဖွားရာ Google ဖြစ်သဖြင့် အမြန်ဆန်ဆုံးနှင့် အလွယ်ကူဆုံး။
3. **DigitalOcean / Linode K8s**: ကုန်ကျစရိတ် သက်သာပြီး Startups များနှင့် အသေးစား SME များအတွက် အသင့်တော်ဆုံး။

---

## ၆။ Cluster Backup နှင့် Disaster Recovery (Velero)

စနစ်တစ်ခုလုံး မတော်တဆ ပျက်စီးသွားပါက မိနစ်ပိုင်းအတွင်း ပြန်လည်ထူမတ်နိုင်ရန် **Velero** ကို အသုံးပြုကြသည်။

Velero သည် Cluster အတွင်းရှိ YAML Manifests အားလုံးနှင့် Persistent Volume Disks အားလုံးကို AWS S3 သို့ အလိုအလျောက် Backup ဆွဲပေးနိုင်ပါသည်။

---

## ၇။ Enterprise End-to-End Production Architecture Diagram

```
[ DEVELOPER ]
     │ (1) git push
     ▼
┌───────────────────────┐
│     GITHUB REPO       │ ◄── Single Source of Truth
└───────────┬───────────┘
            │ (2) Trigger Webhook
            ▼
┌───────────────────────┐
│  GITHUB ACTIONS CI    │ ──► Build, Scan (Trivy), Multi-arch Push
└───────────┬───────────┘
            │ (3) Push Image
            ▼
┌───────────────────────┐
│ CONTAINER REGISTRY    │ (AWS ECR / GHCR / Docker Hub)
└───────────────────────┘
            ▲
            │ (4) Pull Image
┌───────────┴────────────────────────────────────────────────────────────┐
│                    PRODUCTION KUBERNETES CLUSTER                       │
│                                                                        │
│   ┌──────────────────┐                                                 │
│   │     ARGOCD       │ ◄── Auto-Sync Git Manifests (GitOps)            │
│   └─────────┬────────┘                                                 │
│             ▼                                                          │
│   ┌──────────────────┐          ┌───────────────────────────────────┐  │
│   │ Nginx Ingress    │◄────────►│ Web Pods (Laravel / Node)         │  │
│   │ (SSL/TLS HTTPS)  │          │ Auto-Scaled by HPA                │  │
│   └──────────────────┘          └─────────────────┬─────────────────┘  │
│                                                   ▼                    │
│   ┌──────────────────┐                  ┌───────────────────┐          │
│   │ Prometheus/Loki  │                  │ MySQL / Postgres  │          │
│   │ (Monitoring)     │                  │ (PVC Cloud Disk)  │          │
│   └──────────────────┘                  └───────────────────┘          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ၈။ သင်တန်းဆင်း လုပ်ငန်းခွင်သုံး Master Checklist

ဂုဏ်ယူပါသည်! သင်သည် Docker & Kubernetes Beginner to Master သင်ရိုးတစ်ခုလုံးကို အောင်မြင်စွာ ပြီးမြောက်ခဲ့ပြီ ဖြစ်ပါသည်။

လုပ်ငန်းခွင်တွင် Production Deploy မလုပ်မီ အောက်ပါ အချက်များကို အမြဲ စစ်ဆေးပါ:

- [ ] **Docker Images**: Multi-stage build ဖြင့် ပြုလုပ်ထားပြီး Image size သေးငယ်သလား?
- [ ] **Security**: Image ကို Non-root user ဖြင့် run ပြီး Trivy scan စစ်ဆေးပြီးပြီလား?
- [ ] **High Availability**: Deployment တွင် အနည်းဆုံး Replicas ၂ လုံး သို့မဟုတ် ၃ လုံး ထားရှိသလား?
- [ ] **Health Checks**: Liveness နှင့် Readiness Probes သတ်မှတ်ထားသလား?
- [ ] **Resource Limits**: CPU နှင့် Memory Request/Limits သတ်မှတ်ထားသလား?
- [ ] **Zero-Downtime**: RollingUpdate strategy ဖြင့် Downtime မရှိအောင် စီစဉ်ထားသလား?
- [ ] **Persistent Data**: Database များအတွက် StorageClass နှင့် PVC သုံးထားသလား?
- [ ] **Routing & SSL**: Ingress Controller ဖြင့် HTTPS (Let's Encrypt) ဖွင့်လှစ်ထားသလား?
- [ ] **Configuration**: Passwords များကို Secret ထဲတွင် ခွဲထုတ်ထားသလား?
- [ ] **Monitoring & Alerts**: Prometheus & Grafana တပ်ဆင်ထားပြီး Alert စနစ် ချိန်ညှိပြီးပြီလား?
