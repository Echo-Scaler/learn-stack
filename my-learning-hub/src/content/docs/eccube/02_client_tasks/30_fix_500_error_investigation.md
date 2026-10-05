---
title: "30. Fix 500 Error Investigation"
description: "> 「本番環境（またはステージング環境）において、特定の商品ページや購入フロー、管理画面で『システムエラーが発生しました（HTTP 500 Internal Server Error）』が発生し、サイトが停止しています。早急にログ（site.log / error.log）を調査し、原因を特定して恒久対応（修正）を行っ"
---

## Task 30: 既存機能で500エラーが発生するので修正してください (500 Error Investigation & Bug Fixing)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「本番環境（またはステージング環境）において、特定の商品ページや購入フロー、管理画面で『システムエラーが発生しました（HTTP 500 Internal Server Error）』が発生し、サイトが停止しています。早急にログ（site.log / error.log）を調査し、原因を特定して恒久対応（修正）を行ってください。また、原因と対策を記載した障害報告書を提出してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Production သို့မဟုတ် Staging Website တွင် "စနစ်ပိုင်းဆိုင်ရာ ချို့ယွင်းချက် ဖြစ်ပေါ်နေပါသည် (HTTP 500 Error)" ဟု ပေါ်လာပြီး ဝယ်ယူသူများ အသုံးပြုမရ ဖြစ်နေချိန်တွင် **Log ဖိုင်များကို စစ်ဆေးကာ အကြောင်းရင်းကို ရှာဖွေပြီး အမြန်ဆုံး ပြုပြင်ဖြေရှင်းခြင်း (Emergency Bug Fixing)** ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Log First Approach (ログ調査が最優先である理由)
- 500 Error တက်ချိန်တွင် Browser Screen ပေါ်တွင် လုံခြုံရေးအရ အသေးစိတ် Error ကို ပြသလေ့မရှိပါ ("システムエラーが発生しました")။
- အမှားဖြစ်စေသော အကြောင်းရင်းအစစ်အမှန် (Stack Trace) သည် Server ၏ Log ဖိုင်ထဲတွင်သာ ရှိသောကြောင့် Source Code များကို လျှောက်မွှေမနေဘဲ Log ကို ဦးစွာ ဖတ်ရှုရပါမည်။

### 2. Systematic Troubleshooting Across Layers
- EC-CUBE တွင် 500 Error သည် Database, Entity Proxy, Twig Template, PHP Fatal Error သို့မဟုတ် Memory Limit စသည့် အလွှာပေါင်းစုံမှ ဖြစ်ပွားနိုင်သဖြင့် စနစ်တကျ အဆင့်ဆင့် စစ်ဆေးရပါမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Log ဖိုင်များကို စစ်ဆေးခြင်း (Log Analysis)
Terminal မှတစ်ဆင့် အောက်ပါ command ဖြင့် လက်ရှိဖြစ်ပေါ်နေသော Error များကို Live စောင့်ကြည့်ပါ:

```bash
# 1. EC-CUBE Application Error Log
tail -f -n 100 var/log/prod/site_$(date +%Y-%m-%d).log

# 2. PHP-FPM / Nginx / Apache Server Error Log
tail -f -n 100 /var/log/nginx/error.log
# または
tail -f -n 100 /var/log/php-fpm/error.log
```

---

### အဆင့် ၂: ဂျပန် EC-CUBE တွင် အဖြစ်အများဆုံး 500 Error အကြောင်းအရင်း ၅ ခုနှင့် ဖြေရှင်းနည်းများ

#### အကြောင်းအရင်း (က): Entity Trait ပြင်ပြီး Proxy မထုတ်ရသေးခြင်း
- **Error Log:** `Class "Eccube\Entity\Proxy\__CG__\Eccube\Entity\Product" does not exist` သို့မဟုတ် Method ရှာမတွေ့ခြင်း
- **ဖြေရှင်းနည်း:** Proxy ပြန် Generate ပြုလုပ်ပြီး Cache ရှင်းလင်းပါ:
  ```bash
  bin/console eccube:generate:proxies
  bin/console cache:clear --no-warmup
  ```

#### အကြောင်းအရင်း (ခ): Twig Template ထဲတွင် Null Object ၏ Property ကို ခေါ်ယူမိခြင်း
- **Error Log:** `Impossible to access an attribute ("name") on a null variable.`
- **အမှားကုဒ်:** `{{ Order.Customer.name }}` (Guest 注文တွင် Customer က null ဖြစ်နိုင်သည်)
- **ဖြေရှင်းနည်း (Null-safe filter သုံးခြင်း):**
  ```twig
  {# ပြင်ဆင်ပြီး ကုဒ် #}
  {{ Order.Customer.name|default('ゲスト') }}
  {# または #}
  {% if Order.Customer %}
      {{ Order.Customer.name }}
  {% endif %}
  ```

