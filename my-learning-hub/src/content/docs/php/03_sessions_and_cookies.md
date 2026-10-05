---
title: "03. Sessions and Cookies"
description: "Internet ပေါ်တွင် Web Browser နှင့် Server တို့ အချင်းချင်း ဆက်သွယ်ရာတွင် HTTP Protocol ကို အသုံးပြုပါသည်။"
---

## 🔐 Session နှင့် Cookie ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is a Session, What is a Cookie and Why do we use them?)

---

## ❓ ၁။ Session နှင့် Cookie မိတ်ဆက် (The Big Picture)

Internet ပေါ်တွင် Web Browser နှင့် Server တို့ အချင်းချင်း ဆက်သွယ်ရာတွင် **HTTP Protocol** ကို အသုံးပြုပါသည်။

> **အရေးကြီးသော သဘောတရား**:
> HTTP သည် **"Stateless" (မှတ်ဉာဏ်မဲ့ စနစ်)** ဖြစ်သည်။ ဆိုလိုသည်မှာ သင်သည် စာမျက်နှာတစ်ခုမှ အခြားစာမျက်နှာတစ်ခုသို့ ကူးပြောင်းလိုက်တိုင်း Server သည် သင်ဘယ်သူဖြစ်သည်၊ လွန်ခဲ့သော စက္ကန့်အနည်းငယ်က Login ဝင်ထားသလား မဝင်ထားဘူးလားဆိုသည်ကို လုံးဝ မမှတ်မိတော့ပါ။

ဤပြဿနာကို ဖြေရှင်းရန်အတွက် **Session** နှင့် **Cookie** တို့ ပေါ်ပေါက်လာခြင်း ဖြစ်ပါသည်။

---

## 🍪 ၂။ Cookie ဆိုတာဘာလဲ?

**Cookie** ဆိုသည်မှာ Web Server က အသုံးပြုသူ၏ ကွန်ပျူတာ (Browser) ထဲသို့ လှမ်း၍ သိမ်းဆည်းခိုင်းလိုက်သော **"သေးငယ်သည့် စာသားအချက်အလက်ဖိုင် (Small text file)"** ဖြစ်ပါသည်။

- **သိမ်းဆည်းသည့်နေရာ**: Client စက် (User ၏ Browser ထဲတွင် သိမ်းဆည်းသည်)။
- **သက်တမ်း**: သတ်မှတ်ထားသော သက်တမ်းကုန်ဆုံးချိန် (Expiration Time) အထိ ရှိနေမည် (Browser ပိတ်လိုက်သော်လည်း မပျက်သွားပါ)။
- **အသုံးပြုသည့်နေရာ**: Dark Mode / Light Mode သတ်မှတ်ချက်များ၊ Website တွင် ရွေးချယ်ထားသော ဘာသာစကား (Language Preference)၊ "Remember Me" စနစ်များ။

---

## 🔒 ၃။ Session ဆိုတာဘာလဲ?

**Session** ဆိုသည်မှာ အသုံးပြုသူတစ်ဦး၏ အရေးကြီးသော အချက်အလက်များကို **Web Server ပေါ်တွင်သာ လုံခြုံစွာ သိမ်းဆည်းပေးသော စနစ်** ဖြစ်ပါသည်။

- **သိမ်းဆည်းသည့်နေရာ**: Server ၏ Memory / Storage တွင် သိမ်းဆည်းသည်။
- **အလုပ်လုပ်ပုံ**:
  1. User တစ်ဦး ဆိုက်သို့ ရောက်လာပြီး Session စတင်သည်နှင့် Server က ထူးခြားသည့် ကုတ်နံပါတ်တစ်ခု (**Session ID** ဥပမာ- `sess_a89f72b...`) ထုတ်ပေးပြီး Cookie အဖြစ် Browser သို့ ပေးပို့သည်။
  2. အမှန်တကယ် အရေးကြီးသော ဒေတာများ (User ID, Role, Shopping Cart) ကိုမူ Server ပေါ်ရှိ အဆိုပါ Session ID နှင့် သက်ဆိုင်သော ဖိုင်ထဲတွင်သာ သိမ်းထားသည်။
  3. User က Page တစ်ခု ပြောင်းတိုင်း Browser က Session ID ကို Server ထံ ပြန်ပြသပြီး "ကျွန်တော်က ဒီ Session ID ပိုင်ရှင်ပါ" ဟု သက်သေပြသည်။
- **သက်တမ်း**: Browser ပိတ်လိုက်သည်နှင့် (သို့မဟုတ် အချိန်အတိုင်းအတာတစ်ခု ငြိမ်သက်နေပါက) အလိုအလျောက် ပျက်ပြယ်သွားလေ့ရှိသည်။

---

