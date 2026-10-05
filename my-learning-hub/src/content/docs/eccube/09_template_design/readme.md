---
title: "Overview"
description: "EC-CUBE 4.x (4.2 / 4.3) ၏ Template Architecture, Twig Engine, Layout & Block System, Safe Override Techniques နှင့် Custom Theme Development များကို အစမှအဆုံး လ"
---

## 🛍️ EC-CUBE 4.x Template Development Course for Beginners (မြန်မာဘာသာ)

EC-CUBE 4.x (4.2 / 4.3) ၏ **Template Architecture, Twig Engine, Layout & Block System, Safe Override Techniques** နှင့် **Custom Theme Development** များကို အစမှအဆုံး လက်တွေ့နမူနာများဖြင့် အသေးစိတ် လေ့လာနိုင်စေရန် ပြုစုထားသော ပြီးပြည့်စုံသည့် မြန်မာဘာသာ သင်ရိုးညွှန်းတမ်း ဖြစ်ပါသည်။

---

## 🎯 Course Objectives (သင်တန်းမှ ရရှိမည့် အကျိုးကျေးဇူးများ)

1. **EC-CUBE Template Structure ကို ပိုင်နိုင်စွာ နားလည်ခြင်း**: Default template ဖိုင်တည်ဆောက်ပုံ၊ Asset လမ်းကြောင်းများ၊ Fallback mechanism များကို ရှင်းလင်းစွာ သိရှိစေမည်။
2. **Twig Template Engine ကို လက်တွေ့ အသုံးပြုနိုင်ခြင်း**: Template inheritance (`extends`, `include`, `block`), Twig Filters, EC-CUBE Global Variables များကို ကျွမ်းကျင်စွာ အသုံးချနိုင်စေမည်။
3. **Layout & Block Management ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ခြင်း**: Admin Panel ၏ Layout Management (`レイアウト管理`) မှတစ်ဆင့် Drag & Drop စီမံခြင်းနှင့် Code အဆင့် Block များ ဖန်တီးခြင်းကို တတ်မြောက်စေမည်။
4. **Core Pages (Top, Product, Cart, Checkout, Mypage) များကို စိတ်ကြိုက် Customization လုပ်နိုင်ခြင်း**: E-Commerce စနစ်၏ အဓိက စာမျက်နှာများ၏ Twig logic များကို အသေးစိတ် နားလည်စေမည်။
5. **Safe Customization & Override System ကို လိုက်နာခြင်း**: Core files များကို မထိခိုက်စေဘဲ `app/template/` မှ override ပြုလုပ်နည်းနှင့် Version Upgrade လုပ်သည့်အခါ မပျက်စီးစေရန် ကာကွယ်နည်းများကို ကျင့်သုံးနိုင်မည်။
6. **Commercial-Ready Custom Theme အသစ်တစ်ခုကို ဖန်တီးနိုင်ခြင်း**: `template.yaml` ရေးသားခြင်းမှစတင်၍ Template switcher ဖြင့် ချိတ်ဆက်ပြီး Tar.gz package အဖြစ် ထုတ်လုပ်နိုင်သည်အထိ သင်ယူရမည်။
7. **Japanese E-Commerce UI/UX Standards များကို နားလည်ခြင်း**: ဂျပန် E-Commerce site များ၏ စည်းမျဉ်းများ (特商法表記, 軽減税率 8%/10%, 送料案内, 決済バナー) နှင့် ဂျပန် EC ဝေါဟာရများကို တတ်မြောက်စေမည်။

---

## 🗺️ Course Roadmap & Navigation (သင်ခန်းစာမာတိကာ)

