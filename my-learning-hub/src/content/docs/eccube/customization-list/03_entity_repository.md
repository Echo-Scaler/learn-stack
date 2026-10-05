---
title: "03. Entity Repository"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 03 - Entity နှင့် Repository Customize လုပ်နည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube ၏ Entity (ဒေတာဘေ့စ် Table) ကို မပြောင်းဘဲ Column အသစ်ထည့်ခြင်း နှင့် Repository ဖြင့် Query ကိုယ်တိုင် ရေးနည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Customer Entity တွင် column အသစ် ထည့်တတ်ရန်
- Repository မှတဆင့် ကိုယ်ပိုင် Query ရေးတတ်ရန်
- Doctrine Migration ကို မှန်ကန်စွာ လုပ်တတ်ရန်

---

## 📌 EC-Cube Entity Structure

```
src/Eccube/Entity/
├── Customer.php          ← Customer table
├── Order.php             ← Order table
├── Product.php           ← Product table
├── ProductClass.php      ← Product variant table
├── Cart.php              ← Cart table
└── ...

app/Plugin/MyPlugin/Entity/
└── CustomerTrait.php     ← Customer ကို extend ပြုလုပ်ရာနေရာ
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - CustomerTrait ဖြင့် Column ထပ်ထည့်ခြင်း

Core Entity ကို မပြောင်းဘဲ **Trait** ကို အသုံးပြု၍ Column ထပ်ထည့်နည်း:

`app/Plugin/MyPlugin/Entity/CustomerTrait.php`

```php
<?php

namespace Plugin\MyPlugin\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Customer")
 */
trait CustomerTrait
{
    /**
     * Customer ၏ Nickname column ထည့်ခြင်း
     * 
     * @ORM\Column(name="plg_nickname", type="string", length=255, nullable=true)
     */
    private ?string $plg_nickname = null;

    /**
     * Birthday Year column ထည့်ခြင်း
     * 
     * @ORM\Column(name="plg_birth_year", type="integer", nullable=true)
     */
    private ?int $plg_birth_year = null;

    // --- Getter & Setter ---

    public function getPlgNickname(): ?string
    {
        return $this->plg_nickname;
    }

    public function setPlgNickname(?string $plg_nickname): static
    {
        $this->plg_nickname = $plg_nickname;
        return $this;
    }

    public function getPlgBirthYear(): ?int
    {
        return $this->plg_birth_year;
    }

    public function setPlgBirthYear(?int $plg_birth_year): static
    {
        $this->plg_birth_year = $plg_birth_year;
        return $this;
    }
}
```

---

### အဆင့် 2 - Product Entity ကို Extend ပြုလုပ်ခြင်း

`app/Plugin/MyPlugin/Entity/ProductTrait.php`

```php
<?php

namespace Plugin\MyPlugin\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductTrait
{
    /**
     * Product ကို YouTube Video link ထည့်ခြင်း
     * 
     * @ORM\Column(name="plg_youtube_url", type="text", nullable=true)
     */
    private ?string $plg_youtube_url = null;

    /**
     * Product ၏ Weight (ကိုယ်ပိုင် column)
     * 
     * @ORM\Column(name="plg_weight_kg", type="decimal", precision=8, scale=3, nullable=true)
     */
    private ?string $plg_weight_kg = null;

    public function getPlgYoutubeUrl(): ?string
    {
        return $this->plg_youtube_url;
    }

    public function setPlgYoutubeUrl(?string $url): static
    {
        $this->plg_youtube_url = $url;
        return $this;
    }

    public function getPlgWeightKg(): ?string
    {
        return $this->plg_weight_kg;
    }

    public function setPlgWeightKg(?string $weight): static
    {
        $this->plg_weight_kg = $weight;
        return $this;
    }
}
```

---

### အဆင့် 3 - Database Migration ပြုလုပ်ခြင်း

Column ထည့်ပြီးနောက် Database ကို Update လုပ်ရမည်:

```bash
# Migration ဖိုင် auto-generate ပြုလုပ်ခြင်း
bin/console doctrine:migrations:diff

# Migration ကို run ပြုလုပ်ခြင်း (Column ကို ဒေတာဘေ့စ်တွင် ထည့်မည်)
bin/console doctrine:migrations:migrate

# ဒေတာဘေ့စ် schema စစ်ဆေးခြင်း
bin/console doctrine:schema:validate
```

---

### အဆင့် 4 - ကိုယ်ပိုင် Repository တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Repository/CustomerRepository.php`

