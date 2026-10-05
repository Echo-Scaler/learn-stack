---
title: "23. Custom Coupon Rules"
description: "> 「クーポンの利用条件として、既存の『有効期限』や『利用回数』に加えて、『合計注文金額が5,000円以上の場合のみ利用可能』や『セール対象商品にはクーポン適用不可』、『新規会員の初回注文限定』といった独自ルールを追加してください。」"
---

## Task 23: クーポン使用条件を追加してください (Custom Coupon Rules & Validation)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「クーポンの利用条件として、既存の『有効期限』や『利用回数』に加えて、『合計注文金額が5,000円以上の場合のみ利用可能』や『セール対象商品にはクーポン適用不可』、『新規会員の初回注文限定』といった独自ルールを追加してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Coupon အသုံးပြုရာတွင် မူရင်းစည်းမျဉ်းများအပြင် **"အနည်းဆုံး အော်ဒါတန်ဖိုး ၅,၀၀၀ ယန်းပြည့်မှ သုံးခွင့်ပြုခြင်း"**၊ **"Sale ပစ္စည်းများကို ကူပွန် မလျှော့ပေးခြင်း"** သို့မဟုတ် **"ပထမဆုံး အကြိမ် ဝယ်ယူသူသာ သုံးနိုင်ခြင်း"** စသည့် စည်းမျဉ်းသစ်များ ထပ်တိုး စစ်ဆေးပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Dedicated Validation Service Architecture
- Coupon စစ်ဆေးသည့် Logic များကို Checkout Form သို့မဟုတ် Controller ထဲတွင် ရောပြွမ်းမရေးသားဘဲ `CouponRuleValidatorService` အဖြစ် သီးသန့် ရေးသားခြင်းဖြင့် Rule အသစ်များ ထပ်တိုးလိုသည့်အခါ Clean ဖြစ်စွာ ထည့်သွင်းနိုင်သည်။

### 2. PurchaseFlow Validation Pipeline
- Checkout အဆင့်တွင် ဝယ်ယူသူက ကုန်ပစ္စည်း အရေအတွက်ကို ပြောင်းလဲလိုက်ချိန်တွင် သတ်မှတ် အနိမ့်ဆုံးငွေပမာဏ (Minimum Subtotal) အောက် လျော့ကျသွားပါက PurchaseFlow Validator က အလိုအလျောက် သိရှိပြီး ကူပွန်ကို ပယ်ဖျက်ပေးနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Coupon Rule Validator Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/CouponRuleValidatorService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;
use Eccube\Entity\Customer;
use Eccube\Repository\OrderRepository;

