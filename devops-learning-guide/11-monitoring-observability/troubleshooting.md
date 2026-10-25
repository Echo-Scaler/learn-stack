# 🛠️ Monitoring & Observability Troubleshooting Guide (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်သုံး Prometheus, Grafana နှင့် Alertmanager တွင် အဖြစ်များဆုံး ပြဿနာ ၆ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Prometheus Target Status `DOWN` ဖြစ်နေခြင်း
- Firewall / AWS Security Group တွင် Port 9100 ဖွင့်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။
- `curl -Iv http://<TARGET_IP>:9100/metrics`

---

## 🚨 ပြဿနာ ၂: Prometheus Out Of Memory (OOM Crash)
- High Cardinality ပြဿနာ: `topk(10, count by (__name__)({__name__=~".+"}))`
- Metric labels များတွင် User ID, Timestamp, Email စသည့် dynamic values မထည့်ရပါ။

---

## 🚨 ပြဿနာ ၃: Scrape Timeout (Context Deadline Exceeded)
- `scrape_timeout` ကို တိုးမြှင့်ပေးပါ: `scrape_timeout: 25s`

---

## 🚨 ပြဿနာ ၄: Alertmanager မှ Alert မရောက်ရှိခြင်း
- `docker logs alertmanager --tail 50`

---

## 🚨 ပြဿနာ ၅: Grafana "No Data"
- Time range (Last 1 hour) နှင့် Server Time (NTP) Synchronisation စစ်ဆေးပါ။
