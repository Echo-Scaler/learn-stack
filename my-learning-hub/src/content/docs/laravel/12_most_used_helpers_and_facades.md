---
title: "12. Helpers and Facades"
description: "1. [Facades နှင့် Helper Functions သဘောတရား (ဘာကြောင့် သုံးရသလဲ?)](#၁-facades-နှင့်-helper-functions-သဘောတရား)"
---

## 🛠️ သင်ခန်းစာ (၁၂) - လုပ်ငန်းခွင်သုံး Built-in Helpers, Collections နှင့် Facades
### (Lesson 12: Master Laravel Collections, String/Array Helpers, Carbon & Facades)

---

## 📌 မာတိကာ (Contents)
1. [Facades နှင့် Helper Functions သဘောတရား (ဘာကြောင့် သုံးရသလဲ?)](#၁-facades-နှင့်-helper-functions-သဘောတရား)
2. [Laravel Collections စွမ်းအားနှင့် မဖြစ်မနေသိရမည့် Methods များ](#၂-laravel-collections-စွမ်းအား)
3. [String Helpers (`Str` Facade) အသုံးချပုံများ](#၃-string-helpers-str-facade)
4. [Array Helpers (`Arr` Facade) အသုံးချပုံများ](#၄-array-helpers-arr-facade)
5. [Carbon ဖြင့် Date & Time တွက်ချက်စီမံခြင်း](#၅-carbon-ဖြင့်-date--time-တွက်ချက်စီမံခြင်း)
6. [နေ့စဉ် မသုံးမဖြစ် General Helper Functions စာရင်း](#၆-နေ့စဉ်-မသုံးမဖြစ်-general-helper-functions)

---

## ၁။ Facades နှင့် Helper Functions သဘောတရား

### (က) ဒါက ဘာလဲ? (What is it?)
* **Facades**: Service Container ထဲရှိ ရှုပ်ထွေးသော Class များကို Static Interface ပုံစံဖြင့် လွယ်ကူစွာ ခေါ်သုံးနိုင်စေသော စနစ်ဖြစ်သည် (ဥပမာ- `Cache::get()`, `Route::get()`, `DB::table()`)။
* **Global Helpers**: မည်သည့်နေရာတွင်မဆို `use` ရေးစရာမလိုဘဲ တိုက်ရိုက် ခေါ်သုံးနိုင်သော PHP functions များဖြစ်သည် (ဥပမာ- `now()`, `dd()`, `auth()`)။

### (ခ) အသုံးပြုခြင်း၏ အားသာချက်များ:
ကုဒ်လိုင်းတိုပြီး ဖတ်ရလွယ်ကူစေကာ Developer Productivity ကို အထူးမြှင့်တင်ပေးသည်။

---

## ၂။ Laravel Collections စွမ်းအား

### (က) ဘာကြောင့် သုံးရသလဲ?
PHP ၏ မူလ Array functions များ (`array_map`, `array_filter`) သည် argument အစီအစဉ် ရှုပ်ထွေးသည်။ Laravel Collections သည် Method Chaining (`$data->filter()->pluck()->sum()`) ဖြင့် စာကြောင်းတစ်ကြောင်းတည်း သန့်ရှင်းစွာ တွက်ချက်နိုင်သည်။

```php
$products = collect([
    ['id' => 1, 'name' => 'MacBook Air', 'price' => 1200, 'category' => 'Laptop', 'active' => true],
    ['id' => 2, 'name' => 'Dell XPS',     'price' => 1500, 'category' => 'Laptop', 'active' => false],
    ['id' => 3, 'name' => 'Magic Mouse',  'price' => 80,   'category' => 'Accessory', 'active' => true],
]);

// ၁။ filter(): သတ်မှတ်ချက်နှင့် ကိုက်ညီသော ဒေတာများသာ ရွေးထုတ်ခြင်း
$activeItems = $products->filter(fn($item) => $item['active']);

// ၂။ pluck(): သီးသန့် Column တစ်ခုတည်းကိုသာ Array အဖြစ် ယူခြင်း
$names = $products->pluck('name'); // ['MacBook Air', 'Dell XPS', 'Magic Mouse']

// ၃။ sum(): စုစုပေါင်း ဈေးနှုန်း တွက်ချက်ခြင်း
$total = $products->sum('price'); // 2780

// ၄။ groupBy(): အုပ်စုခွဲခြင်း
$grouped = $products->groupBy('category');
```

---

## ၃။ String Helpers (`Str` Facade)

```php
use Illuminate\Support\Str;

// ၁။ URL Slug ဖန်တီးခြင်း (SEO Friendly URL အတွက်)
$slug = Str::slug('Laravel 11 Master Course'); // 'laravel-11-master-course'

// ၂။ စာလုံးရေ အရှည်ဖြတ်တောက်ခြင်း (Excerpt)
$summary = Str::limit('ဤသင်တန်းသည် အလွန်အသုံးဝင်သော...', 20);

// ၃။ Unique UUID ထုတ်ခြင်း
$uuid = Str::uuid();

// ၄။ လျှို့ဝှက်အချက်အလက် ကြယ်ပွင့်ဖုံးအုပ်ခြင်း (Masking)
$masked = Str::mask('john.doe@example.com', '*', 3, 5); // 'joh*****@example.com'
```

---

## ၄။ Array Helpers (`Arr` Facade)

```php
use Illuminate\Support\Arr;

$data = [
    'user' => ['name' => 'Mg Mg', 'address' => ['city' => 'Yangon']]
];

// Dot notation ဖြင့် Nested Array ဒေတာ ဆွဲထုတ်ခြင်း
$city = Arr::get($data, 'user.address.city', 'Default'); // 'Yangon'

// လိုအပ်သော Keys သာ ရွေးယူခြင်း
$filtered = Arr::only($data, ['user']);
```

---

## ၅။ Carbon ဖြင့် Date & Time တွက်ချက်စီမံခြင်း

```php
use Carbon\Carbon;

// လက်ရှိ အချိန်
$now = now();

// လူနားလည်လွယ်သော အချိန်ဖော်ပြချက် (Facebook Style)
$postTime = Carbon::parse('2026-09-23 10:00:00');
echo $postTime->diffForHumans(); // "2 hours ago"

// ရက်များ ပေါင်းခြင်း
$expire = now()->addDays(30);

// အတိတ်/အနာဂတ် စစ်ဆေးခြင်း
if ($expire->isFuture()) {
    echo "သက်တမ်း ရှိပါသေးသည်";
}
```

---

## ၆။ နေ့စဉ် မသုံးမဖြစ် General Helper Functions

| Helper | ဘာကြောင့် သုံးရသလဲ | ဥပမာ ကုဒ် |
| :--- | :--- | :--- |
| `dd($val)` | Dump and Die (ကုဒ်ရပ်ပြီး Debug ကြည့်ရန်) | `dd($user);` |
| `logger('Text')` | Error Log ဖိုင်ထဲ အချက်အလက် သိမ်းရန် | `logger('Payment failed');` |
| `auth()->user()` | လက်ရှိ Login ဝင်ထားသော User ကို ယူရန် | `$name = auth()->user()->name;` |
| `redirect()->back()` | မူလ စာမျက်နှာဟောင်းသို့ ပြန်ပို့ရန် | `return redirect()->back();` |
| `abort(404)` | HTTP Error Page အား ချက်ချင်း ထုတ်ပြရန် | `abort(404, 'Page Not Found');` |
| `asset('img/logo.png')` | Public Assets ၏ URL အပြည့်အစုံ ယူရန် | `<img src="{{ asset('img/logo.png') }}">` |
