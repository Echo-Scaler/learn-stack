---
title: "16. Configmaps And Secrets"
description: "1. [The 12-Factor App စည်းမျဉ်း (ကုဒ်နှင့် Configuration ခွဲခြားခြင်း)](#၁-the-12-factor-app-စည်းမျဉ်း)"
---

## ☸️ သင်ခန်းစာ (၁၆) - ConfigMaps နှင့် Secrets ဖြင့် Configuration များ စီမံခန့်ခွဲခြင်း
### (Lesson 16: 12-Factor App Configs, ConfigMaps, Base64 Secrets, Injection & SealedSecrets)

---

## 📌 မာတိကာ (Contents)
1. [The 12-Factor App စည်းမျဉ်း (ကုဒ်နှင့် Configuration ခွဲခြားခြင်း)](#၁-the-12-factor-app-စည်းမျဉ်း)
2. [ConfigMap ဆိုတာဘာလဲ? (လျှို့ဝှက်မဟုတ်သော အချက်အလက်များ)](#၂-configmap-ဆိုတာဘာလဲ)
3. [Secret ဆိုတာဘာလဲ? (Passowrds & API Keys များ)](#၃-secret-ဆိုတာဘာလဲ)
4. [သတိပြုရန်: Base64 Encoding သည် Encryption မဟုတ်ပါ!](#၄-သတိပြုရန်-base64-encoding-သည်-encryption-မဟုတ်ပါ)
5. [Pod အတွင်းသို့ ထည့်သွင်းအသုံးပြုနည်း ၂ နည်း (Env Variables vs Volume Mounts)](#၅-pod-အတွင်းသို့-ထည့်သွင်းနည်း-၂-နည်း)
6. [လက်တွေ့ Production Manifest နမူနာ (Laravel App ချိတ်ဆက်ပုံ)](#၆-လက်တွေ့-production-manifest-နမူနာ)
7. [Enterprise Secret Management (SealedSecrets & External Secrets Operator)](#၇-enterprise-secret-management)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ The 12-Factor App စည်းမျဉ်း

ခေတ်မီ Cloud-Native Software များ တည်ဆောက်ရာတွင် အရေးအကြီးဆုံး စည်းမျဉ်းတစ်ခုမှာ:
> **"Application Source Code နှင့် Configuration (Settings, Passwords) များကို မည်သည့်အခါမျှ အတူရောနှော မသိမ်းဆည်းရ!"**

Database Passwords များကို Docker Image ထဲတွင် Hardcode ထည့်ထားမိပါက:
* Image ကို အခြားသူများဆီ မျှဝေ၍ မရတော့ခြင်း။
* Git Repository ပေါ်သို့ Password များ ပါသွားပြီး Leak ဖြစ်ခြင်း။
* Staging နှင့် Production အတွက် Image အသီးသီး ခွဲ build ရခြင်း စသည့် ပြဿနာများ ဖြစ်ပေါ်စေသည်။

Kubernetes တွင် ဤပြဿနာကို ဖြေရှင်းရန် **ConfigMap** နှင့် **Secret** ဟူသော ရင်းမြစ် ၂ ခုကို ခွဲထုတ်ပေးထားပါသည်။

---

## ၂။ ConfigMap ဆိုတာဘာလဲ?

လျှို့ဝှက်ချက် မဟုတ်သော (Non-sensitive) Application Settings များကို သိမ်းဆည်းရန် ဖြစ်သည်။ (ဥပမာ- `APP_ENV=production`, `PORT=8080`, `LOG_LEVEL=info`, `CACHE_DRIVER=redis`)။

### `configmap.yaml` ရေးဆွဲခြင်း:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  APP_DEBUG: "false"
  APP_URL: "https://example.com"
  LOG_CHANNEL: "stderr"
```

---

## ၃။ Secret ဆိုတာဘာလဲ?

ပေါက်ကြားသွားပါက အန္တရာယ်ရှိနိုင်သော (Sensitive) လျှို့ဝှက်အချက်အလက်များကို သိမ်းဆည်းရန် ဖြစ်သည်။ (ဥပမာ- Database Passwords, JWT Secret Key, AWS Access Key, Stripe API Key)။

Kubernetes Secret ၏ Value များကို **Base64** ဖြင့် encode လုပ်၍ ထည့်ရပါသည်:

```bash
# Password ကို Base64 သို့ ပြောင်းလဲခြင်း
echo -n "SuperSecretPass123" | base64
# Output: U3VwZXJTZWNyZXRQYXNzMTIz
```

### `secret.yaml` ရေးဆွဲခြင်း:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: U3VwZXJTZWNyZXRQYXNzMTIz
  JWT_SECRET: c29tZS1qd3Qtc2VjcmV0LWtleQ==
```

---

## ၄။ သတိပြုရန်: Base64 Encoding သည် Encryption မဟုတ်ပါ!

အစပြုသူ အများစုသည် Base64 ဖြစ်နေသောကြောင့် လုံခြုံပြီဟု ထင်တတ်ကြသည်။
Base64 သည် မည်သူမဆို `echo "..." | base64 --decode` ဖြင့် ၁ စက္ကန့်အတွင်း မူလစာသား ပြန်ဖတ်နိုင်သော Encoding ပုံစံသာ ဖြစ်သည်။

ထို့ကြောင့် Kubernetes တွင်:
1. `etcd` database ကို Encryption at Rest ဖွင့်ထားရမည်။
2. Production တွင် Git Repository ထဲသို့ Secret YAML ဖိုင်များကို တိုက်ရိုက် မတင်ရပါ။

---

## ၅။ Pod အတွင်းသို့ ထည့်သွင်းနည်း ၂ နည်း

### နည်းလမ်း (က): Environment Variable အဖြစ် ထည့်သွင်းခြင်း (`env` / `envFrom`)
Application က `getenv('DB_PASSWORD')` သို့မဟုတ် `process.env.APP_ENV` ဖြင့် ဖတ်ရှုနိုင်စေရန်:

```yaml
spec:
  containers:
    - name: my-app
      image: my-app:1.0
      env:
        # ConfigMap မှ တစ်လုံးချင်း ဆွဲထုတ်ခြင်း
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV

        # Secret မှ Password ဆွဲထုတ်ခြင်း
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: DB_PASSWORD
```

> **Shortcut**: ConfigMap/Secret ထဲရှိ Key အားလုံးကို တစ်ပြိုင်နက် သွင်းလိုပါက `envFrom` ကို သုံးနိုင်သည်:
> ```yaml
> envFrom:
>   - configMapRef:
>       name: app-config
>   - secretRef:
>       name: app-secret
> ```

---

### နည်းလမ်း (ခ): Volume အဖြစ် Mount ထိုးဖောက်ချိတ်ဆက်ခြင်း (File-based Injection)
Configuration ဖိုင်တစ်ခုလုံး (ဥပမာ- `nginx.conf`, SSL certs, Google Service Account JSON) ကို Container အတွင်းရှိ Folder တစ်ခုဆီသို့ File အဖြစ် ထိုးထည့်ပေးခြင်း:

```yaml
spec:
  volumes:
    - name: config-volume
      configMap:
        name: nginx-custom-conf
  containers:
    - name: web
      image: nginx:alpine
      volumeMounts:
        - name: config-volume
          mountPath: /etc/nginx/conf.d/default.conf
          subPath: default.conf
```

---

## ၆။ လက်တွေ့ Production Manifest နမူနာ

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: laravel-production-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: laravel-prod
  template:
    metadata:
      labels:
        app: laravel-prod
    spec:
      containers:
        - name: app
          image: myusername/laravel-app:v1.0
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secret
          ports:
            - containerPort: 9000
```

---

## ၇။ Enterprise Secret Management (GitOps အတွက်)

Git Repository ထဲသို့ Secret များကို Commit တင်လိုပါက (GitOps စနစ်တွင်):

1. **Bitnami Sealed Secrets**:
   * Secret များကို Public Key ဖြင့် Encrypt လုပ်ထားသော `SealedSecret` အဖြစ် Git တွင် သိမ်းဆည်းသည်။ Cluster အတွင်းရှိ Controller ကသာ Private Key ဖြင့် Decrypt လုပ်နိုင်သည်။
2. **External Secrets Operator (ESO)**:
   * AWS Secrets Manager, HashiCorp Vault သို့မဟုတ် Google Secret Manager ထံမှ လျှို့ဝှက်ချက်များကို K8s Secret အဖြစ် အလိုအလျောက် Sync ဆွဲယူပေးသော နည်းပညာ။

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ | အသုံးပြုရမည့် အရာ |
| :--- | :--- |
| **Port, Debug Flag, URLs, Log Level** | `ConfigMap` |
| **Database Password, API Keys, Tokens** | `Secret` |
| **Configuration ဖိုင်တစ်ခုလုံး ထည့်သွင်းရန်** | `Volume Mount` (`mountPath`) |
| **Git Repository ထဲ Secret များ မပါသွားစေရန်** | `.gitignore` သို့မဟုတ် `SealedSecrets` သုံးပါ |

နောက်သင်ခန်းစာ [17_persistent_volumes_and_storage.md](/devops/02_kubernetes_and_cloud/17_persistent_volumes_and_storage/) တွင် Pod များ သေဆုံးသော်လည်း Database Data များ Cloud Disk ပေါ်တွင် အမြဲတည်တံ့စေမည့် PV, PVC & StorageClasses အကြောင်းကို လေ့လာပါမည်။
