---
title: "01. Coupon Architecture And Business Logic"
description: "> Core Architectural Question:"
---

## 01 - Coupon Architecture & Where Business Logic Lives (ကူပွန် ဗိသုကာနှင့် Logic တည်ရှိရာနေရာ)

> **Core Architectural Question**:  
> **"Where should the business logic live?"**  
> (ကူပွန် သက်တမ်းကုန်/မကုန် စစ်ဆေးခြင်း၊ လျှော့စျေး တွက်ချက်ခြင်းနှင့် စည်းမျဉ်းများကို စနစ်၏ မည်သည့်နေရာတွင် ရေးသားသင့်သနည်း?)

---

## 🛑 အဘယ်ကြောင့် Controller ထဲတွင် မရေးသင့်သနည်း? (Why NOT in Controller?)

Beginner များ မကြာခဏ အလွယ်တကူ ရေးသားမိတတ်သော အမှား:
```php
// ❌ Controller ထဲတွင် Discount တွက်ချက်မိသော အမှား
public function checkout(Request $request) {
    if ($couponCode === 'SAVE500') {
        $order->setDiscount(500); // ❌ Controller က တိုက်ရိုက် စျေးလျှော့ခြင်း
    }
}
```

### ဤသို့ ရေးပါက ဖြစ်ပေါ်လာမည့် ပြဿနာဆိုးများ:
1. **Cart ပြောင်းလဲမှုတွင် ချို့ယွင်းသွားခြင်း**: Customer က ပစ္စည်း ၁ ခု ဖယ်လိုက်ပါက စုစုပေါင်းငွေ ကျဆင်းသွားသော်လည်း Controller Logic သည် ပြန်လည် မ run တော့သဖြင့် သတ်မှတ်ငွေ မပြည့်ဘဲ လျှော့စျေး ဆက်လက် ရရှိနေမည်။
2. **အခွန်နှင့် ပို့ခ လွဲချော်ခြင်း**: Controller က စျေးနှုန်းကို ပြင်လိုက်သော်လည်း နောက်ကွယ်ရှိ TaxProcessor နှင့် DeliveryFeeProcessor များက ထိုလျှော့စျေးကို ထည့်မတွက်သဖြင့် အခွန်စာရင်းများ လွဲသွားမည်။
3. **Admin Edit တွင် ပျက်စီးခြင်း**: Admin က Order Detail တွင် ပစ္စည်း ပြင်ဆင်သည့်အခါ Controller Logic မပါရှိသဖြင့် ကူပွန် လျှော့စျေး ပျောက်ကွယ်သွားမည်။

---

## ✅ မှန်ကန်သော ဗိသုကာ: `PurchaseFlow` Architecture

EC-CUBE တွင် ငွေကြေး၊ လျှော့စျေး၊ ကူပွန်နှင့် သက်ဆိုင်သော Business Logic အားလုံးကို **`PurchaseFlow`** အတွင်းရှိ **Validator** နှင့် **Processor** ၂ ခုတွင်သာ ခွဲဝေ ထားရှိရပါသည်:

```
[PurchaseFlow Pipeline]
         │
         ├── 1. ItemHolderValidator (CouponValidator)
         │      ├── စစ်ဆေးခြင်း ၁: ကူပွန်ကုဒ် မှန်/မမှန်?
         │      ├── စစ်ဆေးခြင်း ၂: သက်တမ်း ကုန်/မကုန်? (start_date <= NOW <= end_date)
         │      ├── စစ်ဆေးခြင်း ၃: အနည်းဆုံး ဝယ်ယူငွေ ပြည့်/မပြည့်? (subtotal >= min_amount)
         │      ├── စစ်ဆေးခြင်း ၄: အသင်းဝင် ဟုတ်/မဟုတ်? (Member-only check)
         │      └── အကယ်၍ မကိုက်ညီပါက Error ပစ်ချပြီး ရပ်တန့်ခြင်း
         │
         └── 2. DiscountProcessor (CouponDiscountProcessor)
                ├── လျှော့စျေး ပမာဏကို တိကျစွာ တွက်ချက်ခြင်း (定額 or 定率)
                └── Order Item အဖြစ် Discount ထည့်သွင်းခြင်း သို့မဟုတ် order.discount ကို သတ်မှတ်ခြင်း
```

---

## 💻 1. Validator Implementation (စစ်ဆေးရေးအပိုင်း)

