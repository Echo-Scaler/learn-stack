---
title: "04. Customer Segmentation And Marketing Automation"
description: "LINE စာတိုများကို လူတိုင်းထံသို့ စည်းမဲ့ကမ်းမဲ့ အမြဲတမ်း ပို့နေပါက Block Rate (ブロック率 - ဖောက်သည်များက Account ကို Block ပစ်ခြင်း) အလွန်မြင့်မားသွားပြီး LINE Mess"
---

## 04. Customer Segmentation & Marketing Automation (MA・ステップ配信)

LINE စာတိုများကို လူတိုင်းထံသို့ စည်းမဲ့ကမ်းမဲ့ အမြဲတမ်း ပို့နေပါက **Block Rate (ブロック率 - ဖောက်သည်များက Account ကို Block ပစ်ခြင်း)** အလွန်မြင့်မားသွားပြီး LINE Message စရိတ်များလည်း ကုန်ကျစေပါသည်။ 

ဤဖိုင်တွင် ဖောက်သည်များကို အုပ်စုခွဲခြင်း (**Customer Segmentation**) နှင့် အလိုအလျောက် အချိန်ကိုက် စာပို့ပေးသော **Marketing Automation (MA)** စနစ် တည်ဆောက်ပုံကို လေ့လာပါမည်။

---

## 🎯 Customer Segmentation (ဖောက်သည် အုပ်စု ခွဲခြားခြင်း)

### RFM မော်ဒယ်ဖြင့် အုပ်စုခွဲခြားခြင်း:
1. **Recency (R)**: မကြာသေးမီက ဝယ်ယူခဲ့မှု (ဥပမာ ရက်ပေါင်း ၃၀ အတွင်း ဝယ်ထားသူများ)။
2. **Frequency (F)**: ဝယ်ယူခဲ့သည့် အကြိမ်အရေအတွက် (ဥပမာ ၃ ကြိမ်နှင့်အထက် ဝယ်ဖူးသော VIP ဖောက်သည်များ)။
3. **Monetary (M)**: သုံးစွဲခဲ့သည့် စုစုပေါင်း ငွေပမာဏ (ဥပမာ ၅၀,၀၀၀ ယန်းနှင့်အထက်)။

### QueryBuilder ဖြင့် အိပ်ပျော်နေသော ဖောက်သည်များ (Dormant Customers) ကို ရွေးထုတ်ခြင်း:
လွန်ခဲ့သော ရက်ပေါင်း ၆၀ နှင့် ၁၈၀ ကြားတွင် ဝယ်ယူဖူးသော်လည်း ယခုအချိန်အထိ နောက်ထပ် ပြန်မဝယ်သေးသော ဖောက်သည်များကို ကူပွန်ဖြင့် ပြန်လည် ဆွဲဆောင်ရန် Query နမူနာ:

```php
namespace Customize\Repository;

use Eccube\Repository\CustomerRepository;

class CustomerMarketingRepository extends CustomerRepository
{
    /**
     * ရက်ပေါင်း ၆၀ မှ ၁၈၀ အတွင်း ပြန်မဝယ်သေးသော LINE ချိတ်ဆက်ပြီးသား ဖောက်သည်များကို ရှာဖွေခြင်း
     */
    public function findDormantLineCustomers(\DateTime $startDate, \DateTime $endDate): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.line_user_id', 'c.name01', 'MAX(o.order_date) as last_order_date')
            ->innerJoin('Eccube\Entity\Order', 'o', 'WITH', 'o.Customer = c')
            ->where('c.line_user_id IS NOT NULL')
            ->andWhere('o.OrderStatus = 5') // 5 = 購入完了 (Order Completed)
            ->groupBy('c.id')
            ->having('MAX(o.order_date) BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->getQuery()
            ->getResult();
    }
}
```

---

## 🤖 Marketing Automation (အလိုအလျောက် ဈေးကွက်ရှာဖွေရေး)

### အဓိက အလိုအလျောက် စနစ် ၃ မျိုး:

```
[1. ကုန်ပစ္စည်း ခြင်းတောင်းထဲ ထားခဲ့ခြင်း (カゴ落ち)]
   ဖောက်သည် ပစ္စည်း Cart ထဲထည့်ပြီး ၂၄ နာရီအတွင်း မဝယ်ဘဲ ထွက်သွားပါက LINE အလိုအလျောက် သတိပေးခြင်း။
          ↓
[2. အဆင့်ဆင့် စာတိုပို့ခြင်း (ステップ配信)]
   ပစ္စည်း ပို့ပြီး ၃ ရက်မြောက် ➔ "ပစ္စည်း ရောက်ရှိပါပြီလား? အသုံးပြုပုံ လမ်းညွှန်"
   ပစ္စည်း ပို့ပြီး ၁၄ ရက်မြောက် ➔ "သုံးစွဲရတာ ကြိုက်နှစ်သက်ပါက Review ရေးပြီး Point 200 ရယူပါ"
   ပစ္စည်း ပို့ပြီး ၃၀ ရက်မြောက် ➔ "ကုန်ခါနီးပြီလား? ၁၀% လျှော့ဈေးဖြင့် ထပ်မံမှာယူနိုင်ပါသည်"
          ↓
[3. မွေးနေ့ ကူပွန် ပေးပို့ခြင်း (お誕生日クーポン)]
   မွေးနေ့လဆန်း ၁ ရက်နေ့ နံနက်တွင် မွေးနေ့ရှင်များထံ အလိုအလျောက် ကူပွန် ပို့ဆောင်ခြင်း။
```

---

## 🛒 လက်တွေ့ အကောင်အထည်ဖော်ပုံ: ကုန်ပစ္စည်း ခြင်းတောင်းထဲ ထားခဲ့ခြင်း (カゴ落ち Cron Job)

EC-CUBE ၏ `dtb_cart` နှင့် `dtb_cart_item` ကို စစ်ဆေးပြီး ပစ္စည်းမဝယ်ဘဲ ကျန်ခဲ့သော Customer ထံသို့ LINE သတိပေးချက် ပို့ပေးသည့် Symfony Console Command ဖြစ်ပါသည်:

```php
namespace Customize\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\ORM\EntityManagerInterface;
use Customize\Service\LineNotificationService;

class CartAbandonmentReminderCommand extends Command
{
    protected static $defaultName = 'eccube:marketing:cart-reminder';

    private EntityManagerInterface $entityManager;
    private LineNotificationService $lineService;

    public function __construct(EntityManagerInterface $entityManager, LineNotificationService $lineService)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->lineService = $lineService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('<info>Checking for abandoned carts...</info>');

        // လွန်ခဲ့သော ၂၄ နာရီနှင့် ၂၅ နာရီကြားက Cart ထဲ ပစ္စည်းထည့်ထားပြီး မဝယ်ရသေးသော LINE အသုံးပြုသူများကို ရှာဖွေခြင်း
        $qb = $this->entityManager->createQueryBuilder();
        $carts = $qb->select('c')
            ->from('Eccube\Entity\Cart', 'c')
            ->innerJoin('c.Customer', 'cust')
            ->where('cust.line_user_id IS NOT NULL')
            ->andWhere('c.update_date BETWEEN :timeStart AND :timeEnd')
            ->setParameter('timeStart', (new \DateTime())->modify('-25 hours'))
            ->setParameter('timeEnd', (new \DateTime())->modify('-24 hours'))
            ->getQuery()
            ->getResult();

        foreach ($carts as $cart) {
            $customer = $cart->getCustomer();
            $lineUserId = $customer->getLineUserId();

            $message = sprintf(
                "【お買い忘れはございませんか？】\n%s 様、ショッピングカートに商品が残っております。\n人気商品は在庫がなくなる可能性がございますので、お早めにご確認ください。\n\n🛒 カートを見る:\nhttps://your-store.com/cart?utm_source=line&utm_medium=cart_abandonment",
                $customer->getName01()
            );

            $this->lineService->sendCustomPushText($lineUserId, $message);
            $output->writeln("Sent reminder to customer: " . $customer->getId());
        }

        $output->writeln('<info>Cart reminder job completed successfully.</info>');
        return Command::SUCCESS;
    }
}
```

### Linux Crontab တွင် သတ်မှတ်ခြင်း:
နာရီတိုင်း အလိုအလျောက် စစ်ဆေးနိုင်ရန် Server Crontab တွင် ရေးသွင်းထားပါသည်:
```bash
0 * * * * bin/console eccube:marketing:cart-reminder >> var/log/cron_marketing.log 2>&1
```

ဤနည်းအားဖြင့် မဝယ်ဘဲ ထွက်သွားကြသော ဖောက်သည်များထံမှ ၁၀% မှ ၂၀% အထိ ဆုံးရှုံးသွားမည့် အရောင်းအခွင့်အလမ်းများကို အလိုအလျောက် ပြန်လည် ရယူပေးနိုင်မည် ဖြစ်ပါသည်။
