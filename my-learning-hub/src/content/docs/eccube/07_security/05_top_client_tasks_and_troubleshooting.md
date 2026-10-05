---
title: "05. Top Client Tasks And Troubleshooting"
description: "ဂျပန်နိုင်ငံရှိ E-Commerce လုပ်ငန်းများတွင် ပြင်ပ လုံခြုံရေး စစ်ဆေးရေး အဖွဲ့အစည်းများ (IPA / Third-party Security Audit Companies) ထံမှ ကျဆင်းလာသော လုံခြုံရေး အ"
---

## 05. Top Client Tasks & Troubleshooting (Security Audits တုန့်ပြန်ခြင်း)

ဂျပန်နိုင်ငံရှိ E-Commerce လုပ်ငန်းများတွင် ပြင်ပ လုံခြုံရေး စစ်ဆေးရေး အဖွဲ့အစည်းများ (IPA / Third-party Security Audit Companies) ထံမှ ကျဆင်းလာသော **လုံခြုံရေး အားနည်းချက် သတိပေးချက် (Vulnerability Report)** များကို ဖြေရှင်းပေးရသည့် အဓိက တာဝန် ၅ ခုနှင့် လက်တွေ့ ကုဒ်ပြင်ဆင်နည်းများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: IDOR (Insecure Direct Object Reference) အားနည်းချက် ပြင်ဆင်ခြင်း

