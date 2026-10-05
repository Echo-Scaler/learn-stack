---
title: "12. Modern PHP 8 Features"
description: "PHP 8.0, 8.1, 8.2 နှင့် 8.3 တို့တွင် ဘာသာစကား၏ စွမ်းဆောင်ရည်နှင့် ကုဒ်ရေးသားဟန်ကို များစွာ အဆင့်မြှင့်တင်ပေးခဲ့ပါသည်။ ခေတ်မီ Framework များ (Symfony 6/7, Larave"
---

## ⚡ ခေတ်သစ် PHP 8+ တွင် မဖြစ်မနေ သိရမည့် အဆင့်မြင့် Structures များ
### (Modern PHP 8.x Advanced Structures & Features Explained)

PHP 8.0, 8.1, 8.2 နှင့် 8.3 တို့တွင် ဘာသာစကား၏ စွမ်းဆောင်ရည်နှင့် ကုဒ်ရေးသားဟန်ကို များစွာ အဆင့်မြှင့်တင်ပေးခဲ့ပါသည်။ ခေတ်မီ Framework များ (Symfony 6/7, Laravel 10/11, EC-CUBE 4.3+) တွင် အောက်ပါ Structures များကို အဓိက အသုံးပြုထားပါသည်။

---

## 📑 မာတိကာ (Key Features)
1. [Constructor Property Promotion (ကုဒ်လိုင်းတိုစေခြင်း)](#၁-constructor-property-promotion)
2. [Nullsafe Operator (`?->`) (Fatal Error ကင်းဝေးခြင်း)](#၂-nullsafe-operator--)
3. [Match Expression (Switch ထက် သာလွန်ခြင်း)](#၃-match-expression)
4. [Enums (ခိုင်မာသော တန်ဖိုးသတ်မှတ်ချက်များ)](#၄-enums-php-81)
5. [Readonly Properties & Readonly Classes](#၅-readonly-properties--classes-php-81--82)
6. [Attributes (`#[...]`) (Symfony/Doctrine စံနှုန်း)](#၆-attributes--)
7. [Named Arguments](#၇-named-arguments)
8. [Union & Intersection Types](#၈-union--intersection-types)

---

## ၁။ Constructor Property Promotion

### ❌ ရှေးယခင် PHP 7 ရေးနည်း:
Property ကြေညာခြင်း၊ Constructor ထဲ Parameter ထည့်ခြင်းနှင့် `$this->...` သတ်မှတ်ခြင်းတို့ကို (၃) ကြိမ် ထပ်တလဲလဲ ရေးရသည်:
```php
class User {
    public string $name;
    public string $email;
    public int $age;

    public function __construct(string $name, string $email, int $age) {
        $this->name = $name;
        $this->email = $email;
        $this->age = $age;
    }
}
```

### ✅ ခေတ်သစ် PHP 8+ ရေးနည်း:
Constructor parameter ထဲတွင် `public/private/protected` ကို တိုက်ရိုက် ထည့်ရေးလိုက်ရုံဖြင့် အထက်ပါ ၃ ဆင့်စလုံး အလိုအလျောက် ပြီးမြောက်သွားပါသည်:
```php
class User {
    public function __construct(
        public string $name,
        public string $email,
        public int $age
    ) {}
}
```

---

## ၂။ Nullsafe Operator (`?->`)

Object တစ်ခုသည် `null` ဖြစ်နေချိန်တွင် ၎င်း၏ method သို့မဟုတ် property ကို ခေါ်မိပါက PHP တွင် `Fatal Error: Call to a member function on null` တက်လေ့ရှိသည်။

### ❌ ရှေးယခင် PHP 7 စစ်ဆေးနည်း:
```php
$country = null;
if ($user !== null) {
    $profile = $user->getProfile();
    if ($profile !== null) {
        $address = $profile->getAddress();
        if ($address !== null) {
            $country = $address->country;
        }
    }
}
```

### ✅ ခေတ်သစ် PHP 8 Nullsafe Operator:
`?->` ကို သုံးလိုက်ပါက လမ်းခုလတ်တွင် `null` တွေ့သည်နှင့် Error မတက်ဘဲ အေးချမ်းစွာ `null` တန်ဖိုးသာ ပြန်ပေးပါသည်:
```php
$country = $user?->getProfile()?->getAddress()?->country;
```

---

## ၃။ Match Expression

`switch` ထက် ပိုမိုမြန်ဆန်သည်၊ `break` ရေးစရာမလိုပါ၊ Strict Comparison (`===`) စစ်ဆေးပြီး တိုက်ရိုက် တန်ဖိုး ပြန်ထုတ်ပေးနိုင်သည်:

```php
$httpStatusCode = 404;

$message = match ($httpStatusCode) {
    200, 201 => "လုပ်ဆောင်ချက် အောင်မြင်ပါသည်",
    400 => "တောင်းဆိုမှု ပုံစံ မှားယွင်းနေပါသည်",
    401, 403 => "ဝင်ရောက်ခွင့် မရှိပါ (Unauthorized)",
    404 => "ရှာမတွေ့ပါ (Not Found)",
    500 => "ဆာဗာအတွင်းပိုင်း အမှားဖြစ်ပေါ်နေပါသည်",
    default => "အမည်မသိ Status Code ဖြစ်ပါသည်",
};

echo $message;
```

---

## ၄။ Enums (PHP 8.1+)

ယခင်က Order Status (Pending, Paid, Shipped, Cancelled) စသည်တို့ကို String သို့မဟုတ် Number constants များဖြင့် ရေးသားခဲ့၍ စာလုံးပေါင်းမှားခြင်း Bug များ ဖြစ်တတ်သည်။

**Enum** သည် တရားဝင် ခွင့်ပြုထားသော တန်ဖိုးများကိုသာ လက်ခံစေသည့် အထူး Structure ဖြစ်ပါသည်:

```php
// Backed Enum နမူနာ
enum OrderStatus: string {
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    // Enum အတွင်း Method များလည်း ထည့်နိုင်ပါသည်
    public function label(): string {
        return match($this) {
            self::PENDING => "စောင့်ဆိုင်းဆဲ",
            self::PROCESSING => "ဆောင်ရွက်နေဆဲ",
            self::COMPLETED => "ပြီးမြောက်ပြီ",
            self::CANCELLED => "ပယ်ဖျက်လိုက်ပြီ",
        };
    }
}

// အသုံးပြုပုံ
function updateOrderStatus(int $orderId, OrderStatus $status): void {
    echo "Order #$orderId အား " . $status->label() . " သို့ ပြောင်းလဲပြီးပါပြီ။";
}

updateOrderStatus(101, OrderStatus::COMPLETED);
// updateOrderStatus(101, "invalid_status"); // Fatal Error! Type-safe ဖြစ်သဖြင့် မှားယွင်းမှု မဖြစ်နိုင်ပါ
```

---

## ၅။ Readonly Properties & Classes (PHP 8.1 / 8.2)

အချက်အလက်များကို Constructor တွင် တစ်ကြိမ်သာ သတ်မှတ်ခွင့်ပေးပြီး ပြင်ပမှ မည်သူမျှ ပြန်လည်မပြင်ဆင်နိုင်အောင် (Immutability) အကာအကွယ်ပေးသည့် စနစ်ဖြစ်သည်:

```php
// PHP 8.2 Readonly Class (DTO - Data Transfer Object အတွက် အထူးသင့်တော်သည်)
readonly class CustomerDto {
    public function __construct(
        public int $id,
        public string $name,
        public string $email
    ) {}
}

$customer = new CustomerDto(1, "ကိုကို", "koko@gmail.com");
echo $customer->name;

// $customer->name = "မောင်မောင်"; 
// Fatal Error: Cannot modify readonly property!
```

---

## ၆။ Attributes (`#[...]`) (PHP 8.0+)

Symfony, Doctrine ORM နှင့် EC-CUBE တွင် Routing များနှင့် Database Entity Mapping ပြုလုပ်ရာတွင် PHP 8 **Attributes** ကို စံနှုန်းအဖြစ် မဖြစ်မနေ အသုံးပြုပါသည်:

```php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

class ProductController {
    // PHP 8 Attribute သုံး၍ URL Route သတ်မှတ်ခြင်း
    #[Route('/admin/products', name: 'admin_product_list', methods: ['GET'])]
    public function index(): Response {
        // ...
    }

    #[Route('/admin/product/{id}', methods: ['POST'])]
    public function update(int $id): Response {
        // ...
    }
}
```

---

## ၇။ Named Arguments

Function ထဲသို့ တန်ဖိုးများ ပေးပို့ရာတွင် အစဉ်လိုက် မမှတ်မိတော့ပါက Parameter အမည်ကို တိုက်ရိုက် ရည်ညွှန်း၍ ပေးပို့နိုင်သည်:

```php
function createUser(string $name, string $role = 'user', bool $isActive = true, string $email = ''): void {
    // ...
}

// Named Arguments သုံးပုံ: အစဉ်လိုက် ရေးစရာမလိုဘဲ အမည်တပ် ထည့်သွင်းနိုင်သည်
createUser(
    name: "မအေးအေး",
    email: "ayeaye@gmail.com",
    isActive: true
);
```

---

## ၈။ Union & Intersection Types

Parameter သို့မဟုတ် Return Type တစ်ခုသည် Data Type တစ်မျိုးထက်မက ဖြစ်နိုင်သောအခါ သုံးသည်:

```php
// Union Type: int သို့မဟုတ် float လက်ခံမည်
function calculateArea(int|float $width, int|float $height): int|float {
    return $width * $height;
}

// Nullable Type အတိုကောက် (?string သည် string|null နှင့် တူသည်)
function findUser(int $id): ?User {
    return null;
}
```

---

## 🎯 အနှစ်ချုပ် (Summary)
ဤ Modern PHP 8+ Features များသည် ကုဒ်များကို **အဆမတန် သန့်ရှင်းစေခြင်း**၊ **Fatal Errors များကို ကြိုတင်ကာကွယ်ပေးခြင်း** နှင့် **လုပ်ငန်းခွင်သုံး Enterprise Framework များ (Symfony, EC-CUBE, Laravel) ကို အလွယ်တကူ နားလည်စေခြင်း** တို့ကို ရရှိစေပါသည်။
