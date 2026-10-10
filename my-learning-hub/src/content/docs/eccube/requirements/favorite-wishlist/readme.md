---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) ၏ Favorite / Wishlist (အကြိုက်ဆုံး ကုန်ပစ္စည်းများ စာရင်း / お気に入り機能) ဆိုင်ရာ Client Requirements များနှင့် လက်တွေ့ အသုံးများဆုံး Re"
---

## EC-CUBE Client Requirements: Favorite / Wishlist (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) ၏ **Favorite / Wishlist (အကြိုက်ဆုံး ကုန်ပစ္စည်းများ စာရင်း / お気に入り機能)** ဆိုင်ရာ Client Requirements များနှင့် လက်တွေ့ အသုံးများဆုံး Requirement ဖြစ်သော **「お気に入り登録されている商品に印を表示する (Favorite မှတ်ထားသော ကုန်ပစ္စည်းများပေါ်တွင် အမှတ်အသား အသည်းပုံ ပြသခြင်း)」** ၏ End-to-End ဗိသုကာကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

---

## 🎯 Practical Core Example:「お気に入り登録されている商品に印を表示する」

Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အဓိက Feature ဖြစ်ပြီး အောက်ပါ **Full Technical Pipeline (အဆင့် ၇ ဆင့်)** အတိုင်း အလုပ်လုပ်ပါသည်:

```
[1. Requirement (တောင်းဆိုချက်)]
       │ Customer က မိမိ အကြိုက်ဆုံး မှတ်ထားပြီးသော ပစ္စည်းများတွင် အနီရောင် အသည်းပုံ (❤️) ပေါ်စေချင်သည်
       ▼
[2. Database Table] ── dtb_customer_favorite_product (customer_id, product_id)
       │
       ▼
[3. Entity Layer] ── CustomerFavoriteProduct, Product, Customer
       │
       ▼
[4. Repository Layer] ── CustomerFavoriteProductRepository
       │
       ▼
[5. QueryBuilder Layer] ── Batch query ဖြင့် Favorite Product ID များကို ဆွဲထုတ်ခြင်း (Avoid N+1)
       │
       ▼
[6. Controller Layer] ── ProductController::index() မှ Twig သို့ favoriteProductIds ပေးပို့ခြင်း
       │
       ▼
[7. Twig View Layer] ── {% if Product.id in favoriteProductIds %} ❤️ {% else %} 🤍 {% endif %}
```

---

## ⚡ Performance Alert: N+1 Query Problem မဖြစ်စေရန် ဖြေရှင်းပုံ

ကုန်ပစ္စည်း အခု ၅၀ ပြသထားသော List စာမျက်နှာတွင် ကုန်ပစ္စည်းတစ်ခုချင်းစီအတွက် Favorite ရှိမရှိ Database သို့ Query တစ်ကြောင်းချင်း သွားစစ်ပါက Database သို့ Query အကြိမ် ၅၀ ထပ်ခါတလဲလဲ သွားရောက်မေးမြန်းသဖြင့် ဝဘ်ဆိုက် နှေးကွေးသွားစေပါသည် (**N+1 Query Problem**):

```mermaid
graph TD
    subgraph Bad Approach [❌ N+1 Queries: နှေးကွေးသော နည်းလမ်း]
        A1[Fetch 50 Products] --> B1[Query Fav for Prod #1]
        B1 --> B2[Query Fav for Prod #2]
        B2 --> B3[Query Fav for Prod #3 ...]
        B3 --> B50[Total: 1 + 50 = 51 Queries!]
    end

    subgraph Good Approach [✅ Batch Optimization: အကောင်းဆုံး နည်းလမ်း]
        A2[Fetch 50 Products] --> C2[Single Query: SELECT product_id FROM dtb_customer_favorite_product WHERE customer_id = ? AND product_id IN 1..50]
        C2 --> D2[Total: Just 2 Queries!]
    end
```

အသေးစိတ် ကုဒ်ရေးနည်းများကို [03_favorite_counts_and_n_plus_one.md](/eccube/requirements/favorite-wishlist/03_favorite_counts_and_n_plus_one/) တွင် ရှင်းပြထားပါသည်။

---

## 📑 မာတိကာ (Table of Contents)

