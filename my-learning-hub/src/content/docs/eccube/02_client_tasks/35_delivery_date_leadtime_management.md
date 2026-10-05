---
title: "35. Delivery Date Leadtime Management"
description: "> 「商品ごとに『出荷リードタイム（例: 即日発送、3営業日後出荷、受注生産品14日後出荷）』を設定できるようにしてください。購入手続き画面のお届け希望日カレンダーにおいて、カート内の最長リードタイム、店舗の定休日（土日祝・年末年始）、当日の注文締め切り時刻（14:00）、配送先地域（北海道・沖縄等の配送所要日数）、配"
---

## Task 35: 商品ごとの配送リードタイムと配送可能日管理 (Delivery Calendar, Cutoff & Lead Time)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品ごとに『出荷リードタイム（例: 即日発送、3営業日後出荷、受注生産品14日後出荷）』を設定できるようにしてください。購入手続き画面のお届け希望日カレンダーにおいて、カート内の最長リードタイム、店舗の定休日（土日祝・年末年始）、当日の注文締め切り時刻（14:00）、配送先地域（北海道・沖縄等の配送所要日数）、配送時間帯（午前中、14-16時等）を自動計算し、実際に配達可能な日付のみを選択肢として表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်းတစ်ခုချင်းစီအလိုက် ပစ္စည်းထုတ်လုပ်/ပြင်ဆင်ချိန် **(Lead Time: ဥပမာ - ချက်ချင်းပို့၊ ၃ ရက်ကြာ၊ ၁၄ ရက်ကြာ)** သတ်မှတ်ပြီး၊ ဆိုင်ပိတ်ရက်များ၊ နေ့စဉ် အော်ဒါပိတ်ချိန် **(Cutoff Time: 14:00)** နှင့် နယ်ဝေးဒေသများကို ထည့်သွင်းတွက်ချက်ကာ ဝယ်ယူသူ လက်ခံရရှိနိုင်သော အစောဆုံးရက်စွဲများကိုသာ **Delivery Calendar (お届け希望日)** တွင် ရွေးချယ်ခွင့်ပြုခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Delivery Promise Integrity (配送クレームの防止)
- ဂျပန် e-Commerce တွင် "အော်ဒါတင်စဉ်က မနက်ဖြန် ရောက်မည်ဟု ရွေးလိုက်သော်လည်း အမှန်တကယ် ပစ္စည်းရောက်မလာခြင်း" သည် အကြီးမားဆုံး Complaint (クレーム) ဖြစ်သည်။
- Lead Time နှင့် Calendar Holiday ကို စနစ်တကျ မတွက်ချက်ပါက မဖြစ်နိုင်သော ရက်စွဲများကို Customer က ရွေးချယ်သွားနိုင်ပါသည်။

