---
title: "Overview"
description: "EC-CUBE (Version 4.x / 4.2+) တွင် ဂျပန်နိုင်ငံ၏ အဓိက ဆက်သွယ်ရေးနှင့် ဈေးကွက်ရှာဖွေရေး စနစ်ဖြစ်သော LINE Platform နှင့် Marketing Automation (LINE連携・マーケティング自動化) က"
---

## EC-CUBE Client Requirements: LINE / Marketing (မြန်မာဘာသာ)

EC-CUBE (Version 4.x / 4.2+) တွင် ဂျပန်နိုင်ငံ၏ အဓိက ဆက်သွယ်ရေးနှင့် ဈေးကွက်ရှာဖွေရေး စနစ်ဖြစ်သော **LINE Platform နှင့် Marketing Automation (LINE連携・マーケティング自動化)** ကို အခြေခံမှစ၍ အသေးစိတ် ရှင်းလင်းထားသော လေ့လာမှု လမ်းညွှန်ဖြစ်ပါသည်။

---

## 📱 အဘယ်ကြောင့် ဂျပန်တွင် LINE Marketing သည် အရေးပါသနည်း?

ဂျပန်နိုင်ငံတွင် လူဦးရေ သန်း ၉၀ ကျော်သည် နေ့စဉ် LINE ကို အသုံးပြုလျက်ရှိသည်။ သမားရိုးကျ Email Newsletter (メルマガ) နှင့် နှိုင်းယှဉ်ပါက LINE သည် အဆပေါင်းများစွာ သာလွန်သော ရလဒ်များကို ရရှိစေပါသည်:

| အချက်အလက် | Email (メルマガ) | LINE Official Account (LINE公式) |
|:---|:---:|:---:|
| **ဖွင့်ဖတ်နှုန်း (Open Rate)** | ၁၅% ~ ၂၀% | **၆၀% ~ ၈၀% (ချက်ချင်းနီးပါး ဖတ်ကြသည်)** |
| **လင့်ခ်နှိပ်နှုန်း (Click-Through Rate)** | ၁% ~ ၃% | **၁၀% ~ ၂၅%** |
| **Spam / Filter ခံရနိုင်ခြေ** | အလွန်မြင့်မားသည် (Junk folder ရောက်နိုင်) | **Zero (Chat ထဲသို့ တိုက်ရိုက်ရောက်ရှိသည်)** |
| **Login ဝင်ရောက်ရမှု** | Password မေ့လျော့နိုင်ခြေ မြင့်သည် | **၁ ချက်နှိပ်ရုံဖြင့် Login ဝင်နိုင်သည် (LINE Login)** |

---

## 🔄 EC-CUBE & LINE Marketing Architecture ပုံကြမ်း

```mermaid
graph TD
    subgraph "👤 အသုံးပြုသူ (Customer)"
        U[LINE အသုံးပြုသူ / စတိုးဖောက်သည်]
    end

    subgraph "🛍️ EC-CUBE Store (Symfony 4.4/5.4)"
        LL[LINE Login Service]
        CS[Customer Entity - line_user_id]
        MA[Marketing Automation Engine]
        SEG[Customer Segmentation Query]
        CRON[Console Command / Scheduled Cron]
    end

    subgraph "💬 LINE Platform APIs"
        L_OAUTH[LINE Login v2.1 OAuth 2.0]
        L_MSG[LINE Messaging API]
        L_HOOK[LINE Webhook Handler]
    end

    U -->|၁။ LINE Login နှိပ်ခြင်း| LL
    LL -->|OAuth 2.0 Auth Code| L_OAUTH
    L_OAUTH -->|Access Token & Profile| LL
    LL -->|line_user_id သိမ်းဆည်းခြင်း| CS

    U -->|၂။ ပစ္စည်း ဝယ်ယူခြင်း / ခြင်းတောင်းထဲ ထည့်ထားခြင်း| CS
    CRON -->|၃။ အချိန်မှန် စစ်ဆေးခြင်း| MA
    MA -->|၄။ Target အုပ်စု ရွေးထုတ်ခြင်း| SEG
    MA -->|၅။ Push Message / Flex Message ပို့ဆောင်ခြင်း| L_MSG
    L_MSG -->|၆။ ဖောက်သည်၏ LINE Chat ထဲသို့ ရောက်ရှိခြင်း| U

    U -->|၇။ 友だち追加 (Add Friend) ပြုလုပ်ခြင်း| L_HOOK
    L_HOOK -->|Webhook Event| EC-CUBE
```

