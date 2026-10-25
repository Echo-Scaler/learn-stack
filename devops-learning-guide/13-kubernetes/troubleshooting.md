# 🛠️ Kubernetes Production Troubleshooting Guide (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်သုံး Kubernetes Cluster တွင် အဖြစ်များဆုံး Pod & Service ပြဿနာ ၆ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: `CrashLoopBackOff`
- `kubectl logs <POD_NAME> --previous`
- Application startup error သို့မဟုတ် missing env variable စစ်ဆေးပါ။

---

## 🚨 ပြဿနာ ၂: `ImagePullBackOff`
- Docker image tag စာလုံးပေါင်း မှားယွင်းခြင်း သို့မဟုတ် Private registry imagePullSecrets လိုအပ်ခြင်း။

---

## 🚨 ပြဿနာ ၃: `Pending`
- Worker nodes များတွင် CPU/Memory မလုံလောက်ခြင်း သို့မဟုတ် PVC unbound ဖြစ်နေခြင်း။

---

## 🚨 ပြဿနာ ၄: `OOMKilled` (Exit Code 137)
- Memory limit ကျော်လွန်သုံးစွဲခြင်း: Deployment တွင် `resources.limits.memory` တိုးမြှင့်ပါ။

---

## 🚨 ပြဿနာ ၅: Service Endpoints `<none>` (Traffic မရောက်ခြင်း)
- `kubectl get endpoints <SERVICE_NAME>`
- Service selector နှင့် Pod labels စာလုံးပေါင်း ကိုက်ညီမှု စစ်ဆေးပါ။
