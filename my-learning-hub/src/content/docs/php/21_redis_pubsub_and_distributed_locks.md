---
title: Redis, Pub/Sub & Distributed Locks in PHP
description: High-performance Caching, Session Clustering, Real-time Pub/Sub Messaging, နှင့် Atomic Distributed Locking (Redlock) ကို phpredis ဖြင့် Production အဆင့် အကောင်အထည်ဖော်ခြင်း
---

Production Web Application များ အဆမတန် ကြီးထွားလာသည့်အခါ MySQL ကဲ့သို့ Disk-based Relational Database တစ်ခုတည်းဖြင့် Scale လုပ်ရန် မဖြစ်နိုင်တော့ပါ။ မီလီစက္ကန့်ပိုင်းအတွင်း တုံ့ပြန်နိုင်သော In-Memory Data Store ဖြစ်သည့် **Redis** ကို PHP ဖြင့် အသုံးပြုပုံ၊ **Pub/Sub Messaging** နှင့် Race Condition ကာကွယ်ပေးနိုင်သည့် **Distributed Locking (Redlock)** စနစ်များကို လက်တွေ့ကျကျ လေ့လာပါမည်။

---

## ၁။ Redis ဆိုတာ ဘာလဲ? ဘာကြောင့် သုံးသင့်တာလဲ? (What & Why)

### Redis ၏ အားသာချက်များ
1. **In-Memory Speed**: ဒေတာများကို RAM ပေါ်တွင် တိုက်ရိုက်သိမ်းဆည်းသောကြောင့် Read/Write latency သည် Sub-millisecond (0.1ms ~ 1ms) သာ ကြာမြင့်သည်။
2. **Rich Data Structures**: ရိုးရိုး Key-Value (String) အပြင် Hash, List, Set, Sorted Set (ZSET), Bitmaps, HyperLogLog စသည့် Data Structures များကို native ထောက်ပံ့ပေးသည်။
3. **Single-Threaded Event Loop**: Query များကို Sequential queue အနေဖြင့် Atomic ဖြစ်စွာ execute လုပ်ပေးသောကြောင့် Data Corruption မဖြစ်စေပါ။
4. **Persistence Options**: RAM ပေါ်တွင်သာမက RDB (Snapshots) နှင့် AOF (Append Only File) ဖြင့် Disk ပေါ်သို့ Backup သိမ်းဆည်းပေးနိုင်သည်။

### `phpredis` (C-Extension) vs `Predis` (Pure PHP)

| အချက်အလက် | `phpredis` (Extension) | `Predis` (PHP Library) |
| :--- | :--- | :--- |
| **Language** | C (Compiled PHP Extension) | Pure PHP |
| **Throughput & Speed** | အလွန်မြန်သည် (High throughput, Low CPU) | သာမန် (PHP runtime overhead ရှိသည်) |
| **Installation** | `pecl install redis` (C-compiler လိုအပ်) | `composer require predis/predis` |
| **Production Recommendation** | **Highly Recommended (Standard)** | Extension သွင်းခွင့်မရှိသော Server များအတွက်သာ |

---

## ၂။ phpredis Connection & Core Data Structures

### ၂.၁ Persistent Connection တည်ဆောက်ခြင်း

Production တွင် Request တိုင်းအတွက် Redis TCP connection အသစ်မဖွင့်ဘဲ `pconnect` (Persistent Connection) ကို အသုံးပြုသင့်ပါသည်:

```php
<?php
// src/Infrastructure/RedisClient.php
declare(strict_types=1);

namespace App\Infrastructure;

use Redis;
use RedisException;

class RedisClient
{
    private static ?Redis $instance = null;

    public static function getConnection(): Redis
    {
        if (self::$instance === null) {
            $redis = new Redis();
            
            // pconnect(host, port, timeout, persistent_id, retry_interval, read_timeout)
            $connected = $redis->pconnect(
                host: '127.0.0.1',
                port: 6379,
                timeout: 2.5,
                persistent_id: 'app_redis_pool',
                retry_interval: 100,
                read_timeout: 2.5
            );

            if (!$connected) {
                throw new RedisException("Failed to connect to Redis server.");
            }

            // Authentication & Database Selection
            // $redis->auth('SuperSecretRedisPassword');
            $redis->select(0);

            // Serialization နှင့် Compression Setting များ
            $redis->setOption(Redis::OPT_SERIALIZER, Redis::SERIALIZER_JSON);
            $redis->setOption(Redis::OPT_PREFIX, 'prod:');

            self::$instance = $redis;
        }

        return self::$instance;
    }
}
```

