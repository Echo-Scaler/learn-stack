---
title: "05. Superglobals and Forms"
description: "PHP တွင် Superglobals ဆိုသည်မှာ မည်သည့် Function၊ Method သို့မဟုတ် Class အတွင်း၌မဆို global keyword မလိုဘဲ အချိန်မရွေး တိုက်ရိုက် ခေါ်ယူသုံးစွဲနိုင်သော အထူး Bui"
---

## 🌐 Superglobals နှင့် Forms ($_GET / $_POST) ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What are Superglobals, Forms and Why do we use them?)

---

## ❓ ၁။ Superglobals ဆိုတာဘာလဲ? (What are Superglobals?)

PHP တွင် **Superglobals** ဆိုသည်မှာ မည်သည့် Function၊ Method သို့မဟုတ် Class အတွင်း၌မဆို `global` keyword မလိုဘဲ အချိန်မရွေး တိုက်ရိုက် ခေါ်ယူသုံးစွဲနိုင်သော **အထူး Built-in Arrays များ** ဖြစ်ပါသည်။

PHP တွင် အောက်ပါ Superglobals (၉) မျိုး ရှိပါသည်:
1. `$_GET`: URL ကတစ်ဆင့် ပေးပို့လာသော ဒေတာများကို ဖတ်ယူခြင်း
2. `$_POST`: HTTP Body ထဲမှ ပေးပို့လာသော လုံခြုံသည့် ဒေတာများကို ဖတ်ယူခြင်း
3. `$_SERVER`: Web Server နှင့် လက်ရှိ Request ဆိုင်ရာ အချက်အလက်များ (ဥပမာ- IP address, Request Method, Script path)
4. `$_FILES`: Form မှ Upload ပြုလုပ်လိုက်သော ဖိုင်/ဓာတ်ပုံ အချက်အလက်များ
5. `$_SESSION`: Server ပေါ်တွင် သတ်မှတ်ထားသော Session ဒေတာများ
6. `$_COOKIE`: Client browser ထံမှ ပြန်လည်ရောက်ရှိလာသော Cookie ဒေတာများ
7. `$_REQUEST`: GET, POST နှင့် COOKIE သုံးမျိုးစလုံးကို ပေါင်းစည်းထားသော Array
8. `$_ENV`: Environment Variables များ
9. `$GLOBALS`: Script တစ်ခုလုံးရှိ Global variables အားလုံးကို သိမ်းထားသော Array

---

## ⚖️ ၂။ $_GET နှင့် $_POST ဆိုတာဘာလဲ? ဘာကွာသလဲ?

Web Form တစ်ခု (HTML Form) ရေးသားရာတွင် အချက်အလက်များကို Server သို့ ပို့ရန် နည်းလမ်း (၂) မျိုး ရှိပါသည်:

| အချက်အလက် | `$_GET` | `$_POST` |
| :--- | :--- | :--- |
| **ဒေတာပို့ဆောင်ပုံ** | URL ၏ အနောက်တွင် Query String အနေဖြင့် တိုက်ရိုက်ဖော်ပြသည် (ဥပမာ- `search.php?q=laptop&page=2`) | HTTP Request Body အတွင်း ဖုံးကွယ်၍ ပေးပို့သည် (URL ပေါ်တွင် မပေါ်ပါ) |
| **လုံခြုံရေးအဆင့်** | နိမ့်ပါသည် (မည်သူမဆို URL bar ပေါ်တွင် မြင်နိုင်သည်) | မြင့်မားပါသည် (Password, Credit Card များအတွက် မဖြစ်မနေ သုံးရသည်) |
| **ဒေတာပမာဏ ကန့်သတ်ချက်** | စာလုံးရေ ၂၀၄၈ လုံးခန့်သာ အများဆုံး ပို့နိုင်သည် | Server Setting ပေါ်မူတည်၍ MB ပေါင်းများစွာ ပို့နိုင်သည် |
| **Browser Bookmark** | Bookmark လုပ်၍ ရသည်၊ Refresh လုပ်ပါက Warning မပြပါ | Bookmark လုပ်၍ မရပါ၊ Refresh လုပ်ပါက Confirm Form Resubmission ပြမည် |
| **သင့်တော်သော အသုံးပြုမှု** | ရှာဖွေခြင်း (Search Query), Filter ပြုလုပ်ခြင်း, စာမျက်နှာ ခွဲခြင်း (Pagination) | အကောင့်ဖွင့်ခြင်း (Registration), Login ဝင်ခြင်း, ငွေပေးချေခြင်း, File Upload |

