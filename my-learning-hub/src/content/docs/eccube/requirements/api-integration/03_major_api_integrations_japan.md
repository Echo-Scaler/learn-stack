---
title: "03. Major Api Integrations Japan"
description: "ဂျပန်နိုင်ငံ E-Commerce လုပ်ငန်းလောကတွင် EC-CUBE နှင့် ချိတ်ဆက်အသုံးပြုမှု အများဆုံးဖြစ်သော ပြင်ပ API များနှင့် ၎င်းတို့၏ အဓိက လုပ်ဆောင်ချက်များ ဖြစ်ပါသည်။"
---

## 03. Major Japanese API Integrations (မြန်မာဘာသာ)

ဂျပန်နိုင်ငံ E-Commerce လုပ်ငန်းလောကတွင် EC-CUBE နှင့် ချိတ်ဆက်အသုံးပြုမှု အများဆုံးဖြစ်သော ပြင်ပ API များနှင့် ၎င်းတို့၏ အဓိက လုပ်ဆောင်ချက်များ ဖြစ်ပါသည်။

---

## 🗺️ စနစ်များ ချိတ်ဆက်မှု မြေပုံ (Architecture Ecosystem)

```
                     ┌────────────────────────────────┐
                     │          EC-CUBE 4.x           │
                     └────────────────┬───────────────┘
                                      │
   ┌───────────────┬──────────────────┼──────────────────┬────────────────┐
   │               │                  │                  │                │
┌──▼──────────┐ ┌──▼────────────┐ ┌───▼────────────┐ ┌───▼───────────┐ ┌──▼──────────┐
│   Payment   │ │  Logistics    │ │ Multi-Channel  │ │  Accounting   │ │ Social / AI  │
│  (決済API)  │ │ (送り状連携)  │ │   Inventory    │ │   & ERP       │ │  & Marketing │
├─────────────┤ ├───────────────┤ ├────────────────┤ ├───────────────┤ ├──────────────┤
│ • Stripe    │ │ • Yamato B2   │ │ • Next Engine  │ │ • freee       │ │ • LINE Login │
│ • GMO-PG    │ │ • Sagawa e飛伝│ │ • Cross Mall   │ │ • MoneyFwd    │ │ • Google GA4 │
│ • AmazonPay │ │ • Yu-Pack     │ │ • Amazon SP    │ │ • Smaregi     │ │ • Rakuten RMS│
│ • SB Payment│ │               │ │ • Rakuten RMS  │ │ • SAP B1      │ │ • OpenAI API │
└─────────────┘ └───────────────┘ └────────────────┘ └───────────────┘ └──────────────┘
```

---

## 1. 💳 Payment APIs (ငွေပေးချေမှု စနစ်များ)

- **အဓိက Providers**: Stripe, GMO Payment Gateway (GMO-PG), SB Payment Service, Amazon Pay.
- **ချိတ်ဆက်ပုံ ပုံစံ**:
  - **Tokenization / Hosted Fields**: Customer ၏ Card အချက်အလက်သည် EC-CUBE ဆာဗာပေါ်သို့ လုံးဝ မရောက်ဘဲ Payment Gateway ၏ JavaScript SDK ထံ တိုက်ရိုက်ရောက်ရှိကာ One-time Payment Token ကိုသာ ပြန်လည် ထုတ်ပေးသည်။
  - **Server-to-Server Capture**: ရရှိလာသော Token ကို EC-CUBE Controller မှ Payment API Endpoint သို့ လှမ်းပို့ကာ ငွေဖြတ်တောက်စေခြင်း (Capture/Authorize)။

---

## 2. 🚚 Shipping APIs (ချောပို့နှင့် ခြေရာခံစနစ်များ)

- **အဓိက Providers**: Yamato B2 Cloud (ヤマト運輸), Sagawa e-Hiden (佐川急便 e飛伝III), Japan Post (日本郵便 ゆうパック).
- **ချိတ်ဆက်ပုံ**:
  - **အော်ဒါ ပေးပို့ခြင်း**: အော်ဒါအသစ်များကို API ဖြင့် ပေးပို့ပြီး လိပ်စာကတ်ပြား (送り状 / Waybill) ထုတ်ယူနိုင်ရန် အချက်အလက် တင်ပို့ခြင်း။
  - **Tracking Number ပြန်လည်ရယူခြင်း**: ချောပို့တိုက်မှ ထုတ်ပေးသော ချောထုပ်ခြေရာခံ အမှတ် (送り状番号 / Inquire Number) ကို API မှတစ်ဆင့် EC-CUBE ထဲသို့ ပြန်လည်သွင်းယူပြီး Shipping Status ပြောင်းလဲခြင်း။

