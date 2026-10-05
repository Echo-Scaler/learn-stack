---
title: "22. Member Only Product"
description: "> 「プレミアム商品やファンクラブ限定グッズなど、特定の『会員限定商品』を設定できるようにしてください。未ログイン（ゲスト）のユーザーがその商品ページを開いた場合は『ログインが必要です』と案内して閲覧または購入を制限し、ログイン画面へリダイレクトさせてください。」"
---

## Task 22: 特定の商品を会員限定にしてください (Member-Only Product Restriction)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「プレミアム商品やファンクラブ限定グッズなど、特定の『会員限定商品』を設定できるようにしてください。未ログイン（ゲスト）のユーザーがその商品ページを開いた場合は『ログインが必要です』と案内して閲覧または購入を制限し、ログイン画面へリダイレクトさせてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
သီးသန့် အထူးပစ္စည်းများကို **အသင်းဝင်များသာ ကြည့်ရှု/ဝယ်ယူခွင့် (Member-Only Products)** အဖြစ် ကန့်သတ်ထားပြီး၊ Login မဝင်ထားသော ဧည့်သည်များ ကြည့်ရှုပါက Login Page သို့ ရွှေ့ပြောင်းစေခြင်း သို့မဟုတ် Cart ထဲ ထည့်ခွင့်ကို ကန့်သတ်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Defense-in-Depth (လုံခြုံရေး အဆင့်ဆင့် ကာကွယ်ခြင်း)
- Twig Template ထဲတွင် "カートに入れる" ခလုတ်ကို ဖျောက်ထားရုံဖြင့် မလုံလောက်ပါ။ စနစ်နားလည်သော User များသည် Form POST (DevTools / Curl) ဖြင့် Cart ထဲသို့ တိုက်ရိုက် ထည့်သွင်းနိုင်ပါသည်။
- ထို့ကြောင့် **Twig (UI Level)** သာမက **Controller / EventSubscriber (Backend Logic Level)** တွင်ပါ Member ဖြစ်မဖြစ်ကို စစ်ဆေးကာ လုံခြုံရေး ၂ ထပ် ပြုလုပ်ရပါမည်။

### 2. Product Entity Extension ဖြင့် Flag သတ်မှတ်ခြင်း
- `Product` Entity ပေါ်တွင် `is_member_only` (boolean) Column ထည့်သွင်းထားခြင်းဖြင့် Admin က ပစ္စည်းအလိုက် Member Only ဖြစ်မဖြစ်ကို အလွယ်တကူ စီမံခန့်ခွဲနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Product Entity တွင် `is_member_only` Flag ထည့်သွင်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductMemberOnlyTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Product")
 */
trait ProductMemberOnlyTrait
{
    /**
     * @ORM\Column(name="is_member_only", type="boolean", options={"default": false})
     */
    private bool $is_member_only = false;

    public function isMemberOnly(): bool
    {
        return $this->is_member_only;
    }

    public function setIsMemberOnly(bool $is_member_only): self
    {
        $this->is_member_only = $is_member_only;
        return $this;
    }
}
```

---

### အဆင့် ၂: EventSubscriber ဖြင့် Detail View နှင့် Cart Action ကို စစ်ဆေးကန့်သတ်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/EventSubscriber/MemberOnlyProductSubscriber.php`

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Entity\Customer;
use Eccube\Entity\Product;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Security;
use Eccube\Repository\ProductRepository;

class MemberOnlyProductSubscriber implements EventSubscriberInterface
{
    private Security $security;
    private RouterInterface $router;
    private ProductRepository $productRepository;

    public function __construct(
        Security $security,
        RouterInterface $router,
        ProductRepository $productRepository
    ) {
        $this->security = $security;
        $this->router = $router;
        $this->productRepository = $productRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.request' => ['onKernelRequest', 20],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $route = $request->attributes->get('_route');

        // Product Detail Page သို့မဟုတ် Cart Add Action ကို စစ်ဆေးခြင်း
        if ($route === 'product_detail' || $route === 'cart_add') {
            $productId = $request->attributes->get('id') ?? $request->get('product_id');
            if (!$productId) {
                return;
            }

            $product = $this->productRepository->find($productId);
            if (!$product || !method_exists($product, 'isMemberOnly') || !$product->isMemberOnly()) {
                return;
            }

            // Member-only ဖြစ်ပြီး Login မဝင်ထားပါက Login Page သို့ ရွှေ့ပြောင်းခြင်း
            $user = $this->security->getUser();
            if (!$user instanceof Customer) {
                $session = $request->getSession();
                if ($session) {
                    $session->getFlashBag()->add('eccube.front.error', 'この商品は会員限定商品です。閲覧・購入にはログインが必要です。');
                }

                $loginUrl = $this->router->generate('mypage_login');
                $event->setResponse(new RedirectResponse($loginUrl));
            }
        }
    }
}
```

---

### အဆင့် ၃: Twig Template တွင် "会員限定" Badge ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/default/Product/list.twig`

```twig
{% if Product.memberOnly %}
    <div class="mb-1">
        <span class="badge badge-dark px-2 py-1">
            <i class="fas fa-lock"></i> 会員限定商品
        </span>
    </div>
{% endif %}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **SEO Crawler / Googlebot (検索エンジンのインデックス):**  
   会員限定商品 ဖြစ်ပါက Google Search Engine မှ ပစ္စည်းအချက်အလက်ကို Index မလုပ်စေရန် `<meta name="robots" content="noindex, nofollow">` ကို Twig Header တွင် ထည့်သွင်းပေးသင့်ပါသည်။
2. **Target Path Redirection:**  
   Login ဝင်ပြီးနောက် မူရင်းကြည့်ရှုလက်စ ကုန်ပစ္စည်း စာမျက်နှာသို့ အလိုအလျောက် ပြန်ရောက်သွားစေရန် Login Target Path (`_target_path`) ကို Session တွင် မှတ်ထားပေးရပါမည်။
