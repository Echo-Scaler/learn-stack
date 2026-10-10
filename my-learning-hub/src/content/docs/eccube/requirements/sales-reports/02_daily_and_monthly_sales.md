---
title: "02. Daily And Monthly Sales"
description: "> Client Requirements:"
---

## 02 - Daily, Monthly Sales & Order Statistics (နေ့စဉ်/လစဉ် အရောင်းစာရင်းနှင့် စာရင်းအင်းများ)

> **Client Requirements**:
> 1. **Daily sales (နေ့စဉ် ရောင်းအား စာရင်းဇယား)**: ရွေးချယ်ထားသော လတစ်လအတွင်း ရက်စွဲအလိုက် (၁ ရက်နေ့မှ ၃၁ ရက်နေ့အထိ) အော်ဒါအရေအတွက်၊ ပစ္စည်းစုစုပေါင်းရောင်းရငွေ၊ ပို့ဆောင်ခနှင့် ပျမ်းမျှတစ်ကြိမ်ဝယ်ယူငွေ (客単価) များကို ဇယားနှင့် မျဉ်းကွေးဂရပ် (Line Chart) ဖြင့် ကြည့်ရှုနိုင်ရမည်။
> 2. **Monthly sales (လစဉ် ရောင်းအား စာရင်းဇယား)**: တစ်နှစ်တာအတွင်း တစ်လချင်းစီ၏ ရောင်းအား တိုးတက်မှုကို ယခင်နှစ် အလားတူကာလ (前年同月比 YoY) နှင့် နှိုင်းယှဉ် ကြည့်ရှုနိုင်ရမည်။
> 3. **Sales CSV Export (အရောင်း CSV ဒေတာ ထုတ်ယူခြင်း)**: စာရင်းစစ်နှင့် စာရင်းကိုင်ဌာနသို့ တင်ပြရန် နေ့စဉ် သို့မဟုတ် လစဉ် ရောင်းအား စာရင်းဇယားများကို CSV ဖိုင်ဖြင့် Download ရယူနိုင်ရမည်။

---

## 📅 1. Daily Sales Architecture (日別売上集計)

Admin သည် **売上集計 ➔ 日別集計** တွင် နှစ်နှင့် လကို ရွေးချယ်ပြီး နေ့စဉ် ရောင်းအားကို စစ်ဆေးပါသည်:

```
[Admin selects Year: 2026, Month: 09]
                    │
                    ▼ (HTTP GET /%eccube_admin_route%/order/sales/daily)
      [SalesController::daily()]
                    │
                    ▼
[OrderRepository::getDailySalesReport($year, $month)]
                    │
                    ├── WHERE order_date LIKE '2026-09-%'
                    ├── Exclude Cancelled (3) & Returned (9)
                    └── GROUP BY SUBSTRING(order_date, 1, 10)
                    │
                    ▼
[Admin Twig: Chart.js Line Graph + Sales Summary Table]
```

### ဇယား ပြသပုံ နမူနာ (Daily Sales Table):
| ရက်စွဲ | အော်ဒါအရေအတွက် | ပစ္စည်းတန်ဖိုး စုစုပေါင်း | ပို့ခ စုစုပေါင်း | စုစုပေါင်း ရောင်းရငွေ (Net Sales) | ပျမ်းမျှ ဝယ်ယူငွေ (客単価) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 2026/09/01 | 15 件 | ¥75,000 | ¥9,000 | **¥84,000** | ¥5,600 |
| 2026/09/02 | 22 件 | ¥110,000 | ¥13,200 | **¥123,200** | ¥5,600 |
| 2026/09/03 | 18 件 | ¥90,000 | ¥10,800 | **¥100,800** | ¥5,600 |

---

## 📈 2. Monthly Sales & YoY Comparison (လစဉ် ရောင်းအားနှင့် ယခင်နှစ် နှိုင်းယှဉ်ချက်)

