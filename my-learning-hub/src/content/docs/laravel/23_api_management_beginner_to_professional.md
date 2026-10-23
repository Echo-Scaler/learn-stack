---
title: "23. API Management - Beginner to Professional"
description: "Laravel တွင် API တည်ဆောက်/စီမံပုံ - REST အခြေခံ၊ Routing, Versioning, Pagination, Filtering, Rate Limiting, Error Handling, Idempotency, Caching, Webhooks, External API ခေါ်ခြင်း၊ Documentation, Testing - Real-work ဥပမာများ"
---

> Laravel 11 / 12။ ကြိုတင်ဖတ်ရန်: [22. Sanctum & Tokens](/laravel/22_sanctum_breeze_and_api_tokens_complete_guide/)၊ Validation/Resources အသေးစိတ်: [24](/laravel/24_validation_form_requests_and_api_resources/)

## 🧭 အဆင့်လမ်းကြောင်း

| Level | အကြောင်းအရာ | အပိုင်း |
| :--- | :--- | :-: |
| 🟢 **Beginner** | REST အခြေခံ၊ Route၊ CRUD Controller၊ JSON၊ Status Code | 1-3 |
| 🟡 **Intermediate** | Versioning၊ Pagination၊ Filter/Sort/Search၊ Error Format၊ Rate Limit၊ Eager Loading | 4-9 |
| 🔴 **Advanced** | Idempotency၊ Caching/ETag၊ Bulk/Async Job၊ Webhook၊ Optimistic Lock | 10-14 |
| ⚫ **Professional** | External API ခေါ်ခြင်း (Http, Retry, Circuit)၊ Docs၊ Testing၊ Observability၊ Deprecation | 15-20 |

---

# 🟢 BEGINNER

## ၁။ API ဆိုတာဘာလဲ၊ REST ဆိုတာဘာလဲ

**API (Application Programming Interface)** = Software တစ်ခုက တခြား Software ကို "ဒါလုပ်ပေးပါ / ဒါပေးပါ" ဟု စနစ်တကျ ခေါ်နိုင်သော **ပေါက်ပေါက်ဝ**။

```
 Mobile App ─┐
 React SPA ──┼──► HTTP + JSON ──► Laravel API ──► Database
 Partner ────┘                      (Business Logic တစ်နေရာတည်း)
```

### အားသာချက် (ဘာကြောင့် API ဖြင့်ဆောက်သလဲ)
- Backend Logic **တစ်ခုတည်း** ကို Web/iOS/Android/Partner အားလုံးသုံး
- Frontend/Backend Team သီးခြားလုပ်နိုင်
- Scale လွယ် (Stateless)
- Third-party ပေါင်းစည်းလွယ်

### REST ၏ စည်းမျဉ်း
| Method | ရည်ရွယ်ချက် | Idempotent? | ဥပမာ |
| :-: | :--- | :-: | :--- |
| `GET` | ဖတ် | ✅ | `GET /orders` |
| `POST` | ဖန်တီး | ❌ | `POST /orders` |
| `PUT` | အစားထိုး (အားလုံး) | ✅ | `PUT /orders/5` |
| `PATCH` | တစ်စိတ်တစ်ပိုင်း ပြင် | ❌* | `PATCH /orders/5` |
| `DELETE` | ဖျက် | ✅ | `DELETE /orders/5` |

> Idempotent = အကြိမ်ကြိမ်ခေါ်လည် ရလဒ်တူ။ (အပိုင်း ၁၀ တွင် `POST` ကို Idempotent ဖြစ်အောင် လုပ်ပုံပါ)

### URL ဒီဇိုင်း
```
✅ GET    /api/v1/orders                 စာရင်း
✅ GET    /api/v1/orders/5               တစ်ခု
✅ POST   /api/v1/orders                 ဖန်တီး
✅ PUT    /api/v1/orders/5               ပြင်
✅ DELETE /api/v1/orders/5               ဖျက်
✅ GET    /api/v1/orders/5/items         Nested resource
✅ POST   /api/v1/orders/5/cancel        Action (CRUD မဟုတ်သည်များအတွက် Verb ခွင့်ပြု)

❌ GET /api/getOrders                    Verb မသုံး
❌ POST /api/deleteOrder?id=5            Method နှင့်ဆန့်ကျင်
❌ GET /api/order (ကိန်းတစ်)             Collection နာမည် အများကိန်းသုံး
```

### HTTP Status Code
| Code | အဓိပ္ပါယ် | သုံးရာ |
| :-: | :--- | :--- |
| 200 | OK | GET/PUT/PATCH အောင် |
| 201 | Created | POST အောင် (+ `Location` header) |
| 202 | Accepted | Async Job လက်ခံပြီ |
| 204 | No Content | DELETE အောင် (Body မရှိ) |
| 400 | Bad Request | Malformed JSON |
| 401 | Unauthenticated | Token မရှိ/မှား |
| 403 | Forbidden | ခွင့်မရှိ |
| 404 | Not Found | မတွေ့ |
| 409 | Conflict | Duplicate / Version conflict |
| 422 | Unprocessable | Validation ကျ |
| 429 | Too Many Requests | Rate limit |
| 500 | Server Error | Bug |
| 503 | Service Unavailable | Maintenance / Dependency ကျ |

---

## ၂။ ပထမဆုံး API (Laravel 11)

