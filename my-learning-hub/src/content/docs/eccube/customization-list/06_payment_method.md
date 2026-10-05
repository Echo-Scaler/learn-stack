---
title: "06. Payment Method"
description: "> အဆင့်: Advanced | EC-Cube Version: 4.2+"
---

## 06 - Payment Method ထည့်သွင်းနည်း

> **အဆင့်**: Advanced | **EC-Cube Version**: 4.2+

EC-Cube တွင် ကိုယ်ပိုင် Payment Method (ငွေပေးချေနည်း) ကို Plugin ဖြင့် ထည့်သွင်းနည်း။

---

## 🎯 ရည်ရွယ်ချက်

- EC-Cube ၏ Payment Interface ကို implement ပြုလုပ်တတ်ရန်
- Checkout flow ကို ကိုယ်ပိုင် logic ဖြင့် ထိန်းသိမ်းတတ်ရန်
- Admin Panel တွင် Payment Method ကို configure ပြုလုပ်တတ်ရန်

---

## 📁 ဖိုင် Structure

```
app/Plugin/MyPayment/
├── Controller/
│   └── PaymentController.php      ← Payment processing
├── Method/
│   └── MyPaymentMethod.php        ← Core payment logic
├── Service/
│   └── MyPaymentService.php       ← API calls
├── Resource/
│   └── template/
│       └── payment_form.twig      ← Payment form
└── PluginManager.php
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Payment Method Class တည်ဆောက်ခြင်း

`app/Plugin/MyPayment/Method/MyPaymentMethod.php`

```php
<?php

namespace Plugin\MyPayment\Method;

use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Order;
use Eccube\Repository\Master\OrderStatusRepository;
use Eccube\Service\Payment\PaymentDispatcher;
use Eccube\Service\Payment\PaymentMethodInterface;
use Eccube\Service\Payment\PaymentResult;
use Eccube\Service\PurchaseFlow\PurchaseContext;
use Eccube\Service\PurchaseFlow\PurchaseFlow;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;

class MyPaymentMethod implements PaymentMethodInterface
{
    public function __construct(
        private readonly Order $order,
        private readonly FormInterface $form,
        private readonly RouterInterface $router,
        private readonly PurchaseFlow $shoppingPurchaseFlow,
        private readonly OrderStatusRepository $orderStatusRepository,
    ) {}

    /**
     * ငွေပေးချေမှု ပြုလုပ်ခြင်း - ဤနေရာတွင် Payment Gateway API ကို call ပြုလုပ်ပါ
     */
    public function apply(): PaymentDispatcher|PaymentResult
    {
        // ===== Option A: External Payment Page (Redirect) =====
        // Payment gateway ၏ URL ကို ရယူပြီး Redirect ပြုလုပ်ပါ
        
        $dispatcher = new PaymentDispatcher();
        
        // Payment Gateway URL (ဥပမာ)
        $returnUrl = $this->router->generate(
            'my_payment_complete',
            [],
            RouterInterface::ABSOLUTE_URL
        );
        
        // Gateway သို့ POST parameters တည်ဆောက်ပါ
        $params = [
            'order_id'   => $this->order->getId(),
            'amount'     => $this->order->getPaymentTotal(),
            'currency'   => 'JPY',
            'return_url' => $returnUrl,
        ];
        
        // Gateway URL သို့ Redirect ပြုလုပ်ပါ
        $gatewayUrl = 'https://payment-gateway.example.com/pay?' . http_build_query($params);
        $dispatcher->setResponse(new RedirectResponse($gatewayUrl));
        $dispatcher->setForward(false);
        
        return $dispatcher;
    }

    /**
     * Payment ပြီးဆုံးပြီးနောက် Order ကို confirm ပြုလုပ်ခြင်း
     */
    public function checkout(): PaymentResult
    {
        $result = new PaymentResult();

        // Order status ကို "新規受付" (New) သို့ ပြောင်းပါ
        $OrderStatus = $this->orderStatusRepository->find(OrderStatus::NEW);
        $this->order->setOrderStatus($OrderStatus);

        // Purchase flow ကို run ပြုလုပ်ပါ (Stock reduce, Points add, etc.)
        try {
            $this->shoppingPurchaseFlow->commit($this->order, new PurchaseContext());
        } catch (\Exception $e) {
            $result->setSuccess(false);
            $result->setMessage($e->getMessage());
            return $result;
        }

        $result->setSuccess(true);
        return $result;
    }

    /**
     * Order ကို cancel ပြုလုပ်ခြင်း
     */
    public function cancel(): PaymentResult
    {
        $result = new PaymentResult();

        // Cancel logic ပြုလုပ်ပါ
        $OrderStatus = $this->orderStatusRepository->find(OrderStatus::CANCEL);
        $this->order->setOrderStatus($OrderStatus);

        $result->setSuccess(true);
        return $result;
    }

    // EC-Cube ၏ Form ရယူခြင်း - setters
    public function setFormType(FormInterface $form): void {}
    public function setOrder(Order $order): void {}
}
```

---

### အဆင့် 2 - Payment Controller တည်ဆောက်ခြင်း

`app/Plugin/MyPayment/Controller/PaymentController.php`

```php
<?php

namespace Plugin\MyPayment\Controller;

