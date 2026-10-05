---
title: "10. MVC Architecture"
description: "MVC (Model - View - Controller) ဆိုသည်မှာ ဆော့ဖ်ဝဲလ် အက်ပလီကေးရှင်း တစ်ခုလုံး၏ ကုဒ်များကို သက်ဆိုင်ရာ တာဝန်အလိုက် အဓိက အပိုင်း (၃) ပိုင်း ခွဲခြားစီမံသော စနစ်ဗိသ"
---

## 🏛️ MVC Architecture ဆိုတာဘာလဲ၊ လုပ်ငန်းခွင် လက်တွေ့လုပ်ငန်းစဉ်များတွင် မည်သို့ အသုံးချသလဲ?
### (MVC Architecture in Real-World Production & Enterprise Workflow)

---

## ❓ ၁။ MVC Architecture ဆိုတာဘာလဲ? (What is MVC?)

**MVC (Model - View - Controller)** ဆိုသည်မှာ ဆော့ဖ်ဝဲလ် အက်ပလီကေးရှင်း တစ်ခုလုံး၏ ကုဒ်များကို သက်ဆိုင်ရာ တာဝန်အလိုက် အဓိက အပိုင်း (၃) ပိုင်း ခွဲခြားစီမံသော **စနစ်ဗိသုကာ ဒီဇိုင်းပုံစံ (Architectural Design Pattern)** ဖြစ်ပါသည်။

Laravel, Symfony, Django, Spring Boot, Ruby on Rails စသည့် ကမ္ဘာကျော် Framework တိုင်းသည် ဤ MVC စနစ်ပေါ်တွင်သာ အခြေခံ တည်ဆောက်ထားပါသည်။

---

## 🧩 ၂။ MVC ၏ အခြေခံ အစိတ်အပိုင်း (၃) ခု

```
       [အသုံးပြုသူ / Browser]
                 │  (1) Request ပေးပို့သည်
                 ▼
       ┌───────────────────┐
       │   CONTROLLER      │  ◄── ဦးနှောက် (Traffic Controller)
       └─────┬───────▲─────┘
 (2) Data    │       │ (3) Data ပြန်ပို့သည်
 တောင်းသည်   ▼       │
       ┌──────────┐  │
       │  MODEL   │──┘        ◄── ဒေတာဘေ့စ်နှင့် စည်းမျဉ်းများ (Data & Business Logic)
       └──────────┘
             │
      (4) Data ထည့်သွင်းပေးသည်
             ▼
       ┌──────────┐
       │   VIEW   │           ◄── အသုံးပြုသူမြင်ရမည့် မျက်နှာပြင် (UI / HTML)
       └──────────┘
             │  (5) Rendered HTML ပြန်ပို့သည်
             ▼
       [Browser Screen]
```

### ၁။ Model (မော်ဒယ် - ဒေတာနှင့် စည်းကမ်းချက်များ)
- **တာဝန်**: Database နှင့် တိုက်ရိုက် ဆက်သွယ်ပြီး Data များ သိမ်းဆည်းခြင်း၊ ဖတ်ယူခြင်းနှင့် စည်းကမ်းချက်များ (Business Rules) ကို တာဝန်ယူသည်။
- *HTML ကုဒ်များ လုံးဝ မပါဝင်ရပါ။*

### ၂။ View (ဗျူး - အသုံးပြုသူ မြင်ကွင်း)
- **တာဝန်**: User ၏ မျက်စိဖြင့် မြင်တွေ့ရမည့် HTML, CSS, JavaScript နှင့် ပုံရိပ်များကိုသာ တာဝန်ယူသည်။
- *Database query ရေးသားခြင်း လုံးဝ မပြုလုပ်ရပါ။ Controller ထံမှ လာသော Data ကို ဖော်ပြပေးရုံသာ ဖြစ်သည်။*

