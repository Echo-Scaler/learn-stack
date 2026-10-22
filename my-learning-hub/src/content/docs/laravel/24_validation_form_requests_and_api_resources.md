---
title: "24. Request Validation, Form Requests & API Resources"
description: "Laravel Validation စနစ်အပြည့်အစုံ - Inline Validation vs Form Requests, Custom Rules, Nested Arrays, Eloquent API Resources, Resource Collections, Conditional Fields, N+1 ကာကွယ်ခြင်းနှင့် Real-work ဥပမာများ"
---

> Laravel 11 / 12 အခြေခံ။ 
> ဤသင်ခန်းစာတွင် Controller ဆီသို့ မရောက်မီ Input Data များကို မည်သို့ စစ်ဆေးကာကွယ်ရမည် (**Validation & Form Request**) နှင့် Database မှ Data များကို Frontend/API Client ထံသို့ မည်သို့ စနစ်တကျ လုံခြုံစွာ Transform လုပ်၍ ပို့ဆောင်ရမည် (**Eloquent API Resources**) ကို Real-world ဥပမာပေါင်းများစွာဖြင့် အသေးစိတ် ရှင်းလင်းထားသည်။

---

## 🧭 မာတိကာ (Table of Contents)
1. [Request Validation ဆိုတာဘာလဲ? ဘာကြောင့် မဖြစ်မနေသုံးရသလဲ?](#၁-request-validation-ဆိုတာဘာလဲ-ဘာကြောင့်-မဖြစ်မနေသုံးရသလဲ)
2. [Inline Validation vs Form Requests - အားသာချက်များနှင့် နှိုင်းယှဉ်ချက်](#၂-inline-validation-vs-form-requests---အားသာချက်များနှင့်-နှိုင်းယှဉ်ချက်)
3. [Form Request ၏ အလုပ်လုပ်ပုံ (Deep Dive into Form Request Lifecycle)](#၃-form-request-၏-အလုပ်လုပ်ပုံ-deep-dive-into-form-request-lifecycle)
4. [အသုံးအများဆုံး Validation Rules (Real-World Reference)](#၄-အသုံးအများဆုံး-validation-rules-real-world-reference)
5. [Custom Validation Rules & Closure Rules ရေးသားခြင်း](#၅-custom-validation-rules--closure-rules-ရေးသားခြင်း)
6. [Complex Validation: Nested Arrays, Files & Password Rules](#၆-complex-validation-nested-arrays-files--password-rules)
7. [Eloquent API Resources ဆိုတာဘာလဲ? ဘာကြောင့် Resource ကို သုံးသင့်သလဲ?](#၇-eloquent-api-resources-ဆိုတာဘာလဲ-ဘာကြောင့်-resource-ကို-သုံးသင့်သလဲ)
8. [Single Resource vs Resource Collection](#၈-single-resource-vs-resource-collection)
9. [Resource Advanced: when(), whenLoaded(), with() & Pagination](#၉-resource-advanced-when-whenloaded-with--pagination)
10. [Real-World Project Implementation (Orders & Items System)](#၁၀-real-world-project-implementation-orders--items-system)
11. [Testing Validation & Resources (Feature Tests)](#၁၁-testing-validation--resources-feature-tests)
12. [လေ့ကျင့်ခန်းများ (Hands-on Exercises)](#၁၂-လေ့ကျင့်ခန်းများ-hands-on-exercises)

---

## ၁။ Request Validation ဆိုတာဘာလဲ? ဘာကြောင့် မဖြစ်မနေသုံးရသလဲ?

Web သို့မဟုတ် API Application တစ်ခုတွင် **User ထံမှ ဝင်လာသော Data မည်သည့်အရာကိုမျှ (Never Trust User Input)** မယုံကြည်ရပါ။

### ❌ Validation မရှိလျှင် ကြုံရမည့် ဘေးဆိုးများ
1. **Database Crash / SQL Errors**: `price` နေရာတွင် string စာသားဝင်လာလျှင် DB error တက်မည်။
2. **Security Vulnerabilities (Mass Assignment / Injection)**: မလိုလားအပ်သော column များ (ဥပမာ `is_admin = true`) ကို ရိုက်ထည့်ပြီး Hack နိုင်သွားနိုင်သည်။
3. **Data Corruption**: Format မကျသော email, အနှုတ်လက္ခဏာဖြစ်နေသော stock count များ ဝင်ရောက်သွားနိုင်သည်။

```
                     HTTP Request (Raw Payload)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Form Request Layer  │ ◄─── Input စစ်ဆေးခြင်း (Validate)
                     │ (Security & Integrity)│ ◄─── ခွင့်ပြုချက်စစ်ခြင်း (Authorize)
                     └───────────┬───────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
               ❌ မမှန်ကန်ပါက           ✅ အောင်မြင်ပါက
                     │                       │
                     ▼                       ▼
            422 JSON Error              Controller (Logic)
         (သို့ Web Redirect)                 │
                                             ▼
                                     Database (Eloquent)
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │  Eloquent Resource  │ ◄─── Data Transform & Masking
                                  └──────────┬──────────┘
                                             │
                                             ▼
                                  Clean, Secure JSON Response
```

---

## ၂။ Inline Validation vs Form Requests - အားသာချက်များနှင့် နှိုင်းယှဉ်ချက်

### (က) Inline Validation (Controller အတွင်း စစ်ဆေးခြင်း)
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body'  => 'required',
    ]);

    Post::create($validated);
    return response()->json(['message' => 'Post created']);
}
```
* **အားသာချက်**: Script အတိုလေးများ၊ Prototype ပြုလုပ်ချိန်တွင် အလွန်မြန်ဆန်သည်။
* **အားနည်းချက်**: Rules များလာပါက Controller Code ဖောင်းပွပြီး ရှုပ်ထွေးသွားသည်။ Reusable မဖြစ်ပါ။

### (ခ) Form Requests (Dedicated Request Class)
```bash
php artisan make:request StorePostRequest
```
```php
public function store(StorePostRequest $request)
{
    // Controller သို့ ရောက်လာချိန်တွင် Input သည် 100% Validated ဖြစ်ပြီးသားဖြစ်သည်!
    $post = Post::create($request->validated());
    return new PostResource($post);
}
```

### ⚖️ နှိုင်းယှဉ်ချက်ဇယား

| Feature | Inline Validation (`$request->validate()`) | Form Request (`StoreUserRequest`) |
| :--- | :--- | :--- |
| **နေရာ** | Controller Method အတွင်း | သီးသန့် Class (`app/Http/Requests`) |
| **Separation of Concerns** | Logic နှင့် Validation ရောနှော | သန့်ရှင်းသော Clean Architecture |
| **Reusability** | မရ (Duplicate ရေးရသည်) | Endpoint အများအပြားတွင် ပြန်သုံးနိုင် |
| **Authorization ပါဝင်မှု** | မပါ (သီးသန့်စစ်ရသည်) | `authorize()` method အဆင်သင့်ပါ |
| **Preparation / Sanitization** | ခက်ခဲသည် | `prepareForValidation()` ပါရှိ |
| **Testing** | Controller တစ်ခုလုံး Test ရသည် | Request Class ကို သီးသန့် Unit Test လုပ်နိုင် |

> 💡 **Real-work Rule**: Production-grade Enterprise application များတွင် Controller အားလုံးကို **Form Requests** ဖြင့်သာ ၁၀၀% တည်ဆောက်ကြသည်။

---

## ၃။ Form Request ၏ အလုပ်လုပ်ပုံ (Deep Dive into Form Request Lifecycle)

Form Request Class တစ်ခုကို Run သောအခါ အောက်ပါ အဆင့် ၄ ဆင့်အတိုင်း အစဉ်လိုက် အလုပ်လုပ်သည်-

```
 1. authorize()           ──► False ဆိုပါက 403 Forbidden ချက်ချင်းပစ်
       │
 2. prepareForValidation() ──► Input data ကို အစောပိုင်း သန့်စင်/ပြင်ဆင် (Normalize)
       │
 3. rules()               ──► Validation Rules များကို တိုက်စစ်သည် (ကျရှုံးပါက 422 Unprocessable)
       │
 4. passedValidation()    ──► Validation အောင်မြင်ပြီးနောက် ထပ်မံပြင်ဆင်လိုသည်များ ထည့်သွင်း
```

### Form Request အပြည့်အစုံ ဥပမာ-
```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreProductRequest extends FormRequest
{
    /**
     * အဆင့် ၁ - ဤ User သည် ဤ Request ကို လုပ်ပိုင်ခွင့်ရှိသလား?
     */
    public function authorize(): bool
    {
        // Policy / Gate နှင့် ချိတ်ဆက်စစ်ဆေးနိုင်သည်
        return $this->user() && $this->user()->can('create', \App\Models\Product::class);
    }

    /**
     * အဆင့် ၂ - Validation မစစ်မီ Input များကို ပြုပြင်ခြင်း (Sanitization)
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            // SKU မပါလာပါက အလိုအလျောက် Generate ထုတ်ပေးခြင်း
            'sku' => $this->sku ? strtoupper(trim($this->sku)) : 'PRD-' . strtoupper(Str::random(6)),
            // Price ကို integer အဖြစ် cast လုပ်ထားခြင်း
            'price' => (int) $this->price,
        ]);
    }

    /**
     * အဆင့် ၃ - Validation စည်းမျဉ်းများ
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'sku'         => ['required', 'string', 'unique:products,sku'],
            'price'       => ['required', 'integer', 'min:100'],
            'categories'  => ['required', 'array', 'min:1'],
            'categories.*'=> ['integer', 'exists:categories,id'],
        ];
    }

    /**
     * Error Message များကို စိတ်ကြိုက်ပြင်ဆင်ခြင်း
     */
    public function messages(): array
    {
        return [
            'name.required'       => 'ကုန်ပစ္စည်းအမည် ထည့်သွင်းရန် လိုအပ်ပါသည်။',
            'sku.unique'          => 'ဤ SKU နံပါတ်သည် စာရင်းထဲတွင် ရှိပြီးသား ဖြစ်နေပါသည်။',
            'categories.min'      => 'အနည်းဆုံး Category တစ်ခု ရွေးချယ်ပေးရပါမည်။',
            'categories.*.exists' => 'ရွေးချယ်ထားသော Category မရှိပါ။',
        ];
    }

    /**
     * Field နာမည်များကို အဓိပ္ပာယ်ရှိသော စာသားအဖြစ် ပြောင်းလဲခြင်း
     */
    public function attributes(): array
    {
        return [
            'sku' => 'ကုန်ပစ္စည်းကုဒ် (SKU)',
        ];
    }
}
```

---

## ၄။ အသုံးအများဆုံး Validation Rules (Real-World Reference)

Laravel တွင် စည်းမျဉ်းပေါင်း ၉၀ ကျော် ပါရှိပြီး အလုပ်ခွင်တွင် အောက်ပါ Rules များကို အသုံးအများဆုံး ဖြစ်သည်-

### (၁) Basic & Types
* `required`: မဖြစ်မနေ ပါရမည်။
* `nullable`: မပါလည်း ရသည် (null လက်ခံ)။
* `sometimes`: Payload ထဲတွင် field ပါလာမှသာ စစ်ဆေးမည်။
* `string`, `integer`, `numeric`, `boolean`, `array`, `date`

### (၂) Database-Driven Rules
* `unique:table,column,except,idColumn`: Data ထပ်နေခြင်း ရှိမရှိ စစ်သည်။
* `exists:table,column`: နိုင်ငံခြားကီး (Foreign Key) အမှန်တကယ် Database ထဲ ရှိမရှိ စစ်သည်။

```php
use Illuminate\Validation\Rule;

public function rules(): array
{
    return [
        // Update လုပ်ချိန်တွင် မိမိ၏ လက်ရှိ ID ကို ချန်လှပ်၍ unique စစ်ခြင်း
        'email' => [
            'required',
            'email',
            Rule::unique('users')->ignore($this->user->id ?? $this->route('user')),
        ],
        // Category သည် active ဖြစ်နေမှသာ လက်ခံမည်
        'category_id' => [
            'required',
            Rule::exists('categories', 'id')->where(fn ($q) => $q->where('is_active', true)),
        ],
    ];
}
```

### (၃) Conditional Rules (`Rule::when`, `required_if`, `prohibited_if`)
```php
return [
    'payment_type' => ['required', Rule::in(['cash', 'credit_card', 'kpay'])],
    // credit_card ဖြစ်မှသာ card_number လိုအပ်မည်
    'card_number'  => ['required_if:payment_type,credit_card', 'nullable', 'digits:16'],
    // cash ဖြစ်ပါက card_number လုံးဝ မပါရ
    'card_cvv'     => ['prohibited_if:payment_type,cash', 'nullable', 'digits:3'],
    
    // PHP Callback ဖြင့် စစ်ဆေးခြင်း
    'tax_id' => Rule::when($this->user()?->is_business, ['required', 'string', 'size:13']),
];
```

---

## ၅။ Custom Validation Rules & Closure Rules ရေးသားခြင်း

အဆင်သင့်ပါသော Rule များဖြင့် မလုံလောက်သည့်အခါ ကိုယ်ပိုင် Rule ရေးသားနိုင်သည်။

### နည်းလမ်း (၁) - Inline Closure Rule (တစ်ကြိမ်သာ သုံးမည့်အခါ)
```php
'nrc_number' => [
    'required',
    function (string $attribute, mixed $value, \Closure $fail) {
        if (! preg_match('/^[0-9]{1,2}\/[A-Za-z]+\([N,P,E]\)[0-9]{6}$/', $value)) {
            $fail("ထည့်သွင်းထားသော {$attribute} သည် မြန်မာမှတ်ပုံတင် ပုံစံမမှန်ပါ။");
        }
    },
],
```

### နည်းလမ်း (၂) - Reusable Rule Class
```bash
php artisan make:rule ValidCouponCode
```
`app/Rules/ValidCouponCode.php`
```php
namespace App\Rules;

use Closure;
use App\Models\Coupon;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCouponCode implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $coupon = Coupon::where('code', $value)->first();

        if (! $coupon) {
            $fail('ကူပွန်ကုဒ် မမှန်ကန်ပါ။');
            return;
        }

        if ($coupon->isExpired()) {
            $fail('ဤကူပွန်ကုဒ်သည် သက်တမ်းကုန်ဆုံးသွားပါပြီ။');
            return;
        }

        if ($coupon->used_count >= $coupon->max_usage) {
            $fail('ဤကူပွန်ကုဒ် အသုံးပြုခွင့် အရေအတွက် ပြည့်သွားပါပြီ။');
            return;
        }
    }
}
```
အသုံးပြုပုံ:
```php
'coupon_code' => ['nullable', 'string', new ValidCouponCode],
```

---

## ၆။ Complex Validation: Nested Arrays, Files & Password Rules

### (က) Nested Arrays (Order Items စစ်ဆေးခြင်း)
Shopping Cart တစ်ခုတွင် ပစ္စည်းမျိုးစုံ ထည့်သွင်းရာတွင်သုံးသည်:
```php
return [
    'customer_name'          => ['required', 'string'],
    'items'                  => ['required', 'array', 'min:1'],
    'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
    'items.*.quantity'       => ['required', 'integer', 'min:1', 'max:50'],
    'items.*.custom_notes'   => ['nullable', 'string', 'max:100'],
];
```

### (ခ) File Uploads (လုံခြုံရေး အဆင့်မြင့် စစ်ဆေးခြင်း)
```php
return [
    'avatar' => [
        'required',
        'file',
        'image',
        'mimes:jpg,jpeg,png,webp',
        'max:2048', // 2 MB
        'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
    ],
    'resume' => [
        'nullable',
        'file',
        'mimes:pdf',
        'max:5120', // 5 MB
    ],
];
```

### (ဂ) Modern Password Rules (Security Standard)
```php
use Illuminate\Validation\Rules\Password;

return [
    'password' => [
        'required',
        'confirmed', // password_confirmation နှင့် တူရမည်
        Password::min(8)
            ->letters()        // အက္ခရာ အနည်းဆုံး ၁ လုံး
            ->mixedCase()      // စာလုံး အကြီး/အသေး ရောပါရမည်
            ->numbers()        // ဂဏန်း ပါရမည်
            ->symbols()        // သင်္ကေတ (!@#$%^&*) ပါရမည်
            ->uncompromised(), // Hacker များ leak လုပ်ထားသော DB များထဲ မပါဝင်ရ (HaveIBeenPwned API စစ်သည်)
    ],
];
```

---

## ၇။ Eloquent API Resources ဆိုတာဘာလဲ? ဘာကြောင့် Resource ကို သုံးသင့်သလဲ?

### ❌ Model ကို JSON တိုက်ရိုက် Return ပေးခြင်း၏ အန္တရာယ်
```php
public function show(User $user) {
    return $user; // ❌ ဘယ်တော့မှ မလုပ်သင့်ပါ!
}
```
* `password` hash ပေါက်ကြားသွားနိုင်သည်။
* `created_at` format များကို မပြောင်းနိုင်ပါ။
* Database column name (`tbl_usr_addr`) ကို Frontend သို့ တိုက်ရိုက် ပြသမိသဖြင့် Internal DB Structure ပေါက်ကြားသည်။

### ✅ Eloquent Resource ၏ အားသာချက်
Eloquent Resource သည် **Database Model** နှင့် **Frontend JSON** အကြားတွင် **ခံထားသော Transformer Layer (Filter & Masking)** ဖြစ်သည်။

```
 Database Model               Eloquent Resource               Client Response (JSON)
┌─────────────────┐          ┌───────────────────┐          ┌───────────────────────┐
│ id: 1           │          │ id                │          │ "id": 1,              │
│ name: "Kyaw"    │ ───────► │ full_name         │ ───────► │ "full_name": "Kyaw",  │
│ password: "$2y."│ (Masked) │ (hidden)          │          │ (လုံးဝ မပါဝင်ပါ)        │
│ is_active: 1    │          │ status            │          │ "status": "active"    │
└─────────────────┘          └───────────────────┘          └───────────────────────┘
```

---

## ၈။ Single Resource vs Resource Collection

```bash
# Single Model အတွက်
php artisan make:resource ProductResource

# Collection (List) အတွက်
php artisan make:resource ProductCollection
```

### Single Resource (`app/Http/Resources/ProductResource.php`)
```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'sku'         => $this->sku,
            'price'       => [
                'raw'       => $this->price,
                'formatted' => '¥' . number_format($this->price),
            ],
            'in_stock'    => $this->stock > 0,
            'created_at'  => $this->created_at?->toIso8601String(),
        ];
    }
}
```

### Controller တွင် အသုံးပြုပုံ
```php
// (၁) Single Item ပြသခြင်း
public function show(Product $product)
{
    return new ProductResource($product);
}

// (၂) စာရင်း (Collection) ပြသခြင်း
public function index()
{
    $products = Product::paginate(10);
    return ProductResource::collection($products);
}
```

---

## ၉။ Resource Advanced: when(), whenLoaded(), with() & Pagination

### (က) Conditional Attributes (`$this->when`)
User သည် Admin ဖြစ်မှသာ မြင်သင့်သော အချက်အလက်များ:
```php
public function toArray(Request $request): array
{
    return [
        'id'    => $this->id,
        'name'  => $this->name,
        'cost_price' => $this->when($request->user()?->isAdmin(), $this->cost_price),
        'secret_key' => $this->whenNotNull($this->secret_key),
    ];
}
```

### (ခ) N+1 Query ကာကွယ်ခြင်း (`$this->whenLoaded`) - အလွန်အရေးကြီးသည်!
Relationship တစ်ခုကို Controller တွင် `with()` ဖြင့် Eager Load လုပ်လာမှသာ JSON ထဲ ထည့်သွင်းစေရန်:
```php
public function toArray(Request $request): array
{
    return [
        'id'          => $this->id,
        'name'        => $this->name,
        
        // Category relationship ကို Eager load လုပ်ထားမှသာ ထည့်မည်!
        // မဟုတ်ပါက Query အပို ထပ်မ Run တော့ပါ (N+1 Problem မှ ကင်းဝေး)
        'category'    => new CategoryResource($this->whenLoaded('category')),
        'tags'        => TagResource::collection($this->whenLoaded('tags')),
        
        // Count ကို load ထားမှ ပြမည်
        'reviews_count' => $this->whenCounted('reviews'),
    ];
}
```

### (ဂ) Global Metadata ပေါင်းထည့်ခြင်း (`with`)
```php
public function with(Request $request): array
{
    return [
        'meta' => [
            'server_time' => now()->toIso8601String(),
            'api_version' => 'v1.0',
        ],
    ];
}
```

---

## ၁၀။ Real-World Project Implementation (Orders & Items System)

အလုပ်ခွင်သုံး Order တင်ခြင်းစနစ်တစ်ခုကို Form Request, Validation, Resource အပြည့်အစုံဖြင့် တည်ဆောက်ပြပါမည်။

### အဆင့် ၁ - Form Request ရေးသားခြင်း
`app/Http/Requests/StoreOrderRequest.php`
```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth:sanctum middleware ဖြင့် စစ်ထားပြီးဖြစ်သည်
    }

    public function rules(): array
    {
        return [
            'shipping_address'          => ['required', 'string', 'max:500'],
            'payment_method'            => ['required', 'string', 'in:credit_card,kpay,wave,cash'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.product_id'        => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'          => ['required', 'integer', 'min:1'],
        ];
    }
}
```

### အဆင့် ၂ - API Resources ဖန်တီးခြင်း
`app/Http/Resources/OrderItemResource.php`
```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id'   => $this->product_id,
            'product_name' => $this->product?->name,
            'unit_price'   => $this->unit_price,
            'quantity'     => $this->quantity,
            'subtotal'     => $this->unit_price * $this->quantity,
        ];
    }
}
```

`app/Http/Resources/OrderResource.php`
```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_id'         => $this->id,
            'order_number'     => $this->order_number,
            'status'           => $this->status,
            'total_amount'     => $this->total_amount,
            'shipping_address' => $this->shipping_address,
            'items'            => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at'       => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
