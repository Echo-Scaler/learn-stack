---
title: Complete Caching Architecture in PHP
description: Application Cache (APCu, OPcache), File Cache, HTTP Cache (ETag, 304), CDN Edge Cache, နှင့် Database/Redis Cache (Cache Stampede Mutex) အဆင့် ၆ ဆင့် ပြည့်စုံသော လမ်းညွှန်
---

Web Application တစ်ခု၏ Speed နှင့် Scalability ကို မြှင့်တင်ရာတွင် Caching သည် အရေးအကြီးဆုံး လက်နက်တစ်ခု ဖြစ်သည်။ Request တစ်ခု Browser ထံမှ စတင်ထွက်ခွာလာချိန်မှ PHP Server နှင့် Database သို့ ရောက်ရှိသည်အထိ အဆင့်တိုင်းတွင် အသုံးပြုနိုင်သော **၆ ဆင့် Caching Architecture (Six-Level Caching Architecture)** ကို Production Best Practices များနှင့်တကွ အသေးစိတ် လေ့လာပါမည်။

---

## ၁။ The 6-Level Caching Architecture Overview

```
[ Browser / Client ]
       |
       v
(1) HTTP Browser Cache (ETag, Cache-Control, 304 Not Modified)
       |
       v
(2) CDN Edge Cache (Cloudflare / CloudFront - Edge Locations)
       |
       v
(3) Reverse Proxy Cache (Nginx FastCGI Cache / Varnish)
       |
       v
[ PHP Application Engine ]
       |---> (4) Application Memory Cache (APCu, OPcache / JIT)
       |---> (5) File Cache (Local NVMe Disk Caching)
       |
       v
(6) Database Cache (Redis / Memcached In-Memory Data Store)
       |
       v
[ Persistent Database: MySQL / PostgreSQL ]
```

| Caching Layer | တည်နေရာ (Location) | Latency (ခန့်မှန်းခြေ) | အသုံးချမှု (Use Case) |
| :--- | :--- | :--- | :--- |
| **1. HTTP / Browser** | User's Device / Browser | 0 ms (Local RAM/Disk) | Static Assets (CSS, JS), Private Profile Data |
| **2. CDN Edge** | World-wide Edge Servers | 5 ms ~ 20 ms | Global Media, Public Articles, Product Catalogs |
| **3. Gateway / Nginx** | Web Server Reverse Proxy | 1 ms ~ 5 ms | Full HTML Page Caching (SSR Pages) |
| **4. App / APCu** | PHP Worker Shared RAM | 0.05 ms (Sub-millisecond) | Master Configurations, Translated Dictionaries |
| **5. File Cache** | Server Fast NVMe SSD | 0.5 ms ~ 2 ms | Large Rendered Templates, Heavy Reports |
| **6. Database / Redis** | In-Memory Distributed Cluster | 0.5 ms ~ 1.5 ms | User Sessions, Database Query Results, Carts |

---

## ၂။ Layer 1: HTTP Cache & Conditional Requests (`ETag`, `304 Not Modified`)

Client Browser ထံသို့ ဒေတာအဟောင်း မပြောင်းလဲသေးပါက Body အသစ်ပြန်မပို့ဘဲ `304 Not Modified` Response Code ဖြင့် Bandwidth ကို 99% လျှော့ချပေးနိုင်သည်။

```php
<?php
// public/api/product_detail.php
declare(strict_types=1);

$productId = (int) ($_GET['id'] ?? 1);
$productData = [
    'id' => $productId,
    'name' => 'MacBook Pro M4',
    'price' => 1999,
    'updated_at' => 1735689600 // Epoch timestamp
];

// Content Hash ဖြင့် ETag ထုတ်လုပ်ခြင်း
$etag = '"' . md5(json_encode($productData)) . '"';
$lastModified = gmdate('D, d M Y H:i:s', $productData['updated_at']) . ' GMT';

// HTTP Caching Headers သတ်မှတ်ခြင်း
header('Cache-Control: public, max-age=60, must-revalidate');
header("ETag: {$etag}");
header("Last-Modified: {$lastModified}");

// Client ထံမှ ပါလာသော Validation Header များကို စစ်ဆေးခြင်း
$clientEtag = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
$clientModifiedSince = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';

if ($clientEtag === $etag || $clientModifiedSince === $lastModified) {
    // ဒေတာမပြောင်းလဲသေးပါက Body မပါဘဲ 304 ဖြင့် ချက်ချင်း အဆုံးသတ်သည်
    http_response_code(304);
    exit;
}

// ဒေတာအသစ် ပြောင်းလဲမှသာ 200 OK နှင့်အတူ JSON ပြန်ပေးမည်
header('Content-Type: application/json');
echo json_encode($productData);
```

