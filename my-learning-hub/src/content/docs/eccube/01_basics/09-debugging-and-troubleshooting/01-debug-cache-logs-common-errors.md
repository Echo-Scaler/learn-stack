---
title: "01. Debug Cache Logs Common Errors"
description: "EC-CUBE 4.x ဖြင့် Development ပြုလုပ်ရာတွင် ကြုံတွေ့ရတတ်သော Error များကို ရှာဖွေစစ်ဆေးခြင်း (Debugging)၊ Cache ရှင်းထုတ်ခြင်းနှင့် အဖြစ်များဆုံး Error (၁၀) မျို"
---

## Module 09: Debugging, Cache Management နှင့် Error ဖြေရှင်းနည်းများ

EC-CUBE 4.x ဖြင့် Development ပြုလုပ်ရာတွင် ကြုံတွေ့ရတတ်သော Error များကို ရှာဖွေစစ်ဆေးခြင်း (Debugging)၊ Cache ရှင်းထုတ်ခြင်းနှင့် အဖြစ်များဆုံး Error (၁၀) မျိုးကို ဖြေရှင်းနည်းများကို ဤအခန်းတွင် စုစည်းဖော်ပြထားပါသည်။

---

## ၁။ Development Mode နှင့် Symfony Web Debug Toolbar

Developer Mode ကို ဖွင့်ထားခြင်းဖြင့် စာမျက်နှာအောက်ခြေတွင် **Symfony Web Debug Toolbar** ပေါ်လာပြီး Database Query များ၊ Memory သုံးစွဲမှုနှင့် Routing အချက်အလက်များကို အသေးစိတ် စစ်ဆေးနိုင်ပါသည်:

`.env` ဖိုင်တွင် အောက်ပါအတိုင်း သတ်မှတ်ပါ:

```dotenv
APP_ENV=dev
APP_DEBUG=1
```

```
+------------------------------------------------------------------------------------+
| 🚀 200 OK | @product_detail | 💾 14 queries (12ms) | 🐘 PHP 8.2 | 🔤 Twig | ⚠️ 0 logs |
+------------------------------------------------------------------------------------+
```

- **Query Inspector**: Database သို့ မည်သည့် SQL Query များ မည်မျှကြာအောင် Run နေသည်ကို စစ်ဆေးနိုင်ခြင်း (N+1 Query ပြဿနာ ရှာဖွေရန် အထူးကောင်းမွန်သည်)။
- **Profiler (`http://localhost:8080/_profiler`)**: Error Stack Trace အပြည့်အစုံကို လေ့လာနိုင်ခြင်း။

---

## ၂။ Cache စီမံခန့်ခွဲမှု (Cache Management)

EC-CUBE သည် မြန်ဆန်စေရန် Container Configuration, Twig Templates, Routing များနှင့် Doctrine Proxies များကို Cache ပြုလုပ်ထားပါသည်။ Code ပြင်ဆင်ပြီးနောက် အပြောင်းအလဲများ မပေါ်ပါက Cache ကို မဖြစ်မနေ ရှင်းရပါမည်:

```bash
# နည်းလမ်း ၁: Console Command ဖြင့် ရှင်းထုတ်ခြင်း (အကြံပြုချက်)
bin/console cache:clear --no-warmup

# နည်းလမ်း ၂: Cache Folder ကို တိုက်ရိုက် ဖျက်ပစ်ခြင်း (Command တောင် Run မရအောင် Crash ဖြစ်ချိန်တွင် သုံးရန်)
rm -rf var/cache/dev/*
rm -rf var/cache/prod/*

# နည်းလမ်း ၃: Admin Panel မှ ရှင်းခြင်း
# Admin -> コンテンツ管理 -> キャッシュ管理 -> キャッシュ削除 ခလုတ်ကို နှိပ်ပါ
```

---

## ၃။ Log ဖိုင်များ ဖတ်ရှုစစ်ဆေးခြင်း (Log Inspection)

Error ဖြစ်ပေါ်သည့်အခါ အဓိက အဖြေရှာရာနေရာမှာ `var/log/` Folder ဖြစ်ပါသည်:

- Development Log: `var/log/dev.log`
- Production Log: `var/log/prod.log`
- Site Error Log: `var/log/site_xxx.log`

Terminal တွင် Log များကို Live ကြည့်ရှုနည်း:
```bash
tail -f var/log/dev.log
```

---

## ၄။ အဖြစ်များဆုံး Error (၁၀) မျိုးနှင့် ဖြေရှင်းနည်းများ (Top 10 Common Errors)

### ၁။ 500 Internal Server Error (White Screen)
- **အကြောင်းရင်း**: PHP Fatal Error သို့မဟုတ် Syntax Error ကြောင့် ဖြစ်သည်။
- **ဖြေရှင်းနည်း**: `var/log/dev.log` ကို ဖွင့်ကြည့်ပြီး မည်သည့်ဖိုင်၊ မည်သည့်လိုင်းတွင် Syntax Error ဖြစ်နေသည်ကို စစ်ဆေးပါ။

