---
title: "02. Search And Filter Conditions"
description: "> Client Requirements:"
---

## 02 - Search & Filter Conditions (ရှာဖွေခြင်းနှင့် စစ်ထုတ်ခြင်း စည်းမျဉ်းများ)

> **Client Requirements**:
> 1. **Keyword search**: ကုန်ပစ္စည်း အမည်၊ အကြောင်းအရာ၊ Keyword များဖြင့် ရှာဖွေနိုင်ရမည်။ စကားလုံး အများအပြား (ဥပမာ- "Nike Black") ရိုက်ရှာပါက နှစ်မျိုးစလုံး ပါဝင်သော ပစ္စည်းများ ထွက်လာရမည် (AND Search)။
> 2. **Category filter**: ပင်မ Category (ဥပမာ- Mens) ကို ရွေးလိုက်ပါက ၎င်းအောက်ရှိ လက်အောက်ခံ Category များ (Mens > Shirts, Mens > Pants) ထဲမှ ပစ္စည်းများပါ အလိုအလျောက် ပါဝင်လာရမည်။
> 3. **Price range**: အနိမ့်ဆုံး စျေးနှုန်းမှ အမြင့်ဆုံး စျေးနှုန်းကြား စစ်ထုတ်နိုင်ရမည်။
> 4. **Brand / Tag filter**: သတ်မှတ်ထားသော Brand သို့မဟုတ် Tag (ဥပမာ- "Made in Japan", "Sale") ဖြင့် စစ်ထုတ်နိုင်ရမည်။
> 5. **Stock filter**: ပစ္စည်းပြတ်နေသော ပစ္စည်းများကို ဖယ်ထုတ်ပြီး လက်ကျန်ရှိသော ပစ္စည်းများသာ ပြသနိုင်ရမည် (在庫ありのみ)။
> 6. **Product code search**: ဂိုဒေါင်သုံး SKU Code ဖြင့် တိုက်ရိုက် ရိုက်ရှာနိုင်ရမည်။
> 7. **Multiple conditions**: အထက်ပါ စည်းမျဉ်းများ အားလုံးကို တစ်ပြိုင်နက် ပေါင်းစပ် စစ်ထုတ်နိုင်ရမည်။

---

## 🏛️ Central Search Architecture: `ProductRepository::getQueryBuilderBySearchData`

EC-CUBE တွင် အထက်ပါ ရှာဖွေမှု အားလုံးကို **`src/Eccube/Repository/ProductRepository.php`** ရှိ `getQueryBuilderBySearchData()` Method တစ်ခုတည်းက Dynamic အနေဖြင့် စုစည်း တည်ဆောက်ပေးပါသည်:

```php
namespace Eccube\Repository;

use Eccube\Entity\Master\ProductStatus;
use Doctrine\ORM\QueryBuilder;

class ProductRepository extends AbstractRepository
{
    public function getQueryBuilderBySearchData($searchData): QueryBuilder
    {
        $qb = $this->createQueryBuilder('p')
            ->innerJoin('p.ProductClasses', 'pc')
            ->leftJoin('pc.ProductStock', 'ps');

        // မဖြစ်မနေ စည်းမျဉ်း: ဝဘ်ဆိုက်ပေါ်တွင် ပြသထားသော (公開) ပစ္စည်းများသာ
        $qb->where('p.Status = :status')
           ->setParameter('status', ProductStatus::STATUS_DISPLAY_SHOW);

        // ၁။ Keyword Search (နာမည်၊ Keyword၊ SKU Code စုံလင်စွာ ရှာဖွေခြင်း)
        $this->buildKeywordCondition($qb, $searchData);

        // ၂။ Category Filter (လက်အောက်ခံ Category များပါ အလိုအလျောက် ပါဝင်စေခြင်း)
        $this->buildCategoryCondition($qb, $searchData);

        // ၃။ Price Range Filter (အနိမ့်ဆုံး / အမြင့်ဆုံး စျေးနှုန်း)
        $this->buildPriceCondition($qb, $searchData);

        // ၄။ Stock Filter (လက်ကျန်ရှိသည်များသာ ပြသခြင်း)
        $this->buildStockCondition($qb, $searchData);

        // ၅။ Brand / Tag Filter (တဂ်များဖြင့် စစ်ထုတ်ခြင်း)
        $this->buildTagCondition($qb, $searchData);

        // ၆။ အစီအစဉ် ချထားမှု (Sorting)
        $this->buildOrderBy($qb, $searchData);

        return $qb;
    }
}
```

---

## 🔍 စည်းမျဉ်းတစ်ခုချင်းစီ၏ အသေးစိတ် Logic များ

