---
title: "12. Search And Filtering"
description: "> Client Requirements:"
---

## 12 - Product Search & Filtering (ကုန်ပစ္စည်း ရှာဖွေခြင်းနှင့် စစ်ထုတ်ခြင်း)

> **Client Requirements**:
> 1. **Product search (ရှာဖွေခြင်း)**: ကုန်ပစ္စည်း အမည်၊ ကုန်ပစ္စည်း ကုဒ် (SKU)၊ ဖော်ပြချက်စာသား သို့မဟုတ် Search Keywords များဖြင့် လျင်မြန်စွာ ရှာဖွေနိုင်ရမည်။ စကားလုံး ၂ လုံးကြား Space ခြားရှာပါက နှစ်ခုစလုံး ပါဝင်သော ပစ္စည်းများ ထွက်လာရမည် (AND Search)။
> 2. **Product filtering (အသေးစိတ် စစ်ထုတ်ခြင်း)**: Category၊ စျေးနှုန်း အတိုင်းအတာ (Min ～ Max Price Range)၊ လက်ကျန်ရှိသော ပစ္စည်းများသာ ပြသခြင်း (In-Stock Only)၊ အသစ်ရောက်/စျေးအနည်းဆုံး/စျေးအများဆုံး အစီအစဉ်အလိုက် စစ်ထုတ်ပြသနိုင်ရမည်။

---

## 🏛️ EC-CUBE Implementation Architecture: Search Engine

EC-CUBE တွင် ရှာဖွေခြင်းနှင့် စစ်ထုတ်ခြင်း လုပ်ငန်းစဉ်အားလုံးကို **`ProductRepository::getQueryBuilderBySearchData()`** Method က ဗဟိုပြု ထိန်းချုပ်ထားပါသည်:

```
[Customer Browser / Search Box]
         │
         ▼ (HTTP GET /products/list?category_id=3&name=shirt&orderby=1)
[ProductController::index()]
         │
         ├─► [SearchProductType (Form)] ─── Request Parameter များကို Binding ပြုလုပ်ခြင်း
         │
         ├─► [ProductRepository::getQueryBuilderBySearchData($searchData)]
         │         │
         │         ├── Category Filter (dtb_product_category)
         │         ├── Keyword Filter (name, search_word, code)
         │         ├── Price Range Filter (price02 >= min AND price02 <= max)
         │         ├── Stock Filter (stock > 0 OR stock_unlimited = 1)
         │         └── Sort Order (price, date, sort_no)
         │
         ▼
[KnpPaginatorBundle (Pagination)] ── စာမျက်နှာအလိုက် (Page 1, 2, 3) ပိုင်းခြားပြသခြင်း
         │
         ▼
[Product/list.twig] ── ရလဒ်များအား Grid / List ပုံစံ Render ပြုလုပ်ခြင်း
```

### သက်ဆိုင်ရာ အဓိက ဖိုင်များ:
- **Front Controller**: `src/Eccube/Controller/ProductController.php`
- **Search Form Type**: `src/Eccube/Form/Type/SearchProductType.php`
- **Core Repository**: `src/Eccube/Repository/ProductRepository.php`
- **Twig Template**: `src/Eccube/Resource/template/default/Product/list.twig`

---

## 16. 🔍 Product Search (ကုန်ပစ္စည်း ရှာဖွေခြင်း Logic)

### Keyword AND Search အလုပ်လုပ်ပုံ:
Customer က `"Nike Black Shoes"` ဟု ရိုက်ရှာလိုက်ပါက စနစ်သည် Space များကို ခွဲခြမ်း (Tokenize) ပြီး အောက်ပါအတိုင်း SQL QueryBuilder ဖွဲ့စည်းပါသည်:

```php
// ProductRepository.php (getQueryBuilderBySearchData အကျဉ်း)
if (!empty($searchData['name'])) {
    // ဂျပန်စာလုံး အပြည့်/အဝက် Space များကို ဖယ်ထုတ်ခွဲခြမ်းခြင်း
    $keywords = preg_split('/[\s　]+/u', $searchData['name'], -1, PREG_SPLIT_NO_EMPTY);

    foreach ($keywords as $index => $keyword) {
        $key = 'keyword_'.$index;
        $qb
            ->andWhere($qb->expr()->orX(
                $qb->expr()->like('p.name', ':'.$key),
                $qb->expr()->like('p.search_word', ':'.$key),
                $qb->expr()->like('pc.code', ':'.$key)
            ))
            ->setParameter($key, '%'.$keyword.'%');
    }
}
```

