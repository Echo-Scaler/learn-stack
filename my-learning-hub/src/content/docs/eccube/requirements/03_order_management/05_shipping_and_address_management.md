---
title: "05. Shipping And Address Management"
description: "> Client Requirements:"
---

## 05 - Shipping Status & Address Management (ပို့ဆောင်ရေး အခြေအနေနှင့် လိပ်စာ ပြင်ဆင်ခြင်း)

> **Client Requirements**:
> 1. **Shipping status (ပို့ဆောင်ရေး အခြေအနေ စီမံခြင်း)**: ပစ္စည်းများကို ဂိုဒေါင်မှ ထုတ်ပိုးပြီး ချောပို့ (Yamato, Sagawa, JP Post) သို့ အပ်နှံလိုက်သည်နှင့် Tracking Number (送り状番号) ထည့်သွင်းပြီး Status ကို "発送済み (Shipped)" သို့ ပြောင်းနိုင်ရမည်။
> 2. **Change shipping address (ပို့ဆောင်ရမည့် လိပ်စာ ပြောင်းလဲခြင်း)**: Customer က လိပ်စာ မှားယွင်းထည့်မိ၍ မပို့မီ အချိန်မီ ဆက်သွယ်လာပါက Admin မှ ပို့ဆောင်ရမည့် လိပ်စာကို ပြင်ဆင်ပေးနိုင်ရမည်။ လိပ်စာအရပ်ဒေသ ပြောင်းသွားပါက ပို့ခ (Shipping Fee) ပြန်လည်တွက်ချက်နိုင်ရမည်။
> 3. **Multiple Shipping (複数配送)**: အော်ဒါ တစ်ခုတည်းတွင် ပစ္စည်းများကို လက်ဆောင်အဖြစ် သူငယ်ချင်း ၂ ယောက်/၃ ယောက်ဆီသို့ လိပ်စာခွဲ၍ ပို့ဆောင်နိုင်ရမည်။

---

## 🚚 1. Shipping Architecture (`dtb_shipping` & `dtb_shipment_item`)

EC-CUBE တွင် ပို့ဆောင်ရေး လိပ်စာများကို `dtb_order` ထဲတွင် တိုက်ရိုက်မသိမ်းဘဲ သီးခြား **`dtb_shipping`** ဇယားဖြင့် သိမ်းဆည်းထားပါသည်:

```
[dtb_order] (အော်ဒါ ပင်မမှတ်တမ်း)
     │
     ├─► [dtb_shipping #1] ── ဦးကျော် (ရန်ကုန်လိပ်စာ) ── Tracking No: 1234-5678-9012
     │         │
     │         └── [dtb_shipment_item] ── T-Shirt (Qty: 2)
     │
     └─► [dtb_shipping #2] ── ဒေါ်လှ (မန္တလေးလိပ်စာ) ── Tracking No: 9876-5432-1098
               │
               └── [dtb_shipment_item] ── Coffee Beans (Qty: 1)
```

### အဘယ်ကြောင့် `dtb_shipping` ကို သီးခြား ခွဲထားသနည်း?
> 🎁 **複数配送 (Multi-shipping Destination)**:  
> ဂျပန်နိုင်ငံ ယဉ်ကျေးမှုအရ အိုချူးဂန်း (お中元) နှင့် အိုဆဲဘို (お歳暮) ရာသီများတွင် လူတစ်ဦးတည်းက အော်ဒါတစ်ခုတည်းဖြင့် ဆွေမျိုး၊ မိတ်ဆွေ ၁၀ ယောက်ဆီသို့ လိပ်စာ ၁၀ ခုခွဲ၍ ပစ္စည်းပို့လေ့ရှိသောကြောင့် EC-CUBE သည် အော်ဒါ ၁ ခုတွင် Shipping လိပ်စာ အများအပြား ခွဲပို့နိုင်ရန် ဤသို့ ဗိသုကာ ပြုလုပ်ထားခြင်း ဖြစ်ပါသည်။

---

## 📦 2. Shipping Status & Tracking Number Management

Admin က ပစ္စည်းပို့ဆောင်ပြီးစီးကြောင်း အတည်ပြုရန် **受注管理 ➔ 出荷管理** သို့မဟုတ် Order Detail ရှိ Shipping Form တွင် ဖြည့်သွင်းပါသည်:

### ပို့ဆောင်ရေး အဓိက Fields များ (`dtb_shipping`):
- `tracking_number`: အမြန်ချောပို့ စာပို့နံပါတ် (ဥပမာ- `1234-5678-9012`)
- `shipping_date`: ပို့ဆောင်လိုက်သည့် ရက်စွဲ
- `shipping_delivery_date`: ဝယ်ယူသူ လိုချင်သည့် ရက်စွဲ (お届け希望日)
- `shipping_delivery_time`: ဝယ်ယူသူ လိုချင်သည့် အချိန် (お届け希望時間帯 - ဥပမာ 14:00~16:00)

### Shipping Confirmation Mail အလိုအလျောက် ပေးပို့ခြင်း:
Status ကို `7 (発送済み)` သို့ ပြောင်းလိုက်သည်နှင့် EC-CUBE သည် Customer ထံသို့ ချောပို့ Tracking Link ပါသော Email ကို အလိုအလျောက် ထုတ်ပေးပါသည်:

```twig
{# Mail Template နမူနာ: Resource/template/default/Mail/shipping_notify.twig #}
{{ Order.name01 }} 様

ご注文いただきました商品を本日発送いたしました。
商品の配送状況につきましては、下記お問い合わせ番号よりご確認いただけます。

【配送会社】: {{ Shipping.Delivery.name }}
【お問い合わせ番号】: {{ Shipping.tracking_number }}
【配送状況確認URL】: https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?tracking_number={{ Shipping.tracking_number }}
```

---

## 🏠 3. Change Shipping Address (လိပ်စာ ပြင်ဆင်ခြင်းနှင့် ပို့ခ ပြန်တွက်ခြင်း)

Admin Detail စာမျက်နှာတွင် ပို့ဆောင်ရမည့် လိပ်စာကို ပြင်ဆင်နိုင်ပါသည်:

```php
// OrderEditController.php
$Shipping = $Order->getShippings()[0]; // ပထမဆုံး Shipping လိပ်စာ
$Shipping->setName01($form->get('shipping_name01')->getData());
$Shipping->setPostalCode($form->get('shipping_postal_code')->getData());
$Shipping->setPref($newPref); // စီရင်စု ပြောင်းလဲခြင်း
$Shipping->setAddr01($newAddr01);
$Shipping->setAddr02($newAddr02);
```

### ⚠️ အရေးကြီးသော ပြဿနာ: ပို့ဆောင်ခ ပြောင်းလဲသွားခြင်း (送料再計算)
ဥပမာ - ဝယ်ယူသူက မူလက Tokyo လိပ်စာ (ပို့ခ: ¥600) ပေးထားရာမှ Okinawa သို့မဟုတ် Hokkaido (ပို့ခ: ¥1,500) သို့ လိပ်စာ ပြောင်းလိုက်ပါက:

```mermaid
graph LR
    A[Admin changes Prefecture to Okinawa] --> B[PurchaseFlow::calculateFee()]
    B --> C[Fetch DeliveryFee for Okinawa Pref]
    C --> D[Update Order Delivery Fee: ¥1,500]
    D --> E[Recalculate Payment Total: Total + ¥900]
```

EC-CUBE ၏ `PurchaseFlow` မှတဆင့် Fee ကို ပြန်လည်တွက်ချက်ပြီး Order ၏ Total စျေးနှုန်းကို Update ပြုလုပ်ပေးရပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **発送 (Hassou) / 出荷 (Shukka)**: Shipping / Dispatch
- **発送済み (Hassouzumi)**: Shipped
- **お届け先 / 配送先 (Otodokesaki / Haisousaki)**: Shipping Address
- **送り状番号 / お問い合わせ番号 (Okurijou Bangou / Toiawase Bangou)**: Tracking Number
- **配送指定日 (Haisou Shiteibi)**: Scheduled Delivery Date
- **配送時間帯 (Haisou Jikantai)**: Delivery Time Slot (午前中, 14-16時, 18-20時 စသည်)
- **複数配送 (Fukusuu Haisou)**: Multi-destination Shipping
