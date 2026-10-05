---
title: "01. What Is Ec Cube"
description: "EC-CUBE သည် ဂျပန်နိုင်ငံတွင် အသုံးအများဆုံး နံပါတ် (၁) Open Source E-Commerce CMS (Content Management System) ဖြစ်ပါသည်။ ၂၀၀၆ ခုနှစ်တွင် စတင် မိတ်ဆက်ခဲ့ပြီး ယခု"
---

## Module 01: EC-CUBE မိတ်ဆက်နှင့် အခြေခံသဘောတရားများ

## ၁။ EC-CUBE ဆိုတာဘာလဲ (What is EC-CUBE?)

**EC-CUBE** သည် ဂျပန်နိုင်ငံတွင် အသုံးအများဆုံး နံပါတ် (၁) **Open Source E-Commerce CMS (Content Management System)** ဖြစ်ပါသည်။ ၂၀၀၆ ခုနှစ်တွင် စတင် မိတ်ဆက်ခဲ့ပြီး ယခုအခါ ဂျပန်နိုင်ငံရှိ Online Shopping Mall နှင့် E-Commerce Website ပေါင်း ၃၅,၀၀၀ ကျော်တွင် တပ်ဆင်အသုံးပြုလျက်ရှိပါသည်။

EC-CUBE ကို အသုံးပြုခြင်းဖြင့်-
- အွန်လိုင်းစတိုးဆိုင် (E-Commerce Store) တစ်ခုကို လိုအပ်သလို အစအဆုံး Customization ပြုလုပ်တည်ဆောက်နိုင်ခြင်း
- ဂျပန်နိုင်ငံ၏ စီးပွားရေးလုပ်ထုံးလုပ်နည်းများ (Business Practices) နှင့် အလွယ်တကူ ကိုက်ညီမှုရှိခြင်း
- Open Source (GPL / Dual License) ဖြစ်သည့်အတွက် Source Code တစ်ခုလုံးကို လွတ်လပ်စွာ လေ့လာပြင်ဆင်ခွင့် ရရှိခြင်း
စသည့် အကျိုးကျေးဇူးများကို ရရှိစေပါသည်။

```
+------------------------------------------------------------------+
|                           EC-CUBE 4.x                            |
|  (Japan's #1 Open Source E-Commerce Platform Built on Symfony)   |
+------------------------------------------------------------------+
|  Frontend UI (Twig + HTML5 + CSS/Sass + Bootstrap/JS)            |
+------------------------------------------------------------------+
|  Backend Core (Symfony Framework + Doctrine ORM + Composer)      |
+------------------------------------------------------------------+
|  Database Layer (MySQL 8.x / 5.7 or PostgreSQL 10+)              |
+------------------------------------------------------------------+
```

---

## ၂။ ဂျပန်နိုင်ငံတွင် EC-CUBE ကို အဘယ်ကြောင့် အသုံးများသလဲ။

Shopify, WooCommerce သို့မဟုတ် Magento စသည့် ကမ္ဘာကျော် E-Commerce Platform များရှိသော်လည်း ဂျပန်ကုမ္ပဏီများစွာသည် EC-CUBE ကို အောက်ပါအချက်များကြောင့် ရွေးချယ်အသုံးပြုကြပါသည်-

1. **ဂျပန်နိုင်ငံ၏ သီးသန့် ကုန်သွယ်ရေးစနစ်များနှင့် ကိုက်ညီခြင်း (Japan Localization)**:
   - ဂျပန်လိပ်စာစနစ် (Prefecture 都道府県, Postal Code 〒, Chome/Banchi)
   - ပို့ဆောင်ရေး အချိန်အပိုင်းအခြား ရွေးချယ်မှု (お届け希望日・時間帯指定 - Morning, Afternoon, Evening time slots)
   - အမှတ်ပေးစနစ် (Point System - 1 Point = 1 JPY)
   - ဂျပန်အခွန်စနစ် (Reduced Tax Rate 軽減税率 8% & Standard Tax 10%, Invoice System 適格請求書)
   - အိမ်ရောက်ငွေချေစနစ် (COD - 代金引換 / 代引手数料)
   - Convenience Store Payment (コンビニ決済 - 7-Eleven, Lawson, FamilyMart)

2. **လွတ်လပ်စွာ စိတ်ကြိုက်ပြောင်းလဲနိုင်မှု (High Flexibility & Customizability)**:
   - ကုမ္ပဏီ၏ ကိုယ်ပိုင် ERP, Warehouse Management System (WMS), POS System များနှင့် API ဖြင့် အလွယ်တကူ ချိတ်ဆက်နိုင်ခြင်း။
   - Database Schema မှစ၍ Frontend UI အထိ စိတ်ကြိုက် Modify လုပ်နိုင်ခြင်း။

3. **Vendor Lock-in မရှိခြင်း (No Vendor Lock-in)**:
   - Cloud Platform များကဲ့သို့ Monthly Fee သို့မဟုတ် Transaction Fee ပေးဆောင်ရန်မလိုဘဲ မိမိကိုယ်ပိုင် Server / AWS / GCP ပေါ်တွင် Hosting ပြုလုပ်နိုင်ခြင်း။

4. **EC-CUBE Owners Store (Plugin Marketplace)**:
   - လိုအပ်သော Feature များကို Plugin Store မှတစ်ဆင့် အလွယ်တကူ ဝယ်ယူတပ်ဆင်နိုင်ခြင်း။

---

## ၃။ EC-CUBE ဗားရှင်းများ သမိုင်းကြောင်း (Version Evolution)

