---
title: "16. Redis Mastery and Caching"
description: "1. [Redis ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-redis-ဆိုတာဘာလဲ-ဘာကြောင့်-သုံးရသလဲ)"
---

## ⚡ သင်ခန်းစာ (၁၆) - Redis Mastery နှင့် High-Performance Caching
### (Lesson 16: Enterprise Redis Architecture, Cache Tags, Shared Sessions, Horizon, Atomic Locks & Data Structures)

---

## 📌 မာတိကာ (Contents)
1. [Redis ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-redis-ဆိုတာဘာလဲ-ဘာကြောင့်-သုံးရသလဲ)
2. [Laravel တွင် Redis တပ်ဆင်ခြင်း (`predis` vs `phpredis`)](#၂-laravel-တွင်-redis-တပ်ဆင်ခြင်း)
3. [Redis In-Memory Caching နှင့် Cache Tags စနစ်](#၃-redis-in-memory-caching-နှင့်-cache-tags)
4. [Redis Data Structures များကို `Redis` Facade ဖြင့် တိုက်ရိုက်အသုံးချပုံ](#၄-redis-data-structures-များကို-တိုက်ရိုက်အသုံးချပုံ)
   - [Strings (Counters & Simple Values)](#၄၁-strings-counters)
   - [Hashes (Shopping Cart & User Profiles)](#၄၂-hashes-shopping-cart)
   - [Lists (Recent Activities & Logs)](#၄၃-lists-recent-activities)
   - [Sorted Sets (Real-Time Leaderboard & Trending Products)](#၄၄-sorted-sets-leaderboard)
5. [Redis ဖြင့် Multi-Server Shared Session စီမံခန့်ခွဲခြင်း](#၅-redis-ဖြင့်-multi-server-shared-session)
6. [Redis Queues နှင့် Laravel Horizon Dashboard မိတ်ဆက်](#၆-redis-queues-နှင့်-laravel-horizon)
7. [Race Condition ကို ကာကွယ်သော Redis Atomic Locks (`Cache::lock`)](#၇-race-condition-ကို-ကာကွယ်သော-redis-atomic-locks)
8. [Network Latency လျှော့ချသော Redis Pipelining](#၈-network-latency-လျှော့ချသော-redis-pipelining)
9. [Redis Memory Management & Eviction Policies (`redis.conf`)](#၉-redis-memory-management--eviction-policies)
10. [End-to-End Flash Sale Case Study (စက္ကန့်ပိုင်းအတွင်း ပစ္စည်း အရောင်းသွက်ခြင်း)](#၁၀-end-to-end-flash-sale-case-study)

---

## ၁။ Redis ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Redis (Remote Dictionary Server)** ဆိုသည်မှာ Hard Disk (SSD) ပေါ်တွင် အလုပ်မလုပ်ဘဲ RAM (Computer Memory) ပေါ်တွင် တိုက်ရိုက် အလုပ်လုပ်သော ကမ္ဘာ့အမြန်ဆုံး **In-Memory Key-Value NoSQL Data Store** ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
MySQL/PostgreSQL Database များသည် Disk I/O ကို အသုံးပြုရသောကြောင့် Query တစ်ခု run လျှင် **10ms မှ 100ms** အထိ ကြာမြင့်သည်။ အသုံးပြုသူ ထောင်သောင်းချီ ပြိုင်တူ ဝင်ရောက်လာသောအခါ Database CPU သည် 100% ပြည့်ကာ Database Connection Timeout ဖြစ်ပြီး Website တစ်ခုလုံး ပျက်ကျသွားနိုင်သည်။ Redis သည် RAM ပေါ်တွင် အလုပ်လုပ်သဖြင့် တုံ့ပြန်ချိန် **< 1ms (Microseconds)** သာ ကြာမြင့်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Ultra-Fast Speed**: စက္ကန့်ပိုင်းအတွင်း Requests သိန်းချီကို ကိုင်တွယ်နိုင်စွမ်းရှိသည်။
* **Rich Data Structures**: ရိုးရိုး String သာမက Hashes, Lists, Sets, Sorted Sets များကို Built-in ထောက်ပံ့ပေးသည်။
* **Persistence Support**: RAM ပေါ်တွင် အလုပ်လုပ်သော်လည်း Disk ပေါ်သို့ Snapshot (RDB/AOF) သိမ်းဆည်းနိုင်သဖြင့် Server မီးပျက်သွားလျှင်ပင် Data မပျောက်ပျက်ပါ။

### (ဃ) မသုံးလျှင် ကြုံတွေ့ရမည့် ပြဿနာများ:
Traffic များပြားလာပါက Database Crash ဖြစ်ခြင်း၊ Shopping Cart နှေးကွေးခြင်း၊ Session ပြုတ်ကျခြင်း။

---

## ၂။ Laravel တွင် Redis တပ်ဆင်ခြင်း

### (က) `phpredis` vs `predis`
* **`phpredis` (Production Recommended)**: C Extension ဖြစ်ပြီး Speed အမြင့်ဆုံး ရရှိသည်။
* **`predis` (Development Easy)**: Pure PHP Package ဖြစ်ပြီး Composer ဖြင့် တိုက်ရိုက်သွင်းနိုင်သည်။

```bash
composer require predis/predis
```

### `.env` ဖိုင် Configuration:
```ini
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Core Drivers များကို Redis သို့ ပြောင်းလဲခြင်း
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## ၃။ Redis In-Memory Caching နှင့် Cache Tags စနစ်

### (က) Cache::remember() ၏ အားသာချက်:
Database မှ Data ကို တစ်ကြိမ်သာ သွားဖတ်ပြီး နောက်ပိုင်းတွင် Redis RAM ထဲမှ ချက်ချင်း ပြန်ထုတ်ပေးသဖြင့် Database Load ကို ၉၅% လျှော့ချပေးသည်။

```php
use Illuminate\Support\Facades\Cache;

$categories = Cache::remember('active_categories', 86400, function () {
    return Category::where('is_active', true)->select('id', 'name', 'slug')->get();
});
```

### (ခ) Cache Tags (Selective Cache Invalidation)
#### ဘာကြောင့် သုံးရသလဲ?
`file` သို့မဟုတ် `database` cache များတွင် Cache တစ်ခုကို ဖျက်လိုပါက တစ်ခုချင်း သို့မဟုတ် အားလုံးကို အကုန် clear လုပ်ရသည်။ **Cache Tags** ဖြင့် Products နှင့် ဆိုင်သော Cache ကိုသာ သီးသန့် flush လုပ်နိုင်ပြီး Category နှင့် User Cache များကို ဆက်လက် ထိန်းသိမ်းထားနိုင်သည်။

```php
// Tag တွဲ၍ သိမ်းဆည်းခြင်း
Cache::tags(['products', 'store'])->put('featured_products', $products, 3600);

// Products နှင့် သက်ဆိုင်သော Cache အားလုံးကိုသာ သီးသန့် ရှင်းလင်းခြင်း
Cache::tags(['products'])->flush();
```

---

## ၄။ Redis Data Structures များကို တိုက်ရိုက်အသုံးချပုံ

Laravel ၏ `Illuminate\Support\Facades\Redis` Facade ဖြင့် အောက်ပါ Real-World Features များကို ရေးသားနိုင်ပါသည်:

### ၄.၁။ Strings (Live Counters)
* **ဘာကြောင့် သုံးရသလဲ**: သတင်းတစ်ခု သို့မဟုတ် Video တစ်ခုကို လူကြည့်တိုင်း Database သို့ `UPDATE posts SET views = views + 1` လုပ်ပါက Database သေသွားနိုင်သည်။
* **အားသာချက်**: `Redis::incr()` သည် RAM ပေါ်တွင် မိုက်ခရိုစက္ကန့်အတွင်း လုပ်ဆောင်သဖြင့် Server ဝန်မပိပါ။

```php
use Illuminate\Support\Facades\Redis;

// View count တိုးခြင်း
Redis::incr("post:{$postId}:views");

// တန်ဖိုး ရယူခြင်း
$views = Redis::get("post:{$postId}:views");
```

---

### ၄.၂။ Hashes (Shopping Cart Data)
* **ဘာကြောင့် သုံးရသလဲ**: User တစ်ဦး၏ ဈေးဝယ်ခြင်းတောင်း (Cart Items) ကို Database တွင် Row ပေါင်းများစွာ သိမ်းမည့်အစား Redis Hash တစ်ခုတည်းတွင် Key-Value ပုံစံဖြင့် မြန်ဆန်စွာ သိမ်းနိုင်သည်။

```php
$userId = auth()->id();

// Cart ထဲ ပစ္စည်းထည့်ခြင်း (Product ID -> Quantity)
Redis::hset("cart:{$userId}", "product:101", 2);
Redis::hset("cart:{$userId}", "product:105", 1);

// Cart အားလုံး ရယူခြင်း
$cart = Redis::hgetall("cart:{$userId}");
// ['product:101' => 2, 'product:105' => 1]
```

---

### ၄.၃။ Lists (Recent User Activities)
* **ဘာကြောင့် သုံးရသလဲ**: အသုံးပြုသူ၏ နောက်ဆုံးလုပ်ဆောင်ချက် ၁၀ ခုကို စဉ်ဆက်မပြတ် ဖမ်းယူရန်။

```php
Redis::lpush("user:{$userId}:logs", "Logged in at " . now());
Redis::ltrim("user:{$userId}:logs", 0, 9); // နောက်ဆုံး ၁၀ ခုသာ ထိန်းသိမ်းမည်
```

---

### ၄.၄။ Sorted Sets (Real-Time Leaderboard & Trending Products)
* **ဘာကြောင့် သုံးရသလဲ**: အရောင်းရဆုံး ပစ္စည်း (Trending Products) သို့မဟုတ် ဂိမ်းရမှတ် အများဆုံး လူများ (Leaderboard) ကို Database တွင် `ORDER BY score DESC` စစ်ထုတ်ပါက Table Scan ဖတ်ရသဖြင့် အလွန်နှေးသည်။
* **အားသာချက်**: Sorted Sets (ZSET) သည် ထည့်လိုက်သည့် ဒေတာတိုင်းကို Score အလိုက် အလိုအလျောက် Sort လုပ်ပြီးသား သိမ်းဆည်းပေးသည်။

```php
// ရောင်းအား တိုးခြင်း
Redis::zincrby('trending_products', 1, "product:101");
Redis::zincrby('trending_products', 5, "product:205");

// ထိပ်တန်း ၃ နေရာကို ရယူခြင်း
$top3 = Redis::zrevrange('trending_products', 0, 2, 'WITHSCORES');
```

---

## ၅။ Redis ဖြင့် Multi-Server Shared Session

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?
Web Server (၂) ခု (Server A, Server B) ကို AWS Load Balancer ဖြင့် တွဲသုံးသည့်အခါ Session Driver သည် `file` ဖြစ်နေပါက Server A တွင် Login ဝင်ထားသူသည် Server B သို့ ရောက်သွားချိန်တွင် Logout ဖြစ်သွားသည်။

### (ခ) အားသာချက် (Advantages):
Server အားလုံးသည် ဗဟို Redis Server တစ်ခုတည်းမှ Session ကို ဖတ်ယူကြသဖြင့် Server မည်မျှပင် ခွဲထားစေကာမူ Login Session လုံးဝ မပြုတ်ကျတော့ပါ။

```ini
# .env ဖိုင်တွင်
SESSION_DRIVER=redis
```

---

## ၆။ Redis Queues နှင့် Laravel Horizon Dashboard

### (က) ဘာကြောင့် သုံးရသလဲ?
Database Queue သည် အလုပ်များလာသောအခါ Database Lock ကျတတ်သည်။ Redis Queue သည် In-Memory ဖြစ်သဖြင့် စက္ကန့်ပိုင်းအတွင်း Job ပေါင်း သိန်းချီကို ပေါ့ပါးစွာ ကိုင်တွယ်နိုင်သည်။

### (ခ) Laravel Horizon အားသာချက်:
Queue Jobs များ မည်မျှ Run နေသည်၊ မည်သည့် Job တွင် Error တက်သွားသည်၊ Worker CPU အခြေအနေတို့ကို လှပသော Real-Time UI ဖြင့် စောင့်ကြည့်နိုင်ပြီး Failed Jobs များကို ခလုတ်တစ်ချက်နှိပ်ရုံဖြင့် Retry လုပ်နိုင်သည်။

```bash
composer require laravel/horizon
php artisan horizon:install
```

```ini
# /etc/supervisor/conf.d/horizon.conf
[program:horizon]
command=php /var/www/my-app/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
```

---

## ၇။ Race Condition ကို ကာကွယ်သော Redis Atomic Locks

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?
ငွေကြေး သို့မဟုတ် ပစ္စည်းလက်ကျန်ဖြတ်ရာတွင် သုံးစွဲသူက Tab (၂) ခုဖွင့်၍ ပြိုင်တူ Click ၂ ချက် နှိပ်လိုက်သောအခါ Database သို့ Requests ၂ ခု ပြိုင်တူ ဝင်သွားပြီး ငွေ ၁၀၀၀၀ တည်းဖြင့် ပစ္စည်း ၂ ခု ရသွားသည့် **Double Spending Vulnerability (Race Condition)** ဖြစ်ပွားနိုင်သည်။

### (ခ) `Cache::lock()` ၏ အားသာချက်:
Redis ၏ Atomic Lock သည် Request တစ်ခု အလုပ်လုပ်နေချိန်တွင် အခြား Requests များကို ခေတ္တတန်းစီ စောင့်ခိုင်းပြီး တစ်ခုပြီးမှ တစ်ခုကိုသာ အစဉ်လိုက် ဝင်ခွင့်ပြုသည်။

```php
use Illuminate\Support\Facades\Cache;
use Exception;

public function processWithdrawal($userId, $amount)
{
    // သီးသန့် ၅ စက္ကန့် သက်တမ်းရှိ Atomic Lock ရယူခြင်း
    $lock = Cache::lock("user-wallet-lock:{$userId}", 5);

    try {
        $lock->block(3); // ၃ စက္ကန့်အထိ စောင့်ဆိုင်းခွင့်ပြုသည်

        $user = User::findOrFail($userId);
        if ($user->balance < $amount) {
            throw new Exception("လက်ကျန်ငွေ မလုံလောက်ပါ။");
        }

        $user->decrement('balance', $amount);

    } finally {
        $lock?->release(); // အလုပ်ပြီးဆုံးပါက Lock ဖွင့်ပေးမည်
    }
}
```

---

## ၈။ Network Latency လျှော့ချသော Redis Pipelining

### (က) ဘာကြောင့် သုံးရသလဲ?
Redis Commands ၁၀၀၀ ကို တစ်ခုချင်း run လျှင် Network Round-Trip အသွားအပြန် ၁၀၀၀ ကြိမ် လုပ်ရသဖြင့် ကြာမြင့်သည်။

### (ခ) အားသာချက်:
Pipeline ဖြင့် Network Round-Trip **၁ ကြိမ်တည်းဖြင့်** Command ၁၀၀၀ လုံးကို မိုက်ခရိုစက္ကန့်ပိုင်းအတွင်း execute လုပ်နိုင်သည်။

```php
Redis::pipeline(function ($pipe) {
    for ($i = 0; $i < 1000; $i++) {
        $pipe->set("user:token:{$i}", "valid");
    }
});
```

---

## ၉။ Redis Memory Management & Eviction Policies

RAM ပြည့်သွားပါက Server Error မတက်စေရန် `/etc/redis/redis.conf` တွင် သတ်မှတ်ပါ:
```conf
maxmemory 2gb
maxmemory-policy allkeys-lru # မသုံးတော့သော Cache အဟောင်းများကို auto အရင်ဖျက်ပစ်မည်
```

---

## ၁၀။ End-to-End Flash Sale Case Study

ပစ္စည်း ၁၀၀ သာရှိသော Flash Sale ကို အသုံးပြုသူ ၁ သောင်းက ပြိုင်တူ ဝယ်ယူသည့်အခါ Database မကျစေရန် Redis ဖြင့် ထိန်းချုပ်ပုံ:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use App\Jobs\CreateOrderDatabaseJob;

class FlashSaleController extends Controller
{
    public function buyItem(Request $request)
    {
        $productId = 101;
        $userId = auth()->id();

        // ၁။ User တစ်ယောက် တစ်ကြိမ်သာ ဝယ်ခွင့်ပေးရန် Redis Set ဖြင့် စစ်ဆေးခြင်း
        if (Redis::sismember("flashsale:{$productId}:buyers", $userId)) {
            return response()->json(['message' => 'သင်သည် ပစ္စည်း ဝယ်ယူပြီး ဖြစ်ပါသည်။'], 400);
        }

        // ၂။ Redis Atomic Decrement ဖြင့် Stock အရေအတွက် လျှော့ချခြင်း (< 1ms)
        $remainingStock = Redis::decr("flashsale:{$productId}:stock");

        if ($remainingStock < 0) {
            Redis::incr("flashsale:{$productId}:stock"); // ပြန်ညှိပေးခြင်း
            return response()->json(['message' => 'ပစ္စည်း အားလုံး ကုန်သွားပါပြီ (Sold Out)'], 400);
        }

        // ၃။ ဝယ်ယူသူ စာရင်းထဲ User ID ထည့်သွင်းခြင်း
        Redis::sadd("flashsale:{$productId}:buyers", $userId);

        // ၄။ Database သိမ်းဆည်းမှုကို Background Worker ထံ လွှဲပြောင်းပေးခြင်း
        CreateOrderDatabaseJob::dispatch($userId, $productId);

        return response()->json([
            'status'  => 'success',
            'message' => 'ဝယ်ယူခြင်း အောင်မြင်ပါသည်။ Order ကို စီမံနေပါပြီ။',
        ], 200);
    }
}
```
