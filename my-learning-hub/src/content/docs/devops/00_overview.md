---
title: "DevOps Course Overview"
description: "ဤလက်စွဲစာအုပ်နှင့် သင်ခန်းစာများသည် Docker (Containerization) နှင့် Kubernetes (Container Orchestration) တို့ကို လုံးဝ မသိသေးသော အခြေခံ (Beginner Level) မှစ၍ လု"
---

## 🐳☸️ Docker & Kubernetes Beginner to Master: လုပ်ငန်းခွင်လက်တွေ့သုံး အဆင့်ဆင့် ပြည့်စုံသော လမ်းညွှန်
### (The Complete Enterprise Containerization & Kubernetes Orchestration Guide)

---

## 📌 မိတ်ဆက် (Course Overview)

ဤလက်စွဲစာအုပ်နှင့် သင်ခန်းစာများသည် **Docker (Containerization)** နှင့် **Kubernetes (Container Orchestration)** တို့ကို လုံးဝ မသိသေးသော အခြေခံ (Beginner Level) မှစ၍ လုပ်ငန်းခွင်တွင် Cloud Native, Microservices, DevOps နှင့် Enterprise Production System ကြီးများကို စနစ်တကျ Deploy ပြုလုပ်၊ ထိန်းကျောင်းနိုင်သည်အထိ (Master/DevOps Level) **မြန်မာဘာသာဖြင့် အသေးစိတ် အဆင့်ဆင့်** ရေးသားထားသော ပြည့်စုံသည့် လက်တွေ့လမ်းညွှန် ဖြစ်ပါသည်။

"My machine works fine, why fails on server?" (ကျွန်တော့်စက်မှာ အလုပ်လုပ်ပြီး Server ပေါ်ရောက်မှ ဘာလို့ Error တက်တာလဲ) ဟူသော ပြဿနာမှစတင်ကာ Docker ဖြင့် Environment တစ်ပြေးညီဖြစ်အောင် တည်ဆောက်ပုံ၊ Image Optimization၊ Multi-stage build၊ Docker Compose ဖြင့် Multi-container Application (Nginx + PHP-FPM + MySQL + Redis) တည်ဆောက်ပုံ၊ ထို့နောက် အဆိုပါ Container များကို Kubernetes Cluster ပေါ်တွင် Zero-downtime Rolling Update၊ Self-healing၊ Auto-scaling၊ Ingress၊ Persistent Storage၊ Helm နှင့် GitOps (ArgoCD) တို့ဖြင့် Production-ready Deploy ပြုလုပ်ပုံအထိ အစုံအလင် ပါဝင်ပါသည်။

---

## 🗺️ Docker & Kubernetes Roadmap (အစမှ အဆုံး လေ့လာရန် လမ်းပြမြေပုံ)

```
========================================================================================
                      [ PHASE 1: DOCKER FUNDAMENTALS & ESSENTIALS ]
========================================================================================
   [01. Docker Architecture] ──► [02. Essential CLI] ──► [03. Dockerfile Deep Dive]
   (Container vs VM, Engine)     (run, exec, logs, port)  (Layer Caching, Instructions)
                                                                   │
                                                                   ▼
   [06. Multi-Stage Builds]  ◄── [05. Networking]   ◄── [04. Storage & Volumes]
   (Alpine/Distroless, Lean)     (Bridge, DNS, Custom)    (Volumes vs Bind Mounts)
               │
               ▼
   [07. Docker Compose Mastery] (Fullstack Stack: Nginx + PHP/Laravel + MySQL + Redis)
========================================================================================
                      [ PHASE 2: ADVANCED DOCKER & ENTERPRISE PRODUCTION ]
========================================================================================
   [08. Docker Security & Hardening] ──► [09. CI/CD & Registries] ──► [10. Orchestration Bridge]
   (Rootless, Trivy, Non-root)          (Docker Hub, ECR, Actions)    (Swarm vs K8s Evolution)
========================================================================================
                      [ PHASE 3: KUBERNETES FOUNDATIONS & ARCHITECTURE ]
========================================================================================
   [11. K8s Architecture & Setup] ──► [12. Pods & Manifests] ──► [13. Deployments & Rollouts]
   (Control Plane, Worker, kubectl)    (Pod Lifecycle, Multi)     (RollingUpdate, HPA, Self-heal)
                                                                            │
                                                                            ▼
   [16. ConfigMaps & Secrets]     ◄── [15. Ingress & Routing]◄── [14. Services & Networking]
   (Env, Volume Mount, Sealed)        (Nginx Ingress, TLS)        (ClusterIP, NodePort, LB)
========================================================================================
                      [ PHASE 4: KUBERNETES MASTER & CLOUD DEVOPS ]
========================================================================================
   [17. Persistent Storage] ──► [18. Helm Package Manager] ──► [19. RBAC & Security]
   (PV, PVC, StorageClasses)    (Charts, Values, Release)       (Roles, ServiceAccounts)
                                                                            │
                                                                            ▼
                                                [20. Observability, GitOps & Production Cloud]
                                                (Prometheus/Grafana, ArgoCD, AWS EKS/GKE)
```

---

