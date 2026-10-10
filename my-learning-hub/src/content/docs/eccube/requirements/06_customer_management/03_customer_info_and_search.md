---
title: "03. Customer Info And Search"
description: "> Client Requirements:"
---

## 03 - Customer Info Editing & Customer Search (အချက်အလက် ပြင်ဆင်ခြင်းနှင့် ဖောက်သည် ရှာဖွေခြင်း)

> **Client Requirements**:
> 1. **Customer information editing (အချက်အလက်များ ပြင်ဆင်ခြင်း)**: Customer သည် မိမိ၏ MyPage စာမျက်နှာမှ လိပ်စာ၊ ဖုန်းနံပါတ်၊ Password များကို ပြင်ဆင်နိုင်ရမည်။ ထို့အပြင် အခြား ပို့ဆောင်လိုသော လိပ်စာခွဲများစွာ (Multiple Shipping Addresses) ကိုလည်း ကြိုတင် မှတ်သားထားနိုင်ရမည်။
> 2. **Customer search (Admin ဖောက်သည် ရှာဖွေခြင်း)**: Admin Dashboard မှ ဖောက်သည်များကို အမည်၊ ဖုန်းနံပါတ်၊ စီရင်စု အပြင် **ဝယ်ယူခဲ့သော အကြိမ်ရေ (Purchase Count)**၊ **စုစုပေါင်း သုံးစွဲခဲ့သော ငွေပမာဏ (Total Purchase Amount)**၊ **နောက်ဆုံး ဝယ်ယူခဲ့သည့် ရက်စွဲ (Last Order Date)** စသည်တို့ဖြင့် အသေးစိတ် ရှာဖွေနိုင်ရမည်။

---

## 👤 1. Customer Information Editing (အချက်အလက် ပြင်ဆင်ခြင်း)

### Front MyPage တွင် Customer ကိုယ်တိုင် ပြင်ဆင်ခြင်း:
- **Controller**: `src/Eccube/Controller/Mypage/MypageController::change`
- **Template**: `src/Eccube/Resource/template/default/Mypage/change.twig`

Customer သည် လိပ်စာ သို့မဟုတ် Password ပြောင်းလဲလိုပါက လက်ရှိ Login ဝင်ထားသော Account ဖြစ်ကြောင်း သေချာစေရန် Password အဟောင်းကို ပြန်လည် စစ်ဆေးပြီးမှ ပြင်ဆင်ခွင့် ပြုထားပါသည်:

```php
// MypageController.php
#[Route('/mypage/change', name: 'mypage_change')]
public function change(Request $request)
{
    $Customer = $this->getUser(); // လက်ရှိ Login User ကို ယူခြင်း
    $form = $this->formFactory->createBuilder(EntryType::class, $Customer)->getForm();
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        // Password အသစ် ထည့်ထားပါက Hash ပြုလုပ်ခြင်း
        if ($form->get('password')->getData()) {
            $encodedPassword = $this->passwordHasher->hashPassword($Customer, $form->get('password')->getData());
            $Customer->setPassword($encodedPassword);
        }

        $this->entityManager->flush();
        $this->addSuccess('front.mypage.change_complete');

        return $this->redirectToRoute('mypage');
    }

    return ['form' => $form->createView()];
}
```

---

## 🏠 လိပ်စာခွဲများ ထည့်သွင်းခြင်း (Multiple Delivery Addresses - `dtb_customer_address`)

Customer တစ်ဦးသည် မိမိအိမ်လိပ်စာ အပြင် ရုံးလိပ်စာ၊ မိဘအိမ်လိပ်စာ စသည်ဖြင့် လိပ်စာအများအပြား သိမ်းထားနိုင်ပါသည်:
- **Table**: `dtb_customer_address`
- **Controller**: `MypageController::delivery`, `deliveryEdit`
- **Template**: `src/Eccube/Resource/template/default/Mypage/delivery.twig`

အဆိုပါ သိမ်းဆည်းထားသော လိပ်စာများသည် နောက်တစ်ကြိမ် Checkout ပြုလုပ်သည့်အခါ Dropdown မှ တစ်ချက်နှိပ်ရုံဖြင့် ရွေးချယ်နိုင်မည် ဖြစ်သည်။

---

## 🔍 2. Customer Search (Admin ဖောက်သည် ရှာဖွေခြင်း Architecture)

