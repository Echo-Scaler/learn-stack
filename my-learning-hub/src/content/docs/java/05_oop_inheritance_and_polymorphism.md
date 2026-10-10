---
title: "05. OOP: Inheritance & Polymorphism"
description: "Inheritance (IS-A)၊ Dynamic Method Dispatch၊ Runtime Polymorphism၊ Upcasting/Downcasting၊ Pattern Matching instanceof နှင့် Composition over Inheritance (မြန်မာဘာသာ)"
---

# 🧬 အခန်း ၅။ OOP မဏ္ဍိုင် (၂ & ၃): Inheritance နှင့် Polymorphism

Inheritance (မျိုးဆက်လက်ခံခြင်း) နှင့် Polymorphism (ရုပ်သွင်အမျိုးမျိုး ဆောင်နိုင်ခြင်း) တို့သည် OOP စနစ်တစ်ခုအား ပြောင်းလွယ်ပြင်လွယ်ရှိစေပြီး (Extensible)၊ ကုဒ်များကို ထပ်ခါတလဲလဲ မရေးရဘဲ စနစ်တကျ ပြန်လည်အသုံးချနိုင်စေသော အဓိက မဏ္ဍိုင်ကြီးများ ဖြစ်ပါသည်။

---

## 🏛️ ၁။ Inheritance (အမွေဆက်ခံခြင်း - "IS-A" ဆက်နွယ်မှု)

Class တစ်ခုသည် အခြား Parent Class တစ်ခု၏ Field များနှင့် Method များကို `extends` keyword အသုံးပြု၍ ဆက်ခံယူခြင်း ဖြစ်သည်။

```
           +-----------------------------+
           |     Payment (Parent Class)  |
           |  - transactionId, amount    |
           |  + processPayment()         |
           +-----------------------------+
                          ▲
            ┌─────────────┴─────────────┐
            │                           │
+-----------------------+   +-----------------------+
|  CreditCardPayment    |   |     PayPalPayment     |
|   (Child / Subclass)  |   |   (Child / Subclass)  |
+-----------------------+   +-----------------------+
```

### စည်းမျဉ်းများ:
1. Java တွင် **Single Inheritance** သာ ခွင့်ပြုသည် (Class တစ်ခုသည် Parent တစ်ခုထံမှသာ တိုက်ရိုက် `extends` လုပ်နိုင်သည်)။
2. Class အားလုံး၏ အမြင့်ဆုံး ဘိုးဘေး Parent Class သည် `java.lang.Object` ဖြစ်သည်။
3. Child class constructor သည် ပထမဆုံး line တွင် Parent constructor ဖြစ်သော `super()` ကို မဖြစ်မနေ ခေါ်ယူရပါသည် (ရေးမထားပါက Compiler က အလိုအလျောက် ထည့်ပေးသည်)။

---

## 🎭 ၂။ Polymorphism: Compile-Time vs Runtime

Polymorphism ဆိုသည်မှာ *"One Interface, Multiple Implementations"* ဖြစ်ပြီး နည်းလမ်း ၂ မျိုး ရှိပါသည်:

| အမျိုးအစား | နာမည် | အလုပ်လုပ်ပုံ (Mechanics) | ဥပမာ |
| :--- | :--- | :--- | :--- |
| **Compile-Time (Static)** | Method Overloading | Compiler က Method Parameter Signature ပေါ် မူတည်၍ မည်သည့် method ကို run ရမည်ကို ကြိုတင် ဆုံးဖြတ်ခြင်း | `sum(int, int)` vs `sum(double, double)` |
| **Runtime (Dynamic)** | Method Overriding | Object အစစ်အမှန်၏ Type ပေါ် မူတည်၍ JVM က Runtime တွင်မှ သက်ဆိုင်ရာ Child method ကို ရွေးချယ် run ခြင်း (**Dynamic Method Dispatch**) | `@Override public void process()` |

---

## ⚙️ ၃။ Dynamic Method Dispatch (Runtime Polymorphism လက်တွေ့)

Dynamic Method Dispatch သည် Parent Reference တစ်ခုဖြင့် Child Object အမျိုးမျိုးကို ကိုင်တွယ် run နိုင်သော စွမ်းရည်ဖြစ်သည်:

```java
// 1. Parent Class
public class Payment {
    protected String transactionId;
    protected double amount;

    public Payment(String transactionId, double amount) {
        this.transactionId = transactionId;
        this.amount = amount;
    }

    public void process() {
        System.out.println("Processing general payment: $" + amount);
    }
}

// 2. Child Class: Credit Card
public class CreditCardPayment extends Payment {
    private String cardNumber;

    public CreditCardPayment(String transactionId, double amount, String cardNumber) {
        super(transactionId, amount); // Parent Constructor ကို အရင် ခေါ်ရမည်
        this.cardNumber = cardNumber;
    }

    @Override
    public void process() {
        System.out.println("Validating Visa/MasterCard: " + cardNumber);
        System.out.println("Charging $" + amount + " to Credit Card via Stripe Gateway.");
    }
}

// 3. Child Class: Mobile Wallet
public class KPayPayment extends Payment {
    private String phoneNumber;

    public KPayPayment(String transactionId, double amount, String phoneNumber) {
        super(transactionId, amount);
        this.phoneNumber = phoneNumber;
    }

    @Override
    public void process() {
        System.out.println("Triggering KBZPay OTP Prompt for: " + phoneNumber);
        System.out.println("Deducting " + amount + " MMK via KBZPay API.");
    }
}
```

