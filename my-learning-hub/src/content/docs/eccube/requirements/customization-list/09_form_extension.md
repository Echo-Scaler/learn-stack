---
title: "09. Form Extension"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 09 - Form Extension (FieldType) Customize လုပ်နည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube ရှိ Existing Form (Registration, Checkout, Admin) တွင် Field ထပ်ထည့်ခြင်း နှင့် ကိုယ်ပိုင် Validation ထည့်သွင်းနည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Customer Registration form တွင် field ထပ်ထည့်တတ်ရန်
- Admin Product form ကို customize တတ်ရန်
- Custom Validation rule တည်ဆောက်တတ်ရန်

---

## 📌 Symfony Form Extension Architecture

```
AbstractType           ← ကိုယ်ပိုင် Form တည်ဆောက်ရာနေရာ
AbstractTypeExtension  ← Existing Form ကို Extend ပြုလုပ်ရာနေရာ
FormEvents             ← Form Data ကို process မှ hook ပြုလုပ်ရာ
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Customer Registration Form Extension

Registration Form တွင် "Company Name" field ထပ်ထည့်ပါ:

`app/Plugin/MyPlugin/Form/Extension/EntryTypeExtension.php`

```php
<?php

namespace Plugin\MyPlugin\Form\Extension;

use Eccube\Form\Type\Front\EntryType; // Customer Registration Form
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Validator\Constraints as Assert;

class EntryTypeExtension extends AbstractTypeExtension
{
    /**
     * Extend ပြုလုပ်မည့် Form Type ကို ညွှန်ပြပါ
     */
    public static function getExtendedTypes(): iterable
    {
        return [EntryType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // Corporate / Individual selection
        $builder->add('plg_customer_type', ChoiceType::class, [
            'label'    => 'お客様の種別',
            'required' => true,
            'choices'  => [
                '個人のお客様' => 'individual',
                '法人のお客様' => 'corporate',
            ],
            'expanded' => true,  // Radio buttons
            'multiple' => false,
        ]);

        // Company Name (corporate customers only)
        $builder->add('plg_company_name', TextType::class, [
            'label'    => '会社名',
            'required' => false,
            'constraints' => [
                new Assert\Length(['max' => 255]),
            ],
            'attr' => [
                'placeholder' => '株式会社〇〇',
            ],
        ]);

        // Department
        $builder->add('plg_department', TextType::class, [
            'label'    => '部署名',
            'required' => false,
            'attr'     => ['placeholder' => '営業部'],
        ]);

        // Mobile Phone (optional extra)
        $builder->add('plg_mobile', TelType::class, [
            'label'    => '携帯電話番号',
            'required' => false,
            'constraints' => [
                new Assert\Regex([
                    'pattern' => '/^0[0-9]{9,10}$/',
                    'message' => '正しい携帯電話番号を入力してください',
                ]),
            ],
        ]);

        // Form Submit 後に動的 Validation を追加
        $builder->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event) {
            $form = $event->getForm();
            $data = $event->getData();

            // 法人の場合、会社名は必須
            if (isset($data['plg_customer_type']) 
                && $data['plg_customer_type'] === 'corporate'
                && empty($data['plg_company_name'])) 
            {
                $form->get('plg_company_name')
                    ->addError(new \Symfony\Component\Form\FormError('法人のお客様は会社名を入力してください'));
            }
        });
    }
}
```

---

### အဆင့် 2 - Product Admin Form Extension

Product Edit form တွင် YouTube URL field ထပ်ထည့်ပါ:

`app/Plugin/MyPlugin/Form/Extension/ProductTypeExtension.php`

```php
<?php

namespace Plugin\MyPlugin\Form\Extension;

use Eccube\Form\Type\Admin\ProductType; // Admin Product Form
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ProductTypeExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [ProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // YouTube Video URL
        $builder->add('plg_youtube_url', TextType::class, [
            'label'    => 'YouTube URL',
            'required' => false,
            'constraints' => [
                new Assert\Url(),
                new Assert\Regex([
                    'pattern' => '/youtube\.com|youtu\.be/',
                    'message' => 'YouTube の URL を入力してください',
                ]),
            ],
            'attr' => [
                'placeholder' => 'https://www.youtube.com/watch?v=xxxxx',
            ],
        ]);

        // Weight field
        $builder->add('plg_weight_kg', NumberType::class, [
            'label'    => '重量 (kg)',
            'required' => false,
            'scale'    => 3, // 小数点3桁
            'attr'     => ['placeholder' => '0.500'],
        ]);

        // Material / 素材
        $builder->add('plg_material', TextareaType::class, [
            'label'    => '素材・材質',
            'required' => false,
            'attr'     => ['rows' => 3],
        ]);

        // Country of origin
        $builder->add('plg_origin_country', TextType::class, [
            'label'    => '原産国',
            'required' => false,
        ]);
    }
}
```

---

### အဆင့် 3 - Form Extension ကို services.yaml တွင် Register ပြုလုပ်ခြင်း

`app/Plugin/MyPlugin/Resource/config/services.yaml`

```yaml
services:
    # Customer Registration Form Extension
    Plugin\MyPlugin\Form\Extension\EntryTypeExtension:
        tags:
            - { name: form.type_extension }

    # Product Admin Form Extension
    Plugin\MyPlugin\Form\Extension\ProductTypeExtension:
        tags:
            - { name: form.type_extension }
