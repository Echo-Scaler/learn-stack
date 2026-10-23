---
title: "21. Middleware, Guards, Providers & Authorization (Auth vs Authz)"
description: "Laravel Middleware အမျိုးအစားများ၊ အသုံးပြုပုံ၊ Real-work ဥပမာများ၊ Guards & Providers၊ Authentication vs Authorization၊ Gates & Policies၊ Role/Permission အသေးစိတ်"
---

> Laravel 11 / 12 အခြေခံ။ Laravel 10 နှင့် ကွာခြားချက်များကို `> 📝` ဖြင့်ဖော်ပြထားသည်။

## 🧭 မာတိကာ
1. Middleware ဆိုတာ ဘာလဲ၊ ဘာကြောင့်သုံးရသလဲ
2. Middleware အမျိုးအစား (၆ မျိုး)
3. Built-in Middleware အားလုံး
4. ကိုယ်ပိုင် Middleware ရေးခြင်း - Real-work ဥပမာ ၁၀ ခု
5. Middleware ကို ဘယ်လိုသုံးမလဲ (Route / Group / Controller / Global)
6. Middleware Order, Before/After, Terminable
7. Authentication vs Authorization
8. Guards & Providers
9. Multi-Auth (Admin + Customer)
10. Authorization: Gates
11. Authorization: Policies
12. Roles & Permissions (Real-work)
13. 401 vs 403 vs 404 - ဘယ်အချိန်ဘာပြန်မလဲ
14. ဘယ်အချိန် ဘာသုံးမလဲ ဆုံးဖြတ်ဇယား
15. Testing နှင့် လေ့ကျင့်ခန်း

---

## ၁။ Middleware ဆိုတာ ဘာလဲ?

**Middleware** = Request သည် Controller သို့မရောက်မီ (နှင့် Response ပြန်မထွက်မီ) ကြားထဲမှ **စစ်ဆေး/ပြင်ဆင်/ပိတ်ဆို့** သော "လုံခြုံရေးစောင့်" ဖြစ်သည်။

```
 Request ──► [Middleware A] ──► [Middleware B] ──► [Middleware C] ──► Controller
                                                                          │
 Response ◄── [Middleware A] ◄── [Middleware B] ◄── [Middleware C] ◄──────┘
              (နောက်ပြန်လမ်းတွင်လည်း Response ကို ပြင်နိုင်)
```

### ဘာကြောင့် Middleware သုံးရသလဲ? (Controller တိုင်းတွင် `if` ရေးလို့မရဘူးလား?)

| Controller တွင် `if` ရေးလျှင် | Middleware သုံးလျှင် |
| :--- | :--- |
| Controller ၅၀ ခုတွင် Login စစ်ချက် ထပ်ခါထပ်ခါရေး | **တစ်ခုတည်းရေး၊ Route တွင် တပ်ရုံ** |
| တစ်ခုမေ့လျှင် Security Hole | Group တစ်ခုလုံး အလိုအလျောက်ကာကွယ် |
| Controller ရှုပ် | Controller သန့် (Business logic သာ) |
| Test ခက် | Middleware သီးခြား Test လွယ် |

### Real-work Middleware အသုံးပြုရာများ
Login စစ်၊ Role စစ်၊ API Rate limit၊ Request Log၊ Locale ပြောင်း၊ HTTPS Force၊ CORS၊ Maintenance Mode၊ Security Header၊ API Key စစ်၊ IP Whitelist၊ Subscription စစ်၊ Request ID ထည့်။

---

## ၂။ Middleware အမျိုးအစား (၆ မျိုး)

| # | အမျိုးအစား | ဘယ်မှာတပ် | ဥပမာ |
| :-: | :--- | :--- | :--- |
| 1 | **Global** | Request **အားလုံး** | `TrimStrings`, `TrustProxies`, `HandleCors` |
| 2 | **Group** | `web` / `api` Group | `web`: Session, CSRF / `api`: Throttle |
| 3 | **Route** | Route/Group တစ်ခုချင်း | `auth`, `verified`, `can:`, `role:admin` |
| 4 | **Controller** | Controller Constructor/Interface | `HasMiddleware` |
| 5 | **Parameterized** | Parameter ပါ | `role:admin,editor` / `throttle:60,1` |
| 6 | **Terminable** | Response ပို့ပြီးမှ Run | Logging, Session save |

---

## ၃။ Built-in Middleware (Alias များ)

