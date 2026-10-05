---
title: "04. Scope, Closures and Hoisting"
description: "1. [Lexical Environment နှင့် Scope Chain အတွင်းရေး ဖွဲ့စည်းပုံ](#၁-lexical-environment-နှင့်-scope-chain)"
---

## 🚀 သင်ခန်းစာ (၄) - Scopes, Hoisting နှင့် Closures အတွင်းရေး သဘောတရား
### (Lesson 4: Lexical Environment, Hoisting Mechanics & Advanced Closures Architecture)

---

## 📌 မာတိကာ (Table of Contents)
1. [Lexical Environment နှင့် Scope Chain အတွင်းရေး ဖွဲ့စည်းပုံ](#၁-lexical-environment-နှင့်-scope-chain)
2. [Hoisting စည်းမျဉ်းများနှင့် ဦးစားပေး အဆင့်ဆင့်](#၂-hoisting-စည်းမျဉ်းများ)
   - [Function Declarations vs Variable Declarations Precedence](#function-vs-variable-precedence)
3. [Closures ဆိုတာဘာလဲ? (Memory Representation & Garbage Collection)](#၃-closures-ဆိုတာဘာလဲ)
4. [Closures ၏ လုပ်ငန်းခွင်သုံး Enterprise Patterns](#၄-closures-၏-လုပ်ငန်းခွင်သုံး-patterns)
   - [Revealing Module Pattern (IIFE Encapsulation)](#revealing-module-pattern)
   - [Stateful Event Handlers](#stateful-event-handlers)
   - [Memoization Cache နှင့် Performance Tuning](#memoization-cache)
5. [Custom Pub/Sub Event Emitter Pattern (Closures အခြေခံ)](#၅-custom-event-emitter-pattern)
6. [Closures နှင့် Memory Leaks ကာကွယ်ရေး လက်စွဲ](#၆-closures-နှင့်-memory-leaks-ကာကွယ်ရေး)

---

## ၁။ Lexical Environment နှင့် Scope Chain

JavaScript Engine တွင် Scope တိုင်းသည် **Lexical Environment Object** တစ်ခု ဖြစ်သည်။ ၎င်းတွင် အပိုင်း (၂) ပိုင်း ပါဝင်သည်:
1. **Environment Record**: လက်ရှိ Scope အတွင်းရှိ Variables နှင့် Functions များကို မှတ်တမ်းတင်ထားသော နေရာ။
2. **Outer Reference (`[[OuterEnv]]`)**: မိခင် Parent Scope ၏ Lexical Environment ဆီသို့ ညွှန်ပြထားသော Pointer ဖြစ်သည်။

### Scope Resolution Process (Variable ရှာဖွေပုံ အဆင့်ဆင့်):

```
[Inner Scope: block()]
  ├── Environment Record: { x: 10 }
  └── Outer Reference ──┐
                        ▼
           [Function Scope: outer()]
             ├── Environment Record: { y: 20 }
             └── Outer Reference ──┐
                                   ▼
                      [Global Scope: window]
                        ├── Environment Record: { z: 30 }
                        └── Outer Reference: null (အဆုံးသတ်)
```

Variable တစ်ခုကို ခေါ်ယူသည့်အခါ Engine သည် `[[OuterEnv]]` Pointer တစ်ဆင့်ချင်း အထက်သို့ တက်ရှာပြီး `null` ရောက်သည်အထိ ရှာမတွေ့ပါက **`ReferenceError`** ပေးသည်။

---

## ၂။ Hoisting စည်းမျဉ်းများနှင့် ဦးစားပေး အဆင့်ဆင့်

### Function vs Variable Precedence (ဘယ်သူ အရင် Hoist ဖြစ်သလဲ?)
JavaScript တွင် **Function Declaration သည် Variable ထက် ဦးစားပေး အဆင့် ပိုမြင့်ပြီး အရင်ဆုံး Hoist ဖြစ်သည်**။

```javascript
// ဉာဏ်စမ်း လက်တွေ့ ကုဒ်:
console.log(typeof myHero); // Output: "function" (undefined မဟုတ်ပါ!)

var myHero = "Spider-Man";

function myHero() {
  return "Iron Man";
}

console.log(typeof myHero); // Output: "string" (Execution phase တွင် var တန်ဖိုးက overwrite လုပ်သွားသည်)
```

**ရှင်းလင်းချက်:**
Creation Phase တွင် `function myHero` က အရင်ဆုံး နေရာယူသည်။ `var myHero` ကြေညာချက်သည် နာမည်တူပြီးသား ဖြစ်နေသဖြင့် Creation phase တွင် လျစ်လျူရှုခံရသည်။ သို့သော် Execution Phase ရောက်သောအခါ `myHero = "Spider-Man"` ဖြစ်သွားသဖြင့် ဒုတိယ console တွင် String ဖြစ်သွားသည်။

---

## ၃။ Closures ဆိုတာဘာလဲ?

**Closure** ဆိုသည်မှာ Function တစ်ခုသည် ၎င်းအား မွေးထုတ်ပေးခဲ့သော မိခင် Parent Function ၏ Lexical Environment (Variables များ) ကို မိခင် function ပြီးဆုံးသွားသည့်တိုင်အောင် **ကျောပိုးအိတ် (Backpack) သဖွယ် ဆက်လက် သယ်ဆောင်ကိုင်စွဲထားနိုင်သော စွမ်းရည်** ဖြစ်သည်။

```javascript
function createCounter(step = 1) {
  let count = 0; // Outer variable (Closure ထဲတွင် ကျန်နေမည်)

  return function increment() {
    count += step;
    return count;
  };
}

const countByTwo = createCounter(2);
console.log(countByTwo()); // 2
console.log(countByTwo()); // 4
console.log(countByTwo()); // 6
```

---

## ၄။ Closures ၏ လုပ်ငန်းခွင်သုံး Patterns

### (က) Revealing Module Pattern (IIFE Encapsulation)

ES6 Modules မတိုင်မီကတည်းက ယနေ့တိုင် သုံးစွဲနေသော Private State ဖန်တီးနည်း ဖြစ်သည်။

```javascript
const CartManager = (() => {
  // Private Variables & Functions (အပြင်မှ တိုက်ရိုက် မမြင်ရပါ)
  let items = [];

  function calculateTax(subtotal) {
    return subtotal * 0.05;
  }

  // Public API အဖြစ် ထုတ်ပေးမည့် Object
  return {
    addItem(product) {
      items.push(product);
      console.log(`Added: ${product.name}`);
    },
    getTotalPrice() {
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      return subtotal + calculateTax(subtotal);
    },
    getItemCount() {
      return items.length;
    }
  };
})();

CartManager.addItem({ name: "Gaming Headset", price: 150 });
console.log("Total with Tax:", CartManager.getTotalPrice()); // 157.5
// console.log(CartManager.items); // Output: undefined (လုံခြုံစိတ်ချရသည်)
```

---

### (ခ) Stateful Event Handlers

ခလုတ်တစ်ခုကို User က ဘယ်နှစ်ကြိမ် နှိပ်ခဲ့ပြီးပြီလဲ သို့မဟုတ် Double Click မဖြစ်စေရန် ထိန်းချုပ်ခြင်း:

```javascript
function createSingleClickHandler(actionFn, timeout = 1000) {
  let isExecuting = false; // Closure state

  return async function (...args) {
    if (isExecuting) {
      console.warn("⚠️ ခလုတ်ကို ထပ်ခါတလဲလဲ မနှိပ်ပါနှင့်၊ စောင့်ဆိုင်းဆဲ ဖြစ်ပါသည်...");
      return;
    }

    try {
      isExecuting = true;
      await actionFn.apply(this, args);
    } finally {
      setTimeout(() => {
        isExecuting = false;
      }, timeout);
    }
  };
}

// ခလုတ်အတွက် ချိတ်ဆက် အသုံးပြုပုံ:
const checkoutBtn = document.querySelector("#checkout-btn");
const submitPayment = createSingleClickHandler(async () => {
  console.log("💳 ငွေပေးချေမှု စတင်နေပါသည်...");
  // await apiCall();
});

checkoutBtn?.addEventListener("click", submitPayment);
```

---

## ၅။ Custom Pub/Sub Event Emitter Pattern

Framework များ (Vue, Node.js EventEmitter) နောက်ကွယ်တွင် Closures ကို အသုံးပြု၍ Event Bus တည်ဆောက်ထားပုံ:

```javascript
function createEventEmitter() {
  const events = new Map(); // Private Event Registry

  return {
    // Event တစ်ခုကို နားထောင်ခြင်း (Subscribe)
    subscribe(eventName, listenerFn) {
      if (!events.has(eventName)) {
        events.set(eventName, new Set());
      }
      events.get(eventName).add(listenerFn);

      // Unsubscribe လုပ်နိုင်သော function ကို closure ဖြင့် ပြန်ပေးသည်
      return () => {
        events.get(eventName)?.delete(listenerFn);
      };
    },

    // Event ကို အချက်ပေး ဖြန့်ဝေခြင်း (Publish / Emit)
    emit(eventName, data) {
      const listeners = events.get(eventName);
      if (listeners) {
        listeners.forEach((fn) => fn(data));
      }
    }
  };
}

// အသုံးပြုပုံ:
const bus = createEventEmitter();

// 1. Subscribe လုပ်ခြင်း
const unsubscribeUserLogin = bus.subscribe("user:login", (user) => {
  console.log(`👤 User Logged In: ${user.name}`);
});

// 2. Emit လုပ်ခြင်း
bus.emit("user:login", { name: "Ko Thein Zaw" });

// 3. Unsubscribe ပြန်လုပ်ခြင်း
unsubscribeUserLogin();
bus.emit("user:login", { name: "Daw Nilar" }); // ဘာမှ မပြတော့ပါ (Listener ပျက်သွားပြီ)
```

---

## ၆။ Closures နှင့် Memory Leaks ကာကွယ်ရေး လက်စွဲ

Closure တစ်ခုသည် ၎င်း၏ Outer Scope ထဲရှိ ကြီးမားသော Variable ကို Reference ကိုင်စွဲထားသရွေ့ Garbage Collector သည် ထို Data ကို Memory ပေါ်မှ ရှင်းထုတ်ခွင့် မရရှိပါ။

```javascript
function attachHeavyListener() {
  // 10MB ရှိသော ဒေတာ
  let largeData = new Uint8Array(10 * 1024 * 1024);

  const button = document.querySelector("#my-button");
  const clickHandler = function () {
    console.log("Button clicked!");
  };

  button?.addEventListener("click", clickHandler);

  // ⚠️ အရေးကြီးချက်: အကယ်၍ largeData ကို clickHandler ထဲတွင် မသုံးပါက အောက်ပါအတိုင်း null ပြန်ချပါ
  largeData = null;
}
```
