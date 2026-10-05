---
title: "18. User Privileges and Hardening"
description: "1. [Database Security ၏ အခြေခံစည်းမျဉ်း (Principle of Least Privilege)](#၁-database-security-အခြေခံစည်းမျဉ်း)"
---

## 🐬 သင်ခန်းစာ (၁၈) - MySQL Security၊ User Privileges နှင့် Database Hardening
### (Lesson 18: User Privileges, Principle of Least Privilege, SQL Injection Defense & Server Hardening)

---

## 📌 မာတိကာ (Contents)
1. [Database Security ၏ အခြေခံစည်းမျဉ်း (Principle of Least Privilege)](#၁-database-security-အခြေခံစည်းမျဉ်း)
2. [User Management အသေးစိတ် (`CREATE USER 'user'@'host'`)](#၂-user-management)
3. [Privileges ခွဲဝေခြင်းနှင့် ရုပ်သိမ်းခြင်း (`GRANT` နှင့် `REVOKE`)](#၃-privileges-ခွဲဝေခြင်း)
4. [SQL Injection (SQLi) တိုက်ခိုက်မှု အလုပ်လုပ်ပုံနှင့် ကာကွယ်နည်း (Prepared Statements)](#၄-sql-injection-ကာကွယ်နည်း)
5. [Production `my.cnf` Configuration Hardening (လုံခြုံရေး တင်းကျပ်ခြင်း)](#၅-production-mycnf-hardening)
6. [SSL/TLS Encrypted Database Connection မဖြစ်မနေ သတ်မှတ်ခြင်း](#၆-ssltls-encrypted-connection)
7. [သင်တန်းဆင်း လုပ်ငန်းခွင်သုံး DBA Master Checklist](#၇-သင်တန်းဆင်း-dba-master-checklist)

---

## ၁။ Database Security အခြေခံစည်းမျဉ်း

လုပ်ငန်းခွင်တွင် အဆိုးရွားဆုံး အမှားတစ်ခုမှာ Application (Laravel/Node) အား Database သို့ ချိတ်ဆက်ရာတွင် **`root` user ဖြင့် ချိတ်ဆက်ခြင်း** ဖြစ်သည်။

အကယ်၍ Application ထဲတွင် လုံခြုံရေး အားနည်းချက်တစ်ခု ရှိသွားပါက Hacker သည် Database Server တစ်ခုလုံးရှိ အခြား Database များ၊ ဇယားများ၊ System ဖိုင်များအားလုံးကို အပြီးတိုင် ဖျက်ဆီးပစ်နိုင်သွားမည်။

> **ရွှေစည်းမျဉ်း (Principle of Least Privilege)**:  
> User သို့မဟုတ် Application တစ်ခုချင်းစီအား ၎င်း၏ အလုပ်ပြီးမြောက်ရန် **အနည်းဆုံး လိုအပ်သော အခွင့်အရေးကိုသာ** ကန့်သတ်ပေးအပ်ရပါမည်။

---

## ၂။ User Management (`'user'@'host'`)

MySQL တွင် User တစ်ဦး၏ အထောက်အထားသည် `username` သာမက မည်သည့် Host စက်မှ လာသည်ဆိုသော **`host` အစိတ်အပိုင်းပါ ပေါင်းစပ်ထားပါသည်**:

* `'app_user'@'localhost'`: Localhost (Server စက်ပေါ်မှသာ) ဝင်ခွင့်ရှိသည်။
* `'app_user'@'192.168.1.%'`: သတ်မှတ်ထားသော Private Network IP အပိုင်းအခြားမှသာ ဝင်ခွင့်ရှိသည်။
* `'app_user'@'%'`: ကမ္ဘာ့ မည်သည့်နေရာ (အင်တာနက်) ကမဆို ဝင်ခွင့်ရှိသည် (⚠️ သတိပြုသုံးစွဲရန်)။

```sql
-- Application အတွက် သီးသန့် User အသစ် ဆောက်ခြင်း
CREATE USER 'shop_app'@'172.20.0.%' IDENTIFIED BY 'StrongP@ssw0rd2026!';
```

---

## ③။ Privileges ခွဲဝေခြင်း (`GRANT` & `REVOKE`)

Web Application အတွက် လိုအပ်သော CRUD အခွင့်အရေးကိုသာ သက်ဆိုင်ရာ Database တွင် ကန့်သတ်ပေးအပ်ခြင်း:

```sql
-- ၁။ shop_db ပေါ်တွင် SELECT, INSERT, UPDATE, DELETE သာ ပေးခြင်း (DROP, ALTER မပါပါ!)
GRANT SELECT, INSERT, UPDATE, DELETE ON shop_db.* TO 'shop_app'@'172.20.0.%';

-- ၂။ Data Analyst အတွက် Read-only (SELECT သာ) ပေးခြင်း
CREATE USER 'analyst'@'%' IDENTIFIED BY 'AnalystPass123!';
GRANT SELECT ON shop_db.* TO 'analyst'@'%';

-- ၃။ အခွင့်အရေး ပြန်လည် ရုပ်သိမ်းခြင်း
REVOKE DELETE ON shop_db.* FROM 'shop_app'@'172.20.0.%';

-- ၄။ အပြောင်းအလဲများကို အသက်သွင်းခြင်း
FLUSH PRIVILEGES;

-- ၅။ User ၏ အခွင့်အာဏာများကို ပြန်လည်စစ်ဆေးခြင်း
SHOW GRANTS FOR 'shop_app'@'172.20.0.%';
```

---

## ၄။ SQL Injection (SQLi) တိုက်ခိုက်မှုနှင့် ကာကွယ်နည်း

### တိုက်ခိုက်ခံရပုံ (မလုံခြုံသော PHP Code):
```php
// ❌ အလွန်အန္တရာယ်ရှိသော ရေးနည်း (String Concatenation)
$username = $_POST['username']; // Hacker က "' OR '1'='1" ဟု ရိုက်ထည့်လိုက်သည်
$sql = "SELECT * FROM users WHERE username = '$username'";
// အမှန်တကယ် ဖြစ်သွားသော SQL: SELECT * FROM users WHERE username = '' OR '1'='1'
// Password မလိုဘဲ ပထမဆုံး User (Admin) အဖြစ် Login အလိုအလျောက် ပွင့်သွားသည်!
```

### ကာကွယ်နည်း: Prepared Statements & Parameter Binding
Data နှင့် Query Logic ကို လုံးဝ သီးခြားခွဲထုတ်လိုက်သဖြင့် မည်သည့် Hacker မှ Query ကို လှည့်စားဖျက်ဆီး၍ မရနိုင်ပါ:

```php
// ✅ ၁၀၀% လုံခြုံသော ရေးနည်း (PHP PDO Prepared Statements)
$stmt = $pdo->prepare("SELECT id, name, password_hash FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch();
```

---

## ၅။ Production `my.cnf` Configuration Hardening

Production Server ရှိ `/etc/mysql/my.cnf` သို့မဟုတ် `/etc/my.cnf` တွင် အောက်ပါတို့ကို တင်းကျပ်စွာ ထည့်သွင်းရပါမည်:

```ini
[mysqld]
# ၁။ Port 3306 ကို အင်တာနက်ပြင်ပသို့ ပေးမသိစေဘဲ Localhost သို့မဟုတ် Private IP တွင်သာ ဖွင့်ပါ
bind-address = 127.0.0.1

# ၂။ Client စက်ထဲမှ ဖိုင်များကို Database ထဲသို့ မခိုးယူနိုင်စေရန် တားဆီးခြင်း
local_infile = 0

# ၃။ သင်္ကေတ အားနည်းသော Passwords များကို ငြင်းပယ်ရန် Validation ဖွင့်ခြင်း
plugin-load-add = validate_password.so
validate_password.policy = MEDIUM
validate_password.length = 12

# ၄။ မည်သည့်အခါမျှ အလိုအလျောက် သို့မဟုတ် အမည်မသိ User အလွတ်များ မရှိစေရ
```

---

## ၆။ SSL/TLS Encrypted Connection

Internet သို့မဟုတ် Cloud Network ပေါ်မှ Database သို့ ချိတ်ဆက်သည့်အခါ Passwords များနှင့် Customer Data များကို ကြားဖြတ် ခိုးယူမခံရစေရန် SSL/TLS Encryption မဖြစ်မနေ အသုံးပြုရပါမည်:

```ini
[mysqld]
# SSL မပါဘဲ ချိတ်ဆက်လာသော မည်သည့် Request ကိုမဆို အလိုအလျောက် ငြင်းပယ်ခြင်း
require_secure_transport = ON
```

---

## ၇။ သင်တန်းဆင်း လုပ်ငန်းခွင်သုံး DBA Master Checklist

ဂုဏ်ယူပါသည်! သင်သည် MySQL (DBMS) Beginner to Master သင်ရိုးတစ်ခုလုံးကို အောင်မြင်စွာ ပြီးမြောက်ခဲ့ပြီ ဖြစ်ပါသည်။

လုပ်ငန်းခွင်တွင် Production Database စတင်မောင်းနှင်မီ အောက်ပါ Checklist ကို အမြဲ စစ်ဆေးပါ:

- [ ] **Engine**: ဇယားအားလုံးသည် `InnoDB` ဖြစ်ပြီး `utf8mb4_unicode_ci` သုံးထားသလား?
- [ ] **Primary Keys**: ဇယားတိုင်းတွင် `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` ရှိသလား?
- [ ] **Data Types**: ငွေကြေးအတွက် `DECIMAL(12, 2)` တိကျစွာ သုံးထားသလား?
- [ ] **Indexes**: မကြာခဏ ရှာဖွေသော Columns များကို Index တင်ပြီး `EXPLAIN` ဖြင့် `type: ALL` မရှိကြောင်း စစ်ဆေးပြီးပြီလား?
- [ ] **Transactions**: ငွေလွှဲခြင်း၊ Stock နုတ်ခြင်းများတွင် `START TRANSACTION` နှင့် `FOR UPDATE` သုံးထားသလား?
- [ ] **Least Privilege**: Application အတွက် `root` မသုံးဘဲ လိုအပ်သလောက်သာ အခွင့်ပေးထားသော User သုံးထားသလား?
- [ ] **SQL Injection**: Backend Code တွင် String Concatenation မသုံးဘဲ Prepared Statements သုံးထားသလား?
- [ ] **Backups**: `--single-transaction` ဖြင့် နေ့စဉ် Backup ဆွဲပြီး S3 သို့ သိမ်းဆည်းထားသလား?
- [ ] **Binary Logs**: Point-in-time recovery အတွက် `log_bin = ON` ဖွင့်ထားသလား?
- [ ] **Network Security**: Database Port 3306 ကို Public Internet မှ တိုက်ရိုက် ခေါ်ဆိုခွင့် မပေးဘဲ Firewall / Private Subnet ထဲတွင် ထားရှိသလား?
