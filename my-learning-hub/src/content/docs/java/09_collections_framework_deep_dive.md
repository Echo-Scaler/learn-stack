---
title: "09. Collections Framework Deep Dive"
description: "Java Collections Framework ဖွဲ့စည်းပုံ၊ ArrayList vs LinkedList၊ HashMap Bucket Internals၊ HashSet နှင့် equals() & hashCode() Contract (မြန်မာဘာသာ အသေးစိတ်)"
---

# 📚 အခန်း ၉။ Java Collections Framework Internals

Java Collections Framework သည် ဒေတာများကို Memory ပေါ်တွင် အစုအဖွဲ့လိုက် စနစ်တကျ သိုလှောင်ကိုင်တွယ်ရန် ပြုလုပ်ထားသော Core Data Structures Architecture ဖြစ်ပါသည်။ ဤအခန်းတွင် အသုံးအများဆုံး Collection များ၏ **အတွင်းပိုင်း အလုပ်လုပ်ပုံ (Internals)** နှင့် Time Complexity များကို Mid/Senior အဆင့် ခွဲခြမ်းစိပ်ဖြာ လေ့လာပါမည်။

---

## 🏛️ ၁။ Collections Framework Hierarchy Overview

```
                          java.lang.Iterable
                                   │
                         java.util.Collection
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
      java.util.List         java.util.Set          java.util.Queue
     (Ordered, Index)       (Unique Items)         (FIFO, Deque)
      ├─ ArrayList           ├─ HashSet             ├─ ArrayDeque
      ├─ LinkedList          ├─ LinkedHashSet       └─ PriorityQueue
      └─ Vector              └─ TreeSet

                           java.util.Map
                       (Key-Value Pairs, No Iterable)
                        ├─ HashMap
                        ├─ LinkedHashMap
                        ├─ TreeMap
                        └─ ConcurrentHashMap
```

---

## 📋 ၂။ List Deep Dive: `ArrayList` vs `LinkedList`

| အချက်အလက် (Feature) | `ArrayList` (Dynamic Array) | `LinkedList` (Doubly Linked List) |
| :--- | :--- | :--- |
| **အတွင်းပိုင်း တည်ဆောက်ပုံ** | Resizable Object Array (`Object[] elementData`) | Node Pointers (`prev`, `data`, `next`) |
| **Index ဖြင့် ရှာဖွေခြင်း (`get(i)`)** | **$O(1)$ အလွန်မြန်သည်** (Direct memory offset) | **$O(N)$ နှေးသည်** (ခေါင်း သို့မဟုတ် အမြီးမှ လျှောက်ရသည်) |
| **အလယ်တွင် ဒေတာထည့်/ဖြုတ်ခြင်း** | **$O(N)$** (ကျန်ရှိသော Array အစိတ်အပိုင်းများကို shift လုပ်ရသည်) | **$O(1)$** (Node reference ပေးထားပါက Pointer ချိတ်ဆက်ရုံသာ) |
| **Memory အသုံးပြုမှု** | နည်းပါးသည် (Data သာ သိမ်းသည်) | များပြားသည် (Node တစ်ခုစီအတွက် Pointer နေရာ ပိုယူသည်) |
| **တိုးချဲ့မှု အချိုး (Resize)** | ပြည့်သွားပါက 1.5 ဆ တိုးသည် (`oldCapacity + (oldCapacity >> 1)`) | Limit မရှိ (RAM ရှိသရွေ့ Node အသစ် ဆက်သွားသည်) |

> 🏆 **Senior Production Advice**: လက်တွေ့ လုပ်ငန်းခွင် စနစ်များ၏ **၉၉% တွင် `ArrayList` ကိုသာ ရွေးချယ် အသုံးပြုပါ**။ Modern CPU Cache Locality ကြောင့် Array သည် Linked List ထက် များစွာ ပိုမိုမြန်ဆန်ပါသည်။ ဒေတာအရေအတွက် ကြိုတင်သိရှိပါက `new ArrayList<>(1000)` ဟု Initial Capacity ပေးခြင်းဖြင့် Resizing Overhead ကို ကာကွယ်နိုင်ပါသည်။

---

## 🗺️ ၃။ `HashMap` Bucket Internals (အရေးကြီးဆုံး အပိုင်း)

`HashMap` သည် Key-Value ပုံစံဖြင့် ဒေတာများကို $O(1)$ ပျမ်းမျှ အမြန်နှုန်းဖြင့် သိမ်းဆည်းပေးသော Data Structure ဖြစ်ပါသည်။

