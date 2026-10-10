---
title: "05. Large Csv And Admin Performance"
description: "အော်ဒါအရေအတွက် သို့မဟုတ် ကုန်ပစ္စည်းအရေအတွက် သိန်းနှင့်ချီရှိသော စတိုးကြီးများတွင် CSV ဒေါင်းလုဒ်ဆွဲချိန်တွင် Memory Limit (メモリ枯渇 500 Error) တက်ခြင်းနှင့် Admin"
---

## 05. Large CSV & Admin Performance (大容量CSVと管理画面の高速化)

အော်ဒါအရေအတွက် သို့မဟုတ် ကုန်ပစ္စည်းအရေအတွက် သိန်းနှင့်ချီရှိသော စတိုးကြီးများတွင် CSV ဒေါင်းလုဒ်ဆွဲချိန်တွင် **Memory Limit (メモリ枯渇 500 Error)** တက်ခြင်းနှင့် Admin စီမံခန့်ခွဲမှု မျက်နှာပြင်များ လေးလံမှု ဖြေရှင်းနည်း ဖြစ်ပါသည်။

---

## 💥 Memory Limit Exhaustion ပြဿနာ အဘယ်ကြောင့် ဖြစ်ရသနည်း?

PHP တွင် ပုံမှန်အားဖြင့် Memory Limit ကို `128M` သို့မဟုတ် `256M` သတ်မှတ်ထားလေ့ရှိသည်။

Doctrine ORM ဖြင့် ဒေတာဆွဲယူရာတွင် Doctrine ၏ **UnitOfWork / Identity Map** သည် ဆွဲယူလိုက်သော Entity Object တိုင်းကို RAM ပေါ်တွင် ဆက်လက် မှတ်သားထားပါသည်။
- အော်ဒါ အခု ၁၀၀ ဆွဲပါက ပြဿနာမရှိသော်လည်း၊
- အော်ဒါ အခု ၅၀,၀၀၀ သို့မဟုတ် ၁၀၀,၀၀၀ ကို `$query->getResult()` ဖြင့် တပြိုင်နက် ဆွဲတင်လိုက်ပါက Memory ပမာဏ 1GB ကျော်အထိ တက်သွားပြီး အောက်ပါ Fatal Error တက်ကာ ဆိုက်ပျက်ကျသွားပါသည်:

```
Fatal error: Allowed memory size of 268435456 bytes exhausted (tried to allocate 20480 bytes)
```

---

## ⚖️ Large CSV Export: Before & After နှိုင်းယှဉ်ချက်

