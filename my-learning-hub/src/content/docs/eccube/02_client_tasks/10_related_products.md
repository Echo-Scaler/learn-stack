---
title: "10. Related Products"
description: "> 「商品詳細ページ（Product/detail）の下部に、現在見ている商品と同じカテゴリに属する『関連商品（おすすめ商品）』を最大4件、カルーセルまたはグリッド形式で表示してください。現在表示中の商品は除外してください。」"
---

## Task 10: 商品詳細に関連商品を表示してください (Related Products on Product Detail)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品詳細ページ（Product/detail）の下部に、現在見ている商品と同じカテゴリに属する『関連商品（おすすめ商品）』を最大4件、カルーセルまたはグリッド形式で表示してください。現在表示中の商品は除外してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပစ္စည်းအသေးစိတ်ကြည့်ရှုသည့် စာမျက်နှာ (Product Detail Page) ၏ အောက်ခြေတွင် လက်ရှိပစ္စည်းနှင့် အမျိုးအစားတူသော **"ဆက်စပ်ပစ္စည်းများ / အကြံပြုပစ္စည်းများ (Related Products)"** ကို လက်ရှိပစ္စည်းအား ဖယ်ထုတ်ပြီး ၄ ခု ပြသပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Cross-Selling & Average Order Value (客単価向上)
- E-commerce စနစ်များတွင် Related Products ပြသခြင်းသည် ဝယ်ယူသူများအား ဆက်စပ်ပစ္စည်းများ ထပ်မံဝယ်ယူစေရန် ဆွဲဆောင်နိုင်သည့် အရေးအကြီးဆုံး Marketing Feature ဖြစ်သည်။

### 2. EventSubscriber ဖြင့် Detail Controller ကို မထိခိုက်စေဘဲ Data Inject ပြုလုပ်ခြင်း
- Core Controller ဖြစ်သော `ProductController::detail` ကို Override မလုပ်ဘဲ `TemplateEvent` (`Product/detail.twig`) ကို အသုံးပြုခြင်းသည် Plugin စနစ်များနှင့် ချိတ်ဆက်ရာတွင် ပိုမို ခိုင်မာမှု (Decoupled & Maintainable) ရှိစေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Category တူညီသော ပစ္စည်းများကို ရှာဖွေသည့် Repository Method ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/ProductRelatedRepository.php`

```php
<?php

namespace Customize\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\Master\ProductStatus;
use Eccube\Entity\Product;

class ProductRelatedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * 同一カテゴリに属する公開中の関連商品を取得する（自身は除外）
     *
     * @param Product $currentProduct
     * @param int $limit
     * @return Product[]
     */
    public function getRelatedProducts(Product $currentProduct, int $limit = 4): array
    {
        // လက်ရှိ Product ၏ ပထမဆုံး Category ကို ရယူခြင်း
        $productCategories = $currentProduct->getProductCategories();
        if ($productCategories->isEmpty()) {
            return [];
        }

        $category = $productCategories->first()->getCategory();

        $qb = $this->createQueryBuilder('p')
            ->innerJoin('p.ProductCategories', 'pct')
            ->where('pct.Category = :category')
            ->andWhere('p.id != :currentId')
            ->andWhere('p.Status = :status')
            ->setParameter('category', $category)
            ->setParameter('currentId', $currentProduct->getId())
            ->setParameter('status', ProductStatus::DISPLAY_SHOW)
            ->orderBy('p.update_date', 'DESC')
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }
}
```

---

### အဆင့် ၂: EventSubscriber ဖြင့် Twig သို့ Data လက်ဆင့်ကမ်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/ProductDetailRelatedSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Customize\Repository\ProductRelatedRepository;
use Eccube\Entity\Product;
use Eccube\Event\TemplateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductDetailRelatedSubscriber implements EventSubscriberInterface
{
    private ProductRelatedRepository $relatedRepository;

    public function __construct(ProductRelatedRepository $relatedRepository)
    {
        $this->relatedRepository = $relatedRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'Product/detail.twig' => 'onProductDetail',
        ];
    }

    public function onProductDetail(TemplateEvent $event): void
    {
        $parameters = $event->getParameters();
        if (!isset($parameters['Product']) || !$parameters['Product'] instanceof Product) {
            return;
        }

        $currentProduct = $parameters['Product'];
        $relatedProducts = $this->relatedRepository->getRelatedProducts($currentProduct, 4);

        $parameters['relatedProducts'] = $relatedProducts;
        $event->setParameters($parameters);
    }
}
```

---

### အဆင့် ၃: Twig Template တွင် UI ဖော်ပြခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/detail.twig`

အောက်ခြေနေရာတွင် အောက်ပါ Card Grid ကို ထည့်သွင်းပါ:

```twig
{# 関連商品（おすすめ商品）セクション #}
{% if relatedProducts is defined and relatedProducts|length > 0 %}
    <div class="ec-relatedProducts mt-5 pt-4 border-top">
        <h3 class="text-center font-weight-bold mb-4">この商品を見ている人におすすめ（関連商品）</h3>
        <div class="row">
            {% for Related in relatedProducts %}
                <div class="col-6 col-md-3 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <a href="{{ url('product_detail', {'id': Related.id}) }}">
                            <img src="{{ asset(Related.main_list_image|no_image_product, 'save_image') }}" class="card-img-top" alt="{{ Related.name }}">
                        </a>
                        <div class="card-body p-2 text-center">
                            <p class="small text-truncate mb-1">
                                <a href="{{ url('product_detail', {'id': Related.id}) }}" class="text-dark">{{ Related.name }}</a>
                            </p>
                            <p class="font-weight-bold text-danger mb-0">
                                {{ Related.getPrice02IncTaxMin|price }}
                            </p>
                        </div>
                    </div>
                </div>
            {% endfor %}
        </div>
    </div>
{% endif %}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **စတော့မရှိသော ပစ္စည်းများ (SOLD OUT) ကို ဖယ်ထုတ်လိုပါက:**  
   Client တောင်းဆိုမှုအရ စတော့မရှိသော ပစ္စည်းများကို မပြသလိုပါက Repository Query တွင် `p.ProductClasses` ကို join ပြီး `stock > 0 OR stock_unlimited = 1` စစ်ဆေးပေးရပါမည်။
2. **Category မရှိသော ပစ္စည်းများ စစ်ဆေးခြင်း:**  
   `$currentProduct->getProductCategories()->isEmpty()` ကို ကြိုတင် စစ်ဆေးထားမှသာ Category မထည့်ထားသော Test Data များတွင် Page Error (Null Object) မတက်မည် ဖြစ်သည်။