### ၁။ Keyword Search (Multi-word AND Logic)
Customer က စကားလုံး ၂ လုံးကြား Space ခြားရှာဖွေပါက စကားလုံးအားလုံး ပါဝင်သော ပစ္စည်းများကို ရှာဖွေပေးပါသည်:

```php
private function buildKeywordCondition(QueryBuilder $qb, array $searchData): void
{
    if (!empty($searchData['name'])) {
        // ဂျပန်စာလုံး အပြည့်/အဝက် Space များကို ခွဲခြမ်းခြင်း
        $keywords = preg_split('/[\s　]+/u', $searchData['name'], -1, PREG_SPLIT_NO_EMPTY);

        foreach ($keywords as $index => $keyword) {
            $param = 'keyword_'.$index;
            $qb->andWhere($qb->expr()->orX(
                $qb->expr()->like('p.name', ':'.$param),
                $qb->expr()->like('p.search_word', ':'.$param),
                $qb->expr()->like('p.description_detail', ':'.$param),
                $qb->expr()->like('pc.code', ':'.$param) // SKU Code ပါ ရှာပေးခြင်း
            ))->setParameter($param, '%'.$keyword.'%');
        }
    }
}
```

---

### ၂။ Category Filter (Hierarchical Recursive Search)
ပင်မ Category တစ်ခုကို ရွေးလိုက်ပါက ၎င်း၏ အောက်ရှိ Sub-categories အားလုံးကို `IN (:categoryIds)` ဖြင့် ရှာဖွေပါသည်:

```php
private function buildCategoryCondition(QueryBuilder $qb, array $searchData): void
{
    if (!empty($searchData['category_id'])) {
        $Category = $searchData['category_id'];
        
        // မိခင် Category အောက်ရှိ သားသမီး Category ID များကို စုစည်းခြင်း
        $categoryIds = [$Category->getId()];
        foreach ($Category->getChildren() as $Child) {
            $categoryIds[] = $Child->getId();
        }

        $qb->innerJoin('p.ProductCategories', 'pct')
           ->andWhere($qb->expr()->in('pct.category_id', ':categoryIds'))
           ->setParameter('categoryIds', $categoryIds);
    }
}
```

---

### ၃။ Price Range Filter (စျေးနှုန်း အပိုင်းအခြား)
```php
private function buildPriceCondition(QueryBuilder $qb, array $searchData): void
{
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
}
```

---

### ၄။ Stock Filter (လက်ကျန်ရှိသော ပစ္စည်းများသာ ပြသခြင်း)
```php
private function buildStockCondition(QueryBuilder $qb, array $searchData): void
{
    if (!empty($searchData['in_stock_only'])) {
        // စတော့ အကန့်အသတ်မရှိ (stock_unlimited = 1) သို့မဟုတ် လက်ကျန် > 0
        $qb->andWhere($qb->expr()->orX(
            'pc.stock_unlimited = 1',
            'ps.stock > 0'
        ));
    }
}
```

---

### ၅။ Brand / Tag Filter (တဂ်ဖြင့် စစ်ထုတ်ခြင်း)
```php
private function buildTagCondition(QueryBuilder $qb, array $searchData): void
{
    if (!empty($searchData['tag_id'])) {
        $qb->innerJoin('p.ProductTag', 'pt')
           ->andWhere('pt.Tag = :tag_id')
           ->setParameter('tag_id', $searchData['tag_id']);
    }
}
```

---

## ⚡ 6. Multiple Conditions (ပေါင်းစပ် စစ်ထုတ်ခြင်း စွမ်းအား)

Customer က အောက်ပါအတိုင်း တစ်ပြိုင်နက် ရွေးချယ်လိုက်ပါက:
- Category: "Fashion"
- Keyword: "Shirt"
- Price: "¥2,000 ～ ¥5,000"
- Stock: "In-Stock Only"

QueryBuilder သည် `AND` အဆက်အစပ်များဖြင့် အလိုအလျောက် သန့်စင်ပြီး အတိကျဆုံး ရလဒ်များကို မြန်ဆန်စွာ ဆွဲထုတ်ပေးနိုင်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **複合条件検索 (Fukugou Jouken Kensaku)**: Multiple Condition Search
- **部分一致 (Bubun Itchi)**: Partial Match (`LIKE '%...%'`)
- **完全一致 (Kanzen Itchi)**: Exact Match (`= '...'`)
- **下位カテゴリを含める (Kai Kategori wo Fukumeru)**: Include Sub-categories
- **在庫あり (Zaiko Ari)**: In Stock