### ၃။ Controller (ကွန်ထရိုလာ - စီမံခန့်ခွဲသူ / ဦးနှောက်)
- **တာဝန်**: User ထံမှ လာသော Request (ဥပမာ- ခလုတ်နှိပ်လိုက်ခြင်း) ကို လက်ခံသည်။ သင့်တော်သော Model ထံမှ Data ကို တောင်းယူသည်။ ရရှိလာသော Data ကို သက်ဆိုင်ရာ View သို့ ပေးပို့ကာ စာမျက်နှာ ထုတ်ပြရန် ညွှန်ကြားပေးသည်။

---

## 🏢 ၃။ လုပ်ငန်းခွင် လက်တွေ့စနစ် (Real-World Enterprise MVC Process Flow)

စာအုပ်သီအိုရီတွင် MVC ကို (၃) ပိုင်းသာ ဖော်ပြလေ့ရှိသော်လည်း **လက်တွေ့ လုပ်ငန်းခွင် (Production Environment)** တွင် အောက်ပါ အစိတ်အပိုင်းများ ပေါင်းစပ်ပြီးမှသာ ခိုင်မာသော Enterprise System တစ်ခု ဖြစ်လာပါသည်:

```
[User Browser]
      │ (1) HTTP Request (e.g. POST /checkout)
      ▼
┌────────────────────────────────────────────────────────┐
│ 1. Web Server Rewrite (Nginx / Apache .htaccess)       │
└──────────────────────────┬─────────────────────────────┘
                           │ (2) All traffic goes to single entry point
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Public Front Controller (public/index.php)          │
│    • Composer Autoloading (PSR-4)                      │
│    • Load Environment Variables (.env)                 │
│    • Error & Exception Handler Registration            │
└──────────────────────────┬─────────────────────────────┘
                           │ (3) Hand over to Router
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Router & Middleware Pipeline                        │
│    • AuthMiddleware (Login စစ်ဆေးခြင်း)               │
│    • CsrfMiddleware (လုံခြုံရေး Token စစ်ခြင်း)        │
│    • RateLimitMiddleware (DDoS တားဆီးခြင်း)           │
└──────────────────────────┬─────────────────────────────┘
                           │ (4) Dispatch to matching Controller
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Controller (Skinny Controller)                      │
│    • Validate Request Input                            │
│    • Call Service Layer                                │
└──────────────────────────┬─────────────────────────────┘
                           │ (5) Execute Business Logic
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. Service Layer (Business Logic)                      │
│    • Payment Gateway API ခေါ်ခြင်း (KBZPay/Stripe)      │
│    • Send Invoice Email to Customer                    │
│    • Call Repository for DB Save                       │
└──────────────────────────┬─────────────────────────────┘
                           │ (6) Query Database safely
                           ▼
┌────────────────────────────────────────────────────────┐
│ 6. Repository & Model (Data Layer)                     │
│    • PDO Prepared Statements / Query Builder           │
│    • Database Transactions (Commit/Rollback)           │
└──────────────────────────┬─────────────────────────────┘
                           │ (7) Return Data back
                           ▼
┌────────────────────────────────────────────────────────┐
│ 7. Response (View or JSON API)                         │
│    • Web Application -> Render Blade/HTML View         │
│    • Mobile/SPA -> Return JSON (200 OK / 201 Created)  │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ ၄။ လုပ်ငန်းခွင်တွင် မဖြစ်မနေ အသုံးပြုသော အဓိက အစိတ်အပိုင်းများ (Real Work Essentials)

---

### ၁။ Front Controller Pattern & URL Routing
- **ဘာကြောင့်သုံးသလဲ**: သာမန် PHP တွင် `about.php`၊ `contact.php` စသည့် ဖိုင်တစ်ခုချင်းစီ တိုက်ရိုက်ခေါ်ခြင်းသည် လုံခြုံရေး အားနည်းပြီး ထိန်းချုပ်ရ ခက်ခဲသည်။
- **လုပ်ငန်းခွင်သုံး ပုံစံ**: Web Server က Request အားလုံးကို `public/index.php` သို့သာ ပို့ပေးသည် (Single Entry Point)။ ထို့နောက် **Router** က URL လမ်းကြောင်းကို စစ်ဆေးပြီး သက်ဆိုင်ရာ Controller သို့ ခွဲဝေပေးသည်။

#### Apache `.htaccess` (URL Rewrite)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### ရိုးရှင်းသော Router ရေးသားပုံ (`core/Router.php`)
```php
<?php
namespace Core;

