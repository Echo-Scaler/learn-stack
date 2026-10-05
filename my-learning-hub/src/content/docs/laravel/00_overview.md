---
title: "Course Overview"
description: "1. [၁။ Laravel ဆိုတာဘာလဲနှင့် Request Lifecycle အလုပ်လုပ်ပုံ](#၁-laravel-ဆိုတာဘာလဲနှင့်-request-lifecycle-အလုပ်လုပ်ပုံ)"
---

## 🚀 Laravel Beginner to Master: လုပ်ငန်းခွင်လက်တွေ့သုံး အဆင့်ဆင့် လမ်းညွှန်
### (The Complete Real-World Laravel Developer Guide from Scratch to Advanced)

---

## 📌 မာတိကာ (Table of Contents)
1. [၁။ Laravel ဆိုတာဘာလဲနှင့် Request Lifecycle အလုပ်လုပ်ပုံ](#၁-laravel-ဆိုတာဘာလဲနှင့်-request-lifecycle-အလုပ်လုပ်ပုံ)
2. [၂။ Laravel Project စတင်တည်ဆောက်ခြင်းနှင့် Directory Structure](#၂-laravel-project-စတင်တည်ဆောက်ခြင်းနှင့်-directory-structure)
3. [၃။ Routing နှင့် Controller စနစ် (HTTP Request စီမံခန့်ခွဲမှု)](#၃-routing-နှင့်-controller-စနစ်-http-request-စီမံခန့်ခွဲမှု)
4. [၄။ Blade Template Engine (Frontend UI တည်ဆောက်ခြင်း)](#၄-blade-template-engine-frontend-ui-တည်ဆောက်ခြင်း)
5. [၅။ Database Migrations, Seeders နှင့် Factories](#၅-database-migrations-seeders-နှင့်-factories)
6. [၆။ Eloquent ORM နှင့် Query Builder (ဒေတာဘေ့စ် ကျွမ်းကျင်မှု)](#၆-eloquent-orm-နှင့်-query-builder-ဒေတာဘေ့စ်-ကျွမ်းကျင်မှု)
7. [၇။ Request Validation နှင့် Form Requests](#၇-request-validation-နှင့်-form-requests)
8. [၈။ Middleware နှင့် Authentication / Authorization (လုံခြုံရေးစနစ်)](#၈-middleware-နှင့်-authentication--authorization-လုံခြုံရေးစနစ်)
9. [၉။ File Uploads နှင့် Storage System](#၉-file-uploads-နှင့်-storage-system)
10. [၁၀။ RESTful API တည်ဆောက်ခြင်းနှင့် Laravel Sanctum](#၁၀-restful-api-တည်ဆောက်ခြင်းနှင့်-laravel-sanctum)
11. [၁၁။ Queues, Jobs, Events နှင့် Mail Notifications](#၁၁-queues-jobs-events-နှင့်-mail-notifications)
12. [၁၂။ လုပ်ငန်းခွင်တွင် အသုံးအများဆုံး Built-in Helper Functions & Facades](#၁၂-လုပ်ငန်းခွင်တွင်-အသုံးအများဆုံး-built-in-helper-functions--facades)
13. [၁၃။ Enterprise Design Pattern (Service Layer & Repository Pattern)](#၁၃-enterprise-design-pattern-service-layer--repository-pattern)
14. [၁၄။ Production Deployment နှင့် Performance Optimization](#၁၄-production-deployment-နှင့်-performance-optimization)

---

## 📚 သီးသန့် အခန်းလိုက် သင်ခန်းစာဖိုင်များ (Dedicated Lesson Files in `laravel_lessons/`)

အောက်ပါ ခေါင်းစဉ်တစ်ခုချင်းစီအတွက် အသေးစိတ် ရှင်းလင်းချက်များနှင့် လုပ်ငန်းခွင်သုံး Code များကို `laravel_lessons/` folder ထဲတွင် သီးသန့် `.md` ဖိုင်များဖြင့် လေ့လာနိုင်ပါသည်:

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက ရှင်းလင်းချက်များ |
| :---: | :--- | :--- | :--- |
| **01** | **Intro & Request Lifecycle** | [01_intro_and_request_lifecycle.md](/laravel/01_intro_and_request_lifecycle/) | Laravel ဆိုတာဘာလဲ၊ Architecture & Request Lifecycle အဆင့်ဆင့် Diagram |
| **02** | **Installation & Directory** | [02_installation_and_directory_structure.md](/laravel/02_installation_and_directory_structure/) | Setup ပြုလုပ်ခြင်း၊ Directory Structure တစ်ခုချင်း၏ တာဝန်၊ `.env` ဖိုင် |
| **03** | **Routing & Controllers** | [03_routing_and_controllers.md](/laravel/03_routing_and_controllers/) | Route Parameters, Resource Controllers, Route Model Binding |
| **04** | **Blade Template Engine** | [04_blade_template_engine.md](/laravel/04_blade_template_engine/) | Layouts, Components, Slots, Blade Directives, XSS Protection |
| **05** | **Migrations, Seeders & Factories** | [05_migrations_seeders_and_factories.md](/laravel/05_migrations_seeders_and_factories/) | Schema Design, Foreign Keys, Cascade Delete, Faker Dummy Data |
| **06** | **Eloquent ORM & Relationships** | [06_eloquent_orm_and_relationships.md](/laravel/06_eloquent_orm_and_relationships/) | CRUD, Relationships (1:1, 1:N, N:N), **N+1 Problem ကို Eager Loading ဖြင့် ဖြေရှင်းပုံ** |
| **07** | **Requests & Validation** | [07_requests_and_validation.md](/laravel/07_requests_and_validation/) | Form Requests, Validation Rules, မြန်မာလို Error Messages |
| **08** | **Middleware & Authentication** | [08_middleware_and_authentication.md](/laravel/08_middleware_and_authentication/) | Custom Middlewares, Session Auth, Laravel Breeze, Gates & Policies |
| **09** | **File Storage & Uploads** | [09_file_storage_and_uploads.md](/laravel/09_file_storage_and_uploads/) | Filesystem Disks, `storage:link`, ပုံဟောင်း auto ဖျက်ပြီး အသစ်တင်ပုံ |
| **10** | **RESTful API & Sanctum** | [10_restful_api_and_sanctum.md](/laravel/10_restful_api_and_sanctum/) | API Resources, Sanctum Bearer Token, JSON Response Standards |
| **11** | **Queues, Jobs & Mail** | [11_queues_jobs_and_mail.md](/laravel/11_queues_jobs_and_mail/) | Background Jobs (`ShouldQueue`), Queue Worker, Mailables, Events |
| **12** | **Helpers, Collections & Facades** | [12_most_used_helpers_and_facades.md](/laravel/12_most_used_helpers_and_facades/) | Collections Methods (`map`, `filter`, `pluck`), `Str`, `Arr`, Carbon Date |
| **13** | **Service Layer & DB Transactions** | [13_service_repository_pattern.md](/laravel/13_service_repository_pattern/) | Fat Controllers ရှင်းထုတ်ခြင်း၊ Clean Service Layer, Database Transactions |
| **14** | **Production & Security** | [14_production_optimization_and_security.md](/laravel/14_production_optimization_and_security/) | `optimize`, `config:cache`, Rate Limiting, `.env` Security Hardening |
| **15** | **Advanced Mail & Notifications** | [15_advanced_mail_and_notifications.md](/laravel/15_advanced_mail_and_notifications/) | Markdown Mailables, Attachments, Queued Mail, Multi-Channel Notifications (Mail, DB, SMS) |
| **16** | **Redis Mastery & Caching** | [16_redis_mastery_and_caching.md](/laravel/16_redis_mastery_and_caching/) | Redis In-memory Cache, Cache Tags, Shared Sessions, Horizon Queues, Atomic Locks (`Cache::lock`) |
| **17** | **AWS Cloud Integration** | [17_aws_cloud_integration.md](/laravel/17_aws_cloud_integration/) | AWS S3 Public/Private Media, Pre-signed Temporary URLs, AWS SES Bulk Mail, SQS Queues, CloudFront CDN |
| **18** | **Task Scheduling & WebSockets** | [18_task_scheduling_and_realtime.md](/laravel/18_task_scheduling_and_realtime/) | Laravel Task Scheduling (Cron Jobs), `withoutOverlapping()`, Real-time WebSockets, Laravel Reverb |
| **19** | **🛡️⚡ Security & Performance Mastery** | [19_security_and_performance_mastery.md](/laravel/19_security_and_performance_mastery/) | SQLi, XSS, CSRF, Mass Assignment, N+1 Query Problem, Indexing, Caching, Chunking & Production Optimization |

---

## ၁။ Laravel ဆိုတာဘာလဲနှင့် Request Lifecycle အလုပ်လုပ်ပုံ

### (က) Laravel ဆိုတာဘာလဲ?
**Laravel** သည် PHP ဖြင့် တည်ဆောက်ထားသော ကမ္ဘာ့လူကြိုက်အများဆုံးနှင့် စွမ်းဆောင်ရည်အမြင့်ဆုံး **Full-Stack Web Application Framework** တစ်ခု ဖြစ်ပါသည်။ Taylor Otwell က ဖန်တီးခဲ့ပြီး "Web Developers များအတွက် ရေးရတာ ပျော်ရွှင်စေသော Framework (The PHP Framework for Web Artisans)" ဟု လူသိများသည်။

#### ဘာကြောင့် Laravel ကို ရွေးချယ်သင့်သလဲ?
* **Clean & Elegant Syntax**: ကုဒ်ရေးသားရသည်မှာ အင်္ဂလိပ်စကားပြောဖတ်ရသကဲ့သို့ ရှင်းလင်းသည်။
* **MVC Pattern Support**: Code များကို စနစ်တကျ အပိုင်းခွဲထားနိုင်သောကြောင့် Maintenance လုပ်ရလွယ်ကူသည်။
* **ကြွယ်ဝသော Built-in Features**: Authentication, Database Migration, Eloquent ORM, Routing, Queue, Caching စသည့် ခက်ခဲသော စနစ်များကို Framework က အသင့်ထည့်သွင်းပေးထားသည်။
* **ကြီးမားသော Community & Ecosystem**: မည်သည့် error မဆို ဖြေရှင်းနည်းရှာရလွယ်ကူပြီး Package ပေါင်းများစွာ အသင့်ရှိသည်။

---

### (ခ) Request Lifecycle အလုပ်လုပ်ပုံ (ဘယ်လို အလုပ်လုပ်သလဲ?)
Browser တစ်ခုမှ ခလုတ်နှိပ်လိုက်သည်မှ စာမျက်နှာပေါ်လာသည်အထိ Laravel နောက်ကွယ်တွင် အောက်ပါအဆင့်အတိုင်း အလုပ်လုပ်သွားပါသည်:

```
[User Browser / Client]
         │ (1) HTTP Request (e.g. GET /products)
         ▼
[public/index.php]  ◄── Application ရဲ့ တစ်ခုတည်းသော ဝင်ပေါက် (Entry Point)
         │ (2) Autoloading & Bootstrap
         ▼
[HTTP Kernel / Bootstrap (bootstrap/app.php)]
         │ • Service Providers များ Boot တက်ခြင်း
         │ • Global Middlewares များ စစ်ဆေးခြင်း
         ▼
[Routing Engine (routes/web.php or routes/api.php)]
         │ (3) လာသော URL နှင့် ကိုက်ညီသည့် Route ကို ရှာသည်
         ▼
[Route Middleware Pipeline]
         │ • Authentication စစ်ဆေးခြင်း (User Login ဝင်ထားသလား)
         │ • CSRF Token စစ်ဆေးခြင်း (လုံခြုံစိတ်ချရသလား)
         ▼
[Controller (e.g. ProductController@index)]
         │ (4) Business Logic ကို စတင်ကိုင်တွယ်သည်
         ▼
[Model & Database (Eloquent ORM)]
         │ (5) Database ထံမှ Data ကို ဆွဲထုတ်သည်
         ▼
[View (Blade Template) / JSON API Response]
         │ (6) ရလဒ်ကို HTML သို့မဟုတ် JSON အဖြစ် ပြန်ထုတ်သည်
         ▼
[HTTP Response Back to Browser]
```

---

## ၂။ Laravel Project စတင်တည်ဆောက်ခြင်းနှင့် Directory Structure

### (က) Installation & Setup
Laravel ကို အသုံးပြုရန် ကွန်ပျူတာတွင် **PHP (version 8.2+)** နှင့် **Composer** ရှိရန် လိုအပ်ပါသည်။

```bash
# Composer ဖြင့် Laravel Project အသစ် ဆောက်ခြင်း
composer create-project laravel/laravel my-project

# Project Folder ထဲသို့ ဝင်ရောက်ခြင်း
cd my-project

# Development Server run ခြင်း
php artisan serve
```
Browser တွင် `http://127.0.0.1:8000` သို့ သွားရောက်ကြည့်ရှုပါက Laravel Welcome Page ကို တွေ့ရမည်ဖြစ်ပါသည်။

---

### (ခ) အရေးကြီးသော Directory Structure ရှင်းလင်းချက်
| Folder လမ်းကြောင်း | တာဝန်နှင့် အဓိပ္ပာယ် |
| :--- | :--- |
| `app/Http/Controllers/` | Web Request များကို လက်ခံပြီး Data များ ချိတ်ဆက်စီမံပေးသော Controller များ ထားရှိရာနေရာ။ |
| `app/Models/` | Database Table များနှင့် တိုက်ရိုက်ချိတ်ဆက်ထားသော Eloquent Models များ ရှိသည့်နေရာ။ |
| `app/Http/Middleware/` | Request မရောက်မီနှင့် Response မထွက်မီ ကြားဖြတ်စစ်ဆေးပေးသည့် Logic များ။ |
| `config/` | Application တစ်ခုလုံး၏ Configuration ဖိုင်များ (Database, Cache, Mail, App settings)။ |
| `database/migrations/` | Database Table များ ဖန်တီး/ပြင်ဆင်ရန် ဇယားဒီဇိုင်းကုဒ်များ။ |
| `database/seeders/` | Testing သို့မဟုတ် Initial Data အဖြစ် Database ထဲ Data အစမ်းထည့်ပေးသောဖိုင်များ။ |
| `resources/views/` | အသုံးပြုသူ မြင်တွေ့ရမည့် Blade HTML Templates များ။ |
| `routes/` | Application ၏ URL လမ်းကြောင်းများ သတ်မှတ်ရာဖိုင်များ (`web.php`, `api.php`, `console.php`)။ |
| `storage/` | အသုံးပြုသူတင်လိုက်သော ဖိုင်များ၊ Log ဖိုင်များ၊ Compiled Cache ဖိုင်များ သိမ်းရာနေရာ။ |
| `.env` | Database Password, App Key, Mail Server စသည့် လျှို့ဝှက်ချက် Config များ ထားရှိရာဖိုင်။ |

---

## ၃။ Routing နှင့် Controller စနစ် (HTTP Request စီမံခန့်ခွဲမှု)

### (က) Basic Routing & Route Parameters
Routes များကို `routes/web.php` (Website များအတွက်) သို့မဟုတ် `routes/api.php` (Mobile/Frontend API အတွက်) တွင် ရေးရသည်။

```php
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// ၁။ အခြေခံ GET Route
Route::get('/welcome', function () {
    return 'Welcome to Laravel Myanmar Course!';
});

// ၂။ Dynamic Parameter ပါဝင်သော Route (ID ဖမ်းယူခြင်း)
Route::get('/users/{id}', function ($id) {
    return "User ID: " . $id;
});

// ၃။ Optional Parameter (မထည့်လဲ ရသည်)
Route::get('/posts/{slug?}', function ($slug = 'latest') {
    return "Reading post: " . $slug;
});

// ၄။ Named Route (URL ပြောင်းသွားရင်တောင် ကုဒ်မပျက်စေရန် အမည်ပေးခြင်း)
Route::get('/contact-us', function () {
    return view('contact');
})->name('contact.page');

// သုံးစွဲပုံ: route('contact.page')
```

---

### (ခ) Route Groups, Prefixes နှင့် Middleware Grouping
လက်တွေ့လုပ်ငန်းခွင်တွင် Admin Dashboard သို့မဟုတ် အပိုင်းလိုက် ခွဲခြားရန် Route Group ကို အသုံးများဆုံး ဖြစ်ပါသည်:

```php
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // URL: /admin/dashboard, Name: admin.dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // URL: /admin/products, Name: admin.products.index
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
});
```

---

### (ဂ) Controllers ရေးသားခြင်း
Controller ဖန်တီးရန် Artisan command ကို အသုံးပြုပါသည်:

```bash
# Basic Controller ဖန်တီးခြင်း
php artisan make:controller ProductController

# CRUD အစုံပါသော Resource Controller ဖန်တီးခြင်း
php artisan make:controller ProductController --resource
```

#### Controller ကုဒ်နမူနာ (`app/Http/Controllers/ProductController.php`):
```php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ပစ္စည်းအားလုံး ပြသခြင်း
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return view('products.index', compact('products'));
    }

    // ပစ္စည်းတစ်ခုချင်းစီ ပြသခြင်း (Implicit Route Model Binding)
    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    // အသစ်ဖန်တီးခြင်း Form
    public function create()
    {
        return view('products.create');
    }

    // ဒေတာ သိမ်းဆည်းခြင်း
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
                         ->with('success', 'ပစ္စည်း အသစ် ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!');
    }
}
```

---

## ၄။ Blade Template Engine (Frontend UI တည်ဆောက်ခြင်း)

Blade သည် Laravel ၏ အလွန်မြန်ဆန်ပေါ့ပါးသော Templating Engine ဖြစ်သည်။ `.blade.php` ဖြင့် အဆုံးသတ်ရသည်။

### (က) Layout Inheritance (`@extends`, `@section`, `@yield`)
Parent Layout တစ်ခု ဆောက်ထားပြီး Child Page တိုင်းမှ ၎င်းကို ထပ်ခါတလဲလဲ အသုံးပြုနိုင်သည်။

#### Master Layout (`resources/views/layouts/app.blade.php`):
```html
<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'My Laravel App')</title>
</head>
<body>
    <nav>
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('products.index') }}">Products</a>
    </nav>

    <main class="container">
        {{-- Flash message ပြသခြင်း --}}
        @if(session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif

        {{-- Child content ထည့်သွင်းရာနေရာ --}}
        @yield('content')
    </main>
</body>
</html>
```

#### Child View (`resources/views/products/index.blade.php`):
```html
@extends('layouts.app')

@section('title', 'ပစ္စည်းများ စာရင်း')

@section('content')
    <h1>Products Catalog</h1>

    <div class="product-grid">
        @forelse($products as $product)
            <div class="card">
                <h3>{{ $product->name }}</h3>
                <p>ဈေးနှုန်း: {{ number_format($product->price) }} MMK</p>
                <a href="{{ route('products.show', $product->id) }}">အသေးစိတ်ကြည့်ရန်</a>
            </div>
        @empty
            <p>လက်ရှိတွင် ပစ္စည်းများ မရှိသေးပါ။</p>
        @endforelse
    </div>

    {{-- Pagination Links --}}
    {{ $products->links() }}
@endsection
```

### (ခ) မဖြစ်မနေ သိထားရမည့် Blade Directives များ
* `@csrf` : POST/PUT Form တိုင်းတွင် လုံခြုံရေး Token အဖြစ် မဖြစ်မနေ ထည့်ပေးရသည်။
* `@method('PUT')` သို့မဟုတ် `@method('DELETE')` : HTML form များတွင် PUT/DELETE method သုံးလိုသောအခါ။
* `@auth` ... `@else` ... `@endauth` : Login ဝင်ထားသူနှင့် မဝင်ထားသူ ခွဲပြခြင်း။
* `{{ $name }}` : XSS Attack မှ ကာကွယ်ပြီးသား Escaped HTML (Safe)။
* `{!! $htmlContent !!}` : Raw HTML ကို parse လုပ်ပြလိုသောအခါ (သတိထား သုံးရမည်)။

---

## ၅။ Database Migrations, Seeders နှင့် Factories

Database GUI (phpMyAdmin/DBeaver) ထဲတွင် ဇယားများ လက်ဖြင့်ဆောက်မည့်အစား ကုဒ်ဖြင့် Version Control ပြုလုပ်ခြင်းကို **Migration** ဟုခေါ်သည်။

### (က) Migration ဖန်တီးခြင်းနှင့် Schema သတ်မှတ်ခြင်း
```bash
# Model နှင့်အတူ Migration ပါ တစ်ပြိုင်နက် ဆောက်ခြင်း
php artisan make:model Category -m
```

#### Migration ဖိုင်နမူနာ (`database/migrations/xxxx_create_categories_table.php`):
```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Auto-increment BIGINT Primary Key
            $table->string('name')->unique();
            $table->string('slug')->index();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

#### Foreign Key Relationship ရေးသားပုံ:
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    // categories table ၏ id နှင့် ချိတ်ဆက်ခြင်း (Cascading Delete ပါဝင်သည်)
    $table->foreignId('category_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->decimal('price', 12, 2);
    $table->timestamps();
});
```

#### မကြာခဏသုံးသော Artisan Migration Commands:
```bash
php artisan migrate               # ရေးထားသော migration များကို run ခြင်း
php artisan migrate:rollback      # နောက်ဆုံး run ခဲ့သော batch ကို ပြန်ဖျက်ခြင်း
php artisan migrate:fresh --seed  # Table အားလုံးကို အစမှပြန်ဆောက်ပြီး Data အစမ်းသွင်းခြင်း
```

---

### (ခ) Factories & Seeders (Fake Data ထည့်သွင်းခြင်း)
စနစ်ကို စမ်းသပ်ရန် ဒေတာ ၁၀၀/၁၀၀၀ ကို စက္ကန့်ပိုင်းအတွင်း ဖန်တီးနိုင်ပါသည်။

```bash
php artisan make:factory ProductFactory
```

```php
// database/factories/ProductFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => 1,
            'title'       => fake()->sentence(3),
            'price'       => fake()->numberBetween(1000, 50000),
        ];
    }
}
```

```php
// database/seeders/DatabaseSeeder.php
public function run(): void
{
    // Product အစမ်း အခု ၅၀ ထည့်သွင်းမည်
    \App\Models\Product::factory(50)->create();
}
```

---

## ၆။ Eloquent ORM နှင့် Query Builder (ဒေတာဘေ့စ် ကျွမ်းကျင်မှု)

Eloquent သည် Database Table တစ်ခုချင်းစီကို PHP Class (Model) တစ်ခုအဖြစ် သတ်မှတ်ကာ Object-Oriented ပုံစံဖြင့် Database ကို အလွယ်တကူ စီမံနိုင်သော စနစ်ဖြစ်သည်။

### (က) Eloquent Model အခြေခံ Setting
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes; // Data မပျက်ဘဲ deleted_at ထည့်ပေးသောစနစ်

    // Mass Assignment ကာကွယ်ရန် (ဖြည့်ခွင့်ပြုသော field များ)
    protected $fillable = [
        'category_id',
        'title',
        'price',
        'is_featured'
    ];

    // Data Type များကို အလိုအလျောက် ပြောင်းပေးခြင်း
    protected $casts = [
        'price'       => 'decimal:2',
        'is_featured' => 'boolean',
    ];
}
```

---

### (ခ) လုပ်ငန်းခွင်သုံး CRUD Queries များ
```php
// ၁။ အသစ်ထည့်ခြင်း (Create)
$product = Product::create([
    'category_id' => 1,
    'title'       => 'MacBook Pro M3',
    'price'       => 4500000,
]);

// ၂။ ရှာဖွေခြင်း (Read / Retrieve)
$product = Product::findOrFail($id); // မရှိရင် 404 page အလိုအလျောက်ပြသည်
$activeProducts = Product::where('price', '>', 10000)
                         ->where('is_featured', true)
                         ->orderBy('created_at', 'desc')
                         ->get();

// ၃။ ပြင်ဆင်ခြင်း (Update)
$product = Product::findOrFail($id);
$product->update([
    'price' => 4200000
]);

// ၄။ ဖျက်ခြင်း (Delete)
$product = Product::findOrFail($id);
$product->delete(); // Soft delete ဖြစ်သွားမည်
```

---

### (ဂ) Eloquent Relationships (ဇယားများ ဆက်သွယ်ခြင်း)
ဒေတာဘေ့စ် ရေးဆွဲရာတွင် ဆက်သွယ်မှု (Relationships) များကို Eloquent တွင် ရှင်းလင်းစွာ ရေးသားနိုင်သည်:

#### ၁။ One-to-Many (Category တစ်ခုတွင် Products များစွာရှိသည်)
```php
// app/Models/Category.php
public function products()
{
    return $this->hasMany(Product::class);
}

// app/Models/Product.php
public function category()
{
    return $this->belongsTo(Category::class);
}
```

#### ၂။ Many-to-Many (Order တစ်ခုတွင် Items များစွာပါပြီး Item တစ်ခုသည် Orders များစွာတွင် ပါနိုင်သည်)
```php
// app/Models/Order.php
public function products()
{
    return $this->belongsToMany(Product::class, 'order_items')
                ->withPivot('quantity', 'unit_price')
                ->withTimestamps();
}
```

---

### (ဃ) Eager Loading ဖြင့် N+1 Query Problem ကို ဖြေရှင်းခြင်း (အရေးကြီးဆုံး အချက်)
မကြာခဏ ဖြစ်တတ်သော အမှားမှာ Loop ပတ်ပြီး Relationship ကို ခေါ်မိခြင်း (N+1 Problem) ဖြစ်ပြီး Server ကို လေးလံစေသည်။

```php
// ❌ မကောင်းသော နည်းလမ်း (Queries ၁၀၁ ကြိမ် run ရသည်)
$products = Product::all(); // Query 1 ခု
foreach ($products as $product) {
    echo $product->category->name; // Loop တိုင်းအတွက် Query 1 ခုစီ ထပ်ခေါ်နေသည်
}

// ✅ မှန်ကန်သော လုပ်ငန်းခွင်နည်းလမ်း (Eager Loading - Queries ၂ ကြိမ်သာ run သည်)
$products = Product::with('category')->get();
foreach ($products as $product) {
    echo $product->category->name; // Memory ထဲမှ တိုက်ရိုက်ယူသုံးသည်
}
```

---

## ၇။ Request Validation နှင့် Form Requests

အသုံးပြုသူထံမှ လာသော Data မှန်ကန်မှု ရှိ/မရှိ စစ်ဆေးခြင်းသည် လုံခြုံရေးအတွက် မရှိမဖြစ် လိုအပ်ပါသည်။

### (က) Dedicated Form Request အသုံးပြုခြင်း (Best Practice)
Controller ထဲတွင် Validation ကုဒ်များ ပြည့်ကျပ်မနေစေရန် သီးသန့် Request Class ဖန်တီးပါ:

```bash
php artisan make:request StoreProductRequest
```

#### Request File (`app/Http/Requests/StoreProductRequest.php`):
```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    // ခွင့်ပြုချက် စစ်ဆေးခြင်း
    public function authorize(): bool
    {
        return true; // လောလောဆယ် အားလုံးကို ခွင့်ပြုမည်
    }

    // စည်းကမ်းသတ်မှတ်ချက်များ (Validation Rules)
    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title'       => 'required|string|min:3|max:255',
            'price'       => 'required|numeric|min:100',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB Max
        ];
    }

    // မြန်မာလို Error Messages များ သတ်မှတ်ခြင်း
    public function messages(): array
    {
        return [
            'category_id.required' => 'အမျိုးအစား ရွေးချယ်ပေးရန် လိုအပ်ပါသည်။',
            'category_id.exists'   => 'ရွေးချယ်ထားသော အမျိုးအစား မရှိပါ။',
            'title.required'       => 'ပစ္စည်းအမည် ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။',
            'price.min'            => 'ဈေးနှုန်းသည် အနည်းဆုံး ၁၀၀ ကျပ် ရှိရပါမည်။',
            'image.max'            => 'ပုံအရွယ်အစားသည် 2MB ထက် မကျော်ရပါ။',
        ];
    }
}
```

#### Controller တွင် သုံးစွဲပုံ:
```php
public function store(StoreProductRequest $request)
{
    // FormRequest က အလိုအလျောက် validate စစ်ပြီးမှ ဒီနေရာရောက်လာပါသည်
    $validatedData = $request->validated();

    Product::create($validatedData);

    return redirect()->route('products.index')->with('success', 'အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!');
}
```

---

## ၈။ Middleware နှင့် Authentication / Authorization (လုံခြုံရေးစနစ်)

### (က) Custom Middleware ဖန်တီးခြင်း
ဥပမာ - Admin ဖြစ်မှသာ စာမျက်နှာကို ဝင်ခွင့်ပေးမည့် Middleware ဖန်တီးခြင်း:

```bash
php artisan make:middleware EnsureUserIsAdmin
```

```php
// app/Http/Middleware/EnsureUserIsAdmin.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // အကယ်၍ User Login မဝင်ထားပါက သို့မဟုတ် role သည် admin မဟုတ်ပါက
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'ဤစာမျက်နှာကို ဝင်ရောက်ခွင့် မရှိပါ။ (Unauthorized Action)');
        }

        return $next($request);
    }
}
```

---

### (ခ) Gates နှင့် Policies (ခွင့်ပြုချက် အဆင့်ဆင့် စီမံခြင်း)
* **Gates**: ရိုးရှင်းသော Action များ စစ်ဆေးရန် (ဥပမာ- Super Admin စစ်ဆေးခြင်း)။
* **Policies**: သက်ဆိုင်ရာ Model တစ်ခုချင်းစီ (ဥပမာ- ပို့စ်တစ်ခုကို ပိုင်ရှင်ကိုယ်တိုင်သာ ဖျက်ခွင့်ပေးခြင်း)။

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
// app/Policies/PostPolicy.php
public function update(User $user, Post $post): bool
{
    // Post ရေးတင်ခဲ့သူ User ID နှင့် လက်ရှိ login ဝင်ထားသူ ID တူမှသာ Edit ခွင့်ပေးမည်
    return $user->id === $post->user_id;
}
```

#### Controller နှင့် Blade တွင် စစ်ဆေးပုံ:
```php
// Controller တွင်
$this->authorize('update', $post); // မကိုက်ညီပါက 403 Forbidden ဖြစ်သွားမည်

// Blade Template တွင်
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit Post</a>
@endcan
```

---

## ၉။ File Uploads နှင့် Storage System

Laravel တွင် ဖိုင်တင်ခြင်း (File Uploads) ကို Local Storage, Public Storage သို့မဟုတ် Amazon S3 သို့ လွယ်ကူစွာ သိမ်းဆည်းနိုင်ပါသည်။

### (က) Symbolic Link ဆောက်ခြင်း
Web Browser မှ ပုံများကို တိုက်ရိုက် ကြည့်ရှုနိုင်စေရန် Storage Link ချိတ်ပေးရသည်:
```bash
php artisan storage:link
```

### (ခ) ပုံ upload တင်ခြင်းနှင့် သိမ်းဆည်းခြင်း
```php
public function uploadAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|mimes:jpeg,png,webp|max:2048',
    ]);

    if ($request->hasFile('avatar')) {
        // storage/app/public/avatars ထဲသို့ သိမ်းဆည်းပြီး Path ကို ယူမည်
        $path = $request->file('avatar')->store('avatars', 'public');

        // Database ထဲသို့ path သိမ်းမည် (e.g. avatars/xyz123.jpg)
        auth()->user()->update(['avatar' => $path]);
    }

    return back()->with('success', 'Profile ပုံ ပြောင်းလဲပြီးပါပြီ!');
}
```

#### Blade တွင် ပုံပြန်ပြသပုံ:
```html
<img src="{{ asset('storage/' . auth()->user()->avatar) }}" alt="Avatar" width="100">
```

---

## ၁၀။ RESTful API တည်ဆောက်ခြင်းနှင့် Laravel Sanctum

Frontend Framework များ (React, Vue, Flutter, iOS/Android) နှင့် ဆက်သွယ်ရန် API တည်ဆောက်နည်း။

### (က) API Resources (JSON Format စနစ်တကျ ပြုပြင်ခြင်း)
Database Model မှ Data အားလုံးကို တိုက်ရိုက်မပြဘဲ လိုအပ်သော Field သာ ရွေးထုတ်ပေးခြင်း။

```bash
php artisan make:resource ProductResource
```

```php
// app/Http/Resources/ProductResource.php
public function toArray(Request $request): array
{
    return [
        'id'          => $this->id,
        'title'       => $this->title,
        'price'       => (float) $this->price,
        'formatted_price' => number_format($this->price) . ' MMK',
        'category'    => $this->category ? $this->category->name : null,
        'created_at'  => $this->created_at->format('Y-m-d H:i:s'),
    ];
}
```

### (ခ) API Controller နမူနာ
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ApiProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with('category')->paginate(15);

        return response()->json([
            'status'  => 'success',
            'message' => 'Products fetched successfully',
            'data'    => ProductResource::collection($products),
        ], 200);
    }
}
```

### (ဂ) Laravel Sanctum ဖြင့် Token Authentication စနစ်
```php
// Login API (routes/api.php)
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'အချက်အလက် မှားယွင်းနေပါသည်'], 401);
    }

    // Bearer Token ဖန်တီးပေးခြင်း
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => $user,
    ]);
});