---

## 17. 🎛️ Product Filtering (အသေးစိတ် စစ်ထုတ်ခြင်း Logic)

Client များ အမေးများသော Filter ၃ မျိုးကို အောက်ပါအတိုင်း အကောင်အထည်ဖော်ပါသည်:

### ၁။ စျေးနှုန်း အတိုင်းအတာဖြင့် စစ်ထုတ်ခြင်း (Price Range Filter)
```php
// အနိမ့်ဆုံး စျေးနှုန်း
if (isset($searchData['price_min']) && is_numeric($searchData['price_min'])) {
    $qb->andWhere('pc.price02 >= :price_min')
       ->setParameter('price_min', $searchData['price_min']);
}

// အမြင့်ဆုံး စျေးနှုန်း
if (isset($searchData['price_max']) && is_numeric($searchData['price_max'])) {
    $qb->andWhere('pc.price02 <= :price_max')
       ->setParameter('price_max', $searchData['price_max']);
}
```

### ၂။ ပစ္စည်းရှိသော ပစ္စည်းများသာ ပြသခြင်း (In-Stock Only Filter)
Customer များသည် ပစ္စည်းပြတ်နေသော (Sold out) ပစ္စည်းများကို မမြင်လိုသည့်အခါ:

```php
if (!empty($searchData['in_stock_only'])) {
    $qb->andWhere($qb->expr()->orX(
        'pc.stock_unlimited = 1',
        'ps.stock > 0'
    ));
}
```

### ၃။ အစီအစဉ် အလိုက် စီတန်းပြသခြင်း (Sorting - 並び替え)
EC-CUBE တွင် အောက်ပါ Sort Options များ ပါဝင်ပါသည်:
- `orderby_id = 1`: **価格順 (စျေးနှုန်း အနိမ့်မှ အမြင့်)** ➔ `ORDER BY pc.price02 ASC`
- `orderby_id = 2`: **新着順 (အသစ်ဆုံး ပစ္စည်းများ)** ➔ `ORDER BY p.create_date DESC`
- `orderby_id = 3`: **おすすめ順 (အကြံပြု အစီအစဉ်)** ➔ `ORDER BY p.sort_no DESC`

---

## 🎨 Twig Template တွင် Filter Form ပြသပုံ

```twig
{# Resource/template/default/Product/list.twig #}

<div class="filter-sidebar p-3 bg-light rounded">
    <h5>絞り込み検索 (Filter Products)</h5>
    <form method="get" action="{{ url('product_list') }}">
        {# လက်ရှိ ရွေးထားသော Category ID ကို Hidden ထားခြင်း #}
        {% if searchData.category_id is defined %}
            <input type="hidden" name="category_id" value="{{ searchData.category_id.id }}">
        {% endif %}

        {# စျေးနှုန်း Filter #}
        <div class="form-group mb-3">
            <label>価格帯 (Price Range)</label>
            <div class="d-flex align-items-center">
                <input type="number" name="price_min" class="form-control" placeholder="¥ Min" value="{{ app.request.get('price_min') }}">
                <span class="mx-2">～</span>
                <input type="number" name="price_max" class="form-control" placeholder="¥ Max" value="{{ app.request.get('price_max') }}">
            </div>
        </div>

        {# စတော့ရှိသည်များသာ ပြရန် Checkbox #}
        <div class="form-check mb-3">
            <input type="checkbox" name="in_stock_only" class="form-check-input" id="inStockCheck" value="1" {% if app.request.get('in_stock_only') %}checked{% endif %}>
            <label class="form-check-label" for="inStockCheck">在庫ありのみ表示 (In-Stock Only)</label>
        </div>

        <button type="submit" class="btn btn-dark w-100">絞り込む (Apply Filter)</button>
    </form>
</div>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **商品検索 (Shouhin Kensaku)**: Product Search
- **絞り込み (Shiborikomi)**: Filtering / Refinement
- **並び替え / ソート (Narabikae / Sooto)**: Sorting (အစီအစဉ် ချထားမှု)
- **価格帯 (Kakakutai)**: Price Range (စျေးနှုန်း အပိုင်းအခြား)
- **在庫ありのみ (Zaiko Ari Nomi)**: In Stock Only
- **新着順 (Shinchaku-jun)**: Sorted by Newest First
- **価格の安い順 (Kakaku no Yasui-jun)**: Price: Low to High
- **価格の高い順 (Kakaku no Takai-jun)**: Price: High to Low
