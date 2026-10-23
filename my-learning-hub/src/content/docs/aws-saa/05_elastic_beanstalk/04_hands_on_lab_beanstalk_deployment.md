---
title: "၄။ Hands-on Lab: Web App Deployment"
description: "EB CLI ဖြင့် Elastic Beanstalk Application စတင်ခြင်း (eb init), Environment တည်ဆောက်ခြင်း (eb create), Deploy လုပ်ခြင်း (eb deploy) နှင့် Resource Cleanup"
---

# ၄။ Hands-on Lab: Web App Deployment

ဤ Lab တွင် **EB CLI (Elastic Beanstalk Command Line Interface)** ကို အသုံးပြု၍ Sample Web Application တစ်ခုကို မိနစ်ပိုင်းအတွင်း Cloud ပေါ်သို့ တင်ခြင်း၊ Version update လုပ်ခြင်းနှင့် စရိတ်မကျန်စေရန် ရှင်းလင်းခြင်းတို့ကို လက်တွေ့ လေ့လာပါမည်။

---

## 📋 Prerequisites
- Python တပ်ဆင်ထားပြီး EB CLI ကို Install လုပ်ထားခြင်း:
  ```bash
  pip install awsebcli
  eb --version
  ```

---

## အဆင့် (၁) - Sample Application ပြင်ဆင်ခြင်း

```bash
mkdir beanstalk-demo && cd beanstalk-demo

# package.json ဖန်တီးခြင်း
cat << 'JSON' > package.json
{
  "name": "eb-demo-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
JSON

# app.js ရေးသားခြင်း
cat << 'JS' > app.js
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <div style="background:#0b1120;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
      <h1 style="color:#38bdf8;">🌱 Live on AWS Elastic Beanstalk!</h1>
      <p>Environment: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
      <p>App Version: <strong>1.0.0</strong></p>
    </div>
  `);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
JS
```

---

## အဆင့် (၂) - EB CLI ဖြင့် Project စတင်ခြင်း (`eb init`)

```bash
eb init -p nodejs-20 "my-demo-beanstalk-app" --region "us-east-1"
```

---

## အဆင့် (၃) - Environment တည်ဆောက်ပြီး Deploy လုပ်ခြင်း (`eb create`)

Free-tier အတွက် Single-instance တည်ဆောက်ပါမည်:

```bash
eb create "demo-dev-env" --single --instance-types "t3.micro"
```

*(AWS က နောက်ကွယ်တွင် EC2, Security Group, S3 သိုလှောင်မှုများကို ၃ မိနစ်ခန့်အတွင်း အလိုအလျောက် တည်ဆောက်ပေးပါမည်)*

ပြီးစီးပါက Browser တွင် ဝဘ်ဆိုဒ်ကို ဖွင့်ကြည့်ပါ:
```bash
eb open
```

---

## အဆင့် (၄) - Environment Variables သတ်မှတ်ခြင်း (`eb setenv`)

```bash
eb setenv NODE_ENV=production PORT=8080
```

Beanstalk သည် Server Restart ပြုလုပ်စရာမလိုဘဲ Environment Variables များကို အလိုအလျောက် Inject လုပ်ပေးပါသည်။

---

## အဆင့် (၅) - Version အသစ် ပြင်ဆင်၍ Deploy ပြုလုပ်ခြင်း (`eb deploy`)

`app.js` တွင် Version ကို `2.0.0` သို့ ပြင်ပြီး အသစ် Deploy လုပ်ပါ:

```bash
eb deploy -m "Release v2.0.0 with new styling"
```

---

## 🧹 အဆင့် (၆) - Resource Cleanup (အပြီးအပိုင် ရှင်းလင်းခြင်း)

Lab ပြီးဆုံးပါက EC2 နှင့် အခြားသော ချိတ်ဆက်ထားသည့် Resources အားလုံးကို အပြီးအပိုင် ဖျက်ပစ်ပါ:

```bash
eb terminate "demo-dev-env" --force
```

*(Console တွင် EC2 Instance များ Terminated ဖြစ်သွားကြောင်း အတည်ပြုပါ)*
