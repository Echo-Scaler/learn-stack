---
title: Database Replication & Connection Pooling in PHP
description: Primary-Replica Architecture, Read/Write Splitting, Replication Lag ဖြေရှင်းနည်း (Sticky Reads), နှင့် PHP Connection Pooling (ProxySQL, PgBouncer, Persistent PDO, Swoole Pool)
---

Web Application တစ်ခုတွင် Traffic အဆမတန် တက်လာသည့်အခါ Database တစ်ခုတည်းဖြင့် ရေးခြင်း (Write) နှင့် ဖတ်ခြင်း (Read) အားလုံးကို မခံနိုင်တော့ပါ။ ထိုအခါ **Database Replication (Primary-Replica Architecture)** ဖြင့် Read Load ကို ခွဲထုတ်ရပြီး၊ PHP ၏ Stateless သဘာဝကြောင့် ဖြစ်ပေါ်တတ်သော Database Connection မလုံလောက်မှု ပြဿနာကို **Connection Pooling** ဖြင့် မည်သို့ ဖြေရှင်းရမည်ကို လေ့လာပါမည်။

---

## ၁။ Database Replication ဆိုတာ ဘာလဲ? (What & Why)

### Primary-Replica (Master-Slave) Architecture
Web traffic အများစုတွင် Request များ၏ ၈၀% မှ ၉၀% သည် **Read Query (SELECT)** များဖြစ်ပြီး ကျန် ၁၀% သာလျှင် **Write Query (INSERT, UPDATE, DELETE)** များ ဖြစ်ကြသည်။
- **Primary Node (Writer)**: Data ပြင်ဆင်ခြင်း၊ အသစ်သွင်းခြင်းများကို လက်ခံပြီး Binary Log (Binlog) ထုတ်ပေးသည်။
- **Replica Nodes (Readers)**: Primary ထံမှ Log များကို ဖတ်ယူပြီး မိမိထံတွင် Asynchronously ဒေတာတူအောင် ကူးယူထားသည်။ SELECT query များကို တာဝန်ယူပေးသည်။

```
                          +-------------------------+
                          |   PHP Application       |
                          +-------------------------+
                             /                   \
        WRITE (INSERT/UPDATE/DELETE)       READ (SELECT)
                           /                       \
                          v                         v
              +----------------------+   Replication   +----------------------+
              |  Primary Database    | --------------> |  Replica Database 1  |
              |  (Read/Write)        |                 |  (Read-Only)         |
              +----------------------+                 +----------------------+
                               \
                                \ Replication          +----------------------+
                                 --------------------> |  Replica Database 2  |
                                                       |  (Read-Only)         |
                                                       +----------------------+
```

---

## ၂။ Read/Write Splitting PDO Connection Manager

PHP Code ထဲတွင် Query အမျိုးအစားပေါ် မူတည်၍ Primary သို့မဟုတ် Replica သို့ အလိုအလျောက် ရွေးချယ်ချိတ်ဆက်ပေးနိုင်သော Database Manager တစ်ခုကို တည်ဆောက်ပါမည်:

```php
<?php
// src/Database/ConnectionManager.php
declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;

class ConnectionManager
{
    private ?PDO $writer = null;
    private ?PDO $reader = null;

    /**
     * @param array $writerConfig ['dsn' => '...', 'user' => '...', 'pass' => '...']
     * @param array<array> $readersConfig List of reader configurations
     */
    public function __construct(
        private array $writerConfig,
        private array $readersConfig
    ) {}

    /**
     * Writer (Primary) Connection ကို ရယူခြင်း
     */
    public function getWriter(): PDO
    {
        if ($this->writer === null) {
            $this->writer = $this->createConnection(
                $this->writerConfig['dsn'],
                $this->writerConfig['user'],
                $this->writerConfig['pass']
            );
        }
        return $this->writer;
    }

    /**
     * Reader (Replica) Connection ကို ရယူခြင်း (Load Balancing ဖြင့်)
     */
    public function getReader(): PDO
    {
        if ($this->reader === null) {
            if (empty($this->readersConfig)) {
                return $this->getWriter();
            }

            // Replica server များထဲမှ Random တစ်ခုကို ရွေးချယ်ခြင်း
            $selected = $this->readersConfig[array_rand($this->readersConfig)];

            try {
                $this->reader = $this->createConnection(
                    $selected['dsn'],
                    $selected['user'],
                    $selected['pass']
                );
            } catch (PDOException $e) {
                // Replica Down နေပါက Writer သို့ Fallback ပြုလုပ်ခြင်း
                error_log("Replica connection failed: " . $e->getMessage() . " - Fallback to Writer.");
                return $this->getWriter();
            }
        }
        return $this->reader;
    }

    private function createConnection(string $dsn, string $user, string $pass): PDO
    {
        return new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2, // 2s Connection Timeout
        ]);
    }
}
```

---

## ၃။ The Replication Lag Problem & Sticky Reads Pattern

