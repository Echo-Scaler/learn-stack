---
title: "03. Sorting And Pagination"
description: "> Client Requirements:"
---

## 03 - Sorting & Pagination (အစီအစဉ် ချထားခြင်းနှင့် စာမျက်နှာ ခွဲခြင်း)

> **Client Requirements**:
> 1. **Sort by price (စျေးနှုန်းအလိုက် စီခြင်း)**: စျေးနှုန်း အနိမ့်ဆုံးမှ အမြင့်ဆုံးသို့ (安い順) သို့မဟုတ် အမြင့်ဆုံးမှ အနိမ့်ဆုံးသို့ (高い順) စီတန်းနိုင်ရမည်။
> 2. **Sort by newest (အသစ်ဆုံး ပစ္စည်းများ စီခြင်း)**: အသစ်ဆုံး ရောက်ရှိလာသော ကုန်ပစ္စည်းများကို ဦးစားပေး စီတန်းနိုင်ရမည် (新着順)။
> 3. **Sort by popularity (လူကြိုက်များမှု / အကြံပြု အစီအစဉ်)**: ဆိုင်ရှင် အကြံပြုထားသော အစီအစဉ် သို့မဟုတ် ရောင်းအား အကောင်းဆုံး အစီအစဉ်ဖြင့် စီတန်းနိုင်ရမည် (おすすめ順 / 人気順)။
> 4. **Pagination (စာမျက်နှာ ခွဲခြင်း)**: ကုန်ပစ္စည်း ၂၀ လျှင် စာမျက်နှာ ၁ မျက်နှာနှုန်းဖြင့် စာမျက်နှာနံပါတ် (1, 2, 3...) ခွဲပြသနိုင်ရမည်ဖြစ်ပြီး၊ **စာမျက်နှာ ၂ သို့ ကူးသည့်အခါ ရှာဖွေထားသော Keyword နှင့် စျေးနှုန်း စစ်ထုတ်ချက်များ မပျောက်သွားစေရပါ**။

---

## 🔃 1. Sorting Logic Implementation (並び替え)

EC-CUBE တွင် Sort Option များကို `orderby_id` Parameter ဖြင့် လက်ခံပြီး QueryBuilder တွင် `orderBy()` ချိတ်ဆက်ပေးပါသည်:

```php
// ProductRepository.php
private function buildOrderBy(QueryBuilder $qb, array $searchData): void
{
    $orderby = $searchData['orderby_id'] ?? 1; // Default: おすすめ順

    switch ($orderby) {
        // ၁။ 価格の低い順 (စျေးအပေါဆုံးမှ စျေးအကြီးဆုံးသို့)
        case 2:
            $qb->orderBy('pc.price02', 'ASC');
            break;

        // ၂။ 価格の高い順 (စျေးအကြီးဆုံးမှ စျေးအပေါဆုံးသို့)
        case 3:
            $qb->orderBy('pc.price02', 'DESC');
            break;

        // ၃။ 新着順 (အသစ်ဆုံး ပစ္စည်းများ ဦးစားပေး)
        case 4:
            $qb->orderBy('p.create_date', 'DESC');
            break;

        // ၄။ おすすめ順 (ဆိုင်ရှင် အကြံပြုထားသော အစီအစဉ် - Default)
        case 1:
        default:
            $qb->orderBy('p.sort_no', 'DESC')
               ->addOrderBy('p.id', 'DESC');
            break;
    }
}
```

---

## 📑 2. Pagination Architecture (`KnpPaginatorBundle`)

EC-CUBE သည် Symfony ၏ နာမည်ကျော် **`KnpPaginatorBundle`** ကို အသုံးပြု၍ စာမျက်နှာ ခွဲခြားပါသည်:

```
[QueryBuilder (Without LIMIT/OFFSET)]
                 │
                 ▼
[$paginator->paginate($queryBuilder, $pageNo, $limitPerPage)]
                 │
                 ├── 1. Execute COUNT() Query (Total Items တွက်ချက်ခြင်း)
                 ├── 2. Apply OFFSET and LIMIT (ဥပမာ- OFFSET 20 LIMIT 20)
                 └── 3. Wrap into Pagination Object
                 │
                 ▼
[Twig: knp_pagination_render(pagination)]
```

### Controller Implementation (`ProductController.php`):
```php
#[Route('/products/list', name: 'product_list')]
public function index(Request $request)
{
    // လက်ရှိ စာမျက်နှာ နံပါတ် (Default: 1)
    $page_no = $request->query->getInt('pageno', 1);
    
    // တစ်မျက်နှာတွင် ပြသမည့် ပစ္စည်း အရေအတွက် (ဥပမာ- 20 ခု)
    $page_count = $this->eccubeConfig['eccube_search_pmax'] ?? 20;

    $qb = $this->productRepository->getQueryBuilderBySearchData($searchData);

    // KnpPaginator ဖြင့် စာမျက်နှာ ခွဲထုတ်ခြင်း
    $pagination = $this->paginator->paginate(
        $qb,
        $page_no,
        $page_count
    );

    return [
        'pagination' => $pagination,
        'searchData' => $searchData,
    ];
}
```

---

## ⚠️ Client မကြာခဏ တောင်းဆိုသော ပြဿနာ: စာမျက်နှာ ကူးသည့်အခါ Search Parameter များ မပျောက်စေရန် ထိန်းသိမ်းခြင်း

Beginner များ မကြာခဏ ကြုံရသော ပြဿနာ:
> *"Customer က စျေးနှုန်း ¥2,000 ~ ¥5,000 ကြား စစ်ထုတ်ပြီး စာမျက်နှာ ၂ (Page 2) ကို နှိပ်လိုက်သည့်အခါ မူလ စစ်ထုတ်ထားသော စျေးနှုန်းများ ပျောက်သွားပြီး ပစ္စည်းအားလုံး ပြန်ထွက်လာသည်!"*

### အကြောင်းရင်း:
Pagination Link တွင် `?pageno=2` တစ်ခုတည်း ပါဝင်နေပြီး အခြား Search Query Parameters များ (`price_min`, `category_id`) မပါဝင်သောကြောင့် ဖြစ်သည်။

### ✅ ဖြေရှင်းနည်း (Twig တွင် Query Parameters ထိန်းသိမ်းခြင်း):
Twig Template တွင် `app.request.query.all` ကို အသုံးပြု၍ လက်ရှိ URL Parameters အားလုံးကို Pagination Link များထဲသို့ ဆက်လက် သယ်ဆောင်သွားစေရပါမည်:

```twig
{# Resource/template/default/Product/list.twig #}

{# စုစုပေါင်း ကုန်ပစ္စည်း အရေအတွက် ပြသခြင်း #}
<div class="search-result-count mb-3">
    <span>全 {{ pagination.totalItemCount }} 件の商品</span>
    ( {{ pagination.itemNumberPerPage * (pagination.currentPageNumber - 1) + 1 }} ～ 
      {{ min(pagination.itemNumberPerPage * pagination.currentPageNumber, pagination.totalItemCount) }} 件を表示 )
</div>

{# Pagination Navigation Bar Render ပြုလုပ်ခြင်း #}
<div class="pagination-wrapper text-center my-4">
    {{ knp_pagination_render(pagination, '@KnpPaginator/Pagination/twitter_bootstrap_v4_pagination.html.twig', {}, {
        'query': app.request.query.all
    }) }}
</div>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **並び替え (Narabikae)**: Sorting
- **ページネーション (Peejineeshon)**: Pagination
- **全〇〇件 (Zen Maru-maru Ken)**: Total XX items
- **表示件数 (Hyouji Kensuu)**: Items per page (ဥပမာ 20件, 50件)
- **ページ番号 (Peeji Bangou)**: Page Number
- **条件保持 (Jouken Hoji)**: Preserving Search Conditions / Parameters
