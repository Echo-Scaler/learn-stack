---
title: "22. Sanctum, Breeze & API Tokens - Complete Guide"
description: "Laravel Sanctum (SPA Cookie vs Mobile Token), Breeze Starter Kit, Token ရယူပုံ၊ Abilities, Expiration, Revoke, Multi-device, Passport/JWT နှင့် နှိုင်းယှဉ်ခြင်း၊ curl/Postman/Test ဥပမာများ"
---

> Laravel 11 / 12 အခြေခံ။ ကြိုတင်ဖတ်ရန်: [21. Middleware, Guards & Authorization](/laravel/21_middleware_guards_providers_and_authorization/)

## 🧭 မာတိကာ
1. API Authentication ဘာကြောင့်လိုလဲ၊ နည်းလမ်းများ နှိုင်းယှဉ်ခြင်း
2. Sanctum ဆိုတာဘာလဲ (၂ ပုံစံ)
3. Sanctum Install & Setup
4. **Token ရယူပုံ** (Register/Login/Token ထုတ်) - အပြည့်အစုံ
5. Token Abilities (Scopes)
6. Token Expiration, Revoke, Multi-device
7. SPA Cookie Authentication (React/Vue/Next.js)
8. Breeze ဆိုတာဘာလဲ၊ Stack ၅ မျိုး
9. Breeze API + Sanctum ဖြင့် Token ထုတ်ခြင်း
10. Security Best Practices
11. Testing
12. ပြဿနာဖြေရှင်းခြင်း
13. လေ့ကျင့်ခန်းများ

---

## ၁။ API Authentication ဘာကြောင့်လိုသလဲ?

API သည် Browser/Cookie မပါဘဲ ခေါ်နိုင်သောကြောင့် **"ဘယ်သူခေါ်နေသလဲ"** ကို Request တိုင်းတွင် သက်သေပြရမည်။

```
 Mobile App ──► POST /api/login  (email+password) ──► Server: Token ထုတ်ပေး
 Mobile App ──► GET /api/orders
                Authorization: Bearer 1|AbCdEf...   ──► Server: Token ကိုစစ် -> User မှတ်မိ
```

### နည်းလမ်းများ နှိုင်းယှဉ်

| နည်းလမ်း | ရိုးရှင်း | Revoke လွယ် | Scale | သင့်တော်ရာ |
| :--- | :-: | :-: | :-: | :--- |
| **Session Cookie** | ✅ | ✅ | Redis လို | Same-domain Web |
| **Sanctum Token** | ✅✅ | ✅✅ (DB) | ✅ | **Mobile, 1st-party SPA, Simple API (အကြံပြု)** |
| **Sanctum SPA Cookie** | ✅ | ✅ | ✅ | Same top-domain SPA |
| **Passport (OAuth2)** | ❌ ရှုပ် | ✅ | ✅ | Third-party App များကို Access ပေးလိုလျှင် ("Login with YourApp") |
| **JWT** (tymon/jwt-auth) | ✅ | ❌ ခက် (Stateless) | ✅✅ | Microservices (Revoke ခက်သောအားနည်းချက်) |
| **API Key** | ✅ | ✅ | ✅ | Server-to-Server Partner |

> 💡 **Rule of thumb:** First-party (ကိုယ့် Mobile/SPA) = **Sanctum**။ Third-party Developer များကို OAuth ပေးလိုလျှင် = **Passport**။ JWT ကို "Stateless ဖြစ်လို့ ကောင်းတယ်" ဟူသော အကြောင်းတစ်ခုတည်းနှင့် မရွေးပါနှင့် - Logout/Revoke အတွက် Blacklist ထပ်လိုသည်။

---

## ၂။ Sanctum ဆိုတာ ဘာလဲ?

**Laravel Sanctum** = ပေါ့ပါးသော Auth System။ **ပုံစံ ၂ မျိုး** ပါဝင်သည်-