class Router {
    private array $routes = [];

    public function get(string $path, array $handler): void {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, array $handler): void {
        $this->routes['POST'][$path] = $handler;
    }

    public function dispatch(string $uri, string $method): void {
        $path = parse_url($uri, PHP_URL_PATH);

        if (isset($this->routes[$method][$path])) {
            [$controllerClass, $action] = $this->routes[$method][$path];
            $controller = new $controllerClass();
            $controller->$action();
        } else {
            http_response_code(404);
            echo "<h1>404 - စာမျက်နှာ ရှာမတွေ့ပါ!</h1>";
        }
    }
}
```

---

### ၂။ Middleware (HTTP Request စစ်ဆေးရေးဂိတ်များ)
- **ဘာကြောင့်သုံးသလဲ**: Controller ထဲသို့ မရောက်မီ အသုံးပြုသူသည် Login ဝင်ထားသလား၊ Admin ဟုတ်မဟုတ်၊ CSRF Token မှန်မမှန်ကို ကြိုတင်စစ်ဆေးပေးသည့် **စစ်ဆေးရေးဂိတ် (Gatekeeper)** ဖြစ်သည်။

```php
<?php
namespace App\Middlewares;

class AuthMiddleware {
    public static function handle(): void {
        if (!isset($_SESSION['user_id'])) {
            // Login မဝင်ထားပါက Login စာမျက်နှာသို့ ချက်ချင်း ပြန်ပို့မည်
            header("Location: /login");
            exit;
        }
    }
}
```

---

### ၃။ Service Layer & Repository Pattern (Fat Controller ပြဿနာ ဖြေရှင်းနည်း)

> ⚠️ **စတင်လေ့လာသူများ အမှားများဆုံးအချက်**: Controller ထဲတွင် Database Query ရေးခြင်း၊ Email ပို့ခြင်း၊ Payment ဖြတ်ခြင်း အားလုံးကို ပြွတ်သိပ်ရေးခြင်း (Fat Controller)။

လုပ်ငန်းခွင်တွင် **Skinny Controller, Fat Service** စည်းမျဉ်းကို သုံးပါသည်:
- **Controller**: Request ကို လက်ခံပြီး Service ထံ လွှဲပြောင်းပေးရုံသာ လုပ်သည်။
- **Service**: စီးပွားရေးလုပ်ငန်းစဉ်များ (Payment, Email, Logic) ကို အဓိက တာဝန်ယူသည်။
- **Repository**: Database နှင့် Query ပိုင်းကိုသာ သီးသန့်တာဝန်ယူသည်။

#### လက်တွေ့ နမူနာ (Order Processing Flow):

**၁။ Controller (`app/Controllers/OrderController.php`)**:
```php
<?php
namespace App\Controllers;

use App\Services\OrderService;

class OrderController {
    private OrderService $orderService;

    public function __construct() {
        $this->orderService = new OrderService();
    }

    public function checkout(): void {
        $userId = $_SESSION['user_id'];
        $cartItems = $_SESSION['cart'] ?? [];

        // Controller သည် Service ထံသို့သာ လွှဲပြောင်းခိုင်းစေသည်
        $success = $this->orderService->processCheckout($userId, $cartItems);

        if ($success) {
            header("Location: /order-success");
        } else {
            echo "ငွေပေးချေမှု မအောင်မြင်ပါ၊ ပြန်လည်ကြိုးစားပါ။";
        }
    }
}
```

**၂။ Service Layer (`app/Services/OrderService.php`)**:
```php
<?php
namespace App\Services;

use App\Repositories\OrderRepository;

class OrderService {
    private OrderRepository $orderRepo;

    public function __construct() {
        $this->orderRepo = new OrderRepository();
    }

