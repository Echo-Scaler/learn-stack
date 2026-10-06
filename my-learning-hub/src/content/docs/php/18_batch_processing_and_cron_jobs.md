---
title: "18. Batch Processing, Cron Jobs & Task Scheduler"
description: "Linux Crontab ချိတ်ဆက်မှု၊ Pure PHP Task Scheduler Engine၊ Millions Data Chunking၊ Memory Leak ကာကွယ်ခြင်းနှင့် Overlap Mutex Locking"
---

# Batch Processing, Cron Jobs & Task Scheduler (လုပ်ငန်းခွင်သုံး အလိုအလျောက် စနစ်များ)

Web Application များတွင် အီးမေးလ် ထောင်ပေါင်းများစွာ တစ်ပြိုင်နက် ပို့ခြင်း၊ ညသန်းခေါင်အချိန်တွင် လစဉ်ငွေတောင်းခံလွှာ (Monthly Billing/Invoice) ထုတ်ပေးခြင်း၊ နေ့စဉ် ဒေတာဘေ့စ် Backup ပြုလုပ်ခြင်း စသည့် အချိန်ကြာမြင့်သော အလုပ်များကို User HTTP Request အတွင်း မလုပ်ဆောင်ဘဲ နောက်ကွယ်မှ အလိုအလျောက် Run သော **Batch Processing & Task Scheduler** စနစ်ဖြင့် လုပ်ဆောင်ရပါမည်။

---

## ၁။ Batch Processing နှင့် Cron Job ဆိုတာဘာလဲ?

### (က) Cron Job ဆိုတာဘာလဲ? (What is a Cron Job?)
Linux Operating System တွင် ပါဝင်သော **Cron Daemon (`crond`)** သည် သတ်မှတ်ထားသော အချိန်ဇယား (Schedule: ဥပမာ- နေ့စဉ် ည ၁၂:၀၀ နာရီ၊ ၁ မိနစ်လျှင် တစ်ကြိမ်) အတိုင်း Script များကို အလိုအလျောက် လှုံ့ဆော်ခေါ်ယူပေးသော စနစ်ဖြစ်ပါသည်။

### (ခ) Batch Processing ဆိုတာဘာလဲ? (What is Batch Processing?)
ဒေတာ အရေအတွက် ထောင်သောင်းချီ (သို့မဟုတ် သန်းနှင့်ချီ) ရှိသော လုပ်ငန်းစဉ်ကြီးများကို System Memory မပြည့်စေဘဲ အပိုင်းလိုက် (Batch/Chunk ဥပမာ- တစ်ကြိမ်လျှင် အခု ၅၀၀ စီ) ခွဲခြမ်း၍ စနစ်တကျ တွက်ချက်လုပ်ဆောင်သော နည်းပညာဖြစ်ပါသည်။

### (ဂ) ဘာကြောင့် သုံးရသလဲ? (Why do we use it?)
1. **HTTP Timeout ရှောင်ရှားရန်**: Web Request များသည် 30s သို့မဟုတ် 60s ကျော်ပါက Nginx မှ `504 Gateway Timeout` ပေးပြီး ပြတ်တောက်သွားသည်။ Batch Script များသည် CLI မှ Run သဖြင့် အချိန်အကန့်အသတ်မရှိ Run နိုင်သည်။
2. **Server Resource Optimization**: နေ့ခင်းဘက်တွင် အသုံးပြုသူများသဖြင့် လေးလံသော Report တွက်ချက်မှုများကို Traffic နည်းပါးသော ည ၂:၀၀ နာရီတွင် အလိုအလျောက် ပြုလုပ်ရန်။
3. **Automated Maintenance**: ယာယီဖိုင်များ ရှင်းလင်းခြင်း၊ သက်တမ်းကုန် Session များကို ဖျက်ပစ်ခြင်း။

---

## ၂။ The Single Crontab Dispatcher Pattern

ရှေးယခင်က Job အသစ်တစ်ခု တိုးတိုင်း Linux Server ၏ `crontab -e` ထဲသို့ တစ်ကြောင်းချင်း သွားထည့်ခဲ့ရသည်:

```bash
# မကောင်းသော ပုံစံ (Old Bad Approach - Server တွင် စီမံရခက်ခဲသည်)
0 0 * * * php /var/www/app/send_invoices.php
*/15 * * * * php /var/www/app/sync_inventory.php
0 2 * * 0 php /var/www/app/clean_logs.php
```

ခေတ်မီ Enterprise Architecture တွင် Linux Crontab တွင် **တစ်ကြောင်းတည်းသာ** ထည့်သွင်းထားပြီး၊ PHP ကသာ Task Scheduler အဖြစ် စီမံခန့်ခွဲပါသည်:

```bash
# ခေတ်မီ Standard ပုံစံ (Modern Single Entrypoint)
* * * * * php /var/www/app/console schedule:run >> /var/log/cron_output.log 2>&1
```

---

## ၃။ Pure PHP Task Scheduler Engine တည်ဆောက်ခြင်း

```php
<?php

class ScheduledTask
{
    private string $expression = '* * * * *';
    private bool $withoutOverlapping = false;

    public function __construct(
        public string $name,
        public $callback
    ) {}

    // Cron Expression စစ်ဆေးခြင်း (Helper Methods)
    public function everyMinute(): self { $this->expression = '* * * * *'; return $this; }
    public function hourly(): self      { $this->expression = '0 * * * *'; return $this; }
    public function dailyAt(string $time): self 
    { 
        [$hour, $minute] = explode(':', $time);
        $this->expression = "{$minute} {$hour} * * *"; 
        return $this; 
    }

    // တူညီသော Task နှစ်ခု တစ်ပြိုင်နက် မပြေးစေရန် Lock ချထားခြင်း
    public function preventOverlap(): self
    {
        $this->withoutOverlapping = true;
        return $this;
    }

    public function isDue(): bool
    {
        // လက်ရှိ အချိန်နှင့် expression ကိုက်ညီမှု ရှိ/မရှိ စစ်ဆေးသည်
        [$cMin, $cHour, $cDom, $cMon, $cDow] = explode(' ', date('i G j n w'));
        [$eMin, $eHour, $eDom, $eMon, $eDow] = explode(' ', $this->expression);

        return $this->matchComponent($eMin, (int)$cMin) &&
               $this->matchComponent($eHour, (int)$cHour) &&
               $this->matchComponent($eDom, (int)$cDom) &&
               $this->matchComponent($eMon, (int)$cMon) &&
               $this->matchComponent($eDow, (int)$cDow);
    }

    private function matchComponent(string $expr, int $value): bool
    {
        if ($expr === '*') return true;
        if (str_contains($expr, '/')) {
            $step = (int)explode('/', $expr)[1];
            return ($value % $step) === 0;
        }
        return (int)$expr === $value;
    }

    public function execute(): void
    {
        $lockFile = sys_get_temp_dir() . "/task_" . md5($this->name) . ".lock";
        $lockHandle = null;

        if ($this->withoutOverlapping) {
            $lockHandle = fopen($lockFile, 'w+');
            // အခြား Process က Run နေဆဲဖြစ်ပါက ဤ Task ကို ယခုအကြိမ် ကျော်သွားမည်
            if (!flock($lockHandle, LOCK_EX | LOCK_NB)) {
                echo "[" . date('Y-m-d H:i:s') . "] Task '{$this->name}' is already running. Skipping.\n";
                fclose($lockHandle);
                return;
            }
        }

        try {
            echo "[" . date('Y-m-d H:i:s') . "] Starting Task: {$this->name}\n";
            ($this->callback)();
            echo "[" . date('Y-m-d H:i:s') . "] Finished Task: {$this->name}\n";
        } finally {
            if ($lockHandle) {
                flock($lockHandle, LOCK_UN);
                fclose($lockHandle);
                @unlink($lockFile);
            }
        }
    }
}

class Scheduler
{
    /** @var ScheduledTask[] */
    private array $tasks = [];

    public function call(string $name, callable $callback): ScheduledTask
    {
        $task = new ScheduledTask($name, $callback);
        $this->tasks[] = $task;
        return $task;
    }

    public function run(): void
    {
        foreach ($this->tasks as $task) {
            if ($task->isDue()) {
                $task->execute();
            }
        }
    }
}
```

---

## ၄။ ကြီးမားသော Database များအတွက် High-Performance Batch Processing

Database ထဲတွင် Record ၁,၀၀၀,၀၀၀ (၁ သန်း) ရှိသည့်အခါ `SELECT * FROM orders` ဟု ရေးပါက RAM ပြည့်သွားပြီး Server သေသွားပါမည်။

### အဖြစ်များသော အမှား (Bad Offset Pagination Trap):
`SELECT * FROM orders LIMIT 1000 OFFSET 500000;`
Offset တန်ဖိုး ကြီးမားလာသည်နှင့်အမျှ MySQL သည် ပထမဆုံး Record ၅ သိန်းလုံးကို ဖတ်ရှုတွက်ချက်ရသဖြင့် Query ကြာမြင့်ချိန်သည် စက္ကန့်ပိုင်းမှ မိနစ်ပိုင်းအထိ နှေးကွေးသွားပါသည်။

### မှန်ကန်သော ပုံစံ (Chunk by ID / Keyset Pagination):

