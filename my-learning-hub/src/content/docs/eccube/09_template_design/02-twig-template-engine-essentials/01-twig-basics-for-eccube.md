---
title: "01. Twig Basics For Eccube"
description: "Twig သည် Symfony Framework တွင် အသုံးပြုသော ခေတ်မီပြီး မြန်ဆန်လုံခြုံသည့် PHP Template Engine ဖြစ်ပါသည်။ EC-CUBE 4.x တွင် Frontend UI အားလုံးကို Twig ဖြင့် ရေးသ"
---

## Module 02: Twig Template Engine Essentials (EC-CUBE အတွက် Twig အခြေခံများ)

---

## ၁။ Twig Template Engine ဆိုတာဘာလဲ?

**Twig** သည် Symfony Framework တွင် အသုံးပြုသော ခေတ်မီပြီး မြန်ဆန်လုံခြုံသည့် PHP Template Engine ဖြစ်ပါသည်။ EC-CUBE 4.x တွင် Frontend UI အားလုံးကို Twig ဖြင့် ရေးသားထားပါသည်။

### Twig အသုံးပြုရခြင်း၏ အကျိုးကျေးဇူးများ
1. **Readable & Clean Syntax**: PHP code များနှင့် HTML ရှုပ်ထွေးစွာ ရောနှောမနေဘဲ သန့်ရှင်းသော Syntax ဖြင့် ရေးသားနိုင်သည်။
2. **Auto-Escaping Security**: XSS (Cross-Site Scripting) တိုက်ခိုက်မှုများကို ကာကွယ်ရန် HTML အထူးစာလုံးများကို အလိုအလျောက် Escape ပြုလုပ်ပေးသည်။
3. **Template Inheritance**: Frame တစ်ခုတည်းကို စာမျက်နှာအားလုံးက အမွေဆက်ခံ (`extends`) အသုံးပြုနိုင်သည်။

---

## ၂။ Twig Syntax အခြေခံ ၃ မျိုး

Twig တွင် Syntax ပုံစံ ၃ မျိုးသာ ရှိပါသည်-

```twig
{# ၁။ Comment ရေးသားခြင်း (Browser HTML ထဲတွင် မပေါ်ပါ) #}
{# This is a Twig comment #}

{# ၂။ Output ထုတ်ပြခြင်း (Variables / Expressions) #}
{{ BaseInfo.shop_name }}
{{ Product.name }}

{# ၃။ Logic ထိန်းချုပ်ခြင်း (Tags / If-conditions / Loops) #}
{% if Product.hasProductClass %}
    <p>Variants Available</p>
{% endif %}
```

---

## ၃။ Twig Control Structures (အခြေခံ Logic များ)

### (က) Condition (`{% if %}`)
```twig
{% if is_granted('ROLE_USER') %}
    {# အသင်းဝင် Login ဝင်ထားပါက ပြသမည့် UI #}
    <p>မင်္ဂလာပါ {{ app.user.name01 }} {{ app.user.name02 }} စံ</p>
    <a href="{{ url('mypage') }}">マイページ (My Page)</a>
    <a href="{{ url('logout') }}">ログアウト (Logout)</a>
{% else %}
    {# ဧည့်သည် (Guest) ဖြစ်ပါက ပြသမည့် UI #}
    <a href="{{ url('mypage_login') }}">ログイン (Login)</a>
    <a href="{{ url('entry') }}">会員登録 (Register)</a>
{% endif %}
```

### (ခ) Loop (`{% for %}`)
```twig
{# ကုန်ပစ္စည်း စာရင်းကို Loop ပတ်၍ ပြသခြင်း #}
<div class="product-grid">
    {% for Product in Products %}
        <div class="product-card">
            <img src="{{ asset(Product.main_list_image, 'save_image') }}" alt="{{ Product.name }}">
            <h3>{{ Product.name }}</h3>
            <p class="price">{{ Product.getPrice02MinIncTax|price }}</p>
            <a href="{{ url('product_detail', {'id': Product.id}) }}">အသေးစိတ် ကြည့်မည်</a>
        </div>
    {% else %}
        <p class="no-items">ကုန်ပစ္စည်း မရှိသေးပါ။ (商品がありません)</p>
    {% endfor %}
</div>
```

### (ဂ) Variable သတ်မှတ်ခြင်း (`{% set %}`)
```twig
{% set discount_rate = 0.1 %}
{% set total_items = Cart.total_quantity %}
{% set is_mobile = app.request.headers.get('User-Agent') matches '/(iPhone|Android)/' %}
```

---

## ၄။ Template Inheritance & Inclusion (အမွေဆက်ခံခြင်းနှင့် ချိတ်ဆက်ခြင်း)

### (က) `{% extends %}` (အမွေဆက်ခံခြင်း)
စာမျက်နှာတိုင်းသည် Master Layout (`default_frame.twig`) ကို အခြေခံ၍ တည်ဆောက်ပါသည်-

