---
title: "05. DOM and Events"
description: "1. [DOM Tree Architecture နှင့် Node Types](#၁-dom-tree-architecture)"
---

## 🚀 သင်ခန်းစာ (၅) - DOM Manipulation နှင့် Event Handling ကျွမ်းကျင်မှု
### (Lesson 5: Modern DOM Manipulation, Advanced Event Architecture & High-Performance UI)

---

## 📌 မာတိကာ (Table of Contents)
1. [DOM Tree Architecture နှင့် Node Types](#၁-dom-tree-architecture)
2. [DOM Querying: Static NodeList vs Live HTMLCollection](#၂-dom-querying-ခွဲခြမ်းစိတ်ဖြာချက်)
3. [ခေတ်သစ် Elements ဖန်တီးခြင်းနှင့် လုံခြုံရေး](#၃-ခေတ်သစ်-elements-ဖန်တီးခြင်း)
   - [`textContent` vs `innerHTML` vs `DOMPurify`](#textcontent-vs-innerhtml)
   - [DocumentFragment ဖြင့် Bulk Insertion ပြုလုပ်ပုံ](#documentfragment)
4. [Event Propagation (Capturing, Target, Bubbling) နှင့် Listener Options](#၄-event-propagation)
   - [Listener Options: `{ capture, once, passive }` (Mobile 60fps Scroll)](#listener-options)
   - [`stopPropagation()` vs `stopImmediatePropagation()`](#stopimmediatepropagation)
5. [Custom Events ဖန်တီးခြင်း (`CustomEvent` & `dispatchEvent`)](#၅-custom-events)
6. [Enterprise Event Delegation Pattern (Dynamic Table Row Management)](#၆-enterprise-event-delegation-pattern)
7. [လက်တွေ့ လုပ်ငန်းခွင်သုံး Modal & Toast Notification System](#၇-လုပ်ငန်းခွင်သုံး-toast-notification-system)

---

## ၁။ DOM Tree Architecture

**DOM (Document Object Model)** သည် HTML ကို Object များအဖြစ် ဖွဲ့စည်းထားသော Tree ဖြစ်ပြီး Node Types အမျိုးမျိုး ပါဝင်သည်:
* **Node.ELEMENT_NODE (Type 1)**: `<div>`, `<p>`, `<button>` စသည့် HTML Tags များ။
* **Node.TEXT_NODE (Type 3)**: Tag များအတွင်းရှိ စာသားများ (Whitespace space များပါ အကျုံးဝင်သည်)။
* **Node.DOCUMENT_FRAGMENT_NODE (Type 11)**: Memory ပေါ်တွင်သာ ယာယီ တည်ရှိသော Lightweight Container။

---

## ၂။ DOM Querying: Static NodeList vs Live HTMLCollection

| Method | Return Type | Live / Static | အားသာချက် |
| :--- | :--- | :--- | :--- |
| `getElementsByClassName()` | `HTMLCollection` | **Live** (DOM ပြောင်းပါက list ပါ အလိုအလျောက် ပြောင်းသည်) | Array methods မရပါ (`for` loop သုံးရသည်) |
| `querySelectorAll()` | `NodeList` | **Static** (Query လုပ်ချိန် snapshot သာ ဖြစ်သည်) | `.forEach()` Built-in ပါပြီး CSS Selectors အစုံသုံးနိုင်သည် |

```javascript
// ✅ Modern Standard: CSS Selectors ဖြင့် တိကျစွာ ရွေးချယ်ခြင်း
const submitButton = document.querySelector("#checkout-form button[type='submit']");
const requiredInputs = document.querySelectorAll("input:required, select:required");

// NodeList ကို Array အစစ်အမှန် အဖြစ်သို့ ပြောင်းလဲလိုပါက:
const inputsArray = Array.from(requiredInputs);
```

---

## ၃။ ခေတ်သစ် Elements ဖန်တီးခြင်း

```javascript
// textContent vs innerHTML လုံခြုံရေး:
const userBioInput = "<img src=x onerror='alert(1)'>";

const safeDiv = document.createElement("div");
// ✅ textContent သုံးပါက HTML tags များ parse မဖြစ်ဘဲ text အဖြစ်သာ လုံခြုံစွာ ဝင်သွားသည်
safeDiv.textContent = userBioInput; 
document.body.appendChild(safeDiv);
```

### DocumentFragment ဖြင့် Batch Insertion ပြုလုပ်ပုံ:
DOM ထဲသို့ Elements အခု ၁,၀၀၀ ကို တစ်ခုချင်း `append` လုပ်ပါက Reflow ၁,၀၀၀ ကြိမ် ဖြစ်ပြီး Browser ထစ်သွားမည်။ `DocumentFragment` သုံးပါက Reflow တစ်ကြိမ်သာ ဖြစ်စေသည်။

```javascript
function renderProductList(products) {
  const container = document.querySelector("#product-grid");
  const fragment = document.createDocumentFragment(); // Memory Container

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card p-4 border rounded shadow";
    card.innerHTML = `
      <h3 class="font-bold">${product.title}</h3>
      <p class="text-green-600">$${product.price}</p>
    `;
    fragment.appendChild(card); // DOM ပေါ် မရောက်သေးပါ (Memory ပေါ်တွင်သာ ရှိသည်)
  });

  container.appendChild(fragment); // တစ်ကြိမ်တည်းဖြင့် DOM ထဲ အားလုံး ဝင်သွားသည်
}
```

---

## ၄။ Event Propagation

```
               ┌────────────────────────┐
               │  1. CAPTURING PHASE    │ ◄── Window မှ Target Element ဆီသို့ ဆင်းလာသည်
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │    2. TARGET PHASE     │ ◄── User ကလစ်နှိပ်လိုက်သော Element ဆီသို့ ရောက်ရှိ
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │   3. BUBBLING PHASE    │ ◄── Target မှ Window ဆီသို့ အထက်သို့ ပြန်တက်သည်
               └────────────────────────┘
```

### Listener Options: `{ capture, once, passive }`

Modern Browser များတွင် `addEventListener` ၏ တတိယ parameter အဖြစ် Option Object ပေးနိုင်သည်။

```javascript
// 1. once: true (တစ်ကြိမ်သာ run ပြီး အလိုအလျောက် listener ဖျက်ပစ်သည်)
const downloadBtn = document.querySelector("#download-receipt");
downloadBtn?.addEventListener("click", () => {
  console.log("Downloading receipt...");
}, { once: true });

// 2. passive: true (Mobile Touch & Scroll Performance 60 FPS ရရှိစေရန်)
// Browser အား e.preventDefault() ခေါ်မည်မဟုတ်ကြောင်း ကြိုတင်အာမခံခြင်းဖြင့် Scroll ချောမွေ့စေသည်
window.addEventListener("touchstart", (e) => {
  // Mobile touch logic
}, { passive: true });
```

### `stopPropagation()` vs `stopImmediatePropagation()`

* **`e.stopPropagation()`**: Parent Element များဆီသို့ Event ဆက်လက် Bubbling မဖြစ်အောင် တားဆီးသည်။ (သို့သော် လက်ရှိ Element ပေါ်ရှိ အခြား Listener များ ဆက် Run သည်)။
* **`e.stopImmediatePropagation()`**: Parent သို့ မတက်ရုံသာမက လက်ရှိ Element ပေါ်ရှိ ကျန်ရှိသော အခြား Listener များကိုပါ **ချက်ချင်း ရပ်တန့်** ပစ်သည်။

---

## ၅။ Custom Events ဖန်တီးခြင်း

Components များ အချင်းချင်း အချိတ်အဆက်မိစေရန် JavaScript တွင် Custom Event များ ထုတ်လွှင့်နိုင်သည်။

```javascript
// 1. Custom Event အသစ် ဖန်တီးပြီး Data ထည့်သွင်းခြင်း
const cartUpdatedEvent = new CustomEvent("cart:updated", {
  detail: {
    totalItems: 5,
    totalAmount: 250,
  },
  bubbles: true // Parent များဆီသို့ Bubble တက်ခွင့်ပြုသည်
});

// 2. Listener ချိတ်ဆက် နားထောင်ခြင်း
document.addEventListener("cart:updated", (e) => {
  console.log("🛒 Cart Updated Notification:", e.detail.totalAmount);
});

// 3. Dispatch ခေါ်ယူ ထုတ်လွှင့်ခြင်း
document.dispatchEvent(cartUpdatedEvent);
```

---

## ၆။ Enterprise Event Delegation Pattern

Table တွင် Row အသစ်များ မည်မျှပင် ထပ်တိုးထပ်တိုး Parent `tbody` တစ်ခုတည်းတွင်သာ Event Listener ထားရှိခြင်း:

```javascript
const userTableBody = document.querySelector("#user-table-body");

userTableBody.addEventListener("click", (e) => {
  // ကလစ်ခံရသော ခလုတ်ကို closest ဖြင့် ရှာဖွေခြင်း
  const targetBtn = e.target.closest("button[data-action]");
  if (!targetBtn) return;

  const action = targetBtn.dataset.action;
  const row = targetBtn.closest("tr");
  const userId = row.dataset.userId;

  switch (action) {
    case "view":
      console.log(`Viewing details for user #${userId}`);
      break;
    case "edit":
      console.log(`Editing user #${userId}`);
      break;
    case "delete":
      if (confirm(`User #${userId} ကို အမှန်တကယ် ဖျက်မှာ သေချာပါသလား?`)) {
        row.remove(); // Table row ဖျက်ထုတ်ခြင်း
        console.log(`Deleted user #${userId}`);
      }
      break;
  }
});
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Toast Notification System

```javascript
class ToastNotification {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = "success", duration = 3000) {
    this.init();

    const toast = document.createElement("div");
    const bgColor = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#3B82F6";
    
    toast.style.cssText = `
      background-color: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    `;
    toast.textContent = message;

    this.container.appendChild(toast);

    // Auto dismiss timer
    const timer = setTimeout(() => {
      toast.remove();
    }, duration);

    // User ကလစ်နှိပ်ပါက ချက်ချင်း ဖျက်မည်
    toast.addEventListener("click", () => {
      clearTimeout(timer);
      toast.remove();
    });
  }
}

// အသုံးပြုပုံ:
// ToastNotification.show("Product saved successfully!", "success");
// ToastNotification.show("Network connection failed!", "error");
```
