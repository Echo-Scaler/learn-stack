---
title: "01. Page Management And Routing"
description: "EC-CUBE တွင် စာမျက်နှာအသစ်များ (ဥပမာ- Campaign Page, Brand Story, FAQ Page) ဖန်တီးရာတွင် နည်းလမ်း ၂ မျိုး ရှိပါသည်-"
---

## Module 04: Page & Block Management (စာမျက်နှာနှင့် Block များ ဖန်တီးစီမံခြင်း)

---

## ၁။ Page Management (ページ管理) ခြုံငုံသုံးသပ်ချက်

EC-CUBE တွင် စာမျက်နှာအသစ်များ (ဥပမာ- Campaign Page, Brand Story, FAQ Page) ဖန်တီးရာတွင် နည်းလမ်း ၂ မျိုး ရှိပါသည်-

1. **Admin Panel မှတစ်ဆင့် ဖန်တီးခြင်း (No-Code / UI Approach)**: အလွယ်တကူ စာမျက်နှာအသစ်ဖန်တီးနိုင်ပြီး Twig code ကို Admin Editor မှ တိုက်ရိုက် ရေးသားနိုင်သည်။
2. **Code (Symfony Controller & Twig) မှတစ်ဆင့် ဖန်တီးခြင်း (Developer Approach)**: Database logic, Form submission, Complex business logic များ ပါဝင်သော စာမျက်နှာများအတွက် သင့်တော်သည်။

---

## ၂။ Admin UI မှ စာမျက်နှာအသစ် ဖန်တီးနည်း (新規ページ作成)

### အဆင့်များ-
1. Admin Panel သို့ ဝင်ပါ -> `コンテンツ管理` (Content Management) -> `ページ管理` (Page Management) သို့ သွားပါ။
2. အပေါ်ညာဘက်ရှိ `新規入力` (Create New) ခလုတ်ကို နှိပ်ပါ။
3. အောက်ပါ အချက်အလက်များကို ဖြည့်သွင်းပါ-
   - **名称 (Page Name)**: စာမျက်နှာအမည် (ဥပမာ- `春の新作特集 - Spring Collection`)
   - **URL (URL Slug)**: ဝက်ဘ်ဆိုက် လမ်းကြောင်း (ဥပမာ- `spring_campaign`) -> URL သည် `https://domain.com/spring_campaign` ဖြစ်လာပါမည်။
   - **レイアウト (Layout)**: စာမျက်နှာတွင် အသုံးပြုမည့် Layout ပုံစံ (Top Layout / Underlayer Layout) ရွေးချယ်ပါ။
   - **コード (Twig Code Editor)**: HTML / Twig Code ကို ရေးသားပါ။

```twig
{# Admin Page Editor တွင် ရေးသားရမည့် Twig နမူနာ #}
{% extends 'default_frame.twig' %}

{% block main %}
<div class="campaign-container">
    <div class="campaign-hero">
        <h1>🌸 2026 Spring Campaign 🌸</h1>
        <p class="subtitle">နွေဦးရာသီ အထူးလျှော့ဈေး အစီအစဉ်သစ်</p>
    </div>
    
    <div class="campaign-content">
        <p>Spring Collection ပစ္စည်းများကို အထူးဈေးနှုန်းဖြင့် ဝယ်ယူရရှိနိုင်ပါပြီ။</p>
        <a href="{{ url('product_list') }}?category_id=5" class="ec-blockBtn--action">
            Collection ပစ္စည်းများ ကြည့်မည်
        </a>
    </div>
</div>
{% endblock %}
```

---

## ၃။ Block Management (ブロック管理) ခြုံငုံသုံးသပ်ချက်

**Block** ဆိုသည်မှာ ဝက်ဘ်ဆိုက်၏ နေရာအသီးသီးတွင် ပြန်လည်အသုံးပြုနိုင်သော UI Component (Widget) အပိုင်းအစများ ဖြစ်ပါသည်။

### Block အမျိုးအစား ၂ မျိုး-
1. **System Blocks (システムブロック)**: EC-CUBE တွင် အသင့်ပါဝင်သော Block များ (ဥပမာ- Header, Footer, Category Navigation, Search Bar, Cart Icon)။
2. **User Custom Blocks (独自ブロック)**: Developer မှ စိတ်ကြိုက် ဖန်တီးထားသော Block များ (ဥပမာ- Promo Banner, Instagram Feed, Shop Notice)။

---

## ၄။ Custom Block အသစ် ဖန်တီးနည်း (Hands-On)

