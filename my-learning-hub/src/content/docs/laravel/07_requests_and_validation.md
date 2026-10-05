---
title: "07. Requests and Validation"
description: "1. [Request Object ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-request-object-ဆိုတာဘာလဲ)"
---

## 🛡️ သင်ခန်းစာ (၇) - Request Data ဖမ်းယူခြင်းနှင့် Form Request Validation
### (Lesson 7: Handling HTTP Requests, Form Request Classes & Validation Rules)

---

## 📌 မာတိကာ (Contents)
1. [Request Object ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-request-object-ဆိုတာဘာလဲ)
2. [Input Data ဖမ်းယူခြင်း နည်းလမ်းများ (`only`, `except`, `filled`)](#၂-input-data-ဖမ်းယူခြင်း-နည်းလမ်းများ)
3. [Controller ထဲတွင် Inline Validation စစ်ဆေးခြင်း](#၃-controller-ထဲတွင်-inline-validation-စစ်ဆေးခြင်း)
4. [Dedicated Form Request Class အသုံးပြုခြင်း (ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၄-dedicated-form-request-class-အသုံးပြုခြင်း)
5. [လုပ်ငန်းခွင်တွင် အသုံးအများဆုံး Validation Rules များ](#၅-လုပ်ငန်းခွင်တွင်-အသုံးအများဆုံး-validation-rules-များ)
6. [မြန်မာလို Custom Error Messages ရေးသားသတ်မှတ်ခြင်း](#၆-မြန်မာလို-custom-error-messages-ရေးသားသတ်မှတ်ခြင်း)
7. [Blade View နှင့် API JSON များတွင် Validation Errors ပြသပုံ](#၇-blade-view-နှင့်-api-json-များတွင်-validation-errors-ပြသပုံ)

---

## ၁။ Request Object ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
`Illuminate\Http\Request` Object သည် အသုံးပြုသူ Browser မှ ပေးပို့လိုက်သော Form Inputs, Headers, Cookies, Uploaded Files နှင့် Client IP Address များကို စုစည်းပေးထားသော အရာဝတ္ထု (Object) ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Pure PHP ၏ `$_GET`, `$_POST`, `$_FILES` စသည့် Superglobals များသည် XSS/Sanitization ကာကွယ်မှု မပါရှိပါ။ Laravel Request Object သည် Input များကို စစ်ထုတ်ပြီး အလုံခြုံဆုံး API Interface ကို ပေးစွမ်းသည်။

---

## ၂။ Input Data ဖမ်းယူခြင်း နည်းလမ်းများ

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // ၁။ တန်ဖိုး တစ်ခုချင်း ဖမ်းယူခြင်း (Default Value ပါဝင်သည်)
        $name = $request->input('name', 'Anonymous');

        // ၂။ လိုအပ်သော Field သာ သီးသန့် ရွေးယူခြင်း (အလွန် လုံခြုံသည်)
        $userData = $request->only(['name', 'email', 'phone']);

        // ၃။ မလိုလားအပ်သော Token များကို ဖယ်ချန်ယူခြင်း
        $cleanData = $request->except(['_token', 'password_confirmation']);

        // ၄။ Field ပါဝင်ပြီး ကွက်လပ်မဟုတ်မှသာ true ဖြစ်ခြင်း
        if ($request->filled('promo_code')) {
            // Promo code ထည့်သွင်းထားသည်
        }

        // ၅။ IP Address ရယူခြင်း
        $clientIp = $request->ip();
    }
}
```

---

## ၃။ Controller ထဲတွင် Inline Validation စစ်ဆေးခြင်း

```php
public function register(Request $request)
{
    $validated = $request->validate([
        'name'     => 'required|string|max:50',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:8|confirmed',
    ]);

    User::create($validated);
    return redirect()->route('home')->with('success', 'အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်');
}
```

---

## ၄။ Dedicated Form Request Class အသုံးပြုခြင်း

### (က) ဒါက ဘာလဲ? (What is it?)
Validation Rules များကို Controller ထဲတွင် မရေးဘဲ သီးသန့် Request Class တစ်ခုအဖြစ် ခွဲထုတ်ရေးသားသော စနစ်ဖြစ်သည်။

```bash
php artisan make:request StoreProductRequest
```

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
Controller ထဲတွင် Validation Rules များ ပြည့်နှက်နေပါက Controller သည် ကြီးမားရှုပ်ထွေးလာသည် (Fat Controller)။ Form Request ခွဲထုတ်လိုက်ပါက Controller သည် လိုင်း ၃ ကြောင်းဖြင့် အလွန်သန့်ရှင်းသွားသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Automatic Validation**: Controller သို့ မရောက်မီ Validation အလိုအလျောက် စစ်ဆေးပြီး ဖြစ်သည်။
* **Reusability**: Request Class တစ်ခုတည်းကို Web Form ရော REST API တွင်ပါ ပြန်လည်အသုံးပြုနိုင်သည်။
* **Custom Error Messages**: မြန်မာလို အသိပေးစာများကို စနစ်တကျ ခွဲထုတ်ရေးသားနိုင်သည်။

```php
// app/Http/Requests/StoreProductRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ခွင့်ပြုချက် စစ်ဆေးခြင်း
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric', 'min:0'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ];
    }
}
```

#### Controller တွင် သုံးစွဲပုံ:
```php
public function store(StoreProductRequest $request)
{
    // $request->validated() သည် စည်းကမ်းချက်နှင့် ကိုက်ညီသော ဒေတာများကိုသာ ပြန်ပေးသည်
    Product::create($request->validated());

    return redirect()->route('products.index');
}
```

---

## ၅။ လုပ်ငန်းခွင်တွင် အသုံးအများဆုံး Validation Rules များ

| Rule | ဘာကြောင့် သုံးရသလဲ (Why use it) | ဥပမာ ကုဒ် |
| :--- | :--- | :--- |
| `required` | ကွက်လပ် လုံးဝ မဖြစ်စေရန် | `'name' => 'required'` |
| `email` | မှန်ကန်သော Email format စစ်ရန် | `'email' => 'required\|email'` |
| `unique:table,col` | DB ထဲတွင် Email/Phone ထပ်မနေစေရန် | `'email' => 'unique:users,email'` |
| `exists:table,col` | ရွေးထားသော ID သည် DB ထဲ အမှန်ရှိရန် | `'category_id' => 'exists:categories,id'` |
| `confirmed` | password နှင့် confirmation တူမတူ စစ်ရန် | `'password' => 'required\|confirmed'` |
| `image` | Malicious script မဟုတ်ဘဲ ပုံအစစ် စစ်ရန် | `'avatar' => 'image\|mimes:jpg,png'` |
| `max:kb` | File အရွယ်အစား ကန့်သတ်ရန် | `'photo' => 'max:2048'` (2MB Max) |

---

## ၆။ မြန်မာလို Custom Error Messages ရေးသားသတ်မှတ်ခြင်း

```php
public function messages(): array
{
    return [
        'category_id.required' => 'ကုန်ပစ္စည်း အမျိုးအစား ရွေးချယ်ပေးရန် လိုအပ်ပါသည်။',
        'category_id.exists'   => 'ရွေးချယ်ထားသော အမျိုးအစား မရှိပါ။',
        'title.required'       => 'ကုန်ပစ္စည်း အမည် ထည့်သွင်းပေးပါ။',
        'price.required'       => 'ဈေးနှုန်း ထည့်သွင်းပေးပါ။',
        'price.numeric'        => 'ဈေးနှုန်းသည် ဂဏန်း ဖြစ်ရပါမည်။',
        'image.image'          => 'ပုံဖိုင်သာ တင်ပေးရပါမည်။',
    ];
}
```

---

## ၇။ Blade View နှင့် API JSON များတွင် Validation Errors ပြသပုံ

### (က) Blade Template ထဲတွင်:
```html
<input type="text" name="title" value="{{ old('title') }}" 
       class="@error('title') is-invalid @enderror">

@error('title')
    <span class="text-danger">{{ $message }}</span>
@enderror
```

### (ခ) RESTful API တွင် Auto Response (HTTP 422 Unprocessable Entity):
```json
{
  "message": "ကုန်ပစ္စည်း အမည် ထည့်သွင်းပေးပါ။",
  "errors": {
    "title": ["ကုန်ပစ္စည်း အမည် ထည့်သွင်းပေးပါ။"]
  }
}
```
