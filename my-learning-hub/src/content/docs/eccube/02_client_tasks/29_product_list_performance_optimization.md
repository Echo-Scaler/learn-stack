---
title: "29. Product List Performance Optimization"
description: "> 「商品数が数千件を超えたあたりから、商品一覧ページ（Product/list）の読み込み速度が4〜5秒以上かかり非常に重くなっています。データベースクエリの無駄（N+1問題）の解消、適切なインデックス（INDEX）の追加、キャッシュの活用により、表示速度を1秒以内に高速化してください。」"
---

## Task 29: 商品一覧の表示速度を改善してください (Product List Performance Optimization)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品数が数千件を超えたあたりから、商品一覧ページ（Product/list）の読み込み速度が4〜5秒以上かかり非常に重くなっています。データベースクエリの無駄（N+1問題）の解消、適切なインデックス（INDEX）の追加、キャッシュの活用により、表示速度を1秒以内に高速化してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်း အရေအတွက် များပြားလာသောအခါ Product List Page သည် Load လုပ်ချိန် အလွန်နှေးကွေး (၄ စက္ကန့်ကျော်) လာသဖြင့် **N+1 Query များကို ရှင်းလင်းခြင်း၊ Database Index တပ်ဆင်ခြင်းနှင့် Query Cache အသုံးပြုခြင်း** ဖြင့် ၁ စက္ကန့်အောက်သို့ အမြန်ဆုံး အဆင့်မြှင့်တင်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. N+1 Query Problem Diagnosis & Eager Loading
- ကုန်ပစ္စည်း ၂၀ ပြသရာတွင် Product တစ်ခုချင်းစီ၏ ပုံများ (`ProductImage`)၊ 规格များ (`ProductClass`) နှင့် အမျိုးအစားများ (`ProductCategory`) ကို Loop ပတ်ပြီး သီးခြား Query ဖြင့် လိုက်လံဆွဲယူနေပါက SQL Query အကြိမ် ၁၀၀ ကျော် ထွက်ပေါ်လာမည်ဖြစ်သည်။
- **အဖြေ:** QueryBuilder တွင် `leftJoin` နှင့် `addSelect` ကို အသုံးပြုကာ **Eager Loading (တစ်ခုတည်းသော Query ဖြင့် ဆက်စပ် Data အားလုံး ကြိုဆွဲယူခြင်း)** ပြုလုပ်ရပါမည်။

### 2. Composite Database Index (複合インデックス)
- ကုန်ပစ္စည်း ရှာဖွေရာတွင် `WHERE status_id = 1 AND del_flg = 0 ORDER BY create_date DESC` ဟု စစ်ဆေးလေ့ရှိရာ အဆိုပါ Column များကို Composite Index မတပ်ဆင်ထားပါက Database Engine က Full Table Scan (သောင်းချီသော Record များကို တစ်ခုချင်း ဖတ်ရခြင်း) ဖြစ်ပေါ်စေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Symfony Debug Toolbar ဖြင့် Query များကို စစ်ဆေးခြင်း
1. `.env` တွင် `APP_ENV=dev` ထားရှိပြီး Browser အောက်ခြေရှိ Symfony WebProfiler Bar ကို ကြည့်ပါ။
2. Database Icon တွင် Queries အရေအတွက် (ဥပမာ - 120 queries in 3,500 ms) ကို စစ်ဆေးပြီး ထပ်ခါတလဲလဲ ထွက်နေသော Query များကို ရှာဖွေပါ။

---

### အဆင့် ၂: QueryCustomizer ဖြင့် Eager Loading (`addSelect`) ပေါင်းထည့်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/ProductListOptimizationCustomizer.php`

```php
<?php

namespace Customize\Repository;

use Eccube\Doctrine\Query\QueryCustomizer;
use Doctrine\ORM\QueryBuilder;

class ProductListOptimizationCustomizer implements QueryCustomizer
{
    public function customize(QueryBuilder $builder, array $params, array $handling): void
    {
        // ProductImages, ProductClasses, Categories များကို တစ်ပြိုင်နက် Eager Load လုပ်ဆောင်ခြင်း
        $builder
            ->leftJoin('p.ProductImage', 'pi')
            ->addSelect('pi')
            ->leftJoin('p.ProductClasses', 'pc_all')
            ->addSelect('pc_all')
            ->leftJoin('p.ProductCategories', 'pct')
            ->addSelect('pct')
            ->leftJoin('pct.Category', 'c')
            ->addSelect('c');
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\ProductRepository\getQueryBuilderBySearchData';
    }
}
```

---

### အဆင့် ၃: Database Index များ ထည့်သွင်းခြင်း (Doctrine Migration)
ဖိုင်တည်နေရာ: `app/Customize/DoctrineMigrations/VersionYYYYMMDD_AddProductPerformanceIndexes.php`

```php
<?php

namespace Customize\DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class VersionYYYYMMDD_AddProductPerformanceIndexes extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Product ဇယားတွင် Status, DelFlg, CreateDate အတွက် Composite Index တပ်ဆင်ခြင်း
        $this->addSql('CREATE INDEX idx_dtb_product_status_date ON dtb_product (product_status_id, update_date DESC)');
        
        // ProductClass တွင် Product ID နှင့် Price အတွက် Index တပ်ဆင်ခြင်း
        $this->addSql('CREATE INDEX idx_dtb_product_class_price ON dtb_product_class (product_id, price02)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_dtb_product_status_date ON dtb_product');
        $this->addSql('DROP INDEX idx_dtb_product_class_price ON dtb_product_class');
    }
}
```

Migration Run ခြင်း:
```bash
bin/console doctrine:migrations:migrate
```

---

### အဆင့် ၄: Doctrine Query Cache & Result Cache ကို အသက်သွင်းခြင်း
`config/packages/doctrine.yaml` တွင် Production Mode အတွက် Metadata & Query Cache ကို APCu သို့မဟုတ် Redis သို့ ချိတ်ဆက်ပါ:

```yaml
doctrine:
    orm:
        metadata_cache_driver:
            type: pool
            pool: doctrine.system_cache_pool
        query_cache_driver:
            type: pool
            pool: doctrine.system_cache_pool
        result_cache_driver:
            type: pool
            pool: doctrine.result_cache_pool
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Pagination Memory Overhead:**  
   `leftJoin` အများအပြား သုံးပါက Result Row အရေအတွက် တိုးပွားလာနိုင်သဖြင့် KnpPaginator / Doctrine Paginator ၏ `distinct: true` parameter ကို အသုံးပြုထားရပါမည်။
2. **Slow Query Log စစ်ဆေးရန်:**  
   MySQL / PostgreSQL တွင် Slow Query Log (`long_query_time = 1.0`) ကို ဖွင့်ထားပြီး 1 Second ထက် ကျော်လွန်နေသော SQL များကို အချိန်နှင့်တပြေးညီ Monitor ပြုလုပ်သင့်ပါသည်။
