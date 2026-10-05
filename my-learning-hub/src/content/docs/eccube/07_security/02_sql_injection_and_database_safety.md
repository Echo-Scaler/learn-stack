---
title: "02. Sql Injection And Database Safety"
description: "Hacker များက Database ကို ဖောက်ထွင်း၍ အသုံးပြုသူများ၏ ကိုယ်ရေးအချက်အလက်များကို ခိုးယူခြင်း သို့မဟုတ် ဒေတာများ ဖျက်ဆီးခြင်း ပြုလုပ်နိုင်သော SQL Injection (SQLi)"
---

## 02. SQL Injection & Database Safety (SQLインジェクション対策)

Hacker များက Database ကို ဖောက်ထွင်း၍ အသုံးပြုသူများ၏ ကိုယ်ရေးအချက်အလက်များကို ခိုးယူခြင်း သို့မဟုတ် ဒေတာများ ဖျက်ဆီးခြင်း ပြုလုပ်နိုင်သော **SQL Injection (SQLi)** ကို Doctrine ORM တွင် ကာကွယ်နည်းများ ဖြစ်ပါသည်။

---

## 💉 SQL Injection ဆိုတာ အဘယ်နည်း?

အသုံးပြုသူ ရိုက်ထည့်လိုက်သော စာသားကို စိစစ်ခြင်းမရှိဘဲ SQL Query ထဲသို့ တိုက်ရိုက် စာသားဆက် (String Concatenation) ရေးသားမိပါက Hacker သည် SQL အမိန့်များကို သွင်းယူတိုက်ခိုက်နိုင်ပါသည်:

### တိုက်ခိုက်ခံရပုံ ဥပမာ:
```sql
-- Developer ရေးထားသော မလုံခြုံသည့် Query:
"SELECT * FROM dtb_customer WHERE email = '" . $email . "' AND password = '" . $password . "'";

-- Hacker က Email အကွက်တွင် အောက်ပါအတိုင်း ရိုက်ထည့်လိုက်သည်:
' OR '1'='1' --

-- Database တွင် အောက်ပါအတိုင်း ဖြစ်သွားပြီး Password မလိုဘဲ ပထမဆုံး Admin အကောင့်သို့ တိုက်ရိုက် ဝင်ရောက်သွားနိုင်သည်:
SELECT * FROM dtb_customer WHERE email = '' OR '1'='1' -- ' AND password = 'xxx';
```

---

## 🛡️ Doctrine ၏ Prepared Statements အကာအကွယ်

Doctrine ORM သည် PDO ၏ **Prepared Statements (ကြိုတင်ပြင်ဆင်ပြီး Parameter ချိတ်ဆက်ခြင်း)** ကို အသုံးပြုသည်။ Database Engine သည် SQL Query ၏ ဖွဲ့စည်းပုံကို သီးခြား ကြိုတင် Compile လုပ်ထားပြီး၊ User Input များကို သာမန် Data Literal အဖြစ်သာ သဘောထားသဖြင့် မည်သည့်အခါမျှ SQL အမိန့်အဖြစ် အလုပ်မလုပ်နိုင်ပါ။

---

## ⚠️ Developer များ ပြုလုပ်လေ့ရှိသော သေစေနိုင်သည့် အမှား ၃ မျိုး

### ၁။ QueryBuilder တွင် စာသားဆက်ခြင်း (String Concatenation):
- ❌ **အန္တရာယ် အလွန်ကြီးမားသော ရေးသားပုံ (Vulnerable Code)**:
  ```php
  // Developer က အလွယ်တကူ စာသားဆက် ရေးသားထားသည်
  $qb->where("p.name LIKE '%" . $searchTerm . "%'");
  ```

- ✅ **လုံခြုံစိတ်ချရသော ရေးသားပုံ (Safe Parameter Binding)**:
  ```php
  $qb->where("p.name LIKE :search")
     ->setParameter('search', '%' . $searchTerm . '%');
  ```

---

### ၂။ Dynamic `ORDER BY` တွင် Parameter မဟုတ်ဘဲ Input ထည့်မိခြင်း:
SQL စံနှုန်းအရ `ORDER BY` နှင့် `GROUP BY` နောက်တွင် Parameter Placeholder (`:sort`) ကို Bind လုပ်၍ မရပါ။ ထို့ကြောင့် Developer အများစုသည် `$_GET['sort']` ကို တိုက်ရိုက် ထည့်မိပြီး SQL Injection ဖြစ်သွားတတ်ပါသည်။

- ❌ **အန္တရာယ်ရှိသော ရေးသားပုံ**:
  ```php
  $sort = $request->query->get('sort'); // e.g. "id; DROP TABLE dtb_order; --"
  $qb->orderBy('p.' . $sort, 'DESC');
  ```

- ✅ **လုံခြုံသော ရေးသားပုံ (Whitelist Validation - ခွင့်ပြုထားသော စာရင်းဖြင့်သာ စစ်ဆေးခြင်း)**:
  ```php
  // ခွင့်ပြုထားသော စာရင်းကို ကြိုတင် သတ်မှတ်ထားခြင်း
  $allowedSorts = [
      'price_asc'  => ['column' => 'pc.price02', 'direction' => 'ASC'],
      'price_desc' => ['column' => 'pc.price02', 'direction' => 'DESC'],
      'newest'     => ['column' => 'p.create_date', 'direction' => 'DESC'],
  ];

  $sortKey = $request->query->get('sort', 'newest');
  $sortConfig = $allowedSorts[$sortKey] ?? $allowedSorts['newest']; // စာရင်းထဲမရှိပါက default ကိုသာ သုံးမည်

  $qb->orderBy($sortConfig['column'], $sortConfig['direction']);
  ```

---

### ၃။ Native SQL (DBAL Connection) ကို သုံးရာတွင် Parameter မထည့်ခြင်း:
Doctrine ORM အစား Raw SQL (`$conn->executeQuery()`) သုံးရသည့်အခါ ပေါ့ဆစွာ ရေးသားမိခြင်း:

- ❌ **အန္တရာယ်ရှိသော ရေးသားပုံ**:
  ```php
  $sql = "UPDATE dtb_order SET note = '{$note}' WHERE id = {$orderId}";
  $conn->executeStatement($sql);
  ```

- ✅ **လုံခြုံသော ရေးသားပုံ**:
  ```php
  $sql = "UPDATE dtb_order SET note = :note WHERE id = :id";
  $conn->executeStatement($sql, [
      'note' => $note,
      'id'   => (int) $orderId,
  ], [
      'note' => \PDO::PARAM_STR,
      'id'   => \PDO::PARAM_INT,
  ]);
  ```

အထက်ပါ စည်းမျဉ်းများကို တိကျစွာ လိုက်နာခြင်းဖြင့် သင်၏ EC-CUBE စတိုးသည် SQL Injection တိုက်ခိုက်မှုများမှ ရာနှုန်းပြည့် လုံခြုံစိတ်ချရမည် ဖြစ်ပါသည်။
