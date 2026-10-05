---
title: "02. Custom Blocks And Assets"
description: "ဤအခန်းတွင် Dynamic Data (Database မှ ကုန်ပစ္စည်းများ) ကို ဆွဲထုတ်ပြသမည့် Custom Dynamic Block တစ်ခု ရေးသားနည်းနှင့် CSS / JavaScript Asset များ စီမံခန့်ခွဲပုံ က"
---

## Module 05 - အခန်း ၂: Custom Blocks နှင့် Assets (CSS/JS) စီမံခန့်ခွဲမှု

ဤအခန်းတွင် Dynamic Data (Database မှ ကုန်ပစ္စည်းများ) ကို ဆွဲထုတ်ပြသမည့် **Custom Dynamic Block** တစ်ခု ရေးသားနည်းနှင့် **CSS / JavaScript Asset များ စီမံခန့်ခွဲပုံ** ကို လေ့လာပါမည်။

---

## ၁။ Static Block vs Dynamic Block

- **Static Block**: HTML / Twig သက်သက်သာ ပါဝင်ပြီး Admin ပေါ်မှ ရေးသားနိုင်သော ရိုးရှင်းသည့် Block ဖြစ်သည် (ဥပမာ: Text Banner, Social Media Links)။
- **Dynamic Block**: Database မှ Data ရှာဖွေခြင်း သို့မဟုတ် ရှုပ်ထွေးသော Business Logic များ ပါဝင်သည့်အခါ **Controller + Twig Template** တွဲဖက်၍ ရေးသားရသော Block ဖြစ်သည် (ဥပမာ: "အရောင်းရဆုံး ကုန်ပစ္စည်းများ", "အထူးလျှော့ဈေး စာရင်း")။

---

## ၂။ လက်တွေ့ Dynamic Block ရေးသားခြင်း (ဥပမာ: Top Recommended Products Block)

### အဆင့် ၁: Block Controller ဖန်တီးပါ
`app/Customize/Controller/Block/RecommendProductsController.php` ကို ဖန်တီးပါ-

```php
<?php

namespace Customize\Controller\Block;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RecommendProductsController extends AbstractController
{
    /**
     * @var ProductRepository
     */
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Block အတွက် Action Method
     * @Route("/block/recommend_products", name="block_recommend_products")
     */
    public function index(): Response
    {
        // Tag ID = 1 (Recommended) ဖြစ်သော ကုန်ပစ္စည်း ၄ ခုကို Database မှ ရှာယူခြင်း
        $products = $this->productRepository->findBy(
            ['Status' => 1],
            ['create_date' => 'DESC'],
            4
        );

        return $this->render('Block/recommend_products.twig', [
            'products' => $products,
            'title' => '🌟 လူကြိုက်အများဆုံး ရွေးချယ်စရာ ကုန်ပစ္စည်းများ',
        ]);
    }
}
```

### အဆင့် ၂: Twig Template ဖန်တီးပါ
`app/template/default/Block/recommend_products.twig` ကို ဖန်တီးပါ-

```twig
<div class="ec-recommendBlock my-5">
    <div class="container">
        <h3 class="text-center mb-4 font-weight-bold">{{ title }}</h3>
        
        <div class="row">
            {% for Product in products %}
                <div class="col-6 col-md-3 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <a href="{{ url('product_detail', { id: Product.id }) }}">
                            <img src="{{ asset(Product.main_list_image, 'save_image') }}" 
                                 class="card-img-top" 
                                 alt="{{ Product.name }}"
                                 style="height: 180px; object-fit: cover;">
                        </a>
                        <div class="card-body p-3">
                            <h6 class="card-title text-truncate">
                                <a href="{{ url('product_detail', { id: Product.id }) }}" class="text-dark text-decoration-none">
                                    {{ Product.name }}
                                </a>
                            </h6>
                            <p class="text-danger font-weight-bold mb-0">
                                {{ Product.getPrice02IncTaxMin|price }}
                            </p>
                        </div>
                    </div>
                </div>
            {% endfor %}
        </div>
    </div>
</div>
```

### အဆင့် ၃: Admin Layout တွင် အဆိုပါ Block ကို ထည့်သွင်းပါ
1. Admin Dashboard သို့သွားပြီး **デザイン管理 -> レイアウト設定** ကို ဖွင့်ပါ။
2. **TOPページ** Layout တွင် `recommend_products` Block ကို လိုအပ်သော နေရာသို့ ဆွဲထည့်ပြီး Save လုပ်ပါ။

---

## ၃။ CSS နှင့် JavaScript Asset များ ထည့်သွင်းခြင်း

Custom CSS / JS ဖိုင်များကို အောက်ပါနေရာများတွင် သိမ်းဆည်းနိုင်ပါသည်:

### Asset တည်နေရာများ:
- Public CSS: `html/template/default/assets/css/custom.css`
- Public JS: `html/template/default/assets/js/custom.js`
- Public Images: `html/template/default/assets/img/`

### Template ထဲတွင် Asset ချိတ်ဆက်နည်း:

`app/template/default/default_frame.twig` သို့မဟုတ် သက်ဆိုင်ရာ စာမျက်နှာ Twig ထဲတွင် အောက်ပါအတိုင်း ချိတ်ဆက်ပါ-

```twig
{% block stylesheet %}
    {{ parent() }}
    {# Version query string ထည့်သွင်းခြင်းဖြင့် Browser Cache ပြဿနာကို ဖြေရှင်းနိုင်သည် #}
    <link rel="stylesheet" href="{{ asset('assets/css/custom.css') }}?v=1.0.0">
{% endblock %}

{% block javascript %}
    {{ parent() }}
    <script src="{{ asset('assets/js/custom.js') }}?v=1.0.0"></script>
{% endblock %}
```

---

နောက်အခန်းတွင် **[Module 06: Backend Customization (Controller, Event, Entity Extension)](/eccube/01_basics/06-backend-customization/01-custom-controllers-and-forms/)** ကို ဆက်လက်လေ့လာပါမည်။