```

### အဆင့် ၃ - Controller တွင် သန့်ရှင်းစွာ အချောသတ်ခြင်း
`app/Http/Controllers/Api/OrderController.php`
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {
        // DB Transaction ဖြင့် အမှားအယွင်းမရှိအောင် ထိန်းသိမ်းခြင်း
        $order = DB::transaction(function () use ($request) {
            $totalAmount = 0;
            $itemsData = [];

            foreach ($request->validated('items') as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(422, "{$product->name} ပစ္စည်းအတွက် လက်ကျန် Stock မလုံလောက်ပါ။");
                }

                // Stock လျှော့ချခြင်း
                $product->decrement('stock', $item['quantity']);

                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $product->price,
                ];
            }

            // Order ဖန်တီးခြင်း
            $order = Order::create([
                'user_id'          => $request->user()->id,
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount'     => $totalAmount,
                'shipping_address' => $request->validated('shipping_address'),
                'payment_method'   => $request->validated('payment_method'),
                'status'           => 'pending',
            ]);

            $order->items()->createMany($itemsData);

            return $order;
        });

        // Eager load လုပ်ပြီးမှ Resource ဖြင့် Response ပြန်ခြင်း
        return (new OrderResource($order->load('items.product')))
            ->response()
            ->setStatusCode(201);
    }
}
```

