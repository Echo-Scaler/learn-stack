---
title: "01. Request Lifecycle"
description: "1. [Laravel မိတ်ဆက် (ဒါက ဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၁-laravel-မိတ်ဆက်)"
---

## 🚀 သင်ခန်းစာ (၁) - Laravel ဆိုတာဘာလဲနှင့် Request Lifecycle အလုပ်လုပ်ပုံ
### (Lesson 1: Introduction to Laravel & Request Lifecycle Architecture)

---

## 📌 မာတိကာ (Contents)
1. [Laravel မိတ်ဆက် (ဒါက ဘာလဲ? ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၁-laravel-မိတ်ဆက်)
2. [Laravel Request Lifecycle အလုပ်လုပ်ပုံ Diagram](#၂-laravel-request-lifecycle-အလုပ်လုပ်ပုံ-diagram)
3. [Request Lifecycle အဆင့်ဆင့် အသေးစိတ် ရှင်းလင်းချက် (Function Sectors)](#၃-request-lifecycle-အဆင့်ဆင့်-အသေးစိတ်)
   - [၃.၁။ Entry Point (`public/index.php`)](#၃၁-entry-point-publicindexphp)
   - [၃.၂။ Bootstrap Application (`bootstrap/app.php`)](#၃၂-bootstrap-application)
   - [၃.၃။ Service Providers (The Heart of Laravel)](#၃၃-service-providers)
   - [၃.၄။ Routing Engine & Middleware Pipeline](#၃၄-routing-engine--middleware-pipeline)
   - [၃.၅။ Controller & Model Execution](#၃၅-controller--model-execution)
   - [၃.၆။ Response Sending Back to Client](#၃၆-response-sending-back-to-client)
4. [Service Container နှင့် Dependency Injection (ဘာကြောင့် သုံးရသလဲ? အားသာချက်များ)](#၄-service-container-နှင့်-dependency-injection)
5. [လက်တွေ့ လုပ်ငန်းခွင်သုံး Summary Checklist](#၅-လက်တွေ့-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Laravel မိတ်ဆက်

### (က) ဒါက ဘာလဲ? (What is it?)
**Laravel** ဆိုသည်မှာ PHP Programming Language ပေါ်တွင် အခြေခံ၍ **Taylor Otwell** က ဖန်တီးခဲ့သော Open-source **Full-Stack Web Application Framework** ဖြစ်ပါသည်။ ၎င်းသည် **MVC (Model-View-Controller)** ဒီဇိုင်းပုံစံကို တိကျစွာ လိုက်နာထားသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
Pure PHP (Vanilla PHP) ဖြင့် Web Application ကြီးများ ရေးသားသည့်အခါ Database Connection ချိန်ညှိခြင်း၊ Routing ရေးဆွဲခြင်း၊ Authentication ပြုလုပ်ခြင်း၊ CSRF/XSS လုံခြုံရေး ကာကွယ်ခြင်း စသည်တို့ကို အစမှအဆုံး ကိုယ်တိုင် လက်ဖြင့် ရေးသားရသဖြင့် အချိန်ကုန်ပြီး လုံခြုံရေး အားနည်းချက် (Security Bugs) များစွာ ဖြစ်ပေါ်စေသည်။ Laravel သည် ဤလုပ်ငန်းစဉ်အားလုံးကို စံချိန်မီ ထည့်သွင်းပေးထားသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Expressive & Elegant Syntax**: ကုဒ်ရေးသားရသည်မှာ အင်္ဂလိပ်စာဖတ်ရသကဲ့သို့ ရှင်းလင်းလှပသည်။
* **Batteries Included**: Authentication, Authorization, Database Migrations, Queues, Caching, Event Listeners စသည်တို့ အသင့်ပါဝင်သည်။
* **Massive Community & Ecosystem**: မည်သည့် Error မဆို ဖြေရှင်းနည်း ချက်ချင်းရှာတွေ့နိုင်ပြီး ခေတ်မီ Packages များစွာ အသင့်ရှိသည်။

### (ဃ) မသုံးခဲ့လျှင် ကြုံတွေ့ရမည့် ပြဿနာများ:
ကုဒ်ဖွဲ့စည်းပုံ စနစ်မကျခြင်း (Spaghetti Code)၊ Developer အသစ်များ ဝင်ရောက်လာပါက ကုဒ်ဖတ်မရခြင်း၊ Web Security အားနည်းချက်များ အလွယ်တကူ ဖြစ်ပေါ်ခြင်း။

---

## ၂။ Laravel Request Lifecycle အလုပ်လုပ်ပုံ Diagram

```
[အသုံးပြုသူ Browser / HTTP Client]
              │ (1) HTTP Request (GET /products)
              ▼
    ┌───────────────────┐
    │  public/index.php │  ◄── စနစ်တစ်ခုလုံး၏ တစ်ခုတည်းသော ဝင်ပေါက် (Single Entry Point)
    └─────────┬─────────┘
              │ (2) Composer Autoloader & Bootstrap App
              ▼
    ┌───────────────────┐
    │  bootstrap/app.php│  ◄── Application Instance တည်ဆောက်ခြင်း
    └─────────┬─────────┘
              │ (3) Handle Request via HTTP Kernel
              ▼
    ┌───────────────────┐
    │ Service Providers │  ◄── Framework အစိတ်အပိုင်းများကို Register လုပ်ပြီး Boot တက်စေခြင်း
    └─────────┬─────────┘
              │ (4) Dispatch to Router
              ▼
    ┌───────────────────┐
    │  Routing Engine   │  ◄── routes/web.php သို့မဟုတ် routes/api.php နှင့် တိုက်စစ်ခြင်း
    └─────────┬─────────┘
              │ (5) Pass through Middlewares
              ▼
    ┌───────────────────┐
    │ Middleware Pipeline│ ◄── CSRF, Auth, Rate-limiting စစ်ဆေးခြင်း
    └─────────┬─────────┘
              │ (6) Send to Controller Action
              ▼
    ┌───────────────────┐
    │    Controller     │  ◄── Request လက်ခံပြီး Model ထံ Data တောင်းခြင်း
    └─────┬───────▲─────┘
 (7) Query│       │(8) Return Model/Collection
          ▼       │
    ┌──────────┐  │
    │  Model   │──┘        ◄── Database (Eloquent ORM / PDO)
    └──────────┘
          │ (9) Return Blade View or JSON Data
          ▼
    ┌───────────────────┐
    │  View / Response  │  ◄── Render HTML or Generate JSON Response
    └─────────┬─────────┘
              │ (10) Send back to Browser
              ▼
[အသုံးပြုသူထံ စာမျက်နှာ ပြသပေးခြင်း]
```

---

## ၃။ Request Lifecycle အဆင့်ဆင့် အသေးစိတ် (Function Sectors)

### ၃.၁။ Entry Point (`public/index.php`)
* **ဒါက ဘာလဲ**: Web Server သို့ ရောက်လာသမျှ Traffic အားလုံး၏ တစ်ခုတည်းသော စတင်ရာနေရာ (Single Entry Point) ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: `.env` ဖိုင်၊ Application Core ဖိုင်များနှင့် Vendor ဖိုင်များကို အင်တာနက်ပေါ်မှ လူတိုင်း တိုက်ရိုက်မဝင်ရောက်နိုင်စေရန် လုံခြုံရေးအရ `public/` folder ကိုသာ Web root အဖြစ် ထားရှိခြင်း ဖြစ်သည်။
* **အားသာချက်**: Composer Autoloading (`vendor/autoload.php`) ကို စတင်စေပြီး Class များကို အလိုအလျောက် ခေါ်ယူပေးသည်။

---

### ၃.၂။ Bootstrap Application (`bootstrap/app.php`)
* **ဒါက ဘာလဲ**: Laravel Framework ၏ Application Instance (အခြေခံအုတ်မြစ်) ကို စတင်ဖန်တီးပေးသည့်နေရာ ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: Application အတွက် လိုအပ်သော Configuration, Routing ဖိုင်များ (`web.php`, `api.php`), Middleware Pipeline များနှင့် Exception Handlers များကို စတင်မှတ်ပုံတင်ရန် သုံးသည်။
* **အားသာချက်**: တစ်နေရာတည်းတွင် စနစ်တစ်ခုလုံး၏ Routing နှင့် Middleware များကို စုစည်း Configure လုပ်နိုင်သည်။

---

### ၃.၃။ Service Providers (The Heart of Laravel)
* **ဒါက ဘာလဲ**: Laravel တွင် မည်သည့် Feature မဆို (Database, Queue, Mail, Auth) အသက်ဝင်စေရန် Boot တက်ပေးသော ဗဟိုချက် Class များ ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: Class များအချင်းချင်း ချိတ်ဆက်မှု (Bindings) နှင့် Framework စတင်ချိန်တွင် ကြိုတင် run ရမည့် အလုပ်များကို စနစ်တကျ ခွဲဝေ run ပေးရန် ဖြစ်သည်။
* **အားသာချက်**:
  - `register()`: Service Container ထဲသို့ Interface များနှင့် Class များကို Bind လုပ်သည်။
  - `boot()`: Event listeners များ၊ Custom Blade directives များနှင့် Route Model Bindings များကို စတင်စေသည်။

---

### ၃.၄။ Routing Engine & Middleware Pipeline
* **ဒါက ဘာလဲ**: Browser မှ လာသော URL (ဥပမာ `/orders`) နှင့် ကိုက်ညီသည့် Controller ကို ရှာဖွေပေးပြီး ကြားဖြတ်လုံခြုံရေး Middleware များကို ဖြတ်သန်းစေသော စနစ်ဖြစ်သည်။
* **ဘာကြောင့် သုံးရသလဲ**: User သည် Login ဝင်ထားသလား (`auth`), Form သည် လုံခြုံမှုရှိသလား (`csrf`), Hacker က DDoS လုပ်နေသလား (`throttle`) စသည်တို့ကို Controller မရောက်မီ တားဆီးရန် ဖြစ်သည်။
* **အားသာချက်**: Controller ထဲတွင် လုံခြုံရေးစစ်ဆေးချက်များ ရောပြွမ်းမနေတော့ဘဲ သန့်ရှင်းစွာ သီးခြားစီမံနိုင်သည်။

---

### ၃.၅။ Controller & Model Execution
* **ဒါက ဘာလဲ**: Middleware များကို အောင်မြင်စွာ ဖြတ်သန်းလာသော Request ကို လက်ခံပြီး Business Logic များ အလုပ်လုပ်ကာ Database (Eloquent Model) မှ Data ရယူသည့် နေရာဖြစ်သည်။
* **အားသာချက်**: Data Layer (Model) နှင့် Presentation Layer (View) ကို အလယ်မှ ပေါင်းကူးချိတ်ဆက်ပေးသည်။

---

### ၃.၆။ Response Sending Back to Client
* **ဒါက ဘာလဲ**: Controller မှ ပြန်ပေးလိုက်သော Blade HTML သို့မဟုတ် JSON Data ကို HTTP Response Headers (Status 200, Content-Type, Cookies) များနှင့်အတူ Client Browser ထံ ပြန်လည်ပေးပို့ခြင်း ဖြစ်သည်။

---

## ၄။ Service Container နှင့် Dependency Injection

### (က) ဒါက ဘာလဲ? (What is it?)
Class များ၏ Object ဖန်တီးမှု (Instantiation) နှင့် ၎င်းတို့လိုအပ်သော Dependencies (အခြား Class များ) ကို ကိုယ်တိုင် `new` သော့ချက်စာလုံးဖြင့် ရေးစရာမလိုဘဲ အလိုအလျောက် ဖြည့်ဆည်းပေးသော **IoC (Inversion of Control) Container** ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ?
Manual Object ဆောက်ပါက Class တစ်ခု ပြင်လိုက်တိုင်း ၎င်းကို သုံးထားသော နေရာပေါင်း ရာချီတွင် လိုက်လံပြင်ဆင်နေရသည် (Tight Coupling)။

### (ဂ) အားသာချက်များ (Advantages):
* **Automatic Dependency Injection**: Controller Method သို့မဟုတ် Constructor တွင် Type-hint ပေးလိုက်ရုံဖြင့် Laravel က နောက်ကွယ်တွင် auto-resolve လုပ်ပေးသည်။
* **Testability**: Unit Testing ရေးသည့်အခါ Mock Objects များဖြင့် လွယ်ကူစွာ အစားထိုး စမ်းသပ်နိုင်သည်။

#### 🛠️ လက်တွေ့ Code နမူနာ:
```php
namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    // Laravel Service Container က PaymentService ကို auto inject လုပ်ပေးသည်
    // (new PaymentService(...) ဟု ရေးစရာ မလိုပါ)
    public function __construct(protected PaymentService $paymentService) {}

    public function process(Request $request)
    {
        $result = $this->paymentService->charge($request->amount);
        return response()->json($result);
    }
}
```

---

## ၅။ လက်တွေ့ လုပ်ငန်းခွင်သုံး Summary Checklist

| Component | ဘာကြောင့် သုံးရသလဲ (Why use it) | အဓိက အားသာချက် (Key Advantage) |
| :--- | :--- | :--- |
| **`public/index.php`** | အပြင်လူများ `.env` နှင့် Core Code ကို တိုက်ရိုက် မမြင်နိုင်စေရန် | Single Secure Entry Point ရရှိသည် |
| **Service Providers** | စနစ်၏ Feature တိုင်းကို စနစ်တကျ Boot တက်စေရန် | Modular Architecture ဖြစ်စေသည် |
| **Middleware Pipeline** | Controller မရောက်မီ Authentication နှင့် CSRF စစ်ရန် | Centralized Security Gate ရရှိသည် |
| **Service Container** | `new Class()` လိုက်ရေးရသည့် ဒုက္ခမှ ကင်းဝေးစေရန် | Loose Coupling & Easy Unit Testing |
