---
title: "06. Database and PDO"
description: "Website တစ်ခုတွင် သာမန် Variable များသည် Page refresh ပြုလုပ်လိုက်သည်နှင့် Memory ပေါ်မှ ပျောက်ကွယ်သွားပါသည်။"
---

## 🗄️ Database နှင့် PDO ဆိုတာဘာလဲ၊ ဘာကြောင့် သုံးတာလဲ?
### (What is a Database, What is PDO and Why do we use it?)

---

## ❓ ၁။ Database နှင့် PDO ဆိုတာဘာလဲ?

### (က) Database ဆိုတာဘာလဲ?
Website တစ်ခုတွင် သာမန် Variable များသည် Page refresh ပြုလုပ်လိုက်သည်နှင့် Memory ပေါ်မှ ပျောက်ကွယ်သွားပါသည်။
- ထို့ကြောင့် User စာရင်းများ၊ Blog Posts များ၊ ကုန်ပစ္စည်းစာရင်းများ၊ ငွေလွှဲမှတ်တမ်းများကို ကွန်ပျူတာ Storage (Hard Drive) ပေါ်တွင် အမြဲတမ်း စနစ်တကျ သိမ်းဆည်းထားရန် **Database** (ဥပမာ- MySQL, MariaDB, PostgreSQL) ကို အသုံးပြုပါသည်။

### (ခ) PDO (PHP Data Objects) ဆိုတာဘာလဲ?
**PDO** ဆိုသည်မှာ PHP Application မှနေ၍ မတူညီသော Database အမျိုးမျိုး (MySQL, PostgreSQL, SQLite, Oracle) သို့ တူညီသော Code ရေးသားဟန်ဖြင့် လုံခြုံစွာ ချိတ်ဆက်ဆက်သွယ်နိုင်ရန် ဖန်တီးပေးထားသော **စံချိန်မီ Database Abstraction Layer (Class Library)** ဖြစ်ပါသည်။

---

## ⚖️ ၂။ mysqli ရှိပါလျက်နှင့် PDO ကို ဘာကြောင့် သုံးသင့်သလဲ?

PHP တွင် Database ချိတ်ဆက်ရန် `mysqli` နှင့် `PDO` ဟူ၍ နည်းလမ်း (၂) ခု ရှိပါသည်:

| အချက်အလက် | mysqli | PDO (PHP Data Objects) |
| :--- | :--- | :--- |
| **ထောက်ပံ့ပေးသော Database များ** | **MySQL တစ်ခုတည်းသာ** ရသည် | **MySQL, PostgreSQL, SQLite စသည့် Database ၁၂ မျိုး** ကို တူညီသော Code ဖြင့် သုံးနိုင်သည် |
| **Named Parameters ပံ့ပိုးမှု** | မရပါ (`?` သာ သုံးရသည်) | **အလွန်ကောင်းမွန်သည်** (`:name`, `:email` စသည်ဖြင့် အမည်တပ် သုံးနိုင်သည်) |
| **Object-Oriented Standard** | Procedural ရော OOP ပါ ရောနေသည် | **သန့်ရှင်းသော OOP Standard စစ်စစ်** ဖြစ်သည် |
| **လုပ်ငန်းခွင်နှင့် Framework များ** | ခေတ်ဟောင်း legacy code များတွင်သာ တွေ့ရတော့သည် | **Laravel, Symfony စသည့် ခေတ်သစ် Framework တိုင်းတွင် PDO ကိုသာ မဖြစ်မနေ အသုံးပြုသည်** |

---

## 🛡️ ၃။ SQL Injection ဆိုတာဘာလဲ? PDO က ဘယ်လို ကာကွယ်ပေးသလဲ?

### ⚠️ SQL Injection အန္တရာယ်:
အကယ်၍ သင်သည် User ရိုက်ထည့်လိုက်သော ဒေတာကို SQL Query ထဲသို့ တိုက်ရိုက် ထည့်သွင်းဆက်စပ်ပါက:
```php
// အန္တရာယ် အလွန်ကြီးသော ကုဒ် (DANGEROUS CODE)
$username = $_POST['username'];
$sql = "SELECT * FROM users WHERE username = '$username'";
```
Hacker က Username နေရာတွင် `' OR '1'='1` ဟု ရိုက်ထည့်လိုက်ပါက:
`SELECT * FROM users WHERE username = '' OR '1'='1'` ဖြစ်သွားပြီး Password မလိုဘဲ System တစ်ခုလုံးကို ဖောက်ထွင်းဝင်ရောက်သွားနိုင်ပါသည်။