---

## ၃။ Layer 2 & 3: CDN Edge & Gateway Caching (Cloudflare & Nginx)

### CDN Edge Caching Header သတ်မှတ်ခြင်း
- `s-maxage`: CDN/Proxy အတွက်သာ သက်တမ်းသတ်မှတ်ခြင်း။
- `stale-while-revalidate`: Cache သက်တမ်းကုန်သွားသော်လည်း အသုံးပြုသူထံသို့ Cache အဟောင်းကို ချက်ချင်းပေးလိုက်ပြီး Background မှ Cache အသစ် ပြန်ဆွဲတင်စေခြင်း (Zero Latency Spike)။

```php
// CDN ကို ၃ နာရီ သိမ်းစေပြီး Browser ကို ၅ မိနစ်သာ သိမ်းစေခြင်း
header('Cache-Control: public, max-age=300, s-maxage=10800, stale-while-revalidate=60');
```

### CDN Cache Tagging / Purging (လက်တွေ့ Genba အသုံးချမှု)
Database တွင် Article တစ်ခုကို Update လုပ်လိုက်သည့်အခါ Cloudflare CDN ပေါ်ရှိ Cache ကို API မှတစ်ဆင့် ချက်ချင်း Instant Purge ပြုလုပ်ပုံ:

```php
<?php
// src/Infrastructure/CdnPurgeClient.php
declare(strict_types=1);

namespace App\Infrastructure;

class CdnPurgeClient
{
    public static function purgeUrl(string $url): void
    {
        $ch = curl_init('https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . getenv('CLOUDFLARE_API_TOKEN'),
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'files' => [$url]
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }
}
```

---

## ၄။ Layer 4: Application Shared Memory Cache (APCu)

**APCu (APC User Cache)** သည် Server တစ်လုံးတည်းရှိ PHP-FPM Worker များ အားလုံးကြားတွင် **Shared Memory (RAM)** ဖြင့် ဒေတာများ မျှဝေသိမ်းဆည်းပေးသောကြောင့် Redis ထက်ပင် ပိုမိုမြန်ဆန်သည် (Network TCP overhead လုံးဝမရှိပါ)။

```php
<?php
// src/Cache/ApcuCache.php
declare(strict_types=1);

namespace App\Cache;

class ApcuCache
{
    public static function remember(string $key, int $ttl, callable $callback): mixed
    {
        if (!extension_loaded('apcu') || !apcu_enabled()) {
            return $callback();
        }

        $success = false;
        $value = apcu_fetch($key, $success);

        if ($success) {
            return $value;
        }

        // Cache miss ဖြစ်ပါက Callback ကို execute လုပ်ပြီး သိမ်းဆည်းသည်
        $value = $callback();
        apcu_store($key, $value, $ttl);

        return $value;
    }
}

// အသုံးပြုပုံ (Master Setting များကို RAM ပေါ်တွင် သိမ်းထားခြင်း):
$systemSettings = ApcuCache::remember('site_configs', 3600, function () {
    // Database မှ Heavy Config Query ခေါ်ခြင်း
    return getSettingsFromDatabase();
});
```

---

## ၅။ Layer 5: High-Performance Disk File Cache

Redis မရှိသော Server များ သို့မဟုတ် Payload အရွယ်အစား အလွန်ကြီးမားသော HTML Template / Report ဒေတာများအတွက် Directory Sharding ဖြင့် တည်ဆောက်ထားသော File Cache ဖြစ်သည်။

```php
<?php
// src/Cache/FileCache.php
declare(strict_types=1);

namespace App\Cache;

class FileCache
{
    public function __construct(private string $cacheDir = '/tmp/app_cache')
    {
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }

    public function get(string $key): mixed
    {
        $filePath = $this->getFilePath($key);
        if (!file_exists($filePath)) {
            return null;
        }

        $content = file_get_contents($filePath);
        if ($content === false) {
            return null;
        }

        $data = unserialize($content);
        if ($data['expires_at'] < time()) {
            @unlink($filePath);
            return null;
        }

        return $data['value'];
    }

    public function set(string $key, mixed $value, int $ttlSeconds): bool
    {
        $filePath = $this->getFilePath($key);
        $payload = serialize([
            'expires_at' => time() + $ttlSeconds,
            'value' => $value
        ]);

        // Atomic File Write (ပြိုင်တူရေးသည့်အခါ ဖိုင်ပျက်စီးမှု ကာကွယ်ခြင်း)
        $tempPath = $filePath . '.' . bin2hex(random_bytes(6)) . '.tmp';
        if (file_put_contents($tempPath, $payload) === false) {
            return false;
        }

        return rename($tempPath, $filePath);
    }

    private function getFilePath(string $key): string
    {
        $hash = md5($key);
        // Single directory ထဲတွင် ဖိုင်သိန်းချီမဖြစ်စေရန် 2-level Sharding ပြုလုပ်ခြင်း
        $dir = $this->cacheDir . '/' . substr($hash, 0, 2) . '/' . substr($hash, 2, 2);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir . '/' . $hash . '.cache';
    }
}
```

