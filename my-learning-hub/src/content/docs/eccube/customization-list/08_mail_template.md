---
title: "08. Mail Template"
description: "> အဆင့်: Beginner | EC-Cube Version: 4.2+"
---

## 08 - Mail Template Customize လုပ်နည်း

> **အဆင့်**: Beginner | **EC-Cube Version**: 4.2+

EC-Cube ၏ Mail System ကို customize ပြုလုပ်ကာ ကိုယ်ပိုင် design နှင့် content ဖြင့် Email ပို့နည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Order confirmation mail ကို ကိုယ်ပိုင် design ဖြင့် customize တတ်ရန်
- Plugin မှ Custom mail ကို template ဖြင့် ပို့တတ်ရန်
- Admin Panel မှ Mail Template ကို manage တတ်ရန်

---

## 📌 EC-Cube Mail Types

| Mail အမျိုးအစား | ဖြစ်ပေါ်သည့် အချိန် |
|----------------|-------------------|
| 注文受付メール | Order confirm ပြုလုပ်သောအခါ |
| 発送完了メール | Admin မှ Shipping mark ပြုလုပ်သောအခါ |
| 会員登録メール | Customer register ပြုလုပ်သောအခါ |
| パスワードリセット | Password reset request |
| お問い合わせ | Contact form submit |

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Admin Mail Template ကို Override ပြုလုပ်ခြင်း

**Admin Panel မှ** (Code မပြောင်းဘဲ):

```
Admin → 設定 → メール設定 → メールテンプレート管理
```

ဤနေရာတွင် Mail Template ၏ subject နှင့် body ကို GUI ဖြင့် ပြင်ဆင်နိုင်သည်။

---

### အဆင့် 2 - Twig Mail Template Override ပြုလုပ်ခြင်း

**Order Confirmation Mail ကို Override**:

```bash
# Core template ၏ တည်နေရာ
# src/Eccube/Resource/template/default/Mail/order.twig

# app/template/ တွင် ကူးယူပါ
mkdir -p app/template/default/Mail
cp src/Eccube/Resource/template/default/Mail/order.twig \
   app/template/default/Mail/order.twig
```

`app/template/default/Mail/order.twig`

```twig
{# Order Confirmation Email #}
{{ '注文を受け付けました。'|trans }}

-------------------------------------
【ご注文内容】
-------------------------------------

ご注文番号: {{ Order.no }}
注文日時: {{ Order.order_date|date('Y年m月d日 H:i') }}
お名前: {{ Order.name01 }} {{ Order.name02 }} 様

{% for OrderItem in Order.OrderItems %}
{% if OrderItem.isProduct %}
{{ OrderItem.product_name }}
  数量: {{ OrderItem.quantity }}個
  単価: {{ OrderItem.price|price }}
  小計: {{ (OrderItem.price * OrderItem.quantity)|price }}
{% endif %}
{% endfor %}

-------------------------------------
小計: {{ Order.subtotal|price }}
{% if Order.delivery_fee_total > 0 %}
送料: {{ Order.delivery_fee_total|price }}
{% else %}
送料: 無料
{% endif %}
{% if Order.discount > 0 %}
割引: -{{ Order.discount|price }}
{% endif %}
合計: {{ Order.payment_total|price }}
-------------------------------------

【お届け先】
〒{{ Order.Shippings[0].postal_code }}
{{ Order.Shippings[0].pref.name }}{{ Order.Shippings[0].addr01 }}{{ Order.Shippings[0].addr02 }}
{{ Order.Shippings[0].name01 }} {{ Order.Shippings[0].name02 }} 様

{% if Order.Shippings[0].plgDeliveryDate %}
お届け希望日: {{ Order.Shippings[0].plgDeliveryDate|date('Y年m月d日') }}
{% endif %}

【お支払い方法】
{{ Order.Payment.method }}

ご不明な点がございましたら、下記よりお問い合わせください。
{{ BaseInfo.shop_name }}
{{ BaseInfo.email01 }}
{{ url('homepage') }}
```

---

### အဆင့် 3 - HTML Mail Template တည်ဆောက်ခြင်း

EC-Cube 4 သည် HTML Mail ကို support ပြုသည်။

`app/template/default/Mail/order_html.twig`

