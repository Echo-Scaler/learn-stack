---
title: "08. Web Security"
description: "Web Security ဆိုသည်မှာ မိမိတို့ ဖန်တီးတည်ဆောက်ထားသော Website သို့မဟုတ် Web Application ထဲသို့ မသမာသူ Hacker များ ခွင့်ပြုချက်မရှိဘဲ ဝင်ရောက်ဖောက်ထွင်းခြင်း၊ ဒေတ"
---

## 🛡️ Web Security (ဝဘ်လုံခြုံရေး) ဆိုတာဘာလဲ၊ ဘာကြောင့် မဖြစ်မနေ လိုအပ်တာလဲ?
### (What is Web Security and Why is it Critical?)

---

## ❓ ၁။ Web Security ဆိုတာဘာလဲ? (What is Web Security?)

**Web Security** ဆိုသည်မှာ မိမိတို့ ဖန်တီးတည်ဆောက်ထားသော Website သို့မဟုတ် Web Application ထဲသို့ မသမာသူ Hacker များ ခွင့်ပြုချက်မရှိဘဲ ဝင်ရောက်ဖောက်ထွင်းခြင်း၊ ဒေတာများ ခိုးယူဖျက်ဆီးခြင်းနှင့် စနစ်ကို အနှောင့်အယှက်ပေးခြင်းတို့ မဖြစ်ပေါ်စေရန်အတွက် **ကြိုတင်ကာကွယ် တားဆီးထားသော နည်းပညာနှင့် စည်းမျဉ်းများ** ဖြစ်ပါသည်။

---

## 💡 ၂။ Web Security ကို ဘာကြောင့် မဖြစ်မနေ အလေးထားရသလဲ?

ဝဘ်ဆိုဒ်တစ်ခုသည် လှပနေရုံ၊ Feature များပြားနေရုံဖြင့် မလုံလောက်ပါ။ လုံခြုံရေး အားနည်းပါက:
1. **User များ၏ အရေးကြီး ဒေတာများ ပေါက်ကြားသွားခြင်း**: စကားဝှက်များ၊ ဖုန်းနံပါတ်များ၊ ဘဏ်ကတ်အချက်အလက်များ ခိုးယူခံရနိုင်သည်။
2. **စီးပွားရေးနှင့် နာမည်ဂုဏ်သတင်း ပျက်ပြားခြင်း**: Website ဖောက်ထွင်းခံရပါက သုံးစွဲသူများ၏ ယုံကြည်မှု လုံးဝ ဆုံးရှုံးသွားမည်။
3. **ဥပဒေကြောင်းအရ အရေးယူခံရနိုင်ခြင်း**: GDPR နှင့် ဒေတာလုံခြုံရေး ဥပဒေများအရ စနစ်ပေါ့လျော့မှုအတွက် ကြီးလေးသော ဒဏ်ကြေးများ ပေးဆောင်ရနိုင်သည်။

---

## ⚠️ ၃။ PHP တွင် အဖြစ်အများဆုံး တိုက်ခိုက်မှုကြီး (၄) မျိုးနှင့် ကာကွယ်နည်းများ

---

### (က) SQL Injection (ဒေတာဘေ့စ် တိုက်ခိုက်ခံရခြင်း)
- **ဘာလဲ**: Hacker က Login Form သို့မဟုတ် Search Box မှတစ်ဆင့် မသမာသော SQL Code များကို ထည့်သွင်းပြီး Database ထဲရှိ Data များကို ခိုးယူဖျက်ဆီးခြင်း။
- **ကာကွယ်နည်း**: String များကို SQL ထဲ ဘယ်တော့မှ ပေါင်းမရေးပါနှင့်။ **PDO Prepared Statements** ကိုသာ ၁၀၀% အမြဲ အသုံးပြုပါ။

```php
<?php
// ✅ အလွန်လုံခြုံသော စနစ် (PDO Prepared Statement)
$stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = :email");
$stmt->execute([':email' => $_POST['email']]);
$user = $stmt->fetch();
?>
```

