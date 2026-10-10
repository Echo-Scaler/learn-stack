---
title: "04. Top Client Tasks And Troubleshooting"
description: "> Real-World Client Requirement Guide:"
---

## 04 - Top Client Email Tasks & Fixes (အသုံးအများဆုံး Client Tasks များနှင့် ဖြေရှင်းနည်းများ)

> **Real-World Client Requirement Guide**:  
> လုပ်ငန်းခွင်တွင် ဂျပန် Client များ အများဆုံး တောင်းဆိုလေ့ရှိသော အီးမေးလ်ဆိုင်ရာ Task ကြီး ၅ ခုနှင့် ၎င်းတို့ကို အဆင့်ဆင့် ဖြေရှင်းပုံ (Fixing Guide) ကို လက်တွေ့ Code များနှင့်တကွ ဖော်ပြထားပါသည်။

---

## 📌 Task 1: ဂျပန် အခွန်သစ် Invoice နံပါတ်နှင့် အခွန်ခွဲခြမ်းမှု ထည့်သွင်းခြင်း

> **Client Requirement**:  
> *"၂၀၂၃ ခုနှစ်မှ စတင်ကျင့်သုံးသော ဂျပန် Инボイス制度 (Qualified Invoice System) အရ အော်ဒါအတည်ပြုမေးလ်ထဲတွင် ဆိုင်၏ **Invoice မှတ်ပုံတင်နံပါတ် (T+ဂဏန်း ၁၃ လုံး)** နှင့် **၁၀% အခွန် / ၈% အခွန် ခွဲခြမ်းစိတ်ဖြာချက်** ကို မဖြစ်မနေ ထည့်သွင်းပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (How to Fix):
`app/template/default/Mail/order.twig` ဖိုင်ထဲတွင် အောက်ပါ ကုဒ်အပိုင်းအစကို ထည့်သွင်းပါ:

```twig
{# Invoice မှတ်ပုံတင်နံပါတ် ပြသခြင်း #}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 適格請求書発行事業者登録番号 (Invoice Registration No)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
登録番号：T1234567890123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 消費税内訳 (Tax Breakdown)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{% for rate, tax in Order.taxable_amounts %}
  {{ rate }}% 対象額：{{ tax.taxable_limit|number_format }} 円 (消費税：{{ tax.tax_amount|number_format }} 円)
{% endfor %}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📌 Task 2: အီးမေးလ်များ Gmail / Yahoo Spam ထဲ ရောက်သွားခြင်း (Gmail 送信者ガイドライン)

> **Client Requirement / Problem**:  
> *"Customer များထံ အီးမေးလ် ပို့လိုက်သော်လည်း Gmail နှင့် Yahoo Mail များတွင် Spam (အမှိုက်ပုံး) ထဲ ရောက်သွားပါသည် သို့မဟုတ် လုံးဝ မရောက်ဘဲ ပျောက်သွားပါသည်၊ ကူညီဖြေရှင်းပေးပါ။"*

### 🛠️ အကြောင်းရင်းနှင့် ဖြေရှင်းနည်း (How to Fix):
Google နှင့် Yahoo သည် ၂၀၂၄ ခုနှစ်မှစ၍ **SPF, DKIM, DMARC** စစ်ဆေးမှု မအောင်မြင်သော အီးမေးလ်များကို အလိုအလျောက် ပိတ်ပင်ထားပါသည်။  
PHP Default `mail()` function ကို မသုံးဘဲ စစ်မှန်သော **SMTP Relay (SendGrid / Amazon SES / Postmark)** ဖြင့် ချိတ်ဆက်ရပါမည်:

#### အဆင့် ၁: `.env` တွင် စစ်မှန်သော SMTP ဆာဗာ ချိတ်ဆက်ခြင်း
```ini
# ❌ မှားယွင်းသော နည်းလမ်း: MAILER_DSN=sendmail://default
# ✅ မှန်ကန်သော နည်းလမ်း: စစ်မှန်သော SMTP ကို အသုံးပြုခြင်း
MAILER_DSN=smtp://smtp_user:smtp_password@smtp.sendgrid.net:587
```

#### အဆင့် ၂: Domain DNS တွင် SPF နှင့် DMARC Record ထည့်သွင်းခြင်း
- **SPF Record**: `v=spf1 include:sendgrid.net ~all`
- **DMARC Record**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com`

---

## 📌 Task 3: Customer ရိုက်ထည့်လိုက်သော မှတ်ချက် (備考欄 / Delivery Notes) ကို အီးမေးလ်တွင် ထည့်သွင်းခြင်း

