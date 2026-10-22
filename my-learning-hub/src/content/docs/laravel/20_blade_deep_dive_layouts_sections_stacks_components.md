---
title: "20. Blade Deep Dive - Layout, @section, @parent, @show, @stack"
description: "Blade Template Engine အသေးစိတ် - Layout Inheritance, @yield, @section/@show/@parent, @stack/@push/@prepend, Components & Slots၊ ဘာကြောင့်သုံးရလဲ၊ အားသာချက်၊ Real-work ဥပမာများ"
---

> 📌 ကြိုတင်ဖတ်ရန်: [04. Blade Template Engine](/laravel/04_blade_template_engine/) (အခြေခံ)။ ဤသင်ခန်းစာသည် **အလုပ်ခွင်တွင် တကယ်သုံးသော အဆင့်မြင့် Blade** ကို အသေးစိတ်ရှင်းပြသည်။
> Laravel 11 / 12 အခြေခံ။

## 🧭 မာတိကာ
1. Blade ဆိုတာ ဘာလဲ၊ ဘာကြောင့်သုံးရသလဲ
2. Layout Inheritance: `@extends` + `@yield`
3. `@section` / `@endsection` / `@show` / `@parent` - ကွာခြားချက်
4. `@stack` / `@push` / `@prepend` / `@pushOnce` (CSS/JS စီမံ)
5. `@include` နှင့် Variants
6. **Blade Components & Slots** (ခေတ်သစ်နည်း)
7. Control Structures (`@foreach`, `@forelse`, `$loop`, `@auth`, `@can` ...)
8. Real-work: Admin Panel အပြည့်အစုံ
9. Inheritance vs Components - ဘယ်အချိန် ဘာသုံးမလဲ
10. Performance, Security, Testing, ပြဿနာဖြေရှင်းခြင်း
11. လေ့ကျင့်ခန်းများ

---

## ၁။ Blade ဆိုတာ ဘာလဲ? ဘာကြောင့် သုံးရသလဲ?

**Blade** = Laravel ၏ Template Engine။ `.blade.php` ဖိုင်များကို PHP အဖြစ် Compile လုပ်ပြီး `storage/framework/views` တွင် Cache သိမ်းသည်။ (ထို့ကြောင့် ရိုးရိုး PHP ထက် မနှေး)

### ရိုးရိုး PHP vs Blade
```php
<!-- ❌ Plain PHP: ရှည်၊ XSS အန္တရာယ်ရှိ၊ ထပ်ခါထပ်ခါ -->
<?php if (isset($user)): ?>
  <p>Hello <?php echo htmlspecialchars($user->name, ENT_QUOTES, 'UTF-8'); ?></p>
<?php endif; ?>

<!-- ✅ Blade -->
@isset($user)
  <p>Hello {{ $user->name }}</p>
@endisset
```

### အားသာချက်များ

| အားသာချက် | ရှင်းလင်းချက် | Real-work တန်ဖိုး |
| :--- | :--- | :--- |
| **Auto XSS Escape** | `{{ }}` သည် `htmlspecialchars` ကို အလိုအလျောက်ခေါ် | Security အမှားနည်း |
| **Layout Inheritance** | Header/Footer/Menu ကို တစ်နေရာတည်းရေး | ပြင်လျှင် ၁ နေရာသာ |
| **Components** | Button, Card, Modal ကို Reuse | UI တူညီ၊ Dev မြန် |
| **Clean Syntax** | `@if`, `@foreach` | ဖတ်ရလွယ် |
| **Compiled & Cached** | PHP အဖြစ် Compile | Performance |
| **Directive Extensibility** | `Blade::directive()` ဖြင့် ကိုယ်ပိုင် | Team Standard |

### အရေးကြီးသော Syntax
```blade
{{ $name }}              {{-- Escape လုပ်ပြီး ထုတ် (လုံခြုံ) --}}
{!! $html !!}            {{-- Escape မလုပ် ⚠️ ယုံကြည်ရသော HTML သာ --}}
{{ $name ?? 'Guest' }}   {{-- Default --}}
{{-- Blade Comment (HTML တွင်မပေါ်) --}}
@{{ vue_variable }}      {{-- Vue/Alpine အတွက် Blade မကိုင်ဘဲ ထား --}}
@verbatim ... @endverbatim
@json($data)             {{-- JS ထဲ Array ထည့်ရန် လုံခြုံသောနည်း --}}
```