---

## ၁၁။ Testing Validation & Resources (Feature Tests)

Validation နှင့် Resource များ ကောင်းမွန်စွာ အလုပ်လုပ်ကြောင်း အလိုအလျောက် Test ရေးသားစစ်ဆေးပုံ:

```php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_creation_fails_when_items_are_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'shipping_address' => 'Yangon, Myanmar',
                'payment_method'   => 'kpay',
                // items မပါဝင်ပါ
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items']);
    }

    public function test_order_creation_succeeds_and_returns_correct_resource_structure(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 5000]);

        $payload = [
            'shipping_address' => 'No. 123, Bogyoke Road, Yangon',
            'payment_method'   => 'kpay',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 2,
                ]
            ]
        ];

        $response = $this->actingAs($user)->postJson('/api/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'order_id',
                    'order_number',
                    'total_amount',
                    'status',
                    'items' => [
                        '*' => ['product_id', 'product_name', 'unit_price', 'quantity', 'subtotal']
                    ]
                ]
            ])
            ->assertJsonPath('data.total_amount', 10000);

        // Database ထဲတွင် stock လျော့သွားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
        $this->assertDatabaseHas('products', [
            'id'    => $product->id,
            'stock' => 8,
        ]);
    }
}
```

---

## ၁၂။ လေ့ကျင့်ခန်းများ (Hands-on Exercises)

