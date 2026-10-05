---
title: "02. Arrays"
description: "ရိုးရိုး Variable တစ်ခုသည် တန်ဖိုး တစ်ခုတည်း ကိုသာ သိမ်းဆည်းနိုင်ပါသည်။ (ဥပမာ- $fruit = Apple;)"
---

## 📚 Array ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is an Array and Why do we use it?)

---

## ❓ ၁။ Array ဆိုတာဘာလဲ? (What is an Array?)

ရိုးရိုး Variable တစ်ခုသည် တန်ဖိုး **တစ်ခုတည်း** ကိုသာ သိမ်းဆည်းနိုင်ပါသည်။ (ဥပမာ- `$fruit = "Apple";`)

သို့သော် **Array** ဆိုသည်မှာ ဆက်စပ်နေသော တန်ဖိုးပေါင်းများစွာ (Multiple Values) ကို Variable **တစ်ခုတည်း** အောက်တွင် အစုအဝေးလိုက် စုစည်းသိမ်းဆည်းပေးနိုင်သော အထူး Data Structure တစ်ခု ဖြစ်ပါသည်။

- စိတ်ကူးကြည့်ရန် ဥပမာ: Variable သည် သာမန်စာအုပ်တစ်အုပ်ဖြစ်ပါက Array သည် စာအုပ်များစွာ စီထည့်ထားသော **"စာအုပ်စင် (Book Shelf)"** နှင့် တူပါသည်။

---

## 💡 ၂။ Array ကို ဘာကြောင့် အသုံးပြုရသလဲ? (Why do we use Arrays?)

သင့်တွင် ကျောင်းသား ၁၀၀ ဦး၏ အမည်များကို သိမ်းဆည်းရန် လိုအပ်သည်ဆိုပါစို့:
- **Array မသုံးပါက**:
  ```php
  $student1 = "မောင်မောင်";
  $student2 = "အောင်အောင်";
  $student3 = "ကျော်ကျော်";
  // ... $student100 အထိ variable ၁၀၀ ရေးရမည် (ကုဒ်များ ရှုပ်ပွပြီး ထိန်းသိမ်းရန် မဖြစ်နိုင်ပါ)
  ```
- **Array သုံးပါက**:
  ```php
  $students = ["မောင်မောင်", "အောင်အောင်", "ကျော်ကျော်", ...];
  // Variable တစ်ခုတည်းဖြင့် ကျောင်းသား ၁၀၀ စလုံးကို အလွယ်တကူ သိမ်းဆည်းနိုင်ပြီး Loop ပတ်၍ တစ်ကြိမ်တည်း ထုတ်ယူနိုင်ပါသည်!
  ```

### အဓိက အကျိုးကျေးဇူးများ:
1. **ကုဒ်လိုင်းများကို ထိရောက်စွာ လျှော့ချပေးခြင်း (Code Efficiency)**
2. **Loop များနှင့် တွဲဖက်၍ အချက်အလက်များစွာကို စက္ကန့်ပိုင်းအတွင်း စီမံနိုင်ခြင်း**
3. **Database မှ ရရှိလာသော Record စာရင်းများကို Array အနေဖြင့်သာ လက်ခံရရှိခြင်း**

---

## 🗂️ ၃။ PHP တွင် အသုံးပြုသော Array အမျိုးအစား (၃) မျိုး

### (က) Indexed Array (အညွှန်းကိန်းသုံး အာရေး)
- ဒေတာများကို နံပါတ် Index (၀ မှ စတင်သည်) ဖြင့် အစဉ်လိုက် သိမ်းဆည်းခြင်း။
```php
<?php
$cars = ["Toyota", "Honda", "BMW"];
// Index:    0         1        2

echo $cars[0]; // Output: Toyota
echo $cars[2]; // Output: BMW
?>
```

---

