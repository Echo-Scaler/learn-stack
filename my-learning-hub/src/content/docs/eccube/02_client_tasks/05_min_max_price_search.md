---
title: "05. Min Max Price Search"
description: "> 「フロントの商品検索フォームに、価格の絞り込み機能を追加してください。『下限価格（例: 1,000円〜）』と『上限価格（例: 〜5,000円）』を入力して検索できるようにしてください。」"
---

## Task 05: 商品検索に価格範囲を追加してください (Min/Max Price Search)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「フロントの商品検索フォームに、価格の絞り込み機能を追加してください。『下限価格（例: 1,000円〜）』と『上限価格（例: 〜5,000円）』を入力して検索できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဝယ်ယူသူများသည် ပစ္စည်းရှာဖွေရာတွင် အနိမ့်ဆုံးဈေး (Price Min) နှင့် အမြင့်ဆုံးဈေး (Price Max) ကို ထည့်သွင်းကာ ဈေးနှုန်းအတိုင်းအတာအတွင်း ရှိသော ပစ္စည်းများကို ရှာဖွေနိုင်သည့် Filter စနစ် ထည့်သွင်းပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Symfony Form Extension ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- EC-CUBE ၏ Core ဖိုင်ဖြစ်သော `SearchProductType.php` ကို တိုက်ရိုက် သွားမပြင်ရပါ။ Core ဖိုင်ကို ပြင်ဆင်ပါက Version Update ပြုလုပ်ချိန်တွင် ပျက်စီးသွားနိုင်သည်။
- Symfony ၏ `AbstractTypeExtension` ကို သုံးခြင်းဖြင့် ရှိပြီးသား Form ထဲသို့ `price_min` နှင့် `price_max` Field အသစ် ၂ ခုကို Safe ဖြစ်စွာ ထပ်တိုးနိုင်ပါသည်။

### 2. ProductRepository (QueryBuilder) ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- EC-CUBE တွင် ရှာဖွေမှု အားလုံးသည် `ProductRepository::getQueryBuilderBySearchData()` ကို ဖြတ်သန်းသွားပါသည်။
- Form မှ ပို့လိုက်သော Input Parameter များကို SQL Injection မဖြစ်အောင် Prepared Statement (`setParameter`) ဖြင့် Safe ဖြစ်စွာ WHERE clause ထည့်သွင်းရန် QueryBuilder ကို အသုံးပြုရပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Search Form Extension ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/SearchProductPriceExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\SearchProductType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class SearchProductPriceExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [SearchProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('price_min', IntegerType::class, [
                'label' => '下限価格',
                'required' => false,
                'constraints' => [
                    new Assert\PositiveOrZero(['message' => '0以上の数値を入力してください。']),
                ],
                'attr' => [
                    'placeholder' => '下限なし',
                    'class' => 'form-control',
                ],
            ])
            ->add('price_max', IntegerType::class, [
                'label' => '上限価格',
                'required' => false,
                'constraints' => [
                    new Assert\PositiveOrZero(['message' => '0以上の数値を入力してください。']),
                ],
                'attr' => [
                    'placeholder' => '上限なし',
                    'class' => 'form-control',
                ],
            ]);
    }
}
```

---

### အဆင့် ၂: QueryBuilder တွင် Price Filter Logic ထည့်သွင်းခြင်း
EC-CUBE 4.2+ တွင် Repository Customization သို့မဟုတ် Query Customizer ကို သုံးနိုင်ပါသည်။

ဖိုင်တည်နေရာ: `app/Customize/Repository/ProductPriceSearchCustomizer.php`

```php
<?php

namespace Customize\Repository;

use Eccube\Doctrine\Query\QueryCustomizer;
use Doctrine\ORM\QueryBuilder;

class ProductPriceSearchCustomizer implements QueryCustomizer
{
    public function customize(QueryBuilder $builder, array $params, array $handling): void
    {
        // price_min ထည့်သွင်းထားပါက
        if (!empty($params['price_min'])) {
            $builder
                ->andWhere('pc.price02 >= :price_min')
                ->setParameter('price_min', $params['price_min']);
        }

        // price_max ထည့်သွင်းထားပါက
        if (!empty($params['price_max'])) {
            $builder
                ->andWhere('pc.price02 <= :price_max')
                ->setParameter('price_max', $params['price_max']);
        }
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\ProductRepository\getQueryBuilderBySearchData';
    }
}
```

---

### အဆင့် ၃: Search UI Template (Twig) တွင် Field များ ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Block/search_product.twig` (သို့မဟုတ် Product/list.twig search filter area)

```twig
<div class="row align-items-center my-2">
    <div class="col-auto">
        <label class="small font-weight-bold">価格帯：</label>
    </div>
    <div class="col-4">
        {{ form_widget(form.price_min, {'attr': {'placeholder': '¥ 最低価格'}}) }}
    </div>
    <div class="col-auto">～</div>
    <div class="col-4">
        {{ form_widget(form.price_max, {'attr': {'placeholder': '¥ 最高価格'}}) }}
    </div>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Min Price > Max Price Validation စစ်ဆေးရန်:**  
   User က Min Price တွင် 5,000 Yen ထည့်ပြီး Max Price တွင် 1,000 Yen ဟု မှားယွင်းထည့်သွင်းပါက Result မထွက်နိုင်သဖြင့် Callback Validator ထည့်သွင်း၍ "下限価格は上限価格以下で入力してください" ဟု Error ပြသပေးသင့်သည်။
2. **Tax Included vs Excluded (税込 / 税抜):**  
   Database ထဲရှိ `pc.price02` သည် အခွန်မပါဝင်သော မူရင်းဈေး (税抜) ဖြစ်သလား၊ သို့မဟုတ် အခွန်ပါဈေး (税込) ဖြစ်သလားကို စစ်ဆေးပါ။ အကယ်၍ ဝယ်ယူသူများက 税込 ဖြင့် ရှာဖွေလိုပါက Tax Rate 10% (1.10) ဖြင့် ပြန်လည်တွက်ချက်ကာ Query ပေးရပါမည်။
