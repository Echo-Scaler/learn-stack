---
title: "14. File I/O, Streams & File Locking"
description: "PHP File I/O, Stream Wrappers, flock() Concurrency Locking, Memory-Efficient Chunking နှင့် Generator yield ဖြင့် ကြီးမားသော Data များ ကိုင်တွယ်ပုံ"
---

# PHP File I/O, Stream Wrappers & File Locking (လုပ်ငန်းခွင်သုံး လက်တွေ့လမ်းညွှန်)

Web Application များတွင် Profile ပုံတင်ခြင်း၊ နေ့စဉ် Access Logs ဖတ်ရှုခြင်း၊ Report CSV ထုတ်ပေးခြင်းနှင့် Data Import ပြုလုပ်ခြင်း စသည့် **File I/O (Input/Output)** လုပ်ငန်းစဉ်များသည် Backend Engineer တိုင်း မဖြစ်မနေ ကျွမ်းကျင်ရမည့် အဓိက အစိတ်အပိုင်း ဖြစ်ပါသည်။

---

## ၁။ File I/O ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?

### (က) File I/O ဆိုတာဘာလဲ? (What is File I/O?)
File I/O ဆိုသည်မှာ Server ၏ Hard Disk / SSD (Storage) ပေါ်တွင် ရှိသော ဖိုင်များကို PHP script မှ **ဖွင့်ဖတ်ခြင်း (Read)**၊ **အသစ်ရေးသွင်းခြင်း (Write)**၊ **ပြင်ဆင်ခြင်း (Update)** နှင့် **ဖျက်ပစ်ခြင်း (Delete)** ပြုလုပ်သော နည်းပညာဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် သုံးရသလဲ? (Why do we use it?)
1. **Persistent Data Storage**: Database အသုံးမပြုဘဲ Configuration (`.env`, `.json`), System Logs (`.log`), Cache ဖိုင်များကို သိမ်းဆည်းရန်။
2. **Data Export/Import**: သုံးစွဲသူများအတွက် Excel/CSV Report များ ထုတ်ပေးခြင်းနှင့် စာရင်းဇယားဖိုင်များကို Database ထဲသို့ ထည့်သွင်းခြင်း။
3. **Log Rotation & Monitoring**: နေ့စဉ် Server Error Logs နှင့် Audit Trail များကို မှတ်တမ်းတင်ခြင်း။
4. **Temporary Buffer**: API Response ကြီးမားသည့်အခါ Memory မပြည့်စေရန် ယာယီဖိုင်အဖြစ် သိမ်းဆည်းခြင်း။

> [!WARNING]
> **အဖြစ်များသော အမှား (Common Trap)**: `file_get_contents()` သို့မဟုတ် `file()` ကို အသုံးပြု၍ 1GB ရှိသော Log ဖိုင်ကို တစ်ပြိုင်နက် ဖတ်ပါက PHP သည် ဖိုင်တစ်ခုလုံးကို RAM (Memory) ထဲသို့ တင်လိုက်သဖြင့် **`Fatal error: Allowed memory size of 134217728 bytes exhausted`** ဖြစ်ကာ Script ရပ်တန့်သွားပါမည်။ လုပ်ငန်းခွင်တွင် **Stream / Chunked Reading** ကိုသာ အသုံးပြုရပါမည်။

---

## ၂။ High-Level vs Low-Level File Functions

| အုပ်စု | Functions | အားသာချက် | အားနည်းချက် / သင့်တော်သောအခြေအနေ |
| :--- | :--- | :--- | :--- |
| **High-Level** | `file_get_contents()`, `file_put_contents()`, `readfile()` | ကုဒ်တိုတောင်းသည်၊ တစ်ကြောင်းတည်းဖြင့် ပြီးသည် | သေးငယ်သောဖိုင်များ (Configuration, 5MB အောက်ဖိုင်များ) အတွက်သာ ကောင်းသည် |
| **Low-Level (Streams)** | `fopen()`, `fgets()`, `fread()`, `fwrite()`, `fgetcsv()`, `fclose()` | Memory အသုံးချမှု အလွန်နည်းသည်၊ 10GB ဖိုင်ပင် ဖတ်နိုင်သည် | Resource handle စီမံခန့်ခွဲရန် လိုအပ်သည် (`fclose` မမေ့ရ) |

---

## ၃။ File Locking (`flock()`) ဖြင့် Concurrency Race Condition ကာကွယ်ခြင်း

အသုံးပြုသူ ထောင်ပေါင်းများစွာ တစ်ပြိုင်နက် Request ပို့နေသော Production Server များတွင် Request ၂ ခုသည် ဖိုင်တစ်ခုတည်းကို တစ်ပြိုင်နက် ရေးသားမိပါက ဖိုင်ပျက်စီးခြင်း (File Corruption) သို့မဟုတ် Data ပျောက်ဆုံးခြင်း ဖြစ်ပေါ်တတ်ပါသည်။

### Lock အမျိုးအစား ၃ မျိုး:
1. **Shared Lock (`LOCK_SH`)**: ဖိုင်ကို ဖတ်နေစဉ် အခြားသူများလည်း ဖတ်ခွင့်ပြုသည်၊ သို့သော် မည်သူမျှ ရေးခွင့်မရှိပါ။
2. **Exclusive Lock (`LOCK_EX`)**: ဖိုင်ကို ရေးနေစဉ် အခြားသူများ ဖတ်ခြင်းရော ရေးခြင်းပါ မပြုလုပ်နိုင်အောင် သော့ခတ်ထားသည်။
3. **Non-blocking Flag (`LOCK_NB`)**: အခြား Process တစ်ခုက သော့ခတ်ထားပါက စောင့်မနေဘဲ ချက်ချင်း False ပြန်ပေးသည်။

```php
<?php
// Production-Ready Concurrent Log Writer
function writeSafeLog(string $filePath, string $message): bool
{
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $handle = fopen($filePath, 'a'); // Append mode
    if (!$handle) {
        return false;
    }

    // LOCK_EX (Exclusive lock) ရယူသည်၊ မရမချင်း စောင့်ဆိုင်းသည်
    if (flock($handle, LOCK_EX)) {
        $timestamp = date('Y-m-d H:i:s');
        $logLine = "[{$timestamp}] " . $message . PHP_EOL;
        fwrite($handle, $logLine);
        fflush($handle);        // Buffer မှ Disk သို့ ချက်ချင်း ရေးချသည်
        flock($handle, LOCK_UN); // Lock ပြန်ဖွင့်ပေးသည်
        fclose($handle);
        return true;
    }

    fclose($handle);
    return false;
}
```

---

## ၄။ Memory အသုံးချမှု သုညနီးပါးဖြင့် ကြီးမားသော CSV ဖတ်ရှုခြင်း (Generators & `yield`)

PHP Generator ကို အသုံးပြုခြင်းဖြင့် 10 Million Rows ရှိသော CSV ဖိုင်ကို RAM Memory **10MB မကျော်စေဘဲ** အစမှ အဆုံး စစ်ဆေးနိုင်ပါသည်။

```php
<?php
// Memory Limit မထိဘဲ ဖိုင်ကြီးများကို Line-by-Line ဖတ်ရှုသော Generator
function streamCsvRows(string $csvPath): Generator
{
    if (!file_exists($csvPath) || !is_readable($csvPath)) {
        throw new InvalidArgumentException("File not found or unreadable: {$csvPath}");
    }

    $handle = fopen($csvPath, 'r');
    if (!$handle) {
        throw new RuntimeException("Cannot open file: {$csvPath}");
    }

    try {
        // Header ပထမဆုံးအကြောင်းကို ဖတ်ယူသည်
        $headers = fgetcsv($handle);
        if ($headers === false) {
            return;
        }

        $rowNumber = 1;
        while (($data = fgetcsv($handle)) !== false) {
            $rowNumber++;
            // Header နှင့် Data တွဲစပ်ပြီး Associative Array ပြုလုပ်သည်
            if (count($headers) === count($data)) {
                yield $rowNumber => array_combine($headers, $data);
            }
        }
    } finally {
        fclose($handle); // Memory leak မဖြစ်အောင် အမြဲတမ်း ပိတ်သိမ်းသည်
    }
}

// လက်တွေ့ အသုံးပြုပုံ (Real-World Usage)
$csvFile = __DIR__ . '/large_orders_export.csv';

// သန်းနှင့်ချီသော Data ဖြစ်သော်လည်း RAM 8MB ခန့်သာ အသုံးပြုပါသည်
foreach (streamCsvRows($csvFile) as $lineNum => $order) {
    if ($order['status'] === 'FAILED') {
        // Process notification or repair
        // echo "Processing Row #{$lineNum}: Order {$order['order_id']}\n";
    }
}
```

