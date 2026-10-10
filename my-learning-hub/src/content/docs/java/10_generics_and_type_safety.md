---
title: "10. Generics & Type Safety"
description: "Java Generics အခြေခံမှ အဆင့်မြင့်အထိ၊ Type Erasure၊ Wildcards (? extends vs ? super)၊ PECS Rule နှင့် Generic Repository Pattern (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🧬 အခန်း ၁၀။ Generics နှင့် Type Safety အင်ဂျင်နီယာပညာ

Java 5 မတိုင်မီက Collections များတွင် မည်သည့် Object မဆို သိမ်းဆည်းနိုင်ခဲ့သော်လည်း Runtime တွင် `ClassCastException` မကြာခဏ တက်လေ့ရှိသည်။ **Generics** သည် Compile-time တွင် Type Safety စစ်ဆေးပေးပြီး၊ ကွဲပြားသော Data Type များကို Code တစ်ခုတည်းဖြင့် လုံခြုံစွာ ကိုင်တွယ်နိုင်စေသော နည်းပညာဖြစ်ပါသည်။

---

## 🛑 ၁။ Generics မပါရှိခင်က ပြဿနာ vs Generics ဖြေရှင်းချက်

```java
// ❌ Pre-Java 5 (No Generics):
List list = new ArrayList();
list.add("Hello");
list.add(100); // မတူညီသော Type များကို လက်ခံလိုက်သည်

String str = (String) list.get(1); // ⚠️ Runtime Error: java.lang.ClassCastException!

// ✅ With Generics (Compile-Time Type Safety):
List<String> safeList = new ArrayList<>();
safeList.add("Hello");
// safeList.add(100); // ❌ Compiler က ချက်ချင်း Error ပြပေးသဖြင့် Bug မဖြစ်တော့ပါ
String item = safeList.get(0); // Casting လုပ်စရာ မလိုတော့ပါ
```

---

## 🛠️ ၂။ Generic Classes နှင့် Generic Methods ဖန်တီးခြင်း

```java
// 1. Generic Response Wrapper (Enterprise API များတွင် တွင်ကျယ်စွာ သုံးသည်)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data; // မည်သည့် Data Type မဆို dynamic လက်ခံနိုင်သည်

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public T getData() { return data; }
    public boolean isSuccess() { return success; }
}

// 2. Generic Method နမူနာ
public class Utility {
    public static <E> void printArray(E[] elements) {
        for (E element : elements) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
}
```

---

## 🧹 ၃။ Type Erasure ဆိုသည်မှာ အဘယ်နည်း? (JVM Internals)

Java သည် Generics မိတ်ဆက်ချိန်တွင် ယခင် Java Version အဟောင်းများနှင့် Backward Compatibility အပြည့်အဝ ရှိစေရန် **Type Erasure (အမျိုးအစား ပယ်ဖျက်ခြင်း)** နည်းစနစ်ကို အသုံးပြုခဲ့သည်:

1. **Compile Time**: Compiler က Type များကို တင်းကျပ်စွာ စစ်ဆေးပေးသည်။
2. **Bytecode Compilation**: Compile လုပ်ပြီး Class ဖိုင် ထွက်လာသည့်အခါ Generic Type Parameter များ (`<T>`, `<String>`) အားလုံးကို ဖျက်ပစ်ပြီး **`Object`** (သို့မဟုတ် သတ်မှတ်ထားသော Upper Bound) အဖြစ် အစားထိုးလိုက်သည်။
3. ထို့ကြောင့် JVM Runtime တွင် Generic Type အစစ်အမှန်ကို တိုက်ရိုက် မသိရှိနိုင်ပါ။

