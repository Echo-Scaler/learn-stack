---
title: "05. Event Hook System"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 05 - Event / Hook System အသုံးပြုနည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube ၏ Event System ကို အသုံးပြု၍ Core Code ကို မပြောင်းဘဲ Behavior ပြောင်းလဲတတ်ရန်။

---

## 🎯 ရည်ရွယ်ချက်

- EC-Cube ၏ built-in Events များကို နားလည်ရန်
- EventSubscriber ကို မှန်ကန်စွာ register ပြုလုပ်တတ်ရန်
- Order, Customer, Product Events များကို Hook လုပ်တတ်ရန်

---

## 📌 EC-Cube Event Types နှစ်မျိုး

### 1. Symfony Events (Standard)
```
kernel.request     → Request ရောက်သောအခါ
kernel.response    → Response မပို့မီ
kernel.exception   → Error ဖြစ်သောအခါ
```

### 2. EC-Cube Custom Events
```
eccube.event.order.order         → Order confirm ပြုလုပ်သောအခါ
eccube.event.shopping.confirm    → Shopping confirm page
eccube.event.admin.order.edit    → Admin Order edit
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - EventSubscriber တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/MyPluginEvent.php`

```php
<?php

namespace Plugin\MyPlugin;

use Eccube\Entity\Order;
use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Eccube\Event\TemplateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MyPluginEvent implements EventSubscriberInterface
{
    public function __construct(
        // လိုအပ်သော services များကို inject ပြုလုပ်နိုင်သည်
        // private readonly \Swift_Mailer $mailer,
    ) {}

    /**
     * Subscribe ပြုလုပ်မည့် Events များ - ဤနေရာတွင် list ထုတ်ပါ
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // ===== Template Events =====
            'Product/detail.twig'     => 'onProductDetailTwig',
            'Shopping/index.twig'     => 'onShoppingIndexTwig',
            'index.twig'              => 'onFrontTopTwig',

            // ===== EC-Cube Process Events =====
            EccubeEvents::FRONT_SHOPPING_CONFIRM_PROCESSING => 'onShoppingConfirm',
            EccubeEvents::FRONT_SHOPPING_COMPLETE           => 'onShoppingComplete',

            // ===== Symfony Kernel Events =====
            KernelEvents::REQUEST     => [['onKernelRequest', 10]],
        ];
    }

    // ================================================================
    // Template Events
    // ================================================================

    /**
     * Product Detail Page render ဖြစ်သောအခါ
     */
    public function onProductDetailTwig(TemplateEvent $event): void
    {
        // Plugin ၏ Twig snippet ကို page တွင် inject ပြုလုပ်ခြင်း
        $event->addSnippet('@MyPlugin/Product/detail_extra.twig');

        // Template ကို ထပ်ဆောင်းသော data ပို့ခြင်း
        $parameters = $event->getParameters();
        $parameters['plg_custom_message'] = 'Plugin မှ ကြိုဆိုပါသည်!';
        $event->setParameters($parameters);
    }

    /**
     * Shopping Cart / Checkout page
     */
    public function onShoppingIndexTwig(TemplateEvent $event): void
    {
        $event->addSnippet('@MyPlugin/Shopping/extra_section.twig');
    }

    /**
     * Top / Home page
     */
    public function onFrontTopTwig(TemplateEvent $event): void
    {
        // ရက်ရောက်မှ ကြော်ငြာ banner ထည့်ပါ
        $now = new \DateTime();
        $parameters = $event->getParameters();
        $parameters['plg_is_campaign'] = ($now->format('n') == 12); // December = true
        $event->setParameters($parameters);

        $event->addSnippet('@MyPlugin/Top/campaign_banner.twig');
    }

    // ================================================================
    // Process Events (Business Logic)
    // ================================================================

    /**
     * Customer Shopping Confirm ခြင်းမပြုမီ ခေါ်မည်
     */
    public function onShoppingConfirm(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('Order');

        // Order ကို စစ်ဆေးနိုင်သည်
        if ($order->getPaymentTotal() > 100000) {
            // 100,000円 ကျော်သော Order အတွက် မှတ်ချက်ထည့်ပါ
            $order->setNote('[VIP Order] ' . $order->getNote());
        }
    }

    /**
     * Order ပြီးဆုံးသောအခါ ခေါ်မည် (Thank you page မတိုင်မီ)
     */
    public function onShoppingComplete(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('Order');

        // Webhook သို့ Order data ပို့ပါ
        $this->sendOrderWebhook($order);

        // Log သွင်းပါ
        log_info(sprintf(
            '[MyPlugin] Order #%s completed. Total: %s',
            $order->getId(),
            $order->getPaymentTotal()
        ));
    }

    // ================================================================
    // Symfony Kernel Events
    // ================================================================

    /**
     * Request တိုင်းတွင် ခေါ်မည်
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Maintenance Mode စစ်ဆေးခြင်း ဥပမာ
        // if ($this->isMaintenanceMode() && !$request->isXmlHttpRequest()) {
        //     $event->setResponse(new Response('Maintenance...', 503));
        // }
    }

    // ================================================================
    // Private Helper Methods
    // ================================================================

    private function sendOrderWebhook(Order $order): void
    {
        // External Webhook API ကို curl/guzzle ဖြင့် call ပြုလုပ်ပါ
        try {
            $data = [
                'order_id'    => $order->getId(),
                'total'       => $order->getPaymentTotal(),
                'customer'    => $order->getName01() . ' ' . $order->getName02(),
                'email'       => $order->getEmail(),
                'created_at'  => $order->getCreateDate()->format('Y-m-d H:i:s'),
            ];

            // HTTP call ပြုလုပ်ပါ (ဤနေရာတွင် simplified)
            log_info('[MyPlugin] Webhook sent: ' . json_encode($data));
        } catch (\Exception $e) {
            log_error('[MyPlugin] Webhook failed: ' . $e->getMessage());
        }
    }
}
```

