---
title: "01. Symfony And Routing"
description: "EC-CUBE 4.x သည် ကမ္ဘာကျော် PHP Enterprise Framework ဖြစ်သော Symfony ပေါ်တွင် အခြေခံထားပါသည်။ ထို့ကြောင့် EC-CUBE တွင် Backend Logic ရေးသားရန်အတွက် Symfony ၏ Rou"
---

## Module 04 - အခန်း ၁: Symfony Framework, Routing နှင့် Controllers

EC-CUBE 4.x သည် ကမ္ဘာကျော် PHP Enterprise Framework ဖြစ်သော **Symfony** ပေါ်တွင် အခြေခံထားပါသည်။ ထို့ကြောင့် EC-CUBE တွင် Backend Logic ရေးသားရန်အတွက် Symfony ၏ **Routing, Controller, Dependency Injection (DI)** သဘောတရားများကို နားလည်ထားရန် လိုအပ်ပါသည်။

---

## ၁။ Request-Response Lifecycle (လုပ်ဆောင်မှုအဆင့်ဆင့်)

User တစ်ဦးမှ Browser တွင် URL တစ်ခုကို ရိုက်ထည့်လိုက်သည့်အခါ EC-CUBE တွင် အောက်ပါအတိုင်း အဆင့်ဆင့် အလုပ်လုပ်ပါသည်-

```
[ Browser Request: GET /products/detail/10 ]
                      │
                      ▼
[ Front Controller: html/index.php ]
                      │
                      ▼
[ Symfony HTTP Kernel (Boot Framework & Bundles) ]
                      │
                      ▼
[ Router (Match URL -> Controller Action) ]
                      │
                      ▼
[ Controller: ProductController::detail() ]
                      │ (Dependency Injection / Service Logic)
                      ├──────────────────────────┐
                      ▼                          ▼
            [ Doctrine ORM: Entity ]     [ Business Services ]
            (Fetch Product #10 from DB)  (Cart, Tax, Discounts)
                      │                          │
                      └──────────┬───────────────┘
                                 ▼
            [ Twig Template Engine (Render HTML) ]
                                 │
                                 ▼
            [ HTTP Response (200 OK HTML / JSON) ]
                                 │
                                 ▼
[ Display on Browser Screen ]
```

---

## ၂။ Routing စနစ် (Routing System)

EC-CUBE 4 တွင် Route များကို PHP Class ပေါ်တွင် **Docblock Annotation** သို့မဟုတ် **PHP 8 Attributes** ဖြင့် သတ်မှတ်ပါသည်-

```php
use Symfony\Component\Routing\Annotation\Route;

class SampleController extends AbstractController
{
    /**
     * Route သတ်မှတ်ပုံ ဥပမာ
     * @Route("/my-custom-page", name="my_custom_page", methods={"GET"})
     */
    public function index()
    {
        // ...
    }

    /**
     * Parameter ပါဝင်သော Route
     * @Route("/my-custom-page/{id}", name="my_custom_page_detail", requirements={"id"="\d+"})
     */
    public function detail($id)
    {
        // ...
    }
}
```

### အဓိက Parameter များ-
- **Path**: URL လမ်းကြောင်း (ဥပမာ: `/my-custom-page` သို့မဟုတ် `/admin/my-plugin/config`)
- **name**: Route အမည် (Template ထဲတွင် `{{ url('my_custom_page') }}` သို့မဟုတ် Controller ထဲတွင် `$this->redirectToRoute('my_custom_page')` အဖြစ် ခေါ်သုံးရန်)
- **methods**: လက်ခံမည့် HTTP Method (`GET`, `POST`, `PUT`, `DELETE`)
- **requirements**: Regex ဖြင့် Parameter validation ပြုလုပ်ခြင်း (ဥပမာ: `id` သည် ကိန်းဂဏန်း `\d+` သာ ဖြစ်ရမည်)

---

## ၃။ Controller ဖွဲ့စည်းပုံနှင့် ရေးသားပုံ (Controller Structure)

EC-CUBE ရှိ Controller များအားလုံးသည် `Eccube\Controller\AbstractController` ကို Extend လုပ်ထားရပါသည်-