```
┌────────────────────────────────────────────────────────────────────────┐
│ ❌ BEFORE (getResult() ဖြင့် အားလုံး ဆွဲတင်ခြင်း):                       │
│ • ၁၀,၀၀၀ Records ကျော်ပါက Fatal Error (Memory Exhausted) တက်သည်         │
│ • Memory Usage: 300MB+ (ဆာဗာ ပျက်ကျ)                                  │
│ • Execution Time: အချိန်အကြာကြီး စောင့်ရပြီးမှ Crash ဖြစ်သည်               │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ ✅ AFTER (StreamedResponse + toIterable() + entityManager->clear()):   │
│ • အော်ဒါ ၁,၀၀၀,၀၀၀ (၁ သန်း) ရှိသော်လည်း မည်သည့်အခါမျှ Error မတက်ပါ      │
│ • Memory Usage: 15MB တွင်သာ အမြဲ ငြိမ်နေသည် (Flat Memory Footprint)    │
│ • Execution Time: ဒေါင်းလုဒ်သည် ချက်ချင်း စတင်ဆင်းလာသည် (Streaming)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Large CSV Stream Processing ကုဒ် (Production-Ready)

Doctrine ၏ `toIterable()` နှင့် `StreamedResponse` ကို ပေါင်းစပ်၍ ဒေတာများကို Memory ထဲ မသိမ်းဘဲ Output Stream သို့ တန်းထုတ်ပေးပုံ:

```php
namespace Customize\Controller\Admin;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Repository\OrderRepository;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class OptimizedCsvExportController
{
    private OrderRepository $orderRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(OrderRepository $orderRepository, EntityManagerInterface $entityManager)
    {
        $this->orderRepository = $orderRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/%eccube_admin_route%/order/export_optimized", name="admin_order_export_optimized")
     * @IsGranted("ROLE_ADMIN")
     */
    public function export(): StreamedResponse
    {
        $response = new StreamedResponse();
        $response->setCallback(function () {
            // Memory ထဲ မစုဆောင်းဘဲ Output သို့ တိုက်ရိုက် ရေးသားမည့် Stream ဖွင့်ခြင်း
            $handle = fopen('php://output', 'w');

            // Excel တွင် ဂျပန်စာ မပျက်စေရန် Shift-JIS / UTF-8 BOM ထည့်သွင်းခြင်း
            fputs($handle, "\xEF\xBB\xBF");

            // CSV Header တန်း ထည့်သွင်းခြင်း
            fputcsv($handle, ['注文番号', '注文日時', '顧客名', '合計金額', '対応状況']);

            // ၁။ အော်ဒါ QueryBuilder ကို တည်ဆောက်ခြင်း
            $qb = $this->orderRepository->createQueryBuilder('o')
                ->orderBy('o.id', 'DESC');

            $query = $qb->getQuery();

            // ၂။ getResult() အစား toIterable() ကို အသုံးပြု၍ Cursor ပုံစံ ဆွဲယူခြင်း
            $iterableResult = $query->toIterable();
            $batchSize = 500;
            $i = 0;

            foreach ($iterableResult as $order) {
                fputcsv($handle, [
                    $order->getOrderNo(),
                    $order->getOrderDate()->format('Y-m-d H:i:s'),
                    $order->getName01() . ' ' . $order->getName02(),
                    $order->getPaymentTotal(),
                    $order->getOrderStatus()->getName(),
                ]);

                $i++;
                // ၃။ အရေးကြီးဆုံး အချက်: Record ၅၀၀ တိုင်းတွင် Doctrine Memory ကို ရှင်းထုတ်ခြင်း
                if ($i % $batchSize === 0) {
                    $this->entityManager->clear(); // Identity Map မှ Entity များကို စွန့်ပစ်ပြီး RAM နေရာလွတ်ပြန်ဖန်တီးခြင်း
                }
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="orders_' . date('YmdHis') . '.csv"');

        return $response;
    }
}
```

---

## 🖥️ Admin စီမံခန့်ခွဲမှု မျက်နှာပြင်များ အမြန်နှုန်း မြှင့်တင်ခြင်း

Admin 受注マスター (Order Master) သို့မဟုတ် 商品マスター (Product Master) တွင် ဒေတာများပြားလာချိန်တွင် လေးလံနေပါက အောက်ပါအချက် ၃ ချက်ကို ပြင်ဆင်ရပါသည်:

### ၁။ မလိုလားအပ်သော `COUNT(*)` Subqueries များကို ဖယ်ရှားခြင်း
Default Paginator သည် စုစုပေါင်း အရေအတွက်ကို တွက်ချက်ရန် အချိန်များစွာ ယူနေတတ်သည်။
```php
// Query ၏ Output Walker ကို ပိတ်ပြီး အမြန်နှုန်း ၂ ဆ တင်ခြင်း
$query->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, false);
```

### ၂။ အခြေအနေ (Status) Dropdown ရေတွက်မှုကို Cache သိမ်းဆည်းခြင်း
Admin Header တွင် ပေါ်နေသော `新規受付 (12件)`, `入金済み (45件)` စသည့် Badge အရေအတွက်များကို စာမျက်နှာတိုင်းတွင် `SELECT COUNT(*)` မလုပ်စေဘဲ Redis တွင် ၅ မိနစ် Cache ထားရှိပေးခြင်း။

### ၃။ Search Filter တွင် Composite Index ထည့်သွင်းခြင်း
Admin မှ အသုံးအများဆုံးဖြစ်သော "Status + Date Range" ရှာဖွေမှုအတွက် `(order_status_id, order_date)` index ကို သေချာစွာ တပ်ဆင်ထားခြင်း။