### ပုံစံ A - API Tokens (Personal Access Tokens)
- Mobile App၊ 3rd-party Script၊ Postman အတွက်
- Login ဝင်လျှင် **Token String** ပေး -> Client က `Authorization: Bearer <token>` ဖြင့်ပို့
- DB `personal_access_tokens` Table တွင် **Hash (SHA-256)** သိမ်း

### ပုံစံ B - SPA Authentication (Cookie/Session)
- ကိုယ့် Frontend (React/Vue/Next) နှင့် Backend **Domain တူ** (`app.example.com` + `api.example.com`)
- Token မသုံး - Laravel ၏ Session Cookie (HttpOnly) သုံး -> **XSS ဖြင့် Token ခိုးခံရမှု မရှိ**
- CSRF Protection ပါ

### ဘယ်ပုံစံ ရွေးမလဲ

```
 Client က?
  ├─ Mobile App (iOS/Android/Flutter) ........... Token (A)
  ├─ Third-party Script / CLI / Postman ......... Token (A)
  ├─ SPA နှင့် API Same top-level domain ........ Cookie (B)  ◄─ XSS ပိုလုံခြုံ
  └─ SPA နှင့် API Domain မတူ ................... Token (A) (CORS ပါ ပြင်)
```

---

## ၃။ Sanctum Install & Setup (Laravel 11+)

```bash
php artisan install:api
```
ဤ Command တစ်ခုသည်-
1. `laravel/sanctum` Install
2. `routes/api.php` ဖန်တီး (Laravel 11 တွင် Default မပါ)
3. `personal_access_tokens` Migration Publish
4. `bootstrap/app.php` တွင် `api:` Route ထည့်

```bash
php artisan migrate
```

`app/Models/User.php`
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

`personal_access_tokens` Table:

| Column | ရည်ရွယ်ချက် |
| :--- | :--- |
| `tokenable_type/id` | ဘယ် User ပိုင် |
| `name` | Token အမည် ("iPhone 15", "CI script") |
| `token` | **SHA-256 Hash** (Plain မသိမ်း) |
| `abilities` | JSON - ခွင့်ပြုချက်များ |
| `last_used_at` | နောက်ဆုံးသုံးသည့်အချိန် |
| `expires_at` | သက်တမ်းကုန်ချိန် |

`routes/api.php`
```php
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('orders', OrderController::class);
});
```

---

## ၄။ Token ရယူပုံ - အပြည့်အစုံ

### ၄.၁ Token ထုတ်ပုံ အခြေခံ
```php
$token = $user->createToken('iphone-15');      // NewAccessToken object
$plain = $token->plainTextToken;               // "7|aB3dE...XyZ"  ← ဤတစ်ကြိမ်သာ မြင်ရ!
```
```
 "7|aB3dE9f..."
  │  └── Token Secret (Plain, DB တွင် Hash သာသိမ်း - ပြန်ကြည့်မရ)
  └── Token ID (personal_access_tokens.id) - Lookup မြန်စေရန်
```
> ⚠️ `plainTextToken` ကို **Response တွင် ပထမ ဆုံးနှင့် တစ်ခါတည်းသာ** ပြနိုင်သည်။ Client က သိမ်းထားရမည် (Mobile: Keychain/Keystore)။ ပျောက်လျှင် Token အသစ်ထုတ်ရမည်။

### ၄.၂ Register + Login Controller (Real-work)
```bash
php artisan make:controller Api/AuthController
php artisan make:request Auth/RegisterRequest
php artisan make:request Auth/LoginRequest
```

`app/Http/Requests/Auth/RegisterRequest.php`
```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100'],
            'email'       => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'confirmed', Password::min(8)->letters()->numbers()->uncompromised()],
            'device_name' => ['required', 'string', 'max:100'],
        ];
    }
}
```