## 📚 သီးသန့် အခန်းလိုက် သင်ခန်းစာဖိုင်များ (Dedicated Lessons in `docker_kubernetes_lessons/`)

အောက်ပါ ခေါင်းစဉ်တစ်ခုချင်းစီအတွက် အသေးစိတ် ရှင်းလင်းချက်များ၊ Architecture Diagram များ၊ လက်တွေ့ Command များနှင့် YAML Manifest များကို `docker_kubernetes_lessons/` folder ထဲတွင် သီးသန့် ဖိုင်များဖြင့် အသေးစိတ် လေ့လာနိုင်ပါသည်:

### 🌟 အခြေခံ အယူအဆများနှင့် လုပ်ငန်းခွင်သုံး လက်စွဲ (Foundational Concepts & Real Work Guide)

| စဉ် | ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက ရှင်းလင်းချက်များနှင့် လုပ်ငန်းခွင် Task များ |
| :---: | :--- | :--- | :--- |
| **00** | **Core Concepts & Real Work Guide** | [00_beginner_core_concepts_and_real_work_guide.md](/devops/02_kubernetes_and_cloud/00_beginner_core_concepts_and_real_work_guide/) | Multi-Stage, Orchestration, Swarm, Kubernetes, Pods ဆိုတာဘာလဲ၊ ဘာကြောင့်သုံးသလဲ၊ မသုံးရင်ဘာဖြစ်မလဲ၊ အားသာချက်များနှင့် နေ့စဉ် လုပ်ငန်းခွင် Tasks |

---

### 🐳 အပိုင်း (၁) - Docker အခြေခံမှ ကျွမ်းကျင်အဆင့် (Docker Foundations & Mastery)

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **01** | **Docker Architecture & Concepts** | [01_docker_architecture_and_concepts.md](/devops/02_kubernetes_and_cloud/01_docker_architecture_and_concepts/) | Containerization vs Virtualization (VM), Docker Daemon, Docker Client, Image vs Container, OCI Standards |
| **02** | **Essential Docker CLI Commands** | [02_docker_cli_essentials.md](/devops/02_kubernetes_and_cloud/02_docker_cli_essentials/) | `docker run`, `ps`, `exec`, `logs`, `inspect`, `stop`, `rm`, `rmi`, Port Mapping (`-p`), Environment Variables (`-e`) |
| **03** | **Dockerfile Deep Dive & Image Building** | [03_dockerfile_deep_dive.md](/devops/02_kubernetes_and_cloud/03_dockerfile_deep_dive/) | `FROM`, `RUN`, `CMD` vs `ENTRYPOINT`, `COPY` vs `ADD`, `WORKDIR`, `EXPOSE`, Layer Caching အလုပ်လုပ်ပုံနှင့် Optimization |
| **04** | **Docker Storage & Data Persistence** | [04_docker_storage_and_volumes.md](/devops/02_kubernetes_and_cloud/04_docker_storage_and_volumes/) | Volumes vs Bind Mounts vs tmpfs, Database Data သိမ်းဆည်းပုံ၊ Volume Backup, Restore နှင့် Permission ချိန်ညှိနည်း |
| **05** | **Docker Networking & Service Discovery** | [05_docker_networking.md](/devops/02_kubernetes_and_cloud/05_docker_networking/) | Bridge, Host, Overlay, None Networks, Container ချင်း အမည်ဖြင့် DNS ချိတ်ဆက်ပုံ၊ Custom Network သုံးစွဲပုံ |
| **06** | **Multi-Stage Builds & Image Optimization** | [06_multistage_builds_and_optimization.md](/devops/02_kubernetes_and_cloud/06_multistage_builds_and_optimization/) | Multi-Stage Build ဖြင့် Image Size 1GB မှ 50MB သို့ လျှော့ချနည်း၊ `.dockerignore`၊ Alpine Linux၊ Distroless Images |
| **07** | **Docker Compose Mastery (Multi-Container)** | [07_docker_compose_mastery.md](/devops/02_kubernetes_and_cloud/07_docker_compose_mastery/) | `docker-compose.yml` ရေးဆွဲနည်း၊ Fullstack Setup (PHP-FPM + Nginx + MySQL + Redis), Healthchecks, Environment Files |

---

### 🛡️ အပိုင်း (၂) - Advanced Docker & Production Readiness

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **08** | **Docker Security & Hardening** | [08_docker_security_and_hardening.md](/devops/02_kubernetes_and_cloud/08_docker_security_and_hardening/) | Non-root User သုံးစွဲပုံ၊ Rootless Docker၊ Trivy Vulnerability Scanning၊ Read-only Root Filesystem၊ Resource Limits |
| **09** | **Docker CI/CD & Container Registries** | [09_docker_cicd_and_registries.md](/devops/02_kubernetes_and_cloud/09_docker_cicd_and_registries/) | Docker Hub, AWS ECR, GitHub Container Registry (GHCR), GitHub Actions CI/CD Pipeline ဖြင့် Build & Push ပြုလုပ်ပုံ |
| **10** | **Why Orchestration? Swarm vs Kubernetes** | [10_why_orchestration_swarm_vs_k8s.md](/devops/02_kubernetes_and_cloud/10_why_orchestration_swarm_vs_k8s/) | Single Host ပြဿနာများ၊ High Availability, Auto-healing, Load Balancing လိုအပ်ချက်၊ Swarm နှင့် Kubernetes နှိုင်းယှဉ်ချက် |