---

## ၅။ PHP Stream Wrappers (`php://memory`, `php://temp`, `php://filter`)

PHP တွင် built-in ပါဝင်သော **Stream Protocols** များကို အသုံးချပြီး Disk ပေါ်တွင် ယာယီဖိုင် မရေးဘဲ RAM ပေါ်တွင် Memory Buffer ပြုလုပ်နိုင်ပါသည်။

```php
<?php
// Client သို့ ကြီးမားသော CSV တိုက်ရိုက် Download ချပေးခြင်း (Zero Disk Storage)
function downloadLiveUsersCsv(array $users): void
{
    // php://output သည် Browser သို့ HTTP Response Body တိုက်ရိုက် ရေးသားပေးပါသည်
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="users_' . date('Ymd_His') . '.csv"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $output = fopen('php://output', 'w');

    // UTF-8 BOM ထည့်သွင်းခြင်း (Excel တွင် မြန်မာစာ/ဂျပန်စာ မပျက်အောင်)
    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

    // CSV Headers
    fputcsv($output, ['User ID', 'Full Name', 'Email', 'Role', 'Registered At']);

    foreach ($users as $user) {
        fputcsv($output, [
            $user['id'],
            $user['name'],
            $user['email'],
            $user['role'],
            $user['created_at'],
        ]);
    }

    fclose($output);
    exit;
}
```

---

## ၆။ Atomic File Writes (Partial Read ပြဿနာ ကာကွယ်ခြင်း)

ဖိုင်တစ်ခုကို ရေးသားနေဆဲ (In-Progress) အချိန်တွင် အခြား Client တစ်ဦးက ထိုဖိုင်ကို ဝင်ဖတ်ပါက ဖိုင်တစ်ဝက်တစ်ပျက်သာ ဖတ်မိပြီး JSON Syntax Error သို့မဟုတ် Data Corrupt ဖြစ်တတ်ပါသည်။ ၎င်းကို **Atomic Rename Pattern** ဖြင့် ကာကွယ်ရပါမည်:

```php
<?php
function writeAtomicFile(string $targetPath, string $content): bool
{
    $dir = dirname($targetPath);
    // Target directory အတွင်းမှာပင် ယာယီဖိုင် တစ်ခု တည်ဆောက်သည်
    $tempPath = tempnam($dir, 'atomic_');
    if ($tempPath === false) {
        return false;
    }

    // ယာယီဖိုင်ထဲသို့ Data အကုန် အပြီးရေးသည်
    if (file_put_contents($tempPath, $content, LOCK_EX) === false) {
        @unlink($tempPath);
        return false;
    }

    // rename() သည် POSIX စနစ်များတွင် Atomic ဖြစ်သောကြောင့် 
    // ဖိုင်တစ်ဝက်တစ်ပျက် ဖတ်မိခြင်း မရှိနိုင်ပါ
    if (!rename($tempPath, $targetPath)) {
        @unlink($tempPath);
        return false;
    }

    chmod($targetPath, 0664);
    return true;
}
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Best Practices (Genba Rules)

1. **Path Traversal Attack ကာကွယ်ပါ**: အသုံးပြုသူပေးပို့သော ဖိုင်အမည်များကို တိုက်ရိုက်မသုံးပါနှင့်။ `basename()` နှင့် `realpath()` ကို မဖြစ်မနေ အသုံးပြုပြီး ခွင့်ပြုထားသော Directory အတွင်း ရှိမရှိ စစ်ဆေးပါ။
2. **File Permissions (`chmod`)**: Log ဖိုင်များနှင့် Uploaded ဖိုင်များကို `0777` လုံးဝ မပေးပါနှင့်။ Directories အတွက် `0755`၊ Files အတွက် `0644` သို့မဟုတ် `0664` သာ ပေးပါ။
3. **Always Close Handles**: `fopen()` ဖွင့်ထားပြီး `fclose()` မလုပ်ပါက File Descriptor အရေအတွက် ကုန်ဆုံးသွားပြီး Server မှ `Too many open files` Error တက်ကာ Crash ဖြစ်နိုင်ပါသည်။