```bash
laravel new shop-api && cd shop-api
php artisan install:api
php artisan make:model Product -mfsc --api      # Model, Migration, Factory, Seeder, Controller(api)
```
`database/migrations/xxxx_create_products_table.php`
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('sku')->unique();
    $table->text('description')->nullable();
    $table->unsignedInteger('price');                 // ¥ - ပြောင်းလဲမှုမရှိအောင် Integer (Cents/Yen)
    $table->unsignedInteger('stock')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->softDeletes();
    $table->index(['is_active', 'created_at']);
});
```
```php
// Product model
class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'sku', 'description', 'price', 'stock', 'is_active'];
    protected function casts(): array { return ['is_active' => 'boolean']; }
}
```

`routes/api.php`
```php
Route::apiResource('products', ProductController::class);
// GET /api/products, POST /api/products, GET|PUT|PATCH|DELETE /api/products/{product}
```
```bash
php artisan route:list --path=api
```

### အရိုးရှင်းဆုံး Controller (Beginner)
```php
class ProductController extends Controller
{
    public function index()
    {
        return Product::latest()->get();                     // Array -> JSON အလိုအလျောက်
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'sku'   => 'required|unique:products',
            'price' => 'required|integer|min:0',
        ]);
        return response()->json(Product::create($data), 201);
    }

    public function show(Product $product)                   // Route Model Binding - မတွေ့လျှင် 404 အလိုအလျောက်
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->validate(['name' => 'string', 'price' => 'integer|min:0']));
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();                      // 204
    }
}
```
```bash
curl -s localhost:8000/api/products -H "Accept: application/json"
curl -s -X POST localhost:8000/api/products -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"name":"Mouse","sku":"M-001","price":1500}'
```

> ⚠️ ဤ Controller သည် Beginner Demo သာ - အောက်ပါအပိုင်းများတွင် **Production-ready** ပုံစံသို့ တဖြည်းဖြည်း တိုးတက်စေမည်။

## ၃။ Beginner ၏ အမှားများ (ကြုံလေ့ရှိ)

| အမှား | ပြဿနာ | ဖြေရှင်း |
| :--- | :--- | :--- |
| Model တစ်ခုလုံး ပြန် (`return $user`) | `password` hash, internal field ပေါက်ကြား | **API Resource** ([24](/laravel/24_validation_form_requests_and_api_resources/)) |
| `->get()` ဖြင့် အားလုံး | Row သန်းချီလျှင် Server ကျ | **Pagination** |
| Validation Controller ထဲ | ထပ်ခါထပ်ခါ | **FormRequest** |
| `$request->all()` ဖြင့် Create | Mass Assignment (role=admin ပို့လို့ရ) | `$request->validated()` |
| Status Code အမြဲ 200 | Client Error Handle မလွယ် | မှန်ကန်သော Code |
| Error Format တစ်ခုချင်းမတူ | Frontend ရှုပ် | အပိုင်း ၆ |

---

# 🟡 INTERMEDIATE

## ၄။ Route Organization နှင့် API Versioning

### ဘာကြောင့် Version လိုလဲ
Mobile App အဟောင်းများ (Update မလုပ်သူများ) ကို မပျက်စေဘဲ API ကို ပြောင်းလဲနိုင်ရန်။ Field နာမည်ပြောင်း၊ Response ပုံစံပြောင်းလျှင် `/v2`။

### URL Versioning (အသုံးအများဆုံး၊ အရိုးရှင်းဆုံး)
`bootstrap/app.php`
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    apiPrefix: 'api',                       // 'api/v1' လည်းပြောင်းနိုင်
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```
`routes/api.php`
```php
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->as('v1.')->group(base_path('routes/api/v1.php'));
Route::prefix('v2')->as('v2.')->group(base_path('routes/api/v2.php'));
```
`routes/api/v1.php`
```php
use App\Http\Controllers\Api\V1\{AuthController, ProductController, OrderController};

Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class)->except(['destroy']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::apiResource('orders.items', OrderItemController::class)->shallow();    // Nested
});
```
Folder ဖွဲ့စည်းပုံ:
```
app/Http/
├── Controllers/Api/V1/ProductController.php
├── Controllers/Api/V2/ProductController.php
├── Requests/Api/V1/StoreProductRequest.php
└── Resources/V1/ProductResource.php   |   V2/ProductResource.php
```

### Version နည်းလမ်းများ
| နည်း | ဥပမာ | အားသာ | အားနည်း |
| :--- | :--- | :--- | :--- |
| **URL** | `/api/v1/orders` | ရိုးရှင်း၊ Cache လွယ်၊ Test လွယ် | URL ပြောင်း |
| **Header** | `Accept: application/vnd.shop.v2+json` | URL သန့် | Debug ခက် |
| **Query** | `?version=2` | လွယ် | Cache ခက် |

> အကြံပြု: **URL Versioning**။ V2 တွင် ပြောင်းသည့် Endpoint များသာ Controller အသစ်ရေး၊ ကျန်သည်များကို V1 Controller ကို ပြန်သုံးနိုင်သည်။

---

## ၅။ Pagination (မဖြစ်မနေ)

### ဘာကြောင့်?
`Product::all()` သည် Row ၁ သန်းရှိလျှင် Memory ကုန်၊ Response MB ပေါင်းများစွာ၊ Mobile ဖောက်ပြန်။

### ၃ မျိုး
```php
// ① paginate() - Page နံပါတ်၊ Total ပါ (Count query ထပ်ဖြစ်)
Product::paginate(15);
// GET /api/products?page=2&per_page=15

// ② simplePaginate() - Total မပါ (Count မလုပ်၊ မြန်)
Product::simplePaginate(15);

// ③ cursorPaginate() - Cursor ဖြင့် (Infinite scroll၊ Data ကြီး၊ Realtime Insert ရှိ)
Product::orderBy('id')->cursorPaginate(15);
// GET /api/products?cursor=eyJpZCI6MTUs...
```

| | `paginate` | `simplePaginate` | `cursorPaginate` |
| :--- | :-: | :-: | :-: |
| Total/Last page | ✅ | ❌ | ❌ |
| Page ခုန် (Page 50 သို့) | ✅ | ❌ | ❌ |
| Row များသောအခါ မြန်? | ❌ (OFFSET နှေး) | ⚠️ | ✅✅ |
| Insert/Delete ဖြစ်စဉ် Duplicate/Skip | ရှိနိုင် | ရှိနိုင် | ❌ မရှိ |
| သင့်တော်ရာ | Admin Table | Simple List | Feed, Mobile Infinite Scroll |

### `per_page` ကို Client ထိန်းချုပ်ခွင့်ပေး၊ ကန့်သတ်ပါ
```php
public function index(Request $request)
{
    $perPage = min(max((int) $request->integer('per_page', 15), 1), 100);   // 1..100

    return ProductResource::collection(
        Product::query()->latest('id')->paginate($perPage)->withQueryString()
    );
}
```
Response (Resource Collection က `data`, `links`, `meta` ထည့်ပေး):
```json
{
  "data": [ { "id": 1, "name": "Mouse" } ],
  "links": { "first": "...?page=1", "last": "...?page=9", "prev": null, "next": "...?page=2" },
  "meta": { "current_page": 1, "per_page": 15, "total": 130, "last_page": 9 }
}
```