| No. | Requirement ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **Favorite Core Architecture (End-to-End Pipeline)** | [01_favorite_core_architecture.md](/eccube/requirements/favorite-wishlist/01_favorite_core_architecture/) | Requirement မှ Twig အထိ အဆင့် ၇ ဆင့် စလုံးကို Code အပြည့်အစုံဖြင့် လက်တွေ့ တည်ဆောက်ပြခြင်း |
| 02 | **Add, Remove & Favorite List** | [02_add_remove_and_list.md](/eccube/requirements/favorite-wishlist/02_add_remove_and_list/) | AJAX ဖြင့် Favorite ထည့်ခြင်း/ဖျက်ခြင်း၊ MyPage Favorite List (`Mypage/favorite.twig`), Guest User ကိုင်တွယ်ပုံ |
| 03 | **Favorite Counts & Solving N+1 Queries** | [03_favorite_counts_and_n_plus_one.md](/eccube/requirements/favorite-wishlist/03_favorite_counts_and_n_plus_one/) | Header Favorite Badge, အခြားသူများ၏ Favorite အရေအတွက် ("❤️ ၁၂၈ ယောက် မှတ်ထားသည်"), N+1 Query ကာကွယ်နည်း |
| 04 | **Favorite Ranking & Marketing** | [04_favorite_ranking_and_history.md](/eccube/requirements/favorite-wishlist/04_favorite_ranking_and_history/) | အကြိုက်ဆုံး အများဆုံး ပစ္စည်းများ Ranking (お気に入りランキング), စျေးလျှော့သည့်အခါ Auto Email ပို့သော Marketing Logic |
| 05 | **Favorite Admin Screen & Analytics** | [05_favorite_admin_screen.md](/eccube/requirements/favorite-wishlist/05_favorite_admin_screen/) | Admin ဘက်ခြမ်းမှ မည်သည့် Customer က မည်သည့်ပစ္စည်းကို Favorite လုပ်ထားကြောင်း စစ်ဆေးနိုင်သော Screen ဖန်တီးနည်း |
| 06 | **Favorite History Tracking** | [06_favorite_history_tracking.md](/eccube/requirements/favorite-wishlist/06_favorite_history_tracking/) | အကြိုက်ဆုံး မှတ်သား/ဖျက်ပစ်/ဝယ်ယူမှု သမိုင်းကြောင်း (`dtb_customer_favorite_history`)၊ Entity၊ History Logging Service၊ အော်ဒါတက်ချိန် Purchase Conversion ခြေရာခံခြင်း |
| 07 | **Favorite CSV Export & Settings** | [07_favorite_csv_export_and_settings.md](/eccube/requirements/favorite-wishlist/07_favorite_csv_export_and_settings/) | EC-CUBE CSV စနစ်ဖြင့် CSV Type အသစ် (ID: 10) တည်ဆောက်ခြင်း၊ Admin CSV 設定 ချိတ်ဆက်ခြင်း၊ Mypage နှင့် Admin Favorite CSV ထုတ်ယူနည်း |
| 08 | **Top Client Tasks & Troubleshooting** | [08_top_client_tasks_and_troubleshooting.md](/eccube/requirements/favorite-wishlist/08_top_client_tasks_and_troubleshooting/) | **Client များ အများဆုံး တောင်းဆိုသော လုပ်ငန်းတာဝန် ၅ ခု** (Guest Favorite Auto-Sync, 一括カート追加, SOLD OUT Badge, Heart Icon Debounce, Excel 文字化け ဖြေရှင်းနည်း) |

---

## 🗄️ Database Schema (`dtb_customer_favorite_product`)

EC-CUBE Standard တွင် Favorite စနစ်အတွက် Join Table တစ်ခု ပါဝင်ပြီးသား ဖြစ်ပါသည်:

```mermaid
erDiagram
    dtb_customer ||--o{ dtb_customer_favorite_product : "favorites"
    dtb_product ||--o{ dtb_customer_favorite_product : "favorited by"

    dtb_customer_favorite_product {
        int customer_id PK, FK "ဖောက်သည် ID"
        int product_id PK, FK "ကုန်ပစ္စည်း ID"
        datetime create_date "မှတ်သားသည့် ရက်စွဲ"
        datetime update_date
    }
```

```sql
CREATE TABLE dtb_customer_favorite_product (
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    create_date DATETIME NOT NULL,
    update_date DATETIME NOT NULL,
    discriminator_type VARCHAR(255) NOT NULL,
    PRIMARY KEY (customer_id, product_id),
    CONSTRAINT FK_FAVORITE_CUSTOMER FOREIGN KEY (customer_id) REFERENCES dtb_customer (id) ON DELETE CASCADE,
    CONSTRAINT FK_FAVORITE_PRODUCT FOREIGN KEY (product_id) REFERENCES dtb_product (id) ON DELETE CASCADE
);
```

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (Favorite Management Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **お気に入り** | Okiniiri | Favorite / Wishlist |
| **お気に入り登録** | Okiniiri Touroku | Add to Favorites |
| **お気に入り解除** | Okiniiri Kaijo | Remove from Favorites |
| **お気に入り一覧** | Okiniiri Ichiran | Favorite Products List |
| **お気に入り数** | Okiniiri Suu | Favorite Count |
| **お気に入りランキング** | Okiniiri Rankingu | Favorite Ranking (အကြိုက်ဆုံး အများဆုံး ပစ္စည်းများ) |
| **N+1問題** | Enu Purasu Ichi Mondai | N+1 Query Performance Problem |
| **非同期登録 (AJAX)** | Hidouki Touroku | Asynchronous (AJAX) Favorite Toggle |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