---

### ☸️ အပိုင်း (၃) - Kubernetes အခြေခံမှ အလယ်အလတ် (K8s Core Architecture & Workloads)

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **11** | **Kubernetes Architecture & Cluster Setup** | [11_k8s_architecture_and_setup.md](/devops/02_kubernetes_and_cloud/11_k8s_architecture_and_setup/) | Control Plane (API Server, etcd, Scheduler, Controller Mgr) + Worker Nodes (Kubelet, Kube-proxy), Minikube/Kind/K3s Setup, `kubectl` |
| **12** | **Pods & Declarative YAML Manifests** | [12_pods_and_declarative_yaml.md](/devops/02_kubernetes_and_cloud/12_pods_and_declarative_yaml/) | Pod Anatomy, YAML Syntax, Multi-container Pod (Sidecar Pattern), Init Containers, Pod Lifecycle & Restart Policy |
| **13** | **Deployments, ReplicaSets & Rollouts** | [13_deployments_and_rollouts.md](/devops/02_kubernetes_and_cloud/13_deployments_and_rollouts/) | Declarative Deployments, Zero-downtime RollingUpdate, Rollback, Horizontal Pod Autoscaler (HPA), StatefulSets vs DaemonSets |
| **14** | **Kubernetes Services & Networking** | [14_k8s_services_and_networking.md](/devops/02_kubernetes_and_cloud/14_k8s_services_and_networking/) | ClusterIP, NodePort, LoadBalancer, ExternalName, kube-proxy, CoreDNS Service Discovery, Endpoints |
| **15** | **Ingress Controllers & Traffic Routing** | [15_ingress_controllers_and_routing.md](/devops/02_kubernetes_and_cloud/15_ingress_controllers_and_routing/) | Nginx Ingress Controller, Host-based & Path-based Routing, SSL/TLS Automated Certificate with Cert-Manager (Let's Encrypt) |
| **16** | **ConfigMaps, Secrets & Configuration** | [16_configmaps_and_secrets.md](/devops/02_kubernetes_and_cloud/16_configmaps_and_secrets/) | 12-Factor App Configs, ConfigMap vs Secret (Opaque), Base64 Encoding, Mounting as Env Vars & Volumes, HashiCorp Vault မိတ်ဆက် |

---

### 🚀 အပိုင်း (၄) - Kubernetes အဆင့်မြင့်နှင့် လုပ်ငန်းခွင်သုံး စနစ်များ (Advanced K8s & DevOps)

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **17** | **Persistent Storage (PV, PVC & StorageClasses)** | [17_persistent_volumes_and_storage.md](/devops/02_kubernetes_and_cloud/17_persistent_volumes_and_storage/) | Stateful Workloads, PersistentVolume (PV), PersistentVolumeClaim (PVC), Dynamic Provisioning, StorageClass, CSI Driver |
| **18** | **Helm Package Manager for Kubernetes** | [18_helm_package_manager.md](/devops/02_kubernetes_and_cloud/18_helm_package_manager/) | Helm 3 Architecture, Chart Structure, `values.yaml`, Templates, `helm install/upgrade/rollback`, Custom Production Chart ဖန်တီးပုံ |
| **19** | **RBAC, Security & Cluster Hardening** | [19_rbac_security_and_hardening.md](/devops/02_kubernetes_and_cloud/19_rbac_security_and_hardening/) | Role, ClusterRole, RoleBinding, ServiceAccounts, NetworkPolicies, Pod Security Standards (PSS), SecurityContexts |
| **20** | **Production Observability, GitOps & Cloud K8s** | [20_observability_gitops_and_cloud.md](/devops/02_kubernetes_and_cloud/20_observability_gitops_and_cloud/) | Monitoring (Prometheus + Grafana), Logging (Loki/Fluentbit), GitOps with ArgoCD, Managed K8s (AWS EKS, GCP GKE, DigitalOcean) |

---

## 🛠️ စတင်လေ့လာရန် လိုအပ်သော Tools များ (Prerequisites)

1. **Docker Desktop** (Mac / Windows / Linux) သို့မဟုတ် **Rancher Desktop / OrbStack**
2. **kubectl** (Kubernetes Command-Line Tool)
3. **Minikube** သို့မဟုတ် **Kind (Kubernetes in Docker)** သို့မဟုတ် **k3d / K3s** (Local Cluster အစမ်း run ရန်)
4. **Helm 3** (Kubernetes Package Manager)
5. **VS Code** with *Docker* and *Kubernetes* extensions

မိတ်ဆွေအနေဖြင့် အထက်ပါ ဇယားမှ [01_docker_architecture_and_concepts.md](/devops/02_kubernetes_and_cloud/01_docker_architecture_and_concepts/) မှ စတင်၍ အဆင့်ဆင့် လေ့လာနိုင်ပါသည်။
