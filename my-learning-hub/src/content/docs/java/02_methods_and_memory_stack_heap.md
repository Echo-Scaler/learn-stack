---
title: "02. Methods & JVM Memory Model (Stack vs Heap)"
description: "Java Methods၊ Stack Memory နှင့် Heap Memory အလုပ်လုပ်ပုံ၊ Pass-by-Value သဘောတရားနှင့် Memory Leaks ကာကွယ်ခြင်း (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🧠 အခန်း ၂။ Methods နှင့် JVM Memory Model (Stack vs Heap)

Java တွင် ရေးသားလိုက်သော ကုဒ်များနှင့် Object များသည် ကွန်ပျူတာ၏ RAM ပေါ်တွင် မည်သို့ နေရာယူပြီး အလုပ်လုပ်သည်ကို နားလည်ခြင်းသည် **Junior** နှင့် **Mid/Senior Engineer** တို့အကြား အဓိက ကွာခြားချက် ဖြစ်ပါသည်။ ဤအခန်းတွင် JVM ၏ Memory ဖွဲ့စည်းပုံ၊ Stack Frame Lifecycle နှင့် Java ၏ **Strictly Pass-by-Value** သဘောတရားကို အသေးစိတ် လေ့လာပါမည်။

---

## 🏛️ ၁။ JVM Memory Architecture (Metaspace, Stack & Heap)

JVM စတင် run သည့်အခါ Operating System ထံမှ RAM နေရာ အပိုင်းအခြား တစ်ခုကို တောင်းယူပြီး အောက်ပါ အဓိက ဧရိယာများအဖြစ် ခွဲဝေအသုံးပြုပါသည်:

```
+-------------------------------------------------------------------------------+
|                             JVM RUNTIME DATA AREAS                            |
|                                                                               |
|  +-----------------------------+  +----------------------------------------+  |
|  |       STACK MEMORY          |  |              HEAP MEMORY               |  |
|  |  (Thread-Private / Fast)    |  |     (Shared across all Threads)        |  |
|  |                             |  |                                        |  |
|  |  [Thread 1 Stack]           |  |  +------------------+  +-------------+ |  |
|  |    ├─ main() Frame          |  |  | Young Generation |  | Old (Tenured| |  |
|  |    └─ calculate() Frame     |  |  |  ├─ Eden Space   |  | Generation) | |  |
|  |  [Thread 2 Stack]           |  |  |  ├─ Survivor S0  |  |             | |  |
|  |    └─ run() Frame           |  |  |  └─ Survivor S1  |  |             | |  |
|  |                             |  |  +------------------+  +-------------+ |  |
|  +-----------------------------+  +----------------------------------------+  |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |       METASPACE (Native Memory - Class Metadata, Static Variables)      |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

### (က) Stack Memory (Thread-Private)
- **သဘောသဘာဝ**: Thread တစ်ခုစီအတွက် သီးသန့် Stack တစ်ခုစီ ရှိပါသည်။ Thread-safe ဖြစ်ပြီး အခြား Thread များက ဝင်ရောက်ကြည့်ရှု၍ မရပါ။
- **သိမ်းဆည်းသည့် အရာများ**: Method ခေါ်ယူမှုများ (Stack Frames)၊ Primitive local variables (`int`, `boolean` စသည်) နှင့် Heap ပေါ်ရှိ Objects များကို ညွှန်းသော **Reference Address** များ။
- **အလုပ်လုပ်ပုံ**: **LIFO (Last-In, First-Out)** စနစ်ဖြင့် Method စတင်ခေါ်လျှင် Frame တစ်ခု push လုပ်ပြီး၊ Method ပြီးဆုံးလျှင် ချက်ချင်း pop လုပ်ကာ memory ပြန်လည်ရှင်းလင်းပါသည်။

### (ခ) Heap Memory (Shared across all Threads)
- **သဘောသဘာဝ**: Application တစ်ခုလုံးရှိ Thread အားလုံး မျှဝေသုံးစွဲသော နေရာဖြစ်ပါသည်။
- **သိမ်းဆည်းသည့် အရာများ**: `new` keyword ဖြင့် ဆောက်လုပ်သော Object များအားလုံး (ဥပမာ `new User()`, `new ArrayList()`, Strings)။
- **Memory ရှင်းလင်းမှု**: Developer က ကိုယ်တိုင် free လုပ်စရာမလိုဘဲ JVM ၏ **Garbage Collector (GC)** က မည်သည့် Stack ကမျှ reference မလုပ်တော့သော အသုံးမလိုသည့် Object များကို အလိုအလျောက် သိမ်းဆည်းရှင်းလင်းပေးသည်။

### (ဂ) Metaspace (Native Memory)
- Java 8 မတိုင်မီက PermGen (Permanent Generation) ဟုခေါ်ခဲ့ပြီး Java 8 မှစတင်ကာ OS ၏ Native Memory ပေါ်သို့ ပြောင်းလဲခဲ့သည်။
- Class Definitions များ၊ Bytecode Metadata များ၊ Method Signature များနှင့် `static` Variables များကို သိမ်းဆည်းပါသည်။

---

## 🔬 ၂။ Stack Frame နှင့် Object Reference လက်တွေ့ အလုပ်လုပ်ပုံ

အောက်ပါ ကုဒ်လေးကို လေ့လာပြီး Stack နှင့် Heap ပေါ်တွင် မည်သို့ နေရာယူသည်ကို စစ်ဆေးကြည့်ပါ:

```java
public class MemoryVisualizer {

