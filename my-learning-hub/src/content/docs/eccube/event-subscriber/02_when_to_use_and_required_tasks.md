---
title: "02. When To Use And Required Tasks"
description: "မည်သည့် Task အမျိုးအစားများတွင် EventSubscriber ကို မဖြစ်မနေ အသုံးပြုရသနည်းနှင့်၊ အသုံးပြုရာတွင် မဖြစ်မနေ လိုက်နာပြင်ဆင်ရမည့် နည်းပညာဆိုင်ရာ အချက်များ ဖြစ်ပါသည်"
---

## 02. When to Use & Required Features (ဘယ်အချိန်မှာ သုံးရမည်နှင့် မဖြစ်မနေ လိုက်နာရမည့် စည်းမျဉ်းများ)

မည်သည့် Task အမျိုးအစားများတွင် EventSubscriber ကို မဖြစ်မနေ အသုံးပြုရသနည်းနှင့်၊ အသုံးပြုရာတွင် မဖြစ်မနေ လိုက်နာပြင်ဆင်ရမည့် နည်းပညာဆိုင်ရာ အချက်များ ဖြစ်ပါသည်။

---

## 🎯 မည်သည့် Task များတွင် EventSubscriber ကို မဖြစ်မနေ သုံးရသနည်း? (Use Cases)

EC-CUBE တွင် အောက်ပါ လုပ်ငန်းစဉ် ၄ မျိုး ကြုံတွေ့လာရပါက အခြားနည်းလမ်းများ (Core ပြင်ခြင်း၊ Controller ပြင်ခြင်း) ကို မသုံးဘဲ **EventSubscriber ကိုသာ မဖြစ်မနေ အသုံးပြုရပါသည်**:

### ၁။ Post-Action Side Effects (အဖြစ်အပျက်တစ်ခု ပြီးဆုံးချိန် နောက်ဆက်တွဲ အလုပ်များ အလိုအလျောက် လုပ်ဆောင်ခြင်း):
- 🛒 **အော်ဒါတက်သည့်အခါ**: ဆိုင်ရှင်များ၏ Slack/Chatwork/LINE သို့ အော်ဒါအသစ် ရောက်ရှိကြောင်း ချက်ချင်း အသိပေးစာ ပို့ခြင်း။
- 🎁 **အကောင့်အသစ်ဖွင့်သည့်အခါ**: ဝယ်သူအသစ်ထံသို့ Welcome Point (ဥပမာ 500pt) အလိုအလျောက် ပေးအပ်ခြင်း။
- 💳 **ငွေပေးချေပြီးသည့်အခါ**: စာရင်းကိုင်ဆော့ဖ်ဝဲ (freee) သို့မဟုတ် ဂိုဒေါင်စနစ် (Next Engine) သို့ API ဖြင့် ဒေတာ လှမ်းပို့ခြင်း။

---

### ၂။ Template UI Hooking (မူရင်း Twig ဖိုင်များကို မထိခိုက်ဘဲ မျက်နှာပြင်တွင် UI ကြားညှပ်ခြင်း):
- ပစ္စည်းအသေးစိတ် စာမျက်နှာတွင် မူရင်း `detail.twig` ကို သွားမပြင်ဘဲ "အမြန်ပို့ဆောင်နိုင်သော ပစ္စည်းဖြစ်သည်" ဟူသော Banner အပိုင်းအစ လှမ်းညှပ်ထည့်ခြင်း။
- ဝယ်ယူမှုပြီးဆုံးသည့် စာမျက်နှာ (`complete.twig`) တွင် Affiliate သို့မဟုတ် Google Ads Conversion Tracking Script ကြားညှပ်ထည့်ခြင်း။

---

### ၃။ Dynamic Form Modification (Form များတွင် Input အသစ်များ အလိုအလျောက် ထည့်သွင်းခြင်း):
- ဖောက်သည် မှတ်ပုံတင် Form တွင် "ကုမ္ပဏီအမည်" သို့မဟုတ် "အလုပ်အကိုင်" Input field အသစ် ထပ်မံဖြည့်စွက်ခြင်း။
- အော်ဒါတင်သည့် Checkout Form တွင် "ပို့ဆောင်ရေး သတိပြုရန် မှတ်ချက်" ထည့်သွင်းခွင့်ပြုခြင်း။

---

### ၄။ Interception & Business Rule Enforcement (ကြားဖြတ်စစ်ဆေးပြီး စည်းကမ်းမကိုက်ညီပါက တားမြစ်ခြင်း):
- အထူးလျှော့ဈေး ပစ္စည်းကို လူတစ်ဦးလျှင် ၁ ခုထက်ပို၍ Cart ထဲ ထည့်မရအောင် ကြားဖြတ် တားဆီးခြင်း။
- အဖွဲ့ဝင် မဟုတ်သော သူများသည် VIP ကုန်ပစ္စည်း ကဏ္ဍသို့ ဝင်ရောက်ပါက Login စာမျက်နှာသို့ အလိုအလျောက် လမ်းကြောင်းလွှဲခြင်း (Redirect)။