> ⚠️ `{!! !!}` ကို **User ထည့်သော Data** အတွက် မသုံးပါနှင့် (XSS)။ Rich Text လိုလျှင် `Purifier` Library ဖြင့် Sanitize အရင်လုပ်ပါ။

---

## ၂။ Layout Inheritance - `@extends` + `@yield`

### ပြဿနာ
Page ၅၀ တွင် Navbar/Footer/CSS Link တူညီစွာ Copy ကူးထားလျှင် Menu တစ်ခုထပ်ထည့်ချင်သည့်အခါ ဖိုင် ၅၀ ပြင်ရမည်။

### အဖြေ - Master Layout
`resources/views/layouts/app.blade.php`
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Page တစ်ခုချင်းက Title ပြောင်းနိုင်၊ မပြောင်းလျှင် Default --}}
    <title>@yield('title', config('app.name'))</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Page-specific CSS ထည့်ရန်နေရာ --}}
    @stack('styles')
</head>
<body>
    @include('partials.navbar')

    <main class="container">
        @include('partials.flash')

        @yield('content')   {{-- Child page ၏ အဓိကအကြောင်းအရာ --}}
    </main>

    @include('partials.footer')

    {{-- Page-specific JS ထည့်ရန်နေရာ --}}
    @stack('scripts')
</body>
</html>
```

### Child Page
`resources/views/products/index.blade.php`
```blade
@extends('layouts.app')

@section('title', 'Product List')

@section('content')
    <h1>Products</h1>
    @forelse($products as $product)
        <div>{{ $product->name }} - ¥{{ number_format($product->price) }}</div>
    @empty
        <p>ကုန်ပစ္စည်း မရှိသေးပါ။</p>
    @endforelse
@endsection
```

### `@yield` vs `@section` အဓိပ္ပါယ်
```
 Layout (Parent)                         Child
 ─────────────────                       ─────────────────────
 @yield('content')    <──── ဖြည့်ပေး ──   @section('content') ... @endsection
 (ကွက်လပ်ထားသည်)                          (ကွက်လပ်ထဲ ထည့်သည်)
```

### Short form
```blade
@section('title', 'Dashboard')       {{-- စာသားတိုများအတွက် @endsection မလို --}}
```

---

## ၃။ `@section` / `@endsection` / `@show` / `@parent` - အသေးစိတ်

ဤ ၄ ခုသည် အရောထွေးအများဆုံးဖြစ်သည်။

| Directive | ရေးရာ | အဓိပ္ပါယ် |
| :--- | :--- | :--- |
| `@yield('x')` | **Layout** | "ဤနေရာကို Child က ဖြည့်လိမ့်မည်" (Default ပေးနိုင်) |
| `@section('x') ... @endsection` | **Child** | Section ကို Define လုပ်ပြီး **သိမ်းထား** (ချက်ချင်းမပြ) |
| `@section('x') ... @show` | **Layout** | Section ကို Define **လည်းလုပ်၊ ချက်ချင်းလည်းပြ** (Default content ပါ) |
| `@parent` | **Child** | Layout ၏ Default content ကို **ဆက်ထားပြီး** အပေါ်သို့ ထပ်ထည့် |

### ပုံ - `@show` + `@parent`
```
 Layout:                                    Child:
 ┌───────────────────────────┐              @section('sidebar')
 │ @section('sidebar')       │                  @parent         ← Layout ၏ Default ကို ထည့်
 │    <li>Dashboard</li>     │                  <li>Reports</li> ← ကိုယ်ပိုင်ထပ်ထည့်
 │    <li>Settings</li>      │              @endsection
 │ @show                     │
 └───────────────────────────┘              ရလဒ်: Dashboard, Settings, Reports
```

### Layout တွင် `@show` ဖြင့် Default Sidebar
`layouts/admin.blade.php`
```blade
<div class="wrapper">
    <aside>
        @section('sidebar')
            <ul>
                <li><a href="/admin">Dashboard</a></li>
                <li><a href="/admin/settings">Settings</a></li>
            </ul>
        @show   {{-- ← Default ကိုပြပြီး Child က Override/Extend လုပ်နိုင်ခွင့်ပေး --}}
    </aside>

    <section>@yield('content')</section>
</div>
```

### Case A - Child က `@parent` ဖြင့် **ထပ်တိုး**
```blade
@extends('layouts.admin')

@section('sidebar')
    @parent                                  {{-- Dashboard, Settings ကိုထား --}}
    <li><a href="/admin/reports">Reports</a></li>
