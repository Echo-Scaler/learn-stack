---
title: "26. Ajax Favorite Toggle"
description: "> 「商品一覧や詳細ページでお気に入り（ハートマーク）をクリックした際、画面全体が再読み込み（リロード）されてスクロール位置が戻ってしまうのを防ぎたいです。画面遷移なしでAjax（非同期通信）にてお気に入りの登録・解除をトグル切り替えし、アイコンとカウント数を即座に更新してください。」"
---

## Task 26: Ajaxでお気に入り登録できるようにしてください (Ajax Favorite Toggle Without Page Reload)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品一覧や詳細ページでお気に入り（ハートマーク）をクリックした際、画面全体が再読み込み（リロード）されてスクロール位置が戻ってしまうのを防ぎたいです。画面遷移なしでAjax（非同期通信）にてお気に入りの登録・解除をトグル切り替えし、アイコンとカウント数を即座に更新してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Favorite (Heart Icon) ကို နှိပ်လိုက်သည့်အခါ Page တစ်ခုလုံး Reload မဖြစ်စေဘဲ **Ajax (Asynchronous JavaScript & JSON)** ဖြင့် နောက်ကွယ်မှ သွားရောက် သိမ်းဆည်း/ပယ်ဖျက်ပြီး၊ အသည်းပုံ အရောင်နှင့် အရေအတွက်ကို မျက်စိရှေ့တွင် ချက်ချင်း ပြောင်းလဲပေးရန် ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Modern Mobile UX (快適なユーザー体験)
- စမတ်ဖုန်းဖြင့် ပစ္စည်းများစွာကို Scroll ဆွဲကြည့်ရှုနေသော Customer သည် Favorite တစ်ချက် နှိပ်တိုင်း Page ပြန် Load ဖြစ်ပြီး အပေါ်ဆုံးသို့ ရောက်သွားပါက ဝယ်ယူလိုစိတ် ပျက်ပြားသွားနိုင်သည်။ Ajax ဖြင့် Instant Feedback ပေးခြင်းသည် Conversion Rate ကို သိသိသာသာ တိုးတက်စေသည်။

### 2. JSON Response Controller Architecture
- Controller မှ HTML Page အစား `new JsonResponse(['success' => true, 'is_favorite' => true, 'count' => 15])` ဟု ပြန်ပေးခြင်းဖြင့် Network Data အသုံးပြုမှု နည်းပါးပြီး မြန်ဆန်စေပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Ajax Favorite Toggle Controller ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/AjaxFavoriteController.php`

```php
<?php

