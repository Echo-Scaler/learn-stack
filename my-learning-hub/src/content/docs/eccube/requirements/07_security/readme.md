---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Security Architecture (ဝဘ်ဆိုက် လုံခြုံရေး စနစ်များ)၊ ဖြစ်ပေါ်တတ်သော အဓိက လုံခြုံရေး ချို့ယွင်းချက်များ (Vulnerabilities) နှင့် C"
---

## EC-CUBE Client Requirements: Security (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Security Architecture (ဝဘ်ဆိုက် လုံခြုံရေး စနစ်များ)**၊ ဖြစ်ပေါ်တတ်သော အဓိက လုံခြုံရေး ချို့ယွင်းချက်များ (Vulnerabilities) နှင့် Client (ဆိုင်ရှင်များ) ၏ လုံခြုံရေး စစ်ဆေးမှုများ (Security Audits) တွင် အောင်မြင်စေရန် ပြင်ဆင်နည်းများ ဖြစ်ပါသည်။

---

## 🛡️ Framework Defense vs Developer Responsibility

EC-CUBE 4.x (Symfony Framework အခြေခံ) သည် ခေတ်မီ လုံခြုံရေး အကာအကွယ်များစွာကို Built-in ထည့်သွင်းပေးထားသော်လည်း၊ **Developer များက Custom Code (Controller, Query, Twig, File Upload) ရေးသားရာတွင် သတိမမူပါက လုံခြုံရေး အပေါက်များ (Security Holes) ပေါ်ပေါက်လာနိုင်ပါသည်**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🏰 Symfony / EC-CUBE Built-in Protections:                                             │
│ • Twig Auto-escaping (HTML Entity များကို အလိုအလျောက် Escape ပြုလုပ်ပေးသည် - XSS)          │
│ • Doctrine Parameter Binding (Prepared Statements ဖြင့် Query run ပေးသည် - SQLi)        │
│ • Form CSRF Protection (Form တိုင်းတွင် အလိုအလျောက် _token ထည့်ပေးသည် - CSRF)          │
│ • Password Hashing (Bcrypt / Argon2i ဖြင့် Password များကို သိမ်းဆည်းပေးသည်)             │
│ • Session Regeneration on Login (Session Fixation ကို အလိုအလျောက် ကာကွယ်သည်)          │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           VS
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Developer များ သတိပြုရမည့် တာဝန်များ (What Developers Must Still Do):                │
│ • Twig တွင် |raw filter ကို အလွယ်တကူ မသုံးဘဲ HTML ကို သန့်စင်ခြင်း (HTML Sanitization)  │
│ • Custom Ajax Request များတွင် CSRF Token ကို ကိုယ်တိုင် စစ်ဆေးခြင်း                     │
│ • QueryBuilder တွင် String Concatenation (စာသားဆက်ခြင်း) လုံးဝ မပြုလုပ်ခြင်း             │
│ • IDOR ကာကွယ်ခြင်း (အခြားသူ၏ အော်ဒါ ID ကို URL မှ ရိုက်ထည့်၍ ကြည့်မရအောင် စစ်ဆေးခြင်း) │
│ • File Upload တွင် File Extension သာမက Magic Bytes / Mime Type ကို စစ်ဆေးခြင်း           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **CSRF & XSS Protection** | [01_csrf_and_xss_protection.md](/eccube/requirements/07_security/01_csrf_and_xss_protection/) | CSRF တိုက်ခိုက်မှု၊ Form CSRF vs Ajax CSRF Token Manager၊ Twig Auto-escaping၊ `\|raw` အန္တရာယ်နှင့် HTMLPurifier |
| 02 | **SQL Injection & Database Safety** | [02_sql_injection_and_database_safety.md](/eccube/requirements/07_security/02_sql_injection_and_database_safety/) | SQL Injection ဖြစ်ပေါ်ပုံ၊ Prepared Statements၊ String Concatenation အမှားများ၊ Native SQL သုံးရာတွင် သတိပြုရန်များ |
| 03 | **Authentication, Authorization & Access Control** | [03_authentication_authorization_and_access_control.md](/eccube/requirements/07_security/03_authentication_authorization_and_access_control/) | Password Hashing (Argon2i)、`security.yaml` Access Control၊ Symfony Voters Pattern၊ IDOR (Insecure Direct Object Reference) ကာကွယ်ခြင်း |
| 04 | **File Upload & Session Security** | [04_file_upload_validation_and_session_security.md](/eccube/requirements/07_security/04_file_upload_validation_and_session_security/) | Web Shell (.php disguise) Upload ကာကွယ်ခြင်း၊ Mime Type & Magic Bytes စစ်ဆေးခြင်း၊ Session Fixation/Hijacking၊ Cookie Flags (`HttpOnly`, `Secure`, `SameSite`) |
| 05 | **Top Client Tasks & Troubleshooting (Security Audits)** | [05_top_client_tasks_and_troubleshooting.md](/eccube/requirements/07_security/05_top_client_tasks_and_troubleshooting/) | **IPA / ဂျပန် လုံခြုံရေး စစ်ဆေးမှုတွင် အများဆုံး တွေ့ရသော အားနည်းချက် ၅ ခုနှင့် လက်တွေ့ ကုဒ်ပြင်ဆင်နည်းများ** |

---

## 🇯🇵 အရေးကြီးသော ဂျပန် လုံခြုံရေး ဝေါဟာရများ (Security Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **脆弱性 (ぜいじゃくせい)** | Zeijakusei | Vulnerability / Security Hole |
| **セキュリティ診断** | Sekyuriti Shindan | Security Audit / Penetration Testing |
| **クロスサイトスクリプティング** | Kurosu Saito Sukuriputingu | Cross-Site Scripting (XSS) |
| **クロスサイトリクエストフォージェリ**| Kurosu Saito Rikuesuto Foojeri | Cross-Site Request Forgery (CSRF) |
| **不正アクセス** | Fusei Akusesu | Unauthorized Access |
| **なりすまし** | Narisumashi | Spoofing / Impersonation |
| **権限昇格 (IDOR)** | Kengen Shoukakku | Privilege Escalation / Direct Object Reference |
| **ブルートフォース攻撃** | Buruuto Foosu Kougeki | Brute-force Attack (စကားဝှက် ဆက်တိုက် ရိုက်ထည့်တိုက်ခိုက်ခြင်း) |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
