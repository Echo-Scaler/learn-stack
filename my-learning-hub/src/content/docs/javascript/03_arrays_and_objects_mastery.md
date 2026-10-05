---
title: "03. Arrays and Objects"
description: "1. [လုပ်ငန်းခွင်သုံး Array Methods များနှင့် Internal Mechanics](#၁-လုပ်ငန်းခွင်သုံး-array-methods-များ)"
---

## 🚀 သင်ခန်းစာ (၃) - Arrays နှင့် Objects ကျွမ်းကျင်မှု (Data Structures Deep Dive)
### (Lesson 3: Advanced Arrays, Objects Manipulation, Proxy & Immutability Patterns)

---

## 📌 မာတိကာ (Table of Contents)
1. [လုပ်ငန်းခွင်သုံး Array Methods များနှင့် Internal Mechanics](#၁-လုပ်ငန်းခွင်သုံး-array-methods-များ)
   - [`map()` နှင့် `flatMap()` စွမ်းဆောင်ရည်](#map-နှင့်-flatmap)
   - [`filter()` နှင့် Multi-criteria Search Filtering](#filter-နှင့်-multi-criteria-filtering)
   - [`reduce()` Deep Dive (Totals, Grouping, Occurrence Frequency Count)](#reduce-deep-dive)
   - [Sorting Pitfalls: `sort()` ၏ အန္တရာယ်နှင့် Multi-field Sorting](#sorting-pitfalls)
   - [Negative Indexing: `arr.at(-1)`](#negative-indexing-arrat)
2. [Mutating vs Non-Mutating Methods (ES2023 `toSorted`, `toSpliced`, `with`)](#၂-mutating-vs-non-mutating-methods)
3. [Objects အဆင့်မြင့် ကိုင်တွယ်နည်းများ](#၃-objects-အဆင့်မြင့်-ကိုင်တွယ်နည်းများ)
   - [Object Destructuring (Nested, Renaming, Default values)](#object-destructuring)
   - [`Object.entries()` နှင့် `Object.fromEntries()` ဖြင့် URL Query Params ပြောင်းလဲခြင်း](#objectentries-နှင့်-objectfromentries)
   - [`Object.freeze()` vs `Object.seal()`](#objectfreeze-vs-objectseal)
4. [JavaScript Proxy နှင့် Reflect (Vue 3 Reactivity အလုပ်လုပ်ပုံ)](#၄-javascript-proxy-နှင့်-reflect)
5. [Shallow Copy vs Deep Copy (`structuredClone`)](#၅-shallow-copy-vs-deep-copy)
6. [State Management Immutability Patterns (React / Vue စတိုင်)](#၆-state-management-immutability-patterns)
7. [လက်တွေ့ လုပ်ငန်းခွင်သုံး E-commerce Analytics & Filtering Engine](#၇-လုပ်ငန်းခွင်သုံး-filtering-engine-code)

---

## ၁။ လုပ်ငန်းခွင်သုံး Array Methods များ

### `map()` နှင့် `flatMap()`

```javascript
const rawApiOrders = [
  { orderId: 1, items: [{ name: "Pen", price: 2 }, { name: "Notebook", price: 5 }] },
  { orderId: 2, items: [{ name: "Bag", price: 40 }] },
];

// flatMap သည် array တစ်ခုချင်းစီ၏ item များကို တစ်ဆင့်တည်းဖြစ်အောင် ဖြန့်ချပေးသည်
const allOrderItems = rawApiOrders.flatMap((order) => order.items);
console.log(allOrderItems);
// Output: [ { name: 'Pen', price: 2 }, { name: 'Notebook', price: 5 }, { name: 'Bag', price: 40 } ]
```

---

### `reduce()` Deep Dive

`reduce` သည် Array တစ်ခုကို မည်သည့် Data Type သို့မဆို ပုံစံပြောင်းနိုင်သော အစွမ်းအထက်ဆုံး Method ဖြစ်သည်။

```javascript
// ၁။ စကားလုံး အကြိမ်ရေ တွက်ချက်ခြင်း (Frequency Counter):
const surveyAnswers = ["Yes", "No", "Yes", "Yes", "Maybe", "No"];

const countResult = surveyAnswers.reduce((acc, answer) => {
  acc[answer] = (acc[answer] ?? 0) + 1;
  return acc;
}, {});
console.log(countResult); // { Yes: 3, No: 2, Maybe: 1 }

// ၂။ Array of Objects မှ ID-based Lookup Map တည်ဆောက်ခြင်း (O(1) Fast Access):
const usersList = [
  { id: "usr_1", name: "Aung Ko", role: "Admin" },
  { id: "usr_2", name: "Daw Su", role: "Editor" },
];

const usersByIdMap = usersList.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});

console.log(usersByIdMap["usr_2"].name); // Output: "Daw Su" (Array ကို loop ပတ်ရှာစရာမလိုဘဲ ချက်ချင်း ရရှိသည်)
```

---

### Sorting Pitfalls: `sort()` ၏ အန္တရာယ်နှင့် Multi-field Sorting

JavaScript ၏ Built-in `.sort()` သည် Comparator Function မပါပါက ဂဏန်းများကို **String (UTF-16 Code Units)** အဖြစ် ပြောင်းပြီး စီသဖြင့် မမျှော်လင့်သော ရလဒ်များ ဖြစ်ပေါ်စေသည်။

```javascript
const numbers = [10, 5, 40, 25, 1];

// ❌ Comparator မပါသော sort:
console.log(numbers.sort()); 
// Output: [1, 10, 25, 40, 5] (String "10" သည် "2" ထက် အက္ခရာစဉ်အရ စောသဖြင့် 10 က အရှေ့ရောက်သွားသည် - မှားယွင်းပါသည်!)

// ✅ မှန်ကန်သော Numeric Sorting:
console.log(numbers.sort((a, b) => a - b)); // Ascending: [1, 5, 10, 25, 40]
console.log(numbers.sort((a, b) => b - a)); // Descending: [40, 25, 10, 5, 1]
```

#### Multi-field Sorting (အဆင့်ဆင့် ဦးစားပေး စီတန်းခြင်း):
အသုံးပြုသူများကို Role အလိုက် အရင်စီပြီး Role တူပါက အသက်ငယ်သူကို အရင် ဦးစားပေး စီတန်းခြင်း:

```javascript
const members = [
  { name: "Ko Phyo", role: "Admin", age: 30 },
  { name: "Ma Hnin", role: "User", age: 22 },
  { name: "Ko Zaw", role: "Admin", age: 25 },
];

const sortedMembers = members.toSorted((a, b) => {
  // 1. Role အလိုက် စီတန်းခြင်း
  const roleComparison = a.role.localeCompare(b.role);
  if (roleComparison !== 0) return roleComparison;

  // 2. Role တူပါက အသက် အငယ်မှ အကြီးသို့ စီတန်းခြင်း
  return a.age - b.age;
});

console.log(sortedMembers);
// Ko Zaw (Admin, 25) သည် Ko Phyo (Admin, 30) ထက် အရှေ့ရောက်မည်
```

---

### Negative Indexing: `arr.at(-1)`

ခေတ်ဟောင်း `arr[arr.length - 1]` အစား ES2022 တွင် နောက်ဆုံး Element ကို လှမ်းယူရန် **`arr.at(-1)`** ကို သုံးနိုင်သည်။

```javascript
const steps = ["Step 1", "Step 2", "Step 3", "Final Step"];

console.log(steps.at(-1)); // "Final Step" (နောက်ဆုံးကောင်)
console.log(steps.at(-2)); // "Step 3" (နောက်ဆုံးမှ ရေတွက်လျှင် ဒုတိယကောင်)
```

---

## ၂။ Mutating vs Non-Mutating Methods (ES2023)

```javascript
const originalLanguages = ["PHP", "JavaScript", "Python", "Go"];

// 1. toSorted: မူရင်းကို မထိခိုက်ဘဲ စီထားသော Array အသစ် ရယူခြင်း
const sortedLang = originalLanguages.toSorted();

// 2. toReversed: မူရင်း မပြောင်းဘဲ ပြောင်းပြန်လှန်ခြင်း
const reversedLang = originalLanguages.toReversed();

// 3. with(index, value): မူရင်း မထိခိုက်ဘဲ သတ်မှတ်နေရာကို တန်ဖိုးလဲလှယ်ခြင်း
const updatedLang = originalLanguages.with(0, "Modern PHP 8");

console.log(originalLanguages); // ["PHP", "JavaScript", "Python", "Go"] (မူရင်း လုံးဝ မပြောင်းပါ!)
console.log(updatedLang);        // ["Modern PHP 8", "JavaScript", "Python", "Go"]
```

---

## ၃။ Objects အဆင့်မြင့် ကိုင်တွယ်နည်းများ

### `Object.entries()` နှင့် `Object.fromEntries()`

Object မှ Array သို့ ပြောင်းလဲခြင်းနှင့် Array မှ Object သို့ ပြန်လည်ပြောင်းလဲခြင်း:

```javascript
const productPrices = {
  laptop: 1000,
  mouse: 20,
  keyboard: 80,
};

// ဈေးနှုန်းအားလုံးကို 10% တိုးမြှင့်ပြီး Object အသစ် ပြန်တည်ဆောက်ခြင်း:
const inflatedPrices = Object.fromEntries(
  Object.entries(productPrices).map(([item, price]) => [item, price * 1.1])
);

console.log(inflatedPrices);
// Output: { laptop: 1100, mouse: 22, keyboard: 88 }
```

---

## ၄။ JavaScript Proxy နှင့် Reflect (Vue 3 Reactivity စနစ်)

**Proxy** ဆိုသည်မှာ Object တစ်ခု၏ Properties များကို ဖတ်ရှုခြင်း (`get`) သို့မဟုတ် တန်ဖိုးထည့်သွင်းခြင်း (`set`) ပြုလုပ်သည့်အခါ ကြားဖြတ် ထိန်းချုပ်စစ်ဆေးနိုင်သော စွမ်းရည် ဖြစ်သည်။ **Vue 3 ၏ Reactive State Engine** သည် ဤစနစ်ပေါ်တွင် အခြေခံထားသည်။

```javascript
const rawUserData = {
  username: "mgmg",
  age: 20
};

// Reactive Proxy Wrapper တည်ဆောက်ခြင်း
const reactiveUser = new Proxy(rawUserData, {
  get(target, prop) {
    console.log(`🔍 Property '${prop}' ကို ဖတ်ရှုနေပါသည်`);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    if (prop === "age" && (typeof value !== "number" || value < 0)) {
      throw new Error("အသက်သည် ၀ နှင့်အထက် ဂဏန်း ဖြစ်ရပါမည်");
    }
    console.log(`📝 Property '${prop}' အား တန်ဖိုး '${value}' အဖြစ် အသစ်ပြင်ဆင်လိုက်ပါပြီ (UI Update Trigger)`);
    return Reflect.set(target, prop, value);
  }
});

console.log(reactiveUser.username); // 🔍 Property 'username' ကို ဖတ်ရှုနေပါသည် -> mgmg
reactiveUser.age = 25;              // 📝 Property 'age' အား တန်ဖိုး '25' အဖြစ် အသစ်ပြင်ဆင်လိုက်ပါပြီ
// reactiveUser.age = -5;           // 💥 Error: အသက်သည် ၀ နှင့်အထက် ဂဏန်း ဖြစ်ရပါမည်
```

---

## ၅။ State Management Immutability Patterns

React သို့မဟုတ် Vue Application များတွင် State ကို Mutate မလုပ်ဘဲ မူရင်းကို ထိန်းသိမ်း၍ Update ပြုလုပ်ပုံ လက်တွေ့ နမူနာများ:

```javascript
const initialCartState = [
  { id: 101, name: "Keyboard", qty: 1, price: 50 },
  { id: 102, name: "Mouse", qty: 2, price: 25 },
];

// ၁။ Item အသစ် ပေါင်းထည့်ခြင်း (Push မသုံးဘဲ Spread သုံးပါ):
const newItem = { id: 103, name: "USB Hub", qty: 1, price: 15 };
const cartAfterAdd = [...initialCartState, newItem];

// ၂။ သတ်မှတ်ထားသော ID ရှိသည့် ပစ္စည်း၏ Quantity ကို အသစ်ပြင်ဆင်ခြင်း:
const targetId = 101;
const cartAfterUpdate = initialCartState.map((item) =>
  item.id === targetId ? { ...item, qty: item.qty + 1 } : item
);

// ၃။ သတ်မှတ်ထားသော ID ရှိသည့် ပစ္စည်းကို ဖျက်ထုတ်ခြင်း:
const cartAfterDelete = initialCartState.filter((item) => item.id !== 102);
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Filtering Engine Code

Search, Category Filter, Price Range နှင့် Sort များကို တစ်ပြိုင်နက် ပြုလုပ်ပေးနိုင်သော E-commerce Query Filter:

```javascript
const storeProducts = [
  { id: 1, title: "iPhone 15 Pro", category: "mobile", price: 1200, rating: 4.8 },
  { id: 2, title: "Galaxy S24", category: "mobile", price: 950, rating: 4.5 },
  { id: 3, title: "MacBook Pro M3", category: "laptop", price: 2100, rating: 4.9 },
  { id: 4, title: "Dell XPS 15", category: "laptop", price: 1500, rating: 4.3 },
  { id: 5, title: "Wireless Charger", category: "accessory", price: 35, rating: 4.1 },
];

function filterAndSortProducts(products, {
  search = "",
  category = "ALL",
  minPrice = 0,
  maxPrice = Infinity,
  sortBy = "PRICE_ASC"
} = {}) {
  return products
    .filter((product) => {
      const matchSearch = product.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "ALL" || product.category === category;
      const matchPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchSearch && matchCategory && matchPrice;
    })
    .toSorted((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      if (sortBy === "RATING_DESC") return b.rating - a.rating;
      return 0;
    });
}

// စမ်းသပ်ခြင်း: Laptop များထဲမှ $1600 အောက်ကို ဈေးအနည်းမှ အများသို့ စစ်ထုတ်ခြင်း
const results = filterAndSortProducts(storeProducts, {
  category: "laptop",
  maxPrice: 1600,
  sortBy: "PRICE_ASC"
});

console.log(results);
// Output: [ { id: 4, title: 'Dell XPS 15', category: 'laptop', price: 1500, rating: 4.3 } ]
```
