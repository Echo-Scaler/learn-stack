---
title: "03. Coupons Newsletters And Tracking"
description: "ဖောက်သည်များကို ဆွဲဆောင်ရန် LINE မှတစ်ဆင့် ကူပွန်များ ပေးပို့ခြင်း၊ Newsletter (သတင်းလွှာ) များ ပေးပို့ခြင်းနှင့် စီးပွားရေးအရ ရလဒ်ကောင်းမွန်မှု ရှိ/မရှိ တိုင်း"
---

## 03. Coupons, Newsletters & Campaign Tracking (LINE クーポン・配信・計測)

ဖောက်သည်များကို ဆွဲဆောင်ရန် LINE မှတစ်ဆင့် ကူပွန်များ ပေးပို့ခြင်း၊ Newsletter (သတင်းလွှာ) များ ပေးပို့ခြင်းနှင့် စီးပွားရေးအရ ရလဒ်ကောင်းမွန်မှု ရှိ/မရှိ တိုင်းတာခြင်း (Tracking) ဖြစ်ပါသည်။

---

## 🎟️ Coupon Delivery via LINE (ကူပွန် ပေးပို့ခြင်း နည်းလမ်း ၂ မျိုး)

### ၁။ Generic Campaign Coupon (အားလုံးသုံးနိုင်သော အများသုံး ကူပွန်)
- ကူပွန်ကုတ်တစ်ခုတည်း (ဥပမာ `LINE500`) ကို LINE 友だち အားလုံးထံသို့ Broadcast ဖြင့် ပို့ဆောင်ပြီး Checkout တွင် ရိုက်ထည့်အသုံးပြုစေခြင်း။

### ၂။ Personalized Single-Use Coupon (တစ်ဦးချင်း သီးသန့် ကူပွန်)
- ဖောက်သည်တစ်ဦးစီအတွက် မတူညီသော သီးသန့်ကုတ် (ဥပမာ `LN-U4af-8891`) ကို စနစ်က Auto-generate ထုတ်ပေးပြီး ထိုလူတစ်ဦးတည်းသာ ၁ ကြိမ် အသုံးပြုခွင့်ပေးခြင်း။

```php
public function generatePersonalizedLineCoupon(string $lineUserId, int $discountAmount): string
{
    $couponCode = 'LN-' . substr(md5($lineUserId . time()), 0, 8);

    $coupon = new Coupon();
    $coupon->setCouponCode(strtoupper($couponCode));
    $coupon->setCouponName('LINE友だち限定 ' . $discountAmount . '円引きクーポン');
    $coupon->setDiscountType(Coupon::DISCOUNT_TYPE_PRICE); // Fixed amount discount
    $coupon->setDiscountPrice($discountAmount);
    $coupon->setAvailableCount(1); // ၁ ကြိမ်သာ သုံးနိုင်သည်
    $coupon->setExpireDate((new \DateTime())->modify('+7 days')); // ၇ ရက်သာ သက်တမ်းရှိသည်

    $this->entityManager->persist($coupon);
    $this->entityManager->flush();

    return $coupon->getCouponCode();
}
```

---

## 📰 LINE Newsletter & Rich Messages (သတင်းလွှာ ပေးပို့ခြင်း)

သတင်းလွှာပို့ရာတွင် သာမန် စာသားအစား **Rich Message (リッチメッセージ)** ကို အသုံးပြုခြင်းဖြင့် Click နှိပ်နှုန်း (CTR) ကို ၃ ဆအထိ မြှင့်တင်နိုင်ပါသည်။

### Rich Message တည်ဆောက်ပုံ:
- အရွယ်အစား 1040 x 1040 px ရှိသော ရုပ်ပုံကြီးကို အသုံးပြုသည်။
- ထိုရုပ်ပုံကို အပိုင်း ၄ ပိုင်းခွဲ၍ နှိပ်လိုက်သော နေရာပေါ် မူတည်ပြီး သက်ဆိုင်ရာ ကုန်ပစ္စည်း Page သို့ ရောက်ရှိစေနိုင်သည်:

```json
{
  "type": "imagemap",
  "baseUrl": "https://your-store.com/images/line_rich_menu_campaign",
  "altText": "今週末限定！特別セール開催中",
  "baseSize": {
    "width": 1040,
    "height": 1040
  },
  "actions": [
    {
      "type": "uri",
      "linkUri": "https://your-store.com/products/list?category_id=1&utm_source=line&utm_medium=rich_message&utm_campaign=weekend_sale",
      "area": {
        "x": 0,
        "y": 0,
        "width": 520,
        "height": 1040
      }
    },
    {
      "type": "uri",
      "linkUri": "https://your-store.com/products/list?category_id=2&utm_source=line&utm_medium=rich_message&utm_campaign=weekend_sale",
      "area": {
        "x": 520,
        "y": 0,
        "width": 520,
        "height": 1040
      }
    }
  ]
}
```