---

## 📑 မာတိကာ (Table of Contents)

| No. | ခေါင်းစဉ် | ဖိုင်လမ်းကြောင်း | အဓိက အကြောင်းအရာများ |
|:---:|:---|:---|:---|
| 01 | **LINE Login & Account Linking** | [01_line_login_and_account_linking.md](/eccube/line-marketing/01_line_login_and_account_linking/) | LINE Login v2.1 OAuth 2.0 Flow, `dtb_customer` တွင် `line_user_id` ချိတ်ဆက်ခြင်း, ID連携 UI ခလုတ်များ |
| 02 | **LINE Messaging & Transactional Notifications** | [02_line_messaging_and_notifications.md](/eccube/line-marketing/02_line_messaging_and_notifications/) | LINE Messaging API, Push Message vs Multicast vs Broadcast, အော်ဒါအတည်ပြု通知, ပို့ဆောင်ရေး Tracking Flex Message ပုံစံ |
| 03 | **Coupons, Newsletters & Campaign Tracking** | [03_coupons_newsletters_and_tracking.md](/eccube/line-marketing/03_coupons_newsletters_and_tracking/) | LINE Coupon အလိုအလျောက် ပေးပို့ခြင်း, Segment Newsletter 配信, UTM Parameters, LINE Tag ဖြင့် Conversion တိုင်းတာခြင်း |
| 04 | **Customer Segmentation & Marketing Automation (MA)** | [04_customer_segmentation_and_marketing_automation.md](/eccube/line-marketing/04_customer_segmentation_and_marketing_automation/) | RFM ခွဲခြမ်းစိတ်ဖြာမှု, ကုန်ပစ္စည်းအုပ်စုအလိုက် Target ပို့ခြင်း, カゴ落ち (Cart Abandonment) သတိပေးချက်, မွေးနေ့ကူပွန် အလိုအလျောက် ပေးပို့ခြင်း |
| 05 | **Top Client Tasks & Troubleshooting** | [05_top_client_tasks_and_troubleshooting.md](/eccube/line-marketing/05_top_client_tasks_and_troubleshooting/) | **Client များ အများဆုံး တောင်းဆိုသော လုပ်ငန်းတာဝန် ၅ ခုနှင့် Fix များ** (Cart Abandonment Auto-Push, Add Friend Welcome Coupon, Post-purchase Step Message, Email Auto-merge) |

---

## 🇯🇵 အရေးကြီးသော ဂျပန် ဝေါဟာရများ (LINE & Marketing Terms)

| Japanese (漢字/カタカナ) | Romaji | အဓိပ္ပာယ် |
|:---|:---|:---|
| **ID連携** | Ai-Dii Renkei | Account Linking (EC အကောင့်နှင့် LINE အကောင့် ချိတ်ဆက်ခြင်း) |
| **プッシュ配信** | Pusshu Haishin | Push Message Notification (သီးသန့် လူတစ်ဦးထံသို့ ပေးပို့ခြင်း) |
| **一斉配信 (セグメント配信)** | Issei / Segumento Haishin | Broadcast / Segmented Message Delivery |
| **カゴ落ち (カート放棄)** | Kago-ochi / Kaato Houki | Cart Abandonment (ပစ္စည်းကို ခြင်းတောင်းထဲထည့်ပြီး မဝယ်ဘဲ ထွက်သွားခြင်း) |
| **ステップ配信** | Suteppu Haishin | Step Messaging (ဝယ်ယူပြီး ၁ ရက်၊ ၇ ရက် စသည်ဖြင့် အချိန်အလိုက် အလိုအလျောက် စာပို့ခြင်း) |
| **友だち追加** | Tomodachi Tsuika | Adding LINE Official Account as Friend |
| **リッチメッセージ** | Ricchi Messeji | Rich Message (ရုပ်ပုံကြီးများဖြင့် ဖန်တီးထားသော ဆွဲဆောင်မှုရှိသည့် စာတို) |
| **休眠顧客呼び戻し** | Kyuumin Kokyaku Yobimodoshi | Re-engaging Dormant/Inactive Customers |

အထက်ပါ မာတိကာဇယားမှ သက်ဆိုင်ရာ လေ့လာမှုဖိုင်များကို ဖွင့်ဖတ်၍ အသေးစိတ် စတင် လေ့လာနိုင်ပါသည်။
