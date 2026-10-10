---
title: "04. OOP: Encapsulation & Access Modifiers"
description: "Data Hiding သဘောတရား၊ Access Levels (private, protected, public)၊ Business Invariants၊ Defensive Copying နှင့် Immutable Classes (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🛡️ အခန်း ၄။ OOP မဏ္ဍိုင် (၁): Encapsulation နှင့် Access Modifiers

**Encapsulation (ဒေတာလုံခြုံစွာ ထုပ်ပိုးခြင်း)** သည် OOP ၏ ပထမဆုံးနှင့် အရေးအကြီးဆုံး မဏ္ဍိုင်ဖြစ်ပါသည်။ ၎င်း၏ အဓိက ရည်ရွယ်ချက်မှာ Class တစ်ခုအတွင်းရှိ Internal State (Field များ) ကို အပြင်လူများ တိုက်ရိုက် မပြောင်းလဲနိုင်စေရန် **Data Hiding** ပြုလုပ်ပြီး၊ စနစ်၏ စည်းမျဉ်းများ (Business Invariants) မပျက်စီးစေရန် ကာကွယ်ပေးခြင်း ဖြစ်သည်။

---

## 🛑 ၁။ Public Fields များ အဘယ်ကြောင့် အန္တရာယ်များသနည်း?

အကယ်၍ Class တစ်ခု၏ Field များကို `public` ပေးထားပါက မည်သည့်နေရာမှမဆို စည်းကမ်းမဲ့ ပြင်ဆင်နိုင်သွားမည် ဖြစ်သည်:

```java
// ❌ BAD PRACTICE: Public Fields (No Encapsulation)
public class VulnerableBankAccount {
    public double balance; // အပြင်က တိုက်ရိုက်ပြင်နိုင်သည်
}

// အပြင်ဘက် Code တစ်နေရာတွင်:
VulnerableBankAccount acc = new VulnerableBankAccount();
acc.balance = -500000; // ဘဏ်လက်ကျန်ငွေ အနှုတ်ဖြစ်သွားသည်! စနစ်၏ Business Rule ပျက်စီးသွားပြီ
```

Encapsulation ဖြင့် ရေးသားပါက Field များကို `private` ပြုလုပ်ပြီး Method များမှတစ်ဆင့်သာ စစ်ဆေးလက်ခံပါသည်:

```java
// ✅ BEST PRACTICE: Encapsulated Class
public class SecureBankAccount {
    private double balance; // Data Hiding

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("ထည့်ငွေ ပမာဏသည် ၀ ထက် ကြီးရပါမည်");
        }
        this.balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("ထုတ်ငွေ ပမာဏ မှားယွင်းနေပါသည်");
        }
        if (amount > this.balance) {
            throw new IllegalStateException("လက်ကျန်ငွေ မလုံလောက်ပါ");
        }
        this.balance -= amount;
    }

    public double getBalance() {
        return this.balance; // Read-only access
    }
}
```

---

## 🔐 ၂။ Java Access Modifiers ဇယား (Detailed Scope Matrix)

Java တွင် Access Modifier (၄) မျိုး ရှိပါသည်:

| Modifier | Same Class | Same Package | Subclass (တခြား Package မှ ဆင်းသက်သူ) | World (မည်သည့်နေရာမဆို) |
| :--- | :---: | :---: | :---: | :---: |
| **`private`** | ✅ | ❌ | ❌ | ❌ |
| *(default / package-private)* | ✅ | ✅ | ❌ | ❌ |
| **`protected`** | ✅ | ✅ | ✅ (Inheritance မှတစ်ဆင့်) | ❌ |
| **`public`** | ✅ | ✅ | ✅ | ✅ |

### အသုံးပြုသင့်သော လမ်းညွှန်ချက် (Production Rule):
1. **Field အားလုံးကို အမြဲ `private` ထားပါ**။
2. အပြင်သို့ ဖွင့်ပေးရန် လိုအပ်သော လုပ်ဆောင်ချက်များကိုသာ `public` method အဖြစ် ဖွင့်ပေးပါ။
3. တူညီသော Module အတွင်းသာ သုံးလိုပါက `package-private` (modifier မထည့်ဘဲ) သုံးပါ။
4. Child class များကသာ Override လုပ်ရန် လိုအပ်ပါက `protected` ကို သုံးပါ။

---

## 🛡️ ၃။ Defensive Copying (ကာကွယ်ရေး မိတ္တူကူးယူခြင်း)