---

## ၆။ Consistent Error Format (အရေးအကြီးဆုံးတစ်ခု)

ပုံစံမတူသော Error များသည် Frontend/Mobile Dev ကို ပင်ပန်းစေသည်။ **Error အားလုံး တူညီသော Shape** ဖြင့် ပြန်ပါ။

### Standard Shape
```json
{
  "message": "The given data was invalid.",
  "code": "VALIDATION_FAILED",
  "errors": { "email": ["Email ပုံစံမမှန်ပါ"] },
  "request_id": "9f1c..."
}
```

### `bootstrap/app.php` တွင် Exception များကို Format တစ်ခုတည်းသို့ ပြောင်း
```php
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\{NotFoundHttpException, MethodNotAllowedHttpException, HttpException, TooManyRequestsHttpException};

->withExceptions(function (Exceptions $exceptions) {

    // API Route (/api/*) ဆိုလျှင် အမြဲ JSON
    $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*') || $request->expectsJson());

    $json = fn (string $code, string $message, int $status, array $extra = []) =>
        response()->json(array_merge([
            'message'    => $message,
            'code'       => $code,
            'request_id' => request()->header('X-Request-Id'),
        ], $extra), $status);

    $exceptions->render(fn (ValidationException $e, Request $r) =>
        $r->is('api/*') ? $json('VALIDATION_FAILED', 'Validation ကျသွားပါသည်', 422, ['errors' => $e->errors()]) : null);

    $exceptions->render(fn (AuthenticationException $e, Request $r) =>
        $r->is('api/*') ? $json('UNAUTHENTICATED', 'Login ဝင်ရန်လိုပါသည်', 401) : null);

    $exceptions->render(fn (AuthorizationException $e, Request $r) =>
        $r->is('api/*') ? $json('FORBIDDEN', $e->getMessage() ?: 'ခွင့်မပြုပါ', 403) : null);

    $exceptions->render(fn (ModelNotFoundException|NotFoundHttpException $e, Request $r) =>
        $r->is('api/*') ? $json('NOT_FOUND', 'မတွေ့ပါ', 404) : null);

    $exceptions->render(fn (MethodNotAllowedHttpException $e, Request $r) =>
        $r->is('api/*') ? $json('METHOD_NOT_ALLOWED', 'Method မမှန်ပါ', 405) : null);

    $exceptions->render(fn (TooManyRequestsHttpException $e, Request $r) =>
        $r->is('api/*') ? $json('RATE_LIMITED', 'Request များလွန်းပါသည်', 429, [
            'retry_after' => (int) ($e->getHeaders()['Retry-After'] ?? 60),
        ]) : null);

    // Production တွင် 500 ၏ အတွင်းသားမပေါက်ကြား
    $exceptions->render(function (\Throwable $e, Request $r) use ($json) {
        if ($r->is('api/*') && ! config('app.debug') && ! ($e instanceof HttpException)) {
            report($e);
            return $json('SERVER_ERROR', 'Server တွင် ပြဿနာဖြစ်ပါသည်', 500);
        }
    });
})
```

### Domain Exception (Business Rule Error)
```php
class InsufficientStockException extends \DomainException
{
    public function __construct(public readonly int $productId, public readonly int $available)
    { parent::__construct("Stock မလုံလောက်ပါ (ကျန် {$available})"); }

    public function render(Request $request)       // Exception ကိုယ်တိုင် Response ပြန်
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code'    => 'INSUFFICIENT_STOCK',
            'details' => ['product_id' => $this->productId, 'available' => $this->available],
        ], 409);
    }
}
```
Service ထဲတွင် `throw new InsufficientStockException($p->id, $p->stock);` - Controller တွင် try/catch မလို။

---

## ၇။ Filtering, Sorting, Searching

```
GET /api/v1/products?filter[is_active]=1&filter[price_min]=1000&filter[price_max]=5000
                    &search=mouse&sort=-price,name&include=category&per_page=20
```

### Manual (Package မသုံးဘဲ) - Whitelist ထားသည်ကို အရေးကြီးစွာ
```php
class ProductController extends Controller
{
    private const SORTABLE = ['id', 'name', 'price', 'created_at'];

    public function index(IndexProductRequest $request)
    {
        $q = Product::query()
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = '%' . addcslashes($request->search, '%_\\') . '%';     // LIKE wildcard escape
                $q->where(fn ($q) => $q->where('name', 'like', $term)->orWhere('sku', 'like', $term));
            })
            ->when($request->has('filter.is_active'), fn ($q) => $q->where('is_active', $request->boolean('filter.is_active')))
            ->when($request->filled('filter.price_min'), fn ($q) => $q->where('price', '>=', (int) $request->input('filter.price_min')))
            ->when($request->filled('filter.price_max'), fn ($q) => $q->where('price', '<=', (int) $request->input('filter.price_max')))
            ->when($request->filled('filter.category_id'), fn ($q) => $q->where('category_id', $request->input('filter.category_id')));

        // Sort: "-price,name" -> price DESC, name ASC (Whitelist စစ်)
        foreach (explode(',', $request->input('sort', '-id')) as $field) {
            $dir = str_starts_with($field, '-') ? 'desc' : 'asc';
            $col = ltrim($field, '-');
            if (in_array($col, self::SORTABLE, true)) $q->orderBy($col, $dir);
        }

        // Include (Eager load) - Whitelist
        $allowed = ['category', 'images'];
        $with = array_intersect(explode(',', $request->input('include', '')), $allowed);
        $q->with($with);

        return ProductResource::collection($q->paginate(min($request->integer('per_page', 15), 100))->withQueryString());
    }
}
```
> ⚠️ **Sort/Filter Column ကို Whitelist မစစ်ဘဲ `orderBy($request->sort)` လုပ်လျှင် SQL Injection / Internal Column ထုတ်ဖော်ခြင်း** ဖြစ်နိုင်သည်။

