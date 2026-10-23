---
title: "Feature 4: Amazon EKS — Feature Titles & Usage Overview"
description: "Amazon Elastic Kubernetes Service (EKS) ကို Kubernetes အခြေခံမှ Production Clusters၊ IRSA၊ Karpenter နှင့် SAA-C03 စာမေးပွဲအထိ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ Usage များ စုစည်းမှု"
---

# Feature 4: Amazon EKS ကို မြန်မာလို အခြေခံမှ လက်တွေ့အထိ
### AWS SAA-C03 စာမေးပွဲနှင့် လက်တွေ့ Kubernetes Production Infrastructure လမ်းညွှန်

Amazon EKS (Elastic Kubernetes Service) သည် Open-source Kubernetes ကို AWS Cloud ပေါ်တွင် Control Plane စီမံခန့်ခွဲစရာမလိုဘဲ အမြင့်ဆုံး High Availability ဖြင့် လွယ်ကူစွာ မောင်းနှင်နိုင်စေသော AWS Managed Kubernetes Service ဖြစ်ပါသည်။ အောက်ပါ အဓိက Feature ခေါင်းစဉ်များနှင့် ၎င်းတို့၏ လက်တွေ့ အသုံးချပုံ (Usages) များကို အစဉ်လိုက် လေ့လာသင်ယူပါမည်-

---

## 📋 Course Feature Titles & Usages (မာတိကာ)

| အမှတ် | Feature Title (အဓိက ခေါင်းစဉ်) | အဓိက Feature များ | လက်တွေ့ Usage (အသုံးချပုံ) |
| :---: | :--- | :--- | :--- |
| **01** | [**၁။ EKS ဆိုတာဘာလဲ & Kubernetes အခြေခံ**](/aws-saa/04_eks/01_what_is_eks_and_k8s_basics/) | Control Plane, Pods, Deployments, Services, Namespaces, EKS vs ECS | Kubernetes ၏ အခြေခံ သဘောတရားများ၊ Container Orchestration အခန်းကဏ္ဍနှင့် K8s ဝေါဟာရများ ရှင်းလင်းချက် |
| **02** | [**၂။ EKS Architecture & Compute Models**](/aws-saa/04_eks/02_eks_architecture_and_compute_options/) | Managed Node Groups, Self-Managed, Fargate Profiles, EKS Auto Mode | Worker Node အမျိုးအစားများ ရွေးချယ်ခြင်း၊ Serverless Fargate Pods နှင့် Auto Mode ဖြင့် စီမံရမှု လျှော့ချခြင်း |
| **03** | [**၃။ Networking, VPC CNI & Security**](/aws-saa/04_eks/03_networking_vpc_cni_and_security/) | Amazon VPC CNI, Pod IP, Cluster Endpoints, IRSA, Pod Identity | Pod တစ်ခုချင်းစီကို VPC Private IP တိုက်ရိုက်ပေးအပ်ခြင်းနှင့် IAM Role ဖြင့် Pod Level Access Control ပြုလုပ်ခြင်း |
| **04** | [**၄။ Storage စနစ်များ (EBS & EFS CSI Drivers)**](/aws-saa/04_eks/04_storage_ebs_efs_csi_drivers/) | PV, PVC, StorageClass, Amazon EBS CSI Driver, EFS CSI Driver | Stateful Database များအတွက် EBS Volume ချိတ်ဆက်ခြင်းနှင့် Shared Filesystem အတွက် EFS RWX Mount ပြုလုပ်ခြင်း |
| **05** | [**၅။ Hands-on Lab: Web App Deployment**](/aws-saa/05_hands_on_lab_k8s_deployment/) | eksctl, kubectl, Sample App, Ingress/ALB, Rolling Update & Cleanup | Development EKS Cluster တည်ဆောက်ခြင်း၊ Web App ကို Pods များအဖြစ် deploy လုပ်ခြင်း၊ ALB ချိတ်ဆက်ခြင်းနှင့် ရှင်းလင်းခြင်း |
| **06** | [**၆။ Scaling, Karpenter & Troubleshooting**](/aws-saa/06_scaling_karpenter_monitoring_troubleshooting/) | HPA, Cluster Autoscaler, Karpenter, CrashLoopBackOff, Pending Pods | Pod နှင့် Node များကို အလိုအလျောက် တိုးချဲ့ပေးခြင်း၊ Karpenter ဖြင့် စက္ကန့်ပိုင်းအတွင်း Node တည်ဆောက်ခြင်းနှင့် Error ဖြေရှင်းနည်း |
| **07** | [**၇။ Production Architecture & SAA-C03 Quiz**](/aws-saa/07_production_architecture_and_saa_c03_quiz/) | Multi-AZ EKS, Disaster Recovery, Cost Factors, SAA-C03 Traps & Quiz | လုပ်ငန်းခွင်သုံး Enterprise K8s ဗိသုကာ၊ စာမေးပွဲ အဓိက လှည့်ကွက်များနှင့် အဖြေရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ |
