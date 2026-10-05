---
title: "03. Routing and Controllers"
description: "1. [Routing ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ](#၁-routing-ဆိုတာဘာလဲ)"
---

## 🧭 သင်ခန်းစာ (၃) - Routing နှင့် Controller စနစ် (HTTP Request စီမံခန့်ခွဲမှု)
### (Lesson 3: Routing Architecture, HTTP Verbs, Controllers & Route Model Binding)

---

## 📌 မာတိကာ (Contents)
1. [Routing ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ](#၁-routing-ဆိုတာဘာလဲ)
2. [HTTP Methods များ (GET, POST, PUT, PATCH, DELETE)](#၂-http-methods-များ)
3. [Route Parameters နှင့် Constraints (ဘာကြောင့် စစ်ဆေးရသလဲ?)](#၃-route-parameters-နှင့်-constraints)
4. [Named Routes နှင့် `route()` Helper အသုံးချပုံ](#၄-named-routes-နှင့်-route-helper-အသုံးချပုံ)
5. [Route Groups (Prefix, Names, Middlewares)](#၅-route-groups-prefix-names-middlewares)
6. [Controllers အမျိုးအစားများ (Basic, Resource, Single Action)](#၆-controllers-အမျိုးအစားများ)
7. [Route Model Binding (Implicit vs Explicit)](#၇-route-model-binding)
8. [လုပ်ငန်းခွင်သုံး CRUD Controller ကုဒ်နမူနာ အပြည့်အစုံ](#၈-လုပ်ငန်းခွင်သုံး-crud-controller-ကုဒ်နမူနာ)

---

## ၁။ Routing ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Routing** ဆိုသည်မှာ အသုံးပြုသူ Browser ၏ URL (ဥပမာ- `/products`, `/checkout`) ကို လက်ခံပြီး မည်သည့် Controller သို့မဟုတ် Logic ထံသို့ လွှဲပြောင်းပေးရမည်ကို လမ်းညွှန်သတ်မှတ်ပေးသော စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
ရိုးရိုး PHP တွင် `index.php?page=products&id=15` ကဲ့သို့ ရှုပ်ထွေးသော Query String များ သုံးရသည်။ Laravel Routing ဖြင့် လူဖတ်ရလွယ်ကူပြီး SEO အထောက်အကူပြုသော Clean URLs (ဥပမာ `/products/15`) ကို ဖန်တီးနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **RESTful Standards**: GET, POST, PUT, DELETE စသည့် စံ HTTP Methods များကို တိကျစွာ ခွဲခြားနိုင်သည်။
* **Centralized Routing**: URL အားလုံးကို `routes/web.php` ဖိုင်တစ်ခုတည်းတွင် စုစည်းစီမံနိုင်သည်။
* **Middleware Integration**: URL တစ်ခုချင်းစီအလိုက် Login စစ်ဆေးခြင်းများကို တစ်ခါတည်း တွဲဖက်သတ်မှတ်နိုင်သည်။

---

## ၂။ HTTP Methods များ

```php
use Illuminate\Support\Facades\Route;

// ၁။ GET: ဒေတာများကို ဖတ်ရှုရယူရန် (Read)
Route::get('/products', [ProductController::class, 'index']);

// ၂။ POST: ဒေတာ အသစ် ဖန်တီးသိမ်းဆည်းရန် (Create)
Route::post('/products', [ProductController::class, 'store']);

// ၃။ PUT / PATCH: ရှိပြီးသား ဒေတာကို ပြင်ဆင်ရန် (Update)
Route::put('/products/{id}', [ProductController::class, 'update']);

// ၄။ DELETE: ဒေတာကို ဖျက်ပစ်ရန် (Delete)
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
```

---

## ၃။ Route Parameters နှင့် Constraints

### (က) ဒါက ဘာလဲ?
URL ထဲမှ Dynamic တန်ဖိုးများ (ဥပမာ- Product ID, Article Slug) ကို ဖမ်းယူသော စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် Constraints စစ်ဆေးရသလဲ?
URL တွင် `/orders/abc` ဟု စာသားမှားယွင်းရိုက်ထည့်လာပါက Database သို့ Query သွားရောက် မမေးမြန်းမီ Route အဆင့်မှာပင် တားဆီးရန် ဖြစ်သည်။

```php
// ၁။ Required Parameter + Number Constraint (ID သည် ဂဏန်းသီးသန့် ဖြစ်ရမည်)
Route::get('/orders/{id}', function (string $id) {
    return "Order #{$id}";
})->whereNumber('id');

// ၂။ Optional Parameter (မပါလဲ ရသည် - Default Value ထည့်ပေးရသည်)
Route::get('/posts/{category?}', function (string $category = 'all') {
    return "Category: " . $category;
});
```

---

## ၄။ Named Routes နှင့် `route()` Helper အသုံးချပုံ

### (က) ဒါက ဘာလဲ?
Route တစ်ခုချင်းစီကို စိတ်ကြိုက် သီးသန့် အမည်တစ်ခု ပေးထားခြင်း ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use it in real work?)
နောင်တစ်ချိန်တွင် Marketing အရ URL ကို `/contact-us` မှ `/support/contact` ဟု ပြောင်းလိုက်သည့်အခါ Named Route မသုံးထားပါက Blade Template ဖိုင်ပေါင်း ရာချီတွင် လိုက်လံပြင်ဆင်နေရမည်။ Named Route သုံးထားပါက တစ်နေရာတည်း ပြင်ရုံဖြင့် ကျန်နေရာအားလုံး auto ပြောင်းသွားသည်။

```php
// Route ကို အမည်ပေးခြင်း
Route::get('/customer/contact-us', [PageController::class, 'contact'])->name('contact');

// Controller သို့မဟုတ် View တွင် သုံးစွဲပုံ:
// 1. Redirection:
return redirect()->route('contact');

// 2. Blade Link:
// <a href="{{ route('contact') }}">ဆက်သွယ်ရန်</a>

// 3. Parameters ပါဝင်သော Named Route:
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
// သုံးစွဲပုံ: route('products.show', ['id' => 25]) -> Output: /products/25
```

---

## ၅။ Route Groups (Prefix, Names, Middlewares)

### (က) ဒါက ဘာလဲ?
Routes ပေါင်းများစွာတွင် ထပ်ခါတလဲလဲ တူညီနေသော URL Prefix များ၊ Name Prefixes များနှင့် Middlewares များကို စုစည်းပေးသော စနစ်ဖြစ်သည်။

### (ခ) အားသာချက်များ:
* **DRY Principle (Don't Repeat Yourself)**: ကုဒ်ထပ်နေမှုကို ဖယ်ရှားပေးသည်။
* **Admin Dashboard Routing**: Admin သီးသန့် Routes များကို စနစ်တကျ ကာကွယ်နိုင်သည်။

```php
Route::middleware(['auth', 'admin'])     // Admin Login သာ ဝင်ခွင့်ရှိမည်
     ->prefix('admin')                   // URL ရှေ့တွင် /admin/ ပါမည်
     ->name('admin.')                    // Route name ရှေ့တွင် admin. ပါမည်
     ->group(function () {

         // URL: /admin/dashboard | Name: admin.dashboard
         Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

         // URL: /admin/products | Name: admin.products.index
         Route::get('/products', [ProductController::class, 'index'])->name('products.index');
     });
```

---

## ၆။ Controllers အမျိုးအစားများ

### (က) Resource Controller (လုပ်ငန်းခွင်တွင် အသုံးအများဆုံး)
* **ဘာကြောင့် သုံးရသလဲ**: CRUD စနစ်တစ်ခုအတွက် လိုအပ်သော Standard Actions (၇) ခု (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`) ကို တစ်ပြိုင်နက် ဖန်တီးပေးသည်။

```bash
php artisan make:controller ProductController --resource
```

`routes/web.php` တွင် လိုင်းတစ်ကြောင်းတည်းဖြင့် CRUD Routes ၇ ခုလုံး ချိတ်ဆက်နိုင်သည်:
```php
Route::resource('products', ProductController::class);
```

### (ခ) Single Action Controller (`__invoke`)
* **ဘာကြောင့် သုံးရသလဲ**: Action တစ်ခုတည်းသာ လုပ်ဆောင်သော သီးသန့် Controller (ဥပမာ- PDF Export လုပ်ခြင်း၊ Stripe Payment Webhook) အတွက် သုံးသည်။

```bash
php artisan make:controller ExportInvoiceController --invokable
```

```php
class ExportInvoiceController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        // Invoice PDF ကို generate လုပ်ပြီး download ပေးမည်
    }
}
```

---

## ၇။ Route Model Binding (Implicit vs Explicit)

### (က) ဒါက ဘာလဲ?
URL မှ ပါလာသော ID အလိုက် Database ထဲမှ Model record ကို အလိုအလျောက် Query ဆွဲထုတ်ပေးသော Laravel ၏ စွမ်းအားမြင့် Feature ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ?
Manual ရေးနည်းတွင် `Product::find($id)` လုပ်ရပြီး Data မရှိပါက `if (!$product) { abort(404); }` ဟု ကိုယ်တိုင် စစ်ဆေးနေရသည်။

### (ဂ) အားသာချက်:
Controller Argument တွင် Model Type-hint ပေးလိုက်ရုံဖြင့် Laravel က ဒေတာမရှိပါက 404 Not Found Page ကို auto ပြပေးသည်။

```php
// ✅ Laravel Implicit Route Model Binding
// URL: /products/{product} -> Argument: (Product $product) တူညီရမည်
Route::get('/products/{product}', function (Product $product) {
    // Database Query ရေးစရာမလိုဘဲ $product object အသင့် ရရှိသည်
    return view('products.show', compact('product'));
});

// Slug ဖြင့် Bind လုပ်လိုပါက:
Route::get('/articles/{article:slug}', [ArticleController::class, 'show']);
```

---

## ၈။ လုပ်ငန်းခွင်သုံး CRUD Controller ကုဒ်နမူနာ

```php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return view('products.index', compact('products'));
    }

    public function create()
    {
        return view('products.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
                         ->with('success', 'ပစ္စည်း အသစ် ထည့်သွင်းပြီးပါပြီ!');
    }

    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        return view('products.edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
                         ->with('success', 'ပစ္စည်း ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')
                         ->with('success', 'ပစ္စည်း ဖျက်ပြီးပါပြီ!');
    }
}
```
