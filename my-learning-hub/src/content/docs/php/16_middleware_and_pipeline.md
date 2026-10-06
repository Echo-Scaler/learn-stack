---
title: "16. Middleware & Request Pipeline Architecture"
description: "PSR-15 Middleware Pattern၊ Onion Architecture၊ Request Pipeline Runner ကို Pure PHP ဖြင့် အစမှ အဆုံး တည်ဆောက်ပုံနှင့် Production Middlewares ၅ မျိုး"
---

# Middleware & Request Pipeline Architecture (PSR-15 & Clean Design)

ခေတ်မီ Web Applications နှင့် RESTful API များတွင် Controller ထံသို့ HTTP Request မရောက်ရှိမီ Authentication စစ်ဆေးခြင်း၊ CORS Header ထည့်သွင်းခြင်း၊ Request Logging ပြုလုပ်ခြင်းနှင့် Rate Limiting ကန့်သတ်ခြင်း စသည့် အထွေထွေ စစ်ဆေးမှုများကို **Middleware (ကြားခံစနစ်)** များဖြင့် ဖွဲ့စည်းတည်ဆောက်ပါသည်။

---

## ၁။ Middleware ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?

### (က) Middleware ဆိုတာဘာလဲ? (What is Middleware?)
Middleware ဆိုသည်မှာ HTTP Request တစ်ခု Server သို့ ဝင်ရောက်လာသည့်အခါ Controller / Business Logic ထံသို့ မရောက်မီ ကြားထဲမှ ဖြတ်သန်းသွားရသော **Filter (စစ်ထုတ်ပေးသည့် အလွှာ)** ဖြစ်ပါသည်။
၎င်းကို ကြက်သွန်နီအခွံအလွှာများသကဲ့သို့ တည်ဆောက်ထားသောကြောင့် **Onion Architecture** ဟုလည်း ခေါ်ဆိုပါသည်။

```
[HTTP Request] ──► [1. Logging] ──► [2. CORS] ──► [3. Auth] ──► [CONTROLLER]
                                                                        │
[HTTP Response] ◄─ [1. Logging] ◄── [2. CORS] ◄── [3. Auth] ◄──────────┘
```

### (ခ) ဘာကြောင့် သုံးရသလဲ? (Why do we use it?)
1. **Separation of Concerns (တာဝန်ခွဲခြားမှု)**: Controller ထဲတွင် Login စစ်ဆေးခြင်း၊ Header စစ်ဆေးခြင်း၊ Rate Limit စစ်ဆေးခြင်းများကို ရောပြွမ်းမရေးတော့ဘဲ Controller ကို သန့်ရှင်းသော Business Logic သာ ရေးစေနိုင်ခြင်း။
2. **Reusability (ပြန်လည်အသုံးချနိုင်မှု)**: Auth Middleware တစ်ခုတည်းကို ရေးထားပြီး Route ရာပေါင်းများစွာတွင် လိုအပ်သလို ကပ်သုံးနိုင်ခြင်း။
3. **Short-Circuiting (စောစီးစွာ ပိတ်ပင်နိုင်ခြင်း)**: Token မမှန်ပါက Controller သို့ ပေးမရောက်ဘဲ Middleware အဆင့်မှာပင် `401 Unauthorized` ဖြင့် ချက်ချင်း ရပ်တန့်နိုင်သဖြင့် Server Resource ချွေတာနိုင်ခြင်း။

---

## ၂။ PSR-15 Standard Architecture

PHP Standard Recommendation (PSR-15) တွင် Middleware အတွက် တရားဝင် Interface ၂ ခုကို သတ်မှတ်ထားပါသည်:

1. **`MiddlewareInterface`**: Request ကို လက်ခံ၍ Process လုပ်ပြီး နောက်အလွှာသို့ လက်ဆင့်ကမ်းပေးသည့် တာဝန်။
2. **`RequestHandlerInterface`**: နောက်ထပ် Middleware သို့မဟုတ် နောက်ဆုံး Controller ကို Execute လုပ်ပေးသည့် Pipeline Runner တာဝန်။

```php
namespace Psr\Http\Server;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

interface MiddlewareInterface
{
    // Request ကို စစ်ဆေးပြီး $handler->handle($request) ဖြင့် နောက်အဆင့်သို့ ပို့သည်
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface;
}
```

---

## ၃။ Pure PHP ဖြင့် Request Pipeline Runner တည်ဆောက်ခြင်း (Zero-Framework)

ပြင်ပ Framework မလိုဘဲ Native PHP ဖြင့် အလုပ်လုပ်နိုင်သော Enterprise Pipeline Dispatcher ကို အောက်ပါအတိုင်း တည်ဆောက်နိုင်ပါသည်:

