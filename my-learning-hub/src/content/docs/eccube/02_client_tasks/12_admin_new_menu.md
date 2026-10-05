---
title: "12. Admin New Menu"
description: "> 「管理画面の左側サイドナビバーに『オリジナル設定』という新しい親メニュー（または商品管理配下に『特設セール管理』という子メニュー）を追加し、クリックすると独自に開発した管理画面ページが開くようにしてください。」"
---

## Task 12: 管理画面に新しいメニューを追加してください (New Admin Page & Menu)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面の左側サイドナビバーに『オリジナル設定』という新しい親メニュー（または商品管理配下に『特設セール管理』という子メニュー）を追加し、クリックすると独自に開発した管理画面ページが開くようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
EC-CUBE ၏ Admin Sidebar (ဘယ်ဘက် Menu Bar) တွင် **Admin Menu အသစ်** ထည့်သွင်းပေးပြီး၊ ၎င်းကို နှိပ်လိုက်ပါက မိမိတို့ ဖန်တီးထားသော Custom Admin Page ပွင့်လာစေရန် Routing, Controller, Template နှင့် Permission များကို ချိတ်ဆက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. `eccube_nav.yaml` ဖြင့် Menu Register ပြုလုပ်ရသည့် အကြောင်းပြချက်
- EC-CUBE သည် Admin Sidebar ကို Database ထဲတွင် မသိမ်းဆည်းဘဲ YAML Config (`eccube_nav.yaml`) မှတစ်ဆင့် Dynamic Generate ပြုလုပ်ပါသည်။
- ဤဖိုင်တွင် Route Name, Icon, Parent-Child Hierarchy ကို သတ်မှတ်ရုံဖြင့် Core ဖိုင်များကို ထိခိုက်ခြင်းမရှိဘဲ Sidebar တွင် လှပစွာ ပေါ်လာမည်ဖြစ်သည်။

### 2. `@Route("/%eccube_admin_route%/...")` နှင့် Security Permission
- EC-CUBE ၏ Admin URL သည် Security အရ ပြောင်းလဲနိုင်သည် (ဥပမာ - `/admin` မှ `/secret_admin` သို့ `.env` မှတစ်ဆင့် ပြောင်းလဲခြင်း)။
- ထို့ကြောင့် Route ရေးသားရာတွင် `/%eccube_admin_route%/` parameter ကို အသုံးပြုရပြီး `@IsGranted("ROLE_ADMIN")` ဖြင့် လုံခြုံရေး သတ်မှတ်ရပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Admin Menu Configuration ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Resource/config/eccube_nav.yaml` (သို့မဟုတ် Plugin ၏ nav.yaml)

```yaml
eccube_nav:
  custom_management:
    name: '特設管理'
    icon: 'fa-star'
    children:
      special_sale:
        name: '特設セール管理'
        url: 'admin_special_sale'
```

---

### အဆင့် ၂: Admin Controller ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/Admin/SpecialSaleController.php`

```php
<?php

namespace Customize\Controller\Admin;

use Eccube\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/%eccube_admin_route%/special/sale")
 * @IsGranted("ROLE_ADMIN")
 */
class SpecialSaleController extends AbstractController
{
    /**
     * @Route("", name="admin_special_sale", methods={"GET"})
     */
    public function index(Request $request): Response
    {
        return $this->render('@Customize/admin/special_sale/index.twig', [
            'page_title' => '特設セール管理',
            'server_time' => new \DateTime(),
        ]);
    }
}
```

---

### အဆင့် ၃: Admin Twig Template ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Resource/template/admin/special_sale/index.twig`

```twig
{# 管理画面の標準レイアウトを継承 #}
{% extends '@admin/default_frame.twig' %}

{% set menus = ['custom_management', 'special_sale'] %}

{% block title %}{{ page_title }}{% endblock %}
{% block sub_title %}特設セール設定{% endblock %}

{% block main %}
    <div class="c-contentsArea__cols">
        <div class="c-contentsArea__primaryCol">
            <div class="c-primaryCol">
                <div class="card rounded border-0 mb-4">
                    <div class="card-header">
                        <span class="font-weight-bold">特設セール一覧・設定</span>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">ここに特設セールの設定内容や登録フォームを実装します。</p>
                        <div class="alert alert-info">
                            現在のサーバー時刻: {{ server_time|date('Y-m-d H:i:s') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{% endblock %}
```

---

### အဆင့် ၄: Cache ရှင်းလင်းပြီး စမ်းသပ်ခြင်း
Terminal တွင် အောက်ပါ command ကို run ပါ:
```bash
bin/console cache:clear --no-warmup
```
ထို့နောက် Admin Panel သို့ ဝင်ရောက်ကြည့်ပါက Sidebar တွင် "特設管理" menu အသစ် ပေါ်လာသည်ကို တွေ့မြင်ရပါမည်။

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Active State သတ်မှတ်ရန် `{% set menus = [...] %}`:**  
   Twig ၏ ထိပ်ဆုံးတွင် `{% set menus = ['custom_management', 'special_sale'] %}` ဟု ရေးသားပေးရပါမည်။ သို့မှသာ Admin Page ပွင့်နေချိန်တွင် ဘယ်ဘက် Sidebar ရှိ Menu သည် Active (Highlighted/Expanded) ဖြစ်နေမည် ဖြစ်သည်။
2. **Authority / Permission (権限管理):**  
   Admin User များတွင် Role ကွဲပြားနိုင်သည် (Super Admin vs Member Admin)။ သီးသန့် Admin ကိုသာ ကြည့်ရှုခွင့်ပေးလိုပါက Security Voter သို့မဟုတ် Role စစ်ဆေးမှု ထည့်သွင်းပေးရပါမည်။
