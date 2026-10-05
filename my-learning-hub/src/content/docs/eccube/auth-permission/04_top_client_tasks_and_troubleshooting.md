---
title: "04. Top Client Tasks And Troubleshooting"
description: "> Real-World Client Requirement Guide:"
---

## 04 - Top Client Tasks & Troubleshooting (လုံခြုံရေးဆိုင်ရာ အသုံးအများဆုံး Client Tasks များနှင့် ဖြေရှင်းနည်းများ)

> **Real-World Client Requirement Guide**:  
> လုပ်ငန်းခွင်တွင် ဂျပန် Client များ အများဆုံး တောင်းဆိုလေ့ရှိသော အထောက်အထားစိစစ်မှုနှင့် လုံခြုံရေးဆိုင်ရာ Task ကြီး ၅ ခုနှင့် ၎င်းတို့ကို အဆင့်ဆင့် ဖြေရှင်းပုံ (Fixing Guide) ကို လက်တွေ့ Code များနှင့်တကွ ဖော်ပြထားပါသည်။

---

## 📌 Task 1: ဂိုဒေါင်ဝန်ထမ်းများအား ရောင်းအားစာရင်းနှင့် Customer အချက်အလက် မမြင်စေရန် ပိတ်ပင်ခြင်း

> **Client Requirement**:  
> *"ပါဆယ်ထုတ်ပိုးရန်အတွက် အချိန်ပိုင်းဝန်ထမ်း (アルバイト) နှင့် ဂိုဒေါင်ဝန်ထမ်းများအား Admin အကောင့် ဖွင့်ပေးထားသော်လည်း၊ ၎င်းတို့သည် ဆိုင်၏ **လစဉ်ရောင်းအားစာရင်း (売上集計)** နှင့် **Customer များ၏ အီးမေးလ်/ဖုန်းနံပါတ်** များကို လုံးဝ မမြင်တွေ့စေရပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Authority-based Controller Guard):
`SalesController` နှင့် `CustomerController` တို့တွင် ဝန်ထမ်း၏ Authority ID ကို စစ်ဆေး၍ ပိတ်ပင်ခြင်း:

```php
// SalesController.php
public function index()
{
    /** @var Member $Member */
    $Member = $this->getUser();

    // Authority ID 3 (業務担当者 - ဂိုဒေါင်ဝန်ထမ်း) ဖြစ်ပါက ပိတ်ပင်ခြင်း
    if ($Member->getAuthority()->getId() === 3) {
        throw new AccessDeniedHttpException('このメニューの閲覧権限がありません (ဤစာမျက်နှာကို ကြည့်ရှုခွင့် မရှိပါ)');
    }

    return $this->render('@admin/Order/sales.twig');
}
```

---

## 📌 Task 2: Admin Dashboard ကို ရုံးတွင်း IP Address မှသာ ဝင်ရောက်ခွင့် ပြုခြင်း (IP アドレス制限)

> **Client Requirement / High Security**:  
> *"Admin စာမျက်နှာကို အင်တာနက်ပေါ်ရှိ မည်သည့်နေရာမှမဆို ဝင်ခွင့်မပြုဘဲ၊ ကုမ္ပဏီရုံးချုပ် IP Address သို့မဟုတ် ရုံး VPN ချိတ်ထားသော IP မှသာ ဝင်ရောက်ခွင့် ပြုပါ။ ကျန် IP များမှ ဝင်လာပါက 403 Forbidden ဖြင့် ပိတ်ချထားပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Admin IP Restriction Listener):
`app/Plugin/AdminSecurity/EventListener/IpRestrictionListener.php`
```php
namespace Plugin\AdminSecurity\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class IpRestrictionListener
{
    // ခွင့်ပြုထားသော ရုံးတွင်း IP စာရင်း (Whitelist)
    private array $allowedIps = [
        '203.0.113.10', // Tokyo Office IP
        '198.51.100.5', // VPN Gateway IP
        '127.0.0.1',     // Localhost (Development)
    ];

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // Admin စာမျက်နှာ လမ်းကြောင်း ဖြစ်ပါက
        if (str_starts_with($path, '/admin')) {
            $clientIp = $request->getClientIp();

            // ခွင့်ပြုထားသော IP စာရင်းထဲ မပါဝင်ပါက ဝင်ခွင့် ပိတ်ပင်ခြင်း
            if (!in_array($clientIp, $this->allowedIps)) {
                throw new AccessDeniedHttpException('管理者画面へのアクセスが制限されています (IP Restricted: '.$clientIp.')');
            }
        }
    }
}
```

