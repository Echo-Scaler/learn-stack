---
title: "04. OOP and Objects"
description: "OOP (Object-Oriented Programming) ဆိုသည်မှာ ဆော့ဖ်ဝဲလ်ကုဒ်များကို လက်တွေ့ပြင်ပလောကရှိ အရာဝတ္ထုများ (Real-world Objects) ၏ သဘောသဘာဝအတိုင်း ပုံတူကူးယူ၍ စနစ်တကျ ဖွ"
---

## 🏗️ OOP နှင့် Object ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is OOP, What is an Object and Why do we use it?)

---

## ❓ ၁။ OOP ဆိုတာဘာလဲ? (What is Object-Oriented Programming?)

**OOP (Object-Oriented Programming)** ဆိုသည်မှာ ဆော့ဖ်ဝဲလ်ကုဒ်များကို လက်တွေ့ပြင်ပလောကရှိ အရာဝတ္ထုများ (Real-world Objects) ၏ သဘောသဘာဝအတိုင်း ပုံတူကူးယူ၍ စနစ်တကျ ဖွဲ့စည်းရေးသားသော **ပရိုဂရမ်မင်း ပုံစံခွက် (Programming Paradigm)** တစ်ခု ဖြစ်ပါသည်။

### 🔹 Procedural Code vs OOP Code ကွာခြားချက်:
- **Procedural (ရိုးရိုးလမ်းစဉ်)**: ကုဒ်များကို အပေါ်မှ အောက်သို့ တန်းစီပြီး ရေးခြင်းဖြစ်သောကြောင့် ပရောဂျက်ကြီးလာပါက Functions များနှင့် Variables များ ရောထွေးရှုပ်ပွပြီး ရှာရပြင်ရ အလွန်ခက်ခဲသွားသည်။ (Spaghetti Code ဟု ခေါ်သည်)။
- **OOP (အရာဝတ္ထုအခြေပြု)**: ဆက်စပ်နေသော ဒေတာ (Properties) များနှင့် အလုပ်လုပ်ဆောင်ချက် (Methods) များကို သီးခြား "အရာဝတ္ထု (Object)" အဖြစ် စုစည်းထားသောကြောင့် ကုဒ်များ သန့်ရှင်းပြီး ထိန်းသိမ်းရ အလွန်လွယ်ကူသည်။

---

## 🏛️ ၂။ Class နှင့် Object ဆိုတာဘာလဲ? (The Core Concepts)

စတင်လေ့လာသူများ အများဆုံး ရောထွေးလေ့ရှိသော အဓိက အယူအဆ (၂) ခု ဖြစ်ပါသည်:

### ၁။ Class (ပုံစံခွက် / Blueprint)
- Class ဆိုသည်မှာ တိုက်ရိုက် မသုံးစွဲနိုင်သေးဘဲ အရာဝတ္ထုတစ်ခုတွင် **"ဘာတွေပါဝင်ရမည်၊ ဘာတွေလုပ်ဆောင်နိုင်ရမည်"** ဟု ကြိုတင် ရေးဆွဲထားသော **ဗိသုကာ ပုံစံခွက် (Blueprint)** ဖြစ်သည်။
- *ဥပမာ*: အိမ်ဆောက်မည့် အင်ဂျင်နီယာ ရေးဆွဲထားသော "အိမ်ဒီဇိုင်း Blueprint စာရွက်" နှင့် တူပါသည်။ စာရွက်ပေါ်တွင်သာ ရှိသေး၍ ဝင်နေ၍ မရသေးပါ။

### ၂။ Object (လက်တွေ့ အရာဝတ္ထု / Instance)
- Object ဆိုသည်မှာ အဆိုပါ Class ပုံစံခွက်ကို အသုံးပြု၍ Memory ပေါ်တွင် အမှန်တကယ် ဖန်တီးတည်ဆောက်လိုက်သော **"လက်တွေ့ အရာဝတ္ထု"** ဖြစ်သည်။
- *ဥပမာ*: Blueprint စာရွက်အတိုင်း လက်တွေ့ ဆောက်လုပ်လိုက်သော "တကယ့် အိမ်" ဖြစ်ပါသည်။ Blueprint တစ်ခုတည်းမှ အိမ်အလုံး ၁၀၀ ကို မတူညီသော အရောင်များဖြင့် ဆောက်လုပ်နိုင်သကဲ့သို့ Class တစ်ခုမှ Object ပေါင်းများစွာကို မွေးထုတ်နိုင်ပါသည်။

