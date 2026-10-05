---
title: "04. Favorite Ranking And History"
description: "> Client Requirements:"
---

## 04 - Favorite Ranking & Marketing History (Favorite Ranking နှင့် Marketing စနစ်များ)

> **Client Requirements**:
> 1. **Favorite ranking (အကြိုက်ဆုံး အများဆုံး ပစ္စည်းများ Ranking)**: ဝဘ်ဆိုက်၏ Home Page တွင် Customer များ အကြိုက်ဆုံး မှတ်ထားမှု အများဆုံး ကုန်ပစ္စည်း Top 10 စာရင်းကို "お気に入りランキング" အဖြစ် ဖော်ပြပေးရမည်။
> 2. **Favorite history & Price drop notification (စျေးလျှော့သည့်အခါ အလိုအလျောက် အီးမေးလ် ပို့ခြင်း)**: Customer မှတ်ထားသော ပစ္စည်းသည် စျေးနှုန်း လျှော့ချလိုက်သည့်အခါ (Price Drop) သို့မဟုတ် ပစ္စည်းလက်ကျန် အနည်းငယ်သာ ကျန်တော့သည့်အခါ (Low Stock) ထို Customer ထံသို့ Reminder Email အလိုအလျောက် ပေးပို့နိုင်ရမည်။

---

## 🏆 1. Favorite Ranking (အကြိုက်ဆုံး အများဆုံး ပစ္စည်းများ Query)

အရောင်းရဆုံး Ranking (Sales Ranking) ကဲ့သို့ပင် Customer များ အသည်းပုံ အများဆုံး နှိပ်ထားသော ပစ္စည်းများကို `COUNT(cfp.Customer)` ဖြင့် စုစည်း၍ Ranking ထုတ်ယူပါသည်:

```php
// CustomerFavoriteProductRepository.php
public function getFavoriteRanking(int $limit = 10): array
{
    $qb = $this->createQueryBuilder('cfp')
        ->select('p as product, COUNT(cfp.Customer) as fav_count')
        ->innerJoin('cfp.Product', 'p')
        ->where('p.Status = :status') // 公開 (Published) ဖြစ်သော ပစ္စည်းများသာ
        ->setParameter('status', ProductStatus::STATUS_DISPLAY_SHOW)
        ->groupBy('p.id')
        ->orderBy('fav_count', 'DESC') // အများဆုံးမှ အနည်းဆုံးသို့ စီခြင်း
        ->setMaxResults($limit);

    return $qb->getQuery()->getResult();
}
```

### Twig Template တွင် Ranking Badge ပြသပုံ:
```twig
{# Block/favorite_ranking.twig #}
<div class="favorite-ranking-block my-5">
    <h3 class="text-center mb-4">❤️ お気に入りランキング TOP 5</h3>
    <div class="row">
        {% for item in rankingItems %}
            {% set Product = item.product %}
            <div class="col-md-2 text-center position-relative">
                {# Rank No. 1, 2, 3 Gold/Silver/Bronze Badges #}
                <span class="badge badge-warning position-absolute" style="top: 5px; left: 15px; font-size: 1.1rem;">
                    第 {{ loop.index }} 位
                </span>
                <a href="{{ url('product_detail', {id: Product.id}) }}">
                    <img src="{{ asset(Product.main_list_image, 'save_image') }}" class="img-fluid rounded mb-2">
                    <h6 class="text-truncate">{{ Product.name }}</h6>
                </a>
                <p class="text-danger font-weight-bold mb-0">{{ Product.price02IncTaxMin|number_format }} 円</p>
                <small class="text-muted"><i class="fa fa-heart text-danger"></i> {{ item.fav_count }} 人</small>
            </div>
        {% endfor %}
    </div>
</div>
```

---

## 📧 2. Favorite Marketing: 値下げ通知 (Price Drop Notification)

E-Commerce လုပ်ငန်းများတွင် Conversion Rate အမြင့်ဆုံး ရရှိသော နည်းဗျူဟာမှာ **Customer စိတ်ဝင်စားပြီးသား Favorite ပစ္စည်း စျေးကျသွားကြောင်း အသိပေးခြင်း** ဖြစ်ပါသည်။

### အလုပ်လုပ်ပုံ Workflow:
1. Admin က ကုန်ပစ္စည်းတစ်ခု၏ စျေးနှုန်းကို ¥5,000 မှ ¥3,900 သို့ လျှော့ချလိုက်သည်။
2. `ProductEditController` သို့မဟုတ် Doctrine Lifecycle Listener က စျေးနှုန်း လျော့ကျသွားကြောင်း Detect လုပ်သည်။
3. `dtb_customer_favorite_product` ထဲတွင် ထို ကုန်ပစ္စည်းကို မှတ်ထားသော Customer များ၏ Email စာရင်းကို ဆွဲထုတ်သည်။
4. အဆိုပါ Customer များဆီသို့ "お気に入りの商品が値下げされました！" အီးမေးလ် ပေးပို့သည်။

```php
// Plugin/FavoriteNotification/EventListener/PriceDropListener.php
public function checkPriceDrop(Product $Product, int $oldPrice, int $newPrice): void
{
    // စျေးနှုန်း အမှန်တကယ် လျော့ကျသွားပါက
    if ($newPrice < $oldPrice) {
        $favorites = $this->customerFavoriteProductRepository->findBy(['Product' => $Product]);

        foreach ($favorites as $favorite) {
            $Customer = $favorite->getCustomer();
            // Customer ဆီသို့ စျေးလျှော့ အီးမေးလ် ပေးပို့ခြင်း
            $this->mailService->sendPriceDropMail($Customer, $Product, $oldPrice, $newPrice);
        }
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **お気に入りランキング (Okiniiri Rankingu)**: Favorite Count Ranking
- **値下げ通知 (Nesage Tsuuchi)**: Price Drop Notification
- **再入荷通知 (Sai-nyuuka Tsuuchi)**: Back in Stock Notification
- **かご落ち / 離脱防止 (Kago-ochi / Ridatsu Boushi)**: Cart Abandonment Prevention
- **リマインドメール (Rimaindo Meeru)**: Reminder Email
