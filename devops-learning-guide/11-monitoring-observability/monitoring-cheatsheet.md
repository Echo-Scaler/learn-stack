# 📋 Prometheus, PromQL & Grafana Cheatsheet

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
| **4h Disk Full Forecast** | `predict_linear(node_filesystem_free_bytes{mountpoint="/"}[1h], 4 * 3600) < 0` |

---

## 🛠️ ၂။ Promtool & Prometheus CLI Commands

```bash
promtool check config prometheus.yml
promtool check rules alert.rules.yml
curl -X POST http://localhost:9090/-/reload
curl -s http://localhost:9090/api/v1/targets | jq .
```
