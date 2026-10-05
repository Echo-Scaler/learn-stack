---
title: "07. Functions"
description: "Function ဆိုသည်မှာ သီးခြား သတ်မှတ်ထားသော အလုပ်တစ်ခုခု (Specific Task) ကို ပြီးမြောက်အောင် ဆောင်ရွက်ပေးနိုင်ရန် စုစည်းထားသော ပြန်လည် အသုံးပြုနိုင်သည့် ကုဒ်အစုအဝ"
---

## ⚙️ Function ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is a Function and Why do we use it?)

---

## ❓ ၁။ Function ဆိုတာဘာလဲ? (What is a Function?)

**Function** ဆိုသည်မှာ သီးခြား သတ်မှတ်ထားသော အလုပ်တစ်ခုခု (Specific Task) ကို ပြီးမြောက်အောင် ဆောင်ရွက်ပေးနိုင်ရန် စုစည်းထားသော **"ပြန်လည် အသုံးပြုနိုင်သည့် ကုဒ်အစုအဝေး (Reusable Block of Code)"** ဖြစ်ပါသည်။

- သာမန်ဘဝ ဥပမာ: အသီးဖျော်စက် (Blender) တစ်ခုနှင့် တူပါသည်။ သင်က သစ်သီးများ ထည့်ပေးလိုက်ပါက (Input/Parameters)၊ စက်က ကြိတ်ချေပေးပြီး (Processing Logic)၊ အရသာရှိသော ဖျော်ရည်တစ်ခွက် ပြန်လည် ထုတ်ပေးပါသည် (Output/Return Value)။
- တစ်ကြိမ် ရေးသားသတ်မှတ်ပြီးပါက လိုအပ်သည့် မည်သည့်နေရာတွင်မဆို အကြိမ်ပေါင်း ထောင်သောင်းမက ပြန်လည် ခေါ်ယူအသုံးချ (Call/Invoke) နိုင်ပါသည်။

---

## 💡 ၂။ Function ကို ဘာကြောင့် အသုံးပြုရသလဲ? (Why do we use Functions?)

Programmer တိုင်း လိုက်နာရသော အဓိက စည်းမျဉ်းတစ်ခုမှာ **DRY (Don't Repeat Yourself)** ဖြစ်ပါသည်။ ကုဒ်တစ်ခုတည်းကို ထပ်ခါတလဲလဲ မရေးရပါ။

### အကယ်၍ Function မသုံးပါက ဖြစ်ပေါ်လာမည့် ဆိုးကျိုးများ:
1. **ကုဒ်လိုင်းများ အဆမတန် ရှည်လျားခြင်း**: ဥပမာ - စျေးဝယ်စနစ်တွင် အခွန် (Tax 5%) တွက်ချက်သည့် logic ကို နေရာ ၅၀ တွင် အသုံးပြုလိုပါက ကုဒ် ၅၀ ကြိမ် လိုက်ရေးရမည်။
2. **ပြင်ဆင်ရ ခက်ခဲခြင်း**: အစိုးရက အခွန်နှုန်းကို ၇% သို့ တိုးမြှင့်လိုက်ပါက နေရာ ၅၀ စလုံးသို့ လိုက်လံပြင်ဆင်ရမည် (တစ်ခုခု ကျန်ခဲ့ပါက Bug ဖြစ်မည်)။
3. **Function သုံးထားပါက**: Function တစ်ခုတည်းတွင် ပြင်လိုက်ရုံဖြင့် အဆိုပါ Function ကို ခေါ်သုံးထားသော နေရာ ၅၀ စလုံး အလိုအလျောက် မှန်ကန်သွားမည် ဖြစ်ပါသည်။

---

## 🗂️ ၃။ Function တစ်ခု၏ အဓိက ဖွဲ့စည်းပုံ (Anatomy of a Function)

```
function functionName(ParameterType $parameter): ReturnType {
    // လုပ်ဆောင်မည့် အလုပ် (Logic)
    return $result;
}
```

- **Parameters / Arguments**: Function ထဲသို့ ပြင်ပမှ ပေးပို့လိုက်သော သတင်းအချက်အလက် (Input)
- **Logic**: Function အတွင်း တွက်ချက်လုပ်ဆောင်မှု
- **Return Statement**: အလုပ်ပြီးဆုံးပါက ပြင်ပသို့ ပြန်လည် ထုတ်ပေးလိုက်သော ရလဒ် (Output)

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Usage Examples)

### နမူနာ (၁): အခွန်နှင့် လျှော့ဈေး တွက်ချက်ပေးသည့် Function
```php
<?php
// PHP 7+ Strict Type Mode ဖွင့်ခြင်း (Type မှားယွင်းမှု ကင်းစေရန်)
declare(strict_types=1);

// Function သတ်မှတ်ခြင်း (Type Declarations ပါဝင်သည်)
function calculateFinalPrice(float $originalPrice, float $discountPercent = 0.0): float {
    $discountAmount = ($originalPrice * $discountPercent) / 100;
    $finalPrice = $originalPrice - $discountAmount;
    
    return $finalPrice;
}

// Function ကို နေရာအမျိုးမျိုးတွင် ပြန်လည် ခေါ်သုံးခြင်း
$item1 = calculateFinalPrice(100.0, 10.0); // ၁၀% လျှော့ဈေး
$item2 = calculateFinalPrice(50.0);        // Default 0% လျှော့ဈေး
$item3 = calculateFinalPrice(250.0, 20.0); // ၂၀% လျှော့ဈေး

echo "ပစ္စည်း (၁) နောက်ဆုံးကျသင့်ငွေ: \$$item1 <br>";
echo "ပစ္စည်း (၂) နောက်ဆုံးကျသင့်ငွေ: \$$item2 <br>";
echo "ပစ္စည်း (၃) နောက်ဆုံးကျသင့်ငွေ: \$$item3 <br>";
?>
```