### Package ဖြင့် (Real-work တွင် အသုံးများ) - `spatie/laravel-query-builder`
```bash
composer require spatie/laravel-query-builder
```
```php
use Spatie\QueryBuilder\{QueryBuilder, AllowedFilter};

$products = QueryBuilder::for(Product::class)
    ->allowedFilters([
        'name',
        AllowedFilter::exact('is_active'),
        AllowedFilter::scope('price_between'),           // Model scopePriceBetween
        AllowedFilter::callback('search', fn ($q, $v) => $q->where('name', 'like', "%$v%")),
    ])
    ->allowedSorts(['price', 'name', 'created_at'])
    ->allowedIncludes(['category', 'images'])
    ->defaultSort('-created_at')
    ->paginate(15)
    ->appends(request()->query());
```
`GET /products?filter[name]=mouse&sort=-price&include=category`

### Full-text Search
- MySQL: `FULLTEXT` index + `whereFullText(['name','description'], $term)`
- ကြီးမားလျှင်: **Laravel Scout + Meilisearch/Algolia/Typesense**

---

## ၈။ Eager Loading - N+1 ကာကွယ်

```php
// ❌ N+1: Order 100 ခု = Query 101 ခု
Order::all()->each(fn ($o) => $o->customer->name);

// ✅ Eager load
Order::with(['customer:id,name', 'items.product:id,name'])->paginate(20);

// Resource တွင် whenLoaded သုံး - Load မထားလျှင် Query မဖြစ်စေ ([24])
'customer' => new CustomerResource($this->whenLoaded('customer')),
```
Dev ကာလတွင် N+1 ကို **Error ပြောင်းထား**ပါ-
```php
// AppServiceProvider::boot()
Model::preventLazyLoading(! app()->isProduction());
Model::shouldBeStrict(! app()->isProduction());      // Lazy loading, silently discarded attributes, missing attributes
```
Count/Sum: `Product::withCount('reviews')->withAvg('reviews', 'rating')` (Loop ထဲ Query မလုပ်)။

---

## ၉။ Rate Limiting (Abuse ကာကွယ်)

`app/Providers/AppServiceProvider.php`
```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // Default API: Login ဝင်ပြီးသူ = User ID အလိုက်၊ မဝင်သူ = IP အလိုက်
    RateLimiter::for('api', fn (Request $request) =>
        Limit::perMinute(60)->by($request->user()?->id ?: $request->ip())
    );

    // Login: Email+IP ပေါင်း (တစ်ဦးကို ပစ်မှတ်ထားတိုက်ခိုက်မှု ကာကွယ်)
    RateLimiter::for('login', fn (Request $request) => [
        Limit::perMinute(5)->by($request->ip()),
        Limit::perMinute(5)->by(strtolower((string) $request->input('email'))),
    ]);

    // Plan အလိုက် (Free=60, Pro=600)
    RateLimiter::for('tiered', function (Request $request) {
        $user = $request->user();
        return match (true) {
            ! $user               => Limit::perMinute(20)->by($request->ip()),
            $user->plan === 'pro' => Limit::perMinute(600)->by($user->id),
            default               => Limit::perMinute(60)->by($user->id),
        };
    });

    // ဈေးကြီးသော Endpoint (Export, AI) - ပိုတင်း
    RateLimiter::for('exports', fn (Request $r) => Limit::perHour(5)->by($r->user()->id)
        ->response(fn () => response()->json(['message' => 'တစ်နာရီ ၅ ကြိမ်သာ Export လုပ်နိုင်သည်', 'code' => 'RATE_LIMITED'], 429)));
}
```
```php
Route::middleware(['auth:sanctum', 'throttle:tiered'])->group(...);
Route::post('exports', ExportController::class)->middleware('throttle:exports');
```
Response Header:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
Retry-After: 37          (429 တွင်)
```
> Cache Driver ကို **Redis** ထား (Server အများအပြားတွင် Counter မျှဝေရန်)။ `file` driver သည် Multi-server တွင် မမှန်။

---

# 🔴 ADVANCED

## ၁၀။ Idempotency (Payment/Order ထပ်မဖြစ်စေရန်)

**ပြဿနာ:** Mobile Network မကောင်းလို့ "Pay" Button နှိပ်ပြီး Timeout ဖြစ်၊ Client က Retry -> **ငွေ ၂ ကြိမ်ထုတ်သွား**။

**အဖြေ:** Client က `Idempotency-Key: <UUID>` Header ပို့ - Server က Key တူလျှင် **ပထမရလဒ်ကိုသာ ပြန်ပေး**၊ ထပ်မလုပ်။

`app/Http/Middleware/Idempotent.php`
```php
use Illuminate\Support\Facades\Cache;

