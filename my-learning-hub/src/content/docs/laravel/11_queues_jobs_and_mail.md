---
title: "11. Queues, Jobs and Mail"
description: "1. [Synchronous vs Asynchronous Processing ကွာခြားချက် (ဘာကြောင့် သုံးရသလဲ?)](#၁-synchronous-vs-asynchronous-processing)"
---

## ⏳ သင်ခန်းစာ (၁၁) - Queues, Jobs, Events နှင့် Mail Notifications
### (Lesson 11: Asynchronous Processing, Background Jobs, Queue Workers & Mail)

---

## 📌 မာတိကာ (Contents)
1. [Synchronous vs Asynchronous Processing ကွာခြားချက် (ဘာကြောင့် သုံးရသလဲ?)](#၁-synchronous-vs-asynchronous-processing)
2. [Queue Drivers များနှင့် Database Queue Setup](#၂-queue-drivers-များနှင့်-database-queue-setup)
3. [Queue Job တစ်ခု ဖန်တီးခြင်းနှင့် Dispatch လုပ်ပုံ](#၃-queue-job-တစ်ခု-ဖန်တီးခြင်းနှင့်-dispatch-လုပ်ပုံ)
4. [Queue Workers Run ခြင်းနှင့် Supervisor စီမံခန့်ခွဲမှု](#၄-queue-workers-run-ခြင်းနှင့်-supervisor)
5. [Laravel Mailables ဖြင့် Email ပို့ဆောင်ခြင်း](#၅-laravel-mailables-ဖြင့်-email-ပို့ဆောင်ခြင်း)
6. [Events နှင့် Listeners စနစ် (Decoupled Architecture)](#၆-events-နှင့်-listeners-စနစ်)

---

## ၁။ Synchronous vs Asynchronous Processing

### (က) ဒါက ဘာလဲ? (What is it?)
* **Synchronous (Blocking)**: ကုဒ်တစ်ခု ပြီးဆုံးမှသာ နောက်တစ်ခုသို့ ဆက်သွားခြင်း။
* **Asynchronous (Non-Blocking)**: အချိန်ကြာမည့် အလုပ်များကို Background သို့ ပို့ထားပြီး အသုံးပြုသူထံ ချက်ချင်း Response ပြန်ပေးခြင်း။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
Customer က Register လုပ်ချိန်တွင် Email ပို့ရန် ၅ စက္ကန့် ကြာမြင့်ပါက Browser တွင် ၅ စက္ကန့်လုံး Loading လည်နေမည်။ Queue သုံးထားပါက < 100ms အတွင်း အောင်မြင်ကြောင်း စာမျက်နှာပေါ်လာပြီး Email ကို နောက်ကွယ်မှ auto ပို့ပေးသည်။

### (ဂ) အားသာချက်များ (Advantages):
* **Super-Fast UX**: အသုံးပြုသူကို စောင့်ဆိုင်းစရာ မလိုစေပါ။
* **Fault Tolerance**: အင်တာနက်ပြတ်တောက်၍ Email မထွက်ပါက အလိုအလျောက် Retry ပြန်လုပ်ပေးသည်။

---

## ၂။ Queue Drivers များနှင့် Database Queue Setup

```ini
# .env ဖိုင်တွင်
QUEUE_CONNECTION=database
```

Queue jobs များ သိမ်းဆည်းရန် Table ဆောက်ခြင်း:
```bash
php artisan queue:table
php artisan queue:failed-table
php artisan migrate
```

---

## ၃။ Queue Job တစ်ခု ဖန်တီးခြင်းနှင့် Dispatch လုပ်ပုံ

```bash
php artisan make:job SendWelcomeEmailJob
```

```php
// app/Jobs/SendWelcomeEmailJob.php
namespace App\Jobs;

use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3; // Error တက်ပါက ၃ ကြိမ် ပြန်လည်ကြိုးစားမည်

    public function __construct(public User $user) {}

    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeMail($this->user));
    }
}
```

#### Controller မှ Dispatch လုပ်ခြင်း:
```php
// ချက်ချင်း Queue သို့ ပစ်ထည့်ခြင်း
SendWelcomeEmailJob::dispatch($user);

// ၁၀ မိနစ်အကြာမှ ပို့စေလိုပါက
SendWelcomeEmailJob::dispatch($user)->delay(now()->addMinutes(10));
```

---

## ၄။ Queue Workers Run ခြင်းနှင့် Supervisor

Queue ထဲ ရောက်နေသော အလုပ်များကို execute လုပ်ရန် Terminal တွင် run ရပါသည်:
```bash
php artisan queue:work
```

> [!IMPORTANT]
> Live Production Server တွင် Terminal ပိတ်သွားပါက Queue မရပ်တန့်စေရန် Linux **Supervisor** ဖြင့် အလိုအလျောက် စောင့်ကြည့် run ပေးရသည်။

---

## ၅။ Laravel Mailables ဖြင့် Email ပို့ဆောင်ခြင်း

```bash
php artisan make:mail WelcomeMail
```

```php
// app/Mail/WelcomeMail.php
namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WelcomeMail extends Mailable
{
    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'ကြိုဆိုပါသည်');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.welcome');
    }
}
```

---

## ၆။ Events နှင့် Listeners စနစ် (Decoupled Architecture)

### (က) ဘာကြောင့် သုံးရသလဲ?
Order တင်လိုက်သည့်အခါ SMS ပို့ခြင်း၊ Stock လျှော့ခြင်း၊ Accounting စာရင်းထည့်ခြင်းများကို Controller ထဲတွင် ကုဒ်များ ပြည့်ကျပ်မနေစေရန် **Event-Driven Pattern** ဖြင့် သီးခြားစီ ခွဲထုတ်လုပ်ဆောင်ရန် ဖြစ်သည်။

```bash
php artisan make:event OrderPlaced
php artisan make:listener SendOrderNotification --event=OrderPlaced
```

```php
// Controller တွင် Event Dispatch လုပ်ရုံသာ:
OrderPlaced::dispatch($order);
```
