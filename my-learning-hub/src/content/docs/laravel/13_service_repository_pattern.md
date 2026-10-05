---
title: "13. Service Repository Pattern"
description: "1. [Fat Controller ပြဿနာနှင့် Clean Architecture လိုအပ်ပုံ (ဘာကြောင့် သုံးရသလဲ?)](#၁-fat-controller-ပြဿနာနှင့်-clean-architecture)"
---

## 🏗️ သင်ခန်းစာ (၁၃) - Enterprise Architecture (Service Layer & Repository Pattern)
### (Lesson 13: Clean Architecture, Skinny Controllers, Service Layer & DB Transactions)

---

## 📌 မာတိကာ (Contents)
1. [Fat Controller ပြဿနာနှင့် Clean Architecture လိုအပ်ပုံ (ဘာကြောင့် သုံးရသလဲ?)](#၁-fat-controller-ပြဿနာနှင့်-clean-architecture)
2. [Database Transactions ၏ အရေးကြီးပုံ (Atomicity & Rollback)](#၂-database-transactions-၏-အရေးကြီးပုံ)
3. [Service Layer Pattern လက်တွေ့ အကောင်အထည်ဖော်ခြင်း](#၃-service-layer-pattern-လက်တွေ့-အကောင်အထည်ဖော်ခြင်း)
4. [Skinny Controller ဖြင့် ချိတ်ဆက်အသုံးပြုပုံ](#၄-skinny-controller-ဖြင့်-ချိတ်ဆက်အသုံးပြုပုံ)
5. [Repository Pattern ဆိုတာဘာလဲ? မည်သည့်အခါတွင် သုံးသင့်သလဲ?](#၅-repository-pattern-ဆိုတာဘာလဲ)
6. [လုပ်ငန်းခွင် Best Practices အနှစ်ချုပ်](#၆-လုပ်ငန်းခွင်-best-practices-အနှစ်ချုပ်)

---

## ၁။ Fat Controller ပြဿနာနှင့် Clean Architecture

### (က) ဒါက ဘာလဲ? (What is it?)
Controller တစ်ခုတည်းထဲတွင် Validation, Database Save, External Payment API, Email ပို့ခြင်း၊ Stock ဖြတ်ခြင်း စသည့် အလုပ်အားလုံးကို ပုံအောရေးသားထားခြင်းကို **"Fat Controller"** ဟု ခေါ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use Service Layer in real work?)
Fat Controller ဖြစ်လာပါက ကုဒ်လိုင်း ၅၀၀ ကျော်ဖြစ်လာပြီး Bug ရှာရခက်ခြင်း၊ Web Form နှင့် Mobile API တွင် တူညီသော Logic ကို နှစ်ခါပြန်ရေးရခြင်း (Code Duplication) ဖြစ်စေသည်။ Service Layer သည် Business Logic ကို သီးခြားခွဲထုတ်ပေးသည်။

### (ဂ) အားသာချက်များ (Advantages):
* **Single Responsibility Principle (SRP)**: Controller သည် HTTP Flow ကိုသာ စီမံပြီး Service က Business Logic ကို တာဝန်ယူသည်။
* **Reusability**: Web Controller ရော API Controller ကပါ တူညီသော `OrderService` ကို ပြန်လည်အသုံးပြုနိုင်သည်။
* **Unit Testing**: Controller မလိုဘဲ Service Logic ကို သီးသန့် Unit Test စစ်ဆေးနိုင်သည်။

---

## ၂။ Database Transactions ၏ အရေးကြီးပုံ

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ? (Why use DB Transactions?)
E-Commerce သို့မဟုတ် ဘဏ်ငွေလွှဲစနစ်တွင် Operations (၃) ခု ပြိုင်တူ လုပ်ရသည်:
1. Customer ထံမှ ငွေဖြတ်မည်။
2. ပစ္စည်း Stock ၁ ခု လျှော့မည်။
3. Order Table တွင် Record သိမ်းမည်။

အကယ်၍ အဆင့် (၁) ပြီးပြီး အဆင့် (၂) တွင် Server Crash ဖြစ်သွားပါက ငွေဖြတ်ပြီး ပစ္စည်းမရသည့် ဆိုးရွားသော အမှား ဖြစ်သွားမည်။

### (ခ) အားသာချက် (Atomicity & Auto Rollback):
`DB::transaction()` ထဲ ထည့်ထားပါက အလုပ်အားလုံး အောင်မြင်မှသာ **Commit** လုပ်ပြီး အမှားတစ်ခုခု ကြုံပါက ယခင် လုပ်ခဲ့သမျှကို အလိုအလျောက် **Rollback** ပြန်ဆုတ်ပေးသည်။

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () use ($data) {
    // ဤအတွင်း အားလုံး အောင်မြင်မှသာ DB သိမ်းဆည်းမည်
    // Error ဖြစ်ပါက အစမှ auto ပြန်ဆုတ်သွားမည်
});
```

---

## ၃။ Service Layer Pattern လက်တွေ့ အကောင်အထည်ဖော်ခြင်း

`app/Services/OrderService.php` ဖိုင်ဆောက်ပါ:

```php
namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    public function createOrder(User $user, array $orderData): Order
    {
        return DB::transaction(function () use ($user, $orderData) {
            // ၁။ Order Master Record သိမ်းခြင်း
            $order = Order::create([
                'user_id'      => $user->id,
                'total_amount' => $orderData['total_amount'],
                'status'       => 'pending',
            ]);

            // ၂။ Order Items ထည့်သွင်းပြီး Stock လျှော့ချခြင်း
            foreach ($orderData['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw new Exception("ကုန်ပစ္စည်း '{$product->title}' သည် Stock မလုံလောက်ပါ။");
                }

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price,
                ]);

                // Stock အလိုအလျောက် လျှော့ချခြင်း
                $product->decrement('stock', $item['quantity']);
            }

            return $order;
        });
    }
}
```

---

## ၄။ Skinny Controller ဖြင့် ချိတ်ဆက်အသုံးပြုပုံ

```php
namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Exception;

class OrderController extends Controller
{
    // Dependency Injection ဖြင့် Service ကို Inject လုပ်ခြင်း
    public function __construct(protected OrderService $orderService) {}

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'status'   => 'success',
                'message'  => 'အော်ဒါ အောင်မြင်စွာ တင်ပြီးပါပြီ',
                'order_id' => $order->id,
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
```

---

## ၅။ Repository Pattern ဆိုတာဘာလဲ?

### (က) ဘာကြောင့် သုံးရသလဲ?
Database Query များကို Controller/Service မှ တိုက်ရိုက် မခေါ်စေဘဲ Interface တစ်ခု ခံထားပြီး Database Engine ပြောင်းလဲနိုင်ခြေရှိသော အလွန်ကြီးမားသည့် Enterprise စနစ်ကြီးများတွင် သုံးသည်။

*(Medium Projects များတွင် Eloquent Model ကို Service Layer မှ တိုက်ရိုက်ခေါ်သုံးခြင်းသည် ပိုမိုမြန်ဆန်ပြီး Over-engineering မဖြစ်စေပါ)*

---

## ၆။ လုပ်ငန်းခွင် Best Practices အနှစ်ချုပ်

1. **Keep Controllers Skinny**: Controller သည် HTTP Request ကို လက်ခံပြီး Response ပြန်ပေးရုံသာ လုပ်ဆောင်ပါ။
2. **Move Logic to Services**: တွက်ချက်မှုများနှင့် ပြင်ပ API ခေါ်ယူမှုများကို Service Classes များတွင် ထားရှိပါ။
3. **Always Use DB Transactions**: စားပွဲတစ်ခုထက်ပိုသော Database အပြောင်းအလဲများကို Transaction ထဲ ထည့်သွင်းပါ။