`app/Http/Controllers/Api/AuthController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\{LoginRequest, RegisterRequest};
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Support\Facades\{Hash, RateLimiter};
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,       // User model casts 'hashed' ဖြင့် အလိုအလျောက် Hash
        ]);

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $user->createToken($request->device_name)->plainTextToken,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        // Email မရှိ/Password မှား ကို တူညီသော Message ဖြင့် (User enumeration ကာကွယ်)
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email သို့မဟုတ် Password မမှန်ကန်ပါ။'],
            ]);
        }

        // (Option) Device တစ်ခုတွင် Token တစ်ခုသာ ထားလိုလျှင် အဟောင်းကို ဖျက်
        $user->tokens()->where('name', $request->device_name)->delete();

        $token = $user->createToken(
            name: $request->device_name,
            abilities: $user->role === 'admin' ? ['*'] : ['orders:read', 'orders:create'],
            expiresAt: now()->addDays(30),
        );

        return response()->json([
            'user'       => new UserResource($user),
            'token'      => $token->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $token->accessToken->expires_at,
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();    // ဤ Device သာ Logout
        return response()->json(['message' => 'Logged out']);
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();                // Device အားလုံး Logout
        return response()->json(['message' => 'Logged out from all devices']);
    }
}
```

`LoginRequest` (Rate-limit ပါ)
```php
class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'       => ['required', 'email'],
            'password'    => ['required', 'string'],
            'device_name' => ['required', 'string', 'max:100'],
        ];
    }
}
```

### ၄.၃ Token ကို ဘယ်လို ရယူ/သုံးမလဲ - curl ဥပမာများ

**① Register**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"name":"Kyaw","email":"kyaw@example.com","password":"Passw0rd123","password_confirmation":"Passw0rd123","device_name":"curl"}'
```
Response (201):
```json
{
  "user": { "id": 1, "name": "Kyaw", "email": "kyaw@example.com" },
  "token": "1|Xk9Qm3...rT7pZ"
}
```

**② Login**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"email":"kyaw@example.com","password":"Passw0rd123","device_name":"iphone-15"}'
```

**③ Token ဖြင့် Protected API ခေါ်**
```bash
TOKEN="1|Xk9Qm3...rT7pZ"
curl http://localhost:8000/api/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

**④ Token မပါ / မှား -> 401**
```bash
curl -i http://localhost:8000/api/me -H "Accept: application/json"
# HTTP/1.1 401 Unauthorized   {"message":"Unauthenticated."}
```
> ⚠️ `Accept: application/json` မပါလျှင် Laravel က Login Page သို့ Redirect (302) ပေးတတ်သည်။ **API Client များသည် `Accept: application/json` အမြဲပို့ရမည်** (သို့) Server တွင် `ForceJson` Middleware ထည့်ပါ။

**⑤ Logout**
```bash
curl -X POST http://localhost:8000/api/logout -H "Accept: application/json" -H "Authorization: Bearer $TOKEN"
```

### ၄.၄ Postman ဖြင့်
1. `POST /api/login` -> Body (raw JSON)
2. Response မှ `token` ကို Copy
3. Collection -> Authorization Tab -> **Type: Bearer Token** -> Token ထည့်
4. (Auto) Login Request ၏ **Tests** Tab တွင်-
```javascript
pm.collectionVariables.set("token", pm.response.json().token);
```
Collection Auth တွင် `{{token}}` ထည့် - Login တစ်ကြိမ်ပြီးလျှင် Request အားလုံး Token ပါသွား။

### ၄.၅ Client Code ဥပမာ

**JavaScript (fetch / Axios)**
```javascript
// Login
const res = await fetch('https://api.example.com/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ email, password, device_name: 'web-admin' }),
});
const { token } = await res.json();
localStorage.setItem('token', token);    // ⚠️ SPA တွင် XSS အန္တရာယ် - Cookie (SPA mode) ပိုကောင်း

// Axios instance
const api = axios.create({ baseURL: 'https://api.example.com/api', headers: { Accept: 'application/json' } });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('token'); window.location = '/login'; }
  return Promise.reject(err);
});
```

**Flutter (Dart)**
```dart
final res = await http.post(Uri.parse('$base/login'),
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
  body: jsonEncode({'email': e, 'password': p, 'device_name': 'pixel-8'}));
