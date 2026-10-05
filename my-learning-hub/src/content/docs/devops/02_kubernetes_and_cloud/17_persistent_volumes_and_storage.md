---
title: "17. Persistent Volumes And Storage"
description: "1. [Kubernetes တွင် Storage ၏ စိန်ခေါ်မှု (Stateless vs Stateful Workloads)](#၁-kubernetes-တွင်-storage-၏-စိန်ခေါ်မှု)"
---

## ☸️ သင်ခန်းစာ (၁၇) - Kubernetes Storage (PV, PVC & StorageClasses)
### (Lesson 17: Stateful Workloads, Dynamic Provisioning, StorageClasses & Persistent Volumes)

---

## 📌 မာတိကာ (Contents)
1. [Kubernetes တွင် Storage ၏ စိန်ခေါ်မှု (Stateless vs Stateful Workloads)](#၁-kubernetes-တွင်-storage-၏-စိန်ခေါ်မှု)
2. [Storage Architecture အဆင့် ၃ ဆင့် (StorageClass, PV, PVC)](#၂-storage-architecture-အဆင့်-၃-ဆင့်)
3. [Volume Access Modes ၃ မျိုး (RWO, ROX, RWX)](#၃-volume-access-modes-၃-မျိုး)
4. [Static vs Dynamic Provisioning (Cloud Disk များ အလိုအလျောက် ဝယ်ယူချိတ်ဆက်ပုံ)](#၄-static-vs-dynamic-provisioning)
5. [လက်တွေ့ Production Lab: MySQL Database ကို PVC ဖြင့် Deploy ပြုလုပ်ခြင်း](#၅-လက်တွေ့-production-lab)
6. [StatefulSets နှင့် `volumeClaimTemplates` အလုပ်လုပ်ပုံ](#၆-statefulsets-နှင့်-volumeclaimtemplates)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Kubernetes တွင် Storage ၏ စိန်ခေါ်မှု

Kubernetes တွင် Pod တစ်ခုသည် Node 1 ပေါ်တွင် run နေပြီး Node 1 ပျက်ကျသွားပါက Scheduler သည် ထို Pod ကို Node 2 ပေါ်သို့ အလိုအလျောက် ပြောင်းရွှေ့ပေးသည်။

အကယ်၍ Data ကို Node 1 ၏ Local Hard Disk ပေါ်တွင် သိမ်းထားခဲ့ပါက Pod သည် Node 2 သို့ ရောက်သွားသောအခါ ယခင် Data များကို လုံးဝ ရယူနိုင်တော့မည် မဟုတ်ပါ။

ထို့ကြောင့် Kubernetes တွင် Node များနှင့် သီးခြားလွတ်လပ်သော **Network Storage (Cloud Block Storage / NFS)** စနစ်ကို အသုံးပြုရပြီး၊ အဆိုပါစနစ်ကို **PV, PVC နှင့် StorageClass** ဟူ၍ အဆင့် ၃ ဆင့်ဖြင့် ဖွဲ့စည်းထားပါသည်။

---

## ၂။ Storage Architecture အဆင့် ၃ ဆင့်

```
┌────────────────────────────────────────────────────────┐
│                      STORAGECLASS                      │
│   (e.g., aws-ebs-gp3, gcp-pd-ssd, local-path)         │
│   "မည်သည့် Cloud Disk အမျိုးအစား သုံးမည်နည်း သတ်မှတ်ချက်"   │
└──────────────────────────┬─────────────────────────────┘
                           │ Dynamic Auto-Provisioning
                           ▼
┌────────────────────────────────────────────────────────┐
│                 PERSISTENT VOLUME (PV)                 │
│   (Actual Cloud Disk: 50 GB AWS EBS gp3 volume)        │
│   "Cluster အတွင်း အမှန်တကယ် ရှိနေသော Physical Storage"   │
└──────────────────────────┬─────────────────────────────┘
                           │ Binds To (ချိတ်ဆက်မိသည်)
                           ▼
┌────────────────────────────────────────────────────────┐
│             PERSISTENT VOLUME CLAIM (PVC)              │
│   (Developer Request: "ငါ့အတွက် Disk 50GB လိုအပ်တယ်")    │
└──────────────────────────┬─────────────────────────────┘
                           │ Mounted By
                           ▼
                 ┌───────────────────┐
                 │     MySQL Pod     │
                 │ (/var/lib/mysql)  │
                 └───────────────────┘
```

1. **StorageClass (SC)**: Cloud Provider ထံမှ Disk ဝယ်ယူမည့် နည်းလမ်း (gp3, standard, ssd) ကို သတ်မှတ်ထားသော စံနှုန်း။
2. **PersistentVolume (PV)**: Cluster ထဲတွင် အသင့်ရှိနေသော တကယ့် Disk အစစ် (Admin ဖန်တီးထားသော သို့မဟုတ် Cloud က Auto ဖန်တီးပေးသော Storage)။
3. **PersistentVolumeClaim (PVC)**: Developer ဘက်မှ "ကျွန်တော့် MySQL အတွက် 20GB Storage ပေးပါ" ဟု တောင်းဆိုသော လက်မှတ် (Claim Voucher)။

---

## ၃။ Volume Access Modes ၃ မျိုး

| Access Mode | အတိုကောက် | ရှင်းလင်းချက် |
| :--- | :---: | :--- |
| **ReadWriteOnce** | **`RWO`** | Worker Node **တစ်ခုတည်းကသာ** Read-Write ဖတ်/ရေး ပြုလုပ်ခွင့်ရှိသည် (AWS EBS, GCP Disk ကဲ့သို့သော Block Storage များ - MySQL/Postgres အတွက် အကောင်းဆုံး) |
| **ReadOnlyMany** | **`ROX`** | Worker Node ပေါင်းများစွာက **ဖတ်ရုံသက်သက်သာ** တပြိုင်နက် ချိတ်ဆက်ခွင့်ရှိသည် |
| **ReadWriteMany** | **`RWX`** | Worker Node ပေါင်းများစွာက **ဖတ်/ရေး တပြိုင်နက်** ချိတ်ဆက်ခွင့်ရှိသည် (AWS EFS, NFS, Ceph ကဲ့သို့သော Shared File Storage များ - Shared Upload Media ဖိုင်များအတွက် သုံးသည်) |

---

## ၄။ Static vs Dynamic Provisioning

* **Static Provisioning (ခေတ်ဟောင်း)**: Cluster Admin က Disk ကို Cloud ပေါ်တွင် ကြိုတင် ဝယ်ယူပြီး PV YAML ကို လက်ဖြင့် တင်ထားပေးရသည်။
* **Dynamic Provisioning (ခေတ်သစ် Best Practice)**: Developer က PVC YAML ကို Apply လုပ်လိုက်သည်နှင့် Kubernetes StorageClass က AWS သို့မဟုတ် Google Cloud ထံသို့ API လှမ်းခေါ်ပြီး Disk အသစ်ကို **စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ဝယ်ယူ (Auto-Create) ပြီး Pod ထဲ ချိတ်ပေးခြင်း** ဖြစ်သည်။

---

## ၅။ လက်တွေ့ Production Lab: MySQL ကို PVC ဖြင့် Run ခြင်း

`mysql-storage.yaml`:

```yaml
# အဆင့် ၁: PersistentVolumeClaim တောင်းဆိုခြင်း
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi # 10 GB Storage တောင်းဆိုခြင်း

---
# အဆင့် ၂: MySQL Deployment တွင် PVC ချိတ်ဆက်အသုံးပြုခြင်း
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      volumes:
        - name: mysql-persistent-storage
          persistentVolumeClaim:
            claimName: mysql-data-pvc # အထက်မှ PVC အမည်ကို ညွှန်ပြသည်
      containers:
        - name: mysql
          image: mysql:8.0
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "EnterpriseSecret123"
            - name: MYSQL_DATABASE
              value: "ecommerce"
          ports:
            - containerPort: 3306
          volumeMounts:
            - name: mysql-persistent-storage
              mountPath: /var/lib/mysql # MySQL data ဖိုင်များ သိမ်းရာ လမ်းကြောင်း
```

### Apply ပြုလုပ်ပြီး Status စစ်ဆေးခြင်း:
```bash
kubectl apply -f mysql-storage.yaml

# PVC Status စစ်ဆေးခြင်း
kubectl get pvc
```
STATUS ကော်လံတွင် **`Bound`** (ချိတ်ဆက်မိသွားပြီ) ဟု ပြသနေပါက Disk အောင်မြင်စွာ တပ်ဆင်ပြီးစီးပါပြီ။

---

## ၆။ StatefulSets နှင့် `volumeClaimTemplates`

အကယ်၍ Database ကို Replicas ၃ လုံး (Master-Slave / Cluster) ဖြင့် Run လိုပါက Deployment ကို မသုံးရပါ။ **StatefulSet** ကို မဖြစ်မနေ အသုံးပြုရမည်။

StatefulSet တွင် **`volumeClaimTemplates`** ပါဝင်ပြီး၊ Pod တစ်လုံးချင်းစီအတွက် သီးခြား သီးသန့် Disk တစ်လုံးစီ (`pvc-mysql-0`, `pvc-mysql-1`, `pvc-mysql-2`) ကို အလိုအလျောက် သီးခြားစီ မွေးဖွားပေးပါသည်။

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အချက် | စစ်ဆေးရန် | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Dynamic Provisioning** | Cluster ထဲတွင် Default StorageClass သတ်မှတ်ထားပြီးပြီလား? | [ ] |
| **Access Mode မှန်ကန်မှု** | Database အတွက် `ReadWriteOnce (RWO)` ရွေးချယ်ထားသလား? | [ ] |
| **Claim Status** | `kubectl get pvc` တွင် `Bound` ဖြစ်မဖြစ် သေချာစစ်ဆေးပြီးပြီလား? | [ ] |
| **Stateful Data** | Database အတွက် StatefulSet သုံးထားသလား? | [ ] |

နောက်သင်ခန်းစာ [18_helm_package_manager.md](/devops/02_kubernetes_and_cloud/18_helm_package_manager/) တွင် Kubernetes YAML ဖိုင် ဒါဇင်ပေါင်းများစွာကို Package တစ်ခုတည်းအဖြစ် လွယ်ကူစွာ စီမံပေးနိုင်သည့် Helm Package Manager အကြောင်းကို လေ့လာပါမည်။
