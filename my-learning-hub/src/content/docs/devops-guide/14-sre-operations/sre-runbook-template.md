---
title: "Production Incident Response Runbook Template"
description: "Standardized SRE production runbook template for fast triage and mitigation"
---


> **On-Call Engineer များအတွက် အရေးပေါ် ပြဿနာဖြေရှင်းရေး စံပြ Runbook ပုံစံခွက်**

---

## 🎯 Runbook Metadata
- **Alert Name**: `HostHighCpuLoad` / `DatabaseConnectionsExhausted`
- **Severity Level**: `SEV-1` (Critical) / `SEV-2` (Major)
- **Service Name**: `payment-service` / `ecommerce-backend`
- **Primary On-Call Role**: DevOps Engineer / SRE
- **Escalation Contact**: Team Lead (Slack: `@sre-lead`, Phone: `+1-xxx-xxx`)

---

## 🔍 အဆင့် ၁: အမှန်တကယ် ဖြစ်မဖြစ် စစ်ဆေးခြင်း (Triage & Verification)

စနစ်၏ Alert သည် မှန်ကန်မှု ရှိမရှိ အောက်ပါ commands များဖြင့် ချက်ချင်း စစ်ဆေးပါ:

```bash
# ၁။ Pod / Service ကျန်းမာရေး စစ်ဆေးခြင်း
kubectl get pods -n production -l app=payment-service

# ၂။ CPU / Memory သုံးစွဲမှု စစ်ဆေးခြင်း
kubectl top pods -n production | grep payment

# ၃။ Error Logs ကြည့်ရှုခြင်း (နောက်ဆုံး မိနစ် ၂၀)
kubectl logs -n production -l app=payment-service --tail=100 | grep -E "ERROR|FATAL"
```

---

## 🛠️ အဆင့် ၂: ချက်ချင်း သက်သာစေမည့် နည်းလမ်းများ (Immediate Mitigation Steps)

အရေးကြီးသည်မှာ Root Cause ကို ချက်ချင်း မရှာဖွေမီ **သုံးစွဲသူများ ဝန်ဆောင်မှု ပြန်လည်ရရှိစေရန် အရင်ဆုံး ပြုလုပ်ခြင်း** ဖြစ်သည်:

### နည်းလမ်း A: Pods အရေအတွက် တိုးမြှင့်ခြင်း (Traffic များနေပါက)
```bash
kubectl scale deployment payment-service --replicas=10 -n production
```

### နည်းလမ်း B: ယခင် Stable Version သို့ ပြန်လည် ဆုတ်ခွာခြင်း (Deployment အသစ်ကြောင့် ဖြစ်ပါက)
```bash
kubectl rollout undo deployment payment-service -n production
```

### နည်းလမ်း C: Service Restart ပြုလုပ်ခြင်း (Deadlock သို့မဟုတ် Memory Leak ဖြစ်ပါက)
```bash
kubectl rollout restart deployment payment-service -n production
```

---

## 📞 အဆင့် ၃: အချိန်မီ မပြီးပါက တာဝန်ဆင့်ကဲ လွှဲပြောင်းခြင်း (Escalation Path)

- အကယ်၍ **၁၅ မိနစ်အတွင်း** ပြဿနာ မပြေလည်ပါက:
  1. Incident Commander (IC) အား ချက်ချင်း အကြောင်းကြားပါ။
  2. Slack Channel `#incident-war-room` တွင် အခြေအနေ အစီရင်ခံပါ။
  3. External Status Page (`status.example.com`) တွင် "Investigating degraded performance" ဟု Update တင်ပါ။
