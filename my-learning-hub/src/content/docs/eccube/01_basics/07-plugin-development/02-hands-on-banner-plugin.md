---
title: "02. Hands On Banner Plugin"
description: "ဤလက်တွေ့ခန်းတွင် စတိုးဆိုင်၏ ထိပ်ဆုံးတွင် အရေးကြီးကြေညာချက် စာသား (ဥပမာ: အခမဲ့ ပို့ဆောင်ပေးနေပါသည်, ရုံးပိတ်ရက် ကြေညာချက်) ကို Admin မှ စိတ်ကြိုက် ပြင်ဆင်ပြ"
---

## Module 07 - အခန်း ၂: လက်တွေ့ Top Announcement Banner Plugin တည်ဆောက်ခြင်း (Hands-on Tutorial)

ဤလက်တွေ့ခန်းတွင် စတိုးဆိုင်၏ ထိပ်ဆုံးတွင် အရေးကြီးကြေညာချက် စာသား (ဥပမာ: "အခမဲ့ ပို့ဆောင်ပေးနေပါသည်", "ရုံးပိတ်ရက် ကြေညာချက်") ကို Admin မှ စိတ်ကြိုက် ပြင်ဆင်ပြသပေးနိုင်သော **TopNoticeBanner Plugin** တစ်ခုကို အစအဆုံး ရေးသားတည်ဆောက်ပါမည်။

---

## ၁။ Plugin ဖိုင်တွဲများ တည်ဆောက်ခြင်း (Directory Creation)

Project Root မှနေ၍ အောက်ပါ Folder များကို ဖန်တီးပါ-

```bash
mkdir -p app/Plugin/TopNoticeBanner/Controller/Admin
mkdir -p app/Plugin/TopNoticeBanner/Entity
mkdir -p app/Plugin/TopNoticeBanner/Repository
mkdir -p app/Plugin/TopNoticeBanner/Form/Type/Admin
mkdir -p app/Plugin/TopNoticeBanner/Resource/template/admin
mkdir -p app/Plugin/TopNoticeBanner/Resource/template/default
```

---

## ၂။ အဆင့် ၁: `composer.json` ရေးသားခြင်း

`app/Plugin/TopNoticeBanner/composer.json` ကို ဖန်တီးပါ:

```json
{
  "name": "ec-cube/top-notice-banner",
  "version": "1.0.0",
  "description": "Storefront ထိပ်ဆုံးတွင် ကြေညာချက် Banner ပြသပေးသော Plugin",
  "type": "eccube-plugin",
  "require": {
    "ec-cube/plugin-installer": "~0.0.7 || ~0.1.0"
  },
  "extra": {
    "code": "TopNoticeBanner",
    "name": "Top Notice Banner Plugin"
  },
  "autoload": {
    "psr-4": {
      "Plugin\\TopNoticeBanner\\": ""
    }
  }
}
```

---

## ၃။ အဆင့် ၂: `Entity/Config.php` (Database Entity တည်ဆောက်ခြင်း)

Banner စာသား၊ Background အရောင်နှင့် Enable/Disable အခြေအနေကို သိမ်းဆည်းရန် Entity ရေးသားပါမည်။

`app/Plugin/TopNoticeBanner/Entity/Config.php`:

```php
<?php

namespace Plugin\TopNoticeBanner\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="plg_top_notice_banner_config")
 * @ORM\Entity(repositoryClass="Plugin\TopNoticeBanner\Repository\ConfigRepository")
 */
class Config
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(name="id", type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="message", type="string", length=255)
     */
    private $message = '🎉 ကျွန်ုပ်တို့ဆိုင်မှ ကြိုဆိုပါသည်! ယခုပိတ်ရက်တွင် ပို့ခအခမဲ့ ပို့ဆောင်ပေးနေပါသည်။';

    /**
     * @ORM\Column(name="bg_color", type="string", length=50)
     */
    private $bg_color = '#ff4757';

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $is_active = true;

    public function getId(): ?int { return $this->id; }
    public function getMessage(): ?string { return $this->message; }
    public function setMessage(string $message): self { $this->message = $message; return $this; }
    public function getBgColor(): ?string { return $this->bg_color; }
    public function setBgColor(string $bg_color): self { $this->bg_color = $bg_color; return $this; }
    public function isIsActive(): ?bool { return $this->is_active; }
    public function setIsActive(bool $is_active): self { $this->is_active = $is_active; return $this; }
}
```

