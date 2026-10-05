---
title: "01. Auth Vs Authz And Firewalls"
description: "> Core Concepts:"
---

## 01 - Auth vs Authz & Firewall Architecture (စိစစ်ခြင်း၊ ခွင့်ပြုခြင်းနှင့် Firewall နံရံများ)

> **Core Concepts**:  
> EC-CUBE ၏ လုံခြုံရေးစနစ်သည် Symfony Security Component အပေါ်တွင် တည်ဆောက်ထားပြီး၊ **Authentication (認証)** နှင့် **Authorization (認可)** ကို မတူညီသော အလွှာများဖြင့် ထိန်းချုပ်ကာ၊ Admin နှင့် Customer အတွက် သီးခြား **Firewalls** ၂ ခု ဖွဲ့စည်းထားပါသည်။

---

## 🔐 1. Authentication (認証) vs Authorization (認可) အသေးစိတ်

### ၁။ Authentication (認証 - မည်သူဖြစ်ကြောင်း အတည်ပြုခြင်း)
- **မေးခွန်း**: *"သင်သည် အကောင့်ပိုင်ရှင် အစစ်အမှန် ဟုတ်ပါသလား?"*
- **လုပ်ဆောင်ပုံ**:
  1. Customer က Email နှင့် Password ရိုက်ထည့်သည်။
  2. စနစ်က `UserPasswordHasher` (Bcrypt) ဖြင့် Database ထဲရှိ Hash နှင့် တိုက်ဆိုင် စစ်ဆေးသည်။
  3. မှန်ကန်ပါက Customer အား **Authenticated Session** တစ်ခု ထုတ်ပေးသည်။

### ၂။ Authorization (認可 - လုပ်ပိုင်ခွင့် ခွင့်ပြုခြင်း)
- **မေးခွန်း**: *"သင့်တွင် ဤစာမျက်နှာကို ဝင်ရောက်ခွင့် ရှိပါသလား?"*
- **လုပ်ဆောင်ပုံ**:
  1. စနစ်က အသုံးပြုသူ၏ Role (`ROLE_USER`, `ROLE_ADMIN`) ကို စစ်ဆေးသည်။
  2. အကယ်၍ Role မကိုက်ညီပါက **HTTP 403 Forbidden** အမှား သို့မဟုတ် Login စာမျက်နှာသို့ Redirect ပို့သည်။

---

## 🧱 2. Two Separate Firewalls (`security.yaml`)

EC-CUBE တွင် `config/packages/security.yaml` ထဲ၌ လုံခြုံရေး နံရံ ၂ ခုကို အောက်ပါအတိုင်း ခွဲခြားထားပါသည်:

```yaml
security:
    # Password Hasher သတ်မှတ်ချက်
    password_hashers:
        Eccube\Entity\Member:
            algorithm: auto # Admin အတွက်
        Eccube\Entity\Customer:
            algorithm: auto # Customer အတွက်

    # User Providers (Database မှ User ဆွဲထုတ်သည့် နည်းလမ်း)
    providers:
        admin_provider:
            entity:
                class: Eccube\Entity\Member
                property: login_id
        customer_provider:
            entity:
                class: Eccube\Entity\Customer
                property: email

    # Firewalls နံရံ ၂ ခု
    firewalls:
        # ၁။ Admin Firewall (URL: /admin/*)
        admin:
            pattern: '^/%eccube_admin_route%/'
            provider: admin_provider
            form_login:
                login_path: admin_login
                check_path: admin_login
                default_target_path: admin_homepage
            logout:
                path: admin_logout
                target: admin_login

        # ၂။ Customer Firewall (URL: /* Front Store)
        customer:
            pattern: '^/'
            provider: customer_provider
            form_login:
                login_path: mypage_login
                check_path: mypage_login
                default_target_path: homepage
            remember_me:
                secret: '%kernel.secret%'
                lifetime: 31536000 # ၁ နှစ်တာ မှတ်ထားခွင့်
                path: /
            logout:
                path: logout
                target: homepage
```

---

## 🚪 3. Login & Logout Lifecycle (Session Management)

### Login အောင်မြင်ချိန်:
1. `UserAuthenticator` က အသုံးပြုသူအား စစ်ဆေး အတည်ပြုသည်။
2. Session ID အသစ်တစ်ခု ပြန်လည် ထုတ်ပေးသည် (**Session Fixation Attack** မှ ကာကွယ်ရန် `migrateSession()` ပြုလုပ်သည်)။
3. `SecurityToken` ကို Session ထဲတွင် သိမ်းဆည်းသည်။

### Logout ပြုလုပ်ချိန်:
1. Customer က Logout နှိပ်လိုက်သည်နှင့် `/logout` route က လက်ရှိ Session ကို အပြီးသတ် ဖျက်ဆီး (Invalidate) ပစ်သည်။
2. Remember-Me Cookie ကို Browser မှ ဖျက်ထုတ်သည်။
3. `SecurityTokenStorage` ကို `null` ပြောင်းလဲပြီး Homepage သို့ Redirect ပို့သည်။

---

## 🍪 4. Remember-Me (ログイン状態を保持する) စနစ်

Customer များ Browser ပိတ်လိုက်စေကာမူ နောက်တစ်ကြိမ် လာရောက်သည့်အခါ Password ထပ်ရိုက်စရာမလိုဘဲ Login ဖြစ်နေစေရန် အသုံးပြုပါသည်:
- **Cookie နာမည်**: `REMEMBERME`
- **လုံခြုံရေး**: Cookie ထဲတွင် Password အစစ်ကို မသိမ်းဆည်းဘဲ၊ User ID၊ သက်တမ်းကုန်ဆုံးချိန်နှင့် Kernel Secret ဖြင့် Hash လုပ်ထားသော Token ကိုသာ သိမ်းဆည်းသဖြင့် ဘေးကင်းစိတ်ချရပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **認証 (Ninshou)**: Authentication
- **認可 (Ninka)**: Authorization
- **ファイアウォール (Faiawooru)**: Security Firewall
- **セッション固定攻撃対策 (Sesshon Kotei Kougeki Taisaku)**: Session Fixation Protection
- **ログイン状態を保持 (Roguin Joutai wo Hoji)**: Remember Me