use Eccube\Controller\AbstractController;
use Eccube\Repository\OrderRepository;
use Eccube\Service\CartService;
use Eccube\Service\MailService;
use Eccube\Service\Payment\PaymentResult;
use Eccube\Service\PurchaseFlow\PurchaseContext;
use Eccube\Service\PurchaseFlow\PurchaseFlow;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly CartService $cartService,
        private readonly MailService $mailService,
        private readonly PurchaseFlow $shoppingPurchaseFlow,
    ) {}

    /**
     * Payment Gateway မှ Return ဝင်လာသောအခါ ဤ route ကို hit ပြုလုပ်မည်
     * 
     * @Route("/my-payment/complete", name="my_payment_complete")
     */
    public function complete(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        // Gateway မှ return parameter ရယူပါ
        $orderId = $request->query->get('order_id');
        $status  = $request->query->get('status'); // 'success' or 'failed'
        $token   = $request->query->get('token');

        // Order ရှာပါ
        $order = $this->orderRepository->find($orderId);

        if (!$order || $status !== 'success') {
            // ငွေပေးချေမှု မအောင်မြင်ပါ
            $this->addError('payment.failed', 'front');
            return $this->redirectToRoute('shopping_error');
        }

        // Order ကို confirm ပြုလုပ်ပါ
        try {
            $this->shoppingPurchaseFlow->commit($order, new PurchaseContext());
            $this->entityManager->flush();
        } catch (\Exception $e) {
            log_error('[MyPayment] Purchase flow error: ' . $e->getMessage());
            return $this->redirectToRoute('shopping_error');
        }

        // Confirmation mail ပို့ပါ
        $this->mailService->sendOrderMail($order);

        // Cart ကို ဖယ်ရှားပါ
        $this->cartService->clear();

        // Thank you page သို့ redirect ပြုလုပ်ပါ
        return $this->redirectToRoute('shopping_complete');
    }

    /**
     * Payment ကို customer ဖြင့် cancel ပြုလုပ်သောအခါ
     * 
     * @Route("/my-payment/cancel", name="my_payment_cancel")
     */
    public function cancel(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $orderId = $request->query->get('order_id');
        $order = $this->orderRepository->find($orderId);

        if ($order) {
            // Order ကို cancel ပြုလုပ်ပါ
            // $order->setOrderStatus(...);
            // $this->entityManager->flush();
        }

        $this->addError('payment.cancelled', 'front');
        return $this->redirectToRoute('shopping');
    }
}
```

---

### အဆင့် 3 - PluginManager တွင် Payment ကို Register ပြုလုပ်ခြင်း

`app/Plugin/MyPayment/PluginManager.php`

```php
<?php

namespace Plugin\MyPayment;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Payment;
use Eccube\Plugin\AbstractPluginManager;
use Plugin\MyPayment\Method\MyPaymentMethod;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PluginManager extends AbstractPluginManager
{
    public function enable(array $meta, ContainerInterface $container): void
    {
        $entityManager = $container->get('doctrine.orm.entity_manager');

        // Payment record တည်ဆောက်ပါ (ရှိနှင့်ပြီးသားဆိုလျှင် skip ပါ)
        $payment = $entityManager->getRepository(Payment::class)
            ->findOneBy(['method_class' => MyPaymentMethod::class]);

        if ($payment) {
            return; // မရှိမှ ထပ်ထည့်ပါ
        }

        $payment = new Payment();
        $payment->setCharge(0);                            // Transaction fee
        $payment->setSortNo(0);
        $payment->setVisible(true);
        $payment->setMethod('MyPayment クレジット');       // Display Name
        $payment->setMethodClass(MyPaymentMethod::class);  // Class ကို ညွှန်ပြပါ

        $entityManager->persist($payment);
        $entityManager->flush();
    }

    public function disable(array $meta, ContainerInterface $container): void
    {
        $entityManager = $container->get('doctrine.orm.entity_manager');

        $payment = $entityManager->getRepository(Payment::class)
            ->findOneBy(['method_class' => MyPaymentMethod::class]);

        if ($payment) {
            $payment->setVisible(false); // Disable ပြုလုပ်ပါ (Delete မပြုလုပ်ပါ)
            $entityManager->flush();
        }
    }
}
```

---

### အဆင့် 4 - Admin တွင် Payment Method ကို Configure ပြုလုပ်ခြင်း

Plugin enable ပြုလုပ်ပြီးနောက်:

1. **Admin → 設定 → 基本設定 → 支払い方法管理** သို့ သွားပါ
2. "MyPayment クレジット" ကို ရှာပါ
3. **有効にする** ကို နှိပ်ပါ
4. Applicable Shipping Methods နှင့် **ひも付け** ပြုလုပ်ပါ

---

### အဆင့် 5 - Payment Form Template

`app/Plugin/MyPayment/Resource/template/payment_form.twig`

```twig
{# Checkout page တွင် ပြမည့် Payment Form #}
<div id="my-payment-form" class="ec-blockAlert--info">
    <h4><i class="fa fa-credit-card"></i> MyPayment でのお支払い</h4>
    <p>ボタンをクリックすると、MyPayment の決済ページに移動します。</p>
    <div class="ec-payment-info">
        <dl>
            <dt>お支払い金額:</dt>
            <dd><strong>{{ Order.paymentTotal|price }}</strong></dd>
        </dl>
    </div>
</div>
```

---

## 🔑 Payment Flow Overview

```
Customer → Checkout → [MyPaymentMethod::apply()] 
    → Redirect to Gateway
    → Customer pays
    → Gateway redirects back to /my-payment/complete
    → [PaymentController::complete()]
    → PurchaseFlow::commit()
    → Email sent
    → Thank you page
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] `PaymentMethodInterface` ကို implement ပြုလုပ်ပြီးကြောင်း
- [ ] `PluginManager::enable()` တွင် Payment record ထည့်ပြီးကြောင်း
- [ ] Admin ထဲတွင် Payment Method မြင်ရကြောင်း
- [ ] Test payment flow လုပ်ဆောင်ကြောင်း

---

> ➡️ **နောက်တစ်ဆင့်**: [07 - Shipping Customization](/eccube/customization-list/07_shipping_customization/)