```php
<?php

class Request
{
    public function __construct(
        public string $method,
        public string $uri,
        public array $headers = [],
        public array $attributes = []
    ) {}

    public function withAttribute(string $key, mixed $value): self
    {
        $clone = clone $this;
        $clone->attributes[$key] = $value;
        return $clone;
    }
}

class Response
{
    public function __construct(
        public int $statusCode = 200,
        public array $headers = [],
        public string $body = ''
    ) {}

    public function withHeader(string $name, string $value): self
    {
        $clone = clone $this;
        $clone->headers[$name] = $value;
        return $clone;
    }

    public function send(): void
    {
        http_response_code($this->statusCode);
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        echo $this->body;
    }
}

interface Middleware
{
    public function process(Request $request, callable $next): Response;
}

// Pipeline Runner (Onion Dispatcher)
class Pipeline
{
    /** @var Middleware[] */
    private array $middlewares = [];

    public function pipe(Middleware $middleware): self
    {
        $this->middlewares[] = $middleware;
        return $this;
    }

    public function run(Request $request, callable $coreHandler): Response
    {
        // Middlewares များကို အနောက်မှ ရှေ့သို့ Stack ပုံစံ ဖွဲ့စည်းသည်
        $pipeline = array_reduce(
            array_reverse($this->middlewares),
            function (callable $next, Middleware $middleware) {
                return function (Request $req) use ($middleware, $next): Response {
                    return $middleware->process($req, $next);
                };
            },
            $coreHandler
        );

        return $pipeline($request);
    }
}
```

---

## ၄။ လုပ်ငန်းခွင်သုံး Essential Middlewares ၅ မျိုး (Production Implementations)

### ၁။ CORS Middleware (Cross-Origin Resource Sharing)
Frontend (React/Vue) နှင့် API ဒိုမိန်း မတူသည့်အခါ Browser Preflight `OPTIONS` Request ကို ကိုင်တွယ်ဖြေရှင်းခြင်း:

```php
<?php
class CorsMiddleware implements Middleware
{
    public function process(Request $request, callable $next): Response
    {
        // Preflight OPTIONS Request ဖြစ်ပါက Controller သို့ မပို့ဘဲ ချက်ချင်း 204 Return ပြန်သည်
        if ($request->method === 'OPTIONS') {
            return new Response(204, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age' => '86400',
            ]);
        }

        // Controller အလုပ်လုပ်ပြီး ထွက်လာသော Response တွင် Header ပေါင်းထည့်သည်
        $response = $next($request);
        return $response->withHeader('Access-Control-Allow-Origin', '*');
    }
}
```

### ၂။ Request Timing & Logger Middleware
Request တစ်ခုချင်းစီ၏ ကြာမြင့်ချိန် (Execution Time in milliseconds) ကို တိုင်းတာ၍ မှတ်တမ်းတင်ခြင်း:

```php
<?php
class RequestTimingMiddleware implements Middleware
{
    public function process(Request $request, callable $next): Response
    {
        $startTime = microtime(true);

        // Core App သို့ လက်ဆင့်ကမ်းသည်
        $response = $next($request);

        $durationMs = round((microtime(true) - $startTime) * 1000, 2);
        
        // Response Header တွင် ကြာမြင့်ချိန် ထည့်ပေးသည်
        $response = $response->withHeader('X-Response-Time', "{$durationMs}ms");

        // Production Server တွင် Slow Request များကို Log မှတ်သည် (> 500ms)
        if ($durationMs > 500) {
            error_log("[SLOW REQUEST] {$request->method} {$request->uri} took {$durationMs}ms");
        }

        return $response;
    }
}
```

### ၃။ Bearer Token Authentication Middleware
JWT သို့မဟုတ် API Key မပါဝင်ပါက Controller မရောက်မီ `401 Unauthorized` ဖြင့် ပိတ်ပင်ခြင်း:

```php
<?php
class BearerAuthMiddleware implements Middleware
{
    public function process(Request $request, callable $next): Response
    {
        $authHeader = $request->headers['Authorization'] ?? '';

        if (!str_starts_with($authHeader, 'Bearer ')) {
            return new Response(401, ['Content-Type' => 'application/json'], json_encode([
                'success' => false,
                'message' => 'Unauthorized: Missing or invalid Bearer token.'
            ]));
        }

        $token = substr($authHeader, 7);
        $user = $this->validateToken($token);

        if (!$user) {
            return new Response(401, ['Content-Type' => 'application/json'], json_encode([
                'success' => false,
                'message' => 'Unauthorized: Expired or revoked token.'
            ]));
        }

        // User Data ကို Request Attribute အဖြစ် ထည့်သွင်းပြီး Controller ထံ လွှဲပေးသည်
        $request = $request->withAttribute('authenticated_user', $user);
        return $next($request);
    }

    private function validateToken(string $token): ?array
    {
        // Production: Database သို့မဟုတ် JWT Signature စစ်ဆေးခြင်း
        if ($token === 'prod-secret-token-xyz') {
            return ['id' => 101, 'role' => 'admin', 'name' => 'Ko Kyaw'];
        }
        return null;
    }
}
```