// Protect လုပ်ထားသော API Routes
Route::middleware('auth:sanctum')->get('/user-profile', function (Request $request) {
    return $request->user();
});
```

---

## ၁၁။ Queues, Jobs, Events နှင့် Mail Notifications

User အားလုံးထံ Email ပို့ခြင်း၊ PDF Report ထုတ်ခြင်း စသည့် အချိန်ကြာမြင့်သော အလုပ်များကို Background တွင် run ရန် Queue စနစ်ကို သုံးသည်။

### (က) Queue Job ဖန်တီးခြင်း
```bash
php artisan make:job SendWelcomeEmailJob
```

```php
// app/Jobs/SendWelcomeEmailJob.php
namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function handle(): void
    {
        // အချိန် ၁၀ စက္ကန့်ခန့် ကြာမည့် Email ပို့ခြင်းကို Background တွင် လုပ်ဆောင်မည်
        Mail::to($this->user->email)->send(new WelcomeEmail($this->user));
    }
}
```

#### Controller မှ Dispatch လုပ်ခြင်း:
```php
// User စာရင်းသွင်းပြီးသည်နှင့် ချက်ချင်း တုံ့ပြန်မှုပေးပြီး Job ကို Queue ထဲ ပစ်ထည့်သည်
SendWelcomeEmailJob::dispatch($user);
```

#### Worker Run ခြင်း:
```bash
php artisan queue:work
```

---

## ၁၂။ လုပ်ငန်းခွင်တွင် အသုံးအများဆုံး Built-in Helper Functions & Facades

Laravel တွင် Developer များ အချိန်ကုန်သက်သာစေရန် စွမ်းအားမြင့် Helpers များနှင့် Facades များစွာ ပါဝင်ပါသည်:

### (က) Collections Methods (Data ကို စစ်ထုတ်တွက်ချက်ခြင်း)
```php
$data = collect([
    ['name' => 'Laptop', 'price' => 1200, 'in_stock' => true],
    ['name' => 'Mouse',  'price' => 25,   'in_stock' => false],
    ['name' => 'Phone',  'price' => 800,  'in_stock' => true],
]);

