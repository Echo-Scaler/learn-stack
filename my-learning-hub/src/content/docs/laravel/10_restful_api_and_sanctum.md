---
title: "10. REST API and Sanctum"
description: "1. [RESTful API ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-restful-api-ဆိုတာဘာလဲ)"
---

## 🌐 သင်ခန်းစာ (၁၀) - RESTful API တည်ဆောက်ခြင်းနှင့် Laravel Sanctum
### (Lesson 10: Building Modern REST APIs, API Resources & Sanctum Token Auth)

---

## 📌 မာတိကာ (Contents)
1. [RESTful API ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-restful-api-ဆိုတာဘာလဲ)
2. [API Routing နှင့် API Versioning (`routes/api.php`)](#၂-api-routing-နှင့်-api-versioning)
3. [Eloquent API Resources ၏ အရေးကြီးပုံနှင့် အားသာချက်များ](#၃-eloquent-api-resources)
4. [Laravel Sanctum ဖြင့် Token-Based Authentication စနစ်](#၄-laravel-sanctum-ဖြင့်-token-auth)
5. [Login, Register, Logout API Endpoints ရေးသားခြင်း](#၅-login-register-logout-api-endpoints)
6. [Standardized API Response Format နှင့် HTTP Status Codes](#၆-standardized-api-response-format)

---

## ၁။ RESTful API ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**RESTful API** ဆိုသည်မှာ Frontend (React, Vue, Next.js) သို့မဟုတ် Mobile App (Flutter, React Native, iOS, Android) များအတွက် HTML စာမျက်နှာများ ပြသမည့်အစား စက်အချင်းချင်း နားလည်နိုင်သော **JSON Format ဒေတာများ** ကို လဲလှယ်ပေးပို့သော Backend ဝန်ဆောင်မှု ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
ခေတ်မီဆော့ဖ်ဝဲလ်လောကတွင် Web ရော Mobile App ပါ ပြိုင်တူ တည်ဆောက်ကြသည်။ Backend Logic ကို နှစ်ခါပြန်မရေးရဘဲ Single Source Backend အဖြစ် ထားရှိရန် API ကို မဖြစ်မနေ သုံးရသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Cross-Platform**: မည်သည့် Frontend Device မဆို JSON Data ကို တူညီစွာ ဖတ်ရှုအသုံးပြုနိုင်သည်။
* **Stateless**: Server ဘက်တွင် Session သိမ်းစရာမလိုဘဲ Bearer Token ဖြင့် စစ်ဆေးသဖြင့် Scalability အလွန်ကောင်းမွန်သည်။

---

## ၂။ API Routing နှင့် API Versioning

Laravel 11 တွင် API routing စတင်ရန်:
```bash
php artisan install:api
```

### ဘာကြောင့် API Versioning (`/api/v1/`) သုံးရသလဲ?
Mobile App အဟောင်းကို သုံးနေသေးသော User များအတွက် Backend က ပြင်လိုက်ပါက App ပျက်ကျ (Crash) မသွားစေရန် Version ခွဲခြားရေးသားခြင်း ဖြစ်သည်။

```php
// routes/api.php
use App\Http\Controllers\Api\V1\ProductController;

Route::prefix('v1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
    });
});
```

---

## ၃။ Eloquent API Resources

### (က) ဒါက ဘာလဲ? (What is it?)
Database Model မှ Data များကို JSON အဖြစ် ပြောင်းလဲပေးပို့ရာတွင် ကြားခံ Layer အဖြစ် စစ်ထုတ်ပေးသော Class ဖြစ်သည်။

```bash
php artisan make:resource ProductResource
```

### (ခ) ဘာကြောင့် Model ကို တိုက်ရိုက် `return` မလုပ်သင့်သလဲ? (Why use this feature?)
Model ကို တိုက်ရိုက် return လုပ်ပါက `password`, `cost_price` ကဲ့သို့ လျှို့ဝှက်ချက် Column များ အပြင်သို့ ပေါက်ကြားသွားနိုင်သည်။ ထို့အပြင် Database Column အမည် ပြောင်းလိုက်ပါက Frontend App များ အကုန် ပျက်စီးသွားမည်။

### (ဂ) အားသာချက်များ:
* **Security & Encapsulation**: ပြသလိုသော Field များကိုသာ တိကျစွာ ရွေးထုတ်ပေးနိုင်သည်။
* **Data Formatting**: စျေးနှုန်းနှင့် နေ့စွဲများကို စံသတ်မှတ်ချက်အတိုင်း ပြင်ဆင်ပေးနိုင်သည်။

```php
// app/Http/Resources/ProductResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'price'           => (float) $this->price,
            'formatted_price' => number_format($this->price) . ' MMK',
            'in_stock'        => $this->stock > 0,
            'created_at'      => $this->created_at->toIso8601String(),
        ];
    }
}
```

---

## ၄။ Laravel Sanctum ဖြင့် Token-Based Authentication

### (က) ဘာကြောင့် Cookie Session မသုံးဘဲ Token Auth သုံးရသလဲ?
Mobile App များ (Flutter, iOS, Android) သည် Web Browser ကဲ့သို့ Cookies များကို ကောင်းမွန်စွာ မကိုင်တွယ်နိုင်ပါ။ ထို့ကြောင့် Header ထဲတွင် `Authorization: Bearer <token>` ထည့်သွင်းပေးပို့သော Token စနစ်ကို သုံးသည်။

---

## ၅။ Login, Register, Logout API Endpoints

```php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။'
            ], 401);
        }

        // Bearer Token ထုတ်ပေးခြင်း
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login အောင်မြင်ပါသည်',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request)
    {
        // လက်ရှိ Token ကို ဖျက်သိမ်းခြင်း
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout အောင်မြင်စွာ ထွက်ပြီးပါပြီ'
        ]);
    }
}
```

---

## ၆။ Standardized API Response Format နှင့် HTTP Status Codes

| HTTP Status | အဓိပ္ပာယ် | မည်သည့်အခါတွင် သုံးသလဲ |
| :--- | :--- | :--- |
| `200 OK` | Success | GET, PUT အောင်မြင်သောအခါ |
| `201 Created` | Created | POST ဖြင့် အသစ်ထည့်သွင်းမှု အောင်မြင်သောအခါ |
| `401 Unauthorized` | Auth Failed | Token မပါခြင်း သို့မဟုတ် သက်တမ်းကုန်နေခြင်း |
| `403 Forbidden` | Forbidden | Login ဝင်ထားသော်လည်း လုပ်ပိုင်ခွင့် မရှိခြင်း |
| `404 Not Found` | Not Found | ဒေတာ ရှာမတွေ့သောအခါ |
| `422 Unprocessable`| Validation Failed | Input ဒေတာ မှားယွင်းနေသောအခါ |
| `500 Server Error` | Server Exception | Backend Code အမှားဖြစ်သောအခါ |
