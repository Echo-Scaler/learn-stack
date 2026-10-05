---
title: "11. Product Marketing"
description: "> Client Requirements:"
---

## 11 - Product Marketing (Ranking, Recommended & New Products)

> **Client Requirements**:
> 1. **Product ranking (အရောင်းရဆုံး အဆင့်သတ်မှတ်ချက်)**: ဝဘ်ဆိုက်၏ Home Page တွင် အရောင်းရဆုံး ကုန်ပစ္စည်းများကို No.1, No.2, No.3 Gold/Silver/Bronze Badge များဖြင့် ပြသပေးရမည်။
> 2. **Recommended products (အကြံပြု ကုန်ပစ္စည်းများ)**: ဆိုင်ပိုင်ရှင်က အထူးရောင်းချလိုသော ကုန်ပစ္စည်းများ သို့မဟုတ် ဆက်စပ်ပစ္စည်းများ (Cross-selling) ကို "おすすめ商品" အဖြစ် သတ်မှတ်ပြသလိုခြင်း။
> 3. **New products (ကုန်ပစ္စည်းအသစ်များ)**: အသစ်ရောက်ရှိလာသော ပစ္စည်းများ (New Arrivals) ကို "新着商品" အဖြစ် Website တွင် အလိုအလျောက် သီးသန့် ထုတ်ပြပေးရမည်။

---

## 🏛️ EC-CUBE Layout & Block System Architecture

EC-CUBE တွင် အဆိုပါ Marketing Features များကို **Block System (ブロック管理)** နှင့် **Page Layout System (レイアウト管理)** ကို အသုံးပြု၍ အကောင်အထည်ဖော်ပါသည်:

```
[Top Page (index.twig)]
├── [Header Block]
├── [Main Visual Carousel]
├── [New Products Block (新着商品)] ── Query: ORDER BY create_date DESC
├── [Recommend Products Block (おすすめ商品)] ── Admin Curated List
├── [Ranking Products Block (ランキング)] ── Aggregated from Order History
└── [Footer Block]
```

---

## 13. 🏆 Product Ranking (အရောင်းရဆုံး Ranking စနစ်)

### အလုပ်လုပ်ပုံ Logic:
အရောင်းရဆုံး စာရင်းကို ရယူရန်အတွက် ပြီးစီးသွားသော Order များ (`dtb_order` နှင့် `dtb_order_item`) ထဲမှ အရေအတွက် အများဆုံး ရောင်းချရသော ကုန်ပစ္စည်းများကို စုစည်းတွက်ချက် (Aggregate) ရပါသည်:

```php
// Custom Service / Repository Query
public function getBestSellingProducts(int $limit = 5): array
{
    $qb = $this->entityManager->createQueryBuilder();

    $qb->select('p as product, SUM(oi.quantity) as total_sales')
        ->from('Eccube\Entity\Product', 'p')
        ->innerJoin('p.ProductClasses', 'pc')
        ->innerJoin('Eccube\Entity\OrderItem', 'oi', 'WITH', 'oi.ProductClass = pc')
        ->innerJoin('oi.Order', 'o')
        ->where('o.OrderStatus = :status') // အမှန်တကယ် ငွေချေပြီးစီးသော အော်ဒါများ
        ->setParameter('status', OrderStatus::ORDER_DELIVERED)
        ->andWhere('p.Status = :product_status') // လက်ရှိ ပြသထားသော ပစ္စည်းများ
        ->setParameter('product_status', ProductStatus::STATUS_DISPLAY_SHOW)
        ->groupBy('p.id')
        ->orderBy('total_sales', 'DESC')
        ->setMaxResults($limit);

    return $qb->getQuery()->getResult();
}
```

> ⚡ **Performance Tip**:  
> လူဝင်များသော E-Commerce ဝဘ်ဆိုက်များတွင် Home Page ဖွင့်တိုင်း Order Table ကြီးကို `SUM()` ဖြင့် တွက်ပါက Database နှေးကွေးနိုင်ပါသည်။ ထို့ကြောင့် Ranking ကို **Cron Job (Scheduled Task)** ဖြင့် ညဘက်တွင် တစ်ကြိမ်သာ တွက်ချက်၍ Cache သိမ်းထားသည့် နည်းလမ်းကို အသုံးပြုကြပါသည်။

