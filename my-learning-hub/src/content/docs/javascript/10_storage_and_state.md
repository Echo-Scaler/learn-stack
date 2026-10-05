---
title: "10. Storage and State"
description: "1. [Storage နည်းပညာ (၄) မျိုး အသေးစိတ် နှိုင်းယှဉ်ချက်](#၁-storage-နည်းပညာ-၄-မျိုး)"
---

## 🚀 သင်ခန်းစာ (၁၀) - Browser Storage စနစ်နှင့် လုံခြုံရေး ဗိသုကာ
### (Lesson 10: Browser Storage Systems, Cross-Tab Sync & IndexedDB Architecture)

---

## 📌 မာတိကာ (Table of Contents)
1. [Storage နည်းပညာ (၄) မျိုး အသေးစိတ် နှိုင်းယှဉ်ချက်](#၁-storage-နည်းပညာ-၄-မျိုး)
2. [`storage` Event ဖြင့် Cross-Tab Real-Time Synchronization (အလွန် အသုံးဝင်သည်)](#၂-storage-event-cross-tab-sync)
3. [`QuotaExceededError` ကိုင်တွယ်ပုံနှင့် Storage Limit ကာကွယ်ခြင်း](#၃-quotaexceedederror)
4. [Cookies လုံခြုံရေး: `SameSite`, `HttpOnly` နှင့် CSRF အပြည့်အစုံ](#၄-cookies-လုံခြုံရေး)
5. [IndexedDB ကို Promises ဖြင့် အပြည့်အစုံ CRUD ရေးသားခြင်း](#၅-indexeddb-crud)
6. [Web Crypto API ဖြင့် `localStorage` Data ကို Client-Side Encryption ပြုလုပ်ခြင်း](#၆-web-crypto-encryption)

---

## ၁။ Storage နည်းပညာ (၄) မျိုး နှိုင်းယှဉ်ချက်

| အချက် | `localStorage` | `sessionStorage` | Cookies | `IndexedDB` |
| :--- | :--- | :--- | :--- | :--- |
| **Capacity** | ~5MB - 10MB | ~5MB | ~4KB | 250MB+ (Disk အထိ) |
| **Scope** | Domain အားလုံး (Tabs အားလုံး မျှဝေသည်) | Tab တစ်ခုတည်းသာ | Domain & Path | Domain တစ်ခုလုံး |
| **Network** | မပို့ပါ (Client Only) | မပို့ပါ | Request တိုင်း အလိုအလျောက် ပို့သည် | မပို့ပါ |
| **API ပုံစံ** | Synchronous (Blocking) | Synchronous | String / Document | **Asynchronous (Non-blocking)** |

---

## ၂။ `storage` Event: Cross-Tab Real-Time Synchronization

User က Tab တစ်ခုတွင် **"Logout"** နှိပ်လိုက်ပါက သို့မဟုတ် Theme ပြောင်းလိုက်ပါက ဖွင့်ထားသော အခြား Browser Tabs အားလုံးတွင် Page Refresh စရာမလိုဘဲ အလိုအလျောက် ချက်ချင်း အလုပ်လုပ်စေသော စနစ်:

```javascript
// အခြားသော Tabs များမှ ပြောင်းလဲမှုများကို စောင့်ကြည့်နားထောင်ခြင်း
window.addEventListener("storage", (event) => {
  // event.key: ပြောင်းလဲသွားသော key အမည်
  // event.oldValue: တန်ဖိုးဟောင်း
  // event.newValue: တန်ဖိုးအသစ်

  if (event.key === "auth_logout") {
    console.warn("⚠️ အခြား Tab တွင် Logout လုပ်လိုက်သဖြင့် ဤ Tab ကိုပါ ပိတ်သိမ်းပါမည်...");
    window.location.href = "/login";
  }

  if (event.key === "theme_preference") {
    document.body.className = event.newValue;
  }
});

// Logout ခလုတ် နှိပ်လိုက်သည့်အခါ:
function performLogout() {
  localStorage.setItem("auth_logout", Date.now().toString()); // အခြား Tabs များဆီသို့ Event ရောက်သွားမည်
  window.location.href = "/login";
}
```

---

## ၃။ `QuotaExceededError`

`localStorage` ၏ 5MB ကုန်ဆုံးသွားပါက `QuotaExceededError` ဖြစ်ပေါ်သည်။ ထို့ကြောင့် Data မသိမ်းမီ Safe Wrapper ဖြင့် အမြဲစစ်ဆေးသင့်သည်:

```javascript
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22) {
      console.error("🚨 LocalStorage နေရာလွတ် မရှိတော့ပါ! Cache အဟောင်းများကို ရှင်းထုတ်နေပါသည်...");
      // Cache အဟောင်းများ ရှင်းလင်းခြင်း
      localStorage.removeItem("cached_analytics");
      localStorage.removeItem("temp_drafts");
    }
  }
}
```

---

## ၄။ Cookies လုံခြုံရေး

```
Set-Cookie: token=xyz; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=604800
```
* **`HttpOnly`**: JavaScript မှ လုံးဝ ဖတ်မရ (`document.cookie` တွင် မပါ)။ **XSS ကာကွယ်သည်။**
* **`Secure`**: HTTPS ဖြစ်မှသာ Browser က ပို့မည်။
* **`SameSite=Strict`**: Third-party link များမှ လာသော Request များတွင် Cookie ကို ချန်လှပ်ထားမည်။ **CSRF ကာကွယ်သည်။**

---

## ၅။ IndexedDB ကို Promises ဖြင့် အပြည့်အစုံ CRUD ရေးသားခြင်း

IndexedDB သည် Callback-based ဖြစ်သဖြင့် ခေတ်သစ် `async`/`await` ဖြင့် သုံးနိုင်ရန် Promise Wrapper တည်ဆောက်သုံးကြသည်:

```javascript
class OfflineProductDB {
  constructor(dbName = "OfflineShopDB", version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  async putProduct(product) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("products", "readwrite");
      const store = tx.objectStore("products");
      const req = store.put(product);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllProducts() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("products", "readonly");
      const store = tx.objectStore("products");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
}

// စမ်းသပ်ခြင်း:
// const offlineDB = new OfflineProductDB();
// await offlineDB.init();
// await offlineDB.putProduct({ id: 101, name: "Offline Notebook", price: 5 });
// const products = await offlineDB.getAllProducts();
```

---

## ၆။ Web Crypto API ဖြင့် Client-Side Encryption

Sensitive Data များကို localStorage ထဲ မထည့်မီ Browser Native **Web Crypto API (AES-GCM)** ဖြင့် Encrypt ပြုလုပ်ပုံ:

```javascript
async function generateAesKey() {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(text, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte initialization vector
  const encoded = new TextEncoder().encode(text);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ciphertext)),
  };
}
```