class CouponRuleValidatorService
{
    private OrderRepository $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * クーポンの利用条件を検証する
     *
     * @param Order $order
     * @param array $couponData
     * @return array [ 'valid' => bool, 'message' => string|null ]
     */
    public function validateCouponRules(Order $order, array $couponData): array
    {
        // စည်းမျဉ်း ၁: အနိမ့်ဆုံး အော်ဒါတန်ဖိုး (Minimum Subtotal 5,000 Yen) စစ်ဆေးခြင်း
        $minAmount = $couponData['min_amount'] ?? 5000;
        if ($order->getSubtotal() < $minAmount) {
            return [
                'valid' => false,
                'message' => sprintf('このクーポンは商品合計が ¥%s 以上の場合にのみご利用いただけます。', number_format($minAmount)),
            ];
        }

        // စည်းမျဉ်း ၂: ပထမဆုံး အကြိမ် ဝယ်ယူသူ ဟုတ်/မဟုတ် (First-time Buyer Only) စစ်ဆေးခြင်း
        $isFirstTimeOnly = $couponData['is_first_time_only'] ?? false;
        if ($isFirstTimeOnly) {
            $customer = $order->getCustomer();
            if (!$customer instanceof Customer) {
                return [
                    'valid' => false,
                    'message' => 'このクーポンは新規会員の初回購入限定です。会員登録またはログインしてください。',
                ];
            }

            // အရင်က အော်ဒါတင်ဖူးခြင်း ရှိ/မရှိ DB စစ်ဆေးခြင်း
            $pastOrdersCount = $this->orderRepository->createQueryBuilder('o')
                ->select('COUNT(o.id)')
                ->where('o.Customer = :customer')
                ->andWhere('o.OrderStatus != :cancelStatus')
                ->setParameter('customer', $customer)
                ->setParameter('cancelStatus', \Eccube\Entity\Master\OrderStatus::CANCEL)
                ->getQuery()
                ->getSingleScalarResult();

            if ($pastOrdersCount > 0) {
                return [
                    'valid' => false,
                    'message' => 'このクーポンは過去にご注文履歴がないお客様の初回限定クーポンです。',
                ];
            }
        }

        // စည်းမျဉ်း ၃: Sale ပစ္စည်းများ ပါဝင်မှု စစ်ဆေးခြင်း
        foreach ($order->getOrderItems() as $item) {
            if ($item->isProduct()) {
                $product = $item->getProductClass()->getProduct();
                // ဥပမာ: Sale ပစ္စည်း ဟုတ်မဟုတ် စစ်ဆေးခြင်း
                if (method_exists($product, 'isSaleItem') && $product->isSaleItem()) {
                    return [
                        'valid' => false,
                        'message' => 'セール対象商品が含まれている場合、本クーポンはご利用いただけません。',
                    ];
                }
            }
        }

        return ['valid' => true, 'message' => null];
    }
}
```

---

### အဆင့် ၂: PurchaseFlow Validator သို့ ချိတ်ဆက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/PurchaseFlow/Processor/CouponValidationProcessor.php`

```php
<?php

namespace Customize\Service\PurchaseFlow\Processor;

use Customize\Service\CouponRuleValidatorService;
use Eccube\Annotation\OrderFlow;
use Eccube\Entity\ItemHolderInterface;
use Eccube\Entity\Order;
use Eccube\Service\PurchaseFlow\ItemHolderValidator;
use Eccube\Service\PurchaseFlow\PurchaseContext;

/**
 * @OrderFlow
 */
class CouponValidationProcessor implements ItemHolderValidator
{
    private CouponRuleValidatorService $validatorService;

    public function __construct(CouponRuleValidatorService $validatorService)
    {
        $this->validatorService = $validatorService;
    }

    public function validate(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        if (!$itemHolder instanceof Order) {
            return;
        }

        // Coupon အသုံးပြုထားပါက စည်းမျဉ်းများ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးခြင်း
        // အကယ်၍ မကိုက်ညီပါက Warning Message ပေးပို့ခြင်း
    }

    public function handle(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        // မကိုက်ညီသော အခါ ကူပွန်ကို ဖြုတ်ချပြီး Total ပြန်လည်တွက်ချက်ခြင်း
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Shipping Fee & Discounts (送料と手数料の扱い):**  
   "5,000 Yen အထက်" ဟု သတ်မှတ်ရာတွင် ပို့ဆောင်ခ (送料) နှင့် ငွေပေးချေမှု ဝန်ဆောင်ခ (手数料) ပါဝင်သလား၊ သို့မဟုတ် ပစ္စည်းတန်ဖိုး သီးသန့် (商品合計 - Subtotal) လားဆိုသည်ကို Client အား ရှင်းလင်းစွာ အတည်ပြု ရပါမည်။
2. **Clear Error Feedback (わかりやすいエラー表示):**  
   အဘယ်ကြောင့် ကူပွန်သုံးမရသည်ကို ဝယ်ယူသူ ချက်ချင်း နားလည်စေရန် တိကျသော အကြောင်းပြချက် စာသားကို Japanese Keigo (丁寧語) ဖြင့် ဖော်ပြပေးရန် အရေးကြီးပါသည်။
