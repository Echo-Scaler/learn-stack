---
title: "04. Admin Page Extension"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 04 - Admin Page ထပ်ဆောင်းနည်း (Admin Page Extension)

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

Plugin တစ်ခုမှတဆင့် Admin Panel တွင် ကိုယ်ပိုင် Page နှင့် Menu Item ထည့်သွင်းနည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Admin Sidebar တွင် Menu ထည့်တတ်ရန်
- Custom Admin Page (Controller + Template) တည်ဆောက်တတ်ရန်
- Form ပါသော Settings Page ပြုလုပ်တတ်ရန်

---

## 📁 ဖိုင် Structure

```
app/Plugin/MyPlugin/
├── Controller/
│   └── Admin/
│       ├── ConfigController.php     ← Settings page
│       └── ReportController.php     ← Report page
├── Form/
│   └── Type/
│       └── Admin/
│           └── ConfigType.php       ← Settings Form
├── Resource/
│   └── template/
│       └── admin/
│           ├── config.twig          ← Settings template
│           └── report.twig          ← Report template
└── MyPluginNav.php                  ← Admin Menu items
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Admin Navigation Menu ထည့်ခြင်း

`app/Plugin/MyPlugin/MyPluginNav.php`

```php
<?php

namespace Plugin\MyPlugin;

use Eccube\Common\EccubeNav;

class MyPluginNav implements EccubeNav
{
    /**
     * Admin Sidebar ထဲတွင် ထည့်မည့် Menu Items
     */
    public static function getNav(): array
    {
        return [
            // "my_plugin" ဆိုသည်မှာ ကိုယ်ပိုင် Nav Group
            'my_plugin' => [
                'name' => 'MyPlugin', // Menu ၏ ခေါင်းစဉ်
                'icon' => 'fa-cog',   // Font Awesome icon
                'children' => [
                    // Sub-menu items
                    'config' => [
                        'name' => '設定',          // Settings
                        'url'  => 'my_plugin_admin_config',
                    ],
                    'report' => [
                        'name' => 'レポート',       // Report
                        'url'  => 'my_plugin_admin_report',
                    ],
                ],
            ],
        ];
    }
}
```

---

### အဆင့် 2 - Nav ကို services.yaml တွင် Register ပြုလုပ်ခြင်း

`app/Plugin/MyPlugin/Resource/config/services.yaml`

```yaml
services:
    Plugin\MyPlugin\MyPluginNav:
        tags:
            - { name: eccube.nav, priority: 0 }
```

---

### အဆင့် 3 - Config Controller တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Controller/Admin/ConfigController.php`

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Plugin\MyPlugin\Form\Type\Admin\ConfigType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ConfigController extends AbstractController
{
    /**
     * @Route("/%eccube_admin_route%/my-plugin/config", name="my_plugin_admin_config")
     * @Template("@MyPlugin/admin/config.twig")
     */
    public function index(Request $request): array|RedirectResponse
    {
        // ပထမဦးဆုံး DB မှ ရှိပြီးသား settings ရယူပါ
        $config = $this->entityManager
            ->getRepository(\Eccube\Entity\BaseInfo::class)
            ->get();

        $form = $this->createForm(ConfigType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            
            // Settings ကို သိမ်းဆည်းခြင်း (ဥပမာ: BaseInfo update)
            // $config->setXxx($data['xxx']);
            // $this->entityManager->flush();
            
            $this->addSuccess('設定を保存しました。', 'admin');
            
            return $this->redirectToRoute('my_plugin_admin_config');
        }

        return [
            'form' => $form->createView(),
        ];
    }
}
```

---

### အဆင့် 4 - Config Form Type တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Form/Type/Admin/ConfigType.php`

```php
<?php

namespace Plugin\MyPlugin\Form\Type\Admin;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Text Field
            ->add('api_key', TextType::class, [
                'label'       => 'API Key',
                'required'    => true,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(['max' => 255]),
                ],
                'attr' => [
                    'placeholder' => 'API Keyを入力してください',
                ],
            ])
            // Textarea Field
            ->add('description', TextareaType::class, [
                'label'    => '説明',
                'required' => false,
                'attr'     => ['rows' => 5],
            ])
            // Checkbox Field
            ->add('is_enabled', CheckboxType::class, [
                'label'    => '有効にする',
                'required' => false,
            ])
            // Select / Dropdown Field
            ->add('mode', ChoiceType::class, [
                'label'   => 'モード',
                'choices' => [
                    'テスト'    => 'test',
                    '本番'      => 'production',
                ],
            ]);
    }
}
```

---

### အဆင့် 5 - Config Template တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Resource/template/admin/config.twig`