    public function processCheckout(int $userId, array $items): bool {
        if (empty($items)) return false;

        // 1. စုစုပေါင်း ကျသင့်ငွေ တွက်ချက်ခြင်း
        $totalAmount = array_sum(array_column($items, 'price'));

        // 2. Database Transaction စတင်ပြီး Order သိမ်းဆည်းခြင်း
        $orderId = $this->orderRepo->createOrder($userId, $totalAmount, $items);

        // 3. Customer ထံ အတည်ပြု Email ပေးပို့ခြင်း
        $this->sendInvoiceEmail($userId, $orderId);

        // 4. Cart ရှင်းလင်းခြင်း
        unset($_SESSION['cart']);

        return true;
    }

    private function sendInvoiceEmail(int $userId, int $orderId): void {
        // Mailgun / SMTP API ဖြင့် Email ပို့ဆောင်သည့် Logic
    }
}
```

---

### ၄။ Environment Configuration & Secrets Management (`.env` ဖိုင်)
- **ဘာကြောင့်သုံးသလဲ**: Database Password များ၊ Stripe/KBZPay API Keys များကို PHP Code ထဲတွင် Hardcode ရေးသားပါက Git ပေါ်တင်မိသည့်အခါ **စနစ်တစ်ခုလုံး ဖောက်ထွင်းခံရမည်** ဖြစ်သည်။
- **လုပ်ငန်းခွင်သုံး စနစ်**: အရေးကြီးသော Key များကို `.env` ထဲတွင် သိမ်းပြီး `.gitignore` ထဲ ထည့်သွင်းထားရမည်။

`.env` ဖိုင် နမူနာ:
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://myshop.com

DB_HOST=127.0.0.1
DB_NAME=production_shop_db
DB_USER=db_admin
DB_PASS=SuperSecretPassword@2026

STRIPE_SECRET_KEY=sk_live_51Mz...
```

PHP ထဲတွင် ခေါ်ယူအသုံးပြုပုံ:
```php
$dbHost = $_ENV['DB_HOST'];
$dbPass = $_ENV['DB_PASS'];
```

---

### ၅။ Database Migrations & Version Control
- **ဘာကြောင့်သုံးသလဲ**: Developer ၅ ဦး ပါဝင်သော အဖွဲ့တွင် Database ပြင်ဆင်မှုတိုင်းကို `.sql` ဖိုင် export ထုတ်၍ အချင်းချင်း ပေးပို့နေပါက ဒေတာများ လွဲမှားကုန်မည်။
- **လုပ်ငန်းခွင်သုံး စနစ်**: Database Table များ ဖန်တီး/ပြင်ဆင်ခြင်းကို Code ဖြင့် ရေးသားသော **Migration System** ကို သုံးသည်။

```bash
# Terminal မှတစ်ဆင့် Database Table များကို အလိုအလျောက် တည်ဆောက်ခြင်း
php artisan migrate # (or Phinx migration run)
```

---

### ၆။ Error Logging & Monitoring (Monolog / Sentry)
- **ဘာကြောင့်သုံးသလဲ**: Production Website တွင် Error တက်ပါက သုံးစွဲသူအား `Fatal Error: Uncaught PDOException in file.php on line 42` ဟု ဘယ်တော့မှ မပြရပါ (Hacker များအတွက် အချက်အလက်ပေးသလို ဖြစ်မည်)။
- **လုပ်ငန်းခွင်သုံး စနစ်**: User အား "တစ်ခုခု မှားယွင်းနေပါသည် (500 Error)" ဟုသာ ပြသပြီး Error အစစ်အမှန်၏ Stack trace ကို `storage/logs/app.log` ထဲသို့ လျှို့ဝှက်စွာ Log မှတ်သားထားရမည်။

