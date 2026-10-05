---
title: "01. Admin And Front Folder Architecture"
description: "> EC-CUBE 4.x Admin Side (管理画面) vs UI Client Side (フロント画面) Architecture Guide"
---

## Module 11 - အခန်း ၁: Admin Side နှင့် UI Client Side Folder Structure တည်ဆောက်ပုံ စံနှုန်းများ

> **EC-CUBE 4.x Admin Side (管理画面) vs UI Client Side (フロント画面) Architecture Guide**  
> EC-CUBE တွင် Feature တစ်ခုကို တည်ဆောက်သည့်အခါ ဆိုင်ဝန်ထမ်း/မန်နေဂျာများ အသုံးပြုသော **Admin Side (Backoffice)** နှင့် ဝယ်ယူသူ ကာစတန်မာများ အသုံးပြုသော **UI Client Side (Front / Storefront)** ဟူ၍ မျက်နှာစာ (၂) ခု ကွဲပြားပါသည်။ ဤအခန်းတွင် Admin နှင့် Front နှစ်ဖက်စလုံးအတွက် Folder များကို မည်သို့ မှန်ကန်စွာ ဖွဲ့စည်းတည်ဆောက်ရမည်ကို မြန်မာဘာသာဖြင့် အသေးစိတ် ရှင်းလင်းထားပါသည်။

---

## ၁။ အခြေခံ သဘောတရား (Architecture Concept: Admin vs Front)

EC-CUBE ၏ စနစ်တစ်ခုလုံးတွင် Controller၊ Form နှင့် Template (View) တို့သည် Admin နှင့် Front အတွက် သီးခြားစီ ကွဲပြားကြသော်လည်း **Database (Entity/Repository)** နှင့် **Business Logic (Service)** တို့သည် နှစ်ဖက်စလုံးက အတူတကွ မျှဝေအသုံးပြုကြသော **Shared Core Layer** ဖြစ်သည်။

```text
┌────────────────────────────────────────────────────────┐
│                   EC-CUBE APPLICATION                  │
├──────────────────────────┬─────────────────────────────┤
│  🖥️ ADMIN SIDE (管理画面) │  📱 UI CLIENT SIDE (フロント) │
├──────────────────────────┼─────────────────────────────┤
│ • Admin Controllers      │ • Front Controllers         │
│   (Route: /%admin%/...)  │   (Route: /...)             │
│ • Admin Forms & Filters  │ • Front Forms & Inputs      │
│ • Admin Twig Templates   │ • Front Twig Templates      │
│   (app/template/admin/)  │   (app/template/default/)   │
├──────────────────────────┴─────────────────────────────┤
│             🔄 SHARED BACKEND LOGIC LAYER              │
├────────────────────────────────────────────────────────┤
│ • Entity (Shared Database Tables & Trait Extensions)   │
│ • Repository (Shared Queries & Data Retrieval)         │
│ • Service (Shared Business Logic & Calculations)       │
│ • EventSubscriber (Lifecycle Hooks & Interceptors)     │
└────────────────────────────────────────────────────────┘
```

---

## ၂။ Admin Side နှင့် Client Side အတွက် Folder Structure နှိုင်းယှဉ်ချက်

အောက်ပါဇယားသည် Admin Side နှင့် Client Side အတွက် ရေးသားရမည့် Folder တည်နေရာများကို တိကျစွာ နှိုင်းယှဉ်ဖော်ပြထားခြင်း ဖြစ်ပါသည်-

| Component အမျိုးအစား | Admin Side (管理画面) တည်နေရာ | UI Client Side (フロント画面) တည်နေရာ |
| :--- | :--- | :--- |
| **Controller** | `app/Customize/Controller/Admin/` | `app/Customize/Controller/` (သို့) `Controller/Front/` |
| **Form Type (အသစ်)** | `app/Customize/Form/Type/Admin/` | `app/Customize/Form/Type/Front/` (သို့) `Form/Type/` |
| **Form Extension (Core Form ထဲ Field တိုးခြင်း)** | `app/Customize/Form/Extension/Admin/` | `app/Customize/Form/Extension/Front/` |
| **Twig Template (UI View)** | `app/template/admin/` | `app/template/default/` |
| **Static Assets (CSS / JS)** | `html/template/admin/assets/` | `html/template/default/assets/` |
| **Entity & Repository** | `app/Customize/Entity/` (Shared) | `app/Customize/Entity/` (Shared) |
| **Business Service** | `app/Customize/Service/` (Shared) | `app/Customize/Service/` (Shared) |

