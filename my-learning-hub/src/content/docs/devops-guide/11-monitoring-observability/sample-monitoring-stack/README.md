---
title: "Sample Monitoring & Observability Stack"
description: "Production-ready Docker Compose stack for Prometheus, Node Exporter, Alertmanager, and Grafana"
---


This folder contains a ready-to-run Docker Compose monitoring stack with Prometheus, Node Exporter, Alertmanager, and Grafana.

## 📂 Files Included
```text
sample-monitoring-stack/
├── docker-compose.yml
├── prometheus/
│   ├── prometheus.yml
│   └── alert.rules.yml
├── alertmanager/
│   └── alertmanager.yml
└── README.md
```

## 🚀 How to Run

1. Start all monitoring services:
   ```bash
   docker compose up -d
   ```
2. Verify all 4 containers are running:
   ```bash
   docker compose ps
   ```
3. Open the UIs in your browser:
   - **Prometheus**: `http://localhost:9090`
   - **Grafana**: `http://localhost:3001` (user: `admin`, pass: `adminpass`)
   - **Alertmanager**: `http://localhost:9093`
   - **Node Exporter**: `http://localhost:9100/metrics`
4. Stop the stack:
   ```bash
   docker compose down
   ```
