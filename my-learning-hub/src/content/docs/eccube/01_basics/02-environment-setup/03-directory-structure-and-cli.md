---
title: "03. Directory Structure And Cli"
description: "EC-CUBE 4.x တွင် Source Code များ မည်သည့်နေရာတွင် ရှိသည်၊ မည်သည့်နေရာတွင် Custom Code များ ရေးသားရမည်၊ မည်သည့်နေရာကို လုံးဝ မပြင်ရ (Never Modify) စသည်တို့ကို သေ"
---

## Module 02 - အခန်း ၃: Directory Structure နှင့် အသုံးဝင်သော CLI Commands များ

EC-CUBE 4.x တွင် Source Code များ မည်သည့်နေရာတွင် ရှိသည်၊ မည်သည့်နေရာတွင် Custom Code များ ရေးသားရမည်၊ မည်သည့်နေရာကို လုံးဝ မပြင်ရ (Never Modify) စသည်တို့ကို သေချာစွာ နားလည်ထားရန် အလွန်အရေးကြီးပါသည်။

---

## ၁။ Directory Structure ရှင်းလင်းချက် (Folder Hierarchy)

EC-CUBE 4.x ၏ အဓိက Folder ဖွဲ့စည်းပုံမှာ အောက်ပါအတိုင်း ဖြစ်ပါသည်-

```text
ec-cube/
├── app/                                 # ★ Developer များ Custom Code နှင့် Config ရေးသားရမည့်နေရာ
│   ├── config/eccube/                   # YAML Config ဖိုင်များ (services.yaml, packages, bundles.php)
│   ├── Customize/                       # ★ အဓိက Customization Code များ ရေးသားသည့် Folder
│   │   ├── Controller/                  # မိမိတို့ ကိုယ်ပိုင် Controller များ
│   │   ├── Entity/                      # Entity အသစ်များနှင့် Entity Extension (Trait) များ
│   │   ├── Form/Type/                   # Custom Form Type များ
│   │   ├── Repository/                  # Database Query Logic Repository များ
│   │   ├── Service/                     # Business Logic Service Classes များ
│   │   └── EventSubscriber/             # Hook Points / Event Listeners များ
│   ├── Plugin/                          # Install လုပ်ထားသော Plugin များ တည်ရှိသည့်နေရာ
│   └── template/                        # ★ Twig Template Override ပြုလုပ်သည့်နေရာ
│       ├── default/                     # Storefront (User မျက်နှာစာ) Twig ဖိုင်များ
│       └── admin/                       # Admin Panel Twig ဖိုင်များ
│
├── bin/                                 # Console Executables
│   └── console                          # Symfony / EC-CUBE CLI Script
│
├── html/                                # Public Web Root (Web Server က အပြင်သို့ ဖွင့်ပြသော Folder)
│   ├── index.php                        # Main Entry Point (Front Controller)
│   ├── install.php                      # Web Installer (Setup ပြီးပါက ဖျက်ပစ်ရသည်)
│   ├── template/default/assets/         # Public Static Assets (CSS, JS, Fonts, Images)
│   └── upload/                          # User များ Upload တင်ထားသော ကုန်ပစ္စည်းပုံများ
│
├── src/Eccube/                          # ⛔ EC-CUBE Core Code များ (ဒီ Folder ထဲကို ဘယ်တော့မှ မပြင်ရပါ)
│   ├── Controller/                      # Core Controllers
│   ├── Entity/                          # Core Database Entities (Product, Order, Customer, etc.)
│   ├── Repository/                      # Core Repositories
│   ├── Service/                         # Core Services (CartService, OrderHelper, MailService)
│   ├── Form/                            # Core Form Types
│   ├── Resource/template/               # Core Twig Templates (default/ နှင့် admin/)
│   └── Event/                           # Core Event definitions
│
├── var/                                 # Temporary Runtime Data
│   ├── cache/                           # Compiled Twig, Container Cache, Doctrine Proxy
│   └── log/                             # Application Log ဖိုင်များ (prod.log, dev.log)
│
├── vendor/                              # Composer မှတစ်ဆင့် Download လုပ်ထားသော Libraries များ
├── .env                                 # Environment Variables Configuration
└── composer.json                        # Composer Dependencies Configuration
```

---

## ၂။ ရွှေစည်းမျဉ်း (Golden Rule of EC-CUBE Development)

