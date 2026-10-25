---
title: "Prometheus, PromQL & Grafana Cheatsheet"
description: "Essential PromQL queries, Node Exporter metrics, Prometheus server config, and Grafana dashboard shortcuts"
---


> **လုပ်ငန်းခွင်သုံး PromQL Queries များ၊ Node Exporter Metric Names နှင့် Prometheus Config လက်စွဲ**

---

## ⚡ ၁။ အသုံးများဆုံး Production PromQL Queries

| လိုချင်သော အချက်အလက် | PromQL Query |
|---|---|
| **CPU Usage %** | `100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| **Available RAM %** | `(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100` |
| **Used RAM %** | `((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100` |
| **Root Disk Used %** | `100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"})` |
| **Network RX (Bytes/sec)** | `sum by (instance) (rate(node_network_receive_bytes_total{device!~"lo|docker.*|veth.*"}[5m]))` |
| **Network TX (Bytes/sec)** | `sum by (instance) (rate(node_network_transmit_bytes_total{device!~"lo|docker.*|veth.*"}[5m]))` |
| **Target UP Status** | `up == 1` (Active) သို့မဟုတ် `up == 0` (Down) |
| **Request Per Second** | `sum(rate(http_requests_total[1m])) by (path)` |
| **HTTP 5xx Error Rate %** | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100` |
| **95th Percentile Latency** | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |
| **4h Disk Full Forecast** | `predict_linear(node_filesystem_free_bytes{mountpoint="/"}[1h], 4 * 3600) < 0` |

---

## 📦 ၂။ Node Exporter Core Metrics List

| Metric Name | အမျိုးအစား | ရှင်းလင်းချက် |
|---|---|---|
| `node_cpu_seconds_total` | Counter | CPU core တစ်ခုချင်းစီ၏ mode အလိုက် ကုန်ဆုံးသော စက္ကန့်များ |
| `node_memory_MemTotal_bytes` | Gauge | ဆာဗာ၏ စုစုပေါင်း RAM ပမာဏ (Bytes) |
| `node_memory_MemAvailable_bytes` | Gauge | အသုံးပြုရန် ကျန်ရှိသော RAM ပမာဏ (Bytes) |
| `node_filesystem_size_bytes` | Gauge | Disk partition ၏ စုစုပေါင်း အရွယ်အစား |
| `node_filesystem_avail_bytes` | Gauge | Disk partition တွင် အသုံးပြုနိုင်ရန် ကျန်ရှိသော နေရာ |
| `node_network_receive_bytes_total` | Counter | Network interface မှ လက်ခံရရှိသော စုစုပေါင်း Bytes |
| `node_load1`, `node_load5`, `node_load15` | Gauge | Linux System Load Average (1, 5, 15 မိနစ်) |
| `node_boot_time_seconds` | Gauge | စနစ် စတင် run ခဲ့သော Unix Timestamp (Uptime တွက်ရန်သုံးသည်) |

---

## 🛠️ ၃။ Promtool & Prometheus CLI Commands

```bash
# Prometheus config file စစ်ဆေးခြင်း
promtool check config prometheus.yml

# Alert rules file စစ်ဆေးခြင်း
promtool check rules alert.rules.yml

# Prometheus config ကို reload လုပ်ခြင်း (Downtime မရှိစေဘဲ)
curl -X POST http://localhost:9090/-/reload

# Targets များ status စစ်ဆေးခြင်း
curl -s http://localhost:9090/api/v1/targets | jq .
```

---

## 🎨 ၄။ အသုံးများဆုံး Grafana Community Dashboard IDs

- **`1860`**: Node Exporter Full (Linux Server ကျန်းမာရေးအတွက် အကောင်းဆုံး Dashboard)
- **`893`**: Docker and System Monitoring
- **`3662`**: Prometheus 2.0 Overview
- **`7362`**: MySQL / MariaDB Overview
- **`9628`**: PostgreSQL Database