```twig
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ご注文ありがとうございます</title>
    <style>
        body {
            font-family: 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .order-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
        }
        .product-table th {
            background: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
        }
        .product-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .total-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
        }
        .footer {
            background: #2d3748;
            color: #a0aec0;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        
        {# Header #}
        <div class="header">
            <h1>{{ BaseInfo.shop_name }}</h1>
            <p>ご注文ありがとうございます！</p>
        </div>

        <div class="content">
            
            <p>{{ Order.name01 }} {{ Order.name02 }} 様</p>
            <p>以下の内容でご注文を承りました。</p>

            {# Order Info #}
            <div class="order-info">
                <table style="width: 100%">
                    <tr>
                        <td><strong>注文番号</strong></td>
                        <td>{{ Order.no }}</td>
                    </tr>
                    <tr>
                        <td><strong>注文日時</strong></td>
                        <td>{{ Order.order_date|date('Y年m月d日 H:i') }}</td>
                    </tr>
                    <tr>
                        <td><strong>お支払い方法</strong></td>
                        <td>{{ Order.Payment.method }}</td>
                    </tr>
                </table>
            </div>

            {# Product Table #}
            <table class="product-table">
                <thead>
                    <tr>
                        <th>商品名</th>
                        <th>数量</th>
                        <th>金額</th>
                    </tr>
                </thead>
                <tbody>
                    {% for OrderItem in Order.OrderItems %}
                    {% if OrderItem.isProduct %}
                    <tr>
                        <td>{{ OrderItem.product_name }}</td>
                        <td>{{ OrderItem.quantity }}個</td>
                        <td>{{ (OrderItem.price * OrderItem.quantity)|price }}</td>
                    </tr>
                    {% endif %}
                    {% endfor %}
                </tbody>
            </table>

            {# Total #}
            <div class="total-section">
                合計: {{ Order.payment_total|price }}（税込）
            </div>

            {# CTA Button #}
            <div style="text-align: center">
                <a href="{{ url('mypage_history', {'id': Order.id}) }}" class="btn">
                    ご注文の詳細を見る
                </a>
            </div>

        </div>

        {# Footer #}
        <div class="footer">
            <p>{{ BaseInfo.shop_name }}</p>
            <p>{{ BaseInfo.email01 }}</p>
        </div>

    </div>
</body>
</html>
```

---

### အဆင့် 4 - Plugin မှ Custom Mail ပို့ခြင်း

`app/Plugin/MyPlugin/Service/MailService.php`

```php
<?php

namespace Plugin\MyPlugin\Service;

use Eccube\Entity\Customer;
use Eccube\Entity\Order;
use Eccube\Service\MailService as BaseMailService;
use Twig\Environment;

class MailService
{
    public function __construct(
        private readonly \Swift_Mailer $mailer,
        private readonly Environment $twig,
        private readonly BaseMailService $baseMailService,
        private readonly \Eccube\Repository\MailHistoryRepository $mailHistoryRepository,
    ) {}

    /**
     * ကိုယ်ပိုင် Point Notification Mail ပို့ခြင်း
     */
    public function sendPointNotification(Customer $customer, int $points): void
    {
        // Mail Subject
        $subject = 'ポイントが付与されました！';

        // Twig Template Render
        $body = $this->twig->render('@MyPlugin/Mail/point_notification.twig', [
            'Customer' => $customer,
            'Points'   => $points,
        ]);

        // Swift_Message တည်ဆောက်ပြီး ပို့ပါ
        $message = (new \Swift_Message())
            ->setSubject($subject)
            ->setFrom('noreply@example.com', 'My Shop')
            ->setTo($customer->getEmail(), $customer->getName01() . ' ' . $customer->getName02())
            ->setBody($body, 'text/html');

        $this->mailer->send($message);
    }

    /**
     * Admin ကို Notification Mail ပို့ခြင်း
     */
    public function sendAdminNotification(string $subject, string $message): void
    {
        $adminMail = (new \Swift_Message())
            ->setSubject('[Admin] ' . $subject)
            ->setFrom('noreply@example.com')
            ->setTo('admin@example.com')
            ->setBody($message, 'text/plain');

        $this->mailer->send($adminMail);
    }
}
```

---

### အဆင့် 5 - Point Notification Template

`app/Plugin/MyPlugin/Resource/template/Mail/point_notification.twig`

```twig
<!DOCTYPE html>
<html>
<body>
<p>{{ Customer.name01 }} {{ Customer.name02 }} 様</p>

<p>{{ Points|number_format }}ポイントが付与されました！<br>
ぜひショッピングにお役立てください。</p>

<hr>
<small>このメールは自動送信です。</small>
</body>
</html>
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] Mail template ဖိုင် မှန်ကန်သော path တွင် ရှိကြောင်း
- [ ] `bin/console cache:clear` ပြုလုပ်ပြီးကြောင်း
- [ ] Test mail ပေးပို့၍ format မှန်ကန်ကြောင်း
- [ ] Admin ရှိ Mail History တွင် မှတ်တမ်းတင်ကြောင်း

---

## 🔧 Mail Debug - Development Environment

`.env.local` တွင် Mailer URL ကို Mailtrap သို့ redirect ပြုလုပ်ပါ:

```ini
MAILER_URL=smtp://username:password@smtp.mailtrap.io:2525
```

---

> ➡️ **နောက်တစ်ဆင့်**: [09 - Form Extension](/eccube/customization-list/09_form_extension/)
