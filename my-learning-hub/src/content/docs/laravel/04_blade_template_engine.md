---
title: "04. Blade Template Engine"
description: "1. [Blade Template Engine ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-blade-template-engine-ဆိုတာဘာလဲ)"
---

## 🎨 သင်ခန်းစာ (၄) - Blade Template Engine (Frontend UI တည်ဆောက်ခြင်း)
### (Lesson 4: Master Blade Templating, Layouts, Components & Directives)

---

## 📌 မာတိကာ (Contents)
1. [Blade Template Engine ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-blade-template-engine-ဆိုတာဘာလဲ)
2. [Layout Inheritance (`@extends`, `@yield`, `@section`)](#၂-layout-inheritance-extends-yield-section)
3. [Modern Blade Components နှင့် Slots (`<x-component>`)](#၃-modern-blade-components-နှင့်-slots)
4. [မဖြစ်မနေ သိထားရမည့် Blade Directives များ (ဘာကြောင့် သုံးရသလဲ?)](#၄-မဖြစ်မနေ-သိထားရမည့်-blade-directives-များ)
5. [The `$loop` Variable ၏ အစွမ်းနှင့် အားသာချက်များ](#၅-the-loop-variable-၏-အစွမ်း)
6. [Data Displaying & XSS Security (`{{ }}` vs `{!! !!}`)](#၆-data-displaying--xss-security)
7. [လက်တွေ့ Dashboard Layout တည်ဆောက်ပုံ နမူနာ](#၇-လက်တွေ့-dashboard-layout-တည်ဆောက်ပုံ-နမူနာ)

---

## ၁။ Blade Template Engine ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Blade** သည် Laravel Framework တွင် မူလပါဝင်သော ရိုးရှင်းပြီး အလွန်မြန်ဆန်သည့် **Templating Engine** ဖြစ်သည်။ View ဖိုင်များကို `.blade.php` ဖြင့် အဆုံးသတ်ရသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
ရိုးရိုး PHP တွင် `<?php echo htmlspecialchars($title); ?>` သို့မဟုတ် `<?php foreach($items as $item): ?>` စသဖြင့် ရေးသားရသည်မှာ အလွန်ရှည်လျားပြီး မျက်စိရှုပ်ထွေးစေသည်။ Blade တွင် `{{ $title }}` သို့မဟုတ် `@foreach` ဖြင့် တိုတိုရှင်းရှင်း ရေးနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Zero Overhead**: Blade ကုဒ်များသည် Plain PHP အဖြစ် compile လုပ်ကာ Cache သိမ်းထားသောကြောင့် စွမ်းဆောင်ရည် အလွန်မြင့်မားသည်။
* **Auto-XSS Protection**: Variable တိုင်းကို `htmlspecialchars()` ဖြင့် auto escape လုပ်ပေးသဖြင့် XSS Attack မဖြစ်စေပါ။
* **Modular Reusability**: Components နှင့် Layouts များဖြင့် UI ကို အပိုင်းလိုက် ပြန်လည်အသုံးပြုနိုင်သည်။

---

## ၂။ Layout Inheritance (`@extends`, `@yield`, `@section`)

### (က) ဘာကြောင့် သုံးရသလဲ? (Why use this feature?)
Website စာမျက်နှာတိုင်းတွင် Navigation Bar, Sidebar, Header နှင့် Footer တို့သည် တူညီနေလေ့ရှိသည်။ Layout Inheritance မသုံးပါက HTML ခေါင်းစဉ်နှင့် အောက်ခြေများကို စာမျက်နှာ ၁၀၀ ရှိလျှင် အကြိမ် ၁၀၀ လိုက်ကူးထည့်နေရမည်။

### (ခ) အားသာချက်:
Parent Template တစ်ခုတည်း ပြုလုပ်ထားပြီး Child Pages များတွင် `@extends` ဖြင့် ပြန်လည်အသုံးပြုနိုင်သည်။

#### Master Layout (`resources/views/layouts/master.blade.php`):
```html
<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'My Application')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/products">Products</a>
        </nav>
    </header>

    <main class="container">
        {{-- Flash Success Message --}}
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        {{-- Child Content ထည့်သွင်းရာနေရာ --}}
        @yield('content')
    </main>

    <footer>
        <p>&copy; {{ date('Y') }} Myanmar Web Academy</p>
    </footer>
</body>
</html>
```

#### Child View (`resources/views/about.blade.php`):
```html
@extends('layouts.master')

@section('title', 'ကျွန်ုပ်တို့အကြောင်း')

@section('content')
    <h1>About Our Company</h1>
    <p>Laravel အစမှ အဆုံး လေ့လာနိုင်သော နေရာဖြစ်ပါသည်။</p>
@endsection
```

---

## ၃။ Modern Blade Components နှင့် Slots

### (က) ဘာကြောင့် သုံးရသလဲ?
Buttons, Alerts, Modal Boxes, Input Fields စသည့် သေးငယ်သော UI အစိတ်အပိုင်းများကို လွတ်လပ်သော Component အဖြစ် ခွဲထုတ်ရေးသားနိုင်ရန် သုံးသည်။

```bash
php artisan make:component Alert
```

### (ခ) အားသာချက်:
Props များ Pass ပေးနိုင်ပြီး Component Design ပြောင်းလဲလိုပါက ဖိုင်တစ်ခုတည်း ပြင်ရုံဖြင့် Website တစ်ခုလုံး အလိုအလျောက် ပြောင်းသွားသည်။

```html
<!-- resources/views/components/alert.blade.php -->
@props(['type' => 'info', 'message'])

<div class="alert alert-{{ $type }}">
    <strong>{{ ucfirst($type) }}:</strong>
    {{ $message ?? $slot }}
</div>
```

```html
<!-- သုံးစွဲပုံ: -->
<x-alert type="danger" message="အချက်အလက် ထည့်သွင်းမှု မှားယွင်းနေပါသည်။" />

<x-alert type="success">
    သင်၏ အကောင့်ဖွင့်ခြင်း <strong>အောင်မြင်ပါသည်!</strong>
</x-alert>
```

---

## ၄။ မဖြစ်မနေ သိထားရမည့် Blade Directives များ

### (က) Conditionals & Auth
```html
{{-- Login ဝင်ထားသူနှင့် ဧည့်သည် ခွဲပြခြင်း --}}
@auth
    <p>မင်္ဂလာပါ: {{ auth()->user()->name }}</p>
    <a href="/logout">Logout</a>
@endauth

@guest
    <a href="/login">Login ဝင်ရောက်ပါ</a>
@endguest
```

### (ခ) Loops (`@forelse`)
* **ဘာကြောင့် သုံးရသလဲ**: Data မရှိပါက "No Data Found" ကို `if(count > 0)` စစ်စရာမလိုဘဲ တစ်ခါတည်း ရှင်းလင်းစွာ ပြပေးသည်။

```html
<ul>
@forelse($products as $product)
    <li>{{ $product->name }} - {{ number_format($product->price) }} MMK</li>
@empty
    <li>လက်ရှိ ရောင်းချမည့် ပစ္စည်း မရှိသေးပါ။</li>
@endforelse
</ul>
```

### (ဂ) Form Security Directives
```html
<form action="/products/1" method="POST">
    {{-- CSRF Token မဖြစ်မနေ ထည့်ရပါမည် --}}
    @csrf

    {{-- HTML Form တွင် PUT / DELETE method သုံးရန် --}}
    @method('PUT')

    <input type="text" name="name" value="{{ old('name', $product->name) }}">

    @error('name')
        <span class="text-danger">{{ $message }}</span>
    @enderror

    <button type="submit">ပြင်ဆင်မည်</button>
</form>
```

---

## ၅။ The `$loop` Variable ၏ အစွမ်း

`@foreach` ပတ်တိုင်း Laravel က `$loop` object ကို auto ထည့်ပေးထားသည်:

```html
@foreach($users as $user)
    <div class="{{ $loop->even ? 'bg-gray' : 'bg-white' }}">
        #{{ $loop->iteration }} - {{ $user->name }}
        
        @if($loop->first)
            <span class="badge">ပထမဆုံး Record</span>
        @endif
        @if($loop->last)
            <span class="badge">နောက်ဆုံး Record</span>
        @endif
    </div>
@endforeach
```
* `$loop->iteration`: 1 မှ စတင်ရေတွက်သော Index။
* `$loop->first` / `$loop->last`: ပထမဆုံး/နောက်ဆုံး record ဖြစ်ပါက true။
* `$loop->count`: စုစုပေါင်း အရေအတွက်။

---

## ၆။ Data Displaying & XSS Security

* `{{ $var }}`: **Escaped Output (အလွန်လုံခြုံသည်)** - Browser က Script run မသွားအောင် htmlspecialchars ဖြင့် auto escape လုပ်ပေးသည်။
* `{!! $var !!}`: **Raw Output (သတိထားသုံးရန်)** - Rich Text HTML parse လုပ်ပြရန်သာ သုံးရပြီး User Input များတွင် လုံးဝ မသုံးရပါ။

---

## ၇။ လက်တွေ့ Dashboard Layout တည်ဆောက်ပုံ နမူနာ

```html
@extends('layouts.master')

@section('title', 'Admin Dashboard')

@section('content')
<div class="row">
    <div class="col-md-4">
        <div class="card">
            <h3>စုစုပေါင်း အသုံးပြုသူ</h3>
            <p class="display-4">{{ $totalUsers }}</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card">
            <h3>ယနေ့ ရောင်းရငွေ</h3>
            <p class="display-4">{{ number_format($todayRevenue) }} MMK</p>
        </div>
    </div>
</div>
@endsection
```