### (ခ) Associative Array (အမည်ပေး အညွှန်းသုံး အာရေး)
- နံပါတ်အစား မိမိစိတ်ကြိုက် သတ်မှတ်ထားသော **Key-Value Pair** (သော့ချက်နှင့် တန်ဖိုး) ဖြင့် သိမ်းဆည်းခြင်း။
- လူတစ်ဦး၏ ကိုယ်ရေးအချက်အလက် သို့မဟုတ် ပစ္စည်းတစ်ခု၏ အချက်အလက်များကို သိမ်းရန် အလွန်သင့်တော်သည်။
```php
<?php
$user = [
    "name" => "ကိုစိုး",
    "email" => "soesoe@gmail.com",
    "role" => "Software Engineer",
    "salary" => 1500000
];

echo "အမည်: " . $user["name"] . "<br>";
echo "ရာထူး: " . $user["role"] . "<br>";
?>
```

---

### (ဂ) Multidimensional Array (အဆင့်ဆင့်ထပ် အာရေး)
- Array တစ်ခု၏ အတွင်းထဲတွင် အခြား Array များကို ထပ်ဆင့် ထည့်သွင်းသိမ်းဆည်းထားခြင်း (Database Table တစ်ခုနှင့် အလားသဏ္ဌာန်တူသည်)။
```php
<?php
$products = [
    ["id" => 1, "name" => "iPhone 15", "price" => 3500000, "stock" => 5],
    ["id" => 2, "name" => "Samsung S24", "price" => 3200000, "stock" => 8],
    ["id" => 3, "name" => "Pixel 8", "price" => 2200000, "stock" => 3],
];

// ဒုတိယမြောက် ပစ္စည်း၏ အမည်ကို ထုတ်ယူခြင်း
echo $products[1]["name"]; // Output: Samsung S24
?>
```

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Practical Usage)

### Web Page ပေါ်တွင် E-Commerce Product List ပြသခြင်း
```php
<?php
$products = [
    ["name" => "Gaming Laptop", "price" => 1200, "status" => "In Stock"],
    ["name" => "Wireless Mouse", "price" => 25, "status" => "Out of Stock"],
    ["name" => "Mechanical Keyboard", "price" => 75, "status" => "In Stock"],
];
?>

<!DOCTYPE html>
<html>
<head><title>Product Catalog</title></head>
<body>
    <h2>ကုန်ပစ္စည်း စာရင်းများ</h2>
    <table border="1" cellpadding="8" cellspacing="0">
        <tr>
            <th>စဉ်</th>
            <th>ပစ္စည်းအမည်</th>
            <th>ဈေးနှုန်း ($)</th>
            <th>အခြေအနေ</th>
        </tr>
        <?php foreach ($products as $index => $item): ?>
        <tr>
            <td><?= $index + 1 ?></td>
            <td><?= $item["name"] ?></td>
            <td>$<?= number_format($item["price"], 2) ?></td>
            <td>
                <span style="color: <?= $item["status"] === 'In Stock' ? 'green' : 'red' ?>;">
                    <?= $item["status"] ?>
                </span>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
```

---

## 🛠️ ၅။ မကြာခဏ အသုံးများသော Array Functions များ

| Function | လုပ်ဆောင်ချက် | ဥပမာ |
| :--- | :--- | :--- |
| `count($arr)` | Array ထဲရှိ item အရေအတွက်ကို ရေတွက်သည် | `echo count($products);` |
| `in_array($val, $arr)` | တန်ဖိုးတစ်ခု ပါမပါ စစ်ဆေးသည် (True/False) | `if (in_array("BMW", $cars))` |
| `array_push($arr, $item)` | Array ၏ နောက်ဆုံးတွင် item အသစ် ထပ်ထည့်သည် | `array_push($cars, "Ford");` |
| `array_keys($arr)` | Associative array ၏ Key များကိုသာ ခွဲထုတ်ယူသည် | `print_r(array_keys($user));` |
| `array_merge($arr1, $arr2)` | Array နှစ်ခု သို့မဟုတ် ထို့ထက်ပိုသည်ကို ပေါင်းစပ်သည် | `$all = array_merge($a, $b);` |

---

## ⭐ ၆။ Array ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

ခေတ်သစ် PHP Development တွင် အောက်ပါ Array Features များကို စနစ်ကြီးများ ရေးသားရာတွင် နေ့စဉ် မဖြစ်မနေ အသုံးပြုကြပါသည်:

### ၁။ Array Destructuring (အာရေးထဲမှ တန်ဖိုးများကို တစ်ပြိုင်နက် ခွဲထုတ်ခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: ကုဒ်လိုင်းတိုစေပြီး Database Row များမှ တန်ဖိုးများကို Variable သီးခြားစီအဖြစ် စက္ကန့်ပိုင်းအတွင်း ခွဲထုတ်ယူနိုင်သည် (ES6 JavaScript ကဲ့သို့)။
```php
// Indexed Array Destructuring:
$point = [19.7633, 96.0785];
[$latitude, $longitude] = $point;
echo "Lat: $latitude, Long: $longitude";

// Associative Array Destructuring (PHP 7.1+):
$product = ["title" => "iPhone 15", "cost" => 1200, "qty" => 3];
["title" => $title, "cost" => $cost] = $product;
echo "$title ၏ စျေးနှုန်းမှာ \$$cost ဖြစ်သည်";
```

### ၂။ Array Spread Operator (`...`) (PHP 7.4+ / 8.1+)
- **ဘာကြောင့်သုံးသလဲ**: `array_merge()` ထက် များစွာ ပိုမိုမြန်ဆန်ပြီး သန့်ရှင်းစွာ Array များကို ပေါင်းစပ်နိုင်ခြင်း။
```php
$defaultSettings = ['theme' => 'light', 'notifications' => true];
$userSettings = ['theme' => 'dark'];

// နောက်မှလာသော Setting က အဟောင်းကို overwrite လုပ်သွားမည်
$finalSettings = [...$defaultSettings, ...$userSettings];
// ရလဒ်: ['theme' => 'dark', 'notifications' => true]
```

### ၃။ စိတ်ကြိုက် အစီအစဉ်စီခြင်း (`usort` / `uasort`)
- **ဘာကြောင့်သုံးသလဲ**: E-Commerce Website တွင် ပစ္စည်းများကို "ဈေးအနည်းမှ အများ" သို့မဟုတ် "ရက်စွဲ အသစ်ဆုံး" အစီအစဉ်အတိုင်း စီပေးရာတွင် အသုံးများသည်။
```php
$items = [
    ["name" => "Keyboard", "price" => 80],
    ["name" => "Mouse",    "price" => 25],
    ["name" => "Monitor",  "price" => 300],
];

// ဈေးနှုန်း အနည်းမှ အများသို့ စီခြင်း (Spaceship Operator <=> ဖြင့်)
usort($items, fn($a, $b) => $a['price'] <=> $b['price']);
```

### ၄။ Batch Processing အတွက် `array_chunk()`
- **ဘာကြောင့်သုံးသလဲ**: အချက်အလက် ၁ သောင်းကျော်ကို Database ထဲ တစ်ကြိမ်တည်း ထည့်ပါက Server Crash ဖြစ်တတ်သည်။ `array_chunk($data, 500)` ဖြင့် အပိုင်း ၅၀၀ စီ ခွဲ၍ ထည့်သွင်းရာတွင် သုံးသည်။
```php
$allUserIds = range(1, 1000); // User ၁၀၀၀
$batches = array_chunk($allUserIds, 250); // တစ်သုတ်လျှင် ၂၅၀ စီ အုပ်စု ၄ ခု ခွဲပေးသည်

foreach ($batches as $batch) {
    // အုပ်စုလိုက် Notification ပို့ခြင်း သို့မဟုတ် DB ထဲ ထည့်ခြင်း
}
```

---

## 🎯 အနှစ်ချုပ် (Summary)
Array သည် PHP Backend တွင် **Database မှ Data များ ဆွဲထုတ်ပြသခြင်း**၊ **Shopping Cart တွက်ချက်ခြင်း**၊ **API Response ဖန်တီးခြင်း** စသည့် နေရာတိုင်းတွင် အခြေခံအကျဆုံးနှင့် မရှိမဖြစ် အရေးအပါဆုံး ကဏ္ဍ ဖြစ်ပါသည်။