namespace Customize\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Controller\AbstractController;
use Eccube\Entity\Customer;
use Eccube\Entity\CustomerFavoriteProduct;
use Eccube\Repository\CustomerFavoriteProductRepository;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class AjaxFavoriteController extends AbstractController
{
    private Security $security;
    private ProductRepository $productRepository;
    private CustomerFavoriteProductRepository $favRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        Security $security,
        ProductRepository $productRepository,
        CustomerFavoriteProductRepository $favRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->security = $security;
        $this->productRepository = $productRepository;
        $this->favRepository = $favRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/mypage/favorite/ajax-toggle", name="mypage_favorite_ajax_toggle", methods={"POST"})
     */
    public function toggle(Request $request): JsonResponse
    {
        // ၁။ Login စစ်ဆေးခြင်း
        $customer = $this->security->getUser();
        if (!$customer instanceof Customer) {
            return new JsonResponse([
                'success' => false,
                'require_login' => true,
                'message' => 'お気に入り機能をご利用いただくにはログインが必要です。',
            ], 401);
        }

        // ၂။ Product ID ရယူခြင်း
        $productId = $request->get('product_id');
        $product = $this->productRepository->find($productId);
        if (!$product) {
            return new JsonResponse(['success' => false, 'message' => '商品が見つかりません。'], 404);
        }

        // ၃။ ရှိပြီးသား Favorite ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
        $favorite = $this->favRepository->findOneBy([
            'Customer' => $customer,
            'Product' => $product,
        ]);

        $isFavorite = false;

        if ($favorite) {
            // ရှိပြီးသားဖြစ်ပါက ဖျက်ပစ်ခြင်း (Toggle Remove)
            $this->entityManager->remove($favorite);
            $this->entityManager->flush();
            $isFavorite = false;
        } else {
            // မရှိသေးပါက အသစ်ထည့်သွင်းခြင်း (Toggle Add)
            $newFav = new CustomerFavoriteProduct();
            $newFav->setCustomer($customer);
            $newFav->setProduct($product);
            $this->entityManager->persist($newFav);
            $this->entityManager->flush();
            $isFavorite = true;
        }

        // ၄။ အဆိုပါ ပစ္စည်း၏ စုစုပေါင်း Favorite Count အသစ်ကို တွက်ချက်ခြင်း
        $totalFavCount = $this->favRepository->count(['Product' => $product]);

        return new JsonResponse([
            'success' => true,
            'is_favorite' => $isFavorite,
            'total_count' => $totalFavCount,
        ]);
    }
}
```

---

### အဆင့် ၂: Frontend JavaScript (Fetch API / Ajax) ရေးသားခြင်း
ဖိုင်တည်နေရာ: `html/template/default/assets/js/favorite-ajax.js` (သို့မဟုတ် Twig Script block)

```javascript
document.addEventListener('DOMContentLoaded', function () {
    const favButtons = document.querySelectorAll('.js-favorite-toggle-btn');

    favButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const icon = this.querySelector('i');
            const countBadge = this.querySelector('.js-favorite-count');

            fetch('/mypage/favorite/ajax-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: new URLSearchParams({
                    'product_id': productId
                })
            })
            .then(response => {
                if (response.status === 401) {
                    // Login မဝင်ရသေးပါက Login Page သို့ ရွှေ့ပြောင်းပေးခြင်း
                    alert('お気に入り登録にはログインが必要です。ログイン画面へ移動します。');
                    window.location.href = '/mypage/login';
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.success) return;

                // UI Icon နှင့် အရောင်ကို ချက်ချင်း ပြောင်းလဲခြင်း
                if (data.is_favorite) {
                    icon.classList.remove('far');
                    icon.classList.add('fas', 'text-danger'); // Solid Red Heart
                } else {
                    icon.classList.remove('fas', 'text-danger');
                    icon.classList.add('far'); // Hollow Heart
                }

                // Count Badge ကို Update ပြုလုပ်ခြင်း
                if (countBadge) {
                    countBadge.textContent = data.total_count;
                }
            })
            .catch(error => console.error('Ajax Error:', error));
        });
    });
});
```

---

### အဆင့် ၃: Twig Template တွင် HTML Button တည်ဆောက်ခြင်း
```twig
<button type="button" class="btn btn-outline-secondary btn-sm js-favorite-toggle-btn" data-product-id="{{ Product.id }}">
    <i class="{% if app.user and Product.id in myFavoriteProductIds %}fas fa-heart text-danger{% else %}far fa-heart{% endif %}"></i>
    <span class="js-favorite-count ml-1">{{ favoriteCounts[Product.id]|default(0) }}</span>
</button>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **CSRF Protection:**  
   POST Request ဖြစ်ပါက Symfony CSRF Token (`_token`) သို့မဟုတ် Header `X-CSRF-TOKEN` ကို စစ်ဆေးသင့်ပါသည်။
2. **Debouncing (連続クリック防止):**  
   User က အသည်းပုံကို ခလုတ်ခဏခဏ အမြန်နှိပ်မိပါက DB Request များ မပြည့်လျှံစေရန် JavaScript တွင် ခလုတ်ကို Request ပြီးသည်အထိ `disabled = true` ခေတ္တ ပြုလုပ်ပေးသင့်ပါသည်။
