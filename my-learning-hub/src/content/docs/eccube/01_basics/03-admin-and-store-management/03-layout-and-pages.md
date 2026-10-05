---
title: "03. Layout And Pages"
description: "EC-CUBE တွင် Frontend UI ဒီဇိုင်းနှင့် စာမျက်နှာတည်ဆောက်ပုံများကို Admin Dashboard ရှိ デザイン管理 (Design Management) မှတစ်ဆင့် Code ရေးစရာမလိုဘဲ လွယ်ကူစွာ စီမံခန့်"
---

## Module 03 - အခန်း ၃: Layout, Block နှင့် Page များ စီမံခန့်ခွဲမှု (デザイン管理)

EC-CUBE တွင် Frontend UI ဒီဇိုင်းနှင့် စာမျက်နှာတည်ဆောက်ပုံများကို Admin Dashboard ရှိ **デザイン管理 (Design Management)** မှတစ်ဆင့် Code ရေးစရာမလိုဘဲ လွယ်ကူစွာ စီမံခန့်ခွဲနိုင်ပါသည်။

---

## ၁။ Layout စနစ်နှင့် နေရာချထားမှု (Layout Structure)

EC-CUBE ၏ စာမျက်နှာတစ်ခုစီတွင် အောက်ပါကဲ့သို့ Section / Region များကို Visual Drag & Drop ဖြင့် နေရာချနိုင်ပါသည်-

```
+-------------------------------------------------------------------------+
| #HEADER (ヘッダー) - Logo, Search Box, Cart Button, Nav Menu             |
+-------------------------------------------------------------------------+
| #TOP (メイン上部) - Hero Slider Banner, Top Notice                      |
+-------------------+---------------------------------+-------------------+
| #SIDE_LEFT        | #MAIN (メインエリア)              | #SIDE_RIGHT       |
| (サイドバー左)     |                                 | (サイドバー右)     |
|                   | Main Page Content               |                   |
| - Category Tree   | (Product List / Detail / Cart)  | - Campaign Banner |
| - Tag Cloud       |                                 | - Recently Viewed |
+-------------------+---------------------------------+-------------------+
| #BOTTOM (メイン下部) - Recommended Products, Instagram Feed              |
+-------------------------------------------------------------------------+
| #FOOTER (フッター) - Footer Links, Company Info, Copyright               |
+-------------------------------------------------------------------------+
```

---

## ၂။ Layout Editor အသုံးပြုခြင်း (レイアウト設定)

Admin Sidebar မှ **デザイン管理 -> レイアウト設定** သို့ သွားရောက်ပါ။

### စီမံနိုင်သော စာမျက်နှာများ (Target Pages):
- **TOPページ (Top / Homepage)**: စတိုးဆိုင်၏ ပင်မစာမျက်နှာ
- **商品一覧ページ (Product List Page)**: ကုန်ပစ္စည်းရှာဖွေမှုနှင့် အမျိုးအစားအလိုက် စာရင်း
- **商品詳細ページ (Product Detail Page)**: ကုန်ပစ္စည်းတစ်ခုချင်းစီ၏ အသေးစိတ်စာမျက်နှာ
- **カートページ (Cart Page)**: ခြင်းတောင်းစာမျက်နှာ
- **購入手続き (Checkout Flow)**: အော်ဒါငွေရှင်းစာမျက်နှာများ
- **マイページ (Customer MyPage)**: အသင်းဝင်ကိုယ်ရေးအချက်အလက် စာမျက်နှာ

### Block နေရာချထားပုံ (Drag & Drop Operation):
1. အပေါ်ပိုင်းရှိ **未使用ブロック (အသုံးမပြုသေးသော Block များ)** စာရင်းမှ လိုအပ်သော Block (ဥပမာ: `新着商品 (New Products Block)`) ကို Mouse ဖြင့် ဖိဆွဲပါ။
2. အောက်ရှိ Layout Area (`#MAIN_TOP` သို့မဟုတ် `#SIDE_LEFT`) သို့ ချထား (Drop) ပေးပါ။
3. ညာဘက်အပေါ်ရှိ **登録 (Save)** ခလုတ်ကို နှိပ်ပါ။
4. Frontend သို့ သွားရောက် Refresh ပြုလုပ်ပြီး ရလဒ်ကို ကြည့်ရှုပါ။

