---
title: "13. Design Patterns in Java (GoF & Enterprise)"
description: "Gang of Four (GoF) Design Patterns များ၊ Singleton (Double-Checked Locking)၊ Builder Pattern၊ Factory၊ Strategy၊ Observer နှင့် Repository Pattern (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🎨 အခန်း ၁၃။ Design Patterns in Java (GoF နှင့် Enterprise အသုံးချမှုများ)

Design Patterns ဆိုသည်မှာ ဆော့ဖ်ဝဲလ် အင်ဂျင်နီယာလောကတွင် အကြိမ်ကြိမ် တွေ့ကြုံရလေ့ရှိသော ဗိသုကာဆိုင်ရာ ပြဿနာများကို ဖြေရှင်းရန်အတွက် အတွေ့အကြုံရင့် ဆော့ဖ်ဝဲလ်ပညာရှင်ကြီးများ စုပေါင်းဖော်ထုတ်ထားသော **စံပြ ဖြေရှင်းနည်း ပုံစံခွက်များ (Architectural Blueprints)** ဖြစ်ပါသည်။

---

## 🏛️ ၁။ GoF Patterns အမျိုးအစား (၃) မျိုး

1. **Creational Patterns**: Object များ ဖန်တီးတည်ဆောက်ခြင်းကို လိုက်လျောညီထွေရှိစေသော ပုံစံများ (Singleton, Factory, Builder)။
2. **Structural Patterns**: Class များနှင့် Object များကို ပိုမိုကြီးမားသော Structure အဖြစ် ဖွဲ့စည်းပေးသော ပုံစံများ (Adapter, Decorator, Facade)။
3. **Behavioral Patterns**: Object များ အချင်းချင်း ဆက်သွယ်ပြောဆိုခြင်းနှင့် တာဝန်ခွဲဝေခြင်း ပုံစံများ (Strategy, Observer)။

---

## 🔒 ၂။ Singleton Pattern (Thread-Safe Double-Checked Locking)

စနစ်တစ်ခုလုံးတွင် Object Instance **တစ်ခုတည်းသာ** တည်ရှိစေရန် အာမခံပေးသော Pattern ဖြစ်သည် (ဥပမာ Database Connection Pool, Configuration Manager)။

```java
public class DatabaseManager {
    // 1. volatile keyword ဖြင့် Cache visibility ပြဿနာ ကာကွယ်ရမည်
    private static volatile DatabaseManager instance;

    // 2. private constructor ဖြင့် ပြင်ပမှ 'new' ခေါ်ဆောက်ခြင်းကို တားဆီးသည်
    private DatabaseManager() {
        System.out.println("Initializing Database Connection Pool...");
    }

    // 3. Thread-Safe Double-Checked Locking နည်းစနစ်
    public static DatabaseManager getInstance() {
        if (instance == null) { // First Check (Lock မခတ်ဘဲ စစ်ဆေးခြင်း - High Performance)
            synchronized (DatabaseManager.class) {
                if (instance == null) { // Second Check (Lock အတွင်း စစ်ဆေးခြင်း - Thread Safety)
                    instance = new DatabaseManager();
                }
            }
        }
        return instance;
    }
}
```

---

## 🧱 ၃။ Builder Pattern (Fluent API)

Field အရေအတွက် များပြားသော Class များတွင် Constructor Parameter အရှည်ကြီး ဖြစ်ပေါ်ခြင်း (**Telescoping Constructor Anti-Pattern**) ကို ဖြေရှင်းပေးသော အလွန်အသုံးများသည့် Pattern ဖြစ်ပါသည်:

```java
public class HttpRequest {
    private final String url;
    private final String method;
    private final int timeout;
    private final String bearerToken;

    // Private constructor: Builder မှတစ်ဆင့်သာ ဆောက်ခွင့်ပေးသည်
    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.timeout = builder.timeout;
        this.bearerToken = builder.bearerToken;
    }

    // Static Inner Builder Class
    public static class Builder {
        private final String url; // Mandatory Field
        private String method = "GET"; // Default values
        private int timeout = 3000;
        private String bearerToken;

        public Builder(String url) { this.url = url; }

        public Builder method(String method) { this.method = method; return this; }
        public Builder timeout(int timeout) { this.timeout = timeout; return this; }
        public Builder bearerToken(String token) { this.bearerToken = token; return this; }

        public HttpRequest build() {
            return new HttpRequest(this);
        }
    }
}
```

### အသုံးပြုပုံ (Clean Fluent Syntax):
```java
HttpRequest request = new HttpRequest.Builder("https://api.gateway.internal/orders")
    .method("POST")
    .timeout(5000)
    .bearerToken("eyJhbGciOiJIUzI1Ni...")
    .build();
```

---

## 🎯 ၄။ Strategy Pattern (ပြောင်းလဲနိုင်သော Business Rules)

Algorithms သို့မဟုတ် စည်းမျဉ်းများကို Interface အဖြစ် ထုပ်ပိုးကာ Runtime တွင် စိတ်ကြိုက် လဲလှယ်အသုံးပြုနိုင်စေသော Pattern ဖြစ်သည် (ဥပမာ ငွေပေးချေမှု လျှော့စျေး စည်းမျဉ်းများ):

```java
// 1. Strategy Interface
public interface DiscountStrategy {
    double applyDiscount(double rawAmount);
}

// 2. Concrete Strategies
public class BlackFridayDiscount implements DiscountStrategy {
    @Override public double applyDiscount(double amount) { return amount * 0.70; } // 30% off
}

public class VipCustomerDiscount implements DiscountStrategy {
    @Override public double applyDiscount(double amount) { return amount * 0.85; } // 15% off
}

// 3. Context (Strategy ကို အသုံးပြုသူ)
public class CheckoutContext {
    private final DiscountStrategy discountStrategy;

    public CheckoutContext(DiscountStrategy strategy) {
        this.discountStrategy = strategy;
    }

    public double calculateFinalPrice(double price) {
        return discountStrategy.applyDiscount(price);
    }
}
```

---

## 📢 ၅။ Observer Pattern (Event-Driven Architecture)

State တစ်ခု ပြောင်းလဲသွားသည့်အခါ ၎င်းကို စောင့်ကြည့်နေသော Subscriber များထံ အလိုအလျောက် သတင်းပို့ပေးသော Pattern ဖြစ်သည်:

```java
import java.util.ArrayList;
import java.util.List;

// Event Payload
public record OrderPlacedEvent(String orderId, double amount, String customerEmail) {}

// Observer Interface
public interface OrderEventListener {
    void onOrderPlaced(OrderPlacedEvent event);
}

// Event Publisher
public class OrderService {
    private final List<OrderEventListener> listeners = new ArrayList<>();

    public void addListener(OrderEventListener listener) {
        listeners.add(listener);
    }

    public void placeOrder(String orderId, double amount, String email) {
        OrderPlacedEvent event = new OrderPlacedEvent(orderId, amount, email);
        System.out.println("Order created: " + orderId);
        
        // Notify all subscribers
        for (OrderEventListener listener : listeners) {
            listener.onOrderPlaced(event);
        }
    }
}
```

---

## 🎯 အနှစ်ချုပ်

1. **Singleton** ကို Global Shared Instance တစ်ခုတည်း သတ်မှတ်ရန် သုံးပါ။ Double-Checked Locking တွင် `volatile` ကို မမေ့မလျော့ ထည့်သွင်းပါ။
2. Parameter များပြားပြီး စိတ်ကြိုက် ရွေးချယ်နိုင်သော Object များအတွက် **Builder Pattern** ကို အသုံးပြုပါ။
3. အခြေအနေပေါ် မူတည်၍ ကွဲပြားသော Algorithm / Business Logic များအတွက် **Strategy Pattern** ကို အသုံးပြုပါ။
4. Decoupled Event-Driven စနစ်များအတွက် **Observer Pattern** ကို အသုံးချပါ။
