---
title: "02. Transactional Emails"
description: "> Client Overview:"
---

## 02 - Transactional Emails (အဓိက အီးမေးလ် ၆ မျိုး)

> **Client Overview**:  
> E-Commerce ဝဘ်ဆိုက်တစ်ခုတွင် အလိုအလျောက် ပေးပို့လေ့ရှိသော Transactional Emails ၆ မျိုး ရှိပြီး၊ တစ်ခုချင်းစီ၏ ပေးပို့သည့် အချိန်ကာလ၊ ပါဝင်ရမည့် အချက်အလက်များနှင့် သက်ဆိုင်ရာ Template ဖိုင်များကို အသေးစိတ် ဖော်ပြထားပါသည်။

---

## 📬 အဓိက အီးမေးလ် ၆ မျိုး အကျဉ်းချုပ် ဇယား

| No. | အီးမေးလ် အမည် | ဂျပန်အမည် | ပေးပို့သည့် အချိန်ကာလ | သက်ဆိုင်ရာ Method | Template ဖိုင် |
|:---:|:---|:---|:---|:---|:---|
| 01 | **Order Confirmation** | 注文完了メール (サンクスメール) | Customer က "注文する" နှိပ်ပြီးသည်နှင့် ချက်ချင်း | `sendOrderMail()` | `Mail/order.twig` |
| 02 | **Payment Confirmation** | 入金確認メール | ဘဏ်လွှဲ သို့မဟုတ် CVS ငွေဝင်ကြောင်း အတည်ပြုပြီးချိန် | `sendPaymentReceivedMail()` | `Mail/payment_received.twig` |
| 03 | **Shipping Notification** | 出荷完了メール (発送通知) | ပစ္စည်း ချောပို့အပ်နှံပြီး Tracking No ရရှိချိန် | `sendShippingNotifyMail()` | `Mail/shipping_notify.twig` |
| 04 | **Registration Email** | 会員登録完了メール | အသင်းဝင် စာရင်းသွင်း အတည်ပြုပြီးချိန် | `sendCustomerConfirmMail()` | `Mail/entry_confirm.twig` |
| 05 | **Password Reset** | パスワード再設定メール | Customer က Password မေ့သွား၍ တောင်းဆိုချိန် | `sendPasswordResetMail()` | `Mail/forgot_mail.twig` |
| 06 | **Cancellation Email** | 注文キャンセルメール | အော်ဒါ ဖျက်သိမ်းလိုက်ချိန် | `sendOrderCancelMail()` | `Mail/order_cancel.twig` |

---

## 🔍 ၁။ 注文完了メール (Order Confirmation / Thanks Email)
- **အချိန်**: Customer က အော်ဒါတင်လိုက်သည်နှင့် ၁ စက္ကန့်အတွင်း အလိုအလျောက် ထွက်ရှိသည်။
- **ပါဝင်သော အချက်အလက်**: အော်ဒါနံပါတ်၊ မှာယူသော ပစ္စည်းစာရင်း၊ ပို့ဆောင်ရမည့် လိပ်စာ၊ ငွေပေးချေနည်းလမ်းနှင့် စုစုပေါင်း ကျသင့်ငွေ။

---

## 💳 ၂။ 入金確認メール (Payment Confirmation)
- **အချိန်**: ဘဏ်လွှဲ (銀行振込) သို့မဟုတ် Convenience Store တွင် Customer ငွေချေပြီးကြောင်း စနစ်က Webhook ရရှိချိန် သို့မဟုတ် Admin က အတည်ပြုချိန်တွင် ပေးပို့သည်။
- **ရည်ရွယ်ချက်**: Customer အား "ငွေလက်ခံရရှိပြီးပါပြီ၊ ပစ္စည်းစတင် ထုပ်ပိုးနေပါပြီ" ဟု စိတ်အေးချမ်းစေရန် အသိပေးခြင်း။

```
【件名】: 【My Store】ご入金を確認いたしました（注文番号：20260921-0001）
【本文抜粋】:
ご入金いただき誠にありがとうございます。
本日、お客様からのご入金を確認いたしました。
商品の発送準備に入らせていただきます。発送完了時に改めてご連絡いたします。
```

---

## 🚚 ၃။ 出荷完了メール (Shipping Notification - အလွန်အရေးကြီးသည်)
- **အချိန်**: ချောပို့ထံ ပါဆယ်ထုပ် အပ်နှံပြီး ချောပို့နံပါတ် (Tracking Number) ရရှိချိန်တွင် ပေးပို့သည်။
- **ပါဝင်ရမည့် အချက်အလက်**: ချောပို့ကုမ္ပဏီ (Yamato, Sagawa, JP Post)၊ Tracking Number နှင့် ၎င်းကို တိုက်ရိုက် စစ်ဆေးနိုင်သော **Tracking URL**။

```twig
【配送会社】: {{ Shipping.Delivery.name }}
【お問い合わせ番号】: {{ Shipping.tracking_number }}
【配送状況確認URL】: https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?tracking_number={{ Shipping.tracking_number }}
```

---

## 👤 ၄။ 会員登録案内メール (Registration Confirmation)
- **Double Opt-in စနစ်**: Email လိပ်စာ မှန်ကန်ကြောင်း အတည်ပြုရန်အတွက် တစ်ခါသုံး **Activation URL** ကို ထည့်သွင်းပေးပို့သည်။
- **သက်တမ်း**: Link ကို ၂၄ နာရီအတွင်း နှိပ်ရန် သတိပေးချက် ပါဝင်သည်။

---

## 🔑 ၅။ パスワード再設定メール (Password Reset)
- **အချိန်**: Customer က Password မေ့သွား၍ `/forgot` စာမျက်နှာတွင် Email ရိုက်ထည့်လိုက်ချိန်တွင် ပေးပို့သည်။
- **လုံခြုံရေး**: Password အသစ်ကို Email ထဲတွင် Plain text အဖြစ် လုံးဝ မပို့ဘဲ၊ လျှို့ဝှက် Token ပါသော Password Reset URL (`/forgot/reset/{token}`) ကိုသာ ပို့ပေးရပါမည်။

---

## 🛑 ၆။ 注文キャンセルメール (Order Cancellation)
- **အချိန်**: Admin က Status ကို "3: 注文取消し" သို့ ပြောင်းလိုက်ချိန်တွင် Customer ထံ အသိပေးခြင်း။
- **ပါဝင်သော အချက်အလက်**: ဖျက်သိမ်းရသည့် အကြောင်းရင်း (ဥပမာ- Customer တောင်းဆိုမှု၊ စတော့ပြတ်လပ်မှု) နှင့် Credit Card ငွေဖြတ်မှုကို ပယ်ဖျက်လိုက်ပြီဖြစ်ကြောင်း အတည်ပြုချက်။
