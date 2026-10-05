---
title: "13. Design Patterns"
description: "လုပ်ငန်းခွင်ရှိ Enterprise Project ကြီးများ (ဥပမာ- Symfony, EC-CUBE, Laravel) ကို လေ့လာသည့်အခါ ရိုးရိုး PHP သာမကဘဲ ကမ္ဘာ့စံချိန်မီ Software Design Patterns များ"
---

## 🏗️ PHP လုပ်ငန်းခွင်သုံး Design Patterns & Enterprise Structures
### (Most Used Design Patterns in Production PHP: Symfony, Laravel, EC-CUBE)

လုပ်ငန်းခွင်ရှိ Enterprise Project ကြီးများ (ဥပမာ- Symfony, EC-CUBE, Laravel) ကို လေ့လာသည့်အခါ ရိုးရိုး PHP သာမကဘဲ ကမ္ဘာ့စံချိန်မီ **Software Design Patterns** များကို မဖြစ်မနေ အသုံးပြုထားသည်ကို တွေ့ရမည် ဖြစ်ပါသည်။

ဤဖိုင်တွင် အမှန်တကယ် နေ့စဉ် လုပ်ငန်းခွင်၌ အသုံးအများဆုံး Design Patterns များကို ရှင်းလင်းချက်၊ အသုံးပြုပုံ နမူနာများနှင့်တကွ စုစည်းဖော်ပြထားပါသည်။

---

