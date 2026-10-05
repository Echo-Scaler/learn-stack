---
title: "07. Fetch API and AJAX"
description: "1. [fetch() API ၏ သဘောတရားနှင့် အရေးကြီးဆုံး စည်းမျဉ်း](#၁-fetch-api-၏-သဘောတရား)"
---

## 🚀 သင်ခန်းစာ (၇) - Fetch API နှင့် REST API ချိတ်ဆက်ခြင်း
### (Lesson 7: Mastering Modern Fetch API, CRUD Operations, Auto Refresh Token & Interceptors)

---

## 📌 မာတိကာ (Table of Contents)
1. [`fetch()` API ၏ သဘောတရားနှင့် အရေးကြီးဆုံး စည်းမျဉ်း](#၁-fetch-api-၏-သဘောတရား)
2. [HTTP Status Codes ကိုင်တွယ်ပုံ Taxonomy (401, 403, 422, 500)](#၂-http-status-codes-ကိုင်တွယ်ပုံ)
3. [အပြည့်အစုံ CRUD Operations (GET, POST, PUT/PATCH, DELETE)](#၃-အပြည့်အစုံ-crud-operations)
4. [`FormData` ဖြင့် Multiple Files Upload နှင့် Upload Progress](#၄-formdata-နှင့်-upload-progress)
5. [`AbortController` ဖြင့် Autocomplete Request Cancel ပြုလုပ်ခြင်း](#၅-abortcontroller)
6. [လုပ်ငန်းခွင်သုံး Enterprise Auto-Refresh Token Interceptor Pattern](#၆-auto-refresh-token-interceptor)
7. [Laravel Backend နှင့် ချိတ်ဆက်ရာတွင် CSRF & Validation (422) ကိုင်တွယ်ပုံ](#၇-laravel-validation-ကိုင်တွယ်ပုံ)

---

## ၁။ `fetch()` API ၏ သဘောတရား

ခေတ်ဟောင်း `XMLHttpRequest` အစား Promise-based **`fetch()`** API ကို အသုံးပြုသည်။

> ⚠️ **အရေးကြီးဆုံး သတိပြုရန်:**
> `fetch()` သည် Server ဘက်မှ **404 (Not Found)** သို့မဟုတ် **500 (Internal Server Error)** ပြန်လာသော်လည်း Promise ကို Reject **မလုပ်ပါ**! Network လိုင်းပြတ်တောက်ခြင်း သို့မဟုတ် CORS Error ဖြစ်မှသာ Reject ဖြစ်သည်။ ထို့ကြောင့် **`response.ok`** ကို မဖြစ်မနေ ကိုယ်တိုင် စစ်ဆေးရပါမည်။

---

## ၂။ HTTP Status Codes ကိုင်တွယ်ပုံ Taxonomy

လုပ်ငန်းခွင်တွင် Server မှ ပြန်လာသော Status Code ပေါ်မူတည်၍ သင့်လျော်သော Action ပြုလုပ်ရပါမည်:

* **200 OK / 201 Created**: Request အောင်မြင်သည် (JSON Parse ပြုလုပ်ပါ)။
* **400 Bad Request**: Client ပို့လိုက်သော Data ပုံစံ မှားယွင်းနေသည်။
* **401 Unauthorized**: Token မရှိခြင်း သို့မဟုတ် Expired ဖြစ်သွားခြင်း (Login သို့ redirect သို့မဟုတ် Token Refresh ခေါ်ရမည်)။
* **403 Forbidden**: Token မှန်သော်လည်း ယင်း Page/Action ကို လုပ်ဆောင်ရန် Permission မရှိခြင်း။
* **404 Not Found**: Endpoint လမ်းကြောင်း မရှိခြင်း။
* **422 Unprocessable Entity**: (Laravel Form Validation Error) Field တစ်ခုချင်းအလိုက် အမှားများ ပြန်လာသည်။
* **429 Too Many Requests**: Rate Limit ကျော်လွန်သွားခြင်း (ခေတ္တ စောင့်ခိုင်းရမည်)။
* **500 Internal Server Error**: Backend Code Crash ဖြစ်သွားခြင်း (User ထံ General Error ပြရမည်)။

---

## ၃။ အပြည့်အစုံ CRUD Operations

```javascript
const BASE_API_URL = "https://api.myproject.com/v1";

// 1. GET: Query Parameters ဖြင့် ရှာဖွေခြင်း
async function fetchProducts({ category = "all", page = 1, search = "" } = {}) {
  const url = new URL(`${BASE_API_URL}/products`);
  url.searchParams.append("category", category);
  url.searchParams.append("page", page);
  if (search) url.searchParams.append("q", search);

  const response = await fetch(url, {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
  return await response.json();
}

// 2. POST: ဒေတာ အသစ် ဖန်တီးခြင်း
async function createProduct(payload) {
  const response = await fetch(`${BASE_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData; // Validation errors ပါဝင်နိုင်သည်
  }

  return await response.json();
}

// 3. PATCH: သတ်မှတ် field တစ်ခုတည်းကို ပြင်ဆင်ခြင်း
async function updateProductStock(id, newStock) {
  const response = await fetch(`${BASE_API_URL}/products/${id}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ stock: newStock }),
  });
  return await response.json();
}

// 4. DELETE: အပြီးတိုင် ဖျက်ထုတ်ခြင်း
async function deleteProduct(id) {
  const response = await fetch(`${BASE_API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Delete failed");
  return true;
}
```

---

## ၄။ `FormData` နှင့် Upload Progress

Image Upload တင်ရာတွင် Header ၌ `Content-Type` မထည့်ရပါ။ Browser က Multipart Boundary ကို အလိုအလျောက် သတ်မှတ်ပေးသည်။

အကယ်၍ **Upload Progress (0% to 100%)** အတိအကျ လိုအပ်ပါက `XMLHttpRequest` ၏ `upload.onprogress` ကို အသုံးပြုနိုင်သည်:

```javascript
function uploadWithProgress(url, file, onProgressCallback) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    // Upload Progress စောင့်ကြည့်ခြင်း
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgressCallback(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network Error"));

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
    xhr.send(formData);
  });
}

// အသုံးပြုပုံ:
// uploadWithProgress("/api/upload", file, (percent) => console.log(`${percent}% uploaded`));
```

---

## ၅။ `AbortController`

User က စာရိုက်နေစဉ် နောက်ဆုံးရိုက်သော စကားလုံးအတွက်သာ API ခေါ်ပြီး ယခင် request အဟောင်းများကို ရပ်တန့်ခြင်း:

```javascript
let currentAbortController = null;

async function fetchAutocompleteSuggestions(keyword) {
  // ယခင် request ရှိပါက ဖျက်ပစ်မည်
  if (currentAbortController) {
    currentAbortController.abort();
  }

  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  try {
    const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(keyword)}`, { signal });
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      // User က စာအသစ် ထပ်ရိုက်လိုက်၍ ယခင်ကောင် cancel ဖြစ်သွားခြင်း (Error မဟုတ်ပါ)
      return null;
    }
    throw err;
  }
}
```

---

## ၆။ Enterprise Auto-Refresh Token Interceptor Pattern

User ၏ Access Token သက်တမ်း ကုန်ဆုံးသွား၍ **401 Unauthorized** ပြန်လာပါက နောက်ကွယ်တွင် Refresh Token ဖြင့် Token အသစ်ကို အလိုအလျောက် သွားယူပြီး မူလ Request ကို ပျက်ပြယ်မသွားစေဘဲ အသစ်ပြန်ခေါ်ပေးသော (Silent Refresh) Production Pattern:

```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

async function customFetch(url, options = {}) {
  let token = localStorage.getItem("access_token");

  options.headers = {
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response = await fetch(url, options);

  // အကယ်၍ 401 Unauthorized ဖြစ်ပါက Token Refresh ပြုလုပ်မည်
  if (response.status === 401) {
    if (isRefreshing) {
      // အခြား request များ run နေစဉ် စောင့်ဆိုင်းနေသော queue ထဲ ထည့်ထားမည်
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        options.headers["Authorization"] = `Bearer ${newToken}`;
        return fetch(url, options);
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Refresh token expired");
      }

      const data = await refreshResponse.json();
      localStorage.setItem("access_token", data.new_access_token);

      processQueue(null, data.new_access_token);

      // မူရင်း Failed ဖြစ်သွားသော Request ကို Token အသစ်ဖြင့် ပြန်လည် retry ခေါ်ယူခြင်း
      options.headers["Authorization"] = `Bearer ${data.new_access_token}`;
      return await fetch(url, options);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      localStorage.clear();
      window.location.href = "/login";
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}
```

---

## ၇။ Laravel Validation (422) ကိုင်တွယ်ပုံ

Laravel Backend API မှ Form Request Validation ကျရှုံးပါက ပြန်ပို့သော 422 JSON ကို Frontend UI တွင် Form Input အောက်၌ Error Messages ပြသပုံ:

```javascript
async function submitUserRegistration(formData) {
  try {
    const res = await customFetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.status === 422) {
      const validationError = await res.json();
      // validationError.errors => { email: ["Email already taken"], password: ["Too short"] }
      displayFormErrors(validationError.errors);
      return;
    }

    const data = await res.json();
    console.log("Registered:", data);
  } catch (err) {
    console.error("System error:", err);
  }
}

function displayFormErrors(errors) {
  // Input field အောက်တွင် error စာသားများ ထည့်သွင်းခြင်း
  for (const [fieldName, messages] of Object.entries(errors)) {
    const inputEl = document.querySelector(`[name="${fieldName}"]`);
    const errorContainer = document.querySelector(`#error-${fieldName}`);
    if (errorContainer) {
      errorContainer.textContent = messages[0]; // ပထမဆုံး error ကို ပြသမည်
    }
    inputEl?.classList.add("border-red-500");
  }
}
```