## ⚖️ ၄။ Session နှင့် Cookie ဘာကွာသလဲ? (Comparison Table)

| အချက်အလက် (Feature) | Cookie | Session |
| :--- | :--- | :--- |
| **ဒေတာသိမ်းဆည်းသည့်နေရာ** | Client စက် (Browser ထဲတွင်) | Web Server ပေါ်တွင်သာ |
| **လုံခြုံရေးအဆင့် (Security)** | အားနည်းသည် (User က ကြည့်ရှု/ပြင်ဆင်နိုင်သည်) | အလွန်မြင့်မားသည် (User တိုက်ရိုက် မထိတွေ့နိုင်ပါ) |
| **သိမ်းဆည်းနိုင်သော ပမာဏ** | 4 KB အထိသာ သိမ်းနိုင်သည် | Server Memory ခံနိုင်သလောက် အကန့်အသတ်မရှိ သိမ်းနိုင်သည် |
| **သင့်တော်သော အသုံးပြုမှု** | Theme color, Remember Me, Cookie consent | Login အခြေအနေ, User ID, ဘဏ်အကောင့်ဒေတာ, Shopping Cart |

---

## 💡 ၅။ Session ကို ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ?

အကယ်၍ Session သာ မရှိပါက:
1. **User Login စနစ် တည်ဆောက်၍ မရနိုင်ခြင်း**: စာမျက်နှာ အသစ်တစ်ခု နှိပ်လိုက်တိုင်း အီးမေးလ်နှင့် စကားဝှက်ကို ထပ်ခါထပ်ခါ ပြန်ရိုက်ထည့်နေရမည်။
2. **Shopping Cart စနစ် အလုပ်မလုပ်နိုင်ခြင်း**: ပစ္စည်းတစ်ခု Cart ထဲထည့်ပြီး နောက်စာမျက်နှာတစ်ခု ကူးသွားပါက ရွေးထားသောပစ္စည်း ပျောက်ဆုံးသွားမည်။
3. **Admin Dashboard ကို ကာကွယ်၍ မရနိုင်ခြင်း**: ဘယ်သူက Admin ဖြစ်ပြီး ဘယ်သူက ရိုးရိုးဧည့်သည်ဖြစ်ကြောင်း ခွဲခြားသိရှိနိုင်မည် မဟုတ်ပါ။

---

## 💻 ၆။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Usage Examples)

### နမူနာ (၁): User Login ဝင်ခြင်းနှင့် Session မှတ်သားခြင်း (`login.php`)
```php
<?php
// Session စတင်အသုံးပြုမည်ဆိုပါက ဖိုင်၏ ထိပ်ဆုံး (HTML မတိုင်မီ) တွင် အမြဲ ရေးရမည်
session_start();

// User Login အချက်အလက် မှန်ကန်သည်ဟု ယူဆပါစို့
$userId = 101;
$userName = "ကိုသီဟဇော်";
$userRole = "admin";

// Session ထဲသို့ အချက်အလက်များ ထည့်သွင်းခြင်း
$_SESSION["user_id"] = $userId;
$_SESSION["username"] = $userName;
$_SESSION["role"] = $userRole;
$_SESSION["is_logged_in"] = true;

// Session ID ကို အသစ် လဲလှယ်ပေးခြင်း (Session Fixation Hack မခံရစေရန် အလွန်အရေးကြီးပါသည်)
session_regenerate_id(true);

echo "Login အောင်မြင်ပါသည်! Dashboard သို့ ကူးပြောင်းပါမည်။";
?>
```

---

### နမူနာ (၂): Login ဝင်ထားသူသာ ကြည့်ရှုခွင့်ပေးသည့် စာမျက်နှာ (`dashboard.php`)
```php
<?php
session_start();

// User Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
if (!isset($_SESSION["is_logged_in"]) || $_SESSION["is_logged_in"] !== true) {
    // Login မဝင်ထားပါက Login Page သို့ မောင်းထုတ်ခြင်း
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head><title>User Dashboard</title></head>
<body>
    <h1>ကြိုဆိုပါသည်၊ <?= htmlspecialchars($_SESSION["username"]) ?>!</h1>
    <p>သင်၏ အခန်းကဏ္ဍ: <strong><?= $_SESSION["role"] ?></strong></p>
    
    <a href="logout.php">အကောင့်မှ ထွက်မည် (Logout)</a>
</body>
</html>
```

---

### နမူနာ (၃): အကောင့်မှ ပြန်ထွက်ခြင်း (`logout.php`)
```php
<?php
session_start();

// Session ထဲရှိ Variable အားလုံးကို ရှင်းလင်းခြင်း
$_SESSION = [];

// Session Cookie ကို ဖျက်ပစ်ခြင်း
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Session တစ်ခုလုံးကို Server ပေါ်မှ လုံးဝ ဖျက်ဆီးခြင်း
session_destroy();

// Login page သို့ ပြန်ပို့ခြင်း
header("Location: login.php");
exit;
?>
```