### 💡 PDO ၏ ဖြေရှင်းနည်း: Prepared Statements!
PDO တွင် **Prepared Statements** ပါဝင်သည်။
1. ပထမအဆင့်: SQL ပုံစံခွက်ကို Database Engine သို့ ကြိုတင် ပို့ထားသည်။
2. ဒုတိယအဆင့်: User ထည့်လိုက်သော Data ကို သီးခြား Parametric value အဖြစ်သာ ပို့သည်။
3. Database က User Data ကို SQL Command အဖြစ် ဘယ်သောအခါမှ မ run ဘဲ ရိုးရိုး စာသားအဖြစ်သာ သဘောထားသောကြောင့် **SQL Injection Attack ၁၀၀% မဖြစ်နိုင်တော့ပါ**။

---

## 💻 ၄။ လက်တွေ့ အသုံးပြုပုံ ကုဒ်နမူနာ (PDO Secure CRUD)

### အဆင့် (၁): လုံခြုံသော PDO Connection တည်ဆောက်ခြင်း (`db.php`)
```php
<?php
$host = "localhost";
$dbname = "my_shop";
$username = "root";
$password = "";

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Error ဖြစ်ပါက Exception ထုတ်ပေးရန်
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Array အနေဖြင့် Data ပြန်ရရန်
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Native Prepared Statement သုံးရန် (SQL Injection ကာကွယ်ရေးအတွက် အဓိကကျသည်)
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Database ချိတ်ဆက်မှု မအောင်မြင်ပါ: " . $e->getMessage());
}
?>
```

---

### အဆင့် (၂): Data အသစ် ထည့်သွင်းခြင်း (Create / Insert)
```php
<?php
require_once "db.php";

$name = "MacBook Air";
$price = 1200;
$stock = 15;

$sql = "INSERT INTO products (name, price, stock) VALUES (:name, :price, :stock)";
$stmt = $pdo->prepare($sql);

// Parameter များ ချိတ်ဆက်ပြီး run ခြင်း
$stmt->execute([
    ':name'  => $name,
    ':price' => $price,
    ':stock' => $stock
]);

echo "ပစ္စည်းအသစ် ထည့်သွင်းပြီးပါပြီ! Insert ID: " . $pdo->lastInsertId();
?>
```

---

### အဆင့် (၃): Data များ ရှာဖွေထုတ်ယူခြင်း (Read / Select)
```php
<?php
require_once "db.php";

$minPrice = 500;

$sql = "SELECT id, name, price, stock FROM products WHERE price >= :minPrice ORDER BY price DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([':minPrice' => $minPrice]);

// Data အားလုံးကို Associative Array ဖြင့် ဆွဲထုတ်ခြင်း
$products = $stmt->fetchAll();

foreach ($products as $row) {
    echo "ID: {$row['id']} | ပစ္စည်း: {$row['name']} | ဈေးနှုန်း: \${$row['price']}<br>";
}
?>
```

---

### အဆင့် (၄): Data ပြင်ဆင်ခြင်းနှင့် ဖျက်ပစ်ခြင်း (Update & Delete)
```php
<?php
require_once "db.php";

// Update ပြုလုပ်ခြင်း
$updateSql = "UPDATE products SET price = :newPrice WHERE id = :id";
$updateStmt = $pdo->prepare($updateSql);
$updateStmt->execute([
    ':newPrice' => 1100,
    ':id'       => 1
]);

// Delete ပြုလုပ်ခြင်း
$deleteSql = "DELETE FROM products WHERE id = :id";
$deleteStmt = $pdo->prepare($deleteSql);
$deleteStmt->execute([':id' => 1]);
?>
```

---

## ⭐ ၅။ Database & PDO ကဏ္ဍတွင် လုပ်ငန်းခွင်သုံး အများဆုံး Features များ (Most Used Features)

