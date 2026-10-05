---
title: "12. Security Access Control"
description: "> အဆင့်: Advanced | EC-Cube Version: 4.2+"
---

## 12 - Security & Access Control Customize လုပ်နည်း

> **အဆင့်**: Advanced | **EC-Cube Version**: 4.2+

EC-Cube ၏ Security system ကို Customize ပြုလုပ်ကာ Role-based Access Control, IP restriction, Maintenance mode တည်ဆောက်နည်း။

---

## 🎯 ရည်ရွယ်ချက်

- ကိုယ်ပိုင် Role နှင့် Permission ထည့်တတ်ရန်
- IP address ဖြင့် access ကန့်သတ်တတ်ရန်
- Maintenance mode ကို dynamic ဖွင့်/ပိတ်တတ်ရန်
- Voter (ကိုယ်ပိုင် authorization logic) တည်ဆောက်တတ်ရန်

---

## 📌 EC-Cube ၏ Security Roles

| Role | ဖော်ပြချက် |
|------|-----------|
| `ROLE_USER` | Login ပြုလုပ်ပြီးသော Customer |
| `ROLE_ADMIN` | Admin user (FullAccess) |
| `IS_AUTHENTICATED_ANONYMOUSLY` | ဘယ်သူမဆို (Login မပြုဘဲ) |
| `IS_AUTHENTICATED_FULLY` | Session မသုံးဘဲ Login ပြုလုပ်ထားသော User |

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - IP Whitelist Restriction (Middleware)

Admin Panel ကို Specific IP addresses သာ access ပြုနိုင်ရန်:

`app/Plugin/MyPlugin/EventListener/IpRestrictionListener.php`

```php
<?php

namespace Plugin\MyPlugin\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class IpRestrictionListener implements EventSubscriberInterface
{
    // Allow list (ဤ IP များသာ Admin ကို access ပြုနိုင်မည်)
    private const ALLOWED_IPS = [
        '127.0.0.1',
        '::1',         // localhost (IPv6)
        '203.0.113.1', // Office IP
        '198.51.100.0/24', // CIDR range
    ];

    private const ADMIN_ROUTE_PREFIX = '/admin';

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 10]],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $pathInfo = $request->getPathInfo();

        // Admin path かどうか確認
        if (!str_starts_with($pathInfo, self::ADMIN_ROUTE_PREFIX)) {
            return; // Admin 以外はスキップ
        }

        $clientIp = $request->getClientIp();

        if (!$this->isIpAllowed($clientIp)) {
            // Access Denied Response
            $event->setResponse(new Response(
                '<h1>403 - Access Denied</h1><p>Your IP address is not allowed to access this area.</p>',
                Response::HTTP_FORBIDDEN
            ));
        }
    }

    private function isIpAllowed(?string $ip): bool
    {
        if (!$ip) {
            return false;
        }

        foreach (self::ALLOWED_IPS as $allowedIp) {
            // CIDR range စစ်ဆေးပါ
            if (str_contains($allowedIp, '/')) {
                if ($this->ipInRange($ip, $allowedIp)) {
                    return true;
                }
            } elseif ($ip === $allowedIp) {
                return true;
            }
        }

        return false;
    }

    private function ipInRange(string $ip, string $cidr): bool
    {
        [$subnet, $bits] = explode('/', $cidr);
        $ip     = ip2long($ip);
        $subnet = ip2long($subnet);
        $mask   = -1 << (32 - (int) $bits);
        $subnet &= $mask;

        return ($ip & $mask) === $subnet;
    }
}
```

---

### အဆင့် 2 - Maintenance Mode Listener

`app/Plugin/MyPlugin/EventListener/MaintenanceModeListener.php`

```php
<?php

namespace Plugin\MyPlugin\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MaintenanceModeListener implements EventSubscriberInterface
{
    // Maintenance mode flag ဖိုင်
    private const MAINTENANCE_FLAG_FILE = '/path/to/ec-cube/var/maintenance.flag';

    // Admin IP ဖြင့် maintenance mode ကတ်ကြောင်း ဆက်လက် access ပြုနိုင်ပါ
    private const ALLOWED_IPS_DURING_MAINTENANCE = ['127.0.0.1', '::1'];

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        // Maintenance flag ရှိမရှိ စစ်ဆေးပါ
        if (!file_exists(self::MAINTENANCE_FLAG_FILE)) {
            return;
        }

        $request = $event->getRequest();

        // Admin route ကို skip ပါ
        if (str_starts_with($request->getPathInfo(), '/admin')) {
            return;
        }

        // Allowed IP ကို skip ပါ
        if (in_array($request->getClientIp(), self::ALLOWED_IPS_DURING_MAINTENANCE)) {
            return;
        }

        // Maintenance HTML ပြပါ
        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <title>メンテナンス中</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 100px; background: #1a1a2e; color: #eee; }
                .container { background: rgba(255,255,255,0.05); padding: 60px; border-radius: 16px; display: inline-block; }
                h1 { font-size: 48px; color: #667eea; }
                p { font-size: 18px; color: #a0aec0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔧 メンテナンス中</h1>
                <p>ただいまシステムメンテナンスを行っております。<br>
                しばらくお待ちください。</p>
            </div>
        </body>
        </html>
        HTML;

        $event->setResponse(new Response($html, Response::HTTP_SERVICE_UNAVAILABLE));
    }
}
```

**Maintenance Mode ဖွင့်/ပိတ်ခြင်း**:

```bash
# Maintenance Mode ဖွင့်ပါ (flag file ကို create ပြုလုပ်ပါ)
touch var/maintenance.flag

# Maintenance Mode ပိတ်ပါ (flag file ကို ဖျက်ပါ)
rm var/maintenance.flag
```

---

### အဆင့် 3 - Custom Voter (Fine-grained Authorization)

`app/Plugin/MyPlugin/Security/Voter/ProductVoter.php`

```php
<?php

namespace Plugin\MyPlugin\Security\Voter;

use Eccube\Entity\Customer;
use Eccube\Entity\Product;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;

class ProductVoter extends Voter
{
    // Permission constants
    public const VIEW    = 'product_view';
    public const REVIEW  = 'product_review';
    public const PURCHASE = 'product_purchase';

    public function __construct(
        private readonly Security $security
    ) {}

    protected function supports(string $attribute, mixed $subject): bool
    {
        // ဤ voter သည် Product object နှင့် ဤ permissions များ မှ
        return in_array($attribute, [self::VIEW, self::REVIEW, self::PURCHASE])
            && $subject instanceof Product;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        /** @var Product $product */
        $product = $subject;

        $user = $token->getUser();

        return match ($attribute) {
            self::VIEW     => $this->canView($product, $user),
            self::REVIEW   => $this->canReview($product, $user),
            self::PURCHASE => $this->canPurchase($product, $user),
            default        => false,
        };
    }

    private function canView(Product $product, mixed $user): bool
    {
        // 公開商品は誰でも見られる
        if ($product->getStatus()->getId() === 1) {
            return true;
        }

        // 非公開商品はAdminのみ
        return $this->security->isGranted('ROLE_ADMIN');
    }

    private function canReview(Product $product, mixed $user): bool
    {
        // Login ပြုလုပ်ပြီးသော User သာ Review ရေးနိုင်သည်
        if (!$user instanceof Customer) {
            return false;
        }

        // Purchase ပြုလုပ်ဖူးသော User သာ Review ရေးနိုင်သည်
        foreach ($user->getOrders() as $order) {
            foreach ($order->getOrderItems() as $item) {
                if ($item->getProduct() && $item->getProduct()->getId() === $product->getId()) {
                    return true; // ဝယ်ဖူးပြီ → Review ရေးနိုင်သည်
                }
            }
        }

        return false;
    }

    private function canPurchase(Product $product, mixed $user): bool
    {
        // Age restricted product ကို adult user သာ ဝယ်နိုင်သည်
        if ($product->getPlgAgeRestricted() ?? false) {
            if (!$user instanceof Customer) {
                return false;
            }
            // Customer ၏ age verification စစ်ဆေးပါ
            return $user->getPlgAgeVerified() ?? false;
        }

        return true;
    }
}
```

**Controller ထဲတွင် Voter ကို အသုံးပြုပါ**:

