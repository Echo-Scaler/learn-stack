---
title: "13. Admin Search Condition"
description: "> 「管理画面の商品マスター（商品一覧検索）画面において、既存の検索条件（商品名、カテゴリ等）に加えて『在庫切れ商品のみ（在庫数0）』や『特定タグ（例: 限定品）』で絞り込める検索条件を追加してください。」"
---

## Task 13: 管理画面に検索条件を追加してください (Admin Search Condition Extension)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面の商品マスター（商品一覧検索）画面において、既存の検索条件（商品名、カテゴリ等）に加えて『在庫切れ商品のみ（在庫数0）』や『特定タグ（例: 限定品）』で絞り込める検索条件を追加してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Admin Panel ရှိ ကုန်ပစ္စည်းရှာဖွေမှု (Admin Product Search) စနစ်တွင် Admin များ ပိုမိုမြန်ဆန်စွာ စစ်ဆေးနိုင်ရန် **"စတော့ကုန်နေသော ပစ္စည်းများသာ (Out of stock only)"** စသည့် ရှာဖွေမှု Condition အသစ် ထည့်သွင်းပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Form Extension Pattern (`SearchProductType::class`)
- Admin Search Form ဖြစ်သော `Eccube\Form\Type\Admin\SearchProductType` ကို Extension ပြုလုပ်ခြင်းဖြင့် Admin Search UI တွင် Checkbox သို့မဟုတ် Input အသစ်ကို လုံခြုံစိတ်ချစွာ ပေါင်းထည့်နိုင်သည်။

### 2. QueryCustomizer ဖြင့် Admin Query ကို သီးသန့် ချိတ်ဆက်ခြင်း
- EC-CUBE တွင် Frontend Search နှင့် Admin Search နှစ်ခုလုံးသည် `ProductRepository::getQueryBuilderBySearchData` ကို အသုံးပြုသော်လည်း `$params` ထဲရှိ Flag များကို စစ်ဆေးကာ Admin သီးသန့် Query Logic ကို သီးခြားခွဲထုတ် ရေးသားနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Admin Search Form Extension ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/AdminSearchProductExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\Admin\SearchProductType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;

class AdminSearchProductExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [SearchProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('out_of_stock_only', CheckboxType::class, [
            'label' => '在庫切れ商品のみ表示',
            'required' => false,
            'value' => '1',
        ]);
    }
}
```

---

### အဆင့် ၂: QueryCustomizer တွင် Filter Logic ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/AdminProductSearchCustomizer.php`

```php
<?php

namespace Customize\Repository;

use Eccube\Doctrine\Query\QueryCustomizer;
use Doctrine\ORM\QueryBuilder;

class AdminProductSearchCustomizer implements QueryCustomizer
{
    public function customize(QueryBuilder $builder, array $params, array $handling): void
    {
        // 在庫切れ商品のみ表示 Checkbox ကို အမှန်ခြစ်ထားပါက
        if (!empty($params['out_of_stock_only'])) {
            $builder
                ->andWhere('pc.stock = 0')
                ->andWhere('pc.stock_unlimited = false');
        }
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\ProductRepository\getQueryBuilderBySearchData';
    }
}
```

---

### အဆင့် ၃: Admin Search UI (Twig) တွင် Field ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/admin/Product/index.twig` (သို့မဟုတ် Form Snippet)

```twig
{# 検索フォームに追加するHTML #}
<div class="form-row">
    <div class="col-12 mb-3">
        <div class="form-check form-check-inline">
            {{ form_widget(searchForm.out_of_stock_only, {'attr': {'class': 'form-check-input'}}) }}
            {{ form_label(searchForm.out_of_stock_only, null, {'label_attr': {'class': 'form-check-label text-danger font-weight-bold'}}) }}
        </div>
    </div>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Admin Session Persistence (検索条件の保持):**  
   EC-CUBE Admin သည် ရှာဖွေထားသော စံနှုန်းများကို Session ထဲတွင် သိမ်းဆည်းထားလေ့ရှိပါသည်။ Form Extension ပြုလုပ်ထားသော Field များသည် Session ထဲသို့ အလိုအလျောက် ရောက်ရှိသဖြင့် Pagination ကူးပြောင်းချိန်တွင်လည်း Search Condition မပျောက်ဘဲ ဆက်လက်တည်ရှိနေမည် ဖြစ်သည်။
2. **Clear Search Button (クリアボタン):**  
   Admin UI ရှိ "Clear" ခလုတ်ကို နှိပ်ချိန်တွင် အသစ်ထည့်ထားသော Checkbox သည်ပါ Uncheck ဖြစ်သွားစေရန် Reset JavaScript Logic ကို စစ်ဆေးသင့်ပါသည်။
