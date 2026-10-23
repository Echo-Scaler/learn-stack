---
title: "၃။ Hands-on Lab: Batch Job Processing"
description: "AWS CLI ဖြင့် Job Definition မှတ်ပုံတင်ခြင်း၊ Fargate Compute Environment၊ Job Queue၊ Job Submit ပြုလုပ်ခြင်းနှင့် Resource Cleanup"
---

# ၃။ Hands-on Lab: Batch Job Processing

ဤ Lab တွင် AWS CLI ကို အသုံးပြု၍ Serverless Fargate Compute Environment ပေါ်တွင် အလုပ်လုပ်မည့် AWS Batch Job တစ်ခုကို Submit လုပ်ခြင်း၊ အခြေအနေ စောင့်ကြည့်ခြင်းနှင့် ရှင်းလင်းခြင်းတို့ကို လက်တွေ့ လေ့လာပါမည်။

---

## 📋 Prerequisites
- AWS CLI တပ်ဆင်ထားပြီး Credential စီမံထားပြီးဖြစ်ခြင်း။

---

## အဆင့် (၁) - Job Definition ရေးဆွဲခြင်း

`job-def.json` ဖိုင်တစ်ခု ရေးသားပါမည် (Alpine Linux Container ပေါ်တွင် တွက်ချက်မှုတစ်ခု run မည်):

```json
{
  "jobDefinitionName": "demo-math-job",
  "type": "container",
  "platformCapabilities": ["FARGATE"],
  "containerProperties": {
    "image": "public.ecr.aws/amazonlinux/amazonlinux:2023",
    "command": ["sh", "-c", "echo 'Starting Data Calculation...'; seq 1 1000 | awk '{s+=$1} END {print \"Sum is:\", s}'; sleep 5; echo 'Batch Job Completed Successfully!'"],
    "resourceRequirements": [
      { "type": "VCPU", "value": "0.25" },
      { "type": "MEMORY", "value": "512" }
    ],
    "fargatePlatformConfiguration": {
      "platformVersion": "LATEST"
    },
    "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole"
  }
}
```

Job Definition ကို မှတ်ပုံတင်ပါ:
```bash
aws batch register-job-definition --cli-input-json file://job-def.json --region us-east-1
```

---

## အဆင့် (၂) - Job Submit ပြုလုပ်ခြင်း (`submit-job`)

ရှိပြီးသား Job Queue (ဥပမာ- `fargate-job-queue`) ထဲသို့ အလုပ်ကို Submit တင်ပါမည်:

```bash
aws batch submit-job \
    --job-name "calculate-sum-01" \
    --job-queue "fargate-job-queue" \
    --job-definition "demo-math-job" \
    --region us-east-1
```

CLI မှ Job ID (ဥပမာ- `7b2e8c91-4d32-...`) ကို ပြန်လည် ထုတ်ပေးပါမည်။

---

## အဆင့် (၃) - Job Status စောင့်ကြည့်ခြင်း

```bash
aws batch describe-jobs --jobs 7b2e8c91-4d32-... --query "jobs[*].[status,statusReason]" --output table
```

Status သည် `SUBMITTED → PENDING → RUNNABLE → STARTING → RUNNING → SUCCEEDED` အဖြစ် အဆင့်ဆင့် ပြောင်းလဲသွားပါမည်။

---

## အဆင့် (၄) - CloudWatch Logs တွင် အဖြေကြည့်ရှုခြင်း

```bash
# CloudWatch Logs တွင် Job က ထုတ်ပေးလိုက်သော Output ကို ကြည့်ရှုခြင်း
aws logs tail "/aws/batch/job" --since 5m
```

---

## 🧹 အဆင့် (၅) - Resource Cleanup Checklist

စမ်းသပ်ပြီးပါက မလိုအပ်သော Job Definitions နှင့် Queues များကို ရှင်းလင်းပါ:

```bash
# Job Definition ကို Deregister လုပ်ခြင်း
aws batch deregister-job-definition --job-definition "demo-math-job:1"

# Queue ကို Disable လုပ်ပြီးမှ ဖျက်ပစ်ပါ
aws batch update-job-queue --job-queue "fargate-job-queue" --state DISABLED
aws batch delete-job-queue --job-queue "fargate-job-queue"
```
