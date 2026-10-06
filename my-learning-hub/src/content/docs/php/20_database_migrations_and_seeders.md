---
title: Database Migrations & Seeders
description: Production-grade Database Schema Version Control, Zero-downtime Migrations, Rollback Strategy, နှင့် High-Performance Relational Data Seeders အကြောင်း ပြည့်စုံသော လမ်းညွှန်
---

Database Schema ပြောင်းလဲမှုများကို Git ကဲ့သို့ Version Control လုပ်နိုင်စေသည့် **Database Migrations** နှင့် Local Development/Staging အတွက် စမ်းသပ်ဒေတာများ သန်းချီထည့်သွင်းပေးနိုင်သည့် **Seeders** အကြောင်းကို Production Best Practices များနှင့်တကွ အသေးစိတ် လေ့လာပါမည်။

---

## ၁။ Database Migration ဆိုတာ ဘာလဲ? ဘာကြောင့် သုံးသင့်တာလဲ? (What & Why)

### ပြဿနာ (Problem Without Migrations)
အဖွဲ့လိုက် Team Development လုပ်ရာတွင် သို့မဟုတ် Server ပေါ်သို့ Deploy လုပ်ရာတွင် Database Table အသစ်ဆောက်ခြင်း၊ Column အသစ်ထည့်ခြင်းများကို manual `.sql` file မျှဝေပြီး `phpMyAdmin` သို့မဟုတ် MySQL CLI မှ တစ်ဆင့် Run ပါက အောက်ပါပြဿနာများ ကြုံရသည်:
1. **Schema Drift / Mismatch**: ဘယ် Developer ရဲ့ စက်မှာ ဘယ် Column မရှိသေးဘူးဆိုတာ မသိနိုင်တော့ခြင်း။
2. **Production Deployment Disaster**: Production server ပေါ် deploy လုပ်သည့်အခါ မေ့ကျန်ခဲ့သော SQL query များကြောင့် `Column not found` error ဖြင့် site down သွားခြင်း။
3. **No Rollback Plan**: Release အသစ်တွင် ပြဿနာတက်၍ ယခင် version သို့ ပြန်ဆုတ် (Rollback) လိုပါက Database schema ကို မည်သို့ ပြန်ပြင်ရမည်ကို မသိတော့ခြင်း။

### ဖြေရှင်းချက် (The Migration Solution)
Database Migration ဆိုသည်မှာ **"Database Schema အတွက် Git Version Control"** ဖြစ်သည်။
- Code အနေဖြင့် Database ဖွဲ့စည်းပုံကို ရေးသားထားပြီး (`up()` method နှင့် `down()` method)။
- Database ထဲတွင် `migrations` ဟုခေါ်သော tracking table တစ်ခုထားရှိကာ မည်သည့် migration file များ run ပြီးသွားသည်၊ မည်သည့် batch တွင် run ခဲ့သည်ကို စနစ်တကျ မှတ်သားပေးသည်။
- CLI Command တစ်ချက် (`php migrate`) ဖြင့် အလိုအလျောက် Schema Update ပြုလုပ်ပေးနိုင်သည်။

```
+--------------------------------------------------------------+
|                    Git Repository (Code)                    |
|  2026_01_01_000001_create_users_table.php                    |
|  2026_01_02_000002_create_orders_table.php                   |
|  2026_01_03_000003_add_status_to_orders_table.php            |
+--------------------------------------------------------------+
                               |
                        [php migrate]
                               v
+--------------------------------------------------------------+
|                     Database Tracking Table                  |
|  migrations:                                                 |
|  | id | migration                              | batch |     |
|  | 1  | 2026_01_01_000001_create_users_table   | 1     |     |
|  | 2  | 2026_01_02_000002_create_orders_table  | 1     |     |
|  | 3  | 2026_01_03_000003_add_status_to_orders | 2     |     |
+--------------------------------------------------------------+
```

---

## ၂။ Pure PHP Native Migration Engine ရေးသားခြင်း

Framework (Laravel/Symfony) မပါဘဲ Native PHP ဖြင့် အလုပ်လုပ်နိုင်သော Lightweight Migration Engine တစ်ခုကို တည်ဆောက်ပြပါမည်။

### ၂.၁ Migration Base Interface / Abstract Class

```php
<?php
// src/Database/Migration.php
declare(strict_types=1);

namespace App\Database;

use PDO;

abstract class Migration
{
    public function __construct(protected PDO $pdo) {}

    /**
     * Schema အသစ်ဆောက်ခြင်း သို့မဟုတ် ပြင်ဆင်ခြင်း
     */
    abstract public function up(): void;

    /**
     * ပြုလုပ်ခဲ့သော Schema ပြောင်းလဲမှုကို နဂိုမူလအတိုင်း ပြန်ဖျက်သိမ်းခြင်း (Rollback)
     */
    abstract public function down(): void;

    /**
     * Direct SQL statement execute လုပ်ရန် helper
     */
    protected function execute(string $sql): void
    {
        $this->pdo->exec($sql);
    }
}
```

### ၂.၂ ဥပမာ Migration Class ရေးသားခြင်း

```php
<?php
// database/migrations/2026_01_01_000001_create_users_table.php
declare(strict_types=1);

use App\Database\Migration;

return new class extends Migration {
    public function up(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `users` (
            `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(150) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `status` ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'pending',
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_users_email` (`email`),
            INDEX `idx_users_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $this->execute($sql);
    }

    public function down(): void
    {
        $sql = "DROP TABLE IF EXISTS `users`;";
        $this->execute($sql);
    }
};
```

### ၂.၃ Migration Runner (CLI Engine)

ဤ Runner သည်:
1. `migrations` table ရှိမရှိ စစ်ဆေးပြီး မရှိသေးပါက တည်ဆောက်ပေးသည်။
2. Directory ထဲရှိ migration file အားလုံးကို ဖတ်ရှုပြီး Run ပြီးသားဖိုင်များကို ကျော်သွားသည်။
3. မ Run ရသေးသော ဖိုင်များကို Batch number သတ်မှတ်၍ execute လုပ်ကာ tracking table တွင် မှတ်တမ်းတင်သည်။
4. `rollback` argument ပေးပါက နောက်ဆုံး run ခဲ့သော batch တစ်ခုလုံးကို `down()` ပြန်ခေါ်ပေးသည်။

```php
<?php
// bin/migrator.php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use PDO;

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=production_app;charset=utf8mb4',
    'app_user',
    'SecretPass!2026',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

class MigrationRunner
{
    private PDO $pdo;
    private string $migrationsDir;

    public function __construct(PDO $pdo, string $migrationsDir)
    {
        $this->pdo = $pdo;
        $this->migrationsDir = rtrim($migrationsDir, '/');
        $this->ensureMigrationTable();
    }