@endsection
```
**ရလဒ်:** Dashboard, Settings, **Reports**

### Case B - `@parent` မပါ = **အစားထိုး (Replace)**
```blade
@section('sidebar')
    <li><a href="/pos">POS Menu</a></li>     {{-- Default အားလုံးပျောက်၊ ဤတစ်ခုသာ --}}
@endsection
```

### Case C - `@parent` ကို အလယ်/အောက်တွင်ထားနိုင်
```blade
@section('sidebar')
    <li class="highlight">Special Offer</li>  {{-- အပေါ်ဆုံး --}}
    @parent
@endsection
```

### Real-work ဥပမာ: Page တစ်ခုချင်းက Meta Tag ကို ထပ်တိုး
`layouts/app.blade.php`
```blade
<head>
    @section('meta')
        <meta name="robots" content="index,follow">
        <meta property="og:site_name" content="{{ config('app.name') }}">
    @show
</head>
```
`products/show.blade.php`
```blade
@section('meta')
    @parent                                               {{-- Global meta ကို ထား --}}
    <meta property="og:title" content="{{ $product->name }}">
    <meta property="og:image" content="{{ $product->image_url }}">
@endsection
```

### `@yield` vs `@section...@show` - ဘယ်အချိန် ဘာသုံး?

| လိုအပ်ချက် | သုံးရန် |
| :--- | :--- |
| Child က **မဖြစ်မနေ** ဖြည့်ရမည့် နေရာ (content) | `@yield('content')` |
| Default ရှိ၍ Child က **ထပ်တိုး** / **အစားထိုး** ချင်နိုင် | `@section ... @show` + Child တွင် `@parent` |
| Title ကဲ့သို့ စာသားတိုတို | `@yield('title','Default')` |
| JS/CSS ကို Child များကပါ ထပ်ထည့်လိုက | `@stack` (အောက်ပါအခန်း) |

### `@hasSection` / `@sectionMissing`
```blade
@hasSection('sidebar')
    <aside>@yield('sidebar')</aside>
@endif

@sectionMissing('hero')
    <div class="default-hero">Welcome</div>
@endif
```
> Child က Sidebar မပေးလျှင် Layout က Column ကိုပါ ဖျောက်ခြင်းသည် Real-work တွင် အသုံးများသည်။

### Nested Layout (Layout ထဲ Layout)
```blade
{{-- layouts/admin.blade.php --}}
@extends('layouts.app')                {{-- Admin layout သည် app layout ကို ဆက်ခံ --}}

@section('content')
    <div class="admin-wrapper">
        @include('admin.partials.menu')
        <div>@yield('admin-content')</div>
    </div>
@endsection
```
```blade
{{-- admin/users/index.blade.php --}}
@extends('layouts.admin')
@section('admin-content')
    <h2>Users</h2>
@endsection
```

### ⚠️ သတိထားရမည့်အချက်များ
- Child View တွင် `@extends` အပြင်ဘက် Content ရေးလျှင် **မပြ** (Section အတွင်းသာပြ)။
- `@show` ကို Child တွင် မသုံးပါ - **Layout တွင်သာ**။ Child တွင် `@endsection`။
- `@parent` သည် **Layout ၏ `@section...@show`** အတွက်သာ အဓိပ္ပါယ်ရှိ (`@yield` တွင် Parent content မရှိ)။

---

## ၄။ `@stack` / `@push` / `@prepend` / `@pushOnce` - CSS/JS စီမံခြင်း

### ပြဿနာ
Page တစ်ခုချင်းတွင် သီးသန့် JS (ဥပမာ - Chart.js, Datepicker) လိုသည်။ ၎င်းကို `<head>` / `</body>` သို့ ထည့်ချင်သော်လည်း Child View က `<body>` အတွင်း Content ကိုသာ ရေးနိုင်သည်။

### အဖြေ - `@stack` = "နောက်မှ ဆောင်းထည့်နိုင်သော ကွက်လပ်"
Layout တွင် `@stack('scripts')` ထားပြီး **Child View၊ Component၊ Partial မည်သည့်နေရာမှမဆို** `@push('scripts')` ဖြင့် ထည့်နိုင်သည်။

```blade
{{-- products/index.blade.php --}}
@extends('layouts.app')

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
@endpush

@section('content')
    <input id="date" type="text">