`app/Plugin/Coupon/Service/PurchaseFlow/Validator/CouponValidator.php`
```php
namespace Plugin\Coupon\Service\PurchaseFlow\Validator;

use Eccube\Service\PurchaseFlow\ItemHolderInterface;
use Eccube\Service\PurchaseFlow\ItemHolderValidator;
use Eccube\Service\PurchaseFlow\PurchaseContext;
use Eccube\Service\PurchaseFlow\PurchaseFlowException;

class CouponValidator implements ItemHolderValidator
{
    public function validate(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        $Order = $itemHolder;
        $couponCode = $Order->getCouponCode(); // Customer ရိုက်ထည့်ထားသော ကုဒ်

        if (empty($couponCode)) {
            return; // ကူပွန် မသုံးထားပါက ဆက်လက်လုပ်ဆောင်ခွင့်ပြုသည်
        }

        $Coupon = $this->couponRepository->findOneBy(['coupon_code' => $couponCode]);

        // ၁။ ကူပွန် မရှိပါက
        if (!$Coupon) {
            throw new PurchaseFlowException('無効なクーポンコードです (ကူပွန်ကုဒ် မှားယွင်းနေပါသည်)');
        }

        // ၂။ သက်တမ်း စစ်ဆေးခြင်း (Expiration Check)
        $now = new \DateTime();
        if ($now < $Coupon->getStartDate() || $now > $Coupon->getEndDate()) {
            throw new PurchaseFlowException('クーポンの有効期限が切れています (ကူပွန် သက်တမ်းကုန်ဆုံးသွားပါပြီ)');
        }

        // ၃။ အနည်းဆုံး ဝယ်ယူငွေ စစ်ဆေးခြင်း (Minimum Purchase Amount)
        if ($Coupon->getMinAmount() && $Order->getSubtotal() < $Coupon->getMinAmount()) {
            throw new PurchaseFlowException(sprintf(
                'このクーポンは %s 円以上のお買い物でご利用いただけます (ဤကူပွန်သည် အနည်းဆုံး %s ယန်း ဝယ်ယူမှသာ သုံးနိုင်ပါသည်)',
                number_format($Coupon->getMinAmount()),
                number_format($Coupon->getMinAmount())
            ));
        }

        // ၄။ အသင်းဝင် သီးသန့် ကူပွန် စစ်ဆေးခြင်း (Member-only Check)
        if ($Coupon->isMemberOnly() && !$Order->getCustomer()) {
            throw new PurchaseFlowException('このクーポンは会員様限定です。ログインしてください (အသင်းဝင်များသာ သုံးခွင့်ရှိပါသည်)');
        }
    }
}
```

---

## 🧮 2. Processor Implementation (တွက်ချက်ရေးအပိုင်း)

`app/Plugin/Coupon/Service/PurchaseFlow/Processor/CouponDiscountProcessor.php`
```php
namespace Plugin\Coupon\Service\PurchaseFlow\Processor;

use Eccube\Service\PurchaseFlow\ItemHolderInterface;
use Eccube\Service\PurchaseFlow\ItemHolderProcessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;

class CouponDiscountProcessor implements ItemHolderProcessor
{
    public function process(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        $Order = $itemHolder;
        $Coupon = $Order->getCoupon();

        if (!$Coupon) {
            $Order->setDiscount(0);
            return;
        }

        $subtotal = $Order->getSubtotal();
        $discountAmount = 0;

        // ၁။ 定額割引 (Fixed Amount: ဥပမာ ¥500 OFF)
        if ($Coupon->getDiscountType() === Coupon::TYPE_FIXED) {
            $discountAmount = $Coupon->getDiscountPrice();
        }
        // ၂။ 定率割引 (Percentage: ဥပမာ 10% OFF)
        elseif ($Coupon->getDiscountType() === Coupon::TYPE_RATE) {
            // ဂျပန် စံနှုန်းအရ အကြွင်းပြတ်ပါက အောက်သို့ လျှော့ချသည် (floor)
            $discountAmount = floor($subtotal * ($Coupon->getDiscountRate() / 100));
        }

        // လျှော့ငွေသည် ကုန်ပစ္စည်းတန်ဖိုးထက် မကျော်လွန်စေရန် ထိန်းချုပ်ခြင်း
        $discountAmount = min($discountAmount, $subtotal);

        // Order ထဲတွင် Discount ငွေပမာဏ သတ်မှတ်ခြင်း
        $Order->setDiscount($discountAmount);
    }
}
```

---

## 💡 အချုပ် အနှစ်ချုပ် (Summary)

Business Logic များကို `PurchaseFlow` တွင် ရေးသားခြင်းအားဖြင့်:
1. **Auto Re-calculation**: Cart ထဲတွင် ပစ္စည်း အရေအတွက် တိုး/လျှော့တိုင်း ကူပွန် လျှော့စျေးသည် အလိုအလျောက် မှန်ကန်စွာ ပြန်လည် တွက်ချက်သွားမည်။
2. **Data Integrity**: အခွန် (Tax) နှင့် ပို့ခ (Shipping) တွက်ချက်မှုများနှင့် လုံးဝ မလွဲချော်ဘဲ တိကျစွာ အလုပ်လုပ်မည် ဖြစ်ပါသည်။