### 🏋️ လေ့ကျင့်ခန်း (၁) - Unique with Soft Deletes
User profile update လုပ်သော `UpdateProfileRequest` ကို ဖန်တီးပါ။ `email` ကို unique စစ်ဆေးရာတွင် မိမိ၏ User ID ကို ignore လုပ်သည့်အပြင် Soft-deleted ဖြစ်နေသော account များကိုပါ ချန်လှပ်နိုင်အောင် `Rule::unique('users')->ignore($user->id)->whereNull('deleted_at')` ဖြင့် စမ်းသပ်ပါ။

### 🏋️ လေ့ကျင့်ခန်း (၂) - NRC Custom Rule
မြန်မာနိုင်ငံ မှတ်ပုံတင်နံပါတ် (ဥပမာ: `12/DAGAMA(N)123456`) ကို စစ်ဆေးနိုင်သော `ValidNrcRule` Custom Rule တစ်ခု ရေးသားပြီး Register Request တွင် ထည့်သွင်း အသုံးပြုပါ။

### 🏋️ လေ့ကျင့်ခန်း (၃) - Dynamic Conditional Resource
`UserResource` တစ်ခု ပြုလုပ်ပါ။ လက်ရှိ Login ဝင်ထားသော User ကိုယ်တိုင် ဖြစ်ပါက သို့မဟုတ် `admin` ဖြစ်ပါက `email`, `phone_number`, `created_at` များကို ပြသပြီး၊ တခြား User များ ကြည့်ရှုပါက `id`, `name`, `avatar_url` သာ မြင်တွေ့ရအောင် `$this->when()` ဖြင့် ရေးသားပါ။