```
HashMap Bucket Array: table[index]
Index 0:  [null]
Index 1:  [Node: K1, V1] ──> [Node: K2, V2] (LinkedList Chaining)
Index 2:  [TreeNode: Red-Black Tree] (Java 8+ Bucket > 8 Nodes)
Index 3:  [null]
...
Index 15: [Node: K15, V15]
```

### (က) Key တစ်ခု ထည့်သွင်းခြင်း အဆင့်ဆင့် (`put(K, V)`)
1. **Hash Calculation**: Key ၏ `hashCode()` ကို ယူ၍ Bit shifting (`h ^ (h >>> 16)`) ဖြင့် ပြန့်ပြူးစေသည်။
2. **Bucket Index ရှာဖွေခြင်း**: `index = (n - 1) & hash` (Array အရွယ်အစားဖြင့် Mask ပြုလုပ်သည်)။
3. **Collision ဖြစ်ပေါ်ခြင်း**: ထို Bucket Index တွင် တန်ဖိုး ရှိနှင့်ပြီးဖြစ်ပါက:
   - Key တူမတူကို `equals()` ဖြင့် စစ်ဆေးသည်။ တူပါက Value အသစ်ဖြင့် **Replace** လုပ်သည်။
   - မတူပါက Linked List အမြီးတွင် Node အသစ် **Chaining** ချိတ်ဆက်သည်။
4. **Java 8 Treeification**: Bucket တစ်ခုတည်းတွင် Node အရေအတွက် **၈ ခု (TREEIFY_THRESHOLD = 8)** ထက် ကျော်လွန်သွားပါက Search Time $O(N)$ မဖြစ်စေရန် **Red-Black Tree ($O(\log N)$)** သို့ အလိုအလျောက် ပြောင်းလဲပစ်သည်။

---

## ⚖️ ၄။ The Sacred `equals()` နှင့် `hashCode()` Contract

`HashMap` သို့မဟုတ် `HashSet` တွင် Custom Class တစ်ခုကို Key အဖြစ် သုံးလိုပါက အောက်ပါ စည်းမျဉ်းကို အတိအကျ လိုက်နာရမည်:

> 💡 **Contract Rules**:
> 1. အကယ်၍ Object ၂ ခုသည် `obj1.equals(obj2) == true` ဖြစ်ပါက၊ ၎င်းတို့၏ `hashCode()` သည်လည်း **မဖြစ်မနေ တူညီရမည်**။
> 2. အကယ်၍ `hashCode()` တူညီရုံဖြင့် `equals()` သည် true ဖြစ်ရန် မလိုပါ (Hash Collision ဟုခေါ်သည်)။
> 3. `equals()` ကို Override လုပ်ပါက `hashCode()` ကိုလည်း **မဖြစ်မနေ Override ပြုလုပ်ရမည်**!

### မလိုက်နာပါက ဖြစ်ပေါ်မည့် အမှားနမူနာ:

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class EmployeeKey {
    private final String id;
    private final String name;

    public EmployeeKey(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // ✅ equals() နှင့် hashCode() ကို တပြိုင်နက် မှန်ကန်စွာ Override လုပ်ခြင်း
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmployeeKey that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
```

---

## 🔒 ၅။ Thread-Safe Collections: `ConcurrentHashMap`

Multi-threaded environment တွင် သာမန် `HashMap` ကို သုံးပါက Infinite Loop သို့မဟုတ် Data Loss ဖြစ်နိုင်ပါသည်။ `Collections.synchronizedMap` သည် Map တစ်ခုလုံးကို Lock ချသဖြင့် နှေးကွေးပါသည်။ 

**`ConcurrentHashMap`** သည် **Segment Locking / Node-Level Synchronization နှင့် CAS (Compare-And-Swap)** နည်းပညာကို အသုံးပြုထားသဖြင့် Thread အများအပြား ပြိုင်တူ ဖတ်/ရေး လုပ်ဆောင်နိုင်သော အဆင့်မြင့်ဆုံး Production Map ဖြစ်ပါသည်။

---

## 🎯 အနှစ်ချုပ်

1. အများစုသော List လိုအပ်ချက်များအတွက် **`ArrayList`** ကို အသုံးပြုပါ။
2. Key-Value တွဲစပ်ရန်အတွက် **`HashMap`** ကို အသုံးပြုပြီး Multi-threading အတွက် **`ConcurrentHashMap`** ကို ရွေးချယ်ပါ။
3. Custom Object များကို Map Key သို့မဟုတ် Set တွင် သုံးမည်ဆိုပါက **`equals()` နှင့် `hashCode()`** ကို မဖြစ်မနေ စနစ်တကျ Override ပြုလုပ်ပါ။
