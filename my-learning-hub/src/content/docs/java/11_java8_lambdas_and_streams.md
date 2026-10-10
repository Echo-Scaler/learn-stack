---
title: "11. Modern Java: Lambdas & Stream API"
description: "Java 8 Functional Programming၊ Core Functional Interfaces (Predicate, Function, Consumer, Supplier)၊ Stream Pipeline နှင့် Optional အသုံးပြုပုံ (မြန်မာဘာသာ အသေးစိတ်)"
---

# ⚡ အခန်း ၁၁။ Modern Java: Lambdas, Streams နှင့် Functional Architecture

Java 8 သည် Java သမိုင်းတွင် အကြီးမားဆုံးသော အပြောင်းအလဲဖြစ်ပြီး Object-Oriented ကမ္ဘာထဲသို့ **Functional Programming** စွမ်းရည်များကို အောင်မြင်စွာ ပေါင်းစပ်ပေးခဲ့ပါသည်။ ဒေတာများကို သာမန် for-loop ဖြင့် အဆင့်ဆင့် လှည့်ပတ်မည့်အစား Declarative Pipeline ဖြင့် သန့်ရှင်းကျစ်လျစ်စွာ ရေးသားနိုင်လာပါသည်။

---

## 🎯 ၁။ Functional Interface နှင့် Lambda Expression

Method တစ်ခုတည်းသာ ပါဝင်သော Interface ကို **Functional Interface** ဟု ခေါ်ပြီး `@FunctionalInterface` annotation ဖြင့် သတ်မှတ်နိုင်ပါသည်။ Lambda Expression သည် အမည်မပါသော Anonymous Method တစ်ခုအဖြစ် Behavior ကို တိုက်ရိုက် ပေးပို့နိုင်သော syntax ဖြစ်သည်:

```java
// Anonymous Class ပုံစံ အဟောင်း:
Runnable oldRunner = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running in old way");
    }
};

// Modern Java Lambda Expression:
Runnable modernRunner = () -> System.out.println("Running with clean Lambda!");
```

---

## 🧩 ၂။ အဓိက Functional Interfaces ကြီး (၄) မျိုး (The Core Four)

Java ၏ `java.util.function` package တွင် အောက်ပါ အဓိက Interface (၄) ခု ပါဝင်ပါသည်:

| Interface | Method Signature | အလုပ်လုပ်ပုံ (Intent) | ဥပမာ ကုဒ် |
| :--- | :--- | :--- | :--- |
| **`Predicate<T>`** | `boolean test(T t)` | အခြေအနေ မှန်/မမှန် စစ်ဆေးခြင်း (Filter) | `s -> s.length() > 5` |
| **`Function<T, R>`** | `R apply(T t)` | ဒေတာတစ်ခုကို အခြား Type တစ်ခုသို့ ပြောင်းလဲခြင်း (Transform) | `user -> user.getEmail()` |
| **`Consumer<T>`** | `void accept(T t)` | ဒေတာကို လက်ခံသုံးစွဲပြီး မည်သည့်အရာမှ ပြန်မပေးခြင်း (Action) | `item -> System.out.println(item)` |
| **`Supplier<T>`** | `T get()` | Argument မယူဘဲ Data အသစ်တစ်ခု ထုတ်လုပ်ပေးခြင်း (Factory) | `() -> UUID.randomUUID().toString()` |

---

## 🌊 ၃။ Stream API Pipeline Architecture

Stream သည် ဒေတာများကို ကိုယ်တိုင် မသိမ်းဆည်းဘဲ Collection များထံမှ ဒေတာစီးဆင်းမှု (Stream of Data) အဖြစ် ပြောင်းလဲကာ အဆင့်ဆင့် တွက်ချက်ပေးသော Pipeline ဖြစ်သည်:

```
[Data Source: List<User>]
       │
       ▼ stream()
+──────────────────────────+
| Intermediate Operations  |  <- Lazy (Terminal မခေါ်မချင်း အလုပ်မလုပ်သေးပါ)
|  - filter(user.isActive) |
|  - map(user.getEmail)    |
|  - sorted()              |
+──────────────────────────+
       │
       ▼
+──────────────────────────+
|   Terminal Operation     |  <- Eager (Pipeline ကို စတင် run ပြီး ရလဒ်ထုတ်ပေးသည်)
|  - collect(toList())     |
|  - count() / reduce()    |
+──────────────────────────+
```

### လက်တွေ့ Enterprise Data Processing ကုဒ်:

```java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamEnterpriseDemo {

    public record Transaction(String id, String category, double amount, boolean isSuccess) {}

    public static void main(String[] args) {
        List<Transaction> transactions = List.of(
            new Transaction("TXN-1", "GROCERY", 45.0, true),
            new Transaction("TXN-2", "ELECTRONICS", 1200.0, true),
            new Transaction("TXN-3", "GROCERY", 85.0, false), // failed
            new Transaction("TXN-4", "ELECTRONICS", 450.0, true),
            new Transaction("TXN-5", "DINING", 60.0, true)
        );

        // ၁။ အောင်မြင်သော ELECTRONICS ငွေလွှဲမှုများ၏ စုစုပေါင်းငွေကို တွက်ချက်ခြင်း
        double totalElectronicsSpend = transactions.stream()
            .filter(Transaction::isSuccess)                         // Filter: predicate
            .filter(t -> "ELECTRONICS".equalsIgnoreCase(t.category()))// Filter
            .mapToDouble(Transaction::amount)                       // Map: Transform to double
            .sum();                                                 // Terminal: sum

        System.out.println("Total Electronics Spending: $" + totalElectronicsSpend);

        // ၂။ Category အလိုက် အောင်မြင်သော ငွေလွှဲမှုများကို Grouping ပြုလုပ်ခြင်း
        Map<String, List<Transaction>> groupedByCategory = transactions.stream()
            .filter(Transaction::isSuccess)
            .collect(Collectors.groupingBy(Transaction::category));

        System.out.println("Categories: " + groupedByCategory.keySet());
    }
}
```

---

## 🛡️ ၄။ `Optional<T>`: NullPointerException ကင်းစင်သော ကုဒ်ရေးသားခြင်း

Java တွင် တန်ဖိုး မရှိနိုင်ခြင်း (absence of value) ကို `null` ပြန်ပေးမည့်အစား `Optional<T>` ဖြင့် သေသပ်စွာ ထုတ်ပေးနိုင်ပါသည်:

```java
import java.util.Optional;

public class OptionalBestPractice {

    public static Optional<String> findUserEmail(Long userId) {
        if (userId == 1L) {
            return Optional.of("developer@company.com");
        }
        return Optional.empty(); // null အစား Empty Optional ပြန်ပေးသည်
    }

    public static void main(String[] args) {
        // ❌ BAD ANTI-PATTERN: if (opt.isPresent()) opt.get() -> သာမန် null check နှင့် အတူတူပင်ဖြစ်သည်
        
        // ✅ BEST PRACTICE: Functional Chains ဖြင့် ကိုင်တွယ်ပါ
        String displayEmail = findUserEmail(2L)
            .map(String::toUpperCase)
            .orElse("NO_EMAIL_CONFIGURED"); // တန်ဖိုးမရှိပါက Default ပေးခြင်း

        System.out.println("User Email: " + displayEmail);

        // တန်ဖိုးမရှိပါက Exception ဖောက်ခွဲရန် orElseThrow သုံးပါ:
        // String email = findUserEmail(99L).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
```

---

## ⚠️ ၅။ Senior Performance Warning: Parallel Streams

`list.parallelStream()` သည် CPU Core များကို မျှဝေသုံးစွဲရန် လွယ်ကူသော်လည်း Application တစ်ခုလုံးရှိ **Common `ForkJoinPool`** ကို မျှဝေသုံးသောကြောင့် I/O Operations (Database calls, HTTP requests) များတွင် Parallel Stream သုံးမိပါက Thread Pool တစ်ခုလုံး Block ဖြစ်ကာ Application တစ်ခုလုံး အလုပ်မလုပ်တော့သည့် အန္တရာယ် ရှိပါသည်။ CPU-intensive တွက်ချက်မှု သီးသန့်တွင်သာ သုံးသင့်ပါသည်။

---

## 🎯 အနှစ်ချုပ်

1. Lambda Expressions များသည် Function များကို First-Class Citizens အဖြစ် အသုံးပြုစေသည်။
2. Core Functional Interfaces များဖြစ်သော **`Predicate`, `Function`, `Consumer`, `Supplier`** တို့ကို သဘောပေါက်ပါ။
3. **Stream API** သည် Filter, Map, FlatMap, Collect တို့ဖြင့် Data များကို Declarative Pipeline အဖြစ် သန့်ရှင်းစွာ တွက်ချက်ပေးသည်။
4. `null` ပြန်ပေးမည့်အစား **`Optional<T>`** ကို သုံးပြီး `orElseGet` သို့မဟုတ် `orElseThrow` ဖြင့် ရေးသားပါ။
