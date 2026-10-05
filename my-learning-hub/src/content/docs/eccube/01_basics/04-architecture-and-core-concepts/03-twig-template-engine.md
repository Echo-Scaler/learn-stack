---
title: "03. Twig Template Engine"
description: "EC-CUBE 4.x တွင် Frontend UI အားလုံးကို Twig Template Engine ဖြင့် ရေးသားထားပါသည်။ Twig သည် လုံခြုံစိတ်ချရပြီး XSS Attack များကို အလိုအလျောက် Escape ပြုလုပ်ပေးသ"
---

## Module 04 - အခန်း ၃: Twig Template Engine နှင့် Form Rendering

EC-CUBE 4.x တွင် Frontend UI အားလုံးကို **Twig Template Engine** ဖြင့် ရေးသားထားပါသည်။ Twig သည် လုံခြုံစိတ်ချရပြီး XSS Attack များကို အလိုအလျောက် Escape ပြုလုပ်ပေးသည့်အပြင် သန့်ရှင်းသော Template Inheritance စနစ်ကို ပေးစွမ်းပါသည်။

---

## ၁။ Twig အခြေခံ Syntax များ (Basic Twig Syntax)

Twig တွင် အဓိက Delimiter (၃) မျိုး ရှိပါသည်:

```twig
{# ၁။ Output Tags: Data ထုတ်ပြရန် #}
{{ product.name }}
{{ customer.email }}

{# ၂။ Control Tags: Logic, Loops, Conditionals ရေးရန် #}
{% if product.stock > 0 %}
    <span class="badge bg-success">In Stock</span>
{% else %}
    <span class="badge bg-danger">Sold Out</span>
{% endif %}

{# ၃။ Comment Tags: မှတ်ချက်ရေးရန် (HTML Source ထဲတွင် မပေါ်ပါ) #}
{# ဤနေရာတွင် Slider Banner ထည့်သွင်းပါမည် #}
```

---

## ၂။ Template Inheritance (အမွေဆက်ခံမှု စနစ်)

EC-CUBE ရှိ စာမျက်နှာတိုင်းသည် အခြေခံ Master Layout (`default_frame.twig`) ကို Extend လုပ်ပြီး ရေးသားထားပါသည်:

```twig
{# app/template/default/Demo/index.twig #}
{% extends '@default/default_frame.twig' %}

{% set body_class = 'demo_page' %}

{# CSS ထပ်ဖြည့်လိုပါက parent() ကို ခေါ်၍ ပေါင်းထည့်နိုင်သည် #}
{% block stylesheet %}
    {{ parent() }}
    <link rel="stylesheet" href="{{ asset('assets/css/custom-demo.css') }}">
{% endblock %}

{# ပင်မ Main Content အပိုင်း #}
{% block main %}
<div class="ec-layoutRole__main">
    <div class="ec-role">
        <div class="ec-pageHeader">
            <h1>{{ page_title }}</h1>
        </div>

        <div class="row">
            {% for product in products %}
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="{{ asset(product.main_list_image, 'save_image') }}" class="card-img-top" alt="{{ product.name }}">
                        <div class="card-body">
                            <h5 class="card-title">{{ product.name }}</h5>
                            <p class="card-text text-danger font-weight-bold">
                                {{ product.getPrice02IncTaxMin|price }}
                            </p>
                            <a href="{{ url('product_detail', { id: product.id }) }}" class="btn btn-primary btn-sm">အသေးစိတ်ကြည့်ရန်</a>
                        </div>
                    </div>
                </div>
            {% else %}
                <p>ကုန်ပစ္စည်း မရှိသေးပါ။</p>
            {% endfor %}
        </div>
    </div>
</div>
{% endblock %}

{# JavaScript ထပ်ဖြည့်လိုပါက #}
{% block javascript %}
    {{ parent() }}
    <script src="{{ asset('assets/js/custom-demo.js') }}"></script>
{% endblock %}
```

---

## ၃။ EC-CUBE တွင် အသုံးများသော Twig Filters များ

| Filter | ဥပမာ Syntax | ရလဒ် ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| **`price`** | `{{ 1500\|price }}` | ငွေကြေးပုံစံ ပြောင်းလဲပေးသည် (`￥1,500` / `1,500円`) |
| **`date`** | `{{ Order.create_date\|date('Y-m-d H:i') }}` | အချိန်/ရက်စွဲ format ပြောင်းလဲပေးသည် (`2026-09-19 16:30`) |
| **`nl2br`** | `{{ product.description_detail\|nl2br }}` | New line `\n` များကို HTML `<br>` အဖြစ် ပြောင်းပေးသည် |
| **`raw`** | `{{ html_content\|raw }}` | HTML escape မလုပ်ဘဲ တိုက်ရိုက် Render လုပ်သည် (XSS သတိပြုရန်) |
| **`trans`** | `{{ 'common.cart'\|trans }}` | ဘာသာစကား စာသားဖိုင်မှ Translation ဆွဲယူသည် |
| **`length`** | `{{ products\|length }}` | Array သို့မဟုတ် String အရှည်ကို ရေတွက်သည် |

---

## ၄။ အသုံးဝင်သော Twig Functions များ

```twig
{# 1. Asset File များ၏ URL ကို ခေါ်ယူခြင်း #}
<link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">

{# 2. Route Name ဖြင့် URL Generate ပြုလုပ်ခြင်း #}
<a href="{{ url('product_list') }}">ကုန်ပစ္စည်းစာရင်း</a>
<a href="{{ url('product_detail', {'id': 15}) }}">Product #15</a>

{# 3. CSRF Token ထုတ်ယူခြင်း (Form များတွင် လုံခြုံရေးအတွက် မဖြစ်မနေလိုအပ်) #}
<input type="hidden" name="_token" value="{{ csrf_token() }}">
```

---

## ၅။ Symfony Form Rendering in Twig

Controller မှ ပို့လိုက်သော Symfony Form Object ကို Twig တွင် လှပစွာ Render ပြုလုပ်ပုံ-

```twig
{{ form_start(form, {'attr': {'class': 'ec-borderedDefs', 'novalidate': 'novalidate'}}) }}

    {# Form တစ်ခုလုံးဆိုင်ရာ Global Error များ ပြသခြင်း #}
    {{ form_errors(form) }}

    <div class="form-group mb-3">
        {# Label ထုတ်ပြခြင်း #}
        {{ form_label(form.name, 'အမည် (Full Name)', {'label_attr': {'class': 'form-label'}}) }}
        
        {# Input Box ထုတ်ပြခြင်း #}
        {{ form_widget(form.name, {'attr': {'class': 'form-control', 'placeholder': 'မောင်မောင်'}}) }}
        
        {# Field Error ပြသခြင်း #}
        {{ form_errors(form.name) }}
    </div>

    <div class="form-group mb-3">
        {{ form_label(form.email, 'အီးမေးလ်လိပ်စာ') }}
        {{ form_widget(form.email, {'attr': {'class': 'form-control'}}) }}
        {{ form_errors(form.email) }}
    </div>

    <button type="submit" class="btn btn-primary">ပေးပို့မည်</button>

    {# ကျန်ရှိနေသေးသော Hidden Fields နှင့် CSRF Token များကို အလိုအလျောက် ထည့်ပေးသည် #}
    {{ form_rest(form) }}

{{ form_end(form) }}
```

---

နောက်အခန်းတွင် **[Module 05: Frontend Customization](/eccube/01_basics/05-frontend-customization/01-theme-and-template-override/)** ကို ဆက်လက်လေ့လာပါမည်။
