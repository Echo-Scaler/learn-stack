---
title: "01. Java Basics & Core Syntax"
description: "Java အခြေခံ syntax၊ JVM/JRE/JDK အလုပ်လုပ်ပုံ၊ Data Types၊ Operators နှင့် Control Flow များ (မြန်မာဘာသာ အသေးစိတ် ရှင်းလင်းချက်)"
---

# ☕ အခန်း ၁။ Java အခြေခံ Syntax၊ JVM Architecture နှင့် Control Flow

Java သည် **Class-based, Object-Oriented, Strongly Typed** ဖြစ်သော Programming Language တစ်ခုဖြစ်ပါသည်။ Java ၏ အဓိက ဆောင်ပုဒ်မှာ **"Write Once, Run Anywhere" (WORA)** ဖြစ်ပြီး မည်သည့် Operating System (Windows, macOS, Linux) ပေါ်တွင်မဆို ပြန်လည် compile လုပ်စရာမလိုဘဲ အလုပ်လုပ်နိုင်ပါသည်။

---

## 🏛️ ၁။ JDK, JRE နှင့် JVM အလုပ်လုပ်ပုံ (Architectural Mental Model)

Java ကုဒ်တစ်ခု Run သည့်အခါ အောက်ပါအဆင့် ၃ ဆင့်ဖြင့် အလုပ်လုပ်ပါသည်:

```
+-----------------------------------------------------------------------+
| Java Development Kit (JDK)                                            |
| [javac Compiler, Debugger, Javadoc, Monitoring Tools]                 |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | Java Runtime Environment (JRE)                                  |  |
|  | [Core Class Libraries: java.lang, java.util, java.io]           |  |
|  |                                                                 |  |
|  |  +-----------------------------------------------------------+  |  |
|  |  | Java Virtual Machine (JVM)                              |  |  |
|  |  | [ClassLoader -> Execution Engine (JIT + Interpreter)   |  |  |
|  |  |  -> Garbage Collector -> Memory Runtime Data Areas]     |  |  |
|  |  +-----------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

1. **Java Source Code (`.java`)**: လူသားဖတ်နိုင်သော သင်ရေးသားသည့် ကုဒ်ဖိုင်။
2. **javac (Java Compiler)**: Source code ကို Platform-independent ဖြစ်သော **Bytecode (`.class`)** အဖြစ် ပြောင်းလဲပေးသည်။
3. **Java Virtual Machine (JVM)**: Bytecode ကို လက်ခံဖတ်ရှုပြီး လက်ရှိ OS (Windows/Linux) အတွက် Machine Code အဖြစ် **Just-In-Time (JIT) Compiler** နှင့် Interpreter တို့ဖြင့် ပေါင်းစပ် run ပေးသည်။

---

## 📦 ၂။ Data Types နှင့် Memory Footprint

Java သည် **Strongly Typed** ဘာသာစကားဖြစ်သောကြောင့် Variable တစ်ခုကြေညာတိုင်း Data Type ကို သတ်မှတ်ပေးရပါသည်:

### (က) Primitive Data Types (တန်ဖိုးတိုက်ရိုက်သိမ်းဆည်းသော အမျိုးအစားများ)

| Type | Size | Default Value | Range (တန်ဖိုးအတိုင်းအတာ) | လက်တွေ့ အသုံးပြုမှု ဥပမာ |
| :--- | :---: | :---: | :--- | :--- |
| `byte` | 1 byte (8 bits) | `0` | -128 to 127 | File streaming, Raw Network buffers |
| `short`| 2 bytes (16 bits) | `0` | -32,768 to 32,767 | Memory နည်းသော Embedded စနစ်များ |
| `int` | 4 bytes (32 bits) | `0` | -2^31 to 2^31 - 1 (~2 Billion) | အများဆုံးသုံးသော ကိန်းပြည့်များ၊ Loop Counters |
| `long` | 8 bytes (64 bits) | `0L` | -2^63 to 2^63 - 1 | Database Primary Keys, Timestamps, ငွေကြေးပမာဏ |
| `float`| 4 bytes (32 bits) | `0.0f`| 6-7 decimal digits | Graphic coordinates (တိကျမှု အလယ်အလတ်) |
| `double`| 8 bytes (64 bits)| `0.0d`| 15-16 decimal digits | သိပ္ပံတွက်ချက်မှု၊ ဒသမကိန်း အများစု (Default) |
| `boolean`| 1 bit (JVM dependent)| `false` | `true` သို့မဟုတ် `false` | Flag များ၊ Conditions များ စစ်ဆေးခြင်း |
| `char` | 2 bytes (16 bits)| `'\u0000'`| 0 to 65,535 (Unicode) | အက္ခရာတစ်ခုချင်းစီ (ဥပမာ `'A'`, `'က'`) |

> ⚠️ **Senior Production Warning (ငွေကြေးတွက်ချက်မှု)**: ဘဏ်လုပ်ငန်းနှင့် ငွေစာရင်း တွက်ချက်မှုများတွင် `double` သို့မဟုတ် `float` ကို လုံးဝ မသုံးရပါ။ Floating point binary rounding error ရှိသောကြောင့် Java ၏ `BigDecimal` (`java.math.BigDecimal`) ကိုသာ အသုံးပြုရပါသည်။

### လက်တွေ့ ကုဒ်နမူနာ:

```java
public class DataTypeDemo {
    public static void main(String[] args) {
        // Primitive Types
        byte userAge = 25;
        int transactionCount = 1_000_000; // Readable with underscore (Java 7+)
        long totalRevenueCents = 850_000_000_000L; // 'L' suffix မဖြစ်မနေ ထည့်ရသည်
        double exchangeRate = 3500.75;
        boolean isAccountActive = true;
        char currencySymbol = '$';

        System.out.println("User Age: " + userAge);
        System.out.println("Total Revenue: " + totalRevenueCents + " cents");
    }
}
```

---

## 🔄 ၃။ Type Casting (အမျိုးအစား အချင်းချင်း ပြောင်းလဲခြင်း)

1. **Implicit Casting (Widening - အလိုအလျောက်ပြောင်းခြင်း)**: သေးငယ်သော Type မှ ကြီးမားသော Type သို့ ပြောင်းခြင်း (Data မပျောက်ဆုံးပါ)။
   - `byte -> short -> int -> long -> float -> double`
2. **Explicit Casting (Narrowing - ကိုယ်တိုင်အတင်းပြောင်းခြင်း)**: ကြီးမားသော Type မှ သေးငယ်သော Type သို့ ပြောင်းခြင်း (Overflow/Data Loss ဖြစ်နိုင်ပါသည်)။

```java
public class CastingDemo {
    public static void main(String[] args) {
        // Widening (Implicit)
        int orderAmount = 100;
        double priceWithTax = orderAmount; // 100.0 (Safe)

        // Narrowing (Explicit)
        double totalBill = 99.99;
        int roundedBill = (int) totalBill; // 99 (ဒသမကိန်းများ ဖြတ်တောက်ပစ်သည်)
        
        System.out.println("Rounded Bill: " + roundedBill); // Output: 99
    }
}
```

---

## 🔀 ၄။ Control Flow: If-Else နှင့် Modern Enhanced Switch

လုပ်ငန်းခွင်သုံး Java တွင် Logic စစ်ဆေးရာ၌ `if-else` အပြင် Modern Java (Java 14/17 LTS) ၏ **Enhanced Switch Expressions** ကို ကျယ်ကျယ်ပြန့်ပြန့် အသုံးပြုကြပါသည်။

### (က) ရိုးရိုး If-Else Statement

```java
public class ControlFlowDemo {
    public static void checkAccess(int age, boolean hasVipPass) {
        if (age >= 18 && hasVipPass) {
            System.out.println("VIP Access Granted (အရွယ်ရောက်ပြီး VIP ခွင့်ပြုသည်)");
        } else if (age >= 18) {
            System.out.println("Standard Access (သာမန်ခွင့်ပြုချက်)");
        } else {
            System.out.println("Access Denied (အသက်မပြည့်သေးပါ)");
        }
    }
}
```

### (ခ) Modern Switch Expression (Arrow Syntax - Java 14+)

ရိုးရိုး Switch တွင် `break` မေ့ကျန်ပါက Fall-through ဖြစ်တတ်သော အားနည်းချက်ကို Modern Java တွင် Arrow (`->`) Syntax ဖြင့် ဖြေရှင်းထားပြီး တန်ဖိုးကို Variable ထဲသို့ တိုက်ရိုက် assign လုပ်နိုင်ပါသည်:

```java
public class ModernSwitchDemo {
    public static String getPaymentStatusMessage(String statusCode) {
        // Return တိုက်ရိုက်ပေးနိုင်သော Switch Expression
        return switch (statusCode) {
            case "PAID", "SETTLED" -> "Payment Completed Successfully (ငွေပေးချေမှု အောင်မြင်သည်)";
            case "PENDING"         -> "Waiting for Bank Confirmation (စောင့်ဆိုင်းဆဲ)";
            case "FAILED", "VOID"  -> "Transaction Rejected (ငွေပေးချေမှု မအောင်မြင်ပါ)";
            default                -> "Unknown Status Code: " + statusCode;
        };
    }