### ပြဿနာ (Replication Lag Dilemma)
MySQL Replication သည် **Asynchronous** ဖြစ်သည်။
1. User က ၎င်း၏ Profile Name ကို `"Aung Aung"` မှ `"Zaw Zaw"` သို့ ပြောင်းလိုက်သည် (`UPDATE` executed on Primary)။
2. စက္ကန့်ပိုင်း မပြည့်မီ User က စာမျက်နှာကို Refresh လုပ်လိုက်သည် (`SELECT` executed on Replica)။
3. Primary မှ ဒေတာက Replica ဆီသို့ မရောက်သေးပါ (Replication Lag ကြောင့် မီလီစက္ကန့်အနည်းငယ် နောက်ကျနေသည်)။
4. User မျက်နှာပြင်တွင် နာမည်ဟောင်း `"Aung Aung"` သာ ဆက်ပေါ်နေသဖြင့် User က Error တက်သည်ဟု ထင်သွားသည်။

### ဖြေရှင်းချက် (Sticky Read / Read-Your-Own-Writes Pattern)
အကယ်၍ Request တစ်ခုတွင် Write operation တစ်ခု ပြုလုပ်ခဲ့ပါက ထို User ၏ နောက်ဆက်တွဲ Request များကို သတ်မှတ်ထားသော အချိန်အတိုင်းအတာတစ်ခုအထိ (ဥပမာ- ၅ စက္ကန့်) Replica သို့ မပို့ဘဲ **Primary (Writer) ဆီသို့ တိုက်ရိုက် ပို့ပေးခြင်း (Sticky Reads)** ဖြင့် ဖြေရှင်းရပါမည်:

```php
<?php
// src/Database/SmartDatabaseGateway.php
declare(strict_types=1);

namespace App\Database;

use PDO;

class SmartDatabaseGateway
{
    public function __construct(private ConnectionManager $manager) {}

    /**
     * Query အလိုက် သင့်တော်သော Connection ကို ရွေးချယ်ပေးခြင်း
     */
    public function getConnection(string $sql): PDO
    {
        $trimmed = strtoupper(trim($sql));

        // Write Query ဖြစ်ပါက Writer သို့ ပို့ပြီး Session တွင် Timestamp မှတ်ထားမည်
        if (str_starts_with($trimmed, 'INSERT') ||
            str_starts_with($trimmed, 'UPDATE') ||
            str_starts_with($trimmed, 'DELETE') ||
            str_starts_with($trimmed, 'ALTER')) {
            
            $this->markRecentWrite();
            return $this->manager->getWriter();
        }

        // မကြာသေးမီက Write လုပ်ထားသော User ဖြစ်ပါက Primary ထံမှသာ ဖတ်စေမည် (Sticky Read)
        if ($this->hasRecentWrite()) {
            return $this->manager->getWriter();
        }

        // ပုံမှန် Read Query ဖြစ်ပါက Replica သို့ ပို့မည်
        return $this->manager->getReader();
    }

    private function markRecentWrite(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['last_write_timestamp'] = microtime(true);
        }
    }

    private function hasRecentWrite(float $stickyWindowSeconds = 5.0): bool
    {
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['last_write_timestamp'])) {
            $timeSinceWrite = microtime(true) - (float) $_SESSION['last_write_timestamp'];
            if ($timeSinceWrite < $stickyWindowSeconds) {
                return true;
            }
        }
        return false;
    }
}
```

---

## ၄။ Connection Pooling in PHP: The Stateless Dilemma & Solutions

### ပြဿနာ (Why PHP struggles with Connection Pooling)
Java, Go, သို့မဟုတ် Node.js ကဲ့သို့သော Language များတွင် Application သည် Memory ပေါ်တွင် အမြဲလည်ပတ်နေသော Long-running process ဖြစ်သဖြင့် Connection Pool (ဥပမာ- HikariCP) ကို Memory ထဲတွင် လွယ်ကူစွာ မွေးမြူထားနိုင်သည်။

သို့သော် PHP-FPM တွင်မူ Request တစ်ခု ပြီးဆုံးသွားတိုင်း Worker Memory ကို သန့်ရှင်းပစ်သည့် **Stateless Shared-Nothing Architecture** ဖြစ်သောကြောင့် PHP Process တစ်ခုချင်းစီကြားတွင် Memory မျှဝေ၍ Native Connection Pool ဆောက်ရန် ခက်ခဲသည်။

```
Request 1000 simultaneous users:
  1000 PHP-FPM workers ---> 1000 Direct MySQL Connections!
  ===> MySQL: "ERROR 1040: Too many connections" (Server Crash!)
```

---

### ဖြေရှင်းနည်း (၃) မျိုး

### ၄.၁ PDO Persistent Connection (`PDO::ATTR_PERSISTENT`)

PHP-FPM Worker သည် Request ပြီးဆုံးသွားသော်လည်း MySQL Connection ကို မဖြတ်ဘဲ သိမ်းထားပြီး နောက် Request တွင် ပြန်လည်အသုံးပြုစေခြင်း ဖြစ်သည်။

