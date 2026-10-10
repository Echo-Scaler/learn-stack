---
title: "02. Customer Auth And Member Pages"
description: "> Client Requirements:"
---

## 02 - Customer Auth & Member-Only Pages (ဖောက်သည် စိစစ်မှုနှင့် အသင်းဝင်သီးသန့် စာမျက်နှာများ)

> **Client Requirements**:
> 1. **Password reset (လျှို့ဝှက်နံပါတ် ပြန်လည်ရယူခြင်း)**: Customer က Password မေ့သွားပါက Email သို့ တစ်ခါသုံး သက်တမ်းရှိသော Reset Token ပို့ပေးပြီး Password အသစ် ပြောင်းလဲနိုင်ရမည်။
> 2. **Member-only pages (အသင်းဝင် သီးသန့် စာမျက်နှာများ)**: VIP အသင်းဝင်များ သို့မဟုတ် Login ဝင်ထားသူများသာ ကြည့်ရှုခွင့်ရှိသော စာမျက်နှာများကို သတ်မှတ်နိုင်ရမည်ဖြစ်ပြီး၊ Login မဝင်ရသေးသူများကို Login စာမျက်နှာသို့ လမ်းညွှန်ပေးရမည်။
> 3. **Smart Redirect (မူလ စာမျက်နှာသို့ ပြန်ပို့ခြင်း)**: Member စာမျက်နှာသို့ ဝင်ရောက်ရန် ကြိုးစားရင်း Login ဝင်လိုက်ရသော Customer အား Login အောင်မြင်သည်နှင့် Home သို့ မပို့ဘဲ သူကြည့်ချင်ခဲ့သော Member စာမျက်နှာဆီသို့ အလိုအလျောက် ပြန်ပို့ပေးရမည် (`_target_path`)။

---

## 🔑 1. Password Reset Architecture (パスワード再発行 Flow)

လုံခြုံရေးအရ Password အဟောင်းကို Email ထဲတွင် လုံးဝ ပြန်မပို့ရပါ။ လျှို့ဝှက် Token ပါသော URL ကိုသာ ပို့ရပါသည်:

```
[Customer enters email at /forgot]
                 │
                 ▼
[ForgotController::index()]
                 │
                 ├── 1. Generate Secure Random Token (bin2hex(random_bytes(32)))
                 ├── 2. Save token into dtb_customer.reset_key with expiry (e.g. 1 hour)
                 └── 3. Send Password Reset Email with URL:
                        https://mystore.com/forgot/reset/{token}
                 │
                 ▼
[Customer clicks Link in Email within 1 hour]
                 │
                 ▼
[ForgotController::reset($token)]
                 │
                 ├── 1. Verify token & expiry in dtb_customer
                 ├── 2. Customer inputs New Password
                 ├── 3. Hash with UserPasswordHasher (Bcrypt)
                 └── 4. Invalidate token (set reset_key = NULL)
                 │
                 ▼
[Password Changed Successfully -> Redirect to Login]
```

---

## 🔒 2. Member-Only Pages (အသင်းဝင်သီးသန့် စာမျက်နှာ ကာကွယ်နည်း ၃ မျိုး)

အသင်းဝင်များသာ ကြည့်ရှုခွင့်ရှိသော စာမျက်နှာ (ဥပမာ- `/vip-sale` သို့မဟုတ် `/member-content`) များကို အောက်ပါနည်းလမ်း ၃ မျိုးဖြင့် ကာကွယ်နိုင်ပါသည်:

### နည်းလမ်း ၁: `security.yaml` တွင် Path ဖြင့် ပိတ်ပင်ခြင်း (Access Control)
အလွယ်ကူဆုံးနှင့် အသန့်ရှင်းဆုံး နည်းလမ်း ဖြစ်သည်:

```yaml
# config/packages/security.yaml
security:
    access_control:
        # /mypage နှင့် /vip-sale လမ်းကြောင်းအားလုံးကို Login ဝင်ထားသူ (ROLE_USER) သာ ဝင်ခွင့်ပြုမည်
        - { path: '^/mypage', roles: ROLE_USER }
        - { path: '^/vip-sale', roles: ROLE_USER }
```

---

### နည်းလမ်း ၂: Controller အတွင်း အသေးစိတ် စစ်ဆေးခြင်း (`denyAccessUnlessGranted`)
စာမျက်နှာတစ်ခုလုံး မဟုတ်ဘဲ Controller Logic တစ်ခုခုကို ကာကွယ်လိုသည့်အခါ:

```php
namespace Eccube\Controller;

use Symfony\Component\Routing\Annotation\Route;

class VipSaleController extends AbstractController
{
    #[Route('/vip-sale', name: 'vip_sale')]
    public function index()
    {
        // Login ဝင်ထားခြင်း မရှိပါက ချက်ချင်း Access Denied ပစ်ချခြင်း
        $this->denyAccessUnlessGranted('ROLE_USER');

        return [
            'vipProducts' => $this->getVipProducts(),
        ];
    }
}
```

---

### နည်းလမ်း ၃: Twig Template တွင် ခွဲခြားဖော်ပြခြင်း
မျက်နှာပြင်တွင် စာသား သို့မဟုတ် ခလုတ်ကို ဝှက်ထားလိုသည့်အခါ:

```twig
{% if is_granted('ROLE_USER') %}
    {# Login ဝင်ထားသော အသင်းဝင်များသာ မြင်ရမည့် VIP Banner #}
    <div class="vip-exclusive-banner alert alert-success">
        🎉 会員様限定：全品 10% OFF クーポン配布中！
    </div>
{% else %}
    {# ဧည့်သည်များအား Login ဝင်ရန် တိုက်တွန်းခြင်း #}
    <div class="alert alert-warning">
        このコンテンツは会員限定です。<a href="{{ url('mypage_login') }}">ログイン</a>してください。
    </div>
{% endif %}
```

---

## ↩️ 3. Smart Redirect: Login ပြီးနောက် မူလ စာမျက်နှာသို့ ပြန်ပို့ခြင်း (`_target_path`)

Customer သည် `/vip-sale` ကို နှိပ်ရာမှ Login စာမျက်နှာသို့ ရောက်သွားပါက Login ဝင်ပြီးသည်နှင့် Home သို့ မရောက်ဘဲ `/vip-sale` သို့ ပြန်ရောက်စေရန် Symfony ၏ **`_target_path`** ကို အသုံးပြုပါသည်:

```html
<!-- Login Form ထဲတွင် မူလစာမျက်နှာ လမ်းကြောင်းကို Hidden ထည့်သွင်းခြင်း -->
<input type="hidden" name="_target_path" value="{{ app.request.headers.get('referer') }}" />
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **パスワード再発行 (Pasuwaado Sai-hakkou)**: Password Reset
- **ワンタイムトークン (Wan-taimu Tookun)**: One-time Secure Token
- **有効期限切れ (Yuukou Kigen-gire)**: Token Expired
- **アクセス制御 (Akusesu Seigyo)**: Access Control / Restriction
- **遷移元 (Sen'i-moto)**: Referer / Original Target Path
