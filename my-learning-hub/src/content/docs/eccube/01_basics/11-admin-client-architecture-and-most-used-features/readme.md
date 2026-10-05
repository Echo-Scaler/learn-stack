---
title: "Overview"
description: "> EC-CUBE 4.x Admin Side (管理画面), UI Client Side (フロント画面) နှင့် အသုံးအများဆုံး စနစ်များ လမ်းညွှန်"
---

## Module 11: Admin & Client Side Architecture and Most Used Features in EC-CUBE

> **EC-CUBE 4.x Admin Side (管理画面), UI Client Side (フロント画面) နှင့် အသုံးအများဆုံး စနစ်များ လမ်းညွှန်**

---

## 📚 ဤ Module တွင် ပါဝင်သော သင်ခန်းစာများ

### ၁။ [01-admin-and-front-folder-architecture.md](/eccube/01_basics/11-admin-client-architecture-and-most-used-features/01-admin-and-front-folder-architecture/)
- Admin Side (管理画面) နှင့် UI Client Side (フロント画面) ၏ Folder Structure ကွာခြားချက်များနှင့် တည်ဆောက်ပုံ စံနှုန်းများ။
- Admin Controller vs Front Controller
- Admin Form vs Front Form
- Admin Template (`app/template/admin/`) vs Front Template (`app/template/default/`)
- Admin Navigation Menu (`eccube_nav.yaml`) ချိတ်ဆက်ပုံ။
- Shared Logic Layers (Entity, Repository, Service) ကို နှစ်ဖက်စလုံးက ပြန်လည်အသုံးပြုပုံ။

### ၂။ [02-most-used-features-in-ec-cube.md](/eccube/01_basics/11-admin-client-architecture-and-most-used-features/02-most-used-features-in-ec-cube/)
- ဂျပန် E-Commerce ပရောဂျက်များတွင် အသုံးအများဆုံး EC-CUBE Features (၇) မျိုး လက်တွေ့ လမ်းညွှန်-
  1. **EventSubscriber (အသုံးအများဆုံး နံပါတ် ၁)**: Hook Points, TemplateEvent Snippet Injection, Order Completion Notification.
  2. **Form Extension**: Core Form များတွင် Field အသစ် ထည့်သွင်းခြင်း။
  3. **Entity Extension**: Trait ဖြင့် Core Tables များတွင် Column အသစ် ထည့်သွင်းခြင်း။
  4. **PurchaseFlow Processor**: လျှော့စျေးနှင့် အော်ဒါတွက်ချက်မှု စည်းမျဉ်းများ။
  5. **Query Customizer**: Core Search Query များကို မပြင်ဘဲ Filter အသစ် ထပ်တိုးခြင်း။
  6. **Console Command (CLI)**: အလိုအလျောက် Batch & Cron Jobs များ။
  7. **Service Decorator**: Core Service logic ကို သန့်ရှင်းစွာ အစားထိုးခြင်း။
