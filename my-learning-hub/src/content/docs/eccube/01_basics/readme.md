---
title: "Overview"
description: "> မြန်မာဘာသာဖြင့် အသေးစိတ် ရေးသားထားသော EC-CUBE 4.x သင်ရိုးညွှန်းတမ်း"
---

## EC-CUBE 4.x အခြေခံမှ စတင်လေ့လာခြင်း သင်ရိုးညွှန်းတမ်း (EC-CUBE Beginner to Advanced Course)

> **မြန်မာဘာသာဖြင့် အသေးစိတ် ရေးသားထားသော EC-CUBE 4.x သင်ရိုးညွှန်းတမ်း**  
> ဂျပန်နိုင်ငံ၏ နံပါတ် (၁) Open Source E-Commerce Platform ဖြစ်သော **EC-CUBE** ကို အခြေခံမှစ၍ လက်တွေ့ Project များတွင် စိတ်ချလက်ချ ရေးသားအသုံးချနိုင်စေရန် ရည်ရွယ်ပါသည်။

---

## 🎯 သင်ရိုး၏ ရည်ရွယ်ချက် (Course Objective)

- EC-CUBE 4.x ၏ အခြေခံသဘောတရားများ၊ Architecture နှင့် Framework (Symfony, Doctrine, Twig) များကို နားလည်စေရန်။
- Local Development Environment (Docker / Manual) ကို အလွယ်တကူ တည်ဆောက်နိုင်စေရန်။
- Admin Panel မှတဆင့် Store Management (ကုန်ပစ္စည်း၊ အော်ဒါ၊ ကာစတန်မာ၊ ပို့ဆောင်မှု၊ ဒီဇိုင်း) များကို ကျွမ်းကျင်စွာ စီမံနိုင်စေရန်။
- Frontend UI / Theme Customization (Twig Template Override, Custom Blocks) ပြုလုပ်နိုင်စေရန်။
- Backend Logic Customization (Custom Controller, Form Type, Event Subscriber, Entity Extension) များကို ရေးသားနိုင်စေရန်။
- ကိုယ်ပိုင် EC-CUBE Plugin တစ်ခုကို အစအဆုံး တည်ဆောက်နိုင်စေရန်။
- ဂျပန် E-Commerce ပရောဂျက်များတွင် အသုံးများသော စကားလုံးများ (Japanese EC Terminology) နှင့် အလေ့အကျင့်ကောင်းများ (Best Practices) ကို သိရှိနားလည်စေရန်။

---

## 📚 သင်ရိုးမာတိကာ (Course Syllabus & Modules)

### [Module 01: Introduction to EC-CUBE](/eccube/01_basics/01-introduction/01-what-is-ec-cube/)
- [01-what-is-ec-cube.md](/eccube/01_basics/01-introduction/01-what-is-ec-cube/) : EC-CUBE ဆိုတာဘာလဲ၊ သမိုင်းကြောင်း၊ ဂျပန်နိုင်ငံ E-Commerce ဈေးကွက်ဝေစု၊ Tech Stack နှင့် System Requirements များ။

### [Module 02: Environment Setup & Installation](./02-environment-setup/)
- [01-docker-setup.md](/eccube/01_basics/02-environment-setup/01-docker-setup/) : Docker & Docker-Compose ဖြင့် Local Development Environment တည်ဆောက်နည်း။
- [02-manual-installation.md](/eccube/01_basics/02-environment-setup/02-manual-installation/) : Composer နှင့် Web Installer အသုံးပြု၍ Install ပြုလုပ်နည်း။
- [03-directory-structure-and-cli.md](/eccube/01_basics/02-environment-setup/03-directory-structure-and-cli/) : Directory Structure ရှင်းလင်းချက်နှင့် အသုံးဝင်သော `bin/console` CLI Commands များ။