### 2. Dedicated DeliveryCalculatorService Architecture
- Delivery Date Calculation သည် ရှုပ်ထွေးသော Business Logic ဖြစ်သဖြင့် Form သို့မဟုတ် Controller ထဲတွင် မရေးဘဲ သီးသန့် Service အဖြစ် တည်ဆောက်ကာ Yamato/Sagawa API စည်းမျဉ်းများနှင့် ချိတ်ဆက်ရပါမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Product Entity တွင် Lead Time Field ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductLeadTimeTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductLeadTimeTrait
{
    /**
     * 出荷リードタイム日数 (営業日ベース)
     * @ORM\Column(name="delivery_lead_time_days", type="integer", options={"default": 1})
     */
    private int $delivery_lead_time_days = 1;

    public function getDeliveryLeadTimeDays(): int
    {
        return $this->delivery_lead_time_days;
    }

    public function setDeliveryLeadTimeDays(int $days): self
    {
        $this->delivery_lead_time_days = $days;
        return $this;
    }
}
```

---

### အဆင့် ၂: Delivery Calendar Calculation Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/DeliveryCalendarService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;

class DeliveryCalendarService
{
    // 当日出荷締め切り時刻 (例: 14:00)
    private int $cutoffHour = 14;

    /**
     * 注文内容に基づき、最短お届け可能日および選択可能な日付リスト（14日間）を算出する
     *
     * @param Order $order
     * @return array [\DateTimeInterface]
     */
    public function getSelectableDeliveryDates(Order $order): array
    {
        // ၁။ Cart ထဲရှိ ပစ္စည်းများအနက် အကြာဆုံး Lead Time ကို ရှာဖွေခြင်း
        $maxLeadTime = 1;
        foreach ($order->getOrderItems() as $item) {
            if ($item->isProduct()) {
                $product = $item->getProductClass()->getProduct();
                if (method_exists($product, 'getDeliveryLeadTimeDays')) {
                    $leadTime = $product->getDeliveryLeadTimeDays();
                    if ($leadTime > $maxLeadTime) {
                        $maxLeadTime = $leadTime;
                    }
                }
            }
        }

        // ၂။ 當日 Cutoff Time (14:00) ကျော်လွန်မှု စစ်ဆေးခြင်း
        $currentDateTime = new \DateTime();
        $baseDate = clone $currentDateTime;
        if ((int)$currentDateTime->format('H') >= $this->cutoffHour) {
            // 14:00 ကျော်ပါက နောက်တစ်ရက်မှ စတင်ရေတွက်ခြင်း
            $baseDate->modify('+1 day');
        }

        // ၃။ Lead Time အလိုက် ရုံးဖွင့်ရက် (Business Days) ပေါင်းထည့်ခြင်း (စနေ၊ တနင်္ဂနွေ ကျော်ခြင်း)
        $daysAdded = 0;
        while ($daysAdded < $maxLeadTime) {
            $baseDate->modify('+1 day');
            // 6 = Saturday, 7 = Sunday
            if ($baseDate->format('N') < 6) {
                $daysAdded++;
            }
        }

        // ၄။ 配送先地域（遠隔地: 北海道・沖縄・離島）の配送所要日数
        $shipping = $order->getShippings()->first();
        $prefId = $shipping && $shipping->getPref() ? $shipping->getPref()->getId() : null;

        // 1: 北海道, 47: 沖縄
        if ($prefId === 1 || $prefId === 47) {
            $baseDate->modify('+2 days'); // နယ်ဝေး ၂ ရက် ထပ်ပေါင်း
        } else {
            $baseDate->modify('+1 day'); // ပုံမှန် နောက်တစ်ရက် ရောက်ရှိ
        }

        $earliestDeliveryDate = clone $baseDate;

        // ၅။ ရွေးချယ်နိုင်သော ရက်စွဲ ၁၄ ရက်စာ List ထုတ်ပေးခြင်း
        $selectableDates = [];
        for ($i = 0; $i < 14; $i++) {
            $d = clone $earliestDeliveryDate;
            $d->modify("+{$i} days");
            $selectableDates[$d->format('Y-m-d')] = $d->format('Y年m月d日') . ' (' . $this->getJapaneseDayOfWeek($d) . ')';
        }

        return $selectableDates;
    }

    private function getJapaneseDayOfWeek(\DateTimeInterface $date): string
    {
        $days = ['日', '月', '火', '水', '木', '金', '土'];
        return $days[(int)$date->format('w')];
    }
}
```

---

### အဆင့် ၃: Shopping Delivery Form နှင့် Twig သို့ ချိတ်ဆက်ခြင်း
Checkout Step တွင် ပို့ဆောင်မည့် ရက်စွဲ Dropdown ကို အထက်ပါ Service မှ ထွက်လာသော `$selectableDates` ဖြင့် ဖြည့်သွင်းပေးနိုင်ပါသည်။

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **National Holidays (日本の祝日・振替休日):**  
   စနေ၊ တနင်္ဂနွေအပြင် ဂျပန်အစိုးရ ရုံးပိတ်ရက်များ (祝日) နှင့် နှစ်သစ်ကူးပိတ်ရက် (年末年始 12/29〜1/3)၊ အိုဘွန်းပိတ်ရက် (お盆) များကို Database သို့မဟုတ် Google Calendar API ဖြင့် စစ်ဆေးပေးရပါမည်။
2. **Delivery Slots (時間帯指定):**  
   Yamato Transport (ヤマト運輸) နှင့် Sagawa Express (佐川急便) တို့တွင် အသုံးပြုသော အချိန်ပိုင်း ကုဒ်များ ကွဲပြားနိုင်သောကြောင့် Delivery Method အလိုက် အချိန်ပိုင်း Dropdown ကို Dynamic ပြောင်းလဲပေးသင့်ပါသည်။
