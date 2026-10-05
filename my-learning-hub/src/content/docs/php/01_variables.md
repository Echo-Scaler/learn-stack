---
title: "01. Variables"
description: "Variable ဆိုသည်မှာ ကွန်ပျူတာ Memory (RAM) ပေါ်တွင် ဒေတာ (Data/Information) များကို ခေတ္တ သိမ်းဆည်းထားရန် သတ်မှတ်ပေးထားသော တန်ဖိုးထည့်သည့် သေတ္တာ (သို့မဟုတ်) အမ"
---

## 📦 Variable ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is a Variable and Why do we use it?)

---

## ❓ ၁။ Variable ဆိုတာဘာလဲ? (What is a Variable?)

**Variable** ဆိုသည်မှာ ကွန်ပျူတာ Memory (RAM) ပေါ်တွင် ဒေတာ (Data/Information) များကို ခေတ္တ သိမ်းဆည်းထားရန် သတ်မှတ်ပေးထားသော **"တန်ဖိုးထည့်သည့် သေတ္တာ (သို့မဟုတ်) အမည်တပ်ထားသော နေရာ"** ဖြစ်ပါသည်။

- လူတစ်ယောက်တွင် "အမည်"၊ "အသက်"၊ "နေရပ်" စသည့် အချက်အလက်များ ရှိသကဲ့သို့ ပရိုဂရမ်တစ်ခုတွင်လည်း အသုံးပြုသူ၏ အချက်အလက်များကို ခေတ္တ မှတ်သားထားရန် Variable လိုအပ်ပါသည်။
- PHP တွင် Variable တစ်ခု သတ်မှတ်မည်ဆိုပါက အမြဲတမ်း **`$` (Dollar sign)** ဖြင့် စတင်ရပါသည်။ (ဥပမာ- `$name`, `$age`)

---

## 💡 ၂။ Variable ကို ဘာကြောင့် အသုံးပြုရသလဲ? (Why do we use Variables?)

အကယ်၍ Variable သာ မရှိပါက:
1. **ဒေတာများကို ပြန်လည်အသုံးမပြုနိုင်ခြင်း (No Reusability)**: တန်ဖိုးတစ်ခုခုကို နေရာတိုင်းတွင် ထပ်ခါထပ်ခါ လက်ဖြင့် လိုက်ရိုက်နေရမည်။
2. **တန်ဖိုးပြောင်းလဲရန် မလွယ်ကူခြင်း**: ဥပမာ - ကုမ္ပဏီအမည် "MyHome Tech" ကို ဖိုင်ပေါင်း ၁၀၀ တွင် ရေးထားပါက နာမည်ပြောင်းသည့်အခါ ဖိုင် ၁၀၀ စလုံး လိုက်ပြင်ရမည်။ Variable သုံးထားပါက `$company = "MyHome Tech";` ဟု တစ်နေရာတည်း ပြင်လိုက်ရုံဖြင့် အားလုံး အလိုအလျောက် ပြောင်းလဲသွားမည်။
3. **Dynamic Calculations (တွက်ချက်မှုများ ပြုလုပ်နိုင်ခြင်း)**: စျေးဝယ်သူ ဝယ်ယူသည့် ပစ္စည်းအရေအတွက်နှင့် စျေးနှုန်းကို မြှောက်ပြီး စုစုပေါင်း ကျသင့်ငွေ တွက်ချက်လိုသည့်အခါ Variable မပါဘဲ တွက်ချက်၍ မရနိုင်ပါ။

---

## 🗂️ ၃။ Variable တွင် သိမ်းဆည်းနိုင်သော Data Types များ

PHP တွင် Variable ထဲသို့ အောက်ပါ အချက်အလက် အမျိုးအစားများကို ထည့်သွင်းနိုင်ပါသည်:

| Data Type | ရှင်းလင်းချက် | ဥပမာ |
| :--- | :--- | :--- |
| **String** | စာသားများ (Single or Double Quotes ဖြင့် ရေးသည်) | `$name = "မောင်မောင်";` |
| **Integer** | အနှုတ်/အပေါင်း ကိန်းပြည့်များ (ဒသမမပါ) | `$age = 25;` |
| **Float (Double)** | ဒသမပါသော ကိန်းဂဏန်းများ | `$price = 99.99;` |
| **Boolean** | မှန်/မှား တန်ဖိုး (True သို့မဟုတ် False) | `$isLoggedIn = true;` |
| **Array** | တန်ဖိုးတစ်ခုထက်ပို၍ အစုလိုက် သိမ်းခြင်း | `$colors = ["Red", "Green"];` |
| **NULL** | တန်ဖိုးလုံးဝ မရှိသေးကြောင်း သတ်မှတ်ခြင်း | `$address = null;` |

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Usage Examples)

### နမူနာ (၁): အခြေခံ Variable အသုံးပြုပုံနှင့် စာသားဆက်ခြင်း (Concatenation)
```php
<?php
// Variable များ သတ်မှတ်ခြင်း
$firstName = "သီဟ";
$lastName = "အောင်";
$age = 23;
$city = "ရန်ကုန်";

// အစက် (.) သုံးပြီး စာသားများ ချိတ်ဆက်ပြသခြင်း
echo "အမည်အပြည့်အစုံ: " . $firstName . " " . $lastName . "<br>";

// Double quotes ("") ထဲတွင် variable တိုက်ရိုက် ထည့်သုံးခြင်း
echo "အသက်: $age နှစ်ဖြစ်ပြီး $city မြို့တွင် နေထိုင်ပါသည်။<br>";
?>
```

---

