---
title: "03. Delete Product"
description: "> Client Requirement: မရောင်းချတော့သည့် ကုန်ပစ္စည်းများကို Admin Dashboard မှ ဖျက်ပစ်နိုင်ရမည်။ သို့သော် ယခင် ဝယ်ယူထားဖူးသော Order History များနှင့် စာရင်းဇယား"
---

## 03 - Delete Product (ကုန်ပစ္စည်း ဖျက်ခြင်း)

> **Client Requirement**: "မရောင်းချတော့သည့် ကုန်ပစ္စည်းများကို Admin Dashboard မှ ဖျက်ပစ်နိုင်ရမည်။ သို့သော် ယခင် ဝယ်ယူထားဖူးသော Order History များနှင့် စာရင်းဇယားများ မပျက်စီးစေရပါ။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. ကုန်ပစ္စည်းကို Admin က ဖျက်လိုက်ပါက Website (Front Store) ပေါ်တွင် ချက်ချင်း ပျောက်သွားရမည်။
2. Customer များ ယခင်က ဝယ်ယူခဲ့ဖူးသော Order အချက်အလက်များတွင် ကုန်ပစ္စည်း အချက်အလက်များ မပျောက်သွားစေရ။
3. မတော်တဆ မှားယှဉ်ဖျက်မိခြင်း မဖြစ်စေရန် Confirmation Alert ပြသပေးရမည်။

---

## 🏛️ EC-CUBE Implementation Architecture: Soft Delete (論理削除)

E-Commerce စနစ်များတွင် ကုန်ပစ္စည်းတစ်ခုကို Database မှ အပြီးအပိုင်ဖျက်ပစ်ခြင်း (**Physical Delete / 物理削除**) ပြုလုပ်ခဲပါသည်။ အကြောင်းမှာ အဆိုပါ ကုန်ပစ္စည်းသည် Order များ၊ Cart များ၊ ငွေစာရင်းများနှင့် Foreign Key ချိတ်ဆက်ထားသောကြောင့် ဖြစ်သည်။

EC-CUBE တွင် ကုန်ပစ္စည်း ဖျက်ခြင်းကို အောက်ပါနည်းလမ်းဖြင့် စီမံထားပါသည်:

```
[Admin Clicks "Delete" Button with CSRF Token]
                    │
                    ▼ (HTTP DELETE / POST /product/{id}/delete)
       [ProductEditController::delete()]
                    │
                    ├─► [CSRF Token Validation]
                    │
                    ├─► [Check for Existing Orders / Constraints]
                    │
                    ▼
          ┌─────────────────────────┐
          │  EC-CUBE Soft Delete    │
          │  (Product Status Change) │
          └─────────────────────────┘
                    │
                    ├── UPDATE dtb_product SET status_id = 3 (廃止 - Discontinued)
                    └── UPDATE dtb_product SET update_date = NOW()
```

> 📌 **မှတ်ချက် (EC-CUBE 4.x Statuses)**:
> 1. `1`: **公開 (Published)** - Website တွင် မြင်တွေ့ရပြီး ဝယ်ယူနိုင်သည်
> 2. `2`: **非公開 (Unpublished)** - Admin သာ မြင်နိုင်သည်၊ Front တွင် မပြပါ
> 3. `3`: **廃止 (Discontinued / Deleted)** - ဖျက်သိမ်းထားသော အခြေအနေ (Soft Deleted)

---

## 🗄️ Controller & Repository Implementation Code

### ၁။ Admin Controller မှ ဖျက်ခြင်း Logic (`ProductEditController.php`)

```php
namespace Eccube\Controller\Admin\Product;

use Eccube\Controller\AbstractController;
use Eccube\Entity\Master\ProductStatus;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductEditController extends AbstractController
{
    #[Route('/%eccube_admin_route%/product/product/{id}/delete', requirements: ['id' => '\d+'], name: 'admin_product_product_delete', methods: ['DELETE'])]
    public function delete(Request $request, $id)
    {
        // CSRF Token စစ်ဆေးခြင်း (လုံခြုံရေးအတွက် မဖြစ်မနေ လိုအပ်သည်)
        $this->isTokenValid();

        $Product = $this->productRepository->find($id);
        if (!$Product) {
            $this->addError('admin.product.delete_failed_not_found', 'admin');
            return $this->redirectToRoute('admin_product');
        }

        try {
            // Product Repository မှတဆင့် Delete logic လုပ်ဆောင်ခြင်း
            $this->productRepository->delete($Product);
            $this->entityManager->flush();

            $this->addSuccess('admin.common.delete_complete', 'admin');
        } catch (\Exception $e) {
            $this->addError('admin.common.delete_error', 'admin');
        }

        return $this->redirectToRoute('admin_product');
    }
}
```

