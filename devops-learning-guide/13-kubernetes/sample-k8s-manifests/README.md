# 📦 Sample Kubernetes Production Manifests

This folder contains a complete set of production-grade declarative Kubernetes manifests for deploying a multi-replica containerized web application with autoscaling.

## 📂 Manifests Included
```text
sample-k8s-manifests/
├── 01-namespace.yaml        # Isolated project namespace
├── 02-configmap-secret.yaml # Externalized configurations & secrets
├── 03-deployment.yaml       # 3-Replica Deployment with Health Probes & Resource Limits
├── 04-service.yaml          # ClusterIP Internal Load Balancing Service
├── 05-hpa.yaml              # Horizontal Pod Autoscaler (2-10 pods)
└── README.md
```

## 🚀 How to Deploy

1. Apply all manifests in order:
   ```bash
   kubectl apply -f 01-namespace.yaml
   kubectl apply -f 02-configmap-secret.yaml
   kubectl apply -f 03-deployment.yaml
   kubectl apply -f 04-service.yaml
   kubectl apply -f 05-hpa.yaml
   ```
2. Verify all resources in the namespace:
   ```bash
   kubectl get all -n production
   ```
