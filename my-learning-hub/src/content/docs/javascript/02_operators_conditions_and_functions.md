---
title: "02. Operators and Functions"
description: "1. [ခေတ်မီ Modern Operators များ အသေးစိတ်](#၁-ခေတ်မီ-modern-operators-များ)"
---

## 🚀 သင်ခန်းစာ (၂) - ခေတ်မီ Operators များ၊ Conditions နှင့် Functions စနစ်
### (Lesson 2: Modern Operators, Control Flow & Functions Deep Dive)

---

## 📌 မာတိကာ (Table of Contents)
1. [ခေတ်မီ Modern Operators များ အသေးစိတ်](#၁-ခေတ်မီ-modern-operators-များ)
   - [Nullish Coalescing (`??`) နှင့် Logical OR (`||`) ကွာခြားချက် ဇယား](#nullish-coalescing-vs-logical-or)
   - [Optional Chaining (`?.`) - Object, Array Indexing နှင့် Function Calls](#optional-chaining)
   - [Logical Assignment Operators (`??=`, `\|\|=`, `&&=`)](#logical-assignment-operators)
2. [Control Flow နှင့် Switch အစား Object Lookup Pattern](#၂-control-flow-နှင့်-switch-အစား-object-lookup-pattern)
3. [Functions အမျိုးအစား (၄) မျိုး နှိုင်းယှဉ်ချက်](#၃-functions-အမျိုးအစား-၄-မျိုး)
4. [`this` Keyword ၏ Binding စည်းမျဉ်း (၅) ရပ် အပြည့်အစုံ](#၄-this-keyword-၏-binding-စည်းမျဉ်း-၅-ရပ်)
   - [Default Binding (`strict mode` vs Non-strict)](#default-binding)
   - [Implicit Binding (Object Methods)](#implicit-binding)
   - [Explicit Binding (`call()`, `apply()`, `bind()`) နှိုင်းယှဉ်ချက်](#explicit-binding)
   - [`new` Binding (Constructor Functions)](#new-binding)
   - [Lexical Binding (Arrow Functions)](#lexical-binding)
5. [Parameters စီမံခန့်ခွဲမှု (Default, Rest & Spread)](#၅-parameters-စီမံခန့်ခွဲမှု)
6. [Advanced Functional Concepts: Currying နှင့် Function Composition](#၆-advanced-functional-concepts)
7. [လုပ်ငန်းခွင်သုံး Real-World Project: Dynamic Form Validation Engine](#၇-လုပ်ငန်းခွင်သုံး-form-validation-engine)

---

## ၁။ ခေတ်မီ Modern Operators များ

### Nullish Coalescing (`??`) vs Logical OR (`||`)

လုပ်ငန်းခွင်တွင် Default Settings များ၊ Pagination Limits များနှင့် ပစ္စည်းအရေအတွက်များ စစ်ဆေးရာတွင် ဤ Operator နှစ်ခု၏ ကွာခြားချက်ကို မဖြစ်မနေ သိရှိထားရမည်:

| Input Value | Expression with `\|\|` (OR) | Expression with `??` (Nullish) | ရှင်းလင်းချက် |
| :--- | :--- | :--- | :--- |
| `0` | `0 \|\| 10` ➔ **`10`** ❌ | `0 ?? 10` ➔ **`0`** ✅ | ၀ သည် တရားဝင် ဂဏန်းဖြစ်၍ `??` က မူရင်း ၀ ကို ထိန်းသိမ်းသည် |
| `""` (Empty) | `"" \|\| "Default"` ➔ **`"Default"`** | `"" ?? "Default"` ➔ **`""`** | စာသားအလွတ် ဖြစ်နေစေလိုပါက `??` ကို သုံးရသည် |
| `false` | `false \|\| true` ➔ **`true`** ❌ | `false ?? true` ➔ **`false`** ✅ | Boolean false သည် တရားဝင် တန်ဖိုးဖြစ်သည် |
| `null` | `null \|\| "Fallback"` ➔ **`"Fallback"`** | `null ?? "Fallback"` ➔ **`"Fallback"`** | နှစ်ခုစလုံး Fallback သို့ သွားသည် |
| `undefined`| `undefined \|\| 50` ➔ **`50`** | `undefined ?? 50` ➔ **`50`** | နှစ်ခုစလုံး Fallback သို့ သွားသည် |

```javascript
// လက်တွေ့ ဥပမာ - User ၏ Display Preferences:
function setupUserDashboard(config = {}) {
  // Volume: 0 (အသံပိတ်ထားသည်) ဖြစ်ပါက || သုံးလျှင် အသံ 50 အဖြစ် ပြန်ပွင့်သွားမည်!
  const volume = config.volume ?? 50; 
  const showBadge = config.showBadge ?? true;
  const username = config.username || "Guest User";

  return { volume, showBadge, username };
}

console.log(setupUserDashboard({ volume: 0, showBadge: false, username: "" }));
// Output: { volume: 0, showBadge: false, username: 'Guest User' }
```

---

### Optional Chaining (`?.`)

Optional Chaining သည် Object အဆင့်ဆင့်တွင်သာမက **Dynamic Properties, Array Elements နှင့် Function Calls** များတွင်ပါ ဘေးကင်းစွာ အသုံးပြုနိုင်သည်။

```javascript
const companyResponse = {
  department: {
    manager: {
      name: "U Thant",
      getBonus() { return 5000; }
    },
    staffList: ["Aung", "Zaw", "Hla"]
  }
};

// 1. Nested Property:
console.log(companyResponse.department?.accountant?.salary); // undefined (Crash မဖြစ်ပါ)

// 2. Array Element Index:
console.log(companyResponse.department?.contractors?.[0]);   // undefined

// 3. Optional Function Call:
console.log(companyResponse.department?.manager?.getBonus?.()); // 5000
console.log(companyResponse.department?.director?.calculateTax?.()); // undefined (Crash မဖြစ်ပါ)
```

---

### Logical Assignment Operators (`??=`, `||=`, `&&=`)

```javascript
const appState = {
  theme: "dark",
  userToken: null,
  isLoggedIn: true
};

// ??= (Nullish: null သို့မဟုတ် undefined ဖြစ်မှသာ တန်ဖိုး assign လုပ်မည်)
appState.userToken ??= "GENERATED_GUEST_TOKEN_123";
console.log(appState.userToken); // "GENERATED_GUEST_TOKEN_123"

// ||= (Falsy ဖြစ်ပါက assign လုပ်မည်)
let pageTitle = "";
pageTitle ||= "Home Page (Default)";
console.log(pageTitle); // "Home Page (Default)"

// &&= (Truthy ဖြစ်မှသာ နောက်ထပ် တန်ဖိုးသစ်သို့ ပြောင်းလဲမည်)
appState.isLoggedIn &&= "Authenticated User Session";
console.log(appState.isLoggedIn); // "Authenticated User Session"
```

---

## ၂။ Control Flow နှင့် Switch အစား Object Lookup Pattern

လုပ်ငန်းခွင်တွင် `switch` သို့မဟုတ် `else if` အရှည်ကြီးများသည် ဖတ်ရခက်ပြီး စွမ်းဆောင်ရည် နှေးကွေးစေသည်။ **Object Lookup Table** သည် $O(1)$ Time Complexity ဖြင့် ချက်ချင်း ရှာဖွေပေးနိုင်သည်။

```javascript
// ✅ Enterprise Clean Code: Object Strategy Lookup Pattern
const ORDER_STATUS_HANDLER = {
  PENDING: (order) => `Order #${order.id} စောင့်ဆိုင်းနေပါသည်`,
  PROCESSING: (order) => `Order #${order.id} ထုပ်ပိုးပြင်ဆင်နေပါသည်`,
  SHIPPED: (order) => `Order #${order.id} ပို့ဆောင်ရေးယာဉ်ပေါ် ရောက်ရှိနေပါသည်`,
  DELIVERED: (order) => `Order #${order.id} ပို့ဆောင်ပြီးစီးပါပြီ`,
};

function processOrderStatus(order) {
  const handler = ORDER_STATUS_HANDLER[order.status];
  if (!handler) {
    throw new Error(`Unknown order status: ${order.status}`);
  }
  return handler(order);
}

console.log(processOrderStatus({ id: 1045, status: "SHIPPED" }));
// Output: Order #1045 ပို့ဆောင်ရေးယာဉ်ပေါ် ရောက်ရှိနေပါသည်
```

---

## ၃။ Functions အမျိုးအစား (၄) မျိုး

1. **Function Declaration**: `function doSomething() {}` (Hoisted ဖြစ်ပြီး ဘယ်နေရာမှမဆို ခေါ်သုံးနိုင်သည်)။
2. **Function Expression**: `const doSomething = function() {}` (Variable ထဲ ထည့်ထားသဖြင့် Hoisted မဖြစ်ပါ)။
3. **Arrow Function**: `const doSomething = () => {}` (Concise Syntax ဖြစ်ပြီး ကိုယ်ပိုင် `this` မရှိပါ)။
4. **IIFE (Immediately Invoked Function Expression)**: `(() => {})()` (ကြေညာပြီးသည်နှင့် ချက်ချင်း အလုပ်လုပ်သော Function)။

---

## ၄။ `this` Keyword ၏ Binding စည်းမျဉ်း (၅) ရပ် အပြည့်အစုံ

JavaScript တွင် `this` သည် Function ကို မည်သည့်နေရာတွင် ရေးထားသည်ထက် **"မည်သူက ခေါ်ယူလိုက်သနည်း (How it was called)"** ပေါ်တွင် မူတည်၍ ဆုံးဖြတ်သည်။

### ၁။ Default Binding
Function ကို သာမန်အတိုင်း တိုက်ရိုက် ခေါ်ပါက Global Object (`window` သို့မဟုတ် `global`) ကို ညွှန်းသည်။ သို့သော် `"use strict"` တပ်ထားပါက `undefined` ဖြစ်သွားသည်။

```javascript
function showThis() {
  console.log(this);
}
showThis(); // Non-strict: window, Strict mode: undefined
```

### ၂။ Implicit Binding
Object တစ်ခု၏ Method အဖြစ် ကပ်၍ ခေါ်ယူခြင်း (`obj.fn()`) ဖြစ်သည်။ `.` (dot) ၏ ဘယ်ဘက်ရှိ Object သည် `this` ဖြစ်သည်။

```javascript
const user = {
  name: "Aung Kyaw",
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};
user.greet(); // Output: Hello, my name is Aung Kyaw
```

### ၃။ Explicit Binding (`call`, `apply`, `bind`)

Function တစ်ခုအား `this` မည်သူဖြစ်ရမည်ကို လက်ဖြင့် တိုက်ရိုက် သတ်မှတ်ခေါ်ယူခြင်း ဖြစ်သည်။

| Method | လုပ်ဆောင်ချက် | Arguments ပေးပို့ပုံ |
| :--- | :--- | :--- |
| **`call(thisArg, arg1, arg2)`** | ချက်ချင်း Run သည် | Comma ခြား၍ တစ်ခုချင်း ပေးရသည် |
| **`apply(thisArg, [argsArray])`** | ချက်ချင်း Run သည် | Array အဖြစ် စုစည်းပေးရသည် |
| **`bind(thisArg, arg1, arg2)`** | ချက်ချင်း မ Run ပါ (`this` ကို ချည်နှောင်ထားသော Function အသစ်တစ်ခု ပြန်ပေးသည်) | Event Handler များတွင် သုံးသည် |

```javascript
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I am ${this.name}${punctuation}`);
}

const developer = { name: "Alex Harrison" };

// 1. call: တစ်ခုချင်း ပေးပို့ပြီး ချက်ချင်း run သည်
introduce.call(developer, "Hello", "!"); 
// Output: Hello, I am Alex Harrison!

// 2. apply: Array ဖြင့် ပေးပို့ပြီး ချက်ချင်း run သည်
introduce.apply(developer, ["Mingalarba", "."]);
// Output: Mingalarba, I am Alex Harrison.

// 3. bind: နောက်မှ ခေါ်သုံးရန် ချည်နှောင်ထားသော function အသစ် ထုတ်ယူသည်
const boundIntroduce = introduce.bind(developer, "Hi");
boundIntroduce("!!"); // Output: Hi, I am Alex Harrison!!
```

### ၄။ `new` Binding
Constructor Function သို့မဟုတ် Class ဖြင့် `new` ခေါ်လိုက်သည့်အခါ ဖန်တီးလိုက်သော Instance အသစ်သည် `this` ဖြစ်သွားသည်။

### ၅။ Lexical Binding (Arrow Functions)
Arrow Function တွင် ကိုယ်ပိုင် `this` လုံးဝ မရှိပါ။ ၎င်း တည်ရှိရာ Parent Scope (မိခင်နား) မှ `this` ကိုသာ အမြဲတမ်း အမွေဆက်ခံ အသုံးပြုသည်။

---

## ၅။ Parameters စီမံခန့်ခွဲမှု

```javascript
// Default Parameters, Rest Parameters & Destructuring ပေါင်းစပ်ပုံ:
function registerEmployee({
  name,
  role = "Junior Developer",
  salary = 300000,
  skills = []
} = {}, ...certifications) {
  return {
    employeeName: name,
    position: role,
    monthlyPay: salary,
    coreSkills: skills,
    certs: certifications,
  };
}

const emp = registerEmployee(
  { name: "Su Myat", skills: ["JS", "PHP"] },
  "AWS Cloud Practitioner",
  "Laravel Certified"
);

console.log(emp);
```

---

## ၆။ Advanced Functional Concepts: Currying

**Currying** ဆိုသည်မှာ Argument များစွာ ယူသော Function တစ်ခုကို Argument တစ်ခုချင်းစီသာ ယူပြီး နောက်ထပ် Function အသစ်များ ဆင့်ကဲ Return ပြန်ပေးသော Function အဖြစ် ပြောင်းလဲခြင်း ဖြစ်သည်။

```javascript
// သာမန် Function: multiply(a, b, c) => a * b * c
// Curried Function:
const curryMultiply = (a) => (b) => (c) => a * b * c;

console.log(curryMultiply(2)(3)(4)); // Output: 24

// လုပ်ငန်းခွင်သုံး Discount Engine:
const applyDiscount = (discountPercent) => (price) => price - price * discountPercent;

const tenPercentOff = applyDiscount(0.10);
const vipTwentyOff = applyDiscount(0.20);

console.log(tenPercentOff(500));  // 450
console.log(vipTwentyOff(500));  // 400
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Form Validation Engine

Higher-order functions နှင့် functional predicates များကို ပေါင်းစပ်ထားသော Real-World Validation Framework:

```javascript
// 1. Validator Rules (Pure Functions)
const Validators = {
  required: (value) => (!value || value.trim() === "" ? "ဤနေရာကို မဖြစ်မနေ ဖြည့်သွင်းပါ" : null),
  isEmail: (value) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "တရားဝင် Email ပုံစံ မဟုတ်ပါ" : null),
  minLength: (min) => (value) => (value.length < min ? `အနည်းဆုံး ${min} လုံး ရှိရပါမည်` : null),
};

// 2. Validation Engine
function validateFormData(formData, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field] ?? "";
    for (const rule of rules) {
      const errorMessage = rule(value);
      if (errorMessage) {
        errors[field] = errorMessage;
        break; // ပထမဆုံး error တွေ့ပါက နောက် rules မစစ်တော့ပါ
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 3. စမ်းသပ် အသုံးပြုပုံ:
const userFormSchema = {
  username: [Validators.required, Validators.minLength(4)],
  email: [Validators.required, Validators.isEmail],
  password: [Validators.required, Validators.minLength(8)],
};

const submissionData = {
  username: "mg",
  email: "invalid-email-address",
  password: "123",
};

const validationResult = validateFormData(submissionData, userFormSchema);
console.log(validationResult);
/* Output:
{
  isValid: false,
  errors: {
    username: 'အနည်းဆုံး 4 လုံး ရှိရပါမည်',
    email: 'တရားဝင် Email ပုံစံ မဟုတ်ပါ',
    password: 'အနည်းဆုံး 8 လုံး ရှိရပါမည်'
  }
}
*/
```