| Alias | လုပ်ဆောင်ချက် | သုံးပုံ |
| :--- | :--- | :--- |
| `auth` | Login ဝင်ထားမှ ဝင်ခွင့် | `->middleware('auth')` / `auth:sanctum` / `auth:admin` |
| `auth.basic` | HTTP Basic Auth | Internal tool |
| `guest` | Login **မဝင်ရသေးမှ** ဝင်ခွင့် (Login page) | `->middleware('guest')` |
| `verified` | Email Verify ပြီးမှ | `->middleware(['auth','verified'])` |
| `password.confirm` | Password ထပ်မေး (Sensitive action) | Delete account |
| `can:ability,model` | Gate/Policy စစ် | `->middleware('can:update,post')` |
| `throttle:60,1` | Rate Limit (၁ မိနစ် ၆၀) | API, Login |
| `signed` | Signed URL စစ် | Email verify, Unsubscribe link |
| `cache.headers` | Cache-Control Header | Static API |
| `abilities:a,b` | Sanctum Token တွင် Ability **အားလုံး** ပါ | `->middleware('abilities:orders:read')` |
| `ability:a,b` | Sanctum Token တွင် Ability **တစ်ခုခု** ပါ | |

### Route တွင် တပ်ပုံ
```php
Route::get('/profile', ProfileController::class)->middleware('auth');
Route::get('/billing', BillingController::class)->middleware(['auth', 'verified']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::resource('orders', OrderController::class);
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Resource တစ်ခုလုံးမှ တချို့ကိုသာ ချန်
Route::resource('posts', PostController::class)->middleware('auth')->withoutMiddleware('auth', ...);
Route::get('/health', HealthController::class)->withoutMiddleware(['auth']);
```

---

## ၄။ ကိုယ်ပိုင် Middleware ရေးခြင်း

```bash
php artisan make:middleware EnsureUserHasRole
```

### Registration (Laravel 11+) - `bootstrap/app.php`
> 📝 Laravel 10 နှင့်ရှေ့တွင် `app/Http/Kernel.php` ၏ `$middlewareAliases` တွင်ထည့်ခဲ့သည်။ Laravel 11 တွင် Kernel မရှိတော့။

```php
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Configuration\Middleware;

->withMiddleware(function (Middleware $middleware) {

    // Alias (Route တွင်နာမည်ဖြင့်ခေါ်ရန်)
    $middleware->alias([
        'role'        => EnsureUserHasRole::class,
        'api.key'     => \App\Http\Middleware\VerifyApiKey::class,
        'subscribed'  => \App\Http\Middleware\EnsureSubscribed::class,
    ]);

    // Global (Request အားလုံး)
    $middleware->append(\App\Http\Middleware\AddRequestId::class);     // နောက်ဆုံး
    $middleware->prepend(\App\Http\Middleware\ForceHttps::class);      // ပထမ

    // Group တစ်ခုသို့
    $middleware->web(append: [\App\Http\Middleware\SetLocale::class]);
    $middleware->api(prepend: [\App\Http\Middleware\ForceJson::class]);
    // (သို့) $middleware->appendToGroup('api', ...)

    // Custom Group
    $middleware->group('admin', [
        'auth',
        'verified',
        'role:admin',
        \App\Http\Middleware\LogAdminActivity::class,
    ]);

    // Guest ဖြစ်နေသူကို ပို့ရာ / Login မဝင်သူကို ပို့ရာ
    $middleware->redirectGuestsTo('/login');
    $middleware->redirectUsersTo('/dashboard');

    // CSRF မှ API Webhook ကိုချန်
    $middleware->validateCsrfTokens(except: ['stripe/webhook']);

    // Reverse proxy (AWS ALB) နောက်ကွယ်
    $middleware->trustProxies(at: '*');
})
```

---

### 📘 Example 1 - Role စစ်ခြင်း (Parameterized)
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        if (! in_array($user->role, $roles, true)) {
            abort(403, 'ဤလုပ်ဆောင်ချက်ကို ခွင့်မပြုပါ။');
        }

        return $next($request);
    }
}
```
```php
Route::get('/admin', AdminController::class)->middleware(['auth', 'role:admin']);
Route::get('/reports', ReportController::class)->middleware(['auth', 'role:admin,manager']);
```

### 📘 Example 2 - API Key စစ်ခြင်း (Partner API)
```php
class VerifyApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('X-API-Key');

        if (! $key) {
            return response()->json(['message' => 'API key required'], 401);
        }

        // Key ကို Hash ဖြင့်သိမ်း (Password ကဲ့သို့)
        $client = \App\Models\ApiClient::where('key_hash', hash('sha256', $key))
            ->where('is_active', true)
            ->first();

        if (! $client) {
            return response()->json(['message' => 'Invalid API key'], 401);
        }

        $request->attributes->set('api_client', $client);   // Controller တွင်ယူသုံးရန်
        $client->forceFill(['last_used_at' => now()])->saveQuietly();

        return $next($request);
    }
}
```
```php
Route::middleware('api.key')->prefix('partner')->group(fn () => [
    Route::get('/products', [PartnerProductController::class, 'index']),
]);
```
Controller: `$client = $request->attributes->get('api_client');`

### 📘 Example 3 - Request ID & Logging (Observability)
```php
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AddRequestId
{
    public function handle(Request $request, Closure $next): Response
    {
        $id = $request->header('X-Request-Id') ?: (string) Str::uuid();
        $request->headers->set('X-Request-Id', $id);

        Log::withContext(['request_id' => $id, 'user_id' => $request->user()?->id]);

        $response = $next($request);                       // ← Controller Run
        $response->headers->set('X-Request-Id', $id);      // ← After: Response ကိုပြင်
        return $response;
    }
}
```
Customer က Error ပြောလျှင် `X-Request-Id` ပေးခိုင်း -> Log တွင် grep (Docker/Loki lab တွင်လည်း အသုံးဝင်)။

### 📘 Example 4 - Force JSON (API သည် HTML Error မပြန်စေရန်)
```php
class ForceJson
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}
```
Client က `Accept` မထည့်လည်း Validation Error သည် Redirect မဟုတ်ဘဲ **422 JSON** ပြန်သည်။

### 📘 Example 5 - Locale ပြောင်း (Multi-language)
```php
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->user()?->locale
            ?? $request->getPreferredLanguage(['en', 'ja', 'my'])
            ?? config('app.locale');

        app()->setLocale($locale);
        return $next($request);
    }
}
```

### 📘 Example 6 - Subscription / Plan စစ်
```php
class EnsureSubscribed
{
    public function handle(Request $request, Closure $next, string $plan = 'basic'): Response
    {
        $user = $request->user();

        if (! $user?->subscription || ! $user->subscription->isActive()) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Subscription required'], 402)    // 402 Payment Required
                : redirect()->route('billing.plans')->with('error', 'Plan ဝယ်ယူရန်လိုပါသည်');
        }

