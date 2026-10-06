---
title: "19. Asynchronous PHP, Fibers & Swoole Engine"
description: "Sync vs Async PHP ကွာခြားချက်၊ PHP 8.1 Fibers၊ curl_multi ပြိုင်တူ API ခေါ်ယူခြင်း၊ ReactPHP/Amp နှင့် Swoole High-Performance Coroutines"
---

# Asynchronous PHP, Fibers & Swoole Engine (High-Concurrency Architecture)

သမားရိုးကျ PHP သည် Request တစ်ခုလာပါက အစမှ အဆုံး တစ်ဆင့်ပြီးမှ တစ်ဆင့် (Synchronous / Blocking) အလုပ်လုပ်သော ပုံစံဖြစ်ပါသည်။ သို့သော် ခေတ်မီ Real-Time Applications များ၊ WebSockets၊ Microservices နှင့် ပြိုင်တူ API Calls များအတွက် **Asynchronous (Non-Blocking) Programming** သည် PHP ၏ စွမ်းဆောင်ရည်ကို Node.js သို့မဟုတ် Go ဘာသာစကားအဆင့်အထိ မြှင့်တင်ပေးနိုင်ပါသည်။

---

## ၁။ Synchronous (Blocking) vs Asynchronous (Non-Blocking)

```
[Synchronous Execution (Blocking)] - Total Time: 6 Seconds
Request API A (2s) ──► Wait... ──► Done
                        │
Request API B (2s) ─────┼────────► Wait... ──► Done
                        │                       │
Request API C (2s) ─────┼───────────────────────┼────────► Wait... ──► Done

[Asynchronous Execution (Non-Blocking / Concurrent)] - Total Time: 2 Seconds
Request API A (2s) ──► ┐
Request API B (2s) ──► ┼──► Event Loop processes all 3 concurrently ──► Done (2s)!
Request API C (2s) ──► ┘
```

### အဓိက ကွာခြားချက်:
- **Synchronous (Blocking)**: Database Query သို့မဟုတ် ပြင်ပ API ကို လှမ်းခေါ်နေစဉ် CPU သည် ဘာမှမလုပ်ဘဲ I/O အဖြေပြန်လာမချင်း စောင့်ဆိုင်းနေရသည် (Idle State)။
- **Asynchronous (Non-Blocking)**: I/O စောင့်ဆိုင်းနေစဉ် CPU သည် အခြား Task များကို လွှဲပြောင်းလုပ်ဆောင်နေပြီး၊ I/O အဖြေ ရောက်ရှိလာမှသာ နဂို Task ကို ပြန်လည် ဆက်လက်လုပ်ဆောင်သည်။

---

## ၂။ ပြိုင်တူ API Calls များ ပြုလုပ်ခြင်း (`curl_multi_*`)

ပြင်ပ Payment Gateway သို့မဟုတ် Third-Party API ၃ ခုကို တစ်ပြိုင်နက် လှမ်းခေါ်လိုသည့်အခါ `curl_multi` ကို အသုံးပြုပါက အချိန် ၃ ဆ သက်သာစေပါသည်:

```php
<?php
// Production Parallel HTTP Client
function fetchUrlsConcurrently(array $urls): array
{
    $multiHandle = curl_multi_init();
    $curlHandles = [];

    // URL တစ်ခုချင်းစီအတွက် cURL handle တည်ဆောက်ပြီး Multi-Handle ထဲ ထည့်သွင်းသည်
    foreach ($urls as $key => $url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_CONNECTTIMEOUT => 2,
        ]);
        curl_multi_add_handle($multiHandle, $ch);
        $curlHandles[$key] = $ch;
    }

    // Requests အားလုံးကို ပြိုင်တူ စတင်စေသည်
    $stillRunning = null;
    do {
        $status = curl_multi_exec($multiHandle, $stillRunning);
        if ($stillRunning) {
            // CPU 100% မဖြစ်စေရန် Activity ရှိမချင်း အနည်းငယ် စောင့်သည်
            curl_multi_select($multiHandle);
        }
    } while ($stillRunning && $status === CURLM_OK);

    // အဖြေများကို စုဆောင်းသည်
    $results = [];
    foreach ($curlHandles as $key => $ch) {
        $results[$key] = [
            'status' => curl_getinfo($ch, CURLINFO_HTTP_CODE),
            'body'   => curl_multi_getcontent($ch),
        ];
        curl_multi_remove_handle($multiHandle, $ch);
        curl_close($ch);
    }

    curl_multi_close($multiHandle);
    return $results;
}

// လက်တွေ့ စမ်းသပ်မှု: API ၃ ခုကို သီးခြားစီခေါ်ပါက ၆ စက္ကန့် ကြာမည်ဖြစ်သော်လည်း
// curl_multi ဖြင့် ခေါ်ပါက ၂ စက္ကန့်ခန့်ဖြင့် အားလုံး ပြီးဆုံးသွားပါသည်
$urls = [
    'weather'  => 'https://api.sample.com/weather',
    'currency' => 'https://api.sample.com/currency',
    'stocks'   => 'https://api.sample.com/stocks',
];
$data = fetchUrlsConcurrently($urls);
```

---

## ၃။ PHP 8.1+ Fibers (Cooperative Multitasking)