---

### (ခ) XSS (Cross-Site Scripting)
- **ဘာလဲ**: Hacker က Comment Box သို့မဟုတ် Form များမှတစ်ဆင့် အန္တရာယ်ရှိသော JavaScript Code (`<script>stealCookies();</script>`) များကို ရိုက်ထည့်ပြီး အခြား User များ၏ Browser ပေါ်တွင် Run စေကာ Session/Cookie များကို ခိုးယူခြင်း။
- **ကာကွယ်နည်း**: User ထံမှ လာသော Data ကို HTML စာမျက်နှာပေါ် ပြန်လည်ပြသတိုင်း **`htmlspecialchars()`** ခံရေးပါ။

```php
<?php
$userComment = $_POST['comment'] ?? '';

// ❌ အန္တရာယ်ရှိသည်: echo $userComment;
// ✅ လုံခြုံသည်:
echo htmlspecialchars($userComment, ENT_QUOTES, 'UTF-8');
?>
```

---

### (ဂ) CSRF (Cross-Site Request Forgery)
- **ဘာလဲ**: အသုံးပြုသူသည် Website တစ်ခုတွင် Login ဝင်ထားစဉ် (ဥပမာ- ဘဏ်ဆိုဒ်)၊ Hacker က အခြား မသမာသော link တစ်ခုကို နှိပ်ခိုင်းပြီး အသုံးပြုသူ ကိုယ်စား ခွင့်ပြုချက်မရှိဘဲ ငွေလွှဲစေခြင်း သို့မဟုတ် စကားဝှက် ပြောင်းလဲစေခြင်း။
- **ကာကွယ်နည်း**: Form တိုင်းတွင် ခန့်မှန်း၍မရသော **CSRF Token** (လျှို့ဝှက်ကုဒ်) ထည့်သွင်းပြီး Server တွင် တိုက်ဆိုင်စစ်ဆေးပါ။

```php
<?php
session_start();

// Token ထုတ်ပေးခြင်း
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Form Submit လာချိန်တွင် စစ်ဆေးခြင်း
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
        die("လုံခြုံရေးချိုးဖောက်မှု: တရားမဝင်သော Request ဖြစ်ပါသည်!");
    }
}
?>

<form method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
    <button type="submit">အရေးကြီး လုပ်ဆောင်ချက်</button>
</form>
```

---

### (ဃ) Insecure Password Storage (စကားဝှက် လုံခြုံမှုမရှိခြင်း)
- **ဘာလဲ**: Password များကို မူရင်းစာသားအတိုင်း (Plaintext) သို့မဟုတ် ခေတ်ဟောင်း `md5()`, `sha1()` များဖြင့် Database တွင် သိမ်းဆည်းခြင်း။ (ယင်းစနစ်များသည် စက္ကန့်ပိုင်းအတွင်း Decode လုပ် ဖောက်ထွင်းခံရနိုင်ပါသည်)။
- **ကာကွယ်နည်း**: PHP ၏ စံချိန်မီ **`password_hash()`** နှင့် **`password_verify()`** ကိုသာ အသုံးပြုပါ။ (BCRYPT Algorithm)

```php
<?php
$plainPassword = "UserSecretPassword@2026";

// 1. Password သိမ်းဆည်းချိန်တွင် Hash လုပ်ခြင်း
$hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);
// Database ထဲသို့ $hashedPassword ကိုသာ သိမ်းဆည်းရမည် (ဥပမာ: $2y$10$e8Fv2...)

// 2. Login ပြန်ဝင်ချိန်တွင် စကားဝှက် မှန်မမှန် စစ်ဆေးခြင်း
$isCorrect = password_verify($plainPassword, $hashedPassword);

if ($isCorrect) {
    echo "စကားဝှက် မှန်ကန်ပါသည်! Login ဝင်ရောက်ခွင့် ပြုသည်။";
} else {
    echo "စကားဝှက် မှားယွင်းနေပါသည်။";
}
?>
```

---

## ⭐ ၄။ Web Security ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

