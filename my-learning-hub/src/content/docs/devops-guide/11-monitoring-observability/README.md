---
title: "Module 11: Monitoring, Logging & Observability"
description: "Prometheus, Node Exporter, PromQL, Grafana Dashboards, Alertmanager, and AWS CloudWatch Monitoring & Alerting (မြန်မာဘာသာ)"
---

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

### အဓိက အစိတ်အပိုင်းများ:
1. **Prometheus Server**: ပုံမှန် အချိန်အပိုင်းအခြားအလိုက် (ဥပမာ ၁၅ စက္ကန့်တကြိမ်) target များဆီမှ metrics များကို HTTP GET ဖြင့် ဆွဲယူသိမ်းဆည်းသော (Pull Model) Core Engine။
2. **Exporters**: System metrics များကို Prometheus ဖတ်ရှုနိုင်သော standard format ဖြင့် ထုတ်ပေးသော background services များ (ဥပမာ- `node_exporter`, `blackbox_exporter`, `mysqld_exporter`)။
3. **Grafana**: TSDB ထဲရှိ metrics များကို User-friendly interface ဖြင့် chart များ၊ graphs များအဖြစ် ဖော်ပြပေးသော visual platform။
4. **Alertmanager**: Prometheus မှ ထုတ်ပြန်သော alert များကို လက်ခံပြီး duplicate ဖြစ်မှုများကို ပယ်ဖျက်ကာ (deduplication)၊ group ဖွဲ့၍ Slack/Telegram သို့ ပို့ပေးသော component။

---

## 🛠️ ၄။ ကြိုတင်လိုအပ်ချက်နှင့် Docker Compose Stack ပြင်ဆင်ခြင်း

Production ပတ်ဝန်းကျင်တွင် စမ်းသပ်ရန် Prometheus, Node Exporter, Alertmanager နှင့် Grafana အားလုံးကို Docker Compose ဖြင့် စက္ကန့်ပိုင်းအတွင်း တည်ဆောက်နိုင်ပါသည်:

### ၄.၁ `docker-compose.yml`:
```yaml
services:
  prometheus:
    image: prom/prometheus:v2.54.1
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alert.rules.yml:/etc/prometheus/alert.rules.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'

  node-exporter:
    image: prom/node-exporter:v1.8.2
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'

  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro

  grafana:
    image: grafana/grafana:11.2.0
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=adminpass
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

### ၄.၂ `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert.rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### ၄.၃ Stack စတင် run ခြင်း:
```bash
docker compose up -d

# ဝန်ဆောင်မှုများ run နေမှု စစ်ဆေးခြင်း
docker compose ps
```
- **Prometheus UI**: `http://localhost:9090`
- **Node Exporter Metrics**: `http://localhost:9100/metrics`
- **Grafana UI**: `http://localhost:3001` (User: `admin`, Pass: `adminpass`)
- **Alertmanager UI**: `http://localhost:9093`

---

## 🧪 ၅။ လက်တွေ့ လေ့ကျင့်ခန်း ၁: PromQL အခြေခံနှင့် အသုံးများသော Queries (Hands-on Lab 1)

Prometheus Query Language (PromQL) သည် Metric data များကို dynamic စစ်ဆေးရန် အသုံးပြုသော ဘာသာစကား ဖြစ်ပါသည်။

### ၅.၁ Prometheus Metrics အမျိုးအစား ၄ မျိုး:
1. **Counter**: တန်ဖိုး တိုးတက်ရုံသာရှိသော metric (ဥပမာ- `http_requests_total`)။ Reset ဖြစ်ပါက သုညမှ ပြန်စသည်။ `rate()` သို့မဟုတ် `increase()` ဖြင့်သာ အသုံးပြုရသည်။
2. **Gauge**: တက်လိုက် ကျလိုက် ဖြစ်နိုင်သော metric (ဥပမာ- CPU usage, Memory used, Concurrent connections)။
3. **Histogram**: Data များကို range buckets အလိုက် ခွဲခြားတိုင်းတာခြင်း (ဥပမာ- Request latency duration)။
4. **Summary**: Client ဘက်မှ percentile တိုက်ရိုက်တွက်ချက်ထားသော metric။

### ၅.၂ လုပ်ငန်းခွင်သုံး PromQL Queries များ (Must-Know Production PromQL):

