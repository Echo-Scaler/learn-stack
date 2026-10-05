---
title: "09. REST API and JSON"
description: "API ဆိုသည်မှာ ဆော့ဖ်ဝဲလ်စနစ် တစ်ခုနှင့်တစ်ခု အချင်းချင်း စကားပြောဆို ဆက်သွယ်နိုင်ရန် တည်ဆောက်ပေးထားသော ကြားခံ ပေါင်းကူးတံတား ဖြစ်ပါသည်။"
---

## 📡 REST API နှင့် JSON ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is a REST API, JSON and Why do we use them?)

---

## ❓ ၁။ API နှင့် JSON ဆိုတာဘာလဲ?

### (က) API (Application Programming Interface)
**API** ဆိုသည်မှာ ဆော့ဖ်ဝဲလ်စနစ် တစ်ခုနှင့်တစ်ခု အချင်းချင်း စကားပြောဆို ဆက်သွယ်နိုင်ရန် တည်ဆောက်ပေးထားသော **"ကြားခံ ပေါင်းကူးတံတား"** ဖြစ်ပါသည်။

- သာမန်ဘဝ ဥပမာ: စားသောက်ဆိုင်ရှိ **"စားပွဲထိုး (Waiter)"** နှင့် တူပါသည်။
  - သင် (Client / Mobile App) က စားပွဲထိုး (API) ထံ မီနူးမှာယူလိုက်ပါက
  - စားပွဲထိုးက မီးဖိုချောင် (Database / Server) သို့ သွားရောက် အော်ဒါပို့ပြီး
  - ချက်ပြုတ်ပြီးသော အစားအစာ (Data) ကို သင့်ထံ ပြန်လည် ယူဆောင်လာပေးပါသည်။

### (ခ) JSON (JavaScript Object Notation)
**JSON** ဆိုသည်မှာ စနစ်မတူညီသော စက်များအကြား (ဥပမာ- PHP Server နှင့် Flutter Android App) အချက်အလက်များ လဲလှယ်ရာတွင် ကမ္ဘာတစ်ဝှမ်း အသုံးအများဆုံးဖြစ်သော **"ပေါ့ပါးသည့် စာသားပုံစံ ဒေတာဖော်မတ်"** ဖြစ်ပါသည်။

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "မောင်မောင်",
    "email": "mgmg@gmail.com"
  }
}
```

---

## 💡 ၂။ REST API ကို ဘာကြောင့် အသုံးပြုရသလဲ?

ရှေးယခင်က PHP သည် HTML စာမျက်နှာများကိုသာ တိုက်ရိုက် Render လုပ်ပေးခဲ့သည်။ သို့သော် ယနေ့ခေတ်တွင်:
1. **Multi-Platform Support**: Website (React/Vue), Mobile App (iOS/Android), Smart Watch စသည်တို့အားလုံးသည် Backend Database တစ်ခုတည်းကို မျှဝေသုံးစွဲကြသည်။ HTML မဟုတ်ဘဲ စံသတ်မှတ်ချက်တူညီသော **JSON API** ဖြင့်သာ ၎င်းတို့အားလုံးကို အချက်အလက် ပို့ပေးနိုင်ပါသည်။
2. **Frontend & Backend သီးခြားခွဲထုတ်နိုင်ခြင်း (Decoupling)**: Frontend Designer က UI ကို စိတ်ကြိုက် ပြင်ဆင်နေချိန်တွင် Backend Developer က API Logic ကို သီးခြား တည်ဆောက်နိုင်ပါသည်။

---

## 🚦 ၃။ REST API ၏ အဓိက HTTP Methods (၄) မျိုး

| Method | လုပ်ဆောင်ချက် | ဥပမာ Endpoint |
| :--- | :--- | :--- |
| **GET** | ဒေတာများ ဆွဲယူဖတ်ရှုခြင်း (Read) | `GET /api/products` (ပစ္စည်းအားလုံး ကြည့်မည်) |
| **POST** | ဒေတာအသစ် ဖန်တီးထည့်သွင်းခြင်း (Create) | `POST /api/products` (ပစ္စည်းအသစ် ထည့်မည်) |
| **PUT / PATCH** | ရှိပြီးသား ဒေတာကို ပြင်ဆင်ခြင်း (Update) | `PUT /api/products/5` (ID 5 ပစ္စည်းကို ပြင်မည်) |
| **DELETE** | ဒေတာကို ဖျက်ပစ်ခြင်း (Delete) | `DELETE /api/products/5` (ID 5 ပစ္စည်းကို ဖျက်မည်) |

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Creating a PHP REST API)

ဖိုင်အမည်: `api/products.php`

```php
<?php
// 1. JSON Data ဖြစ်ကြောင်း Browser/Client သိစေရန် Header သတ်မှတ်ခြင်း
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // မည်သည့် domain မှမဆို ခေါ်ယူခွင့်ပြုခြင်း (CORS)