// ၁။ filter(): Stock ရှိသော ပစ္စည်းများသာ စစ်ထုတ်ခြင်း
$available = $data->filter(fn($item) => $item['in_stock']);

// ၂။ pluck(): ပစ္စည်း အမည်များကိုသာ Array အဖြစ် ယူခြင်း
$names = $data->pluck('name'); // ['Laptop', 'Mouse', 'Phone']

// ၃။ sum(): စုစုပေါင်း ဈေးနှုန်း တွက်ချက်ခြင်း
$total = $data->sum('price'); // 2025

// ၄။ map(): Data တစ်ခုချင်းစီကို ပြုပြင်ပြောင်းလဲခြင်း
$formatted = $data->map(function ($item) {
    $item['price_mmk'] = $item['price'] * 3500;
    return $item;
});
```

---

### (ခ) String & Array Helpers (`Str` & `Arr`)
```php
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

// ၁။ URL Slug ပြောင်းခြင်း
$slug = Str::slug('Laravel 11 Beginner To Master Course');
// ရလဒ်: 'laravel-11-beginner-to-master-course'

// ၂။ စာလုံးအရှည် ကန့်သတ်ဖြတ်တောက်ခြင်း (Excerpt)
$summary = Str::limit('ဤသင်တန်းသည် အလွန်အသုံးဝင်သော Laravel လမ်းညွှန်ဖြစ်ပါသည်...', 30);