**Fibers** သည် PHP 8.1 တွင် မိတ်ဆက်ခဲ့သော Native Low-Level Concurrency အင်္ဂါရပ်ဖြစ်ပါသည်။
- Fiber တစ်ခုသည် Function တစ်ခုကို အလယ်ခေါင်တွင် **ခေတ္တရပ်တန့် (Suspend)** ထားနိုင်ပြီး၊ အခြား ကုဒ်များကို လုပ်ဆောင်ခွင့်ပေးကာ နောက်မှ ပြန်လည် **နိုးထစေနိုင်သည် (Resume)**။
- ၎င်းသည် OS Threads များနှင့် မတူဘဲ RAM အလွန်နည်းပါးစွာ အသုံးပြုသော User-space Green Threads / Coroutines ဖြစ်ပါသည်။

```php
<?php
// PHP 8.1 Native Fiber နမူနာ
$fiberA = new Fiber(function (): void {
    echo "1. Fiber A: Task Started\n";
    // I/O စောင့်ဆိုင်းနေသဖြင့် အခြားသူအား ဦးစားပေးရန် ခေတ္တရပ်တန့်သည်
    $input = Fiber::suspend('Fiber A paused at step 1');
    echo "3. Fiber A: Resumed with message -> {$input}\n";
});

$fiberB = new Fiber(function (): void {
    echo "2. Fiber B: Task Running while A is paused\n";
});

// Fiber A ကို စတင်သည်
$yieldedValue = $fiberA->start();
echo "Main Thread: [{$yieldedValue}]\n";

// Fiber A ရပ်နေစဉ် Fiber B ကို Run သည်
$fiberB->start();

// Fiber A ကို ပြန်လည် နိုးထစေသည်
$fiberA->resume('Hello from Main Thread');
```

---

## ၄။ Swoole & RoadRunner (Enterprise High-Performance Engine)

ရိုးရိုး PHP-FPM သည် Request တစ်ခုလာတိုင်း Code များကို Parse လုပ်ပြီး ပြီးလျှင် Memory ရှင်းထုတ်ပစ်သည်။
**Swoole** နှင့် **RoadRunner** တို့သည် PHP ကို Node.js / Go ကဲ့သို့ **Memory ပေါ်တွင် အမြဲ Run နေသော Persistent Application Server** အဖြစ် ပြောင်းလဲပေးပါသည်။

### Swoole ၏ စွမ်းဆောင်ရည်:
- တစ်စက္ကန့်လျှင် Request **၁၀၀,၀၀၀+ (100k req/sec)** ကို ကိုင်တွယ်နိုင်ခြင်း။
- Built-in Coroutine-based MySQL, Redis, HTTP Client များ ပါဝင်ခြင်း။
- WebSockets, TCP, UDP Servers များကို PHP ဖြင့် တိုက်ရိုက် တည်ဆောက်နိုင်ခြင်း။

```php
<?php
// Swoole High-Performance HTTP Server နမူနာ (ext-swoole)
use Swoole\Http\Server;
use Swoole\Http\Request;
use Swoole\Http\Response;

$server = new Server("0.0.0.0", 9501);

// Server စတင်ချိန်တွင် Worker Pool ကို Configure လုပ်သည်
$server->set([
    'worker_num' => swoole_cpu_num() * 2, // CPU Cores အလိုက် Worker များ ဆောက်သည်
    'enable_coroutine' => true,
]);

$server->on("start", function (Server $server) {
    echo "Swoole HTTP Server running at http://127.0.0.1:9501\n";
});

$server->on("request", function (Request $request, Response $response) {
    // Swoole Coroutine ကြောင့် Database / Redis Call များသည် Non-Blocking အလိုအလျောက် ဖြစ်သွားပါသည်
    $response->header("Content-Type", "application/json");
    $response->end(json_encode([
        "status"    => "success",
        "message"   => "Handled by Swoole Coroutine Engine!",
        "timestamp" => microtime(true)
    ]));
});

$server->start();
```

---

## ၅။ Comparison Matrix: PHP Concurrency Options

| နည်းပညာ | Memory Model | Concurrency Type | သင့်တော်သောအခြေအနေ |
| :--- | :--- | :--- | :--- |
| **PHP-FPM (Classic)** | Share Nothing (Clean slate per request) | Multi-Process Blocking | Standard Web Apps, CMS, E-Commerce (၉၀% သော လုပ်ငန်းခွင်) |
| **`curl_multi`** | Per-process | Non-blocking HTTP | ပြိုင်တူ API ခေါ်ယူခြင်း |
| **PHP 8.1 Fibers** | Single process (Green threads) | Cooperative Coroutines | Async Framework များ တည်ဆောက်ခြင်း (Amp/Revolt) |
| **Swoole / RoadRunner** | Persistent Memory (Stateful application) | Coroutines & Event Loop | Real-time Chat, High-frequency APIs, Gaming Backends |

---

## ၆။ Long-Running Async PHP တွင် သတိပြုရမည့် အချက်များ (Genba Traps)

1. **Memory Leaks**: PHP-FPM တွင် Request ပြီးတိုင်း RAM အလိုအလျောက် ရှင်းလင်းပေးသော်လည်း Swoole/Async စနစ်များတွင် Global/Static Variable များထဲသို့ Data များ ထပ်ခါထပ်ခါ ထည့်မိပါက **RAM တဖြည်းဖြည်း တက်လာပြီး Server Crash ဖြစ်တတ်ပါသည်**။
2. **State Pollution**: User A ၏ Request မှ Data သည် Static Property ထဲတွင် ကျန်ရစ်ခဲ့ပါက User B က ထို Data ကို မှားယွင်း မြင်တွေ့သွားနိုင်ပါသည် (Isolation ပျက်စီးခြင်း)။
3. **Database Connection Management**: Persistent Server များတွင် Connection ကို ဖွင့်လိုက်ပိတ်လိုက် မလုပ်ဘဲ **Connection Pool** ကို စနစ်တကျ အသုံးပြုရပါမည်။
