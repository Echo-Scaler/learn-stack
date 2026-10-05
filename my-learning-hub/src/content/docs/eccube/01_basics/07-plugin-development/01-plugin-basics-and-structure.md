---
title: "01. Plugin Basics And Structure"
description: "EC-CUBE တွင် Feature အသစ်တစ်ခုကို အခြား EC-CUBE Website များတွင်ပါ အလွယ်တကူ ပြန်လည်အသုံးပြုနိုင်ရန် (Reusable Package) သို့မဟုတ် EC-CUBE Owners Store တွင် ရောင်"
---

## Module 07 - အခန်း ၁: Plugin အခြေခံသဘောတရားနှင့် ဖွဲ့စည်းပုံ (Plugin Architecture)

EC-CUBE တွင် Feature အသစ်တစ်ခုကို အခြား EC-CUBE Website များတွင်ပါ အလွယ်တကူ ပြန်လည်အသုံးပြုနိုင်ရန် (Reusable Package) သို့မဟုတ် EC-CUBE Owners Store တွင် ရောင်းချဖြန့်ချိနိုင်ရန်အတွက် **Plugin** အဖြစ် ရေးသားကြပါသည်။

---

## ၁။ `app/Customize` နှင့် `app/Plugin` ကွာခြားချက်

| အချက်အလက် | `app/Customize` | `app/Plugin` |
| :--- | :--- | :--- |
| **ရည်ရွယ်ချက်** | လက်ရှိ Website တစ်ခုတည်းအတွက် သီးသန့် Logic ရေးရန် | အခြား Website များတွင်ပါ ဖြန့်ဝေ တပ်ဆင်အသုံးပြုနိုင်ရန် |
| **ဖွဲ့စည်းပုံ** | Site တစ်ခုလုံးနှင့် ရောနှောနေသည် | Folder သီးသန့်ဖြင့် Package အဖြစ် သီးခြားရပ်တည်သည် |
| **ဖွင့်/ပိတ် စနစ်** | Enable / Disable ပြုလုပ်၍ မရပါ | Admin မှ ဖွင့်ခြင်း (Enable)၊ ပိတ်ခြင်း (Disable) လုပ်နိုင်သည် |
| **တပ်ဆင်ခြင်း** | Code တိုက်ရိုက် ရေးသားခြင်း | Zip ဖိုင် Upload တင်၍ တပ်ဆင်နိုင်သည် |

---

## ၂။ Plugin Directory Structure (ဖိုင်တွဲ ဖွဲ့စည်းပုံ)

Plugin တစ်ခုသည် `app/Plugin/<PluginCode>/` အောက်တွင် အောက်ပါအတိုင်း တည်ရှိပါသည်:

```text
app/Plugin/TopNoticeBanner/
├── composer.json                  # ★ Plugin ၏ အချက်အလက်၊ Code Name၊ Version နှင့် Autoload
├── PluginManager.php              # ★ Plugin Lifecycle (Install, Enable, Disable, Uninstall)
├── Controller/
│   └── Admin/
│       └── ConfigController.php   # Admin တွင် Plugin Settings ပြင်ဆင်ရန် Controller
├── Entity/
│   └── Config.php                 # Plugin ဆိုင်ရာ Data သိမ်းဆည်းမည့် Entity
├── Form/Type/
│   └── Admin/
│       └── ConfigType.php         # Admin Config Form Type
├── Nav.php                        # Admin Sidebar Menu တွင် Menu အသစ် ထည့်သွင်းခြင်း
├── Event.php                      # Event Hook Points များ
└── Resource/
    ├── template/
    │   ├── admin/
    │   │   └── config.twig        # Admin Settings စာမျက်နှာ Twig
    │   └── default/
    │       └── banner_hook.twig   # User မျက်နှာစာတွင် ပြသမည့် Twig
    └── assets/                    # Plugin သုံး CSS / JS / Images
```

---

## ၃။ Plugin ရေးသားရာတွင် မဖြစ်မနေ လိုအပ်သော ဖိုင် (၂) ခု

### က။ `composer.json` (Plugin Metadata)
Plugin ၏ အမည်၊ ကုဒ်အမည် (Code)၊ ဗားရှင်းနှင့် Namespace များကို ကြေညာသည့် ဖိုင်ဖြစ်ပါသည်:

```json
{
  "name": "ec-cube/top-notice-banner",
  "version": "1.0.0",
  "description": "Storefront ထိပ်ဆုံးတွင် အသိပေးစာသား Banner ပြသပေးသော Plugin",
  "type": "eccube-plugin",
  "require": {
    "ec-cube/plugin-installer": "~0.0.7 || ~0.1.0"
  },
  "extra": {
    "code": "TopNoticeBanner"
  },
  "autoload": {
    "psr-4": {
      "Plugin\\TopNoticeBanner\\": ""
    }
  }
}
```

> ⚠️ **သတိပြုရန်**: `"extra" -> "code"` ရှိ တန်ဖိုး (ဥပမာ: `TopNoticeBanner`) သည် Folder အမည်၊ Namespace နှင့် တစ်ထေရာတည်း တူညီရပါမည်။

---

### ခ။ `PluginManager.php` (Lifecycle Management)
Plugin ကို Install / Enable / Disable / Uninstall ပြုလုပ်ချိန်များတွင် Database Table ဆောက်ခြင်း သို့မဟုတ် ဖျက်ခြင်းများကို စီမံသည့် Class ဖြစ်ပါသည်:

```php
<?php

namespace Plugin\TopNoticeBanner;

use Eccube\Plugin\AbstractPluginManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PluginManager extends AbstractPluginManager
{
    /**
     * Plugin ကို Install လုပ်ချိန်တွင် အလုပ်လုပ်သည်
     */
    public function install(array $meta, ContainerInterface $container)
    {
        // ဥပမာ- Default Config Data ထည့်သွင်းခြင်း
    }

    /**
     * Plugin ကို Enable (ဖွင့်) သည့်အခါ အလုပ်လုပ်သည်
     */
    public function enable(array $meta, ContainerInterface $container)
    {
    }

    /**
     * Plugin ကို Disable (ပိတ်) သည့်အခါ အလုပ်လုပ်သည်
     */
    public function disable(array $meta, ContainerInterface $container)
    {
    }

    /**
     * Plugin ကို Uninstall လုပ်သည့်အခါ အလုပ်လုပ်သည် (Table ဖျက်ခြင်း စသည်)
     */
    public function uninstall(array $meta, ContainerInterface $container)
    {
    }
}
```

---

## ၄။ Plugin စီမံခန့်ခွဲသည့် CLI Commands များ

```bash
# Plugin အားလုံး၏ စာရင်းကို ကြည့်ရှုခြင်း
bin/console eccube:plugin:list

# Plugin အသစ် Generate လုပ်ခြင်း
bin/console eccube:plugin:generate

# Plugin ကို Command Line ဖြင့် Enable ပြုလုပ်ခြင်း
bin/console eccube:plugin:enable --code=TopNoticeBanner

# Plugin ကို Command Line ဖြင့် Disable ပြုလုပ်ခြင်း
bin/console eccube:plugin:disable --code=TopNoticeBanner
```

---

နောက်အခန်းတွင် **[Module 07 - အခန်း ၂: လက်တွေ့ Announcement Banner Plugin တစ်ခု အစအဆုံး တည်ဆောက်ခြင်း](/eccube/01_basics/07-plugin-development/02-hands-on-banner-plugin/)** ကို ဆက်လက်လေ့လာပါမည်။
