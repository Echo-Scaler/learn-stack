---
title: "03. Order Status Change And Bulk"
description: "> Client Requirements:"
---

## 03 - Change Order Status & Bulk Processing (Status ပြောင်းလဲခြင်းနှင့် အစုလိုက် စီမံခြင်း)

> **Client Requirements**:
> 1. **Change order status (အော်ဒါ Status တစ်ခုချင်း ပြောင်းလဲခြင်း)**: အော်ဒါတစ်ခု၏ အခြေအနေကို "新規受付" မှ "入金済み" သို့မဟုတ် "対応中" သို့ လွယ်ကူစွာ ပြောင်းလဲနိုင်ရမည်ဖြစ်ပြီး Customer ထံ အသိပေးအီးမေးလ် ပေးပို့နိုင်ရမည်။
> 2. **Bulk order processing (အော်ဒါ အများအပြားကို တစ်ပြိုင်နက် ပြောင်းလဲခြင်း)**: နေ့စဉ် ဝင်ရောက်လာသော အော်ဒါ ရာနှင့်ချီကို Checkbox များ အမှန်ခြစ်ပြီး ခလုတ်တစ်ချက်တည်းဖြင့် "対応中" သို့မဟုတ် "発送済み" သို့ အစုလိုက် (Bulk Status Update) ပြုလုပ်နိုင်ရမည်။

---

## 🔄 1. Change Order Status (တစ်ခုချင်း ပြောင်းလဲခြင်း Architecture)

Admin သည် Order Detail စာမျက်နှာ (`OrderEditController`) ရှိ Dropdown မှ Status ကို ပြောင်းလဲသည့်အခါ အောက်ပါအဆင့်များအတိုင်း ဖြစ်ပေါ်ပါသည်:

```
[Admin selects New Status from Dropdown]
                  │
                  ▼ (HTTP POST)
      [OrderEditController::edit()]
                  │
                  ├─► [Check State Machine Transition Rules]
                  │
                  ├─► [Update dtb_order.order_status_id]
                  │
                  ├─► [Dispatch Event: ADMIN_ORDER_EDIT_COMPLETE]
                  │
                  ▼
   [Prompt / Send Email Notification to Customer]
```

### Controller Logic နမူနာ:
```php
// OrderEditController.php
$OldStatus = $Order->getOrderStatus();
$NewStatus = $form->get('OrderStatus')->getData();

if ($OldStatus->getId() !== $NewStatus->getId()) {
    // Status အသစ် သတ်မှတ်ခြင်း
    $Order->setOrderStatus($NewStatus);
    
    // Status ပြောင်းလဲသွားသည့် Event ပစ်လွှတ်ခြင်း
    $event = new EventArgs(['Order' => $Order, 'OldStatus' => $OldStatus], $request);
    $this->eventDispatcher->dispatch($event, EccubeEvents::ADMIN_ORDER_EDIT_STATUS_COMPLETE);

    $this->entityManager->flush();
}
```

---

## ⚡ 2. Bulk Order Processing (အော်ဒါများစွာ အစုလိုက် စီမံခြင်း)

Client ဆိုင်ကြီးများတွင် အော်ဒါတစ်ခုချင်းစီ ဝင်ပြင်နေရန် အချိန်မရှိသောကြောင့် **受注一覧 (Order List)** စာမျက်နှာတွင် Checkbox အမှန်ခြစ်၍ တစ်ပြိုင်နက် အလုပ်လုပ်နိုင်သော စနစ် ပါဝင်ပါသည်:

```
[Order List Screen]
├── [✓] Order #101  ── Customer A  ── ¥5,400  ── [新規受付]
├── [✓] Order #102  ── Customer B  ── ¥3,200  ── [新規受付]
├── [✓] Order #103  ── Customer C  ── ¥8,900  ── [新規受付]
└── [Bulk Action Dropdown: "対応中" သို့ ပြောင်းမည်] ➔ [一括適用 (Apply)] Click!
```

### Controller Implementation Architecture:
EC-CUBE ၏ `OrderController::bulkStatus()` Method က တာဝန်ယူ လုပ်ဆောင်ပါသည်:

```php
// src/Eccube/Controller/Admin/Order/OrderController.php

#[Route('/%eccube_admin_route%/order/bulk/status', name: 'admin_order_bulk_status', methods: ['POST'])]
public function bulkStatus(Request $request)
{
    $this->isTokenValid();

    // Checkbox ဖြင့် ရွေးချယ်ထားသော Order ID များကို ရယူခြင်း
    $orderIds = $request->get('ids');
    $statusId = $request->get('status');

    if (empty($orderIds) || empty($statusId)) {
        $this->addError('admin.order.bulk_status_empty', 'admin');
        return $this->redirectToRoute('admin_order');
    }

    $OrderStatus = $this->orderStatusRepository->find($statusId);

    $this->entityManager->beginTransaction();
    try {
        $count = 0;
        foreach ($orderIds as $orderId) {
            $Order = $this->orderRepository->find($orderId);
            if ($Order) {
                $Order->setOrderStatus($OrderStatus);
                $count++;
            }
        }

        $this->entityManager->flush();
        $this->entityManager->commit();

        $this->addSuccess($count.' 件の受注ステータスを変更しました (Status အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ)', 'admin');
    } catch (\Exception $e) {
        $this->entityManager->rollback();
        $this->addError('admin.order.bulk_status_failed', 'admin');
    }

    return $this->redirectToRoute('admin_order');
}
```

---

## 🎨 Twig Template တွင် Checkbox All (အားလုံး အမှန်ခြစ်ရန်) JavaScript

```javascript
// admin/Order/index.twig ရှိ Bulk Checkbox Logic
$('#check-all').on('change', function () {
    $('.order-check-item').prop('checked', $(this).prop('checked'));
    updateBulkButtonState();
});

function updateBulkButtonState() {
    var checkedCount = $('.order-check-item:checked').length;
    if (checkedCount > 0) {
        $('#btn-bulk-action').prop('disabled', false).text('ရွေးချယ်ထားသော ' + checkedCount + ' ခုကို ပြောင်းမည်');
    } else {
        $('#btn-bulk-action').prop('disabled', true).text('အစုလိုက် ပြောင်းမည်');
    }
}
```

---

## 📧 Status ပြောင်းပြီးနောက် Auto-Mail ပို့ဆောင်ခြင်း Customization

Client အများစု တောင်းဆိုလေ့ရှိသော အချက်:  
> *"Status ကို '発送済み (Shipped)' သို့ ပြောင်းလိုက်ပါက Customer ဆီသို့ 'ကုန်ပစ္စည်း ပို့ဆောင်ပြီးပါပြီ' ဆိုသော Email ကို စနစ်မှ Auto ပို့ပေးပါ။"*

### Event Subscriber ဖြင့် အကောင်အထည်ဖော်ပုံ:
```php
namespace Plugin\AutoOrderMail\EventSubscriber;

use Eccube\Entity\Master\OrderStatus;
use Eccube\Event\EventArgs;
use Eccube\Event\EccubeEvents;
use Eccube\Service\MailService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrderStatusMailSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly MailService $mailService) {}

    public static function getSubscribedEvents(): array
    {
        return [
            EccubeEvents::ADMIN_ORDER_EDIT_STATUS_COMPLETE => 'onStatusChange',
        ];
    }

    public function onStatusChange(EventArgs $event): void
    {
        $Order = $event->getArgument('Order');
        
        // Status သည် '発送済み (ID: 7)' ဖြစ်သွားပါက
        if ($Order->getOrderStatus()->getId() === OrderStatus::ORDER_DELIVERED) {
            // Shipping Confirmation Mail ပေးပို့ခြင်း
            $this->mailService->sendShippingNotifyMail($Order);
        }
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **ステータス変更 (Suteetasu Henkou)**: Status Change
- **一括操作 (Ikkatsu Sousa)**: Bulk Operations / Batch Actions
- **一括ステータス変更 (Ikkatsu Suteetasu Henkou)**: Bulk Status Change
- **一括メール送信 (Ikkatsu Meeru Soushin)**: Bulk Email Sending
- **全選択 (Zen Sentaku)**: Select All Checkbox