---

## ၆။ Layer 6: Database Cache & Anti-Stampede Lock (Cache-Aside Pattern)

### ပြဿနာ (Cache Stampede / Dogpiling / Thundering Herd)
လူကြိုက်များသော Key တစ်ခု (ဥပမာ- `top_trending_news`) သက်တမ်းကုန်သွားသည့် စက္ကန့်ပိုင်းတွင် တစ်ပြိုင်နက်တည်း Request ၅,၀၀၀ ရောက်ရှိလာပါက:
- Request ၅,၀၀၀ စလုံးသည် Cache Miss ဖြစ်သွားသည်။
- Request ၅,၀၀၀ စလုံးသည် MySQL ဆီသို့ Heavy Query ကို တစ်ပြိုင်နက် ပစ်ခတ်လိုက်သဖြင့် **Database Crash** ဖြစ်သွားသည်။

### ဖြေရှင်းချက် (Cache Stampede Mutex Lock Pattern)
Cache Miss ဖြစ်သွားပါက Process တစ်ခုတည်းကသာ Distributed Lock ယူပြီး Database မှ Query ဆွဲထုတ်ကာ Cache သစ် တင်ပေးရမည်။ ကျန် Process များသည် Lock လွတ်သည်အထိ စောင့်ဆိုင်းပြီး Cache အသစ်ထံမှသာ ဖတ်ယူရမည်:

```php
<?php
// src/Cache/CacheAsideManager.php
declare(strict_types=1);

namespace App\Cache;

use Redis;

class CacheAsideManager
{
    public function __construct(private Redis $redis) {}

    public function rememberWithMutex(string $key, int $ttl, callable $dbCallback): mixed
    {
        $cached = $this->redis->get($key);
        if ($cached !== false) {
            return json_decode($cached, true);
        }

        // Cache Miss! Stampede မဖြစ်စေရန် Mutex Lock ရယူခြင်း
        $lockKey = "lock:{$key}";
        $lockAcquired = $this->redis->set($lockKey, '1', ['nx', 'px' => 3000]); // 3s lock

        if ($lockAcquired) {
            try {
                // Winner Process: Database ထံမှ ဒေတာဆွဲယူပြီး Cache တွင် အသစ်သိမ်းသည်
                $freshData = $dbCallback();
                $this->redis->setEx($key, $ttl, json_encode($freshData));
                return $freshData;
            } finally {
                $this->redis->del($lockKey);
            }
        } else {
            // Loser Processes: Winner က Cache တင်ပြီးသည်အထိ 100ms စောင့်ဆိုင်းပြီး ပြန်ဖတ်သည်
            usleep(100000); // 100ms
            $retryCached = $this->redis->get($key);
            if ($retryCached !== false) {
                return json_decode($retryCached, true);
            }

            // Fallback: အကယ်၍ Winner ကြာမြင့်နေပါက Database မှ တိုက်ရိုက်ဖတ်သည်
            return $dbCallback();
        }
    }
}
```

---

## ၇။ Caching Best Practices & Production Guidelines

1. **Never Cache Indefinitely**: Cache တိုင်းတွင် မဖြစ်မနေ သင့်လျော်သော **TTL (Time-To-Live)** သတ်မှတ်ထားပါ။
2. **Invalidate on Write**: User Update ဖြစ်တိုင်း သက်ဆိုင်ရာ Cache Key များကို ချက်ချင်းဖျက်ပစ်ပါ (Eviction on Write)။
3. **Use Jitter to Prevent Synchronous Expiry**: Cache Key များစွာကို တစ်ချိန်တည်း မကုန်ဆုံးစေရန် TTL တွင် Random စက္ကန့်အနည်းငယ် ပေါင်းထည့်ပါ:
   ```php
   $ttl = 3600 + rand(0, 300); // 1 hour + up to 5 mins jitter
   ```
4. **Compression for Large Payloads**: 100KB ထက်ကြီးသော Data Structure များကို Redis တွင် သိမ်းဆည်းပါက `gzcompress` သို့မဟုတ် `zstd` သုံးခြင်းဖြင့် Network Bandwidth နှင့် RAM ကို 70% ကျော် ချွေတာနိုင်သည်။
