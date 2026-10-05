---
title: "01. Shipping Methods And Regions"
description: "> Client Requirements:"
---

## 01 - Shipping Methods & Regional Zones (ပို့ဆောင်ရေး နည်းလမ်းများနှင့် ဒေသများ)

> **Client Requirements**:
> 1. **Shipping method (ပို့ဆောင်ရေး နည်းလမ်းများ သတ်မှတ်ခြင်း)**: ပုံမှန်ချောပို့ (Yamato 宅急便, Sagawa 飛脚宅配便)၊ စာတိုက်ပို့ (ゆうパック)၊ စာရွက်စာတမ်း/အထည်ပါးပို့ (ネコポス / ゆうパケット) နှင့် အအေးခန်းပို့ (クール便) စသည့် နည်းလမ်းများကို စိတ်ကြိုက် သတ်မှတ်နိုင်ရမည်။
> 2. **Shipping region (ဒေသအလိုက် ပို့ဆောင်ခွဲခြားခြင်း)**: ဂျပန်နိုင်ငံ၏ ၄၇ စီရင်စု (Tokyo, Osaka, Hokkaido, Okinawa စသည်) အပေါ် မူတည်၍ ပို့ဆောင်ခနှင့် ရောက်ရှိမည့်ရက်များကို ကွဲပြားစွာ သတ်မှတ်နိုင်ရမည်။ ကျွန်းဝေးဒေသများ (離島) အတွက် အပိုဆောင်း ကူးတို့ခ (中継料) သတ်မှတ်နိုင်ရမည်။
> 3. **Product Sale Types (商品種別 - အအေးခန်းနှင့် ပုံမှန်ပစ္စည်း ပေါင်းစပ်မရခြင်း)**: ပုံမှန် အင်္ကျီနှင့် ရေခဲမုန့်/အသားကဲ့သို့ အအေးခန်းပို့ ပစ္စည်းများကို Cart တစ်ခုတည်းတွင် တစ်ပြိုင်နက် ရောနှော ဝယ်ယူခွင့် မပြုရ (非同梱ルール)။

---

## 🏛️ EC-CUBE Delivery Configuration: `dtb_delivery`

Admin သည် **設定 ➔ 店舗設定 ➔ 配送方法設定** တွင် ပို့ဆောင်ရေး နည်းလမ်းများကို သတ်မှတ်ပါသည်:

```
[dtb_delivery Table]
├── id: 1 ── ヤマト宅急便 (Yamato Standard) ── SaleType: 1 (通常商品)
├── id: 2 ── クール宅急便 (Yamato Cool/Frozen) ── SaleType: 2 (冷凍・冷蔵商品)
├── id: 3 ── ネコポス (Nekopos Post Drop) ── SaleType: 1 (通常商品)
└── id: 4 ── 佐川急便 (Sagawa Express) ── SaleType: 1 (通常商品)
```

---

## 🗺️ ဂျပန်နိုင်ငံ ၄၇ စီရင်စုနှင့် Regional Zones

ဂျပန်နိုင်ငံ၏ ဒေသကြီးများကို အောက်ပါအတိုင်း ဇုန်များ ခွဲခြားလေ့ရှိပါသည်:

| ဒေသကြီးအမည် (Zone) | အဓိက စီရင်စုများ | ပုံမှန် ပို့ဆောင်ခ ပမာဏ |
|:---|:---|:---:|
| **関東 (Kanto)** | Tokyo, Kanagawa, Chiba, Saitama | ¥600 ～ ¥800 (အပေါဆုံး) |
| **関西 (Kansai)** | Osaka, Kyoto, Hyogo, Nara | ¥700 ～ ¥900 |
| **東海 / 中部 (Chubu)** | Aichi, Shizuoka, Gifu | ¥700 ～ ¥900 |
| **東北 (Tohoku)** | Miyagi, Fukushima, Aomori | ¥800 ～ ¥1,000 |
| **九州 (Kyushu)** | Fukuoka, Kumamoto, Kagoshima | ¥900 ～ ¥1,200 |
| **北海道 (Hokkaido)** | Hokkaido | ¥1,200 ～ ¥1,600 (ဝေးလံဒေသ) |
| **沖縄 (Okinawa)** | Okinawa | ¥1,500 ～ ¥2,000 (အမြင့်ဆုံး) |

