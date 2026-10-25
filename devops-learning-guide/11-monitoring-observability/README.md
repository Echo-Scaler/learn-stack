# 📊 Module 11: Monitoring, Logging & Observability (မြန်မာဘာသာ)

> **Prometheus Metrics၊ PromQL၊ Grafana Dashboards၊ Alertmanager Alerts နှင့် AWS CloudWatch ဖြင့် Production စနစ်များကို အချိန်နှင့်တပြေးညီ စောင့်ကြည့်လေ့လာခြင်း**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

Production စနစ်များတွင် application တစ်ခု သို့မဟုတ် server တစ်ခု ပျက်ကျသွားသည့်အခါ (Downtime) သုံးစွဲသူများမှ လာရောက်တိုင်ကြားမှ သိရှိရခြင်းသည် အဆိုးရွားဆုံး DevOps အလေ့အထ ဖြစ်ပါသည်။

ခေတ်မီ Production DevOps Environment တွင် **Observability (စနစ်တစ်ခုလုံး၏ ကျန်းမာရေးနှင့် အတွင်းပိုင်း အခြေအနေကို စောင့်ကြည့်တိုင်းတာနိုင်စွမ်း)** ရှိရမည်ဖြစ်ပြီး၊ High CPU၊ Disk Space ပြည့်ခါနီးခြင်း၊ Memory Leak သို့မဟုတ် HTTP 5xx Server Error များ မြင့်တက်လာသည်နှင့် တပြိုင်နက် လူကိုယ်တိုင် စစ်ဆေးစရာမလိုဘဲ Slack/Telegram/Email သို့ အလိုအလျောက် Alert ပို့ပေးနိုင်ရမည် ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **The Three Pillars of Observability**: Metrics, Logs နှင့် Traces တို့၏ ကွာခြားချက်နှင့် အသုံးဝင်ပုံကို နားလည်ခြင်း။
2. **Prometheus Architecture**: Time-Series Database (TSDB) သဘောတရား၊ Pull-based Scrape Model နှင့် Target Discovery ကို ကျွမ်းကျင်စွာ အသုံးချတတ်ခြင်း။
3. **Node Exporter & Application Metrics**: Linux Host metrics (CPU, Memory, Disk, Network) များကို Node Exporter ဖြင့် ထုတ်ယူခြင်း။
4. **PromQL (Prometheus Query Language)**: Production metrics များကို `rate()`, `increase()`, `histogram_quantile()`, `sum by()` functions များဖြင့် filter နှင့် aggregate ပြုလုပ်တတ်ခြင်း။
5. **Grafana Dashboards Visualizations**: Prometheus ဒေတာများကို လှပပြီး dynamic ဖြစ်သော visual charts, gauges, heatmaps များအဖြစ် တည်ဆောက်ခြင်း။
6. **Alertmanager & Notification Routing**: Alert rules ရေးဆွဲပြီး Slack / Telegram / PagerDuty သို့ အရေးပေါ် သတိပေးချက်များ ပို့ဆောင်ခြင်း။
7. **AWS CloudWatch Alarms**: AWS Native CloudWatch Metrics၊ Billing Alarms နှင့် Log Groups များကို စနစ်တကျ စီမံခန့်ခွဲခြင်း။
8. **SLI / SLO / SLA & Error Budgets**: Site Reliability Engineering (SRE) စံချိန်စံညွှန်းများအတိုင်း Availability ကို တိုင်းတာခြင်း။

---

