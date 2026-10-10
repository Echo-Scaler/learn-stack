---
title: "03. Delivery Date And Time"
description: "> Client Requirements:"
---

## 03 - Delivery Date & Time Slot Management (အရောက်ပို့ရက်နှင့် အချိန်ပိုင်း သတ်မှတ်ခြင်း)

> **Client Requirements**:
> 1. **Delivery date (ရောက်ရှိလိုသည့် ရက်စွဲ သတ်မှတ်ခြင်း)**: Customer က မိမိ ပစ္စည်းလက်ခံလိုသည့် နေ့ရက်ကို Calendar မှ ရွေးချယ်နိုင်ရမည်။ ဂိုဒေါင်မှ ပစ္စည်းထုပ်ပိုးချိန်နှင့် ခရီးအကွာအဝေး (Lead Time) ကို ထည့်တွက်ပြီး အစောဆုံး ရောက်နိုင်သည့်ရက်မှ စတင်၍ နောက်ထပ် ၁၄ ရက်အတွင်းသာ ရွေးချယ်ခွင့် ပြုရမည်။ အလုပ်ပိတ်ရက်များ (စနေ၊ တနင်္ဂနွေ၊ အစိုးရရုံးပိတ်ရက်) တွင် ဂိုဒေါင် မဖွင့်ပါက ထိုရက်များကို ပို့ဆောင်ရက် တွက်ချက်မှုမှ ဖယ်ထုတ်ပေးရမည်။
> 2. **Delivery time (ရောက်ရှိလိုသည့် အချိန်အပိုင်းအခြား)**: အိမ်တွင် လူရှိမည့် အချိန် (ဥပမာ- ညနေ ၆ နာရီမှ ၈ နာရီအတွင်း) ကို ရွေးချယ်နိုင်ရမည်။
> 3. **指定なし (သတ်မှတ်ချက် မရှိပါက)**: ရက်စွဲ မရွေးထားပါက "အမြန်ဆုံး ပို့ဆောင်ပေးပါ (最短お届け)" အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးရမည်။

---

## 📅 1. Delivery Date & Lead Time Architecture (お届け希望日 & リードタイム)

ဂျပန်နိုင်ငံ E-Commerce တွင် အော်ဒါတင်ပြီးနောက် အစောဆုံး ရောက်ရှိနိုင်မည့်ရက် (**最短お届け日**) ကို အောက်ပါအတိုင်း တွက်ချက်ပါသည်:

```
[Customer places order on Monday (Day 0)]
                 │
                 ▼ ဂိုဒေါင် ပစ္စည်းပြင်ဆင်ချိန် (出荷作業日数 / Lead Time: e.g. 2 ရက်)
      [Warehouse ships on Wednesday (Day 2)]
                 │
                 ▼ ချောပို့ ကားမောင်းချိန် (配送日数: e.g. 1 ရက်)
      [Arrival Date: Thursday (Day 3) ── 最短お届け日]
                 │
                 ▼ Customer ရွေးချယ်နိုင်သော ရက်စွဲ အတိုင်းအတာ
   [Thursday (Day 3) မှစ၍ နောက်ထပ် ၁၄ ရက်အထိ Calendar တွင် ရွေးခွင့်ပြုသည်]
```

### ရုံးပိတ်ရက်များ ဖယ်ထုတ်တွက်ချက်ပုံ Logic:
အကယ်၍ သောကြာနေ့တွင် အော်ဒါတင်ပြီး စနေ၊ တနင်္ဂနွေတွင် ဂိုဒေါင် ပိတ်ထားပါက စနစ်သည် ပိတ်ရက် ၂ ရက်ကို အလိုအလျောက် ကျော်ခွပြီး အင်္ဂါနေ့မှသာ အစောဆုံး ပစ္စည်းပို့ဆောင်ရက် အဖြစ် တွက်ချက်ပေးရပါသည်:

```php
// Lead Time တွက်ချက်မှု Service Method
public function getMinDeliveryDate(Delivery $Delivery): \DateTime
{
    $leadTimeDays = $Delivery->getDeliveryDate()->getValue(); // ဥပမာ 2 ရက်
    $date = new \DateTime();

    while ($leadTimeDays > 0) {
        $date->modify('+1 day');
        // စနေ (6) သို့မဟုတ် တနင်္ဂနွေ (0) ဖြစ်ပါက ကျော်ခွခြင်း
        if ($date->format('w') != 0 && $date->format('w') != 6) {
            $leadTimeDays--;
        }
    }

    return $date; // အစောဆုံး ရောက်ရှိနိုင်မည့် ရက်စွဲ
}
```