```
     ┌────────────────────────┐
     │      Class: Car        │  ◄── (ပုံစံခွက်: တံဆိပ်၊ အရောင်၊ မောင်းနှင်ခြင်း Method)
     └───────────┬────────────┘
                 │  new Car() ဖြင့် မွေးထုတ်ခြင်း
         ┌───────┴───────┐
         ▼               ▼
┌─────────────────┐ ┌─────────────────┐
│ Object 1: BMW   │ │ Object 2: Toyota│  ◄── (လက်တွေ့ မောင်းနှင်နိုင်သော Objects များ)
│ Color: Black    │ │ Color: Red      │
└─────────────────┘ └─────────────────┘
```

---

## 💡 ၃။ OOP ကို ဘာကြောင့် အသုံးပြုရသလဲ? (Why do we use OOP?)

ခေတ်သစ် Web Development နှင့် Framework များ (ဥပမာ- Laravel, Symfony, WordPress) သည် ၁၀၀% OOP ပေါ်တွင်သာ အခြေခံထားပါသည်။ အဘယ်ကြောင့်ဆိုသော်:

1. **Reusability (ကုဒ်များကို ပြန်လည်အသုံးချနိုင်ခြင်း)**: ရေးပြီးသား Class များကို အခြားနေရာများတွင် ထပ်မံရေးစရာမလိုဘဲ အလွယ်တကူ ခေါ်သုံးနိုင်သည်။
2. **Encapsulation (လုံခြုံစိတ်ချရမှု)**: အရေးကြီးသော ဒေတာများကို ပြင်ပမှ တိုက်ရိုက် ဝင်ရောက်ဖျက်ဆီး/ပြင်ဆင်၍ မရအောင် `private` သတ်မှတ်၍ အကာအကွယ်ပေးနိုင်သည်။
3. **Easy Maintenance (ထိန်းသိမ်းရ လွယ်ကူခြင်း)**: ကုဒ်တစ်ခုတွင် Error ဖြစ်ပေါ်ပါက သက်ဆိုင်ရာ Class သို့ တိုက်ရိုက်သွားရောက် ပြင်ဆင်နိုင်ပြီး အခြားနေရာများကို ထိခိုက်မှု မရှိစေပါ။
4. **Team Collaboration**: Developer အများအပြား လုပ်ဆောင်ရာတွင် မတူညီသော Module များကို Class အလိုက် သီးသန့်ခွဲဝေ ရေးသားနိုင်ပါသည်။

---

## 🧱 ၄။ OOP ၏ အဓိက ဒေါက်တိုင်ကြီး (၄) ခု (Four Pillars of OOP)

1. **Encapsulation (ဒေတာကို လုံခြုံစွာ ထုပ်ပိုးခြင်း)**: Data များကို `private` ထားပြီး ခွင့်ပြုထားသော Method (`Getter/Setter`) မှသာ ခေါ်ယူခွင့်ပေးခြင်း။
2. **Inheritance (အမွေဆက်ခံခြင်း)**: မိခင် Class (Parent) ၏ စွမ်းဆောင်ချက်များကို သားသမီး Class (Child) က `extends` သုံး၍ ဆက်ခံခြင်း။
3. **Polymorphism (သွင်ပြင်မျိုးစုံ ပြောင်းလဲနိုင်ခြင်း)**: တူညီသော Method အမည်ဖြင့် မတူညီသော Class များတွင် မိမိတို့နှင့် ကိုက်ညီအောင် ပြောင်းလဲအလုပ်လုပ်စေခြင်း။
4. **Abstraction (ရှုပ်ထွေးမှုများကို ဖုံးကွယ်ထားခြင်း)**: အသုံးပြုသူကို လိုအပ်သော ခလုတ်ကိုသာ ပြသပြီး နောက်ကွယ်မှ ရှုပ်ထွေးသော အလုပ်များကို ဖုံးကွယ်ထားခြင်း (Interface / Abstract Class)။