### နမူနာ (၁) - Promo Banner Custom Block (Admin UI မှ ဖန်တီးခြင်း)

1. Admin Panel -> `コンテンツ管理` -> `ブロック管理` -> `新規入力` ကို နှိပ်ပါ။
2. အချက်အလက် ဖြည့်သွင်းပါ-
   - **ブロック名 (Block Name)**: `Special Promo Banner`
   - **ファイル名 (File Name)**: `promo_banner` (စနစ်က `promo_banner.twig` အဖြစ် သိမ်းဆည်းပါမည်)
3. Code Editor တွင် အောက်ပါအတိုင်း ရေးသားပါ-

```twig
{# app/template/default/Block/promo_banner.twig #}
<div class="promo-banner-wrapper">
    <div class="promo-banner-card">
        <div class="promo-badge">🎉 SPECIAL OFFER</div>
        <h3 class="promo-title">ယခုလအတွင်း ဝယ်ယူသူတိုင်းအတွက် 5% အထူးလျှော့ဈေး</h3>
        <p class="promo-code">Coupon Code: <strong>SPRING2026</strong></p>
        <a href="{{ url('product_list') }}" class="promo-btn">ဈေးဝယ်မည်</a>
    </div>
</div>

<style>
.promo-banner-wrapper {
    margin: 20px 0;
    padding: 0 15px;
}
.promo-banner-card {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.25);
}
.promo-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.25);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 8px;
}
.promo-title {
    font-size: 20px;
    font-weight: 700;
    margin: 8px 0;
}
.promo-btn {
    display: inline-block;
    margin-top: 12px;
    padding: 10px 24px;
    background: #ffffff;
    color: #ff6b6b;
    font-weight: bold;
    border-radius: 30px;
    text-decoration: none;
    transition: transform 0.2s ease;
}
.promo-btn:hover {
    transform: translateY(-2px);
    color: #ff5252;
}
</style>
```

4. `登録` (Save) ခလုတ်ကို နှိပ်ပါ။
5. `レイアウト管理` သို့သွား၍ အသစ်ဖန်တီးလိုက်သော `Special Promo Banner` Block ကို `#contents_top` သို့မဟုတ် `#main_top` သို့ Drag & Drop ဆွဲထည့်ပါ။

---

## ၅။ Dynamic Block with PHP Controller (Backend Data ပါဝင်သော Block)

အကယ်၍ Block အတွင်းတွင် Database မှ Dynamic Data (ဥပမာ- အရောင်းရဆုံးပစ္စည်း Top 5 စာရင်း) ကို ဆွဲထုတ်ပြသလိုပါက **Custom Block Controller (PHP)** နှင့် ချိတ်ဆက်ရပါသည်-

```php
// app/Customize/Controller/Block/BestSellerBlockController.php
namespace Customize\Controller\Block;

use Eccube\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class BestSellerBlockController extends AbstractController
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index(): Response
    {
        // အသစ်ရောက် ပစ္စည်း ၆ မျိုးကို Query ဆွဲယူခြင်း
        $bestSellers = $this->productRepository->findBy(
            ['Status' => 1],
            ['create_date' => 'DESC'],
            6
        );

        return $this->render('Block/bestseller.twig', [
            'Products' => $bestSellers,
        ]);
    }
}
```

```twig
{# app/template/default/Block/bestseller.twig #}
<div class="bestseller-block">
    <h2 class="section-title">🔥 Best Sellers (人気商品)</h2>
    <div class="row">
        {% for Product in Products %}
            <div class="col-6 col-md-4 col-lg-2">
                <div class="product-item">
                    <a href="{{ url('product_detail', {'id': Product.id}) }}">
                        <img src="{{ asset(Product.main_list_image, 'save_image') }}" alt="{{ Product.name }}" class="img-fluid">
                        <p class="product-name">{{ Product.name }}</p>
                        <p class="product-price">{{ Product.getPrice02MinIncTax|price }}</p>
                    </a>
                </div>
            </div>
        {% endfor %}
    </div>
</div>
```

> [!NOTE]
> Static HTML/Twig သာဖြစ်ပါက Admin UI မှ Block ဖန်တီးခြင်းသည် အမြန်ဆုံးနှင့် အလွယ်ကူဆုံး ဖြစ်ပါသည်။ Database Queries သို့မဟုတ် Service Injection လိုအပ်မှသာ PHP Controller ဖြင့် တွဲဖက်ရေးသားရန် အကြံပြုပါသည်။