final token = jsonDecode(res.body)['token'];
await const FlutterSecureStorage().write(key: 'token', value: token);   // Keychain/Keystore
```

**PHP (Laravel ကနေ အခြား Laravel API ခေါ်)**
```php
$response = Http::withToken($token)->acceptJson()->get('https://api.example.com/api/orders');
```

---

## ၅။ Token Abilities (Scopes)

Token တစ်ခုချင်းကို "ဘာလုပ်ခွင့်ရှိ" ကန့်သတ်နိုင်သည် - **Least Privilege**။

```php
// ထုတ်ချိန်
$token = $user->createToken('reporting-bot', ['orders:read', 'reports:read']);
$admin = $user->createToken('admin-cli', ['*']);                  // အားလုံး

// စစ်ချိန် (Controller)
if ($request->user()->tokenCan('orders:create')) { ... }
abort_unless($request->user()->tokenCan('orders:delete'), 403);

// Route Middleware
Route::get('/orders', ...)->middleware(['auth:sanctum', 'ability:orders:read,orders:manage']);   // တစ်ခုခုရှိ
Route::delete('/orders/{o}', ...)->middleware(['auth:sanctum', 'abilities:orders:read,orders:delete']); // အားလုံးရှိ
```
> Laravel 11 တွင် `abilities` / `ability` Middleware Alias ကို `bootstrap/app.php` တွင် ကိုယ်တိုင် Register လုပ်ရနိုင်သည်-
> ```php
> $middleware->alias([
>     'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
>     'ability'   => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
> ]);
> ```

### Ability Naming Convention
`resource:action` - `orders:read`, `orders:create`, `users:manage`, `reports:export`

### ⚠️ Ability ≠ Authorization (Policy အစားထိုးမရ)
- **Token Ability** = "ဤ Token (Client) သည် ဘာလုပ်ခွင့်ရှိ"
- **Policy** = "ဤ User သည် ဤ Resource ကို ကိုင်ခွင့်ရှိ"
နှစ်ခုလုံး ရမှ ဖြတ်သန်းနိုင်စေရမည်။

---

## ၆။ Token Expiration, Revoke, Multi-device

### Expiration
`config/sanctum.php`
```php
'expiration' => 60 * 24 * 30,        // မိနစ် (၃၀ ရက်) - null = ဘယ်တော့မှမကုန်
```
သို့မဟုတ် Token တစ်ခုချင်း - `createToken($name, $abilities, now()->addHours(2))`

သက်တမ်းကုန် Token ကို ရှင်းရန် (Scheduler):
```php
// routes/console.php
use Illuminate\Support\Facades\Schedule;
Schedule::command('sanctum:prune-expired --hours=24')->daily();
```

### Revoke
```php
$request->user()->currentAccessToken()->delete();      // ဤ Token
$request->user()->tokens()->delete();                  // အားလုံး (Password ပြောင်းသည့်အခါ)
$request->user()->tokens()->where('id', $tokenId)->delete();   // တစ်ခုရွေး
$request->user()->tokens()->where('name', 'old-device')->delete();
```

### "ကျွန်ုပ်၏ Device များ" စာမျက်နှာ (Real-work)
```php
public function sessions(Request $request)
{
    return $request->user()->tokens->map(fn ($t) => [
        'id'           => $t->id,
        'device'       => $t->name,
        'last_used_at' => $t->last_used_at,
        'expires_at'   => $t->expires_at,
        'current'      => $t->id === $request->user()->currentAccessToken()->id,
    ]);
}

public function revoke(Request $request, int $id)
{
    $request->user()->tokens()->whereKey($id)->delete();
    return response()->noContent();
}
```

### Password ပြောင်းလျှင် Token အားလုံး Revoke
```php
public function changePassword(ChangePasswordRequest $request)
{
    $user = $request->user();
    $user->update(['password' => $request->new_password]);

    // လက်ရှိ Device မှလွဲ၍ အားလုံး ထွက်ခိုင်း
    $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

    return response()->json(['message' => 'Password changed']);
}
```

### Refresh Token ပုံစံ (Sanctum တွင် Built-in မပါ)
Short-lived (၁ နာရီ) + Long-lived "refresh" Token ၂ ခုထုတ်၍ ကိုယ်တိုင်တည်ဆောက်နိုင်သည်-
```php
$access  = $user->createToken('access',  ['*'],              now()->addHour());
$refresh = $user->createToken('refresh', ['issue-access'],   now()->addDays(30));