---

### အဆင့် 2 - EventSubscriber ကို Register ပြုလုပ်ခြင်း

`app/Plugin/MyPlugin/Resource/config/services.yaml`

```yaml
services:
    Plugin\MyPlugin\MyPluginEvent:
        tags:
            - { name: kernel.event_subscriber }
```

---

### အဆင့် 3 - အရေးကြီးသော EC-Cube Events List

`EccubeEvents.php` class ထဲတွင် ရှိသော constants များ:

```php
// Front-end Events
EccubeEvents::FRONT_PRODUCT_DETAIL_INITIALIZE  // Product detail page load
EccubeEvents::FRONT_CART_ADD_INITIALIZE        // Add to cart
EccubeEvents::FRONT_SHOPPING_CONFIRM_PROCESSING // Order confirm processing
EccubeEvents::FRONT_SHOPPING_COMPLETE           // Order complete

// Admin Events  
EccubeEvents::ADMIN_ORDER_EDIT_INDEX_COMPLETE   // Admin order edit saved
EccubeEvents::ADMIN_PRODUCT_EDIT_COMPLETE       // Admin product edit saved
EccubeEvents::ADMIN_CUSTOMER_EDIT_COMPLETE      // Admin customer edit saved
```

---

### အဆင့် 4 - Custom Event တည်ဆောက်ခြင်း

ကိုယ်ပိုင် Event class ကို တည်ဆောက်နိုင်သည်:

`app/Plugin/MyPlugin/Event/PointAddedEvent.php`

```php
<?php

namespace Plugin\MyPlugin\Event;

use Eccube\Entity\Customer;
use Symfony\Contracts\EventDispatcher\Event;

class PointAddedEvent extends Event
{
    public const NAME = 'my_plugin.point.added';

    public function __construct(
        private readonly Customer $customer,
        private readonly int $points
    ) {}

    public function getCustomer(): Customer
    {
        return $this->customer;
    }

    public function getPoints(): int
    {
        return $this->points;
    }
}
```

**Service ထဲမှ Event ကို Dispatch ပြုလုပ်ခြင်း**:

```php
<?php

namespace Plugin\MyPlugin\Service;

use Plugin\MyPlugin\Event\PointAddedEvent;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Eccube\Entity\Customer;

class PointService
{
    public function __construct(
        private readonly EventDispatcherInterface $eventDispatcher
    ) {}

    public function addPoints(Customer $customer, int $points): void
    {
        // Points logic...
        
        // ကိုယ်ပိုင် Event ကို fire ပြုလုပ်ပါ
        $event = new PointAddedEvent($customer, $points);
        $this->eventDispatcher->dispatch($event, PointAddedEvent::NAME);
    }
}
```

---

## 🔑 Snippet Injection နည်းလမ်းများ

```php
// Template ၏ အောက်ဆုံးတွင် ထည့်ပါ (default)
$event->addSnippet('@MyPlugin/snippet.twig');

// Page ၏ HEAD ထဲတွင် ထည့်ပါ
$event->addSnippet('@MyPlugin/head_snippet.twig', true);
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] `getSubscribedEvents()` return value မှန်ကန်ကြောင်း
- [ ] `services.yaml` တွင် `kernel.event_subscriber` tag ရှိကြောင်း
- [ ] Cache clear ပြုလုပ်ပြီးကြောင်း
- [ ] Log file တွင် Event fire ဖြစ်ကြောင်း စစ်ဆေးပါ

---

## 🐛 Debug အကူအညီ

```bash
# Events များကို list ထုတ်ကြည့်ပါ
bin/console debug:event-dispatcher

# တိကျသော Event ကို filter ပြုလုပ်ပါ
bin/console debug:event-dispatcher 'Product/detail.twig'

# Service Container စစ်ဆေးပါ
bin/console debug:container MyPlugin
```

---

> ➡️ **နောက်တစ်ဆင့်**: [06 - Payment Method](/eccube/requirements/customization-list/06_payment_method/)
