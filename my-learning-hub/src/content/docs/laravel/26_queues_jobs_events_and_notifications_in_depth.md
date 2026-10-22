---
title: "26. Queues, Jobs, Events & Notifications in Depth"
description: "Laravel Queues, Jobs, Event-Driven Architecture နှင့် Multi-Channel Notifications အဆင့်မြင့် အသုံးချနည်း၊ Async စဉ်းစားပုံ၊ Retry/Backoff Strategy၊ Batching၊ Chaining၊ Horizon နှင့် Real-work ဥပမာများ"
---

> Laravel 11 / 12 အခြေခံ။
> User တစ်ယောက်က "Checkout" ခလုတ်ကို နှိပ်လိုက်ချိန်တွင် Database သို့ Data သွင်းခြင်း၊ Credit Card ဖြတ်ခြင်း၊ Receipt Email ပို့ခြင်း၊ SMS သတိပေးခြင်း၊ စာရင်းအင်း Update လုပ်ခြင်း အားလုံးကို Request တစ်ခုတည်းတွင် အတူတူလုပ်ပါက Browser သည် ၁၀ စက္ကန့်ခန့် စောင့်ဆိုင်းနေရပြီး Timeout ဖြစ်သွားနိုင်သည်။ ဤပြဿနာကို **Queues, Jobs & Events (Asynchronous Architecture)** ဖြင့် မည်သို့ ဖြေရှင်းရမည်ကို လေ့လာပါမည်။

---

