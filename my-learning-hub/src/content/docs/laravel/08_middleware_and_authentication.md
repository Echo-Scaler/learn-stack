---
title: "08. Middleware and Authentication"
description: "1. [Middleware ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ](#၁-middleware-ဆိုတာဘာလဲ)"
---

## 🔐 သင်ခန်းစာ (၈) - Middleware နှင့် Authentication / Authorization (လုံခြုံရေးစနစ်)
### (Lesson 8: Custom Middlewares, Authentication Systems, Gates & Policies)

---

## 📌 မာတိကာ (Contents)
1. [Middleware ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ](#၁-middleware-ဆိုတာဘာလဲ)
2. [Custom Middleware ဖန်တီးခြင်းနှင့် Register ပြုလုပ်ခြင်း](#၂-custom-middleware-ဖန်တီးခြင်းနှင့်-register-ပြုလုပ်ခြင်း)
3. [Middleware သို့ Parameters ပေးပို့ခြင်း (Dynamic Roles)](#၃-middleware-သို့-parameters-ပေးပို့ခြင်း)
4. [Session-based Authentication Flow (Manual Login & Logout)](#၄-session-based-authentication-flow)
5. [Laravel Breeze Starter Kit မိတ်ဆက် (ဘာကြောင့် သုံးရသလဲ?)](#၅-laravel-breeze-starter-kit-မိတ်ဆက်)
6. [Authorization: Gates နှင့် Policies ကွာခြားချက်နှင့် အသုံးချပုံ](#၆-authorization-gates-နှင့်-policies)

---

## ၁။ Middleware ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Middleware** ဆိုသည်မှာ HTTP Request တစ်ခုသည် Controller သို့ မရောက်မီ (သို့မဟုတ်) Response သည် Browser ဆီသို့ မထွက်ခွာမီ **ကြားဖြတ် စစ်ဆေးပေးသော လုံခြုံရေးတံခါးပေါက် (Filter Pipeline)** ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
အကယ်၍ Middleware မသုံးပါက Controller Method တိုင်း (ဥပမာ စာမျက်နှာ ၅၀ ရှိလျှင် ၅၀ စလုံး) တွင် `if(!auth()->check()) { return redirect('/login'); }` ဟု ထပ်ခါတလဲလဲ ရေးနေရမည်။ Middleware ဖြင့် Route အုပ်စုလိုက်ကို တစ်နေရာတည်းမှ ကာကွယ်ပေးနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Centralized Security**: Authentication, Admin Role စစ်ဆေးခြင်းများကို တစ်နေရာတည်းတွင် စီမံနိုင်သည်။
* **Early Rejection**: ခွင့်ပြုချက်မရှိသော Request များကို Controller သို့ မရောက်စေဘဲ ချက်ချင်း ပိတ်ပင်နိုင်သည်။

---

## ၂။ Custom Middleware ဖန်တီးခြင်းနှင့် Register ပြုလုပ်ခြင်း

ဥပမာ - User ၏ Role သည် Admin ဖြစ်မှသာ ဝင်ခွင့်ပြုမည့် Middleware:

```bash
php artisan make:middleware EnsureUserIsAdmin
```

### (က) Middleware ကုဒ် (`app/Http/Middleware/EnsureUserIsAdmin.php`):
```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 'admin') {
            abort(403, 'ဤစာမျက်နှာကို Admin များသာ ဝင်ရောက်ခွင့် ရှိပါသည်။');
        }

        return $next($request);
    }
}
```

### (ခ) Laravel 11 တွင် Alias မှတ်ပုံတင်ခြင်း (`bootstrap/app.php`):
```php
use App\Http\Middleware\EnsureUserIsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);
    })
    ->create();
```

### (ဂ) Route တွင် ချိတ်ဆက်ပုံ:
```php
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
});
```

---

## ၃။ Middleware သို့ Parameters ပေးပို့ခြင်း

```php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    if (! in_array($request->user()?->role, $roles)) {
        abort(403, 'Unauthorized action.');
    }
    return $next($request);
}

// routes/web.php တွင် သုံးစွဲပုံ:
Route::get('/reports', [ReportController::class, 'index'])->middleware('role:admin,manager');
```

---

## ၄။ Session-based Authentication Flow

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        // Auth::attempt က Database မှ password hash ကို auto စစ်ပေးသည်
        if (Auth::attempt($credentials, $remember)) {
            // Session Fixation Attack ကာကွယ်ရန် Session ID အသစ်ထုတ်ပေးခြင်း
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }

        return back()->withErrors(['email' => 'အချက်အလက် မှားယွင်းနေပါသည်။']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
```

---

## ၅။ Laravel Breeze Starter Kit မိတ်ဆက်

### (က) ဘာကြောင့် သုံးရသလဲ?
Login, Register, Password Reset, Email Verification စသည်တို့ကို အစမှ လက်ဖြင့်ရေးပါက ရက်သတ္တပတ်နှင့်ချီ ကြာမြင့်နိုင်သည်။ Laravel Breeze သည် အဆိုပါ Feature အားလုံးကို Tailwind CSS နှင့်အတူ စက္ကန့်ပိုင်းအတွင်း Scaffold လုပ်ပေးသည်။

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
npm install && npm run dev
```

---

## ၆။ Authorization: Gates နှင့် Policies

* **Authentication (Who are you?)**: User မည်သူဖြစ်ကြောင်း စစ်ဆေးခြင်း (Login)။
* **Authorization (What can you do?)**: User တွင် ဤအရာကို လုပ်ပိုင်ခွင့်ရှိမရှိ စစ်ဆေးခြင်း (Permissions)။

### (က) Gates (ရိုးရှင်းသော စစ်ဆေးချက်များ)
```php
// app/Providers/AppServiceProvider.php
Gate::define('view-pulse', function (User $user) {
    return $user->role === 'admin';
});
```

### (ခ) Policies (Model တစ်ခုချင်းစီအတွက် ခွင့်ပြုချက် စည်းမျဉ်းများ)
* **ဘာကြောင့် သုံးရသလဲ**: ပို့စ်တစ်ခုကို ပိုင်ရှင်ကိုယ်တိုင်သာ Edit/Delete လုပ်ခွင့်ပေးရန်။

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
// app/Policies/PostPolicy.php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

#### သုံးစွဲပုံ:
```php
// Controller တွင်:
public function edit(Post $post)
{
    $this->authorize('update', $post); // မကိုက်ညီပါက 403 Forbidden ပစ်ပေးသည်
    return view('posts.edit', compact($post));
}
```

```html
<!-- Blade Template တွင်: -->
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit Post</a>
@endcan
```