@endsection

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>flatpickr('#date');</script>
@endpush
```

### `@section` vs `@push` ကွာခြားချက်

| | `@section` | `@push` |
| :--- | :--- | :--- |
| Name တူ ၂ ကြိမ်ရေးလျှင် | **နောက်ဆုံးက အနိုင်ယူ (Override)** | **နှစ်ခုလုံး စုပေါင်း (Append)** |
| Include/Component ထဲမှ ထည့် | Layout Chain မဟုတ်လျှင် မရ | **ရ** |
| သင့်တော်ရာ | Page Content | CSS/JS, Modal HTML |

### `@prepend` - အရင်ဆုံးထည့် (Order ထိန်း)
```blade
@push('scripts')
    <script src="/plugin.js"></script>      {{-- 2 --}}
@endpush

@prepend('scripts')
    <script src="/jquery.js"></script>      {{-- 1 (plugin မတိုင်မီ) --}}
@endprepend
```

### `@pushOnce` / `@once` - Component ကို ၁၀ ကြိမ်သုံးလည်း JS တစ်ကြိမ်သာ
```blade
{{-- components/date-picker.blade.php --}}
<input type="text" {{ $attributes->merge(['class' => 'datepicker']) }}>

@pushOnce('scripts')
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>flatpickr('.datepicker');</script>
@endPushOnce
```
```blade
<x-date-picker name="start"/>
<x-date-picker name="end"/>      {{-- Script ၂ ခါ မထွက်၊ တစ်ခါသာ --}}
```

### `@stack` default ထည့်
```blade
@stack('styles')
@stack('scripts', '<script>/* default */</script>')   {{-- Laravel 10+ : Default argument --}}
```

### `@hasstack`
```blade
@hasstack('modals')
    <div id="modal-root">@stack('modals')</div>
@endhasstack
```

### Real-work: Modal များကို Body အဆုံးသို့
```blade
{{-- orders/index.blade.php --}}
@foreach($orders as $order)
    <button data-bs-toggle="modal" data-bs-target="#del{{ $order->id }}">Delete</button>

    @push('modals')
        <div class="modal" id="del{{ $order->id }}">
            <form method="POST" action="{{ route('orders.destroy', $order) }}">
                @csrf @method('DELETE')
                <p>Order #{{ $order->id }} ကို ဖျက်မလား?</p>
                <button class="btn btn-danger">Delete</button>
            </form>
        </div>
    @endpush
@endforeach
```
Layout တွင် `</body>` မတိုင်မီ `@stack('modals')` ထား - Table အတွင်း Modal HTML မပေါ်စေဘဲ Layout မပျက်။

### အားသာချက်
- ✅ Page-specific Asset ကိုသာ Load (Page တိုင်း JS အကုန် Load မလို -> မြန်)
- ✅ Component ကိုယ်တိုင် မိမိလိုသော JS/CSS ကို ယူလာနိုင် (Self-contained)
- ✅ `@pushOnce` ဖြင့် Duplicate မဖြစ်

---

## ၅။ `@include` နှင့် Variants

```blade
@include('partials.navbar')                                  {{-- Basic --}}
@include('partials.alert', ['type' => 'danger', 'msg' => 'Error'])   {{-- Data ပို့ --}}
@includeIf('partials.banner')                                {{-- ဖိုင်မရှိလည်း Error မတက် --}}
@includeWhen($user->isAdmin(), 'partials.admin-tools')       {{-- Condition မှန်မှ --}}
@includeUnless($hideAds, 'partials.ads')
@includeFirst(['custom.header', 'partials.header'])          {{-- ပထမတွေ့သည်ကို --}}
```

### `@each` - Loop + Include
```blade
@each('partials.product-card', $products, 'product', 'partials.no-products')
{{--   view,                     data,      variable,  empty-view --}}
```

### `@include` vs Component

| | `@include` | `<x-component>` |
| :--- | :--- | :--- |
| Parent ၏ Variable အားလုံး မြင် | ✅ (မလိုချင်လည်း) | ❌ (ပို့မှ) |
| Slots / Attributes | ❌ | ✅ |
| Class Logic | ❌ | ✅ |
| သင့်တော်ရာ | ရိုးရှင်း Partial | Reusable UI |

---

## ၆။ Blade Components & Slots (ခေတ်သစ်နည်း - အလွန်အရေးကြီး)

### ၆.၁ Anonymous Component (Class မလို)
```bash
php artisan make:component alert --view      # resources/views/components/alert.blade.php
```
`resources/views/components/alert.blade.php`
```blade
@props([
    'type' => 'info',      {{-- Default --}}
    'dismissible' => false,
])

@php
    $colors = [
        'info'    => 'bg-blue-100 text-blue-800',
        'success' => 'bg-green-100 text-green-800',
        'danger'  => 'bg-red-100 text-red-800',
    ];