        if ($plan === 'pro' && $user->subscription->plan !== 'pro') {
            abort(403, 'Pro plan လိုအပ်ပါသည်');
        }

        return $next($request);
    }
}
```
`->middleware('subscribed:pro')`

### 📘 Example 7 - Security Headers
```php
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->add([
            'X-Frame-Options'           => 'SAMEORIGIN',
            'X-Content-Type-Options'    => 'nosniff',
            'Referrer-Policy'           => 'strict-origin-when-cross-origin',
            'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
            'Permissions-Policy'        => 'camera=(), microphone=()',
        ]);

        return $response;
    }
}
```

### 📘 Example 8 - IP Whitelist (Admin / Internal)
```php
class AllowedIps
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowed = config('security.admin_ips', []);   // .env: ADMIN_IPS=203.0.113.10,198.51.100.0

        if (app()->isProduction() && ! in_array($request->ip(), $allowed, true)) {
            abort(403, 'IP not allowed');
        }
        return $next($request);
    }
}
```
> AWS ALB / Cloudflare နောက်ကွယ်တွင် `trustProxies` မှန်ရမည် မဟုတ်လျှင် `$request->ip()` သည် Load Balancer IP ဖြစ်နေမည်။

### 📘 Example 9 - Terminable Middleware (Response ပို့ပြီးမှ အလုပ်)
```php
class RecordApiUsage
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->attributes->set('started_at', microtime(true));
        return $next($request);
    }

    // Response ကို User ထံ ပို့ပြီးနောက် Run - User မစောင့်ရ
    public function terminate(Request $request, Response $response): void
    {
        $ms = (microtime(true) - $request->attributes->get('started_at')) * 1000;

        \App\Models\ApiUsage::create([
            'user_id' => $request->user()?->id,
            'path'    => $request->path(),
            'status'  => $response->getStatusCode(),
            'ms'      => (int) $ms,
        ]);
    }
}
```
> ⚠️ Terminable Middleware သည် Octane/FPM `fastcgi_finish_request` ပေါ်မူတည်သည်။ အလေးသော အလုပ်ဆိုလျှင် **Queue Job** ထဲပို့ပါ။

### 📘 Example 10 - Maintenance Bypass / Feature Flag
```php
class FeatureEnabled
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        abort_unless(config("features.$feature"), 404);   // ပိတ်ထားလျှင် မရှိသည့်ပုံစံ
        return $next($request);
    }
}
```
`Route::get('/beta/chat', ChatController::class)->middleware('feature:chat');`

---

## ၅။ Middleware ကို ဘယ်လိုသုံးမလဲ

### (က) Route / Group
```php
Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('v1')->group(function () { ... });
```

### (ခ) Controller (Laravel 11 - `HasMiddleware` Interface)
```php
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('role:editor', only: ['store', 'update']),
            new Middleware('role:admin',  only: ['destroy']),
            new Middleware('log', except: ['index']),
        ];
    }
}
```
> 📝 Laravel 10: `$this->middleware('auth')->only('store');` ကို `__construct()` တွင်ရေးခဲ့သည်။

### (ဂ) Global / Group - `bootstrap/app.php` (အပေါ်တွင်ပြပြီး)

### (ဃ) Inline Closure (စမ်းရန်သာ)
```php
Route::get('/ping', fn () => 'pong')->middleware(function ($request, $next) {
    logger('pinged'); return $next($request);
});
```

### Middleware Group တွင် Default များ
| Group | ပါဝင်သည်များ (အကြမ်းဖျင်း) |
| :--- | :--- |
| `web` | EncryptCookies, AddQueuedCookies, StartSession, ShareErrorsFromSession, **ValidateCsrfToken**, SubstituteBindings |
| `api` | (Laravel 11) `SubstituteBindings` - Throttle ကိုကိုယ်တိုင်ထည့်၊ Sanctum ဆိုလျှင် `EnsureFrontendRequestsAreStateful` |

---

## ၆။ Middleware Order, Before/After

### Before vs After
```php
public function handle(Request $request, Closure $next): Response
{
    // ① BEFORE - Controller မတိုင်မီ (စစ်ဆေး / Request ပြင်)
    if ($request->user()?->is_banned) abort(403);

    $response = $next($request);       // ② Controller (နှင့် နောက် Middleware များ) Run

    // ③ AFTER - Response ပြန်ထွက်ချိန် (Header ထည့် / Response ပြင်)
    $response->headers->set('X-App-Version', '1.2.0');

    return $response;
}
```

### Order သည် အရေးကြီးသည်
```php
Route::middleware(['throttle:10,1', 'auth'])     // ❌ Login မဝင်သူများလည်း Rate limit ယူ
Route::middleware(['auth', 'throttle:60,1'])     // ✅ Login စစ်ပြီးမှ User တစ်ဦးချင်း Limit
```
- `auth` မတိုင်မီ `can` မထားရ (User မရှိသေးလျှင် Policy စစ်မရ)။
- `SubstituteBindings` (Route Model Binding) သည် `can:update,post` မတိုင်မီ Run ရမည်။ ဟန်ချက်မကိုက်လျှင် `$middleware->priority([...])`။

---

## ၇။ Authentication vs Authorization

| | **Authentication (AuthN)** | **Authorization (AuthZ)** |
| :--- | :--- | :--- |
| မေးခွန်း | **"သင်ဘယ်သူလဲ?"** | **"သင် ဒါလုပ်ခွင့်ရှိလား?"** |
| ဥပမာ | Email/Password ဖြင့် Login | Admin သာ User ဖျက်နိုင် |
| ပြဿနာဖြစ်လျှင် | **401 Unauthorized** | **403 Forbidden** |
| Laravel Tool | Guards, Providers, Sanctum, Breeze | Gates, Policies, Middleware (`can`, `role`) |
| အစဉ် | **အရင်** | **နောက်** (Auth မပြီးဘဲ Authz မလုပ်နိုင်) |

```
 Request ──► ① Authentication ──► ② Authorization ──► ③ Validation ──► Controller
              "ဘယ်သူလဲ"           "လုပ်ခွင့်ရှိလား"    "Data မှန်လား"
              401                   403                  422