---

## 📋 EventSubscriber ရေးသားရာတွင် မဖြစ်မနေ လိုအပ်သောအချက်များ (Must-Do Checklist)

EventSubscriber တစ်ခုကို ရေးသားရာတွင် အောက်ပါ အချက် ၆ ချက်ကို **မဖြစ်မနေ တိကျစွာ လိုက်နာရပါမည်**:

### ၁။ `EventSubscriberInterface` ကို မဖြစ်မနေ Implement ပြုလုပ်ရမည်:
```php
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MyCustomSubscriber implements EventSubscriberInterface
```

---

### ၂။ `getSubscribedEvents()` Method ကို မဖြစ်မနေ ကြေညာရမည်:
၎င်းသည် `public static` ဖြစ်ရမည်ဖြစ်ပြီး၊ `[EventName => MethodName]` Array ကို ပြန်ပေးရပါမည်:
```php
public static function getSubscribedEvents(): array
{
    return [
        EccubeEvents::MAIL_ORDER => 'onMailOrder',
    ];
}
```

---

### ၃။ Argument ရယူရာတွင် Null Check အမြဲ ပြုလုပ်ရမည်:
အချို့သော Event များတွင် Argument မပါလာနိုင်သောကြောင့် တိုက်ရိုက် ခေါ်သုံးပါက Fatal Error ဖြစ်သွားနိုင်ပါသည်:
```php
public function onMailOrder(EventArgs $event): void
{
    // ❌ မကောင်းသော ရေးသားပုံ (Argument မရှိပါက Crash ဖြစ်မည်):
    // $orderNo = $event->getArgument('Order')->getOrderNo();

    // ✅ မှန်ကန်သော ရေးသားပုံ:
    $order = $event->getArgument('Order');
    if (!$order) {
        return; // မရှိပါက ဘာမှမလုပ်ဘဲ ပြန်ထွက်မည်
    }
}
```

---

## 🎚️ အဆင့်မြင့် စွမ်းဆောင်ချက်များ (Advanced Features)

### ၁။ Priority (ဦးစားပေး အဆင့်) သတ်မှတ်ခြင်း:
အကယ်၍ Subscriber အများအပြားသည် တူညီသော Event တစ်ခုတည်းကို နားစွင့်နေပါက မည်သူက အရင် အလုပ်လုပ်ရမည်နည်းကို Priority ဂဏန်းဖြင့် ထိန်းချုပ်နိုင်ပါသည်:
- ဂဏန်း **ပိုကြီးသူ** က အရင် အလုပ်လုပ်သည် (ဥပမာ `10` သည် `0` ထက် အရင် Run သည်)။
- Default Priority မှာ `0` ဖြစ်သည်။

```php
public static function getSubscribedEvents(): array
{
    return [
        // [Method အမည်, Priority အဆင့်]
        EccubeEvents::MAIL_ORDER => ['onMailOrderHighPriority', 100],
    ];
}
```

---

### ၂။ Stop Propagation (Event ကို ချက်ချင်း ရပ်တန့်ပစ်ခြင်း):
အကယ်၍ စည်းကမ်းမကိုက်ညီသော တိုက်ခိုက်မှု သို့မဟုတ် ပြဿနာ တွေ့ရှိပါက နောက်ကွယ်ရှိ အခြား Subscriber များနှင့် လုပ်ငန်းစဉ်များကို ဆက်မလုပ်စေဘဲ ရပ်တန့်ပစ်နိုင်ပါသည်:
```php
$event->stopPropagation(); // Event ၏ စီးဆင်းမှုကို ဤနေရာတွင် အပြီးအပိုင် ဖြတ်ချလိုက်သည်
```

---

### ၃။ Cache Clear ပြုလုပ်ခြင်း (အလွန် အရေးကြီးသည်):
EventSubscriber အသစ် ဖန်တီးပြီးချိန် သို့မဟုတ် `getSubscribedEvents()` ထဲရှိ Event အမည်များကို ပြင်ဆင်ပြီးချိန်တိုင်း Symfony Service Container က သိရှိစေရန် Console မှ **Cache ရှင်းပေးရပါမည်**:
```bash
bin/console cache:clear
```
*(အကယ်၍ Cache မရှင်းပါက သင်ရေးထားသော EventSubscriber သည် လုံးဝ အလုပ်လုပ်မည် မဟုတ်ပါ)*