```php
$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_PERSISTENT => true,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);
```
> [!WARNING]
> **Persistent PDO ၏ အန္တရာယ် (Transaction Leak)**: အကယ်၍ Request တစ်ခုတွင် `beginTransaction()` လုပ်ထားပြီး Error ကြောင့် `rollBack()` မလုပ်ဘဲ exit ဖြစ်သွားပါက Connection သည် Uncommitted Transaction အခြေအနေဖြင့် ကျန်ရှိနေမည်ဖြစ်ပြီး နောက် Request က ထို Connection ကို ဆက်သုံးသည့်အခါ ဒေတာများ လွဲမှားသွားနိုင်သည်။

---

### ၄.၂ External Connection Pooler (ProxySQL / PgBouncer) - [Production Standard]

Production Enterprise စနစ်များတွင် အကောင်းဆုံးနည်းလမ်းမှာ PHP နှင့် Database ကြားတွင် **Database Proxy (ProxySQL သို့မဟုတ် PgBouncer)** ခံထားခြင်း ဖြစ်သည်။

```
+------------------+
| PHP-FPM Worker 1 | ---\
+------------------+     \
+------------------+      ---> +--------------------+      +--------------------+
| PHP-FPM Worker 2 | --------> |  ProxySQL /        | ---> |  MySQL Primary     |
+------------------+     /     |  PgBouncer         |      +--------------------+
+------------------+    /      |  (Connection Pool) | ---> |  MySQL Replica     |
| PHP-FPM Worker N | --/       +--------------------+      +--------------------+
 (Thousands of requests)       (Holds only 50-100 real      (No connection
                                persistent connections)      exhaustion)
```

**ProxySQL ၏ အားသာချက်များ**:
1. **Multiplexing**: PHP worker ထောင်ပေါင်းများစွာမှ လာသော connection များကို Database အစစ်ဆီသို့ persistent connection ၅၀ မှ ၁၀၀ ခန့်ဖြင့်သာ အလှည့်ကျ ချိတ်ဆက်ပေးသည်။
2. **Query Routing**: PHP code ပြင်စရာမလိုဘဲ `SELECT` query များကို Replica သို့၊ `INSERT/UPDATE` များကို Primary သို့ ProxySQL က အလိုအလျောက် ခွဲပို့ပေးသည်။
3. **Failover**: Replica node တစ်ခု ပျက်စီးသွားပါက Traffic များကို ချက်ချင်း အခြား node သို့ လွှဲပြောင်းပေးသည်။

---

### ၄.၃ Swoole / OpenSwoole Coroutine Connection Pool

PHP ကို Long-running Coroutine Server အဖြစ် အသုံးပြုပါက Native Connection Pool ကို Memory ပေါ်တွင် တိုက်ရိုက် ဆောက်လုပ်နိုင်သည်:

```php
<?php
// swoole_pool.php
use Swoole\Database\PDOPool;
use Swoole\Database\PDOConfig;

$config = (new PDOConfig())
    ->withHost('127.0.0.1')
    ->withPort(3306)
    ->withDbName('app_db')
    ->withCharset('utf8mb4')
    ->withUsername('root')
    ->withPassword('secret');

// Persistent 64 connections pool
$pool = new PDOPool($config, 64);

$server = new Swoole\HTTP\Server('0.0.0.0', 9501);

$server->on('Request', function ($request, $response) use ($pool) {
    // Pool ထဲမှ connection တစ်ခုကို ခေတ္တ ငှားယူခြင်း
    $pdo = $pool->get();
    
    try {
        $stmt = $pdo->query("SELECT * FROM users LIMIT 10");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $response->header('Content-Type', 'application/json');
        $response->end(json_encode($data));
    } finally {
        // အလုပ်ပြီးပါက connection ကို pool ထဲသို့ ပြန်အပ်ခြင်း
        $pool->put($pdo);
    }
});

$server->start();
```

---

## ၅။ Production Checklist

1. **Replication Health Monitoring**: Replica server ၏ `SHOW REPLICA STATUS\G` မှ `Seconds_Behind_Master` ကို စောင့်ကြည့်ပြီး Lag အရမ်းများပါက Alert ပေးရန် စီစဉ်ထားပါ။
2. **Read-Only Enforce on Replica**: Replica Database တွင် `read_only = ON` သို့မဟုတ် `super_read_only = ON` သတ်မှတ်ထားခြင်းဖြင့် မတော်တဆ Replica ပေါ်သို့ တိုက်ရိုက် Write မိခြင်းမှ ကာကွယ်ပါ။
3. **Use ProxySQL for Zero-code Routing**: Microservices နှင့် Web cluster ကြီးများတွင် Connection Pooling နှင့် Read/Write split အတွက် ProxySQL ကို အသုံးပြုခြင်းသည် အထိရောက်ဆုံးနှင့် အန္တရာယ်အကင်းဆုံး ဖြစ်သည်။