Production Web Applications များတွင် အထက်ပါ အခြေခံများအပြင် အောက်ပါ အဆင့်မြင့် လုံခြုံရေး စနစ်များကို မဖြစ်မနေ ထည့်သွင်းကြပါသည်:

### ၁။ Brute-Force Login ကာကွယ်ရန် Rate Limiting စနစ်
- **ဘာကြောင့်သုံးသလဲ**: Hacker များက Bot Software သုံး၍ စကားဝှက်များကို စက္ကန့်ပိုင်းအတွင်း အကြိမ်ထောင်ပေါင်းများစွာ ရိုက်ထည့်စမ်းသပ်ခြင်းကို တားဆီးရန်။
```php
function checkRateLimit(string $ip): bool {
    $maxAttempts = 5;
    $lockoutTime = 900; // ၁၅ မိနစ် (900 seconds)

    // Database သို့မဟုတ် Redis ထဲတွင် မအောင်မြင်သော အကြိမ်ရေ စစ်ဆေးခြင်း
    $attempts = getFailedAttemptsFromRedis($ip);

    if ($attempts >= $maxAttempts) {
        http_response_code(429); // Too Many Requests
        die("လုံခြုံရေး သတိပေးချက်: အကြိမ်ကြိမ် မှားယွင်းရိုက်ထည့်ခဲ့သဖြင့် မိနစ် ၁၅ ကြာ ခေတ္တ ပိတ်ထားပါသည်!");
    }
    return true;
}
```

### ၂။ Timing Attacks ကာကွယ်သည့် `hash_equals()`
- **ဘာကြောင့်သုံးသလဲ**: သာမန် `if ($token1 == $token2)` သုံးပါက Hacker က String comparison လုပ်ဆောင်သည့် အချိန် (CPU Nanoseconds) ကို တိုင်းတာ၍ လျှို့ဝှက်ကုဒ်ကို ဖော်ထုတ်နိုင်သည်။ `hash_equals()` သည် ဘယ်သောအခါမှ အချိန်တိုင်းတာ၍ မရအောင် အချိန်တူညီစွာ စစ်ဆေးပေးသည်။
```php
// CSRF Token နှင့် API Secret Key များကို စစ်ဆေးတိုင်း hash_equals ကိုသာ သုံးပါ
if (!hash_equals($knownToken, $userSubmittedToken)) {
    die("Token မမှန်ကန်ပါ!");
}
```

### ၃။ Secure HTTP Headers ထည့်သွင်းခြင်း
- **ဘာကြောင့်သုံးသလဲ**: Clickjacking နှင့် မသမာသော Script ထည့်သွင်းမှုများကို Browser အဆင့်မှ တိုက်ရိုက် ပိတ်ပင်ရန်။
```php
// Website ၏ အဝင် index.php တွင် အမြဲ ထည့်သွင်းထားရမည့် Headers
header("X-Frame-Options: DENY"); // iframe ထဲ ထည့်သွင်းခွင့် ပိတ်ခြင်း (Clickjacking ကာကွယ်သည်)
header("X-Content-Type-Options: nosniff"); // MIME type အယောင်ဆောင်မှုကို တားဆီးသည်
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
```

---

## 🎯 အနှစ်ချုပ် (Summary Checklist)
1. User ထံမှ လာသော မည်သည့်ဒေတာကိုမဆို မယုံကြည်ပါနှင့် (**Validate & Sanitize**).
2. Database ထဲ ထည့်သွင်းတိုင်း **PDO Prepared Statements** သုံးပါ။
3. Browser ပေါ် ပြန်ပြတိုင်း **`htmlspecialchars`** ခံရေးပါ။
4. Form တိုင်းတွင် **CSRF Token** ထည့်သွင်းပါ။
5. စကားဝှက်များကို **`password_hash()`** ဖြင့်သာ အမြဲ သိမ်းဆည်းပါ။
6. Brute-force တားဆီးရန် **Rate Limiting** နှင့် လုံခြုံသော **HTTP Headers** ထည့်သွင်းပါ။
