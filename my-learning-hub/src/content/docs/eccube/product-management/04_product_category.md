---
title: "04. Product Category"
description: "> Client Requirement: ဆိုင်မှာ ရောင်းချတဲ့ ကုန်ပစ္စည်းတွေကို အုပ်စုလိုက် အမျိုးအစားခွဲ (ဥပမာ- Mens ➔ T-Shirts, Womens ➔ Skirts) သတ်မှတ်နိုင်ရမည်။ Category တွေက"
---

## 04 - Product Category Management (ကုန်ပစ္စည်း Category စီမံခြင်း)

> **Client Requirement**: "ဆိုင်မှာ ရောင်းချတဲ့ ကုန်ပစ္စည်းတွေကို အုပ်စုလိုက် အမျိုးအစားခွဲ (ဥပမာ- Mens ➔ T-Shirts, Womens ➔ Skirts) သတ်မှတ်နိုင်ရမည်။ Category တွေကို အဆင့်ဆင့် (Parent-Child Hierarchy) ပြုလုပ်နိုင်ရမည်ဖြစ်ပြီး ကုန်ပစ္စည်းတစ်ခုကို Category တစ်ခုထက်မက (Multi-category) ချိတ်ဆက်နိုင်ရမည်။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. **အဆင့်ဆင့် အမျိုးအစား ခွဲခြားခြင်း**: ပင်မ Category (Parent) နှင့် လက်အောက်ခံ Category (Child/Sub-category) များကို အကန့်အသတ်မရှိ (သို့မဟုတ် အဆင့် ၅ ဆင့်အထိ) ထည့်သွင်းလိုခြင်း။
2. **Multi-category Assignment**: ကုန်ပစ္စည်းတစ်ခုတည်းကို "အသစ်ရောက်ပစ္စည်းများ (New Arrivals)" Category ထဲတွင်ရော "အမျိုးသားဝတ် (Men's Fashion)" ထဲတွင်ပါ တစ်ပြိုင်နက် ပြသလိုခြင်း။
3. **Category Tree Drag-and-Drop**: Admin Dashboard မှ Category နေရာများကို Mouse ဖြင့် ဆွဲရွှေ့ပြီး အစီအစဉ် (Sort Order) ပြောင်းလဲလိုခြင်း။
4. **Breadcrumbs (パンくずリスト)**: ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာတွင် `Home > Fashion > Men > T-Shirt` ပုံစံ လမ်းကြောင်းပြသပေးရန်။

---

## 🏛️ EC-CUBE Implementation Architecture

EC-CUBE တွင် Category စနစ်ကို **Self-Referencing Hierarchical Tree** နှင့် **Many-to-Many Join Entity** ဖြင့် တည်ဆောက်ထားပါသည်:

```
[dtb_category] (Self-referencing Tree)
├── id: 1 (Men's) ──── parent_category_id: NULL, hierarchy: 1
│    ├── id: 3 (T-Shirts) ── parent_category_id: 1, hierarchy: 2
│    └── id: 4 (Jeans) ──── parent_category_id: 1, hierarchy: 2
└── id: 2 (Women's) ── parent_category_id: NULL, hierarchy: 1

                   │
                   ▼ (Many-to-Many Relationship via Join Entity)
        [dtb_product_category]
        ├── product_id: 101, category_id: 3 (T-Shirts)
        └── product_id: 101, category_id: 9 (Sale Items)
                   │
                   ▼
             [dtb_product]
             └── id: 101 (Men's Graphic Tee)
```

### သက်ဆိုင်ရာ အဓိက ဖိုင်များ:
- **Admin Category Controller**: `src/Eccube/Controller/Admin/Product/CategoryController.php`
- **Category Entity**: `src/Eccube/Entity/Category.php`
- **ProductCategory Join Entity**: `src/Eccube/Entity/ProductCategory.php`
- **Category Repository**: `src/Eccube/Repository/CategoryRepository.php`

---

## 🗄️ Database Tables & Schema

### ၁။ `dtb_category` ဇယား (Category များ သိမ်းသည့်နေရာ)
```sql
CREATE TABLE dtb_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_category_id INT NULL,           -- အထက် Category ID (Self-referencing FK)
    name VARCHAR(255) NOT NULL,            -- Category အမည်
    hierarchy INT NOT NULL,                -- အဆင့် (1 = Root, 2 = Child, 3 = Sub-child)
    sort_no INT NOT NULL,                  -- အစီအစဉ် ပြသရန် နံပါတ်
    create_date DATETIME NOT NULL,
    update_date DATETIME NOT NULL,
    discriminator_type VARCHAR(255) NOT NULL
);
```

### ၂။ `dtb_product_category` ဇယား (ကုန်ပစ္စည်းနှင့် Category ကြား ချိတ်ဆက်မှု)
```sql
CREATE TABLE dtb_product_category (
    product_id INT NOT NULL,               -- Foreign Key -> dtb_product.id
    category_id INT NOT NULL,              -- Foreign Key -> dtb_category.id
    PRIMARY KEY (product_id, category_id)
);
```

---

## 📝 အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Step-by-Step Flow)