---

## 🛡️ ၇။ Session သုံးစွဲရာတွင် မဖြစ်မနေ လိုက်နာရမည့် Security Rules

1. **`session_regenerate_id(true)`**: User တစ်ဦး Login ဝင်လိုက်တိုင်း Session ID အဟောင်းကို ဖျက်ပြီး ID အသစ် ချက်ချင်း ပြောင်းလဲပေးပါ။
2. **Password များကို Session ထဲ မသိမ်းပါနှင့်**: User ၏ စကားဝှက်ကို Session ထဲ လုံးဝ သိမ်းဆည်းရန် မလိုပါ။ User ID နှင့် Email ကဲ့သို့ Identification ဒေတာများကိုသာ သိမ်းဆည်းပါ။
3. **Session Timeout သတ်မှတ်ပါ**: အချိန်ကြာမြင့်စွာ လှုပ်ရှားမှု မရှိသော အကောင့်များကို Session အလိုအလျောက် ကုန်ဆုံးစေရန် ပြုလုပ်ပါ။

---

## ⭐ ၈။ Session & Cookie ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

လုပ်ငန်းခွင်ရှိ Web Application တိုင်းတွင် အောက်ပါ Features (၃) ခုကို မဖြစ်မနေ တည်ဆောက်သုံးစွဲကြပါသည်:

### ၁။ Flash Messages (တစ်ကြိမ်သာပြသပြီး အလိုအလျောက် ပျောက်ကွယ်သွားသော သတိပေးချက်များ)
- **ဘာကြောင့်သုံးသလဲ**: Form Submit ပြီးနောက် (သို့မဟုတ် ပစ္စည်း Cart ထဲ ထည့်ပြီးနောက်) အခြား Page သို့ `header("Location: ...")` ပြောင်းသွားသော်လည်း "ပစ္စည်း ထည့်သွင်းပြီးပါပြီ" ဟု မက်ဆေ့ခ်ျ ပေါ်စေချင်သည့်အခါ သုံးသည်။
```php
// Message သတ်မှတ်ခြင်း (ဥပမာ- ProductController တွင်)
$_SESSION['flash'] = [
    'type'    => 'success',
    'message' => 'ပရိုဖိုင် အချက်အလက်များကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ!'
];

// View စာမျက်နှာတွင် ထုတ်ပြပြီး ချက်ချင်း ပြန်ဖျက်ခြင်း (View file)
if (isset($_SESSION['flash'])) {
    $flash = $_SESSION['flash'];
    echo "<div class='alert alert-{$flash['type']}'>{$flash['message']}</div>";
    
    // ပြသပြီးသည်နှင့် Session ထဲမှ ချက်ချင်း ရှင်းလင်းပစ်ရမည်
    unset($_SESSION['flash']);
}
```

### ၂။ လုံခြုံသော "Remember Me" Cookie စနစ် (Selector + Validator Token)
- **လုပ်ငန်းခွင် စံနှုန်း**: Cookie ထဲတွင် User ID သို့မဟုတ် Password ကို ဘယ်တော့မှ မသိမ်းရပါ။
- **အလုပ်လုပ်ပုံ**: 
  - Token နှစ်ခု ထုတ်ယူသည်: `Selector` (လူသိခံနိုင်သော ID) နှင့် `Validator` (လျှို့ဝှက်ကုဒ်)။
  - Database ထဲတွင် `Validator` ကို Hash လုပ်၍ သိမ်းသည်။
  - Browser Cookie ထဲတွင် `selector:validator` ဟု ပေါင်းစပ်သိမ်းသည်။
  - Browser ပိတ်ပြီး ပြန်ဖွင့်ချိန်တွင် အဆိုပါ Token ဖြင့် စစ်ဆေးကာ အလိုအလျောက် Login ပြန်ဝင်စေသည်။

### ၃။ Cloud Clusters & Redis Session Storage
- **ဘာကြောင့်သုံးသလဲ**: Server ၁ လုံးထက်ပိုသော High-traffic Production တွင် User ၏ Session ကို Server ရိုးရိုးဖိုင်ထဲ သိမ်းပါက နောက် Request တွင် အခြား Server ဆီ ရောက်သွားသောအခါ Logout ဖြစ်သွားတတ်သည်။
- **ဖြေရှင်းချက်**: `php.ini` တွင် Session Driver ကို **Redis** သို့မဟုတ် **Memcached** သို့ လွှဲပြောင်းသိမ်းဆည်းရသည်။
```ini
# php.ini တွင် Redis session ချိတ်ဆက်ပုံ
session.save_handler = redis
session.save_path = "tcp://10.0.0.1:6379"
```