---

## ၃။ အသေးစိတ် Folder တည်ဆောက်ပုံ စံနှုန်း (Full Directory Layout)

Feature တစ်ခုလုံးကို Admin တွင် စီမံခန့်ခွဲနိုင်ပြီး Front တွင် ပြသနိုင်ရန်အတွက် စံပြ Directory Structure မှာ အောက်ပါအတိုင်း ဖြစ်သည်-

```text
ec-cube/
├── app/
│   ├── config/eccube/packages/
│   │   └── eccube_nav.yaml              # ★ Admin ဘေးဘား Menu တွင် Link အသစ် ထည့်သွင်းခြင်း
│   │
│   ├── Customize/
│   │   ├── Controller/
│   │   │   ├── Admin/                   # 🖥️ Admin Controller များ (Backoffice Logic)
│   │   │   │   ├── BannerController.php # Admin: Banner များ စာရင်းကြည့်၊ အသစ်ထည့်၊ ပြင်၊ ဖျက်
│   │   │   │   └── OrderCustomController.php
│   │   │   │
│   │   │   └── Front/                   # 📱 UI Client Controller များ (Public Endpoints)
│   │   │       ├── BannerDisplayController.php
│   │   │       └── InquiryController.php
│   │   │
│   │   ├── Entity/                      # 🗄️ Shared Database Entities (Admin ရော Front ရော သုံးသည်)
│   │   │   ├── Banner.php
│   │   │   └── CustomerTrait.php
│   │   │
│   │   ├── Repository/                  # 🔍 Shared Database Queries
│   │   │   └── BannerRepository.php
│   │   │
│   │   ├── Service/                     # ⚙️ Shared Business Logic
│   │   │   └── BannerService.php
│   │   │
│   │   ├── Form/
│   │   │   ├── Type/
│   │   │   │   ├── Admin/               # 📝 Admin အတွက် သီးသန့် Form Types
│   │   │   │   │   └── BannerType.php
│   │   │   │   └── Front/               # 📝 Front အတွက် သီးသန့် Form Types
│   │   │   │       └── InquiryType.php
│   │   │   │
│   │   │   └── Extension/
│   │   │       ├── Admin/               # ➕ Admin Core Form များတွင် Field တိုးခြင်း
│   │   │       │   └── OrderTypeExtension.php
│   │   │       └── Front/               # ➕ Front Core Form များတွင် Field တိုးခြင်း
│   │   │           └── EntryTypeExtension.php
│   │   │
│   │   └── EventSubscriber/             # 🪝 System Hooks (Admin ရော Front ရော သုံးနိုင်သည်)
│   │       ├── AdminNavSubscriber.php
│   │       └── FrontShoppingSubscriber.php
│   │
│   └── template/
│       ├── admin/                       # 🎨 Admin Twig Templates (Admin Panel UI)
│       │   └── Banner/
│       │       ├── index.twig           # Banner စာရင်း Table View
│       │       └── edit.twig            # Banner အသစ်ထည့်/ပြင်ဆင်သည့် Form View
│       │
│       └── default/                     # 🎨 Client Storefront Twig Templates (User UI)
│           ├── Block/
│           │   └── top_banner.twig      # Homepage ပေါ်တွင် ပြသမည့် Banner Block
│           └── Entry/
│               └── index.twig           # Client Member Registration Override
```

---

## ၄။ Admin Side တည်ဆောက်ခြင်းဆိုင်ရာ စံနှုန်းများနှင့် အရေးကြီးသော အချက်များ

### က။ Admin Controller ရေးသားပုံ စံနှုန်း
Admin Controller များသည် Route တွင် Admin Prefix (`%eccube_admin_route%`) ကို မဖြစ်မနေ သုံးရပါမည်။ ဤသို့ သုံးမှသာ Admin Firewall နှင့် Authentication Security အကာအကွယ် ရရှိမည် ဖြစ်သည်။

