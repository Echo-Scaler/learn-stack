---
title: "11. Service Class"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 11 - Service Class တည်ဆောက်နည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube တွင် Business Logic ကို Controller မှ ခွဲထုတ်ကာ Reusable Service Class များ တည်ဆောက်နည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Business Logic ကို Service Layer တွင် ထားသင့်ကြောင်း နားလည်ရန်
- Symfony's Dependency Injection ကို မှန်ကန်စွာ အသုံးပြုတတ်ရန်
- Real-world ဥပမာများဖြင့် Point, Coupon, Notification services တည်ဆောက်တတ်ရန်

---

## 📌 Service Layer ၏ အရေးပါမှု

```
❌ မမှန်ကန်သော နည်း (Controller ထဲတွင် Logic ထည့်ခြင်း)
Controller → Business Logic → Database

✅ မှန်ကန်သော နည်း
Controller → Service → Repository → Database
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Point Service တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Service/PointService.php`

```php
<?php

namespace Plugin\MyPlugin\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Customer;
use Eccube\Entity\Order;
use Plugin\MyPlugin\Entity\PointHistory;
use Plugin\MyPlugin\Repository\PointHistoryRepository;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class PointService
{
    // Point calculation rate: 注文金額の 1%
    private const EARN_RATE = 0.01;

    // Minimum point to use at once
    private const MIN_USE_POINTS = 100;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly PointHistoryRepository $pointHistoryRepository,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly LoggerInterface $logger,
    ) {}

    /**
     * Order ၏ Point ကို Calculate ပြုလုပ်ပါ (Pay မပြုမီ)
     */
    public function calculateEarnPoints(Order $order): int
    {
        $subtotal = $order->getSubtotal();
        return (int) floor($subtotal * self::EARN_RATE);
    }

    /**
     * Order ပြီးဆုံးသောအခါ Point ကို Customer account ထဲ ထည့်ပါ
     */
    public function earnPoints(Customer $customer, Order $order): int
    {
        $points = $this->calculateEarnPoints($order);

        if ($points <= 0) {
            return 0;
        }

        // Customer ၏ current points ကို update ပြုလုပ်ပါ
        $currentPoints = $customer->getPlgPoints() ?? 0;
        $customer->setPlgPoints($currentPoints + $points);

        // Point History record တည်ဆောက်ပါ
        $history = new PointHistory();
        $history->setCustomer($customer);
        $history->setOrder($order);
        $history->setPoints($points);
        $history->setType(PointHistory::TYPE_EARN);
        $history->setDescription(sprintf('注文 #%s によるポイント付与', $order->getNo()));
        $history->setCreatedAt(new \DateTime());

        $this->entityManager->persist($history);
        $this->entityManager->flush();

        $this->logger->info(sprintf(
            '[PointService] Customer #%d earned %d points from Order #%s',
            $customer->getId(),
            $points,
            $order->getNo()
        ));

        return $points;
    }

    /**
     * Point ကို Redeem (使用) ပြုလုပ်ပါ
     */
    public function usePoints(Customer $customer, Order $order, int $pointsToUse): bool
    {
        $currentPoints = $customer->getPlgPoints() ?? 0;

        // Validation
        if ($pointsToUse < self::MIN_USE_POINTS) {
            throw new \InvalidArgumentException(
                sprintf('%dポイント以上からご利用いただけます', self::MIN_USE_POINTS)
            );
        }

        if ($pointsToUse > $currentPoints) {
            throw new \InvalidArgumentException('ポイントが不足しています');
        }

        // Customer ₅ Points ကို Deduct ပြုလုပ်ပါ
        $customer->setPlgPoints($currentPoints - $pointsToUse);

        // Order discount ကို apply ပြုလုပ်ပါ (1 point = 1 yen)
        $currentDiscount = $order->getDiscount() ?? 0;
        $order->setDiscount($currentDiscount + $pointsToUse);
        $order->setPaymentTotal($order->getPaymentTotal() - $pointsToUse);

        // History record
        $history = new PointHistory();
        $history->setCustomer($customer);
        $history->setOrder($order);
        $history->setPoints(-$pointsToUse); // Negative = usage
        $history->setType(PointHistory::TYPE_USE);
        $history->setDescription(sprintf('注文 #%s でのポイント利用', $order->getNo()));
        $history->setCreatedAt(new \DateTime());

        $this->entityManager->persist($history);
        $this->entityManager->flush();

        return true;
    }

    /**
     * Customer ၏ Point Balance ရယူပါ
     */
    public function getBalance(Customer $customer): int
    {
        return $customer->getPlgPoints() ?? 0;
    }

    /**
     * Customer ၏ Point History ရယူပါ
     */
    public function getHistory(Customer $customer, int $limit = 20): array
    {
        return $this->pointHistoryRepository->findBy(
            ['Customer' => $customer],
            ['created_at' => 'DESC'],
            $limit
        );
    }
}
```

