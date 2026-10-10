---
title: "03. Template Events And Ui Hooking"
description: "EC-CUBE ၏ မူရင်း Twig ဖိုင်များကို တစ်စက်မျှ မထိခိုက်စေဘဲ TemplateEvent ကို အသုံးပြု၍ မျက်နှာပြင်များပေါ်တွင် ခလုတ်များ၊ ကြော်ငြာ Banner များနှင့် အချက်အလက်သစ်မ"
---

## 03. Template Events & UI Hooking (Twig မျက်နှာပြင်များကို ကြားညှပ် တိုးချဲ့ခြင်း)

EC-CUBE ၏ မူရင်း Twig ဖိုင်များကို တစ်စက်မျှ မထိခိုက်စေဘဲ **TemplateEvent** ကို အသုံးပြု၍ မျက်နှာပြင်များပေါ်တွင် ခလုတ်များ၊ ကြော်ငြာ Banner များနှင့် အချက်အလက်သစ်များကို ကြားညှပ်ထည့်သွင်းနည်း (UI Hooking) ဖြစ်ပါသည်။

---

## 🎨 Template Event မည်သို့ အလုပ်လုပ်သနည်း?

Controller သည် Twig Template ကို Render မလုပ်မီ (HTML အဖြစ် မပြောင်းလဲမီ) `eccube.event.render.<route>.before` ဟူသော Event တစ်ခုကို ထုတ်လွှင့်ပေးပါသည်။

```
[Controller] ──> [TemplateEvent ထုတ်လွှင့်ခြင်း] ──> [Custom EventSubscriber]
                                                                │
                                                   addSnippet() ဖြင့် HTML ကြားညှပ်ခြင်း
                                                                ▼
                                                [Twig မျက်နှာပြင်တွင် ပေါင်းစပ်ပေါ်လာခြင်း]
```

### အသုံးများသော Template Event လမ်းကြောင်းများ:
- `eccube.event.render.product_detail.before`: ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာ
- `eccube.event.render.product_list.before`: ကုန်ပစ္စည်း စာရင်း စာမျက်နှာ
- `eccube.event.render.cart.before`: ခြင်းတောင်း စာမျက်နှာ
- `eccube.event.render.shopping.before`: Checkout ငွေချေသည့် စာမျက်နှာ
- `eccube.event.render.admin_product_product_edit.before`: Admin ကုန်ပစ္စည်း ပြင်ဆင်သည့် မျက်နှာပြင်

---

## 🛠️ လက်တွေ့ စီမံကိန်း: ကုန်ပစ္စည်း စာမျက်နှာတွင် "ယနေ့ ပို့ဆောင်နိုင်သည်" Banner ကြားညှပ်ထည့်ခြင်း

Client ၏ တောင်းဆိုချက်အရ ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာ (`Product/detail.twig`) ကို မထိခိုက်စေဘဲ "本日13時までのご注文で即日発送 (ယနေ့ ၁၃:၀၀ မတိုင်မီ မှာယူပါက ချက်ချင်း ပို့ဆောင်ပေးမည်)" ဟူသော Banner ထည့်သွင်းပုံ ဖြစ်ပါသည်။

---

### အဆင့် ၁။ ကြားညှပ်မည့် Twig အပိုင်းအစ ဖန်တီးခြင်း
ဖိုင်လမ်းကြောင်း: `app/template/default/Product/snippet_shipping_notice.twig`

```twig
{# ကြားညှပ်ထည့်သွင်းမည့် HTML Snippet #}
<div class="ec-shipping-badge" style="
    background-color: #E8F5E9;
    border: 1px solid #4CAF50;
    color: #2E7D32;
    padding: 12px;
    border-radius: 6px;
    margin: 15px 0;
    font-weight: bold;
    display: flex;
    align-items: center;
">
    <span style="font-size: 20px; margin-right: 8px;">🚚</span>
    <div>
        <div>本日13時までのご注文で【即日発送】対応可能！</div>
        <small style="color: #666; font-weight: normal;">※ 土日祝日を除く平日のご注文に限ります。</small>
    </div>
</div>
```

---

### အဆင့် ၂။ EventSubscriber ရေးသားခြင်း
ဖိုင်လမ်းကြောင်း: `app/Customize/EventSubscriber/ProductDetailSnippetSubscriber.php`

```php
namespace Customize\EventSubscriber;

use Eccube\Event\TemplateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductDetailSnippetSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            // ကုန်ပစ္စည်း အသေးစိတ် စာမျက်နှာ၏ Render Event ကို နားစွင့်ခြင်း
            'eccube.event.render.product_detail.before' => 'onProductDetailRender',
        ];
    }

    public function onProductDetailRender(TemplateEvent $event): void
    {
        // ၁။ Twig ထံသို့ ပို့ပေးမည့် Parameter များကို ရယူစစ်ဆေးခြင်း
        $parameters = $event->getParameters();
        $product = $parameters['Product'] ?? null;

        if (!$product) {
            return;
        }

        // ၂။ အကယ်၍ စတော့ ရှိမှသာ Banner ပြသလိုပါက စစ်ဆေးနိုင်သည်
        if ($product->getStockFind()) {
            // addSnippet ဖြင့် ဖန်တီးထားသော Twig Snippet ဖိုင်ကို ကြားညှပ်ထည့်သွင်းခြင်း
            $event->addSnippet('@default/Product/snippet_shipping_notice.twig');
        }
    }
}
```

---

## 💡 `TemplateEvent` ၏ အသုံးဝင်သော Method များ

### ၁။ `setParameter()` ဖြင့် Twig သို့ Data အသစ် လှမ်းပို့ပေးခြင်း:
Twig Template ထဲတွင် သုံးစွဲနိုင်ရန် Controller မှ မပါလာသော Custom Variable များကို Subscriber မှတစ်ဆင့် လှမ်းထည့်ပေးနိုင်ပါသည်:

```php
public function onProductDetailRender(TemplateEvent $event): void
{
    // Twig ထဲတွင် {{ custom_delivery_date }} ဟု ခေါ်သုံးနိုင်စေရန် သတ်မှတ်ခြင်း
    $event->setParameter('custom_delivery_date', (new \DateTime())->modify('+2 days')->format('Y-m-d'));
}
```

### ၂။ `addSnippet()` တွင် တိုက်ရိုက် HTML ထည့်သွင်းခြင်း:
သီးသန့် Twig ဖိုင် မဖန်တီးလိုပါက HTML String ကို တိုက်ရိုက် ထည့်သွင်းနိုင်ပါသည်:
```php
$event->addSnippet('<div class="alert alert-info">特別セール開催中！</div>');
```

ဤနည်းအားဖြင့် EC-CUBE ၏ Core Template များကို မူရင်းအတိုင်း သန့်ရှင်းစွာ ထားရှိနိုင်ပြီး၊ မည်သည့် Version Update တွင်မဆို သင်၏ Custom UI များ အမြဲ အဆင်ပြေစွာ ဆက်လက် တည်ရှိနေမည် ဖြစ်ပါသည်။