### နမူနာ (၂): Variable များကို တွက်ချက်မှုတွင် လက်တွေ့ အသုံးချပုံ
```php
<?php
// E-Commerce ဈေးဝယ်စနစ် တွက်ချက်မှု
$itemPrice = 50000;    // ကုန်ပစ္စည်း တစ်ခု စျေးနှုန်း (ကျပ်)
$quantity = 3;         // ဝယ်ယူသည့် အရေအတွက်
$taxRate = 0.05;       // အခွန် ၅ ရာခိုင်နှုန်း (5%)

// တွက်ချက်မှုများ ပြုလုပ်ခြင်း
$subtotal = $itemPrice * $quantity;
$taxAmount = $subtotal * $taxRate;
$totalToPay = $subtotal + $taxAmount;

echo "<h3>ငွေတောင်းခံလွှာ (Invoice)</h3>";
echo "ပစ္စည်းတန်ဖိုး: $subtotal ကျပ်<br>";
echo "အခွန် (Tax 5%): $taxAmount ကျပ်<br>";
echo "<strong>စုစုပေါင်း ပေးချေရန်: $totalToPay ကျပ်</strong>";
?>
```

---

## ⚠️ ၅။ Variable သုံးစွဲရာတွင် သတိပြုရမည့် အချက်များ (Rules & Tips)

1. **စတင်ပုံ စည်းမျဉ်း**: Variable အမည်သည် စာလုံး (a-z, A-Z) သို့မဟုတ် Underscore (`_`) ဖြင့်သာ စတင်ရမည်။ **ဂဏန်းဖြင့် မစတင်ရပါ** (ဥပမာ- `$1name` ဟု မရေးရ၊ `$name1` ဟု ရေးနိုင်သည်)။
2. **Case-Sensitive ဖြစ်ခြင်း**: `$name` နှင့် `$Name` သည် မတူညီသော သီးခြား Variable (၂) ခု ဖြစ်သည်။
3. **အမည်ပေးသည့် ပုံစံ**: အဓိပ္ပာယ်ရှိသော အမည်များ ပေးပါ (ဥပမာ- `$x = 5000;` အစား `$monthlySalary = 5000;` ဟု ရေးခြင်းက ကုဒ်ဖတ်ရ ပိုမိုလွယ်ကူစေပါသည်)။

---

## ⭐ ၆။ Variable ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

လုပ်ငန်းခွင်ရှိ Production Code များတွင် Variable များကို အောက်ပါ စွမ်းဆောင်ရည်မြင့် Features များဖြင့် မဖြစ်မနေ တွဲဖက် အသုံးပြုကြပါသည်:

### ၁။ Null Coalescing Operator (`??`) နှင့် Assignment (`??=`)
- **ဘာကြောင့်သုံးသလဲ**: URL Parameter သို့မဟုတ် Form Input မှ Data မပါလာပါက `Notice: Undefined variable/index` Error မတက်စေဘဲ Default တန်ဖိုး သတ်မှတ်ရန် အသုံးအများဆုံး ဖြစ်သည်။
```php
// ?? Operator နမူနာ:
$page = $_GET['page'] ?? 1; // page parameter မပါလာပါက default 1 သတ်မှတ်မည်

// ??= Operator နမူနာ (PHP 7.4+):
$config['theme'] ??= 'dark'; // $config['theme'] တန်ဖိုး မရှိသေးပါက 'dark' သတ်မှတ်မည်
```

### ၂။ Type Casting (ဒေတာအမျိုးအစား အတင်းပြောင်းလဲခြင်း)
- **ဘာကြောင့်သုံးသလဲ**: User က URL မှ string အနေဖြင့် ပေးပို့လိုက်သော ID ကို Database Query မတိုင်မီ integer အစစ်အမှန်ဖြစ်အောင် ကာကွယ်ပြောင်းလဲရာတွင် သုံးသည်။
```php
$rawId = $_GET['id'] ?? "0"; // String "42"
$cleanId = (int)$rawId;      // Integer 42 စစ်စစ် ဖြစ်သွားသည်

$isAgree = (bool)($_POST['agree'] ?? false); // Boolean သို့ ပြောင်းလဲခြင်း
```

### ၃။ Constants (တန်ဖိုးမပြောင်းလဲသော ကိန်းသေများ: `const` vs `define`)
- **ဘာကြောင့်သုံးသလဲ**: အခွန်နှုန်းထား၊ စနစ်လမ်းကြောင်းများ၊ အခြေခံ Setting များကို ဘယ်တော့မှ မတော်တဆ ပြင်ဆင်မရအောင် သိမ်းဆည်းရန် သုံးသည်။
```php
// File အဆင့်တွင် သတ်မှတ်ခြင်း
define("APP_VERSION", "2.4.0");

// Class အဆင့်တွင် သတ်မှတ်ခြင်း (လုပ်ငန်းခွင်သုံး စံနှုန်း)
class AppConfig {
    public const DEFAULT_CURRENCY = "MMK";
    public const MAX_LOGIN_ATTEMPTS = 5;
}

echo AppConfig::DEFAULT_CURRENCY; // MMK
```

### ၄။ Strict Typing Mode (`declare(strict_types=1);`)
- **ဘာကြောင့်သုံးသလဲ**: PHP ၏ အားနည်းချက်ဖြစ်သော Variable Type မတူသော်လည်း အလိုအလျောက် ပေါင်းစပ်ပေးခြင်း (Type Juggling Bug) မဖြစ်ပေါ်စေရန် ဖိုင်၏ ထိပ်ဆုံးတွင် အမြဲဖွင့်ထားရသည်။
```php
declare(strict_types=1);

function addPoints(int $current, int $bonus): int {
    return $current + $bonus;
}

// addPoints(10, "5"); // Fatal Error ချက်ချင်းတက်ပြသဖြင့် Bug ဖြစ်ခွင့် မရှိတော့ပါ
```