#### အကြောင်းအရင်း (ဂ): Database Migration ကျန်ရှိနေခြင်း (Column Not Found)
- **Error Log:** `SQLSTATE[42703]: Undefined column: 7 ERROR: column "manufacturer_name" does not exist`
- **ဖြေရှင်းနည်း:** Database Schema ကို အဆင့်မြှင့်တင်ပါ:
  ```bash
  bin/console doctrine:migrations:migrate
  # または
  bin/console doctrine:schema:update --force
  ```

#### အကြောင်းအရင်း (ဃ): Memory Limit မလုံလောက်ခြင်း (PHP Fatal Error)
- **Error Log:** `Fatal error: Allowed memory size of 134217728 bytes exhausted`
- **ဖြေရှင်းနည်း:** `php.ini` သို့မဟုတ် `.htaccess` တွင် Memory တိုးမြှင့်ပါ:
  ```ini
  memory_limit = 512M
  ```

#### အကြောင်းအရင်း (င): Circular Reference / Infinite Recursion (Loop ပတ်နေခြင်း)
- **Error Log:** `Maximum function nesting level of '256' reached` သို့မဟုတ် EventSubscriber တစ်ခုက အခြား Event တစ်ခုကို မဆုံးနိုင်အောင် trigger နေခြင်း
- **ဖြေရှင်းနည်း:** Event Handler ထဲတွင် Flag စစ်ဆေးကာ တစ်ကြိမ်သာ အလုပ်လုပ်စေရန် ကာကွယ်ပါ။

---

### အဆင့် ၃: ဂျပန် Client ထံ တင်ပြရမည့် 障害報告書 (Incident Report Template)

အမှားပြင်ဆင်ပြီးပါက ဂျပန် Client ထံသို့ အောက်ပါ ပုံစံအတိုင်း အစီရင်ခံစာ ပေးပို့ရပါမည်:

```markdown
件名: 【障害復旧報告】商品詳細画面におけるシステムエラー（500）の対応完了について

関係者各位

お世話になっております。[担当者名]です。
本日発生いたしましたシステムエラーにつきまして、原因の特定および修正対応が完了いたしましたのでご報告申し上げます。

■ 障害概要
- 発生事象: 特定の商品詳細ページにアクセスした際、500システムエラーが表示される。
- 影響範囲: カテゴリが未設定の新規商品ページ全件
- 発生時刻: 2026年9月21日 10:15頃
- 復旧時刻: 2026年9月21日 10:45頃（サイト正常復旧済み）

■ 原因 (Root Cause)
関連商品表示機能（Task 10）において、カテゴリ未登録の商品を参照した際に Nullチェックが不足しており、Twigレンダリング時に例外が発生したため。

■ 対応内容 (Corrective Action)
該当コントローラーおよびTwigテンプレートに対し、カテゴリが存在しない場合のNullセーフ処理（default値の設定）を追加修正し、ステージングおよび本番環境へ反映いたしました。

■ 恒久対策 (Preventive Measure)
1. 商品新規登録時におけるエッジケース（カテゴリ未設定、画像未設定等）のテストケースを追加。
2. リリース前の結合テストにおけるチェックリストを更新・徹底いたします。

ご不便とご迷惑をおかけしましたことを深くお詫び申し上げます。
以上、よろしくお願い申し上げます。
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Production တွင် `APP_DEBUG=true` လုံးဝ မထားရ:**  
   Error ရှာဖွေရာတွင် Debug Mode ဖွင့်လိုက်ပါက Database Password များနှင့် Secret Key များ Screen ပေါ်တွင် အများပြည်သူသို့ ပေါက်ကြားသွားနိုင်ပါသည်။ Production တွင် Log ဖိုင်ကိုသာ ကြည့်ရှုရပါမည်။
2. **Backups Before Hotfixing:**  
   Emergency Fix ပြုလုပ်ရာတွင် Database သို့မဟုတ် Code ဖိုင်များကို Backup မယူဘဲ တိုက်ရိုက် မပြင်ပါနှင့်။ Git Branch သီးသန့်ဖွင့်၍ Fix ပြုလုပ်ပါ။
