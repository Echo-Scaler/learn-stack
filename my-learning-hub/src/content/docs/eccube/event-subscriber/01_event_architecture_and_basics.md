---
title: "01. Event Architecture And Basics"
description: "EC-CUBE (Symfony) ၏ Event စနစ်သည် မည်သို့ အလုပ်လုပ်သနည်းနှင့် EventSubscriber တစ်ခုကို စနစ်တကျ တည်ဆောက်ပုံ အခြေခံ ဖြစ်ပါသည်။"
---

## 01. Event Architecture & Basics (Event ၏ အခြေခံ သဘောတရား)

EC-CUBE (Symfony) ၏ Event စနစ်သည် မည်သို့ အလုပ်လုပ်သနည်းနှင့် EventSubscriber တစ်ခုကို စနစ်တကျ တည်ဆောက်ပုံ အခြေခံ ဖြစ်ပါသည်။

---

## 🏛️ EventDispatcher ၏ အခြေခံ အယူအဆ

Event စနစ်တွင် အဓိက အစိတ်အပိုင်း ၃ ခု ပါဝင်ပါသည်:

1. **Event Dispatcher (ဗဟို အချက်ပေးစခန်း)**: မည်သည့် Event များကို မည်သည့် Subscriber များက စောင့်ကြည့်နေသည်ကို စီမံပေးသော ဗဟိုအင်ဂျင်ဖြစ်သည်။
2. **Event (အဖြစ်အပျက်)**: စနစ်ထဲတွင် ဖြစ်ပွားခဲ့သော အကြောင်းအရာ (ဥပမာ: "ဖောက်သည် အကောင့်ဖွင့်လိုက်ပြီ"၊ "အော်ဒါပြီးဆုံးသွားပြီ")။ ၎င်းထဲတွင် သက်ဆိုင်ရာ Data များ (ဥပမာ Order Entity, Customer Entity) ပါရှိသည်။
3. **Event Subscriber (နားစွင့်သူ)**: ထို Event ဖြစ်ပွားချိန်တွင် ဘာလုပ်ဆောင်ရမည်ကို ကြိုတင် သတ်မှတ်ထားသော Class ဖြစ်သည်။

---

## 🆚 EventListener နှင့် EventSubscriber မည်သို့ ကွာခြားသနည်း?

| အချက် | EventListener (အဟောင်း) | EventSubscriber (ခေတ်မီ အကြံပြုနည်း) |
|:---|:---|:---|
| **သတ်မှတ်ပုံ** | သာမန် PHP Class ဖြစ်ပြီး `services.yaml` ထဲတွင် Tag တွဲ၍ Config ရေးပေးရသည် | Class ကိုယ်တိုင်က `EventSubscriberInterface` ကို Implement လုပ်ထားသည် |
| **စာရင်းသွင်းမှု** | Configuration ဖိုင်ထဲတွင် တစ်ခုချင်း သွားရောက် ညွှန်းရသည် | Class ထဲရှိ `getSubscribedEvents()` method က မိမိနားစွင့်လိုသော Event များကို ကိုယ်တိုင် ကြေညာထားသည် |
| **အသုံးပြုရ လွယ်ကူမှု** | ဖိုင် ၂ ခု ပြင်ရသဖြင့် ရှုပ်ထွေးသည် | ဖိုင် ၁ ခုတည်း ရေးသားရုံဖြင့် Symfony က **Autowiring ဖြင့် အလိုအလျောက် သိရှိသည်** ✅ |

---

## 🌐 EC-CUBE တွင် အသုံးပြုနိုင်သော အဓိက Event အုပ်စု ၄ မျိုး

### ၁။ EC-CUBE Core Business Events (`EccubeEvents`)
EC-CUBE ၏ အဓိက E-Commerce လုပ်ငန်းစဉ်များ ပြီးဆုံးချိန်တွင် အလုပ်လုပ်သော Event များ:
- `EccubeEvents::MAIL_ORDER`: အော်ဒါအတည်ပြုစာ ပို့ဆောင်ချိန်။
- `EccubeEvents::MAIL_ENTRY`: ဖောက်သည် အကောင့်အသစ် ဖွင့်ချိန်။
- `EccubeEvents::ADMIN_ORDER_EDIT_INDEX_COMPLETE`: Admin မှ အော်ဒါပြင်ဆင်မှု သိမ်းဆည်းပြီးချိန်။
- `EccubeEvents::FRONT_SHOPPING_INDEX_INITIALIZE`: ဖောက်သည်သည် Checkout စာမျက်နှာသို့ စတင် ရောက်ရှိချိန်။