### ၄။ Rate Limiting Middleware (IP-based Request Throttling)
DDoS သို့မဟုတ် Brute Force တိုက်ခိုက်မှုများကို ကာကွယ်ရန် ၁ မိနစ်လျှင် Request ၆၀ ထက် မပိုစေရန် ကန့်သတ်ခြင်း:

```php
<?php
class RateLimitMiddleware implements Middleware
{
    private const MAX_REQUESTS_PER_MINUTE = 60;

    public function process(Request $request, callable $next): Response
    {
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $cacheKey = "rate_limit:" . md5($clientIp);

        // APCu သို့မဟုတ် Redis cache ဖြင့် Request count မှတ်သည်
        $currentCount = (int)apcu_fetch($cacheKey);

        if ($currentCount >= self::MAX_REQUESTS_PER_MINUTE) {
            return new Response(429, [
                'Content-Type' => 'application/json',
                'Retry-After' => '60'
            ], json_encode([
                'success' => false,
                'message' => 'Too Many Requests: Rate limit exceeded. Try again in 1 minute.'
            ]));
        }

        if ($currentCount === 0) {
            apcu_store($cacheKey, 1, 60); // 60 seconds TTL
        } else {
            apcu_inc($cacheKey);
        }

        $response = $next($request);
        return $response->withHeader('X-RateLimit-Remaining', (string)(self::MAX_REQUESTS_PER_MINUTE - $currentCount - 1));
    }
}
```

### ၅။ JSON Body Parser Middleware
Client မှ ပို့လိုက်သော `application/json` payload ကို Parse လုပ်ပြီး Array အဖြစ် အလွယ်တကူ သုံးနိုင်စေခြင်း:

```php
<?php
class JsonBodyParserMiddleware implements Middleware
{
    public function process(Request $request, callable $next): Response
    {
        $contentType = $request->headers['Content-Type'] ?? '';

        if (str_contains($contentType, 'application/json')) {
            $rawBody = file_get_contents('php://input');
            $data = json_decode($rawBody, true);

            if (json_last_error() !== JSON_ERROR_NONE && !empty($rawBody)) {
                return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                    'success' => false,
                    'message' => 'Malformed JSON in request body.'
                ]));
            }

            $request = $request->withAttribute('parsed_body', $data ?? []);
        }

        return $next($request);
    }
}
```

---

## ၅။ စနစ်အားလုံး ပေါင်းစပ်အသုံးပြုပုံ (Putting It All Together)

```php
<?php
// index.php
require_once __DIR__ . '/Pipeline.php';

$request = new Request(
    method: $_SERVER['REQUEST_METHOD'],
    uri: $_SERVER['REQUEST_URI'],
    headers: getallheaders()
);

$pipeline = new Pipeline();

// Middleware များကို စစ်ဆေးလိုသည့် အစဉ်အတိုင်း စီတန်းထည့်သွင်းသည်
$pipeline->pipe(new CorsMiddleware())
         ->pipe(new RequestTimingMiddleware())
         ->pipe(new JsonBodyParserMiddleware())
         ->pipe(new BearerAuthMiddleware());

// အလယ်ဗဟိုရှိ Core Controller / Handler
$response = $pipeline->run($request, function (Request $req): Response {
    $user = $req->attributes['authenticated_user'];
    $body = $req->attributes['parsed_body'] ?? [];

    $data = [
        'success' => true,
        'message' => "Hello, {$user['name']}! Data received successfully.",
        'payload' => $body
    ];

    return new Response(200, ['Content-Type' => 'application/json'], json_encode($data));
});

// HTTP Response ကို Browser သို့ ပေးပို့သည်
$response->send();
```

---

## ၆။ လုပ်ငန်းခွင်သုံး အကြံပြုချက်များ (Genba Best Practices)

1. **Order Matters (အစဉ်အတိုင်း စီပါ)**: Middleware ၏ အစီအစဉ်သည် အလွန်အရေးကြီးသည်။ CORS နှင့် Logging သည် အမြဲတမ်း **အပြင်ဆုံး (ပထမဆုံး)** ဖြစ်ရမည်ဖြစ်ပြီး Auth Middleware သည် ၎င်းတို့၏ အတွင်းဘက်မှ လာရပါမည်။
2. **Immutable Request Objects**: Request Object ကို ပြင်ဆင်သည့်အခါ Clone ပြုလုပ်၍ `withAttribute()` ပုံစံဖြင့်သာ သုံးပါ (Side-effects ကင်းဝေးစေရန်)။
3. **Keep Middlewares Thin**: Database Query များစွာ ခေါ်ခြင်း၊ လေးလံသော တွက်ချက်မှုများကို Middleware ထဲတွင် မရေးပါနှင့်။ အဓိက စစ်ဆေးမှု (Validation / Guard) သာ ပြုလုပ်သင့်ပါသည်။