Route::post('/refresh', function (Request $r) {
    abort_unless($r->user()->tokenCan('issue-access'), 403);
    $r->user()->currentAccessToken()->delete();
    return ['token' => $r->user()->createToken('access', ['*'], now()->addHour())->plainTextToken];
})->middleware(['auth:sanctum', 'ability:issue-access']);
```
> လွယ်ကူသည်ကို လိုလျှင် ၃၀ ရက် Token + Revoke စနစ်ဖြင့် လုံလောက်သည်။ ပိုမိုပြင်းထန်သော လိုအပ်ချက် (Bank) ဆိုလျှင် Passport/OAuth2 ကိုစဉ်းစားပါ။

---

## ၇။ SPA Cookie Authentication (React / Vue / Next.js)

**ကိုယ့် SPA နှင့် API သည် Top-level Domain တူလျှင်** (ဥပမာ `app.example.com` & `api.example.com`) Token မသုံးဘဲ Cookie သုံးပါ။

### Backend `.env`
```env
APP_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
SESSION_DRIVER=cookie        # သို့ redis/database
SESSION_DOMAIN=.example.com  # ← Subdomain များအကုန် Cookie မျှဝေ
SANCTUM_STATEFUL_DOMAINS=app.example.com
```
Local Dev: `SANCTUM_STATEFUL_DOMAINS=localhost:3000`, `SESSION_DOMAIN=localhost`

### `bootstrap/app.php`
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();       // EnsureFrontendRequestsAreStateful ကို api group တွင်ထည့်
})
```

### `config/cors.php`
```php
'paths' => ['api/*', 'login', 'logout', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL')],
'supports_credentials' => true,      // ← မဖြစ်မနေ
```

### Frontend Flow
```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true,             // ← Cookie ပို့ရန် မဖြစ်မနေ
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
});

// ① CSRF Cookie အရင်ယူ
await api.get('/sanctum/csrf-cookie');

// ② Login (Session Cookie ရ)
await api.post('/login', { email, password });

// ③ Protected API
const { data } = await api.get('/api/user');
```
```
 Browser ──GET /sanctum/csrf-cookie──► Server: XSRF-TOKEN cookie ပေး
 Browser ──POST /login (X-XSRF-TOKEN header)──► Server: laravel_session cookie ပေး (HttpOnly)
 Browser ──GET /api/user (cookies auto)──► Server: Session မှ User မှတ်မိ
```
`/login` Route သည် Breeze (API stack) မှ ပေးထားသော Route (`web.php` / `auth.php`) ဖြစ်သည်။

### Cookie vs Token ရွေးချယ်ပုံ
| | SPA Cookie | Token (localStorage) |
| :--- | :--- | :--- |
| XSS ဖြင့် ခိုးခံရနိုင် | ❌ (HttpOnly) | ✅ **ခိုးခံရနိုင်** |
| CSRF အန္တရာယ် | ရှိ (Sanctum ကာကွယ်ပေး) | မရှိ |
| Domain တူရမည် | ✅ | မလို |
| Mobile သုံးနိုင် | ❌ | ✅ |

---

## ၈။ Breeze ဆိုတာ ဘာလဲ?

**Laravel Breeze** = Authentication **Starter Kit** (Scaffolding)။ Login, Register, Forgot/Reset Password, Email Verification, Profile Edit, Logout ကို Controller/Route/View/Test အပြည့်အစုံ **ကိုယ့် Project ထဲသို့ Code ထုတ်ပေး**သည်။

> 🔑 Breeze သည် Package မဟုတ်ဘဲ **Code Generator** - ထုတ်ပေးပြီးနောက် Code သည် ကိုယ်ပိုင်ဖြစ်၍ လိုသလိုပြင်နိုင်သည်။ (Jetstream ထက် ရိုးရှင်း)

### Breeze Stack ၅ မျိုး
```bash
composer require laravel/breeze --dev
php artisan breeze:install        # Stack ရွေးခိုင်း
```

