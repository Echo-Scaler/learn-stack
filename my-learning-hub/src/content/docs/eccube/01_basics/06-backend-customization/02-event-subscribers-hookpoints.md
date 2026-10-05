---
title: "02. Event Subscribers Hookpoints"
description: "EC-CUBE 4 တွင် Core Code များကို မထိခိုက်စေဘဲ မူရင်း Logic များ (ဥပမာ: Product Detail Page ဖွင့်ချိန်၊ အော်ဒါတင်ပြီးချိန်၊ Customer Login ဝင်ချိန်) တွင် မိမိတို"
---

## Module 06 - အခန်း ၂: Event Subscribers နှင့် Hook Points အသုံးပြုပုံ

EC-CUBE 4 တွင် Core Code များကို မထိခိုက်စေဘဲ မူရင်း Logic များ (ဥပမာ: Product Detail Page ဖွင့်ချိန်၊ အော်ဒါတင်ပြီးချိန်၊ Customer Login ဝင်ချိန်) တွင် မိမိတို့၏ Custom Code များကို ကြားဖြတ် Run ရန်အတွက် **Event Subscribers (Hook Points)** ကို အသုံးပြုပါသည်။

---

## ၁။ Event System အလုပ်လုပ်ပုံ သဘောတရား

Symfony ၏ `EventDispatcher` သည် သတ်မှတ်ထားသော အချိန်ကာလ (Event Trigger) တွင် Listener / Subscriber များကို ခေါ်ယူပေးပါသည်:

```
[ EC-CUBE Core: Product Detail Action ]
                  │
                  ▼
[ Trigger Event: eccube.event.controller.product_detail.initialize ]
                  │
                  ├─────────────────────────────────────────┐
                  ▼                                         ▼
   [ Core Execution Continues ]             [ Your Custom EventSubscriber ]
                                            (Log View, Check VIP Discount,
                                             Inject Extra Parameters)
                  │                                         │
                  ▼                                         │
[ Trigger Event: eccube.event.render.product_detail.before ] ◄──┘
                  │
                  ▼
[ Twig Render HTML with Injected Data ]
```

---

## ၂။ EC-CUBE ရှိ အဓိက Event အမျိုးအစားများ

1. **Controller Lifecycle Events (`eccube.event.controller.*`)**:
   - `eccube.event.controller.product_list.initialize` (Product List စတင်ချိန်)
   - `eccube.event.controller.product_detail.complete` (Product Detail ပြီးဆုံးချိန်)
   - `eccube.event.controller.shopping.complete` (အော်ဒါ အောင်မြင်စွာ တင်ပြီးချိန်)

2. **Template Render Events / Hook Points (`eccube.event.render.*`)**:
   - `eccube.event.render.product_detail.before` (Product Detail HTML မပြမီ Twig သို့ Variable ထည့်ပေးခြင်း သို့မဟုတ် HTML Snippet ထည့်သွင်းခြင်း)
   - `eccube.event.render.admin_product_edit.before` (Admin Product Edit တွင် Custom Input ထည့်သွင်းခြင်း)

---

## ၃။ လက်တွေ့ ဥပမာ (၁): Product Detail တွင် ကြည့်ရှုသူအရေအတွက် (View Counter) မှတ်တမ်းတင်ခြင်း

`app/Customize/EventSubscriber/ProductViewSubscriber.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Event\TemplateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductViewSubscriber implements EventSubscriberInterface
{
    /**
     * Listen လုပ်မည့် Event များနှင့် Method Name များကို သတ်မှတ်ခြင်း
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // Product Detail Page HTML မပြမီ အလုပ်လုပ်မည့် Hook Point
            'eccube.event.render.product_detail.before' => 'onProductDetailRender',
        ];
    }

    public function onProductDetailRender(TemplateEvent $event): void
    {
        // 1. Controller မှ Twig သို့ ပေးပို့လိုက်သော Product Object ကို ရယူခြင်း
        $parameters = $event->getParameters();
        $product = $parameters['Product'] ?? null;

        if ($product) {
            // 2. Custom Data (ဥပမာ: စိတ်ကြိုက် Message သို့မဟုတ် VIP Discount အချက်အလက်) ထည့်သွင်းခြင်း
            $parameters['custom_notice'] = '🔥 ယခုပစ္စည်းကို ယနေ့တွင် လူပေါင်း ၅၀ ကျော် ကြည့်ရှုနေပါသည်!';
            
            // 3. ပြင်ဆင်ထားသော Parameters များကို Template သို့ ပြန်လည် ထည့်သွင်းပေးခြင်း
            $event->setParameters($parameters);

            // 4. HTML Snippet ကို သီးသန့် Source Code မပြင်ဘဲ အလိုအလျောက် ပေါင်းထည့်ခြင်း (Optional Snippet Injection)
            $customHtml = '<div class="alert alert-warning my-2">' . $parameters['custom_notice'] . '</div>';
            $source = $event->getSource();
            // Twig ထဲရှိ သတ်မှတ် comment tag သို့မဟုတ် class အနီးတွင် ထည့်သွင်းခြင်း
            $source = str_replace('{{ Product.name }}</h1>', '{{ Product.name }}</h1>' . $customHtml, $source);
            $event->setSource($source);
        }
    }
}
```

---

## ၄။ လက်တွေ့ ဥပမာ (၂): အော်ဒါတင်ပြီးချိန်တွင် External Webhook / CRM သို့ အသိပေးခြင်း

Customer တစ်ဦး အော်ဒါအောင်မြင်စွာ တင်ပြီးချိန်တွင် အခြားပြင်ပစနစ် (Discord / Slack / CRM API) သို့ အချက်အလက် လှမ်းပို့လိုသည့်အခါ-

`app/Customize/EventSubscriber/OrderCompleteSubscriber.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Psr\Log\LoggerInterface;

class OrderCompleteSubscriber implements EventSubscriberInterface
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'eccube.event.controller.shopping.complete' => 'onShoppingComplete',
        ];
    }

    public function onShoppingComplete(EventArgs $event): void
    {
        // အော်ဒါ Object ကို ရယူခြင်း
        $order = $event->getArgument('Order');

        if ($order) {
            $orderNo = $order->getOrderNo();
            $totalAmount = $order->getTotal();

            // Log ဖိုင်တွင် မှတ်တမ်းရေးခြင်း
            $this->logger->info(sprintf('အော်ဒါအသစ် ရောက်ရှိပါသည်: Order #%s, Total: %s JPY', $orderNo, $totalAmount));

            // ပြင်ပ Webhook API သို့ CURL ဖြင့် Data လှမ်းပို့နိုင်ပါသည်
            // $this->sendToExternalCRM($order);
        }
    }
}
```

---

## ၅။ EventSubscriber များ အလုပ်လုပ်ကြောင်း စစ်ဆေးခြင်း

ဖိုင်အသစ် ရေးပြီးပါက Symfony Container ကို Cache Clear လုပ်ပေးရပါမည်:

```bash
bin/console cache:clear
```

Registered ဖြစ်နေသော Event Subscriber များကို စစ်ဆေးရန်:
```bash
bin/console debug:event-dispatcher eccube.event.render.product_detail.before
```

---

နောက်အခန်းတွင် **[Module 06 - အခန်း ၃: Entity Extension (Trait ဖြင့် Column အသစ်ထည့်ခြင်း)](/eccube/01_basics/06-backend-customization/03-entity-extension-customize/)** ကို ဆက်လက်လေ့လာပါမည်။