### အဆင့် ၁: Admin မှ Category သစ် တည်ဆောက်ခြင်း
Admin က **商品管理 ➔ カテゴリ管理 (Category Management)** သို့ သွားရောက်ပြီး Category အသစ် ထည့်သွင်းသည့်အခါ:
1. ပင်မ Category ဖြစ်ပါက `parent_category_id = NULL` နှင့် `hierarchy = 1` အဖြစ် သတ်မှတ်သည်။
2. Sub-category ဖြစ်ပါက မိခင် Category ၏ `hierarchy + 1` ကို တွက်ချက်ထည့်သွင်းသည်။

```php
// CategoryController.php (Category အသစ် ထည့်ခြင်း အတိုကောက်)
$Category = new Category();
$Category->setName($form->get('name')->getData());
$Category->setParent($ParentCategory);
$Category->setHierarchy($ParentCategory ? $ParentCategory->getHierarchy() + 1 : 1);
$Category->setSortNo($this->categoryRepository->getNextSortNo($ParentCategory));

$this->entityManager->persist($Category);
$this->entityManager->flush();
```

### အဆင့် ၂: ကုန်ပစ္စည်း တင်သည့်အခါ Category ရွေးချယ်ခြင်း
ကုန်ပစ္စည်း အသစ်ထည့်သည့် Form (`ProductType.php`) တွင် Category များကို Tree ပုံစံ Checkbox သို့မဟုတ် Select Box ဖြင့် ရွေးချယ်ခွင့် ပေးထားပါသည်:

```php
// ProductType.php
$builder->add('Category', CategoryType::class, [
    'class' => Category::class,
    'multiple' => true,      // ကုန်ပစ္စည်း တစ်ခုတည်းကို Category အများအပြား ရွေးခွင့်ပေးသည်
    'expanded' => true,      // Checkbox ပုံစံဖြင့် ပြသသည်
    'mapped' => false,       // ProductCategory Join Entity နှင့် သီးခြား ချိတ်ဆက်သည်
]);
```

### အဆင့် ၃: Database ထဲသို့ ချိတ်ဆက်မှုများ သိမ်းဆည်းခြင်း
Admin က ကုန်ပစ္စည်းကို Save လုပ်သောအခါ EC-CUBE သည် `dtb_product_category` ဇယားထဲရှိ မူလ Category ချိတ်ဆက်မှုများကို ဖျက်ပြီး အသစ်ရွေးချယ်ထားသော Category များကို Row အသစ်များအဖြစ် ပြန်လည် Insert ပြုလုပ်ပါသည်:

```php
// ProductEditController.php
// မူလရှိပြီးသား ProductCategory များကို ရှင်းထုတ်ခြင်း
foreach ($Product->getProductCategories() as $ProductCategory) {
    $Product->removeProductCategory($ProductCategory);
    $this->entityManager->remove($ProductCategory);
}

// ရွေးချယ်ထားသော Category အသစ်များကို ထည့်သွင်းခြင်း
foreach ($categories as $Category) {
    $ProductCategory = new ProductCategory();
    $ProductCategory->setProduct($Product);
    $ProductCategory->setCategory($Category);
    $Product->addProductCategory($ProductCategory);
    $this->entityManager->persist($ProductCategory);
}
```

---

## ⚡ Client တောင်းဆိုလေ့ရှိသော အထူး Requirement: Breadcrumbs (လမ်းကြောင်းပြစနစ်)

Website ၏ Product Detail စာမျက်နှာတွင် Breadcrumbs ပြသရန်အတွက် Twig Template တွင် အောက်ပါအတိုင်း ရေးသားနိုင်ပါသည်:

```twig
{# Resource/template/default/Product/detail.twig #}
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ url('homepage') }}">Home</a></li>
        {% if Product.ProductCategories|length > 0 %}
            {# ပထမဆုံး ရွေးချယ်ထားသော Category ၏ မိဘ အဆင့်ဆင့်ကို လိုက်လံထုတ်ယူခြင်း #}
            {% set MainCategory = Product.ProductCategories[0].Category %}
            {% for Parent in MainCategory.path %}
                <li class="breadcrumb-item">
                    <a href="{{ url('product_list') }}?category_id={{ Parent.id }}">{{ Parent.name }}</a>
                </li>
            {% endfor %}
            <li class="breadcrumb-item active">{{ MainCategory.name }}</li>
        {% endif %}
        <li class="breadcrumb-item active" aria-current="page">{{ Product.name }}</li>
    </ol>
</nav>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **カテゴリ (Kategori)**: Category (ကုန်ပစ္စည်း အမျိုးအစား)
- **親カテゴリ (Oya Kategori)**: Parent Category (မိခင်/ပင်မ အမျိုးအစား)
- **子カテゴリ (Ko Kategori)**: Child / Sub-category (လက်အောက်ခံ အမျိုးအစား)
- **階層 (Kaisou)**: Hierarchy Level (အဆင့်ဆင့် အခွဲအပြား)
- **パンくずリスト (Pankuzu Risuto)**: Breadcrumbs Navigation (စာမျက်နှာ လမ်းကြောင်းပြ)