---

## 💡 ၃။ ၎င်းတို့ကို ဘာကြောင့် အသုံးပြုရသလဲ?

အကယ်၍ `$_GET` နှင့် `$_POST` သာ မရှိပါက:
1. **User နှင့် Server အပြန်အလှန် ဆက်သွယ်၍ မရနိုင်ခြင်း**: Website များသည် စာအုပ်တစ်အုပ်ကဲ့သို့ ဖတ်ရှုရုံသာ ရပြီး User ထံမှ Search Keyword, Login Information, Feedback စသည်တို့ကို လက်ခံနိုင်မည် မဟုတ်ပါ။
2. **Dynamic Web Application မဖြစ်နိုင်ခြင်း**: User တစ်ဦးချင်းစီအတွက် စိတ်ကြိုက် Content များ မထုတ်ပေးနိုင်တော့ပါ။

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (Usage Examples)

### နမူနာ (၁): Search System with `$_GET`
```php
<?php
// search.php
$searchTerm = $_GET['q'] ?? '';

echo "<h2>ရှာဖွေမှု ရလဒ်</h2>";
if (!empty($searchTerm)) {
    // XSS ကာကွယ်ရန် htmlspecialchars အမြဲသုံးပါ
    echo "<p>သင် ရှာဖွေထားသော စကားလုံး: <strong>" . htmlspecialchars($searchTerm) . "</strong></p>";
}
?>

<form method="GET" action="">
    <input type="text" name="q" placeholder="ပစ္စည်း ရှာဖွေပါ..." value="<?= htmlspecialchars($searchTerm) ?>">
    <button type="submit">ရှာမည်</button>
</form>
```

---

### နမူနာ (၂): Secure Registration Form with `$_POST`
```php
<?php
$status = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1. Data ဖတ်ယူခြင်းနှင့် သန့်စင်ခြင်း
    $username = trim($_POST["username"] ?? "");
    $email    = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
    $password = $_POST["password"] ?? "";

    // 2. Validation
    if (empty($username) || empty($email) || empty($password)) {
        $status = "<p style='color:red;'>အချက်အလက်အားလုံး ဖြည့်စွက်ပါ!</p>";
    } elseif (strlen($password) < 8) {
        $status = "<p style='color:red;'>စကားဝှက်သည် အနည်းဆုံး ၈ လုံး ရှိရပါမည်!</p>";
    } else {
        // Password ကို Hash ပြုလုပ်ခြင်း
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Database ထဲ ထည့်သွင်းမည့် logic
        $status = "<p style='color:green;'>စာရင်းသွင်းခြင်း အောင်မြင်ပါသည်! ကြိုဆိုပါသည် " . htmlspecialchars($username) . "</p>";
    }
}
?>

<?= $status ?>

<form method="POST" action="">
    <div>
        <label>အမည်:</label><br>
        <input type="text" name="username" required>
    </div><br>
    <div>
        <label>အီးမေးလ်:</label><br>
        <input type="email" name="email" required>
    </div><br>
    <div>
        <label>စကားဝှက်:</label><br>
        <input type="password" name="password" required>
    </div><br>
    <button type="submit">အကောင့်ဖွင့်မည်</button>
</form>
```

---

## ⚠️ ၅။ အရေးကြီးသော လုံခြုံရေး စည်းမျဉ်း (Security Golden Rule)

