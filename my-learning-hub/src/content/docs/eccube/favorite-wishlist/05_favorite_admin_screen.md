---
title: "05. Favorite Admin Screen"
description: "> Client Requirements:"
---

## 05 - Favorite Admin Screen (Admin ဘက်ခြမ်း အကြိုက်ဆုံး စာရင်းနှင့် စာရင်းဇယားများ)

> **Client Requirements**:
> 1. **Favorite admin screen (Admin အကြိုက်ဆုံး စာရင်း စီမံခန့်ခွဲမှု)**: Admin Dashboard တွင် မည်သည့် ကုန်ပစ္စည်းကို Customer မည်မျှက Favorite လုပ်ထားကြောင်း စာရင်းဇယားဖြင့် ကြည့်ရှုနိုင်ရမည်။
> 2. **Product demand forecasting (ဝယ်လိုအား ခန့်မှန်းခြင်း)**: ကုန်ပစ္စည်း မထုတ်လုပ်မီ သို့မဟုတ် စတော့ မတင်မီ အကြိုက်ဆုံး မှတ်ထားသူ ဦးရေကို စစ်ဆေးပြီး ဂိုဒေါင် စတော့ ပမာဏကို ကြိုတင် ခန့်မှန်း (Demand Forecasting) နိုင်ရမည်။
> 3. **Admin Product List Column**: Admin ၏ ကုန်ပစ္စည်း စာရင်းဇယား (`admin_product`) တွင် "お気に入り数 (Favorites Count)" ကော်လံ ထည့်သွင်းပြသပေးရမည်။

---

## 🏛️ Admin Screen Architecture & Navigation

Admin Dashboard တွင် **商品管理 (Product Management)** အောက်၌ Menu အသစ်တစ်ခု ထည့်သွင်းပါသည်:

```
[Admin Sidebar]
└── 商品管理 (Product Management)
     ├── 商品一覧 (Product List) ── [Added column: Favorite Count]
     ├── 商品登録 (Add Product)
     └── お気に入り集計 (Favorite Analytics Screen) ── [NEW]
```

---

## 💻 Custom Admin Controller Implementation

`app/Plugin/FavoriteAdmin/Controller/Admin/FavoriteAdminController.php`
```php
namespace Plugin\FavoriteAdmin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class FavoriteAdminController extends AbstractController
{
    /**
     * ကုန်ပစ္စည်းအလိုက် Favorite မှတ်ထားမှု စာရင်းဇယား စာမျက်နှာ
     */
    #[Route('/%eccube_admin_route%/product/favorites', name: 'admin_product_favorites')]
    public function index(Request $request)
    {
        $em = $this->entityManager;

        // ကုန်ပစ္စည်းအလိုက် Favorite ပြုလုပ်ထားသော ဦးရေကို ဆွဲထုတ်ခြင်း
        $qb = $em->createQueryBuilder()
            ->select('p.id, p.name, p.status_id, COUNT(cfp.Customer) as favorite_count')
            ->from('Eccube\Entity\Product', 'p')
            ->leftJoin('Eccube\Entity\CustomerFavoriteProduct', 'cfp', 'WITH', 'cfp.Product = p')
            ->groupBy('p.id')
            ->orderBy('favorite_count', 'DESC');

        $pagination = $this->paginator->paginate(
            $qb,
            $request->query->getInt('page', 1),
            20
        );

        return [
            'pagination' => $pagination,
        ];
    }
}
```

---

## 🎨 Admin Twig Template (`admin/favorite_analytics.twig`)

```twig
{% extends '@admin/default_frame.twig' %}

{% block title %}お気に入り集計 (Favorite Analytics){% endblock %}

{% block main %}
<div class="c-contentsArea__cols">
    <div class="c-contentsArea__primaryCol">
        <div class="c-primaryCol">
            <div class="card rounded border-0 mb-4">
                <div class="card-header font-weight-bold">
                    商品別お気に入り登録数ランキング (Product Wishlist Analytics)
                </div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th>商品ID</th>
                                <th>商品名</th>
                                <th>公開ステータス</th>
                                <th class="text-right">お気に入り登録数 (Favorites)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in pagination %}
                                <tr>
                                    <td>{{ item.id }}</td>
                                    <td>
                                        <a href="{{ url('admin_product_product_edit', {id: item.id}) }}">
                                            {{ item.name }}
                                        </a>
                                    </td>
                                    <td>
                                        {% if item.status_id == 1 %}
                                            <span class="badge badge-success">公開</span>
                                        {% else %}
                                            <span class="badge badge-secondary">非公開</span>
                                        {% endif %}
                                    </td>
                                    <td class="text-right font-weight-bold text-danger">
                                        <i class="fa fa-heart"></i> {{ item.favorite_count }} 人
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

## 📈 စီးပွားရေးဆိုင်ရာ အကျိုးကျေးဇူး (Business Value)

1. **ပစ္စည်းသစ် ဝယ်လိုအား ကြိုတင်တိုင်းတာခြင်း (Pre-order Testing)**: ပစ္စည်းအသစ် မတင်မီ ဝဘ်ဆိုက်တွင် "Comming Soon" ဖြင့် တင်ထားပြီး Favorite လုပ်သူ မည်မျှရှိသည်ကို စစ်ဆေးကာ စတော့ မည်မျှ ထုတ်လုပ်ရမည်ကို တိကျစွာ ခန့်မှန်းနိုင်ပါသည်။
2. **အရောင်းမြှင့်တင်ရေး ပစ်မှတ်ထားခြင်း (Targeted Marketing)**: Favorite အများဆုံး ရရှိထားသော်လည်း အမှန်တကယ် မဝယ်ယူသေးသော ပစ္စည်းများကို စျေးနှုန်းအနည်းငယ် လျှော့ချ၍ Promotion ပြုလုပ်ခြင်းဖြင့် ရောင်းအားကို သိသာစွာ မြှင့်တင်နိုင်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **お気に入り集計 (Okiniiri Shuukei)**: Wishlist / Favorite Analytics
- **需要予測 (Juyou Yosoku)**: Demand Forecasting (ဝယ်လိုအား ကြိုတင်ခန့်မှန်းခြင်း)
- **マーケティング施策 (Maaketingu Shisaku)**: Marketing Measures / Strategy
- **コンバージョン率 (Konbaajon-ritsu)**: Conversion Rate (CVR)
