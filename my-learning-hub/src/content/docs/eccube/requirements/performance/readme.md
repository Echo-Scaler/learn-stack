---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Performance Optimization (စွမ်းဆောင်ရည် မြှင့်တင်ခြင်းနှင့် ဆိုက်မြန်ဆန်အောင် ပြုပြင်ခြင်း) ဆိုင်ရာ နည်းပညာများ၊ Client Requireme"
---

## EC-CUBE Client Requirements: Performance Optimization (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Performance Optimization (စွမ်းဆောင်ရည် မြှင့်တင်ခြင်းနှင့် ဆိုက်မြန်ဆန်အောင် ပြုပြင်ခြင်း)** ဆိုင်ရာ နည်းပညာများ၊ Client Requirements များနှင့် လက်တွေ့ ပြင်ဆင်နည်းများကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

---

## ⚡ E-Commerce တွင် အမြန်နှုန်း (Speed) သည် အဘယ်ကြောင့် အရေးကြီးသနည်း?

Amazon ၏ သုတေသန စစ်တမ်းအရ စာမျက်နှာ ဖွင့်ချိန် **၁၀၀ မီလီစက္ကန့် (0.1s) နောက်ကျရုံဖြင့် အရောင်း 1% ကျဆင်းသွားပြီး**၊ Google ၏ အချက်အလက်များအရ ဖုန်းဖြင့် ဝင်ရောက်ချိန် ၃ စက္ကန့်ထက် ပိုကြာပါက ဈေးဝယ်သူ **၅၃% သည် ဆိုက်ပေါ်မှ ထွက်ခွာသွားကြပါသည်**။

ဂျပန်နိုင်ငံရှိ Client အများစုသည် ပစ္စည်းအရေအတွက်နှင့် အော်ဒါများပြားလာချိန်တွင် ဆိုက်လေးလံသွားခြင်း၊ Admin မျက်နှာပြင် မတက်တော့ခြင်း သို့မဟုတ် CSV ထုတ်ရာတွင် 500 Error တက်ခြင်း စသည့် ပြဿနာများကို အမြဲ ကြုံတွေ့ရလေ့ရှိပါသည်။

---

## 🧭 Performance Tuning အဓိက နယ်ပယ် ၅ ခု

```
                          ┌───────────────────────────┐
                          │  EC-CUBE High Performance │
                          └─────────────┬─────────────┘
                                        │
     ┌──────────────────┬───────────────┴──────────────┬──────────────────┐
     │                  │                              │                  │
┌────▼─────────────┐ ┌──▼───────────────┐ ┌────────────▼─────┐ ┌──────────▼──────────┐
│ 1. Database & ORM│ │ 2. Caching Layer │ │ 3. Assets & Media│ │ 4. Large Data & CSV │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├─────────────────────┤
│ • N+1 Problem Fix│ │ • Redis Cache    │ │ • WebP Format    │ │ • Memory Exhaustion │
│ • JOIN Fetching  │ │ • Doctrine Cache │ │ • Lazy Loading   │ │ • Stream/toIterable │
│ • Composite Index│ │ • Query Results  │ │ • Responsive Img │ │ • Batch Flush/Clear │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────────────────┘
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **N+1 Problem & Query Optimization** | [01_n_plus_1_and_query_optimization.md](/eccube/requirements/performance/01_n_plus_1_and_query_optimization/) | N+1 ပြဿနာ၏ အကြောင်းအရင်း၊ Before/After ကုဒ်များ၊ `addSelect` & `leftJoin` Eager Loading ဖြင့် Query အကြိမ်ရေ ရာချီ လျှော့ချနည်း |
| 02 | **Database Indexing & Pagination** | [02_database_indexing_and_pagination.md](/eccube/requirements/performance/02_database_indexing_and_pagination/) | Database Index တည်ဆောက်ခြင်း၊ Composite Index၊ MySQL `EXPLAIN` သုံးသပ်နည်း၊ Deep Pagination (`OFFSET` များလာချိန်) အမြန်နှုန်း မြှင့်တင်ခြင်း |
| 03 | **Caching & Redis Integration** | [03_caching_and_redis_integration.md](/eccube/requirements/performance/03_caching_and_redis_integration/) | Redis ဖြင့် Session နှင့် Query Result Cache ပြုလုပ်ခြင်း၊ Doctrine Metadata Cache၊ Cache Invalidation (ပစ္စည်းပြင်ဆင်ချိန် Cache ရှင်းခြင်း) |
| 04 | **Image & Frontend Asset Optimization** | [04_image_and_frontend_asset_optimization.md](/eccube/requirements/performance/04_image_and_frontend_asset_optimization/) | WebP ပုံရိပ်ပြောင်းလဲခြင်း၊ Image Thumbnail အလိုအလျောက် ထုတ်လုပ်ခြင်း၊ `loading="lazy"` နှင့် CSS/JS Minification |
| 05 | **Large CSV & Admin Performance** | [05_large_csv_and_admin_performance.md](/eccube/requirements/performance/05_large_csv_and_admin_performance/) | အော်ဒါ သိန်းချီ CSV ထုတ်ရာတွင် Memory Limit မပြည့်စေရန် `toIterable()` & `detach()` စနစ်သုံးခြင်း၊ Admin မျက်နှာပြင် လေးလံမှု ဖြေရှင်းခြင်း |
| 06 | **Top Client Tasks & Troubleshooting** | [06_top_client_tasks_and_troubleshooting.md](/eccube/requirements/performance/06_top_client_tasks_and_troubleshooting/) | **Client များ အများဆုံး တောင်းဆိုသော Performance Fix ၅ ခု (Before/After နှိုင်းယှဉ်ချက်များနှင့် လက်တွေ့ ကုဒ်များ)** |

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (Performance Tuning Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **パフォーマンス改善** | Pafoo-mansu Kaizen | Performance Improvement / Optimization |
| **N+1問題** | Enu Purasu Ichi Mondai | N+1 Query Problem |
| **遅延ロード (Lazy Load)** | Chien Roodo | Lazy Loading (လိုအပ်မှ Query ခေါ်ယူခြင်း) |
| **即時ロード (Eager Load)** | Sokuji Roodo | Eager Loading (စောစီးစွာ တစ်ပြိုင်နက် Join ဆွဲခြင်း) |
| **複合インデックス** | Fukugou Indekkusu | Composite / Compound Index |
| **メモリ枯渇 (上限エラー)** | Memori Kokatsu | Memory Limit Exhaustion (Fatal Error) |
| **スロークエリ** | Suroo Kueri | Slow Query (ကြာချိန်များသော Query) |
| **キャッシュ破棄** | Kyasshu Haki | Cache Invalidation / Purge |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
