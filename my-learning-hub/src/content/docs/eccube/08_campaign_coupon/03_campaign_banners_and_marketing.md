---
title: "03. Campaign Banners And Marketing"
description: "> Client Requirements:"
---

## 03 - Campaign Banners & Marketing (ကမ်ပိန်း Banner များနှင့် စျေးကွက်မြှင့်တင်ရေး)

> **Client Requirements**:
> 1. **Campaign banner (ကမ်ပိန်း Banner ပြသခြင်း)**: စတိုးဆိုင်၏ Home Page တွင် ပရိုမိုးရှင်း ကမ်ပိန်း Banner များကို ထင်ရှားစွာ ပြသနိုင်ရမည်။
> 2. **Auto-expiry Schedule (သက်တမ်းအလိုက် အလိုအလျောက် ပေါ်/ပျောက် ပြုလုပ်ခြင်း)**: သန်းခေါင်ယံ ၁၂ နာရီတွင် Admin က လက်ဖြင့် ဝင်ဖျက်နေစရာ မလိုဘဲ စတင်မည့်ရက်တွင် အလိုအလျောက် ပေါ်လာပြီး၊ ကုန်ဆုံးမည့်ရက် ရောက်သည်နှင့် Banner အလိုအလျောက် ပျောက်ကွယ်သွားရမည်။
> 3. **One-click Copy / Auto-apply**: Banner ကို ကလစ်နှိပ်လိုက်သည်နှင့် ကူပွန်ကုဒ်ကို Clipboard သို့ အလိုအလျောက် ကူးယူ (Copy) ပေးနိုင်ရမည် သို့မဟုတ် Cart ထဲသို့ တိုက်ရိုက် ထည့်သွင်းပေးနိုင်ရမည်။

---

## 🎨 1. Auto-expiry Campaign Banner (Twig Date Comparison)

Admin က Banner တင်သည့်အခါ စတင်ရက် (`start_date`) နှင့် ပြီးဆုံးရက် (`end_date`) ကို သတ်မှတ်ထားနိုင်ပြီး၊ Twig Template က လက်ရှိအချိန် (`date()`) နှင့် နှိုင်းယှဉ်၍ အလိုအလျောက် ထိန်းချုပ်ပေးပါသည်:

```twig
{# Resource/template/default/Block/campaign_banner.twig #}

{% set now = date() %}

{# Campaign Banner စာရင်းထဲမှ သက်တမ်းအတွင်း ရှိနေသော Banner များကိုသာ ပြသခြင်း #}
{% for banner in campaignBanners %}
    {% if now >= date(banner.start_date) and now <= date(banner.end_date) %}
        <div class="campaign-banner text-center my-3">
            <a href="{{ banner.url|default('#') }}" class="btn-copy-coupon" data-coupon-code="{{ banner.coupon_code }}">
                <img src="{{ asset(banner.image_file, 'save_image') }}" alt="{{ banner.title }}" class="img-fluid rounded shadow-sm">
            </a>
            
            {% if banner.coupon_code %}
                {# ကူပွန်ကုဒ် ကူးယူရန် ခလုတ် #}
                <div class="coupon-copy-badge mt-2">
                    <span class="badge badge-warning p-2">
                        クーポンコード: <strong>{{ banner.coupon_code }}</strong>
                        <button type="button" class="btn btn-sm btn-dark ml-2 js-copy-btn" data-code="{{ banner.coupon_code }}">
                            <i class="fa fa-copy"></i> コピー (Copy)
                        </button>
                    </span>
                </div>
            {% endif %}
        </div>
    {% endif %}
{% endfor %}
```

---

## 📋 2. One-Click Copy Coupon Code JavaScript

Customer များ ကူပွန်ကုဒ်ကို လက်ဖြင့် လိုက်မရိုက်ရဘဲ ကလစ်တစ်ချက် နှိပ်ရုံဖြင့် ဖုန်း သို့မဟုတ် ကွန်ပျူတာ Clipboard ထဲသို့ ကူးယူပေးသော JavaScript:

```javascript
// assets/js/coupon_copy.js
$(document).on('click', '.js-copy-btn', function (e) {
    e.preventDefault();
    var couponCode = $(this).data('code');

    // Clipboard သို့ ရေးသားခြင်း
    navigator.clipboard.writeText(couponCode).then(function () {
        alert('ကူပွန်ကုဒ် [' + couponCode + '] ကို ကူးယူပြီးပါပြီ! Checkout တွင် ထည့်သွင်း အသုံးပြုနိုင်ပါသည်။');
    }).catch(function (err) {
        console.error('Copy failed: ', err);
    });
});
```

---

## 📢 3. Sticky Top Announcement Bar (အပေါ်ဆုံးတွင် ကပ်နေသော သတိပေးဘား)

Website ၏ အပေါ်ဆုံး Header ပေါ်တွင် ကမ်ပိန်းကာလအတွင်း အမြဲတမ်း ပေါ်နေစေသော Announcement Bar:

```twig
{# Header အပေါ်ဆုံးတွင် ထည့်သွင်းခြင်း #}
{% if isCampaignActive %}
    <div class="sticky-campaign-bar bg-danger text-white text-center py-2 font-weight-bold">
        🎉 【SUMMER SALE】期間中 5,000 円以上のお買い物で 10% OFF！ クーポンコード: 
        <span class="badge badge-light text-danger ml-1">SUMMER2026</span>
    </div>
{% endif %}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **キャンペーンバナー (Kyanpeen Banaa)**: Campaign Banner
- **自動掲載 / 自動非表示 (Jidou Keisai / Jidou Hihyouji)**: Auto Display / Auto Hide
- **掲載期間 (Keisai Kikan)**: Display Period (Start & End Date)
- **コードコピー (Koudo Kopii)**: Copy Coupon Code
- **告知バー / アナウンスメントバー (Kokuchi Baa)**: Announcement Bar
