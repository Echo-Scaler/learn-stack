---
title: "06. Product Descriptions"
description: "> Client Requirement: ကုန်ပစ္စည်း အချက်အလက်တွေကို စာမျက်နှာနေရာပေါ်မူတည်ပြီး ရှင်းလင်းချက် အတို (List Summary) နှင့် အသေးစိတ်ရှင်းလင်းချက် (Detailed Rich Text"
---

## 06 - Product Descriptions (ကုန်ပစ္စည်း ဖော်ပြချက်များ စီမံခြင်း)

> **Client Requirement**: "ကုန်ပစ္စည်း အချက်အလက်တွေကို စာမျက်နှာနေရာပေါ်မူတည်ပြီး ရှင်းလင်းချက် အတို (List Summary) နှင့် အသေးစိတ်ရှင်းလင်းချက် (Detailed Rich Text / HTML) ခွဲခြား ထည့်သွင်းလိုပါသည်။ ထို့အပြင် YouTube Video များ၊ Size Chart ဇယားများ ထည့်နိုင်သော Free HTML Area လည်း လိုအပ်ပါသည်။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. **စာရင်းပြ ရှင်းလင်းချက် (List Description)**: Product Search သို့မဟုတ် Category List စာမျက်နှာတွင် စာကြောင်းရေ ၂ ကြောင်း/၃ ကြောင်းခန့် အကျဉ်းချုပ် ဖော်ပြလိုခြင်း (Catch Copy)။
2. **အသေးစိတ် ဖော်ပြချက် (Detail Description)**: Product Detail စာမျက်နှာတွင် စာလုံးအရွယ်အစား၊ အရောင်၊ စာပိုဒ်ခွဲများ၊ ပုံများနှင့် စာရင်းများပါဝင်သော Rich Text (WYSIWYG Editor) ဖြင့် ရေးသားလိုခြင်း။
3. **Free Area (フリーエリア)**: ပရိုမိုးရှင်း ကြော်ငြာ Banner များ၊ YouTube Embed Code များ၊ သတိပေးချက်များကို HTML Code ဖြင့် စိတ်ကြိုက်ထည့်သွင်းလိုခြင်း။
4. **Search Keywords (検索ワード)**: ကုန်ပစ္စည်း နာမည်ထဲတွင် မပါသော်လည်း Customer များ ရိုက်ရှာနိုင်သော စကားလုံးများ (Synonyms / Keywords) ကို ထည့်သွင်းလိုခြင်း။

---

## 🏛️ EC-CUBE Implementation Architecture: Database Columns

EC-CUBE ၏ `dtb_product` ဇယားတွင် Description များအတွက် Column များကို အောက်ပါအတိုင်း ခွဲခြားထားပါသည်:

```
[dtb_product Table]
├── description_list   (TEXT)     ── ကုန်ပစ္စည်း စာရင်းတွင် ပြသမည့် အတိုချုပ် အညွှန်း
├── description_detail (TEXT)     ── ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာတွင် ပြသမည့် စာသား (HTML)
├── free_area          (LONGTEXT) ── စိတ်ကြိုက် HTML, Embed Video, Banner ထည့်ရန် နေရာ
└── search_word        (TEXT)     ── ရှာဖွေရာတွင် အသုံးပြုမည့် Keyword များ
```

### Form Builder ဆက်သွယ်ပုံ (`ProductType.php`):
```php
// src/Eccube/Form/Type/Admin/ProductType.php
$builder
    ->add('description_list', TextareaType::class, [
        'label' => 'admin.product.description_list',
        'required' => false,
    ])
    ->add('description_detail', TextareaType::class, [
        'label' => 'admin.product.description_detail',
        'required' => false,
    ])
    ->add('free_area', TextareaType::class, [
        'label' => 'admin.product.free_area',
        'required' => false,
    ])
    ->add('search_word', TextType::class, [
        'label' => 'admin.product.search_word',
        'required' => false,
    ]);
```

---

## 🎨 Twig Template တွင် ဖော်ပြခြင်းနှင့် လုံခြုံရေး (XSS Considerations)

### ၁။ Product List တွင် အတိုချုပ်ပြသခြင်း (`Product/list.twig`)
List စာမျက်နှာတွင် HTML Tag များကို ဖြုတ်ထုတ်ပြီး စာလုံးရေ အကန့်အသတ်ဖြင့်သာ ပြသလေ့ရှိပါသည်:

```twig
{# nl2br ဖြင့် Enter ခေါက်ထားသော စာကြောင်းများကို <br> ပြောင်းပေးခြင်း #}
<p class="product-item__description">
    {{ Product.description_list|nl2br }}
</p>
```

### ၂။ Product Detail တွင် Rich Text ပြသခြင်း (`Product/detail.twig`)
Detail စာမျက်နှာတွင် Admin က HTML Tags များ (`<p>`, `<strong>`, `<ul>`) ရိုက်ထည့်ထားသဖြင့် `|raw` Filter ကို အသုံးပြုရပါသည်:

```twig
<div class="product-detail__description">
    {# raw filter မပါပါက HTML tag များ စာသားအတိုင်း ပေါ်နေလိမ့်မည် #}
    {{ Product.description_detail|raw }}
</div>

{% if Product.free_area %}
    <div class="product-detail__free-area">
        {{ Product.free_area|raw }}
    </div>
{% endif %}
```

> 🛡️ **Security Alert (XSS Protection)**:
> Twig တွင် `|raw` Filter အသုံးပြုခြင်းသည် HTML ကို တိုက်ရိုက် Render လုပ်စေသဖြင့် ယုံကြည်စိတ်ချရသော Admin များသာ ထည့်သွင်းခွင့်ရသည့် Field ဖြစ်ရပါမည်။ Customer Input နေရာများတွင် `|raw` ကို လုံးဝ မသုံးရပါ။

---

## 💡 Client အမေးများသော Customization: WYSIWYG Editor (CKEditor / TinyMCE)

Standard EC-CUBE တွင် `description_detail` သည် ရိုးရိုး Textarea ဖြစ်နေတတ်သည်။ Client များသည် စာရိုက်ရ လွယ်ကူစေရန် Visual Editor (Bold, Italic, Image Upload) ကို တောင်းဆိုလေ့ရှိကြသည်။

### CKEditor ထည့်သွင်းခြင်း နမူနာ:
Admin Template Extension တွင် CKEditor CDN ကို ချိတ်ဆက်ပြီး Textarea ကို အစားထိုးနိုင်ပါသည်:

```html
<!-- Admin Twig Template Extension -->
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        CKEDITOR.replace('admin_product_description_detail', {
            height: 300
        });
    });
</script>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **一覧用説明文 (Ichiran-you Setsumeibun)**: Description for List (စာရင်းပြ ရှင်းလင်းချက်)
- **詳細用説明文 (Shousai-you Setsumeibun)**: Description for Detail (အသေးစိတ် ရှင်းလင်းချက်)
- **フリーエリア (Furii Eria)**: Free HTML Area (လွတ်လပ်စွာ ရေးနိုင်သော နေရာ)
- **検索ワード (Kensaku Waado)**: Search Words / Keywords (ရှာဖွေမှု အထောက်အကူပြု စကားလုံးများ)
