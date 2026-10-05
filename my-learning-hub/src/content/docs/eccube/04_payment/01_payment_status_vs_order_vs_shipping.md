---
title: "01. Payment Status Vs Order Vs Shipping"
description: "> Core Architectural Concept:"
---

## 01 - Payment Status vs Order Status vs Shipping Status (Status ၃ မျိုး၏ ကွာခြားချက်)

> **Core Architectural Concept**:  
> E-Commerce စနစ်တစ်ခုတွင် အော်ဒါတစ်ခု၏ အခြေအနေကို စီမံခန့်ခွဲရာတွင် **ငွေပေးချေမှု (Payment)**၊ **အော်ဒါ အလုံးစုံ (Order)** နှင့် **ပစ္စည်းပို့ဆောင်မှု (Shipping)** ဟူ၍ ဝင်ရိုး ၃ ခု ခွဲခြားထားရပါမည်။ ဤ Status ၃ ခုသည် သီးခြားစီ တည်ရှိပြီး အချိန်နှင့်အမျှ တစ်ခုနှင့်တစ်ခု အပြန်အလှန် ချိတ်ဆက် ပြောင်းလဲသွားကြပါသည်။

---

## 📊 Status ၃ မျိုး နှိုင်းယှဉ်ချက် ဇယား

| ကဏ္ဍ | ၁။ Payment Status (決済状況) | ၂။ Order Status (注文状況) | ၃။ Shipping Status (発送状況) |
|:---|:---|:---|:---|
| **မေးခွန်း** | *"ငွေ ပေးချေပြီးပြီလား?"* | *"ဒီ အော်ဒါ ဘာအဆင့် ရောက်နေပြီလဲ?"* | *"ပစ္စည်း ပို့ပြီးပြီလား?"* |
| **တာဝန်ခံ စနစ်** | Payment Gateway (GMO, Stripe, Bank) | EC-CUBE Core Order Management | Warehouse / Logistics (Yamato, Sagawa) |
| **Database Field** | `dtb_order.payment_date`, Gateway Transaction Status | `dtb_order.order_status_id` (`mtb_order_status`) | `dtb_shipping.shipping_date`, Tracking Number |
| **အဓိက တန်ဖိုးများ** | 1. **未決済 (Unpaid)**<br>2. **与信 / 仮売上 (Authorized)**<br>3. **売上確定 (Captured / Paid)**<br>4. **決済失敗 (Failed)**<br>5. **返金済み (Refunded)** | 1. **購入処理中 (Cart Checkout)**<br>2. **新規受付 (New Order)**<br>3. **入金待ち (Awaiting Payment)**<br>4. **対応中 (In Progress)**<br>5. **発送済み (Completed)**<br>6. **注文取消し (Cancelled)** | 1. **未出荷 (Not Shipped)**<br>2. **出荷準備中 (Packing / Picking)**<br>3. **出荷完了 (Shipped with Tracking)** |

---

## 🔄 ငွေချေနည်းလမ်းအလိုက် Status များ ပြောင်းလဲပုံ (Real-World Lifecycle Matrix)

### ၁။ Credit Card ဖြင့် ငွေချေခြင်း (即時決済 - Immediate / Auth-Capture)
Credit Card တွင် ပစ္စည်း မပို့မီ ငွေကို ခေတ္တ ထိန်းထားပြီး (仮売上 / Auth)၊ ပစ္စည်းပို့သည့်နေ့တွင်မှ ငွေကို အပြီးသတ် ဖြတ်ယူလေ့ရှိပါသည် (売上確定 / Capture):

```
[အော်ဒါ တင်လိုက်ချိန်]
├── Payment Status: 与信 (Auth - ငွေခေတ္တ ထိန်းထားသည်)
├── Order Status:   新規受付 (New Order)
└── Shipping Status: 未出荷 (Not Shipped)
          │
          ▼ [ဂိုဒေါင်မှ ပစ္စည်း ထုတ်ပိုးချိန်]
├── Payment Status: 与信 (Auth ဆက်လက်ထိန်းထားဆဲ)
├── Order Status:   対応中 (In Progress)
└── Shipping Status: 出荷準備中 (Packing)
          │
          ▼ [ချောပို့ယာဉ်ပေါ်သို့ ပစ္စည်း အပ်နှံချိန်]
├── Payment Status: 売上確定 (Captured - ကတ်ထဲမှ ငွေအပြီးသတ် ဖြတ်လိုက်သည်)
├── Order Status:   発送済み (Shipped / Completed)
└── Shipping Status: 出荷完了 (Shipped with Tracking No)
```

