---
title: "03. Authentication Authorization And Access Control"
description: "စနစ်သို့ မည်သူဖြစ်ကြောင်း စစ်ဆေးခြင်း (Authentication)、မည်သည့် လုပ်ပိုင်ခွင့်ရှိကြောင်း စစ်ဆေးခြင်း (Authorization) နှင့် အခြားသူ၏ အချက်အလက်များကို ခိုးယူကြည့်ရ"
---

## 03. Authentication, Authorization & Access Control (認証・認可とアクセス制御)

စနစ်သို့ မည်သူဖြစ်ကြောင်း စစ်ဆေးခြင်း (**Authentication**)、မည်သည့် လုပ်ပိုင်ခွင့်ရှိကြောင်း စစ်ဆေးခြင်း (**Authorization**) နှင့် အခြားသူ၏ အချက်အလက်များကို ခိုးယူကြည့်ရှုခြင်း (**IDOR**) မှ ကာကွယ်နည်းများ ဖြစ်ပါသည်။

---

## 🔑 Authentication vs Authorization ကွာခြားချက်

| အချက် | Authentication (認証 - အတည်ပြုခြင်း) | Authorization (認可 - ခွင့်ပြုချက်) |
|:---|:---|:---|
| **အဓိပ္ပာယ်** | သင်သည် **မည်သူဖြစ်သည်** ကို စစ်ဆေးခြင်း (စကားဝှက်၊ အီးမေးလ် မှန်ကန်မှု) | သင်သည် **မည်သည့်အရာများကို လုပ်ပိုင်ခွင့်ရှိသည်** ကို ဆုံးဖြတ်ခြင်း |
| **ဥပမာ** | စတိုးသို့ အီးမေးလ်နှင့် စကားဝှက် ရိုက်ထည့်၍ Login ဝင်ရောက်ခြင်း | သာမန်ဖောက်သည်သည် Admin စီမံခန့်ခွဲမှု စာမျက်နှာ (`/admin`) သို့ ဝင်ရောက်ခွင့် မရှိခြင်း |
| **ကျရှုံးပါက** | `401 Unauthorized` | `403 Forbidden` |

---

## 🔒 Password Hashing (စကားဝှက် လုံခြုံစွာ သိမ်းဆည်းခြင်း)

EC-CUBE 4.x သည် ခေတ်မမီတော့သော MD5 သို့မဟုတ် SHA-1 များကို လုံးဝ အသုံးမပြုတော့ဘဲ၊ အဆင့်မြင့် **Argon2i / Bcrypt** အယ်လ်ဂိုရီသမ်ဖြင့် အလိုအလျောက် Salt ထည့်သွင်း၍ Hash လုပ်ပေးပါသည်:

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        Eccube\Entity\Member:
            algorithm: auto # argon2i or bcrypt
        Eccube\Entity\Customer:
            algorithm: auto
```

---

## 🚪 `security.yaml` ဖြင့် စာမျက်နှာ လမ်းကြောင်းများ ကာကွယ်ခြင်း (Access Control)

မည်သည့် လမ်းကြောင်း (URL) ကို မည်သူကသာ ဝင်ရောက်ခွင့်ရှိသည်ကို `security.yaml` တွင် စည်းကမ်းချက်များ သတ်မှတ်ပေးရပါသည်:

```yaml
security:
    access_control:
        # Admin Login စာမျက်နှာကို မည်သူမဆို ကြည့်ရှုနိုင်သည်
        - { path: '^/%eccube_admin_route%/login', roles: PUBLIC_ACCESS }
        
        # Admin စီမံခန့်ခွဲမှု ဧရိယာအားလုံးကို ROLE_ADMIN သမားသာ ဝင်ရောက်နိုင်သည်
        - { path: '^/%eccube_admin_route%', roles: ROLE_ADMIN }
        
        # Mypage ဧရိယာအားလုံးကို Login ဝင်ထားသော ဖောက်သည် (ROLE_USER) သာ ဝင်ရောက်နိုင်သည်
        - { path: '^/mypage', roles: ROLE_USER }
