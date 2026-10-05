---
title: "03. Entity Extension Customize"
description: "ဂျပန် Project များတွင် အသုံးအများဆုံး Customization တစ်ခုမှာ မူရင်း EC-CUBE Database Table များ (ဥပမာ: dtbproduct, dtbcustomer, dtborder) တွင် Column အသစ်များ ("
---

## Module 06 - အခန်း ၃: Entity Extension (Trait ဖြင့် Table Column အသစ်များ ထည့်သွင်းခြင်း)

ဂျပန် Project များတွင် အသုံးအများဆုံး Customization တစ်ခုမှာ မူရင်း EC-CUBE Database Table များ (ဥပမာ: `dtb_product`, `dtb_customer`, `dtb_order`) တွင် Column အသစ်များ (ဥပမာ: ကုန်ထုတ်လုပ်သူ Website URL, သက်တမ်းအာမခံကာလ, အဖွဲ့ဝင် VIP Level) ထပ်မံဖြည့်စွက်ခြင်း ဖြစ်ပါသည်။

EC-CUBE 4 တွင် Core Entity ကို တိုက်ရိုက်မပြင်ဘဲ **PHP Trait + `@EntityExtension` Annotation** ဖြင့် သန့်ရှင်းစွာ တိုးချဲ့နိုင်ပါသည်။

---

## ၁။ Entity Extension အလုပ်လုပ်ပုံ နည်းစနစ်

```
[ Core Entity: src/Eccube/Entity/Product.php ] (Unmodified)
                     ▲
                     │ (Doctrine / EC-CUBE compiles together via Trait)
                     │
[ Your Custom Trait: app/Customize/Entity/ProductTrait.php ]
  - @EntityExtension("Eccube\Entity\Product")
  - Custom Property: $manufacturer_url
  - Custom Getter & Setter: getManufacturerUrl() / setManufacturerUrl()
```

---

## ၂။ လက်တွေ့ အဆင့်ဆင့် ရေးသားနည်း (Step-by-Step)

ဥပမာအနေဖြင့် `Product` (dtb_product) ထဲတွင် **ထုတ်လုပ်သူ Website လင့်ခ် (`manufacturer_url`)** Column အသစ် ထည့်သွင်းပါမည်။

### အဆင့် ၁: `ProductTrait.php` ကို ဖန်တီးပါ
`app/Customize/Entity/ProductTrait.php` ဖိုင်ကို ရေးသားပါ:

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductTrait
{
    /**
     * ထုတ်လုပ်သူ၏ တရားဝင် ဝက်ဘ်ဆိုက် URL
     * @ORM\Column(name="manufacturer_url", type="string", length=255, nullable=true)
     */
    private $manufacturer_url;

    public function getManufacturerUrl(): ?string
    {
        return $this->manufacturer_url;
    }

    public function setManufacturerUrl(?string $manufacturer_url): self
    {
        $this->manufacturer_url = $manufacturer_url;
        return $this;
    }
}
```

---

### အဆင့် ၂: Database Schema ကို Update ပြုလုပ်ပါ

Trait ဖိုင် ရေးပြီးပါက Doctrine ORM အား Database တွင် Column အသစ် ထည့်ပေးရန် Command Run ရပါမည်-

```bash
# 1. ထွက်ပေါ်လာမည့် SQL Query ကို အရင်စစ်ဆေးပါ
bin/console doctrine:schema:update --dump-sql

# 2. Database သို့ Column အသစ် အမှန်တကယ် ထည့်သွင်းပါ
bin/console doctrine:schema:update --force
```

> 💡 **စစ်ဆေးခြင်း**: MySQL ထဲတွင် `DESCRIBE dtb_product;` ဖြင့် ကြည့်ပါက `manufacturer_url` Column အသစ် ရောက်ရှိနေသည်ကို တွေ့ရပါမည်။

---

### အဆင့် ၃: Admin Product Edit Form တွင် Input Box ထည့်သွင်းခြင်း (Form Extension)

Admin တွင် ကုန်ပစ္စည်းစာရင်းသွင်းသည့်အခါ အဆိုပါ URL ကို ရိုက်ထည့်နိုင်ရန် **Symfony Form Extension** ရေးသားရပါမည်-

`app/Customize/Form/Extension/Admin/ProductTypeExtension.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Customize\Form\Extension\Admin;

use Eccube\Form\Type\Admin\ProductType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ProductTypeExtension extends AbstractTypeExtension
{
    /**
     * မည်သည့် Form Type ကို Extend လုပ်မည်ကို သတ်မှတ်ခြင်း
     */
    public static function getExtendedTypes(): iterable
    {
        return [ProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('manufacturer_url', UrlType::class, [
            'label' => 'ထုတ်လုပ်သူ ဝက်ဘ်ဆိုက် (Manufacturer URL)',
            'required' => false,
            'attr' => [
                'placeholder' => 'https://manufacturer-brand.com',
            ],
            'constraints' => [
                new Assert\Url(['message' => 'မှန်ကန်သော Website URL (https://...) ဖြစ်ရပါမည်']),
            ],
            // Form ပေါ်တွင် မည်သည့်နေရာ၌ ထားမည်ကို သတ်မှတ်ခြင်း
            'eccube_form_options' => [
                'auto_render' => true,
            ],
        ]);
    }
}
```

---

### အဆင့် ၄: Frontend Twig Template တွင် ထုတ်ပြခြင်း

Storefront ရှိ ကုန်ပစ္စည်းအသေးစိတ်စာမျက်နှာ (`app/template/default/Product/detail.twig`) တွင် အောက်ပါအတိုင်း ခေါ်သုံးနိုင်ပါသည်-

```twig
{# ထုတ်လုပ်သူ URL ရှိပါက Link အဖြစ် ထုတ်ပြခြင်း #}
{% if Product.manufacturer_url %}
    <div class="mt-3">
        <strong>🌐 ထုတ်လုပ်သူ တရားဝင် ဝက်ဘ်ဆိုက်:</strong>
        <a href="{{ Product.manufacturer_url }}" target="_blank" rel="noopener noreferrer">
            {{ Product.manufacturer_url }}
        </a>
    </div>
{% endif %}
```

---

### အဆင့် ၅: Cache ရှင်းထုတ်ပြီး စမ်းသပ်ခြင်း

```bash
bin/console cache:clear
```

Admin Panel ရှိ Product Edit စာမျက်နှာတွင် Manufacturer URL အကွက် ရောက်လာပြီး သိမ်းဆည်းနိုင်မည်ဖြစ်ပါသည်။

---

နောက်အခန်းတွင် **[Module 07: Plugin Development အစအဆုံး တည်ဆောက်ခြင်း](/eccube/01_basics/07-plugin-development/01-plugin-basics-and-structure/)** ကို ဆက်လက်လေ့လာပါမည်။