    public static void main(String[] args) {
        int id = 101;                   // Primitive -> Stack ပေါ်တွင် တိုက်ရိုက်ရှိမည်
        String role = "ADMIN";          // Reference -> Stack တွင် ညွှန်းဆိုပြီး Object သည် Heap တွင် ရှိမည်
        Order order = new Order(5000);  // Object -> Heap တွင် ဆောက်ပြီး 'order' reference က Stack ပေါ်တွင် ရှိမည်
        
        processOrder(order);
    } // main ပြီးဆုံးပါက Stack frame များအားလုံး pop ဖြစ်ပြီး GC က အသုံးမလိုတော့သော Heap Objects များကို ရှင်းထုတ်မည်

    private static void processOrder(Order target) {
        double tax = 0.05;              // Local variable -> processOrder Stack frame ပေါ်တွင် ရှိမည်
        target.applyTax(tax);
    }
}

class Order {
    private double amount;
    public Order(double amount) { this.amount = amount; }
    public void applyTax(double rate) { this.amount += (this.amount * rate); }
}
```

### Memory Trace Diagram:

```
[STACK MEMORY]                                           [HEAP MEMORY]
+------------------------------------+                  +-----------------------------+
| Frame: processOrder()              |                  |                             |
|  - tax = 0.05                      |                  |  Order Object @0x7FFA       |
|  - target = 0x7FFA ───────────────┼─────────────────>|  ├─ amount: 5000 -> 5250    |
+------------------------------------+                  |                             |
| Frame: main()                      |                  |  String "ADMIN" (SCP)       |
|  - id = 101                        |                  |                             |
|  - role = 0x3BC1 ──────────────────┼─────────────────>|                             |
|  - order = 0x7FFA ─────────────────┼─────────────────>|                             |
+------------------------------------+                  +-----------------------------+
```

---

## ⚡ ၃။ Java သည် Strictly "Pass-by-Value" ဖြစ်ခြင်း

Programming လောကတွင် အမေးအများဆုံးနှင့် အထင်အမြင် အမှားဆုံး အကြောင်းအရာမှာ *"Java သည် Pass-by-Reference လား Pass-by-Value လား"* ဟူသော မေးခွန်းဖြစ်ပါသည်။

> 💡 **ရွှေစည်းမျဉ်း (Golden Rule)**: **Java သည် ခြွင်းချက်မရှိ (STRICTLY) Pass-by-Value သာ ဖြစ်ပါသည်။**
> Primitive Type ဖြစ်ပါက **တန်ဖိုး အစစ်အမှန် (Bit pattern)** ကို ကူးယူပေးပို့ပြီး၊ Object ဖြစ်ပါက **Object ၏ Reference Address (Pointer value)** ကို ကူးယူပေးပို့ခြင်း ဖြစ်သည်။

### သက်သေပြချက် ၁: Primitives များကို Pass လုပ်ခြင်း

```java
public class PrimitivePassTest {
    public static void main(String[] args) {
        int balance = 1000;
        deductMoney(balance);
        System.out.println("Main Balance: " + balance); // အဖြေမှာ 1000 သာ ဖြစ်မည်!
    }

