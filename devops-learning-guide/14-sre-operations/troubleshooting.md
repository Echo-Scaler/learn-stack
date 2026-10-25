# 🛠️ SRE Production Operations Troubleshooting Guide (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်သုံး SRE & Operations တွင် အဖြစ်များဆုံး စနစ်ပြဿနာ ၅ ခုနှင့် အရေးပေါ် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Cascading Failures
- Circuit breakers ဖွင့်ပါ၊ Rate limiting သတ်မှတ်ပါ၊ Non-essential features များ ခေတ္တပိတ်ပါ။

---

## 🚨 ပြဿနာ ၂: Runaway Cron Job / Background Worker Loop
- `top -b -n 1 | head -n 20`
- `kill -15 <PID>` (Safe terminate)

---

## 🚨 ပြဿနာ ၃: Alert Fatigue
- Actionable မဟုတ်သော alerts များကို ဖျက်ပစ်ပါ၊ SEV-1/SEV-2 သာ PagerDuty ခေါ်ဆိုခွင့်ပေးပါ။

---

## 🚨 ပြဿနာ ၄: Database Connection Pool Exhaustion
- AWS RDS Proxy ထည့်သွင်းပါ၊ Idle connections `wait_timeout` လျှော့ချပါ။

---

## 🚨 ပြဿနာ ၅: Incompatible Database Migration Failure
- Expand and Contract Pattern သုံးပါ၊ Snapshot Point-in-time recovery ပြုလုပ်ပါ။