---

## ၃။ Block စီမံခန့်ခွဲမှု (ブロック設定)

**Block** ဆိုသည်မှာ စာမျက်နှာများတွင် ပြန်လည်အသုံးပြုနိုင်သော UI Component (Twig Snippet) ဖြစ်ပါသည်။ (ဥပမာ: Header, Footer, Category Navigation, Slider Banner)။

### Block အသစ် ဖန်တီးနည်း:
1. **デザイン管理 -> ブロック設定** သို့သွားပြီး **新規ブロック作成** ခလုတ်ကို နှိပ်ပါ။
2. **ブロック名 (Block Name)**: ဥပမာ - `Special Campaign Banner`
3. **ファイル名 (File Name)**: ဥပမာ - `campaign_banner` (အလိုအလျောက် `campaign_banner.twig` အဖြစ် သိမ်းဆည်းမည်)
4. **データ (HTML / Twig Code)**:
```twig
{# app/template/default/Block/campaign_banner.twig #}
<div class="ec-campaign-banner my-4">
    <div class="card bg-primary text-white text-center p-3">
        <h4 class="m-0">🎉 ပိတ်ရက်အထူးပရိုမိုးရှင်း - အားလုံး ၂၀% လျှော့ဈေး! 🎉</h4>
        <p class="mb-0 mt-2">ကူပွန်ကုဒ်: <strong>SUMMER2026</strong></p>
    </div>
</div>
```
5. **登録 (Save)** နှိပ်ပြီးနောက် **レイアウト設定** သို့သွားကာ TOP Page တွင် အဆိုပါ Block ကို ဆွဲထည့်ပေးပါ။

---

## ၄။ Page အသစ် ဖန်တီးခြင်း (ページ管理 - Static & Custom Pages)

စတိုးဆိုင်တွင် ဆိုင်မိတ်ဆက်စာမျက်နှာ (About Us), စည်းကမ်းသတ်မှတ်ချက်များ (Terms & Conditions) သို့မဟုတ် အမေးများသောမေးခွန်းများ (FAQ) ကဲ့သို့ စာမျက်နှာအသစ်များကို Admin မှ တိုက်ရိုက် ဖန်တီးနိုင်ပါသည်။

### စာမျက်နှာအသစ် ထည့်သွင်းနည်း:
1. **デザイン管理 -> ページ管理** သို့သွားပြီး **新規ページ作成** နှိပ်ပါ။
2. **ページ名 (Page Title)**: ဥပမာ - `ဆိုင်အကြောင်း မိတ်ဆက် (About Us)`
3. **URL**: ဥပမာ - `about_us` (ဝင်ရောက်ရမည့် လိပ်စာမှာ `http://your-domain/user_data/about_us` ဖြစ်ပါမည်)
4. **レイアウト選択 (Layout Selection)**: မည်သည့် Layout (Top Layout, Standard Subpage Layout) ကို အသုံးပြုမည်ကို ရွေးချယ်ပါ။
5. **ページコード (Twig / HTML Content)**:
```twig
{% extends '@default/default_frame.twig' %}

{% set body_class = 'about_page' %}

{% block main %}
<div class="ec-layoutRole__main">
    <div class="ec-role">
        <div class="ec-pageHeader">
            <h1>ဆိုင်အကြောင်း မိတ်ဆက် (About Us)</h1>
        </div>
        <div class="ec-off1Grid">
            <div class="ec-off1Grid__cell">
                <p>ကျွန်ုပ်တို့၏ E-Commerce စတိုးမှ ကြိုဆိုပါသည်။ အရည်အသွေးမြင့် ကုန်ပစ္စည်းများကို ဂျပန်နိုင်ငံမှ တိုက်ရိုက် တင်သွင်းရောင်းချပေးနေပါသည်။</p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```
6. **登録 (Save)** နှိပ်ပါက `http://localhost:8080/user_data/about_us` တွင် ချက်ချင်း စာမျက်နှာ အသစ် ပေါ်လာမည်ဖြစ်ပါသည်။

---

နောက်အခန်းတွင် **[Module 04: Architecture နှင့် Core Concepts များ](/eccube/01_basics/04-architecture-and-core-concepts/01-symfony-and-routing/)** ကို ဆက်လက်လေ့လာပါမည်။
