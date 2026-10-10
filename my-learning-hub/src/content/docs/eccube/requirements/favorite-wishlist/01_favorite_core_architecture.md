---
title: "01. Favorite Core Architecture"
description: "> Practical Example Requirement (လက်တွေ့ စံပြ လေ့လာမှု):"
---

## 01 - Favorite Core Architecture:「お気に入り登録されている商品に印を表示する」

> **Practical Example Requirement (လက်တွေ့ စံပြ လေ့လာမှု)**:  
> **「お気に入り登録されている商品に印を表示する」**  
> (Customer တစ်ဦးသည် Product List သို့မဟုတ် Detail စာမျက်နှာသို့ ရောက်ရှိလာသည့်အခါ မိမိ အကြိုက်ဆုံး မှတ်ထားပြီးသော ကုန်ပစ္စည်းများပေါ်တွင် အနီရောင် အသည်းပုံ အမှတ်အသား ❤️ ပြသပေးပြီး၊ မမှတ်ရသေးသော ပစ္စည်းများတွင် အဖြူရောင် အသည်းပုံ 🤍 ပြသပေးရန်။)

အဆိုပါ Requirement တစ်ခုလုံးကို **Requirement ➔ Database ➔ Entity ➔ Repository ➔ QueryBuilder ➔ Controller ➔ Twig** ဟူသော နည်းပညာ အဆင့် ၇ ဆင့်ဖြင့် အစအဆုံး အကောင်အထည်ဖော် တည်ဆောက်ပြပါမည်။

---

## 📌 အဆင့် ၁: Requirement (လိုအပ်ချက် ခွဲခြမ်းစိတ်ဖြာခြင်း)

- **User State**: Customer သည် Login ဝင်ထားသူ (`ROLE_USER`) ဖြစ်ရမည် (Login မဝင်ထားပါက အမှတ်အသား မပြပါ)။
- **Display**: ကုန်ပစ္စည်း ကတ်ပြား (Product Card) ၏ ထိပ်ထောင့်တွင် အသည်းပုံ Badge ပေါ်ရမည်။
- **Condition**: အကယ်၍ Login ဝင်ထားသော Customer ၏ Favorite ထဲတွင် ထို ကုန်ပစ္စည်း ID ပါဝင်နေပါက `active (❤️)` ဖြစ်ပြီး၊ မပါဝင်ပါက `inactive (🤍)` ဖြစ်ရမည်။

---

## 🗄️ အဆင့် ၂: Database (ဒေတာဘေ့စ် ဇယား)

EC-CUBE တွင် `dtb_customer_favorite_product` ဟူသော Join Table တွင် သိမ်းဆည်းထားပါသည်:

```sql
-- Database Schema
CREATE TABLE dtb_customer_favorite_product (
    customer_id INT NOT NULL,  -- Customer ID (FK -> dtb_customer.id)
    product_id INT NOT NULL,   -- Product ID (FK -> dtb_product.id)
    create_date DATETIME NOT NULL,
    update_date DATETIME NOT NULL,
    discriminator_type VARCHAR(255) NOT NULL,
    PRIMARY KEY (customer_id, product_id)
);
```

---

## 🏛️ အဆင့် ၃: Entity (ဒိုမိန်း မော်ဒယ်လ်)

`src/Eccube/Entity/CustomerFavoriteProduct.php` တွင် Doctrine ORM Mapping ဖြင့် ဖွဲ့စည်းထားပါသည်:

```php
namespace Eccube\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'dtb_customer_favorite_product')]
#[ORM\Entity(repositoryClass: 'Eccube\Repository\CustomerFavoriteProductRepository')]
class CustomerFavoriteProduct extends AbstractEntity
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: 'Eccube\Entity\Customer', inversedBy: 'CustomerFavoriteProducts')]
    #[ORM\JoinColumn(name: 'customer_id', referencedColumnName: 'id', nullable: false)]
    private Customer $Customer;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: 'Eccube\Entity\Product')]
    #[ORM\JoinColumn(name: 'product_id', referencedColumnName: 'id', nullable: false)]
    private Product $Product;

    // Getter & Setter methods...
    public function getCustomer(): Customer { return $this->Customer; }
    public function setCustomer(Customer $Customer): self { $this->Customer = $Customer; return $this; }
    public function getProduct(): Product { return $this->Product; }
    public function setProduct(Product $Product): self { $this->Product = $Product; return $this; }
}
```

---

## 🔍 အဆင့် ၄ & ၅: Repository & QueryBuilder (ထိရောက်သော ရှာဖွေမှု)

Beginner များ အမှားများဆုံး အချက်မှာ Loop ပတ်ပြီး ကုန်ပစ္စည်းတစ်ခုချင်းစီ Favorite ဟုတ်မဟုတ် DB သွားမေးခြင်း ဖြစ်သည်။  
**မှန်ကန်သော နည်းလမ်း**: Repository တွင် လက်ရှိ စာမျက်နှာရှိ ကုန်ပစ္စည်း ID များအားလုံးထဲမှ Customer မှတ်ထားသော ID များကို Single Query ဖြင့် ဆွဲထုတ်ပေးသော Method ရေးသားရပါမည်:

`src/Eccube/Repository/CustomerFavoriteProductRepository.php`
```php
namespace Eccube\Repository;

use Eccube\Entity\Customer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\CustomerFavoriteProduct;

class CustomerFavoriteProductRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CustomerFavoriteProduct::class);
    }

    /**
     * အဆိုပါ Customer မှတ်ထားသော Product ID များကို Array အဖြစ် တစ်ကြိမ်တည်း ဆွဲထုတ်ခြင်း
     * 
     * @return int[] ကုန်ပစ္စည်း ID များ Array (e.g. [5, 12, 18])
     */
    public function getFavoriteProductIdsByCustomer(Customer $Customer, array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        // QueryBuilder တည်ဆောက်ခြင်း
        $qb = $this->createQueryBuilder('cfp')
            ->select('p.id')
            ->innerJoin('cfp.Product', 'p')
            ->where('cfp.Customer = :Customer')
            ->andWhere('p.id IN (:productIds)')
            ->setParameter('Customer', $Customer)
            ->setParameter('productIds', $productIds);

        $results = $qb->getQuery()->getScalarResult();

        // [ ['id' => 5], ['id' => 12] ] မှ [ 5, 12 ] သို့ Flatten ပြုလုပ်ခြင်း
        return array_column($results, 'id');
    }
}
```

---

## 🎮 အဆင့် ၆: Controller (စီးပွားရေး လုပ်ငန်းစဉ် ချိတ်ဆက်ခြင်း)

Product List စာမျက်နှာကို တာဝန်ယူသော Controller တွင် Favorite ID စာရင်းကို ဆွဲထုတ်ပြီး Twig Template သို့ ပို့ပေးပါသည်:

`src/Eccube/Controller/ProductController.php`
```php
#[Route('/products/list', name: 'product_list')]
public function index(Request $request)
{
    // ၁။ ရှာဖွေထားသော ကုန်ပစ္စည်းများကို Pagination ဖြင့် ဆွဲထုတ်ခြင်း
    $pagination = $this->paginator->paginate(
        $this->productRepository->getQueryBuilderBySearchData($searchData),
        $page_no,
        $page_count
    );

    $favoriteProductIds = [];

    // ၂။ Customer သည် Login ဝင်ထားသူ ဖြစ်ပါက
    if ($this->isGranted('ROLE_USER')) {
        /** @var Customer $Customer */
        $Customer = $this->getUser();

        // စာမျက်နှာတွင် ပြသမည့် ကုန်ပစ္စည်း ID များကို စုစည်းခြင်း
        $productIds = [];
        foreach ($pagination as $Product) {
            $productIds[] = $Product->getId();
        }

        // ၃။ Repository မှတဆင့် Favorite ဖြစ်နေသော ID များကို တစ်ကြိမ်တည်း ဆွဲထုတ်ခြင်း
        $favoriteProductIds = $this->customerFavoriteProductRepository
            ->getFavoriteProductIdsByCustomer($Customer, $productIds);
    }

    // ၄။ Twig သို့ Data များ ပို့ဆောင်ခြင်း
    return [
        'pagination' => $pagination,
        'favoriteProductIds' => $favoriteProductIds, // [5, 12, 18]
    ];
}
```

---

## 🎨 အဆင့် ၇: Twig (မျက်နှာပြင်တွင် အမှတ်အသား ပြသခြင်း)

Twig Template ထဲတွင် `in` Operator ကို အသုံးပြု၍ ကုန်ပစ္စည်း ID သည် `favoriteProductIds` ထဲတွင် ပါမပါ စစ်ဆေးပြီး အသည်းပုံ အနီ သို့မဟုတ် အဖြူ ပြသပါသည်:

`src/Eccube/Resource/template/default/Product/list.twig`
```twig
{# ကုန်ပစ္စည်း ကတ်ပြားအတွင်း #}
<div class="product-card position-relative">

    {# အကြိုက်ဆုံး အမှတ်အသား အသည်းပုံ Badge #}
    {% if is_granted('ROLE_USER') %}
        <div class="favorite-mark position-absolute" style="top: 10px; right: 10px; z-index: 10;">
            {% if Product.id in favoriteProductIds %}
                {# Favorite မှတ်ထားပြီးပါက အနီရောင် အသည်းပုံ ပြသခြင်း #}
                <span class="badge badge-light shadow-sm p-2 text-danger" title="お気に入り登録済み">
                    <i class="fa fa-heart fa-lg"></i>
                </span>
            {% else %}
                {# Favorite မမှတ်ရသေးပါက အဖြူရောင် အသည်းပုံ အနားလိုင်း ပြသခြင်း #}
                <span class="badge badge-light shadow-sm p-2 text-muted" title="お気に入り未登録">
                    <i class="fa fa-heart-o fa-lg"></i>
                </span>
            {% endif %}
        </div>
    {% endif %}

    {# ကုန်ပစ္စည်း ပုံနှင့် အချက်အလက်များ #}
    <a href="{{ url('product_detail', {id: Product.id}) }}">
        <img src="{{ asset(Product.main_list_image, 'save_image') }}" alt="{{ Product.name }}">
        <h6>{{ Product.name }}</h6>
        <p class="text-danger font-weight-bold">{{ Product.price02IncTaxMin|number_format }} 円</p>
    </a>
</div>
```

---

## 💡 အချုပ် အနှစ်ချုပ် (Summary)

ဤနည်းလမ်းအတိုင်း ရေးသားခြင်းအားဖြင့်:
1. **Clean Architecture**: Database မှ စတင်ပြီး Entity, Repository, Controller, Twig အထိ တာဝန်များကို စနစ်တကျ ခွဲဝေထားပါသည်။
2. **High Performance**: ကုန်ပစ္စည်း အခု ၁၀၀ ရှိစေကာမူ Database သို့ Query ၁ ကြိမ်သာ သွားရောက်မေးမြန်းသဖြင့် Website တုံ့ပြန်မှု အလွန် လျင်မြန်ပါသည်။