#### ၁။ CPU Usage ရာခိုင်နှုန်း တွက်ချက်ခြင်း (%):
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```
*ရှင်းလင်းချက်: Idle ဖြစ်နေသော CPU % ကို ရှာပြီး ၁၀၀ ထဲမှ နှုတ်လိုက်ပါက အသုံးပြုနေသော CPU % ထွက်ပေါ်လာပါသည်။*

#### ၂။ Memory Usage ရာခိုင်နှုန်း တွက်ချက်ခြင်း (%):
```promql
((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100
```

#### ၃။ Disk Space အသုံးပြုမှု ရာခိုင်နှုန်း (%):
```promql
100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"})
```

#### ၄။ ပြီးခဲ့သော ၄ နာရီအတွင်း Disk ပြည့်သွားနိုင်ခြေ ရှိမရှိ ကြိုတင်ခန့်မှန်းခြင်း (Linear Prediction):
```promql
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[1h], 4 * 3600) < 0
```
*အကျိုးကျေးဇူး: Disk ပြည့်မသွားမီ ၄ နာရီအလိုကတည်းက ကြိုတင် alert ရရှိစေပါသည်။*

#### ၅။ HTTP 5xx Server Error Rate တွက်ချက်ခြင်း:
```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
  /
sum(rate(http_requests_total[5m])) by (service) * 100
```

---

## 📈 ၆။ လက်တွေ့ လေ့ကျင့်ခန်း ၂: Grafana Dashboards ဖန်တီးခြင်း (Hands-on Lab 2)

Grafana သည် Prometheus data များကို မျက်စိပသာဒဖြစ်အောင် ပြသပေးသည့် နေရာဖြစ်ပါသည်။

### ၆.၁ Data Source ချိတ်ဆက်ခြင်း:
1. `http://localhost:3001` သို့ browser မှ ဝင်ပါ။
2. **Connections** ➜ **Data Sources** ➜ **Add data source** နှိပ်ပါ။
3. **Prometheus** ကို ရွေးချယ်ပါ။
4. Server URL တွင် `http://prometheus:9090` ဟု ရိုက်ထည့်ပါ။
5. အောက်ဆုံးရှိ **Save & Test** ကို နှိပ်ပါ (အစိမ်းရောင် Success ပြပါမည်)။

### ၆.၂ Official Node Exporter Full Dashboard သွင်းယူခြင်း:
မိမိကိုယ်တိုင် panel တစ်ခုချင်း ရေးဆွဲစရာမလိုဘဲ Community တွင် လူသုံးအများဆုံး dashboard ကို ၁ မိနစ်အတွင်း import လုပ်နိုင်ပါသည်:

1. ဘယ်ဘက် menu မှ **Dashboards** ➜ **New** ➜ **Import** ကို နှိပ်ပါ။
2. Grafana Dashboard ID နေရာတွင် **`1860`** (Node Exporter Full) ဟု ရိုက်ထည့်ပြီး **Load** ကို နှိပ်ပါ။
3. Data Source နေရာတွင် ခုနက ဖန်တီးထားသော **Prometheus** ကို ရွေးချယ်ပြီး **Import** ကို နှိပ်ပါ။
4. 🎉 CPU, Memory, Disk I/O, Network Traffic, Uptime အားလုံးကို စုံလင်စွာ ဖော်ပြသည့် Professional Dashboard ချက်ချင်း ရရှိပါမည်။

---

## 🚨 ၇။ လက်တွေ့ လေ့ကျင့်ခန်း ၃: Alertmanager Alert Rules ရေးဆွဲခြင်း (Hands-on Lab 3)

### ၇.၁ `alert.rules.yml` ဖိုင် ဖန်တီးခြင်း:
```yaml
groups:
  - name: production_host_alerts
    rules:
      # Alert 1: Instance Down
      - alert: HostDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Host {{ $labels.instance }} is DOWN!"
          description: "Target node {{ $labels.instance }} has been unreachable for more than 1 minute."

      # Alert 2: High CPU Usage (> 85% for 5 minutes)
      - alert: HostHighCpuLoad
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU load is {{ printf \"%.2f\" $value }}% on {{ $labels.instance }}."

      # Alert 3: Low Disk Space (< 15% free)
      - alert: HostDiskSpaceRunningLow
        expr: 100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"}) > 85
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Disk space critical on {{ $labels.instance }}"
          description: "Root partition disk usage is over 85% (current: {{ printf \"%.2f\" $value }}%)."
```

### ၇.၂ `alertmanager.yml` (Slack / Telegram Webhook ချိတ်ဆက်ခြင်း):
```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'telegram-notifications'
  routes:
    - match:
        severity: critical
      receiver: 'telegram-notifications'

receivers:
  - name: 'telegram-notifications'
    telegram_configs:
      - bot_token: '123456789:ABCDEF_YourTelegramBotTokenHere'
        chat_id: -1001234567890
        send_resolved: true
        parse_mode: 'HTML'
        message: |
          <b>🔔 Alert: {{ .CommonAnnotations.summary }}</b>
          <b>Severity:</b> {{ .CommonLabels.severity }}
          <b>Description:</b> {{ .CommonAnnotations.description }}
          <b>Status:</b> {{ .Status }}
```

---

## ☁️ ၈။ AWS CloudWatch Metrics & Alarms

AWS ပေါ်တွင် အလုပ်လုပ်သည့်အခါ Prometheus အပြင် AWS ၏ Managed Service ဖြစ်သော **Amazon CloudWatch** ကို မဖြစ်မနေ အသုံးပြုရပါသည်:

### ၈.၁ CloudWatch ၏ အဓိက လုပ်ဆောင်ချက်များ:
1. **CloudWatch Metrics**: EC2 (CPUUtilization, NetworkIn/Out), RDS (DatabaseConnections, FreeStorageSpace), ALB (TargetResponseTime, HTTPCode_Target_5XX_Count) တို့ကို အလိုအလျောက် စုဆောင်းပေးခြင်း။
2. **CloudWatch Alarms**: Metric တန်ဖိုး သတ်မှတ်ချက် ကျော်လွန်ပါက SNS (Simple Notification Service) မှတဆင့် Email/SMS ပို့ခြင်း သို့မဟုတ် Auto Scaling Group ကို trigger ပြုလုပ်ခြင်း။
3. **CloudWatch Logs**: Application log ဖိုင်များနှင့် system logs များကို centralized စုဆောင်းသိမ်းဆည်းခြင်း (Log Groups & Streams)။

### ၈.၂ AWS CLI ဖြင့် EC2 CPU Alarm ဆောက်လုပ်ခြင်း:
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name "EC2-High-CPU-Utilization" \
    --alarm-description "Trigger alarm when CPU exceeds 80% for 5 minutes" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80.0 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
    --evaluation-periods 1 \
    --alarm-actions arn:aws:sns:us-east-1:123456789012:DevOpsAlertsTopic
```

---

## 📐 ၉။ SRE စံနှုန်းများ: SLI, SLO, SLA & Error Budgets

Production စနစ်များ၏ Reliability ကို စကားလုံးသက်သက်ဖြင့် မပြောဘဲ တိကျသော သင်္ချာဖော်မြူလာများဖြင့် တိုင်းတာရပါသည်:

| အခေါ်အဝေါ် | အဓိပ္ပာယ် | လက်တွေ့ ဥပမာ |
|---|---|---|
| **SLI** (Service Level Indicator) | လက်ရှိ စနစ်၏ တိုင်းတာရရှိသော တန်ဖိုး | "ပြီးခဲ့သော ၃၀ ရက်အတွင်း Request ၉၉.၉၅% သည် response time < 200ms ရှိခဲ့သည်" |
| **SLO** (Service Level Objective) | အင်ဂျင်နီယာအဖွဲ့မှ သတ်မှတ်ထားသော ပစ်မှတ် | "ကျွန်ုပ်တို့စနစ်သည် လစဉ် ၉၉.၉% Availability ရှိရမည်" |
| **SLA** (Service Level Agreement) | Customer နှင့် ချုပ်ဆိုထားသော တရားဝင် စာချုပ် | "Availability ၉၉.၅% အောက် ကျဆင်းပါက ငွေကြေးပြန်လျော်ပေးမည်" |
| **Error Budget** | ခွင့်ပြုထားသော ပျက်ကျချိန် (100% - SLO) | ၉၉.၉% SLO တွင် တစ်လလျှင် မိနစ် ၄၃.၈ မိနစ်သာ အမှားဖြစ်ခွင့် (Downtime) ရှိသည် |

---

## 🛡️ ၁၀။ Production Best Practices & Observability Checklist

1. ✅ **Avoid High Cardinality in Metrics**: Metric labels များတွင် User ID, UUID, Timestamp ကဲ့သို့သော တန်ဖိုးသန်းပေါင်းများစွာ ဖြစ်နိုင်သော dynamic values များကို label မတပ်ပါနှင့် (Prometheus RAM တက်ပြီး OOM Crash ဖြစ်စေသည်)။
2. ✅ **Set Up Predictive Disk Alarms**: `predict_linear()` ကို အသုံးပြုပြီး disk မပြည့်မီ ကြိုတင်သတိပေးချက် ယူပါ။
3. ✅ **Group & Throttle Alerts**: Alertmanager တွင် `group_wait` နှင့် `repeat_interval` သတ်မှတ်ထားပါ (Alert Storm ဖြစ်ပြီး Slack/Telegram တွင် notification ရာပေါင်းများစွာ တပြိုင်နက် ရောက်မလာစေရန်)။
4. ✅ **Ensure Alarms Have Runbooks**: Alert တိုင်း၏ annotation တွင် အင်ဂျင်နီယာများ ချက်ချင်း ဖတ်ရှုဖြေရှင်းနိုင်မည့် **Runbook URL** ကို ထည့်သွင်းပေးထားပါ။
5. ✅ **Monitor the Monitor**: Prometheus Server ကိုယ်တိုင် ကျန်းမာမှု ရှိမရှိ (`up{job="prometheus"}`) ကို အမြဲစောင့်ကြည့်ပါ။

---

## 🔍 ၁၁။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ (Verification Commands)

```bash
# ၁။ Prometheus config file syntax စစ်ဆေးခြင်း
docker run --rm -v $(pwd):/etc/prometheus prom/prometheus:v2.54.1 \
    promtool check config /etc/prometheus/prometheus.yml

# ၂။ Alert rules ဖိုင် syntax စစ်ဆေးခြင်း
docker run --rm -v $(pwd):/etc/prometheus prom/prometheus:v2.54.1 \
    promtool check rules /etc/prometheus/alert.rules.yml

# ၃။ Node exporter metrics များကို curl ဖြင့် တိုက်ရိုက် စမ်းသပ်ခြင်း
curl -s http://localhost:9100/metrics | grep node_cpu_seconds_total | head -n 5

# ၄။ Prometheus Targets အားလုံး UP ဖြစ်မဖြစ် API ဖြင့် စစ်ဆေးခြင်း
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'
```

---

## 🚨 ၁၂။ အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting Scenarios)

### ပြဿနာ ၁: Prometheus Target Status ပြသရာတွင် `DOWN` ဖြစ်နေခြင်း
- **အကြောင်းရင်း**: Prometheus သည် target host ၏ port သို့ network အရ ဆက်သွယ်၍ မရခြင်း (Firewall blocked, Container network mismatch သို့မဟုတ် IP မှားယွင်းခြင်း)။
- **ဖြေရှင်းနည်း**:
  ```bash
  # Prometheus container ထဲမှနေ၍ target သို့ curl စမ်းပါ
  docker exec -it prometheus wget -qO- http://node-exporter:9100/metrics
  ```

### ပြဿနာ ၂: Prometheus Server Memory အရမ်းတက်ပြီး Out Of Memory (OOM) ဖြစ်ခြင်း
- **အကြောင်းရင်း**: High Cardinality ဖြစ်သော label များ (ဥပမာ client IP, email) ကို metrics ထဲ ထည့်သွင်းထားခြင်းကြောင့် Time-series အရေအတွက် သန်းနှင့်ချီ များပြားသွားခြင်း။
- **ဖြေရှင်းနည်း**:
  ```promql
  # Time-series အများဆုံး ဖြစ်ပေါ်စေသော metrics များကို စစ်ဆေးပါ
  topk(10, count by (__name__)({__name__=~".+"}))
  ```

### ပြဿနာ ၃: Alertmanager Webhook အလုပ်မလုပ်ခြင်း / Notification မရောက်ခြင်း
- **အကြောင်းရင်း**: Bot Token သို့မဟုတ် Chat ID မှားယွင်းခြင်း၊ Proxy/Firewall မှ webhook endpoint ကို ပိတ်ထားခြင်း။
- **ဖြေရှင်းနည်း**:
  ```bash
  # Alertmanager logs ကို စစ်ဆေးပါ
  docker logs alertmanager --tail 50
  ```

---

## 💼 ၁၃။ အင်တာဗျူး အမေးအဖြေများ (Interview Questions & Model Answers)

### မေးခွန်း ၁: Prometheus ၏ Pull Model နှင့် Push Model ဘာကွာသလဲ? ဘာကြောင့် Pull Model ကို သုံးသလဲ?
**အဖြေ**: 
> "Push Model (ဥပမာ StatsD) တွင် Target servers များသည် Metrics များကို Monitoring server ဆီသို့ တိုက်ရိုက် လှမ်းပို့ကြပါသည်။ Target များစွာမှ တပြိုင်နက် push လုပ်ပါက Monitoring Server တွင် overload ဖြစ်နိုင်ပြီး Target ကျသွားပါက monitor မသိနိုင်ပါ။
> 
> အခြားတစ်ဖက်တွင် Prometheus သည် **Pull Model (Scraping)** ကို သုံးပြီး Prometheus ကိုယ်တိုင်က သတ်မှတ်ထားသော အချိန်အပိုင်းအခြားအလိုက် Target များဆီမှ metrics များကို HTTP GET ဖြင့် လှမ်းဆွဲယူပါသည်။ ၎င်း၏ အားသာချက်မှာ Monitoring server သည် မိမိ လက်ခံနိုင်သော rate အတိုင်းသာ scrape လုပ်သဖြင့် Overload မဖြစ်ခြင်း၊ Target host ကျသွားပါက `up == 0` အဖြစ် ချက်ချင်း သိရှိနိုင်ခြင်းနှင့် Centralized Health Checking ပြုလုပ်နိုင်ခြင်းတို့ ဖြစ်ပါသည်။"

### မေးခွန်း ၂: SLI, SLO နှင့် SLA ဘာကွာသလဲ?
**အဖြေ**:
> "SLI (Service Level Indicator) သည် စနစ်၏ လက်ရှိ အမှန်တကယ် တိုင်းတာရရှိသော တန်ဖိုး (ဥပမာ 99.95% Availability) ဖြစ်သည်။ 
> SLO (Service Level Objective) သည် အင်ဂျင်နီယာအဖွဲ့မှ သတ်မှတ်ထားသော ပစ်မှတ် ရည်မှန်းချက် (ဥပမာ 99.9% ရရှိရမည်) ဖြစ်သည်။ 
> SLA (Service Level Agreement) သည် လုပ်ငန်းရှင်နှင့် Customer တို့အကြား ချုပ်ဆိုထားသော တရားဝင် စာချုပ်ဖြစ်ပြီး SLO ထက် နိမ့်ပါက လျော်ကြေးပေးရသည့် စည်းကမ်းချက် ဖြစ်ပါသည်။"

---

## 📋 ၁၄။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့် (Summary & Next Step)

ယခု Module 11 တွင် သင်သည်:
- Observability ၏ မဏ္ဍိုင်ကြီး ၃ ရပ်နှင့် Prometheus TSDB ၏ အလုပ်လုပ်ပုံကို နားလည်ခဲ့သည်။
- Node Exporter metrics များကို PromQL စွမ်းအားမြင့် query များဖြင့် တွက်ချက်နိုင်ခဲ့သည်။
- Grafana တွင် Production-grade System Dashboard ကို အောင်မြင်စွာ တည်ဆောက်နိုင်ခဲ့သည်။
- Alertmanager ဖြင့် Host Down, High CPU, Low Disk space alerts များကို စနစ်တကျ ပြင်ဆင်နိုင်ခဲ့သည်။
- AWS CloudWatch Alarms နှင့် SRE အခြေခံ စံနှုန်းများ (SLI/SLO/SLA) ကို ကျွမ်းကျင်စွာ အသုံးချတတ်ခဲ့သည်။

👉 **နောက်တစ်ဆင့်**: **[Module 12: DevSecOps (Security Scanning, Hardening & Secrets Management)](/devops-guide/12-devsecops/readme/)** သို့ ဆက်လက် တက်လှမ်းပါမည်။