### 🏋️ လေ့ကျင့်ခန်း (၄) - Nested Array Bulk Validation
စာအုပ်ဆိုင်အတွက် စာအုပ်များစွာကို တစ်ပြိုင်နက် သွင်းနိုင်သော `BulkStoreBookRequest` ကို ဖန်တီးပါ။ Input အဖြစ် `books.*.isbn`, `books.*.title`, `books.*.author_id` များကို စစ်ဆေးပြီး ISBN နံပါတ်များသည် Payload ထဲတွင် ထပ်မနေစေရန် `distinct` rule ကို အသုံးပြုပါ။

---

## 🎯 သင်ခန်းစာ အနှစ်ချုပ် (Summary)

1. **Input Security (Form Requests)**:
   * Client ဆီမှ လာသော Data များကို Controller မရောက်မီ **Form Request** ဖြင့် အမြဲ အကာအကွယ်ယူပါ။
   * Controller ထဲတွင် `$request->all()` ကို လုံးဝ မသုံးဘဲ `$request->validated()` ကိုသာ သုံးပါ။
2. **Output Security (API Resources)**:
   * Database Model များကို အပြင်သို့ တိုက်ရိုက် မထုတ်ဘဲ **Eloquent Resource** ဖြင့် Filter နှင့် Transform ပြုလုပ်ပါ။
   * Relationship များကို Eager load မလုပ်ဘဲ ခေါ်မိခြင်းကြောင့် ဖြစ်တတ်သည့် **N+1 Problem** ကို `$this->whenLoaded()` ဖြင့် ကာကွယ်ပါ။
3. **Clean Architecture**:
   * Controller သည် Request လက်ခံခြင်းနှင့် Response ပြန်ပို့ခြင်း (Traffic Director) အဖြစ်သာ တာဝန်ယူပြီး၊ Validation Logic များကို Form Request ထဲတွင်သာ သီးသန့် ထားရှိခြင်းဖြင့် Enterprise-level Codebase ကို တည်ဆောက်နိုင်မည် ဖြစ်သည်။