```

### ဥပမာ (ရုံးတက်တာနဲ့ နှိုင်းယှဉ်)
- **AuthN** = ရုံးဝင်ပေါက်တွင် ID Card ပြခြင်း (ကျွန်ုပ်သည် Kyaw ဖြစ်သည်)
- **AuthZ** = Server Room တံခါးကို ဖွင့်ခွင့် ရှိ/မရှိ (Kyaw သည် IT Dept မှာဟုတ်သလား)

---

## ၈။ Guards & Providers

### Guard = "User ကို **ဘယ်လို** မှတ်မိမလဲ"
### Provider = "User ကို **ဘယ်ကနေ** ယူမလဲ"

```
 Request ──► GUARD ───────────────► PROVIDER ───────────► User Model/Table
            (ဘယ်လိုစစ်)              (ဘယ်ကယူ)
  web     : Session + Cookie         users  (eloquent, App\Models\User)
  sanctum : Bearer Token / Cookie    users
  admin   : Session (admin)          admins (eloquent, App\Models\Admin)
```

`config/auth.php`
```php
'defaults' => [
    'guard'     => env('AUTH_GUARD', 'web'),
    'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
],

'guards' => [
    'web' => [
        'driver'   => 'session',       // Cookie + Session ဖြင့်မှတ်မိ
        'provider' => 'users',
    ],
    // 'api' => ['driver' => 'token', 'provider' => 'users'],  // Laravel Sanctum မသုံးမီ ရိုးရိုး token
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',        // Eloquent Model ဖြင့်
        'model'  => App\Models\User::class,
    ],
    // 'users' => ['driver' => 'database', 'table' => 'users'],   // Model မသုံးဘဲ Query Builder
],

'passwords' => [
    'users' => [
        'provider' => 'users',
        'table'    => 'password_reset_tokens',
        'expire'   => 60,
        'throttle' => 60,
    ],
],
```

### Guard Drivers

| Driver | အလုပ်လုပ်ပုံ | သင့်တော်ရာ |
| :--- | :--- | :--- |
| `session` | Login ဝင်လျှင် Session ID Cookie ပေး | Traditional Web (Blade) |
| `sanctum` | SPA = Session Cookie / Mobile = Bearer Token | **SPA + Mobile API (အများဆုံး)** |
| `token` | `api_token` Column ကို Plain/Hash တိုက်စစ် | Legacy / Simple |
| Passport (OAuth2) | OAuth2 Server | Third-party Client များကို Access ပေးလိုလျှင် |
| Custom | `Auth::viaRequest('x', fn)` | JWT, Webhook Signature |

### Guard တစ်ခုချင်း အသုံးပြုပုံ
```php
use Illuminate\Support\Facades\Auth;