---

### အဆင့် 2 - Coupon Service တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Service/CouponService.php`

```php
<?php

namespace Plugin\MyPlugin\Service;

use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Customer;
use Eccube\Entity\Order;
use Plugin\MyPlugin\Entity\Coupon;
use Plugin\MyPlugin\Repository\CouponRepository;

class CouponService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CouponRepository $couponRepository,
    ) {}

    /**
     * Coupon Code ကို Validate ပြုလုပ်ပါ
     */
    public function validateCoupon(string $code, Customer $customer, Order $order): array
    {
        $result = ['valid' => false, 'message' => '', 'coupon' => null, 'discount' => 0];

        // Coupon ရှာပါ
        $coupon = $this->couponRepository->findOneBy(['code' => $code]);

        if (!$coupon) {
            $result['message'] = 'クーポンコードが見つかりません';
            return $result;
        }

        // Expired စစ်ဆေးပါ
        if ($coupon->getExpiresAt() && $coupon->getExpiresAt() < new \DateTime()) {
            $result['message'] = 'このクーポンは有効期限が切れています';
            return $result;
        }

        // Usage limit စစ်ဆေးပါ
        if ($coupon->getMaxUses() && $coupon->getUsedCount() >= $coupon->getMaxUses()) {
            $result['message'] = 'このクーポンはご利用上限に達しています';
            return $result;
        }

        // Minimum order amount စစ်ဆေးပါ
        if ($coupon->getMinOrderAmount() && $order->getSubtotal() < $coupon->getMinOrderAmount()) {
            $result['message'] = sprintf(
                '%s以上のご注文でご利用いただけます',
                number_format($coupon->getMinOrderAmount()) . '円'
            );
            return $result;
        }

        // Discount ကို Calculate ပြုလုပ်ပါ
        $discount = 0;
        if ($coupon->getDiscountType() === 'fixed') {
            $discount = $coupon->getDiscountAmount();
        } elseif ($coupon->getDiscountType() === 'percent') {
            $discount = (int) floor($order->getSubtotal() * $coupon->getDiscountAmount() / 100);
        }

        $result['valid']   = true;
        $result['coupon']  = $coupon;
        $result['discount'] = $discount;

        return $result;
    }

    /**
     * Coupon ကို Order ထဲ Apply ပြုလုပ်ပါ
     */
    public function applyCoupon(Coupon $coupon, Order $order): void
    {
        // Coupon used count ကို increment ပြုလုပ်ပါ
        $coupon->setUsedCount($coupon->getUsedCount() + 1);

        // Order ၏ memo ထဲ coupon code ထည့်ပါ
        $order->setNote('[Coupon: ' . $coupon->getCode() . '] ' . $order->getNote());

        $this->entityManager->flush();
    }
}
```

---

### အဆင့် 3 - Notification Service တည်ဆောက်ခြင်း

`app/Plugin/MyPlugin/Service/NotificationService.php`

```php
<?php

namespace Plugin\MyPlugin\Service;

use Eccube\Entity\Customer;
use Eccube\Entity\Order;

class NotificationService
{
    public function __construct(
        private readonly \Swift_Mailer $mailer,
        private readonly \Twig\Environment $twig,
    ) {}

    /**
     * Low Stock Notification ကို Admin ထဲ ပို့ပါ
     */
    public function notifyLowStock(array $products, string $adminEmail): void
    {
        $body = $this->twig->render('@MyPlugin/Mail/low_stock_notification.twig', [
            'Products' => $products,
        ]);

        $message = (new \Swift_Message())
            ->setSubject('[在庫アラート] 在庫が少ない商品があります')
            ->setFrom('noreply@example.com')
            ->setTo($adminEmail)
            ->setBody($body, 'text/html');

        $this->mailer->send($message);
    }

    /**
     * New Order Notification ကို Slack webhook မှတဆင့် ပို့ပါ
     */
    public function notifySlack(Order $order, string $webhookUrl): void
    {
        $message = sprintf(
            "🛒 新規注文が入りました！\n" .
            "注文番号: %s\n" .
            "金額: %s円\n" .
            "お客様: %s %s",
            $order->getNo(),
            number_format($order->getPaymentTotal()),
            $order->getName01(),
            $order->getName02()
        );

        $payload = json_encode(['text' => $message]);

        // cURL ဖြင့် Slack webhook ကို POST ပြုလုပ်ပါ
        $ch = curl_init($webhookUrl);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_exec($ch);
        curl_close($ch);
    }
}
```

