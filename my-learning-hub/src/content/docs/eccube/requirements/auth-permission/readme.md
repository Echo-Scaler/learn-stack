---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Authentication & Permission (စိစစ်အတည်ပြုခြင်း၊ လုပ်ပိုင်ခွင့် ခွင့်ပြုချက်နှင့် အုပ်ချုပ်သူ အခန်းကဏ္ဍ စီမံခန့်ခွဲမှုစနစ်) ဆိုင်ရ"
---

## EC-CUBE Client Requirements: Authentication & Permission (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Authentication & Permission (စိစစ်အတည်ပြုခြင်း၊ လုပ်ပိုင်ခွင့် ခွင့်ပြုချက်နှင့် အုပ်ချုပ်သူ အခန်းကဏ္ဍ စီမံခန့်ခွဲမှုစနစ်)** ဆိုင်ရာ Client Requirements များနှင့် **Symfony Security Architecture** ကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

အွန်လိုင်းစတိုးတစ်ခုတွင် Customer များ လုံခြုံစွာ Login/Register ပြုလုပ်နိုင်ခြင်း၊ အသင်းဝင်သီးသန့် စာမျက်နှာများကို ကာကွယ်ခြင်းအပြင် Admin Dashboard တွင် မန်နေဂျာ၊ စာရင်းကိုင်နှင့် ဂိုဒေါင်ဝန်ထမ်းများအကြား **လုပ်ပိုင်ခွင့် အဆင့်အတန်း (Role-based Permissions)** ခွဲခြားသတ်မှတ်ခြင်းသည် စီးပွားရေးလုပ်ငန်းများအတွက် အရေးအကြီးဆုံး လုံခြုံရေး အစိတ်အပိုင်း ဖြစ်ပါသည်။

---

## ⚖️ Authentication vs Authorization (အရေးကြီးဆုံး သဘောတရား ကွာခြားချက်)

Junior Developer များ အမြဲတမ်း ရောထွေးတတ်သော ဝေါဟာရ ၂ ခု ဖြစ်ပါသည်:

```mermaid
graph LR
    subgraph Authentication [၁။ Authentication 認証: "သင် ဘယ်သူလဲ?"]
        A[Email / Login ID] + B[Password] --> C{Password မှန်/မမှန် စစ်ခြင်း}
        C -->|မှန်ကန်ပါက| D[စနစ်က သင့်အား မည်သူဖြစ်ကြောင်း အတည်ပြုသည်]
    end

    subgraph Authorization [၂။ Authorization 認可: "သင် ဘာလုပ်ခွင့်ရှိလဲ?"]
        D --> E{User ၏ Role ကို စစ်ဆေးခြင်း}
        E -->|ROLE_ADMIN| F[Admin Dashboard နှင့် Settings ပြင်ခွင့်ရှိသည်]
        E -->|ROLE_USER| G[MyPage နှင့် ကုန်ပစ္စည်း ဝယ်ယူခွင့်ရှိသည်]
        E -->|Guest / မရှိပါက| H[Access Denied 403 / Login သို့ Redirect ပို့သည်]
    end
```

| ကဏ္ဍ | Authentication (認証) | Authorization (認可) |
|:---|:---|:---|
| **အဓိပ္ပာယ်** | Identity Verification (မည်သူဖြစ်ကြောင်း အတည်ပြုခြင်း) | Access Control (ဝင်ရောက်ခွင့် ရှိမရှိ စစ်ဆေးခြင်း) |
| **အဓိက မေးခွန်း** | *"သင်သည် တကယ့် အကောင့်ပိုင်ရှင် ဟုတ်ပါသလား?"* | *"သင့်တွင် ဤစာမျက်နှာကို ကြည့်ရှု/ပြင်ဆင်ခွင့် ရှိပါသလား?"* |
| **တာဝန်ခံ စနစ်** | Form Login, Password Hasher, 2FA, Session | Role Voter, Access Control, Security Firewall |
| **ဥပမာ** | Email နှင့် Password ရိုက်ထည့်၍ Login အောင်မြင်ခြင်း | ဂိုဒေါင်ဝန်ထမ်းအား စာရင်းကိုင် ရောင်းအားစာရင်းကို ကြည့်ခွင့်မပေးဘဲ ပိတ်ပင်ခြင်း |

