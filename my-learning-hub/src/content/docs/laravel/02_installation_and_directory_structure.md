---
title: "02. Directory Structure"
description: "1. [စနစ် လိုအပ်ချက်များနှင့် စတင် Install လုပ်ခြင်း](#၁-စနစ်-လိုအပ်ချက်များနှင့်-စတင်-install-လုပ်ခြင်း)"
---

## 📁 သင်ခန်းစာ (၂) - Laravel Project တည်ဆောက်ခြင်းနှင့် Directory Structure အသေးစိတ်
### (Lesson 2: Project Installation, Setup & Deep Dive into Directory Structure)

---

## 📌 မာတိကာ (Contents)
1. [စနစ် လိုအပ်ချက်များနှင့် စတင် Install လုပ်ခြင်း](#၁-စနစ်-လိုအပ်ချက်များနှင့်-စတင်-install-လုပ်ခြင်း)
2. [Artisan CLI ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ](#၂-artisan-cli-ဆိုတာဘာလဲ)
3. [Laravel Directory Structure အပြည့်အစုံ ရှင်းလင်းချက် (Function Sectors)](#၃-laravel-directory-structure-အပြည့်အစုံ-ရှင်းလင်းချက်)
   - [၃.၁။ `app/` Directory (Core Business Logic)](#၃၁-app-directory)
   - [၃.၂။ `config/` Directory (Centralized System Config)](#၃၂-config-directory)
   - [၃.၃။ `database/` Directory (Database Management)](#၃၃-database-directory)
   - [၃.၄။ `public/` Directory (Web Root)](#၃၄-public-directory)
   - [၃.၅။ `resources/` Directory (Presentation & Assets)](#၃၅-resources-directory)
   - [၃.၆။ `routes/` Directory (Application Endpoints)](#၃၆-routes-directory)
   - [၃.၇။ `storage/` Directory (Logs & Uploaded Media)](#၃၇-storage-directory)
4. [Environment Configuration (`.env`) ဖိုင် (ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၄-environment-configuration-env-ဖိုင်)
5. [လုပ်ငန်းခွင်သုံး အသုံးအများဆုံး Artisan Commands စာရင်း](#၅-လုပ်ငန်းခွင်သုံး-အသုံးအများဆုံး-artisan-commands-စာရင်း)

---

## ၁။ စနစ် လိုအပ်ချက်များနှင့် စတင် Install လုပ်ခြင်း

Laravel 11+ ကို စတင်အသုံးပြုရန် သင့်စက်တွင် အောက်ပါ Software များ ရှိထားရန် လိုအပ်ပါသည်:
* **PHP >= 8.2** (BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML)
* **Composer** (PHP Package Dependency Manager)
* **MySQL / PostgreSQL / SQLite**

### Composer ဖြင့် Project အသစ် ဆောက်ခြင်း:
```bash
composer create-project laravel/laravel my-first-laravel
cd my-first-laravel
```

---

## ၂။ Artisan CLI ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Artisan** ဆိုသည်မှာ Laravel တွင် Built-in ပါဝင်သော Command-Line Interface (CLI) ဖြစ်ပြီး စနစ်တစ်ခုလုံးကို Terminal မှ ထိန်းချုပ်စေခိုင်းနိုင်သော လက်ထောက်ကိရိယာ ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Controller တစ်ခု၊ Model တစ်ခု သို့မဟုတ် Migration ဖိုင်တစ်ခု ဆောက်ရန်အတွက် Folder ထဲသွားပြီး ဖိုင်လက်ဖြင့်ဆောက်၊ Namespace လက်ဖြင့်ရိုက်၊ Class ရေးသားနေရပါက အချိန်ကုန်ပြီး စာလုံးပေါင်းမှားယွင်းမှုများ ဖြစ်စေသည်။ Artisan ဖြင့် စက္ကန့်ပိုင်းအတွင်း Boilerplate Code များကို တိကျစွာ ထုတ်လုပ်ပေးနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Rapid Development**: `php artisan make:model Product -mcr` ဟု ရိုက်လိုက်ရုံဖြင့် Model, Migration, Controller, Resource အားလုံး ၅ စက္ကန့်အတွင်း အဆင်သင့် ဖြစ်သွားသည်။
* **Database Automation**: Migration run ခြင်း၊ Rollback လုပ်ခြင်း၊ Seeder ဒေတာ ထည့်ခြင်းများကို ခလုတ်တစ်ချက်ဖြင့် လုပ်ဆောင်နိုင်သည်။
* **Local Server**: Apache/Nginx မလိုဘဲ `php artisan serve` ဖြင့် Local Server ချက်ချင်း run နိုင်သည်။

```bash
# Local Development Web Server စတင်ခြင်း
php artisan serve
```

---

## ၃။ Laravel Directory Structure အပြည့်အစုံ ရှင်းလင်းချက် (Function Sectors)

Laravel ၏ Directory Structure သည် MVC Architecture အပေါ်တွင် တည်ဆောက်ထားသောကြောင့် ကုဒ်များကို စနစ်တကျ အပိုင်းလိုက် ခွဲခြားသိမ်းဆည်းပေးသည်။

```
my-project/
├── app/                  # Application Core (Controllers, Models, Middleware)
├── bootstrap/            # App Bootstrapping (app.php)
├── config/               # App Configuration Files
├── database/             # Migrations, Seeders, Factories
├── public/               # Document Root (index.php, CSS, JS, Images)
├── resources/            # Views (Blade), CSS/JS
├── routes/               # Routing files (web.php, api.php, console.php)
├── storage/              # Logs, Uploads, Cache
├── tests/                # Feature & Unit Tests
├── vendor/               # Composer dependencies
└── .env                  # Environment Variables
```

---

### ၃.၁။ `app/` Directory (Core Business Logic)
* **ဒါက ဘာလဲ**: Application ၏ အဓိက ဦးနှောက်ဖြစ်ပြီး ကုဒ်အများစု ရေးသားရသည့်နေရာ ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: Business Logic, Database Models နှင့် Middlewares များကို သီးခြားခွဲထုတ်ထားရန်။
* **အစိတ်အပိုင်းများ**:
  - `app/Http/Controllers/`: Request များကို လက်ခံပြီး Response ပြန်ပေးသော နေရာ။
  - `app/Models/`: Database Tables များနှင့် ချိတ်ဆက်ထားသော Eloquent Models များ။
  - `app/Http/Middleware/`: လုံခြုံရေး ကြားဖြတ်စစ်ဆေးပေးသည့် Filter များ။

---

### ၃.၂။ `config/` Directory (Centralized System Config)
* **ဒါက ဘာလဲ**: Database ချိတ်ဆက်မှု၊ Mail server၊ Cache drivers၊ Authentication guards စသည့် System Configurations အားလုံး စုစည်းရာနေရာ ဖြစ်သည်။
* **အားသာချက်**: Config တန်ဖိုးများကို ကုဒ်များထဲတွင် Hardcode မရေးဘဲ ဗဟိုမှ တစ်စုတစ်စည်းတည်း စီမံနိုင်ခြင်း။

---

### ၃.၃။ `database/` Directory (Database Management)
* **ဒါက ဘာလဲ**: Database Schema ဇယားများနှင့် စမ်းသပ်ဒေတာများ စီမံရာနေရာ ဖြစ်သည်။
* **အစိတ်အပိုင်းများ**:
  - `database/migrations/`: Table များကို Version Control ဖြင့် တည်ဆောက်သော ဖိုင်များ။
  - `database/seeders/`: အစမ်းဒေတာ သွင်းပေးသောဖိုင်များ။
  - `database/factories/`: Faker ဒေတာ ထုတ်ပေးသောဖိုင်များ။

---

### ၃.၄။ `public/` Directory (Web Root)
* **ဒါက ဘာလဲ**: Web Server (Nginx/Apache) နှင့် တိုက်ရိုက်ထိတွေ့သော တစ်ခုတည်းသော Folder ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: `.env` နှင့် Core ကုဒ်များကို ပြင်ပမှ တိုက်ရိုက် မလှမ်းနိုင်စေရန် လုံခြုံရေးအရ `public/` ကိုသာ ဝင်ပေါက်အဖြစ် ထားခြင်း ဖြစ်သည်။ Compiled CSS/JS, ပုံများနှင့် `index.php` သာ ရှိရမည်။

---

### ၃.၅။ `resources/` Directory (Presentation & Assets)
* **ဒါက ဘာလဲ**: အသုံးပြုသူ မြင်တွေ့ရမည့် Blade HTML Templates များ (`resources/views/`) နှင့် Vite ဖြင့် Compile လုပ်မည့် Raw CSS/JS များ ထားရှိရာနေရာ ဖြစ်သည်။

---

### ၃.၆။ `routes/` Directory (Application Endpoints)
* **ဒါက ဘာလဲ**: Application ၏ URL လမ်းကြောင်းများအားလုံးကို စီမံရာနေရာ ဖြစ်သည်။
* **ခွဲခြားထားပုံ**:
  - `web.php`: Browser UI စာမျက်နှာများအတွက် (Session, CSRF ပါဝင်သည်)။
  - `api.php`: Mobile/React API များအတွက် (Stateless, Token-based)။
  - `console.php`: Artisan CLI commands နှင့် Task Scheduling များအတွက်။

---

### ၃.၇။ `storage/` Directory (Logs & Uploaded Media)
* **ဒါက ဘာလဲ**: အသုံးပြုသူ တင်လိုက်သော ပုံများ၊ Compiled Blade Templates များနှင့် Error Log များ သိမ်းဆည်းရာ နေရာ ဖြစ်သည်။
* **အားသာချက်**: `storage/logs/laravel.log` တွင် စနစ်အတွင်း ဖြစ်ပွားသမျှ Error များကို အသေးစိတ် ခြေရာခံနိုင်သည်။

---

## ၄။ Environment Configuration (`.env`) ဖိုင်

### (က) ဒါက ဘာလဲ? (What is it?)
Server တစ်ခုချင်းစီ၏ လျှို့ဝှက်ချက် Settings များ (Database Passwords, App Key, AWS Credentials) ကို သီးသန့် သိမ်းဆည်းသော Configuration ဖိုင် ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ?
Developers အချင်းချင်း Local စက်တွင် သုံးသော Database Password နှင့် Live Production Server တွင် သုံးသော Password မတူညီပါ။ ကုဒ်ထဲတွင် Password ကို Hardcode ရေးလိုက်ပါက GitHub သို့ ရောက်သွားပြီး အလွန်အန္တရာယ် ကြီးမားသည်။

### (ဂ) အားသာချက်များ:
* **Security**: Git repository ထဲသို့ `.env` ဖိုင်ကို commit လုံးဝ မထည့်သဖြင့် လျှို့ဝှက်ချက်များ လုံခြုံသည်။
* **Environment Switching**: Local, Staging, Production အပြောင်းအလဲများကို `.env` တစ်ခုတည်းဖြင့် လွယ်ကူစွာ လုပ်ဆောင်နိုင်သည်။

```ini
APP_NAME="Myanmar E-Commerce"
APP_ENV=local
APP_KEY=base64:3k7zW...
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_app_db
DB_USERNAME=root
DB_PASSWORD=secret
```

---

## ၅။ လုပ်ငန်းခွင်သုံး အသုံးအများဆုံး Artisan Commands စာရင်း

| Command | ဘာကြောင့် သုံးရသလဲ (Why use it) | ရရှိမည့် အကျိုးကျေးဇူး (Advantage) |
| :--- | :--- | :--- |
| `php artisan serve` | Local Development Web Server စတင်ရန် | Apache/Nginx မလိုဘဲ ချက်ချင်း စမ်းသပ်နိုင်သည် |
| `php artisan make:controller [Name]` | Controller ဖိုင် အသစ် ဆောက်ရန် | Namespace နှင့် Class တိကျစွာ အသင့်ထွက်လာသည် |
| `php artisan make:model [Name] -m` | Model နှင့် Migration ပြိုင်တူ ဆောက်ရန် | အချိန်ကုန်သက်သာပြီး ချိတ်ဆက်ပြီးသား ရရှိသည် |
| `php artisan migrate` | ရေးထားသော DB Schema များကို Database သို့ ထည့်ရန် | GUI ထဲ လက်ဖြင့် Table ဆောက်စရာမလိုတော့ပါ |
| `php artisan route:list` | Application တွင် ရှိသမျှ URL အားလုံး စစ်ဆေးရန် | Routes ပျောက်ဆုံးခြင်း/မှားယွင်းခြင်း ရှာဖွေနိုင်သည် |
| `php artisan tinker` | Terminal ပေါ်တွင် Laravel Code စမ်းသပ် Run ရန် | စမ်းသပ်ရန် Controller ရေးစရာမလိုဘဲ တိုက်ရိုက် စမ်းနိုင်သည် |
