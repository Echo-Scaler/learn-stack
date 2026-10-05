---
title: "15. Favorite Admin Screen"
description: "> 「標準のEC-CUBEにはお気に入りの管理画面が存在しないため、管理画面に『お気に入り集計・分析（Favorite Management）』ページを新設し、どのお気に入りが何人に登録されているかランキング形式で一覧表示・分析できるようにしてください。」"
---

## Task 15: お気に入り管理画面を作成してください (Favorite / Wishlist Admin Screen)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「標準のEC-CUBEにはお気に入りの管理画面が存在しないため、管理画面に『お気に入り集計・分析（Favorite Management）』ページを新設し、どのお気に入りが何人に登録されているかランキング形式で一覧表示・分析できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
EC-CUBE တွင် မူလအားဖြင့် Favorite များကို ကြည့်ရှုနိုင်သည့် Admin Page မပါဝင်သဖြင့် မည်သည့်ပစ္စည်းကို Customer မည်မျှက Favorite ပြုလုပ်ထားသည်ကို အစဉ်လိုက် ကြည့်ရှုနိုင်သော **"အကြိုက်ဆုံးပစ္စည်းများ စီမံခန့်ခွဲသည့် Admin Screen (Favorite Ranking & Management)"** ကို အသစ်တည်ဆောက်ပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Merchandising & Marketing Insights (MD 意思決定)
- ဆိုင်ရှင်များသည် မည်သည့်ပစ္စည်းများ ရောင်းအားမထွက်မီ လူကြိုက်များနေသည် (Wishlist များနေသည်) ကို သိရှိခြင်းဖြင့် Stock ကြိုတင်ဖြည့်တင်းခြင်း သို့မဟုတ် Coupon ပို့ဆောင်ခြင်း စသည့် Marketing အစီအစဉ်များကို ထိရောက်စွာ ချမှတ်နိုင်သည်။

### 2. DQL GROUP BY Aggregation ဖြင့် သန့်ရှင်းစွာ တွက်ချက်ခြင်း
- `CustomerFavoriteProduct` table မှ `Product` အလိုက် `COUNT` ပြုလုပ်ကာ Ranking စီတန်းခြင်းကို Controller + Repository + Twig စနစ်တကျ ခွဲထုတ်တည်ဆောက်ရပါမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Repository တွင် Favorite Ranking Query ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Repository/CustomerFavoriteProductAdminRepository.php`

```php
<?php

namespace Customize\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Eccube\Entity\CustomerFavoriteProduct;

class CustomerFavoriteProductAdminRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CustomerFavoriteProduct::class);
    }

    /**
     * お気に入り登録数の多い商品をランキング順に取得する
     *
     * @param int $limit
     * @return array
     */
    public function getFavoriteRanking(int $limit = 50): array
    {
        $qb = $this->createQueryBuilder('cfp')
            ->select('p.id AS product_id, p.name AS product_name, COUNT(cfp.id) AS fav_count, MAX(cfp.create_date) AS last_fav_date')
            ->innerJoin('cfp.Product', 'p')
            ->groupBy('p.id, p.name')
            ->orderBy('fav_count', 'DESC')
            ->addOrderBy('last_fav_date', 'DESC')
            ->setMaxResults($limit);

        return $qb->getQuery()->getArrayResult();
    }
}
```

---

### အဆင့် ၂: Admin Controller တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/Admin/FavoriteAdminController.php`

```php
<?php

namespace Customize\Controller\Admin;

use Customize\Repository\CustomerFavoriteProductAdminRepository;
use Eccube\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/%eccube_admin_route%/favorite")
 * @IsGranted("ROLE_ADMIN")
 */
class FavoriteAdminController extends AbstractController
{
    private CustomerFavoriteProductAdminRepository $favRepository;

    public function __construct(CustomerFavoriteProductAdminRepository $favRepository)
    {
        $this->favRepository = $favRepository;
    }

    /**
     * @Route("/ranking", name="admin_favorite_ranking", methods={"GET"})
     */
    public function ranking(): Response
    {
        $rankingData = $this->favRepository->getFavoriteRanking(50);

        return $this->render('@Customize/admin/favorite/ranking.twig', [
            'rankingData' => $rankingData,
        ]);
    }
}
```

---

### အဆင့် ၃: Admin UI Template (Twig) ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Resource/template/admin/favorite/ranking.twig`

```twig
{% extends '@admin/default_frame.twig' %}

{% set menus = ['product', 'admin_favorite_ranking'] %}

{% block title %}お気に入りランキング分析{% endblock %}
{% block sub_title %}商品管理{% endblock %}

{% block main %}
<div class="c-contentsArea__cols">
    <div class="c-contentsArea__primaryCol">
        <div class="card rounded border-0 mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="font-weight-bold">お気に入り登録数 ランキング TOP 50</span>
                <span class="badge badge-primary">集計対象: 全期間</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="text-center" style="width: 80px;">順位</th>
                                <th style="width: 100px;">商品ID</th>
                                <th>商品名</th>
                                <th class="text-right" style="width: 180px;">お気に入り登録数</th>
                                <th class="text-center" style="width: 180px;">最終登録日時</th>
                                <th class="text-center" style="width: 120px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in rankingData %}
                                <tr>
                                    <td class="text-center font-weight-bold align-middle">
                                        {% if loop.index == 1 %}
                                            <span class="badge badge-warning text-dark">🥇 1位</span>
                                        {% elseif loop.index == 2 %}
                                            <span class="badge badge-secondary">🥈 2位</span>
                                        {% elseif loop.index == 3 %}
                                            <span class="badge badge-bronze text-white" style="background:#cd7f32;">🥉 3位</span>
                                        {% else %}
                                            {{ loop.index }}
                                        {% endif %}
                                    </td>
                                    <td class="align-middle">{{ item.product_id }}</td>
                                    <td class="align-middle font-weight-bold">
                                        {{ item.product_name }}
                                    </td>
                                    <td class="text-right align-middle text-danger font-weight-bold">
                                        <i class="fas fa-heart mr-1"></i> {{ item.fav_count|number_format }} 件
                                    </td>
                                    <td class="text-center align-middle text-muted small">
                                        {{ item.last_fav_date|date('Y/m/d H:i') }}
                                    </td>
                                    <td class="text-center align-middle">
                                        <a href="{{ url('admin_product_product_edit', {'id': item.product_id}) }}" class="btn btn-sm btn-outline-primary">
                                            編集
                                        </a>
                                    </td>
                                </tr>
                            {% else %}
                                <tr>
                                    <td colspan="6" class="text-center py-4 text-muted">
                                        お気に入り登録データが存在しません。
                                    </td>
                                </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Deleted Products (論理削除商品への配慮):**  
   ပစ္စည်းတစ်ခုကို Admin က ဖျက်လိုက်သော်လည်း Favorite Table ထဲတွင် ကျန်နေနိုင်ပါသည်။ ထို့ကြောင့် Query တွင် `INNER JOIN cfp.Product p` အပြင် `p.Status != 3` (廃止 / 削除済み 제외) စစ်ဆေးပေးရန် အရေးကြီးပါသည်။
2. **CSV Download တောင်းဆိုမှု:**  
   ဂျပန် Client များသည် ဤ Ranking စာရင်းကို Excel ဖြင့် ဆက်လက် သုံးသပ်လိုသဖြင့် CSV Export Button (Task 28 ပုံစံ) ကိုပါ မကြာခဏ တွဲဖက် တောင်းဆိုလေ့ရှိပါသည်။
