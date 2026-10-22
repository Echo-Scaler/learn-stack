---
title: "27. Debugging, Error Troubleshooting & Observability"
description: "Laravel တွင် Error ဖြစ်ပါက မည်သို့ စစ်ဆေးရမည်နည်း? Debugging Tools, Log စစ်ဆေးနည်း, SQL Query Bottleneck ရှာဖွေခြင်း, Telescope & Pulse, Production 500 Error Root Cause Analysis"
---

> Laravel 11 / 12 အခြေခံ။
> "Developer ကောင်းတစ်ယောက်နှင့် ပုံမှန် Developer ကို ခွဲခြားသည့် အဓိက အချက်မှာ **ပြဿနာဖြစ်လာချိန်တွင် မည်မျှ မြန်ဆန်ထိရောက်စွာ ရှာဖွေဖြေရှင်းနိုင်သနည်း (Debugging & Troubleshooting Skill)** ဖြစ်သည်။" ဤသင်ခန်းစာတွင် Error ဖြစ်လာပါက အဆင့်ဆင့် စစ်ဆေးရမည့် Checklists များနှင့် Production Observability စနစ်များကို လေ့လာပါမည်။

---

## 🧭 မာတိကာ (Table of Contents)
1. [Error ဖြစ်လာလျှင် အရင်ဆုံး ဘာကို စစ်ဆေးရမလဲ? (Emergency Triage Flow)](#၁-error-ဖြစ်လာလျှင်-အရင်ဆုံး-ဘာကို-စစ်ဆေးရမလဲ-emergency-triage-flow)
2. [Laravel Logging Deep Dive (Channels, Severity, Contextual Logging)](#၂-laravel-logging-deep-dive-channels-severity-contextual-logging)
3. [Stack Trace ကို အဆင့်ဆင့် ဖတ်ရှုနည်း (Reading Stack Trace Like a Pro)](#၃-stack-trace-ကို-အဆင့်ဆင့်-ဖတ်ရှုနည်း-reading-stack-trace-like-a-pro)
4. [SQL Query Debugging (`DB::listen`, Slow Query Log, EXPLAIN)](#၄-sql-query-debugging-dblisten-slow-query-log-explain)
5. [Local Debugging Tools (Ray, Dump & Die, Laravel Telescope)](#၅-local-debugging-tools-ray-dump--die-laravel-telescope)
6. [Production Observability (Laravel Pulse, Sentry & Bugsnag)](#၆-production-observability-laravel-pulse-sentry--bugsnag)
7. [Common Laravel Errors & Exact Fixes (အဖြစ်အများဆုံး Error ၁၀ မျိုး)](#၇-common-laravel-errors--exact-fixes-အဖြစ်အများဆုံး-error-၁၀-မျိုး)
8. [Testing Exceptions & Error Handling (Feature Tests)](#၈-testing-exceptions--error-handling-feature-tests)
9. [လေ့ကျင့်ခန်းများ (Hands-on Exercises)](#၉-လေ့ကျင့်ခန်းများ-hands-on-exercises)

---

## ၁။ Error ဖြစ်လာလျှင် အရင်ဆုံး ဘာကို စစ်ဆေးရမလဲ? (Emergency Triage Flow)

Website သို့မဟုတ် API တစ်ခုတွင် **500 Internal Server Error** ပေါ်လာပါက ခေါင်းမရှုပ်ဘဲ အောက်ပါ အဆင့် ၅ ဆင့်အတိုင်း တိကျစွာ စစ်ဆေးပါ:

```
                          🚨 500 Server Error ဖြစ်ပေါ်ခြင်း
                                        │
                                        ▼
                  [အဆင့် ၁] storage/logs/laravel.log ကို ချက်ချင်းဖွင့်ဖတ်ပါ
                                        │
                                        ▼
                  [အဆင့် ၂] Database Connection & .env Key များ မှန်/မမှန် စစ်ပါ
                                        │
                                        ▼
                  [အဆင့် ၃] File / Folder Permissions စစ်ပါ (storage & bootstrap/cache)
                                        │
                                        ▼
                  [အဆင့် ၄] Web Server Logs စစ်ပါ (Nginx / PHP-FPM error.log)
                                        │
                                        ▼
                  [အဆင့် ၅] Server Resource စစ်ပါ (Disk 100% ပြည့်နေသလား? RAM ကုန်နေသလား?)
```

### အသုံးအများဆုံး Terminal Commands များ:
```bash
# ၁။ နောက်ဆုံးတက်သော Laravel Log အကြောင်း ၁၀၀ ကို Live စောင့်ကြည့်ခြင်း
tail -n 100 -f storage/logs/laravel.log

# ၂။ Error အဆင့်များကိုသာ စစ်ထုတ်ရှာဖွေခြင်း
grep -i "error" storage/logs/laravel.log | tail -n 20

# ၃။ Nginx Error Log ကြည့်ရှုခြင်း
sudo tail -n 50 -f /var/log/nginx/error.log

# ၄။ Disk နေရာလွတ် စစ်ဆေးခြင်း
df -h
```

---

## ၂။ Laravel Logging Deep Dive (Channels, Severity, Contextual Logging)

Log ရေးသားရာတွင် `Log::info('done')` ကဲ့သို့ စာသားရိုးရိုး ရေးသားခြင်းသည် အလုပ်ခွင်တွင် မလုံလောက်ပါ။ ပြဿနာရှာရ လွယ်ကူစေရန် **Contextual Data (JSON)** ဖြင့် သိမ်းဆည်းရမည်။

### (က) Contextual Logging (အကြံပြုချက်)
```php
use Illuminate\Support\Facades\Log;

try {
    $payment = $gateway->charge($amount);
} catch (\Throwable $e) {
    // ❌ မကောင်းသော နည်းလမ်း: ဘယ် User လဲ၊ ဘယ်လောက်လဲ မသိနိုင်
    // Log::error('Payment failed: ' . $e->getMessage());

    // ✅ အကောင်းဆုံး နည်းလမ်း: Context အပြည့်အစုံ ပါဝင်သည်
    Log::error('Payment failed during checkout', [
        'user_id'    => $user->id,
        'order_id'   => $order->id,
        'amount'     => $amount,
        'error_code' => $e->getCode(),
        'exception'  => $e->getMessage(),
        'ip_address' => request()->ip(),
    ]);
}
```

### (ခ) Logging Channels (`config/logging.php`)
* `single`: `laravel.log` ဖိုင်တစ်ခုတည်းထဲ အကုန်သိမ်းသည် (ဖိုင်အရွယ်အစား အလွန်ကြီးသွားနိုင်သည်)။
* `daily`: နေ့ရက်အလိုက် `laravel-2026-10-23.log` ဟု ခွဲသိမ်းပြီး ရက်ပေါင်း သတ်မှတ်ချက်ကျော်ပါက အလိုအလျောက် ဖျက်ပေးသည် (**Production စံနှုန်း**):
```php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'debug'),
    'days' => 14, // ၁၄ ရက်စာသာ ထားမည်
],
```

---

## ၃။ Stack Trace ကို အဆင့်ဆင့် ဖတ်ရှုနည်း (Reading Stack Trace Like a Pro)

Stack Trace ဆိုသည်မှာ Error စတင်ဖြစ်ပေါ်သည့် နေရာမှ Application Core အထိ ခေါ်ယူခဲ့သော Function အဆင့်ဆင့်ကို ဖော်ပြထားခြင်း ဖြစ်သည်။

```
[2026-10-23 00:15:30] production.ERROR: Call to a member function get() on null 
{"exception":"[object] (Error(code: 0): Call to a member function get() on null at 
/var/www/app/app/Services/OrderService.php:45)
[stacktrace]
#0 /var/www/app/app/Http/Controllers/OrderController.php(28): App\\Services\\OrderService->createOrder()
#1 /var/www/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php(54): App\\Http\\Controllers\\...
```

### ဖတ်ရှုနည်း လျှို့ဝှက်ချက်:
1. **ပထမဆုံး စာကြောင်းကို ကြည့်ပါ**: `Call to a member function get() on null` -> Variable တစ်ခုသည် Object မဟုတ်ဘဲ `null` ဖြစ်နေသည်ကို method သွားခေါ်မိသည်။
2. **`vendor/` မဟုတ်သော မိမိ Code ဖိုင်ကို အပေါ်ဆုံးမှ ရှာပါ**:
   * `#1 /vendor/...` သည် Framework code ဖြစ်၍ ကျော်ပါ။
   * `OrderService.php:45` ကို တွေ့ရပါမည်! **လိုင်းနံပါတ် ၄၅** သို့ တိုက်ရိုက်သွား၍ Variable မည်သည့်နေရာတွင် `null` ဖြစ်နေသည်ကို စစ်ဆေးရုံပင် ဖြစ်သည်။

---

## ၄။ SQL Query Debugging (`DB::listen`, Slow Query Log, EXPLAIN)

Application တစ်ခု နှေးကွေးရခြင်း၏ ၉၀% သည် **Database Query ပြဿနာ (Slow Queries & N+1 Problem)** ကြောင့် ဖြစ်သည်။

### (က) `DB::listen` ဖြင့် Query ကြာချိန်များကို စစ်ဆေးခြင်း
`app/Providers/AppServiceProvider.php`:
```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

public function boot(): void
{
    // စက္ကန့် ၅၀၀ ms ထက် ပိုကြာသော Query များကို Log ထဲ မှတ်တမ်းတင်ခြင်း
    DB::whenQueryingForLongerThan(500, function ($connection) {
        Log::warning("Database queries took longer than 500ms on [{$connection->getName()}]");
    });

    // Query တိုင်း၏ Execution Time ကို စစ်ဆေးခြင်း (Local Dev တွင်သာ)
    if (app()->isLocal()) {
        DB::listen(function ($query) {
            if ($query->time > 100) { // 100ms ကျော်ပါက သတိပေးမည်
                Log::warning("Slow Query [{$query->time}ms]: {$query->sql}", [
                    'bindings' => $query->bindings,
                ]);
            }
        });
    }
}
```

### (ခ) `toSql()` နှင့် `explain()` ဖြင့် Query ကို စစ်ဆေးခြင်း
```php
$query = Order::where('status', 'paid')->where('user_id', 5);

// ၁။ ထွက်လာမည့် Raw SQL ကို ကြည့်ခြင်း
dd($query->toSql(), $query->getBindings());

// ၂။ MySQL Index သုံး/မသုံး EXPLAIN စစ်ဆေးခြင်း
dd($query->explain());
```

---

## ၅။ Local Debugging Tools (Ray, Dump & Die, Laravel Telescope)

### (က) Dump & Die Helpers
```php
dd($variable);  // Dump and Die (ချက်ချင်း ရပ်တန့်ပြသည်)
dump($variable); // Dump but continue (မရပ်ဘဲ ဆက်သွားသည်)
logger($variable); // storage/logs/laravel.log ထဲ အမြန်ရေးသည်
```

### (ခ) Laravel Telescope (အပြည့်စုံဆုံး Local Debug Assistant)
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```
Browser တွင် `http://localhost:8000/telescope` သို့ သွားရောက်ပြီး:
* ဝင်လာသော HTTP Requests များ
* Run သွားသော SQL Queries များနှင့် Execution Times
* ပစ်လိုက်သော Events, Queued Jobs, Mail Preview များကို Visual UI ဖြင့် ချက်ချင်း စစ်ဆေးနိုင်သည်။

---

## ၆။ Production Observability (Laravel Pulse, Sentry & Bugsnag)

### (က) Laravel Pulse (Real-Time Application Performance Monitoring)
Laravel ၏ တရားဝင် Performance Monitoring Tool ဖြစ်သည်:
```bash
composer require laravel/pulse
php artisan pulse:install
php artisan migrate
```
Dashboard (`/pulse`) တွင်:
* မည်သည့် Endpoint သည် အနှေးကွေးဆုံး ဖြစ်နေသနည်း?
* မည်သည့် SQL Query သည် Server ကို Load အများဆုံး ဖြစ်စေသနည်း?
* မည်သည့် User သည် Request အများဆုံး ခေါ်ယူနေသနည်း? (Abuse Detection)

### (ခ) Sentry Error Tracking (Production Exception Monitor)
Production တွင် User ထံ၌ Error ပေါ်ပါက Developer အဖွဲ့၏ Slack ထံသို့ ချက်ချင်း အကြောင်းကြားပေးနိုင်သည်:
```bash
composer require sentry/sentry-laravel
```

---

## ၇။ Common Laravel Errors & Exact Fixes (အဖြစ်အများဆုံး Error ၁၀ မျိုး)

| Error Message | အကြောင်းရင်း | ဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **`Target class [...] does not exist`** | Controller Path သို့မဟုတ် Namespace မှားယွင်းခြင်း | `use App\Http\Controllers\XController;` ကို မှန်မမှန် စစ်ပါ |
| **`No application encryption key has been specified`** | `.env` ထဲတွင် `APP_KEY` မရှိခြင်း | `php artisan key:generate` ကို run ပါ |
| **`The stream or file ".../laravel.log" could not be opened: Permission denied`** | `storage/` folder permission မှားယွင်းခြင်း | `sudo chown -R www-data:www-data storage bootstrap/cache` |
| **`Call to a member function ... on null`** | Database မှ Data ရှာမတွေ့ဘဲ null ဖြစ်နေခြင်း | `findOrFail()` သို့မဟုတ် Null-safe operator (`?->`) သုံးပါ |
| **`CSRF token mismatch (419)`** | Form ထဲတွင် `@csrf` မပါခြင်း သို့မဟုတ် Session Expire ဖြစ်ခြင်း | `<form>` ထဲ `@csrf` ထည့်ပါ၊ Domain settings စစ်ပါ |
| **`General error: 1364 Field '...' doesn't have a default value`** | Column သည် Not Null ဖြစ်ပြီး Model `$fillable` ထဲ မပါခြင်း | Model `$fillable` ထဲ ထည့်ပါ သို့မဟုတ် Migration တွင် `nullable()` ပေးပါ |
| **`SQLSTATE[HY000] [2002] Connection refused`** | Database Service မ run ထားခြင်း သို့မဟုတ် `.env` Host/Port မှားခြင်း | DB status စစ်ပါ၊ Docker ဆိုပါက `DB_HOST=mysql` (service name) ဖြစ်ရမည် |
| **`Attempt to read property '...' on array`** | JSON သို့ Array ဖြစ်နေသော data ကို Object ကဲ့သို့ `->` ဖြင့် ခေါ်မိခြင်း | `$data['key']` ဟု ခေါ်ပါ သို့မဟုတ် Object အဖြစ် Cast လုပ်ပါ |
| **`Too many connections`** | DB Connection Pool ပြည့်သွားခြင်း | Connection များကို မပိတ်ဘဲ ထားမိခြင်း၊ Persistent connection များပြားခြင်း |
| **`Maximum execution time of 30 seconds exceeded`** | Query နှေးခြင်း သို့မဟုတ် Infinite Loop ဖြစ်နေခြင်း | Background Queue သို့ ပြောင်းပါ၊ Memory/Execution limit ချိန်ပါ |

---

## ၈။ Testing Exceptions & Error Handling (Feature Tests)

Error ဖြစ်ချိန်တွင် မှန်ကန်သော Response ထွက်မထွက် စမ်းသပ်ပုံ:

```php
namespace Tests\Feature;

use Tests\TestCase;

class ErrorHandlingTest extends TestCase
{
    public function test_non_existent_route_returns_custom_404_json(): void
    {
        $response = $this->getJson('/api/v1/unknown-endpoint');

        $response->assertStatus(404)
            ->assertJson([
                'code' => 'NOT_FOUND',
            ]);
    }
}
```

---

## ၉။ လေ့ကျင့်ခန်းများ (Hands-on Exercises)

### 🏋️ လေ့ကျင့်ခန်း (၁) - Simulated 500 Error & Triage
Controller တစ်ခုတွင် `throw new \Exception("Simulated Disaster");` ပြုလုပ်ပြီး Terminal မှ `tail -f storage/logs/laravel.log` ဖြင့် Contextual Data များ မှန်ကန်စွာ ပါမပါ စစ်ဆေးပါ။

### 🏋️ လေ့ကျင့်ခန်း (၂) - Slow Query Alert
`sleep(1)` ပါသော Heavy Query တစ်ခုကို ရေးသားပြီး `DB::whenQueryingForLongerThan(500)` က Warning Log ထုတ်ပေးခြင်း ရှိမရှိ စမ်းသပ်ပါ။

### 🏋️ လေ့ကျင့်ခန်း (၃) - Install Laravel Telescope
Local Project တွင် Laravel Telescope ကို ထည့်သွင်းပြီး Query တိုင်း၏ Execution Time ကို စစ်ဆေးကြည့်ပါ။