## 🧠 ၂။ Observability ၏ မဏ္ဍိုင်ကြီး ၃ ရပ် (The Three Pillars of Observability)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     THE THREE PILLARS OF OBSERVABILITY                 │
├──────────────────┬───────────────────────┬─────────────────────────────┤
│ 1. METRICS       │ 2. LOGS               │ 3. TRACES                   │
├──────────────────┼───────────────────────┼─────────────────────────────┤
│ • "ဘာဖြစ်နေသလဲ?" │ • "ဘာကြောင့်ဖြစ်သလဲ?" │ • "ဘယ်နေရာမှာ နှောင့်နှေးသလဲ?" │
│ • ကိန်းဂဏန်းဒေတာ │ • စာသားမှတ်တမ်း        │ • Request တစ်ခုလုံး၏ ခရီးစဉ်  │
│   (CPU %, Memory,│   (Exception stack,   │   (Frontend ➜ API Gateway   │
│    Req/sec, 500s)│    SQL Error, Nginx)  │    ➜ Auth ➜ DB Query)       │
│ • Prometheus     │ • Loki / ELK Stack    │ • Jaeger / Tempo / Open-    │
│   Datadog        │   CloudWatch Logs     │   Telemetry                 │
└──────────────────┴───────────────────────┴─────────────────────────────┘
```

---

## 🏗️ ၃။ Prometheus & Grafana Architecture (အလုပ်လုပ်ပုံ ဖွဲ့စည်းပုံ)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PROMETHEUS SERVER                                │
│                                                                             │
│   ┌────────────────────┐   Pull/Scrape   ┌──────────────────────────────┐   │
│   │ Retrieval Engine   │ ──────────────► │ Target: Node Exporter (:9100)│   │
│   └─────────┬──────────┘                 └──────────────────────────────┘   │
│             │                                                               │
│             ▼                            ┌──────────────────────────────┐   │
│   ┌────────────────────┐                 │ Target: App Metrics (:8080)  │   │
│   │ Time Series DB     │                 └──────────────────────────────┘   │
│   │ (SSD / HDD TSDB)   │                                                    │
│   └─────────┬──────────┘                                                    │
│             │                                                               │
│             ▼ PromQL Engine                                                 │
└─────────────┬─────────────────────────────────┬─────────────────────────────┘
              │                                 │
              │ Fire Alerts                     │ Query PromQL
              ▼                                 ▼
┌───────────────────────────┐     ┌───────────────────────────┐
│       ALERTMANAGER        │     │          GRAFANA          │
│   (Deduplicate & Group)   │     │   (Interactive Dashboards)│
└─────────────┬─────────────┘     └───────────────────────────┘
              │ Webhooks
              ▼
  Telegram / Slack / Email
```

---

## 🛠️ ၄။ ကြိုတင်လိုအပ်ချက်နှင့် Docker Compose Stack ပြင်ဆင်ခြင်း

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.54.1
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alert.rules.yml:/etc/prometheus/alert.rules.yml:ro
      - prometheus_data:/prometheus

  node-exporter:
    image: prom/node-exporter:v1.8.2
    container_name: node-exporter
    ports:
      - "9100:9100"

  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro

  grafana:
    image: grafana/grafana:11.2.0
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=adminpass
```

---

## 🧪 ၅။ လက်တွေ့ လေ့ကျင့်ခန်း ၁: PromQL အခြေခံနှင့် အသုံးများသော Queries

```promql
# CPU Usage %
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage %
((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100

# Disk Space %
100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"})

# 4-Hour Predictive Disk Fill
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[1h], 4 * 3600) < 0
```

---

## 📈 ၆။ လက်တွေ့ လေ့ကျင့်ခန်း ၂: Grafana Dashboards ဖန်တီးခြင်း

Import Dashboard ID: **`1860`** (Node Exporter Full)

---

## 🚨 ၇။ လက်တွေ့ လေ့ကျင့်ခန်း ၃: Alertmanager Alert Rules ရေးဆွဲခြင်း

```yaml
groups:
  - name: production_host_alerts
    rules:
      - alert: HostDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical

      - alert: HostHighCpuLoad
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 5m
        labels:
          severity: warning
```

---

## ☁️ ၈။ AWS CloudWatch Metrics & Alarms

AWS Native Metrics: EC2 `CPUUtilization`, ALB `TargetResponseTime`, RDS `DatabaseConnections`

---

## 📐 ၉။ SRE စံနှုန်းများ: SLI, SLO, SLA & Error Budgets

- **SLI**: လက်တွေ့ တိုင်းတာရရှိသော တန်ဖိုး (99.95% Availability)
- **SLO**: အင်ဂျင်နီယာအဖွဲ့ သတ်မှတ်ထားသော ပစ်မှတ် (99.9% Target)
- **SLA**: Customer နှင့် စာချုပ်ချုပ်ဆိုထားသော တရားဝင် သတ်မှတ်ချက် (99.5% Legal Commitment)

---

## 🔍 ၁၀။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ

```bash
promtool check config prometheus.yml
promtool check rules alert.rules.yml
curl -s http://localhost:9100/metrics | grep node_cpu
```

---

## 💼 ၁၁။ အင်တာဗျူး အမေးအဖြေများ

### မေးခွန်း: Prometheus ၏ Pull Model ဘာကြောင့် သုံးသလဲ?
> "Monitoring Server အား Target များစွာမှ တပြိုင်နက် Push လုပ်၍ Overload မဖြစ်စေရန်နှင့် Target ကျသွားပါက Centralized Health Check ဖြင့် ချက်ချင်း သိရှိနိုင်ရန် ဖြစ်ပါသည်။"

---

## 📋 ၁၂။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့်

👉 **နောက်တစ်ဆင့်**: **[Module 12: DevSecOps (Security Scanning, Hardening & Secrets Management)](../12-devsecops/README.md)**
