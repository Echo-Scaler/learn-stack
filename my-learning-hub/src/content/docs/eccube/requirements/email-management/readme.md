---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Email System (အီးမေးလ် ပေးပို့မှု၊ Template စီမံခန့်ခွဲမှုနှင့် အလိုအလျောက် သတိပေးချက်စနစ်) ဆိုင်ရာ Client Requirements များနှင့်"
---

## EC-CUBE Client Requirements: Email System (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Email System (အီးမေးလ် ပေးပို့မှု၊ Template စီမံခန့်ခွဲမှုနှင့် အလိုအလျောက် သတိပေးချက်စနစ်)** ဆိုင်ရာ Client Requirements များနှင့် အဖြစ်အများဆုံး Client Tasks များကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

EC-CUBE တွင် Email စနစ်သည် Symfony Mailer (`symfony/mailer`) နှင့် Twig Template Engine အပေါ်တွင် အခြေခံထားပြီး၊ အော်ဒါတင်ခြင်း၊ ငွေလွှဲလက်ခံခြင်း၊ ပစ္စည်းပို့ဆောင်ခြင်းနှင့် လုံခြုံရေး အတည်ပြုချက်များအတွက် မရှိမဖြစ် အရေးပါသော စနစ်ဖြစ်ပါသည်။

---

## 📧 EC-CUBE Email Implementation Architecture

EC-CUBE တွင် အီးမေးလ်တစ်ခု ထွက်ရှိသွားပုံ အဆင့်ဆင့် (Pipeline) မှာ အောက်ပါအတိုင်း ဖြစ်ပါသည်:

```
[1. Trigger Event (အော်ဒါတင်ခြင်း / Status ပြောင်းခြင်း)]
                 │
                 ▼
[2. MailService (src/Eccube/Service/MailService.php)]
                 │
                 ├── Fetch Email Settings (Shop Name, Sender Email, Admin BCC)
                 ├── Query dtb_mail_template (Subject & Template Path)
                 │
                 ▼
[3. Twig Template Rendering (Resource/template/default/Mail/order.twig)]
                 │
                 ├── Customer Info, Order Items Statement, Delivery Address
                 ├── Japanese Tax Breakdown (10% standard vs 8% reduced)
                 └── Footer Signature (Shop Contact, Invoice Registration No)
                 │
                 ▼
[4. Symfony Mailer (Transport: SMTP / Sendmail)]
                 │
                 ├── Record into dtb_mail_history (Sending Log)
                 │
                 ▼
[5. Delivered to Customer Inbox & Admin BCC]
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **Email Architecture & Template Management** | [01_email_architecture_and_templates.md](/eccube/requirements/email-management/01_email_architecture_and_templates/) | `MailService`, Symfony Mailer, `dtb_mail_template`, `dtb_mail_history`, Plain Text vs HTML Emails |
| 02 | **Transactional Emails (အဓိက အီးမေးလ် ၆ မျိုး)** | [02_transactional_emails.md](/eccube/requirements/email-management/02_transactional_emails/) | 1. 注文完了 (Order), 2. 入金確認 (Payment), 3. 出荷完了 (Shipping), 4. 会員登録 (Registration), 5. パスワード再設定 (Reset), 6. 注文取消 (Cancel) |
| 03 | **Automatic Emails & Admin Notifications** | [03_automatic_emails_and_admin_notifications.md](/eccube/requirements/email-management/03_automatic_emails_and_admin_notifications/) | Status ပြောင်းပါက Auto Mail ပို့ပုံ (Event Subscriber), Admin BCC စီမံခန့်ခွဲမှု၊ ဂိုဒေါင်နှင့် စာရင်းကိုင်ဌာနများသို့ ခွဲပို့နည်း |
| 04 | **Top Client Email Tasks & Fixes (လက်တွေ့ ပြင်ဆင်နည်းများ)** | [04_top_client_tasks_and_troubleshooting.md](/eccube/requirements/email-management/04_top_client_tasks_and_troubleshooting/) | **Client များ အများဆုံး တောင်းဆိုသော ပြင်ဆင်မှု ၅ ခုနှင့် Fix လုပ်နည်းများ** (Invoice နံပါတ် ထည့်ခြင်း၊ Spam မရောက်အောင် SMTP/SPF ပြင်ဆင်ခြင်း၊ စတော့နည်းပါက Admin သို့ Auto သတိပေးခြင်း) |
| 05 | **Email Event Pipeline (Event ➔ Customer)** | [05_email_event_lifecycle.md](/eccube/requirements/email-management/05_email_event_lifecycle/) | Event ➔ Email logic ➔ Template ➔ Mailer ➔ Customer အဆင့် ၅ ဆင့် စီးဆင်းမှု အသေးစိတ် ရှင်းလင်းချက် |

---

## 🗄️ Database Tables: `dtb_mail_template` & `dtb_mail_history`

### ၁။ `dtb_mail_template` (Template ဖိုင်များနှင့် ခေါင်းစဉ်များ)
```sql
CREATE TABLE dtb_mail_template (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,            -- Template အမည် (e.g. ご注文ありがとうございます)
    file_name VARCHAR(255) NOT NULL,       -- Twig ဖိုင်အမည် (e.g. Mail/order.twig)
    subject VARCHAR(255) NOT NULL,         -- အီးမေးလ် ခေါင်းစဉ် (Subject)
    create_date DATETIME NOT NULL,
    update_date DATETIME NOT NULL
);
```

### ၂။ `dtb_mail_history` (ပေးပို့ခဲ့သော မှတ်တမ်း ရာဇဝင်)
Admin ၏ Order Detail တွင် အီးမေးလ် မည်သည့်နေ့တွင် ပို့ခဲ့သည်ကို စစ်ဆေးနိုင်သည့် ဇယား ဖြစ်သည်:
```sql
CREATE TABLE dtb_mail_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,                 -- သက်ဆိုင်ရာ အော်ဒါ ID
    send_date DATETIME NOT NULL,           -- ပေးပို့သည့် အချိန်
    subject VARCHAR(255) NOT NULL,         -- ခေါင်းစဉ်
    mail_body LONGTEXT NOT NULL            -- ပေးပို့လိုက်သော အီးမေးလ် စာသားအပြည့်အစုံ
);
```

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (Email Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **注文確認メール / サンクスメール** | Chuumon Kakunin / Sankusu Meeru | Order Confirmation / Thanks Email |
| **入金確認メール** | Nyuukin Kakunin Meeru | Payment Confirmation Email |
| **出荷完了メール / 発送通知メール** | Shukka Kanryou / Hassou Tsuuchi | Shipping Completion / Dispatch Email |
| **会員登録完了メール** | Kaiin Touroku Kanryou Meeru | Registration Welcome Email |
| **パスワード再発行メール** | Pasuwaado Sai-hakkou Meeru | Password Reset Email |
| **注文キャンセルメール** | Chuumon Kyanseru Meeru | Order Cancellation Email |
| **メールテンプレート** | Meeru Tenpureeto | Email Template |
| **自動送信** | Jidou Soushin | Automatic Email Sending |
| **送信履歴** | Soushin Rireki | Mail Sending History / Log |
| **署名** | Shomei | Email Signature / Footer (ဆိုင်အချက်အလက်) |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
