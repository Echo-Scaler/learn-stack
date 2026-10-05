---
title: "02. Doctrine Orm And Entities"
description: "EC-CUBE 4.x သည် Database နှင့် ချိတ်ဆက်အလုပ်လုပ်ရာတွင် Doctrine ORM (Object-Relational Mapping) ကို အသုံးပြုပါသည်။ Database Table များကို PHP Class (Entity) အဖြ"
---

## Module 04 - အခန်း ၂: Doctrine ORM, Entities, Repositories နှင့် Migrations

EC-CUBE 4.x သည် Database နှင့် ချိတ်ဆက်အလုပ်လုပ်ရာတွင် **Doctrine ORM (Object-Relational Mapping)** ကို အသုံးပြုပါသည်။ Database Table များကို PHP Class (Entity) အဖြစ် ကိုယ်စားပြုကာ Object-Oriented ပုံစံဖြင့် Data များကို ထည့်သွင်းခြင်း၊ ပြင်ဆင်ခြင်း၊ ရှာဖွေခြင်းများ ဆောင်ရွက်ပါသည်။

---

## ၁။ EC-CUBE ရှိ အဓိက Database Tables နှင့် Entities

EC-CUBE ရှိ Database Table များသည် `dtb_` (Data Table) သို့မဟုတ် `mtb_` (Master Table) ဟု အစပြုလေ့ရှိပါသည်:

| Database Table Name | သက်ဆိုင်ရာ PHP Entity Class | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| `dtb_product` | `Eccube\Entity\Product` | ကုန်ပစ္စည်းအချက်အလက်များ (အမည်၊ ဖော်ပြချက်၊ အခြေအနေ) |
| `dtb_product_class` | `Eccube\Entity\ProductClass` | ကုန်ပစ္စည်း၏ Variant အသေးစိတ် (ဈေးနှုန်း၊ Stock၊ SKU) |
| `dtb_category` | `Eccube\Entity\Category` | ကုန်ပစ္စည်း အမျိုးအစားများ (Category Tree) |
| `dtb_customer` | `Eccube\Entity\Customer` | အသင်းဝင် Customer အချက်အလက်များ (အမည်၊ အီးမေးလ်၊ လိပ်စာ) |
| `dtb_order` | `Eccube\Entity\Order` | အော်ဒါအချက်အလက်များ (စုစုပေါင်းငွေ၊ အခွန်၊ Status) |
| `dtb_order_item` | `Eccube\Entity\OrderItem` | အော်ဒါထဲတွင် ဝယ်ယူထားသော ပစ္စည်းတစ်ခုချင်းစီ၏ စာရင်း |
| `dtb_shipping` | `Eccube\Entity\Shipping` | ပစ္စည်းပို့ဆောင်ရမည့် လိပ်စာနှင့် ပို့ဆောင်ရေးကုမ္ပဏီ |
| `dtb_payment` | `Eccube\Entity\Payment` | ငွေပေးချေမှု နည်းလမ်းများ |

---

## ၂။ Entity တစ်ခု၏ ဖွဲ့စည်းပုံ (Entity Structure)

Doctrine Entity တစ်ခုတွင် Database Column များကို Docblock Annotation များဖြင့် သတ်မှတ်ပါသည်:

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="plg_banner")
 * @ORM\Entity(repositoryClass="Customize\Repository\BannerRepository")
 */
class Banner
{
    /**
     * Primary Key (Auto Increment)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(name="id", type="integer")
     */
    private $id;

    /**
     * Banner ခေါင်းစဉ်
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * Banner ပုံလမ်းကြောင်း
     * @ORM\Column(name="image_file", type="string", length=255, nullable=true)
     */
    private $image_file;

    /**
     * Link URL
     * @ORM\Column(name="url", type="string", length=255, nullable=true)
     */
    private $url;

    /**
     * ဖွင့်/ပိတ် Status
     * @ORM\Column(name="is_active", type="boolean", options={"default":true})
     */
    private $is_active = true;

    /**
     * ဖန်တီးသည့် အချိန်
     * @ORM\Column(name="create_date", type="datetime")
     */
    private $create_date;

    // Getter and Setter Methods များ...
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function isIsActive(): ?bool
    {
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): self
    {
        $this->is_active = $is_active;
        return $this;
    }
}
```

---

## ၃။ Entity ဆက်နွယ်မှုများ (Relationships / Associations)

Doctrine တွင် Table များကြား ချိတ်ဆက်မှုကို အောက်ပါ Annotation များဖြင့် သတ်မှတ်ပါသည်:

### က။ ManyToOne & OneToMany (ဥပမာ: Order နှင့် OrderItem)

```php
// OrderItem Entity ထဲတွင် (Many Items belong to One Order)
/**
 * @ORM\ManyToOne(targetEntity="Eccube\Entity\Order", inversedBy="OrderItems")
 * @ORM\JoinColumn(name="order_id", referencedColumnName="id", nullable=false)
 */