---

## 📈 Campaign Tracking (ရလဒ် တိုင်းတာစစ်ဆေးခြင်း)

LINE မှတစ်ဆင့် ပို့လိုက်သော ကမ်ပိန်းများသည် အရောင်းမည်မျှ တက်စေသနည်း (ROI - Return on Investment) ကို တိကျစွာ သိရှိနိုင်ရန် နည်းလမ်း ၂ မျိုးဖြင့် တိုင်းတာရပါသည်:

### ၁။ UTM Parameters အသုံးပြုခြင်း (Google Analytics 4 & EC-CUBE)
LINE မှ ပို့သော Link တိုင်းတွင် အောက်ပါ URL Parameter များကို မဖြစ်မနေ ထည့်သွင်းရပါသည်:

```
https://your-store.com/campaign/spring?utm_source=line&utm_medium=broadcast&utm_campaign=spring2026&utm_content=coupon_500
```
- `utm_source=line`: ဝင်ရောက်လာသော ရင်းမြစ်မှာ LINE ဖြစ်ကြောင်း သိစေသည်။
- `utm_medium=broadcast`: အများသုံး သတင်းလွှာမှ လာသလား၊ တစ်ဦးချင်း Push မှ လာသလား ခွဲခြားသည်။
- `utm_campaign=spring2026`: မည်သည့် အရောင်းမြှင့်တင်ရေး ကမ်ပိန်းဖြစ်ကြောင်း ဖော်ပြသည်။

---

### ၂။ LINE Tag တပ်ဆင်ခြင်း (LINE Tag Conversion Tracking)

LINE Official Account Ads နှင့် ကမ်ပိန်းများအတွက် LINE Tag ကို EC-CUBE Twig Template များတွင် ထည့်သွင်းရပါသည်:

#### (က) Base Code (စာမျက်နှာအားလုံးတွင် အလုပ်လုပ်မည့် Code)
`template/default/default_frame.twig` ၏ `<head>` အတွင်း ထည့်သွင်းရပါသည်:
```html
<!-- LINE Tag Base Code -->
<script>
(function(g,d,o){
  g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments);};
  var h=d.getElementsByTagName("head")[0];
  var s=d.createElement("script");s.async=1;
  s.src='https://d.line-scdn.net/n/line_tag/public/release/v1/lt.js';
  h.insertBefore(s,h.firstChild);
})(window,document);
_lt('init', {
  customerType: 'lap',
  tagId: 'YOUR_LINE_TAG_ID'
});
_lt('send', 'pv', ['YOUR_LINE_TAG_ID']);
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://tr.line.me/tag.gif?c_t=lap&t_id=YOUR_LINE_TAG_ID&e=pv"/>
</noscript>
<!-- End LINE Tag Base Code -->
```

#### (ခ) Conversion Code (ဝယ်ယူမှု ပြီးဆုံးသည့် စာမျက်နှာတွင်သာ အလုပ်လုပ်မည့် Code)
`template/default/Shopping/complete.twig` တွင် ထည့်သွင်းရပါသည်:
```html
<!-- LINE Tag Conversion Code -->
<script>
_lt('send', 'cv', {
  tagId: 'YOUR_LINE_TAG_ID',
  cv: {
    value: '{{ Order.payment_total }}',
    currency: 'JPY'
  }
}, ['YOUR_LINE_TAG_ID']);
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://tr.line.me/tag.gif?c_t=lap&t_id=YOUR_LINE_TAG_ID&e=cv&value={{ Order.payment_total }}&currency=JPY"/>
</noscript>
<!-- End LINE Tag Conversion Code -->
```

ဤသို့ ပြုလုပ်ခြင်းဖြင့် LINE Message သို့မဟုတ် ကြော်ငြာကို ကြည့်ပြီး ဝယ်ယူသွားသော အရေအတွက်နှင့် စုစုပေါင်း ရောင်းရငွေကို LINE Official Account Manager Dashboard နှင့် Google Analytics တွင် တိကျစွာ ပြသပေးနိုင်မည် ဖြစ်ပါသည်။