---

## 14. 🌟 Recommended Products (အကြံပြု ကုန်ပစ္စည်းများ)

### အလုပ်လုပ်ပုံ Logic:
ဆိုင်ရှင် အကြိုက်ရွေးချယ်ထားသော ကုန်ပစ္စည်းများကို ပြသရန်အတွက် EC-CUBE တွင် အများအားဖြင့် **Recommend Plugin (おすすめ商品プラグイン)** ကို တပ်ဆင်အသုံးပြုကြသည် သို့မဟုတ် Admin မှ ကုန်ပစ္စည်း ID များကို Block ထဲတွင် ထည့်သွင်းသတ်မှတ်ကြပါသည်:

### Twig Template နမူနာ (`Block/recommend_product.twig`):
```twig
<div class="ec-role">
    <div class="ec-secHeading">
        <span class="ec-secHeading__en">RECOMMEND</span>
        <h2 class="ec-secHeading__ja">おすすめ商品</h2>
    </div>
    <div class="row">
        {% for RecommendProduct in RecommendProducts %}
            {% set Product = RecommendProduct.Product %}
            <div class="col-6 col-md-3 mb-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <a href="{{ url('product_detail', {id: Product.id}) }}">
                        <img src="{{ asset(Product.main_list_image, 'save_image') }}" class="card-img-top" alt="{{ Product.name }}">
                    </a>
                    <div class="card-body p-2">
                        <h6 class="card-title text-truncate">{{ Product.name }}</h6>
                        <p class="text-danger font-weight-bold mb-0">{{ Product.price02IncTaxMin|number_format }} 円</p>
                    </div>
                </div>
            </div>
        {% endfor %}
    </div>
</div>
```

---

## 15. 🆕 New Products (ကုန်ပစ္စည်းအသစ်များ - New Arrivals)

### အလုပ်လုပ်ပုံ Logic:
ကုန်ပစ္စည်း အသစ်များကို ဖော်ပြရန်အတွက် `dtb_product.create_date` (ထည့်သွင်းသည့် ရက်စွဲ) အပေါ် အခြေခံ၍ နောက်ဆုံးရက်စွဲများကို ယူဆောင်ပြသပါသည်:

```php
// ProductRepository::getQueryBuilderBySearchData() သို့မဟုတ် Custom Query
public function getNewArrivalProducts(int $limit = 8): array
{
    return $this->createQueryBuilder('p')
        ->andWhere('p.Status = :status')
        ->setParameter('status', ProductStatus::STATUS_DISPLAY_SHOW) // 公開 Status
        ->orderBy('p.create_date', 'DESC') // အသစ်ဆုံး ပစ္စည်းများကို အရင်ပြသခြင်း
        ->setMaxResults($limit)
        ->getQuery()
        ->getResult();
}
```

### Twig တွင် "NEW" Badge ပြသခြင်း:
ရက်ပေါင်း ၇ ရက်အတွင်း ထည့်ထားသော ပစ္စည်းများအား "NEW" Badge အလိုအလျောက် ပြသရန်:

```twig
{# ယနေ့ရက်စွဲနှင့် create_date နှိုင်းယှဉ်ခြင်း #}
{% set isNew = date(Product.create_date) > date('-7days') %}

{% if isNew %}
    <span class="badge badge-warning position-absolute" style="top: 10px; left: 10px;">
        NEW ARRIVAL
    </span>
{% endif %}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **ランキング (Rankingu)**: Product Ranking (အရောင်းရဆုံး အဆင့်သတ်မှတ်ချက်)
- **おすすめ商品 (Osusume Shouhin)**: Recommended Products (အကြံပြု ကုန်ပစ္စည်းများ)
- **新着商品 (Shinchaku Shouhin)**: New Arrival Products (ကုန်ပစ္စည်း အသစ်များ)
- **関連商品 (Kanren Shouhin)**: Related Products (ဆက်စပ် ကုန်ပစ္စည်းများ)
- **ブロック管理 (Burokku Kanri)**: Block Management (ဝဘ်ဆိုက် အစိတ်အပိုင်းများ စီမံခြင်း)
