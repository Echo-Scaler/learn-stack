---
title: "06. OOP: Abstraction & Interfaces"
description: "Abstraction သဘောတရား၊ Abstract Classes vs Interfaces၊ Default & Static Methods (Java 8+)၊ Loose Coupling နှင့် Interface-Driven Development (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🔌 အခန်း ၆။ OOP မဏ္ဍိုင် (၄): Abstraction နှင့် Interfaces

**Abstraction (အသေးစိတ်ကို ဖုံးကွယ်ပြီး အနှစ်သာရကိုသာ ဖော်ထုတ်ခြင်း)** သည် ရှုပ်ထွေးသော ဆော့ဖ်ဝဲလ်စနစ်ကြီးများကို အစိတ်အပိုင်းငယ်များအဖြစ် ခွဲထုတ်ကာ အချင်းချင်း မှီခိုမှု နည်းပါးစေရန် (**Loose Coupling**) ပြုလုပ်ပေးသည့် အဓိက သော့ချက် ဖြစ်ပါသည်။

---

## 💡 ၁။ Abstraction ၏ အတွေးအခေါ် (The Concept of "WHAT" vs "HOW")

- **Contract (WHAT)**: စနစ်က *ဘာလုပ်ပေးနိုင်သလဲ* ဆိုသည့် အချက်အလက်ကိုသာ ပြသသည်။
- **Implementation (HOW)**: အတွင်းပိုင်းတွင် *မည်သို့ အသေးစိတ် တွက်ချက်သည်* ဆိုသည့် အချက်ကို ဖုံးကွယ်ထားသည်။

> ဥပမာ - ကားတစ်စီးကို မောင်းနှင်သည့်အခါ ယာဉ်မောင်းသည် စတီယာရင်လှည့်ခြင်း၊ လီဗာနင်းခြင်း (Interface) ကိုသာ သိရန်လိုပြီး၊ Engine အတွင်းပိုင်း ဆလင်ဒါထဲတွင် ဓာတ်ဆီနှင့် လေ မည်သို့ ပေါက်ကွဲလောင်ကျွမ်းနေသည် (Implementation Details) ကို သိစရာမလိုပါ။

---

## 🏛️ ၂။ Abstract Class vs Interface နှိုင်းယှဉ်ချက်ဇယား

Java တွင် Abstraction ကို နည်းလမ်း ၂ မျိုးဖြင့် တည်ဆောက်နိုင်သည်:

| အချက်အလက် (Feature) | Abstract Class | Interface |
| :--- | :--- | :--- |
| **ရည်ရွယ်ချက် (Intent)** | ဆင်တူသော Class များကြား **State (Fields)** နှင့် အခြေခံ Behavior များကို မျှဝေရန် | မသက်ဆိုင်သော Class များကြား တူညီသော **စွမ်းရည် (Contract/Capability)** ကို သတ်မှတ်ရန် |
| **Multiple Inheritance** | မရပါ (`extends` တစ်ခုသာ) | ရပါသည် (Interface များစွာ `implements` လုပ်နိုင်သည်) |
| **Field ဖွဲ့စည်းပုံ** | Instance variable မျိုးစုံ (`private`, `protected`, `public`) ထားနိုင်သည် | အမြဲတမ်း `public static final` (Constants) သာ ဖြစ်သည် |
| **Methods** | Abstract methods ရော၊ Body ပါသော Concrete methods ပါ ရှိနိုင်သည် | Abstract methods, `default` methods, `static` methods နှင့် `private` methods ပါနိုင်သည် |
| **Constructor** | Constructor ရှိနိုင်သည် (Child က `super()` ဖြင့် ခေါ်ရန်) | Constructor လုံးဝ မရှိနိုင်ပါ |
| **Speed/Coupling** | ပိုမို တင်းကျပ်သော ဆက်နွယ်မှု (Tighter Coupling) | အလွန် ပြေလျော့သော ဆက်နွယ်မှု (Looser Coupling) |

---

## ⚙️ ၃။ Interfaces ၏ ခေတ်မီ စွမ်းဆောင်ရည်များ (Java 8 & Java 9 Evolution)

Java 8 မတိုင်မီက Interface ထဲတွင် Method Body လုံးဝ မထည့်နိုင်သော်လည်း ခေတ်သစ် Java တွင် အောက်ပါ စွမ်းဆောင်ရည်များ ပါဝင်လာပါသည်:

1. **`default` Methods (Java 8+)**: Interface ကို အသုံးပြုနေသော လက်ရှိ Class များကို ကုဒ်မပျက်စေဘဲ Method အသစ် ထည့်သွင်းနိုင်ရန် (Backward Compatibility)။
2. **`static` Methods (Java 8+)**: Interface နှင့် သက်ဆိုင်သော Utility Helper များကို တိုက်ရိုက် ခေါ်သုံးနိုင်ရန်။
3. **`private` Methods (Java 9+)**: Default method များကြား ကုဒ်ထပ်နေသည်များကို Interface အတွင်းပိုင်း၌သာ မျှဝေသုံးစွဲနိုင်ရန်။