### Polymorphic Execution စမ်းသပ်ခြင်း:

```java
import java.util.List;

public class CheckoutService {
    public static void main(String[] args) {
        // Parent Reference List ထဲသို့ Child Object မျိုးစုံကို ထည့်သွင်းနိုင်သည် (Upcasting)
        List<Payment> payments = List.of(
            new CreditCardPayment("TXN-101", 150.0, "4111-XXXX-XXXX-1111"),
            new KPayPayment("TXN-102", 50000.0, "09987654321")
        );

        // Runtime တွင် JVM က သက်ဆိုင်ရာ Child Class ၏ process() ကို အလိုအလျောက် Dynamic Dispatch လုပ်ပေးသည်!
        for (Payment p : payments) {
            p.process(); // ပုံစံတူ method ကို ခေါ်သော်လည်း child object ပေါ်မူတည်၍ ရလဒ်များ ကွဲပြားစွာ ထွက်ပေါ်လာမည်
        }
    }
}
```

---

## 🔄 ၄။ Upcasting, Downcasting နှင့် Modern Pattern Matching (`instanceof`)

### (က) Upcasting (အလိုအလျောက် ပြောင်းလဲခြင်း - Safe)
Child Object ကို Parent Reference အဖြစ် သိမ်းဆည်းခြင်း ဖြစ်သည်။ အမြဲ Safe ဖြစ်ပြီး Type Casting ပြုလုပ်ရန် မလိုပါ။
```java
Payment payment = new CreditCardPayment("TXN-1", 100, "1234"); // Safe Upcast
```

### (ခ) Downcasting & Pattern Matching (Java 16+)
Parent Reference ကို Child Type အဖြစ် ပြန်လည်ပြောင်းလဲခြင်း ဖြစ်သည်။ မမှန်ကန်သော Type ကို ပြောင်းပါက `java.lang.ClassCastException` တက်ပါမည်။

```java
// ❌ Traditional Pre-Java 16 Style:
if (payment instanceof CreditCardPayment) {
    CreditCardPayment cc = (CreditCardPayment) payment; // Manual downcast လိုအပ်သည်
    // use cc...
}

// ✅ Modern Java 16+ Pattern Matching for instanceof:
if (payment instanceof CreditCardPayment cc) {
    // cc variable သည် CreditCardPayment အဖြစ် အလိုအလျောက် Scope ထဲတွင် အသုံးပြုနိုင်ပါသည်!
    System.out.println("Processing specifically for CC ending in: " + cc.getCardNumber());
}
```

---

## 🏆 ၅။ Senior Level: Composition Over Inheritance (GoF အကြံပြုချက်)

Inheritance သည် အလွန် အသုံးဝင်သော်လည်း အလွန်အကျွံ အဆင့်များစွာ `extends` လုပ်မိပါက **Fragile Base Class Problem** (Parent ကို ပြင်လိုက်လျှင် Child များအားလုံး bug ဖြစ်သွားခြင်း) နှင့် တင်းကျပ်လွန်းသော coupling ဖြစ်ပေါ်စေပါသည်။

> 💡 **Design Guideline**: **"Favor Object Composition over Class Inheritance."**
> - **Inheritance ("IS-A")**: တကယ့် Identity အစစ်အမှန် ဖြစ်မှသာ သုံးပါ (ဥပမာ `CreditCardPayment IS-A Payment`)။
> - **Composition ("HAS-A")**: Behavior များကို ပြောင်းလဲလိုပါက Class ထဲတွင် Field အဖြစ် ထည့်သွင်း ချိတ်ဆက်ပါ (ဥပမာ `Order HAS-A PaymentProcessor`)။

```java
// ✅ BEST PRACTICE: COMPOSITION
public class OrderService {
    // Class အသစ် extends မလုပ်ဘဲ လိုအပ်သော Payment Strategy ကို Inject လုပ်သုံးသည်
    private final PaymentProcessor paymentProcessor;

    public OrderService(PaymentProcessor paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }

    public void checkout(double amount) {
        paymentProcessor.pay(amount);
    }
}
```

---

## 🎯 အနှစ်ချုပ်

1. **Inheritance (`extends`)** သည် Parent ၏ စွမ်းရည်များကို ဆက်ခံပြီး ကုဒ်ပြန်လည် အသုံးပြုစေသည်။
2. **Polymorphism** သည် Parent Reference ဖြင့် Child Object အမျိုးမျိုးကို ကိုင်တွယ် run နိုင်ပြီး **Dynamic Method Dispatch** ဖြင့် သက်ဆိုင်ရာ method ကို runtime တွင် ရွေးချယ်သည်။
3. Method Overriding လုပ်ရာတွင် `@Override` annotation ကို အမြဲထည့်သွင်းပါ။
4. Type စစ်ဆေးရာတွင် Java 16+ **Pattern Matching `instanceof`** ကို အသုံးပြုပါ။
5. ရှုပ်ထွေးသော စနစ်များတွင် Deep Inheritance ကို ရှောင်ကြဉ်ပြီး **Composition over Inheritance** ကို ဦးစားပေးပါ။
