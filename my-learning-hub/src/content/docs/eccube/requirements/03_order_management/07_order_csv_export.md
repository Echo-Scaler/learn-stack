---
title: "07. Order Csv Export"
description: "> Client Requirements:"
---

## 07 - Order CSV Export (အော်ဒါ ဒေတာနှင့် ပို့ဆောင်ရေး CSV ထုတ်ယူခြင်း)

> **Client Requirements**:
> 1. **Order CSV export (အော်ဒါ CSV ဒေတာ ထုတ်ယူခြင်း)**: နေ့စဉ် သို့မဟုတ် လစဉ် ရောင်းအား စာရင်းဇယားများ၊ စာရင်းကိုင်စနစ် (ERP/Accounting) သို့ ထည့်သွင်းရန် အော်ဒါဒေတာ အပြည့်အစုံကို CSV ဖိုင်အဖြစ် Download ရယူနိုင်ရမည်။
> 2. **Shipping Slips CSV Export (ချောပို့ကုမ္ပဏီသုံး CSV ထုတ်ယူခြင်း)**: အထူးသဖြင့် ဂျပန်နိုင်ငံ၏ ထိပ်တန်း ပို့ဆောင်ရေး ကုမ္ပဏီများဖြစ်သော **Yamato B2 Cloud (ヤマトB2)** သို့မဟုတ် **Sagawa e-Hiden (佐川e飛伝)** စနစ်များထဲသို့ တိုက်ရိုက် Upload တင်ပြီး လိပ်စာကတ်ပြား (送り状 / Shipping Labels) များ တစ်ပြိုင်နက် ရိုက်ထုတ်နိုင်သော သီးသန့် CSV Format ဖြင့် ထုတ်ယူနိုင်ရမည်။

---

## 🏛️ EC-CUBE Order CSV Implementation Architecture

EC-CUBE တွင် Order CSV ထုတ်ယူခြင်းကို **`dtb_csv`** ဇယားမှ Column သတ်မှတ်ချက်များနှင့် **`CsvExportService`** တို့ ပေါင်းစပ်၍ အောက်ပါအတိုင်း ဆောင်ရွက်ပါသည်:

```
[Admin selects Orders & Clicks "CSV Download"]
                       │
                       ▼ (HTTP POST /%eccube_admin_route%/order/export/order)
           [OrderController::exportOrder()]
                       │
                       ├─► [Query Orders with Search Criteria]
                       │
                       ├─► [Read Column Configuration from dtb_csv (csv_type = 1)]
                       │
                       ▼
           [StreamedResponse (Low Memory Usage)]
                       │
                       ├── Write UTF-8 BOM (\xEF\xBB\xBF) or Convert to CP932
                       ├── Loop Order Entities & OrderItems
                       └── Stream directly to php://output
                       │
                       ▼
         [Browser Downloads "order_20260921.csv"]
```

### သက်ဆိုင်ရာ အဓိက ဖိုင်များ:
- **Admin Controller**: `src/Eccube/Controller/Admin/Order/OrderController.php`
- **CSV Service**: `src/Eccube/Service/CsvExportService.php`
- **Database Configuration**: `dtb_csv` (Column Headers and Entity Field Mappings)

---

## 🗄️ Database Mapping: `dtb_csv` Table

Admin သည် **設定 ➔ 店舗設定 ➔ CSV項目設定** တွင် မည်သည့် Field များကို CSV ထဲတွင် ထုတ်ယူမည်ကို Drag & Drop ဖြင့် စိတ်ကြိုက် ချိန်ညှိနိုင်ပါသည်:

| `dtb_csv` Column | ရှင်းလင်းချက် | ဥပမာ တန်ဖိုး |
|:---|:---|:---|
| `csv_type_id` | CSV အမျိုးအစား (1: 受注CSV, 3: 配送CSV) | `1` |
| `entity_name` | မည်သည့် Entity မှ ဆွဲထုတ်မည်နည်း | `Eccube\Entity\Order` |
| `field_name` | Entity အတွင်းရှိ Property အမည် | `order_no`, `payment_total`, `create_date` |
| `disp_name` | CSV တွင် ပေါ်မည့် Header အမည် | "注文番号", "お支払い合計", "注文日時" |
| `sort_no` | CSV ထဲရှိ ကော်လံ အစီအစဉ် | `1, 2, 3, ...` |

---

## 🚚 Real-World Client Requirement: Yamato B2 Cloud CSV Format