private $Order;

// Order Entity ထဲတွင် (One Order has Many OrderItems)
/**
 * @ORM\OneToMany(targetEntity="Eccube\Entity\OrderItem", mappedBy="Order", cascade={"persist", "remove"})
 */
private $OrderItems;
```

---

## ၄။ EntityManager ဖြင့် Data သိမ်းဆည်းခြင်း (Persist, Flush, Remove)

Database သို့ Data အသစ်ထည့်သွင်းခြင်း သို့မဟုတ် ပြင်ဆင်ခြင်းကို `EntityManagerInterface` ဖြင့် ဆောင်ရွက်ပါသည်:

```php
// 1. Data အသစ် ထည့်သွင်းခြင်း (INSERT)
$banner = new Banner();
$banner->setTitle('Summer Big Sale');
$banner->setUrl('https://example.com/sale');
$banner->setIsActive(true);
$banner->setCreateDate(new \DateTime());

$entityManager->persist($banner); // Tracking စတင်လုပ်ခြင်း
$entityManager->flush();           // Database သို့ SQL Query အမှန်တကယ် Run ခြင်း

// 2. Data ပြင်ဆင်ခြင်း (UPDATE)
$banner = $bannerRepository->find(1);
$banner->setTitle('Winter Big Sale');
$entityManager->flush();           // persist ခေါ်စရာမလိုဘဲ flush ဖြင့် အလိုအလျောက် Update လုပ်သည်

// 3. Data ဖျက်ခြင်း (DELETE)
$banner = $bannerRepository->find(1);
$entityManager->remove($banner);
$entityManager->flush();
```

---

## ၅။ Repositories နှင့် QueryBuilder အသုံးပြု၍ Data ရှာဖွေခြင်း

Repository သည် Database Query များကို သီးသန့် ရေးသားရာနေရာဖြစ်ပါသည်။

### က။ အခြေခံ Built-in Methods များ:
```php
// ID ဖြင့် ရှာယူခြင်း
$product = $productRepository->find(10);

// Data အားလုံး ယူခြင်း
$allProducts = $productRepository->findAll();

// Condition ဖြင့် ရှာယူခြင်း (status = 1 ဖြစ်သော နောက်ဆုံး 5 ခု)
$activeProducts = $productRepository->findBy(
    ['Status' => 1],
    ['id' => 'DESC'],
    5 // Limit
);

// တစ်ခုတည်း ရှာယူခြင်း
$customer = $customerRepository->findOneBy(['email' => 'user@example.com']);
```

### ခ။ QueryBuilder ဖြင့် ရှုပ်ထွေးသော Query ရေးသားခြင်း:
```php
<?php

namespace Customize\Repository;

use Customize\Entity\Banner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BannerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Banner::class);
    }

    /**
     * Active ဖြစ်သော Banner များကို နောက်ဆုံးတင်သည့် အစီအစဉ်အတိုင်း ရယူခြင်း
     */
    public function getActiveBanners(int $limit = 5): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.is_active = :status')
            ->setParameter('status', true)
            ->orderBy('b.id', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
```

---

## ၆။ Doctrine Migrations (Database Schema ထိန်းသိမ်းခြင်း)

Database Table အသစ်ထည့်ခြင်း သို့မဟုတ် Column အသစ်တိုးသည့်အခါ Migrations ကို အသုံးပြုပါသည်:

```bash
# Migration File အသစ် Generate လုပ်ခြင်း
bin/console doctrine:migrations:generate
```

`app/DoctrineMigrations/` အောက်တွင် ဖိုင်အသစ် ထွက်လာမည်ဖြစ်ပြီး `up()` နှင့် `down()` method များကို ရေးသားရပါသည်:

```php
public function up(Schema $schema): void
{
    $table = $schema->createTable('plg_banner');
    $table->addColumn('id', 'integer', ['autoincrement' => true]);
    $table->addColumn('title', 'string', ['length' => 255]);
    $table->addColumn('image_file', 'string', ['length' => 255, 'notnull' => false]);
    $table->addColumn('url', 'string', ['length' => 255, 'notnull' => false]);
    $table->addColumn('is_active', 'boolean', ['default' => true]);
    $table->addColumn('create_date', 'datetime');
    $table->setPrimaryKey(['id']);
}

public function down(Schema $schema): void
{
    $schema->dropTable('plg_banner');
}
```

Migration ဖိုင်ကို Database သို့ Apply ပြုလုပ်ရန်:
```bash
bin/console doctrine:migrations:migrate
```

---

နောက်အခန်းတွင် **[Module 04 - အခန်း ၃: Twig Template Engine](/eccube/01_basics/04-architecture-and-core-concepts/03-twig-template-engine/)** ကို ဆက်လက်လေ့လာပါမည်။
