---
title: Project 4 — End-to-End CI/CD Automation Pipeline Lab
description: GitHub Actions, Automated Unit Tests, Docker Image Build, Amazon ECR, Amazon ECS Fargate နှင့် Rollback Automation
---

## 📌 Project Overview
Developer က Git Push လုပ်သည်နှင့် အလိုအလျောက် Deploy လုပ်ပေးသော CI/CD Pipeline တည်ဆောက်ပါမည်။

### Tasks Breakdown
1. GitHub Repository တွင် `.github/workflows/deploy.yml` ရေးသားပါ။
2. Push ပြုလုပ်ချိန်တွင် Automated Unit Tests များ အလိုအလျောက် Run စေပါ။
3. Docker Image Build လုပ်ပြီး **Amazon ECR** သို့ Push တင်ပါ။
4. **Amazon ECS Fargate** Service Update ဖြင့် Zero-Downtime Rolling Deployment လုပ်ပါ။
5. ALB Health Check မအောင်မြင်ပါက မူလ Version သို့ အလိုအလျောက် Rollback ပြန်ဆင်းနိုင်ကြောင်း စမ်းသပ်ပါ။
