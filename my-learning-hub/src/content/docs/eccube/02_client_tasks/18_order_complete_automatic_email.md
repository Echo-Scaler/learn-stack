---
title: "18. Order Complete Automatic Email"
description: "> 「お客様が注文を完了した直後（サンクスページ表示時）に、注文明細が記載された『ご注文完了メール（サンクスメール）』をお客様に自動送信すると同時に、倉庫担当者または管理者用メーリングリスト（warehouse@example.com）にもBCCまたは別送で自動通知してください。」"
---

## Task 18: 注文完了時にメールを送信してください (Automatic Order Confirmation Email)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「お客様が注文を完了した直後（サンクスページ表示時）に、注文明細が記載された『ご注文完了メール（サンクスメール）』をお客様に自動送信すると同時に、倉庫担当者または管理者用メーリングリスト（warehouse@example.com）にもBCCまたは別送で自動通知してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဝယ်ယူသူက အော်ဒါတင်ပြီးသည်နှင့် တစ်ပြိုင်နက် ဝယ်ယူသူထံသို့ **Order Confirmation Email (ご注文完了メール)** ကို အလိုအလျောက် ပေးပို့ပေးပြီး၊ စတို/ဂိုဒေါင် တာဝန်ခံထံသို့လည်း အော်ဒါအချက်အလက်များကို Email အလိုအလျောက် သတိပေး ပေးပို့ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Event Subscriber (`front.shopping.confirm.complete`) သဘောတရား
- Core Checkout Controller (`ShoppingController`) ထဲတွင် Mail Function ကို သွားမရေးရပါ။
- EC-CUBE သည် အော်ဒါအောင်မြင်စွာ ပြီးဆုံးချိန်တွင် `eccube.event.front.shopping.confirm.complete` Event ကို အလိုအလျောက် Trigger ပေးပါသည်။
- `EventSubscriberInterface` ဖြင့် နားစွင့်ထားခြင်းဖြင့် Core Code များကို လုံးဝမထိခိုက်ဘဲ Email ပို့ခြင်းကို သန့်ရှင်းစွာ တွဲဆက်နိုင်ပါသည်။

### 2. EC-CUBE `MailService` ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- Symfony Mailer / SwiftMailer ကို တိုက်ရိုက် သုံးမည့်အစား EC-CUBE ၏ `MailService::sendOrderMail()` ကို အသုံးပြုခြင်းဖြင့် ဆိုင်အမည်၊ Sender Mail, Header, Footer စသည့် Admin Base Settings များကို အလိုအလျောက် ရယူပြီးသား ဖြစ်စေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Order Complete Event Subscriber ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/OrderCompleteMailSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Entity\Order;
use Eccube\Event\EventArgs;
use Eccube\Service\MailService;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class OrderCompleteMailSubscriber implements EventSubscriberInterface
{
    private MailService $mailService;
    private MailerInterface $mailer;
    private LoggerInterface $logger;

    public function __construct(
        MailService $mailService,
        MailerInterface $mailer,
        LoggerInterface $logger
    ) {
        $this->mailService = $mailService;
        $this->mailer = $mailer;
        $this->logger = $logger;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'eccube.event.front.shopping.confirm.complete' => 'onOrderComplete',
        ];
    }

    public function onOrderComplete(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('Order');

        if (!$order || !$order->getId()) {
            return;
        }

        try {
            // ၁။ Customer ထံသို့ EC-CUBE ပုံမှန် အော်ဒါအတည်ပြု Mail ပေးပို့ခြင်း
            // (Standard Flow တွင် ပို့ပြီးသားဖြစ်ပါက ထပ်မံ မပို့ရန် စစ်ဆေးနိုင်သည်)
            
            // ၂။ ဂိုဒေါင်/စတို တာဝန်ခံထံသို့ သီးသန့် အကြောင်းကြားစာ အလိုအလျောက် ပေးပို့ခြင်း
            $warehouseEmail = (new Email())
                ->from('info@your-shop.com')
                ->to('warehouse@example.com')
                ->subject(sprintf('【新規受注速報】注文番号: #%s の出荷準備をお願いします', $order->getOrderNo()))
                ->html(sprintf('
                    <h2>新規のご注文が入りました</h2>
                    <p><strong>注文番号:</strong> %s</p>
                    <p><strong>注文者:</strong> %s %s 様</p>
                    <p><strong>合計金額:</strong> ¥%s</p>
                    <hr>
                    <p>詳細は管理画面の受注マスターよりご確認ください。</p>
                ',
                    $order->getOrderNo(),
                    $order->getName01(),
                    $order->getName02(),
                    number_format($order->getPaymentTotal())
                ));

            $this->mailer->send($warehouseEmail);
            $this->logger->info(sprintf('Order #%s notification sent to warehouse.', $order->getOrderNo()));

        } catch (\Exception $e) {
            $this->logger->error('Order Complete Mail Error: ' . $e->getMessage());
        }
    }
}
```

---

### အဆင့် ၂: Email Template (Twig) ကို Customize ပြုလုပ်လိုပါက
မူရင်း Mail Content Template ဖြစ်သော:
`app/template/default/Mail/order.twig` ဖိုင်ကို ပြင်ဆင်နိုင်ပါသည်။

ဥပမာ - ဘဏ်လွှဲငွေ အချက်အလက် သို့မဟုတ် အထူးသတိပေးချက်များ ထည့်သွင်းလိုပါက:

```twig
{# 銀行振込の場合の追加案内 #}
{% if Order.Payment.getMethodClass == 'Eccube\\Entity\\Payment\\Method\\BankTransfer' %}
--------------------------------------------------
【お振込先口座のご案内】
銀行名: ○○銀行
支店名: 本店営業部 (100)
口座種別: 普通
口座番号: 1234567
口座名義: カ）イーシーキューブ
--------------------------------------------------
※ご注文後7日以内にお振込みをお願いいたします。
{% endif %}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Double Sending (メール二重送信防止):**  
   EC-CUBE Core တွင် `MailService::sendOrderMail()` ကို မူလကတည်းက ခေါ်ယူထားခြင်း ရှိမရှိ စစ်ဆေးပါ။ မဟုတ်ပါက ဝယ်ယူသူထံသို့ အော်ဒါ Email ၂ စောင် ထပ်နေတတ်ပါသည်။
2. **Mail Delivery Failure Handling (Spam Filters):**  
   ဂျပန်နိုင်ငံရှိ Docomo, AU, Softbank (@docomo.ne.jp, @ezweb.ne.jp) မိုဘိုင်း အီးမေးလ်များသည် SPF / DKIM / DMARC Record မပြည့်စုံပါက အလိုအလျောက် ပယ်ချ (Block) တတ်သောကြောင့် DNS ပိုင်းတွင် SPF Record ထည့်သွင်းထားရပါမည်။