---

## 💻 ၅။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Practical Usage)

### နမူနာ (၁): ဘဏ်အကောင့် စနစ် (Bank Account System)
```php
<?php
class BankAccount {
    // 1. Properties (သတင်းအချက်အလက်များ - ပြင်ပမှ တိုက်ရိုက်မထိနိုင်အောင် private ထားသည်)
    private string $accountHolder;
    private float $balance;

    // 2. Constructor (Object တည်ဆောက်ချိန်တွင် အလိုအလျောက် စတင်လုပ်ဆောင်သော Method)
    public function __construct(string $name, float $initialDeposit = 0.0) {
        $this->accountHolder = $name;
        $this->balance = $initialDeposit;
    }

    // 3. Deposit Method (ငွေသွင်းခြင်း)
    public function deposit(float $amount): void {
        if ($amount > 0) {
            $this->balance += $amount;
            echo "{$this->accountHolder} ထံသို့ $amount ကျပ် ငွေသွင်းပြီးပါပြီ။<br>";
        } else {
            echo "ငွေပမာဏ မှားယွင်းနေပါသည်။<br>";
        }
    }

    // 4. Withdraw Method (ငွေထုတ်ခြင်း - စည်းကမ်းချက် စစ်ဆေးမှု)
    public function withdraw(float $amount): bool {
        if ($amount > $this->balance) {
            echo "ငွေထုတ်မရပါ! လက်ကျန်ငွေ မလုံလောက်ပါ။ (လက်ကျန်: {$this->balance} ကျပ်)<br>";
            return false;
        }

        $this->balance -= $amount;
        echo "{$amount} ကျပ် ထုတ်ယူမှု အောင်မြင်ပါသည်။ ကျန်ငွေ: {$this->balance} ကျပ်<br>";
        return true;
    }

    // 5. Getter (လက်ကျန်ငွေကို စစ်ဆေးခွင့်ပေးခြင်း)
    public function getBalance(): float {
        return $this->balance;
    }
}

// ==========================================
// လက်တွေ့ Object တည်ဆောက် အသုံးပြုခြင်း
// ==========================================

// အကောင့်ပိုင်ရှင် ဦးအောင် အတွက် Object တည်ဆောက်ခြင်း
$accountAung = new BankAccount("ဦးအောင်", 100000);
$accountAung->deposit(50000);   // ငွေ ၅ သောင်းသွင်းမည်
$accountAung->withdraw(120000); // ငွေ ၁ သိန်း ၂ သောင်းထုတ်မည်

// တိုက်ရိုက်ပြင်ဆင်ရန် ကြိုးစားပါက Error တက်မည် (Encapsulation ၏ အကာအကွယ်)
// $accountAung->balance = 99999999; // Fatal Error: Cannot access private property
?>
```

---

### နမူနာ (၂): Inheritance (အမွေဆက်ခံခြင်း) အသုံးပြုပုံ
```php
<?php
// Parent Class (မိခင်)
class User {
    protected string $username;

    public function __construct(string $name) {
        $this->username = $name;
    }

    public function getRole(): string {
        return "ရိုးရိုး အသုံးပြုသူ (Normal User)";
    }
}

// Child Class (သားသမီး - extends ဖြင့် ဆက်ခံသည်)
class Admin extends User {
    // Parent method ကို Override လုပ်၍ Admin အတွက် သီးသန့် ရေးသားခြင်း
    public function getRole(): string {
        return "စီမံခန့်ခွဲသူ (Super Admin) - စနစ်တစ်ခုလုံးကို ထိန်းချုပ်ခွင့်ရှိသည်";
    }

    public function deleteDatabase(): void {
        echo "Database ကို သန့်ရှင်းရေး ပြုလုပ်ပြီးပါပြီ။<br>";
    }
}

$user = new User("မောင်မောင်");
echo $user->getRole() . "<br>";

$admin = new Admin("ကိုသီဟဇော်");
echo $admin->getRole() . "<br>";
$admin->deleteDatabase();
?>
```

---

## ⭐ ၆။ OOP ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