## 🧭 မာတိကာ (Table of Contents)
1. [Synchronous vs Asynchronous (ဘယ်အချိန်မှာ Queue သုံးရမလဲ စဉ်းစားပုံ)](#၁-synchronous-vs-asynchronous-ဘယ်အချိန်မှာ-queue-သုံးရမလဲ-စဉ်းစားပုံ)
2. [Queue Drivers နှိုင်းယှဉ်ချက် (sync, database, redis, sqs)](#၂-queue-drivers-နှိုင်းယှဉ်ချက်-sync-database-redis-sqs)
3. [Creating Robust Jobs (Timeout, Retries, Exponential Backoff)](#၃-creating-robust-jobs-timeout-retries-exponential-backoff)
4. [Idempotency in Queues (Job များ နှစ်ခါမဖြစ်စေရန် ကာကွယ်ခြင်း)](#၄-idempotency-in-queues-job-များ-နှစ်ခါမဖြစ်စေရန်-ကာကွယ်ခြင်း)
5. [Job Chaining vs Job Batching (Parallel & Sequential Execution)](#၅-job-chaining-vs-job-batching-parallel--sequential-execution)
6. [Failed Jobs & Dead Letter Queues (DLQ) ကိုင်တွယ်ပုံ](#၆-failed-jobs--dead-letter-queues-dlq-ကိုင်တွယ်ပုံ)
7. [Laravel Horizon (Redis Queue Monitoring Dashboard)](#၇-laravel-horizon-redis-queue-monitoring-dashboard)
8. [Event-Driven Architecture (Events & Listeners)](#၈-event-driven-architecture-events--listeners)
9. [Multi-Channel Notifications (Mail, Database, SMS, Slack)](#၉-multi-channel-notifications-mail-database-sms-slack)
10. [Real-World Project: E-Commerce Order Processing Workflow](#၁၀-real-world-project-e-commerce-order-processing-workflow)
11. [လေ့ကျင့်ခန်းများ (Hands-on Exercises)](#၁၁-လေ့ကျင့်ခန်းများ-hands-on-exercises)

---

## ၁။ Synchronous vs Asynchronous (ဘယ်အချိန်မှာ Queue သုံးရမလဲ စဉ်းစားပုံ)

```
 [❌ Synchronous Flow - နှေးကွေးပြီး Timeout ဖြစ်နိုင်သည်]
 User Request ──► [Save Order] ──► [Charge Card] ──► [Send Email (3s)] ──► [Send SMS (2s)] ──► Response (6s စောင့်ရ)
 
 [✅ Asynchronous Flow - စက္ကန့်ပိုင်းအတွင်း ချက်ချင်း Response ပြန်သည်]
 User Request ──► [Save Order] ──► [Push to Queue] ──────────────────────────────────────────► Response (200ms)
                                         │
                                         ▼ (နောက်ကွယ် Background Worker က လုပ်ဆောင်)
                                   ┌───────────────┐
                                   │ Charge Card   │
                                   │ Send Email    │
                                   │ Send SMS      │
                                   └───────────────┘
```

### 🧠 ဘယ်အချိန်မှာ Queue သုံးမလဲ စဉ်းစားနည်း စည်းမျဉ်း ၄ ချက်:
1. **Third-Party API Call များ**: Email (SES, Mailgun), SMS (Twilio), Payment, Push Notifications။ အဘယ်ကြောင့်ဆိုသော် Third-party Server နှေးကွေးပါက ကိုယ့် User စောင့်ဆိုင်းနေရမည်။
2. **CPU-Intensive Tasks**: PDF Invoice ထုတ်လုပ်ခြင်း၊ Image Resize ပြုလုပ်ခြင်း၊ Video Transcoding။
3. **Data Export/Import**: CSV ဖိုင်ထဲသို့ Data သောင်းချီ ထည့်သွင်းခြင်း/ထုတ်ယူခြင်း။
4. **ချက်ချင်း မလိုအပ်သော အလုပ်များ**: Activity Log မှတ်တမ်းတင်ခြင်း၊ Search Index (Elasticsearch/Meilisearch) သို့ Data ပို့ဆောင်ခြင်း။

---

## ၂။ Queue Drivers နှိုင်းယှဉ်ချက် (sync, database, redis, sqs)

`config/queue.php` တွင် Queue Driver ကို သတ်မှတ်နိုင်သည်:

| Driver | အလုပ်လုပ်ပုံ | သင့်တော်သည့် နေရာ | အားနည်းချက် |
| :--- | :--- | :--- | :--- |
| **`sync`** | Background မဟုတ်ဘဲ ချက်ချင်း Run သည် | Local Development / Testing | Production တွင် လုံးဝ မသုံးရ |
| **`database`** | MySQL `jobs` table ထဲ ထည့်သည် | အသေးစား Project များ | Database ပေါ် Load များပြီး နှေးသည် |
| **`redis`** | In-memory RAM ပေါ်တွင် အလုပ်လုပ်သည် | **Production အတွက် စံနှုန်း (အကြံပြု)** | Horizon ဖြင့် စောင့်ကြည့်နိုင်သည် |
| **`sqs`** | AWS Managed Queue Service | Cloud Serverless / Microservices | Setup ပိုမို ရှုပ်ထွေးသည် |

---

## ၃။ Creating Robust Jobs (Timeout, Retries, Exponential Backoff)

```bash
php artisan make:job SendOrderReceiptJob
```

အလုပ်ခွင်သုံး Production-ready Job Class တစ်ခု၏ ဖွဲ့စည်းပုံ:

```php
namespace App\Jobs;

use App\Models\Order;
use App\Mail\OrderReceiptMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendOrderReceiptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // အများဆုံး ကြိုးစားရမည့် အကြိမ်အရေအတွက်
    public int $tries = 5;

    // Job တစ်ခု အများဆုံး ကြာမြင့်နိုင်သော စက္ကန့် (Timeout)
    public int $timeout = 60;

    // အကယ်၍ Job Fail ဖြစ်သွားပါက ချက်ချင်း retry မလုပ်ဘဲ
    // ပထမအကြိမ် ၁၀ စက္ကန့်၊ ဒုတိယအကြိမ် ၃၀ စက္ကန့်၊ တတိယအကြိမ် ၁ မိနစ် စောင့်ပြီးမှ ပြန်ကြိုးစားမည် (Exponential Backoff)
    public function backoff(): array
    {
        return [10, 30, 60];
    }

    public function __construct(
        public Order $order
    ) {}

    public function handle(): void
    {
        // Third-party Mail Server သို့ ပို့ဆောင်ခြင်း
        Mail::to($this->order->user->email)->send(new OrderReceiptMail($this->order));

        Log::info("Receipt email sent for Order #{$this->order->id}");
    }

    // Retries အားလုံး ကုန်ဆုံးပြီးနောက် လုံးဝ Fail ဖြစ်သွားပါက လုပ်ဆောင်မည့် အလုပ်
    public function failed(\Throwable $exception): void
    {
        Log::critical("Failed to send order receipt for Order #{$this->order->id}: {$exception->getMessage()}");
        // Slack / Sentry သို့ သတိပေးချက် ပို့နိုင်သည်
    }
}
```

Dispatch လုပ်ပုံ:
```php
// ပုံမှန် Dispatch
SendOrderReceiptJob::dispatch($order);

// စက္ကန့် ၃၀ စောင့်ပြီးမှ စတင်စေလိုပါက (Delayed Dispatch)
SendOrderReceiptJob::dispatch($order)->delay(now()->addSeconds(30));

// သီးသန့် Queue Channel သို့ ပို့လိုပါက (High Priority)
SendOrderReceiptJob::dispatch($order)->onQueue('emails');
```

---

## ၄။ Idempotency in Queues (Job များ နှစ်ခါမဖြစ်စေရန် ကာကွယ်ခြင်း)

Network Error ကြောင့် Worker က Job တစ်ခုကို ၂ ကြိမ် ဆွဲယူ run မိခြင်း (သို့မဟုတ်) Retries ပြုလုပ်ချိန်တွင် **User ထံမှ ပိုက်ဆံ ၂ ခါ ဖြတ်မိသွားခြင်းမျိုး မဖြစ်ရအောင်** ကာကွယ်ရမည် (Idempotency)။

### အဖြေ: Atomic Locks (`Cache::lock`) သုံးခြင်း
```php
public function handle(): void
{
    $lockKey = "process_payment_order_{$this->order->id}";

    // စက္ကန့် ၆၀ သက်တမ်းရှိသော Lock ကို ရယူသည်
    $lock = Cache::lock($lockKey, 60);

    if (! $lock->get()) {
        Log::warning("Order #{$this->order->id} payment is already being processed.");
        return;
    }

    try {
        // Order က ပေးချေပြီးသား ဖြစ်နေပါက ထပ်မဖြတ်တော့ပါ
        if ($this->order->status === 'paid') {
            return;
        }

        // Credit Card ဖြတ်ခြင်း...
        $this->order->update(['status' => 'paid']);
    } finally {
        $lock->release();
    }
}
```

---

## ၅။ Job Chaining vs Job Batching (Parallel & Sequential Execution)

### (က) Job Chaining (အစဉ်လိုက် တစ်ခုပြီးမှ တစ်ခု လုပ်ဆောင်ခြင်း)
Job တစ်ခု အောင်မြင်မှသာ နောက်တစ်ခုကို ဆက် run မည်။ ကြားထဲတွင် တစ်ခု ကျရှုံးပါက ကျန် Job များ ဆက်မလုပ်တော့ပါ။
```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPaymentJob($order),
    new DeductStockJob($order),
    new SendOrderReceiptJob($order),
    new NotifyVendorJob($order),
])->dispatch();
```

### (ခ) Job Batching (တစ်ပြိုင်နက်တည်း Parallel လုပ်ဆောင်ခြင်း)
ဥပမာ: User ၅,၀၀၀ ထံသို့ Newsletter ပို့ရာတွင် တစ်ပြိုင်နက် Batch အလိုက် run ပြီး တိုးတက်မှု (Progress %) ကို စောင့်ကြည့်ခြင်း:
```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;

$batch = Bus::batch([
    new SendEmailJob($user1),
    new SendEmailJob($user2),
    new SendEmailJob($user3),
])->then(function (Batch $batch) {
    // Job အားလုံး အောင်မြင်စွာ ပြီးဆုံးသွားချိန်တွင် run မည်
    Log::info('All emails sent successfully!');
})->catch(function (Batch $batch, Throwable $e) {
    // ပထမဆုံး Job တစ်ခုခု ကျရှုံးသွားချိန်တွင် run မည်
})->finally(function (Batch $batch) {
    // ပြီးဆုံးသွားချိန်တွင် အမြဲ run မည်
})->dispatch();

// Frontend သို့ Batch ID ပေးပြီး Progress % ကို Poll လုပ်စေနိုင်သည်
return response()->json(['batch_id' => $batch->id]);
```

---

## ၆။ Failed Jobs & Dead Letter Queues (DLQ) ကိုင်တွယ်ပုံ

Job များ Fail ဖြစ်သွားပါက ပျောက်ပျက်မသွားဘဲ `failed_jobs` table ထဲသို့ ရောက်သွားသည်။

```bash
# Fail ဖြစ်နေသော Job စာရင်းများကို ကြည့်ခြင်း
php artisan queue:failed

# Job ID 5 ကို ပြန်လည် ကြိုးစား Run ခြင်း
php artisan queue:retry 5

# Fail ဖြစ်နေသော Job အားလုံးကို ပြန် Run ခြင်း
php artisan queue:retry all

# Failed job အားလုံးကို ဖျက်ပစ်ခြင်း
php artisan queue:flush
```

---

## ၇။ Laravel Horizon (Redis Queue Monitoring Dashboard)

Enterprise Production များတွင် Redis Queue များကို စောင့်ကြည့်ရန် **Laravel Horizon** သည် မရှိမဖြစ် ဖြစ်သည်။

```bash
composer require laravel/horizon
php artisan horizon:install
```

### Horizon ၏ အဓိက စွမ်းဆောင်ချက်များ:
* Dashboard UI (`/horizon`) ဖြင့် Real-time Job Throughput, Run-time ကြည့်ရှုနိုင်ခြင်း။
* **Auto-Balancing**: Queue ထဲတွင် Job များ ပြည့်လျှံလာပါက Worker Process အရေအတွက်ကို အလိုအလျောက် တိုးမြှင့်ပေးခြင်း (Auto-scaling)။
* Long-running Jobs, Failed Jobs များကို UI မှ ချက်ချင်း Retry လုပ်နိုင်ခြင်း။

`config/horizon.php`:
```php
'defaults' => [
    'supervisor-1' => [
        'connection' => 'redis',
        'queue' => ['high', 'default', 'low'],
        'balance' => 'auto', // အလုပ်များသော queue ကို worker ပိုပေးမည်
        'autoScalingStrategy' => 'time',
        'maxProcesses' => 20,
        'minProcesses' => 2,
        'tries' => 3,
    ],
],
```

Production တွင် Horizon ကို Background Process အနေဖြင့် ထားရှိရန် Supervisor ကို သုံးရသည် ([နောက်သင်ခန်းစာ 28 တွင် အသေးစိတ်ပါဝင်သည်])။

---

## ၈။ Event-Driven Architecture (Events & Listeners)

Controller သည် ပင်မအလုပ်တစ်ခုကိုသာ လုပ်ဆောင်ပြီး ကျန်အလုပ်များကို **Event ကြေညာ (Dispatch)** ပေးလိုက်ခြင်းဖြင့် Decoupled Code ကို ရရှိစေသည်။

```
 [OrderController]
         │
         ▼
 Dispatches: OrderPlacedEvent
         │
         ├───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
 [SendReceiptListener] [ReduceStockListener] [RewardPointsListener]
 (Queue ပေါ်တွင် run)  (Queue ပေါ်တွင် run)  (Queue ပေါ်တွင် run)
```

```bash
php artisan make:event OrderPlaced
php artisan make:listener SendOrderNotification --event=OrderPlaced
```

### (က) Event Class (`app/Events/OrderPlaced.php`)
```php
namespace App\Events;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}
}
```

### (ခ) Queued Listener (`app/Listeners/SendOrderNotification.php`)
Listener Class တွင် **`implements ShouldQueue`** ထည့်ပေးရုံဖြင့် အလိုအလျောက် Background Queue ထဲသို့ ရောက်သွားမည် ဖြစ်သည်!
```php
namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\OrderPlacedNotification;

class SendOrderNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(OrderPlaced $event): void
    {
        $event->order->user->notify(new OrderPlacedNotification($event->order));
    }
}
```

---

## ၉။ Multi-Channel Notifications (Mail, Database, SMS, Slack)

Laravel Notification သည် မက်ဆေ့ခ်ျတစ်ခုတည်းကို Channel ပေါင်းစုံ (Email, Database Bell Icon, SMS, Slack) သို့ တစ်ပြိုင်နက် ပို့ဆောင်ပေးနိုင်သော စနစ်ဖြစ်သည်။

```bash
php artisan make:notification OrderPlacedNotification
```

`app/Notifications/OrderPlacedNotification.php`
```php
namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    // မည်သည့် Channel များသို့ ပို့မည်နည်း?
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    // ၁။ Email Template
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Order Confirmation #{$this->order->order_number}")
            ->greeting("မင်္ဂလာပါ {$notifiable->name},")
            ->line("သင့်၏ Order အား အောင်မြင်စွာ လက်ခံရရှိပါပြီ။")
            ->action('Order အသေးစိတ်ကြည့်ရန်', url("/orders/{$this->order->id}"))
            ->line('ကျွန်ုပ်တို့နှင့် အတူ အားပေးမှုအတွက် ကျေးဇူးတင်ရှိပါသည်။');
    }

    // ၂။ Website Bell Icon တွင် ပြသမည့် Database Record
    public function toArray(object $notifiable): array
    {
        return [
            'order_id'     => $this->order->id,
            'order_number' => $this->order->order_number,
            'amount'       => $this->order->total_amount,
            'message'      => "Order #{$this->order->order_number} တင်ခြင်း အောင်မြင်ပါသည်။",
        ];
    }
}
```

Frontend တွင် Unread Notifications များ ဖတ်ရှုပုံ:
```php
// User ၏ မဖတ်ရသေးသော Notification များ ခေါ်ယူခြင်း
$unreadNotifications = auth()->user()->unreadNotifications;

// အားလုံးကို ဖတ်ပြီးသားအဖြစ် မှတ်သားခြင်း
auth()->user()->unreadNotifications->markAsRead();
```

---

## ၁၀။ Real-World Project: E-Commerce Order Processing Workflow

အောက်ပါ Code သည် စနစ်တစ်ခုလုံးကို ချိတ်ဆက်ထားသော Production Controller ဖြစ်ပါသည်:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Events\OrderPlaced;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function __invoke(StoreOrderRequest $request)
    {
        $order = DB::transaction(function () use ($request) {
            // ၁။ Order သိမ်းဆည်းခြင်း
            $order = Order::create([
                'user_id'      => $request->user()->id,
                'total_amount' => $request->total_amount,
                'status'       => 'pending',
            ]);

            return $order;
        });

        // ၂။ Event Dispatch ပြုလုပ်ခြင်း
        // Background Queue ထဲတွင် Email, SMS, Stock deduction အားလုံး အလိုအလျောက် ဆက်လက် လုပ်ဆောင်သွားမည်!
        OrderPlaced::dispatch($order);

        // ၃။ Client သို့ ၂၀၀ms အတွင်း အမြန်ဆုံး Response ပြန်ပေးခြင်း
        return response()->json([
            'message'  => 'Order placed successfully',
            'order_id' => $order->id,
        ], 201);
    }
}
```

---

## ၁၁။ လေ့ကျင့်ခန်းများ (Hands-on Exercises)

### 🏋️ လေ့ကျင့်ခန်း (၁) - Delayed Welcome Email
User အသစ် Register လုပ်ပြီး ၅ မိနစ် ကြာမှ ပို့ဆောင်မည့် `SendWelcomeEmailJob` တစ်ခုကို ရေးသားပြီး `$delay = now()->addMinutes(5)` ဖြင့် စမ်းသပ်ပါ။

### 🏋️ လေ့ကျင့်ခန်း (၂) - Atomic Lock Idempotency
Payment Job တစ်ခုကို Worker ၂ ခုက တစ်ပြိုင်နက်တည်း ကြိုးစား run သော်လည်း `Cache::lock` ကြောင့် ငွေ ၂ ခါ မဖြတ်ဘဲ တစ်ခုသာ အလုပ်လုပ်သွားကြောင်း စမ်းသပ်ပါ။

### 🏋️ လေ့ကျင့်ခန်း (၃) - Horizon Setup with Redis
Local စက်တွင် Redis တင်ပြီး Horizon Dashboard ကို ဖွင့်လှစ်ကာ Job ၅၀ ခန့် တစ်ပြိုင်နက် Dispatch လုပ်ပြီး Auto-scaling ဖြစ်ပေါ်ပုံကို စောင့်ကြည့်ပါ။
