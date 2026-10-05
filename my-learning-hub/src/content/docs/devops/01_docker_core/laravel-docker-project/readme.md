---
title: "Real-World Laravel Docker Stack"
description: "ဤ Folder သည် Nginx + PHP 8.3 FPM + MySQL 8.0 + Redis + Mailpit တို့ဖြင့် စနစ်တကျ ဖွဲ့စည်းထားသော လက်တွေ့ Multi-Container Application ဖြစ်သည်။"
---

## 🚀 Real-World Laravel Docker Stack

ဤ Folder သည် **Nginx + PHP 8.3 FPM + MySQL 8.0 + Redis + Mailpit** တို့ဖြင့် စနစ်တကျ ဖွဲ့စည်းထားသော လက်တွေ့ Multi-Container Application ဖြစ်သည်။

---

## 🛠️ စတင် Run နည်း (How to Run)

### ၁။ Container များကို စတင်ခြင်း
```bash
docker compose up -d --build
```

### ၂။ အခြေအနေကို စစ်ဆေးခြင်း
```bash
docker compose ps
```

### ၃။ Browser တွင် ဖွင့်လှစ်စမ်းသပ်ခြင်း
- **Application Test Bench:** [http://localhost:8080](http://localhost:8080)
  - PHP 8.3 FPM status
  - MySQL live database ping
  - Redis cache ping
  - Installed PHP Extensions
- **Mailpit Email Testing Dashboard:** [http://localhost:8025](http://localhost:8025)

### ၄။ Laravel ပရောဂျက်အသစ် ထည့်သွင်းလိုပါက
မိမိ၏ လက်ရှိ Laravel code များကို `src/` directory ထဲသို့ ကူးထည့်နိုင်ပါသည်။
```bash
# Laravel dependencies သွင်းခြင်း
docker compose exec php composer install

# App Key ထုတ်ယူခြင်း
docker compose exec php php artisan key:generate

# Migration run ခြင်း
docker compose exec php php artisan migrate
```

### ၅။ Container များကို ပိတ်သိမ်းခြင်း
```bash
docker compose down
```
*(Database data များကိုပါ တစ်ခါတည်း ဖျက်ပစ်လိုပါက `docker compose down -v` ဟု ရိုက်နိုင်သည်)*