### [Module 03: Admin Panel & Store Management](./03-admin-and-store-management/)
- [01-admin-overview-and-products.md](/eccube/01_basics/03-admin-and-store-management/01-admin-overview-and-products/) : ကုန်ပစ္စည်းစီမံခန့်ခွဲမှု (Product Master, Category, Tag, 規格/Product Classes, Inventory)။
- [02-order-and-customer-management.md](/eccube/01_basics/03-admin-and-store-management/02-order-and-customer-management/) : အော်ဒါစီမံခန့်ခွဲမှု (Order Status Workflow, 受注管理) နှင့် Customer Management (会員管理)။
- [03-layout-and-pages.md](/eccube/01_basics/03-admin-and-store-management/03-layout-and-pages/) : Design Management (Layout Editor, Block, Static & Dynamic Page ဖန်တီးခြင်း)။

### [Module 04: Architecture & Core Concepts](./04-architecture-and-core-concepts/)
- [01-symfony-and-routing.md](/eccube/01_basics/04-architecture-and-core-concepts/01-symfony-and-routing/) : Symfony Framework Architecture, Routing, Controllers နှင့် Dependency Injection။
- [02-doctrine-orm-and-entities.md](/eccube/01_basics/04-architecture-and-core-concepts/02-doctrine-orm-and-entities/) : Doctrine ORM, Entity Mapping, Repository, QueryBuilder နှင့် Migrations။
- [03-twig-template-engine.md](/eccube/01_basics/04-architecture-and-core-concepts/03-twig-template-engine/) : Twig Template Engine (Inheritance, Filters, Form Rendering)။

### [Module 05: Frontend Customization](./05-frontend-customization/)
- [01-theme-and-template-override.md](/eccube/01_basics/05-frontend-customization/01-theme-and-template-override/) : Twig Template Override ပြုလုပ်နည်း (Default Template vs Customize Template)။
- [02-custom-blocks-and-assets.md](/eccube/01_basics/05-frontend-customization/02-custom-blocks-and-assets/) : Custom Block အသစ်များ တည်ဆောက်ခြင်းနှင့် CSS, JavaScript, Image Asset များ စီမံခန့်ခွဲခြင်း။

### [Module 06: Backend Customization](./06-backend-customization/)
- [01-custom-controllers-and-forms.md](/eccube/01_basics/06-backend-customization/01-custom-controllers-and-forms/) : Custom Controller အသစ်၊ Form Type နှင့် Validation စည်းမျဉ်းများ ရေးသားခြင်း။
- [02-event-subscribers-hookpoints.md](/eccube/01_basics/06-backend-customization/02-event-subscribers-hookpoints/) : EC-CUBE Event System, Event Subscriber နှင့် Hook Points အသုံးပြုပုံ။
- [03-entity-extension-customize.md](/eccube/01_basics/06-backend-customization/03-entity-extension-customize/) : Entity Extension (Trait အသုံးပြု၍ Column အသစ်ထည့်ခြင်း) နှင့် Migration ဖန်တီး Run ခြင်း။
- [⭐ Custom Feature & Core Override Architecture Guide](/eccube/01_basics/11-admin-client-architecture-and-most-used-features/custom-feature-and-core-override-architecture-guide/) : **Feature သစ်ဖန်တီးခြင်းနှင့် Core Override ပြုလုပ်ခြင်းဆိုင်ရာ Folder Structure စံသတ်မှတ်ချက် Master Guide** (Entity, Repository, Service, Controller, Form Extension, Decorator ခွဲခြားသတ်မှတ်ပုံများ)။


### [Module 07: Plugin Development](./07-plugin-development/)
- [01-plugin-basics-and-structure.md](/eccube/01_basics/07-plugin-development/01-plugin-basics-and-structure/) : Plugin ၏ အခြေခံသဘောတရား၊ Directory Structure နှင့် Plugin Lifecycle။
- [02-hands-on-banner-plugin.md](/eccube/01_basics/07-plugin-development/02-hands-on-banner-plugin/) : လက်တွေ့ Top Announcement Banner Plugin တစ်ခု အစအဆုံး ရေးသားခြင်း (Admin Config Form + Frontend Display)။