---

## 📌 Task 3: ၅ ကြိမ် ဆက်တိုက် Password မှားယွင်းပါက အကောင့်ကို မိနစ် ၃၀ ခေတ္တ ပိတ်ပင်ခြင်း (Account Lockout)

> **Client Requirement**:  
> *"ဟက်ကာများ စက်ဖြင့် Password များ အကြိမ်ကြိမ် ခန့်မှန်းရိုက်ထည့်သော Brute-force Attack ကို ကာကွယ်ရန်အတွက် Password ၅ ကြိမ် မှားယွင်းပါက အကောင့်ကို မိနစ် ၃၀ ကြာ Lockout ချထားပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Symfony Login Throttling & Security):
`config/packages/security.yaml` တွင် `login_throttling` ကို အသက်သွင်းခြင်း:

```yaml
security:
    firewalls:
        admin:
            login_throttling:
                max_attempts: 5          # အများဆုံး ၅ ကြိမ် ခွင့်ပြုမည်
                interval: '30 minutes'   # မိနစ် ၃၀ အတွင်း ၅ ကြိမ်ကျော်ပါက Lock ချမည်
```

---

## 📌 Task 4: ရက်ပေါင်း ၉၀ ပြည့်တိုင်း Password မဖြစ်မနေ အသစ်လဲခိုင်းခြင်း (Password Expiration Policy)

> **Client Requirement**:  
> *"ကုမ္ပဏီ၏ လုံခြုံရေး စည်းမျဉ်းအရ ဆိုင်ဝန်ထမ်းများသည် Password တစ်ခုတည်းကို ရက်ပေါင်း ၉၀ ထက်ပို၍ သုံးစွဲခွင့် မရှိပါ။ ၉၀ ရက်ကျော်လွန်သွားပါက Login ဝင်သည်နှင့် Password အသစ် ပြောင်းခိုင်းသော စာမျက်နှာသို့ မဖြစ်မနေ လမ်းညွှန်ပေးပါ။"*

### 🛠️ ဖြေရှင်းနည်း (Password Age Checker):
```php
// MemberChecker.php
public function checkPostAuth(UserInterface $user): void
{
    if (!$user instanceof Member) {
        return;
    }

    $lastPasswordChange = $user->getUpdateDate();
    $daysSinceChange = (new \DateTime())->diff($lastPasswordChange)->days;

    // ရက်ပေါင်း ၉၀ ကျော်လွန်သွားပါက
    if ($daysSinceChange > 90) {
        // Password အသစ် မဖြစ်မနေ လဲခိုင်းသည့် စာမျက်နှာသို့ လမ်းညွှန်ခြင်း
        throw new AccountExpiredException('パスワードの有効期限（90日）が切れています。変更してください。');
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **IPアドレス制限 (Ai-pii Adoresu Seigen)**: IP Address Restriction / Whitelist
- **アカウントロック (Akaunto Rokku)**: Account Lockout (ခေတ္တ အကောင့်ပိတ်ခြင်း)
- **ブルートフォース攻撃対策 (Buruuto Foosu Kougeki Taisaku)**: Brute-Force Attack Prevention
- **パスワード有効期限 (Pasuwaado Yuukou Kigen)**: Password Expiration Period
- **閲覧制限 (Etsuran Seigen)**: Viewing / Read Restriction
