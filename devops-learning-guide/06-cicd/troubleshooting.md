# 🛠️ GitHub Actions CI/CD Incident Troubleshooting Guide

> **CI/CD Pipelines များတွင် အဖြစ်အများဆုံး အမှားများ၊ Runner ပျက်စီးမှုများ၊ Secret Masking ချို့ယွင်းချက်များနှင့် လက်တွေ့ ဖြေရှင်းနည်းများ**

---

## 🚨 Incident 1: Accidental Secret Leaks in Console Logs

### 症状 (Symptoms):
- Pipeline log ထဲတွင် API Key သို့မဟုတ် Database Password များကို အမှတ်မထင် print ထုတ်မိခြင်း (ဥပမာ- `echo "Config: $DB_PASS"` သို့မဟုတ် debug mode ကြောင့်)။

### 💡 GitHub Actions Secret Masking စည်းမျဉ်း:
- GitHub Actions သည် `${{ secrets.MY_SECRET }}` ကို logs များတွင် `***` အဖြစ် အလိုအလျောက် mask လုပ်ပေးပါသည်။
- **အန္တရာယ် (Gotcha)**: အကယ်၍ Secret တန်ဖိုးကို Base64 encode လုပ်လိုက်ပါက (ဥပမာ- `echo "$SECRET" | base64`) GitHub သည် အဆိုပါ encoded string ကို မသိရှိတော့ဘဲ **Plain Text အတိုင်း log ထဲတွင် ပြသသွားပါမည်**!

### 🛠️ ဖြေရှင်းနည်း & အကောင်းဆုံး အလေ့အကျင့်:
1. Shell commands များတွင် Secret variables များကို `echo` မလုပ်ရပါ။
2. Dynamic output များကို အရေးပေါ် mask လုပ်လိုပါက `add-mask` workflow command ကို သုံးပါ:
   ```bash
   echo "::add-mask::$DYNAMIC_SECRET_VALUE"
   ```

---

## 🚨 Incident 2: SSH Remote Deploy Failures (`Permission denied (publickey)`)

### 症状 (Symptoms):
- `appleboy/ssh-action` တွင် အောက်ပါ Error တက်ခြင်း:
  ```text
  ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey]
  ```

### 💡 Root Cause:
1. GitHub Secret `PROD_SERVER_SSH_KEY` ထဲတွင် Private Key ကို paste ထည့်ရာတွင် ထိပ်ဆုံး `-----BEGIN OPENSSH PRIVATE KEY-----` နှင့် အောက်ဆုံး `-----END OPENSSH PRIVATE KEY-----` စာကြောင်းများ မပါဘဲ ကျန်ခဲ့ခြင်း သို့မဟုတ် trailing newline ပျောက်နေခြင်း။
2. Production Server ပေါ်ရှိ `~/.ssh/authorized_keys` တွင် Public Key မထည့်ရသေးခြင်း သို့မဟုတ် ဖိုင် permission ချောင်နေခြင်း (Linux SSH သည် permission `600` မဟုတ်ပါက ငြင်းပယ်သည်)။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# Production Server ပေါ်တွင် permissions ကို တင်းကျပ်ပါ:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R $USER:$USER ~/.ssh
```

---

## 🚨 Incident 3: Uncontrolled Parallel Deploys (Race Condition)

### 症状 (Symptoms):
- Developer တစ်ဦးသည် ၅ မိနစ်အတွင်း commits (၃) ခု ဆက်တိုက် push လုပ်လိုက်ရာ GitHub Actions workflow ၃ ခု ပြိုင်တူ စတင်ပြေးဆွဲပြီး Server ပေါ်တွင် container restart တစ်ပြိုင်နက် လုပ်မိကာ deployment ပျက်စီးသွားခြင်း။

### 🛠️ ဖြေရှင်းနည်း (`concurrency` group ထည့်သွင်းခြင်း):
Workflow ထိပ်ဆုံးတွင် `concurrency` သတ်မှတ်ခြင်းဖြင့် commit အသစ် ဝင်လာပါက ယခင်ပြေးလက်စ workflow အဟောင်းကို အလိုအလျောက် cancel ပေးသွားမည် ဖြစ်ပါသည်:

```yaml
concurrency:
  group: production-deploy-${{ github.ref }}
  cancel-in-progress: true
```

---

## 🚨 Incident 4: Runner Timeout & Resource Exhaustion

### 症状 (Symptoms):
- Test suite တစ်ခုသည် infinite loop မိသွားသဖြင့် GitHub Actions သည် default ၆ နာရီ (360 minutes) ပြေးဆွဲကာ အခမဲ့ CI minutes များကို ကုန်ဆုံးသွားစေခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
- Job တိုင်းတွင် `timeout-minutes` ကို မဖြစ်မနေ ထည့်သွင်း ကန့်သတ်ပါ:
  ```yaml
  jobs:
    test:
      runs-on: ubuntu-latest
      timeout-minutes: 15 # ၁၅ မိနစ် ကျော်ပါက အလိုအလျောက် ပိတ်ချမည်
  ```

---

## 🚨 Incident 5: Docker Buildx Cache Miss & Slow CI Pipelines

### 症状 (Symptoms):
- Code စာကြောင်း တစ်ကြောင်းတည်း ပြင်ဆင်သော်လည်း `docker build` သည် dependency အားလုံးကို အစအဆုံး ပြန်လည် download ဆွဲနေသဖြင့် Build time မှာ ၁၅ မိနစ်ကျော် ကြာမြင့်နေခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
`docker/build-push-action` တွင် GitHub Actions Cache (`type=gha`) ကို သုံးပါ:

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```
*(နောက်ဆက်တွဲ builds များသည် Layer Cache မှ ချက်ချင်းယူသဖြင့် စက္ကန့် ၃၀ အတွင်း ပြီးဆုံးသွားမည် ဖြစ်ပါသည်)*
