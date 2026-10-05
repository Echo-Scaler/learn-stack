---
title: "36. Purchase History Recommendation"
description: "> 「トップページやマイページにおいて、お客様の過去の『購入履歴』を自動分析し、『この商品を購入した人はこちらの商品も購入しています（併せ買いレコメンド）』や『あなたへのおすすめ商品』をレコメンドエンジンとして自動算出してフロントエンドに表示してください。」"
---

## Task 36: 購入履歴に基づくおすすめレコメンドエンジン (Purchase History Recommendation Engine)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「トップページやマイページにおいて、お客様の過去の『購入履歴』を自動分析し、『この商品を購入した人はこちらの商品も購入しています（併せ買いレコメンド）』や『あなたへのおすすめ商品』をレコメンドエンジンとして自動算出してフロントエンドに表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဝယ်ယူသူ၏ ယခင်က ဝယ်ယူခဲ့ဖူးသော **အော်ဒါမှတ်တမ်း (Purchase History)** ကို အခြေခံပြီး "ဤပစ္စည်းကို ဝယ်သူများသည် အောက်ပါပစ္စည်းများကိုလည်း တွဲဖက်ဝယ်ယူလေ့ရှိပါသည် (Collaborative Filtering / Association Rules)" ဟူသော **အကြံပြုချက်စနစ် (Recommendation Engine)** ကို အလိုအလျောက် တွက်ချက် ပြသပေးခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Collaborative Filtering & Cross-selling (レコメンドによる併せ買い促進)
- Amazon ကဲ့သို့သော E-commerce စနစ်များတွင် အကြံပြု ကုန်ပစ္စည်းများသည် စုစုပေါင်း ရောင်းအား၏ ၃၀% ကျော်ကို အထောက်အကူ ပြုပါသည်။ ဝယ်ယူသူ၏ စိတ်ဝင်စားမှုနှင့် ကိုက်ညီသော ပစ္စည်းများကို ပေါင်းစပ်ပြသခြင်းဖြင့် ပျမ်းမျှ ဝယ်ယူငွေ (客単価) ကို တိုးတက်စေသည်။

### 2. Co-occurrence Matrix Analysis (共起分析) Architecture
- Algorithm:
  1. Login User ဝယ်ယူခဲ့သော Product IDs များကို စုစည်းခြင်း။
  2. အဆိုပါ Product IDs များကို အခြား Customer များ ဝယ်ယူခဲ့သော Order များထဲတွင် ရှာဖွေခြင်း။
  3. အဆိုပါ Order များထဲ၌ အတူတူ တွဲဖက်ပါဝင်မှု အများဆုံး (Co-purchased) ပစ္စည်းများကို အကြိမ်ရေ (`COUNT`) အလိုက် စီတန်းရယူခြင်း။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Recommendation Service & Repository Logic ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/ProductRecommendationRepository.php`

```php
<?php

namespace Customize\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\Customer;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Master\ProductStatus;
use Eccube\Entity\Product;

class ProductRecommendationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * 会員の購入履歴に基づき、併せ買い頻度の高いおすすめ商品を取得する
     *
     * @param Customer $customer
     * @param int $limit
     * @return Product[]
     */
    public function getRecommendationsForCustomer(Customer $customer, int $limit = 6): array
    {
        $em = $this->getEntityManager();

        // ၁။ User ယခင်က ဝယ်ယူခဲ့ပြီးသော ကုန်ပစ္စည်း ID များကို ရယူခြင်း
        $boughtProductIds = $em->createQuery('
            SELECT DISTINCT IDENTITY(oi.Product)
            FROM Eccube\Entity\OrderItem oi
            INNER JOIN oi.Order o
            WHERE o.Customer = :customer
            AND o.OrderStatus != :cancelStatus
            AND oi.Product IS NOT NULL
        ')
        ->setParameter('customer', $customer)
        ->setParameter('cancelStatus', OrderStatus::CANCEL)
        ->getSingleColumnResult();

        if (empty($boughtProductIds)) {
            // ဝယ်ဖူးခြင်း မရှိသေးပါက ရောင်းအားအကောင်းဆုံး ပစ္စည်းများကို အစားထိုးပြသခြင်း
            return $this->findBy(['Status' => ProductStatus::DISPLAY_SHOW], ['update_date' => 'DESC'], $limit);
        }

        // ၂။ User ဝယ်ခဲ့သော ပစ္စည်းများပါဝင်သည့် အခြား Customer များ၏ အော်ဒါများကို ရှာပြီး
        // ၎င်းတို့နှင့် အတူ တွဲဖက်ဝယ်ယူလေ့ရှိသော ပစ္စည်းများကို Frequency အလိုက် အဆင့်သတ်မှတ်ခြင်း
        $dql = '
            SELECT p, COUNT(other_oi.id) AS HIDDEN freq
            FROM Eccube\Entity\OrderItem base_oi
            INNER JOIN base_oi.Order o
            INNER JOIN o.OrderItems other_oi
            INNER JOIN other_oi.Product p
            WHERE base_oi.Product IN (:boughtIds)
            AND other_oi.Product NOT IN (:boughtIds)
            AND o.OrderStatus != :cancelStatus
            AND p.Status = :status
            GROUP BY p.id
            ORDER BY freq DESC
        ';

        return $em->createQuery($dql)
            ->setParameter('boughtIds', $boughtProductIds)
            ->setParameter('cancelStatus', OrderStatus::CANCEL)
            ->setParameter('status', ProductStatus::DISPLAY_SHOW)
            ->setMaxResults($limit)
            ->getResult();
    }
}
```

---

### အဆင့် ၂: Frontend Twig တွင် Recommendation Section ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Mypage/index.twig` (သို့မဟုတ် Top Page)

```twig
{# あなたへのおすすめ商品（購入履歴分析） #}
{% if recommendations is defined and recommendations|length > 0 %}
    <div class="ec-recommendationSection mt-5 pt-4 border-top">
        <h3 class="text-center font-weight-bold mb-3">
            <i class="fas fa-magic text-warning"></i> お客様の購入履歴からのおすすめ
        </h3>
        <p class="text-center text-muted small mb-4">過去のご注文傾向から、あなたにぴったりの商品をピックアップしました。</p>
        <div class="row">
            {% for item in recommendations %}
                <div class="col-6 col-md-4 col-lg-2 mb-3">
                    <div class="card h-100 border-0 shadow-sm">
                        <a href="{{ url('product_detail', {'id': item.id}) }}">
                            <img src="{{ asset(item.main_list_image|no_image_product, 'save_image') }}" class="card-img-top" alt="{{ item.name }}">
                        </a>
                        <div class="card-body p-2 text-center">
                            <p class="small text-truncate mb-1">
                                <a href="{{ url('product_detail', {'id': item.id}) }}" class="text-dark">{{ item.name }}</a>
                            </p>
                            <span class="font-weight-bold text-danger">{{ item.getPrice02IncTaxMin|price }}</span>
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

1. **Cold Start Problem (新規顧客への対策):**  
   အကောင့်ဖွင့်စ ဝယ်ယူဖူးခြင်းမရှိသေးသော User များအတွက် Purchase History မရှိပါက Empty မဖြစ်စေရန် Fallback အနေဖြင့် "ရောင်းအားအကောင်းဆုံး Ranking (Task 37)" သို့မဟုတ် "အသစ်ရောက်ပစ္စည်းများ" ကို ပြသပေးရပါမည်။
2. **Nightly Batch Pre-computation:**  
   အော်ဒါသန်းချီရှိသော Enterprise Site များတွင် ဤ Self-join Query ကို Request တိုင်း run ပါက Database အလွန်လေးလံနိုင်ပါသည်။ ညစဉ် Batch Job ဖြင့် ရလဒ်များကို `dtb_customer_recommendation` table ထဲတွင် ကြိုတင်တွက်ချက် သိမ်းဆည်းထားသင့်ပါသည်။
