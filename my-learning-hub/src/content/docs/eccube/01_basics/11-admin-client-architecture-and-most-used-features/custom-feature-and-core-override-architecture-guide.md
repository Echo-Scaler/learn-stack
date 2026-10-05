---
title: "Custom Feature And Core Override Architecture Guide"
description: "> EC-CUBE 4.x Development Guide: Feature Creation, Core Overriding, Folder Architecture & Clean Code Standards"
---

## EC-CUBE 4.x Custom Feature တည်ဆောက်ခြင်းနှင့် Core Override ပြုလုပ်ခြင်းဆိုင်ရာ Folder Structure စံသတ်မှတ်ချက် လမ်းညွှန်

> **EC-CUBE 4.x Development Guide: Feature Creation, Core Overriding, Folder Architecture & Clean Code Standards**  
> ဤလမ်းညွှန်ချက်သည် EC-CUBE 4.x တွင် Feature အသစ်တစ်ခု တည်ဆောက်သည့်အခါ (သို့မဟုတ်) လက်ရှိ Core စနစ်ကို ပြင်ဆင်/ချဲ့ထွင် (Customize / Override) သည့်အခါ မည်သည့် Folder များကို မည်သို့ဖွဲ့စည်းရမည်၊ အဘယ်ကြောင့် ဤသို့ဖွဲ့စည်းရသည်၊ မည်သည့် Logic များကို မည်သည့် Folder တွင် ထည့်သွင်းရမည်ဆိုသည့် အင်ဂျင်နီယာဆိုင်ရာ စံနှုန်းများကို မြန်မာဘာသာဖြင့် အသေးစိတ် ရေးသားထားသော လမ်းညွှန်စာတမ်း ဖြစ်ပါသည်။

---

## မာတိကာ (Table of Contents)