// ၃။ Random String & UUID ဖန်တီးခြင်း
$uuid = Str::uuid();
$random = Str::random(16);

// ၄။ Array မှ သီးသန့် Key များကိုသာ ဆွဲယူခြင်း
$data = ['name' => 'Aung Aung', 'email' => 'aung@gmail.com', 'password' => 'secret'];
$filtered = Arr::only($data, ['name', 'email']);
```

---

### (ဂ) အသုံးအများဆုံး General Helpers
| Helper Function | အသုံးပြုပုံ ရှင်းလင်းချက် |
| :--- | :--- |
| `dd($variable)` | Dump and Die (ကုဒ်လည်ပတ်မှုကို ချက်ချင်းရပ်ပြီး Data ဖွဲ့စည်းပုံကို Debug ကြည့်ရှုခြင်း) |
| `dump($variable)` | ကုဒ်မရပ်ဘဲ Data တန်ဖိုးကို မျက်နှာပြင်ပေါ် ထုတ်ပြခြင်း |
| `logger('Error occurred')` | `storage/logs/laravel.log` ထဲသို့ သတင်းအချက်အလက် မှတ်တမ်းတင်ခြင်း |
| `now()` / `today()` | လက်ရှိ အချိန်နှင့် နေ့စွဲ (Carbon Object) ကို လွယ်ကူစွာ ယူခြင်း |
| `config('app.name')` | Configuration တန်ဖိုးများကို ဆွဲထုတ်ဖတ်ယူခြင်း |
| `redirect()->back()` | ယခင် မူလ စာမျက်နှာဟောင်းသို့ ပြန်လည်ပို့ဆောင်ခြင်း |
| `abort(404, 'Not Found')` | သတ်မှတ်ထားသော HTTP Status Error Page အား ချက်ချင်း ထုတ်ပြခြင်း |

---

## ၁၃။ Enterprise Design Pattern (Service Layer & Repository Pattern)

လုပ်ငန်းခွင်တွင် Project ကြီးမားလာသောအခါ Controller ထဲတွင် ကုဒ်များပြည့်နေသော **"Fat Controller"** ပြဿနာ မဖြစ်စေရန် **Service Layer Pattern** ကို အသုံးပြုကြသည်။

```
[HTTP Request] ──► [Controller] ──► [Service Layer (Logic)] ──► [Database Model]
                                          │
                                          ▼
                                   [Send SMS / Payment API]
