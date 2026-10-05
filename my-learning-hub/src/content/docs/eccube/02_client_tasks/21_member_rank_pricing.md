---
title: "21. Member Rank Pricing"
description: "> 「会員のランク（レギュラー、シルバー、ゴールド、VIP）に応じて、商品の販売価格を割引（例: ゴールド会員は全品5%OFF、VIP会員は全品10%OFF）してください。カート画面および注文手続き画面でも自動的に会員ランク割引価格が適用されるようにしてください。」"
---

## Task 21: 会員ランクによって価格を変更してください (Member Rank Pricing)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「会員のランク（レギュラー、シルバー、ゴールド、VIP）に応じて、商品の販売価格を割引（例: ゴールド会員は全品5%OFF、VIP会員は全品10%OFF）してください。カート画面および注文手続き画面でも自動的に会員ランク割引価格が適用されるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
အဖွဲ့ဝင် အဆင့်အတန်း (Member Ranks: Regular, Silver, Gold, VIP) အလိုက် ကုန်ပစ္စည်းဈေးနှုန်းကို လျှော့စျေးဖြင့် ရောင်းချပေးရန် (ဥပမာ - Gold Member သည် 5% လျှော့စျေး၊ VIP Member သည် 10% လျှော့စျေး) နှင့် Cart/Checkout တွင် တိကျစွာ တွက်ချက်ပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE PurchaseFlow Processor သဘောတရား
- Controller သို့မဟုတ် Twig တွင် ဈေးနှုန်းကို `price * 0.9` ဟု တွက်ချက်ရုံဖြင့် မလုံလောက်ပါ။ Cart ထဲထည့်ခြင်း၊ ပို့ဆောင်ခတွက်ခြင်း၊ Payment စစ်ဆေးခြင်း စသည်တို့တွင် ဈေးနှုန်းကွာဟမှု မဖြစ်စေရန် EC-CUBE ၏ **PurchaseFlow Pipeline (ItemHolderPreprocessor)** တွင် စနစ်တကျ တွက်ချက်ရမည်။

### 2. PurchaseFlow ကို အသုံးပြုရသည့် အကျိုးကျေးဇူး
- PurchaseFlow Processor တွင် Discount ထည့်သွင်းခြင်းဖြင့် Order Database ထဲတွင် `OrderItem` အနေဖြင့် "会員ランク割引 (Member Rank Discount)" ဟူသော သီးသန့် Discount Line တိကျစွာ ဝင်ရောက်သွားမည် ဖြစ်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: PurchaseFlow Discount Processor ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/PurchaseFlow/Processor/MemberRankDiscountProcessor.php`

```php
<?php

namespace Customize\Service\PurchaseFlow\Processor;

use Eccube\Annotation\OrderFlow;
use Eccube\Entity\ItemHolderInterface;
use Eccube\Entity\Master\TaxType;
use Eccube\Entity\Order;
use Eccube\Entity\OrderItem;
use Eccube\Repository\Master\TaxTypeRepository;
use Eccube\Service\PurchaseFlow\ItemHolderPreprocessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;
use Symfony\Component\Security\Core\Security;

/**
 * @OrderFlow
 */
class MemberRankDiscountProcessor implements ItemHolderPreprocessor
{
    private Security $security;
    private TaxTypeRepository $taxTypeRepository;

    public function __construct(
        Security $security,
        TaxTypeRepository $taxTypeRepository
    ) {
        $this->security = $security;
        $this->taxTypeRepository = $taxTypeRepository;
    }

    public function process(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        // အကယ်၍ Cart သို့မဟုတ် Order မဟုတ်ပါက ကျော်မည်
        if (!$itemHolder instanceof Order) {
            return;
        }

        $customer = $itemHolder->getCustomer();
        if (!$customer) {
            return;
        }

        // ရှိပြီးသား Member Rank Discount Item အဟောင်းများကို ဖယ်ရှားခြင်း
        foreach ($itemHolder->getOrderItems() as $item) {
            if ($item->getProcessorName() === self::class) {
                $itemHolder->removeOrderItem($item);
            }
        }

        // Customer Rank ကို စစ်ဆေးခြင်း (ဥပမာ: VIP = 10% discount, Gold = 5% discount)
        // CustomerTrait ထဲတွင် rank_id ရှိသည်ဟု ယူဆပါသည်
        $discountRate = 0.0;
        $rankName = '会員';

        // ဥပမာ စမ်းသပ်ရန် VIP အဖြစ် သတ်မှတ်ခြင်း
        $discountRate = 0.10; // 10% OFF
        $rankName = 'VIP会員優待割引 (10% OFF)';

        if ($discountRate <= 0.0) {
            return;
        }

        // Product စုစုပေါင်း တန်ဖိုးကို တွက်ချက်ခြင်း
        $subtotal = $itemHolder->getSubtotal();
        $discountAmount = (int) round($subtotal * $discountRate);

        if ($discountAmount <= 0) {
            return;
        }

        // အနုတ်ပြ လျှော့စျေး Item တစ်ခု Order ထဲသို့ ပေါင်းထည့်ခြင်း
        $discountItem = new OrderItem();
        $discountItem->setProductName($rankName);
        $discountItem->setPrice(-$discountAmount);
        $discountItem->setQuantity(1);
        $discountItem->setOrderItemType($this->taxTypeRepository->find(TaxType::NON_TAXABLE));
        $discountItem->setProcessorName(self::class);
        $discountItem->setOrder($itemHolder);

        $itemHolder->addOrderItem($discountItem);
    }
}
```

---

### အဆင့် ၂: Frontend Twig တွင် Member Badge ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Block/header.twig` (သို့မဟုတ် Product/list.twig)

```twig
{% if app.user %}
    <span class="badge badge-warning text-dark">
        <i class="fas fa-crown"></i> VIP会員 (全品10%OFF適用中)
    </span>
{% endif %}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Tax Rounding (端数処理):**  
   Discount တွက်ချက်ရာတွင် 1 Yen အောက် ဒသမကိန်း (端数) ထွက်လာပါက ဆိုင်ရှင်၏ စည်းမျဉ်းအတိုင်း Round Down (`floor`), Round Up (`ceil`) သို့မဟုတ် Round (`round`) တိကျစွာ ပြုလုပ်ပေးရပါမည်။
2. **OrderFlow Annotation:**  
   Processor Class ၏ DocBlock တွင် `@OrderFlow` Annotation ပါဝင်ရပါမည်။ သို့မှသာ EC-CUBE ၏ Dependency Injection Container က PurchaseFlow Pipeline ထဲသို့ အလိုအလျောက် မှတ်ပုံတင်ပေးမည် ဖြစ်သည်။