```php
// Monolog Library သုံး၍ Error မှတ်တမ်းတင်ပုံ နမူနာ
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('shop');
$log->pushHandler(new StreamHandler(__DIR__ . '/../storage/logs/app.log', Logger::WARNING));

try {
    // Database Query
} catch (\Exception $e) {
    // Error ကို ဖိုင်ထဲသို့ လျှို့ဝှက်စွာ မှတ်သားခြင်း
    $log->error("Order Error: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
    echo "ဆာဗာတွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်၊ ခဏအကြာမှ ပြန်ကြိုးစားပါ။";
}
```

---

## 📁 ၅။ လုပ်ငန်းခွင်သုံး Enterprise MVC စနစ်၏ ပြည့်စုံသော Folder Structure

```
my-enterprise-app/
├── app/
│   ├── Controllers/         # Request လက်ခံပြီး Response ပြန်ပေးသည့် အပိုင်း
│   │   ├── AuthController.php
│   │   ├── HomeController.php
│   │   └── OrderController.php
│   ├── Middlewares/         # Auth, CSRF စစ်ဆေးရေးဂိတ်များ
│   │   ├── AuthMiddleware.php
│   │   └── AdminMiddleware.php
│   ├── Models/              # Database Table Entity ပုံစံခွက်များ
│   │   ├── User.php
│   │   └── Order.php
│   ├── Repositories/        # Database Query သီးသန့် ရေးသားသော နေရာ
│   │   └── OrderRepository.php
│   ├── Services/            # စီးပွားရေးလုပ်ငန်းစဉ် Business Logic များ
│   │   └── OrderService.php
│   └── Views/               # HTML UI Templates
│       ├── layouts/
│       │   └── main.php
│       ├── orders/
│       │   └── index.php
│       └── auth/
│           └── login.php
├── config/                  # စနစ်တစ်ခုလုံး၏ Configuration များ
│   ├── database.php
│   └── app.php
├── core/                    # MVC Framework Engine အဓိက ကုဒ်များ
│   ├── Router.php
│   ├── Controller.php
│   └── Database.php
├── database/                # Database Migrations & Seeds
│   └── migrations/
├── public/                  # Web Server Document Root (Public လက်လှမ်းမီသော နေရာ)
│   ├── index.php            # Front Controller (Single Entry Point)
│   ├── .htaccess            # Apache Rewrite rules
│   └── assets/              # CSS, JS, Images
├── storage/                 # Logs နှင့် Uploaded Files များ
│   ├── logs/
│   │   └── app.log
│   └── uploads/
├── vendor/                  # Composer Dependencies
├── .env                     # လျှို့ဝှက် Passwords & API Keys
├── .env.example             # အဖွဲ့သားများ ကြည့်ရန် Template
├── .gitignore               # Git ပေါ် မတင်ရမည့် ဖိုင်များ (.env, vendor/)
└── composer.json            # PSR-4 Autoloading Configuration
```

---

## 🎯 ၆။ အနှစ်ချုပ် (Key Takeaways for Real Work)

1. **Front Controller**: ဖိုင်တိုင်းကို တိုက်ရိုက်မခေါ်ပါနှင့်။ `public/index.php` မှတစ်ဆင့် **Router** ဖြင့်သာ Request အားလုံးကို စီမံပါ။
2. **Skinny Controller**: Controller ထဲတွင် SQL query များ၊ API ခေါ်ဆိုမှုများ ပြွတ်သိပ်မရေးပါနှင့်။ **Service Layer & Repository** သို့ တာဝန်ခွဲဝေပေးပါ။
3. **Security First**: Input တိုင်းကို Validate လုပ်ပါ၊ Database တိုင်းတွင် **PDO Prepared Statements** သုံးပါ၊ Form တိုင်းတွင် **CSRF Token** စစ်ဆေးပါ။
4. **Environment Variables**: စကားဝှက်များကို PHP ဖိုင်ထဲ မရေးပါနှင့်၊ **`.env`** ဖိုင်ထဲတွင်သာ သိမ်းဆည်းပါ။
5. **Logging**: Production ပေါ်တွင် Error message အစစ်များကို ဖုံးကွယ်ထားပြီး **Log ဖိုင်ထဲသို့သာ** စနစ်တကျ မှတ်သားပါ။
