---
title: "၇။ Production Architecture & SAA-C03 Quiz"
description: "EKS Production Architecture စံနှုန်းများ၊ EKS vs ECS ဆုံးဖြတ်ချက်ဇယား၊ SAA-C03 Exam Traps နှင့် ရှင်းလင်းချက်ပါဝင်သော အလေ့အကျင့် စာမေးပွဲ"
---

# ၇။ Production Architecture & SAA-C03 Quiz

## EKS Production Reference Architecture

လက်တွေ့ Enterprise ကုမ္ပဏီကြီးများတွင် EKS ကို အောက်ပါအတိုင်း တည်ဆောက် အသုံးပြုကြပါသည်:

```
                                [ Internet Users ]
                                        │
                                        ▼
                       [ Application Load Balancer (ALB) ]
                     (Managed by AWS Load Balancer Controller)
                                        │
                ┌───────────────────────┴───────────────────────┐
                ▼                                               ▼
     ┌──────────────────────┐                        ┌──────────────────────┐
     │ Availability Zone A  │                        │ Availability Zone B  │
     │ (Private EKS Subnet) │                        │ (Private EKS Subnet) │
     │                      │                        │                      │
     │ ┌──────────────────┐ │                        │ ┌──────────────────┐ │
     │ │ Worker Node 1    │ │                        │ │ Worker Node 2    │ │
     │ │ ┌──────────────┐ │ │                        │ │ ┌──────────────┐ │ │
     │ │ │ App Pod A1   │ │ │                        │ │ │ App Pod A2   │ │ │
     │ │ └──────┬───────┘ │ │                        │ │ └──────┬───────┘ │ │
     │ └────────┼─────────┘ │                        │ └────────┼─────────┘ │
     └──────────┼───────────┘                        └──────────┼───────────┘
                │                                               │
                └───────────────────────┬───────────────────────┘
                                        │ (Amazon EFS CSI Driver - RWX)
                                        ▼
                             [ Amazon EFS Multi-AZ ]
                             Shared Distributed Files
```

---

## EKS vs ECS ဆုံးဖြတ်ချက်ဇယား (ဘယ်အချိန် EKS သုံးမလဲ?)

| လိုအပ်ချက် | အကြံပြုထားသော ဝန်ဆောင်မှု | အကြောင်းအရင်း |
| :--- | :---: | :--- |
| အဖွဲ့အစည်းတွင် Kubernetes ကျွမ်းကျင်သူများ ရှိပြီးသား ဖြစ်ခြင်း | **Amazon EKS** | ရှိပြီးသား Helm Charts, K8s Manifests များကို တိုက်ရိုက် သုံးနိုင်သည် |
| Multi-Cloud (AWS, GCP, Azure, On-Prem) သို့ လွတ်လပ်စွာ ပြောင်းရွှေ့နိုင်လိုခြင်း | **Amazon EKS** | Kubernetes Standard API ဖြစ်သဖြင့် Cloud Provider မရွေး လွတ်လပ်စွာ ပြောင်းနိုင်သည် |
| ရိုးရှင်းသော Docker Containers များကို အပို စီမံခန့်ခွဲမှု မလိုဘဲ အမြန်ဆုံး run လိုခြင်း | **Amazon ECS** | EKS ထက် အများကြီး ရိုးရှင်းပြီး Cluster fee မရှိပါ |
| Microservices ထောင်ပေါင်းများစွာကို Complex Service Mesh (Istio) ဖြင့် ထိန်းချုပ်လိုခြင်း | **Amazon EKS** | Kubernetes ၏ ကြီးမားကျယ်ပြန့်သော Open-source Ecosystem ကြောင့် ဖြစ်သည် |

---

## 🏆 SAA-C03 EKS ရွှေစည်းမျဉ်းများနှင့် လှည့်ကွက်များ (Exam Traps)

