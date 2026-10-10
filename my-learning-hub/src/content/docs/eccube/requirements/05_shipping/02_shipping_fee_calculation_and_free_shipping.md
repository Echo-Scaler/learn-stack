---
title: "02. Shipping Fee Calculation And Free Shipping"
description: "> Client Requirements:"
---

## 02 - Shipping Fee Calculation & Free Shipping (ပို့ခ တွက်ချက်ခြင်းနှင့် ပို့ခအခမဲ့ စနစ်)

> **Client Requirements**:
> 1. **Shipping fee calculation (ပို့ခ တွက်ချက်ခြင်း ပုံစံများ)**: တစ်နိုင်ငံလုံး တပြေးညီပို့ခ (全国一律送料)၊ စီရင်စု ၄၇ ခုအလိုက် ပို့ခ (都道府県別送料) သို့မဟုတ် ပရိဘောဂကဲ့သို့ ပစ္စည်းကြီးများအတွက် ကုန်ပစ္စည်း တစ်ခုချင်း သီးသန့် ပို့ခ (商品個別送料) များကို စိတ်ကြိုက် သတ်မှတ်နိုင်ရမည်။
> 2. **Free shipping condition (သတ်မှတ်ငွေပြည့်ပါက ပို့ခအခမဲ့)**: "ဝယ်ယူငွေ ¥5,000 (သို့မဟုတ် ¥10,000) ကျော်ပါက ပို့ခအခမဲ့ (送料無料)" စနစ် ထည့်သွင်းပေးရမည်။
> 3. **Remote region exception (အဝေးဒေသ ခြွင်းချက်)**: "တစ်နိုင်ငံလုံး ပို့ခအခမဲ့ ဖြစ်စေကာမူ Hokkaido နှင့် Okinawa သို့ ပို့ပါက ပို့ခ အပြည့်အဝ အခမဲ့ မဟုတ်ဘဲ အခြေခံပို့ခ နုတ်ပြီး ပိုလျှံငွေ (ဥပမာ- ¥800) ကို ကောက်ခံပေးပါ" ဟူသော ခြွင်းချက် စည်းမျဉ်း ထည့်သွင်းနိုင်ရမည်။

---

## 🧮 1. Shipping Fee Calculation Architecture (`dtb_delivery_fee`)

EC-CUBE တွင် ပို့ခများကို စီရင်စုအလိုက် `dtb_delivery_fee` ဇယားတွင် သိမ်းဆည်းထားပါသည်:

```
[Customer selects Tokyo as Shipping Destination (pref_id: 13)]
                         │
                         ▼
        [Query dtb_delivery_fee]
        WHERE delivery_id = 1 AND pref_id = 13
                         │
                         ▼
             [Base Shipping Fee: ¥700]
```

### ပို့ခ ပုံစံ ၃ မျိုး:
1. **全国一律送料 (Flat Rate)**: စီရင်စု ၄၇ ခုစလုံးကို တူညီသော ပို့ခ (ဥပမာ- ¥600) သတ်မှတ်ခြင်း။
2. **都道府県別送料 (Prefecture-based)**: Tokyo သည် ¥700၊ Osaka သည် ¥800၊ Okinawa သည် ¥1,600 ဟု ခွဲခြား သတ်မှတ်ခြင်း။
3. **商品個別送料 (Product-specific Fee)**: ဆိုဖာ သို့မဟုတ် ရေခဲသေတ္တာ ကဲ့သို့ ပစ္စည်းကြီးများတွင် `dtb_product` ၌ သီးသန့် ပို့ခ (ဥပမာ- ¥3,000) ရိုက်ထည့်ထားပြီး၊ ပုံမှန်ပို့ခ အပေါ်သို့ ထပ်ပေါင်း ကောက်ခံခြင်း။

---

## 🎁 2. Free Shipping Architecture: "〇〇円以上で送料無料"

EC-CUBE ၏ `PurchaseFlow` အတွင်းရှိ **`DeliveryFeePreprocessor`** က ပို့ခအခမဲ့ ဟုတ်မဟုတ် အောက်ပါအတိုင်း တွက်ချက်ပါသည်:

```mermaid
graph TD
    A[Calculate Product Subtotal] --> B{Subtotal >= delivery_free_amount? e.g. ¥5,000}
    B -- Yes --> C[Set Delivery Fee = 0 円 (送料無料)]
    B -- No --> D[Fetch Regional Fee from dtb_delivery_fee]
    D --> E[Check for Product-specific Individual Fees]
    E --> F[Total Delivery Fee Calculated]
```

---

## 💻 `DeliveryFeePreprocessor` Code Implementation

```php
// Eccube\Service\PurchaseFlow\Processor\DeliveryFeePreprocessor.php
public function process(ItemInterface $item, PurchaseContext $context)
{
    $Order = $context->getOrder();
    $subtotal = $Order->getSubtotal(); // ကုန်ပစ္စည်း စုစုပေါင်း တန်ဖိုး

    // ဆိုင်၏ အခမဲ့ ပို့ခ သတ်မှတ်ချက် ပမာဏ (ဥပမာ- 5,000 円)
    $freeAmount = $this->eccubeConfig['eccube_delivery_free_amount'];

    foreach ($Order->getShippings() as $Shipping) {
        $deliveryFee = $this->deliveryFeeRepository->findOneBy([
            'Delivery' => $Shipping->getDelivery(),
            'Pref' => $Shipping->getPref(),
        ]);

        $fee = $deliveryFee ? $deliveryFee->getFee() : 0;

        // သတ်မှတ်ငွေ ပြည့်ပါက ပို့ခ အခမဲ့ (0 円) သတ်မှတ်ခြင်း
        if ($freeAmount && $subtotal >= $freeAmount) {
            $fee = 0;
        }

        // Individual Product Delivery Fees (ကုန်ပစ္စည်း သီးသန့် ပို့ခများ ရှိပါက ပေါင်းခြင်း)
        foreach ($Shipping->getOrderItems() as $orderItem) {
            if ($orderItem->isProduct()) {
                $Product = $orderItem->getProductClass()->getProduct();
                if ($Product->getDeliveryFee() > 0) {
                    $fee += ($Product->getDeliveryFee() * $orderItem->getQuantity());
                }
            }
        }

        $Shipping->setDeliveryFee($fee);
    }
}
```

---

## ⚡ Client အမေးများသော Requirement: Okinawa / Hokkaido ခြွင်းချက်

ဂျပန် Client တိုင်းနီးပါး တောင်းဆိုလေ့ရှိသော စည်းမျဉ်း:  
> *"¥5,000 ကျော်ပါက တစ်နိုင်ငံလုံး ပို့ခအခမဲ့ ဖြစ်သော်လည်း၊ ပို့ခ အလွန်ကြီးမားသော **Hokkaido (¥1,400) နှင့် Okinawa (¥1,800)** ကို လုံးဝ အခမဲ့ မပေးနိုင်ပါ။ အခြေခံပို့ခ ¥700 ကိုသာ Discount လျှော့ပေးပြီး ကျန် ပိုလျှံငွေ (Hokkaido: ¥700, Okinawa: ¥1,100) ကို ကောက်ခံပေးပါ။"*

### Custom Delivery Fee Processor ဖြင့် ဖြေရှင်းပုံ:
```php
// Okinawa / Hokkaido ခြွင်းချက် Logic
if ($subtotal >= $freeAmount) {
    $prefId = $Shipping->getPref()->getId();
    
    // Hokkaido (ID: 1) သို့မဟုတ် Okinawa (ID: 47) ဖြစ်ပါက
    if ($prefId === 1 || $prefId === 47) {
        $standardDiscount = 700; // ပုံမှန် ပို့ခ Discount
        $fee = max(0, $fee - $standardDiscount); // ပိုလျှံငွေကိုသာ ကောက်ခံခြင်း
    } else {
        $fee = 0; // အခြား နေရာများ အားလုံး အခမဲ့
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **全国一律送料 (Zenkoku Ichiritsu Souryou)**: Flat Rate Shipping Nationwide
- **都道府県別送料 (Todoufuken-betsu Souryou)**: Regional Shipping Fee by Prefecture
- **商品個別送料 (Shouhin Kobetsu Souryou)**: Product-specific Shipping Surcharge
- **送料無料ライン (Souryou Muryou Rain)**: Free Shipping Threshold / Line
- **差額請求 (Sagaku Seikyuu)**: Charging the Difference / Surcharge