---

## 3. 📦 Inventory APIs & Multi-Channel Sync (စတော့နှင့် ဂိုဒေါင် စနစ်များ)

- **အဓိက Providers**: Next Engine (ネクストエンジン), Cross Mall (クロスモール), Logiless.
- **အရေးပါပုံ**: EC-CUBE အပြင် Amazon နှင့် Rakuten စတိုးများပါ တစ်ပြိုင်နက် ဖွင့်ထားသော လုပ်ငန်းများတွင် စတော့ကို ဗဟိုမှ ထိန်းချုပ်ပေးသောစနစ် ဖြစ်သည်။
- **ချိတ်ဆက်ပုံ**:
  - EC-CUBE တွင် ပစ္စည်း ၁ ခု ရောင်းထွက်သွားပါက Next Engine API သို့ Stock Update ချက်ချင်း လှမ်းပို့သည်။
  - Next Engine က အခြား Amazon/Rakuten ဆိုင်များရှိ စတော့အရေအတွက်ကို လိုက်လံ လျှော့ချပေးသည်။

---

## 4. 📊 Accounting & ERP (စာရင်းကိုင်နှင့် စီးပွားရေး စီမံခန့်ခွဲမှု)

- **အဓိက Providers**: freee (フリー 会計), Money Forward クラウド (マネーフォワード), Smaregi (スマレジ POS), SAP Business One.
- **ချိတ်ဆက်ပုံ**:
  - အော်ဒါတွင် ငွေပေးချေမှု အောင်မြင်သွားပါက (`ORDER_PRE_END` / 入金済み):
  - freee API သို့ 自動仕訳 (Automatic Journal Entry) အဖြစ် ရောင်းရငွေ (Sales Revenue)၊ သုံးစွဲခွန် (Consumption Tax 10% / 8%) နှင့် ပို့ဆောင်ခ အခွန်များကို ခွဲခြားကာ စာရင်းသွင်းပေးခြင်း။

---

## 5. 💬 Social & Marketing APIs (LINE & Google)

### LINE Platform (LINE Login & Messaging API):
- **LINE Login**: ဂျပန်နိုင်ငံတွင် လူသုံးအများဆုံး Chat App ဖြစ်ပြီး ဖောက်သည်များ Password မှတ်စရာမလိုဘဲ ၁ ချက်နှိပ်ရုံဖြင့် အကောင့်ဖွင့်/ဝင်ရောက်နိုင်ခြင်း။
- **LINE Messaging API (Push Message)**: အော်ဒါတင်ပြီးချိန်တွင် Email သာမက Customer ၏ LINE Chat သို့ အော်ဒါအတည်ပြုစာနှင့် ပို့ဆောင်ရေး Tracking Link ကို အလိုအလျောက် ပေးပို့ပေးခြင်း (Open Rate မြင့်မားသည်)။

### Google Integrations:
- **Google Merchant Center API**: EC-CUBE ရှိ ပစ္စည်း Catalog များကို Google Shopping တွင် အလိုအလျောက် ပေါ်စေရန် Product Feed တင်ပေးခြင်း။
- **GA4 Measurement Protocol**: ဆာဗာနောက်ကွယ်မှ တိုက်ရိုက် Google Analytics 4 သို့ ဝယ်ယူမှု ဒေတာ (Purchase Event) များကို လှမ်းပို့ခြင်း (AdBlocker များ ခံထားရသော်လည်း တိကျစွာ မှတ်တမ်းတင်နိုင်သည်)။

---

## 6. 🛒 Marketplaces (Amazon SP-API & Rakuten RMS)

- **Amazon SP-API (Selling Partner API)**: Amazon ပေါ်ရှိ အော်ဒါများ၊ စတော့များနှင့် ပစ္စည်း Catalog များကို EC-CUBE နှင့် နှစ်ဖက်ချိတ်ဆက်ခြင်း။
- **Rakuten RMS API (楽天市場 店舗管理システム)**: Rakuten စတိုး၏ Order API, Item API, Inventory API များကို EC-CUBE နှင့် ချိတ်ဆက်ကာ အော်ဒါများကို တစ်စုတစ်စည်းတည်း စီမံခန့်ခွဲခြင်း။