```

---

### အဆင့် 4 - Form Data ကို Entity ထဲ Save ပြုလုပ်ခြင်း

EventSubscriber ထဲတွင် Form submit data ကို Entity ထဲ save ပြုလုပ်ပါ:

`app/Plugin/MyPlugin/MyPluginEvent.php`

```php
public static function getSubscribedEvents(): array
{
    return [
        EccubeEvents::FRONT_ENTRY_INDEX_COMPLETE => 'onEntryComplete',
        EccubeEvents::ADMIN_PRODUCT_EDIT_COMPLETE => 'onProductEditComplete',
    ];
}

/**
 * Customer Registration 完了後 → Trait data を保存
 */
public function onEntryComplete(EventArgs $event): void
{
    /** @var \Eccube\Entity\Customer $Customer */
    $Customer = $event->getArgument('Customer');
    $form     = $event->getArgument('form');

    // Form データを Entity の Trait メソッドへセット
    if ($form->has('plg_company_name')) {
        $Customer->setPlgCompanyName($form->get('plg_company_name')->getData());
    }

    if ($form->has('plg_mobile')) {
        $Customer->setPlgMobile($form->get('plg_mobile')->getData());
    }

    // EntityManager は EC-Cube が自動的に flush してくれる場合がほとんど
    // flush が必要な場合:
    // $this->entityManager->flush();
}

/**
 * Admin Product Edit 完了後 → Trait data を保存
 */
public function onProductEditComplete(EventArgs $event): void
{
    /** @var \Eccube\Entity\Product $Product */
    $Product = $event->getArgument('Product');
    $form    = $event->getArgument('form');

    if ($form->has('plg_youtube_url')) {
        $Product->setPlgYoutubeUrl($form->get('plg_youtube_url')->getData());
    }

    if ($form->has('plg_weight_kg')) {
        $Product->setPlgWeightKg($form->get('plg_weight_kg')->getData());
    }
}
```

---

### အဆင့် 5 - Custom Constraint (Validator) တည်ဆောက်ခြင်း

ကိုယ်ပိုင် Validation rule တည်ဆောက်ပါ (ဥပမာ: Japanese postal code စစ်ဆေးခြင်း):

`app/Plugin/MyPlugin/Validator/JapanesePostalCode.php`

```php
<?php

namespace Plugin\MyPlugin\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class JapanesePostalCode extends Constraint
{
    public string $message = '正しい郵便番号を入力してください（例: 123-4567）';
}
```

`app/Plugin/MyPlugin/Validator/JapanesePostalCodeValidator.php`

```php
<?php

namespace Plugin\MyPlugin\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class JapanesePostalCodeValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (empty($value)) {
            return; // NotBlank が担当するため
        }

        // 日本の郵便番号 (XXX-XXXX または XXXXXXX)
        if (!preg_match('/^\d{3}-?\d{4}$/', $value)) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
```

**Form ထဲတွင် Custom Constraint ကို အသုံးပြုခြင်း**:

```php
use Plugin\MyPlugin\Validator\JapanesePostalCode;

$builder->add('postal_code', TextType::class, [
    'constraints' => [
        new JapanesePostalCode(),
    ],
]);
```

---

### အဆင့် 6 - Template တွင် Custom Field ကို ပြသခြင်း

`app/template/default/Entry/index.twig`

```twig
{# ရှိပြီးသား Field များ ... #}

{# Custom Fields #}
<div class="ec-select">
    {{ form_label(form.plg_customer_type) }}
    {{ form_widget(form.plg_customer_type) }}
    {{ form_errors(form.plg_customer_type) }}
</div>

<div id="corporate-fields" style="display: none">
    <div class="ec-input">
        {{ form_label(form.plg_company_name) }}
        {{ form_widget(form.plg_company_name, {'attr': {'class': 'form-control'}}) }}
        {{ form_errors(form.plg_company_name) }}
    </div>
</div>

{# Corporate/Individual に応じて表示切替 #}
<script>
document.querySelectorAll('input[name*="plg_customer_type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const corporateFields = document.getElementById('corporate-fields');
        corporateFields.style.display = this.value === 'corporate' ? 'block' : 'none';
    });
});
</script>
```

---

## 🔑 よく使う Form Field Types

| Field Type | Import | 用途 |
|-----------|--------|------|
| `TextType` | Core | テキスト入力 |
| `TextareaType` | Core | 複数行テキスト |
| `NumberType` | Core | 数値 |
| `EmailType` | Core | メールアドレス |
| `TelType` | Core | 電話番号 |
| `DateType` | Core | 日付 |
| `ChoiceType` | Core | Select / Radio / Checkbox |
| `FileType` | Core | ファイルアップロード |
| `HiddenType` | Core | Hidden field |

---

## ✅ စစ်ဆေးမှုများ

- [ ] Extension classes の `getExtendedTypes()` が正しい Form class を返しているか
- [ ] `services.yaml` に `form.type_extension` tag が登録済みか
- [ ] Cache clear 実施済みか
- [ ] Form に新しい Field が表示されているか
- [ ] Validation が正しく動作しているか

---

> ➡️ **နောက်တစ်ဆင့်**: [10 - CSV Import/Export](/eccube/requirements/customization-list/10_csv_import_export/)
