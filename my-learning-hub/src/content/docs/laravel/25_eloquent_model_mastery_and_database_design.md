---
title: "25. Eloquent Model Mastery & Database Design (データベース設計)"
description: "Laravel Eloquent Model စနစ်အပြည့်အစုံ၊ Model Settings, Casts, Mutators, Scopes, Observers နှင့် Database Design (データベース設計) အခြေခံမှ အဆင့်မြင့်အထိ စဉ်းစားပုံ၊ Indexing Strategy နှင့် Real-work ဥပမာများ"
---

> Laravel 11 / 12 အခြေခံ။
> Enterprise System များတွင် Code ရေးသားခြင်းထက် **Database Design (データベース設計)** နှင့် **Eloquent Model Architecture** မှန်ကန်ရန် ပို၍ အရေးကြီးပါသည်။ ဤသင်ခန်းစာတွင် Model တစ်ခုချင်းစီ၏ Core Settings များနှင့် Database ပုံစံထုတ်လုပ်နည်း (ERD, Normalization, Indexing) ကို အသေးစိတ် ရှင်းလင်းထားသည်။

---

## 🧭 မာတိကာ (Table of Contents)
1. [Eloquent Model Core Settings & Configurations](#၁-eloquent-model-core-settings--configurations)
2. [Modern Attribute Casts & Custom Cast Classes (Laravel 11+)](#၂-modern-attribute-casts--custom-cast-classes-laravel-11)
3. [Accessors, Mutators & Virtual Attributes](#၃-accessors-mutators--virtual-attributes)
4. [Local Scopes & Global Scopes (Multi-Tenancy)](#၄-local-scopes--global-scopes-multi-tenancy)
5. [Model Events, Observers & Model Pruning](#၅-model-events-observers--model-pruning)
6. [Database Design (データベース設計) စဉ်းစားတွေးခေါ်ပုံ အဆင့် ၄ ဆင့်](#၆-database-design-データベース設計-စဉ်းစားတွေးခေါ်ပုံ-အဆင့်-၄-ဆင့်)
7. [Normalization (1NF, 2NF, 3NF) နှင့် Denormalization ချိန်ခွင်လျှာ](#၇-normalization-1nf-2nf-3nf-နှင့်-denormalization-ချိန်ခွင်လျှာ)
8. [Database Indexing Strategy (B-Tree, Composite Indexes & Cardinality)](#၈-database-indexing-strategy-b-tree-composite-indexes--cardinality)
9. [Soft Deletes ၏ အားသာချက်နှင့် Unique Index ပြဿနာ ဖြေရှင်းနည်း](#၉-soft-deletes-၏-အားသာချက်နှင့်-unique-index-ပြဿနာ-ဖြေရှင်းနည်း)
10. [Real-World E-Commerce Database Schema Design Example](#၁၀-real-world-e-commerce-database-schema-design-example)
11. [လေ့ကျင့်ခန်းများ (Hands-on Exercises)](#၁၁-လေ့ကျင့်ခန်းများ-hands-on-exercises)

---

## ၁။ Eloquent Model Core Settings & Configurations

Eloquent Model တစ်ခုကို တည်ဆောက်ရာတွင် Default Convention များကို နားလည်ပြီး လိုအပ်ပါက စိတ်ကြိုက် ပြင်ဆင်သတ်မှတ်နိုင်ရမည်-

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    // ၁။ Table Name သတ်မှတ်ခြင်း (Default: orders)
    protected $table = 'ec_orders';

    // ၂။ Primary Key သတ်မှတ်ခြင်း (Default: id)
    protected $primaryKey = 'order_id';

    // ၃။ Auto-Incrementing Key ဟုတ်/မဟုတ် (UUID သုံးပါက false ပေးရမည်)
    public $incrementing = true;
    protected $keyType = 'int'; // UUID ဆိုပါက 'string'

    // ၄။ Timestamps (created_at, updated_at မလိုပါက false ပေးနိုင်သည်)
    public $timestamps = true;
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    // ၅။ Database Connection ခွဲခြားခြင်း (Multi-Database Setup)
    protected $connection = 'mysql_read_replica';

    // ၆။ Default Attributes (Row အသစ်ဆောက်ချိန်တွင် Default တန်ဖိုး)
    protected $attributes = [
        'status' => 'pending',
        'currency' => 'MMK',
    ];

    // ၇။ Mass Assignment Security (Fillable vs Guarded)
    // ⚠️ အကြံပြုချက်: အမြဲ $fillable သာ သုံးပါ! $guarded = [] မသုံးပါနှင့်။
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'shipping_address',
        'paid_at',
    ];

    // ၈။ JSON/Array သို့ ပြောင်းချိန်တွင် မမြင်စေချင်သော Column များ (Security Masking)
    protected $hidden = [
        'payment_gateway_secret',
    ];
}
```

---

## ၂။ Modern Attribute Casts & Custom Cast Classes (Laravel 11+)

Laravel 11 တွင် Attribute Casting ကို Method အနေဖြင့် ရေးသားနိုင်သော **`casts()` Method** သို့ အဆင့်မြှင့်တင်ထားပါသည်။

### (က) Built-in Modern Casts
```php
protected function casts(): array
{
    return [
        'is_active'         => 'boolean',
        'paid_at'           => 'datetime:Y-m-d H:i:s',
        'options'           => 'array',         // JSON -> PHP Array
        'metadata'          => 'collection',    // JSON -> Laravel Collection
        'price'             => 'integer',
        'total_amount'      => 'decimal:2',
        'password'          => 'hashed',        // Create/Update တွင် Auto Hash ပေးသည်
        'status'            => OrderStatus::class, // PHP 8.1+ Backed Enum
    ];
}
```

### (ခ) Custom Value Object Cast (Real-World: Money / Currency)
Database ထဲတွင် Cents/Kyats (Integer) အဖြစ် သိမ်းပြီး Code ထဲတွင် Object အဖြစ် အသုံးပြုခြင်း:
```php
namespace App\Casts;

use App\ValueObjects\Money;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class MoneyCast implements CastsAttributes
{
    // DB -> Model (Getter)
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Money
    {
        return isset($value) ? new Money((int) $value, $attributes['currency'] ?? 'MMK') : null;
    }

    // Model -> DB (Setter)
    public function set(Model $model, string $key, mixed $value, array $attributes): ?int
    {
        if ($value instanceof Money) {
            return $value->getAmountInCents();
        }
        return (int) $value;
    }
}
```
Model ထဲတွင် သုံးပုံ:
```php
protected function casts(): array
{
    return [
        'total_amount' => MoneyCast::class,
    ];
}
```

---

## ၃။ Accessors, Mutators & Virtual Attributes

Laravel 9+ မှ စတင်၍ `Attribute` Class ဖြင့် သန့်ရှင်းစွာ ရေးသားနိုင်သည်:

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    // Accessor + Mutator (Full Name)
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower(trim($value)),
        );
    }

    // Virtual Attribute (Database ထဲတွင် Column အစစ်မရှိပါ)
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->name} (@{$this->username})",
        );
    }
}
```
> Virtual Attribute များကို JSON ထဲ ပါဝင်စေချင်ပါက `$appends = ['display_name'];` ဟု ထည့်သွင်းပေးရမည်။

---

## ၄။ Local Scopes & Global Scopes (Multi-Tenancy)

### (က) Local Scopes (Reusable Query Conditions)
Query များကို ထပ်ခါထပ်ခါ မရေးရစေရန် Model ထဲတွင် စုစည်းထားခြင်း:
```php
class Order extends Model
{
    // scopeName ပုံစံဖြင့် ရေးရသည်
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCreatedBetween($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }
}

// အသုံးပြုပုံ:
$monthlyRevenue = Order::completed()
    ->createdBetween(now()->startOfMonth(), now()->endOfMonth())
    ->sum('total_amount');
```

### (ခ) Global Scopes (Multi-Tenant Data Isolation)
Company တစ်ခုချင်းစီ၏ Data မရောနှောစေရန် User ၏ `company_id` အလိုက် အမြဲတမ်း အလိုအလျောက် Filter စစ်ထုတ်ပေးခြင်း:

```php
namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (auth()->check() && auth()->user()->company_id) {
            $builder->where('company_id', auth()->user()->company_id);
        }
    }
}
```
Model တွင် တပ်ဆင်ပုံ:
```php
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Product extends Model
{
    // ...
}

// အထူးကိစ္စရပ်များ (Super Admin) တွင် Global Scope ကို ခေတ္တ ဖြုတ်လိုပါက:
$allProducts = Product::withoutGlobalScope(TenantScope::class)->get();
```

---

## ၅။ Model Events, Observers & Model Pruning

### (က) Model Events & Observers
Database ထဲသို့ Record ဝင်ခြင်း/ပြင်ခြင်း/ဖျက်ခြင်း အချိန်များတွင် Side-effects (ဥပမာ: Audit Log, Cache Clear) ပြုလုပ်ရန်:

```bash
php artisan make:observer OrderObserver --model=Order
```

`app/Observers/OrderObserver.php`
```php
namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class OrderObserver
{
    public function creating(Order $order): void
    {
        // Save မလုပ်မီ အလိုအလျောက် UUID / Reference Code ထည့်ခြင်း
        $order->order_number = 'ORD-' . strtoupper(uniqid());
    }

    public function updated(Order $order): void
    {
        // Status ပြောင်းသွားပါက Cache ရှင်းလင်းခြင်း
        if ($order->isDirty('status')) {
            Cache::forget("user_orders_{$order->user_id}");
            Log::info("Order #{$order->id} status changed to {$order->status}");
        }
    }

    public function deleted(Order $order): void
    {
        // ဖျက်လိုက်ပါက သက်ဆိုင်ရာ Order Items များကို ရှင်းလင်းခြင်း
        $order->items()->delete();
    }
}
```
> Laravel 11 တွင် `#[ObservedBy([OrderObserver::class])]` Attribute ဖြင့် Model အပေါ်တွင် တိုက်ရိုက် ကြေညာနိုင်သည်။

### (ခ) Automatic Model Pruning (Data အဟောင်းများ အလိုအလျောက် ရှင်းလင်းခြင်း)
Log များ၊ Expired Token များကို Scheduler ဖြင့် နေ့စဉ် Auto ရှင်းလင်းရန်:
```php
use Illuminate\Database\Eloquent\Prunable;

class ApiLog extends Model
{
    use Prunable;

    // ရက်ပေါင်း ၃၀ ကျော်သွားသော Record များကို အလိုအလျောက် ဖျက်မည်
    public function prunable()
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }
}
```
Scheduler ထဲတွင် `Schedule::command('model:prune')->daily();` Run ထားရုံပင် ဖြစ်သည်။

---

## ၆။ Database Design (データベース設計) စဉ်းစားတွေးခေါ်ပုံ အဆင့် ၄ ဆင့်

ဂျပန် IT စံနှုန်း (Database 設計 - Sekkei) တွင် စနစ်တစ်ခုကို စတင်တည်ဆောက်လျှင် အောက်ပါအဆင့် ၄ ဆင့်အတိုင်း စနစ်တကျ စဉ်းစားရပါသည်-

```
 1. 要件定義 (Requirements) ──► မည်သည့် ဒေတာများကို သိမ်းဆည်းရန် လိုအပ်သနည်း?
         │
 2. 概念設計 (Conceptual)   ──► ပင်မ Entity များ (Users, Orders, Products) ကို သတ်မှတ်ပြီး ERD ဆွဲခြင်း
         │
 3. 論理設計 (Logical)      ──► Normalization (1NF ~ 3NF) ပြုလုပ်ခြင်း၊ Primary/Foreign Keys သတ်မှတ်ခြင်း
         │
 4. 物理設計 (Physical)     ──► Data Type (INT, VARCHAR), Storage Engine, Indexing, Partitioning သတ်မှတ်ခြင်း
```

### 🧠 စဉ်းစားတွေးခေါ်ပုံ ဥပမာ (Thinking Logic)
* **မေးခွန်း (၁):** ပစ္စည်းတစ်ခု၏ ဈေးနှုန်း (Price) သည် ပြောင်းလဲနိုင်သလား?
  * *တွေးခေါ်မှု:* ကုန်ပစ္စည်းဈေးနှုန်းသည် နောင်တစ်ချိန်တွင် တက်နိုင်/ကျနိုင်သည်။ သို့သော် လွန်ခဲ့သော ၆ လက ဝယ်ယူခဲ့သော Order ထဲမှ ဈေးနှုန်းသည် မပြောင်းလဲဘဲ မူလအတိုင်း ကျန်ရစ်ရမည်။
  * *ဒီဇိုင်းအဖြေ:* `products` table တွင် `price` ထားသကဲ့သို့ `order_items` table တွင်လည်း ဝယ်ယူခဲ့သည့်အချိန်က ဈေးနှုန်းဖြစ်သော `unit_price` column ကို ထည့်သွင်းထားရမည် (Snapshot pattern)။

---

## ၇။ Normalization (1NF, 2NF, 3NF) နှင့် Denormalization ချိန်ခွင်လျှာ

### (က) 1NF (First Normal Form) - Atomic Values
* Column တစ်ခုတည်းတွင် တန်ဖိုးများစွာ (ဥပမာ: ကော်မာခံပြီး `phone1, phone2` သို့မဟုတ် `item1, item2`) မသိမ်းရ။ Row တစ်ခုချင်းစီ ခွဲထုတ်ရမည်။

### (ခ) 2NF (Second Normal Form) - No Partial Dependency
* Composite Primary Key ရှိပါက ကျန် column များသည် Key အစိတ်အပိုင်း တစ်ခုတည်းအပေါ် မမှီခိုရပါ။ Key အားလုံးအပေါ် အပြည့်အဝ မှီခိုရမည်။

### (ဂ) 3NF (Third Normal Form) - No Transitive Dependency
* Non-key column တစ်ခုသည် အခြား Non-key column တစ်ခုအပေါ် မမှီခိုရပါ။ (ဥပမာ: `user_id` -> `city_id` -> `city_name` ဖြစ်နေပါက `city_name` ကို `users` table ထဲ မထည့်ရဘဲ `cities` table သီးသန့် ခွဲထုတ်ရမည်)။

### ⚖️ Denormalization (ရည်ရွယ်ချက်ရှိရှိ 3NF ကို ဖောက်ဖျက်ခြင်း)
အမြဲတမ်း 3NF အထိ သွားပါက Table Join များလွန်းပြီး Query နှေးသွားနိုင်သည်။ Read-Heavy ဖြစ်သော Dashboard များ၊ High-traffic API များတွင် **စုစုပေါင်းတန်ဖိုး (Total Amount, Items Count)** များကို ပင်မ Table တွင် ရည်ရွယ်ချက်ရှိရှိ ပူးတွဲသိမ်းဆည်းကြသည် (Denormalization)။

---

## ၈။ Database Indexing Strategy (B-Tree, Composite Indexes & Cardinality)

Index ဆိုသည်မှာ စာအုပ်တစ်အုပ်၏ နောက်ကျောဘက်ရှိ **မာတိကာ အညွှန်း (Index Table)** နှင့် တူသည်။ မာတိကာ မရှိပါက စာမျက်နှာ ၁ သန်းကို တစ်မျက်နှာချင်း လှန်ဖတ်ရမည် (**Full Table Scan** ဖြစ်ပြီး Server CPU 100% တက်သွားစေသည်)။

```
 [Full Table Scan - နှေးသည်]           [Index Search (B-Tree) - မြန်သည်]
 ┌─────────────────────────┐           ┌─────── Root Node ───────┐
 │ Row 1 ──► စစ်ဆေး        │           │        [50 | 100]       │
 │ Row 2 ──► စစ်ဆေး        │           └──┬──────────┬─────────┬─┘
 │ ...                     │              ▼          ▼         ▼
 │ Row 1,000,000 ──► စစ်ဆေး│          [0..49]   [50..99]   [100+]
 └─────────────────────────┘          (၃ ဆင့်ခန့် ရှာရုံဖြင့် ချက်ချင်းတွေ့နိုင်သည်)
```

### (က) ဘယ် Column တွေကို Index ထည့်သင့်သလဲ?
1. `WHERE` clause တွင် အမြဲ အသုံးပြုသော column များ (ဥပမာ: `status`, `email`, `created_at`)
2. `JOIN` ချိတ်ဆက်ရာတွင် သုံးသော Foreign Key များ (`user_id`, `order_id`)
3. `ORDER BY` တွင် မကြာခဏ အသုံးပြုသော column များ

### (ခ) Composite Index (Column အများအပြား ပေါင်းစပ် Index)
အကယ်၍ Query က `WHERE user_id = 5 AND status = 'paid'` ဟု မကြာခဏ ရှာဖွေပါက:
```php
// Single index ၂ ခုထက် Composite index ၁ ခုက အဆပေါင်းများစွာ ပိုမြန်သည်
$table->index(['user_id', 'status']);
```

### (ဂ) Index Order စည်းမျဉ်း (Leftmost Prefix Rule)
Composite Index `['user_id', 'status', 'created_at']` ရှိပါက:
* ✅ `WHERE user_id = 1` -> Index အလုပ်လုပ်သည်။
* ✅ `WHERE user_id = 1 AND status = 'paid'` -> Index အလုပ်လုပ်သည်။
* ❌ `WHERE status = 'paid'` -> **Index အလုပ်မလုပ်ပါ!** (user_id မပါသောကြောင့်)

### (ဃ) High Cardinality vs Low Cardinality
* **High Cardinality (Index ထည့်သင့်သည်)**: တန်ဖိုး အမျိုးကွဲ အလွန်များသော column များ (ဥပမာ: `email`, `uuid`, `user_id`)
* **Low Cardinality (Index မထည့်သင့်ပါ)**: တန်ဖိုး အမျိုးကွဲ နည်းပါးသော column များ (ဥပမာ: `gender` [M/F], `is_active` [0/1])။ ၎င်းတို့ကို Index ပေးပါက B-Tree ထိရောက်မှု မရှိဘဲ Disk နေရာသာ ကုန်စေသည်။

---

## ၉။ Soft Deletes ၏ အားသာချက်နှင့် Unique Index ပြဿနာ ဖြေရှင်းနည်း

### ပြဿနာ-
User တစ်ယောက်ကို Soft Delete လုပ်လိုက်သည် (`deleted_at = '2026-10-23 00:00:00'`)။ ထို User ၏ Email ဖြင့် အသစ်တစ်ယောက်က ပြန်လည် Register လုပ်ပါက Database တွင် `unique('email')` ရှိနေသဖြင့် **SQL Duplicate Entry Error** တက်မည်။

### အဖြေ (၁) - Composite Unique Index (MySQL)
Migration တွင် Email နှင့် `deleted_at` ကို ပေါင်းစပ် Unique ပေးခြင်း:
```php
// MySQL တွင် null တန်ဖိုးများသည် unique index တွင် တစ်ခုနှင့်တစ်ခု တူညီသည်ဟု မသတ်မှတ်ပါ
$table->unique(['email', 'deleted_at']);
```

### အဖြေ (၂) - Validation Rule တွင် Soft Deletes ချန်လှပ်ခြင်း
```php
use Illuminate\Validation\Rule;

'email' => [
    'required',
    'email',
    Rule::unique('users')->whereNull('deleted_at'),
],
```

---

## ၁၀။ Real-World E-Commerce Database Schema Design Example

အောက်ပါ Schema သည် လုပ်ငန်းသုံး E-Commerce System တစ်ခုအတွက် အဆင့်မြင့် ဒီဇိုင်းထုတ်ထားသော ဥပမာ ဖြစ်ပါသည်:

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│      users       │       │        orders        │       │     order_items      │
├──────────────────┤       ├──────────────────────┤       ├──────────────────────┤
│ id (PK)          │1     *│ id (PK)              │1     *│ id (PK)              │
│ name             │───────│ user_id (FK)         │───────│ order_id (FK)        │
│ email            │       │ order_number (UQ)    │       │ product_id (FK)      │
│ password         │       │ total_amount         │       │ unit_price           │
│ deleted_at       │       │ status (INDEX)       │       │ quantity             │
└──────────────────┘       │ created_at (INDEX)   │       │ subtotal             │
                           └──────────────────────┘       └──────────┬───────────┘
                                                                     │*
                                                                     │
                                                          ┌──────────┴───────────┐
                                                          │       products       │
                                                          ├──────────────────────┤
                                                          │ id (PK)              │1
                                                          │ sku (UQ)             │
                                                          │ name                 │
                                                          │ price                │
                                                          │ stock                │
                                                          │ is_active (INDEX)    │
                                                          └──────────────────────┘
```

### Migration Code အပြည့်အစုံ:
```php
// 1. Orders Table
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('order_number', 32)->unique();
    $table->unsignedInteger('total_amount'); // In cents/Kyats
    $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'cancelled', 'refunded'])->default('pending');
    $table->string('shipping_address', 500);
    $table->timestamp('paid_at')->nullable();
    $table->timestamps();
    $table->softDeletes();

    // Composite Index for Dashboard Filtering
    $table->index(['user_id', 'status', 'created_at']);
});

// 2. Order Items Table
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->unsignedInteger('unit_price'); // Snapshot Price
    $table->unsignedSmallInteger('quantity');
    $table->unsignedInteger('subtotal');
    $table->timestamps();

    $table->index(['order_id', 'product_id']);
});
```

---

## ၁၁။ လေ့ကျင့်ခန်းများ (Hands-on Exercises)

### 🏋️ လေ့ကျင့်ခန်း (၁) - Custom Currency Cast
`MoneyCast` ကို အသုံးပြုပြီး Database တွင် `150000` ဟု သိမ်းထားသော်လည်း Model ခေါ်ယူချိန်တွင် `150,000 MMK` ဟု Format ချပေးသော Cast တစ်ခု ရေးသားပါ။

### 🏋️ လေ့ကျင့်ခန်း (၂) - Global Tenant Isolation
`Company` ပိုင်ဆိုင်သော `Invoice` Model အတွက် `TenantScope` တစ်ခု ပြုလုပ်ပြီး User တစ်ယောက်သည် မိမိ Company ပိုင်ဆိုင်သော Invoices များကိုသာ အမြဲတမ်း Query ရရှိစေရန် စမ်းသပ်ပါ။

### 🏋️ လေ့ကျင့်ခန်း (၃) - EXPLAIN Query Analysis
MySQL Terminal (သို့မဟုတ် phpMyAdmin) တွင် `EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 'paid'` ကို Run ကြည့်ပြီး Index မထည့်မီ (`type = ALL`) နှင့် Composite Index ထည့်ပြီးနောက် (`type = ref`) ခြားနားချက်ကို တိုင်းတာပါ။