class Idempotent
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->method(), ['POST', 'PATCH'])) return $next($request);

        $key = $request->header('Idempotency-Key');
        if (! $key) {
            return response()->json(['message' => 'Idempotency-Key header လိုအပ်သည်', 'code' => 'IDEMPOTENCY_KEY_REQUIRED'], 400);
        }

        $cacheKey = 'idem:' . $request->user()->id . ':' . hash('sha256', $key);
        $fingerprint = hash('sha256', $request->method() . $request->path() . $request->getContent());

        // Lock - တူညီသော Key ၂ ခု တစ်ပြိုင်နက်ဝင်လျှင် တစ်ခုသာ Run
        $lock = Cache::lock($cacheKey . ':lock', 30);
        if (! $lock->get()) {
            return response()->json(['message' => 'ဤ Request ကို လုပ်ဆောင်နေဆဲ', 'code' => 'IN_PROGRESS'], 409);
        }

        try {
            if ($stored = Cache::get($cacheKey)) {
                if ($stored['fingerprint'] !== $fingerprint) {
                    return response()->json(['message' => 'Key တူပြီး Body မတူပါ', 'code' => 'IDEMPOTENCY_KEY_REUSED'], 422);
                }
                return response($stored['body'], $stored['status'])
                    ->withHeaders(['Content-Type' => 'application/json', 'Idempotent-Replayed' => 'true']);
            }

            $response = $next($request);

            if ($response->getStatusCode() < 500) {            // 5xx ကို မသိမ်း (Retry ခွင့်ပြု)
                Cache::put($cacheKey, [
                    'fingerprint' => $fingerprint,
                    'status'      => $response->getStatusCode(),
                    'body'        => $response->getContent(),
                ], now()->addHours(24));
            }
            return $response;
        } finally {
            $lock->release();
        }
    }
}
```
```php
Route::post('payments', [PaymentController::class, 'store'])->middleware(['auth:sanctum', 'idempotent']);
```
```bash
curl -X POST .../payments -H "Idempotency-Key: 7d9f..." ...      # ပထမ - 201 ဖန်တီး
curl -X POST .../payments -H "Idempotency-Key: 7d9f..." ...      # ထပ်ပို့ - 201 (အတူ၊ Idempotent-Replayed: true)
```
> DB Level တွင်လည်း `unique(user_id, idempotency_key)` ထားပါ (Cache ပျောက်လျှင် နောက်ဆုံးကာကွယ်ရေး)။

---

## ၁၁။ HTTP Caching - ETag / Conditional Request

```php
public function show(Request $request, Product $product)
{
    $etag = '"' . md5($product->updated_at . $product->id) . '"';

    if ($request->header('If-None-Match') === $etag) {
        return response()->noContent(304)->setEtag(trim($etag, '"'));       // Body မပို့ - Bandwidth ချွေတာ
    }

    return (new ProductResource($product))->response()
        ->setEtag(trim($etag, '"'))
        ->header('Cache-Control', 'private, max-age=60');
}
```
Laravel ၏ `cache.headers` Middleware:
```php
Route::get('categories', CategoryController::class)->middleware('cache.headers:public;max_age=3600;etag');
```

### Server-side Cache (Redis)
```php
public function index()
{
    $data = Cache::tags(['products'])->remember(
        'products:list:' . md5(request()->getQueryString()), 300,
        fn () => ProductResource::collection(Product::active()->paginate(15))->response()->getData(true)
    );
    return response()->json($data);
}

// Model Observer / Event တွင် Cache ရှင်း
Cache::tags(['products'])->flush();
```
> `Cache::tags` သည် Redis/Memcached သာ။ Cache Invalidation သည် ခက်ခဲဆုံးပြဿနာ - TTL တို + Event-based ရှင်းခြင်းကို ပေါင်းသုံးပါ။

---

## ၁၂။ Bulk Operations နှင့် Async (Long-running) API

### Bulk
```php
Route::post('products/bulk', [ProductBulkController::class, 'store']);
```
```php
public function store(BulkStoreProductRequest $request)
{
    // rules: 'items' => ['required','array','max:500'], 'items.*.sku' => ['required','distinct'], ...
    $result = DB::transaction(function () use ($request) {
        $now = now();
        $rows = collect($request->validated('items'))->map(fn ($i) => $i + ['created_at' => $now, 'updated_at' => $now])->all();
        Product::upsert($rows, ['sku'], ['name', 'price', 'stock', 'updated_at']);     // Insert or Update (Query တစ်ခုတည်း)
        return count($rows);
    });

    return response()->json(['processed' => $result], 200);
}
```

### Async - "၂၀၂ Accepted + Status polling" (Export, Report, Import)
```php
// ① Job ကို Queue သို့ပို့ ပြီး ချက်ချင်း 202 ပြန်
public function store(Request $request)
{
    $export = Export::create(['user_id' => $request->user()->id, 'status' => 'queued']);
    GenerateSalesReport::dispatch($export);

    return response()->json(['id' => $export->id, 'status' => 'queued'], 202)
        ->header('Location', route('v1.exports.show', $export));
}

// ② Client က Status ကို Poll
public function show(Export $export)
{
    $this->authorize('view', $export);
    return [
        'id' => $export->id,
        'status' => $export->status,                      // queued | processing | done | failed
        'download_url' => $export->status === 'done'
            ? URL::temporarySignedRoute('exports.download', now()->addMinutes(10), $export) : null,
    ];
}
```
```php
// Job
class GenerateSalesReport implements ShouldQueue
{
    use Queueable;
    public int $tries = 3;
    public int $timeout = 600;
    public function backoff(): array { return [30, 120, 600]; }

    public function __construct(public Export $export) {}

    public function handle(): void
    {
        $this->export->update(['status' => 'processing']);
        // ... CSV ကို S3 သို့ ရေးသား (chunk() ဖြင့်)
        $this->export->update(['status' => 'done', 'path' => $path]);
    }

    public function failed(\Throwable $e): void { $this->export->update(['status' => 'failed']); }
}
```
> Worker ကို **Supervisor/systemd** ဖြင့်ထိန်း၊ Monitoring (Horizon) ထည့် - Linux Lab (M4/A7) နှင့်ချိတ်ပါ။

---

## ၁၃။ Concurrency - Optimistic Locking (Lost Update ကာကွယ်)

**ပြဿနာ:** User A, B နှစ်ယောက်ပေါင်းကြည့်ပြီး A က Save၊ နောက်မှ B က Save - A ၏ ပြင်ဆင်ချက်ပျောက်။

```php
// products table: unsignedInteger('version')->default(1)