@endphp

<div {{ $attributes->merge(['class' => 'p-4 rounded ' . ($colors[$type] ?? $colors['info'])]) }} role="alert">
    {{ $slot }}

    @if($dismissible)
        <button type="button" onclick="this.parentElement.remove()">×</button>
    @endif
</div>
```
အသုံးပြု:
```blade
<x-alert type="success" dismissible class="mb-4" id="flash">
    Order အောင်မြင်စွာ တင်ပြီးပါပြီ။
</x-alert>
```
- `type="success"` -> String
- `:dismissible="true"` / `dismissible` -> PHP Expression (`:` prefix = PHP value)
- `class="mb-4"` -> `$attributes->merge` ဖြင့် Class **ပေါင်း**

### ၆.၂ Class-based Component (Logic ပါလျှင်)
```bash
php artisan make:component PriceTag
```
`app/View/Components/PriceTag.php`
```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class PriceTag extends Component
{
    public function __construct(
        public int|float $amount,
        public string $currency = 'JPY',
    ) {}

    public function formatted(): string
    {
        return match ($this->currency) {
            'JPY' => '¥' . number_format($this->amount),
            'USD' => '$' . number_format($this->amount, 2),
            default => $this->currency . ' ' . number_format($this->amount, 2),
        };
    }

    public function render(): View
    {
        return view('components.price-tag');
    }
}
```
`resources/views/components/price-tag.blade.php`
```blade
<span {{ $attributes->class(['font-bold', 'text-red-600' => $amount > 100000]) }}>
    {{ $formatted() }}
</span>
```
```blade
<x-price-tag :amount="$product->price" />
<x-price-tag :amount="19.9" currency="USD" class="text-lg" />
```

### ၆.၃ Slots - Component ထဲသို့ HTML အပိုင်းအစ ပို့
`components/card.blade.php`
```blade
<div {{ $attributes->merge(['class' => 'card shadow']) }}>
    @isset($header)
        <div class="card-header">{{ $header }}</div>
    @endisset

    <div class="card-body">{{ $slot }}</div>

    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>
```
```blade
<x-card class="w-96">
    <x-slot:header>
        <h3>Order #{{ $order->id }}</h3>
    </x-slot>

    ဤအရာသည် Default $slot ဖြစ်သည်။
    <p>Total: ¥{{ number_format($order->total) }}</p>

    <x-slot:footer>
        <a href="{{ route('orders.show', $order) }}">View</a>
    </x-slot>
</x-card>
```

### ၆.၄ Layout ကို Component ဖြင့်လုပ် (Laravel ၏ ယနေ့ အကြံပြုနည်း)
`components/layouts/app.blade.php`
```blade
@props(['title' => config('app.name')])
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    @vite(['resources/css/app.css','resources/js/app.js'])
    @stack('styles')
</head>
<body>
    <x-navbar />
    <main>{{ $slot }}</main>
    @stack('scripts')
</body>
</html>
```
```blade
<x-layouts.app title="Dashboard">
    <h1>Welcome</h1>
    @push('scripts') <script>console.log('page js')</script> @endpush
</x-layouts.app>
```
> Laravel Breeze (Blade stack) သည် ဤနည်းကို သုံးသည် (`<x-app-layout>`)။

### ၆.၅ Component ၏ အခြား Feature များ
```blade
{{-- Dynamic component --}}
<x-dynamic-component :component="'icons.' . $iconName" class="w-4" />

{{-- $attributes ကိုင်တွယ် --}}
{{ $attributes->only(['id','class']) }}
{{ $attributes->except('class') }}
{{ $attributes->has('disabled') }}
{{ $attributes->whereStartsWith('wire:') }}

{{-- @aware: Parent component ၏ prop ကို Child က ယူ --}}
@aware(['theme' => 'light'])

{{-- Index component: components/form/input.blade.php --}}
<x-form.input name="email" type="email" />
```

### Form Input Component - အလုပ်ခွင်တွင် အသုံးအများဆုံး
`components/form/input.blade.php`
```blade
@props(['name', 'label' => null, 'type' => 'text', 'value' => null])

<div class="mb-4">
    @if($label)
        <label for="{{ $name }}" class="block font-medium">{{ $label }}</label>
    @endif

    <input
        id="{{ $name }}"
        name="{{ $name }}"
        type="{{ $type }}"
        value="{{ old($name, $value) }}"
        {{ $attributes->class(['border rounded w-full p-2', 'border-red-500' => $errors->has($name)]) }}
    >

    @error($name)
        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
    @enderror
