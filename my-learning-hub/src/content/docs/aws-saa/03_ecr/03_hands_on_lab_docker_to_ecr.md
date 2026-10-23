---
title: "၃။ Hands-on Lab: Docker to ECR"
description: "ECR Repository ဖန်တီးခြင်း၊ Docker Image တည်ဆောက်ခြင်း၊ Tag တပ်ဆင်ခြင်း၊ ECR သို့ Push တင်ခြင်း၊ Local တွင် Pull စမ်းသပ်ခြင်းနှင့် Version Update ပြုလုပ်နည်း"
---

# ၃။ Hands-on Lab: Docker to ECR

ဤ Lab တွင် Local Machine ရှိ Sample Web Application တစ်ခုကို Docker Image အဖြစ် Build လုပ်ပြီး Amazon ECR သို့ တင်ခြင်း၊ Version စီမံခြင်းနှင့် ပြန်လည် Pull ဆွဲ၍ စမ်းသပ်ခြင်းတို့ကို လက်တွေ့ လေ့လာပါမည်။

---

## 📋 Prerequisites
- AWS CLI တပ်ဆင်ထားပြီး `aws configure` ပြုလုပ်ထားပြီးဖြစ်ခြင်း။
- Local စက်တွင် **Docker Desktop** (သို့မဟုတ် Docker Engine) စတင်လည်ပတ်နေခြင်း (`docker --version`)။
- မိမိ၏ AWS Account ID ကို သိရှိထားခြင်း (`aws sts get-caller-identity --query Account --output text`)။

---

## အဆင့် (၁) - ECR Repository အသစ် ဖန်တီးခြင်း

Scanning နှင့် Tag Immutability ဖွင့်ထားသော Repository တစ်ခုကို AWS CLI ဖြင့် ဆောက်ပါမည်:

```bash
aws ecr create-repository \
    --repository-name "my-web-app" \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 \
    --region us-east-1
```

### Parameter ရှင်းလင်းချက်:
- `--repository-name "my-web-app"`: သိမ်းဆည်းမည့် App အမည်။
- `scanOnPush=true`: Image အသစ် Push တင်လိုက်သည်နှင့် CVE လုံခြုံရေး အားနည်းချက်များကို အလိုအလျောက် Scan ဖတ်ရန် ညွှန်ကြားခြင်း။
- `encryptionType=AES256`: AWS KMS သော့ဖြင့် Data at rest ကို လျှို့ဝှက်ကုဒ်ပြောင်းရန် သတ်မှတ်ခြင်း။

---

## အဆင့် (၂) - Sample Web Application နှင့် Dockerfile ဖန်တီးခြင်း

Local Directory တစ်ခုဆောက်၍ စမ်းသပ်ရန် Nginx HTML Web App ပြင်ဆင်ပါမည်:

```bash
mkdir ecr-demo && cd ecr-demo

# index.html ရေးသားခြင်း
cat << 'HTML' > index.html
<!DOCTYPE html>
<html>
<head>
    <title>AWS ECR Container Demo</title>
    <style>
        body { font-family: sans-serif; background: #090d16; color: #fff; text-align: center; padding: 60px; }
        .box { background: #1a2234; padding: 40px; border-radius: 12px; display: inline-block; border-left: 5px solid #ff9900; }
        h1 { color: #ff9900; }
    </style>
</head>
<body>
    <div class="box">
        <h1>🐳 ECR Container Live - Version 1.0!</h1>
        <p>This image was pulled successfully from <strong>Amazon ECR</strong>.</p>
    </div>
</body>
</html>
HTML

# Dockerfile ရေးသားခြင်း
cat << 'DOCKERFILE' > Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKERFILE
```

---

## အဆင့် (၃) - Docker Image တည်ဆောက်ခြင်း (Build)

```bash
docker build -t my-web-app:1.0 .
```

---

## အဆင့် (၄) - ECR သို့ Docker Login ဝင်ရောက်ခြင်း

မိမိ၏ AWS Account ID ကို Variable ထဲသို့ ထည့်၍ Login ဝင်ပါ:

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ECR Auth Token ဖြင့် Docker Login
aws ecr get-login-password --region ${AWS_REGION} | docker login \
    --username AWS \
    --password-stdin ${ECR_URI}

# Expected Output: Login Succeeded
```

---

## အဆင့် (၅) - ECR Naming Standard အတိုင်း Image Tag တပ်ခြင်း

ECR သို့ Push တင်နိုင်ရန် Docker Image အား Full ECR URI ဖြင့် Tag ပေးရပါမည်:

```bash
docker tag my-web-app:1.0 ${ECR_URI}/my-web-app:1.0
```

---

## အဆင့် (၆) - ECR သို့ Image Push တင်ခြင်း

```bash
docker push ${ECR_URI}/my-web-app:1.0
```

Terminal တွင် Layer တစ်ခုချင်းစီ Upload ဖြစ်သွားပြီး အောင်မြင်ကြောင်း ပြသပါမည်။

---

## အဆင့် (၇) - ECR ပေါ်ရှိ Image များနှင့် Scan ရလဒ်များ စစ်ဆေးခြင်း

```bash
aws ecr describe-images \
    --repository-name "my-web-app" \
    --region ${AWS_REGION} \
    --output table
```

Output တွင် Image Digest (`sha256:...`)၊ Image Size နှင့် `scanOnPush` လုပ်ဆောင်ထားသော Vulnerability Status ကို တွေ့မြင်ရမည်။

---

## အဆင့် (၈) - ECR မှ Image ကို ပြန်လည် Pull ဆွဲ၍ စမ်းသပ်ခြင်း

Local စက်ရှိ Image အဟောင်းကို ဖျက်၍ ECR မှ တိုက်ရိုက် ပြန်ဆွဲပါ:

```bash
# Local image ဖျက်ခြင်း
docker rmi ${ECR_URI}/my-web-app:1.0

# ECR မှ တိုက်ရိုက် Pull ဆွဲပြီး Port 8080 တွင် Run ခြင်း
docker run -d -p 8080:80 ${ECR_URI}/my-web-app:1.0
```

Browser တွင် `http://localhost:8080` သို့ သွားရောက် ကြည့်ရှုပါ။ ECR မှ ဆွဲယူထားသော Web Page ပေါ်လာမည် ဖြစ်ပါသည်။

---

## 🧹 အဆင့် (၉) - Resource Cleanup Checklist

စမ်းသပ်ပြီးပါက ECR Storage စရိတ် မကျန်ရှိစေရန် Repository နှင့် Image များကို ရှင်းလင်းပါ:

```bash
# Container ရပ်တန့်ခြင်း
docker stop $(docker ps -q --filter ancestor=${ECR_URI}/my-web-app:1.0)

# ECR Repository ကို ၎င်းအတွင်းရှိ Image များပါ အပြီးအပိုင် ဖျက်ပစ်ခြင်း
aws ecr delete-repository \
    --repository-name "my-web-app" \
    --force \
    --region ${AWS_REGION}
```
