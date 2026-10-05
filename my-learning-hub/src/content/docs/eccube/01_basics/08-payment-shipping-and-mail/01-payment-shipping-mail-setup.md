---
title: "01. Payment Shipping Mail Setup"
description: "အွန်လိုင်းစတိုးတစ်ခု၏ အဓိက အသက်သွေးကြောဖြစ်သော ငွေပေးချေမှု (Payment Gateways)၊ ပို့ဆောင်ခ တွက်ချက်မှု (Shipping Fees) နှင့် အော်ဒါအတည်ပြု အီးမေးလ်များ (Transac"
---

## Module 08: Payment, Shipping နှင့် Mail Notification စနစ်များ

အွန်လိုင်းစတိုးတစ်ခု၏ အဓိက အသက်သွေးကြောဖြစ်သော **ငွေပေးချေမှု (Payment Gateways)**၊ **ပို့ဆောင်ခ တွက်ချက်မှု (Shipping Fees)** နှင့် **အော်ဒါအတည်ပြု အီးမေးလ်များ (Transactional Mail Notifications)** ကို ဤအခန်းတွင် ရှင်းလင်းတင်ပြပါမည်။

---

## ၁။ ငွေပေးချေမှုစနစ်များ (Payment Gateways Integration)

EC-CUBE 4.x တွင် ငွေပေးချေမှု နည်းလမ်းများကို အောက်ပါအတိုင်း ခွဲခြားထားပါသည်-

```
                        ┌────────────────────────┐
                        │   EC-CUBE 4 Payments   │
                        └───────────┬────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  Default     │             │ Credit Cards │             │ Modern Pay   │
│ - Bank Trans │             │ - Stripe     │             │ - PayPay     │
│   (銀行振込)  │             │ - GMO Pay    │             │ - Paidy (後払)│
│ - COD        │             │ - SB Payment │             │ - Amazon Pay │
│   (代金引換)  │             │   (ソフトバンク)│             │ - Apple Pay  │
└──────────────┘             └──────────────┘             └──────────────┘
```

### က။ Default Payment Methods (မူရင်းပါပြီးသား နည်းလမ်းများ):
1. **銀行振込 (Bank Transfer)**: Customer မှ ဆိုင်၏ ဘဏ်အကောင့် (ဥပမာ: MUFG, SMBC, Mizuho, Yucho) သို့ ကိုယ်တိုင်ငွေလွှဲပေးချေခြင်း။
2. **代金引換 (Cash on Delivery - COD)**: ပို့ဆောင်ရေးယာဉ်မောင်းထံ ပစ္စည်းရောက်မှ ငွေချေခြင်း (COD ဝန်ဆောင်ခ 手数料 အပို ကောက်ခံနိုင်သည်)။

### ခ။ Credit Card & Modern Online Gateways (Plugin ဖြင့် ချိတ်ဆက်ခြင်း):
- **Stripe**: တပ်ဆင်ရ လွယ်ကူပြီး နိုင်ငံတကာသုံး Credit Cards (Visa, Mastercard, JCB, Amex) များကို ချက်ချင်း လက်ခံနိုင်ခြင်း။
- **GMO Payment Gateway**: ဂျပန်နိုင်ငံ၏ အကြီးဆုံး Payment Processor (Credit Card, Conbini Pay, Carrier Billing)။
- **Paidy (後払い / Pay Later)**: ပစ္စည်းရောက်ပြီးမှ နောက်လတွင် ငွေချေနိုင်သော ဂျပန်လူကြိုက်များသည့် စနစ်။

---

## ၂။ ပို့ဆောင်ခ တွက်ချက်မှုစနစ် (Shipping & Delivery Logic)

EC-CUBE တွင် ပို့ဆောင်ခများကို Admin Panel မှဖြစ်စေ၊ Custom Code ဖြင့်ဖြစ်စေ သတ်မှတ်နိုင်ပါသည်:

### က။ စံသတ်မှတ် ပို့ဆောင်ခ စည်းမျဉ်းများ (Standard Rules):
1. **都道府県別送料 (Prefecture Rates)**: Tokyo (500 JPY), Osaka (600 JPY), Hokkaido/Okinawa (1,200 JPY) စသဖြင့် ဒေသအလိုက် ကွဲပြားသော ပို့ဆောင်ခ ဇယား။
2. **送料無料条件 (Free Shipping Threshold)**: ဝယ်ယူမှု စုစုပေါင်း ၅,၀၀၀ ယန်းနှင့် အထက် ဝယ်ယူပါက ပို့ခအခမဲ့ သတ်မှတ်ခြင်း။

### ခ။ Custom Shipping Logic ရေးသားခြင်း (ဥပမာ: အအေးခန်းပို့ဆောင်ခ クール便):
ကုန်ပစ္စည်းတွင် ရေခဲသေတ္တာ/အအေးခန်းပို့ဆောင်ရန် လိုအပ်သော အစားအသောက်များ ပါဝင်ပါက ပို့ဆောင်ခတွင် +300 JPY အပို ပေါင်းထည့်လိုသည့်အခါ **PurchaseFlow Service** ကို အသုံးပြုပါသည်:

```php
// app/Customize/Service/PurchaseFlow/Processor/CoolDeliveryFeeProcessor.php
namespace Customize\Service\PurchaseFlow\Processor;

use Eccube\Entity\ItemHolderInterface;
use Eccube\Entity\Order;
use Eccube\Service\PurchaseFlow\ItemHolderPreprocessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;

class CoolDeliveryFeeProcessor implements ItemHolderPreprocessor
{
    public function process(ItemHolderInterface $itemHolder, PurchaseContext $context)
    {
        if (!$itemHolder instanceof Order) {
            return;
        }

        // အအေးခန်း ပို့ဆောင်ရမည့် ပစ္စည်း ပါမပါ စစ်ဆေးခြင်း
        $hasCoolItem = false;
        foreach ($itemHolder->getOrderItems() as $item) {
            if ($item->isProduct() && $item->getProductClass()->getProduct()->isCoolDelivery()) {
                $hasCoolItem = true;
                break;
            }
        }

        // အပို ပို့ခ ပေါင်းထည့်ခြင်း
        if ($hasCoolItem) {
            $deliveryFee = $itemHolder->getDeliveryFeeTotal();
            $itemHolder->setDeliveryFeeTotal($deliveryFee + 330); // +330 JPY (Tax incl.)
        }
    }
}
```

---

## ၃။ အလိုအလျောက် အီးမေးလ် ပေးပို့မှုစနစ် (Mail Notification System)

EC-CUBE တွင် အရေးကြီး လုပ်ငန်းစဉ်တိုင်းအတွက် Customer ထံသို့ အလိုအလျောက် Email ပေးပို့ပေးပါသည်:

| Email အမျိုးအစား | အသုံးပြုသည့် Twig Template | ပေးပို့သည့် အချိန် |
| :--- | :--- | :--- |
| **ご注文確認 (Order Confirmation)** | `Mail/order.twig` | Customer အော်ဒါတင်ပြီးသည်နှင့် ချက်ချင်း ပေးပို့ခြင်း။ |
| **出荷完了通知 (Shipping Complete)** | `Mail/shipping_notify.twig` | ပစ္စည်းပို့ဆောင်ပြီး Tracking No. နှင့်အတူ ပေးပို့ခြင်း။ |
| **会員登録完了 (Member Registration)** | `Mail/entry_complete.twig` | အသင်းဝင် မှတ်ပုံတင်ပြီးစီးချိန် ပေးပို့ခြင်း။ |
| **パスワード再設定 (Password Reset)** | `Mail/forgot_mail.twig` | Password မေ့သွား၍ Reset Link ပို့ပေးခြင်း။ |

---

## ၄။ Order Confirmation Mail ကို Customization ပြုလုပ်ခြင်း

အော်ဒါအတည်ပြု အီးမေးလ်တွင် ဆိုင်၏ သီးသန့် ဘဏ်အကောင့် အချက်အလက်များ သို့မဟုတ် မက်ဆေ့ခ်ျ ထည့်သွင်းလိုသည့်အခါ:

### Template Override ပြုလုပ်ပါ:
```bash
# Mail Template Folder ဖန်တီးပါ
mkdir -p app/template/default/Mail

# မူရင်း Mail Twig ကို Copy ကူးပါ
cp src/Eccube/Resource/template/default/Mail/order.twig app/template/default/Mail/order.twig
```

`app/template/default/Mail/order.twig` ထဲတွင် မြန်မာ/ဂျပန် စာသားများ ထည့်သွင်းနိုင်ပါသည်:

```twig
{{ Order.name01 }} {{ Order.name02 }} 様

ကျွန်ုပ်တို့၏ ဆိုင်တွင် အော်ဒါမှာယူအားပေးသည့်အတွက် အထူးပင် ကျေးဇူးတင်ရှိပါသည်။
မှာယူထားသော အော်ဒါအသေးစိတ်မှာ အောက်ပါအတိုင်း ဖြစ်ပါသည်:

================================================================
■ ご注文内容 (မှာယူမှု အသေးစိတ်)
================================================================
ご注文番号 (Order No): {{ Order.order_no }}
ご注文日時 (Order Date): {{ Order.create_date|date('Y-m-d H:i') }}

{% for Item in Order.ProductOrderItems %}
- {{ Item.product_name }} ({{ Item.price_inc_tax|price }}) x {{ Item.quantity }} ခု
{% endfor %}

----------------------------------------------------------------
小計 (Subtotal): {{ Order.subtotal|price }}
送料 (Shipping Fee): {{ Order.delivery_fee_total|price }}
合計金額 (Total Amount): {{ Order.total|price }}
================================================================

■ 銀行振込先 (ဘဏ်ငွေလွှဲရန် အချက်အလက်):
  三菱UFJ銀行 (MUFG Bank)
  渋谷支店 (Shibuya Branch) 普通 1234567
  口座名義: カブシキガイシャ EC-CUBE STORE
```

---

နောက်အခန်းတွင် **[Module 09: Debugging, Cache Management နှင့် Error ဖြေရှင်းနည်းများ](/eccube/01_basics/09-debugging-and-troubleshooting/01-debug-cache-logs-common-errors/)** ကို ဆက်လက်လေ့လာပါမည်။