### [Module 08: Payment, Shipping & Mail](./08-payment-shipping-and-mail/)
- [01-payment-shipping-mail-setup.md](/eccube/01_basics/08-payment-shipping-and-mail/01-payment-shipping-mail-setup/) : Payment Gateways (Stripe, GMO, COD), ပို့ဆောင်ခ တွက်ချက်မှု Customization နှင့် Order Notification Email များ ပြင်ဆင်ခြင်း။

### [Module 09: Debugging & Troubleshooting](./09-debugging-and-troubleshooting/)
- [01-debug-cache-logs-common-errors.md](/eccube/01_basics/09-debugging-and-troubleshooting/01-debug-cache-logs-common-errors/) : Debug Mode (Symfony Profiler), Cache စီမံခန့်ခွဲမှု၊ Logs ဖတ်ရှုနည်းနှင့် အဖြစ်များသော Error (၁၀) မျိုးကို ဖြေရှင်းနည်းများ။

### [Module 10: Best Practices & Japanese Terms](./10-best-practices-and-japanese-terms/)
- [01-japanese-ec-terms-and-best-practices.md](/eccube/01_basics/10-best-practices-and-japanese-terms/01-japanese-ec-terms-and-best-practices/) : ဂျပန် E-Commerce ပရောဂျက်များတွင် မဖြစ်မနေသိထားရမည့် စကားလုံးပေါင်း ၁၀၀ ကျော် (Glossary) နှင့် EC-CUBE Development Best Practices (Do's and Don'ts)။

### [Module 11: Admin & Client Side Architecture and Most Used Features](./11-admin-client-architecture-and-most-used-features/)
- [01-admin-and-front-folder-architecture.md](/eccube/01_basics/11-admin-client-architecture-and-most-used-features/01-admin-and-front-folder-architecture/) : Admin Side (管理画面) နှင့် UI Client Side (フロント画面) Folder တည်ဆောက်ပုံ စံနှုန်းများ၊ Routing၊ Form နှင့် Twig Layout နှိုင်းယှဉ်ချက်။
- [02-most-used-features-in-ec-cube.md](/eccube/01_basics/11-admin-client-architecture-and-most-used-features/02-most-used-features-in-ec-cube/) : EC-CUBE တွင် အသုံးအများဆုံး စနစ်များ (EventSubscriber, TemplateEvent Snippets, Form/Entity Extensions, PurchaseFlow, QueryCustomizer, Console Commands, Service Decorators)။


---

## 🛠️ လိုအပ်သော နည်းပညာအခြေခံများ (Prerequisites)

ဤသင်ရိုးကို မစတင်မီ အောက်ပါအခြေခံများ ရှိထားပါက ပိုမိုလွယ်ကူစွာ နားလည်နိုင်ပါမည်-
1. **PHP အခြေခံ (OOP - Object-Oriented Programming, Namespaces, Traits)**
2. **HTML / CSS / JavaScript အခြေခံ**
3. **Relational Database အခြေခံ (MySQL / PostgreSQL, SQL queries)**
4. **Git Version Control အခြေခံ**
5. **Docker / Command Line အခြေခံ (အကြမ်းဖျင်း)**

---

## 🚀 စတင်လေ့လာရန် လမ်းညွှန် (Getting Started)

ပထမဆုံးအနေဖြင့် [Module 01: Introduction to EC-CUBE](/eccube/01_basics/01-introduction/01-what-is-ec-cube/) မှ စတင်ဖတ်ရှုပြီးနောက် [Module 02: Environment Setup](/eccube/01_basics/02-environment-setup/01-docker-setup/) အတိုင်း Local စက်တွင် EC-CUBE ကို Setup ပြုလုပ်ကာ လက်တွေ့ လိုက်ပါ စမ်းသပ်ရေးသားသွားရန် အကြံပြုအပ်ပါသည်။
