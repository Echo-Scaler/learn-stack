---
title: "06. Top Client Tasks And Troubleshooting"
description: "ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော Performance Tuning လုပ်ငန်းစဉ် ၅ ခုနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်းပုံများ ဖ"
---

## 06. Top Client Tasks & Troubleshooting (လက်တွေ့ ပြင်ဆင်နည်းများ)

ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော Performance Tuning လုပ်ငန်းစဉ် ၅ ခုနှင့် လက်တွေ့ ကုဒ်ရေးသား ဖြေရှင်းပုံများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: ကုန်ပစ္စည်း စာရင်းမျက်နှာပြင် ၅ စက္ကန့်ကျော် လေးလံနေခြင်းကို ၀.၄ စက္ကန့်အောက် ရောက်အောင် မြန်ဆန်စေခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「商品一覧ページ（50件表示）の表示に5秒以上かかっており、お客様の離脱が多発しています。1秒未満でサクサク表示できるように高速化してください。」
> (ကုန်ပစ္စည်း ၅၀ ပြသထားသော စာရင်းမျက်နှာပြင်သည် ပွင့်ရန် ၅ စက္ကန့်ကျော် ကြာမြင့်နေပြီး ဝယ်သူများ ထွက်ခွာမှု များပြားနေပါသည်။ ၁ စက္ကန့်အောက် အမြန်နှုန်းဖြင့် ပေါ့ပါးစွာ ပွင့်လာအောင် ပြင်ဆင်ပေးပါ။)

### 🔍 အကြောင်းအရင်း ရှာဖွေတွေ့ရှိချက်:
Twig ထဲတွင် Product တစ်ခုချင်းစီ၏ ဓာတ်ပုံ၊ ဈေးနှုန်းအတန်းအစားနှင့် Tag များကို Loop ပတ်ခေါ်ယူနေသဖြင့် Page ၁ ခုအတွက် Database Query ပေါင်း ၂၀၄ ကြိမ် Run နေသည် (N+1 ပြဿနာ)။

### 🛠️ Before vs After ကုဒ်ဖြင့် ပြင်ဆင်နည်း:

#### ❌ BEFORE (မူလ နှေးကွေးနေသော ကုဒ် - 5.2 စက္ကန့်၊ Queries: 204 ကြိမ်):
```php
// ProductRepository တွင် Entity တစ်ခုတည်းကိုသာ Select လုပ်ထားသည်
$qb = $this->createQueryBuilder('p')
    ->where('p.Status = 1')
    ->orderBy('p.create_date', 'DESC');
// Twig ထဲတွင် p.ProductImage, p.ProductClasses များကို သီးခြား query များဖြင့် ခေါ်ယူနေသည်
```

#### ✅ AFTER (Eager Loading ဖြင့် ပြင်ဆင်ပြီးကုဒ် - 0.38 စက္ကန့်၊ Queries: 1 ကြိမ်တည်း):
```php
namespace Customize\Repository;

use Doctrine\ORM\QueryBuilder;
use Eccube\Repository\ProductRepository;

class FastProductRepository extends ProductRepository
{
    public function getFastProductListQuery(): QueryBuilder
    {
        return $this->createQueryBuilder('p')
            // ဆက်စပ် ဇယားများအားလုံးကို တစ်ခါတည်း JOIN ဆွဲခြင်း
            ->leftJoin('p.ProductImage', 'pi')
            ->leftJoin('p.ProductClasses', 'pc')
            ->leftJoin('pc.TaxRule', 'tr')
            ->leftJoin('p.ProductTag', 'pt')
            ->leftJoin('pt.Tag', 't')
            // addSelect ဖြင့် ဒေတာအားလုံးကို Memory ထဲ တပြိုင်နက် သိမ်းစေခြင်း
            ->addSelect('pi')
            ->addSelect('pc')
            ->addSelect('tr')
            ->addSelect('pt')
            ->addSelect('t')
            ->where('p.Status = 1')
            ->orderBy('p.create_date', 'DESC');
    }
}
```
**ရလဒ်**: Database Query ပေါင်း ၂၀၄ ကြိမ်မှ **၁ ကြိမ်တည်းသို့ ကျဆင်းသွားပြီး**၊ Response Time သည် **၅.၂ စက္ကန့်မှ ၀.၃၈ စက္ကန့်သို့ (၁၃ ဆကျော်)** ပိုမိုမြန်ဆန်သွားပါသည်။