ဂျပန် Client တိုင်းနီးပါး အမြဲတမ်း တောင်းဆိုလေ့ရှိသော Requirement မှာ **Yamato Transport (ヤマト運輸) ၏ B2 Cloud စနစ်သုံး CSV Format** ဖြစ်ပါသည်:

```php
// Yamato B2 Cloud CSV Format နမူနာ ထုတ်ယူပုံ Controller Method
public function exportYamatoB2Csv(Request $request): StreamedResponse
{
    $response = new StreamedResponse(function () {
        $handle = fopen('php://output', 'w');

        // Yamato B2 သည် Shift-JIS (CP932) ကို လက်ခံလေ့ရှိသည်
        // Header အတန်း
        $headers = [
            'お客様管理番号',     // Order No
            '送り状種類',         // Slip Type (0: ပုံမှန်, 2: အအေးခန်း Cool)
            'お届け先電話番号',   // Recipient Phone
            'お届け先郵便番号',   // Recipient Postal Code
            'お届け先住所',       // Recipient Address
            'お届け先名称',       // Recipient Name
            'ご依頼主名称',       // Sender / Shop Name
            '品名コード１',       // Product Code
            '品名１',             // Product Name
            'お届け予定日',       // Delivery Date
            '配達時間帯',         // Delivery Time Slot Code
        ];

        // Shift-JIS သို့ ပြောင်းလဲရေးသားခြင်း
        mb_convert_variables('SJIS-win', 'UTF-8', $headers);
        fputcsv($handle, $headers);

        $orders = $this->orderRepository->findBy(['OrderStatus' => OrderStatus::ORDER_IN_PROGRESS]);

        foreach ($orders as $Order) {
            foreach ($Order->getShippings() as $Shipping) {
                $row = [
                    $Order->getOrderNo(),
                    '0',
                    $Shipping->getPhoneNumber(),
                    $Shipping->getPostalCode(),
                    $Shipping->getPref()->getName().$Shipping->getAddr01().$Shipping->getAddr02(),
                    $Shipping->getName01().' '.$Shipping->getName02(),
                    'My Store Shop',
                    $Order->getOrderItems()[0]->getProductCode(),
                    $Order->getOrderItems()[0]->getProductName(),
                    $Shipping->getShippingDeliveryDate() ? $Shipping->getShippingDeliveryDate()->format('Y/m/d') : '',
                    $Shipping->getShippingDeliveryTime() ? $Shipping->getShippingDeliveryTime() : '',
                ];

                mb_convert_variables('SJIS-win', 'UTF-8', $row);
                fputcsv($handle, $row);
            }
        }
        fclose($handle);
    });

    $response->headers->set('Content-Type', 'text/csv; charset=Shift_JIS');
    $response->headers->set('Content-Disposition', 'attachment; filename="yamato_b2_'.date('YmdHis').'.csv"');

    return $response;
}
```

---

## ⚡ အရေးကြီးသော ဗဟုသုတ: Tracking Number ပြန်လည် Import သွင်းခြင်း (B2 CSV Import)

Yamato B2 စနစ်မှ Print ထုတ်ပြီးပါက B2 မှ Tracking Number (`送り状番号`) ပါဝင်သော CSV ဖိုင်တစ်ခု ပြန်လည် ထွက်ရှိလာပါသည်။
- Admin များသည် အဆိုပါ CSV ကို EC-CUBE သို့ ပြန်လည် **Import** သွင်းလိုက်သည်နှင့် သက်ဆိုင်ရာ Order များထဲသို့ Tracking Number များ အလိုအလျောက် ဖြည့်သွင်းသွားပြီး Status ကို **"発送済み (Shipped)"** သို့ တစ်ပြိုင်နက် ပြောင်းလဲပေးနိုင်သော Shipping Import Plugin များကို ကျယ်ကျယ်ပြန့်ပြန့် အသုံးပြုကြပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **受注CSV (Juchuu CSV)**: Order Data CSV
- **配送CSV / 出荷CSV (Haisou CSV / Shukka CSV)**: Shipping CSV
- **送り状発行 (Okurijou Hakkou)**: Shipping Label / Waybill Printing
- **ヤマトB2クラウド (Yamato B2 Kuraudo)**: Yamato Transport Cloud Shipping System
- **佐川e飛伝 (Sagawa e-Hiden)**: Sagawa Express Shipping System
- **ゆうパック (Yuu-pakku)**: Japan Post Parcel Service
- **CSV出力項目設定 (CSV Shutsuryoku Koumoku Settei)**: CSV Export Column Configuration
