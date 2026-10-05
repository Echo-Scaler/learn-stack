---
title: "17. Bulk Order Status Update"
description: "> 「毎朝の出荷業務で、数十件〜数百件の新規注文を1件ずつ開いてステータスを『発送済み』に変更するのは膨大な時間がかかります。受注一覧でチェックボックスを選択した複数の注文に対し、一括でステータス（対応中、発送済み、入金待ち等）を変更できるようにしてください。」"
---

## Task 17: 注文ステータスを一括変更できるようにしてください (Bulk Order Status Update)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「毎朝の出荷業務で、数十件〜数百件の新規注文を1件ずつ開いてステータスを『発送済み』に変更するのは膨大な時間がかかります。受注一覧でチェックボックスを選択した複数の注文に対し、一括でステータス（対応中、発送済み、入金待ち等）を変更できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Admin Order List တွင် အော်ဒါများကို Checkbox ဖြင့် အများအပြား ရွေးချယ်ပြီး ခလုတ်တစ်ချက် နှိပ်ရုံဖြင့် **Order Status များကို တစ်ပြိုင်နက် အစုလိုက် ပြောင်းလဲ (Bulk Status Update)** ပေးနိုင်သည့် စနစ် တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Database Transaction & State Machine (ステータス遷移の安全性)
- EC-CUBE တွင် Order Status ပြောင်းလဲခြင်းသည် Database Column တစ်ခုတည်းကို ပြောင်းလဲခြင်း မဟုတ်ပါ။
- ဥပမာ - "Cancel" ပြောင်းပါက စတော့များ ပြန်ဖြည့်ပေးရခြင်း (`StockService`)၊ "Shipped" ပြောင်းပါက ပို့ဆောင်သည့် ရက်စွဲ မှတ်သားရခြင်း စသည့် Side-effects များ ပါဝင်သည်။
- ထို့ကြောင့် `EntityManager` ၏ Transaction ဖြင့် အုပ်မိုးကာ စနစ်တကျ ပြောင်းလဲရမည်။

### 2. Service Class အဖြစ် ခွဲထုတ်ရေးသားရသည့် အကြောင်းပြချက်
- Controller ထဲတွင် Loop ပတ်ကာ Status ပြောင်းမည့်အစား `OrderBulkUpdateService` သီးသန့် ရေးသားခြင်းဖြင့် Admin Controller သာမက Batch Command များမှလည်း ပြန်လည် အသုံးပြုနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Bulk Status Update Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/OrderBulkUpdateService.php`

```php
<?php

namespace Customize\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Repository\Master\OrderStatusRepository;
use Eccube\Repository\OrderRepository;
use Eccube\Service\PurchaseFlow\PurchaseFlow;
use Psr\Log\LoggerInterface;

class OrderBulkUpdateService
{
    private EntityManagerInterface $entityManager;
    private OrderRepository $orderRepository;
    private OrderStatusRepository $orderStatusRepository;
    private PurchaseFlow $orderPurchaseFlow;
    private LoggerInterface $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        OrderRepository $orderRepository,
        OrderStatusRepository $orderStatusRepository,
        PurchaseFlow $orderPurchaseFlow,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->orderRepository = $orderRepository;
        $this->orderStatusRepository = $orderStatusRepository;
        $this->orderPurchaseFlow = $orderPurchaseFlow;
        $this->logger = $logger;
    }

    /**
     * 選択された複数の注文ステータスを一括変更する
     *
     * @param int[] $orderIds
     * @param int $newStatusId
     * @return array [ 'success_count' => int, 'fail_count' => int, 'errors' => array ]
     */
    public function updateBulkStatus(array $orderIds, int $newStatusId): array
    {
        $newStatus = $this->orderStatusRepository->find($newStatusId);
        if (!$newStatus) {
            return ['success_count' => 0, 'fail_count' => count($orderIds), 'errors' => ['指定されたステータスが存在しません。']];
        }

        $successCount = 0;
        $failCount = 0;
        $errors = [];

        $this->entityManager->beginTransaction();

        try {
            foreach ($orderIds as $orderId) {
                $order = $this->orderRepository->find($orderId);
                if (!$order) {
                    $failCount++;
                    continue;
                }

                $oldStatus = $order->getOrderStatus();
                $order->setOrderStatus($newStatus);

                // 発送済みに変更された場合は、発送日（commit_date）を自動記録
                if ($newStatusId === OrderStatus::DELIVERED) {
                    foreach ($order->getShippings() as $shipping) {
                        $shipping->setShippingDate(new \DateTime());
                    }
                }

                $this->entityManager->persist($order);
                $successCount++;
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            return [
                'success_count' => $successCount,
                'fail_count' => $failCount,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $this->logger->error('一括ステータス変更エラー: ' . $e->getMessage());

            return [
                'success_count' => 0,
                'fail_count' => count($orderIds),
                'errors' => ['処理中にエラーが発生しました: ' . $e->getMessage()],
            ];
        }
    }
}
```

---

### အဆင့် ၂: Admin Controller တွင် Action တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/Admin/OrderBulkActionController.php`

```php
<?php

namespace Customize\Controller\Admin;

use Customize\Service\OrderBulkUpdateService;
use Eccube\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/%eccube_admin_route%/order")
 * @IsGranted("ROLE_ADMIN")
 */
class OrderBulkActionController extends AbstractController
{
    private OrderBulkUpdateService $bulkUpdateService;

    public function __construct(OrderBulkUpdateService $bulkUpdateService)
    {
        $this->bulkUpdateService = $bulkUpdateService;
    }

    /**
     * @Route("/bulk-status-update", name="admin_order_bulk_status_update", methods={"POST"})
     */
    public function bulkStatusUpdate(Request $request): Response
    {
        $this->isTokenValid($request->get('_token'));

        $orderIds = $request->get('ids', []);
        $newStatusId = (int) $request->get('target_status_id');

        if (empty($orderIds)) {
            $this->addError('変更対象の受注が選択されていません。');
            return $this->redirectToRoute('admin_order');
        }

        $result = $this->bulkUpdateService->updateBulkStatus($orderIds, $newStatusId);

        if ($result['success_count'] > 0) {
            $this->addSuccess($result['success_count'] . ' 件の注文ステータスを正常に更新しました。');
        } else {
            $this->addError('ステータスの更新に失敗しました。');
        }

        return $this->redirectToRoute('admin_order');
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **CSRF Protection (トークン検証):**  
   Bulk Action ပြုလုပ်ရာတွင် `$this->isTokenValid($request->get('_token'))` ကို မဖြစ်မနေ စစ်ဆေးရပါမည်။ သို့မဟုတ်ပါက CSRF Vulnerability ဖြစ်ပေါ်စေနိုင်သည်။
2. **Mail Notification (通知メール送信):**  
   Status ကို "発送済み" (Shipped) သို့ ပြောင်းလဲချိန်တွင် Client အများစုသည် ဝယ်ယူသူများထံသို့ Shipping Completion Mail ကို တစ်ပြိုင်နက် ပို့လိုကြသည်။ အော်ဒါ ရာချီရှိပါက Mail Server Rate Limit ကြောင့် နှေးကွေးနိုင်သဖြင့် Queue/Background Worker ဖြင့် ပို့ဆောင်ရန် စီစဉ်သင့်သည်။