### ၂။ Repository ရှိ Delete Implementation (`ProductRepository.php`)

EC-CUBE ၏ Repository တွင် Default အားဖြင့် ကုန်ပစ္စည်းကို Status ပြောင်းခြင်း သို့မဟုတ် Soft Delete ပြုလုပ်လေ့ရှိပါသည်:

```php
// Eccube\Repository\ProductRepository.php
public function delete($Product)
{
    // ကုန်ပစ္စည်း၏ Status ကို '廃止' (Discontinued / ID: 3) သို့ ပြောင်းလဲခြင်း
    $DiscontinuedStatus = $this->getEntityManager()
        ->getRepository(ProductStatus::class)
        ->find(ProductStatus::STATUS_DISCONTINUED);

    $Product->setStatus($DiscontinuedStatus);
}
```

---

## 🔍 Front-End တွင် ကုန်ပစ္စည်းများ ရှာဖွေပြသရာ၌ Deleted Product များကို ဖယ်ထုတ်ပုံ

Website (Front Store) ဘက်ရှိ Product List စာမျက်နှာများတွင် Doctrine QueryBuilder က အလိုအလျောက် `status_id = 1 (公開)` ဖြစ်သော ကုန်ပစ္စည်းများကိုသာ ဆွဲထုတ်ပေးပါသည်:

```php
// ProductRepository::getQueryBuilderBySearchData()
$qb = $this->createQueryBuilder('p')
    ->andWhere('p.Status = :status')
    ->setParameter('status', ProductStatus::STATUS_DISPLAY_SHOW); // status_id = 1
```

ထို့ကြောင့် Status `3 (廃止)` ဖြစ်သွားသော ကုန်ပစ္စည်းများသည် Front-End တွင် လုံးဝ ရှာမတွေ့တော့ဘဲ အလိုအလျောက် ပျောက်ကွယ်သွားပါသည်။

---

## ⚠️ Real-World Client Requirement: 404 Not Found vs 301 Redirect

ကုန်ပစ္စည်းတစ်ခု ဖျက်လိုက်သည့်အခါ Client များ တောင်းဆိုလေ့ရှိသော အရေးကြီးသည့် SEO Requirement တစ်ခု ရှိပါသည်:

> **ပြဿနာ**: Google Search တွင် ယခင်က Index တင်ထားပြီးသော Product URL ကို User က နှိပ်လိုက်ပါက `404 Not Found` ပြသမည်ဖြစ်ပြီး SEO Ranking ကျဆင်းသွားနိုင်သည်။  
> **Client Requirement**: *"ဖျက်လိုက်တဲ့ ကုန်ပစ္စည်း URL ကို User တွေ ဝင်လာရင် အဲ့ဒီ ကုန်ပစ္စည်းရဲ့ ပင်မ Category စာမျက်နှာဆီကို Auto Redirect (301 Moved Permanently) လုပ်ပေးပါ။"*

### ဖြေရှင်းနည်း (Custom Event Listener):
`app/Plugin/SeoRedirect/EventListener/ProductDetailListener.php`
```php
public function onProductDetailNotFound(ExceptionEvent $event)
{
    $request = $event->getRequest();
    // Route သည် Product Detail ဖြစ်ပြီး 404 ဖြစ်ပါက
    if ($event->getThrowable() instanceof NotFoundHttpException) {
        $productId = $request->attributes->get('id');
        // Category ကို ရှာဖွေပြီး 301 Redirect ပို့ပေးနိုင်သည်
    }
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **論理削除 (Ronri Sakujo)**: Soft Delete (အချက်အလက်ကို မဖျက်ဘဲ Status အလံထောင်၍ ဖျောက်ထားခြင်း)
- **物理削除 (Butsuri Sakujo)**: Hard / Physical Delete (`DELETE FROM table` ဖြင့် အပြီးအပိုင်ဖျက်ခြင်း)
- **廃止 (Haishi)**: Discontinued (ရောင်းချမှု ရပ်ဆိုင်းခြင်း/ဖျက်ခြင်း)
- **公開ステータス (Koukai Suteetasu)**: Publish Status (公開 = Show, 非公開 = Hide, 廃止 = Discontinued)