> **Client Requirement**:  
> *"Customer က Checkout တွင် 'တံခါးဝတွင် ချန်ထားပေးပါ (置き配希望)' ဟု ရေးလိုက်သော မှတ်ချက်စာသားကို အော်ဒါအတည်ပြုမေးလ်တွင် ပြသပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (How to Fix):
Customer ၏ မှတ်ချက်စာသားသည် `dtb_order.message` တွင် သိမ်းဆည်းထားသဖြင့် `order.twig` တွင် အောက်ပါအတိုင်း ထည့်သွင်းနိုင်ပါသည်:

```twig
{# order.twig ထဲတွင် ထည့်သွင်းခြင်း #}
{% if Order.message %}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様からのご要望・備考欄 (Customer Remarks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{ Order.message }}
{% endif %}
```

---

## 📌 Task 4: လက်ကျန် စတော့ ၅ ခုအောက် လျော့သွားပါက Admin ထံ အလိုအလျောက် သတိပေးမေးလ် ပို့ခြင်း

> **Client Requirement**:  
> *"ကုန်ပစ္စည်းတစ်ခု ရောင်းထွက်သွားပြီးနောက် လက်ကျန် စတော့ ၅ ခုအောက် ရောက်သွားပါက ဆိုင်မန်နေဂျာထံသို့ 'စတော့ နည်းနေပါပြီ၊ ထပ်မံဖြည့်တင်းပါ' ဟု Alert Email အလိုအလျောက် ပို့ပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Custom Event Subscriber):
`app/Plugin/LowStockAlert/EventSubscriber/LowStockSubscriber.php`
```php
public function onOrderCompleteCheckStock(EventArgs $event): void
{
    $Order = $event->getArgument('Order');

    foreach ($Order->getOrderItems() as $item) {
        if ($item->isProduct()) {
            $ProductClass = $item->getProductClass();

            // စတော့ အကန့်အသတ်ရှိပြီး လက်ကျန် ၅ ခုနှင့် အောက် ဖြစ်သွားပါက
            if (!$ProductClass->isStockUnlimited() && $ProductClass->getStock() <= 5) {
                // Admin ထံ Alert မေးလ် ပေးပို့ခြင်း
                $subject = '【在庫低下アラート】' . $item->getProductName() . ' の在庫が残りわずかです';
                $body = sprintf("商品: %s (%s)\n現在の在庫数: %d 個\n早急に発注してください。",
                    $item->getProductName(),
                    $item->getProductCode(),
                    $ProductClass->getStock()
                );

                $message = (new Email())
                    ->from('system@mystore.com')
                    ->to('manager@mystore.com')
                    ->subject($subject)
                    ->text($body);

                $this->mailer->send($message);
            }
        }
    }
}
```

---

## 📌 Task 5: ဓာတ်ပုံများနှင့် ခလုတ်များပါဝင်သော HTML Email ပြုလုပ်ခြင်း

> **Client Requirement**:  
> *"Plain text အပြင် ကုန်ပစ္စည်း ဓာတ်ပုံများနှင့် အော်ဒါအသေးစိတ် ကြည့်နိုင်သော Button လှလှပပများ ပါဝင်သော HTML Email ပုံစံဖြင့် ပေးပို့လိုပါသည်။"*

### 🛠️ ဖြေရှင်းနည်း:
`MailService` တွင် `$message->html()` ဖြင့် HTML Twig Template ကို ပေါင်းစပ်ပေးပို့နိုင်ပါသည်:

```php
$htmlBody = $this->twig->render('Mail/order.html.twig', ['Order' => $Order]);

$message = (new Email())
    ->subject($subject)
    ->from($from)
    ->to($to)
    ->text($plainTextBody)  // Plain text ဖတ်လိုသူများအတွက်
    ->html($htmlBody);       // HTML Format ဖြင့် ဖတ်လိုသူများအတွက်

$this->mailer->send($message);
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **インボイス制度 (Inboisu Seido)**: Japan's Qualified Invoice System
- **適格請求書発行事業者登録番号**: Qualified Invoice Issuer Registration Number
- **迷惑メール (Meiwaku Meeru)**: Spam / Junk Mail
- **送信者ガイドライン (Soushinsha Gaidorain)**: Gmail / Yahoo Sender Guidelines
- **置き配 (Oki-hai)**: Unattended Delivery (တံခါးဝတွင် ထားခဲ့ခြင်း)
- **在庫アラート (Zaiko Araato)**: Low Stock Alert