---

## ❄️ အအေးခန်းနှင့် ပုံမှန်ပစ္စည်း ပေါင်းစပ်မရခြင်း (商品種別 & 同梱・非同梱)

EC-CUBE တွင် Beginner များ မဖြစ်မနေ သိထားရမည့် အရေးကြီးဆုံး စည်းမျဉ်းမှာ **`dtb_sale_type (商品種別)`** ဖြစ်ပါသည်:

```mermaid
graph TD
    A[Customer browses products] --> B[Product 1: T-Shirt -> SaleType: 1 通常]
    A --> C[Product 2: Ice Cream -> SaleType: 2 クール便]

    B --> D{Add to Cart}
    C --> D

    D --> E[EC-CUBE Cart Separation Rule]
    E --> F[Cart 1: 通常商品 Cart -> Delivery: ヤマト宅急便]
    E --> G[Cart 2: クール商品 Cart -> Delivery: クール宅急便]

    Note over F,G: စနစ်သည် Cart ၂ ခု အလိုအလျောက် ခွဲခြားလိုက်ပြီး Checkout ၂ ကြိမ် သီးခြား ငွေချေစေသည်
```

### အဘယ်ကြောင့် Cart ခွဲရသနည်း?
ရိုးရိုး အင်္ကျီနှင့် ရေခဲမုန့်ကို သေတ္တာတစ်ခုတည်းတွင် အတူထည့်၍ မရပါ (ရေခဲမုန့် အရည်ပျော်ပြီး အင်္ကျီ ပျက်စီးနိုင်သည်)။ ထို့ကြောင့် EC-CUBE သည် ကုန်ပစ္စည်း အမျိုးအစား (SaleType) မတူညီပါက Cart ကို သီးခြားစီ ခွဲထုတ်ပြီး ပို့ဆောင်ခကိုလည်း သီးခြားစီ ကောက်ခံပါသည်။

---

## 🏝️ ကျွန်းဝေးဒေသများ (離島対応 & 中継料)

ဂျပန်နိုင်ငံတွင် Sado ကျွန်း၊ Izu ကျွန်းစု၊ Tsushima စသည့် သီးသန့်ကျွန်းဝေးများ (離島) သို့ ပို့ဆောင်ပါက ပုံမှန် စီရင်စုပို့ခ အပြင် **ကူးတို့သင်္ဘော အပိုဆောင်းခ (中継料 - Relay Fee: ¥500 ~ ¥1,500)** ထပ်မံ ကျသင့်လေ့ရှိသည်။
- **ဖြေရှင်းနည်း**: စာတိုက်သင်္ကေတ (Postal Code) ၏ ပထမ ၃ လုံးကို စစ်ဆေး၍ ကျွန်းဝေးဒေသ ဟုတ်ပါက ပို့ခထဲသို့ 中継料 အလိုအလျောက် ပေါင်းထည့်ပေးသော Delivery Extension Plugin များကို တပ်ဆင် အသုံးပြုကြပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **配送業者 (Haisou Gyousha)**: Logistics Carrier (Yamato, Sagawa, JP Post)
- **商品種別 (Shouhin Shubetsu)**: Product Sale Type (通常商品, クール便, 定期商品)
- **同梱 (Doukon)**: Bundled / Combined Shipping in one box
- **非同梱 (Hi-doukon)**: Separate / Uncombinable Shipping
- **離島 (Ritou)**: Remote / Isolated Islands
- **中継料 (Chuukeiryou)**: Relay / Remote Area Surcharge