| Stack | Frontend | သင့်တော်ရာ |
| :--- | :--- | :--- |
| **Blade** | Blade + Alpine + Tailwind | Traditional Server-rendered |
| **Livewire** | Livewire (Volt) | JS မရေးလိုသူ |
| **React** (Inertia) | React + Inertia | SPA feel၊ Routing Laravel |
| **Vue** (Inertia) | Vue + Inertia | အထက်ပါအတူ |
| **API only** | Frontend မပါ | Next.js/Nuxt/Mobile ကို Backend သီးသန့် |

```bash
php artisan breeze:install blade
php artisan breeze:install api          # API Stack
php artisan breeze:install react --typescript --pest --dark
npm install && npm run dev
php artisan migrate
```

### Breeze မှ ထွက်လာသောဖိုင်များ (Blade stack)
```
app/Http/Controllers/Auth/*         # Login, Register, PasswordReset, EmailVerification...
app/Http/Requests/Auth/LoginRequest.php   # Rate-limit ပါ
routes/auth.php                     # Auth routes
resources/views/auth/*, layouts/*, components/*
tests/Feature/Auth/*                # Test အပြည့်
```

### Breeze vs Jetstream vs Fortify vs Sanctum - ရှုပ်ယှက်ခတ်မှုဖြေရှင်းခြင်း

| | ဘာလဲ | UI ပါ? | Token? |
| :--- | :--- | :-: | :-: |
| **Breeze** | Starter Kit (Login/Register UI+Logic) | ✅ | ❌ (Session) - API stack တွင် SPA cookie |
| **Jetstream** | Breeze ထက်ပြည့်စုံ (2FA, Teams, Profile photo, API tokens) | ✅ | ✅ (Sanctum ပါ) |
| **Fortify** | Backend-only Auth Logic (UI မပါ) | ❌ | ❌ |
| **Sanctum** | Token + SPA Auth **Package** | ❌ | ✅ |
| **Passport** | OAuth2 Server | ❌ | ✅ (OAuth) |

> ❗ **Breeze ကိုယ်တိုင်သည် "Token" မထုတ်ပေးပါ။** Web = Session Cookie။ API stack = SPA Cookie (Sanctum Stateful)။ **Mobile/Third-party အတွက် Token လိုလျှင် Sanctum ၏ `createToken()` ဖြင့် ကိုယ်တိုင် Endpoint ထပ်ထည့်ရသည်** (အပေါ် ၄ ကဲ့သို့)။

---

## ၉။ Breeze API + Sanctum ဖြင့် Token ထုတ်ခြင်း

### ၉.၁ Project အသစ်
```bash
laravel new shop-api && cd shop-api
composer require laravel/breeze --dev
php artisan breeze:install api
php artisan migrate
```
Breeze API stack သည် `routes/auth.php` တွင် Route များပေးသည်-
`POST /register`, `POST /login`, `POST /logout`, `POST /forgot-password`, `POST /reset-password`, `GET /verify-email/{id}/{hash}`...

### ၉.၂ Breeze Login သည် Session ဖြင့် - Mobile အတွက် Token Endpoint ထပ်ထည့်
`routes/api.php`
```php
use App\Http\Controllers\Api\TokenController;

Route::post('/tokens', [TokenController::class, 'store'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $r) => $r->user());
    Route::delete('/tokens/current', [TokenController::class, 'destroy']);
});
```
`app/Http/Controllers/Api/TokenController.php`
```php
class TokenController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'email'       => ['required', 'email'],
            'password'    => ['required'],
            'device_name' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['Credentials မမှန်ပါ။']]);
        }

        return ['token' => $user->createToken($data['device_name'])->plainTextToken];
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
```
- **Web/SPA** -> Breeze ၏ `/login` (Cookie)
- **Mobile/CLI** -> `/api/tokens` (Bearer Token)
`auth:sanctum` Guard သည် **နှစ်မျိုးလုံးကို** လက်ခံသည် (Cookie ရှိလျှင် Session၊ မရှိလျှင် Bearer Token)။