Auth::check();                         // Default guard ဖြင့် Login ဝင်ထားလား
Auth::user();                          // လက်ရှိ User
Auth::id();

Auth::guard('admin')->check();         // admin guard ဖြင့်
Auth::guard('admin')->user();

// Login
if (Auth::attempt(['email' => $e, 'password' => $p], $remember = true)) {
    $request->session()->regenerate();    // ⚠️ Session Fixation ကာကွယ်ရန် မဖြစ်မနေ
}
Auth::login($user);                    // User object ဖြင့်တိုက်ရိုက်
Auth::loginUsingId(1);
Auth::once(['email' => $e, 'password' => $p]);   // Session မသိမ်း (API တစ်ကြိမ်သုံး)

// Logout
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

// Password ပြန်စစ်
Auth::validate(['email' => $e, 'password' => $p]);   // Login မဝင်ဘဲ စစ်ရုံ
Hash::check($plain, $user->password);
```
Route တွင်: `->middleware('auth')` = Default Guard၊ `->middleware('auth:admin')`၊ `->middleware('auth:web,sanctum')` (အများအပြား - ပထမအောင်သည်ကိုယူ)။

### Custom Provider (Database / External)
```php
// ဥပမာ - Legacy Table ကို သုံးလိုလျှင်
'providers' => [
    'legacy' => ['driver' => 'database', 'table' => 'tbl_member'],
],
```
Authenticatable Interface ကို Implement လုပ်ထားမှ Model ကို Provider အဖြစ်သုံးနိုင်သည် (`getAuthIdentifierName`, `getAuthPassword`...)။ Laravel ၏ `Authenticatable` Trait ဖြင့် `User extends Authenticatable` ဖြစ်သည်။

---

## ၉။ Multi-Auth (Admin + Customer သီးခြားစနစ်)

**အခြေအနေ:** Customer (`users` table) နှင့် Admin Staff (`admins` table) ကို Login သီးခြား၊ Session သီးခြားထားလိုသည်။

### ၁) Model + Migration
```bash
php artisan make:model Admin -m
```
```php
// app/Models/Admin.php
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden   = ['password', 'remember_token'];
    protected function casts(): array { return ['password' => 'hashed']; }   // Laravel 11
}
```
(Migration: `name, email unique, password, rememberToken, timestamps`)

### ၂) `config/auth.php`
```php
'guards' => [
    'web'   => ['driver' => 'session', 'provider' => 'users'],
    'admin' => ['driver' => 'session', 'provider' => 'admins'],
],
'providers' => [
    'users'  => ['driver' => 'eloquent', 'model' => App\Models\User::class],
    'admins' => ['driver' => 'eloquent', 'model' => App\Models\Admin::class],
],
'passwords' => [
    'users'  => ['provider' => 'users',  'table' => 'password_reset_tokens', 'expire' => 60],
    'admins' => ['provider' => 'admins', 'table' => 'password_reset_tokens', 'expire' => 60],
],
```

### ၃) Admin Login Controller
```php
class AdminLoginController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors(['email' => 'Email သို့ Password မှားနေပါသည်'])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
}
```

### ၄) Routes
```php
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login',  [AdminLoginController::class, 'create'])->name('login');
        Route::post('login', [AdminLoginController::class, 'store']);
    });

    Route::middleware('auth:admin')->group(function () {
        Route::get('dashboard', AdminDashboardController::class)->name('dashboard');
        Route::post('logout', [AdminLoginController::class, 'destroy'])->name('logout');
    });
});
```

### ၅) Guest/Auth Redirect (Laravel 11 - `bootstrap/app.php`)
```php
$middleware->redirectGuestsTo(fn (Request $request) =>
    $request->is('admin/*') ? route('admin.login') : route('login'));

$middleware->redirectUsersTo(fn (Request $request) =>
    $request->is('admin/*') ? route('admin.dashboard') : route('dashboard'));
```

### ၆) Blade
```blade
@auth('admin') Admin: {{ auth('admin')->user()->name }} @endauth
@auth('web')   Customer: {{ auth()->user()->name }} @endauth
```
> အချို့ကို **Single `users` table + `role` column** ဖြင့်လုပ်ပြီး Policy/Middleware ဖြင့်ခွဲလည်း ရသည်။ ရွေးချယ်ပုံ-
>
> | | Multi-Guard (Table ခွဲ) | Single table + Role |
> | :--- | :--- | :--- |
> | Login/Session ခွဲ | ✅ | ❌ |
> | User အမျိုးအစား လုံးဝကွာ (Field မတူ) | ✅ ကောင်း | ❌ |
> | ရိုးရှင်း | ❌ | ✅ |
> | Role များ (admin/editor/support) | ❌ | ✅ ကောင်း |

---

## ၁၀။ Authorization: Gates

**Gate** = "ဤ User သည် ဤလုပ်ဆောင်ချက်ကို လုပ်ခွင့်ရှိလား" ဟူသော **Closure-based Rule** (Model နှင့်မဆိုင်သော ယေဘုယျစစ်ဆေးချက်များအတွက်ကောင်း)။

`AppServiceProvider::boot()`
```php
use Illuminate\Support\Facades\Gate;
use App\Models\{User, Post};

