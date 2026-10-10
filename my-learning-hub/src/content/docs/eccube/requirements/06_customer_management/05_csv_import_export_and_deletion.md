---
title: "05. Csv Import Export And Deletion"
description: "> Client Requirements:"
---

## 05 - Customer CSV Import/Export & Account Deletion (CSV စနစ်နှင့် အသင်းဝင်မှ နုတ်ထွက်ခြင်း)

> **Client Requirements**:
> 1. **Customer CSV import/export (ဖောက်သည် CSV သွင်းခြင်း/ထုတ်ယူခြင်း)**: အခြား စနစ်ဟောင်း (POS / CRM) မှ ဖောက်သည် စာရင်းများကို EC-CUBE ထဲသို့ CSV ဖြင့် တစ်ပြိုင်နက် သွင်းနိုင်ရမည်။ အီးမေးလ် ပရိုမိုးရှင်း (Newsletter / DM) ပို့ရန်အတွက် ဖောက်သည် စာရင်းများကို CSV ထုတ်ယူနိုင်ရမည်။
> 2. **Customer account deletion (အသင်းဝင်မှ နုတ်ထွက်ခြင်း / 退会)**: ဝယ်ယူသူက မိမိ Account ကို ဖျက်သိမ်းလိုပါက MyPage မှ နုတ်ထွက်နိုင်ရမည်။ သို့သော် **ယခင် ဝယ်ယူထားဖူးသော Order စာရင်းဇယားများနှင့် ငွေစာရင်းများ မပျက်စီးစေရပါ**။

---

## 📥 1. Customer CSV Import (ဖောက်သည် စာရင်း အစုလိုက် သွင်းခြင်း)

စနစ်ဟောင်းမှ Customer ဒေတာများကို ရွှေ့ပြောင်း (Data Migration) သည့်အခါ အသုံးပြုပါသည်:
- **Admin Controller**: `src/Eccube/Controller/Admin/Customer/CustomerCsvImportController.php`
- **CSV Type ID**: `2` (`dtb_csv` ဇယားတွင် `csv_type_id = 2` ဖြစ်သည်)

### အရေးကြီးသော Password ပြဿနာ:
> ❓ **"CSV ထဲတွင် Password များကို မည်သို့ ထည့်သွင်းရမည်နည်း?"**  
> CSV ဖိုင်ထဲတွင် Password ကို Plain Text (ဥပမာ- `Password123`) အဖြစ် ထည့်သွင်းပေးလိုက်ပါက EC-CUBE ၏ Import Controller က `UserPasswordHasherInterface` ဖြင့် Bcrypt Hash အဖြစ် အလိုအလျောက် ပြောင်းလဲပြီး Database ထဲသို့ သိမ်းဆည်းပေးပါသည်။

```php
// CustomerCsvImportController.php (Password Hash Logic)
if (!empty($row['パスワード'])) {
    $encodedPassword = $this->passwordHasher->hashPassword($Customer, $row['パスワード']);
    $Customer->setPassword($encodedPassword);
}
```

---

## 📤 2. Customer CSV Export (ဖောက်သည် စာရင်း ဒေတာ ထုတ်ယူခြင်း)

Admin သည် **会員管理 ➔ 会員一覧** တွင် Search Filter ပြုလုပ်ပြီး ရလဒ်များကို CSV အဖြစ် Download ရယူနိုင်ပါသည်:

```php
// CsvExportService.php
public function exportCustomerCsv(QueryBuilder $qb): StreamedResponse
{
    $response = new StreamedResponse(function () use ($qb) {
        $handle = fopen('php://output', 'w');
        // Excel ဂျပန်စာလုံး မပျက်စေရန် BOM ထည့်ခြင်း
        fwrite($handle, "\xEF\xBB\xBF");

        // Header Row
        fputcsv($handle, ['会員ID', 'お名前', 'フリガナ', 'メールアドレス', '電話番号', '都道府県', '累計購入金額', '会員ステータス']);

        $customers = $qb->getQuery()->getResult();
        foreach ($customers as $Customer) {
            fputcsv($handle, [
                $Customer->getId(),
                $Customer->getName01().' '.$Customer->getName02(),
                $Customer->getKana01().' '.$Customer->getKana02(),
                $Customer->getEmail(),
                $Customer->getPhoneNumber(),
                $Customer->getPref() ? $Customer->getPref()->getName() : '',
                $Customer->getBuyTotal(),
                $Customer->getStatus()->getName(),
            ]);
        }
        fclose($handle);
    });

    return $response;
}
```

---

## 🚪 3. Customer Account Deletion (退会手続き - အသင်းဝင်မှ နုတ်ထွက်ခြင်း Architecture)

ဝယ်ယူသူက မိမိ Account ကို ဖျက်လိုသည့်အခါ **MyPage ➔ 退会手続き (`/mypage/withdraw`)** သို့ သွားရောက် လုပ်ဆောင်ပါသည်:

```
[Customer Clicks "退会する (Withdraw)"]
                    │
                    ▼ (HTTP POST /mypage/withdraw)
        [MypageController::withdraw()]
                    │
                    ├── 1. Ongoing Orders Check (မပြီးပြတ်သေးသော အော်ဒါ ရှိမရှိ စစ်ခြင်း)
                    │
                    ├── 2. Soft Delete & Anonymization (အချက်အလက်များကို ဝှက်ခြင်း)
                    │      ├── Status: 3 (退会 - Withdrawn)
                    │      ├── Email: "withdrawn_{id}_{timestamp}@example.com"
                    │      ├── Password: NULL (Clear Password)
                    │      └── Point: 0 (Point များ ပယ်ဖျက်ခြင်း)
                    │
                    ├── 3. Invalidate Session & Logout
                    │
                    ▼
         [Show "退会完了 (Withdrawal Complete)"]
```

---

## 🗄️ အဘယ်ကြောင့် Database မှ `DELETE` အပြီးအပိုင် မလုပ်သနည်း?

Beginner Developer များ မကြာခဏ နားလည်မှုလွဲမှားတတ်သော အချက်:
> *"Customer က Account ဖျက်ချင်တယ်ဆိုရင် `DELETE FROM dtb_customer WHERE id = ?` ဆိုပြီး Database ထဲက အပြီးဖျက်ပေးလိုက်ရင် မရဘူးလား?"*

**လုံးဝ မရပါ! အကြောင်းရင်း ၂ ချက် ရှိပါသည်:**
1. **Foreign Key Constraint (ဒေတာ ချိတ်ဆက်မှု)**:  
   ထို Customer သည် ယခင်က ဝယ်ယူခဲ့ဖူးသော အော်ဒါများ (`dtb_order`) ရှိနေပါသည်။ Customer ကို အပြီးဖျက်လိုက်ပါက Order Table ပျက်စီးသွားပြီး ငွေစာရင်းများ လွဲချော်သွားမည် ဖြစ်သည်။
2. **Japanese Tax & Commercial Law (ဂျပန် ဥပဒေ စံနှုန်း)**:  
   ဂျပန်နိုင်ငံ အခွန်ဥပဒေအရ စီးပွားရေးလုပ်ငန်းများသည် ဝယ်ယူသူများ၏ အော်ဒါစာရင်းနှင့် ငွေစာရင်းများကို အနည်းဆုံး ၇ နှစ်မှ ၁၀ နှစ်အထိ မဖြစ်မနေ သိမ်းဆည်းထားရပါသည်!

### ဖြေရှင်းနည်း: Data Anonymization (အချက်အလက်များကို နာမည်ဖျောက်ခြင်း)
Customer အချက်အလက်များကို Database မှ မဖျက်ဘဲ အောက်ပါအတိုင်း **Anonymize** ပြုလုပ်ပေးပါသည်:

```php
// MypageController.php
public function withdraw(Request $request)
{
    /** @var Customer $Customer */
    $Customer = $this->getUser();

    // ၁။ Status ကို 退会 (Status ID: 3) သို့ ပြောင်းခြင်း
    $WithdrawnStatus = $this->customerStatusRepository->find(CustomerStatus::WITHDRAWING);
    $Customer->setStatus($WithdrawnStatus);

    // ၂။ နောက်တစ်ကြိမ် ထို Email ဖြင့် အသစ်ပြန်ဖွင့်နိုင်ရန် Email ကို နာမည်ဖျောက်ပြောင်းလဲခြင်း
    $Customer->setEmail(sprintf('withdrawn_%d_%s@example.com', $Customer->getId(), date('YmdHis')));
    
    // ၃။ Password နှင့် Point များကို ရှင်းထုတ်ခြင်း
    $Customer->setPassword('');
    $Customer->setPoint(0);

    $this->entityManager->flush();

    // ၄။ Session ရှင်းထုတ်ပြီး Logout လုပ်ခြင်း
    $this->tokenStorage->setToken(null);
    $request->getSession()->invalidate();

    return $this->redirectToRoute('mypage_withdraw_complete');
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **顧客CSV登録 (Kokyaku CSV Touroku)**: Customer CSV Import
- **顧客CSV出力 (Kokyaku CSV Shutsuryoku)**: Customer CSV Export
- **退会手続き (Taikai Tetsuzuki)**: Membership Withdrawal / Account Deletion
- **退会済み (Taikai-zumi)**: Withdrawn / Inactive Member
- **個人情報保護 (Kojin Jouhou Hogo)**: Personal Information Protection (Privacy / GDPR)
- **匿名化 (Tokumeika)**: Anonymization (ဖောက်သည် ကိုယ်ရေးအချက်အလက်ကို ဖျောက်ဖျက်ခြင်း)