Production Web Applications များတွင် Database နှင့် ဆက်ဆံရာတွင် အောက်ပါ စွမ်းဆောင်ချက် (၃) မျိုးကို မဖြစ်မနေ အသုံးပြုရပါသည်:

### ၁။ Database Transactions (ငွေပေးချေမှုနှင့် အမှာစာ လုပ်ငန်းစဉ်များအတွက်)
- **ဘာကြောင့်သုံးသလဲ**: အမှာစာတစ်ခု တင်လိုက်သည့်အခါ (၁) Orders table ထဲ သွင်းခြင်း (၂) Order Items table ထဲ သွင်းခြင်း (၃) Product Stock လျှော့ချခြင်း စသည့် Query (၃) ခုစလုံး အောင်မြင်မှသာ အတည်ပြုရမည်။ လမ်းခုလတ်တွင် တစ်ခုခု Error ဖြစ်ပါက မူလအခြေအနေသို့ ပြန်ဆုတ်နိုင်ရန် (Rollback) သုံးသည်။
```php
try {
    // Transaction စတင်ခြင်း
    $pdo->beginTransaction();

    // 1. Order ဖန်တီးခြင်း
    $stmt1 = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $stmt1->execute([$userId, $totalAmount]);
    $orderId = $pdo->lastInsertId();

    // 2. Stock လျှော့ချခြင်း
    $stmt2 = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    $stmt2->execute([$quantity, $productId]);

    // အားလုံး အောင်မြင်ပါက အတည်ပြုသိမ်းဆည်းခြင်း
    $pdo->commit();
    echo "အော်ဒါတင်ခြင်း အောင်မြင်ပါသည်!";
} catch (Exception $e) {
    // တစ်ခုခု မှားယွင်းပါက မူလအတိုင်း အားလုံး ပြန်ဖျက်သိမ်းခြင်း
    $pdo->rollBack();
    echo "အမှားဖြစ်ပေါ်ခဲ့သဖြင့် လုပ်ငန်းစဉ် ရပ်ဆိုင်းလိုက်ပါသည်: " . $e->getMessage();
}
```

### ၂။ Data Pagination (စာမျက်နှာ ခွဲခြားခြင်း Query)
- **ဘာကြောင့်သုံးသလဲ**: ပစ္စည်းပေါင်း ၁ သိန်းကို တစ်ပြိုင်နက် ဆွဲထုတ်ပါက Server Crash ဖြစ်မည်။ တစ်မျက်နှာလျှင် ၂၀ စီသာ ဆွဲထုတ်ရန် `LIMIT` နှင့် `OFFSET` ကို သုံးသည်။
```php
$page = (int)($_GET['page'] ?? 1);
$perPage = 10;
$offset = ($page - 1) * $perPage;

$sql = "SELECT * FROM products ORDER BY id DESC LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$products = $stmt->fetchAll();
```

### ၃။ `PDO::FETCH_CLASS` (Database Record ကို Class Object အဖြစ် တိုက်ရိုက် မွေးထုတ်ခြင်း)
- Array အစား မိမိသတ်မှတ်ထားသော Model Class Object အဖြစ် တိုက်ရိုက် ရယူနိုင်သဖြင့် OOP စနစ်တွင် အလွန် အသုံးဝင်သည်။
```php
class ProductModel {
    public int $id;
    public string $name;
    public float $price;
}

$stmt = $pdo->query("SELECT id, name, price FROM products WHERE id = 1");
$stmt->setFetchMode(PDO::FETCH_CLASS, ProductModel::class);
$product = $stmt->fetch();

echo $product->name; // Array မဟုတ်ဘဲ Object property အနေဖြင့် ခေါ်သုံးနိုင်သည်
```

---

## 🎯 အနှစ်ချုပ် (Summary)
- **Database** သည် အချက်အလက်များကို အမြဲတမ်း တည်တံ့အောင် သိမ်းဆည်းပေးသည်။
- **PDO** သည် ခေတ်မီ၊ လုံခြုံပြီး Database အမျိုးစုံကို ပြောင်းလဲချိတ်ဆက်နိုင်သော standard ဖြစ်သည်။
- မည်သည့် SQL Query ရေးသားသည်ဖြစ်စေ **Prepared Statements (`prepare()` + `execute()`)** ကိုသာ အမြဲ အသုံးပြုရပါမည်။