| အခန်း | သင်ခန်းစာခေါင်းစဉ် | ဖိုင်လင့်ခ် (File Link) | ဖော်ပြချက် |
| :--- | :--- | :--- | :--- |
| **Module 00** | Course Overview & Prerequisites | [01-course-introduction.md](/eccube/09_template_design/00-course-overview-and-roadmap/01-course-introduction/) | Template System မိတ်ဆက်၊ လိုအပ်သော အခြေခံဗဟုသုတများ |
| **Module 01** | Template Architecture & Directory Hierarchy | [01-template-directory-hierarchy.md](/eccube/09_template_design/01-template-architecture-and-structure/01-template-directory-hierarchy/) | Core vs App Template ဖိုင်တွဲများ၊ Asset Structure၊ Fallback Rule |
| **Module 02** | Twig Template Engine Essentials | [01-twig-basics-for-eccube.md](/eccube/09_template_design/02-twig-template-engine-essentials/01-twig-basics-for-eccube/) | Twig Syntax, Loops, Conditions, Filters, EC-CUBE Global Variables |
| **Module 03** | Layout & Frame System Deep-Dive | [01-layout-and-frame-architecture.md](/eccube/09_template_design/03-eccube-layout-and-frame-system/01-layout-and-frame-architecture/) | `default_frame.twig`, Layout Slots (#header, #main, #footer), PC/SP Layouts |
| **Module 04** | Page & Block Management | [01-page-management-and-routing.md](/eccube/09_template_design/04-page-and-block-management/01-page-management-and-routing/) | ページ管理, ブロック管理, Custom Block တည်ဆောက်နည်း |
| **Module 05** | Core Pages Deep-Dive: Part 1 | [01-top-and-product-pages.md](/eccube/09_template_design/05-core-pages-deep-dive/01-top-and-product-pages/) | Top Page (Hero Slider, New Arrivals), Product List & Product Detail (規格, Price) |
| **Module 05** | Core Pages Deep-Dive: Part 2 | [02-cart-checkout-mypage.md](/eccube/09_template_design/05-core-pages-deep-dive/02-cart-checkout-mypage/) | Shopping Cart, 4-Step Checkout Flow, Mypage, Member Login/Registration |
| **Module 06** | Styling & Assets Customization | [01-css-js-asset-customization.md](/eccube/09_template_design/06-customizing-styling-and-assets/01-css-js-asset-customization/) | CSS/SCSS Customization, Responsive Design, Swiper Slider, Icons & Fonts |
| **Module 07** | Safe Customization & Override Techniques | [01-template-overrides-and-hooks.md](/eccube/09_template_design/07-safe-customization-and-override-techniques/01-template-overrides-and-hooks/) | `app/template/` Overrides, Twig Event Hooks, Cache Management |
| **Module 08** | Hands-On: Building a Custom Template | [01-hands-on-custom-theme.md](/eccube/09_template_design/08-building-custom-template-from-scratch/01-hands-on-custom-theme/) | Complete Custom Theme Project, `template.yaml`, Packaging & Distribution |
| **Module 09** | Japanese EC UI/UX Standards & CRO | [01-japanese-ec-standards-and-tips.md](/eccube/09_template_design/09-japanese-ec-ui-ux-and-conversion-optimization/01-japanese-ec-standards-and-tips/) | ဂျပန် EC Design စံချိန်စံညွှန်းများ၊ 特商法表記၊ Conversion Rate Optimization |
| **Module 10** | Troubleshooting & Best Practices | [01-debug-and-checklist.md](/eccube/09_template_design/10-troubleshooting-and-best-practices/01-debug-and-checklist/) | Twig Debugging (`dump`), Symfony Profiler, Common Errors, Launch Checklist |

---

## 📖 Japanese EC-CUBE Terminology Glossary (ဂျပန် EC ဝေါဟာရများ)

EC-CUBE Template ရေးသားရာတွင် နေ့စဉ်တွေ့ကြုံရမည့် အရေးပါသော ဂျပန်ဝေါဟာရများ ဖြစ်ပါသည်-

| Japanese (ဂျပန်စာ) | Romaji | English Meaning | မြန်မာလို အဓိပ္ပာယ် |
| :--- | :--- | :--- | :--- |
| **テンプレート** | Tenpurēto | Template | ဝက်ဘ်ဆိုက်၏ ဒီဇိုင်းနှင့် မျက်နှာစာ ပုံစံခွက် |
| **レイアウト管理** | Reiauto Kanri | Layout Management | စာမျက်နှာ အစိတ်အပိုင်းများ၏ နေရာချထားမှု စီမံခန့်ခွဲခြင်း |
| **ページ管理** | Pēji Kanri | Page Management | စာမျက်နှာ အသစ်များ ဖန်တီးခြင်းနှင့် စီမံခြင်း |
| **ブロック管理** | Burokku Kanri | Block Management | Widget/အစိတ်အပိုင်းငယ်များ (Blocks) စီမံခြင်း |
| **規格 (きかく)** | Kikaku | Product Class / Variants | ကုန်ပစ္စည်း၏ အရွယ်အစား (Size), အရောင် (Color) စသည့် ရွေးချယ်စရာများ |
| **本体価格 (ほんたいかかく)** | Hontai Kakaku | Base Price (Excluding Tax) | အခွန်မပါဝင်သော ကုန်ပစ္စည်း အခြေခံဈေးနှုန်း |
| **税込価格 (ぜいこみかかく)** | Zeikomi Kakaku | Price Including Tax | အခွန် (消費税 8% သို့မဟုတ် 10%) ပါဝင်ပြီး ဈေးနှုန်း |
| **カゴに入れる / カートに追加** | Kago ni ireru / Kāto ni tsuika | Add to Cart | ခြင်းတောင်းထဲသို့ ထည့်မည် |
| **お気に入り (おきにいり)** | Okiniiri | Favorites / Wishlist | နှစ်သက်သော ပစ္စည်းများ သိမ်းဆည်းသည့် စာရင်း |
| **特定商取引法 (特商法)** | Tokutei Shōtorihikihō | Specified Commercial Transactions Act | အွန်လိုင်းအရောင်းအဝယ်ဆိုင်ရာ ဂျပန်ဥပဒေ သတ်မှတ်ချက် စာမျက်နှာ |
| **マイページ** | Mai Pēji | My Page / User Dashboard | သုံးစွဲသူ အကောင့်စာမျက်နှာ (Order History, Profile စသည်) |
| **キャッシュクリア** | Kyasshu Kuria | Cache Clear | Template ပြင်ဆင်မှုများ ချက်ချင်းပေါ်စေရန် Cache ရှင်းထုတ်ခြင်း |

---

## 🚀 How to Learn this Course (လေ့လာရန် အကြံပြုချက်)

1. **အစီအစဉ်အတိုင်း ဖတ်ရှုပါ**: Module 00 မှ Module 10 အထိ အစဉ်လိုက် ဖတ်ရှုလေ့လာပါ။
2. **Code များကို လက်တွေ့ စမ်းသပ်ပါ**: ပေးထားသော Twig, CSS, HTML နမူနာများကို EC-CUBE local environment တွင် တိုက်ရိုက် ရေးသားစမ်းသပ်ပါ။
3. **Safe Override နည်းလမ်းကို အမြဲကျင့်သုံးပါ**: Core file များကို တိုက်ရိုက် မပြင်ဘဲ `app/template/` အောက်တွင် ကူးယူပြင်ဆင်သည့် အလေ့အကျင့်ကောင်းကို မွေးမြူပါ။