```php
// Product ကို view ပြုနိုင်မနိုင် စစ်ဆေးပါ
$this->denyAccessUnlessGranted(ProductVoter::VIEW, $product);

// Purchase ပြုနိုင်မနိုင် စစ်ဆေးပါ
if (!$this->isGranted(ProductVoter::PURCHASE, $product)) {
    $this->addError('購入できません', 'front');
    return $this->redirectToRoute('product_detail', ['id' => $product->getId()]);
}

// Template ထဲတွင် Voter ကို အသုံးပြုပါ
// {% if is_granted('product_review', Product) %}
//     <button>レビューを書く</button>
// {% endif %}
```

---

### အဆင့် 4 - Rate Limiting (Request Throttling)

Login form ကို Brute-force attack မှ ကာကွယ်ပါ:

`app/Plugin/MyPlugin/EventListener/RateLimitListener.php`

```php
<?php

namespace Plugin\MyPlugin\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactory;

class RateLimitListener implements EventSubscriberInterface
{
    public function __construct(
        private readonly RateLimiterFactory $loginLimiter
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Login form POST ဖြစ်မှသာ စစ်ဆေးပါ
        if ($request->getPathInfo() !== '/login' || !$request->isMethod('POST')) {
            return;
        }

        $limiter = $this->loginLimiter->create($request->getClientIp());
        $limit   = $limiter->consume(1);

        if (!$limit->isAccepted()) {
            $retryAfter = $limit->getRetryAfter()->getTimestamp() - time();

            $event->setResponse(new Response(
                "ログイン試行回数が上限を超えました。{$retryAfter}秒後にお試しください。",
                Response::HTTP_TOO_MANY_REQUESTS
            ));
        }
    }
}
```

**`config/packages/rate_limiter.yaml`**:

```yaml
framework:
    rate_limiter:
        login:
            policy: sliding_window
            limit: 5          # 5 tries
            interval: '15 minutes'
```

---

### အဆင့် 5 - Two-Factor Authentication (簡易版)

Admin ၏ 2FA ဥပမာ (Email OTP):

```php
<?php

namespace Plugin\MyPlugin\Service;

class TwoFactorService
{
    private const OTP_LENGTH = 6;
    private const OTP_EXPIRY_SECONDS = 300; // 5 minutes

    public function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), self::OTP_LENGTH, '0', STR_PAD_LEFT);
    }

    public function storeOtp(string $email, string $otp, \SessionInterface $session): void
    {
        $session->set('2fa_otp', [
            'otp'     => password_hash($otp, PASSWORD_DEFAULT),
            'email'   => $email,
            'expires' => time() + self::OTP_EXPIRY_SECONDS,
        ]);
    }

    public function verifyOtp(string $inputOtp, \SessionInterface $session): bool
    {
        $stored = $session->get('2fa_otp');

        if (!$stored) {
            return false;
        }

        // Expired စစ်ဆေးပါ
        if ($stored['expires'] < time()) {
            $session->remove('2fa_otp');
            return false;
        }

        // OTP စစ်ဆေးပါ
        if (!password_verify($inputOtp, $stored['otp'])) {
            return false;
        }

        $session->remove('2fa_otp');
        return true;
    }
}
```

---

## 🔑 Security Best Practices

| စစ်ဆေးရမည့် အချက် | ဖြေရှင်းနည်း |
|--------------------|-------------|
| CSRF Protection | EC-Cube ₅ Form မှ auto-handle |
| XSS Prevention | Twig ₅ auto-escape on |
| SQL Injection | Doctrine ORM ဖြင့် auto-prevent |
| Password Hashing | `password_hash()` / Symfony Security |
| HTTPS | Server config / `.htaccess` |

---

## ✅ စစ်ဆေးမှုများ

- [ ] IP Restriction listener ကို `services.yaml` တွင် register ပြုလုပ်ပြီးကြောင်း
- [ ] Voter ကို `services.yaml` တွင် register ပြုလုပ်ပြီးကြောင်း (autowiring ဖြင့် auto-register ဖြစ်သောအခါ မလိုအပ်)
- [ ] Maintenance mode ကို test ပြုလုပ်ပြီးကြောင်း
- [ ] Rate limiting ကို test ပြုလုပ်ပြီးကြောင်း
- [ ] Security logs ကို စစ်ဆေးပြီးကြောင်း (`var/log/`)

---

> 🎉 **သင်ခန်းစာ ၁၂ ခု ပြီးဆုံးပါပြီ!** [README.md](/eccube/customization-list/README/) ကို ပြန်ကြည့်ပါ။