    public static void main(String[] args) {
        String msg = getPaymentStatusMessage("PAID");
        System.out.println(msg);
    }
}
```

---

## 🔁 ၅။ Loops (ကုဒ်များကို အထပ်ထပ် Run ခြင်း)

Java တွင် Loops ၄ မျိုး ရှိပါသည်:

```java
public class LoopsDemo {
    public static void main(String[] args) {
        // 1. Standard For Loop (အကြိမ်အရေအတွက် အတိအကျ သိရှိသည့်အခါ)
        for (int i = 1; i <= 3; i++) {
            System.out.println("Counter: " + i);
        }

        // 2. Enhanced For-Each Loop (Array / Collection များ ပတ်ရာတွင် အသုံးများဆုံး)
        String[] supportedCurrencies = {"USD", "EUR", "JPY", "MMK"};
        for (String currency : supportedCurrencies) {
            System.out.println("Supported Currency: " + currency);
        }

        // 3. While Loop (Condition မှန်နေသရွေ့ Run မည်)
        int retryCount = 0;
        while (retryCount < 3) {
            System.out.println("Attempting connection: " + retryCount);
            retryCount++;
        }

        // 4. Do-While Loop (အနည်းဆုံး ၁ ကြိမ် မဖြစ်မနေ အရင် Run မည်)
        int attempt = 1;
        do {
            System.out.println("Running task at least once...");
            attempt++;
        } while (attempt <= 1);
    }
}
```

---

## 💼 ၆။ Developer လက်တွေ့ အလေ့အကျင့်ကောင်းများ (Best Practices)

1. **Meaningful Variable Naming**: `int x, y;` ကဲ့သို့ အဓိပ္ပာယ်မရှိသော စာလုံးများ မသုံးပါနှင့်။ `int totalCustomerCount`, `double discountPercentage` ဟု ရေးပါ။
2. **Use Underscores in Long Numbers**: ဥပမာ `1000000` အစား `1_000_000` ဟု ရေးသားခြင်းဖြင့် စာဖတ်ရ လွယ်ကူစေပါသည်။
3. **Prefer Switch Expressions Over Long If-Else Chains**: တန်ဖိုး ၃ ခုထက်ပို၍ တိုက်စစ်ပါက Modern `switch` expression ကို သုံးပါ။
