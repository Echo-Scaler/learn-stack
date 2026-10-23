---
title: "၄။ Hands-on Lab: Serverless Deployment"
description: "Python Lambda Function ကို AWS CLI ဖြင့် Deploy လုပ်ခြင်း၊ API Gateway Trigger၊ S3 Event Trigger၊ EventBridge Cron နှင့် Resource Cleanup"
---

# ၄။ Hands-on Lab: Serverless Deployment

ဤ Lab တွင် Python ဖြင့် ရေးသားထားသော Serverless Function တစ်ခုကို AWS CLI ဖြင့် တည်ဆောက်ခြင်း၊ API Gateway ဖြင့် ချိတ်ဆက်ခြင်း၊ S3 Upload Event ဖြင့် စမ်းသပ်ခြင်းနှင့် ရှင်းလင်းခြင်းတို့ကို လက်တွေ့ လေ့လာပါမည်။

---

## 📋 Prerequisites
- AWS CLI တပ်ဆင်ထားပြီး Credential စီမံထားပြီးဖြစ်ခြင်း။

---

## အဆင့် (၁) - Python Lambda Code ရေးသားခြင်း

```bash
mkdir lambda-lab && cd lambda-lab

cat << 'PY' > lambda_function.py
import json
import os

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    
    # HTTP API Gateway မှ လာသော Request ကို စစ်ဆေးခြင်း
    user_name = event.get('queryStringParameters', {}).get('name', 'Cloud Engineer') if event.get('queryStringParameters') else 'Cloud Engineer'
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'message': f'Hello {user_name}, welcome to AWS Serverless Lambda!',
            'version': '1.0.0',
            'status': 'Success'
        })
    }
PY

# Code ကို Zip ဖိုင် ထုပ်ပိုးခြင်း
zip function.zip lambda_function.py
```

---

## အဆင့် (၂) - IAM Execution Role တည်ဆောက်ခြင်း

Lambda က CloudWatch Logs သို့ ရေးသားခွင့်ရရန် IAM Role ဖန်တီးပါမည်:

```bash
# Trust Policy ဖန်တီးခြင်း
cat << 'JSON' > trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
JSON

aws iam create-role \
    --role-name "DemoLambdaExecutionRole" \
    --assume-role-policy-document file://trust-policy.json

# CloudWatch Logs Basic Execution Policy ချိတ်ဆက်ခြင်း
aws iam attach-role-policy \
    --role-name "DemoLambdaExecutionRole" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

ROLE_ARN=$(aws iam get-role --role-name "DemoLambdaExecutionRole" --query 'Role.Arn' --output text)
```

*(IAM Role အသက်ဝင်ရန် ၅ စက္ကန့်ခန့် စောင့်ပါ)*

---

## အဆင့် (၃) - Lambda Function တည်ဆောက်ခြင်း (`create-function`)

```bash
aws lambda create-function \
    --function-name "DemoHelloServerless" \
    --runtime "python3.11" \
    --role "$ROLE_ARN" \
    --handler "lambda_function.lambda_handler" \
    --zip-file "fileb://function.zip" \
    --timeout 10 \
    --memory-size 256 \
    --region "us-east-1"
```

---

## အဆင့် (၄) - AWS CLI ဖြင့် တိုက်ရိုက် Invoke ခေါ်ဆိုစမ်းသပ်ခြင်း

```bash
aws lambda invoke \
    --function-name "DemoHelloServerless" \
    --payload '{"queryStringParameters": {"name": "Aung Aung"}}' \
    --cli-binary-format raw-in-base64-out \
    response.json

cat response.json
```

---

## အဆင့် (၅) - CloudWatch Logs စစ်ဆေးခြင်း

```bash
aws logs tail "/aws/lambda/DemoHelloServerless" --since 5m
```

---

## 🧹 အဆင့် (၆) - Resource Cleanup Checklist

စမ်းသပ်ပြီးပါက မလိုလားအပ်သော အရာများကို ရှင်းလင်းပါ:

```bash
# Lambda Function ဖျက်ခြင်း
aws lambda delete-function --function-name "DemoHelloServerless"

# IAM Role ဖျက်ခြင်း
aws iam detach-role-policy --role-name "DemoLambdaExecutionRole" --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
aws iam delete-role --role-name "DemoLambdaExecutionRole"
```
