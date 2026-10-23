---
title: "၄။ Storage စနစ်များ (EBS & EFS CSI Drivers)"
description: "EKS Storage စနစ်များ၊ Persistent Volumes (PV)၊ PVC၊ StorageClasses၊ Amazon EBS CSI Driver နှင့် Amazon EFS CSI Driver နှိုင်းယှဉ်ချက်"
---

# ၄။ Storage စနစ်များ (EBS & EFS CSI Drivers)

## Kubernetes Storage သဘောတရားများ (PV, PVC, StorageClass)

Kubernetes တွင် Container များ သေဆုံးသွားသော်လည်း Database နှင့် ဖိုင်များ မပျောက်ပျက်စေရန် အောက်ပါ အဆင့် ၃ ဆင့်ဖြင့် သိုလှောင်မှုကို စီမံပါသည်:

1. **StorageClass:** မည်သည့် Cloud Storage အမျိုးအစားကို သုံးမည်နည်း (ဥပမာ- `gp3` EBS Volume သို့မဟုတ် `EFS`)။ Dynamic Provisioning ဖြင့် လိုအပ်ချိန်တွင် AWS Volume အလိုအလျောက် ဆောက်ပေးသည်။
2. **PersistentVolumeClaim (PVC):** Application Developer က မိမိ Pod အတွက် "သိုလှောင်မှု 20GB လိုအပ်သည်" ဟု တောင်းဆိုသော လက်မှတ် (Claim)။
3. **PersistentVolume (PV):** AWS က အမှန်တကယ် ဖန်တီးပေးလိုက်သော EBS သို့မဟုတ် EFS Storage Volume အစစ်အမှန်။

---

## Amazon EBS CSI Driver vs Amazon EFS CSI Driver

| အချက်အလက် | Amazon EBS CSI Driver | Amazon EFS CSI Driver |
| :--- | :--- | :--- |
| **Access Mode** | **ReadWriteOnce (RWO)** | **ReadWriteMany (RWX)** |
| **ချိတ်ဆက်နိုင်မှု** | Pod တစ်ခုတည်း (Single Node) သာ ချိတ်နိုင်သည် | **Pods ရာပေါင်းများစွာက Multi-AZ ဖြတ်၍ တစ်ပြိုင်နက် ချိတ်နိုင်သည်** |
| **AZ ကန့်သတ်ချက် (Trap)** | **EBS Volume သည် သီးသန့် AZ တစ်ခုတည်းတွင်သာ ရှိသည်** (AZ-A မှ Volume ကို AZ-B ရှိ Pod က ချိတ်၍ မရပါ) | **Multi-AZ အားလုံးတွင် အတူတူ ချိတ်ဆက်သုံးစွဲနိုင်သည်** |
| **Fargate ထောက်ပံ့မှု** | **Fargate တွင် သုံး၍ မရပါ** | **Fargate တွင် အပြည့်အဝ သုံးနိုင်သည်** |
| **အကောင်းဆုံး Use Case** | PostgreSQL, MySQL, Redis, Kafka (Single-writer Databases) | WordPress Media Uploads, Shared Configuration, Shared Logs |

---

## 💡 SAA-C03 စာမေးပွဲ မေးခွန်းဟောင်း လှည့်ကွက်:

> **မေးခွန်း:**  
> EKS Cluster တစ်ခုတွင် Stateful Application တစ်ခုကို Fargate ပေါ်တွင် မောင်းနှင်လိုပြီး Pod များ ပျက်ကျသော်လည်း Data များ အမြဲတည်တံ့နေစေရန် မည်သည့် Storage ဖြေရှင်းချက်ကို သုံးရမည်နည်း?  
> **အဖြေမှန်:** **Amazon EFS** (အကြောင်းမှာ EKS on Fargate သည် EBS CSI Driver ကို အသုံးမပြုနိုင်ဘဲ Amazon EFS CSI Driver ကိုသာ သီးသန့် ထောက်ပံ့သောကြောင့် ဖြစ်သည်)။
