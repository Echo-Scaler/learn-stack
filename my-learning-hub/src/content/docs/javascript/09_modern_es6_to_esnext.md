---
title: "09. Modern ES6 to ESNext"
description: "1. [ES Modules နှင့် Tree-Shaking စည်းမျဉ်းများ](#၁-es-modules-နှင့်-tree-shaking)"
---

## 🚀 သင်ခန်းစာ (၉) - Modern ES6+ မှ ESNext အထိ ခေတ်မီ Features များ
### (Lesson 9: Modern ES Modules, Generators, WeakMap, Tree-Shaking & ESNext Innovations)

---

## 📌 မာတိကာ (Table of Contents)
1. [ES Modules နှင့် Tree-Shaking စည်းမျဉ်းများ](#၁-es-modules-နှင့်-tree-shaking)
   - [Named vs Default Exports (Bundle Size လျှော့ချရေး)](#named-vs-default-exports)
   - [`import.meta.url` အသုံးပြုပုံ](#importmetaurl)
2. [Dynamic Imports (`import()`) ဖြင့် Route-based Code Splitting](#၂-dynamic-imports)
3. [`Map`, `Set`, `WeakMap` နှင့် `WeakSet` (Memory Leak ကင်းစင်သော Cache)](#၃-collections-နှင့်-weakmap)
4. [Iterators နှင့် Generator Functions (`function*`, `yield`)](#၄-iterators-နှင့်-generators)
5. [Modern String & Regex Features (`replaceAll`, Named Capture Groups)](#၅-modern-string--regex)
6. [လုပ်ငန်းခွင်သုံး Custom Infinite Scroll Generator](#၆-infinite-scroll-generator-code)

---

## ၁။ ES Modules နှင့် Tree-Shaking

Modern Build Tools များ (Vite, Webpack, Rollup) တွင် အသုံးမပြုသော ကုဒ်များကို ဖယ်ရှားပစ်သည့် လုပ်ငန်းစဉ်ကို **Tree-Shaking** ဟု ခေါ်သည်။

### Named vs Default Exports (အရေးကြီးသော Bundle Size လျှော့ချရေး)
* **Default Export**: Object တစ်ခုလုံးကို သယ်ဆောင်သွားလေ့ရှိသဖြင့် Tree-shaking လုပ်ရခက်ခဲပြီး Bundle Size ကို ကြီးမားစေသည်။
* **Named Export**: အမှန်တကယ် လိုအပ်သော Function တစ်ခုတည်းကိုသာ ရွေးထုတ်ယူနိုင်သဖြင့် **Tree-Shaking အတွက် အထူးသင့်တော်သည်**။

```javascript
// ❌ Tree-shaking ခက်ခဲသော ပုံစံ:
export default {
  methodA() { /* heavy code */ },
  methodB() { /* heavy code */ },
};

// ✅ Tree-shaking လွယ်ကူပြီး အကြံပြုအပ်သော ပုံစံ:
export function methodA() { /* ... */ }
export function methodB() { /* ... */ }
```

### `import.meta.url`
လက်ရှိ module ဖိုင် တည်ရှိရာ လမ်းကြောင်းကို အတိအကျ သိရှိရန် သုံးသည် (Assets များ dynamic လှမ်းခေါ်ရာတွင် အသုံးဝင်သည်):

```javascript
const iconUrl = new URL("./assets/logo.svg", import.meta.url).href;
```

---

## ၂။ Dynamic Imports ဖြင့် Route-based Code Splitting

Single Page Applications (SPA) များတွင် User မသွားရောက်သေးသော စာမျက်နှာ (ဥပမာ- `/admin` သို့မဟုတ် `/settings`) ၏ JavaScript ကုဒ်များကို စတင်ဖွင့်ချိန်တွင် ဒေါင်းလုဒ်မဆွဲဘဲ သွားရောက်ချိန်မှသာ လှမ်းခေါ်ခြင်း ဖြစ်သည်။

```javascript
const routes = {
  "/": () => import("./pages/Home.js"),
  "/dashboard": () => import("./pages/Dashboard.js"),
  "/analytics": () => import("./pages/Analytics.js"),
};

async function navigate(path) {
  const loadPage = routes[path] ?? routes["/"];
  const pageModule = await loadPage();
  pageModule.render(document.querySelector("#app"));
}
```

---

## ၃။ Collections နှင့် WeakMap

### `WeakMap` ဆိုတာ ဘာလဲ? ဘာကြောင့် သုံးရသလဲ?
သာမန် `Map` တွင် Key အဖြစ် ထည့်ထားသော DOM Element ကို UI မှ ဖျက်လိုက်သော်လည်း `Map` ထဲတွင် Reference ကျန်နေသဖြင့် **Memory Leak** ဖြစ်စေသည်။

**`WeakMap`** တွင်မူ Key အဖြစ် Object များကိုသာ လက်ခံပြီး ထို Object ပျက်သွားပါက Garbage Collector သည် Memory ပေါ်မှ အလိုအလျောက် သုတ်သင်ရှင်းလင်းခွင့် ရရှိသည်။

```javascript
const domElementState = new WeakMap();

const userCard = document.querySelector(".user-card");

// DOM Element အတွက် private data သိမ်းဆည်းခြင်း
domElementState.set(userCard, { isExpanded: false, clickCount: 0 });

// အကယ်၍ userCard element ကို DOM မှ remove လုပ်လိုက်ပါက:
userCard.remove();
// WeakMap ထဲမှ data သည်လည်း Memory ပေါ်မှ အလိုအလျောက် ပျောက်ကွယ်သွားမည် (Memory Safe ဖြစ်သည်!)
```

---

## ၄။ Iterators နှင့် Generator Functions (`function*`, `yield`)

**Generator** သည် Function တစ်ခု အလုပ်လုပ်နေစဉ် လိုအပ်သည့်နေရာတွင် ခေတ္တ ရပ်တန့်ထားနိုင်ပြီး (`yield`) နောက်မှ ပြန်လည် အလုပ်ဆက်လုပ်စေနိုင်သော အထူး Function ဖြစ်သည်။

```javascript
function* idGenerator() {
  let id = 1000;
  while (true) {
    yield `INV_${id++}`; // ခေါ်တိုင်း နံပါတ်တစ်ခု ထုတ်ပေးပြီး ရပ်စောင့်နေမည်
  }
}

const gen = idGenerator();
console.log(gen.next().value); // INV_1000
console.log(gen.next().value); // INV_1001
console.log(gen.next().value); // INV_1002
```

---

## ၅။ Modern String & Regex Features

```javascript
// 1. replaceAll: စာသား အားလုံးကို တစ်ပြိုင်နက် လဲလှယ်ခြင်း
const phone = "09-123-456-789";
console.log(phone.replaceAll("-", "")); // "09123456789"

// 2. Named Capture Groups in Regex:
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = dateRegex.exec("2026-09-23");

console.log(match.groups.year);  // "2026"
console.log(match.groups.month); // "09"
console.log(match.groups.day);   // "23"
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Infinite Scroll Generator

Pagination API မှ ဒေတာများကို Generator ဖြင့် တစ်မျက်နှာချင်း လိုအပ်သလို ဆွဲယူပေးသော Clean Pattern:

```javascript
async function* fetchPaginatedPosts(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${baseUrl}?page=${page}`);
    const data = await res.json();

    if (data.items.length === 0 || page >= data.totalPages) {
      hasMore = false;
    }

    yield data.items; // မျက်နှာတစ်မျက်နှာစာ ဒေတာ ထုတ်ပေးမည်
    page++;
  }
}

// အသုံးပြုပုံ (User Scroll ဆွဲတိုင်း next() ခေါ်ယူခြင်း):
const postPaginator = fetchPaginatedPosts("/api/posts");

// Scroll အောက်ဆုံးရောက်တိုင်း:
async function onScrollBottom() {
  const { value: posts, done } = await postPaginator.next();
  if (!done) {
    console.log("Appended new posts to UI:", posts);
  } else {
    console.log("End of posts reach.");
  }
}
```