1. **Subnet IP Exhaustion:** Amazon VPC CNI ကြောင့် Pod တိုင်းက Private IP စားသုံးသည်။ Subnet တွင် IP မလုံလောက်ပါက Pod အသစ်များ တည်ဆောက်မရပါ။
2. **EKS on Fargate Storage Limitation:** Fargate တွင် run သော Pod များသည် EBS Volume ကို Attach ဆွဲ၍ မရပါ။ **Amazon EFS** ကိုသာ သုံးရမည်။
3. **IAM to Pods:** Pod တစ်ခုချင်းစီကို S3/DynamoDB access ပေးရန် Worker Node IAM Role ကို မသုံးရပါ။ **IAM Roles for Service Accounts (IRSA)** သို့မဟုတ် **EKS Pod Identity** ကို သုံးရမည်။
4. **DaemonSets on Fargate:** Fargate တွင် DaemonSets run ၍ မရပါ။

---

## 📝 SAA-C03 Scenario-Based Practice Quiz

### မေးခွန်း (၁)
ကုမ္ပဏီတစ်ခုသည် အွန်လိုင်းငွေပေးချေမှု API တစ်ခုကို Amazon EKS ပေါ်တွင် run ထားပြီး ထို API Pod သည် Amazon S3 Bucket တစ်ခုတည်းသို့သာ Invoice PDF များ ရေးသားခွင့် ရရှိစေလိုပါသည်။ အခြားသော Frontend Pod များသည် ထို S3 Bucket သို့ လုံးဝ ဝင်ရောက်ခွင့် မရှိစေရပါ။ အလုံခြုံဆုံးနှင့် အကောင်းဆုံး AWS Best Practice နည်းလမ်းမှာ အဘယ်နည်း?

- [ ] A) Worker Node EC2 ၏ IAM Instance Profile တွင် S3 Write Policy ပေးပါ
- [ ] B) S3 Access Key နှင့် Secret Key ကို Kubernetes Secret ထဲတွင် ထည့်၍ Pod ထဲသို့ Environment Variable အဖြစ် ထည့်ပေးပါ
- [x] C) IAM Role တစ်ခု တည်ဆောက်ပြီး Kubernetes ServiceAccount နှင့် OIDC ချိတ်ဆက်ကာ IAM Roles for Service Accounts (IRSA) ကို အသုံးပြုပါ
- [ ] D) S3 Bucket Policy တွင် Cluster ၏ VPC CIDR ကို အပြည့်အဝ ဖွင့်ပေးပါ

> **ရှင်းလင်းချက်:** **IRSA (IAM Roles for Service Accounts)** သည် Kubernetes တွင် Pod-level Least Privilege ခွင့်ပြုချက် ပေးနိုင်သော တရားဝင် AWS Best Practice နည်းလမ်း ဖြစ်ပါသည်။ Node-level တွင် ပေးပါက အခြား Pod များပါ S3 ကို ခေါ်ယူနိုင်သွားမည် ဖြစ်သောကြောင့် (A) သည် အဖြေမှား ဖြစ်ပါသည်။

---

### မေးခွန်း (၂)
Solutions Architect တစ်ဦးသည် EKS Cluster တွင် Traffic အလွန်များပြားလာချိန်၌ Pods များ ပွားများလာသော်လည်း Worker Node များ အသစ်ထွက်ပေါ်လာရန် ၃ မိနစ် မှ ၅ မိနစ်အထိ ကြာမြင့်နေသည်ကို တွေ့ရှိရသည်။ အဆိုပါ Server တိုးချဲ့ချိန်ကို စက္ကန့်ပိုင်းအတွင်း (Under 1 minute) အမြန်ဆုံး ဖြစ်စေရန် မည်သည့် Autoscaler စနစ်သို့ ပြောင်းလဲသင့်သနည်း?

- [ ] A) Horizontal Pod Autoscaler (HPA)
- [ ] B) Cluster Autoscaler (CA)
- [x] C) Karpenter
- [ ] D) AWS Elastic Beanstalk

> **ရှင်းလင်းချက်:** **Karpenter** သည် EC2 Auto Scaling Groups များကို မဖြတ်သန်းဘဲ EC2 Fleet API ဖြင့် အသင့်တော်ဆုံး Node များကို စက္ကန့် ၄၀ အတွင်း Just-in-Time တိုက်ရိုက် ထုတ်လုပ်ပေးသော ခေတ်သစ် K8s Node Autoscaler ဖြစ်ပါသည်။

---

## 🔗 Official AWS Documentation Links

- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [Amazon VPC CNI Plugin Documentation](https://docs.aws.amazon.com/eks/latest/userguide/pod-networking.html)
- [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [Karpenter Official Documentation](https://karpenter.sh/)
