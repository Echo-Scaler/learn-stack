---
title: "02. Resilience Timeout Retry Logging"
description: "External API များနှင့် ချိတ်ဆက်ရာတွင် ပြင်ပဆာဗာ နှေးကွေးခြင်း၊ ပျက်ကျခြင်း သို့မဟုတ် အင်တာနက် လိုင်းကျခြင်းများ ဖြစ်ပေါ်ပါက EC-CUBE စတိုးတစ်ခုလုံး Freeze မဖြစ်သ"
---

## 02. Resilience: Timeout, Retry & Logging (မြန်မာဘာသာ)

External API များနှင့် ချိတ်ဆက်ရာတွင် ပြင်ပဆာဗာ နှေးကွေးခြင်း၊ ပျက်ကျခြင်း သို့မဟုတ် အင်တာနက် လိုင်းကျခြင်းများ ဖြစ်ပေါ်ပါက EC-CUBE စတိုးတစ်ခုလုံး Freeze မဖြစ်သွားစေရန် **Resilience (ခံနိုင်ရည်စွမ်းရည်)** တည်ဆောက်နည်းများ ဖြစ်ပါသည်။

---

## ⏱️ Timeout Management (ဆာဗာ Freeze မဖြစ်စေရန် ထိန်းချုပ်ခြင်း)

အကယ်၍ ပြင်ပ Payment Gateway သို့မဟုတ် Shipping API တစ်ခုသည် ဆာဗာဒေါင်းနေပြီး တုန့်ပြန်မှု မပေးပါက၊ Timeout မသတ်မှတ်ထားသော EC-CUBE ဆာဗာသည် အဆုံးမရှိ စောင့်ဆိုင်းနေပါလိမ့်မည်။

### ဖြစ်ပေါ်လာမည့် အန္တရာယ်:
1. PHP-FPM Workers များအားလုံး ထို API ကို စောင့်ဆိုင်းရင်း Busy ဖြစ်သွားမည်။
2. အခြား သာမန် ဈေးဝယ်သူများ ဆိုက်ပေါ်သို့ ဝင်ရောက်၍ မရတော့ဘဲ **504 Gateway Timeout** သို့မဟုတ် **502 Bad Gateway** တက်ပြီး ဆိုက်တစ်ခုလုံး ပျက်ကျသွားမည်။

### Timeout အမျိုးအစား ၂ မျိုး:
- **Connection Timeout (`connection_timeout`)**: ပြင်ပဆာဗာနှင့် စတင် ချိတ်ဆက်မိရန် စောင့်မည့် အချိန် (ဥပမာ - ၂ စက္ကန့်)။
- **Execution / Response Timeout (`timeout`)**: ချိတ်ဆက်မိပြီးနောက် ဒေတာ အားလုံး ပြီးဆုံးအောင် ပြန်ပို့ပေးရန် စောင့်မည့် အချိန် (ဥပမာ - ၅ စက္ကန့်)။

### Symfony HttpClient တွင် သတ်မှတ်ပုံ:
```php
$response = $this->httpClient->request('POST', 'https://api.external-service.jp/orders', [
    'json'               => $payload,
    'connection_timeout' => 2.0, // ချိတ်ဆက်ရန် ၂ စက္ကန့်သာ စောင့်မည်
    'timeout'            => 5.0, // စုစုပေါင်း ၅ စက္ကန့်အတွင်း မပြီးပါက ဖြတ်ချမည်
]);
```

---

## 🔁 Retry Strategy & Exponential Backoff (စနစ်တကျ ထပ်မံကြိုးစားခြင်း)

အင်တာနက် အနည်းငယ် လိုင်းပျက်သွားခြင်း (Network Hiccup) သို့မဟုတ် API Provider ဘက်မှ ရုတ်တရက် Request များပြားသွားချိန်တွင် တိုက်ရိုက် Fail မဖြစ်စေဘဲ အလိုအလျောက် ထပ်မံကြိုးစားခြင်း (Retry) ပြုလုပ်ရပါသည်:

### ဘယ်အချိန်မှာ Retry လုပ်သင့်သလဲ?
- ✅ **Retry လုပ်သင့်သည်**:
  - `429 Too Many Requests` (Rate limit ခေတ္တထိသွားခြင်း)
  - `503 Service Unavailable` / `504 Gateway Timeout` (ယာယီ ပြင်ပဆာဗာ နှေးကွေးခြင်း)
  - `TransportExceptionInterface` (DNS သို့မဟုတ် Network connection ပြတ်ကျသွားခြင်း)
- ❌ **Retry လုံးဝ မလုပ်သင့်ပါ**:
  - `400 Bad Request` (ပို့လိုက်သော Data JSON format မှားယွင်းနေခြင်း - ထပ်ပို့လည်း မှားနေမည်သာ)
  - `401 Unauthorized` / `403 Forbidden` (API Key မှားနေခြင်း)
  - `404 Not Found` (URL Endpoint မရှိခြင်း)

---

### Exponential Backoff ဆိုတာ အဘယ်နည်း?
ဆက်တိုက် တန်းပြီး ချက်ချင်း Retry လုပ်ပါက ပြင်ပဆာဗာကို DDoS တိုက်ခိုက်သကဲ့သို့ ဖြစ်သွားပြီး အမြဲ Block ခံရနိုင်ပါသည်။ ထို့ကြောင့် Retry တစ်ကြိမ်နှင့်တစ်ကြိမ် ကြားတွင် စောင့်ဆိုင်းချိန်ကို ဆတိုး (Exponential) တိုးမြှင့်သွားသော စနစ်ဖြစ်သည်။

- ကြိုးစားမှု အကြိမ် ၁: ပျက်ကျပြီးနောက် **၁ စက္ကန့်** စောင့်မည်။
- ကြိုးစားမှု အကြိမ် ၂: ပျက်ကျပြီးနောက် **၂ စက္ကန့်** စောင့်မည်။
- ကြိုးစားမှု အကြိမ် ၃: ပျက်ကျပြီးနောက် **၄ စက္ကန့်** စောင့်မည်။

### PHP Code ဖြင့် အကောင်အထည်ဖော်ပုံ:
```php
public function executeWithRetry(callable $apiCall, int $maxRetries = 3): array
{
    $attempt = 0;
    $delay = 1; // 1 second

    while ($attempt < $maxRetries) {
        $attempt++;
        try {
            return $apiCall();
        } catch (\Exception $e) {
            $isRetryable = ($e instanceof \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface)
                || (str_contains($e->getMessage(), '429'))
                || (str_contains($e->getMessage(), '503'));

            if (!$isRetryable || $attempt >= $maxRetries) {
                // အကယ်၍ ထပ်မံကြိုးစား၍မရသော error ဖြစ်ပါက သို့မဟုတ် max retry ပြည့်သွားပါက error ပစ်မည်
                $this->logger->error("External API Final Failure after {$attempt} attempts: " . $e->getMessage());
                throw $e;
            }

            $this->logger->warning("API Failed (Attempt {$attempt}). Retrying in {$delay}s...");
            sleep($delay);
            $delay *= 2; // Exponential Backoff: 1s -> 2s -> 4s
        }
    }

    throw new \RuntimeException("Max retries exceeded.");
}
```

---

## 🛡️ Error Handling & Graceful Degradation (အမှားထိန်းချုပ်မှုနှင့် အရန်စနစ်)

ပြင်ပ API ပျက်ကျသွားသော်လည်း အသုံးပြုသူ၏ ဝယ်ယူမှု (Checkout Flow) တစ်ခုလုံး ပျက်စီးမသွားစေရန် **Graceful Degradation (အရန်နည်းလမ်းဖြင့် အစားထိုးလည်ပတ်ခြင်း)** ကို အသုံးပြုရပါသည်:

### လက်တွေ့ ဥပမာ - Dynamic Shipping Fee Calculation API ပျက်ကျခြင်း:
- အကယ်၍ ချောပို့တိုက်၏ အချိန်နှင့်တပြေးညီ ပို့ခတွက်ချက်ပေးသော API ပျက်ကျသွားပါက:
  - ❌ **မှားယွင်းသော ကိုင်တွယ်ပုံ**: မျက်နှာပြင်တွင် Error 500 ပြသပြီး အသုံးပြုသူကို ဈေးဝယ်မရအောင် ပိတ်ချလိုက်ခြင်း။
  - ✅ **မှန်ကန်သော ကိုင်တွယ်ပုံ**: ပုံမှန် ပို့ဆောင်ခ Flat Rate (ဥပမာ - ၇၀၀ ယန်း) ဖြင့် ယာယီအစားထိုးကာ အော်ဒါကို ဆက်လက် အောင်မြင်အောင် လုပ်ဆောင်ပေးပြီး၊ Admin ထံသို့ System Alert ပို့ထားခြင်း။

```php
try {
    $shippingFee = $this->externalShippingService->calculateLiveRate($order);
} catch (\Exception $e) {
    $this->logger->error("Shipping API down. Falling back to default flat rate. Reason: " . $e->getMessage());
    $shippingFee = 700; // Flat rate fallback
}
```

---

## 📝 Monolog Logging & Data Masking (လုံခြုံသော Log မှတ်တမ်းထားရှိခြင်း)

API Request နှင့် Response များကို ပြဿနာရှာဖွေနိုင်ရန် (Debugging) အမြဲ Log မှတ်ရပါမည်။ သို့သော် **PCI-DSS (ငွေပေးချေမှု လုံခြုံရေးစံနှုန်း)** နှင့် **ဂျပန်နိုင်ငံ ကိုယ်ရေးအချက်အလက် ကာကွယ်ရေးဥပဒေ (APPI)** အရ အရေးကြီး အချက်အလက်များကို Log ထဲသို့ အလွတ် (Plaintext) မထည့်ရပါ။

### ❌ မမှတ်သားရမည့် အချက်အလက်များ:
- Credit Card Number (PAN)
- CVV / CVC (လုံခြုံရေးဂဏန်း ၃ လုံး)
- User Passwords
- Raw API Bearer Tokens / Secrets

### Data Masking Processor ဖန်တီးခြင်း:
```php
namespace Customize\Service;

use Psr\Log\LoggerInterface;

class ApiLogger
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function logRequest(string $endpoint, array $payload): void
    {
        $maskedPayload = $this->maskSensitiveData($payload);
        $this->logger->info("API Request to: {$endpoint}", ['payload' => $maskedPayload]);
    }

    private function maskSensitiveData(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->maskSensitiveData($value);
            } elseif (in_array(strtolower($key), ['card_number', 'pan', 'cvv', 'password', 'token', 'secret'])) {
                // အစဆုံးနှင့် အဆုံးကိုသာပြပြီး အလယ်ကို ဖုံးအုပ်ခြင်း
                $len = strlen((string) $value);
                $data[$key] = $len > 4 ? substr((string) $value, 0, 2) . str_repeat('*', $len - 4) . substr((string) $value, -2) : '****';
            }
        }
        return $data;
    }
}
```

### Dedicated Log Channel သတ်မှတ်ခြင်း (`config/packages/monolog.yaml`):
EC-CUBE ၏ အထွေထွေ site.log ထဲတွင် မရောထွေးစေရန် သီးသန့် API Log ဖိုင် ထားရှိခြင်း:
```yaml
monolog:
    channels: ['api_integration']
    handlers:
        api_integration:
            type: rotating_file
            path: '%kernel.logs_dir%/%kernel.environment%/api_integration.log'
            level: info
            channels: ['api_integration']
            max_files: 30
```
ဤသို့ ပြုလုပ်ခြင်းဖြင့် ပြင်ပစနစ် ချိတ်ဆက်မှု ချို့ယွင်းချက်များကို `var/log/prod/api_integration.log` တွင် အချိန်နှင့်တပြေးညီ လွယ်ကူလျင်မြန်စွာ စစ်ဆေးနိုင်မည် ဖြစ်ပါသည်။
