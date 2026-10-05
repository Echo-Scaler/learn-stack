---
title: "04. Form Events And Request Interception"
description: "Form မျက်နှာပြင်များတွင် Input အသစ်များ အလိုအလျောက် ထည့်သွင်းခြင်း (Form Events) နှင့် Controller မရောက်မီ Request များကို ကြားဖြတ်စစ်ဆေးခြင်း (Kernel Events) ဖ"
---

## 04. Form Events & Request Interception (Form ပြင်ဆင်ခြင်းနှင့် Request ကြားဖြတ်ခြင်း)

Form မျက်နှာပြင်များတွင် Input အသစ်များ အလိုအလျောက် ထည့်သွင်းခြင်း (**Form Events**) နှင့် Controller မရောက်မီ Request များကို ကြားဖြတ်စစ်ဆေးခြင်း (**Kernel Events**) ဖြစ်ပါသည်။

---

## 📝 ၁။ Form Events ဖြင့် မူရင်း Form များတွင် Field အသစ် ထပ်ထည့်ခြင်း

EC-CUBE ၏ မူရင်း FormType (ဥပမာ `EntryType`, `OrderType`) များကို သွားရောက် မပြင်ဘဲ EventSubscriber ဖြင့် Field အသစ်များ လှမ်းထည့်နိုင်ပါသည်:

### `FormEvents::PRE_SET_DATA` ဖြင့် Checkout တွင် "သတိပြုရန် မှတ်ချက်" Field ထည့်ခြင်း:

```php
namespace Customize\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Validator\Constraints\Length;

class OrderFormExtensionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            // Form Data မပြသမီ အချိန်တွင် နားစွင့်ခြင်း
            FormEvents::PRE_SET_DATA => 'onPreSetData',
        ];
    }

    public function onPreSetData(FormEvent $event): void
    {
        $form = $event->getForm();

        // အကယ်၍ Shopping Order Form ဖြစ်ပါက Field အသစ် ထပ်ထည့်ခြင်း
        if ($form->getName() === 'order') {
            $form->add('custom_delivery_note', TextareaType::class, [
                'label'       => '配送に関するご要望 (ပို့ဆောင်ရေး အထူးမှတ်ချက်)',
                'required'    => false,
                'mapped'      => false, // Entity ထဲတွင် column မရှိပါက false ထားရမည်
                'attr'        => [
                    'placeholder' => '不在時は宅配ボックスへお願いします 等',
                    'rows'        => 3,
                ],
                'constraints' => [
                    new Length(['max' => 500]),
                ],
            ]);
        }
    }
}
```

---

## 🚦 ၂။ Kernel Request Interception (Request ကို ကြားဖြတ်စစ်ဆေးခြင်း)

ဖောက်သည်သည် Controller သို့ မရောက်ရှိမီ `KernelEvents::REQUEST` ဖြင့် ကြားဖြတ်စစ်ဆေးကာ စည်းကမ်းမကိုက်ညီပါက လမ်းကြောင်းလွှဲခြင်း (Redirect) သို့မဟုတ် ရပ်တန့်ခြင်း ပြုလုပ်နိုင်ပါသည်:

### လက်တွေ့ နမူနာ: VIP Promotion စာမျက်နှာသို့ Login မဝင်ရသေးသူ ဝင်လာပါက တားဆီးခြင်း

```php
namespace Customize\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\RouterInterface;

class VipAccessRestrictionSubscriber implements EventSubscriberInterface
{
    private Security $security;
    private RouterInterface $router;

    public function __construct(Security $security, RouterInterface $router)
    {
        $this->security = $security;
        $this->router = $router;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Request အစောဆုံး စတင်ချိန်တွင် ကြားဖြတ်ခြင်း (Priority: 30)
            KernelEvents::REQUEST => ['onKernelRequest', 30],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        // Sub-request များ (ဥပမာ Twig render) မဟုတ်ဘဲ Main Request ဖြစ်မှသာ စစ်ဆေးမည်
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // အကယ်၍ /campaign/vip-secret လမ်းကြောင်းသို့ ဝင်ရောက်လာပါက
        if (str_starts_with($path, '/campaign/vip-secret')) {
            $customer = $this->security->getUser();

            // Login မဝင်ထားပါက Login စာမျက်နှာသို့ လမ်းကြောင်းလွှဲခြင်း
            if (!$customer) {
                $loginUrl = $this->router->generate('mypage_login');
                
                // setResponse() ဖြင့် Controller ဆီ မရောက်တော့ဘဲ RedirectResponse တန်းပြန်ပေးခြင်း
                $event->setResponse(new RedirectResponse($loginUrl));
                $event->stopPropagation(); // နောက်ဆက်တွဲ Event များကိုပါ ချက်ချင်း ရပ်တန့်ပစ်ခြင်း
            }
        }
    }
}
```

---

## 🛡️ ၃။ Kernel Response ဖြင့် လုံခြုံရေး Header များ ထည့်သွင်းခြင်း

Browser ထံသို့ Response HTML မထွက်ခွာမီ `KernelEvents::RESPONSE` ဖြင့် လုံခြုံရေး Headers များကို စတိုးတစ်ခုလုံးအတွက် အလိုအလျောက် ထည့်သွင်းပေးခြင်း:

```php
namespace Customize\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class SecurityHeadersSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        $response = $event->getResponse();

        // Clickjacking ကာကွယ်ရန်
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        // MIME Sniffing ကာကွယ်ရန်
        $response->headers->set('X-Content-Type-Options', 'nosniff');
    }
}
```

ဤကဲ့သို့ Form Events နှင့် Kernel Events များကို အသုံးချခြင်းဖြင့် EC-CUBE ၏ စီးဆင်းမှု တစ်ခုလုံးကို မိမိ လိုအပ်သလို အပြည့်အဝ ထိန်းချုပ်မောင်းနှင်နိုင်မည် ဖြစ်ပါသည်။