### လက်တွေ့ ကုဒ်: Advanced Interface Architecture

```java
public interface NotificationSender {

    // 1. Core Abstract Method (Contract - Implement မဖြစ်မနေ လုပ်ရမည်)
    void send(String recipient, String message);

    // 2. Default Method (Fallback / Common Behavior)
    default void sendWithUrgency(String recipient, String message, boolean isUrgent) {
        String formattedMessage = isUrgent ? "[URGENT] " + message : message;
        logAuditTrail(recipient, formattedMessage); // private helper ခေါ်ယူခြင်း
        send(recipient, formattedMessage);
    }

    // 3. Static Factory Method
    static NotificationSender getDefaultSender() {
        return new EmailNotificationSender();
    }

    // 4. Private Helper Method (Java 9+ Internal Encapsulation)
    private void logAuditTrail(String to, String msg) {
        System.out.println("[AUDIT LOG] Sending notification to " + to + " at " + System.currentTimeMillis());
    }
}
```

---

## 🔌 ၄။ Loose Coupling & Interface-Driven Development (Senior Pattern)

Senior Java Developer တစ်ယောက်၏ အရေးကြီးဆုံး စည်းမျဉ်းတစ်ခုမှာ **"Program to an Interface, not an Implementation"** ဖြစ်ပါသည်။

### မမှန်ကန်သော ပုံစံ (Tight Coupling - အားနည်းချက်များ):
```java
public class OrderService {
    // ❌ Class အစစ်အမှန်ကို တိုက်ရိုက် ချိတ်ဆက်ထားသဖြင့် နောက်တစ်ချိန် SMS သို့မဟုတ် Push Notification ပြောင်းလိုပါက Class တစ်ခုလုံး ပြင်ရမည်
    private EmailNotificationSender sender = new EmailNotificationSender();
}
```

### မှန်ကန်သော ပုံစံ (Loose Coupling via Interface Injection):
```java
// 1. Concrete Implementations
public class EmailNotificationSender implements NotificationSender {
    @Override
    public void send(String recipient, String message) {
        System.out.println("📧 Sending Email to " + recipient + ": " + message);
    }
}

public class SmsNotificationSender implements NotificationSender {
    @Override
    public void send(String recipient, String message) {
        System.out.println("📱 Sending SMS to " + recipient + ": " + message);
    }
}

// 2. Business Service (Interface ပေါ်တွင်သာ မှီခိုထားသည်)
public class OrderService {
    private final NotificationSender notificationSender;

    // Dependency Injection (Constructor မှတစ်ဆင့် Interface ကို လက်ခံသည်)
    public OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }

    public void completeOrder(String customerContact, String orderId) {
        System.out.println("Processing order: " + orderId);
        // မည်သည့် Notification အမျိုးအစားဖြစ်သည်ကို စိတ်ပူစရာမလိုဘဲ အလုပ်လုပ်နိုင်သည်
        notificationSender.send(customerContact, "Your order #" + orderId + " is confirmed!");
    }
}
```

---

## 🧩 ၅။ SOLID: Interface Segregation Principle (ISP)

Interface တစ်ခုတည်းထဲသို့ Method များစွာကို ပြည့်နှက်အောင် မထည့်ပါနှင့် (Fat Interface)။ အသုံးပြုသူ Class များသည် မိမိနှင့် မသက်ဆိုင်သော Method များကို အတင်းအကျပ် Implement မလုပ်ရစေရန် Interface အသေးစားများအဖြစ် ခွဲထုတ်ပါ:

```java
// ❌ BAD: Fat Interface
public interface Worker {
    void code();
    void test();
    void designUI();
}

// ✅ GOOD: Segregated Interfaces
public interface Programmer {
    void code();
}

public interface Tester {
    void test();
}

public class FullStackDeveloper implements Programmer, Tester {
    @Override public void code() { System.out.println("Writing Java backend"); }
    @Override public void test() { System.out.println("Writing JUnit tests"); }
}
```

---

## 🎯 အနှစ်ချုပ်

1. **Abstraction** သည် စနစ်၏ အရေးကြီးသော လုပ်ဆောင်ချက် အနှစ်သာရကိုသာ ချပြပြီး အသေးစိတ် ကုဒ်များကို ဖုံးကွယ်ပေးသည်။
2. State များကို မျှဝေရန်အတွက် **Abstract Class** ကို သုံးပြီး၊ စနစ်များ ချိတ်ဆက်ရန် Contract သတ်မှတ်ခြင်းအတွက် **Interface** ကို အသုံးပြုပါ။
3. Java 8/9 မှစတင်ကာ Interfaces များတွင် `default`, `static` နှင့် `private` methods များကို စွမ်းရည်ပြည့် အသုံးပြုနိုင်သည်။
4. အမြဲတမ်း **Interface** ပေါ်တွင်သာ ကုဒ်ရေးသားခြင်းဖြင့် Unit Test ရေးရ လွယ်ကူစေပြီး (Mocking)၊ စနစ်ကို အလွယ်တကူ ချဲ့ထွင်နိုင်စေပါသည်။
