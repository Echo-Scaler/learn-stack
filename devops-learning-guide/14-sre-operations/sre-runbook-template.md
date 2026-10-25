# 📖 Production Incident Response Runbook Template

> **On-Call Engineer များအတွက် အရေးပေါ် ပြဿနာဖြေရှင်းရေး စံပြ Runbook ပုံစံခွက်**

---

## 🎯 Runbook Metadata
- **Alert Name**: `HostHighCpuLoad`
- **Severity Level**: `SEV-1` / `SEV-2`
- **Primary On-Call Role**: DevOps Engineer / SRE

---

## 🔍 အဆင့် ၁: Triage & Verification

```bash
kubectl get pods -n production -l app=payment-service
kubectl top pods -n production | grep payment
kubectl logs -n production -l app=payment-service --tail=100 | grep -E "ERROR|FATAL"
```

---

## 🛠️ အဆင့် ၂: Immediate Mitigation Steps

```bash
# Pods scale တိုးမြှင့်ခြင်း
kubectl scale deployment payment-service --replicas=10 -n production

# Stable version သို့ rollback ပြုလုပ်ခြင်း
kubectl rollout undo deployment payment-service -n production

# Zero-downtime restart ပြုလုပ်ခြင်း
kubectl rollout restart deployment payment-service -n production
```

---

## 📞 အဆင့် ၃: Escalation Path
၁၅ မိနစ်အတွင်း မပြေလည်ပါက Incident Commander အား အကြောင်းကြားပြီး `#incident-war-room` ဖွင့်လှစ်ပါ။