| Version | Engine / Framework | ထွက်ရှိသည့်ခုနှစ် | အဓိက အင်္ဂါရပ်များ |
| :--- | :--- | :--- | :--- |
| **EC-CUBE 2.x** | Pure PHP (Smarty) | 2007 | အစောပိုင်းဗားရှင်း၊ ရိုးရှင်းသော်လည်း Spaghetti Code များပြားခြင်း။ |
| **EC-CUBE 3.x** | Silex Microframework | 2015 | Modern PHP စတင်ကျင့်သုံး၊ Silex framework (Symfony micro) အသုံးပြု။ |
| **EC-CUBE 4.0 ~ 4.1** | Symfony 3.4 / 4.4 | 2018 | Symfony Framework အပြည့်အဝပြောင်းလဲ၊ Doctrine ORM, Twig, DI စနစ်များပါဝင်လာ။ |
| **EC-CUBE 4.2** | Symfony 5.4 (PHP 7.4 - 8.1+) | 2022 | PHP 8 Support, Performance တိုးတက်လာခြင်း, Security Fixes။ |
| **EC-CUBE 4.3 (Latest)** | Symfony 6.x / PHP 8.2+ | 2024 | နောက်ဆုံးပေါ် Modern PHP 8.2+ Features များ၊ Type Declarations များနှင့် ခေတ်မီစနစ်များ ပါဝင်လာ။ |

> 💡 **မှတ်ချက်**: ယခုလက်ရှိ ဂျပန် IT Industry တွင် **EC-CUBE 4.x (အထူးသဖြင့် 4.2 နှင့် 4.3)** ကို အဓိကထား အသုံးပြုနေကြပါသည်။ ထို့ကြောင့် ဤ Course တွင် EC-CUBE 4.x ဗားရှင်းကို အခြေခံ၍ သင်ကြားပို့ချသွားပါမည်။

---

## ၄။ နည်းပညာအစုအဝေး (Tech Stack of EC-CUBE 4.x)

EC-CUBE 4.x သည် ခေတ်မီပြီး စံနှုန်းပြည့်မီသော PHP Ecosystem ပေါ်တွင် တည်ဆောက်ထားပါသည်-

```
                       ┌─────────────────────────┐
                       │     EC-CUBE 4.x Core    │
                       └────────────┬────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│   Symfony    │             │   Doctrine   │             │     Twig     │
│  Framework   │             │     ORM      │             │Template Eng. │
│(HTTP, Route, │             │ (Database,   │             │ (Frontend UI │
│ DI, Security)│             │  Repository, │             │  Rendering)  │
│              │             │  Migration)  │             │              │
└──────────────┘             └──────────────┘             └──────────────┘
```

1. **Backend Framework**: [Symfony](https://symfony.com/) (Enterprise-grade PHP framework)
   - HTTP Kernel, Routing, Dependency Injection Container (Service Container), Security & Authentication, EventDispatcher, Form Component.
2. **Database & ORM**: [Doctrine ORM](https://www.doctrine-project.org/)
   - Database Table များကို PHP Object (Entity) အဖြစ် ချိတ်ဆက်စီမံခြင်း။
   - Doctrine Migrations ဖြင့် Database Schema ဗားရှင်းများကို ထိန်းသိမ်းခြင်း။
3. **Template Engine**: [Twig](https://twig.symfony.com/)
   - လုံခြုံစိတ်ချရပြီး သန့်ရှင်းသော Template Engine။ XSS Vulnerability များကို အလိုအလျောက် Escape ပြုလုပ်ပေးခြင်း။
4. **Package Manager**: [Composer](https://getcomposer.org/)
   - PHP Library များနှင့် Plugin များကို Manage ပြုလုပ်ပေးခြင်း။
5. **Database Engine**: **MySQL 8.0 / 5.7** သို့မဟုတ် **PostgreSQL 10+**

---

## ၅။ System Requirements (စနစ်လိုအပ်ချက်များ)

EC-CUBE 4.x ကို Run ရန် အောက်ပါ အခြေခံအချက်များ လိုအပ်ပါသည်-

- **Web Server**: Apache 2.4+ (with `mod_rewrite`) သို့မဟုတ် Nginx 1.18+
- **PHP Version**: PHP 7.4, 8.1 သို့မဟုတ် 8.2+
- **PHP Extensions**:
  - `pdo_mysql` သို့မဟုတ် `pdo_pgsql`
  - `mbstring` (Multi-byte string - ဂျပန်စာလုံးများအတွက် မဖြစ်မနေလိုအပ်)
  - `intl` (Internationalization)
  - `gd` သို့မဟုတ် `imagick` (Image processing)
  - `ctype`, `json`, `xml`, `zip`, `openssl`, `curl`, `fileinfo`
- **Database**:
  - MySQL 5.7+ / 8.0+ (utf8mb4 encoding)
  - သို့မဟုတ် PostgreSQL 10+
- **Memory Limit**: အနည်းဆုံး `memory_limit = 256M` (512M အကြံပြုပါသည်)

---

## ၆။ အကျဉ်းချုပ် (Summary)

- EC-CUBE သည် ဂျပန်ဈေးကွက်အတွက် အထူးသင့်လျော်သော စံချိန်မီ Open Source E-Commerce Platform ဖြစ်သည်။
- ဗားရှင်း 4.x သည် **Symfony Framework + Doctrine ORM + Twig** ကို အသုံးပြုထားသဖြင့် Standard PHP Design Patterns (OOP, MVC, DI, Events) များကို သေသေချာချာ နားလည်ထားရန် လိုအပ်သည်။
- နောက်အခန်း ([Module 02: Environment Setup](/eccube/01_basics/02-environment-setup/01-docker-setup/)) တွင် Docker အသုံးပြု၍ မိမိစက်တွင် EC-CUBE ကို အလွယ်ကူဆုံး စတင် Setup ပြုလုပ်ပုံကို လေ့လာသွားပါမည်။
