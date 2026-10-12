---
title: Git Branching Workflows & CI/CD Fundamentals
description: Git Branching, Pull Requests, CI vs CD, Automated Tests နှင့် Artifact Management
---

## ၁။ CI vs CD ကွာခြားချက်များ

```
[ Git Push ] ──► [ Continuous Integration (CI) ] ──► [ Continuous Deployment (CD) ]
                  - Automated Linting                 - Deploy to Staging
                  - Unit / Integration Tests          - Automated Health Check
                  - Docker Build & Vulnerability Scan - Blue/Green Deploy to Production
```

- **CI (Continuous Integration):** Code အသစ် Push လုပ်တိုင်း အမှားမပါစေရန် Automated Tests များ အလိုအလျောက် Run ခြင်း။
- **CD (Continuous Delivery / Deployment):** Tests အောင်မြင်ပါက Production သို့ အလိုအလျောက် Deploy လုပ်ဆောင်ခြင်း။