---

## ⏰ 2. Delivery Time Slot Architecture (`dtb_delivery_time`)

ဂျပန်နိုင်ငံတွင် Customer အိမ်တွင် မရှိပါက အိမ်တံခါးဝတွင် စာရွက် (不在票 - Absence Notice) ချန်ထားခဲ့ပြီး ပြန်လည် သယ်ယူသွားရသည့်အတွက် ပြန်လည်ပို့ဆောင်ရသော ပြဿနာ (**再配達問題**) အလွန် ကြီးမားပါသည်။ ထို့ကြောင့် ချောပို့ကုမ္ပဏီတိုင်းတွင် အောက်ပါ အချိန်အပိုင်းအခြားများ ထားရှိပါသည်:

```
[dtb_delivery_time Table]
├── 1: 午前中 (Morning: 8:00 ~ 12:00)
├── 2: 14:00 ～ 16:00
├── 3: 16:00 ～ 18:00
├── 4: 18:00 ～ 20:00
└── 5: 19:00 ～ 21:00 (Night Time)
```

### ချောပို့ ကုမ္ပဏီအလိုက် အချိန်အပိုင်းအခြား ကွဲပြားမှုများ:
- **Yamato Transport (ヤマト運輸)**: 午前中, 14-16, 16-18, 18-20, 19-21 (အချိန် ၅ ခု)
- **Sagawa Express (佐川急便)**: 午前中, 12-14, 14-16, 16-18, 18-20, 18-21, 19-21 (အချိန် ၇ ခု)
- **Japan Post (日本郵便)**: 午前中, 12-14, 14-16, 16-18, 18-20, 19-21, 20-21 (အချိန် ၇ ခု)

EC-CUBE သည် Customer ရွေးချယ်လိုက်သော Delivery Method အပေါ် မူတည်၍ ၎င်းနှင့် သက်ဆိုင်သော Time Slot များကိုသာ Dropdown တွင် ပြသပေးပါသည်:

```php
// ShoppingType.php
$builder->add('delivery_time', EntityType::class, [
    'class' => DeliveryTime::class,
    'query_builder' => function (DeliveryTimeRepository $repo) use ($delivery) {
        return $repo->createQueryBuilder('dt')
            ->where('dt.Delivery = :delivery')
            ->setParameter('delivery', $delivery)
            ->orderBy('dt.sort_no', 'ASC');
    },
    'placeholder' => '指定なし (最短でお届け)',
    'required' => false,
]);
```

---

## 🎨 Twig Template တွင် ရွေးချယ်ပုံ

Checkout စာမျက်နှာတွင် Customer သည် ရက်စွဲနှင့် အချိန်ကို လွတ်လပ်စွာ ရွေးချယ်နိုင်ပါသည်:

```twig
{# Resource/template/default/Shopping/shipping.twig #}

<div class="form-row">
    {# အရောက်ပို့ ရက်စွဲ ရွေးချယ်ခြင်း #}
    <div class="col-md-6 form-group">
        <label>お届け希望日 (Delivery Date)</label>
        {{ form_widget(form.shipping_delivery_date, {'attr': {'class': 'form-control'}}) }}
        <small class="form-text text-muted">※ 指定がない場合は、最短でお届けいたします。</small>
    </div>

    {# အရောက်ပို့ အချိန် ရွေးချယ်ခြင်း #}
    <div class="col-md-6 form-group">
        <label>お届け時間帯 (Delivery Time)</label>
        {{ form_widget(form.delivery_time, {'attr': {'class': 'form-control'}}) }}
    </div>
</div>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **お届け希望日 (Otodoke Kiboubi)**: Preferred Delivery Date
- **お届け時間帯 (Otodoke Jikantai)**: Preferred Delivery Time Slot
- **リードタイム (Riido Taimu)**: Lead Time (ပြင်ဆင်ချိန် + ပို့ဆောင်ချိန်)
- **最短お届け (Saitan Otodoke)**: Fastest Delivery
- **指定なし (Shitei Nashi)**: No Preference
- **再配達 (Sai-haitatsu)**: Re-delivery
- **定休日 / 発送休業日 (Teikyuubi / Hassou Kyuugyoubi)**: Non-working Shipping Holidays