## 📑 မာတိကာ (Design Patterns)
1. [Repository Pattern (ဒေတာဘေ့စ် စုံစမ်းမှုများကို သီးခြားခွဲထုတ်ခြင်း)](#၁-repository-pattern)
2. [Dependency Injection (DI) (မှီခိုမှုများကို ပြင်ပမှ ထည့်သွင်းပေးခြင်း)](#၂-dependency-injection-di--inversion-of-control)
3. [Data Transfer Object (DTO) (ဒေတာလွှဲပြောင်းမှု ပုံစံခွက်)](#၃-data-transfer-object-dto)
4. [Factory Pattern (Object အသစ်များကို စည်းကမ်းချက်ဖြင့် ဖန်တီးပေးခြင်း)](#၄-factory-pattern)
5. [Singleton Pattern (စနစ်တစ်ခုလုံးတွင် Object တစ်ခုတည်းသာ ရှိစေခြင်း)](#၅-singleton-pattern)
6. [Observer / Event-Driven Pattern (Events & Listeners)](#၆-observer--event-driven-pattern-symfony--ec-cube-စံနှုန်း)

---

## ၁။ Repository Pattern

### ❓ ဘာလဲ? (What is it?)
Database Query များကို Controller သို့မဟုတ် Service ထဲတွင် တိုက်ရိုက်မရေးဘဲ သီးခြား **Repository Class** အဖြစ် ခွဲထုတ်ရေးသားသော Pattern ဖြစ်သည်။ (ဥပမာ- EC-CUBE တွင် `ProductRepository`, `FavouriteProductRepository` စသည်တို့ ဖြစ်သည်)။

### 💡 ဘာကြောင့် သုံးသလဲ? (Why use it?)
- Controller ထဲတွင် SQL သို့မဟုတ် Query Builder ကုဒ်များ ရောပြွန်းမနေတော့ပါ။
- Database စနစ် ပြောင်းလဲသည့်အခါ (ဥပမာ- MySQL မှ PostgreSQL သို့မဟုတ် Cache ထည့်သွင်းသည့်အခါ) Repository ဖိုင်တစ်ခုတည်းကိုသာ ပြင်ဆင်ရုံဖြင့် စနစ်တစ်ခုလုံး အလုပ်ဆက်လုပ်နိုင်သည်။

### 💻 နမူနာ ကုဒ် (Repository Pattern):
```php
namespace App\Repository;

use PDO;

class ProductRepository {
    public function __construct(private PDO $db) {}

    // ID ဖြင့် ပစ္စည်း ရှာဖွေခြင်း
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        
        return $result ?: null;
    }

    // စိတ်ကြိုက် အကြိုက်ဆုံး ပစ္စည်းများ ရှာဖွေခြင်း (e.g. Favorite Products)
    public function findFavoritesByUser(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT p.* FROM products p 
            JOIN favorite_products fp ON p.id = fp.product_id 
            WHERE fp.user_id = :user_id
        ");
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }
}
```

---

## ၂။ Dependency Injection (DI) & Inversion of Control

### ❓ ဘာလဲ? (What is it?)
Class တစ်ခုသည် မိမိလိုအပ်သော အခြား Object (Dependency) ကို မိမိဘာသာ `new Class()` ဟု အတွင်းထဲတွင် တိုက်ရိုက် မဆောက်ဘဲ **Constructor မှတစ်ဆင့် ပြင်ပမှ ထည့်သွင်းပေးခြင်း (Inject လုပ်ခြင်း)** ဖြစ်သည်။

### ❌ မကောင်းသော ရေးဟန် (Tightly Coupled):
```php
class OrderController {
    private ProductRepository $productRepo;

    public function __construct() {
        // Class အတွင်း တိုက်ရိုက် new ဆောက်ခြင်း (ပြောင်းလဲရ ခက်ခဲသည်၊ Test လုပ်မရပါ)
        $this->productRepo = new ProductRepository(new PDO(...));
    }
}
```

### ✅ စံပြ Dependency Injection ရေးဟန် (Loosely Coupled):
```php
class OrderController {
    // Service Container က ProductRepository ကို အလိုအလျောက် inject လုပ်ပေးမည်
    public function __construct(
        private ProductRepository $productRepo,
        private MailService $mailer
    ) {}

    public function show(int $id): void {
        $product = $this->productRepo->findById($id);
        // ...
    }
}
```

---

## ၃။ Data Transfer Object (DTO)

### ❓ ဘာလဲ? (What is it?)
Array များ သုံးပါက Key များ စာလုံးပေါင်းမှားခြင်း၊ Type မသေချာခြင်းတို့ ဖြစ်တတ်သည်။ ထို့ကြောင့် Data များကို လွှဲပြောင်းရာတွင် **Type-safe ဖြစ်သော Readonly Class** ဖြင့် ထုပ်ပိုးပေးပို့သည့် Pattern ဖြစ်သည်။

### 💻 နမူနာ ကုဒ် (DTO):
```php
namespace App\Dto;

readonly class CreateProductDto {
    public function __construct(
        public string $name,
        public float $price,
        public int $stock,
        public ?string $description = null
    ) {}

    // Array မှ DTO သို့ ပြောင်းလဲပေးသည့် Factory Method
    public static function fromRequest(array $data): self {
        return new self(
            name: (string)($data['name'] ?? ''),
            price: (float)($data['price'] ?? 0.0),
            stock: (int)($data['stock'] ?? 0),
            description: $data['description'] ?? null
        );
    }
}
```

---

## ၄။ Factory Pattern

### ❓ ဘာလဲ? (What is it?)
Object တစ်ခုကို တိုက်ရိုက် `new` ဆောက်ရမည့်အစား အခြေအနေ (Condition) ပေါ်မူတည်၍ သင့်တော်သော Object ကို မွေးထုတ်ပေးသည့် စက်ရုံ (Factory) သဖွယ် လုပ်ဆောင်ပေးသော Pattern ဖြစ်သည်။

### 💻 နမူနာ (Payment Gateway Factory):
```php
interface PaymentGatewayInterface {
    public function pay(float $amount): bool;
}

class KBZPayGateway implements PaymentGatewayInterface {
    public function pay(float $amount): bool { return true; }
}

class WavePayGateway implements PaymentGatewayInterface {
    public function pay(float $amount): bool { return true; }
}

// Factory Class
class PaymentFactory {
    public static function create(string $type): PaymentGatewayInterface {
        return match (strtolower($type)) {
            'kbzpay' => new KBZPayGateway(),
            'wavepay' => new WavePayGateway(),
            default => throw new \InvalidArgumentException("မထောက်ပံ့သော ငွေပေးချေမှုစနစ်: $type"),
        };
    }
}

// အသုံးပြုပုံ
$gateway = PaymentFactory::create($_POST['payment_method']);
$gateway->pay(15000);
```

---

## ၅။ Singleton Pattern

### ❓ ဘာလဲ? (What is it?)
စနစ်တစ်ခုလုံး၏ သက်တမ်းတစ်လျှောက်တွင် အဆိုပါ Class ၏ **Instance (Object) သည် တစ်ခုတည်းသာ တည်ရှိခွင့်ရအောင်** ကန့်သတ်ထားသော Pattern ဖြစ်သည်။ (ဥပမာ- Database Connection, App Config)

### 💻 နမူနာ ကုဒ် (Singleton Database):
```php
class DatabaseConnection {
    private static ?self $instance = null;
    private PDO $pdo;

    // Constructor ကို private ထားသဖြင့် ပြင်ပမှ new ဆောက်ခွင့် မရှိပါ
    private function __construct() {
        $this->pdo = new PDO("mysql:host=localhost;dbname=test", "root", "");
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->pdo;
    }
}

// မည်သည့်နေရာမှမဆို ခေါ်ယူပါက Database Connection အသစ်ထပ်မဖွင့်ဘဲ မူလ Connection ကိုသာ ပြန်သုံးမည်
$db = DatabaseConnection::getInstance()->getConnection();
```

---

## ၆။ Observer / Event-Driven Pattern (Symfony & EC-CUBE စံနှုန်း)

### ❓ ဘာလဲ? (What is it?)
လုပ်ဆောင်ချက်တစ်ခု ပြီးဆုံးသွားသည့်အခါ (ဥပမာ- Customer က အော်ဒါတင်လိုက်သည်) မူရင်းကုဒ်ထဲတွင် အလုပ်အားလုံး လိုက်မရေးဘဲ **"Event (အဖြစ်အပျက်)"** တစ်ခု ထုတ်လွှင့် (Dispatch) ပေးလိုက်သည်။ ထိုအခါ အသင့်စောင့်ကြည့်နေသော **Listeners / Subscribers** များက သက်ဆိုင်ရာ အလုပ်များကို အလိုအလျောက် ဝင်ရောက်လုပ်ဆောင်ပေးသည်။

```
        [Order Placed Event]
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
[Send Email Listener]   [Reduce Stock Listener]
```

### 💡 အကျိုးကျေးဇူး:
EC-CUBE တွင် Plugin များ၊ Custom Module များ ထပ်ထည့်သည့်အခါ Core Code များကို သွားမထိရဘဲ Event Hook များကိုသာ တွဲဖက်ရေးသားရသဖြင့် စနစ်ကို အလွန် လွယ်ကူစွာ ချဲ့ထွင်နိုင်ပါသည် (Extensibility)။

---

## 🎯 အနှစ်ချုပ် (Summary)
- **Repository**: Database ဆက်သွယ်မှုများကို သီးသန့်ထားပါ။
- **Dependency Injection**: Class များကို လွတ်လပ်စွာ ချိတ်ဆက်နိုင်ရန် Constructor မှ Inject လုပ်ပါ။
- **DTO**: Data များကို Type-safe ဖြစ်အောင် သယ်ယူပို့ဆောင်ပါ။
- **Event-Driven**: စနစ်ကြီးများကို ချဲ့ထွင်လွယ်စေရန် Plugin Architecture တည်ဆောက်ပါ။
