---
title: "08. Top Client Tasks And Troubleshooting"
description: "ဂျပန် EC-CUBE Project များတွင် Favorite / Wishlist (お気に入り機能) နှင့် ပတ်သက်၍ Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော အဓိက Task ၅ ခုနှင့် လက်တွေ့ ကုဒ်ပ"
---

## 08. Top Client Tasks & Troubleshooting (Favorite လက်တွေ့ ပြင်ဆင်နည်းများ)

ဂျပန် EC-CUBE Project များတွင် Favorite / Wishlist (お気に入り機能) နှင့် ပတ်သက်၍ Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော အဓိက Task ၅ ခုနှင့် လက်တွေ့ ကုဒ်ပြင်ဆင်နည်းများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: Guest အနေဖြင့် မှတ်ထားသော Favorite များကို Login ဝင်ချိန်တွင် အလိုအလျောက် ပေါင်းစည်းပေးခြင်း (Guest Favorite Sync)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「会員登録前（ゲスト状態）のユーザーが商品をお気に入り登録した場合、Session/Cookie に保持しておき、後からログインまたは会員登録したタイミングで、自動的にデータベース（dtb_customer_favorite_product）へ統合（名寄せ）してください。」
> (Guest အနေဖြင့် Favorite မှတ်ထားသော ပစ္စည်းများကို Session ထဲတွင် ယာယီသိမ်းထားပြီး၊ Login သို့မဟုတ် အကောင့်ဖွင့်လိုက်သည်နှင့် Database ထဲသို့ အလိုအလျောက် ပေါင်းစည်း ထည့်သွင်းပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

`SecurityEvents::INTERACTIVE_LOGIN` ကို နားစွင့်သော EventSubscriber ရေးသားခြင်း:

```php
namespace Customize\EventSubscriber;

use Eccube\Repository\CustomerFavoriteProductRepository;
use Eccube\Repository\ProductRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\SecurityEvents;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Doctrine\ORM\EntityManagerInterface;
use Customize\Entity\CustomerFavoriteProduct;

class GuestFavoriteSyncSubscriber implements EventSubscriberInterface
{
    private SessionInterface $session;
    private ProductRepository $productRepository;
    private CustomerFavoriteProductRepository $favRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        SessionInterface $session,
        ProductRepository $productRepository,
        CustomerFavoriteProductRepository $favRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->session = $session;
        $this->productRepository = $productRepository;
        $this->favRepository = $favRepository;
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            SecurityEvents::INTERACTIVE_LOGIN => 'onLogin',
        ];
    }

    public function onLogin(InteractiveLoginEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();
        if (!$user instanceof \Eccube\Entity\Customer) {
            return;
        }

        // Session ထဲတွင် Guest အနေဖြင့် သိမ်းထားခဲ့သော Product ID များကို ဆွဲထုတ်ခြင်း
        $guestFavIds = $this->session->get('guest_favorite_product_ids', []);
        if (empty($guestFavIds)) {
            return;
        }

        foreach ($guestFavIds as $productId) {
            $product = $this->productRepository->find($productId);
            if ($product && !$this->favRepository->isFavorite($user, $product)) {
                // Database ထဲသို့ ပေါင်းစည်း ထည့်သွင်းခြင်း
                $fav = new \Eccube\Entity\CustomerFavoriteProduct();
                $fav->setCustomer($user);
                $fav->setProduct($product);
                $this->entityManager->persist($fav);
            }
        }

        $this->entityManager->flush();

        // ပေါင်းစည်းပြီးပါက Session ထဲမှ ရှင်းထုတ်ပစ်ခြင်း
        $this->session->remove('guest_favorite_product_ids');
    }
}
```

---

## 📌 Client Task 2: Favorite စာရင်းထဲမှ ပစ္စည်းများကို တစ်ပြိုင်နက် Cart ထဲ ထည့်သွင်းခြင်း (一括カート追加)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「お気に入り一覧画面（Mypage）で、チェックボックスで複数選択した商品を『一括でショッピングカートに追加する』ボタンを設置してください。在庫切れの商品は除外して通知してください。」
> (Favorite စာရင်းမျက်နှာပြင်တွင် အမှန်ခြစ် ရွေးချယ်ထားသော ပစ္စည်းများကို တစ်ပြိုင်နက် Cart ထဲ ထည့်သွင်းနိုင်သည့် ခလုတ် ထည့်သွင်းပေးပါ။ စတော့မရှိသော ပစ္စည်းများကို ချန်လှပ်၍ သတိပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:

`app/Customize/Controller/Mypage/FavoriteBatchCartController.php`:

```php
namespace Customize\Controller\Mypage;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Eccube\Service\CartService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class FavoriteBatchCartController extends AbstractController
{
    /**
     * @Route("/mypage/favorite/batch_cart", name="mypage_favorite_batch_cart", methods={"POST"})
     * @IsGranted("ROLE_USER")
     */
    public function batchAdd(Request $request, ProductRepository $productRepo, CartService $cartService): Response
    {
        $productIds = $request->request->get('product_ids', []);
        $addedCount = 0;
        $outOfStockCount = 0;

        foreach ($productIds as $id) {
            $product = $productRepo->find($id);
            if (!$product) continue;

            // ပထမဆုံး ProductClass ကို ရယူခြင်း
            $productClass = $product->getProductClasses()->first();
            if (!$productClass) continue;

            // စတော့ စစ်ဆေးခြင်း
            if ($productClass->isStockUnlimited() || $productClass->getStock() > 0) {
                $cartService->addProduct($productClass, 1);
                $addedCount++;
            } else {
                $outOfStockCount++;
            }
        }

        $cartService->save();

        if ($addedCount > 0) {
            $this->addSuccess("{$addedCount} 点の商品をカートに追加しました。");
        }
        if ($outOfStockCount > 0) {
            $this->addWarning("{$outOfStockCount} 点の商品は在庫切れのため追加できませんでした。");
        }

        return $this->redirectToRoute('cart');
    }
}
```

---

## 📌 Client Task 3: Favorite စာရင်းတွင် စတော့ပြတ် (SOLD OUT) ဖြစ်နေပါက အသိပေးခြင်းနှင့် ပြန်လည်ရောက်ရှိချိန် သတိပေးချက် ခလုတ်

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「お気に入り一覧画面で、商品が売り切れている場合は『SOLD OUT』バッジを表示し、通常カートボタンの代わりに『再入荷お知らせを受け取る』ボタンを表示してください。」
> (Favorite စာရင်းတွင် ပစ္စည်း စတော့ပြတ်သွားပါက SOLD OUT Badge ပြသပေးပြီး၊ Cart ခလုတ်အစား "ပစ္စည်းပြန်ရောက်ပါက အသိပေးစာတောင်းရန်" ခလုတ်ကို အစားထိုး ပြသပေးပါ။)

### 🛠️ Twig မျက်နှာပြင်တွင် ရေးသားပုံ:
`template/default/Mypage/favorite.twig`:

```twig
{% for Favorite in pagination %}
    {% set Product = Favorite.Product %}
    <div class="favorite-item border-bottom p-3">
        <h5>{{ Product.name }}</h5>
        <p class="price">¥{{ Product.price02IncTaxMin|number_format }}</p>

        {# စတော့ ရှိ/မရှိ စစ်ဆေးခြင်း #}
        {% if Product.stock_find %}
            <form action="{{ url('cart_add', {id: Product.ProductClasses[0].id}) }}" method="POST">
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-shopping-cart"></i> カートに入れる
                </button>
            </form>
        {% else %}
            {# စတော့ မရှိပါက SOLD OUT နှင့် ပြန်ရောက်အသိပေး ခလုတ် ပြသခြင်း #}
            <span class="badge badge-danger p-2 mb-2">SOLD OUT (在庫切れ)</span>
            <a href="{{ url('restock_request', {id: Product.id}) }}" class="btn btn-outline-warning btn-sm">
                <i class="fa fa-bell"></i> 再入荷通知をリクエストする
            </a>
        {% endif %}
    </div>
{% endfor %}
```

---

## 📌 Client Task 4: အသည်းပုံ (Heart) ခလုတ်ကို ဆက်တိုက် အမြန်နှိပ်ခြင်း (Spam Clicking) ကာကွယ်ခြင်း

### 💬 ပြဿနာ:
ဝယ်သူက အသည်းပုံ ခလုတ်ကို ၁ စက္ကန့်အတွင်း ၅ ကြိမ် ၆ ကြိမ် ဆက်တိုက်နှိပ်မိသည့်အခါ ဆာဗာတွင် Race Condition သို့မဟုတ် Duplicate Key Error တက်ကာ ဆိုက်နှေးသွားတတ်သည်။

### 🛠️ Frontend Debounce & Button Disable ပြင်ဆင်နည်း:
```javascript
let isProcessing = false;

document.querySelectorAll('.btn-favorite-toggle').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // လုပ်ဆောင်နေဆဲဖြစ်ပါက ထပ်နှိပ်၍ မရအောင် တားမြစ်ခြင်း
        if (isProcessing) return;
        isProcessing = true;
        button.disabled = true;

        const productId = this.dataset.productId;

        fetch('/favorite/ajax_toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ product_id: productId })
        })
        .then(res => res.json())
        .then(data => {
            // UI Update ပြုလုပ်ခြင်း
            this.classList.toggle('favorited', data.is_favorited);
        })
        .finally(() => {
            isProcessing = false;
            button.disabled = false;
        });
    });
});
```

---

## 📌 Client Task 5: Favorite CSV ထုတ်ရာတွင် Excel ၌ ဂျပန်စာလုံး မပျက်စီးစေရန် ကာကွယ်နည်း (文字化け対策)

### 💬 ပြဿနာ:
ဂျပန်နိုင်ငံတွင် Windows PC ဖြင့် Microsoft Excel ကို ဖွင့်လှစ်သည့်အခါ သာမန် UTF-8 CSV ဖိုင်များသည် အက္ခရာများ ပျက်စီးသွားတတ်ပါသည် (**文字化け**):

### 🛠️ ဖြေရှင်းနည်း:
CSV Output Stream မစတင်မီ **UTF-8 BOM (`\xEF\xBB\xBF`)** ကို Header ၏ အစဆုံးတွင် ရေးထည့်ပေးရပါသည်:

```php
$handle = fopen('php://output', 'w');

// UTF-8 BOM ထည့်သွင်းခြင်း (Excel က ဂျပန်စာအဖြစ် တိုက်ရိုက် သိရှိစေသည်)
fputs($handle, "\xEF\xBB\xBF");

// Header နှင့် အချက်အလက်များ ရေးသားခြင်း...
fputcsv($handle, ['顧客名', '商品名', '登録日時']);
```

အထက်ပါ နည်းစနစ်များအားလုံးသည် ဂျပန် EC-CUBE စီမံကိန်းများတွင် Favorite/Wishlist စနစ်ကို အဆင့်အမြင့်ဆုံးနှင့် အမှားယွင်းကင်းဆုံး တည်ဆောက်နိုင်စေမည် ဖြစ်ပါသည်။