---

### ၂။ Template Events (`eccube.event.render.*`)
Twig ဖိုင်များကို လုံးဝ သွားပြင်စရာမလိုဘဲ မျက်နှာပြင်များပေါ်သို့ HTML ခလုတ်များ၊ စာသားများ၊ Banner များကို လှမ်းညှပ်ထည့်ပေးသော Event များ:
- `eccube.event.render.product_detail.before`: ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာတွင် UI ကြားညှပ်ခြင်း။
- `eccube.event.render.cart.before`: ခြင်းတောင်း (Cart) စာမျက်နှာတွင် UI ကြားညှပ်ခြင်း။
- `eccube.event.render.admin_order_edit.before`: Admin အော်ဒါပြင်ဆင်သည့် မျက်နှာပြင်တွင် UI ကြားညှပ်ခြင်း။

---

### ၃။ Symfony HttpKernel Events (`KernelEvents`)
ဝဘ်ဆိုက်၏ HTTP Request စတင်ဝင်ရောက်လာချိန်မှ စာမျက်နှာ ပြန်လည် ထွက်သွားချိန်အထိ အဆင့်ဆင့်တွင် ကြားဖြတ်စစ်ဆေးသော Event များ:
- `KernelEvents::REQUEST`: မည်သည့် Controller မှ အလုပ်မလုပ်မီ Request ကို အစောဆုံး ကြားဖြတ်စစ်ဆေးခြင်း (ဥပမာ: IP Block ရန်၊ Maintenance စစ်ရန်)။
- `KernelEvents::RESPONSE`: Browser ထံသို့ HTML မရောက်မီ Header များ ထည့်သွင်းခြင်း။
- `KernelEvents::EXCEPTION`: စနစ်တွင် Error တက်သွားချိန် ဖမ်းယူခြင်း။

---

### ၄။ Symfony Form Events (`FormEvents`)
Form မျက်နှာပြင်များတွင် Field အသစ်များ အလိုအလျောက် ထည့်သွင်းခြင်းနှင့် ဒေတာ စစ်ဆေးခြင်းများအတွက် သုံးသည်:
- `FormEvents::PRE_SET_DATA`: Form မျက်နှာပြင် မပြသမီ အခြေအနေပေါ်မူတည်၍ Input box အသစ် ထပ်ထည့်ခြင်း။
- `FormEvents::POST_SUBMIT`: Submit နှိပ်ပြီးချိန်တွင် ဒေတာများကို သီးခြား စိစစ်ခြင်း။

---

## 🏗️ EventSubscriber Class တစ်ခု၏ မူရင်း ဖွဲ့စည်းပုံ

EC-CUBE 4.x တွင် EventSubscriber အားလုံးကို `app/Customize/EventSubscriber/` ဖိုင်တွဲအောက်တွင် ဖန်တီးရပါသည်:

```php
namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrderNotificationSubscriber implements EventSubscriberInterface
{
    /**
     * ၁။ မည်သည့် Event များကို နားစွင့်မည်နည်းကို စာရင်းပေးသွင်းခြင်း (မဖြစ်မနေ ရေးရမည်)
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // [Event အမည် => ခေါ်ယူမည့် Method အမည်]
            EccubeEvents::MAIL_ORDER => 'onOrderComplete',
        ];
    }

    /**
     * ၂။ Event ဖြစ်ပွားချိန်တွင် လုပ်ဆောင်မည့် အလုပ် (Callback Method)
     */
    public function onOrderComplete(EventArgs $event): void
    {
        // Event ထဲမှ အော်ဒါ Entity ကို ရယူခြင်း
        $order = $event->getArgument('Order');

        if (!$order) {
            return;
        }

        // ဤနေရာတွင် စိတ်ကြိုက် လုပ်ငန်းများ လုပ်ဆောင်နိုင်သည်
        // ဥပမာ: $order->getOrderNo() ကို သုံး၍ Slack သို့ စာပို့ခြင်း
    }
}
```

ဤဖိုင်ကို သိမ်းဆည်းလိုက်ရုံဖြင့် EC-CUBE (Symfony) သည် အလိုအလျောက် သိရှိသွားပြီး၊ အော်ဒါတက်သည့်အခါတိုင်း သင်ရေးသားထားသော `onOrderComplete()` method ကို အလိုအလျောက် လှမ်းခေါ်ပေးသွားမည် ဖြစ်ပါသည်။