// Client က မည်သည့် Method ဖြင့် လှမ်းခေါ်သည်ကို စစ်ဆေးခြင်း
$method = $_SERVER['REQUEST_METHOD'];

// Database မှ ရရှိလာသော Sample Data
$products = [
    ["id" => 1, "name" => "Logitech MX Master 3S", "price" => 100],
    ["id" => 2, "name" => "Keychron K2 Keyboard", "price" => 85]
];

if ($method === 'GET') {
    // 200 OK Status ပြန်ပေးခြင်း
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data"   => $products
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST') {
    // Frontend / App မှ ပို့လိုက်သော JSON Body ကို ဖတ်ယူခြင်း
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (empty($inputData['name']) || empty($inputData['price'])) {
        http_response_code(422); // Unprocessable Entity
        echo json_encode([
            "status"  => "error",
            "message" => "ပစ္စည်းအမည်နှင့် ဈေးနှုန်း ထည့်သွင်းရန် လိုအပ်ပါသည်"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 201 Created Status ပြန်ပေးခြင်း
    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "ပစ္စည်းအသစ် အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ",
        "item"    => $inputData
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ခွင့်မပြုထားသော Method ဖြစ်ပါက
http_response_code(405); // Method Not Allowed
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
?>
```

---

## ⭐ ၅။ REST API ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

Mobile Apps နှင့် Frontend Framework များနှင့် ချိတ်ဆက်သော Production API များတွင် အောက်ပါ Features များကို မဖြစ်မနေ ထည့်သွင်းရပါသည်:

### ၁။ Bearer Token / JWT Authentication (လုံခြုံသော API ခေါ်ဆိုမှု)
- **ဘာကြောင့်သုံးသလဲ**: Mobile App များသည် Cookie မသုံးနိုင်သောကြောင့် Header မှတစ်ဆင့် `Authorization: Bearer <token>` ဖြင့် User ဘယ်သူဖြစ်ကြောင်း အတည်ပြုရန် သုံးသည်။
```php
function getBearerToken(): ?string {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

    if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $matches[1]; // Token တန်ဖိုးကို ခွဲထုတ်ယူခြင်း
    }
    return null;
}

$token = getBearerToken();
if (!$token || !validateJwtToken($token)) {
    http_response_code(401); // Unauthorized
    echo json_encode(["status" => "error", "message" => "အသုံးပြုခွင့် မရှိပါ၊ Login ပြန်ဝင်ပါ"]);
    exit;
}
```

### ၂။ Standardized Response Envelope (စံနှုန်းညီ Response ပုံစံ)
- အောင်မြင်သည်ဖြစ်စေ၊ မှားယွင်းသည်ဖြစ်စေ Frontend က အမြဲ အလွယ်တကူ သိနိုင်စေရန် တူညီသော JSON ပုံစံခွက် ထုတ်ပေးခြင်း:
```php
function apiResponse(bool $success, mixed $data = null, string $message = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode([
        'success'   => $success,
        'message'   => $message,
        'data'      => $data,
        'timestamp' => time()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// အသုံးပြုပုံ:
// apiResponse(true, $userList, "ရယူမှု အောင်မြင်ပါသည်");
// apiResponse(false, null, "ပစ္စည်း ရှာမတွေ့ပါ", 404);
```

### ၃။ API Pagination Metadata (စာမျက်နှာ အချက်အလက်များ ပြန်ပို့ပေးခြင်း)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 98
  }
}
```

---

## 🎯 အနှစ်ချုပ် (Summary)
- REST API သည် ခေတ်သစ် Web/Mobile Application များ၏ **အဓိက ကျောရိုး (Backbone)** ဖြစ်ပါသည်။
- PHP ဖြင့် ရေးသားထားသော REST API သည် မည်သည့် Frontend နည်းပညာ (React, Vue, Angular, Flutter, Swift, Kotlin) နှင့်မဆို ချိတ်ဆက် အလုပ်လုပ်နိုင်ပါသည်။
