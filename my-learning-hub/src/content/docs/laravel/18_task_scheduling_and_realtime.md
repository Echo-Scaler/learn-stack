---
title: "18. Task Scheduling and Realtime"
description: "1. [Laravel Task Scheduling ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-laravel-task-scheduling-ဆိုတာဘာလဲ-ဘာကြောင့်-သုံးရသလဲ)"
---

## ⏰ သင်ခန်းစာ (၁၈) - Task Scheduling (Laravel Cron) နှင့် Real-Time WebSockets
### (Lesson 18: Task Scheduling, Server Crontab, Laravel Reverb & Real-Time WebSockets)

---

## 📌 မာတိကာ (Contents)
1. [Laravel Task Scheduling ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-laravel-task-scheduling-ဆိုတာဘာလဲ-ဘာကြောင့်-သုံးရသလဲ)
2. [အချိန်ဇယား သတ်မှတ်ခြင်း နည်းလမ်းများ (`routes/console.php`)](#၂-အချိန်ဇယား-သတ်မှတ်ခြင်း-နည်းလမ်းများ)
3. [Overlap မဖြစ်စေရန် တားဆီးခြင်းနှင့် Multi-Server Execution](#၃-overlap-မဖြစ်စေရန်-တားဆီးခြင်း)
4. [Production Server ပေါ်တွင် Single Cron Job ချိတ်ဆက်ခြင်း](#၄-production-server-ပေါ်တွင်-cron-job-ချိတ်ဆက်ခြင်း)
5. [Real-Time WebSockets သဘောတရား (HTTP Polling vs WebSockets)](#၅-real-time-websockets-သဘောတရား)
6. [Laravel Reverb နှင့် Broadcast Events လက်တွေ့ အသုံးချပုံ](#၆-laravel-reverb-နှင့်-broadcast-events)

---

## ၁။ Laravel Task Scheduling ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Task Scheduling** ဆိုသည်မှာ သတ်မှတ်ထားသော အချိန်ကာလတစ်ခုရောက်တိုင်း (ဥပမာ- နေ့စဉ် ညသန်းခေါင်၊ ၁ နာရီတစ်ကြိမ် သို့မဟုတ် ၁ မိနစ်တစ်ကြိမ်) နောက်ကွယ်မှ အလိုအလျောက် ပုံမှန် run စေမည့် လုပ်ငန်းစဉ် (Cron Job) များကို PHP Code ဖြင့် စီမံခန့်ခွဲသော စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Linux Server တွင် Cron Job တစ်ခုထည့်တိုင်း SSH ဝင်ပြီး Terminal တွင် `crontab -e` ဖြင့် ရိုက်ထည့်ရသည်။ Application ကြီးမားလာသောအခါ Cron Jobs ပေါင်းများစွာ ဖြစ်လာပြီး Git Version Control ထဲ မပါဝင်သဖြင့် မည်သည့် Cron များ ရှိနေသည်ကို ခြေရာခံရ ခက်ခဲလာသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Single Crontab Entry**: Server ပေါ်တွင် Cron လိုင်း (၁) ကြောင်းသာ ထည့်ထားရုံဖြင့် Laravel Code ထဲမှ အလုပ်ပေါင်း ရာချီကို စီမံနိုင်သည်။
* **Git Version Controlled**: Task Schedules များသည် Project Git ထဲတွင် ပါဝင်သဖြင့် အဖွဲ့သားတိုင်း ရရှိနိုင်သည်။
* **Rich Frequency Options**: `daily()`, `hourly()`, `weekly()`, `monthly()`, `everyFiveMinutes()` စသဖြင့် အင်္ဂလိပ်လို ဖတ်ရလွယ်ကူသော Syntax များ ပါဝင်သည်။

---

## ၂။ အချိန်ဇယား သတ်မှတ်ခြင်း နည်းလမ်းများ

Laravel 11 တွင် `routes/console.php` တွင် သတ်မှတ်ပါသည်:

```php
use Illuminate\Support\Facades\Schedule;
use App\Jobs\GenerateDailySalesReportJob;

// ၁။ Artisan Command တစ်ခုကို နေ့စဉ် ညသန်းခေါင်တွင် run စေခြင်း
Schedule::command('backup:run')->dailyAt('00:00');

// ၂။ Queue Job တစ်ခုကို နေ့စဉ် မနက် ၈:၀၀ နာရီတွင် run စေခြင်း
Schedule::job(new GenerateDailySalesReportJob)->dailyAt('08:00');

// ၃။ Custom Closure Code ကို နာရီတိုင်း run စေခြင်း (Expiring pending orders)
Schedule::call(function () {
    \App\Models\Order::where('status', 'pending')
                    ->where('created_at', '<', now()->subHours(24))
                    ->update(['status' => 'cancelled']);
})->hourly();

// ၄။ အပတ်စဉ် တနင်္လာနေ့တိုင်း မနက် ၉:၀၀ တွင် run စေခြင်း
Schedule::command('reports:weekly')->weeklyOn(1, '09:00');

// ၅။ ၅ မိနစ်တစ်ကြိမ် run စေခြင်း
Schedule::command('telemetry:check')->everyFiveMinutes();
```

---

## ၃။ Overlap မဖြစ်စေရန် တားဆီးခြင်း

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?
အလုပ်တစ်ခု (ဥပမာ- Huge CSV Import) သည် ပြီးဆုံးရန် ၃ မိနစ် ကြာမြင့်ပြီး Schedule က ၁ မိနစ်တစ်ခါ ခေါ်နေပါက Task များ ထပ်ကာထပ်ကာ run ပြီး Server CPU 100% ပြည့်ကာ Server သေသွားနိုင်သည်။

### (ခ) အားသာချက်:
`withoutOverlapping()` ထည့်ထားပါက ယခင်အလုပ် ပြီးဆုံးမှသာ နောက်တစ်ကြိမ်ကို စတင်ခွင့်ပြုသည်။

```php
// ယခင် အလုပ် ပြီးဆုံးမှသာ နောက်အသုတ်ကို ဆက်လုပ်မည်
Schedule::command('import:huge-csv')->everyMinute()->withoutOverlapping();

// Multi-server Setup တွင် Server အားလုံးထဲမှ Server တစ်ခုတည်းကသာ run ရန်:
Schedule::command('emails:marketing')->daily()->onOneServer();

// Server ကို Maintenance Mode ချထားချိန်တွင်ပင် မဖြစ်မနေ run ရန်:
Schedule::command('cleanup:temp')->hourly()->evenInMaintenanceMode();
```

---

## ၄။ Production Server ပေါ်တွင် Cron Job ချိတ်ဆက်ခြင်း

Server တွင် `crontab -e` ကို ရိုက်ထည့်ကာ အောက်ပါ လိုင်း (၁) ကြောင်းတည်းကိုသာ ထည့်သွင်းပေးရပါသည်:

```bash
* * * * * cd /var/www/my-app && php artisan schedule:run >> /dev/null 2>&1
```
ဤ Cron Job သည် ၁ မိနစ်တစ်ကြိမ် ပုံမှန် နိုးထလာပြီး Laravel ထံသို့ မည်သည့် Task များ run ရန် အချိန်ကျရောက်ပြီလဲဟု မေးမြန်းကာ အလိုအလျောက် execute လုပ်ပေးသွားမည် ဖြစ်သည်။

---

## ၅။ Real-Time WebSockets သဘောတရား (HTTP Polling vs WebSockets)

### (က) ဒါက ဘာလဲ? (What is it?)
**WebSockets** ဆိုသည်မှာ Browser နှင့် Server အကြား အမြဲတမ်း ဖွင့်ထားသော လမ်းကြောင်း (Two-Way Persistent Connection) ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
ရိုးရိုး HTTP Request တွင် Browser က လှမ်းတောင်းမှသာ Server က ပြန်ဖြေနိုင်သည်။ Live Chat သို့မဟုတ် Order Status Update လုပ်ရာတွင် Browser က ၂ စက္ကန့်တစ်ခါ Server ကို လှမ်းမေးနေရသည် (HTTP Polling)။ ၎င်းသည် Server ပေါ်တွင် Request သန်းချီ ဖြစ်ပေါ်စေပြီး Server ကို အလွန်လေးလံစေသည်။

### (ဂ) အားသာချက် (Advantages):
* **Zero Polling Overhead**: Server ဘက်တွင် အချက်အလက်သစ် ရရှိသည်နှင့် Browser ဆီသို့ စက္ကန့်ပိုင်းအတွင်း (Instant Push) တွန်းပို့ပေးသည်။
* **Sub-Second Real-Time**: Live Chat, Ride Tracking, Stock Price, Bidding စသည်တို့တွင် ချက်ချင်း အချိန်နှင့်တပြေးညီ တုံ့ပြန်ပြသနိုင်သည်။

---

## ၆။ Laravel Reverb နှင့် Broadcast Events

Laravel 11 တွင် ကမ္ဘာ့အမြန်ဆုံး First-party WebSocket Server ဖြစ်သော **Laravel Reverb** ပါဝင်လာပါပြီ။

### (က) Reverb တပ်ဆင်ခြင်း:
```bash
php artisan install:broadcasting
```

### (ခ) Broadcast Event တစ်ခု ဖန်တီးခြင်း:
```bash
php artisan make:event NewMessageReceived
```

```php
// app/Events/NewMessageReceived.php
namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessageReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ChatMessage $message) {}

    // မည်သည့် Channel သို့ ထုတ်လွှင့်မည်ကို သတ်မှတ်ခြင်း
    public function broadcastOn(): array
    {
        return [
            new Channel('chat-room.' . $this->message->room_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
```

### (ဂ) Controller မှ Event ထုတ်လွှင့်ခြင်း:
```php
$chatMessage = ChatMessage::create([...]);

// Event Dispatch လုပ်လိုက်သည်နှင့် Reverb WebSocket မှတစ်ဆင့် ချက်ချင်း ထုတ်လွှင့်ပေးမည်
NewMessageReceived::dispatch($chatMessage);
```

### (ဃ) Frontend (JavaScript / Laravel Echo) မှ နားထောင်ခြင်း:
```javascript
import Echo from 'laravel-echo';

window.Echo.channel(`chat-room.${roomId}`)
    .listen('.message.sent', (e) => {
        console.log('စာတို အသစ် ရောက်ရှိပါသည်:', e.message);
        // UI ပေါ်တွင် စာတိုကို ချက်ချင်း ထည့်သွင်းပြသပေးခြင်း
    });
```
