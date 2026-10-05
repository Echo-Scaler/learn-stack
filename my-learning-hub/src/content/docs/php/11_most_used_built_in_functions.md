---
title: "11. Built-in Functions"
description: "PHP တွင် သင့်အတွက် အသင့်ဖန်တီးပေးထားသော Built-in Functions ထောင်ပေါင်းများစွာ ရှိပါသည်။ သို့သော် လက်တွေ့ လုပ်ငန်းခွင်တွင် ၈၀% သော အလုပ်များကို ပြီးမြောက်စေသော အ"
---

## 🛠️ လုပ်ငန်းခွင်တွင် နေ့စဉ် မဖြစ်မနေ သုံးရသော PHP Default Built-in Functions များ
### (Most Used PHP Default Functions in Real-World Development)

PHP တွင် သင့်အတွက် အသင့်ဖန်တီးပေးထားသော Built-in Functions ထောင်ပေါင်းများစွာ ရှိပါသည်။ သို့သော် လက်တွေ့ လုပ်ငန်းခွင်တွင် **၈၀% သော အလုပ်များကို ပြီးမြောက်စေသော အဓိက Functions များ** ကို အောက်ပါအတိုင်း ကဏ္ဍအလိုက် အသေးစိတ် ခွဲခြားလေ့လာနိုင်ပါသည်။

---

