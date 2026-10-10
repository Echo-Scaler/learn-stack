---
title: "12. Multithreading & High Concurrency"
description: "Thread Lifecycle၊ Race Conditions၊ volatile vs Atomic vs synchronized၊ ExecutorService Thread Pools၊ CompletableFuture နှင့် Deadlock ကာကွယ်ခြင်း (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🚀 အခန်း ၁၂။ Multithreading နှင့် High Concurrency အင်ဂျင်နီယာပညာ

ခေတ်သစ် Enterprise Backend Application များ (ဥပမာ E-commerce Flash Sales၊ ဘဏ်ငွေလွှဲစနစ်များ) သည် သုံးစွဲသူ ထောင်ပေါင်းများစွာ၏ Request များကို တပြိုင်နက်တည်း (**Concurrently**) ဝန်ဆောင်မှု ပေးနိုင်ရပါမည်။ Multi-threading ကို မှန်ကန်စွာ မကိုင်တွယ်နိုင်ပါက **Race Condition**, **Deadlock** နှင့် **Data Corruption** ကဲ့သို့သော ကြီးမားသည့် ပြဿနာများ ဖြစ်ပေါ်တတ်ပါသည်။

---

## 🏛️ ၁။ Process vs Thread နှင့် Thread-Safety အခြေခံ

- **Process**: OS မှ သီးခြား ခွဲဝေပေးထားသော Memory Space ပိုင်ဆိုင်သည့် Program တစ်ခု (ဥပမာ JVM တစ်ခုလုံး)။
- **Thread**: Process တစ်ခုအတွင်းရှိ အသေးငယ်ဆုံး Execution Unit ဖြစ်ပြီး၊ **Heap Memory ကို အတူတူ မျှဝေသုံးစွဲသော်လည်း သီးခြား Stack Memory ပိုင်ဆိုင်သည်**။

```
+-------------------------------------------------------------+
| JVM PROCESS (Shared Heap Memory)                            |
|                                                             |
|   Shared Data: UserAccount balance = 5000                   |
|                                                             |
|  [Thread 1] (Stack 1)           [Thread 2] (Stack 2)        |
|    └─ withdraw(1000)              └─ withdraw(1000)         |
|         │                              │                    |
|         └───> [RACE CONDITION ON BALANCE!] <───┘            |
+-------------------------------------------------------------+
```

---

## 💥 ၂။ Race Condition ပြဿနာနှင့် ဖြေရှင်းချက် (၃) မျိုး

အောက်ပါ ကုဒ်တွင် `count++` သည် တစ်ချက်တည်း ပြီးသော Atomic operation မဟုတ်ဘဲ (၁) Read (၂) Modify (၃) Write ဟူ၍ အဆင့် ၃ ဆင့် ရှိသောကြောင့် Thread ၂ ခု ပြိုင်တက်ပါက Data ပျောက်ဆုံးပါသည်:

```java
// ❌ UNSAFE: Race Condition ဖြစ်နိုင်သော Counter
public class UnsafeCounter {
    private int count = 0;
    public void increment() { count++; } // Non-thread-safe!
}
```

### ဖြေရှင်းနည်း (က): `synchronized` Keyword (Intrinsic Monitor Lock)
တစ်ကြိမ်လျှင် Thread တစ်ခုတည်းသာ ဝင်ရောက်ခွင့်ပြုသော Lock စနစ်:
```java
public class SynchronizedCounter {
    private int count = 0;
    public synchronized void increment() {
        count++; // Thread-safe
    }
}
```

### ဖြေရှင်းနည်း (ခ): `AtomicInteger` (Lock-Free High Performance)
Hardware CPU ၏ **Compare-And-Swap (CAS)** နည်းပညာကို သုံးထားသဖြင့် Lock မခတ်ဘဲ အလွန် လျင်မြန်စွာ အလုပ်လုပ်သည်:
```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private final AtomicInteger count = new AtomicInteger(0);
    public void increment() {
        count.incrementAndGet(); // Thread-safe & High Performance
    }
}
```

### ဖြေရှင်းနည်း (ဂ): `volatile` Keyword ၏ အခန်းကဏ္ဍ
CPU Cache Memory နှင့် Main RAM အကြား Data မညီညွတ်မှုကို ကာကွယ်ပေးသည် (**Memory Visibility** ကို အာမခံသည်)။ သို့သော် Atomicity ကို အာမခံချက် မပေးသဖြင့် Flag တန်ဖိုးများတွင်သာ သုံးသင့်သည်:
```java
private volatile boolean isServerRunning = true; // Visibility guarantee across all threads
```

---

## 🏭 ၃။ Modern Concurrency: `ExecutorService` နှင့် Thread Pools