### Type Erasure ကြောင့် ဖြစ်ပေါ်လာသော ကန့်သတ်ချက်များ:
- `new T()` သို့မဟုတ် `new T[10]` ဟု တိုက်ရိုက် Object မဆောက်နိုင်ပါ။
- `if (obj instanceof List<String>)` ဟု Runtime တွင် စစ်ဆေး၍ မရပါ (Type Erasure ကြောင့် `List<?>` သာ စစ်နိုင်သည်)။
- Primitive type များကို Generic အဖြစ် တိုက်ရိုက် မသုံးနိုင်ပါ (`List<int>` မရပါ၊ `List<Integer>` သာ သုံးရမည်)။

---

## 🎯 ၄။ Wildcards နှင့် PECS Rule (Producer Extends, Consumer Super)

Generics တွင် Subtyping သည် ပုံမှန်အတိုင်း အလုပ်မလုပ်ပါ (ဥပမာ `Integer` သည် `Number` ၏ Child ဖြစ်သော်လည်း `List<Integer>` သည် `List<Number>` ၏ Child မဟုတ်ပါ - **Invariance** ဟုခေါ်သည်)။ ဤအချက်ကို ပြေလျော့စေရန် Wildcards (`?`) ကို အသုံးပြုပါသည်:

> 🏆 **Effective Java PECS Rule (Joshua Bloch)**:
> - **Producer Extends (`? extends T`)**: သင်၏ Collection ထံမှ ဒေတာများကို **ဖတ်ယူရန်သာ (Read-Only)** အသုံးပြုမည်ဆိုပါက `extends` ကို သုံးပါ။
> - **Consumer Super (`? super T`)**: သင်၏ Collection ထဲသို့ ဒေတာများကို **ထည့်သွင်းရန်သာ (Write-Only)** အသုံးပြုမည်ဆိုပါက `super` ကို သုံးပါ။

```java
import java.util.List;

public class PecsRuleDemo {

    // PRODUCER: ဒေတာများကို ဖတ်ရုံသာ ဖတ်ပြီး ပေါင်းလဒ်တွက်မည် (Read data out)
    public static double sumOfNumbers(List<? extends Number> numbers) {
        double total = 0.0;
        for (Number n : numbers) {
            total += n.doubleValue(); // Safe to read as Number
        }
        // numbers.add(10); ❌ ERROR: Producer ထဲသို့ Data အသစ် ထည့်ခွင့်မရှိပါ!
        return total;
    }

    // CONSUMER: စာရင်းထဲသို့ Integer ဒေတာများ ထည့်သွင်းပေးမည် (Write data in)
    public static void addNumbers(List<? super Integer> list) {
        list.add(1);
        list.add(2);
        list.add(3);
        // Object item = list.get(0); // ဖတ်ပါက Object အနေနှင့်သာ ရရှိနိုင်သည်
    }
}
```

---

## 🏢 ၅။ Real-World Generic Repository Pattern

Enterprise Backend များတွင် Database CRUD လုပ်ဆောင်ချက်များကို DRY (Don't Repeat Yourself) ဖြစ်စေရန် Generic Repository ကို အောက်ပါအတိုင်း တည်ဆောက်ပါသည်:

```java
import java.util.Optional;
import java.util.List;

public interface GenericRepository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}

// User Entity အတွက် တိုက်ရိုက် အသုံးချခြင်း:
public interface UserRepository extends GenericRepository<User, Long> {
    Optional<User> findByEmail(String email); // Custom Query method
}
```

---

## 🎯 အနှစ်ချုပ်

1. Generics သည် **Compile-time Type Safety** ကို အာမခံပေးပြီး `ClassCastException` များကို ကာကွယ်ပေးသည်။
2. **Type Erasure** ကြောင့် Runtime တွင် Generic Type အချက်အလက်များ ဖျက်သိမ်းခံရပြီး `Object` အဖြစ် ပြောင်းလဲသွားသည်။
3. Collection ထံမှ ဒေတာဖတ်လိုပါက **`? extends T`** ကို သုံးပြီး၊ ဒေတာထည့်လိုပါက **`? super T`** ကို အသုံးပြုပါ (**PECS** Rule)။