</div>
```
```blade
<form method="POST" action="{{ route('users.store') }}">
    @csrf
    <x-form.input name="name"  label="အမည်" required />
    <x-form.input name="email" label="Email" type="email" />
    <x-form.input name="age"   label="အသက်" type="number" min="18" />
    <button class="btn">Save</button>
</form>
```
Validation Error၊ Old Input၊ Style အားလုံးကို Form Field တိုင်းတွင် ထပ်မရေးရတော့ပါ။

---

## ၇။ Control Structures & Real-work Directives

```blade
{{-- Loop --}}
@foreach($users as $user)
    <tr class="{{ $loop->even ? 'bg-gray' : '' }}">
        <td>{{ $loop->iteration }}</td>     {{-- 1,2,3 --}}
        <td>{{ $user->name }}</td>
        @if($loop->last) <td>(နောက်ဆုံး)</td> @endif
    </tr>
@endforeach

@forelse($orders as $o) ... @empty <p>မရှိ</p> @endforelse
```
`$loop` ၏ Properties: `index`, `iteration`, `first`, `last`, `count`, `remaining`, `even`, `odd`, `depth`, `parent`

```blade
{{-- Auth --}}
@auth <a href="/profile">{{ auth()->user()->name }}</a> @endauth
@auth('admin') ... @endauth
@guest <a href="/login">Login</a> @endguest

{{-- Authorization (Policy/Gate) --}}
@can('update', $post)  <a href="{{ route('posts.edit',$post) }}">Edit</a> @endcan
@cannot('delete', $post) <span>ဖျက်ခွင့်မရှိ</span> @endcannot

{{-- Environment --}}
@production <script src="analytics.js"></script> @endproduction
@env('local') <div class="debug-bar"></div> @endenv

{{-- Form --}}
<form method="POST" action="/posts/1">
    @csrf
    @method('PUT')
    <input name="title" value="{{ old('title', $post->title) }}">
    @error('title') <span>{{ $message }}</span> @enderror
</form>

{{-- CSS class / style conditional --}}
<li @class(['active' => $isActive, 'disabled' => !$enabled])>
<input @checked(old('remember')) @disabled($locked) @selected($v==1) @required(true) @readonly($ro)>

{{-- JS သို့ Data --}}
<script>const cfg = @json($config);</script>

{{-- PHP --}}
@php $total = $items->sum('price'); @endphp
```

### ကိုယ်ပိုင် Directive
`AppServiceProvider::boot()`
```php
use Illuminate\Support\Facades\Blade;

Blade::directive('money', fn ($expr) => "<?php echo '¥' . number_format($expr); ?>");
Blade::if('admin', fn () => auth()->check() && auth()->user()->is_admin);
```
```blade
@money($product->price)
@admin <a href="/admin">Admin</a> @endadmin
```

---

## ၈။ Real-work: Admin Panel Layout အပြည့်အစုံ

### ဖွဲ့စည်းပုံ
```
resources/views/
├── layouts/
│   ├── app.blade.php            # Public site
│   └── admin.blade.php          # extends app (Sidebar @show)
├── components/
│   ├── alert.blade.php
│   ├── card.blade.php
│   ├── form/input.blade.php
│   └── table/th-sort.blade.php
├── partials/
│   ├── navbar.blade.php
│   ├── flash.blade.php
│   └── footer.blade.php
└── admin/
    ├── dashboard.blade.php
    └── users/index.blade.php
```

`partials/flash.blade.php`
```blade
@foreach (['success' => 'green', 'error' => 'red', 'warning' => 'yellow'] as $key => $color)
    @if (session($key))
        <x-alert :type="$key === 'error' ? 'danger' : $key" dismissible>
            {{ session($key) }}
        </x-alert>
    @endif
@endforeach
```
Controller တွင်: `return redirect()->route('users.index')->with('success', 'User ဖန်တီးပြီး');`

`layouts/admin.blade.php`
```blade
@extends('layouts.app')

@section('content')
<div class="flex">
    <aside class="w-64">
        @section('sidebar')
            <nav>
                <a href="{{ route('admin.dashboard') }}" @class(['active' => request()->routeIs('admin.dashboard')])>Dashboard</a>
                @can('viewAny', App\Models\User::class)
                    <a href="{{ route('admin.users.index') }}" @class(['active' => request()->routeIs('admin.users.*')])>Users</a>
                @endcan
            </nav>
        @show
    </aside>

    <section class="flex-1 p-6">
        <header class="flex justify-between mb-4">
            <h1>@yield('page-title')</h1>
            <div>@yield('page-actions')</div>
        </header>
        @yield('admin-content')
    </section>