```php
<?php

namespace Customize\Controller;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DemoPageController extends AbstractController
{
    /**
     * @var ProductRepository
     */
    private $productRepository;

    /**
     * Dependency Injection (Constructor Injection)
     * လိုအပ်သော Service သို့မဟုတ် Repository များကို အလိုအလျောက် Inject လုပ်ပေးသည်
     */
    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * @Route("/demo", name="demo_page", methods={"GET"})
     */
    public function index(Request $request): Response
    {
        // Database မှ ပစ္စည်းနောက်ဆုံး ၅ ခုကို ရှာယူခြင်း
        $products = $this->productRepository->findBy([], ['id' => 'DESC'], 5);

        // Twig Template သို့ Data ပို့၍ Render လုပ်ခြင်း
        return $this->render('demo/index.twig', [
            'page_title' => 'ကြိုဆိုပါသည် - Demo Page',
            'products' => $products,
        ]);
    }

    /**
     * JSON Response ပြန်လိုသည့်အခါ (AJAX API)
     * @Route("/demo/api", name="demo_api", methods={"GET"})
     */
    public function api(): Response
    {
        $data = [
            'status' => 'success',
            'message' => 'Hello from EC-CUBE API',
            'timestamp' => time(),
        ];

        return $this->json($data);
    }
}
```

---

## ၄။ Controller တွင် အသုံးများသော Helper Methods များ

`AbstractController` မှ ပေးထားသော အသုံးဝင်သည့် Methods များ-

| Helper Method | အသုံးပြုပုံ | ရှင်းလင်းချက် |
| :--- | :--- | :--- |
| **`$this->render()`** | `$this->render('path.twig', $data)` | Twig Template ကို HTML အဖြစ် Response ပြန်ခြင်း။ |
| **`$this->redirectToRoute()`** | `$this->redirectToRoute('homepage')` | သတ်မှတ်ထားသော Route သို့ Redirect လွှဲပေးခြင်း။ |
| **`$this->redirect()`** | `$this->redirect('https://example.com')` | ပြင်ပ URL သို့ Redirect လွှဲပေးခြင်း။ |
| **`$this->json()`** | `$this->json(['status' => 'ok'])` | Data array ကို JSON Response (Header `application/json`) အဖြစ် ပြန်ခြင်း။ |
| **`$this->addFlash()`** | `$this->addFlash('eccube.front.success', 'အောင်မြင်ပါသည်')` | User မျက်နှာပြင်တွင် Flash Message အသိပေးစာသား ပြသခြင်း။ |
| **`$this->getUser()`** | `$customer = $this->getUser()` | လက်ရှိ Login ဝင်ထားသော Customer သို့မဟုတ် Admin User Object ကို ရယူခြင်း။ |
| **`$this->isGranted()`** | `$this->isGranted('ROLE_ADMIN')` | User ၏ Permission / Role ကို စစ်ဆေးခြင်း။ |

---

## ၅။ Dependency Injection (DI) နှင့် Service Container

Symfony ၏ Service Container သည် Class များကြား ချိတ်ဆက်မှု (Decoupling) ကို ကူညီပေးပါသည်။ Controller သို့မဟုတ် Service တစ်ခု ရေးသားသည့်အခါ လိုအပ်သော Repository, Entity Manager သို့မဟုတ် Helper Class များကို `__construct()` တွင် Type-hint ပေးရုံဖြင့် Symfony က အလိုအလျောက် Inject ပြုလုပ်ပေးပါသည် (Autowiring)။

```php
// Constructor တွင် လိုအပ်သော Service များကို ထည့်သွင်းခြင်း
public function __construct(
    \Doctrine\ORM\EntityManagerInterface $entityManager,
    \Eccube\Service\CartService $cartService,
    \Eccube\Service\MailService $mailService
) {
    $this->entityManager = $entityManager;
    $this->cartService = $cartService;
    $this->mailService = $mailService;
}
```

---

နောက်အခန်းတွင် **[Module 04 - အခန်း ၂: Doctrine ORM, Entities နှင့် Repositories](/eccube/01_basics/04-architecture-and-core-concepts/02-doctrine-orm-and-entities/)** ကို ဆက်လက်လေ့လာပါမည်။