---

### နမူနာ (၂): Variable Scope (Local vs Global Scope)
Function တစ်ခု အတွင်းတွင် သတ်မှတ်ထားသော Variable သည် အဆိုပါ Function အတွင်း၌သာ အသက်ဝင်ပြီး ပြင်ပမှ ခေါ်ယူ၍ မရနိုင်ပါ (Local Scope ဟု ခေါ်သည်)။
```php
<?php
$siteName = "MyHome Tech"; // Global Scope

function showMessage() {
    $greeting = "မင်္ဂလာပါ"; // Local Scope
    global $siteName;      // Global variable ကို ခေါ်သုံးလိုပါက global keyword သုံးရသည်

    echo "$greeting! $siteName မှ ကြိုဆိုပါသည်။<br>";
}

showMessage();

// echo $greeting; // Error တက်မည်: $greeting သည် function ပြင်ပတွင် မရှိပါ
?>
```

---

### နမူနာ (၃): Arrow Functions (PHP 7.4+ Modern Feature)
တစ်ကြောင်းတည်းဖြင့် ရိုးရှင်းသော အလုပ်များကို လုပ်ဆောင်ရာတွင် ကုဒ်လိုင်းတိုစေရန် Arrow Function (`fn() => ...`) ကို သုံးပါသည်။
```php
<?php
$pricesInUSD = [10, 25, 50, 100];
$exchangeRate = 3800;

// array_map နှင့် Arrow Function တွဲဖက်သုံး၍ မြန်မာကျပ်ငွေသို့ တစ်ကြိမ်တည်း ပြောင်းလဲခြင်း
$pricesInMMK = array_map(fn($usd) => $usd * $exchangeRate, $pricesInUSD);

echo "<pre>";
print_r($pricesInMMK);
echo "</pre>";
?>
```

---

## ⭐ ၅။ Function ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

လုပ်ငန်းခွင်ရှိ Advanced PHP Codebase များတွင် Function များကို အောက်ပါ အဆင့်မြင့် နည်းပညာများဖြင့် တွဲဖက် အသုံးချကြပါသည်:

### ၁။ Variadic Functions (မရေတွက်နိုင်သော Parameter များကို လက်ခံခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: Parameter အရေအတွက် မည်မျှလာမည်ကို အတိအကျ မသိရှိနိုင်သောအခါ `...` (Splat Operator) သုံး၍ အားလုံးကို Array အဖြစ် တစ်ခါတည်း ဖမ်းယူရန် သုံးသည်။
```php
function calculateGrandTotal(float ...$prices): float {
    return array_sum($prices);
}

// Parameter ၁ ခု၊ ၃ ခု၊ သို့မဟုတ် အခု ၁၀၀ ထည့်လည်း အလုပ်လုပ်သည်
echo calculateGrandTotal(10.5, 20.0, 50.0); // 80.5
```

### ၂။ Closures နှင့် `use` Keyword (ပြင်ပ Variable ကို ဆွဲသွင်းအသုံးပြုခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: Anonymous Function (Closure) အတွင်းသို့ Function ပြင်ပရှိ Variable ကို လှမ်းယူသုံးစွဲလိုသည့်အခါ `use` ကို သုံးရသည်။
```php
$discountPercent = 15;

$applyDiscount = function(float $amount) use ($discountPercent): float {
    return $amount - ($amount * ($discountPercent / 100));
};

echo $applyDiscount(100); // 85
```

### ၃။ Generator Functions နှင့် `yield` (Memory ချွေတာသော စနစ်ကြီးများအတွက်)
- **ဘာကြောင့်သုံးသလဲ**: CSV ဖိုင်ကြီးများ (သို့မဟုတ်) Database အချက်အလက် ၁ သိန်းကျော်ကို ဖတ်ရှုသည့်အခါ Array တစ်ခုလုံး Memory (RAM) ပေါ်တင်ပါက `Fatal Error: Allowed memory size exhausted` ဖြစ်သွားတတ်သည်။ **`yield`** ကို သုံးပါက Memory ကို သုညနီးပါး သုံးစွဲပြီး တစ်ကြောင်းချင်းစီသာ ဆွဲထုတ်ပေးသည်။
```php
function readLargeCsv(string $filePath): Generator {
    $handle = fopen($filePath, 'r');
    while (($row = fgetcsv($handle)) !== false) {
        yield $row; // Data တစ်ကြောင်းချင်းစီကိုသာ Memory ချွေတာပြီး ထုတ်ပေးသည်
    }
    fclose($handle);
}

// Memory မကုန်ဘဲ လိုင်းပေါင်း သန်းချီကို ဖတ်ရှုနိုင်ခြင်း
foreach (readLargeCsv('massive_orders.csv') as $orderRow) {
    // တစ်ကြောင်းချင်းစီ Process ပြုလုပ်ခြင်း
}
```

---

## 🎯 အနှစ်ချုပ် (Summary)
- Function သည် ပရိုဂရမ်တစ်ခုကို စနစ်တကျ Module များ ခွဲခြမ်းပေးသည်။
- ကုဒ်များကို ထပ်ခါတလဲလဲ မရေးရတော့ဘဲ ပြန်လည်အသုံးချနိုင်စေသည်။
- ပရောဂျက်ကြီးလာသောအခါ Bug ရှာဖွေရလွယ်ကူပြီး စနစ်ကို ထိန်းသိမ်းရ လွယ်ကူစေပါသည်။
