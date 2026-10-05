---
title: "02. Favorite Count"
description: "> 「商品一覧ページで、各商品が何人のユーザーからお気に入り（Wishlist）に追加されているか、お気に入り数（例: ❤️ 24）をバッジとして表示してください。」"
---

## Task 02: 商品一覧にお気に入り数を表示してください (Favorite Count Display)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品一覧ページで、各商品が何人のユーザーからお気に入り（Wishlist）に追加されているか、お気に入り数（例: ❤️ 24）をバッジとして表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Product List Page ရှိ ပစ္စည်းတစ်ခုချင်းစီတွင် အဆိုပါပစ္စည်းကို ဝယ်ယူသူများက Wishlist / Favorite ထဲသို့ မည်မျှအရေအတွက် ထည့်သွင်းထားသည် (Favorite Count) ကို ဖော်ပြပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. N+1 Query Problem ကို ကာကွယ်ရန် (Performance Optimization)
- တိုက်ရိုက် Twig ထဲတွင်ဖြစ်စေ၊ Loop တစ်ခုချင်းစီထဲတွင်ဖြစ်စေ `COUNT(favorite)` ကို ဆွဲထုတ်ပါက ပစ္စည်း အခု ၂၀ ပြသလျှင် SQL Query အကြိမ် ၂၀ ထပ်မံ ထွက်ပေါ်လာမည်ဖြစ်သည် (N+1 Query)။
- ၎င်းသည် Server Load အလွန်များစေပြီး Page Load Time ကို နှေးကွေးစေပါသည်။
- **အဖြေ:** QueryBuilder ဖြင့် Product ID များကို အခြေခံကာ `GROUP BY` သုံးပြီး **တစ်ခုတည်းသော SQL Query (Single Batch Query)** ဖြင့် Favorite Count အားလုံးကို တစ်ပြိုင်နက် ဆွဲယူရမည်။

### 2. Repository Pattern ကို အသုံးပြုရသည့် အကြောင်းပြချက်
- Database Data Access Logic (Aggregation / COUNT) များကို Controller ထဲတွင် တိုက်ရိုက်မရေးဘဲ `CustomerFavoriteProductRepository` သို့မဟုတ် `ProductRepository` ထဲတွင် Method တစ်ခု သီးသန့် ခွဲထုတ်ရေးသားခြင်းသည် Maintenance ကောင်းမွန်စေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Repository တွင် Favorite Counts Batch Query ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/CustomerFavoriteProductCustomRepository.php` (သို့မဟုတ် Plugin Repository)

```php
<?php

namespace Customize\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\CustomerFavoriteProduct;

class CustomerFavoriteProductCustomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CustomerFavoriteProduct::class);
    }

    /**
     * 指定された複数のProduct IDに対するお気に入り数を一括取得する
     *
     * @param array $productIds
     * @return array [productId => count]
     */
    public function getFavoriteCountsByProductIds(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        $qb = $this->createQueryBuilder('cfp')
            ->select('IDENTITY(cfp.Product) AS product_id, COUNT(cfp.id) AS fav_count')
            ->where('cfp.Product IN (:productIds)')
            ->setParameter('productIds', $productIds)
            ->groupBy('cfp.Product');

        $results = $qb->getQuery()->getArrayResult();

        // [productId => favCount] ပုံစံ Map ပြောင်းလဲခြင်း
        $counts = [];
        foreach ($results as $row) {
            $counts[$row['product_id']] = (int) $row['fav_count'];
        }

        return $counts;
    }
}
```

---

### အဆင့် ၂: EventSubscriber ဖြင့် Controller မထိဘဲ Twig သို့ Data ပို့ဆောင်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/ProductListFavoriteCountSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Customize\Repository\CustomerFavoriteProductCustomRepository;
use Eccube\Event\TemplateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductListFavoriteCountSubscriber implements EventSubscriberInterface
{
    private CustomerFavoriteProductCustomRepository $favRepository;

    public function __construct(CustomerFavoriteProductCustomRepository $favRepository)
    {
        $this->favRepository = $favRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'Product/list.twig' => 'onProductListTemplate',
        ];
    }

    public function onProductListTemplate(TemplateEvent $event): void
    {
        $parameters = $event->getParameters();
        if (!isset($parameters['pagination'])) {
            return;
        }

        // လက်ရှိ Page တွင် ပြသနေသော Product များ၏ ID များကို စုစည်းခြင်း
        $productIds = [];
        foreach ($parameters['pagination'] as $product) {
            $productIds[] = $product->getId();
        }

        // အကြိမ် ၂၀ Query မထွက်စေဘဲ ၁ ကြိမ်တည်းဖြင့် Count အားလုံး ယူဆောင်ခြင်း
        $favoriteCounts = $this->favRepository->getFavoriteCountsByProductIds($productIds);

        // Twig ထံသို့ Parameter အသစ်အဖြစ် လက်ဆင့်ကမ်း ပေးပို့ခြင်း
        $parameters['favoriteCounts'] = $favoriteCounts;
        $event->setParameters($parameters);
    }
}
```

---

### အဆင့် ၃: Twig Template တွင် ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

```twig
{# お気に入り数表示バッジ #}
<div class="ec-productRole__favoriteCount my-1">
    {% set favCount = favoriteCounts[Product.id]|default(0) %}
    <span class="badge badge-light border text-danger">
        <i class="fas fa-heart text-danger"></i> {{ favCount }}
    </span>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Lazy Loading ရှောင်ကြဉ်ရန်:**  
   Twig ထဲတွင် `{{ Product.CustomerFavoriteProducts|length }}` ဟု တိုက်ရိုက် မရေးရပါ။ အကယ်၍ ပစ္စည်း ၂၀ ရှိပါက Database သို့ Query ၂၀ သွားရောက် မေးမြန်းသဖြင့် Production တွင် အလွန်လေးလံသွားပါမည်။
2. **Cache ပိုင်းဆိုင်ရာ သတိပြုရန်:**  
   Favorite Count သည် Real-time ပြောင်းလဲနေသော အချက်အလက်ဖြစ်သဖြင့် HTTP Full Page Cache (Varnish/Reverse Proxy) သုံးထားပါက Dynamic Ajax Call ဖြင့် ပြသရန် တောင်းဆိုလေ့ရှိပါသည်။
