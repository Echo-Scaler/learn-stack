---
title: "08. Prototypes and Classes"
description: "1. [JavaScript Prototype Chain နှင့် Class များ၏ အတွင်းပိုင်း သဘောတရား](#၁-prototype-chain-အတွင်းပိုင်း)"
---

## 🚀 သင်ခန်းစာ (၈) - OOP၊ Prototypes နှင့် ES6 Classes စနစ်
### (Lesson 8: Object-Oriented Programming, Prototype Pollution & Enterprise Design Patterns)

---

## 📌 မာတိကာ (Table of Contents)
1. [JavaScript Prototype Chain နှင့် Class များ၏ အတွင်းပိုင်း သဘောတရား](#၁-prototype-chain-အတွင်းပိုင်း)
2. [Prototype Pollution လုံခြုံရေး အားနည်းချက်နှင့် ကာကွယ်နည်း](#၂-prototype-pollution)
3. [ခေတ်သစ် ES6+ Classes စနစ် အပြည့်အစုံ](#၃-ခေတ်သစ်-es6-classes)
   - [Constructor & Instance Methods](#constructor--instance-methods)
   - [Private Fields (`#field`) နှင့် Static Private Blocks](#private-fields)
   - [Getters / Setters နှင့် Business Validation](#getters--setters)
4. [Inheritance, `super()` နှင့် Method Overriding](#၄-inheritance-နှင့်-super)
5. [JavaScript Mixins Pattern (Multiple Inheritance ဖြေရှင်းပုံ)](#၅-javascript-mixins-pattern)
6. [လုပ်ငန်းခွင်သုံး Enterprise Repository Pattern (OOP Frontend Service Layer)](#၆-enterprise-repository-pattern)

---

## ၁။ Prototype Chain အတွင်းပိုင်း

JavaScript တွင် Object တိုင်း၌ `[[Prototype]]` ဟူသော လျှို့ဝှက် Link ပါဝင်သည်။ Class သည် ဤ Prototype အပေါ်တွင် တည်ဆောက်ထားသော Syntactic Sugar ဖြစ်သည်။

```javascript
class Vehicle {
  start() { return "Vroom!"; }
}

const car = new Vehicle();

// car တွင် start method ကို တိုက်ရိုက် မတွေ့ပါက Vehicle.prototype ဆီသို့ တက်ရှာသည်
console.log(car.__proto__ === Vehicle.prototype); // true
console.log(Vehicle.prototype.__proto__ === Object.prototype); // true
```

---

## ၂။ Prototype Pollution လုံခြုံရေး အားနည်းချက်

**Prototype Pollution** ဆိုသည်မှာ Hacker က စနစ်တကျ မစစ်ဆေးထားသော Recursive Object Merge မှတစ်ဆင့် `__proto__` ထဲသို့ Malicious Properties ထည့်သွင်းကာ Application တစ်ခုလုံးရှိ Objects အားလုံးကို ထိန်းချုပ်သွားခြင်း ဖြစ်သည်။

```javascript
// ❌ Prototype Pollution အားနည်းချက် ဥပမာ:
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
const target = {};
Object.assign(target, payload);

const normalUser = {};
console.log(normalUser.isAdmin); // 💥 true ဖြစ်သွားနိုင်သည်! (Object.prototype ညစ်ညမ်းသွားခြင်း)

// ✅ ကာကွယ်နည်း: Object.create(null) သုံးခြင်း (Prototype ကင်းစင်သော သန့်စင်သည့် Dictionary)
const safeDictionary = Object.create(null);
console.log(safeDictionary.__proto__); // undefined (Pollution မဖြစ်နိုင်တော့ပါ)
```

---

## ၃။ ခေတ်သစ် ES6+ Classes

### Private Fields (`#`) နှင့် Static Initialization Blocks

```javascript
class DatabaseConnection {
  // Private Properties
  #connectionString;
  #retryAttempts = 0;

  // Static Private
  static #maxPoolSize = 10;

  // Static Initialization Block (ES2022)
  static {
    console.log("⚡ DatabaseConnection class loaded, max pool:", this.#maxPoolSize);
  }

  constructor(connectionString) {
    this.#connectionString = connectionString;
  }

  // Private Method
  #authenticate() {
    return this.#connectionString.includes("secret");
  }

  connect() {
    if (this.#authenticate()) {
      console.log("Connected successfully");
    } else {
      throw new Error("Auth failed");
    }
  }
}
```

---

## ၄။ Inheritance နှင့် `super()`

```javascript
class PaymentProcessor {
  constructor(currency = "USD") {
    this.currency = currency;
  }

  process(amount) {
    console.log(`Processing ${this.currency} ${amount}`);
  }
}

class StripeProcessor extends PaymentProcessor {
  constructor(apiKey, currency) {
    super(currency); // Parent constructor ကို မဖြစ်မနေ အရင်ခေါ်ရမည်
    this.apiKey = apiKey;
  }

  // Method Overriding (Parent method ကို ပြင်ဆင်ပြီး super ဖြင့် ပြန်လည် ခေါ်ယူခြင်း)
  process(amount) {
    console.log(`Validating Stripe API Key: ${this.apiKey.slice(0, 4)}***`);
    super.process(amount);
  }
}

const stripe = new StripeProcessor("sk_live_999888", "MMK");
stripe.process(50000);
```

---

## ၅။ JavaScript Mixins Pattern

JavaScript တွင် Single Inheritance သာ ခွင့်ပြုသဖြင့် Class တစ်ခုက မိခင် Class နှစ်ခုထံမှ တစ်ပြိုင်နက် အမွေဆက်ခံ၍ မရပါ။ ဤအချက်ကို **Mixins** ဖြင့် ဖြေရှင်းသည်။

```javascript
// Mixin 1: Logging စွမ်းရည်
const CanLog = (Base) => class extends Base {
  log(msg) { console.log(`[LOG] ${new Date().toISOString()}: ${msg}`); }
};

// Mixin 2: Event Emitting စွမ်းရည်
const CanEmit = (Base) => class extends Base {
  emit(event) { console.log(`[EMIT] Event: ${event}`); }
};

// Base Class
class BaseService {}

// Mixins များကို ပေါင်းစပ်အသုံးပြုခြင်း:
class UserService extends CanEmit(CanLog(BaseService)) {
  register(username) {
    this.log(`Registering user: ${username}`);
    this.emit("user:registered");
  }
}

const service = new UserService();
service.register("Aung Aung");
```

---

## ၆။ လုပ်ငန်းခွင်သုံး Enterprise Repository Pattern

Frontend Application တွင် API ဒေတာများနှင့် UI ကြား ခွဲခြားပေးသော Repository Pattern:

```javascript
class BaseRepository {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.baseUrl = "https://api.myproject.com/api";
  }

  async getAll() {
    const res = await fetch(`${this.baseUrl}/${this.endpoint}`);
    if (!res.ok) throw new Error("Failed to fetch list");
    return await res.json();
  }

  async getById(id) {
    const res = await fetch(`${this.baseUrl}/${this.endpoint}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch item ${id}`);
    return await res.json();
  }
}

class ProductRepository extends BaseRepository {
  constructor() {
    super("products");
  }

  async getFeaturedProducts() {
    const all = await this.getAll();
    return all.filter((p) => p.isFeatured);
  }

  async updatePrice(id, newPrice) {
    const res = await fetch(`${this.baseUrl}/${this.endpoint}/${id}/price`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice }),
    });
    return await res.json();
  }
}

// Controller / Component တွင် အသုံးပြုပုံ:
const productRepo = new ProductRepository();
// const featured = await productRepo.getFeaturedProducts();
```
