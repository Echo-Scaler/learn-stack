---
title: "07. Strings & Wrapper Classes"
description: "String Constant Pool (SCP)၊ String Immutability၊ StringBuilder vs StringBuffer၊ Autoboxing/Unboxing နှင့် Integer Cache Pitfall များ (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🧵 အခန်း ၇။ Strings နှင့် Wrapper Classes Internals

Java တွင် `String` နှင့် **Wrapper Classes** (`Integer`, `Double`, etc.) တို့သည် နေ့စဉ် အသုံးများဆုံး အစိတ်အပိုင်းများ ဖြစ်သော်လည်း၊ ၎င်းတို့၏ အတွင်းပိုင်း Memory အလုပ်လုပ်ပုံကို သဲသဲကွဲကွဲ မသိပါက **Memory Leak** နှင့် **ရုတ်တရက် ရှာမရသော Bug များ (Silent Bugs)** ဖြစ်ပေါ်စေနိုင်ပါသည်။

---

## 🏊 ၁။ String Constant Pool (SCP) နှင့် String Immutability

Java တွင် `String` သည် **Immutable (တန်ဖိုးပြင်ဆင်၍မရသော)** Class ဖြစ်ပြီး Heap Memory အတွင်းရှိ **String Constant Pool (SCP)** ဧရိယာတွင် အထူး သိုလှောင်ပါသည်:

```
[HEAP MEMORY]
+-----------------------------------------------------------+
|  +-----------------------------------------------------+  |
|  | STRING CONSTANT POOL (SCP)                          |  |
|  |                                                     |  |
|  |   "Java" <─────── str1                              |  |
|  |      ▲                                              |  |
|  |      └─────────── str2                              |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  Normal Heap Object:                                      |
|    new String("Java") <────── str3                        |
+-----------------------------------------------------------+
```

### လက်တွေ့ ကုဒ်နှင့် `==` vs `equals()`:

```java
public class StringPoolDemo {
    public static void main(String[] args) {
        String str1 = "Java"; // SCP ပေါ်တွင် "Java" ဆောက်သည်
        String str2 = "Java"; // SCP ပေါ်တွင် ရှိပြီးသား "Java" ကို ပြန်လည် ညွှန်းဆိုသည် (Memory ချွေတာခြင်း)
        String str3 = new String("Java"); // Heap ပေါ်တွင် Object အသစ် အတင်းအကျပ် ဆောက်သည်

        // '==' သည် Memory Address တူမတူ စစ်ဆေးခြင်း
        System.out.println(str1 == str2); // true  (တူညီသော SCP address ကို ညွှန်းသည်)
        System.out.println(str1 == str3); // false (Heap object address နှင့် SCP address မတူပါ!)

        // equals() သည် စာသားတန်ဖိုး အစစ်အမှန် တူမတူ စစ်ဆေးခြင်း
        System.out.println(str1.equals(str3)); // true (တန်ဖိုး အတိအကျ တူညီသည်)

        // intern() ခေါ်ယူပါက Heap object မှ SCP ပေါ်ရှိ address သို့ ရရှိမည်
        System.out.println(str1 == str3.intern()); // true
    }
}
```

> 💡 **အဘယ်ကြောင့် String ကို Immutable ပြုလုပ်ထားသနည်း?**
> 1. **Security**: Database URL များ၊ Passwords များနှင့် Network Connections များကို String ဖြင့် သိမ်းဆည်းရာတွင် အပြင်မှ တန်ဖိုး မပြောင်းလဲနိုင်စေရန်။
> 2. **Thread-Safety**: Immutable ဖြစ်သောကြောင့် Thread အများအပြား ပြိုင်တူ ဖတ်ရှုသော်လည်း Lock လုပ်စရာမလိုဘဲ Safe ဖြစ်ခြင်း။
> 3. **HashCode Caching**: `HashMap` ၏ Key အဖြစ် သုံးရာတွင် Hash Code ကို တစ်ကြိမ်သာ တွက်ပြီး Cache လုပ်ထားနိုင်ခြင်း။

---

## ⚡ ၂။ String Concatenation: `+` vs `StringBuilder` vs `StringBuffer`

Loops များအတွင်း String များကို `+` ဖြင့် ပေါင်းစပ်ပါက Loop ပတ်တိုင်း Garbage Object အသစ်များ အမြောက်အမြား ထွက်ပေါ်လာပြီး GC ကို ဝန်ပိစေသည်:

| အချက်အလက် | `String` | `StringBuilder` | `StringBuffer` |
| :--- | :--- | :--- | :--- |
| **Mutability** | Immutable (မပြင်နိုင်) | Mutable (ပြင်နိုင်သည်) | Mutable (ပြင်နိုင်သည်) |
| **Thread Safety** | Safe | **Not Thread-Safe** (Fast) | **Thread-Safe** (`synchronized`) |
| **Performance** | Loop ထဲတွင် အလွန်နှေး | **အလျင်မြန်ဆုံး (Recommended)** | Synchronized overhead ကြောင့် အနည်းငယ် နှေး |

### Production Comparison:

```java
// ❌ ANTI-PATTERN: Loop အတွင်း '+' သုံးခြင်း (O(N^2) time & High Garbage)
String result = "";
for (int i = 0; i < 10000; i++) {
    result += i; // Loop တစ်ခေါက်တိုင်း String Object အသစ်ဆောက်သဖြင့် နှေးကွေးပါသည်
}

// ✅ BEST PRACTICE: Single-Thread အတွက် StringBuilder သုံးပါ (Fastest)
StringBuilder sb = new StringBuilder(10000);
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String finalResult = sb.toString();
```

---

## 📦 ၃။ Wrapper Classes နှင့် Autoboxing / Unboxing

Java သည် Primitive types များကို Object အဖြစ် ကိုင်တွယ်နိုင်ရန် Wrapper Classes များကို ထောက်ပံ့ပေးထားသည် (ဥပမာ `int` -> `Integer`, `double` -> `Double`)။

- **Autoboxing**: Primitive မှ Wrapper Object သို့ အလိုအလျောက် ပြောင်းလဲခြင်း (JVM က `Integer.valueOf(x)` ခေါ်ပေးသည်)။
- **Unboxing**: Wrapper Object မှ Primitive သို့ အလိုအလျောက် ပြောင်းလဲခြင်း (JVM က `obj.intValue()` ခေါ်ပေးသည်)။

```java
Integer count = 100; // Autoboxing: Integer.valueOf(100)
int primitiveCount = count; // Unboxing: count.intValue()
```

### 🚨 Unboxing NullPointerException Pitfall:

```java
public class UnboxingNpeDemo {
    public static void main(String[] args) {
        Integer nullableValue = null;

        // ⚠️ Run-time Error: java.lang.NullPointerException!
        // အဘယ်ကြောင့်ဆိုသော် nullableValue.intValue() ကို ခေါ်ရန် ကြိုးစားသောကြောင့်ဖြစ်သည်
        int unboxed = nullableValue; 
    }
}
```

---

## ⚠️ ၄။ The Notorious Integer Cache Pitfall (-128 to 127)

Java သည် Memory ချွေတာရန်အတွက် `-128` မှ `127` အထိရှိသော `Integer` Object များကို Internal Cache လုပ်ထားပါသည်။ ဤအချက်ကြောင့် အောက်ပါ အံ့သြဖွယ် အခြေအနေ ဖြစ်ပေါ်ပါသည်:

```java
public class IntegerCacheTrap {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        System.out.println("100 == 100: " + (a == b)); // ✅ true (Cache ထဲမှ တူညီသော Object ကို ညွှန်းသည်)

        Integer x = 200;
        Integer y = 200;
        System.out.println("200 == 200: " + (x == y)); // ❌ false! (127 ထက် ကျော်သဖြင့် Heap ပေါ်တွင် Object ၂ ခု သီးခြား ဆောက်သည်)

        // ✅ မှန်ကန်သော နည်းလမ်း: Wrapper Class များကို အမြဲ equals() ဖြင့်သာ နှိုင်းယှဉ်ပါ!
        System.out.println("200.equals(200): " + x.equals(y)); // ✅ true
    }
}
```

> 🏆 **Senior Rule of Thumb**: Wrapper Objects များ (`Integer`, `Long`, `String`) ကို စစ်ဆေးသည့်အခါ **ဘယ်သောအခါမျှ `==` မသုံးပါနှင့်! အမြဲတမ်း `.equals()` ကိုသာ သုံးပါ။**

---

## 📝 ၅။ Modern Java: Text Blocks (Java 15+)

SQL queries များ သို့မဟုတ် JSON payload များကို ကုဒ်ထဲတွင် ရေးသားသည့်အခါ Escape characters (`\n`, `\"`) များကြောင့် ဖတ်ရခက်ခြင်းကို ဖြေရှင်းရန် Java 15 မှစတင်ကာ Multi-line Text Blocks (`"""`) ကို အသုံးပြုနိုင်ပါသည်:

```java
String sqlQuery = """
    SELECT u.id, u.username, u.email, o.total_amount
    FROM users u
    INNER JOIN orders o ON u.id = o.user_id
    WHERE o.status = 'COMPLETED'
    ORDER BY o.created_at DESC
    LIMIT 50;
    """;
```

---

## 🎯 အနှစ်ချုပ်

1. `String` သည် **Immutable** ဖြစ်ပြီး **String Constant Pool (SCP)** ပေါ်တွင် တည်ရှိသည်။
2. စာသားများကို စစ်ဆေးသည့်အခါ `==` မသုံးဘဲ `.equals()` ကိုသာ အသုံးပြုပါ။
3. အကြိမ်ရေများစွာ စာသားဆက်စပ်ပါက `+` အစား **`StringBuilder`** ကို ဦးစားပေးပါ။
4. Wrapper Classes များသည် `-128` မှ `127` အထိ Cache ရှိပြီး နှိုင်းယှဉ်ပါက အမြဲ `.equals()` သုံးရမည်။
5. Wrapper Object ကို Primitive သို့ Unbox လုပ်ချိန်တွင် `null` မဖြစ်စေရန် အထူး သတိပြုပါ။