```

---

## 🚨 အရေးကြီးဆုံး လုံခြုံရေး အားနည်းချက်: IDOR (Insecure Direct Object Reference)

ဂျပန်နိုင်ငံ လုံခြုံရေး စစ်ဆေးမှုများ (Security Audits) တွင် Developer များ အများဆုံး အပြစ်တင်ခံရလေ့ရှိသော အားနည်းချက်မှာ **IDOR (အခြားသူ၏ အချက်အလက်ကို URL မှ လှမ်းကြည့်နိုင်ခြင်း)** ဖြစ်သည်။

### IDOR ဖြစ်ပွားပုံ:
ဖောက်သည် မောင်မောင် (Customer ID: 10) သည် Login ဝင်ပြီးနောက် မိမိ၏ အော်ဒါအမှတ် ၁၀၄ ကို ကြည့်ရန် `/mypage/history/104` သို့ ဝင်ရောက်သည်။ ထို့နောက် URL Bar တွင် အမှတ် `104` အစား `105` ဟု ပြောင်းလဲ ရိုက်ထည့်လိုက်သောအခါ မသက်ဆိုင်သော အခြားဖောက်သည် ဦးဘ၏ အော်ဒါအချက်အလက် (လိပ်စာ၊ ဖုန်းနံပါတ်၊ ဝယ်ယူခဲ့သော ပစ္စည်းများ) ပေါ်လာခြင်း ဖြစ်ပါသည်။

---

### ❌ မလုံခြုံသော Controller ကုဒ် (IDOR အားနည်းချက် ရှိနေသည်):
```php
/**
 * @Route("/mypage/history/{id}", name="mypage_history")
 */
public function history($id): Response
{
    // ❌ အော်ဒါ ID တိုက်ရိုက် ရှာဖွေထားပြီး လက်ရှိ Login ဝင်ထားသူနှင့် ဆိုင်မဆိုင် လုံးဝ မစစ်ဆေးထားပါ!
    $order = $this->orderRepository->find($id);

    if (!$order) {
        throw new NotFoundHttpException();
    }

    return $this->render('Mypage/history.twig', ['Order' => $order]);
}
```

---

### ✅ လုံခြုံသော Controller ကုဒ် (IDOR ကို ဖြေရှင်းထားသည်):

#### ဖြေရှင်းနည်း ၁: Repository တွင် လက်ရှိ User ဖြင့် တွဲဖက် စစ်ထုတ်ခြင်း
```php
/**
 * @Route("/mypage/history/{id}", name="mypage_history")
 */
public function history($id): Response
{
    $customer = $this->getUser(); // လက်ရှိ Login ဝင်ထားသော Customer ရယူခြင်း

    // ✅ အော်ဒါ ID ကော Customer ID ပါ တပြိုင်နက် ကိုက်ညီမှသာ ဒေတာရမည်
    $order = $this->orderRepository->findOneBy([
        'id'       => $id,
        'Customer' => $customer,
    ]);

    if (!$order) {
        // မသက်ဆိုင်သော အော်ဒါဖြစ်ပါက ချက်ချင်း ဝင်ရောက်ခွင့် ပိတ်ပင်မည်
        throw new AccessDeniedHttpException('You do not have permission to view this order.');
    }

    return $this->render('Mypage/history.twig', ['Order' => $order]);
}
```

#### ဖြေရှင်းနည်း ၂: Symfony Voter Pattern ဖြင့် ပိုင်ဆိုင်မှု စစ်ဆေးခြင်း
```php
// Controller ထဲတွင် တစ်ကြောင်းတည်းဖြင့် စစ်ဆေးနိုင်သည်
$this->denyAccessUnlessGranted('ORDER_VIEW', $order);
```

ဤသို့ စစ်ဆေးပေးခြင်းဖြင့် မသမာသူများ URL Parameter များကို ပြောင်းလဲ၍ အခြားသူများ၏ ကိုယ်ရေးအချက်အလက်များကို ခိုးယူကြည့်ရှုခြင်းမှ ရာနှုန်းပြည့် အကာအကွယ် ပေးနိုင်မည် ဖြစ်ပါသည်။
