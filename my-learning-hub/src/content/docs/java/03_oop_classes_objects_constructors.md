---
title: "03. OOP: Classes, Objects & Constructors"
description: "Class နှင့် Object အခြေခံ၊ Constructor Overloading၊ this keyword၊ Initialization Order နှင့် Garbage Collection အလုပ်လုပ်ပုံ (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🏗️ အခန်း ၃။ OOP အခြေခံ: Classes, Objects နှင့် Constructors

Object-Oriented Programming (OOP) သည် လက်တွေ့လောကရှိ အရာဝတ္ထုများ (ဥပမာ အသုံးပြုသူ၊ ငွေလွှဲပြောင်းမှု၊ ကုန်ပစ္စည်း) ကို ကွန်ပျူတာ ပရိုဂရမ်အတွင်း **State (ဒေတာ)** နှင့် **Behavior (လုပ်ဆောင်ချက်)** ပေါင်းစပ်ထားသော Model တစ်ခုအဖြစ် ဖန်တီးတည်ဆောက်သည့် နည်းစနစ်ဖြစ်ပါသည်။

---

## 🏛️ ၁။ Class နှင့် Object ကွာခြားချက် (Blueprint vs Instance)

```
+---------------------------------------------------+
|                     CLASS                         |
|  (ပုံကြမ်း / Blueprint - Memory နေရာမယူသေးပါ)      |
|  - Fields: brand, model, batteryLevel             |
|  - Methods: drive(), chargeBattery()              |
+---------------------------------------------------+
                         │
     [ new Car("Tesla", "Model 3"); ]
                         ▼
+---------------------------------------------------+
|               OBJECT (INSTANCE)                   |
|  (Heap Memory ပေါ်ရှိ လက်တွေ့တည်ရှိသော အရာဝတ္ထု)   |
|  - brand: "Tesla"                                 |
|  - model: "Model 3"                               |
|  - batteryLevel: 100%                             |
|  - Memory Address: @0x82FA                        |
+---------------------------------------------------+
```

- **Class**: Object တစ်ခု မည်သို့ဖွဲ့စည်းမည်ကို သတ်မှတ်ထားသော **ပုံစံခွက် (Template / Blueprint)** ဖြစ်သည်။
- **Object**: Class ကို အခြေခံ၍ `new` keyword ဖြင့် Heap Memory ပေါ်တွင် တည်ဆောက်ထားသော **လက်တွေ့ Instance** ဖြစ်သည်။

---

## ⚙️ ၂။ Constructor နှင့် Object Initialization Lifecycle

Constructor သည် Object အသစ်တစ်ခု စတင်ဖန်တီးချိန် (`new` ခေါ်ချိန်) တွင် ၎င်း Object ၏ Initial State ကို သတ်မှတ်ပေးရန် JVM က အလိုအလျောက် ခေါ်ယူပေးသော အထူး method ဖြစ်သည်။

### Constructor စည်းမျဉ်းများ:
1. Constructor ၏ အမည်သည် **Class အမည်နှင့် အတိအကျ တူညီရမည်**။
2. မည်သည့် **Return Type မျှ မရှိရပါ** (`void` တောင် မထည့်ရပါ)။
3. Developer က မည်သည့် Constructor မျှ မရေးထားပါက Java က Parameter မပါသော **Default Constructor** တစ်ခု အလိုအလျောက် ထည့်သွင်းပေးသည်။ သို့သော် Parameter ပါသော Constructor တစ်ခုခု ရေးလိုက်သည်နှင့် Default constructor အလိုအလျောက် ပျောက်ကွယ်သွားပါသည်။

### လက်တွေ့ ကုဒ်: Constructor Overloading နှင့် Constructor Chaining (`this()`)

```java
public class BankAccount {
    private String accountNumber;
    private String accountHolder;
    private double balance;
    private String currency;

    // 1. Full Parameterized Constructor (အပြည့်စုံဆုံး Constructor)
    public BankAccount(String accountNumber, String accountHolder, double balance, String currency) {
        if (balance < 0) {
            throw new IllegalArgumentException("အစပြု လက်ကျန်ငွေသည် ၀ ထက် နည်း၍မရပါ");
        }
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
        this.currency = currency;
    }

    // 2. Overloaded Constructor: Currency မထည့်ပါက Default "MMK" ဖြင့် သတ်မှတ်ပေးခြင်း
    // this(...) ဖြင့် ပထမ Constructor ကို ပြန်လည် ချိတ်ဆက်ခေါ်ယူခြင်း (Constructor Chaining)
    public BankAccount(String accountNumber, String accountHolder, double balance) {
        this(accountNumber, accountHolder, balance, "MMK");
    }

    // 3. Overloaded Constructor: Zero balance ဖြင့် အကောင့်ဖွင့်ခြင်း
    public BankAccount(String accountNumber, String accountHolder) {
        this(accountNumber, accountHolder, 0.0, "MMK");
    }

    public void displayAccountInfo() {
        System.out.println("Account: " + accountNumber + " | Name: " + accountHolder 
                + " | Balance: " + balance + " " + currency);
    }
}
```

> 💡 **Best Practice (`this(...)`)**: Constructor တစ်ခုအတွင်းမှ အခြား Constructor ကို ပြန်ခေါ်သည့်အခါ `this(...)` statement သည် **ပထမဆုံး line (first statement)** တွင်သာ ရှိရပါမည်။

---

## 🎯 ၃။ `this` Keyword ၏ အခန်းကဏ္ဍ (၃) မျိုး

Java တွင် `this` သည် လက်ရှိ အလုပ်လုပ်နေသော **Current Object Instance** ကို ကိုယ်စားပြုသော Reference ဖြစ်သည်:

1. **Shadowing ပြဿနာ ဖြေရှင်းခြင်း**: Method Parameter အမည်နှင့် Class Field အမည် တူနေသည့်အခါ ခွဲခြားရန် (ဥပမာ `this.name = name;`)။
2. **Constructor Chaining**: လက်ရှိ Class ၏ အခြား Constructor ကို ခေါ်ယူရန် (`this(...)`)။
3. **Current Instance ကို Pass လုပ်ခြင်း**: အခြား Method တစ်ခုထံ လက်ရှိ Object ကို parameter အဖြစ် ပို့ပေးရန် (`eventBus.register(this);`)။

---

## ⏱️ ၄။ Java Object Initialization Order (သိရှိထားရမည့် ဆင့်ကဲဖြစ်စဉ်)

Java တွင် Class တစ်ခုကို ပထမဆုံး အသုံးပြုပြီး Object ဆောက်သည့်အခါ JVM သည် အောက်ပါ အစဉ်အတိုင်း လုပ်ဆောင်ပါသည်:

```
၁။ Static Variables & Static Initialization Block (static {}) -> Class ကို JVM က Load စတင်လုပ်ချိန်တွင် တစ်ကြိမ်သာ run မည်
၂။ Instance Variables & Instance Initialization Block ({})   -> Object 'new' ခေါ်တိုင်း run မည်
၃။ Constructor Code Execution                                -> Instance block ပြီးမှ စတင် run မည်
```

### လက်တွေ့ စမ်းသပ်မှု ကုဒ်:

```java
public class InitializationOrderDemo {

    static {
        System.out.println("1. Static Initialization Block (Class Load ချိန်တွင် တစ်ကြိမ်သာ run)");
    }

    {
        System.out.println("2. Instance Initialization Block (Object မွေးဖွားချိန်တွင် run)");
    }

    public InitializationOrderDemo() {
        System.out.println("3. Constructor Execution Finished!");
    }

    public static void main(String[] args) {
        System.out.println("--- First Instance Creation ---");
        InitializationOrderDemo obj1 = new InitializationOrderDemo();

        System.out.println("--- Second Instance Creation ---");
        InitializationOrderDemo obj2 = new InitializationOrderDemo();
    }
}
```

#### Output ရလဒ်:
```text
1. Static Initialization Block (Class Load ချိန်တွင် တစ်ကြိမ်သာ run)
--- First Instance Creation ---
2. Instance Initialization Block (Object မွေးဖွားချိန်တွင် run)
3. Constructor Execution Finished!
--- Second Instance Creation ---
2. Instance Initialization Block (Object မွေးဖွားချိန်တွင် run)
3. Constructor Execution Finished!
```

---

## 🧹 ၅။ Garbage Collection Basics (Object သက်တမ်း ကုန်ဆုံးခြင်း)

Heap Memory ပေါ်ရှိ Object တစ်ခုသည် အောက်ပါ အခြေအနေများတွင် Garbage Collection အတွက် အကျုံးဝင် (Eligible for GC) သွားပါသည်:

```java
public class GCEligibilityTest {
    public static void main(String[] args) {
        // အခြေအနေ ၁: Reference ကို null ပြောင်းလိုက်ခြင်း
        User user1 = new User("Alice");
        user1 = null; // မူရင်း "Alice" User object သည် Heap ပေါ်တွင် မည်သူမှ မညွှန်းတော့သဖြင့် GC သိမ်းဆည်းရန် အကျုံးဝင်သွားသည်

        // အခြေအနေ ၂: Reference ကို Object အသစ်တစ်ခုသို့ ပြောင်းညွှန်းလိုက်ခြင်း
        User user2 = new User("Bob");
        user2 = new User("Charlie"); // မူရင်း "Bob" object သည် အသုံးမလိုတော့ပါ

        // အခြေအနေ ၃: Method stack frame ပြီးဆုံးသွားခြင်း (Local Object)
        createTemporaryData();
    }

    public static void createTemporaryData() {
        User temp = new User("David");
        // createTemporaryData() method ပြီးဆုံးပါက 'temp' stack reference ပျက်ပြယ်သွားပြီး "David" object သည် GC ခံရမည်
    }
}
class User { String name; User(String name){ this.name = name; } }
```

> ⚠️ **Senior Warning (`System.gc()`)**: Code ထဲတွင် `System.gc()` ကို ကိုယ်တိုင် ဘယ်သောအခါမျှ မခေါ်ပါနှင့်။ ၎င်းသည် JVM အား GC ချက်ချင်း run ရန် အာမခံချက် မပေးသည့်အပြင်၊ Stop-the-World pause ဖြစ်ပေါ်စေပြီး Application Performance ကို ဆိုးရွားစွာ ကျဆင်းစေပါသည်။

---

## 🎯 အနှစ်ချုပ်

1. Class သည် Blueprint ဖြစ်ပြီး Object သည် Heap Memory ပေါ်ရှိ Instance ဖြစ်သည်။
2. Constructor သည် Object စတင်ဆောက်ချိန်တွင် Field များကို မှန်ကန်စွာ Initialize လုပ်ရန် အသုံးပြုသည်။
3. `this` သည် Current Instance ကို ညွှန်းဆိုပြီး Constructor Chaining (`this()`) ဖြင့် ကုဒ်ထပ်နေခြင်းကို ရှောင်ရှားနိုင်သည်။
4. Static blocks များသည် Class load ချိန်တွင် တစ်ကြိမ်သာ run ပြီး Instance blocks များနှင့် Constructor များသည် Object တိုင်းအတွက် အစဉ်လိုက် run ပါသည်။
