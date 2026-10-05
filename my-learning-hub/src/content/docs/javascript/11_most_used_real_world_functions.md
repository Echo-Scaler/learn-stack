---
title: "11. Real-World Helper Functions"
description: "1. [Advanced Debounce (Leading & Trailing Edge Options)](#၁-advanced-debounce)"
---

## 🚀 သင်ခန်းစာ (၁၁) - လုပ်ငန်းခွင်သုံး လက်တွေ့ အသုံးအများဆုံး Utility Functions
### (Lesson 11: Advanced Debounce/Throttle, Intl Collator, Observers & Enterprise CSV Exporter)

---

## 📌 မာတိကာ (Table of Contents)
1. [Advanced Debounce (Leading & Trailing Edge Options)](#၁-advanced-debounce)
2. [Advanced Throttle (Immediate First Call Guarantee)](#၂-advanced-throttle)
3. [`Intl` Internationalization API အစုံအလင်](#၃-intl-api-အစုံအလင်)
   - [`Intl.Collator` (ဘာသာစကားစုံ အက္ခရာစဉ် မှန်ကန်စွာ စီခြင်း)](#intlcollator)
   - [`Intl.ListFormat` ("Apple, Orange, and Banana")](#intllistformat)
4. [Modern Browser Observers Trio (လက်တွေ့ မရှိမဖြစ် ၃ မျိုး)](#၄-observers-trio)
   - [`IntersectionObserver` (Infinite Scroll & Lazy Loading)](#intersectionobserver)
   - [`MutationObserver` (DOM ပြောင်းလဲမှုများကို စောင့်ကြည့်ခြင်း)](#mutationobserver)
   - [`ResizeObserver` (Container Queries & Responsive Charts)](#resizeobserver)
5. [Excel Character မပျက်သော Enterprise UTF-8 BOM CSV Exporter](#၅-utf8-bom-csv-exporter)

---

## ၁။ Advanced Debounce (Leading & Trailing Edge)

ခလုတ်နှိပ်လိုက်သည်နှင့် **ချက်ချင်းတစ်ကြိမ် run ပြီး (Leading)** နောက်ထပ် ဆက်တိုက်နှိပ်မှုများကို ငြိမ်သွားသည်အထိ စောင့်မည့် Option ပါဝင်သော Advanced Debounce:

```javascript
function debounce(func, wait = 300, immediate = false) {
  let timeout;

  return function (...args) {
    const context = this;
    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);

    if (callNow) func.apply(context, args);
  };
}

// ခလုတ်နှိပ်ချိန်တွင် ချက်ချင်း run ပြီး 500ms အတွင်း နောက်ထပ်နှိပ်မှုများကို ပိတ်ပင်ထားခြင်း:
const submitPayment = debounce(() => {
  console.log("💳 Payment submitted immediately!");
}, 500, true);
```

---

## ၂။ Advanced Throttle

သတ်မှတ်ထားသော အချိန်အတွင်း (ဥပမာ- 200ms) တစ်ကြိမ်သာ တိကျစွာ ခေါ်ခွင့်ပြုသော Function:

```javascript
function throttle(func, limit = 200) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

---

## ၃။ `Intl` Internationalization API အစုံအလင်

### `Intl.Collator` (ဘာသာစကားအလိုက် အက္ခရာစဉ် အမှန် စီတန်းခြင်း)
သာမန် `.sort()` သည် အက္ခရာ Accent များ (ဥပမာ- é, è) သို့မဟုတ် နိုင်ငံခြားဘာသာစကားများတွင် အစဉ်လိုက် မမှန်ကန်ပါ။ `Intl.Collator` သည် နိုင်ငံတကာ စံနှုန်းအတိုင်း စီပေးသည်။

```javascript
const germanWords = ["Zylinder", "Äpfel", "Auto"];

// သာမန် sort: ["Auto", "Zylinder", "Äpfel"] (Ä က နောက်ဆုံးရောက်သည် - မှားယွင်းပါသည်)
// ✅ Intl.Collator:
const deCollator = new Intl.Collator("de");
console.log(germanWords.toSorted(deCollator.compare));
// Output: [ 'Äpfel', 'Auto', 'Zylinder' ] (ဂျာမန်စံနှုန်းအတိုင်း မှန်ကန်သည်)
```

### `Intl.ListFormat`
Array စာရင်းကို သဒ္ဒါမှန်ကန်သော စာကြောင်းအဖြစ် အလိုအလျောက် ပြောင်းလဲပေးခြင်း:

```javascript
const fruits = ["Apple", "Orange", "Banana"];

const listFormatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
console.log(listFormatter.format(fruits));
// Output: "Apple, Orange, and Banana"
```

---

## ၄။ Modern Browser Observers Trio

### (က) `IntersectionObserver` (Infinite Scroll)

```javascript
const sentinel = document.querySelector("#scroll-sentinel"); // စာမျက်နှာ အောက်ဆုံး element

const infiniteObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    console.log("🚀 User reached bottom! Fetching next page data...");
    // loadNextPage();
  }
});

infiniteObserver.observe(sentinel);
```

### (ခ) `MutationObserver` (DOM ပြောင်းလဲမှုများကို စောင့်ကြည့်ခြင်း)
Third-party Scripts များ သို့မဟုတ် Widget များက DOM ထဲသို့ Dynamic Class ထည့်လိုက်ခြင်းကို ခြေရာခံခြင်း:

```javascript
const targetNode = document.querySelector("#app");

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("DOM element အသစ် ထည့်သွင်းခြင်း/ဖျက်ခြင်း ခံရပါသည်");
    }
  }
});

observer.observe(targetNode, { childList: true, subtree: true });
```

### (ဂ) `ResizeObserver` (Container Queries & Charts Resize)
Window တစ်ခုလုံး မဟုတ်ဘဲ သီးခြား `div` Box တစ်ခု၏ Width/Height အပြောင်းအလဲကို စောင့်ကြည့်ပြီး Chart ကို Re-render လုပ်ခြင်း:

```javascript
const chartContainer = document.querySelector("#dashboard-chart");

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(`Chart Container resized: ${width}px x ${height}px`);
    // myChart.resize(width, height);
  }
});

resizeObserver.observe(chartContainer);
```

---

## ၅။ UTF-8 BOM CSV Exporter

Excel တွင် မြန်မာစာ သို့မဟုတ် အာရှစာလုံးများ ဖွင့်သည့်အခါ စာလုံးများ မဖတ်ရဘဲ ရှုပ်ထွေး (Corrupted) မသွားစေရန် **UTF-8 Byte Order Mark (`\uFEFF`)** ထည့်သွင်းထားသော စံချိန်မီ Exporter:

```javascript
function exportToCsvWithBom(filename, rows) {
  if (!rows || !rows.length) return;

  const keys = Object.keys(rows[0]);
  const csvContent = [
    keys.join(","),
    ...rows.map(row => keys.map(k => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\r\n");

  // \uFEFF သည် Excel အား UTF-8 စစ်စစ်ဖြစ်ကြောင်း အသိပေးသော BOM ဖြစ်သည်
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// မြန်မာစာလုံးများ ပါဝင်သော Data:
const orders = [
  { "အော်ဒါအမှတ်": "ORD-001", "ဝယ်သူ": "ဦးမြ", "ပမာဏ": "၅၀,၀၀၀ ကျပ်" },
  { "အော်ဒါအမှတ်": "ORD-002", "ဝယ်သူ": "ဒေါ်လှ", "ပမာဏ": "၁၂၀,၀၀၀ ကျပ်" },
];

// exportToCsvWithBom("orders_report_myanmar", orders);
```
