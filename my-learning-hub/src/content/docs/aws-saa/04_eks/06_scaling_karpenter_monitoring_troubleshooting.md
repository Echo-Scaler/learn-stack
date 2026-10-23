---
title: "၆။ Scaling, Karpenter & Troubleshooting"
description: "EKS Scaling စနစ်များ (HPA, Cluster Autoscaler, Karpenter), CloudWatch Container Insights နှင့် အဖြစ်များသော K8s Errors (CrashLoopBackOff, Pending, ImagePullBackOff)"
---

# ၆။ Scaling, Karpenter & Troubleshooting

## EKS Scaling စနစ်များ (Pod Level vs Node Level)

Kubernetes တွင် Scaling ကို အဆင့် ၂ ဆင့်ဖြင့် လုပ်ဆောင်ပါသည်:

```
[ Traffic Spike (CPU > 70%) ]
              │
              ▼
    [ Horizontal Pod Autoscaler (HPA) ]
    တိုးပွားလာသော Pods: 3 ──► 10 Pods
              │
              ▼ (Node ပေါ်တွင် နေရာမဆံ့တော့ပါ - Pending State)
    ┌─────────────────────────┴─────────────────────────┐
    ▼                                                   ▼
[ Cluster Autoscaler (Legacy) ]                 [ Karpenter (Modern - Recommended) ]
• EC2 Auto Scaling Group ကို လှမ်းခေါ်သည်           • ASG မလိုဘဲ EC2 API ကို တိုက်ရိုက်ခေါ်သည်
• Node တက်လာရန် ၃ မိနစ် မှ ၅ မိနစ် ကြာသည်          • **စက္ကန့်ပိုင်းအတွင်း (Under 45s) အသင့်ဖြစ်သည်**
• ကြိုတင်သတ်မှတ်ထားသော Instance Size သာ ရသည်    • **Pod လိုအပ်သော အတိအကျ Size (Right-size) ကို ရွေးသည်**
```

### Karpenter ၏ အားသာချက်:
Karpenter သည် Kubernetes Pod များ စောင့်ဆိုင်းနေရခြင်းကို ကြည့်ရှုပြီး အသင့်တော်ဆုံးနှင့် ဈေးအသက်သာဆုံး Spot သို့မဟုတ် On-Demand Instance များကို Just-In-Time ချက်ချင်း ထုတ်လုပ်ပေးသလို၊ Traffic ကျသွားပါကလည်း Node များကို အလိုအလျောက် ပေါင်းစည်းဖျက်ပစ်ပြီး **စရိတ် ၄၀% မှ ၅၀% အထိ သက်သာစေပါသည်**။

---

## EKS Monitoring with CloudWatch Container Insights

EKS Cluster ၏ ကျန်းမာရေးကို စောင့်ကြည့်ရန် **Amazon CloudWatch Container Insights** ကို ဖွင့်ထားရပါမည်:
- CPU, Memory, Network, Disk သုံးစွဲမှုများကို **Cluster, Node, Namespace, Service, Pod အဆင့်အလိုက်** Dashboard များဖြင့် မြင်တွေ့နိုင်သည်။
- Control Plane Logs (API server, audit, authenticator, controller manager, scheduler) များကို CloudWatch Logs သို့ ပို့ဆောင်နိုင်သည်။

---

## Kubernetes Troubleshooting Runbook (အဖြစ်များသော အမှားများ)

| အမှားအခြေအနေ | ဖြစ်ရသည့် အကြောင်းအရင်း | စစ်ဆေးဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **`Pending` Pod** | Node ပေါ်တွင် CPU/RAM မလုံလောက်ခြင်း သို့မဟုတ် PVC အား ချိတ်ဆက်မရခြင်း | `kubectl describe pod <pod-name>` ဖြင့် Events ကို ကြည့်ပါ။ Node အရေအတွက် တိုးပါ သို့မဟုတ် Pod resource requests လျှော့ပါ |
| **`CrashLoopBackOff`** | Container စတင်ပြီးသည်နှင့် Application Crash ဖြစ်၍ သေဆုံးသွားခြင်း | `kubectl logs <pod-name> --previous` ဖြင့် Crash ဖြစ်သွားသော Application Log ကို ဖတ်ပါ။ Environment Variables သို့မဟုတ် DB Connection စစ်ဆေးပါ |
| **`ImagePullBackOff`** | ECR Image အမည် မှားယွင်းခြင်း သို့မဟုတ် ECR Image Pull ခွင့်ပြုချက် (IAM Role) မရှိခြင်း | Image Tag မှန်မမှန် စစ်ဆေးပါ။ Worker Node သို့မဟုတ် ServiceAccount တွင် ECR Read Policy ရှိမရှိ စစ်ဆေးပါ |
| **`OOMKilled` (Exit Code 137)** | Container က ၎င်းအား သတ်မှတ်ထားသော `resources.limits.memory` ထက် ကျော်လွန်သုံးစွဲခြင်း | Pod ၏ Memory Limit ကို တိုးမြှင့်ပေးပါ သို့မဟုတ် Memory Leak ဖြစ်နေသော Code ကို ပြင်ဆင်ပါ |
