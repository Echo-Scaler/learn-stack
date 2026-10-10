---
title: "01. Authentication And Authorization"
description: "> Technical & Client Requirement Overview:"
---

## 01 - Customer Authentication & Authorization (လုံခြုံရေးနှင့် ခွင့်ပြုချက် စနစ်)

> **Technical & Client Requirement Overview**:
> "EC-CUBE တွင် Customer များ Login ဝင်ရောက်ခြင်း (Authentication) နှင့် ခွင့်ပြုချက် စစ်ဆေးခြင်း (Authorization) ကို မည်သည့် Architecture ဖြင့် တည်ဆောက်ထားသနည်း? Password များကို မည်သို့ Hash လုပ်ထားပြီး၊ Login မဝင်ရသေးသော ဧည့်သည်များနှင့် အသင်းဝင်များကို မည်သို့ ကန့်သတ် ခွဲခြားထားသနည်း?"

---

## 🔐 1. Authentication vs Authorization ကွာခြားချက်

- **Authentication (認証 - အတည်ပြုခြင်း)**: *"သင်သည် မည်သူနည်း?"* (Email နှင့် Password မှန်ကန်ကြောင်း စစ်ဆေးပြီး Customer ကို အသိအမှတ်ပြုခြင်း)။
- **Authorization (認可 - လုပ်ပိုင်ခွင့် ခွင့်ပြုခြင်း)**: *"သင်သည် ဤစာမျက်နှာကို ကြည့်ရှုခွင့် ရှိပါသလား?"* (ဥပမာ- MyPage စာမျက်နှာကို Login ဝင်ထားသော `ROLE_USER` သာ ကြည့်ခွင့်ရှိပြီး၊ Login မဝင်ရသေးသော Guest ကို Login စာမျက်နှာသို့ Redirect ပို့ခြင်း)။

---

## 🏛️ EC-CUBE Symfony Security Architecture (`security.yaml`)

EC-CUBE တွင် လုံခြုံရေးစနစ်ကို `config/packages/security.yaml` တွင် အောက်ပါအတိုင်း ဖွဲ့စည်းထားပါသည်:

```yaml
security:
    # ၁။ Password Hash ပြုလုပ်မည့် Algorithm
    password_hashers:
        Eccube\Entity\Customer:
            algorithm: auto # bcrypt သို့မဟုတ် argon2id / sodium

    # ၂။ User ဒေတာကို DB မှ ဆွဲထုတ်ပေးသော Provider
    providers:
        customer_provider:
            entity:
                class: Eccube\Entity\Customer
                property: email

    # ၃။ Firewalls (နံရံများ ခွဲခြားခြင်း)
    firewalls:
        # Admin ဘက်ခြမ်းအတွက် Firewall
        admin:
            pattern: '^/%eccube_admin_route%/'
            user_checker: Eccube\Security\Core\User\MemberChecker
            # ...

        # Front Customer ဘက်ခြမ်းအတွက် Firewall
        customer:
            pattern: '^/'
            provider: customer_provider
            user_checker: Eccube\Security\Core\User\CustomerChecker
            form_login:
                login_path: mypage_login
                check_path: mypage_login
                username_parameter: login_email
                password_parameter: login_pass
                default_target_path: homepage
            remember_me:
                secret: '%kernel.secret%'
                lifetime: 31536000 # ၁ နှစ်ကြာ Login မှတ်ထားခွင့်
                path: /
            logout:
                path: logout
                target: homepage

    # ၄။ Access Control (ခွင့်ပြုချက် စည်းမျဉ်းများ)
    access_control:
        - { path: '^/mypage', roles: ROLE_USER }
        - { path: '^/%eccube_admin_route%/', roles: ROLE_ADMIN }
```

---

## 👤 `Customer` Entity ၏ Security Implementation

EC-CUBE ၏ `src/Eccube/Entity/Customer.php` သည် Symfony ၏ `UserInterface` နှင့် `PasswordAuthenticatedUserInterface` ကို Implement လုပ်ထားပါသည်:

```php
namespace Eccube\Entity;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class Customer implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * Customer ၏ Login Identifier (Email)
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * အသင်းဝင်တိုင်း ရရှိသော Role
     */
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    /**
     * Hash ထားသော Password
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }
}
```

---

## 🔑 Password Hashing & Security

EC-CUBE တွင် Password များကို Database တွင် Plain Text အဖြစ် လုံးဝ မသိမ်းဆည်းပါ။ `UserPasswordHasherInterface` (Bcrypt) ဖြင့် Hash ပြုလုပ်ပါသည်:

```php
// Password အသစ် သတ်မှတ်သည့်အခါ
$hashedPassword = $this->passwordHasher->hashPassword($Customer, $plainPassword);
$Customer->setPassword($hashedPassword);
```

### 💡 Legacy Salt Compatibility:
EC-CUBE Version 2.x နှင့် 3.x ဟောင်းများတွင် `salt` ကို သီးခြား သိမ်းဆည်းခဲ့သော်လည်း EC-CUBE 4.x တွင် ခေတ်မီ Bcrypt/Argon2id အလိုအလျောက် Salt ပါဝင်ပြီးသား စနစ်သို့ ပြောင်းလဲထားပါသည်။ အကယ်၍ စနစ်ဟောင်းမှ Customer အဟောင်း Login ဝင်လာပါက Password ကို Bcrypt သို့ အလိုအလျောက် Re-hash ပြုလုပ်ပေးသော Upgrade Listener ပါဝင်ပါသည်။

---

## 🛡️ User Checker (အသင်းဝင် အခြေအနေ စစ်ဆေးခြင်း)

Customer က Email နှင့် Password မှန်ကန်စွာ ရိုက်ထည့်စေကာမူ Login ဝင်ခွင့် မပြုသင့်သော အခြေအနေများ ရှိပါသည် (ဥပမာ- Email Verify မလုပ်ရသေးသော **仮会員 (Pending)** သို့မဟုတ် အသင်းဝင်မှ နုတ်ထွက်ထားသော **退会 (Withdrawn)**):

```php
// Eccube\Security\Core\User\CustomerChecker.php
public function checkPreAuth(UserInterface $user): void
{
    if (!$user instanceof Customer) {
        return;
    }

    // ၁။ အသင်းဝင်မှ နုတ်ထွက်ပြီးသူ ဖြစ်ပါက Login ပိတ်ခြင်း
    if ($user->getStatus()->getId() === CustomerStatus::WITHDRAWING) {
        throw new DisabledException('退会済みの会員です (အသင်းဝင်မှ နုတ်ထွက်ထားပြီး ဖြစ်သည်)');
    }

    // ၂။ Email Activation မလုပ်ရသေးသော ယာယီအသင်းဝင် (仮会員) ဖြစ်ပါက
    if ($user->getStatus()->getId() === CustomerStatus::NONACTIVE) {
        throw new LockedException('本会員登録が完了していません (Email အတည်ပြုရန် လိုအပ်ပါသည်)');
    }
}
```

---

## 🚦 Authorization စစ်ဆေးပုံ (Controller & Twig)

### ၁။ Controller အတွင်း Authorization စစ်ဆေးခြင်း:
```php
// Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
if ($this->isGranted('ROLE_USER')) {
    // လက်ရှိ Login ဝင်ထားသော Customer Entity ကို ယူခြင်း
    /** @var Customer $Customer */
    $Customer = $this->getUser();
    $points = $Customer->getPoint();
} else {
    // Guest User ဖြစ်ပါက Login စာမျက်နှာသို့ Redirect ပို့ခြင်း
    return $this->redirectToRoute('mypage_login');
}
```

### ၂။ Twig Template အတွင်း ခွဲခြားဖော်ပြခြင်း:
```twig
{# Resource/template/default/Block/header.twig #}

{% if is_granted('ROLE_USER') %}
    {# Login ဝင်ထားသော အသင်းဝင်များအတွက် #}
    <li class="nav-item">
        <a href="{{ url('mypage') }}">
            <i class="fa fa-user"></i> {{ app.user.name01 }} 様 (マイページ)
        </a>
    </li>
    <li class="nav-item">
        <a href="{{ url('logout') }}">ログアウト (Logout)</a>
    </li>
{% else %}
    {# Login မဝင်ရသေးသော ဧည့်သည်များအတွက် #}
    <li class="nav-item">
        <a href="{{ url('mypage_login') }}">ログイン (Login)</a>
    </li>
    <li class="nav-item">
        <a href="{{ url('entry') }}">会員登録 (Register)</a>
    </li>
{% endif %}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **認証 (Ninshou)**: Authentication (အသုံးပြုသူ အတည်ပြုခြင်း)
- **認可 (Ninka)**: Authorization (လုပ်ပိုင်ခွင့် ခွင့်ပြုချက်)
- **ログイン保持 (Roguin Hoji)**: Remember Me (Login အခြေအနေ မှတ်သားထားခြင်း)
- **ログイン制限 / ロックアウト (Roguin Seigen / Rokkuauto)**: Login Throttling / Lockout (Password အကြိမ်ကြိမ် မှားယွင်းပါက ပိတ်ပင်ခြင်း)