1. [EC-CUBE Architecture ၏ အဓိက သဘောတရားနှင့် ရွှေစည်းမျဉ်း (Golden Rules)](#၁-ec-cube-architecture-၏-အဓိက-သဘောတရားနှင့်-ရွှေစည်းမျဉ်း-golden-rules)
2. [Folder Structure ကြီး (၄) ခုနှင့် ဘာကြောင့် ဤသို့ခွဲခြားထားရသလဲ (Why This Structure?)](#၂-folder-structure-ကြီး-၄-ခုနှင့်-ဘာကြောင့်-ဤသို့ခွဲခြားထားရသလဲ-why-this-structure)
3. [`app/Customize/` အောက်ရှိ Sub-folders များ၏ တာဝန်နှင့် Logic ခွဲဝေမှု စံနှုန်းများ](#၃-appcustomize-အောက်ရှိ-sub-folders-များ၏-တာဝန်နှင့်-logic-ခွဲဝေမှု-စံနှုန်းများ)
4. [ဘယ်အချိန်မှာ ဘယ် Folder ကို အသုံးပြုရမလဲ? (Decision Guide & Matrix)](#၄-ဘယ်အချိန်မှာ-ဘယ်-folder-ကို-အသုံးပြုရမလဲ-decision-guide--matrix)
5. [လက်တွေ့ ဥပမာ (၁) - စနစ်သစ် Feature အသစ်တစ်ခု တည်ဆောက်ခြင်း (New System Feature)](#၅-လက်တွေ့-ဥပမာ-၁---စနစ်သစ်-feature-အသစ်တစ်ခု-တည်ဆောက်ခြင်း-new-system-feature)
6. [လက်တွေ့ ဥပမာ (၂) - လက်ရှိ Core Feature ကို ချဲ့ထွင်/Override ပြုလုပ်ခြင်း (Add Input Fields to Core)](#၆-လက်တွေ့-ဥပမာ-၂---လက်ရှိ-core-feature-ကို-ချဲ့ထွင်override-ပြုလုပ်ခြင်း-add-input-fields-to-core)
7. [လက်တွေ့ ဥပမာ (၃) - Core Business Logic ကို Decorator Pattern ဖြင့် Override ပြုလုပ်ခြင်း](#၇-လက်တွေ့-ဥပမာ-၃---core-business-logic-ကို-decorator-pattern-ဖြင့်-override-ပြုလုပ်ခြင်း)
8. [ဂျပန် Project များတွင် သုံးသော ဝေါဟာရများနှင့် စံစည်းမျဉ်းများ (Japanese Terms & Best Practices)](#၈-ဂျပန်-project-များတွင်-သုံးသော-ဝေါဟာရများနှင့်-စံစည်းမျဉ်းများ-japanese-terms--best-practices)
9. [Developer Checklist & Quick Reference](#၉-developer-checklist--quick-reference)

---

## ၁။ EC-CUBE Architecture ၏ အဓိက သဘောတရားနှင့် ရွှေစည်းမျဉ်း (Golden Rules)

EC-CUBE 4.x သည် **Symfony Framework** နှင့် **Doctrine ORM** ပေါ်တွင် တည်ဆောက်ထားသော ခေတ်မီ E-Commerce စနစ်ဖြစ်ပါသည်။ စနစ်ကို Customize ပြုလုပ်ရာတွင် စည်းကမ်းမဲ့ ရေးသားပါက Version Upgrade ပြုလုပ်ချိန်တွင် Code များ ပျက်စီးခြင်း၊ Plugin များနှင့် Conflict ဖြစ်ခြင်း၊ System Security ပေါက်ပေါက်ခြင်းများ ဖြစ်ပေါ်စေနိုင်သည်။

### ရွှေစည်းမျဉ်း (၂) ရပ်:

> 🚨 **ရွှေစည်းမျဉ်း (၁) - `src/Eccube/` (Core) ကို လုံးဝ မပြင်ရ (Never Touch Core Directly!)**  
> `src/Eccube/` အောက်ရှိ File များကို တိုက်ရိုက် သွားရောက် ပြင်ဆင်ခြင်းသည် EC-CUBE Development တွင် အကြီးမားဆုံး အမှားဖြစ်ပါသည်။ Core Version Update ပြုလုပ်သည့်အခါ သင်ပြင်ထားသော Code များ အားလုံး Overwrite ဖြစ်ပြီး ပျောက်ကွယ်သွားပါမည်။

> 💡 **ရွှေစည်းမျဉ်း (၂) - Single Responsibility & Separation of Concerns (တာဝန်ခွဲဝေခြင်း စံနှုန်း)**  
> Database Query ကို Controller ထဲ မရေးရ၊ HTML/View Logic ကို Service ထဲ မရေးရ၊ Form Validation ကို JavaScript တွင်သာမက Backend Form Type တွင် မဖြစ်မနေ ထည့်သွင်းရမည်။ Logic အမျိုးအစားတိုင်းတွင် သတ်မှတ်ထားသော ကိုယ်ပိုင် Folder ရှိရပါမည်။

---

## ၂။ Folder Structure ကြီး (၄) ခုနှင့် ဘာကြောင့် ဤသို့ခွဲခြားထားရသလဲ (Why This Structure?)

EC-CUBE တွင် အဓိက သက်ဆိုင်သော Layer ကြီး (၄) ခု ရှိပါသည်-

```text
ec-cube/
├── src/Eccube/          ⛔ [Layer 1: Core System]       -> Read-Only (Official Code)
├── app/Customize/       ★  [Layer 2: App Customization] -> Project-specific PHP Logic
├── app/template/        🎨 [Layer 3: Presentation UI]   -> Twig Template Overrides
└── app/Plugin/          📦 [Layer 4: Modular Extension] -> Independent Reusable Packages
```

### အဘယ်ကြောင့် ဤသို့ ခွဲခြားတည်ဆောက်ရသနည်း?

| Folder တည်နေရာ | ရည်ရွယ်ချက် | အားသာချက်နှင့် အကြောင်းရင်း |
| :--- | :--- | :--- |
| **`src/Eccube/`** | Official Core Framework | System ၏ အခြေခံကျောရိုးဖြစ်ပြီး Update ပြုလုပ်နိုင်ရန် မူလအတိုင်း ထားရှိရသည်။ |
| **`app/Customize/`** | လက်ရှိ Project အတွက် သီးသန့် Code | Core ကို မထိခိုက်ဘဲ Feature သစ်ရေးခြင်း၊ Core ကို ချဲ့ထွင်ခြင်းများကို PSR-4 Autoloading စနစ်ဖြင့် သန့်ရှင်းစွာ ချိတ်ဆက်ပေးသည်။ |
| **`app/template/`** | View Layer (HTML/Twig) Override | Core UI ဖိုင်များကို တိုက်ရိုက်မပြင်ဘဲ မိမိစိတ်ကြိုက် UI Design, Layout, Snippet များကို အစားထိုးနိုင်ရန် ဖြစ်သည်။ |
| **`app/Plugin/`** | သီးခြား ဖြုတ်/တပ်နိုင်သော Features | အခြား Project များတွင်လည်း ပြန်လည်အသုံးပြုနိုင်သော Feature များကို Package သီးသန့် ခွဲထုတ်ရန် ဖြစ်သည်။ |

---

## ၃။ `app/Customize/` အောက်ရှိ Sub-folders များ၏ တာဝန်နှင့် Logic ခွဲဝေမှု စံနှုန်းများ

`app/Customize/` အောက်တွင် ရေးသားရမည့် Folder များမှာ အောက်ပါအတိုင်း ဖြစ်ပြီး တစ်ခုချင်းစီတွင် တိကျသော တာဝန်များ ရှိသည်-

```text
app/Customize/
├── Controller/          # 🌐 HTTP Request/Response, Routing, UI သို့ Data ပို့ဆောင်ခြင်း
├── Entity/              # 🗄️ Database Table Structure, Data Model, Trait (Core Column Extension)
├── Repository/          # 🔍 Database Queries (Doctrine QueryBuilder, Custom SQL)
├── Service/             # ⚙️ Pure Business Logic, Complex Calculations, External APIs
├── Form/
│   ├── Type/            # 📝 New Form Definitions & Validation Rules
│   └── Extension/       # ➕ Core Form များတွင် Field အသစ် ထပ်တိုးခြင်း (Form Extension)
├── EventSubscriber/     # 🪝 Core Hook Points, Event Interception (Core Code မပြင်ဘဲ ကြားဖြတ်ဖမ်းယူခြင်း)
├── Twig/
│   └── Extension/       # 🏷️ Custom Twig Filters / Functions များ (UI Helper)
├── Security/            # 🔐 Custom Authentication, Voters, Permissions
└── Resource/
    └── config/          # ⚙️ Custom YAML / Routing configurations
```

### Sub-Folder တစ်ခုချင်းစီ၏ အသေးစိတ် သဘောတရားနှင့် တာဝန်ခွဲဝေပုံ:

#### ၁။ `Controller/` (Presentation & Orchestration Layer)
- **ဘာအတွက်သုံးသလဲ**: URL Route တစ်ခုကို လက်ခံခြင်း (`@Route`), Form Submit လုပ်လာသော Data များကို လက်ခံခြင်း, HTTP Response ပြန်ပို့ခြင်း (Twig Render လုပ်ခြင်း သို့မဟုတ် JSON Return ပေးခြင်း)။
- **ဘာကို မထည့်ရဘူးလဲ**: 
  - ❌ Database Query များကို Controller ထဲ တိုက်ရိုက်မရေးရ။ (Repository သို့ လွှဲပေးရမည်)။
  - ❌ ရှုပ်ထွေးသော တွက်ချက်မှုများ (Business Logic) ကို Controller ထဲ မရေးရ။ (Service သို့ လွှဲပေးရမည်)။
- **တာဝန်**: Controller သည် ယာဉ်ထိန်းရဲ (Traffic Controller) ကဲ့သို့ဖြစ်ပြီး Request ကို လက်ခံကာ သက်ဆိုင်ရာ Service/Repository သို့ ပို့ပေးပြီး ထွက်လာသော ရလဒ်ကို User ထံ ပြန်ပို့ပေးရုံသာ လုပ်ဆောင်ရမည်။

#### ၂။ `Entity/` (Data Modeling Layer)
- **ဘာအတွက်သုံးသလဲ**: Database Table များကို PHP Object (Class) အဖြစ် ကိုယ်စားပြု သတ်မှတ်ခြင်း။ Column နာမည်များ၊ Data Types (`string`, `integer`, `datetime`), Relationships (`OneToMany`, `ManyToOne`) များကို Doctrine Annotations ဖြင့် သတ်မှတ်ခြင်း။
- **အထူးပြုချက်**: Core Entity (ဥပမာ `Product`, `Customer`, `Order`) များတွင် Column အသစ် တိုးလိုပါက Class အသစ် မဆောက်ရဘဲ **Trait** အဖြစ် တည်ဆောက်ရသည်။

#### ၃။ `Repository/` (Data Access Layer)
- **ဘာအတွက်သုံးသလဲ**: Database ထဲမှ Data ဆွဲထုတ်ခြင်း (SELECT), ရှာဖွေခြင်း (Filtering), စီခြင်း (Sorting), Paging ပြုလုပ်ခြင်း။
- **အဘယ်ကြောင့် သီးသန့်ခွဲရသလဲ**: 
  - SQL သို့မဟုတ် Doctrine QueryBuilder logic များကို နေရာအနှံ့ ပျံ့ကျဲမနေစေဘဲ Database နှင့် ပတ်သက်သော Query မှန်သမျှ Repository တစ်ခုတည်းတွင် စုစည်းထားရန် ဖြစ်သည်။
  - နောင်တစ်ချိန်တွင် Query Performance အားနည်း၍ Index ထည့်ခြင်း၊ Query ပြင်ဆင်ခြင်း ပြုလုပ်ပါက Repository ဖိုင်တစ်ခုတည်းကိုသာ ပြင်ဆင်ရမည် ဖြစ်သည်။

#### ၄။ `Service/` (Domain / Business Logic Layer)
- **ဘာအတွက်သုံးသလဲ**: စနစ်၏ အဓိကကျသော လုပ်ငန်းစဉ်များ (Core Business Calculations, Points System, Delivery Fee Calculation, PDF Generation, Payment Gateway API ချိတ်ဆက်ခြင်း, စသည်)။
- **အဘယ်ကြောင့် သီးသန့်ခွဲရသလဲ**:
  - ဤ Business Logic ကို Web Controller မှသာမက Terminal CLI Command ကလည်း ခေါ်သုံးနိုင်သည်၊ Event Subscriber ကလည်း ခေါ်သုံးနိုင်သည်၊ Cron Job Batch ကလည်း ခေါ်သုံးနိုင်သည်။ ထို့ကြောင့် Controller နှင့် မရောဘဲ သီးခြား Service Class အဖြစ် တည်ဆောက်ရသည်။

#### ၅။ `Form/Type/` နှင့် `Form/Extension/` (Input & Validation Layer)
- **`Form/Type/`**: စနစ်သစ် Feature အတွက် Form အသစ် ဖန်တီးလိုသောအခါ သုံးသည်။ (ဥပမာ - Product Review Form, Contact Inquiry Form)။
- **`Form/Extension/`**: လက်ရှိ Core Form (ဥပမာ `EntryType`, `CustomerType`, `OrderType`) ထဲသို့ Input Field အသစ်များ ထပ်ပေါင်းထည့်လိုသောအခါ သုံးသည်။
- **အဘယ်ကြောင့် သီးသန့်ခွဲရသလဲ**: Form Input များကို စစ်ဆေးခြင်း (Validation Constraints - Blank မဖြစ်ရ၊ အက္ခရာ အရေအတွက်၊ Email Format) များကို HTML ဘက်တွင်သာမက Server ဘက်တွင် လုံခြုံစွာ စစ်ဆေးနိုင်ရန် Symfony Form System ကို အသုံးပြုခြင်း ဖြစ်သည်။

#### ၆။ `EventSubscriber/` (Hook Point & Lifecycle Layer)
- **ဘာအတွက်သုံးသလဲ**: Core စနစ်၏ လုပ်ဆောင်ချက်များကို Core Code မပြင်ဘဲ အစ/အလယ်/အဆုံးတွင် ကြားဖြတ်ဖမ်းယူခြင်း (Interception)။
- **ဥပမာ**: အော်ဒါအောင်မြင်စွာ တင်ပြီးချိန် (`eccube.event.front.shopping.confirm.complete`) တွင် LINE သို့ Notification ပို့ခြင်း၊ အော်ဒါမတင်မီ ကုန်ပစ္စည်းလက်ကျန် အထူးစစ်ဆေးခြင်း စသည်တို့အတွက် သုံးသည်။

---

## ၄။ ဘယ်အချိန်မှာ ဘယ် Folder ကို အသုံးပြုရမလဲ? (Decision Guide & Matrix)

Developer များအနေဖြင့် Task တစ်ခုရလာပါက မည်သည့် Folder များတွင် ကုဒ်ရေးရမည်ကို အောက်ပါ Decision Flowchart အတိုင်း ဆုံးဖြတ်နိုင်ပါသည်-

```text
[သင်လုပ်ဆောင်လိုသော လုပ်ငန်းစဉ်]
       │
       ├─► စာမျက်နှာအသစ် (URL အသစ်) ဖန်တီးချင်သလား?
       │     └─► app/Customize/Controller/  +  app/template/
       │
       ├─► Database Table အသစ်တစ်ခု ဆောက်ချင်သလား?
       │     └─► app/Customize/Entity/  +  app/Customize/Repository/
       │
       ├─► Core Table (Customer, Product, Order) ထဲ Field အသစ် တိုးချင်သလား?
       │     └─► app/Customize/Entity/[Entity]Trait.php
       │         └─► app/Customize/Form/Extension/[Form]Extension.php
       │             └─► app/template/ (UI ပေါ် field ပြရန်)
       │
       ├─► Database ထဲမှ Data ရှာဖွေ/စစ်ထုတ်သော Query ရေးချင်သလား?
       │     └─► app/Customize/Repository/ (QueryBuilder ရေးရန်)
       │
       ├─► တွက်ချက်မှု၊ API ချိတ်ဆက်မှု၊ သီးသန့် Process ကြီးများ ရေးချင်သလား?
       │     └─► app/Customize/Service/
       │
       ├─► Core လုပ်ဆောင်ချက်တစ်ခု ပြီးဆုံးချိန်/မစတင်မီ ကြားဖြတ် Hook ဖမ်းချင်သလား?
       │     └─► app/Customize/EventSubscriber/
       │
       └─► Core Service ၏ မူလ logic တစ်ခုလုံးကို အစားထိုး ချဲ့ထွင်ချင်သလား?
             └─► app/Customize/Service/ (Decorator Pattern) + services.yaml
```

---

## ၅။ လက်တွေ့ ဥပမာ (၁) - စနစ်သစ် Feature အသစ်တစ်ခု တည်ဆောက်ခြင်း (New System Feature)

စနစ်သစ် Feature အသစ်တစ်ခုဖြစ်သော **"Product Review (ကုန်ပစ္စည်း သုံးသပ်ချက်နှင့် Rating စနစ်)"** တည်ဆောက်ပုံကို Folder Structure စံနှုန်းများနှင့်တကွ လေ့လာကြည့်ပါမည်။

### လိုအပ်သော Folder များနှင့် ဖိုင်တည်ဆောက်ပုံ:

```text
app/Customize/
├── Entity/
│   └── ProductReview.php                 # [1] Review Data Model Table
├── Repository/
│   └── ProductReviewRepository.php       # [2] Review ဆွဲထုတ်သော Database Queries
├── Form/Type/
│   └── ProductReviewType.php             # [3] Review ရေးရန် Form & Validation
├── Service/
│   └── ProductReviewService.php          # [4] Review Average တွက်ခြင်း၊ Spam စစ်ခြင်း
└── Controller/
    └── ProductReviewController.php       # [5] HTTP URL Routing & Submit Action

app/template/default/
└── Product/
    └── review.twig                       # [6] Review Form နှင့် Review စာရင်း UI
```

---

### အဆင့် (၁) - Database Entity ဖန်တီးခြင်း
📁 **File: `app/Customize/Entity/ProductReview.php`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: Database table ၏ ဖွဲ့စည်းပုံနှင့် Column များကို သတ်မှတ်ရန်)*

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Entity\Product;
use Eccube\Entity\Customer;

/**
 * @ORM\Table(name="dtb_product_review")
 * @ORM\Entity(repositoryClass="Customize\Repository\ProductReviewRepository")
 */
class ProductReview
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Product")
     * @ORM\JoinColumn(name="product_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private $Product;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Customer")
     * @ORM\JoinColumn(name="customer_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $Customer;

    /**
     * @ORM\Column(type="smallint")
     */
    private $rating; // 1 to 5 Stars

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     */
    private $comment;

    /**
     * @ORM\Column(type="datetime")
     */
    private $create_date;

    public function __construct()
    {
        $this->create_date = new \DateTime();
    }

    // Getters and Setters ...
    public function getId(): ?int { return $this->id; }
    public function getProduct(): ?Product { return $this->Product; }
    public function setProduct(?Product $Product): self { $this->Product = $Product; return $this; }
    public function getRating(): ?int { return $this->rating; }
    public function setRating(int $rating): self { $this->rating = $rating; return $this; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getComment(): ?string { return $this->comment; }
    public function setComment(string $comment): self { $this->comment = $comment; return $this; }
    public function getCreateDate(): \DateTime { return $this->create_date; }
}
```

---

### အဆင့် (၂) - Database Repository ဖန်တီးခြင်း
📁 **File: `app/Customize/Repository/ProductReviewRepository.php`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: Database Query အားလုံးကို Controller ထဲ မရောဘဲ သီးသန့် စုစည်းထားရန်)*

```php
<?php

namespace Customize\Repository;

use Customize\Entity\ProductReview;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\Product;

class ProductReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductReview::class);
    }

    /**
     * သက်ဆိုင်ရာ Product အတွက် နောက်ဆုံး Review များကို ဆွဲထုတ်ခြင်း
     */
    public function findLatestReviews(Product $Product, int $limit = 10): array
    {
        return $this->createQueryBuilder('r')
            ->where('r.Product = :Product')
            ->setParameter('Product', $Product)
            ->orderBy('r.create_date', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
```

---

### အဆင့် (၃) - Business Logic Service ဖန်တီးခြင်း
📁 **File: `app/Customize/Service/ProductReviewService.php`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: Average Rating တွက်ချက်ခြင်း၊ Review သိမ်းဆည်းခြင်း လုပ်ငန်းစဉ်များကို စုစည်းရန်)*

```php
<?php

namespace Customize\Service;

use Customize\Entity\ProductReview;
use Customize\Repository\ProductReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Product;

class ProductReviewService
{
    private $entityManager;
    private $reviewRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ProductReviewRepository $reviewRepository
    ) {
        $this->entityManager = $entityManager;
        $this->reviewRepository = $reviewRepository;
    }

    /**
     * ပျမ်းမျှ ကြယ်ပွင့် အရေအတွက်ကို တွက်ချက်ခြင်း
     */
    public function calculateAverageRating(Product $Product): float
    {
        $reviews = $this->reviewRepository->findBy(['Product' => $Product]);
        if (empty($reviews)) {
            return 0.0;
        }

        $totalScore = 0;
        foreach ($reviews as $review) {
            $totalScore += $review->getRating();
        }

        return round($totalScore / count($reviews), 1);
    }

    /**
     * Review အသစ်ကို Database သို့ သိမ်းဆည်းခြင်း
     */
    public function saveReview(ProductReview $Review): void
    {
        $this->entityManager->persist($Review);
        $this->entityManager->flush();
    }
}
```

---

### အဆင့် (၄) - Form Type နှင့် Validation ဖန်တီးခြင်း
📁 **File: `app/Customize/Form/Type/ProductReviewType.php`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: User ထံမှ လက်ခံမည့် Input fields များနှင့် Validation စည်းမျဉ်းများ သတ်မှတ်ရန်)*

```php
<?php

namespace Customize\Form\Type;

use Customize\Entity\ProductReview;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ProductReviewType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('rating', ChoiceType::class, [
                'choices' => [
                    '⭐⭐⭐⭐⭐ (5/5)' => 5,
                    '⭐⭐⭐⭐ (4/5)' => 4,
                    '⭐⭐⭐ (3/5)' => 3,
                    '⭐⭐ (2/5)' => 2,
                    '⭐ (1/5)' => 1,
                ],
                'constraints' => [
                    new Assert\NotBlank(['message' => 'ကျေးဇူးပြု၍ ကြယ်အဆင့် သတ်မှတ်ပေးပါ']),
                ],
            ])
            ->add('title', TextType::class, [
                'constraints' => [
                    new Assert\NotBlank(['message' => 'ခေါင်းစဉ် ထည့်သွင်းပါ']),
                    new Assert\Length(['max' => 100]),
                ],
            ])
            ->add('comment', TextareaType::class, [
                'constraints' => [
                    new Assert\NotBlank(['message' => 'သုံးသပ်ချက် အသေးစိတ် ရေးသားပါ']),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ProductReview::class,
        ]);
    }
}
```

---

### အဆင့် (၅) - Web Controller ဖန်တီးခြင်း
📁 **File: `app/Customize/Controller/ProductReviewController.php`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: URL route ကို လက်ခံပြီး Form ကို စစ်ဆေးကာ Service ထံ လွှဲပြောင်းပေးရန်)*

```php
<?php

namespace Customize\Controller;

use Customize\Entity\ProductReview;
use Customize\Form\Type\ProductReviewType;
use Customize\Service\ProductReviewService;
use Eccube\Controller\AbstractController;
use Eccube\Entity\Product;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductReviewController extends AbstractController
{
    private $reviewService;

    public function __construct(ProductReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * @Route("/product/{id}/review", name="customize_product_review", methods={"GET", "POST"})
     * @Template("Product/review.twig")
     */
    public function index(Request $request, Product $Product)
    {
        $Review = new ProductReview();
        $Review->setProduct($Product);

        // အကယ်၍ User Login ဝင်ထားပါက Customer ကို ထည့်ပေးမည်
        if ($this->getUser()) {
            $Review->setCustomer($this->getUser());
        }

        $form = $this->createForm(ProductReviewType::class, $Review);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->reviewService->saveReview($Review);
            $this->addSuccess('သုံးသပ်ချက်ကို အောင်မြင်စွာ တင်ပြီးပါပြီ။');

            return $this->redirectToRoute('customize_product_review', ['id' => $Product->getId()]);
        }

        return [
            'Product' => $Product,
            'form' => $form->createView(),
            'avgRating' => $this->reviewService->calculateAverageRating($Product),
        ];
    }
}
```

---

## ၆။ လက်တွေ့ ဥပမာ (၂) - လက်ရှိ Core Feature ကို ချဲ့ထွင်/Override ပြုလုပ်ခြင်း (Add Input Fields to Core)

ဂျပန် Client ပရောဂျက်များတွင် အလွန်တွေ့ရများသော Task ဖြစ်သည့် **"Customer (အသင်းဝင် ကာစတန်မာ) တွင် NRC / National ID (မှတ်ပုံတင်နံပါတ်) Field အသစ် ထည့်သွင်းခြင်း"** ကို လေ့လာပါမည်။

### မူလ Core Code ကို လုံးဝ မထိခိုက်ဘဲ ချိတ်ဆက်ရမည့် ဖိုင်တည်ဆောက်ပုံ:

```text
app/Customize/
├── Entity/
│   └── CustomerTrait.php             # [1] Core Customer Table ထဲ ကော်လံအသစ် ထည့်သည့် Trait
├── Form/Extension/
│   └── EntryTypeExtension.php        # [2] Customer Form ထဲတွင် NRC Input Field ထည့်ခြင်း
└── EventSubscriber/
    └── CustomerRegisterSubscriber.php# [3] Register လုပ်ချိန်တွင် Logic အပို စစ်ဆေးခြင်း (Optional)

app/template/default/
└── Entry/
    └── index.twig                    # [4] UI မျက်နှာပြင်တွင် NRC field ပေါ်လာစေရန် Override
```

---

### အဆင့် (၁) - Core Entity သို့ Column အသစ် ထည့်ရန် Entity Trait ဖန်တီးခြင်း
📁 **File: `app/Customize/Entity/CustomerTrait.php`**  
*(အဘယ်ကြောင့် Trait သုံးသလဲ: EC-CUBE Core သည် `src/Eccube/Entity/Customer.php` တွင် `CustomerTrait` ကို အလိုအလျောက် Use လုပ်ထားသောကြောင့် Core ကို မပြင်ဘဲ Database Column အသစ် တိုးနိုင်သည်။)*

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Customer")
 */
trait CustomerTrait
{
    /**
     * @ORM\Column(name="nrc_number", type="string", length=50, nullable=true)
     */
    private $nrc_number;

    public function getNrcNumber(): ?string
    {
        return $this->nrc_number;
    }

    public function setNrcNumber(?string $nrc_number): self
    {
        $this->nrc_number = $nrc_number;
        return $this;
    }
}
```

> ⚠️ **အရေးကြီးသော မှတ်ချက်**: Trait ဖန်တီးပြီးပါက Database Schema ကို Terminal မှ Update လုပ်ပေးရပါမည်-
> ```bash
> bin/console doctrine:schema:update --dump-sql
> bin/console doctrine:schema:update --force
> ```

---

### အဆင့် (၂) - Form Extension ဖြင့် Core Form တွင် Field အသစ် ထည့်သွင်းခြင်း
📁 **File: `app/Customize/Form/Extension/EntryTypeExtension.php`**  
*(ဘာကြောင့် Form Extension သုံးသလဲ: Core Form Type ဖြစ်သော `EntryType` ကို မပြင်ဘဲ Field အသစ်နှင့် Validation များကို ချဲ့ထွင်ရန်)*

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\Front\EntryType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class EntryTypeExtension extends AbstractTypeExtension
{
    /**
     * မည်သည့် Form Type ကို ချဲ့ထွင်မည်ဖြစ်ကြောင်း သတ်မှတ်ခြင်း
     */
    public function getExtendedType(): string
    {
        return EntryType::class;
    }

    /**
     * Symfony 4+ အတွက် Iterable Extended Types
     */
    public static function getExtendedTypes(): iterable
    {
        return [EntryType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nrc_number', TextType::class, [
            'label' => 'မှတ်ပုံတင်အမှတ် (NRC)',
            'required' => false,
            'eccube_form_options' => [
                'auto_render' => true,
            ],
            'constraints' => [
                new Assert\Length([
                    'max' => 50,
                    'maxMessage' => 'မှတ်ပုံတင်အမှတ်သည် စာလုံးရေ ၅၀ ထက် မကျော်ရပါ',
                ]),
            ],
        ]);
    }
}
```

---

### အဆင့် (၃) - Template Override ပြုလုပ်ခြင်း
📁 **File: `app/template/default/Entry/index.twig`**  
*(ဘာကြောင့် ဒီထဲရေးသလဲ: `src/Eccube/Resource/template/default/Entry/index.twig` ကို မပြင်ဘဲ အစားထိုးရန်)*

`src/Eccube/Resource/template/default/Entry/index.twig` ဖိုင်ကို `app/template/default/Entry/index.twig` သို့ ကော်ပီကူးယူပြီး လိုအပ်သော နေရာတွင် အောက်ပါကုဒ်ကို ထည့်သွင်းပါ-

```twig
{# မှတ်ပုံတင်အမှတ် (NRC) Input Field #}
<dl>
    <dt>
        {{ form_label(form.nrc_number, 'မှတ်ပုံတင်အမှတ် (NRC)', {'label_attr': {'class': 'ec-label'}}) }}
    </dt>
    <dd>
        <div class="ec-input{{ has_errors(form.nrc_number) ? ' error' }}">
            {{ form_widget(form.nrc_number, {'attr': {'placeholder': 'ဥပမာ - ၁၂/ရကန(နိုင်)၁၂၃၄၅၆'}}) }}
            {{ form_errors(form.nrc_number) }}
        </div>
    </dd>
</dl>
```

---

## ၇။ လက်တွေ့ ဥပမာ (၃) - Core Business Logic ကို Decorator Pattern ဖြင့် Override ပြုလုပ်ခြင်း

အကယ်၍ သင်သည် Core Service တစ်ခု (ဥပမာ: `CartService` သို့မဟုတ် ပို့ဆောင်ခတွက်ချက်သည့် Service) ၏ Logic ကို ပြောင်းလဲချင်သော်လည်း Core Code ကို မထိခိုက်စေလိုပါက **Symfony Decorator Pattern** ကို အသုံးပြုရပါမည်။

### အဆင့် (၁) - Decorator Service ရေးသားခြင်း
📁 **File: `app/Customize/Service/CustomCartService.php`**

```php
<?php

namespace Customize\Service;

use Eccube\Service\CartService;

class CustomCartService
{
    private $innerService;

    // Core CartService ကို Constructor Injection ဖြင့် ဆွဲယူခြင်း
    public function __construct(CartService $innerService)
    {
        $this->innerService = $innerService;
    }

    // မူလ Function ကို Override ပြုလုပ်ခြင်း
    public function addProduct($productClassId, $quantity = 1)
    {
        // မိမိစိတ်ကြိုက် Logic အပို ထည့်သွင်းခြင်း (ဥပမာ - အများဆုံး ၁၀ ခုထက်ပိုဝယ်မရအောင် စစ်ခြင်း)
        if ($quantity > 10) {
            throw new \Exception('ပစ္စည်းတစ်ခုလျှင် အများဆုံး ၁၀ ခုသာ ဝယ်ယူခွင့်ရှိပါသည်');
        }

        // မူလ Core Service ၏ လုပ်ဆောင်ချက်ကို ပြန်လည်လွှဲပြောင်းပေးခြင်း
        return $this->innerService->addProduct($productClassId, $quantity);
    }

    // ကျန်သော method များကို မူလ service ထံ proxy လုပ်ပေးခြင်း
    public function __call($method, $arguments)
    {
        return call_user_func_array([$this->innerService, $method], $arguments);
    }
}
```

### အဆင့် (၂) - Service Container တွင် Decorator အဖြစ် ကြေညာခြင်း
📁 **File: `app/config/eccube/packages/services.yaml`**

```yaml
services:
    Customize\Service\CustomCartService:
        decorates: Eccube\Service\CartService
        arguments: ['@Customize\Service\CustomCartService.inner']
```

ဤနည်းလမ်းဖြင့် စနစ်အတွင်း မည်သည့်နေရာက `CartService` ကို ခေါ်သုံးသည်ဖြစ်စေ သင်၏ `CustomCartService` က အရင်ဆုံး ကြားဖြတ် လုပ်ဆောင်ပေးမည် ဖြစ်ပါသည်။

---

## ၈။ ဂျပန် Project များတွင် သုံးသော ဝေါဟာရများနှင့် စံစည်းမျဉ်းများ (Japanese Terms & Best Practices)

ဂျပန် IT ကုမ္ပဏီများနှင့် EC-CUBE ပရောဂျက်များတွင် အောက်ပါ အသုံးအနှုန်းများနှင့် စံနှုန်းများကို မဖြစ်မနေ သိရှိထားရပါမည်-

| English / Feature | Japanese Term (日本語) | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| **Customization** | **カスタマイズ (Kasutamaizu)** | Core ကို မထိခိုက်ဘဲ app/Customize အောက်တွင် ပြုပြင်ခြင်း။ |
| **Override** | **オーバーライド / 上書き (Uwagaki)** | Template သို့မဟုတ် Logic ကို အစားထိုးခြင်း။ |
| **Entity Extension** | **エンティティ拡張 (Entiti Kakuchou)** | Trait ဖြင့် Table ထဲ Column အသစ် ထည့်သွင်းခြင်း။ |
| **Hook Point** | **フックポイント (Hukku Pointo)** | EventSubscriber ဖြင့် စနစ်ကြားဖြတ် ဖမ်းယူခြင်း။ |
| **Decorator** | **デコレーター (Dekoreetaa)** | Core Service logic ကို သန့်ရှင်းစွာ အစားထိုးခြင်း။ |
| **Form Extension** | **フォーム拡張 (Foomu Kakuchou)** | FormTypeExtension ဖြင့် Input field အသစ် ထပ်တိုးခြင်း။ |
| **Cache Clear** | **キャッシュクリア (Kyasshu Kuria)** | `bin/console cache:clear` ဖြင့် Cache ရှင်းထုတ်ခြင်း။ |

---

## ၉။ Developer Checklist & Quick Reference

Feature တစ်ခု တည်ဆောက်ပြီးတိုင်း သို့မဟုတ် Customize လုပ်ပြီးတိုင်း အောက်ပါ Checklist အတိုင်း စစ်ဆေးပါ-

- [ ] **Core Check**: `src/Eccube/` အောက်ရှိ မည်သည့် ဖိုင်ကိုမှ သွားရောက် ပြင်ဆင်ထားခြင်း မရှိကြောင်း သေချာပါသလား?
- [ ] **Namespace Check**: PHP ဖိုင်များတွင် သက်ဆိုင်ရာ `Customize\...` namespace ကို တိကျစွာ အသုံးပြုထားပါသလား?
- [ ] **Repository Check**: Database Query (QueryBuilder) များကို Controller ထဲတွင် မရေးဘဲ `Repository/` ထဲတွင်သာ ရေးထားပါသလား?
- [ ] **Form Validation Check**: Form Input များကို စစ်ဆေးသည့် Constraint များကို Form Type ထဲတွင် ထည့်သွင်းထားပါသလား?
- [ ] **Database Migration**: Column သစ်ထည့်ပြီးပါက `bin/console doctrine:schema:update --force` ပြုလုပ်ပြီးပြီလား?
- [ ] **Cache Clearance**: Code ပြင်ဆင်ပြီးတိုင်း `bin/console cache:clear --no-warmup` ကို Run ပေးပြီးပြီလား?
