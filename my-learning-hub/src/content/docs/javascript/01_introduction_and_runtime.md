---
title: "01. Introduction and V8 Runtime"
description: "1. [JavaScript ဆိုတာဘာလဲ? (ECMAScript vs JavaScript vs Web APIs)](#၁-javascript-ဆိုတာဘာလဲ)"
---

## 🚀 သင်ခန်းစာ (၁) - JavaScript မိတ်ဆက်နှင့် Engine Runtime Architecture
### (Lesson 1: Introduction to JavaScript & Engine Runtime Architecture)

---

## 📌 မာတိကာ (Table of Contents)
1. [JavaScript ဆိုတာဘာလဲ? (ECMAScript vs JavaScript vs Web APIs)](#၁-javascript-ဆိုတာဘာလဲ)
2. [Google V8 Engine ၏ အတွင်းပိုင်း အလုပ်လုပ်ပုံ အပြည့်အစုံ](#၂-google-v8-engine-၏-အတွင်းပိုင်း-အလုပ်လုပ်ပုံ)
   - [Parser, AST (Abstract Syntax Tree)](#parser-နှင့်-ast)
   - [Ignition Interpreter vs TurboFan JIT Compiler](#ignition-interpreter-vs-turbofan-jit-compiler)
   - [De-optimization (Deopt) ဆိုတာဘာလဲ?](#de-optimization-ဆိုတာဘာလဲ)
3. [Memory Heap နှင့် Call Stack အလုပ်လုပ်ပုံ (Visual Diagram)](#၃-memory-heap-နှင့်-call-stack)
4. [Execution Context အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Creation Phase vs Execution Phase)](#၄-execution-context-အဆင့်ဆင့်-အလုပ်လုပ်ပုံ)
5. [Variables ကြေညာခြင်း စနစ်တကျ ခွဲခြမ်းစိတ်ဖြာချက် (`var` vs `let` vs `const`)](#၅-variables-ကြေညာခြင်း-စနစ်တကျ-ခွဲခြမ်းစိတ်ဖြာချက်)
   - [Scope & Shadowing](#scope--shadowing)
   - [Temporal Dead Zone (TDZ) လက်တွေ့ နမူနာများ](#temporal-dead-zone-tdz-လက်တွေ့-နမူနာများ)
6. [Data Types အသေးစိတ် (Primitives vs Reference Types)](#၆-data-types-အသေးစိတ်)
   - [Memory Allocation: Stack vs Heap ပုံကြမ်း](#memory-allocation-stack-vs-heap)
   - [Garbage Collection: Mark-and-Sweep Algorithm](#garbage-collection-mark-and-sweep)
7. [Type Coercion နှင့် Strict Equality စနစ် (`==` vs `===`)](#၇-type-coercion-နှင့်-strict-equality-စနစ်)
   - [ToPrimitive Algorithm နှင့် အသုံးအများဆုံး အန္တရာယ်ရှိသော နှိုင်းယှဉ်မှုများ](#toprimitive-algorithm)
   - [Safe Number Checking (`Number.isNaN`, `Number.isFinite`)](#safe-number-checking)
8. [Truthy Values နှင့် Falsy Values အပြည့်အစုံ ဇယား](#၈-truthy-values-နှင့်-falsy-values-အပြည့်အစုံ-ဇယား)
9. [လုပ်ငန်းခွင်လက်တွေ့သုံး Best Practices နှင့် Architecture Summary](#၉-လုပ်ငန်းခွင်လက်တွေ့သုံး-best-practices)

---

## ၁။ JavaScript ဆိုတာဘာလဲ?

### (က) အဓိပ္ပာယ်ဖွင့်ဆိုချက်
**JavaScript (JS)** သည် Single-Threaded, Non-blocking, Asynchronous, Concurrent, Dynamic, High-Level Programming Language တစ်ခု ဖြစ်သည်။ ၎င်းသည် Browser များတွင် သာမက **Node.js, Deno, Bun** စသည့် Server-side Runtime များတွင်ပါ အသုံးပြုနိုင်သည်။

### (ခ) ECMAScript, JavaScript နှင့် Web APIs ကွာခြားချက်
* **ECMAScript (ES)**: ဘာသာစကား၏ Standard Specification (ဥပဒေသ / သတ်မှတ်ချက်) ဖြစ်သည်။ Syntax, Data Types, Built-in Objects (`Array`, `Promise`) တို့ကို မည်သို့ အလုပ်လုပ်ရမည်ဟု သတ်မှတ်သည်။
* **JavaScript**: ECMAScript စံနှုန်းကို အမှန်တကယ် ရေးသား အကောင်အထည်ဖော်ထားသော Language ဖြစ်သည်။
* **Web APIs**: JavaScript Language တွင် မပါဝင်ဘဲ Browser က ထပ်ဆောင်း ထောက်ပံ့ပေးထားသော စွမ်းရည်များ ဖြစ်သည်။ ဥပမာ- `window`, `document` (DOM), `fetch()`, `setTimeout()`, `localStorage` စသည်တို့ ဖြစ်သည်။ (Node.js တွင် DOM မပါဘဲ `fs`, `http`, `path` စသည့် Server APIs များ ပါဝင်သည်)။

---

## ၂။ Google V8 Engine ၏ အတွင်းပိုင်း အလုပ်လုပ်ပုံ

Chrome Browser နှင့် Node.js တို့ကို မောင်းနှင်နေသော Google V8 Engine သည် JavaScript ကုဒ်ကို Machine Code အဖြစ်သို့ အောက်ပါ အဆင့်များဖြင့် အချိန်နှင့်တစ်ပြေးညီ ပြောင်းလဲပေးသည်:

```
[JavaScript Source Code]
          │
          ▼
    ┌───────────┐
    │  PARSER   │ ◄── Scanner ဖြင့် Tokens များ ခွဲခြမ်းပြီး Syntax စစ်ဆေးသည်
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │    AST    │ ◄── Abstract Syntax Tree (သစ်ပင်သဖွယ် Data Structure)
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │ IGNITION  │ ◄── Bytecode Interpreter (ကုဒ်ကို ချက်ချင်း စတင် run ပေးသည်)
    └─────┬─────┘
          │
          ├────────────────────────┐ (Hot Functions: ထပ်ခါတလဲလဲ run သော code)
          ▼                        ▼
    [ Bytecode Run ]        ┌──────────────┐
                            │   TURBOFAN   │ ◄── Optimizing JIT Compiler
                            └──────┬───────┘
                                   │
                                   ▼
                            [ Optimized Machine Code ]
                                   │
                                   ▼ (Data Type ပြောင်းသွားပါက)
                            [ De-optimization ] ──► ပြန်လည် Bytecode သို့ ဆုတ်ခွာသည်
```

### Parser နှင့် AST
* **Pre-parser**: ချက်ချင်း မ run သေးသော Function များကို အကြမ်းဖျင်းသာ စစ်ဆေး၍ Memory ချွေတာသည်။
* **Full-parser**: အမှန်တကယ် run မည့် ကုဒ်များကို ဖတ်၍ **AST (Abstract Syntax Tree)** ခေါ် Tree Structure တည်ဆောက်သည်။

### Ignition Interpreter vs TurboFan JIT Compiler
* **Ignition**: AST ကို ဖတ်ပြီး Bytecode အဖြစ်သို့ အမြန်ဆုံး ပြောင်းလဲကာ စက္ကန့်ပိုင်းအတွင်း စတင် Run စေသည်။
* **TurboFan**: အကြိမ်ကြိမ် အခါခါ ခေါ်ယူနေသော Function များ (Hot Code) ကို ခြေရာခံပြီး အလွန်လျင်မြန်သော **Machine Code** အဖြစ် တိုက်ရိုက် Compile လုပ်ပေးသည်။

### De-optimization ဆိုတာဘာလဲ?
JavaScript သည် Dynamically Typed ဖြစ်သည်။ အကယ်၍ TurboFan က Function တစ်ခုကို အမြဲတမ်း Number သာ ဝင်လာသည်ဟု ယူဆ၍ Machine Code အဖြစ် Optimize လုပ်ထားစဉ် မမျှော်လင့်ဘဲ String ဝင်လာပါက Machine Code ကို ဖျက်သိမ်းပြီး မူလ Bytecode သို့ ပြန်ဆုတ်ခွာရသည် (**Deopt** ဟု ခေါ်သည်)။ ထို့ကြောင့် Function များတွင် Data Type တစ်သမတ်တည်း ထားရှိခြင်းသည် Engine စွမ်းဆောင်ရည်ကို အမြင့်ဆုံး ဖြစ်စေသည်။

---

## ၃။ Memory Heap နှင့် Call Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                          JAVASCRIPT ENGINE                             │
│                                                                        │
│   ┌──────────────── MEMORY HEAP ───────────────┐                       │
│   │                                            │                       │
│   │  Object, Array, Function Definitions       │                       │
│   │  [0x0012A]: { name: "Alex", age: 28 }      │                       │
│   │  [0x0012B]: [ 100, 200, 300 ]             │                       │
│   │                                            │                       │
│   └────────────────────────────────────────────┘                       │
│                                                                        │
│   ┌──────────────── CALL STACK ────────────────┐                       │
│   │                                            │                       │
│   │  │                                      │  │ (LIFO Order)          │
│   │  │ multiply(a, b)                       │  │ ◄── 3. Currently Exec │
│   │  ├──────────────────────────────────────┤  │                       │
│   │  │ calculateTotal(cart)                 │  │ ◄── 2. Waiting        │
│   │  ├──────────────────────────────────────┤  │                       │
│   │  │ Global Execution Context             │  │ ◄── 1. Base Context   │
│   │  └──────────────────────────────────────┘  │                       │
│   └────────────────────────────────────────────┘                       │
└────────────────────────────────────────────────────────────────────────┘
```

* **Memory Heap**: အရွယ်အစား မတည်မြဲသော အရာများ (Dynamic Memory) အတွက် အသုံးမပြုသော အလွတ်နေရာ မန်မိုရီ သိုလှောင်ကန် ဖြစ်သည်။
* **Call Stack**: ကုဒ်များ မည်သည့်အစဉ်အတိုင်း အလုပ်လုပ်သည်ကို ခြေရာခံသော Stack ဖြစ်သည်။ Function တစ်ခု ခေါ်တိုင်း Push ဖြစ်ပြီး ပြီးဆုံးပါက Pop ထွက်သည်။ Stack တွင် နေရာ ကုန်ဆုံးသွားပါက **`RangeError: Maximum call stack size exceeded` (Stack Overflow)** ဖြစ်ပေါ်သည်။

---

## ၄။ Execution Context အဆင့်ဆင့် အလုပ်လုပ်ပုံ

JavaScript တွင် ကုဒ်တစ်ခု run သည့်အခါတိုင်း **Execution Context** တစ်ခု တည်ဆောက်ပြီး အဆင့် (၂) ဆင့်ဖြင့် အလုပ်လုပ်သည်:

### အဆင့် (၁): Creation Phase (Memory Allocation Phase)
1. **Global Object** ကို ဖန်တီးသည် (Browser တွင် `window`၊ Node.js တွင် `global`)။
2. **`this`** ကို သတ်မှတ်သည်။
3. Variable များနှင့် Function များကို Memory နေရာ ကြိုတင်ချပေးသည်:
   - `var` များကို `undefined` တန်ဖိုး သတ်မှတ်ပေးသည်။
   - Function Declarations များကို အပြည့်အစုံ Memory ပေါ် တင်ပေးသည် (**Hoisting**)။
   - `let` နှင့် `const` များကို Memory ချပေးသော်လည်း Initialize မလုပ်သေးဘဲ **TDZ** တွင် ထားရှိသည်။

### အဆင့် (၂): Execution Phase (Code Running Phase)
ကုဒ်များကို အပေါ်မှ အောက်သို့ တစ်ကြောင်းချင်း စတင် Run ပြီး တန်ဖိုးများကို အမှန်တကယ် assign ပြုလုပ်သည်။

```javascript
// လက်တွေ့ လေ့လာကြည့်ပါ:
console.log(tax);       // Output: undefined (Creation phase တွင် var သည် undefined ရရှိထားပြီးဖြစ်သည်)
// console.log(rate);   // ReferenceError: Cannot access 'rate' before initialization (TDZ)

var tax = 50;
let rate = 0.05;

function calculate(price) {
  return price * rate;
}
```

---

## ၅။ Variables ကြေညာခြင်း စနစ်တကျ ခွဲခြမ်းစိတ်ဖြာချက်

| Feature | `var` (ES5 ဟောင်း) | `let` (ES6+) | `const` (ES6+) |
| :--- | :--- | :--- | :--- |
| **Scope** | Function Scope | Block Scope (`{}`) | Block Scope (`{}`) |
| **Hoisting** | ဖြစ်သည် (`undefined` ရသည်) | ဖြစ်သည် (သို့သော် TDZ တွင် ရှိ) | ဖြစ်သည် (သို့သော် TDZ တွင် ရှိ) |
| **Re-assign** | ရပါသည် | ရပါသည် | မရပါ (Constant) |
| **Re-declare** | ရပါသည် (Bug များစေသည်) | မရပါ (SyntaxError) | မရပါ (SyntaxError) |
| **Global Window Property** | `window.a = 10` ဖြစ်သွားသည် | မဖြစ်ပါ | မဖြစ်ပါ |

### Scope & Shadowing

```javascript
let currentScore = 100; // Outer Scope

function updateGame() {
  let currentScore = 999; // Shadowing: Outer variable ကို ကွယ်ကာပြီး ကိုယ်ပိုင် အသစ်ဖန်တီးသည်
  console.log("Inner:", currentScore); // 999
}

updateGame();
console.log("Outer:", currentScore); // 100 (မူရင်း မပြောင်းလဲပါ)
```

### Temporal Dead Zone (TDZ) လက်တွေ့ ဥပမာ

TDZ ဆိုသည်မှာ Variable ၏ Scope စတင်ရာနေရာမှစ၍ ၎င်းအား တန်ဖိုး သတ်မှတ်ကြေညာထားသော လိုင်းမရောက်မီအထိ ကြားကာလ ဖြစ်သည်။

```javascript
{
  // <--- TDZ စတင်သည်
  // console.log(userStatus); // 💥 ReferenceError (TDZ အတွင်း ဖြစ်နေသည်)
  let dummy = 10;
  // <--- TDZ ဆက်လက် တည်ရှိဆဲ
  let userStatus = "ACTIVE"; // <--- ဤလိုင်းရောက်မှ userStatus အတွက် TDZ ပြီးဆုံးသည်
  console.log(userStatus);   // Output: "ACTIVE" (ဘေးကင်းစွာ ရရှိသည်)
}
```

---

## ၆။ Data Types အသေးစိတ်

### (က) Primitive Types (၇ မျိုး) - Immutable (တန်ဖိုးကို တိုက်ရိုက် သိမ်းဆည်းသည်)
1. **String**: `"Hello"`, `'World'`, `` `Template` ``
2. **Number**: 64-bit floating point (`42`, `-3.14`, `NaN`, `Infinity`)
3. **BigInt**: ကြီးမားသော ဂဏန်းများ (`9007199254740991n`)
4. **Boolean**: `true`, `false`
5. **Undefined**: တန်ဖိုး မသတ်မှတ်ရသေးသော Variable (Default)
6. **Null**: ရည်ရွယ်ချက်ရှိရှိ တန်ဖိုးမရှိကြောင်း သတ်မှတ်ချက် (`typeof null === "object"` သည် JS သမိုင်းဝင် Bug ဖြစ်သည်)
7. **Symbol**: ပြိုင်ဘက်မရှိ တစ်မူထူးခြားသော Identifier (`Symbol('id')`)

### (ခ) Reference Types (Objects) - Mutable (Memory Pointer Address ကို သိမ်းသည်)
* **Object Literal**: `{ name: "Laptop", price: 1200 }`
* **Array**: `[1, 2, 3]`
* **Function**: `function() {}`
* **Date, RegExp, Map, Set**

### Memory Allocation: Stack vs Heap

```
STACK (Fast, Fixed size)                 HEAP (Dynamic, Flexible)
┌─────────────────────────┐              ┌────────────────────────────────┐
│ let age = 25            │              │                                │
│ let isOnline = true     │              │                                │
│ let userPtr ────────────┼─────────────►│ Address: 0x10A                 │
│                         │              │ Value: { name: "Mya Mya" }     │
└─────────────────────────┘              └────────────────────────────────┘
```

### Garbage Collection: Mark-and-Sweep Algorithm
JavaScript Engine သည် အမြစ် (Root - Window သို့မဟုတ် Global Object) မှ စတင်၍ ချိတ်ဆက်နေသော အရာများကို ခြေရာခံသည် (**Mark** လုပ်သည်)။ Root မှ မည်သို့မျှ လှမ်းယူမရတော့သော အရာများကို အသုံးမလိုတော့ဟု သတ်မှတ်ပြီး Memory ပေါ်မှ အလိုအလျောက် သုတ်သင်ရှင်းလင်းသည် (**Sweep** လုပ်သည်)။

---

## ၇။ Type Coercion နှင့် Strict Equality စနစ်

### `==` vs `===` အလုပ်လုပ်ပုံ
* **`===` (Strict Equality)**: Data Type ရော Value ရော နှစ်ခုစလုံး တူညီမှသာ `true` ပေးသည်။ Type ပြောင်းလဲခြင်း မလုပ်ပါ။
* **`==` (Loose Equality)**: Data Type မတူပါက Engine သည် နောက်ကွယ်မှ **ToPrimitive Algorithm** ကို သုံး၍ အလိုအလျောက် Type ပြောင်းကာ တိုက်စစ်သည်။

### Tricky Coercion Cases များကို ရှင်းလင်းချက်:

```javascript
// 1. Array + Array
console.log([] + []); // Output: "" (Array အလွတ်များကို String "" သို့ ပြောင်းပြီး ပေါင်းသည်)

// 2. Array + Object
console.log([] + {}); // Output: "[object Object]"

// 3. String - Number
console.log("50" - 10); // Output: 40 (အနှုတ် operator သည် String ကို Number သို့ အတင်းပြောင်းသည်)
console.log("50" + 10); // Output: "5010" (အပေါင်း operator သည် စာသားဆက်သည်)

// 4. Boolean Arithmetic
console.log(true + true); // Output: 2 (true ကို 1 အဖြစ် ပြောင်းသည်)
console.log(false - true); // Output: -1

// 5. Unary Plus (String to Number အမြန်ဆုံးနည်း)
const rawInput = "1500";
const parsedNumber = +rawInput; // Number 1500 အဖြစ်သို့ ပြောင်းသွားသည်
console.log(typeof parsedNumber); // "number"
```

### Safe Number Checking

လုပ်ငန်းခွင်တွင် `isNaN()` ကို တိုက်ရိုက် မသုံးဘဲ ES6+ ၏ **`Number.isNaN()`** နှင့် **`Number.isFinite()`** ကိုသာ သုံးရပါမည်။

```javascript
// ❌ Global isNaN() ၏ ချို့ယွင်းချက်:
console.log(isNaN("hello")); // true ("hello" ကို အရင် Number ပြောင်းကြည့်၍ NaN ဖြစ်သွားသဖြင့် true ပြသည်)

// ✅ Modern Number.isNaN(): တကယ့် NaN စစ်စစ် ဟုတ်မဟုတ်သာ တိကျစွာ စစ်ဆေးသည်
console.log(Number.isNaN("hello")); // false (Type မပြောင်းလဲဘဲ စစ်ဆေးသည်)
console.log(Number.isNaN(0 / 0));   // true (0/0 သည် NaN စစ်စစ် ဖြစ်သည်)

// ✅ ပမာဏ စစ်မှန်သော ဂဏန်း ဟုတ်မဟုတ် စစ်ဆေးခြင်း:
function isValidTransactionAmount(val) {
  return typeof val === "number" && Number.isFinite(val) && val > 0;
}

console.log(isValidTransactionAmount(5000));      // true
console.log(isValidTransactionAmount(Infinity));  // false
console.log(isValidTransactionAmount("5000"));    // false
```

---

## ၈။ Truthy Values နှင့် Falsy Values အပြည့်အစုံ ဇယား

JavaScript တွင် အောက်ပါ **တန်ဖိုး (၈) ခုသာလျှင် Falsy** ဖြစ်ပြီး ကျန်ရှိသမျှ အရာအားလုံးသည် **Truthy** ဖြစ်သည်။

| Falsy တန်ဖိုးများ (`false` ဖြစ်သည်) | ⚠️ သတိပြုရန် အလွန်လွဲမှားလွယ်သော Truthy တန်ဖိုးများ |
| :--- | :--- |
| `false` | `"0"` (စာသားထဲတွင် ၀ ထည့်ထားခြင်းသည် **true** ဖြစ်သည်) |
| `0`, `-0`, `0n` (BigInt Zero) | `" "` (Space ပါသော String သည် **true** ဖြစ်သည်) |
| `""`, `''`, ```` (Empty String) | `"false"` (စာသားဖြစ်၍ **true** ဖြစ်သည်) |
| `null` | `[]` (Array အလွတ်သည် **true** ဖြစ်သည်) |
| `undefined` | `{}` (Object အလွတ်သည် **true** ဖြစ်သည်) |
| `NaN` (Not a Number) | `function() {}` (Function အလွတ်သည် **true** ဖြစ်သည်) |

---

## ၉။ လုပ်ငန်းခွင်လက်တွေ့သုံး Best Practices

1. **`var` ကို လုံးဝ မသုံးပါနှင့်**: `const` ကို Default အဖြစ် အမြဲသုံးပါ။ တန်ဖိုး အသစ်ပြန်ထည့်ရန် လိုအပ်မှသာ `let` ကို သုံးပါ။
2. **အမြဲတမ်း `===` ကိုသာ သုံးပါ**: အလိုအလျောက် Type Coercion ကြောင့် မမျှော်လင့်ထားသော Bug များကို ၁၀၀% ရှောင်ရှားနိုင်သည်။
3. **Engine Optimization အတွက် Monomorphic Types ထိန်းသိမ်းပါ**: Object များ တည်ဆောက်ရာတွင် Property Key များကို တစ်သမတ်တည်း အစဉ်လိုက် ထည့်သွင်းခြင်းဖြင့် TurboFan Machine Code Cache ကို အပြည့်အဝ အသုံးချနိုင်သည်။
4. **Number Parsing သတိပြုပါ**: String မှ Number ပြောင်းရာတွင် `parseInt(str, 10)` တွင် ဒုတိယ parameter အဖြစ် Radix (Base 10) ကို မဖြစ်မနေ ထည့်သွင်းပါ။