> **"Never Trust User Input!"** (အသုံးပြုသူ ရိုက်ထည့်လိုက်သော မည်သည့်ဒေတာကိုမဆို ဘယ်သောအခါမှ ၁၀၀% မယုံကြည်ပါနှင့်)

1. Form ဒေတာကို ဖတ်ယူတိုင်း အမြဲ `trim()` ဖြင့် ရှေ့နောက် space များ ဖြတ်ပါ။
2. ပြန်လည် Output ထုတ်ပြတိုင်း `htmlspecialchars($data, ENT_QUOTES, 'UTF-8')` ခံရေးပါ။
3. အရေးကြီးသော အချက်အလက်များအတွက် GET မသုံးဘဲ POST ကိုသာ အမြဲသုံးပါ။

---

## ⭐ ၆။ Superglobals & Forms ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

ခေတ်သစ် Web Applications များတွင် Form ကိုင်တွယ်ရာ၌ အောက်ပါ အဆင့်မြင့် စနစ် (၃) မျိုးကို အဓိက အသုံးပြုပါသည်:

### ၁။ လုံခြုံသော File & Image Upload စစ်ဆေးခြင်း (`$_FILES` & MIME Sniffing)
- **ဘာကြောင့်သုံးသလဲ**: Hacker များက `.php` ဗိုင်းရပ်စ်ဖိုင်ကို `.jpg` ဟု အယောင်ဆောင်၍ Upload တင်တတ်ကြသည်။ File extension ကို မယုံဘဲ ဖိုင်၏ အတွင်းပိုင်း Binary Signature ကို **`finfo_file`** ဖြင့် စစ်ဆေးရမည်။
```php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['avatar'])) {
    $file = $_FILES['avatar'];
    
    // 1. ဖိုင်အတွင်းပိုင်း အမှန်တကယ် ပုံ ဟုတ်မဟုတ် စစ်ဆေးခြင်း (MIME Type Check)
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mimeType, $allowedMimes)) {
        die("မှားယွင်းမှု: JPG, PNG သို့မဟုတ် WebP ပုံများကိုသာ တင်ခွင့်ပြုပါသည်!");
    }

    // 2. ဖိုင်ဆိုဒ် ကန့်သတ်ခြင်း (ဥပမာ- 2MB အောက်သာ ခွင့်ပြုမည်)
    if ($file['size'] > 2 * 1024 * 1024) {
        die("မှားယွင်းမှု: ဖိုင်ဆိုဒ် 2MB ထက် မကျော်ရပါ!");
    }

    // 3. ဖိုင်နာမည် အသစ်ပြောင်း၍ လုံခြုံစွာ သိမ်းဆည်းခြင်း
    $newFileName = bin2hex(random_bytes(16)) . ".jpg";
    move_uploaded_file($file['tmp_name'], "uploads/" . $newFileName);
    echo "ပုံတင်ခြင်း အောင်မြင်ပါသည်!";
}
```

### ၂။ Form Repopulation (Error တက်ချိန်တွင် User ရိုက်ထားသော Data မပျောက်စေခြင်း)
- Validation Error ဖြစ်သွားသည့်အခါ ရိုက်ထားသမျှ အားလုံး ကွက်လပ် ပြန်ဖြစ်မသွားစေရန် Input `value` ထဲသို့ `$_POST` တန်ဖိုးကို လုံခြုံစွာ ပြန်လည် ထည့်သွင်းပေးခြင်း:
```php
<input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
```

### ၃။ Single Page App (SPA) & AJAX JSON Form ပေးပို့မှု လက်ခံခြင်း
- ခေတ်သစ် JavaScript (`fetch` / `axios`) ဖြင့် Form Data ကို JSON အနေဖြင့် လှမ်းပို့လာသည့်အခါ `$_POST` ထဲတွင် ပေါ်မည်မဟုတ်ဘဲ `php://input` stream မှသာ ဖတ်ယူရပါသည်:
```php
$jsonInput = file_get_contents('php://input');
$formData = json_decode($jsonInput, true);

$username = $formData['username'] ?? '';
```
