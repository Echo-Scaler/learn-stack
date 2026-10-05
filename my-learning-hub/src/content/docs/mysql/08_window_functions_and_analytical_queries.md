---
title: "08. Window Functions"
description: "1. [Window Functions ဆိုတာဘာလဲ? (GROUP BY နှင့် အဓိက ကွာခြားချက်)](#၁-window-functions-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၈) - Window Functions နှင့် ခေတ်သစ် Data Analytics (MySQL 8.0)
### (Lesson 8: Modern Window Functions, OVER Clause, Ranking & Running Totals)

---

## 📌 မာတိကာ (Contents)
1. [Window Functions ဆိုတာဘာလဲ? (`GROUP BY` နှင့် အဓိက ကွာခြားချက်)](#၁-window-functions-ဆိုတာဘာလဲ)
2. [The `OVER()` Clause ၏ အစိတ်အပိုင်းများ (`PARTITION BY` & `ORDER BY`)](#၂-the-over-clause-၏-အစိတ်အပိုင်းများ)
3. [Ranking Functions ၃ မျိုး နှိုင်းယှဉ်ချက် (`ROW_NUMBER`, `RANK`, `DENSE_RANK`)](#၃-ranking-functions-၃-မျိုး)
4. [Value Functions (`LAG` နှင့် `LEAD` ဖြင့် လအလိုက် အရောင်းနှိုင်းယှဉ်ခြင်း)](#၄-value-functions-lag-နှင့်-lead)
5. [လက်တွေ့ Production Analytics: Category တစ်ခုချင်းစီ၏ Top 3 ဈေးအကြီးဆုံး ပစ္စည်းများ ရှာဖွေခြင်း](#၅-လက်တွေ့-top-3-ရှာဖွေခြင်း)
6. [Cumulative Running Total (အရောင်း စုစုပေါင်း တစ်ရက်ချင်း ပေါင်းတက်သွားပုံ)](#၆-cumulative-running-total)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Window Functions ဆိုတာဘာလဲ?

`GROUP BY` သည် Row များစွာကို စုစည်းပြီး အတန်းတစ်ခုတည်း (Single Row) အဖြစ် ကျုံ့ချပစ်သည်။

**Window Functions** သည် မူလ Row များကို တစ်ကြောင်းမျှ မကျုံ့ဘဲ (တစ်ကြောင်းချင်းစီ မပျောက်ပျက်စေဘဲ) ဘေးနားရှိ ကော်လံအသစ်တွင် အုပ်စုလိုက် တွက်ချက်မှု (ဥပမာ- အဆင့် Ranking၊ ပြေးနေသော စုစုပေါင်းငွေ) များကို ဘေးတွင် တွဲလျက် ပြသပေးနိုင်သည့် ခေတ်သစ် အစွမ်းထက် SQL စနစ် ဖြစ်ပါသည်။

```
[ GROUP BY ]                         [ WINDOW FUNCTION (OVER) ]
Category | AvgPrice                   Product   | Category | Price | Cat_Avg_Price
---------+---------                   ----------+----------+-------+--------------
1        | $1500                      MacBook   | 1        | 2000  | $1500
2        | $950                       Dell XPS  | 1        | 1000  | $1500
(မူလ Product တွေ ပျောက်သွားသည်)          iPhone    | 2        | 1000  | $950
                                      Samsung   | 2        | 900   | $950
                                      (မူလ Product တစ်ခုချင်းစီ အပြည့်အစုံ ကျန်နေသည်!)
```

---

## ၂။ The `OVER()` Clause ၏ အစိတ်အပိုင်းများ

Window Function အားလုံးသည် `OVER ()` ဖြင့် စတင်ပါသည်:
* **`PARTITION BY <column>`**: ဒေတာများကို သီးခြား အကန့်ငယ်လေးများ (Windows) အဖြစ် ခွဲခြမ်းလိုက်ခြင်း (`GROUP BY` သဘောတရား)။
* **`ORDER BY <column>`**: ထို အကန့်ငယ်လေး အတွင်း၌ အဆင့်စဉ်လိုက် စီစဉ်ခြင်း။

---

## ၃။ Ranking Functions ၃ မျိုး

တူညီသော ဈေးနှုန်း ရှိသည့်အခါ အဆင့် သတ်မှတ်ပုံ မတူညီပါ:

| Ranking Function | ဥပမာ ရလဒ် (ဈေးနှုန်း တူနေပါက) | အလုပ်လုပ်ပုံ |
| :--- | :--- | :--- |
| **`ROW_NUMBER()`** | `1, 2, 3, 4` | တူညီစေကာမူ သီးသန့် အစဉ်လိုက် နံပါတ် အမြဲ ပေးသည် |
| **`RANK()`** | `1, 2, 2, 4` | တူညီပါက အဆင့်တူ ပေးပြီး နောက်နံပါတ်ကို ခုန်ကျော်သွားသည် |
| **`DENSE_RANK()`** | `1, 2, 2, 3` | တူညီပါက အဆင့်တူ ပေးပြီး နောက်နံပါတ်ကို မကျော်ဘဲ ကပ်လိုက်သည် |

```sql
SELECT 
    title, 
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num,
    RANK() OVER (ORDER BY price DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rnk
FROM products;
```

---

## ၄။ Value Functions (`LAG` နှင့် `LEAD`)

* **`LAG(column, offset)`**: ယခင် အတန်း (Previous Row) ရှိ တန်ဖိုးကို လှမ်းယူခြင်း။
* **`LEAD(column, offset)`**: နောက် အတန်း (Next Row) ရှိ တန်ဖိုးကို လှမ်းယူခြင်း။

### လက်တွေ့သုံး: ယခင်လထက် ရောင်းအား တက်/ကျ နှိုင်းယှဉ်ခြင်း:
```sql
SELECT 
    order_month,
    monthly_sales,
    LAG(monthly_sales, 1) OVER (ORDER BY order_month) AS previous_month_sales,
    (monthly_sales - LAG(monthly_sales, 1) OVER (ORDER BY order_month)) AS sales_growth
FROM monthly_revenue;
```

---

## ၅။ လက်တွေ့: Category အလိုက် Top 3 ပစ္စည်းများ ရှာဖွေခြင်း

အင်တာဗျူးများနှင့် စာရင်းဇယားတွင် အမေးအများဆုံး မေးခွန်းဖြစ်သည်:

```sql
WITH RankedProducts AS (
    SELECT 
        category_id,
        title,
        price,
        DENSE_RANK() OVER (
            PARTITION BY category_id 
            ORDER BY price DESC
        ) AS rank_in_category
    FROM products
)
SELECT category_id, title, price, rank_in_category
FROM RankedProducts
WHERE rank_in_category <= 3;
```

---

## ၆။ Cumulative Running Total (ပြေးနေသော စုစုပေါင်းငွေ)

ရက်စွဲအလိုက် အရောင်းငွေများ တဖြည်းဖြည်း ပေါင်းတက်သွားပုံကို တွက်ချက်ခြင်း:

```sql
SELECT 
    order_date,
    total_amount,
    SUM(total_amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM orders
WHERE status = 'paid';
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လိုအပ်ချက် | အသုံးပြုရမည့် Function |
| :--- | :--- |
| **စာမျက်နှာ Pagination အတွက် အမှတ်စဉ်တပ်ရန်** | `ROW_NUMBER() OVER (...)` |
| **ထိပ်တန်း Top N Per Group ရွေးထုတ်ရန်** | `DENSE_RANK() OVER (PARTITION BY ...)` + CTE |
| **ယမန်နေ့ သို့မဟုတ် ယခင်လ ဒေတာနှင့် နှိုင်းယှဉ်ရန်** | `LAG(col, 1) OVER (...)` |
| **ဘဏ်စာရင်း ရှင်းတမ်း (Running Balance)** | `SUM(amount) OVER (ORDER BY date)` |

နောက်သင်ခန်းစာ [09_views_and_generated_columns.md](/mysql/09_views_and_generated_columns/) တွင် Complex Query များကို အလွယ်တကူ သိမ်းဆည်းနိုင်သော Database Views များနှင့် Auto-computed Generated Columns များအကြောင်းကို လေ့လာပါမည်။