public function boot(): void
{
    // Super-admin ကို အားလုံးခွင့်ပြု (Policy/Gate များ မတိုင်မီ Run)
    Gate::before(function (User $user, string $ability) {
        if ($user->role === 'super_admin') return true;     // null ပြန်လျှင် ဆက်စစ်
    });

    Gate::define('access-admin-panel', fn (User $user) => in_array($user->role, ['admin', 'manager']));

    Gate::define('update-post', fn (User $user, Post $post) => $user->id === $post->user_id);

    Gate::define('export-reports', function (User $user) {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('Admin သာ Export လုပ်နိုင်သည်။');     // ကိုယ်ပိုင် Message
    });
}
```

### အသုံးပြုပုံ
```php
// Controller
if (Gate::allows('update-post', $post)) { ... }
if (Gate::denies('update-post', $post)) abort(403);
Gate::authorize('update-post', $post);               // မရလျှင် AuthorizationException -> 403
$this->authorize('update-post', $post);              // Controller helper
Gate::forUser($otherUser)->allows('update-post', $post);
Gate::any(['update-post', 'delete-post'], $post);    // တစ်ခုခုရလျှင်
Gate::check(['a','b'], $post);                       // အားလုံးရမှ
```
```php
// Route
Route::get('/admin', AdminController::class)->middleware('can:access-admin-panel');
```
```blade
@can('access-admin-panel') <a href="/admin">Admin</a> @endcan
```
```php
// User model မှ
$request->user()->can('update-post', $post);
$request->user()->cannot('update-post', $post);
```

### Gate vs Policy

| | Gate | Policy |
| :--- | :--- | :--- |
| ဖွဲ့စည်းပုံ | Closure (AppServiceProvider တွင်) | Class (Model တစ်ခုချင်း) |
| သင့်တော်ရာ | **Model မဆိုင်သော** (Admin panel, Export, Feature access) | **Model ကိုကိုင်သော CRUD** |
| ပမာဏများလာလျှင် | ရှုပ် | စနစ်ကျ |

---

## ၁၁။ Authorization: Policies

**Policy** = Model တစ်ခု (ဥပမာ `Post`) အတွက် Authorization Logic ကို Class တစ်ခုတည်း၌ စုထားခြင်း။

```bash
php artisan make:policy PostPolicy --model=Post
```
Laravel 11 တွင် `App\Models\Post` ↔ `App\Policies\PostPolicy` ကို **အလိုအလျောက် Discover** လုပ်သည် (Register မလို)။

`app/Policies/PostPolicy.php`
```php
<?php

namespace App\Policies;

use App\Models\{Post, User};
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    // Admin ကိုအားလုံးခွင့်ပြု (Policy-level before)
    public function before(User $user, string $ability): ?bool
    {
        return $user->role === 'admin' ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;                                   // စာရင်းကြည့်ခွင့် အားလုံး
    }

    public function view(?User $user, Post $post): bool    // ?User = Guest လည်း ကြည့်နိုင်
    {
        return $post->is_published || $user?->id === $post->user_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['editor', 'author']);
    }

    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('သင့်ကိုယ်ပိုင် Post ကိုသာ ပြင်နိုင်သည်။');
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id && $post->created_at->gt(now()->subDay());   // ၂၄ နာရီအတွင်းသာ
    }

    public function restore(User $user, Post $post): bool { return false; }
    public function forceDelete(User $user, Post $post): bool { return false; }
}
```

### အသုံးပြုပုံ ၅ နည်း

```php
// ① Controller
public function update(UpdatePostRequest $request, Post $post)
{
    $this->authorize('update', $post);               // မရလျှင် 403
    $post->update($request->validated());
    return new PostResource($post);
}

// ② Controller တစ်ခုလုံး - authorizeResource (Laravel 11: HasMiddleware ဖြင့်)
public static function middleware(): array
{
    return [new Middleware('can:viewAny,App\Models\Post', only: ['index'])];
}

// ③ Route Middleware
Route::put('/posts/{post}', [PostController::class, 'update'])->middleware('can:update,post');
Route::post('/posts', [PostController::class, 'store'])->middleware('can:create,App\Models\Post');

// ④ Blade
@can('update', $post) <a href="{{ route('posts.edit', $post) }}">Edit</a> @endcan
@can('create', App\Models\Post::class) <a href="...">New</a> @endcan

