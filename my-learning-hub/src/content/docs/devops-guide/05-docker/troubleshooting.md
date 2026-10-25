---
title: "🛠️ Docker & Container Incident Troubleshooting Guide"
description: "🛠️ Docker & Container Incident Troubleshooting Guide"
---


> **Containers များတွင် အဖြစ်အများဆုံး Outages များ၊ CrashLoop အမှားများ၊ Exit Codes များနှင့် လက်တွေ့ ပြင်ဆင်နည်းများ**

---

## 🚨 Incident 1: Container Exited with Code 137 (Out Of Memory - OOMKilled)

### 症状 (Symptoms):
- Container သည် ရုတ်တရက် ရပ်တန့်သွားပြီး `docker ps -a` တွင် `Exited (137)` ဟု ပြနေခြင်း။

### 🔍 စုံစမ်းစစ်ဆေးနည်း:
```bash
# ၁။ Container ၏ exit အသေးစိတ်ကို JSON မှ စစ်ဆေးပါ
docker inspect <CONTAINER_ID> --format '{{.State.OOMKilled}}'
# Expected: true (OOM ကြောင့် Kernel မှ သတ်ပစ်လိုက်ခြင်း ဖြစ်သည်)

# ၂။ Host Kernel Log ထဲတွင် မည်သည့် process သေဆုံးသွားသည်ကို စစ်ဆေးပါ
dmesg -T | grep -i -E "oom|killed process"
```

### 🛠️ ဖြေရှင်းနည်း:
1. `docker-compose.yml` တွင် `deploy.resources.limits.memory` ကို လိုအပ်သော ပမာဏအထိ တိုးမြှင့်ပေးပါ (ဥပမာ- `512M` မှ `1G` သို့)။
2. Application အတွင်း Node.js heap limit (`--max-old-space-size=1024`) သို့မဟုတ် Java JVM heap (`-Xmx`) ကို Container limit ထက် အနည်းငယ် လျှော့ချ သတ်မှတ်ပေးပါ။

---

## 🚨 Incident 2: "bind: address already in use" (Port Conflict)

### 症状 (Symptoms):
- `docker run` သို့မဟုတ် `docker compose up` ပြုလုပ်ရာတွင်:
  ```text
  Error response from daemon: driver failed programming external connectivity on endpoint ...: Bind for 0.0.0.0:80 failed: port is already allocated
  ```

### 💡 Root Cause:
- Host စက်ပေါ်ရှိ အဆိုပါ Port (ဥပမာ 80 သို့မဟုတ် 5432) ကို ဒေသတွင်း Apache, Nginx သို့မဟုတ် အခြား Container တစ်ခုခုက ကြိုတင် နေရာယူထားခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# မည်သည့် process က port 80 ကို နေရာယူထားသည်ကို ရှာဖွေပါ
sudo ss -tulpn | grep :80

# အကယ်၍ host service (ဥပမာ Apache) ဖြစ်နေပါက ပိတ်ပါ
sudo systemctl stop apache2

# သို့မဟုတ် Dockerfile/Compose တွင် host port ကို ပြောင်းလဲပေးပါ (ဥပမာ 8080:80)
```

---

## 🚨 Incident 3: Container Crashes Immediately (PID 1 Exit Problem)

### 症状 (Symptoms):
- `docker run -d myimage` ရိုက်ပြီး စက္ကန့်ပိုင်းအတွင်း `docker ps` တွင် မတွေ့ရတော့ဘဲ `docker ps -a` တွင် `Exited (0)` သို့မဟုတ် `Exited (1)` ဖြစ်သွားခြင်း။

### 💡 Root Cause:
- **Docker ၏ အခြေခံ သဘောတရား**: Container တစ်ခုသည် ၎င်း၏ **PID 1 (Main Process)** အလုပ်လုပ်နေသရွေ့သာ အသက်ရှင်ပါသည် (Alive)။ အကယ်၍ command သည် background daemon ဖြစ်သွားပါက (ဥပမာ- `CMD nginx` သို့မဟုတ် `CMD service mysql start`) ၎င်း command ပြီးဆုံးသည်နှင့် Container ချက်ချင်း ပိတ်ကျသွားခြင်း ဖြစ်သည်။

### 🛠️ ဖြေရှင်းနည်း:
- Main Process ကို Foreground အနေဖြင့် အမြဲ ပြေးဆွဲစေရမည်:
  ```dockerfile
  # ❌ မှားယွင်းသော နည်းလမ်း (Background process ဖြစ်သဖြင့် container ချက်ချင်း သေသွားမည်)
  CMD nginx

  # ✅ မှန်ကန်သော စံပြ နည်းလမ်း (Foreground တွင် အမြဲ နားထောင်စေသည်)
  CMD ["nginx", "-g", "daemon off;"]
  ```

---

## 🚨 Incident 4: Permission Denied on Mounted Volumes with Non-Root User

### 症状 (Symptoms):
- Container log တွင် `EACCES: permission denied, open '/app/storage/logs/laravel.log'` ဟု ပြပြီး application မတက်ခြင်း။

### 💡 Root Cause:
- Container အတွင်းရှိ application ကို လုံခြုံရေးအရ Non-root user (ဥပမာ UID `1000` သို့မဟုတ် `node`) ဖြင့် run ထားသော်လည်း Host စက်ပေါ်ရှိ mounted folder သည် Root (`UID 0`) ပိုင်ဆိုင်မှု ဖြစ်နေသဖြင့် write ခွင့် မရခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# Host ပေါ်ရှိ directory ownership ကို Container ၏ non-root UID (e.g. 1000) သို့ ပြောင်းလဲပေးခြင်း
sudo chown -R 1000:1000 ./storage
sudo chmod -R 775 ./storage
```

---

## 🚨 Incident 5: Inter-Container Communication Failure ("ENOTFOUND db")

### 症状 (Symptoms):
- Web container log တွင် `Error: getaddrinfo ENOTFOUND db` တက်ပြီး Database သို့ ချိတ်မရခြင်း။

### 💡 Root Cause:
1. Service နှစ်ခုသည် တူညီသော User-defined bridge network ထဲတွင် မရှိဘဲ ကွဲပြားနေခြင်း။
2. Database container မတက်မီ Web container က စောစီးစွာ စတင်မိခြင်း (Race Condition)။

### 🛠️ ဖြေရှင်းနည်း:
1. `docker-compose.yml` တွင် services အားလုံး တူညီသော `networks: - app-network` အောက်တွင် ရှိမရှိ စစ်ဆေးပါ။
2. Database ready မဖြစ်မချင်း စောင့်ဆိုင်းစေရန် `condition: service_healthy` ကို ထည့်သွင်းပါ:
   ```yaml
   depends_on:
     db:
       condition: service_healthy
   ```