### ၂။ `Class 'Customize\...' not found` (Namespace Mismatch)
- **အကြောင်းရင်း**: Composer Autoload တွင် Class မတွေ့ခြင်း သို့မဟုတ် Namespace စာလုံးပေါင်း မှားယွင်းခြင်း။
- **ဖြေရှင်းနည်း**: ဖိုင်လမ်းကြောင်းနှင့် `namespace` မှန်မမှန် စစ်ဆေးပြီး `composer dump-autoload` command ကို Run ပါ။

### ၃။ `An exception occurred while executing a query: Unknown column...`
- **အကြောင်းရင်း**: Entity တွင် Column အသစ်ထည့်ထားသော်လည်း Database Schema ကို Update မလုပ်ရသေးခြင်း။
- **ဖြေရှင်းနည်း**: `bin/console doctrine:schema:update --force` ကို Run ပါ။

### ၄။ `Twig\Error\RuntimeError: Variable "xyz" does not exist`
- **အကြောင်းရင်း**: Twig ထဲတွင် မရှိသော Variable ကို ခေါ်သုံးထားခြင်း။
- **ဖြေရှင်းနည်း**: Variable မခေါ်မီ `{% if xyz is defined and xyz %} ... {% endif %}` ဖြင့် စစ်ဆေးပါ။

### ၅။ `Invalid CSRF Token`
- **အကြောင်းရင်း**: Form Submit လုပ်ရာတွင် `{{ form_rest(form) }}` သို့မဟုတ် `csrf_token` မပါဝင်ခြင်း၊ သို့မဟုတ် Session Expired ဖြစ်သွားခြင်း။
- **ဖြေရှင်းနည်း**: Form Twig ထဲတွင် `{{ form_widget(form._token) }}` သို့မဟုတ် `{{ form_rest(form) }}` ပါဝင်ကြောင်း သေချာပါစေ။

### ၆။ Plugin ကြောင့် Admin / Front တစ်ခုလုံး Crash ဖြစ်သွားခြင်း (Recovery Guide)
- **အကြောင်းရင်း**: Plugin အသစ်တွင် Error ပါဝင်နေသဖြင့် Admin ပင် ဝင်မရတော့ခြင်း။
- **ဖြေရှင်းနည်း (အရေးပေါ် ပြန်ဖွင့်နည်း)**:
  1. MySQL Database သို့ ဝင်ပါ:
     ```sql
     UPDATE dtb_plugin SET enabled = 0 WHERE code = 'ProblemPluginCode';
     ```
  2. Cache ကို အတင်းဖျက်ပါ:
     ```bash
     rm -rf var/cache/*
     ```
  3. Site သည် မူလအတိုင်း ချက်ချင်း ပြန်လည် အလုပ်လုပ်ပါမည်။

### ၇။ `Permission Denied` (var/cache or var/log)
- **အကြောင်းရင်း**: Web server user (www-data / apache) တွင် Write permission မရှိခြင်း။
- **ဖြေရှင်းနည်း**: `chmod -R 777 var/ app/ html/` ပေးပါ။

### ၈။ `RouteNotFoundException` (404 Error)
- **အကြောင်းရင်း**: `@Route` annotation စာလုံးပေါင်း မှားယွင်းခြင်း သို့မဟုတ် Controller Cache မရှင်းရသေးခြင်း။
- **ဖြေရှင်းနည်း**: `bin/console debug:router` ဖြင့် Route စာရင်းတွင် ပါမပါ စစ်ဆေးပြီး Cache Clear လုပ်ပါ။

### ၉။ `Method not allowed (405 Method Not Allowed)`
- **အကြောင်းရင်း**: Form ကို `POST` ဖြင့် ပို့သော်လည်း Route တွင် `methods={"GET"}` သာ ခွင့်ပြုထားခြင်း။
- **ဖြေရှင်းနည်း**: `@Route(..., methods={"GET", "POST"})` ဟု ပြင်ဆင်ပါ။

### ၁၀။ Database Lock / MySQL Gone Away
- **အကြောင်းရင်း**: Memory မလုံလောက်ခြင်း သို့မဟုတ် Query ကြီးလွန်းခြင်း။
- **ဖြေရှင်းနည်း**: `php.ini` တွင် `memory_limit = 512M` သို့ တိုးပေးပါ။

---

နောက်အခန်းတွင် **[Module 10: ဂျပန် E-Commerce စကားလုံးများ (Glossary) နှင့် Best Practices](/eccube/01_basics/10-best-practices-and-japanese-terms/01-japanese-ec-terms-and-best-practices/)** ကို ဆက်လက်လေ့လာပါမည်။
