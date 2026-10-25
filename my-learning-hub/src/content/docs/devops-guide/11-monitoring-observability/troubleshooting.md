---
title: "Monitoring & Observability Troubleshooting Guide"
description: "Prometheus scrape timeouts, Target down, High cardinality OOM, and Alertmanager failures (မြန်မာဘာသာ)"
---


> **လုပ်ငန်းခွင်သုံး Prometheus, Grafana နှင့် Alertmanager တွင် အဖြစ်များဆုံး ပြဿနာ ၆ ခုနှင့် ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: Prometheus Target Status `DOWN` ဖြစ်နေခြင်း

### လက္ခဏာ (Symptom):
Prometheus Web UI (`/targets`) တွင် State သည် အနီရောင်ဖြင့် `DOWN` ဟု ပြနေခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Target service (Node Exporter သို့မဟုတ် App) သည် မ run နေခြင်း။
2. Firewall (UFW သို့မဟုတ် AWS Security Group) မှ Port (9100) သို့ ဝင်ရောက်ခွင့် ပိတ်ထားခြင်း။
3. Docker Container အချင်းချင်း ချိတ်ဆက်ရာတွင် network ကွဲပြားနေခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
# အဆင့် ၁: Target port ပွင့်မပွင့် စစ်ဆေးပါ
nc -zv <TARGET_IP> 9100
# သို့မဟုတ်
curl -Iv http://<TARGET_IP>:9100/metrics

# အဆင့် ၂: UFW Firewall တွင် port ဖွင့်ပေးပါ
sudo ufw allow from <PROMETHEUS_IP> to any port 9100 proto tcp
```

---

## 🚨 ပြဿနာ ၂: Prometheus Out Of Memory (OOM Crash)

### လက္ခဏာ (Symptom):
Prometheus container သည် ခဏခဏ restart ကျနေပြီး `exit code 137` (OOM Killer) ပြနေခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
High Cardinality — Developer များမှ Application Metrics ထဲသို့ `user_id`, `request_id`, `timestamp` သို့မဟုတ် `email` စသည့် တန်ဖိုး မတူညီသော သန်းပေါင်းများစွာသော dynamic values များကို label အဖြစ် ထည့်သွင်းထားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```promql
# မည်သည့် Metric က Time Series အများဆုံး ဖြစ်နေသည်ကို ရှာဖွေပါ:
topk(10, count by (__name__)({__name__=~".+"}))
```
Application code ထဲမှ dynamic labels များကို ချက်ချင်း ဖယ်ရှားပြီး static labels (`status_code`, `method`, `handler`) သာ ထားရှိပါ။

---

## 🚨 ပြဿနာ ၃: Scrape Timeout (Context Deadline Exceeded)

### လက္ခဏာ (Symptom):
Prometheus targets စာမျက်နှာတွင် `context deadline exceeded` error ပြခြင်း။

### ဖြေရှင်းနည်း (Fix):
Target ဆာဗာ၏ load မြင့်နေသဖြင့် metrics ထုတ်ပေးရန် အချိန်ကြာနေခြင်း ဖြစ်သည်။ `scrape_timeout` ကို တိုးမြှင့်ပေးပါ:
```yaml
scrape_configs:
  - job_name: 'slow_app'
    scrape_interval: 30s
    scrape_timeout: 25s
    static_configs:
      - targets: ['app:8080']
```

---

## 🚨 ပြဿနာ ၄: Alertmanager မှ Telegram / Slack သို့ Alert မရောက်ရှိခြင်း

### လက္ခဏာ (Symptom):
Prometheus တွင် Alert သည် `Firing` ဖြစ်နေသော်လည်း Telegram သို့ မည်သည့် notification မှ မရောက်ခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
# Alertmanager container log ကို ကြည့်ပါ
docker logs alertmanager --tail 50

# Webhook ကို curl ဖြင့် တိုက်ရိုက် test လုပ်ပါ
curl -X POST -H 'Content-Type: application/json' \
  -d '[{"labels":{"alertname":"TestAlert","severity":"critical"},"annotations":{"summary":"Test Alert Message"}}]' \
  http://localhost:9093/api/v1/alerts
```

---

## 🚨 ပြဿနာ ၅: Grafana "No Data" သို့မဟုတ် Query Error

### လက္ခဏာ (Symptom):
Grafana Dashboard panel တွင် ဂရပ်များ မပေါ်ဘဲ `No Data` ဟုသာ ပြနေခြင်း။

### ဖြေရှင်းနည်း (Fix):
1. Grafana ညာဘက်အပေါ်ထောင့်ရှိ Time Range ကို စစ်ဆေးပါ (Last 15 minutes သို့မဟုတ် Last 1 hour ထားပါ)။
2. Server Time (NTP) မမှန်ကန်ပါက Grafana သည် ဒေတာများကို filter လုပ်၍ မရဖြစ်တတ်ပါသည်။ စက်အားလုံးတွင် NTP synchronised ဖြစ်စေရန် `timedatectl status` ဖြင့် စစ်ဆေးပါ။
