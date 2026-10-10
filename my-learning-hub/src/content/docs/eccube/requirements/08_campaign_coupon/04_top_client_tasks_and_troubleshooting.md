---
title: "04. Top Client Tasks And Troubleshooting"
description: "> Real-World Client Requirement Guide:"
---

## 04 - Top Client Tasks & Troubleshooting (ကူပွန်ဆိုင်ရာ အသုံးအများဆုံး Client Tasks များနှင့် ဖြေရှင်းနည်းများ)

> **Real-World Client Requirement Guide**:  
> လုပ်ငန်းခွင်တွင် ဂျပန် Client များ အများဆုံး တောင်းဆိုလေ့ရှိသော ကူပွန်နှင့် ပရိုမိုးရှင်းဆိုင်ရာ Task ကြီး ၅ ခုနှင့် ၎င်းတို့ကို အဆင့်ဆင့် ဖြေရှင်းပုံ (Fixing Guide) ကို လက်တွေ့ Code များနှင့်တကွ ဖော်ပြထားပါသည်။

---

## 📌 Task 1: လူတစ်ဦးလျှင် ၁ ကြိမ်သာ သုံးစွဲခွင့် စစ်ဆေးခြင်း (1人1回限り / 重複利用防止)

> **Client Problem**:  
> *"Customer တစ်ယောက်က အသစ်ဝင်သူများအတွက် ထုတ်ပေးထားသော ¥1,000 လျှော့စျေးကူပွန်ကို အော်ဒါ ၂ ကြိမ်၊ ၃ ကြိမ် ခွဲပြီး ထပ်ခါတလဲလဲ အလွဲသုံးစားလုပ် သုံးစွဲနေကြပါသည်၊ ၁ ယောက်လျှင် ၁ ကြိမ်သာ သုံးနိုင်အောင် ပိတ်ပင်ပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Check Usage History in Validator):
ကူပွန် အသုံးပြုမှု မှတ်တမ်းဇယား (`plg_coupon_order`) တွင် လက်ရှိ Customer ID ဖြင့် ယခင်က သုံးဖူးခြင်း ရှိမရှိ စစ်ဆေးရပါမည်:

```php
// CouponValidator.php
if ($Coupon->isOncePerCustomerOnly()) {
    $Customer = $Order->getCustomer();

    if ($Customer) {
        // ထို Customer သည် ဤ ကူပွန်ကို ယခင်က အသုံးပြုခဲ့ဖူးသလား စစ်ဆေးခြင်း
        $usedCount = $this->couponOrderRepository->count([
            'Coupon' => $Coupon,
            'Customer' => $Customer,
        ]);

        if ($usedCount > 0) {
            throw new PurchaseFlowException('このクーポンはお一人様1回限りのご利用となります (ဤကူပွန်သည် လူတစ်ဦးလျှင် ၁ ကြိမ်သာ သုံးခွင့်ရှိပါသည်)');
        }
    }
}
```

---

## 📌 Task 2: ကူပွန်လျှော့ငွေက ကုန်ပစ္စည်းတန်ဖိုးထက် ကြီး၍ အနုတ်ငွေ မဖြစ်စေရန် ကာကွယ်ခြင်း (マイナス請求防止)

> **Client Problem**:  
> *"Customer က ပစ္စည်းတန်ဖိုး ¥1,500 ဖိုး ဝယ်ယူပြီး ¥2,000 တန် ကူပွန် သုံးလိုက်သောအခါ ကျသင့်ငွေသည် -¥500 (အနုတ် ၅၀၀) ဖြစ်သွားပြီး Credit Card Payment Gateway တွင် ငွေဖြတ်မရဘဲ Error တက်သွားပါသည်!"*

### 🛠️ ဖြေရှင်းနည်း (Clamping Discount Amount):
လျှော့စျေး ပမာဏသည် ကုန်ပစ္စည်း စုစုပေါင်း တန်ဖိုးထက် လုံးဝ မကျော်လွန်စေရန် `min()` function ဖြင့် အများဆုံး ကန့်သတ်ရပါမည်:

```php
// CouponDiscountProcessor.php
$subtotal = $Order->getSubtotal(); // ဥပမာ- ¥1,500
$couponDiscount = $Coupon->getDiscountPrice(); // ဥပမာ- ¥2,000

// Discount သည် Subtotal ထက် မကြီးစေရန် ကန့်သတ်ခြင်း
$finalDiscount = min($couponDiscount, $subtotal); // ရလဒ်: ¥1,500 သာ လျှော့ပေးမည်

$Order->setDiscount($finalDiscount);
// ရလဒ်: Payment Total သည် အနုတ်မဖြစ်တော့ဘဲ 0 円 ဖြစ်သွားမည်
```

---

## 📌 Task 3: အခွန် ၈% နှင့် ၁၀% ပါဝင်သော အော်ဒါတွင် လျှော့စျေး ခွဲဝေတွက်ချက်ခြင်း (軽減税率の按分計算)

> **Client Requirement**:  
> *"စားသောက်ကုန် (အခွန် ၈%) နှင့် အထွေထွေပစ္စည်း (အခွန် ၁၀%) နှစ်မျိုးစလုံး ပါဝင်သော Cart တွင် ¥1,000 ကူပွန် သုံးလိုက်ပါက အခွန်ပြဿနာ မဖြစ်စေရန် ထိုလျှော့စျေးကို ၈% နှင့် ၁၀% အချိုးကျ (Proportionally) ခွဲဝေ နှုတ်ယူပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Proportional Tax Distribution):
ဂျပန် အခွန်ဥပဒေအရ စုစုပေါင်း လျှော့စျေးကို အခွန်အမျိုးအစားအလိုက် အချိုးကျ ခွဲဝေပေးရပါသည်:

```php
// အခွန်နှုန်းအလိုက် အချိုးကျ တွက်ချက်ခြင်း နမူနာ
$subtotal8 = $Order->getSubtotalByTaxRate(8);  // e.g. ¥6,000 (60%)
$subtotal10 = $Order->getSubtotalByTaxRate(10); // e.g. ¥4,000 (40%)
$totalSubtotal = $subtotal8 + $subtotal10;      // ¥10,000

$totalDiscount = 1000; // ¥1,000 Discount

// အချိုးကျ ခွဲဝေခြင်း
$discount8 = floor($totalDiscount * ($subtotal8 / $totalSubtotal));   // ¥600 လျှော့မည်
$discount10 = $totalDiscount - $discount8;                           // ¥400 လျှော့မည်
```

---

## 📌 Task 4: ကြော်ငြာ / အီးမေးလ် Link နှိပ်လိုက်သည်နှင့် ကူပွန်ကုဒ် အလိုအလျောက် သွင်းပေးခြင်း (Auto-apply Coupon from URL)

> **Client Requirement**:  
> *"Instagram ကြော်ငြာ သို့မဟုတ် Newsletter ထဲမှ `https://mystore.com/?coupon=SUMMER2026` ဟူသော Link ကို နှိပ်ပြီး ဝင်လာသော Customer များအတွက် Checkout ရောက်သည့်အခါ ကူပွန်ကုဒ်ကို လက်ဖြင့် ရိုက်စရာမလိုဘဲ စနစ်က အလိုအလျောက် ဖြည့်သွင်းပေးထားပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Session-based Request Listener):
```php
namespace Plugin\Coupon\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;

class CouponUrlListener
{
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $couponCode = $request->query->get('coupon');

        // URL တွင် ?coupon=... ပါဝင်လာပါက Session ထဲ သိမ်းထားခြင်း
        if (!empty($couponCode)) {
            $request->getSession()->set('auto_coupon_code', $couponCode);
        }
    }
}
```

Checkout စာမျက်နှာ ရောက်သည့်အခါ ထို Session မှ ကုဒ်ကို ဆွဲထုတ်ပြီး အလိုအလျောက် ထည့်သွင်းပေးနိုင်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **重複利用防止 (Nijuu Riyou Boushi)**: Preventing Duplicate / Multiple Usage
- **マイナス請求防止 (Mainasu Seikyuu Boushi)**: Preventing Negative Amount Charge
- **按分計算 (Anbun Keisan)**: Proportional Distribution Calculation
- **自動適用 (Jidou Tekiyou)**: Auto-apply (ကူပွန် အလိုအလျောက် ထည့်သွင်းခြင်း)
- **クーポン利用履歴 (Kuupon Riyou Rireki)**: Coupon Usage History Log