    public static void deductMoney(int balance) {
        balance = balance - 200; // local variable အသစ်ထဲတွင်သာ ပြောင်းလဲခြင်းဖြစ်သည်
    }
}
```

### သက်သေပြချက် ၂: Object References များကို Pass လုပ်ခြင်း (Critical Concept!)

```java
public class ObjectPassTest {
    public static void main(String[] args) {
        Customer cust = new Customer("U Ba");
        
        // ကိစ္စ ၁: Object အတွင်းရှိ field ကို ပြောင်းလဲခြင်း
        modifyName(cust);
        System.out.println("Customer Name 1: " + cust.name); // "Daw Hla" ဖြစ်သွားမည်! (တူညီသော Heap နေရာကို ညွှန်းသောကြောင့်)

        // ကိစ္စ ၂: Reference အသစ်တစ်ခု ပြန်လည် Reassign လုပ်ခြင်း
        reassignCustomer(cust);
        System.out.println("Customer Name 2: " + cust.name); // "Daw Hla" သာ ဆက်ရှိနေမည်! "Ko Ko" မဖြစ်သွားပါ!
    }

    public static void modifyName(Customer c) {
        // c သည် cust ၏ address value ကို copy ရရှိထားသဖြင့် Heap ပေါ်ရှိ မူရင်း Object ၏ Data ကို ပြင်ဆင်နိုင်သည်
        c.name = "Daw Hla";
    }

    public static void reassignCustomer(Customer c) {
        // c ထဲသို့ Object အသစ်တစ်ခု၏ Address အသစ်ကို ထည့်လိုက်ခြင်း ဖြစ်သည်။
        // main() method ထဲမှ မူရင်း 'cust' reference ကို မထိခိုက်ပါ!
        c = new Customer("Ko Ko");
    }
}

class Customer {
    String name;
    Customer(String name) { this.name = name; }
}
```

---

## 🛠️ ၄။ Method Overloading နှင့် Static Methods

### (က) Method Overloading Rules
Method တစ်ခုတည်းကို Parameter ပုံစံအမျိုးမျိုးဖြင့် ပြန်လည်ကြေညာခြင်း ဖြစ်သည်။
- **လိုအပ်ချက်**: Method Name တူရမည်။ **Parameter List (Number, Type, Order)** မတူရပါ။
- **အရေးကြီးချက်**: Return type တစ်ခုတည်း ကွဲပြားရုံဖြင့် Overload မလုပ်နိုင်ပါ (Compiler error တက်ပါမည်)။

```java
public class PaymentCalculator {

    // 1. အခြေခံ ရှင်းလင်းသော အခကြေးငွေ
    public double calculateFee(double amount) {
        return amount * 0.02;
    }

    // 2. Overloaded: ရာခိုင်နှုန်းနှင့် အပိုကြေး ပါဝင်သော ပုံစံ
    public double calculateFee(double amount, double customRate, double fixedFee) {
        return (amount * customRate) + fixedFee;
    }

    // 3. Overloaded: VIP Discount code ပါဝင်သော ပုံစံ
    public double calculateFee(double amount, String promoCode) {
        if ("VIP50".equals(promoCode)) {
            return (amount * 0.02) * 0.5;
        }
        return amount * 0.02;
    }
}
```

### (ခ) `static` Method နှင့် Variable များ အသုံးပြုပုံ
- `static` အဖွဲ့ဝင်များသည် Class တစ်ခုလုံးနှင့် သက်ဆိုင်ပြီး Object အသစ် (`new`) ဆောက်စရာမလိုဘဲ Class name ဖြင့် တိုက်ရိုက်ခေါ်သုံးနိုင်ပါသည်။
- **ဘယ်အချိန်မှာ Static သုံးမလဲ**:
  - Utility/Helper Methods များ (ဥပမာ `Math.max()`, `StringUtils.isEmpty()`)
  - Shared Constants များ (ဥပမာ `public static final int MAX_RETRY_COUNT = 3;`)
  - Factory Methods များ (ဥပမာ `LocalDate.now()`)

```java
public class AppConfig {
    public static final String API_BASE_URL = "https://api.gateway.internal";
    private static int requestCounter = 0;

