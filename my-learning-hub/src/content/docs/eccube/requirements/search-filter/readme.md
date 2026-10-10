---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Search & Filter (ကုန်ပစ္စည်း ရှာဖွေခြင်း၊ စစ်ထုတ်ခြင်းနှင့် အစီအစဉ်ချခြင်း) ဆိုင်ရာ Client Requirements များနှင့် Doctrine QueryB"
---

## EC-CUBE Client Requirements: Search & Filter (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Search & Filter (ကုန်ပစ္စည်း ရှာဖွေခြင်း၊ စစ်ထုတ်ခြင်းနှင့် အစီအစဉ်ချခြင်း)** ဆိုင်ရာ Client Requirements များနှင့် **Doctrine QueryBuilder** ဗိသုကာကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

---

## 🎯 Practical Client Example (လက်တွေ့ စံပြ လေ့လာမှု)

> **Client Requirement**:  
> **「価格に範囲がある場合の表示についても商品一覧と合わせるようにしてください。」**  
> *(ကုန်ပစ္စည်းတွင် စျေးနှုန်း အပိုင်းအခြား (Price Range) ရှိနေပါက ထိုစျေးနှုန်း ဖော်ပြပုံကိုလည်း Product List (商品一覧) စာမျက်နှာနှင့် ပုံစံတူညီအောင် ပြသပေးပါ။)*

### အဘယ်ကြောင့် ဤသို့ တောင်းဆိုရသနည်း? (The Business & UI Problem):
- ကုန်ပစ္စည်းတစ်ခုတွင် Size (S: ¥1,000, L: ¥1,500) ကဲ့သို့ Variation (規格) များ ရှိနေပါက စျေးနှုန်းသည် တစ်ခုတည်း မဟုတ်ဘဲ `¥1,000 ～ ¥1,500` ဟု ဖြစ်နေပါသည်။
- အချို့သော နေရာများ (ဥပမာ- Search Result, Top Page Blocks, Recommendation) တွင် Developer များက အနိမ့်ဆုံးစျေး `¥1,000` သာ ပြသမိတတ်ကြသည်။
- **Client ၏ လိုအပ်ချက်**:  
  1. **UI**: စျေးနှုန်း တူညီပါက `¥1,000 (税込)` ဟုသာ ပြပြီး၊ စျေးနှုန်း ကွဲပြားပါက `¥1,000 ～ ¥1,500 (税込)` ဟု List စာမျက်နှာအတိုင်း တိကျစွာ ပြသပေးရမည်။
  2. **Backend**: Customer က စျေးနှုန်း `¥1,200 ～ ¥1,400` ဖြင့် ရှာဖွေပါက ထို ကုန်ပစ္စည်းသည် Search ထဲတွင် မှန်ကန်စွာ ပါဝင်ထွက်ရှိလာရမည်။

---

## 🏛️ EC-CUBE Search Engine Pipeline

EC-CUBE တွင် ရှာဖွေခြင်းနှင့် စစ်ထုတ်ခြင်း လုပ်ငန်းစဉ်တစ်ခုလုံးကို အောက်ပါ Pipeline အတိုင်း တည်ဆောက်ထားပါသည်:

```
[Search Form / URL Query Parameters]
  (?name=shirt&category_id=3&price_min=1000&price_max=5000&in_stock=1&orderby=1)
                       │
                       ▼
[SearchProductType (Form Binding)] ── Request Params ➔ Array Data
                       │
                       ▼
[ProductRepository::getQueryBuilderBySearchData($searchData)]
                       │
                       ├── WHERE (p.Status = 1: 公開)
                       ├── AND WHERE (Keyword LIKE %shirt%)
                       ├── JOIN dtb_product_category (category_id = 3)
                       ├── JOIN dtb_product_class (price02 BETWEEN 1000 AND 5000)
                       ├── LEFT JOIN dtb_product_stock (stock > 0 OR unlimited = 1)
                       └── ORDER BY (pc.price02 ASC)
                       │
                       ▼
[KnpPaginatorBundle (Pagination)] ── Page 1, 2, 3 ခွဲခြမ်းပြသခြင်း
                       │
                       ▼
[Product/list.twig] ── Grid / List Display with Price Range Check
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **QueryBuilder Fundamentals** | [01_querybuilder_fundamentals.md](/eccube/requirements/search-filter/01_querybuilder_fundamentals/) | `WHERE`, `AND WHERE`, `JOIN`, `LEFT JOIN`, `ORDER BY`, `GROUP BY`, `COUNT`, `BETWEEN`, `LIKE`, `IN` အသေးစိတ် ရှင်းလင်းချက် |
| 02 | **Search & Filter Conditions** | [02_search_and_filter_conditions.md](/eccube/requirements/search-filter/02_search_and_filter_conditions/) | Keyword ရှာဖွေမှု၊ Category Tree၊ Price Range၊ Brand (Tag)၊ In-Stock စစ်ထုတ်မှု၊ SKU Code၊ Multiple Conditions ပေါင်းစပ်ပုံ |
| 03 | **Sorting & Pagination** | [03_sorting_and_pagination.md](/eccube/requirements/search-filter/03_sorting_and_pagination/) | စျေးနှုန်းအလိုက် (စျေးပေါ/စျေးကြီး)၊ အသစ်ဆုံး၊ လူကြိုက်အများဆုံး Sort လုပ်နည်း၊ `KnpPaginatorBundle` Pagination စနစ် |
| 04 | **Price Range Case Study** | [04_price_range_case_study.md](/eccube/requirements/search-filter/04_price_range_case_study/) | **「価格に範囲がある場合の表示についても商品一覧と合わせるようにしてください。」** Client Requirement ၏ UI နှင့် Backend Logic အပြည့်အစုံ |
| 05 | **Search-Filtered CSV Export** | [05_search_filtered_csv_export.md](/eccube/requirements/search-filter/05_search_filtered_csv_export/) | **「エクスポートするデータは、検索条件で絞れるようにしてください。」** Search-Filtered CSV Export Master Guide (Form, Session, QueryBuilder, StreamedResponse) |

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (Search & Filter Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **商品検索** | Shouhin Kensaku | Product Search (ကုန်ပစ္စည်း ရှာဖွေခြင်း) |
| **絞り込み** | Shiborikomi | Filtering / Refinement (စစ်ထုတ်ခြင်း) |
| **並び替え / ソート** | Narabikae / Sooto | Sorting (အစီအစဉ် စီတန်းခြင်း) |
| **価格帯** | Kakakutai | Price Range (စျေးနှုန်း အပိုင်းအခြား) |
| **価格に範囲がある場合** | Kakaku ni Han'i ga Aru Baai | When there is a price range (Min != Max) |
| **新着順** | Shinchaku-jun | Newest First |
| **価格の安い順** | Kakaku no Yasui-jun | Price: Low to High |
| **価格の高い順** | Kakaku no Takai-jun | Price: High to Low |
| **人気順 / おすすめ順** | Ninki-jun / Osusume-jun | Popularity / Recommended Order |
| **在庫ありのみ** | Zaiko Ari Nomi | In Stock Only |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