```twig
{% extends 'admin_layout.twig' %}

{% block title %}MyPlugin 設定{% endblock %}

{% block main %}
<div class="c-contentsArea__cols">
    <div class="c-contentsArea__primaryCol">
        
        {# Breadcrumb #}
        <nav class="ec-adminNaviBar">
            <span class="ec-adminNaviBar__nav">
                <a href="{{ url('admin_homepage') }}">HOME</a>
                <i class="fa fa-angle-right"></i>
                <a href="#">MyPlugin</a>
                <i class="fa fa-angle-right"></i>
                <span>設定</span>
            </span>
        </nav>

        {# Flash Messages #}
        {% for message in app.flashes('admin.success') %}
            <div class="alert alert-success">{{ message }}</div>
        {% endfor %}

        {# Main Content Card #}
        <div class="card rounded border-0 mb-4">
            <div class="card-header">
                <span>MyPlugin 設定</span>
            </div>
            <div class="card-body">
                
                {{ form_start(form, {'attr': {'class': 'form-horizontal'}}) }}
                
                {# API Key Field #}
                <div class="form-group row">
                    {{ form_label(form.api_key, null, {'label_attr': {'class': 'col-sm-3 col-form-label'}}) }}
                    <div class="col-sm-9">
                        {{ form_widget(form.api_key, {'attr': {'class': 'form-control'}}) }}
                        {{ form_errors(form.api_key) }}
                    </div>
                </div>

                {# Description Field #}
                <div class="form-group row">
                    {{ form_label(form.description, null, {'label_attr': {'class': 'col-sm-3 col-form-label'}}) }}
                    <div class="col-sm-9">
                        {{ form_widget(form.description, {'attr': {'class': 'form-control'}}) }}
                    </div>
                </div>

                {# Mode Select #}
                <div class="form-group row">
                    {{ form_label(form.mode, null, {'label_attr': {'class': 'col-sm-3 col-form-label'}}) }}
                    <div class="col-sm-9">
                        {{ form_widget(form.mode, {'attr': {'class': 'form-control'}}) }}
                    </div>
                </div>

                {# Enabled Checkbox #}
                <div class="form-group row">
                    <div class="col-sm-3">有効</div>
                    <div class="col-sm-9">
                        <div class="form-check">
                            {{ form_widget(form.is_enabled) }}
                            {{ form_label(form.is_enabled) }}
                        </div>
                    </div>
                </div>

                {# Submit Button #}
                <div class="form-group row">
                    <div class="col-sm-9 offset-sm-3">
                        <button type="submit" class="btn btn-ec-conversion px-5">
                            保存
                        </button>
                    </div>
                </div>
                
                {{ form_end(form) }}
                
            </div>
        </div>
        
    </div>
</div>
{% endblock %}
```

---

### အဆင့် 6 - Report Page Controller

`app/Plugin/MyPlugin/Controller/Admin/ReportController.php`

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\OrderRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ReportController extends AbstractController
{
    public function __construct(
        private readonly OrderRepository $orderRepository
    ) {}

    /**
     * @Route("/%eccube_admin_route%/my-plugin/report", name="my_plugin_admin_report")
     * @Template("@MyPlugin/admin/report.twig")
     */
    public function index(Request $request): array
    {
        // ယနေ့ Order များ ရယူခြင်း
        $today = new \DateTime('today');
        $todayOrders = $this->orderRepository->createQueryBuilder('o')
            ->where('o.create_date >= :today')
            ->setParameter('today', $today)
            ->orderBy('o.create_date', 'DESC')
            ->getQuery()
            ->getResult();

        // ဤလ Order sum ရယူခြင်း
        $thisMonth = new \DateTime('first day of this month');
        $monthlyTotal = $this->orderRepository->createQueryBuilder('o')
            ->select('SUM(o.payment_total) as total')
            ->where('o.create_date >= :month')
            ->setParameter('month', $thisMonth)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'TodayOrders'  => $todayOrders,
            'MonthlyTotal' => $monthlyTotal ?? 0,
        ];
    }
}
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] `MyPluginNav.php` တွင် `EccubeNav` interface implement ပြုလုပ်ပြီးကြောင်း
- [ ] `services.yaml` တွင် Nav ကို register ပြုလုပ်ပြီးကြောင်း
- [ ] Route name များ unique ဖြစ်ကြောင်း
- [ ] Template ဖိုင်များ မှန်ကန်သော path တွင် ရှိကြောင်း
- [ ] Cache clear ပြုလုပ်ပြီးကြောင်း
- [ ] Admin sidebar တွင် Menu မြင်ရကြောင်း

---

> ➡️ **နောက်တစ်ဆင့်**: [05 - Event & Hook System](/eccube/requirements/customization-list/05_event_hook_system/)