```php
<?php

namespace Customize\Controller\Admin;

use Eccube\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Routing\Annotation\Route;

class BannerController extends AbstractController
{
    /**
     * @Route("/%eccube_admin_route%/banner", name="admin_banner_list")
     * @Template("@admin/Banner/index.twig")
     */
    public function index()
    {
        // Admin များသာ ဝင်ရောက်နိုင်သော Page
        return [];
    }
}
```

### ခ။ Admin Navigation Menu (ဘေးဘား မီနူး) ချိတ်ဆက်ပုံ
Admin Panel ၏ Sidebar Menu တွင် မိမိတို့ Custom Page အသစ်ကို ထည့်သွင်းရန် နည်းလမ်း (၂) မျိုး ရှိသည်-

#### နည်းလမ်း (၁): YAML File ဖြင့် သတ်မှတ်ခြင်း (`app/config/eccube/packages/eccube_nav.yaml`)
```yaml
eccube_nav:
    content:                             # Content (コンテンツ管理) အောက်တွင် ပြရန်
        children:
            custom_banner:
                name: 'ဘန်နာ စီမံခန့်ခွဲမှု'
                url: admin_banner_list    # Route Name
```

---

## ၅။ UI Client Side (Front) တည်ဆောက်ခြင်းဆိုင်ရာ စံနှုန်းများ

### က။ Front Controller ရေးသားပုံ စံနှုန်း
Front Controller များသည် အများပြည်သူ (Public) သို့မဟုတ် Login ဝင်ထားသော Member များ ကြည့်ရှုမည့် Endpoint ဖြစ်သောကြောင့် Route တွင် `%eccube_admin_route%` မပါဝင်ရပါ။

```php
<?php

namespace Customize\Controller\Front;

use Eccube\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Routing\Annotation\Route;

class InquiryController extends AbstractController
{
    /**
     * @Route("/inquiry", name="front_inquiry")
     * @Template("Inquiry/index.twig")
     */
    public function index()
    {
        return [];
    }
}
```

### ခ။ Front Twig Template Structure စံနှုန်း
- Template များသည် `app/template/default/` အောက်တွင် တည်ရှိရမည်။
- Header, Footer, Side Menu စသည့် Framework Layout များကို အသုံးပြုရန် `{% extends 'default_frame.twig' %}` ကို Inherit ပြုလုပ်ရသည်။

```twig
{% extends 'default_frame.twig' %}

{% block main %}
<div class="ec-layoutRole__main">
    <div class="ec-pageHeader">
        <h1>မေးမြန်းရန်ပုံစံ (Inquiry)</h1>
    </div>
    {# UI Contents #}
</div>
{% endblock %}
```

---

## ၆။ အနှစ်ချုပ် တည်ဆောက်မှု စည်းမျဉ်း (Architectural Summary)

1. **Admin နှင့် Front ကို Controller အဆင့်နှင့် Template အဆင့်တွင် ပြတ်သားစွာ ခွဲထုတ်ပါ**:
   - `Controller/Admin/` နှင့် `template/admin/`
   - `Controller/Front/` နှင့် `template/default/`
2. **Database နှင့် Business Logic များကို Shared အဖြစ် တစ်နေရာတည်းတွင် ထားပါ**:
   - `Entity/`, `Repository/`, `Service/` တို့သည် တစ်ခုတည်းသာ ရှိရမည်ဖြစ်ပြီး Admin ရော Front ကပါ အတူတူ ခေါ်ယူသုံးစွဲရမည်။
3. **Form Types များကိုလည်း ရှင်းလင်းစွာ ခွဲထားပါ**:
   - Admin ဘက်တွင် လိုအပ်သော Validation (ဥပမာ - ဝန်ထမ်း မှတ်ချက်၊ ပြင်ဆင်ခွင့် အဆင့်အတန်း) နှင့် Front ဘက်တွင် လိုအပ်သော Validation (ဥပမာ - အများပြည်သူ Captcha၊ Email Confirm) မတူညီသောကြောင့် `Form/Type/Admin/` နှင့် `Form/Type/Front/` ဟူ၍ ခွဲခြားထားခြင်း ဖြစ်သည်။