### ၉.၃ Guard ၏ အလုပ်လုပ်ပုံ (`auth:sanctum`)
```
 Request ──► Sanctum Guard
              ├─ Stateful domain ဖြစ်ပြီး Session Cookie ရှိလား? ──► Yes: Session User
              └─ Authorization: Bearer ... ရှိလား? ──► Hash(token) ကို DB တွင်ရှာ
                      ├─ ရှိ + သက်တမ်းမကုန် ──► tokenable User
                      └─ မရှိ ──► 401
```

### ၉.၄ Breeze Blade stack တွင် API Token စာမျက်နှာ ထည့် (Profile မှာ Token ဖန်တီး)
```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/profile/tokens', [ProfileTokenController::class, 'index'])->name('tokens.index');
    Route::post('/profile/tokens', [ProfileTokenController::class, 'store'])->name('tokens.store');
    Route::delete('/profile/tokens/{token}', [ProfileTokenController::class, 'destroy'])->name('tokens.destroy');
});
```
```php
class ProfileTokenController extends Controller
{
    public function index(Request $request)
    {
        return view('profile.tokens', ['tokens' => $request->user()->tokens]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => ['required', 'string', 'max:50'],
            'abilities' => ['array'],
            'abilities.*' => ['in:orders:read,orders:create,reports:read'],
        ]);

        $token = $request->user()->createToken($request->name, $request->abilities ?: ['orders:read']);

        // Plain token ကို Session flash ဖြင့် တစ်ကြိမ်သာပြ
        return back()->with('new_token', $token->plainTextToken);
    }

    public function destroy(Request $request, int $token)
    {
        $request->user()->tokens()->whereKey($token)->delete();
        return back();
    }
}
```
```blade
@if(session('new_token'))
    <x-alert type="success">
        ဤ Token ကို ယခု Copy ကူးသိမ်းပါ - နောက်ထပ် ပြန်မမြင်ရပါ။
        <code>{{ session('new_token') }}</code>
    </x-alert>
@endif
```
GitHub ၏ "Personal Access Token" စာမျက်နှာကဲ့သို့ ဖြစ်သည်။

---

## ၁၀။ Security Best Practices

| # | စည်းမျဉ်း | အကြောင်းရင်း |
| :-: | :--- | :--- |
| 1 | **HTTPS သာ** | Bearer Token သည် Password ကဲ့သို့ - Plain HTTP တွင် ခိုးခံရ |
| 2 | Login Endpoint တွင် `throttle` | Brute force |
| 3 | Login Error Message တူညီစေ | "Email မရှိ" / "Password မှား" ခွဲပြလျှင် User ရှိမရှိ သိသွား |
| 4 | Token သက်တမ်းထား (`expires_at`) | ပျောက်/ခိုးခံရလျှင် ထာဝရမသုံးနိုင်စေ |
| 5 | Ability ကန့်သတ် | Token ခိုးခံရလည်း ပျက်စီးမှုနည်း |
| 6 | Password ပြောင်းလျှင် Token Revoke | Account Recovery |
| 7 | Token ကို Log ထဲ မထည့် | `Authorization` Header ကို Masking |
| 8 | Mobile: Keychain/Keystore | SharedPreferences/AsyncStorage မသုံး |
| 9 | SPA: Cookie mode ရွေး (ဖြစ်နိုင်လျှင်) | XSS ဖြင့် localStorage Token ခိုး |
| 10 | `Accept: application/json` Force | 302 Redirect မဖြစ်စေ |
| 11 | `sanctum:prune-expired` Schedule | Table မကြီးစေ |
| 12 | Policy ထပ်စစ် (IDOR) | Token မှန်သော်လည်း သူများ Data မမြင်စေ |

```php
// Log မှ Authorization Header ဖျောက် (Monolog Processor သို့ Request Log Middleware တွင်)
$headers = collect($request->headers->all())->except(['authorization', 'cookie'])->all();
```

---

## ၁၁။ Testing