```twig
{# Product/list.twig ၏ ဥပမာ #}
{% extends 'default_frame.twig' %}

{% block main %}
    <div class="ec-layoutRole__main">
        <h1>ကုန်ပစ္စည်းများ စာရင်း (商品一覧)</h1>
        {# စာမျက်နှာ၏ အဓိက အကြောင်းအရာများ #}
    </div>
{% endblock %}
```

### (ခ) `{% include %}` (ဖိုင်ငယ်များကို ထည့်သွင်းခြင်း)
Block များ သို့မဟုတ် UI Component ငယ်များကို ခေါ်ယူအသုံးပြုသည့်အခါ အသုံးပြုပါသည်-

```twig
{# Header Block ကို ခေါ်ယူခြင်း #}
{% include 'Block/header.twig' %}

{# Parameter ပေးပို့၍ ခေါ်ယူခြင်း #}
{% include 'Common/product_badge.twig' with {'is_new': true, 'is_sale': false} %}
```

---

## ၅။ EC-CUBE တွင် အသုံးများသော Twig Filters

Twig Filters များကို `|` (Pipe) သင်္ကေတဖြင့် အသုံးပြုပါသည်-

| Filter Name | နမူနာ ရေးသားပုံ | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| `\|price` | `{{ 1500\|price }}` | EC-CUBE ငွေကြေးပုံစံ (ဥပမာ- `¥1,500`) ပြောင်းလဲပေးခြင်း |
| `\|date` | `{{ Order.order_date\|date('Y-m-d H:i') }}` | ရက်စွဲ/အချိန် Format ပြောင်းခြင်း |
| `\|raw` | `{{ Product.description_detail\|raw }}` | HTML tags များကို Escape မလုပ်ဘဲ တိုက်ရိုက် Render လုပ်ခြင်း |
| `\|nl2br` | `{{ Inquiry.contents\|nl2br }}` | New line (`\n`) များကို `<br>` အဖြစ် ပြောင်းပေးခြင်း |
| `\|number_format` | `{{ 250000\|number_format }}` | ဂဏန်းများကို ကော်မာ ထည့်ပေးခြင်း (`250,000`) |
| `\|trans` | `{{ 'front.cart.buy'\|trans }}` | ဘာသာစကား ဘာသာပြန် String ဖော်ပြခြင်း |
| `\|slice` | `{{ Product.name\|slice(0, 20) }}...` | စာသားအရှည်ကို ဖြတ်တောက်ခြင်း |
| `\|default` | `{{ Customer.nickname\|default('Guest') }}` | တန်ဖိုး မရှိပါက Default Value သတ်မှတ်ခြင်း |

---

## ၆။ EC-CUBE Global Variables (အသင့်သုံး Global ကိန်းရှင်များ)

EC-CUBE ၏ Twig ဖိုင်တိုင်းတွင် Controller မှ pass မလုပ်ဘဲ အသင့်သုံးနိုင်သော Global Variable များ ရှိပါသည်-

```twig
{# ၁။ BaseInfo (ဆိုင်၏ အခြေခံ အချက်အလက်များ) #}
<title>{{ BaseInfo.shop_name }}</title>
<p>Email: {{ BaseInfo.email01 }}</p>
<p>ဖုန်း: {{ BaseInfo.phone_number }}</p>

{# ၂။ app (Symfony Application Object) #}
{% if app.user %}
    <p>User ID: {{ app.user.id }}</p>
    <p>Email: {{ app.user.email }}</p>
{% endif %}

{# ၃။ Page (လက်ရှိ ဖွင့်ထားသော စာမျက်နှာ အချက်အလက်) #}
<p>Page Title: {{ Page.name }}</p>
<p>URL Slug: {{ Page.url }}</p>

{# ၄။ eccube_config (EC-CUBE Configuration Parameters) #}
<p>Currency Symbol: {{ eccube_config.eccube_currency }}</p>
```

---

## ၇။ Path & URL Helper Functions

EC-CUBE တွင် Routing လမ်းကြောင်းများကို Twig Function များဖြင့် အောက်ပါအတိုင်း ခေါ်ယူပါသည်-

```twig
{# URL အပြည့်အစုံ (Absolute URL) #}
<a href="{{ url('homepage') }}">Home Page</a>

{# Route Name ဖြင့် Path ရယူခြင်း (Relative URL) #}
<a href="{{ path('product_list') }}">Product Catalog</a>

{# Parameter ပါဝင်သော Route URL #}
<a href="{{ url('product_detail', {'id': 42}) }}">View Product #42</a>

{# Asset File လမ်းကြောင်း ရယူခြင်း #}
<img src="{{ asset('assets/img/top/main-banner.jpg') }}" alt="Main Banner">

{# Product Image လမ်းကြောင်း ရယူခြင်း #}
<img src="{{ asset(Product.main_image, 'save_image') }}" alt="{{ Product.name }}">
```

> [!TIP]
> **Debugging Tip**: Twig ထဲတွင် Data variable များ မည်သည့် structure ရှိသည်ကို သိလိုပါက `{{ dump(Product) }}` ဟု ရေးသား၍ စစ်ဆေးနိုင်ပါသည်။ (Admin Debug Mode ဖွင့်ထားရန် လိုအပ်ပါသည်)