### 💬 Security Audit Report (စစ်ဆေးတွေ့ရှိချက်):
> 【重要度：高】マイページの注文履歴・お届け先変更画面において、URLパラメータのIDを書き換えることで、第三者の個人情報（氏名、住所、注文履歴）が閲覧・改ざん可能な脆弱性（IDOR）が確認されました。
> (Mypage အော်ဒါမှတ်တမ်းနှင့် ပို့ဆောင်ရေးလိပ်စာ ပြင်ဆင်သည့် မျက်နှာပြင်တွင် URL ID ကို ပြောင်းလဲရိုက်ထည့်ရုံဖြင့် အခြားသူ၏ ကိုယ်ရေးအချက်အလက်များကို ကြည့်ရှု/ပြင်ဆင်နိုင်သော အန္တရာယ်ကြီးမားသည့် IDOR အားနည်းချက်ကို တွေ့ရှိရပါသည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
Controller တိုင်းတွင် လက်ရှိ Login ဝင်ထားသော ဖောက်သည် (`$this->getUser()`) နှင့် သက်ဆိုင်မှု ရှိ/မရှိ မဖြစ်မနေ စစ်ဆေးခြင်း:

```php
namespace Customize\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class CustomerAddressController
{
    /**
     * @Route("/mypage/delivery/{id}/edit", name="mypage_delivery_edit")
     * @IsGranted("ROLE_USER")
     */
    public function edit($id): Response
    {
        $currentCustomer = $this->getUser();

        // အရေးကြီး: ID အပြင် Customer ပါ ကိုက်ညီမှသာ ရှာဖွေရမည်
        $customerAddress = $this->customerAddressRepository->findOneBy([
            'id'       => $id,
            'Customer' => $currentCustomer,
        ]);

        if (!$customerAddress) {
            // မသက်ဆိုင်သော ID ဖြစ်ပါက 403 Forbidden ဖြင့် ချက်ချင်း ပိတ်ပင်ခြင်း
            throw new AccessDeniedHttpException('不正なアクセスです。(Unauthorized Access)');
        }

        // ... ဆက်လက် လုပ်ဆောင်ရန် Form logic ...
    }
}
```

---

## 📌 Client Task 2: Custom Ajax Endpoint များတွင် CSRF Token ကာကွယ်မှု ထည့်သွင်းခြင်း

### 💬 Security Audit Report (စစ်ဆေးတွေ့ရှိချက်):
> 【重要度：中】カートへの商品追加・削除を行う非同期通信（Ajax API）において、CSRFトークンの検証が行われておらず、悪意ある外部サイトから不正にカート操作を強制される恐れがあります。
> (Cart ထဲ ပစ္စည်းထည့်/ထုတ် ပြုလုပ်သော Ajax API တွင် CSRF Token စစ်ဆေးထားခြင်း မရှိသဖြင့် ပြင်ပဆိုက်များမှ မသမာသော တိုက်ခိုက်မှု ပြုလုပ်နိုင်သည့် အန္တရာယ် ရှိနေပါသည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

#### ၁။ Twig မျက်နှာပြင်တွင် Meta Tag အဖြစ် CSRF Token ထည့်သွင်းခြင်း:
```html
<meta name="csrf-token" content="{{ csrf_token('cart_ajax') }}">
```

#### ၂။ Frontend JavaScript မှ Request Header တွင် ထည့်ပို့ခြင်း:
```javascript
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

fetch('/cart/ajax/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({ product_id: 42, quantity: 1 })
});
```

#### ၃။ Controller တွင် Token စစ်ဆေးပြီး ပယ်ချခြင်း:
```php
if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('cart_ajax', $request->headers->get('X-CSRF-TOKEN')))) {
    return new JsonResponse(['error' => 'CSRF validation failed'], 403);
}
```

---

## 📌 Client Task 3: စကားဝှက် ဆက်တိုက် ရိုက်ထည့် တိုက်ခိုက်မှု (Brute-Force) ကာကွယ်ရန် Rate Limiter တပ်ဆင်ခြင်း

### 💬 Security Audit Report (စစ်ဆေးတွေ့ရှိချက်):
> 【重要度：高】管理画面のログイン機能において試行回数の制限（レートリミット）がなく、自動プログラムによる総当たり攻撃（ブルートフォース）に対して無防備です。5回連続で失敗した場合のアカウントロックを実装してください。
> (Admin Login မျက်နှာပြင်တွင် ကြိုးစားနိုင်သည့် အကြိမ်အရေအတွက် ကန့်သတ်ချက် မရှိသဖြင့် Bot များက Brute-force တိုက်ခိုက်နိုင်ပါသည်။ ၅ ကြိမ် ဆက်တိုက် မှားယွင်းပါက အကောင့်ကို ၁၅ မိနစ် ခေတ္တပိတ်ဆို့သော စနစ် ထည့်သွင်းပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
Symfony Rate Limiter သို့မဟုတ် Login Failure Listener ဖြင့် ကာကွယ်ခြင်း:

```php
namespace Customize\Security;

use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class LoginFailureRateLimiter
{
    private CacheInterface $cache;

    public function __construct(CacheInterface $cache)
    {
        $this->cache = $cache;
    }

    public function checkRateLimit(string $clientIp): void
    {
        $cacheKey = 'login_attempts_' . md5($clientIp);
        $attempts = $this->cache->get($cacheKey, fn() => 0);

        if ($attempts >= 5) {
            throw new TooManyRequestsHttpException(900, 'Too many failed login attempts. Please try again in 15 minutes.');
        }
    }

    public function recordFailedAttempt(string $clientIp): void
    {
        $cacheKey = 'login_attempts_' . md5($clientIp);
        $this->cache->delete($cacheKey);
        
        $this->cache->get($cacheKey, function (ItemInterface $item) {
            $item->expiresAfter(900); // 15 minutes
            return 1;
        });
    }
}
```

---

## 📌 Client Task 4: ဓာတ်ပုံ တင်သွင်းမှုတွင် Web Shell ကာကွယ်ရန် Magic Bytes စစ်ဆေးခြင်း

### 💬 Security Audit Report (စစ်ဆေးတွေ့ရှိချက်):
> 【重要度：致命的】お問い合わせ画面の添付ファイル機能において、拡張子のみで判定されているため、PHPスクリプトを偽装したファイルのアップロード（RCEの危険）が可能です。
> (စုံစမ်းမေးမြန်းမှု မျက်နှာပြင်ရှိ File Upload တွင် Extension မျှသာ စစ်ဆေးထားသဖြင့် PHP Web Shell တင်သွင်းကာ ဆာဗာတစ်ခုလုံး ဖောက်ထွင်းခံရနိုင်သော အန္တရာယ်ကြီး ရှိနေပါသည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
Extension သာမက **Magic Bytes (စစ်မှန်သော ဖိုင်အမျိုးအစား)** ကို `finfo` ဖြင့် စစ်ဆေးပြီး အမည်ကို Random UUID ဖြင့် အစားထိုးခြင်း:

```php
public function processSecureUpload(UploadedFile $file, string $targetDir): string
{
    // ၁။ Magic Bytes စစ်ဆေးခြင်း
    $finfo = new \finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file->getPathname());

    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'application/pdf' => 'pdf'
    ];

    if (!isset($allowedMimes[$mime])) {
        throw new \InvalidArgumentException('許可されていないファイル形式です。(Disallowed File Format)');
    }

    // ၂။ နာမည်အသစ်ကို Cryptographic Random String ဖြင့် ထုတ်ပေးခြင်း
    $safeFilename = bin2hex(random_bytes(16)) . '.' . $allowedMimes[$mime];
    $file->move($targetDir, $safeFilename);

    return $safeFilename;
}
```

---

## 📌 Client Task 5: ကုန်ပစ္စည်း Review တွင် XSS တိုက်ခိုက်မှု မဖြစ်စေရန် HTMLPurifier တပ်ဆင်ခြင်း

### 💬 Security Audit Report (စစ်ဆေးတွေ့ရှိချက်):
> 【重要度：高】商品レビュー機能で入力されたテキストが、一部画面でエスケープされずに描画されており、蓄積型XSS（Stored XSS）が実行可能な状態です。
> (ကုန်ပစ္စည်း Review ရေးသားချက်များတွင် အချို့နေရာ၌ `|raw` ဖြင့် Escape မလုပ်ဘဲ ပြသနေသဖြင့် Stored XSS တိုက်ခိုက်မှု ဖြစ်ပွားနိုင်ခြေ ရှိနေပါသည်။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
Twig တွင် `|raw` ကို တိုက်ရိုက် မသုံးတော့ဘဲ၊ HTMLPurifier ဖြင့် Script များကို ရှင်းလင်းပြီးမှ ပြသသော Twig Custom Filter (`|purify`) ရေးသားခြင်း:

```php
namespace Customize\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class SecurityTwigExtension extends AbstractExtension
{
    private \HTMLPurifier $purifier;

    public function __construct()
    {
        $config = \HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'b,strong,i,em,p,br'); // ခွင့်ပြုထားသော Tag များသာ ကျန်ရှိမည်
        $this->purifier = new \HTMLPurifier($config);
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('purify', [$this, 'purifyHtml'], ['is_safe' => ['html']]),
        ];
    }

    public function purifyHtml(string $untrustedHtml): string
    {
        return $this->purifier->purify($untrustedHtml);
    }
}
```

Twig တွင် အသုံးပြုပုံ:
```twig
{# script များကို အလိုအလျောက် ရှင်းထုတ်ပေးပြီး ဘေးကင်းသော tag များကိုသာ ပြသပေးသည် #}
{{ Review.comment|purify }}
```

အထက်ပါ လုံခြုံရေး နည်းစနစ် ၅ မျိုးကို စနစ်တကျ ပြင်ဆင်ပြီးပါက မည်သည့် တင်းကြပ်သော Security Audit ကိုမဆို အောင်မြင်စွာ ကျော်ဖြတ်နိုင်မည် ဖြစ်ပါသည်။