Admin သည် **会員管理 ➔ 会員一覧 (Customer List)** တွင် အဆင့်မြင့် ရှာဖွေမှု (Advanced Search) ပြုလုပ်နိုင်ပါသည်:

```
[Admin Search Form (SearchCustomerType)]
                    │
                    ▼ (HTTP GET /%eccube_admin_route%/customer)
        [CustomerController::index()]
                    │
                    ▼
[CustomerRepository::getQueryBuilderBySearchDataForAdmin($searchData)]
                    │
                    ├── 1. Basic Filters: Name, Kana, Email, Phone, Pref
                    ├── 2. Date Filters: Birth Month, Registration Date (登録日)
                    ├── 3. Purchase Count Filter: (e.g. >= 5 orders)
                    ├── 4. Total Amount Filter: (e.g. >= 50,000 円)
                    └── 5. Last Order Date Filter: (e.g. Within last 3 months)
                    │
                    ▼
          [KnpPaginator] ── Pagination
                    │
                    ▼
          [admin/Customer/index.twig] ── Customer Table Display
```

### သက်ဆိုင်ရာ Repository Query Implementation:
EC-CUBE ၏ `CustomerRepository.php` တွင် Order Table နှင့် Join တွက်ချက်ထားသော Query Logic:

```php
// CustomerRepository.php
public function getQueryBuilderBySearchDataForAdmin($searchData)
{
    $qb = $this->createQueryBuilder('c')
        ->addSelect(['status'])
        ->leftJoin('c.Status', 'status');

    // ဝယ်ယူသည့် အကြိမ်ရေဖြင့် ရှာဖွေခြင်း (ဥပမာ- အနည်းဆုံး ၅ ကြိမ် ဝယ်ဖူးသူများ)
    if (isset($searchData['buy_times_start']) && is_numeric($searchData['buy_times_start'])) {
        $qb->andWhere('c.buy_times >= :buy_times_start')
           ->setParameter('buy_times_start', $searchData['buy_times_start']);
    }

    // စုစုပေါင်း သုံးစွဲခဲ့သော ငွေပမာဏဖြင့် ရှာဖွေခြင်း (ဥပမာ- အနည်းဆုံး ၁ သိန်းယန်း သုံးဖူးသူများ)
    if (isset($searchData['buy_total_start']) && is_numeric($searchData['buy_total_start'])) {
        $qb->andWhere('c.buy_total >= :buy_total_start')
           ->setParameter('buy_total_start', $searchData['buy_total_start']);
    }

    // နောက်ဆုံး ဝယ်ယူခဲ့သည့် ရက်စွဲဖြင့် ရှာဖွေခြင်း (ဥပမာ- ရက် ၃၀ အတွင်း ဝယ်ယူသူများ)
    if (!empty($searchData['last_buy_start'])) {
        $qb->andWhere('c.last_buy_date >= :last_buy_start')
           ->setParameter('last_buy_start', $searchData['last_buy_start']);
    }

    $qb->orderBy('c.update_date', 'DESC');
    return $qb;
}
```

> 💡 **CRM Architecture Note**:  
> EC-CUBE သည် Customer တစ်ဦး Order တင်ပြီးတိုင်း `c.buy_times` (အကြိမ်ရေ)၊ `c.buy_total` (စုစုပေါင်းငွေ)၊ `c.last_buy_date` (နောက်ဆုံးရက်စွဲ) တို့ကို `dtb_customer` ဇယားထဲတွင် Cache အနေဖြင့် အလိုအလျောက် Update လုပ်ပေးထားသဖြင့် ရှာဖွေရာတွင် အလွန် မြန်ဆန်ပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **会員情報変更 (Kaiin Jouhou Henkou)**: Edit Member Information
- **お届け先追加 (Otodokesaki Tsuika)**: Add Additional Delivery Address
- **顧客検索 (Kokyaku Kensaku)**: Customer Search
- **購入回数 (Kounyuu Kaisuu)**: Purchase Count / Times
- **購入金額 (Kounyuu Kingaku)**: Purchase Amount
- **最終購入日 (Saishuu Kounyuubi)**: Last Purchase Date
- **累計購入金額 (Ruikei Kounyuu Kingaku)**: Cumulative / Total Purchase Amount
