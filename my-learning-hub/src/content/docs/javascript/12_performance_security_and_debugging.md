---
title: "12. Performance and Debugging"
description: "1. [Web Workers ဖြင့် Background Multithreading ပြုလုပ်ခြင်း](#၁-web-workers)"
---

## 🚀 သင်ခန်းစာ (၁၂) - Performance Optimization၊ Security နှင့် Debugging ကျွမ်းကျင်မှု
### (Lesson 12: Web Performance, Web Workers, Core Web Vitals, Memory Profiling & Security Hardening)

---

## 📌 မာတိကာ (Table of Contents)
1. [Web Workers ဖြင့် Background Multithreading ပြုလုပ်ခြင်း](#၁-web-workers)
2. [Core Web Vitals (LCP, INP, CLS) နှင့် JavaScript Performance](#၂-core-web-vitals)
3. [Memory Profiling: Chrome DevTools ဖြင့် Memory Leak ရှာဖွေနည်း](#၃-memory-profiling)
4. [JavaScript Web Security အဆင့်မြင့် ကာကွယ်ရေး](#၄-javascript-web-security)
   - [Content Security Policy (CSP) စနစ်](#csp-စနစ်)
   - [Trusted Types API နှင့် DOM Sanitization](#trusted-types-api)
5. [Production Error Monitoring & Sourcemaps ဖြေရှင်းပုံ](#၅-production-error-monitoring)
6. [Senior Frontend Developer Production Checklist](#၆-senior-production-checklist)

---

## ၁။ Web Workers: Background Multithreading

JavaScript သည် Single-Threaded ဖြစ်သဖြင့် ကြီးမားသော Data များ (သန်းနှင့်ချီသော တွက်ချက်မှုများ၊ ပုံပြင်ဆင်မှုများ) ကို Main Thread ပေါ်တွင် တွက်ပါက Web UI တစ်ခုလုံး **ခေတ္တ ရပ်တန့် (Freeze)** သွားသည်။

**Web Workers** သည် ထိုကဲ့သို့ လေးလံသော အလုပ်များကို Background Thread သီးသန့်ပေါ်သို့ လွှဲပြောင်းပေးပြီး UI ကို 60fps အမြဲ ချောမွေ့စေသည်။

```javascript
// worker.js (Background Thread)
self.onmessage = function (event) {
  const number = event.data;
  console.log("Worker: Heavy computation started...");

  // အချိန်ကြာမြင့်သော တွက်ချက်မှု
  let total = 0;
  for (let i = 0; i < 2_000_000_000; i++) {
    total += i;
  }

  // ရလဒ်ကို Main Thread ဆီသို့ ပြန်ပို့ခြင်း
  self.postMessage(total);
};
```

```javascript
// main.js (UI Thread)
const myWorker = new Worker("worker.js");

console.log("1. Starting worker in background...");
myWorker.postMessage(100);

// UI Button များကို အသုံးပြုသူ ဆက်လက်နှိပ်နိုင်ပြီး စက်မထစ်တော့ပါ
myWorker.onmessage = function (event) {
  console.log("2. Result from worker received:", event.data);
};
```

---

## ၂။ Core Web Vitals နှင့် JavaScript Performance

Google ၏ Ranking စံနှုန်းဖြစ်သော Core Web Vitals သုံးခု:

1. **LCP (Largest Contentful Paint)**: အဓိက အကြီးဆုံး Content (Hero Image / Title) ပေါ်လာသည့် အချိန် (< 2.5s ဖြစ်သင့်သည်)။
   - JS ကြီးမားပါက Render-blocking ဖြစ်စေသည်။
2. **INP (Interaction to Next Paint)**: User က ခလုတ်နှိပ်သည့်အခါ မျက်နှာပြင်က တုံ့ပြန်ရန် ကြာချိန် (< 200ms ဖြစ်သင့်သည်)။
   - JS Long Tasks (> 50ms) များကို `scheduler.yield()` သို့မဟုတ် `setTimeout(0)` ဖြင့် အပိုင်းပိုင်း ခွဲထုတ်ရမည်။
3. **CLS (Cumulative Layout Shift)**: Page ပွင့်လာစဉ် ခလုတ်များနှင့် ပုံများ ရုတ်တရက် ခုန်ဆင်းသွားခြင်း (< 0.1 ဖြစ်သင့်သည်)။

---

## ၃။ Memory Profiling: Chrome DevTools ဖြင့် Leak ရှာဖွေနည်း

### Three-Snapshot Technique:
1. Chrome DevTools ဖွင့်ပါ ➔ **Memory Tab** သို့ သွားပါ။
2. **Take Snapshot #1** ကို နှိပ်ပါ (Baseline စတင်ချိန်)။
3. သံသယရှိသော လုပ်ဆောင်ချက် (ဥပမာ- Modal ဖွင့်ပြီး ပိတ်ခြင်း၊ Page ကူးပြောင်းခြင်း) ကို ပြုလုပ်ပါ။
4. **Take Snapshot #2** ကို နှိပ်ပါ။
5. ထပ်မံ၍ ထိုလုပ်ဆောင်ချက်ကို ၅ ကြိမ် ပြုလုပ်ပြီး **Take Snapshot #3** ကို ယူပါ။
6. Snapshot 3 တွင် **"Objects allocated between Snapshot 1 and 2"** ကို ရွေးချယ်ပြီး မန်မိုရီမှ မရှင်းဘဲ ကျန်နေသော Detached DOM Elements သို့မဟုတ် Closure References များကို အလွယ်တကူ ရှာဖွေဖော်ထုတ်နိုင်သည်။

---

## ၄။ JavaScript Web Security အဆင့်မြင့် ကာကွယ်ရေး

### Content Security Policy (CSP) စနစ်
Server မှ HTTP Header ဖြင့် မည်သည့် Domain များထံမှ Script များကိုသာ ခွင့်ပြုမည်ဟု သတ်မှတ်ခြင်း:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';
```
ဤ Header တပ်ထားပါက Hacker က `<script src="hacker.com/malicious.js">` ထိုးထည့်သော်လည်း Browser က ဒေါင်းလုဒ်ဆွဲခွင့် မပြုဘဲ ပိတ်ပင်ပေးသည်။

### Trusted Types API
ခေတ်သစ် Browser များတွင် `innerHTML` ကဲ့သို့ အန္တရာယ်ရှိသော နေရာများသို့ စာသားကြမ်းများ တိုက်ရိုက် မထည့်နိုင်စေရန် တားမြစ်သော လုံခြုံရေး စံနှုန်းဖြစ်သည်:

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) {
  const sanitizePolicy = trustedTypes.createPolicy("default", {
    createHTML: (string) => string.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  });

  // သာမန် String အစား Policy အတည်ပြုပြီးမှသာ ဝင်ခွင့်ပြုမည်
  // element.innerHTML = sanitizePolicy.createHTML(userInput);
}
```

---

## ၅။ Production Error Monitoring & Sourcemaps

Production တွင် JavaScript Code များကို Minify (ကုဒ်ကျဉ်း) ပြုလုပ်ထားသဖြင့် `app.min.js:1:245` စသဖြင့် Error လိုင်းနံပါတ် ဖတ်မရ ဖြစ်တတ်သည်။

```javascript
// Global Production Error Catcher
window.onerror = function (message, source, lineno, colno, error) {
  const errorReport = {
    message,
    source,
    line: lineno,
    col: colno,
    stack: error?.stack,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  // Error Tracking API ဆီသို့ ပို့ဆောင်ခြင်း
  navigator.sendBeacon("/api/client-errors", JSON.stringify(errorReport));
};
```
* **Sourcemaps (`.map`) ဖိုင်များ**: Build tool မှ ထွက်လာသော `.map` ဖိုင်များကို Sentry ကဲ့သို့သော Error Tracker သို့သာ Upload တင်ပြီး အများပြည်သူ (Public) သို့ မထုတ်ပြဘဲ ထားရှိရမည်။

---

## ၆။ Senior Production Checklist

- [ ] **Console Logs:** `console.log` များကို Production build တွင် Babel / Terser ဖြင့် auto ဖယ်ထုတ်ထားခြင်း။
- [ ] **DOM Cleanup:** `removeEventListener`, `clearInterval`, `AbortController` များကို Component Unmount တွင် စနစ်တကျ ရှင်းထုတ်ထားခြင်း။
- [ ] **Safe InnerHTML:** Dynamic Data များတွင် `textContent` သို့မဟုတ် DOMPurify စစ်ဆေးထားခြင်း။
- [ ] **Web Vitals INP:** Long Tasks (>50ms) များကို Background Workers သို့မဟုတ် အပိုင်းပိုင်း ခွဲထားခြင်း။
- [ ] **Network Throttling Check:** Slow 3G အခြေအနေတွင် Loading Skeleton နှင့် Error Fallbacks များ စနစ်တကျ အလုပ်လုပ်ခြင်း။
