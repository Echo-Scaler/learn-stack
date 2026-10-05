---
title: "03. Favorite Mark"
description: "> 「ログイン中の会員が商品一覧を見た際、自分がすでにお気に入りに登録している商品には、一目で分かるように『登録済みアイコン（赤いハートマークやバッジ）』を表示してください。」"
---

## Task 03: お気に入り登録されている商品に印を表示してください (Favorite Mark on Products)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「ログイン中の会員が商品一覧を見た際、自分がすでにお気に入りに登録している商品には、一目で分かるように『登録済みアイコン（赤いハートマークやバッジ）』を表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Login ဝင်ထားသော Member က Product List ကို ကြည့်သည့်အခါ၊ မိမိကိုယ်တိုင် Favorite မှတ်ထားပြီးသား ပစ္စည်းဖြစ်ပါက အနီရောင် အသည်းပုံ (Solid Heart Icon) သို့မဟုတ် "お気に入り済み" တံဆိပ် အမှတ်အသား ပြသပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. User Experience (UX) ပိုမိုကောင်းမွန်စေခြင်း
- ဝယ်ယူသူသည် မည်သည့်ပစ္စည်းကို ရွေးချယ်မှတ်သားထားပြီးပြီလဲဆိုသည်ကို Detail Page သို့ ဝင်မကြည့်ဘဲ List Page ကတည်းက ချက်ချင်း သိရှိနိုင်သည်။

### 2. Batch Verification (Single Query) ဖြင့် Performance ထိန်းသိမ်းခြင်း
- ပစ္စည်းတစ်ခုချင်းစီအတွက် DB ထဲ `CustomerFavoriteProduct` ရှိမရှိ တစ်ခုချင်း စစ်ဆေးပါက Query အရေအတွက် အဆမတန် များပြားလာမည်။
- **အဖြေ:** လက်ရှိ Login User ၏ Favorited Product IDs များကို `array` တစ်ခုအဖြစ် **တစ်ခုတည်းသော Query** ဖြင့် ဆွဲယူပြီး Twig တွင် `in` operator ဖြင့် O(1) speed ဖြင့် စစ်ဆေးပြသခြင်းသည် အကောင်းဆုံး နည်းလမ်းဖြစ်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: EventSubscriber ဖြင့် လက်ရှိ User ၏ Favorite IDs များကို စစ်ဆေးရယူခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/ProductListFavoriteMarkSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Entity\Customer;
use Eccube\Event\TemplateEvent;
use Eccube\Repository\CustomerFavoriteProductRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Security;

class ProductListFavoriteMarkSubscriber implements EventSubscriberInterface
{
    private Security $security;
    private CustomerFavoriteProductRepository $favRepository;

    public function __construct(
        Security $security,
        CustomerFavoriteProductRepository $favRepository
    ) {
        $this->security = $security;
        $this->favRepository = $favRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'Product/list.twig' => 'onProductList',
        ];
    }

    public function onProductList(TemplateEvent $event): void
    {
        $parameters = $event->getParameters();
        $user = $this->security->getUser();

        $myFavoriteProductIds = [];

        // အကယ်၍ Member Login ဝင်ထားပါက ၎င်း၏ Favorite Product ID များကို ရယူမည်
        if ($user instanceof Customer) {
            $favorites = $this->favRepository->findBy(['Customer' => $user]);
            foreach ($favorites as $fav) {
                $myFavoriteProductIds[] = $fav->getProduct()->getId();
            }
        }

        // Twig သို့ ID Array အနေဖြင့် လက်ဆင့်ကမ်း ပေးပို့ခြင်း
        $parameters['myFavoriteProductIds'] = $myFavoriteProductIds;
        $event->setParameters($parameters);
    }
}
```

---

### အဆင့် ၂: Twig Template တွင် အမှတ်အသား အိုင်ကွန် ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

ပစ္စည်းပုံအပေါ် သို့မဟုတ် ပစ္စည်းအမည်အနီးတွင် အောက်ပါကုဒ်ကို ထည့်သွင်းပါ:

```twig
{# お気に入り登録済みマーク #}
<div class="ec-productRole__favoriteMark position-absolute" style="top: 10px; right: 10px; z-index: 10;">
    {% if app.user and Product.id in myFavoriteProductIds %}
        {# ログイン中 かつ お気に入り登録済みの場合 #}
        <span class="badge badge-danger p-2 shadow-sm rounded-circle" title="お気に入り登録済み">
            <i class="fas fa-heart text-white"></i>
        </span>
    {% else %}
        {# 未登録 または 未ログインの場合 #}
        <span class="badge badge-light p-2 shadow-sm rounded-circle text-muted" title="お気に入り未登録">
            <i class="far fa-heart"></i>
        </span>
    {% endif %}
</div>
```

---

### အဆင့် ၃: CSS Styling အနည်းငယ် ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `html/template/default/assets/css/style.css`

```css
.ec-productRole__listItem {
    position: relative;
}

.ec-productRole__favoriteMark .fa-heart {
    font-size: 1.1rem;
    transition: transform 0.2s ease-in-out;
}

.ec-productRole__favoriteMark:hover .fa-heart {
    transform: scale(1.2);
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Guest User (未ログイン) တွင် Error မတက်စေရန်:**  
   `$user instanceof Customer` ကို အမြဲ စစ်ဆေးရပါမည်။ Login မဝင်ထားသော ဧည့်သည်များ ကြည့်ရှုချိန်တွင် null pointer exception မဖြစ်စေရန် `app.user` ရှိမရှိ Twig ဘက်တွင်ပါ စစ်ဆေးရပါမည်။
2. **Ajax Toggle နှင့် တွဲဖက် အသုံးပြုခြင်း:**  
   ခလုတ်ကို နှိပ်လိုက်သည်နှင့် Page မရွေ့ဘဲ ချက်ချင်း Heart Icon အရောင် ပြောင်းသွားစေရန် Ajax စနစ် (Task 26) နှင့် ပေါင်းစပ်အသုံးပြုပါက ပိုမိုပြည့်စုံသော Client Requirement ဖြစ်လာပါမည်။