public function update(UpdateProductRequest $request, Product $product)
{
    // Client က ကိုယ်မြင်ခဲ့သော version ကို ပို့ရမည် (သို့ If-Match: "3")
    $affected = Product::whereKey($product->id)
        ->where('version', $request->integer('version'))
        ->update($request->safe()->except('version') + ['version' => DB::raw('version + 1')]);

    if ($affected === 0) {
        return response()->json(['message' => 'တစ်ယောက်ယောက်က ပြင်ပြီးသွားပါပြီ၊ Refresh လုပ်ပါ', 'code' => 'VERSION_CONFLICT'], 409);
    }
    return new ProductResource($product->fresh());
}
```

### Pessimistic Lock (Stock လျှော့ရာတွင်)
```php
DB::transaction(function () use ($items) {
    foreach ($items as $i) {
        $p = Product::lockForUpdate()->findOrFail($i['product_id']);      // Row lock - တခြား Transaction စောင့်
        if ($p->stock < $i['qty']) throw new InsufficientStockException($p->id, $p->stock);
        $p->decrement('stock', $i['qty']);
    }
    // Order create ...
});
```
| | Optimistic | Pessimistic |
| :--- | :--- | :--- |
| Conflict နည်း (Edit form) | ✅ | Overkill |
| Conflict များ (Stock, Seat booking) | ❌ Retry များ | ✅ |

---

## ၁၄။ Webhooks (အခြားစနစ်သို့ Event ပို့ / ရယူ)

### (က) Webhook **လက်ခံ** (Stripe/GitHub ကဲ့သို့) - Signature မဖြစ်မနေစစ်
```php
class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload   = $request->getContent();                       // Raw body (JSON decode မလုပ်ရသေး)
        $signature = $request->header('X-Signature');
        $expected  = hash_hmac('sha256', $payload, config('services.partner.webhook_secret'));

        if (! hash_equals($expected, (string) $signature)) {       // Timing-safe compare
            abort(401, 'Invalid signature');
        }

        // Replay attack ကာကွယ် - Timestamp စစ်
        abort_if(abs(time() - (int) $request->header('X-Timestamp')) > 300, 401, 'Stale');

        $event = $request->json('id');
        // Idempotent လုပ် - Event ID တူလျှင် ထပ်မလုပ်
        if (WebhookEvent::where('event_id', $event)->exists()) return response()->noContent();
        WebhookEvent::create(['event_id' => $event, 'payload' => $request->json()->all()]);

        ProcessWebhook::dispatch($event);          // Queue ဖြင့် အလုပ်လုပ်၊ ချက်ချင်း 200 ပြန် (Provider က Timeout မဖြစ်စေ)
        return response()->noContent();
    }
}
```
`bootstrap/app.php`: `$middleware->validateCsrfTokens(except: ['webhooks/*']);`

### (ခ) Webhook **ပို့** (ကိုယ့်စနစ်မှ Customer ထံ)
```php
class SendWebhook implements ShouldQueue
{
    use Queueable;
    public int $tries = 6;
    public function backoff(): array { return [10, 60, 300, 1800, 7200]; }     // Exponential

    public function __construct(public WebhookEndpoint $endpoint, public array $payload) {}

    public function handle(): void
    {
        $body = json_encode($this->payload);
        $sig  = hash_hmac('sha256', $body, $this->endpoint->secret);

        Http::timeout(10)
            ->withHeaders(['X-Signature' => $sig, 'X-Timestamp' => time(), 'Content-Type' => 'application/json'])
            ->withBody($body, 'application/json')
            ->post($this->endpoint->url)
            ->throw();                              // 4xx/5xx = Exception -> Queue က Retry
    }
}
```

---

# ⚫ PROFESSIONAL

## ၁၅။ ပြင်ပ API ကို ခေါ်ခြင်း (Consuming APIs) - `Http` Facade

### အခြေခံ -> Pro
```php
use Illuminate\Support\Facades\Http;

// Basic
$res = Http::get('https://api.example.com/rates', ['base' => 'USD']);
$res->json('rates.JPY');  $res->status();  $res->ok();  $res->failed();  $res->body();

// Token + JSON
Http::withToken($token)->acceptJson()->post($url, ['name' => 'x']);

// Pro Setup: Timeout, Retry, Error Throw
$res = Http::baseUrl('https://api.partner.com/v2')
    ->withToken(config('services.partner.token'))
    ->acceptJson()
    ->timeout(10)                    // စုစုပေါင်း ၁၀ စက္ကန့်
    ->connectTimeout(3)
    ->retry(3, 200, fn ($e, $req) => $e instanceof ConnectionException || $e->response?->serverError(), throw: false)
    ->withHeaders(['X-Request-Id' => request()->header('X-Request-Id')])    // Trace ဆက်
    ->post('/orders', $payload);

$res->throw();       // 4xx/5xx ဆိုလျှင် RequestException
```
> ⚠️ **`timeout()` မထားဘဲ Production မတင်ပါနှင့်။** Default Timeout သည် 30s - ပြင်ပ API နှေးလျှင် ကိုယ့် Worker အားလုံး ပိတ်ဆို့ (Cascading failure)။

### Service Class ဖြင့် ဖုံး (Real-work Pattern)
```php
namespace App\Services\Payment;

class PartnerClient
{
    public function __construct(private readonly PendingRequest $http) {}

    public static function make(): self
    {
        return new self(
            Http::baseUrl(config('services.partner.url'))
                ->withToken(config('services.partner.token'))
                ->acceptJson()->timeout(10)->retry(2, 300)
        );
    }

    public function createCharge(int $amount, string $currency, string $idempotencyKey): array
    {
        $res = $this->http->withHeaders(['Idempotency-Key' => $idempotencyKey])
            ->post('/charges', compact('amount', 'currency'));

        if ($res->status() === 402) throw new CardDeclinedException($res->json('error.message'));
        return $res->throw()->json();
    }
}
```
`config/services.php`
```php
'partner' => ['url' => env('PARTNER_URL'), 'token' => env('PARTNER_TOKEN'), 'webhook_secret' => env('PARTNER_WEBHOOK_SECRET')],
```

### Circuit Breaker (ရိုးရှင်းသောပုံစံ) - ပြင်ပ API ကျနေလျှင် ဆက်မခေါ်
```php
public function rates(): array
{
    if (Cache::get('circuit:fx:open')) {
        return Cache::get('fx:last_good', ['JPY' => 150.0]);               // Fallback
    }

    try {
        $rates = Http::timeout(3)->get('https://fx/rates')->throw()->json('rates');
        Cache::put('fx:last_good', $rates, now()->addHours(6));
        Cache::forget('circuit:fx:failures');
        return $rates;
    } catch (\Throwable $e) {
        $fails = Cache::increment('circuit:fx:failures');
        if ($fails >= 5) Cache::put('circuit:fx:open', true, now()->addMinutes(2));   // ၂ မိနစ် ခေါ်တာရပ်
        report($e);
        return Cache::get('fx:last_good', ['JPY' => 150.0]);
    }
}
```

### Concurrent Requests
```php
$responses = Http::pool(fn (Pool $pool) => [
    $pool->as('user')->get("$base/users/1"),
    $pool->as('orders')->get("$base/orders?user=1"),
    $pool->as('points')->get("$base/points/1"),
]);
$responses['user']->json();
```

### Testing - ပြင်ပ API ကို မခေါ်ဘဲ Fake
```php
Http::fake([
    'api.partner.com/*/charges' => Http::response(['id' => 'ch_1', 'status' => 'paid'], 201),
    'fx/*'                      => Http::sequence()->push(['rates' => ['JPY' => 150]])->pushStatus(500),
    '*'                         => Http::response('', 404),
]);