Production Web Server များတွင် `new Thread().start()` ဟု ကိုယ်တိုင် ဘယ်သောအခါမျှ မဆောက်ရပါ။ Thread အသစ် တစ်ခုစီသည် OS Memory (Stack 1MB ဝန်းကျင်) စားသုံးသဖြင့် Request များလာပါက Server ပြိုလဲသွားပါမည်။ **Thread Pool** ကို အသုံးပြုရပါသည်:

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadPoolDemo {
    public static void main(String[] args) throws InterruptedException {
        // CPU Core အရေအတွက်နှင့် ကိုက်ညီသော Worker Thread ၄ ခုသာ ပုံသေထားရှိသော Pool
        ExecutorService pool = Executors.newFixedThreadPool(4);

        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            pool.submit(() -> {
                String threadName = Thread.currentThread().getName();
                System.out.println("Processing Task #" + taskId + " on " + threadName);
                try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            });
        }

        // Graceful Shutdown Sequence:
        pool.shutdown(); // Task အသစ် လက်မခံတော့ပါ
        if (!pool.awaitTermination(5, TimeUnit.SECONDS)) {
            pool.shutdownNow(); // အချိန်ကျော်လွန်ပါက အတင်းအကျပ် ရပ်တန့်မည်
        }
        System.out.println("All tasks completed gracefully.");
    }
}
```

---

## ⚡ ၄။ Asynchronous Non-Blocking: `CompletableFuture`

ခေတ်မီ Microservices များတွင် အခြား Service များထံမှ Data များကို Non-blocking ပုံစံဖြင့် တပြိုင်နက် ခေါ်ယူပေါင်းစပ်ရန် `CompletableFuture` ကို အသုံးပြုပါသည်:

```java
import java.util.concurrent.CompletableFuture;

public class AsyncAggregationDemo {
    public static void main(String[] args) {
        // Step 1: User Profile ကို ဆွဲယူခြင်း (Async)
        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> {
            simulateDelay(300);
            return "User: Kyaw Kyaw";
        });

        // Step 2: Order History ကို ပြိုင်တူ ဆွဲယူခြင်း (Async)
        CompletableFuture<String> ordersFuture = CompletableFuture.supplyAsync(() -> {
            simulateDelay(400);
            return "Orders: [iPhone, Mac, AirPods]";
        });

        // Step 3: API ၂ ခုစလုံး၏ ရလဒ် ထွက်လာချိန်တွင် ပေါင်းစပ်ထုတ်ယူခြင်း
        CompletableFuture<String> dashboardFuture = userFuture.thenCombine(ordersFuture, 
            (user, orders) -> user + " | " + orders);

        System.out.println("Combined Dashboard: " + dashboardFuture.join());
    }

    private static void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }
}
```

---

## 💀 ၅။ Deadlock ဆိုသည်မှာ အဘယ်နည်း? (ကာကွယ်နည်း အကြံပြုချက်)

**Deadlock** သည် Thread ၂ ခုက တစ်ဦးပိုင်ဆိုင်ထားသော Lock ကို အပြန်အလှန် စောင့်ဆိုင်းနေရင်း ထာဝရ ရပ်တန့်သွားသော (Freeze) အခြေအနေ ဖြစ်သည်:

```
Thread A: Holds Lock 1 ──> Wants Lock 2 (Blocked!)
                              ▲
Thread B: Holds Lock 2 ──> Wants Lock 1 (Blocked!)
```

### Deadlock ကာကွယ်ရန် နည်းလမ်းများ:
1. **Lock Ordering**: Application တစ်ခုလုံးတွင် Lock ရယူသော အစဉ်အတိုင်းအတာ (Lock Order) ကို တညီတညွတ်တည်း ဖြစ်စေရန် သတ်မှတ်ပါ။ (ဥပမာ အမြဲတမ်း Lock A ယူပြီးမှ Lock B ယူစေခြင်း)။
2. **`ReentrantLock.tryLock()` with Timeout**: အဆုံးမဲ့ စောင့်ဆိုင်းနေမည့်အစား သတ်မှတ်ထားသော စက္ကန့်အတွင်း Lock မရပါက လက်လျှော့ပြီး Exception ပြန်ပေးစေခြင်း။

---

## 🎯 အနှစ်ချုပ်

1. Thread များသည် Heap Memory ကို မျှဝေသုံးစွဲသောကြောင့် Shared Mutable Data များအတွက် **Thread Safety** ကို အထူး သတိပြုရမည်။
2. အခြေခံ Counter များအတွက် Lock မလိုဘဲ မြန်ဆန်သော **`AtomicInteger`** ကို သုံးပါ။
3. Thread များကို လက်ဖြင့် မဆောက်ဘဲ **`ExecutorService` Thread Pools** ဖြင့် စနစ်တကျ ထိန်းချုပ်ပါ။
4. Non-blocking Asynchronous Tasks များအတွက် **`CompletableFuture`** ကို အသုံးပြုပါ။
