---
title: "02 - Template (Twig) Customization"
description: "> အဆင့်: Beginner | EC-Cube Version: 4.2+"
---

## 02 - Template (Twig) Customization

> **အဆင့်**: Beginner | **EC-Cube Version**: 4.2+

EC-Cube တွင် Twig template ကို မသင့်မကြေ မပြောင်းဘဲ Override / Customize လုပ်နည်း။

---

## 🎯 ရည်ရွယ်ချက်

Core ဖိုင်များကို မထိဘဲ `app/template/` folder ကို အသုံးပြု၍ page design များကို ပြောင်းလဲတတ်ရန်။

---

## 📌 အရေးကြီးသော အချက် - Template Override Priority

EC-Cube က template ကို ရှာသည့် အစဉ်:

```
1. app/template/{theme_name}/        ← ဦးစွာ ဤနေရာကို ရှာမည်
2. src/Eccube/Resource/template/     ← မတွေ့ပါက default ကို သုံးမည်
```

> 💡 `app/template/` တွင် ဖိုင်တစ်ခု ထားရုံဖြင့် Core ဖိုင်ကို Override ပြုလုပ်နိုင်သည်

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Theme Folder ကို သတ်မှတ်ခြင်း

```bash
# ပုံမှန် theme folder
ls app/template/
# default  →  ဤဖိုဒါ မရှိပါက တည်ဆောက်ပါ
mkdir -p app/template/default
```

---

### အဆင့် 2 - Override ပြုလုပ်မည့် Template ကို ကူးယူခြင်း

**ဥပမာ**: Product Detail Page ကို ပြောင်းချင်ပါက

```bash
# Core template ၏ တည်နေရာ
# src/Eccube/Resource/template/default/Product/detail.twig

# app/template/ တွင် တူညီသော Path ဖြင့် ဖိုင် ကူးယူပါ
cp src/Eccube/Resource/template/default/Product/detail.twig \
   app/template/default/Product/detail.twig
```

---

### အဆင့် 3 - Template ကို ပြင်ဆင်ခြင်း

`app/template/default/Product/detail.twig` ဖွင့်ပြီး Edit လုပ်ပါ။

**ဥပမာ - Product title အောက်တွင် badge ထည့်ခြင်း**:

```twig
{# မူလ code #}
<h1 class="ec-headingTitle">{{ Product.name }}</h1>

{# ပြင်ဆင်ပြီးနောက် - Badge ထည့်ထားသည် #}
<h1 class="ec-headingTitle">{{ Product.name }}</h1>

{% if Product.free_area %}
    <span class="badge badge-special">✨ Special Item</span>
{% endif %}
```

---

### အဆင့် 4 - Plugin ထဲမှ Template Override

Plugin ထဲတွင် Template Override ပြုလုပ်လျှင်:

**Plugin Event Subscriber တွင်**:

```php
// Event ကို အသုံးပြု၍ Template snippet ထည့်ခြင်း
public static function getSubscribedEvents(): array
{
    return [
        'Product/detail.twig' => 'onProductDetail',
        'index.twig' => 'onFrontTop',
    ];
}

public function onProductDetail(TemplateEvent $event): void
{
    // ကိုယ်ပိုင် snippet template ထည့်ပါ
    $event->addSnippet('@MyPlugin/Product/detail_custom.twig');
    
    // ဒေတာ ပါ ပို့ချင်လျှင်
    $parameters = $event->getParameters();
    $parameters['customData'] = 'Hello from Plugin!';
    $event->setParameters($parameters);
}
```

**Plugin Template** (`app/Plugin/MyPlugin/Resource/template/Product/detail_custom.twig`):

```twig
{# ဤ snippet ကို product detail page ၏ အောက်ဆုံးတွင် ထည့်မည် #}
<div class="my-plugin-section">
    <h3>Plugin မှ ထည့်သော Section</h3>
    <p>{{ customData }}</p>
</div>
```

---

### အဆင့် 5 - Twig Block ကို Extend ပြုလုပ်ခြင်း

```twig
{# app/template/default/Product/detail.twig #}

{# မူလ template ကို extend ပြုလုပ်၍ block တစ်ခုကိုသာ ပြောင်းခြင်း #}
{% extends 'Product/detail.twig' %}

{% block main %}
    {# မူလ content ကို ထိန်းသိမ်းလျက် ပိုမိုသော content ထည့်ခြင်း #}
    {{ parent() }}
    
    <div class="extra-content">
        <p>ဤ content ကို plugin မှ ထည့်သည်</p>
    </div>
{% endblock %}
```

---

### အဆင့် 6 - Custom CSS ထည့်သွင်းခြင်း

```twig
{# app/template/default/Block/custom_css.twig - CSS Block #}

{% block stylesheet %}
    {{ parent() }}
    <style>
        .my-plugin-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .badge-special {
            background-color: #ff6b6b;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
        }
    </style>
{% endblock %}
```

---

## 🗂 အဓိက Template Files တည်နေရာများ

| Page | Template Path |
|------|--------------|
| Home (Top) | `default/index.twig` |
| Product List | `default/Product/list.twig` |
| Product Detail | `default/Product/detail.twig` |
| Cart | `default/Cart/index.twig` |
| Shopping | `default/Shopping/index.twig` |
| My Page | `default/Mypage/index.twig` |
| Login | `default/Security/login.twig` |
| Admin Dashboard | `admin/index.twig` |

---

## 🔧 Twig အသုံးဝင်သော Functions

```twig
{# Asset (CSS/JS/Image) path ရယူခြင်း #}
{{ asset('assets/img/common/logo.png') }}

{# Route URL ရယူခြင်း #}
{{ url('product_list') }}
{{ path('homepage') }}

{# Translation #}
{{ 'common.submit'|trans }}

{# Price Format #}
{{ Product.price01_inc_tax|price }}

{# Date Format #}
{{ Order.create_date|date('Y/m/d') }}

{# Loop #}
{% for Product in Products %}
    <p>{{ Product.name }}</p>
{% endfor %}

{# Condition #}
{% if is_granted('ROLE_USER') %}
    <p>Login ပြုလုပ်ပြီးသော User</p>
{% endif %}
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] `app/template/default/` တွင် template ဖိုင် ရှိကြောင်း
- [ ] Twig syntax error မရှိကြောင်း
- [ ] Cache ကို clear ပြုလုပ်ပြီးကြောင်း
- [ ] Browser တွင် ပြောင်းလဲမှုများ မြင်ရကြောင်း

---

## ⚡ Cache Clear Command

```bash
bin/console cache:clear --env=prod
# သို့မဟုတ်
bin/console cache:clear
```

---

> ➡️ **နောက်တစ်ဆင့်**: [03 - Entity & Repository](/eccube/customization-list/03_entity_repository/)