$result = app(PaymentService::class)->charge($order);

Http::assertSent(fn ($req) => $req->url() === '...' && $req['amount'] === 1500 && $req->hasHeader('Idempotency-Key'));
Http::preventStrayRequests();            // Fake မလုပ်ထားသော Request ဖြစ်လျှင် Test ကျ
```

---

## ၁၆။ API Resources, Validation (အတိုချုပ်)
အသေးစိတ်: [24. Validation, Form Requests & API Resources](/laravel/24_validation_form_requests_and_api_resources/)

**Production Controller (အားလုံးပေါင်းစပ်)**
```php
class OrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:create,App\Models\Order', only: ['store'])];
    }

    public function __construct(private readonly OrderService $orders) {}

    public function index(IndexOrderRequest $request)
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)            // ⚠️ Own data only (IDOR)
            ->with(['items.product:id,name'])
            ->latest('id')
            ->cursorPaginate(min($request->integer('per_page', 20), 100));

        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orders->place($request->user(), $request->validated());   // Business logic -> Service

        return (new OrderResource($order->load('items')))
            ->response()
            ->setStatusCode(201)
            ->header('Location', route('v1.orders.show', $order));
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        return new OrderResource($order->load('items.product'));
    }

    public function cancel(Order $order)
    {
        $this->authorize('cancel', $order);
        $this->orders->cancel($order);
        return new OrderResource($order->refresh());
    }
}
```
Controller သည် **ပါးလွှာ** - Validation (FormRequest)၊ Authorization (Policy)၊ Business Logic (Service)၊ Output (Resource) ကို ခွဲထား။

---

## ၁၇။ API Documentation

### Auto-generate (Code မှ)
| Tool | လက္ခဏာ |
| :--- | :--- |
| **Scramble** (`dedoc/scramble`) | FormRequest/Resource မှ **OpenAPI** အလိုအလျောက်၊ Annotation မလို (အကြံပြု) |
| **Scribe** (`knuckleswtf/scribe`) | Docblock ဖြင့်၊ "Try it out" ပါ |
| L5-Swagger | Annotation များရေးရ |

```bash
composer require dedoc/scramble
# http://localhost:8000/docs/api  ← Interactive docs
```
### Docs တွင်ပါရမည်
- Authentication ပုံစံ (Bearer/Headers)
- Endpoint တစ်ခုချင်း Request/Response ဥပမာ
- Error Code များ၏ စာရင်း
- Rate Limit၊ Pagination ပုံစံ
- Changelog / Deprecation Policy
- Postman Collection / OpenAPI JSON Export

---

## ၁၈။ Observability & Operations

### Request/Response Logging Middleware (Sensitive ဖျော့)
```php
class LogApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);
        $response = $next($request);

        Log::channel('api')->info('api_request', [
            'request_id' => $request->header('X-Request-Id'),
            'user_id'    => $request->user()?->id,
            'method'     => $request->method(),
            'path'       => $request->path(),
            'status'     => $response->getStatusCode(),
            'ms'         => (int) ((microtime(true) - $start) * 1000),
            'ip'         => $request->ip(),
            'body'       => $request->except(['password', 'password_confirmation', 'token', 'card_number']),
        ]);
        return $response;
    }
}
```
`config/logging.php` တွင် `api` channel (daily, JSON formatter) -> Loki/CloudWatch သို့ ([Docker Lab D7](/devops/01_docker_core/12-docker-cicd-monitoring-troubleshooting-real-work-labs/))။

### Health Endpoint
Laravel 11 တွင် `/up` ပါပြီး (`health:` Routing)။ Dependency စစ်လိုလျှင်-
```php
Route::get('/health', function () {
    $checks = [];
    try { DB::select('select 1'); $checks['db'] = 'ok'; } catch (\Throwable) { $checks['db'] = 'fail'; }
    try { Cache::store('redis')->put('h', 1, 5); $checks['redis'] = 'ok'; } catch (\Throwable) { $checks['redis'] = 'fail'; }
    $ok = ! in_array('fail', $checks, true);
    return response()->json(['status' => $ok ? 'ok' : 'degraded'] + $checks, $ok ? 200 : 503);
});
```

### Metrics (RED)
- Request rate, Error rate, Duration (p95) -> Prometheus (Exporter: `spatie/laravel-prometheus`) -> Grafana ([Docker D6](/devops/01_docker_core/12-docker-cicd-monitoring-troubleshooting-real-work-labs/))
- Error Tracking: Sentry / Flare / Bugsnag
- Slow Query: `DB::listen` / Telescope (Dev) / Pulse (Prod)

---

## ၁၉။ Security Checklist (API)

| # | စစ်ချက် |
| :-: | :--- |
| 1 | HTTPS သာ၊ HSTS |
| 2 | Auth: Sanctum Token/Cookie၊ Token Expire |
| 3 | **Authorization: Policy (IDOR)** - Resource တိုင်းတွင် |
| 4 | Input: FormRequest ဖြင့် Whitelist (`validated()` သာသုံး) |
| 5 | Output: Resource ဖြင့် Field Whitelist (`password`, `internal_notes` မပေါက်) |
| 6 | Rate Limit (Login တင်း၊ Expensive Endpoint တင်း) |
| 7 | Mass Assignment: `$fillable` |
| 8 | SQL: Eloquent/Binding သာ၊ `orderBy($request->x)` Whitelist |
| 9 | CORS: Origin ကန့်သတ် (`*` မသုံး၊ Credentials နှင့်) |
| 10 | Sensitive Data Log မထည့် |
| 11 | Error: Production တွင် Stack trace မပြ (`APP_DEBUG=false`) |
| 12 | File Upload: Mime/Size စစ်၊ Public Disk မဟုတ်ဘဲ Signed URL |
| 13 | Webhook: HMAC Signature + Timestamp |
| 14 | Dependency Update: `composer audit` CI တွင် |
| 15 | Pagination `per_page` Max ကန့်သတ် |

---

## ၂၀။ Deprecation & Evolution

### Backward-compatible ပြောင်းလဲမှု (Version မလို)
✅ Field အသစ်ထည့် / Endpoint အသစ်ထည့် / Optional Param ထည့်
❌ Field ဖျက် / နာမည်ပြောင်း / Type ပြောင်း / Required ပြောင်း -> **Breaking -> `/v2`**

### v1 ကို Deprecate လုပ်ခြင်း
```php
class DeprecatedApi
{
    public function handle(Request $request, Closure $next, string $sunset): Response
    {
        $response = $next($request);
        $response->headers->set('Deprecation', 'true');
        $response->headers->set('Sunset', \Carbon\Carbon::parse($sunset)->toRfc7231String());
        $response->headers->set('Link', '</api/v2' . substr($request->getPathInfo(), 7) . '>; rel="successor-version"');
        return $response;
    }
}
// Route::prefix('v1')->middleware('deprecated:2027-03-31')->group(...)
```
**Timeline:** အသိပေး (Email/Docs) -> Deprecation Header -> Usage Metric ကြည့် (ဘယ် Client ကသုံးနေသေးလဲ) -> Sunset -> 410 Gone။

---

## 🏋️ လေ့ကျင့်ခန်းများ (Level အလိုက်)

### 🟢 Beginner
1. `Product` CRUD API ရေး၊ curl ဖြင့်စမ်း၊ မှန်ကန်သော Status Code (201, 204, 404, 422) ပြ။
2. Postman Collection ဖန်တီး (Environment variable `{{base_url}}`, `{{token}}`)။
3. Response တွင် `password` မပါအောင် Resource ကို အရင်ရေးပါ။

### 🟡 Intermediate
4. `/api/v1` နှင့် `/api/v2` ဖန်တီး - V2 တွင် `price` ကို `{amount, currency}` Object ပြောင်း၊ V1 မပျက်ကြောင်း Test။
5. Filter/Sort/Search/Include/Pagination ပါသော `GET /orders` ရေး (Whitelist ပါ)၊ N+1 မရှိကြောင်း `preventLazyLoading` ဖြင့်စစ်။
6. Error Format ကို တစ်ခုတည်းဖြစ်အောင် `withExceptions` ရေး (401/403/404/422/429/500) + Test ၆ ခု။
7. `login` ကို Email+IP အလိုက် Rate-limit၊ ၆ ကြိမ်မြောက်တွင် 429 + `Retry-After` ရကြောင်းစစ်။
8. Plan အလိုက် Rate limit (`tiered`) ရေးပြီး Free/Pro User နှစ်ယောက်ဖြင့် Test။

### 🔴 Advanced
9. `Idempotency-Key` Middleware ရေး၊ တူညီသော Request ၂ ကြိမ်ပို့လျှင် Order ၁ ခုသာ ဖြစ်ကြောင်း (Concurrent ဖြင့်ပါ) Test။
10. `GET /products/{id}` တွင် ETag + `304 Not Modified` ရေး၊ curl `-H 'If-None-Match'` ဖြင့်စစ်။
11. CSV Export ကို `202 Accepted` + Queue Job + Status Polling + Signed Download URL ဖြင့်ရေး။
12. `version` Column ဖြင့် Optimistic Lock (409) ရေး၊ Tab ၂ ခုဖြင့် Conflict စမ်း။
13. Webhook လက်ခံ Endpoint ကို HMAC + Timestamp + Event-ID Idempotency ဖြင့်ရေး၊ Signature မှားလျှင် 401 Test။
14. Stock လျှော့ရာတွင် `lockForUpdate` ဖြင့် Overselling မဖြစ်ကြောင်း Parallel Request (`xargs -P`, `ab`) ဖြင့်စစ်။

### ⚫ Professional
15. `PartnerClient` Service (`Http` + timeout + retry + idempotency) ရေးပြီး `Http::fake` ဖြင့် Test (Success/402/500 retry)။
16. Circuit Breaker ကို ပြင်ပ FX API အတွက်ရေး၊ ၅ ကြိမ်ကျလျှင် Fallback ပြန်ကြောင်း Test။
17. Scramble ဖြင့် OpenAPI Docs ထုတ်ပြီး Frontend/Mobile သို့ JSON Export ပေး။
18. Request Log Middleware + `X-Request-Id` ဖြင့် Loki/Log တွင် Request တစ်ခုကို အစမှအဆုံး ခြေရာခံ။
19. `deprecated:` Middleware ဖြင့် v1 Sunset Header ပေး၊ Usage Metric (Prometheus Counter) ထည့်။
20. **Capstone:** E-commerce API အပြည့် - Auth(Sanctum) + Products(Filter/Page) + Orders(Idempotent, Lock) + Webhook + Rate limit + Policy + Docs + Feature Tests (>80% Coverage) + Docker/CI ([Docker D3-D4](/devops/01_docker_core/12-docker-cicd-monitoring-troubleshooting-real-work-labs/)) ဖြင့် Deploy။

---

## 🎯 အနှစ်ချုပ် - API အရည်အသွေး Checklist

```
 ✅ REST URL/Method/Status Code မှန်
 ✅ Versioned (/v1)
 ✅ Auth (Sanctum) + Authz (Policy)
 ✅ FormRequest (Input) + Resource (Output)
 ✅ Pagination + Filter/Sort (Whitelist)
 ✅ Consistent Error Shape + Request ID
 ✅ Rate Limit (Endpoint အလိုက်)
 ✅ Idempotency (Payment/Order)
 ✅ Queue (Long task) + Webhook (Signed)
 ✅ Timeout/Retry/Circuit (ပြင်ပ API)
 ✅ Docs (OpenAPI) + Tests + Monitoring
```