---

## ၄။ အဆင့် ၃: `Repository/ConfigRepository.php` ဖန်တီးခြင်း

`app/Plugin/TopNoticeBanner/Repository/ConfigRepository.php`:

```php
<?php

namespace Plugin\TopNoticeBanner\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Plugin\TopNoticeBanner\Entity\Config;

class ConfigRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Config::class);
    }

    public function get(): Config
    {
        $config = $this->find(1);
        if (!$config) {
            $config = new Config();
        }
        return $config;
    }
}
```

---

## ၅။ အဆင့် ၄: `PluginManager.php` (Install/Uninstall Logic)

`app/Plugin/TopNoticeBanner/PluginManager.php`:

```php
<?php

namespace Plugin\TopNoticeBanner;

use Eccube\Plugin\AbstractPluginManager;
use Plugin\TopNoticeBanner\Entity\Config;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PluginManager extends AbstractPluginManager
{
    public function install(array $meta, ContainerInterface $container)
    {
        $em = $container->get('doctrine.orm.entity_manager');
        $config = $em->getRepository(Config::class)->find(1);
        if (!$config) {
            $config = new Config();
            $em->persist($config);
            $em->flush();
        }
    }
}
```

---

## ၆။ အဆင့် ၅: Admin Config Form & Controller

### Form Type: `app/Plugin/TopNoticeBanner/Form/Type/Admin/ConfigType.php`
```php
<?php

namespace Plugin\TopNoticeBanner\Form\Type\Admin;

use Plugin\TopNoticeBanner\Entity\Config;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('message', TextType::class, [
                'label' => 'ကြေညာချက် စာသား (Notice Message)',
                'required' => true,
                'constraints' => [new Assert\NotBlank()],
            ])
            ->add('bg_color', ChoiceType::class, [
                'label' => 'Background အရောင်',
                'choices' => [
                    'အနီရောင် (Red)' => '#ff4757',
                    'အပြာရောင် (Blue)' => '#2ed573',
                    'အနက်ရောင် (Dark)' => '#2f3542',
                    'လိမ္မော်ရောင် (Orange)' => '#ffa502',
                ],
            ])
            ->add('is_active', CheckboxType::class, [
                'label' => 'Banner ပြသမည် (Active)',
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(['data_class' => Config::class]);
    }
}
```

### Admin Controller: `app/Plugin/TopNoticeBanner/Controller/Admin/ConfigController.php`
```php
<?php

namespace Plugin\TopNoticeBanner\Controller\Admin;

use Eccube\Controller\AbstractController;
use Plugin\TopNoticeBanner\Form\Type\Admin\ConfigType;
use Plugin\TopNoticeBanner\Repository\ConfigRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ConfigController extends AbstractController
{
    /**
     * @Route("/%eccube_admin_route%/top_notice_banner/config", name="top_notice_banner_admin_config")
     */
    public function index(Request $request, ConfigRepository $configRepository): Response
    {
        $config = $configRepository->get();
        $form = $this->createForm(ConfigType::class, $config);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->entityManager->persist($config);
            $this->entityManager->flush();

            $this->addFlash('eccube.admin.success', 'Plugin Settings များကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။');
            return $this->redirectToRoute('top_notice_banner_admin_config');
        }

        return $this->render('@TopNoticeBanner/admin/config.twig', [
            'form' => $form->createView(),
        ]);
    }
}
```

