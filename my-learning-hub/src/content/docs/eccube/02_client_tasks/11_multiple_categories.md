---
title: "11. Multiple Categories"
description: "> 「管理画面の商品登録・編集画面で、1つの商品に対して複数のカテゴリ（例: 『トップス』と『セール対象品』と『春物新作』）を同時に紐付けられるようにし、どのカテゴリの一覧ページからでもその商品が表示されるようにしてください。」"
---

## Task 11: 商品カテゴリを複数選択できるようにしてください (Multiple Categories Assignment)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「管理画面の商品登録・編集画面で、1つの商品に対して複数のカテゴリ（例: 『トップス』と『セール対象品』と『春物新作』）を同時に紐付けられるようにし、どのカテゴリの一覧ページからでもその商品が表示されるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်းတစ်ခုကို Category တစ်ခုတည်းသာမက **Category အများအပြား (Multiple Categories)** နှင့် ချိတ်ဆက်နိုင်ရန် (ဥပမာ - အင်္ကျီ ကဏ္ဍ၊ Sale ကဏ္ဍ နှင့် အသစ်ရောက် ကဏ္ဍ ၃ ခုလုံးတွင် တပြိုင်နက် ပါဝင်စေရန်) Admin Form နှင့် Data Model ကို စီမံခန့်ခွဲခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. EC-CUBE ၏ Entity Relationship (ManyToMany via Intermediate Entity)
- EC-CUBE တွင် `Product` နှင့် `Category` တို့သည် တိုက်ရိုက် ManyToMany မဟုတ်ဘဲ `ProductCategory` (`dtb_product_category`) ဟူသော ကြားခံ Entity ဖြင့် ချိတ်ဆက်ထားပါသည်။
- ၎င်းသည် `product_id` နှင့် `category_id` တို့ကို အတွဲလိုက် သိမ်းဆည်းပေးသောကြောင့် ပစ္စည်းတစ်ခုတွင် Category အများအပြား ရှိနိုင်ပြီးသား ဖြစ်သည်။

### 2. Symfony Form `EntityType` (`multiple => true`)
- Admin Form (`ProductType`) တွင် Category Field ကို Multi-Select (သို့မဟုတ် Checkboxes) အဖြစ် သတ်မှတ်ပေးခြင်းဖြင့် Admin က Checkbox ကလစ်ရုံဖြင့် Database ထဲသို့ `ProductCategory` Record များကို အလိုအလျောက် ပေါင်းထည့်/ဖျက်ပစ် ပေးနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Admin Form Extension တွင် Multi-select Category သတ်မှတ်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Form/Extension/AdminProductCategoryExtension.php`

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Entity\Category;
use Eccube\Form\Type\Admin\ProductType;
use Eccube\Repository\CategoryRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;

class AdminProductCategoryExtension extends AbstractTypeExtension
{
    private CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public static function getExtendedTypes(): iterable
    {
        return [ProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // Category ရွေးချယ်မှုကို Checkbox များစွာ ရွေးနိုင်အောင် ပြင်ဆင်ခြင်း
        $builder->add('Category', EntityType::class, [
            'class' => Category::class,
            'choice_label' => 'NameWithLevel', // Hierarchy အလိုက် အဆင့်ဆင့် ပြသရန်
            'choices' => $this->categoryRepository->getList(null, true),
            'multiple' => true,
            'expanded' => true, // Checkbox UI ပုံစံဖြင့် ပြသရန်
            'mapped' => false,  // Controller တွင် ProductCategory အဖြစ် ကိုယ်တိုင် sync ပြုလုပ်ရန်
            'required' => false,
            'label' => 'カテゴリ設定（複数選択可）',
        ]);
    }
}
```

---

### အဆင့် ၂: Form Submission တွင် ProductCategory များ Sync လုပ်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/AdminProductCategorySubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\ProductCategory;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class AdminProductCategorySubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'eccube.event.admin.product.edit.complete' => 'onProductSaveComplete',
        ];
    }

    public function onProductSaveComplete(EventArgs $event): void
    {
        $product = $event->getArgument('Product');
        $form = $event->getArgument('form');

        $categories = $form->get('Category')->getData();
        if ($categories === null) {
            return;
        }

        // ရှိပြီးသား Category ဆက်သွယ်မှုများကို ရှင်းလင်းခြင်း (သို့မဟုတ် Differential Sync)
        foreach ($product->getProductCategories() as $pc) {
            $this->entityManager->remove($pc);
        }
        $this->entityManager->flush();

        // ရွေးချယ်လိုက်သော Category အသစ်များကို ProductCategory အဖြစ် ထည့်သွင်းခြင်း
        foreach ($categories as $category) {
            $productCategory = new ProductCategory();
            $productCategory->setProduct($product);
            $productCategory->setCategory($category);
            $this->entityManager->persist($productCategory);
        }

        $this->entityManager->flush();
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Category Hierarchy (親カテゴリと子カテゴリ):**  
   ဂျပန် EC Site များတွင် Parent Category (ဥပမာ - 洋服) နှင့် Child Category (ဥပမာ - Tシャツ) ၂ ခုလုံးကို အလိုအလျောက် ရွေးချယ်ပေးစေလိုသော Custom Requirement များ ရှိတတ်ပါသည်။
2. **Breadcrumb (パンくずリスト):**  
   Category ၃ ခု ချိတ်ထားပါက Detail Page ရှိ Breadcrumb တွင် မည်သည့် Category လမ်းကြောင်းကို အဓိက (Primary Category) ပြသမလဲဆိုသည်ကို Client နှင့် ကြိုတင် အတည်ပြု ဆွေးနွေးရပါမည်။