```php
<?php
// Production Batch Processor (Millions of Records Memory-Safe)
function processMonthlyInvoices(PDO $pdo): void
{
    // CLI Script ဖြစ်သောကြောင့် Timeout မဖြစ်စေရန် အချိန်ကန့်သတ်ချက် ဖယ်ရှားသည်
    set_time_limit(0);
    ini_set('memory_limit', '512M');

    $batchSize = 500;
    $lastId = 0;
    $processedCount = 0;

    echo "--- Monthly Invoicing Batch Started ---\n";

    while (true) {
        // ID > :lastId ဖြင့်သာ ဆွဲသဖြင့် Index ကို အမြဲ B-Tree မှ တိုက်ရိုက် ခုန်ဖတ်သည် (O(1) Speed)
        $stmt = $pdo->prepare("
            SELECT id, user_id, amount, status 
            FROM orders 
            WHERE id > :last_id AND status = 'PENDING_INVOICE'
            ORDER BY id ASC 
            LIMIT :batch_size
        ");
        $stmt->bindValue(':last_id', $lastId, PDO::PARAM_INT);
        $stmt->bindValue(':batch_size', $batchSize, PDO::PARAM_INT);
        $stmt->execute();

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($orders)) {
            break; // Data အားလုံး ပြီးဆုံးသွားပြီ
        }

        // Database Transaction ဖြင့် အပိုင်းလိုက် Commit ပြုလုပ်သည်
        $pdo->beginTransaction();
        try {
            foreach ($orders as $order) {
                // Generate Invoice PDF or Send Email
                // ... logic ...

                // Update Status
                $updateStmt = $pdo->prepare("UPDATE orders SET status = 'INVOICED' WHERE id = :id");
                $updateStmt->execute([':id' => $order['id']]);

                $lastId = $order['id']; // နောက် Batch အတွက် ID အသစ် သတ်မှတ်သည်
                $processedCount++;
            }

            $pdo->commit();
            echo "Processed {$processedCount} orders... (Current ID: {$lastId})\n";

        } catch (Throwable $e) {
            $pdo->rollBack();
            error_log("Batch Failed at ID {$lastId}: " . $e->getMessage());
            break;
        }

        // 💡 Memory Leak ကာကွယ်ရန် အရေးကြီးသော အချက်:
        // Memory ရှင်းလင်းခြင်းနှင့် PDO Prepared Statements Cache များကို ရှင်းထုတ်သည်
        unset($orders);
        gc_collect_cycles(); // PHP Garbage Collector ကို လှုံ့ဆော်သည်
    }

    echo "--- Batch Completed! Total Processed: {$processedCount} ---\n";
}
```

---

## ၅။ Graceful Shutdown (Signal Handling `pcntl_signal`)

Server ကို Deployment ပြုလုပ်ချိန် သို့မဟုတ် Restart ပြုလုပ်ချိန်တွင် Linux က `SIGTERM` (Stop signal) ပေးပို့တတ်ပါသည်။ အကယ်၍ Batch Script က Database Transaction ရေးနေဆဲတွင် ချက်ချင်း အတင်းအဓမ္မ သေသွားပါက Data Corrupt ဖြစ်တတ်သည်။

```php
<?php
// POSIX Signal Handling ဖြင့် အဆင့်လိုက် ဘေးကင်းစွာ ပိတ်သိမ်းခြင်း
$shouldExit = false;

if (extension_loaded('pcntl')) {
    pcntl_async_signals(true);

    pcntl_signal(SIGTERM, function () use (&$shouldExit) {
        echo "\n[SIGTERM Received] Gracefully stopping after current batch finishes...\n";
        $shouldExit = true;
    });

    pcntl_signal(SIGINT, function () use (&$shouldExit) {
        echo "\n[Ctrl+C Pressed] Stopping gracefully...\n";
        $shouldExit = true;
    });
}

// Batch Loop အတွင်း စစ်ဆေးခြင်း:
while (!$shouldExit) {
    // Process single batch...
    
    if ($shouldExit) {
        echo "Exiting safely without data loss.\n";
        exit(0);
    }
}
```

---

## ၆။ Production Best Practices (Genba Rules)

1. **Never Output Unbuffered Text**: Cron Job မှ Output များကို Console ပေါ်သို့ မလိုအပ်ဘဲ `echo` အလွန်အကျွံ မလုပ်ပါနှင့် (I/O Disk ပြည့်တတ်သည်)။ လိုအပ်သော Log ကို သီးသန့် Log File ထဲသို့သာ ရေးပါ။
2. **Prevent Overlap**: ကြာမြင့်ချိန် ၅ မိနစ်ရှိသော Batch ကို ၁ မိနစ်တစ်ခါ ခေါ်မိပါက နောက် Task တစ်ခုက ထပ်တိုးပြီး Process များ ပြည့်ကျပ်သွားတတ်သည်။ **Locking (`preventOverlap()`)** မဖြစ်မနေ ထည့်သွင်းပါ။
3. **Use Idempotent Logic**: အကြောင်းအမျိုးမျိုးကြောင့် Batch တစ်ခု ကျရှုံးပြီး ပြန်လည် Run ရပါက ယခင်ပြီးနှင့်ပြီးသော Data များကို နှစ်ခါထပ်မလုပ်မိစေရန် **Idempotent (သီးခြား အခြေအနေ မှတ်တမ်းတင်ထားသော စနစ်)** ဖြင့် ရေးဆွဲပါ။