```php
<?php

namespace Plugin\MyPlugin\Repository;

use Eccube\Entity\Customer;
use Eccube\Repository\AbstractRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class CustomerRepository extends AbstractRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Customer::class);
    }

    /**
     * Nickname ဖြင့် Customer ရှာဖွေခြင်း
     */
    public function findByNickname(string $nickname): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.plg_nickname = :nickname')
            ->setParameter('nickname', $nickname)
            ->getQuery()
            ->getResult();
    }

    /**
     * လတ်တလော Register ဝင်သော Customer များ ရယူခြင်း
     */
    public function findRecentCustomers(int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.Status = :status')
            ->setParameter('status', 1) // 1 = Active
            ->orderBy('c.create_date', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Email domain ဖြင့် ရှာဖွေခြင်း (ဥပမာ: gmail.com user များ)
     */
    public function findByEmailDomain(string $domain): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.email LIKE :domain')
            ->setParameter('domain', '%@' . $domain)
            ->getQuery()
            ->getResult();
    }

    /**
     * Order count ၅ ခုအထက် ရှိသော Customer များ (VIP)
     */
    public function findVipCustomers(): array
    {
        return $this->createQueryBuilder('c')
            ->select('c')
            ->leftJoin('c.Orders', 'o')
            ->groupBy('c.id')
            ->having('COUNT(o.id) >= 5')
            ->getQuery()
            ->getResult();
    }
}
```

---

### အဆင့် 5 - Repository ကို Service ထဲတွင် Inject ပြုလုပ်ခြင်း

`app/Plugin/MyPlugin/Service/CustomerService.php`

```php
<?php

namespace Plugin\MyPlugin\Service;

use Eccube\Repository\CustomerRepository;
use Eccube\Entity\Customer;

class CustomerService
{
    public function __construct(
        private readonly CustomerRepository $customerRepository
    ) {}

    /**
     * Customer ၏ Nickname ကို Update ပြုလုပ်ခြင်း
     */
    public function updateNickname(Customer $customer, string $nickname): Customer
    {
        $customer->setPlgNickname($nickname);
        $this->customerRepository->save($customer, true);
        
        return $customer;
    }

    /**
     * VIP Customer list ရယူခြင်း
     */
    public function getVipCustomers(): array
    {
        return $this->customerRepository->findVipCustomers();
    }
}
```

---

### အဆင့် 6 - Controller ထဲတွင် အသုံးပြုခြင်း

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\CustomerRepository;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class CustomerListController extends AbstractController
{
    public function __construct(
        private readonly CustomerRepository $customerRepository
    ) {}

    /**
     * @Route("/%eccube_admin_route%/my-plugin/customers", name="my_plugin_admin_customers")
     * @Template("@MyPlugin/admin/customer_list.twig")
     */
    public function index(): array
    {
        // VIP Customer များ ရယူခြင်း
        $vipCustomers = $this->customerRepository->findVipCustomers();
        
        return [
            'VipCustomers' => $vipCustomers,
        ];
    }
}
```

---

## 🔑 Doctrine Query Builder - အဓိက Methods

```php
$qb = $this->createQueryBuilder('p'); // 'p' = alias

// WHERE conditions
$qb->where('p.name = :name')->setParameter('name', 'test');
$qb->andWhere('p.price > :price')->setParameter('price', 1000);
$qb->orWhere('p.stock = 0');

// JOIN
$qb->leftJoin('p.ProductClasses', 'pc');
$qb->innerJoin('p.Categories', 'c');

// ORDER & LIMIT
$qb->orderBy('p.create_date', 'DESC');
$qb->addOrderBy('p.name', 'ASC');
$qb->setMaxResults(20);
$qb->setFirstResult(0); // offset (pagination)

// RESULT
$result = $qb->getQuery()->getResult();        // Array of entities
$single = $qb->getQuery()->getOneOrNullResult(); // Single entity or null
$array  = $qb->getQuery()->getArrayResult();   // Array of arrays (faster)
$scalar = $qb->getQuery()->getSingleScalarResult(); // Single value (COUNT etc)
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] Trait ဖိုင်တွင် `@EntityExtension` annotation မှန်ကန်ကြောင်း
- [ ] Migration ကို run ပြုလုပ်ပြီးကြောင်း
- [ ] Database တွင် column ထည့်ပြီးကြောင်း (`SHOW COLUMNS FROM dtb_customer;`)
- [ ] Cache clear ပြုလုပ်ပြီးကြောင်း

---

> ➡️ **နောက်တစ်ဆင့်**: [04 - Admin Page Extension](/eccube/customization-list/04_admin_page_extension/)
