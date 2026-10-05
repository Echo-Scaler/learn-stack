---
title: "01. Email Architecture And Templates"
description: "> Technical & Client Overview:"
---

## 01 - Email Architecture & Template Management (အီးမေးလ် ဗိသုကာနှင့် Template စီမံခန့်ခွဲမှု)

> **Technical & Client Overview**:  
> EC-CUBE တွင် အီးမေးလ် ပေးပို့ခြင်းကို **`MailService`** နှင့် Symfony Mailer က တာဝန်ယူပြီး၊ စာသားဒီဇိုင်းများကို **Twig Templates** ဖြင့် ရေးသားထားပါသည်။ ဂျပန်နိုင်ငံ E-Commerce တွင် တရားဝင်မှုရှိစေရန် Plain Text ပုံစံကို အဓိက အသုံးပြုလေ့ရှိပြီး၊ မကြာသေးမီက HTML Email များကိုပါ တွဲဖက် အသုံးပြုလာကြပါသည်။

---

## 🏛️ `MailService` Class ၏ အဓိက လုပ်ငန်းဆောင်တာများ

EC-CUBE ၏ အီးမေးလ် logic အားလုံးသည် **`src/Eccube/Service/MailService.php`** တွင် စုစည်းတည်ရှိပါသည်:

```php
namespace Eccube\Service;

use Eccube\Entity\Order;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class MailService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly Environment $twig,
        private readonly BaseInfoRepository $baseInfoRepository,
        private readonly MailTemplateRepository $mailTemplateRepository
    ) {}

    /**
     * အော်ဒါ အတည်ပြုမေးလ် ပို့ဆောင်ခြင်း
     */
    public function sendOrderMail(Order $Order): void
    {
        // ၁။ ဆိုင်အချက်အလက်များ (Sender, Admin BCC) ရယူခြင်း
        $BaseInfo = $this->baseInfoRepository->get();
        $MailTemplate = $this->mailTemplateRepository->find(MailTemplate::TEMPLATE_ORDER);

        // ၂။ Twig Template ကို Data များနှင့် Render ပြုလုပ်ခြင်း
        $body = $this->twig->render($MailTemplate->getFileName(), [
            'Order' => $Order,
            'BaseInfo' => $BaseInfo,
        ]);

        // ၃။ Email Object တည်ဆောက်ခြင်း
        $message = (new Email())
            ->subject('[' . $BaseInfo->getShopName() . '] ' . $MailTemplate->getSubject())
            ->from($BaseInfo->getEmail01())
            ->to($Order->getEmail())
            ->bcc($BaseInfo->getEmail01()) // Admin ဆီသို့ BCC အလိုအလျောက် ပို့ခြင်း
            ->text($body);

        // ၄။ အီးမေးလ် ပေးပို့ခြင်း
        $this->mailer->send($message);

        // ၅။ ပေးပို့မှု မှတ်တမ်းကို dtb_mail_history တွင် သိမ်းဆည်းခြင်း
        $this->saveMailHistory($Order, $MailTemplate->getSubject(), $body);
    }
}
```

---

## 📄 Email Templates တည်ဆောက်ပုံ (Plain Text vs HTML)

EC-CUBE တွင် အီးမေးလ် Template ဖိုင်များသည် အောက်ပါ လမ်းကြောင်းတွင် တည်ရှိပါသည်:
- **Core Templates**: `src/Eccube/Resource/template/default/Mail/`
- **Custom Overwrite**: `app/template/default/Mail/`

### ဂျပန် စံနှုန်း အီးမေးလ် တစ်စောင်၏ ဖွဲ့စည်းပုံ:
ဂျပန်နိုင်ငံတွင် အီးမေးလ်များကို မျဉ်းတို (`━━━━━━━━━━`) များဖြင့် အကန့်ခွဲပြီး သပ်ရပ်စွာ ရေးသားလေ့ရှိပါသည်:

```twig
{# Resource/template/default/Mail/order.twig #}
{{ Order.name01 }} {{ Order.name02 }} 様

{{ BaseInfo.shop_name }} でございます。
この度は、当店をご利用いただき誠にありがとうございます。

ご注文内容をご確認ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご注文内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ご注文番号：{{ Order.order_no }}
ご注文日時：{{ Order.order_date|date('Y/m/d H:i') }}
お支払い方法：{{ Order.Payment.method }}

{% for OrderItem in Order.ProductOrderItems %}
商品名: {{ OrderItem.product_name }}
コード: {{ OrderItem.product_code }}
単価: {{ OrderItem.priceIncTax|number_format }} 円
数量: {{ OrderItem.quantity }}
小計: {{ (OrderItem.priceIncTax * OrderItem.quantity)|number_format }} 円
------------------------------------------------------------
{% endfor %}

商品合計：{{ Order.subtotal|number_format }} 円
送料：{{ Order.delivery_fee_total|number_format }} 円
お支払い合計：{{ Order.payment_total|number_format }} 円 (税込)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 配送先情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{% for Shipping in Order.Shippings %}
お名前：{{ Shipping.name01 }} {{ Shipping.name02 }} 様
ご住所：〒{{ Shipping.postal_code }} {{ Shipping.Pref.name }}{{ Shipping.addr01 }}{{ Shipping.addr02 }}
お届け希望日：{{ Shipping.shipping_delivery_date ? Shipping.shipping_delivery_date|date('Y/m/d') : '指定なし' }}
お届け時間帯：{{ Shipping.shipping_delivery_time|default('指定なし') }}
{% endfor %}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{ BaseInfo.shop_name }}
〒{{ BaseInfo.postal_code }} {{ BaseInfo.pref.name }}{{ BaseInfo.addr01 }}
Email: {{ BaseInfo.email01 }}
URL: {{ url('homepage') }}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🖥️ Admin UI မှ Template ကို တိုက်ရိုက် ပြင်ဆင်ခြင်း

Developer မဟုတ်သော ဆိုင်ပိုင်ရှင်များသည် စာသားများကို Admin Dashboard မှ တိုက်ရိုက် ပြင်ဆင်နိုင်ပါသည်:
- **Admin Path**: **設定 ➔ 店舗設定 ➔ メール設定 (Email Settings)**
- Admin သည် အထက်ပါ Menu မှတဆင့် ခေါင်းစဉ် (Subject) နှင့် စာသား (Template Body) များကို ဖိုင်ထဲ ဝင်ပြင်စရာမလိုဘဲ တိုက်ရိုက် Edit ပြုလုပ်ပြီး Save နိုင်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **メール設定 (Meeru Settei)**: Email Settings
- **テキストメール (Tekisuto Meeru)**: Plain Text Email
- **HTMLメール (Eichi-tii-emu-eru Meeru)**: HTML Formatted Email
- **送信元 (Soushin-moto)**: Sender (From Address)
- **宛先 (Atesaki)**: Recipient (To Address)
- **件名 (Kenmei)**: Subject Line
- **署名 / フッター (Shomei / Futtaa)**: Signature / Email Footer