### ၂.၂ Core Data Structures များနှင့် လက်တွေ့ အသုံးချမှုများ

```php
<?php
declare(strict_types=1);

use App\Infrastructure\RedisClient;

$redis = RedisClient::getConnection();

// -------------------------------------------------------------
// 1. STRINGS (Caching with TTL & Atomic Counter)
// -------------------------------------------------------------
// OTP Code တစ်ခုကို ၅ မိနစ်သက်တမ်းဖြင့် သိမ်းဆည်းခြင်း
$redis->setEx('otp:user_9921', 300, '482910');

// API Rate Limiting အတွက် Atomic Increment (INCR)
$currentHits = $redis->incr('ratelimit:ip_192_168_1_5');
if ($currentHits === 1) {
    $redis->expire('ratelimit:ip_192_168_1_5', 60); // 1 minute window
}

// -------------------------------------------------------------
// 2. HASHES (Object / User Session Data)
// -------------------------------------------------------------
// User Profile Object ကို Field အလိုက် အပိုင်းလိုက် သိမ်းခြင်း/ဖတ်ခြင်း
$userKey = 'user:profile:1001';
$redis->hMSet($userKey, [
    'username' => 'zawzaw',
    'tier' => 'gold',
    'last_login' => (string) time(),
]);
$tier = $redis->hGet($userKey, 'tier'); // "gold"

// -------------------------------------------------------------
// 3. LISTS (Lightweight Job Queue / Activity Feed)
// -------------------------------------------------------------
// Push into Queue (LPUSH)
$redis->lPush('email_queue', json_encode(['to' => 'zaw@example.com', 'subject' => 'Invoice #1']));

// Pop from Queue (RPOP or Blocking BRPOP)
$job = $redis->rPop('email_queue');

// -------------------------------------------------------------
// 4. SETS (Unique Membership & Tags)
// -------------------------------------------------------------
// Tag များ သိမ်းခြင်း (Duplicate မဖြစ်စေပါ)
$redis->sAdd('tags:article_45', 'php', 'backend', 'redis');
$isMember = $redis->sIsMember('tags:article_45', 'php'); // true

// -------------------------------------------------------------
// 5. SORTED SETS - ZSET (Leaderboards & Time-series Scheduling)
// -------------------------------------------------------------
// E-commerce Trending Products Ranking (Score = Number of Views)
$redis->zIncrBy('leaderboard:products', 1.0, 'product_laptop_dell');
$redis->zIncrBy('leaderboard:products', 5.0, 'product_macbook_pro');

// Top 3 Products ကို အများဆုံးမှ အနည်းဆုံး ရယူခြင်း
$topProducts = $redis->zRevRange('leaderboard:products', 0, 2, true);
// Output: ['product_macbook_pro' => 5.0, 'product_laptop_dell' => 1.0]
```

---

## ၃။ Redis အခြေပြု Multi-Server Centralized Session Store

Production တွင် Load Balancer နောက်ကွယ်၌ Web Server များ အများအပြား ရှိနေပါက User Session များကို Local Disk တွင် မသိမ်းနိုင်ပါ။ Redis ကို Centralized Session Handler အဖြစ် ပြောင်းလဲအသုံးပြုပုံ:

### `php.ini` တွင် ချိန်ညှိခြင်း
```ini
session.save_handler = redis
session.save_path = "tcp://127.0.0.1:6379?auth=SecretPassword&database=2&prefix=PHPREDIS_SESSION:"
session.gc_maxlifetime = 7200
```

### Code ထဲမှ Custom Session Handler ရေးသားခြင်း
```php
<?php
// src/Session/RedisSessionHandler.php
declare(strict_types=1);

namespace App\Session;

use Redis;
use SessionHandlerInterface;

class RedisSessionHandler implements SessionHandlerInterface
{
    public function __construct(
        private Redis $redis,
        private int $ttl = 7200,
        private string $prefix = 'sess:'
    ) {}

    public function open(string $path, string $name): bool
    {
        return true;
    }

    public function close(): bool
    {
        return true;
    }

    public function read(string $id): string|false
    {
        $data = $this->redis->get($this->prefix . $id);
        return $data !== false ? (string) $data : '';
    }

    public function write(string $id, string $data): bool
    {
        return (bool) $this->redis->setEx($this->prefix . $id, $this->ttl, $data);
    }

    public function destroy(string $id): bool
    {
        $this->redis->del($this->prefix . $id);
        return true;
    }

    public function gc(int $max_lifetime): int|false
    {
        // Redis TTL ဖြင့် အလိုအလျောက် သက်တမ်းကုန်ပြီး expire ဖြစ်သဖြင့် gc မလိုပါ
        return 0;
    }
}

// အသုံးပြုပုံ:
$handler = new RedisSessionHandler(\App\Infrastructure\RedisClient::getConnection());
session_set_save_handler($handler, true);
session_start();
```

