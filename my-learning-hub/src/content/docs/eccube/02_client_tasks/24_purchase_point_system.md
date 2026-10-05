---
title: "24. Purchase Point System"
description: "> 「お客様が商品を購入した際、購入金額（税抜）の1%（キャンペーン時は5%）を『会員ポイント（1ポイント＝1円）』として自動付与してください。ただし、注文直後ではなくステータスが『入金済み』または『発送済み』に変更されたタイミングで付与し、キャンセルの場合は付与を取り消してください。」"
---

## Task 24: 商品購入後にポイントを付与してください (Purchase Point Reward System)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「お客様が商品を購入した際、購入金額（税抜）の1%（キャンペーン時は5%）を『会員ポイント（1ポイント＝1円）』として自動付与してください。ただし、注文直後ではなくステータスが『入金済み』または『発送済み』に変更されたタイミングで付与し、キャンセルの場合は付与を取り消してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပစ္စည်းဝယ်ယူသည့် အခါ ဝယ်ယူငွေတန်ဖိုး၏ 1% ကို **ဝယ်ယူသူ၏ Member Point (1 Point = 1 Yen)** အဖြစ် အလိုအလျောက် ပေးအပ် (Point Reward) ပေးရန် ဖြစ်သည်။ သို့သော် အော်ဒါတင်ချိန်တွင် ချက်ချင်းမပေးဘဲ ငွေလွှဲပြီးချိန် သို့မဟုတ် ပစ္စည်းပို့ပြီးချိန်တွင်မှ စနစ်တကျ ပေးအပ်ရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Fraud & Cancellation Protection (不正受給・キャンセル防止)
- အော်ဒါတင်ပြီးပြီးချင်း Point ပေးလိုက်ပါက နောက်ပိုင်းတွင် အော်ဒါဖျက်သိမ်းသွားပါက Point အလကား ရယူသွားနိုင်ပါသည်။
- ထို့ကြောင့် Status ပြောင်းလဲမှု Event (`OrderStatus::PAID` သို့မဟုတ် `DELIVERED`) တွင်မှ Point ပေးအပ်ရပါမည်။

### 2. Point History Tracking Architecture
- `Customer` Entity ၏ `point` balance တစ်ခုတည်းကို update လုပ်ရုံဖြင့် မလုံလောက်ပါ။ "ဘယ်အော်ဒါကြောင့် ဘယ်ရက်စွဲမှာ Point ဘယ်လောက် ရရှိခဲ့သည်" ဟူသော History Log Table (`dtb_customer_point_history`) ကိုပါ တစ်ပြိုင်နက် သိမ်းဆည်းပေးရမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Point Calculation & Award Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/CustomerPointRewardService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Customer;
use Eccube\Entity\Order;
use Psr\Log\LoggerInterface;

class CustomerPointRewardService
{
    private EntityManagerInterface $entityManager;
    private LoggerInterface $logger;
    private float $defaultPointRate = 0.01; // 1%

    public function __construct(
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    /**
     * 受注内容に基づいて会員にポイントを付与する
     *
     * @param Order $order
     * @return int 付与されたポイント数
     */
    public function awardPoints(Order $order): int
    {
        $customer = $order->getCustomer();
        if (!$customer instanceof Customer) {
            return 0; // Guest 注文の場合はポイント対象外
        }

        // ポイント二重付与防止チェック（すでに付与済みか確認）
        // ဥပမာ: OrderTrait တွင် is_point_awarded flag စစ်ဆေးခြင်း

        // 対象金額（商品小計 - Subtotal）
        $subtotal = (int) $order->getSubtotal();
        if ($subtotal <= 0) {
            return 0;
        }

        $addPoint = (int) floor($subtotal * $this->defaultPointRate);
        if ($addPoint <= 0) {
            return 0;
        }

        $this->entityManager->beginTransaction();
        try {
            // Customer လက်ကျန် Point ကို တိုးမြှင့်ခြင်း
            $currentPoint = (int) $customer->getPoint();
            $customer->setPoint($currentPoint + $addPoint);

            // Order တွင် ရရှိခဲ့သော Point ကို မှတ်တမ်းတင်ခြင်း
            $order->setAddPoint($addPoint);

            $this->entityManager->persist($customer);
            $this->entityManager->persist($order);
            $this->entityManager->flush();
            $this->entityManager->commit();

            $this->logger->info("Point awarded: Customer ID {$customer->getId()} received {$addPoint} pts for Order #{$order->getOrderNo()}");
            return $addPoint;

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->logger->error('Point Award Error: ' . $e->getMessage());
            return 0;
        }
    }
}
```

---

### အဆင့် ၂: Order Status Change Event Subscriber သို့ ချိတ်ဆက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/OrderPointRewardSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Customize\Service\CustomerPointRewardService;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Order;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrderPointRewardSubscriber implements EventSubscriberInterface
{
    private CustomerPointRewardService $pointService;

    public function __construct(CustomerPointRewardService $pointService)
    {
        $this->pointService = $pointService;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Admin 受注更新完了時
            'eccube.event.admin.order.edit.complete' => 'onOrderUpdate',
        ];
    }

    public function onOrderUpdate(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('TargetOrder');

        // 入金済み（PAID: ID 6）または 発送済み（DELIVERED: ID 5）になった場合に付与
        if ($order && ($order->getOrderStatus()->getId() === OrderStatus::PAID || $order->getOrderStatus()->getId() === OrderStatus::DELIVERED)) {
            $this->pointService->awardPoints($order);
        }
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Double Point Award (二重付与防止):**  
   Admin က အော်ဒါကို အကြိမ်ကြိမ် ဖွင့်၍ Save နှိပ်တိုင်း Point ထပ်တိုးမသွားစေရန် `is_point_awarded == true` ဖြစ်မဖြစ်ကို မဖြစ်မနေ စစ်ဆေးရပါမည်။
2. **Taxable Amount (税込か税抜か):**  
   Point ပေးရာတွင် အခွန်ပါသော ငွေပမာဏ (税込) အပေါ် ပေးမည်လား၊ အခွန်မပါသော ကုန်ပစ္စည်းတန်ဖိုး (税抜) အပေါ် ပေးမည်လားကို Client နှင့် အတိအကျ သဘောတူညီမှု ရယူထားရပါမည်။