---

## 📌 Client Task 2: အော်ဒါ ၁ သိန်းကျော် CSV ထုတ်ရာတွင် Memory Limit 500 Error တက်ခြင်းကို ဖြေရှင်းခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「管理画面から全期間の注文CSV（約12万件）をダウンロードしようとすると、真っ白な画面になり500エラー（Allowed memory size of ... exhausted）で失敗します。サーバーメモリを増やさずに解決してください。」
> (Admin မှ အော်ဒါ ၁၂၀,၀၀၀ ခန့်ရှိသော CSV ကို ထုတ်ယူရာတွင် မျက်နှာပြင်ဖြူသွားပြီး Memory Limit 500 Error တက်နေပါသည်။ ဆာဗာ RAM မတိုးဘဲ ဖြေရှင်းပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
`getResult()` ဖြင့် ဒေတာအားလုံးကို RAM ပေါ် ဆွဲတင်ခြင်း မပြုတော့ဘဲ၊ `toIterable()` Cursor နှင့် Record ၅၀၀ တိုင်းတွင် `entityManager->clear()` ရှင်းထုတ်သော **Memory-Safe Streaming** နည်းလမ်းဖြင့် ဖြေရှင်းပါသည်:

```php
public function streamOrderCsv(): StreamedResponse
{
    $response = new StreamedResponse();
    $response->setCallback(function () {
        $handle = fopen('php://output', 'w');
        fputs($handle, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel
        fputcsv($handle, ['ID', 'OrderNo', 'Total', 'Status']);

        $qb = $this->orderRepository->createQueryBuilder('o')->orderBy('o.id', 'DESC');
        
        // toIterable() သည် Database မှ Record တစ်ခုချင်းစီကို Cursor ဖြင့် ထုတ်ပေးသည်
        $iterable = $qb->getQuery()->toIterable();
        $count = 0;

        foreach ($iterable as $order) {
            fputcsv($handle, [
                $order->getId(),
                $order->getOrderNo(),
                $order->getPaymentTotal(),
                $order->getOrderStatus()->getName(),
            ]);

            $count++;
            if ($count % 500 === 0) {
                // RAM ပေါ်ရှိ UnitOfWork Memory ကို အပြီးအပိုင် ရှင်းထုတ်ခြင်း
                $this->entityManager->clear();
            }
        }
        fclose($handle);
    });

    $response->headers->set('Content-Type', 'text/csv');
    $response->headers->set('Content-Disposition', 'attachment; filename="orders.csv"');
    return $response;
}
```
**ရလဒ်**: အော်ဒါ ၁ သိန်းကျော်သော်လည်း RAM အသုံးပြုမှုသည် **14MB တွင်သာ အမြဲငြိမ်နေပြီး** မည်သည့်အခါမျှ Memory Limit မပြည့်တော့ပါ။

---

## 📌 Client Task 3: Admin အော်ဒါရှာဖွေမှု ၈ စက္ကန့် ကြာနေခြင်းကို Composite Index ဖြင့် ဖြေရှင်းခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「管理画面の受注マスターで『対応状況』と『期間指定』で検索すると、結果が出るまで8秒以上待たされます。毎日の出荷業務に支障が出ているので高速化してください。」
> (Admin အော်ဒါရှာဖွေမှုတွင် 'အခြေအနေ' နှင့် 'ရက်စွဲ' တွဲဖက်ရှာဖွေရာတွင် ၈ စက္ကန့်ကျော် ကြာမြင့်နေပါသည်။ နေ့စဉ် ပို့ဆောင်ရေးလုပ်ငန်းများ အဆင်ပြေစေရန် အမြန်နှုန်းမြှင့်ပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
Database တွင် `(order_status_id, order_date)` အတွက် Composite Index မရှိသဖြင့် Record ၆ သိန်းလုံးကို Full Table Scan ပြုလုပ်နေခြင်း ဖြစ်သည်။

Doctrine Migration ဖြင့် ပေါင်းစပ် Index တပ်ဆင်ခြင်း:
```php
public function up(Schema $schema): void
{
    // dtb_order ဇယားတွင် ပေါင်းစပ် Index ဖန်တီးခြင်း
    $this->addSql('CREATE INDEX idx_order_status_and_date ON dtb_order (order_status_id, order_date)');
}
```
**ရလဒ်**: ရှာဖွေချိန်သည် **၈.၄ စက္ကန့်မှ ၀.၀၄ စက္ကန့်သို့ ကျဆင်းသွားပြီး (အဆ ၂၀၀ ပိုမိုမြန်ဆန်သွားပါသည်)**။

---

## 📌 Client Task 4: အရောင်းပွဲတော် (Sale) ကာလ ဆာဗာဒေါင်းကျခြင်းမှ ကာကွယ်ရန် Redis Cache တပ်ဆင်ခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「セール開催時に同時アクセスが急増し、データベースのCPUが100%に達してサイトがダウンしてしまいます。アクセス集中に耐えられるキャッシュ設計を導入してください。」
> (Sale ကာလတွင် ဝင်ရောက်သူ များပြားလာပြီး Database CPU 100% ဖြစ်ကာ ဆိုက်ပျက်ကျသွားပါသည်။ Traffic များပြားမှုကို ခံနိုင်ရည်ရှိသော Cache စနစ် ထည့်သွင်းပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
1. Session များကို Database အစား Redis ပေါ်သို့ ရွှေ့ပြောင်းခြင်း။
2. အဝင်အများဆုံးဖြစ်သော Category Navigation နှင့် Banner ဒေတာများကို Redis Result Cache (TTL: 1 နာရီ) ဖြင့် သိမ်းဆည်းခြင်း:

```php
$query->enableResultCache(3600, 'global_category_navigation');
```
**ရလဒ်**: Database သို့ သွားရောက်မေးမြန်းမှု ၇၅% လျော့ကျသွားပြီး ဆာဗာ CPU အသုံးပြုမှုမှာ ၉၀% မှ ၁၅% သို့ ကျဆင်းသွားသဖြင့် Traffic ဒဏ်ကို အေးဆေးစွာ ခံနိုင်ရည်ရှိသွားပါသည်။

---

## 📌 Client Task 5: Mobile PageSpeed Insights ရမှတ် ၃၀ မှ ၈၅ အထက်သို့ တက်အောင် Image Optimization ပြုလုပ်ခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「Google PageSpeed Insights でモバイルのスコアが30点（赤色）で、SEOに悪影響が出ています。画像最適化を行い、スコアを80点以上（緑色/黄色）に改善してください。」
> (Google PageSpeed Insights တွင် Mobile ရမှတ် ၃၀ သာ ရရှိနေပြီး SEO ထိခိုက်နေပါသည်။ ဓာတ်ပုံများကို အကောင်းဆုံးဖြစ်အောင် ပြုပြင်ပြီး ရမှတ် ၈၀ ကျော်အထိ တက်အောင် လုပ်ပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
1. **WebP သို့ ပြောင်းလဲခြင်း**: ပုံရိပ်အားလုံးကို WebP ဖော်မတ်သို့ ပြောင်းလဲပြီး အရွယ်အစား ၇၀% လျှော့ချခြင်း။
2. **Native Lazy Loading ထည့်သွင်းခြင်း**: ပစ္စည်းစာရင်း ဓာတ်ပုံများတွင် `loading="lazy"` ထည့်သွင်းခြင်း။
3. **Cumulative Layout Shift (CLS) ကာကွယ်ခြင်း**: `<img>` တိုင်းတွင် တိကျသော `width="300" height="300"` သတ်မှတ်ပေးခြင်း။

```twig
{# Optimized Image Tag #}
<img src="{{ asset(Product.ProductImage[0].file_name ~ '.webp', 'save_image') }}"
     alt="{{ Product.name }}"
     loading="lazy"
     width="300"
     height="300"
     decoding="async"
     class="img-fluid">
```
**ရလဒ်**: Page Size သည် 8.5 MB မှ 1.8 MB သို့ ကျဆင်းသွားပြီး Mobile PageSpeed ရမှတ်သည် **၃၂ မှတ်မှ ၈၈ မှတ်သို့** ထိုးတက်သွားပါသည်။