// ⑤ FormRequest authorize()
public function authorize(): bool
{
    return $this->user()->can('update', $this->route('post'));
}
```
> Route Model Binding (`{post}`) ကြောင့် `can:update,post` သည် Post ကို DB မှ အလိုအလျောက်ယူပြီး Policy သို့ပို့သည်။ မရှိလျှင် **404**။

### 🏢 Real-work: Multi-tenant Policy (Company ကိုက်မှ ကြည့်ခွင့်)
```php
class InvoicePolicy
{
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->company_id === $invoice->company_id;      // ⚠️ IDOR ကာကွယ်ရေး
    }
}
```
> **IDOR (Insecure Direct Object Reference)** = `/invoices/123` ကို `124` သို့ပြောင်းရုံနှင့် သူများ Data မြင်ရခြင်း။ **API Security ၏ အဖြစ်အများဆုံး အားနည်းချက်** ဖြစ်ပြီး Policy ဖြင့်သာ ကာကွယ်နိုင်သည်။ **Query ကိုယ်တိုင်ကို Scope လုပ်ခြင်း** လည်းကောင်း-
> ```php
> Invoice::where('company_id', $request->user()->company_id)->findOrFail($id);
> ```

---

## ၁၂။ Roles & Permissions (Real-work)

### အဆင့် ၁ - Simple Role Column + Enum (Role ၃-၅ ခုသာဆိုလျှင်)
```php
enum Role: string
{
    case Admin = 'admin';
    case Manager = 'manager';
    case Staff = 'staff';
    case Customer = 'customer';

    public function can(string $permission): bool
    {
        return in_array($permission, match ($this) {
            self::Admin    => ['*'],
            self::Manager  => ['orders.view', 'orders.update', 'reports.view'],
            self::Staff    => ['orders.view'],
            self::Customer => [],
        }) || $this === self::Admin;
    }
}
```
```php
// User model
protected function casts(): array { return ['role' => Role::class]; }

// Gate
Gate::define('orders.update', fn (User $u) => $u->role->can('orders.update'));
```

### အဆင့် ၂ - Roles & Permissions Table (Dynamic, Admin UI မှ ပြင်လိုလျှင်)
**`spatie/laravel-permission`** သည် စံ Package ဖြစ်သည်။
```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```
```php
// User model
use Spatie\Permission\Traits\HasRoles;
class User extends Authenticatable { use HasRoles; }

// Seeder
Permission::create(['name' => 'orders.update']);
$manager = Role::create(['name' => 'manager']);
$manager->givePermissionTo(['orders.view', 'orders.update']);

$user->assignRole('manager');
$user->hasRole('manager');
$user->can('orders.update');                  // Gate နှင့် ပေါင်းထား
$user->givePermissionTo('reports.view');      // User တစ်ဦးချင်း ထပ်ပေး
```
```php
Route::put('/orders/{order}', ...)->middleware(['auth', 'permission:orders.update']);
Route::get('/admin', ...)->middleware(['auth', 'role:admin|manager']);
```
```blade
@role('admin') ... @endrole
@can('orders.update') ... @endcan
```

### ရွေးချယ်ပုံ
| | Role column | Spatie Permission |
| :--- | :--- | :--- |
| Role ≤ 5၊ ပြောင်းလဲမှုနည်း | ✅ | Overkill |
| Admin UI မှ Role/Permission စီမံ | ❌ | ✅ |
| User တစ်ဦးချင်း Permission အပိုပေး | ❌ | ✅ |
| Team/Tenant Scoped | ❌ | ✅ (Teams feature) |

---

## ၁၃။ 401 vs 403 vs 404 vs 422 - ဘယ်အချိန်ဘာပြန်မလဲ

| Code | အဓိပ္ပါယ် | ဥပမာ |
| :-: | :--- | :--- |
| **401** | Login မဝင်ရသေး / Token မမှန် | `auth` Middleware ကျ |
| **403** | Login ဝင်ပြီး၊ ခွင့်မရှိ | Staff က User ဖျက်ရန်ကြိုးစား |
| **404** | မရှိ **(သို့မဟုတ် မရှိဟုဟန်ဆောင်)** | သူများ Order ID - 403 ထက် 404 က **Resource ရှိမရှိ မဖော်ပြ** လုံခြုံ |
| **419** | CSRF Token / Session Expire | Web Form |
| **422** | Validation ကျ | Form Request |
| **429** | Rate limit ကျော် | Throttle |

```php
// ကိုယ့်ဝန်ထမ်း Data မဟုတ်လျှင် 404 ပြန် (Existence မဖော်)
$order = Order::where('company_id', $user->company_id)->findOrFail($id);   // 404 ပြန်သွား