> 🚨 **အထူးသတိပြုရန် (CRITICAL)**:  
> **`src/Eccube/` Folder ထဲရှိ မည်သည့် Core File ကိုမှ တိုက်ရိုက် မပြင်ပါနှင့် (Never Modify Core Directly!)**  
> 
> Core File များကို တိုက်ရိုက်ပြင်ဆင်ပါက:
> 1. နောက်နောင် EC-CUBE Core Version အသစ်သို့ Update ပြုလုပ်သည့်အခါ မိမိပြင်ထားသော Code များ ပျက်စီးပျောက်ဆုံးသွားမည်။
> 2. Plugin များနှင့် Conflict ဖြစ်ပြီး Error တက်မည်။
>
> 💡 **မှန်ကန်သော နည်းလမ်း**:
> - Logic အသစ် သို့မဟုတ် ပြင်ဆင်လိုသော Logic များကို **`app/Customize/`** အောက်တွင် ရေးသားပါ။
> - Design / UI ပြင်ဆင်လိုပါက **`app/template/`** အောက်တွင် Override ပြုလုပ်ပါ။
> - သီးသန့် Feature အဖြစ် ခွဲထုတ်လိုပါက **Plugin** အဖြစ် ရေးသားပါ။

---

## ၃။ အသုံးဝင်သော `bin/console` CLI Commands များ

EC-CUBE တွင် Terminal မှတစ်ဆင့် အလုပ်လုပ်နိုင်ရန် `bin/console` command များစွာ ပါဝင်ပါသည်။

### က။ Cache စီမံခန့်ခွဲမှု (Cache Management)
Code အသစ်ရေးသားခြင်း၊ Config ပြောင်းလဲခြင်း သို့မဟုတ် Template ပြင်ဆင်ပြီးနောက် အပြောင်းအလဲများ ချက်ချင်း မပေါ်ပါက Cache ကို ရှင်းပေးရပါမည်-

```bash
# Cache များကို လုံးဝရှင်းထုတ်ခြင်း (Developer များ နေ့စဉ်သုံးရသော Command)
bin/console cache:clear --no-warmup

# Cache ကို ရှင်းထုတ်ပြီး ပြန်လည် Warmup ပြုလုပ်ခြင်း
bin/console cache:clear
```

### ခ။ Database & Doctrine ORM Commands
Database Schema များကို စစ်ဆေးခြင်း၊ Update လုပ်ခြင်းနှင့် Migrations ပြုလုပ်ခြင်း-

```bash
# လက်ရှိ Entity များနှင့် Database Table ကွာခြားချက် SQL များကို ကြည့်ရှုခြင်း
bin/console doctrine:schema:update --dump-sql

# Database Schema ကို တိုက်ရိုက် Update ပြုလုပ်ခြင်း (Development တွင်သာ သုံးသင့်)
bin/console doctrine:schema:update --force

# Migration File အသစ် ဖန်တီးခြင်း
bin/console doctrine:migrations:generate

# Migration ဖိုင်များကို Run ၍ Database သို့ Apply လုပ်ခြင်း
bin/console doctrine:migrations:migrate
```

### ဂ။ EC-CUBE သီးသန့် Plugin Commands
Command Line မှတဆင့် Plugin များကို စီမံခန့်ခွဲခြင်း-

```bash
# Plugin အသစ် Generate လုပ်ခြင်း (Plugin Skeleton ဖန်တီးရန်)
bin/console eccube:plugin:generate

# Plugin တစ်ခုကို Install ပြုလုပ်ခြင်း
bin/console eccube:plugin:install --code=PluginCodeName

# Plugin ကို Enable (ဖွင့်) ခြင်း
bin/console eccube:plugin:enable --code=PluginCodeName

# Plugin ကို Disable (ပိတ်) ခြင်း
bin/console eccube:plugin:disable --code=PluginCodeName

# Plugin ကို လုံးဝ Uninstall ပြုလုပ်ခြင်း
bin/console eccube:plugin:uninstall --code=PluginCodeName
```

### ဃ။ Routing & Debugging Commands
Route များနှင့် Services များကို စစ်ဆေးခြင်း-

```bash
# စနစ်တစ်ခုလုံးရှိ Route URL များအားလုံးကို စာရင်းကြည့်ခြင်း
bin/console debug:router

# သီးသန့် Route တစ်ခု၏ အသေးစိတ် အချက်အလက်ကို ကြည့်ခြင်း
bin/console debug:router product_list

# Service Container တွင် ရရှိနိုင်သော Service များကို စစ်ဆေးခြင်း
bin/console debug:autowiring
```

---

နောက်အခန်းတွင် **[Module 03: Admin Panel နှင့် Store Management စီမံခန့်ခွဲမှု](/eccube/01_basics/03-admin-and-store-management/01-admin-overview-and-products/)** ကို စတင်လေ့လာပါမည်။
