---
title: "06. Eloquent ORM and Relationships"
description: "1. [Eloquent ORM ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-eloquent-orm-ဆိုတာဘာလဲ)"
---

## 📊 သင်ခန်းစာ (၆) - Eloquent ORM နှင့် Relationships (ဒေတာဘေ့စ် ကျွမ်းကျင်မှု)
### (Lesson 6: Eloquent ORM, CRUD Mastery, Relationships & Solving N+1 Problem)

---

## 📌 မာတိကာ (Contents)
1. [Eloquent ORM ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-eloquent-orm-ဆိုတာဘာလဲ)
2. [Model Configuration များ (`$fillable`, `$casts`, `$hidden`) ဘာကြောင့် သုံးရသလဲ?](#၂-model-configuration-များ)
3. [Eloquent CRUD Operations (လက်တွေ့ Query ရေးသားနည်းများ)](#၃-eloquent-crud-operations)
4. [Soft Deletes စနစ် (ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၄-soft-deletes-စနစ်)
5. [Eloquent Relationships (1:1, 1:N, N:N ဇယားများ ဆက်သွယ်ခြင်း)](#၅-eloquent-relationships)
6. [N+1 Query Problem ဆိုတာဘာလဲ? Eager Loading ဖြင့် ဖြေရှင်းပုံ](#၆-n1-query-problem-ဆိုတာဘာလဲ)
7. [Local Query Scopes နှင့် Accessors / Mutators](#၇-local-query-scopes-နှင့်-accessors--mutators)

---

## ၁။ Eloquent ORM ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Eloquent ORM (Object-Relational Mapper)** သည် Laravel တွင် မူလပါဝင်သော Database Interaction Layer ဖြစ်သည်။ ၎င်းသည် **Active Record Pattern** ကို လိုက်နာထားပြီး Database Table တစ်ခုချင်းစီကို PHP Class (Model) တစ်ခုအဖြစ် ပြောင်းလဲပေးသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
Pure PHP တွင် `SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC` ကဲ့သို့သော SQL Raw Query များကို စာကြောင်းအရှည်ကြီး ရေးရပြီး SQL Injection အန္တရာယ် ရှိသည်။ Eloquent ဖြင့် Object Oriented ပုံစံ (`User::active()->latest()->get()`) ဖြင့် သန့်ရှင်းစွာ ရေးသားနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Readability**: ကုဒ်ရေးသားရသည်မှာ အင်္ဂလိပ်စာဖတ်ရသကဲ့သို့ ရှင်းလင်းသည်။
* **Automatic Security**: PDO Parameter Binding ကို အလိုအလျောက် အသုံးပြုထားသဖြင့် SQL Injection မှ ကာကွယ်ပေးသည်။
* **Relationship Management**: Table များအကြား ချိတ်ဆက်မှုကို `JOIN` query ရှုပ်ထွေးစွာ ရေးစရာမလိုဘဲ Method တစ်ခုဖြင့် ဆွဲထုတ်နိုင်သည်။

---

## ၂။ Model Configuration များ

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes; // Soft Deletes ထည့်သွင်းခြင်း

    // ၁။ $fillable: User ထံမှ တိုက်ရိုက် လက်ခံမည့် Column များ (Mass Assignment ကာကွယ်ရန်)
    protected $fillable = [
        'category_id',
        'title',
        'price',
        'stock',
        'is_active',
    ];

    // ၂။ $hidden: API JSON ပြောင်းသည့်အခါ လျှို့ဝှက်ချက် Column များကို မပါစေရန်
    protected $hidden = [
        'cost_price',
    ];

    // ၃။ $casts: Database မှ လာသော Data ကို သင့်တော်သော PHP Type သို့ auto ပြောင်းပေးခြင်း
    protected $casts = [
        'price'     => 'decimal:2',
        'stock'     => 'integer',
        'is_active' => 'boolean',
    ];
}
```

---

## ၃။ Eloquent CRUD Operations

```php
// ၁။ Create: အသစ်ထည့်သွင်းခြင်း
$product = Product::create([
    'category_id' => 1,
    'title'       => 'MacBook Air M3',
    'price'       => 3500000,
    'stock'       => 10,
]);

// ၂။ Read: ရှာဖွေခြင်း (မရှိပါက 404 Page auto ပြပေးသည်)
$product = Product::findOrFail($id);
$featured = Product::where('price', '>', 500000)->where('is_active', true)->paginate(15);

// ၃။ Update: ပြင်ဆင်ခြင်း
$product = Product::findOrFail($id);
$product->update(['price' => 3400000]);

// ၄။ Delete: ဖျက်ခြင်း
$product = Product::findOrFail($id);
$product->delete();
```

---

## ၄။ Soft Deletes စနစ်

### (က) ဘာကြောင့် သုံးရသလဲ?
Customer သို့မဟုတ် Admin က အရေးကြီးသော Order သို့မဟုတ် User အကောင့်ကို မတော်တဆ ဖျက်မိသည့်အခါ Database ထဲမှ အပြီးတိုင် ပျောက်ဆုံးမသွားစေဘဲ `deleted_at` တွင် အချိန်မှတ်သားထားရန် ဖြစ်သည်။

### (ခ) အားသာချက်:
အမှားပြင်ဆင်ပြီး `restore()` ဖြင့် အချိန်မရွေး ပြန်လည် အသက်သွင်းနိုင်သည်။

```php
// ပုံမှန် Query လုပ်ပါက Soft-deleted record များ မပါလာပါ
$products = Product::all();

// ဖျက်ထားသော ဒေတာများပါ ပြန်ဖတ်လိုပါက:
$allWithTrash = Product::withTrashed()->get();

// အမှားပြင်ဆင်ပြီး ပြန်လည် အသက်သွင်းခြင်း:
$product->restore();

// Database ထဲမှ အပြီးတိုင် ဖျက်ပစ်ခြင်း:
$product->forceDelete();
```

---

## ၅။ Eloquent Relationships

### (က) One-to-Many (1:N)
Category တစ်ခုတွင် Products များစွာ ရှိသည်။ Product တစ်ခုသည် Category တစ်ခုအောက်တွင် ရှိသည်။

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

### (ခ) Many-to-Many (N:N)
Order တစ်ခုတွင် Products များစွာ ပါဝင်နိုင်ပြီး Product တစ်ခုသည် Orders များစွာတွင် ပါဝင်နိုင်သည်။ (Pivot Table: `order_items`)

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

## ၆။ N+1 Query Problem ဆိုတာဘာလဲ?

### (က) ဘာကြောင့် ဖြစ်ပွားရသလဲ?
Loop ပတ်ပြီး Relationship ကို ခေါ်မိသဖြင့် Database Query ပေါင်း ရာနှင့်ချီ ခေါ်ယူကာ Server လေးလံသွားခြင်း (Lazy Loading Problem) ဖြစ်သည်။

```php
// ❌ ညံ့ဖျင်းသော နည်းလမ်း (Queries ၁၀၁ ကြိမ် - Slow)
$products = Product::all(); // Query 1 ကြိမ်
foreach ($products as $product) {
    echo $product->category->name; // Loop တိုင်းအတွက် Query 1 ခုစီ ထပ်ခေါ်သည် (N ကြိမ်)
}

// ✅ အလွန်မြန်ဆန်သော နည်းလမ်း (Eager Loading - Queries ၂ ကြိမ်သာ run သည်)
$products = Product::with('category')->get();
foreach ($products as $product) {
    echo $product->category->name; // Memory ထဲမှ ချက်ချင်းယူသုံးသည်
}
```

---

## ၇။ Local Query Scopes နှင့် Accessors / Mutators

### (က) Local Query Scopes (ထပ်ခါတလဲလဲ သုံးရသော Query များကို စုစည်းခြင်း)
* **ဘာကြောင့် သုံးရသလဲ**: `where('is_active', true)->where('stock', '>', 0)` ကဲ့သို့ ရှည်လျားသော condition များကို Controller တိုင်းတွင် ထပ်ခါတလဲလဲ မရေးရစေရန်။

```php
// app/Models/Product.php
public function scopeAvailable($query)
{
    return $query->where('is_active', true)->where('stock', '>', 0);
}

// Controller တွင် သုံးစွဲပုံ:
$products = Product::available()->latest()->get();
```

### (ခ) Accessors (Data ကို ဆွဲထုတ်ချိန်တွင် ပြုပြင်ပြသခြင်း)
```php
use Illuminate\Database\Eloquent\Casts\Attribute;

// $product->formatted_price ဟု ခေါ်ယူနိုင်သည်
protected function formattedPrice(): Attribute
{
    return Attribute::make(
        get: fn () => number_format($this->price) . ' MMK'
    );
}
```