```

### (က) Service Class တည်ဆောက်ပုံ (`app/Services/OrderService.php`):
```php
namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    public function createOrder(array $data, $user): Order
    {
        // Database Transaction သုံးခြင်း (Error ဖြစ်ပါက အကုန် auto rollback ဖြစ်မည်)
        return DB::transaction(function () use ($data, $user) {
            $order = Order::create([
                'user_id'      => $user->id,
                'total_amount' => $data['total_amount'],
                'status'       => 'pending',
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);

                // Stock အရေအတွက် လျှော့ချခြင်း
                $product = \App\Models\Product::findOrFail($item['id']);
                $product->decrement('stock', $item['quantity']);
            }

            return $order;
        });
    }
}
```

### (ခ) Skinny Controller တွင် ခေါ်ယူအသုံးပြုပုံ:
```php
namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orderService->createOrder(
            $request->validated(),
            $request->user()
        );

        return response()->json([
            'message' => 'အော်ဒါတင်ခြင်း အောင်မြင်ပါသည်',
            'order_id' => $order->id
        ], 201);
    }
}
```

---

## ၁၄။ Production Deployment နှင့် Performance Optimization

Laravel App တစ်ခုကို Live Server (Production) သို့ တင်သည့်အခါ စွမ်းဆောင်ရည် အမြင့်ဆုံးရရှိစေရန် အောက်ပါ အချက်များကို မဖြစ်မနေ လုပ်ဆောင်ရပါသည်:

### (က) Production Cache Commands
```bash
# Configuration ဖိုင်များကို Cache ပြုလုပ်ခြင်း (Disk I/O သက်သာစေသည်)
php artisan config:cache

