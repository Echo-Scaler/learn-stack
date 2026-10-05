---
title: "16. Custom Order Search"
description: "> 「管理画面の受注一覧（Order List）において、特定の『配送伝票番号（Tracking Number）』や『顧客が入力したお問い合わせ欄の備考（Message）』、あるいは『決済方法（Payment Method）』で注文をピンポイント検索できるようにしてください。」"
---

## Task 16: 注文一覧に独自の検索条件を追加してください (Custom Order Search Condition)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面の受注一覧（Order List）において、特定の『配送伝票番号（Tracking Number）』や『顧客が入力したお問い合わせ欄の備考（Message）』、あるいは『決済方法（Payment Method）』で注文をピンポイント検索できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Admin Panel ရှိ အော်ဒါစာရင်း (Order Management) တွင် မူလပါဝင်သော နာမည်၊ ရက်စွဲ ရှာဖွေမှုများအပြင် **"ပစ္စည်းပို့ဆောင်ရေး ခြေရာခံနံပါတ် (Tracking Number)"** သို့မဟုတ် **"ငွေပေးချေမှုနည်းလမ်း (Payment Method)"** ဖြင့် သီးသန့် အသေးစိတ် ရှာဖွေနိုင်သည့် Filter စနစ် ထည့်သွင်းပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Customer Support & Shipping Operations (出荷・CS業務の迅速化)
- ဝယ်ယူသူက "ကျွန်တော့် Tracking Number က XXXXXX ဖြစ်ပါတယ်၊ ပစ္စည်း ဘယ်ရောက်နေပြီလဲ" ဟု ဖုန်းဆက် မေးမြန်းလာသည့်အခါ Admin များက Tracking Number ဖြင့် ချက်ချင်း ရှာဖွေနိုင်ခြင်းဖြင့် Customer Support အချိန်ကို သိသိသာသာ လျှော့ချပေးနိုင်သည်။

### 2. Form Extension + Order QueryCustomizer Architecture
- Core Class ဖြစ်သော `SearchOrderType` ကို Extension လုပ်ပြီး `OrderRepository` ၏ Admin QueryBuilder တွင် `QueryCustomizer` ဖြင့် `Shipping` Table သို့ JOIN ချိတ်ကာ WHERE Clause ထည့်သွင်းခြင်းသည် EC-CUBE ၏ Standard Clean Pattern ဖြစ်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Search Order Form Extension ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/AdminSearchOrderTrackingExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\Admin\SearchOrderType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class AdminSearchOrderTrackingExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [SearchOrderType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('tracking_number', TextType::class, [
            'label' => 'お問い合わせ番号（配送伝票番号）',
            'required' => false,
            'attr' => [
                'placeholder' => 'ヤマト・佐川の伝票番号',
                'class' => 'form-control',
            ],
        ]);
    }
}
```

---

### အဆင့် ၂: QueryCustomizer ဖြင့် Order Query တွင် JOIN & WHERE ချိတ်ဆက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/AdminSearchOrderCustomizer.php`

```php
<?php

namespace Customize\Repository;

use Eccube\Doctrine\Query\QueryCustomizer;
use Doctrine\ORM\QueryBuilder;

class AdminSearchOrderCustomizer implements QueryCustomizer
{
    public function customize(QueryBuilder $builder, array $params, array $handling): void
    {
        // 配送伝票番号 (tracking_number) ဖြင့် ရှာဖွေလိုပါက
        if (!empty($params['tracking_number'])) {
            $builder
                ->innerJoin('o.Shippings', 's')
                ->andWhere('s.tracking_number LIKE :tracking_number')
                ->setParameter('tracking_number', '%' . trim($params['tracking_number']) . '%');
        }
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\OrderRepository\getQueryBuilderBySearchDataForAdmin';
    }
}
```

---

### အဆင့် ၃: Admin Order Search UI တွင် Input Box ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/admin/Order/index.twig` (သို့မဟုတ် Form Block)

```twig
<div class="col-md-6 mb-3">
    <label class="col-form-label font-weight-bold">配送伝票番号</label>
    {{ form_widget(searchForm.tracking_number) }}
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Multiple Shippings (複数お届け先機能):**  
   EC-CUBE တွင် အော်ဒါတစ်ခုတည်းကို နေရာ ၃ နေရာခွဲ၍ ပို့ဆောင်နိုင်သော "複数お届け先" Feature ပါဝင်ပါသည်။ ထို့ကြောင့် `o.Shippings` သည် OneToMany ဖြစ်ပြီး အဆိုပါ ပို့ဆောင်မှုများထဲမှ တစ်ခုခုတွင် Tracking Number ကိုက်ညီပါက အော်ဒါ ထွက်ပေါ်လာစေရန် `DISTINCT` သို့မဟုတ် Grouping ကို Query တွင် စစ်ဆေးပေးရပါမည်။
2. **Half-width / Full-width Conversion (全角・半角ハイフン):**  
   ဂျပန် User များသည် ကိန်းဂဏန်းနှင့် Hyphen (-) များကို Full-width (全角) ရိုက်ထည့်တတ်ကြသဖြင့် Controller/Customizer တွင် `mb_convert_kana($str, 'a')` ဖြင့် Half-width သို့ ပြောင်းလဲပြီးမှ Query ရှာဖွေသင့်ပါသည်။