## 📑 မာတိကာ (Categories)
1. [String Manipulation Functions (စာသားကိုင်တွယ်ခြင်း)](#၁-string-manipulation-functions-စာသားကိုင်တွယ်ခြင်း)
2. [Array Manipulation Functions (အာရေးစီမံခြင်း)](#၂-array-manipulation-functions-အာရေးစီမံခြင်း)
3. [Type Checking & Validation Functions (ဒေတာစစ်ဆေးခြင်း)](#၃-type-checking--validation-functions-ဒေတာစစ်ဆေးခြင်း)
4. [Date & Time Functions (ရက်စွဲနှင့် အချိန်)](#၄-date--time-functions-ရက်စွဲနှင့်-အချိန်)
5. [File System & I/O Functions (ဖိုင်ကိုင်တွယ်ခြင်း)](#၅-file-system--io-functions-ဖိုင်ကိုင်တွယ်ခြင်း)
6. [JSON & Data Serialization Functions](#၆-json--data-serialization-functions)

---

## ၁။ String Manipulation Functions (စာသားကိုင်တွယ်ခြင်း)

Web Development တွင် User Input၊ URLs နှင့် Database စာသားများကို ပြုပြင်ရာတွင် အောက်ပါ Functions များကို နေ့စဉ် အသုံးပြုရပါသည်:

### ၁. `trim($str)`
- **ဘာလုပ်သလဲ**: စာသား၏ ရှေ့နှင့် နောက်တွင် ပါလာသော မလိုလားအပ်သည့် Space (နေရာလွတ်) များကို ဖြတ်ထုတ်ပေးသည်။
- **လက်တွေ့အသုံး**: Login/Registration Form တိုင်းတွင် User မတော်တဆ ရိုက်မိသော space များကို ရှင်းလင်းရန်။
```php
$input = "   aungaung@gmail.com   ";
$cleanEmail = trim($input); // "aungaung@gmail.com"
```

### ၂. `explode($delimiter, $string)` နှင့် `implode($glue, $array)`
- **`explode`**: စာသားတစ်ခုကို သတ်မှတ်ထားသော အမှတ်အသား (ဥပမာ- ကော်မာ `,`) ဖြင့် ခွဲ၍ Array အဖြစ် ပြောင်းပေးသည်။
- **`implode` (သို့မဟုတ် `join`)**: Array ထဲရှိ item များကို စာသားတစ်ခုတည်းအဖြစ် ပေါင်းစပ်ပေးသည်။
```php
// explode နမူနာ: Tag စာသားကို Array ပြောင်းခြင်း
$tags = "php,laravel,backend,mysql";
$tagArray = explode(",", $tags); 
// ရလဒ်: ["php", "laravel", "backend", "mysql"]

// implode နမူနာ: Array ကို SQL WHERE IN အတွက် စာသားပြောင်းခြင်း
$ids = [101, 102, 105];
$idString = implode(", ", $ids); // "101, 102, 105"
```

### ၃. `str_contains($haystack, $needle)` (PHP 8+)
- **ဘာလုပ်သလဲ**: စာသားတစ်ခုထဲတွင် မိမိရှာဖွေလိုသော စကားလုံး ပါ/မပါ စစ်ဆေးပေးသည် (True/False ပြန်ပေးသည်)။
```php
$url = "https://myshop.com/admin/dashboard";

if (str_contains($url, "/admin")) {
    echo "Admin စာမျက်နှာ ဖြစ်ပါသည်";
}
```

### ၄. `str_replace($search, $replace, $subject)`
- **ဘာလုပ်သလဲ**: စာသားထဲရှိ စကားလုံးတစ်လုံးကို အခြားစကားလုံးဖြင့် အစားထိုးလဲလှယ်ပေးသည်။
```php
$template = "မင်္ဂလာပါ {NAME}, သင်၏ Balance မှာ {AMOUNT} ဖြစ်ပါသည်။";
$message = str_replace(
    ["{NAME}", "{AMOUNT}"],
    ["ကိုမင်းမင်း", "50,000 ကျပ်"],
    $template
);
// Output: "မင်္ဂလာပါ ကိုမင်းမင်း, သင်၏ Balance မှာ 50,000 ကျပ် ဖြစ်ပါသည်။"
```

### ၅. `substr($string, $start, $length)`
- **ဘာလုပ်သလဲ**: စာသား၏ အစိတ်အပိုင်းတစ်ခုကို ဖြတ်ယူပေးသည်။
```php
$blogBody = "PHP သည် ကမ္ဘာပေါ်တွင် အသုံးအများဆုံး Server-side ဘာသာစကား ဖြစ်ပါသည်။";
$preview = substr($blogBody, 0, 30) . "..."; // စာလုံးရေ ၃၀ သာ ဖြတ်ယူခြင်း
```

---

## ၂။ Array Manipulation Functions (အာရေးစီမံခြင်း)

Data Analysis နှင့် Database Records များကို စီမံရာတွင် မပါမဖြစ် သုံးရသော စွမ်းဆောင်ရည်မြင့် Functions များ ဖြစ်ပါသည်:

### ၁. `array_column($array, $column_key)`
- **ဘာလုပ်သလဲ**: Multidimensional Array သို့မဟုတ် Database Query Record များထဲမှ မိမိလိုချင်သော Column တစ်ခုတည်းကိုသာ သီးသန့် ခွဲထုတ်ပေးသည်။
```php
$users = [
    ["id" => 1, "name" => "Aung Aung", "email" => "aung@gmail.com"],
    ["id" => 2, "name" => "Aye Aye",   "email" => "aye@gmail.com"],
    ["id" => 3, "name" => "Zaw Zaw",   "email" => "zaw@gmail.com"],
];

// Email များကိုသာ သီးခြား Array အဖြစ် ထုတ်ယူခြင်း
$emails = array_column($users, 'email');
// ရလဒ်: ["aung@gmail.com", "aye@gmail.com", "zaw@gmail.com"]
```

### ၂. `array_map($callback, $array)`
- **ဘာလုပ်သလဲ**: Array ထဲရှိ item တစ်ခုချင်းစီကို သတ်မှတ်ထားသော Function ဖြင့် ပြုပြင်ပြောင်းလဲပေးသည်။
```php
$prices = [1000, 2500, 5000];
$taxRate = 1.05; // 5% tax

$finalPrices = array_map(fn($p) => $p * $taxRate, $prices);
// ရလဒ်: [1050, 2625, 5250]
```

### ၃. `array_filter($array, $callback)`
- **ဘာလုပ်သလဲ**: မိမိပေးထားသော စည်းကမ်းချက်နှင့် ကိုက်ညီသော Data များကိုသာ စစ်ထုတ်ယူပေးသည်။
```php
$products = [
    ["name" => "Laptop", "stock" => 5],
    ["name" => "Mouse",  "stock" => 0],
    ["name" => "Keyboard", "stock" => 12],
];

// ပစ္စည်းလက်ကျန် (stock > 0) ရှိသည်များကိုသာ ရွေးထုတ်ခြင်း
$inStockItems = array_filter($products, fn($item) => $item['stock'] > 0);
```

### ၄. `in_array($needle, $haystack)` နှင့် `array_key_exists($key, $array)`
- **`in_array`**: တန်ဖိုးတစ်ခုသည် Array ထဲတွင် ပါမပါ စစ်သည်။
- **`array_key_exists`**: သတ်မှတ်ထားသော Key သည် Associative array ထဲ ပါမပါ စစ်သည်။
```php
$allowedRoles = ['admin', 'manager', 'editor'];
if (in_array('admin', $allowedRoles)) {
    echo "ခွင့်ပြုထားသော အဆင့် ဖြစ်သည်";
}
```

### ၅. `array_unique($array)` နှင့် `array_merge($array1, $array2)`
- **`array_unique`**: Array ထဲရှိ ထပ်နေသော ဒေတာများကို ဖယ်ရှားပေးသည်။
- **`array_merge`**: Array အချင်းချင်း ပေါင်းစပ်ပေးသည်။

---

## ၃။ Type Checking & Validation Functions (ဒေတာစစ်ဆေးခြင်း)

PHP တွင် Bug မဖြစ်စေရန် Data များကို ကြိုတင် စစ်ဆေးသည့် Functions များ:

| Function | လုပ်ဆောင်ချက် | အသုံးပြုပုံ နမူနာ |
| :--- | :--- | :--- |
| `isset($var)` | Variable တည်ရှိပြီး `null` မဟုတ်ကြောင်း စစ်သည် | `if (isset($_POST['submit']))` |
| `empty($var)` | Variable မရှိခြင်း၊ သို့မဟုတ် `""`, `0`, `null`, `false`, `[]` ဖြစ်မဖြစ် စစ်သည် | `if (empty($username))` |
| `is_null($var)` | တန်ဖိုးသည် အတိအကျ `null` ဖြစ်မဖြစ် စစ်သည် | `if (is_null($deletedAt))` |
| `is_array($var)` | ဒေတာသည် Array ဟုတ်မဟုတ် စစ်သည် | `if (is_array($data))` |
| `is_numeric($var)` | ကိန်းဂဏန်း (သို့မဟုတ် ဂဏန်းစာသား "123") ဟုတ်မဟုတ် စစ်သည် | `if (is_numeric($_GET['id']))` |
| `filter_var($var, FILTER_VALIDATE_EMAIL)` | Email ပုံစံ မှန်ကန်မှု စစ်ဆေးသည် | `if (filter_var($email, FILTER_VALIDATE_EMAIL))` |

---

## ၄။ Date & Time Functions (ရက်စွဲနှင့် အချိန်)

### ၁. `date($format, $timestamp)`
- **ဘာလုပ်သလဲ**: ရက်စွဲနှင့် အချိန်ကို လိုချင်သော ပုံစံဖြင့် ဖော်ပြပေးသည်။
```php
echo date("Y-m-d H:i:s"); // 2026-09-23 21:15:30 (MySQL DATETIME format)
echo date("d/m/Y");       // 23/09/2026
```

### ၂. `strtotime($timeString)`
- **ဘာလုပ်သလဲ**: လူသားဖတ်နိုင်သော စာသားကို Timestamp စက္ကန့်အဖြစ် ပြောင်းပေးသည်။
```php
$nextWeek = date("Y-m-d", strtotime("+1 week"));
$yesterday = date("Y-m-d", strtotime("-1 day"));
$endOfMonth = date("Y-m-d", strtotime("last day of this month"));
```

### ၃. ခေတ်သစ် OOP စနစ်: `DateTimeImmutable` (လုပ်ငန်းခွင်သုံး စံနှုန်း)
Laravel, Symfony, EC-CUBE စသည့် Framework များတွင် `date()` ထက် `DateTimeImmutable` ကို ဦးစားပေးသုံးပါသည်:
```php
$now = new DateTimeImmutable('now', new DateTimeZone('Asia/Yangon'));
$expiry = $now->modify('+30 days');

echo "စတင်သည့်ရက်: " . $now->format('Y-m-d') . "<br>";
echo "သက်တမ်းကုန်ရက်: " . $expiry->format('Y-m-d');
```

---

## ၅။ File System & I/O Functions (ဖိုင်ကိုင်တွယ်ခြင်း)

ဖိုင်ဖတ်ခြင်း၊ ဖိုင်သိမ်းခြင်း၊ ပုံတင်ခြင်း (Upload) စနစ်များအတွက် မရှိမဖြစ် Functions များ:

### ၁. `file_get_contents($path)` နှင့် `file_put_contents($path, $data)`
- **`file_get_contents`**: ဖိုင်တစ်ခုလုံး၏ အကြောင်းအရာကို စာသားအဖြစ် ဖတ်ယူခြင်း (API ခေါ်ဆိုရာတွင်လည်း သုံးနိုင်သည်)။
- **`file_put_contents`**: ဖိုင်ထဲသို့ စာသားများကို လွယ်ကူစွာ ရေးသားသိမ်းဆည်းခြင်း။
```php
// ဖိုင်ထဲသို့ Log မှတ်တမ်း ရေးသားခြင်း
$logMessage = "[" . date("Y-m-d H:i:s") . "] User ID 5 logged in.\n";
file_put_contents("storage/logs/app.log", $logMessage, FILE_APPEND); // FILE_APPEND သည် အဟောင်းမပျက်ဘဲ အနောက်က ထပ်ရေးစေသည်
```

### ၂. `file_exists($path)`, `is_dir($path)`, `unlink($path)`
```php
$filePath = "uploads/avatar.jpg";

if (file_exists($filePath)) {
    unlink($filePath); // ဖိုင်ကို ဖျက်ပစ်ခြင်း (Delete file)
    echo "ဖိုင်ကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ";
}
```

### ၃. `move_uploaded_file($from, $to)`
Form မှ တင်လိုက်သော ပုံ သို့မဟုတ် ဖိုင်ကို ယာယီနေရာ (`tmp_name`) မှ အမြဲတမ်း သိမ်းမည့်နေရာသို့ လွှဲပြောင်းပေးခြင်း:
```php
if (isset($_FILES['photo'])) {
    $temp = $_FILES['photo']['tmp_name'];
    $destination = "uploads/" . basename($_FILES['photo']['name']);
    
    if (move_uploaded_file($temp, $destination)) {
        echo "ပုံတင်ခြင်း အောင်မြင်ပါသည်!";
    }
}
```

---

## ၆။ JSON & Data Serialization Functions

REST API နှင့် Cache စနစ်များတွင် မရှိမဖြစ် လိုအပ်ပါသည်:

### ၁. `json_encode($data)`
- **ဘာလုပ်သလဲ**: PHP Array/Object ကို JSON String အဖြစ် ပြောင်းပေးသည်။
```php
$data = ["status" => "success", "message" => "မင်္ဂလာပါ"];
echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
```

### ၂။ `json_decode($jsonString, $associative)`
- **ဘာလုပ်သလဲ**: JSON String ကို PHP Array အဖြစ် ပြန်လည် ပြောင်းလဲပေးသည်။
```php
$json = '{"name":"iPhone 15","price":1200}';
$item = json_decode($json, true); // true ပေးပါက Associative Array ပြန်ရသည်

echo $item["name"]; // "iPhone 15"
```

---

## ၇။ Regular Expression Functions (Regex စစ်ဆေးခြင်းနှင့် ပြုပြင်ခြင်း)

ဖုန်းနံပါတ်၊ စကားဝှက် စည်းကမ်းချက်များနှင့် စာသားပုံစံ စစ်ဆေးရာတွင် မရှိမဖြစ် Functions များ:

### ၁. `preg_match($pattern, $subject, $matches)`
- **ဘာလုပ်သလဲ**: စာသားတစ်ခုသည် မိမိသတ်မှတ်ထားသော Pattern (Regex) နှင့် ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးသည် (True/False ပြန်ပေးသည်)။
```php
// မြန်မာပြည်တွင်း ဖုန်းနံပါတ် (09xxxxxxxxx) ပုံစံ စစ်ဆေးခြင်း
$phone = "09450012345";
if (preg_match('/^(09|\+?959)\d{7,9}$/', $phone)) {
    echo "မှန်ကန်သော ဖုန်းနံပါတ် ဖြစ်ပါသည်";
} else {
    echo "ဖုန်းနံပါတ် ပုံစံ မှားယွင်းနေပါသည်";
}
```

### ၂. `preg_replace($pattern, $replacement, $subject)`
- **ဘာလုပ်သလဲ**: စာသားထဲရှိ မလိုလားအပ်သော အက္ခရာများကို Regex စည်းကမ်းဖြင့် ဖြတ်ထုတ်ခြင်း သို့မဟုတ် အစားထိုးခြင်း။
```php
// ဖုန်းနံပါတ်ထဲမှ space, dash (-) များကို ရှင်းလင်းပြီး ဂဏန်းချည်း သီးသန့် ထုတ်ယူခြင်း
$rawPhone = "09-450 012 345";
$cleanNumber = preg_replace('/[^0-9]/', '', $rawPhone); // "09450012345"
```

---

## ၈။ URL & Financial Formatting Utilities (လုပ်ငန်းခွင်သုံး အထွေထွေ အသုံးချမှုများ)

### ၁. `http_build_query($data)`
- **ဘာကြောင့်သုံးသလဲ**: Associative Array တစ်ခုကို URL Query String အဖြစ် အလိုအလျောက် URL-encode ပြုလုပ်ပေးသည် (Payment Gateway သို့မဟုတ် Third-party API ချိတ်ဆက်ရာတွင် အလွန်အသုံးများသည်)။
```php
$params = [
    'merchant_id' => 'MYHOME_01',
    'amount'      => 50000,
    'callback'    => 'https://myshop.com/payment/callback'
];

echo http_build_query($params);
// Output: merchant_id=MYHOME_01&amount=50000&callback=https%3A%2F%2Fmyshop.com%2Fpayment%2Fcallback
```

### ၂. `number_format($number, $decimals, $dec_point, $thousands_sep)`
- **ဘာကြောင့်သုံးသလဲ**: ငွေကြေးပမာဏများကို ကော်မာ (`,`) ခံ၍ သပ်ရပ်စွာ ပြသရန် သုံးသည်။
```php
$amount = 1250000.75;
echo number_format($amount, 2) . " ကျပ်"; // 1,250,000.75 ကျပ်
```

### ၃. Performance Profiling: `microtime(true)` & `memory_get_usage()`
- **ဘာကြောင့်သုံးသလဲ**: ကုဒ် သို့မဟုတ် SQL Query တစ်ခု run ရန် အချိန်မည်မျှ ကြာပြီး Memory မည်မျှ သုံးစွဲသည်ကို တိုင်းတာရန်။
```php
$startTime = microtime(true);

// အလုပ်လုပ်ဆောင်ခြင်း (Query or Heavy loop)
$endTime = microtime(true);
$executionTime = ($endTime - $startTime);

echo "ကြာချိန်: " . number_format($executionTime, 4) . " စက္ကန့်<br>";
echo "Memory သုံးစွဲမှု: " . (memory_get_usage() / 1024 / 1024) . " MB";
```

---

## 🎯 အနှစ်ချုပ် (Summary)
ဤ Built-in Functions များကို ကျွမ်းကျင်စွာ အသုံးပြုနိုင်ပါက မည်သည့် PHP Codebase (Laravel, Symfony, WordPress, EC-CUBE) တွင်မဆို မြန်ဆန်ထိရောက်စွာ ရေးသားနိုင်မည် ဖြစ်ပါသည်။