```php
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token(): void
    {
        $user = User::factory()->create(['password' => 'Passw0rd123']);

        $this->postJson('/api/login', [
            'email' => $user->email, 'password' => 'Passw0rd123', 'device_name' => 'phpunit',
        ])->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'email']]);
    }

    public function test_wrong_password_fails_with_422(): void
    {
        $user = User::factory()->create();
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'bad', 'device_name' => 'x'])
             ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_me_requires_token(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_me_with_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)->getJson('/api/me')->assertOk()->assertJsonPath('data.id', $user->id);
    }

    public function test_ability_enforced(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['orders:read']);
        $this->postJson('/api/orders', [])->assertForbidden();           // orders:create မရှိ
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_expired_token_rejected(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('t', ['*'], now()->subMinute())->plainTextToken;
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }
}
```

---

## ၁၂။ ပြဿနာ ဖြေရှင်းခြင်း

| လက္ခဏာ | အကြောင်းရင်း | ဖြေရှင်း |
| :--- | :--- | :--- |
| `401 Unauthenticated` (Token မှန်) | `Authorization: Bearer` Format မှား / "Bearer " Space မပါ | Header စစ် |
| 302 Redirect to /login | `Accept: application/json` မပါ | Header ထည့် / ForceJson |
| `Route [login] not defined` | API တွင် Unauthenticated Redirect ကြိုးစား | `redirectGuestsTo` / Accept header |
| SPA `419 CSRF token mismatch` | `/sanctum/csrf-cookie` မခေါ် / `withCredentials` မပါ | Flow စစ် |
| SPA `401` Cookie မပို့ | `SESSION_DOMAIN` / `SANCTUM_STATEFUL_DOMAINS` မှား | `.env` စစ် (Port ပါ) |
| CORS Error | `supports_credentials` false / Origin မှား | `config/cors.php` |
| `Call to undefined method createToken()` | `HasApiTokens` Trait မထည့် | User Model |
| Token သုံးရင် `tokenCan` အမြဲ false | Ability `[]` ဖြင့်ထုတ် | `['*']` သို့ အသေအချာသတ်မှတ် |
| Token ၂ ကြိမ် ဘာကြောင့် ဆက်ရ | Logout တွင် `tokens()->delete()` မလုပ် | `currentAccessToken()->delete()` |
| 401 Local တွင်မဟုတ် Production တွင်သာ | Reverse Proxy နောက်၌ HTTPS/Host Header | `trustProxies`, `APP_URL` |

---

## ၁၃။ လေ့ကျင့်ခန်းများ (Real-work)

| # | လေ့ကျင့်ခန်း |
| :-: | :--- |
| 1 | `install:api` ဖြင့် Register/Login/Me/Logout API ရေး၊ curl ဖြင့် Flow အပြည့်စမ်း |
| 2 | Postman Collection တွင် Login ၏ Tests Script ဖြင့် Token အလိုအလျောက်သိမ်းပါ |
| 3 | Device တစ်ခုချင်း Token + "My Devices" List/Revoke Endpoint ရေး |
| 4 | Ability: `orders:read` Token ဖြင့် POST လုပ်လျှင် 403 ရကြောင်း Test |
| 5 | Token သက်တမ်း ၂ နာရီ + Refresh Endpoint ရေး |
| 6 | Password ပြောင်းလျှင် အခြား Device Token များ ဖျက်ပါ |
| 7 | Breeze `api` stack + React/Next.js ဖြင့် SPA Cookie Login (CORS/CSRF) ဖြေရှင်း |
| 8 | Breeze Blade တွင် GitHub ပုံစံ "Personal Access Tokens" စာမျက်နှာရေး |
| 9 | Login ကို `RateLimiter::for('login', ...)` (Email+IP အလိုက်) ဖြင့် ကာကွယ် ([23](/laravel/23_api_management_beginner_to_professional/)) |
| 10 | Token + Policy ပေါင်း - Token Ability ရှိသော်လည်း သူများ Order ကြည့်လျှင် 403/404 Test |

နောက်သင်ခန်းစာ: [23. API Management - Beginner to Professional](/laravel/23_api_management_beginner_to_professional/)
