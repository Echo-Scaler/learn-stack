---
title: "06. Asynchronous JavaScript"
description: "1. [Synchronous vs Asynchronous Programming မိတ်ဆက်](#၁-synchronous-vs-asynchronous)"
---

## 🚀 သင်ခန်းစာ (၆) - Asynchronous JavaScript၊ Promises နှင့် Event Loop
### (Lesson 6: Asynchronous Programming, Promises, Async/Await & Event Loop Mechanics)

---

## 📌 မာတိကာ (Table of Contents)
1. [Synchronous vs Asynchronous Programming မိတ်ဆက်](#၁-synchronous-vs-asynchronous)
2. [Promises Architecture နှင့် States (၃) ရပ်](#၂-promises-architecture)
   - [Promise Chaining နှင့် Anti-patterns ရှောင်ရှားနည်း](#promise-chaining)
   - [Unhandled Promise Rejection ကိုင်တွယ်ပုံ](#unhandled-rejections)
3. [Modern `async` / `await` နှင့် အမှားရှာဖွေခြင်း](#၃-modern-async--await)
   - [Sequential `await` vs Parallel Execution နှိုင်းယှဉ်ချက်](#sequential-vs-parallel)
4. [Promise Combinators အပြည့်အစုံ နှိုင်းယှဉ်ချက် ဇယား (၄ မျိုး)](#၄-promise-combinators-ဇယား)
   - [`Promise.all()` vs `Promise.allSettled()`](#all-vs-allsettled)
   - [`Promise.race()` vs `Promise.any()`](#race-vs-any)
5. [Event Loop၊ Microtasks နှင့် Macrotasks အသေးစိတ် စီးဆင်းမှု Diagram](#၅-event-loop-စီးဆင်းမှု)
6. [လုပ်ငန်းခွင်သုံး Concurrency Rate Limiter (တစ်ပြိုင်နက် N ခုသာ Run ရန်)](#၆-concurrency-rate-limiter)

---

## ၁။ Synchronous vs Asynchronous

JavaScript သည် Browser main thread ပေါ်တွင် Single-Threaded အဖြစ်သာ အလုပ်လုပ်သည်။ ထို့ကြောင့် အချိန်ကြာမြင့်သော ကိစ္စများ (HTTP Fetch, File Reading, Timer) ကို Asynchronous Non-blocking စနစ်ဖြင့် Web APIs ဆီသို့ လွှဲပြောင်းပေးရသည်။

---

## ၂။ Promises Architecture

Promise တစ်ခုတွင် အောက်ပါ State (၃) မျိုးသာ ရှိပြီး တစ်ကြိမ် Settled ဖြစ်သွားပါက ပြန်လည် မပြောင်းလဲနိုင်ပါ (Immutable):
1. **Pending**: စတင်ဆောင်ရွက်ဆဲ ကာလ။
2. **Fulfilled**: အောင်မြင်ပြီး ရလဒ် ထွက်ပေါ်လာခြင်း (`resolve(value)`)။
3. **Rejected**: အမှားတစ်ခုခုကြောင့် ကျရှုံးသွားခြင်း (`reject(error)`)။

```javascript
// Promise Constructor Anti-pattern:
// ❌ မလိုအပ်ဘဲ Promise အသစ်ထဲ ထပ်ထည့်ခြင်း (Promise Wrapping):
function fetchBad(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then(res => resolve(res)).catch(err => reject(err));
  });
}

// ✅ သန့်ရှင်းသော ပုံစံ: fetch သည် promise ဖြစ်ပြီးသားဖြစ်၍ တိုက်ရိုက် return လုပ်ပါ
function fetchGood(url) {
  return fetch(url);
}
```

### Unhandled Promise Rejection ကာကွယ်ခြင်း:
အကယ်၍ `.catch()` မရေးမိသော Promise Error တစ်ခုခု ဖြစ်ပေါ်ပါက Browser သို့မဟုတ် Node.js တွင် Global Handler ဖြင့် ဖမ်းယူစစ်ဆေးနိုင်သည်:

```javascript
window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Unhandled Promise Rejection Alert:", event.reason);
  // Sentry / Bugsnag Error Tracking Service သို့ လှမ်းပို့နိုင်သည်
});
```

---

## ၃။ Modern `async` / `await`

### Sequential vs Parallel Execution (အရေးကြီးသော လုပ်ငန်းခွင် စွမ်းဆောင်ရည်)

Loop အတွင်း `await` ရေးသားပုံ လွဲမှားပါက Performance အဆမတန် နှေးကွေးသွားတတ်သည်။

```javascript
const userIds = [1, 2, 3, 4, 5];

// ❌ နှေးကွေးသော ပုံစံ (Sequential): တစ်ခုပြီးမှ တစ်ခု စောင့်၍ ၅ စက္ကန့် ကြာမည်
async function fetchUsersSlow() {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUserData(id); // စက္ကန့်တိုင်း ရပ်စောင့်နေသည်
    results.push(user);
  }
  return results;
}

// ✅ လျင်မြန်သော ပုံစံ (Parallel): ၅ ခုစလုံး တစ်ပြိုင်နက် စတင်ပြီး ၁ စက္ကန့်သာ ကြာမည်
async function fetchUsersFast() {
  const promises = userIds.map((id) => fetchUserData(id));
  return await Promise.all(promises);
}
```

---

## ၄။ Promise Combinators ဇယား (၄ မျိုး)

| Combinator | Behavior (အလုပ်လုပ်ပုံ) | Short-circuit (ရပ်တန့်သွားပုံ) | အသုံးပြုသင့်သည့် နေရာ |
| :--- | :--- | :--- | :--- |
| **`Promise.all()`** | အားလုံး အောင်မြင်မှ ရလဒ် ပေးသည် | **တစ်ခုခု Reject ဖြစ်ပါက ချက်ချင်း ရပ်သည်** | တစ်ခုနှင့်တစ်ခု အမှီသဟဲပြုနေသော API များ |
| **`Promise.allSettled()`** | အားလုံး ပြီးဆုံးသည်အထိ စောင့်သည် (Success ရော Error ရော ပါသည်) | မည်သည့်အခါမျှ Short-circuit မဖြစ်ပါ | Task အချို့ ပျက်သော်လည်း ကျန်တာ ဆက်လုပ်မည့် Background Sync များ |
| **`Promise.race()`** | အမြန်ဆုံး ပြီးမြောက်သော ရလဒ် (Success သို့မဟုတ် Error) ကို ယူသည် | ပထမဆုံး တစ်ခု ရောက်သည်နှင့် ရပ်သည် | Request Timeout သတ်မှတ်ခြင်း |
| **`Promise.any()`** | အမြန်ဆုံး အောင်မြင်သော (Success) တစ်ခုတည်းကိုသာ ယူသည် | အားလုံး ကျရှုံးမှသာ `AggregateError` တက်သည် | Backup CDN များထဲမှ အမြန်ဆုံး ရရာဆွဲယူခြင်း |

```javascript
// Promise.any ဥပမာ - အမြန်ဆုံး အဆင်ပြေရာ CDN Server မှ ပုံဆွဲယူခြင်း
const primaryCdn = fetch("https://cdn1.example.com/logo.png");
const backupCdn = fetch("https://cdn2.example.com/logo.png");

try {
  const fastestResponse = await Promise.any([primaryCdn, backupCdn]);
  console.log("Image loaded from fastest CDN");
} catch (aggregateError) {
  console.error("All CDNs failed:", aggregateError.errors);
}
```

---

## ၅။ Event Loop စီးဆင်းမှု

```
┌────────────────────────────────────────────────────────┐
│                      EVENT LOOP                        │
│                                                        │
│  1. Synchronous Code in Call Stack Run ကုန်စင်သည်      │
│                            │                           │
│                            ▼                           │
│  2. Microtask Queue ကို စစ်ဆေးသည်                     │
│     - Promises (.then / .catch / await)                │
│     - queueMicrotask()                                 │
│     (Queue အလွတ်ဖြစ်သည်အထိ အကုန် ရှင်းထုတ်သည်)       │
│                            │                           │
│                            ▼                           │
│  3. requestAnimationFrame (Screen Repaint မတိုင်မီ)     │
│                            │                           │
│                            ▼                           │
│  4. Macrotask Queue မှ Task တစ်ခုတည်းကို ယူ run သည်   │
│     - setTimeout / setInterval                         │
│     - I/O & DOM Event Callbacks                        │
│                            │                           │
│                            ▼                           │
│  ပြန်လည် အဆင့် ၁ သို့ ကွင်းဆက်လှည့်လည်သည် (Loop)      │
└────────────────────────────────────────────────────────┘
```

---

## ၆။ Concurrency Rate Limiter

တစ်ပြိုင်နက် API Request အခု ၁၀၀ တောင်းလိုက်ပါက Server က IP Block လုပ်ခြင်း သို့မဟုတ် Browser က Network Throttling လုပ်ခြင်း ခံရနိုင်သည်။ **တစ်ကြိမ်လျှင် အများဆုံး Concurrency N ခုသာ Run စေသော Rate Limiter Engine:**

```javascript
class PromisePool {
  constructor(concurrencyLimit = 3) {
    this.limit = concurrencyLimit;
    this.runningCount = 0;
    this.queue = [];
  }

  run(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.next();
    });
  }

  next() {
    if (this.runningCount >= this.limit || this.queue.length === 0) {
      return;
    }

    const { taskFn, resolve, reject } = this.queue.shift();
    this.runningCount++;

    taskFn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.runningCount--;
        this.next(); // နေရာလွတ်လာပါက နောက် task တစ်ခုကို ဆက်ဆွဲယူသည်
      });
  }
}

// စမ်းသပ် အသုံးပြုပုံ: တစ်ပြိုင်နက် အများဆုံး ၂ ခုသာ run ခွင့်ပြုမည်
const pool = new PromisePool(2);

const urls = ["URL_1", "URL_2", "URL_3", "URL_4", "URL_5"];

urls.forEach((url) => {
  pool.run(async () => {
    console.log(`⏳ Starting: ${url}`);
    await new Promise((r) => setTimeout(r, 1500)); // Simulate async API call
    console.log(`✅ Done: ${url}`);
  });
});
```