    public static synchronized void incrementRequests() {
        requestCounter++;
    }

    public static int getRequestCount() {
        return requestCounter;
    }
}
```

---

## 🚨 ၅။ Senior Level: Production Memory Issues (OOM vs StackOverflow)

လုပ်ငန်းခွင်တွင် တွေ့ကြုံရမည့် Memory Error ကြီး ၂ မျိုးရှိပါသည်:

| Error Type | အဓိပ္ပာယ် | ဖြစ်ပွားရသည့် အကြောင်းရင်း (Root Cause) | ဖြေရှင်းနည်း (Remedy) |
| :--- | :--- | :--- | :--- |
| **`StackOverflowError`** | Stack Memory ပြည့်သွားခြင်း | အဆုံးမသတ်သော Recursive method ခေါ်ယူမှုများ (Infinite Recursion) | Base condition သေချာထည့်ရန်၊ Loop သို့ ပြောင်းရန်၊ `-Xss` အရွယ်အစား တိုးရန် |
| **`OutOfMemoryError` (OOM)**: *Java heap space* | Heap Memory ပေါ်တွင် Object အသစ်ဆောက်ရန် နေရာမကျန်တော့ခြင်း | Memory Leak ဖြစ်ခြင်း (ဥပမာ Static List ထဲသို့ Object များ မရပ်မနား ထည့်မိခြင်း၊ DB Query မှ Record သိန်းချီ တပြိုင်နက် ဆွဲတင်ခြင်း) | Heap Dump (`.hprof`) ထုတ်ယူ၍ Memory Profiler (VisualVM/Eclipse MAT) ဖြင့် ခွဲခြမ်းစိပ်ဖြာခြင်း၊ DB Pagination သုံးခြင်း |

### Static Memory Leak ဖြစ်ပွားပုံ ဥပမာ (ဆင်ခြင်ရန်):

```java
public class CacheMemoryLeak {
    // ⚠️ WARNING: static collection ထဲသို့ မလိုအပ်ဘဲ cache သိမ်းပြီး မရှင်းပါက
    // Application တစ်ခုလုံး သက်တမ်းတစ်လျှောက် GC က ဘယ်တော့မှ ရှင်းထုတ်၍ မရတော့ပါ!
    private static final List<byte[]> LEAKY_CACHE = new ArrayList<>();

    public void processData() {
        // 10MB chunk ကို static list ထဲ အမြဲ push နေမိပါက မကြာမီ java.lang.OutOfMemoryError တက်ပါမည်
        LEAKY_CACHE.add(new byte[10 * 1024 * 1024]);
    }
}
```

---

## 🎯 အနှစ်ချုပ်နှင့် အဓိက မှတ်သားဖွယ်ရာများ

1. Local variables များနှင့် Method Execution များသည် **Stack** ပေါ်တွင် လျင်မြန်စွာ အလုပ်လုပ်ပြီး Method ပြီးဆုံးပါက ချက်ချင်း ပျက်ပြယ်သည်။
2. Object အားလုံးသည် **Heap** ပေါ်တွင် တည်ရှိပြီး Garbage Collector က Memory ကို စီမံပေးသည်။
3. Java သည် **Strictly Pass-by-Value** ဖြစ်သည်။ Primitive ဖြစ်ပါက တန်ဖိုးကို copy လုပ်ပေးပြီး၊ Object ဖြစ်ပါက Memory Reference Address ကို copy လုပ်ပေးသည်။
4. Static reference များသည် GC ၏ရှင်းလင်းခြင်းကို ခံရခဲသဖြင့် Large Object များကို `static` field များတွင် မလိုအပ်ဘဲ သိမ်းဆည်းခြင်းကို ရှောင်ကြဉ်ပါ။
