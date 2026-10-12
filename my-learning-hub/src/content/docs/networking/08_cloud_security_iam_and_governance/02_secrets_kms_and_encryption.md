---
title: AWS Secrets Manager, KMS & Data Encryption
description: AWS Secrets Manager, Auto Secret Rotation, AWS KMS Envelope Encryption, Encryption at Rest နှင့် in Transit
---

## ၁။ AWS Secrets Manager & Secret Rotation

Database Password များကို Code ထဲတွင် မရေးဘဲ Secrets Manager တွင် သိမ်းဆည်းပြီး ရက်ပေါင်း ၃၀ သို့မဟုတ် ၆၀ တိုင်း အလိုအလျောက် လျှို့ဝှက်စွာ ပြောင်းလဲပေးသည် (Automatic Secret Rotation)။

---

## ၂။ AWS KMS & Data Encryption

- **Encryption at Rest:** EBS Storage, S3 Bucket နှင့် RDS Database များကို AWS KMS Key ဖြင့် ဝှက်စာပြုလုပ်ခြင်း။
- **Encryption in Transit:** ဒေတာ သွားလာသမျှကို TLS 1.3 / HTTPS ဖြင့်သာ ပို့ဆောင်ခြင်း။