---

### ၂။ Convenience Store သို့မဟုတ် Bank Transfer (前払い - Pre-payment)
ကြိုတင် ငွေလွှဲစနစ်တွင် ငွေမဝင်မချင်း ပစ္စည်း လုံးဝ မပို့ဆောင်ပါ:

```
[အော်ဒါ တင်လိုက်ချိန်]
├── Payment Status: 未入金 (Unpaid)
├── Order Status:   入金待ち (Waiting for Payment)
└── Shipping Status: 未出荷 (Not Shipped)
          │
          ▼ [Customer က 7-Eleven တွင် ငွေသွားချေလိုက်ချိန်]
├── Payment Status: 入金済み (Paid)
├── Order Status:   対応中 (In Progress / Packing)
└── Shipping Status: 出荷準備中 (Packing)
          │
          ▼ [ပစ္စည်း ပို့ဆောင်လိုက်ချိန်]
├── Payment Status: 入金済み (Paid)
├── Order Status:   発送済み (Completed)
└── Shipping Status: 出荷完了 (Shipped)
```

---

### ၃။ Cash on Delivery (代金引換 - COD / 後払い)
ပစ္စည်းရောက်မှ ငွေချေသည့် စနစ်တွင် ပစ္စည်းပို့ပြီးမှသာ ငွေလက်ခံရရှိပါသည်:

```
[အော်ဒါ တင်လိုက်ချိန်]
├── Payment Status: 未決済 (Unpaid)
├── Order Status:   新規受付 (New Order)
└── Shipping Status: 未出荷 (Not Shipped)
          │
          ▼ [ချောပို့ကုမ္ပဏီက ပစ္စည်း ပို့ဆောင်ပြီး Customer ထံမှ ငွေကောက်ခံချိန်]
├── Payment Status: 入金済み (Paid / Collected by Courier)
├── Order Status:   発送済み (Completed)
└── Shipping Status: 出荷完了 (Shipped)
```

---

## ⚡ အဘယ်ကြောင့် Status ၃ ခုကို သီးခြား ခွဲထုတ်ထားရသနည်း?

Beginner များ မကြာခဏ မေးလေ့ရှိသော မေးခွန်း:  
> *"Order Status တစ်ခုတည်းနဲ့တင် အားလုံး မပြီးဘူးလား? ဘာကြောင့် Payment Status နဲ့ Shipping Status တွေကို သီးခြား ခွဲထားရတာလဲ?"*

**အဖြေ: လုပ်ငန်းခွင် အမှားအယွင်းများ မဖြစ်စေရန် ဖြစ်ပါသည်။**  
- အကယ်၍ Payment Status ကို သီးခြား မစစ်ဆေးဘဲ Order Status ကို ကြည့်ပြီး ပစ္စည်း ထုတ်ပို့မိပါက (ဥပမာ- ဘဏ်ငွေလွှဲ အတု သို့မဟုတ် Card ငွေမဖြတ်ရသေးမီ ပစ္စည်းပို့မိပါက) ဆိုင်ပိုင်ရှင်အတွက် **ငွေကြေး ဆုံးရှုံးမှုကြီး (Financial Fraud)** ဖြစ်ပေါ်နိုင်ပါသည်။
- ထို့ကြောင့် E-Commerce စနစ်ကြီးများတွင်:
  1. ငွေစာရင်းဌာနသည် **Payment Status** ကို ကြည့်ရှုပြီး၊
  2. ဂိုဒေါင်ဝန်ထမ်းသည် **Shipping Status** ကို ကြည့်ရှုကာ၊
  3. Customer Service အဖွဲ့သည် **Order Status** ကို အလုံးစုံ ကြီးကြပ်ကွပ်ကဲကြပါသည်။
