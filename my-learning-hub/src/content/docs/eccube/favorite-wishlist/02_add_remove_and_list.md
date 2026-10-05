---
title: "02. Add Remove And List"
description: "> Client Requirements:"
---

## 02 - Add, Remove & Favorite List (အကြိုက်ဆုံး ထည့်ခြင်း၊ ဖျက်ခြင်းနှင့် စာရင်းကြည့်ခြင်း)

> **Client Requirements**:
> 1. **Add favorite (အကြိုက်ဆုံး ထည့်ခြင်း)**: Customer သည် Product Detail သို့မဟုတ် List စာမျက်နှာရှိ အသည်းပုံကို နှိပ်လိုက်သည်နှင့် Page refresh ဖြစ်မသွားဘဲ ချက်ချင်း Favorite စာရင်းထဲသို့ ရောက်ရှိသွားရမည် (AJAX Toggle)။
> 2. **Remove favorite (အကြိုက်ဆုံးမှ ဖယ်ရှားခြင်း)**: မှတ်ထားပြီးသော အသည်းပုံကို ထပ်နှိပ်လိုက်ပါက စာရင်းမှ ပြန်လည် ပယ်ဖျက်ပေးရမည်။
> 3. **Favorite product list (အကြိုက်ဆုံး ပစ္စည်းများ စာရင်း)**: MyPage ထဲတွင် မိမိ စိတ်ကြိုက် မှတ်သားထားသော ပစ္စည်းများအားလုံးကို တစ်စုတစ်စည်းတည်း ကြည့်ရှုနိုင်ရမည်ဖြစ်ပြီး၊ ထိုနေရာမှတဆင့် Cart ထဲသို့ တိုက်ရိုက် ဝယ်ယူနိုင်ရမည်။

---

## ⚡ 1. AJAX Favorite Toggle Controller (ထည့်ခြင်း/ဖျက်ခြင်း Architecture)

ခေတ်မီ E-Commerce ဝဘ်ဆိုက်များတွင် Page reload မဖြစ်စေရန် AJAX Endpoint တစ်ခု တည်ဆောက်၍ Favorite ကို Toggle (ထည့်ခြင်း/ဖယ်ထုတ်ခြင်း) ပြုလုပ်ပါသည်:

```
[Customer Clicks Heart Icon on Product Card]
                    │
                    ▼ (AJAX POST /products/favorite/toggle/{id})
         [ProductController::toggleFavorite()]
                    │
                    ├── 1. Check Login (Customer is authenticated?)
                    │      └── If No: Return JSON { success: false, require_login: true }
                    │
                    ├── 2. Query dtb_customer_favorite_product
                    │      ├── If Already Exists ──► DELETE (Remove Favorite)
                    │      └── If Not Exists     ──► INSERT (Add Favorite)
                    │
                    ▼
         [Return JSON { success: true, is_favorited: true/false, count: 12 }]
                    │
                    ▼
         [DOM Updates Heart Icon: Red ❤️ <---> White 🤍]
```

---

## 💻 Controller Implementation (`ProductController.php`)

```php
namespace Eccube\Controller;

use Eccube\Entity\Customer;
use Eccube\Entity\CustomerFavoriteProduct;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/products/favorite/toggle/{id}', name: 'product_favorite_toggle', methods: ['POST'])]
    public function toggleFavorite(Request $request, int $id): JsonResponse
    {
        // ၁။ Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
        if (!$this->isGranted('ROLE_USER')) {
            return new JsonResponse([
                'success' => false,
                'require_login' => true,
                'message' => 'お気に入り登録にはログインが必要です (Login ဝင်ရန် လိုအပ်ပါသည်)',
            ], 401);
        }

        /** @var Customer $Customer */
        $Customer = $this->getUser();
        $Product = $this->productRepository->find($id);

        if (!$Product) {
            return new JsonResponse(['success' => false, 'message' => 'Product not found'], 404);
        }

        // ၂။ လက်ရှိ မှတ်ထားပြီး ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
        $Favorite = $this->customerFavoriteProductRepository->findOneBy([
            'Customer' => $Customer,
            'Product' => $Product,
        ]);

        if ($Favorite) {
            // ရှိပြီးသားဖြစ်ပါက ဖျက်ထုတ်ခြင်း (Remove)
            $this->entityManager->remove($Favorite);
            $isFavorited = false;
        } else {
            // မရှိသေးပါက အသစ် ထည့်သွင်းခြင်း (Add)
            $Favorite = new CustomerFavoriteProduct();
            $Favorite->setCustomer($Customer);
            $Favorite->setProduct($Product);
            $this->entityManager->persist($Favorite);
            $isFavorited = true;
        }

        $this->entityManager->flush();

        // ၃။ အဆိုပါ ပစ္စည်း၏ စုစုပေါင်း Favorite အရေအတွက်ကို ပြန်လည်တွက်ချက်ခြင်း
        $totalFavoriteCount = $this->customerFavoriteProductRepository->count(['Product' => $Product]);

        return new JsonResponse([
            'success' => true,
            'is_favorited' => $isFavorited,
            'favorite_count' => $totalFavoriteCount,
        ]);
    }
}
```