Getter များ ထုတ်ပေးသည့်အခါ **Mutable Objects** (ဥပမာ `java.util.Date`, `List`, `Map`) ဖြစ်နေပါက အပြင်ဘက်မှ ၎င်း Object အတွင်းရှိ Data ကို လှမ်းဖျက်နိုင်သည့် Memory Leak / Security Hole ဖြစ်နိုင်ပါသည်။

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Classroom {
    private final List<String> students = new ArrayList<>();

    public Classroom(List<String> initialStudents) {
        // Constructor တွင် တိုက်ရိုက် Assign မလုပ်ဘဲ Defensive Copy လုပ်ရမည်
        this.students.addAll(initialStudents);
    }

    // ❌ BAD GETTER:
    // public List<String> getStudents() { return this.students; }
    // အပြင်က getStudents().clear() ခေါ်လိုက်ပါက Classroom ထဲမှ ကျောင်းသားစာရင်း အားလုံး ပြောင်သွားမည်!

    // ✅ SECURE GETTER: Unmodifiable View သို့မဟုတ် Defensive Copy ပေးပါ
    public List<String> getStudents() {
        return Collections.unmodifiableList(this.students);
    }
}
```

---

## 💎 ၄။ Immutable Class တည်ဆောက်ခြင်း (Creating Immutable Objects)

Immutable Object ဆိုသည်မှာ Heap Memory ပေါ်တွင် တစ်ကြိမ် မွေးဖွားပြီးပါက ၎င်း၏ State (Field တန်ဖိုးများ) ကို မည်သူမျှ ပြင်ဆင်၍ မရတော့သော Object ဖြစ်ပါသည်။ (ဥပမာ Java ၏ `String`, `Integer`, `BigDecimal`)

### Immutable Class ဖြစ်ရန် လိုအပ်ချက် (၅) ချက်:
1. Class ကို `final` ကြေညာပါ (မည်သူမှ `extends` လုပ်ပြီး behavior မပြောင်းနိုင်စေရန်)။
2. Field အားလုံးကို `private` နှင့် `final` ထားပါ။
3. မည်သည့် Setter method မျှ မထည့်ပါနှင့်။
4. Mutable field ပါရှိပါက Constructor နှင့် Getter တွင် **Defensive Copy** ပြုလုပ်ပါ။
5. Object ကို ပြင်ဆင်သည့် method ခေါ်ပါက လက်ရှိ object ကို မပြင်ဘဲ Object အသစ်တစ်ခု အမြဲ create လုပ်၍ return ပေးပါ။

### လက်တွေ့ ကုဒ်: Custom Immutable Money Class

```java
import java.math.BigDecimal;
import java.util.Objects;

public final class Money { // 1. final class
    private final BigDecimal amount;  // 2. private final fields
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        this.amount = Objects.requireNonNull(amount, "Amount cannot be null");
        this.currency = Objects.requireNonNull(currency, "Currency cannot be null");
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    // တန်ဖိုးတိုးပါက လက်ရှိ object ကို မပြင်ဘဲ Money Object အသစ် Return ပြန်ပေးသည်
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("မတူညီသော ငွေကြေးအမျိုးအစားများ ပေါင်း၍ မရပါ");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
}
```

---

## ⚡ ၅။ Modern Java: `record` Type (Java 16+)

ခေတ်မီ Enterprise Java တွင် ဒေတာ သယ်ဆောင်ရန်အတွက်သာ အသုံးပြုသော DTO (Data Transfer Object) သို့မဟုတ် Value Object များအတွက် Boilerplate ကုဒ်များ လျှော့ချရန် `record` ကို မိတ်ဆက်ခဲ့ပါသည်:

```java
// Java 16+ Record: အလိုအလျောက် final ဖြစ်ပြီး immutable ဖြစ်ကာ 
// constructor, getters (id(), name()), equals(), hashCode(), toString() အားလုံး အလိုအလျောက် ပါရှိသည်!
public record UserResponseDto(
    Long id,
    String username,
    String email,
    boolean isActive
) {
    // Compact Constructor ဖြင့် Validation စစ်ဆေးနိုင်သည်
    public UserResponseDto {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username မဖြစ်မနေ လိုအပ်ပါသည်");
        }
    }
}
```

---

## 🎯 အနှစ်ချုပ်

1. Encapsulation သည် ဒေတာကို ဖုံးကွယ်ထားပြီး ခွင့်ပြုထားသော စည်းကမ်းချက်များနှင့် စစ်ဆေးချက်များဖြင့်သာ အလုပ်လုပ်စေသည်။
2. Field များကို အမြဲ `private` ထားပြီး ပြင်ပသို့ `public` methods ဖြင့် လုံခြုံစွာ ဖွင့်ပေးပါ။
3. Mutable Data များအတွက် **Defensive Copying** အသုံးပြုပါ။
4. Thread-safe ဖြစ်ပြီး Side-effect ကင်းစင်သော စနစ်များအတွက် **Immutable Objects** နှင့် **Java Records** များကို ဦးစားပေး အသုံးပြုပါ။