---

### အဆင့် 4 - Service ကို Controller ထဲ Inject ပြုလုပ်ခြင်း

```php
<?php

namespace Plugin\MyPlugin\Controller\Front;

use Eccube\Controller\AbstractController;
use Plugin\MyPlugin\Service\PointService;
use Plugin\MyPlugin\Service\CouponService;
use Symfony\Component\Routing\Annotation\Route;

class MyPageController extends AbstractController
{
    public function __construct(
        private readonly PointService $pointService,
        private readonly CouponService $couponService,
    ) {}

    /**
     * @Route("/mypage/points", name="my_plugin_mypage_points")
     */
    public function points(): \Symfony\Component\HttpFoundation\Response
    {
        $customer = $this->getUser();
        
        $balance = $this->pointService->getBalance($customer);
        $history = $this->pointService->getHistory($customer);

        return $this->render('@MyPlugin/Mypage/points.twig', [
            'Balance' => $balance,
            'History' => $history,
        ]);
    }
}
```

---

### အဆင့် 5 - Symfony Console Command တည်ဆောက်ခြင်း

Cron job ဖြင့် run မည့် Command Service:

`app/Plugin/MyPlugin/Command/NotifyLowStockCommand.php`

```php
<?php

namespace Plugin\MyPlugin\Command;

use Eccube\Repository\ProductClassRepository;
use Plugin\MyPlugin\Service\NotificationService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'my-plugin:notify-low-stock')]
class NotifyLowStockCommand extends Command
{
    private const LOW_STOCK_THRESHOLD = 5;

    public function __construct(
        private readonly ProductClassRepository $productClassRepository,
        private readonly NotificationService $notificationService,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setDescription('在庫が少ない商品をAdminに通知します');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('在庫チェック開始...');

        // 在庫が少ない商品を検索
        $lowStockProducts = $this->productClassRepository->createQueryBuilder('pc')
            ->where('pc.stock <= :threshold')
            ->andWhere('pc.stock_unlimited = false')
            ->setParameter('threshold', self::LOW_STOCK_THRESHOLD)
            ->getQuery()
            ->getResult();

        if (empty($lowStockProducts)) {
            $output->writeln('在庫不足の商品はありません');
            return Command::SUCCESS;
        }

        $output->writeln(sprintf('%d件の在庫不足商品があります', count($lowStockProducts)));

        $this->notificationService->notifyLowStock(
            $lowStockProducts,
            'admin@example.com'
        );

        $output->writeln('通知メールを送信しました');

        return Command::SUCCESS;
    }
}
```

**Cron ဖြင့် Daily run ပြုလုပ်ပါ**:
```cron
# Crontab entry - 毎朝8時に実行
0 8 * * * /path/to/ec-cube/bin/console my-plugin:notify-low-stock
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] Service class ကို Symfony DI container မှ resolve ပြုလုပ်နိုင်ကြောင်း
- [ ] Unit test ရေးသားပြီးကြောင်း (`phpunit`)
- [ ] Console command register ဖြစ်ကြောင်း (`bin/console list`)
- [ ] Service logic ကို Controller ထဲ ရောနှောမထားကြောင်း

---

## 🐛 Debug - Service Container

```bash
# Service ကို container ထဲ ရှိကြောင်း စစ်ဆေးပါ
bin/console debug:container Plugin\\MyPlugin\\Service\\PointService

# Console commands စစ်ဆေးပါ
bin/console list my-plugin
```

---

> ➡️ **နောက်တစ်ဆင့်**: [12 - Security & Access Control](/eccube/customization-list/12_security_access_control/)