### Admin Twig: `app/Plugin/TopNoticeBanner/Resource/template/admin/config.twig`
```twig
{% extends '@admin/default_frame.twig' %}

{% set menus = ['store', 'plugin', 'plugin_list'] %}

{% block title %}Top Notice Banner Settings{% endblock %}
{% block sub_title %}Plugin Settings{% endblock %}

{% block main %}
<form role="form" method="post">
    {{ form_widget(form._token) }}
    <div class="c-contentsArea__cols">
        <div class="c-contentsArea__primaryCol">
            <div class="c-primaryCol">
                <div class="card rounded border-0 mb-4">
                    <div class="card-header"><h5 class="mb-0">Banner ပြင်ဆင်ရန် အချက်အလက်များ</h5></div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-3"><span>{{ form_label(form.message) }}</span></div>
                            <div class="col mb-2">
                                {{ form_widget(form.message, {'attr': {'class': 'form-control'}}) }}
                                {{ form_errors(form.message) }}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-3"><span>{{ form_label(form.bg_color) }}</span></div>
                            <div class="col mb-2">{{ form_widget(form.bg_color, {'attr': {'class': 'form-select'}}) }}</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-3"><span>{{ form_label(form.is_active) }}</span></div>
                            <div class="col mb-2">{{ form_widget(form.is_active) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="c-conversionArea">
        <div class="c-conversionArea__container text-end">
            <button class="btn btn-ec-conversion px-5" type="submit">သိမ်းဆည်းမည်</button>
        </div>
    </div>
</form>
{% endblock %}
```

---

## ၇။ အဆင့် ၆: Frontend Hook Event ဖြင့် Banner ထုတ်ပြခြင်း

`app/Plugin/TopNoticeBanner/Event.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Plugin\TopNoticeBanner;

use Eccube\Event\TemplateEvent;
use Plugin\TopNoticeBanner\Repository\ConfigRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class Event implements EventSubscriberInterface
{
    private $configRepository;

    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Storefront Template အားလုံးတွင် အပေါ်ဆုံး၌ Render လုပ်စေခြင်း
            'default_frame.twig' => 'onRenderFrame',
        ];
    }

    public function onRenderFrame(TemplateEvent $event): void
    {
        $config = $this->configRepository->get();
        if ($config && $config->isIsActive()) {
            // Header မစတင်မီ Banner HTML Snippet ကို Inject လုပ်ခြင်း
            $snippet = sprintf(
                '<div style="background-color: %s; color: #fff; text-align: center; padding: 10px 15px; font-weight: bold; font-size: 14px;">%s</div>',
                htmlspecialchars($config->getBgColor()),
                htmlspecialchars($config->getMessage())
            );

            $source = $event->getSource();
            $source = str_replace('<div class="ec-layoutRole">', $snippet . '<div class="ec-layoutRole">', $source);
            $event->setSource($source);
        }
    }
}
```

---

## ၈။ အဆင့် ၇: Plugin ကို Install & Enable ပြုလုပ်ခြင်း

Terminal မှ အောက်ပါ command များကို အစဉ်လိုက် Run ပါ:

```bash
# 1. Database Schema Update လုပ်ပါ
bin/console doctrine:schema:update --force

# 2. Plugin ကို Install ပြုလုပ်ပါ
bin/console eccube:plugin:install --code=TopNoticeBanner

# 3. Plugin ကို Enable ပြုလုပ်ပါ
bin/console eccube:plugin:enable --code=TopNoticeBanner

# 4. Cache ကို ရှင်းထုတ်ပါ
bin/console cache:clear
```

### စမ်းသပ်ခြင်း:
- Admin Dashboard -> **オーナーズストア -> プラグイン一覧** သို့သွားပြီး Settings ခလုတ်ကို နှိပ်ကာ စာသားနှင့် အရောင် ပြောင်းလဲ သိမ်းဆည်းပါ။
- Storefront (Homepage) သို့ သွားရောက်ကြည့်ရှုပါက စာမျက်နှာထိပ်ဆုံးတွင် လှပသော Banner အသိပေးစာသား ပေါ်နေသည်ကို တွေ့မြင်ရပါမည်! 🎉

---

နောက်အခန်းတွင် **[Module 08: Payment, Shipping နှင့် Mail Notification စီမံခန့်ခွဲမှု](/eccube/01_basics/08-payment-shipping-and-mail/01-payment-shipping-mail-setup/)** ကို ဆက်လက်လေ့လာပါမည်။