# Route များကို စုစည်း Cache လုပ်ခြင်း (Routing ပိုမိုမြန်ဆန်လာမည်)
php artisan route:cache

# Blade View များကို Pre-compile လုပ်ခြင်း
php artisan view:cache

# Event များကို Cache ပြုလုပ်ခြင်း
php artisan event:cache

# အားလုံးကို တစ်ပြိုင်နက် လုပ်ဆောင်ခြင်း
php artisan optimize
```

### (ခ) `.env` ဖိုင်တွင် သတိပြုရမည့် အချက်များ
```ini
# Production တွင် debug ကို FALSE အမြဲထားရမည် (Database password မပေါက်ကြားစေရန်)
APP_ENV=production
APP_DEBUG=false

# Cache နှင့် Session ကို Redis သို့မဟုတ် Database ပြောင်းခြင်း
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## 🎯 အနှစ်ချုပ် (Summary Checklist for Laravel Developers)

Laravel ကို ကျွမ်းကျင်စွာ အသုံးပြုနိုင်ရန် အောက်ပါ အဆင့် ၇ ဆင့်ကို နေ့စဉ် လက်တွေ့ လေ့ကျင့်ပါ:
1. **Routing & Resource Controllers** ကို ကျွမ်းကျင်စွာ ချိတ်ဆက်တတ်ပါစေ။
2. **Migrations & Relationships (1:1, 1:N, N:N)** ကို Schema ရေးဆွဲတတ်ပါစေ။
3. **N+1 Query Problem** ကို ရှောင်ရှားရန် `with()` (Eager Loading) ကို အမြဲ သုံးပါ။
4. Controller တွင် Logic တွေ မရှုပ်ထွေးစေရန် **Form Requests** နှင့် **Service Classes** များကို အသုံးပြုပါ။
5. File Uploads လုပ်သည့်အခါ `storage:link` ချိတ်ရန်နှင့် file validation စစ်ရန် မမေ့ပါနှင့်။
6. လုံခြုံရေးအတွက် `@csrf`, Mass Assignment Protection (`$fillable`), နှင့် Authorization Policies များကို တင်းကြပ်စွာ သုံးပါ။
7. အချိန်ကြာသော အလုပ်များ (Email, Reports) ကို **Queue & Jobs** ဖြင့် Background သို့ ပို့ပေးပါ။