---

## ၄။ Real-time Pub/Sub Messaging Pattern

Redis Pub/Sub (Publish/Subscribe) သည် Server များအချင်းချင်း သို့မဟုတ် Background Worker များနှင့် Real-time Event များ မျှဝေရန် အလွန်ထိရောက်သည်။

```
+----------------+                +------------------+
| Publisher      | -- PUBLISH --> |  Redis Server    |
| (Web Request)  |                |  Channel: orders |
+----------------+                +------------------+
                                           |
                                  +--------+--------+
                                  |                 |
                                  v                 v
                         +----------------+ +----------------+
                         | Subscriber A   | | Subscriber B   |
                         | (Notify Admin) | | (Inventory Wk) |
                         +----------------+ +----------------+
```

### ၄.၁ Event Publisher (Web Request Side)

```php
<?php
// src/Events/OrderPublisher.php
declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Infrastructure\RedisClient;

$redis = RedisClient::getConnection();

$orderPayload = json_encode([
    'order_id' => 'ORD-98213',
    'customer_id' => 451,
    'total_amount' => 450000,
    'timestamp' => time()
]);

// 'channel_orders' သို့ Broadcast လုပ်ခြင်း
$subscribersCount = $redis->publish('channel_orders', $orderPayload);
echo "Event published to {$subscribersCount} subscribers.\n";
```

### ၄.၂ Continuous Event Subscriber (CLI Daemon)

```php
<?php
// bin/order_listener.php
declare(strict_types=1);

use Redis;

$redis = new Redis();
$redis->connect('127.0.0.1', 6379, 0); // Timeout 0 = Block indefinitely

echo "Listening for events on 'channel_orders'...\n";

// Blocking call: မက်ဆေ့ခ်ျရောက်လာသည်အထိ စောင့်ဆိုင်းနေမည်
$redis->subscribe(['channel_orders'], function (Redis $redis, string $channel, string $message) {
    echo "\n[Channel: {$channel}] Received event: {$message}\n";
    $payload = json_decode($message, true);

    // Business Logic: Send Telegram/Slack alert, sync inventory, etc.
    echo "Processing Order: " . ($payload['order_id'] ?? 'unknown') . "\n";
});
```

---

## ၅။ Distributed Locks (Redlock Pattern) ဖြင့် Race Condition ရှင်းလင်းခြင်း

### ပြဿနာ (The Double-Spending / Flash-Sale Race Condition)
Flash-Sale တွင် ပစ္စည်းလက်ကျန် (Stock) ၁ ခုသာ ကျန်ရှိချိန်တွင် အသုံးပြုသူ ၂ ယောက် (User A & User B) က တစ်ပြိုင်နက်တည်း Buy ခလုတ်ကို နှိပ်လိုက်ပါက:
1. Process A က Database ကို စစ်ဆေးသည်: `stock = 1` (OK)
2. Process B က Database ကို စစ်ဆေးသည်: `stock = 1` (OK)
3. Process A က Order ဖြတ်သည်: `stock = 0`
4. Process B ကလည်း Order ဖြတ်သည်: `stock = -1` (Oversold Disaster!)

### ဖြေရှင်းချက် (Atomic Distributed Lock with Redis)
Redis ၏ `SET key token NX PX expiry` command သည်:
- `NX`: Key မရှိမှသာ Set လုပ်မည် (Key ရှိနေပါက False ပြန်ပြီး Lock မရပါ)။
- `PX`: Lock သက်တမ်းကုန်ဆုံးမည့် Milliseconds (Crash ဖြစ်သွားပါက Deadlock မဖြစ်စေရန် Auto-release)။
- `token`: Unique UUID တစ်ခု ထည့်ထားပြီး Lock ကို လွှတ်ပေးသည့်အခါ မိမိ၏ Lock ဟုတ်မဟုတ် Lua Script ဖြင့် Atomic စစ်ဆေးပြီးမှ ဖျက်ရမည် (အခြား process ၏ Lock ကို မမှားယွင်းဖျက်မိစေရန်)။