---

## 🎨 Front-End JavaScript (AJAX Toggle Click)

Product Card ထဲရှိ အသည်းပုံ ခလုတ်ကို နှိပ်သည့်အခါ အလုပ်လုပ်မည့် JavaScript:

```javascript
// assets/js/favorite.js
$(document).on('click', '.btn-favorite-toggle', function (e) {
    e.preventDefault();
    var $btn = $(this);
    var productId = $btn.data('product-id');
    var toggleUrl = '/products/favorite/toggle/' + productId;

    $.ajax({
        url: toggleUrl,
        type: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        success: function (res) {
            if (res.is_favorited) {
                // အနီရောင် ပြောင်းခြင်း
                $btn.find('i').removeClass('fa-heart-o text-muted').addClass('fa-heart text-danger');
            } else {
                // မူလ အဖြူရောင် ပြောင်းခြင်း
                $btn.find('i').removeClass('fa-heart text-danger').addClass('fa-heart-o text-muted');
            }
            // အရေအတွက် ပြောင်းလဲခြင်း
            $btn.find('.fav-count').text(res.favorite_count);
        },
        error: function (xhr) {
            if (xhr.status === 401) {
                // Login မဝင်ရသေးပါက Login စာမျက်နှာသို့ လမ်းညွှန်ခြင်း
                alert('အကြိုက်ဆုံး မှတ်သားရန် Login အရင်ဝင်ပေးပါ');
                window.location.href = '/mypage/login';
            }
        }
    });
});
```

---

## 📋 2. Favorite Product List (MyPage စာရင်း စီမံခန့်ခွဲမှု)

Customer သည် MyPage ၏ **お気に入り一覧 (`/mypage/favorite`)** တွင် မိမိ မှတ်ထားသော ပစ္စည်းများကို ပြန်လည် ကြည့်ရှုနိုင်ပါသည်:

- **Controller**: `src/Eccube/Controller/Mypage/MypageController::favorite`
- **Template**: `src/Eccube/Resource/template/default/Mypage/favorite.twig`

```twig
{# Mypage/favorite.twig #}
<h2>お気に入り一覧 (My Favorites)</h2>

{% if pagination.totalItemCount > 0 %}
    <div class="row">
        {% for Favorite in pagination %}
            {% set Product = Favorite.Product %}
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="{{ asset(Product.main_list_image, 'save_image') }}" class="card-img-top">
                    <div class="card-body">
                        <h5>{{ Product.name }}</h5>
                        <p class="text-danger font-weight-bold">{{ Product.price02IncTaxMin|number_format }} 円</p>
                        
                        {# Cart ထဲသို့ တိုက်ရိုက် ထည့်သွင်းခြင်း #}
                        <form action="{{ url('product_detail', {id: Product.id}) }}" method="get">
                            <button type="submit" class="btn btn-primary btn-sm w-100 mb-2">
                                <i class="fa fa-shopping-cart"></i> 商品詳細を見る
                            </button>
                        </form>

                        {# Favorite မှ ဖျက်ထုတ်ခြင်း ခလုတ် #}
                        <button class="btn btn-outline-danger btn-sm w-100 btn-favorite-toggle" data-product-id="{{ Product.id }}">
                            <i class="fa fa-trash"></i> 削除 (Remove)
                        </button>
                    </div>
                </div>
            </div>
        {% endfor %}
    </div>
{% else %}
    <p class="alert alert-info">お気に入りに登録された商品はありません。(မှတ်ထားသော ပစ္စည်း မရှိသေးပါ)</p>
{% endif %}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **お気に入り登録 (Okiniiri Touroku)**: Add to Favorites
- **お気に入り解除 (Okiniiri Kaijo)**: Remove from Favorites
- **お気に入り一覧 (Okiniiri Ichiran)**: Favorites List
- **非同期通信 (Hidouki Tsuushin)**: Asynchronous Communication (AJAX)
- **ハートアイコン (Haato Aikon)**: Heart Icon