Laravel, Symfony နှင့် EC-CUBE စသည့် စနစ်ကြီးများတွင် အောက်ပါ OOP Features များကို နေရာတိုင်းလိုလိုတွင် အသုံးပြုကြပါသည်:

### ၁။ Traits (Class အချင်းချင်း Code ပြန်လည်မျှဝေသုံးစွဲခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: PHP တွင် Child Class တစ်ခုသည် Parent Class တစ်ခုထံမှသာ အမွေဆက်ခံနိုင်သည် (Single Inheritance)။ မတူညီသော Class များ (ဥပမာ- User Class နှင့် Product Class) နှစ်ခုစလုံးတွင် "Created At / Updated At" ရက်စွဲမှတ်တမ်း လိုအပ်သည့်အခါ **Trait** ကို သုံး၍ ကုဒ်မျှဝေနိုင်သည်။
```php
trait TimestampableTrait {
    private string $createdAt;

    public function initTimestamp(): void {
        $this->createdAt = date("Y-m-d H:i:s");
    }

    public function getCreatedAt(): string {
        return $this->createdAt;
    }
}

class Product {
    use TimestampableTrait; // Trait ကို ဆွဲသွင်းအသုံးပြုခြင်း
}

class User {
    use TimestampableTrait;
}

$p = new Product();
$p->initTimestamp();
echo "ပစ္စည်းဖန်တီးချိန်: " . $p->getCreatedAt();
```

### ၂။ Static Methods & Properties (Object မဆောက်ဘဲ တိုက်ရိုက်ခေါ်သုံးခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: အမြဲတမ်း တူညီသော အလုပ်လုပ်သည့် Utility / Helper Functions များ (ဥပမာ- ငွေကြေးဖော်မတ် ပြောင်းခြင်း) အတွက် `new` ဆောက်စရာမလိုဘဲ တိုက်ရိုက် ခေါ်သုံးရန် သုံးသည်။
```php
class CurrencyHelper {
    public static function formatMMK(float $amount): string {
        return number_format($amount, 0) . " ကျပ်";
    }
}

// Object ဆောက်စရာမလိုဘဲ ClassName::method() ဖြင့် တိုက်ရိုက် ခေါ်ယူခြင်း
echo CurrencyHelper::formatMMK(1500000); // 1,500,000 ကျပ်
```

### ၃။ Magic Methods (အတွင်းပိုင်း အလိုအလျောက် အလုပ်လုပ်သော Methods)
PHP တွင် `__` (double underscore) ဖြင့် စတင်သော အထူး Methods များ ရှိပါသည်:
- **`__toString()`**: Object တစ်ခုကို `echo $object;` ဟု စာသားအဖြစ် ထုတ်ပြရန် ကြိုးစားချိန်တွင် အလိုအလျောက် Run ပေးသည်။
- **`__invoke()`**: Object တစ်ခုလုံးကို Function ကဲ့သို့ `$object();` တိုက်ရိုက် ခေါ်သုံးခွင့် ပြုသည်။
```php
class Customer {
    public function __construct(private string $name, private string $email) {}

    public function __toString(): string {
        return "Customer: {$this->name} ({$this->email})";
    }
}

$c = new Customer("ကိုမင်းမင်း", "min@gmail.com");
echo $c; // Output: Customer: ကိုမင်းမင်း (min@gmail.com)
```

---

## 🎯 အနှစ်ချုပ် (Summary)

- **Class** = အရာဝတ္ထုတစ်ခု၏ ဖွဲ့စည်းပုံ **ဒီဇိုင်းပုံစံခွက်**
- **Object** = ပုံစံခွက်ဖြင့် တည်ဆောက်ထားသော **လက်တွေ့အရာဝတ္ထု**
- **OOP** သည် လုပ်ငန်းခွင်တွင် ကြီးမားရှုပ်ထွေးသော စနစ်များကို စနစ်တကျ၊ လုံခြုံစွာနှင့် အလွယ်တကူ ထိန်းသိမ်းနိုင်ရန်အတွက် မဖြစ်မနေ အသုံးပြုရသော အဆင့်မြင့် ပညာရပ်ဖြစ်ပါသည်။