```php
<?php
// src/Lock/RedisLock.php
declare(strict_types=1);

namespace App\Lock;

use Redis;

class RedisLock
{
    private string $token;

    public function __construct(
        private Redis $redis,
        private string $resourceName,
        private int $ttlMs = 5000 // 5 seconds
    ) {
        $this->token = bin2hex(random_bytes(16));
    }

    /**
     * Lock ရရှိရန် ကြိုးစားခြင်း
     */
    public function acquire(): bool
    {
        $key = 'lock:' . $this->resourceName;
        
        // SET key token NX PX ttl
        $result = $this->redis->set(
            $key,
            $this->token,
            ['nx', 'px' => $this->ttlMs]
        );

        return $result === true;
    }

    /**
     * Lock ရရှိသည်အထိ စောင့်ဆိုင်းခြင်း (Spin-lock with backoff)
     */
    public function acquireWithRetry(int $timeoutMs = 3000, int $sleepMs = 50): bool
    {
        $start = microtime(true) * 1000;

        while ((microtime(true) * 1000) - $start < $timeoutMs) {
            if ($this->acquire()) {
                return true;
            }
            usleep($sleepMs * 1000); // Sleep in microseconds
        }

        return false;
    }

    /**
     * Lock ပြန်လည်လွှတ်ပေးခြင်း (Lua Script ဖြင့် Atomic Release)
     */
    public function release(): bool
    {
        $key = 'lock:' . $this->resourceName;

        // Lua Script: Token တိုက်ဆိုင်မှသာ key ကို ဖျက်မည်
        $luaScript = '
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        ';

        $result = $this->redis->eval($luaScript, [$key, $this->token], 1);
        return $result === 1;
    }
}
```

### လက်တွေ့ Flash Sale ငွေပေးချေမှုတွင် အသုံးပြုပုံ

```php
<?php
// payment_checkout.php
declare(strict_types=1);

use App\Infrastructure\RedisClient;
use App\Lock\RedisLock;

$redis = RedisClient::getConnection();
$productId = 405;

// Product ID အလိုက် Lock သတ်မှတ်ခြင်း
$lock = new RedisLock($redis, "checkout_product_{$productId}", ttlMs: 3000);

if (!$lock->acquireWithRetry(timeoutMs: 2000)) {
    http_response_code(429);
    echo json_encode([
        'error' => 'စနစ်အလုပ်များနေပါသဖြင့် ခေတ္တစောင့်ဆိုင်းပြီးမှ ပြန်လည်ကြိုးစားပေးပါ။ (Resource Locked)'
    ]);
    exit;
}

try {
    // Critical Section: Stock စစ်ဆေးခြင်းနှင့် Order ဖြတ်ခြင်း
    // အခြား မည်သည့် Server/Process မှ ဤ Product အတွက် တစ်ပြိုင်နက် ဝင်ရောက်ခွင့်မရှိပါ
    $db = getPdoConnection();
    
    $stmt = $db->prepare("SELECT stock FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $stock = (int) $stmt->fetchColumn();

    if ($stock <= 0) {
        throw new \Exception("ပစ္စည်းလက်ကျန် ကုန်သွားပါပြီ။");
    }

    $db->prepare("UPDATE products SET stock = stock - 1 WHERE id = ?")->execute([$productId]);
    // Create Order Record ...

    echo json_encode(['success' => true, 'message' => 'Order အောင်မြင်စွာ တင်ပြီးပါပြီ။']);

} finally {
    // မဖြစ်မနေ Lock ကို ပြန်လည်လွှတ်ပေးရမည်
    $lock->release();
}
```

---

## ၆။ Production Redis Best Practices & Pitfalls

1. **Memory Policy (`maxmemory-policy`)**:
   - Cache အတွက် အသုံးပြုပါက `volatile-lru` သို့မဟုတ် `allkeys-lru` ထားရှိပါ။ Memory ပြည့်သွားပါက သက်တမ်းလွန် သို့မဟုတ် သုံးနည်းသော key များကို အလိုအလျောက် ရှင်းလင်းပေးမည်။
2. **Key Prefix & Namespace**:
   - `prod:user:123`, `prod:orders:99` ကဲ့သို့ စနစ်တကျ `:` ခွဲ၍ သိမ်းပါ။
3. **Avoid `KEYS *` Command in Production**:
   - `KEYS *` သည် Single-threaded Redis process တစ်ခုလုံးကို Lock ဖြစ်စေပြီး Server freeze ဖြစ်သွားနိုင်သည်။ Pattern match ရှာဖွေလိုပါက `SCAN` command ကို cursor-based ဖြင့်သာ သုံးပါ။
4. **Use Persistent Connection (`pconnect`)**:
   - Request တိုင်းအတွက် TCP handshake အသစ်မလုပ်ဘဲ Connection overhead ကို 80% အထိ လျှော့ချပါ။
