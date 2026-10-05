---
title: "15. Mail and Notifications"
description: "1. [လုပ်ငန်းခွင်သုံး Mail Drivers နှင့် SMTP Configuration](#၁-လုပ်ငန်းခွင်သုံး-mail-drivers-နှင့်-smtp-configuration)"
---

## 📧 သင်ခန်းစာ (၁၅) - Advanced Mail System နှင့် Multi-Channel Notifications
### (Lesson 15: Enterprise Mail Configuration, Markdown Mailables, Attachments & Multi-Channel Notifications)

---

## 📌 မာတိကာ (Contents)
1. [လုပ်ငန်းခွင်သုံး Mail Drivers နှင့် SMTP Configuration](#၁-လုပ်ငန်းခွင်သုံး-mail-drivers-နှင့်-smtp-configuration)
2. [Markdown Mailables တည်ဆောက်ခြင်းနှင့် Template ရေးဆွဲခြင်း](#၂-markdown-mailables-တည်ဆောက်ခြင်း)
3. [Attachments (PDF Invoices, စာချုပ်များ) တွဲဖက်ပေးပို့ခြင်း](#၃-attachments-တွဲဖက်ပေးပို့ခြင်း)
4. [Queued Emails (Email များကို Background တွင် စနစ်တကျ ပို့ဆောင်ခြင်း)](#၄-queued-emails-background-တွင်-ပို့ဆောင်ခြင်း)
5. [Laravel Multi-Channel Notifications စနစ် (Mail, Database, SMS, Slack)](#၅-laravel-multi-channel-notifications-စနစ်)
6. [Real-World E-Commerce Order Confirmation Email နမူနာ အပြည့်အစုံ](#၆-real-world-e-commerce-order-confirmation-email-နမူနာ)

---

## ၁။ လုပ်ငန်းခွင်သုံး Mail Drivers နှင့် SMTP Configuration

### (က) ဒါက ဘာလဲ? (What is it?)
Laravel ၏ Mail Subsystem သည် PHP ၏ အားနည်းချက်ရှိသော `mail()` function ကို အသုံးမပြုဘဲ **Symfony Mailer** ပေါ်တွင် အခြေခံကာ တည်ဆောက်ထားသော Enterprise Email Delivery Architecture ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
လုပ်ငန်းခွင် Website တစ်ခုတွင် Password Reset, Order Confirmation, OTP Code ပို့ခြင်း စသည့် လုပ်ငန်းစဉ်တိုင်းသည် အီးမေးလ် မရှိမဖြစ် လိုအပ်သည်။ ရိုးရိုး PHP `mail()` function သည် Authentication မပါရှိခြင်း၊ Spam ထဲသို့ ၁၀၀% ရောက်ရှိသွားခြင်း၊ Error ဖြစ်ပါက ခြေရာမခံနိုင်ခြင်း စသည့် ဆိုးကျိုးများ ရှိသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Driver Pluggable**: Code တစ်ကြောင်းမှ ပြင်စရာမလိုဘဲ `.env` ဖိုင်မှ Driver အမည် ပြောင်းရုံဖြင့် Mailtrap မှ Amazon SES သို့မဟုတ် SendGrid သို့ အလွယ်တကူ ကူးပြောင်းနိုင်သည်။
* **SSL/TLS Encryption**: အီးမေးလ် ပို့ဆောင်မှု လမ်းကြောင်းကို အပြည့်အဝ Encrypt ပြုလုပ်ပေးသည်။
* **Spam Protection**: SMTP Credentials, DKIM, SPF တို့နှင့် ချိတ်ဆက်နိုင်သဖြင့် Inbox သို့ တိုက်ရိုက်ရောက်ရှိစေသည်။

### (ဃ) မသုံးလျှင် ကြုံတွေ့ရမည့် ပြဿနာများ:
Server IP သည် Spam Blacklist ဝင်သွားမည်ဖြစ်ပြီး ဖောက်သည်များထံ Email လုံးဝ မရောက်ရှိတော့ခြင်း။

### 🛠️ လက်တွေ့ Configuration:
```ini
# .env ဖိုင်တွင်
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@myanmar-shop.com"
MAIL_FROM_NAME="Myanmar E-Commerce"
```

---

## ၂။ Markdown Mailables တည်ဆောက်ခြင်း

### (က) ဒါက ဘာလဲ? (What is it?)
HTML ကုဒ်များနှင့် Inline CSS များကို လက်ဖြင့် ပင်ပန်းစွာ ရေးစရာမလိုဘဲ **Blade Components များနှင့် Markdown Syntax ကို ပေါင်းစပ်ကာ လှပသော Responsive Email Template** များ ထုတ်လုပ်ပေးသည့် စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Email Clients များ (Gmail, Outlook, Apple Mail) သည် CSS Styles များကို browser ကဲ့သို့ ပုံမှန် render မလုပ်နိုင်ကြပါ။ Markdown Mailables သည် Client တိုင်းနှင့် ကိုက်ညီသော Tables, Buttons, Header စသည့် ဒီဇိုင်းများကို အလိုအလျောက် သင့်တော်စွာ ပြင်ဆင်ပေးသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Mobile-Responsive**: ဖုန်း screen အရွယ်အစားအလိုက် ခလုတ်များနှင့် ဇယားများ auto ညှိပေးသည်။
* **Dark Mode Compatible**: ခေတ်မီ ဖုန်းများနှင့် ကွန်ပျူတာများ၏ Dark Mode တွင် စာသားများ ပျောက်ကွယ်မသွားစေရန် ထိန်းပေးသည်။
* **Clean Code**: ရှုပ်ထွေးသော HTML Table layout များ ရေးစရာမလိုဘဲ Markdown format ဖြင့် ရှင်းလင်းစွာ ရေးနိုင်သည်။

```bash
php artisan make:mail OrderInvoiceMail --markdown=emails.orders.invoice
```

### (ဃ) လက်တွေ့ Code အသုံးချပုံ:
```php
// app/Mail/OrderInvoiceMail.php
namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderInvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "သင်၏ အော်ဒါ #{$this->order->id} ကို လက်ခံရရှိပါပြီ",
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.orders.invoice');
    }
}
```

```markdown
<!-- resources/views/emails/orders/invoice.blade.php -->
<x-mail::message>
# မင်္ဂလာပါ {{ $order->user->name }},

သင်၏ အော်ဒါအသေးစိတ် အချက်အလက်များ:

<x-mail::table>
| ပစ္စည်းအမည် | အရေအတွက် | ဈေးနှုန်း |
| :--- | :---: | :---: |
@foreach($order->items as $item)
| {{ $item->product->title }} | {{ $item->quantity }} | {{ number_format($item->price) }} MMK |
@endforeach
</x-mail::table>

**စုစုပေါင်း ကျသင့်ငွေ:** **{{ number_format($order->total_amount) }} MMK**

<x-mail::button :url="route('orders.show', $order->id)" color="success">
အော်ဒါ အခြေအနေ စစ်ဆေးရန်
</x-mail::button>

ကျေးဇူးတင်စွာဖြင့်,<br>
{{ config('app.name') }}
</x-mail::message>
```

---

## ၃။ Attachments (PDF Invoices, စာချုပ်များ) တွဲဖက်ပေးပို့ခြင်း

### (က) ဒါက ဘာလဲ? (What is it?)
အီးမေးလ် ပေးပို့ရာတွင် PDF ဘောင်ချာများ၊ စာချုပ်များ သို့မဟုတ် ဓာတ်ပုံများကို အီးမေးလ်နှင့်အတူ တစ်ပါတည်း ပူးတွဲ (Attach) ပေးပို့သော Feature ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Customer များသည် ဝယ်ယူပြီးပါက တရားဝင် အခွန်ပြေစာ (Tax Invoice) သို့မဟုတ် လက်မှတ်ပါသော စာချုပ် PDF ကို သိမ်းဆည်းလိုကြသည်။ Link နှိပ်ပြီးမှ ဒေါင်းလုဒ်ဆွဲခိုင်းခြင်းထက် အီးမေးလ်ထဲတွင် တိုက်ရိုက် ပူးတွဲပေးပို့ခြင်းက ပိုမိုယုံကြည်စိတ်ချရသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Multi-Source Support**: Local Storage, AWS S3 Bucket သို့မဟုတ် RAM ပေါ်ရှိ Dynamic PDF Bytes များကို တိုက်ရိုက် Attach လုပ်နိုင်သည်။
* **MIME Validation**: မှန်ကန်သော ဖိုင်အမျိုးအစား (`application/pdf`) ဖြင့်သာ ပို့သဖြင့် Corrupted မဖြစ်ပါ။

```php
use Illuminate\Mail\Mailables\Attachment;

public function attachments(): array
{
    return [
        // S3 သို့မဟုတ် Local Storage မှ ဖိုင်ကို နာမည်ပြောင်း၍ Attach လုပ်ခြင်း
        Attachment::fromStorageDisk('public', "invoices/inv_{$this->order->id}.pdf")
            ->as("Official-Invoice-{$this->order->id}.pdf")
            ->withMime('application/pdf'),
    ];
}
```

---

## ၄။ Queued Emails (Email များကို Background တွင် ပို့ဆောင်ခြင်း)

### (က) ဒါက ဘာလဲ? (What is it?)
အီးမေးလ်ပို့ခြင်းကို အသုံးပြုသူ၏ Browser HTTP Request အတွင်း မလုပ်ဆောင်စေဘဲ နောက်ကွယ်ရှိ **Queue Worker** ထံသို့ လွှဲပြောင်းပေးကာ Asynchronous လုပ်ဆောင်စေသော စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
SMTP Server နှင့် ချိတ်ဆက်ပြီး Email ပို့ရန် ပျမ်းမျှ ၂ စက္ကန့်မှ ၅ စက္ကန့်အထိ ကြာမြင့်သည်။ လူ ၁၀ ယောက် ပြိုင်တူ စာရင်းသွင်းပါက Server ချိတ်ဆက်မှုများ ပိတ်ဆို့သွားမည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Instant Response Time**: Customer သည် ခလုတ်နှိပ်လိုက်သည်နှင့် < 100ms အတွင်း "Success" စာမျက်နှာကို ချက်ချင်း မြင်ရသည်။
* **Automatic Retries**: အင်တာနက် နှေးကွေး၍ Email ပို့မရပါက Framework က အကြိမ်ကြိမ် (ဥပမာ ၃ ကြိမ်) auto ပြန်လည် ကြိုးစားပေးသည်။
* **Delay Capabilities**: ချက်ချင်း မပို့ဘဲ ၁၀ မိနစ်အကြာမှ ပို့စေလိုပါက `later()` method ဖြင့် အချိန်ရွှေ့ဆိုင်းနိုင်သည်။

```php
use App\Mail\OrderInvoiceMail;
use Illuminate\Support\Facades\Mail;

// ၁။ Queue ထဲ ထည့်သွင်းခြင်း (Instant Response)
Mail::to($user->email)->queue(new OrderInvoiceMail($order));

// ၂။ အချိန်ရွှေ့ဆိုင်း၍ ပို့ခြင်း (ဥပမာ- ၁၅ မိနစ် ကြာပြီးမှ ပို့ရန်)
Mail::to($user->email)->later(now()->addMinutes(15), new OrderInvoiceMail($order));
```

---

## ၅။ Laravel Multi-Channel Notifications စနစ်

### (က) ဒါက ဘာလဲ? (What is it?)
သတင်းအချက်အလက် တစ်ခုတည်းကို ရေးသားထားပြီး မတူညီသော Channels များ (Email, Website ခေါင်းလောင်း အိုင်ကွန် In-app DB, SMS, Slack, Telegram) သို့ **Code တစ်ခုတည်းဖြင့် တစ်ပြိုင်နက် ခွဲထုတ်ပေးပို့နိုင်သော ဗဟိုအသိပေးချက် စနစ်** ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
အကယ်၍ Notifications စနစ် မသုံးပါက Email ပို့ရန် code တစ်ခါရေး၊ Database သိမ်းရန် code တစ်ခါရေး၊ SMS ပို့ရန် code တစ်ခါရေးရသဖြင့် Code Duplication ဖြစ်ကာ ပြင်ဆင်ရ အလွန်ခက်ခဲစေသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Single Source of Truth**: သတင်းအချက်အလက် တစ်ခုတည်းကို စီမံရသဖြင့် အမှားနည်းပါးသည်။
* **In-App Bell Icon Support**: User ဖတ်ပြီး/မဖတ်ရသေးသည့် အခြေအနေ (`markAsRead()`) ကို Framework က အသင့် ထောက်ပံ့ပေးထားသည်။

```bash
php artisan make:notification OrderStatusNotification
php artisan notifications:table
php artisan migrate
```

```php
// app/Notifications/OrderStatusNotification.php
namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order, public string $status) {}

    // ပို့ဆောင်မည့် လမ်းကြောင်းများ ရွေးချယ်ခြင်း
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Email ရော In-App Notification ရော ပို့မည်
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('သင့်အော်ဒါ အခြေအနေ ပြောင်းလဲသွားပါပြီ')
            ->line("သင့်အော်ဒါ #{$this->order->id} သည် '{$this->status}' အဆင့်သို့ ရောက်ရှိပါပြီ။")
            ->action('ကြည့်ရှုရန်', url('/orders/' . $this->order->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'status'   => $this->status,
            'message'  => "အော်ဒါ #{$this->order->id} အခြေအနေသည် '{$this->status}' သို့ ရောက်ရှိပါပြီ။",
        ];
    }
}
```

#### သုံးစွဲပုံ:
```php
// User ထံ ပို့ဆောင်ခြင်း
$user->notify(new OrderStatusNotification($order, 'Delivered'));

// Controller / Blade တွင် In-App Notifications ထုတ်ပြခြင်း
$unreadCount = auth()->user()->unreadNotifications->count();
```

---

## ၆။ Real-World E-Commerce Order Confirmation Email နမူနာ

```php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Notifications\OrderStatusNotification;
use App\Mail\OrderInvoiceMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function completeCheckout(Request $request)
    {
        $order = Order::create([...]);

        // Customer ထံ Invoice Email ကို Background Queue သို့ ပို့ဆောင်ခြင်း
        Mail::to($request->user()->email)->queue(new OrderInvoiceMail($order));

        // Customer ၏ In-App Bell Notification ထဲသို့ ထည့်သွင်းခြင်း
        $request->user()->notify(new OrderStatusNotification($order, 'Confirmed'));

        return redirect()->route('orders.success', $order->id)
                         ->with('success', 'အော်ဒါတင်ခြင်း အောင်မြင်ပါသည်။ အသေးစိတ်ကို Email နှင့် အသိပေးချက်ထဲ ထည့်သွင်းထားပါသည်။');
    }
}
```
