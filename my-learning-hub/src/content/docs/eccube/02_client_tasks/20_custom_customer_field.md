---
title: "20. Custom Customer Field"
description: "> 「BtoB取引や法人向け販売に対応するため、会員登録画面（Entry）およびマイページ、管理画面の顧客マスターに『会社名（法人名: companyname）』と『部署名（departmentname）』の入力欄を追加し、データベースに保存・閲覧できるようにしてください。」"
---

## Task 20: 顧客情報に独自項目を追加してください (Custom Customer Field Extension)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「BtoB取引や法人向け販売に対応するため、会員登録画面（Entry）およびマイページ、管理画面の顧客マスターに『会社名（法人名: company_name）』と『部署名（department_name）』の入力欄を追加し、データベースに保存・閲覧できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Member အသစ် စာရင်းသွင်းချိန် (Customer Registration)၊ Mypage နှင့် Admin Customer ပိုင်းတွင် မူလပါဝင်သော နာမည်၊ လိပ်စာအပြင် **"ကုမ္ပဏီအမည် (Company Name)"** နှင့် **"ဌာနအမည် (Department)"** ဟူသော Field အသစ်များ ထည့်သွင်းပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Entity Extension Trait Architecture
- EC-CUBE 4 တွင် Core Entity ဖိုင်ဖြစ်သော `src/Eccube/Entity/Customer.php` ကို တိုက်ရိုက် မပြင်ဆင်ရပါ။
- `app/Customize/Entity/CustomerTrait.php` ကို အသုံးပြုကာ `@EntityExtension` Annotation ဖြင့် Column အသစ်များကို သန့်ရှင်းစွာ ပေါင်းစပ်ပေးရမည်ဖြစ်သည်။

### 2. Doctrine Migration ဖြင့် Schema Sync ပြုလုပ်ခြင်း
- Trait ထဲတွင် ရေးသားထားသော Column အသစ်များကို Database Table (`dtb_customer`) ထဲသို့ Migration Script ဖြင့် လုံခြုံစွာ Alter Table ပြုလုပ်ပေးရပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Customer Entity Trait ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/CustomerCompanyTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @EntityExtension("Eccube\Entity\Customer")
 */
trait CustomerCompanyTrait
{
    /**
     * @ORM\Column(name="company_name", type="string", length=255, nullable=true)
     * @Assert\Length(max=255)
     */
    private ?string $company_name = null;

    /**
     * @ORM\Column(name="department_name", type="string", length=255, nullable=true)
     * @Assert\Length(max=255)
     */
    private ?string $department_name = null;

    public function getCompanyName(): ?string
    {
        return $this->company_name;
    }

    public function setCompanyName(?string $company_name): self
    {
        $this->company_name = $company_name;
        return $this;
    }

    public function getDepartmentName(): ?string
    {
        return $this->department_name;
    }

    public function setDepartmentName(?string $department_name): self
    {
        $this->department_name = $department_name;
        return $this;
    }
}
```

Database Schema Update & Proxy ပြုလုပ်ခြင်း:
```bash
bin/console doctrine:schema:update --dump-sql --force
bin/console eccube:generate:proxies
```

---

### အဆင့် ၂: Frontend Entry Form Extension ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/EntryCompanyExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\Front\EntryType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class EntryCompanyExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [EntryType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('company_name', TextType::class, [
                'label' => '会社名・法人名',
                'required' => false,
                'constraints' => [
                    new Assert\Length(['max' => 255]),
                ],
                'attr' => [
                    'placeholder' => '例: 株式会社〇〇',
                ],
            ])
            ->add('department_name', TextType::class, [
                'label' => '部署名',
                'required' => false,
                'constraints' => [
                    new Assert\Length(['max' => 255]),
                ],
                'attr' => [
                    'placeholder' => '例: 開発部',
                ],
            ]);
    }
}
```

---

### အဆင့် ၃: Twig Template တွင် Input Field ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Entry/index.twig`

အမည် (Name) Field အောက်တွင် အောက်ပါ ကုဒ်ကို ထည့်သွင်းပါ:

```twig
{# 会社名・部署名追加フィールド #}
<dl>
    <dt>
        {{ form_label(form.company_name) }}
    </dt>
    <dd>
        <div class="ec-input">
            {{ form_widget(form.company_name) }}
            {{ form_errors(form.company_name) }}
        </div>
    </dd>
</dl>
<dl>
    <dt>
        {{ form_label(form.department_name) }}
    </dt>
    <dd>
        <div class="ec-input">
            {{ form_widget(form.department_name) }}
            {{ form_errors(form.department_name) }}
        </div>
    </dd>
</dl>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Admin Customer Form တွင်ပါ ထည့်သွင်းရန်:**  
   Frontend `EntryType` သာမက Admin ဘက်ရှိ `Eccube\Form\Type\Admin\CustomerType` ကိုပါ Form Extension ရေးသားပေးရပါမည်။ သို့မှသာ Admin Panel မှ ဝင်ရောက်ကြည့်ရှုချိန်တွင် ကုမ္ပဏီအမည်ကို မြင်တွေ့/ပြင်ဆင်နိုင်မည် ဖြစ်သည်။
2. **Order Entity နှင့် သီးခြားစီ ခွဲခြားနားလည်ခြင်း:**  
   Customer တွင် ကုမ္ပဏီအမည် ထည့်လိုက်သော်လည်း အော်ဒါတင်သည့်အခါ အော်ဒါလိပ်စာ (`dtb_order` / `dtb_shipping`) တွင် ကုမ္ပဏီအမည် ပါဝင်လိုပါက `OrderTrait` တွင်ပါ အလားတူ Column ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။
