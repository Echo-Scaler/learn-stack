---
title: "01. Theme And Template Override"
description: "EC-CUBE တွင် Frontend UI ဒီဇိုင်းကို စိတ်ကြိုက် ပြင်ဆင်လိုသည့်အခါ Core Code များကို မထိခိုက်စေဘဲ Template Override စနစ် ဖြင့် ဘေးကင်းလုံခြုံစွာ ပြင်ဆင်ရပါမည်။"
---

## Module 05 - အခန်း ၁: Theme & Template Override ပြုလုပ်နည်း

EC-CUBE တွင် Frontend UI ဒီဇိုင်းကို စိတ်ကြိုက် ပြင်ဆင်လိုသည့်အခါ Core Code များကို မထိခိုက်စေဘဲ **Template Override စနစ်** ဖြင့် ဘေးကင်းလုံခြုံစွာ ပြင်ဆင်ရပါမည်။

---

## ၁။ Template ဦးစားပေး ရှာဖွေမှု အစီအစဉ် (Template Resolution Order)

EC-CUBE သည် Twig ဖိုင်တစ်ခုကို Render လုပ်သည့်အခါ အောက်ပါ ဦးစားပေး အစီအစဉ်အတိုင်း ရှာဖွေပါသည်:

```
                  ┌─────────────────────────────────────────┐
                  │ 1. app/template/default/ (Override)     │ ◄── [ ဦးစွာ ရှာဖွေသည် ]
                  └────────────────────┬────────────────────┘
                                       │ (မရှိပါက)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 2. Plugin Templates (plg_*)             │
                  └────────────────────┬────────────────────┘
                                       │ (မရှိပါက)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 3. src/Eccube/Resource/template/default │ ◄── [ မူရင်း Core ဖိုင် ]
                  └─────────────────────────────────────────┘
```

> 💡 **ရွှေစည်းမျဉ်း**:  
> `src/Eccube/Resource/template/default/` ထဲရှိ မူရင်းဖိုင်ကို ကူးယူပြီး **`app/template/default/`** အောက်ရှိ တူညီသော လမ်းကြောင်းတွင် ထားကာ ပြင်ဆင်ရပါမည်။

---

## ၂။ လက်တွေ့ ဥပမာ (၁): Product Detail စာမျက်နှာကို Override ပြုလုပ်ခြင်း

ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာတွင် Custom Badge (ဥပမာ: "Free Shipping / ပို့ခအခမဲ့") စာသား ထည့်သွင်းလိုသည်ဆိုပါစို့-

### အဆင့် ၁: ဖိုင်ကို Copy ကူးပါ
```bash
# Target Folder ဖန်တီးပါ
mkdir -p app/template/default/Product

# Core Template ကို Customize Folder သို့ Copy ကူးပါ
cp src/Eccube/Resource/template/default/Product/detail.twig app/template/default/Product/detail.twig
```

### အဆင့် ၂: `app/template/default/Product/detail.twig` ကို ဖွင့်၍ ပြင်ဆင်ပါ
```twig
{# ဈေးနှုန်းပြသသည့် နေရာအနီးတွင် Custom Badge ထည့်သွင်းခြင်း #}
<div class="ec-productRole__price">
    <div class="ec-price">
        <span class="ec-price__label">판매가격:</span>
        <span class="ec-price__price text-danger font-weight-bold">
            {{ Product.getPrice02IncTaxMin|price }}
        </span>
    </div>
    
    {# Custom Code: ပို့ခအခမဲ့ Badge အသစ်ထည့်ခြင်း #}
    {% if Product.free_shipping_flag is defined and Product.free_shipping_flag %}
        <div class="my-2">
            <span class="badge bg-success p-2">🚚 ဂျပန်တစ်နိုင်ငံလုံး ပို့ခ အခမဲ့!</span>
        </div>
    {% endif %}
</div>
```

### အဆင့် ၃: Cache ကို ရှင်းထုတ်ပါ
```bash
bin/console cache:clear
```

Browser တွင် Product Detail စာမျက်နှာကို Refresh လုပ်ကြည့်ပါက ပြင်ဆင်ချက် ချက်ချင်း အသက်ဝင်လာမည်ဖြစ်ပါသည်။

---

## ၃။ လက်တွေ့ ဥပမာ (၂): Header & Footer ကို Override ပြုလုပ်ခြင်း

Website ၏ Header တွင် ဖုန်းနံပါတ်၊ ဆိုင်လိပ်စာ သို့မဟုတ် လူမှုကွန်ရက် Icon များ ထည့်သွင်းလိုသည့်အခါ-

```bash
# Block Folder ဖန်တီးပါ
mkdir -p app/template/default/Block

# Header ဖိုင်ကို Copy ကူးပါ
cp src/Eccube/Resource/template/default/Block/header.twig app/template/default/Block/header.twig
```

`app/template/default/Block/header.twig` တွင် လိုအပ်သော HTML ကို ဖြည့်စွက်ရေးသားနိုင်ပါသည်:

```twig
<div class="ec-headerTop">
    <div class="container d-flex justify-content-between py-1 text-muted small">
        <div>📞 ဖောက်သည်ဝန်ဆောင်မှု: 03-1234-5678 (တနင်္လာ-သောကြာ 9:00 - 18:00)</div>
        <div>
            <a href="https://facebook.com" class="text-muted me-2"><i class="fab fa-facebook"></i></a>
            <a href="https://instagram.com" class="text-muted"><i class="fab fa-instagram"></i></a>
        </div>
    </div>
</div>
```

---

## ၄။ Admin Template ကို Override ပြုလုပ်ခြင်း

Storefront ကဲ့သို့ပင် Admin Panel UI ကို ပြင်လိုပါက **`app/template/admin/`** အောက်တွင် အလားတူ Override လုပ်နိုင်ပါသည်:

- မူရင်းတည်နေရာ: `src/Eccube/Resource/template/admin/Product/product.twig`
- Override တည်နေရာ: `app/template/admin/Product/product.twig`

---

နောက်အခန်းတွင် **[Module 05 - အခန်း ၂: Custom Blocks နှင့် Assets (CSS/JS) စီမံခန့်ခွဲမှု](/eccube/01_basics/05-frontend-customization/02-custom-blocks-and-assets/)** ကို ဆက်လက်လေ့လာပါမည်။