---

## 7. 🤖 AI API (OpenAI / Claude API)

- **ခေတ်သစ် အသုံးပြုမှု**: EC-CUBE Admin တွင် ပစ္စည်းအသစ် တင်ရာတွင် ပစ္စည်းအမည် ရိုက်ထည့်လိုက်ရုံဖြင့်:
  - OpenAI GPT-4o API ကို လှမ်းခေါ်ပြီး SEO-friendly ဖြစ်သော ဖော်ပြချက် (Product Description)၊ အဓိက ကုန်ပစ္စည်းအချက်အလက် (Bullet points) နှင့် Search Keywords များကို အလိုအလျောက် ရေးသားခိုင်းစေခြင်း။

---

## 🪝 Webhook Architecture (နှစ်ဖက် အလိုအလျောက် တုန့်ပြန်ခြင်း)

Webhook ဆိုသည်မှာ ပုံမှန် API ကဲ့သို့ မိမိဘက်မှ အချိန်တိုင်း လှမ်းမေးနေစရာ (Polling) မလိုဘဲ၊ ပြင်ပစနစ်တွင် အဖြစ်အပျက် (Event) တစ်ခုခု ဖြစ်ပွားတိုင်း ပြင်ပဆာဗာက EC-CUBE ဆီသို့ HTTP POST ဖြင့် တိုက်ရိုက် လှမ်းအကြောင်းကြားပေးသော စနစ်ဖြစ်သည်။

### Polling vs Webhook:
```
[Polling (အရင်းအမြစ် ဖြုန်းတီးသည်)]:
EC-CUBE -> "ငွေဝင်ပြီလား?" -> Stripe API -> "မဝင်သေးဘူး"
EC-CUBE -> "ငွေဝင်ပြီလား?" -> Stripe API -> "မဝင်သေးဘူး"
EC-CUBE -> "ငွေဝင်ပြီလား?" -> Stripe API -> "အခု ဝင်သွားပြီ!"

[Webhook (အလွန် လျင်မြန်ပြီး အကျိုးရှိသည်)]:
Stripe (Event: charge.succeeded) ──────> HTTP POST ──────> EC-CUBE (/webhook/stripe)
```

### Webhook လက်ခံရာတွင် မဖြစ်မနေ လိုက်နာရမည့် အချက် ၃ ချက်:

1. **HMAC Signature Verification (လက်မှတ်စစ်ဆေးခြင်း)**:
   - Request သည် Stripe သို့မဟုတ် LINE အစစ်အမှန်ဆီမှ လာခြင်းဖြစ်ကြောင်း လျှို့ဝှက် Secret ဖြင့် စစ်ဆေးရမည် (Hacker များ အတုအယောင် ပို့ခြင်းမှ ကာကွယ်ရန်)။
2. **Idempotency Check (ထပ်တူကျမှု စစ်ဆေးခြင်း)**:
   - ပြင်ပစနစ်များသည် Network Error ဖြစ်ပါက Webhook ကို ၂ ကြိမ် ၃ ကြိမ် ထပ်ပို့တတ်သည်။ တူညီသော Event ID တစ်ခုတည်းကို နှစ်ခါထပ်မံ မလုပ်ဆောင်မိစေရန် (ဥပမာ ပွိုင့် ၂ ခါ မပေးမိစေရန်) စစ်ဆေးရမည်။
3. **Fast 200 Response (ချက်ချင်း တုန့်ပြန်ခြင်း)**:
   - Webhook Controller သည် အချိန်အကြာကြီး မတွက်ချက်ဘဲ `200 OK` ကို ၂ စက္ကန့်အတွင်း အရင် ပြန်ပေးရမည် (မဟုတ်ပါက ပြင်ပဆာဗာက Fail ဖြစ်သည်ဟုယူဆပြီး ခဏခဏ ပြန်ပို့နေလိမ့်မည်)။ အချိန်ယူရသော အလုပ်များကို Background Queue/Messenger ဖြင့် ခွဲထုတ်လုပ်ရမည်။