    private function ensureMigrationTable(): void
    {
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS `migrations` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `migration` VARCHAR(255) NOT NULL UNIQUE,
            `batch` INT UNSIGNED NOT NULL,
            `executed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }

    public function migrate(): void
    {
        $executed = $this->getExecutedMigrations();
        $files = glob($this->migrationsDir . '/*.php');
        sort($files);

        $toExecute = [];
        foreach ($files as $file) {
            $name = basename($file, '.php');
            if (!in_array($name, $executed, true)) {
                $toExecute[$name] = $file;
            }
        }

        if (empty($toExecute)) {
            echo "\033[32mNothing to migrate. Schema is up to date.\033[0m\n";
            return;
        }

        $nextBatch = $this->getNextBatchNumber();

        foreach ($toExecute as $name => $filePath) {
            echo "Migrating: {$name}... ";
            $start = microtime(true);

            $migration = require $filePath;

            // MySQL DDL statements များသည် auto-commit ဖြစ်သော်လည်း 
            // Tracking insert ကို ချက်ချင်းမှတ်ပေးရပါမည်
            $migration->up();

            $stmt = $this->pdo->prepare("INSERT INTO `migrations` (`migration`, `batch`) VALUES (?, ?)");
            $stmt->execute([$name, $nextBatch]);

            $duration = round((microtime(true) - $start) * 1000, 2);
            echo "\033[32mDONE\033[0m ({$duration}ms)\n";
        }
    }

    public function rollback(): void
    {
        $lastBatch = $this->getLastBatchNumber();
        if ($lastBatch === 0) {
            echo "\033[33mNo executed migrations found to rollback.\033[0m\n";
            return;
        }

        $stmt = $this->pdo->prepare("SELECT `migration` FROM `migrations` WHERE `batch` = ? ORDER BY `id` DESC");
        $stmt->execute([$lastBatch]);
        $migrations = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo "Rolling back Batch {$lastBatch}...\n";

        foreach ($migrations as $name) {
            $filePath = $this->migrationsDir . '/' . $name . '.php';
            if (!file_exists($filePath)) {
                echo "\033[31mFile missing for {$name}. Skipping...\033[0m\n";
                continue;
            }

            echo "Rolling back: {$name}... ";
            $migration = require $filePath;
            $migration->down();

            $deleteStmt = $this->pdo->prepare("DELETE FROM `migrations` WHERE `migration` = ?");
            $deleteStmt->execute([$name]);

            echo "\033[32mROLLED BACK\033[0m\n";
        }
    }

    private function getExecutedMigrations(): array
    {
        return $this->pdo->query("SELECT `migration` FROM `migrations`")->fetchAll(PDO::FETCH_COLUMN);
    }

    private function getNextBatchNumber(): int
    {
        return $this->getLastBatchNumber() + 1;
    }

    private function getLastBatchNumber(): int
    {
        $stmt = $this->pdo->query("SELECT MAX(`batch`) FROM `migrations`");
        return (int) $stmt->fetchColumn() ?: 0;
    }
}

// CLI Command Parser
$action = $argv[1] ?? 'migrate';
$runner = new MigrationRunner($pdo, __DIR__ . '/../database/migrations');

if ($action === 'migrate') {
    $runner->migrate();
} elseif ($action === 'rollback') {
    $runner->rollback();
} else {
    echo "Usage: php bin/migrator.php [migrate|rollback]\n";
    exit(1);
}
```

---

## ၃။ Database Seeders (Dummy & Master Data Generation)

### Seeder ဆိုတာ ဘာလဲ?
Database Seeder သည်:
1. **Master / Initial Data**: System စတင်လည်ပတ်ရန် မရှိမဖြစ်လိုအပ်သော အချက်အလက်များ (ဥပမာ- Admin User, User Roles, Country Codes, Currency Rates) ကို ထည့်သွင်းပေးခြင်း။
2. **Stress & Performance Testing Data**: စနစ်၏ Performance ကို စမ်းသပ်ရန်အတွက် Dummy Records ထောင်သောင်းချီ (သို့မဟုတ် သန်းချီ) ကို စက္ကန့်ပိုင်းအတွင်း Batch Insert ပြုလုပ်ပေးခြင်း။

### ၃.၁ High-Performance Bulk Seeder (သန်းချီသော ဒေတာများကို မြန်ဆန်စွာ ထည့်သွင်းခြင်း)

အကယ်၍ `INSERT INTO users (...) VALUES (...)` ကို loop ပတ်၍ တစ်ကြောင်းချင်း query ခေါ်ပါက record ၁၀,၀၀၀ ထည့်ရန် မိနစ်ပေါင်းများစွာ ကြာမြင့်ပါမည်။
Production-level Seeder များတွင် **Batch Multi-Row Insert** နှင့် **Transaction** ကို အသုံးပြုရပါမည်:

```php
<?php
// database/seeders/UserSeeder.php
declare(strict_types=1);

namespace App\Database\Seeders;

use PDO;

class UserSeeder
{
    public function __construct(private PDO $pdo) {}

    public function run(int $totalRecords = 50000, int $batchSize = 2000): void
    {
        echo "Starting UserSeeder: Generating {$totalRecords} users (Batch Size: {$batchSize})...\n";
        $startTime = microtime(true);

        // Foreign key check များကို ခေတ္တပိတ်ထားခြင်းဖြင့် performance မြှင့်တင်နိုင်သည်
        $this->pdo->exec("SET foreign_key_checks = 0;");
        $this->pdo->beginTransaction();

        try {
            $inserted = 0;
            $defaultPasswordHash = password_hash('SecretPassword123!', PASSWORD_ARGON2ID);

            while ($inserted < $totalRecords) {
                $currentBatch = min($batchSize, $totalRecords - $inserted);
                $values = [];
                $params = [];

                for ($i = 0; $i < $currentBatch; $i++) {
                    $userId = $inserted + $i + 1;
                    $name = "User_" . $userId;
                    $email = "user_{$userId}@production-test.internal";
                    $status = ($userId % 10 === 0) ? 'suspended' : 'active';

                    $values[] = "(?, ?, ?, ?, NOW(), NOW())";
                    $params[] = $name;
                    $params[] = $email;
                    $params[] = $defaultPasswordHash;
                    $params[] = $status;
                }

                $sql = "INSERT INTO `users` (`name`, `email`, `password_hash`, `status`, `created_at`, `updated_at`) VALUES " 
                     . implode(', ', $values);

                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);

                $inserted += $currentBatch;
                echo "Inserted {$inserted} / {$totalRecords} records...\n";
            }

            $this->pdo->commit();
            $this->pdo->exec("SET foreign_key_checks = 1;");

            $duration = round(microtime(true) - $startTime, 2);
            echo "\033[32mSuccessfully seeded {$totalRecords} users in {$duration} seconds!\033[0m\n";

        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            $this->pdo->exec("SET foreign_key_checks = 1;");
            echo "\033[31mSeeding failed: " . $e->getMessage() . "\033[0m\n";
            throw $e;
        }
    }
}
```

---

## ၄။ Production Zero-Downtime Migration Strategies (Expand & Contract Pattern)

သန်းချီသော ဒေတာများရှိသည့် Production Database များတွင် Table Schema ပြောင်းလဲသည့်အခါ (ဥပမာ- Column အမည်ပြောင်းခြင်း၊ Column ဖျက်ခြင်း) `ALTER TABLE` သည် Table Lock ဖြစ်စေနိုင်ပြီး ဝန်ဆောင်မှု ရပ်တန့် (Downtime) သွားနိုင်သည်။

### Expand and Contract Pattern (အဆင့် ၃ ဆင့် ချဉ်းကပ်မှု)

```
Step 1: Expand Phase (New Column ထည့်ခြင်း)
   [users table: id, full_name, first_name(NEW), last_name(NEW)]
   Code: Read from full_name, Dual-Write to (full_name AND first_name/last_name).

Step 2: Migrate & Backfill Phase (ဒေတာဟောင်းများကို Background Batch ဖြင့် ပြောင်းပေးခြင်း)
   Batch Worker: full_name မှ data များကို first_name / last_name သို့ ခွဲထည့်ပေးသည်။
   Code: Read from new first_name/last_name.

Step 3: Contract Phase (Column ဟောင်းကို ဖျက်သိမ်းခြင်း)
   Migration: Drop column full_name.
   Code: Clean up old column references.
```

| Phase | Migration Action | Application Code Behavior | Downtime |
| :--- | :--- | :--- | :--- |
| **Phase 1 (Expand)** | Add new nullable columns | Write to both old & new columns. Read from old. | 0 seconds |
| **Phase 2 (Backfill)** | No DDL changes. Background cron script runs. | Write to both. Read from new columns. | 0 seconds |
| **Phase 3 (Contract)** | Drop old columns | Code references only new columns. | 0 seconds |

---

## ၅။ အမေးများသော မေးခွန်းများနှင့် အရေးကြီး အချက်အလက်များ

> **Q: MySQL တွင် DDL Statements (CREATE TABLE, ALTER TABLE) များကို `beginTransaction()` / `rollBack()` ဖြင့် ပြန်ဖျက်နိုင်သလား?**  
> **A:** မရပါ။ MySQL တွင် DDL Query များသည် **Implicit Commit** ဖြစ်စေပါသည်။ ဆိုလိုသည်မှာ `CREATE TABLE` သို့မဟုတ် `ALTER TABLE` run လိုက်သည်နှင့် Transaction အလိုအလျောက် commit သွားပါသည်။ ထို့ကြောင့် Migration အလယ်တွင် error တက်ပါက `down()` script သို့မဟုတ် compensation query များကို ကိုယ်တိုင် manual ပြန်လည်ရှင်းလင်းရန် လိုအပ်ပါသည်။ (PostgreSQL တွင်မူ DDL statements များကို Transaction ထဲတွင် rollback ပြုလုပ်နိုင်ပါသည်)။