လစဉ် ရောင်းအားကို ဆွဲထုတ်ရာတွင် ယခုနှစ် လစဉ် ရောင်းရငွေနှင့် လွန်ခဲ့သောနှစ် ရောင်းရငွေကို နှိုင်းယှဉ်၍ ရာခိုင်နှုန်း တိုးတက်မှု (Growth Rate) တွက်ချက်ပါသည်:

```php
// SalesController.php
public function getMonthlyComparison(int $year): array
{
    $currentYearSales = $this->getMonthlySalesByYear($year);
    $previousYearSales = $this->getMonthlySalesByYear($year - 1);

    $comparison = [];
    for ($month = 1; $month <= 12; $month++) {
        $current = $currentYearSales[$month] ?? 0;
        $prev = $previousYearSales[$month] ?? 0;
        $growth = $prev > 0 ? round((($current - $prev) / $prev) * 100, 1) : 0;

        $comparison[$month] = [
            'month' => $month . '月',
            'current_year' => $current,
            'prev_year' => $prev,
            'growth_rate' => $growth . '%', // e.g. +15.4%
        ];
    }

    return $comparison;
}
```

---

## 📊 3. Order Statistics & Metrics (အဓိက စာရင်းအင်းများ)

E-Commerce မန်နေဂျာများ နေ့စဉ် စောင့်ကြည့်လေ့ရှိသော အဓိက KPIs ၃ ခု:
1. **受注件数 (Total Orders)**: စုစုပေါင်း အော်ဒါအရေအတွက်။
2. **客単価 (Average Order Value - AOV)**: ပျမ်းမျှ တစ်ကြိမ်မှာယူငွေ = `Total Revenue / Total Orders`။
3. **1注文あたり購入点数 (Average Basket Size)**: အော်ဒါ ၁ ခုတွင် ပျမ်းမျှ ပစ္စည်း မည်မျှ ပါဝင်သနည်း = `Total Items Sold / Total Orders`။

---

## 📥 4. Sales CSV Export (အရောင်း ဒေတာ CSV ထုတ်ယူနည်း)

စာရင်းကိုင်စနစ် (Accounting/Tax) သို့ တင်သွင်းရန် CSV ထုတ်ယူပုံ Controller:

```php
#[Route('/%eccube_admin_route%/order/sales/daily/export', name: 'admin_sales_daily_export')]
public function exportDailySalesCsv(Request $request): StreamedResponse
{
    $year = $request->query->getInt('year', date('Y'));
    $month = $request->query->getInt('month', date('m'));
    $salesData = $this->orderRepository->getDailySalesReport($year, $month);

    $response = new StreamedResponse(function () use ($salesData) {
        $handle = fopen('php://output', 'w');
        fwrite($handle, "\xEF\xBB\xBF"); // UTF-8 BOM

        // Header
        fputcsv($handle, ['日付', '注文数', '商品小計', '送料合計', '総売上金額', '平均客単価']);

        foreach ($salesData as $row) {
            fputcsv($handle, [
                $row['sales_date'],
                $row['order_count'],
                $row['subtotal_sales'],
                $row['total_shipping'],
                $row['net_sales'],
                $row['avg_order_value'],
            ]);
        }
        fclose($handle);
    });

    $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
    $response->headers->set('Content-Disposition', 'attachment; filename="daily_sales_'.$year.$month.'.csv"');

    return $response;
}
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **日別集計 (Hibetsu Shuukei)**: Daily Sales Aggregation
- **月別集計 (Tsukibetsu Shuukei)**: Monthly Sales Aggregation
- **前年同月比 (Zennen Dougetsu-hi)**: Year-over-Year (YoY) Comparison
- **受注件数 (Juchuu Kensuu)**: Number of Orders
- **平均購入点数 (Heikin Kounyuu Tensuu)**: Average Basket Size (Items per order)
- **客単価 (Kyakutanka)**: Average Order Value (AOV)