// Policy deny ကို 404 ပြောင်း
Response::denyAsNotFound();                   // Laravel 10.?+ 
```

API တွင် `auth` Middleware ကျလျှင် Redirect မဟုတ်ဘဲ **JSON 401** ပြန်စေရန် `Accept: application/json` (သို့) `ForceJson` Middleware (အပေါ်ရှိ Example 4) သုံးပါ။

---

## ၁၄။ ဘယ်အချိန် ဘာသုံးမလဲ - ဆုံးဖြတ်ဇယား

| လိုအပ်ချက် | သုံးရန် |
| :--- | :--- |
| Login ဝင်မှ ဝင်ခွင့် | `auth` / `auth:sanctum` |
| Login ဝင်ပြီးသူကို Login page မပြ | `guest` |
| Email Verify လို | `verified` |
| Role တစ်ခု စစ် (ရိုးရှင်း) | `role:admin` Custom Middleware |
| Model တစ်ခုပေါ် (Own post ပြင်) | **Policy** + `can:update,post` |
| Model မဆိုင်သော Feature Access | **Gate** |
| Rate Limit | `throttle` |
| Partner API | `api.key` Custom Middleware |
| Mobile/SPA Token | **Sanctum** ([22](/laravel/22_sanctum_breeze_and_api_tokens_complete_guide/)) |
| Third-party OAuth2 | Passport |
| Admin/Customer Login သီးခြား | **Multi-Guard** |
| Dynamic Role/Permission | Spatie Permission |
| Request ကိုပြင်/Log/Header | Custom Middleware |
| Input ၏ Format စစ် | **FormRequest** ([24](/laravel/24_validation_form_requests_and_api_resources/)) |

### "Middleware, Policy, FormRequest authorize() - Authorization ကို ဘယ်မှာထားမလဲ?"
```
 Route Middleware   ► "ဤ Route ကို ဝင်ခွင့်ရှိလား" (Coarse: role/auth)
 Policy             ► "ဤ Resource ကို ကိုင်ခွင့်ရှိလား" (Fine: ownership)
 FormRequest        ► Policy ကို ခေါ်ရန် Shortcut + Validation နှင့်ပေါင်း
 Controller         ► အနည်းဆုံး (Business logic သာ)
```

---

## ၁၅။ Testing နှင့် လေ့ကျင့်ခန်း

### Testing
```php
use Laravel\Sanctum\Sanctum;

public function test_guest_gets_401(): void
{
    $this->getJson('/api/v1/orders')->assertUnauthorized();
}

public function test_staff_cannot_delete_user_403(): void
{
    $staff = User::factory()->create(['role' => 'staff']);
    $target = User::factory()->create();

    Sanctum::actingAs($staff, ['*']);
    $this->deleteJson("/api/v1/users/{$target->id}")->assertForbidden();
}

public function test_user_cannot_view_other_company_invoice(): void
{
    $a = User::factory()->create(['company_id' => 1]);
    $inv = Invoice::factory()->create(['company_id' => 2]);

    $this->actingAs($a)->get("/invoices/{$inv->id}")->assertForbidden();   // (404 ပြန်ထားလျှင် assertNotFound)
}

public function test_role_middleware(): void
{
    $this->actingAs(User::factory()->create(['role' => 'staff']))
         ->get('/admin')->assertForbidden();
    $this->actingAs(User::factory()->create(['role' => 'admin']))
         ->get('/admin')->assertOk();
}
```

### 🏋️ လေ့ကျင့်ခန်းများ

| # | လေ့ကျင့်ခန်း |
| :-: | :--- |
| 1 | `role:admin,manager` Middleware ရေး၍ Test ၃ ခု (guest/staff/admin) |
| 2 | `AddRequestId` Middleware ထည့်၍ Log တွင် `request_id` ပေါ်သည်ကို စစ် |
| 3 | `VerifyApiKey` ဖြင့် Partner Endpoint ကာကွယ်၊ Key ကို Hash သိမ်း |
| 4 | Admin/Customer **Multi-Guard** တည်ဆောက်၊ Login Session သီးခြားဖြစ်ကြောင်း Browser နှစ်ခုဖြင့်စစ် |
| 5 | `PostPolicy` ရေး (update=owner, delete=owner & ၂၄ နာရီ, admin=all) |
| 6 | `Invoice` IDOR ကို Policy နှင့် Scope နှစ်နည်းဖြင့် ကာကွယ်ပြီး Test |
| 7 | `Gate::before` ဖြင့် super_admin ကို အားလုံးခွင့်ပြုပြီး Audit Log ရေး |
| 8 | `spatie/laravel-permission` ဖြင့် Role UI (Role ကို Permission ချိတ်) လုပ် |
| 9 | Terminable Middleware ဖြင့် API Usage မှတ်၊ Queue သို့ပြောင်း |
| 10 | `throttle` ကို User တစ်ဦးချင်း (`RateLimiter::for`) ပြောင်း ([23](/laravel/23_api_management_beginner_to_professional/)) |

---

## 🎯 အနှစ်ချုပ်

```
 AuthN (Guard+Provider) ─► "ဘယ်သူလဲ" ─► 401
 AuthZ (Gate/Policy)    ─► "ခွင့်ရှိလား" ─► 403
 Middleware             ─► ထိုစစ်ဆေးချက်များကို Route များတွင် Reusable ဖြစ်စေသော "ကြားခံ"
```
