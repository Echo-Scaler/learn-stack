---
title: "01. Plugin Development"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 01 - Plugin Development (Plugin တည်ဆောက်နည်း)

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube တွင် Plugin (ကိုယ်ပိုင် Extension) တစ်ခု တည်ဆောက်နည်းကို အစမှ အဆုံးထိ ရှင်းပြမည်။

---

## 🎯 ရည်ရွယ်ချက်

Plugin တစ်ခု တည်ဆောက်ကာ EC-Cube system ကို မထိဘဲ features ထပ်ဆောင်းတတ်ရန်။

---

## 📁 Plugin Directory Structure

```
app/Plugin/MyPlugin/
├── Controller/
│   └── Admin/
│       └── ConfigController.php
├── Entity/
├── Form/
│   └── Type/
│       └── Admin/
│           └── ConfigType.php
├── Repository/
├── Resource/
│   ├── locale/
│   │   └── messages.ja.yaml
│   └── template/
│       └── admin/
│           └── config.twig
├── Service/
├── MyPluginEvent.php
└── PluginManager.php
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Plugin Folder တည်ဆောက်ခြင်း

```bash
mkdir -p app/Plugin/MyPlugin/Controller/Admin
mkdir -p app/Plugin/MyPlugin/Resource/template/admin
mkdir -p app/Plugin/MyPlugin/Resource/locale
mkdir -p app/Plugin/MyPlugin/Form/Type/Admin
mkdir -p app/Plugin/MyPlugin/Service
```

---

### အဆင့် 2 - composer.json ဖိုင် တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/composer.json`

```json
{
    "name": "my-vendor/my-plugin",
    "version": "1.0.0",
    "description": "My Custom Plugin for EC-Cube",
    "type": "eccube-plugin",
    "require": {
        "ec-cube/plugin-installer": "*"
    },
    "extra": {
        "code": "MyPlugin"
    }
}
```

> ⚠️ `"code"` တန်ဖိုးသည် folder name နှင့် တူညီရမည်။

---

### အဆင့် 3 - PluginManager.php တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/PluginManager.php`

```php
<?php

namespace Plugin\MyPlugin;

use Eccube\Plugin\AbstractPluginManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PluginManager extends AbstractPluginManager
{
    /**
     * Plugin ထည့်သွင်းသောအခါ ခေါ်မည်
     */
    public function install(array $meta, ContainerInterface $container): void
    {
        // ဒေတာဘေ့စ် table တည်ဆောက်ခြင်း စသည် ပြုလုပ်နိုင်သည်
        log_info('[MyPlugin] Plugin installed!');
    }

    /**
     * Plugin ဖွင့်သောအခါ ခေါ်မည်
     */
    public function enable(array $meta, ContainerInterface $container): void
    {
        log_info('[MyPlugin] Plugin enabled!');
    }

    /**
     * Plugin ပိတ်သောအခါ ခေါ်မည်
     */
    public function disable(array $meta, ContainerInterface $container): void
    {
        log_info('[MyPlugin] Plugin disabled!');
    }

    /**
     * Plugin ဖျက်သောအခါ ခေါ်မည်
     */
    public function uninstall(array $meta, ContainerInterface $container): void
    {
        log_info('[MyPlugin] Plugin uninstalled!');
    }
}
```

---

### အဆင့် 4 - Event Subscriber တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/MyPluginEvent.php`

```php
<?php

namespace Plugin\MyPlugin;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Eccube\Event\TemplateEvent;

class MyPluginEvent implements EventSubscriberInterface
{
    /**
     * ဤ Plugin တွင် subscribe လုပ်မည့် Events များ
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // Product Detail Page ကို ပြောင်းလဲချင်လျှင်
            'Product/detail.twig' => 'onProductDetail',
        ];
    }

    /**
     * Product detail page render ဖြစ်သောအခါ ဤ method ကို ခေါ်မည်
     */
    public function onProductDetail(TemplateEvent $event): void
    {
        // Page တွင် ကိုယ်ပိုင် snippet ထည့်ခြင်း
        $event->addSnippet('@MyPlugin/mysnippet.twig');
    }
}
```

---

### အဆင့် 5 - Admin Config Controller တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Controller/Admin/ConfigController.php`

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Plugin\MyPlugin\Form\Type\Admin\ConfigType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ConfigController extends AbstractController
{
    /**
     * @Route("/%eccube_admin_route%/my-plugin/config", name="my_plugin_admin_config")
     * @Template("@MyPlugin/admin/config.twig")
     */
    public function index(Request $request): array
    {
        $form = $this->createForm(ConfigType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->addSuccess('保存しました。', 'admin'); // သိမ်းဆည်းမှု အောင်မြင်သည်
        }

        return [
            'form' => $form->createView(),
        ];
    }
}
```

---

### အဆင့် 6 - Plugin ကို EC-Cube တွင် ထည့်သွင်းခြင်း

**Command Line မှ**:
```bash
# Plugin ကို install လုပ်ခြင်း
bin/console eccube:plugin:install --code=MyPlugin

# Plugin ကို enable လုပ်ခြင်း  
bin/console eccube:plugin:enable --code=MyPlugin

# Cache ကို ရှင်းလင်းခြင်း
bin/console cache:clear --env=prod
```

**Admin Panel မှ**:
1. Admin → オーナーズストア → プラグイン (Plugin) သို့ သွားပါ
2. "インストール済みプラグイン" တွင် MyPlugin ကို ရှာပါ
3. "有効にする" ကို နှိပ်ပါ

---

## ✅ စစ်ဆေးမှုများ

- [ ] `composer.json` ရှိ `code` တန်ဖိုး မှန်ကန်ကြောင်း
- [ ] `PluginManager.php` namespace မှန်ကန်ကြောင်း
- [ ] Cache clear ပြုလုပ်ပြီးကြောင်း
- [ ] Admin Panel တွင် Plugin မြင်ရကြောင်း

---

## 🐛 ဖြစ်လေ့ရှိသော ပြဿနာများ

| ပြဿနာ | ဖြေရှင်းနည်း |
|--------|-------------|
| Plugin မမြင်ရပါ | `bin/console cache:clear` ပြန်လုပ်ပါ |
| Namespace error | Folder name နှင့် `composer.json` ရှိ `code` ကို ညှိပါ |
| Class not found | `composer dump-autoload` ပြုလုပ်ပါ |

---

> ➡️ **နောက်တစ်ဆင့်**: [02 - Template Customization](/eccube/requirements/customization-list/02_template_customization/)