</div>
@endsection
```

`admin/users/index.blade.php`
```blade
@extends('layouts.admin')

@section('title', 'Users - Admin')
@section('page-title', 'User Management')

@section('page-actions')
    @can('create', App\Models\User::class)
        <a class="btn" href="{{ route('admin.users.create') }}">+ New User</a>
    @endcan
@endsection

@section('sidebar')
    @parent
    <a href="{{ route('admin.users.export') }}">Export CSV</a>    {{-- ဤ Page တွင်သာ ထပ်တိုး --}}
@endsection

@section('admin-content')
    <x-card>
        <x-slot:header>Users ({{ $users->total() }})</x-slot>

        <form method="GET" class="mb-4">
            <x-form.input name="q" label="ရှာဖွေရန်" :value="request('q')" />
        </form>

        <table class="w-full">
            <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
            </thead>
            <tbody>
            @forelse($users as $user)
                <tr>
                    <td>{{ $users->firstItem() + $loop->index }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td><span @class(['badge', 'badge-red' => $user->role === 'admin'])>{{ $user->role }}</span></td>
                    <td>
                        @can('update', $user)<a href="{{ route('admin.users.edit', $user) }}">Edit</a>@endcan
                        @can('delete', $user)
                            <form method="POST" action="{{ route('admin.users.destroy', $user) }}" class="inline"
                                  onsubmit="return confirm('ဖျက်မှာ သေချာလား?')">
                                @csrf @method('DELETE')
                                <button>Delete</button>
                            </form>
                        @endcan
                    </td>
                </tr>
            @empty
                <tr><td colspan="5">User မတွေ့ပါ။</td></tr>
            @endforelse
            </tbody>
        </table>

        <x-slot:footer>{{ $users->withQueryString()->links() }}</x-slot>
    </x-card>
@endsection

@push('scripts')
    <script>console.log('users page only')</script>
@endpush
```

---

## ၉။ Inheritance vs Components - ဘယ်အချိန် ဘာသုံးမလဲ

| အခြေအနေ | အကြံပြု |
| :--- | :--- |
| Project အသစ် | **Components Layout** (`<x-layouts.app>`) - Laravel Starter Kits နည်း |
| Project အဟောင်း `@extends` အများကြီးရှိ | ဆက်သုံး၊ ပြောင်းစရာမလို |
| Sidebar ကဲ့သို့ **ထပ်တိုး/Override** အပြောင်းအလဲမျိုး | `@section...@show` + `@parent` ကောင်း |
| JS/CSS Page-specific | **`@stack/@push`** (နှစ်နည်းလုံးတွင်သုံး) |
| Button/Card/Input/Modal Reuse | **Components** |
| ရိုးရိုး Static Block | `@include` |

---

## ၁၀။ Performance, Security, Testing, Troubleshooting

### Performance
```bash
php artisan view:cache      # Deploy တွင် View အားလုံး Pre-compile
php artisan view:clear      # Cache ရှင်း (View ပြောင်းမပြလျှင်)
```
- View ထဲ DB Query မရေးပါနှင့် (N+1) - Controller တွင် `with()` Eager Load။
- Blade ထဲ Logic ကြီး မရေးပါနှင့် -> Component Class / View Composer။

### View Composer - View တိုင်းသို့ Data ပို့
```php
// AppServiceProvider::boot()
use Illuminate\Support\Facades\View;

View::composer('partials.navbar', function ($view) {
    $view->with('cartCount', auth()->check() ? auth()->user()->cartItems()->count() : 0);
});
// Share အားလုံးသို့
View::share('appVersion', config('app.version'));
```

### Security Checklist
- [ ] `{!! !!}` ကို User Input အပေါ် မသုံး
- [ ] Form တိုင်းတွင် `@csrf`
- [ ] JS သို့ Data ပို့ရာတွင် `@json()` (Manual `json_encode` ထက်လုံခြုံ)
- [ ] `<a href="{{ $userUrl }}">` - `javascript:` URL ကို Validate (`url` rule)

### Testing
```php
public function test_users_page_renders_for_admin(): void
{
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/users')
        ->assertOk()
        ->assertViewIs('admin.users.index')
        ->assertSee('User Management');
}

public function test_alert_component_renders(): void
{
    $this->blade('<x-alert type="danger">Oops</x-alert>')
        ->assertSee('Oops')
        ->assertSee('bg-red-100', false);   // false = escape မလုပ်
}
```

### ပြဿနာ ဖြေရှင်းခြင်း

| ပြဿနာ | အကြောင်းရင်း | ဖြေရှင်း |
| :--- | :--- | :--- |
| `@section` ထဲ Content မပေါ် | Layout တွင် `@yield` နာမည်မကိုက် | နာမည်စစ် |
| `@push` မပေါ် | Layout တွင် `@stack('same-name')` မရှိ | `@stack` ထည့် |
| Script ၂ ခါထွက် | Component ကို Loop ထဲသုံး၍ `@push` | `@pushOnce` |
| `@parent` ဘာမှမပြ | Layout တွင် `@yield` ဖြစ်နေ | `@section...@show` သို့ပြောင်း |
| View ပြင်ပေမယ့် မပြောင်း | Compiled Cache | `php artisan view:clear` |
| `Undefined variable $x` | Component prop မပို့ / `@props` မရှိ | `:x="$x"` |
| Component မတွေ့ | နာမည်/Folder မှား (`x-form.input` = `components/form/input`) | Path စစ် |
| Vue `{{ }}` မပေါ် | Blade က Process လုပ် | `@{{ }}` / `@verbatim` |

---

## ၁၁။ လေ့ကျင့်ခန်းများ (Real-work)

### 🏋️ Ex 1 - Layout နှစ်ဆင့်
`layouts/app` -> `layouts/admin` (Sidebar `@show`) -> `admin/dashboard`။ Dashboard တွင် `@parent` ဖြင့် "Reports" Menu ထပ်ထည့်ပါ။

### 🏋️ Ex 2 - `@stack` ဖြင့် Page JS
Product Chart Page တွင်သာ Chart.js Load ဖြစ်ပြီး အခြား Page တွင် Network Tab၌ မပေါ်ကြောင်း စစ်ပါ။

### 🏋️ Ex 3 - Reusable Form Components
`<x-form.input>`, `<x-form.select>`, `<x-form.textarea>` ၃ ခုရေးပြီး Register Form ကို ပြန်ရေးပါ။ Validation Error နှင့် old() အလုပ်လုပ်ကြောင်းစစ်ပါ။

### 🏋️ Ex 4 - `@pushOnce` Datepicker
`<x-date-picker>` ကို Page တစ်ခုတွင် ၅ ကြိမ်သုံးပြီး `<script>` တစ်ကြိမ်သာထွက်ကြောင်း View Source ဖြင့်ပြပါ။

### 🏋️ Ex 5 - Flash Message Partial
Success / Error / Warning ကို `partials/flash` ဖြင့် Layout တစ်ခုတည်းမှ ပြပါ။ Controller ၃ ခုမှ `with()` ပို့ကြည့်ပါ။

### 🏋️ Ex 6 - Role-based Menu
`@can`, `@auth('admin')` ဖြင့် Admin/Staff/Customer အလိုက် Menu အမျိုးမျိုးပြပါ။ (Policy ကို [21. Middleware, Guards & Authorization](/laravel/21_middleware_guards_providers_and_authorization/) တွင်ဆက်လေ့လာ)

### 🏋️ Ex 7 - Custom Directive
`@money`, `@admin` Directive ရေး၍ Test ရေးပါ။

### 🏋️ Ex 8 - Class Component
`<x-status-badge :status="$order->status" />` ကို Class Component ဖြင့်ရေးပါ (`pending` Yellow, `paid` Green, `cancelled` Red, `match` သုံး)။

---

## 🎯 အနှစ်ချုပ်

| Feature | တစ်ကြောင်းအဓိပ္ပါယ် | အဓိကအကျိုး |
| :--- | :--- | :--- |
| `@extends/@yield` | Layout ဆက်ခံ | Header/Footer တစ်နေရာတည်း |
| `@section...@show` + `@parent` | Default ပါ ကွက်လပ်၊ ထပ်တိုးနိုင် | Sidebar/Meta Override |
| `@stack/@push/@prepend` | Asset စုဆောင်းနေရာ | Page-specific JS/CSS |
| `@pushOnce` | Duplicate မဖြစ် | Component JS |
| Components + Slots | Reusable UI | Consistency, Dev Speed |
| `@props/$attributes` | Component Config | Flexible UI |

နောက်သင်ခန်းစာ: [21. Middleware, Guards, Providers & Authorization](/laravel/21_middleware_guards_providers_and_authorization/)