---

## 🏛️ EC-CUBE Firewalls: Admin vs Customer

EC-CUBE သည် `config/packages/security.yaml` တွင် လုံခြုံရေးနံရံ (Firewall) ၂ ခုကို သီးခြား ခွဲခြားထားပါသည်:

```
                      [Incoming Web Request]
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
        ▼ (URL: ^/%eccube_admin_route%/)                ▼ (URL: ^/ Front Store)
  [1. admin Firewall]                             [2. customer Firewall]
        │                                               │
  ├── Provider: MemberProvider                    ├── Provider: CustomerProvider
  ├── Entity: dtb_member                          ├── Entity: dtb_customer
  ├── Login: /admin/login                         ├── Login: /mypage/login
  └── Role: ROLE_ADMIN                            └── Role: ROLE_USER
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **Auth vs Authz & Firewall Architecture** | [01_auth_vs_authz_and_firewalls.md](/eccube/requirements/auth-permission/01_auth_vs_authz_and_firewalls/) | `security.yaml`, Login, Logout, Session Invalidation, Remember-Me စနစ် |
| 02 | **Customer Auth & Member-Only Pages** | [02_customer_auth_and_member_pages.md](/eccube/requirements/auth-permission/02_customer_auth_and_member_pages/) | Customer Registration, Password Reset (Secret Token), အသင်းဝင်သီးသန့် စာမျက်နှာများ ကာကွယ်နည်း (`ROLE_USER`) |
| 03 | **Admin Auth, Roles & Permissions** | [03_admin_auth_roles_and_permissions.md](/eccube/requirements/auth-permission/03_admin_auth_roles_and_permissions/) | `dtb_member`, Admin Roles (`mtb_authority`), စနစ်မန်နေဂျာ vs ဂိုဒေါင်ဝန်ထမ်း လုပ်ပိုင်ခွင့် ကန့်သတ်ခြင်း |
| 04 | **Top Client Tasks & Troubleshooting (လက်တွေ့ ပြင်ဆင်နည်းများ)** | [04_top_client_tasks_and_troubleshooting.md](/eccube/requirements/auth-permission/04_top_client_tasks_and_troubleshooting/) | **Client များ အများဆုံး တောင်းဆိုသော ပြင်ဆင်မှု ၅ ခုနှင့် Fix လုပ်နည်းများ** (ဂိုဒေါင်ဝန်ထမ်းအား ရောင်းအားမပြရန် ပိတ်နည်း၊ Admin IP ကန့်သတ်နည်း၊ ၅ ကြိမ်မှားပါက Lock ချနည်း၊ Login ပြီး မူလစာမျက်နှာသို့ ပြန်ပို့နည်း) |

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (Auth & Permission Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **認証** | Ninshou | Authentication (အသုံးပြုသူ အတည်ပြုခြင်း) |
| **認可** | Ninka | Authorization (လုပ်ပိုင်ခွင့် ခွင့်ပြုခြင်း) |
| **権限管理** | Kengen Kanri | Permission / Access Rights Management |
| **ロール** | Rooru | Role (ဥပမာ- `ROLE_ADMIN`, `ROLE_USER`) |
| **会員限定ページ** | Kaiin Gentei Peeji | Member-Only Restricted Page |
| **アクセス制限** | Akusesu Seigen | Access Restriction / Access Control |
| **二要素認証 (2FA)** | Ni-youso Ninshou | Two-Factor Authentication (2FA) |
| **アカウントロック** | Akaunto Rokku | Account Lockout (အကြိမ်ကြိမ် မှားယွင်းပါက ပိတ်ခြင်း) |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
